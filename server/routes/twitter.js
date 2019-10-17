const request = require('request')
const util = require('util')
const keys = require('../config/keys')
const GoogleNatural = require('../services/google')

const get = util.promisify(request.get)
const post = util.promisify(request.post)

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

const getCurrentRules = async token => {
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

const deleteCurrentRules = async (rules, token) => {
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
	let stream
	const tweets = []

	app.get('/connect', async (req, res) => {
		const q = req.query.q
		redis.hset('searchterms', q, q)
		res.end()
		/*
		 const rules = [{ value: `${q} lang:en`, tag: 'english' }]
		stream = await startStream(rules)
		stream.on('data', data => {
			if (data.length > 2) {
				const t = JSON.parse(data)
				if (t.connection_issue === 'TooManyConnections') {
					res.send({ error: t.connection_issue })
				} else {
					tweets.push(t.data)
					res.end()
				}
			}
		}) */
	})

	app.get('/disconnect', (req, res) => {
		if (stream) {
			if (!stream.aborted) {
				stream.abort()
			}
		}
		res.send(tweets)
	})

	app.get('/analyse', async (req, res) => {
		result = await GoogleNatural(tweets[0].text)
		res.send(result)
	})

	app.get('/searched', async (req, res) => {
		redis.hgetall('searchterms', (err, values) => {
			res.send(values)
		})
	})
}
