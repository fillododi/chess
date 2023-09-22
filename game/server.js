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
    connection.on("open", ()=>console.log("opened")) //quando il client si collega
    connection.on("close", ()=>console.log("closed")) //quando il client si disconnette
    connection.on("message", message=> { //quando ci sono scambi di dati
        const result = JSON.parse(message.utf8Data) //estrae i dati della richiesta
        if(result.method === "create") { //richiesta di creazione partita
            const clientId = result.clientId //client che ha richiesto la creazione
            const gameId = guid() //genera id partita
            games[gameId] = { //aggiunge la partita al dictionary delle partite (aka crea la partita: qui vanno tutti i dati iniziali della partita)
                "id": gameId,
                "clients": []
            }
            const payload = { //risposta che verrà data con all'interno l'id della partita
                "method": "create",
                "gameId": gameId
            }
            const connection = clients[clientId].connection //trova la connessione alla quale mandare la risposta (ovvero il client che ha mandato la richiesta)
            connection.send(JSON.stringify(payload)) //invia la risposta
        }
        if(result.method === "join") { //richiesta di partecipazione alla partita
            const clientId = result.clientId //client che ha chiesto di partecipare
            const gameId = result.gameId //id della partita alla quale vuole partecipare
            const game = games[gameId] //partita corrispondente all'id richiesto
            if(game.clients.length > 1){ //se ci sono già 2 client nella partita non fa entrare //todo: il server crasha
                return
            } else {
                game.clients.push({ //aggiunge il client alla partita: qui vanno messi tutti i dati di gioco del client
                    "clientId": clientId,
                })
                const payload = { //risposta che verrà data con all'interno l'oggetto della partita che contiene tutti i dati di gioco
                    "method": "join",
                    "game": game
                }
                game.clients.forEach(client => { //invia la risposta a tutti i client associati alla partita
                    console.log(client)
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
            }
        }
    })

    //quello che succede quando il client si connette
    const clientId = guid() //genera id client
    console.log(clientId)
    clients[clientId] = { //aggiunge il client al dictionary dei client (aka "crea" il client: qui vanno messi i dati non di gioco del client)
        "connection": connection //associa la connessione al client (generata con const connection = request.accept(null, request.origin) quando il client si è connesso)
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