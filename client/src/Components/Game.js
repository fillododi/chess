import React, {useEffect, useState} from "react";
import Chat from "./Chat";

const Game = ({clientId, gameId, game, leavingPlayer, setLeavingPlayer, setShowGame, setShowLobby, sendJsonMessage}) => {
    const [finishedGame, setFinishedGame] = useState(false)
    const [finishedGameText, setFinishedGameText] = useState('')

    useEffect(()=>{ //aggiorna la partita quando esce un giocatore
        if(leavingPlayer && leavingPlayer != clientId){ //la seconda condizione serve perché altrimenti chi abbandona il gioco quando ne joinna altri ha la schermata di chi ha abbandonato
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

    return <div className={'flex flex-col gap-y-8 p-8'}>
        <h1 className={'text-2xl'}>Your match has gameid:<br/><span className={'font-semibold text-blue-600'}>{gameId}</span><br/>Share it with your friends!</h1>
        {!finishedGame?
            <div className={'flex flex-col gap-y-2'}>
                <h3 className={'text-lg'}>Connected players:</h3>
                <div className={"flex flex-row gap-x-2 justify-evenly"}>
                    {game.clients.map(client =>
                        <div className={'border-2 border-gray-800 border-dashed p-4'}>
                            <p>{client.clientId}</p>
                            <p>{client.color}</p>
                        </div>
                    )}
                </div>
            </div>
            :
            <div>
                <h1 style={{'color':"red"}}>The game has finished! {finishedGameText}</h1>
            </div>
        }
        <div className={'flex flex-row justify-evenly'}>
            <div className={'flex flex-col gap-y-4'}>
                <div id='board' className={'border-2 border-black grid grid-cols-3 gap-2'}>{game.board.map((piece) => {
                        return <p>{piece.color} {piece.type} on {piece.column.toUpperCase()}{piece.row}</p>
                    })}
                </div>
                <div className={'flex flex-row gap-x-4'}>
                    <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'}
                            onClick={handleQuit}>{finishedGame? 'Go back to the lobby': 'Quit Game'}</button>
                    {
                        !finishedGame &&(
                            game.draw_offer.offering_client && game.draw_offer.offering_client != clientId?
                                <div>
                                    <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={handleDraw}>
                                        Accept Draw Offer
                                    </button>
                                    <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={handleRejectDraw}>
                                        Reject Draw Offer
                                    </button>
                                </div>
                                :
                                <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={handleDraw}>
                                    Offer Draw
                                </button>
                        )

                    }
                </div>
            </div>
            <Chat clientId={clientId} gameId={gameId} sendJsonMessage={sendJsonMessage} chat={game.chat}/>
        </div>
    </div>
}

export default Game