import React, {useEffect, useState} from "react";
import Chat from "./Chat";

const Game = ({clientId, gameId, game, leavingPlayer, setLeavingPlayer, setShowGame, setShowLobby, sendJsonMessage}) => {
    const [finishedGame, setFinishedGame] = useState(false)
    const [finishedGameText, setFinishedGameText] = useState('')

    useEffect(()=>{ //aggiorna la partita quando esce un giocatore
        if(leavingPlayer && leavingPlayer !=clientId){ //la seconda condizione serve perché altrimenti chi abbandona il gioco quando ne joinna altri ha la schermata di chi ha abbandonato
            setFinishedGame(true)
            setFinishedGameText(`${leavingPlayer} left the game`)
        }
    }, [leavingPlayer])

    useEffect(()=>{
        if(game.draw_offer.receiving_client){
            setFinishedGame(true)
            setFinishedGameText('Draw accepted')
        } else if(game.draw_offer.offering_client) {
            setFinishedGame(false)
        }
    }, [game.draw_offer])

    const handleQuit = () => { //torna alla lobby, quittando la partita se non è finita
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

    const handleDraw = () => { //offri o accetta patta
        const payload = {
            "method": "draw",
            "clientId": clientId,
            "gameId": gameId
        }
        sendJsonMessage(payload)
    }
    const handleRejectDraw = () => { //rifiuta patta
        const payload = {
            "method": "drawReject",
            "clientId": clientId,
            "gameId": gameId
        }
        sendJsonMessage(payload)
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
        <div id='board'>{game.board.map((piece) => {
                return <p>{piece.color} {piece.type} on {piece.column.toUpperCase()}{piece.row}</p>
            })}
        </div>
        <div>
            <button onClick={handleQuit}>{finishedGame? 'Go back to the lobby': 'Quit Game'}</button>
            {
                !finishedGame &&(
                    game.draw_offer.offering_client && game.draw_offer.offering_client != clientId?
                        <div>
                            <button onClick={handleDraw}>Accept Draw Offer</button>
                            <button onClick={handleRejectDraw}>Reject Draw Offer</button>
                        </div>
                        :
                        <button onClick={handleDraw}>Offer Draw</button>
                )

            }
        </div>
        <Chat clientId={clientId} gameId={gameId} sendJsonMessage={sendJsonMessage} chat={game.chat}/>
    </div>
}

export default Game