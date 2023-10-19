import {Board} from "./Board.js";

class Piece {
    constructor(color, square){
        this.color = color
        this.square = square
        this.type = null
    }

    getSquare(){
        return this.square
    }

    getType(){
        return this.type
    }

    getColor(){
        return this.color
    }

    getPossibleMoves(specialMoves=true){ //definito nelle sottoclassi
        return []
    }

    move(square){
        let possibleMoves = this.getPossibleMoves()
        console.log('possible moves are', possibleMoves.map(move => move.newSquare.getPosition()))
        const newMoves = possibleMoves.filter(move => {
            const virtualBoard = new Board(square.board.game) //crea nuova scacchiera virtuale
            const oldSquare = this.getSquare() //casella di questo pezzo prima della mossa
            const oldRow = oldSquare.getRow()
            const oldCol = oldSquare.getColumn()
            const newRow = move.newSquare.getRow()
            const newCol = move.newSquare.getColumn()
            virtualBoard.changeBoard(oldSquare.getBoard().getpieceList())//copia questa scacchiera nella nuova
            const virtualPiece = virtualBoard.findPieceByRowCol(oldRow, oldCol) //questo pezzo nella nuova scacchiera
            const virtualNewSquare = virtualBoard.findSquare(newRow, newCol) //il pezzo a cui si deve spostare nella nuova scacchiera
            virtualPiece.handleMove({'newSquare': virtualNewSquare}) //muove il pezzo nella nuova scacchiera (handleMove per non controllare gli scacchi prima di muovere)
            const stillCheck = virtualBoard.getPlayerColorUnderCheck() === this.color //guarda se è ancora scacco dopo aver mosso
            return !stillCheck //se non è più scacco tiene la mossa
        })
        possibleMoves = newMoves
        console.log('filtering out checks possible moves are now', possibleMoves.map(move => move.newSquare.getPosition()))
        const move = possibleMoves.find(move => move.newSquare.getRow() === square.getRow() && move.newSquare.getColumn() === square.getColumn())
        if(move){
            if(this.type === 'pawn'){
                this.square.board.counter50Moves = 0
            } else {
                this.square.board.counter50Moves++
            }
            if(move.moveType && move.moveType.type === 'castle'){
                const rookToMove = move.moveType.rook
                const newRookPosition = move.moveType.newRookPosition
                rookToMove.handleMove({'newSquare': newRookPosition})
            }
            if(move.moveType && move.moveType.type === 'enpassant'){
                console.log(move)
                const pawnToKill = move.moveType.otherPawn
                this.square.board.killPiece(pawnToKill)
            }
            this.handleMove(move)
            return true
        } else {
            return false
        }
    }

    handleMove(move){
        if(move.newSquare.getPiece()){
            const pieceToKill = move.newSquare.getPiece()
            this.square.getBoard().killPiece(pieceToKill)
        }
        this.square = move.newSquare
    }

    print(){
        console.log(this.color, this.type, " is in ", this.getSquare().getPosition())
    }
}

