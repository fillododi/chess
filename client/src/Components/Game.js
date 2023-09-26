import React, {useEffect, useState} from "react";

const Game = ({clientId, gameId, game, leavingPlayer, setLeavingPlayer, setShowGame, setShowLobby, sendJsonMessage}) => {
    const [finishedGame, setFinishedGame] = useState(false)
    const [finishedGameText, setFinishedGameText] = useState('')

    useEffect(()=>{ //aggiorna la partita quando esce un giocatore
        if(leavingPlayer && leavingPlayer !=clientId){ //la seconda condizione serve perché altrimenti chi abbandona il gioco quando ne joinna altri ha la schermata di chi ha abbandonato
            setFinishedGame(true)
            setFinishedGameText(`${leavingPlayer} left the game`)
        }
    }, [leavingPlayer])

    const handleQuitButton = () => { //torna alla lobby, quittando la partita se non è finita
        if(!finishedGame){
            const payload = { //richiesta che verrà mandata
                "method": "leave",
                "clientId": clientId,
                "gameId": gameId
            }
            sendJsonMessage(payload)
        }
        setShowGame(false)
        setShowLobby(true)
        setLeavingPlayer(null) //fa in modo che quando si joinnerà il prossimo gioco non esca la schermata di fine gioco
    }

    return <div>
        <h1>Game {gameId}</h1>
        {!finishedGame?
            <div style={{'display': "flex", "justify-content": "center"}}>
                {game.clients.map(client =>
                    <div style={{'width': '200px', "border": "1px solid black"}}>
                        <p>Connected client: {client.clientId}</p>
                    </div>
                )}
            </div>
            :
            <div>
                <h1 style={{'color':"red"}}>The game has finished! {finishedGameText}</h1>
            </div>
        }
        <div id='board'>Here goes the board</div>
        <div>
            <button onClick={handleQuitButton}>{finishedGame? 'Go back to the lobby': 'Quit Game'}</button>
        </div>
    </div>
}

export default Game