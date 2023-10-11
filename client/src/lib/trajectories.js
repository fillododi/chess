import { findPiece, charToNum } from "./utils"

const getSquare = (selectedPiece) => {
    return {'row': selectedPiece.row, 'column': charToNum(selectedPiece.column)};
}

const getSquareUp = (square) => {
    if (square){
        return {'row': square.row + 1, 'col': charToNum(square.column)};
    } else return null;
}

const get2SquareUp = (square) => {
    if (square){
        return {'row': square.row + 2, 'col': charToNum(square.column)}
    } else return null;
}

const getSquareUpRight = (square) => {
    if (square){
        return {'row': square.row + 1, 'col': charToNum(square.column) + 1};
    } else return null;
}

const getSquareUpLeft = (square) => {
    if (square){
        return {'row': square.row + 1, 'col': charToNum(square.column) - 1};
    } else return null;
}

const getSquareDown = (square) => {
    if (square){
        return {'row': square.row - 1, 'col': charToNum(square.column)};
    } else return null;
}

const get2SquareDown = (square) => {
    if (square){
        return {'row': square.row - 2, 'col': charToNum(square.column)}
    } else return null;
        
}

const getSquareDownLeft = (square) => {
    if (square){
        return {'row': square.row - 1, 'col': charToNum(square.column) - 1};
    } else return null;
}

const getSquareDownRight = (square) => {
    if (square){
        return {'row': square.row - 1, 'col': charToNum(square.column) + 1};
    } else return null;
}


const getSquareRight = (square) => {
    if (square){
        return {'row': square.row, 'col': charToNum(square.column) + 1}
    } else return null;
}

const getSquareLeft = (square) => {
    if (square){
        return {'row': square.row, 'col': charToNum(square.column) - 1}
    } else return null;
}





export const trajectoryPawn = (selectedPiece, board) => {
    let possibleMoves = []
    const square = getSquare(selectedPiece);
    if(selectedPiece.color === 'white'){
        //move up
        const squareUp = getSquareUp(square);        
        if(!findPiece(board, squareUp.row, squareUp.col)){
            possibleMoves.push(squareUp)
            //move up by 2
            if (square.row === 2){

                const square2Ups = get2SquareUp(square);
                if(!findPiece(board, square2Ups.row, square2Ups.col)){
                    possibleMoves.push(square2Ups)
                }
            }
        }
        //move diagonally to kill
        const squareUpRight = getSquareUpRight(square);
        let pieceToKill = findPiece(board, squareUpRight.row, squareUpRight.col);
        if(pieceToKill && pieceToKill.color === 'black'){
            possibleMoves.push(squareUpRight);
        }
        const squareUpLeft = getSquareUpLeft(square);
        pieceToKill = findPiece(board, squareUpLeft.row, squareUpLeft.col);
        if(pieceToKill && pieceToKill.color === 'black'){
            possibleMoves.push(squareUpLeft)
        }
    } else { // PEZZO NERO
        const squareDown = getSquareDown(square);
        if(!findPiece(board, squareDown.row, squareDown.col)){
            possibleMoves.push(squareDown)
            // down by 2
            if (square.row === 7){

                const square2Downs = get2SquareDown(square);
                if(!findPiece(board, square2Downs.row, square2Downs.col)){
                    possibleMoves.push(square2Downs)
                }
            }
        }
        //move diagonally to kill
        const squareDownRight = getSquareDownRight(square)
        let pieceToKill = findPiece(board, squareDownRight.row, squareDownRight.col);
        if(pieceToKill && pieceToKill.color === 'white'){
            possibleMoves.push(squareDownRight)
        }
        const squareDownLeft = getSquareDownLeft(square)
        pieceToKill = findPiece(board, squareDownLeft.row, squareDownLeft.col);
        if(pieceToKill && pieceToKill.color === 'white'){
            possibleMoves.push(squareDownLeft)
        }
    }
    return possibleMoves
}


export const trajectoryBishop = (selectedPiece, board) => {
    let possibleMoves = [];
    // UP RIGHT
    
    // UP LEFT
    // DOWN RIGHT
    // DOWN LEFT
}


export const trajectoryKing = (selectedPiece, board) => {}


export const trajectoryKnight = (selectedPiece, board) => {}


export const trajectoryRook = (selectedPiece, board) => {}