export class Pawn extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "pawn"
    }
    getPossibleMoves(specialMoves=true) {
        let possibleMoves = []
        const board = this.square.getBoard()
        const lastMove = board.game.getLastMove()
        if(this.color === 'white'){
            //move up
            const squareUp = this.square.getSquareUp()
            if(squareUp && !board.findPiece(squareUp)){
                possibleMoves.push({'newSquare': squareUp})
                //move up by 2
                const square2Ups = squareUp.getSquareUp()
                if(square2Ups && !board.findPiece(square2Ups) && this.square.getRow() === 2){
                    possibleMoves.push({'newSquare': square2Ups})
                }
            }
            //move diagonally to kill
            const squareUpRight = this.square.getSquareUpRight()
            if(squareUpRight){
                const pieceToKill = board.findPiece(squareUpRight)
                const canEnPassant = lastMove && lastMove.piece.type === 'pawn' &&
                    lastMove.prevPosition.column === lastMove.nextPosition.column && lastMove.prevPosition.column === squareUpRight.getColumn() &&
                    lastMove.prevPosition.row === squareUpRight.getRow() + 1 &&
                    lastMove.nextPosition.row === squareUpRight.getRow() - 1
                if((pieceToKill && pieceToKill.getColor() === 'black') || canEnPassant){
                    let newMove = {'newSquare': squareUpRight}
                    if(canEnPassant){
                        const otherPawnSquare = board.findSquare(lastMove.nextPosition.row, lastMove.nextPosition.column)
                        const otherPawn = board.findPiece(otherPawnSquare)
                        newMove.moveType = {
                            'type': 'enpassant',
                            'otherPawn': otherPawn
                        }
                    }
                    possibleMoves.push(newMove)
                }
            }
            const squareUpLeft = this.square.getSquareUpLeft()
            if(squareUpLeft){
                const pieceToKill = board.findPiece(squareUpLeft)
                const canEnPassant = lastMove && lastMove.piece.type === 'pawn' &&
                    lastMove.prevPosition.column === lastMove.nextPosition.column && lastMove.prevPosition.column === squareUpLeft.getColumn() &&
                    lastMove.prevPosition.row === squareUpLeft.getRow() + 1 &&
                    lastMove.nextPosition.row === squareUpLeft.getRow() - 1
                if((pieceToKill && pieceToKill.getColor() === 'black') || canEnPassant){
                    let newMove = {'newSquare': squareUpLeft}
                    if(canEnPassant){
                        const otherPawnSquare = board.findSquare(lastMove.nextPosition.row, lastMove.nextPosition.column)
                        const otherPawn = board.findPiece(otherPawnSquare)
                        newMove.moveType = {
                            'type': 'enpassant',
                            'otherPawn': otherPawn
                        }
                    }
                    possibleMoves.push(newMove)
                }
            }
        } else {
            const squareDown = this.square.getSquareDown()
            if(squareDown && !board.findPiece(squareDown)){
                possibleMoves.push({'newSquare': squareDown})
                const square2Downs = squareDown.getSquareDown()
                if(square2Downs && !board.findPiece(square2Downs) && this.square.getRow() === 7){
                    possibleMoves.push({'newSquare': square2Downs})
                }
            }
            //move diagonally to kill
            const squareDownRight = this.square.getSquareDownRight()
            if(squareDownRight){
                const pieceToKill = board.findPiece(squareDownRight)
                const canEnPassant = lastMove && lastMove.piece.type === 'pawn' &&
                    lastMove.prevPosition.column === lastMove.nextPosition.column && lastMove.prevPosition.column === squareDownRight.getColumn() &&
                    lastMove.prevPosition.row === squareDownRight.getRow() - 1 &&
                    lastMove.nextPosition.row === squareDownRight.getRow() + 1
                if((pieceToKill && pieceToKill.getColor() === 'white') || canEnPassant){
                    let newMove = {'newSquare': squareDownRight}
                    if(canEnPassant){
                        const otherPawnSquare = board.findSquare(lastMove.nextPosition.row, lastMove.nextPosition.column)
                        const otherPawn = board.findPiece(otherPawnSquare)
                        newMove.moveType = {
                            'type': 'enpassant',
                            'otherPawn': otherPawn
                        }
                    }
                    possibleMoves.push(newMove)
                }
            }
            const squareDownLeft = this.square.getSquareDownLeft()
            if(squareDownLeft){
                const pieceToKill = board.findPiece(squareDownLeft)
                const canEnPassant = lastMove && lastMove.piece.type === 'pawn' &&
                    lastMove.prevPosition.column === lastMove.nextPosition.column && lastMove.prevPosition.column === squareDownLeft.getColumn() &&
                    lastMove.prevPosition.row === squareDownLeft.getRow() - 1 &&
                    lastMove.nextPosition.row === squareDownLeft.getRow() + 1
                if((pieceToKill && pieceToKill.getColor() === 'white') || canEnPassant){
                    let newMove = {'newSquare': squareDownLeft}
                    if(canEnPassant){
                        const otherPawnSquare = board.findSquare(lastMove.nextPosition.row, lastMove.nextPosition.column)
                        const otherPawn = board.findPiece(otherPawnSquare)
                        newMove.moveType = {
                            'type': 'enpassant',
                            'otherPawn': otherPawn
                        }
                    }
                    possibleMoves.push(newMove)
                }
            }
        }
        return possibleMoves
    }
}

