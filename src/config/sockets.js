const { Server } = require('socket.io')
const fs = require('fs')
const path = require('path')

const initializeSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    })

    io.on('connection', (socket) => {

        socket.appData = {
            stranger: '',
            prevStranger: '',
            matchable: false,
            matchCount: 0,
            keywords: [],
            joinDate: Date.now()
        }

        socket.emit('sid', socket.id)

        fs.readdirSync(path.join(__dirname, '../sockets')).forEach((file) => {
            socket.on(file.slice(0, -3), (payload) => {
                require(path.join(__dirname, `../sockets/${file}`))(socket, io, payload)
            })
        })

    })
}

module.exports = initializeSockets