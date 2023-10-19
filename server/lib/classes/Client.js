import {guid} from '../utils/guid.js';
import {Game} from './Game.js';

export class Client{
    constructor(connection){
        this.connection = connection
        this.id = guid()
        this.game = null
    }

    createGame(color){
        const game = new Game()
        this.game = game
        game.addClient(this)
        game.addPlayer(this, color)
        return game
    }

    joinGame(game){
        this.game = game
        game.addClient(this)
        game.addPlayer(this)
    }

    json(){
        return {
            "id": this.id,
            "game": this.game? this.game.json(): null
        }
    }

    leaveGame(){
        this.game = null
    }
}