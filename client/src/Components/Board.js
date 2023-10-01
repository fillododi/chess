import React, {useEffect, useState} from "react";

const Board = ({game, playerColor, isActivePlayer, sendJsonMessage}) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [moveText, setMoveText] = useState('')

    const handlePieceSelection = (e) => {
        setSelectedPiece(JSON.parse(e.target.value))
    }

    const handleMoveTextChange = (e) => {
        e.preventDefault()
        setMoveText(e.target.value)
    }

    const handleMove = () => {
        if(selectedPiece && moveText && isActivePlayer){ //se si può muovere
            const alphabet = "ABCDEFGH"
            const numbers = "12345678"
            if(moveText.length == 2 && alphabet.includes(moveText[0].toUpperCase()) && numbers.includes(moveText[1])){ //validazione mossa
                const payload = {
                    "method": "move",
                    "playerColor": playerColor,
                    "gameId": game.id,
                    "move": {
                        "piece": {
                            "type": selectedPiece.type,
                            "color": selectedPiece.color
                        },
                        "prevPosition": {
                            "row": selectedPiece.row,
                            "column": selectedPiece.column
                        },
                        "nextPosition": {
                            "row": moveText[1],
                            "column": moveText[0].toUpperCase()
                        }
                    }
                }
                sendJsonMessage(payload)
            }
        }
        setSelectedPiece(null)
        setMoveText('')
    }

    return <div className={'flex flex-col gap-2'}>
        <div className={'border-2 border-black grid grid-cols-3 gap-2'}>
            {game.board.map((piece) => {
                if (piece.color === playerColor) {
                    return <div className={'flex flex-row'}>
                        <input type="radio" name="piece" value={JSON.stringify(piece)}
                               onChange={handlePieceSelection}/>
                        <p>{piece.color} {piece.type} on {piece.column.toUpperCase()}{piece.row}</p>
                    </div>
                } else {
                    return <p>{piece.color} {piece.type} on {piece.column.toUpperCase()}{piece.row}</p>
                }
            })}
        </div>
        {selectedPiece && <div className={'flex flex-col border-2 border-black p-2 gap-2'}>
            <h4>You have selected your {selectedPiece.type} on {selectedPiece.column.toUpperCase()}{selectedPiece.row}</h4>
            <div className={'flex flex-row gap-2 justify-center items-center'}>
                <label>Move to:</label>
                <input type='text' className={'border-2 border-blue-600'} onChange={handleMoveTextChange}/>
                <button className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white'} onClick={handleMove}>Move</button>
            </div>
        </div>}
    </div>
}

export default Board