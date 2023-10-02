import {King, Knight, Pawn, Queen, Rook, Bishop} from "./Pieces.js";
import {Square} from "./Square.js";


export class Board {
    constructor(){
        this.pieceList = []
        this.squares = []
        const alphabet = "abcdefgh"
        for(let i = 1; i <= 8; i++){
            for(let j = 0; j < 8; j++){
                this.addSquare(i, alphabet[j].toString())
            }
        }
        this.getSquares().map(square => {
            if(square.getRow() === 2){
                this.addPiece('pawn', 'white', square)
            }
            if(square.getRow() === 7){
                this.addPiece('pawn', 'black', square)
            }
            if(square.getRow() === 1){
                if(square.getColumn() === 'a' || square.getColumn() === 'h'){
                    this.addPiece('rook', 'white', square)
                }
                if(square.getColumn() === 'b' || square.getColumn() === 'g'){
                    this.addPiece('knight', 'white', square)
                }
                if(square.getColumn() === 'c' || square.getColumn() === 'f'){
                    this.addPiece('bishop', 'white', square)
                }
                if(square.getColumn() === 'd'){
                    this.addPiece('queen', 'white', square)
                }
                if(square.getColumn() === 'e'){
                    this.addPiece('king', 'white', square)
                }
            }
            if(square.getRow() === 8){
                if(square.getColumn() === 'a' || square.getColumn() === 'h'){
                    this.addPiece('rook', 'black', square)
                }
                if(square.getColumn() === 'b' || square.getColumn() === 'g'){
                    this.addPiece('knight', 'black', square)
                }
                if(square.getColumn() === 'c' || square.getColumn() === 'f'){
                    this.addPiece('bishop', 'black', square)
                }
                if(square.getColumn() === 'd'){
                    this.addPiece('queen', 'black', square)
                }
                if(square.getColumn() === 'e'){
                    this.addPiece('king', 'black', square)
                }
            }
        })
    }

    getSquares(){
        return this.squares
    }

    addSquare(row, column){
        const s = new Square(row, column, this)
        this.squares.push(s)
    }

    addPiece(type, color, square){
        const pieceConstructors = { //per mappare stringa tipo e nome classe da istanziare
            'pawn': Pawn,
            'rook': Rook,
            'knight': Knight,
            'bishop': Bishop,
            'queen': Queen,
            'king': King
        }
        const pieceConstructor = pieceConstructors[type]
        const p = new pieceConstructor(color, square)
        this.pieceList.push(p)
    }

    findPiece(square){
        const piece = this.pieceList.find((piece) => piece.getSquare() === square)
        return piece
    }
    findSquare(row, col){
        const square = this.squares.find((square) => square.getColumn() === col.toLowerCase() && square.getRow() == row)
        return square
    }

    findPieceByRowCol(row, col){
        const square = this.findSquare(row, col)
        const piece = this.findPiece(square)
        return piece
    }

    print(){
        this.pieceList.forEach(piece => piece.print())
    }

    json(){
        const alphabet = "abcdefgh"
        const data = this.pieceList.map(piece => {return { //sostituisce numeri colonne con lettere
            "color": piece.color,
            "type": piece.type,
            "column": piece.getSquare().getColumn(),
            "row": piece.getSquare().getRow()
        }})
        return data
    }
}