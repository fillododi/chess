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

    getPossibleMoves(){ //definito nelle sottoclassi
        return []
    }

    move(square){
        const possibleMoves = this.getPossibleMoves()
        console.log('possible moves are', possibleMoves.map(square => square.getPosition()))
        if(possibleMoves.includes(square)){
            if(square.getPiece()){
                const pieceToKill = square.getPiece()
                this.square.getBoard().killPiece(pieceToKill)
            }
            this.square = square
            return true
        } else {
            return false
        }

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
    getPossibleMoves() {
        let possibleMoves = []
        const board = this.square.getBoard()
        if(this.color === 'white'){
            //move up
            const squareUp = this.square.getSquareUp()
            if(squareUp && !board.findPiece(squareUp)){
                possibleMoves.push(squareUp)
            }
            //move up by 2
            if(squareUp && !board.findPiece(squareUp)){
                const square2Ups = squareUp.getSquareUp()
                if(square2Ups && !board.findPiece(square2Ups)){
                    possibleMoves.push(square2Ups)
                }
            }
            //move diagonally to kill
            const squareUpRight = this.square.getSquareUpRight()
            if(squareUpRight){
                const pieceToKill = board.findPiece(squareUpRight)
                if(pieceToKill && pieceToKill.getColor() === 'black'){
                    possibleMoves.push(squareUpRight)
                }
            }
            const squareUpLeft = this.square.getSquareUpLeft()
            if(squareUpLeft){
                const pieceToKill = board.findPiece(squareUpLeft)
                if(pieceToKill && pieceToKill.getColor() === 'black'){
                    possibleMoves.push(squareUpLeft)
                }
            }
        } else {
            const squareDown = this.square.getSquareDown()
            if(squareDown && !board.findPiece(squareDown)){
                possibleMoves.push(squareDown)
            }
            if(squareDown){
                const square2Downs = squareDown.getSquareDown()
                if(square2Downs && !board.findPiece(square2Downs)){
                    possibleMoves.push(square2Downs)
                }
            }
            //move diagonally to kill
            const squareDownRight = this.square.getSquareDownRight()
            if(squareDownRight){
                const pieceToKill = board.findPiece(squareDownRight)
                if(pieceToKill && pieceToKill.getColor() === 'white'){
                    possibleMoves.push(squareDownRight)
                }
            }
            const squareDownLeft = this.square.getSquareDownLeft()
            if(squareDownLeft){
                const pieceToKill = board.findPiece(squareDownLeft)
                if(pieceToKill && pieceToKill.getColor() === 'white'){
                    possibleMoves.push(squareDownLeft)
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
    }

    getPossibleMoves() {
        let possibleMoves = []
        let squareUp = this.square.getSquareUp()
        let pieceOnSquareUp = null
        while(squareUp){
            pieceOnSquareUp = squareUp.getPiece()
            if(pieceOnSquareUp){
                if (pieceOnSquareUp.color != this.color){
                    possibleMoves.push(squareUp)
                }
                break
            } else {
                possibleMoves.push(squareUp)
                squareUp = squareUp.getSquareUp()
            }
        }
        let squareDown = this.square.getSquareDown()
        let pieceOnSquareDown = null
        while(squareDown){
            pieceOnSquareDown = squareDown.getPiece()
            if(pieceOnSquareDown){
                if (pieceOnSquareDown.color != this.color){
                    possibleMoves.push(squareDown)
                }
                break
            } else {
                possibleMoves.push(squareDown)
                squareDown = squareDown.getSquareDown()
            }
        }
        let squareRight = this.square.getSquareRight()
        let pieceOnSquareRight = null
        while(squareRight){
            pieceOnSquareRight = squareRight.getPiece()
            if(pieceOnSquareRight){
                if (pieceOnSquareRight.color != this.color){
                    possibleMoves.push(squareRight)
                }
                break
            } else {
                possibleMoves.push(squareRight)
                squareRight = squareRight.getSquareRight()
            }
        }
        let squareLeft = this.square.getSquareLeft()
        let pieceOnSquareLeft = null
        while(squareLeft){
            pieceOnSquareLeft = squareLeft.getPiece()
            if(pieceOnSquareLeft){
                if (pieceOnSquareLeft.color != this.color){
                    possibleMoves.push(squareLeft)
                }
                break
            } else {
                possibleMoves.push(squareLeft)
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
    getPossibleMoves() {
        let possibleMoves = []
        let squareUpRight = this.square.getSquareUpRight()
        let pieceOnSquareUpRight = null
        while(squareUpRight){
            pieceOnSquareUpRight = squareUpRight.getPiece()
            if(pieceOnSquareUpRight){
                if (pieceOnSquareUpRight.color != this.color){
                    possibleMoves.push(squareUpRight)
                }
                break
            } else {
                possibleMoves.push(squareUpRight)
                squareUpRight = squareUpRight.getSquareUpRight()
            }
        }
        let squareDownRight = this.square.getSquareDownRight()
        let pieceOnSquareDownRight = null
        while(squareDownRight){
            pieceOnSquareDownRight = squareDownRight.getPiece()
            if(pieceOnSquareDownRight){
                if (pieceOnSquareDownRight.color != this.color){
                    possibleMoves.push(squareDownRight)
                }
                break
            } else {
                possibleMoves.push(squareDownRight)
                squareDownRight = squareDownRight.getSquareDownRight()
            }
        }
        let squareUpLeft = this.square.getSquareUpLeft()
        let pieceOnSquareUpLeft = null
        while(squareUpLeft){
            pieceOnSquareUpLeft = squareUpLeft.getPiece()
            if(pieceOnSquareUpLeft){
                if (pieceOnSquareUpLeft.color != this.color){
                    possibleMoves.push(squareUpLeft)
                }
                break
            } else {
                possibleMoves.push(squareUpLeft)
                squareUpLeft = squareUpLeft.getSquareUpLeft()
            }
        }
        let squareDownLeft = this.square.getSquareDownLeft()
        let pieceOnSquareDownLeft = null
        while(squareDownLeft){
            pieceOnSquareDownLeft = squareDownLeft.getPiece()
            if(pieceOnSquareDownLeft){
                if (pieceOnSquareDownLeft.color != this.color){
                    possibleMoves.push(squareDownLeft)
                }
                break
            } else {
                possibleMoves.push(squareDownLeft)
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
}

export class King extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "king"
    }
}

export class Queen extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "queen"
    }
}