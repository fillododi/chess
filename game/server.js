const http = require("http")
const webSocketServer = require("websocket").server
const httpServer = http.createServer()
const app = require("express")()

app.get("/", (req, res)=>res.sendFile(__dirname + "/client.html")) //restituisce il file html al client
app.listen(5001, ()=>console.log("Server listening on port 5001")) //apre la porta 5001 per le richieste all'html

httpServer.listen(5000, ()=>{console.log("Server listening on port 5000")}) //apre la porta 5000 per il socket del gioco

const clients = {} //dictionary dei client: SERVE SOLO PER DATI DI CONNESSIONE, NON DI GIOCO
const games = {} //dictionary delle partite: contiene tutti i dati di gioco

const wsServer = new webSocketServer({
    "httpServer": httpServer
})
wsServer.on("request", request => { //quando il client manda richieste al socket del gioco
    const connection = request.accept(null, request.origin)
    connection.on("open", ()=>console.log("opened connection ", connection)) //quando il client si collega
    connection.on("close", ()=>{ //quando il client si disconnette
        let client = null
        Object.keys(clients).forEach(id => { //trova il client disconnesso
            if(clients[id].connection === connection){
                client = clients[id]
            }
        })
        if(client) {
            console.log("client ", client.id, " disconnecting...")
            const clientId = client.id
            const gameId = client.gameId //partita a cui il client sta giocando
            if (gameId) { //se il client era in gioco
                const game = games[gameId] //trova la partita
                console.log(clientId, " left the game with id ", gameId)
                const payload = { //risposta da mandare agli altri client nella partita
                    "method": "leave",
                    "game": game,
                    "leavingPlayer": clientId
                }
                game.clients.forEach(client => { //invia la risposta agli altri client
                    clients[client.clientId].gameId = null //"libera" gli altri giocatori che ora possono fare altre partite
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
                delete games[gameId] //rimuove la partita dall'elenco
                console.log("game ", gameId, " has finished")
            }
            delete clients[clientId] //rimuove il giocatore dall'elenco
            console.log("closed connection")
        }
    })
    connection.on("message", message=> { //quando ci sono scambi di dati
        const result = JSON.parse(message.utf8Data) //estrae i dati della richiesta
        if(result.method === "create") { //richiesta di creazione partita
            const clientId = result.clientId //client che ha richiesto la creazione
            if(clients[clientId].gameId) { //se il client è già in gioco
                console.log(clientId, " tried to create a game but is already playing another game")
                return
            } else {
                const gameId = guid() //genera id partita
                games[gameId] = { //aggiunge la partita al dictionary delle partite (aka crea la partita: qui vanno tutti i dati iniziali della partita)
                    "id": gameId,
                    "clients": []
                }
                const payload = { //risposta che verrà data con all'interno l'id della partita
                    "method": "create",
                    "gameId": gameId
                }
                console.log(clientId, " has created a game with id ", gameId)
                const connection = clients[clientId].connection //trova la connessione alla quale mandare la risposta (ovvero il client che ha mandato la richiesta)
                connection.send(JSON.stringify(payload)) //invia la risposta
            }
        }
        if(result.method === "join") { //richiesta di partecipazione alla partita
            const clientId = result.clientId //client che ha chiesto di partecipare
            const gameId = result.gameId //id della partita alla quale vuole partecipare
            const game = games[gameId] //partita corrispondente all'id richiesto
            if(game.clients.length > 1){ //se ci sono già 2 client nella partita non fa entrare
                console.log(clientId, " tried to enter game ", gameId, " but it's full")
                return
            } else if(clients[clientId].gameId) {
                console.log(clientId, " tried to enter game ", gameId, " but is already playing another game")
                return
            } else {
                clients[clientId].gameId = gameId //associa al cliente la partita a cui si sta unendo
                game.clients.push({ //aggiunge il client alla partita: qui vanno messi tutti i dati di gioco del client
                    "clientId": clientId,
                })
                console.log(clientId, " has joined the game with id ", gameId, " players are now: ")
                const payload = { //risposta che verrà data con all'interno l'oggetto della partita che contiene tutti i dati di gioco
                    "method": "join",
                    "game": game
                }
                game.clients.forEach(client => { //invia la risposta a tutti i client associati alla partita
                    console.log("player: ", client)
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
            }
        }
    })

    //quello che succede quando il client si connette
    const clientId = guid() //genera id client
    console.log(clientId, "is connected")
    clients[clientId] = { //aggiunge il client al dictionary dei client (aka "crea" il client: qui vanno messi i dati non di gioco del client)
        "connection": connection, //associa la connessione al client (generata con const connection = request.accept(null, request.origin) quando il client si è connesso)
        "id": clientId, //id del client
        "gameId": null //id della partita a cui sta giocando il client
    }
    const payload = { //risposta che viene data al client al momento della connessione: qui vanno mandati i dati dell'utente non di gioco che serviranno al browser
        "method": "connect",
        "clientId": clientId
    }
    connection.send(JSON.stringify(payload)) //invia la risposta al client quando esso si connette
})

function S4() { //serve a generare stringhe di numeri
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase(); //genera id