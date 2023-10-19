export class Square {
    constructor(row, col, board) {
        this.row = row
        this.col = col.toLowerCase().charCodeAt(0) - 96
        this.board = board
    }

    getColumn(){
        const alphabet = "abcdefgh"
        return alphabet[this.col - 1]
    }

    getPiece(){
        return this.board.findPiece(this)
    }

    getColor(){
        if((this.col + this.row)%2){
            return 'black'
        }
        return 'white'
    }

    getRow(){
        return this.row
    }

    getBoard(){
        return this.board
    }

    getPosition(){
        return {
            'row': this.getRow(),
            'column': this.getColumn()
        }
    }

    getSquareUp(){
        if(this.getRow() === 8){
            return null
        }
        return this.board.findSquare(this.getRow() + 1, this.getColumn())
    }
    getSquareDown(){
        if(this.getRow() === 1){
            return null
        }
        return this.board.findSquare(this.getRow() - 1, this.getColumn())
    }
    getSquareLeft(){
        if(this.getColumn() === 'a'){
            return null
        }
        const newCol = this.col - 1
        const alphabet = "abcdefgh"
        const newColLetter = alphabet[newCol - 1]
        return this.board.findSquare(this.getRow(), newColLetter)
    }
    getSquareRight(){
        if(this.getColumn() === 'h'){
            return null
        }
        const newCol = this.col + 1
        const alphabet = "abcdefgh"
        const newColLetter = alphabet[newCol - 1]
        return this.board.findSquare(this.getRow(), newColLetter)
    }
    getSquareUpRight(){
        if(this.getSquareUp()){
            return this.getSquareUp().getSquareRight()
        } else {
            return null
        }
    }
    getSquareUpLeft(){
        if(this.getSquareUp()){
            return this.getSquareUp().getSquareLeft()
        } else {
            return null
        }
    }
    getSquareDownRight(){
        if(this.getSquareDown()){
            return this.getSquareDown().getSquareRight()
        } else {
            return null
        }
    }
    getSquareDownLeft(){
        if(this.getSquareDown()){
            return this.getSquareDown().getSquareLeft()
        } else {
            return null
        }
    }
}