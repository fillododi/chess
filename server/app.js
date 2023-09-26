import http from "http"
import url from "url"
import {server as webSocketServer} from "websocket"
const httpServer = http.createServer()
import express from "express"
const app = express()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import {Pawn, Rook, Knight, Bishop, King, Queen} from './lib/classes.js'

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
                handleQuit(clientId, gameId) //fa uscire il giocatore dalla partita
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
                    "clients": [],
                    "active_player": null,
                    "draw_offer": {
                        "offering_client": null,
                        "receiving_client": null
                    },
                    "turn": null,
                    "board": [],
                    "history": [],
                    "chat": []
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
            if(game.clients.length > 1){ //se c'è già 1 client nella partita (e quindi quello che prova a connettersi è il secondo) non fa entrare
                console.log(clientId, " tried to enter game ", gameId, " but it's full")
                return
            } else if(clients[clientId].gameId) {
                console.log(clientId, " tried to enter game ", gameId, " but is already playing another server")
                return
            } else {
                clients[clientId].gameId = gameId //associa al cliente la partita a cui si sta unendo per evitare che entri anche in altre
                game.clients.push({ //aggiunge il client alla partita: qui vanno messi tutti i dati di gioco del client
                    "clientId": clientId,
                    "color": null
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
                if(game.clients.length == 2){ //se si è connesso il secondo giocatore: setta la partita e inizia
                    console.log("Starting game ", game.id)
                    const randomNumber = Math.random() //per decidere chi è bianco e chi nero
                    if(randomNumber < 0.5){
                        game.clients[0].color = 'white'
                        game.clients[1].color = 'black'
                    } else {
                        game.clients[0].color = 'black'
                        game.clients[1].color = 'white'
                    }
                    game.active_player = game.clients.find(client => client.color.includes('white')) //fa iniziare il bianco
                    game.clients.map(client => console.log(client.clientId, " is ", client.color))
                    console.log(game.active_player.clientId, " starts")
                    game.turn = 1 //inizia a contare i turni
                    game.board = generateBoard() //genera la scacchiera
                    console.log("Board generated")
                    printBoard(game.board)
                    console.log("Game started. It's now turn 1")
                    const alphabet = "abcdefgh"
                    const boardToSend = game.board.map(piece => {return { //sostituisce numeri colonne con lettere
                        "color": piece.color,
                        "type": piece.type,
                        "column": alphabet[piece.col - 1],
                        "row": piece.row
                    }})
                    const payload = { //risposta che verrà data per fare iniziare la partita
                        "method": "start",
                        "game": {
                            "id": gameId,
                            "clients": game.clients,
                            "active_player": game.active_player,
                            "draw_offer": game.draw_offer,
                            "turn": game.turn,
                            "board": boardToSend,
                            "history": game.history,
                            "chat": game.chat
                        }
                    }
                    game.clients.forEach(client => { //invia la risposta a tutti i client associati alla partita
                        clients[client.clientId].connection.send(JSON.stringify(payload))
                    })
                }
            }
        }
        if(result.method === "leave"){
            const clientId = result.clientId //client che ha abbandonato
            const gameId = result.gameId //partita abbandonata
            if(clients[clientId].gameId != gameId){ //se non coincidono, ovvero errore
                return
            }
            handleQuit(clientId, gameId) //fa uscire il giocatore dalla partita
        }
        if(result.method === "draw"){
            const clientId = result.clientId
            const gameId = result.gameId
            if(clients[clientId].gameId != gameId){ //se non coincidono, ovvero errore
                return
            }
            const game = games[gameId] //trova la partita
            if(!game.draw_offer.offering_client){ //se si sta offrendo patta
                game.draw_offer.offering_client = clientId
                console.log(clientId, "has offered a draw")
                const payload = {
                    "method": "draw",
                    "draw_offer": game.draw_offer
                }
                game.clients.forEach(client => { //invia la risposta ai client
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
            } else if(game.draw_offer.offering_client != clientId && !game.draw_offer.receiving_client){ //se si sta accettando patta
                game.draw_offer.receiving_client = clientId
                const payload = {
                    "method": "draw",
                    "draw_offer": game.draw_offer
                }
                game.clients.forEach(client => { //invia la risposta ai client
                    clients[client.clientId].gameId = null //"libera" gli altri giocatori che ora possono fare altre partite
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
                delete games[gameId] //rimuove la partita dall'elenco
                console.log("game ", gameId, " has finished with a draw")
            } else {
                return
            }
        }
        if(result.method === "drawReject"){
            const clientId = result.clientId
            const gameId = result.gameId
            if(clients[clientId].gameId != gameId){ //se non coincidono, ovvero errore
                return
            }
            const game = games[gameId] //trova la partita
            if(game.draw_offer.offering_client && !game.draw_offer.receiving_client){ //controlla che sia il ricevente
                game.draw_offer.offering_client = null
                console.log(clientId, "has rejected a draw")
                const payload = {
                    "method": "draw",
                    "draw_offer": game.draw_offer
                }
                game.clients.forEach(client => { //invia la risposta ai client
                    clients[client.clientId].connection.send(JSON.stringify(payload))
                })
            } else {
                return
            }
        }
        if(result.method === 'chat'){ //invia chat
            const clientId = result.clientId
            const gameId = result.gameId
            const message = result.message
            if(clients[clientId].gameId != gameId){ //se non coincidono, ovvero errore
                return
            }
            const game = games[gameId] //trova la partita
            game.chat.push({ //aggiunge il messaggio alla partita
                'clientId': clientId,
                'message': message
            })
            console.log('game', gameId, '-', clientId, '-', message)
            const payload = {
                'method': 'chat',
                'chat': game.chat
            }
            game.clients.forEach(client => { //invia la risposta ai client
                clients[client.clientId].connection.send(JSON.stringify(payload))
            })
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

const generateBoard = () => { //genera i pezzi iniziali
    let p = null
    let board = []
    const alphabet = "abcdefgh" //serve per conversioni lettera/numero
    //generazione pezzi
    for(let i = 0; i < 8; i++){
        for(let j = 1; j <= 8; j++){
            if(j == 2){
                p = new Pawn('white', 2, alphabet[i].toString())
            }
            else if(j == 7){
                p = new Pawn('black', 7, alphabet[i].toString())
            }
            else if(j == 1){
                if(i == 0 || i == 7){
                    p = new Rook('white', 1, alphabet[i].toString())
                }
                else if(i == 1 || i == 6){
                    p = new Knight('white', 1, alphabet[i].toString())
                }
                else if(i == 2 || i == 5){
                    p = new Bishop('white',1, alphabet[i].toString())
                }
                else if(i == 3){
                    p = new Queen('white', 1, alphabet[i].toString())
                }
                else if(i == 4){
                    p = new King('white', 1, alphabet[i].toString())
                } else {
                    continue
                }
            }
            else if(j == 8){
                if(i == 0 || i == 7){
                    p = new Rook('black', 8, alphabet[i].toString())
                }
                else if(i == 1 || i == 6){
                    p = new Knight('black', 8, alphabet[i].toString())
                }
                else if(i == 2 || i == 5){
                    p = new Bishop('black',8, alphabet[i].toString())
                }
                else if(i == 3){
                    p = new Queen('black', 8, alphabet[i].toString())
                }
                else if(i == 4){
                    p = new King('black', 8, alphabet[i].toString())
                } else {
                    continue
                }
            } else {
                continue
            }
            board.push(p) //aggiunge il pezzo alla scacchiera
        }
    }
    return board
}

const handleQuit = (clientId, gameId) => {
    const game = games[gameId] //trova la partita
    console.log(clientId, " left the game with id ", gameId)
    const payload = { //risposta da mandare ai client nella partita
        "method": "leave",
        "game": game,
        "leavingPlayer": clientId
    }
    game.clients.forEach(client => { //invia la risposta ai client
        clients[client.clientId].gameId = null //"libera" gli altri giocatori che ora possono fare altre partite
        clients[client.clientId].connection.send(JSON.stringify(payload))
    })
    delete games[gameId] //rimuove la partita dall'elenco
    console.log("game ", gameId, " has finished")
}

const printBoard = (board) => {
    board.forEach(piece => piece.print())
}

function S4() { //serve a generare stringhe di numeri
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase(); //genera id