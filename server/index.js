const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { path: '/api' })
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')

// Config
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

// Routes
require('./routes/twitter')(app, io)

// Startup
const PORT = process.env.PORT || 8080
server.listen(PORT)
