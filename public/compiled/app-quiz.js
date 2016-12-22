(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Quiz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright (c) 2016, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* minified license below  */

/* @license
 * Copyright (c) 2016, Jeff Hlywa (jhlywa@gmail.com)
 * Released under the BSD license
 * https://github.com/jhlywa/chess.js/blob/master/LICENSE
 */

var Chess = function(fen) {

  /* jshint indent: false */

  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33, 31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16, 15,  -1],
    k: [-17, -16, -15,   1,  17, 16, 15,  -1]
  };

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_3 = 5;
  var RANK_4 = 4;
  var RANK_5 = 3;
  var RANK_6 = 2;
  var RANK_7 = 1;
  var RANK_8 = 0;

  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
    b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
  };

  var board = new Array(128);
  var kings = {w: EMPTY, b: EMPTY};
  var turn = WHITE;
  var castling = {w: 0, b: 0};
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function clear() {
    board = new Array(128);
    kings = {w: EMPTY, b: EMPTY};
    turn = WHITE;
    castling = {w: 0, b: 0};
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    header = {};
    update_setup(generate_fen());
  }

  function reset() {
    load(DEFAULT_POSITION);
  }

  function load(fen) {
    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;

    if (!validate_fen(fen).valid) {
      return false;
    }

    clear();

    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = (piece < 'a') ? WHITE : BLACK;
        put({type: piece.toLowerCase(), color: color}, algebraic(square));
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }

    ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true;
  }

  /* TODO: this function is pretty much crap - it validates structure but
   * completely ignores content (e.g. doesn't verify that each side has a king)
   * ... we should rewrite this, and ditch the silly error_number field while
   * we're at it
   */
  function validate_fen(fen) {
    var errors = {
       0: 'No errors.',
       1: 'FEN string must contain six space-delimited fields.',
       2: '6th field (move number) must be a positive integer.',
       3: '5th field (half move counter) must be a non-negative integer.',
       4: '4th field (en-passant square) is invalid.',
       5: '3rd field (castling availability) is invalid.',
       6: '2nd field (side to move) is invalid.',
       7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.',
       8: '1st field (piece positions) is invalid [consecutive numbers].',
       9: '1st field (piece positions) is invalid [invalid piece].',
      10: '1st field (piece positions) is invalid [row too large].',
      11: 'Illegal en-passant square',
    };

    /* 1st criterion: 6 space-seperated fields? */
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
      return {valid: false, error_number: 1, error: errors[1]};
    }

    /* 2nd criterion: move number field is a integer value > 0? */
    if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) {
      return {valid: false, error_number: 2, error: errors[2]};
    }

    /* 3rd criterion: half move counter is an integer >= 0? */
    if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) {
      return {valid: false, error_number: 3, error: errors[3]};
    }

    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return {valid: false, error_number: 4, error: errors[4]};
    }

    /* 5th criterion: 3th field is a valid castle-string? */
    if( !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return {valid: false, error_number: 5, error: errors[5]};
    }

    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return {valid: false, error_number: 6, error: errors[6]};
    }

    /* 7th criterion: 1st field contains 8 rows? */
    var rows = tokens[0].split('/');
    if (rows.length !== 8) {
      return {valid: false, error_number: 7, error: errors[7]};
    }

    /* 8th criterion: every row is valid? */
    for (var i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      var sum_fields = 0;
      var previous_was_number = false;

      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) {
            return {valid: false, error_number: 8, error: errors[8]};
          }
          sum_fields += parseInt(rows[i][k], 10);
          previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return {valid: false, error_number: 9, error: errors[9]};
          }
          sum_fields += 1;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) {
        return {valid: false, error_number: 10, error: errors[10]};
      }
    }

    if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')) {
          return {valid: false, error_number: 11, error: errors[11]};
    }

    /* everything's okay! */
    return {valid: true, error_number: 0, error: errors[0]};
  }

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var color = board[i].color;
        var piece = board[i].type;

        fen += (color === WHITE) ?
                 piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
  }

  function set_header(args) {
    for (var i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' &&
          typeof args[i + 1] === 'string') {
        header[args[i]] = args[i + 1];
      }
    }
    return header;
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]];
    return (piece) ? {type: piece.type, color: piece.color} : null;
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false;
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false;
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false;
    }

    var sq = SQUARES[square];

    /* don't let the user place more than one king */
    if (piece.type == KING &&
        !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
      return false;
    }

    board[sq] = {type: piece.type, color: piece.color};
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }

    update_setup(generate_fen());

    return true;
  }

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }

    update_setup(generate_fen());

    return piece;
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to]) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN;
    }
    return move;
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (board[from].type === PAWN &&
         (rank(to) === RANK_8 || rank(to) === RANK_1)) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]));
          }
      } else {
       moves.push(build_move(board, from, to, flags));
      }
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = {b: RANK_7, w: RANK_2};

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal = (typeof options !== 'undefined' && 'legal' in options) ?
                options.legal : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return [];
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue;
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] != null &&
              board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if ((!single_square) || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from + 2;

        if (board[castling_from + 1] == null &&
            board[castling_to]       == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from + 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us] , castling_to,
                   BITS.KSIDE_CASTLE);
        }
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from - 2;

        if (board[castling_from - 1] == null &&
            board[castling_from - 2] == null &&
            board[castling_from - 3] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from - 1) &&
            !attacked(them, castling_to)) {
          add_move(board, moves, kings[us], castling_to,
                   BITS.QSIDE_CASTLE);
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves;
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i]);
      }
      undo_move();
    }

    return legal_moves;
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} sloppy Use the sloppy SAN generator to work around over
   * disambiguation bugs in Fritz and Chessbase.  See below:
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  function move_to_san(move, sloppy) {

    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
    } else {
      var disambiguator = get_disambiguator(move, sloppy);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output;
  }

  // parses all of the decorators out of a SAN string
  function stripped_san(move) {
    return move.replace(/=/,'').replace(/[+#]?[?!]*$/,'');
  }

  function attacked(color, square) {
    if (square < 0) return false;
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) { blocked = true; break; }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }

  function in_check() {
    return king_attacked(turn);
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  }

  function in_stalemate() {
    return !in_check() && generate_moves().length === 0;
  }

  function insufficient_material() {
    var pieces = {};
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;

    for (var i = SQUARES.a8; i<= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2;
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece) {
        pieces[piece.type] = (piece.type in pieces) ?
                              pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }

    /* k vs. k */
    if (num_pieces === 2) { return true; }

    /* k vs. kn .... or .... k vs. kb */
    else if (num_pieces === 3 && (pieces[BISHOP] === 1 ||
                                 pieces[KNIGHT] === 1)) { return true; }

    /* kb vs. kb where any number of bishops are all on the same color */
    else if (num_pieces === pieces[BISHOP] + 2) {
      var sum = 0;
      var len = bishops.length;
      for (var i = 0; i < len; i++) {
        sum += bishops[i];
      }
      if (sum === 0 || sum === len) { return true; }
    }

    return false;
  }

  function in_threefold_repetition() {
    /* TODO: while this function is fine for casual use, a better
     * implementation would use a Zobrist key (instead of FEN). the
     * Zobrist key would be maintained in the make_move/undo_move functions,
     * avoiding the costly that we do below.
     */
    var moves = [];
    var positions = {};
    var repetition = false;

    while (true) {
      var move = undo_move();
      if (!move) break;
      moves.push(move);
    }

    while (true) {
      /* remove the last two fields in the FEN string, they're not needed
       * when checking for draw by rep */
      var fen = generate_fen().split(' ').slice(0,4).join(' ');

      /* has the position occurred three or move times */
      positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
      if (positions[fen] >= 3) {
        repetition = true;
      }

      if (!moves.length) {
        break;
      }
      make_move(moves.pop());
    }

    return repetition;
  }

  function push(move) {
    history.push({
      move: move,
      kings: {b: kings.b, w: kings.w},
      turn: turn,
      castling: {b: castling.b, w: castling.w},
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
    });
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    board[move.to] = board[move.from];
    board[move.from] = null;

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = {type: move.promotion, color: us};
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag) {
          castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag) {
          castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) { return null; }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    board[move.from] = board[move.to];
    board[move.from].type = move.piece;  // to undo any promotions
    board[move.to] = null;

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = {type: move.captured, color: them};
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = {type: PAWN, color: them};
    }


    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }

      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }

    return move;
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, sloppy) {
    var moves = generate_moves({legal: !sloppy});

    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
        }

        if (file(from) === file(ambig_from)) {
          same_file++;
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from);
      }
      /* if the moving piece rests on the same file, use the rank symbol as the
       * disambiguator
       */
      else if (same_file > 0) {
        return algebraic(from).charAt(1);
      }
      /* else use the file symbol */
      else {
        return algebraic(from).charAt(0);
      }
    }

    return '';
  }

  function ascii() {
    var s = '   +------------------------+\n';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |';
      }

      /* empty piece */
      if (board[i] == null) {
        s += ' . ';
      } else {
        var piece = board[i].type;
        var color = board[i].color;
        var symbol = (color === WHITE) ?
                     piece.toUpperCase() : piece.toLowerCase();
        s += ' ' + symbol + ' ';
      }

      if ((i + 1) & 0x88) {
        s += '|\n';
        i += 8;
      }
    }
    s += '   +------------------------+\n';
    s += '     a  b  c  d  e  f  g  h\n';

    return s;
  }

  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  function move_from_san(move, sloppy) {
    // strip off any move decorations: e.g Nf3+?!
    var clean_move = stripped_san(move);

    // if we're using the sloppy parser run a regex to grab piece, to, and from
    // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
    if (sloppy) {
      var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
      if (matches) {
        var piece = matches[1];
        var from = matches[2];
        var to = matches[3];
        var promotion = matches[4];
      }
    }

    var moves = generate_moves();
    for (var i = 0, len = moves.length; i < len; i++) {
      // try the strict parser first, then the sloppy parser if requested
      // by the user
      if ((clean_move === stripped_san(move_to_san(moves[i]))) ||
          (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))) {
        return moves[i];
      } else {
        if (matches &&
            (!piece || piece.toLowerCase() == moves[i].piece) &&
            SQUARES[from] == moves[i].from &&
            SQUARES[to] == moves[i].to &&
            (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
          return moves[i];
        }
      }
    }

    return null;
  }


  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4;
  }

  function file(i) {
    return i & 15;
  }

  function algebraic(i){
    var f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move, false);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move;
  }

  function clone(obj) {
    var dupe = (obj instanceof Array) ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe;
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  /*****************************************************************************
   * DEBUGGING UTILITIES
   ****************************************************************************/
  function perft(depth) {
    var moves = generate_moves({legal: false});
    var nodes = 0;
    var color = turn;

    for (var i = 0, len = moves.length; i < len; i++) {
      make_move(moves[i]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
        } else {
          nodes++;
        }
      }
      undo_move();
    }

    return nodes;
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
                /* from the ECMA-262 spec (section 12.6.4):
                 * "The mechanics of enumerating the properties ... is
                 * implementation dependent"
                 * so: for (var sq in SQUARES) { keys.push(sq); } might not be
                 * ordered correctly
                 */
                var keys = [];
                for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                  if (i & 0x88) { i += 7; continue; }
                  keys.push(algebraic(i));
                }
                return keys;
              })(),
    FLAGS: FLAGS,

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen);
    },

    reset: function() {
      return reset();
    },

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);
      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {

        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (typeof options !== 'undefined' && 'verbose' in options &&
            options.verbose) {
          moves.push(make_pretty(ugly_moves[i]));
        } else {
          moves.push(move_to_san(ugly_moves[i], false));
        }
      }

      return moves;
    },

    in_check: function() {
      return in_check();
    },

    in_checkmate: function() {
      return in_checkmate();
    },

    in_stalemate: function() {
      return in_stalemate();
    },

    in_draw: function() {
      return half_moves >= 100 ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    },

    insufficient_material: function() {
      return insufficient_material();
    },

    in_threefold_repetition: function() {
      return in_threefold_repetition();
    },

    game_over: function() {
      return half_moves >= 100 ||
             in_checkmate() ||
             in_stalemate() ||
             insufficient_material() ||
             in_threefold_repetition();
    },

    validate_fen: function(fen) {
      return validate_fen(fen);
    },

    fen: function() {
      return generate_fen();
    },

    pgn: function(options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      var newline = (typeof options === 'object' &&
                     typeof options.newline_char === 'string') ?
                     options.newline_char : '\n';
      var max_width = (typeof options === 'object' &&
                       typeof options.max_width === 'number') ?
                       options.max_width : 0;
      var result = [];
      var header_exists = false;

      /* add the PGN header headerrmation */
      for (var i in header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
        header_exists = true;
      }

      if (header_exists && history.length) {
        result.push(newline);
      }

      /* pop all of history onto reversed_history */
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      var moves = [];
      var move_string = '';

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        var move = reversed_history.pop();

        /* if the position started with black to move, start PGN with 1. ... */
        if (!history.length && move.color === 'b') {
          move_string = move_number + '. ...';
        } else if (move.color === 'w') {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = move_number + '.';
        }

        move_string = move_string + ' ' + move_to_san(move, false);
        make_move(move);
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(move_string);
      }

      /* is there a result? */
      if (typeof header.Result !== 'undefined') {
        moves.push(header.Result);
      }

      /* history should be back to what is was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ');
      }

      /* wrap the PGN output at max_width */
      var current_width = 0;
      for (var i = 0; i < moves.length; i++) {
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {

          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop();
          }

          result.push(newline);
          current_width = 0;
        } else if (i !== 0) {
          result.push(' ');
          current_width++;
        }
        result.push(moves[i]);
        current_width += moves[i].length;
      }

      return result.join('');
    },

    load_pgn: function(pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                    options.sloppy : false;

      function mask(str) {
        return str.replace(/\\/g, '\\');
      }

      function has_keys(object) {
        for (var key in object) {
          return true;
        }
        return false;
      }

      function parse_pgn_header(header, options) {
        var newline_char = (typeof options === 'object' &&
                            typeof options.newline_char === 'string') ?
                            options.newline_char : '\r?\n';
        var header_obj = {};
        var headers = header.split(new RegExp(mask(newline_char)));
        var key = '';
        var value = '';

        for (var i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');
          if (trim(key).length > 0) {
            header_obj[key] = value;
          }
        }

        return header_obj;
      }

      var newline_char = (typeof options === 'object' &&
                          typeof options.newline_char === 'string') ?
                          options.newline_char : '\r?\n';
      var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' +
                             '(' + mask(newline_char) + ')*' +
                             '1.(' + mask(newline_char) + '|.)*$', 'g');

      /* get header part of the PGN file */
      var header_string = pgn.replace(regex, '$1');

      /* no info part given, begins with moves */
      if (header_string[0] !== '[') {
        header_string = '';
      }

      reset();

      /* parse PGN header */
      var headers = parse_pgn_header(header_string, options);
      for (var key in headers) {
        set_header([key, headers[key]]);
      }

      /* load the starting position indicated by [Setup '1'] and
      * [FEN position] */
      if (headers['SetUp'] === '1') {
          if (!(('FEN' in headers) && load(headers['FEN']))) {
            return false;
          }
      }

      /* delete header to get the moves */
      var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');

      /* delete comments */
      ms = ms.replace(/(\{[^}]+\})+?/g, '');

      /* delete recursive annotation variations */
      var rav_regex = /(\([^\(\)]+\))+?/g
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '');
      }

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '');

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '');

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '');

      /* trim and get array of moves */
      var moves = trim(ms).split(new RegExp(/\s+/));

      /* delete empty entries */
      moves = moves.join(',').replace(/,,+/g, ',').split(',');
      var move = '';

      for (var half_move = 0; half_move < moves.length - 1; half_move++) {
        move = move_from_san(moves[half_move], sloppy);

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }

      /* examine last move */
      move = moves[moves.length - 1];
      if (POSSIBLE_RESULTS.indexOf(move) > -1) {
        if (has_keys(header) && typeof header.Result === 'undefined') {
          set_header(['Result', move]);
        }
      }
      else {
        move = move_from_san(move, sloppy);
        if (move == null) {
          return false;
        } else {
          make_move(move);
        }
      }
      return true;
    },

    header: function() {
      return set_header(arguments);
    },

    ascii: function() {
      return ascii();
    },

    turn: function() {
      return turn;
    },

    move: function(move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                    options.sloppy : false;

      var move_obj = null;

      if (typeof move === 'string') {
        move_obj = move_from_san(move, sloppy);
      } else if (typeof move === 'object') {
        var moves = generate_moves();

        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)) {
            move_obj = moves[i];
            break;
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null;
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move;
    },

    undo: function() {
      var move = undo_move();
      return (move) ? make_pretty(move) : null;
    },

    clear: function() {
      return clear();
    },

    put: function(piece, square) {
      return put(piece, square);
    },

    get: function(square) {
      return get(square);
    },

    remove: function(square) {
      return remove(square);
    },

    perft: function(depth) {
      return perft(depth);
    },

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark';
      }

      return null;
    },

    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                     options.verbose);

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move));
        }
        make_move(move);
      }

      return move_history;
    }

  };
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return Chess;  });

},{}],2:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');

module.exports = function(puzzle) {
    var chess = new Chess();
    chess.load(puzzle.fen);
    addCheckingSquares(puzzle.fen, puzzle.features);
    addCheckingSquares(c.fenForOtherSide(puzzle.fen), puzzle.features);
    return puzzle;
};

function addCheckingSquares(fen, features) {
    var chess = new Chess();
    chess.load(fen);
    var moves = chess.moves({
        verbose: true
    });

    var mates = moves.filter(move => /\#/.test(move.san));
    var checks = moves.filter(move => /\+/.test(move.san));
    features.push({
        description: "Checking squares",
        side: chess.turn(),
        targets: checks.map(m => targetAndDiagram(m.from, m.to, checkingMoves(fen, m)))
    });

    features.push({
        description: "Mating squares",
        side: chess.turn(),
        targets: mates.map(m => targetAndDiagram(m.from, m.to, checkingMoves(fen, m)))
    });
    
    if (mates.length > 0) {
        features.forEach(f => {
            if (f.description === "Mate-in-1 threats") {
                f.targets = [];
            }
        });
    }
}

function checkingMoves(fen, move) {
    var chess = new Chess();
    chess.load(fen);
    chess.move(move);
    chess.load(c.fenForOtherSide(chess.fen()));
    var moves = chess.moves({
        verbose: true
    });
    return moves.filter(m => m.captured && m.captured.toLowerCase() === 'k');
}


function targetAndDiagram(from, to, checks) {
    return {
        target: to,
        diagram: [{
            orig: from,
            dest: to,
            brush: 'paleBlue'
        }].concat(checks.map(m => {
            return {
                orig: m.from,
                dest: m.to,
                brush: 'red'
            };
        }))
    };
}

},{"./chessutils":3,"chess.js":1}],3:[function(require,module,exports){
/**
 * Chess extensions
 */

var Chess = require('chess.js').Chess;

var allSquares = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'];

/**
 * Place king at square and find out if it is in check.
 */
function isCheckAfterPlacingKingAtSquare(fen, king, square) {
    var chess = new Chess(fen);
    chess.remove(square);
    chess.remove(king);
    chess.put({
        type: 'k',
        color: chess.turn()
    }, square);
    return chess.in_check();
}

function isCheckAfterRemovingPieceAtSquare(fen, square) {
    var chess = new Chess(fen);
    chess.remove(square);
    return chess.in_check();
}

function movesThatResultInCaptureThreat(fen, from, to) {
    var chess = new Chess(fen);
    var moves = chess.moves({
        verbose: true
    });
    var squaresBetween = between(from, to);
    // do any of the moves reveal the desired capture 
    return moves.filter(move => squaresBetween.indexOf(move.from) !== -1)
        .filter(m => doesMoveResultInCaptureThreat(m, fen, from, to));
}

function doesMoveResultInCaptureThreat(move, fen, from, to) {
    var chess = new Chess(fen);

    //apply move of intermediary piece (state becomes other sides turn)
    chess.move(move);

    //null move for opponent to regain the move for original side
    chess.load(fenForOtherSide(chess.fen()));

    //get legal moves
    var moves = chess.moves({
        verbose: true
    });

    // do any of the moves match from,to 
    return moves.filter(m => m.from === from && m.to === to).length > 0;
}

/**
 * Switch side to play (and remove en-passent information)
 */
function fenForOtherSide(fen) {
    if (fen.search(" w ") > 0) {
        return fen.replace(/ w .*/, " b - - 0 1");
    }
    else {
        return fen.replace(/ b .*/, " w - - 0 2");
    }
}

/**
 * Where is the king.
 */
function kingsSquare(fen, colour) {
    return squaresOfPiece(fen, colour, 'k');
}

function squaresOfPiece(fen, colour, pieceType) {
    var chess = new Chess(fen);
    return allSquares.find(square => {
        var r = chess.get(square);
        return r === null ? false : (r.color == colour && r.type.toLowerCase() === pieceType);
    });
}

function movesOfPieceOn(fen, square) {
    var chess = new Chess(fen);
    return chess.moves({
        verbose: true,
        square: square
    });
}

/**
 * Find position of all of one colours pieces excluding the king.
 */
function piecesForColour(fen, colour) {
    var chess = new Chess(fen);
    return allSquares.filter(square => {
        var r = chess.get(square);
        if ((r === null) || (r.type === 'k')) {
            return false;
        }
        return r.color == colour;
    });
}

function majorPiecesForColour(fen, colour) {
    var chess = new Chess(fen);
    return allSquares.filter(square => {
        var r = chess.get(square);
        if ((r === null) || (r.type === 'p')) {
            return false;
        }
        return r.color == colour;
    });
}

function canCapture(from, fromPiece, to, toPiece) {
    var chess = new Chess();
    chess.clear();
    chess.put({
        type: fromPiece.type,
        color: 'w'
    }, from);
    chess.put({
        type: toPiece.type,
        color: 'b'
    }, to);
    var moves = chess.moves({
        square: from,
        verbose: true
    }).filter(m => (/.*x.*/.test(m.san)));
    return moves.length > 0;
}

/**
 * Convert PGN to list of FENs.
 */
function pgnToFens(pgn) {
    var gameMoves = pgn.replace(/([0-9]+\.\s)/gm, '').trim();
    var moveArray = gameMoves.split(' ').filter(function(n) {
        return n;
    });

    var fens = [];
    var chess = new Chess();
    moveArray.forEach(move => {
        chess.move(move, {
            sloppy: true
        });

        // skip opening moves
        if (chess.history().length < 8) {
            return;
        }

        // skip positions in check
        if (chess.in_check()) {
            return;
        }

        // skip black moves
        if (chess.turn() === 'b') {
            return;
        }
        fens.push(chess.fen());
    });
    return fens;
}

function between(from, to) {
    var result = [];
    var n = from;
    while (n !== to) {
        n = String.fromCharCode(n.charCodeAt() + Math.sign(to.charCodeAt() - n.charCodeAt())) +
            String.fromCharCode(n.charCodeAt(1) + Math.sign(to.charCodeAt(1) - n.charCodeAt(1)));
        result.push(n);
    }
    result.pop();
    return result;
}

function repairFen(fen) {
    if (/^[^ ]*$/.test(fen)) {
        return fen + " w - - 0 1";
    }
    return fen.replace(/ w .*/, ' w - - 0 1').replace(/ b .*/, ' b - - 0 1');
}

module.exports.allSquares = allSquares;
module.exports.pgnToFens = pgnToFens;
module.exports.kingsSquare = kingsSquare;
module.exports.piecesForColour = piecesForColour;
module.exports.isCheckAfterPlacingKingAtSquare = isCheckAfterPlacingKingAtSquare;
module.exports.fenForOtherSide = fenForOtherSide;
module.exports.isCheckAfterRemovingPieceAtSquare = isCheckAfterRemovingPieceAtSquare;
module.exports.movesThatResultInCaptureThreat = movesThatResultInCaptureThreat;
module.exports.movesOfPieceOn = movesOfPieceOn;
module.exports.majorPiecesForColour = majorPiecesForColour;
module.exports.canCapture = canCapture;
module.exports.repairFen = repairFen;

},{"chess.js":1}],4:[function(require,module,exports){
var uniq = require('../util/uniq');

/**
 * Find all diagrams associated with target square in the list of features.
 */
function diagramForTarget(side, description, target, features) {
  var diagram = [];
  features
    .filter(f => side ? side === f.side : true)
    .filter(f => description ? description === f.description : true)
    .forEach(f => f.targets.forEach(t => {
      if (!target || t.target === target) {
        diagram = diagram.concat(t.diagram);
        t.selected = true;
      }
    }));
  return uniq(diagram);
}

function allDiagrams(features) {
  var diagram = [];
  features.forEach(f => f.targets.forEach(t => {
    diagram = diagram.concat(t.diagram);
    t.selected = true;
  }));
  return uniq(diagram);
}

function clearDiagrams(features) {
  features.forEach(f => f.targets.forEach(t => {
    t.selected = false;
  }));
}

function clickedSquares(features, correct, incorrect, target) {
  var diagram = diagramForTarget(null, null, target, features);
  correct.forEach(target => {
    diagram.push({
      orig: target,
      brush: 'green'
    });
  });
  incorrect.forEach(target => {
    diagram.push({
      orig: target,
      brush: 'red'
    });
  });
  return diagram;
}

module.exports = {
  diagramForTarget: diagramForTarget,
  allDiagrams: allDiagrams,
  clearDiagrams: clearDiagrams,
  clickedSquares: clickedSquares
};

},{"../util/uniq":14}],5:[function(require,module,exports){
module.exports = [
    '2br3k/pp3Pp1/1n2p3/1P2N1pr/2P2qP1/8/1BQ2P1P/4R1K1 w - - 1 0',
    '6R1/5r1k/p6b/1pB1p2q/1P6/5rQP/5P1K/6R1 w - - 1 0',
    '6rk/p1pb1p1p/2pp1P2/2b1n2Q/4PR2/3B4/PPP1K2P/RNB3q1 w - - 1 0',
    'rn3rk1/2qp2pp/p3P3/1p1b4/3b4/3B4/PPP1Q1PP/R1B2R1K w - - 1 0',
    'r2B1bk1/1p5p/2p2p2/p1n5/4P1BP/P1Nb4/KPn3PN/3R3R b - - 0 1',
    '2R3nk/3r2b1/p2pr1Q1/4pN2/1P6/P6P/q7/B4RK1 w - - 1 0',
    '8/8/2N1P3/1P6/4Q3/4b2K/4k3/4q3 w - - 1 0',
    'r1b1k1nr/p5bp/p1pBq1p1/3pP1P1/N4Q2/8/PPP1N2P/R4RK1 w - - 1 0',
    '5rk1/pp2p2p/3p2pb/2pPn2P/2P2q2/2N4P/PP3BR1/R2BK1N1 b - - 0 1',
    '1r2qrk1/p4p1p/bp1p1Qp1/n1ppP3/P1P5/2PB1PN1/6PP/R4RK1 w - - 1 0',
    'r3q1r1/1p2bNkp/p3n3/2PN1B1Q/PP1P1p2/7P/5PP1/6K1 w - - 1 0',
    '3k4/R7/5N2/1p2n3/6p1/P1N2bP1/1r6/5K2 b - - 0 1',
    '7k/1ppq4/1n1p2Q1/1P4Np/1P3p1B/3B4/7P/rn5K w - - 1 0',
    '6r1/Q4p2/4pq1k/3p2Nb/P4P1K/4P3/7P/2R5 b - - 0 1',
    'r3k2r/1Bp2ppp/8/4q1b1/pP1n4/P1KP3P/1BP5/R2Q3R b - - 0 1',
    '7r/pp4Q1/1qp2p1r/5k2/2P4P/1PB5/P4PP1/4R1K1 w - - 1 0',
    '3r2k1/1p3p1p/p1n2qp1/2B5/1P2Q2P/6P1/B2bRP2/6K1 w - - 1 0',
    'r5rk/ppq2p2/2pb1P1B/3n4/3P4/2PB3P/PP1QNP2/1K6 w - - 1 0',
    '6k1/2b3r1/8/6pR/2p3N1/2PbP1PP/1PB2R1K/2r5 w - - 1 0',
    'r2q1k1r/ppp1bB1p/2np4/6N1/3PP1bP/8/PPP5/RNB2RK1 w - - 1 0',
    '2r3k1/p4p2/3Rp2p/1p2P1pK/8/1P4P1/P3Q2P/1q6 b - - 0 1',
    '8/pp2k3/7r/2P1p1p1/4P3/5pq1/2R3N1/1R3BK1 b - - 0 1',
    '4r2r/5k2/2p2P1p/p2pP1p1/3P2Q1/6PB/1n5P/6K1 w - - 1 0',
    '2b1rqk1/r1p2pp1/pp4n1/3Np1Q1/4P2P/1BP5/PP3P2/2KR2R1 w - - 1 0',
    '4r1k1/pQ3pp1/7p/4q3/4r3/P7/1P2nPPP/2BR1R1K b - - 0 1',
    'r5k1/p1p3bp/1p1p4/2PP2qp/1P6/1Q1bP3/PB3rPP/R2N2RK b - - 0 1',
    '4k3/r2bnn1r/1q2pR1p/p2pPp1B/2pP1N1P/PpP1B3/1P4Q1/5KR1 w - - 1 0',
    'r1b2k2/1p4pp/p4N1r/4Pp2/P3pP1q/4P2P/1P2Q2K/3R2R1 w - - 1 0',
    '2q4r/R7/5p1k/2BpPn2/6Qp/6PN/5P1K/8 w - - 1 0',
    '3r1q1r/1p4k1/1pp2pp1/4p3/4P2R/1nP3PQ/PP3PK1/7R w - - 1 0',
    '3r4/pR2N3/2pkb3/5p2/8/2B5/qP3PPP/4R1K1 w - - 1 0',
    'r1b4r/1k2bppp/p1p1p3/8/Np2nB2/3R4/PPP1BPPP/2KR4 w - - 1 0',
    '6kr/p1Q3pp/3Bbbq1/8/5R2/5P2/PP3P1P/4KB1R w - - 1 0',
    '2q2r1k/5Qp1/4p1P1/3p4/r6b/7R/5BPP/5RK1 w - - 1 0',
    '5r1k/4R3/6pP/r1pQPp2/5P2/2p1PN2/2q5/5K1R w - - 1 0',
    '2r2r2/7k/5pRp/5q2/3p1P2/6QP/P2B1P1K/6R1 w - - 1 0',
    'Q7/2r2rpk/2p4p/7N/3PpN2/1p2P3/1K4R1/5q2 w - - 1 0',
    'r4k2/PR6/1b6/4p1Np/2B2p2/2p5/2K5/8 w - - 1 0',
    'rn3rk1/p5pp/2p5/3Ppb2/2q5/1Q6/PPPB2PP/R3K1NR b - - 0 1',
    'r2qr1k1/1p1n2pp/2b1p3/p2pP1b1/P2P1Np1/3BPR2/1PQB3P/5RK1 w - - 1 0',
    '5r1k/1q4bp/3pB1p1/2pPn1B1/1r6/1p5R/1P2PPQP/R5K1 w - - 1 0',
    'r1n1kbr1/ppq1pN2/2p1Pn1p/2Pp3Q/3P3P/8/PP3P2/R1B1K2R w - - 1 0',
    'r3b3/1p3N1k/n4p2/p2PpP2/n7/6P1/1P1QB1P1/4K3 w - - 1 0',
    '1rb2k2/pp3ppQ/7q/2p1n1N1/2p5/2N5/P3BP1P/K2R4 w - - 1 0',
    'r7/5pk1/2p4p/1p1p4/1qnP4/5QPP/2B1RP1K/8 w - - 1 0',
    '6r1/p6k/Bp3n1r/2pP1P2/P4q1P/2P2Q2/5K2/2R2R2 b - - 0 1',
    '6k1/4pp2/2q3pp/R1p1Pn2/2N2P2/1P4rP/1P3Q1K/8 b - - 0 1',
    '4Q3/1b5r/1p1kp3/5p1r/3p1nq1/P4NP1/1P3PB1/2R3K1 w - - 1 0',
    '2rb3r/3N1pk1/p2pp2p/qp2PB1Q/n2N1P2/6P1/P1P4P/1K1RR3 w - - 1 0',
    'r1b2k1r/2q1b3/p3ppBp/2n3B1/1p6/2N4Q/PPP3PP/2KRR3 w - - 1 0',
    'r1b1rk2/pp1nbNpB/2p1p2p/q2nB3/3P3P/2N1P3/PPQ2PP1/2KR3R w - - 1 0',
    '5r1k/7p/8/4NP2/8/3p2R1/2r3PP/2n1RK2 w - - 1 0',
    '3r4/6kp/1p1r1pN1/5Qq1/6p1/PB4P1/1P3P2/6KR w - - 1 0',
    '6r1/r5PR/2p3R1/2Pk1n2/3p4/1P1NP3/4K3/8 w - - 1 0',
    '3q1r2/p2nr3/1k1NB1pp/1Pp5/5B2/1Q6/P5PP/5RK1 w - - 1 0',
    'Q7/1R5p/2kqr2n/7p/5Pb1/8/P1P2BP1/6K1 w - - 1 0',
    '3r2k1/5p2/2b2Bp1/7p/4p3/5PP1/P3Bq1P/Q3R2K b - - 0 1',
    'r4qk1/2p4p/p1p1N3/2bpQ3/4nP2/8/PPP3PP/5R1K b - - 0 1',
    'r1r3k1/3NQppp/q3p3/8/8/P1B1P1P1/1P1R1PbP/3K4 b - - 0 1',
    '3r4/7p/2RN2k1/4n2q/P2p4/3P2P1/4p1P1/5QK1 w - - 1 0',
    'r1bq1r1k/pp4pp/2pp4/2b2p2/4PN2/1BPP1Q2/PP3PPP/R4RK1 w - - 1 0',
    'r2q4/p2nR1bk/1p1Pb2p/4p2p/3nN3/B2B3P/PP1Q2P1/6K1 w - - 1 0',
    'r2n1rk1/1ppb2pp/1p1p4/3Ppq1n/2B3P1/2P4P/PP1N1P1K/R2Q1RN1 b - - 0 1',
    '1r2r3/1n3Nkp/p2P2p1/3B4/1p5Q/1P5P/6P1/2b4K w - - 1 0',
    'r1b2rk1/pp1p1p1p/2n3pQ/5qB1/8/2P5/P4PPP/4RRK1 w - - 1 0',
    '5rk1/pR4bp/6p1/6B1/5Q2/4P3/q2r1PPP/5RK1 w - - 1 0',
    '6Q1/1q2N1n1/3p3k/3P3p/2P5/3bp1P1/1P4BP/6K1 w - - 1 0',
    'rnbq1rk1/pp2bp1p/4p1p1/2pp2Nn/5P1P/1P1BP3/PBPP2P1/RN1QK2R w - - 1 0',
    '2q2rk1/4r1bp/bpQp2p1/p2Pp3/P3P2P/1NP1B1K1/1P6/R2R4 b - - 0 1',
    '5r1k/pp1n1p1p/5n1Q/3p1pN1/3P4/1P4RP/P1r1qPP1/R5K1 w - - 1 0',
    '4nrk1/rR5p/4pnpQ/4p1N1/2p1N3/6P1/q4P1P/4R1K1 w - - 1 0',
    'r3q2k/p2n1r2/2bP1ppB/b3p2Q/N1Pp4/P5R1/5PPP/R5K1 w - - 1 0',
    '1R1n3k/6pp/2Nr4/P4p2/r7/8/4PPBP/6K1 b - - 0 1',
    'r1b2r1k/p1n3b1/7p/5q2/2BpN1p1/P5P1/1P1Q1NP1/2K1R2R w - - 1 0',
    '3kr3/p1r1bR2/4P2p/1Qp5/3p3p/8/PP4PP/6K1 w - - 1 0',
    '6r1/3p2qk/4P3/1R5p/3b1prP/3P2B1/2P1QP2/6RK b - - 0 1',
    'r5q1/pp1b1kr1/2p2p2/2Q5/2PpB3/1P4NP/P4P2/4RK2 w - - 1 0',
    '7R/r1p1q1pp/3k4/1p1n1Q2/3N4/8/1PP2PPP/2B3K1 w - - 1 0',
    '2q1rb1k/prp3pp/1pn1p3/5p1N/2PP3Q/6R1/PP3PPP/R5K1 w - - 1 0',
    'r1qbr2k/1p2n1pp/3B1n2/2P1Np2/p4N2/PQ4P1/1P3P1P/3RR1K1 w - - 1 0',
    '3rk3/1q4pp/3B1p2/3R4/1pQ5/1Pb5/P4PPP/6K1 w - - 1 0',
    'r4k2/6pp/p1n1p2N/2p5/1q6/6QP/PbP2PP1/1K1R1B2 w - - 1 0',
    '3rr2k/pp1b2b1/4q1pp/2Pp1p2/3B4/1P2QNP1/P6P/R4RK1 w - - 1 0',
    '5Q1R/3qn1p1/p3p1k1/1pp1PpB1/3r3P/5P2/PPP3K1/8 w - - 1 0',
    '2r1r3/p3P1k1/1p1pR1Pp/n2q1P2/8/2p4P/P4Q2/1B3RK1 w - - 1 0',
    'r1b2rk1/2p2ppp/p7/1p6/3P3q/1BP3bP/PP3QP1/RNB1R1K1 w - - 1 0',
    '1R6/4r1pk/pp2N2p/4nP2/2p5/2P3P1/P2P1K2/8 w - - 1 0',
    '1rb2RR1/p1p3p1/2p3k1/5p1p/8/3N1PP1/PP5r/2K5 w - - 1 0',
    'r2r2k1/pp2bppp/2p1p3/4qb1P/8/1BP1BQ2/PP3PP1/2KR3R b - - 0 1',
    '1r4k1/5bp1/pr1P2p1/1np1p3/2B1P2R/2P2PN1/6K1/R7 w - - 1 0',
    '3k4/1R6/3N2n1/p2Pp3/2P1N3/3n2Pp/q6P/5RK1 w - - 1 0',
    '1r1rb3/p1q2pkp/Pnp2np1/4p3/4P3/Q1N1B1PP/2PRBP2/3R2K1 w - - 1 0',
    'r3k3/pbpqb1r1/1p2Q1p1/3pP1B1/3P4/3B4/PPP4P/5RK1 w - - 1 0',
    'r2k1r2/3b2pp/p5p1/2Q1R3/1pB1Pq2/1P6/PKP4P/7R w - - 1 0',
    '3q2r1/4n2k/p1p1rBpp/PpPpPp2/1P3P1Q/2P3R1/7P/1R5K w - - 1 0',
    '5r1k/2p1b1pp/pq1pB3/8/2Q1P3/5pP1/RP3n1P/1R4K1 b - - 0 1',
    '2bqr2k/1r1n2bp/pp1pBp2/2pP1PQ1/P3PN2/1P4P1/1B5P/R3R1K1 w - - 1 0',
    'r1b2rk1/5pb1/p1n1p3/4B3/4N2R/8/1PP1p1PP/5RK1 w - - 1 0',
    '2r2k2/pb4bQ/1p1qr1pR/3p1pB1/3Pp3/2P5/PPB2PP1/1K5R w - - 1 0',
    '4r3/2B4B/2p1b3/ppk5/5R2/P2P3p/1PP5/1K5R w - - 1 0',
    'r5k1/q4ppp/rnR1pb2/1Q1p4/1P1P4/P4N1P/1B3PP1/2R3K1 w - - 1 0',
    'r1brn3/p1q4p/p1p2P1k/2PpPPp1/P7/1Q2B2P/1P6/1K1R1R2 w - - 1 0',
    '5r1k/7p/p2b4/1pNp1p1q/3Pr3/2P2bP1/PP1B3Q/R3R1K1 b - - 0 1',
    '7k/2p3pp/p7/1p1p4/PP2pr2/B1P3qP/4N1B1/R1Qn2K1 b - - 0 1',
    '2r3k1/pp4rp/1q1p2pQ/1N2p1PR/2nNP3/5P2/PPP5/2K4R w - - 1 0',
    '4q1kr/p4p2/1p1QbPp1/2p1P1Np/2P5/7P/PP4P1/3R3K w - - 1 0',
    'R7/3nbpkp/4p1p1/3rP1P1/P2B1Q1P/3q1NK1/8/8 w - - 1 0',
    '5rk1/4Rp1p/1q1pBQp1/5r2/1p6/1P4P1/2n2P2/3R2K1 w - - 1 0',
    '2Q5/pp2rk1p/3p2pq/2bP1r2/5RR1/1P2P3/PB3P1P/7K w - - 1 0',
    '3Q4/4r1pp/b6k/6R1/8/1qBn1N2/1P4PP/6KR w - - 1 0',
    '3r2qk/p2Q3p/1p3R2/2pPp3/1nb5/6N1/PB4PP/1B4K1 w - - 1 0',
    '5b2/1p3rpk/p1b3Rp/4B1RQ/3P1p1P/7q/5P2/6K1 w - - 1 0',
    '4r3/2q1rpk1/p3bN1p/2p3p1/4QP2/2N4P/PP4P1/5RK1 w - - 1 0',
    '3Rr2k/pp4pb/2p4p/2P1n3/1P1Q3P/4r1q1/PB4B1/5RK1 b - - 0 1',
    'r1b3kr/3pR1p1/ppq4p/5P2/4Q3/B7/P5PP/5RK1 w - - 1 0',
    '1r6/1p3K1k/p3N3/P6n/6RP/2P5/8/8 w - - 1 0',
    '4k3/2q2p2/4p3/3bP1Q1/p6R/r6P/6PK/5B2 w - - 1 0',
    '1Q6/1P2pk1p/5ppB/3q4/P5PK/7P/5P2/6r1 b - - 0 1',
    'q2br1k1/1b4pp/3Bp3/p6n/1p3R2/3B1N2/PP2QPPP/6K1 w - - 1 0',
    'rq3rk1/1p1bpp1p/3p2pQ/p2N3n/2BnP1P1/5P2/PPP5/2KR3R w - - 1 0',
    'R7/5pkp/3N2p1/2r3Pn/5r2/1P6/P1P5/2KR4 w - - 1 0',
    '4kq1Q/p2b3p/1pR5/3B2p1/5Pr1/8/PP5P/7K w - - 1 0',
    '4Q3/r4ppk/3p3p/4pPbB/2P1P3/1q5P/6P1/3R3K w - - 1 0',
    '4r1k1/Q4bpp/p7/5N2/1P3qn1/2P5/P1B3PP/R5K1 b - - 0 1',
    '6k1/5p1p/2Q1p1p1/5n1r/N7/1B3P1P/1PP3PK/4q3 b - - 0 1',
    '1r3k2/5p1p/1qbRp3/2r1Pp2/ppB4Q/1P6/P1P4P/1K1R4 w - - 1 0',
    '8/2Q1R1bk/3r3p/p2N1p1P/P2P4/1p3Pq1/1P4P1/1K6 w - - 1 0',
    '8/k1p1q3/Pp5Q/4p3/2P1P2p/3P4/4K3/8 w - - 1 0',
    '5r1k/r2b1p1p/p4Pp1/1p2R3/3qBQ2/P7/6PP/2R4K w - - 1 0',
    '8/8/2N5/8/8/p7/2K5/k7 w - - 1 0',
    '3r3k/1p3Rpp/p2nn3/3N4/8/1PB1PQ1P/q4PP1/6K1 w - - 1 0',
    '3q2rn/pp3rBk/1npp1p2/5P2/2PPP1RP/2P2B2/P5Q1/6RK w - - 1 0',
    '8/3n2pp/2qBkp2/ppPpp1P1/1P2P3/1Q6/P4PP1/6K1 w - - 1 0',
    '4r3/2p5/2p1q1kp/p1r1p1pN/P5P1/1P3P2/4Q3/3RB1K1 w - - 1 0',
    '3r1kr1/8/p2q2p1/1p2R3/1Q6/8/PPP5/1K4R1 w - - 1 0',
    '4r2k/2pb1R2/2p4P/3pr1N1/1p6/7P/P1P5/2K4R w - - 1 0',
    'r4k1r/2pQ1pp1/p4q1p/2N3N1/1p3P2/8/PP3PPP/4R1K1 w - - 1 0',
    '6rk/1r2pR1p/3pP1pB/2p1p3/P6Q/P1q3P1/7P/5BK1 w - - 1 0',
    '3r3k/1b2b1pp/3pp3/p3n1P1/1pPqP2P/1P2N2R/P1QB1r2/2KR3B b - - 0 1',
    '8/2p3N1/6p1/5PB1/pp2Rn2/7k/P1p2K1P/3r4 w - - 1 0',
    '8/p3Q2p/6pk/1N6/4nP2/7P/P5PK/3rr3 w - - 1 0',
    '5rkr/1p2Qpbp/pq1P4/2nB4/5p2/2N5/PPP4P/1K1RR3 w - - 1 0',
    '8/1p6/8/2P3pk/3R2n1/7p/2r5/4R2K b - - 0 1',
    '2r5/1p5p/3p4/pP1P1R2/1n2B1k1/8/1P3KPP/8 w - - 1 0'
];

},{}],6:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');



module.exports = function(puzzle, forkType) {
    var chess = new Chess();
    chess.load(puzzle.fen);
    addForks(puzzle.fen, puzzle.features, forkType);
    addForks(c.fenForOtherSide(puzzle.fen), puzzle.features, forkType);
    return puzzle;
};

function addForks(fen, features, forkType) {
    var chess = new Chess();
    chess.load(fen);
    var moves = chess.moves({
        verbose: true
    });

    moves = moves.map(m => enrichMoveWithForkCaptures(fen, m));
    moves = moves.filter(m => m.captures.length >= 2);

    if (!forkType || forkType == 'q') {
        addForksBy(moves, 'q', 'Queen', chess.turn(), features);
    }
    if (!forkType || forkType == 'p') {
        addForksBy(moves, 'p', 'Pawn', chess.turn(), features);
    }
    if (!forkType || forkType == 'r') {
        addForksBy(moves, 'r', 'Rook', chess.turn(), features);
    }
    if (!forkType || forkType == 'b') {
        addForksBy(moves, 'b', 'Bishop', chess.turn(), features);
    }
    if (!forkType || forkType == 'n') {
        addForksBy(moves, 'n', 'Knight', chess.turn(), features);
    }
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

},{"./chessutils":3,"chess.js":1}],7:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');
var forks = require('./forks');
var hidden = require('./hidden');
var loose = require('./loose');
var pins = require('./pins');
var matethreat = require('./matethreat');
var checks = require('./checks');

module.exports = {

  /**
   * Calculate all features in the position.
   */
  extractFeatures: function(fen) {
    var puzzle = {
      fen: c.repairFen(fen),
      features: []
    };

    puzzle = forks(puzzle);
    puzzle = hidden(puzzle);
    puzzle = loose(puzzle);
    puzzle = pins(puzzle);
    puzzle = matethreat(puzzle);
    puzzle = checks(puzzle);

    return puzzle.features;
  },

  /**
   * Calculate single features in the position.
   */
  extractSingleFeature: function(featureDescription, fen) {
    var puzzle = {
      fen: c.repairFen(fen),
      features: []
    };

    if (featureDescription === "Queen forks") {
      puzzle = forks(puzzle,'q');
    }
    if (featureDescription === "Rook forks") {
      puzzle = forks(puzzle,'r');
    }
    if (featureDescription === "Bishop forks") {
      puzzle = forks(puzzle,'b');
    }
    if (featureDescription === "Knight forks") {
      puzzle = forks(puzzle,'n');
    }
    if (featureDescription === "Pawn forks") {
      puzzle = forks(puzzle,'p');
    }

    return puzzle.features;
  },

  featureFound: function(features, target) {
    var found = false;
    features
      .forEach(f => {
        f.targets.forEach(t => {
          if (t.target === target) {
            found = true;
          }
        });
      });
    return found;
  }


};

},{"./checks":2,"./chessutils":3,"./forks":6,"./hidden":8,"./loose":9,"./matethreat":10,"./pins":11,"chess.js":1}],8:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');

module.exports = function(puzzle) {
    addAligned(puzzle.fen, puzzle.features);
    addAligned(c.fenForOtherSide(puzzle.fen), puzzle.features);
    return puzzle;
};

function addAligned(fen, features) {
    var chess = new Chess(fen);

    var moves = chess.moves({
        verbose: true
    });

    var pieces = c.majorPiecesForColour(fen, chess.turn());
    var opponentsPieces = c.majorPiecesForColour(fen, chess.turn() == 'w' ? 'b' : 'w');

    var aligned = [];
    pieces.forEach(from => {
        var type = chess.get(from).type;
        if ((type !== 'k') && (type !== 'n')) {
            opponentsPieces.forEach(to => {
                if (c.canCapture(from, chess.get(from), to, chess.get(to))) {
                    var availableOnBoard = moves.filter(m => m.from === from && m.to === to);
                    if (availableOnBoard.length === 0) {
                        var revealingMoves = c.movesThatResultInCaptureThreat(fen, from, to);
                        if (revealingMoves.length > 0) {
                            aligned.push({
                                target: from,
                                diagram: diagram(from, to, revealingMoves)
                            });
                        }
                    }
                }
            });
        }
    });

    features.push({
        description: "Hidden attacker",
        side: chess.turn(),
        targets: aligned
    });

}

function diagram(from, to, revealingMoves) {
    var main = [{
        orig: from,
        dest: to,
        brush: 'red'
    }];
    var reveals = revealingMoves.map(m => {
        return {
            orig: m.from,
            dest: m.to,
            brush: 'paleBlue'
        };
    });
    return main.concat(reveals);
}

},{"./chessutils":3,"chess.js":1}],9:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');



module.exports = function(puzzle) {
    var chess = new Chess();
    addLoosePieces(puzzle.fen, puzzle.features);
    addLoosePieces(c.fenForOtherSide(puzzle.fen), puzzle.features);
    return puzzle;
};

function addLoosePieces(fen, features) {
    var chess = new Chess();
    chess.load(fen);
    var king = c.kingsSquare(fen, chess.turn());
    var opponent = chess.turn() === 'w' ? 'b' : 'w';
    var pieces = c.piecesForColour(fen, opponent);
    pieces = pieces.filter(square => !c.isCheckAfterPlacingKingAtSquare(fen, king, square));
    features.push({
        description: "Loose pieces",
        side: opponent,
        targets: pieces.map(t => {
            return {
                target: t,
                diagram: [{
                    orig: t,
                    brush: 'yellow'
                }]
            };
        })
    });
}

},{"./chessutils":3,"chess.js":1}],10:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');



module.exports = function(puzzle) {
    var chess = new Chess();
    chess.load(puzzle.fen);
    addMateInOneThreats(puzzle.fen, puzzle.features);
    addMateInOneThreats(c.fenForOtherSide(puzzle.fen), puzzle.features);
    return puzzle;
};

function addMateInOneThreats(fen, features) {
    var chess = new Chess();
    chess.load(fen);
    var moves = chess.moves({
        verbose: true
    });

    moves = moves.filter(m => canMateOnNextTurn(fen, m));

    features.push({
        description: "Mate-in-1 threats",
        side: chess.turn(),
        targets: moves.map(m => targetAndDiagram(m))
    });

}

function canMateOnNextTurn(fen, move) {
    var chess = new Chess(fen);
    chess.move(move);
    if (chess.in_check()) {
        return false;
    }

    chess.load(c.fenForOtherSide(chess.fen()));
    var moves = chess.moves({
        verbose: true
    });

    // stuff mating moves into move object for diagram
    move.matingMoves = moves.filter(m => /#/.test(m.san));
    return move.matingMoves.length > 0;
}

function targetAndDiagram(move) {
    return {
        target: move.to,
        diagram: [{
            orig: move.from,
            dest: move.to,
            brush: "paleGreen"
        }].concat(move.matingMoves.map(m => {
            return {
                orig: m.from,
                dest: m.to,
                brush: "paleGreen"
            };
        })).concat(move.matingMoves.map(m => {
            return {
                orig: m.from,
                brush: "paleGreen"
            };
        }))
    };
}

},{"./chessutils":3,"chess.js":1}],11:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');



module.exports = function(puzzle) {
    var chess = new Chess();
    chess.load(puzzle.fen);
//    addPinsForCurrentPlayer(puzzle.fen, puzzle.features);
//    addPinsForCurrentPlayer(c.fenForOtherSide(puzzle.fen), puzzle.features);
    return puzzle;
};

function addPinsForCurrentPlayer(fen, features) {
    var chess = new Chess();
    chess.load(fen);
    var pieces = c.piecesForColour(fen, chess.turn());
    var pinned = pieces.filter(square => c.isCheckAfterRemovingPieceAtSquare(fen, square));
    features.push({
        description: "Pinned pieces",
        side: chess.turn(),
        targets: pinned
    });

}

},{"./chessutils":3,"chess.js":1}],12:[function(require,module,exports){
/* global history */

'use strict';

module.exports = {

    getParameterByName: function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    updateUrlWithState: function(fen, side, description, target) {
        if (history.pushState) {
            var newurl = window.location.protocol + "//" +
                window.location.host +
                window.location.pathname +
                '?fen=' + encodeURIComponent(fen) +
                (side ? "&side=" + encodeURIComponent(side) : "") +
                (description ? "&description=" + encodeURIComponent(description) : "") +
                (target ? "&target=" + encodeURIComponent(target) : "");
            window.history.pushState({
                path: newurl
            }, '', newurl);
        }
    }
};

},{}],13:[function(require,module,exports){
module.exports = function(event) {
    if (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    }
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    return false;
};

},{}],14:[function(require,module,exports){
module.exports = function(list) {

    var occured = [];
    var result = [];

    list.forEach(x => {
        var json = JSON.stringify(x);
        if (!occured.includes(json)) {
            occured.push(json);
            result.push(x);
        }
    });
    return result;
};

},{}],15:[function(require,module,exports){
var m = (function app(window, undefined) {
	"use strict";
  	var VERSION = "v0.2.1";
	function isFunction(object) {
		return typeof object === "function";
	}
	function isObject(object) {
		return type.call(object) === "[object Object]";
	}
	function isString(object) {
		return type.call(object) === "[object String]";
	}
	var isArray = Array.isArray || function (object) {
		return type.call(object) === "[object Array]";
	};
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function () {};

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window) {
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);

	m.version = function() {
		return VERSION;
	};

	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m(tag, pairs) {
		for (var args = [], i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i];
		}
		if (isObject(tag)) return parameterize(tag, args);
		var hasAttrs = pairs != null && isObject(pairs) && !("tag" in pairs || "view" in pairs || "subtree" in pairs);
		var attrs = hasAttrs ? pairs : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (!isString(tag)) throw new Error("selector in m(selector, attrs, children) should be a string");
		while ((match = parser.exec(tag)) != null) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true);
			}
		}

		var children = hasAttrs ? args.slice(1) : args;
		if (children.length === 1 && isArray(children[0])) {
			cell.children = children[0];
		}
		else {
			cell.children = children;
		}

		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName]);
					cell.attrs[attrName] = ""; //create key in correct iteration order
				}
				else cell.attrs[attrName] = attrs[attrName];
			}
		}
		if (classes.length) cell.attrs[classAttrName] = classes.join(" ");

		return cell;
	}
	function forEach(list, f) {
		for (var i = 0; i < list.length && !f(list[i], i++);) {}
	}
	function forKeys(list, f) {
		forEach(list, function (attrs, i) {
			return (attrs = attrs && attrs.attrs) && attrs.key != null && f(attrs, i);
		});
	}
	// This function was causing deopts in Chrome.
	// Well no longer
	function dataToString(data) {
    if (data == null) return '';
    if (typeof data === 'object') return data;
    if (data.toString() == null) return ""; // prevent recursion error on FF
    return data;
	}
	// This function was causing deopts in Chrome.
	function injectTextNode(parentElement, first, index, data) {
		try {
			insertNode(parentElement, first, index);
			first.nodeValue = data;
		} catch (e) {} //IE erroneously throws error when appending an empty text node after a null
	}

	function flatten(list) {
		//recursively flatten array
		for (var i = 0; i < list.length; i++) {
			if (isArray(list[i])) {
				list = list.concat.apply([], list);
				//check current index again and flatten until there are no more nested arrays at that index
				i--;
			}
		}
		return list;
	}

	function insertNode(parentElement, node, index) {
		parentElement.insertBefore(node, parentElement.childNodes[index] || null);
	}

	var DELETION = 1, INSERTION = 2, MOVE = 3;

	function handleKeysDiffer(data, existing, cached, parentElement) {
		forKeys(data, function (key, i) {
			existing[key = key.key] = existing[key] ? {
				action: MOVE,
				index: i,
				from: existing[key].index,
				element: cached.nodes[existing[key].index] || $document.createElement("div")
			} : {action: INSERTION, index: i};
		});
		var actions = [];
		for (var prop in existing) actions.push(existing[prop]);
		var changes = actions.sort(sortChanges), newCached = new Array(cached.length);
		newCached.nodes = cached.nodes.slice();

		forEach(changes, function (change) {
			var index = change.index;
			if (change.action === DELETION) {
				clear(cached[index].nodes, cached[index]);
				newCached.splice(index, 1);
			}
			if (change.action === INSERTION) {
				var dummy = $document.createElement("div");
				dummy.key = data[index].attrs.key;
				insertNode(parentElement, dummy, index);
				newCached.splice(index, 0, {
					attrs: {key: data[index].attrs.key},
					nodes: [dummy]
				});
				newCached.nodes[index] = dummy;
			}

			if (change.action === MOVE) {
				var changeElement = change.element;
				var maybeChanged = parentElement.childNodes[index];
				if (maybeChanged !== changeElement && changeElement !== null) {
					parentElement.insertBefore(changeElement, maybeChanged || null);
				}
				newCached[index] = cached[change.from];
				newCached.nodes[index] = changeElement;
			}
		});

		return newCached;
	}

	function diffKeys(data, cached, existing, parentElement) {
		var keysDiffer = data.length !== cached.length;
		if (!keysDiffer) {
			forKeys(data, function (attrs, i) {
				var cachedCell = cached[i];
				return keysDiffer = cachedCell && cachedCell.attrs && cachedCell.attrs.key !== attrs.key;
			});
		}

		return keysDiffer ? handleKeysDiffer(data, existing, cached, parentElement) : cached;
	}

	function diffArray(data, cached, nodes) {
		//diff the array itself

		//update the list of DOM nodes by collecting the nodes from each item
		forEach(data, function (_, i) {
			if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes);
		})
		//remove items from the end of the array if the new array is shorter than the old one. if errors ever happen here, the issue is most likely
		//a bug in the construction of the `cached` data structure somewhere earlier in the program
		forEach(cached.nodes, function (node, i) {
			if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]]);
		})
		if (data.length < cached.length) cached.length = data.length;
		cached.nodes = nodes;
	}

	function buildArrayKeys(data) {
		var guid = 0;
		forKeys(data, function () {
			forEach(data, function (attrs) {
				if ((attrs = attrs && attrs.attrs) && attrs.key == null) attrs.key = "__mithril__" + guid++;
			})
			return 1;
		});
	}

	function maybeRecreateObject(data, cached, dataAttrKeys) {
		//if an element is different enough from the one in cache, recreate it
		if (data.tag !== cached.tag ||
				dataAttrKeys.sort().join() !== Object.keys(cached.attrs).sort().join() ||
				data.attrs.id !== cached.attrs.id ||
				data.attrs.key !== cached.attrs.key ||
				(m.redraw.strategy() === "all" && (!cached.configContext || cached.configContext.retain !== true)) ||
				(m.redraw.strategy() === "diff" && cached.configContext && cached.configContext.retain === false)) {
			if (cached.nodes.length) clear(cached.nodes);
			if (cached.configContext && isFunction(cached.configContext.onunload)) cached.configContext.onunload();
			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (controller.unload) controller.onunload({preventDefault: noop});
				});
			}
		}
	}

	function getObjectNamespace(data, namespace) {
		return data.attrs.xmlns ? data.attrs.xmlns :
			data.tag === "svg" ? "http://www.w3.org/2000/svg" :
			data.tag === "math" ? "http://www.w3.org/1998/Math/MathML" :
			namespace;
	}

	function unloadCachedControllers(cached, views, controllers) {
		if (controllers.length) {
			cached.views = views;
			cached.controllers = controllers;
			forEach(controllers, function (controller) {
				if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old;
				if (pendingRequests && controller.onunload) {
					var onunload = controller.onunload;
					controller.onunload = noop;
					controller.onunload.$old = onunload;
				}
			});
		}
	}

	function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
		//schedule configs to be called. They are called after `build`
		//finishes running
		if (isFunction(data.attrs.config)) {
			var context = cached.configContext = cached.configContext || {};

			//bind
			configs.push(function() {
				return data.attrs.config.call(data, node, !isNew, context, cached);
			});
		}
	}

	function buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers) {
		var node = cached.nodes[0];
		if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
		cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
		cached.nodes.intact = true;

		if (controllers.length) {
			cached.views = views;
			cached.controllers = controllers;
		}

		return node;
	}

	function handleNonexistentNodes(data, parentElement, index) {
		var nodes;
		if (data.$trusted) {
			nodes = injectHTML(parentElement, index, data);
		}
		else {
			nodes = [$document.createTextNode(data)];
			if (!parentElement.nodeName.match(voidElements)) insertNode(parentElement, nodes[0], index);
		}

		var cached = typeof data === "string" || typeof data === "number" || typeof data === "boolean" ? new data.constructor(data) : data;
		cached.nodes = nodes;
		return cached;
	}

	function reattachNodes(data, cached, parentElement, editable, index, parentTag) {
		var nodes = cached.nodes;
		if (!editable || editable !== $document.activeElement) {
			if (data.$trusted) {
				clear(nodes, cached);
				nodes = injectHTML(parentElement, index, data);
			}
			//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
			//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
			else if (parentTag === "textarea") {
				parentElement.value = data;
			}
			else if (editable) {
				editable.innerHTML = data;
			}
			else {
				//was a trusted string
				if (nodes[0].nodeType === 1 || nodes.length > 1) {
					clear(cached.nodes, cached);
					nodes = [$document.createTextNode(data)];
				}
				injectTextNode(parentElement, nodes[0], index, data);
			}
		}
		cached = new data.constructor(data);
		cached.nodes = nodes;
		return cached;
	}

	function handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) {
		//handle text nodes
		return cached.nodes.length === 0 ? handleNonexistentNodes(data, parentElement, index) :
			cached.valueOf() !== data.valueOf() || shouldReattach === true ?
				reattachNodes(data, cached, parentElement, editable, index, parentTag) :
			(cached.nodes.intact = true, cached);
	}

	function getSubArrayCount(item) {
		if (item.$trusted) {
			//fix offset of next element if item was a trusted string w/ more than one html element
			//the first clause in the regexp matches elements
			//the second clause (after the pipe) matches text nodes
			var match = item.match(/<[^\/]|\>\s*[^<]/g);
			if (match != null) return match.length;
		}
		else if (isArray(item)) {
			return item.length;
		}
		return 1;
	}

	function buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) {
		data = flatten(data);
		var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

		//keys algorithm: sort elements without recreating them if keys are present
		//1) create a map of all existing keys, and mark all for deletion
		//2) add new keys to map and mark them for addition
		//3) if key exists in new list, change action from deletion to a move
		//4) for each key, handle its corresponding action as marked in previous steps
		var existing = {}, shouldMaintainIdentities = false;
		forKeys(cached, function (attrs, i) {
			shouldMaintainIdentities = true;
			existing[cached[i].attrs.key] = {action: DELETION, index: i};
		});

		buildArrayKeys(data);
		if (shouldMaintainIdentities) cached = diffKeys(data, cached, existing, parentElement);
		//end key algorithm

		var cacheCount = 0;
		//faster explicitly written
		for (var i = 0, len = data.length; i < len; i++) {
			//diff each item in the array
			var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);

			if (item !== undefined) {
				intact = intact && item.nodes.intact;
				subArrayCount += getSubArrayCount(item);
				cached[cacheCount++] = item;
			}
		}

		if (!intact) diffArray(data, cached, nodes);
		return cached
	}

	function makeCache(data, cached, index, parentIndex, parentCache) {
		if (cached != null) {
			if (type.call(cached) === type.call(data)) return cached;

			if (parentCache && parentCache.nodes) {
				var offset = index - parentIndex, end = offset + (isArray(data) ? data : cached.nodes).length;
				clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
			} else if (cached.nodes) {
				clear(cached.nodes, cached);
			}
		}

		cached = new data.constructor();
		//if constructor creates a virtual dom element, use a blank object
		//as the base cached node instead of copying the virtual el (#277)
		if (cached.tag) cached = {};
		cached.nodes = [];
		return cached;
	}

	function constructNode(data, namespace) {
		return namespace === undefined ?
			data.attrs.is ? $document.createElement(data.tag, data.attrs.is) : $document.createElement(data.tag) :
			data.attrs.is ? $document.createElementNS(namespace, data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag);
	}

	function constructAttrs(data, node, namespace, hasKeys) {
		return hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs;
	}

	function constructChildren(data, node, cached, editable, namespace, configs) {
		return data.children != null && data.children.length > 0 ?
			build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
			data.children;
	}

	function reconstructCached(data, attrs, children, node, namespace, views, controllers) {
		var cached = {tag: data.tag, attrs: attrs, children: children, nodes: [node]};
		unloadCachedControllers(cached, views, controllers);
		if (cached.children && !cached.children.nodes) cached.children.nodes = [];
		//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
		if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
		return cached
	}

	function getController(views, view, cachedControllers, controller) {
		var controllerIndex = m.redraw.strategy() === "diff" && views ? views.indexOf(view) : -1;
		return controllerIndex > -1 ? cachedControllers[controllerIndex] :
			typeof controller === "function" ? new controller() : {};
	}

	function updateLists(views, controllers, view, controller) {
		if (controller.onunload != null) unloaders.push({controller: controller, handler: controller.onunload});
		views.push(view);
		controllers.push(controller);
	}

	function checkView(data, view, cached, cachedControllers, controllers, views) {
		var controller = getController(cached.views, view, cachedControllers, data.controller);
		//Faster to coerce to number and check for NaN
		var key = +(data && data.attrs && data.attrs.key);
		data = pendingRequests === 0 || forcing || cachedControllers && cachedControllers.indexOf(controller) > -1 ? data.view(controller) : {tag: "placeholder"};
		if (data.subtree === "retain") return cached;
		if (key === key) (data.attrs = data.attrs || {}).key = key;
		updateLists(views, controllers, view, controller);
		return data;
	}

	function markViews(data, cached, views, controllers) {
		var cachedControllers = cached && cached.controllers;
		while (data.view != null) data = checkView(data, data.view.$original || data.view, cached, cachedControllers, controllers, views);
		return data;
	}

	function buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) {
		var views = [], controllers = [];
		data = markViews(data, cached, views, controllers);
		if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.");
		data.attrs = data.attrs || {};
		cached.attrs = cached.attrs || {};
		var dataAttrKeys = Object.keys(data.attrs);
		var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
		maybeRecreateObject(data, cached, dataAttrKeys);
		if (!isString(data.tag)) return;
		var isNew = cached.nodes.length === 0;
		namespace = getObjectNamespace(data, namespace);
		var node;
		if (isNew) {
			node = constructNode(data, namespace);
			//set attributes first, then create children
			var attrs = constructAttrs(data, node, namespace, hasKeys)
			var children = constructChildren(data, node, cached, editable, namespace, configs);
			cached = reconstructCached(data, attrs, children, node, namespace, views, controllers);
		}
		else {
			node = buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers);
		}
		if (isNew || shouldReattach === true && node != null) insertNode(parentElement, node, index);
		//schedule configs to be called. They are called after `build`
		//finishes running
		scheduleConfigsToBeCalled(configs, data, node, isNew, cached);
		return cached
	}

	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal
		//of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM
		//    based on what the difference is
		//3 - recursively apply this algorithm for every array and for the
		//    children of every virtual element

		//the `cached` data structure is essentially the same as the previous
		//redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of
		//   DOM elements that correspond to the data represented by the
		//   respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`,
		//   `cached` is *always* a non-primitive object, i.e. if the data was
		//   a string, then cached is a String instance. If data was `null` or
		//   `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state
		//   storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when
		//   it's an Array, it represents a list of elements; when it's a
		//   String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea
		//values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes.
		//They're artifacts from before arrays started being flattened and are
		//likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being
		//diffed
		//`shouldReattach` is a flag indicating whether a parent node was
		//recreated (if so, and if this node is reused, then this node must
		//reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is
		//contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down
		//from an ancestor
		//`configs` is a list of config functions to run after the topmost
		//`build` call finishes running

		//there's logic that relies on the assumption that null and undefined
		//data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix
		//  implicit and explicit return statements (e.g.
		//  function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		data = dataToString(data);
		if (data.subtree === "retain") return cached;
		cached = makeCache(data, cached, index, parentIndex, parentCache);
		return isArray(data) ? buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) :
			data != null && isObject(data) ? buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) :
			!isFunction(data) ? handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) :
			cached;
	}
	function sortChanges(a, b) { return a.action - b.action || a.index - b.index; }
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				//`config` isn't a real attributes, so ignore it
				if (attrName === "config" || attrName === "key") continue;
				//hook event handlers to the auto-redrawing system
				else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
				node[attrName] = autoredraw(dataAttr, node);
				}
				//handle `style: {...}`
				else if (attrName === "style" && dataAttr != null && isObject(dataAttr)) {
				for (var rule in dataAttr) {
						if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule];
				}
				for (var rule in cachedAttr) {
						if (!(rule in dataAttr)) node.style[rule] = "";
				}
				}
				//handle SVG
				else if (namespace != null) {
				if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
				else node.setAttribute(attrName === "className" ? "class" : attrName, dataAttr);
				}
				//handle cases that are properties (but ignore cases where we should use setAttribute instead)
				//- list and form are typically used as strings, but are DOM element references in js
				//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
				else if (attrName in node && attrName !== "list" && attrName !== "style" && attrName !== "form" && attrName !== "type" && attrName !== "width" && attrName !== "height") {
				//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
				if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr;
				}
				else node.setAttribute(attrName, dataAttr);
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr;
			}
		}
		return cachedAttrs;
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try { nodes[i].parentNode.removeChild(nodes[i]); }
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i]);
			}
		}
		//release memory if nodes is an array. This check should fail if nodes is a NodeList (see loop above)
		if (nodes.length) nodes.length = 0;
	}
	function unload(cached) {
		if (cached.configContext && isFunction(cached.configContext.onunload)) {
			cached.configContext.onunload();
			cached.configContext.onunload = null;
		}
		if (cached.controllers) {
			forEach(cached.controllers, function (controller) {
				if (isFunction(controller.onunload)) controller.onunload({preventDefault: noop});
			});
		}
		if (cached.children) {
			if (isArray(cached.children)) forEach(cached.children, unload);
			else if (cached.children.tag) unload(cached.children);
		}
	}

	var insertAdjacentBeforeEnd = (function () {
		var rangeStrategy = function (parentElement, data) {
			parentElement.appendChild($document.createRange().createContextualFragment(data));
		};
		var insertAdjacentStrategy = function (parentElement, data) {
			parentElement.insertAdjacentHTML("beforeend", data);
		};

		try {
			$document.createRange().createContextualFragment('x');
			return rangeStrategy;
		} catch (e) {
			return insertAdjacentStrategy;
		}
	})();

	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType !== 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder);
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data);
		}
		else insertAdjacentBeforeEnd(parentElement, data);

		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++;
		}
		return nodes;
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try { return callback.call(object, e); }
			finally {
				endFirstComputation();
			}
		};
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement);
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes;
		},
		insertBefore: function(node) {
			this.appendChild(node);
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag !== "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		forEach(configs, function (config) { config(); });
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index;
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value;
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store;
		};

		prop.toJSON = function() {
			return store;
		};

		return prop;
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if ((store != null && isObject(store) || isFunction(store)) && isFunction(store.then)) {
			return propify(store);
		}

		return gettersetter(store);
	};

	var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, topComponent, unloaders = [];
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this;
		};
		if (component.controller) controller.prototype = component.controller.prototype;
		var view = function(ctrl) {
			var currentArgs = arguments.length > 1 ? args.concat([].slice.call(arguments, 1)) : args;
			return component.view.apply(component, currentArgs ? [ctrl].concat(currentArgs) : [ctrl]);
		};
		view.$original = component.view;
		var output = {controller: controller, view: view};
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key};
		return output;
	}
	m.component = function(component) {
		for (var args = [], i = 1; i < arguments.length; i++) args.push(arguments[i]);
		return parameterize(component, args);
	};
	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;

		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};

		forEach(unloaders, function (unloader) {
			unloader.handler.call(unloader.controller, event);
			unloader.controller.onunload = null;
		});

		if (isPrevented) {
			forEach(unloaders, function (unloader) {
				unloader.controller.onunload = unloader.handler;
			});
		}
		else unloaders = [];

		if (controllers[index] && isFunction(controllers[index].onunload)) {
			controllers[index].onunload(event);
		}

		var isNullComponent = component === null;

		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			var currentComponent = component ? (topComponent = component) : (topComponent = component = {controller: noop});
			var controller = new (component.controller || noop)();
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component;
			}
			endFirstComputation();
			if (isNullComponent) {
				removeRootElement(root, index);
			}
			return controllers[index];
		}
		if (isNullComponent) {
			removeRootElement(root, index);
		}
	};

	function removeRootElement(root, index) {
		roots.splice(index, 1);
		controllers.splice(index, 1);
		components.splice(index, 1);
		reset(root);
		nodeCache.splice(getCellCacheKey(root), 1);
	}

	var redrawing = false, forcing = false;
	m.redraw = function(force) {
		if (redrawing) return;
		redrawing = true;
		if (force) forcing = true;
		try {
			//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
			//lastRedrawID is null if it's the first redraw and not an event handler
			if (lastRedrawId && !force) {
				//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
				//when rAF: always reschedule redraw
				if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
				}
			}
			else {
				redraw();
				lastRedrawId = $requestAnimationFrame(function() { lastRedrawId = null; }, FRAME_BUDGET);
			}
		}
		finally {
			redrawing = forcing = false;
		}
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook();
			computePreRedrawHook = null;
		}
		forEach(roots, function (root, i) {
			var component = components[i];
			if (controllers[i]) {
				var args = [controllers[i]];
				m.render(root, component.view ? component.view(controllers[i], args) : "");
			}
		});
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null;
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff");
	}

	var pendingRequests = 0;
	m.startComputation = function() { pendingRequests++; };
	m.endComputation = function() {
		if (pendingRequests > 1) pendingRequests--;
		else {
			pendingRequests = 0;
			m.redraw();
		}
	}

	function endFirstComputation() {
		if (m.redraw.strategy() === "none") {
			pendingRequests--;
			m.redraw.strategy("diff");
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback, callbackThis) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			var _this = callbackThis || this;
			withAttrCallback.call(_this, prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop));
		};
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
	m.route = function(root, arg1, arg2, vdom) {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && isString(arg1)) {
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, arg2, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route");
					isDefaultRoute = true;
					m.route(arg1, true);
					isDefaultRoute = false;
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode];
				if (m.route.mode === "pathname") path += $location.search;
				if (currentRoute !== normalizeRoute(path)) redirect(path);
			};

			computePreRedrawHook = setScroll;
			window[listener]();
		}
		//config: m.route
		else if (root.addEventListener || root.attachEvent) {
			root.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (root.addEventListener) {
				root.removeEventListener("click", routeUnobtrusive);
				root.addEventListener("click", routeUnobtrusive);
			}
			else {
				root.detachEvent("onclick", routeUnobtrusive);
				root.attachEvent("onclick", routeUnobtrusive);
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (isString(root)) {
			var oldRoute = currentRoute;
			currentRoute = root;
			var args = arg1 || {};
			var queryIndex = currentRoute.indexOf("?");
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {};
			for (var i in args) params[i] = args[i];
			var querystring = buildQueryString(params);
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute;
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arg2 : arg1) === true || oldRoute === root;

			if (window.history.pushState) {
				computePreRedrawHook = setScroll;
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute);
			}
			else {
				$location[m.route.mode] = currentRoute;
				redirect(modes[m.route.mode] + currentRoute);
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()");
		if( !key ){
			return routeParams;
		}
		return routeParams[key];
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length);
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart);
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true;
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					forEach(keys, function (key, i) {
						routeParams[key.replace(/:|\./g, "")] = decodeURIComponent(values[i]);
					})
					m.mount(root, router[route]);
				});
				return true;
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;

		if (e.ctrlKey || e.metaKey || e.which === 2) return;

		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;

		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() !== "A") currentTarget = currentTarget.parentNode;
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args);
	}
	function setScroll() {
		if (m.route.mode !== "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0);
	}
	function buildQueryString(object, prefix) {
		var duplicates = {};
		var str = [];
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop;
			var value = object[prop];

			if (value === null) {
				str.push(encodeURIComponent(key));
			} else if (isObject(value)) {
				str.push(buildQueryString(value, key));
			} else if (isArray(value)) {
				var keys = [];
				duplicates[key] = duplicates[key] || {};
				forEach(value, function (item) {
					if (!duplicates[key][item]) {
						duplicates[key][item] = true;
						keys.push(encodeURIComponent(key) + "=" + encodeURIComponent(item));
					}
				});
				str.push(keys.join("&"));
			} else if (value !== undefined) {
				str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
			}
		}
		return str.join("&");
	}
	function parseQueryString(str) {
		if (str === "" || str == null) return {};
		if (str.charAt(0) === "?") str = str.slice(1);

		var pairs = str.split("&"), params = {};
		forEach(pairs, function (string) {
			var pair = string.split("=");
			var key = decodeURIComponent(pair[0]);
			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null;
			if (params[key] != null) {
				if (!isArray(params[key])) params[key] = [params[key]];
				params[key].push(value);
			}
			else params[key] = value;
		});

		return params;
	}
	m.route.buildQueryString = buildQueryString;
	m.route.parseQueryString = parseQueryString;

	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined;
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred;
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue);
		};
		prop["catch"] = prop.then.bind(null, null);
		prop["finally"] = function(callback) {
			var _callback = function() {return m.deferred().resolve(callback()).promise;};
			return prop.then(function(value) {
				return propify(_callback().then(function() {return value;}), initialValue);
			}, function(reason) {
				return propify(_callback().then(function() {throw new Error(reason);}), initialValue);
			});
		};
		return prop;
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self.promise = {};

		self.resolve = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire();
			}
			return this;
		};

		self.reject = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire();
			}
			return this;
		};

		self.promise.then = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback)
			if (state === RESOLVED) {
				deferred.resolve(promiseValue);
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue);
			}
			else {
				next.push(deferred);
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED ? deferred.resolve(promiseValue) : deferred.reject(promiseValue);
			});
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && isObject(promiseValue)) || isFunction(promiseValue)) && isFunction(then)) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback();
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback();
					});
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback();
				}
			} else {
				notThennableCallback();
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then;
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire();
			}

			thennable(then, function() {
				state = RESOLVING;
				fire();
			}, function() {
				state = REJECTING;
				fire();
			}, function() {
				try {
					if (state === RESOLVING && isFunction(successCallback)) {
						promiseValue = successCallback(promiseValue);
					}
					else if (state === REJECTING && isFunction(failureCallback)) {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING;
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish();
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish();
				} else {
					thennable(then, function () {
						finish(RESOLVED);
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED);
					});
				}
			});
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) {
			pendingRequests = 0;
			throw e;
		}
	};

	m.sync = function(args) {
		var method = "resolve";

		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results);
				}
				return value;
			};
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			forEach(args, function (arg, i) {
				arg.then(synchronizer(i, true), synchronizer(i, false));
			});
		}
		else deferred.resolve([]);

		return deferred.promise;
	};
	function identity(value) { return value; }

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36)
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined;
			};

			script.onerror = function() {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({
							error: "Error making jsonp request"
						})
					}
				});
				window[callbackKey] = undefined;

				return false;
			}

			script.onload = function() {
				return false;
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script);
		}
		else {
			var xhr = new window.XMLHttpRequest();
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr});
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (isFunction(options.config)) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr;
			}

			var data = options.method === "GET" || !options.data ? "" : options.data;
			if (data && (!isString(data) && data.constructor !== window.FormData)) {
				throw new Error("Request data should be either be a string or FormData. Check the `serialize` option in `m.request`");
			}
			xhr.send(data);
			return xhr;
		}
	}

	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType !== "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "");
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions;
	}

	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			forEach(tokens, function (token) {
				var key = token.slice(1);
				url = url.replace(token, data[key]);
				delete data[key];
			});
		}
		return url;
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp"
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) { return jsonp.responseText } : xhrOptions.extract || function(xhr) {
			if (xhr.responseText.length === 0 && deserialize === JSON.parse) {
				return null
			} else {
				return xhr.responseText
			}
		};
		xhrOptions.method = (xhrOptions.method || "GET").toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (isArray(response) && xhrOptions.type) {
						forEach(response, function (res, i) {
							response[i] = new xhrOptions.type(res);
						});
					} else if (xhrOptions.type) {
						response = new xhrOptions.type(response);
					}
				}

				deferred[e.type === "load" ? "resolve" : "reject"](response);
			} catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e);
			}

			if (xhrOptions.background !== true) m.endComputation()
		}

		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise;
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m;
})(typeof window !== "undefined" ? window : {});

if (typeof module === "object" && module != null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() { return m });

},{}],16:[function(require,module,exports){
var util = require('./util');

// https://gist.github.com/gre/1650294
var easing = {
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
};

function makePiece(k, piece, invert) {
  var key = invert ? util.invertKey(k) : k;
  return {
    key: key,
    pos: util.key2pos(key),
    role: piece.role,
    color: piece.color
  };
}

function samePiece(p1, p2) {
  return p1.role === p2.role && p1.color === p2.color;
}

function closer(piece, pieces) {
  return pieces.sort(function(p1, p2) {
    return util.distance(piece.pos, p1.pos) - util.distance(piece.pos, p2.pos);
  })[0];
}

function computePlan(prev, current) {
  var bounds = current.bounds(),
    width = bounds.width / 8,
    height = bounds.height / 8,
    anims = {},
    animedOrigs = [],
    fadings = [],
    missings = [],
    news = [],
    invert = prev.orientation !== current.orientation,
    prePieces = {},
    white = current.orientation === 'white';
  for (var pk in prev.pieces) {
    var piece = makePiece(pk, prev.pieces[pk], invert);
    prePieces[piece.key] = piece;
  }
  for (var i = 0; i < util.allKeys.length; i++) {
    var key = util.allKeys[i];
    if (key !== current.movable.dropped[1]) {
      var curP = current.pieces[key];
      var preP = prePieces[key];
      if (curP) {
        if (preP) {
          if (!samePiece(curP, preP)) {
            missings.push(preP);
            news.push(makePiece(key, curP, false));
          }
        } else
          news.push(makePiece(key, curP, false));
      } else if (preP)
        missings.push(preP);
    }
  }
  news.forEach(function(newP) {
    var preP = closer(newP, missings.filter(util.partial(samePiece, newP)));
    if (preP) {
      var orig = white ? preP.pos : newP.pos;
      var dest = white ? newP.pos : preP.pos;
      var vector = [(orig[0] - dest[0]) * width, (dest[1] - orig[1]) * height];
      anims[newP.key] = [vector, vector];
      animedOrigs.push(preP.key);
    }
  });
  missings.forEach(function(p) {
    if (
      p.key !== current.movable.dropped[0] &&
      !util.containsX(animedOrigs, p.key) &&
      !(current.items ? current.items.render(p.pos, p.key) : false)
    )
      fadings.push({
        piece: p,
        opacity: 1
      });
  });

  return {
    anims: anims,
    fadings: fadings
  };
}

function roundBy(n, by) {
  return Math.round(n * by) / by;
}

function go(data) {
  if (!data.animation.current.start) return; // animation was canceled
  var rest = 1 - (new Date().getTime() - data.animation.current.start) / data.animation.current.duration;
  if (rest <= 0) {
    data.animation.current = {};
    data.render();
  } else {
    var ease = easing.easeInOutCubic(rest);
    for (var key in data.animation.current.anims) {
      var cfg = data.animation.current.anims[key];
      cfg[1] = [roundBy(cfg[0][0] * ease, 10), roundBy(cfg[0][1] * ease, 10)];
    }
    for (var i in data.animation.current.fadings) {
      data.animation.current.fadings[i].opacity = roundBy(ease, 100);
    }
    data.render();
    util.requestAnimationFrame(function() {
      go(data);
    });
  }
}

function animate(transformation, data) {
  // clone data
  var prev = {
    orientation: data.orientation,
    pieces: {}
  };
  // clone pieces
  for (var key in data.pieces) {
    prev.pieces[key] = {
      role: data.pieces[key].role,
      color: data.pieces[key].color
    };
  }
  var result = transformation();
  if (data.animation.enabled) {
    var plan = computePlan(prev, data);
    if (Object.keys(plan.anims).length > 0 || plan.fadings.length > 0) {
      var alreadyRunning = data.animation.current.start;
      data.animation.current = {
        start: new Date().getTime(),
        duration: data.animation.duration,
        anims: plan.anims,
        fadings: plan.fadings
      };
      if (!alreadyRunning) go(data);
    } else {
      // don't animate, just render right away
      data.renderRAF();
    }
  } else {
    // animations are now disabled
    data.renderRAF();
  }
  return result;
}

// transformation is a function
// accepts board data and any number of arguments,
// and mutates the board.
module.exports = function(transformation, data, skip) {
  return function() {
    var transformationArgs = [data].concat(Array.prototype.slice.call(arguments, 0));
    if (!data.render) return transformation.apply(null, transformationArgs);
    else if (data.animation.enabled && !skip)
      return animate(util.partialApply(transformation, transformationArgs), data);
    else {
      var result = transformation.apply(null, transformationArgs);
      data.renderRAF();
      return result;
    }
  };
};

},{"./util":30}],17:[function(require,module,exports){
var board = require('./board');

module.exports = function(controller) {

  return {
    set: controller.set,
    toggleOrientation: controller.toggleOrientation,
    getOrientation: controller.getOrientation,
    getPieces: function() {
      return controller.data.pieces;
    },
    getMaterialDiff: function() {
      return board.getMaterialDiff(controller.data);
    },
    getFen: controller.getFen,
    move: controller.apiMove,
    newPiece: controller.apiNewPiece,
    setPieces: controller.setPieces,
    setCheck: controller.setCheck,
    playPremove: controller.playPremove,
    playPredrop: controller.playPredrop,
    cancelPremove: controller.cancelPremove,
    cancelPredrop: controller.cancelPredrop,
    cancelMove: controller.cancelMove,
    stop: controller.stop,
    explode: controller.explode,
    setAutoShapes: controller.setAutoShapes,
    setShapes: controller.setShapes,
    data: controller.data // directly exposes chessground state for more messing around
  };
};

},{"./board":18}],18:[function(require,module,exports){
var util = require('./util');
var premove = require('./premove');
var anim = require('./anim');
var hold = require('./hold');

function callUserFunction(f) {
  setTimeout(f, 1);
}

function toggleOrientation(data) {
  data.orientation = util.opposite(data.orientation);
}

function reset(data) {
  data.lastMove = null;
  setSelected(data, null);
  unsetPremove(data);
  unsetPredrop(data);
}

function setPieces(data, pieces) {
  Object.keys(pieces).forEach(function(key) {
    if (pieces[key]) data.pieces[key] = pieces[key];
    else delete data.pieces[key];
  });
  data.movable.dropped = [];
}

function setCheck(data, color) {
  var checkColor = color || data.turnColor;
  Object.keys(data.pieces).forEach(function(key) {
    if (data.pieces[key].color === checkColor && data.pieces[key].role === 'king') data.check = key;
  });
}

function setPremove(data, orig, dest) {
  unsetPredrop(data);
  data.premovable.current = [orig, dest];
  callUserFunction(util.partial(data.premovable.events.set, orig, dest));
}

function unsetPremove(data) {
  if (data.premovable.current) {
    data.premovable.current = null;
    callUserFunction(data.premovable.events.unset);
  }
}

function setPredrop(data, role, key) {
  unsetPremove(data);
  data.predroppable.current = {
    role: role,
    key: key
  };
  callUserFunction(util.partial(data.predroppable.events.set, role, key));
}

function unsetPredrop(data) {
  if (data.predroppable.current.key) {
    data.predroppable.current = {};
    callUserFunction(data.predroppable.events.unset);
  }
}

function tryAutoCastle(data, orig, dest) {
  if (!data.autoCastle) return;
  var king = data.pieces[dest];
  if (king.role !== 'king') return;
  var origPos = util.key2pos(orig);
  if (origPos[0] !== 5) return;
  if (origPos[1] !== 1 && origPos[1] !== 8) return;
  var destPos = util.key2pos(dest),
    oldRookPos, newRookPos, newKingPos;
  if (destPos[0] === 7 || destPos[0] === 8) {
    oldRookPos = util.pos2key([8, origPos[1]]);
    newRookPos = util.pos2key([6, origPos[1]]);
    newKingPos = util.pos2key([7, origPos[1]]);
  } else if (destPos[0] === 3 || destPos[0] === 1) {
    oldRookPos = util.pos2key([1, origPos[1]]);
    newRookPos = util.pos2key([4, origPos[1]]);
    newKingPos = util.pos2key([3, origPos[1]]);
  } else return;
  delete data.pieces[orig];
  delete data.pieces[dest];
  delete data.pieces[oldRookPos];
  data.pieces[newKingPos] = {
    role: 'king',
    color: king.color
  };
  data.pieces[newRookPos] = {
    role: 'rook',
    color: king.color
  };
}

function baseMove(data, orig, dest) {
  var success = anim(function() {
    if (orig === dest || !data.pieces[orig]) return false;
    var captured = (
      data.pieces[dest] &&
      data.pieces[dest].color !== data.pieces[orig].color
    ) ? data.pieces[dest] : null;
    callUserFunction(util.partial(data.events.move, orig, dest, captured));
    data.pieces[dest] = data.pieces[orig];
    delete data.pieces[orig];
    data.lastMove = [orig, dest];
    data.check = null;
    tryAutoCastle(data, orig, dest);
    callUserFunction(data.events.change);
    return true;
  }, data)();
  if (success) data.movable.dropped = [];
  return success;
}

function baseNewPiece(data, piece, key) {
  if (data.pieces[key]) return false;
  callUserFunction(util.partial(data.events.dropNewPiece, piece, key));
  data.pieces[key] = piece;
  data.lastMove = [key, key];
  data.check = null;
  callUserFunction(data.events.change);
  data.movable.dropped = [];
  data.movable.dests = {};
  data.turnColor = util.opposite(data.turnColor);
  data.renderRAF();
  return true;
}

function baseUserMove(data, orig, dest) {
  var result = baseMove(data, orig, dest);
  if (result) {
    data.movable.dests = {};
    data.turnColor = util.opposite(data.turnColor);
  }
  return result;
}

function apiMove(data, orig, dest) {
  return baseMove(data, orig, dest);
}

function apiNewPiece(data, piece, key) {
  return baseNewPiece(data, piece, key);
}

function userMove(data, orig, dest) {
  if (!dest) {
    hold.cancel();
    setSelected(data, null);
    if (data.movable.dropOff === 'trash') {
      delete data.pieces[orig];
      callUserFunction(data.events.change);
    }
  } else if (canMove(data, orig, dest)) {
    if (baseUserMove(data, orig, dest)) {
      var holdTime = hold.stop();
      setSelected(data, null);
      callUserFunction(util.partial(data.movable.events.after, orig, dest, {
        premove: false,
        holdTime: holdTime
      }));
      return true;
    }
  } else if (canPremove(data, orig, dest)) {
    setPremove(data, orig, dest);
    setSelected(data, null);
  } else if (isMovable(data, dest) || isPremovable(data, dest)) {
    setSelected(data, dest);
    hold.start();
  } else setSelected(data, null);
}

function dropNewPiece(data, orig, dest) {
  if (canDrop(data, orig, dest)) {
    var piece = data.pieces[orig];
    delete data.pieces[orig];
    baseNewPiece(data, piece, dest);
    data.movable.dropped = [];
    callUserFunction(util.partial(data.movable.events.afterNewPiece, piece.role, dest, {
      predrop: false
    }));
  } else if (canPredrop(data, orig, dest)) {
    setPredrop(data, data.pieces[orig].role, dest);
  } else {
    unsetPremove(data);
    unsetPredrop(data);
  }
  delete data.pieces[orig];
  setSelected(data, null);
}

function selectSquare(data, key) {
  if (data.selected) {
    if (key) {
      if (data.selected === key && !data.draggable.enabled) {
        setSelected(data, null);
        hold.cancel();
      } else if (data.selectable.enabled && data.selected !== key) {
        if (userMove(data, data.selected, key)) data.stats.dragged = false;
      } else hold.start();
    } else {
      setSelected(data, null);
      hold.cancel();
    }
  } else if (isMovable(data, key) || isPremovable(data, key)) {
    setSelected(data, key);
    hold.start();
  }
  if (key) callUserFunction(util.partial(data.events.select, key));
}

function setSelected(data, key) {
  data.selected = key;
  if (key && isPremovable(data, key))
    data.premovable.dests = premove(data.pieces, key, data.premovable.castle);
  else
    data.premovable.dests = null;
}

function isMovable(data, orig) {
  var piece = data.pieces[orig];
  return piece && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color &&
      data.turnColor === piece.color
    ));
}

function canMove(data, orig, dest) {
  return orig !== dest && isMovable(data, orig) && (
    data.movable.free || util.containsX(data.movable.dests[orig], dest)
  );
}

function canDrop(data, orig, dest) {
  var piece = data.pieces[orig];
  return piece && dest && (orig === dest || !data.pieces[dest]) && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color &&
      data.turnColor === piece.color
    ));
}


function isPremovable(data, orig) {
  var piece = data.pieces[orig];
  return piece && data.premovable.enabled &&
    data.movable.color === piece.color &&
    data.turnColor !== piece.color;
}

function canPremove(data, orig, dest) {
  return orig !== dest &&
    isPremovable(data, orig) &&
    util.containsX(premove(data.pieces, orig, data.premovable.castle), dest);
}

function canPredrop(data, orig, dest) {
  var piece = data.pieces[orig];
  return piece && dest &&
    (!data.pieces[dest] || data.pieces[dest].color !== data.movable.color) &&
    data.predroppable.enabled &&
    (piece.role !== 'pawn' || (dest[1] !== '1' && dest[1] !== '8')) &&
    data.movable.color === piece.color &&
    data.turnColor !== piece.color;
}

function isDraggable(data, orig) {
  var piece = data.pieces[orig];
  return piece && data.draggable.enabled && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color && (
        data.turnColor === piece.color || data.premovable.enabled
      )
    )
  );
}

function playPremove(data) {
  var move = data.premovable.current;
  if (!move) return;
  var orig = move[0],
    dest = move[1],
    success = false;
  if (canMove(data, orig, dest)) {
    if (baseUserMove(data, orig, dest)) {
      callUserFunction(util.partial(data.movable.events.after, orig, dest, {
        premove: true
      }));
      success = true;
    }
  }
  unsetPremove(data);
  return success;
}

function playPredrop(data, validate) {
  var drop = data.predroppable.current,
    success = false;
  if (!drop.key) return;
  if (validate(drop)) {
    var piece = {
      role: drop.role,
      color: data.movable.color
    };
    if (baseNewPiece(data, piece, drop.key)) {
      callUserFunction(util.partial(data.movable.events.afterNewPiece, drop.role, drop.key, {
        predrop: true
      }));
      success = true;
    }
  }
  unsetPredrop(data);
  return success;
}

function cancelMove(data) {
  unsetPremove(data);
  unsetPredrop(data);
  selectSquare(data, null);
}

function stop(data) {
  data.movable.color = null;
  data.movable.dests = {};
  cancelMove(data);
}

function getKeyAtDomPos(data, pos, bounds) {
  if (!bounds && !data.bounds) return;
  bounds = bounds || data.bounds(); // use provided value, or compute it
  var file = Math.ceil(8 * ((pos[0] - bounds.left) / bounds.width));
  file = data.orientation === 'white' ? file : 9 - file;
  var rank = Math.ceil(8 - (8 * ((pos[1] - bounds.top) / bounds.height)));
  rank = data.orientation === 'white' ? rank : 9 - rank;
  if (file > 0 && file < 9 && rank > 0 && rank < 9) return util.pos2key([file, rank]);
}

// {white: {pawn: 3 queen: 1}, black: {bishop: 2}}
function getMaterialDiff(data) {
  var counts = {
    king: 0,
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    pawn: 0
  };
  for (var k in data.pieces) {
    var p = data.pieces[k];
    counts[p.role] += ((p.color === 'white') ? 1 : -1);
  }
  var diff = {
    white: {},
    black: {}
  };
  for (var role in counts) {
    var c = counts[role];
    if (c > 0) diff.white[role] = c;
    else if (c < 0) diff.black[role] = -c;
  }
  return diff;
}

var pieceScores = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

function getScore(data) {
  var score = 0;
  for (var k in data.pieces) {
    score += pieceScores[data.pieces[k].role] * (data.pieces[k].color === 'white' ? 1 : -1);
  }
  return score;
}

module.exports = {
  reset: reset,
  toggleOrientation: toggleOrientation,
  setPieces: setPieces,
  setCheck: setCheck,
  selectSquare: selectSquare,
  setSelected: setSelected,
  isDraggable: isDraggable,
  canMove: canMove,
  userMove: userMove,
  dropNewPiece: dropNewPiece,
  apiMove: apiMove,
  apiNewPiece: apiNewPiece,
  playPremove: playPremove,
  playPredrop: playPredrop,
  unsetPremove: unsetPremove,
  unsetPredrop: unsetPredrop,
  cancelMove: cancelMove,
  stop: stop,
  getKeyAtDomPos: getKeyAtDomPos,
  getMaterialDiff: getMaterialDiff,
  getScore: getScore
};

},{"./anim":16,"./hold":26,"./premove":28,"./util":30}],19:[function(require,module,exports){
var merge = require('merge');
var board = require('./board');
var fen = require('./fen');

module.exports = function(data, config) {

  if (!config) return;

  // don't merge destinations. Just override.
  if (config.movable && config.movable.dests) delete data.movable.dests;

  merge.recursive(data, config);

  // if a fen was provided, replace the pieces
  if (data.fen) {
    data.pieces = fen.read(data.fen);
    data.check = config.check;
    data.drawable.shapes = [];
    delete data.fen;
  }

  if (data.check === true) board.setCheck(data);

  // forget about the last dropped piece
  data.movable.dropped = [];

  // fix move/premove dests
  if (data.selected) board.setSelected(data, data.selected);

  // no need for such short animations
  if (!data.animation.duration || data.animation.duration < 40)
    data.animation.enabled = false;

  if (!data.movable.rookCastle) {
    var rank = data.movable.color === 'white' ? 1 : 8;
    var kingStartPos = 'e' + rank;
    if (data.movable.dests) {
      var dests = data.movable.dests[kingStartPos];
      if (!dests || data.pieces[kingStartPos].role !== 'king') return;
      data.movable.dests[kingStartPos] = dests.filter(function(d) {
        return d !== 'a' + rank && d !== 'h' + rank
      });
    }
  }
};

},{"./board":18,"./fen":25,"merge":32}],20:[function(require,module,exports){
var m = require('mithril');
var util = require('./util');

function renderCoords(elems, klass, orient) {
  var el = document.createElement('coords');
  el.className = klass;
  elems.forEach(function(content) {
    var f = document.createElement('coord');
    f.textContent = content;
    el.appendChild(f);
  });
  return el;
}

module.exports = function(orientation, el) {

  util.requestAnimationFrame(function() {
    var coords = document.createDocumentFragment();
    var orientClass = orientation === 'black' ? ' black' : '';
    coords.appendChild(renderCoords(util.ranks, 'ranks' + orientClass));
    coords.appendChild(renderCoords(util.files, 'files' + orientClass));
    el.appendChild(coords);
  });

  var orientation;

  return function(o) {
    if (o === orientation) return;
    orientation = o;
    var coords = el.querySelectorAll('coords');
    for (i = 0; i < coords.length; ++i)
      coords[i].classList.toggle('black', o === 'black');
  };
}

},{"./util":30,"mithril":15}],21:[function(require,module,exports){
var board = require('./board');
var data = require('./data');
var fen = require('./fen');
var configure = require('./configure');
var anim = require('./anim');
var drag = require('./drag');

module.exports = function(cfg) {

  this.data = data(cfg);

  this.vm = {
    exploding: false
  };

  this.getFen = function() {
    return fen.write(this.data.pieces);
  }.bind(this);

  this.getOrientation = function() {
    return this.data.orientation;
  }.bind(this);

  this.set = anim(configure, this.data);

  this.toggleOrientation = function() {
    anim(board.toggleOrientation, this.data)();
    if (this.data.redrawCoords) this.data.redrawCoords(this.data.orientation);
  }.bind(this);

  this.setPieces = anim(board.setPieces, this.data);

  this.selectSquare = anim(board.selectSquare, this.data, true);

  this.apiMove = anim(board.apiMove, this.data);

  this.apiNewPiece = anim(board.apiNewPiece, this.data);

  this.playPremove = anim(board.playPremove, this.data);

  this.playPredrop = anim(board.playPredrop, this.data);

  this.cancelPremove = anim(board.unsetPremove, this.data, true);

  this.cancelPredrop = anim(board.unsetPredrop, this.data, true);

  this.setCheck = anim(board.setCheck, this.data, true);

  this.cancelMove = anim(function(data) {
    board.cancelMove(data);
    drag.cancel(data);
  }.bind(this), this.data, true);

  this.stop = anim(function(data) {
    board.stop(data);
    drag.cancel(data);
  }.bind(this), this.data, true);

  this.explode = function(keys) {
    if (!this.data.render) return;
    this.vm.exploding = {
      stage: 1,
      keys: keys
    };
    this.data.renderRAF();
    setTimeout(function() {
      this.vm.exploding.stage = 2;
      this.data.renderRAF();
      setTimeout(function() {
        this.vm.exploding = false;
        this.data.renderRAF();
      }.bind(this), 120);
    }.bind(this), 120);
  }.bind(this);

  this.setAutoShapes = function(shapes) {
    anim(function(data) {
      data.drawable.autoShapes = shapes;
    }, this.data, false)();
  }.bind(this);

  this.setShapes = function(shapes) {
    anim(function(data) {
      data.drawable.shapes = shapes;
    }, this.data, false)();
  }.bind(this);
};

},{"./anim":16,"./board":18,"./configure":19,"./data":22,"./drag":23,"./fen":25}],22:[function(require,module,exports){
var fen = require('./fen');
var configure = require('./configure');

module.exports = function(cfg) {
  var defaults = {
    pieces: fen.read(fen.initial),
    orientation: 'white', // board orientation. white | black
    turnColor: 'white', // turn to play. white | black
    check: null, // square currently in check "a2" | null
    lastMove: null, // squares part of the last move ["c3", "c4"] | null
    selected: null, // square currently selected "a1" | null
    coordinates: true, // include coords attributes
    render: null, // function that rerenders the board
    renderRAF: null, // function that rerenders the board using requestAnimationFrame
    element: null, // DOM element of the board, required for drag piece centering
    bounds: null, // function that calculates the board bounds
    autoCastle: false, // immediately complete the castle by moving the rook after king move
    viewOnly: false, // don't bind events: the user will never be able to move pieces around
    disableContextMenu: false, // because who needs a context menu on a chessboard
    resizable: true, // listens to chessground.resize on document.body to clear bounds cache
    pieceKey: false, // add a data-key attribute to piece elements
    highlight: {
      lastMove: true, // add last-move class to squares
      check: true, // add check class to squares
      dragOver: true // add drag-over class to square when dragging over it
    },
    animation: {
      enabled: true,
      duration: 200,
      /*{ // current
       *  start: timestamp,
       *  duration: ms,
       *  anims: {
       *    a2: [
       *      [-30, 50], // animation goal
       *      [-20, 37]  // animation current status
       *    ], ...
       *  },
       *  fading: [
       *    {
       *      pos: [80, 120], // position relative to the board
       *      opacity: 0.34,
       *      role: 'rook',
       *      color: 'black'
       *    }
       *  }
       *}*/
      current: {}
    },
    movable: {
      free: true, // all moves are valid - board editor
      color: 'both', // color that can move. white | black | both | null
      dests: {}, // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]} | null
      dropOff: 'revert', // when a piece is dropped outside the board. "revert" | "trash"
      dropped: [], // last dropped [orig, dest], not to be animated
      showDests: true, // whether to add the move-dest class on squares
      events: {
        after: function(orig, dest, metadata) {}, // called after the move has been played
        afterNewPiece: function(role, pos) {} // called after a new piece is dropped on the board
      },
      rookCastle: true // castle by moving the king to the rook
    },
    premovable: {
      enabled: true, // allow premoves for color that can not move
      showDests: true, // whether to add the premove-dest class on squares
      castle: true, // whether to allow king castle premoves
      dests: [], // premove destinations for the current selection
      current: null, // keys of the current saved premove ["e2" "e4"] | null
      events: {
        set: function(orig, dest) {}, // called after the premove has been set
        unset: function() {} // called after the premove has been unset
      }
    },
    predroppable: {
      enabled: false, // allow predrops for color that can not move
      current: {}, // current saved predrop {role: 'knight', key: 'e4'} | {}
      events: {
        set: function(role, key) {}, // called after the predrop has been set
        unset: function() {} // called after the predrop has been unset
      }
    },
    draggable: {
      enabled: true, // allow moves & premoves to use drag'n drop
      distance: 3, // minimum distance to initiate a drag, in pixels
      autoDistance: true, // lets chessground set distance to zero when user drags pieces
      centerPiece: true, // center the piece on cursor at drag start
      showGhost: true, // show ghost of piece being dragged
      /*{ // current
       *  orig: "a2", // orig key of dragging piece
       *  rel: [100, 170] // x, y of the piece at original position
       *  pos: [20, -12] // relative current position
       *  dec: [4, -8] // piece center decay
       *  over: "b3" // square being moused over
       *  bounds: current cached board bounds
       *  started: whether the drag has started, as per the distance setting
       *}*/
      current: {}
    },
    selectable: {
      // disable to enforce dragging over click-click move
      enabled: true
    },
    stats: {
      // was last piece dragged or clicked?
      // needs default to false for touch
      dragged: !('ontouchstart' in window)
    },
    events: {
      change: function() {}, // called after the situation changes on the board
      // called after a piece has been moved.
      // capturedPiece is null or like {color: 'white', 'role': 'queen'}
      move: function(orig, dest, capturedPiece) {},
      dropNewPiece: function(role, pos) {},
      capture: function(key, piece) {}, // DEPRECATED called when a piece has been captured
      select: function(key) {} // called when a square is selected
    },
    items: null, // items on the board { render: key -> vdom }
    drawable: {
      enabled: false, // allows SVG drawings
      eraseOnClick: true,
      onChange: function(shapes) {},
      // user shapes
      shapes: [
        // {brush: 'green', orig: 'e8'},
        // {brush: 'yellow', orig: 'c4', dest: 'f7'}
      ],
      // computer shapes
      autoShapes: [
        // {brush: 'paleBlue', orig: 'e8'},
        // {brush: 'paleRed', orig: 'c4', dest: 'f7'}
      ],
      /*{ // current
       *  orig: "a2", // orig key of drawing
       *  pos: [20, -12] // relative current position
       *  dest: "b3" // square being moused over
       *  bounds: // current cached board bounds
       *  brush: 'green' // brush name for shape
       *}*/
      current: {},
      brushes: {
        green: {
          key: 'g',
          color: '#15781B',
          opacity: 1,
          lineWidth: 10
        },
        red: {
          key: 'r',
          color: '#882020',
          opacity: 1,
          lineWidth: 10
        },
        blue: {
          key: 'b',
          color: '#003088',
          opacity: 1,
          lineWidth: 10
        },
        yellow: {
          key: 'y',
          color: '#e68f00',
          opacity: 1,
          lineWidth: 10
        },
        paleBlue: {
          key: 'pb',
          color: '#003088',
          opacity: 0.4,
          lineWidth: 15
        },
        paleGreen: {
          key: 'pg',
          color: '#15781B',
          opacity: 0.4,
          lineWidth: 15
        },
        paleRed: {
          key: 'pr',
          color: '#882020',
          opacity: 0.4,
          lineWidth: 15
        },
        paleGrey: {
          key: 'pgr',
          color: '#4a4a4a',
          opacity: 0.35,
          lineWidth: 15
        }
      },
      // drawable SVG pieces, used for crazyhouse drop
      pieces: {
        baseUrl: 'https://lichess1.org/assets/piece/cburnett/'
      }
    }
  };

  configure(defaults, cfg || {});

  return defaults;
};

},{"./configure":19,"./fen":25}],23:[function(require,module,exports){
var board = require('./board');
var util = require('./util');
var draw = require('./draw');

var originTarget;

function hashPiece(piece) {
  return piece ? piece.color + piece.role : '';
}

function computeSquareBounds(data, bounds, key) {
  var pos = util.key2pos(key);
  if (data.orientation !== 'white') {
    pos[0] = 9 - pos[0];
    pos[1] = 9 - pos[1];
  }
  return {
    left: bounds.left + bounds.width * (pos[0] - 1) / 8,
    top: bounds.top + bounds.height * (8 - pos[1]) / 8,
    width: bounds.width / 8,
    height: bounds.height / 8
  };
}

function start(data, e) {
  if (e.button !== undefined && e.button !== 0) return; // only touch or left click
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  e.stopPropagation();
  e.preventDefault();
  originTarget = e.target;
  var previouslySelected = data.selected;
  var position = util.eventPosition(e);
  var bounds = data.bounds();
  var orig = board.getKeyAtDomPos(data, position, bounds);
  var piece = data.pieces[orig];
  if (!previouslySelected && (
    data.drawable.eraseOnClick ||
    (!piece || piece.color !== data.turnColor)
  )) draw.clear(data);
  if (data.viewOnly) return;
  var hadPremove = !!data.premovable.current;
  var hadPredrop = !!data.predroppable.current.key;
  board.selectSquare(data, orig);
  var stillSelected = data.selected === orig;
  if (piece && stillSelected && board.isDraggable(data, orig)) {
    var squareBounds = computeSquareBounds(data, bounds, orig);
    data.draggable.current = {
      previouslySelected: previouslySelected,
      orig: orig,
      piece: hashPiece(piece),
      rel: position,
      epos: position,
      pos: [0, 0],
      dec: data.draggable.centerPiece ? [
        position[0] - (squareBounds.left + squareBounds.width / 2),
        position[1] - (squareBounds.top + squareBounds.height / 2)
      ] : [0, 0],
      bounds: bounds,
      started: data.draggable.autoDistance && data.stats.dragged
    };
  } else {
    if (hadPremove) board.unsetPremove(data);
    if (hadPredrop) board.unsetPredrop(data);
  }
  processDrag(data);
}

function processDrag(data) {
  util.requestAnimationFrame(function() {
    var cur = data.draggable.current;
    if (cur.orig) {
      // cancel animations while dragging
      if (data.animation.current.start && data.animation.current.anims[cur.orig])
        data.animation.current = {};
      // if moving piece is gone, cancel
      if (hashPiece(data.pieces[cur.orig]) !== cur.piece) cancel(data);
      else {
        if (!cur.started && util.distance(cur.epos, cur.rel) >= data.draggable.distance)
          cur.started = true;
        if (cur.started) {
          cur.pos = [
            cur.epos[0] - cur.rel[0],
            cur.epos[1] - cur.rel[1]
          ];
          cur.over = board.getKeyAtDomPos(data, cur.epos, cur.bounds);
        }
      }
    }
    data.render();
    if (cur.orig) processDrag(data);
  });
}

function move(data, e) {
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  if (data.draggable.current.orig)
    data.draggable.current.epos = util.eventPosition(e);
}

function end(data, e) {
  var cur = data.draggable.current;
  var orig = cur ? cur.orig : null;
  if (!orig) return;
  // comparing with the origin target is an easy way to test that the end event
  // has the same touch origin
  if (e.type === "touchend" && originTarget !== e.target && !cur.newPiece) {
    data.draggable.current = {};
    return;
  }
  board.unsetPremove(data);
  board.unsetPredrop(data);
  var eventPos = util.eventPosition(e)
  var dest = eventPos ? board.getKeyAtDomPos(data, eventPos, cur.bounds) : cur.over;
  if (cur.started) {
    if (cur.newPiece) board.dropNewPiece(data, orig, dest);
    else {
      if (orig !== dest) data.movable.dropped = [orig, dest];
      if (board.userMove(data, orig, dest)) data.stats.dragged = true;
    }
  }
  if (orig === cur.previouslySelected && (orig === dest || !dest))
    board.setSelected(data, null);
  else if (!data.selectable.enabled) board.setSelected(data, null);
  data.draggable.current = {};
}

function cancel(data) {
  if (data.draggable.current.orig) {
    data.draggable.current = {};
    board.selectSquare(data, null);
  }
}

module.exports = {
  start: start,
  move: move,
  end: end,
  cancel: cancel,
  processDrag: processDrag // must be exposed for board editors
};

},{"./board":18,"./draw":24,"./util":30}],24:[function(require,module,exports){
var board = require('./board');
var util = require('./util');

var brushes = ['green', 'red', 'blue', 'yellow'];

function hashPiece(piece) {
  return piece ? piece.color + ' ' + piece.role : '';
}

function start(data, e) {
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  e.stopPropagation();
  e.preventDefault();
  board.cancelMove(data);
  var position = util.eventPosition(e);
  var bounds = data.bounds();
  var orig = board.getKeyAtDomPos(data, position, bounds);
  data.drawable.current = {
    orig: orig,
    epos: position,
    bounds: bounds,
    brush: brushes[(e.shiftKey & util.isRightButton(e)) + (e.altKey ? 2 : 0)]
  };
  processDraw(data);
}

function processDraw(data) {
  util.requestAnimationFrame(function() {
    var cur = data.drawable.current;
    if (cur.orig) {
      var dest = board.getKeyAtDomPos(data, cur.epos, cur.bounds);
      if (cur.orig === dest) cur.dest = undefined;
      else cur.dest = dest;
    }
    data.render();
    if (cur.orig) processDraw(data);
  });
}

function move(data, e) {
  if (data.drawable.current.orig)
    data.drawable.current.epos = util.eventPosition(e);
}

function end(data, e) {
  var drawable = data.drawable;
  var orig = drawable.current.orig;
  var dest = drawable.current.dest;
  if (orig && dest) addLine(drawable, orig, dest);
  else if (orig) addCircle(drawable, orig);
  drawable.current = {};
  data.render();
}

function cancel(data) {
  if (data.drawable.current.orig) data.drawable.current = {};
}

function clear(data) {
  if (data.drawable.shapes.length) {
    data.drawable.shapes = [];
    data.render();
    onChange(data.drawable);
  }
}

function not(f) {
  return function(x) {
    return !f(x);
  };
}

function addCircle(drawable, key) {
  var brush = drawable.current.brush;
  var sameCircle = function(s) {
    return s.orig === key && !s.dest;
  };
  var similar = drawable.shapes.filter(sameCircle)[0];
  if (similar) drawable.shapes = drawable.shapes.filter(not(sameCircle));
  if (!similar || similar.brush !== brush) drawable.shapes.push({
    brush: brush,
    orig: key
  });
  onChange(drawable);
}

function addLine(drawable, orig, dest) {
  var brush = drawable.current.brush;
  var sameLine = function(s) {
    return s.orig && s.dest && (
      (s.orig === orig && s.dest === dest) ||
      (s.dest === orig && s.orig === dest)
    );
  };
  var exists = drawable.shapes.filter(sameLine).length > 0;
  if (exists) drawable.shapes = drawable.shapes.filter(not(sameLine));
  else drawable.shapes.push({
    brush: brush,
    orig: orig,
    dest: dest
  });
  onChange(drawable);
}

function onChange(drawable) {
  drawable.onChange(drawable.shapes);
}

module.exports = {
  start: start,
  move: move,
  end: end,
  cancel: cancel,
  clear: clear,
  processDraw: processDraw
};

},{"./board":18,"./util":30}],25:[function(require,module,exports){
var util = require('./util');

var initial = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

var roles = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king"
};

var letters = {
  pawn: "p",
  rook: "r",
  knight: "n",
  bishop: "b",
  queen: "q",
  king: "k"
};

function read(fen) {
  if (fen === 'start') fen = initial;
  var pieces = {};
  fen.replace(/ .+$/, '').replace(/~/g, '').split('/').forEach(function(row, y) {
    var x = 0;
    row.split('').forEach(function(v) {
      var nb = parseInt(v);
      if (nb) x += nb;
      else {
        x++;
        pieces[util.pos2key([x, 8 - y])] = {
          role: roles[v.toLowerCase()],
          color: v === v.toLowerCase() ? 'black' : 'white'
        };
      }
    });
  });

  return pieces;
}

function write(pieces) {
  return [8, 7, 6, 5, 4, 3, 2].reduce(
    function(str, nb) {
      return str.replace(new RegExp(Array(nb + 1).join('1'), 'g'), nb);
    },
    util.invRanks.map(function(y) {
      return util.ranks.map(function(x) {
        var piece = pieces[util.pos2key([x, y])];
        if (piece) {
          var letter = letters[piece.role];
          return piece.color === 'white' ? letter.toUpperCase() : letter;
        } else return '1';
      }).join('');
    }).join('/'));
}

module.exports = {
  initial: initial,
  read: read,
  write: write
};

},{"./util":30}],26:[function(require,module,exports){
var startAt;

var start = function() {
  startAt = new Date();
};

var cancel = function() {
  startAt = null;
};

var stop = function() {
  if (!startAt) return 0;
  var time = new Date() - startAt;
  startAt = null;
  return time;
};

module.exports = {
  start: start,
  cancel: cancel,
  stop: stop
};

},{}],27:[function(require,module,exports){
var m = require('mithril');
var ctrl = require('./ctrl');
var view = require('./view');
var api = require('./api');

// for usage outside of mithril
function init(element, config) {

  var controller = new ctrl(config);

  m.render(element, view(controller));

  return api(controller);
}

module.exports = init;
module.exports.controller = ctrl;
module.exports.view = view;
module.exports.fen = require('./fen');
module.exports.util = require('./util');
module.exports.configure = require('./configure');
module.exports.anim = require('./anim');
module.exports.board = require('./board');
module.exports.drag = require('./drag');

},{"./anim":16,"./api":17,"./board":18,"./configure":19,"./ctrl":21,"./drag":23,"./fen":25,"./util":30,"./view":31,"mithril":15}],28:[function(require,module,exports){
var util = require('./util');

function diff(a, b) {
  return Math.abs(a - b);
}

function pawn(color, x1, y1, x2, y2) {
  return diff(x1, x2) < 2 && (
    color === 'white' ? (
      // allow 2 squares from 1 and 8, for horde
      y2 === y1 + 1 || (y1 <= 2 && y2 === (y1 + 2) && x1 === x2)
    ) : (
      y2 === y1 - 1 || (y1 >= 7 && y2 === (y1 - 2) && x1 === x2)
    )
  );
}

function knight(x1, y1, x2, y2) {
  var xd = diff(x1, x2);
  var yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
}

function bishop(x1, y1, x2, y2) {
  return diff(x1, x2) === diff(y1, y2);
}

function rook(x1, y1, x2, y2) {
  return x1 === x2 || y1 === y2;
}

function queen(x1, y1, x2, y2) {
  return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
}

function king(color, rookFiles, canCastle, x1, y1, x2, y2) {
  return (
    diff(x1, x2) < 2 && diff(y1, y2) < 2
  ) || (
    canCastle && y1 === y2 && y1 === (color === 'white' ? 1 : 8) && (
      (x1 === 5 && (x2 === 3 || x2 === 7)) || util.containsX(rookFiles, x2)
    )
  );
}

function rookFilesOf(pieces, color) {
  return Object.keys(pieces).filter(function(key) {
    var piece = pieces[key];
    return piece && piece.color === color && piece.role === 'rook';
  }).map(function(key) {
    return util.key2pos(key)[0];
  });
}

function compute(pieces, key, canCastle) {
  var piece = pieces[key];
  var pos = util.key2pos(key);
  var mobility;
  switch (piece.role) {
    case 'pawn':
      mobility = pawn.bind(null, piece.color);
      break;
    case 'knight':
      mobility = knight;
      break;
    case 'bishop':
      mobility = bishop;
      break;
    case 'rook':
      mobility = rook;
      break;
    case 'queen':
      mobility = queen;
      break;
    case 'king':
      mobility = king.bind(null, piece.color, rookFilesOf(pieces, piece.color), canCastle);
      break;
  }
  return util.allPos.filter(function(pos2) {
    return (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]);
  }).map(util.pos2key);
}

module.exports = compute;

},{"./util":30}],29:[function(require,module,exports){
var m = require('mithril');
var key2pos = require('./util').key2pos;
var isTrident = require('./util').isTrident;

function circleWidth(current, bounds) {
  return (current ? 3 : 4) / 512 * bounds.width;
}

function lineWidth(brush, current, bounds) {
  return (brush.lineWidth || 10) * (current ? 0.85 : 1) / 512 * bounds.width;
}

function opacity(brush, current) {
  return (brush.opacity || 1) * (current ? 0.9 : 1);
}

function arrowMargin(current, bounds) {
  return isTrident() ? 0 : ((current ? 10 : 20) / 512 * bounds.width);
}

function pos2px(pos, bounds) {
  var squareSize = bounds.width / 8;
  return [(pos[0] - 0.5) * squareSize, (8.5 - pos[1]) * squareSize];
}

function circle(brush, pos, current, bounds) {
  var o = pos2px(pos, bounds);
  var width = circleWidth(current, bounds);
  var radius = bounds.width / 16;
  return {
    tag: 'circle',
    attrs: {
      key: current ? 'current' : pos + brush.key,
      stroke: brush.color,
      'stroke-width': width,
      fill: 'none',
      opacity: opacity(brush, current),
      cx: o[0],
      cy: o[1],
      r: radius - width / 2
    }
  };
}

function arrow(brush, orig, dest, current, bounds) {
  var m = arrowMargin(current, bounds);
  var a = pos2px(orig, bounds);
  var b = pos2px(dest, bounds);
  var dx = b[0] - a[0],
    dy = b[1] - a[1],
    angle = Math.atan2(dy, dx);
  var xo = Math.cos(angle) * m,
    yo = Math.sin(angle) * m;
  return {
    tag: 'line',
    attrs: {
      key: current ? 'current' : orig + dest + brush.key,
      stroke: brush.color,
      'stroke-width': lineWidth(brush, current, bounds),
      'stroke-linecap': 'round',
      'marker-end': isTrident() ? null : 'url(#arrowhead-' + brush.key + ')',
      opacity: opacity(brush, current),
      x1: a[0],
      y1: a[1],
      x2: b[0] - xo,
      y2: b[1] - yo
    }
  };
}

function piece(cfg, pos, piece, bounds) {
  var o = pos2px(pos, bounds);
  var size = bounds.width / 8 * (piece.scale || 1);
  var name = piece.color === 'white' ? 'w' : 'b';
  name += (piece.role === 'knight' ? 'n' : piece.role[0]).toUpperCase();
  var href = cfg.baseUrl + name + '.svg';
  return {
    tag: 'image',
    attrs: {
      class: piece.color + ' ' + piece.role,
      x: o[0] - size / 2,
      y: o[1] - size / 2,
      width: size,
      height: size,
      href: href
    }
  };
}

function defs(brushes) {
  return {
    tag: 'defs',
    children: [
      brushes.map(function(brush) {
        return {
          key: brush.key,
          tag: 'marker',
          attrs: {
            id: 'arrowhead-' + brush.key,
            orient: 'auto',
            markerWidth: 4,
            markerHeight: 8,
            refX: 2.05,
            refY: 2.01
          },
          children: [{
            tag: 'path',
            attrs: {
              d: 'M0,0 V4 L3,2 Z',
              fill: brush.color
            }
          }]
        }
      })
    ]
  };
}

function orient(pos, color) {
  return color === 'white' ? pos : [9 - pos[0], 9 - pos[1]];
}

function renderShape(data, current, bounds) {
  return function(shape, i) {
    if (shape.piece) return piece(
      data.drawable.pieces,
      orient(key2pos(shape.orig), data.orientation),
      shape.piece,
      bounds);
    else if (shape.brush) {
      var brush = shape.brushModifiers ?
        makeCustomBrush(data.drawable.brushes[shape.brush], shape.brushModifiers, i) :
        data.drawable.brushes[shape.brush];
      var orig = orient(key2pos(shape.orig), data.orientation);
      if (shape.orig && shape.dest) return arrow(
        brush,
        orig,
        orient(key2pos(shape.dest), data.orientation),
        current, bounds);
      else if (shape.orig) return circle(
        brush,
        orig,
        current, bounds);
    }
  };
}

function makeCustomBrush(base, modifiers, i) {
  return {
    key: 'bm' + i,
    color: modifiers.color || base.color,
    opacity: modifiers.opacity || base.opacity,
    lineWidth: modifiers.lineWidth || base.lineWidth
  };
}

function computeUsedBrushes(d, drawn, current) {
  var brushes = [];
  var keys = [];
  var shapes = (current && current.dest) ? drawn.concat(current) : drawn;
  for (var i in shapes) {
    var shape = shapes[i];
    if (!shape.dest) continue;
    var brushKey = shape.brush;
    if (shape.brushModifiers)
      brushes.push(makeCustomBrush(d.brushes[brushKey], shape.brushModifiers, i));
    else {
      if (keys.indexOf(brushKey) === -1) {
        brushes.push(d.brushes[brushKey]);
        keys.push(brushKey);
      }
    }
  }
  return brushes;
}

module.exports = function(ctrl) {
  if (!ctrl.data.bounds) return;
  var d = ctrl.data.drawable;
  var allShapes = d.shapes.concat(d.autoShapes);
  if (!allShapes.length && !d.current.orig) return;
  var bounds = ctrl.data.bounds();
  if (bounds.width !== bounds.height) return;
  var usedBrushes = computeUsedBrushes(d, allShapes, d.current);
  return {
    tag: 'svg',
    attrs: {
      key: 'svg'
    },
    children: [
      defs(usedBrushes),
      allShapes.map(renderShape(ctrl.data, false, bounds)),
      renderShape(ctrl.data, true, bounds)(d.current, 9999)
    ]
  };
}

},{"./util":30,"mithril":15}],30:[function(require,module,exports){
var files = "abcdefgh".split('');
var ranks = [1, 2, 3, 4, 5, 6, 7, 8];
var invRanks = [8, 7, 6, 5, 4, 3, 2, 1];
var fileNumbers = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8
};

function pos2key(pos) {
  return files[pos[0] - 1] + pos[1];
}

function key2pos(pos) {
  return [fileNumbers[pos[0]], parseInt(pos[1])];
}

function invertKey(key) {
  return files[8 - fileNumbers[key[0]]] + (9 - parseInt(key[1]));
}

var allPos = (function() {
  var ps = [];
  invRanks.forEach(function(y) {
    ranks.forEach(function(x) {
      ps.push([x, y]);
    });
  });
  return ps;
})();
var allKeys = allPos.map(pos2key);
var invKeys = allKeys.slice(0).reverse();

function classSet(classes) {
  var arr = [];
  for (var i in classes) {
    if (classes[i]) arr.push(i);
  }
  return arr.join(' ');
}

function opposite(color) {
  return color === 'white' ? 'black' : 'white';
}

function containsX(xs, x) {
  return xs && xs.indexOf(x) !== -1;
}

function distance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
}

// this must be cached because of the access to document.body.style
var cachedTransformProp;

function computeTransformProp() {
  return 'transform' in document.body.style ?
    'transform' : 'webkitTransform' in document.body.style ?
    'webkitTransform' : 'mozTransform' in document.body.style ?
    'mozTransform' : 'oTransform' in document.body.style ?
    'oTransform' : 'msTransform';
}

function transformProp() {
  if (!cachedTransformProp) cachedTransformProp = computeTransformProp();
  return cachedTransformProp;
}

var cachedIsTrident = null;

function isTrident() {
  if (cachedIsTrident === null)
    cachedIsTrident = window.navigator.userAgent.indexOf('Trident/') > -1;
  return cachedIsTrident;
}

function translate(pos) {
  return 'translate(' + pos[0] + 'px,' + pos[1] + 'px)';
}

function eventPosition(e) {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
  if (e.touches && e.targetTouches[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
}

function partialApply(fn, args) {
  return fn.bind.apply(fn, [null].concat(args));
}

function partial() {
  return partialApply(arguments[0], Array.prototype.slice.call(arguments, 1));
}

function isRightButton(e) {
  return e.buttons === 2 || e.button === 2;
}

function memo(f) {
  var v, ret = function() {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = function() {
    v = undefined;
  }
  return ret;
}

module.exports = {
  files: files,
  ranks: ranks,
  invRanks: invRanks,
  allPos: allPos,
  allKeys: allKeys,
  invKeys: invKeys,
  pos2key: pos2key,
  key2pos: key2pos,
  invertKey: invertKey,
  classSet: classSet,
  opposite: opposite,
  translate: translate,
  containsX: containsX,
  distance: distance,
  eventPosition: eventPosition,
  partialApply: partialApply,
  partial: partial,
  transformProp: transformProp,
  isTrident: isTrident,
  requestAnimationFrame: (window.requestAnimationFrame || window.setTimeout).bind(window),
  isRightButton: isRightButton,
  memo: memo
};

},{}],31:[function(require,module,exports){
var drag = require('./drag');
var draw = require('./draw');
var util = require('./util');
var svg = require('./svg');
var makeCoords = require('./coords');
var m = require('mithril');

var pieceTag = 'piece';
var squareTag = 'square';

function pieceClass(p) {
  return p.role + ' ' + p.color;
}

function renderPiece(d, key, ctx) {
  var attrs = {
    key: 'p' + key,
    style: {},
    class: pieceClass(d.pieces[key])
  };
  var translate = posToTranslate(util.key2pos(key), ctx);
  var draggable = d.draggable.current;
  if (draggable.orig === key && draggable.started) {
    translate[0] += draggable.pos[0] + draggable.dec[0];
    translate[1] += draggable.pos[1] + draggable.dec[1];
    attrs.class += ' dragging';
  } else if (d.animation.current.anims) {
    var animation = d.animation.current.anims[key];
    if (animation) {
      translate[0] += animation[1][0];
      translate[1] += animation[1][1];
    }
  }
  attrs.style[ctx.transformProp] = util.translate(translate);
  if (d.pieceKey) attrs['data-key'] = key;
  return {
    tag: pieceTag,
    attrs: attrs
  };
}

function renderSquare(key, classes, ctx) {
  var attrs = {
    key: 's' + key,
    class: classes,
    style: {}
  };
  attrs.style[ctx.transformProp] = util.translate(posToTranslate(util.key2pos(key), ctx));
  return {
    tag: squareTag,
    attrs: attrs
  };
}

function posToTranslate(pos, ctx) {
  return [
    (ctx.asWhite ? pos[0] - 1 : 8 - pos[0]) * ctx.bounds.width / 8, (ctx.asWhite ? 8 - pos[1] : pos[1] - 1) * ctx.bounds.height / 8
  ];
}

function renderGhost(key, piece, ctx) {
  if (!piece) return;
  var attrs = {
    key: 'g' + key,
    style: {},
    class: pieceClass(piece) + ' ghost'
  };
  attrs.style[ctx.transformProp] = util.translate(posToTranslate(util.key2pos(key), ctx));
  return {
    tag: pieceTag,
    attrs: attrs
  };
}

function renderFading(cfg, ctx) {
  var attrs = {
    key: 'f' + cfg.piece.key,
    class: 'fading ' + pieceClass(cfg.piece),
    style: {
      opacity: cfg.opacity
    }
  };
  attrs.style[ctx.transformProp] = util.translate(posToTranslate(cfg.piece.pos, ctx));
  return {
    tag: pieceTag,
    attrs: attrs
  };
}

function addSquare(squares, key, klass) {
  if (squares[key]) squares[key].push(klass);
  else squares[key] = [klass];
}

function renderSquares(ctrl, ctx) {
  var d = ctrl.data;
  var squares = {};
  if (d.lastMove && d.highlight.lastMove) d.lastMove.forEach(function(k) {
    addSquare(squares, k, 'last-move');
  });
  if (d.check && d.highlight.check) addSquare(squares, d.check, 'check');
  if (d.selected) {
    addSquare(squares, d.selected, 'selected');
    var over = d.draggable.current.over;
    var dests = d.movable.dests[d.selected];
    if (dests) dests.forEach(function(k) {
      if (k === over) addSquare(squares, k, 'move-dest drag-over');
      else if (d.movable.showDests) addSquare(squares, k, 'move-dest' + (d.pieces[k] ? ' oc' : ''));
    });
    var pDests = d.premovable.dests;
    if (pDests) pDests.forEach(function(k) {
      if (k === over) addSquare(squares, k, 'premove-dest drag-over');
      else if (d.movable.showDests) addSquare(squares, k, 'premove-dest' + (d.pieces[k] ? ' oc' : ''));
    });
  }
  var premove = d.premovable.current;
  if (premove) premove.forEach(function(k) {
    addSquare(squares, k, 'current-premove');
  });
  else if (d.predroppable.current.key)
    addSquare(squares, d.predroppable.current.key, 'current-premove');

  if (ctrl.vm.exploding) ctrl.vm.exploding.keys.forEach(function(k) {
    addSquare(squares, k, 'exploding' + ctrl.vm.exploding.stage);
  });

  var dom = [];
  if (d.items) {
    for (var i = 0; i < 64; i++) {
      var key = util.allKeys[i];
      var square = squares[key];
      var item = d.items.render(util.key2pos(key), key);
      if (square || item) {
        var sq = renderSquare(key, square ? square.join(' ') + (item ? ' has-item' : '') : 'has-item', ctx);
        if (item) sq.children = [item];
        dom.push(sq);
      }
    }
  } else {
    for (var key in squares)
      dom.push(renderSquare(key, squares[key].join(' '), ctx));
  }
  return dom;
}

function renderContent(ctrl) {
  var d = ctrl.data;
  if (!d.bounds) return;
  var ctx = {
    asWhite: d.orientation === 'white',
    bounds: d.bounds(),
    transformProp: util.transformProp()
  };
  var children = renderSquares(ctrl, ctx);
  if (d.animation.current.fadings)
    d.animation.current.fadings.forEach(function(p) {
      children.push(renderFading(p, ctx));
    });

  // must insert pieces in the right order
  // for 3D to display correctly
  var keys = ctx.asWhite ? util.allKeys : util.invKeys;
  if (d.items)
    for (var i = 0; i < 64; i++) {
      if (d.pieces[keys[i]] && !d.items.render(util.key2pos(keys[i]), keys[i]))
        children.push(renderPiece(d, keys[i], ctx));
    } else
      for (var i = 0; i < 64; i++) {
        if (d.pieces[keys[i]]) children.push(renderPiece(d, keys[i], ctx));
      }

  if (d.draggable.showGhost) {
    var dragOrig = d.draggable.current.orig;
    if (dragOrig && !d.draggable.current.newPiece)
      children.push(renderGhost(dragOrig, d.pieces[dragOrig], ctx));
  }
  if (d.drawable.enabled) children.push(svg(ctrl));
  return children;
}

function startDragOrDraw(d) {
  return function(e) {
    if (util.isRightButton(e) && d.draggable.current.orig) {
      if (d.draggable.current.newPiece) delete d.pieces[d.draggable.current.orig];
      d.draggable.current = {}
      d.selected = null;
    } else if ((e.shiftKey || util.isRightButton(e)) && d.drawable.enabled) draw.start(d, e);
    else drag.start(d, e);
  };
}

function dragOrDraw(d, withDrag, withDraw) {
  return function(e) {
    if ((e.shiftKey || util.isRightButton(e)) && d.drawable.enabled) withDraw(d, e);
    else if (!d.viewOnly) withDrag(d, e);
  };
}

function bindEvents(ctrl, el, context) {
  var d = ctrl.data;
  var onstart = startDragOrDraw(d);
  var onmove = dragOrDraw(d, drag.move, draw.move);
  var onend = dragOrDraw(d, drag.end, draw.end);
  var startEvents = ['touchstart', 'mousedown'];
  var moveEvents = ['touchmove', 'mousemove'];
  var endEvents = ['touchend', 'mouseup'];
  startEvents.forEach(function(ev) {
    el.addEventListener(ev, onstart);
  });
  moveEvents.forEach(function(ev) {
    document.addEventListener(ev, onmove);
  });
  endEvents.forEach(function(ev) {
    document.addEventListener(ev, onend);
  });
  context.onunload = function() {
    startEvents.forEach(function(ev) {
      el.removeEventListener(ev, onstart);
    });
    moveEvents.forEach(function(ev) {
      document.removeEventListener(ev, onmove);
    });
    endEvents.forEach(function(ev) {
      document.removeEventListener(ev, onend);
    });
  };
}

function renderBoard(ctrl) {
  var d = ctrl.data;
  return {
    tag: 'div',
    attrs: {
      class: 'cg-board orientation-' + d.orientation,
      config: function(el, isUpdate, context) {
        if (isUpdate) return;
        if (!d.viewOnly || d.drawable.enabled)
          bindEvents(ctrl, el, context);
        // this function only repaints the board itself.
        // it's called when dragging or animating pieces,
        // to prevent the full application embedding chessground
        // rendering on every animation frame
        d.render = function() {
          m.render(el, renderContent(ctrl));
        };
        d.renderRAF = function() {
          util.requestAnimationFrame(d.render);
        };
        d.bounds = util.memo(el.getBoundingClientRect.bind(el));
        d.element = el;
        d.render();
      }
    },
    children: []
  };
}

module.exports = function(ctrl) {
  var d = ctrl.data;
  return {
    tag: 'div',
    attrs: {
      config: function(el, isUpdate) {
        if (isUpdate) {
          if (d.redrawCoords) d.redrawCoords(d.orientation);
          return;
        }
        if (d.coordinates) d.redrawCoords = makeCoords(d.orientation, el);
        el.addEventListener('contextmenu', function(e) {
          if (d.disableContextMenu || d.drawable.enabled) {
            e.preventDefault();
            return false;
          }
        });
        if (d.resizable)
          document.body.addEventListener('chessground.resize', function(e) {
            d.bounds.clear();
            d.render();
          }, false);
        ['onscroll', 'onresize'].forEach(function(n) {
          var prev = window[n];
          window[n] = function() {
            prev && prev();
            d.bounds.clear();
          };
        });
      },
      class: [
        'cg-board-wrap',
        d.viewOnly ? 'view-only' : 'manipulable'
      ].join(' ')
    },
    children: [renderBoard(ctrl)]
  };
};

},{"./coords":20,"./drag":23,"./draw":24,"./svg":29,"./util":30,"mithril":15}],32:[function(require,module,exports){
/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
},{}],33:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],34:[function(require,module,exports){
var m = require('mithril');
var groundBuild = require('./ground');
var generate = require('../../explorer/src/calc/generate');
var diagram = require('../../explorer/src/calc/diagram');
var fendata = require('../../explorer/src/calc/fendata');
var queryparam = require('../../explorer/src/util/queryparam');

module.exports = function(opts, i18n) {

  var fen = m.prop(opts.fen);
  var selection = m.prop("Knight forks");
  var features = m.prop(generate.extractSingleFeature(selection(),fen()));
  var ground;
  var score = m.prop(0);
  var bonus = m.prop("");
  var time = m.prop(60.0);
  var correct = m.prop([]);
  var incorrect = m.prop([]);
  
  function showGround() {
    if (!ground) ground = groundBuild(fen(), onSquareSelect);
  }
  
  function newGame() {
    score(0);
    bonus("");
    time(60);
    correct([]);
    incorrect([]);
  }



  function onSquareSelect(target) {
    if (correct().includes(target) || incorrect().includes(target)) {
      target = '';    
    }
    else
    if (generate.featureFound(features(), target)) {
      correct().push(target);
      score(score() + 1);
    }
    else {
      incorrect().push(target);
      score(score() - 1);
    }

    ground.set({
      fen: fen(),
    });
    var clickedDiagram = diagram.clickedSquares(features(), correct(), incorrect(), target);
    ground.setShapes(clickedDiagram);
    m.redraw();
  }

  function onFilterSelect(side, description, target) {
    diagram.clearDiagrams(features());
    ground.setShapes([]);
    ground.set({
      fen: fen(),
    });
    queryparam.updateUrlWithState(fen(), side, description, target);
  }

  function showAll() {
    ground.setShapes(diagram.allDiagrams(features()));
  }

  function updateFen(value) {
    fen(value);
    ground.set({
      fen: fen(),
    });
    ground.setShapes([]);
    features(generate.extractFeatures(fen()));
  }

  function nextFen(dest) {
    updateFen(fendata[Math.floor(Math.random() * fendata.length)]);
  }

  showGround();
  m.redraw();

  return {
    fen: fen,
    ground: ground,
    features: features,
    updateFen: updateFen,
    onFilterSelect: onFilterSelect,
    onSquareSelect: onSquareSelect,
    nextFen: nextFen,
    showAll: showAll,
    score: score,
    bonus: bonus,
    time: time,
    selection: selection
  };
};

},{"../../explorer/src/calc/diagram":4,"../../explorer/src/calc/fendata":5,"../../explorer/src/calc/generate":7,"../../explorer/src/util/queryparam":12,"./ground":35,"mithril":33}],35:[function(require,module,exports){
var chessground = require('chessground');

module.exports = function(fen, onSelect) {
  return new chessground.controller({
    fen: fen,
    viewOnly: false,
    turnColor: 'white',
    animation: {
      duration: 200
    },
    highlight: {
      lastMove: false
    },
    movable: {
      free: false,
      color: 'white',
      premove: true,
      dests: [],
      showDests: false,
      events: {
        after: function() {}
      }
    },
    drawable: {
      enabled: true
    },
    events: {
      move: function(orig, dest, capturedPiece) {
        onSelect(dest);
      },
      select: function(key) {
        onSelect(key);
      }
    }
  });
};

},{"chessground":27}],36:[function(require,module,exports){
var m = require('mithril');
var ctrl = require('./ctrl');
var view = require('./view/main');

function main(opts) {
    var controller = new ctrl(opts);
    m.mount(opts.element, {
        controller: function() {
            return controller;
        },
        view: view
    });
}


main({
    element: document.getElementById("wrapper"),
    fen: "r3r1k1/pp3ppp/1qn1bn2/1Bb5/8/2N2N2/PPP1QPPP/R1B2RK1 w - - 11 12"
});

},{"./ctrl":34,"./view/main":40,"mithril":33}],37:[function(require,module,exports){
var m = require('mithril');
var stopevent = require('../../../explorer/src/util/stopevent');

function makeStars(controller, feature) {
    return feature.targets.map(t => m('span.star', {
        title: t.target,
        onclick: function(event) {
            controller.onFilterSelect(feature.side, feature.description, t.target);
            return stopevent(event);
        }
    }, t.selected ? m('span.star.selected', '★') : m('span.star', '☆')));
}

module.exports = function(controller, feature) {
    if (feature.targets.length === 0) {
        return [];
    }
    return m('li.feature.button', {
        onclick: function(event) {
            controller.onFilterSelect(feature.side, feature.description);
            return stopevent(event);
        }
    }, [
        m('div.name', feature.description),
        m('div.stars', makeStars(controller, feature))
    ]);
};

},{"../../../explorer/src/util/stopevent":13,"mithril":33}],38:[function(require,module,exports){
var m = require('mithril');
var feature = require('./feature');
var stopevent = require('../../../explorer/src/util/stopevent');

module.exports = function(controller) {
  return m('div.featuresall', [
    m('div.features.both.button', {
      onclick: function() {
        controller.showAll();
      }
    }, [
      m('p', 'All'),
      m('div.features.black.button', {
        onclick: function(event) {
          controller.onFilterSelect('b', null, null);
          return stopevent(event);
        }
      }, [
        m('p', 'Black'),
        m('ul.features.black', controller.features().filter(f => f.side === 'b').map(f => feature(controller, f)))
      ]),
      m('div.features.white.button', {
        onclick: function(event) {
          controller.onFilterSelect('w', null, null);
          return stopevent(event);
        }
      }, [
        m('p', 'White'),
        m('ul.features.white', controller.features().filter(f => f.side === 'w').map(f => feature(controller, f)))
      ])
    ])
  ]);
};

},{"../../../explorer/src/util/stopevent":13,"./feature":37,"mithril":33}],39:[function(require,module,exports){
var m = require('mithril');

module.exports = function(controller) {
  return [
    m('input.copyable.autoselect.feninput', {
      spellcheck: false,
      value: controller.fen(),
      oninput: m.withAttr('value', controller.updateFen),
      onclick: function() {
        this.select();
      }
    })
  ];
};

},{"mithril":33}],40:[function(require,module,exports){
var m = require('mithril');
var chessground = require('chessground');
var fenbar = require('./fenbar');
var features = require('./features');
var selection = require('./selection');
var score = require('./score');
var timer = require('./timer');

function visualBoard(ctrl) {
  return m('div.lichess_board', m('div.lichess_board_wrap', m('div.lichess_board', [
    chessground.view(ctrl.ground)
  ])));
}

function info(ctrl) {
  return [m('div.explanation', [
    m('p', 'Increase your tactical awareness by spotting all features in a category as fast as you can (regardless of quality of move)'),
    m('br'),
    m('br'),
    m('ul.instructions', [
      m('li.instructions', 'Select your category to begin.'),
      m('li.instructions', 'Click on the correct squares.'),
      m('li.instructions', 'Combo bonus for 3 in 1 second.'),
      m('li.instructions', 'Time extension for every 10 correct.')
    ]),
    m('br'),
    m('br'),
    selection(ctrl),
    m('br'),
    m('br'),
    m('div.button.center.action', {
      onclick: function() {
        ctrl.nextFen();
      }
    }, 'Begin'),
    m('br'),
    m('br'),
    score(ctrl),
    m('br'),
    m('br'),
    timer(ctrl)    
  ])];
}

module.exports = function(ctrl) {
  return [
    m("div.#site_header",
      m('div.board_left', [
        m('h2',
          m('a#site_title', 'feature',
            m('span.extension', 'tron'))),
        features(ctrl)
      ])
    ),
    m('div.#lichess',
      m('div.analyse.cg-512', [
        m('div',
          m('div.lichess_game', [
            visualBoard(ctrl),
            m('div.lichess_ground', info(ctrl))
          ])
        ),
        m('div.underboard', [
          m('div.center', [
            fenbar(ctrl),
            m('br'),
            m('small', 'Data autogenerated from games on ', m("a.external[href='http://lichess.org']", 'lichess.org.')),
            m('small', [
              'Uses libraries ', m("a.external[href='https://github.com/ornicar/chessground']", 'chessground'),
              ' and ', m("a.external[href='https://github.com/jhlywa/chess.js']", 'chessjs.'),
              ' Source code on ', m("a.external[href='https://github.com/tailuge/chess-o-tron']", 'GitHub.')
            ])
          ])
        ])
      ])
    )
  ];
};

},{"./features":38,"./fenbar":39,"./score":41,"./selection":42,"./timer":43,"chessground":27,"mithril":33}],41:[function(require,module,exports){
var m = require('mithril');

module.exports = function(controller) {
  return [
    m('div.bonus', "bonus: " + controller.bonus()),
    m('div.score', "score: " + controller.score())
  ];
};

},{"mithril":33}],42:[function(require,module,exports){
var m = require('mithril');

module.exports = function(controller) {
  return [
    m('select', [
      m('option', {
        value: "Knight forks"
      }, "Knight forks"),
      m('option', {
        value: "Queen forks"
      }, "Queen forks"),
    ])
  ];
};

},{"mithril":33}],43:[function(require,module,exports){
var m = require('mithril');

module.exports = function(controller) {
  return [
    m('div.timer', "time: " + controller.time())
  ];
};

},{"mithril":33}]},{},[36])(36)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9leHBsb3Jlci9ub2RlX21vZHVsZXMvY2hlc3MuanMvY2hlc3MuanMiLCIuLi9leHBsb3Jlci9zcmMvY2FsYy9jaGVja3MuanMiLCIuLi9leHBsb3Jlci9zcmMvY2FsYy9jaGVzc3V0aWxzLmpzIiwiLi4vZXhwbG9yZXIvc3JjL2NhbGMvZGlhZ3JhbS5qcyIsIi4uL2V4cGxvcmVyL3NyYy9jYWxjL2ZlbmRhdGEuanMiLCIuLi9leHBsb3Jlci9zcmMvY2FsYy9mb3Jrcy5qcyIsIi4uL2V4cGxvcmVyL3NyYy9jYWxjL2dlbmVyYXRlLmpzIiwiLi4vZXhwbG9yZXIvc3JjL2NhbGMvaGlkZGVuLmpzIiwiLi4vZXhwbG9yZXIvc3JjL2NhbGMvbG9vc2UuanMiLCIuLi9leHBsb3Jlci9zcmMvY2FsYy9tYXRldGhyZWF0LmpzIiwiLi4vZXhwbG9yZXIvc3JjL2NhbGMvcGlucy5qcyIsIi4uL2V4cGxvcmVyL3NyYy91dGlsL3F1ZXJ5cGFyYW0uanMiLCIuLi9leHBsb3Jlci9zcmMvdXRpbC9zdG9wZXZlbnQuanMiLCIuLi9leHBsb3Jlci9zcmMvdXRpbC91bmlxLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL25vZGVfbW9kdWxlcy9taXRocmlsL21pdGhyaWwuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2FuaW0uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2FwaS5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvYm9hcmQuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2NvbmZpZ3VyZS5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvY29vcmRzLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9jdHJsLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9kYXRhLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9kcmFnLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9kcmF3LmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9mZW4uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2hvbGQuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL21haW4uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL3ByZW1vdmUuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL3N2Zy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvdmlldy5qcyIsIm5vZGVfbW9kdWxlcy9tZXJnZS9tZXJnZS5qcyIsInNyYy9jdHJsLmpzIiwic3JjL2dyb3VuZC5qcyIsInNyYy9tYWluLmpzIiwic3JjL3ZpZXcvZmVhdHVyZS5qcyIsInNyYy92aWV3L2ZlYXR1cmVzLmpzIiwic3JjL3ZpZXcvZmVuYmFyLmpzIiwic3JjL3ZpZXcvbWFpbi5qcyIsInNyYy92aWV3L3Njb3JlLmpzIiwic3JjL3ZpZXcvc2VsZWN0aW9uLmpzIiwic3JjL3ZpZXcvdGltZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFtREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOTNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYsIEplZmYgSGx5d2EgKGpobHl3YUBnbWFpbC5jb20pXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqICAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gKiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxuICogU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXG4gKiBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxuICogQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcbiAqIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXG4gKiBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiBtaW5pZmllZCBsaWNlbnNlIGJlbG93ICAqL1xuXG4vKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE2LCBKZWZmIEhseXdhIChqaGx5d2FAZ21haWwuY29tKVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIEJTRCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vamhseXdhL2NoZXNzLmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG52YXIgQ2hlc3MgPSBmdW5jdGlvbihmZW4pIHtcblxuICAvKiBqc2hpbnQgaW5kZW50OiBmYWxzZSAqL1xuXG4gIHZhciBCTEFDSyA9ICdiJztcbiAgdmFyIFdISVRFID0gJ3cnO1xuXG4gIHZhciBFTVBUWSA9IC0xO1xuXG4gIHZhciBQQVdOID0gJ3AnO1xuICB2YXIgS05JR0hUID0gJ24nO1xuICB2YXIgQklTSE9QID0gJ2InO1xuICB2YXIgUk9PSyA9ICdyJztcbiAgdmFyIFFVRUVOID0gJ3EnO1xuICB2YXIgS0lORyA9ICdrJztcblxuICB2YXIgU1lNQk9MUyA9ICdwbmJycWtQTkJSUUsnO1xuXG4gIHZhciBERUZBVUxUX1BPU0lUSU9OID0gJ3JuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxJztcblxuICB2YXIgUE9TU0lCTEVfUkVTVUxUUyA9IFsnMS0wJywgJzAtMScsICcxLzItMS8yJywgJyonXTtcblxuICB2YXIgUEFXTl9PRkZTRVRTID0ge1xuICAgIGI6IFsxNiwgMzIsIDE3LCAxNV0sXG4gICAgdzogWy0xNiwgLTMyLCAtMTcsIC0xNV1cbiAgfTtcblxuICB2YXIgUElFQ0VfT0ZGU0VUUyA9IHtcbiAgICBuOiBbLTE4LCAtMzMsIC0zMSwgLTE0LCAgMTgsIDMzLCAzMSwgIDE0XSxcbiAgICBiOiBbLTE3LCAtMTUsICAxNywgIDE1XSxcbiAgICByOiBbLTE2LCAgIDEsICAxNiwgIC0xXSxcbiAgICBxOiBbLTE3LCAtMTYsIC0xNSwgICAxLCAgMTcsIDE2LCAxNSwgIC0xXSxcbiAgICBrOiBbLTE3LCAtMTYsIC0xNSwgICAxLCAgMTcsIDE2LCAxNSwgIC0xXVxuICB9O1xuXG4gIHZhciBBVFRBQ0tTID0gW1xuICAgIDIwLCAwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsIDAsMjAsIDAsXG4gICAgIDAsMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwyMCwgMCwgMCxcbiAgICAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLDIwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDI0LCAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwyMCwgMiwgMjQsICAyLDIwLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLCAyLDUzLCA1NiwgNTMsIDIsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgMjQsMjQsMjQsMjQsMjQsMjQsNTYsICAwLCA1NiwyNCwyNCwyNCwyNCwyNCwyNCwgMCxcbiAgICAgMCwgMCwgMCwgMCwgMCwgMiw1MywgNTYsIDUzLCAyLCAwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLDIwLCAyLCAyNCwgIDIsMjAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDI0LCAgMCwgMCwyMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLDIwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDAsXG4gICAgIDAsMjAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwyMCwgMCwgMCxcbiAgICAyMCwgMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLCAwLDIwXG4gIF07XG5cbiAgdmFyIFJBWVMgPSBbXG4gICAgIDE3LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMTUsIDAsXG4gICAgICAwLCAxNywgIDAsICAwLCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgIDAsICAwLCAxNSwgIDAsIDAsXG4gICAgICAwLCAgMCwgMTcsICAwLCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgIDAsIDE1LCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsIDE3LCAgMCwgIDAsICAwLCAxNiwgIDAsICAwLCAgMCwgMTUsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAxNywgIDAsICAwLCAxNiwgIDAsICAwLCAxNSwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwgMTcsICAwLCAxNiwgIDAsIDE1LCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDE3LCAxNiwgMTUsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAxLCAgMSwgIDEsICAxLCAgMSwgIDEsICAxLCAgMCwgLTEsIC0xLCAgLTEsLTEsIC0xLCAtMSwgLTEsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsLTE1LC0xNiwtMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLCAgMCwtMTUsICAwLC0xNiwgIDAsLTE3LCAgMCwgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsICAwLC0xNSwgIDAsICAwLC0xNiwgIDAsICAwLC0xNywgIDAsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwgIDAsLTE1LCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwtMTcsICAwLCAgMCwgIDAsIDAsXG4gICAgICAwLCAgMCwtMTUsICAwLCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwgIDAsLTE3LCAgMCwgIDAsIDAsXG4gICAgICAwLC0xNSwgIDAsICAwLCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwgIDAsICAwLC0xNywgIDAsIDAsXG4gICAgLTE1LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLC0xNiwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwtMTdcbiAgXTtcblxuICB2YXIgU0hJRlRTID0geyBwOiAwLCBuOiAxLCBiOiAyLCByOiAzLCBxOiA0LCBrOiA1IH07XG5cbiAgdmFyIEZMQUdTID0ge1xuICAgIE5PUk1BTDogJ24nLFxuICAgIENBUFRVUkU6ICdjJyxcbiAgICBCSUdfUEFXTjogJ2InLFxuICAgIEVQX0NBUFRVUkU6ICdlJyxcbiAgICBQUk9NT1RJT046ICdwJyxcbiAgICBLU0lERV9DQVNUTEU6ICdrJyxcbiAgICBRU0lERV9DQVNUTEU6ICdxJ1xuICB9O1xuXG4gIHZhciBCSVRTID0ge1xuICAgIE5PUk1BTDogMSxcbiAgICBDQVBUVVJFOiAyLFxuICAgIEJJR19QQVdOOiA0LFxuICAgIEVQX0NBUFRVUkU6IDgsXG4gICAgUFJPTU9USU9OOiAxNixcbiAgICBLU0lERV9DQVNUTEU6IDMyLFxuICAgIFFTSURFX0NBU1RMRTogNjRcbiAgfTtcblxuICB2YXIgUkFOS18xID0gNztcbiAgdmFyIFJBTktfMiA9IDY7XG4gIHZhciBSQU5LXzMgPSA1O1xuICB2YXIgUkFOS180ID0gNDtcbiAgdmFyIFJBTktfNSA9IDM7XG4gIHZhciBSQU5LXzYgPSAyO1xuICB2YXIgUkFOS183ID0gMTtcbiAgdmFyIFJBTktfOCA9IDA7XG5cbiAgdmFyIFNRVUFSRVMgPSB7XG4gICAgYTg6ICAgMCwgYjg6ICAgMSwgYzg6ICAgMiwgZDg6ICAgMywgZTg6ICAgNCwgZjg6ICAgNSwgZzg6ICAgNiwgaDg6ICAgNyxcbiAgICBhNzogIDE2LCBiNzogIDE3LCBjNzogIDE4LCBkNzogIDE5LCBlNzogIDIwLCBmNzogIDIxLCBnNzogIDIyLCBoNzogIDIzLFxuICAgIGE2OiAgMzIsIGI2OiAgMzMsIGM2OiAgMzQsIGQ2OiAgMzUsIGU2OiAgMzYsIGY2OiAgMzcsIGc2OiAgMzgsIGg2OiAgMzksXG4gICAgYTU6ICA0OCwgYjU6ICA0OSwgYzU6ICA1MCwgZDU6ICA1MSwgZTU6ICA1MiwgZjU6ICA1MywgZzU6ICA1NCwgaDU6ICA1NSxcbiAgICBhNDogIDY0LCBiNDogIDY1LCBjNDogIDY2LCBkNDogIDY3LCBlNDogIDY4LCBmNDogIDY5LCBnNDogIDcwLCBoNDogIDcxLFxuICAgIGEzOiAgODAsIGIzOiAgODEsIGMzOiAgODIsIGQzOiAgODMsIGUzOiAgODQsIGYzOiAgODUsIGczOiAgODYsIGgzOiAgODcsXG4gICAgYTI6ICA5NiwgYjI6ICA5NywgYzI6ICA5OCwgZDI6ICA5OSwgZTI6IDEwMCwgZjI6IDEwMSwgZzI6IDEwMiwgaDI6IDEwMyxcbiAgICBhMTogMTEyLCBiMTogMTEzLCBjMTogMTE0LCBkMTogMTE1LCBlMTogMTE2LCBmMTogMTE3LCBnMTogMTE4LCBoMTogMTE5XG4gIH07XG5cbiAgdmFyIFJPT0tTID0ge1xuICAgIHc6IFt7c3F1YXJlOiBTUVVBUkVTLmExLCBmbGFnOiBCSVRTLlFTSURFX0NBU1RMRX0sXG4gICAgICAgIHtzcXVhcmU6IFNRVUFSRVMuaDEsIGZsYWc6IEJJVFMuS1NJREVfQ0FTVExFfV0sXG4gICAgYjogW3tzcXVhcmU6IFNRVUFSRVMuYTgsIGZsYWc6IEJJVFMuUVNJREVfQ0FTVExFfSxcbiAgICAgICAge3NxdWFyZTogU1FVQVJFUy5oOCwgZmxhZzogQklUUy5LU0lERV9DQVNUTEV9XVxuICB9O1xuXG4gIHZhciBib2FyZCA9IG5ldyBBcnJheSgxMjgpO1xuICB2YXIga2luZ3MgPSB7dzogRU1QVFksIGI6IEVNUFRZfTtcbiAgdmFyIHR1cm4gPSBXSElURTtcbiAgdmFyIGNhc3RsaW5nID0ge3c6IDAsIGI6IDB9O1xuICB2YXIgZXBfc3F1YXJlID0gRU1QVFk7XG4gIHZhciBoYWxmX21vdmVzID0gMDtcbiAgdmFyIG1vdmVfbnVtYmVyID0gMTtcbiAgdmFyIGhpc3RvcnkgPSBbXTtcbiAgdmFyIGhlYWRlciA9IHt9O1xuXG4gIC8qIGlmIHRoZSB1c2VyIHBhc3NlcyBpbiBhIGZlbiBzdHJpbmcsIGxvYWQgaXQsIGVsc2UgZGVmYXVsdCB0b1xuICAgKiBzdGFydGluZyBwb3NpdGlvblxuICAgKi9cbiAgaWYgKHR5cGVvZiBmZW4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgbG9hZChERUZBVUxUX1BPU0lUSU9OKTtcbiAgfSBlbHNlIHtcbiAgICBsb2FkKGZlbik7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICBib2FyZCA9IG5ldyBBcnJheSgxMjgpO1xuICAgIGtpbmdzID0ge3c6IEVNUFRZLCBiOiBFTVBUWX07XG4gICAgdHVybiA9IFdISVRFO1xuICAgIGNhc3RsaW5nID0ge3c6IDAsIGI6IDB9O1xuICAgIGVwX3NxdWFyZSA9IEVNUFRZO1xuICAgIGhhbGZfbW92ZXMgPSAwO1xuICAgIG1vdmVfbnVtYmVyID0gMTtcbiAgICBoaXN0b3J5ID0gW107XG4gICAgaGVhZGVyID0ge307XG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGxvYWQoREVGQVVMVF9QT1NJVElPTik7XG4gIH1cblxuICBmdW5jdGlvbiBsb2FkKGZlbikge1xuICAgIHZhciB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0b2tlbnNbMF07XG4gICAgdmFyIHNxdWFyZSA9IDA7XG5cbiAgICBpZiAoIXZhbGlkYXRlX2ZlbihmZW4pLnZhbGlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY2xlYXIoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaWVjZSA9IHBvc2l0aW9uLmNoYXJBdChpKTtcblxuICAgICAgaWYgKHBpZWNlID09PSAnLycpIHtcbiAgICAgICAgc3F1YXJlICs9IDg7XG4gICAgICB9IGVsc2UgaWYgKGlzX2RpZ2l0KHBpZWNlKSkge1xuICAgICAgICBzcXVhcmUgKz0gcGFyc2VJbnQocGllY2UsIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb2xvciA9IChwaWVjZSA8ICdhJykgPyBXSElURSA6IEJMQUNLO1xuICAgICAgICBwdXQoe3R5cGU6IHBpZWNlLnRvTG93ZXJDYXNlKCksIGNvbG9yOiBjb2xvcn0sIGFsZ2VicmFpYyhzcXVhcmUpKTtcbiAgICAgICAgc3F1YXJlKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHVybiA9IHRva2Vuc1sxXTtcblxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignSycpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLncgfD0gQklUUy5LU0lERV9DQVNUTEU7XG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignUScpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLncgfD0gQklUUy5RU0lERV9DQVNUTEU7XG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZignaycpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLmIgfD0gQklUUy5LU0lERV9DQVNUTEU7XG4gICAgfVxuICAgIGlmICh0b2tlbnNbMl0uaW5kZXhPZigncScpID4gLTEpIHtcbiAgICAgIGNhc3RsaW5nLmIgfD0gQklUUy5RU0lERV9DQVNUTEU7XG4gICAgfVxuXG4gICAgZXBfc3F1YXJlID0gKHRva2Vuc1szXSA9PT0gJy0nKSA/IEVNUFRZIDogU1FVQVJFU1t0b2tlbnNbM11dO1xuICAgIGhhbGZfbW92ZXMgPSBwYXJzZUludCh0b2tlbnNbNF0sIDEwKTtcbiAgICBtb3ZlX251bWJlciA9IHBhcnNlSW50KHRva2Vuc1s1XSwgMTApO1xuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogVE9ETzogdGhpcyBmdW5jdGlvbiBpcyBwcmV0dHkgbXVjaCBjcmFwIC0gaXQgdmFsaWRhdGVzIHN0cnVjdHVyZSBidXRcbiAgICogY29tcGxldGVseSBpZ25vcmVzIGNvbnRlbnQgKGUuZy4gZG9lc24ndCB2ZXJpZnkgdGhhdCBlYWNoIHNpZGUgaGFzIGEga2luZylcbiAgICogLi4uIHdlIHNob3VsZCByZXdyaXRlIHRoaXMsIGFuZCBkaXRjaCB0aGUgc2lsbHkgZXJyb3JfbnVtYmVyIGZpZWxkIHdoaWxlXG4gICAqIHdlJ3JlIGF0IGl0XG4gICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZV9mZW4oZmVuKSB7XG4gICAgdmFyIGVycm9ycyA9IHtcbiAgICAgICAwOiAnTm8gZXJyb3JzLicsXG4gICAgICAgMTogJ0ZFTiBzdHJpbmcgbXVzdCBjb250YWluIHNpeCBzcGFjZS1kZWxpbWl0ZWQgZmllbGRzLicsXG4gICAgICAgMjogJzZ0aCBmaWVsZCAobW92ZSBudW1iZXIpIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLicsXG4gICAgICAgMzogJzV0aCBmaWVsZCAoaGFsZiBtb3ZlIGNvdW50ZXIpIG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlci4nLFxuICAgICAgIDQ6ICc0dGggZmllbGQgKGVuLXBhc3NhbnQgc3F1YXJlKSBpcyBpbnZhbGlkLicsXG4gICAgICAgNTogJzNyZCBmaWVsZCAoY2FzdGxpbmcgYXZhaWxhYmlsaXR5KSBpcyBpbnZhbGlkLicsXG4gICAgICAgNjogJzJuZCBmaWVsZCAoc2lkZSB0byBtb3ZlKSBpcyBpbnZhbGlkLicsXG4gICAgICAgNzogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBkb2VzIG5vdCBjb250YWluIDggXFwnL1xcJy1kZWxpbWl0ZWQgcm93cy4nLFxuICAgICAgIDg6ICcxc3QgZmllbGQgKHBpZWNlIHBvc2l0aW9ucykgaXMgaW52YWxpZCBbY29uc2VjdXRpdmUgbnVtYmVyc10uJyxcbiAgICAgICA5OiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGlzIGludmFsaWQgW2ludmFsaWQgcGllY2VdLicsXG4gICAgICAxMDogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtyb3cgdG9vIGxhcmdlXS4nLFxuICAgICAgMTE6ICdJbGxlZ2FsIGVuLXBhc3NhbnQgc3F1YXJlJyxcbiAgICB9O1xuXG4gICAgLyogMXN0IGNyaXRlcmlvbjogNiBzcGFjZS1zZXBlcmF0ZWQgZmllbGRzPyAqL1xuICAgIHZhciB0b2tlbnMgPSBmZW4uc3BsaXQoL1xccysvKTtcbiAgICBpZiAodG9rZW5zLmxlbmd0aCAhPT0gNikge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMSwgZXJyb3I6IGVycm9yc1sxXX07XG4gICAgfVxuXG4gICAgLyogMm5kIGNyaXRlcmlvbjogbW92ZSBudW1iZXIgZmllbGQgaXMgYSBpbnRlZ2VyIHZhbHVlID4gMD8gKi9cbiAgICBpZiAoaXNOYU4odG9rZW5zWzVdKSB8fCAocGFyc2VJbnQodG9rZW5zWzVdLCAxMCkgPD0gMCkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDIsIGVycm9yOiBlcnJvcnNbMl19O1xuICAgIH1cblxuICAgIC8qIDNyZCBjcml0ZXJpb246IGhhbGYgbW92ZSBjb3VudGVyIGlzIGFuIGludGVnZXIgPj0gMD8gKi9cbiAgICBpZiAoaXNOYU4odG9rZW5zWzRdKSB8fCAocGFyc2VJbnQodG9rZW5zWzRdLCAxMCkgPCAwKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMywgZXJyb3I6IGVycm9yc1szXX07XG4gICAgfVxuXG4gICAgLyogNHRoIGNyaXRlcmlvbjogNHRoIGZpZWxkIGlzIGEgdmFsaWQgZS5wLi1zdHJpbmc/ICovXG4gICAgaWYgKCEvXigtfFthYmNkZWZnaF1bMzZdKSQvLnRlc3QodG9rZW5zWzNdKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNCwgZXJyb3I6IGVycm9yc1s0XX07XG4gICAgfVxuXG4gICAgLyogNXRoIGNyaXRlcmlvbjogM3RoIGZpZWxkIGlzIGEgdmFsaWQgY2FzdGxlLXN0cmluZz8gKi9cbiAgICBpZiggIS9eKEtRP2s/cT98UWs/cT98a3E/fHF8LSkkLy50ZXN0KHRva2Vuc1syXSkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDUsIGVycm9yOiBlcnJvcnNbNV19O1xuICAgIH1cblxuICAgIC8qIDZ0aCBjcml0ZXJpb246IDJuZCBmaWVsZCBpcyBcIndcIiAod2hpdGUpIG9yIFwiYlwiIChibGFjayk/ICovXG4gICAgaWYgKCEvXih3fGIpJC8udGVzdCh0b2tlbnNbMV0pKSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA2LCBlcnJvcjogZXJyb3JzWzZdfTtcbiAgICB9XG5cbiAgICAvKiA3dGggY3JpdGVyaW9uOiAxc3QgZmllbGQgY29udGFpbnMgOCByb3dzPyAqL1xuICAgIHZhciByb3dzID0gdG9rZW5zWzBdLnNwbGl0KCcvJyk7XG4gICAgaWYgKHJvd3MubGVuZ3RoICE9PSA4KSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA3LCBlcnJvcjogZXJyb3JzWzddfTtcbiAgICB9XG5cbiAgICAvKiA4dGggY3JpdGVyaW9uOiBldmVyeSByb3cgaXMgdmFsaWQ/ICovXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvKiBjaGVjayBmb3IgcmlnaHQgc3VtIG9mIGZpZWxkcyBBTkQgbm90IHR3byBudW1iZXJzIGluIHN1Y2Nlc3Npb24gKi9cbiAgICAgIHZhciBzdW1fZmllbGRzID0gMDtcbiAgICAgIHZhciBwcmV2aW91c193YXNfbnVtYmVyID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcm93c1tpXS5sZW5ndGg7IGsrKykge1xuICAgICAgICBpZiAoIWlzTmFOKHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzX3dhc19udW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDgsIGVycm9yOiBlcnJvcnNbOF19O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdW1fZmllbGRzICs9IHBhcnNlSW50KHJvd3NbaV1ba10sIDEwKTtcbiAgICAgICAgICBwcmV2aW91c193YXNfbnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIS9eW3BybmJxa1BSTkJRS10kLy50ZXN0KHJvd3NbaV1ba10pKSB7XG4gICAgICAgICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA5LCBlcnJvcjogZXJyb3JzWzldfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3VtX2ZpZWxkcyArPSAxO1xuICAgICAgICAgIHByZXZpb3VzX3dhc19udW1iZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1bV9maWVsZHMgIT09IDgpIHtcbiAgICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMTAsIGVycm9yOiBlcnJvcnNbMTBdfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoKHRva2Vuc1szXVsxXSA9PSAnMycgJiYgdG9rZW5zWzFdID09ICd3JykgfHxcbiAgICAgICAgKHRva2Vuc1szXVsxXSA9PSAnNicgJiYgdG9rZW5zWzFdID09ICdiJykpIHtcbiAgICAgICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAxMSwgZXJyb3I6IGVycm9yc1sxMV19O1xuICAgIH1cblxuICAgIC8qIGV2ZXJ5dGhpbmcncyBva2F5ISAqL1xuICAgIHJldHVybiB7dmFsaWQ6IHRydWUsIGVycm9yX251bWJlcjogMCwgZXJyb3I6IGVycm9yc1swXX07XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZV9mZW4oKSB7XG4gICAgdmFyIGVtcHR5ID0gMDtcbiAgICB2YXIgZmVuID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIGlmIChib2FyZFtpXSA9PSBudWxsKSB7XG4gICAgICAgIGVtcHR5Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW1wdHkgPiAwKSB7XG4gICAgICAgICAgZmVuICs9IGVtcHR5O1xuICAgICAgICAgIGVtcHR5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29sb3IgPSBib2FyZFtpXS5jb2xvcjtcbiAgICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV0udHlwZTtcblxuICAgICAgICBmZW4gKz0gKGNvbG9yID09PSBXSElURSkgP1xuICAgICAgICAgICAgICAgICBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgIGlmIChlbXB0eSA+IDApIHtcbiAgICAgICAgICBmZW4gKz0gZW1wdHk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSAhPT0gU1FVQVJFUy5oMSkge1xuICAgICAgICAgIGZlbiArPSAnLyc7XG4gICAgICAgIH1cblxuICAgICAgICBlbXB0eSA9IDA7XG4gICAgICAgIGkgKz0gODtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2ZsYWdzID0gJyc7XG4gICAgaWYgKGNhc3RsaW5nW1dISVRFXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7IGNmbGFncyArPSAnSyc7IH1cbiAgICBpZiAoY2FzdGxpbmdbV0hJVEVdICYgQklUUy5RU0lERV9DQVNUTEUpIHsgY2ZsYWdzICs9ICdRJzsgfVxuICAgIGlmIChjYXN0bGluZ1tCTEFDS10gJiBCSVRTLktTSURFX0NBU1RMRSkgeyBjZmxhZ3MgKz0gJ2snOyB9XG4gICAgaWYgKGNhc3RsaW5nW0JMQUNLXSAmIEJJVFMuUVNJREVfQ0FTVExFKSB7IGNmbGFncyArPSAncSc7IH1cblxuICAgIC8qIGRvIHdlIGhhdmUgYW4gZW1wdHkgY2FzdGxpbmcgZmxhZz8gKi9cbiAgICBjZmxhZ3MgPSBjZmxhZ3MgfHwgJy0nO1xuICAgIHZhciBlcGZsYWdzID0gKGVwX3NxdWFyZSA9PT0gRU1QVFkpID8gJy0nIDogYWxnZWJyYWljKGVwX3NxdWFyZSk7XG5cbiAgICByZXR1cm4gW2ZlbiwgdHVybiwgY2ZsYWdzLCBlcGZsYWdzLCBoYWxmX21vdmVzLCBtb3ZlX251bWJlcl0uam9pbignICcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0X2hlYWRlcihhcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgdHlwZW9mIGFyZ3NbaSArIDFdID09PSAnc3RyaW5nJykge1xuICAgICAgICBoZWFkZXJbYXJnc1tpXV0gPSBhcmdzW2kgKyAxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlcjtcbiAgfVxuXG4gIC8qIGNhbGxlZCB3aGVuIHRoZSBpbml0aWFsIGJvYXJkIHNldHVwIGlzIGNoYW5nZWQgd2l0aCBwdXQoKSBvciByZW1vdmUoKS5cbiAgICogbW9kaWZpZXMgdGhlIFNldFVwIGFuZCBGRU4gcHJvcGVydGllcyBvZiB0aGUgaGVhZGVyIG9iamVjdC4gIGlmIHRoZSBGRU4gaXNcbiAgICogZXF1YWwgdG8gdGhlIGRlZmF1bHQgcG9zaXRpb24sIHRoZSBTZXRVcCBhbmQgRkVOIGFyZSBkZWxldGVkXG4gICAqIHRoZSBzZXR1cCBpcyBvbmx5IHVwZGF0ZWQgaWYgaGlzdG9yeS5sZW5ndGggaXMgemVybywgaWUgbW92ZXMgaGF2ZW4ndCBiZWVuXG4gICAqIG1hZGUuXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGVfc2V0dXAoZmVuKSB7XG4gICAgaWYgKGhpc3RvcnkubGVuZ3RoID4gMCkgcmV0dXJuO1xuXG4gICAgaWYgKGZlbiAhPT0gREVGQVVMVF9QT1NJVElPTikge1xuICAgICAgaGVhZGVyWydTZXRVcCddID0gJzEnO1xuICAgICAgaGVhZGVyWydGRU4nXSA9IGZlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGhlYWRlclsnU2V0VXAnXTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJbJ0ZFTiddO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldChzcXVhcmUpIHtcbiAgICB2YXIgcGllY2UgPSBib2FyZFtTUVVBUkVTW3NxdWFyZV1dO1xuICAgIHJldHVybiAocGllY2UpID8ge3R5cGU6IHBpZWNlLnR5cGUsIGNvbG9yOiBwaWVjZS5jb2xvcn0gOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcHV0KHBpZWNlLCBzcXVhcmUpIHtcbiAgICAvKiBjaGVjayBmb3IgdmFsaWQgcGllY2Ugb2JqZWN0ICovXG4gICAgaWYgKCEoJ3R5cGUnIGluIHBpZWNlICYmICdjb2xvcicgaW4gcGllY2UpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIHBpZWNlICovXG4gICAgaWYgKFNZTUJPTFMuaW5kZXhPZihwaWVjZS50eXBlLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qIGNoZWNrIGZvciB2YWxpZCBzcXVhcmUgKi9cbiAgICBpZiAoIShzcXVhcmUgaW4gU1FVQVJFUykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc3EgPSBTUVVBUkVTW3NxdWFyZV07XG5cbiAgICAvKiBkb24ndCBsZXQgdGhlIHVzZXIgcGxhY2UgbW9yZSB0aGFuIG9uZSBraW5nICovXG4gICAgaWYgKHBpZWNlLnR5cGUgPT0gS0lORyAmJlxuICAgICAgICAhKGtpbmdzW3BpZWNlLmNvbG9yXSA9PSBFTVBUWSB8fCBraW5nc1twaWVjZS5jb2xvcl0gPT0gc3EpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgYm9hcmRbc3FdID0ge3R5cGU6IHBpZWNlLnR5cGUsIGNvbG9yOiBwaWVjZS5jb2xvcn07XG4gICAgaWYgKHBpZWNlLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW3BpZWNlLmNvbG9yXSA9IHNxO1xuICAgIH1cblxuICAgIHVwZGF0ZV9zZXR1cChnZW5lcmF0ZV9mZW4oKSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZShzcXVhcmUpIHtcbiAgICB2YXIgcGllY2UgPSBnZXQoc3F1YXJlKTtcbiAgICBib2FyZFtTUVVBUkVTW3NxdWFyZV1dID0gbnVsbDtcbiAgICBpZiAocGllY2UgJiYgcGllY2UudHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbcGllY2UuY29sb3JdID0gRU1QVFk7XG4gICAgfVxuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcblxuICAgIHJldHVybiBwaWVjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkX21vdmUoYm9hcmQsIGZyb20sIHRvLCBmbGFncywgcHJvbW90aW9uKSB7XG4gICAgdmFyIG1vdmUgPSB7XG4gICAgICBjb2xvcjogdHVybixcbiAgICAgIGZyb206IGZyb20sXG4gICAgICB0bzogdG8sXG4gICAgICBmbGFnczogZmxhZ3MsXG4gICAgICBwaWVjZTogYm9hcmRbZnJvbV0udHlwZVxuICAgIH07XG5cbiAgICBpZiAocHJvbW90aW9uKSB7XG4gICAgICBtb3ZlLmZsYWdzIHw9IEJJVFMuUFJPTU9USU9OO1xuICAgICAgbW92ZS5wcm9tb3Rpb24gPSBwcm9tb3Rpb247XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkW3RvXSkge1xuICAgICAgbW92ZS5jYXB0dXJlZCA9IGJvYXJkW3RvXS50eXBlO1xuICAgIH0gZWxzZSBpZiAoZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgICAgbW92ZS5jYXB0dXJlZCA9IFBBV047XG4gICAgfVxuICAgIHJldHVybiBtb3ZlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVfbW92ZXMob3B0aW9ucykge1xuICAgIGZ1bmN0aW9uIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgZnJvbSwgdG8sIGZsYWdzKSB7XG4gICAgICAvKiBpZiBwYXduIHByb21vdGlvbiAqL1xuICAgICAgaWYgKGJvYXJkW2Zyb21dLnR5cGUgPT09IFBBV04gJiZcbiAgICAgICAgIChyYW5rKHRvKSA9PT0gUkFOS184IHx8IHJhbmsodG8pID09PSBSQU5LXzEpKSB7XG4gICAgICAgICAgdmFyIHBpZWNlcyA9IFtRVUVFTiwgUk9PSywgQklTSE9QLCBLTklHSFRdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwaWVjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzLCBwaWVjZXNbaV0pKTtcbiAgICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgIG1vdmVzLnB1c2goYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gW107XG4gICAgdmFyIHVzID0gdHVybjtcbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodXMpO1xuICAgIHZhciBzZWNvbmRfcmFuayA9IHtiOiBSQU5LXzcsIHc6IFJBTktfMn07XG5cbiAgICB2YXIgZmlyc3Rfc3EgPSBTUVVBUkVTLmE4O1xuICAgIHZhciBsYXN0X3NxID0gU1FVQVJFUy5oMTtcbiAgICB2YXIgc2luZ2xlX3NxdWFyZSA9IGZhbHNlO1xuXG4gICAgLyogZG8gd2Ugd2FudCBsZWdhbCBtb3Zlcz8gKi9cbiAgICB2YXIgbGVnYWwgPSAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdsZWdhbCcgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubGVnYWwgOiB0cnVlO1xuXG4gICAgLyogYXJlIHdlIGdlbmVyYXRpbmcgbW92ZXMgZm9yIGEgc2luZ2xlIHNxdWFyZT8gKi9cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzcXVhcmUnIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLnNxdWFyZSBpbiBTUVVBUkVTKSB7XG4gICAgICAgIGZpcnN0X3NxID0gbGFzdF9zcSA9IFNRVUFSRVNbb3B0aW9ucy5zcXVhcmVdO1xuICAgICAgICBzaW5nbGVfc3F1YXJlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGludmFsaWQgc3F1YXJlICovXG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gZmlyc3Rfc3E7IGkgPD0gbGFzdF9zcTsgaSsrKSB7XG4gICAgICAvKiBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZCAqL1xuICAgICAgaWYgKGkgJiAweDg4KSB7IGkgKz0gNzsgY29udGludWU7IH1cblxuICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV07XG4gICAgICBpZiAocGllY2UgPT0gbnVsbCB8fCBwaWVjZS5jb2xvciAhPT0gdXMpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwaWVjZS50eXBlID09PSBQQVdOKSB7XG4gICAgICAgIC8qIHNpbmdsZSBzcXVhcmUsIG5vbi1jYXB0dXJpbmcgKi9cbiAgICAgICAgdmFyIHNxdWFyZSA9IGkgKyBQQVdOX09GRlNFVFNbdXNdWzBdO1xuICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5OT1JNQUwpO1xuXG4gICAgICAgICAgLyogZG91YmxlIHNxdWFyZSAqL1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVsxXTtcbiAgICAgICAgICBpZiAoc2Vjb25kX3JhbmtbdXNdID09PSByYW5rKGkpICYmIGJvYXJkW3NxdWFyZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQklHX1BBV04pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHBhd24gY2FwdHVyZXMgKi9cbiAgICAgICAgZm9yIChqID0gMjsgaiA8IDQ7IGorKykge1xuICAgICAgICAgIHZhciBzcXVhcmUgPSBpICsgUEFXTl9PRkZTRVRTW3VzXVtqXTtcbiAgICAgICAgICBpZiAoc3F1YXJlICYgMHg4OCkgY29udGludWU7XG5cbiAgICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgIGJvYXJkW3NxdWFyZV0uY29sb3IgPT09IHRoZW0pIHtcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQ0FQVFVSRSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcXVhcmUgPT09IGVwX3NxdWFyZSkge1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIGVwX3NxdWFyZSwgQklUUy5FUF9DQVBUVVJFKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSBQSUVDRV9PRkZTRVRTW3BpZWNlLnR5cGVdLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgdmFyIG9mZnNldCA9IFBJRUNFX09GRlNFVFNbcGllY2UudHlwZV1bal07XG4gICAgICAgICAgdmFyIHNxdWFyZSA9IGk7XG5cbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgc3F1YXJlICs9IG9mZnNldDtcbiAgICAgICAgICAgIGlmIChzcXVhcmUgJiAweDg4KSBicmVhaztcblxuICAgICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5OT1JNQUwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGJvYXJkW3NxdWFyZV0uY29sb3IgPT09IHVzKSBicmVhaztcbiAgICAgICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBpLCBzcXVhcmUsIEJJVFMuQ0FQVFVSRSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBicmVhaywgaWYga25pZ2h0IG9yIGtpbmcgKi9cbiAgICAgICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKSBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBjaGVjayBmb3IgY2FzdGxpbmcgaWY6IGEpIHdlJ3JlIGdlbmVyYXRpbmcgYWxsIG1vdmVzLCBvciBiKSB3ZSdyZSBkb2luZ1xuICAgICAqIHNpbmdsZSBzcXVhcmUgbW92ZSBnZW5lcmF0aW9uIG9uIHRoZSBraW5nJ3Mgc3F1YXJlXG4gICAgICovXG4gICAgaWYgKCghc2luZ2xlX3NxdWFyZSkgfHwgbGFzdF9zcSA9PT0ga2luZ3NbdXNdKSB7XG4gICAgICAvKiBraW5nLXNpZGUgY2FzdGxpbmcgKi9cbiAgICAgIGlmIChjYXN0bGluZ1t1c10gJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IGtpbmdzW3VzXTtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gY2FzdGxpbmdfZnJvbSArIDI7XG5cbiAgICAgICAgaWYgKGJvYXJkW2Nhc3RsaW5nX2Zyb20gKyAxXSA9PSBudWxsICYmXG4gICAgICAgICAgICBib2FyZFtjYXN0bGluZ190b10gICAgICAgPT0gbnVsbCAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGtpbmdzW3VzXSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ19mcm9tICsgMSkgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBjYXN0bGluZ190bykpIHtcbiAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGtpbmdzW3VzXSAsIGNhc3RsaW5nX3RvLFxuICAgICAgICAgICAgICAgICAgIEJJVFMuS1NJREVfQ0FTVExFKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBxdWVlbi1zaWRlIGNhc3RsaW5nICovXG4gICAgICBpZiAoY2FzdGxpbmdbdXNdICYgQklUUy5RU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBraW5nc1t1c107XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IGNhc3RsaW5nX2Zyb20gLSAyO1xuXG4gICAgICAgIGlmIChib2FyZFtjYXN0bGluZ19mcm9tIC0gMV0gPT0gbnVsbCAmJlxuICAgICAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbSAtIDJdID09IG51bGwgJiZcbiAgICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb20gLSAzXSA9PSBudWxsICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwga2luZ3NbdXNdKSAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX2Zyb20gLSAxKSAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX3RvKSkge1xuICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3Zlcywga2luZ3NbdXNdLCBjYXN0bGluZ190byxcbiAgICAgICAgICAgICAgICAgICBCSVRTLlFTSURFX0NBU1RMRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiByZXR1cm4gYWxsIHBzZXVkby1sZWdhbCBtb3ZlcyAodGhpcyBpbmNsdWRlcyBtb3ZlcyB0aGF0IGFsbG93IHRoZSBraW5nXG4gICAgICogdG8gYmUgY2FwdHVyZWQpXG4gICAgICovXG4gICAgaWYgKCFsZWdhbCkge1xuICAgICAgcmV0dXJuIG1vdmVzO1xuICAgIH1cblxuICAgIC8qIGZpbHRlciBvdXQgaWxsZWdhbCBtb3ZlcyAqL1xuICAgIHZhciBsZWdhbF9tb3ZlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFrZV9tb3ZlKG1vdmVzW2ldKTtcbiAgICAgIGlmICgha2luZ19hdHRhY2tlZCh1cykpIHtcbiAgICAgICAgbGVnYWxfbW92ZXMucHVzaChtb3Zlc1tpXSk7XG4gICAgICB9XG4gICAgICB1bmRvX21vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVnYWxfbW92ZXM7XG4gIH1cblxuICAvKiBjb252ZXJ0IGEgbW92ZSBmcm9tIDB4ODggY29vcmRpbmF0ZXMgdG8gU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uXG4gICAqIChTQU4pXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2xvcHB5IFVzZSB0aGUgc2xvcHB5IFNBTiBnZW5lcmF0b3IgdG8gd29yayBhcm91bmQgb3ZlclxuICAgKiBkaXNhbWJpZ3VhdGlvbiBidWdzIGluIEZyaXR6IGFuZCBDaGVzc2Jhc2UuICBTZWUgYmVsb3c6XG4gICAqXG4gICAqIHIxYnFrYm5yL3BwcDJwcHAvMm41LzFCMXBQMy80UDMvOC9QUFBQMlBQL1JOQlFLMU5SIGIgS1FrcSAtIDIgNFxuICAgKiA0LiAuLi4gTmdlNyBpcyBvdmVybHkgZGlzYW1iaWd1YXRlZCBiZWNhdXNlIHRoZSBrbmlnaHQgb24gYzYgaXMgcGlubmVkXG4gICAqIDQuIC4uLiBOZTcgaXMgdGVjaG5pY2FsbHkgdGhlIHZhbGlkIFNBTlxuICAgKi9cbiAgZnVuY3Rpb24gbW92ZV90b19zYW4obW92ZSwgc2xvcHB5KSB7XG5cbiAgICB2YXIgb3V0cHV0ID0gJyc7XG5cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICBvdXRwdXQgPSAnTy1PJztcbiAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgb3V0cHV0ID0gJ08tTy1PJztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRpc2FtYmlndWF0b3IgPSBnZXRfZGlzYW1iaWd1YXRvcihtb3ZlLCBzbG9wcHkpO1xuXG4gICAgICBpZiAobW92ZS5waWVjZSAhPT0gUEFXTikge1xuICAgICAgICBvdXRwdXQgKz0gbW92ZS5waWVjZS50b1VwcGVyQ2FzZSgpICsgZGlzYW1iaWd1YXRvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiAoQklUUy5DQVBUVVJFIHwgQklUUy5FUF9DQVBUVVJFKSkge1xuICAgICAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS5mcm9tKVswXTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgKz0gJ3gnO1xuICAgICAgfVxuXG4gICAgICBvdXRwdXQgKz0gYWxnZWJyYWljKG1vdmUudG8pO1xuXG4gICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuUFJPTU9USU9OKSB7XG4gICAgICAgIG91dHB1dCArPSAnPScgKyBtb3ZlLnByb21vdGlvbi50b1VwcGVyQ2FzZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICBpZiAoaW5fY2hlY2soKSkge1xuICAgICAgaWYgKGluX2NoZWNrbWF0ZSgpKSB7XG4gICAgICAgIG91dHB1dCArPSAnIyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgKz0gJysnO1xuICAgICAgfVxuICAgIH1cbiAgICB1bmRvX21vdmUoKTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvLyBwYXJzZXMgYWxsIG9mIHRoZSBkZWNvcmF0b3JzIG91dCBvZiBhIFNBTiBzdHJpbmdcbiAgZnVuY3Rpb24gc3RyaXBwZWRfc2FuKG1vdmUpIHtcbiAgICByZXR1cm4gbW92ZS5yZXBsYWNlKC89LywnJykucmVwbGFjZSgvWysjXT9bPyFdKiQvLCcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja2VkKGNvbG9yLCBzcXVhcmUpIHtcbiAgICBpZiAoc3F1YXJlIDwgMCkgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgLyogZGlkIHdlIHJ1biBvZmYgdGhlIGVuZCBvZiB0aGUgYm9hcmQgKi9cbiAgICAgIGlmIChpICYgMHg4OCkgeyBpICs9IDc7IGNvbnRpbnVlOyB9XG5cbiAgICAgIC8qIGlmIGVtcHR5IHNxdWFyZSBvciB3cm9uZyBjb2xvciAqL1xuICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwgfHwgYm9hcmRbaV0uY29sb3IgIT09IGNvbG9yKSBjb250aW51ZTtcblxuICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV07XG4gICAgICB2YXIgZGlmZmVyZW5jZSA9IGkgLSBzcXVhcmU7XG4gICAgICB2YXIgaW5kZXggPSBkaWZmZXJlbmNlICsgMTE5O1xuXG4gICAgICBpZiAoQVRUQUNLU1tpbmRleF0gJiAoMSA8PCBTSElGVFNbcGllY2UudHlwZV0pKSB7XG4gICAgICAgIGlmIChwaWVjZS50eXBlID09PSBQQVdOKSB7XG4gICAgICAgICAgaWYgKGRpZmZlcmVuY2UgPiAwKSB7XG4gICAgICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IFdISVRFKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBpZWNlLmNvbG9yID09PSBCTEFDSykgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogaWYgdGhlIHBpZWNlIGlzIGEga25pZ2h0IG9yIGEga2luZyAqL1xuICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gJ24nIHx8IHBpZWNlLnR5cGUgPT09ICdrJykgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgdmFyIG9mZnNldCA9IFJBWVNbaW5kZXhdO1xuICAgICAgICB2YXIgaiA9IGkgKyBvZmZzZXQ7XG5cbiAgICAgICAgdmFyIGJsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKGogIT09IHNxdWFyZSkge1xuICAgICAgICAgIGlmIChib2FyZFtqXSAhPSBudWxsKSB7IGJsb2NrZWQgPSB0cnVlOyBicmVhazsgfVxuICAgICAgICAgIGogKz0gb2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFibG9ja2VkKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBraW5nX2F0dGFja2VkKGNvbG9yKSB7XG4gICAgcmV0dXJuIGF0dGFja2VkKHN3YXBfY29sb3IoY29sb3IpLCBraW5nc1tjb2xvcl0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5fY2hlY2soKSB7XG4gICAgcmV0dXJuIGtpbmdfYXR0YWNrZWQodHVybik7XG4gIH1cblxuICBmdW5jdGlvbiBpbl9jaGVja21hdGUoKSB7XG4gICAgcmV0dXJuIGluX2NoZWNrKCkgJiYgZ2VuZXJhdGVfbW92ZXMoKS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpbl9zdGFsZW1hdGUoKSB7XG4gICAgcmV0dXJuICFpbl9jaGVjaygpICYmIGdlbmVyYXRlX21vdmVzKCkubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zdWZmaWNpZW50X21hdGVyaWFsKCkge1xuICAgIHZhciBwaWVjZXMgPSB7fTtcbiAgICB2YXIgYmlzaG9wcyA9IFtdO1xuICAgIHZhciBudW1fcGllY2VzID0gMDtcbiAgICB2YXIgc3FfY29sb3IgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGk8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIHNxX2NvbG9yID0gKHNxX2NvbG9yICsgMSkgJSAyO1xuICAgICAgaWYgKGkgJiAweDg4KSB7IGkgKz0gNzsgY29udGludWU7IH1cblxuICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV07XG4gICAgICBpZiAocGllY2UpIHtcbiAgICAgICAgcGllY2VzW3BpZWNlLnR5cGVdID0gKHBpZWNlLnR5cGUgaW4gcGllY2VzKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZXNbcGllY2UudHlwZV0gKyAxIDogMTtcbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IEJJU0hPUCkge1xuICAgICAgICAgIGJpc2hvcHMucHVzaChzcV9jb2xvcik7XG4gICAgICAgIH1cbiAgICAgICAgbnVtX3BpZWNlcysrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGsgdnMuIGsgKi9cbiAgICBpZiAobnVtX3BpZWNlcyA9PT0gMikgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgLyogayB2cy4ga24gLi4uLiBvciAuLi4uIGsgdnMuIGtiICovXG4gICAgZWxzZSBpZiAobnVtX3BpZWNlcyA9PT0gMyAmJiAocGllY2VzW0JJU0hPUF0gPT09IDEgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlc1tLTklHSFRdID09PSAxKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgLyoga2IgdnMuIGtiIHdoZXJlIGFueSBudW1iZXIgb2YgYmlzaG9wcyBhcmUgYWxsIG9uIHRoZSBzYW1lIGNvbG9yICovXG4gICAgZWxzZSBpZiAobnVtX3BpZWNlcyA9PT0gcGllY2VzW0JJU0hPUF0gKyAyKSB7XG4gICAgICB2YXIgc3VtID0gMDtcbiAgICAgIHZhciBsZW4gPSBiaXNob3BzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc3VtICs9IGJpc2hvcHNbaV07XG4gICAgICB9XG4gICAgICBpZiAoc3VtID09PSAwIHx8IHN1bSA9PT0gbGVuKSB7IHJldHVybiB0cnVlOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKSB7XG4gICAgLyogVE9ETzogd2hpbGUgdGhpcyBmdW5jdGlvbiBpcyBmaW5lIGZvciBjYXN1YWwgdXNlLCBhIGJldHRlclxuICAgICAqIGltcGxlbWVudGF0aW9uIHdvdWxkIHVzZSBhIFpvYnJpc3Qga2V5IChpbnN0ZWFkIG9mIEZFTikuIHRoZVxuICAgICAqIFpvYnJpc3Qga2V5IHdvdWxkIGJlIG1haW50YWluZWQgaW4gdGhlIG1ha2VfbW92ZS91bmRvX21vdmUgZnVuY3Rpb25zLFxuICAgICAqIGF2b2lkaW5nIHRoZSBjb3N0bHkgdGhhdCB3ZSBkbyBiZWxvdy5cbiAgICAgKi9cbiAgICB2YXIgbW92ZXMgPSBbXTtcbiAgICB2YXIgcG9zaXRpb25zID0ge307XG4gICAgdmFyIHJlcGV0aXRpb24gPSBmYWxzZTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgbW92ZSA9IHVuZG9fbW92ZSgpO1xuICAgICAgaWYgKCFtb3ZlKSBicmVhaztcbiAgICAgIG1vdmVzLnB1c2gobW92ZSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIC8qIHJlbW92ZSB0aGUgbGFzdCB0d28gZmllbGRzIGluIHRoZSBGRU4gc3RyaW5nLCB0aGV5J3JlIG5vdCBuZWVkZWRcbiAgICAgICAqIHdoZW4gY2hlY2tpbmcgZm9yIGRyYXcgYnkgcmVwICovXG4gICAgICB2YXIgZmVuID0gZ2VuZXJhdGVfZmVuKCkuc3BsaXQoJyAnKS5zbGljZSgwLDQpLmpvaW4oJyAnKTtcblxuICAgICAgLyogaGFzIHRoZSBwb3NpdGlvbiBvY2N1cnJlZCB0aHJlZSBvciBtb3ZlIHRpbWVzICovXG4gICAgICBwb3NpdGlvbnNbZmVuXSA9IChmZW4gaW4gcG9zaXRpb25zKSA/IHBvc2l0aW9uc1tmZW5dICsgMSA6IDE7XG4gICAgICBpZiAocG9zaXRpb25zW2Zlbl0gPj0gMykge1xuICAgICAgICByZXBldGl0aW9uID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFtb3Zlcy5sZW5ndGgpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBtYWtlX21vdmUobW92ZXMucG9wKCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXBldGl0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaChtb3ZlKSB7XG4gICAgaGlzdG9yeS5wdXNoKHtcbiAgICAgIG1vdmU6IG1vdmUsXG4gICAgICBraW5nczoge2I6IGtpbmdzLmIsIHc6IGtpbmdzLnd9LFxuICAgICAgdHVybjogdHVybixcbiAgICAgIGNhc3RsaW5nOiB7YjogY2FzdGxpbmcuYiwgdzogY2FzdGxpbmcud30sXG4gICAgICBlcF9zcXVhcmU6IGVwX3NxdWFyZSxcbiAgICAgIGhhbGZfbW92ZXM6IGhhbGZfbW92ZXMsXG4gICAgICBtb3ZlX251bWJlcjogbW92ZV9udW1iZXJcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VfbW92ZShtb3ZlKSB7XG4gICAgdmFyIHVzID0gdHVybjtcbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodXMpO1xuICAgIHB1c2gobW92ZSk7XG5cbiAgICBib2FyZFttb3ZlLnRvXSA9IGJvYXJkW21vdmUuZnJvbV07XG4gICAgYm9hcmRbbW92ZS5mcm9tXSA9IG51bGw7XG5cbiAgICAvKiBpZiBlcCBjYXB0dXJlLCByZW1vdmUgdGhlIGNhcHR1cmVkIHBhd24gKi9cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgaWYgKHR1cm4gPT09IEJMQUNLKSB7XG4gICAgICAgIGJvYXJkW21vdmUudG8gLSAxNl0gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9hcmRbbW92ZS50byArIDE2XSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogaWYgcGF3biBwcm9tb3Rpb24sIHJlcGxhY2Ugd2l0aCBuZXcgcGllY2UgKi9cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuUFJPTU9USU9OKSB7XG4gICAgICBib2FyZFttb3ZlLnRvXSA9IHt0eXBlOiBtb3ZlLnByb21vdGlvbiwgY29sb3I6IHVzfTtcbiAgICB9XG5cbiAgICAvKiBpZiB3ZSBtb3ZlZCB0aGUga2luZyAqL1xuICAgIGlmIChib2FyZFttb3ZlLnRvXS50eXBlID09PSBLSU5HKSB7XG4gICAgICBraW5nc1tib2FyZFttb3ZlLnRvXS5jb2xvcl0gPSBtb3ZlLnRvO1xuXG4gICAgICAvKiBpZiB3ZSBjYXN0bGVkLCBtb3ZlIHRoZSByb29rIG5leHQgdG8gdGhlIGtpbmcgKi9cbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gbW92ZS50byAtIDE7XG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0gbW92ZS50byArIDE7XG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX3RvXSA9IGJvYXJkW2Nhc3RsaW5nX2Zyb21dO1xuICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tXSA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvIC0gMjtcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV07XG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb21dID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyogdHVybiBvZmYgY2FzdGxpbmcgKi9cbiAgICAgIGNhc3RsaW5nW3VzXSA9ICcnO1xuICAgIH1cblxuICAgIC8qIHR1cm4gb2ZmIGNhc3RsaW5nIGlmIHdlIG1vdmUgYSByb29rICovXG4gICAgaWYgKGNhc3RsaW5nW3VzXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFJPT0tTW3VzXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAobW92ZS5mcm9tID09PSBST09LU1t1c11baV0uc3F1YXJlICYmXG4gICAgICAgICAgICBjYXN0bGluZ1t1c10gJiBST09LU1t1c11baV0uZmxhZykge1xuICAgICAgICAgIGNhc3RsaW5nW3VzXSBePSBST09LU1t1c11baV0uZmxhZztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIHR1cm4gb2ZmIGNhc3RsaW5nIGlmIHdlIGNhcHR1cmUgYSByb29rICovXG4gICAgaWYgKGNhc3RsaW5nW3RoZW1dKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUk9PS1NbdGhlbV0ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKG1vdmUudG8gPT09IFJPT0tTW3RoZW1dW2ldLnNxdWFyZSAmJlxuICAgICAgICAgICAgY2FzdGxpbmdbdGhlbV0gJiBST09LU1t0aGVtXVtpXS5mbGFnKSB7XG4gICAgICAgICAgY2FzdGxpbmdbdGhlbV0gXj0gUk9PS1NbdGhlbV1baV0uZmxhZztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGlmIGJpZyBwYXduIG1vdmUsIHVwZGF0ZSB0aGUgZW4gcGFzc2FudCBzcXVhcmUgKi9cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuQklHX1BBV04pIHtcbiAgICAgIGlmICh0dXJuID09PSAnYicpIHtcbiAgICAgICAgZXBfc3F1YXJlID0gbW92ZS50byAtIDE2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXBfc3F1YXJlID0gbW92ZS50byArIDE2O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcF9zcXVhcmUgPSBFTVBUWTtcbiAgICB9XG5cbiAgICAvKiByZXNldCB0aGUgNTAgbW92ZSBjb3VudGVyIGlmIGEgcGF3biBpcyBtb3ZlZCBvciBhIHBpZWNlIGlzIGNhcHR1cmVkICovXG4gICAgaWYgKG1vdmUucGllY2UgPT09IFBBV04pIHtcbiAgICAgIGhhbGZfbW92ZXMgPSAwO1xuICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIChCSVRTLkNBUFRVUkUgfCBCSVRTLkVQX0NBUFRVUkUpKSB7XG4gICAgICBoYWxmX21vdmVzID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFsZl9tb3ZlcysrO1xuICAgIH1cblxuICAgIGlmICh0dXJuID09PSBCTEFDSykge1xuICAgICAgbW92ZV9udW1iZXIrKztcbiAgICB9XG4gICAgdHVybiA9IHN3YXBfY29sb3IodHVybik7XG4gIH1cblxuICBmdW5jdGlvbiB1bmRvX21vdmUoKSB7XG4gICAgdmFyIG9sZCA9IGhpc3RvcnkucG9wKCk7XG4gICAgaWYgKG9sZCA9PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICB2YXIgbW92ZSA9IG9sZC5tb3ZlO1xuICAgIGtpbmdzID0gb2xkLmtpbmdzO1xuICAgIHR1cm4gPSBvbGQudHVybjtcbiAgICBjYXN0bGluZyA9IG9sZC5jYXN0bGluZztcbiAgICBlcF9zcXVhcmUgPSBvbGQuZXBfc3F1YXJlO1xuICAgIGhhbGZfbW92ZXMgPSBvbGQuaGFsZl9tb3ZlcztcbiAgICBtb3ZlX251bWJlciA9IG9sZC5tb3ZlX251bWJlcjtcblxuICAgIHZhciB1cyA9IHR1cm47XG4gICAgdmFyIHRoZW0gPSBzd2FwX2NvbG9yKHR1cm4pO1xuXG4gICAgYm9hcmRbbW92ZS5mcm9tXSA9IGJvYXJkW21vdmUudG9dO1xuICAgIGJvYXJkW21vdmUuZnJvbV0udHlwZSA9IG1vdmUucGllY2U7ICAvLyB0byB1bmRvIGFueSBwcm9tb3Rpb25zXG4gICAgYm9hcmRbbW92ZS50b10gPSBudWxsO1xuXG4gICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkNBUFRVUkUpIHtcbiAgICAgIGJvYXJkW21vdmUudG9dID0ge3R5cGU6IG1vdmUuY2FwdHVyZWQsIGNvbG9yOiB0aGVtfTtcbiAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLkVQX0NBUFRVUkUpIHtcbiAgICAgIHZhciBpbmRleDtcbiAgICAgIGlmICh1cyA9PT0gQkxBQ0spIHtcbiAgICAgICAgaW5kZXggPSBtb3ZlLnRvIC0gMTY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IG1vdmUudG8gKyAxNjtcbiAgICAgIH1cbiAgICAgIGJvYXJkW2luZGV4XSA9IHt0eXBlOiBQQVdOLCBjb2xvcjogdGhlbX07XG4gICAgfVxuXG5cbiAgICBpZiAobW92ZS5mbGFncyAmIChCSVRTLktTSURFX0NBU1RMRSB8IEJJVFMuUVNJREVfQ0FTVExFKSkge1xuICAgICAgdmFyIGNhc3RsaW5nX3RvLCBjYXN0bGluZ19mcm9tO1xuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICBjYXN0bGluZ190byA9IG1vdmUudG8gKyAxO1xuICAgICAgICBjYXN0bGluZ19mcm9tID0gbW92ZS50byAtIDE7XG4gICAgICB9IGVsc2UgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICBjYXN0bGluZ190byA9IG1vdmUudG8gLSAyO1xuICAgICAgICBjYXN0bGluZ19mcm9tID0gbW92ZS50byArIDE7XG4gICAgICB9XG5cbiAgICAgIGJvYXJkW2Nhc3RsaW5nX3RvXSA9IGJvYXJkW2Nhc3RsaW5nX2Zyb21dO1xuICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbV0gPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBtb3ZlO1xuICB9XG5cbiAgLyogdGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGFtYmlndW91cyBtb3ZlcyAqL1xuICBmdW5jdGlvbiBnZXRfZGlzYW1iaWd1YXRvcihtb3ZlLCBzbG9wcHkpIHtcbiAgICB2YXIgbW92ZXMgPSBnZW5lcmF0ZV9tb3Zlcyh7bGVnYWw6ICFzbG9wcHl9KTtcblxuICAgIHZhciBmcm9tID0gbW92ZS5mcm9tO1xuICAgIHZhciB0byA9IG1vdmUudG87XG4gICAgdmFyIHBpZWNlID0gbW92ZS5waWVjZTtcblxuICAgIHZhciBhbWJpZ3VpdGllcyA9IDA7XG4gICAgdmFyIHNhbWVfcmFuayA9IDA7XG4gICAgdmFyIHNhbWVfZmlsZSA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBhbWJpZ19mcm9tID0gbW92ZXNbaV0uZnJvbTtcbiAgICAgIHZhciBhbWJpZ190byA9IG1vdmVzW2ldLnRvO1xuICAgICAgdmFyIGFtYmlnX3BpZWNlID0gbW92ZXNbaV0ucGllY2U7XG5cbiAgICAgIC8qIGlmIGEgbW92ZSBvZiB0aGUgc2FtZSBwaWVjZSB0eXBlIGVuZHMgb24gdGhlIHNhbWUgdG8gc3F1YXJlLCB3ZSdsbFxuICAgICAgICogbmVlZCB0byBhZGQgYSBkaXNhbWJpZ3VhdG9yIHRvIHRoZSBhbGdlYnJhaWMgbm90YXRpb25cbiAgICAgICAqL1xuICAgICAgaWYgKHBpZWNlID09PSBhbWJpZ19waWVjZSAmJiBmcm9tICE9PSBhbWJpZ19mcm9tICYmIHRvID09PSBhbWJpZ190bykge1xuICAgICAgICBhbWJpZ3VpdGllcysrO1xuXG4gICAgICAgIGlmIChyYW5rKGZyb20pID09PSByYW5rKGFtYmlnX2Zyb20pKSB7XG4gICAgICAgICAgc2FtZV9yYW5rKys7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZShmcm9tKSA9PT0gZmlsZShhbWJpZ19mcm9tKSkge1xuICAgICAgICAgIHNhbWVfZmlsZSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFtYmlndWl0aWVzID4gMCkge1xuICAgICAgLyogaWYgdGhlcmUgZXhpc3RzIGEgc2ltaWxhciBtb3ZpbmcgcGllY2Ugb24gdGhlIHNhbWUgcmFuayBhbmQgZmlsZSBhc1xuICAgICAgICogdGhlIG1vdmUgaW4gcXVlc3Rpb24sIHVzZSB0aGUgc3F1YXJlIGFzIHRoZSBkaXNhbWJpZ3VhdG9yXG4gICAgICAgKi9cbiAgICAgIGlmIChzYW1lX3JhbmsgPiAwICYmIHNhbWVfZmlsZSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKTtcbiAgICAgIH1cbiAgICAgIC8qIGlmIHRoZSBtb3ZpbmcgcGllY2UgcmVzdHMgb24gdGhlIHNhbWUgZmlsZSwgdXNlIHRoZSByYW5rIHN5bWJvbCBhcyB0aGVcbiAgICAgICAqIGRpc2FtYmlndWF0b3JcbiAgICAgICAqL1xuICAgICAgZWxzZSBpZiAoc2FtZV9maWxlID4gMCkge1xuICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pLmNoYXJBdCgxKTtcbiAgICAgIH1cbiAgICAgIC8qIGVsc2UgdXNlIHRoZSBmaWxlIHN5bWJvbCAqL1xuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSkuY2hhckF0KDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzY2lpKCkge1xuICAgIHZhciBzID0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJztcbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgIC8qIGRpc3BsYXkgdGhlIHJhbmsgKi9cbiAgICAgIGlmIChmaWxlKGkpID09PSAwKSB7XG4gICAgICAgIHMgKz0gJyAnICsgJzg3NjU0MzIxJ1tyYW5rKGkpXSArICcgfCc7XG4gICAgICB9XG5cbiAgICAgIC8qIGVtcHR5IHBpZWNlICovXG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCkge1xuICAgICAgICBzICs9ICcgLiAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHBpZWNlID0gYm9hcmRbaV0udHlwZTtcbiAgICAgICAgdmFyIGNvbG9yID0gYm9hcmRbaV0uY29sb3I7XG4gICAgICAgIHZhciBzeW1ib2wgPSAoY29sb3IgPT09IFdISVRFKSA/XG4gICAgICAgICAgICAgICAgICAgICBwaWVjZS50b1VwcGVyQ2FzZSgpIDogcGllY2UudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcyArPSAnICcgKyBzeW1ib2wgKyAnICc7XG4gICAgICB9XG5cbiAgICAgIGlmICgoaSArIDEpICYgMHg4OCkge1xuICAgICAgICBzICs9ICd8XFxuJztcbiAgICAgICAgaSArPSA4O1xuICAgICAgfVxuICAgIH1cbiAgICBzICs9ICcgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xcbic7XG4gICAgcyArPSAnICAgICBhICBiICBjICBkICBlICBmICBnICBoXFxuJztcblxuICAgIHJldHVybiBzO1xuICB9XG5cbiAgLy8gY29udmVydCBhIG1vdmUgZnJvbSBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb24gKFNBTikgdG8gMHg4OCBjb29yZGluYXRlc1xuICBmdW5jdGlvbiBtb3ZlX2Zyb21fc2FuKG1vdmUsIHNsb3BweSkge1xuICAgIC8vIHN0cmlwIG9mZiBhbnkgbW92ZSBkZWNvcmF0aW9uczogZS5nIE5mMys/IVxuICAgIHZhciBjbGVhbl9tb3ZlID0gc3RyaXBwZWRfc2FuKG1vdmUpO1xuXG4gICAgLy8gaWYgd2UncmUgdXNpbmcgdGhlIHNsb3BweSBwYXJzZXIgcnVuIGEgcmVnZXggdG8gZ3JhYiBwaWVjZSwgdG8sIGFuZCBmcm9tXG4gICAgLy8gdGhpcyBzaG91bGQgcGFyc2UgaW52YWxpZCBTQU4gbGlrZTogUGUyLWU0LCBSYzFjNCwgUWYzeGY3XG4gICAgaWYgKHNsb3BweSkge1xuICAgICAgdmFyIG1hdGNoZXMgPSBjbGVhbl9tb3ZlLm1hdGNoKC8oW3BuYnJxa1BOQlJRS10pPyhbYS1oXVsxLThdKXg/LT8oW2EtaF1bMS04XSkoW3FyYm5RUkJOXSk/Lyk7XG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICB2YXIgcGllY2UgPSBtYXRjaGVzWzFdO1xuICAgICAgICB2YXIgZnJvbSA9IG1hdGNoZXNbMl07XG4gICAgICAgIHZhciB0byA9IG1hdGNoZXNbM107XG4gICAgICAgIHZhciBwcm9tb3Rpb24gPSBtYXRjaGVzWzRdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAvLyB0cnkgdGhlIHN0cmljdCBwYXJzZXIgZmlyc3QsIHRoZW4gdGhlIHNsb3BweSBwYXJzZXIgaWYgcmVxdWVzdGVkXG4gICAgICAvLyBieSB0aGUgdXNlclxuICAgICAgaWYgKChjbGVhbl9tb3ZlID09PSBzdHJpcHBlZF9zYW4obW92ZV90b19zYW4obW92ZXNbaV0pKSkgfHxcbiAgICAgICAgICAoc2xvcHB5ICYmIGNsZWFuX21vdmUgPT09IHN0cmlwcGVkX3Nhbihtb3ZlX3RvX3Nhbihtb3Zlc1tpXSwgdHJ1ZSkpKSkge1xuICAgICAgICByZXR1cm4gbW92ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWF0Y2hlcyAmJlxuICAgICAgICAgICAgKCFwaWVjZSB8fCBwaWVjZS50b0xvd2VyQ2FzZSgpID09IG1vdmVzW2ldLnBpZWNlKSAmJlxuICAgICAgICAgICAgU1FVQVJFU1tmcm9tXSA9PSBtb3Zlc1tpXS5mcm9tICYmXG4gICAgICAgICAgICBTUVVBUkVTW3RvXSA9PSBtb3Zlc1tpXS50byAmJlxuICAgICAgICAgICAgKCFwcm9tb3Rpb24gfHwgcHJvbW90aW9uLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucHJvbW90aW9uKSkge1xuICAgICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICogVVRJTElUWSBGVU5DVElPTlNcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZ1bmN0aW9uIHJhbmsoaSkge1xuICAgIHJldHVybiBpID4+IDQ7XG4gIH1cblxuICBmdW5jdGlvbiBmaWxlKGkpIHtcbiAgICByZXR1cm4gaSAmIDE1O1xuICB9XG5cbiAgZnVuY3Rpb24gYWxnZWJyYWljKGkpe1xuICAgIHZhciBmID0gZmlsZShpKSwgciA9IHJhbmsoaSk7XG4gICAgcmV0dXJuICdhYmNkZWZnaCcuc3Vic3RyaW5nKGYsZisxKSArICc4NzY1NDMyMScuc3Vic3RyaW5nKHIscisxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN3YXBfY29sb3IoYykge1xuICAgIHJldHVybiBjID09PSBXSElURSA/IEJMQUNLIDogV0hJVEU7XG4gIH1cblxuICBmdW5jdGlvbiBpc19kaWdpdChjKSB7XG4gICAgcmV0dXJuICcwMTIzNDU2Nzg5Jy5pbmRleE9mKGMpICE9PSAtMTtcbiAgfVxuXG4gIC8qIHByZXR0eSA9IGV4dGVybmFsIG1vdmUgb2JqZWN0ICovXG4gIGZ1bmN0aW9uIG1ha2VfcHJldHR5KHVnbHlfbW92ZSkge1xuICAgIHZhciBtb3ZlID0gY2xvbmUodWdseV9tb3ZlKTtcbiAgICBtb3ZlLnNhbiA9IG1vdmVfdG9fc2FuKG1vdmUsIGZhbHNlKTtcbiAgICBtb3ZlLnRvID0gYWxnZWJyYWljKG1vdmUudG8pO1xuICAgIG1vdmUuZnJvbSA9IGFsZ2VicmFpYyhtb3ZlLmZyb20pO1xuXG4gICAgdmFyIGZsYWdzID0gJyc7XG5cbiAgICBmb3IgKHZhciBmbGFnIGluIEJJVFMpIHtcbiAgICAgIGlmIChCSVRTW2ZsYWddICYgbW92ZS5mbGFncykge1xuICAgICAgICBmbGFncyArPSBGTEFHU1tmbGFnXTtcbiAgICAgIH1cbiAgICB9XG4gICAgbW92ZS5mbGFncyA9IGZsYWdzO1xuXG4gICAgcmV0dXJuIG1vdmU7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICB2YXIgZHVwZSA9IChvYmogaW5zdGFuY2VvZiBBcnJheSkgPyBbXSA6IHt9O1xuXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IGNsb25lKG9ialtwcm9wZXJ0eV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHVwZVtwcm9wZXJ0eV0gPSBvYmpbcHJvcGVydHldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkdXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBERUJVR0dJTkcgVVRJTElUSUVTXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICBmdW5jdGlvbiBwZXJmdChkZXB0aCkge1xuICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKHtsZWdhbDogZmFsc2V9KTtcbiAgICB2YXIgbm9kZXMgPSAwO1xuICAgIHZhciBjb2xvciA9IHR1cm47XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1ha2VfbW92ZShtb3Zlc1tpXSk7XG4gICAgICBpZiAoIWtpbmdfYXR0YWNrZWQoY29sb3IpKSB7XG4gICAgICAgIGlmIChkZXB0aCAtIDEgPiAwKSB7XG4gICAgICAgICAgdmFyIGNoaWxkX25vZGVzID0gcGVyZnQoZGVwdGggLSAxKTtcbiAgICAgICAgICBub2RlcyArPSBjaGlsZF9ub2RlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlcysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB1bmRvX21vdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBQVUJMSUMgQ09OU1RBTlRTIChpcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz8pXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIFdISVRFOiBXSElURSxcbiAgICBCTEFDSzogQkxBQ0ssXG4gICAgUEFXTjogUEFXTixcbiAgICBLTklHSFQ6IEtOSUdIVCxcbiAgICBCSVNIT1A6IEJJU0hPUCxcbiAgICBST09LOiBST09LLFxuICAgIFFVRUVOOiBRVUVFTixcbiAgICBLSU5HOiBLSU5HLFxuICAgIFNRVUFSRVM6IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvKiBmcm9tIHRoZSBFQ01BLTI2MiBzcGVjIChzZWN0aW9uIDEyLjYuNCk6XG4gICAgICAgICAgICAgICAgICogXCJUaGUgbWVjaGFuaWNzIG9mIGVudW1lcmF0aW5nIHRoZSBwcm9wZXJ0aWVzIC4uLiBpc1xuICAgICAgICAgICAgICAgICAqIGltcGxlbWVudGF0aW9uIGRlcGVuZGVudFwiXG4gICAgICAgICAgICAgICAgICogc286IGZvciAodmFyIHNxIGluIFNRVUFSRVMpIHsga2V5cy5wdXNoKHNxKTsgfSBtaWdodCBub3QgYmVcbiAgICAgICAgICAgICAgICAgKiBvcmRlcmVkIGNvcnJlY3RseVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoaSAmIDB4ODgpIHsgaSArPSA3OyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGFsZ2VicmFpYyhpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICAgICAgICB9KSgpLFxuICAgIEZMQUdTOiBGTEFHUyxcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBQVUJMSUMgQVBJXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIGxvYWQ6IGZ1bmN0aW9uKGZlbikge1xuICAgICAgcmV0dXJuIGxvYWQoZmVuKTtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgfSxcblxuICAgIG1vdmVzOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKiBUaGUgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgYSBjaGVzcyBtb3ZlIGlzIGluIDB4ODggZm9ybWF0LCBhbmRcbiAgICAgICAqIG5vdCBtZWFudCB0byBiZSBodW1hbi1yZWFkYWJsZS4gIFRoZSBjb2RlIGJlbG93IGNvbnZlcnRzIHRoZSAweDg4XG4gICAgICAgKiBzcXVhcmUgY29vcmRpbmF0ZXMgdG8gYWxnZWJyYWljIGNvb3JkaW5hdGVzLiAgSXQgYWxzbyBwcnVuZXMgYW5cbiAgICAgICAqIHVubmVjZXNzYXJ5IG1vdmUga2V5cyByZXN1bHRpbmcgZnJvbSBhIHZlcmJvc2UgY2FsbC5cbiAgICAgICAqL1xuXG4gICAgICB2YXIgdWdseV9tb3ZlcyA9IGdlbmVyYXRlX21vdmVzKG9wdGlvbnMpO1xuICAgICAgdmFyIG1vdmVzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB1Z2x5X21vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgLyogZG9lcyB0aGUgdXNlciB3YW50IGEgZnVsbCBtb3ZlIG9iamVjdCAobW9zdCBsaWtlbHkgbm90KSwgb3IganVzdFxuICAgICAgICAgKiBTQU5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3ZlcmJvc2UnIGluIG9wdGlvbnMgJiZcbiAgICAgICAgICAgIG9wdGlvbnMudmVyYm9zZSkge1xuICAgICAgICAgIG1vdmVzLnB1c2gobWFrZV9wcmV0dHkodWdseV9tb3Zlc1tpXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vdmVzLnB1c2gobW92ZV90b19zYW4odWdseV9tb3Zlc1tpXSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfSxcblxuICAgIGluX2NoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl9jaGVjaygpO1xuICAgIH0sXG5cbiAgICBpbl9jaGVja21hdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluX2NoZWNrbWF0ZSgpO1xuICAgIH0sXG5cbiAgICBpbl9zdGFsZW1hdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluX3N0YWxlbWF0ZSgpO1xuICAgIH0sXG5cbiAgICBpbl9kcmF3OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBoYWxmX21vdmVzID49IDEwMCB8fFxuICAgICAgICAgICAgIGluX3N0YWxlbWF0ZSgpIHx8XG4gICAgICAgICAgICAgaW5zdWZmaWNpZW50X21hdGVyaWFsKCkgfHxcbiAgICAgICAgICAgICBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpO1xuICAgIH0sXG5cbiAgICBpbnN1ZmZpY2llbnRfbWF0ZXJpYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluc3VmZmljaWVudF9tYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKTtcbiAgICB9LFxuXG4gICAgZ2FtZV9vdmVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBoYWxmX21vdmVzID49IDEwMCB8fFxuICAgICAgICAgICAgIGluX2NoZWNrbWF0ZSgpIHx8XG4gICAgICAgICAgICAgaW5fc3RhbGVtYXRlKCkgfHxcbiAgICAgICAgICAgICBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKSB8fFxuICAgICAgICAgICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKCk7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlX2ZlbjogZnVuY3Rpb24oZmVuKSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGVfZmVuKGZlbik7XG4gICAgfSxcblxuICAgIGZlbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZ2VuZXJhdGVfZmVuKCk7XG4gICAgfSxcblxuICAgIHBnbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyogdXNpbmcgdGhlIHNwZWNpZmljYXRpb24gZnJvbSBodHRwOi8vd3d3LmNoZXNzY2x1Yi5jb20vaGVscC9QR04tc3BlY1xuICAgICAgICogZXhhbXBsZSBmb3IgaHRtbCB1c2FnZTogLnBnbih7IG1heF93aWR0aDogNzIsIG5ld2xpbmVfY2hhcjogXCI8YnIgLz5cIiB9KVxuICAgICAgICovXG4gICAgICB2YXIgbmV3bGluZSA9ICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLm5ld2xpbmVfY2hhciA9PT0gJ3N0cmluZycpID9cbiAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubmV3bGluZV9jaGFyIDogJ1xcbic7XG4gICAgICB2YXIgbWF4X3dpZHRoID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5tYXhfd2lkdGggPT09ICdudW1iZXInKSA/XG4gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubWF4X3dpZHRoIDogMDtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIHZhciBoZWFkZXJfZXhpc3RzID0gZmFsc2U7XG5cbiAgICAgIC8qIGFkZCB0aGUgUEdOIGhlYWRlciBoZWFkZXJybWF0aW9uICovXG4gICAgICBmb3IgKHZhciBpIGluIGhlYWRlcikge1xuICAgICAgICAvKiBUT0RPOiBvcmRlciBvZiBlbnVtZXJhdGVkIHByb3BlcnRpZXMgaW4gaGVhZGVyIG9iamVjdCBpcyBub3RcbiAgICAgICAgICogZ3VhcmFudGVlZCwgc2VlIEVDTUEtMjYyIHNwZWMgKHNlY3Rpb24gMTIuNi40KVxuICAgICAgICAgKi9cbiAgICAgICAgcmVzdWx0LnB1c2goJ1snICsgaSArICcgXFxcIicgKyBoZWFkZXJbaV0gKyAnXFxcIl0nICsgbmV3bGluZSk7XG4gICAgICAgIGhlYWRlcl9leGlzdHMgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGVhZGVyX2V4aXN0cyAmJiBoaXN0b3J5Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHQucHVzaChuZXdsaW5lKTtcbiAgICAgIH1cblxuICAgICAgLyogcG9wIGFsbCBvZiBoaXN0b3J5IG9udG8gcmV2ZXJzZWRfaGlzdG9yeSAqL1xuICAgICAgdmFyIHJldmVyc2VkX2hpc3RvcnkgPSBbXTtcbiAgICAgIHdoaWxlIChoaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV2ZXJzZWRfaGlzdG9yeS5wdXNoKHVuZG9fbW92ZSgpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1vdmVzID0gW107XG4gICAgICB2YXIgbW92ZV9zdHJpbmcgPSAnJztcblxuICAgICAgLyogYnVpbGQgdGhlIGxpc3Qgb2YgbW92ZXMuICBhIG1vdmVfc3RyaW5nIGxvb2tzIGxpa2U6IFwiMy4gZTMgZTZcIiAqL1xuICAgICAgd2hpbGUgKHJldmVyc2VkX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbW92ZSA9IHJldmVyc2VkX2hpc3RvcnkucG9wKCk7XG5cbiAgICAgICAgLyogaWYgdGhlIHBvc2l0aW9uIHN0YXJ0ZWQgd2l0aCBibGFjayB0byBtb3ZlLCBzdGFydCBQR04gd2l0aCAxLiAuLi4gKi9cbiAgICAgICAgaWYgKCFoaXN0b3J5Lmxlbmd0aCAmJiBtb3ZlLmNvbG9yID09PSAnYicpIHtcbiAgICAgICAgICBtb3ZlX3N0cmluZyA9IG1vdmVfbnVtYmVyICsgJy4gLi4uJztcbiAgICAgICAgfSBlbHNlIGlmIChtb3ZlLmNvbG9yID09PSAndycpIHtcbiAgICAgICAgICAvKiBzdG9yZSB0aGUgcHJldmlvdXMgZ2VuZXJhdGVkIG1vdmVfc3RyaW5nIGlmIHdlIGhhdmUgb25lICovXG4gICAgICAgICAgaWYgKG1vdmVfc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgbW92ZXMucHVzaChtb3ZlX3N0cmluZyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVfc3RyaW5nID0gbW92ZV9udW1iZXIgKyAnLic7XG4gICAgICAgIH1cblxuICAgICAgICBtb3ZlX3N0cmluZyA9IG1vdmVfc3RyaW5nICsgJyAnICsgbW92ZV90b19zYW4obW92ZSwgZmFsc2UpO1xuICAgICAgICBtYWtlX21vdmUobW92ZSk7XG4gICAgICB9XG5cbiAgICAgIC8qIGFyZSB0aGVyZSBhbnkgb3RoZXIgbGVmdG92ZXIgbW92ZXM/ICovXG4gICAgICBpZiAobW92ZV9zdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIG1vdmVzLnB1c2gobW92ZV9zdHJpbmcpO1xuICAgICAgfVxuXG4gICAgICAvKiBpcyB0aGVyZSBhIHJlc3VsdD8gKi9cbiAgICAgIGlmICh0eXBlb2YgaGVhZGVyLlJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW92ZXMucHVzaChoZWFkZXIuUmVzdWx0KTtcbiAgICAgIH1cblxuICAgICAgLyogaGlzdG9yeSBzaG91bGQgYmUgYmFjayB0byB3aGF0IGlzIHdhcyBiZWZvcmUgd2Ugc3RhcnRlZCBnZW5lcmF0aW5nIFBHTixcbiAgICAgICAqIHNvIGpvaW4gdG9nZXRoZXIgbW92ZXNcbiAgICAgICAqL1xuICAgICAgaWYgKG1heF93aWR0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpICsgbW92ZXMuam9pbignICcpO1xuICAgICAgfVxuXG4gICAgICAvKiB3cmFwIHRoZSBQR04gb3V0cHV0IGF0IG1heF93aWR0aCAqL1xuICAgICAgdmFyIGN1cnJlbnRfd2lkdGggPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvKiBpZiB0aGUgY3VycmVudCBtb3ZlIHdpbGwgcHVzaCBwYXN0IG1heF93aWR0aCAqL1xuICAgICAgICBpZiAoY3VycmVudF93aWR0aCArIG1vdmVzW2ldLmxlbmd0aCA+IG1heF93aWR0aCAmJiBpICE9PSAwKSB7XG5cbiAgICAgICAgICAvKiBkb24ndCBlbmQgdGhlIGxpbmUgd2l0aCB3aGl0ZXNwYWNlICovXG4gICAgICAgICAgaWYgKHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgcmVzdWx0LnBvcCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpO1xuICAgICAgICAgIGN1cnJlbnRfd2lkdGggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGkgIT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaCgnICcpO1xuICAgICAgICAgIGN1cnJlbnRfd2lkdGgrKztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaChtb3Zlc1tpXSk7XG4gICAgICAgIGN1cnJlbnRfd2lkdGggKz0gbW92ZXNbaV0ubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICBsb2FkX3BnbjogZnVuY3Rpb24ocGduLCBvcHRpb25zKSB7XG4gICAgICAvLyBhbGxvdyB0aGUgdXNlciB0byBzcGVjaWZ5IHRoZSBzbG9wcHkgbW92ZSBwYXJzZXIgdG8gd29yayBhcm91bmQgb3ZlclxuICAgICAgLy8gZGlzYW1iaWd1YXRpb24gYnVncyBpbiBGcml0eiBhbmQgQ2hlc3NiYXNlXG4gICAgICB2YXIgc2xvcHB5ID0gKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAnc2xvcHB5JyBpbiBvcHRpb25zKSA/XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2xvcHB5IDogZmFsc2U7XG5cbiAgICAgIGZ1bmN0aW9uIG1hc2soc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXC9nLCAnXFxcXCcpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNfa2V5cyhvYmplY3QpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGFyc2VfcGduX2hlYWRlcihoZWFkZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG5ld2xpbmVfY2hhciA9ICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5uZXdsaW5lX2NoYXIgOiAnXFxyP1xcbic7XG4gICAgICAgIHZhciBoZWFkZXJfb2JqID0ge307XG4gICAgICAgIHZhciBoZWFkZXJzID0gaGVhZGVyLnNwbGl0KG5ldyBSZWdFeHAobWFzayhuZXdsaW5lX2NoYXIpKSk7XG4gICAgICAgIHZhciBrZXkgPSAnJztcbiAgICAgICAgdmFyIHZhbHVlID0gJyc7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAga2V5ID0gaGVhZGVyc1tpXS5yZXBsYWNlKC9eXFxbKFtBLVpdW0EtWmEtel0qKVxccy4qXFxdJC8sICckMScpO1xuICAgICAgICAgIHZhbHVlID0gaGVhZGVyc1tpXS5yZXBsYWNlKC9eXFxbW0EtWmEtel0rXFxzXCIoLiopXCJcXF0kLywgJyQxJyk7XG4gICAgICAgICAgaWYgKHRyaW0oa2V5KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBoZWFkZXJfb2JqW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVhZGVyX29iajtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld2xpbmVfY2hhciA9ICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbnMubmV3bGluZV9jaGFyID09PSAnc3RyaW5nJykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5ld2xpbmVfY2hhciA6ICdcXHI/XFxuJztcbiAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ14oXFxcXFsoLnwnICsgbWFzayhuZXdsaW5lX2NoYXIpICsgJykqXFxcXF0pJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoJyArIG1hc2sobmV3bGluZV9jaGFyKSArICcpKicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnMS4oJyArIG1hc2sobmV3bGluZV9jaGFyKSArICd8LikqJCcsICdnJyk7XG5cbiAgICAgIC8qIGdldCBoZWFkZXIgcGFydCBvZiB0aGUgUEdOIGZpbGUgKi9cbiAgICAgIHZhciBoZWFkZXJfc3RyaW5nID0gcGduLnJlcGxhY2UocmVnZXgsICckMScpO1xuXG4gICAgICAvKiBubyBpbmZvIHBhcnQgZ2l2ZW4sIGJlZ2lucyB3aXRoIG1vdmVzICovXG4gICAgICBpZiAoaGVhZGVyX3N0cmluZ1swXSAhPT0gJ1snKSB7XG4gICAgICAgIGhlYWRlcl9zdHJpbmcgPSAnJztcbiAgICAgIH1cblxuICAgICAgcmVzZXQoKTtcblxuICAgICAgLyogcGFyc2UgUEdOIGhlYWRlciAqL1xuICAgICAgdmFyIGhlYWRlcnMgPSBwYXJzZV9wZ25faGVhZGVyKGhlYWRlcl9zdHJpbmcsIG9wdGlvbnMpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGhlYWRlcnMpIHtcbiAgICAgICAgc2V0X2hlYWRlcihba2V5LCBoZWFkZXJzW2tleV1dKTtcbiAgICAgIH1cblxuICAgICAgLyogbG9hZCB0aGUgc3RhcnRpbmcgcG9zaXRpb24gaW5kaWNhdGVkIGJ5IFtTZXR1cCAnMSddIGFuZFxuICAgICAgKiBbRkVOIHBvc2l0aW9uXSAqL1xuICAgICAgaWYgKGhlYWRlcnNbJ1NldFVwJ10gPT09ICcxJykge1xuICAgICAgICAgIGlmICghKCgnRkVOJyBpbiBoZWFkZXJzKSAmJiBsb2FkKGhlYWRlcnNbJ0ZFTiddKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIGRlbGV0ZSBoZWFkZXIgdG8gZ2V0IHRoZSBtb3ZlcyAqL1xuICAgICAgdmFyIG1zID0gcGduLnJlcGxhY2UoaGVhZGVyX3N0cmluZywgJycpLnJlcGxhY2UobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVfY2hhciksICdnJyksICcgJyk7XG5cbiAgICAgIC8qIGRlbGV0ZSBjb21tZW50cyAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC8oXFx7W159XStcXH0pKz8vZywgJycpO1xuXG4gICAgICAvKiBkZWxldGUgcmVjdXJzaXZlIGFubm90YXRpb24gdmFyaWF0aW9ucyAqL1xuICAgICAgdmFyIHJhdl9yZWdleCA9IC8oXFwoW15cXChcXCldK1xcKSkrPy9nXG4gICAgICB3aGlsZSAocmF2X3JlZ2V4LnRlc3QobXMpKSB7XG4gICAgICAgIG1zID0gbXMucmVwbGFjZShyYXZfcmVnZXgsICcnKTtcbiAgICAgIH1cblxuICAgICAgLyogZGVsZXRlIG1vdmUgbnVtYmVycyAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXGQrXFwuKFxcLlxcLik/L2csICcnKTtcblxuICAgICAgLyogZGVsZXRlIC4uLiBpbmRpY2F0aW5nIGJsYWNrIHRvIG1vdmUgKi9cbiAgICAgIG1zID0gbXMucmVwbGFjZSgvXFwuXFwuXFwuL2csICcnKTtcblxuICAgICAgLyogZGVsZXRlIG51bWVyaWMgYW5ub3RhdGlvbiBnbHlwaHMgKi9cbiAgICAgIG1zID0gbXMucmVwbGFjZSgvXFwkXFxkKy9nLCAnJyk7XG5cbiAgICAgIC8qIHRyaW0gYW5kIGdldCBhcnJheSBvZiBtb3ZlcyAqL1xuICAgICAgdmFyIG1vdmVzID0gdHJpbShtcykuc3BsaXQobmV3IFJlZ0V4cCgvXFxzKy8pKTtcblxuICAgICAgLyogZGVsZXRlIGVtcHR5IGVudHJpZXMgKi9cbiAgICAgIG1vdmVzID0gbW92ZXMuam9pbignLCcpLnJlcGxhY2UoLywsKy9nLCAnLCcpLnNwbGl0KCcsJyk7XG4gICAgICB2YXIgbW92ZSA9ICcnO1xuXG4gICAgICBmb3IgKHZhciBoYWxmX21vdmUgPSAwOyBoYWxmX21vdmUgPCBtb3Zlcy5sZW5ndGggLSAxOyBoYWxmX21vdmUrKykge1xuICAgICAgICBtb3ZlID0gbW92ZV9mcm9tX3Nhbihtb3Zlc1toYWxmX21vdmVdLCBzbG9wcHkpO1xuXG4gICAgICAgIC8qIG1vdmUgbm90IHBvc3NpYmxlISAoZG9uJ3QgY2xlYXIgdGhlIGJvYXJkIHRvIGV4YW1pbmUgdG8gc2hvdyB0aGVcbiAgICAgICAgICogbGF0ZXN0IHZhbGlkIHBvc2l0aW9uKVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1vdmUgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYWtlX21vdmUobW92ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogZXhhbWluZSBsYXN0IG1vdmUgKi9cbiAgICAgIG1vdmUgPSBtb3Zlc1ttb3Zlcy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChQT1NTSUJMRV9SRVNVTFRTLmluZGV4T2YobW92ZSkgPiAtMSkge1xuICAgICAgICBpZiAoaGFzX2tleXMoaGVhZGVyKSAmJiB0eXBlb2YgaGVhZGVyLlJlc3VsdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzZXRfaGVhZGVyKFsnUmVzdWx0JywgbW92ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbW92ZSA9IG1vdmVfZnJvbV9zYW4obW92ZSwgc2xvcHB5KTtcbiAgICAgICAgaWYgKG1vdmUgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYWtlX21vdmUobW92ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBoZWFkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNldF9oZWFkZXIoYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgYXNjaWk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGFzY2lpKCk7XG4gICAgfSxcblxuICAgIHR1cm46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHR1cm47XG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uKG1vdmUsIG9wdGlvbnMpIHtcbiAgICAgIC8qIFRoZSBtb3ZlIGZ1bmN0aW9uIGNhbiBiZSBjYWxsZWQgd2l0aCBpbiB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAgICAgKlxuICAgICAgICogLm1vdmUoJ054YjcnKSAgICAgIDwtIHdoZXJlICdtb3ZlJyBpcyBhIGNhc2Utc2Vuc2l0aXZlIFNBTiBzdHJpbmdcbiAgICAgICAqXG4gICAgICAgKiAubW92ZSh7IGZyb206ICdoNycsIDwtIHdoZXJlIHRoZSAnbW92ZScgaXMgYSBtb3ZlIG9iamVjdCAoYWRkaXRpb25hbFxuICAgICAgICogICAgICAgICB0byA6J2g4JywgICAgICBmaWVsZHMgYXJlIGlnbm9yZWQpXG4gICAgICAgKiAgICAgICAgIHByb21vdGlvbjogJ3EnLFxuICAgICAgICogICAgICB9KVxuICAgICAgICovXG5cbiAgICAgIC8vIGFsbG93IHRoZSB1c2VyIHRvIHNwZWNpZnkgdGhlIHNsb3BweSBtb3ZlIHBhcnNlciB0byB3b3JrIGFyb3VuZCBvdmVyXG4gICAgICAvLyBkaXNhbWJpZ3VhdGlvbiBidWdzIGluIEZyaXR6IGFuZCBDaGVzc2Jhc2VcbiAgICAgIHZhciBzbG9wcHkgPSAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzbG9wcHknIGluIG9wdGlvbnMpID9cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zbG9wcHkgOiBmYWxzZTtcblxuICAgICAgdmFyIG1vdmVfb2JqID0gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnc3RyaW5nJykge1xuICAgICAgICBtb3ZlX29iaiA9IG1vdmVfZnJvbV9zYW4obW92ZSwgc2xvcHB5KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vdmUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKCk7XG5cbiAgICAgICAgLyogY29udmVydCB0aGUgcHJldHR5IG1vdmUgb2JqZWN0IHRvIGFuIHVnbHkgbW92ZSBvYmplY3QgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKG1vdmUuZnJvbSA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLmZyb20pICYmXG4gICAgICAgICAgICAgIG1vdmUudG8gPT09IGFsZ2VicmFpYyhtb3Zlc1tpXS50bykgJiZcbiAgICAgICAgICAgICAgKCEoJ3Byb21vdGlvbicgaW4gbW92ZXNbaV0pIHx8XG4gICAgICAgICAgICAgIG1vdmUucHJvbW90aW9uID09PSBtb3Zlc1tpXS5wcm9tb3Rpb24pKSB7XG4gICAgICAgICAgICBtb3ZlX29iaiA9IG1vdmVzW2ldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIGZhaWxlZCB0byBmaW5kIG1vdmUgKi9cbiAgICAgIGlmICghbW92ZV9vYmopIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8qIG5lZWQgdG8gbWFrZSBhIGNvcHkgb2YgbW92ZSBiZWNhdXNlIHdlIGNhbid0IGdlbmVyYXRlIFNBTiBhZnRlciB0aGVcbiAgICAgICAqIG1vdmUgaXMgbWFkZVxuICAgICAgICovXG4gICAgICB2YXIgcHJldHR5X21vdmUgPSBtYWtlX3ByZXR0eShtb3ZlX29iaik7XG5cbiAgICAgIG1ha2VfbW92ZShtb3ZlX29iaik7XG5cbiAgICAgIHJldHVybiBwcmV0dHlfbW92ZTtcbiAgICB9LFxuXG4gICAgdW5kbzogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbW92ZSA9IHVuZG9fbW92ZSgpO1xuICAgICAgcmV0dXJuIChtb3ZlKSA/IG1ha2VfcHJldHR5KG1vdmUpIDogbnVsbDtcbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNsZWFyKCk7XG4gICAgfSxcblxuICAgIHB1dDogZnVuY3Rpb24ocGllY2UsIHNxdWFyZSkge1xuICAgICAgcmV0dXJuIHB1dChwaWVjZSwgc3F1YXJlKTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbihzcXVhcmUpIHtcbiAgICAgIHJldHVybiBnZXQoc3F1YXJlKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihzcXVhcmUpIHtcbiAgICAgIHJldHVybiByZW1vdmUoc3F1YXJlKTtcbiAgICB9LFxuXG4gICAgcGVyZnQ6IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgICByZXR1cm4gcGVyZnQoZGVwdGgpO1xuICAgIH0sXG5cbiAgICBzcXVhcmVfY29sb3I6IGZ1bmN0aW9uKHNxdWFyZSkge1xuICAgICAgaWYgKHNxdWFyZSBpbiBTUVVBUkVTKSB7XG4gICAgICAgIHZhciBzcV8weDg4ID0gU1FVQVJFU1tzcXVhcmVdO1xuICAgICAgICByZXR1cm4gKChyYW5rKHNxXzB4ODgpICsgZmlsZShzcV8weDg4KSkgJSAyID09PSAwKSA/ICdsaWdodCcgOiAnZGFyayc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBoaXN0b3J5OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgcmV2ZXJzZWRfaGlzdG9yeSA9IFtdO1xuICAgICAgdmFyIG1vdmVfaGlzdG9yeSA9IFtdO1xuICAgICAgdmFyIHZlcmJvc2UgPSAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICd2ZXJib3NlJyBpbiBvcHRpb25zICYmXG4gICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnZlcmJvc2UpO1xuXG4gICAgICB3aGlsZSAoaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldmVyc2VkX2hpc3RvcnkucHVzaCh1bmRvX21vdmUoKSk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChyZXZlcnNlZF9oaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIG1vdmUgPSByZXZlcnNlZF9oaXN0b3J5LnBvcCgpO1xuICAgICAgICBpZiAodmVyYm9zZSkge1xuICAgICAgICAgIG1vdmVfaGlzdG9yeS5wdXNoKG1ha2VfcHJldHR5KG1vdmUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb3ZlX2hpc3RvcnkucHVzaChtb3ZlX3RvX3Nhbihtb3ZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFrZV9tb3ZlKG1vdmUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbW92ZV9oaXN0b3J5O1xuICAgIH1cblxuICB9O1xufTtcblxuLyogZXhwb3J0IENoZXNzIG9iamVjdCBpZiB1c2luZyBub2RlIG9yIGFueSBvdGhlciBDb21tb25KUyBjb21wYXRpYmxlXG4gKiBlbnZpcm9ubWVudCAqL1xuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykgZXhwb3J0cy5DaGVzcyA9IENoZXNzO1xuLyogZXhwb3J0IENoZXNzIG9iamVjdCBmb3IgYW55IFJlcXVpcmVKUyBjb21wYXRpYmxlIGVudmlyb25tZW50ICovXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIGRlZmluZSggZnVuY3Rpb24gKCkgeyByZXR1cm4gQ2hlc3M7ICB9KTtcbiIsInZhciBDaGVzcyA9IHJlcXVpcmUoJ2NoZXNzLmpzJykuQ2hlc3M7XG52YXIgYyA9IHJlcXVpcmUoJy4vY2hlc3N1dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHB1enpsZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQocHV6emxlLmZlbik7XG4gICAgYWRkQ2hlY2tpbmdTcXVhcmVzKHB1enpsZS5mZW4sIHB1enpsZS5mZWF0dXJlcyk7XG4gICAgYWRkQ2hlY2tpbmdTcXVhcmVzKGMuZmVuRm9yT3RoZXJTaWRlKHB1enpsZS5mZW4pLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIHJldHVybiBwdXp6bGU7XG59O1xuXG5mdW5jdGlvbiBhZGRDaGVja2luZ1NxdWFyZXMoZmVuLCBmZWF0dXJlcykge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQoZmVuKTtcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciBtYXRlcyA9IG1vdmVzLmZpbHRlcihtb3ZlID0+IC9cXCMvLnRlc3QobW92ZS5zYW4pKTtcbiAgICB2YXIgY2hlY2tzID0gbW92ZXMuZmlsdGVyKG1vdmUgPT4gL1xcKy8udGVzdChtb3ZlLnNhbikpO1xuICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJDaGVja2luZyBzcXVhcmVzXCIsXG4gICAgICAgIHNpZGU6IGNoZXNzLnR1cm4oKSxcbiAgICAgICAgdGFyZ2V0czogY2hlY2tzLm1hcChtID0+IHRhcmdldEFuZERpYWdyYW0obS5mcm9tLCBtLnRvLCBjaGVja2luZ01vdmVzKGZlbiwgbSkpKVxuICAgIH0pO1xuXG4gICAgZmVhdHVyZXMucHVzaCh7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIk1hdGluZyBzcXVhcmVzXCIsXG4gICAgICAgIHNpZGU6IGNoZXNzLnR1cm4oKSxcbiAgICAgICAgdGFyZ2V0czogbWF0ZXMubWFwKG0gPT4gdGFyZ2V0QW5kRGlhZ3JhbShtLmZyb20sIG0udG8sIGNoZWNraW5nTW92ZXMoZmVuLCBtKSkpXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKG1hdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZmVhdHVyZXMuZm9yRWFjaChmID0+IHtcbiAgICAgICAgICAgIGlmIChmLmRlc2NyaXB0aW9uID09PSBcIk1hdGUtaW4tMSB0aHJlYXRzXCIpIHtcbiAgICAgICAgICAgICAgICBmLnRhcmdldHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjaGVja2luZ01vdmVzKGZlbiwgbW92ZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQoZmVuKTtcbiAgICBjaGVzcy5tb3ZlKG1vdmUpO1xuICAgIGNoZXNzLmxvYWQoYy5mZW5Gb3JPdGhlclNpZGUoY2hlc3MuZmVuKCkpKTtcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gbW92ZXMuZmlsdGVyKG0gPT4gbS5jYXB0dXJlZCAmJiBtLmNhcHR1cmVkLnRvTG93ZXJDYXNlKCkgPT09ICdrJyk7XG59XG5cblxuZnVuY3Rpb24gdGFyZ2V0QW5kRGlhZ3JhbShmcm9tLCB0bywgY2hlY2tzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiB0byxcbiAgICAgICAgZGlhZ3JhbTogW3tcbiAgICAgICAgICAgIG9yaWc6IGZyb20sXG4gICAgICAgICAgICBkZXN0OiB0byxcbiAgICAgICAgICAgIGJydXNoOiAncGFsZUJsdWUnXG4gICAgICAgIH1dLmNvbmNhdChjaGVja3MubWFwKG0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcmlnOiBtLmZyb20sXG4gICAgICAgICAgICAgICAgZGVzdDogbS50byxcbiAgICAgICAgICAgICAgICBicnVzaDogJ3JlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKVxuICAgIH07XG59XG4iLCIvKipcbiAqIENoZXNzIGV4dGVuc2lvbnNcbiAqL1xuXG52YXIgQ2hlc3MgPSByZXF1aXJlKCdjaGVzcy5qcycpLkNoZXNzO1xuXG52YXIgYWxsU3F1YXJlcyA9IFsnYTEnLCAnYTInLCAnYTMnLCAnYTQnLCAnYTUnLCAnYTYnLCAnYTcnLCAnYTgnLCAnYjEnLCAnYjInLCAnYjMnLCAnYjQnLCAnYjUnLCAnYjYnLCAnYjcnLCAnYjgnLCAnYzEnLCAnYzInLCAnYzMnLCAnYzQnLCAnYzUnLCAnYzYnLCAnYzcnLCAnYzgnLCAnZDEnLCAnZDInLCAnZDMnLCAnZDQnLCAnZDUnLCAnZDYnLCAnZDcnLCAnZDgnLCAnZTEnLCAnZTInLCAnZTMnLCAnZTQnLCAnZTUnLCAnZTYnLCAnZTcnLCAnZTgnLCAnZjEnLCAnZjInLCAnZjMnLCAnZjQnLCAnZjUnLCAnZjYnLCAnZjcnLCAnZjgnLCAnZzEnLCAnZzInLCAnZzMnLCAnZzQnLCAnZzUnLCAnZzYnLCAnZzcnLCAnZzgnLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaDcnLCAnaDgnXTtcblxuLyoqXG4gKiBQbGFjZSBraW5nIGF0IHNxdWFyZSBhbmQgZmluZCBvdXQgaWYgaXQgaXMgaW4gY2hlY2suXG4gKi9cbmZ1bmN0aW9uIGlzQ2hlY2tBZnRlclBsYWNpbmdLaW5nQXRTcXVhcmUoZmVuLCBraW5nLCBzcXVhcmUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoZmVuKTtcbiAgICBjaGVzcy5yZW1vdmUoc3F1YXJlKTtcbiAgICBjaGVzcy5yZW1vdmUoa2luZyk7XG4gICAgY2hlc3MucHV0KHtcbiAgICAgICAgdHlwZTogJ2snLFxuICAgICAgICBjb2xvcjogY2hlc3MudHVybigpXG4gICAgfSwgc3F1YXJlKTtcbiAgICByZXR1cm4gY2hlc3MuaW5fY2hlY2soKTtcbn1cblxuZnVuY3Rpb24gaXNDaGVja0FmdGVyUmVtb3ZpbmdQaWVjZUF0U3F1YXJlKGZlbiwgc3F1YXJlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG4gICAgY2hlc3MucmVtb3ZlKHNxdWFyZSk7XG4gICAgcmV0dXJuIGNoZXNzLmluX2NoZWNrKCk7XG59XG5cbmZ1bmN0aW9uIG1vdmVzVGhhdFJlc3VsdEluQ2FwdHVyZVRocmVhdChmZW4sIGZyb20sIHRvKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG4gICAgdmFyIG1vdmVzID0gY2hlc3MubW92ZXMoe1xuICAgICAgICB2ZXJib3NlOiB0cnVlXG4gICAgfSk7XG4gICAgdmFyIHNxdWFyZXNCZXR3ZWVuID0gYmV0d2Vlbihmcm9tLCB0byk7XG4gICAgLy8gZG8gYW55IG9mIHRoZSBtb3ZlcyByZXZlYWwgdGhlIGRlc2lyZWQgY2FwdHVyZSBcbiAgICByZXR1cm4gbW92ZXMuZmlsdGVyKG1vdmUgPT4gc3F1YXJlc0JldHdlZW4uaW5kZXhPZihtb3ZlLmZyb20pICE9PSAtMSlcbiAgICAgICAgLmZpbHRlcihtID0+IGRvZXNNb3ZlUmVzdWx0SW5DYXB0dXJlVGhyZWF0KG0sIGZlbiwgZnJvbSwgdG8pKTtcbn1cblxuZnVuY3Rpb24gZG9lc01vdmVSZXN1bHRJbkNhcHR1cmVUaHJlYXQobW92ZSwgZmVuLCBmcm9tLCB0bykge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuXG4gICAgLy9hcHBseSBtb3ZlIG9mIGludGVybWVkaWFyeSBwaWVjZSAoc3RhdGUgYmVjb21lcyBvdGhlciBzaWRlcyB0dXJuKVxuICAgIGNoZXNzLm1vdmUobW92ZSk7XG5cbiAgICAvL251bGwgbW92ZSBmb3Igb3Bwb25lbnQgdG8gcmVnYWluIHRoZSBtb3ZlIGZvciBvcmlnaW5hbCBzaWRlXG4gICAgY2hlc3MubG9hZChmZW5Gb3JPdGhlclNpZGUoY2hlc3MuZmVuKCkpKTtcblxuICAgIC8vZ2V0IGxlZ2FsIG1vdmVzXG4gICAgdmFyIG1vdmVzID0gY2hlc3MubW92ZXMoe1xuICAgICAgICB2ZXJib3NlOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBkbyBhbnkgb2YgdGhlIG1vdmVzIG1hdGNoIGZyb20sdG8gXG4gICAgcmV0dXJuIG1vdmVzLmZpbHRlcihtID0+IG0uZnJvbSA9PT0gZnJvbSAmJiBtLnRvID09PSB0bykubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBTd2l0Y2ggc2lkZSB0byBwbGF5IChhbmQgcmVtb3ZlIGVuLXBhc3NlbnQgaW5mb3JtYXRpb24pXG4gKi9cbmZ1bmN0aW9uIGZlbkZvck90aGVyU2lkZShmZW4pIHtcbiAgICBpZiAoZmVuLnNlYXJjaChcIiB3IFwiKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGZlbi5yZXBsYWNlKC8gdyAuKi8sIFwiIGIgLSAtIDAgMVwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmZW4ucmVwbGFjZSgvIGIgLiovLCBcIiB3IC0gLSAwIDJcIik7XG4gICAgfVxufVxuXG4vKipcbiAqIFdoZXJlIGlzIHRoZSBraW5nLlxuICovXG5mdW5jdGlvbiBraW5nc1NxdWFyZShmZW4sIGNvbG91cikge1xuICAgIHJldHVybiBzcXVhcmVzT2ZQaWVjZShmZW4sIGNvbG91ciwgJ2snKTtcbn1cblxuZnVuY3Rpb24gc3F1YXJlc09mUGllY2UoZmVuLCBjb2xvdXIsIHBpZWNlVHlwZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuICAgIHJldHVybiBhbGxTcXVhcmVzLmZpbmQoc3F1YXJlID0+IHtcbiAgICAgICAgdmFyIHIgPSBjaGVzcy5nZXQoc3F1YXJlKTtcbiAgICAgICAgcmV0dXJuIHIgPT09IG51bGwgPyBmYWxzZSA6IChyLmNvbG9yID09IGNvbG91ciAmJiByLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gcGllY2VUeXBlKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbW92ZXNPZlBpZWNlT24oZmVuLCBzcXVhcmUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoZmVuKTtcbiAgICByZXR1cm4gY2hlc3MubW92ZXMoe1xuICAgICAgICB2ZXJib3NlOiB0cnVlLFxuICAgICAgICBzcXVhcmU6IHNxdWFyZVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEZpbmQgcG9zaXRpb24gb2YgYWxsIG9mIG9uZSBjb2xvdXJzIHBpZWNlcyBleGNsdWRpbmcgdGhlIGtpbmcuXG4gKi9cbmZ1bmN0aW9uIHBpZWNlc0ZvckNvbG91cihmZW4sIGNvbG91cikge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuICAgIHJldHVybiBhbGxTcXVhcmVzLmZpbHRlcihzcXVhcmUgPT4ge1xuICAgICAgICB2YXIgciA9IGNoZXNzLmdldChzcXVhcmUpO1xuICAgICAgICBpZiAoKHIgPT09IG51bGwpIHx8IChyLnR5cGUgPT09ICdrJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gci5jb2xvciA9PSBjb2xvdXI7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIG1ham9yUGllY2VzRm9yQ29sb3VyKGZlbiwgY29sb3VyKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG4gICAgcmV0dXJuIGFsbFNxdWFyZXMuZmlsdGVyKHNxdWFyZSA9PiB7XG4gICAgICAgIHZhciByID0gY2hlc3MuZ2V0KHNxdWFyZSk7XG4gICAgICAgIGlmICgociA9PT0gbnVsbCkgfHwgKHIudHlwZSA9PT0gJ3AnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByLmNvbG9yID09IGNvbG91cjtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2FuQ2FwdHVyZShmcm9tLCBmcm9tUGllY2UsIHRvLCB0b1BpZWNlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MuY2xlYXIoKTtcbiAgICBjaGVzcy5wdXQoe1xuICAgICAgICB0eXBlOiBmcm9tUGllY2UudHlwZSxcbiAgICAgICAgY29sb3I6ICd3J1xuICAgIH0sIGZyb20pO1xuICAgIGNoZXNzLnB1dCh7XG4gICAgICAgIHR5cGU6IHRvUGllY2UudHlwZSxcbiAgICAgICAgY29sb3I6ICdiJ1xuICAgIH0sIHRvKTtcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHNxdWFyZTogZnJvbSxcbiAgICAgICAgdmVyYm9zZTogdHJ1ZVxuICAgIH0pLmZpbHRlcihtID0+ICgvLip4LiovLnRlc3QobS5zYW4pKSk7XG4gICAgcmV0dXJuIG1vdmVzLmxlbmd0aCA+IDA7XG59XG5cbi8qKlxuICogQ29udmVydCBQR04gdG8gbGlzdCBvZiBGRU5zLlxuICovXG5mdW5jdGlvbiBwZ25Ub0ZlbnMocGduKSB7XG4gICAgdmFyIGdhbWVNb3ZlcyA9IHBnbi5yZXBsYWNlKC8oWzAtOV0rXFwuXFxzKS9nbSwgJycpLnRyaW0oKTtcbiAgICB2YXIgbW92ZUFycmF5ID0gZ2FtZU1vdmVzLnNwbGl0KCcgJykuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG47XG4gICAgfSk7XG5cbiAgICB2YXIgZmVucyA9IFtdO1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIG1vdmVBcnJheS5mb3JFYWNoKG1vdmUgPT4ge1xuICAgICAgICBjaGVzcy5tb3ZlKG1vdmUsIHtcbiAgICAgICAgICAgIHNsb3BweTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBza2lwIG9wZW5pbmcgbW92ZXNcbiAgICAgICAgaWYgKGNoZXNzLmhpc3RvcnkoKS5sZW5ndGggPCA4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBza2lwIHBvc2l0aW9ucyBpbiBjaGVja1xuICAgICAgICBpZiAoY2hlc3MuaW5fY2hlY2soKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2tpcCBibGFjayBtb3Zlc1xuICAgICAgICBpZiAoY2hlc3MudHVybigpID09PSAnYicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmZW5zLnB1c2goY2hlc3MuZmVuKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBmZW5zO1xufVxuXG5mdW5jdGlvbiBiZXR3ZWVuKGZyb20sIHRvKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBuID0gZnJvbTtcbiAgICB3aGlsZSAobiAhPT0gdG8pIHtcbiAgICAgICAgbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUobi5jaGFyQ29kZUF0KCkgKyBNYXRoLnNpZ24odG8uY2hhckNvZGVBdCgpIC0gbi5jaGFyQ29kZUF0KCkpKSArXG4gICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKG4uY2hhckNvZGVBdCgxKSArIE1hdGguc2lnbih0by5jaGFyQ29kZUF0KDEpIC0gbi5jaGFyQ29kZUF0KDEpKSk7XG4gICAgICAgIHJlc3VsdC5wdXNoKG4pO1xuICAgIH1cbiAgICByZXN1bHQucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmVwYWlyRmVuKGZlbikge1xuICAgIGlmICgvXlteIF0qJC8udGVzdChmZW4pKSB7XG4gICAgICAgIHJldHVybiBmZW4gKyBcIiB3IC0gLSAwIDFcIjtcbiAgICB9XG4gICAgcmV0dXJuIGZlbi5yZXBsYWNlKC8gdyAuKi8sICcgdyAtIC0gMCAxJykucmVwbGFjZSgvIGIgLiovLCAnIGIgLSAtIDAgMScpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5hbGxTcXVhcmVzID0gYWxsU3F1YXJlcztcbm1vZHVsZS5leHBvcnRzLnBnblRvRmVucyA9IHBnblRvRmVucztcbm1vZHVsZS5leHBvcnRzLmtpbmdzU3F1YXJlID0ga2luZ3NTcXVhcmU7XG5tb2R1bGUuZXhwb3J0cy5waWVjZXNGb3JDb2xvdXIgPSBwaWVjZXNGb3JDb2xvdXI7XG5tb2R1bGUuZXhwb3J0cy5pc0NoZWNrQWZ0ZXJQbGFjaW5nS2luZ0F0U3F1YXJlID0gaXNDaGVja0FmdGVyUGxhY2luZ0tpbmdBdFNxdWFyZTtcbm1vZHVsZS5leHBvcnRzLmZlbkZvck90aGVyU2lkZSA9IGZlbkZvck90aGVyU2lkZTtcbm1vZHVsZS5leHBvcnRzLmlzQ2hlY2tBZnRlclJlbW92aW5nUGllY2VBdFNxdWFyZSA9IGlzQ2hlY2tBZnRlclJlbW92aW5nUGllY2VBdFNxdWFyZTtcbm1vZHVsZS5leHBvcnRzLm1vdmVzVGhhdFJlc3VsdEluQ2FwdHVyZVRocmVhdCA9IG1vdmVzVGhhdFJlc3VsdEluQ2FwdHVyZVRocmVhdDtcbm1vZHVsZS5leHBvcnRzLm1vdmVzT2ZQaWVjZU9uID0gbW92ZXNPZlBpZWNlT247XG5tb2R1bGUuZXhwb3J0cy5tYWpvclBpZWNlc0ZvckNvbG91ciA9IG1ham9yUGllY2VzRm9yQ29sb3VyO1xubW9kdWxlLmV4cG9ydHMuY2FuQ2FwdHVyZSA9IGNhbkNhcHR1cmU7XG5tb2R1bGUuZXhwb3J0cy5yZXBhaXJGZW4gPSByZXBhaXJGZW47XG4iLCJ2YXIgdW5pcSA9IHJlcXVpcmUoJy4uL3V0aWwvdW5pcScpO1xuXG4vKipcbiAqIEZpbmQgYWxsIGRpYWdyYW1zIGFzc29jaWF0ZWQgd2l0aCB0YXJnZXQgc3F1YXJlIGluIHRoZSBsaXN0IG9mIGZlYXR1cmVzLlxuICovXG5mdW5jdGlvbiBkaWFncmFtRm9yVGFyZ2V0KHNpZGUsIGRlc2NyaXB0aW9uLCB0YXJnZXQsIGZlYXR1cmVzKSB7XG4gIHZhciBkaWFncmFtID0gW107XG4gIGZlYXR1cmVzXG4gICAgLmZpbHRlcihmID0+IHNpZGUgPyBzaWRlID09PSBmLnNpZGUgOiB0cnVlKVxuICAgIC5maWx0ZXIoZiA9PiBkZXNjcmlwdGlvbiA/IGRlc2NyaXB0aW9uID09PSBmLmRlc2NyaXB0aW9uIDogdHJ1ZSlcbiAgICAuZm9yRWFjaChmID0+IGYudGFyZ2V0cy5mb3JFYWNoKHQgPT4ge1xuICAgICAgaWYgKCF0YXJnZXQgfHwgdC50YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICBkaWFncmFtID0gZGlhZ3JhbS5jb25jYXQodC5kaWFncmFtKTtcbiAgICAgICAgdC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSkpO1xuICByZXR1cm4gdW5pcShkaWFncmFtKTtcbn1cblxuZnVuY3Rpb24gYWxsRGlhZ3JhbXMoZmVhdHVyZXMpIHtcbiAgdmFyIGRpYWdyYW0gPSBbXTtcbiAgZmVhdHVyZXMuZm9yRWFjaChmID0+IGYudGFyZ2V0cy5mb3JFYWNoKHQgPT4ge1xuICAgIGRpYWdyYW0gPSBkaWFncmFtLmNvbmNhdCh0LmRpYWdyYW0pO1xuICAgIHQuc2VsZWN0ZWQgPSB0cnVlO1xuICB9KSk7XG4gIHJldHVybiB1bmlxKGRpYWdyYW0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckRpYWdyYW1zKGZlYXR1cmVzKSB7XG4gIGZlYXR1cmVzLmZvckVhY2goZiA9PiBmLnRhcmdldHMuZm9yRWFjaCh0ID0+IHtcbiAgICB0LnNlbGVjdGVkID0gZmFsc2U7XG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tlZFNxdWFyZXMoZmVhdHVyZXMsIGNvcnJlY3QsIGluY29ycmVjdCwgdGFyZ2V0KSB7XG4gIHZhciBkaWFncmFtID0gZGlhZ3JhbUZvclRhcmdldChudWxsLCBudWxsLCB0YXJnZXQsIGZlYXR1cmVzKTtcbiAgY29ycmVjdC5mb3JFYWNoKHRhcmdldCA9PiB7XG4gICAgZGlhZ3JhbS5wdXNoKHtcbiAgICAgIG9yaWc6IHRhcmdldCxcbiAgICAgIGJydXNoOiAnZ3JlZW4nXG4gICAgfSk7XG4gIH0pO1xuICBpbmNvcnJlY3QuZm9yRWFjaCh0YXJnZXQgPT4ge1xuICAgIGRpYWdyYW0ucHVzaCh7XG4gICAgICBvcmlnOiB0YXJnZXQsXG4gICAgICBicnVzaDogJ3JlZCdcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBkaWFncmFtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGlhZ3JhbUZvclRhcmdldDogZGlhZ3JhbUZvclRhcmdldCxcbiAgYWxsRGlhZ3JhbXM6IGFsbERpYWdyYW1zLFxuICBjbGVhckRpYWdyYW1zOiBjbGVhckRpYWdyYW1zLFxuICBjbGlja2VkU3F1YXJlczogY2xpY2tlZFNxdWFyZXNcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICAnMmJyM2svcHAzUHAxLzFuMnAzLzFQMk4xcHIvMlAycVAxLzgvMUJRMlAxUC80UjFLMSB3IC0gLSAxIDAnLFxuICAgICc2UjEvNXIxay9wNmIvMXBCMXAycS8xUDYvNXJRUC81UDFLLzZSMSB3IC0gLSAxIDAnLFxuICAgICc2cmsvcDFwYjFwMXAvMnBwMVAyLzJiMW4yUS80UFIyLzNCNC9QUFAxSzJQL1JOQjNxMSB3IC0gLSAxIDAnLFxuICAgICdybjNyazEvMnFwMnBwL3AzUDMvMXAxYjQvM2I0LzNCNC9QUFAxUTFQUC9SMUIyUjFLIHcgLSAtIDEgMCcsXG4gICAgJ3IyQjFiazEvMXA1cC8ycDJwMi9wMW41LzRQMUJQL1AxTmI0L0tQbjNQTi8zUjNSIGIgLSAtIDAgMScsXG4gICAgJzJSM25rLzNyMmIxL3AycHIxUTEvNHBOMi8xUDYvUDZQL3E3L0I0UksxIHcgLSAtIDEgMCcsXG4gICAgJzgvOC8yTjFQMy8xUDYvNFEzLzRiMksvNGszLzRxMyB3IC0gLSAxIDAnLFxuICAgICdyMWIxazFuci9wNWJwL3AxcEJxMXAxLzNwUDFQMS9ONFEyLzgvUFBQMU4yUC9SNFJLMSB3IC0gLSAxIDAnLFxuICAgICc1cmsxL3BwMnAycC8zcDJwYi8ycFBuMlAvMlAycTIvMk40UC9QUDNCUjEvUjJCSzFOMSBiIC0gLSAwIDEnLFxuICAgICcxcjJxcmsxL3A0cDFwL2JwMXAxUXAxL24xcHBQMy9QMVA1LzJQQjFQTjEvNlBQL1I0UksxIHcgLSAtIDEgMCcsXG4gICAgJ3IzcTFyMS8xcDJiTmtwL3AzbjMvMlBOMUIxUS9QUDFQMXAyLzdQLzVQUDEvNksxIHcgLSAtIDEgMCcsXG4gICAgJzNrNC9SNy81TjIvMXAybjMvNnAxL1AxTjJiUDEvMXI2LzVLMiBiIC0gLSAwIDEnLFxuICAgICc3ay8xcHBxNC8xbjFwMlExLzFQNE5wLzFQM3AxQi8zQjQvN1Avcm41SyB3IC0gLSAxIDAnLFxuICAgICc2cjEvUTRwMi80cHExay8zcDJOYi9QNFAxSy80UDMvN1AvMlI1IGIgLSAtIDAgMScsXG4gICAgJ3IzazJyLzFCcDJwcHAvOC80cTFiMS9wUDFuNC9QMUtQM1AvMUJQNS9SMlEzUiBiIC0gLSAwIDEnLFxuICAgICc3ci9wcDRRMS8xcXAycDFyLzVrMi8yUDRQLzFQQjUvUDRQUDEvNFIxSzEgdyAtIC0gMSAwJyxcbiAgICAnM3IyazEvMXAzcDFwL3AxbjJxcDEvMkI1LzFQMlEyUC82UDEvQjJiUlAyLzZLMSB3IC0gLSAxIDAnLFxuICAgICdyNXJrL3BwcTJwMi8ycGIxUDFCLzNuNC8zUDQvMlBCM1AvUFAxUU5QMi8xSzYgdyAtIC0gMSAwJyxcbiAgICAnNmsxLzJiM3IxLzgvNnBSLzJwM04xLzJQYlAxUFAvMVBCMlIxSy8ycjUgdyAtIC0gMSAwJyxcbiAgICAncjJxMWsxci9wcHAxYkIxcC8ybnA0LzZOMS8zUFAxYlAvOC9QUFA1L1JOQjJSSzEgdyAtIC0gMSAwJyxcbiAgICAnMnIzazEvcDRwMi8zUnAycC8xcDJQMXBLLzgvMVA0UDEvUDNRMlAvMXE2IGIgLSAtIDAgMScsXG4gICAgJzgvcHAyazMvN3IvMlAxcDFwMS80UDMvNXBxMS8yUjNOMS8xUjNCSzEgYiAtIC0gMCAxJyxcbiAgICAnNHIyci81azIvMnAyUDFwL3AycFAxcDEvM1AyUTEvNlBCLzFuNVAvNksxIHcgLSAtIDEgMCcsXG4gICAgJzJiMXJxazEvcjFwMnBwMS9wcDRuMS8zTnAxUTEvNFAyUC8xQlA1L1BQM1AyLzJLUjJSMSB3IC0gLSAxIDAnLFxuICAgICc0cjFrMS9wUTNwcDEvN3AvNHEzLzRyMy9QNy8xUDJuUFBQLzJCUjFSMUsgYiAtIC0gMCAxJyxcbiAgICAncjVrMS9wMXAzYnAvMXAxcDQvMlBQMnFwLzFQNi8xUTFiUDMvUEIzclBQL1IyTjJSSyBiIC0gLSAwIDEnLFxuICAgICc0azMvcjJibm4xci8xcTJwUjFwL3AycFBwMUIvMnBQMU4xUC9QcFAxQjMvMVA0UTEvNUtSMSB3IC0gLSAxIDAnLFxuICAgICdyMWIyazIvMXA0cHAvcDROMXIvNFBwMi9QM3BQMXEvNFAyUC8xUDJRMksvM1IyUjEgdyAtIC0gMSAwJyxcbiAgICAnMnE0ci9SNy81cDFrLzJCcFBuMi82UXAvNlBOLzVQMUsvOCB3IC0gLSAxIDAnLFxuICAgICczcjFxMXIvMXA0azEvMXBwMnBwMS80cDMvNFAyUi8xblAzUFEvUFAzUEsxLzdSIHcgLSAtIDEgMCcsXG4gICAgJzNyNC9wUjJOMy8ycGtiMy81cDIvOC8yQjUvcVAzUFBQLzRSMUsxIHcgLSAtIDEgMCcsXG4gICAgJ3IxYjRyLzFrMmJwcHAvcDFwMXAzLzgvTnAybkIyLzNSNC9QUFAxQlBQUC8yS1I0IHcgLSAtIDEgMCcsXG4gICAgJzZrci9wMVEzcHAvM0JiYnExLzgvNVIyLzVQMi9QUDNQMVAvNEtCMVIgdyAtIC0gMSAwJyxcbiAgICAnMnEycjFrLzVRcDEvNHAxUDEvM3A0L3I2Yi83Ui81QlBQLzVSSzEgdyAtIC0gMSAwJyxcbiAgICAnNXIxay80UjMvNnBQL3IxcFFQcDIvNVAyLzJwMVBOMi8ycTUvNUsxUiB3IC0gLSAxIDAnLFxuICAgICcycjJyMi83ay81cFJwLzVxMi8zcDFQMi82UVAvUDJCMVAxSy82UjEgdyAtIC0gMSAwJyxcbiAgICAnUTcvMnIycnBrLzJwNHAvN04vM1BwTjIvMXAyUDMvMUs0UjEvNXEyIHcgLSAtIDEgMCcsXG4gICAgJ3I0azIvUFI2LzFiNi80cDFOcC8yQjJwMi8ycDUvMks1LzggdyAtIC0gMSAwJyxcbiAgICAncm4zcmsxL3A1cHAvMnA1LzNQcGIyLzJxNS8xUTYvUFBQQjJQUC9SM0sxTlIgYiAtIC0gMCAxJyxcbiAgICAncjJxcjFrMS8xcDFuMnBwLzJiMXAzL3AycFAxYjEvUDJQMU5wMS8zQlBSMi8xUFFCM1AvNVJLMSB3IC0gLSAxIDAnLFxuICAgICc1cjFrLzFxNGJwLzNwQjFwMS8ycFBuMUIxLzFyNi8xcDVSLzFQMlBQUVAvUjVLMSB3IC0gLSAxIDAnLFxuICAgICdyMW4xa2JyMS9wcHExcE4yLzJwMVBuMXAvMlBwM1EvM1AzUC84L1BQM1AyL1IxQjFLMlIgdyAtIC0gMSAwJyxcbiAgICAncjNiMy8xcDNOMWsvbjRwMi9wMlBwUDIvbjcvNlAxLzFQMVFCMVAxLzRLMyB3IC0gLSAxIDAnLFxuICAgICcxcmIyazIvcHAzcHBRLzdxLzJwMW4xTjEvMnA1LzJONS9QM0JQMVAvSzJSNCB3IC0gLSAxIDAnLFxuICAgICdyNy81cGsxLzJwNHAvMXAxcDQvMXFuUDQvNVFQUC8yQjFSUDFLLzggdyAtIC0gMSAwJyxcbiAgICAnNnIxL3A2ay9CcDNuMXIvMnBQMVAyL1A0cTFQLzJQMlEyLzVLMi8yUjJSMiBiIC0gLSAwIDEnLFxuICAgICc2azEvNHBwMi8ycTNwcC9SMXAxUG4yLzJOMlAyLzFQNHJQLzFQM1ExSy84IGIgLSAtIDAgMScsXG4gICAgJzRRMy8xYjVyLzFwMWtwMy81cDFyLzNwMW5xMS9QNE5QMS8xUDNQQjEvMlIzSzEgdyAtIC0gMSAwJyxcbiAgICAnMnJiM3IvM04xcGsxL3AycHAycC9xcDJQQjFRL24yTjFQMi82UDEvUDFQNFAvMUsxUlIzIHcgLSAtIDEgMCcsXG4gICAgJ3IxYjJrMXIvMnExYjMvcDNwcEJwLzJuM0IxLzFwNi8yTjRRL1BQUDNQUC8yS1JSMyB3IC0gLSAxIDAnLFxuICAgICdyMWIxcmsyL3BwMW5iTnBCLzJwMXAycC9xMm5CMy8zUDNQLzJOMVAzL1BQUTJQUDEvMktSM1IgdyAtIC0gMSAwJyxcbiAgICAnNXIxay83cC84LzROUDIvOC8zcDJSMS8ycjNQUC8ybjFSSzIgdyAtIC0gMSAwJyxcbiAgICAnM3I0LzZrcC8xcDFyMXBOMS81UXExLzZwMS9QQjRQMS8xUDNQMi82S1IgdyAtIC0gMSAwJyxcbiAgICAnNnIxL3I1UFIvMnAzUjEvMlBrMW4yLzNwNC8xUDFOUDMvNEszLzggdyAtIC0gMSAwJyxcbiAgICAnM3ExcjIvcDJucjMvMWsxTkIxcHAvMVBwNS81QjIvMVE2L1A1UFAvNVJLMSB3IC0gLSAxIDAnLFxuICAgICdRNy8xUjVwLzJrcXIybi83cC81UGIxLzgvUDFQMkJQMS82SzEgdyAtIC0gMSAwJyxcbiAgICAnM3IyazEvNXAyLzJiMkJwMS83cC80cDMvNVBQMS9QM0JxMVAvUTNSMksgYiAtIC0gMCAxJyxcbiAgICAncjRxazEvMnA0cC9wMXAxTjMvMmJwUTMvNG5QMi84L1BQUDNQUC81UjFLIGIgLSAtIDAgMScsXG4gICAgJ3IxcjNrMS8zTlFwcHAvcTNwMy84LzgvUDFCMVAxUDEvMVAxUjFQYlAvM0s0IGIgLSAtIDAgMScsXG4gICAgJzNyNC83cC8yUk4yazEvNG4ycS9QMnA0LzNQMlAxLzRwMVAxLzVRSzEgdyAtIC0gMSAwJyxcbiAgICAncjFicTFyMWsvcHA0cHAvMnBwNC8yYjJwMi80UE4yLzFCUFAxUTIvUFAzUFBQL1I0UksxIHcgLSAtIDEgMCcsXG4gICAgJ3IycTQvcDJuUjFiay8xcDFQYjJwLzRwMnAvM25OMy9CMkIzUC9QUDFRMlAxLzZLMSB3IC0gLSAxIDAnLFxuICAgICdyMm4xcmsxLzFwcGIycHAvMXAxcDQvM1BwcTFuLzJCM1AxLzJQNFAvUFAxTjFQMUsvUjJRMVJOMSBiIC0gLSAwIDEnLFxuICAgICcxcjJyMy8xbjNOa3AvcDJQMnAxLzNCNC8xcDVRLzFQNVAvNlAxLzJiNEsgdyAtIC0gMSAwJyxcbiAgICAncjFiMnJrMS9wcDFwMXAxcC8ybjNwUS81cUIxLzgvMlA1L1A0UFBQLzRSUksxIHcgLSAtIDEgMCcsXG4gICAgJzVyazEvcFI0YnAvNnAxLzZCMS81UTIvNFAzL3EycjFQUFAvNVJLMSB3IC0gLSAxIDAnLFxuICAgICc2UTEvMXEyTjFuMS8zcDNrLzNQM3AvMlA1LzNicDFQMS8xUDRCUC82SzEgdyAtIC0gMSAwJyxcbiAgICAncm5icTFyazEvcHAyYnAxcC80cDFwMS8ycHAyTm4vNVAxUC8xUDFCUDMvUEJQUDJQMS9STjFRSzJSIHcgLSAtIDEgMCcsXG4gICAgJzJxMnJrMS80cjFicC9icFFwMnAxL3AyUHAzL1AzUDJQLzFOUDFCMUsxLzFQNi9SMlI0IGIgLSAtIDAgMScsXG4gICAgJzVyMWsvcHAxbjFwMXAvNW4xUS8zcDFwTjEvM1A0LzFQNFJQL1AxcjFxUFAxL1I1SzEgdyAtIC0gMSAwJyxcbiAgICAnNG5yazEvclI1cC80cG5wUS80cDFOMS8ycDFOMy82UDEvcTRQMVAvNFIxSzEgdyAtIC0gMSAwJyxcbiAgICAncjNxMmsvcDJuMXIyLzJiUDFwcEIvYjNwMlEvTjFQcDQvUDVSMS81UFBQL1I1SzEgdyAtIC0gMSAwJyxcbiAgICAnMVIxbjNrLzZwcC8yTnI0L1A0cDIvcjcvOC80UFBCUC82SzEgYiAtIC0gMCAxJyxcbiAgICAncjFiMnIxay9wMW4zYjEvN3AvNXEyLzJCcE4xcDEvUDVQMS8xUDFRMU5QMS8ySzFSMlIgdyAtIC0gMSAwJyxcbiAgICAnM2tyMy9wMXIxYlIyLzRQMnAvMVFwNS8zcDNwLzgvUFA0UFAvNksxIHcgLSAtIDEgMCcsXG4gICAgJzZyMS8zcDJxay80UDMvMVI1cC8zYjFwclAvM1AyQjEvMlAxUVAyLzZSSyBiIC0gLSAwIDEnLFxuICAgICdyNXExL3BwMWIxa3IxLzJwMnAyLzJRNS8yUHBCMy8xUDROUC9QNFAyLzRSSzIgdyAtIC0gMSAwJyxcbiAgICAnN1IvcjFwMXExcHAvM2s0LzFwMW4xUTIvM040LzgvMVBQMlBQUC8yQjNLMSB3IC0gLSAxIDAnLFxuICAgICcycTFyYjFrL3BycDNwcC8xcG4xcDMvNXAxTi8yUFAzUS82UjEvUFAzUFBQL1I1SzEgdyAtIC0gMSAwJyxcbiAgICAncjFxYnIyay8xcDJuMXBwLzNCMW4yLzJQMU5wMi9wNE4yL1BRNFAxLzFQM1AxUC8zUlIxSzEgdyAtIC0gMSAwJyxcbiAgICAnM3JrMy8xcTRwcC8zQjFwMi8zUjQvMXBRNS8xUGI1L1A0UFBQLzZLMSB3IC0gLSAxIDAnLFxuICAgICdyNGsyLzZwcC9wMW4xcDJOLzJwNS8xcTYvNlFQL1BiUDJQUDEvMUsxUjFCMiB3IC0gLSAxIDAnLFxuICAgICczcnIyay9wcDFiMmIxLzRxMXBwLzJQcDFwMi8zQjQvMVAyUU5QMS9QNlAvUjRSSzEgdyAtIC0gMSAwJyxcbiAgICAnNVExUi8zcW4xcDEvcDNwMWsxLzFwcDFQcEIxLzNyM1AvNVAyL1BQUDNLMS84IHcgLSAtIDEgMCcsXG4gICAgJzJyMXIzL3AzUDFrMS8xcDFwUjFQcC9uMnExUDIvOC8ycDRQL1A0UTIvMUIzUksxIHcgLSAtIDEgMCcsXG4gICAgJ3IxYjJyazEvMnAycHBwL3A3LzFwNi8zUDNxLzFCUDNiUC9QUDNRUDEvUk5CMVIxSzEgdyAtIC0gMSAwJyxcbiAgICAnMVI2LzRyMXBrL3BwMk4ycC80blAyLzJwNS8yUDNQMS9QMlAxSzIvOCB3IC0gLSAxIDAnLFxuICAgICcxcmIyUlIxL3AxcDNwMS8ycDNrMS81cDFwLzgvM04xUFAxL1BQNXIvMks1IHcgLSAtIDEgMCcsXG4gICAgJ3IycjJrMS9wcDJicHBwLzJwMXAzLzRxYjFQLzgvMUJQMUJRMi9QUDNQUDEvMktSM1IgYiAtIC0gMCAxJyxcbiAgICAnMXI0azEvNWJwMS9wcjFQMnAxLzFucDFwMy8yQjFQMlIvMlAyUE4xLzZLMS9SNyB3IC0gLSAxIDAnLFxuICAgICczazQvMVI2LzNOMm4xL3AyUHAzLzJQMU4zLzNuMlBwL3E2UC81UksxIHcgLSAtIDEgMCcsXG4gICAgJzFyMXJiMy9wMXEycGtwL1BucDJucDEvNHAzLzRQMy9RMU4xQjFQUC8yUFJCUDIvM1IySzEgdyAtIC0gMSAwJyxcbiAgICAncjNrMy9wYnBxYjFyMS8xcDJRMXAxLzNwUDFCMS8zUDQvM0I0L1BQUDRQLzVSSzEgdyAtIC0gMSAwJyxcbiAgICAncjJrMXIyLzNiMnBwL3A1cDEvMlExUjMvMXBCMVBxMi8xUDYvUEtQNFAvN1IgdyAtIC0gMSAwJyxcbiAgICAnM3EycjEvNG4yay9wMXAxckJwcC9QcFBwUHAyLzFQM1AxUS8yUDNSMS83UC8xUjVLIHcgLSAtIDEgMCcsXG4gICAgJzVyMWsvMnAxYjFwcC9wcTFwQjMvOC8yUTFQMy81cFAxL1JQM24xUC8xUjRLMSBiIC0gLSAwIDEnLFxuICAgICcyYnFyMmsvMXIxbjJicC9wcDFwQnAyLzJwUDFQUTEvUDNQTjIvMVA0UDEvMUI1UC9SM1IxSzEgdyAtIC0gMSAwJyxcbiAgICAncjFiMnJrMS81cGIxL3AxbjFwMy80QjMvNE4yUi84LzFQUDFwMVBQLzVSSzEgdyAtIC0gMSAwJyxcbiAgICAnMnIyazIvcGI0YlEvMXAxcXIxcFIvM3AxcEIxLzNQcDMvMlA1L1BQQjJQUDEvMUs1UiB3IC0gLSAxIDAnLFxuICAgICc0cjMvMkI0Qi8ycDFiMy9wcGs1LzVSMi9QMlAzcC8xUFA1LzFLNVIgdyAtIC0gMSAwJyxcbiAgICAncjVrMS9xNHBwcC9yblIxcGIyLzFRMXA0LzFQMVA0L1A0TjFQLzFCM1BQMS8yUjNLMSB3IC0gLSAxIDAnLFxuICAgICdyMWJybjMvcDFxNHAvcDFwMlAxay8yUHBQUHAxL1A3LzFRMkIyUC8xUDYvMUsxUjFSMiB3IC0gLSAxIDAnLFxuICAgICc1cjFrLzdwL3AyYjQvMXBOcDFwMXEvM1ByMy8yUDJiUDEvUFAxQjNRL1IzUjFLMSBiIC0gLSAwIDEnLFxuICAgICc3ay8ycDNwcC9wNy8xcDFwNC9QUDJwcjIvQjFQM3FQLzROMUIxL1IxUW4ySzEgYiAtIC0gMCAxJyxcbiAgICAnMnIzazEvcHA0cnAvMXExcDJwUS8xTjJwMVBSLzJuTlAzLzVQMi9QUFA1LzJLNFIgdyAtIC0gMSAwJyxcbiAgICAnNHExa3IvcDRwMi8xcDFRYlBwMS8ycDFQMU5wLzJQNS83UC9QUDRQMS8zUjNLIHcgLSAtIDEgMCcsXG4gICAgJ1I3LzNuYnBrcC80cDFwMS8zclAxUDEvUDJCMVExUC8zcTFOSzEvOC84IHcgLSAtIDEgMCcsXG4gICAgJzVyazEvNFJwMXAvMXExcEJRcDEvNXIyLzFwNi8xUDRQMS8ybjJQMi8zUjJLMSB3IC0gLSAxIDAnLFxuICAgICcyUTUvcHAycmsxcC8zcDJwcS8yYlAxcjIvNVJSMS8xUDJQMy9QQjNQMVAvN0sgdyAtIC0gMSAwJyxcbiAgICAnM1E0LzRyMXBwL2I2ay82UjEvOC8xcUJuMU4yLzFQNFBQLzZLUiB3IC0gLSAxIDAnLFxuICAgICczcjJxay9wMlEzcC8xcDNSMi8ycFBwMy8xbmI1LzZOMS9QQjRQUC8xQjRLMSB3IC0gLSAxIDAnLFxuICAgICc1YjIvMXAzcnBrL3AxYjNScC80QjFSUS8zUDFwMVAvN3EvNVAyLzZLMSB3IC0gLSAxIDAnLFxuICAgICc0cjMvMnExcnBrMS9wM2JOMXAvMnAzcDEvNFFQMi8yTjRQL1BQNFAxLzVSSzEgdyAtIC0gMSAwJyxcbiAgICAnM1JyMmsvcHA0cGIvMnA0cC8yUDFuMy8xUDFRM1AvNHIxcTEvUEI0QjEvNVJLMSBiIC0gLSAwIDEnLFxuICAgICdyMWIza3IvM3BSMXAxL3BwcTRwLzVQMi80UTMvQjcvUDVQUC81UksxIHcgLSAtIDEgMCcsXG4gICAgJzFyNi8xcDNLMWsvcDNOMy9QNm4vNlJQLzJQNS84LzggdyAtIC0gMSAwJyxcbiAgICAnNGszLzJxMnAyLzRwMy8zYlAxUTEvcDZSL3I2UC82UEsvNUIyIHcgLSAtIDEgMCcsXG4gICAgJzFRNi8xUDJwazFwLzVwcEIvM3E0L1A1UEsvN1AvNVAyLzZyMSBiIC0gLSAwIDEnLFxuICAgICdxMmJyMWsxLzFiNHBwLzNCcDMvcDZuLzFwM1IyLzNCMU4yL1BQMlFQUFAvNksxIHcgLSAtIDEgMCcsXG4gICAgJ3JxM3JrMS8xcDFicHAxcC8zcDJwUS9wMk4zbi8yQm5QMVAxLzVQMi9QUFA1LzJLUjNSIHcgLSAtIDEgMCcsXG4gICAgJ1I3LzVwa3AvM04ycDEvMnIzUG4vNXIyLzFQNi9QMVA1LzJLUjQgdyAtIC0gMSAwJyxcbiAgICAnNGtxMVEvcDJiM3AvMXBSNS8zQjJwMS81UHIxLzgvUFA1UC83SyB3IC0gLSAxIDAnLFxuICAgICc0UTMvcjRwcGsvM3AzcC80cFBiQi8yUDFQMy8xcTVQLzZQMS8zUjNLIHcgLSAtIDEgMCcsXG4gICAgJzRyMWsxL1E0YnBwL3A3LzVOMi8xUDNxbjEvMlA1L1AxQjNQUC9SNUsxIGIgLSAtIDAgMScsXG4gICAgJzZrMS81cDFwLzJRMXAxcDEvNW4xci9ONy8xQjNQMVAvMVBQM1BLLzRxMyBiIC0gLSAwIDEnLFxuICAgICcxcjNrMi81cDFwLzFxYlJwMy8ycjFQcDIvcHBCNFEvMVA2L1AxUDRQLzFLMVI0IHcgLSAtIDEgMCcsXG4gICAgJzgvMlExUjFiay8zcjNwL3AyTjFwMVAvUDJQNC8xcDNQcTEvMVA0UDEvMUs2IHcgLSAtIDEgMCcsXG4gICAgJzgvazFwMXEzL1BwNVEvNHAzLzJQMVAycC8zUDQvNEszLzggdyAtIC0gMSAwJyxcbiAgICAnNXIxay9yMmIxcDFwL3A0UHAxLzFwMlIzLzNxQlEyL1A3LzZQUC8yUjRLIHcgLSAtIDEgMCcsXG4gICAgJzgvOC8yTjUvOC84L3A3LzJLNS9rNyB3IC0gLSAxIDAnLFxuICAgICczcjNrLzFwM1JwcC9wMm5uMy8zTjQvOC8xUEIxUFExUC9xNFBQMS82SzEgdyAtIC0gMSAwJyxcbiAgICAnM3Eycm4vcHAzckJrLzFucHAxcDIvNVAyLzJQUFAxUlAvMlAyQjIvUDVRMS82UksgdyAtIC0gMSAwJyxcbiAgICAnOC8zbjJwcC8ycUJrcDIvcHBQcHAxUDEvMVAyUDMvMVE2L1A0UFAxLzZLMSB3IC0gLSAxIDAnLFxuICAgICc0cjMvMnA1LzJwMXExa3AvcDFyMXAxcE4vUDVQMS8xUDNQMi80UTMvM1JCMUsxIHcgLSAtIDEgMCcsXG4gICAgJzNyMWtyMS84L3AycTJwMS8xcDJSMy8xUTYvOC9QUFA1LzFLNFIxIHcgLSAtIDEgMCcsXG4gICAgJzRyMmsvMnBiMVIyLzJwNFAvM3ByMU4xLzFwNi83UC9QMVA1LzJLNFIgdyAtIC0gMSAwJyxcbiAgICAncjRrMXIvMnBRMXBwMS9wNHExcC8yTjNOMS8xcDNQMi84L1BQM1BQUC80UjFLMSB3IC0gLSAxIDAnLFxuICAgICc2cmsvMXIycFIxcC8zcFAxcEIvMnAxcDMvUDZRL1AxcTNQMS83UC81QksxIHcgLSAtIDEgMCcsXG4gICAgJzNyM2svMWIyYjFwcC8zcHAzL3AzbjFQMS8xcFBxUDJQLzFQMk4yUi9QMVFCMXIyLzJLUjNCIGIgLSAtIDAgMScsXG4gICAgJzgvMnAzTjEvNnAxLzVQQjEvcHAyUm4yLzdrL1AxcDJLMVAvM3I0IHcgLSAtIDEgMCcsXG4gICAgJzgvcDNRMnAvNnBrLzFONi80blAyLzdQL1A1UEsvM3JyMyB3IC0gLSAxIDAnLFxuICAgICc1cmtyLzFwMlFwYnAvcHExUDQvMm5CNC81cDIvMk41L1BQUDRQLzFLMVJSMyB3IC0gLSAxIDAnLFxuICAgICc4LzFwNi84LzJQM3BrLzNSMm4xLzdwLzJyNS80UjJLIGIgLSAtIDAgMScsXG4gICAgJzJyNS8xcDVwLzNwNC9wUDFQMVIyLzFuMkIxazEvOC8xUDNLUFAvOCB3IC0gLSAxIDAnXG5dO1xuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHB1enpsZSwgZm9ya1R5cGUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5sb2FkKHB1enpsZS5mZW4pO1xuICAgIGFkZEZvcmtzKHB1enpsZS5mZW4sIHB1enpsZS5mZWF0dXJlcywgZm9ya1R5cGUpO1xuICAgIGFkZEZvcmtzKGMuZmVuRm9yT3RoZXJTaWRlKHB1enpsZS5mZW4pLCBwdXp6bGUuZmVhdHVyZXMsIGZvcmtUeXBlKTtcbiAgICByZXR1cm4gcHV6emxlO1xufTtcblxuZnVuY3Rpb24gYWRkRm9ya3MoZmVuLCBmZWF0dXJlcywgZm9ya1R5cGUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5sb2FkKGZlbik7XG4gICAgdmFyIG1vdmVzID0gY2hlc3MubW92ZXMoe1xuICAgICAgICB2ZXJib3NlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBtb3ZlcyA9IG1vdmVzLm1hcChtID0+IGVucmljaE1vdmVXaXRoRm9ya0NhcHR1cmVzKGZlbiwgbSkpO1xuICAgIG1vdmVzID0gbW92ZXMuZmlsdGVyKG0gPT4gbS5jYXB0dXJlcy5sZW5ndGggPj0gMik7XG5cbiAgICBpZiAoIWZvcmtUeXBlIHx8IGZvcmtUeXBlID09ICdxJykge1xuICAgICAgICBhZGRGb3Jrc0J5KG1vdmVzLCAncScsICdRdWVlbicsIGNoZXNzLnR1cm4oKSwgZmVhdHVyZXMpO1xuICAgIH1cbiAgICBpZiAoIWZvcmtUeXBlIHx8IGZvcmtUeXBlID09ICdwJykge1xuICAgICAgICBhZGRGb3Jrc0J5KG1vdmVzLCAncCcsICdQYXduJywgY2hlc3MudHVybigpLCBmZWF0dXJlcyk7XG4gICAgfVxuICAgIGlmICghZm9ya1R5cGUgfHwgZm9ya1R5cGUgPT0gJ3InKSB7XG4gICAgICAgIGFkZEZvcmtzQnkobW92ZXMsICdyJywgJ1Jvb2snLCBjaGVzcy50dXJuKCksIGZlYXR1cmVzKTtcbiAgICB9XG4gICAgaWYgKCFmb3JrVHlwZSB8fCBmb3JrVHlwZSA9PSAnYicpIHtcbiAgICAgICAgYWRkRm9ya3NCeShtb3ZlcywgJ2InLCAnQmlzaG9wJywgY2hlc3MudHVybigpLCBmZWF0dXJlcyk7XG4gICAgfVxuICAgIGlmICghZm9ya1R5cGUgfHwgZm9ya1R5cGUgPT0gJ24nKSB7XG4gICAgICAgIGFkZEZvcmtzQnkobW92ZXMsICduJywgJ0tuaWdodCcsIGNoZXNzLnR1cm4oKSwgZmVhdHVyZXMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZW5yaWNoTW92ZVdpdGhGb3JrQ2FwdHVyZXMoZmVuLCBtb3ZlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIGNoZXNzLm1vdmUobW92ZSk7XG5cbiAgICB2YXIgc2FtZVNpZGVzVHVybkZlbiA9IGMuZmVuRm9yT3RoZXJTaWRlKGNoZXNzLmZlbigpKTtcbiAgICB2YXIgcGllY2VNb3ZlcyA9IGMubW92ZXNPZlBpZWNlT24oc2FtZVNpZGVzVHVybkZlbiwgbW92ZS50byk7XG4gICAgdmFyIGNhcHR1cmVzID0gcGllY2VNb3Zlcy5maWx0ZXIoY2FwdHVyZXNNYWpvclBpZWNlKTtcblxuICAgIG1vdmUuY2FwdHVyZXMgPSBjYXB0dXJlcztcbiAgICByZXR1cm4gbW92ZTtcbn1cblxuZnVuY3Rpb24gY2FwdHVyZXNNYWpvclBpZWNlKG1vdmUpIHtcbiAgICByZXR1cm4gbW92ZS5jYXB0dXJlZCAmJiBtb3ZlLmNhcHR1cmVkICE9PSAncCc7XG59XG5cbmZ1bmN0aW9uIGRpYWdyYW0obW92ZSkge1xuICAgIHZhciBtYWluID0gW3tcbiAgICAgICAgb3JpZzogbW92ZS5mcm9tLFxuICAgICAgICBkZXN0OiBtb3ZlLnRvLFxuICAgICAgICBicnVzaDogJ3BhbGVCbHVlJ1xuICAgIH1dO1xuICAgIHZhciBmb3JrcyA9IG1vdmUuY2FwdHVyZXMubWFwKG0gPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3JpZzogbW92ZS50byxcbiAgICAgICAgICAgIGRlc3Q6IG0udG8sXG4gICAgICAgICAgICBicnVzaDogbS5jYXB0dXJlZCA9PT0gJ2snID8gJ3JlZCcgOiAnYmx1ZSdcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFpbi5jb25jYXQoZm9ya3MpO1xufVxuXG5mdW5jdGlvbiBhZGRGb3Jrc0J5KG1vdmVzLCBwaWVjZSwgcGllY2VFbmdsaXNoLCBzaWRlLCBmZWF0dXJlcykge1xuICAgIHZhciBieXBpZWNlID0gbW92ZXMuZmlsdGVyKG0gPT4gbS5waWVjZSA9PT0gcGllY2UpO1xuICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICBkZXNjcmlwdGlvbjogcGllY2VFbmdsaXNoICsgXCIgZm9ya3NcIixcbiAgICAgICAgc2lkZTogc2lkZSxcbiAgICAgICAgdGFyZ2V0czogYnlwaWVjZS5tYXAobSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhcmdldDogbS50byxcbiAgICAgICAgICAgICAgICBkaWFncmFtOiBkaWFncmFtKG0pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgIH0pO1xufVxuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG52YXIgZm9ya3MgPSByZXF1aXJlKCcuL2ZvcmtzJyk7XG52YXIgaGlkZGVuID0gcmVxdWlyZSgnLi9oaWRkZW4nKTtcbnZhciBsb29zZSA9IHJlcXVpcmUoJy4vbG9vc2UnKTtcbnZhciBwaW5zID0gcmVxdWlyZSgnLi9waW5zJyk7XG52YXIgbWF0ZXRocmVhdCA9IHJlcXVpcmUoJy4vbWF0ZXRocmVhdCcpO1xudmFyIGNoZWNrcyA9IHJlcXVpcmUoJy4vY2hlY2tzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgYWxsIGZlYXR1cmVzIGluIHRoZSBwb3NpdGlvbi5cbiAgICovXG4gIGV4dHJhY3RGZWF0dXJlczogZnVuY3Rpb24oZmVuKSB7XG4gICAgdmFyIHB1enpsZSA9IHtcbiAgICAgIGZlbjogYy5yZXBhaXJGZW4oZmVuKSxcbiAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG5cbiAgICBwdXp6bGUgPSBmb3JrcyhwdXp6bGUpO1xuICAgIHB1enpsZSA9IGhpZGRlbihwdXp6bGUpO1xuICAgIHB1enpsZSA9IGxvb3NlKHB1enpsZSk7XG4gICAgcHV6emxlID0gcGlucyhwdXp6bGUpO1xuICAgIHB1enpsZSA9IG1hdGV0aHJlYXQocHV6emxlKTtcbiAgICBwdXp6bGUgPSBjaGVja3MocHV6emxlKTtcblxuICAgIHJldHVybiBwdXp6bGUuZmVhdHVyZXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBzaW5nbGUgZmVhdHVyZXMgaW4gdGhlIHBvc2l0aW9uLlxuICAgKi9cbiAgZXh0cmFjdFNpbmdsZUZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmVEZXNjcmlwdGlvbiwgZmVuKSB7XG4gICAgdmFyIHB1enpsZSA9IHtcbiAgICAgIGZlbjogYy5yZXBhaXJGZW4oZmVuKSxcbiAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG5cbiAgICBpZiAoZmVhdHVyZURlc2NyaXB0aW9uID09PSBcIlF1ZWVuIGZvcmtzXCIpIHtcbiAgICAgIHB1enpsZSA9IGZvcmtzKHB1enpsZSwncScpO1xuICAgIH1cbiAgICBpZiAoZmVhdHVyZURlc2NyaXB0aW9uID09PSBcIlJvb2sgZm9ya3NcIikge1xuICAgICAgcHV6emxlID0gZm9ya3MocHV6emxlLCdyJyk7XG4gICAgfVxuICAgIGlmIChmZWF0dXJlRGVzY3JpcHRpb24gPT09IFwiQmlzaG9wIGZvcmtzXCIpIHtcbiAgICAgIHB1enpsZSA9IGZvcmtzKHB1enpsZSwnYicpO1xuICAgIH1cbiAgICBpZiAoZmVhdHVyZURlc2NyaXB0aW9uID09PSBcIktuaWdodCBmb3Jrc1wiKSB7XG4gICAgICBwdXp6bGUgPSBmb3JrcyhwdXp6bGUsJ24nKTtcbiAgICB9XG4gICAgaWYgKGZlYXR1cmVEZXNjcmlwdGlvbiA9PT0gXCJQYXduIGZvcmtzXCIpIHtcbiAgICAgIHB1enpsZSA9IGZvcmtzKHB1enpsZSwncCcpO1xuICAgIH1cblxuICAgIHJldHVybiBwdXp6bGUuZmVhdHVyZXM7XG4gIH0sXG5cbiAgZmVhdHVyZUZvdW5kOiBmdW5jdGlvbihmZWF0dXJlcywgdGFyZ2V0KSB7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgZmVhdHVyZXNcbiAgICAgIC5mb3JFYWNoKGYgPT4ge1xuICAgICAgICBmLnRhcmdldHMuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICBpZiAodC50YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cblxuXG59O1xuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgYWRkQWxpZ25lZChwdXp6bGUuZmVuLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIGFkZEFsaWduZWQoYy5mZW5Gb3JPdGhlclNpZGUocHV6emxlLmZlbiksIHB1enpsZS5mZWF0dXJlcyk7XG4gICAgcmV0dXJuIHB1enpsZTtcbn07XG5cbmZ1bmN0aW9uIGFkZEFsaWduZWQoZmVuLCBmZWF0dXJlcykge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuXG4gICAgdmFyIG1vdmVzID0gY2hlc3MubW92ZXMoe1xuICAgICAgICB2ZXJib3NlOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgcGllY2VzID0gYy5tYWpvclBpZWNlc0ZvckNvbG91cihmZW4sIGNoZXNzLnR1cm4oKSk7XG4gICAgdmFyIG9wcG9uZW50c1BpZWNlcyA9IGMubWFqb3JQaWVjZXNGb3JDb2xvdXIoZmVuLCBjaGVzcy50dXJuKCkgPT0gJ3cnID8gJ2InIDogJ3cnKTtcblxuICAgIHZhciBhbGlnbmVkID0gW107XG4gICAgcGllY2VzLmZvckVhY2goZnJvbSA9PiB7XG4gICAgICAgIHZhciB0eXBlID0gY2hlc3MuZ2V0KGZyb20pLnR5cGU7XG4gICAgICAgIGlmICgodHlwZSAhPT0gJ2snKSAmJiAodHlwZSAhPT0gJ24nKSkge1xuICAgICAgICAgICAgb3Bwb25lbnRzUGllY2VzLmZvckVhY2godG8gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjLmNhbkNhcHR1cmUoZnJvbSwgY2hlc3MuZ2V0KGZyb20pLCB0bywgY2hlc3MuZ2V0KHRvKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF2YWlsYWJsZU9uQm9hcmQgPSBtb3Zlcy5maWx0ZXIobSA9PiBtLmZyb20gPT09IGZyb20gJiYgbS50byA9PT0gdG8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlT25Cb2FyZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXZlYWxpbmdNb3ZlcyA9IGMubW92ZXNUaGF0UmVzdWx0SW5DYXB0dXJlVGhyZWF0KGZlbiwgZnJvbSwgdG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldmVhbGluZ01vdmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbmVkLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpYWdyYW06IGRpYWdyYW0oZnJvbSwgdG8sIHJldmVhbGluZ01vdmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJIaWRkZW4gYXR0YWNrZXJcIixcbiAgICAgICAgc2lkZTogY2hlc3MudHVybigpLFxuICAgICAgICB0YXJnZXRzOiBhbGlnbmVkXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gZGlhZ3JhbShmcm9tLCB0bywgcmV2ZWFsaW5nTW92ZXMpIHtcbiAgICB2YXIgbWFpbiA9IFt7XG4gICAgICAgIG9yaWc6IGZyb20sXG4gICAgICAgIGRlc3Q6IHRvLFxuICAgICAgICBicnVzaDogJ3JlZCdcbiAgICB9XTtcbiAgICB2YXIgcmV2ZWFscyA9IHJldmVhbGluZ01vdmVzLm1hcChtID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9yaWc6IG0uZnJvbSxcbiAgICAgICAgICAgIGRlc3Q6IG0udG8sXG4gICAgICAgICAgICBicnVzaDogJ3BhbGVCbHVlJ1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBtYWluLmNvbmNhdChyZXZlYWxzKTtcbn1cbiIsInZhciBDaGVzcyA9IHJlcXVpcmUoJ2NoZXNzLmpzJykuQ2hlc3M7XG52YXIgYyA9IHJlcXVpcmUoJy4vY2hlc3N1dGlscycpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwdXp6bGUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBhZGRMb29zZVBpZWNlcyhwdXp6bGUuZmVuLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIGFkZExvb3NlUGllY2VzKGMuZmVuRm9yT3RoZXJTaWRlKHB1enpsZS5mZW4pLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIHJldHVybiBwdXp6bGU7XG59O1xuXG5mdW5jdGlvbiBhZGRMb29zZVBpZWNlcyhmZW4sIGZlYXR1cmVzKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIHZhciBraW5nID0gYy5raW5nc1NxdWFyZShmZW4sIGNoZXNzLnR1cm4oKSk7XG4gICAgdmFyIG9wcG9uZW50ID0gY2hlc3MudHVybigpID09PSAndycgPyAnYicgOiAndyc7XG4gICAgdmFyIHBpZWNlcyA9IGMucGllY2VzRm9yQ29sb3VyKGZlbiwgb3Bwb25lbnQpO1xuICAgIHBpZWNlcyA9IHBpZWNlcy5maWx0ZXIoc3F1YXJlID0+ICFjLmlzQ2hlY2tBZnRlclBsYWNpbmdLaW5nQXRTcXVhcmUoZmVuLCBraW5nLCBzcXVhcmUpKTtcbiAgICBmZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiTG9vc2UgcGllY2VzXCIsXG4gICAgICAgIHNpZGU6IG9wcG9uZW50LFxuICAgICAgICB0YXJnZXRzOiBwaWVjZXMubWFwKHQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHQsXG4gICAgICAgICAgICAgICAgZGlhZ3JhbTogW3tcbiAgICAgICAgICAgICAgICAgICAgb3JpZzogdCxcbiAgICAgICAgICAgICAgICAgICAgYnJ1c2g6ICd5ZWxsb3cnXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG4iLCJ2YXIgQ2hlc3MgPSByZXF1aXJlKCdjaGVzcy5qcycpLkNoZXNzO1xudmFyIGMgPSByZXF1aXJlKCcuL2NoZXNzdXRpbHMnKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChwdXp6bGUuZmVuKTtcbiAgICBhZGRNYXRlSW5PbmVUaHJlYXRzKHB1enpsZS5mZW4sIHB1enpsZS5mZWF0dXJlcyk7XG4gICAgYWRkTWF0ZUluT25lVGhyZWF0cyhjLmZlbkZvck90aGVyU2lkZShwdXp6bGUuZmVuKSwgcHV6emxlLmZlYXR1cmVzKTtcbiAgICByZXR1cm4gcHV6emxlO1xufTtcblxuZnVuY3Rpb24gYWRkTWF0ZUluT25lVGhyZWF0cyhmZW4sIGZlYXR1cmVzKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIHZhciBtb3ZlcyA9IGNoZXNzLm1vdmVzKHtcbiAgICAgICAgdmVyYm9zZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbW92ZXMgPSBtb3Zlcy5maWx0ZXIobSA9PiBjYW5NYXRlT25OZXh0VHVybihmZW4sIG0pKTtcblxuICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJNYXRlLWluLTEgdGhyZWF0c1wiLFxuICAgICAgICBzaWRlOiBjaGVzcy50dXJuKCksXG4gICAgICAgIHRhcmdldHM6IG1vdmVzLm1hcChtID0+IHRhcmdldEFuZERpYWdyYW0obSkpXG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gY2FuTWF0ZU9uTmV4dFR1cm4oZmVuLCBtb3ZlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG4gICAgY2hlc3MubW92ZShtb3ZlKTtcbiAgICBpZiAoY2hlc3MuaW5fY2hlY2soKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY2hlc3MubG9hZChjLmZlbkZvck90aGVyU2lkZShjaGVzcy5mZW4oKSkpO1xuICAgIHZhciBtb3ZlcyA9IGNoZXNzLm1vdmVzKHtcbiAgICAgICAgdmVyYm9zZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgLy8gc3R1ZmYgbWF0aW5nIG1vdmVzIGludG8gbW92ZSBvYmplY3QgZm9yIGRpYWdyYW1cbiAgICBtb3ZlLm1hdGluZ01vdmVzID0gbW92ZXMuZmlsdGVyKG0gPT4gLyMvLnRlc3QobS5zYW4pKTtcbiAgICByZXR1cm4gbW92ZS5tYXRpbmdNb3Zlcy5sZW5ndGggPiAwO1xufVxuXG5mdW5jdGlvbiB0YXJnZXRBbmREaWFncmFtKG1vdmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXQ6IG1vdmUudG8sXG4gICAgICAgIGRpYWdyYW06IFt7XG4gICAgICAgICAgICBvcmlnOiBtb3ZlLmZyb20sXG4gICAgICAgICAgICBkZXN0OiBtb3ZlLnRvLFxuICAgICAgICAgICAgYnJ1c2g6IFwicGFsZUdyZWVuXCJcbiAgICAgICAgfV0uY29uY2F0KG1vdmUubWF0aW5nTW92ZXMubWFwKG0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBvcmlnOiBtLmZyb20sXG4gICAgICAgICAgICAgICAgZGVzdDogbS50byxcbiAgICAgICAgICAgICAgICBicnVzaDogXCJwYWxlR3JlZW5cIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkpLmNvbmNhdChtb3ZlLm1hdGluZ01vdmVzLm1hcChtID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3JpZzogbS5mcm9tLFxuICAgICAgICAgICAgICAgIGJydXNoOiBcInBhbGVHcmVlblwiXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSlcbiAgICB9O1xufVxuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHB1enpsZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQocHV6emxlLmZlbik7XG4vLyAgICBhZGRQaW5zRm9yQ3VycmVudFBsYXllcihwdXp6bGUuZmVuLCBwdXp6bGUuZmVhdHVyZXMpO1xuLy8gICAgYWRkUGluc0ZvckN1cnJlbnRQbGF5ZXIoYy5mZW5Gb3JPdGhlclNpZGUocHV6emxlLmZlbiksIHB1enpsZS5mZWF0dXJlcyk7XG4gICAgcmV0dXJuIHB1enpsZTtcbn07XG5cbmZ1bmN0aW9uIGFkZFBpbnNGb3JDdXJyZW50UGxheWVyKGZlbiwgZmVhdHVyZXMpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5sb2FkKGZlbik7XG4gICAgdmFyIHBpZWNlcyA9IGMucGllY2VzRm9yQ29sb3VyKGZlbiwgY2hlc3MudHVybigpKTtcbiAgICB2YXIgcGlubmVkID0gcGllY2VzLmZpbHRlcihzcXVhcmUgPT4gYy5pc0NoZWNrQWZ0ZXJSZW1vdmluZ1BpZWNlQXRTcXVhcmUoZmVuLCBzcXVhcmUpKTtcbiAgICBmZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUGlubmVkIHBpZWNlc1wiLFxuICAgICAgICBzaWRlOiBjaGVzcy50dXJuKCksXG4gICAgICAgIHRhcmdldHM6IHBpbm5lZFxuICAgIH0pO1xuXG59XG4iLCIvKiBnbG9iYWwgaGlzdG9yeSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgZ2V0UGFyYW1ldGVyQnlOYW1lOiBmdW5jdGlvbihuYW1lLCB1cmwpIHtcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB9XG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXG4gICAgICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xuICAgICAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJztcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVVcmxXaXRoU3RhdGU6IGZ1bmN0aW9uKGZlbiwgc2lkZSwgZGVzY3JpcHRpb24sIHRhcmdldCkge1xuICAgICAgICBpZiAoaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBuZXd1cmwgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgK1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgK1xuICAgICAgICAgICAgICAgICc/ZmVuPScgKyBlbmNvZGVVUklDb21wb25lbnQoZmVuKSArXG4gICAgICAgICAgICAgICAgKHNpZGUgPyBcIiZzaWRlPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNpZGUpIDogXCJcIikgK1xuICAgICAgICAgICAgICAgIChkZXNjcmlwdGlvbiA/IFwiJmRlc2NyaXB0aW9uPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGRlc2NyaXB0aW9uKSA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAodGFyZ2V0ID8gXCImdGFyZ2V0PVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHRhcmdldCkgOiBcIlwiKTtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcGF0aDogbmV3dXJsXG4gICAgICAgICAgICB9LCAnJywgbmV3dXJsKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghZSkgdmFyIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgZS5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgIGlmIChlLnN0b3BQcm9wYWdhdGlvbikgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0KSB7XG5cbiAgICB2YXIgb2NjdXJlZCA9IFtdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGxpc3QuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeSh4KTtcbiAgICAgICAgaWYgKCFvY2N1cmVkLmluY2x1ZGVzKGpzb24pKSB7XG4gICAgICAgICAgICBvY2N1cmVkLnB1c2goanNvbik7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIG0gPSAoZnVuY3Rpb24gYXBwKHdpbmRvdywgdW5kZWZpbmVkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcbiAgXHR2YXIgVkVSU0lPTiA9IFwidjAuMi4xXCI7XHJcblx0ZnVuY3Rpb24gaXNGdW5jdGlvbihvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSBcImZ1bmN0aW9uXCI7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIHR5cGUuY2FsbChvYmplY3QpID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcclxuXHR9XHJcblx0dmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xyXG5cdH07XHJcblx0dmFyIHR5cGUgPSB7fS50b1N0cmluZztcclxuXHR2YXIgcGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsuKz9cXF0pL2csIGF0dHJQYXJzZXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vO1xyXG5cdHZhciB2b2lkRWxlbWVudHMgPSAvXihBUkVBfEJBU0V8QlJ8Q09MfENPTU1BTkR8RU1CRUR8SFJ8SU1HfElOUFVUfEtFWUdFTnxMSU5LfE1FVEF8UEFSQU18U09VUkNFfFRSQUNLfFdCUikkLztcclxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdC8vIHNlbGYgaW52b2tpbmcgZnVuY3Rpb24gbmVlZGVkIGJlY2F1c2Ugb2YgdGhlIHdheSBtb2NrcyB3b3JrXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSh3aW5kb3cpIHtcclxuXHRcdCRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHRcdCRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LnNldFRpbWVvdXQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKHdpbmRvdyk7XHJcblxyXG5cdG0udmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFZFUlNJT047XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQHR5cGVkZWYge1N0cmluZ30gVGFnXHJcblx0ICogQSBzdHJpbmcgdGhhdCBsb29rcyBsaWtlIC0+IGRpdi5jbGFzc25hbWUjaWRbcGFyYW09b25lXVtwYXJhbTI9dHdvXVxyXG5cdCAqIFdoaWNoIGRlc2NyaWJlcyBhIERPTSBub2RlXHJcblx0ICovXHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LCBvciBzcGxhdCAob3B0aW9uYWwpXHJcblx0ICpcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKHRhZywgcGFpcnMpIHtcclxuXHRcdGZvciAodmFyIGFyZ3MgPSBbXSwgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XHJcblx0XHR9XHJcblx0XHRpZiAoaXNPYmplY3QodGFnKSkgcmV0dXJuIHBhcmFtZXRlcml6ZSh0YWcsIGFyZ3MpO1xyXG5cdFx0dmFyIGhhc0F0dHJzID0gcGFpcnMgIT0gbnVsbCAmJiBpc09iamVjdChwYWlycykgJiYgIShcInRhZ1wiIGluIHBhaXJzIHx8IFwidmlld1wiIGluIHBhaXJzIHx8IFwic3VidHJlZVwiIGluIHBhaXJzKTtcclxuXHRcdHZhciBhdHRycyA9IGhhc0F0dHJzID8gcGFpcnMgOiB7fTtcclxuXHRcdHZhciBjbGFzc0F0dHJOYW1lID0gXCJjbGFzc1wiIGluIGF0dHJzID8gXCJjbGFzc1wiIDogXCJjbGFzc05hbWVcIjtcclxuXHRcdHZhciBjZWxsID0ge3RhZzogXCJkaXZcIiwgYXR0cnM6IHt9fTtcclxuXHRcdHZhciBtYXRjaCwgY2xhc3NlcyA9IFtdO1xyXG5cdFx0aWYgKCFpc1N0cmluZyh0YWcpKSB0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKTtcclxuXHRcdHdoaWxlICgobWF0Y2ggPSBwYXJzZXIuZXhlYyh0YWcpKSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkgY2VsbC50YWcgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiI1wiKSBjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIi5cIikgY2xhc3Nlcy5wdXNoKG1hdGNoWzJdKTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSBhdHRyUGFyc2VyLmV4ZWMobWF0Y2hbM10pO1xyXG5cdFx0XHRcdGNlbGwuYXR0cnNbcGFpclsxXV0gPSBwYWlyWzNdIHx8IChwYWlyWzJdID8gXCJcIiA6dHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hpbGRyZW4gPSBoYXNBdHRycyA/IGFyZ3Muc2xpY2UoMSkgOiBhcmdzO1xyXG5cdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KGNoaWxkcmVuWzBdKSkge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5bMF07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ck5hbWUgJiYgYXR0cnNbYXR0ck5hbWVdICE9IG51bGwgJiYgYXR0cnNbYXR0ck5hbWVdICE9PSBcIlwiKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXR0cnNbYXR0ck5hbWVdKTtcclxuXHRcdFx0XHRcdGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gXCJcIjsgLy9jcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgY2VsbC5hdHRyc1thdHRyTmFtZV0gPSBhdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjbGFzc2VzLmxlbmd0aCkgY2VsbC5hdHRyc1tjbGFzc0F0dHJOYW1lXSA9IGNsYXNzZXMuam9pbihcIiBcIik7XHJcblxyXG5cdFx0cmV0dXJuIGNlbGw7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGZvckVhY2gobGlzdCwgZikge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aCAmJiAhZihsaXN0W2ldLCBpKyspOykge31cclxuXHR9XHJcblx0ZnVuY3Rpb24gZm9yS2V5cyhsaXN0LCBmKSB7XHJcblx0XHRmb3JFYWNoKGxpc3QsIGZ1bmN0aW9uIChhdHRycywgaSkge1xyXG5cdFx0XHRyZXR1cm4gKGF0dHJzID0gYXR0cnMgJiYgYXR0cnMuYXR0cnMpICYmIGF0dHJzLmtleSAhPSBudWxsICYmIGYoYXR0cnMsIGkpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIFRoaXMgZnVuY3Rpb24gd2FzIGNhdXNpbmcgZGVvcHRzIGluIENocm9tZS5cclxuXHQvLyBXZWxsIG5vIGxvbmdlclxyXG5cdGZ1bmN0aW9uIGRhdGFUb1N0cmluZyhkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSA9PSBudWxsKSByZXR1cm4gJyc7XHJcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSByZXR1cm4gZGF0YTtcclxuICAgIGlmIChkYXRhLnRvU3RyaW5nKCkgPT0gbnVsbCkgcmV0dXJuIFwiXCI7IC8vIHByZXZlbnQgcmVjdXJzaW9uIGVycm9yIG9uIEZGXHJcbiAgICByZXR1cm4gZGF0YTtcclxuXHR9XHJcblx0Ly8gVGhpcyBmdW5jdGlvbiB3YXMgY2F1c2luZyBkZW9wdHMgaW4gQ2hyb21lLlxyXG5cdGZ1bmN0aW9uIGluamVjdFRleHROb2RlKHBhcmVudEVsZW1lbnQsIGZpcnN0LCBpbmRleCwgZGF0YSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBmaXJzdCwgaW5kZXgpO1xyXG5cdFx0XHRmaXJzdC5ub2RlVmFsdWUgPSBkYXRhO1xyXG5cdFx0fSBjYXRjaCAoZSkge30gLy9JRSBlcnJvbmVvdXNseSB0aHJvd3MgZXJyb3Igd2hlbiBhcHBlbmRpbmcgYW4gZW1wdHkgdGV4dCBub2RlIGFmdGVyIGEgbnVsbFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZmxhdHRlbihsaXN0KSB7XHJcblx0XHQvL3JlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoaXNBcnJheShsaXN0W2ldKSkge1xyXG5cdFx0XHRcdGxpc3QgPSBsaXN0LmNvbmNhdC5hcHBseShbXSwgbGlzdCk7XHJcblx0XHRcdFx0Ly9jaGVjayBjdXJyZW50IGluZGV4IGFnYWluIGFuZCBmbGF0dGVuIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGxpc3Q7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpbnNlcnROb2RlKHBhcmVudEVsZW1lbnQsIG5vZGUsIGluZGV4KSB7XHJcblx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpO1xyXG5cdH1cclxuXHJcblx0dmFyIERFTEVUSU9OID0gMSwgSU5TRVJUSU9OID0gMiwgTU9WRSA9IDM7XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXNEaWZmZXIoZGF0YSwgZXhpc3RpbmcsIGNhY2hlZCwgcGFyZW50RWxlbWVudCkge1xyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoa2V5LCBpKSB7XHJcblx0XHRcdGV4aXN0aW5nW2tleSA9IGtleS5rZXldID0gZXhpc3Rpbmdba2V5XSA/IHtcclxuXHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0aW5kZXg6IGksXHJcblx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHwgJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuXHRcdFx0fSA6IHthY3Rpb246IElOU0VSVElPTiwgaW5kZXg6IGl9O1xyXG5cdFx0fSk7XHJcblx0XHR2YXIgYWN0aW9ucyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBleGlzdGluZykgYWN0aW9ucy5wdXNoKGV4aXN0aW5nW3Byb3BdKTtcclxuXHRcdHZhciBjaGFuZ2VzID0gYWN0aW9ucy5zb3J0KHNvcnRDaGFuZ2VzKSwgbmV3Q2FjaGVkID0gbmV3IEFycmF5KGNhY2hlZC5sZW5ndGgpO1xyXG5cdFx0bmV3Q2FjaGVkLm5vZGVzID0gY2FjaGVkLm5vZGVzLnNsaWNlKCk7XHJcblxyXG5cdFx0Zm9yRWFjaChjaGFuZ2VzLCBmdW5jdGlvbiAoY2hhbmdlKSB7XHJcblx0XHRcdHZhciBpbmRleCA9IGNoYW5nZS5pbmRleDtcclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0Y2xlYXIoY2FjaGVkW2luZGV4XS5ub2RlcywgY2FjaGVkW2luZGV4XSk7XHJcblx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IElOU0VSVElPTikge1xyXG5cdFx0XHRcdHZhciBkdW1teSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbaW5kZXhdLmF0dHJzLmtleTtcclxuXHRcdFx0XHRpbnNlcnROb2RlKHBhcmVudEVsZW1lbnQsIGR1bW15LCBpbmRleCk7XHJcblx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShpbmRleCwgMCwge1xyXG5cdFx0XHRcdFx0YXR0cnM6IHtrZXk6IGRhdGFbaW5kZXhdLmF0dHJzLmtleX0sXHJcblx0XHRcdFx0XHRub2RlczogW2R1bW15XVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tpbmRleF0gPSBkdW1teTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IE1PVkUpIHtcclxuXHRcdFx0XHR2YXIgY2hhbmdlRWxlbWVudCA9IGNoYW5nZS5lbGVtZW50O1xyXG5cdFx0XHRcdHZhciBtYXliZUNoYW5nZWQgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0XHRcdGlmIChtYXliZUNoYW5nZWQgIT09IGNoYW5nZUVsZW1lbnQgJiYgY2hhbmdlRWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlRWxlbWVudCwgbWF5YmVDaGFuZ2VkIHx8IG51bGwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdDYWNoZWRbaW5kZXhdID0gY2FjaGVkW2NoYW5nZS5mcm9tXTtcclxuXHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbaW5kZXhdID0gY2hhbmdlRWxlbWVudDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIG5ld0NhY2hlZDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGRpZmZLZXlzKGRhdGEsIGNhY2hlZCwgZXhpc3RpbmcsIHBhcmVudEVsZW1lbnQpIHtcclxuXHRcdHZhciBrZXlzRGlmZmVyID0gZGF0YS5sZW5ndGggIT09IGNhY2hlZC5sZW5ndGg7XHJcblx0XHRpZiAoIWtleXNEaWZmZXIpIHtcclxuXHRcdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoYXR0cnMsIGkpIHtcclxuXHRcdFx0XHR2YXIgY2FjaGVkQ2VsbCA9IGNhY2hlZFtpXTtcclxuXHRcdFx0XHRyZXR1cm4ga2V5c0RpZmZlciA9IGNhY2hlZENlbGwgJiYgY2FjaGVkQ2VsbC5hdHRycyAmJiBjYWNoZWRDZWxsLmF0dHJzLmtleSAhPT0gYXR0cnMua2V5O1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ga2V5c0RpZmZlciA/IGhhbmRsZUtleXNEaWZmZXIoZGF0YSwgZXhpc3RpbmcsIGNhY2hlZCwgcGFyZW50RWxlbWVudCkgOiBjYWNoZWQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkaWZmQXJyYXkoZGF0YSwgY2FjaGVkLCBub2Rlcykge1xyXG5cdFx0Ly9kaWZmIHRoZSBhcnJheSBpdHNlbGZcclxuXHJcblx0XHQvL3VwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKF8sIGkpIHtcclxuXHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpO1xyXG5cdFx0fSlcclxuXHRcdC8vcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyIHRoYW4gdGhlIG9sZCBvbmUuIGlmIGVycm9ycyBldmVyIGhhcHBlbiBoZXJlLCB0aGUgaXNzdWUgaXMgbW9zdCBsaWtlbHlcclxuXHRcdC8vYSBidWcgaW4gdGhlIGNvbnN0cnVjdGlvbiBvZiB0aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdGZvckVhY2goY2FjaGVkLm5vZGVzLCBmdW5jdGlvbiAobm9kZSwgaSkge1xyXG5cdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIGNsZWFyKFtub2RlXSwgW2NhY2hlZFtpXV0pO1xyXG5cdFx0fSlcclxuXHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRBcnJheUtleXMoZGF0YSkge1xyXG5cdFx0dmFyIGd1aWQgPSAwO1xyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGF0dHJzKSB7XHJcblx0XHRcdFx0aWYgKChhdHRycyA9IGF0dHJzICYmIGF0dHJzLmF0dHJzKSAmJiBhdHRycy5rZXkgPT0gbnVsbCkgYXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWF5YmVSZWNyZWF0ZU9iamVjdChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cykge1xyXG5cdFx0Ly9pZiBhbiBlbGVtZW50IGlzIGRpZmZlcmVudCBlbm91Z2ggZnJvbSB0aGUgb25lIGluIGNhY2hlLCByZWNyZWF0ZSBpdFxyXG5cdFx0aWYgKGRhdGEudGFnICE9PSBjYWNoZWQudGFnIHx8XHJcblx0XHRcdFx0ZGF0YUF0dHJLZXlzLnNvcnQoKS5qb2luKCkgIT09IE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuc29ydCgpLmpvaW4oKSB8fFxyXG5cdFx0XHRcdGRhdGEuYXR0cnMuaWQgIT09IGNhY2hlZC5hdHRycy5pZCB8fFxyXG5cdFx0XHRcdGRhdGEuYXR0cnMua2V5ICE9PSBjYWNoZWQuYXR0cnMua2V5IHx8XHJcblx0XHRcdFx0KG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT09IFwiYWxsXCIgJiYgKCFjYWNoZWQuY29uZmlnQ29udGV4dCB8fCBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gIT09IHRydWUpKSB8fFxyXG5cdFx0XHRcdChtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcImRpZmZcIiAmJiBjYWNoZWQuY29uZmlnQ29udGV4dCAmJiBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gPT09IGZhbHNlKSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCkgY2xlYXIoY2FjaGVkLm5vZGVzKTtcclxuXHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGlzRnVuY3Rpb24oY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQpKSBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpO1xyXG5cdFx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0Zm9yRWFjaChjYWNoZWQuY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0XHRpZiAoY29udHJvbGxlci51bmxvYWQpIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldE9iamVjdE5hbWVzcGFjZShkYXRhLCBuYW1lc3BhY2UpIHtcclxuXHRcdHJldHVybiBkYXRhLmF0dHJzLnhtbG5zID8gZGF0YS5hdHRycy54bWxucyA6XHJcblx0XHRcdGRhdGEudGFnID09PSBcInN2Z1wiID8gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIDpcclxuXHRcdFx0ZGF0YS50YWcgPT09IFwibWF0aFwiID8gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCIgOlxyXG5cdFx0XHRuYW1lc3BhY2U7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWRDYWNoZWRDb250cm9sbGVycyhjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycykge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3cztcclxuXHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnM7XHJcblx0XHRcdGZvckVhY2goY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgJiYgY29udHJvbGxlci5vbnVubG9hZC4kb2xkKSBjb250cm9sbGVyLm9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZC4kb2xkO1xyXG5cdFx0XHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgJiYgY29udHJvbGxlci5vbnVubG9hZCkge1xyXG5cdFx0XHRcdFx0dmFyIG9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZDtcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQgPSBub29wO1xyXG5cdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNjaGVkdWxlQ29uZmlnc1RvQmVDYWxsZWQoY29uZmlncywgZGF0YSwgbm9kZSwgaXNOZXcsIGNhY2hlZCkge1xyXG5cdFx0Ly9zY2hlZHVsZSBjb25maWdzIHRvIGJlIGNhbGxlZC4gVGhleSBhcmUgY2FsbGVkIGFmdGVyIGBidWlsZGBcclxuXHRcdC8vZmluaXNoZXMgcnVubmluZ1xyXG5cdFx0aWYgKGlzRnVuY3Rpb24oZGF0YS5hdHRycy5jb25maWcpKSB7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fTtcclxuXHJcblx0XHRcdC8vYmluZFxyXG5cdFx0XHRjb25maWdzLnB1c2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGEuYXR0cnMuY29uZmlnLmNhbGwoZGF0YSwgbm9kZSwgIWlzTmV3LCBjb250ZXh0LCBjYWNoZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkVXBkYXRlZE5vZGUoY2FjaGVkLCBkYXRhLCBlZGl0YWJsZSwgaGFzS2V5cywgbmFtZXNwYWNlLCB2aWV3cywgY29uZmlncywgY29udHJvbGxlcnMpIHtcclxuXHRcdHZhciBub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0aWYgKGhhc0tleXMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIGNhY2hlZC5hdHRycywgbmFtZXNwYWNlKTtcclxuXHRcdGNhY2hlZC5jaGlsZHJlbiA9IGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCBmYWxzZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHJcblx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdGNhY2hlZC52aWV3cyA9IHZpZXdzO1xyXG5cdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVycztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbm9kZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZU5vbmV4aXN0ZW50Tm9kZXMoZGF0YSwgcGFyZW50RWxlbWVudCwgaW5kZXgpIHtcclxuXHRcdHZhciBub2RlcztcclxuXHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXTtcclxuXHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIGluc2VydE5vZGUocGFyZW50RWxlbWVudCwgbm9kZXNbMF0sIGluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2FjaGVkID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGRhdGEgPT09IFwiYm9vbGVhblwiID8gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSkgOiBkYXRhO1xyXG5cdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXM7XHJcblx0XHRyZXR1cm4gY2FjaGVkO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVhdHRhY2hOb2RlcyhkYXRhLCBjYWNoZWQsIHBhcmVudEVsZW1lbnQsIGVkaXRhYmxlLCBpbmRleCwgcGFyZW50VGFnKSB7XHJcblx0XHR2YXIgbm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRpZiAoIWVkaXRhYmxlIHx8IGVkaXRhYmxlICE9PSAkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0ZWxzZSBpZiAocGFyZW50VGFnID09PSBcInRleHRhcmVhXCIpIHtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChlZGl0YWJsZSkge1xyXG5cdFx0XHRcdGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Ly93YXMgYSB0cnVzdGVkIHN0cmluZ1xyXG5cdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpbmplY3RUZXh0Tm9kZShwYXJlbnRFbGVtZW50LCBub2Rlc1swXSwgaW5kZXgsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKTtcclxuXHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzO1xyXG5cdFx0cmV0dXJuIGNhY2hlZDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZVRleHQoY2FjaGVkLCBkYXRhLCBpbmRleCwgcGFyZW50RWxlbWVudCwgc2hvdWxkUmVhdHRhY2gsIGVkaXRhYmxlLCBwYXJlbnRUYWcpIHtcclxuXHRcdC8vaGFuZGxlIHRleHQgbm9kZXNcclxuXHRcdHJldHVybiBjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwID8gaGFuZGxlTm9uZXhpc3RlbnROb2RlcyhkYXRhLCBwYXJlbnRFbGVtZW50LCBpbmRleCkgOlxyXG5cdFx0XHRjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSA/XHJcblx0XHRcdFx0cmVhdHRhY2hOb2RlcyhkYXRhLCBjYWNoZWQsIHBhcmVudEVsZW1lbnQsIGVkaXRhYmxlLCBpbmRleCwgcGFyZW50VGFnKSA6XHJcblx0XHRcdChjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZSwgY2FjaGVkKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFN1YkFycmF5Q291bnQoaXRlbSkge1xyXG5cdFx0aWYgKGl0ZW0uJHRydXN0ZWQpIHtcclxuXHRcdFx0Ly9maXggb2Zmc2V0IG9mIG5leHQgZWxlbWVudCBpZiBpdGVtIHdhcyBhIHRydXN0ZWQgc3RyaW5nIHcvIG1vcmUgdGhhbiBvbmUgaHRtbCBlbGVtZW50XHJcblx0XHRcdC8vdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0Ly90aGUgc2Vjb25kIGNsYXVzZSAoYWZ0ZXIgdGhlIHBpcGUpIG1hdGNoZXMgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbWF0Y2ggPSBpdGVtLm1hdGNoKC88W15cXC9dfFxcPlxccypbXjxdL2cpO1xyXG5cdFx0XHRpZiAobWF0Y2ggIT0gbnVsbCkgcmV0dXJuIG1hdGNoLmxlbmd0aDtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGlzQXJyYXkoaXRlbSkpIHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZEFycmF5KGRhdGEsIGNhY2hlZCwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHBhcmVudFRhZywgc2hvdWxkUmVhdHRhY2gsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdGRhdGEgPSBmbGF0dGVuKGRhdGEpO1xyXG5cdFx0dmFyIG5vZGVzID0gW10sIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoLCBzdWJBcnJheUNvdW50ID0gMDtcclxuXHJcblx0XHQvL2tleXMgYWxnb3JpdGhtOiBzb3J0IGVsZW1lbnRzIHdpdGhvdXQgcmVjcmVhdGluZyB0aGVtIGlmIGtleXMgYXJlIHByZXNlbnRcclxuXHRcdC8vMSkgY3JlYXRlIGEgbWFwIG9mIGFsbCBleGlzdGluZyBrZXlzLCBhbmQgbWFyayBhbGwgZm9yIGRlbGV0aW9uXHJcblx0XHQvLzIpIGFkZCBuZXcga2V5cyB0byBtYXAgYW5kIG1hcmsgdGhlbSBmb3IgYWRkaXRpb25cclxuXHRcdC8vMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0Ly80KSBmb3IgZWFjaCBrZXksIGhhbmRsZSBpdHMgY29ycmVzcG9uZGluZyBhY3Rpb24gYXMgbWFya2VkIGluIHByZXZpb3VzIHN0ZXBzXHJcblx0XHR2YXIgZXhpc3RpbmcgPSB7fSwgc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gZmFsc2U7XHJcblx0XHRmb3JLZXlzKGNhY2hlZCwgZnVuY3Rpb24gKGF0dHJzLCBpKSB7XHJcblx0XHRcdHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IHRydWU7XHJcblx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGJ1aWxkQXJyYXlLZXlzKGRhdGEpO1xyXG5cdFx0aWYgKHNob3VsZE1haW50YWluSWRlbnRpdGllcykgY2FjaGVkID0gZGlmZktleXMoZGF0YSwgY2FjaGVkLCBleGlzdGluZywgcGFyZW50RWxlbWVudCk7XHJcblx0XHQvL2VuZCBrZXkgYWxnb3JpdGhtXHJcblxyXG5cdFx0dmFyIGNhY2hlQ291bnQgPSAwO1xyXG5cdFx0Ly9mYXN0ZXIgZXhwbGljaXRseSB3cml0dGVuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHQvL2RpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgY2FjaGVkLCBpbmRleCwgZGF0YVtpXSwgY2FjaGVkW2NhY2hlQ291bnRdLCBzaG91bGRSZWF0dGFjaCwgaW5kZXggKyBzdWJBcnJheUNvdW50IHx8IHN1YkFycmF5Q291bnQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cclxuXHRcdFx0aWYgKGl0ZW0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGludGFjdCA9IGludGFjdCAmJiBpdGVtLm5vZGVzLmludGFjdDtcclxuXHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IGdldFN1YkFycmF5Q291bnQoaXRlbSk7XHJcblx0XHRcdFx0Y2FjaGVkW2NhY2hlQ291bnQrK10gPSBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFpbnRhY3QpIGRpZmZBcnJheShkYXRhLCBjYWNoZWQsIG5vZGVzKTtcclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1ha2VDYWNoZShkYXRhLCBjYWNoZWQsIGluZGV4LCBwYXJlbnRJbmRleCwgcGFyZW50Q2FjaGUpIHtcclxuXHRcdGlmIChjYWNoZWQgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGNhY2hlZCkgPT09IHR5cGUuY2FsbChkYXRhKSkgcmV0dXJuIGNhY2hlZDtcclxuXHJcblx0XHRcdGlmIChwYXJlbnRDYWNoZSAmJiBwYXJlbnRDYWNoZS5ub2Rlcykge1xyXG5cdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4LCBlbmQgPSBvZmZzZXQgKyAoaXNBcnJheShkYXRhKSA/IGRhdGEgOiBjYWNoZWQubm9kZXMpLmxlbmd0aDtcclxuXHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoY2FjaGVkLm5vZGVzKSB7XHJcblx0XHRcdFx0Y2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3IoKTtcclxuXHRcdC8vaWYgY29uc3RydWN0b3IgY3JlYXRlcyBhIHZpcnR1YWwgZG9tIGVsZW1lbnQsIHVzZSBhIGJsYW5rIG9iamVjdFxyXG5cdFx0Ly9hcyB0aGUgYmFzZSBjYWNoZWQgbm9kZSBpbnN0ZWFkIG9mIGNvcHlpbmcgdGhlIHZpcnR1YWwgZWwgKCMyNzcpXHJcblx0XHRpZiAoY2FjaGVkLnRhZykgY2FjaGVkID0ge307XHJcblx0XHRjYWNoZWQubm9kZXMgPSBbXTtcclxuXHRcdHJldHVybiBjYWNoZWQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3ROb2RlKGRhdGEsIG5hbWVzcGFjZSkge1xyXG5cdFx0cmV0dXJuIG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID9cclxuXHRcdFx0ZGF0YS5hdHRycy5pcyA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKSA6XHJcblx0XHRcdGRhdGEuYXR0cnMuaXMgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbnN0cnVjdEF0dHJzKGRhdGEsIG5vZGUsIG5hbWVzcGFjZSwgaGFzS2V5cykge1xyXG5cdFx0cmV0dXJuIGhhc0tleXMgPyBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCB7fSwgbmFtZXNwYWNlKSA6IGRhdGEuYXR0cnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3RDaGlsZHJlbihkYXRhLCBub2RlLCBjYWNoZWQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdHJldHVybiBkYXRhLmNoaWxkcmVuICE9IG51bGwgJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwID9cclxuXHRcdFx0YnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIHRydWUsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0ZGF0YS5jaGlsZHJlbjtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlY29uc3RydWN0Q2FjaGVkKGRhdGEsIGF0dHJzLCBjaGlsZHJlbiwgbm9kZSwgbmFtZXNwYWNlLCB2aWV3cywgY29udHJvbGxlcnMpIHtcclxuXHRcdHZhciBjYWNoZWQgPSB7dGFnOiBkYXRhLnRhZywgYXR0cnM6IGF0dHJzLCBjaGlsZHJlbjogY2hpbGRyZW4sIG5vZGVzOiBbbm9kZV19O1xyXG5cdFx0dW5sb2FkQ2FjaGVkQ29udHJvbGxlcnMoY2FjaGVkLCB2aWV3cywgY29udHJvbGxlcnMpO1xyXG5cdFx0aWYgKGNhY2hlZC5jaGlsZHJlbiAmJiAhY2FjaGVkLmNoaWxkcmVuLm5vZGVzKSBjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXTtcclxuXHRcdC8vZWRnZSBjYXNlOiBzZXR0aW5nIHZhbHVlIG9uIDxzZWxlY3Q+IGRvZXNuJ3Qgd29yayBiZWZvcmUgY2hpbGRyZW4gZXhpc3QsIHNvIHNldCBpdCBhZ2FpbiBhZnRlciBjaGlsZHJlbiBoYXZlIGJlZW4gY3JlYXRlZFxyXG5cdFx0aWYgKGRhdGEudGFnID09PSBcInNlbGVjdFwiICYmIFwidmFsdWVcIiBpbiBkYXRhLmF0dHJzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCB7dmFsdWU6IGRhdGEuYXR0cnMudmFsdWV9LCB7fSwgbmFtZXNwYWNlKTtcclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldENvbnRyb2xsZXIodmlld3MsIHZpZXcsIGNhY2hlZENvbnRyb2xsZXJzLCBjb250cm9sbGVyKSB7XHJcblx0XHR2YXIgY29udHJvbGxlckluZGV4ID0gbS5yZWRyYXcuc3RyYXRlZ3koKSA9PT0gXCJkaWZmXCIgJiYgdmlld3MgPyB2aWV3cy5pbmRleE9mKHZpZXcpIDogLTE7XHJcblx0XHRyZXR1cm4gY29udHJvbGxlckluZGV4ID4gLTEgPyBjYWNoZWRDb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdIDpcclxuXHRcdFx0dHlwZW9mIGNvbnRyb2xsZXIgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBjb250cm9sbGVyKCkgOiB7fTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHVwZGF0ZUxpc3RzKHZpZXdzLCBjb250cm9sbGVycywgdmlldywgY29udHJvbGxlcikge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgIT0gbnVsbCkgdW5sb2FkZXJzLnB1c2goe2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWR9KTtcclxuXHRcdHZpZXdzLnB1c2godmlldyk7XHJcblx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2hlY2tWaWV3KGRhdGEsIHZpZXcsIGNhY2hlZCwgY2FjaGVkQ29udHJvbGxlcnMsIGNvbnRyb2xsZXJzLCB2aWV3cykge1xyXG5cdFx0dmFyIGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGNhY2hlZC52aWV3cywgdmlldywgY2FjaGVkQ29udHJvbGxlcnMsIGRhdGEuY29udHJvbGxlcik7XHJcblx0XHQvL0Zhc3RlciB0byBjb2VyY2UgdG8gbnVtYmVyIGFuZCBjaGVjayBmb3IgTmFOXHJcblx0XHR2YXIga2V5ID0gKyhkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXkpO1xyXG5cdFx0ZGF0YSA9IHBlbmRpbmdSZXF1ZXN0cyA9PT0gMCB8fCBmb3JjaW5nIHx8IGNhY2hlZENvbnRyb2xsZXJzICYmIGNhY2hlZENvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlcikgPiAtMSA/IGRhdGEudmlldyhjb250cm9sbGVyKSA6IHt0YWc6IFwicGxhY2Vob2xkZXJcIn07XHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0aWYgKGtleSA9PT0ga2V5KSAoZGF0YS5hdHRycyA9IGRhdGEuYXR0cnMgfHwge30pLmtleSA9IGtleTtcclxuXHRcdHVwZGF0ZUxpc3RzKHZpZXdzLCBjb250cm9sbGVycywgdmlldywgY29udHJvbGxlcik7XHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1hcmtWaWV3cyhkYXRhLCBjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycykge1xyXG5cdFx0dmFyIGNhY2hlZENvbnRyb2xsZXJzID0gY2FjaGVkICYmIGNhY2hlZC5jb250cm9sbGVycztcclxuXHRcdHdoaWxlIChkYXRhLnZpZXcgIT0gbnVsbCkgZGF0YSA9IGNoZWNrVmlldyhkYXRhLCBkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlldywgY2FjaGVkLCBjYWNoZWRDb250cm9sbGVycywgY29udHJvbGxlcnMsIHZpZXdzKTtcclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRPYmplY3QoZGF0YSwgY2FjaGVkLCBlZGl0YWJsZSwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHNob3VsZFJlYXR0YWNoLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdHZhciB2aWV3cyA9IFtdLCBjb250cm9sbGVycyA9IFtdO1xyXG5cdFx0ZGF0YSA9IG1hcmtWaWV3cyhkYXRhLCBjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycyk7XHJcblx0XHRpZiAoIWRhdGEudGFnICYmIGNvbnRyb2xsZXJzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHRlbXBsYXRlIG11c3QgcmV0dXJuIGEgdmlydHVhbCBlbGVtZW50LCBub3QgYW4gYXJyYXksIHN0cmluZywgZXRjLlwiKTtcclxuXHRcdGRhdGEuYXR0cnMgPSBkYXRhLmF0dHJzIHx8IHt9O1xyXG5cdFx0Y2FjaGVkLmF0dHJzID0gY2FjaGVkLmF0dHJzIHx8IHt9O1xyXG5cdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpO1xyXG5cdFx0dmFyIGhhc0tleXMgPSBkYXRhQXR0cktleXMubGVuZ3RoID4gKFwia2V5XCIgaW4gZGF0YS5hdHRycyA/IDEgOiAwKTtcclxuXHRcdG1heWJlUmVjcmVhdGVPYmplY3QoZGF0YSwgY2FjaGVkLCBkYXRhQXR0cktleXMpO1xyXG5cdFx0aWYgKCFpc1N0cmluZyhkYXRhLnRhZykpIHJldHVybjtcclxuXHRcdHZhciBpc05ldyA9IGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDA7XHJcblx0XHRuYW1lc3BhY2UgPSBnZXRPYmplY3ROYW1lc3BhY2UoZGF0YSwgbmFtZXNwYWNlKTtcclxuXHRcdHZhciBub2RlO1xyXG5cdFx0aWYgKGlzTmV3KSB7XHJcblx0XHRcdG5vZGUgPSBjb25zdHJ1Y3ROb2RlKGRhdGEsIG5hbWVzcGFjZSk7XHJcblx0XHRcdC8vc2V0IGF0dHJpYnV0ZXMgZmlyc3QsIHRoZW4gY3JlYXRlIGNoaWxkcmVuXHJcblx0XHRcdHZhciBhdHRycyA9IGNvbnN0cnVjdEF0dHJzKGRhdGEsIG5vZGUsIG5hbWVzcGFjZSwgaGFzS2V5cylcclxuXHRcdFx0dmFyIGNoaWxkcmVuID0gY29uc3RydWN0Q2hpbGRyZW4oZGF0YSwgbm9kZSwgY2FjaGVkLCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0Y2FjaGVkID0gcmVjb25zdHJ1Y3RDYWNoZWQoZGF0YSwgYXR0cnMsIGNoaWxkcmVuLCBub2RlLCBuYW1lc3BhY2UsIHZpZXdzLCBjb250cm9sbGVycyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bm9kZSA9IGJ1aWxkVXBkYXRlZE5vZGUoY2FjaGVkLCBkYXRhLCBlZGl0YWJsZSwgaGFzS2V5cywgbmFtZXNwYWNlLCB2aWV3cywgY29uZmlncywgY29udHJvbGxlcnMpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzTmV3IHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlICYmIG5vZGUgIT0gbnVsbCkgaW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2RlLCBpbmRleCk7XHJcblx0XHQvL3NjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYFxyXG5cdFx0Ly9maW5pc2hlcyBydW5uaW5nXHJcblx0XHRzY2hlZHVsZUNvbmZpZ3NUb0JlQ2FsbGVkKGNvbmZpZ3MsIGRhdGEsIG5vZGUsIGlzTmV3LCBjYWNoZWQpO1xyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBwYXJlbnRDYWNoZSwgcGFyZW50SW5kZXgsIGRhdGEsIGNhY2hlZCwgc2hvdWxkUmVhdHRhY2gsIGluZGV4LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSB7XHJcblx0XHQvL2BidWlsZGAgaXMgYSByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBtYW5hZ2VzIGNyZWF0aW9uL2RpZmZpbmcvcmVtb3ZhbFxyXG5cdFx0Ly9vZiBET00gZWxlbWVudHMgYmFzZWQgb24gY29tcGFyaXNvbiBiZXR3ZWVuIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vdGhlIGRpZmYgYWxnb3JpdGhtIGNhbiBiZSBzdW1tYXJpemVkIGFzIHRoaXM6XHJcblx0XHQvLzEgLSBjb21wYXJlIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vMiAtIGlmIHRoZXkgYXJlIGRpZmZlcmVudCwgY29weSBgZGF0YWAgdG8gYGNhY2hlZGAgYW5kIHVwZGF0ZSB0aGUgRE9NXHJcblx0XHQvLyAgICBiYXNlZCBvbiB3aGF0IHRoZSBkaWZmZXJlbmNlIGlzXHJcblx0XHQvLzMgLSByZWN1cnNpdmVseSBhcHBseSB0aGlzIGFsZ29yaXRobSBmb3IgZXZlcnkgYXJyYXkgYW5kIGZvciB0aGVcclxuXHRcdC8vICAgIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cclxuXHRcdC8vdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91c1xyXG5cdFx0Ly9yZWRyYXcncyBgZGF0YWAgZGF0YSBzdHJ1Y3R1cmUsIHdpdGggYSBmZXcgYWRkaXRpb25zOlxyXG5cdFx0Ly8tIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mXHJcblx0XHQvLyAgIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlXHJcblx0XHQvLyAgIHJlc3BlY3RpdmUgdmlydHVhbCBlbGVtZW50XHJcblx0XHQvLy0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLFxyXG5cdFx0Ly8gICBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhc1xyXG5cdFx0Ly8gICBhIHN0cmluZywgdGhlbiBjYWNoZWQgaXMgYSBTdHJpbmcgaW5zdGFuY2UuIElmIGRhdGEgd2FzIGBudWxsYCBvclxyXG5cdFx0Ly8gICBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0Ly8tIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZVxyXG5cdFx0Ly8gICBzdG9yYWdlIG9iamVjdCBleHBvc2VkIGJ5IGNvbmZpZyhlbGVtZW50LCBpc0luaXRpYWxpemVkLCBjb250ZXh0KVxyXG5cdFx0Ly8tIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuXHJcblx0XHQvLyAgIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYVxyXG5cdFx0Ly8gICBTdHJpbmcsIE51bWJlciBvciBCb29sZWFuLCBpdCByZXByZXNlbnRzIGEgdGV4dCBub2RlXHJcblxyXG5cdFx0Ly9gcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0Ly9gcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhXHJcblx0XHQvL3ZhbHVlc1xyXG5cdFx0Ly9gcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0Ly9gcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy5cclxuXHRcdC8vVGhleSdyZSBhcnRpZmFjdHMgZnJvbSBiZWZvcmUgYXJyYXlzIHN0YXJ0ZWQgYmVpbmcgZmxhdHRlbmVkIGFuZCBhcmVcclxuXHRcdC8vbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0Ly9gZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmdcclxuXHRcdC8vZGlmZmVkXHJcblx0XHQvL2BzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhc1xyXG5cdFx0Ly9yZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdFxyXG5cdFx0Ly9yZWF0dGFjaCBpdHNlbGYgdG8gdGhlIG5ldyBwYXJlbnQpXHJcblx0XHQvL2BlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXNcclxuXHRcdC8vY29udGVudGVkaXRhYmxlXHJcblx0XHQvL2BuYW1lc3BhY2VgIGluZGljYXRlcyB0aGUgY2xvc2VzdCBIVE1MIG5hbWVzcGFjZSBhcyBpdCBjYXNjYWRlcyBkb3duXHJcblx0XHQvL2Zyb20gYW4gYW5jZXN0b3JcclxuXHRcdC8vYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdFxyXG5cdFx0Ly9gYnVpbGRgIGNhbGwgZmluaXNoZXMgcnVubmluZ1xyXG5cclxuXHRcdC8vdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZFxyXG5cdFx0Ly9kYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdC8vLSB0aGlzIHByZXZlbnRzIGxpZmVjeWNsZSBzdXJwcmlzZXMgZnJvbSBwcm9jZWR1cmFsIGhlbHBlcnMgdGhhdCBtaXhcclxuXHRcdC8vICBpbXBsaWNpdCBhbmQgZXhwbGljaXQgcmV0dXJuIHN0YXRlbWVudHMgKGUuZy5cclxuXHRcdC8vICBmdW5jdGlvbiBmb28oKSB7aWYgKGNvbmQpIHJldHVybiBtKFwiZGl2XCIpfVxyXG5cdFx0Ly8tIGl0IHNpbXBsaWZpZXMgZGlmZmluZyBjb2RlXHJcblx0XHRkYXRhID0gZGF0YVRvU3RyaW5nKGRhdGEpO1xyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZDtcclxuXHRcdGNhY2hlZCA9IG1ha2VDYWNoZShkYXRhLCBjYWNoZWQsIGluZGV4LCBwYXJlbnRJbmRleCwgcGFyZW50Q2FjaGUpO1xyXG5cdFx0cmV0dXJuIGlzQXJyYXkoZGF0YSkgPyBidWlsZEFycmF5KGRhdGEsIGNhY2hlZCwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHBhcmVudFRhZywgc2hvdWxkUmVhdHRhY2gsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0ZGF0YSAhPSBudWxsICYmIGlzT2JqZWN0KGRhdGEpID8gYnVpbGRPYmplY3QoZGF0YSwgY2FjaGVkLCBlZGl0YWJsZSwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHNob3VsZFJlYXR0YWNoLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0IWlzRnVuY3Rpb24oZGF0YSkgPyBoYW5kbGVUZXh0KGNhY2hlZCwgZGF0YSwgaW5kZXgsIHBhcmVudEVsZW1lbnQsIHNob3VsZFJlYXR0YWNoLCBlZGl0YWJsZSwgcGFyZW50VGFnKSA6XHJcblx0XHRcdGNhY2hlZDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gc29ydENoYW5nZXMoYSwgYikgeyByZXR1cm4gYS5hY3Rpb24gLSBiLmFjdGlvbiB8fCBhLmluZGV4IC0gYi5pbmRleDsgfVxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHQvL2Bjb25maWdgIGlzbid0IGEgcmVhbCBhdHRyaWJ1dGVzLCBzbyBpZ25vcmUgaXRcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT09IFwia2V5XCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdC8vaG9vayBldmVudCBoYW5kbGVycyB0byB0aGUgYXV0by1yZWRyYXdpbmcgc3lzdGVtXHJcblx0XHRcdFx0ZWxzZSBpZiAoaXNGdW5jdGlvbihkYXRhQXR0cikgJiYgYXR0ck5hbWUuc2xpY2UoMCwgMikgPT09IFwib25cIikge1xyXG5cdFx0XHRcdG5vZGVbYXR0ck5hbWVdID0gYXV0b3JlZHJhdyhkYXRhQXR0ciwgbm9kZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vaGFuZGxlIGBzdHlsZTogey4uLn1gXHJcblx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIiAmJiBkYXRhQXR0ciAhPSBudWxsICYmIGlzT2JqZWN0KGRhdGFBdHRyKSkge1xyXG5cdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNhY2hlZEF0dHIgPT0gbnVsbCB8fCBjYWNoZWRBdHRyW3J1bGVdICE9PSBkYXRhQXR0cltydWxlXSkgbm9kZS5zdHlsZVtydWxlXSA9IGRhdGFBdHRyW3J1bGVdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGNhY2hlZEF0dHIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCEocnVsZSBpbiBkYXRhQXR0cikpIG5vZGUuc3R5bGVbcnVsZV0gPSBcIlwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9oYW5kbGUgU1ZHXHJcblx0XHRcdFx0ZWxzZSBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiaHJlZlwiKSBub2RlLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBcImhyZWZcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUgPT09IFwiY2xhc3NOYW1lXCIgPyBcImNsYXNzXCIgOiBhdHRyTmFtZSwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0Ly8tIGxpc3QgYW5kIGZvcm0gYXJlIHR5cGljYWxseSB1c2VkIGFzIHN0cmluZ3MsIGJ1dCBhcmUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlcyBpbiBqc1xyXG5cdFx0XHRcdC8vLSB3aGVuIHVzaW5nIENTUyBzZWxlY3RvcnMgKGUuZy4gYG0oXCJbc3R5bGU9JyddXCIpYCksIHN0eWxlIGlzIHVzZWQgYXMgYSBzdHJpbmcsIGJ1dCBpdCdzIGFuIG9iamVjdCBpbiBqc1xyXG5cdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgYXR0ck5hbWUgIT09IFwibGlzdFwiICYmIGF0dHJOYW1lICE9PSBcInN0eWxlXCIgJiYgYXR0ck5hbWUgIT09IFwiZm9ybVwiICYmIGF0dHJOYW1lICE9PSBcInR5cGVcIiAmJiBhdHRyTmFtZSAhPT0gXCJ3aWR0aFwiICYmIGF0dHJOYW1lICE9PSBcImhlaWdodFwiKSB7XHJcblx0XHRcdFx0Ly8jMzQ4IGRvbid0IHNldCB0aGUgdmFsdWUgaWYgbm90IG5lZWRlZCBvdGhlcndpc2UgY3Vyc29yIHBsYWNlbWVudCBicmVha3MgaW4gQ2hyb21lXHJcblx0XHRcdFx0aWYgKHRhZyAhPT0gXCJpbnB1dFwiIHx8IG5vZGVbYXR0ck5hbWVdICE9PSBkYXRhQXR0cikgbm9kZVthdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIzM0OCBkYXRhQXR0ciBtYXkgbm90IGJlIGEgc3RyaW5nLCBzbyB1c2UgbG9vc2UgY29tcGFyaXNvbiAoZG91YmxlIGVxdWFsKSBpbnN0ZWFkIG9mIHN0cmljdCAodHJpcGxlIGVxdWFsKVxyXG5cdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJ2YWx1ZVwiICYmIHRhZyA9PT0gXCJpbnB1dFwiICYmIG5vZGUudmFsdWUgIT0gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRub2RlLnZhbHVlID0gZGF0YUF0dHI7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjYWNoZWRBdHRycztcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xlYXIobm9kZXMsIGNhY2hlZCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IG5vZGVzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XHJcblx0XHRcdGlmIChub2Rlc1tpXSAmJiBub2Rlc1tpXS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdFx0dHJ5IHsgbm9kZXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSk7IH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge30gLy9pZ25vcmUgaWYgdGhpcyBmYWlscyBkdWUgdG8gb3JkZXIgb2YgZXZlbnRzIChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0pIHVubG9hZChjYWNoZWRbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL3JlbGVhc2UgbWVtb3J5IGlmIG5vZGVzIGlzIGFuIGFycmF5LiBUaGlzIGNoZWNrIHNob3VsZCBmYWlsIGlmIG5vZGVzIGlzIGEgTm9kZUxpc3QgKHNlZSBsb29wIGFib3ZlKVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCkgbm9kZXMubGVuZ3RoID0gMDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gdW5sb2FkKGNhY2hlZCkge1xyXG5cdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGlzRnVuY3Rpb24oY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQpKSB7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKCk7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yRWFjaChjYWNoZWQuY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGlzRnVuY3Rpb24oY29udHJvbGxlci5vbnVubG9hZCkpIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNhY2hlZC5jaGlsZHJlbikge1xyXG5cdFx0XHRpZiAoaXNBcnJheShjYWNoZWQuY2hpbGRyZW4pKSBmb3JFYWNoKGNhY2hlZC5jaGlsZHJlbiwgdW5sb2FkKTtcclxuXHRcdFx0ZWxzZSBpZiAoY2FjaGVkLmNoaWxkcmVuLnRhZykgdW5sb2FkKGNhY2hlZC5jaGlsZHJlbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaW5zZXJ0QWRqYWNlbnRCZWZvcmVFbmQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHJhbmdlU3RyYXRlZ3kgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCwgZGF0YSkge1xyXG5cdFx0XHRwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKCRkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChkYXRhKSk7XHJcblx0XHR9O1xyXG5cdFx0dmFyIGluc2VydEFkamFjZW50U3RyYXRlZ3kgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCwgZGF0YSkge1xyXG5cdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBkYXRhKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0JGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCd4Jyk7XHJcblx0XHRcdHJldHVybiByYW5nZVN0cmF0ZWd5O1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gaW5zZXJ0QWRqYWNlbnRTdHJhdGVneTtcclxuXHRcdH1cclxuXHR9KSgpO1xyXG5cclxuXHRmdW5jdGlvbiBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHZhciBpc0VsZW1lbnQgPSBuZXh0U2libGluZy5ub2RlVHlwZSAhPT0gMTtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVyID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cdFx0XHRpZiAoaXNFbGVtZW50KSB7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIG5leHRTaWJsaW5nIHx8IG51bGwpO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgbmV4dFNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGluc2VydEFkamFjZW50QmVmb3JlRW5kKHBhcmVudEVsZW1lbnQsIGRhdGEpO1xyXG5cclxuXHRcdHZhciBub2RlcyA9IFtdO1xyXG5cdFx0d2hpbGUgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gIT09IG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdG5vZGVzLnB1c2gocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRcdGluZGV4Kys7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9kZXM7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGF1dG9yZWRyYXcoY2FsbGJhY2ssIG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHRyeSB7IHJldHVybiBjYWxsYmFjay5jYWxsKG9iamVjdCwgZSk7IH1cclxuXHRcdFx0ZmluYWxseSB7XHJcblx0XHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dmFyIGh0bWw7XHJcblx0dmFyIGRvY3VtZW50Tm9kZSA9IHtcclxuXHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIik7XHJcblx0XHRcdGlmICgkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgJGRvY3VtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cdFx0XHR0aGlzLmNoaWxkTm9kZXMgPSAkZG9jdW1lbnQuY2hpbGROb2RlcztcclxuXHRcdH0sXHJcblx0XHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChub2RlKTtcclxuXHRcdH0sXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH07XHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdLCBjZWxsQ2FjaGUgPSB7fTtcclxuXHRtLnJlbmRlciA9IGZ1bmN0aW9uKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXTtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpO1xyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0dmFyIGlzRG9jdW1lbnRSb290ID0gcm9vdCA9PT0gJGRvY3VtZW50O1xyXG5cdFx0dmFyIG5vZGUgPSBpc0RvY3VtZW50Um9vdCB8fCByb290ID09PSAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnROb2RlIDogcm9vdDtcclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPT0gXCJodG1sXCIpIGNlbGwgPSB7dGFnOiBcImh0bWxcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogY2VsbH07XHJcblx0XHRpZiAoY2VsbENhY2hlW2lkXSA9PT0gdW5kZWZpbmVkKSBjbGVhcihub2RlLmNoaWxkTm9kZXMpO1xyXG5cdFx0aWYgKGZvcmNlUmVjcmVhdGlvbiA9PT0gdHJ1ZSkgcmVzZXQocm9vdCk7XHJcblx0XHRjZWxsQ2FjaGVbaWRdID0gYnVpbGQobm9kZSwgbnVsbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNlbGwsIGNlbGxDYWNoZVtpZF0sIGZhbHNlLCAwLCBudWxsLCB1bmRlZmluZWQsIGNvbmZpZ3MpO1xyXG5cdFx0Zm9yRWFjaChjb25maWdzLCBmdW5jdGlvbiAoY29uZmlnKSB7IGNvbmZpZygpOyB9KTtcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGdldENlbGxDYWNoZUtleShlbGVtZW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBub2RlQ2FjaGUuaW5kZXhPZihlbGVtZW50KTtcclxuXHRcdHJldHVybiBpbmRleCA8IDAgPyBub2RlQ2FjaGUucHVzaChlbGVtZW50KSAtIDEgOiBpbmRleDtcclxuXHR9XHJcblxyXG5cdG0udHJ1c3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlLiR0cnVzdGVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXR0ZXJzZXR0ZXIoc3RvcmUpIHtcclxuXHRcdHZhciBwcm9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSBzdG9yZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0cmV0dXJuIHN0b3JlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRwcm9wLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RvcmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBwcm9wO1xyXG5cdH1cclxuXHJcblx0bS5wcm9wID0gZnVuY3Rpb24gKHN0b3JlKSB7XHJcblx0XHQvL25vdGU6IHVzaW5nIG5vbi1zdHJpY3QgZXF1YWxpdHkgY2hlY2sgaGVyZSBiZWNhdXNlIHdlJ3JlIGNoZWNraW5nIGlmIHN0b3JlIGlzIG51bGwgT1IgdW5kZWZpbmVkXHJcblx0XHRpZiAoKHN0b3JlICE9IG51bGwgJiYgaXNPYmplY3Qoc3RvcmUpIHx8IGlzRnVuY3Rpb24oc3RvcmUpKSAmJiBpc0Z1bmN0aW9uKHN0b3JlLnRoZW4pKSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHN0b3JlKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZ2V0dGVyc2V0dGVyKHN0b3JlKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgcm9vdHMgPSBbXSwgY29tcG9uZW50cyA9IFtdLCBjb250cm9sbGVycyA9IFtdLCBsYXN0UmVkcmF3SWQgPSBudWxsLCBsYXN0UmVkcmF3Q2FsbFRpbWUgPSAwLCBjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGwsIGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsIHRvcENvbXBvbmVudCwgdW5sb2FkZXJzID0gW107XHJcblx0dmFyIEZSQU1FX0JVREdFVCA9IDE2OyAvLzYwIGZyYW1lcyBwZXIgc2Vjb25kID0gMSBjYWxsIHBlciAxNiBtc1xyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJncykgfHwgdGhpcztcclxuXHRcdH07XHJcblx0XHRpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIGNvbnRyb2xsZXIucHJvdG90eXBlID0gY29tcG9uZW50LmNvbnRyb2xsZXIucHJvdG90eXBlO1xyXG5cdFx0dmFyIHZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XHJcblx0XHRcdHZhciBjdXJyZW50QXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJncy5jb25jYXQoW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSA6IGFyZ3M7XHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGN1cnJlbnRBcmdzID8gW2N0cmxdLmNvbmNhdChjdXJyZW50QXJncykgOiBbY3RybF0pO1xyXG5cdFx0fTtcclxuXHRcdHZpZXcuJG9yaWdpbmFsID0gY29tcG9uZW50LnZpZXc7XHJcblx0XHR2YXIgb3V0cHV0ID0ge2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIHZpZXc6IHZpZXd9O1xyXG5cdFx0aWYgKGFyZ3NbMF0gJiYgYXJnc1swXS5rZXkgIT0gbnVsbCkgb3V0cHV0LmF0dHJzID0ge2tleTogYXJnc1swXS5rZXl9O1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9XHJcblx0bS5jb21wb25lbnQgPSBmdW5jdGlvbihjb21wb25lbnQpIHtcclxuXHRcdGZvciAodmFyIGFyZ3MgPSBbXSwgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xyXG5cdFx0cmV0dXJuIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpO1xyXG5cdH07XHJcblx0bS5tb3VudCA9IG0ubW9kdWxlID0gZnVuY3Rpb24ocm9vdCwgY29tcG9uZW50KSB7XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaW5kZXggPSByb290cy5pbmRleE9mKHJvb3QpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcblx0XHR2YXIgZXZlbnQgPSB7cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1ByZXZlbnRlZCA9IHRydWU7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbDtcclxuXHRcdH19O1xyXG5cclxuXHRcdGZvckVhY2godW5sb2FkZXJzLCBmdW5jdGlvbiAodW5sb2FkZXIpIHtcclxuXHRcdFx0dW5sb2FkZXIuaGFuZGxlci5jYWxsKHVubG9hZGVyLmNvbnRyb2xsZXIsIGV2ZW50KTtcclxuXHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IG51bGw7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0Zm9yRWFjaCh1bmxvYWRlcnMsIGZ1bmN0aW9uICh1bmxvYWRlcikge1xyXG5cdFx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgdW5sb2FkZXJzID0gW107XHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzW2luZGV4XSAmJiBpc0Z1bmN0aW9uKGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCkpIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaXNOdWxsQ29tcG9uZW50ID0gY29tcG9uZW50ID09PSBudWxsO1xyXG5cclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyb290c1tpbmRleF0gPSByb290O1xyXG5cdFx0XHR2YXIgY3VycmVudENvbXBvbmVudCA9IGNvbXBvbmVudCA/ICh0b3BDb21wb25lbnQgPSBjb21wb25lbnQpIDogKHRvcENvbXBvbmVudCA9IGNvbXBvbmVudCA9IHtjb250cm9sbGVyOiBub29wfSk7XHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IChjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wKSgpO1xyXG5cdFx0XHQvL2NvbnRyb2xsZXJzIG1heSBjYWxsIG0ubW91bnQgcmVjdXJzaXZlbHkgKHZpYSBtLnJvdXRlIHJlZGlyZWN0cywgZm9yIGV4YW1wbGUpXHJcblx0XHRcdC8vdGhpcyBjb25kaXRpb25hbCBlbnN1cmVzIG9ubHkgdGhlIGxhc3QgcmVjdXJzaXZlIG0ubW91bnQgY2FsbCBpcyBhcHBsaWVkXHJcblx0XHRcdGlmIChjdXJyZW50Q29tcG9uZW50ID09PSB0b3BDb21wb25lbnQpIHtcclxuXHRcdFx0XHRjb250cm9sbGVyc1tpbmRleF0gPSBjb250cm9sbGVyO1xyXG5cdFx0XHRcdGNvbXBvbmVudHNbaW5kZXhdID0gY29tcG9uZW50O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0aWYgKGlzTnVsbENvbXBvbmVudCkge1xyXG5cdFx0XHRcdHJlbW92ZVJvb3RFbGVtZW50KHJvb3QsIGluZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY29udHJvbGxlcnNbaW5kZXhdO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzTnVsbENvbXBvbmVudCkge1xyXG5cdFx0XHRyZW1vdmVSb290RWxlbWVudChyb290LCBpbmRleCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gcmVtb3ZlUm9vdEVsZW1lbnQocm9vdCwgaW5kZXgpIHtcclxuXHRcdHJvb3RzLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRjb250cm9sbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0Y29tcG9uZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0cmVzZXQocm9vdCk7XHJcblx0XHRub2RlQ2FjaGUuc3BsaWNlKGdldENlbGxDYWNoZUtleShyb290KSwgMSk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVkcmF3aW5nID0gZmFsc2UsIGZvcmNpbmcgPSBmYWxzZTtcclxuXHRtLnJlZHJhdyA9IGZ1bmN0aW9uKGZvcmNlKSB7XHJcblx0XHRpZiAocmVkcmF3aW5nKSByZXR1cm47XHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlO1xyXG5cdFx0aWYgKGZvcmNlKSBmb3JjaW5nID0gdHJ1ZTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdC8vbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0XHQvL2xhc3RSZWRyYXdJRCBpcyBudWxsIGlmIGl0J3MgdGhlIGZpcnN0IHJlZHJhdyBhbmQgbm90IGFuIGV2ZW50IGhhbmRsZXJcclxuXHRcdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiAhZm9yY2UpIHtcclxuXHRcdFx0XHQvL3doZW4gc2V0VGltZW91dDogb25seSByZXNjaGVkdWxlIHJlZHJhdyBpZiB0aW1lIGJldHdlZW4gbm93IGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXAgY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdFx0Ly93aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdFx0aWYgKCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgbmV3IERhdGUgLSBsYXN0UmVkcmF3Q2FsbFRpbWUgPiBGUkFNRV9CVURHRVQpIHtcclxuXHRcdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKTtcclxuXHRcdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3LCBGUkFNRV9CVURHRVQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZWRyYXcoKTtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsYXN0UmVkcmF3SWQgPSBudWxsOyB9LCBGUkFNRV9CVURHRVQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmaW5hbGx5IHtcclxuXHRcdFx0cmVkcmF3aW5nID0gZm9yY2luZyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0bS5yZWRyYXcuc3RyYXRlZ3kgPSBtLnByb3AoKTtcclxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XHJcblx0XHRpZiAoY29tcHV0ZVByZVJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2soKTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0Zm9yRWFjaChyb290cywgZnVuY3Rpb24gKHJvb3QsIGkpIHtcclxuXHRcdFx0dmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudHNbaV07XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gW2NvbnRyb2xsZXJzW2ldXTtcclxuXHRcdFx0XHRtLnJlbmRlcihyb290LCBjb21wb25lbnQudmlldyA/IGNvbXBvbmVudC52aWV3KGNvbnRyb2xsZXJzW2ldLCBhcmdzKSA6IFwiXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vYWZ0ZXIgcmVuZGVyaW5nIHdpdGhpbiBhIHJvdXRlZCBjb250ZXh0LCB3ZSBuZWVkIHRvIHNjcm9sbCBiYWNrIHRvIHRoZSB0b3AsIGFuZCBmZXRjaCB0aGUgZG9jdW1lbnQgdGl0bGUgZm9yIGhpc3RvcnkucHVzaFN0YXRlXHJcblx0XHRpZiAoY29tcHV0ZVBvc3RSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vaygpO1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGFzdFJlZHJhd0lkID0gbnVsbDtcclxuXHRcdGxhc3RSZWRyYXdDYWxsVGltZSA9IG5ldyBEYXRlO1xyXG5cdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7IHBlbmRpbmdSZXF1ZXN0cysrOyB9O1xyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgPiAxKSBwZW5kaW5nUmVxdWVzdHMtLTtcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdFx0XHRtLnJlZHJhdygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZW5kRmlyc3RDb21wdXRhdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcIm5vbmVcIikge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMtLTtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaywgY2FsbGJhY2tUaGlzKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgdGhpcztcclxuXHRcdFx0dmFyIF90aGlzID0gY2FsbGJhY2tUaGlzIHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2suY2FsbChfdGhpcywgcHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKTtcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0Ly9yb3V0aW5nXHJcblx0dmFyIG1vZGVzID0ge3BhdGhuYW1lOiBcIlwiLCBoYXNoOiBcIiNcIiwgc2VhcmNoOiBcIj9cIn07XHJcblx0dmFyIHJlZGlyZWN0ID0gbm9vcCwgcm91dGVQYXJhbXMsIGN1cnJlbnRSb3V0ZSwgaXNEZWZhdWx0Um91dGUgPSBmYWxzZTtcclxuXHRtLnJvdXRlID0gZnVuY3Rpb24ocm9vdCwgYXJnMSwgYXJnMiwgdmRvbSkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgaXNTdHJpbmcoYXJnMSkpIHtcclxuXHRcdFx0cmVkaXJlY3QgPSBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9IGN1cnJlbnRSb3V0ZSA9IG5vcm1hbGl6ZVJvdXRlKHNvdXJjZSk7XHJcblx0XHRcdFx0aWYgKCFyb3V0ZUJ5VmFsdWUocm9vdCwgYXJnMiwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgb25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpO1xyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0bS5yb3V0ZShhcmcxLCB0cnVlKTtcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSBtLnJvdXRlLm1vZGUgPT09IFwiaGFzaFwiID8gXCJvbmhhc2hjaGFuZ2VcIiA6IFwib25wb3BzdGF0ZVwiO1xyXG5cdFx0XHR3aW5kb3dbbGlzdGVuZXJdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSAkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXTtcclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaDtcclxuXHRcdFx0XHRpZiAoY3VycmVudFJvdXRlICE9PSBub3JtYWxpemVSb3V0ZShwYXRoKSkgcmVkaXJlY3QocGF0aCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbDtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSgpO1xyXG5cdFx0fVxyXG5cdFx0Ly9jb25maWc6IG0ucm91dGVcclxuXHRcdGVsc2UgaWYgKHJvb3QuYWRkRXZlbnRMaXN0ZW5lciB8fCByb290LmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHJvb3QuaHJlZiA9IChtLnJvdXRlLm1vZGUgIT09ICdwYXRobmFtZScgPyAkbG9jYXRpb24ucGF0aG5hbWUgOiAnJykgKyBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgdmRvbS5hdHRycy5ocmVmO1xyXG5cdFx0XHRpZiAocm9vdC5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdFx0cm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cm9vdC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0cm9vdC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vbS5yb3V0ZShyb3V0ZSwgcGFyYW1zLCBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5KVxyXG5cdFx0ZWxzZSBpZiAoaXNTdHJpbmcocm9vdCkpIHtcclxuXHRcdFx0dmFyIG9sZFJvdXRlID0gY3VycmVudFJvdXRlO1xyXG5cdFx0XHRjdXJyZW50Um91dGUgPSByb290O1xyXG5cdFx0XHR2YXIgYXJncyA9IGFyZzEgfHwge307XHJcblx0XHRcdHZhciBxdWVyeUluZGV4ID0gY3VycmVudFJvdXRlLmluZGV4T2YoXCI/XCIpO1xyXG5cdFx0XHR2YXIgcGFyYW1zID0gcXVlcnlJbmRleCA+IC0xID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKSA6IHt9O1xyXG5cdFx0XHRmb3IgKHZhciBpIGluIGFyZ3MpIHBhcmFtc1tpXSA9IGFyZ3NbaV07XHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcocGFyYW1zKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoID0gcXVlcnlJbmRleCA+IC0xID8gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpIDogY3VycmVudFJvdXRlO1xyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIGN1cnJlbnRSb3V0ZSA9IGN1cnJlbnRQYXRoICsgKGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmc7XHJcblxyXG5cdFx0XHR2YXIgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAzID8gYXJnMiA6IGFyZzEpID09PSB0cnVlIHx8IG9sZFJvdXRlID09PSByb290O1xyXG5cclxuXHRcdFx0aWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsO1xyXG5cdFx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0d2luZG93Lmhpc3Rvcnlbc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiXShudWxsLCAkZG9jdW1lbnQudGl0bGUsIG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGU7XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdG0ucm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkpIHtcclxuXHRcdGlmICghcm91dGVQYXJhbXMpIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGNhbGwgbS5yb3V0ZShlbGVtZW50LCBkZWZhdWx0Um91dGUsIHJvdXRlcykgYmVmb3JlIGNhbGxpbmcgbS5yb3V0ZS5wYXJhbSgpXCIpO1xyXG5cdFx0aWYoICFrZXkgKXtcclxuXHRcdFx0cmV0dXJuIHJvdXRlUGFyYW1zO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJvdXRlUGFyYW1zW2tleV07XHJcblx0fTtcclxuXHRtLnJvdXRlLm1vZGUgPSBcInNlYXJjaFwiO1xyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRlKHJvdXRlKSB7XHJcblx0XHRyZXR1cm4gcm91dGUuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSB7XHJcblx0XHRyb3V0ZVBhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHZhciBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKFwiP1wiKTtcclxuXHRcdGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xyXG5cdFx0XHRyb3V0ZVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKSk7XHJcblx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cigwLCBxdWVyeVN0YXJ0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgYWxsIHJvdXRlcyBhbmQgY2hlY2sgaWYgdGhlcmUnc1xyXG5cdFx0Ly8gYW4gZXhhY3QgbWF0Y2ggZm9yIHRoZSBjdXJyZW50IHBhdGhcclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocm91dGVyKTtcclxuXHRcdHZhciBpbmRleCA9IGtleXMuaW5kZXhPZihwYXRoKTtcclxuXHRcdGlmKGluZGV4ICE9PSAtMSl7XHJcblx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW2tleXMgW2luZGV4XV0pO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciByb3V0ZSBpbiByb3V0ZXIpIHtcclxuXHRcdFx0aWYgKHJvdXRlID09PSBwYXRoKSB7XHJcblx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwiXlwiICsgcm91dGUucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIik7XHJcblxyXG5cdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0cGF0aC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZS5tYXRjaCgvOlteXFwvXSsvZykgfHwgW107XHJcblx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKTtcclxuXHRcdFx0XHRcdGZvckVhY2goa2V5cywgZnVuY3Rpb24gKGtleSwgaSkge1xyXG5cdFx0XHRcdFx0XHRyb3V0ZVBhcmFtc1trZXkucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZVVub2J0cnVzaXZlKGUpIHtcclxuXHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUud2hpY2ggPT09IDIpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG5cdFx0dmFyIGFyZ3MgPSBtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIiAmJiBjdXJyZW50VGFyZ2V0LnNlYXJjaCA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFRhcmdldC5zZWFyY2guc2xpY2UoMSkpIDoge307XHJcblx0XHR3aGlsZSAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09IFwiQVwiKSBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0bS5yb3V0ZShjdXJyZW50VGFyZ2V0W20ucm91dGUubW9kZV0uc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gc2V0U2Nyb2xsKCkge1xyXG5cdFx0aWYgKG0ucm91dGUubW9kZSAhPT0gXCJoYXNoXCIgJiYgJGxvY2F0aW9uLmhhc2gpICRsb2NhdGlvbi5oYXNoID0gJGxvY2F0aW9uLmhhc2g7XHJcblx0XHRlbHNlIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhvYmplY3QsIHByZWZpeCkge1xyXG5cdFx0dmFyIGR1cGxpY2F0ZXMgPSB7fTtcclxuXHRcdHZhciBzdHIgPSBbXTtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3A7XHJcblx0XHRcdHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wXTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuXHRcdFx0XHRzdHIucHVzaChidWlsZFF1ZXJ5U3RyaW5nKHZhbHVlLCBrZXkpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG5cdFx0XHRcdHZhciBrZXlzID0gW107XHJcblx0XHRcdFx0ZHVwbGljYXRlc1trZXldID0gZHVwbGljYXRlc1trZXldIHx8IHt9O1xyXG5cdFx0XHRcdGZvckVhY2godmFsdWUsIGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XVtpdGVtXSkge1xyXG5cdFx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV1baXRlbV0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRrZXlzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChpdGVtKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0c3RyLnB1c2goa2V5cy5qb2luKFwiJlwiKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0ci5qb2luKFwiJlwiKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIgPT09IFwiXCIgfHwgc3RyID09IG51bGwpIHJldHVybiB7fTtcclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnNsaWNlKDEpO1xyXG5cclxuXHRcdHZhciBwYWlycyA9IHN0ci5zcGxpdChcIiZcIiksIHBhcmFtcyA9IHt9O1xyXG5cdFx0Zm9yRWFjaChwYWlycywgZnVuY3Rpb24gKHN0cmluZykge1xyXG5cdFx0XHR2YXIgcGFpciA9IHN0cmluZy5zcGxpdChcIj1cIik7XHJcblx0XHRcdHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclswXSk7XHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhaXIubGVuZ3RoID09PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pIDogbnVsbDtcclxuXHRcdFx0aWYgKHBhcmFtc1trZXldICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoIWlzQXJyYXkocGFyYW1zW2tleV0pKSBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XV07XHJcblx0XHRcdFx0cGFyYW1zW2tleV0ucHVzaCh2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBwYXJhbXNba2V5XSA9IHZhbHVlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcztcclxuXHR9XHJcblx0bS5yb3V0ZS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZztcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nO1xyXG5cclxuXHRmdW5jdGlvbiByZXNldChyb290KSB7XHJcblx0XHR2YXIgY2FjaGVLZXkgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHRjbGVhcihyb290LmNoaWxkTm9kZXMsIGNlbGxDYWNoZVtjYWNoZUtleV0pO1xyXG5cdFx0Y2VsbENhY2hlW2NhY2hlS2V5XSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkO1xyXG5cdH07XHJcblx0ZnVuY3Rpb24gcHJvcGlmeShwcm9taXNlLCBpbml0aWFsVmFsdWUpIHtcclxuXHRcdHZhciBwcm9wID0gbS5wcm9wKGluaXRpYWxWYWx1ZSk7XHJcblx0XHRwcm9taXNlLnRoZW4ocHJvcCk7XHJcblx0XHRwcm9wLnRoZW4gPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkocHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCksIGluaXRpYWxWYWx1ZSk7XHJcblx0XHR9O1xyXG5cdFx0cHJvcFtcImNhdGNoXCJdID0gcHJvcC50aGVuLmJpbmQobnVsbCwgbnVsbCk7XHJcblx0XHRwcm9wW1wiZmluYWxseVwiXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdHZhciBfY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtyZXR1cm4gbS5kZWZlcnJlZCgpLnJlc29sdmUoY2FsbGJhY2soKSkucHJvbWlzZTt9O1xyXG5cdFx0XHRyZXR1cm4gcHJvcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHByb3BpZnkoX2NhbGxiYWNrKCkudGhlbihmdW5jdGlvbigpIHtyZXR1cm4gdmFsdWU7fSksIGluaXRpYWxWYWx1ZSk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG5cdFx0XHRcdHJldHVybiBwcm9waWZ5KF9jYWxsYmFjaygpLnRoZW4oZnVuY3Rpb24oKSB7dGhyb3cgbmV3IEVycm9yKHJlYXNvbik7fSksIGluaXRpYWxWYWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wO1xyXG5cdH1cclxuXHQvL1Byb21pei5taXRocmlsLmpzIHwgWm9sbWVpc3RlciB8IE1JVFxyXG5cdC8vYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFByb21pei5qcywgd2hpY2ggZG9lcyBub3QgY29uZm9ybSB0byBQcm9taXNlcy9BKyBmb3IgdHdvIHJlYXNvbnM6XHJcblx0Ly8xKSBgdGhlbmAgY2FsbGJhY2tzIGFyZSBjYWxsZWQgc3luY2hyb25vdXNseSAoYmVjYXVzZSBzZXRUaW1lb3V0IGlzIHRvbyBzbG93LCBhbmQgdGhlIHNldEltbWVkaWF0ZSBwb2x5ZmlsbCBpcyB0b28gYmlnXHJcblx0Ly8yKSB0aHJvd2luZyBzdWJjbGFzc2VzIG9mIEVycm9yIGNhdXNlIHRoZSBlcnJvciB0byBiZSBidWJibGVkIHVwIGluc3RlYWQgb2YgdHJpZ2dlcmluZyByZWplY3Rpb24gKGJlY2F1c2UgdGhlIHNwZWMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlIGltcG9ydGFudCB1c2UgY2FzZSBvZiBkZWZhdWx0IGJyb3dzZXIgZXJyb3IgaGFuZGxpbmcsIGkuZS4gbWVzc2FnZSB3LyBsaW5lIG51bWJlcilcclxuXHRmdW5jdGlvbiBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0dmFyIFJFU09MVklORyA9IDEsIFJFSkVDVElORyA9IDIsIFJFU09MVkVEID0gMywgUkVKRUNURUQgPSA0O1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLCBzdGF0ZSA9IDAsIHByb21pc2VWYWx1ZSA9IDAsIG5leHQgPSBbXTtcclxuXHJcblx0XHRzZWxmLnByb21pc2UgPSB7fTtcclxuXHJcblx0XHRzZWxmLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spXHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bmV4dC5wdXNoKGRlZmVycmVkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBmaW5pc2godHlwZSkge1xyXG5cdFx0XHRzdGF0ZSA9IHR5cGUgfHwgUkVKRUNURUQ7XHJcblx0XHRcdG5leHQubWFwKGZ1bmN0aW9uKGRlZmVycmVkKSB7XHJcblx0XHRcdFx0c3RhdGUgPT09IFJFU09MVkVEID8gZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpIDogZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRoZW5uYWJsZSh0aGVuLCBzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaywgbm90VGhlbm5hYmxlQ2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKCgocHJvbWlzZVZhbHVlICE9IG51bGwgJiYgaXNPYmplY3QocHJvbWlzZVZhbHVlKSkgfHwgaXNGdW5jdGlvbihwcm9taXNlVmFsdWUpKSAmJiBpc0Z1bmN0aW9uKHRoZW4pKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGNvdW50IHByb3RlY3RzIGFnYWluc3QgYWJ1c2UgY2FsbHMgZnJvbSBzcGVjIGNoZWNrZXJcclxuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0XHR0aGVuLmNhbGwocHJvbWlzZVZhbHVlLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0c3VjY2Vzc0NhbGxiYWNrKCk7XHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vdFRoZW5uYWJsZUNhbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdHJldHVybiBmaXJlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIGlzRnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrKSkge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RJTkcgJiYgaXNGdW5jdGlvbihmYWlsdXJlQ2FsbGJhY2spKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGZhaWx1cmVDYWxsYmFjayhwcm9taXNlVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmluaXNoKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goUkVTT0xWRUQpO1xyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiAhZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC8gRXJyb3IvKSkge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdFx0XHR0aHJvdyBlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHJcblx0XHRmdW5jdGlvbiBzeW5jaHJvbml6ZXIocG9zLCByZXNvbHZlZCkge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRyZXN1bHRzW3Bvc10gPSB2YWx1ZTtcclxuXHRcdFx0XHRpZiAoIXJlc29sdmVkKSBtZXRob2QgPSBcInJlamVjdFwiO1xyXG5cdFx0XHRcdGlmICgtLW91dHN0YW5kaW5nID09PSAwKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlKHJlc3VsdHMpO1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWRbbWV0aG9kXShyZXN1bHRzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcclxuXHRcdHZhciBvdXRzdGFuZGluZyA9IGFyZ3MubGVuZ3RoO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkob3V0c3RhbmRpbmcpO1xyXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3JFYWNoKGFyZ3MsIGZ1bmN0aW9uIChhcmcsIGkpIHtcclxuXHRcdFx0XHRhcmcudGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0fTtcclxuXHRmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cclxuXHJcblx0ZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XHJcblx0XHRpZiAob3B0aW9ucy5kYXRhVHlwZSAmJiBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgY2FsbGJhY2tLZXkgPSBcIm1pdGhyaWxfY2FsbGJhY2tfXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpKS50b1N0cmluZygzNilcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQuc3JjID0gb3B0aW9ucy51cmxcclxuXHRcdFx0XHQrIChvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA+IDAgPyBcIiZcIiA6IFwiP1wiKVxyXG5cdFx0XHRcdCsgKG9wdGlvbnMuY2FsbGJhY2tLZXkgPyBvcHRpb25zLmNhbGxiYWNrS2V5IDogXCJjYWxsYmFja1wiKVxyXG5cdFx0XHRcdCsgXCI9XCIgKyBjYWxsYmFja0tleVxyXG5cdFx0XHRcdCsgXCImXCIgKyBidWlsZFF1ZXJ5U3RyaW5nKG9wdGlvbnMuZGF0YSB8fCB7fSk7XHJcblx0XHRcdCRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0eGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlLCBvcHRpb25zLnVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xyXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgb3B0aW9ucy5vbmxvYWQoe3R5cGU6IFwibG9hZFwiLCB0YXJnZXQ6IHhocn0pO1xyXG5cdFx0XHRcdFx0ZWxzZSBvcHRpb25zLm9uZXJyb3Ioe3R5cGU6IFwiZXJyb3JcIiwgdGFyZ2V0OiB4aHJ9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChvcHRpb25zLnNlcmlhbGl6ZSA9PT0gSlNPTi5zdHJpbmdpZnkgJiYgb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMubWV0aG9kICE9PSBcIkdFVFwiKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGlzRnVuY3Rpb24ob3B0aW9ucy5jb25maWcpKSB7XHJcblx0XHRcdFx0dmFyIG1heWJlWGhyID0gb3B0aW9ucy5jb25maWcoeGhyLCBvcHRpb25zKTtcclxuXHRcdFx0XHRpZiAobWF5YmVYaHIgIT0gbnVsbCkgeGhyID0gbWF5YmVYaHI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXRhID0gb3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgfHwgIW9wdGlvbnMuZGF0YSA/IFwiXCIgOiBvcHRpb25zLmRhdGE7XHJcblx0XHRcdGlmIChkYXRhICYmICghaXNTdHJpbmcoZGF0YSkgJiYgZGF0YS5jb25zdHJ1Y3RvciAhPT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJlcXVlc3QgZGF0YSBzaG91bGQgYmUgZWl0aGVyIGJlIGEgc3RyaW5nIG9yIEZvcm1EYXRhLiBDaGVjayB0aGUgYHNlcmlhbGl6ZWAgb3B0aW9uIGluIGBtLnJlcXVlc3RgXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHhoci5zZW5kKGRhdGEpO1xyXG5cdFx0XHRyZXR1cm4geGhyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYmluZERhdGEoeGhyT3B0aW9ucywgZGF0YSwgc2VyaWFsaXplKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZSAhPT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBwcmVmaXggPSB4aHJPcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiO1xyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpO1xyXG5cdFx0XHR4aHJPcHRpb25zLnVybCA9IHhock9wdGlvbnMudXJsICsgKHF1ZXJ5c3RyaW5nID8gcHJlZml4ICsgcXVlcnlzdHJpbmcgOiBcIlwiKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemVVcmwodXJsLCBkYXRhKSB7XHJcblx0XHR2YXIgdG9rZW5zID0gdXJsLm1hdGNoKC86W2Etel1cXHcrL2dpKTtcclxuXHRcdGlmICh0b2tlbnMgJiYgZGF0YSkge1xyXG5cdFx0XHRmb3JFYWNoKHRva2VucywgZnVuY3Rpb24gKHRva2VuKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IHRva2VuLnNsaWNlKDEpO1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2VuLCBkYXRhW2tleV0pO1xyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2tleV07XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVybDtcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHR2YXIgaXNKU09OUCA9IHhock9wdGlvbnMuZGF0YVR5cGUgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCJcclxuXHRcdHZhciBzZXJpYWxpemUgPSB4aHJPcHRpb25zLnNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuc2VyaWFsaXplIHx8IEpTT04uc3RyaW5naWZ5O1xyXG5cdFx0dmFyIGRlc2VyaWFsaXplID0geGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuZGVzZXJpYWxpemUgfHwgSlNPTi5wYXJzZTtcclxuXHRcdHZhciBleHRyYWN0ID0gaXNKU09OUCA/IGZ1bmN0aW9uKGpzb25wKSB7IHJldHVybiBqc29ucC5yZXNwb25zZVRleHQgfSA6IHhock9wdGlvbnMuZXh0cmFjdCB8fCBmdW5jdGlvbih4aHIpIHtcclxuXHRcdFx0aWYgKHhoci5yZXNwb25zZVRleHQubGVuZ3RoID09PSAwICYmIGRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0eGhyT3B0aW9ucy5tZXRob2QgPSAoeGhyT3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIikudG9VcHBlckNhc2UoKTtcclxuXHRcdHhock9wdGlvbnMudXJsID0gcGFyYW1ldGVyaXplVXJsKHhock9wdGlvbnMudXJsLCB4aHJPcHRpb25zLmRhdGEpO1xyXG5cdFx0eGhyT3B0aW9ucyA9IGJpbmREYXRhKHhock9wdGlvbnMsIHhock9wdGlvbnMuZGF0YSwgc2VyaWFsaXplKTtcclxuXHRcdHhock9wdGlvbnMub25sb2FkID0geGhyT3B0aW9ucy5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRcdHZhciB1bndyYXAgPSAoZS50eXBlID09PSBcImxvYWRcIiA/IHhock9wdGlvbnMudW53cmFwU3VjY2VzcyA6IHhock9wdGlvbnMudW53cmFwRXJyb3IpIHx8IGlkZW50aXR5O1xyXG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHVud3JhcChkZXNlcmlhbGl6ZShleHRyYWN0KGUudGFyZ2V0LCB4aHJPcHRpb25zKSksIGUudGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZS50eXBlID09PSBcImxvYWRcIikge1xyXG5cdFx0XHRcdFx0aWYgKGlzQXJyYXkocmVzcG9uc2UpICYmIHhock9wdGlvbnMudHlwZSkge1xyXG5cdFx0XHRcdFx0XHRmb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbiAocmVzLCBpKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2VbaV0gPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlcyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh4aHJPcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGRlZmVycmVkW2UudHlwZSA9PT0gXCJsb2FkXCIgPyBcInJlc29sdmVcIiA6IFwicmVqZWN0XCJdKHJlc3BvbnNlKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uZW5kQ29tcHV0YXRpb24oKVxyXG5cdFx0fVxyXG5cclxuXHRcdGFqYXgoeGhyT3B0aW9ucyk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlLCB4aHJPcHRpb25zLmluaXRpYWxWYWx1ZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuXHR9O1xyXG5cclxuXHQvL3Rlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24obW9jaykge1xyXG5cdFx0aW5pdGlhbGl6ZSh3aW5kb3cgPSBtb2NrIHx8IHdpbmRvdyk7XHJcblx0XHRyZXR1cm4gd2luZG93O1xyXG5cdH07XHJcblx0Ly9mb3IgaW50ZXJuYWwgdGVzdGluZyBvbmx5LCBkbyBub3QgdXNlIGBtLmRlcHMuZmFjdG9yeWBcclxuXHRtLmRlcHMuZmFjdG9yeSA9IGFwcDtcclxuXHJcblx0cmV0dXJuIG07XHJcbn0pKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUgIT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBtO1xyXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbSB9KTtcclxuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTRcbnZhciBlYXNpbmcgPSB7XG4gIGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xuICB9LFxufTtcblxuZnVuY3Rpb24gbWFrZVBpZWNlKGssIHBpZWNlLCBpbnZlcnQpIHtcbiAgdmFyIGtleSA9IGludmVydCA/IHV0aWwuaW52ZXJ0S2V5KGspIDogaztcbiAgcmV0dXJuIHtcbiAgICBrZXk6IGtleSxcbiAgICBwb3M6IHV0aWwua2V5MnBvcyhrZXkpLFxuICAgIHJvbGU6IHBpZWNlLnJvbGUsXG4gICAgY29sb3I6IHBpZWNlLmNvbG9yXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNhbWVQaWVjZShwMSwgcDIpIHtcbiAgcmV0dXJuIHAxLnJvbGUgPT09IHAyLnJvbGUgJiYgcDEuY29sb3IgPT09IHAyLmNvbG9yO1xufVxuXG5mdW5jdGlvbiBjbG9zZXIocGllY2UsIHBpZWNlcykge1xuICByZXR1cm4gcGllY2VzLnNvcnQoZnVuY3Rpb24ocDEsIHAyKSB7XG4gICAgcmV0dXJuIHV0aWwuZGlzdGFuY2UocGllY2UucG9zLCBwMS5wb3MpIC0gdXRpbC5kaXN0YW5jZShwaWVjZS5wb3MsIHAyLnBvcyk7XG4gIH0pWzBdO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlUGxhbihwcmV2LCBjdXJyZW50KSB7XG4gIHZhciBib3VuZHMgPSBjdXJyZW50LmJvdW5kcygpLFxuICAgIHdpZHRoID0gYm91bmRzLndpZHRoIC8gOCxcbiAgICBoZWlnaHQgPSBib3VuZHMuaGVpZ2h0IC8gOCxcbiAgICBhbmltcyA9IHt9LFxuICAgIGFuaW1lZE9yaWdzID0gW10sXG4gICAgZmFkaW5ncyA9IFtdLFxuICAgIG1pc3NpbmdzID0gW10sXG4gICAgbmV3cyA9IFtdLFxuICAgIGludmVydCA9IHByZXYub3JpZW50YXRpb24gIT09IGN1cnJlbnQub3JpZW50YXRpb24sXG4gICAgcHJlUGllY2VzID0ge30sXG4gICAgd2hpdGUgPSBjdXJyZW50Lm9yaWVudGF0aW9uID09PSAnd2hpdGUnO1xuICBmb3IgKHZhciBwayBpbiBwcmV2LnBpZWNlcykge1xuICAgIHZhciBwaWVjZSA9IG1ha2VQaWVjZShwaywgcHJldi5waWVjZXNbcGtdLCBpbnZlcnQpO1xuICAgIHByZVBpZWNlc1twaWVjZS5rZXldID0gcGllY2U7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB1dGlsLmFsbEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gdXRpbC5hbGxLZXlzW2ldO1xuICAgIGlmIChrZXkgIT09IGN1cnJlbnQubW92YWJsZS5kcm9wcGVkWzFdKSB7XG4gICAgICB2YXIgY3VyUCA9IGN1cnJlbnQucGllY2VzW2tleV07XG4gICAgICB2YXIgcHJlUCA9IHByZVBpZWNlc1trZXldO1xuICAgICAgaWYgKGN1clApIHtcbiAgICAgICAgaWYgKHByZVApIHtcbiAgICAgICAgICBpZiAoIXNhbWVQaWVjZShjdXJQLCBwcmVQKSkge1xuICAgICAgICAgICAgbWlzc2luZ3MucHVzaChwcmVQKTtcbiAgICAgICAgICAgIG5ld3MucHVzaChtYWtlUGllY2Uoa2V5LCBjdXJQLCBmYWxzZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgbmV3cy5wdXNoKG1ha2VQaWVjZShrZXksIGN1clAsIGZhbHNlKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZVApXG4gICAgICAgIG1pc3NpbmdzLnB1c2gocHJlUCk7XG4gICAgfVxuICB9XG4gIG5ld3MuZm9yRWFjaChmdW5jdGlvbihuZXdQKSB7XG4gICAgdmFyIHByZVAgPSBjbG9zZXIobmV3UCwgbWlzc2luZ3MuZmlsdGVyKHV0aWwucGFydGlhbChzYW1lUGllY2UsIG5ld1ApKSk7XG4gICAgaWYgKHByZVApIHtcbiAgICAgIHZhciBvcmlnID0gd2hpdGUgPyBwcmVQLnBvcyA6IG5ld1AucG9zO1xuICAgICAgdmFyIGRlc3QgPSB3aGl0ZSA/IG5ld1AucG9zIDogcHJlUC5wb3M7XG4gICAgICB2YXIgdmVjdG9yID0gWyhvcmlnWzBdIC0gZGVzdFswXSkgKiB3aWR0aCwgKGRlc3RbMV0gLSBvcmlnWzFdKSAqIGhlaWdodF07XG4gICAgICBhbmltc1tuZXdQLmtleV0gPSBbdmVjdG9yLCB2ZWN0b3JdO1xuICAgICAgYW5pbWVkT3JpZ3MucHVzaChwcmVQLmtleSk7XG4gICAgfVxuICB9KTtcbiAgbWlzc2luZ3MuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgaWYgKFxuICAgICAgcC5rZXkgIT09IGN1cnJlbnQubW92YWJsZS5kcm9wcGVkWzBdICYmXG4gICAgICAhdXRpbC5jb250YWluc1goYW5pbWVkT3JpZ3MsIHAua2V5KSAmJlxuICAgICAgIShjdXJyZW50Lml0ZW1zID8gY3VycmVudC5pdGVtcy5yZW5kZXIocC5wb3MsIHAua2V5KSA6IGZhbHNlKVxuICAgIClcbiAgICAgIGZhZGluZ3MucHVzaCh7XG4gICAgICAgIHBpZWNlOiBwLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBhbmltczogYW5pbXMsXG4gICAgZmFkaW5nczogZmFkaW5nc1xuICB9O1xufVxuXG5mdW5jdGlvbiByb3VuZEJ5KG4sIGJ5KSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKG4gKiBieSkgLyBieTtcbn1cblxuZnVuY3Rpb24gZ28oZGF0YSkge1xuICBpZiAoIWRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuc3RhcnQpIHJldHVybjsgLy8gYW5pbWF0aW9uIHdhcyBjYW5jZWxlZFxuICB2YXIgcmVzdCA9IDEgLSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBkYXRhLmFuaW1hdGlvbi5jdXJyZW50LnN0YXJ0KSAvIGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuZHVyYXRpb247XG4gIGlmIChyZXN0IDw9IDApIHtcbiAgICBkYXRhLmFuaW1hdGlvbi5jdXJyZW50ID0ge307XG4gICAgZGF0YS5yZW5kZXIoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZWFzZSA9IGVhc2luZy5lYXNlSW5PdXRDdWJpYyhyZXN0KTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YS5hbmltYXRpb24uY3VycmVudC5hbmltcykge1xuICAgICAgdmFyIGNmZyA9IGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuYW5pbXNba2V5XTtcbiAgICAgIGNmZ1sxXSA9IFtyb3VuZEJ5KGNmZ1swXVswXSAqIGVhc2UsIDEwKSwgcm91bmRCeShjZmdbMF1bMV0gKiBlYXNlLCAxMCldO1xuICAgIH1cbiAgICBmb3IgKHZhciBpIGluIGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuZmFkaW5ncykge1xuICAgICAgZGF0YS5hbmltYXRpb24uY3VycmVudC5mYWRpbmdzW2ldLm9wYWNpdHkgPSByb3VuZEJ5KGVhc2UsIDEwMCk7XG4gICAgfVxuICAgIGRhdGEucmVuZGVyKCk7XG4gICAgdXRpbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICBnbyhkYXRhKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhbmltYXRlKHRyYW5zZm9ybWF0aW9uLCBkYXRhKSB7XG4gIC8vIGNsb25lIGRhdGFcbiAgdmFyIHByZXYgPSB7XG4gICAgb3JpZW50YXRpb246IGRhdGEub3JpZW50YXRpb24sXG4gICAgcGllY2VzOiB7fVxuICB9O1xuICAvLyBjbG9uZSBwaWVjZXNcbiAgZm9yICh2YXIga2V5IGluIGRhdGEucGllY2VzKSB7XG4gICAgcHJldi5waWVjZXNba2V5XSA9IHtcbiAgICAgIHJvbGU6IGRhdGEucGllY2VzW2tleV0ucm9sZSxcbiAgICAgIGNvbG9yOiBkYXRhLnBpZWNlc1trZXldLmNvbG9yXG4gICAgfTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJhbnNmb3JtYXRpb24oKTtcbiAgaWYgKGRhdGEuYW5pbWF0aW9uLmVuYWJsZWQpIHtcbiAgICB2YXIgcGxhbiA9IGNvbXB1dGVQbGFuKHByZXYsIGRhdGEpO1xuICAgIGlmIChPYmplY3Qua2V5cyhwbGFuLmFuaW1zKS5sZW5ndGggPiAwIHx8IHBsYW4uZmFkaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgYWxyZWFkeVJ1bm5pbmcgPSBkYXRhLmFuaW1hdGlvbi5jdXJyZW50LnN0YXJ0O1xuICAgICAgZGF0YS5hbmltYXRpb24uY3VycmVudCA9IHtcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICBkdXJhdGlvbjogZGF0YS5hbmltYXRpb24uZHVyYXRpb24sXG4gICAgICAgIGFuaW1zOiBwbGFuLmFuaW1zLFxuICAgICAgICBmYWRpbmdzOiBwbGFuLmZhZGluZ3NcbiAgICAgIH07XG4gICAgICBpZiAoIWFscmVhZHlSdW5uaW5nKSBnbyhkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZG9uJ3QgYW5pbWF0ZSwganVzdCByZW5kZXIgcmlnaHQgYXdheVxuICAgICAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gYW5pbWF0aW9ucyBhcmUgbm93IGRpc2FibGVkXG4gICAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyB0cmFuc2Zvcm1hdGlvbiBpcyBhIGZ1bmN0aW9uXG4vLyBhY2NlcHRzIGJvYXJkIGRhdGEgYW5kIGFueSBudW1iZXIgb2YgYXJndW1lbnRzLFxuLy8gYW5kIG11dGF0ZXMgdGhlIGJvYXJkLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0cmFuc2Zvcm1hdGlvbiwgZGF0YSwgc2tpcCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYW5zZm9ybWF0aW9uQXJncyA9IFtkYXRhXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgaWYgKCFkYXRhLnJlbmRlcikgcmV0dXJuIHRyYW5zZm9ybWF0aW9uLmFwcGx5KG51bGwsIHRyYW5zZm9ybWF0aW9uQXJncyk7XG4gICAgZWxzZSBpZiAoZGF0YS5hbmltYXRpb24uZW5hYmxlZCAmJiAhc2tpcClcbiAgICAgIHJldHVybiBhbmltYXRlKHV0aWwucGFydGlhbEFwcGx5KHRyYW5zZm9ybWF0aW9uLCB0cmFuc2Zvcm1hdGlvbkFyZ3MpLCBkYXRhKTtcbiAgICBlbHNlIHtcbiAgICAgIHZhciByZXN1bHQgPSB0cmFuc2Zvcm1hdGlvbi5hcHBseShudWxsLCB0cmFuc2Zvcm1hdGlvbkFyZ3MpO1xuICAgICAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xufTtcbiIsInZhciBib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG5cbiAgcmV0dXJuIHtcbiAgICBzZXQ6IGNvbnRyb2xsZXIuc2V0LFxuICAgIHRvZ2dsZU9yaWVudGF0aW9uOiBjb250cm9sbGVyLnRvZ2dsZU9yaWVudGF0aW9uLFxuICAgIGdldE9yaWVudGF0aW9uOiBjb250cm9sbGVyLmdldE9yaWVudGF0aW9uLFxuICAgIGdldFBpZWNlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29udHJvbGxlci5kYXRhLnBpZWNlcztcbiAgICB9LFxuICAgIGdldE1hdGVyaWFsRGlmZjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYm9hcmQuZ2V0TWF0ZXJpYWxEaWZmKGNvbnRyb2xsZXIuZGF0YSk7XG4gICAgfSxcbiAgICBnZXRGZW46IGNvbnRyb2xsZXIuZ2V0RmVuLFxuICAgIG1vdmU6IGNvbnRyb2xsZXIuYXBpTW92ZSxcbiAgICBuZXdQaWVjZTogY29udHJvbGxlci5hcGlOZXdQaWVjZSxcbiAgICBzZXRQaWVjZXM6IGNvbnRyb2xsZXIuc2V0UGllY2VzLFxuICAgIHNldENoZWNrOiBjb250cm9sbGVyLnNldENoZWNrLFxuICAgIHBsYXlQcmVtb3ZlOiBjb250cm9sbGVyLnBsYXlQcmVtb3ZlLFxuICAgIHBsYXlQcmVkcm9wOiBjb250cm9sbGVyLnBsYXlQcmVkcm9wLFxuICAgIGNhbmNlbFByZW1vdmU6IGNvbnRyb2xsZXIuY2FuY2VsUHJlbW92ZSxcbiAgICBjYW5jZWxQcmVkcm9wOiBjb250cm9sbGVyLmNhbmNlbFByZWRyb3AsXG4gICAgY2FuY2VsTW92ZTogY29udHJvbGxlci5jYW5jZWxNb3ZlLFxuICAgIHN0b3A6IGNvbnRyb2xsZXIuc3RvcCxcbiAgICBleHBsb2RlOiBjb250cm9sbGVyLmV4cGxvZGUsXG4gICAgc2V0QXV0b1NoYXBlczogY29udHJvbGxlci5zZXRBdXRvU2hhcGVzLFxuICAgIHNldFNoYXBlczogY29udHJvbGxlci5zZXRTaGFwZXMsXG4gICAgZGF0YTogY29udHJvbGxlci5kYXRhIC8vIGRpcmVjdGx5IGV4cG9zZXMgY2hlc3Nncm91bmQgc3RhdGUgZm9yIG1vcmUgbWVzc2luZyBhcm91bmRcbiAgfTtcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHByZW1vdmUgPSByZXF1aXJlKCcuL3ByZW1vdmUnKTtcbnZhciBhbmltID0gcmVxdWlyZSgnLi9hbmltJyk7XG52YXIgaG9sZCA9IHJlcXVpcmUoJy4vaG9sZCcpO1xuXG5mdW5jdGlvbiBjYWxsVXNlckZ1bmN0aW9uKGYpIHtcbiAgc2V0VGltZW91dChmLCAxKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlT3JpZW50YXRpb24oZGF0YSkge1xuICBkYXRhLm9yaWVudGF0aW9uID0gdXRpbC5vcHBvc2l0ZShkYXRhLm9yaWVudGF0aW9uKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoZGF0YSkge1xuICBkYXRhLmxhc3RNb3ZlID0gbnVsbDtcbiAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIHVuc2V0UHJlbW92ZShkYXRhKTtcbiAgdW5zZXRQcmVkcm9wKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBzZXRQaWVjZXMoZGF0YSwgcGllY2VzKSB7XG4gIE9iamVjdC5rZXlzKHBpZWNlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAocGllY2VzW2tleV0pIGRhdGEucGllY2VzW2tleV0gPSBwaWVjZXNba2V5XTtcbiAgICBlbHNlIGRlbGV0ZSBkYXRhLnBpZWNlc1trZXldO1xuICB9KTtcbiAgZGF0YS5tb3ZhYmxlLmRyb3BwZWQgPSBbXTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hlY2soZGF0YSwgY29sb3IpIHtcbiAgdmFyIGNoZWNrQ29sb3IgPSBjb2xvciB8fCBkYXRhLnR1cm5Db2xvcjtcbiAgT2JqZWN0LmtleXMoZGF0YS5waWVjZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGRhdGEucGllY2VzW2tleV0uY29sb3IgPT09IGNoZWNrQ29sb3IgJiYgZGF0YS5waWVjZXNba2V5XS5yb2xlID09PSAna2luZycpIGRhdGEuY2hlY2sgPSBrZXk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcmVtb3ZlKGRhdGEsIG9yaWcsIGRlc3QpIHtcbiAgdW5zZXRQcmVkcm9wKGRhdGEpO1xuICBkYXRhLnByZW1vdmFibGUuY3VycmVudCA9IFtvcmlnLCBkZXN0XTtcbiAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5wcmVtb3ZhYmxlLmV2ZW50cy5zZXQsIG9yaWcsIGRlc3QpKTtcbn1cblxuZnVuY3Rpb24gdW5zZXRQcmVtb3ZlKGRhdGEpIHtcbiAgaWYgKGRhdGEucHJlbW92YWJsZS5jdXJyZW50KSB7XG4gICAgZGF0YS5wcmVtb3ZhYmxlLmN1cnJlbnQgPSBudWxsO1xuICAgIGNhbGxVc2VyRnVuY3Rpb24oZGF0YS5wcmVtb3ZhYmxlLmV2ZW50cy51bnNldCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UHJlZHJvcChkYXRhLCByb2xlLCBrZXkpIHtcbiAgdW5zZXRQcmVtb3ZlKGRhdGEpO1xuICBkYXRhLnByZWRyb3BwYWJsZS5jdXJyZW50ID0ge1xuICAgIHJvbGU6IHJvbGUsXG4gICAga2V5OiBrZXlcbiAgfTtcbiAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5wcmVkcm9wcGFibGUuZXZlbnRzLnNldCwgcm9sZSwga2V5KSk7XG59XG5cbmZ1bmN0aW9uIHVuc2V0UHJlZHJvcChkYXRhKSB7XG4gIGlmIChkYXRhLnByZWRyb3BwYWJsZS5jdXJyZW50LmtleSkge1xuICAgIGRhdGEucHJlZHJvcHBhYmxlLmN1cnJlbnQgPSB7fTtcbiAgICBjYWxsVXNlckZ1bmN0aW9uKGRhdGEucHJlZHJvcHBhYmxlLmV2ZW50cy51bnNldCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5QXV0b0Nhc3RsZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIGlmICghZGF0YS5hdXRvQ2FzdGxlKSByZXR1cm47XG4gIHZhciBraW5nID0gZGF0YS5waWVjZXNbZGVzdF07XG4gIGlmIChraW5nLnJvbGUgIT09ICdraW5nJykgcmV0dXJuO1xuICB2YXIgb3JpZ1BvcyA9IHV0aWwua2V5MnBvcyhvcmlnKTtcbiAgaWYgKG9yaWdQb3NbMF0gIT09IDUpIHJldHVybjtcbiAgaWYgKG9yaWdQb3NbMV0gIT09IDEgJiYgb3JpZ1Bvc1sxXSAhPT0gOCkgcmV0dXJuO1xuICB2YXIgZGVzdFBvcyA9IHV0aWwua2V5MnBvcyhkZXN0KSxcbiAgICBvbGRSb29rUG9zLCBuZXdSb29rUG9zLCBuZXdLaW5nUG9zO1xuICBpZiAoZGVzdFBvc1swXSA9PT0gNyB8fCBkZXN0UG9zWzBdID09PSA4KSB7XG4gICAgb2xkUm9va1BvcyA9IHV0aWwucG9zMmtleShbOCwgb3JpZ1Bvc1sxXV0pO1xuICAgIG5ld1Jvb2tQb3MgPSB1dGlsLnBvczJrZXkoWzYsIG9yaWdQb3NbMV1dKTtcbiAgICBuZXdLaW5nUG9zID0gdXRpbC5wb3Mya2V5KFs3LCBvcmlnUG9zWzFdXSk7XG4gIH0gZWxzZSBpZiAoZGVzdFBvc1swXSA9PT0gMyB8fCBkZXN0UG9zWzBdID09PSAxKSB7XG4gICAgb2xkUm9va1BvcyA9IHV0aWwucG9zMmtleShbMSwgb3JpZ1Bvc1sxXV0pO1xuICAgIG5ld1Jvb2tQb3MgPSB1dGlsLnBvczJrZXkoWzQsIG9yaWdQb3NbMV1dKTtcbiAgICBuZXdLaW5nUG9zID0gdXRpbC5wb3Mya2V5KFszLCBvcmlnUG9zWzFdXSk7XG4gIH0gZWxzZSByZXR1cm47XG4gIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgZGVsZXRlIGRhdGEucGllY2VzW2Rlc3RdO1xuICBkZWxldGUgZGF0YS5waWVjZXNbb2xkUm9va1Bvc107XG4gIGRhdGEucGllY2VzW25ld0tpbmdQb3NdID0ge1xuICAgIHJvbGU6ICdraW5nJyxcbiAgICBjb2xvcjoga2luZy5jb2xvclxuICB9O1xuICBkYXRhLnBpZWNlc1tuZXdSb29rUG9zXSA9IHtcbiAgICByb2xlOiAncm9vaycsXG4gICAgY29sb3I6IGtpbmcuY29sb3JcbiAgfTtcbn1cblxuZnVuY3Rpb24gYmFzZU1vdmUoZGF0YSwgb3JpZywgZGVzdCkge1xuICB2YXIgc3VjY2VzcyA9IGFuaW0oZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9yaWcgPT09IGRlc3QgfHwgIWRhdGEucGllY2VzW29yaWddKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGNhcHR1cmVkID0gKFxuICAgICAgZGF0YS5waWVjZXNbZGVzdF0gJiZcbiAgICAgIGRhdGEucGllY2VzW2Rlc3RdLmNvbG9yICE9PSBkYXRhLnBpZWNlc1tvcmlnXS5jb2xvclxuICAgICkgPyBkYXRhLnBpZWNlc1tkZXN0XSA6IG51bGw7XG4gICAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5ldmVudHMubW92ZSwgb3JpZywgZGVzdCwgY2FwdHVyZWQpKTtcbiAgICBkYXRhLnBpZWNlc1tkZXN0XSA9IGRhdGEucGllY2VzW29yaWddO1xuICAgIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgICBkYXRhLmxhc3RNb3ZlID0gW29yaWcsIGRlc3RdO1xuICAgIGRhdGEuY2hlY2sgPSBudWxsO1xuICAgIHRyeUF1dG9DYXN0bGUoZGF0YSwgb3JpZywgZGVzdCk7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihkYXRhLmV2ZW50cy5jaGFuZ2UpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LCBkYXRhKSgpO1xuICBpZiAoc3VjY2VzcykgZGF0YS5tb3ZhYmxlLmRyb3BwZWQgPSBbXTtcbiAgcmV0dXJuIHN1Y2Nlc3M7XG59XG5cbmZ1bmN0aW9uIGJhc2VOZXdQaWVjZShkYXRhLCBwaWVjZSwga2V5KSB7XG4gIGlmIChkYXRhLnBpZWNlc1trZXldKSByZXR1cm4gZmFsc2U7XG4gIGNhbGxVc2VyRnVuY3Rpb24odXRpbC5wYXJ0aWFsKGRhdGEuZXZlbnRzLmRyb3BOZXdQaWVjZSwgcGllY2UsIGtleSkpO1xuICBkYXRhLnBpZWNlc1trZXldID0gcGllY2U7XG4gIGRhdGEubGFzdE1vdmUgPSBba2V5LCBrZXldO1xuICBkYXRhLmNoZWNrID0gbnVsbDtcbiAgY2FsbFVzZXJGdW5jdGlvbihkYXRhLmV2ZW50cy5jaGFuZ2UpO1xuICBkYXRhLm1vdmFibGUuZHJvcHBlZCA9IFtdO1xuICBkYXRhLm1vdmFibGUuZGVzdHMgPSB7fTtcbiAgZGF0YS50dXJuQ29sb3IgPSB1dGlsLm9wcG9zaXRlKGRhdGEudHVybkNvbG9yKTtcbiAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGJhc2VVc2VyTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIHZhciByZXN1bHQgPSBiYXNlTW92ZShkYXRhLCBvcmlnLCBkZXN0KTtcbiAgaWYgKHJlc3VsdCkge1xuICAgIGRhdGEubW92YWJsZS5kZXN0cyA9IHt9O1xuICAgIGRhdGEudHVybkNvbG9yID0gdXRpbC5vcHBvc2l0ZShkYXRhLnR1cm5Db2xvcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYXBpTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIHJldHVybiBiYXNlTW92ZShkYXRhLCBvcmlnLCBkZXN0KTtcbn1cblxuZnVuY3Rpb24gYXBpTmV3UGllY2UoZGF0YSwgcGllY2UsIGtleSkge1xuICByZXR1cm4gYmFzZU5ld1BpZWNlKGRhdGEsIHBpZWNlLCBrZXkpO1xufVxuXG5mdW5jdGlvbiB1c2VyTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIGlmICghZGVzdCkge1xuICAgIGhvbGQuY2FuY2VsKCk7XG4gICAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gICAgaWYgKGRhdGEubW92YWJsZS5kcm9wT2ZmID09PSAndHJhc2gnKSB7XG4gICAgICBkZWxldGUgZGF0YS5waWVjZXNbb3JpZ107XG4gICAgICBjYWxsVXNlckZ1bmN0aW9uKGRhdGEuZXZlbnRzLmNoYW5nZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNhbk1vdmUoZGF0YSwgb3JpZywgZGVzdCkpIHtcbiAgICBpZiAoYmFzZVVzZXJNb3ZlKGRhdGEsIG9yaWcsIGRlc3QpKSB7XG4gICAgICB2YXIgaG9sZFRpbWUgPSBob2xkLnN0b3AoKTtcbiAgICAgIHNldFNlbGVjdGVkKGRhdGEsIG51bGwpO1xuICAgICAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5tb3ZhYmxlLmV2ZW50cy5hZnRlciwgb3JpZywgZGVzdCwge1xuICAgICAgICBwcmVtb3ZlOiBmYWxzZSxcbiAgICAgICAgaG9sZFRpbWU6IGhvbGRUaW1lXG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2FuUHJlbW92ZShkYXRhLCBvcmlnLCBkZXN0KSkge1xuICAgIHNldFByZW1vdmUoZGF0YSwgb3JpZywgZGVzdCk7XG4gICAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIH0gZWxzZSBpZiAoaXNNb3ZhYmxlKGRhdGEsIGRlc3QpIHx8IGlzUHJlbW92YWJsZShkYXRhLCBkZXN0KSkge1xuICAgIHNldFNlbGVjdGVkKGRhdGEsIGRlc3QpO1xuICAgIGhvbGQuc3RhcnQoKTtcbiAgfSBlbHNlIHNldFNlbGVjdGVkKGRhdGEsIG51bGwpO1xufVxuXG5mdW5jdGlvbiBkcm9wTmV3UGllY2UoZGF0YSwgb3JpZywgZGVzdCkge1xuICBpZiAoY2FuRHJvcChkYXRhLCBvcmlnLCBkZXN0KSkge1xuICAgIHZhciBwaWVjZSA9IGRhdGEucGllY2VzW29yaWddO1xuICAgIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgICBiYXNlTmV3UGllY2UoZGF0YSwgcGllY2UsIGRlc3QpO1xuICAgIGRhdGEubW92YWJsZS5kcm9wcGVkID0gW107XG4gICAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5tb3ZhYmxlLmV2ZW50cy5hZnRlck5ld1BpZWNlLCBwaWVjZS5yb2xlLCBkZXN0LCB7XG4gICAgICBwcmVkcm9wOiBmYWxzZVxuICAgIH0pKTtcbiAgfSBlbHNlIGlmIChjYW5QcmVkcm9wKGRhdGEsIG9yaWcsIGRlc3QpKSB7XG4gICAgc2V0UHJlZHJvcChkYXRhLCBkYXRhLnBpZWNlc1tvcmlnXS5yb2xlLCBkZXN0KTtcbiAgfSBlbHNlIHtcbiAgICB1bnNldFByZW1vdmUoZGF0YSk7XG4gICAgdW5zZXRQcmVkcm9wKGRhdGEpO1xuICB9XG4gIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdFNxdWFyZShkYXRhLCBrZXkpIHtcbiAgaWYgKGRhdGEuc2VsZWN0ZWQpIHtcbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAoZGF0YS5zZWxlY3RlZCA9PT0ga2V5ICYmICFkYXRhLmRyYWdnYWJsZS5lbmFibGVkKSB7XG4gICAgICAgIHNldFNlbGVjdGVkKGRhdGEsIG51bGwpO1xuICAgICAgICBob2xkLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLnNlbGVjdGFibGUuZW5hYmxlZCAmJiBkYXRhLnNlbGVjdGVkICE9PSBrZXkpIHtcbiAgICAgICAgaWYgKHVzZXJNb3ZlKGRhdGEsIGRhdGEuc2VsZWN0ZWQsIGtleSkpIGRhdGEuc3RhdHMuZHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGhvbGQuc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gICAgICBob2xkLmNhbmNlbCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc01vdmFibGUoZGF0YSwga2V5KSB8fCBpc1ByZW1vdmFibGUoZGF0YSwga2V5KSkge1xuICAgIHNldFNlbGVjdGVkKGRhdGEsIGtleSk7XG4gICAgaG9sZC5zdGFydCgpO1xuICB9XG4gIGlmIChrZXkpIGNhbGxVc2VyRnVuY3Rpb24odXRpbC5wYXJ0aWFsKGRhdGEuZXZlbnRzLnNlbGVjdCwga2V5KSk7XG59XG5cbmZ1bmN0aW9uIHNldFNlbGVjdGVkKGRhdGEsIGtleSkge1xuICBkYXRhLnNlbGVjdGVkID0ga2V5O1xuICBpZiAoa2V5ICYmIGlzUHJlbW92YWJsZShkYXRhLCBrZXkpKVxuICAgIGRhdGEucHJlbW92YWJsZS5kZXN0cyA9IHByZW1vdmUoZGF0YS5waWVjZXMsIGtleSwgZGF0YS5wcmVtb3ZhYmxlLmNhc3RsZSk7XG4gIGVsc2VcbiAgICBkYXRhLnByZW1vdmFibGUuZGVzdHMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc01vdmFibGUoZGF0YSwgb3JpZykge1xuICB2YXIgcGllY2UgPSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgcmV0dXJuIHBpZWNlICYmIChcbiAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09ICdib3RoJyB8fCAoXG4gICAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmXG4gICAgICBkYXRhLnR1cm5Db2xvciA9PT0gcGllY2UuY29sb3JcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gY2FuTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIHJldHVybiBvcmlnICE9PSBkZXN0ICYmIGlzTW92YWJsZShkYXRhLCBvcmlnKSAmJiAoXG4gICAgZGF0YS5tb3ZhYmxlLmZyZWUgfHwgdXRpbC5jb250YWluc1goZGF0YS5tb3ZhYmxlLmRlc3RzW29yaWddLCBkZXN0KVxuICApO1xufVxuXG5mdW5jdGlvbiBjYW5Ecm9wKGRhdGEsIG9yaWcsIGRlc3QpIHtcbiAgdmFyIHBpZWNlID0gZGF0YS5waWVjZXNbb3JpZ107XG4gIHJldHVybiBwaWVjZSAmJiBkZXN0ICYmIChvcmlnID09PSBkZXN0IHx8ICFkYXRhLnBpZWNlc1tkZXN0XSkgJiYgKFxuICAgIGRhdGEubW92YWJsZS5jb2xvciA9PT0gJ2JvdGgnIHx8IChcbiAgICAgIGRhdGEubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiZcbiAgICAgIGRhdGEudHVybkNvbG9yID09PSBwaWVjZS5jb2xvclxuICAgICkpO1xufVxuXG5cbmZ1bmN0aW9uIGlzUHJlbW92YWJsZShkYXRhLCBvcmlnKSB7XG4gIHZhciBwaWVjZSA9IGRhdGEucGllY2VzW29yaWddO1xuICByZXR1cm4gcGllY2UgJiYgZGF0YS5wcmVtb3ZhYmxlLmVuYWJsZWQgJiZcbiAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmXG4gICAgZGF0YS50dXJuQ29sb3IgIT09IHBpZWNlLmNvbG9yO1xufVxuXG5mdW5jdGlvbiBjYW5QcmVtb3ZlKGRhdGEsIG9yaWcsIGRlc3QpIHtcbiAgcmV0dXJuIG9yaWcgIT09IGRlc3QgJiZcbiAgICBpc1ByZW1vdmFibGUoZGF0YSwgb3JpZykgJiZcbiAgICB1dGlsLmNvbnRhaW5zWChwcmVtb3ZlKGRhdGEucGllY2VzLCBvcmlnLCBkYXRhLnByZW1vdmFibGUuY2FzdGxlKSwgZGVzdCk7XG59XG5cbmZ1bmN0aW9uIGNhblByZWRyb3AoZGF0YSwgb3JpZywgZGVzdCkge1xuICB2YXIgcGllY2UgPSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgcmV0dXJuIHBpZWNlICYmIGRlc3QgJiZcbiAgICAoIWRhdGEucGllY2VzW2Rlc3RdIHx8IGRhdGEucGllY2VzW2Rlc3RdLmNvbG9yICE9PSBkYXRhLm1vdmFibGUuY29sb3IpICYmXG4gICAgZGF0YS5wcmVkcm9wcGFibGUuZW5hYmxlZCAmJlxuICAgIChwaWVjZS5yb2xlICE9PSAncGF3bicgfHwgKGRlc3RbMV0gIT09ICcxJyAmJiBkZXN0WzFdICE9PSAnOCcpKSAmJlxuICAgIGRhdGEubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiZcbiAgICBkYXRhLnR1cm5Db2xvciAhPT0gcGllY2UuY29sb3I7XG59XG5cbmZ1bmN0aW9uIGlzRHJhZ2dhYmxlKGRhdGEsIG9yaWcpIHtcbiAgdmFyIHBpZWNlID0gZGF0YS5waWVjZXNbb3JpZ107XG4gIHJldHVybiBwaWVjZSAmJiBkYXRhLmRyYWdnYWJsZS5lbmFibGVkICYmIChcbiAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09ICdib3RoJyB8fCAoXG4gICAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmIChcbiAgICAgICAgZGF0YS50dXJuQ29sb3IgPT09IHBpZWNlLmNvbG9yIHx8IGRhdGEucHJlbW92YWJsZS5lbmFibGVkXG4gICAgICApXG4gICAgKVxuICApO1xufVxuXG5mdW5jdGlvbiBwbGF5UHJlbW92ZShkYXRhKSB7XG4gIHZhciBtb3ZlID0gZGF0YS5wcmVtb3ZhYmxlLmN1cnJlbnQ7XG4gIGlmICghbW92ZSkgcmV0dXJuO1xuICB2YXIgb3JpZyA9IG1vdmVbMF0sXG4gICAgZGVzdCA9IG1vdmVbMV0sXG4gICAgc3VjY2VzcyA9IGZhbHNlO1xuICBpZiAoY2FuTW92ZShkYXRhLCBvcmlnLCBkZXN0KSkge1xuICAgIGlmIChiYXNlVXNlck1vdmUoZGF0YSwgb3JpZywgZGVzdCkpIHtcbiAgICAgIGNhbGxVc2VyRnVuY3Rpb24odXRpbC5wYXJ0aWFsKGRhdGEubW92YWJsZS5ldmVudHMuYWZ0ZXIsIG9yaWcsIGRlc3QsIHtcbiAgICAgICAgcHJlbW92ZTogdHJ1ZVxuICAgICAgfSkpO1xuICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICB9XG4gIHVuc2V0UHJlbW92ZShkYXRhKTtcbiAgcmV0dXJuIHN1Y2Nlc3M7XG59XG5cbmZ1bmN0aW9uIHBsYXlQcmVkcm9wKGRhdGEsIHZhbGlkYXRlKSB7XG4gIHZhciBkcm9wID0gZGF0YS5wcmVkcm9wcGFibGUuY3VycmVudCxcbiAgICBzdWNjZXNzID0gZmFsc2U7XG4gIGlmICghZHJvcC5rZXkpIHJldHVybjtcbiAgaWYgKHZhbGlkYXRlKGRyb3ApKSB7XG4gICAgdmFyIHBpZWNlID0ge1xuICAgICAgcm9sZTogZHJvcC5yb2xlLFxuICAgICAgY29sb3I6IGRhdGEubW92YWJsZS5jb2xvclxuICAgIH07XG4gICAgaWYgKGJhc2VOZXdQaWVjZShkYXRhLCBwaWVjZSwgZHJvcC5rZXkpKSB7XG4gICAgICBjYWxsVXNlckZ1bmN0aW9uKHV0aWwucGFydGlhbChkYXRhLm1vdmFibGUuZXZlbnRzLmFmdGVyTmV3UGllY2UsIGRyb3Aucm9sZSwgZHJvcC5rZXksIHtcbiAgICAgICAgcHJlZHJvcDogdHJ1ZVxuICAgICAgfSkpO1xuICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICB9XG4gIHVuc2V0UHJlZHJvcChkYXRhKTtcbiAgcmV0dXJuIHN1Y2Nlc3M7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbE1vdmUoZGF0YSkge1xuICB1bnNldFByZW1vdmUoZGF0YSk7XG4gIHVuc2V0UHJlZHJvcChkYXRhKTtcbiAgc2VsZWN0U3F1YXJlKGRhdGEsIG51bGwpO1xufVxuXG5mdW5jdGlvbiBzdG9wKGRhdGEpIHtcbiAgZGF0YS5tb3ZhYmxlLmNvbG9yID0gbnVsbDtcbiAgZGF0YS5tb3ZhYmxlLmRlc3RzID0ge307XG4gIGNhbmNlbE1vdmUoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGdldEtleUF0RG9tUG9zKGRhdGEsIHBvcywgYm91bmRzKSB7XG4gIGlmICghYm91bmRzICYmICFkYXRhLmJvdW5kcykgcmV0dXJuO1xuICBib3VuZHMgPSBib3VuZHMgfHwgZGF0YS5ib3VuZHMoKTsgLy8gdXNlIHByb3ZpZGVkIHZhbHVlLCBvciBjb21wdXRlIGl0XG4gIHZhciBmaWxlID0gTWF0aC5jZWlsKDggKiAoKHBvc1swXSAtIGJvdW5kcy5sZWZ0KSAvIGJvdW5kcy53aWR0aCkpO1xuICBmaWxlID0gZGF0YS5vcmllbnRhdGlvbiA9PT0gJ3doaXRlJyA/IGZpbGUgOiA5IC0gZmlsZTtcbiAgdmFyIHJhbmsgPSBNYXRoLmNlaWwoOCAtICg4ICogKChwb3NbMV0gLSBib3VuZHMudG9wKSAvIGJvdW5kcy5oZWlnaHQpKSk7XG4gIHJhbmsgPSBkYXRhLm9yaWVudGF0aW9uID09PSAnd2hpdGUnID8gcmFuayA6IDkgLSByYW5rO1xuICBpZiAoZmlsZSA+IDAgJiYgZmlsZSA8IDkgJiYgcmFuayA+IDAgJiYgcmFuayA8IDkpIHJldHVybiB1dGlsLnBvczJrZXkoW2ZpbGUsIHJhbmtdKTtcbn1cblxuLy8ge3doaXRlOiB7cGF3bjogMyBxdWVlbjogMX0sIGJsYWNrOiB7YmlzaG9wOiAyfX1cbmZ1bmN0aW9uIGdldE1hdGVyaWFsRGlmZihkYXRhKSB7XG4gIHZhciBjb3VudHMgPSB7XG4gICAga2luZzogMCxcbiAgICBxdWVlbjogMCxcbiAgICByb29rOiAwLFxuICAgIGJpc2hvcDogMCxcbiAgICBrbmlnaHQ6IDAsXG4gICAgcGF3bjogMFxuICB9O1xuICBmb3IgKHZhciBrIGluIGRhdGEucGllY2VzKSB7XG4gICAgdmFyIHAgPSBkYXRhLnBpZWNlc1trXTtcbiAgICBjb3VudHNbcC5yb2xlXSArPSAoKHAuY29sb3IgPT09ICd3aGl0ZScpID8gMSA6IC0xKTtcbiAgfVxuICB2YXIgZGlmZiA9IHtcbiAgICB3aGl0ZToge30sXG4gICAgYmxhY2s6IHt9XG4gIH07XG4gIGZvciAodmFyIHJvbGUgaW4gY291bnRzKSB7XG4gICAgdmFyIGMgPSBjb3VudHNbcm9sZV07XG4gICAgaWYgKGMgPiAwKSBkaWZmLndoaXRlW3JvbGVdID0gYztcbiAgICBlbHNlIGlmIChjIDwgMCkgZGlmZi5ibGFja1tyb2xlXSA9IC1jO1xuICB9XG4gIHJldHVybiBkaWZmO1xufVxuXG52YXIgcGllY2VTY29yZXMgPSB7XG4gIHBhd246IDEsXG4gIGtuaWdodDogMyxcbiAgYmlzaG9wOiAzLFxuICByb29rOiA1LFxuICBxdWVlbjogOSxcbiAga2luZzogMFxufTtcblxuZnVuY3Rpb24gZ2V0U2NvcmUoZGF0YSkge1xuICB2YXIgc2NvcmUgPSAwO1xuICBmb3IgKHZhciBrIGluIGRhdGEucGllY2VzKSB7XG4gICAgc2NvcmUgKz0gcGllY2VTY29yZXNbZGF0YS5waWVjZXNba10ucm9sZV0gKiAoZGF0YS5waWVjZXNba10uY29sb3IgPT09ICd3aGl0ZScgPyAxIDogLTEpO1xuICB9XG4gIHJldHVybiBzY29yZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlc2V0OiByZXNldCxcbiAgdG9nZ2xlT3JpZW50YXRpb246IHRvZ2dsZU9yaWVudGF0aW9uLFxuICBzZXRQaWVjZXM6IHNldFBpZWNlcyxcbiAgc2V0Q2hlY2s6IHNldENoZWNrLFxuICBzZWxlY3RTcXVhcmU6IHNlbGVjdFNxdWFyZSxcbiAgc2V0U2VsZWN0ZWQ6IHNldFNlbGVjdGVkLFxuICBpc0RyYWdnYWJsZTogaXNEcmFnZ2FibGUsXG4gIGNhbk1vdmU6IGNhbk1vdmUsXG4gIHVzZXJNb3ZlOiB1c2VyTW92ZSxcbiAgZHJvcE5ld1BpZWNlOiBkcm9wTmV3UGllY2UsXG4gIGFwaU1vdmU6IGFwaU1vdmUsXG4gIGFwaU5ld1BpZWNlOiBhcGlOZXdQaWVjZSxcbiAgcGxheVByZW1vdmU6IHBsYXlQcmVtb3ZlLFxuICBwbGF5UHJlZHJvcDogcGxheVByZWRyb3AsXG4gIHVuc2V0UHJlbW92ZTogdW5zZXRQcmVtb3ZlLFxuICB1bnNldFByZWRyb3A6IHVuc2V0UHJlZHJvcCxcbiAgY2FuY2VsTW92ZTogY2FuY2VsTW92ZSxcbiAgc3RvcDogc3RvcCxcbiAgZ2V0S2V5QXREb21Qb3M6IGdldEtleUF0RG9tUG9zLFxuICBnZXRNYXRlcmlhbERpZmY6IGdldE1hdGVyaWFsRGlmZixcbiAgZ2V0U2NvcmU6IGdldFNjb3JlXG59O1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnbWVyZ2UnKTtcbnZhciBib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbnZhciBmZW4gPSByZXF1aXJlKCcuL2ZlbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEsIGNvbmZpZykge1xuXG4gIGlmICghY29uZmlnKSByZXR1cm47XG5cbiAgLy8gZG9uJ3QgbWVyZ2UgZGVzdGluYXRpb25zLiBKdXN0IG92ZXJyaWRlLlxuICBpZiAoY29uZmlnLm1vdmFibGUgJiYgY29uZmlnLm1vdmFibGUuZGVzdHMpIGRlbGV0ZSBkYXRhLm1vdmFibGUuZGVzdHM7XG5cbiAgbWVyZ2UucmVjdXJzaXZlKGRhdGEsIGNvbmZpZyk7XG5cbiAgLy8gaWYgYSBmZW4gd2FzIHByb3ZpZGVkLCByZXBsYWNlIHRoZSBwaWVjZXNcbiAgaWYgKGRhdGEuZmVuKSB7XG4gICAgZGF0YS5waWVjZXMgPSBmZW4ucmVhZChkYXRhLmZlbik7XG4gICAgZGF0YS5jaGVjayA9IGNvbmZpZy5jaGVjaztcbiAgICBkYXRhLmRyYXdhYmxlLnNoYXBlcyA9IFtdO1xuICAgIGRlbGV0ZSBkYXRhLmZlbjtcbiAgfVxuXG4gIGlmIChkYXRhLmNoZWNrID09PSB0cnVlKSBib2FyZC5zZXRDaGVjayhkYXRhKTtcblxuICAvLyBmb3JnZXQgYWJvdXQgdGhlIGxhc3QgZHJvcHBlZCBwaWVjZVxuICBkYXRhLm1vdmFibGUuZHJvcHBlZCA9IFtdO1xuXG4gIC8vIGZpeCBtb3ZlL3ByZW1vdmUgZGVzdHNcbiAgaWYgKGRhdGEuc2VsZWN0ZWQpIGJvYXJkLnNldFNlbGVjdGVkKGRhdGEsIGRhdGEuc2VsZWN0ZWQpO1xuXG4gIC8vIG5vIG5lZWQgZm9yIHN1Y2ggc2hvcnQgYW5pbWF0aW9uc1xuICBpZiAoIWRhdGEuYW5pbWF0aW9uLmR1cmF0aW9uIHx8IGRhdGEuYW5pbWF0aW9uLmR1cmF0aW9uIDwgNDApXG4gICAgZGF0YS5hbmltYXRpb24uZW5hYmxlZCA9IGZhbHNlO1xuXG4gIGlmICghZGF0YS5tb3ZhYmxlLnJvb2tDYXN0bGUpIHtcbiAgICB2YXIgcmFuayA9IGRhdGEubW92YWJsZS5jb2xvciA9PT0gJ3doaXRlJyA/IDEgOiA4O1xuICAgIHZhciBraW5nU3RhcnRQb3MgPSAnZScgKyByYW5rO1xuICAgIGlmIChkYXRhLm1vdmFibGUuZGVzdHMpIHtcbiAgICAgIHZhciBkZXN0cyA9IGRhdGEubW92YWJsZS5kZXN0c1traW5nU3RhcnRQb3NdO1xuICAgICAgaWYgKCFkZXN0cyB8fCBkYXRhLnBpZWNlc1traW5nU3RhcnRQb3NdLnJvbGUgIT09ICdraW5nJykgcmV0dXJuO1xuICAgICAgZGF0YS5tb3ZhYmxlLmRlc3RzW2tpbmdTdGFydFBvc10gPSBkZXN0cy5maWx0ZXIoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZCAhPT0gJ2EnICsgcmFuayAmJiBkICE9PSAnaCcgKyByYW5rXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmZ1bmN0aW9uIHJlbmRlckNvb3JkcyhlbGVtcywga2xhc3MsIG9yaWVudCkge1xuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb29yZHMnKTtcbiAgZWwuY2xhc3NOYW1lID0ga2xhc3M7XG4gIGVsZW1zLmZvckVhY2goZnVuY3Rpb24oY29udGVudCkge1xuICAgIHZhciBmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29vcmQnKTtcbiAgICBmLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICBlbC5hcHBlbmRDaGlsZChmKTtcbiAgfSk7XG4gIHJldHVybiBlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmllbnRhdGlvbiwgZWwpIHtcblxuICB1dGlsLnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICB2YXIgY29vcmRzID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciBvcmllbnRDbGFzcyA9IG9yaWVudGF0aW9uID09PSAnYmxhY2snID8gJyBibGFjaycgOiAnJztcbiAgICBjb29yZHMuYXBwZW5kQ2hpbGQocmVuZGVyQ29vcmRzKHV0aWwucmFua3MsICdyYW5rcycgKyBvcmllbnRDbGFzcykpO1xuICAgIGNvb3Jkcy5hcHBlbmRDaGlsZChyZW5kZXJDb29yZHModXRpbC5maWxlcywgJ2ZpbGVzJyArIG9yaWVudENsYXNzKSk7XG4gICAgZWwuYXBwZW5kQ2hpbGQoY29vcmRzKTtcbiAgfSk7XG5cbiAgdmFyIG9yaWVudGF0aW9uO1xuXG4gIHJldHVybiBmdW5jdGlvbihvKSB7XG4gICAgaWYgKG8gPT09IG9yaWVudGF0aW9uKSByZXR1cm47XG4gICAgb3JpZW50YXRpb24gPSBvO1xuICAgIHZhciBjb29yZHMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCdjb29yZHMnKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgKytpKVxuICAgICAgY29vcmRzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2JsYWNrJywgbyA9PT0gJ2JsYWNrJyk7XG4gIH07XG59XG4iLCJ2YXIgYm9hcmQgPSByZXF1aXJlKCcuL2JvYXJkJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmFyIGZlbiA9IHJlcXVpcmUoJy4vZmVuJyk7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcbnZhciBhbmltID0gcmVxdWlyZSgnLi9hbmltJyk7XG52YXIgZHJhZyA9IHJlcXVpcmUoJy4vZHJhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNmZykge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGEoY2ZnKTtcblxuICB0aGlzLnZtID0ge1xuICAgIGV4cGxvZGluZzogZmFsc2VcbiAgfTtcblxuICB0aGlzLmdldEZlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZW4ud3JpdGUodGhpcy5kYXRhLnBpZWNlcyk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmdldE9yaWVudGF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5vcmllbnRhdGlvbjtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc2V0ID0gYW5pbShjb25maWd1cmUsIHRoaXMuZGF0YSk7XG5cbiAgdGhpcy50b2dnbGVPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGFuaW0oYm9hcmQudG9nZ2xlT3JpZW50YXRpb24sIHRoaXMuZGF0YSkoKTtcbiAgICBpZiAodGhpcy5kYXRhLnJlZHJhd0Nvb3JkcykgdGhpcy5kYXRhLnJlZHJhd0Nvb3Jkcyh0aGlzLmRhdGEub3JpZW50YXRpb24pO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5zZXRQaWVjZXMgPSBhbmltKGJvYXJkLnNldFBpZWNlcywgdGhpcy5kYXRhKTtcblxuICB0aGlzLnNlbGVjdFNxdWFyZSA9IGFuaW0oYm9hcmQuc2VsZWN0U3F1YXJlLCB0aGlzLmRhdGEsIHRydWUpO1xuXG4gIHRoaXMuYXBpTW92ZSA9IGFuaW0oYm9hcmQuYXBpTW92ZSwgdGhpcy5kYXRhKTtcblxuICB0aGlzLmFwaU5ld1BpZWNlID0gYW5pbShib2FyZC5hcGlOZXdQaWVjZSwgdGhpcy5kYXRhKTtcblxuICB0aGlzLnBsYXlQcmVtb3ZlID0gYW5pbShib2FyZC5wbGF5UHJlbW92ZSwgdGhpcy5kYXRhKTtcblxuICB0aGlzLnBsYXlQcmVkcm9wID0gYW5pbShib2FyZC5wbGF5UHJlZHJvcCwgdGhpcy5kYXRhKTtcblxuICB0aGlzLmNhbmNlbFByZW1vdmUgPSBhbmltKGJvYXJkLnVuc2V0UHJlbW92ZSwgdGhpcy5kYXRhLCB0cnVlKTtcblxuICB0aGlzLmNhbmNlbFByZWRyb3AgPSBhbmltKGJvYXJkLnVuc2V0UHJlZHJvcCwgdGhpcy5kYXRhLCB0cnVlKTtcblxuICB0aGlzLnNldENoZWNrID0gYW5pbShib2FyZC5zZXRDaGVjaywgdGhpcy5kYXRhLCB0cnVlKTtcblxuICB0aGlzLmNhbmNlbE1vdmUgPSBhbmltKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBib2FyZC5jYW5jZWxNb3ZlKGRhdGEpO1xuICAgIGRyYWcuY2FuY2VsKGRhdGEpO1xuICB9LmJpbmQodGhpcyksIHRoaXMuZGF0YSwgdHJ1ZSk7XG5cbiAgdGhpcy5zdG9wID0gYW5pbShmdW5jdGlvbihkYXRhKSB7XG4gICAgYm9hcmQuc3RvcChkYXRhKTtcbiAgICBkcmFnLmNhbmNlbChkYXRhKTtcbiAgfS5iaW5kKHRoaXMpLCB0aGlzLmRhdGEsIHRydWUpO1xuXG4gIHRoaXMuZXhwbG9kZSA9IGZ1bmN0aW9uKGtleXMpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5yZW5kZXIpIHJldHVybjtcbiAgICB0aGlzLnZtLmV4cGxvZGluZyA9IHtcbiAgICAgIHN0YWdlOiAxLFxuICAgICAga2V5czoga2V5c1xuICAgIH07XG4gICAgdGhpcy5kYXRhLnJlbmRlclJBRigpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnZtLmV4cGxvZGluZy5zdGFnZSA9IDI7XG4gICAgICB0aGlzLmRhdGEucmVuZGVyUkFGKCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnZtLmV4cGxvZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRhdGEucmVuZGVyUkFGKCk7XG4gICAgICB9LmJpbmQodGhpcyksIDEyMCk7XG4gICAgfS5iaW5kKHRoaXMpLCAxMjApO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5zZXRBdXRvU2hhcGVzID0gZnVuY3Rpb24oc2hhcGVzKSB7XG4gICAgYW5pbShmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkYXRhLmRyYXdhYmxlLmF1dG9TaGFwZXMgPSBzaGFwZXM7XG4gICAgfSwgdGhpcy5kYXRhLCBmYWxzZSkoKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc2V0U2hhcGVzID0gZnVuY3Rpb24oc2hhcGVzKSB7XG4gICAgYW5pbShmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkYXRhLmRyYXdhYmxlLnNoYXBlcyA9IHNoYXBlcztcbiAgICB9LCB0aGlzLmRhdGEsIGZhbHNlKSgpO1xuICB9LmJpbmQodGhpcyk7XG59O1xuIiwidmFyIGZlbiA9IHJlcXVpcmUoJy4vZmVuJyk7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjZmcpIHtcbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIHBpZWNlczogZmVuLnJlYWQoZmVuLmluaXRpYWwpLFxuICAgIG9yaWVudGF0aW9uOiAnd2hpdGUnLCAvLyBib2FyZCBvcmllbnRhdGlvbi4gd2hpdGUgfCBibGFja1xuICAgIHR1cm5Db2xvcjogJ3doaXRlJywgLy8gdHVybiB0byBwbGF5LiB3aGl0ZSB8IGJsYWNrXG4gICAgY2hlY2s6IG51bGwsIC8vIHNxdWFyZSBjdXJyZW50bHkgaW4gY2hlY2sgXCJhMlwiIHwgbnVsbFxuICAgIGxhc3RNb3ZlOiBudWxsLCAvLyBzcXVhcmVzIHBhcnQgb2YgdGhlIGxhc3QgbW92ZSBbXCJjM1wiLCBcImM0XCJdIHwgbnVsbFxuICAgIHNlbGVjdGVkOiBudWxsLCAvLyBzcXVhcmUgY3VycmVudGx5IHNlbGVjdGVkIFwiYTFcIiB8IG51bGxcbiAgICBjb29yZGluYXRlczogdHJ1ZSwgLy8gaW5jbHVkZSBjb29yZHMgYXR0cmlidXRlc1xuICAgIHJlbmRlcjogbnVsbCwgLy8gZnVuY3Rpb24gdGhhdCByZXJlbmRlcnMgdGhlIGJvYXJkXG4gICAgcmVuZGVyUkFGOiBudWxsLCAvLyBmdW5jdGlvbiB0aGF0IHJlcmVuZGVycyB0aGUgYm9hcmQgdXNpbmcgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgZWxlbWVudDogbnVsbCwgLy8gRE9NIGVsZW1lbnQgb2YgdGhlIGJvYXJkLCByZXF1aXJlZCBmb3IgZHJhZyBwaWVjZSBjZW50ZXJpbmdcbiAgICBib3VuZHM6IG51bGwsIC8vIGZ1bmN0aW9uIHRoYXQgY2FsY3VsYXRlcyB0aGUgYm9hcmQgYm91bmRzXG4gICAgYXV0b0Nhc3RsZTogZmFsc2UsIC8vIGltbWVkaWF0ZWx5IGNvbXBsZXRlIHRoZSBjYXN0bGUgYnkgbW92aW5nIHRoZSByb29rIGFmdGVyIGtpbmcgbW92ZVxuICAgIHZpZXdPbmx5OiBmYWxzZSwgLy8gZG9uJ3QgYmluZCBldmVudHM6IHRoZSB1c2VyIHdpbGwgbmV2ZXIgYmUgYWJsZSB0byBtb3ZlIHBpZWNlcyBhcm91bmRcbiAgICBkaXNhYmxlQ29udGV4dE1lbnU6IGZhbHNlLCAvLyBiZWNhdXNlIHdobyBuZWVkcyBhIGNvbnRleHQgbWVudSBvbiBhIGNoZXNzYm9hcmRcbiAgICByZXNpemFibGU6IHRydWUsIC8vIGxpc3RlbnMgdG8gY2hlc3Nncm91bmQucmVzaXplIG9uIGRvY3VtZW50LmJvZHkgdG8gY2xlYXIgYm91bmRzIGNhY2hlXG4gICAgcGllY2VLZXk6IGZhbHNlLCAvLyBhZGQgYSBkYXRhLWtleSBhdHRyaWJ1dGUgdG8gcGllY2UgZWxlbWVudHNcbiAgICBoaWdobGlnaHQ6IHtcbiAgICAgIGxhc3RNb3ZlOiB0cnVlLCAvLyBhZGQgbGFzdC1tb3ZlIGNsYXNzIHRvIHNxdWFyZXNcbiAgICAgIGNoZWNrOiB0cnVlLCAvLyBhZGQgY2hlY2sgY2xhc3MgdG8gc3F1YXJlc1xuICAgICAgZHJhZ092ZXI6IHRydWUgLy8gYWRkIGRyYWctb3ZlciBjbGFzcyB0byBzcXVhcmUgd2hlbiBkcmFnZ2luZyBvdmVyIGl0XG4gICAgfSxcbiAgICBhbmltYXRpb246IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgLyp7IC8vIGN1cnJlbnRcbiAgICAgICAqICBzdGFydDogdGltZXN0YW1wLFxuICAgICAgICogIGR1cmF0aW9uOiBtcyxcbiAgICAgICAqICBhbmltczoge1xuICAgICAgICogICAgYTI6IFtcbiAgICAgICAqICAgICAgWy0zMCwgNTBdLCAvLyBhbmltYXRpb24gZ29hbFxuICAgICAgICogICAgICBbLTIwLCAzN10gIC8vIGFuaW1hdGlvbiBjdXJyZW50IHN0YXR1c1xuICAgICAgICogICAgXSwgLi4uXG4gICAgICAgKiAgfSxcbiAgICAgICAqICBmYWRpbmc6IFtcbiAgICAgICAqICAgIHtcbiAgICAgICAqICAgICAgcG9zOiBbODAsIDEyMF0sIC8vIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBib2FyZFxuICAgICAgICogICAgICBvcGFjaXR5OiAwLjM0LFxuICAgICAgICogICAgICByb2xlOiAncm9vaycsXG4gICAgICAgKiAgICAgIGNvbG9yOiAnYmxhY2snXG4gICAgICAgKiAgICB9XG4gICAgICAgKiAgfVxuICAgICAgICp9Ki9cbiAgICAgIGN1cnJlbnQ6IHt9XG4gICAgfSxcbiAgICBtb3ZhYmxlOiB7XG4gICAgICBmcmVlOiB0cnVlLCAvLyBhbGwgbW92ZXMgYXJlIHZhbGlkIC0gYm9hcmQgZWRpdG9yXG4gICAgICBjb2xvcjogJ2JvdGgnLCAvLyBjb2xvciB0aGF0IGNhbiBtb3ZlLiB3aGl0ZSB8IGJsYWNrIHwgYm90aCB8IG51bGxcbiAgICAgIGRlc3RzOiB7fSwgLy8gdmFsaWQgbW92ZXMuIHtcImEyXCIgW1wiYTNcIiBcImE0XCJdIFwiYjFcIiBbXCJhM1wiIFwiYzNcIl19IHwgbnVsbFxuICAgICAgZHJvcE9mZjogJ3JldmVydCcsIC8vIHdoZW4gYSBwaWVjZSBpcyBkcm9wcGVkIG91dHNpZGUgdGhlIGJvYXJkLiBcInJldmVydFwiIHwgXCJ0cmFzaFwiXG4gICAgICBkcm9wcGVkOiBbXSwgLy8gbGFzdCBkcm9wcGVkIFtvcmlnLCBkZXN0XSwgbm90IHRvIGJlIGFuaW1hdGVkXG4gICAgICBzaG93RGVzdHM6IHRydWUsIC8vIHdoZXRoZXIgdG8gYWRkIHRoZSBtb3ZlLWRlc3QgY2xhc3Mgb24gc3F1YXJlc1xuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbihvcmlnLCBkZXN0LCBtZXRhZGF0YSkge30sIC8vIGNhbGxlZCBhZnRlciB0aGUgbW92ZSBoYXMgYmVlbiBwbGF5ZWRcbiAgICAgICAgYWZ0ZXJOZXdQaWVjZTogZnVuY3Rpb24ocm9sZSwgcG9zKSB7fSAvLyBjYWxsZWQgYWZ0ZXIgYSBuZXcgcGllY2UgaXMgZHJvcHBlZCBvbiB0aGUgYm9hcmRcbiAgICAgIH0sXG4gICAgICByb29rQ2FzdGxlOiB0cnVlIC8vIGNhc3RsZSBieSBtb3ZpbmcgdGhlIGtpbmcgdG8gdGhlIHJvb2tcbiAgICB9LFxuICAgIHByZW1vdmFibGU6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGFsbG93IHByZW1vdmVzIGZvciBjb2xvciB0aGF0IGNhbiBub3QgbW92ZVxuICAgICAgc2hvd0Rlc3RzOiB0cnVlLCAvLyB3aGV0aGVyIHRvIGFkZCB0aGUgcHJlbW92ZS1kZXN0IGNsYXNzIG9uIHNxdWFyZXNcbiAgICAgIGNhc3RsZTogdHJ1ZSwgLy8gd2hldGhlciB0byBhbGxvdyBraW5nIGNhc3RsZSBwcmVtb3Zlc1xuICAgICAgZGVzdHM6IFtdLCAvLyBwcmVtb3ZlIGRlc3RpbmF0aW9ucyBmb3IgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICBjdXJyZW50OiBudWxsLCAvLyBrZXlzIG9mIHRoZSBjdXJyZW50IHNhdmVkIHByZW1vdmUgW1wiZTJcIiBcImU0XCJdIHwgbnVsbFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24ob3JpZywgZGVzdCkge30sIC8vIGNhbGxlZCBhZnRlciB0aGUgcHJlbW92ZSBoYXMgYmVlbiBzZXRcbiAgICAgICAgdW5zZXQ6IGZ1bmN0aW9uKCkge30gLy8gY2FsbGVkIGFmdGVyIHRoZSBwcmVtb3ZlIGhhcyBiZWVuIHVuc2V0XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmVkcm9wcGFibGU6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLCAvLyBhbGxvdyBwcmVkcm9wcyBmb3IgY29sb3IgdGhhdCBjYW4gbm90IG1vdmVcbiAgICAgIGN1cnJlbnQ6IHt9LCAvLyBjdXJyZW50IHNhdmVkIHByZWRyb3Age3JvbGU6ICdrbmlnaHQnLCBrZXk6ICdlNCd9IHwge31cbiAgICAgIGV2ZW50czoge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHJvbGUsIGtleSkge30sIC8vIGNhbGxlZCBhZnRlciB0aGUgcHJlZHJvcCBoYXMgYmVlbiBzZXRcbiAgICAgICAgdW5zZXQ6IGZ1bmN0aW9uKCkge30gLy8gY2FsbGVkIGFmdGVyIHRoZSBwcmVkcm9wIGhhcyBiZWVuIHVuc2V0XG4gICAgICB9XG4gICAgfSxcbiAgICBkcmFnZ2FibGU6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGFsbG93IG1vdmVzICYgcHJlbW92ZXMgdG8gdXNlIGRyYWcnbiBkcm9wXG4gICAgICBkaXN0YW5jZTogMywgLy8gbWluaW11bSBkaXN0YW5jZSB0byBpbml0aWF0ZSBhIGRyYWcsIGluIHBpeGVsc1xuICAgICAgYXV0b0Rpc3RhbmNlOiB0cnVlLCAvLyBsZXRzIGNoZXNzZ3JvdW5kIHNldCBkaXN0YW5jZSB0byB6ZXJvIHdoZW4gdXNlciBkcmFncyBwaWVjZXNcbiAgICAgIGNlbnRlclBpZWNlOiB0cnVlLCAvLyBjZW50ZXIgdGhlIHBpZWNlIG9uIGN1cnNvciBhdCBkcmFnIHN0YXJ0XG4gICAgICBzaG93R2hvc3Q6IHRydWUsIC8vIHNob3cgZ2hvc3Qgb2YgcGllY2UgYmVpbmcgZHJhZ2dlZFxuICAgICAgLyp7IC8vIGN1cnJlbnRcbiAgICAgICAqICBvcmlnOiBcImEyXCIsIC8vIG9yaWcga2V5IG9mIGRyYWdnaW5nIHBpZWNlXG4gICAgICAgKiAgcmVsOiBbMTAwLCAxNzBdIC8vIHgsIHkgb2YgdGhlIHBpZWNlIGF0IG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgKiAgcG9zOiBbMjAsIC0xMl0gLy8gcmVsYXRpdmUgY3VycmVudCBwb3NpdGlvblxuICAgICAgICogIGRlYzogWzQsIC04XSAvLyBwaWVjZSBjZW50ZXIgZGVjYXlcbiAgICAgICAqICBvdmVyOiBcImIzXCIgLy8gc3F1YXJlIGJlaW5nIG1vdXNlZCBvdmVyXG4gICAgICAgKiAgYm91bmRzOiBjdXJyZW50IGNhY2hlZCBib2FyZCBib3VuZHNcbiAgICAgICAqICBzdGFydGVkOiB3aGV0aGVyIHRoZSBkcmFnIGhhcyBzdGFydGVkLCBhcyBwZXIgdGhlIGRpc3RhbmNlIHNldHRpbmdcbiAgICAgICAqfSovXG4gICAgICBjdXJyZW50OiB7fVxuICAgIH0sXG4gICAgc2VsZWN0YWJsZToge1xuICAgICAgLy8gZGlzYWJsZSB0byBlbmZvcmNlIGRyYWdnaW5nIG92ZXIgY2xpY2stY2xpY2sgbW92ZVxuICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgIH0sXG4gICAgc3RhdHM6IHtcbiAgICAgIC8vIHdhcyBsYXN0IHBpZWNlIGRyYWdnZWQgb3IgY2xpY2tlZD9cbiAgICAgIC8vIG5lZWRzIGRlZmF1bHQgdG8gZmFsc2UgZm9yIHRvdWNoXG4gICAgICBkcmFnZ2VkOiAhKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdylcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgY2hhbmdlOiBmdW5jdGlvbigpIHt9LCAvLyBjYWxsZWQgYWZ0ZXIgdGhlIHNpdHVhdGlvbiBjaGFuZ2VzIG9uIHRoZSBib2FyZFxuICAgICAgLy8gY2FsbGVkIGFmdGVyIGEgcGllY2UgaGFzIGJlZW4gbW92ZWQuXG4gICAgICAvLyBjYXB0dXJlZFBpZWNlIGlzIG51bGwgb3IgbGlrZSB7Y29sb3I6ICd3aGl0ZScsICdyb2xlJzogJ3F1ZWVuJ31cbiAgICAgIG1vdmU6IGZ1bmN0aW9uKG9yaWcsIGRlc3QsIGNhcHR1cmVkUGllY2UpIHt9LFxuICAgICAgZHJvcE5ld1BpZWNlOiBmdW5jdGlvbihyb2xlLCBwb3MpIHt9LFxuICAgICAgY2FwdHVyZTogZnVuY3Rpb24oa2V5LCBwaWVjZSkge30sIC8vIERFUFJFQ0FURUQgY2FsbGVkIHdoZW4gYSBwaWVjZSBoYXMgYmVlbiBjYXB0dXJlZFxuICAgICAgc2VsZWN0OiBmdW5jdGlvbihrZXkpIHt9IC8vIGNhbGxlZCB3aGVuIGEgc3F1YXJlIGlzIHNlbGVjdGVkXG4gICAgfSxcbiAgICBpdGVtczogbnVsbCwgLy8gaXRlbXMgb24gdGhlIGJvYXJkIHsgcmVuZGVyOiBrZXkgLT4gdmRvbSB9XG4gICAgZHJhd2FibGU6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLCAvLyBhbGxvd3MgU1ZHIGRyYXdpbmdzXG4gICAgICBlcmFzZU9uQ2xpY2s6IHRydWUsXG4gICAgICBvbkNoYW5nZTogZnVuY3Rpb24oc2hhcGVzKSB7fSxcbiAgICAgIC8vIHVzZXIgc2hhcGVzXG4gICAgICBzaGFwZXM6IFtcbiAgICAgICAgLy8ge2JydXNoOiAnZ3JlZW4nLCBvcmlnOiAnZTgnfSxcbiAgICAgICAgLy8ge2JydXNoOiAneWVsbG93Jywgb3JpZzogJ2M0JywgZGVzdDogJ2Y3J31cbiAgICAgIF0sXG4gICAgICAvLyBjb21wdXRlciBzaGFwZXNcbiAgICAgIGF1dG9TaGFwZXM6IFtcbiAgICAgICAgLy8ge2JydXNoOiAncGFsZUJsdWUnLCBvcmlnOiAnZTgnfSxcbiAgICAgICAgLy8ge2JydXNoOiAncGFsZVJlZCcsIG9yaWc6ICdjNCcsIGRlc3Q6ICdmNyd9XG4gICAgICBdLFxuICAgICAgLyp7IC8vIGN1cnJlbnRcbiAgICAgICAqICBvcmlnOiBcImEyXCIsIC8vIG9yaWcga2V5IG9mIGRyYXdpbmdcbiAgICAgICAqICBwb3M6IFsyMCwgLTEyXSAvLyByZWxhdGl2ZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICAgKiAgZGVzdDogXCJiM1wiIC8vIHNxdWFyZSBiZWluZyBtb3VzZWQgb3ZlclxuICAgICAgICogIGJvdW5kczogLy8gY3VycmVudCBjYWNoZWQgYm9hcmQgYm91bmRzXG4gICAgICAgKiAgYnJ1c2g6ICdncmVlbicgLy8gYnJ1c2ggbmFtZSBmb3Igc2hhcGVcbiAgICAgICAqfSovXG4gICAgICBjdXJyZW50OiB7fSxcbiAgICAgIGJydXNoZXM6IHtcbiAgICAgICAgZ3JlZW46IHtcbiAgICAgICAgICBrZXk6ICdnJyxcbiAgICAgICAgICBjb2xvcjogJyMxNTc4MUInLFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgbGluZVdpZHRoOiAxMFxuICAgICAgICB9LFxuICAgICAgICByZWQ6IHtcbiAgICAgICAgICBrZXk6ICdyJyxcbiAgICAgICAgICBjb2xvcjogJyM4ODIwMjAnLFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgbGluZVdpZHRoOiAxMFxuICAgICAgICB9LFxuICAgICAgICBibHVlOiB7XG4gICAgICAgICAga2V5OiAnYicsXG4gICAgICAgICAgY29sb3I6ICcjMDAzMDg4JyxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIGxpbmVXaWR0aDogMTBcbiAgICAgICAgfSxcbiAgICAgICAgeWVsbG93OiB7XG4gICAgICAgICAga2V5OiAneScsXG4gICAgICAgICAgY29sb3I6ICcjZTY4ZjAwJyxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIGxpbmVXaWR0aDogMTBcbiAgICAgICAgfSxcbiAgICAgICAgcGFsZUJsdWU6IHtcbiAgICAgICAgICBrZXk6ICdwYicsXG4gICAgICAgICAgY29sb3I6ICcjMDAzMDg4JyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgbGluZVdpZHRoOiAxNVxuICAgICAgICB9LFxuICAgICAgICBwYWxlR3JlZW46IHtcbiAgICAgICAgICBrZXk6ICdwZycsXG4gICAgICAgICAgY29sb3I6ICcjMTU3ODFCJyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgbGluZVdpZHRoOiAxNVxuICAgICAgICB9LFxuICAgICAgICBwYWxlUmVkOiB7XG4gICAgICAgICAga2V5OiAncHInLFxuICAgICAgICAgIGNvbG9yOiAnIzg4MjAyMCcsXG4gICAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICAgIGxpbmVXaWR0aDogMTVcbiAgICAgICAgfSxcbiAgICAgICAgcGFsZUdyZXk6IHtcbiAgICAgICAgICBrZXk6ICdwZ3InLFxuICAgICAgICAgIGNvbG9yOiAnIzRhNGE0YScsXG4gICAgICAgICAgb3BhY2l0eTogMC4zNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBkcmF3YWJsZSBTVkcgcGllY2VzLCB1c2VkIGZvciBjcmF6eWhvdXNlIGRyb3BcbiAgICAgIHBpZWNlczoge1xuICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9saWNoZXNzMS5vcmcvYXNzZXRzL3BpZWNlL2NidXJuZXR0LydcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uZmlndXJlKGRlZmF1bHRzLCBjZmcgfHwge30pO1xuXG4gIHJldHVybiBkZWZhdWx0cztcbn07XG4iLCJ2YXIgYm9hcmQgPSByZXF1aXJlKCcuL2JvYXJkJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGRyYXcgPSByZXF1aXJlKCcuL2RyYXcnKTtcblxudmFyIG9yaWdpblRhcmdldDtcblxuZnVuY3Rpb24gaGFzaFBpZWNlKHBpZWNlKSB7XG4gIHJldHVybiBwaWVjZSA/IHBpZWNlLmNvbG9yICsgcGllY2Uucm9sZSA6ICcnO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3F1YXJlQm91bmRzKGRhdGEsIGJvdW5kcywga2V5KSB7XG4gIHZhciBwb3MgPSB1dGlsLmtleTJwb3Moa2V5KTtcbiAgaWYgKGRhdGEub3JpZW50YXRpb24gIT09ICd3aGl0ZScpIHtcbiAgICBwb3NbMF0gPSA5IC0gcG9zWzBdO1xuICAgIHBvc1sxXSA9IDkgLSBwb3NbMV07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCAqIChwb3NbMF0gLSAxKSAvIDgsXG4gICAgdG9wOiBib3VuZHMudG9wICsgYm91bmRzLmhlaWdodCAqICg4IC0gcG9zWzFdKSAvIDgsXG4gICAgd2lkdGg6IGJvdW5kcy53aWR0aCAvIDgsXG4gICAgaGVpZ2h0OiBib3VuZHMuaGVpZ2h0IC8gOFxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGFydChkYXRhLCBlKSB7XG4gIGlmIChlLmJ1dHRvbiAhPT0gdW5kZWZpbmVkICYmIGUuYnV0dG9uICE9PSAwKSByZXR1cm47IC8vIG9ubHkgdG91Y2ggb3IgbGVmdCBjbGlja1xuICBpZiAoZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPiAxKSByZXR1cm47IC8vIHN1cHBvcnQgb25lIGZpbmdlciB0b3VjaCBvbmx5XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgb3JpZ2luVGFyZ2V0ID0gZS50YXJnZXQ7XG4gIHZhciBwcmV2aW91c2x5U2VsZWN0ZWQgPSBkYXRhLnNlbGVjdGVkO1xuICB2YXIgcG9zaXRpb24gPSB1dGlsLmV2ZW50UG9zaXRpb24oZSk7XG4gIHZhciBib3VuZHMgPSBkYXRhLmJvdW5kcygpO1xuICB2YXIgb3JpZyA9IGJvYXJkLmdldEtleUF0RG9tUG9zKGRhdGEsIHBvc2l0aW9uLCBib3VuZHMpO1xuICB2YXIgcGllY2UgPSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgaWYgKCFwcmV2aW91c2x5U2VsZWN0ZWQgJiYgKFxuICAgIGRhdGEuZHJhd2FibGUuZXJhc2VPbkNsaWNrIHx8XG4gICAgKCFwaWVjZSB8fCBwaWVjZS5jb2xvciAhPT0gZGF0YS50dXJuQ29sb3IpXG4gICkpIGRyYXcuY2xlYXIoZGF0YSk7XG4gIGlmIChkYXRhLnZpZXdPbmx5KSByZXR1cm47XG4gIHZhciBoYWRQcmVtb3ZlID0gISFkYXRhLnByZW1vdmFibGUuY3VycmVudDtcbiAgdmFyIGhhZFByZWRyb3AgPSAhIWRhdGEucHJlZHJvcHBhYmxlLmN1cnJlbnQua2V5O1xuICBib2FyZC5zZWxlY3RTcXVhcmUoZGF0YSwgb3JpZyk7XG4gIHZhciBzdGlsbFNlbGVjdGVkID0gZGF0YS5zZWxlY3RlZCA9PT0gb3JpZztcbiAgaWYgKHBpZWNlICYmIHN0aWxsU2VsZWN0ZWQgJiYgYm9hcmQuaXNEcmFnZ2FibGUoZGF0YSwgb3JpZykpIHtcbiAgICB2YXIgc3F1YXJlQm91bmRzID0gY29tcHV0ZVNxdWFyZUJvdW5kcyhkYXRhLCBib3VuZHMsIG9yaWcpO1xuICAgIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7XG4gICAgICBwcmV2aW91c2x5U2VsZWN0ZWQ6IHByZXZpb3VzbHlTZWxlY3RlZCxcbiAgICAgIG9yaWc6IG9yaWcsXG4gICAgICBwaWVjZTogaGFzaFBpZWNlKHBpZWNlKSxcbiAgICAgIHJlbDogcG9zaXRpb24sXG4gICAgICBlcG9zOiBwb3NpdGlvbixcbiAgICAgIHBvczogWzAsIDBdLFxuICAgICAgZGVjOiBkYXRhLmRyYWdnYWJsZS5jZW50ZXJQaWVjZSA/IFtcbiAgICAgICAgcG9zaXRpb25bMF0gLSAoc3F1YXJlQm91bmRzLmxlZnQgKyBzcXVhcmVCb3VuZHMud2lkdGggLyAyKSxcbiAgICAgICAgcG9zaXRpb25bMV0gLSAoc3F1YXJlQm91bmRzLnRvcCArIHNxdWFyZUJvdW5kcy5oZWlnaHQgLyAyKVxuICAgICAgXSA6IFswLCAwXSxcbiAgICAgIGJvdW5kczogYm91bmRzLFxuICAgICAgc3RhcnRlZDogZGF0YS5kcmFnZ2FibGUuYXV0b0Rpc3RhbmNlICYmIGRhdGEuc3RhdHMuZHJhZ2dlZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKGhhZFByZW1vdmUpIGJvYXJkLnVuc2V0UHJlbW92ZShkYXRhKTtcbiAgICBpZiAoaGFkUHJlZHJvcCkgYm9hcmQudW5zZXRQcmVkcm9wKGRhdGEpO1xuICB9XG4gIHByb2Nlc3NEcmFnKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzRHJhZyhkYXRhKSB7XG4gIHV0aWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXIgPSBkYXRhLmRyYWdnYWJsZS5jdXJyZW50O1xuICAgIGlmIChjdXIub3JpZykge1xuICAgICAgLy8gY2FuY2VsIGFuaW1hdGlvbnMgd2hpbGUgZHJhZ2dpbmdcbiAgICAgIGlmIChkYXRhLmFuaW1hdGlvbi5jdXJyZW50LnN0YXJ0ICYmIGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuYW5pbXNbY3VyLm9yaWddKVxuICAgICAgICBkYXRhLmFuaW1hdGlvbi5jdXJyZW50ID0ge307XG4gICAgICAvLyBpZiBtb3ZpbmcgcGllY2UgaXMgZ29uZSwgY2FuY2VsXG4gICAgICBpZiAoaGFzaFBpZWNlKGRhdGEucGllY2VzW2N1ci5vcmlnXSkgIT09IGN1ci5waWVjZSkgY2FuY2VsKGRhdGEpO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICghY3VyLnN0YXJ0ZWQgJiYgdXRpbC5kaXN0YW5jZShjdXIuZXBvcywgY3VyLnJlbCkgPj0gZGF0YS5kcmFnZ2FibGUuZGlzdGFuY2UpXG4gICAgICAgICAgY3VyLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAoY3VyLnN0YXJ0ZWQpIHtcbiAgICAgICAgICBjdXIucG9zID0gW1xuICAgICAgICAgICAgY3VyLmVwb3NbMF0gLSBjdXIucmVsWzBdLFxuICAgICAgICAgICAgY3VyLmVwb3NbMV0gLSBjdXIucmVsWzFdXG4gICAgICAgICAgXTtcbiAgICAgICAgICBjdXIub3ZlciA9IGJvYXJkLmdldEtleUF0RG9tUG9zKGRhdGEsIGN1ci5lcG9zLCBjdXIuYm91bmRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBkYXRhLnJlbmRlcigpO1xuICAgIGlmIChjdXIub3JpZykgcHJvY2Vzc0RyYWcoZGF0YSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtb3ZlKGRhdGEsIGUpIHtcbiAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID4gMSkgcmV0dXJuOyAvLyBzdXBwb3J0IG9uZSBmaW5nZXIgdG91Y2ggb25seVxuICBpZiAoZGF0YS5kcmFnZ2FibGUuY3VycmVudC5vcmlnKVxuICAgIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQuZXBvcyA9IHV0aWwuZXZlbnRQb3NpdGlvbihlKTtcbn1cblxuZnVuY3Rpb24gZW5kKGRhdGEsIGUpIHtcbiAgdmFyIGN1ciA9IGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gIHZhciBvcmlnID0gY3VyID8gY3VyLm9yaWcgOiBudWxsO1xuICBpZiAoIW9yaWcpIHJldHVybjtcbiAgLy8gY29tcGFyaW5nIHdpdGggdGhlIG9yaWdpbiB0YXJnZXQgaXMgYW4gZWFzeSB3YXkgdG8gdGVzdCB0aGF0IHRoZSBlbmQgZXZlbnRcbiAgLy8gaGFzIHRoZSBzYW1lIHRvdWNoIG9yaWdpblxuICBpZiAoZS50eXBlID09PSBcInRvdWNoZW5kXCIgJiYgb3JpZ2luVGFyZ2V0ICE9PSBlLnRhcmdldCAmJiAhY3VyLm5ld1BpZWNlKSB7XG4gICAgZGF0YS5kcmFnZ2FibGUuY3VycmVudCA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuICBib2FyZC51bnNldFByZW1vdmUoZGF0YSk7XG4gIGJvYXJkLnVuc2V0UHJlZHJvcChkYXRhKTtcbiAgdmFyIGV2ZW50UG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpXG4gIHZhciBkZXN0ID0gZXZlbnRQb3MgPyBib2FyZC5nZXRLZXlBdERvbVBvcyhkYXRhLCBldmVudFBvcywgY3VyLmJvdW5kcykgOiBjdXIub3ZlcjtcbiAgaWYgKGN1ci5zdGFydGVkKSB7XG4gICAgaWYgKGN1ci5uZXdQaWVjZSkgYm9hcmQuZHJvcE5ld1BpZWNlKGRhdGEsIG9yaWcsIGRlc3QpO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKG9yaWcgIT09IGRlc3QpIGRhdGEubW92YWJsZS5kcm9wcGVkID0gW29yaWcsIGRlc3RdO1xuICAgICAgaWYgKGJvYXJkLnVzZXJNb3ZlKGRhdGEsIG9yaWcsIGRlc3QpKSBkYXRhLnN0YXRzLmRyYWdnZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBpZiAob3JpZyA9PT0gY3VyLnByZXZpb3VzbHlTZWxlY3RlZCAmJiAob3JpZyA9PT0gZGVzdCB8fCAhZGVzdCkpXG4gICAgYm9hcmQuc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIGVsc2UgaWYgKCFkYXRhLnNlbGVjdGFibGUuZW5hYmxlZCkgYm9hcmQuc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7fTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKGRhdGEpIHtcbiAgaWYgKGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQub3JpZykge1xuICAgIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7fTtcbiAgICBib2FyZC5zZWxlY3RTcXVhcmUoZGF0YSwgbnVsbCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0YXJ0OiBzdGFydCxcbiAgbW92ZTogbW92ZSxcbiAgZW5kOiBlbmQsXG4gIGNhbmNlbDogY2FuY2VsLFxuICBwcm9jZXNzRHJhZzogcHJvY2Vzc0RyYWcgLy8gbXVzdCBiZSBleHBvc2VkIGZvciBib2FyZCBlZGl0b3JzXG59O1xuIiwidmFyIGJvYXJkID0gcmVxdWlyZSgnLi9ib2FyZCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIGJydXNoZXMgPSBbJ2dyZWVuJywgJ3JlZCcsICdibHVlJywgJ3llbGxvdyddO1xuXG5mdW5jdGlvbiBoYXNoUGllY2UocGllY2UpIHtcbiAgcmV0dXJuIHBpZWNlID8gcGllY2UuY29sb3IgKyAnICcgKyBwaWVjZS5yb2xlIDogJyc7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KGRhdGEsIGUpIHtcbiAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID4gMSkgcmV0dXJuOyAvLyBzdXBwb3J0IG9uZSBmaW5nZXIgdG91Y2ggb25seVxuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGJvYXJkLmNhbmNlbE1vdmUoZGF0YSk7XG4gIHZhciBwb3NpdGlvbiA9IHV0aWwuZXZlbnRQb3NpdGlvbihlKTtcbiAgdmFyIGJvdW5kcyA9IGRhdGEuYm91bmRzKCk7XG4gIHZhciBvcmlnID0gYm9hcmQuZ2V0S2V5QXREb21Qb3MoZGF0YSwgcG9zaXRpb24sIGJvdW5kcyk7XG4gIGRhdGEuZHJhd2FibGUuY3VycmVudCA9IHtcbiAgICBvcmlnOiBvcmlnLFxuICAgIGVwb3M6IHBvc2l0aW9uLFxuICAgIGJvdW5kczogYm91bmRzLFxuICAgIGJydXNoOiBicnVzaGVzWyhlLnNoaWZ0S2V5ICYgdXRpbC5pc1JpZ2h0QnV0dG9uKGUpKSArIChlLmFsdEtleSA/IDIgOiAwKV1cbiAgfTtcbiAgcHJvY2Vzc0RyYXcoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NEcmF3KGRhdGEpIHtcbiAgdXRpbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1ciA9IGRhdGEuZHJhd2FibGUuY3VycmVudDtcbiAgICBpZiAoY3VyLm9yaWcpIHtcbiAgICAgIHZhciBkZXN0ID0gYm9hcmQuZ2V0S2V5QXREb21Qb3MoZGF0YSwgY3VyLmVwb3MsIGN1ci5ib3VuZHMpO1xuICAgICAgaWYgKGN1ci5vcmlnID09PSBkZXN0KSBjdXIuZGVzdCA9IHVuZGVmaW5lZDtcbiAgICAgIGVsc2UgY3VyLmRlc3QgPSBkZXN0O1xuICAgIH1cbiAgICBkYXRhLnJlbmRlcigpO1xuICAgIGlmIChjdXIub3JpZykgcHJvY2Vzc0RyYXcoZGF0YSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtb3ZlKGRhdGEsIGUpIHtcbiAgaWYgKGRhdGEuZHJhd2FibGUuY3VycmVudC5vcmlnKVxuICAgIGRhdGEuZHJhd2FibGUuY3VycmVudC5lcG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpO1xufVxuXG5mdW5jdGlvbiBlbmQoZGF0YSwgZSkge1xuICB2YXIgZHJhd2FibGUgPSBkYXRhLmRyYXdhYmxlO1xuICB2YXIgb3JpZyA9IGRyYXdhYmxlLmN1cnJlbnQub3JpZztcbiAgdmFyIGRlc3QgPSBkcmF3YWJsZS5jdXJyZW50LmRlc3Q7XG4gIGlmIChvcmlnICYmIGRlc3QpIGFkZExpbmUoZHJhd2FibGUsIG9yaWcsIGRlc3QpO1xuICBlbHNlIGlmIChvcmlnKSBhZGRDaXJjbGUoZHJhd2FibGUsIG9yaWcpO1xuICBkcmF3YWJsZS5jdXJyZW50ID0ge307XG4gIGRhdGEucmVuZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbChkYXRhKSB7XG4gIGlmIChkYXRhLmRyYXdhYmxlLmN1cnJlbnQub3JpZykgZGF0YS5kcmF3YWJsZS5jdXJyZW50ID0ge307XG59XG5cbmZ1bmN0aW9uIGNsZWFyKGRhdGEpIHtcbiAgaWYgKGRhdGEuZHJhd2FibGUuc2hhcGVzLmxlbmd0aCkge1xuICAgIGRhdGEuZHJhd2FibGUuc2hhcGVzID0gW107XG4gICAgZGF0YS5yZW5kZXIoKTtcbiAgICBvbkNoYW5nZShkYXRhLmRyYXdhYmxlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub3QoZikge1xuICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAhZih4KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkQ2lyY2xlKGRyYXdhYmxlLCBrZXkpIHtcbiAgdmFyIGJydXNoID0gZHJhd2FibGUuY3VycmVudC5icnVzaDtcbiAgdmFyIHNhbWVDaXJjbGUgPSBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHMub3JpZyA9PT0ga2V5ICYmICFzLmRlc3Q7XG4gIH07XG4gIHZhciBzaW1pbGFyID0gZHJhd2FibGUuc2hhcGVzLmZpbHRlcihzYW1lQ2lyY2xlKVswXTtcbiAgaWYgKHNpbWlsYXIpIGRyYXdhYmxlLnNoYXBlcyA9IGRyYXdhYmxlLnNoYXBlcy5maWx0ZXIobm90KHNhbWVDaXJjbGUpKTtcbiAgaWYgKCFzaW1pbGFyIHx8IHNpbWlsYXIuYnJ1c2ggIT09IGJydXNoKSBkcmF3YWJsZS5zaGFwZXMucHVzaCh7XG4gICAgYnJ1c2g6IGJydXNoLFxuICAgIG9yaWc6IGtleVxuICB9KTtcbiAgb25DaGFuZ2UoZHJhd2FibGUpO1xufVxuXG5mdW5jdGlvbiBhZGRMaW5lKGRyYXdhYmxlLCBvcmlnLCBkZXN0KSB7XG4gIHZhciBicnVzaCA9IGRyYXdhYmxlLmN1cnJlbnQuYnJ1c2g7XG4gIHZhciBzYW1lTGluZSA9IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy5vcmlnICYmIHMuZGVzdCAmJiAoXG4gICAgICAocy5vcmlnID09PSBvcmlnICYmIHMuZGVzdCA9PT0gZGVzdCkgfHxcbiAgICAgIChzLmRlc3QgPT09IG9yaWcgJiYgcy5vcmlnID09PSBkZXN0KVxuICAgICk7XG4gIH07XG4gIHZhciBleGlzdHMgPSBkcmF3YWJsZS5zaGFwZXMuZmlsdGVyKHNhbWVMaW5lKS5sZW5ndGggPiAwO1xuICBpZiAoZXhpc3RzKSBkcmF3YWJsZS5zaGFwZXMgPSBkcmF3YWJsZS5zaGFwZXMuZmlsdGVyKG5vdChzYW1lTGluZSkpO1xuICBlbHNlIGRyYXdhYmxlLnNoYXBlcy5wdXNoKHtcbiAgICBicnVzaDogYnJ1c2gsXG4gICAgb3JpZzogb3JpZyxcbiAgICBkZXN0OiBkZXN0XG4gIH0pO1xuICBvbkNoYW5nZShkcmF3YWJsZSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hhbmdlKGRyYXdhYmxlKSB7XG4gIGRyYXdhYmxlLm9uQ2hhbmdlKGRyYXdhYmxlLnNoYXBlcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdGFydDogc3RhcnQsXG4gIG1vdmU6IG1vdmUsXG4gIGVuZDogZW5kLFxuICBjYW5jZWw6IGNhbmNlbCxcbiAgY2xlYXI6IGNsZWFyLFxuICBwcm9jZXNzRHJhdzogcHJvY2Vzc0RyYXdcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgaW5pdGlhbCA9ICdybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SJztcblxudmFyIHJvbGVzID0ge1xuICBwOiBcInBhd25cIixcbiAgcjogXCJyb29rXCIsXG4gIG46IFwia25pZ2h0XCIsXG4gIGI6IFwiYmlzaG9wXCIsXG4gIHE6IFwicXVlZW5cIixcbiAgazogXCJraW5nXCJcbn07XG5cbnZhciBsZXR0ZXJzID0ge1xuICBwYXduOiBcInBcIixcbiAgcm9vazogXCJyXCIsXG4gIGtuaWdodDogXCJuXCIsXG4gIGJpc2hvcDogXCJiXCIsXG4gIHF1ZWVuOiBcInFcIixcbiAga2luZzogXCJrXCJcbn07XG5cbmZ1bmN0aW9uIHJlYWQoZmVuKSB7XG4gIGlmIChmZW4gPT09ICdzdGFydCcpIGZlbiA9IGluaXRpYWw7XG4gIHZhciBwaWVjZXMgPSB7fTtcbiAgZmVuLnJlcGxhY2UoLyAuKyQvLCAnJykucmVwbGFjZSgvfi9nLCAnJykuc3BsaXQoJy8nKS5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgeSkge1xuICAgIHZhciB4ID0gMDtcbiAgICByb3cuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgdmFyIG5iID0gcGFyc2VJbnQodik7XG4gICAgICBpZiAobmIpIHggKz0gbmI7XG4gICAgICBlbHNlIHtcbiAgICAgICAgeCsrO1xuICAgICAgICBwaWVjZXNbdXRpbC5wb3Mya2V5KFt4LCA4IC0geV0pXSA9IHtcbiAgICAgICAgICByb2xlOiByb2xlc1t2LnRvTG93ZXJDYXNlKCldLFxuICAgICAgICAgIGNvbG9yOiB2ID09PSB2LnRvTG93ZXJDYXNlKCkgPyAnYmxhY2snIDogJ3doaXRlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcGllY2VzO1xufVxuXG5mdW5jdGlvbiB3cml0ZShwaWVjZXMpIHtcbiAgcmV0dXJuIFs4LCA3LCA2LCA1LCA0LCAzLCAyXS5yZWR1Y2UoXG4gICAgZnVuY3Rpb24oc3RyLCBuYikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoQXJyYXkobmIgKyAxKS5qb2luKCcxJyksICdnJyksIG5iKTtcbiAgICB9LFxuICAgIHV0aWwuaW52UmFua3MubWFwKGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiB1dGlsLnJhbmtzLm1hcChmdW5jdGlvbih4KSB7XG4gICAgICAgIHZhciBwaWVjZSA9IHBpZWNlc1t1dGlsLnBvczJrZXkoW3gsIHldKV07XG4gICAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICAgIHZhciBsZXR0ZXIgPSBsZXR0ZXJzW3BpZWNlLnJvbGVdO1xuICAgICAgICAgIHJldHVybiBwaWVjZS5jb2xvciA9PT0gJ3doaXRlJyA/IGxldHRlci50b1VwcGVyQ2FzZSgpIDogbGV0dGVyO1xuICAgICAgICB9IGVsc2UgcmV0dXJuICcxJztcbiAgICAgIH0pLmpvaW4oJycpO1xuICAgIH0pLmpvaW4oJy8nKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0aWFsOiBpbml0aWFsLFxuICByZWFkOiByZWFkLFxuICB3cml0ZTogd3JpdGVcbn07XG4iLCJ2YXIgc3RhcnRBdDtcblxudmFyIHN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHN0YXJ0QXQgPSBuZXcgRGF0ZSgpO1xufTtcblxudmFyIGNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBzdGFydEF0ID0gbnVsbDtcbn07XG5cbnZhciBzdG9wID0gZnVuY3Rpb24oKSB7XG4gIGlmICghc3RhcnRBdCkgcmV0dXJuIDA7XG4gIHZhciB0aW1lID0gbmV3IERhdGUoKSAtIHN0YXJ0QXQ7XG4gIHN0YXJ0QXQgPSBudWxsO1xuICByZXR1cm4gdGltZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdGFydDogc3RhcnQsXG4gIGNhbmNlbDogY2FuY2VsLFxuICBzdG9wOiBzdG9wXG59O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgY3RybCA9IHJlcXVpcmUoJy4vY3RybCcpO1xudmFyIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcbnZhciBhcGkgPSByZXF1aXJlKCcuL2FwaScpO1xuXG4vLyBmb3IgdXNhZ2Ugb3V0c2lkZSBvZiBtaXRocmlsXG5mdW5jdGlvbiBpbml0KGVsZW1lbnQsIGNvbmZpZykge1xuXG4gIHZhciBjb250cm9sbGVyID0gbmV3IGN0cmwoY29uZmlnKTtcblxuICBtLnJlbmRlcihlbGVtZW50LCB2aWV3KGNvbnRyb2xsZXIpKTtcblxuICByZXR1cm4gYXBpKGNvbnRyb2xsZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXQ7XG5tb2R1bGUuZXhwb3J0cy5jb250cm9sbGVyID0gY3RybDtcbm1vZHVsZS5leHBvcnRzLnZpZXcgPSB2aWV3O1xubW9kdWxlLmV4cG9ydHMuZmVuID0gcmVxdWlyZSgnLi9mZW4nKTtcbm1vZHVsZS5leHBvcnRzLnV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbm1vZHVsZS5leHBvcnRzLmNvbmZpZ3VyZSA9IHJlcXVpcmUoJy4vY29uZmlndXJlJyk7XG5tb2R1bGUuZXhwb3J0cy5hbmltID0gcmVxdWlyZSgnLi9hbmltJyk7XG5tb2R1bGUuZXhwb3J0cy5ib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbm1vZHVsZS5leHBvcnRzLmRyYWcgPSByZXF1aXJlKCcuL2RyYWcnKTtcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmZ1bmN0aW9uIGRpZmYoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpO1xufVxuXG5mdW5jdGlvbiBwYXduKGNvbG9yLCB4MSwgeTEsIHgyLCB5Mikge1xuICByZXR1cm4gZGlmZih4MSwgeDIpIDwgMiAmJiAoXG4gICAgY29sb3IgPT09ICd3aGl0ZScgPyAoXG4gICAgICAvLyBhbGxvdyAyIHNxdWFyZXMgZnJvbSAxIGFuZCA4LCBmb3IgaG9yZGVcbiAgICAgIHkyID09PSB5MSArIDEgfHwgKHkxIDw9IDIgJiYgeTIgPT09ICh5MSArIDIpICYmIHgxID09PSB4MilcbiAgICApIDogKFxuICAgICAgeTIgPT09IHkxIC0gMSB8fCAoeTEgPj0gNyAmJiB5MiA9PT0gKHkxIC0gMikgJiYgeDEgPT09IHgyKVxuICAgIClcbiAgKTtcbn1cblxuZnVuY3Rpb24ga25pZ2h0KHgxLCB5MSwgeDIsIHkyKSB7XG4gIHZhciB4ZCA9IGRpZmYoeDEsIHgyKTtcbiAgdmFyIHlkID0gZGlmZih5MSwgeTIpO1xuICByZXR1cm4gKHhkID09PSAxICYmIHlkID09PSAyKSB8fCAoeGQgPT09IDIgJiYgeWQgPT09IDEpO1xufVxuXG5mdW5jdGlvbiBiaXNob3AoeDEsIHkxLCB4MiwgeTIpIHtcbiAgcmV0dXJuIGRpZmYoeDEsIHgyKSA9PT0gZGlmZih5MSwgeTIpO1xufVxuXG5mdW5jdGlvbiByb29rKHgxLCB5MSwgeDIsIHkyKSB7XG4gIHJldHVybiB4MSA9PT0geDIgfHwgeTEgPT09IHkyO1xufVxuXG5mdW5jdGlvbiBxdWVlbih4MSwgeTEsIHgyLCB5Mikge1xuICByZXR1cm4gYmlzaG9wKHgxLCB5MSwgeDIsIHkyKSB8fCByb29rKHgxLCB5MSwgeDIsIHkyKTtcbn1cblxuZnVuY3Rpb24ga2luZyhjb2xvciwgcm9va0ZpbGVzLCBjYW5DYXN0bGUsIHgxLCB5MSwgeDIsIHkyKSB7XG4gIHJldHVybiAoXG4gICAgZGlmZih4MSwgeDIpIDwgMiAmJiBkaWZmKHkxLCB5MikgPCAyXG4gICkgfHwgKFxuICAgIGNhbkNhc3RsZSAmJiB5MSA9PT0geTIgJiYgeTEgPT09IChjb2xvciA9PT0gJ3doaXRlJyA/IDEgOiA4KSAmJiAoXG4gICAgICAoeDEgPT09IDUgJiYgKHgyID09PSAzIHx8IHgyID09PSA3KSkgfHwgdXRpbC5jb250YWluc1gocm9va0ZpbGVzLCB4MilcbiAgICApXG4gICk7XG59XG5cbmZ1bmN0aW9uIHJvb2tGaWxlc09mKHBpZWNlcywgY29sb3IpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHBpZWNlcykuZmlsdGVyKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBwaWVjZSA9IHBpZWNlc1trZXldO1xuICAgIHJldHVybiBwaWVjZSAmJiBwaWVjZS5jb2xvciA9PT0gY29sb3IgJiYgcGllY2Uucm9sZSA9PT0gJ3Jvb2snO1xuICB9KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHV0aWwua2V5MnBvcyhrZXkpWzBdO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZShwaWVjZXMsIGtleSwgY2FuQ2FzdGxlKSB7XG4gIHZhciBwaWVjZSA9IHBpZWNlc1trZXldO1xuICB2YXIgcG9zID0gdXRpbC5rZXkycG9zKGtleSk7XG4gIHZhciBtb2JpbGl0eTtcbiAgc3dpdGNoIChwaWVjZS5yb2xlKSB7XG4gICAgY2FzZSAncGF3bic6XG4gICAgICBtb2JpbGl0eSA9IHBhd24uYmluZChudWxsLCBwaWVjZS5jb2xvcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdrbmlnaHQnOlxuICAgICAgbW9iaWxpdHkgPSBrbmlnaHQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiaXNob3AnOlxuICAgICAgbW9iaWxpdHkgPSBiaXNob3A7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyb29rJzpcbiAgICAgIG1vYmlsaXR5ID0gcm9vaztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3F1ZWVuJzpcbiAgICAgIG1vYmlsaXR5ID0gcXVlZW47XG4gICAgICBicmVhaztcbiAgICBjYXNlICdraW5nJzpcbiAgICAgIG1vYmlsaXR5ID0ga2luZy5iaW5kKG51bGwsIHBpZWNlLmNvbG9yLCByb29rRmlsZXNPZihwaWVjZXMsIHBpZWNlLmNvbG9yKSwgY2FuQ2FzdGxlKTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB1dGlsLmFsbFBvcy5maWx0ZXIoZnVuY3Rpb24ocG9zMikge1xuICAgIHJldHVybiAocG9zWzBdICE9PSBwb3MyWzBdIHx8IHBvc1sxXSAhPT0gcG9zMlsxXSkgJiYgbW9iaWxpdHkocG9zWzBdLCBwb3NbMV0sIHBvczJbMF0sIHBvczJbMV0pO1xuICB9KS5tYXAodXRpbC5wb3Mya2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIga2V5MnBvcyA9IHJlcXVpcmUoJy4vdXRpbCcpLmtleTJwb3M7XG52YXIgaXNUcmlkZW50ID0gcmVxdWlyZSgnLi91dGlsJykuaXNUcmlkZW50O1xuXG5mdW5jdGlvbiBjaXJjbGVXaWR0aChjdXJyZW50LCBib3VuZHMpIHtcbiAgcmV0dXJuIChjdXJyZW50ID8gMyA6IDQpIC8gNTEyICogYm91bmRzLndpZHRoO1xufVxuXG5mdW5jdGlvbiBsaW5lV2lkdGgoYnJ1c2gsIGN1cnJlbnQsIGJvdW5kcykge1xuICByZXR1cm4gKGJydXNoLmxpbmVXaWR0aCB8fCAxMCkgKiAoY3VycmVudCA/IDAuODUgOiAxKSAvIDUxMiAqIGJvdW5kcy53aWR0aDtcbn1cblxuZnVuY3Rpb24gb3BhY2l0eShicnVzaCwgY3VycmVudCkge1xuICByZXR1cm4gKGJydXNoLm9wYWNpdHkgfHwgMSkgKiAoY3VycmVudCA/IDAuOSA6IDEpO1xufVxuXG5mdW5jdGlvbiBhcnJvd01hcmdpbihjdXJyZW50LCBib3VuZHMpIHtcbiAgcmV0dXJuIGlzVHJpZGVudCgpID8gMCA6ICgoY3VycmVudCA/IDEwIDogMjApIC8gNTEyICogYm91bmRzLndpZHRoKTtcbn1cblxuZnVuY3Rpb24gcG9zMnB4KHBvcywgYm91bmRzKSB7XG4gIHZhciBzcXVhcmVTaXplID0gYm91bmRzLndpZHRoIC8gODtcbiAgcmV0dXJuIFsocG9zWzBdIC0gMC41KSAqIHNxdWFyZVNpemUsICg4LjUgLSBwb3NbMV0pICogc3F1YXJlU2l6ZV07XG59XG5cbmZ1bmN0aW9uIGNpcmNsZShicnVzaCwgcG9zLCBjdXJyZW50LCBib3VuZHMpIHtcbiAgdmFyIG8gPSBwb3MycHgocG9zLCBib3VuZHMpO1xuICB2YXIgd2lkdGggPSBjaXJjbGVXaWR0aChjdXJyZW50LCBib3VuZHMpO1xuICB2YXIgcmFkaXVzID0gYm91bmRzLndpZHRoIC8gMTY7XG4gIHJldHVybiB7XG4gICAgdGFnOiAnY2lyY2xlJyxcbiAgICBhdHRyczoge1xuICAgICAga2V5OiBjdXJyZW50ID8gJ2N1cnJlbnQnIDogcG9zICsgYnJ1c2gua2V5LFxuICAgICAgc3Ryb2tlOiBicnVzaC5jb2xvcixcbiAgICAgICdzdHJva2Utd2lkdGgnOiB3aWR0aCxcbiAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHkoYnJ1c2gsIGN1cnJlbnQpLFxuICAgICAgY3g6IG9bMF0sXG4gICAgICBjeTogb1sxXSxcbiAgICAgIHI6IHJhZGl1cyAtIHdpZHRoIC8gMlxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYXJyb3coYnJ1c2gsIG9yaWcsIGRlc3QsIGN1cnJlbnQsIGJvdW5kcykge1xuICB2YXIgbSA9IGFycm93TWFyZ2luKGN1cnJlbnQsIGJvdW5kcyk7XG4gIHZhciBhID0gcG9zMnB4KG9yaWcsIGJvdW5kcyk7XG4gIHZhciBiID0gcG9zMnB4KGRlc3QsIGJvdW5kcyk7XG4gIHZhciBkeCA9IGJbMF0gLSBhWzBdLFxuICAgIGR5ID0gYlsxXSAtIGFbMV0sXG4gICAgYW5nbGUgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gIHZhciB4byA9IE1hdGguY29zKGFuZ2xlKSAqIG0sXG4gICAgeW8gPSBNYXRoLnNpbihhbmdsZSkgKiBtO1xuICByZXR1cm4ge1xuICAgIHRhZzogJ2xpbmUnLFxuICAgIGF0dHJzOiB7XG4gICAgICBrZXk6IGN1cnJlbnQgPyAnY3VycmVudCcgOiBvcmlnICsgZGVzdCArIGJydXNoLmtleSxcbiAgICAgIHN0cm9rZTogYnJ1c2guY29sb3IsXG4gICAgICAnc3Ryb2tlLXdpZHRoJzogbGluZVdpZHRoKGJydXNoLCBjdXJyZW50LCBib3VuZHMpLFxuICAgICAgJ3N0cm9rZS1saW5lY2FwJzogJ3JvdW5kJyxcbiAgICAgICdtYXJrZXItZW5kJzogaXNUcmlkZW50KCkgPyBudWxsIDogJ3VybCgjYXJyb3doZWFkLScgKyBicnVzaC5rZXkgKyAnKScsXG4gICAgICBvcGFjaXR5OiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSxcbiAgICAgIHgxOiBhWzBdLFxuICAgICAgeTE6IGFbMV0sXG4gICAgICB4MjogYlswXSAtIHhvLFxuICAgICAgeTI6IGJbMV0gLSB5b1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gcGllY2UoY2ZnLCBwb3MsIHBpZWNlLCBib3VuZHMpIHtcbiAgdmFyIG8gPSBwb3MycHgocG9zLCBib3VuZHMpO1xuICB2YXIgc2l6ZSA9IGJvdW5kcy53aWR0aCAvIDggKiAocGllY2Uuc2NhbGUgfHwgMSk7XG4gIHZhciBuYW1lID0gcGllY2UuY29sb3IgPT09ICd3aGl0ZScgPyAndycgOiAnYic7XG4gIG5hbWUgKz0gKHBpZWNlLnJvbGUgPT09ICdrbmlnaHQnID8gJ24nIDogcGllY2Uucm9sZVswXSkudG9VcHBlckNhc2UoKTtcbiAgdmFyIGhyZWYgPSBjZmcuYmFzZVVybCArIG5hbWUgKyAnLnN2Zyc7XG4gIHJldHVybiB7XG4gICAgdGFnOiAnaW1hZ2UnLFxuICAgIGF0dHJzOiB7XG4gICAgICBjbGFzczogcGllY2UuY29sb3IgKyAnICcgKyBwaWVjZS5yb2xlLFxuICAgICAgeDogb1swXSAtIHNpemUgLyAyLFxuICAgICAgeTogb1sxXSAtIHNpemUgLyAyLFxuICAgICAgd2lkdGg6IHNpemUsXG4gICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICBocmVmOiBocmVmXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkZWZzKGJydXNoZXMpIHtcbiAgcmV0dXJuIHtcbiAgICB0YWc6ICdkZWZzJyxcbiAgICBjaGlsZHJlbjogW1xuICAgICAgYnJ1c2hlcy5tYXAoZnVuY3Rpb24oYnJ1c2gpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IGJydXNoLmtleSxcbiAgICAgICAgICB0YWc6ICdtYXJrZXInLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICBpZDogJ2Fycm93aGVhZC0nICsgYnJ1c2gua2V5LFxuICAgICAgICAgICAgb3JpZW50OiAnYXV0bycsXG4gICAgICAgICAgICBtYXJrZXJXaWR0aDogNCxcbiAgICAgICAgICAgIG1hcmtlckhlaWdodDogOCxcbiAgICAgICAgICAgIHJlZlg6IDIuMDUsXG4gICAgICAgICAgICByZWZZOiAyLjAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGlsZHJlbjogW3tcbiAgICAgICAgICAgIHRhZzogJ3BhdGgnLFxuICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgZDogJ00wLDAgVjQgTDMsMiBaJyxcbiAgICAgICAgICAgICAgZmlsbDogYnJ1c2guY29sb3JcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIF1cbiAgfTtcbn1cblxuZnVuY3Rpb24gb3JpZW50KHBvcywgY29sb3IpIHtcbiAgcmV0dXJuIGNvbG9yID09PSAnd2hpdGUnID8gcG9zIDogWzkgLSBwb3NbMF0sIDkgLSBwb3NbMV1dO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTaGFwZShkYXRhLCBjdXJyZW50LCBib3VuZHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNoYXBlLCBpKSB7XG4gICAgaWYgKHNoYXBlLnBpZWNlKSByZXR1cm4gcGllY2UoXG4gICAgICBkYXRhLmRyYXdhYmxlLnBpZWNlcyxcbiAgICAgIG9yaWVudChrZXkycG9zKHNoYXBlLm9yaWcpLCBkYXRhLm9yaWVudGF0aW9uKSxcbiAgICAgIHNoYXBlLnBpZWNlLFxuICAgICAgYm91bmRzKTtcbiAgICBlbHNlIGlmIChzaGFwZS5icnVzaCkge1xuICAgICAgdmFyIGJydXNoID0gc2hhcGUuYnJ1c2hNb2RpZmllcnMgP1xuICAgICAgICBtYWtlQ3VzdG9tQnJ1c2goZGF0YS5kcmF3YWJsZS5icnVzaGVzW3NoYXBlLmJydXNoXSwgc2hhcGUuYnJ1c2hNb2RpZmllcnMsIGkpIDpcbiAgICAgICAgZGF0YS5kcmF3YWJsZS5icnVzaGVzW3NoYXBlLmJydXNoXTtcbiAgICAgIHZhciBvcmlnID0gb3JpZW50KGtleTJwb3Moc2hhcGUub3JpZyksIGRhdGEub3JpZW50YXRpb24pO1xuICAgICAgaWYgKHNoYXBlLm9yaWcgJiYgc2hhcGUuZGVzdCkgcmV0dXJuIGFycm93KFxuICAgICAgICBicnVzaCxcbiAgICAgICAgb3JpZyxcbiAgICAgICAgb3JpZW50KGtleTJwb3Moc2hhcGUuZGVzdCksIGRhdGEub3JpZW50YXRpb24pLFxuICAgICAgICBjdXJyZW50LCBib3VuZHMpO1xuICAgICAgZWxzZSBpZiAoc2hhcGUub3JpZykgcmV0dXJuIGNpcmNsZShcbiAgICAgICAgYnJ1c2gsXG4gICAgICAgIG9yaWcsXG4gICAgICAgIGN1cnJlbnQsIGJvdW5kcyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYWtlQ3VzdG9tQnJ1c2goYmFzZSwgbW9kaWZpZXJzLCBpKSB7XG4gIHJldHVybiB7XG4gICAga2V5OiAnYm0nICsgaSxcbiAgICBjb2xvcjogbW9kaWZpZXJzLmNvbG9yIHx8IGJhc2UuY29sb3IsXG4gICAgb3BhY2l0eTogbW9kaWZpZXJzLm9wYWNpdHkgfHwgYmFzZS5vcGFjaXR5LFxuICAgIGxpbmVXaWR0aDogbW9kaWZpZXJzLmxpbmVXaWR0aCB8fCBiYXNlLmxpbmVXaWR0aFxuICB9O1xufVxuXG5mdW5jdGlvbiBjb21wdXRlVXNlZEJydXNoZXMoZCwgZHJhd24sIGN1cnJlbnQpIHtcbiAgdmFyIGJydXNoZXMgPSBbXTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNoYXBlcyA9IChjdXJyZW50ICYmIGN1cnJlbnQuZGVzdCkgPyBkcmF3bi5jb25jYXQoY3VycmVudCkgOiBkcmF3bjtcbiAgZm9yICh2YXIgaSBpbiBzaGFwZXMpIHtcbiAgICB2YXIgc2hhcGUgPSBzaGFwZXNbaV07XG4gICAgaWYgKCFzaGFwZS5kZXN0KSBjb250aW51ZTtcbiAgICB2YXIgYnJ1c2hLZXkgPSBzaGFwZS5icnVzaDtcbiAgICBpZiAoc2hhcGUuYnJ1c2hNb2RpZmllcnMpXG4gICAgICBicnVzaGVzLnB1c2gobWFrZUN1c3RvbUJydXNoKGQuYnJ1c2hlc1ticnVzaEtleV0sIHNoYXBlLmJydXNoTW9kaWZpZXJzLCBpKSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAoa2V5cy5pbmRleE9mKGJydXNoS2V5KSA9PT0gLTEpIHtcbiAgICAgICAgYnJ1c2hlcy5wdXNoKGQuYnJ1c2hlc1ticnVzaEtleV0pO1xuICAgICAgICBrZXlzLnB1c2goYnJ1c2hLZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnJ1c2hlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHJsKSB7XG4gIGlmICghY3RybC5kYXRhLmJvdW5kcykgcmV0dXJuO1xuICB2YXIgZCA9IGN0cmwuZGF0YS5kcmF3YWJsZTtcbiAgdmFyIGFsbFNoYXBlcyA9IGQuc2hhcGVzLmNvbmNhdChkLmF1dG9TaGFwZXMpO1xuICBpZiAoIWFsbFNoYXBlcy5sZW5ndGggJiYgIWQuY3VycmVudC5vcmlnKSByZXR1cm47XG4gIHZhciBib3VuZHMgPSBjdHJsLmRhdGEuYm91bmRzKCk7XG4gIGlmIChib3VuZHMud2lkdGggIT09IGJvdW5kcy5oZWlnaHQpIHJldHVybjtcbiAgdmFyIHVzZWRCcnVzaGVzID0gY29tcHV0ZVVzZWRCcnVzaGVzKGQsIGFsbFNoYXBlcywgZC5jdXJyZW50KTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6ICdzdmcnLFxuICAgIGF0dHJzOiB7XG4gICAgICBrZXk6ICdzdmcnXG4gICAgfSxcbiAgICBjaGlsZHJlbjogW1xuICAgICAgZGVmcyh1c2VkQnJ1c2hlcyksXG4gICAgICBhbGxTaGFwZXMubWFwKHJlbmRlclNoYXBlKGN0cmwuZGF0YSwgZmFsc2UsIGJvdW5kcykpLFxuICAgICAgcmVuZGVyU2hhcGUoY3RybC5kYXRhLCB0cnVlLCBib3VuZHMpKGQuY3VycmVudCwgOTk5OSlcbiAgICBdXG4gIH07XG59XG4iLCJ2YXIgZmlsZXMgPSBcImFiY2RlZmdoXCIuc3BsaXQoJycpO1xudmFyIHJhbmtzID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdO1xudmFyIGludlJhbmtzID0gWzgsIDcsIDYsIDUsIDQsIDMsIDIsIDFdO1xudmFyIGZpbGVOdW1iZXJzID0ge1xuICBhOiAxLFxuICBiOiAyLFxuICBjOiAzLFxuICBkOiA0LFxuICBlOiA1LFxuICBmOiA2LFxuICBnOiA3LFxuICBoOiA4XG59O1xuXG5mdW5jdGlvbiBwb3Mya2V5KHBvcykge1xuICByZXR1cm4gZmlsZXNbcG9zWzBdIC0gMV0gKyBwb3NbMV07XG59XG5cbmZ1bmN0aW9uIGtleTJwb3MocG9zKSB7XG4gIHJldHVybiBbZmlsZU51bWJlcnNbcG9zWzBdXSwgcGFyc2VJbnQocG9zWzFdKV07XG59XG5cbmZ1bmN0aW9uIGludmVydEtleShrZXkpIHtcbiAgcmV0dXJuIGZpbGVzWzggLSBmaWxlTnVtYmVyc1trZXlbMF1dXSArICg5IC0gcGFyc2VJbnQoa2V5WzFdKSk7XG59XG5cbnZhciBhbGxQb3MgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcyA9IFtdO1xuICBpbnZSYW5rcy5mb3JFYWNoKGZ1bmN0aW9uKHkpIHtcbiAgICByYW5rcy5mb3JFYWNoKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHBzLnB1c2goW3gsIHldKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBwcztcbn0pKCk7XG52YXIgYWxsS2V5cyA9IGFsbFBvcy5tYXAocG9zMmtleSk7XG52YXIgaW52S2V5cyA9IGFsbEtleXMuc2xpY2UoMCkucmV2ZXJzZSgpO1xuXG5mdW5jdGlvbiBjbGFzc1NldChjbGFzc2VzKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSBpbiBjbGFzc2VzKSB7XG4gICAgaWYgKGNsYXNzZXNbaV0pIGFyci5wdXNoKGkpO1xuICB9XG4gIHJldHVybiBhcnIuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBvcHBvc2l0ZShjb2xvcikge1xuICByZXR1cm4gY29sb3IgPT09ICd3aGl0ZScgPyAnYmxhY2snIDogJ3doaXRlJztcbn1cblxuZnVuY3Rpb24gY29udGFpbnNYKHhzLCB4KSB7XG4gIHJldHVybiB4cyAmJiB4cy5pbmRleE9mKHgpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gZGlzdGFuY2UocG9zMSwgcG9zMikge1xuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHBvczFbMF0gLSBwb3MyWzBdLCAyKSArIE1hdGgucG93KHBvczFbMV0gLSBwb3MyWzFdLCAyKSk7XG59XG5cbi8vIHRoaXMgbXVzdCBiZSBjYWNoZWQgYmVjYXVzZSBvZiB0aGUgYWNjZXNzIHRvIGRvY3VtZW50LmJvZHkuc3R5bGVcbnZhciBjYWNoZWRUcmFuc2Zvcm1Qcm9wO1xuXG5mdW5jdGlvbiBjb21wdXRlVHJhbnNmb3JtUHJvcCgpIHtcbiAgcmV0dXJuICd0cmFuc2Zvcm0nIGluIGRvY3VtZW50LmJvZHkuc3R5bGUgP1xuICAgICd0cmFuc2Zvcm0nIDogJ3dlYmtpdFRyYW5zZm9ybScgaW4gZG9jdW1lbnQuYm9keS5zdHlsZSA/XG4gICAgJ3dlYmtpdFRyYW5zZm9ybScgOiAnbW96VHJhbnNmb3JtJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlID9cbiAgICAnbW96VHJhbnNmb3JtJyA6ICdvVHJhbnNmb3JtJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlID9cbiAgICAnb1RyYW5zZm9ybScgOiAnbXNUcmFuc2Zvcm0nO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wKCkge1xuICBpZiAoIWNhY2hlZFRyYW5zZm9ybVByb3ApIGNhY2hlZFRyYW5zZm9ybVByb3AgPSBjb21wdXRlVHJhbnNmb3JtUHJvcCgpO1xuICByZXR1cm4gY2FjaGVkVHJhbnNmb3JtUHJvcDtcbn1cblxudmFyIGNhY2hlZElzVHJpZGVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIGlzVHJpZGVudCgpIHtcbiAgaWYgKGNhY2hlZElzVHJpZGVudCA9PT0gbnVsbClcbiAgICBjYWNoZWRJc1RyaWRlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdUcmlkZW50LycpID4gLTE7XG4gIHJldHVybiBjYWNoZWRJc1RyaWRlbnQ7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZShwb3MpIHtcbiAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHBvc1swXSArICdweCwnICsgcG9zWzFdICsgJ3B4KSc7XG59XG5cbmZ1bmN0aW9uIGV2ZW50UG9zaXRpb24oZSkge1xuICBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WCA9PT0gMCkgcmV0dXJuIFtlLmNsaWVudFgsIGUuY2xpZW50WV07XG4gIGlmIChlLnRvdWNoZXMgJiYgZS50YXJnZXRUb3VjaGVzWzBdKSByZXR1cm4gW2UudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBlLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WV07XG59XG5cbmZ1bmN0aW9uIHBhcnRpYWxBcHBseShmbiwgYXJncykge1xuICByZXR1cm4gZm4uYmluZC5hcHBseShmbiwgW251bGxdLmNvbmNhdChhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHBhcnRpYWwoKSB7XG4gIHJldHVybiBwYXJ0aWFsQXBwbHkoYXJndW1lbnRzWzBdLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbn1cblxuZnVuY3Rpb24gaXNSaWdodEJ1dHRvbihlKSB7XG4gIHJldHVybiBlLmJ1dHRvbnMgPT09IDIgfHwgZS5idXR0b24gPT09IDI7XG59XG5cbmZ1bmN0aW9uIG1lbW8oZikge1xuICB2YXIgdiwgcmV0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkgdiA9IGYoKTtcbiAgICByZXR1cm4gdjtcbiAgfTtcbiAgcmV0LmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdiA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZmlsZXM6IGZpbGVzLFxuICByYW5rczogcmFua3MsXG4gIGludlJhbmtzOiBpbnZSYW5rcyxcbiAgYWxsUG9zOiBhbGxQb3MsXG4gIGFsbEtleXM6IGFsbEtleXMsXG4gIGludktleXM6IGludktleXMsXG4gIHBvczJrZXk6IHBvczJrZXksXG4gIGtleTJwb3M6IGtleTJwb3MsXG4gIGludmVydEtleTogaW52ZXJ0S2V5LFxuICBjbGFzc1NldDogY2xhc3NTZXQsXG4gIG9wcG9zaXRlOiBvcHBvc2l0ZSxcbiAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gIGNvbnRhaW5zWDogY29udGFpbnNYLFxuICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gIGV2ZW50UG9zaXRpb246IGV2ZW50UG9zaXRpb24sXG4gIHBhcnRpYWxBcHBseTogcGFydGlhbEFwcGx5LFxuICBwYXJ0aWFsOiBwYXJ0aWFsLFxuICB0cmFuc2Zvcm1Qcm9wOiB0cmFuc2Zvcm1Qcm9wLFxuICBpc1RyaWRlbnQ6IGlzVHJpZGVudCxcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dCkuYmluZCh3aW5kb3cpLFxuICBpc1JpZ2h0QnV0dG9uOiBpc1JpZ2h0QnV0dG9uLFxuICBtZW1vOiBtZW1vXG59O1xuIiwidmFyIGRyYWcgPSByZXF1aXJlKCcuL2RyYWcnKTtcbnZhciBkcmF3ID0gcmVxdWlyZSgnLi9kcmF3Jyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHN2ZyA9IHJlcXVpcmUoJy4vc3ZnJyk7XG52YXIgbWFrZUNvb3JkcyA9IHJlcXVpcmUoJy4vY29vcmRzJyk7XG52YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIHBpZWNlVGFnID0gJ3BpZWNlJztcbnZhciBzcXVhcmVUYWcgPSAnc3F1YXJlJztcblxuZnVuY3Rpb24gcGllY2VDbGFzcyhwKSB7XG4gIHJldHVybiBwLnJvbGUgKyAnICcgKyBwLmNvbG9yO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQaWVjZShkLCBrZXksIGN0eCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAga2V5OiAncCcgKyBrZXksXG4gICAgc3R5bGU6IHt9LFxuICAgIGNsYXNzOiBwaWVjZUNsYXNzKGQucGllY2VzW2tleV0pXG4gIH07XG4gIHZhciB0cmFuc2xhdGUgPSBwb3NUb1RyYW5zbGF0ZSh1dGlsLmtleTJwb3Moa2V5KSwgY3R4KTtcbiAgdmFyIGRyYWdnYWJsZSA9IGQuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gIGlmIChkcmFnZ2FibGUub3JpZyA9PT0ga2V5ICYmIGRyYWdnYWJsZS5zdGFydGVkKSB7XG4gICAgdHJhbnNsYXRlWzBdICs9IGRyYWdnYWJsZS5wb3NbMF0gKyBkcmFnZ2FibGUuZGVjWzBdO1xuICAgIHRyYW5zbGF0ZVsxXSArPSBkcmFnZ2FibGUucG9zWzFdICsgZHJhZ2dhYmxlLmRlY1sxXTtcbiAgICBhdHRycy5jbGFzcyArPSAnIGRyYWdnaW5nJztcbiAgfSBlbHNlIGlmIChkLmFuaW1hdGlvbi5jdXJyZW50LmFuaW1zKSB7XG4gICAgdmFyIGFuaW1hdGlvbiA9IGQuYW5pbWF0aW9uLmN1cnJlbnQuYW5pbXNba2V5XTtcbiAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICB0cmFuc2xhdGVbMF0gKz0gYW5pbWF0aW9uWzFdWzBdO1xuICAgICAgdHJhbnNsYXRlWzFdICs9IGFuaW1hdGlvblsxXVsxXTtcbiAgICB9XG4gIH1cbiAgYXR0cnMuc3R5bGVbY3R4LnRyYW5zZm9ybVByb3BdID0gdXRpbC50cmFuc2xhdGUodHJhbnNsYXRlKTtcbiAgaWYgKGQucGllY2VLZXkpIGF0dHJzWydkYXRhLWtleSddID0ga2V5O1xuICByZXR1cm4ge1xuICAgIHRhZzogcGllY2VUYWcsXG4gICAgYXR0cnM6IGF0dHJzXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNxdWFyZShrZXksIGNsYXNzZXMsIGN0eCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAga2V5OiAncycgKyBrZXksXG4gICAgY2xhc3M6IGNsYXNzZXMsXG4gICAgc3R5bGU6IHt9XG4gIH07XG4gIGF0dHJzLnN0eWxlW2N0eC50cmFuc2Zvcm1Qcm9wXSA9IHV0aWwudHJhbnNsYXRlKHBvc1RvVHJhbnNsYXRlKHV0aWwua2V5MnBvcyhrZXkpLCBjdHgpKTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6IHNxdWFyZVRhZyxcbiAgICBhdHRyczogYXR0cnNcbiAgfTtcbn1cblxuZnVuY3Rpb24gcG9zVG9UcmFuc2xhdGUocG9zLCBjdHgpIHtcbiAgcmV0dXJuIFtcbiAgICAoY3R4LmFzV2hpdGUgPyBwb3NbMF0gLSAxIDogOCAtIHBvc1swXSkgKiBjdHguYm91bmRzLndpZHRoIC8gOCwgKGN0eC5hc1doaXRlID8gOCAtIHBvc1sxXSA6IHBvc1sxXSAtIDEpICogY3R4LmJvdW5kcy5oZWlnaHQgLyA4XG4gIF07XG59XG5cbmZ1bmN0aW9uIHJlbmRlckdob3N0KGtleSwgcGllY2UsIGN0eCkge1xuICBpZiAoIXBpZWNlKSByZXR1cm47XG4gIHZhciBhdHRycyA9IHtcbiAgICBrZXk6ICdnJyArIGtleSxcbiAgICBzdHlsZToge30sXG4gICAgY2xhc3M6IHBpZWNlQ2xhc3MocGllY2UpICsgJyBnaG9zdCdcbiAgfTtcbiAgYXR0cnMuc3R5bGVbY3R4LnRyYW5zZm9ybVByb3BdID0gdXRpbC50cmFuc2xhdGUocG9zVG9UcmFuc2xhdGUodXRpbC5rZXkycG9zKGtleSksIGN0eCkpO1xuICByZXR1cm4ge1xuICAgIHRhZzogcGllY2VUYWcsXG4gICAgYXR0cnM6IGF0dHJzXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlckZhZGluZyhjZmcsIGN0eCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAga2V5OiAnZicgKyBjZmcucGllY2Uua2V5LFxuICAgIGNsYXNzOiAnZmFkaW5nICcgKyBwaWVjZUNsYXNzKGNmZy5waWVjZSksXG4gICAgc3R5bGU6IHtcbiAgICAgIG9wYWNpdHk6IGNmZy5vcGFjaXR5XG4gICAgfVxuICB9O1xuICBhdHRycy5zdHlsZVtjdHgudHJhbnNmb3JtUHJvcF0gPSB1dGlsLnRyYW5zbGF0ZShwb3NUb1RyYW5zbGF0ZShjZmcucGllY2UucG9zLCBjdHgpKTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6IHBpZWNlVGFnLFxuICAgIGF0dHJzOiBhdHRyc1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRTcXVhcmUoc3F1YXJlcywga2V5LCBrbGFzcykge1xuICBpZiAoc3F1YXJlc1trZXldKSBzcXVhcmVzW2tleV0ucHVzaChrbGFzcyk7XG4gIGVsc2Ugc3F1YXJlc1trZXldID0gW2tsYXNzXTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU3F1YXJlcyhjdHJsLCBjdHgpIHtcbiAgdmFyIGQgPSBjdHJsLmRhdGE7XG4gIHZhciBzcXVhcmVzID0ge307XG4gIGlmIChkLmxhc3RNb3ZlICYmIGQuaGlnaGxpZ2h0Lmxhc3RNb3ZlKSBkLmxhc3RNb3ZlLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnbGFzdC1tb3ZlJyk7XG4gIH0pO1xuICBpZiAoZC5jaGVjayAmJiBkLmhpZ2hsaWdodC5jaGVjaykgYWRkU3F1YXJlKHNxdWFyZXMsIGQuY2hlY2ssICdjaGVjaycpO1xuICBpZiAoZC5zZWxlY3RlZCkge1xuICAgIGFkZFNxdWFyZShzcXVhcmVzLCBkLnNlbGVjdGVkLCAnc2VsZWN0ZWQnKTtcbiAgICB2YXIgb3ZlciA9IGQuZHJhZ2dhYmxlLmN1cnJlbnQub3ZlcjtcbiAgICB2YXIgZGVzdHMgPSBkLm1vdmFibGUuZGVzdHNbZC5zZWxlY3RlZF07XG4gICAgaWYgKGRlc3RzKSBkZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmIChrID09PSBvdmVyKSBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ21vdmUtZGVzdCBkcmFnLW92ZXInKTtcbiAgICAgIGVsc2UgaWYgKGQubW92YWJsZS5zaG93RGVzdHMpIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnbW92ZS1kZXN0JyArIChkLnBpZWNlc1trXSA/ICcgb2MnIDogJycpKTtcbiAgICB9KTtcbiAgICB2YXIgcERlc3RzID0gZC5wcmVtb3ZhYmxlLmRlc3RzO1xuICAgIGlmIChwRGVzdHMpIHBEZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmIChrID09PSBvdmVyKSBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ3ByZW1vdmUtZGVzdCBkcmFnLW92ZXInKTtcbiAgICAgIGVsc2UgaWYgKGQubW92YWJsZS5zaG93RGVzdHMpIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAncHJlbW92ZS1kZXN0JyArIChkLnBpZWNlc1trXSA/ICcgb2MnIDogJycpKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgcHJlbW92ZSA9IGQucHJlbW92YWJsZS5jdXJyZW50O1xuICBpZiAocHJlbW92ZSkgcHJlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ2N1cnJlbnQtcHJlbW92ZScpO1xuICB9KTtcbiAgZWxzZSBpZiAoZC5wcmVkcm9wcGFibGUuY3VycmVudC5rZXkpXG4gICAgYWRkU3F1YXJlKHNxdWFyZXMsIGQucHJlZHJvcHBhYmxlLmN1cnJlbnQua2V5LCAnY3VycmVudC1wcmVtb3ZlJyk7XG5cbiAgaWYgKGN0cmwudm0uZXhwbG9kaW5nKSBjdHJsLnZtLmV4cGxvZGluZy5rZXlzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnZXhwbG9kaW5nJyArIGN0cmwudm0uZXhwbG9kaW5nLnN0YWdlKTtcbiAgfSk7XG5cbiAgdmFyIGRvbSA9IFtdO1xuICBpZiAoZC5pdGVtcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgdmFyIGtleSA9IHV0aWwuYWxsS2V5c1tpXTtcbiAgICAgIHZhciBzcXVhcmUgPSBzcXVhcmVzW2tleV07XG4gICAgICB2YXIgaXRlbSA9IGQuaXRlbXMucmVuZGVyKHV0aWwua2V5MnBvcyhrZXkpLCBrZXkpO1xuICAgICAgaWYgKHNxdWFyZSB8fCBpdGVtKSB7XG4gICAgICAgIHZhciBzcSA9IHJlbmRlclNxdWFyZShrZXksIHNxdWFyZSA/IHNxdWFyZS5qb2luKCcgJykgKyAoaXRlbSA/ICcgaGFzLWl0ZW0nIDogJycpIDogJ2hhcy1pdGVtJywgY3R4KTtcbiAgICAgICAgaWYgKGl0ZW0pIHNxLmNoaWxkcmVuID0gW2l0ZW1dO1xuICAgICAgICBkb20ucHVzaChzcSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGtleSBpbiBzcXVhcmVzKVxuICAgICAgZG9tLnB1c2gocmVuZGVyU3F1YXJlKGtleSwgc3F1YXJlc1trZXldLmpvaW4oJyAnKSwgY3R4KSk7XG4gIH1cbiAgcmV0dXJuIGRvbTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29udGVudChjdHJsKSB7XG4gIHZhciBkID0gY3RybC5kYXRhO1xuICBpZiAoIWQuYm91bmRzKSByZXR1cm47XG4gIHZhciBjdHggPSB7XG4gICAgYXNXaGl0ZTogZC5vcmllbnRhdGlvbiA9PT0gJ3doaXRlJyxcbiAgICBib3VuZHM6IGQuYm91bmRzKCksXG4gICAgdHJhbnNmb3JtUHJvcDogdXRpbC50cmFuc2Zvcm1Qcm9wKClcbiAgfTtcbiAgdmFyIGNoaWxkcmVuID0gcmVuZGVyU3F1YXJlcyhjdHJsLCBjdHgpO1xuICBpZiAoZC5hbmltYXRpb24uY3VycmVudC5mYWRpbmdzKVxuICAgIGQuYW5pbWF0aW9uLmN1cnJlbnQuZmFkaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICAgIGNoaWxkcmVuLnB1c2gocmVuZGVyRmFkaW5nKHAsIGN0eCkpO1xuICAgIH0pO1xuXG4gIC8vIG11c3QgaW5zZXJ0IHBpZWNlcyBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgLy8gZm9yIDNEIHRvIGRpc3BsYXkgY29ycmVjdGx5XG4gIHZhciBrZXlzID0gY3R4LmFzV2hpdGUgPyB1dGlsLmFsbEtleXMgOiB1dGlsLmludktleXM7XG4gIGlmIChkLml0ZW1zKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgaWYgKGQucGllY2VzW2tleXNbaV1dICYmICFkLml0ZW1zLnJlbmRlcih1dGlsLmtleTJwb3Moa2V5c1tpXSksIGtleXNbaV0pKVxuICAgICAgICBjaGlsZHJlbi5wdXNoKHJlbmRlclBpZWNlKGQsIGtleXNbaV0sIGN0eCkpO1xuICAgIH0gZWxzZVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAgIGlmIChkLnBpZWNlc1trZXlzW2ldXSkgY2hpbGRyZW4ucHVzaChyZW5kZXJQaWVjZShkLCBrZXlzW2ldLCBjdHgpKTtcbiAgICAgIH1cblxuICBpZiAoZC5kcmFnZ2FibGUuc2hvd0dob3N0KSB7XG4gICAgdmFyIGRyYWdPcmlnID0gZC5kcmFnZ2FibGUuY3VycmVudC5vcmlnO1xuICAgIGlmIChkcmFnT3JpZyAmJiAhZC5kcmFnZ2FibGUuY3VycmVudC5uZXdQaWVjZSlcbiAgICAgIGNoaWxkcmVuLnB1c2gocmVuZGVyR2hvc3QoZHJhZ09yaWcsIGQucGllY2VzW2RyYWdPcmlnXSwgY3R4KSk7XG4gIH1cbiAgaWYgKGQuZHJhd2FibGUuZW5hYmxlZCkgY2hpbGRyZW4ucHVzaChzdmcoY3RybCkpO1xuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIHN0YXJ0RHJhZ09yRHJhdyhkKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKHV0aWwuaXNSaWdodEJ1dHRvbihlKSAmJiBkLmRyYWdnYWJsZS5jdXJyZW50Lm9yaWcpIHtcbiAgICAgIGlmIChkLmRyYWdnYWJsZS5jdXJyZW50Lm5ld1BpZWNlKSBkZWxldGUgZC5waWVjZXNbZC5kcmFnZ2FibGUuY3VycmVudC5vcmlnXTtcbiAgICAgIGQuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7fVxuICAgICAgZC5zZWxlY3RlZCA9IG51bGw7XG4gICAgfSBlbHNlIGlmICgoZS5zaGlmdEtleSB8fCB1dGlsLmlzUmlnaHRCdXR0b24oZSkpICYmIGQuZHJhd2FibGUuZW5hYmxlZCkgZHJhdy5zdGFydChkLCBlKTtcbiAgICBlbHNlIGRyYWcuc3RhcnQoZCwgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRyYWdPckRyYXcoZCwgd2l0aERyYWcsIHdpdGhEcmF3KSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKChlLnNoaWZ0S2V5IHx8IHV0aWwuaXNSaWdodEJ1dHRvbihlKSkgJiYgZC5kcmF3YWJsZS5lbmFibGVkKSB3aXRoRHJhdyhkLCBlKTtcbiAgICBlbHNlIGlmICghZC52aWV3T25seSkgd2l0aERyYWcoZCwgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpbmRFdmVudHMoY3RybCwgZWwsIGNvbnRleHQpIHtcbiAgdmFyIGQgPSBjdHJsLmRhdGE7XG4gIHZhciBvbnN0YXJ0ID0gc3RhcnREcmFnT3JEcmF3KGQpO1xuICB2YXIgb25tb3ZlID0gZHJhZ09yRHJhdyhkLCBkcmFnLm1vdmUsIGRyYXcubW92ZSk7XG4gIHZhciBvbmVuZCA9IGRyYWdPckRyYXcoZCwgZHJhZy5lbmQsIGRyYXcuZW5kKTtcbiAgdmFyIHN0YXJ0RXZlbnRzID0gWyd0b3VjaHN0YXJ0JywgJ21vdXNlZG93biddO1xuICB2YXIgbW92ZUV2ZW50cyA9IFsndG91Y2htb3ZlJywgJ21vdXNlbW92ZSddO1xuICB2YXIgZW5kRXZlbnRzID0gWyd0b3VjaGVuZCcsICdtb3VzZXVwJ107XG4gIHN0YXJ0RXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXYpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2LCBvbnN0YXJ0KTtcbiAgfSk7XG4gIG1vdmVFdmVudHMuZm9yRWFjaChmdW5jdGlvbihldikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXYsIG9ubW92ZSk7XG4gIH0pO1xuICBlbmRFdmVudHMuZm9yRWFjaChmdW5jdGlvbihldikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXYsIG9uZW5kKTtcbiAgfSk7XG4gIGNvbnRleHQub251bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzdGFydEV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2KSB7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2LCBvbnN0YXJ0KTtcbiAgICB9KTtcbiAgICBtb3ZlRXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXYpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXYsIG9ubW92ZSk7XG4gICAgfSk7XG4gICAgZW5kRXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXYpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXYsIG9uZW5kKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQm9hcmQoY3RybCkge1xuICB2YXIgZCA9IGN0cmwuZGF0YTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6ICdkaXYnLFxuICAgIGF0dHJzOiB7XG4gICAgICBjbGFzczogJ2NnLWJvYXJkIG9yaWVudGF0aW9uLScgKyBkLm9yaWVudGF0aW9uLFxuICAgICAgY29uZmlnOiBmdW5jdGlvbihlbCwgaXNVcGRhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKGlzVXBkYXRlKSByZXR1cm47XG4gICAgICAgIGlmICghZC52aWV3T25seSB8fCBkLmRyYXdhYmxlLmVuYWJsZWQpXG4gICAgICAgICAgYmluZEV2ZW50cyhjdHJsLCBlbCwgY29udGV4dCk7XG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gb25seSByZXBhaW50cyB0aGUgYm9hcmQgaXRzZWxmLlxuICAgICAgICAvLyBpdCdzIGNhbGxlZCB3aGVuIGRyYWdnaW5nIG9yIGFuaW1hdGluZyBwaWVjZXMsXG4gICAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGZ1bGwgYXBwbGljYXRpb24gZW1iZWRkaW5nIGNoZXNzZ3JvdW5kXG4gICAgICAgIC8vIHJlbmRlcmluZyBvbiBldmVyeSBhbmltYXRpb24gZnJhbWVcbiAgICAgICAgZC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtLnJlbmRlcihlbCwgcmVuZGVyQ29udGVudChjdHJsKSk7XG4gICAgICAgIH07XG4gICAgICAgIGQucmVuZGVyUkFGID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdXRpbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZC5yZW5kZXIpO1xuICAgICAgICB9O1xuICAgICAgICBkLmJvdW5kcyA9IHV0aWwubWVtbyhlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QuYmluZChlbCkpO1xuICAgICAgICBkLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgZC5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNoaWxkcmVuOiBbXVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGQgPSBjdHJsLmRhdGE7XG4gIHJldHVybiB7XG4gICAgdGFnOiAnZGl2JyxcbiAgICBhdHRyczoge1xuICAgICAgY29uZmlnOiBmdW5jdGlvbihlbCwgaXNVcGRhdGUpIHtcbiAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgaWYgKGQucmVkcmF3Q29vcmRzKSBkLnJlZHJhd0Nvb3JkcyhkLm9yaWVudGF0aW9uKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQuY29vcmRpbmF0ZXMpIGQucmVkcmF3Q29vcmRzID0gbWFrZUNvb3JkcyhkLm9yaWVudGF0aW9uLCBlbCk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChkLmRpc2FibGVDb250ZXh0TWVudSB8fCBkLmRyYXdhYmxlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZC5yZXNpemFibGUpXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjaGVzc2dyb3VuZC5yZXNpemUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBkLmJvdW5kcy5jbGVhcigpO1xuICAgICAgICAgICAgZC5yZW5kZXIoKTtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIFsnb25zY3JvbGwnLCAnb25yZXNpemUnXS5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICB2YXIgcHJldiA9IHdpbmRvd1tuXTtcbiAgICAgICAgICB3aW5kb3dbbl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHByZXYgJiYgcHJldigpO1xuICAgICAgICAgICAgZC5ib3VuZHMuY2xlYXIoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBjbGFzczogW1xuICAgICAgICAnY2ctYm9hcmQtd3JhcCcsXG4gICAgICAgIGQudmlld09ubHkgPyAndmlldy1vbmx5JyA6ICdtYW5pcHVsYWJsZSdcbiAgICAgIF0uam9pbignICcpXG4gICAgfSxcbiAgICBjaGlsZHJlbjogW3JlbmRlckJvYXJkKGN0cmwpXVxuICB9O1xufTtcbiIsIi8qIVxyXG4gKiBAbmFtZSBKYXZhU2NyaXB0L05vZGVKUyBNZXJnZSB2MS4yLjBcclxuICogQGF1dGhvciB5ZWlrb3NcclxuICogQHJlcG9zaXRvcnkgaHR0cHM6Ly9naXRodWIuY29tL3llaWtvcy9qcy5tZXJnZVxyXG5cclxuICogQ29weXJpZ2h0IDIwMTQgeWVpa29zIC0gTUlUIGxpY2Vuc2VcclxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS95ZWlrb3MvanMubWVyZ2UvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG47KGZ1bmN0aW9uKGlzTm9kZSkge1xyXG5cclxuXHQvKipcclxuXHQgKiBNZXJnZSBvbmUgb3IgbW9yZSBvYmplY3RzIFxyXG5cdCAqIEBwYXJhbSBib29sPyBjbG9uZVxyXG5cdCAqIEBwYXJhbSBtaXhlZCwuLi4gYXJndW1lbnRzXHJcblx0ICogQHJldHVybiBvYmplY3RcclxuXHQgKi9cclxuXHJcblx0dmFyIFB1YmxpYyA9IGZ1bmN0aW9uKGNsb25lKSB7XHJcblxyXG5cdFx0cmV0dXJuIG1lcmdlKGNsb25lID09PSB0cnVlLCBmYWxzZSwgYXJndW1lbnRzKTtcclxuXHJcblx0fSwgcHVibGljTmFtZSA9ICdtZXJnZSc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIHR3byBvciBtb3JlIG9iamVjdHMgcmVjdXJzaXZlbHkgXHJcblx0ICogQHBhcmFtIGJvb2w/IGNsb25lXHJcblx0ICogQHBhcmFtIG1peGVkLC4uLiBhcmd1bWVudHNcclxuXHQgKiBAcmV0dXJuIG9iamVjdFxyXG5cdCAqL1xyXG5cclxuXHRQdWJsaWMucmVjdXJzaXZlID0gZnVuY3Rpb24oY2xvbmUpIHtcclxuXHJcblx0XHRyZXR1cm4gbWVyZ2UoY2xvbmUgPT09IHRydWUsIHRydWUsIGFyZ3VtZW50cyk7XHJcblxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsb25lIHRoZSBpbnB1dCByZW1vdmluZyBhbnkgcmVmZXJlbmNlXHJcblx0ICogQHBhcmFtIG1peGVkIGlucHV0XHJcblx0ICogQHJldHVybiBtaXhlZFxyXG5cdCAqL1xyXG5cclxuXHRQdWJsaWMuY2xvbmUgPSBmdW5jdGlvbihpbnB1dCkge1xyXG5cclxuXHRcdHZhciBvdXRwdXQgPSBpbnB1dCxcclxuXHRcdFx0dHlwZSA9IHR5cGVPZihpbnB1dCksXHJcblx0XHRcdGluZGV4LCBzaXplO1xyXG5cclxuXHRcdGlmICh0eXBlID09PSAnYXJyYXknKSB7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSBbXTtcclxuXHRcdFx0c2l6ZSA9IGlucHV0Lmxlbmd0aDtcclxuXHJcblx0XHRcdGZvciAoaW5kZXg9MDtpbmRleDxzaXplOysraW5kZXgpXHJcblxyXG5cdFx0XHRcdG91dHB1dFtpbmRleF0gPSBQdWJsaWMuY2xvbmUoaW5wdXRbaW5kZXhdKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSB7fTtcclxuXHJcblx0XHRcdGZvciAoaW5kZXggaW4gaW5wdXQpXHJcblxyXG5cdFx0XHRcdG91dHB1dFtpbmRleF0gPSBQdWJsaWMuY2xvbmUoaW5wdXRbaW5kZXhdKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTWVyZ2UgdHdvIG9iamVjdHMgcmVjdXJzaXZlbHlcclxuXHQgKiBAcGFyYW0gbWl4ZWQgaW5wdXRcclxuXHQgKiBAcGFyYW0gbWl4ZWQgZXh0ZW5kXHJcblx0ICogQHJldHVybiBtaXhlZFxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiBtZXJnZV9yZWN1cnNpdmUoYmFzZSwgZXh0ZW5kKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVPZihiYXNlKSAhPT0gJ29iamVjdCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gZXh0ZW5kO1xyXG5cclxuXHRcdGZvciAodmFyIGtleSBpbiBleHRlbmQpIHtcclxuXHJcblx0XHRcdGlmICh0eXBlT2YoYmFzZVtrZXldKSA9PT0gJ29iamVjdCcgJiYgdHlwZU9mKGV4dGVuZFtrZXldKSA9PT0gJ29iamVjdCcpIHtcclxuXHJcblx0XHRcdFx0YmFzZVtrZXldID0gbWVyZ2VfcmVjdXJzaXZlKGJhc2Vba2V5XSwgZXh0ZW5kW2tleV0pO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0YmFzZVtrZXldID0gZXh0ZW5kW2tleV07XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBiYXNlO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIHR3byBvciBtb3JlIG9iamVjdHNcclxuXHQgKiBAcGFyYW0gYm9vbCBjbG9uZVxyXG5cdCAqIEBwYXJhbSBib29sIHJlY3Vyc2l2ZVxyXG5cdCAqIEBwYXJhbSBhcnJheSBhcmd2XHJcblx0ICogQHJldHVybiBvYmplY3RcclxuXHQgKi9cclxuXHJcblx0ZnVuY3Rpb24gbWVyZ2UoY2xvbmUsIHJlY3Vyc2l2ZSwgYXJndikge1xyXG5cclxuXHRcdHZhciByZXN1bHQgPSBhcmd2WzBdLFxyXG5cdFx0XHRzaXplID0gYXJndi5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKGNsb25lIHx8IHR5cGVPZihyZXN1bHQpICE9PSAnb2JqZWN0JylcclxuXHJcblx0XHRcdHJlc3VsdCA9IHt9O1xyXG5cclxuXHRcdGZvciAodmFyIGluZGV4PTA7aW5kZXg8c2l6ZTsrK2luZGV4KSB7XHJcblxyXG5cdFx0XHR2YXIgaXRlbSA9IGFyZ3ZbaW5kZXhdLFxyXG5cclxuXHRcdFx0XHR0eXBlID0gdHlwZU9mKGl0ZW0pO1xyXG5cclxuXHRcdFx0aWYgKHR5cGUgIT09ICdvYmplY3QnKSBjb250aW51ZTtcclxuXHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBpdGVtKSB7XHJcblxyXG5cdFx0XHRcdHZhciBzaXRlbSA9IGNsb25lID8gUHVibGljLmNsb25lKGl0ZW1ba2V5XSkgOiBpdGVtW2tleV07XHJcblxyXG5cdFx0XHRcdGlmIChyZWN1cnNpdmUpIHtcclxuXHJcblx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IG1lcmdlX3JlY3Vyc2l2ZShyZXN1bHRba2V5XSwgc2l0ZW0pO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdHJlc3VsdFtrZXldID0gc2l0ZW07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgdHlwZSBvZiB2YXJpYWJsZVxyXG5cdCAqIEBwYXJhbSBtaXhlZCBpbnB1dFxyXG5cdCAqIEByZXR1cm4gc3RyaW5nXHJcblx0ICpcclxuXHQgKiBAc2VlIGh0dHA6Ly9qc3BlcmYuY29tL3R5cGVvZnZhclxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiB0eXBlT2YoaW5wdXQpIHtcclxuXHJcblx0XHRyZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKGlucHV0KS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0fVxyXG5cclxuXHRpZiAoaXNOb2RlKSB7XHJcblxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBQdWJsaWM7XHJcblxyXG5cdH0gZWxzZSB7XHJcblxyXG5cdFx0d2luZG93W3B1YmxpY05hbWVdID0gUHVibGljO1xyXG5cclxuXHR9XHJcblxyXG59KSh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyk7IiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgZ3JvdW5kQnVpbGQgPSByZXF1aXJlKCcuL2dyb3VuZCcpO1xudmFyIGdlbmVyYXRlID0gcmVxdWlyZSgnLi4vLi4vZXhwbG9yZXIvc3JjL2NhbGMvZ2VuZXJhdGUnKTtcbnZhciBkaWFncmFtID0gcmVxdWlyZSgnLi4vLi4vZXhwbG9yZXIvc3JjL2NhbGMvZGlhZ3JhbScpO1xudmFyIGZlbmRhdGEgPSByZXF1aXJlKCcuLi8uLi9leHBsb3Jlci9zcmMvY2FsYy9mZW5kYXRhJyk7XG52YXIgcXVlcnlwYXJhbSA9IHJlcXVpcmUoJy4uLy4uL2V4cGxvcmVyL3NyYy91dGlsL3F1ZXJ5cGFyYW0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzLCBpMThuKSB7XG5cbiAgdmFyIGZlbiA9IG0ucHJvcChvcHRzLmZlbik7XG4gIHZhciBzZWxlY3Rpb24gPSBtLnByb3AoXCJLbmlnaHQgZm9ya3NcIik7XG4gIHZhciBmZWF0dXJlcyA9IG0ucHJvcChnZW5lcmF0ZS5leHRyYWN0U2luZ2xlRmVhdHVyZShzZWxlY3Rpb24oKSxmZW4oKSkpO1xuICB2YXIgZ3JvdW5kO1xuICB2YXIgc2NvcmUgPSBtLnByb3AoMCk7XG4gIHZhciBib251cyA9IG0ucHJvcChcIlwiKTtcbiAgdmFyIHRpbWUgPSBtLnByb3AoNjAuMCk7XG4gIHZhciBjb3JyZWN0ID0gbS5wcm9wKFtdKTtcbiAgdmFyIGluY29ycmVjdCA9IG0ucHJvcChbXSk7XG4gIFxuICBmdW5jdGlvbiBzaG93R3JvdW5kKCkge1xuICAgIGlmICghZ3JvdW5kKSBncm91bmQgPSBncm91bmRCdWlsZChmZW4oKSwgb25TcXVhcmVTZWxlY3QpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBuZXdHYW1lKCkge1xuICAgIHNjb3JlKDApO1xuICAgIGJvbnVzKFwiXCIpO1xuICAgIHRpbWUoNjApO1xuICAgIGNvcnJlY3QoW10pO1xuICAgIGluY29ycmVjdChbXSk7XG4gIH1cblxuXG5cbiAgZnVuY3Rpb24gb25TcXVhcmVTZWxlY3QodGFyZ2V0KSB7XG4gICAgaWYgKGNvcnJlY3QoKS5pbmNsdWRlcyh0YXJnZXQpIHx8IGluY29ycmVjdCgpLmluY2x1ZGVzKHRhcmdldCkpIHtcbiAgICAgIHRhcmdldCA9ICcnOyAgICBcbiAgICB9XG4gICAgZWxzZVxuICAgIGlmIChnZW5lcmF0ZS5mZWF0dXJlRm91bmQoZmVhdHVyZXMoKSwgdGFyZ2V0KSkge1xuICAgICAgY29ycmVjdCgpLnB1c2godGFyZ2V0KTtcbiAgICAgIHNjb3JlKHNjb3JlKCkgKyAxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbmNvcnJlY3QoKS5wdXNoKHRhcmdldCk7XG4gICAgICBzY29yZShzY29yZSgpIC0gMSk7XG4gICAgfVxuXG4gICAgZ3JvdW5kLnNldCh7XG4gICAgICBmZW46IGZlbigpLFxuICAgIH0pO1xuICAgIHZhciBjbGlja2VkRGlhZ3JhbSA9IGRpYWdyYW0uY2xpY2tlZFNxdWFyZXMoZmVhdHVyZXMoKSwgY29ycmVjdCgpLCBpbmNvcnJlY3QoKSwgdGFyZ2V0KTtcbiAgICBncm91bmQuc2V0U2hhcGVzKGNsaWNrZWREaWFncmFtKTtcbiAgICBtLnJlZHJhdygpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25GaWx0ZXJTZWxlY3Qoc2lkZSwgZGVzY3JpcHRpb24sIHRhcmdldCkge1xuICAgIGRpYWdyYW0uY2xlYXJEaWFncmFtcyhmZWF0dXJlcygpKTtcbiAgICBncm91bmQuc2V0U2hhcGVzKFtdKTtcbiAgICBncm91bmQuc2V0KHtcbiAgICAgIGZlbjogZmVuKCksXG4gICAgfSk7XG4gICAgcXVlcnlwYXJhbS51cGRhdGVVcmxXaXRoU3RhdGUoZmVuKCksIHNpZGUsIGRlc2NyaXB0aW9uLCB0YXJnZXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd0FsbCgpIHtcbiAgICBncm91bmQuc2V0U2hhcGVzKGRpYWdyYW0uYWxsRGlhZ3JhbXMoZmVhdHVyZXMoKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlRmVuKHZhbHVlKSB7XG4gICAgZmVuKHZhbHVlKTtcbiAgICBncm91bmQuc2V0KHtcbiAgICAgIGZlbjogZmVuKCksXG4gICAgfSk7XG4gICAgZ3JvdW5kLnNldFNoYXBlcyhbXSk7XG4gICAgZmVhdHVyZXMoZ2VuZXJhdGUuZXh0cmFjdEZlYXR1cmVzKGZlbigpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXh0RmVuKGRlc3QpIHtcbiAgICB1cGRhdGVGZW4oZmVuZGF0YVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmZW5kYXRhLmxlbmd0aCldKTtcbiAgfVxuXG4gIHNob3dHcm91bmQoKTtcbiAgbS5yZWRyYXcoKTtcblxuICByZXR1cm4ge1xuICAgIGZlbjogZmVuLFxuICAgIGdyb3VuZDogZ3JvdW5kLFxuICAgIGZlYXR1cmVzOiBmZWF0dXJlcyxcbiAgICB1cGRhdGVGZW46IHVwZGF0ZUZlbixcbiAgICBvbkZpbHRlclNlbGVjdDogb25GaWx0ZXJTZWxlY3QsXG4gICAgb25TcXVhcmVTZWxlY3Q6IG9uU3F1YXJlU2VsZWN0LFxuICAgIG5leHRGZW46IG5leHRGZW4sXG4gICAgc2hvd0FsbDogc2hvd0FsbCxcbiAgICBzY29yZTogc2NvcmUsXG4gICAgYm9udXM6IGJvbnVzLFxuICAgIHRpbWU6IHRpbWUsXG4gICAgc2VsZWN0aW9uOiBzZWxlY3Rpb25cbiAgfTtcbn07XG4iLCJ2YXIgY2hlc3Nncm91bmQgPSByZXF1aXJlKCdjaGVzc2dyb3VuZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZlbiwgb25TZWxlY3QpIHtcbiAgcmV0dXJuIG5ldyBjaGVzc2dyb3VuZC5jb250cm9sbGVyKHtcbiAgICBmZW46IGZlbixcbiAgICB2aWV3T25seTogZmFsc2UsXG4gICAgdHVybkNvbG9yOiAnd2hpdGUnLFxuICAgIGFuaW1hdGlvbjoge1xuICAgICAgZHVyYXRpb246IDIwMFxuICAgIH0sXG4gICAgaGlnaGxpZ2h0OiB7XG4gICAgICBsYXN0TW92ZTogZmFsc2VcbiAgICB9LFxuICAgIG1vdmFibGU6IHtcbiAgICAgIGZyZWU6IGZhbHNlLFxuICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICBwcmVtb3ZlOiB0cnVlLFxuICAgICAgZGVzdHM6IFtdLFxuICAgICAgc2hvd0Rlc3RzOiBmYWxzZSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICBhZnRlcjogZnVuY3Rpb24oKSB7fVxuICAgICAgfVxuICAgIH0sXG4gICAgZHJhd2FibGU6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgbW92ZTogZnVuY3Rpb24ob3JpZywgZGVzdCwgY2FwdHVyZWRQaWVjZSkge1xuICAgICAgICBvblNlbGVjdChkZXN0KTtcbiAgICAgIH0sXG4gICAgICBzZWxlY3Q6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBvblNlbGVjdChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgY3RybCA9IHJlcXVpcmUoJy4vY3RybCcpO1xudmFyIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvbWFpbicpO1xuXG5mdW5jdGlvbiBtYWluKG9wdHMpIHtcbiAgICB2YXIgY29udHJvbGxlciA9IG5ldyBjdHJsKG9wdHMpO1xuICAgIG0ubW91bnQob3B0cy5lbGVtZW50LCB7XG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHZpZXc6IHZpZXdcbiAgICB9KTtcbn1cblxuXG5tYWluKHtcbiAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJcIiksXG4gICAgZmVuOiBcInIzcjFrMS9wcDNwcHAvMXFuMWJuMi8xQmI1LzgvMk4yTjIvUFBQMVFQUFAvUjFCMlJLMSB3IC0gLSAxMSAxMlwiXG59KTtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xudmFyIHN0b3BldmVudCA9IHJlcXVpcmUoJy4uLy4uLy4uL2V4cGxvcmVyL3NyYy91dGlsL3N0b3BldmVudCcpO1xuXG5mdW5jdGlvbiBtYWtlU3RhcnMoY29udHJvbGxlciwgZmVhdHVyZSkge1xuICAgIHJldHVybiBmZWF0dXJlLnRhcmdldHMubWFwKHQgPT4gbSgnc3Bhbi5zdGFyJywge1xuICAgICAgICB0aXRsZTogdC50YXJnZXQsXG4gICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLm9uRmlsdGVyU2VsZWN0KGZlYXR1cmUuc2lkZSwgZmVhdHVyZS5kZXNjcmlwdGlvbiwgdC50YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3BldmVudChldmVudCk7XG4gICAgICAgIH1cbiAgICB9LCB0LnNlbGVjdGVkID8gbSgnc3Bhbi5zdGFyLnNlbGVjdGVkJywgJ+KYhScpIDogbSgnc3Bhbi5zdGFyJywgJ+KYhicpKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udHJvbGxlciwgZmVhdHVyZSkge1xuICAgIGlmIChmZWF0dXJlLnRhcmdldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIG0oJ2xpLmZlYXR1cmUuYnV0dG9uJywge1xuICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29udHJvbGxlci5vbkZpbHRlclNlbGVjdChmZWF0dXJlLnNpZGUsIGZlYXR1cmUuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3BldmVudChldmVudCk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIG0oJ2Rpdi5uYW1lJywgZmVhdHVyZS5kZXNjcmlwdGlvbiksXG4gICAgICAgIG0oJ2Rpdi5zdGFycycsIG1ha2VTdGFycyhjb250cm9sbGVyLCBmZWF0dXJlKSlcbiAgICBdKTtcbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciBmZWF0dXJlID0gcmVxdWlyZSgnLi9mZWF0dXJlJyk7XG52YXIgc3RvcGV2ZW50ID0gcmVxdWlyZSgnLi4vLi4vLi4vZXhwbG9yZXIvc3JjL3V0aWwvc3RvcGV2ZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udHJvbGxlcikge1xuICByZXR1cm4gbSgnZGl2LmZlYXR1cmVzYWxsJywgW1xuICAgIG0oJ2Rpdi5mZWF0dXJlcy5ib3RoLmJ1dHRvbicsIHtcbiAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb250cm9sbGVyLnNob3dBbGwoKTtcbiAgICAgIH1cbiAgICB9LCBbXG4gICAgICBtKCdwJywgJ0FsbCcpLFxuICAgICAgbSgnZGl2LmZlYXR1cmVzLmJsYWNrLmJ1dHRvbicsIHtcbiAgICAgICAgb25jbGljazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBjb250cm9sbGVyLm9uRmlsdGVyU2VsZWN0KCdiJywgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgcmV0dXJuIHN0b3BldmVudChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFtcbiAgICAgICAgbSgncCcsICdCbGFjaycpLFxuICAgICAgICBtKCd1bC5mZWF0dXJlcy5ibGFjaycsIGNvbnRyb2xsZXIuZmVhdHVyZXMoKS5maWx0ZXIoZiA9PiBmLnNpZGUgPT09ICdiJykubWFwKGYgPT4gZmVhdHVyZShjb250cm9sbGVyLCBmKSkpXG4gICAgICBdKSxcbiAgICAgIG0oJ2Rpdi5mZWF0dXJlcy53aGl0ZS5idXR0b24nLCB7XG4gICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29udHJvbGxlci5vbkZpbHRlclNlbGVjdCgndycsIG51bGwsIG51bGwpO1xuICAgICAgICAgIHJldHVybiBzdG9wZXZlbnQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9LCBbXG4gICAgICAgIG0oJ3AnLCAnV2hpdGUnKSxcbiAgICAgICAgbSgndWwuZmVhdHVyZXMud2hpdGUnLCBjb250cm9sbGVyLmZlYXR1cmVzKCkuZmlsdGVyKGYgPT4gZi5zaWRlID09PSAndycpLm1hcChmID0+IGZlYXR1cmUoY29udHJvbGxlciwgZikpKVxuICAgICAgXSlcbiAgICBdKVxuICBdKTtcbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gIHJldHVybiBbXG4gICAgbSgnaW5wdXQuY29weWFibGUuYXV0b3NlbGVjdC5mZW5pbnB1dCcsIHtcbiAgICAgIHNwZWxsY2hlY2s6IGZhbHNlLFxuICAgICAgdmFsdWU6IGNvbnRyb2xsZXIuZmVuKCksXG4gICAgICBvbmlucHV0OiBtLndpdGhBdHRyKCd2YWx1ZScsIGNvbnRyb2xsZXIudXBkYXRlRmVuKSxcbiAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbGVjdCgpO1xuICAgICAgfVxuICAgIH0pXG4gIF07XG59O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgY2hlc3Nncm91bmQgPSByZXF1aXJlKCdjaGVzc2dyb3VuZCcpO1xudmFyIGZlbmJhciA9IHJlcXVpcmUoJy4vZmVuYmFyJyk7XG52YXIgZmVhdHVyZXMgPSByZXF1aXJlKCcuL2ZlYXR1cmVzJyk7XG52YXIgc2VsZWN0aW9uID0gcmVxdWlyZSgnLi9zZWxlY3Rpb24nKTtcbnZhciBzY29yZSA9IHJlcXVpcmUoJy4vc2NvcmUnKTtcbnZhciB0aW1lciA9IHJlcXVpcmUoJy4vdGltZXInKTtcblxuZnVuY3Rpb24gdmlzdWFsQm9hcmQoY3RybCkge1xuICByZXR1cm4gbSgnZGl2LmxpY2hlc3NfYm9hcmQnLCBtKCdkaXYubGljaGVzc19ib2FyZF93cmFwJywgbSgnZGl2LmxpY2hlc3NfYm9hcmQnLCBbXG4gICAgY2hlc3Nncm91bmQudmlldyhjdHJsLmdyb3VuZClcbiAgXSkpKTtcbn1cblxuZnVuY3Rpb24gaW5mbyhjdHJsKSB7XG4gIHJldHVybiBbbSgnZGl2LmV4cGxhbmF0aW9uJywgW1xuICAgIG0oJ3AnLCAnSW5jcmVhc2UgeW91ciB0YWN0aWNhbCBhd2FyZW5lc3MgYnkgc3BvdHRpbmcgYWxsIGZlYXR1cmVzIGluIGEgY2F0ZWdvcnkgYXMgZmFzdCBhcyB5b3UgY2FuIChyZWdhcmRsZXNzIG9mIHF1YWxpdHkgb2YgbW92ZSknKSxcbiAgICBtKCdicicpLFxuICAgIG0oJ2JyJyksXG4gICAgbSgndWwuaW5zdHJ1Y3Rpb25zJywgW1xuICAgICAgbSgnbGkuaW5zdHJ1Y3Rpb25zJywgJ1NlbGVjdCB5b3VyIGNhdGVnb3J5IHRvIGJlZ2luLicpLFxuICAgICAgbSgnbGkuaW5zdHJ1Y3Rpb25zJywgJ0NsaWNrIG9uIHRoZSBjb3JyZWN0IHNxdWFyZXMuJyksXG4gICAgICBtKCdsaS5pbnN0cnVjdGlvbnMnLCAnQ29tYm8gYm9udXMgZm9yIDMgaW4gMSBzZWNvbmQuJyksXG4gICAgICBtKCdsaS5pbnN0cnVjdGlvbnMnLCAnVGltZSBleHRlbnNpb24gZm9yIGV2ZXJ5IDEwIGNvcnJlY3QuJylcbiAgICBdKSxcbiAgICBtKCdicicpLFxuICAgIG0oJ2JyJyksXG4gICAgc2VsZWN0aW9uKGN0cmwpLFxuICAgIG0oJ2JyJyksXG4gICAgbSgnYnInKSxcbiAgICBtKCdkaXYuYnV0dG9uLmNlbnRlci5hY3Rpb24nLCB7XG4gICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY3RybC5uZXh0RmVuKCk7XG4gICAgICB9XG4gICAgfSwgJ0JlZ2luJyksXG4gICAgbSgnYnInKSxcbiAgICBtKCdicicpLFxuICAgIHNjb3JlKGN0cmwpLFxuICAgIG0oJ2JyJyksXG4gICAgbSgnYnInKSxcbiAgICB0aW1lcihjdHJsKSAgICBcbiAgXSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgcmV0dXJuIFtcbiAgICBtKFwiZGl2LiNzaXRlX2hlYWRlclwiLFxuICAgICAgbSgnZGl2LmJvYXJkX2xlZnQnLCBbXG4gICAgICAgIG0oJ2gyJyxcbiAgICAgICAgICBtKCdhI3NpdGVfdGl0bGUnLCAnZmVhdHVyZScsXG4gICAgICAgICAgICBtKCdzcGFuLmV4dGVuc2lvbicsICd0cm9uJykpKSxcbiAgICAgICAgZmVhdHVyZXMoY3RybClcbiAgICAgIF0pXG4gICAgKSxcbiAgICBtKCdkaXYuI2xpY2hlc3MnLFxuICAgICAgbSgnZGl2LmFuYWx5c2UuY2ctNTEyJywgW1xuICAgICAgICBtKCdkaXYnLFxuICAgICAgICAgIG0oJ2Rpdi5saWNoZXNzX2dhbWUnLCBbXG4gICAgICAgICAgICB2aXN1YWxCb2FyZChjdHJsKSxcbiAgICAgICAgICAgIG0oJ2Rpdi5saWNoZXNzX2dyb3VuZCcsIGluZm8oY3RybCkpXG4gICAgICAgICAgXSlcbiAgICAgICAgKSxcbiAgICAgICAgbSgnZGl2LnVuZGVyYm9hcmQnLCBbXG4gICAgICAgICAgbSgnZGl2LmNlbnRlcicsIFtcbiAgICAgICAgICAgIGZlbmJhcihjdHJsKSxcbiAgICAgICAgICAgIG0oJ2JyJyksXG4gICAgICAgICAgICBtKCdzbWFsbCcsICdEYXRhIGF1dG9nZW5lcmF0ZWQgZnJvbSBnYW1lcyBvbiAnLCBtKFwiYS5leHRlcm5hbFtocmVmPSdodHRwOi8vbGljaGVzcy5vcmcnXVwiLCAnbGljaGVzcy5vcmcuJykpLFxuICAgICAgICAgICAgbSgnc21hbGwnLCBbXG4gICAgICAgICAgICAgICdVc2VzIGxpYnJhcmllcyAnLCBtKFwiYS5leHRlcm5hbFtocmVmPSdodHRwczovL2dpdGh1Yi5jb20vb3JuaWNhci9jaGVzc2dyb3VuZCddXCIsICdjaGVzc2dyb3VuZCcpLFxuICAgICAgICAgICAgICAnIGFuZCAnLCBtKFwiYS5leHRlcm5hbFtocmVmPSdodHRwczovL2dpdGh1Yi5jb20vamhseXdhL2NoZXNzLmpzJ11cIiwgJ2NoZXNzanMuJyksXG4gICAgICAgICAgICAgICcgU291cmNlIGNvZGUgb24gJywgbShcImEuZXh0ZXJuYWxbaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL3RhaWx1Z2UvY2hlc3Mtby10cm9uJ11cIiwgJ0dpdEh1Yi4nKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgICAgXSlcbiAgICApXG4gIF07XG59O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29udHJvbGxlcikge1xuICByZXR1cm4gW1xuICAgIG0oJ2Rpdi5ib251cycsIFwiYm9udXM6IFwiICsgY29udHJvbGxlci5ib251cygpKSxcbiAgICBtKCdkaXYuc2NvcmUnLCBcInNjb3JlOiBcIiArIGNvbnRyb2xsZXIuc2NvcmUoKSlcbiAgXTtcbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gIHJldHVybiBbXG4gICAgbSgnc2VsZWN0JywgW1xuICAgICAgbSgnb3B0aW9uJywge1xuICAgICAgICB2YWx1ZTogXCJLbmlnaHQgZm9ya3NcIlxuICAgICAgfSwgXCJLbmlnaHQgZm9ya3NcIiksXG4gICAgICBtKCdvcHRpb24nLCB7XG4gICAgICAgIHZhbHVlOiBcIlF1ZWVuIGZvcmtzXCJcbiAgICAgIH0sIFwiUXVlZW4gZm9ya3NcIiksXG4gICAgXSlcbiAgXTtcbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gIHJldHVybiBbXG4gICAgbSgnZGl2LnRpbWVyJywgXCJ0aW1lOiBcIiArIGNvbnRyb2xsZXIudGltZSgpKVxuICBdO1xufTtcbiJdfQ==
