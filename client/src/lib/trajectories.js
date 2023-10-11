import { findPiece, charToNum } from "./utils"

const getSquareUp = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row + 1, 'col': charToNum(selectedPiece.column)};
    } else return null;
}

const get2SquareUp = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row + 2, 'col': charToNum(selectedPiece.column)}
    } else return null;
}

const getSquareUpRight = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row + 1, 'col': charToNum(selectedPiece.column) + 1};
    } else return null;
}

const getSquareUpLeft = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row + 1, 'col': charToNum(selectedPiece.column) - 1};
    } else return null;
}

const getSquareDown = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row - 1, 'col': charToNum(selectedPiece.column)};
    } else return null;
}

const get2SquareDown = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row - 2, 'col': charToNum(selectedPiece.column)}
    } else return null;
        
}

const getSquareDownLeft = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row - 1, 'col': charToNum(selectedPiece.column) - 1};
    } else return null;
}

const getSquareDownRight = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row - 1, 'col': charToNum(selectedPiece.column) + 1};
    } else return null;
}


const getSquareRight = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row, 'col': charToNum(selectedPiece.column) + 1}
    } else return null;
}

const getSquareLeft = (selectedPiece) => {
    if (selectedPiece){
        return {'row': selectedPiece.row, 'col': charToNum(selectedPiece.column) - 1}
    } else return null;
}





export const trajectoryPawn = (selectedPiece, board) => {
    let possibleMoves = []
    if(selectedPiece.color === 'white'){
        //move up
        const squareUp = getSquareUp(selectedPiece);        
        if(!findPiece(board, squareUp.row, squareUp.col)){
            possibleMoves.push(squareUp)
            console.log('can move up')
            //move up by 2
            if (selectedPiece.row === 2){

                const square2Ups = get2SquareUp(selectedPiece);
                if(!findPiece(board, square2Ups.row, square2Ups.col)){
                    possibleMoves.push(square2Ups)
                    console.log('can move up by 2')
                }
            }
        }
        //move diagonally to kill
        const squareUpRight = getSquareUpRight(selectedPiece);
        let pieceToKill = findPiece(board, squareUpRight.row, squareUpRight.col);
        if(pieceToKill && pieceToKill.color === 'black'){
            possibleMoves.push(squareUpRight);
            console.log('can move up right')
        }
        const squareUpLeft = getSquareUpLeft(selectedPiece);
        pieceToKill = findPiece(board, squareUpLeft.row, squareUpLeft.col);
        if(pieceToKill && pieceToKill.color === 'black'){
            possibleMoves.push(squareUpLeft)
            console.log('can move up left')
        }
    } else { // PEZZO NERO
        const squareDown = getSquareDown(selectedPiece);
        if(!findPiece(board, squareDown.row, squareDown.col)){
            possibleMoves.push(squareDown)
            console.log('can move down')
            // down by 2
            if (selectedPiece.row === 7){

                const square2Downs = get2SquareDown(selectedPiece);
                if(!findPiece(board, square2Downs.row, square2Downs.col)){
                    possibleMoves.push(square2Downs)
                    console.log('can move down by 2')
                }
            }
        }
        //move diagonally to kill
        const squareDownRight = getSquareDownRight(selectedPiece)
        let pieceToKill = findPiece(board, squareDownRight.row, squareDownRight.col);
        if(pieceToKill && pieceToKill.color === 'white'){
            possibleMoves.push(squareDownRight)
            console.log('can move down right')
        }
        const squareDownLeft = getSquareDownLeft(selectedPiece)
        pieceToKill = findPiece(board, squareDownLeft.row, squareDownLeft.col);
        if(pieceToKill && pieceToKill.color === 'white'){
            possibleMoves.push(squareDownLeft)
            console.log('can move down left')
        }
    }
    return possibleMoves
}


export const trajectoryBishop = (selectedPiece, board) => {}


export const trajectoryKing = (selectedPiece, board) => {}


export const trajectoryKnight = (selectedPiece, board) => {}


export const trajectoryRook = (selectedPiece, board) => {}