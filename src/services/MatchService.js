const getAllUsers = (io, id) => {
    const usersMap = io.of('/').sockets
    const usersArray = Array.from(usersMap, ([id, value]) => ({ id, appData: value.appData })).filter(u => u.appData.matchable === true)
    const matchingUser = usersArray.find(u => u.id === id)
    usersArray.splice(usersArray.indexOf(matchingUser), 1)

    if(matchingUser.appData.prevStranger && usersArray.length > 1) {
        const prevStranger = usersArray.find(u => u.id === matchingUser.appData.prevStranger)
        if(prevStranger) {
            usersArray.splice(usersArray.indexOf(prevStranger), 1)
        }
    }

    return usersArray
}

const attachKeywords = (io, id, keywords) => {
    if(!keywords) return
    if(!Array.isArray(keywords)) return
    if(!keywords.length === 0) return

    const user = io.of('/').sockets.get(id)
    const keywordsString = keywords.join('__')
    const userKeywordsString = user.appData.keywords.join('__')

    if(keywordsString === userKeywordsString) return

    io.of('/').sockets.get(id).appData.keywords.length = 0

    for(i = 0; i < 5; i++) {
        const keyword = keywords[i]
        if(typeof keyword === 'undefined') break
        io.of('/').sockets.get(id).appData.keywords.push(keyword.toLowerCase())
    } 
}

const removePriorUsers = (users) => {
    const nonpriorUsers = users.filter(u => u.appData.keywords.length === 0 || u.appData.matchCount > 10)
    return nonpriorUsers
}

const removeNonpriorUsers = (users) => {
    const priorUsers = users.filter(u => u.appData.keywords.length > 0)
    return priorUsers
}

const sortPriorUsersByKeywords = (users, keywords) => {
    for(let user of users) {
        let num = 0
        for(let keyword of keywords) {
            if(user.appData.keywords.includes(keyword)) num++
        }
        user.priorIndex = num
    }

    const sortedPriorUsers = users.sort((a, b) => b.priorIndex - a.priorIndex)
    return sortedPriorUsers
}

const checkMatchedUser = (io, id) => {
    const matchedUser = io.of('/').sockets.get(id)
    if(!matchedUser) return false
    if(!matchedUser.appData.matchable) return false
    return true
}

const matchTwoUsers = (io, matchingId, matchedId) => {
    io.of('/').sockets.get(matchingId).appData.matchable = false
    io.of('/').sockets.get(matchingId).appData.stranger = matchedId
    io.of('/').sockets.get(matchingId).appData.matchCount = 0
    io.of('/').sockets.get(matchedId).appData.matchable = false
    io.of('/').sockets.get(matchedId).appData.stranger = matchingId
    io.of('/').sockets.get(matchedId).appData.matchCount = 0
}


module.exports = { getAllUsers, attachKeywords, removePriorUsers, removeNonpriorUsers, sortPriorUsersByKeywords, checkMatchedUser, matchTwoUsers }