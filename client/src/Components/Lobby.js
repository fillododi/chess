import React from "react";

const Lobby = ({clientId, gameId, setGameId, sendJsonMessage}) => {
    const handleGameIdChange = (e) => {
        e.preventDefault()
        setGameId(e.target.value)
    }

    return <div className={'flex flex-col gap-y-8 p-8'}>
        <h1 className={'text-4xl'}>Welcome to the Lobby!</h1>
        <div>
            <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={()=> {
                const payload = { //richiesta che verrà mandata
                    "method": "create",
                    "clientId": clientId
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
                    "gameId": gameId
                }
                console.log(payload)
                sendJsonMessage(payload) //invia richiesta
            }
            }>Join Game</button>
        </div>
    </div>
}

export default Lobby