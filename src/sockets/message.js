const message = (socket, io, payload) => {
    if(socket.appData.matchable || !socket.appData.stranger) return
    if(typeof payload !== 'object') return
    if(typeof payload.content !== 'string') return
    if(payload.content.length > 640 || payload.content.length === 0) return

    const response = {
        initializer: socket.id,
        terminator: socket.appData.stranger,
        content: payload.content,
        date: Date.now()
    }

    if(payload.tail) {
        response.tail = payload.tail
    }

    socket.emit('message', response)
    socket.to(socket.appData.stranger).emit('message', response)
}

module.exports = message