export class Rook extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "rook"
        this.hasMoved = false
    }

    handleMove(move){
        super.handleMove(move)
        this.hasMoved = true
    }

    getPossibleMoves(specialMoves=true) {
        let possibleMoves = []
        let squareUp = this.square.getSquareUp()
        let pieceOnSquareUp = null
        while(squareUp){
            pieceOnSquareUp = squareUp.getPiece()
            if(pieceOnSquareUp){
                if (pieceOnSquareUp.color != this.color){
                    possibleMoves.push({'newSquare': squareUp})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareUp})
                squareUp = squareUp.getSquareUp()
            }
        }
        let squareDown = this.square.getSquareDown()
        let pieceOnSquareDown = null
        while(squareDown){
            pieceOnSquareDown = squareDown.getPiece()
            if(pieceOnSquareDown){
                if (pieceOnSquareDown.color != this.color){
                    possibleMoves.push({'newSquare': squareDown})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareDown})
                squareDown = squareDown.getSquareDown()
            }
        }
        let squareRight = this.square.getSquareRight()
        let pieceOnSquareRight = null
        while(squareRight){
            pieceOnSquareRight = squareRight.getPiece()
            if(pieceOnSquareRight){
                if (pieceOnSquareRight.color != this.color){
                    possibleMoves.push({'newSquare': squareRight})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareRight})
                squareRight = squareRight.getSquareRight()
            }
        }
        let squareLeft = this.square.getSquareLeft()
        let pieceOnSquareLeft = null
        while(squareLeft){
            pieceOnSquareLeft = squareLeft.getPiece()
            if(pieceOnSquareLeft){
                if (pieceOnSquareLeft.color != this.color){
                    possibleMoves.push({'newSquare': squareLeft})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareLeft})
                squareLeft = squareLeft.getSquareLeft()
            }
        }
        return possibleMoves
    }
}

export class Bishop extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "bishop"
    }
    getPossibleMoves(specialMoves=true) {
        let possibleMoves = []
        let squareUpRight = this.square.getSquareUpRight()
        let pieceOnSquareUpRight = null
        while(squareUpRight){
            pieceOnSquareUpRight = squareUpRight.getPiece()
            if(pieceOnSquareUpRight){
                if (pieceOnSquareUpRight.color != this.color){
                    possibleMoves.push({'newSquare': squareUpRight})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareUpRight})
                squareUpRight = squareUpRight.getSquareUpRight()
            }
        }
        let squareDownRight = this.square.getSquareDownRight()
        let pieceOnSquareDownRight = null
        while(squareDownRight){
            pieceOnSquareDownRight = squareDownRight.getPiece()
            if(pieceOnSquareDownRight){
                if (pieceOnSquareDownRight.color != this.color){
                    possibleMoves.push({'newSquare': squareDownRight})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareDownRight})
                squareDownRight = squareDownRight.getSquareDownRight()
            }
        }
        let squareUpLeft = this.square.getSquareUpLeft()
        let pieceOnSquareUpLeft = null
        while(squareUpLeft){
            pieceOnSquareUpLeft = squareUpLeft.getPiece()
            if(pieceOnSquareUpLeft){
                if (pieceOnSquareUpLeft.color != this.color){
                    possibleMoves.push({'newSquare': squareUpLeft})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareUpLeft})
                squareUpLeft = squareUpLeft.getSquareUpLeft()
            }
        }
        let squareDownLeft = this.square.getSquareDownLeft()
        let pieceOnSquareDownLeft = null
        while(squareDownLeft){
            pieceOnSquareDownLeft = squareDownLeft.getPiece()
            if(pieceOnSquareDownLeft){
                if (pieceOnSquareDownLeft.color != this.color){
                    possibleMoves.push({'newSquare': squareDownLeft})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareDownLeft})
                squareDownLeft = squareDownLeft.getSquareDownLeft()
            }
        }
        return possibleMoves
    }
}

