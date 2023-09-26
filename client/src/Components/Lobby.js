import React from "react";

const Lobby = ({clientId, gameId, setGameId, sendJsonMessage}) => {
    const handleGameIdChange = (e) => {
        e.preventDefault()
        setGameId(e.target.value)
    }

    return <div>
        <button onClick={()=> {
            const payload = { //richiesta che verrà mandata
                "method": "create",
                "clientId": clientId
            }
            sendJsonMessage(payload) //invia richiesta
        }}>New Game</button>
        <br/>
        <input type="text" onChange={handleGameIdChange}/>
        <button onClick={()=>{
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
}

export default Lobby