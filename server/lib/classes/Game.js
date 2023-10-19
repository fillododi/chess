import {guid} from '../utils/guid.js'
import {Board} from "./Board.js";

export class Game {
    constructor(){
        this.id = guid()
        this.clients = []
        this.players = []
        this.active_player = null
        this.draw_offer = {
            "offering_client": null,
            "receiving_client": null
        },
        this.turn = null
        this.board = null
        this.history = []
        this.boardHistory = []
        this.chat = []
    }

    json(){
        return {
            "id": this.id,
            "clients": this.clients.map(client => client.id),
            "players": this.players,
            "active_player": this.active_player,
            "draw_offer": this.draw_offer,
            "turn": this.turn,
            "board": this.board? this.board.json(): null,
            "history": this.history,
            "chat": this.chat
        }
    }

    addClient(client){
        this.clients.push(client)
    }

    addPlayer(client, color=null){
        if(this.players.length === 2){
            console.log(client.id, " tried to enter game ", this.id, " but it's full")
            return
        }
        let newPlayer = {
            "clientId": client.id
        }
        if(this.players.length === 0){
            if(color){
                newPlayer.color = color
            } else {
                newPlayer.color = 'random'
            }
        } else {
            if(this.players[0].color === 'white'){
                newPlayer.color = 'black'
            } else if(this.players[0].color === 'black'){
                newPlayer.color = 'white'
            } else {
                const randomNumber = Math.random() //per decidere chi è bianco e chi nero
                if(randomNumber < 0.5){
                    this.players[0].color = 'white'
                    newPlayer.color = 'black'
                } else {
                    this.players[0].color = 'black'
                    newPlayer.color = 'white'
                }
            }
        }
        this.players.push(newPlayer)
    }

    start(){
        this.active_player = this.players.find(player => player.color === 'white')
        this.turn = 1
        this.board = new Board(this)
        this.boardHistory.push(this.board.json())
        const payload = {
            "method": "start",
            "game": this.json(),
            "gameId": this.id
        }
        this.clients.forEach(client => {
            client.connection.send(JSON.stringify(payload))
        })
    }

    getLastMove(){
        if(this.history.length === 0){
            return null
        }
        return this.history[this.history.length - 1]
    }

    checkStalemate(){
        const activePlayerPossibleMoves = this.board.getPossibleMovesByColor(this.active_player.color)
        if(activePlayerPossibleMoves.length === 0 && !this.board.getPlayerColorUnderCheck()){
            return true
        }
        return false
    }

    check5Repetition(){
        const currentPosition = this.boardHistory[this.boardHistory.length - 1]
        const repetitions = this.boardHistory.filter((position, index) => {
            if(index%2 != (this.boardHistory.length)%2){ //the positions are considered equal only if it's the same player's turn to move
                console.log(index)
                console.log(JSON.stringify(position))
                console.log(JSON.stringify(currentPosition))
                return JSON.stringify(position) == JSON.stringify(currentPosition)
            }
        }).length
        console.log('this position has appeared', repetitions,'times')
        if(repetitions >= 5){
            return true
        }
        return false
    }

    checkDraw(){
        if(this.checkStalemate()){
            return "stalemate"
        }
        if(this.check5Repetition()){
            return "fivefold repetition"
        }
        return false
    }
}