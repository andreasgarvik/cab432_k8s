const language = require('@google-cloud/language')
const nlp = require('compromise')

const client = new language.LanguageServiceClient()

const GoogleNatural = async text => {
	const content = nlp(text)
		.normalize()
		.out('text')

	const document = {
		content,
		type: 'PLAIN_TEXT'
	}
	const [result] = await client.analyzeSentiment({ document: document })
	const sentiment = result.documentSentiment

	console.log(`Text: ${content}`)
	console.log(`Sentiment score: ${sentiment.score}`)
	console.log(`Sentiment magnitude: ${sentiment.magnitude}`)
}

module.exports = GoogleNatural
