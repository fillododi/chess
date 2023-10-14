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
    const [gameId, setGameId] = useState('') // Input field should not be null
    const [game, setGame] = useState(null)
    const [leavingPlayer, setLeavingPlayer] = useState(null)
    const [games, setGames] = useState([])

    //quando si ricevono messaggi dal server
    useEffect(()=>{
        if (!lastJsonMessage) {
          return
        }
        const {method} = lastJsonMessage
        switch(method) {
            case 'connect':
                setClientId(lastJsonMessage.clientId);
                console.log('connected');
                break;
            case 'join':
                setGameId(lastJsonMessage.gameId);
                setGame(lastJsonMessage.game);
                setShowLobby(false);
                setShowGame(true);
                break;
            case 'leave':
                setLeavingPlayer(lastJsonMessage.leavingPlayer);
                break;
            case 'draw':
                const {draw_offer} = lastJsonMessage;
                setGame((game) => {
                    return {...game, "draw_offer": draw_offer};
                });
                break;
            case 'chat':
                setGame((game) => {
                    return {...game, "chat": lastJsonMessage.chat};
                });
                break;
            case 'start':
                setGame(lastJsonMessage.game);
                setGameId(lastJsonMessage.gameId);
                break;
            case 'move':
                setGame(lastJsonMessage.game);
                break;
            case 'getGames':
                setGames(lastJsonMessage.games);
                break;
            default:
                console.error(`Unrecognized method! Received: ${method}`);
                break;
        }
    }, [lastJsonMessage])

    useEffect(()=>{ //richiesta automatica partite
        if(clientId){
            sendJsonMessage({
                "method": "getGames",
                "clientId": clientId
            })
        }
    }, [clientId, showLobby]) //serve clientid perché la prima volta che lo invia è quando clientid è prima che questo abbia un valore

    return (
        <div className="App">
            <h1 className={'m-16 text-4xl'}>Chess</h1>
            <div className={'absolute top-8 right-8 p-2 border-dashed border-gray-800 border-2'}>
                <p>Your client id is {clientId}</p>
            </div>
            <div className={'max-w-8xl mx-auto border-gray-800 border-2 flex flex-col'}>
                {showLobby && <Lobby clientId={clientId} gameId={gameId} setGameId={setGameId} sendJsonMessage={sendJsonMessage} games={games}/>}
                {showGame && <Game clientId={clientId} gameId={gameId} game={game} leavingPlayer={leavingPlayer} setLeavingPlayer={setLeavingPlayer}
                               setShowGame={setShowGame} setShowLobby={setShowLobby} sendJsonMessage={sendJsonMessage}/>}
            </div>
        </div>
      );
}

export default App;
