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
    const [game, setGame] = useState(null)
    const [leavingPlayer, setLeavingPlayer] = useState(null)

    //quando si ricevono messaggi dal server
    useEffect(()=>{
        if(lastJsonMessage){
            const method = lastJsonMessage.method
            if(method === 'connect'){ //messaggio che arriva quando il client si connette, ottenendo il client id
                setClientId(lastJsonMessage.clientId)
                console.log('connected')
            }
            if(method === 'join'){
                setGameId(lastJsonMessage.gameId)
                setGame(lastJsonMessage.game)
                setShowLobby(false)
                setShowGame(true)
            }
            if(method === 'leave'){ //notifica che qualcuno è uscito dalla partita
                setLeavingPlayer(lastJsonMessage.leavingPlayer)
            }
            if(method === 'draw'){
                const draw_offer = lastJsonMessage.draw_offer
                setGame({...game, "draw_offer": draw_offer})
            }
            if(method === 'chat'){
                setGame({...game, "chat": lastJsonMessage.chat})
            }
            if(method === 'start'){
                setGame(lastJsonMessage.game)
                setGameId(lastJsonMessage.gameId)
            }
            if(method === 'move'){
                setGame(lastJsonMessage.game)
            }
        }
    }, [lastJsonMessage])

    return (
        <div className="App">
            <h1 className={'m-16 text-4xl'}>Chess</h1>
            <div className={'absolute top-8 right-8 p-2 border-dashed border-gray-800 border-2'}>
                <p>Your client id is {clientId}</p>
            </div>
            <div className={'max-w-8xl mx-auto border-gray-800 border-2 flex flex-col'}>
                {showLobby && <Lobby clientId={clientId} gameId={gameId} setGameId={setGameId} sendJsonMessage={sendJsonMessage}/>}
                {showGame && <Game clientId={clientId} gameId={gameId} game={game} leavingPlayer={leavingPlayer} setLeavingPlayer={setLeavingPlayer}
                               setShowGame={setShowGame} setShowLobby={setShowLobby} sendJsonMessage={sendJsonMessage}/>}
            </div>
        </div>
      );
}

export default App;
