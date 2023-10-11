import { findPiece, charToNum } from "./utils"

const getSquare = (selectedPiece) => {
    return {'row': selectedPiece.row, 'col': charToNum(selectedPiece.column)};
}

const getSquareUp = (square) => {
    if (square){
        return {'row': square.row + 1, 'col': charToNum(square.col)};
    } else return null;
}

const get2SquareUp = (square) => {
    if (square){
        return {'row': square.row + 2, 'col': charToNum(square.col)}
    } else return null;
}

const getSquareUpRight = (square) => {
    if (square){
        return {'row': square.row + 1, 'col': charToNum(square.col) + 1};
    } else return null;
}

const getSquareUpLeft = (square) => {
    if (square){
        return {'row': square.row + 1, 'col': charToNum(square.col) - 1};
    } else return null;
}

const getSquareDown = (square) => {
    if (square){
        return {'row': square.row - 1, 'col': charToNum(square.col)};
    } else return null;
}

const get2SquareDown = (square) => {
    if (square){
        return {'row': square.row - 2, 'col': charToNum(square.col)}
    } else return null;
        
}

const getSquareDownLeft = (square) => {
    if (square){
        return {'row': square.row - 1, 'col': charToNum(square.col) - 1};
    } else return null;
}

const getSquareDownRight = (square) => {
    if (square){
        return {'row': square.row - 1, 'col': charToNum(square.col) + 1};
    } else return null;
}


const getSquareRight = (square) => {
    if (square){
        return {'row': square.row, 'col': charToNum(square.col) + 1}
    } else return null;
}

const getSquareLeft = (square) => {
    if (square){
        return {'row': square.row, 'col': charToNum(square.col) - 1}
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
    let square = getSquare(selectedPiece);
    // UP RIGHT
    let offSet = 1;
    while (square.row + offSet <= 8 && square.col + offSet <= 8 && !findPiece(board, square.row + offSet, square.col + offSet)){
        possibleMoves.push({'row': square.row + offSet, 'col': square.col + offSet});
        offSet++;
    }
    if (square.row + offSet <= 8 && square.col + offSet <= 8 && findPiece(board, square.row + offSet, square.col + offSet) && findPiece(board, square.row + offSet, square.col + offSet).color !== selectedPiece.color){
        possibleMoves.push({'row': square.row + offSet, 'col': square.col + offSet});
    }
    // UP LEFT
    offSet = 1;
    while(square.row + offSet <= 8 && square.col - offSet >= 1 && !findPiece(board, square.row + offSet, square.col - offSet)){
        possibleMoves.push({'row': square.row + offSet, 'col': square.col - offSet});
        offSet++;
    }
    if(square.row + offSet <= 8 && square.col - offSet >= 1 && findPiece(board, square.row + offSet, square.col - offSet) && findPiece(board, square.row + offSet, square.col - offSet).color !== selectedPiece.color){
        possibleMoves.push({'row': square.row + offSet, 'col': square.col - offSet});
    }
    // DOWN RIGHT
    offSet = 1;
    while(square.row - offSet >= 1 && square.col + offSet <= 8 && !findPiece(board, square.row - offSet, square.col + offSet)){
        possibleMoves.push({'row': square.row - offSet, 'col': square.col + offSet});
        offSet++;
    }
    if(square.row - offSet >= 1 && square.col + offSet <= 8 && findPiece(board, square.row - offSet, square.col + offSet) && findPiece(board, square.row - offSet, square.col + offSet).color !== selectedPiece.color){
        possibleMoves.push({'row': square.row - offSet, 'col': square.col + offSet});
    }
    // DOWN LEFT
    offSet = 1;
    while(square.row - offSet >= 1 && square.col - offSet >= 1 && !findPiece(board, square.row - offSet, square.col - offSet)){
        possibleMoves.push({'row': square.row - offSet, 'col': square.col - offSet});
        offSet++;
    }
    if(square.row - offSet >= 1 && square.col - offSet >= 1 && findPiece(board, square.row - offSet, square.col - offSet) && findPiece(board, square.row - offSet, square.col - offSet).color !== selectedPiece.color){
        possibleMoves.push({'row': square.row - offSet, 'col': square.col - offSet});
    }
    return possibleMoves;
}


export const trajectoryKing = (selectedPiece, board) => {}


export const trajectoryKnight = (selectedPiece, board) => {
    let possibleMoves = []
    const square = getSquare(selectedPiece)
    console.log(getSquareUp(square))
    const squareUUL = getSquareLeft(get2SquareUp(square))
    let piece = findPiece(board, squareUUL.row, squareUUL.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareUUL)
    }
    const squareUUR = getSquareRight(get2SquareUp(square))
    piece = findPiece(board, squareUUR.row, squareUUR.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareUUR)
    }
    const squareURR = getSquareRight(getSquareRight(getSquareUp(square)))
    piece = findPiece(board, squareURR.row, squareURR.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareURR)
    }
    const squareDRR = getSquareRight(getSquareRight(getSquareDown(square)))
    piece = findPiece(board, squareDRR.row, squareDRR.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareDRR)
    }
    const squareDDR = getSquareRight(get2SquareDown(square))
    piece = findPiece(board, squareDDR.row, squareDDR.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareDDR)
    }
    const squareDDL = getSquareLeft(get2SquareDown(square))
    piece = findPiece(board, squareDDL.row, squareDDL.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareDDL)
    }
    const squareDLL = getSquareLeft(getSquareLeft(getSquareDown(square)))
    piece = findPiece(board, squareDLL.row, squareDLL.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareDLL)
    }
    const squareULL = getSquareLeft(getSquareLeft(getSquareUp(square)))
    piece = findPiece(board, squareULL.row, squareULL.col)
    if(!piece || piece.color != selectedPiece.color){
        possibleMoves.push(squareULL)
    }
    console.log(possibleMoves)
    return possibleMoves
}


export const trajectoryRook = (selectedPiece, board) => {}