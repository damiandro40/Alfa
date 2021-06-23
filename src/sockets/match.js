const { getAllUsers, attachKeywords, removeNonpriorUsers, removePriorUsers, sortPriorUsersByKeywords, checkMatchedUser, matchTwoUsers } = require('../services/MatchService')

const match = (socket, io, payload) => {
    if(socket.appData.stranger) return
    if(!socket.appData.matchable) socket.appData.matchable = true
    socket.appData.matchCount++
    attachKeywords(io, socket.id, payload)

    let users = getAllUsers(io, socket.id)

    if(socket.appData.keywords.length > 0 && socket.appData.matchCount <= 10) {
        users = removeNonpriorUsers(users)
        users = sortPriorUsersByKeywords(users, socket.appData.keywords)
    } 

    if(socket.appData.keywords.length === 0) {
        users = removePriorUsers(users)
    }

    if(users.length === 0) return socket.emit('match', null)

    for(let user of users) {
        if(!socket.appData.matchable) return
        if(!checkMatchedUser(io, user.id)) continue

        matchTwoUsers(io, socket.id, user.id)

        socket.emit('match', { id: user.id, keywords: user.appData.keywords })
        return socket.to(user.id).emit('match', { id: socket.id, keywords: socket.appData.keywords })
    }

    socket.emit('match', null)
} 

module.exports = match