export class Knight extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "knight"
    }

    getPossibleMoves(specialMoves=true) {
        let possibleMoves = []
        const squareUp = this.square.getSquareUp()
        if(squareUp){
            const square2Ups = squareUp.getSquareUp()
            if(square2Ups){
                if(square2Ups.getSquareLeft()){
                    const piece = square2Ups.getSquareLeft().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': square2Ups.getSquareLeft()})
                    }
                }
                if(square2Ups.getSquareRight()){
                    const piece = square2Ups.getSquareRight().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': square2Ups.getSquareRight()})
                    }
                }
            }
            if(squareUp.getSquareLeft()){
                if (squareUp.getSquareLeft().getSquareLeft()){
                    const piece = squareUp.getSquareLeft().getSquareLeft().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': squareUp.getSquareLeft().getSquareLeft()})
                    }
                }
            }
            if(squareUp.getSquareRight()){
                if (squareUp.getSquareRight().getSquareRight()){
                    const piece = squareUp.getSquareRight().getSquareRight().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': squareUp.getSquareRight().getSquareRight()})
                    }
                }
            }
        }
        const squareDown = this.square.getSquareDown()
        if(squareDown){
            const square2Downs = squareDown.getSquareDown()
            if(square2Downs){
                if(square2Downs.getSquareLeft()){
                    const piece = square2Downs.getSquareLeft().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': square2Downs.getSquareLeft()})
                    }
                }
                if(square2Downs.getSquareRight()){
                    const piece = square2Downs.getSquareRight().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': square2Downs.getSquareRight()})
                    }
                }
            }
            if(squareDown.getSquareLeft()){
                if (squareDown.getSquareLeft().getSquareLeft()){
                    const piece = squareDown.getSquareLeft().getSquareLeft().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': squareDown.getSquareLeft().getSquareLeft()})
                    }
                }
            }
            if(squareDown.getSquareRight()){
                if (squareDown.getSquareRight().getSquareRight()){
                    const piece = squareDown.getSquareRight().getSquareRight().getPiece()
                    if(!piece || piece.getColor() != this.color){
                        possibleMoves.push({'newSquare': squareDown.getSquareRight().getSquareRight()})
                    }
                }
            }
        }
        return possibleMoves
    }
}

