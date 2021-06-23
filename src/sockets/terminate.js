const terminate = (socket, io, payload) => {
    if(socket.appData.matchable) return socket.appData.matchable = false

    if(!socket.appData.stranger) return

    const stranger = socket.appData.stranger
    
    const response = {
        initializer: socket.id,
        terminator: stranger,
        isDc: false,
        date: Date.now()
    }

    if(payload.tail) {
        response.tail = payload.tail
    }

    socket.appData.prevStranger = stranger
    socket.appData.stranger = ''
    io.of('/').sockets.get(stranger).appData.prevStranger = socket.id
    io.of('/').sockets.get(stranger).appData.stranger = ''

    socket.emit('terminate', response)
    socket.to(stranger).emit('terminate', response)
}

module.exports = terminate