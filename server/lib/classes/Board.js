import {King, Knight, Pawn, Queen, Rook, Bishop} from "./Pieces.js";


export class Board {
    constructor(){
        this.pieceList = []
        const alphabet = "abcdefgh"
        for(let i = 0; i < 8; i++){
            this.addPiece('pawn', 'white', 2, alphabet[i].toString())
            this.addPiece('pawn', 'black', 7, alphabet[i].toString())
        }
        this.addPiece('rook', 'white', '1', 'a')
        this.addPiece('rook', 'white', '1', 'h')
        this.addPiece('rook', 'black', '8', 'a')
        this.addPiece('rook', 'black', '8', 'h')
        this.addPiece('knight', 'white', '1', 'b')
        this.addPiece('knight', 'white', '1', 'g')
        this.addPiece('knight', 'black', '8', 'b')
        this.addPiece('knight', 'black', '8', 'g')
        this.addPiece('bishop', 'white', '1', 'c')
        this.addPiece('bishop', 'white', '1', 'f')
        this.addPiece('bishop', 'black', '8', 'c')
        this.addPiece('bishop', 'black', '8', 'f')
        this.addPiece('queen', 'white', '1', 'd')
        this.addPiece('king', 'white', '1', 'e')
        this.addPiece('queen', 'black', '8', 'd')
        this.addPiece('king', 'black', '8', 'e')
    }

    addPiece(type, color, row, column){
        const pieceConstructors = { //per mappare stringa tipo e nome classe da istanziare
            'pawn': Pawn,
            'rook': Rook,
            'knight': Knight,
            'bishop': Bishop,
            'queen': Queen,
            'king': King
        }
        const pieceConstructor = pieceConstructors[type]
        const p = new pieceConstructor(color, row, column)
        this.pieceList.push(p)
    }

    findPieceByPosition(row, column){
        const piece = this.pieceList.find((piece) => piece.checkPosition(row, column))
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
            "column": alphabet[piece.col - 1],
            "row": piece.row
        }})
        return data
    }
}