export class King extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "king"
        this.hasMoved = false
    }

    handleMove(move){
        super.handleMove(move)
        this.hasMoved = true
    }

    getPossibleMoves(specialMoves = true) {
        let possibleMoves = []
        const squareUp = this.square.getSquareUp()
        if(squareUp){
            let pieceOnSquareUp = squareUp.getPiece()
            if(!pieceOnSquareUp || pieceOnSquareUp.color != this.color){
                possibleMoves.push({'newSquare': squareUp})
            }
        }
        const squareUpRight = this.square.getSquareUpRight()
        if(squareUpRight){
            let pieceOnSquareUpRight = squareUpRight.getPiece()
            if(!pieceOnSquareUpRight || pieceOnSquareUpRight.color != this.color){
                possibleMoves.push({'newSquare': squareUpRight})
            }
        }
        const squareRight = this.square.getSquareRight()
        if(squareRight){
            let pieceOnSquareRight = squareRight.getPiece()
            if(!pieceOnSquareRight || pieceOnSquareRight.color != this.color){
                possibleMoves.push({'newSquare': squareRight})
            }
        }
        const squareDownRight = this.square.getSquareDownRight()
        if(squareDownRight){
            let pieceOnSquareDownRight = squareDownRight.getPiece()
            if(!pieceOnSquareDownRight || pieceOnSquareDownRight.color != this.color){
                possibleMoves.push({'newSquare': squareDownRight})
            }
        }
        const squareDown = this.square.getSquareDown()
        if(squareDown){
            let pieceOnSquareDown = squareDown.getPiece()
            if(!pieceOnSquareDown || pieceOnSquareDown.color != this.color){
                possibleMoves.push({'newSquare': squareDown})
            }
        }
        const squareDownLeft = this.square.getSquareDownLeft()
        if(squareDownLeft){
            let pieceOnSquareDownLeft = squareDownLeft.getPiece()
            if(!pieceOnSquareDownLeft || pieceOnSquareDownLeft.color != this.color){
                possibleMoves.push({'newSquare': squareDownLeft})
            }
        }
        const squareLeft = this.square.getSquareLeft()
        if(squareLeft){
            let pieceOnSquareLeft = squareLeft.getPiece()
            if(!pieceOnSquareLeft || pieceOnSquareLeft.color != this.color){
                possibleMoves.push({'newSquare': squareLeft})
            }
        }
        const squareUpLeft = this.square.getSquareUpLeft()
        if(squareUpLeft){
            let pieceOnSquareUpLeft = squareUpLeft.getPiece()
            if(!pieceOnSquareUpLeft || pieceOnSquareUpLeft.color != this.color){
                possibleMoves.push({'newSquare': squareUpLeft})
            }
        }
        const otherColor = this.color === 'white'? 'black' : 'white'
        const board = this.getSquare().getBoard()
        if(specialMoves && !this.hasMoved && !board.getAttackedSquaresByColor(otherColor).includes(this.square)){
            const squareRight = this.square.getSquareRight()
            if(squareRight && !squareRight.getPiece() && !board.getAttackedSquaresByColor(otherColor).includes(squareRight)){
                const square2Right = squareRight.getSquareRight()
                if(square2Right){
                    const pieceOnSquare2Right = square2Right.getPiece()
                    if(!pieceOnSquare2Right && !board.getAttackedSquaresByColor(otherColor).includes(square2Right)){
                        const square3Right = square2Right.getSquareRight()
                        if(square3Right){
                            const pieceOnSquare3Right = square3Right.getPiece()
                            if(pieceOnSquare3Right && pieceOnSquare3Right.type === 'rook' && pieceOnSquare3Right.color === this.color && pieceOnSquare3Right.hasMoved === false){
                                possibleMoves.push({'newSquare': square2Right, 'moveType': {
                                        'type': 'castle',
                                        'rook': pieceOnSquare3Right,
                                        'newRookPosition': squareRight
                                    }})
                            }
                        }
                    }
                }
            }
            const squareLeft = this.square.getSquareLeft()
            if(squareLeft && !squareLeft.getPiece() &&!board.getAttackedSquaresByColor(otherColor).includes(squareLeft)){
                const square2Left = this.square.getSquareLeft().getSquareLeft()
                if(square2Left){
                    const pieceOnSquare2Left = square2Left.getPiece()
                    if(!pieceOnSquare2Left &&!board.getAttackedSquaresByColor(otherColor).includes(square2Left)){
                        if(square2Left.getSquareLeft()){
                            const square4Left = square2Left.getSquareLeft().getSquareLeft()
                            if(square4Left){
                                const pieceOnSquare4Left = square4Left.getPiece()
                                if(square4Left && pieceOnSquare4Left && pieceOnSquare4Left.type === 'rook' && pieceOnSquare4Left.color === this.color && pieceOnSquare4Left.hasMoved === false){
                                    possibleMoves.push({'newSquare': square2Left, 'moveType': {
                                            'type': 'castle',
                                            'rook': pieceOnSquare4Left,
                                            'newRookPosition': squareLeft
                                        }})
                                }
                            }
                        }
                    }
                }
            }
        }
        return possibleMoves
    }
}

