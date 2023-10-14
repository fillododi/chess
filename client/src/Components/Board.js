import React, {useEffect, useState} from "react";
import {FaRegChessPawn, FaRegChessKnight, FaRegChessBishop, FaRegChessRook, FaRegChessKing, FaRegChessQueen, 
    FaChessPawn, FaChessKnight, FaChessBishop, FaChessRook, FaChessKing, FaChessQueen,
    } from "react-icons/fa6";

import { trajectoryBishop, trajectoryKing, trajectoryKnight, trajectoryPawn, trajectoryRook } from "../lib/trajectories";

const Board = ({game, playerColor, isActivePlayer, sendJsonMessage}) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [availableSquares, setAvailableSquares] = useState([])

    
    const trajectoryHandler = () => {
        if (!selectedPiece || !game.board) {
            setAvailableSquares([])
            return
        };
        switch (selectedPiece.type){
            case 'pawn':
                setAvailableSquares(trajectoryPawn(selectedPiece, game.board));
                break;
            case 'rook':
                setAvailableSquares(trajectoryRook(selectedPiece, game.board));
                break;
            case 'knight':
                setAvailableSquares(trajectoryKnight(selectedPiece, game.board));
                break;
            case 'bishop':
                setAvailableSquares(trajectoryBishop(selectedPiece, game.board));
                break;
            case 'queen':
                setAvailableSquares([...trajectoryRook(selectedPiece, game.board), ...trajectoryBishop(selectedPiece, game.board)]);
                break;
            case 'king':
                setAvailableSquares(trajectoryKing(selectedPiece, game.board));
                break;
            default:
                break;
        }
    }

    useEffect(trajectoryHandler, [selectedPiece]);


    const handleMove = (row, col) => {
        if(selectedPiece && isActivePlayer){ //se si può muovere
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
                        "row": row,
                        "column": col.toLowerCase()
                    }
                }
            }
            sendJsonMessage(payload)
        }
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
                        return <FaRegChessKnight className="text-5xl pointer-events-none"/>
                    case 'pawn':
                        return <FaRegChessPawn className="text-5xl pointer-events-none"/>
                    case 'rook':
                        return <FaRegChessRook className="text-5xl pointer-events-none"/>
                    case 'bishop':
                        return <FaRegChessBishop className="text-5xl pointer-events-none"/>
                    case 'queen':
                        return <FaRegChessQueen className="text-5xl pointer-events-none"/>
                    case 'king':
                        return <FaRegChessKing className="text-5xl pointer-events-none"/>
                }
            }
            if (color === 'black'){
                switch (piece.type){
                    case 'knight':
                        return <FaChessKnight className="text-5xl pointer-events-none"/>
                    case 'pawn':
                        return <FaChessPawn className="text-5xl pointer-events-none"/>
                    case 'rook':
                        return <FaChessRook className="text-5xl pointer-events-none"/>
                    case 'bishop':
                        return <FaChessBishop className="text-5xl pointer-events-none"/>
                    case 'queen':
                        return <FaChessQueen className="text-5xl pointer-events-none"/>
                    case 'king':
                        return <FaChessKing className="text-5xl pointer-events-none"/>
                }
            }
        }
        
    }

    const getPieceByCoords = (row, col) => {
        return game.board.find(piece => piece.row === row && piece.column === col);
    }

    const handleClick = (row, col) => {
        const alphabet = "abcdefgh";
        const newCol = alphabet[col - 1];
        const piece = getPieceByCoords(row, newCol);
        if (!selectedPiece) {
            if (piece && piece.color === playerColor && isActivePlayer){
                setSelectedPiece(piece);
            }
        }
        else if (piece && piece.color === selectedPiece.color) { // SELEZIONO UN PEZZO DELLA MIA SQUADRA
            setSelectedPiece(piece);
        }
        else {
            handleMove(row, newCol)
            setSelectedPiece(null); // DESELEZIONE           
        }
    }
    

    return <div className={'flex flex-col'}>
        {playerColor === 'white'?
         [8,7,6,5,4,3,2,1].map(row => {
            return <div className='flex flex-row'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(col => {
                    return <div className={`${(row+col)%2? 'bg-white' : 'bg-green-600'} w-16 h-16 hover:bg-green-400 flex justify-center items-center`}
                    onClick={handleClick.bind(this, row, col)}>
                        {
                            <div className={`pointer-events-none w-full h-full flex justify-center items-center ${availableSquares.some(e => e.row === row && e.col === col) && 'bg-blue-200'}`}>
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
                    return <div className={`${(row+col)%2? 'bg-white' : 'bg-green-600'} w-16 h-16 hover:bg-green-400 flex justify-center items-center`}
                    onClick={handleClick.bind(this, row, col)}>
                        {
                            <div className={`pointer-events-none w-full h-full flex justify-center items-center ${availableSquares.some(e => e.row === row && e.col === col) && 'bg-blue-200'}`}>
                                {getIcon(row, col)}
                            </div>
                        }
                </div>
                })}
            </div>
         }) 
        }
    </div>
}

export default Board

