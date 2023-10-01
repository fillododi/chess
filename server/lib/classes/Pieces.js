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

    getType(){
        return this.type
    }

    getColor(){
        return this.color
    }

    checkPosition(row, col){
        const alphabet = "abcdefgh"
        if(row === this.row && col.toLowerCase().charCodeAt(0) - 96 === this.col){
            return true
        } else {
            return false
        }
    }

    move(row, col){ //il comportamento specifico è definito nelle sottoclassi. In esse se per qualsiasi motivo non si può muovere bisogna ritornare false, altrimenti chiamare questa funzione e ritornare true
        this.row = row
        this.col = col.toLowerCase().charCodeAt(0) - 96
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

    move(row, col){
        const trueCol = col.toLowerCase().charCodeAt(0) - 96
        if(trueCol == this.col){
            if(this.color === 'white'){
                if(row == this.row + 1 || this.row == 2 && row == 4){
                    super.move(row, col)
                    return true
                } else {
                    return false
                }
            } else {
                if(row == this.row - 1 || this.row == 7 && row == 5){
                    super.move(row, col)
                    return true
                } else {
                    return false
                }
            }
        } else {
            return false
        }
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