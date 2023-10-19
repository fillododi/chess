export const sendGameList = (connection, games) => {
    let gameList = []
    Object.keys(games).forEach(gameId => {
        const game = games[gameId]
        if(game.players.length === 1) {
            const playerInGame = game.players[0]
            gameList.push({
                "gameId": gameId,
                "player": playerInGame
            })
        }
    })
    const payload = {
        "method": "getGames",
        "games": gameList
    }
    connection.send(JSON.stringify(payload))
}
export const broadcastGameList = (clients, games) => {
    const connectionsList = Object.keys(clients).map(clientId => {
        return clients[clientId].connection
    })

    connectionsList.forEach(connection => sendGameList(connection, games))
}