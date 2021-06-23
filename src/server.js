const express = require('express')
const cookies = require('cookie-parser')
const useragent = require('express-useragent')
const initializeSockets = require('./config/sockets')
require('dotenv/config')

const app = express()

app.use(express.json({ limit: '10kb' }))
app.use(cookies())
app.use(useragent.express())

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Listening has been set to port ${port}.`)
})

initializeSockets(server)



