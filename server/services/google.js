const language = require('@google-cloud/language')

const client = new language.LanguageServiceClient()

const GoogleNatural = async content => {
	const document = {
		content,
		type: 'PLAIN_TEXT'
	}
	let sentiment
	try {
		let [result] = await client.analyzeSentiment({ document: document })
		sentiment = result.documentSentiment
	} catch (e) {
		console.log(e)
		return { score: 0 }
	}

	return sentiment
}

module.exports = GoogleNatural
