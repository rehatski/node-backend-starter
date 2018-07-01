const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const io = require('socket.io')
const dotenv = require('dotenv')
const passport = require('passport')


const app = express()
const server = http.createServer(app)
const router = express.Router()
const logger = require('./tools/logger')
io.listen(server)
dotenv.config()

app.use(passport.initialize())

// TODO: Create a middle ware file
// adds io to request for routes to use
app.use(function (req, res, next) {
    req.io = io
    next()
})

logger.info(process.env.JWT_SECRET)

// TODO: Look Into https://stackoverflow.com/questions/27906551/node-js-logging-use-morgan-and-winston
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(bodyParser.json())
app.engine('html', require('ejs').renderFile) // TODO: change to a popular template engine
app.set('view engine', 'html')
app.set('views', __dirname + '/views')


const middleware = require('./middleware/passport')
app.use(require(__dirname + '/routes'))


server.listen('4200')
