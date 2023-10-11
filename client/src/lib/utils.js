export const findPiece = (board, row, col) => {
    return board.find(piece => piece.row === row && piece.column.toLowerCase() === numToChar(col));
}

const numToChar = (num) => {
    const alphabet = "abcdefgh";
    return alphabet[num - 1];
}

export const charToNum = (char) => {
    switch(char){
        case 'a':
            return 1;
        case 'b':
            return 2;
        case 'c':
            return 3;
        case 'd':
            return 4;
        case 'e':
            return 5;
        case 'f':
            return 6;
        case 'g':
            return 7;
        case 'h':
            return 8;
        default:
            return char;
    }
}