export class Queen extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "queen"
    }
    getPossibleMoves(specialMoves = true) {
        let possibleMoves = []
        let squareUp = this.square.getSquareUp()
        let pieceOnSquareUp = null
        while(squareUp){
            pieceOnSquareUp = squareUp.getPiece()
            if(pieceOnSquareUp){
                if (pieceOnSquareUp.color != this.color){
                    possibleMoves.push({'newSquare': squareUp})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareUp})
                squareUp = squareUp.getSquareUp()
            }
        }
        let squareDown = this.square.getSquareDown()
        let pieceOnSquareDown = null
        while(squareDown){
            pieceOnSquareDown = squareDown.getPiece()
            if(pieceOnSquareDown){
                if (pieceOnSquareDown.color != this.color){
                    possibleMoves.push({'newSquare': squareDown})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareDown})
                squareDown = squareDown.getSquareDown()
            }
        }
        let squareRight = this.square.getSquareRight()
        let pieceOnSquareRight = null
        while(squareRight){
            pieceOnSquareRight = squareRight.getPiece()
            if(pieceOnSquareRight){
                if (pieceOnSquareRight.color != this.color){
                    possibleMoves.push({'newSquare': squareRight})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareRight})
                squareRight = squareRight.getSquareRight()
            }
        }
        let squareLeft = this.square.getSquareLeft()
        let pieceOnSquareLeft = null
        while(squareLeft){
            pieceOnSquareLeft = squareLeft.getPiece()
            if(pieceOnSquareLeft){
                if (pieceOnSquareLeft.color != this.color){
                    possibleMoves.push({'newSquare': squareLeft})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareLeft})
                squareLeft = squareLeft.getSquareLeft()
            }
        }
        let squareUpRight = this.square.getSquareUpRight()
        let pieceOnSquareUpRight = null
        while(squareUpRight){
            pieceOnSquareUpRight = squareUpRight.getPiece()
            if(pieceOnSquareUpRight){
                if (pieceOnSquareUpRight.color != this.color){
                    possibleMoves.push({'newSquare': squareUpRight})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareUpRight})
                squareUpRight = squareUpRight.getSquareUpRight()
            }
        }
        let squareDownRight = this.square.getSquareDownRight()
        let pieceOnSquareDownRight = null
        while(squareDownRight){
            pieceOnSquareDownRight = squareDownRight.getPiece()
            if(pieceOnSquareDownRight){
                if (pieceOnSquareDownRight.color != this.color){
                    possibleMoves.push({'newSquare': squareDownRight})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareDownRight})
                squareDownRight = squareDownRight.getSquareDownRight()
            }
        }
        let squareUpLeft = this.square.getSquareUpLeft()
        let pieceOnSquareUpLeft = null
        while(squareUpLeft){
            pieceOnSquareUpLeft = squareUpLeft.getPiece()
            if(pieceOnSquareUpLeft){
                if (pieceOnSquareUpLeft.color != this.color){
                    possibleMoves.push({'newSquare': squareUpLeft})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareUpLeft})
                squareUpLeft = squareUpLeft.getSquareUpLeft()
            }
        }
        let squareDownLeft = this.square.getSquareDownLeft()
        let pieceOnSquareDownLeft = null
        while(squareDownLeft){
            pieceOnSquareDownLeft = squareDownLeft.getPiece()
            if(pieceOnSquareDownLeft){
                if (pieceOnSquareDownLeft.color != this.color){
                    possibleMoves.push({'newSquare': squareDownLeft})
                }
                break
            } else {
                possibleMoves.push({'newSquare': squareDownLeft})
                squareDownLeft = squareDownLeft.getSquareDownLeft()
            }
        }
        return possibleMoves
    }
}