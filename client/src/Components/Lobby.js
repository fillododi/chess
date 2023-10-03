import React, {useState} from "react";
import {FaRegChessPawn, FaChessPawn, FaDiceFive} from "react-icons/fa6";

const Lobby = ({clientId, gameId, setGameId, sendJsonMessage, games}) => {

    const [selectedColor, setSelectedColor] = useState('random')
    const handleGameIdChange = (e) => {
        e.preventDefault()
        setGameId(e.target.value)
    }
    const handleSelectColor = (e) => {
        e.preventDefault()
        setSelectedColor(e.target.value)
    }

    return <div className={'flex flex-col gap-y-8 p-8'}>
        <h1 className={'text-4xl'}>Welcome to the Lobby!</h1>
        <div className={'flex flex-row justify-center gap-x-2'}>
            <button onClick={handleSelectColor} value={'white'} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaRegChessPawn className={'pointer-events-none text-xl'}/>
            </button>
            <button onClick={handleSelectColor} value={'black'} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaChessPawn className={'pointer-events-none text-xl'}/>
            </button>
            <button onClick={handleSelectColor} value={'random'} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaDiceFive className={'pointer-events-none text-xl'}/>
            </button>
            <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={()=> {
                const payload = { //richiesta che verrà mandata
                    "method": "create",
                    "clientId": clientId,
                    "color": selectedColor
                }
                sendJsonMessage(payload) //invia richiesta
            }}>New Game</button>
        </div>
        <div className={'flex flex-row justify-center'}>
            <input type="text" className={'border-gray-400 border-l-2 border-y-2'} onChange={handleGameIdChange} value={gameId}/>
            <button className={'border-blue-600 border-2 rounded-br-md rounded-tr-md p-2 hover:bg-blue-600 hover:text-white'} onClick={()=>{
                const payload = { //richiesta che verrà mandata
                    "method": "join",
                    "clientId": clientId,
                    "gameId": gameId,
                    "color": selectedColor
                }
                console.log(payload)
                sendJsonMessage(payload) //invia richiesta
            }
            }>Join Game</button>
        </div>
        <h4 className='text-xl'>or <span className={'text-blue-600 text-bold'}>Choose a game from the list</span> </h4>
        <div className={'grid grid-cols-3'}>
            {games.map(game => {
                const opponentColor = game.client.color
                let playerColor
                if(opponentColor === 'white'){
                    playerColor = 'black'
                }
                if(opponentColor === 'black'){
                    playerColor = 'white'
                }
                if(opponentColor === 'random'){
                    playerColor = 'random'
                }
                return <div className={'border-blue-600 border-2 flex flex-col justify-center p-4 gap-y-2'}>
                    <p>Game: {game.gameId}</p>
                    <p>Opponent: {game.client.clientId}</p>
                    <p>You will play as {playerColor}</p>
                    <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={()=>{
                        const payload = { //richiesta che verrà mandata
                            "method": "join",
                            "clientId": clientId,
                            "gameId": game.gameId
                        }
                        console.log(payload)
                        sendJsonMessage(payload) //invia richiesta
                    }}>Join Game</button>
                </div>
            })}
        </div>
    </div>
}

export default Lobby