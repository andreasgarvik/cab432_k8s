const language = require('@google-cloud/language')

const client = new language.LanguageServiceClient()

const GoogleNatural = async content => {
	const document = {
		content,
		type: 'PLAIN_TEXT'
	}
	const [result] = await client.analyzeSentiment({ document: document })
	const sentiment = result.documentSentiment

	return sentiment
}

module.exports = GoogleNatural
