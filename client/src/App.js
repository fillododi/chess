import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import Lobby from "./Components/Lobby";
import Game from "./Components/Game";
import useWebSocket from 'react-use-websocket'

const WS_URL = 'ws://localhost:5000'

function App() {
    //websocket setup
    const {sendJsonMessage, lastJsonMessage} = useWebSocket(WS_URL, {})
    //dichiarazione variabili e stati
    const [showLobby, setShowLobby] = useState(true)
    const [showGame, setShowGame] = useState(false)
    const [clientId, setClientId] = useState(null)
    const [gameId, setGameId] = useState(null)
    const [gameCreated, setGameCreated] = useState(null)
    const [game, setGame] = useState(null)
    const [leavingPlayer, setLeavingPlayer] = useState(null)

    //quando si ricevono messaggi dal lib
    useEffect(()=>{
        if(lastJsonMessage){
            const method = lastJsonMessage.method
            if(method === 'connect'){ //messaggio che arriva quando il client si connette, ottenendo il client id
                setClientId(lastJsonMessage.clientId)
                console.log('connected')
            }
            if(method === "create"){ //risposta alla creazione della partita, in cui si ottiene il gameid
                setGameId(lastJsonMessage.gameId)
                setGameCreated(lastJsonMessage.gameId) //in questo modo il client joinna automaticamente
                console.log("Created server")
            }
            if(method === 'join'){
                setGame(lastJsonMessage.game)
                setShowLobby(false)
                setShowGame(true)
            }
            if(method === 'leave'){ //notifica che qualcuno è uscito dalla partita
                setGame(lastJsonMessage.game)
                setLeavingPlayer(lastJsonMessage.leavingPlayer)
            }
        }
    }, [lastJsonMessage])

    useEffect(()=>{ //join automatico alle partite appena create
        if(gameCreated){
            const payload = { //richiesta che verrà mandata
                "method": "join",
                "clientId": clientId,
                "gameId": gameCreated
            }
            sendJsonMessage(payload) //invia richiesta
        }
    }, [gameCreated])

    return (
        <div className="App">
            <h1>Chess</h1>
            <p>Your client id is {clientId}</p>
            {showLobby && <Lobby clientId={clientId} gameId={gameId} setGameId={setGameId} sendJsonMessage={sendJsonMessage}/>}
            {showGame && <Game clientId={clientId} gameId={gameId} game={game} leavingPlayer={leavingPlayer} setLeavingPlayer={setLeavingPlayer}
                               setShowGame={setShowGame} setShowLobby={setShowLobby} sendJsonMessage={sendJsonMessage}/>}
        </div>
      );
}

export default App;
