const http = require("http")
const webSocketServer = require("websocket").server
const httpServer = http.createServer()
const app = require("express")()

app.get("/", (req, res)=>res.sendFile(__dirname + "/client.html"))
app.listen(5001, ()=>console.log("Server listening on port 5001"))

httpServer.listen(5000, ()=>{console.log("Server listening on port 5000")})

const clients = {}
const games = {}

const wsServer = new webSocketServer({
    "httpServer": httpServer
})
wsServer.on("request", request => {
    const connection = request.accept(null, request.origin)
    connection.on("open", ()=>console.log("opened"))
    connection.on("close", ()=>console.log("closed"))
    connection.on("message", message=> {
        const result = JSON.parse(message.utf8Data)
        if(result.method === "create") {
            const clientId = result.clientId
            const gameId = guid()
            games[gameId] = {
                "id": gameId,
                "clients": []
            }
            const payload = {
                "method": "create",
                "gameId": gameId
            }
            const connection = clients[clientId].connection
            connection.send(JSON.stringify(payload))
        }
        if(result.method === "join") {
            const clientId = result.clientId
            const gameId = result.gameId
            const game = games[gameId]
            if(game.clients.length > 1){
                return
            } else {
                game.clients.push({
                    "clientId": clientId,
                })
                const payload = {
                    "method": "join",
                    "game": game
                }
                game.clients.forEach(client => {
                    console.log(client)
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
            }
        }
    })

    const clientId = guid()
    console.log(clientId)
    clients[clientId] = {
        "connection": connection
    }

    const payload = {
        "method": "connect",
        "clientId": clientId
    }

    connection.send(JSON.stringify(payload))
})

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();