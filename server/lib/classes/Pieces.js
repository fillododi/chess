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
        console.log(this.getPossibleMoves())
        if(this.getPossibleMoves().includes(square)){
            this.square = square
            console.log('it has moved')
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
            const squareUp = this.square.getSquareUp()
            if(squareUp && !board.findPiece(squareUp)){
                possibleMoves.push(squareUp)
            }
            if(squareUp && !board.findPiece(squareUp)){
                const square2Ups = squareUp.getSquareUp()
                if(square2Ups && !board.findPiece(square2Ups)){
                    possibleMoves.push(square2Ups)
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
        }
        return possibleMoves
    }
}

export class Rook extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "rook"
    }
}

export class Bishop extends Piece{
    constructor(color, square){
        super(color, square)
        this.type = "bishop"
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