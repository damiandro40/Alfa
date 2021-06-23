const isTyping = (socket, io, payload) => {
    if(socket.appData.matchable || !socket.appData.stranger) return

    const response = {
        initializer: socket.id,
        terminator: socket.appData.stranger,
        date: Date.now()
    }

    if(typeof payload === 'object' && payload.tail) {
        response.tail = payload.tail
    }

    socket.to(socket.appData.stranger).emit('isTyping', response)
}

module.exports = isTyping