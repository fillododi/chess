import React, {useEffect, useState} from "react";
import {FaRegChessPawn, FaRegChessKnight, FaRegChessBishop, FaRegChessRook, FaRegChessKing, FaRegChessQueen, 
    FaChessPawn, FaChessKnight, FaChessBishop, FaChessRook, FaChessKing, FaChessQueen,
    } from "react-icons/fa6";

import {
    trajectoryBishop,
    trajectoryKing,
    trajectoryKnight,
    trajectoryPawn,
    trajectoryRook,
    getSquare,
    getSquareLeft, getSquareRight
} from "../lib/trajectories";
import {charToNum, findPiece} from "../lib/utils";

const Board = ({game, playerColor, isActivePlayer, sendJsonMessage}) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [availableSquares, setAvailableSquares] = useState([])
    const [showPromotion, setShowPromotion] = useState(false)
    const [promotion, setPromotion] = useState(null)
    const [selectedSquare, setSelectedSquare] = useState({'row': null, 'col': null})

    const getTrajectory = (piece, board) => {
        let squaresInTrajectory = []
        if (!piece || !board) {
            return []
        }
        switch (piece.type) {
            case 'pawn':
                squaresInTrajectory = trajectoryPawn(piece, board);
                break;
            case 'rook':
                squaresInTrajectory = trajectoryRook(piece, board);
                break;
            case 'knight':
                squaresInTrajectory = trajectoryKnight(piece, board);
                break;
            case 'bishop':
                squaresInTrajectory = trajectoryBishop(piece, board);
                break;
            case 'queen':
                squaresInTrajectory = [...trajectoryRook(piece, board), ...trajectoryBishop(piece, board)]
                break;
            case 'king':
                squaresInTrajectory = trajectoryKing(piece, board);
                break;
            default:
                break;
        }
        return squaresInTrajectory
    }

    const isSquareAttacked = (board, square) => {
        let isAttacked = false
        board.forEach(piece => {
            if(piece.color !== playerColor){
                getTrajectory(piece, board).forEach(move => {
                    if(move.row === square.row && move.col === charToNum(square.col)){
                        isAttacked = true
                    }
                })
            }
        })
        return isAttacked
    }

    const checkIfCheck = (board, color) => {
        let isCheck = false
        const kingToCheck = board.find(piece => piece.type === 'king' && piece.color === color)
        board.forEach(piece => {
            if(piece.color !== color){
                getTrajectory(piece, board).forEach(square => {
                    if(square.row === kingToCheck.row && square.col === charToNum(kingToCheck.column)) {
                        isCheck = true
                    }
                })
            }
        })
        return isCheck
    }

    const checkIfCheckAfterMove = (square) => {
        let virtualBoard = game.board.map(piece => Object.assign({}, piece))
        const virtualPiece = findPiece(virtualBoard, selectedPiece.row, charToNum(selectedPiece.column))
        const virtualPieceToKill = findPiece(virtualBoard, square.row, square.col)
        if(virtualPieceToKill){
            virtualBoard = virtualBoard.filter(piece => piece !== virtualPieceToKill)
        }
        virtualPiece.row = square.row
        virtualPiece.column = "abcdefgh"[square.col - 1]

        return checkIfCheck(virtualBoard, virtualPiece.color)
    }
    
    const getPossibleMoves = () => {
        const squaresInTrajectory = getTrajectory(selectedPiece, game.board)
        if (selectedPiece.type === 'king' && selectedPiece.canStillCastle) {
            const square = getSquare(selectedPiece)
            const squareLeft = getSquareLeft(square)
            const square2Left = getSquareLeft(squareLeft)
            const square3Left = getSquareLeft(square2Left)
            const squareRookLeft = getSquareLeft(square3Left)
            const pieceOnSquareRookLeft = findPiece(game.board, squareRookLeft.row, squareRookLeft.col)
            const squareRight = getSquareRight(square)
            const square2Right = getSquareRight(squareRight)
            const squareRookRight = getSquareRight(square2Right)
            const pieceOnSquareRookRight = findPiece(game.board, squareRookRight.row, squareRookRight.col)
            if(!isSquareAttacked(game.board, square)){
                if(pieceOnSquareRookLeft && pieceOnSquareRookLeft.type === 'rook' && pieceOnSquareRookLeft.canStillCastle){
                    if(!findPiece(game.board, squareLeft.row, squareLeft.col) &&
                        !findPiece(game.board, square2Left.row, square2Left.col) &&
                        !findPiece(game.board, square3Left.row, square3Left.col) &&
                        !isSquareAttacked(game.board, squareLeft) &&
                        !isSquareAttacked(game.board, square2Left)
                    ){
                        squaresInTrajectory.push(square2Left)
                    }
                }
                if(pieceOnSquareRookRight && pieceOnSquareRookRight.type === 'rook' && pieceOnSquareRookRight.canStillCastle){
                    if(!findPiece(game.board, squareRight.row, squareRight.col) &&
                        !findPiece(game.board, square2Right.row, square2Right.col) &&
                        !isSquareAttacked(game.board, squareRight) &&
                        !isSquareAttacked(game.board, square2Right)
                    ){
                        squaresInTrajectory.push(square2Right)
                    }
                }
            }
        }
        const possibleSquaresAfterCheck = squaresInTrajectory.filter(square => !checkIfCheckAfterMove(square))
        setAvailableSquares(possibleSquaresAfterCheck);
    }

    useEffect(()=>{
        if(selectedPiece){
            getPossibleMoves()
        } else {
            setAvailableSquares([])
        }
    }, [selectedPiece]);

    const handleSelectPromotion = (e) => {
        e.preventDefault()
        setPromotion(e.target.value)
    }

    useEffect(()=>{
        if(promotion){
            sendMoveRequest()
            setShowPromotion(false)
            setPromotion(null)
        }
    }, [promotion])

    const sendMoveRequest = () => {
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
                    "row": selectedSquare.row,
                    "column": selectedSquare.col.toLowerCase()
                },
                "promotion": promotion
            }
        }
        sendJsonMessage(payload)
        // DESELEZIONE
        setSelectedPiece(null);
        setSelectedSquare({'row': null, 'col': null})
    }

    const handleMove = () => {
        if(selectedPiece && isActivePlayer){ //se si può muovere
            if(selectedPiece.type === 'pawn' && (selectedSquare.row === 1 || selectedSquare.row === 8)){
                setShowPromotion(true)
            }
            else {
                sendMoveRequest()
            }
        }
    }

    useEffect(()=>{
        if(selectedSquare.row && selectedSquare.col){
            handleMove()
        }
    }, [selectedSquare])

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
                    default:
                        console.error(`Unrecognized piece type! Got: ${piece.type}`);
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
                    default:
                        console.error(`Unrecognized piece type! Got: ${piece.type}`);
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
            setSelectedSquare({'row': row, 'col': newCol})
        }
    }
    

    return <>
        <div className={'flex flex-col'}>
            {playerColor === 'white'?
             [8,7,6,5,4,3,2,1].map(row => {
                return <div className='flex flex-row' key={row}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(col => {
                        return <div key={col} className={`${(row+col)%2? 'bg-white' : 'bg-green-600'} w-16 h-16 hover:bg-green-400 flex justify-center items-center`}
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
                return <div key={row} className='flex flex-row'>
                    {[8,7,6,5,4,3,2,1].map(col => {
                        return <div key={col} className={`${(row+col)%2? 'bg-white' : 'bg-green-600'} w-16 h-16 hover:bg-green-400 flex justify-center items-center`}
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
        {showPromotion && <div className={'fixed flex flex-row top-1/2 left-1/2 border-2 border-blue-400 gap-x-2 -translate-y-1/2'}>
            <button value="knight" onClick={handleSelectPromotion} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaChessKnight className="text-xl pointer-events-none"/>
            </button>
            <button value="bishop" onClick={handleSelectPromotion} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaChessBishop className="text-xl pointer-events-none"/>
            </button>
            <button value='rook' onClick={handleSelectPromotion} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaChessRook className="text-xl pointer-events-none"/>
            </button>
            <button value='queen' onClick={handleSelectPromotion} className={'border-blue-600 border-2 rounded-md p-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'}>
                <FaChessQueen className="text-xl pointer-events-none"/>
            </button>
        </div>}
    </>
}

export default Board

