const request = require('request')
const util = require('util')
const keys = require('../config/keys')
const GoogleNatural = require('../services/google')
const db = require('../db/firestore')
const Sentiment = require('sentiment')
const nlp = require('compromise')

const get = util.promisify(request.get)
const post = util.promisify(request.post)

const sentiment = new Sentiment()

const bearerTokenURL = 'https://api.twitter.com/oauth2/token'
const streamURL =
	'https://api.twitter.com/labs/1/tweets/stream/filter?format=compact'
const rulesURL = 'https://api.twitter.com/labs/1/tweets/stream/filter/rules'

const bearerToken = async () => {
	const requestConfig = {
		url: bearerTokenURL,
		auth: {
			user: keys.TWITTERAPIKEY,
			pass: keys.TWITTERAPISECRET
		},
		form: {
			grant_type: 'client_credentials'
		}
	}

	const response = await post(requestConfig)
	return JSON.parse(response.body).access_token
}

const getAllRules = async token => {
	const requestConfig = {
		url: rulesURL,
		auth: {
			bearer: token
		}
	}

	const response = await get(requestConfig)

	if (response.statusCode !== 200) {
		throw new Error(response.body)
	}

	return JSON.parse(response.body)
}

const deleteAllRules = async (rules, token) => {
	if (!Array.isArray(rules.data)) {
		return null
	}

	const ids = rules.data.map(rule => rule.id)

	const requestConfig = {
		url: rulesURL,
		auth: {
			bearer: token
		},
		json: {
			delete: {
				ids: ids
			}
		}
	}

	const response = await post(requestConfig)

	if (response.statusCode !== 200) {
		throw new Error(JSON.stringify(response.body))
	}

	return response.body
}

const setRules = async (rules, token) => {
	const requestConfig = {
		url: rulesURL,
		auth: {
			bearer: token
		},
		json: {
			add: rules
		}
	}

	const response = await post(requestConfig)

	if (response.statusCode !== 201) {
		throw new Error(JSON.stringify(response.body))
	}

	return response.body
}

const streamConnect = token => {
	const config = {
		url: streamURL,
		auth: {
			bearer: token
		},
		timeout: 20000
	}

	const stream = request.get(config)

	stream.on('error', error => {
		if (error.code === 'ETIMEDOUT') {
			stream.emit('timeout')
		}
	})

	return stream
}

const startStream = async rules => {
	let token

	try {
		token = await bearerToken()
	} catch (e) {
		console.error(e)
	}

	try {
		currentRules = await getAllRules(token)
		await deleteAllRules(currentRules, token)
		await setRules(rules, token)
	} catch (e) {
		console.error(e)
	}

	let stream = streamConnect(token)
	let timeout = 0
	stream.on('timeout', () => {
		console.warn('A connection error occurred. Reconnecting…')
		setTimeout(() => {
			timeout++
			stream = streamConnect(token)
		}, 2 ** timeout)
		stream = streamConnect(token)
	})

	return stream
}

module.exports = (app, redis) => {
	app.get('/connect', async (req, res) => {
		let tweets = []
		let q = req.query.q
		if (!/^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/.test(q)) {
			res.send({ error: 'Not valid search term' })
		} else {
			redis.hset('searchterms', q, q)
			await db
				.collection('searchterms')
				.doc(q)
				.set({
					searchterm: q
				})
			let rules = [{ value: `"${q}" lang:en`, tag: q }]
			let stream = await startStream(rules)
			stream.on('data', async data => {
				if (tweets.length < 100) {
					if (data.length > 2) {
						let t
						try {
							t = JSON.parse(data)
						} catch (e) {
							console.log(e)
							t.connection_issue = 'Parsing Error'
						}
						if (!t.connection_issue) {
							tweets.push(t.data)
						} else {
							stream.abort()
							tweets = tweets.map(tweet => tweet.text)
							const doc = await db
								.collection('tweets')
								.where('searchterm', '==', q)
								.get()

							doc.forEach(doc => {
								if (tweets.length < 100) {
									tweets.push(doc.data().text)
								}
							})
							let result = []
							await Promise.all(
								tweets.map(async tweet => {
									let s = sentiment.analyze(tweet)
									let g = await GoogleNatural(tweet)
									let t = nlp(tweet)
										.topics()
										.data()
									let obj = {
										score: s,
										google: g,
										topics: t,
										searchterm: q,
										text: tweet
									}
									result.push(obj)
								})
							)
							if (result.length > 0) {
								res.send({ result })
							} else {
								res.send({
									error: 'Connection error, try one of the already searched'
								})
							}
						}
					}
				} else {
					stream.abort()
					if (tweets.length > 0) {
						let result = []
						await Promise.all(
							tweets.map(async tweet => {
								let s = sentiment.analyze(tweet.text)
								let g = await GoogleNatural(tweet.text)
								let t = nlp(tweet.text)
									.topics()
									.data()
								let obj = {
									score: s,
									google: g,
									topics: t,
									searchterm: q,
									text: tweet.text
								}
								result.push(obj)
								await db
									.collection('tweets')
									.doc(tweet.id)
									.set(obj)
							})
						)
						res.send({ result })
					} else {
						res.send({
							error: 'Connection error, try one of the already searched'
						})
					}
				}
			})
		}
	})

	app.get('/searched', async (req, res) => {
		redis.hgetall('searchterms', async (err, values) => {
			let all = []
			if (!values) {
				let data = await db.collection('searchterms').get()
				data.forEach(doc => {
					let q = doc.data().searchterm
					all = [...all, q]
					redis.hset('searchterms', q, q)
				})
			} else {
				Object.keys(values).forEach(doc => (all = [...all, doc]))
			}
			res.send(all)
		})
	})
}
