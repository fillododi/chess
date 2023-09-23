class Piece {
    constructor(color, row, col){
        this.color = color
        this.row = row
        this.col = col.toLowerCase().charCodeAt(0) - 96
        this.type = null
    }

    getPosition(){
        const alphabet = "abcdefgh"
        return {
            'column': alphabet[this.col - 1],
            'row': this.row
        }
    }

    print(){
        console.log(this.color, this.type, " is in ", this.getPosition())
    }
}

export class Pawn extends Piece{
    constructor(color, row, col){
        super(color, row, col)
        this.type = "pawn"
    }
}

export class Rook extends Piece{
    constructor(color, row, col){
        super(color, row, col)
        this.type = "rook"
    }
}

export class Bishop extends Piece{
    constructor(color, row, col){
        super(color, row, col)
        this.type = "bishop"
    }
}

export class Knight extends Piece{
    constructor(color, row, col){
        super(color, row, col)
        this.type = "knight"
    }
}

export class King extends Piece{
    constructor(color, row, col){
        super(color, row, col)
        this.type = "king"
    }
}

export class Queen extends Piece{
    constructor(color, row, col){
        super(color, row, col)
        this.type = "queen"
    }
}