const Firestore = require('@google-cloud/firestore')

const firestore = new Firestore({
	projectId: 'cab432-a2',
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
})

module.exports = firestore
