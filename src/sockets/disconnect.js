const disconnect = (socket, io) => {
    if(!socket.appData.stranger) return

    const stranger = socket.appData.stranger
    
    const response = {
        initializer: socket.id,
        terminator: socket.appData.stranger,
        isDc: true,
        date: Date.now()
    }

    io.of('/').sockets.get(stranger).appData.stranger = ''

    socket.to(stranger).emit('terminate', response)
}

module.exports = disconnect