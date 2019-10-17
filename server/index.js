const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const redis = require('redis')

// Config
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

// Redis
const redisClient = redis.createClient({
	host: 'redis-service',
	port: 6379,
	retry_strategy: () => 1000
})

// Routes
require('./routes/twitter')(app, redisClient)

// Startup
const PORT = process.env.PORT || 8080
app.listen(PORT)
