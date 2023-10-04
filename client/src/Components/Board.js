import React, {useEffect, useState} from "react";
import {FaRegChessPawn, FaRegChessKnight, FaRegChessBishop, FaRegChessRook, FaRegChessKing, FaRegChessQueen, 
    FaChessPawn, FaChessKnight, FaChessBishop, FaChessRook, FaChessKing, FaChessQueen,
    } from "react-icons/fa6";

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

    const getIcon = (row, col) => {
        const piece = game.board.find(piece => {
            const alphabet = "abcdefgh"
            return piece.row === row && piece.column.toLowerCase() === alphabet[col-1]
        })
        if(piece){
            const color = piece.color
            if (color === 'white'){
                switch (piece.type){
                    case 'knight':
                        return <FaRegChessKnight className="text-5xl"/>
                    case 'pawn':
                        return <FaRegChessPawn className="text-5xl"/>
                    case 'rook':
                        return <FaRegChessRook className="text-5xl"/>
                    case 'bishop':
                        return <FaRegChessBishop className="text-5xl"/>
                    case 'queen':
                        return <FaRegChessQueen className="text-5xl"/>
                    case 'king':
                        return <FaRegChessKing className="text-5xl"/>
                }
            }
            if (color === 'black'){
                switch (piece.type){
                    case 'knight':
                        return <FaChessKnight className="text-5xl"/>
                    case 'pawn':
                        return <FaChessPawn className="text-5xl"/>
                    case 'rook':
                        return <FaChessRook className="text-5xl"/>
                    case 'bishop':
                        return <FaChessBishop className="text-5xl"/>
                    case 'queen':
                        return <FaChessQueen className="text-5xl"/>
                    case 'king':
                        return <FaChessKing className="text-5xl"/>
                }
            }
        }
        
    }

    return <div className={'flex flex-col'}>
        {playerColor === 'white'?
         [8,7,6,5,4,3,2,1].map(row => {
            return <div className='flex flex-row'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(col => {
                    return <div className={`${(row+col)%2? 'bg-white' : 'bg-green-600'} w-16 h-16 hover:bg-green-400 flex justify-center items-center`}>
                        {
                            <div>
                            {getIcon(row, col)}
                           </div>
                        }
                </div>
                })}
            </div>
         }) 
         :
         [1,2,3,4,5,6,7,8].map(row => {
            return <div className='flex flex-row'>
                {[8,7,6,5,4,3,2,1].map(col => {
                    return <div className={`${(row+col)%2? 'bg-white' : 'bg-green-600'} w-16 h-16 hover:bg-green-400 flex justify-center items-center`}>
                        {
                            <div>
                           {getIcon(row, col)}
                           </div>
                        }
                </div>
                })}
            </div>
         }) 
        }

        {/*
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
        </div>} */}
    </div>
}

export default Board