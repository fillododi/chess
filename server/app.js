import http from "http"
import {server as WebSocketServer} from "websocket"
const httpServer = http.createServer()

import {Client} from "./lib/classes/Client.js";
import {sendGameList, broadcastGameList} from "./lib/utils/communications.js";

httpServer.listen(5000, ()=>{console.log("Server listening on port 5000")}) //apre la porta 5000 per il socket del gioco

const clients = {} //dictionary dei client: SERVE SOLO PER DATI DI CONNESSIONE, NON DI GIOCO
const games = {} //dictionary delle partite: contiene tutti i dati di gioco

const wsServer = new WebSocketServer({
    "httpServer": httpServer
})
wsServer.on("request", request => { //quando il client manda richieste al socket del gioco
    const connection = request.accept(null, request.origin)
    connection.on("open", ()=>console.log("opened connection ", connection)) //quando il client si collega
    connection.on("close", ()=>{ //quando il client si disconnette
        const clientId = Object.keys(clients).find(id => clients[id].connection === connection)
        if(clientId) {
            const client = clients[clientId]
            console.log("client ", client.id, " disconnecting...")
            handleLeaveGame(clientId)
            delete clients[clientId] //rimuove il giocatore dall'elenco
            console.log("closed connection")
        }
    })
    connection.on("message", message=> { //quando ci sono scambi di dati
        const result = JSON.parse(message.utf8Data) //estrae i dati della richiesta
        if(result.method === "create") { //richiesta di creazione partita
            const clientId = result.clientId //client che ha richiesto la creazione
            const color = result.color
            const client = clients[clientId]
            if(client.game) { //se il client è già in gioco
                console.log(clientId, " tried to create a game but is already playing another game")
                return
            }
            const game = client.createGame(color)
            const gameId = game.id
            games[gameId] = game //aggiunge la partita al dictionary delle partite (aka crea la partita)
            console.log(clientId, " has created a game with id ", gameId)
            console.log(clientId, " has joined the game with id ", gameId)
            const payload = { //risposta che verrà data con all'interno l'oggetto della partita che contiene tutti i dati di gioco
                "method": "join",
                "game": game.json(),
                "gameId": gameId
            }
            const connection = client.connection //trova la connessione alla quale mandare la risposta (ovvero il client che ha mandato la richiesta)
            connection.send(JSON.stringify(payload)) //invia la risposta
            broadcastGameList(clients, games)
        }
        if(result.method === "join") { //richiesta di partecipazione alla partita
            const clientId = result.clientId //client che ha chiesto di partecipare
            const client = clients[clientId] //client corrispondente all'id richiesto'
            const gameId = result.gameId //id della partita alla quale vuole partecipare
            const game = games[gameId] //partita corrispondente all'id richiesto
            if(client.game) {
                console.log(clientId, " tried to enter game ", gameId, " but is already playing another game")
                return
            }
            client.joinGame(game)
            console.log(clientId, " has joined the game with id ", gameId)
            const payload = { //risposta che verrà data con all'interno l'oggetto della partita che contiene tutti i dati di gioco
                "method": "join",
                "game": game.json()
            }
            game.clients.forEach(client => { //invia la risposta a tutti i client associati alla partita
                client.connection.send(JSON.stringify(payload))
            })
            if(game.clients.length === 2){ //se si è connesso il secondo giocatore: setta la partita e inizia
                game.start()
                broadcastGameList(clients, games)
            }
        }
        if(result.method === "leave"){
            const clientId = result.clientId //client che ha abbandonato
            const gameId = result.gameId //partita abbandonata
            if(clients[clientId].game.id !== gameId){ //se non coincidono, ovvero errore
                console.log('error')
                return
            }
            handleLeaveGame(clientId) //fa uscire il giocatore dalla partita
        }
        if(result.method === "draw"){
            const clientId = result.clientId
            const gameId = result.gameId
            if(clients[clientId].game.id !== gameId){ //se non coincidono, ovvero errore
                return
            }
            const game = games[gameId] //trova la partita
            if(game.draw_offer.offering_client && game.draw_offer.offering_client === clientId){ //controlla che sia il rice
                return
            }
            if(!game.draw_offer.offering_client){ //se si sta offrendo patta
                game.draw_offer.offering_client = clientId
                console.log(clientId, "has offered a draw")
                const payload = {
                    "method": "draw",
                    "draw_offer": game.draw_offer
                }
                game.clients.forEach(client => { //invia la risposta ai client
                    client.connection.send(JSON.stringify(payload))
                })
            } else{ //se si sta accettando patta
                game.draw_offer.receiving_client = clientId
                const payload = {
                    "method": "draw",
                    "draw_offer": game.draw_offer
                }
                game.clients.forEach(client => { //invia la risposta ai client
                    client.game = null //"libera" gli altri giocatori che ora possono fare altre partite
                    client.connection.send(JSON.stringify(payload))
                })
                delete games[gameId] //rimuove la partita dall'elenco
                console.log("game ", gameId, " has finished with a draw")
            }
        }
        if(result.method === "drawReject"){
            const clientId = result.clientId
            const gameId = result.gameId
            if(clients[clientId].game.id !== gameId){ //se non coincidono, ovvero errore
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
                    client.connection.send(JSON.stringify(payload))
                })
            } else {
                return
            }
        }
        if(result.method === 'chat'){ //invia chat
            const clientId = result.clientId
            const gameId = result.gameId
            const message = result.message
            if(clients[clientId].game.id !== gameId){ //se non coincidono, ovvero errore
                return
            }
            const game = games[gameId] //trova la partita
            game.chat.push({ //aggiunge il messaggio alla partita
                'clientId': clientId,
                'message': message
            })
            const payload = {
                'method': 'chat',
                'chat': game.chat
            }
            game.clients.forEach(client => { //invia la risposta ai client
                client.connection.send(JSON.stringify(payload))
            })
        }
        if(result.method === 'move'){
            const gameId = result.gameId
            const game = games[gameId]
            const playerColor = result.playerColor
            if(playerColor === game.active_player.color){ //controlla che muova il giocatore che deve muovere
                console.log(playerColor, 'wants to move')
                const prevRow = result.move.prevPosition.row
                const prevCol = result.move.prevPosition.column
                const pieceType = result.move.piece.type
                const pieceColor = result.move.piece.color
                const selectedPiece = game.board.findPieceByRowCol(prevRow, prevCol)
                if(selectedPiece.getType() === pieceType && selectedPiece.getColor() === pieceColor && pieceColor === playerColor){ //controlla che il pezzo selezionato sia quello trovato (altrimenti è un errore)
                    const newRow = result.move.nextPosition.row
                    const newCol = result.move.nextPosition.column
                    const newSquare = game.board.findSquare(newRow, newCol)
                    console.log('he wants to move his', pieceType, 'on', newSquare.getPosition())
                    const success = selectedPiece.move(newSquare) //la funziona ritorna true se il pezzo si è riuscito a muovere
                    if(success){
                        console.log(game.active_player.color, "moved his", pieceType, "to", newCol, newRow)
                        game.history.push(result.move) //aggiunge la mossa allo storico
                        game.boardHistory.push(game.board.json()) //aggiunge la mossa allo storico
                        if(result.move.promotion){
                            game.board.killPiece(selectedPiece)
                            game.board.addPiece(result.move.promotion, game.active_player.color, newSquare)
                        }
                        const boardToSend = game.board.json()
                        //controlla se è matto
                        const playerUnderMate = game.board.getMate()
                        if(!playerUnderMate){
                            if(game.active_player.color === 'black'){
                                game.turn += 1 //aumenta il numero del turno se ha mosso il nero
                                console.log("It's now turn", game.turn)
                            }
                            game.active_player = game.players.find(player => player !== game.active_player) //passa il turno
                        }
                        //controlla parità
                        const draw = game.checkDraw()
                        if(draw){
                            console.log("PARI!!!!!!")
                        }
                        const payload = { //risposta
                            "method": "move",
                            "game": {
                                "id": gameId,
                                "clients": game.clients.map(client => client.id),
                                "players": game.players,
                                "active_player": game.active_player,
                                "draw_offer": game.draw_offer,
                                "turn": game.turn,
                                "board": boardToSend,
                                "history": game.history,
                                "chat": game.chat,
                                "checkmate": playerUnderMate? playerUnderMate: '',
                                "draw": draw
                            }
                        }
                        game.clients.forEach(client => { //invia la risposta a tutti i client associati alla partita
                            client.connection.send(JSON.stringify(payload))
                        })
                        if(playerUnderMate || draw){
                            game.clients.forEach(client => client.leaveGame())
                            delete games[gameId] //rimuove la partita dall'elenco
                            console.log("game ", gameId, " has finished")
                            broadcastGameList(clients, games)
                        }
                    }
                }
            }
        }
        if(result.method === 'getGames'){
            const clientId = result.clientId
            if(clientId){
                sendGameList(connection, games)
            }
        }
    })

    //quello che succede quando il client si connette
    const client = new Client(connection)
    const clientId = client.id
    console.log(clientId, "is connected")
    clients[clientId] = client
    const payload = { //risposta che viene data al client al momento della connessione: qui vanno mandati i dati dell'utente non di gioco che serviranno al browser
        "method": "connect",
        "clientId": clientId
    }
    connection.send(JSON.stringify(payload)) //invia la risposta al client quando esso si connette
})

const handleLeaveGame = (clientId) => {
    const client = clients[clientId]
    if(!client){
        return
    }
    const game = client.game
    if(!game){
        return
    }
    const gameId = game.id
    console.log(clientId, " left the game with id ", gameId)
    const payload = {
        "method": "leave",
        "game": game.json(),
        "leavingPlayer": clientId
    }
    game.clients.forEach(client => {
        client.game = null
        client.connection.send(JSON.stringify(payload))
    })
    delete games[gameId] //rimuove la partita dall'elenco
    console.log("game ", gameId, " has finished")
    broadcastGameList(clients, games)
}