var Chess = require('chess.js').Chess;
var c = require('./chessutils');



module.exports = function(puzzle) {
    var chess = new Chess();
    chess.load(puzzle.fen);
    addForks(puzzle.fen, puzzle.features);
    addForks(c.fenForOtherSide(puzzle.fen), puzzle.features);
    return puzzle;
};

function addForks(fen, features) {
    var chess = new Chess();
    chess.load(fen);
    var moves = chess.moves({
        verbose: true
    });

    moves = moves.map(m => enrichMoveWithForkCaptures(fen, m));
    moves = moves.filter(m => m.captures.length >= 2);

    addForksBy(moves, 'q', 'Queen', chess.turn(), features);
    addForksBy(moves, 'p', 'Pawn', chess.turn(), features);
    addForksBy(moves, 'r', 'Rook', chess.turn(), features);
    addForksBy(moves, 'b', 'Bishop', chess.turn(), features);
    addForksBy(moves, 'n', 'Knight', chess.turn(), features);
}

function enrichMoveWithForkCaptures(fen, move) {
    var chess = new Chess();
    chess.load(fen);
    chess.move(move);

    var sameSidesTurnFen = c.fenForOtherSide(chess.fen());
    var pieceMoves = c.movesOfPieceOn(sameSidesTurnFen, move.to);
    var captures = pieceMoves.filter(capturesMajorPiece);

    move.captures = captures;
    return move;
}

function capturesMajorPiece(move) {
    return move.captured && move.captured !== 'p';
}

function diagram(move) {
    var main = [{
        orig: move.from,
        dest: move.to,
        brush: 'paleBlue'
    }];
    var forks = move.captures.map(m => {
        return {
            orig: move.to,
            dest: m.to,
            brush: m.captured === 'k' ? 'red' : 'blue'
        };
    });
    return main.concat(forks);
}

function addForksBy(moves, piece, pieceEnglish, side, features) {
    var bypiece = moves.filter(m => m.piece === piece);
    features.push({
        description: pieceEnglish + " forks",
        side: side,
        targets: bypiece.map(m => {
            return {
                target: m.to,
                diagram: diagram(m)
            };
        })
    });
}
