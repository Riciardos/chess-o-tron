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
var uniq = require('./util/uniq');

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

},{"./util/uniq":16}],5:[function(require,module,exports){
module.exports = [
"r1bk3r/pppq1ppp/5n2/4N1N1/2Bp4/Bn6/P4PPP/4R1K1 w - - 0 1",
"3r1rk1/ppqn3p/1npb1P2/5B2/2P5/2N3B1/PP2Q1PP/R5K1 w - - 0 1",
"r3rk2/6b1/q2pQBp1/1NpP4/1n2PP2/nP6/P3N1K1/R6R w - - 0 1",
"r4n1k/ppBnN1p1/2p1p3/6Np/q2bP1b1/3B4/PPP3PP/R4Q1K w - - 0 1",
"r3QnR1/1bk5/pp5q/2b5/2p1P3/P7/1BB4P/3R3K w - - 0 1",
"q1r2b1k/rb4np/1p2p2N/pB1n4/6Q1/1P2P3/PB3PPP/2RR2K1 w - - 0 1",
"k2n1q1r/p1pB2p1/P4pP1/1Qp1p3/8/2P1BbN1/P7/2KR4 w - - 0 1",
"r2qk2r/pb4pp/1n2Pb2/2B2Q2/p1p5/2P5/2B2PPP/RN2R1K1 w - - 0 1",
"1Q1R4/5k2/6pp/2N1bp2/1Bn5/2P2P1P/1r3PK1/8 b - - 0 1",
"rnR5/p3p1kp/4p1pn/bpP5/5BP1/5N1P/2P2P2/2K5 w - - 0 1",
"r6r/1p2pp1k/p1b2q1p/4pP2/6QR/3B2P1/P1P2K2/7R w - - 0 1",
"2k4r/ppp2p2/2b2B2/7p/6pP/2P1q1bP/PP3N2/R4QK1 b - - 0 1",
"1r2k1r1/pbppnp1p/1b3P2/8/Q7/B1PB1q2/P4PPP/3R2K1 w - - 0 1",
"r4r1k/1bpq1p1n/p1np4/1p1Bb1BQ/P7/6R1/1P3PPP/1N2R1K1 w - - 0 1",
"r4rk1/p4ppp/Pp4n1/4BN2/1bq5/7Q/2P2PPP/3RR1K1 w - - 0 1",
"r3rknQ/1p1R1pb1/p3pqBB/2p5/8/6P1/PPP2P1P/4R1K1 w - - 0 1",
"3k1r1r/pb3p2/1p4p1/1B2B3/3qn3/6QP/P4RP1/2R3K1 w - - 0 1",
"1b4rk/4R1pp/p1b4r/2PB4/Pp1Q4/6Pq/1P3P1P/4RNK1 w - - 0 1",
"r1b1r1k1/ppp1np1p/2np2pQ/5qN1/1bP5/6P1/PP2PPBP/R1B2RK1 w - - 0 1",
"5qrk/p3b1rp/4P2Q/5P2/1pp5/5PR1/P6P/B6K w - - 0 1",
"r2q2nr/5p1p/p1Bp3b/1p1NkP2/3pP1p1/2PP2P1/PP5P/R1Bb1RK1 w - - 0 1",
"2r3k1/1p1r1p1p/pnb1pB2/5p2/1bP5/1P2QP2/P1B3PP/4RK2 w - - 0 1",
"2r5/2p2k1p/pqp1RB2/2r5/PbQ2N2/1P3PP1/2P3P1/4R2K w - - 0 1",
"7r/pRpk4/2np2p1/5b2/2P4q/2b1BBN1/P4PP1/3Q1K2 b - - 0 1",
"R4rk1/4r1p1/1q2p1Qp/1pb5/1n5R/5NB1/1P3PPP/6K1 w - - 0 1",
"2r4k/ppqbpQ1p/3p1bpB/8/8/1Nr2P2/PPP3P1/2KR3R w - - 0 1",
"2r1k2r/1p2pp1p/1p2b1pQ/4B3/3n4/2qB4/P1P2PPP/2KRR3 b - - 0 1",
"r1b2rk1/p3Rp1p/3q2pQ/2pp2B1/3b4/3B4/PPP2PPP/4R1K1 w - - 0 1",
"7k/1b1n1q1p/1p1p4/pP2pP1N/P6b/3pB2P/8/1R1Q2K1 b - - 0 1",
"1r1kr3/Nbppn1pp/1b6/8/6Q1/3B1P2/Pq3P1P/3RR1K1 w - - 0 1",
"r1bqr3/ppp1B1kp/1b4p1/n2B4/3PQ1P1/2P5/P4P2/RN4K1 w - - 0 1",
"r1nk3r/2b2ppp/p3bq2/3pN3/Q2P4/B1NB4/P4PPP/4R1K1 w - - 0 1",
"2r1r1k1/p2n1p1p/5pp1/qQ1P1b2/N7/5N2/PP3RPP/3K1B1R b - - 0 1",
"r1nk3r/2b2ppp/p3b3/3NN3/Q2P3q/B2B4/P4PPP/4R1K1 w - - 0 1",
"r1b1nn1k/p3p1b1/1qp1B1p1/1p1p4/3P3N/2N1B3/PPP3PP/R2Q1K2 w - - 0 1",
"r1bnk2r/pppp1ppp/1b4q1/4P3/2B1N3/Q1Pp1N2/P4PPP/R3R1K1 w - - 0 1",
"6k1/B2N1pp1/p6p/P3N1r1/4nb2/8/2R3B1/6K1 w - - 0 1",
"r1b3nr/ppp1kB1p/3p4/8/3PPBnb/1Q3p2/PPP2q2/RN4RK b - - 0 1",
"r2b2Q1/1bq5/pp1k2p1/2p1n1B1/P3P3/2N5/1PP3PP/5R1K w - - 0 1",
"1R4Q1/3nr1pp/3p1k2/5Bb1/4P3/2q1B1P1/5P1P/6K1 w - - 0 1",
"1r4kr/Q1bRBppp/2b5/8/2B1q3/6P1/P4P1P/5RK1 w - - 0 1",
"6k1/1p5p/3P3r/4p3/2N1PBpb/PPr5/3R1P1K/5b1R b - - 0 1",
"5rk1/1p1r2pp/p2p3q/3P2b1/PP1pP3/5Pp1/4B1P1/2RRQNK1 b - - 0 1",
"2k4r/ppp5/4bqp1/3p2Q1/6n1/2NB3P/PPP2bP1/R1B2R1K b - - 0 1",
"5r1k/3q3p/p2B1npb/P2np3/4N3/2N2b2/5PPP/R3QRK1 b - - 0 1",
"4r3/p4pkp/q7/3Bbb2/P2P1ppP/2N3n1/1PP2KPR/R1BQ4 b - - 0 1",
"3r1q1k/6bp/p1p5/1p2B1Q1/P1B5/3P4/5PPP/4R1K1 w - - 0 1",
"r4kr1/pbNn1q1p/1p6/2p2BPQ/5B2/8/P6P/b4RK1 w - - 0 1",
"r3r2k/4b2B/pn3p2/q1p4R/6b1/4P3/PPQ1NPPP/5RK1 w - - 0 1",
"rnbk1b1r/ppqpnQ1p/4p1p1/2p1N1B1/4N3/8/PPP2PPP/R3KB1R w - - 0 1",
"6rk/p1pb1p1p/2pp1P2/2b1n2Q/4PR2/3B4/PPP1K2P/RNB3q1 w - - 0 1",
"rn3rk1/2qp2pp/p3P3/1p1b4/3b4/3B4/PPP1Q1PP/R1B2R1K w - - 0 1",
"r2B1bk1/1p5p/2p2p2/p1n5/4P1BP/P1Nb4/KPn3PN/3R3R b - - 0 1",
"6k1/2b3r1/8/6pR/2p3N1/2PbP1PP/1PB2R1K/2r5 w - - 0 1",
"r5k1/p1p3bp/1p1p4/2PP2qp/1P6/1Q1bP3/PB3rPP/R2N2RK b - - 0 1",
"3rr2k/pp1b2b1/4q1pp/2Pp1p2/3B4/1P2QNP1/P6P/R4RK1 w - - 0 1",
"2bqr2k/1r1n2bp/pp1pBp2/2pP1PQ1/P3PN2/1P4P1/1B5P/R3R1K1 w - - 0 1",
"q2br1k1/1b4pp/3Bp3/p6n/1p3R2/3B1N2/PP2QPPP/6K1 w - - 0 1",
];

},{}],6:[function(require,module,exports){
module.exports = [
"r1bk3r/pppq1ppp/5n2/4N1N1/2Bp4/Bn6/P4PPP/4R1K1 w - - 0 1",
"2r2bk1/pb3ppp/1p6/n7/q2P4/P1P1R2Q/B2B1PPP/R5K1 w - - 0 1",
"k1n3rr/Pp3p2/3q4/3N4/3Pp2p/1Q2P1p1/3B1PP1/R4RK1 w - - 0 1",
"3r1rk1/ppqn3p/1npb1P2/5B2/2P5/2N3B1/PP2Q1PP/R5K1 w - - 0 1",
"N1bk4/pp1p1Qpp/8/2b5/3n3q/8/PPP2RPP/RNB1rBK1 b - - 0 1",
"r3br1k/pp5p/4B1p1/4NpP1/P2Pn3/q1PQ3R/7P/3R2K1 w - - 0 1",
"8/4R1pk/p5p1/8/1pB1n1b1/1P2b1P1/P4r1P/5R1K b - - 0 1",
"r1bk1r2/pp1n2pp/3NQ3/1P6/8/2n2PB1/q1B3PP/3R1RK1 w - - 0 1",
"rn3rk1/pp3p2/2b1pnp1/4N3/3q4/P1NB3R/1P1Q1PPP/R5K1 w - - 0 1",
"3qrk2/p1r2pp1/1p2pb2/nP1bN2Q/3PN3/P6R/5PPP/R5K1 w - - 0 1",
"r4n1k/ppBnN1p1/2p1p3/6Np/q2bP1b1/3B4/PPP3PP/R4Q1K w - - 0 1",
"5k1r/4npp1/p3p2p/3nP2P/3P3Q/3N4/qB2KPP1/2R5 w - - 0 1",
"r3r1k1/1b6/p1np1ppQ/4n3/4P3/PNB4R/2P1BK1P/1q6 w - - 0 1",
"r3q1k1/5p2/3P2pQ/Ppp5/1pnbN2R/8/1P4PP/5R1K w - - 0 1",
"2r2b1k/p2Q3p/b1n2PpP/2p5/3r1BN1/3q2P1/P4PB1/R3R1K1 w - - 0 1",
"q1r2b1k/rb4np/1p2p2N/pB1n4/6Q1/1P2P3/PB3PPP/2RR2K1 w - - 0 1",
"2r1k2r/pR2p1bp/2n1P1p1/8/2QP4/q2b1N2/P2B1PPP/4K2R w - - 0 1",
"3br3/pp2r3/2p4k/4N1pp/3PP3/P1N5/1P2K3/6RR w - - 0 1",
"2rr1k2/pb4p1/1p1qpp2/4R2Q/3n4/P1N5/1P3PPP/1B2R1K1 w - - 0 1",
"4q1rk/pb2bpnp/2r4Q/1p1p1pP1/4NP2/1P3R2/PBn4P/RB4K1 w - - 0 1",
"rnb2b1r/p3kBp1/3pNn1p/2pQN3/1p2PP2/4B3/Pq5P/4K3 w - - 0 1",
"r5nr/6Rp/p1NNkp2/1p3b2/2p5/5K2/PP2P3/3R4 w - - 0 1",
"r1b1kb1r/pp1n1pp1/1qp1p2p/6B1/2PPQ3/3B1N2/P4PPP/R4RK1 w - - 0 1",
"rn3k1r/pbpp1Bbp/1p4pN/4P1B1/3n4/2q3Q1/PPP2PPP/2KR3R w - - 0 1",
"r1bqkb2/6p1/p1p4p/1p1N4/8/1B3Q2/PP3PPP/3R2K1 w - - 0 1",
"rnbq1bnr/pp1p1p1p/3pk3/3NP1p1/5p2/5N2/PPP1Q1PP/R1B1KB1R w - - 0 1",
"r3rk2/5pn1/pb1nq1pR/1p2p1P1/2p1P3/2P2QN1/PPBB1P2/2K4R w - - 0 1",
"r1bq3r/ppp1nQ2/2kp1N2/6N1/3bP3/8/P2n1PPP/1R3RK1 w - - 0 1",
"4r3/pbpn2n1/1p1prp1k/8/2PP2PB/P5N1/2B2R1P/R5K1 w - - 0 1",
"rq3rk1/3n1pp1/pb4n1/3N2P1/1pB1QP2/4B3/PP6/2KR3R w - - 0 1",
"4b3/k1r1q2p/p3p3/3pQ3/2pN4/1R6/P4PPP/1R4K1 w - - 0 1",
"2b2r1k/1p2R3/2n2r1p/p1P1N1p1/2B3P1/P6P/1P3R2/6K1 w - - 0 1",
"1qr2bk1/pb3pp1/1pn3np/3N2NQ/8/P7/BP3PPP/2B1R1K1 w - - 0 1",
"1k5r/pP3ppp/3p2b1/1BN1n3/1Q2P3/P1B5/KP3P1P/7q w - - 0 1",
"5kqQ/1b1r2p1/ppn1p1Bp/2b5/2P2rP1/P4N2/1B5P/4RR1K w - - 0 1",
"3rnr1k/p1q1b1pB/1pb1p2p/2p1P3/2P2N2/PP4P1/1BQ4P/4RRK1 w - - 0 1",
"r2qr2k/pp1b3p/2nQ4/2pB1p1P/3n1PpR/2NP2P1/PPP5/2K1R1N1 w - - 0 1",
"r2q1r1k/pppb2pp/2np4/5p2/5N2/1B1Q4/PPP1RPPP/R5K1 w - - 0 1",
"r1b1qr2/pp2n1k1/3pp1pR/2p2pQ1/4PN2/2NP2P1/PP1K1PB1/n7 w - - 0 1",
"3r1r1k/1p3p1p/p2p4/4n1NN/6bQ/1BPq4/P3p1PP/1R5K w - - 0 1",
"1r3r1k/6p1/p6p/2bpNBP1/1p2n3/1P5Q/PBP1q2P/1K5R w - - 0 1",
"r4rk1/4bp2/1Bppq1p1/4p1n1/2P1Pn2/3P2N1/P2Q1PBK/1R5R b - - 0 1",
"r2q3r/ppp5/2n4p/4Pbk1/2BP1Npb/P2QB3/1PP3P1/R5K1 w - - 0 1",
"2r2bk1/2qn1ppp/pn1p4/5N2/N3r3/1Q6/5PPP/BR3BK1 w - - 0 1",
"r5kr/pppN1pp1/1bn1R3/1q1N2Bp/3p2Q1/8/PPP2PPP/R5K1 w - - 0 1",
"r3n1k1/pb5p/4N1p1/2pr4/q7/3B3P/1P1Q1PP1/2B1R1K1 w - - 0 1",
"1k1r2r1/ppq4p/4Q3/1B2np2/2P1p3/P7/2P1RPPR/2B1K3 b - - 0 1",
"rn4nr/pppq2bk/7p/5b1P/4NBQ1/3B4/PPP3P1/R3K2R w - - 0 1",
"r1br4/1p2bpk1/p1nppn1p/5P2/4P2B/qNNB3R/P1PQ2PP/7K w - - 0 1",
"2r5/2p2k1p/pqp1RB2/2r5/PbQ2N2/1P3PP1/2P3P1/4R2K w - - 0 1",
"6k1/5p2/R5p1/P6n/8/5PPp/2r3rP/R4N1K b - - 0 1",
"r3kr2/6Qp/1Pb2p2/pB3R2/3pq2B/4n3/1P4PP/4R1K1 w - - 0 1",
"r1r3k1/1bq2pbR/p5p1/1pnpp1B1/3NP3/3B1P2/PPPQ4/1K5R w - - 0 1",
"5Q2/1p3p1N/2p3p1/5b1k/2P3n1/P4RP1/3q2rP/5R1K w - - 0 1",
"rnb1k2r/ppppbN1p/5n2/7Q/4P3/2N5/PPPP3P/R1B1KB1q w - - 0 1",
"r1b2rk1/1p4qp/p5pQ/2nN1p2/2B2P2/8/PPP3PP/2K1R3 w - - 0 1",
"4r1k1/pb4pp/1p2p3/4Pp2/1P3N2/P2Qn2P/3n1qPK/RBB1R3 b - - 0 1",
"3q1r2/2rbnp2/p3pp1k/1p1p2N1/3P2Q1/P3P3/1P3PPP/5RK1 w - - 0 1",
"q5k1/5rb1/r6p/1Np1n1p1/3p1Pn1/1N4P1/PP5P/R1BQRK2 b - - 0 1",
"rn1q3r/pp2kppp/3Np3/2b1n3/3N2Q1/3B4/PP4PP/R1B2RK1 w - - 0 1",
"rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w - - 0 1",
"4r1k1/3r1p1p/bqp1n3/p2p1NP1/Pn1Q1b2/7P/1PP3B1/R2NR2K w - - 0 1",
"7r/6kr/p5p1/1pNb1pq1/PPpPp3/4P1b1/R3R1Q1/2B2BK1 b - - 0 1",
"rnbkn2r/pppp1Qpp/5b2/3NN3/3Pp3/8/PPP1KP1P/R1B4q w - - 0 1",
"r7/6R1/ppkqrn1B/2pp3p/P6n/2N5/8/1Q1R1K2 w - - 0 1",
"r1b2rk1/1p3ppp/p2p4/3NnQ2/2B1R3/8/PqP3PP/5RK1 w - - 0 1",
"r4r1k/2qb3p/p2p1p2/1pnPN3/2p1Pn2/2P1N3/PPB1QPR1/6RK w - - 0 1",
"rnbq1b1r/pp4kp/5np1/4p2Q/2BN1R2/4B3/PPPN2PP/R5K1 w - - 0 1",
"1nbk1b1r/1r6/p2P2pp/1B2PpN1/2p2P2/2P1B3/7P/R3K2R w - - 0 1",
"1r1kr3/Nbppn1pp/1b6/8/6Q1/3B1P2/Pq3P1P/3RR1K1 w - - 0 1",
"4k1r1/5p2/p1q5/1p2p2p/6n1/P4bQ1/1P4RP/3NR1BK b - - 0 1",
"5nk1/2N2p2/2b2Qp1/p3PpNp/2qP3P/6P1/5P1K/8 w - - 0 1",
"1k5r/pp1Q1pp1/2p4r/b4Pn1/3NPp2/2P2P2/1q4B1/1R2R1K1 b - - 0 1",
"6rk/5p2/2p1p2p/2PpP1q1/3PnQn1/8/4P2P/1N2BR1K b - - 0 1",
"4rk1r/p2b1pp1/1q5p/3pR1n1/3N1p2/1P1Q1P2/PBP3PK/4R3 w - - 0 1",
"r1bq1rk1/pp1nb1pp/5p2/6B1/3pQ3/3BPN2/PP3PPP/R4RK1 w - - 0 1",
"rn1r4/pp2p1b1/5kpp/q1PQ1b2/6n1/2N2N2/PPP3PP/R1B2RK1 w - - 0 1",
"k7/p1Qnr2p/b1pB1p2/3p3q/N1p5/3P3P/PPP3P1/6K1 w - - 0 1",
"3r4/4RRpk/5n1N/8/p1p2qPP/P1Qp1P2/1P4K1/3b4 w - - 0 1",
"qr6/1b1p1krQ/p2Pp1p1/4PP2/1p1B1n2/3B4/PP3K1P/2R2R2 w - - 0 1",
"r1nk3r/2b2ppp/p3bq2/3pN3/Q2P4/B1NB4/P4PPP/4R1K1 w - - 0 1",
"4r2k/4Q1bp/4B1p1/1q2n3/4pN2/P1B3P1/4pP1P/4R1K1 w - - 0 1",
"4r1k1/5ppp/p2p4/4r3/1pNn4/1P6/1PPK2PP/R3R3 b - - 0 1",
"r1nk3r/2b2ppp/p3b3/3NN3/Q2P3q/B2B4/P4PPP/4R1K1 w - - 0 1",
"r1b1k1nr/p2p1ppp/n2B4/1p1NPN1P/6P1/3P1Q2/P1P1K3/q5b1 w - - 0 1",
"2r1rk2/1b2b1p1/p1q2nP1/1p2Q3/4P3/P1N1B3/1PP1B2R/2K4R w - - 0 1",
"4r1k1/pR3pp1/7p/3n1b1N/2pP4/2P2PQ1/3B1KPP/q7 b - - 0 1",
"2R1R1nk/1p4rp/p1n5/3N2p1/1P6/2P5/P6P/2K5 w - - 0 1",
"r1b1r1kq/pppnpp1p/1n4pB/8/4N2P/1BP5/PP2QPP1/R3K2R w - - 0 1",
"rnb2rk1/ppp2qb1/6pQ/2pN1p2/8/1P3BP1/PB2PP1P/R4RK1 w - - 0 1",
"r2qkb1r/2p1nppp/p2p4/np1NN3/4P3/1BP5/PP1P1PPP/R1B1K2R w - - 0 1",
"r6r/1q1nbkp1/pn2p2p/1p1pP1P1/3P1N1P/1P1Q1P2/P2B1K2/R6R w - - 0 1",
"3k4/1pp3b1/4b2p/1p3qp1/3Pn3/2P1RN2/r5P1/1Q2R1K1 b - - 0 1",
"rn3k2/pR2b3/4p1Q1/2q1N2P/3R2P1/3K4/P3Br2/8 w - - 0 1",
"2r1r3/pp1nbN2/4p3/q7/P1pP2nk/2P2P2/1PQ5/R3R1K1 w - - 0 1",
"6k1/5p2/p5n1/8/1p1p2P1/1Pb2B1r/P3KPN1/2RQ3q b - - 0 1",
"r1bqr1k1/ppp2pp1/3p4/4n1NQ/2B1PN2/8/P4PPP/b4RK1 w - - 0 1",
"1r2q2k/4N2p/3p1Pp1/2p1n1P1/2P5/p2P2KQ/P3R3/8 w - - 0 1",
"r5rk/pp2qb1p/2p2pn1/2bp4/3pP1Q1/1B1P1N1R/PPP3PP/R1B3K1 w - - 0 1",
"rnbq1bkr/pp3p1p/2p3pQ/3N2N1/2B2p2/8/PPPP2PP/R1B1R1K1 w - - 0 1",
"2r2n1k/2q3pp/p2p1b2/2nB1P2/1p1N4/8/PPP4Q/2K3RR w - - 0 1",
"r1q5/2p2k2/p4Bp1/2Nb1N2/p6Q/7P/nn3PP1/R5K1 w - - 0 1",
"rn2kb1r/1pQbpppp/1p6/qp1N4/6n1/8/PPP3PP/2KR2NR w - - 0 1",
"2r1k3/3n1p2/6p1/1p1Qb3/1B2N1q1/2P1p3/P4PP1/2KR4 w - - 0 1",
"r1b1r3/qp1n1pk1/2pp2p1/p3n3/N1PNP1P1/1P3P2/P6Q/1K1R1B1R w - - 0 1",
"5rk1/2pb1ppp/p2r4/1p1Pp3/4Pn1q/1B1PNP2/PP1Q1P1P/R5RK b - - 0 1",
"3nbr2/4q2p/r3pRpk/p2pQRN1/1ppP2p1/2P5/PPB4P/6K1 w - - 0 1",
"r1bnrn2/ppp1k2p/4p3/3PNp1P/5Q2/3B2R1/PPP2PP1/2K1R3 w - - 0 1",
"7k/p5b1/1p4Bp/2q1p1p1/1P1n1r2/P2Q2N1/6P1/3R2K1 b - - 0 1",
"r1bq1k1r/pp2R1pp/2pp1p2/1n1N4/8/3P1Q2/PPP2PPP/R1B3K1 w - - 0 1",
"r1bn1b2/ppk1n2r/2p3pp/5p2/N1PNpPP1/2B1P3/PP2B2P/2KR2R1 w - - 0 1",
"2rq2k1/3bb2p/n2p2pQ/p2Pp3/2P1N1P1/1P5P/6B1/2B2R1K w - - 0 1",
"r6k/pp4pp/1b1P4/8/1n4Q1/2N1RP2/PPq3p1/1RB1K3 b - - 0 1",
"rnb2b1r/ppp1n1kp/3p1q2/7Q/4PB2/2N5/PPP3PP/R4RK1 w - - 0 1",
"r2k2nr/pp1b1Q1p/2n4b/3N4/3q4/3P4/PPP3PP/4RR1K w - - 0 1",
"5r1k/3q3p/p2B1npb/P2np3/4N3/2N2b2/5PPP/R3QRK1 b - - 0 1",
"4r3/p4pkp/q7/3Bbb2/P2P1ppP/2N3n1/1PP2KPR/R1BQ4 b - - 0 1",
"6k1/6p1/3r1n1p/p4p1n/P1N4P/2N5/Q2RK3/7q b - - 0 1",
"8/8/2K2b2/2N2k2/1p4R1/1B3n1P/3r1P2/8 w - - 0 1",
"2q2r2/5rk1/4pNpp/p2pPn2/P1pP2QP/2P2R2/2B3P1/6K1 w - - 0 1",
"5kr1/pp4p1/3b1rb1/2Bp2NQ/1q6/8/PP3PPP/R3R1K1 w - - 0 1",
"r1b2r2/pp3Npk/6np/8/2q1N3/4Q3/PPP2RPP/6K1 w - - 0 1",
"r2q1rk1/p4p1p/3p1Q2/2n3B1/B2R4/8/PP3PPP/5bK1 w - - 0 1",
"3q2r1/p2b1k2/1pnBp1N1/3p1pQP/6P1/5R2/2r2P2/4RK2 w - - 0 1",
"3rnn2/p1r2pkp/1p2pN2/2p1P3/5Q1N/2P3P1/PP2qPK1/R6R w - - 0 1",
"r1b2rk1/pp2b1pp/q3pn2/3nN1N1/3p4/P2Q4/1P3PPP/RBB1R1K1 w - - 0 1",
"qr3b1r/Q5pp/3p4/1kp5/2Nn1B2/Pp6/1P3PPP/2R1R1K1 w - - 0 1",
"r2qr1k1/1p3pP1/p2p1np1/2pPp1B1/2PnP1b1/2N2p2/PP1Q4/2KR1BNR w - - 0 1",
"6rk/p3p2p/1p2Pp2/2p2P2/2P1nBr1/1P6/P6P/3R1R1K b - - 0 1",
"rk3q1r/pbp4p/1p3P2/2p1N3/3p2Q1/3P4/PPP3PP/R3R1K1 w - - 0 1",
"3q1r2/pb3pp1/1p6/3pP1Nk/2r2Q2/8/Pn3PP1/3RR1K1 w - - 0 1",
"r7/3bb1kp/q4p1N/1pnPp1np/2p4Q/2P5/1PB3P1/2B2RK1 w - - 0 1",
"1r1qrbk1/3b3p/p2p1pp1/3NnP2/3N4/1Q4BP/PP4P1/1R2R2K w - - 0 1",
"r2r2k1/1q4p1/ppb3p1/2bNp3/P1Q5/1N5R/1P4BP/n6K w - - 0 1",
"1b2r1k1/3n2p1/p3p2p/1p3r2/3PNp1q/3BnP1P/PP1BQP1K/R6R b - - 0 1",
"6rk/1pqbbp1p/p3p2Q/6R1/4N1nP/3B4/PPP5/2KR4 w - - 0 1",
"r3r1n1/pp3pk1/2q2p1p/P2NP3/2p1QP2/8/1P5P/1B1R3K w - - 0 1",
"rnbk1b1r/ppqpnQ1p/4p1p1/2p1N1B1/4N3/8/PPP2PPP/R3KB1R w - - 0 1",
"2br3k/pp3Pp1/1n2p3/1P2N1pr/2P2qP1/8/1BQ2P1P/4R1K1 w - - 0 1",
"5rk1/pp2p2p/3p2pb/2pPn2P/2P2q2/2N4P/PP3BR1/R2BK1N1 b - - 0 1",
"r3q1r1/1p2bNkp/p3n3/2PN1B1Q/PP1P1p2/7P/5PP1/6K1 w - - 0 1",
"r5rk/ppq2p2/2pb1P1B/3n4/3P4/2PB3P/PP1QNP2/1K6 w - - 0 1",
"2b1rqk1/r1p2pp1/pp4n1/3Np1Q1/4P2P/1BP5/PP3P2/2KR2R1 w - - 0 1",
"r1b4r/1k2bppp/p1p1p3/8/Np2nB2/3R4/PPP1BPPP/2KR4 w - - 0 1",
"r2qr1k1/1p1n2pp/2b1p3/p2pP1b1/P2P1Np1/3BPR2/1PQB3P/5RK1 w - - 0 1",
"2rb3r/3N1pk1/p2pp2p/qp2PB1Q/n2N1P2/6P1/P1P4P/1K1RR3 w - - 0 1",
"r1b2k1r/2q1b3/p3ppBp/2n3B1/1p6/2N4Q/PPP3PP/2KRR3 w - - 0 1",
"r1b1rk2/pp1nbNpB/2p1p2p/q2nB3/3P3P/2N1P3/PPQ2PP1/2KR3R w - - 0 1",
"r1bq1r1k/pp4pp/2pp4/2b2p2/4PN2/1BPP1Q2/PP3PPP/R4RK1 w - - 0 1",
"r2q4/p2nR1bk/1p1Pb2p/4p2p/3nN3/B2B3P/PP1Q2P1/6K1 w - - 0 1",
"5r1k/pp1n1p1p/5n1Q/3p1pN1/3P4/1P4RP/P1r1qPP1/R5K1 w - - 0 1",
"4nrk1/rR5p/4pnpQ/4p1N1/2p1N3/6P1/q4P1P/4R1K1 w - - 0 1",
"7R/r1p1q1pp/3k4/1p1n1Q2/3N4/8/1PP2PPP/2B3K1 w - - 0 1",
"r1qbr2k/1p2n1pp/3B1n2/2P1Np2/p4N2/PQ4P1/1P3P1P/3RR1K1 w - - 0 1",
"1r1rb3/p1q2pkp/Pnp2np1/4p3/4P3/Q1N1B1PP/2PRBP2/3R2K1 w - - 0 1",
"4r3/2q1rpk1/p3bN1p/2p3p1/4QP2/2N4P/PP4P1/5RK1 w - - 0 1",
"rq3rk1/1p1bpp1p/3p2pQ/p2N3n/2BnP1P1/5P2/PPP5/2KR3R w - - 0 1",
"4r1k1/Q4bpp/p7/5N2/1P3qn1/2P5/P1B3PP/R5K1 b - - 0 1",
"4r3/2p5/2p1q1kp/p1r1p1pN/P5P1/1P3P2/4Q3/3RB1K1 w - - 0 1",
"3r3k/1b2b1pp/3pp3/p3n1P1/1pPqP2P/1P2N2R/P1QB1r2/2KR3B b - - 0 1",
];

},{}],7:[function(require,module,exports){
module.exports = [
"r2q1rk1/ppp1n1p1/1b1p1p2/1B1N2BQ/3pP3/2P3P1/PP3P2/R5K1 w - - 0 1",
"k1n3rr/Pp3p2/3q4/3N4/3Pp2p/1Q2P1p1/3B1PP1/R4RK1 w - - 0 1",
"3r1rk1/ppqn3p/1npb1P2/5B2/2P5/2N3B1/PP2Q1PP/R5K1 w - - 0 1",
"r5k1/pp2ppb1/3p4/q3P1QR/6b1/r2B1p2/1PP5/1K4R1 w - - 0 1",
"7k/1p1P1Qpq/p6p/5p1N/6N1/7P/PP1r1PPK/8 w - - 0 1",
"2b3rk/1q3p1p/p1p1pPpQ/4N3/2pP4/2P1p1P1/1P4PK/5R2 w - - 0 1",
"r3q1k1/5p2/3P2pQ/Ppp5/1pnbN2R/8/1P4PP/5R1K w - - 0 1",
"r2r2k1/1q2bpB1/pp1p1PBp/8/P7/7Q/1PP3PP/R6K w - - 0 1",
"2r5/3nbkp1/2q1p1p1/1p1n2P1/3P4/2p1P1NQ/1P1B1P2/1B4KR w - - 0 1",
"3k4/1R6/1P2PNp1/7p/2n4P/8/4rPP1/6K1 w - - 0 1",
"5rbk/2pq3p/5PQR/p7/3p3R/1P4N1/P5PP/6K1 w - - 0 1",
"r2qk2r/pb4pp/1n2Pb2/2B2Q2/p1p5/2P5/2B2PPP/RN2R1K1 w - - 0 1",
"2bq1k1r/r5pp/p2b1Pn1/1p1Q4/3P4/1B6/PP3PPP/2R1R1K1 w - - 0 1",
"1r2Rr2/3P1p1k/5Rpp/qp6/2pQ4/7P/5PPK/8 w - - 0 1",
"6k1/5p2/4nQ1P/p4N2/1p1b4/7K/PP3r2/8 w - - 0 1",
"2r4k/p4rRp/1p1R3B/5p1q/2Pn4/5p2/PP4QP/1B5K w - - 0 1",
"2r1b3/1pp1qrk1/p1n1P1p1/7R/2B1p3/4Q1P1/PP3PP1/3R2K1 w - - 0 1",
"3k1r2/2pb4/2p3P1/2Np1p2/1P6/4nN1R/2P1q3/Q5K1 w - - 0 1",
"2r1k3/2P3R1/3P2K1/6N1/8/8/8/3r4 w - - 0 1",
"3r4/p4Q1p/1p2P2k/2p3pq/2P2B2/1P2p2P/P5P1/6K1 w - - 0 1",
"rqr3k1/3bppBp/3p2P1/p7/1n2P3/1p3P2/1PPQ2P1/2KR3R w - - 0 1",
"1r1b1n2/1pk3p1/4P2p/3pP3/3N4/1p2B3/6PP/R5K1 w - - 0 1",
"1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 0 1",
"r1b2k1r/ppp1bppp/8/1B1Q4/5q2/2P5/PPP2PPP/R3R1K1 w - - 0 1",
"3r1rk1/p1p4p/8/1PP1p1bq/2P5/3N1Pp1/PB2Q3/1R3RK1 b - - 0 1",
"r1bq1bkr/6pp/p1p3P1/1p1p3Q/4P3/8/PPP3PP/RNB2RK1 w - - 0 1",
"5bk1/6p1/5PQ1/pp4Pp/2p4P/P2r4/1PK5/8 w - - 0 1",
"3q1rk1/4bp1p/1n2P2Q/1p1p1p2/6r1/Pp2R2N/1B1P2PP/7K w - - 0 1",
"3nk1r1/1pq4p/p3PQpB/5p2/2r5/8/P4PPP/3RR1K1 w - - 0 1",
"3r1r1k/1p3p1p/p2p4/4n1NN/6bQ/1BPq4/P3p1PP/1R5K w - - 0 1",
"1k1r4/1b1p2pp/PQ2p3/nN6/P3P3/8/6PP/2q2BK1 w - - 0 1",
"5qrk/p3b1rp/4P2Q/5P2/1pp5/5PR1/P6P/B6K w - - 0 1",
"r5rk/2p1Nppp/3p3P/pp2p1P1/4P3/2qnPQK1/8/R6R w - - 0 1",
"2rnk3/pq3p2/3P1Q1R/1p6/3P4/5P2/P1b1N1P1/5K2 w - - 0 1",
"6k1/ppp2ppp/8/2n2K1P/2P2P1P/2Bpr3/PP4r1/4RR2 b - - 0 1",
"r3kr2/6Qp/1Pb2p2/pB3R2/3pq2B/4n3/1P4PP/4R1K1 w - - 0 1",
"5rk1/2R4p/3QP1p1/3p4/4p3/1P5P/q7/2R3K1 w - - 0 1",
"2rrk3/QR3pp1/2n1b2p/1BB1q3/3P4/8/P4PPP/6K1 w - - 0 1",
"8/2P2pk1/3Q4/4pq2/7p/6pP/2r3P1/6RK b - - 0 1",
"2r5/p1qp1kpp/b4p2/3P4/2nQ1P2/3p2N1/PP4PP/1K1RN3 b - - 0 1",
"r1b2k1r/1p1p1pp1/p2P4/4N1Bp/3p4/8/PPB2P2/2K1R3 w - - 0 1",
"5q2/p7/3R4/3Q2p1/5pk1/4p1P1/P6P/2r2NK1 w - - 0 1",
"2r3k1/p4p2/1p2P1pQ/3bR2p/1q6/1B6/PP2RPr1/5K2 w - - 0 1",
"7k/1R6/5pP1/1p1Np3/1P2P3/6r1/2PK4/5b2 w - - 0 1",
"1nbk1b1r/1r6/p2P2pp/1B2PpN1/2p2P2/2P1B3/7P/R3K2R w - - 0 1",
"7R/5rp1/2p1r1k1/2q5/4pP1Q/4P3/5PK1/7R w - - 0 1",
"8/5p1k/4r1p1/2PP1p2/1Q6/1p3bbP/1B2pqP1/R5RK b - - 0 1",
"2r2qk1/r4p1p/b3pBpQ/n3P2P/p2p3R/P5P1/2p2PB1/R5K1 w - - 0 1",
"1r3k2/4R3/1p4Pp/p1pN1p2/2Pn1K2/1P6/1P6/8 w - - 0 1",
"4r1k1/pR3pp1/1n3P1p/q2p4/5N1P/P1rQpP2/8/2B2RK1 w - - 0 1",
"6rk/p1q2p2/2p1rb1P/1p2pN2/4P1Q1/2PP4/PPB5/2K4R w - - 0 1",
"6k1/2P2p2/6p1/4p1Kp/p1R1Pn1P/5P1r/P4P2/8 b - - 0 1",
"b4rk1/p4p2/1p4Pq/4p3/8/P1N2PQ1/BP3PK1/8 w - - 0 1",
"r2r4/pp2ppkp/2P3p1/q1p5/4PQ2/2P2b2/P4PPP/2R1KB1R b - - 0 1",
"r1b2k1r/pppp4/1bP2qp1/5pp1/4pP2/1BP5/PBP3PP/R2Q1R1K b - - 0 1",
"r1bnk2r/pppp1ppp/1b4q1/4P3/2B1N3/Q1Pp1N2/P4PPP/R3R1K1 w - - 0 1",
"2kr3r/1p3ppp/p3pn2/2b1B2q/Q1N5/2P5/PP3PPP/R2R2K1 w - - 0 1",
"r3k2r/1ppq1ppp/1p2P3/n3Pb2/1bP2Q2/2N2N1P/PP4P1/2KR1B1R b - - 0 1",
"6k1/1p3pp1/p1b1p2p/q3r1b1/P7/1P5P/1NQ1RPP1/1B4K1 b - - 0 1",
"1r2q2k/4N2p/3p1Pp1/2p1n1P1/2P5/p2P2KQ/P3R3/8 w - - 0 1",
"5r2/1qp2pp1/bnpk3p/4NQ2/2P5/1P5P/5PP1/4R1K1 w - - 0 1",
"8/6R1/p2kp2r/qb5P/3p1N1Q/1p1Pr3/PP6/1K5R w - - 0 1",
"r4rk1/p4pp1/7P/2pp4/3Bn3/8/qPP1QP1P/2KR2R1 w - - 0 1",
"r1qr2k1/2p3b1/1p2P2R/2pPp3/2P3PQ/pPN5/P1B3K1/8 w - - 0 1",
"4rk2/p5p1/1p2P2N/7R/nP5P/5PQ1/b6K/q7 w - - 0 1",
"2r1k3/3n1p2/6p1/1p1Qb3/1B2N1q1/2P1p3/P4PP1/2KR4 w - - 0 1",
"5rk1/pp1qpR2/6Pp/3ppNbQ/2nP4/B1P5/P5PP/6K1 w - - 0 1",
"6k1/2r4p/p3b1PP/1pq5/4P3/P5Q1/1P2B3/1K3R2 b - - 0 1",
"r6k/pp4pp/1b1P4/8/1n4Q1/2N1RP2/PPq3p1/1RB1K3 b - - 0 1",
"1r2r2k/1q1n1p1p/p1b1pp2/3pP3/1b5R/2N1BBQ1/1PP3PP/3R3K w - - 0 1",
"3k4/1p3Bp1/p5r1/2b5/P3P1N1/5Pp1/1P1r4/2R4K b - - 0 1",
"1r4k1/1r2ppb1/4bPp1/3pP3/2qB2P1/p7/1PP4Q/2KR3R w - - 0 1",
"4R3/p2r1q1k/5B1P/6P1/2p4K/3b4/4Q3/8 w - - 0 1",
"r2qr1k1/1p3pP1/p2p1np1/2pPp1B1/2PnP1b1/2N2p2/PP1Q4/2KR1BNR w - - 0 1",
"5r2/1pP1b1p1/pqn1k2p/4p3/QP2BP2/P3P1PK/3R4/3R4 w - - 0 1",
"4k3/p5p1/2p4r/2NPb3/4p1pr/1P4q1/P1QR1R1P/7K b - - 0 1",
"6R1/2k2P2/1n5r/3p1p2/3P3b/1QP2p1q/3R4/6K1 b - - 0 1",
"8/6pk/pb5p/8/1P2qP2/P3p3/2r2PNP/1QR3K1 b - - 0 1",
"2br3k/pp3Pp1/1n2p3/1P2N1pr/2P2qP1/8/1BQ2P1P/4R1K1 w - - 0 1",
"rn3rk1/2qp2pp/p3P3/1p1b4/3b4/3B4/PPP1Q1PP/R1B2R1K w - - 0 1",
];

},{}],8:[function(require,module,exports){
module.exports = [
"2R5/4bppk/1p1p4/5R1P/4PQ2/5P2/r4q1P/7K w - - 0 1",
"7r/1qr1nNp1/p1k4p/1pB5/4P1Q1/8/PP3PPP/6K1 w - - 0 1",
"r1b2k1r/ppppq3/5N1p/4P2Q/4PP2/1B6/PP5P/n2K2R1 w - - 0 1",
"2kr1b1r/ppq5/1np1pp2/P3Pn2/1P3P2/2P2Qp1/6P1/RNB1RBK1 b - - 0 1",
"r2qrb2/p1pn1Qp1/1p4Nk/4PR2/3n4/7N/P5PP/R6K w - - 0 1",
"r1bk3r/pppq1ppp/5n2/4N1N1/2Bp4/Bn6/P4PPP/4R1K1 w - - 0 1",
"1rb2k2/1pq3pQ/pRpNp3/P1P2n2/3P1P2/4P3/6PP/6K1 w - - 0 1",
"1rr4k/7p/p3Qpp1/3p1P2/8/1P1q3P/PK4P1/3B3R b - - 0 1",
"2r2bk1/pb3ppp/1p6/n7/q2P4/P1P1R2Q/B2B1PPP/R5K1 w - - 0 1",
"r4rk1/pp4b1/6pp/2pP4/5pKn/P2B2N1/1PQP1Pq1/1RB2R2 b - - 0 1",
"r4r1k/p2p3p/bp1Np3/4P3/2P2nR1/3B1q2/P1PQ4/2K3R1 w - - 0 1",
"3r2k1/p1p2p2/bp2p1nQ/4PB1P/2pr3q/6R1/PP3PP1/3R2K1 w - - 0 1",
"r2q1rk1/ppp1n1p1/1b1p1p2/1B1N2BQ/3pP3/2P3P1/PP3P2/R5K1 w - - 0 1",
"5rk1/pR4pp/4p2r/2p1n2q/2P1p3/P1Q1P1P1/1P3P1P/R1B2NK1 b - - 0 1",
"8/p2pQ2p/2p1p2k/4Bqp1/2P2P2/P6P/6PK/3r4 w - - 0 1",
"4r1k1/5p1p/p4PpQ/4q3/P6P/6P1/3p3K/8 b - - 0 1",
"r1br1b2/4pPk1/1p1q3p/p2PR3/P1P2N2/1P1Q2P1/5PBK/4R3 w - - 0 1",
"7r/3kbp1p/1Q3R2/3p3q/p2P3B/1P5K/P6P/8 w - - 0 1",
"2r4b/pp1kprNp/3pNp1P/q2P2p1/2n5/4B2Q/PPP3R1/1K1R4 w - - 0 1",
"r6r/pp1Q2pp/2p4k/4R3/5P2/2q5/P1P3PP/R5K1 w - - 0 1",
"2rqrb2/p2nk3/bp2pnQp/4B1p1/3P4/P1N5/1P3PPP/1B1RR1K1 w - - 0 1",
"8/pp2Q1p1/2p3kp/6q1/5n2/1B2R2P/PP1r1PP1/6K1 w - - 0 1",
"k1n3rr/Pp3p2/3q4/3N4/3Pp2p/1Q2P1p1/3B1PP1/R4RK1 w - - 0 1",
"3r4/pp5Q/B7/k7/3q4/2b5/P4PPP/1R4K1 w - - 0 1",
"4Rnk1/pr3ppp/1p3q2/5NQ1/2p5/8/P4PPP/6K1 w - - 0 1",
"4qk2/6p1/p7/1p1Qp3/r1P2b2/1K5P/1P6/4RR2 w - - 0 1",
"3r1rk1/ppqn3p/1npb1P2/5B2/2P5/2N3B1/PP2Q1PP/R5K1 w - - 0 1",
"r3rk2/6b1/q2pQBp1/1NpP4/1n2PP2/nP6/P3N1K1/R6R w - - 0 1",
"r5k1/pp2ppb1/3p4/q3P1QR/6b1/r2B1p2/1PP5/1K4R1 w - - 0 1",
"2b5/3qr2k/5Q1p/P3B3/1PB1PPp1/4K1P1/8/8 w - - 0 1",
"6k1/5pp1/p3p2p/3bP2P/6QN/8/rq4P1/2R4K w - - 0 1",
"N1bk4/pp1p1Qpp/8/2b5/3n3q/8/PPP2RPP/RNB1rBK1 b - - 0 1",
"r3br1k/pp5p/4B1p1/4NpP1/P2Pn3/q1PQ3R/7P/3R2K1 w - - 0 1",
"6kr/pp2r2p/n1p1PB1Q/2q5/2B4P/2N3p1/PPP3P1/7K w - - 0 1",
"2r3r1/7p/b3P2k/p1bp1p1B/P2N1P2/1P4Q1/2P4P/7K w - - 0 1",
"1Q6/1R3pk1/4p2p/p3n3/P3P2P/6PK/r5B1/3q4 b - - 0 1",
"5rk1/1p1n2bp/p7/P2P2p1/4R3/4N1Pb/2QB1q1P/4R2K b - - 0 1",
"1R6/5qpk/4p2p/1Pp1Bp1P/r1n2QP1/5PK1/4P3/8 w - - 0 1",
"4k1r1/pp2bp2/2p5/3PPP2/1q6/7r/1P2Q2P/2RR3K b - - 0 1",
"r1bk1r2/pp1n2pp/3NQ3/1P6/8/2n2PB1/q1B3PP/3R1RK1 w - - 0 1",
"rn3rk1/pp3p2/2b1pnp1/4N3/3q4/P1NB3R/1P1Q1PPP/R5K1 w - - 0 1",
"2kr1b1r/pp3ppp/2p1b2q/4B3/4Q3/2PB2R1/PPP2PPP/3R2K1 w - - 0 1",
"3qrk2/p1r2pp1/1p2pb2/nP1bN2Q/3PN3/P6R/5PPP/R5K1 w - - 0 1",
"5r1k/1p4pp/p2N4/3Qp3/P2n1bP1/5P1q/1PP2R1P/4R2K w - - 0 1",
"6r1/p5bk/4N1pp/2B1p3/4Q2N/8/2P2KPP/q7 w - - 0 1",
"4r1k1/5bpp/2p5/3pr3/8/1B3pPq/PPR2P2/2R2QK1 b - - 0 1",
"5r2/pq4k1/1pp1Qn2/2bp1PB1/3R1R2/2P3P1/P6P/6K1 w - - 0 1",
"r3k3/3b3R/1n1p1b1Q/1p1PpP1N/1P2P1P1/6K1/2B1q3/8 w - - 0 1",
"5qr1/kp2R3/5p2/1b1N1p2/5Q2/P5P1/6BP/6K1 w - - 0 1",
"7k/1p1P1Qpq/p6p/5p1N/6N1/7P/PP1r1PPK/8 w - - 0 1",
"2b3rk/1q3p1p/p1p1pPpQ/4N3/2pP4/2P1p1P1/1P4PK/5R2 w - - 0 1",
"r2qrk2/p5b1/2b1p1Q1/1p1pP3/2p1nB2/2P1P3/PP3P2/2KR3R w - - 0 1",
"r4k2/1pp3q1/3p1NnQ/p3P3/2P3p1/8/PP6/2K4R w - - 0 1",
"r5rk/pp1np1bn/2pp2q1/3P1bN1/2P1N2Q/1P6/PB2PPBP/3R1RK1 w - - 0 1",
"r4n1k/ppBnN1p1/2p1p3/6Np/q2bP1b1/3B4/PPP3PP/R4Q1K w - - 0 1",
"r3nrkq/pp3p1p/2p3nQ/5NN1/8/3BP3/PPP3PP/2KR4 w - - 0 1",
"r3QnR1/1bk5/pp5q/2b5/2p1P3/P7/1BB4P/3R3K w - - 0 1",
"1r4k1/3b2pp/1b1pP2r/pp1P4/4q3/8/PP4RP/2Q2R1K b - - 0 1",
"r2Nqb1r/pQ1bp1pp/1pn1p3/1k1p4/2p2B2/2P5/PPP2PPP/R3KB1R w - - 0 1",
"rq2r1k1/1b3pp1/p3p1n1/1p4BQ/8/7R/PP3PPP/4R1K1 w - - 0 1",
"3q1r2/6k1/p2pQb2/4pR1p/4B3/2P3P1/P4PK1/8 w - - 0 1",
"3R1rk1/1pp2pp1/1p6/8/8/P7/1q4BP/3Q2K1 w - - 0 1",
"rqb2bk1/3n2pr/p1pp2Qp/1p6/3BP2N/2N4P/PPP3P1/2KR3R w - - 0 1",
"5k1r/4npp1/p3p2p/3nP2P/3P3Q/3N4/qB2KPP1/2R5 w - - 0 1",
"r3r1k1/1b6/p1np1ppQ/4n3/4P3/PNB4R/2P1BK1P/1q6 w - - 0 1",
"2Q5/4ppbk/3p4/3P1NPp/4P3/5NB1/5PPK/rq6 w - - 0 1",
"r6k/pb4bp/5Q2/2p1Np2/1qB5/8/P4PPP/4RK2 w - - 0 1",
"3Q4/6kp/4q1p1/2pnN2P/1p3P2/1Pn3P1/6BK/8 w - - 0 1",
"r3q1k1/5p2/3P2pQ/Ppp5/1pnbN2R/8/1P4PP/5R1K w - - 0 1",
"2r2b1k/p2Q3p/b1n2PpP/2p5/3r1BN1/3q2P1/P4PB1/R3R1K1 w - - 0 1",
"r2r2k1/1q2bpB1/pp1p1PBp/8/P7/7Q/1PP3PP/R6K w - - 0 1",
"r3r2k/pb1n3p/1p1q1pp1/4p1B1/2BP3Q/2P1R3/P4PPP/4R1K1 w - - 0 1",
"2rr2k1/1b3p1p/1p1b2p1/p1qP3Q/3R4/1P6/PB3PPP/1B2R1K1 w - - 0 1",
"2r5/3nbkp1/2q1p1p1/1p1n2P1/3P4/2p1P1NQ/1P1B1P2/1B4KR w - - 0 1",
"rnbqr1k1/ppp3p1/4pR1p/4p2Q/3P4/B1PB4/P1P3PP/R5K1 w - - 0 1",
"b3r1k1/p4RbN/P3P1p1/1p6/1qp4P/4Q1P1/5P2/5BK1 w - - 0 1",
"q1r2b1k/rb4np/1p2p2N/pB1n4/6Q1/1P2P3/PB3PPP/2RR2K1 w - - 0 1",
"5rbk/2pq3p/5PQR/p7/3p3R/1P4N1/P5PP/6K1 w - - 0 1",
"2r1k2r/pR2p1bp/2n1P1p1/8/2QP4/q2b1N2/P2B1PPP/4K2R w - - 0 1",
"k2n1q1r/p1pB2p1/P4pP1/1Qp1p3/8/2P1BbN1/P7/2KR4 w - - 0 1",
"4r3/p2r1p1k/3q1Bpp/4P3/1PppR3/P5P1/5P1P/2Q3K1 w - - 0 1",
"2rr1k2/pb4p1/1p1qpp2/4R2Q/3n4/P1N5/1P3PPP/1B2R1K1 w - - 0 1",
"1r2q3/1R6/3p1kp1/1ppBp1b1/p3Pp2/2PP4/PP3P2/5K1Q w - - 0 1",
"5rk1/pp2Rppp/nqp5/8/5Q2/6PB/PPP2P1P/6K1 w - - 0 1",
"r2qk2r/pb4pp/1n2Pb2/2B2Q2/p1p5/2P5/2B2PPP/RN2R1K1 w - - 0 1",
"r1bq3r/ppp1b1kp/2n3p1/3B3Q/3p4/8/PPP2PPP/RNB2RK1 w - - 0 1",
"2q4k/5pNP/p2p1BpP/4p3/1p2b3/1P6/P1r2R2/1K4Q1 w - - 0 1",
"6k1/2rB1p2/RB1p2pb/3Pp2p/4P3/3K2NQ/5Pq1/8 b - - 0 1",
"2bk4/6b1/2pNp3/r1PpP1P1/P1pP1Q2/2rq4/7R/6RK w - - 0 1",
"5bk1/1Q3p2/1Np4p/6p1/8/1P2P1PK/4q2P/8 b - - 0 1",
"5rk1/1p1q2bp/p2pN1p1/2pP2Bn/2P3P1/1P6/P4QKP/5R2 w - - 0 1",
"3r3r/p1pqppbp/1kN3p1/2pnP3/Q5b1/1NP5/PP3PPP/R1B2RK1 w - - 0 1",
"1Q1R4/5k2/6pp/2N1bp2/1Bn5/2P2P1P/1r3PK1/8 b - - 0 1",
"2r1rk2/p1q3pQ/4p3/1pppP1N1/7p/4P2P/PP3P2/1K4R1 w - - 0 1",
"4q3/pb5p/1p2p2k/4N3/PP1QP3/2P2PP1/6K1/8 w - - 0 1",
"2bq1k1r/r5pp/p2b1Pn1/1p1Q4/3P4/1B6/PP3PPP/2R1R1K1 w - - 0 1",
"3r3k/6pp/p3Qn2/P3N3/4q3/2P4P/5PP1/6K1 w - - 0 1",
"6k1/6p1/p5p1/3pB3/1p1b4/2r1q1PP/P4R1K/5Q2 w - - 0 1",
"3r1b2/3P1p2/p3rpkp/2q2N2/5Q1R/2P3BP/P5PK/8 w - - 0 1",
"1q5r/1b1r1p1k/2p1pPpb/p1Pp4/3B1P1Q/1P4P1/P4KB1/2RR4 w - - 0 1",
"4r1rk/pQ2P2p/P7/2pqb3/3p1p2/8/3B2PP/4RRK1 b - - 0 1",
"1r2Rr2/3P1p1k/5Rpp/qp6/2pQ4/7P/5PPK/8 w - - 0 1",
"r1bk2nr/ppp2ppp/3p4/bQ3q2/3p4/B1P5/P3BPPP/RN1KR3 w - - 0 1",
"r4kr1/1b2R1n1/pq4p1/4Q3/1p4P1/5P2/PPP4P/1K2R3 w - - 0 1",
"6k1/5p2/4nQ1P/p4N2/1p1b4/7K/PP3r2/8 w - - 0 1",
"2r2rk1/pp3nbp/2p1bq2/2Pp4/1P1P1PP1/P1NB4/1BQK4/7R w - - 0 1",
"5k2/6r1/p7/2p1P3/1p2Q3/8/1q4PP/3R2K1 w - - 0 1",
"r2q4/pp1rpQbk/3p2p1/2pPP2p/5P2/2N5/PPP2P2/2KR3R w - - 0 1",
"4R3/1p4rk/6p1/2pQBpP1/p1P1pP2/Pq6/1P6/K7 w - - 0 1",
"2b2k2/2p2r1p/p2pR3/1p3PQ1/3q3N/1P6/2P3PP/5K2 w - - 0 1",
"r1b1r3/ppq2pk1/2n1p2p/b7/3PB3/2P2Q2/P2B1PPP/1R3RK1 w - - 0 1",
"2r5/2k4p/1p2pp2/1P2qp2/8/Q5P1/4PP1P/R5K1 w - - 0 1",
"4q1rk/pb2bpnp/2r4Q/1p1p1pP1/4NP2/1P3R2/PBn4P/RB4K1 w - - 0 1",
"2r4k/p4rRp/1p1R3B/5p1q/2Pn4/5p2/PP4QP/1B5K w - - 0 1",
"r1b1kb1r/pp2nppp/2pQ4/8/2q1P3/8/P1PB1PPP/3RK2R w - - 0 1",
"2r1b3/1pp1qrk1/p1n1P1p1/7R/2B1p3/4Q1P1/PP3PP1/3R2K1 w - - 0 1",
"5rk1/pbppq1bN/1pn1p1Q1/6N1/3P4/8/PPP2PP1/2K4R w - - 0 1",
"qn1r1k2/2r1b1np/pp1pQ1p1/3P2P1/1PP2P2/7R/PB4BP/4R1K1 w - - 0 1",
"r2r4/1p1bn2p/pn2ppkB/5p2/4PQN1/6P1/PPq2PBP/R2R2K1 w - - 0 1",
"3k1r2/2pb4/2p3P1/2Np1p2/1P6/4nN1R/2P1q3/Q5K1 w - - 0 1",
"5rk1/ppp3pp/8/3pQ3/3P2b1/5rPq/PP1P1P2/R1BB1RK1 b - - 0 1",
"r6r/1p2pp1k/p1b2q1p/4pP2/6QR/3B2P1/P1P2K2/7R w - - 0 1",
"2k4r/ppp2p2/2b2B2/7p/6pP/2P1q1bP/PP3N2/R4QK1 b - - 0 1",
"2QR4/6b1/1p4pk/7p/5n1P/4rq2/5P2/5BK1 w - - 0 1",
"rnb2b1r/p3kBp1/3pNn1p/2pQN3/1p2PP2/4B3/Pq5P/4K3 w - - 0 1",
"2rq1n1Q/p1r2k2/2p1p1p1/1p1pP3/3P2p1/2N4R/PPP2P2/2K4R w - - 0 1",
"r2Q1q1k/pp5r/4B1p1/5p2/P7/4P2R/7P/1R4K1 w - - 0 1",
"3k4/2p1q1p1/8/1QPPp2p/4Pp2/7P/6P1/7K w - - 0 1",
"8/1p3Qb1/p5pk/P1p1p1p1/1P2P1P1/2P1N2n/5P1P/4qB1K w - - 0 1",
"1r3k2/3Rnp2/6p1/6q1/p1BQ1p2/P1P5/1P3PP1/6K1 w - - 0 1",
"2rn2k1/1q1N1pbp/4pB1P/pp1pPn2/3P4/1Pr2N2/P2Q1P1K/6R1 w - - 0 1",
"5k2/p2Q1pp1/1b5p/1p2PB1P/2p2P2/8/PP3qPK/8 w - - 0 1",
"r3kb1r/pb6/2p2p1p/1p2pq2/2pQ3p/2N2B2/PP3PPP/3RR1K1 w - - 0 1",
"r1b1kb1r/pp1n1pp1/1qp1p2p/6B1/2PPQ3/3B1N2/P4PPP/R4RK1 w - - 0 1",
"rn3k1r/pbpp1Bbp/1p4pN/4P1B1/3n4/2q3Q1/PPP2PPP/2KR3R w - - 0 1",
"3R4/p1r3rk/1q2P1p1/5p1p/1n6/1B5P/P2Q2P1/3R3K w - - 0 1",
"8/6bk/1p6/5pBp/1P2b3/6QP/P5PK/5q2 b - - 0 1",
"r1bqkb2/6p1/p1p4p/1p1N4/8/1B3Q2/PP3PPP/3R2K1 w - - 0 1",
"5rrk/5pb1/p1pN3p/7Q/1p2PP1R/1q5P/6P1/6RK w - - 0 1",
"rnbq1bnr/pp1p1p1p/3pk3/3NP1p1/5p2/5N2/PPP1Q1PP/R1B1KB1R w - - 0 1",
"1r3rk1/1pnnq1bR/p1pp2B1/P2P1p2/1PP1pP2/2B3P1/5PK1/2Q4R w - - 0 1",
"2Q5/1p3p2/3b1k1p/3Pp3/4B1R1/4q1P1/r4PK1/8 w - - 0 1",
"r1b3kr/ppp1Bp1p/1b6/n2P4/2p3q1/2Q2N2/P4PPP/RN2R1K1 w - - 0 1",
"1R1br1k1/pR5p/2p3pB/2p2P2/P1qp2Q1/2n4P/P5P1/6K1 w - - 0 1",
"r1b2n2/2q3rk/p3p2n/1p3p1P/4N3/PN1B1P2/1PPQ4/2K3R1 w - - 0 1",
"r3q3/ppp3k1/3p3R/5b2/2PR3Q/2P1PrP1/P7/4K3 w - - 0 1",
"2r3k1/3b2b1/5pp1/3P4/pB2P3/2NnqN2/1P2B2Q/5K1R b - - 0 1",
"6rk/2p2p1p/p2q1p1Q/2p1pP2/1nP1R3/1P5P/P5P1/2B3K1 w - - 0 1",
"1r2bk2/1p3ppp/p1n2q2/2N5/1P6/P3R1P1/5PBP/4Q1K1 w - - 0 1",
"r3rk2/5pn1/pb1nq1pR/1p2p1P1/2p1P3/2P2QN1/PPBB1P2/2K4R w - - 0 1",
"3rkq1r/1pQ2p1p/p3bPp1/3pR3/8/8/PPP2PP1/1K1R4 w - - 0 1",
"r1bq3r/ppp1nQ2/2kp1N2/6N1/3bP3/8/P2n1PPP/1R3RK1 w - - 0 1",
"n2q1r1k/4bp1p/4p3/4P1p1/2pPNQ2/2p4R/5PPP/2B3K1 w - - 0 1",
"2Rr1qk1/5ppp/p2N4/P7/5Q2/8/1r4PP/5BK1 w - - 0 1",
"8/6k1/3p1rp1/3Bp1p1/1pP1P1K1/4bPR1/P5Q1/4q3 b - - 0 1",
"r1bq2rk/pp3pbp/2p1p1pQ/7P/3P4/2PB1N2/PP3PPR/2KR4 w - - 0 1",
"5qr1/pr3p1k/1n1p2p1/2pPpP1p/P3P2Q/2P1BP1R/7P/6RK w - - 0 1",
"rn2kb1r/pp2pp1p/2p2p2/8/8/3Q1N2/qPPB1PPP/2KR3R w - - 0 1",
"7k/pb4rp/2qp1Q2/1p3pP1/np3P2/3PrN1R/P1P4P/R3N1K1 w - - 0 1",
"8/p4pk1/6p1/3R4/3nqN1P/2Q3P1/5P2/3r1BK1 b - - 0 1",
"r3rk2/p3bp2/2p1qB2/1p1nP1RP/3P4/2PQ4/P5P1/5RK1 w - - 0 1",
"6k1/pp3ppp/4p3/2P3b1/bPP3P1/3K4/P3Q1q1/1R5R b - - 0 1",
"r1b2rk1/p1qnbp1p/2p3p1/2pp3Q/4pP2/1P1BP1R1/PBPP2PP/RN4K1 w - - 0 1",
"3r4/p4Q1p/1p2P2k/2p3pq/2P2B2/1P2p2P/P5P1/6K1 w - - 0 1",
"6k1/8/3q1p2/p5p1/P1b1P2p/R1Q4P/5KN1/3r4 b - - 0 1",
];

},{}],9:[function(require,module,exports){
module.exports = [
"r4r1k/p2p3p/bp1Np3/4P3/2P2nR1/3B1q2/P1PQ4/2K3R1 w - - 0 1",
"3r2k1/p1p2p2/bp2p1nQ/4PB1P/2pr3q/6R1/PP3PP1/3R2K1 w - - 0 1",
"2r3k1/p6R/1p2p1p1/nK4N1/P4P2/3n4/4r1P1/7R b - - 0 1",
"N1bk4/pp1p1Qpp/8/2b5/3n3q/8/PPP2RPP/RNB1rBK1 b - - 0 1",
"5rk1/1p1n2bp/p7/P2P2p1/4R3/4N1Pb/2QB1q1P/4R2K b - - 0 1",
"4k1r1/pp2bp2/2p5/3PPP2/1q6/7r/1P2Q2P/2RR3K b - - 0 1",
"8/4R1pk/p5p1/8/1pB1n1b1/1P2b1P1/P4r1P/5R1K b - - 0 1",
"2kr1b1r/pp3ppp/2p1b2q/4B3/4Q3/2PB2R1/PPP2PPP/3R2K1 w - - 0 1",
"r3k3/3b3R/1n1p1b1Q/1p1PpP1N/1P2P1P1/6K1/2B1q3/8 w - - 0 1",
"r3QnR1/1bk5/pp5q/2b5/2p1P3/P7/1BB4P/3R3K w - - 0 1",
"1r4k1/3b2pp/1b1pP2r/pp1P4/4q3/8/PP4RP/2Q2R1K b - - 0 1",
"2r2b1k/p2Q3p/b1n2PpP/2p5/3r1BN1/3q2P1/P4PB1/R3R1K1 w - - 0 1",
"r4R2/1b2n1pp/p2Np1k1/1pn5/4pP1P/8/PPP1B1P1/2K4R w - - 0 1",
"b3r1k1/p4RbN/P3P1p1/1p6/1qp4P/4Q1P1/5P2/5BK1 w - - 0 1",
"q1r2b1k/rb4np/1p2p2N/pB1n4/6Q1/1P2P3/PB3PPP/2RR2K1 w - - 0 1",
"2r1k2r/pR2p1bp/2n1P1p1/8/2QP4/q2b1N2/P2B1PPP/4K2R w - - 0 1",
"1k5r/3R1pbp/1B2p3/2NpPn2/5p2/8/1PP3PP/6K1 w - - 0 1",
"2rr1k2/pb4p1/1p1qpp2/4R2Q/3n4/P1N5/1P3PPP/1B2R1K1 w - - 0 1",
"2q4k/5pNP/p2p1BpP/4p3/1p2b3/1P6/P1r2R2/1K4Q1 w - - 0 1",
"6k1/2rB1p2/RB1p2pb/3Pp2p/4P3/3K2NQ/5Pq1/8 b - - 0 1",
"5rk1/1p1q2bp/p2pN1p1/2pP2Bn/2P3P1/1P6/P4QKP/5R2 w - - 0 1",
"3rk2b/5R1P/6B1/8/1P3pN1/7P/P2pbP2/6K1 w - - 0 1",
"2bq1k1r/r5pp/p2b1Pn1/1p1Q4/3P4/1B6/PP3PPP/2R1R1K1 w - - 0 1",
"4B3/6R1/1p5k/p2r3N/Pn1p2P1/7P/1P3P2/6K1 w - - 0 1",
"1r2Rr2/3P1p1k/5Rpp/qp6/2pQ4/7P/5PPK/8 w - - 0 1",
"r4kr1/1b2R1n1/pq4p1/4Q3/1p4P1/5P2/PPP4P/1K2R3 w - - 0 1",
"2b2k2/2p2r1p/p2pR3/1p3PQ1/3q3N/1P6/2P3PP/5K2 w - - 0 1",
"4q1rk/pb2bpnp/2r4Q/1p1p1pP1/4NP2/1P3R2/PBn4P/RB4K1 w - - 0 1",
"2r4k/p4rRp/1p1R3B/5p1q/2Pn4/5p2/PP4QP/1B5K w - - 0 1",
"r2r4/1p1bn2p/pn2ppkB/5p2/4PQN1/6P1/PPq2PBP/R2R2K1 w - - 0 1",
"5r1k/7b/4B3/6K1/3R1N2/8/8/8 w - - 0 1",
"r5nr/6Rp/p1NNkp2/1p3b2/2p5/5K2/PP2P3/3R4 w - - 0 1",
"1r3k2/3Rnp2/6p1/6q1/p1BQ1p2/P1P5/1P3PP1/6K1 w - - 0 1",
"2rn2k1/1q1N1pbp/4pB1P/pp1pPn2/3P4/1Pr2N2/P2Q1P1K/6R1 w - - 0 1",
"3R4/p1r3rk/1q2P1p1/5p1p/1n6/1B5P/P2Q2P1/3R3K w - - 0 1",
"r1b2n2/2q3rk/p3p2n/1p3p1P/4N3/PN1B1P2/1PPQ4/2K3R1 w - - 0 1",
"r3q3/ppp3k1/3p3R/5b2/2PR3Q/2P1PrP1/P7/4K3 w - - 0 1",
"1r2bk2/1p3ppp/p1n2q2/2N5/1P6/P3R1P1/5PBP/4Q1K1 w - - 0 1",
"2Rr1qk1/5ppp/p2N4/P7/5Q2/8/1r4PP/5BK1 w - - 0 1",
"7k/pb4rp/2qp1Q2/1p3pP1/np3P2/3PrN1R/P1P4P/R3N1K1 w - - 0 1",
"8/p4pk1/6p1/3R4/3nqN1P/2Q3P1/5P2/3r1BK1 b - - 0 1",
"4r3/pbpn2n1/1p1prp1k/8/2PP2PB/P5N1/2B2R1P/R5K1 w - - 0 1",
"r4r1k/pp1b2pn/8/3pR3/5N2/3Q4/Pq3PPP/5RK1 w - - 0 1",
"1r2r1k1/5p2/5Rp1/4Q2p/P2B2qP/1NP5/1KP5/8 w - - 0 1",
"1r3rk1/1nqb2n1/6R1/1p1Pp3/1Pp3p1/2P4P/2B2QP1/2B2RK1 w - - 0 1",
"r7/1p3Q2/2kpr2p/p1p2Rp1/P3Pp2/1P3P2/1B2q1PP/3R3K w - - 0 1",
"1r3r2/1p5R/p1n2pp1/1n1B1Pk1/8/8/P1P2BPP/2K1R3 w - - 0 1",
"4k2r/1R3R2/p3p1pp/4b3/1BnNr3/8/P1P5/5K2 w - - 0 1",
"5q2/1ppr1br1/1p1p1knR/1N4R1/P1P1PP2/1P6/2P4Q/2K5 w - - 0 1",
"7k/3qbR1n/r5p1/3Bp1P1/1p1pP1r1/3P2Q1/1P5K/2R5 w - - 0 1",
"4n3/pbq2rk1/1p3pN1/8/2p2Q2/Pn4N1/B4PP1/4R1K1 w - - 0 1",
"8/1p2p1kp/2rRB3/pq2n1Pp/4P3/8/PPP2Q2/2K5 w - - 0 1",
"3r1rk1/1q2b1n1/p1b1pRpQ/1p2P3/3BN3/P1PB4/1P4PP/4R2K w - - 0 1",
"2b2r1k/1p2R3/2n2r1p/p1P1N1p1/2B3P1/P6P/1P3R2/6K1 w - - 0 1",
"1qr2bk1/pb3pp1/1pn3np/3N2NQ/8/P7/BP3PPP/2B1R1K1 w - - 0 1",
"2rk4/5R2/3pp1Q1/pb2q2N/1p2P3/8/PPr5/1K1R4 w - - 0 1",
"r4r1k/pp4R1/3pN1p1/3P2Qp/1q2Ppn1/8/6PP/5RK1 w - - 0 1",
"r2r1b1k/pR6/6pp/5Q2/3qB3/6P1/P3PP1P/6K1 w - - 0 1",
"r3rknQ/1p1R1pb1/p3pqBB/2p5/8/6P1/PPP2P1P/4R1K1 w - - 0 1",
"3rb1k1/ppq3p1/2p1p1p1/6P1/2Pr3R/1P1Q4/P1B4P/5RK1 w - - 0 1",
"5rk1/1bR2pbp/4p1p1/8/1p1P1PPq/1B2P2r/P2NQ2P/5RK1 b - - 0 1",
"3q1rk1/4bp1p/1n2P2Q/1p1p1p2/6r1/Pp2R2N/1B1P2PP/7K w - - 0 1",
"3nk1r1/1pq4p/p3PQpB/5p2/2r5/8/P4PPP/3RR1K1 w - - 0 1",
"6rk/5p1p/5p2/1p2bP2/1P2R2Q/2q1BBPP/5PK1/r7 w - - 0 1",
"1b4rk/4R1pp/p1b4r/2PB4/Pp1Q4/6Pq/1P3P1P/4RNK1 w - - 0 1",
"Q4R2/3kr3/1q3n1p/2p1p1p1/1p1bP1P1/1B1P3P/2PBK3/8 w - - 0 1",
"2rk2r1/3b3R/n3pRB1/p2pP1P1/3N4/1Pp5/P1K4P/8 w - - 0 1",
"2r5/2R5/3npkpp/3bN3/p4PP1/4K3/P1B4P/8 w - - 0 1",
"r2qr2k/pp1b3p/2nQ4/2pB1p1P/3n1PpR/2NP2P1/PPP5/2K1R1N1 w - - 0 1",
"1r3r1k/2R4p/q4ppP/3PpQ2/2RbP3/pP6/P2B2P1/1K6 w - - 0 1",
"2r3k1/pp3ppp/1qr2n2/3p1Q2/1P6/P2BP2P/5PP1/2R2RK1 w - - 0 1",
"5k2/p3Rr2/1p4pp/q4p2/1nbQ1P2/6P1/5N1P/3R2K1 w - - 0 1",
"r3r3/3R1Qp1/pqb1p2k/1p4N1/8/4P3/Pb3PPP/2R3K1 w - - 0 1",
"8/4k3/1p2p1p1/pP1pPnP1/P1rPq2p/1KP2R1N/8/5Q2 b - - 0 1",
"2q3k1/1p4pp/3R1r2/p2bQ3/P7/1N2B3/1PP3rP/R3K3 b - - 0 1",
"4rk2/5p1b/1p3R1K/p6p/2P2P2/1P6/2q4P/Q5R1 w - - 0 1",
"2r2bk1/2qn1ppp/pn1p4/5N2/N3r3/1Q6/5PPP/BR3BK1 w - - 0 1",
"6k1/pp3r2/2p4q/3p2p1/3Pp1b1/4P1P1/PP4RP/2Q1RrNK b - - 0 1",
"r5kr/pppN1pp1/1bn1R3/1q1N2Bp/3p2Q1/8/PPP2PPP/R5K1 w - - 0 1",
"1q1r1k2/1b2Rpp1/p1pQ3p/PpPp4/3P1NP1/1P3P1P/6K1/8 w - - 0 1",
"4r3/2RN4/p1r5/1k1p4/5Bp1/p2P4/1P4PK/8 w - - 0 1",
"r2Rnk1r/1p2q1b1/7p/6pQ/4Ppb1/1BP5/PP3BPP/2K4R w - - 0 1",
"r3n1k1/pb5p/4N1p1/2pr4/q7/3B3P/1P1Q1PP1/2B1R1K1 w - - 0 1",
"6k1/5p2/3P1Bpp/2b1P3/b1p2p2/p1P5/R5rP/2N1K3 b - - 0 1",
"r5rR/3Nkp2/4p3/1Q4q1/np1N4/8/bPPR2P1/2K5 w - - 0 1",
"6k1/1p2q2p/p3P1pB/8/1P2p3/2Qr2P1/P4P1P/2R3K1 w - - 0 1",
"4R3/2p2kpQ/3p3p/p2r2q1/8/1Pr2P2/P1P3PP/4R1K1 w - - 0 1",
"8/2k2r2/pp6/2p1R1Np/6pn/8/Pr4B1/3R3K w - - 0 1",
"5R2/4r1r1/1p4k1/p1pB2Bp/P1P4K/2P1p3/1P6/8 w - - 0 1",
"6k1/ppp2ppp/8/2n2K1P/2P2P1P/2Bpr3/PP4r1/4RR2 b - - 0 1",
"2qr2k1/4rppN/ppnp4/2pR3Q/2P2P2/1P4P1/PB5P/6K1 w - - 0 1",
"3R4/3Q1p2/q1rn2kp/4p3/4P3/2N3P1/5P1P/6K1 w - - 0 1",
"4kr2/3rn2p/1P4p1/2p5/Q1B2P2/8/P2q2PP/4R1K1 w - - 0 1",
"3q3r/r4pk1/pp2pNp1/3bP1Q1/7R/8/PP3PPP/3R2K1 w - - 0 1",
"rnb3kr/ppp4p/3b3B/3Pp2n/2BP4/4KRp1/PPP3q1/RN1Q4 w - - 0 1",
"r1kq1b1r/5ppp/p4n2/2pPR1B1/Q7/2P5/P4PPP/1R4K1 w - - 0 1",
"2r5/2p2k1p/pqp1RB2/2r5/PbQ2N2/1P3PP1/2P3P1/4R2K w - - 0 1",
"6k1/5p2/R5p1/P6n/8/5PPp/2r3rP/R4N1K b - - 0 1",
"r3kr2/6Qp/1Pb2p2/pB3R2/3pq2B/4n3/1P4PP/4R1K1 w - - 0 1",
"5rk1/n1p1R1bp/p2p4/1qpP1QB1/7P/2P3P1/PP3P2/6K1 w - - 0 1",
"2rrk3/QR3pp1/2n1b2p/1BB1q3/3P4/8/P4PPP/6K1 w - - 0 1",
"2q1b1k1/p5pp/n2R4/1p2P3/2p5/B1P5/5QPP/6K1 w - - 0 1",
"b4rk1/6p1/4p1N1/q3P1Q1/1p1R4/1P5r/P4P2/3R2K1 w - - 0 1",
"6k1/1p5p/p2p1q2/3Pb3/1Q2P3/3b1BpP/PPr3P1/KRN5 b - - 0 1",
"5Q2/1p3p1N/2p3p1/5b1k/2P3n1/P4RP1/3q2rP/5R1K w - - 0 1",
"6k1/1r4np/pp1p1R1B/2pP2p1/P1P5/1n5P/6P1/4R2K w - - 0 1",
"R4rk1/4r1p1/1q2p1Qp/1pb5/1n5R/5NB1/1P3PPP/6K1 w - - 0 1",
"8/p1p5/2p3k1/2b1rpB1/7K/2P3PP/P1P2r2/3R3R b - - 0 1",
"r1b2rk1/1p2nppp/p2R1b2/4qP1Q/4P3/1B2B3/PPP2P1P/2K3R1 w - - 0 1",
"7k/p1p2bp1/3q1N1p/4rP2/4pQ2/2P4R/P2r2PP/4R2K w - - 0 1",
"6k1/4R3/p5q1/2pP1Q2/3bn1r1/P7/6PP/5R1K b - - 0 1",
"r5k1/3npp1p/2b3p1/1pn5/2pRP3/2P1BPP1/r1P4P/1NKR1B2 b - - 0 1",
"5rk1/3p1p1p/p4Qq1/1p1P2R1/7N/n6P/2r3PK/8 w - - 0 1",
"5r1k/1p1b1p1p/p2ppb2/5P1B/1q6/1Pr3R1/2PQ2PP/5R1K w - - 0 1",
"5r2/pp2R3/1q1p3Q/2pP1b2/2Pkrp2/3B4/PPK2PP1/R7 w - - 0 1",
"5b2/pp2r1pk/2pp1R1p/4rP1N/2P1P3/1P4Q1/P3q1PP/5R1K w - - 0 1",
"5n1k/rq4rp/p1bp1b2/2p1pP1Q/P1B1P2R/2N3R1/1P4PP/6K1 w - - 0 1",
"2rkr3/3b1p1R/3R1P2/1p2Q1P1/pPq5/P1N5/1KP5/8 w - - 0 1",
"1rbk1r2/pp4R1/3Np3/3p2p1/6q1/BP2P3/P2P2B1/2R3K1 w - - 0 1",
"6k1/5p2/p3bRpQ/4q3/2r3P1/6NP/P1p2R1K/1r6 w - - 0 1",
"r1qr3k/3R2p1/p3Q3/1p2p1p1/3bN3/8/PP3PPP/5RK1 w - - 0 1",
"5rk1/pb2npp1/1pq4p/5p2/5B2/1B6/P2RQ1PP/2r1R2K b - - 0 1",
"r4br1/3b1kpp/1q1P4/1pp1RP1N/p7/6Q1/PPB3PP/2KR4 w - - 0 1",
"r3Rnkr/1b5p/p3NpB1/3p4/1p6/8/PPP3P1/2K2R2 w - - 0 1",
"2r3k1/p4p2/1p2P1pQ/3bR2p/1q6/1B6/PP2RPr1/5K2 w - - 0 1",
"2r5/1Nr1kpRp/p3b3/N3p3/1P3n2/P7/5PPP/K6R b - - 0 1",
"2r4k/ppqbpQ1p/3p1bpB/8/8/1Nr2P2/PPP3P1/2KR3R w - - 0 1",
"r1br2k1/4p1b1/pq2pn2/1p4N1/7Q/3B4/PPP3PP/R4R1K w - - 0 1",
"1r1kr3/Nbppn1pp/1b6/8/6Q1/3B1P2/Pq3P1P/3RR1K1 w - - 0 1",
"n7/pk3pp1/1rR3p1/QP1pq3/4n3/6PB/4PP1P/2R3K1 w - - 0 1",
"6k1/pp4p1/2p5/2bp4/8/P5Pb/1P3rrP/2BRRN1K b - - 0 1",
"3b2r1/5Rn1/2qP2pk/p1p1B3/2P1N3/1P3Q2/6K1/8 w - - 0 1",
"2r1rk2/1p2qp1R/4p1p1/1b1pP1N1/p2P4/nBP1Q3/P4PPP/R5K1 w - - 0 1",
"2r3k1/1p3ppp/p3p3/7P/P4P2/1R2QbP1/6q1/1B2K3 b - - 0 1",
"k2r3r/p3Rppp/1p4q1/1P1b4/3Q1B2/6N1/PP3PPP/6K1 w - - 0 1",
"4rk1r/p2b1pp1/1q5p/3pR1n1/3N1p2/1P1Q1P2/PBP3PK/4R3 w - - 0 1",
"R6R/2kr4/1p3pb1/3prN2/6P1/2P2K2/1P6/8 w - - 0 1",
"r5k1/2Rb3r/p2p3b/P2Pp3/4P1pq/5p2/1PQ2B1P/2R2BKN b - - 0 1",
"1k6/5Q2/2Rr2pp/pqP5/1p6/7P/2P3PK/4r3 w - - 0 1",
"1q2r3/k4p2/prQ2b1p/R7/1PP1B1p1/6P1/P5K1/8 w - - 0 1",
"2k4r/pp3pQ1/2q5/2n5/8/N3pPP1/P3r3/R1R3K1 b - - 0 1",
"4r1k1/1p3q1p/p1pQ4/2P1R1p1/5n2/2B5/PP5P/6K1 b - - 0 1",
"4r1k1/pR3pp1/1n3P1p/q2p4/5N1P/P1rQpP2/8/2B2RK1 w - - 0 1",
"1R4nr/p1k1ppb1/2p4p/4Pp2/3N1P1B/8/q1P3PP/3Q2K1 w - - 0 1",
"2R2bk1/5rr1/p3Q2R/3Ppq2/1p3p2/8/PP1B2PP/7K w - - 0 1",
"3r3k/pp4p1/3qQp1p/P1p5/7R/3rN1PP/1B3P2/6K1 w - - 0 1",
"kr6/pR5R/1q1pp3/8/1Q6/2P5/PKP5/5r2 w - - 0 1",
"4r1k1/5ppp/p2p4/4r3/1pNn4/1P6/1PPK2PP/R3R3 b - - 0 1",
"7k/pbp3bp/3p4/1p5q/3n2p1/5rB1/PP1NrN1P/1Q1BRRK1 b - - 0 1",
"r3r3/ppp4p/2bq2Nk/8/1PP5/P1B3Q1/6PP/4R1K1 w - - 0 1",
"4r1k1/3N1ppp/3r4/8/1n3p1P/5P2/PP3K1P/RN5R b - - 0 1",
"4rk2/2pQ1p2/2p2B2/2P1P2q/1b4R1/1P6/r5PP/2R3K1 w - - 0 1",
"3r2k1/6pp/1nQ1R3/3r4/3N2q1/6N1/n4PPP/4R1K1 w - - 0 1",
"b1r3k1/pq2b1r1/1p3R1p/5Q2/2P5/P4N1P/5PP1/1B2R1K1 w - - 0 1",
"2R1R1nk/1p4rp/p1n5/3N2p1/1P6/2P5/P6P/2K5 w - - 0 1",
"n3r1k1/Q4R1p/p5pb/1p2p1N1/1q2P3/1P4PB/2P3KP/8 w - - 0 1",
"4r1k1/5q2/p5pQ/3b1pB1/2pP4/2P3P1/1P2R1PK/8 w - - 0 1",
"6k1/pp3p2/2p2np1/2P1pbqp/P3P3/2N2nP1/2Pr1P2/1RQ1RB1K b - - 0 1",
"2r3k1/pb3ppp/8/qP2b3/8/1P6/1P1RQPPP/1K3B1R b - - 0 1",
"r3rn1k/4b1Rp/pp1p2pB/3Pp3/P2qB1Q1/8/2P3PP/5R1K w - - 0 1",
"rnb2r1k/pp2q2p/2p2R2/8/2Bp3Q/8/PPP3PP/RN4K1 w - - 0 1",
"3k4/1pp3b1/4b2p/1p3qp1/3Pn3/2P1RN2/r5P1/1Q2R1K1 b - - 0 1",
"2kr3r/1p3ppp/p3pn2/2b1B2q/Q1N5/2P5/PP3PPP/R2R2K1 w - - 0 1",
"5q1k/p3R1rp/2pr2p1/1pN2bP1/3Q1P2/1B6/PP5P/2K5 w - - 0 1",
"8/7p/5pk1/3n2pq/3N1nR1/1P3P2/P6P/4QK2 w - - 0 1",
"4r2R/3q1kbR/1p4p1/p1pP1pP1/P1P2P2/K5Q1/1P2p3/8 w - - 0 1",
"rn3k2/pR2b3/4p1Q1/2q1N2P/3R2P1/3K4/P3Br2/8 w - - 0 1",
"2q5/p3p2k/3pP1p1/2rN2Pn/1p1Q4/7R/PPr5/1K5R w - - 0 1",
"b5r1/2r5/2pk4/2N1R1p1/1P4P1/4K2p/4P2P/R7 w - - 0 1",
"6k1/p1p3pp/6q1/3pr3/3Nn3/1QP1B1Pb/PP3r1P/R3R1K1 b - - 0 1",
"4r1r1/pb1Q2bp/1p1Rnkp1/5p2/2P1P3/4BP2/qP2B1PP/2R3K1 w - - 0 1",
"1k3r2/4R1Q1/p2q1r2/8/2p1Bb2/5R2/pP5P/K7 w - - 0 1",
"3r4/1p6/2p4p/5k2/p1P1n2P/3NK1nN/P1r5/1R2R3 b - - 0 1",
"r1b3nr/ppp1kB1p/3p4/8/3PPBnb/1Q3p2/PPP2q2/RN4RK b - - 0 1",
"6k1/p2rR1p1/1p1r1p1R/3P4/4QPq1/1P6/P5PK/8 w - - 0 1",
"3r1b1k/1p3R2/7p/2p4N/p4P2/2K3R1/PP6/3r4 w - - 0 1",
"8/6R1/p2kp2r/qb5P/3p1N1Q/1p1Pr3/PP6/1K5R w - - 0 1",
"8/4k3/P4RR1/2b1r3/3n2Pp/8/5KP1/8 b - - 0 1",
"r2q1bk1/5n1p/2p3pP/p7/3Br3/1P3PQR/P5P1/2KR4 w - - 0 1",
"1Q6/r3R2p/k2p2pP/p1q5/Pp4P1/5P2/1PP3K1/8 w - - 0 1",
"6k1/6pp/pp1p3q/3P4/P1Q2b2/1NN1r2b/1PP4P/6RK b - - 0 1",
"3r2k1/6p1/3Np2p/2P1P3/1p2Q1Pb/1P3R1P/1qr5/5RK1 w - - 0 1",
"1r2k3/2pn1p2/p1Qb3p/7q/3PP3/2P1BN1b/PP1N1Pr1/RR5K b - - 0 1",
"3r1k1r/p1q2p2/1pp2N1p/n3RQ2/3P4/2p1PR2/PP4PP/6K1 w - - 0 1",
"r3n2R/pp2n3/3p1kp1/1q1Pp1N1/6P1/2P1BP2/PP6/2KR4 w - - 0 1",
"2R2bk1/r4ppp/3pp3/1B2n1P1/3QP2P/5P2/1PK5/7q w - - 0 1",
"3nbr2/4q2p/r3pRpk/p2pQRN1/1ppP2p1/2P5/PPB4P/6K1 w - - 0 1",
"7k/p5b1/1p4Bp/2q1p1p1/1P1n1r2/P2Q2N1/6P1/3R2K1 b - - 0 1",
"5k2/ppqrRB2/3r1p2/2p2p2/7P/P1PP2P1/1P2QP2/6K1 w - - 0 1",
"4r3/5kp1/1N1p4/2pR1q1p/8/pP3PP1/6K1/3Qr3 b - - 0 1",
"1k2r3/pp6/3b4/3P2Q1/8/6P1/PP3q1P/2R4K b - - 0 1",
"2kr3r/R4Q2/1pq1n3/7p/3R1B1P/2p3P1/2P2P2/6K1 w - - 0 1",
"2rq2k1/3bb2p/n2p2pQ/p2Pp3/2P1N1P1/1P5P/6B1/2B2R1K w - - 0 1",
"r2q3k/ppb3pp/2p1B3/2P1RQ2/8/6P1/PP1r3P/5RK1 w - - 0 1",
"3k4/1p3Bp1/p5r1/2b5/P3P1N1/5Pp1/1P1r4/2R4K b - - 0 1",
"k7/4rp1p/p1q3p1/Q1r2p2/1R6/8/P5PP/1R5K w - - 0 1",
"5rk1/1R4b1/3p4/1P1P4/4Pp2/3B1Pnb/PqRK1Q2/8 b - - 0 1",
"7k/1p4p1/p4b1p/3N3P/2p5/2rb4/PP2r3/K2R2R1 b - - 0 1",
"r1qb1rk1/3R1pp1/p1nR2p1/1p2p2N/6Q1/2P1B3/PP3PPP/6K1 w - - 0 1",
"3r1rk1/2qP1p2/p2R2pp/6b1/6P1/2pQR2P/P1B2P2/6K1 w - - 0 1",
"1R2R3/p1r2pk1/3b1pp1/8/2Pr4/4N1P1/P4PK1/8 w - - 0 1",
"r2k2nr/pp1b1Q1p/2n4b/3N4/3q4/3P4/PPP3PP/4RR1K w - - 0 1",
"r4rk1/3R3p/1q2pQp1/p7/P7/8/1P5P/4RK2 w - - 0 1",
"r6k/1p5p/2p1b1pB/7B/p1P1q2r/8/P5QP/3R2RK b - - 0 1",
"4r1k1/1R4bp/pB2p1p1/P4p2/2r1pP1Q/2P4P/1q4P1/3R3K w - - 0 1",
"6k1/6p1/3r1n1p/p4p1n/P1N4P/2N5/Q2RK3/7q b - - 0 1",
"8/1R4pp/k2rQp2/2p2P2/p2q1P2/1n1r2P1/6BP/4R2K w - - 0 1",
"4R3/p2r1q1k/5B1P/6P1/2p4K/3b4/4Q3/8 w - - 0 1",
"4n3/p3N1rk/5Q2/2q4p/2p5/1P3P1P/P1P2P2/6RK w - - 0 1",
"rr4Rb/2pnqb1k/np1p1p1B/3PpP2/p1P1P2P/2N3R1/PP2BP2/1KQ5 w - - 0 1",
"r1bq2rk/pp1n1p1p/5P1Q/1B3p2/3B3b/P5R1/2P3PP/3K3R w - - 0 1",
"q5k1/1b2R1pp/1p3n2/4BQ2/8/7P/5PPK/4r3 w - - 0 1",
"3r4/1nb1kp2/p1p2N2/1p2pPr1/8/1BP2P2/PP1R4/2KR4 w - - 0 1",
"7R/3Q2p1/2p2nk1/pp4P1/3P2r1/2P5/4q3/5R1K w - - 0 1",
"3q2r1/p2b1k2/1pnBp1N1/3p1pQP/6P1/5R2/2r2P2/4RK2 w - - 0 1",
"k7/1p1rr1pp/pR1p1p2/Q1pq4/P7/8/2P3PP/1R4K1 w - - 0 1",
"4kb1r/1R6/p2rp3/2Q1p1q1/4p3/3B4/P6P/4KR2 w - - 0 1",
"1r3r1k/qp5p/3N4/3p2Q1/p6P/P7/1b6/1KR3R1 w - - 0 1",
"r4kr1/pbNn1q1p/1p6/2p2BPQ/5B2/8/P6P/b4RK1 w - - 0 1",
"3r3k/7p/pp2B1p1/3N2P1/P2qPQ2/8/1Pr4P/5R1K w - - 0 1",
"3q1r2/pb3pp1/1p6/3pP1Nk/2r2Q2/8/Pn3PP1/3RR1K1 w - - 0 1",
"1k1r4/pp5R/2p5/P5p1/7b/4Pq2/1PQ2P2/3NK3 b - - 0 1",
"6R1/2k2P2/1n5r/3p1p2/3P3b/1QP2p1q/3R4/6K1 b - - 0 1",
"1k1r4/1p5p/1P3pp1/b7/P3K3/1B3rP1/2N1bP1P/RR6 b - - 0 1",
"3r2k1/3q2p1/1b3p1p/4p3/p1R1P2N/Pr5P/1PQ3P1/5R1K b - - 0 1",
"2b3k1/r3q2p/4p1pB/p4r2/4N3/P1Q5/1P4PP/2R2R1K w - - 0 1",
"r5r1/p1q2p1k/1p1R2pB/3pP3/6bQ/2p5/P1P1NPPP/6K1 w - - 0 1",
"1r1qrbk1/3b3p/p2p1pp1/3NnP2/3N4/1Q4BP/PP4P1/1R2R2K w - - 0 1",
"4b1k1/2r2p2/1q1pnPpQ/7p/p3P2P/pN5B/P1P5/1K1R2R1 w - - 0 1",
"4r2k/pp2q2b/2p2p1Q/4rP2/P7/1B5P/1P2R1R1/7K w - - 0 1",
"2k5/1b1r1Rbp/p3p3/Bp4P1/3p1Q1P/P7/1PP1q3/1K6 w - - 0 1",
"6rk/1pqbbp1p/p3p2Q/6R1/4N1nP/3B4/PPP5/2KR4 w - - 0 1",
"r4rk1/5Rbp/p1qN2p1/P1n1P3/8/1Q3N1P/5PP1/5RK1 w - - 0 1",
"r3r1k1/7p/2pRR1p1/p7/2P5/qnQ1P1P1/6BP/6K1 w - - 0 1",
"r4b1r/pppq2pp/2n1b1k1/3n4/2Bp4/5Q2/PPP2PPP/RNB1R1K1 w - - 0 1",
"6R1/5r1k/p6b/1pB1p2q/1P6/5rQP/5P1K/6R1 w - - 0 1",
"rn3rk1/2qp2pp/p3P3/1p1b4/3b4/3B4/PPP1Q1PP/R1B2R1K w - - 0 1",
"2R3nk/3r2b1/p2pr1Q1/4pN2/1P6/P6P/q7/B4RK1 w - - 0 1",
"r5k1/p1p3bp/1p1p4/2PP2qp/1P6/1Q1bP3/PB3rPP/R2N2RK b - - 0 1",
"4k3/r2bnn1r/1q2pR1p/p2pPp1B/2pP1N1P/PpP1B3/1P4Q1/5KR1 w - - 0 1",
"r1b2k2/1p4pp/p4N1r/4Pp2/P3pP1q/4P2P/1P2Q2K/3R2R1 w - - 0 1",
"3r4/pR2N3/2pkb3/5p2/8/2B5/qP3PPP/4R1K1 w - - 0 1",
"r1b4r/1k2bppp/p1p1p3/8/Np2nB2/3R4/PPP1BPPP/2KR4 w - - 0 1",
"2q2r1k/5Qp1/4p1P1/3p4/r6b/7R/5BPP/5RK1 w - - 0 1",
"Q7/2r2rpk/2p4p/7N/3PpN2/1p2P3/1K4R1/5q2 w - - 0 1",
"5r1k/1q4bp/3pB1p1/2pPn1B1/1r6/1p5R/1P2PPQP/R5K1 w - - 0 1",
"r1b2k1r/2q1b3/p3ppBp/2n3B1/1p6/2N4Q/PPP3PP/2KRR3 w - - 0 1",
"5r1k/7p/8/4NP2/8/3p2R1/2r3PP/2n1RK2 w - - 0 1",
"6r1/r5PR/2p3R1/2Pk1n2/3p4/1P1NP3/4K3/8 w - - 0 1",
"r2q4/p2nR1bk/1p1Pb2p/4p2p/3nN3/B2B3P/PP1Q2P1/6K1 w - - 0 1",
"5rk1/pR4bp/6p1/6B1/5Q2/4P3/q2r1PPP/5RK1 w - - 0 1",
"4nrk1/rR5p/4pnpQ/4p1N1/2p1N3/6P1/q4P1P/4R1K1 w - - 0 1",
"1R1n3k/6pp/2Nr4/P4p2/r7/8/4PPBP/6K1 b - - 0 1",
"6r1/3p2qk/4P3/1R5p/3b1prP/3P2B1/2P1QP2/6RK b - - 0 1",
"r5q1/pp1b1kr1/2p2p2/2Q5/2PpB3/1P4NP/P4P2/4RK2 w - - 0 1",
"r2r2k1/pp2bppp/2p1p3/4qb1P/8/1BP1BQ2/PP3PP1/2KR3R b - - 0 1",
"1r1rb3/p1q2pkp/Pnp2np1/4p3/4P3/Q1N1B1PP/2PRBP2/3R2K1 w - - 0 1",
"r2k1r2/3b2pp/p5p1/2Q1R3/1pB1Pq2/1P6/PKP4P/7R w - - 0 1",
"r5k1/q4ppp/rnR1pb2/1Q1p4/1P1P4/P4N1P/1B3PP1/2R3K1 w - - 0 1",
"5r1k/7p/p2b4/1pNp1p1q/3Pr3/2P2bP1/PP1B3Q/R3R1K1 b - - 0 1",
"5b2/1p3rpk/p1b3Rp/4B1RQ/3P1p1P/7q/5P2/6K1 w - - 0 1",
"3Rr2k/pp4pb/2p4p/2P1n3/1P1Q3P/4r1q1/PB4B1/5RK1 b - - 0 1",
"R7/5pkp/3N2p1/2r3Pn/5r2/1P6/P1P5/2KR4 w - - 0 1",
"1r3k2/5p1p/1qbRp3/2r1Pp2/ppB4Q/1P6/P1P4P/1K1R4 w - - 0 1",
"8/2Q1R1bk/3r3p/p2N1p1P/P2P4/1p3Pq1/1P4P1/1K6 w - - 0 1",
"5r1k/r2b1p1p/p4Pp1/1p2R3/3qBQ2/P7/6PP/2R4K w - - 0 1",
"3r3k/1p3Rpp/p2nn3/3N4/8/1PB1PQ1P/q4PP1/6K1 w - - 0 1",
"3r1kr1/8/p2q2p1/1p2R3/1Q6/8/PPP5/1K4R1 w - - 0 1",
"4r2k/2pb1R2/2p4P/3pr1N1/1p6/7P/P1P5/2K4R w - - 0 1",
"3r3k/1b2b1pp/3pp3/p3n1P1/1pPqP2P/1P2N2R/P1QB1r2/2KR3B b - - 0 1",
];

},{}],10:[function(require,module,exports){
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
                diagram: diagram(m),
                marker: '♆'
            };
        })
    });
}

},{"./chessutils":3,"chess.js":1}],11:[function(require,module,exports){
var Chess = require('chess.js').Chess;
var c = require('./chessutils');
var forks = require('./forks');
var knightforkfens = require('./fens/knightforks');
var queenforkfens = require('./fens/queenforks');
var pawnforkfens = require('./fens/pawnforks');
var rookforkfens = require('./fens/rookforks');
var bishopforkfens = require('./fens/bishopforks');
var hidden = require('./hidden');
var loose = require('./loose');
var pins = require('./pins');
var matethreat = require('./matethreat');
var checks = require('./checks');

/**
 * Feature map 
 */
var featureMap = [{
    description: "Knight forks",
    data: knightforkfens,
    extract: function(puzzle) {
      return forks(puzzle, 'n');
    }
  }, {
    description: "Queen forks",
    data: queenforkfens,
    extract: function(puzzle) {
      return forks(puzzle, 'q');
    }
  }, {
    description: "Pawn forks",
    data: pawnforkfens,
    extract: function(puzzle) {
      return forks(puzzle, 'p');
    }
  }, {
    description: "Rook forks",
    data: rookforkfens,
    extract: function(puzzle) {
      return forks(puzzle, 'r');
    }
  }, {
    description: "Bishop forks",
    data: bishopforkfens,
    extract: function(puzzle) {
      return forks(puzzle, 'b');
    }
  },


];

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


  featureMap: featureMap,

  /**
   * Calculate single features in the position.
   */
  extractSingleFeature: function(featureDescription, fen) {
    var puzzle = {
      fen: c.repairFen(fen),
      features: []
    };

    featureMap.forEach(f => {
       if (featureDescription === f.description) {
        puzzle = f.extract(puzzle);
      }
    });

    return puzzle.features;
  },

  featureFound: function(features, target) {
    var found = 0;
    features
      .forEach(f => {
        f.targets.forEach(t => {
          if (t.target === target) {
            found++;
          }
        });
      });
    return found;
  },

  allFeaturesFound: function(features) {
    var found = true;
    features
      .forEach(f => {
        f.targets.forEach(t => {
          if (!t.selected) {
            found = false;
          }
        });
      });
    return found;
  },
  
  randomFenForFeature: function(featureDescription) {
    var fens = featureMap.find(f => f.description === featureDescription).data;
    return fens[Math.floor(Math.random() * fens.length)];
  }


};

},{"./checks":2,"./chessutils":3,"./fens/bishopforks":5,"./fens/knightforks":6,"./fens/pawnforks":7,"./fens/queenforks":8,"./fens/rookforks":9,"./forks":10,"./hidden":12,"./loose":13,"./matethreat":14,"./pins":15,"chess.js":1}],12:[function(require,module,exports){
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

},{"./chessutils":3,"chess.js":1}],13:[function(require,module,exports){
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

},{"./chessutils":3,"chess.js":1}],14:[function(require,module,exports){
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

},{"./chessutils":3,"chess.js":1}],15:[function(require,module,exports){
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

},{"./chessutils":3,"chess.js":1}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./util":32}],19:[function(require,module,exports){
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

},{"./board":20}],20:[function(require,module,exports){
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

},{"./anim":18,"./hold":28,"./premove":30,"./util":32}],21:[function(require,module,exports){
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

},{"./board":20,"./fen":27,"merge":34}],22:[function(require,module,exports){
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

},{"./util":32,"mithril":17}],23:[function(require,module,exports){
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

},{"./anim":18,"./board":20,"./configure":21,"./data":24,"./drag":25,"./fen":27}],24:[function(require,module,exports){
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

},{"./configure":21,"./fen":27}],25:[function(require,module,exports){
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

},{"./board":20,"./draw":26,"./util":32}],26:[function(require,module,exports){
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

},{"./board":20,"./util":32}],27:[function(require,module,exports){
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

},{"./util":32}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"./anim":18,"./api":19,"./board":20,"./configure":21,"./ctrl":23,"./drag":25,"./fen":27,"./util":32,"./view":33,"mithril":17}],30:[function(require,module,exports){
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

},{"./util":32}],31:[function(require,module,exports){
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

},{"./util":32,"mithril":17}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"./coords":22,"./drag":25,"./draw":26,"./svg":31,"./util":32,"mithril":17}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],36:[function(require,module,exports){
var m = require('mithril');
var groundBuild = require('./ground');
var generate = require('../../generate/src/generate');
var diagram = require('../../generate/src/diagram');
var gamestate = require('./gamestate');

module.exports = function(opts, i18n) {

  var betweenFens = false;
  var gameTotal = 40;
  var selection = m.prop("Knight forks");
  var fen = m.prop(opts.fen ? opts.fen : generate.randomFenForFeature(selection()));
  var features = m.prop(generate.extractSingleFeature(selection(), fen()));

  var state = new gamestate(gameTotal);

  var ground;
  var score = m.prop();
  var displayscore = m.prop();
  var breaklevel = m.prop();
  var correct = m.prop([]);
  var incorrect = m.prop([]);
  var timerId;

  function showGround() {
    if (!ground) ground = groundBuild(fen(), onSquareSelect);
  }


  function newGame() {
    score(0);
    displayscore(0);
    breaklevel(99);
    state.reset();
    correct([]);
    incorrect([]);
    nextFen();
    if (!timerId) {
      timerId = setInterval(onTick, 200);
    }
  }

  function onTick() {
    if (!state.gameOver) {
      breaklevel(breaklevel() * 0.99);
    }
    if (breaklevel() < 0) {
      breaklevel(0);
    }
    if (displayscore() < score()) {
      displayscore(displayscore() + 10);
    }
    if (displayscore() > score()) {
      displayscore(score());
    }

    m.redraw();
  }

  function onSquareSelect(target) {
    if (betweenFens) {
      return;
    }
    if (correct().includes(target) || incorrect().includes(target)) {
      target = 'none';
    }
    else {
      var found = generate.featureFound(features(), target);
      if (found > 0) {
        var breakandscore = state.markTarget(target, breaklevel());
        breaklevel(breakandscore.breaklevel);
        score(score() + breakandscore.delta);
        correct().push(target);
      }
      else {
        incorrect().push(target);
        score(score() - 1);
        breaklevel(breaklevel() - 10);
      }
    }
    ground.set({
      fen: fen(),
    });
    var clickedDiagram = diagram.clickedSquares(features(), correct(), incorrect(), target);
    ground.setShapes(clickedDiagram);
    m.redraw();
    if (generate.allFeaturesFound(features())) {
      console.log("all features found");
      if (state.gameComplete()) {
        gameOver();
      }
      else {
        // since this will take 0.5 seconds to fire we must block all other events until it is run.
        betweenFens = true;
        setTimeout(function() {
          betweenFens = false;
          nextFen();
        }, 500);
      }
    }
  }

  function gameOver() {
    m.redraw();
  }

  function updateFen(value) {
    diagram.clearDiagrams(features());
    fen(value);
    ground.set({
      fen: fen(),
    });
    ground.setShapes([]);
    correct([]);
    incorrect([]);
    features(generate.extractSingleFeature(selection(), fen()));
    if (generate.allFeaturesFound(features())) {
      return nextFen();
    }
    state.addTargets(features(), fen());
    m.redraw();
  }

  function nextFen() {
    updateFen(generate.randomFenForFeature(selection()));
  }

  showGround();
  newGame();
  m.redraw();

  return {
    fen: fen,
    ground: ground,
    state: state,
    features: features,
    updateFen: updateFen,
    onSquareSelect: onSquareSelect,
    nextFen: nextFen,
    score: score,
    displayscore: displayscore,
    breaklevel: breaklevel,
    selection: selection,
    newGame: newGame,
    descriptions: generate.featureMap.map(f => f.description)
  };
};

},{"../../generate/src/diagram":4,"../../generate/src/generate":11,"./gamestate":37,"./ground":38,"mithril":35}],37:[function(require,module,exports){
module.exports = class gamestate {

  constructor(total) {
    this.total = total;
    this.known = [];
    this.gameOver = false;
  }

  reset() {
    this.known = [];
    this.gameOver = false;
  }

  addTargets(features, fen) {

    var newTargets = [];
    features.forEach(f => {
      f.targets.forEach(t => {
        t.side = f.side;
        t.bonus = " ";
        t.link = "./index.html?fen=" + encodeURI(fen) + "&target=" + t.target;
        newTargets.push(t);
      });
    });

    this.known = this.known.concat(newTargets);
  }

  /**
   * Targets are normalised - two white targets for the same square
   * should be combined and targets for two colours on same square combined.
   */
  combineLikeTargets(targets) {
    var combined = [];
    targets.forEach(t => {
      var previous = combined.find(c => c.target === t.target);
      if (!previous) {
        combined.push(t);
      }
      else {
        previous.diagram = previous.diagram.concat(t.diagram).slice();
        if (previous.side !== t.side) {
          previous.side = "bw";
        }
      }
    });
    return combined;
  }

  bonus(breaklevel) {
    var bonus = Math.ceil(breaklevel / 10) * 10;
    if (breaklevel > 66) {
      bonus = 100 + Math.ceil(breaklevel / 2);
    }
    return bonus;
  }


  /**
   * If any target is matched for a given side, the first incomplete item
   * should be marked. 
   */
  markTarget(target, breaklevel) {

    var total = 0;
    this.known.forEach(c => {
      if (!c.complete && c.target === target) {
        c.complete = true;
        c.bonus = this.bonus(breaklevel);
        total += c.bonus;
        breaklevel += 25;
      }
    });

    breaklevel = breaklevel > 100 ? 100 : breaklevel;

    return {
      breaklevel: (total === 0) ? breaklevel * 0.9 : breaklevel,
      delta: total
    };
  }

  getState() {
    var result = [].concat(this.known);

    while (result.length < this.total) {
      result.push({});
    }

    return result;
  }

  gameComplete() {
    var completed = this.known.map(t => t.complete ? 1 : 0).reduce((a, b) => a + b);
    this.gameOver = completed >= this.total;
    return this.gameOver;
  }
};

},{}],38:[function(require,module,exports){
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

},{"chessground":29}],39:[function(require,module,exports){
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
    element: document.getElementById("wrapper")
});

},{"./ctrl":36,"./view/main":41,"mithril":35}],40:[function(require,module,exports){
var m = require('mithril');

module.exports = function(controller) {
  return [
    m('div.breakbar', [
      m('div.breakbarindicator' + (controller.breaklevel() > 66 ? '.gold' : ''), {
        style: {
          width: controller.breaklevel() + "%"
        }
      }),
      m('div.breakarea', 'break'),
    ])
  ];
};

},{"mithril":35}],41:[function(require,module,exports){
var m = require('mithril');
var chessground = require('chessground');
var progress = require('./progress');
var score = require('./score');
var breakbar = require('./breakbar');

function visualBoard(ctrl) {
  return m('div.lichess_board', m('div.lichess_board_wrap', m('div.lichess_board', [
    chessground.view(ctrl.ground)
  ])));
}

function info(ctrl) {
  return [m('div.explanation', [
    m('p', 'Increase your tactical awareness by spotting all knight forks of pieces excluding pawns as fast as you can (regardless of quality of move)'),
    m('br'),
    m('br'),
    m('ul.instructions', [
      m('li.instructions', 'Find all knight forking squares.'),
      m('li.instructions', 'Break bonus by clicking quickly.'),
      m('li.instructions', 'Post your high score on ', m("a.hiscore.external[href='https://en.lichess.org/forum/game-analysis/forking-hell-challenge']", {
        style: {
          color: "#55a"
        }
      }, 'lichess.'))
    ]),
    m('br'),
    m('br'),
    m('div.button.newgame', {
      onclick: function() {
        ctrl.newGame();
      }
    }, 'New knight fork game')
  ])];
}

module.exports = function(ctrl) {
  return [
    m("div.#site_header",
      m('div.board_left', [
        m('h2.center',
          m('a#site_title', {
              onclick: function() {
                window.open("./index.html?fen=" + encodeURI(ctrl.fen()));
              }
            }, 'feature',
            m('span.extension', 'tron'))),
        progress(ctrl)
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
            breakbar(ctrl),
            m('br'),
            score(ctrl),
            m('br'),
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

},{"./breakbar":40,"./progress":42,"./score":43,"chessground":29,"mithril":35}],42:[function(require,module,exports){
var m = require('mithril');

function twoDivs(marker, bonus) {
    return [
        m('div.progress-marker', marker ? marker + " " : " "),
        m('div.progress-bonus', bonus ? bonus + " " : " "),
    ];
}

function progressItem(item) {

    if (item.complete) {
        return m("div.progress.complete" + (item.bonus >= 100 ? ".bonus" : ""), {
            onclick: function() {
                window.open(item.link);
            }
        }, twoDivs(item.marker, item.bonus));
    }

    if (item.side) {
        return m("div.progress.target" + (item.side === 'w' ? ".white" : ".black"), {
            onclick: function() {
                window.open(item.link);
            }
        }, twoDivs(item.marker, item.bonus));
    }
    return m("div.progress.pending", twoDivs());
}

module.exports = function(controller) {
    return controller.state.getState().map(progressItem);
};

},{"mithril":35}],43:[function(require,module,exports){
var m = require('mithril');

function convertToPieces(i) {
  return i.toString(6)
    .replace(/0/g, "♙")
    .replace(/1/g, "♘")
    .replace(/2/g, "♗")
    .replace(/3/g, "♖")
    .replace(/4/g, "♕")
    .replace(/5/g, "♔");
}

module.exports = function(controller) {
  return [
    m('div.score' + (controller.state.gameOver ? '.final' : ''), "score: " + (controller.displayscore()))
  ];
};

},{"mithril":35}]},{},[39])(39)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9nZW5lcmF0ZS9ub2RlX21vZHVsZXMvY2hlc3MuanMvY2hlc3MuanMiLCIuLi9nZW5lcmF0ZS9zcmMvY2hlY2tzLmpzIiwiLi4vZ2VuZXJhdGUvc3JjL2NoZXNzdXRpbHMuanMiLCIuLi9nZW5lcmF0ZS9zcmMvZGlhZ3JhbS5qcyIsIi4uL2dlbmVyYXRlL3NyYy9mZW5zL2Jpc2hvcGZvcmtzLmpzIiwiLi4vZ2VuZXJhdGUvc3JjL2ZlbnMva25pZ2h0Zm9ya3MuanMiLCIuLi9nZW5lcmF0ZS9zcmMvZmVucy9wYXduZm9ya3MuanMiLCIuLi9nZW5lcmF0ZS9zcmMvZmVucy9xdWVlbmZvcmtzLmpzIiwiLi4vZ2VuZXJhdGUvc3JjL2ZlbnMvcm9va2ZvcmtzLmpzIiwiLi4vZ2VuZXJhdGUvc3JjL2ZvcmtzLmpzIiwiLi4vZ2VuZXJhdGUvc3JjL2dlbmVyYXRlLmpzIiwiLi4vZ2VuZXJhdGUvc3JjL2hpZGRlbi5qcyIsIi4uL2dlbmVyYXRlL3NyYy9sb29zZS5qcyIsIi4uL2dlbmVyYXRlL3NyYy9tYXRldGhyZWF0LmpzIiwiLi4vZ2VuZXJhdGUvc3JjL3BpbnMuanMiLCIuLi9nZW5lcmF0ZS9zcmMvdXRpbC91bmlxLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL25vZGVfbW9kdWxlcy9taXRocmlsL21pdGhyaWwuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2FuaW0uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2FwaS5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvYm9hcmQuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2NvbmZpZ3VyZS5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvY29vcmRzLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9jdHJsLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9kYXRhLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9kcmFnLmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9kcmF3LmpzIiwibm9kZV9tb2R1bGVzL2NoZXNzZ3JvdW5kL3NyYy9mZW4uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL2hvbGQuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL21haW4uanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL3ByZW1vdmUuanMiLCJub2RlX21vZHVsZXMvY2hlc3Nncm91bmQvc3JjL3N2Zy5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9jaGVzc2dyb3VuZC9zcmMvdmlldy5qcyIsIm5vZGVfbW9kdWxlcy9tZXJnZS9tZXJnZS5qcyIsInNyYy9jdHJsLmpzIiwic3JjL2dhbWVzdGF0ZS5qcyIsInNyYy9ncm91bmQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy92aWV3L2JyZWFrYmFyLmpzIiwic3JjL3ZpZXcvbWFpbi5qcyIsInNyYy92aWV3L3Byb2dyZXNzLmpzIiwic3JjL3ZpZXcvc2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFtREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzkzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNiwgSmVmZiBIbHl3YSAoamhseXdhQGdtYWlsLmNvbSlcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAqIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAqIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4gKiBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1JcbiAqIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GXG4gKiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1NcbiAqIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOXG4gKiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKVxuICogQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEVcbiAqIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICpcbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8qIG1pbmlmaWVkIGxpY2Vuc2UgYmVsb3cgICovXG5cbi8qIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYsIEplZmYgSGx5d2EgKGpobHl3YUBnbWFpbC5jb20pXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgQlNEIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qaGx5d2EvY2hlc3MuanMvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbnZhciBDaGVzcyA9IGZ1bmN0aW9uKGZlbikge1xuXG4gIC8qIGpzaGludCBpbmRlbnQ6IGZhbHNlICovXG5cbiAgdmFyIEJMQUNLID0gJ2InO1xuICB2YXIgV0hJVEUgPSAndyc7XG5cbiAgdmFyIEVNUFRZID0gLTE7XG5cbiAgdmFyIFBBV04gPSAncCc7XG4gIHZhciBLTklHSFQgPSAnbic7XG4gIHZhciBCSVNIT1AgPSAnYic7XG4gIHZhciBST09LID0gJ3InO1xuICB2YXIgUVVFRU4gPSAncSc7XG4gIHZhciBLSU5HID0gJ2snO1xuXG4gIHZhciBTWU1CT0xTID0gJ3BuYnJxa1BOQlJRSyc7XG5cbiAgdmFyIERFRkFVTFRfUE9TSVRJT04gPSAncm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDEnO1xuXG4gIHZhciBQT1NTSUJMRV9SRVNVTFRTID0gWycxLTAnLCAnMC0xJywgJzEvMi0xLzInLCAnKiddO1xuXG4gIHZhciBQQVdOX09GRlNFVFMgPSB7XG4gICAgYjogWzE2LCAzMiwgMTcsIDE1XSxcbiAgICB3OiBbLTE2LCAtMzIsIC0xNywgLTE1XVxuICB9O1xuXG4gIHZhciBQSUVDRV9PRkZTRVRTID0ge1xuICAgIG46IFstMTgsIC0zMywgLTMxLCAtMTQsICAxOCwgMzMsIDMxLCAgMTRdLFxuICAgIGI6IFstMTcsIC0xNSwgIDE3LCAgMTVdLFxuICAgIHI6IFstMTYsICAgMSwgIDE2LCAgLTFdLFxuICAgIHE6IFstMTcsIC0xNiwgLTE1LCAgIDEsICAxNywgMTYsIDE1LCAgLTFdLFxuICAgIGs6IFstMTcsIC0xNiwgLTE1LCAgIDEsICAxNywgMTYsIDE1LCAgLTFdXG4gIH07XG5cbiAgdmFyIEFUVEFDS1MgPSBbXG4gICAgMjAsIDAsIDAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwgMCwgMCwyMCwgMCxcbiAgICAgMCwyMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLDIwLCAwLCAwLFxuICAgICAwLCAwLDIwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsMjAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwyMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwyMCwgMCwgMCwgMjQsICAwLCAwLDIwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLDIwLCAyLCAyNCwgIDIsMjAsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsIDAsIDIsNTMsIDU2LCA1MywgMiwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAyNCwyNCwyNCwyNCwyNCwyNCw1NiwgIDAsIDU2LDI0LDI0LDI0LDI0LDI0LDI0LCAwLFxuICAgICAwLCAwLCAwLCAwLCAwLCAyLDUzLCA1NiwgNTMsIDIsIDAsIDAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsIDAsIDAsIDAsMjAsIDIsIDI0LCAgMiwyMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICAgMCwgMCwgMCwgMCwyMCwgMCwgMCwgMjQsICAwLCAwLDIwLCAwLCAwLCAwLCAwLCAwLFxuICAgICAwLCAwLCAwLDIwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsMjAsIDAsIDAsIDAsIDAsXG4gICAgIDAsIDAsMjAsIDAsIDAsIDAsIDAsIDI0LCAgMCwgMCwgMCwgMCwyMCwgMCwgMCwgMCxcbiAgICAgMCwyMCwgMCwgMCwgMCwgMCwgMCwgMjQsICAwLCAwLCAwLCAwLCAwLDIwLCAwLCAwLFxuICAgIDIwLCAwLCAwLCAwLCAwLCAwLCAwLCAyNCwgIDAsIDAsIDAsIDAsIDAsIDAsMjBcbiAgXTtcblxuICB2YXIgUkFZUyA9IFtcbiAgICAgMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLCAxNSwgMCxcbiAgICAgIDAsIDE3LCAgMCwgIDAsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAgMCwgIDAsIDE1LCAgMCwgMCxcbiAgICAgIDAsICAwLCAxNywgIDAsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAgMCwgMTUsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgMTcsICAwLCAgMCwgIDAsIDE2LCAgMCwgIDAsICAwLCAxNSwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsIDE3LCAgMCwgIDAsIDE2LCAgMCwgIDAsIDE1LCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLCAxNywgIDAsIDE2LCAgMCwgMTUsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMTcsIDE2LCAxNSwgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDEsICAxLCAgMSwgIDEsICAxLCAgMSwgIDEsICAwLCAtMSwgLTEsICAtMSwtMSwgLTEsIC0xLCAtMSwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwtMTUsLTE2LC0xNywgIDAsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsICAwLC0xNSwgIDAsLTE2LCAgMCwtMTcsICAwLCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwgIDAsLTE1LCAgMCwgIDAsLTE2LCAgMCwgIDAsLTE3LCAgMCwgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLCAgMCwtMTUsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLC0xNywgIDAsICAwLCAgMCwgMCxcbiAgICAgIDAsICAwLC0xNSwgIDAsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLCAgMCwtMTcsICAwLCAgMCwgMCxcbiAgICAgIDAsLTE1LCAgMCwgIDAsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLCAgMCwgIDAsLTE3LCAgMCwgMCxcbiAgICAtMTUsICAwLCAgMCwgIDAsICAwLCAgMCwgIDAsLTE2LCAgMCwgIDAsICAwLCAgMCwgIDAsICAwLC0xN1xuICBdO1xuXG4gIHZhciBTSElGVFMgPSB7IHA6IDAsIG46IDEsIGI6IDIsIHI6IDMsIHE6IDQsIGs6IDUgfTtcblxuICB2YXIgRkxBR1MgPSB7XG4gICAgTk9STUFMOiAnbicsXG4gICAgQ0FQVFVSRTogJ2MnLFxuICAgIEJJR19QQVdOOiAnYicsXG4gICAgRVBfQ0FQVFVSRTogJ2UnLFxuICAgIFBST01PVElPTjogJ3AnLFxuICAgIEtTSURFX0NBU1RMRTogJ2snLFxuICAgIFFTSURFX0NBU1RMRTogJ3EnXG4gIH07XG5cbiAgdmFyIEJJVFMgPSB7XG4gICAgTk9STUFMOiAxLFxuICAgIENBUFRVUkU6IDIsXG4gICAgQklHX1BBV046IDQsXG4gICAgRVBfQ0FQVFVSRTogOCxcbiAgICBQUk9NT1RJT046IDE2LFxuICAgIEtTSURFX0NBU1RMRTogMzIsXG4gICAgUVNJREVfQ0FTVExFOiA2NFxuICB9O1xuXG4gIHZhciBSQU5LXzEgPSA3O1xuICB2YXIgUkFOS18yID0gNjtcbiAgdmFyIFJBTktfMyA9IDU7XG4gIHZhciBSQU5LXzQgPSA0O1xuICB2YXIgUkFOS181ID0gMztcbiAgdmFyIFJBTktfNiA9IDI7XG4gIHZhciBSQU5LXzcgPSAxO1xuICB2YXIgUkFOS184ID0gMDtcblxuICB2YXIgU1FVQVJFUyA9IHtcbiAgICBhODogICAwLCBiODogICAxLCBjODogICAyLCBkODogICAzLCBlODogICA0LCBmODogICA1LCBnODogICA2LCBoODogICA3LFxuICAgIGE3OiAgMTYsIGI3OiAgMTcsIGM3OiAgMTgsIGQ3OiAgMTksIGU3OiAgMjAsIGY3OiAgMjEsIGc3OiAgMjIsIGg3OiAgMjMsXG4gICAgYTY6ICAzMiwgYjY6ICAzMywgYzY6ICAzNCwgZDY6ICAzNSwgZTY6ICAzNiwgZjY6ICAzNywgZzY6ICAzOCwgaDY6ICAzOSxcbiAgICBhNTogIDQ4LCBiNTogIDQ5LCBjNTogIDUwLCBkNTogIDUxLCBlNTogIDUyLCBmNTogIDUzLCBnNTogIDU0LCBoNTogIDU1LFxuICAgIGE0OiAgNjQsIGI0OiAgNjUsIGM0OiAgNjYsIGQ0OiAgNjcsIGU0OiAgNjgsIGY0OiAgNjksIGc0OiAgNzAsIGg0OiAgNzEsXG4gICAgYTM6ICA4MCwgYjM6ICA4MSwgYzM6ICA4MiwgZDM6ICA4MywgZTM6ICA4NCwgZjM6ICA4NSwgZzM6ICA4NiwgaDM6ICA4NyxcbiAgICBhMjogIDk2LCBiMjogIDk3LCBjMjogIDk4LCBkMjogIDk5LCBlMjogMTAwLCBmMjogMTAxLCBnMjogMTAyLCBoMjogMTAzLFxuICAgIGExOiAxMTIsIGIxOiAxMTMsIGMxOiAxMTQsIGQxOiAxMTUsIGUxOiAxMTYsIGYxOiAxMTcsIGcxOiAxMTgsIGgxOiAxMTlcbiAgfTtcblxuICB2YXIgUk9PS1MgPSB7XG4gICAgdzogW3tzcXVhcmU6IFNRVUFSRVMuYTEsIGZsYWc6IEJJVFMuUVNJREVfQ0FTVExFfSxcbiAgICAgICAge3NxdWFyZTogU1FVQVJFUy5oMSwgZmxhZzogQklUUy5LU0lERV9DQVNUTEV9XSxcbiAgICBiOiBbe3NxdWFyZTogU1FVQVJFUy5hOCwgZmxhZzogQklUUy5RU0lERV9DQVNUTEV9LFxuICAgICAgICB7c3F1YXJlOiBTUVVBUkVTLmg4LCBmbGFnOiBCSVRTLktTSURFX0NBU1RMRX1dXG4gIH07XG5cbiAgdmFyIGJvYXJkID0gbmV3IEFycmF5KDEyOCk7XG4gIHZhciBraW5ncyA9IHt3OiBFTVBUWSwgYjogRU1QVFl9O1xuICB2YXIgdHVybiA9IFdISVRFO1xuICB2YXIgY2FzdGxpbmcgPSB7dzogMCwgYjogMH07XG4gIHZhciBlcF9zcXVhcmUgPSBFTVBUWTtcbiAgdmFyIGhhbGZfbW92ZXMgPSAwO1xuICB2YXIgbW92ZV9udW1iZXIgPSAxO1xuICB2YXIgaGlzdG9yeSA9IFtdO1xuICB2YXIgaGVhZGVyID0ge307XG5cbiAgLyogaWYgdGhlIHVzZXIgcGFzc2VzIGluIGEgZmVuIHN0cmluZywgbG9hZCBpdCwgZWxzZSBkZWZhdWx0IHRvXG4gICAqIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAqL1xuICBpZiAodHlwZW9mIGZlbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2FkKERFRkFVTFRfUE9TSVRJT04pO1xuICB9IGVsc2Uge1xuICAgIGxvYWQoZmVuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIGJvYXJkID0gbmV3IEFycmF5KDEyOCk7XG4gICAga2luZ3MgPSB7dzogRU1QVFksIGI6IEVNUFRZfTtcbiAgICB0dXJuID0gV0hJVEU7XG4gICAgY2FzdGxpbmcgPSB7dzogMCwgYjogMH07XG4gICAgZXBfc3F1YXJlID0gRU1QVFk7XG4gICAgaGFsZl9tb3ZlcyA9IDA7XG4gICAgbW92ZV9udW1iZXIgPSAxO1xuICAgIGhpc3RvcnkgPSBbXTtcbiAgICBoZWFkZXIgPSB7fTtcbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgbG9hZChERUZBVUxUX1BPU0lUSU9OKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWQoZmVuKSB7XG4gICAgdmFyIHRva2VucyA9IGZlbi5zcGxpdCgvXFxzKy8pO1xuICAgIHZhciBwb3NpdGlvbiA9IHRva2Vuc1swXTtcbiAgICB2YXIgc3F1YXJlID0gMDtcblxuICAgIGlmICghdmFsaWRhdGVfZmVuKGZlbikudmFsaWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjbGVhcigpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3NpdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBpZWNlID0gcG9zaXRpb24uY2hhckF0KGkpO1xuXG4gICAgICBpZiAocGllY2UgPT09ICcvJykge1xuICAgICAgICBzcXVhcmUgKz0gODtcbiAgICAgIH0gZWxzZSBpZiAoaXNfZGlnaXQocGllY2UpKSB7XG4gICAgICAgIHNxdWFyZSArPSBwYXJzZUludChwaWVjZSwgMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvbG9yID0gKHBpZWNlIDwgJ2EnKSA/IFdISVRFIDogQkxBQ0s7XG4gICAgICAgIHB1dCh7dHlwZTogcGllY2UudG9Mb3dlckNhc2UoKSwgY29sb3I6IGNvbG9yfSwgYWxnZWJyYWljKHNxdWFyZSkpO1xuICAgICAgICBzcXVhcmUrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0dXJuID0gdG9rZW5zWzFdO1xuXG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdLJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcudyB8PSBCSVRTLktTSURFX0NBU1RMRTtcbiAgICB9XG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdRJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcudyB8PSBCSVRTLlFTSURFX0NBU1RMRTtcbiAgICB9XG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdrJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcuYiB8PSBCSVRTLktTSURFX0NBU1RMRTtcbiAgICB9XG4gICAgaWYgKHRva2Vuc1syXS5pbmRleE9mKCdxJykgPiAtMSkge1xuICAgICAgY2FzdGxpbmcuYiB8PSBCSVRTLlFTSURFX0NBU1RMRTtcbiAgICB9XG5cbiAgICBlcF9zcXVhcmUgPSAodG9rZW5zWzNdID09PSAnLScpID8gRU1QVFkgOiBTUVVBUkVTW3Rva2Vuc1szXV07XG4gICAgaGFsZl9tb3ZlcyA9IHBhcnNlSW50KHRva2Vuc1s0XSwgMTApO1xuICAgIG1vdmVfbnVtYmVyID0gcGFyc2VJbnQodG9rZW5zWzVdLCAxMCk7XG5cbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKiBUT0RPOiB0aGlzIGZ1bmN0aW9uIGlzIHByZXR0eSBtdWNoIGNyYXAgLSBpdCB2YWxpZGF0ZXMgc3RydWN0dXJlIGJ1dFxuICAgKiBjb21wbGV0ZWx5IGlnbm9yZXMgY29udGVudCAoZS5nLiBkb2Vzbid0IHZlcmlmeSB0aGF0IGVhY2ggc2lkZSBoYXMgYSBraW5nKVxuICAgKiAuLi4gd2Ugc2hvdWxkIHJld3JpdGUgdGhpcywgYW5kIGRpdGNoIHRoZSBzaWxseSBlcnJvcl9udW1iZXIgZmllbGQgd2hpbGVcbiAgICogd2UncmUgYXQgaXRcbiAgICovXG4gIGZ1bmN0aW9uIHZhbGlkYXRlX2ZlbihmZW4pIHtcbiAgICB2YXIgZXJyb3JzID0ge1xuICAgICAgIDA6ICdObyBlcnJvcnMuJyxcbiAgICAgICAxOiAnRkVOIHN0cmluZyBtdXN0IGNvbnRhaW4gc2l4IHNwYWNlLWRlbGltaXRlZCBmaWVsZHMuJyxcbiAgICAgICAyOiAnNnRoIGZpZWxkIChtb3ZlIG51bWJlcikgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuJyxcbiAgICAgICAzOiAnNXRoIGZpZWxkIChoYWxmIG1vdmUgY291bnRlcikgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLicsXG4gICAgICAgNDogJzR0aCBmaWVsZCAoZW4tcGFzc2FudCBzcXVhcmUpIGlzIGludmFsaWQuJyxcbiAgICAgICA1OiAnM3JkIGZpZWxkIChjYXN0bGluZyBhdmFpbGFiaWxpdHkpIGlzIGludmFsaWQuJyxcbiAgICAgICA2OiAnMm5kIGZpZWxkIChzaWRlIHRvIG1vdmUpIGlzIGludmFsaWQuJyxcbiAgICAgICA3OiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGRvZXMgbm90IGNvbnRhaW4gOCBcXCcvXFwnLWRlbGltaXRlZCByb3dzLicsXG4gICAgICAgODogJzFzdCBmaWVsZCAocGllY2UgcG9zaXRpb25zKSBpcyBpbnZhbGlkIFtjb25zZWN1dGl2ZSBudW1iZXJzXS4nLFxuICAgICAgIDk6ICcxc3QgZmllbGQgKHBpZWNlIHBvc2l0aW9ucykgaXMgaW52YWxpZCBbaW52YWxpZCBwaWVjZV0uJyxcbiAgICAgIDEwOiAnMXN0IGZpZWxkIChwaWVjZSBwb3NpdGlvbnMpIGlzIGludmFsaWQgW3JvdyB0b28gbGFyZ2VdLicsXG4gICAgICAxMTogJ0lsbGVnYWwgZW4tcGFzc2FudCBzcXVhcmUnLFxuICAgIH07XG5cbiAgICAvKiAxc3QgY3JpdGVyaW9uOiA2IHNwYWNlLXNlcGVyYXRlZCBmaWVsZHM/ICovXG4gICAgdmFyIHRva2VucyA9IGZlbi5zcGxpdCgvXFxzKy8pO1xuICAgIGlmICh0b2tlbnMubGVuZ3RoICE9PSA2KSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAxLCBlcnJvcjogZXJyb3JzWzFdfTtcbiAgICB9XG5cbiAgICAvKiAybmQgY3JpdGVyaW9uOiBtb3ZlIG51bWJlciBmaWVsZCBpcyBhIGludGVnZXIgdmFsdWUgPiAwPyAqL1xuICAgIGlmIChpc05hTih0b2tlbnNbNV0pIHx8IChwYXJzZUludCh0b2tlbnNbNV0sIDEwKSA8PSAwKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogMiwgZXJyb3I6IGVycm9yc1syXX07XG4gICAgfVxuXG4gICAgLyogM3JkIGNyaXRlcmlvbjogaGFsZiBtb3ZlIGNvdW50ZXIgaXMgYW4gaW50ZWdlciA+PSAwPyAqL1xuICAgIGlmIChpc05hTih0b2tlbnNbNF0pIHx8IChwYXJzZUludCh0b2tlbnNbNF0sIDEwKSA8IDApKSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAzLCBlcnJvcjogZXJyb3JzWzNdfTtcbiAgICB9XG5cbiAgICAvKiA0dGggY3JpdGVyaW9uOiA0dGggZmllbGQgaXMgYSB2YWxpZCBlLnAuLXN0cmluZz8gKi9cbiAgICBpZiAoIS9eKC18W2FiY2RlZmdoXVszNl0pJC8udGVzdCh0b2tlbnNbM10pKSB7XG4gICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiA0LCBlcnJvcjogZXJyb3JzWzRdfTtcbiAgICB9XG5cbiAgICAvKiA1dGggY3JpdGVyaW9uOiAzdGggZmllbGQgaXMgYSB2YWxpZCBjYXN0bGUtc3RyaW5nPyAqL1xuICAgIGlmKCAhL14oS1E/az9xP3xRaz9xP3xrcT98cXwtKSQvLnRlc3QodG9rZW5zWzJdKSkge1xuICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogNSwgZXJyb3I6IGVycm9yc1s1XX07XG4gICAgfVxuXG4gICAgLyogNnRoIGNyaXRlcmlvbjogMm5kIGZpZWxkIGlzIFwid1wiICh3aGl0ZSkgb3IgXCJiXCIgKGJsYWNrKT8gKi9cbiAgICBpZiAoIS9eKHd8YikkLy50ZXN0KHRva2Vuc1sxXSkpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDYsIGVycm9yOiBlcnJvcnNbNl19O1xuICAgIH1cblxuICAgIC8qIDd0aCBjcml0ZXJpb246IDFzdCBmaWVsZCBjb250YWlucyA4IHJvd3M/ICovXG4gICAgdmFyIHJvd3MgPSB0b2tlbnNbMF0uc3BsaXQoJy8nKTtcbiAgICBpZiAocm93cy5sZW5ndGggIT09IDgpIHtcbiAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDcsIGVycm9yOiBlcnJvcnNbN119O1xuICAgIH1cblxuICAgIC8qIDh0aCBjcml0ZXJpb246IGV2ZXJ5IHJvdyBpcyB2YWxpZD8gKi9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8qIGNoZWNrIGZvciByaWdodCBzdW0gb2YgZmllbGRzIEFORCBub3QgdHdvIG51bWJlcnMgaW4gc3VjY2Vzc2lvbiAqL1xuICAgICAgdmFyIHN1bV9maWVsZHMgPSAwO1xuICAgICAgdmFyIHByZXZpb3VzX3dhc19udW1iZXIgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCByb3dzW2ldLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIGlmICghaXNOYU4ocm93c1tpXVtrXSkpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNfd2FzX251bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHt2YWxpZDogZmFsc2UsIGVycm9yX251bWJlcjogOCwgZXJyb3I6IGVycm9yc1s4XX07XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1bV9maWVsZHMgKz0gcGFyc2VJbnQocm93c1tpXVtrXSwgMTApO1xuICAgICAgICAgIHByZXZpb3VzX3dhc19udW1iZXIgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghL15bcHJuYnFrUFJOQlFLXSQvLnRlc3Qocm93c1tpXVtrXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDksIGVycm9yOiBlcnJvcnNbOV19O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdW1fZmllbGRzICs9IDE7XG4gICAgICAgICAgcHJldmlvdXNfd2FzX251bWJlciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VtX2ZpZWxkcyAhPT0gOCkge1xuICAgICAgICByZXR1cm4ge3ZhbGlkOiBmYWxzZSwgZXJyb3JfbnVtYmVyOiAxMCwgZXJyb3I6IGVycm9yc1sxMF19O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgodG9rZW5zWzNdWzFdID09ICczJyAmJiB0b2tlbnNbMV0gPT0gJ3cnKSB8fFxuICAgICAgICAodG9rZW5zWzNdWzFdID09ICc2JyAmJiB0b2tlbnNbMV0gPT0gJ2InKSkge1xuICAgICAgICAgIHJldHVybiB7dmFsaWQ6IGZhbHNlLCBlcnJvcl9udW1iZXI6IDExLCBlcnJvcjogZXJyb3JzWzExXX07XG4gICAgfVxuXG4gICAgLyogZXZlcnl0aGluZydzIG9rYXkhICovXG4gICAgcmV0dXJuIHt2YWxpZDogdHJ1ZSwgZXJyb3JfbnVtYmVyOiAwLCBlcnJvcjogZXJyb3JzWzBdfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlX2ZlbigpIHtcbiAgICB2YXIgZW1wdHkgPSAwO1xuICAgIHZhciBmZW4gPSAnJztcblxuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgaWYgKGJvYXJkW2ldID09IG51bGwpIHtcbiAgICAgICAgZW1wdHkrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbXB0eSA+IDApIHtcbiAgICAgICAgICBmZW4gKz0gZW1wdHk7XG4gICAgICAgICAgZW1wdHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb2xvciA9IGJvYXJkW2ldLmNvbG9yO1xuICAgICAgICB2YXIgcGllY2UgPSBib2FyZFtpXS50eXBlO1xuXG4gICAgICAgIGZlbiArPSAoY29sb3IgPT09IFdISVRFKSA/XG4gICAgICAgICAgICAgICAgIHBpZWNlLnRvVXBwZXJDYXNlKCkgOiBwaWVjZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGkgKyAxKSAmIDB4ODgpIHtcbiAgICAgICAgaWYgKGVtcHR5ID4gMCkge1xuICAgICAgICAgIGZlbiArPSBlbXB0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpICE9PSBTUVVBUkVTLmgxKSB7XG4gICAgICAgICAgZmVuICs9ICcvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGVtcHR5ID0gMDtcbiAgICAgICAgaSArPSA4O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjZmxhZ3MgPSAnJztcbiAgICBpZiAoY2FzdGxpbmdbV0hJVEVdICYgQklUUy5LU0lERV9DQVNUTEUpIHsgY2ZsYWdzICs9ICdLJzsgfVxuICAgIGlmIChjYXN0bGluZ1tXSElURV0gJiBCSVRTLlFTSURFX0NBU1RMRSkgeyBjZmxhZ3MgKz0gJ1EnOyB9XG4gICAgaWYgKGNhc3RsaW5nW0JMQUNLXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7IGNmbGFncyArPSAnayc7IH1cbiAgICBpZiAoY2FzdGxpbmdbQkxBQ0tdICYgQklUUy5RU0lERV9DQVNUTEUpIHsgY2ZsYWdzICs9ICdxJzsgfVxuXG4gICAgLyogZG8gd2UgaGF2ZSBhbiBlbXB0eSBjYXN0bGluZyBmbGFnPyAqL1xuICAgIGNmbGFncyA9IGNmbGFncyB8fCAnLSc7XG4gICAgdmFyIGVwZmxhZ3MgPSAoZXBfc3F1YXJlID09PSBFTVBUWSkgPyAnLScgOiBhbGdlYnJhaWMoZXBfc3F1YXJlKTtcblxuICAgIHJldHVybiBbZmVuLCB0dXJuLCBjZmxhZ3MsIGVwZmxhZ3MsIGhhbGZfbW92ZXMsIG1vdmVfbnVtYmVyXS5qb2luKCcgJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRfaGVhZGVyKGFyZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJnc1tpXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICB0eXBlb2YgYXJnc1tpICsgMV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGhlYWRlclthcmdzW2ldXSA9IGFyZ3NbaSArIDFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG5cbiAgLyogY2FsbGVkIHdoZW4gdGhlIGluaXRpYWwgYm9hcmQgc2V0dXAgaXMgY2hhbmdlZCB3aXRoIHB1dCgpIG9yIHJlbW92ZSgpLlxuICAgKiBtb2RpZmllcyB0aGUgU2V0VXAgYW5kIEZFTiBwcm9wZXJ0aWVzIG9mIHRoZSBoZWFkZXIgb2JqZWN0LiAgaWYgdGhlIEZFTiBpc1xuICAgKiBlcXVhbCB0byB0aGUgZGVmYXVsdCBwb3NpdGlvbiwgdGhlIFNldFVwIGFuZCBGRU4gYXJlIGRlbGV0ZWRcbiAgICogdGhlIHNldHVwIGlzIG9ubHkgdXBkYXRlZCBpZiBoaXN0b3J5Lmxlbmd0aCBpcyB6ZXJvLCBpZSBtb3ZlcyBoYXZlbid0IGJlZW5cbiAgICogbWFkZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZV9zZXR1cChmZW4pIHtcbiAgICBpZiAoaGlzdG9yeS5sZW5ndGggPiAwKSByZXR1cm47XG5cbiAgICBpZiAoZmVuICE9PSBERUZBVUxUX1BPU0lUSU9OKSB7XG4gICAgICBoZWFkZXJbJ1NldFVwJ10gPSAnMSc7XG4gICAgICBoZWFkZXJbJ0ZFTiddID0gZmVuO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgaGVhZGVyWydTZXRVcCddO1xuICAgICAgZGVsZXRlIGhlYWRlclsnRkVOJ107XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KHNxdWFyZSkge1xuICAgIHZhciBwaWVjZSA9IGJvYXJkW1NRVUFSRVNbc3F1YXJlXV07XG4gICAgcmV0dXJuIChwaWVjZSkgPyB7dHlwZTogcGllY2UudHlwZSwgY29sb3I6IHBpZWNlLmNvbG9yfSA6IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBwdXQocGllY2UsIHNxdWFyZSkge1xuICAgIC8qIGNoZWNrIGZvciB2YWxpZCBwaWVjZSBvYmplY3QgKi9cbiAgICBpZiAoISgndHlwZScgaW4gcGllY2UgJiYgJ2NvbG9yJyBpbiBwaWVjZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiBjaGVjayBmb3IgcGllY2UgKi9cbiAgICBpZiAoU1lNQk9MUy5pbmRleE9mKHBpZWNlLnR5cGUudG9Mb3dlckNhc2UoKSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyogY2hlY2sgZm9yIHZhbGlkIHNxdWFyZSAqL1xuICAgIGlmICghKHNxdWFyZSBpbiBTUVVBUkVTKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBzcSA9IFNRVUFSRVNbc3F1YXJlXTtcblxuICAgIC8qIGRvbid0IGxldCB0aGUgdXNlciBwbGFjZSBtb3JlIHRoYW4gb25lIGtpbmcgKi9cbiAgICBpZiAocGllY2UudHlwZSA9PSBLSU5HICYmXG4gICAgICAgICEoa2luZ3NbcGllY2UuY29sb3JdID09IEVNUFRZIHx8IGtpbmdzW3BpZWNlLmNvbG9yXSA9PSBzcSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBib2FyZFtzcV0gPSB7dHlwZTogcGllY2UudHlwZSwgY29sb3I6IHBpZWNlLmNvbG9yfTtcbiAgICBpZiAocGllY2UudHlwZSA9PT0gS0lORykge1xuICAgICAga2luZ3NbcGllY2UuY29sb3JdID0gc3E7XG4gICAgfVxuXG4gICAgdXBkYXRlX3NldHVwKGdlbmVyYXRlX2ZlbigpKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlKHNxdWFyZSkge1xuICAgIHZhciBwaWVjZSA9IGdldChzcXVhcmUpO1xuICAgIGJvYXJkW1NRVUFSRVNbc3F1YXJlXV0gPSBudWxsO1xuICAgIGlmIChwaWVjZSAmJiBwaWVjZS50eXBlID09PSBLSU5HKSB7XG4gICAgICBraW5nc1twaWVjZS5jb2xvcl0gPSBFTVBUWTtcbiAgICB9XG5cbiAgICB1cGRhdGVfc2V0dXAoZ2VuZXJhdGVfZmVuKCkpO1xuXG4gICAgcmV0dXJuIHBpZWNlO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRfbW92ZShib2FyZCwgZnJvbSwgdG8sIGZsYWdzLCBwcm9tb3Rpb24pIHtcbiAgICB2YXIgbW92ZSA9IHtcbiAgICAgIGNvbG9yOiB0dXJuLFxuICAgICAgZnJvbTogZnJvbSxcbiAgICAgIHRvOiB0byxcbiAgICAgIGZsYWdzOiBmbGFncyxcbiAgICAgIHBpZWNlOiBib2FyZFtmcm9tXS50eXBlXG4gICAgfTtcblxuICAgIGlmIChwcm9tb3Rpb24pIHtcbiAgICAgIG1vdmUuZmxhZ3MgfD0gQklUUy5QUk9NT1RJT047XG4gICAgICBtb3ZlLnByb21vdGlvbiA9IHByb21vdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoYm9hcmRbdG9dKSB7XG4gICAgICBtb3ZlLmNhcHR1cmVkID0gYm9hcmRbdG9dLnR5cGU7XG4gICAgfSBlbHNlIGlmIChmbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgICBtb3ZlLmNhcHR1cmVkID0gUEFXTjtcbiAgICB9XG4gICAgcmV0dXJuIG1vdmU7XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZV9tb3ZlcyhvcHRpb25zKSB7XG4gICAgZnVuY3Rpb24gYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBmcm9tLCB0bywgZmxhZ3MpIHtcbiAgICAgIC8qIGlmIHBhd24gcHJvbW90aW9uICovXG4gICAgICBpZiAoYm9hcmRbZnJvbV0udHlwZSA9PT0gUEFXTiAmJlxuICAgICAgICAgKHJhbmsodG8pID09PSBSQU5LXzggfHwgcmFuayh0bykgPT09IFJBTktfMSkpIHtcbiAgICAgICAgICB2YXIgcGllY2VzID0gW1FVRUVOLCBST09LLCBCSVNIT1AsIEtOSUdIVF07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBpZWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbW92ZXMucHVzaChidWlsZF9tb3ZlKGJvYXJkLCBmcm9tLCB0bywgZmxhZ3MsIHBpZWNlc1tpXSkpO1xuICAgICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgbW92ZXMucHVzaChidWlsZF9tb3ZlKGJvYXJkLCBmcm9tLCB0bywgZmxhZ3MpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbW92ZXMgPSBbXTtcbiAgICB2YXIgdXMgPSB0dXJuO1xuICAgIHZhciB0aGVtID0gc3dhcF9jb2xvcih1cyk7XG4gICAgdmFyIHNlY29uZF9yYW5rID0ge2I6IFJBTktfNywgdzogUkFOS18yfTtcblxuICAgIHZhciBmaXJzdF9zcSA9IFNRVUFSRVMuYTg7XG4gICAgdmFyIGxhc3Rfc3EgPSBTUVVBUkVTLmgxO1xuICAgIHZhciBzaW5nbGVfc3F1YXJlID0gZmFsc2U7XG5cbiAgICAvKiBkbyB3ZSB3YW50IGxlZ2FsIG1vdmVzPyAqL1xuICAgIHZhciBsZWdhbCA9ICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2xlZ2FsJyBpbiBvcHRpb25zKSA/XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5sZWdhbCA6IHRydWU7XG5cbiAgICAvKiBhcmUgd2UgZ2VuZXJhdGluZyBtb3ZlcyBmb3IgYSBzaW5nbGUgc3F1YXJlPyAqL1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3NxdWFyZScgaW4gb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMuc3F1YXJlIGluIFNRVUFSRVMpIHtcbiAgICAgICAgZmlyc3Rfc3EgPSBsYXN0X3NxID0gU1FVQVJFU1tvcHRpb25zLnNxdWFyZV07XG4gICAgICAgIHNpbmdsZV9zcXVhcmUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogaW52YWxpZCBzcXVhcmUgKi9cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSBmaXJzdF9zcTsgaSA8PSBsYXN0X3NxOyBpKyspIHtcbiAgICAgIC8qIGRpZCB3ZSBydW4gb2ZmIHRoZSBlbmQgb2YgdGhlIGJvYXJkICovXG4gICAgICBpZiAoaSAmIDB4ODgpIHsgaSArPSA3OyBjb250aW51ZTsgfVxuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXTtcbiAgICAgIGlmIChwaWVjZSA9PSBudWxsIHx8IHBpZWNlLmNvbG9yICE9PSB1cykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgLyogc2luZ2xlIHNxdWFyZSwgbm9uLWNhcHR1cmluZyAqL1xuICAgICAgICB2YXIgc3F1YXJlID0gaSArIFBBV05fT0ZGU0VUU1t1c11bMF07XG4gICAgICAgIGlmIChib2FyZFtzcXVhcmVdID09IG51bGwpIHtcbiAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLk5PUk1BTCk7XG5cbiAgICAgICAgICAvKiBkb3VibGUgc3F1YXJlICovXG4gICAgICAgICAgdmFyIHNxdWFyZSA9IGkgKyBQQVdOX09GRlNFVFNbdXNdWzFdO1xuICAgICAgICAgIGlmIChzZWNvbmRfcmFua1t1c10gPT09IHJhbmsoaSkgJiYgYm9hcmRbc3F1YXJlXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5CSUdfUEFXTik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogcGF3biBjYXB0dXJlcyAqL1xuICAgICAgICBmb3IgKGogPSAyOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgdmFyIHNxdWFyZSA9IGkgKyBQQVdOX09GRlNFVFNbdXNdW2pdO1xuICAgICAgICAgIGlmIChzcXVhcmUgJiAweDg4KSBjb250aW51ZTtcblxuICAgICAgICAgIGlmIChib2FyZFtzcXVhcmVdICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgYm9hcmRbc3F1YXJlXS5jb2xvciA9PT0gdGhlbSkge1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5DQVBUVVJFKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNxdWFyZSA9PT0gZXBfc3F1YXJlKSB7XG4gICAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgZXBfc3F1YXJlLCBCSVRTLkVQX0NBUFRVUkUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IFBJRUNFX09GRlNFVFNbcGllY2UudHlwZV0ubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICB2YXIgb2Zmc2V0ID0gUElFQ0VfT0ZGU0VUU1twaWVjZS50eXBlXVtqXTtcbiAgICAgICAgICB2YXIgc3F1YXJlID0gaTtcblxuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBzcXVhcmUgKz0gb2Zmc2V0O1xuICAgICAgICAgICAgaWYgKHNxdWFyZSAmIDB4ODgpIGJyZWFrO1xuXG4gICAgICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3ZlcywgaSwgc3F1YXJlLCBCSVRTLk5PUk1BTCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoYm9hcmRbc3F1YXJlXS5jb2xvciA9PT0gdXMpIGJyZWFrO1xuICAgICAgICAgICAgICBhZGRfbW92ZShib2FyZCwgbW92ZXMsIGksIHNxdWFyZSwgQklUUy5DQVBUVVJFKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIGJyZWFrLCBpZiBrbmlnaHQgb3Iga2luZyAqL1xuICAgICAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09ICduJyB8fCBwaWVjZS50eXBlID09PSAnaycpIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGNoZWNrIGZvciBjYXN0bGluZyBpZjogYSkgd2UncmUgZ2VuZXJhdGluZyBhbGwgbW92ZXMsIG9yIGIpIHdlJ3JlIGRvaW5nXG4gICAgICogc2luZ2xlIHNxdWFyZSBtb3ZlIGdlbmVyYXRpb24gb24gdGhlIGtpbmcncyBzcXVhcmVcbiAgICAgKi9cbiAgICBpZiAoKCFzaW5nbGVfc3F1YXJlKSB8fCBsYXN0X3NxID09PSBraW5nc1t1c10pIHtcbiAgICAgIC8qIGtpbmctc2lkZSBjYXN0bGluZyAqL1xuICAgICAgaWYgKGNhc3RsaW5nW3VzXSAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ19mcm9tID0ga2luZ3NbdXNdO1xuICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBjYXN0bGluZ19mcm9tICsgMjtcblxuICAgICAgICBpZiAoYm9hcmRbY2FzdGxpbmdfZnJvbSArIDFdID09IG51bGwgJiZcbiAgICAgICAgICAgIGJvYXJkW2Nhc3RsaW5nX3RvXSAgICAgICA9PSBudWxsICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwga2luZ3NbdXNdKSAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX2Zyb20gKyAxKSAmJlxuICAgICAgICAgICAgIWF0dGFja2VkKHRoZW0sIGNhc3RsaW5nX3RvKSkge1xuICAgICAgICAgIGFkZF9tb3ZlKGJvYXJkLCBtb3Zlcywga2luZ3NbdXNdICwgY2FzdGxpbmdfdG8sXG4gICAgICAgICAgICAgICAgICAgQklUUy5LU0lERV9DQVNUTEUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIHF1ZWVuLXNpZGUgY2FzdGxpbmcgKi9cbiAgICAgIGlmIChjYXN0bGluZ1t1c10gJiBCSVRTLlFTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IGtpbmdzW3VzXTtcbiAgICAgICAgdmFyIGNhc3RsaW5nX3RvID0gY2FzdGxpbmdfZnJvbSAtIDI7XG5cbiAgICAgICAgaWYgKGJvYXJkW2Nhc3RsaW5nX2Zyb20gLSAxXSA9PSBudWxsICYmXG4gICAgICAgICAgICBib2FyZFtjYXN0bGluZ19mcm9tIC0gMl0gPT0gbnVsbCAmJlxuICAgICAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbSAtIDNdID09IG51bGwgJiZcbiAgICAgICAgICAgICFhdHRhY2tlZCh0aGVtLCBraW5nc1t1c10pICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfZnJvbSAtIDEpICYmXG4gICAgICAgICAgICAhYXR0YWNrZWQodGhlbSwgY2FzdGxpbmdfdG8pKSB7XG4gICAgICAgICAgYWRkX21vdmUoYm9hcmQsIG1vdmVzLCBraW5nc1t1c10sIGNhc3RsaW5nX3RvLFxuICAgICAgICAgICAgICAgICAgIEJJVFMuUVNJREVfQ0FTVExFKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIHJldHVybiBhbGwgcHNldWRvLWxlZ2FsIG1vdmVzICh0aGlzIGluY2x1ZGVzIG1vdmVzIHRoYXQgYWxsb3cgdGhlIGtpbmdcbiAgICAgKiB0byBiZSBjYXB0dXJlZClcbiAgICAgKi9cbiAgICBpZiAoIWxlZ2FsKSB7XG4gICAgICByZXR1cm4gbW92ZXM7XG4gICAgfVxuXG4gICAgLyogZmlsdGVyIG91dCBpbGxlZ2FsIG1vdmVzICovXG4gICAgdmFyIGxlZ2FsX21vdmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1vdmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYWtlX21vdmUobW92ZXNbaV0pO1xuICAgICAgaWYgKCFraW5nX2F0dGFja2VkKHVzKSkge1xuICAgICAgICBsZWdhbF9tb3Zlcy5wdXNoKG1vdmVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHVuZG9fbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBsZWdhbF9tb3ZlcztcbiAgfVxuXG4gIC8qIGNvbnZlcnQgYSBtb3ZlIGZyb20gMHg4OCBjb29yZGluYXRlcyB0byBTdGFuZGFyZCBBbGdlYnJhaWMgTm90YXRpb25cbiAgICogKFNBTilcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBzbG9wcHkgVXNlIHRoZSBzbG9wcHkgU0FOIGdlbmVyYXRvciB0byB3b3JrIGFyb3VuZCBvdmVyXG4gICAqIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZS4gIFNlZSBiZWxvdzpcbiAgICpcbiAgICogcjFicWtibnIvcHBwMnBwcC8ybjUvMUIxcFAzLzRQMy84L1BQUFAyUFAvUk5CUUsxTlIgYiBLUWtxIC0gMiA0XG4gICAqIDQuIC4uLiBOZ2U3IGlzIG92ZXJseSBkaXNhbWJpZ3VhdGVkIGJlY2F1c2UgdGhlIGtuaWdodCBvbiBjNiBpcyBwaW5uZWRcbiAgICogNC4gLi4uIE5lNyBpcyB0ZWNobmljYWxseSB0aGUgdmFsaWQgU0FOXG4gICAqL1xuICBmdW5jdGlvbiBtb3ZlX3RvX3Nhbihtb3ZlLCBzbG9wcHkpIHtcblxuICAgIHZhciBvdXRwdXQgPSAnJztcblxuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5LU0lERV9DQVNUTEUpIHtcbiAgICAgIG91dHB1dCA9ICdPLU8nO1xuICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICBvdXRwdXQgPSAnTy1PLU8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZGlzYW1iaWd1YXRvciA9IGdldF9kaXNhbWJpZ3VhdG9yKG1vdmUsIHNsb3BweSk7XG5cbiAgICAgIGlmIChtb3ZlLnBpZWNlICE9PSBQQVdOKSB7XG4gICAgICAgIG91dHB1dCArPSBtb3ZlLnBpZWNlLnRvVXBwZXJDYXNlKCkgKyBkaXNhbWJpZ3VhdG9yO1xuICAgICAgfVxuXG4gICAgICBpZiAobW92ZS5mbGFncyAmIChCSVRTLkNBUFRVUkUgfCBCSVRTLkVQX0NBUFRVUkUpKSB7XG4gICAgICAgIGlmIChtb3ZlLnBpZWNlID09PSBQQVdOKSB7XG4gICAgICAgICAgb3V0cHV0ICs9IGFsZ2VicmFpYyhtb3ZlLmZyb20pWzBdO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dCArPSAneCc7XG4gICAgICB9XG5cbiAgICAgIG91dHB1dCArPSBhbGdlYnJhaWMobW92ZS50byk7XG5cbiAgICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5QUk9NT1RJT04pIHtcbiAgICAgICAgb3V0cHV0ICs9ICc9JyArIG1vdmUucHJvbW90aW9uLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWFrZV9tb3ZlKG1vdmUpO1xuICAgIGlmIChpbl9jaGVjaygpKSB7XG4gICAgICBpZiAoaW5fY2hlY2ttYXRlKCkpIHtcbiAgICAgICAgb3V0cHV0ICs9ICcjJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCArPSAnKyc7XG4gICAgICB9XG4gICAgfVxuICAgIHVuZG9fbW92ZSgpO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8vIHBhcnNlcyBhbGwgb2YgdGhlIGRlY29yYXRvcnMgb3V0IG9mIGEgU0FOIHN0cmluZ1xuICBmdW5jdGlvbiBzdHJpcHBlZF9zYW4obW92ZSkge1xuICAgIHJldHVybiBtb3ZlLnJlcGxhY2UoLz0vLCcnKS5yZXBsYWNlKC9bKyNdP1s/IV0qJC8sJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrZWQoY29sb3IsIHNxdWFyZSkge1xuICAgIGlmIChzcXVhcmUgPCAwKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IFNRVUFSRVMuYTg7IGkgPD0gU1FVQVJFUy5oMTsgaSsrKSB7XG4gICAgICAvKiBkaWQgd2UgcnVuIG9mZiB0aGUgZW5kIG9mIHRoZSBib2FyZCAqL1xuICAgICAgaWYgKGkgJiAweDg4KSB7IGkgKz0gNzsgY29udGludWU7IH1cblxuICAgICAgLyogaWYgZW1wdHkgc3F1YXJlIG9yIHdyb25nIGNvbG9yICovXG4gICAgICBpZiAoYm9hcmRbaV0gPT0gbnVsbCB8fCBib2FyZFtpXS5jb2xvciAhPT0gY29sb3IpIGNvbnRpbnVlO1xuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXTtcbiAgICAgIHZhciBkaWZmZXJlbmNlID0gaSAtIHNxdWFyZTtcbiAgICAgIHZhciBpbmRleCA9IGRpZmZlcmVuY2UgKyAxMTk7XG5cbiAgICAgIGlmIChBVFRBQ0tTW2luZGV4XSAmICgxIDw8IFNISUZUU1twaWVjZS50eXBlXSkpIHtcbiAgICAgICAgaWYgKHBpZWNlLnR5cGUgPT09IFBBV04pIHtcbiAgICAgICAgICBpZiAoZGlmZmVyZW5jZSA+IDApIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5jb2xvciA9PT0gV0hJVEUpIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocGllY2UuY29sb3IgPT09IEJMQUNLKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBpZiB0aGUgcGllY2UgaXMgYSBrbmlnaHQgb3IgYSBraW5nICovXG4gICAgICAgIGlmIChwaWVjZS50eXBlID09PSAnbicgfHwgcGllY2UudHlwZSA9PT0gJ2snKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB2YXIgb2Zmc2V0ID0gUkFZU1tpbmRleF07XG4gICAgICAgIHZhciBqID0gaSArIG9mZnNldDtcblxuICAgICAgICB2YXIgYmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoaiAhPT0gc3F1YXJlKSB7XG4gICAgICAgICAgaWYgKGJvYXJkW2pdICE9IG51bGwpIHsgYmxvY2tlZCA9IHRydWU7IGJyZWFrOyB9XG4gICAgICAgICAgaiArPSBvZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWJsb2NrZWQpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGtpbmdfYXR0YWNrZWQoY29sb3IpIHtcbiAgICByZXR1cm4gYXR0YWNrZWQoc3dhcF9jb2xvcihjb2xvciksIGtpbmdzW2NvbG9yXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbl9jaGVjaygpIHtcbiAgICByZXR1cm4ga2luZ19hdHRhY2tlZCh0dXJuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX2NoZWNrbWF0ZSgpIHtcbiAgICByZXR1cm4gaW5fY2hlY2soKSAmJiBnZW5lcmF0ZV9tb3ZlcygpLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluX3N0YWxlbWF0ZSgpIHtcbiAgICByZXR1cm4gIWluX2NoZWNrKCkgJiYgZ2VuZXJhdGVfbW92ZXMoKS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKSB7XG4gICAgdmFyIHBpZWNlcyA9IHt9O1xuICAgIHZhciBiaXNob3BzID0gW107XG4gICAgdmFyIG51bV9waWVjZXMgPSAwO1xuICAgIHZhciBzcV9jb2xvciA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaTw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgc3FfY29sb3IgPSAoc3FfY29sb3IgKyAxKSAlIDI7XG4gICAgICBpZiAoaSAmIDB4ODgpIHsgaSArPSA3OyBjb250aW51ZTsgfVxuXG4gICAgICB2YXIgcGllY2UgPSBib2FyZFtpXTtcbiAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICBwaWVjZXNbcGllY2UudHlwZV0gPSAocGllY2UudHlwZSBpbiBwaWVjZXMpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlc1twaWVjZS50eXBlXSArIDEgOiAxO1xuICAgICAgICBpZiAocGllY2UudHlwZSA9PT0gQklTSE9QKSB7XG4gICAgICAgICAgYmlzaG9wcy5wdXNoKHNxX2NvbG9yKTtcbiAgICAgICAgfVxuICAgICAgICBudW1fcGllY2VzKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogayB2cy4gayAqL1xuICAgIGlmIChudW1fcGllY2VzID09PSAyKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAvKiBrIHZzLiBrbiAuLi4uIG9yIC4uLi4gayB2cy4ga2IgKi9cbiAgICBlbHNlIGlmIChudW1fcGllY2VzID09PSAzICYmIChwaWVjZXNbQklTSE9QXSA9PT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2VzW0tOSUdIVF0gPT09IDEpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAvKiBrYiB2cy4ga2Igd2hlcmUgYW55IG51bWJlciBvZiBiaXNob3BzIGFyZSBhbGwgb24gdGhlIHNhbWUgY29sb3IgKi9cbiAgICBlbHNlIGlmIChudW1fcGllY2VzID09PSBwaWVjZXNbQklTSE9QXSArIDIpIHtcbiAgICAgIHZhciBzdW0gPSAwO1xuICAgICAgdmFyIGxlbiA9IGJpc2hvcHMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzdW0gKz0gYmlzaG9wc1tpXTtcbiAgICAgIH1cbiAgICAgIGlmIChzdW0gPT09IDAgfHwgc3VtID09PSBsZW4pIHsgcmV0dXJuIHRydWU7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpIHtcbiAgICAvKiBUT0RPOiB3aGlsZSB0aGlzIGZ1bmN0aW9uIGlzIGZpbmUgZm9yIGNhc3VhbCB1c2UsIGEgYmV0dGVyXG4gICAgICogaW1wbGVtZW50YXRpb24gd291bGQgdXNlIGEgWm9icmlzdCBrZXkgKGluc3RlYWQgb2YgRkVOKS4gdGhlXG4gICAgICogWm9icmlzdCBrZXkgd291bGQgYmUgbWFpbnRhaW5lZCBpbiB0aGUgbWFrZV9tb3ZlL3VuZG9fbW92ZSBmdW5jdGlvbnMsXG4gICAgICogYXZvaWRpbmcgdGhlIGNvc3RseSB0aGF0IHdlIGRvIGJlbG93LlxuICAgICAqL1xuICAgIHZhciBtb3ZlcyA9IFtdO1xuICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgICB2YXIgcmVwZXRpdGlvbiA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBtb3ZlID0gdW5kb19tb3ZlKCk7XG4gICAgICBpZiAoIW1vdmUpIGJyZWFrO1xuICAgICAgbW92ZXMucHVzaChtb3ZlKTtcbiAgICB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLyogcmVtb3ZlIHRoZSBsYXN0IHR3byBmaWVsZHMgaW4gdGhlIEZFTiBzdHJpbmcsIHRoZXkncmUgbm90IG5lZWRlZFxuICAgICAgICogd2hlbiBjaGVja2luZyBmb3IgZHJhdyBieSByZXAgKi9cbiAgICAgIHZhciBmZW4gPSBnZW5lcmF0ZV9mZW4oKS5zcGxpdCgnICcpLnNsaWNlKDAsNCkuam9pbignICcpO1xuXG4gICAgICAvKiBoYXMgdGhlIHBvc2l0aW9uIG9jY3VycmVkIHRocmVlIG9yIG1vdmUgdGltZXMgKi9cbiAgICAgIHBvc2l0aW9uc1tmZW5dID0gKGZlbiBpbiBwb3NpdGlvbnMpID8gcG9zaXRpb25zW2Zlbl0gKyAxIDogMTtcbiAgICAgIGlmIChwb3NpdGlvbnNbZmVuXSA+PSAzKSB7XG4gICAgICAgIHJlcGV0aXRpb24gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW1vdmVzLmxlbmd0aCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1ha2VfbW92ZShtb3Zlcy5wb3AoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGV0aXRpb247XG4gIH1cblxuICBmdW5jdGlvbiBwdXNoKG1vdmUpIHtcbiAgICBoaXN0b3J5LnB1c2goe1xuICAgICAgbW92ZTogbW92ZSxcbiAgICAgIGtpbmdzOiB7Yjoga2luZ3MuYiwgdzoga2luZ3Mud30sXG4gICAgICB0dXJuOiB0dXJuLFxuICAgICAgY2FzdGxpbmc6IHtiOiBjYXN0bGluZy5iLCB3OiBjYXN0bGluZy53fSxcbiAgICAgIGVwX3NxdWFyZTogZXBfc3F1YXJlLFxuICAgICAgaGFsZl9tb3ZlczogaGFsZl9tb3ZlcyxcbiAgICAgIG1vdmVfbnVtYmVyOiBtb3ZlX251bWJlclxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZV9tb3ZlKG1vdmUpIHtcbiAgICB2YXIgdXMgPSB0dXJuO1xuICAgIHZhciB0aGVtID0gc3dhcF9jb2xvcih1cyk7XG4gICAgcHVzaChtb3ZlKTtcblxuICAgIGJvYXJkW21vdmUudG9dID0gYm9hcmRbbW92ZS5mcm9tXTtcbiAgICBib2FyZFttb3ZlLmZyb21dID0gbnVsbDtcblxuICAgIC8qIGlmIGVwIGNhcHR1cmUsIHJlbW92ZSB0aGUgY2FwdHVyZWQgcGF3biAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5FUF9DQVBUVVJFKSB7XG4gICAgICBpZiAodHVybiA9PT0gQkxBQ0spIHtcbiAgICAgICAgYm9hcmRbbW92ZS50byAtIDE2XSA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2FyZFttb3ZlLnRvICsgMTZdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBpZiBwYXduIHByb21vdGlvbiwgcmVwbGFjZSB3aXRoIG5ldyBwaWVjZSAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5QUk9NT1RJT04pIHtcbiAgICAgIGJvYXJkW21vdmUudG9dID0ge3R5cGU6IG1vdmUucHJvbW90aW9uLCBjb2xvcjogdXN9O1xuICAgIH1cblxuICAgIC8qIGlmIHdlIG1vdmVkIHRoZSBraW5nICovXG4gICAgaWYgKGJvYXJkW21vdmUudG9dLnR5cGUgPT09IEtJTkcpIHtcbiAgICAgIGtpbmdzW2JvYXJkW21vdmUudG9dLmNvbG9yXSA9IG1vdmUudG87XG5cbiAgICAgIC8qIGlmIHdlIGNhc3RsZWQsIG1vdmUgdGhlIHJvb2sgbmV4dCB0byB0aGUga2luZyAqL1xuICAgICAgaWYgKG1vdmUuZmxhZ3MgJiBCSVRTLktTSURFX0NBU1RMRSkge1xuICAgICAgICB2YXIgY2FzdGxpbmdfdG8gPSBtb3ZlLnRvIC0gMTtcbiAgICAgICAgdmFyIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvICsgMTtcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV07XG4gICAgICAgIGJvYXJkW2Nhc3RsaW5nX2Zyb21dID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIHZhciBjYXN0bGluZ190byA9IG1vdmUudG8gKyAxO1xuICAgICAgICB2YXIgY2FzdGxpbmdfZnJvbSA9IG1vdmUudG8gLSAyO1xuICAgICAgICBib2FyZFtjYXN0bGluZ190b10gPSBib2FyZFtjYXN0bGluZ19mcm9tXTtcbiAgICAgICAgYm9hcmRbY2FzdGxpbmdfZnJvbV0gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvKiB0dXJuIG9mZiBjYXN0bGluZyAqL1xuICAgICAgY2FzdGxpbmdbdXNdID0gJyc7XG4gICAgfVxuXG4gICAgLyogdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgbW92ZSBhIHJvb2sgKi9cbiAgICBpZiAoY2FzdGxpbmdbdXNdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUk9PS1NbdXNdLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChtb3ZlLmZyb20gPT09IFJPT0tTW3VzXVtpXS5zcXVhcmUgJiZcbiAgICAgICAgICAgIGNhc3RsaW5nW3VzXSAmIFJPT0tTW3VzXVtpXS5mbGFnKSB7XG4gICAgICAgICAgY2FzdGxpbmdbdXNdIF49IFJPT0tTW3VzXVtpXS5mbGFnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogdHVybiBvZmYgY2FzdGxpbmcgaWYgd2UgY2FwdHVyZSBhIHJvb2sgKi9cbiAgICBpZiAoY2FzdGxpbmdbdGhlbV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBST09LU1t0aGVtXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAobW92ZS50byA9PT0gUk9PS1NbdGhlbV1baV0uc3F1YXJlICYmXG4gICAgICAgICAgICBjYXN0bGluZ1t0aGVtXSAmIFJPT0tTW3RoZW1dW2ldLmZsYWcpIHtcbiAgICAgICAgICBjYXN0bGluZ1t0aGVtXSBePSBST09LU1t0aGVtXVtpXS5mbGFnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogaWYgYmlnIHBhd24gbW92ZSwgdXBkYXRlIHRoZSBlbiBwYXNzYW50IHNxdWFyZSAqL1xuICAgIGlmIChtb3ZlLmZsYWdzICYgQklUUy5CSUdfUEFXTikge1xuICAgICAgaWYgKHR1cm4gPT09ICdiJykge1xuICAgICAgICBlcF9zcXVhcmUgPSBtb3ZlLnRvIC0gMTY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcF9zcXVhcmUgPSBtb3ZlLnRvICsgMTY7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVwX3NxdWFyZSA9IEVNUFRZO1xuICAgIH1cblxuICAgIC8qIHJlc2V0IHRoZSA1MCBtb3ZlIGNvdW50ZXIgaWYgYSBwYXduIGlzIG1vdmVkIG9yIGEgcGllY2UgaXMgY2FwdHVyZWQgKi9cbiAgICBpZiAobW92ZS5waWVjZSA9PT0gUEFXTikge1xuICAgICAgaGFsZl9tb3ZlcyA9IDA7XG4gICAgfSBlbHNlIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuQ0FQVFVSRSB8IEJJVFMuRVBfQ0FQVFVSRSkpIHtcbiAgICAgIGhhbGZfbW92ZXMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYWxmX21vdmVzKys7XG4gICAgfVxuXG4gICAgaWYgKHR1cm4gPT09IEJMQUNLKSB7XG4gICAgICBtb3ZlX251bWJlcisrO1xuICAgIH1cbiAgICB0dXJuID0gc3dhcF9jb2xvcih0dXJuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuZG9fbW92ZSgpIHtcbiAgICB2YXIgb2xkID0gaGlzdG9yeS5wb3AoKTtcbiAgICBpZiAob2xkID09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHZhciBtb3ZlID0gb2xkLm1vdmU7XG4gICAga2luZ3MgPSBvbGQua2luZ3M7XG4gICAgdHVybiA9IG9sZC50dXJuO1xuICAgIGNhc3RsaW5nID0gb2xkLmNhc3RsaW5nO1xuICAgIGVwX3NxdWFyZSA9IG9sZC5lcF9zcXVhcmU7XG4gICAgaGFsZl9tb3ZlcyA9IG9sZC5oYWxmX21vdmVzO1xuICAgIG1vdmVfbnVtYmVyID0gb2xkLm1vdmVfbnVtYmVyO1xuXG4gICAgdmFyIHVzID0gdHVybjtcbiAgICB2YXIgdGhlbSA9IHN3YXBfY29sb3IodHVybik7XG5cbiAgICBib2FyZFttb3ZlLmZyb21dID0gYm9hcmRbbW92ZS50b107XG4gICAgYm9hcmRbbW92ZS5mcm9tXS50eXBlID0gbW92ZS5waWVjZTsgIC8vIHRvIHVuZG8gYW55IHByb21vdGlvbnNcbiAgICBib2FyZFttb3ZlLnRvXSA9IG51bGw7XG5cbiAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuQ0FQVFVSRSkge1xuICAgICAgYm9hcmRbbW92ZS50b10gPSB7dHlwZTogbW92ZS5jYXB0dXJlZCwgY29sb3I6IHRoZW19O1xuICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuRVBfQ0FQVFVSRSkge1xuICAgICAgdmFyIGluZGV4O1xuICAgICAgaWYgKHVzID09PSBCTEFDSykge1xuICAgICAgICBpbmRleCA9IG1vdmUudG8gLSAxNjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4ID0gbW92ZS50byArIDE2O1xuICAgICAgfVxuICAgICAgYm9hcmRbaW5kZXhdID0ge3R5cGU6IFBBV04sIGNvbG9yOiB0aGVtfTtcbiAgICB9XG5cblxuICAgIGlmIChtb3ZlLmZsYWdzICYgKEJJVFMuS1NJREVfQ0FTVExFIHwgQklUUy5RU0lERV9DQVNUTEUpKSB7XG4gICAgICB2YXIgY2FzdGxpbmdfdG8sIGNhc3RsaW5nX2Zyb207XG4gICAgICBpZiAobW92ZS5mbGFncyAmIEJJVFMuS1NJREVfQ0FTVExFKSB7XG4gICAgICAgIGNhc3RsaW5nX3RvID0gbW92ZS50byArIDE7XG4gICAgICAgIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvIC0gMTtcbiAgICAgIH0gZWxzZSBpZiAobW92ZS5mbGFncyAmIEJJVFMuUVNJREVfQ0FTVExFKSB7XG4gICAgICAgIGNhc3RsaW5nX3RvID0gbW92ZS50byAtIDI7XG4gICAgICAgIGNhc3RsaW5nX2Zyb20gPSBtb3ZlLnRvICsgMTtcbiAgICAgIH1cblxuICAgICAgYm9hcmRbY2FzdGxpbmdfdG9dID0gYm9hcmRbY2FzdGxpbmdfZnJvbV07XG4gICAgICBib2FyZFtjYXN0bGluZ19mcm9tXSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmU7XG4gIH1cblxuICAvKiB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgYW1iaWd1b3VzIG1vdmVzICovXG4gIGZ1bmN0aW9uIGdldF9kaXNhbWJpZ3VhdG9yKG1vdmUsIHNsb3BweSkge1xuICAgIHZhciBtb3ZlcyA9IGdlbmVyYXRlX21vdmVzKHtsZWdhbDogIXNsb3BweX0pO1xuXG4gICAgdmFyIGZyb20gPSBtb3ZlLmZyb207XG4gICAgdmFyIHRvID0gbW92ZS50bztcbiAgICB2YXIgcGllY2UgPSBtb3ZlLnBpZWNlO1xuXG4gICAgdmFyIGFtYmlndWl0aWVzID0gMDtcbiAgICB2YXIgc2FtZV9yYW5rID0gMDtcbiAgICB2YXIgc2FtZV9maWxlID0gMDtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGFtYmlnX2Zyb20gPSBtb3Zlc1tpXS5mcm9tO1xuICAgICAgdmFyIGFtYmlnX3RvID0gbW92ZXNbaV0udG87XG4gICAgICB2YXIgYW1iaWdfcGllY2UgPSBtb3Zlc1tpXS5waWVjZTtcblxuICAgICAgLyogaWYgYSBtb3ZlIG9mIHRoZSBzYW1lIHBpZWNlIHR5cGUgZW5kcyBvbiB0aGUgc2FtZSB0byBzcXVhcmUsIHdlJ2xsXG4gICAgICAgKiBuZWVkIHRvIGFkZCBhIGRpc2FtYmlndWF0b3IgdG8gdGhlIGFsZ2VicmFpYyBub3RhdGlvblxuICAgICAgICovXG4gICAgICBpZiAocGllY2UgPT09IGFtYmlnX3BpZWNlICYmIGZyb20gIT09IGFtYmlnX2Zyb20gJiYgdG8gPT09IGFtYmlnX3RvKSB7XG4gICAgICAgIGFtYmlndWl0aWVzKys7XG5cbiAgICAgICAgaWYgKHJhbmsoZnJvbSkgPT09IHJhbmsoYW1iaWdfZnJvbSkpIHtcbiAgICAgICAgICBzYW1lX3JhbmsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlKGZyb20pID09PSBmaWxlKGFtYmlnX2Zyb20pKSB7XG4gICAgICAgICAgc2FtZV9maWxlKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYW1iaWd1aXRpZXMgPiAwKSB7XG4gICAgICAvKiBpZiB0aGVyZSBleGlzdHMgYSBzaW1pbGFyIG1vdmluZyBwaWVjZSBvbiB0aGUgc2FtZSByYW5rIGFuZCBmaWxlIGFzXG4gICAgICAgKiB0aGUgbW92ZSBpbiBxdWVzdGlvbiwgdXNlIHRoZSBzcXVhcmUgYXMgdGhlIGRpc2FtYmlndWF0b3JcbiAgICAgICAqL1xuICAgICAgaWYgKHNhbWVfcmFuayA+IDAgJiYgc2FtZV9maWxlID4gMCkge1xuICAgICAgICByZXR1cm4gYWxnZWJyYWljKGZyb20pO1xuICAgICAgfVxuICAgICAgLyogaWYgdGhlIG1vdmluZyBwaWVjZSByZXN0cyBvbiB0aGUgc2FtZSBmaWxlLCB1c2UgdGhlIHJhbmsgc3ltYm9sIGFzIHRoZVxuICAgICAgICogZGlzYW1iaWd1YXRvclxuICAgICAgICovXG4gICAgICBlbHNlIGlmIChzYW1lX2ZpbGUgPiAwKSB7XG4gICAgICAgIHJldHVybiBhbGdlYnJhaWMoZnJvbSkuY2hhckF0KDEpO1xuICAgICAgfVxuICAgICAgLyogZWxzZSB1c2UgdGhlIGZpbGUgc3ltYm9sICovXG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFsZ2VicmFpYyhmcm9tKS5jaGFyQXQoMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNjaWkoKSB7XG4gICAgdmFyIHMgPSAnICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcXG4nO1xuICAgIGZvciAodmFyIGkgPSBTUVVBUkVTLmE4OyBpIDw9IFNRVUFSRVMuaDE7IGkrKykge1xuICAgICAgLyogZGlzcGxheSB0aGUgcmFuayAqL1xuICAgICAgaWYgKGZpbGUoaSkgPT09IDApIHtcbiAgICAgICAgcyArPSAnICcgKyAnODc2NTQzMjEnW3JhbmsoaSldICsgJyB8JztcbiAgICAgIH1cblxuICAgICAgLyogZW1wdHkgcGllY2UgKi9cbiAgICAgIGlmIChib2FyZFtpXSA9PSBudWxsKSB7XG4gICAgICAgIHMgKz0gJyAuICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGllY2UgPSBib2FyZFtpXS50eXBlO1xuICAgICAgICB2YXIgY29sb3IgPSBib2FyZFtpXS5jb2xvcjtcbiAgICAgICAgdmFyIHN5bWJvbCA9IChjb2xvciA9PT0gV0hJVEUpID9cbiAgICAgICAgICAgICAgICAgICAgIHBpZWNlLnRvVXBwZXJDYXNlKCkgOiBwaWVjZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBzICs9ICcgJyArIHN5bWJvbCArICcgJztcbiAgICAgIH1cblxuICAgICAgaWYgKChpICsgMSkgJiAweDg4KSB7XG4gICAgICAgIHMgKz0gJ3xcXG4nO1xuICAgICAgICBpICs9IDg7XG4gICAgICB9XG4gICAgfVxuICAgIHMgKz0gJyAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXFxuJztcbiAgICBzICs9ICcgICAgIGEgIGIgIGMgIGQgIGUgIGYgIGcgIGhcXG4nO1xuXG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICAvLyBjb252ZXJ0IGEgbW92ZSBmcm9tIFN0YW5kYXJkIEFsZ2VicmFpYyBOb3RhdGlvbiAoU0FOKSB0byAweDg4IGNvb3JkaW5hdGVzXG4gIGZ1bmN0aW9uIG1vdmVfZnJvbV9zYW4obW92ZSwgc2xvcHB5KSB7XG4gICAgLy8gc3RyaXAgb2ZmIGFueSBtb3ZlIGRlY29yYXRpb25zOiBlLmcgTmYzKz8hXG4gICAgdmFyIGNsZWFuX21vdmUgPSBzdHJpcHBlZF9zYW4obW92ZSk7XG5cbiAgICAvLyBpZiB3ZSdyZSB1c2luZyB0aGUgc2xvcHB5IHBhcnNlciBydW4gYSByZWdleCB0byBncmFiIHBpZWNlLCB0bywgYW5kIGZyb21cbiAgICAvLyB0aGlzIHNob3VsZCBwYXJzZSBpbnZhbGlkIFNBTiBsaWtlOiBQZTItZTQsIFJjMWM0LCBRZjN4ZjdcbiAgICBpZiAoc2xvcHB5KSB7XG4gICAgICB2YXIgbWF0Y2hlcyA9IGNsZWFuX21vdmUubWF0Y2goLyhbcG5icnFrUE5CUlFLXSk/KFthLWhdWzEtOF0peD8tPyhbYS1oXVsxLThdKShbcXJiblFSQk5dKT8vKTtcbiAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgIHZhciBwaWVjZSA9IG1hdGNoZXNbMV07XG4gICAgICAgIHZhciBmcm9tID0gbWF0Y2hlc1syXTtcbiAgICAgICAgdmFyIHRvID0gbWF0Y2hlc1szXTtcbiAgICAgICAgdmFyIHByb21vdGlvbiA9IG1hdGNoZXNbNF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIC8vIHRyeSB0aGUgc3RyaWN0IHBhcnNlciBmaXJzdCwgdGhlbiB0aGUgc2xvcHB5IHBhcnNlciBpZiByZXF1ZXN0ZWRcbiAgICAgIC8vIGJ5IHRoZSB1c2VyXG4gICAgICBpZiAoKGNsZWFuX21vdmUgPT09IHN0cmlwcGVkX3Nhbihtb3ZlX3RvX3Nhbihtb3Zlc1tpXSkpKSB8fFxuICAgICAgICAgIChzbG9wcHkgJiYgY2xlYW5fbW92ZSA9PT0gc3RyaXBwZWRfc2FuKG1vdmVfdG9fc2FuKG1vdmVzW2ldLCB0cnVlKSkpKSB7XG4gICAgICAgIHJldHVybiBtb3Zlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtYXRjaGVzICYmXG4gICAgICAgICAgICAoIXBpZWNlIHx8IHBpZWNlLnRvTG93ZXJDYXNlKCkgPT0gbW92ZXNbaV0ucGllY2UpICYmXG4gICAgICAgICAgICBTUVVBUkVTW2Zyb21dID09IG1vdmVzW2ldLmZyb20gJiZcbiAgICAgICAgICAgIFNRVUFSRVNbdG9dID09IG1vdmVzW2ldLnRvICYmXG4gICAgICAgICAgICAoIXByb21vdGlvbiB8fCBwcm9tb3Rpb24udG9Mb3dlckNhc2UoKSA9PSBtb3Zlc1tpXS5wcm9tb3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG1vdmVzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBVVElMSVRZIEZVTkNUSU9OU1xuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgZnVuY3Rpb24gcmFuayhpKSB7XG4gICAgcmV0dXJuIGkgPj4gNDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGUoaSkge1xuICAgIHJldHVybiBpICYgMTU7XG4gIH1cblxuICBmdW5jdGlvbiBhbGdlYnJhaWMoaSl7XG4gICAgdmFyIGYgPSBmaWxlKGkpLCByID0gcmFuayhpKTtcbiAgICByZXR1cm4gJ2FiY2RlZmdoJy5zdWJzdHJpbmcoZixmKzEpICsgJzg3NjU0MzIxJy5zdWJzdHJpbmcocixyKzEpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dhcF9jb2xvcihjKSB7XG4gICAgcmV0dXJuIGMgPT09IFdISVRFID8gQkxBQ0sgOiBXSElURTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzX2RpZ2l0KGMpIHtcbiAgICByZXR1cm4gJzAxMjM0NTY3ODknLmluZGV4T2YoYykgIT09IC0xO1xuICB9XG5cbiAgLyogcHJldHR5ID0gZXh0ZXJuYWwgbW92ZSBvYmplY3QgKi9cbiAgZnVuY3Rpb24gbWFrZV9wcmV0dHkodWdseV9tb3ZlKSB7XG4gICAgdmFyIG1vdmUgPSBjbG9uZSh1Z2x5X21vdmUpO1xuICAgIG1vdmUuc2FuID0gbW92ZV90b19zYW4obW92ZSwgZmFsc2UpO1xuICAgIG1vdmUudG8gPSBhbGdlYnJhaWMobW92ZS50byk7XG4gICAgbW92ZS5mcm9tID0gYWxnZWJyYWljKG1vdmUuZnJvbSk7XG5cbiAgICB2YXIgZmxhZ3MgPSAnJztcblxuICAgIGZvciAodmFyIGZsYWcgaW4gQklUUykge1xuICAgICAgaWYgKEJJVFNbZmxhZ10gJiBtb3ZlLmZsYWdzKSB7XG4gICAgICAgIGZsYWdzICs9IEZMQUdTW2ZsYWddO1xuICAgICAgfVxuICAgIH1cbiAgICBtb3ZlLmZsYWdzID0gZmxhZ3M7XG5cbiAgICByZXR1cm4gbW92ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIHZhciBkdXBlID0gKG9iaiBpbnN0YW5jZW9mIEFycmF5KSA/IFtdIDoge307XG5cbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGR1cGVbcHJvcGVydHldID0gY2xvbmUob2JqW3Byb3BlcnR5XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkdXBlW3Byb3BlcnR5XSA9IG9ialtwcm9wZXJ0eV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGR1cGU7XG4gIH1cblxuICBmdW5jdGlvbiB0cmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIERFQlVHR0lORyBVVElMSVRJRVNcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gIGZ1bmN0aW9uIHBlcmZ0KGRlcHRoKSB7XG4gICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoe2xlZ2FsOiBmYWxzZX0pO1xuICAgIHZhciBub2RlcyA9IDA7XG4gICAgdmFyIGNvbG9yID0gdHVybjtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtb3Zlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWFrZV9tb3ZlKG1vdmVzW2ldKTtcbiAgICAgIGlmICgha2luZ19hdHRhY2tlZChjb2xvcikpIHtcbiAgICAgICAgaWYgKGRlcHRoIC0gMSA+IDApIHtcbiAgICAgICAgICB2YXIgY2hpbGRfbm9kZXMgPSBwZXJmdChkZXB0aCAtIDEpO1xuICAgICAgICAgIG5vZGVzICs9IGNoaWxkX25vZGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVzKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHVuZG9fbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFBVQkxJQyBDT05TVEFOVFMgKGlzIHRoZXJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzPylcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgV0hJVEU6IFdISVRFLFxuICAgIEJMQUNLOiBCTEFDSyxcbiAgICBQQVdOOiBQQVdOLFxuICAgIEtOSUdIVDogS05JR0hULFxuICAgIEJJU0hPUDogQklTSE9QLFxuICAgIFJPT0s6IFJPT0ssXG4gICAgUVVFRU46IFFVRUVOLFxuICAgIEtJTkc6IEtJTkcsXG4gICAgU1FVQVJFUzogKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8qIGZyb20gdGhlIEVDTUEtMjYyIHNwZWMgKHNlY3Rpb24gMTIuNi40KTpcbiAgICAgICAgICAgICAgICAgKiBcIlRoZSBtZWNoYW5pY3Mgb2YgZW51bWVyYXRpbmcgdGhlIHByb3BlcnRpZXMgLi4uIGlzXG4gICAgICAgICAgICAgICAgICogaW1wbGVtZW50YXRpb24gZGVwZW5kZW50XCJcbiAgICAgICAgICAgICAgICAgKiBzbzogZm9yICh2YXIgc3EgaW4gU1FVQVJFUykgeyBrZXlzLnB1c2goc3EpOyB9IG1pZ2h0IG5vdCBiZVxuICAgICAgICAgICAgICAgICAqIG9yZGVyZWQgY29ycmVjdGx5XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gU1FVQVJFUy5hODsgaSA8PSBTUVVBUkVTLmgxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChpICYgMHg4OCkgeyBpICs9IDc7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICBrZXlzLnB1c2goYWxnZWJyYWljKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICAgICAgICAgIH0pKCksXG4gICAgRkxBR1M6IEZMQUdTLFxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIFBVQkxJQyBBUElcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgbG9hZDogZnVuY3Rpb24oZmVuKSB7XG4gICAgICByZXR1cm4gbG9hZChmZW4pO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzZXQoKTtcbiAgICB9LFxuXG4gICAgbW92ZXM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qIFRoZSBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiBhIGNoZXNzIG1vdmUgaXMgaW4gMHg4OCBmb3JtYXQsIGFuZFxuICAgICAgICogbm90IG1lYW50IHRvIGJlIGh1bWFuLXJlYWRhYmxlLiAgVGhlIGNvZGUgYmVsb3cgY29udmVydHMgdGhlIDB4ODhcbiAgICAgICAqIHNxdWFyZSBjb29yZGluYXRlcyB0byBhbGdlYnJhaWMgY29vcmRpbmF0ZXMuICBJdCBhbHNvIHBydW5lcyBhblxuICAgICAgICogdW5uZWNlc3NhcnkgbW92ZSBrZXlzIHJlc3VsdGluZyBmcm9tIGEgdmVyYm9zZSBjYWxsLlxuICAgICAgICovXG5cbiAgICAgIHZhciB1Z2x5X21vdmVzID0gZ2VuZXJhdGVfbW92ZXMob3B0aW9ucyk7XG4gICAgICB2YXIgbW92ZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHVnbHlfbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAvKiBkb2VzIHRoZSB1c2VyIHdhbnQgYSBmdWxsIG1vdmUgb2JqZWN0IChtb3N0IGxpa2VseSBub3QpLCBvciBqdXN0XG4gICAgICAgICAqIFNBTlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiAndmVyYm9zZScgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgICAgb3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAgICAgbW92ZXMucHVzaChtYWtlX3ByZXR0eSh1Z2x5X21vdmVzW2ldKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW92ZXMucHVzaChtb3ZlX3RvX3Nhbih1Z2x5X21vdmVzW2ldLCBmYWxzZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtb3ZlcztcbiAgICB9LFxuXG4gICAgaW5fY2hlY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGluX2NoZWNrKCk7XG4gICAgfSxcblxuICAgIGluX2NoZWNrbWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fY2hlY2ttYXRlKCk7XG4gICAgfSxcblxuICAgIGluX3N0YWxlbWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5fc3RhbGVtYXRlKCk7XG4gICAgfSxcblxuICAgIGluX2RyYXc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGhhbGZfbW92ZXMgPj0gMTAwIHx8XG4gICAgICAgICAgICAgaW5fc3RhbGVtYXRlKCkgfHxcbiAgICAgICAgICAgICBpbnN1ZmZpY2llbnRfbWF0ZXJpYWwoKSB8fFxuICAgICAgICAgICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uKCk7XG4gICAgfSxcblxuICAgIGluc3VmZmljaWVudF9tYXRlcmlhbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5zdWZmaWNpZW50X21hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIGluX3RocmVlZm9sZF9yZXBldGl0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbl90aHJlZWZvbGRfcmVwZXRpdGlvbigpO1xuICAgIH0sXG5cbiAgICBnYW1lX292ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGhhbGZfbW92ZXMgPj0gMTAwIHx8XG4gICAgICAgICAgICAgaW5fY2hlY2ttYXRlKCkgfHxcbiAgICAgICAgICAgICBpbl9zdGFsZW1hdGUoKSB8fFxuICAgICAgICAgICAgIGluc3VmZmljaWVudF9tYXRlcmlhbCgpIHx8XG4gICAgICAgICAgICAgaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGVfZmVuOiBmdW5jdGlvbihmZW4pIHtcbiAgICAgIHJldHVybiB2YWxpZGF0ZV9mZW4oZmVuKTtcbiAgICB9LFxuXG4gICAgZmVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBnZW5lcmF0ZV9mZW4oKTtcbiAgICB9LFxuXG4gICAgcGduOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKiB1c2luZyB0aGUgc3BlY2lmaWNhdGlvbiBmcm9tIGh0dHA6Ly93d3cuY2hlc3NjbHViLmNvbS9oZWxwL1BHTi1zcGVjXG4gICAgICAgKiBleGFtcGxlIGZvciBodG1sIHVzYWdlOiAucGduKHsgbWF4X3dpZHRoOiA3MiwgbmV3bGluZV9jaGFyOiBcIjxiciAvPlwiIH0pXG4gICAgICAgKi9cbiAgICAgIHZhciBuZXdsaW5lID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9wdGlvbnMubmV3bGluZV9jaGFyID09PSAnc3RyaW5nJykgP1xuICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5uZXdsaW5lX2NoYXIgOiAnXFxuJztcbiAgICAgIHZhciBtYXhfd2lkdGggPSAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLm1heF93aWR0aCA9PT0gJ251bWJlcicpID9cbiAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tYXhfd2lkdGggOiAwO1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIGhlYWRlcl9leGlzdHMgPSBmYWxzZTtcblxuICAgICAgLyogYWRkIHRoZSBQR04gaGVhZGVyIGhlYWRlcnJtYXRpb24gKi9cbiAgICAgIGZvciAodmFyIGkgaW4gaGVhZGVyKSB7XG4gICAgICAgIC8qIFRPRE86IG9yZGVyIG9mIGVudW1lcmF0ZWQgcHJvcGVydGllcyBpbiBoZWFkZXIgb2JqZWN0IGlzIG5vdFxuICAgICAgICAgKiBndWFyYW50ZWVkLCBzZWUgRUNNQS0yNjIgc3BlYyAoc2VjdGlvbiAxMi42LjQpXG4gICAgICAgICAqL1xuICAgICAgICByZXN1bHQucHVzaCgnWycgKyBpICsgJyBcXFwiJyArIGhlYWRlcltpXSArICdcXFwiXScgKyBuZXdsaW5lKTtcbiAgICAgICAgaGVhZGVyX2V4aXN0cyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChoZWFkZXJfZXhpc3RzICYmIGhpc3RvcnkubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG5ld2xpbmUpO1xuICAgICAgfVxuXG4gICAgICAvKiBwb3AgYWxsIG9mIGhpc3Rvcnkgb250byByZXZlcnNlZF9oaXN0b3J5ICovXG4gICAgICB2YXIgcmV2ZXJzZWRfaGlzdG9yeSA9IFtdO1xuICAgICAgd2hpbGUgKGhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICByZXZlcnNlZF9oaXN0b3J5LnB1c2godW5kb19tb3ZlKCkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbW92ZXMgPSBbXTtcbiAgICAgIHZhciBtb3ZlX3N0cmluZyA9ICcnO1xuXG4gICAgICAvKiBidWlsZCB0aGUgbGlzdCBvZiBtb3Zlcy4gIGEgbW92ZV9zdHJpbmcgbG9va3MgbGlrZTogXCIzLiBlMyBlNlwiICovXG4gICAgICB3aGlsZSAocmV2ZXJzZWRfaGlzdG9yeS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBtb3ZlID0gcmV2ZXJzZWRfaGlzdG9yeS5wb3AoKTtcblxuICAgICAgICAvKiBpZiB0aGUgcG9zaXRpb24gc3RhcnRlZCB3aXRoIGJsYWNrIHRvIG1vdmUsIHN0YXJ0IFBHTiB3aXRoIDEuIC4uLiAqL1xuICAgICAgICBpZiAoIWhpc3RvcnkubGVuZ3RoICYmIG1vdmUuY29sb3IgPT09ICdiJykge1xuICAgICAgICAgIG1vdmVfc3RyaW5nID0gbW92ZV9udW1iZXIgKyAnLiAuLi4nO1xuICAgICAgICB9IGVsc2UgaWYgKG1vdmUuY29sb3IgPT09ICd3Jykge1xuICAgICAgICAgIC8qIHN0b3JlIHRoZSBwcmV2aW91cyBnZW5lcmF0ZWQgbW92ZV9zdHJpbmcgaWYgd2UgaGF2ZSBvbmUgKi9cbiAgICAgICAgICBpZiAobW92ZV9zdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBtb3Zlcy5wdXNoKG1vdmVfc3RyaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZV9zdHJpbmcgPSBtb3ZlX251bWJlciArICcuJztcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVfc3RyaW5nID0gbW92ZV9zdHJpbmcgKyAnICcgKyBtb3ZlX3RvX3Nhbihtb3ZlLCBmYWxzZSk7XG4gICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgIH1cblxuICAgICAgLyogYXJlIHRoZXJlIGFueSBvdGhlciBsZWZ0b3ZlciBtb3Zlcz8gKi9cbiAgICAgIGlmIChtb3ZlX3N0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgbW92ZXMucHVzaChtb3ZlX3N0cmluZyk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzIHRoZXJlIGEgcmVzdWx0PyAqL1xuICAgICAgaWYgKHR5cGVvZiBoZWFkZXIuUmVzdWx0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb3Zlcy5wdXNoKGhlYWRlci5SZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICAvKiBoaXN0b3J5IHNob3VsZCBiZSBiYWNrIHRvIHdoYXQgaXMgd2FzIGJlZm9yZSB3ZSBzdGFydGVkIGdlbmVyYXRpbmcgUEdOLFxuICAgICAgICogc28gam9pbiB0b2dldGhlciBtb3Zlc1xuICAgICAgICovXG4gICAgICBpZiAobWF4X3dpZHRoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignJykgKyBtb3Zlcy5qb2luKCcgJyk7XG4gICAgICB9XG5cbiAgICAgIC8qIHdyYXAgdGhlIFBHTiBvdXRwdXQgYXQgbWF4X3dpZHRoICovXG4gICAgICB2YXIgY3VycmVudF93aWR0aCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8qIGlmIHRoZSBjdXJyZW50IG1vdmUgd2lsbCBwdXNoIHBhc3QgbWF4X3dpZHRoICovXG4gICAgICAgIGlmIChjdXJyZW50X3dpZHRoICsgbW92ZXNbaV0ubGVuZ3RoID4gbWF4X3dpZHRoICYmIGkgIT09IDApIHtcblxuICAgICAgICAgIC8qIGRvbid0IGVuZCB0aGUgbGluZSB3aXRoIHdoaXRlc3BhY2UgKi9cbiAgICAgICAgICBpZiAocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICByZXN1bHQucG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0LnB1c2gobmV3bGluZSk7XG4gICAgICAgICAgY3VycmVudF93aWR0aCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoaSAhPT0gMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKCcgJyk7XG4gICAgICAgICAgY3VycmVudF93aWR0aCsrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKG1vdmVzW2ldKTtcbiAgICAgICAgY3VycmVudF93aWR0aCArPSBtb3Zlc1tpXS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfSxcblxuICAgIGxvYWRfcGduOiBmdW5jdGlvbihwZ24sIG9wdGlvbnMpIHtcbiAgICAgIC8vIGFsbG93IHRoZSB1c2VyIHRvIHNwZWNpZnkgdGhlIHNsb3BweSBtb3ZlIHBhcnNlciB0byB3b3JrIGFyb3VuZCBvdmVyXG4gICAgICAvLyBkaXNhbWJpZ3VhdGlvbiBidWdzIGluIEZyaXR6IGFuZCBDaGVzc2Jhc2VcbiAgICAgIHZhciBzbG9wcHkgPSAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmICdzbG9wcHknIGluIG9wdGlvbnMpID9cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zbG9wcHkgOiBmYWxzZTtcblxuICAgICAgZnVuY3Rpb24gbWFzayhzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcL2csICdcXFxcJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc19rZXlzKG9iamVjdCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXJzZV9wZ25faGVhZGVyKGhlYWRlciwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbmV3bGluZV9jaGFyID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zLm5ld2xpbmVfY2hhciA9PT0gJ3N0cmluZycpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5ld2xpbmVfY2hhciA6ICdcXHI/XFxuJztcbiAgICAgICAgdmFyIGhlYWRlcl9vYmogPSB7fTtcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBoZWFkZXIuc3BsaXQobmV3IFJlZ0V4cChtYXNrKG5ld2xpbmVfY2hhcikpKTtcbiAgICAgICAgdmFyIGtleSA9ICcnO1xuICAgICAgICB2YXIgdmFsdWUgPSAnJztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBrZXkgPSBoZWFkZXJzW2ldLnJlcGxhY2UoL15cXFsoW0EtWl1bQS1aYS16XSopXFxzLipcXF0kLywgJyQxJyk7XG4gICAgICAgICAgdmFsdWUgPSBoZWFkZXJzW2ldLnJlcGxhY2UoL15cXFtbQS1aYS16XStcXHNcIiguKilcIlxcXSQvLCAnJDEnKTtcbiAgICAgICAgICBpZiAodHJpbShrZXkpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGhlYWRlcl9vYmpba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWFkZXJfb2JqO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3bGluZV9jaGFyID0gKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy5uZXdsaW5lX2NoYXIgPT09ICdzdHJpbmcnKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubmV3bGluZV9jaGFyIDogJ1xccj9cXG4nO1xuICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXihcXFxcWygufCcgKyBtYXNrKG5ld2xpbmVfY2hhcikgKyAnKSpcXFxcXSknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgbWFzayhuZXdsaW5lX2NoYXIpICsgJykqJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICcxLignICsgbWFzayhuZXdsaW5lX2NoYXIpICsgJ3wuKSokJywgJ2cnKTtcblxuICAgICAgLyogZ2V0IGhlYWRlciBwYXJ0IG9mIHRoZSBQR04gZmlsZSAqL1xuICAgICAgdmFyIGhlYWRlcl9zdHJpbmcgPSBwZ24ucmVwbGFjZShyZWdleCwgJyQxJyk7XG5cbiAgICAgIC8qIG5vIGluZm8gcGFydCBnaXZlbiwgYmVnaW5zIHdpdGggbW92ZXMgKi9cbiAgICAgIGlmIChoZWFkZXJfc3RyaW5nWzBdICE9PSAnWycpIHtcbiAgICAgICAgaGVhZGVyX3N0cmluZyA9ICcnO1xuICAgICAgfVxuXG4gICAgICByZXNldCgpO1xuXG4gICAgICAvKiBwYXJzZSBQR04gaGVhZGVyICovXG4gICAgICB2YXIgaGVhZGVycyA9IHBhcnNlX3Bnbl9oZWFkZXIoaGVhZGVyX3N0cmluZywgb3B0aW9ucyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gaGVhZGVycykge1xuICAgICAgICBzZXRfaGVhZGVyKFtrZXksIGhlYWRlcnNba2V5XV0pO1xuICAgICAgfVxuXG4gICAgICAvKiBsb2FkIHRoZSBzdGFydGluZyBwb3NpdGlvbiBpbmRpY2F0ZWQgYnkgW1NldHVwICcxJ10gYW5kXG4gICAgICAqIFtGRU4gcG9zaXRpb25dICovXG4gICAgICBpZiAoaGVhZGVyc1snU2V0VXAnXSA9PT0gJzEnKSB7XG4gICAgICAgICAgaWYgKCEoKCdGRU4nIGluIGhlYWRlcnMpICYmIGxvYWQoaGVhZGVyc1snRkVOJ10pKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogZGVsZXRlIGhlYWRlciB0byBnZXQgdGhlIG1vdmVzICovXG4gICAgICB2YXIgbXMgPSBwZ24ucmVwbGFjZShoZWFkZXJfc3RyaW5nLCAnJykucmVwbGFjZShuZXcgUmVnRXhwKG1hc2sobmV3bGluZV9jaGFyKSwgJ2cnKSwgJyAnKTtcblxuICAgICAgLyogZGVsZXRlIGNvbW1lbnRzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoLyhcXHtbXn1dK1xcfSkrPy9nLCAnJyk7XG5cbiAgICAgIC8qIGRlbGV0ZSByZWN1cnNpdmUgYW5ub3RhdGlvbiB2YXJpYXRpb25zICovXG4gICAgICB2YXIgcmF2X3JlZ2V4ID0gLyhcXChbXlxcKFxcKV0rXFwpKSs/L2dcbiAgICAgIHdoaWxlIChyYXZfcmVnZXgudGVzdChtcykpIHtcbiAgICAgICAgbXMgPSBtcy5yZXBsYWNlKHJhdl9yZWdleCwgJycpO1xuICAgICAgfVxuXG4gICAgICAvKiBkZWxldGUgbW92ZSBudW1iZXJzICovXG4gICAgICBtcyA9IG1zLnJlcGxhY2UoL1xcZCtcXC4oXFwuXFwuKT8vZywgJycpO1xuXG4gICAgICAvKiBkZWxldGUgLi4uIGluZGljYXRpbmcgYmxhY2sgdG8gbW92ZSAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXC5cXC5cXC4vZywgJycpO1xuXG4gICAgICAvKiBkZWxldGUgbnVtZXJpYyBhbm5vdGF0aW9uIGdseXBocyAqL1xuICAgICAgbXMgPSBtcy5yZXBsYWNlKC9cXCRcXGQrL2csICcnKTtcblxuICAgICAgLyogdHJpbSBhbmQgZ2V0IGFycmF5IG9mIG1vdmVzICovXG4gICAgICB2YXIgbW92ZXMgPSB0cmltKG1zKS5zcGxpdChuZXcgUmVnRXhwKC9cXHMrLykpO1xuXG4gICAgICAvKiBkZWxldGUgZW1wdHkgZW50cmllcyAqL1xuICAgICAgbW92ZXMgPSBtb3Zlcy5qb2luKCcsJykucmVwbGFjZSgvLCwrL2csICcsJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBtb3ZlID0gJyc7XG5cbiAgICAgIGZvciAodmFyIGhhbGZfbW92ZSA9IDA7IGhhbGZfbW92ZSA8IG1vdmVzLmxlbmd0aCAtIDE7IGhhbGZfbW92ZSsrKSB7XG4gICAgICAgIG1vdmUgPSBtb3ZlX2Zyb21fc2FuKG1vdmVzW2hhbGZfbW92ZV0sIHNsb3BweSk7XG5cbiAgICAgICAgLyogbW92ZSBub3QgcG9zc2libGUhIChkb24ndCBjbGVhciB0aGUgYm9hcmQgdG8gZXhhbWluZSB0byBzaG93IHRoZVxuICAgICAgICAgKiBsYXRlc3QgdmFsaWQgcG9zaXRpb24pXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobW92ZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiBleGFtaW5lIGxhc3QgbW92ZSAqL1xuICAgICAgbW92ZSA9IG1vdmVzW21vdmVzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKFBPU1NJQkxFX1JFU1VMVFMuaW5kZXhPZihtb3ZlKSA+IC0xKSB7XG4gICAgICAgIGlmIChoYXNfa2V5cyhoZWFkZXIpICYmIHR5cGVvZiBoZWFkZXIuUmVzdWx0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHNldF9oZWFkZXIoWydSZXN1bHQnLCBtb3ZlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBtb3ZlID0gbW92ZV9mcm9tX3Nhbihtb3ZlLCBzbG9wcHkpO1xuICAgICAgICBpZiAobW92ZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ha2VfbW92ZShtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGhlYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2V0X2hlYWRlcihhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBhc2NpaTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXNjaWkoKTtcbiAgICB9LFxuXG4gICAgdHVybjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHVybjtcbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24obW92ZSwgb3B0aW9ucykge1xuICAgICAgLyogVGhlIG1vdmUgZnVuY3Rpb24gY2FuIGJlIGNhbGxlZCB3aXRoIGluIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICAgICAqXG4gICAgICAgKiAubW92ZSgnTnhiNycpICAgICAgPC0gd2hlcmUgJ21vdmUnIGlzIGEgY2FzZS1zZW5zaXRpdmUgU0FOIHN0cmluZ1xuICAgICAgICpcbiAgICAgICAqIC5tb3ZlKHsgZnJvbTogJ2g3JywgPC0gd2hlcmUgdGhlICdtb3ZlJyBpcyBhIG1vdmUgb2JqZWN0IChhZGRpdGlvbmFsXG4gICAgICAgKiAgICAgICAgIHRvIDonaDgnLCAgICAgIGZpZWxkcyBhcmUgaWdub3JlZClcbiAgICAgICAqICAgICAgICAgcHJvbW90aW9uOiAncScsXG4gICAgICAgKiAgICAgIH0pXG4gICAgICAgKi9cblxuICAgICAgLy8gYWxsb3cgdGhlIHVzZXIgdG8gc3BlY2lmeSB0aGUgc2xvcHB5IG1vdmUgcGFyc2VyIHRvIHdvcmsgYXJvdW5kIG92ZXJcbiAgICAgIC8vIGRpc2FtYmlndWF0aW9uIGJ1Z3MgaW4gRnJpdHogYW5kIENoZXNzYmFzZVxuICAgICAgdmFyIHNsb3BweSA9ICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3Nsb3BweScgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNsb3BweSA6IGZhbHNlO1xuXG4gICAgICB2YXIgbW92ZV9vYmogPSBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIG1vdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1vdmVfb2JqID0gbW92ZV9mcm9tX3Nhbihtb3ZlLCBzbG9wcHkpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIG1vdmVzID0gZ2VuZXJhdGVfbW92ZXMoKTtcblxuICAgICAgICAvKiBjb252ZXJ0IHRoZSBwcmV0dHkgbW92ZSBvYmplY3QgdG8gYW4gdWdseSBtb3ZlIG9iamVjdCAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW92ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAobW92ZS5mcm9tID09PSBhbGdlYnJhaWMobW92ZXNbaV0uZnJvbSkgJiZcbiAgICAgICAgICAgICAgbW92ZS50byA9PT0gYWxnZWJyYWljKG1vdmVzW2ldLnRvKSAmJlxuICAgICAgICAgICAgICAoISgncHJvbW90aW9uJyBpbiBtb3Zlc1tpXSkgfHxcbiAgICAgICAgICAgICAgbW92ZS5wcm9tb3Rpb24gPT09IG1vdmVzW2ldLnByb21vdGlvbikpIHtcbiAgICAgICAgICAgIG1vdmVfb2JqID0gbW92ZXNbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogZmFpbGVkIHRvIGZpbmQgbW92ZSAqL1xuICAgICAgaWYgKCFtb3ZlX29iaikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLyogbmVlZCB0byBtYWtlIGEgY29weSBvZiBtb3ZlIGJlY2F1c2Ugd2UgY2FuJ3QgZ2VuZXJhdGUgU0FOIGFmdGVyIHRoZVxuICAgICAgICogbW92ZSBpcyBtYWRlXG4gICAgICAgKi9cbiAgICAgIHZhciBwcmV0dHlfbW92ZSA9IG1ha2VfcHJldHR5KG1vdmVfb2JqKTtcblxuICAgICAgbWFrZV9tb3ZlKG1vdmVfb2JqKTtcblxuICAgICAgcmV0dXJuIHByZXR0eV9tb3ZlO1xuICAgIH0sXG5cbiAgICB1bmRvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtb3ZlID0gdW5kb19tb3ZlKCk7XG4gICAgICByZXR1cm4gKG1vdmUpID8gbWFrZV9wcmV0dHkobW92ZSkgOiBudWxsO1xuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2xlYXIoKTtcbiAgICB9LFxuXG4gICAgcHV0OiBmdW5jdGlvbihwaWVjZSwgc3F1YXJlKSB7XG4gICAgICByZXR1cm4gcHV0KHBpZWNlLCBzcXVhcmUpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHNxdWFyZSkge1xuICAgICAgcmV0dXJuIGdldChzcXVhcmUpO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uKHNxdWFyZSkge1xuICAgICAgcmV0dXJuIHJlbW92ZShzcXVhcmUpO1xuICAgIH0sXG5cbiAgICBwZXJmdDogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICAgIHJldHVybiBwZXJmdChkZXB0aCk7XG4gICAgfSxcblxuICAgIHNxdWFyZV9jb2xvcjogZnVuY3Rpb24oc3F1YXJlKSB7XG4gICAgICBpZiAoc3F1YXJlIGluIFNRVUFSRVMpIHtcbiAgICAgICAgdmFyIHNxXzB4ODggPSBTUVVBUkVTW3NxdWFyZV07XG4gICAgICAgIHJldHVybiAoKHJhbmsoc3FfMHg4OCkgKyBmaWxlKHNxXzB4ODgpKSAlIDIgPT09IDApID8gJ2xpZ2h0JyA6ICdkYXJrJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIGhpc3Rvcnk6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHZhciByZXZlcnNlZF9oaXN0b3J5ID0gW107XG4gICAgICB2YXIgbW92ZV9oaXN0b3J5ID0gW107XG4gICAgICB2YXIgdmVyYm9zZSA9ICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ3ZlcmJvc2UnIGluIG9wdGlvbnMgJiZcbiAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudmVyYm9zZSk7XG5cbiAgICAgIHdoaWxlIChoaXN0b3J5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV2ZXJzZWRfaGlzdG9yeS5wdXNoKHVuZG9fbW92ZSgpKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHJldmVyc2VkX2hpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbW92ZSA9IHJldmVyc2VkX2hpc3RvcnkucG9wKCk7XG4gICAgICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICAgICAgbW92ZV9oaXN0b3J5LnB1c2gobWFrZV9wcmV0dHkobW92ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vdmVfaGlzdG9yeS5wdXNoKG1vdmVfdG9fc2FuKG1vdmUpKTtcbiAgICAgICAgfVxuICAgICAgICBtYWtlX21vdmUobW92ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtb3ZlX2hpc3Rvcnk7XG4gICAgfVxuXG4gIH07XG59O1xuXG4vKiBleHBvcnQgQ2hlc3Mgb2JqZWN0IGlmIHVzaW5nIG5vZGUgb3IgYW55IG90aGVyIENvbW1vbkpTIGNvbXBhdGlibGVcbiAqIGVudmlyb25tZW50ICovXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLkNoZXNzID0gQ2hlc3M7XG4vKiBleHBvcnQgQ2hlc3Mgb2JqZWN0IGZvciBhbnkgUmVxdWlyZUpTIGNvbXBhdGlibGUgZW52aXJvbm1lbnQgKi9cbmlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykgZGVmaW5lKCBmdW5jdGlvbiAoKSB7IHJldHVybiBDaGVzczsgIH0pO1xuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChwdXp6bGUuZmVuKTtcbiAgICBhZGRDaGVja2luZ1NxdWFyZXMocHV6emxlLmZlbiwgcHV6emxlLmZlYXR1cmVzKTtcbiAgICBhZGRDaGVja2luZ1NxdWFyZXMoYy5mZW5Gb3JPdGhlclNpZGUocHV6emxlLmZlbiksIHB1enpsZS5mZWF0dXJlcyk7XG4gICAgcmV0dXJuIHB1enpsZTtcbn07XG5cbmZ1bmN0aW9uIGFkZENoZWNraW5nU3F1YXJlcyhmZW4sIGZlYXR1cmVzKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIHZhciBtb3ZlcyA9IGNoZXNzLm1vdmVzKHtcbiAgICAgICAgdmVyYm9zZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdmFyIG1hdGVzID0gbW92ZXMuZmlsdGVyKG1vdmUgPT4gL1xcIy8udGVzdChtb3ZlLnNhbikpO1xuICAgIHZhciBjaGVja3MgPSBtb3Zlcy5maWx0ZXIobW92ZSA9PiAvXFwrLy50ZXN0KG1vdmUuc2FuKSk7XG4gICAgZmVhdHVyZXMucHVzaCh7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkNoZWNraW5nIHNxdWFyZXNcIixcbiAgICAgICAgc2lkZTogY2hlc3MudHVybigpLFxuICAgICAgICB0YXJnZXRzOiBjaGVja3MubWFwKG0gPT4gdGFyZ2V0QW5kRGlhZ3JhbShtLmZyb20sIG0udG8sIGNoZWNraW5nTW92ZXMoZmVuLCBtKSkpXG4gICAgfSk7XG5cbiAgICBmZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiTWF0aW5nIHNxdWFyZXNcIixcbiAgICAgICAgc2lkZTogY2hlc3MudHVybigpLFxuICAgICAgICB0YXJnZXRzOiBtYXRlcy5tYXAobSA9PiB0YXJnZXRBbmREaWFncmFtKG0uZnJvbSwgbS50bywgY2hlY2tpbmdNb3ZlcyhmZW4sIG0pKSlcbiAgICB9KTtcbiAgICBcbiAgICBpZiAobWF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmZWF0dXJlcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgICAgICAgaWYgKGYuZGVzY3JpcHRpb24gPT09IFwiTWF0ZS1pbi0xIHRocmVhdHNcIikge1xuICAgICAgICAgICAgICAgIGYudGFyZ2V0cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNraW5nTW92ZXMoZmVuLCBtb3ZlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIGNoZXNzLm1vdmUobW92ZSk7XG4gICAgY2hlc3MubG9hZChjLmZlbkZvck90aGVyU2lkZShjaGVzcy5mZW4oKSkpO1xuICAgIHZhciBtb3ZlcyA9IGNoZXNzLm1vdmVzKHtcbiAgICAgICAgdmVyYm9zZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBtb3Zlcy5maWx0ZXIobSA9PiBtLmNhcHR1cmVkICYmIG0uY2FwdHVyZWQudG9Mb3dlckNhc2UoKSA9PT0gJ2snKTtcbn1cblxuXG5mdW5jdGlvbiB0YXJnZXRBbmREaWFncmFtKGZyb20sIHRvLCBjaGVja3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXQ6IHRvLFxuICAgICAgICBkaWFncmFtOiBbe1xuICAgICAgICAgICAgb3JpZzogZnJvbSxcbiAgICAgICAgICAgIGRlc3Q6IHRvLFxuICAgICAgICAgICAgYnJ1c2g6ICdwYWxlQmx1ZSdcbiAgICAgICAgfV0uY29uY2F0KGNoZWNrcy5tYXAobSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9yaWc6IG0uZnJvbSxcbiAgICAgICAgICAgICAgICBkZXN0OiBtLnRvLFxuICAgICAgICAgICAgICAgIGJydXNoOiAncmVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkpXG4gICAgfTtcbn1cbiIsIi8qKlxuICogQ2hlc3MgZXh0ZW5zaW9uc1xuICovXG5cbnZhciBDaGVzcyA9IHJlcXVpcmUoJ2NoZXNzLmpzJykuQ2hlc3M7XG5cbnZhciBhbGxTcXVhcmVzID0gWydhMScsICdhMicsICdhMycsICdhNCcsICdhNScsICdhNicsICdhNycsICdhOCcsICdiMScsICdiMicsICdiMycsICdiNCcsICdiNScsICdiNicsICdiNycsICdiOCcsICdjMScsICdjMicsICdjMycsICdjNCcsICdjNScsICdjNicsICdjNycsICdjOCcsICdkMScsICdkMicsICdkMycsICdkNCcsICdkNScsICdkNicsICdkNycsICdkOCcsICdlMScsICdlMicsICdlMycsICdlNCcsICdlNScsICdlNicsICdlNycsICdlOCcsICdmMScsICdmMicsICdmMycsICdmNCcsICdmNScsICdmNicsICdmNycsICdmOCcsICdnMScsICdnMicsICdnMycsICdnNCcsICdnNScsICdnNicsICdnNycsICdnOCcsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoNycsICdoOCddO1xuXG4vKipcbiAqIFBsYWNlIGtpbmcgYXQgc3F1YXJlIGFuZCBmaW5kIG91dCBpZiBpdCBpcyBpbiBjaGVjay5cbiAqL1xuZnVuY3Rpb24gaXNDaGVja0FmdGVyUGxhY2luZ0tpbmdBdFNxdWFyZShmZW4sIGtpbmcsIHNxdWFyZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuICAgIGNoZXNzLnJlbW92ZShzcXVhcmUpO1xuICAgIGNoZXNzLnJlbW92ZShraW5nKTtcbiAgICBjaGVzcy5wdXQoe1xuICAgICAgICB0eXBlOiAnaycsXG4gICAgICAgIGNvbG9yOiBjaGVzcy50dXJuKClcbiAgICB9LCBzcXVhcmUpO1xuICAgIHJldHVybiBjaGVzcy5pbl9jaGVjaygpO1xufVxuXG5mdW5jdGlvbiBpc0NoZWNrQWZ0ZXJSZW1vdmluZ1BpZWNlQXRTcXVhcmUoZmVuLCBzcXVhcmUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoZmVuKTtcbiAgICBjaGVzcy5yZW1vdmUoc3F1YXJlKTtcbiAgICByZXR1cm4gY2hlc3MuaW5fY2hlY2soKTtcbn1cblxuZnVuY3Rpb24gbW92ZXNUaGF0UmVzdWx0SW5DYXB0dXJlVGhyZWF0KGZlbiwgZnJvbSwgdG8pIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoZmVuKTtcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWVcbiAgICB9KTtcbiAgICB2YXIgc3F1YXJlc0JldHdlZW4gPSBiZXR3ZWVuKGZyb20sIHRvKTtcbiAgICAvLyBkbyBhbnkgb2YgdGhlIG1vdmVzIHJldmVhbCB0aGUgZGVzaXJlZCBjYXB0dXJlIFxuICAgIHJldHVybiBtb3Zlcy5maWx0ZXIobW92ZSA9PiBzcXVhcmVzQmV0d2Vlbi5pbmRleE9mKG1vdmUuZnJvbSkgIT09IC0xKVxuICAgICAgICAuZmlsdGVyKG0gPT4gZG9lc01vdmVSZXN1bHRJbkNhcHR1cmVUaHJlYXQobSwgZmVuLCBmcm9tLCB0bykpO1xufVxuXG5mdW5jdGlvbiBkb2VzTW92ZVJlc3VsdEluQ2FwdHVyZVRocmVhdChtb3ZlLCBmZW4sIGZyb20sIHRvKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG5cbiAgICAvL2FwcGx5IG1vdmUgb2YgaW50ZXJtZWRpYXJ5IHBpZWNlIChzdGF0ZSBiZWNvbWVzIG90aGVyIHNpZGVzIHR1cm4pXG4gICAgY2hlc3MubW92ZShtb3ZlKTtcblxuICAgIC8vbnVsbCBtb3ZlIGZvciBvcHBvbmVudCB0byByZWdhaW4gdGhlIG1vdmUgZm9yIG9yaWdpbmFsIHNpZGVcbiAgICBjaGVzcy5sb2FkKGZlbkZvck90aGVyU2lkZShjaGVzcy5mZW4oKSkpO1xuXG4gICAgLy9nZXQgbGVnYWwgbW92ZXNcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIGRvIGFueSBvZiB0aGUgbW92ZXMgbWF0Y2ggZnJvbSx0byBcbiAgICByZXR1cm4gbW92ZXMuZmlsdGVyKG0gPT4gbS5mcm9tID09PSBmcm9tICYmIG0udG8gPT09IHRvKS5sZW5ndGggPiAwO1xufVxuXG4vKipcbiAqIFN3aXRjaCBzaWRlIHRvIHBsYXkgKGFuZCByZW1vdmUgZW4tcGFzc2VudCBpbmZvcm1hdGlvbilcbiAqL1xuZnVuY3Rpb24gZmVuRm9yT3RoZXJTaWRlKGZlbikge1xuICAgIGlmIChmZW4uc2VhcmNoKFwiIHcgXCIpID4gMCkge1xuICAgICAgICByZXR1cm4gZmVuLnJlcGxhY2UoLyB3IC4qLywgXCIgYiAtIC0gMCAxXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZlbi5yZXBsYWNlKC8gYiAuKi8sIFwiIHcgLSAtIDAgMlwiKTtcbiAgICB9XG59XG5cbi8qKlxuICogV2hlcmUgaXMgdGhlIGtpbmcuXG4gKi9cbmZ1bmN0aW9uIGtpbmdzU3F1YXJlKGZlbiwgY29sb3VyKSB7XG4gICAgcmV0dXJuIHNxdWFyZXNPZlBpZWNlKGZlbiwgY29sb3VyLCAnaycpO1xufVxuXG5mdW5jdGlvbiBzcXVhcmVzT2ZQaWVjZShmZW4sIGNvbG91ciwgcGllY2VUeXBlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG4gICAgcmV0dXJuIGFsbFNxdWFyZXMuZmluZChzcXVhcmUgPT4ge1xuICAgICAgICB2YXIgciA9IGNoZXNzLmdldChzcXVhcmUpO1xuICAgICAgICByZXR1cm4gciA9PT0gbnVsbCA/IGZhbHNlIDogKHIuY29sb3IgPT0gY29sb3VyICYmIHIudHlwZS50b0xvd2VyQ2FzZSgpID09PSBwaWVjZVR5cGUpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBtb3Zlc09mUGllY2VPbihmZW4sIHNxdWFyZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuICAgIHJldHVybiBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWUsXG4gICAgICAgIHNxdWFyZTogc3F1YXJlXG4gICAgfSk7XG59XG5cbi8qKlxuICogRmluZCBwb3NpdGlvbiBvZiBhbGwgb2Ygb25lIGNvbG91cnMgcGllY2VzIGV4Y2x1ZGluZyB0aGUga2luZy5cbiAqL1xuZnVuY3Rpb24gcGllY2VzRm9yQ29sb3VyKGZlbiwgY29sb3VyKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKGZlbik7XG4gICAgcmV0dXJuIGFsbFNxdWFyZXMuZmlsdGVyKHNxdWFyZSA9PiB7XG4gICAgICAgIHZhciByID0gY2hlc3MuZ2V0KHNxdWFyZSk7XG4gICAgICAgIGlmICgociA9PT0gbnVsbCkgfHwgKHIudHlwZSA9PT0gJ2snKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByLmNvbG9yID09IGNvbG91cjtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbWFqb3JQaWVjZXNGb3JDb2xvdXIoZmVuLCBjb2xvdXIpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoZmVuKTtcbiAgICByZXR1cm4gYWxsU3F1YXJlcy5maWx0ZXIoc3F1YXJlID0+IHtcbiAgICAgICAgdmFyIHIgPSBjaGVzcy5nZXQoc3F1YXJlKTtcbiAgICAgICAgaWYgKChyID09PSBudWxsKSB8fCAoci50eXBlID09PSAncCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHIuY29sb3IgPT0gY29sb3VyO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjYW5DYXB0dXJlKGZyb20sIGZyb21QaWVjZSwgdG8sIHRvUGllY2UpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5jbGVhcigpO1xuICAgIGNoZXNzLnB1dCh7XG4gICAgICAgIHR5cGU6IGZyb21QaWVjZS50eXBlLFxuICAgICAgICBjb2xvcjogJ3cnXG4gICAgfSwgZnJvbSk7XG4gICAgY2hlc3MucHV0KHtcbiAgICAgICAgdHlwZTogdG9QaWVjZS50eXBlLFxuICAgICAgICBjb2xvcjogJ2InXG4gICAgfSwgdG8pO1xuICAgIHZhciBtb3ZlcyA9IGNoZXNzLm1vdmVzKHtcbiAgICAgICAgc3F1YXJlOiBmcm9tLFxuICAgICAgICB2ZXJib3NlOiB0cnVlXG4gICAgfSkuZmlsdGVyKG0gPT4gKC8uKnguKi8udGVzdChtLnNhbikpKTtcbiAgICByZXR1cm4gbW92ZXMubGVuZ3RoID4gMDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IFBHTiB0byBsaXN0IG9mIEZFTnMuXG4gKi9cbmZ1bmN0aW9uIHBnblRvRmVucyhwZ24pIHtcbiAgICB2YXIgZ2FtZU1vdmVzID0gcGduLnJlcGxhY2UoLyhbMC05XStcXC5cXHMpL2dtLCAnJykudHJpbSgpO1xuICAgIHZhciBtb3ZlQXJyYXkgPSBnYW1lTW92ZXMuc3BsaXQoJyAnKS5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbjtcbiAgICB9KTtcblxuICAgIHZhciBmZW5zID0gW107XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgbW92ZUFycmF5LmZvckVhY2gobW92ZSA9PiB7XG4gICAgICAgIGNoZXNzLm1vdmUobW92ZSwge1xuICAgICAgICAgICAgc2xvcHB5OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHNraXAgb3BlbmluZyBtb3Zlc1xuICAgICAgICBpZiAoY2hlc3MuaGlzdG9yeSgpLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNraXAgcG9zaXRpb25zIGluIGNoZWNrXG4gICAgICAgIGlmIChjaGVzcy5pbl9jaGVjaygpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBza2lwIGJsYWNrIG1vdmVzXG4gICAgICAgIGlmIChjaGVzcy50dXJuKCkgPT09ICdiJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZlbnMucHVzaChjaGVzcy5mZW4oKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZlbnM7XG59XG5cbmZ1bmN0aW9uIGJldHdlZW4oZnJvbSwgdG8pIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIG4gPSBmcm9tO1xuICAgIHdoaWxlIChuICE9PSB0bykge1xuICAgICAgICBuID0gU3RyaW5nLmZyb21DaGFyQ29kZShuLmNoYXJDb2RlQXQoKSArIE1hdGguc2lnbih0by5jaGFyQ29kZUF0KCkgLSBuLmNoYXJDb2RlQXQoKSkpICtcbiAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUobi5jaGFyQ29kZUF0KDEpICsgTWF0aC5zaWduKHRvLmNoYXJDb2RlQXQoMSkgLSBuLmNoYXJDb2RlQXQoMSkpKTtcbiAgICAgICAgcmVzdWx0LnB1c2gobik7XG4gICAgfVxuICAgIHJlc3VsdC5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByZXBhaXJGZW4oZmVuKSB7XG4gICAgaWYgKC9eW14gXSokLy50ZXN0KGZlbikpIHtcbiAgICAgICAgcmV0dXJuIGZlbiArIFwiIHcgLSAtIDAgMVwiO1xuICAgIH1cbiAgICByZXR1cm4gZmVuLnJlcGxhY2UoLyB3IC4qLywgJyB3IC0gLSAwIDEnKS5yZXBsYWNlKC8gYiAuKi8sICcgYiAtIC0gMCAxJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmFsbFNxdWFyZXMgPSBhbGxTcXVhcmVzO1xubW9kdWxlLmV4cG9ydHMucGduVG9GZW5zID0gcGduVG9GZW5zO1xubW9kdWxlLmV4cG9ydHMua2luZ3NTcXVhcmUgPSBraW5nc1NxdWFyZTtcbm1vZHVsZS5leHBvcnRzLnBpZWNlc0ZvckNvbG91ciA9IHBpZWNlc0ZvckNvbG91cjtcbm1vZHVsZS5leHBvcnRzLmlzQ2hlY2tBZnRlclBsYWNpbmdLaW5nQXRTcXVhcmUgPSBpc0NoZWNrQWZ0ZXJQbGFjaW5nS2luZ0F0U3F1YXJlO1xubW9kdWxlLmV4cG9ydHMuZmVuRm9yT3RoZXJTaWRlID0gZmVuRm9yT3RoZXJTaWRlO1xubW9kdWxlLmV4cG9ydHMuaXNDaGVja0FmdGVyUmVtb3ZpbmdQaWVjZUF0U3F1YXJlID0gaXNDaGVja0FmdGVyUmVtb3ZpbmdQaWVjZUF0U3F1YXJlO1xubW9kdWxlLmV4cG9ydHMubW92ZXNUaGF0UmVzdWx0SW5DYXB0dXJlVGhyZWF0ID0gbW92ZXNUaGF0UmVzdWx0SW5DYXB0dXJlVGhyZWF0O1xubW9kdWxlLmV4cG9ydHMubW92ZXNPZlBpZWNlT24gPSBtb3Zlc09mUGllY2VPbjtcbm1vZHVsZS5leHBvcnRzLm1ham9yUGllY2VzRm9yQ29sb3VyID0gbWFqb3JQaWVjZXNGb3JDb2xvdXI7XG5tb2R1bGUuZXhwb3J0cy5jYW5DYXB0dXJlID0gY2FuQ2FwdHVyZTtcbm1vZHVsZS5leHBvcnRzLnJlcGFpckZlbiA9IHJlcGFpckZlbjtcbiIsInZhciB1bmlxID0gcmVxdWlyZSgnLi91dGlsL3VuaXEnKTtcblxuLyoqXG4gKiBGaW5kIGFsbCBkaWFncmFtcyBhc3NvY2lhdGVkIHdpdGggdGFyZ2V0IHNxdWFyZSBpbiB0aGUgbGlzdCBvZiBmZWF0dXJlcy5cbiAqL1xuZnVuY3Rpb24gZGlhZ3JhbUZvclRhcmdldChzaWRlLCBkZXNjcmlwdGlvbiwgdGFyZ2V0LCBmZWF0dXJlcykge1xuICB2YXIgZGlhZ3JhbSA9IFtdO1xuICBmZWF0dXJlc1xuICAgIC5maWx0ZXIoZiA9PiBzaWRlID8gc2lkZSA9PT0gZi5zaWRlIDogdHJ1ZSlcbiAgICAuZmlsdGVyKGYgPT4gZGVzY3JpcHRpb24gPyBkZXNjcmlwdGlvbiA9PT0gZi5kZXNjcmlwdGlvbiA6IHRydWUpXG4gICAgLmZvckVhY2goZiA9PiBmLnRhcmdldHMuZm9yRWFjaCh0ID0+IHtcbiAgICAgIGlmICghdGFyZ2V0IHx8IHQudGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgZGlhZ3JhbSA9IGRpYWdyYW0uY29uY2F0KHQuZGlhZ3JhbSk7XG4gICAgICAgIHQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pKTtcbiAgcmV0dXJuIHVuaXEoZGlhZ3JhbSk7XG59XG5cbmZ1bmN0aW9uIGFsbERpYWdyYW1zKGZlYXR1cmVzKSB7XG4gIHZhciBkaWFncmFtID0gW107XG4gIGZlYXR1cmVzLmZvckVhY2goZiA9PiBmLnRhcmdldHMuZm9yRWFjaCh0ID0+IHtcbiAgICBkaWFncmFtID0gZGlhZ3JhbS5jb25jYXQodC5kaWFncmFtKTtcbiAgICB0LnNlbGVjdGVkID0gdHJ1ZTtcbiAgfSkpO1xuICByZXR1cm4gdW5pcShkaWFncmFtKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJEaWFncmFtcyhmZWF0dXJlcykge1xuICBmZWF0dXJlcy5mb3JFYWNoKGYgPT4gZi50YXJnZXRzLmZvckVhY2godCA9PiB7XG4gICAgdC5zZWxlY3RlZCA9IGZhbHNlO1xuICB9KSk7XG59XG5cbmZ1bmN0aW9uIGNsaWNrZWRTcXVhcmVzKGZlYXR1cmVzLCBjb3JyZWN0LCBpbmNvcnJlY3QsIHRhcmdldCkge1xuICB2YXIgZGlhZ3JhbSA9IGRpYWdyYW1Gb3JUYXJnZXQobnVsbCwgbnVsbCwgdGFyZ2V0LCBmZWF0dXJlcyk7XG4gIGNvcnJlY3QuZm9yRWFjaCh0YXJnZXQgPT4ge1xuICAgIGRpYWdyYW0ucHVzaCh7XG4gICAgICBvcmlnOiB0YXJnZXQsXG4gICAgICBicnVzaDogJ2dyZWVuJ1xuICAgIH0pO1xuICB9KTtcbiAgaW5jb3JyZWN0LmZvckVhY2godGFyZ2V0ID0+IHtcbiAgICBkaWFncmFtLnB1c2goe1xuICAgICAgb3JpZzogdGFyZ2V0LFxuICAgICAgYnJ1c2g6ICdyZWQnXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZGlhZ3JhbTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRpYWdyYW1Gb3JUYXJnZXQ6IGRpYWdyYW1Gb3JUYXJnZXQsXG4gIGFsbERpYWdyYW1zOiBhbGxEaWFncmFtcyxcbiAgY2xlYXJEaWFncmFtczogY2xlYXJEaWFncmFtcyxcbiAgY2xpY2tlZFNxdWFyZXM6IGNsaWNrZWRTcXVhcmVzXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG5cInIxYmszci9wcHBxMXBwcC81bjIvNE4xTjEvMkJwNC9CbjYvUDRQUFAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cIjNyMXJrMS9wcHFuM3AvMW5wYjFQMi81QjIvMlA1LzJOM0IxL1BQMlExUFAvUjVLMSB3IC0gLSAwIDFcIixcblwicjNyazIvNmIxL3EycFFCcDEvMU5wUDQvMW4yUFAyL25QNi9QM04xSzEvUjZSIHcgLSAtIDAgMVwiLFxuXCJyNG4xay9wcEJuTjFwMS8ycDFwMy82TnAvcTJiUDFiMS8zQjQvUFBQM1BQL1I0UTFLIHcgLSAtIDAgMVwiLFxuXCJyM1FuUjEvMWJrNS9wcDVxLzJiNS8ycDFQMy9QNy8xQkI0UC8zUjNLIHcgLSAtIDAgMVwiLFxuXCJxMXIyYjFrL3JiNG5wLzFwMnAyTi9wQjFuNC82UTEvMVAyUDMvUEIzUFBQLzJSUjJLMSB3IC0gLSAwIDFcIixcblwiazJuMXExci9wMXBCMnAxL1A0cFAxLzFRcDFwMy84LzJQMUJiTjEvUDcvMktSNCB3IC0gLSAwIDFcIixcblwicjJxazJyL3BiNHBwLzFuMlBiMi8yQjJRMi9wMXA1LzJQNS8yQjJQUFAvUk4yUjFLMSB3IC0gLSAwIDFcIixcblwiMVExUjQvNWsyLzZwcC8yTjFicDIvMUJuNS8yUDJQMVAvMXIzUEsxLzggYiAtIC0gMCAxXCIsXG5cInJuUjUvcDNwMWtwLzRwMXBuL2JwUDUvNUJQMS81TjFQLzJQMlAyLzJLNSB3IC0gLSAwIDFcIixcblwicjZyLzFwMnBwMWsvcDFiMnExcC80cFAyLzZRUi8zQjJQMS9QMVAySzIvN1IgdyAtIC0gMCAxXCIsXG5cIjJrNHIvcHBwMnAyLzJiMkIyLzdwLzZwUC8yUDFxMWJQL1BQM04yL1I0UUsxIGIgLSAtIDAgMVwiLFxuXCIxcjJrMXIxL3BicHBucDFwLzFiM1AyLzgvUTcvQjFQQjFxMi9QNFBQUC8zUjJLMSB3IC0gLSAwIDFcIixcblwicjRyMWsvMWJwcTFwMW4vcDFucDQvMXAxQmIxQlEvUDcvNlIxLzFQM1BQUC8xTjJSMUsxIHcgLSAtIDAgMVwiLFxuXCJyNHJrMS9wNHBwcC9QcDRuMS80Qk4yLzFicTUvN1EvMlAyUFBQLzNSUjFLMSB3IC0gLSAwIDFcIixcblwicjNya25RLzFwMVIxcGIxL3AzcHFCQi8ycDUvOC82UDEvUFBQMlAxUC80UjFLMSB3IC0gLSAwIDFcIixcblwiM2sxcjFyL3BiM3AyLzFwNHAxLzFCMkIzLzNxbjMvNlFQL1A0UlAxLzJSM0sxIHcgLSAtIDAgMVwiLFxuXCIxYjRyay80UjFwcC9wMWI0ci8yUEI0L1BwMVE0LzZQcS8xUDNQMVAvNFJOSzEgdyAtIC0gMCAxXCIsXG5cInIxYjFyMWsxL3BwcDFucDFwLzJucDJwUS81cU4xLzFiUDUvNlAxL1BQMlBQQlAvUjFCMlJLMSB3IC0gLSAwIDFcIixcblwiNXFyay9wM2IxcnAvNFAyUS81UDIvMXBwNS81UFIxL1A2UC9CNksgdyAtIC0gMCAxXCIsXG5cInIycTJuci81cDFwL3AxQnAzYi8xcDFOa1AyLzNwUDFwMS8yUFAyUDEvUFA1UC9SMUJiMVJLMSB3IC0gLSAwIDFcIixcblwiMnIzazEvMXAxcjFwMXAvcG5iMXBCMi81cDIvMWJQNS8xUDJRUDIvUDFCM1BQLzRSSzIgdyAtIC0gMCAxXCIsXG5cIjJyNS8ycDJrMXAvcHFwMVJCMi8ycjUvUGJRMk4yLzFQM1BQMS8yUDNQMS80UjJLIHcgLSAtIDAgMVwiLFxuXCI3ci9wUnBrNC8ybnAycDEvNWIyLzJQNHEvMmIxQkJOMS9QNFBQMS8zUTFLMiBiIC0gLSAwIDFcIixcblwiUjRyazEvNHIxcDEvMXEycDFRcC8xcGI1LzFuNVIvNU5CMS8xUDNQUFAvNksxIHcgLSAtIDAgMVwiLFxuXCIycjRrL3BwcWJwUTFwLzNwMWJwQi84LzgvMU5yMlAyL1BQUDNQMS8yS1IzUiB3IC0gLSAwIDFcIixcblwiMnIxazJyLzFwMnBwMXAvMXAyYjFwUS80QjMvM240LzJxQjQvUDFQMlBQUC8yS1JSMyBiIC0gLSAwIDFcIixcblwicjFiMnJrMS9wM1JwMXAvM3EycFEvMnBwMkIxLzNiNC8zQjQvUFBQMlBQUC80UjFLMSB3IC0gLSAwIDFcIixcblwiN2svMWIxbjFxMXAvMXAxcDQvcFAycFAxTi9QNmIvM3BCMlAvOC8xUjFRMksxIGIgLSAtIDAgMVwiLFxuXCIxcjFrcjMvTmJwcG4xcHAvMWI2LzgvNlExLzNCMVAyL1BxM1AxUC8zUlIxSzEgdyAtIC0gMCAxXCIsXG5cInIxYnFyMy9wcHAxQjFrcC8xYjRwMS9uMkI0LzNQUTFQMS8yUDUvUDRQMi9STjRLMSB3IC0gLSAwIDFcIixcblwicjFuazNyLzJiMnBwcC9wM2JxMi8zcE4zL1EyUDQvQjFOQjQvUDRQUFAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cIjJyMXIxazEvcDJuMXAxcC81cHAxL3FRMVAxYjIvTjcvNU4yL1BQM1JQUC8zSzFCMVIgYiAtIC0gMCAxXCIsXG5cInIxbmszci8yYjJwcHAvcDNiMy8zTk4zL1EyUDNxL0IyQjQvUDRQUFAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cInIxYjFubjFrL3AzcDFiMS8xcXAxQjFwMS8xcDFwNC8zUDNOLzJOMUIzL1BQUDNQUC9SMlExSzIgdyAtIC0gMCAxXCIsXG5cInIxYm5rMnIvcHBwcDFwcHAvMWI0cTEvNFAzLzJCMU4zL1ExUHAxTjIvUDRQUFAvUjNSMUsxIHcgLSAtIDAgMVwiLFxuXCI2azEvQjJOMXBwMS9wNnAvUDNOMXIxLzRuYjIvOC8yUjNCMS82SzEgdyAtIC0gMCAxXCIsXG5cInIxYjNuci9wcHAxa0IxcC8zcDQvOC8zUFBCbmIvMVEzcDIvUFBQMnEyL1JONFJLIGIgLSAtIDAgMVwiLFxuXCJyMmIyUTEvMWJxNS9wcDFrMnAxLzJwMW4xQjEvUDNQMy8yTjUvMVBQM1BQLzVSMUsgdyAtIC0gMCAxXCIsXG5cIjFSNFExLzNucjFwcC8zcDFrMi81QmIxLzRQMy8ycTFCMVAxLzVQMVAvNksxIHcgLSAtIDAgMVwiLFxuXCIxcjRrci9RMWJSQnBwcC8yYjUvOC8yQjFxMy82UDEvUDRQMVAvNVJLMSB3IC0gLSAwIDFcIixcblwiNmsxLzFwNXAvM1Azci80cDMvMk4xUEJwYi9QUHI1LzNSMVAxSy81YjFSIGIgLSAtIDAgMVwiLFxuXCI1cmsxLzFwMXIycHAvcDJwM3EvM1AyYjEvUFAxcFAzLzVQcDEvNEIxUDEvMlJSUU5LMSBiIC0gLSAwIDFcIixcblwiMms0ci9wcHA1LzRicXAxLzNwMlExLzZuMS8yTkIzUC9QUFAyYlAxL1IxQjJSMUsgYiAtIC0gMCAxXCIsXG5cIjVyMWsvM3EzcC9wMkIxbnBiL1AybnAzLzROMy8yTjJiMi81UFBQL1IzUVJLMSBiIC0gLSAwIDFcIixcblwiNHIzL3A0cGtwL3E3LzNCYmIyL1AyUDFwcFAvMk4zbjEvMVBQMktQUi9SMUJRNCBiIC0gLSAwIDFcIixcblwiM3IxcTFrLzZicC9wMXA1LzFwMkIxUTEvUDFCNS8zUDQvNVBQUC80UjFLMSB3IC0gLSAwIDFcIixcblwicjRrcjEvcGJObjFxMXAvMXA2LzJwMkJQUS81QjIvOC9QNlAvYjRSSzEgdyAtIC0gMCAxXCIsXG5cInIzcjJrLzRiMkIvcG4zcDIvcTFwNFIvNmIxLzRQMy9QUFExTlBQUC81UksxIHcgLSAtIDAgMVwiLFxuXCJybmJrMWIxci9wcHFwblExcC80cDFwMS8ycDFOMUIxLzROMy84L1BQUDJQUFAvUjNLQjFSIHcgLSAtIDAgMVwiLFxuXCI2cmsvcDFwYjFwMXAvMnBwMVAyLzJiMW4yUS80UFIyLzNCNC9QUFAxSzJQL1JOQjNxMSB3IC0gLSAwIDFcIixcblwicm4zcmsxLzJxcDJwcC9wM1AzLzFwMWI0LzNiNC8zQjQvUFBQMVExUFAvUjFCMlIxSyB3IC0gLSAwIDFcIixcblwicjJCMWJrMS8xcDVwLzJwMnAyL3AxbjUvNFAxQlAvUDFOYjQvS1BuM1BOLzNSM1IgYiAtIC0gMCAxXCIsXG5cIjZrMS8yYjNyMS84LzZwUi8ycDNOMS8yUGJQMVBQLzFQQjJSMUsvMnI1IHcgLSAtIDAgMVwiLFxuXCJyNWsxL3AxcDNicC8xcDFwNC8yUFAycXAvMVA2LzFRMWJQMy9QQjNyUFAvUjJOMlJLIGIgLSAtIDAgMVwiLFxuXCIzcnIyay9wcDFiMmIxLzRxMXBwLzJQcDFwMi8zQjQvMVAyUU5QMS9QNlAvUjRSSzEgdyAtIC0gMCAxXCIsXG5cIjJicXIyay8xcjFuMmJwL3BwMXBCcDIvMnBQMVBRMS9QM1BOMi8xUDRQMS8xQjVQL1IzUjFLMSB3IC0gLSAwIDFcIixcblwicTJicjFrMS8xYjRwcC8zQnAzL3A2bi8xcDNSMi8zQjFOMi9QUDJRUFBQLzZLMSB3IC0gLSAwIDFcIixcbl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcblwicjFiazNyL3BwcHExcHBwLzVuMi80TjFOMS8yQnA0L0JuNi9QNFBQUC80UjFLMSB3IC0gLSAwIDFcIixcblwiMnIyYmsxL3BiM3BwcC8xcDYvbjcvcTJQNC9QMVAxUjJRL0IyQjFQUFAvUjVLMSB3IC0gLSAwIDFcIixcblwiazFuM3JyL1BwM3AyLzNxNC8zTjQvM1BwMnAvMVEyUDFwMS8zQjFQUDEvUjRSSzEgdyAtIC0gMCAxXCIsXG5cIjNyMXJrMS9wcHFuM3AvMW5wYjFQMi81QjIvMlA1LzJOM0IxL1BQMlExUFAvUjVLMSB3IC0gLSAwIDFcIixcblwiTjFiazQvcHAxcDFRcHAvOC8yYjUvM24zcS84L1BQUDJSUFAvUk5CMXJCSzEgYiAtIC0gMCAxXCIsXG5cInIzYnIxay9wcDVwLzRCMXAxLzROcFAxL1AyUG4zL3ExUFEzUi83UC8zUjJLMSB3IC0gLSAwIDFcIixcblwiOC80UjFway9wNXAxLzgvMXBCMW4xYjEvMVAyYjFQMS9QNHIxUC81UjFLIGIgLSAtIDAgMVwiLFxuXCJyMWJrMXIyL3BwMW4ycHAvM05RMy8xUDYvOC8ybjJQQjEvcTFCM1BQLzNSMVJLMSB3IC0gLSAwIDFcIixcblwicm4zcmsxL3BwM3AyLzJiMXBucDEvNE4zLzNxNC9QMU5CM1IvMVAxUTFQUFAvUjVLMSB3IC0gLSAwIDFcIixcblwiM3FyazIvcDFyMnBwMS8xcDJwYjIvblAxYk4yUS8zUE4zL1A2Ui81UFBQL1I1SzEgdyAtIC0gMCAxXCIsXG5cInI0bjFrL3BwQm5OMXAxLzJwMXAzLzZOcC9xMmJQMWIxLzNCNC9QUFAzUFAvUjRRMUsgdyAtIC0gMCAxXCIsXG5cIjVrMXIvNG5wcDEvcDNwMnAvM25QMlAvM1AzUS8zTjQvcUIyS1BQMS8yUjUgdyAtIC0gMCAxXCIsXG5cInIzcjFrMS8xYjYvcDFucDFwcFEvNG4zLzRQMy9QTkI0Ui8yUDFCSzFQLzFxNiB3IC0gLSAwIDFcIixcblwicjNxMWsxLzVwMi8zUDJwUS9QcHA1LzFwbmJOMlIvOC8xUDRQUC81UjFLIHcgLSAtIDAgMVwiLFxuXCIycjJiMWsvcDJRM3AvYjFuMlBwUC8ycDUvM3IxQk4xLzNxMlAxL1A0UEIxL1IzUjFLMSB3IC0gLSAwIDFcIixcblwicTFyMmIxay9yYjRucC8xcDJwMk4vcEIxbjQvNlExLzFQMlAzL1BCM1BQUC8yUlIySzEgdyAtIC0gMCAxXCIsXG5cIjJyMWsyci9wUjJwMWJwLzJuMVAxcDEvOC8yUVA0L3EyYjFOMi9QMkIxUFBQLzRLMlIgdyAtIC0gMCAxXCIsXG5cIjNicjMvcHAycjMvMnA0ay80TjFwcC8zUFAzL1AxTjUvMVAySzMvNlJSIHcgLSAtIDAgMVwiLFxuXCIycnIxazIvcGI0cDEvMXAxcXBwMi80UjJRLzNuNC9QMU41LzFQM1BQUC8xQjJSMUsxIHcgLSAtIDAgMVwiLFxuXCI0cTFyay9wYjJicG5wLzJyNFEvMXAxcDFwUDEvNE5QMi8xUDNSMi9QQm40UC9SQjRLMSB3IC0gLSAwIDFcIixcblwicm5iMmIxci9wM2tCcDEvM3BObjFwLzJwUU4zLzFwMlBQMi80QjMvUHE1UC80SzMgdyAtIC0gMCAxXCIsXG5cInI1bnIvNlJwL3AxTk5rcDIvMXAzYjIvMnA1LzVLMi9QUDJQMy8zUjQgdyAtIC0gMCAxXCIsXG5cInIxYjFrYjFyL3BwMW4xcHAxLzFxcDFwMnAvNkIxLzJQUFEzLzNCMU4yL1A0UFBQL1I0UksxIHcgLSAtIDAgMVwiLFxuXCJybjNrMXIvcGJwcDFCYnAvMXA0cE4vNFAxQjEvM240LzJxM1ExL1BQUDJQUFAvMktSM1IgdyAtIC0gMCAxXCIsXG5cInIxYnFrYjIvNnAxL3AxcDRwLzFwMU40LzgvMUIzUTIvUFAzUFBQLzNSMksxIHcgLSAtIDAgMVwiLFxuXCJybmJxMWJuci9wcDFwMXAxcC8zcGszLzNOUDFwMS81cDIvNU4yL1BQUDFRMVBQL1IxQjFLQjFSIHcgLSAtIDAgMVwiLFxuXCJyM3JrMi81cG4xL3BiMW5xMXBSLzFwMnAxUDEvMnAxUDMvMlAyUU4xL1BQQkIxUDIvMks0UiB3IC0gLSAwIDFcIixcblwicjFicTNyL3BwcDFuUTIvMmtwMU4yLzZOMS8zYlAzLzgvUDJuMVBQUC8xUjNSSzEgdyAtIC0gMCAxXCIsXG5cIjRyMy9wYnBuMm4xLzFwMXBycDFrLzgvMlBQMlBCL1A1TjEvMkIyUjFQL1I1SzEgdyAtIC0gMCAxXCIsXG5cInJxM3JrMS8zbjFwcDEvcGI0bjEvM04yUDEvMXBCMVFQMi80QjMvUFA2LzJLUjNSIHcgLSAtIDAgMVwiLFxuXCI0YjMvazFyMXEycC9wM3AzLzNwUTMvMnBONC8xUjYvUDRQUFAvMVI0SzEgdyAtIC0gMCAxXCIsXG5cIjJiMnIxay8xcDJSMy8ybjJyMXAvcDFQMU4xcDEvMkIzUDEvUDZQLzFQM1IyLzZLMSB3IC0gLSAwIDFcIixcblwiMXFyMmJrMS9wYjNwcDEvMXBuM25wLzNOMk5RLzgvUDcvQlAzUFBQLzJCMVIxSzEgdyAtIC0gMCAxXCIsXG5cIjFrNXIvcFAzcHBwLzNwMmIxLzFCTjFuMy8xUTJQMy9QMUI1L0tQM1AxUC83cSB3IC0gLSAwIDFcIixcblwiNWtxUS8xYjFyMnAxL3BwbjFwMUJwLzJiNS8yUDJyUDEvUDROMi8xQjVQLzRSUjFLIHcgLSAtIDAgMVwiLFxuXCIzcm5yMWsvcDFxMWIxcEIvMXBiMXAycC8ycDFQMy8yUDJOMi9QUDRQMS8xQlE0UC80UlJLMSB3IC0gLSAwIDFcIixcblwicjJxcjJrL3BwMWIzcC8yblE0LzJwQjFwMVAvM24xUHBSLzJOUDJQMS9QUFA1LzJLMVIxTjEgdyAtIC0gMCAxXCIsXG5cInIycTFyMWsvcHBwYjJwcC8ybnA0LzVwMi81TjIvMUIxUTQvUFBQMVJQUFAvUjVLMSB3IC0gLSAwIDFcIixcblwicjFiMXFyMi9wcDJuMWsxLzNwcDFwUi8ycDJwUTEvNFBOMi8yTlAyUDEvUFAxSzFQQjEvbjcgdyAtIC0gMCAxXCIsXG5cIjNyMXIxay8xcDNwMXAvcDJwNC80bjFOTi82YlEvMUJQcTQvUDNwMVBQLzFSNUsgdyAtIC0gMCAxXCIsXG5cIjFyM3Ixay82cDEvcDZwLzJicE5CUDEvMXAybjMvMVA1US9QQlAxcTJQLzFLNVIgdyAtIC0gMCAxXCIsXG5cInI0cmsxLzRicDIvMUJwcHExcDEvNHAxbjEvMlAxUG4yLzNQMk4xL1AyUTFQQksvMVI1UiBiIC0gLSAwIDFcIixcblwicjJxM3IvcHBwNS8ybjRwLzRQYmsxLzJCUDFOcGIvUDJRQjMvMVBQM1AxL1I1SzEgdyAtIC0gMCAxXCIsXG5cIjJyMmJrMS8ycW4xcHBwL3BuMXA0LzVOMi9OM3IzLzFRNi81UFBQL0JSM0JLMSB3IC0gLSAwIDFcIixcblwicjVrci9wcHBOMXBwMS8xYm4xUjMvMXExTjJCcC8zcDJRMS84L1BQUDJQUFAvUjVLMSB3IC0gLSAwIDFcIixcblwicjNuMWsxL3BiNXAvNE4xcDEvMnByNC9xNy8zQjNQLzFQMVExUFAxLzJCMVIxSzEgdyAtIC0gMCAxXCIsXG5cIjFrMXIycjEvcHBxNHAvNFEzLzFCMm5wMi8yUDFwMy9QNy8yUDFSUFBSLzJCMUszIGIgLSAtIDAgMVwiLFxuXCJybjRuci9wcHBxMmJrLzdwLzViMVAvNE5CUTEvM0I0L1BQUDNQMS9SM0syUiB3IC0gLSAwIDFcIixcblwicjFicjQvMXAyYnBrMS9wMW5wcG4xcC81UDIvNFAyQi9xTk5CM1IvUDFQUTJQUC83SyB3IC0gLSAwIDFcIixcblwiMnI1LzJwMmsxcC9wcXAxUkIyLzJyNS9QYlEyTjIvMVAzUFAxLzJQM1AxLzRSMksgdyAtIC0gMCAxXCIsXG5cIjZrMS81cDIvUjVwMS9QNm4vOC81UFBwLzJyM3JQL1I0TjFLIGIgLSAtIDAgMVwiLFxuXCJyM2tyMi82UXAvMVBiMnAyL3BCM1IyLzNwcTJCLzRuMy8xUDRQUC80UjFLMSB3IC0gLSAwIDFcIixcblwicjFyM2sxLzFicTJwYlIvcDVwMS8xcG5wcDFCMS8zTlAzLzNCMVAyL1BQUFE0LzFLNVIgdyAtIC0gMCAxXCIsXG5cIjVRMi8xcDNwMU4vMnAzcDEvNWIxay8yUDNuMS9QNFJQMS8zcTJyUC81UjFLIHcgLSAtIDAgMVwiLFxuXCJybmIxazJyL3BwcHBiTjFwLzVuMi83US80UDMvMk41L1BQUFAzUC9SMUIxS0IxcSB3IC0gLSAwIDFcIixcblwicjFiMnJrMS8xcDRxcC9wNXBRLzJuTjFwMi8yQjJQMi84L1BQUDNQUC8ySzFSMyB3IC0gLSAwIDFcIixcblwiNHIxazEvcGI0cHAvMXAycDMvNFBwMi8xUDNOMi9QMlFuMlAvM24xcVBLL1JCQjFSMyBiIC0gLSAwIDFcIixcblwiM3ExcjIvMnJibnAyL3AzcHAxay8xcDFwMk4xLzNQMlExL1AzUDMvMVAzUFBQLzVSSzEgdyAtIC0gMCAxXCIsXG5cInE1azEvNXJiMS9yNnAvMU5wMW4xcDEvM3AxUG4xLzFONFAxL1BQNVAvUjFCUVJLMiBiIC0gLSAwIDFcIixcblwicm4xcTNyL3BwMmtwcHAvM05wMy8yYjFuMy8zTjJRMS8zQjQvUFA0UFAvUjFCMlJLMSB3IC0gLSAwIDFcIixcblwicm5iMWtiMXIvcHAzcHBwLzJwNS80cTMvNG4zLzNRNC9QUFBCMVBQUC8yS1IxQk5SIHcgLSAtIDAgMVwiLFxuXCI0cjFrMS8zcjFwMXAvYnFwMW4zL3AycDFOUDEvUG4xUTFiMi83UC8xUFAzQjEvUjJOUjJLIHcgLSAtIDAgMVwiLFxuXCI3ci82a3IvcDVwMS8xcE5iMXBxMS9QUHBQcDMvNFAxYjEvUjNSMVExLzJCMkJLMSBiIC0gLSAwIDFcIixcblwicm5ia24yci9wcHBwMVFwcC81YjIvM05OMy8zUHAzLzgvUFBQMUtQMVAvUjFCNHEgdyAtIC0gMCAxXCIsXG5cInI3LzZSMS9wcGtxcm4xQi8ycHAzcC9QNm4vMk41LzgvMVExUjFLMiB3IC0gLSAwIDFcIixcblwicjFiMnJrMS8xcDNwcHAvcDJwNC8zTm5RMi8yQjFSMy84L1BxUDNQUC81UksxIHcgLSAtIDAgMVwiLFxuXCJyNHIxay8ycWIzcC9wMnAxcDIvMXBuUE4zLzJwMVBuMi8yUDFOMy9QUEIxUVBSMS82UksgdyAtIC0gMCAxXCIsXG5cInJuYnExYjFyL3BwNGtwLzVucDEvNHAyUS8yQk4xUjIvNEIzL1BQUE4yUFAvUjVLMSB3IC0gLSAwIDFcIixcblwiMW5iazFiMXIvMXI2L3AyUDJwcC8xQjJQcE4xLzJwMlAyLzJQMUIzLzdQL1IzSzJSIHcgLSAtIDAgMVwiLFxuXCIxcjFrcjMvTmJwcG4xcHAvMWI2LzgvNlExLzNCMVAyL1BxM1AxUC8zUlIxSzEgdyAtIC0gMCAxXCIsXG5cIjRrMXIxLzVwMi9wMXE1LzFwMnAycC82bjEvUDRiUTEvMVA0UlAvM05SMUJLIGIgLSAtIDAgMVwiLFxuXCI1bmsxLzJOMnAyLzJiMlFwMS9wM1BwTnAvMnFQM1AvNlAxLzVQMUsvOCB3IC0gLSAwIDFcIixcblwiMWs1ci9wcDFRMXBwMS8ycDRyL2I0UG4xLzNOUHAyLzJQMlAyLzFxNEIxLzFSMlIxSzEgYiAtIC0gMCAxXCIsXG5cIjZyay81cDIvMnAxcDJwLzJQcFAxcTEvM1BuUW4xLzgvNFAyUC8xTjJCUjFLIGIgLSAtIDAgMVwiLFxuXCI0cmsxci9wMmIxcHAxLzFxNXAvM3BSMW4xLzNOMXAyLzFQMVExUDIvUEJQM1BLLzRSMyB3IC0gLSAwIDFcIixcblwicjFicTFyazEvcHAxbmIxcHAvNXAyLzZCMS8zcFEzLzNCUE4yL1BQM1BQUC9SNFJLMSB3IC0gLSAwIDFcIixcblwicm4xcjQvcHAycDFiMS81a3BwL3ExUFExYjIvNm4xLzJOMk4yL1BQUDNQUC9SMUIyUksxIHcgLSAtIDAgMVwiLFxuXCJrNy9wMVFucjJwL2IxcEIxcDIvM3AzcS9OMXA1LzNQM1AvUFBQM1AxLzZLMSB3IC0gLSAwIDFcIixcblwiM3I0LzRSUnBrLzVuMU4vOC9wMXAycVBQL1AxUXAxUDIvMVA0SzEvM2I0IHcgLSAtIDAgMVwiLFxuXCJxcjYvMWIxcDFrclEvcDJQcDFwMS80UFAyLzFwMUIxbjIvM0I0L1BQM0sxUC8yUjJSMiB3IC0gLSAwIDFcIixcblwicjFuazNyLzJiMnBwcC9wM2JxMi8zcE4zL1EyUDQvQjFOQjQvUDRQUFAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cIjRyMmsvNFExYnAvNEIxcDEvMXEybjMvNHBOMi9QMUIzUDEvNHBQMVAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cIjRyMWsxLzVwcHAvcDJwNC80cjMvMXBObjQvMVA2LzFQUEsyUFAvUjNSMyBiIC0gLSAwIDFcIixcblwicjFuazNyLzJiMnBwcC9wM2IzLzNOTjMvUTJQM3EvQjJCNC9QNFBQUC80UjFLMSB3IC0gLSAwIDFcIixcblwicjFiMWsxbnIvcDJwMXBwcC9uMkI0LzFwMU5QTjFQLzZQMS8zUDFRMi9QMVAxSzMvcTViMSB3IC0gLSAwIDFcIixcblwiMnIxcmsyLzFiMmIxcDEvcDFxMm5QMS8xcDJRMy80UDMvUDFOMUIzLzFQUDFCMlIvMks0UiB3IC0gLSAwIDFcIixcblwiNHIxazEvcFIzcHAxLzdwLzNuMWIxTi8ycFA0LzJQMlBRMS8zQjFLUFAvcTcgYiAtIC0gMCAxXCIsXG5cIjJSMVIxbmsvMXA0cnAvcDFuNS8zTjJwMS8xUDYvMlA1L1A2UC8ySzUgdyAtIC0gMCAxXCIsXG5cInIxYjFyMWtxL3BwcG5wcDFwLzFuNHBCLzgvNE4yUC8xQlA1L1BQMlFQUDEvUjNLMlIgdyAtIC0gMCAxXCIsXG5cInJuYjJyazEvcHBwMnFiMS82cFEvMnBOMXAyLzgvMVAzQlAxL1BCMlBQMVAvUjRSSzEgdyAtIC0gMCAxXCIsXG5cInIycWtiMXIvMnAxbnBwcC9wMnA0L25wMU5OMy80UDMvMUJQNS9QUDFQMVBQUC9SMUIxSzJSIHcgLSAtIDAgMVwiLFxuXCJyNnIvMXExbmJrcDEvcG4ycDJwLzFwMXBQMVAxLzNQMU4xUC8xUDFRMVAyL1AyQjFLMi9SNlIgdyAtIC0gMCAxXCIsXG5cIjNrNC8xcHAzYjEvNGIycC8xcDNxcDEvM1BuMy8yUDFSTjIvcjVQMS8xUTJSMUsxIGIgLSAtIDAgMVwiLFxuXCJybjNrMi9wUjJiMy80cDFRMS8ycTFOMlAvM1IyUDEvM0s0L1AzQnIyLzggdyAtIC0gMCAxXCIsXG5cIjJyMXIzL3BwMW5iTjIvNHAzL3E3L1AxcFAybmsvMlAyUDIvMVBRNS9SM1IxSzEgdyAtIC0gMCAxXCIsXG5cIjZrMS81cDIvcDVuMS84LzFwMXAyUDEvMVBiMkIxci9QM0tQTjEvMlJRM3EgYiAtIC0gMCAxXCIsXG5cInIxYnFyMWsxL3BwcDJwcDEvM3A0LzRuMU5RLzJCMVBOMi84L1A0UFBQL2I0UksxIHcgLSAtIDAgMVwiLFxuXCIxcjJxMmsvNE4ycC8zcDFQcDEvMnAxbjFQMS8yUDUvcDJQMktRL1AzUjMvOCB3IC0gLSAwIDFcIixcblwicjVyay9wcDJxYjFwLzJwMnBuMS8yYnA0LzNwUDFRMS8xQjFQMU4xUi9QUFAzUFAvUjFCM0sxIHcgLSAtIDAgMVwiLFxuXCJybmJxMWJrci9wcDNwMXAvMnAzcFEvM04yTjEvMkIycDIvOC9QUFBQMlBQL1IxQjFSMUsxIHcgLSAtIDAgMVwiLFxuXCIycjJuMWsvMnEzcHAvcDJwMWIyLzJuQjFQMi8xcDFONC84L1BQUDRRLzJLM1JSIHcgLSAtIDAgMVwiLFxuXCJyMXE1LzJwMmsyL3A0QnAxLzJOYjFOMi9wNlEvN1Avbm4zUFAxL1I1SzEgdyAtIC0gMCAxXCIsXG5cInJuMmtiMXIvMXBRYnBwcHAvMXA2L3FwMU40LzZuMS84L1BQUDNQUC8yS1IyTlIgdyAtIC0gMCAxXCIsXG5cIjJyMWszLzNuMXAyLzZwMS8xcDFRYjMvMUIyTjFxMS8yUDFwMy9QNFBQMS8yS1I0IHcgLSAtIDAgMVwiLFxuXCJyMWIxcjMvcXAxbjFwazEvMnBwMnAxL3AzbjMvTjFQTlAxUDEvMVAzUDIvUDZRLzFLMVIxQjFSIHcgLSAtIDAgMVwiLFxuXCI1cmsxLzJwYjFwcHAvcDJyNC8xcDFQcDMvNFBuMXEvMUIxUE5QMi9QUDFRMVAxUC9SNVJLIGIgLSAtIDAgMVwiLFxuXCIzbmJyMi80cTJwL3IzcFJway9wMnBRUk4xLzFwcFAycDEvMlA1L1BQQjRQLzZLMSB3IC0gLSAwIDFcIixcblwicjFibnJuMi9wcHAxazJwLzRwMy8zUE5wMVAvNVEyLzNCMlIxL1BQUDJQUDEvMksxUjMgdyAtIC0gMCAxXCIsXG5cIjdrL3A1YjEvMXA0QnAvMnExcDFwMS8xUDFuMXIyL1AyUTJOMS82UDEvM1IySzEgYiAtIC0gMCAxXCIsXG5cInIxYnExazFyL3BwMlIxcHAvMnBwMXAyLzFuMU40LzgvM1AxUTIvUFBQMlBQUC9SMUIzSzEgdyAtIC0gMCAxXCIsXG5cInIxYm4xYjIvcHBrMW4yci8ycDNwcC81cDIvTjFQTnBQUDEvMkIxUDMvUFAyQjJQLzJLUjJSMSB3IC0gLSAwIDFcIixcblwiMnJxMmsxLzNiYjJwL24ycDJwUS9wMlBwMy8yUDFOMVAxLzFQNVAvNkIxLzJCMlIxSyB3IC0gLSAwIDFcIixcblwicjZrL3BwNHBwLzFiMVA0LzgvMW40UTEvMk4xUlAyL1BQcTNwMS8xUkIxSzMgYiAtIC0gMCAxXCIsXG5cInJuYjJiMXIvcHBwMW4xa3AvM3AxcTIvN1EvNFBCMi8yTjUvUFBQM1BQL1I0UksxIHcgLSAtIDAgMVwiLFxuXCJyMmsybnIvcHAxYjFRMXAvMm40Yi8zTjQvM3E0LzNQNC9QUFAzUFAvNFJSMUsgdyAtIC0gMCAxXCIsXG5cIjVyMWsvM3EzcC9wMkIxbnBiL1AybnAzLzROMy8yTjJiMi81UFBQL1IzUVJLMSBiIC0gLSAwIDFcIixcblwiNHIzL3A0cGtwL3E3LzNCYmIyL1AyUDFwcFAvMk4zbjEvMVBQMktQUi9SMUJRNCBiIC0gLSAwIDFcIixcblwiNmsxLzZwMS8zcjFuMXAvcDRwMW4vUDFONFAvMk41L1EyUkszLzdxIGIgLSAtIDAgMVwiLFxuXCI4LzgvMksyYjIvMk4yazIvMXA0UjEvMUIzbjFQLzNyMVAyLzggdyAtIC0gMCAxXCIsXG5cIjJxMnIyLzVyazEvNHBOcHAvcDJwUG4yL1AxcFAyUVAvMlAyUjIvMkIzUDEvNksxIHcgLSAtIDAgMVwiLFxuXCI1a3IxL3BwNHAxLzNiMXJiMS8yQnAyTlEvMXE2LzgvUFAzUFBQL1IzUjFLMSB3IC0gLSAwIDFcIixcblwicjFiMnIyL3BwM05way82bnAvOC8ycTFOMy80UTMvUFBQMlJQUC82SzEgdyAtIC0gMCAxXCIsXG5cInIycTFyazEvcDRwMXAvM3AxUTIvMm4zQjEvQjJSNC84L1BQM1BQUC81YksxIHcgLSAtIDAgMVwiLFxuXCIzcTJyMS9wMmIxazIvMXBuQnAxTjEvM3AxcFFQLzZQMS81UjIvMnIyUDIvNFJLMiB3IC0gLSAwIDFcIixcblwiM3JubjIvcDFyMnBrcC8xcDJwTjIvMnAxUDMvNVExTi8yUDNQMS9QUDJxUEsxL1I2UiB3IC0gLSAwIDFcIixcblwicjFiMnJrMS9wcDJiMXBwL3EzcG4yLzNuTjFOMS8zcDQvUDJRNC8xUDNQUFAvUkJCMVIxSzEgdyAtIC0gMCAxXCIsXG5cInFyM2Ixci9RNXBwLzNwNC8xa3A1LzJObjFCMi9QcDYvMVAzUFBQLzJSMVIxSzEgdyAtIC0gMCAxXCIsXG5cInIycXIxazEvMXAzcFAxL3AycDFucDEvMnBQcDFCMS8yUG5QMWIxLzJOMnAyL1BQMVE0LzJLUjFCTlIgdyAtIC0gMCAxXCIsXG5cIjZyay9wM3AycC8xcDJQcDIvMnAyUDIvMlAxbkJyMS8xUDYvUDZQLzNSMVIxSyBiIC0gLSAwIDFcIixcblwicmszcTFyL3BicDRwLzFwM1AyLzJwMU4zLzNwMlExLzNQNC9QUFAzUFAvUjNSMUsxIHcgLSAtIDAgMVwiLFxuXCIzcTFyMi9wYjNwcDEvMXA2LzNwUDFOay8ycjJRMi84L1BuM1BQMS8zUlIxSzEgdyAtIC0gMCAxXCIsXG5cInI3LzNiYjFrcC9xNHAxTi8xcG5QcDFucC8ycDRRLzJQNS8xUEIzUDEvMkIyUksxIHcgLSAtIDAgMVwiLFxuXCIxcjFxcmJrMS8zYjNwL3AycDFwcDEvM05uUDIvM040LzFRNEJQL1BQNFAxLzFSMlIySyB3IC0gLSAwIDFcIixcblwicjJyMmsxLzFxNHAxL3BwYjNwMS8yYk5wMy9QMVE1LzFONVIvMVA0QlAvbjZLIHcgLSAtIDAgMVwiLFxuXCIxYjJyMWsxLzNuMnAxL3AzcDJwLzFwM3IyLzNQTnAxcS8zQm5QMVAvUFAxQlFQMUsvUjZSIGIgLSAtIDAgMVwiLFxuXCI2cmsvMXBxYmJwMXAvcDNwMlEvNlIxLzROMW5QLzNCNC9QUFA1LzJLUjQgdyAtIC0gMCAxXCIsXG5cInIzcjFuMS9wcDNwazEvMnEycDFwL1AyTlAzLzJwMVFQMi84LzFQNVAvMUIxUjNLIHcgLSAtIDAgMVwiLFxuXCJybmJrMWIxci9wcHFwblExcC80cDFwMS8ycDFOMUIxLzROMy84L1BQUDJQUFAvUjNLQjFSIHcgLSAtIDAgMVwiLFxuXCIyYnIzay9wcDNQcDEvMW4ycDMvMVAyTjFwci8yUDJxUDEvOC8xQlEyUDFQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCI1cmsxL3BwMnAycC8zcDJwYi8ycFBuMlAvMlAycTIvMk40UC9QUDNCUjEvUjJCSzFOMSBiIC0gLSAwIDFcIixcblwicjNxMXIxLzFwMmJOa3AvcDNuMy8yUE4xQjFRL1BQMVAxcDIvN1AvNVBQMS82SzEgdyAtIC0gMCAxXCIsXG5cInI1cmsvcHBxMnAyLzJwYjFQMUIvM240LzNQNC8yUEIzUC9QUDFRTlAyLzFLNiB3IC0gLSAwIDFcIixcblwiMmIxcnFrMS9yMXAycHAxL3BwNG4xLzNOcDFRMS80UDJQLzFCUDUvUFAzUDIvMktSMlIxIHcgLSAtIDAgMVwiLFxuXCJyMWI0ci8xazJicHBwL3AxcDFwMy84L05wMm5CMi8zUjQvUFBQMUJQUFAvMktSNCB3IC0gLSAwIDFcIixcblwicjJxcjFrMS8xcDFuMnBwLzJiMXAzL3AycFAxYjEvUDJQMU5wMS8zQlBSMi8xUFFCM1AvNVJLMSB3IC0gLSAwIDFcIixcblwiMnJiM3IvM04xcGsxL3AycHAycC9xcDJQQjFRL24yTjFQMi82UDEvUDFQNFAvMUsxUlIzIHcgLSAtIDAgMVwiLFxuXCJyMWIyazFyLzJxMWIzL3AzcHBCcC8ybjNCMS8xcDYvMk40US9QUFAzUFAvMktSUjMgdyAtIC0gMCAxXCIsXG5cInIxYjFyazIvcHAxbmJOcEIvMnAxcDJwL3EybkIzLzNQM1AvMk4xUDMvUFBRMlBQMS8yS1IzUiB3IC0gLSAwIDFcIixcblwicjFicTFyMWsvcHA0cHAvMnBwNC8yYjJwMi80UE4yLzFCUFAxUTIvUFAzUFBQL1I0UksxIHcgLSAtIDAgMVwiLFxuXCJyMnE0L3AyblIxYmsvMXAxUGIycC80cDJwLzNuTjMvQjJCM1AvUFAxUTJQMS82SzEgdyAtIC0gMCAxXCIsXG5cIjVyMWsvcHAxbjFwMXAvNW4xUS8zcDFwTjEvM1A0LzFQNFJQL1AxcjFxUFAxL1I1SzEgdyAtIC0gMCAxXCIsXG5cIjRucmsxL3JSNXAvNHBucFEvNHAxTjEvMnAxTjMvNlAxL3E0UDFQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCI3Ui9yMXAxcTFwcC8zazQvMXAxbjFRMi8zTjQvOC8xUFAyUFBQLzJCM0sxIHcgLSAtIDAgMVwiLFxuXCJyMXFicjJrLzFwMm4xcHAvM0IxbjIvMlAxTnAyL3A0TjIvUFE0UDEvMVAzUDFQLzNSUjFLMSB3IC0gLSAwIDFcIixcblwiMXIxcmIzL3AxcTJwa3AvUG5wMm5wMS80cDMvNFAzL1ExTjFCMVBQLzJQUkJQMi8zUjJLMSB3IC0gLSAwIDFcIixcblwiNHIzLzJxMXJwazEvcDNiTjFwLzJwM3AxLzRRUDIvMk40UC9QUDRQMS81UksxIHcgLSAtIDAgMVwiLFxuXCJycTNyazEvMXAxYnBwMXAvM3AycFEvcDJOM24vMkJuUDFQMS81UDIvUFBQNS8yS1IzUiB3IC0gLSAwIDFcIixcblwiNHIxazEvUTRicHAvcDcvNU4yLzFQM3FuMS8yUDUvUDFCM1BQL1I1SzEgYiAtIC0gMCAxXCIsXG5cIjRyMy8ycDUvMnAxcTFrcC9wMXIxcDFwTi9QNVAxLzFQM1AyLzRRMy8zUkIxSzEgdyAtIC0gMCAxXCIsXG5cIjNyM2svMWIyYjFwcC8zcHAzL3AzbjFQMS8xcFBxUDJQLzFQMk4yUi9QMVFCMXIyLzJLUjNCIGIgLSAtIDAgMVwiLFxuXTtcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuXCJyMnExcmsxL3BwcDFuMXAxLzFiMXAxcDIvMUIxTjJCUS8zcFAzLzJQM1AxL1BQM1AyL1I1SzEgdyAtIC0gMCAxXCIsXG5cImsxbjNyci9QcDNwMi8zcTQvM040LzNQcDJwLzFRMlAxcDEvM0IxUFAxL1I0UksxIHcgLSAtIDAgMVwiLFxuXCIzcjFyazEvcHBxbjNwLzFucGIxUDIvNUIyLzJQNS8yTjNCMS9QUDJRMVBQL1I1SzEgdyAtIC0gMCAxXCIsXG5cInI1azEvcHAycHBiMS8zcDQvcTNQMVFSLzZiMS9yMkIxcDIvMVBQNS8xSzRSMSB3IC0gLSAwIDFcIixcblwiN2svMXAxUDFRcHEvcDZwLzVwMU4vNk4xLzdQL1BQMXIxUFBLLzggdyAtIC0gMCAxXCIsXG5cIjJiM3JrLzFxM3AxcC9wMXAxcFBwUS80TjMvMnBQNC8yUDFwMVAxLzFQNFBLLzVSMiB3IC0gLSAwIDFcIixcblwicjNxMWsxLzVwMi8zUDJwUS9QcHA1LzFwbmJOMlIvOC8xUDRQUC81UjFLIHcgLSAtIDAgMVwiLFxuXCJyMnIyazEvMXEyYnBCMS9wcDFwMVBCcC84L1A3LzdRLzFQUDNQUC9SNksgdyAtIC0gMCAxXCIsXG5cIjJyNS8zbmJrcDEvMnExcDFwMS8xcDFuMlAxLzNQNC8ycDFQMU5RLzFQMUIxUDIvMUI0S1IgdyAtIC0gMCAxXCIsXG5cIjNrNC8xUjYvMVAyUE5wMS83cC8ybjRQLzgvNHJQUDEvNksxIHcgLSAtIDAgMVwiLFxuXCI1cmJrLzJwcTNwLzVQUVIvcDcvM3AzUi8xUDROMS9QNVBQLzZLMSB3IC0gLSAwIDFcIixcblwicjJxazJyL3BiNHBwLzFuMlBiMi8yQjJRMi9wMXA1LzJQNS8yQjJQUFAvUk4yUjFLMSB3IC0gLSAwIDFcIixcblwiMmJxMWsxci9yNXBwL3AyYjFQbjEvMXAxUTQvM1A0LzFCNi9QUDNQUFAvMlIxUjFLMSB3IC0gLSAwIDFcIixcblwiMXIyUnIyLzNQMXAxay81UnBwL3FwNi8ycFE0LzdQLzVQUEsvOCB3IC0gLSAwIDFcIixcblwiNmsxLzVwMi80blExUC9wNE4yLzFwMWI0LzdLL1BQM3IyLzggdyAtIC0gMCAxXCIsXG5cIjJyNGsvcDRyUnAvMXAxUjNCLzVwMXEvMlBuNC81cDIvUFA0UVAvMUI1SyB3IC0gLSAwIDFcIixcblwiMnIxYjMvMXBwMXFyazEvcDFuMVAxcDEvN1IvMkIxcDMvNFExUDEvUFAzUFAxLzNSMksxIHcgLSAtIDAgMVwiLFxuXCIzazFyMi8ycGI0LzJwM1AxLzJOcDFwMi8xUDYvNG5OMVIvMlAxcTMvUTVLMSB3IC0gLSAwIDFcIixcblwiMnIxazMvMlAzUjEvM1AySzEvNk4xLzgvOC84LzNyNCB3IC0gLSAwIDFcIixcblwiM3I0L3A0UTFwLzFwMlAyay8ycDNwcS8yUDJCMi8xUDJwMlAvUDVQMS82SzEgdyAtIC0gMCAxXCIsXG5cInJxcjNrMS8zYnBwQnAvM3AyUDEvcDcvMW4yUDMvMXAzUDIvMVBQUTJQMS8yS1IzUiB3IC0gLSAwIDFcIixcblwiMXIxYjFuMi8xcGszcDEvNFAycC8zcFAzLzNONC8xcDJCMy82UFAvUjVLMSB3IC0gLSAwIDFcIixcblwiMXJiNHIvcGtQcDNwLzFiMVAzbi8xUTYvTjNQcDIvOC9QMVAzUFAvN0sgdyAtIC0gMCAxXCIsXG5cInIxYjJrMXIvcHBwMWJwcHAvOC8xQjFRNC81cTIvMlA1L1BQUDJQUFAvUjNSMUsxIHcgLSAtIDAgMVwiLFxuXCIzcjFyazEvcDFwNHAvOC8xUFAxcDFicS8yUDUvM04xUHAxL1BCMlEzLzFSM1JLMSBiIC0gLSAwIDFcIixcblwicjFicTFia3IvNnBwL3AxcDNQMS8xcDFwM1EvNFAzLzgvUFBQM1BQL1JOQjJSSzEgdyAtIC0gMCAxXCIsXG5cIjViazEvNnAxLzVQUTEvcHA0UHAvMnA0UC9QMnI0LzFQSzUvOCB3IC0gLSAwIDFcIixcblwiM3ExcmsxLzRicDFwLzFuMlAyUS8xcDFwMXAyLzZyMS9QcDJSMk4vMUIxUDJQUC83SyB3IC0gLSAwIDFcIixcblwiM25rMXIxLzFwcTRwL3AzUFFwQi81cDIvMnI1LzgvUDRQUFAvM1JSMUsxIHcgLSAtIDAgMVwiLFxuXCIzcjFyMWsvMXAzcDFwL3AycDQvNG4xTk4vNmJRLzFCUHE0L1AzcDFQUC8xUjVLIHcgLSAtIDAgMVwiLFxuXCIxazFyNC8xYjFwMnBwL1BRMnAzL25ONi9QM1AzLzgvNlBQLzJxMkJLMSB3IC0gLSAwIDFcIixcblwiNXFyay9wM2IxcnAvNFAyUS81UDIvMXBwNS81UFIxL1A2UC9CNksgdyAtIC0gMCAxXCIsXG5cInI1cmsvMnAxTnBwcC8zcDNQL3BwMnAxUDEvNFAzLzJxblBRSzEvOC9SNlIgdyAtIC0gMCAxXCIsXG5cIjJybmszL3BxM3AyLzNQMVExUi8xcDYvM1A0LzVQMi9QMWIxTjFQMS81SzIgdyAtIC0gMCAxXCIsXG5cIjZrMS9wcHAycHBwLzgvMm4ySzFQLzJQMlAxUC8yQnByMy9QUDRyMS80UlIyIGIgLSAtIDAgMVwiLFxuXCJyM2tyMi82UXAvMVBiMnAyL3BCM1IyLzNwcTJCLzRuMy8xUDRQUC80UjFLMSB3IC0gLSAwIDFcIixcblwiNXJrMS8yUjRwLzNRUDFwMS8zcDQvNHAzLzFQNVAvcTcvMlIzSzEgdyAtIC0gMCAxXCIsXG5cIjJycmszL1FSM3BwMS8ybjFiMnAvMUJCMXEzLzNQNC84L1A0UFBQLzZLMSB3IC0gLSAwIDFcIixcblwiOC8yUDJwazEvM1E0LzRwcTIvN3AvNnBQLzJyM1AxLzZSSyBiIC0gLSAwIDFcIixcblwiMnI1L3AxcXAxa3BwL2I0cDIvM1A0LzJuUTFQMi8zcDJOMS9QUDRQUC8xSzFSTjMgYiAtIC0gMCAxXCIsXG5cInIxYjJrMXIvMXAxcDFwcDEvcDJQNC80TjFCcC8zcDQvOC9QUEIyUDIvMksxUjMgdyAtIC0gMCAxXCIsXG5cIjVxMi9wNy8zUjQvM1EycDEvNXBrMS80cDFQMS9QNlAvMnIyTksxIHcgLSAtIDAgMVwiLFxuXCIycjNrMS9wNHAyLzFwMlAxcFEvM2JSMnAvMXE2LzFCNi9QUDJSUHIxLzVLMiB3IC0gLSAwIDFcIixcblwiN2svMVI2LzVwUDEvMXAxTnAzLzFQMlAzLzZyMS8yUEs0LzViMiB3IC0gLSAwIDFcIixcblwiMW5iazFiMXIvMXI2L3AyUDJwcC8xQjJQcE4xLzJwMlAyLzJQMUIzLzdQL1IzSzJSIHcgLSAtIDAgMVwiLFxuXCI3Ui81cnAxLzJwMXIxazEvMnE1LzRwUDFRLzRQMy81UEsxLzdSIHcgLSAtIDAgMVwiLFxuXCI4LzVwMWsvNHIxcDEvMlBQMXAyLzFRNi8xcDNiYlAvMUIycHFQMS9SNVJLIGIgLSAtIDAgMVwiLFxuXCIycjJxazEvcjRwMXAvYjNwQnBRL24zUDJQL3AycDNSL1A1UDEvMnAyUEIxL1I1SzEgdyAtIC0gMCAxXCIsXG5cIjFyM2syLzRSMy8xcDRQcC9wMXBOMXAyLzJQbjFLMi8xUDYvMVA2LzggdyAtIC0gMCAxXCIsXG5cIjRyMWsxL3BSM3BwMS8xbjNQMXAvcTJwNC81TjFQL1AxclFwUDIvOC8yQjJSSzEgdyAtIC0gMCAxXCIsXG5cIjZyay9wMXEycDIvMnAxcmIxUC8xcDJwTjIvNFAxUTEvMlBQNC9QUEI1LzJLNFIgdyAtIC0gMCAxXCIsXG5cIjZrMS8yUDJwMi82cDEvNHAxS3AvcDFSMVBuMVAvNVAxci9QNFAyLzggYiAtIC0gMCAxXCIsXG5cImI0cmsxL3A0cDIvMXA0UHEvNHAzLzgvUDFOMlBRMS9CUDNQSzEvOCB3IC0gLSAwIDFcIixcblwicjJyNC9wcDJwcGtwLzJQM3AxL3ExcDUvNFBRMi8yUDJiMi9QNFBQUC8yUjFLQjFSIGIgLSAtIDAgMVwiLFxuXCJyMWIyazFyL3BwcHA0LzFiUDJxcDEvNXBwMS80cFAyLzFCUDUvUEJQM1BQL1IyUTFSMUsgYiAtIC0gMCAxXCIsXG5cInIxYm5rMnIvcHBwcDFwcHAvMWI0cTEvNFAzLzJCMU4zL1ExUHAxTjIvUDRQUFAvUjNSMUsxIHcgLSAtIDAgMVwiLFxuXCIya3Izci8xcDNwcHAvcDNwbjIvMmIxQjJxL1ExTjUvMlA1L1BQM1BQUC9SMlIySzEgdyAtIC0gMCAxXCIsXG5cInIzazJyLzFwcHExcHBwLzFwMlAzL24zUGIyLzFiUDJRMi8yTjJOMVAvUFA0UDEvMktSMUIxUiBiIC0gLSAwIDFcIixcblwiNmsxLzFwM3BwMS9wMWIxcDJwL3EzcjFiMS9QNy8xUDVQLzFOUTFSUFAxLzFCNEsxIGIgLSAtIDAgMVwiLFxuXCIxcjJxMmsvNE4ycC8zcDFQcDEvMnAxbjFQMS8yUDUvcDJQMktRL1AzUjMvOCB3IC0gLSAwIDFcIixcblwiNXIyLzFxcDJwcDEvYm5wazNwLzROUTIvMlA1LzFQNVAvNVBQMS80UjFLMSB3IC0gLSAwIDFcIixcblwiOC82UjEvcDJrcDJyL3FiNVAvM3AxTjFRLzFwMVByMy9QUDYvMUs1UiB3IC0gLSAwIDFcIixcblwicjRyazEvcDRwcDEvN1AvMnBwNC8zQm4zLzgvcVBQMVFQMVAvMktSMlIxIHcgLSAtIDAgMVwiLFxuXCJyMXFyMmsxLzJwM2IxLzFwMlAyUi8ycFBwMy8yUDNQUS9wUE41L1AxQjNLMS84IHcgLSAtIDAgMVwiLFxuXCI0cmsyL3A1cDEvMXAyUDJOLzdSL25QNVAvNVBRMS9iNksvcTcgdyAtIC0gMCAxXCIsXG5cIjJyMWszLzNuMXAyLzZwMS8xcDFRYjMvMUIyTjFxMS8yUDFwMy9QNFBQMS8yS1I0IHcgLSAtIDAgMVwiLFxuXCI1cmsxL3BwMXFwUjIvNlBwLzNwcE5iUS8yblA0L0IxUDUvUDVQUC82SzEgdyAtIC0gMCAxXCIsXG5cIjZrMS8ycjRwL3AzYjFQUC8xcHE1LzRQMy9QNVExLzFQMkIzLzFLM1IyIGIgLSAtIDAgMVwiLFxuXCJyNmsvcHA0cHAvMWIxUDQvOC8xbjRRMS8yTjFSUDIvUFBxM3AxLzFSQjFLMyBiIC0gLSAwIDFcIixcblwiMXIycjJrLzFxMW4xcDFwL3AxYjFwcDIvM3BQMy8xYjVSLzJOMUJCUTEvMVBQM1BQLzNSM0sgdyAtIC0gMCAxXCIsXG5cIjNrNC8xcDNCcDEvcDVyMS8yYjUvUDNQMU4xLzVQcDEvMVAxcjQvMlI0SyBiIC0gLSAwIDFcIixcblwiMXI0azEvMXIycHBiMS80YlBwMS8zcFAzLzJxQjJQMS9wNy8xUFA0US8yS1IzUiB3IC0gLSAwIDFcIixcblwiNFIzL3AycjFxMWsvNUIxUC82UDEvMnA0Sy8zYjQvNFEzLzggdyAtIC0gMCAxXCIsXG5cInIycXIxazEvMXAzcFAxL3AycDFucDEvMnBQcDFCMS8yUG5QMWIxLzJOMnAyL1BQMVE0LzJLUjFCTlIgdyAtIC0gMCAxXCIsXG5cIjVyMi8xcFAxYjFwMS9wcW4xazJwLzRwMy9RUDJCUDIvUDNQMVBLLzNSNC8zUjQgdyAtIC0gMCAxXCIsXG5cIjRrMy9wNXAxLzJwNHIvMk5QYjMvNHAxcHIvMVA0cTEvUDFRUjFSMVAvN0sgYiAtIC0gMCAxXCIsXG5cIjZSMS8yazJQMi8xbjVyLzNwMXAyLzNQM2IvMVFQMnAxcS8zUjQvNksxIGIgLSAtIDAgMVwiLFxuXCI4LzZway9wYjVwLzgvMVAycVAyL1AzcDMvMnIyUE5QLzFRUjNLMSBiIC0gLSAwIDFcIixcblwiMmJyM2svcHAzUHAxLzFuMnAzLzFQMk4xcHIvMlAycVAxLzgvMUJRMlAxUC80UjFLMSB3IC0gLSAwIDFcIixcblwicm4zcmsxLzJxcDJwcC9wM1AzLzFwMWI0LzNiNC8zQjQvUFBQMVExUFAvUjFCMlIxSyB3IC0gLSAwIDFcIixcbl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcblwiMlI1LzRicHBrLzFwMXA0LzVSMVAvNFBRMi81UDIvcjRxMVAvN0sgdyAtIC0gMCAxXCIsXG5cIjdyLzFxcjFuTnAxL3AxazRwLzFwQjUvNFAxUTEvOC9QUDNQUFAvNksxIHcgLSAtIDAgMVwiLFxuXCJyMWIyazFyL3BwcHBxMy81TjFwLzRQMlEvNFBQMi8xQjYvUFA1UC9uMksyUjEgdyAtIC0gMCAxXCIsXG5cIjJrcjFiMXIvcHBxNS8xbnAxcHAyL1AzUG4yLzFQM1AyLzJQMlFwMS82UDEvUk5CMVJCSzEgYiAtIC0gMCAxXCIsXG5cInIycXJiMi9wMXBuMVFwMS8xcDROay80UFIyLzNuNC83Ti9QNVBQL1I2SyB3IC0gLSAwIDFcIixcblwicjFiazNyL3BwcHExcHBwLzVuMi80TjFOMS8yQnA0L0JuNi9QNFBQUC80UjFLMSB3IC0gLSAwIDFcIixcblwiMXJiMmsyLzFwcTNwUS9wUnBOcDMvUDFQMm4yLzNQMVAyLzRQMy82UFAvNksxIHcgLSAtIDAgMVwiLFxuXCIxcnI0ay83cC9wM1FwcDEvM3AxUDIvOC8xUDFxM1AvUEs0UDEvM0IzUiBiIC0gLSAwIDFcIixcblwiMnIyYmsxL3BiM3BwcC8xcDYvbjcvcTJQNC9QMVAxUjJRL0IyQjFQUFAvUjVLMSB3IC0gLSAwIDFcIixcblwicjRyazEvcHA0YjEvNnBwLzJwUDQvNXBLbi9QMkIyTjEvMVBRUDFQcTEvMVJCMlIyIGIgLSAtIDAgMVwiLFxuXCJyNHIxay9wMnAzcC9icDFOcDMvNFAzLzJQMm5SMS8zQjFxMi9QMVBRNC8ySzNSMSB3IC0gLSAwIDFcIixcblwiM3IyazEvcDFwMnAyL2JwMnAxblEvNFBCMVAvMnByM3EvNlIxL1BQM1BQMS8zUjJLMSB3IC0gLSAwIDFcIixcblwicjJxMXJrMS9wcHAxbjFwMS8xYjFwMXAyLzFCMU4yQlEvM3BQMy8yUDNQMS9QUDNQMi9SNUsxIHcgLSAtIDAgMVwiLFxuXCI1cmsxL3BSNHBwLzRwMnIvMnAxbjJxLzJQMXAzL1AxUTFQMVAxLzFQM1AxUC9SMUIyTksxIGIgLSAtIDAgMVwiLFxuXCI4L3AycFEycC8ycDFwMmsvNEJxcDEvMlAyUDIvUDZQLzZQSy8zcjQgdyAtIC0gMCAxXCIsXG5cIjRyMWsxLzVwMXAvcDRQcFEvNHEzL1A2UC82UDEvM3AzSy84IGIgLSAtIDAgMVwiLFxuXCJyMWJyMWIyLzRwUGsxLzFwMXEzcC9wMlBSMy9QMVAyTjIvMVAxUTJQMS81UEJLLzRSMyB3IC0gLSAwIDFcIixcblwiN3IvM2ticDFwLzFRM1IyLzNwM3EvcDJQM0IvMVA1Sy9QNlAvOCB3IC0gLSAwIDFcIixcblwiMnI0Yi9wcDFrcHJOcC8zcE5wMVAvcTJQMnAxLzJuNS80QjJRL1BQUDNSMS8xSzFSNCB3IC0gLSAwIDFcIixcblwicjZyL3BwMVEycHAvMnA0ay80UjMvNVAyLzJxNS9QMVAzUFAvUjVLMSB3IC0gLSAwIDFcIixcblwiMnJxcmIyL3AybmszL2JwMnBuUXAvNEIxcDEvM1A0L1AxTjUvMVAzUFBQLzFCMVJSMUsxIHcgLSAtIDAgMVwiLFxuXCI4L3BwMlExcDEvMnAza3AvNnExLzVuMi8xQjJSMlAvUFAxcjFQUDEvNksxIHcgLSAtIDAgMVwiLFxuXCJrMW4zcnIvUHAzcDIvM3E0LzNONC8zUHAycC8xUTJQMXAxLzNCMVBQMS9SNFJLMSB3IC0gLSAwIDFcIixcblwiM3I0L3BwNVEvQjcvazcvM3E0LzJiNS9QNFBQUC8xUjRLMSB3IC0gLSAwIDFcIixcblwiNFJuazEvcHIzcHBwLzFwM3EyLzVOUTEvMnA1LzgvUDRQUFAvNksxIHcgLSAtIDAgMVwiLFxuXCI0cWsyLzZwMS9wNy8xcDFRcDMvcjFQMmIyLzFLNVAvMVA2LzRSUjIgdyAtIC0gMCAxXCIsXG5cIjNyMXJrMS9wcHFuM3AvMW5wYjFQMi81QjIvMlA1LzJOM0IxL1BQMlExUFAvUjVLMSB3IC0gLSAwIDFcIixcblwicjNyazIvNmIxL3EycFFCcDEvMU5wUDQvMW4yUFAyL25QNi9QM04xSzEvUjZSIHcgLSAtIDAgMVwiLFxuXCJyNWsxL3BwMnBwYjEvM3A0L3EzUDFRUi82YjEvcjJCMXAyLzFQUDUvMUs0UjEgdyAtIC0gMCAxXCIsXG5cIjJiNS8zcXIyay81UTFwL1AzQjMvMVBCMVBQcDEvNEsxUDEvOC84IHcgLSAtIDAgMVwiLFxuXCI2azEvNXBwMS9wM3AycC8zYlAyUC82UU4vOC9ycTRQMS8yUjRLIHcgLSAtIDAgMVwiLFxuXCJOMWJrNC9wcDFwMVFwcC84LzJiNS8zbjNxLzgvUFBQMlJQUC9STkIxckJLMSBiIC0gLSAwIDFcIixcblwicjNicjFrL3BwNXAvNEIxcDEvNE5wUDEvUDJQbjMvcTFQUTNSLzdQLzNSMksxIHcgLSAtIDAgMVwiLFxuXCI2a3IvcHAycjJwL24xcDFQQjFRLzJxNS8yQjRQLzJOM3AxL1BQUDNQMS83SyB3IC0gLSAwIDFcIixcblwiMnIzcjEvN3AvYjNQMmsvcDFicDFwMUIvUDJOMVAyLzFQNFExLzJQNFAvN0sgdyAtIC0gMCAxXCIsXG5cIjFRNi8xUjNwazEvNHAycC9wM24zL1AzUDJQLzZQSy9yNUIxLzNxNCBiIC0gLSAwIDFcIixcblwiNXJrMS8xcDFuMmJwL3A3L1AyUDJwMS80UjMvNE4xUGIvMlFCMXExUC80UjJLIGIgLSAtIDAgMVwiLFxuXCIxUjYvNXFway80cDJwLzFQcDFCcDFQL3IxbjJRUDEvNVBLMS80UDMvOCB3IC0gLSAwIDFcIixcblwiNGsxcjEvcHAyYnAyLzJwNS8zUFBQMi8xcTYvN3IvMVAyUTJQLzJSUjNLIGIgLSAtIDAgMVwiLFxuXCJyMWJrMXIyL3BwMW4ycHAvM05RMy8xUDYvOC8ybjJQQjEvcTFCM1BQLzNSMVJLMSB3IC0gLSAwIDFcIixcblwicm4zcmsxL3BwM3AyLzJiMXBucDEvNE4zLzNxNC9QMU5CM1IvMVAxUTFQUFAvUjVLMSB3IC0gLSAwIDFcIixcblwiMmtyMWIxci9wcDNwcHAvMnAxYjJxLzRCMy80UTMvMlBCMlIxL1BQUDJQUFAvM1IySzEgdyAtIC0gMCAxXCIsXG5cIjNxcmsyL3AxcjJwcDEvMXAycGIyL25QMWJOMlEvM1BOMy9QNlIvNVBQUC9SNUsxIHcgLSAtIDAgMVwiLFxuXCI1cjFrLzFwNHBwL3AyTjQvM1FwMy9QMm4xYlAxLzVQMXEvMVBQMlIxUC80UjJLIHcgLSAtIDAgMVwiLFxuXCI2cjEvcDViay80TjFwcC8yQjFwMy80UTJOLzgvMlAyS1BQL3E3IHcgLSAtIDAgMVwiLFxuXCI0cjFrMS81YnBwLzJwNS8zcHIzLzgvMUIzcFBxL1BQUjJQMi8yUjJRSzEgYiAtIC0gMCAxXCIsXG5cIjVyMi9wcTRrMS8xcHAxUW4yLzJicDFQQjEvM1IxUjIvMlAzUDEvUDZQLzZLMSB3IC0gLSAwIDFcIixcblwicjNrMy8zYjNSLzFuMXAxYjFRLzFwMVBwUDFOLzFQMlAxUDEvNksxLzJCMXEzLzggdyAtIC0gMCAxXCIsXG5cIjVxcjEva3AyUjMvNXAyLzFiMU4xcDIvNVEyL1A1UDEvNkJQLzZLMSB3IC0gLSAwIDFcIixcblwiN2svMXAxUDFRcHEvcDZwLzVwMU4vNk4xLzdQL1BQMXIxUFBLLzggdyAtIC0gMCAxXCIsXG5cIjJiM3JrLzFxM3AxcC9wMXAxcFBwUS80TjMvMnBQNC8yUDFwMVAxLzFQNFBLLzVSMiB3IC0gLSAwIDFcIixcblwicjJxcmsyL3A1YjEvMmIxcDFRMS8xcDFwUDMvMnAxbkIyLzJQMVAzL1BQM1AyLzJLUjNSIHcgLSAtIDAgMVwiLFxuXCJyNGsyLzFwcDNxMS8zcDFOblEvcDNQMy8yUDNwMS84L1BQNi8ySzRSIHcgLSAtIDAgMVwiLFxuXCJyNXJrL3BwMW5wMWJuLzJwcDJxMS8zUDFiTjEvMlAxTjJRLzFQNi9QQjJQUEJQLzNSMVJLMSB3IC0gLSAwIDFcIixcblwicjRuMWsvcHBCbk4xcDEvMnAxcDMvNk5wL3EyYlAxYjEvM0I0L1BQUDNQUC9SNFExSyB3IC0gLSAwIDFcIixcblwicjNucmtxL3BwM3AxcC8ycDNuUS81Tk4xLzgvM0JQMy9QUFAzUFAvMktSNCB3IC0gLSAwIDFcIixcblwicjNRblIxLzFiazUvcHA1cS8yYjUvMnAxUDMvUDcvMUJCNFAvM1IzSyB3IC0gLSAwIDFcIixcblwiMXI0azEvM2IycHAvMWIxcFAyci9wcDFQNC80cTMvOC9QUDRSUC8yUTJSMUsgYiAtIC0gMCAxXCIsXG5cInIyTnFiMXIvcFExYnAxcHAvMXBuMXAzLzFrMXA0LzJwMkIyLzJQNS9QUFAyUFBQL1IzS0IxUiB3IC0gLSAwIDFcIixcblwicnEycjFrMS8xYjNwcDEvcDNwMW4xLzFwNEJRLzgvN1IvUFAzUFBQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCIzcTFyMi82azEvcDJwUWIyLzRwUjFwLzRCMy8yUDNQMS9QNFBLMS84IHcgLSAtIDAgMVwiLFxuXCIzUjFyazEvMXBwMnBwMS8xcDYvOC84L1A3LzFxNEJQLzNRMksxIHcgLSAtIDAgMVwiLFxuXCJycWIyYmsxLzNuMnByL3AxcHAyUXAvMXA2LzNCUDJOLzJONFAvUFBQM1AxLzJLUjNSIHcgLSAtIDAgMVwiLFxuXCI1azFyLzRucHAxL3AzcDJwLzNuUDJQLzNQM1EvM040L3FCMktQUDEvMlI1IHcgLSAtIDAgMVwiLFxuXCJyM3IxazEvMWI2L3AxbnAxcHBRLzRuMy80UDMvUE5CNFIvMlAxQksxUC8xcTYgdyAtIC0gMCAxXCIsXG5cIjJRNS80cHBiay8zcDQvM1AxTlBwLzRQMy81TkIxLzVQUEsvcnE2IHcgLSAtIDAgMVwiLFxuXCJyNmsvcGI0YnAvNVEyLzJwMU5wMi8xcUI1LzgvUDRQUFAvNFJLMiB3IC0gLSAwIDFcIixcblwiM1E0LzZrcC80cTFwMS8ycG5OMlAvMXAzUDIvMVBuM1AxLzZCSy84IHcgLSAtIDAgMVwiLFxuXCJyM3ExazEvNXAyLzNQMnBRL1BwcDUvMXBuYk4yUi84LzFQNFBQLzVSMUsgdyAtIC0gMCAxXCIsXG5cIjJyMmIxay9wMlEzcC9iMW4yUHBQLzJwNS8zcjFCTjEvM3EyUDEvUDRQQjEvUjNSMUsxIHcgLSAtIDAgMVwiLFxuXCJyMnIyazEvMXEyYnBCMS9wcDFwMVBCcC84L1A3LzdRLzFQUDNQUC9SNksgdyAtIC0gMCAxXCIsXG5cInIzcjJrL3BiMW4zcC8xcDFxMXBwMS80cDFCMS8yQlAzUS8yUDFSMy9QNFBQUC80UjFLMSB3IC0gLSAwIDFcIixcblwiMnJyMmsxLzFiM3AxcC8xcDFiMnAxL3AxcVAzUS8zUjQvMVA2L1BCM1BQUC8xQjJSMUsxIHcgLSAtIDAgMVwiLFxuXCIycjUvM25ia3AxLzJxMXAxcDEvMXAxbjJQMS8zUDQvMnAxUDFOUS8xUDFCMVAyLzFCNEtSIHcgLSAtIDAgMVwiLFxuXCJybmJxcjFrMS9wcHAzcDEvNHBSMXAvNHAyUS8zUDQvQjFQQjQvUDFQM1BQL1I1SzEgdyAtIC0gMCAxXCIsXG5cImIzcjFrMS9wNFJiTi9QM1AxcDEvMXA2LzFxcDRQLzRRMVAxLzVQMi81QksxIHcgLSAtIDAgMVwiLFxuXCJxMXIyYjFrL3JiNG5wLzFwMnAyTi9wQjFuNC82UTEvMVAyUDMvUEIzUFBQLzJSUjJLMSB3IC0gLSAwIDFcIixcblwiNXJiay8ycHEzcC81UFFSL3A3LzNwM1IvMVA0TjEvUDVQUC82SzEgdyAtIC0gMCAxXCIsXG5cIjJyMWsyci9wUjJwMWJwLzJuMVAxcDEvOC8yUVA0L3EyYjFOMi9QMkIxUFBQLzRLMlIgdyAtIC0gMCAxXCIsXG5cImsybjFxMXIvcDFwQjJwMS9QNHBQMS8xUXAxcDMvOC8yUDFCYk4xL1A3LzJLUjQgdyAtIC0gMCAxXCIsXG5cIjRyMy9wMnIxcDFrLzNxMUJwcC80UDMvMVBwcFIzL1A1UDEvNVAxUC8yUTNLMSB3IC0gLSAwIDFcIixcblwiMnJyMWsyL3BiNHAxLzFwMXFwcDIvNFIyUS8zbjQvUDFONS8xUDNQUFAvMUIyUjFLMSB3IC0gLSAwIDFcIixcblwiMXIycTMvMVI2LzNwMWtwMS8xcHBCcDFiMS9wM1BwMi8yUFA0L1BQM1AyLzVLMVEgdyAtIC0gMCAxXCIsXG5cIjVyazEvcHAyUnBwcC9ucXA1LzgvNVEyLzZQQi9QUFAyUDFQLzZLMSB3IC0gLSAwIDFcIixcblwicjJxazJyL3BiNHBwLzFuMlBiMi8yQjJRMi9wMXA1LzJQNS8yQjJQUFAvUk4yUjFLMSB3IC0gLSAwIDFcIixcblwicjFicTNyL3BwcDFiMWtwLzJuM3AxLzNCM1EvM3A0LzgvUFBQMlBQUC9STkIyUksxIHcgLSAtIDAgMVwiLFxuXCIycTRrLzVwTlAvcDJwMUJwUC80cDMvMXAyYjMvMVA2L1AxcjJSMi8xSzRRMSB3IC0gLSAwIDFcIixcblwiNmsxLzJyQjFwMi9SQjFwMnBiLzNQcDJwLzRQMy8zSzJOUS81UHExLzggYiAtIC0gMCAxXCIsXG5cIjJiazQvNmIxLzJwTnAzL3IxUHBQMVAxL1AxcFAxUTIvMnJxNC83Ui82UksgdyAtIC0gMCAxXCIsXG5cIjViazEvMVEzcDIvMU5wNHAvNnAxLzgvMVAyUDFQSy80cTJQLzggYiAtIC0gMCAxXCIsXG5cIjVyazEvMXAxcTJicC9wMnBOMXAxLzJwUDJCbi8yUDNQMS8xUDYvUDRRS1AvNVIyIHcgLSAtIDAgMVwiLFxuXCIzcjNyL3AxcHFwcGJwLzFrTjNwMS8ycG5QMy9RNWIxLzFOUDUvUFAzUFBQL1IxQjJSSzEgdyAtIC0gMCAxXCIsXG5cIjFRMVI0LzVrMi82cHAvMk4xYnAyLzFCbjUvMlAyUDFQLzFyM1BLMS84IGIgLSAtIDAgMVwiLFxuXCIycjFyazIvcDFxM3BRLzRwMy8xcHBwUDFOMS83cC80UDJQL1BQM1AyLzFLNFIxIHcgLSAtIDAgMVwiLFxuXCI0cTMvcGI1cC8xcDJwMmsvNE4zL1BQMVFQMy8yUDJQUDEvNksxLzggdyAtIC0gMCAxXCIsXG5cIjJicTFrMXIvcjVwcC9wMmIxUG4xLzFwMVE0LzNQNC8xQjYvUFAzUFBQLzJSMVIxSzEgdyAtIC0gMCAxXCIsXG5cIjNyM2svNnBwL3AzUW4yL1AzTjMvNHEzLzJQNFAvNVBQMS82SzEgdyAtIC0gMCAxXCIsXG5cIjZrMS82cDEvcDVwMS8zcEIzLzFwMWI0LzJyMXExUFAvUDRSMUsvNVEyIHcgLSAtIDAgMVwiLFxuXCIzcjFiMi8zUDFwMi9wM3Jwa3AvMnEyTjIvNVExUi8yUDNCUC9QNVBLLzggdyAtIC0gMCAxXCIsXG5cIjFxNXIvMWIxcjFwMWsvMnAxcFBwYi9wMVBwNC8zQjFQMVEvMVA0UDEvUDRLQjEvMlJSNCB3IC0gLSAwIDFcIixcblwiNHIxcmsvcFEyUDJwL1A3LzJwcWIzLzNwMXAyLzgvM0IyUFAvNFJSSzEgYiAtIC0gMCAxXCIsXG5cIjFyMlJyMi8zUDFwMWsvNVJwcC9xcDYvMnBRNC83UC81UFBLLzggdyAtIC0gMCAxXCIsXG5cInIxYmsybnIvcHBwMnBwcC8zcDQvYlEzcTIvM3A0L0IxUDUvUDNCUFBQL1JOMUtSMyB3IC0gLSAwIDFcIixcblwicjRrcjEvMWIyUjFuMS9wcTRwMS80UTMvMXA0UDEvNVAyL1BQUDRQLzFLMlIzIHcgLSAtIDAgMVwiLFxuXCI2azEvNXAyLzRuUTFQL3A0TjIvMXAxYjQvN0svUFAzcjIvOCB3IC0gLSAwIDFcIixcblwiMnIycmsxL3BwM25icC8ycDFicTIvMlBwNC8xUDFQMVBQMS9QMU5CNC8xQlFLNC83UiB3IC0gLSAwIDFcIixcblwiNWsyLzZyMS9wNy8ycDFQMy8xcDJRMy84LzFxNFBQLzNSMksxIHcgLSAtIDAgMVwiLFxuXCJyMnE0L3BwMXJwUWJrLzNwMnAxLzJwUFAycC81UDIvMk41L1BQUDJQMi8yS1IzUiB3IC0gLSAwIDFcIixcblwiNFIzLzFwNHJrLzZwMS8ycFFCcFAxL3AxUDFwUDIvUHE2LzFQNi9LNyB3IC0gLSAwIDFcIixcblwiMmIyazIvMnAycjFwL3AycFIzLzFwM1BRMS8zcTNOLzFQNi8yUDNQUC81SzIgdyAtIC0gMCAxXCIsXG5cInIxYjFyMy9wcHEycGsxLzJuMXAycC9iNy8zUEIzLzJQMlEyL1AyQjFQUFAvMVIzUksxIHcgLSAtIDAgMVwiLFxuXCIycjUvMms0cC8xcDJwcDIvMVAycXAyLzgvUTVQMS80UFAxUC9SNUsxIHcgLSAtIDAgMVwiLFxuXCI0cTFyay9wYjJicG5wLzJyNFEvMXAxcDFwUDEvNE5QMi8xUDNSMi9QQm40UC9SQjRLMSB3IC0gLSAwIDFcIixcblwiMnI0ay9wNHJScC8xcDFSM0IvNXAxcS8yUG40LzVwMi9QUDRRUC8xQjVLIHcgLSAtIDAgMVwiLFxuXCJyMWIxa2Ixci9wcDJucHBwLzJwUTQvOC8ycTFQMy84L1AxUEIxUFBQLzNSSzJSIHcgLSAtIDAgMVwiLFxuXCIycjFiMy8xcHAxcXJrMS9wMW4xUDFwMS83Ui8yQjFwMy80UTFQMS9QUDNQUDEvM1IySzEgdyAtIC0gMCAxXCIsXG5cIjVyazEvcGJwcHExYk4vMXBuMXAxUTEvNk4xLzNQNC84L1BQUDJQUDEvMks0UiB3IC0gLSAwIDFcIixcblwicW4xcjFrMi8ycjFiMW5wL3BwMXBRMXAxLzNQMlAxLzFQUDJQMi83Ui9QQjRCUC80UjFLMSB3IC0gLSAwIDFcIixcblwicjJyNC8xcDFibjJwL3BuMnBwa0IvNXAyLzRQUU4xLzZQMS9QUHEyUEJQL1IyUjJLMSB3IC0gLSAwIDFcIixcblwiM2sxcjIvMnBiNC8ycDNQMS8yTnAxcDIvMVA2LzRuTjFSLzJQMXEzL1E1SzEgdyAtIC0gMCAxXCIsXG5cIjVyazEvcHBwM3BwLzgvM3BRMy8zUDJiMS81clBxL1BQMVAxUDIvUjFCQjFSSzEgYiAtIC0gMCAxXCIsXG5cInI2ci8xcDJwcDFrL3AxYjJxMXAvNHBQMi82UVIvM0IyUDEvUDFQMksyLzdSIHcgLSAtIDAgMVwiLFxuXCIyazRyL3BwcDJwMi8yYjJCMi83cC82cFAvMlAxcTFiUC9QUDNOMi9SNFFLMSBiIC0gLSAwIDFcIixcblwiMlFSNC82YjEvMXA0cGsvN3AvNW4xUC80cnEyLzVQMi81QksxIHcgLSAtIDAgMVwiLFxuXCJybmIyYjFyL3Aza0JwMS8zcE5uMXAvMnBRTjMvMXAyUFAyLzRCMy9QcTVQLzRLMyB3IC0gLSAwIDFcIixcblwiMnJxMW4xUS9wMXIyazIvMnAxcDFwMS8xcDFwUDMvM1AycDEvMk40Ui9QUFAyUDIvMks0UiB3IC0gLSAwIDFcIixcblwicjJRMXExay9wcDVyLzRCMXAxLzVwMi9QNy80UDJSLzdQLzFSNEsxIHcgLSAtIDAgMVwiLFxuXCIzazQvMnAxcTFwMS84LzFRUFBwMnAvNFBwMi83UC82UDEvN0sgdyAtIC0gMCAxXCIsXG5cIjgvMXAzUWIxL3A1cGsvUDFwMXAxcDEvMVAyUDFQMS8yUDFOMm4vNVAxUC80cUIxSyB3IC0gLSAwIDFcIixcblwiMXIzazIvM1JucDIvNnAxLzZxMS9wMUJRMXAyL1AxUDUvMVAzUFAxLzZLMSB3IC0gLSAwIDFcIixcblwiMnJuMmsxLzFxMU4xcGJwLzRwQjFQL3BwMXBQbjIvM1A0LzFQcjJOMi9QMlExUDFLLzZSMSB3IC0gLSAwIDFcIixcblwiNWsyL3AyUTFwcDEvMWI1cC8xcDJQQjFQLzJwMlAyLzgvUFAzcVBLLzggdyAtIC0gMCAxXCIsXG5cInIza2Ixci9wYjYvMnAycDFwLzFwMnBxMi8ycFEzcC8yTjJCMi9QUDNQUFAvM1JSMUsxIHcgLSAtIDAgMVwiLFxuXCJyMWIxa2Ixci9wcDFuMXBwMS8xcXAxcDJwLzZCMS8yUFBRMy8zQjFOMi9QNFBQUC9SNFJLMSB3IC0gLSAwIDFcIixcblwicm4zazFyL3BicHAxQmJwLzFwNHBOLzRQMUIxLzNuNC8ycTNRMS9QUFAyUFBQLzJLUjNSIHcgLSAtIDAgMVwiLFxuXCIzUjQvcDFyM3JrLzFxMlAxcDEvNXAxcC8xbjYvMUI1UC9QMlEyUDEvM1IzSyB3IC0gLSAwIDFcIixcblwiOC82YmsvMXA2LzVwQnAvMVAyYjMvNlFQL1A1UEsvNXEyIGIgLSAtIDAgMVwiLFxuXCJyMWJxa2IyLzZwMS9wMXA0cC8xcDFONC84LzFCM1EyL1BQM1BQUC8zUjJLMSB3IC0gLSAwIDFcIixcblwiNXJyay81cGIxL3AxcE4zcC83US8xcDJQUDFSLzFxNVAvNlAxLzZSSyB3IC0gLSAwIDFcIixcblwicm5icTFibnIvcHAxcDFwMXAvM3BrMy8zTlAxcDEvNXAyLzVOMi9QUFAxUTFQUC9SMUIxS0IxUiB3IC0gLSAwIDFcIixcblwiMXIzcmsxLzFwbm5xMWJSL3AxcHAyQjEvUDJQMXAyLzFQUDFwUDIvMkIzUDEvNVBLMS8yUTRSIHcgLSAtIDAgMVwiLFxuXCIyUTUvMXAzcDIvM2IxazFwLzNQcDMvNEIxUjEvNHExUDEvcjRQSzEvOCB3IC0gLSAwIDFcIixcblwicjFiM2tyL3BwcDFCcDFwLzFiNi9uMlA0LzJwM3ExLzJRMk4yL1A0UFBQL1JOMlIxSzEgdyAtIC0gMCAxXCIsXG5cIjFSMWJyMWsxL3BSNXAvMnAzcEIvMnAyUDIvUDFxcDJRMS8ybjRQL1A1UDEvNksxIHcgLSAtIDAgMVwiLFxuXCJyMWIybjIvMnEzcmsvcDNwMm4vMXAzcDFQLzROMy9QTjFCMVAyLzFQUFE0LzJLM1IxIHcgLSAtIDAgMVwiLFxuXCJyM3EzL3BwcDNrMS8zcDNSLzViMi8yUFIzUS8yUDFQclAxL1A3LzRLMyB3IC0gLSAwIDFcIixcblwiMnIzazEvM2IyYjEvNXBwMS8zUDQvcEIyUDMvMk5ucU4yLzFQMkIyUS81SzFSIGIgLSAtIDAgMVwiLFxuXCI2cmsvMnAycDFwL3AycTFwMVEvMnAxcFAyLzFuUDFSMy8xUDVQL1A1UDEvMkIzSzEgdyAtIC0gMCAxXCIsXG5cIjFyMmJrMi8xcDNwcHAvcDFuMnEyLzJONS8xUDYvUDNSMVAxLzVQQlAvNFExSzEgdyAtIC0gMCAxXCIsXG5cInIzcmsyLzVwbjEvcGIxbnExcFIvMXAycDFQMS8ycDFQMy8yUDJRTjEvUFBCQjFQMi8ySzRSIHcgLSAtIDAgMVwiLFxuXCIzcmtxMXIvMXBRMnAxcC9wM2JQcDEvM3BSMy84LzgvUFBQMlBQMS8xSzFSNCB3IC0gLSAwIDFcIixcblwicjFicTNyL3BwcDFuUTIvMmtwMU4yLzZOMS8zYlAzLzgvUDJuMVBQUC8xUjNSSzEgdyAtIC0gMCAxXCIsXG5cIm4ycTFyMWsvNGJwMXAvNHAzLzRQMXAxLzJwUE5RMi8ycDRSLzVQUFAvMkIzSzEgdyAtIC0gMCAxXCIsXG5cIjJScjFxazEvNXBwcC9wMk40L1A3LzVRMi84LzFyNFBQLzVCSzEgdyAtIC0gMCAxXCIsXG5cIjgvNmsxLzNwMXJwMS8zQnAxcDEvMXBQMVAxSzEvNGJQUjEvUDVRMS80cTMgYiAtIC0gMCAxXCIsXG5cInIxYnEycmsvcHAzcGJwLzJwMXAxcFEvN1AvM1A0LzJQQjFOMi9QUDNQUFIvMktSNCB3IC0gLSAwIDFcIixcblwiNXFyMS9wcjNwMWsvMW4xcDJwMS8ycFBwUDFwL1AzUDJRLzJQMUJQMVIvN1AvNlJLIHcgLSAtIDAgMVwiLFxuXCJybjJrYjFyL3BwMnBwMXAvMnAycDIvOC84LzNRMU4yL3FQUEIxUFBQLzJLUjNSIHcgLSAtIDAgMVwiLFxuXCI3ay9wYjRycC8ycXAxUTIvMXAzcFAxL25wM1AyLzNQck4xUi9QMVA0UC9SM04xSzEgdyAtIC0gMCAxXCIsXG5cIjgvcDRwazEvNnAxLzNSNC8zbnFOMVAvMlEzUDEvNVAyLzNyMUJLMSBiIC0gLSAwIDFcIixcblwicjNyazIvcDNicDIvMnAxcUIyLzFwMW5QMVJQLzNQNC8yUFE0L1A1UDEvNVJLMSB3IC0gLSAwIDFcIixcblwiNmsxL3BwM3BwcC80cDMvMlAzYjEvYlBQM1AxLzNLNC9QM1ExcTEvMVI1UiBiIC0gLSAwIDFcIixcblwicjFiMnJrMS9wMXFuYnAxcC8ycDNwMS8ycHAzUS80cFAyLzFQMUJQMVIxL1BCUFAyUFAvUk40SzEgdyAtIC0gMCAxXCIsXG5cIjNyNC9wNFExcC8xcDJQMmsvMnAzcHEvMlAyQjIvMVAycDJQL1A1UDEvNksxIHcgLSAtIDAgMVwiLFxuXCI2azEvOC8zcTFwMi9wNXAxL1AxYjFQMnAvUjFRNFAvNUtOMS8zcjQgYiAtIC0gMCAxXCIsXG5dO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG5cInI0cjFrL3AycDNwL2JwMU5wMy80UDMvMlAyblIxLzNCMXEyL1AxUFE0LzJLM1IxIHcgLSAtIDAgMVwiLFxuXCIzcjJrMS9wMXAycDIvYnAycDFuUS80UEIxUC8ycHIzcS82UjEvUFAzUFAxLzNSMksxIHcgLSAtIDAgMVwiLFxuXCIycjNrMS9wNlIvMXAycDFwMS9uSzROMS9QNFAyLzNuNC80cjFQMS83UiBiIC0gLSAwIDFcIixcblwiTjFiazQvcHAxcDFRcHAvOC8yYjUvM24zcS84L1BQUDJSUFAvUk5CMXJCSzEgYiAtIC0gMCAxXCIsXG5cIjVyazEvMXAxbjJicC9wNy9QMlAycDEvNFIzLzROMVBiLzJRQjFxMVAvNFIySyBiIC0gLSAwIDFcIixcblwiNGsxcjEvcHAyYnAyLzJwNS8zUFBQMi8xcTYvN3IvMVAyUTJQLzJSUjNLIGIgLSAtIDAgMVwiLFxuXCI4LzRSMXBrL3A1cDEvOC8xcEIxbjFiMS8xUDJiMVAxL1A0cjFQLzVSMUsgYiAtIC0gMCAxXCIsXG5cIjJrcjFiMXIvcHAzcHBwLzJwMWIycS80QjMvNFEzLzJQQjJSMS9QUFAyUFBQLzNSMksxIHcgLSAtIDAgMVwiLFxuXCJyM2szLzNiM1IvMW4xcDFiMVEvMXAxUHBQMU4vMVAyUDFQMS82SzEvMkIxcTMvOCB3IC0gLSAwIDFcIixcblwicjNRblIxLzFiazUvcHA1cS8yYjUvMnAxUDMvUDcvMUJCNFAvM1IzSyB3IC0gLSAwIDFcIixcblwiMXI0azEvM2IycHAvMWIxcFAyci9wcDFQNC80cTMvOC9QUDRSUC8yUTJSMUsgYiAtIC0gMCAxXCIsXG5cIjJyMmIxay9wMlEzcC9iMW4yUHBQLzJwNS8zcjFCTjEvM3EyUDEvUDRQQjEvUjNSMUsxIHcgLSAtIDAgMVwiLFxuXCJyNFIyLzFiMm4xcHAvcDJOcDFrMS8xcG41LzRwUDFQLzgvUFBQMUIxUDEvMks0UiB3IC0gLSAwIDFcIixcblwiYjNyMWsxL3A0UmJOL1AzUDFwMS8xcDYvMXFwNFAvNFExUDEvNVAyLzVCSzEgdyAtIC0gMCAxXCIsXG5cInExcjJiMWsvcmI0bnAvMXAycDJOL3BCMW40LzZRMS8xUDJQMy9QQjNQUFAvMlJSMksxIHcgLSAtIDAgMVwiLFxuXCIycjFrMnIvcFIycDFicC8ybjFQMXAxLzgvMlFQNC9xMmIxTjIvUDJCMVBQUC80SzJSIHcgLSAtIDAgMVwiLFxuXCIxazVyLzNSMXBicC8xQjJwMy8yTnBQbjIvNXAyLzgvMVBQM1BQLzZLMSB3IC0gLSAwIDFcIixcblwiMnJyMWsyL3BiNHAxLzFwMXFwcDIvNFIyUS8zbjQvUDFONS8xUDNQUFAvMUIyUjFLMSB3IC0gLSAwIDFcIixcblwiMnE0ay81cE5QL3AycDFCcFAvNHAzLzFwMmIzLzFQNi9QMXIyUjIvMUs0UTEgdyAtIC0gMCAxXCIsXG5cIjZrMS8yckIxcDIvUkIxcDJwYi8zUHAycC80UDMvM0syTlEvNVBxMS84IGIgLSAtIDAgMVwiLFxuXCI1cmsxLzFwMXEyYnAvcDJwTjFwMS8ycFAyQm4vMlAzUDEvMVA2L1A0UUtQLzVSMiB3IC0gLSAwIDFcIixcblwiM3JrMmIvNVIxUC82QjEvOC8xUDNwTjEvN1AvUDJwYlAyLzZLMSB3IC0gLSAwIDFcIixcblwiMmJxMWsxci9yNXBwL3AyYjFQbjEvMXAxUTQvM1A0LzFCNi9QUDNQUFAvMlIxUjFLMSB3IC0gLSAwIDFcIixcblwiNEIzLzZSMS8xcDVrL3AycjNOL1BuMXAyUDEvN1AvMVAzUDIvNksxIHcgLSAtIDAgMVwiLFxuXCIxcjJScjIvM1AxcDFrLzVScHAvcXA2LzJwUTQvN1AvNVBQSy84IHcgLSAtIDAgMVwiLFxuXCJyNGtyMS8xYjJSMW4xL3BxNHAxLzRRMy8xcDRQMS81UDIvUFBQNFAvMUsyUjMgdyAtIC0gMCAxXCIsXG5cIjJiMmsyLzJwMnIxcC9wMnBSMy8xcDNQUTEvM3EzTi8xUDYvMlAzUFAvNUsyIHcgLSAtIDAgMVwiLFxuXCI0cTFyay9wYjJicG5wLzJyNFEvMXAxcDFwUDEvNE5QMi8xUDNSMi9QQm40UC9SQjRLMSB3IC0gLSAwIDFcIixcblwiMnI0ay9wNHJScC8xcDFSM0IvNXAxcS8yUG40LzVwMi9QUDRRUC8xQjVLIHcgLSAtIDAgMVwiLFxuXCJyMnI0LzFwMWJuMnAvcG4ycHBrQi81cDIvNFBRTjEvNlAxL1BQcTJQQlAvUjJSMksxIHcgLSAtIDAgMVwiLFxuXCI1cjFrLzdiLzRCMy82SzEvM1IxTjIvOC84LzggdyAtIC0gMCAxXCIsXG5cInI1bnIvNlJwL3AxTk5rcDIvMXAzYjIvMnA1LzVLMi9QUDJQMy8zUjQgdyAtIC0gMCAxXCIsXG5cIjFyM2syLzNSbnAyLzZwMS82cTEvcDFCUTFwMi9QMVA1LzFQM1BQMS82SzEgdyAtIC0gMCAxXCIsXG5cIjJybjJrMS8xcTFOMXBicC80cEIxUC9wcDFwUG4yLzNQNC8xUHIyTjIvUDJRMVAxSy82UjEgdyAtIC0gMCAxXCIsXG5cIjNSNC9wMXIzcmsvMXEyUDFwMS81cDFwLzFuNi8xQjVQL1AyUTJQMS8zUjNLIHcgLSAtIDAgMVwiLFxuXCJyMWIybjIvMnEzcmsvcDNwMm4vMXAzcDFQLzROMy9QTjFCMVAyLzFQUFE0LzJLM1IxIHcgLSAtIDAgMVwiLFxuXCJyM3EzL3BwcDNrMS8zcDNSLzViMi8yUFIzUS8yUDFQclAxL1A3LzRLMyB3IC0gLSAwIDFcIixcblwiMXIyYmsyLzFwM3BwcC9wMW4ycTIvMk41LzFQNi9QM1IxUDEvNVBCUC80UTFLMSB3IC0gLSAwIDFcIixcblwiMlJyMXFrMS81cHBwL3AyTjQvUDcvNVEyLzgvMXI0UFAvNUJLMSB3IC0gLSAwIDFcIixcblwiN2svcGI0cnAvMnFwMVEyLzFwM3BQMS9ucDNQMi8zUHJOMVIvUDFQNFAvUjNOMUsxIHcgLSAtIDAgMVwiLFxuXCI4L3A0cGsxLzZwMS8zUjQvM25xTjFQLzJRM1AxLzVQMi8zcjFCSzEgYiAtIC0gMCAxXCIsXG5cIjRyMy9wYnBuMm4xLzFwMXBycDFrLzgvMlBQMlBCL1A1TjEvMkIyUjFQL1I1SzEgdyAtIC0gMCAxXCIsXG5cInI0cjFrL3BwMWIycG4vOC8zcFIzLzVOMi8zUTQvUHEzUFBQLzVSSzEgdyAtIC0gMCAxXCIsXG5cIjFyMnIxazEvNXAyLzVScDEvNFEycC9QMkIycVAvMU5QNS8xS1A1LzggdyAtIC0gMCAxXCIsXG5cIjFyM3JrMS8xbnFiMm4xLzZSMS8xcDFQcDMvMVBwM3AxLzJQNFAvMkIyUVAxLzJCMlJLMSB3IC0gLSAwIDFcIixcblwicjcvMXAzUTIvMmtwcjJwL3AxcDJScDEvUDNQcDIvMVAzUDIvMUIycTFQUC8zUjNLIHcgLSAtIDAgMVwiLFxuXCIxcjNyMi8xcDVSL3AxbjJwcDEvMW4xQjFQazEvOC84L1AxUDJCUFAvMksxUjMgdyAtIC0gMCAxXCIsXG5cIjRrMnIvMVIzUjIvcDNwMXBwLzRiMy8xQm5OcjMvOC9QMVA1LzVLMiB3IC0gLSAwIDFcIixcblwiNXEyLzFwcHIxYnIxLzFwMXAxa25SLzFONFIxL1AxUDFQUDIvMVA2LzJQNFEvMks1IHcgLSAtIDAgMVwiLFxuXCI3ay8zcWJSMW4vcjVwMS8zQnAxUDEvMXAxcFAxcjEvM1AyUTEvMVA1Sy8yUjUgdyAtIC0gMCAxXCIsXG5cIjRuMy9wYnEycmsxLzFwM3BOMS84LzJwMlEyL1BuNE4xL0I0UFAxLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCI4LzFwMnAxa3AvMnJSQjMvcHEybjFQcC80UDMvOC9QUFAyUTIvMks1IHcgLSAtIDAgMVwiLFxuXCIzcjFyazEvMXEyYjFuMS9wMWIxcFJwUS8xcDJQMy8zQk4zL1AxUEI0LzFQNFBQLzRSMksgdyAtIC0gMCAxXCIsXG5cIjJiMnIxay8xcDJSMy8ybjJyMXAvcDFQMU4xcDEvMkIzUDEvUDZQLzFQM1IyLzZLMSB3IC0gLSAwIDFcIixcblwiMXFyMmJrMS9wYjNwcDEvMXBuM25wLzNOMk5RLzgvUDcvQlAzUFBQLzJCMVIxSzEgdyAtIC0gMCAxXCIsXG5cIjJyazQvNVIyLzNwcDFRMS9wYjJxMk4vMXAyUDMvOC9QUHI1LzFLMVI0IHcgLSAtIDAgMVwiLFxuXCJyNHIxay9wcDRSMS8zcE4xcDEvM1AyUXAvMXEyUHBuMS84LzZQUC81UksxIHcgLSAtIDAgMVwiLFxuXCJyMnIxYjFrL3BSNi82cHAvNVEyLzNxQjMvNlAxL1AzUFAxUC82SzEgdyAtIC0gMCAxXCIsXG5cInIzcmtuUS8xcDFSMXBiMS9wM3BxQkIvMnA1LzgvNlAxL1BQUDJQMVAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cIjNyYjFrMS9wcHEzcDEvMnAxcDFwMS82UDEvMlByM1IvMVAxUTQvUDFCNFAvNVJLMSB3IC0gLSAwIDFcIixcblwiNXJrMS8xYlIycGJwLzRwMXAxLzgvMXAxUDFQUHEvMUIyUDJyL1AyTlEyUC81UksxIGIgLSAtIDAgMVwiLFxuXCIzcTFyazEvNGJwMXAvMW4yUDJRLzFwMXAxcDIvNnIxL1BwMlIyTi8xQjFQMlBQLzdLIHcgLSAtIDAgMVwiLFxuXCIzbmsxcjEvMXBxNHAvcDNQUXBCLzVwMi8ycjUvOC9QNFBQUC8zUlIxSzEgdyAtIC0gMCAxXCIsXG5cIjZyay81cDFwLzVwMi8xcDJiUDIvMVAyUjJRLzJxMUJCUFAvNVBLMS9yNyB3IC0gLSAwIDFcIixcblwiMWI0cmsvNFIxcHAvcDFiNHIvMlBCNC9QcDFRNC82UHEvMVAzUDFQLzRSTksxIHcgLSAtIDAgMVwiLFxuXCJRNFIyLzNrcjMvMXEzbjFwLzJwMXAxcDEvMXAxYlAxUDEvMUIxUDNQLzJQQkszLzggdyAtIC0gMCAxXCIsXG5cIjJyazJyMS8zYjNSL24zcFJCMS9wMnBQMVAxLzNONC8xUHA1L1AxSzRQLzggdyAtIC0gMCAxXCIsXG5cIjJyNS8yUjUvM25wa3BwLzNiTjMvcDRQUDEvNEszL1AxQjRQLzggdyAtIC0gMCAxXCIsXG5cInIycXIyay9wcDFiM3AvMm5RNC8ycEIxcDFQLzNuMVBwUi8yTlAyUDEvUFBQNS8ySzFSMU4xIHcgLSAtIDAgMVwiLFxuXCIxcjNyMWsvMlI0cC9xNHBwUC8zUHBRMi8yUmJQMy9wUDYvUDJCMlAxLzFLNiB3IC0gLSAwIDFcIixcblwiMnIzazEvcHAzcHBwLzFxcjJuMi8zcDFRMi8xUDYvUDJCUDJQLzVQUDEvMlIyUksxIHcgLSAtIDAgMVwiLFxuXCI1azIvcDNScjIvMXA0cHAvcTRwMi8xbmJRMVAyLzZQMS81TjFQLzNSMksxIHcgLSAtIDAgMVwiLFxuXCJyM3IzLzNSMVFwMS9wcWIxcDJrLzFwNE4xLzgvNFAzL1BiM1BQUC8yUjNLMSB3IC0gLSAwIDFcIixcblwiOC80azMvMXAycDFwMS9wUDFwUG5QMS9QMXJQcTJwLzFLUDJSMU4vOC81UTIgYiAtIC0gMCAxXCIsXG5cIjJxM2sxLzFwNHBwLzNSMXIyL3AyYlEzL1A3LzFOMkIzLzFQUDNyUC9SM0szIGIgLSAtIDAgMVwiLFxuXCI0cmsyLzVwMWIvMXAzUjFLL3A2cC8yUDJQMi8xUDYvMnE0UC9RNVIxIHcgLSAtIDAgMVwiLFxuXCIycjJiazEvMnFuMXBwcC9wbjFwNC81TjIvTjNyMy8xUTYvNVBQUC9CUjNCSzEgdyAtIC0gMCAxXCIsXG5cIjZrMS9wcDNyMi8ycDRxLzNwMnAxLzNQcDFiMS80UDFQMS9QUDRSUC8yUTFSck5LIGIgLSAtIDAgMVwiLFxuXCJyNWtyL3BwcE4xcHAxLzFibjFSMy8xcTFOMkJwLzNwMlExLzgvUFBQMlBQUC9SNUsxIHcgLSAtIDAgMVwiLFxuXCIxcTFyMWsyLzFiMlJwcDEvcDFwUTNwL1BwUHA0LzNQMU5QMS8xUDNQMVAvNksxLzggdyAtIC0gMCAxXCIsXG5cIjRyMy8yUk40L3AxcjUvMWsxcDQvNUJwMS9wMlA0LzFQNFBLLzggdyAtIC0gMCAxXCIsXG5cInIyUm5rMXIvMXAycTFiMS83cC82cFEvNFBwYjEvMUJQNS9QUDNCUFAvMks0UiB3IC0gLSAwIDFcIixcblwicjNuMWsxL3BiNXAvNE4xcDEvMnByNC9xNy8zQjNQLzFQMVExUFAxLzJCMVIxSzEgdyAtIC0gMCAxXCIsXG5cIjZrMS81cDIvM1AxQnBwLzJiMVAzL2IxcDJwMi9wMVA1L1I1clAvMk4xSzMgYiAtIC0gMCAxXCIsXG5cInI1clIvM05rcDIvNHAzLzFRNHExL25wMU40LzgvYlBQUjJQMS8ySzUgdyAtIC0gMCAxXCIsXG5cIjZrMS8xcDJxMnAvcDNQMXBCLzgvMVAycDMvMlFyMlAxL1A0UDFQLzJSM0sxIHcgLSAtIDAgMVwiLFxuXCI0UjMvMnAya3BRLzNwM3AvcDJyMnExLzgvMVByMlAyL1AxUDNQUC80UjFLMSB3IC0gLSAwIDFcIixcblwiOC8yazJyMi9wcDYvMnAxUjFOcC82cG4vOC9QcjRCMS8zUjNLIHcgLSAtIDAgMVwiLFxuXCI1UjIvNHIxcjEvMXA0azEvcDFwQjJCcC9QMVA0Sy8yUDFwMy8xUDYvOCB3IC0gLSAwIDFcIixcblwiNmsxL3BwcDJwcHAvOC8ybjJLMVAvMlAyUDFQLzJCcHIzL1BQNHIxLzRSUjIgYiAtIC0gMCAxXCIsXG5cIjJxcjJrMS80cnBwTi9wcG5wNC8ycFIzUS8yUDJQMi8xUDRQMS9QQjVQLzZLMSB3IC0gLSAwIDFcIixcblwiM1I0LzNRMXAyL3Excm4ya3AvNHAzLzRQMy8yTjNQMS81UDFQLzZLMSB3IC0gLSAwIDFcIixcblwiNGtyMi8zcm4ycC8xUDRwMS8ycDUvUTFCMlAyLzgvUDJxMlBQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCIzcTNyL3I0cGsxL3BwMnBOcDEvM2JQMVExLzdSLzgvUFAzUFBQLzNSMksxIHcgLSAtIDAgMVwiLFxuXCJybmIza3IvcHBwNHAvM2IzQi8zUHAybi8yQlA0LzRLUnAxL1BQUDNxMS9STjFRNCB3IC0gLSAwIDFcIixcblwicjFrcTFiMXIvNXBwcC9wNG4yLzJwUFIxQjEvUTcvMlA1L1A0UFBQLzFSNEsxIHcgLSAtIDAgMVwiLFxuXCIycjUvMnAyazFwL3BxcDFSQjIvMnI1L1BiUTJOMi8xUDNQUDEvMlAzUDEvNFIySyB3IC0gLSAwIDFcIixcblwiNmsxLzVwMi9SNXAxL1A2bi84LzVQUHAvMnIzclAvUjROMUsgYiAtIC0gMCAxXCIsXG5cInIza3IyLzZRcC8xUGIycDIvcEIzUjIvM3BxMkIvNG4zLzFQNFBQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCI1cmsxL24xcDFSMWJwL3AycDQvMXFwUDFRQjEvN1AvMlAzUDEvUFAzUDIvNksxIHcgLSAtIDAgMVwiLFxuXCIycnJrMy9RUjNwcDEvMm4xYjJwLzFCQjFxMy8zUDQvOC9QNFBQUC82SzEgdyAtIC0gMCAxXCIsXG5cIjJxMWIxazEvcDVwcC9uMlI0LzFwMlAzLzJwNS9CMVA1LzVRUFAvNksxIHcgLSAtIDAgMVwiLFxuXCJiNHJrMS82cDEvNHAxTjEvcTNQMVExLzFwMVI0LzFQNXIvUDRQMi8zUjJLMSB3IC0gLSAwIDFcIixcblwiNmsxLzFwNXAvcDJwMXEyLzNQYjMvMVEyUDMvM2IxQnBQL1BQcjNQMS9LUk41IGIgLSAtIDAgMVwiLFxuXCI1UTIvMXAzcDFOLzJwM3AxLzViMWsvMlAzbjEvUDRSUDEvM3EyclAvNVIxSyB3IC0gLSAwIDFcIixcblwiNmsxLzFyNG5wL3BwMXAxUjFCLzJwUDJwMS9QMVA1LzFuNVAvNlAxLzRSMksgdyAtIC0gMCAxXCIsXG5cIlI0cmsxLzRyMXAxLzFxMnAxUXAvMXBiNS8xbjVSLzVOQjEvMVAzUFBQLzZLMSB3IC0gLSAwIDFcIixcblwiOC9wMXA1LzJwM2sxLzJiMXJwQjEvN0svMlAzUFAvUDFQMnIyLzNSM1IgYiAtIC0gMCAxXCIsXG5cInIxYjJyazEvMXAybnBwcC9wMlIxYjIvNHFQMVEvNFAzLzFCMkIzL1BQUDJQMVAvMkszUjEgdyAtIC0gMCAxXCIsXG5cIjdrL3AxcDJicDEvM3ExTjFwLzRyUDIvNHBRMi8yUDRSL1AycjJQUC80UjJLIHcgLSAtIDAgMVwiLFxuXCI2azEvNFIzL3A1cTEvMnBQMVEyLzNibjFyMS9QNy82UFAvNVIxSyBiIC0gLSAwIDFcIixcblwicjVrMS8zbnBwMXAvMmIzcDEvMXBuNS8ycFJQMy8yUDFCUFAxL3IxUDRQLzFOS1IxQjIgYiAtIC0gMCAxXCIsXG5cIjVyazEvM3AxcDFwL3A0UXExLzFwMVAyUjEvN04vbjZQLzJyM1BLLzggdyAtIC0gMCAxXCIsXG5cIjVyMWsvMXAxYjFwMXAvcDJwcGIyLzVQMUIvMXE2LzFQcjNSMS8yUFEyUFAvNVIxSyB3IC0gLSAwIDFcIixcblwiNXIyL3BwMlIzLzFxMXAzUS8ycFAxYjIvMlBrcnAyLzNCNC9QUEsyUFAxL1I3IHcgLSAtIDAgMVwiLFxuXCI1YjIvcHAycjFway8ycHAxUjFwLzRyUDFOLzJQMVAzLzFQNFExL1AzcTFQUC81UjFLIHcgLSAtIDAgMVwiLFxuXCI1bjFrL3JxNHJwL3AxYnAxYjIvMnAxcFAxUS9QMUIxUDJSLzJOM1IxLzFQNFBQLzZLMSB3IC0gLSAwIDFcIixcblwiMnJrcjMvM2IxcDFSLzNSMVAyLzFwMlExUDEvcFBxNS9QMU41LzFLUDUvOCB3IC0gLSAwIDFcIixcblwiMXJiazFyMi9wcDRSMS8zTnAzLzNwMnAxLzZxMS9CUDJQMy9QMlAyQjEvMlIzSzEgdyAtIC0gMCAxXCIsXG5cIjZrMS81cDIvcDNiUnBRLzRxMy8ycjNQMS82TlAvUDFwMlIxSy8xcjYgdyAtIC0gMCAxXCIsXG5cInIxcXIzay8zUjJwMS9wM1EzLzFwMnAxcDEvM2JOMy84L1BQM1BQUC81UksxIHcgLSAtIDAgMVwiLFxuXCI1cmsxL3BiMm5wcDEvMXBxNHAvNXAyLzVCMi8xQjYvUDJSUTFQUC8ycjFSMksgYiAtIC0gMCAxXCIsXG5cInI0YnIxLzNiMWtwcC8xcTFQNC8xcHAxUlAxTi9wNy82UTEvUFBCM1BQLzJLUjQgdyAtIC0gMCAxXCIsXG5cInIzUm5rci8xYjVwL3AzTnBCMS8zcDQvMXA2LzgvUFBQM1AxLzJLMlIyIHcgLSAtIDAgMVwiLFxuXCIycjNrMS9wNHAyLzFwMlAxcFEvM2JSMnAvMXE2LzFCNi9QUDJSUHIxLzVLMiB3IC0gLSAwIDFcIixcblwiMnI1LzFOcjFrcFJwL3AzYjMvTjNwMy8xUDNuMi9QNy81UFBQL0s2UiBiIC0gLSAwIDFcIixcblwiMnI0ay9wcHFicFExcC8zcDFicEIvOC84LzFOcjJQMi9QUFAzUDEvMktSM1IgdyAtIC0gMCAxXCIsXG5cInIxYnIyazEvNHAxYjEvcHEycG4yLzFwNE4xLzdRLzNCNC9QUFAzUFAvUjRSMUsgdyAtIC0gMCAxXCIsXG5cIjFyMWtyMy9OYnBwbjFwcC8xYjYvOC82UTEvM0IxUDIvUHEzUDFQLzNSUjFLMSB3IC0gLSAwIDFcIixcblwibjcvcGszcHAxLzFyUjNwMS9RUDFwcTMvNG4zLzZQQi80UFAxUC8yUjNLMSB3IC0gLSAwIDFcIixcblwiNmsxL3BwNHAxLzJwNS8yYnA0LzgvUDVQYi8xUDNyclAvMkJSUk4xSyBiIC0gLSAwIDFcIixcblwiM2IycjEvNVJuMS8ycVAycGsvcDFwMUIzLzJQMU4zLzFQM1EyLzZLMS84IHcgLSAtIDAgMVwiLFxuXCIycjFyazIvMXAycXAxUi80cDFwMS8xYjFwUDFOMS9wMlA0L25CUDFRMy9QNFBQUC9SNUsxIHcgLSAtIDAgMVwiLFxuXCIycjNrMS8xcDNwcHAvcDNwMy83UC9QNFAyLzFSMlFiUDEvNnExLzFCMkszIGIgLSAtIDAgMVwiLFxuXCJrMnIzci9wM1JwcHAvMXA0cTEvMVAxYjQvM1ExQjIvNk4xL1BQM1BQUC82SzEgdyAtIC0gMCAxXCIsXG5cIjRyazFyL3AyYjFwcDEvMXE1cC8zcFIxbjEvM04xcDIvMVAxUTFQMi9QQlAzUEsvNFIzIHcgLSAtIDAgMVwiLFxuXCJSNlIvMmtyNC8xcDNwYjEvM3ByTjIvNlAxLzJQMksyLzFQNi84IHcgLSAtIDAgMVwiLFxuXCJyNWsxLzJSYjNyL3AycDNiL1AyUHAzLzRQMXBxLzVwMi8xUFEyQjFQLzJSMkJLTiBiIC0gLSAwIDFcIixcblwiMWs2LzVRMi8yUnIycHAvcHFQNS8xcDYvN1AvMlAzUEsvNHIzIHcgLSAtIDAgMVwiLFxuXCIxcTJyMy9rNHAyL3ByUTJiMXAvUjcvMVBQMUIxcDEvNlAxL1A1SzEvOCB3IC0gLSAwIDFcIixcblwiMms0ci9wcDNwUTEvMnE1LzJuNS84L04zcFBQMS9QM3IzL1IxUjNLMSBiIC0gLSAwIDFcIixcblwiNHIxazEvMXAzcTFwL3AxcFE0LzJQMVIxcDEvNW4yLzJCNS9QUDVQLzZLMSBiIC0gLSAwIDFcIixcblwiNHIxazEvcFIzcHAxLzFuM1AxcC9xMnA0LzVOMVAvUDFyUXBQMi84LzJCMlJLMSB3IC0gLSAwIDFcIixcblwiMVI0bnIvcDFrMXBwYjEvMnA0cC80UHAyLzNOMVAxQi84L3ExUDNQUC8zUTJLMSB3IC0gLSAwIDFcIixcblwiMlIyYmsxLzVycjEvcDNRMlIvM1BwcTIvMXAzcDIvOC9QUDFCMlBQLzdLIHcgLSAtIDAgMVwiLFxuXCIzcjNrL3BwNHAxLzNxUXAxcC9QMXA1LzdSLzNyTjFQUC8xQjNQMi82SzEgdyAtIC0gMCAxXCIsXG5cImtyNi9wUjVSLzFxMXBwMy84LzFRNi8yUDUvUEtQNS81cjIgdyAtIC0gMCAxXCIsXG5cIjRyMWsxLzVwcHAvcDJwNC80cjMvMXBObjQvMVA2LzFQUEsyUFAvUjNSMyBiIC0gLSAwIDFcIixcblwiN2svcGJwM2JwLzNwNC8xcDVxLzNuMnAxLzVyQjEvUFAxTnJOMVAvMVExQlJSSzEgYiAtIC0gMCAxXCIsXG5cInIzcjMvcHBwNHAvMmJxMk5rLzgvMVBQNS9QMUIzUTEvNlBQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCI0cjFrMS8zTjFwcHAvM3I0LzgvMW4zcDFQLzVQMi9QUDNLMVAvUk41UiBiIC0gLSAwIDFcIixcblwiNHJrMi8ycFExcDIvMnAyQjIvMlAxUDJxLzFiNFIxLzFQNi9yNVBQLzJSM0sxIHcgLSAtIDAgMVwiLFxuXCIzcjJrMS82cHAvMW5RMVIzLzNyNC8zTjJxMS82TjEvbjRQUFAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cImIxcjNrMS9wcTJiMXIxLzFwM1IxcC81UTIvMlA1L1A0TjFQLzVQUDEvMUIyUjFLMSB3IC0gLSAwIDFcIixcblwiMlIxUjFuay8xcDRycC9wMW41LzNOMnAxLzFQNi8yUDUvUDZQLzJLNSB3IC0gLSAwIDFcIixcblwibjNyMWsxL1E0UjFwL3A1cGIvMXAycDFOMS8xcTJQMy8xUDRQQi8yUDNLUC84IHcgLSAtIDAgMVwiLFxuXCI0cjFrMS81cTIvcDVwUS8zYjFwQjEvMnBQNC8yUDNQMS8xUDJSMVBLLzggdyAtIC0gMCAxXCIsXG5cIjZrMS9wcDNwMi8ycDJucDEvMlAxcGJxcC9QM1AzLzJOMm5QMS8yUHIxUDIvMVJRMVJCMUsgYiAtIC0gMCAxXCIsXG5cIjJyM2sxL3BiM3BwcC84L3FQMmIzLzgvMVA2LzFQMVJRUFBQLzFLM0IxUiBiIC0gLSAwIDFcIixcblwicjNybjFrLzRiMVJwL3BwMXAycEIvM1BwMy9QMnFCMVExLzgvMlAzUFAvNVIxSyB3IC0gLSAwIDFcIixcblwicm5iMnIxay9wcDJxMnAvMnAyUjIvOC8yQnAzUS84L1BQUDNQUC9STjRLMSB3IC0gLSAwIDFcIixcblwiM2s0LzFwcDNiMS80YjJwLzFwM3FwMS8zUG4zLzJQMVJOMi9yNVAxLzFRMlIxSzEgYiAtIC0gMCAxXCIsXG5cIjJrcjNyLzFwM3BwcC9wM3BuMi8yYjFCMnEvUTFONS8yUDUvUFAzUFBQL1IyUjJLMSB3IC0gLSAwIDFcIixcblwiNXExay9wM1IxcnAvMnByMnAxLzFwTjJiUDEvM1ExUDIvMUI2L1BQNVAvMks1IHcgLSAtIDAgMVwiLFxuXCI4LzdwLzVwazEvM24ycHEvM04xblIxLzFQM1AyL1A2UC80UUsyIHcgLSAtIDAgMVwiLFxuXCI0cjJSLzNxMWtiUi8xcDRwMS9wMXBQMXBQMS9QMVAyUDIvSzVRMS8xUDJwMy84IHcgLSAtIDAgMVwiLFxuXCJybjNrMi9wUjJiMy80cDFRMS8ycTFOMlAvM1IyUDEvM0s0L1AzQnIyLzggdyAtIC0gMCAxXCIsXG5cIjJxNS9wM3Ayay8zcFAxcDEvMnJOMlBuLzFwMVE0LzdSL1BQcjUvMUs1UiB3IC0gLSAwIDFcIixcblwiYjVyMS8ycjUvMnBrNC8yTjFSMXAxLzFQNFAxLzRLMnAvNFAyUC9SNyB3IC0gLSAwIDFcIixcblwiNmsxL3AxcDNwcC82cTEvM3ByMy8zTm4zLzFRUDFCMVBiL1BQM3IxUC9SM1IxSzEgYiAtIC0gMCAxXCIsXG5cIjRyMXIxL3BiMVEyYnAvMXAxUm5rcDEvNXAyLzJQMVAzLzRCUDIvcVAyQjFQUC8yUjNLMSB3IC0gLSAwIDFcIixcblwiMWszcjIvNFIxUTEvcDJxMXIyLzgvMnAxQmIyLzVSMi9wUDVQL0s3IHcgLSAtIDAgMVwiLFxuXCIzcjQvMXA2LzJwNHAvNWsyL3AxUDFuMlAvM05LMW5OL1AxcjUvMVIyUjMgYiAtIC0gMCAxXCIsXG5cInIxYjNuci9wcHAxa0IxcC8zcDQvOC8zUFBCbmIvMVEzcDIvUFBQMnEyL1JONFJLIGIgLSAtIDAgMVwiLFxuXCI2azEvcDJyUjFwMS8xcDFyMXAxUi8zUDQvNFFQcTEvMVA2L1A1UEsvOCB3IC0gLSAwIDFcIixcblwiM3IxYjFrLzFwM1IyLzdwLzJwNE4vcDRQMi8ySzNSMS9QUDYvM3I0IHcgLSAtIDAgMVwiLFxuXCI4LzZSMS9wMmtwMnIvcWI1UC8zcDFOMVEvMXAxUHIzL1BQNi8xSzVSIHcgLSAtIDAgMVwiLFxuXCI4LzRrMy9QNFJSMS8yYjFyMy8zbjJQcC84LzVLUDEvOCBiIC0gLSAwIDFcIixcblwicjJxMWJrMS81bjFwLzJwM3BQL3A3LzNCcjMvMVAzUFFSL1A1UDEvMktSNCB3IC0gLSAwIDFcIixcblwiMVE2L3IzUjJwL2sycDJwUC9wMXE1L1BwNFAxLzVQMi8xUFAzSzEvOCB3IC0gLSAwIDFcIixcblwiNmsxLzZwcC9wcDFwM3EvM1A0L1AxUTJiMi8xTk4xcjJiLzFQUDRQLzZSSyBiIC0gLSAwIDFcIixcblwiM3IyazEvNnAxLzNOcDJwLzJQMVAzLzFwMlExUGIvMVAzUjFQLzFxcjUvNVJLMSB3IC0gLSAwIDFcIixcblwiMXIyazMvMnBuMXAyL3AxUWIzcC83cS8zUFAzLzJQMUJOMWIvUFAxTjFQcjEvUlI1SyBiIC0gLSAwIDFcIixcblwiM3IxazFyL3AxcTJwMi8xcHAyTjFwL24zUlEyLzNQNC8ycDFQUjIvUFA0UFAvNksxIHcgLSAtIDAgMVwiLFxuXCJyM24yUi9wcDJuMy8zcDFrcDEvMXExUHAxTjEvNlAxLzJQMUJQMi9QUDYvMktSNCB3IC0gLSAwIDFcIixcblwiMlIyYmsxL3I0cHBwLzNwcDMvMUIybjFQMS8zUVAyUC81UDIvMVBLNS83cSB3IC0gLSAwIDFcIixcblwiM25icjIvNHEycC9yM3BScGsvcDJwUVJOMS8xcHBQMnAxLzJQNS9QUEI0UC82SzEgdyAtIC0gMCAxXCIsXG5cIjdrL3A1YjEvMXA0QnAvMnExcDFwMS8xUDFuMXIyL1AyUTJOMS82UDEvM1IySzEgYiAtIC0gMCAxXCIsXG5cIjVrMi9wcHFyUkIyLzNyMXAyLzJwMnAyLzdQL1AxUFAyUDEvMVAyUVAyLzZLMSB3IC0gLSAwIDFcIixcblwiNHIzLzVrcDEvMU4xcDQvMnBSMXExcC84L3BQM1BQMS82SzEvM1FyMyBiIC0gLSAwIDFcIixcblwiMWsycjMvcHA2LzNiNC8zUDJRMS84LzZQMS9QUDNxMVAvMlI0SyBiIC0gLSAwIDFcIixcblwiMmtyM3IvUjRRMi8xcHExbjMvN3AvM1IxQjFQLzJwM1AxLzJQMlAyLzZLMSB3IC0gLSAwIDFcIixcblwiMnJxMmsxLzNiYjJwL24ycDJwUS9wMlBwMy8yUDFOMVAxLzFQNVAvNkIxLzJCMlIxSyB3IC0gLSAwIDFcIixcblwicjJxM2svcHBiM3BwLzJwMUIzLzJQMVJRMi84LzZQMS9QUDFyM1AvNVJLMSB3IC0gLSAwIDFcIixcblwiM2s0LzFwM0JwMS9wNXIxLzJiNS9QM1AxTjEvNVBwMS8xUDFyNC8yUjRLIGIgLSAtIDAgMVwiLFxuXCJrNy80cnAxcC9wMXEzcDEvUTFyMnAyLzFSNi84L1A1UFAvMVI1SyB3IC0gLSAwIDFcIixcblwiNXJrMS8xUjRiMS8zcDQvMVAxUDQvNFBwMi8zQjFQbmIvUHFSSzFRMi84IGIgLSAtIDAgMVwiLFxuXCI3ay8xcDRwMS9wNGIxcC8zTjNQLzJwNS8ycmI0L1BQMnIzL0syUjJSMSBiIC0gLSAwIDFcIixcblwicjFxYjFyazEvM1IxcHAxL3AxblIycDEvMXAycDJOLzZRMS8yUDFCMy9QUDNQUFAvNksxIHcgLSAtIDAgMVwiLFxuXCIzcjFyazEvMnFQMXAyL3AyUjJwcC82YjEvNlAxLzJwUVIyUC9QMUIyUDIvNksxIHcgLSAtIDAgMVwiLFxuXCIxUjJSMy9wMXIycGsxLzNiMXBwMS84LzJQcjQvNE4xUDEvUDRQSzEvOCB3IC0gLSAwIDFcIixcblwicjJrMm5yL3BwMWIxUTFwLzJuNGIvM040LzNxNC8zUDQvUFBQM1BQLzRSUjFLIHcgLSAtIDAgMVwiLFxuXCJyNHJrMS8zUjNwLzFxMnBRcDEvcDcvUDcvOC8xUDVQLzRSSzIgdyAtIC0gMCAxXCIsXG5cInI2ay8xcDVwLzJwMWIxcEIvN0IvcDFQMXEyci84L1A1UVAvM1IyUksgYiAtIC0gMCAxXCIsXG5cIjRyMWsxLzFSNGJwL3BCMnAxcDEvUDRwMi8ycjFwUDFRLzJQNFAvMXE0UDEvM1IzSyB3IC0gLSAwIDFcIixcblwiNmsxLzZwMS8zcjFuMXAvcDRwMW4vUDFONFAvMk41L1EyUkszLzdxIGIgLSAtIDAgMVwiLFxuXCI4LzFSNHBwL2syclFwMi8ycDJQMi9wMnExUDIvMW4xcjJQMS82QlAvNFIySyB3IC0gLSAwIDFcIixcblwiNFIzL3AycjFxMWsvNUIxUC82UDEvMnA0Sy8zYjQvNFEzLzggdyAtIC0gMCAxXCIsXG5cIjRuMy9wM04xcmsvNVEyLzJxNHAvMnA1LzFQM1AxUC9QMVAyUDIvNlJLIHcgLSAtIDAgMVwiLFxuXCJycjRSYi8ycG5xYjFrL25wMXAxcDFCLzNQcFAyL3AxUDFQMlAvMk4zUjEvUFAyQlAyLzFLUTUgdyAtIC0gMCAxXCIsXG5cInIxYnEycmsvcHAxbjFwMXAvNVAxUS8xQjNwMi8zQjNiL1A1UjEvMlAzUFAvM0szUiB3IC0gLSAwIDFcIixcblwicTVrMS8xYjJSMXBwLzFwM24yLzRCUTIvOC83UC81UFBLLzRyMyB3IC0gLSAwIDFcIixcblwiM3I0LzFuYjFrcDIvcDFwMk4yLzFwMnBQcjEvOC8xQlAyUDIvUFAxUjQvMktSNCB3IC0gLSAwIDFcIixcblwiN1IvM1EycDEvMnAybmsxL3BwNFAxLzNQMnIxLzJQNS80cTMvNVIxSyB3IC0gLSAwIDFcIixcblwiM3EycjEvcDJiMWsyLzFwbkJwMU4xLzNwMXBRUC82UDEvNVIyLzJyMlAyLzRSSzIgdyAtIC0gMCAxXCIsXG5cIms3LzFwMXJyMXBwL3BSMXAxcDIvUTFwcTQvUDcvOC8yUDNQUC8xUjRLMSB3IC0gLSAwIDFcIixcblwiNGtiMXIvMVI2L3AycnAzLzJRMXAxcTEvNHAzLzNCNC9QNlAvNEtSMiB3IC0gLSAwIDFcIixcblwiMXIzcjFrL3FwNXAvM040LzNwMlExL3A2UC9QNy8xYjYvMUtSM1IxIHcgLSAtIDAgMVwiLFxuXCJyNGtyMS9wYk5uMXExcC8xcDYvMnAyQlBRLzVCMi84L1A2UC9iNFJLMSB3IC0gLSAwIDFcIixcblwiM3Izay83cC9wcDJCMXAxLzNOMlAxL1AycVBRMi84LzFQcjRQLzVSMUsgdyAtIC0gMCAxXCIsXG5cIjNxMXIyL3BiM3BwMS8xcDYvM3BQMU5rLzJyMlEyLzgvUG4zUFAxLzNSUjFLMSB3IC0gLSAwIDFcIixcblwiMWsxcjQvcHA1Ui8ycDUvUDVwMS83Yi80UHEyLzFQUTJQMi8zTkszIGIgLSAtIDAgMVwiLFxuXCI2UjEvMmsyUDIvMW41ci8zcDFwMi8zUDNiLzFRUDJwMXEvM1I0LzZLMSBiIC0gLSAwIDFcIixcblwiMWsxcjQvMXA1cC8xUDNwcDEvYjcvUDNLMy8xQjNyUDEvMk4xYlAxUC9SUjYgYiAtIC0gMCAxXCIsXG5cIjNyMmsxLzNxMnAxLzFiM3AxcC80cDMvcDFSMVAyTi9QcjVQLzFQUTNQMS81UjFLIGIgLSAtIDAgMVwiLFxuXCIyYjNrMS9yM3EycC80cDFwQi9wNHIyLzROMy9QMVE1LzFQNFBQLzJSMlIxSyB3IC0gLSAwIDFcIixcblwicjVyMS9wMXEycDFrLzFwMVIycEIvM3BQMy82YlEvMnA1L1AxUDFOUFBQLzZLMSB3IC0gLSAwIDFcIixcblwiMXIxcXJiazEvM2IzcC9wMnAxcHAxLzNOblAyLzNONC8xUTRCUC9QUDRQMS8xUjJSMksgdyAtIC0gMCAxXCIsXG5cIjRiMWsxLzJyMnAyLzFxMXBuUHBRLzdwL3AzUDJQL3BONUIvUDFQNS8xSzFSMlIxIHcgLSAtIDAgMVwiLFxuXCI0cjJrL3BwMnEyYi8ycDJwMVEvNHJQMi9QNy8xQjVQLzFQMlIxUjEvN0sgdyAtIC0gMCAxXCIsXG5cIjJrNS8xYjFyMVJicC9wM3AzL0JwNFAxLzNwMVExUC9QNy8xUFAxcTMvMUs2IHcgLSAtIDAgMVwiLFxuXCI2cmsvMXBxYmJwMXAvcDNwMlEvNlIxLzROMW5QLzNCNC9QUFA1LzJLUjQgdyAtIC0gMCAxXCIsXG5cInI0cmsxLzVSYnAvcDFxTjJwMS9QMW4xUDMvOC8xUTNOMVAvNVBQMS81UksxIHcgLSAtIDAgMVwiLFxuXCJyM3IxazEvN3AvMnBSUjFwMS9wNy8yUDUvcW5RMVAxUDEvNkJQLzZLMSB3IC0gLSAwIDFcIixcblwicjRiMXIvcHBwcTJwcC8ybjFiMWsxLzNuNC8yQnA0LzVRMi9QUFAyUFBQL1JOQjFSMUsxIHcgLSAtIDAgMVwiLFxuXCI2UjEvNXIxay9wNmIvMXBCMXAycS8xUDYvNXJRUC81UDFLLzZSMSB3IC0gLSAwIDFcIixcblwicm4zcmsxLzJxcDJwcC9wM1AzLzFwMWI0LzNiNC8zQjQvUFBQMVExUFAvUjFCMlIxSyB3IC0gLSAwIDFcIixcblwiMlIzbmsvM3IyYjEvcDJwcjFRMS80cE4yLzFQNi9QNlAvcTcvQjRSSzEgdyAtIC0gMCAxXCIsXG5cInI1azEvcDFwM2JwLzFwMXA0LzJQUDJxcC8xUDYvMVExYlAzL1BCM3JQUC9SMk4yUksgYiAtIC0gMCAxXCIsXG5cIjRrMy9yMmJubjFyLzFxMnBSMXAvcDJwUHAxQi8ycFAxTjFQL1BwUDFCMy8xUDRRMS81S1IxIHcgLSAtIDAgMVwiLFxuXCJyMWIyazIvMXA0cHAvcDROMXIvNFBwMi9QM3BQMXEvNFAyUC8xUDJRMksvM1IyUjEgdyAtIC0gMCAxXCIsXG5cIjNyNC9wUjJOMy8ycGtiMy81cDIvOC8yQjUvcVAzUFBQLzRSMUsxIHcgLSAtIDAgMVwiLFxuXCJyMWI0ci8xazJicHBwL3AxcDFwMy84L05wMm5CMi8zUjQvUFBQMUJQUFAvMktSNCB3IC0gLSAwIDFcIixcblwiMnEycjFrLzVRcDEvNHAxUDEvM3A0L3I2Yi83Ui81QlBQLzVSSzEgdyAtIC0gMCAxXCIsXG5cIlE3LzJyMnJway8ycDRwLzdOLzNQcE4yLzFwMlAzLzFLNFIxLzVxMiB3IC0gLSAwIDFcIixcblwiNXIxay8xcTRicC8zcEIxcDEvMnBQbjFCMS8xcjYvMXA1Ui8xUDJQUFFQL1I1SzEgdyAtIC0gMCAxXCIsXG5cInIxYjJrMXIvMnExYjMvcDNwcEJwLzJuM0IxLzFwNi8yTjRRL1BQUDNQUC8yS1JSMyB3IC0gLSAwIDFcIixcblwiNXIxay83cC84LzROUDIvOC8zcDJSMS8ycjNQUC8ybjFSSzIgdyAtIC0gMCAxXCIsXG5cIjZyMS9yNVBSLzJwM1IxLzJQazFuMi8zcDQvMVAxTlAzLzRLMy84IHcgLSAtIDAgMVwiLFxuXCJyMnE0L3AyblIxYmsvMXAxUGIycC80cDJwLzNuTjMvQjJCM1AvUFAxUTJQMS82SzEgdyAtIC0gMCAxXCIsXG5cIjVyazEvcFI0YnAvNnAxLzZCMS81UTIvNFAzL3EycjFQUFAvNVJLMSB3IC0gLSAwIDFcIixcblwiNG5yazEvclI1cC80cG5wUS80cDFOMS8ycDFOMy82UDEvcTRQMVAvNFIxSzEgdyAtIC0gMCAxXCIsXG5cIjFSMW4zay82cHAvMk5yNC9QNHAyL3I3LzgvNFBQQlAvNksxIGIgLSAtIDAgMVwiLFxuXCI2cjEvM3AycWsvNFAzLzFSNXAvM2IxcHJQLzNQMkIxLzJQMVFQMi82UksgYiAtIC0gMCAxXCIsXG5cInI1cTEvcHAxYjFrcjEvMnAycDIvMlE1LzJQcEIzLzFQNE5QL1A0UDIvNFJLMiB3IC0gLSAwIDFcIixcblwicjJyMmsxL3BwMmJwcHAvMnAxcDMvNHFiMVAvOC8xQlAxQlEyL1BQM1BQMS8yS1IzUiBiIC0gLSAwIDFcIixcblwiMXIxcmIzL3AxcTJwa3AvUG5wMm5wMS80cDMvNFAzL1ExTjFCMVBQLzJQUkJQMi8zUjJLMSB3IC0gLSAwIDFcIixcblwicjJrMXIyLzNiMnBwL3A1cDEvMlExUjMvMXBCMVBxMi8xUDYvUEtQNFAvN1IgdyAtIC0gMCAxXCIsXG5cInI1azEvcTRwcHAvcm5SMXBiMi8xUTFwNC8xUDFQNC9QNE4xUC8xQjNQUDEvMlIzSzEgdyAtIC0gMCAxXCIsXG5cIjVyMWsvN3AvcDJiNC8xcE5wMXAxcS8zUHIzLzJQMmJQMS9QUDFCM1EvUjNSMUsxIGIgLSAtIDAgMVwiLFxuXCI1YjIvMXAzcnBrL3AxYjNScC80QjFSUS8zUDFwMVAvN3EvNVAyLzZLMSB3IC0gLSAwIDFcIixcblwiM1JyMmsvcHA0cGIvMnA0cC8yUDFuMy8xUDFRM1AvNHIxcTEvUEI0QjEvNVJLMSBiIC0gLSAwIDFcIixcblwiUjcvNXBrcC8zTjJwMS8ycjNQbi81cjIvMVA2L1AxUDUvMktSNCB3IC0gLSAwIDFcIixcblwiMXIzazIvNXAxcC8xcWJScDMvMnIxUHAyL3BwQjRRLzFQNi9QMVA0UC8xSzFSNCB3IC0gLSAwIDFcIixcblwiOC8yUTFSMWJrLzNyM3AvcDJOMXAxUC9QMlA0LzFwM1BxMS8xUDRQMS8xSzYgdyAtIC0gMCAxXCIsXG5cIjVyMWsvcjJiMXAxcC9wNFBwMS8xcDJSMy8zcUJRMi9QNy82UFAvMlI0SyB3IC0gLSAwIDFcIixcblwiM3Izay8xcDNScHAvcDJubjMvM040LzgvMVBCMVBRMVAvcTRQUDEvNksxIHcgLSAtIDAgMVwiLFxuXCIzcjFrcjEvOC9wMnEycDEvMXAyUjMvMVE2LzgvUFBQNS8xSzRSMSB3IC0gLSAwIDFcIixcblwiNHIyay8ycGIxUjIvMnA0UC8zcHIxTjEvMXA2LzdQL1AxUDUvMks0UiB3IC0gLSAwIDFcIixcblwiM3Izay8xYjJiMXBwLzNwcDMvcDNuMVAxLzFwUHFQMlAvMVAyTjJSL1AxUUIxcjIvMktSM0IgYiAtIC0gMCAxXCIsXG5dO1xuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHB1enpsZSwgZm9ya1R5cGUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5sb2FkKHB1enpsZS5mZW4pO1xuICAgIGFkZEZvcmtzKHB1enpsZS5mZW4sIHB1enpsZS5mZWF0dXJlcywgZm9ya1R5cGUpO1xuICAgIGFkZEZvcmtzKGMuZmVuRm9yT3RoZXJTaWRlKHB1enpsZS5mZW4pLCBwdXp6bGUuZmVhdHVyZXMsIGZvcmtUeXBlKTtcbiAgICByZXR1cm4gcHV6emxlO1xufTtcblxuZnVuY3Rpb24gYWRkRm9ya3MoZmVuLCBmZWF0dXJlcywgZm9ya1R5cGUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5sb2FkKGZlbik7XG4gICAgdmFyIG1vdmVzID0gY2hlc3MubW92ZXMoe1xuICAgICAgICB2ZXJib3NlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBtb3ZlcyA9IG1vdmVzLm1hcChtID0+IGVucmljaE1vdmVXaXRoRm9ya0NhcHR1cmVzKGZlbiwgbSkpO1xuICAgIG1vdmVzID0gbW92ZXMuZmlsdGVyKG0gPT4gbS5jYXB0dXJlcy5sZW5ndGggPj0gMik7XG5cbiAgICBpZiAoIWZvcmtUeXBlIHx8IGZvcmtUeXBlID09ICdxJykge1xuICAgICAgICBhZGRGb3Jrc0J5KG1vdmVzLCAncScsICdRdWVlbicsIGNoZXNzLnR1cm4oKSwgZmVhdHVyZXMpO1xuICAgIH1cbiAgICBpZiAoIWZvcmtUeXBlIHx8IGZvcmtUeXBlID09ICdwJykge1xuICAgICAgICBhZGRGb3Jrc0J5KG1vdmVzLCAncCcsICdQYXduJywgY2hlc3MudHVybigpLCBmZWF0dXJlcyk7XG4gICAgfVxuICAgIGlmICghZm9ya1R5cGUgfHwgZm9ya1R5cGUgPT0gJ3InKSB7XG4gICAgICAgIGFkZEZvcmtzQnkobW92ZXMsICdyJywgJ1Jvb2snLCBjaGVzcy50dXJuKCksIGZlYXR1cmVzKTtcbiAgICB9XG4gICAgaWYgKCFmb3JrVHlwZSB8fCBmb3JrVHlwZSA9PSAnYicpIHtcbiAgICAgICAgYWRkRm9ya3NCeShtb3ZlcywgJ2InLCAnQmlzaG9wJywgY2hlc3MudHVybigpLCBmZWF0dXJlcyk7XG4gICAgfVxuICAgIGlmICghZm9ya1R5cGUgfHwgZm9ya1R5cGUgPT0gJ24nKSB7XG4gICAgICAgIGFkZEZvcmtzQnkobW92ZXMsICduJywgJ0tuaWdodCcsIGNoZXNzLnR1cm4oKSwgZmVhdHVyZXMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZW5yaWNoTW92ZVdpdGhGb3JrQ2FwdHVyZXMoZmVuLCBtb3ZlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIGNoZXNzLm1vdmUobW92ZSk7XG5cbiAgICB2YXIgc2FtZVNpZGVzVHVybkZlbiA9IGMuZmVuRm9yT3RoZXJTaWRlKGNoZXNzLmZlbigpKTtcbiAgICB2YXIgcGllY2VNb3ZlcyA9IGMubW92ZXNPZlBpZWNlT24oc2FtZVNpZGVzVHVybkZlbiwgbW92ZS50byk7XG4gICAgdmFyIGNhcHR1cmVzID0gcGllY2VNb3Zlcy5maWx0ZXIoY2FwdHVyZXNNYWpvclBpZWNlKTtcblxuICAgIG1vdmUuY2FwdHVyZXMgPSBjYXB0dXJlcztcbiAgICByZXR1cm4gbW92ZTtcbn1cblxuZnVuY3Rpb24gY2FwdHVyZXNNYWpvclBpZWNlKG1vdmUpIHtcbiAgICByZXR1cm4gbW92ZS5jYXB0dXJlZCAmJiBtb3ZlLmNhcHR1cmVkICE9PSAncCc7XG59XG5cbmZ1bmN0aW9uIGRpYWdyYW0obW92ZSkge1xuICAgIHZhciBtYWluID0gW3tcbiAgICAgICAgb3JpZzogbW92ZS5mcm9tLFxuICAgICAgICBkZXN0OiBtb3ZlLnRvLFxuICAgICAgICBicnVzaDogJ3BhbGVCbHVlJ1xuICAgIH1dO1xuICAgIHZhciBmb3JrcyA9IG1vdmUuY2FwdHVyZXMubWFwKG0gPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3JpZzogbW92ZS50byxcbiAgICAgICAgICAgIGRlc3Q6IG0udG8sXG4gICAgICAgICAgICBicnVzaDogbS5jYXB0dXJlZCA9PT0gJ2snID8gJ3JlZCcgOiAnYmx1ZSdcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFpbi5jb25jYXQoZm9ya3MpO1xufVxuXG5mdW5jdGlvbiBhZGRGb3Jrc0J5KG1vdmVzLCBwaWVjZSwgcGllY2VFbmdsaXNoLCBzaWRlLCBmZWF0dXJlcykge1xuICAgIHZhciBieXBpZWNlID0gbW92ZXMuZmlsdGVyKG0gPT4gbS5waWVjZSA9PT0gcGllY2UpO1xuICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICBkZXNjcmlwdGlvbjogcGllY2VFbmdsaXNoICsgXCIgZm9ya3NcIixcbiAgICAgICAgc2lkZTogc2lkZSxcbiAgICAgICAgdGFyZ2V0czogYnlwaWVjZS5tYXAobSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhcmdldDogbS50byxcbiAgICAgICAgICAgICAgICBkaWFncmFtOiBkaWFncmFtKG0pLFxuICAgICAgICAgICAgICAgIG1hcmtlcjogJ+KZhidcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG4iLCJ2YXIgQ2hlc3MgPSByZXF1aXJlKCdjaGVzcy5qcycpLkNoZXNzO1xudmFyIGMgPSByZXF1aXJlKCcuL2NoZXNzdXRpbHMnKTtcbnZhciBmb3JrcyA9IHJlcXVpcmUoJy4vZm9ya3MnKTtcbnZhciBrbmlnaHRmb3JrZmVucyA9IHJlcXVpcmUoJy4vZmVucy9rbmlnaHRmb3JrcycpO1xudmFyIHF1ZWVuZm9ya2ZlbnMgPSByZXF1aXJlKCcuL2ZlbnMvcXVlZW5mb3JrcycpO1xudmFyIHBhd25mb3JrZmVucyA9IHJlcXVpcmUoJy4vZmVucy9wYXduZm9ya3MnKTtcbnZhciByb29rZm9ya2ZlbnMgPSByZXF1aXJlKCcuL2ZlbnMvcm9va2ZvcmtzJyk7XG52YXIgYmlzaG9wZm9ya2ZlbnMgPSByZXF1aXJlKCcuL2ZlbnMvYmlzaG9wZm9ya3MnKTtcbnZhciBoaWRkZW4gPSByZXF1aXJlKCcuL2hpZGRlbicpO1xudmFyIGxvb3NlID0gcmVxdWlyZSgnLi9sb29zZScpO1xudmFyIHBpbnMgPSByZXF1aXJlKCcuL3BpbnMnKTtcbnZhciBtYXRldGhyZWF0ID0gcmVxdWlyZSgnLi9tYXRldGhyZWF0Jyk7XG52YXIgY2hlY2tzID0gcmVxdWlyZSgnLi9jaGVja3MnKTtcblxuLyoqXG4gKiBGZWF0dXJlIG1hcCBcbiAqL1xudmFyIGZlYXR1cmVNYXAgPSBbe1xuICAgIGRlc2NyaXB0aW9uOiBcIktuaWdodCBmb3Jrc1wiLFxuICAgIGRhdGE6IGtuaWdodGZvcmtmZW5zLFxuICAgIGV4dHJhY3Q6IGZ1bmN0aW9uKHB1enpsZSkge1xuICAgICAgcmV0dXJuIGZvcmtzKHB1enpsZSwgJ24nKTtcbiAgICB9XG4gIH0sIHtcbiAgICBkZXNjcmlwdGlvbjogXCJRdWVlbiBmb3Jrc1wiLFxuICAgIGRhdGE6IHF1ZWVuZm9ya2ZlbnMsXG4gICAgZXh0cmFjdDogZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgICByZXR1cm4gZm9ya3MocHV6emxlLCAncScpO1xuICAgIH1cbiAgfSwge1xuICAgIGRlc2NyaXB0aW9uOiBcIlBhd24gZm9ya3NcIixcbiAgICBkYXRhOiBwYXduZm9ya2ZlbnMsXG4gICAgZXh0cmFjdDogZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgICByZXR1cm4gZm9ya3MocHV6emxlLCAncCcpO1xuICAgIH1cbiAgfSwge1xuICAgIGRlc2NyaXB0aW9uOiBcIlJvb2sgZm9ya3NcIixcbiAgICBkYXRhOiByb29rZm9ya2ZlbnMsXG4gICAgZXh0cmFjdDogZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgICByZXR1cm4gZm9ya3MocHV6emxlLCAncicpO1xuICAgIH1cbiAgfSwge1xuICAgIGRlc2NyaXB0aW9uOiBcIkJpc2hvcCBmb3Jrc1wiLFxuICAgIGRhdGE6IGJpc2hvcGZvcmtmZW5zLFxuICAgIGV4dHJhY3Q6IGZ1bmN0aW9uKHB1enpsZSkge1xuICAgICAgcmV0dXJuIGZvcmtzKHB1enpsZSwgJ2InKTtcbiAgICB9XG4gIH0sXG5cblxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBhbGwgZmVhdHVyZXMgaW4gdGhlIHBvc2l0aW9uLlxuICAgKi9cbiAgZXh0cmFjdEZlYXR1cmVzOiBmdW5jdGlvbihmZW4pIHtcbiAgICB2YXIgcHV6emxlID0ge1xuICAgICAgZmVuOiBjLnJlcGFpckZlbihmZW4pLFxuICAgICAgZmVhdHVyZXM6IFtdXG4gICAgfTtcblxuICAgIHB1enpsZSA9IGZvcmtzKHB1enpsZSk7XG4gICAgcHV6emxlID0gaGlkZGVuKHB1enpsZSk7XG4gICAgcHV6emxlID0gbG9vc2UocHV6emxlKTtcbiAgICBwdXp6bGUgPSBwaW5zKHB1enpsZSk7XG4gICAgcHV6emxlID0gbWF0ZXRocmVhdChwdXp6bGUpO1xuICAgIHB1enpsZSA9IGNoZWNrcyhwdXp6bGUpO1xuXG4gICAgcmV0dXJuIHB1enpsZS5mZWF0dXJlcztcbiAgfSxcblxuXG4gIGZlYXR1cmVNYXA6IGZlYXR1cmVNYXAsXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBzaW5nbGUgZmVhdHVyZXMgaW4gdGhlIHBvc2l0aW9uLlxuICAgKi9cbiAgZXh0cmFjdFNpbmdsZUZlYXR1cmU6IGZ1bmN0aW9uKGZlYXR1cmVEZXNjcmlwdGlvbiwgZmVuKSB7XG4gICAgdmFyIHB1enpsZSA9IHtcbiAgICAgIGZlbjogYy5yZXBhaXJGZW4oZmVuKSxcbiAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG5cbiAgICBmZWF0dXJlTWFwLmZvckVhY2goZiA9PiB7XG4gICAgICAgaWYgKGZlYXR1cmVEZXNjcmlwdGlvbiA9PT0gZi5kZXNjcmlwdGlvbikge1xuICAgICAgICBwdXp6bGUgPSBmLmV4dHJhY3QocHV6emxlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwdXp6bGUuZmVhdHVyZXM7XG4gIH0sXG5cbiAgZmVhdHVyZUZvdW5kOiBmdW5jdGlvbihmZWF0dXJlcywgdGFyZ2V0KSB7XG4gICAgdmFyIGZvdW5kID0gMDtcbiAgICBmZWF0dXJlc1xuICAgICAgLmZvckVhY2goZiA9PiB7XG4gICAgICAgIGYudGFyZ2V0cy5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgIGlmICh0LnRhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICBmb3VuZCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gZm91bmQ7XG4gIH0sXG5cbiAgYWxsRmVhdHVyZXNGb3VuZDogZnVuY3Rpb24oZmVhdHVyZXMpIHtcbiAgICB2YXIgZm91bmQgPSB0cnVlO1xuICAgIGZlYXR1cmVzXG4gICAgICAuZm9yRWFjaChmID0+IHtcbiAgICAgICAgZi50YXJnZXRzLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgaWYgKCF0LnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gZm91bmQ7XG4gIH0sXG4gIFxuICByYW5kb21GZW5Gb3JGZWF0dXJlOiBmdW5jdGlvbihmZWF0dXJlRGVzY3JpcHRpb24pIHtcbiAgICB2YXIgZmVucyA9IGZlYXR1cmVNYXAuZmluZChmID0+IGYuZGVzY3JpcHRpb24gPT09IGZlYXR1cmVEZXNjcmlwdGlvbikuZGF0YTtcbiAgICByZXR1cm4gZmVuc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmZW5zLmxlbmd0aCldO1xuICB9XG5cblxufTtcbiIsInZhciBDaGVzcyA9IHJlcXVpcmUoJ2NoZXNzLmpzJykuQ2hlc3M7XG52YXIgYyA9IHJlcXVpcmUoJy4vY2hlc3N1dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHB1enpsZSkge1xuICAgIGFkZEFsaWduZWQocHV6emxlLmZlbiwgcHV6emxlLmZlYXR1cmVzKTtcbiAgICBhZGRBbGlnbmVkKGMuZmVuRm9yT3RoZXJTaWRlKHB1enpsZS5mZW4pLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIHJldHVybiBwdXp6bGU7XG59O1xuXG5mdW5jdGlvbiBhZGRBbGlnbmVkKGZlbiwgZmVhdHVyZXMpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoZmVuKTtcblxuICAgIHZhciBtb3ZlcyA9IGNoZXNzLm1vdmVzKHtcbiAgICAgICAgdmVyYm9zZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdmFyIHBpZWNlcyA9IGMubWFqb3JQaWVjZXNGb3JDb2xvdXIoZmVuLCBjaGVzcy50dXJuKCkpO1xuICAgIHZhciBvcHBvbmVudHNQaWVjZXMgPSBjLm1ham9yUGllY2VzRm9yQ29sb3VyKGZlbiwgY2hlc3MudHVybigpID09ICd3JyA/ICdiJyA6ICd3Jyk7XG5cbiAgICB2YXIgYWxpZ25lZCA9IFtdO1xuICAgIHBpZWNlcy5mb3JFYWNoKGZyb20gPT4ge1xuICAgICAgICB2YXIgdHlwZSA9IGNoZXNzLmdldChmcm9tKS50eXBlO1xuICAgICAgICBpZiAoKHR5cGUgIT09ICdrJykgJiYgKHR5cGUgIT09ICduJykpIHtcbiAgICAgICAgICAgIG9wcG9uZW50c1BpZWNlcy5mb3JFYWNoKHRvID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYy5jYW5DYXB0dXJlKGZyb20sIGNoZXNzLmdldChmcm9tKSwgdG8sIGNoZXNzLmdldCh0bykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdmFpbGFibGVPbkJvYXJkID0gbW92ZXMuZmlsdGVyKG0gPT4gbS5mcm9tID09PSBmcm9tICYmIG0udG8gPT09IHRvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZU9uQm9hcmQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV2ZWFsaW5nTW92ZXMgPSBjLm1vdmVzVGhhdFJlc3VsdEluQ2FwdHVyZVRocmVhdChmZW4sIGZyb20sIHRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXZlYWxpbmdNb3Zlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25lZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBmcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFncmFtOiBkaWFncmFtKGZyb20sIHRvLCByZXZlYWxpbmdNb3ZlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSGlkZGVuIGF0dGFja2VyXCIsXG4gICAgICAgIHNpZGU6IGNoZXNzLnR1cm4oKSxcbiAgICAgICAgdGFyZ2V0czogYWxpZ25lZFxuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIGRpYWdyYW0oZnJvbSwgdG8sIHJldmVhbGluZ01vdmVzKSB7XG4gICAgdmFyIG1haW4gPSBbe1xuICAgICAgICBvcmlnOiBmcm9tLFxuICAgICAgICBkZXN0OiB0byxcbiAgICAgICAgYnJ1c2g6ICdyZWQnXG4gICAgfV07XG4gICAgdmFyIHJldmVhbHMgPSByZXZlYWxpbmdNb3Zlcy5tYXAobSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcmlnOiBtLmZyb20sXG4gICAgICAgICAgICBkZXN0OiBtLnRvLFxuICAgICAgICAgICAgYnJ1c2g6ICdwYWxlQmx1ZSdcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFpbi5jb25jYXQocmV2ZWFscyk7XG59XG4iLCJ2YXIgQ2hlc3MgPSByZXF1aXJlKCdjaGVzcy5qcycpLkNoZXNzO1xudmFyIGMgPSByZXF1aXJlKCcuL2NoZXNzdXRpbHMnKTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHV6emxlKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgYWRkTG9vc2VQaWVjZXMocHV6emxlLmZlbiwgcHV6emxlLmZlYXR1cmVzKTtcbiAgICBhZGRMb29zZVBpZWNlcyhjLmZlbkZvck90aGVyU2lkZShwdXp6bGUuZmVuKSwgcHV6emxlLmZlYXR1cmVzKTtcbiAgICByZXR1cm4gcHV6emxlO1xufTtcblxuZnVuY3Rpb24gYWRkTG9vc2VQaWVjZXMoZmVuLCBmZWF0dXJlcykge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQoZmVuKTtcbiAgICB2YXIga2luZyA9IGMua2luZ3NTcXVhcmUoZmVuLCBjaGVzcy50dXJuKCkpO1xuICAgIHZhciBvcHBvbmVudCA9IGNoZXNzLnR1cm4oKSA9PT0gJ3cnID8gJ2InIDogJ3cnO1xuICAgIHZhciBwaWVjZXMgPSBjLnBpZWNlc0ZvckNvbG91cihmZW4sIG9wcG9uZW50KTtcbiAgICBwaWVjZXMgPSBwaWVjZXMuZmlsdGVyKHNxdWFyZSA9PiAhYy5pc0NoZWNrQWZ0ZXJQbGFjaW5nS2luZ0F0U3F1YXJlKGZlbiwga2luZywgc3F1YXJlKSk7XG4gICAgZmVhdHVyZXMucHVzaCh7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkxvb3NlIHBpZWNlc1wiLFxuICAgICAgICBzaWRlOiBvcHBvbmVudCxcbiAgICAgICAgdGFyZ2V0czogcGllY2VzLm1hcCh0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0LFxuICAgICAgICAgICAgICAgIGRpYWdyYW06IFt7XG4gICAgICAgICAgICAgICAgICAgIG9yaWc6IHQsXG4gICAgICAgICAgICAgICAgICAgIGJydXNoOiAneWVsbG93J1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgIH0pO1xufVxuIiwidmFyIENoZXNzID0gcmVxdWlyZSgnY2hlc3MuanMnKS5DaGVzcztcbnZhciBjID0gcmVxdWlyZSgnLi9jaGVzc3V0aWxzJyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHB1enpsZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQocHV6emxlLmZlbik7XG4gICAgYWRkTWF0ZUluT25lVGhyZWF0cyhwdXp6bGUuZmVuLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIGFkZE1hdGVJbk9uZVRocmVhdHMoYy5mZW5Gb3JPdGhlclNpZGUocHV6emxlLmZlbiksIHB1enpsZS5mZWF0dXJlcyk7XG4gICAgcmV0dXJuIHB1enpsZTtcbn07XG5cbmZ1bmN0aW9uIGFkZE1hdGVJbk9uZVRocmVhdHMoZmVuLCBmZWF0dXJlcykge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcygpO1xuICAgIGNoZXNzLmxvYWQoZmVuKTtcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWVcbiAgICB9KTtcblxuICAgIG1vdmVzID0gbW92ZXMuZmlsdGVyKG0gPT4gY2FuTWF0ZU9uTmV4dFR1cm4oZmVuLCBtKSk7XG5cbiAgICBmZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiTWF0ZS1pbi0xIHRocmVhdHNcIixcbiAgICAgICAgc2lkZTogY2hlc3MudHVybigpLFxuICAgICAgICB0YXJnZXRzOiBtb3Zlcy5tYXAobSA9PiB0YXJnZXRBbmREaWFncmFtKG0pKVxuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIGNhbk1hdGVPbk5leHRUdXJuKGZlbiwgbW92ZSkge1xuICAgIHZhciBjaGVzcyA9IG5ldyBDaGVzcyhmZW4pO1xuICAgIGNoZXNzLm1vdmUobW92ZSk7XG4gICAgaWYgKGNoZXNzLmluX2NoZWNrKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNoZXNzLmxvYWQoYy5mZW5Gb3JPdGhlclNpZGUoY2hlc3MuZmVuKCkpKTtcbiAgICB2YXIgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7XG4gICAgICAgIHZlcmJvc2U6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIHN0dWZmIG1hdGluZyBtb3ZlcyBpbnRvIG1vdmUgb2JqZWN0IGZvciBkaWFncmFtXG4gICAgbW92ZS5tYXRpbmdNb3ZlcyA9IG1vdmVzLmZpbHRlcihtID0+IC8jLy50ZXN0KG0uc2FuKSk7XG4gICAgcmV0dXJuIG1vdmUubWF0aW5nTW92ZXMubGVuZ3RoID4gMDtcbn1cblxuZnVuY3Rpb24gdGFyZ2V0QW5kRGlhZ3JhbShtb3ZlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiBtb3ZlLnRvLFxuICAgICAgICBkaWFncmFtOiBbe1xuICAgICAgICAgICAgb3JpZzogbW92ZS5mcm9tLFxuICAgICAgICAgICAgZGVzdDogbW92ZS50byxcbiAgICAgICAgICAgIGJydXNoOiBcInBhbGVHcmVlblwiXG4gICAgICAgIH1dLmNvbmNhdChtb3ZlLm1hdGluZ01vdmVzLm1hcChtID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgb3JpZzogbS5mcm9tLFxuICAgICAgICAgICAgICAgIGRlc3Q6IG0udG8sXG4gICAgICAgICAgICAgICAgYnJ1c2g6IFwicGFsZUdyZWVuXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKS5jb25jYXQobW92ZS5tYXRpbmdNb3Zlcy5tYXAobSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9yaWc6IG0uZnJvbSxcbiAgICAgICAgICAgICAgICBicnVzaDogXCJwYWxlR3JlZW5cIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkpXG4gICAgfTtcbn1cbiIsInZhciBDaGVzcyA9IHJlcXVpcmUoJ2NoZXNzLmpzJykuQ2hlc3M7XG52YXIgYyA9IHJlcXVpcmUoJy4vY2hlc3N1dGlscycpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwdXp6bGUpIHtcbiAgICB2YXIgY2hlc3MgPSBuZXcgQ2hlc3MoKTtcbiAgICBjaGVzcy5sb2FkKHB1enpsZS5mZW4pO1xuLy8gICAgYWRkUGluc0ZvckN1cnJlbnRQbGF5ZXIocHV6emxlLmZlbiwgcHV6emxlLmZlYXR1cmVzKTtcbi8vICAgIGFkZFBpbnNGb3JDdXJyZW50UGxheWVyKGMuZmVuRm9yT3RoZXJTaWRlKHB1enpsZS5mZW4pLCBwdXp6bGUuZmVhdHVyZXMpO1xuICAgIHJldHVybiBwdXp6bGU7XG59O1xuXG5mdW5jdGlvbiBhZGRQaW5zRm9yQ3VycmVudFBsYXllcihmZW4sIGZlYXR1cmVzKSB7XG4gICAgdmFyIGNoZXNzID0gbmV3IENoZXNzKCk7XG4gICAgY2hlc3MubG9hZChmZW4pO1xuICAgIHZhciBwaWVjZXMgPSBjLnBpZWNlc0ZvckNvbG91cihmZW4sIGNoZXNzLnR1cm4oKSk7XG4gICAgdmFyIHBpbm5lZCA9IHBpZWNlcy5maWx0ZXIoc3F1YXJlID0+IGMuaXNDaGVja0FmdGVyUmVtb3ZpbmdQaWVjZUF0U3F1YXJlKGZlbiwgc3F1YXJlKSk7XG4gICAgZmVhdHVyZXMucHVzaCh7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBpbm5lZCBwaWVjZXNcIixcbiAgICAgICAgc2lkZTogY2hlc3MudHVybigpLFxuICAgICAgICB0YXJnZXRzOiBwaW5uZWRcbiAgICB9KTtcblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0KSB7XG5cbiAgICB2YXIgb2NjdXJlZCA9IFtdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGxpc3QuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeSh4KTtcbiAgICAgICAgaWYgKCFvY2N1cmVkLmluY2x1ZGVzKGpzb24pKSB7XG4gICAgICAgICAgICBvY2N1cmVkLnB1c2goanNvbik7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIG0gPSAoZnVuY3Rpb24gYXBwKHdpbmRvdywgdW5kZWZpbmVkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcbiAgXHR2YXIgVkVSU0lPTiA9IFwidjAuMi4xXCI7XHJcblx0ZnVuY3Rpb24gaXNGdW5jdGlvbihvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSBcImZ1bmN0aW9uXCI7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIHR5cGUuY2FsbChvYmplY3QpID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcclxuXHR9XHJcblx0dmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xyXG5cdH07XHJcblx0dmFyIHR5cGUgPSB7fS50b1N0cmluZztcclxuXHR2YXIgcGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsuKz9cXF0pL2csIGF0dHJQYXJzZXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vO1xyXG5cdHZhciB2b2lkRWxlbWVudHMgPSAvXihBUkVBfEJBU0V8QlJ8Q09MfENPTU1BTkR8RU1CRUR8SFJ8SU1HfElOUFVUfEtFWUdFTnxMSU5LfE1FVEF8UEFSQU18U09VUkNFfFRSQUNLfFdCUikkLztcclxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdC8vIHNlbGYgaW52b2tpbmcgZnVuY3Rpb24gbmVlZGVkIGJlY2F1c2Ugb2YgdGhlIHdheSBtb2NrcyB3b3JrXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSh3aW5kb3cpIHtcclxuXHRcdCRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHRcdCRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LnNldFRpbWVvdXQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKHdpbmRvdyk7XHJcblxyXG5cdG0udmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFZFUlNJT047XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQHR5cGVkZWYge1N0cmluZ30gVGFnXHJcblx0ICogQSBzdHJpbmcgdGhhdCBsb29rcyBsaWtlIC0+IGRpdi5jbGFzc25hbWUjaWRbcGFyYW09b25lXVtwYXJhbTI9dHdvXVxyXG5cdCAqIFdoaWNoIGRlc2NyaWJlcyBhIERPTSBub2RlXHJcblx0ICovXHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LCBvciBzcGxhdCAob3B0aW9uYWwpXHJcblx0ICpcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKHRhZywgcGFpcnMpIHtcclxuXHRcdGZvciAodmFyIGFyZ3MgPSBbXSwgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XHJcblx0XHR9XHJcblx0XHRpZiAoaXNPYmplY3QodGFnKSkgcmV0dXJuIHBhcmFtZXRlcml6ZSh0YWcsIGFyZ3MpO1xyXG5cdFx0dmFyIGhhc0F0dHJzID0gcGFpcnMgIT0gbnVsbCAmJiBpc09iamVjdChwYWlycykgJiYgIShcInRhZ1wiIGluIHBhaXJzIHx8IFwidmlld1wiIGluIHBhaXJzIHx8IFwic3VidHJlZVwiIGluIHBhaXJzKTtcclxuXHRcdHZhciBhdHRycyA9IGhhc0F0dHJzID8gcGFpcnMgOiB7fTtcclxuXHRcdHZhciBjbGFzc0F0dHJOYW1lID0gXCJjbGFzc1wiIGluIGF0dHJzID8gXCJjbGFzc1wiIDogXCJjbGFzc05hbWVcIjtcclxuXHRcdHZhciBjZWxsID0ge3RhZzogXCJkaXZcIiwgYXR0cnM6IHt9fTtcclxuXHRcdHZhciBtYXRjaCwgY2xhc3NlcyA9IFtdO1xyXG5cdFx0aWYgKCFpc1N0cmluZyh0YWcpKSB0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKTtcclxuXHRcdHdoaWxlICgobWF0Y2ggPSBwYXJzZXIuZXhlYyh0YWcpKSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkgY2VsbC50YWcgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiI1wiKSBjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIi5cIikgY2xhc3Nlcy5wdXNoKG1hdGNoWzJdKTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSBhdHRyUGFyc2VyLmV4ZWMobWF0Y2hbM10pO1xyXG5cdFx0XHRcdGNlbGwuYXR0cnNbcGFpclsxXV0gPSBwYWlyWzNdIHx8IChwYWlyWzJdID8gXCJcIiA6dHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hpbGRyZW4gPSBoYXNBdHRycyA/IGFyZ3Muc2xpY2UoMSkgOiBhcmdzO1xyXG5cdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KGNoaWxkcmVuWzBdKSkge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5bMF07XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ck5hbWUgJiYgYXR0cnNbYXR0ck5hbWVdICE9IG51bGwgJiYgYXR0cnNbYXR0ck5hbWVdICE9PSBcIlwiKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXR0cnNbYXR0ck5hbWVdKTtcclxuXHRcdFx0XHRcdGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gXCJcIjsgLy9jcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgY2VsbC5hdHRyc1thdHRyTmFtZV0gPSBhdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjbGFzc2VzLmxlbmd0aCkgY2VsbC5hdHRyc1tjbGFzc0F0dHJOYW1lXSA9IGNsYXNzZXMuam9pbihcIiBcIik7XHJcblxyXG5cdFx0cmV0dXJuIGNlbGw7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGZvckVhY2gobGlzdCwgZikge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aCAmJiAhZihsaXN0W2ldLCBpKyspOykge31cclxuXHR9XHJcblx0ZnVuY3Rpb24gZm9yS2V5cyhsaXN0LCBmKSB7XHJcblx0XHRmb3JFYWNoKGxpc3QsIGZ1bmN0aW9uIChhdHRycywgaSkge1xyXG5cdFx0XHRyZXR1cm4gKGF0dHJzID0gYXR0cnMgJiYgYXR0cnMuYXR0cnMpICYmIGF0dHJzLmtleSAhPSBudWxsICYmIGYoYXR0cnMsIGkpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIFRoaXMgZnVuY3Rpb24gd2FzIGNhdXNpbmcgZGVvcHRzIGluIENocm9tZS5cclxuXHQvLyBXZWxsIG5vIGxvbmdlclxyXG5cdGZ1bmN0aW9uIGRhdGFUb1N0cmluZyhkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSA9PSBudWxsKSByZXR1cm4gJyc7XHJcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSByZXR1cm4gZGF0YTtcclxuICAgIGlmIChkYXRhLnRvU3RyaW5nKCkgPT0gbnVsbCkgcmV0dXJuIFwiXCI7IC8vIHByZXZlbnQgcmVjdXJzaW9uIGVycm9yIG9uIEZGXHJcbiAgICByZXR1cm4gZGF0YTtcclxuXHR9XHJcblx0Ly8gVGhpcyBmdW5jdGlvbiB3YXMgY2F1c2luZyBkZW9wdHMgaW4gQ2hyb21lLlxyXG5cdGZ1bmN0aW9uIGluamVjdFRleHROb2RlKHBhcmVudEVsZW1lbnQsIGZpcnN0LCBpbmRleCwgZGF0YSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBmaXJzdCwgaW5kZXgpO1xyXG5cdFx0XHRmaXJzdC5ub2RlVmFsdWUgPSBkYXRhO1xyXG5cdFx0fSBjYXRjaCAoZSkge30gLy9JRSBlcnJvbmVvdXNseSB0aHJvd3MgZXJyb3Igd2hlbiBhcHBlbmRpbmcgYW4gZW1wdHkgdGV4dCBub2RlIGFmdGVyIGEgbnVsbFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZmxhdHRlbihsaXN0KSB7XHJcblx0XHQvL3JlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoaXNBcnJheShsaXN0W2ldKSkge1xyXG5cdFx0XHRcdGxpc3QgPSBsaXN0LmNvbmNhdC5hcHBseShbXSwgbGlzdCk7XHJcblx0XHRcdFx0Ly9jaGVjayBjdXJyZW50IGluZGV4IGFnYWluIGFuZCBmbGF0dGVuIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdGktLTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGxpc3Q7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpbnNlcnROb2RlKHBhcmVudEVsZW1lbnQsIG5vZGUsIGluZGV4KSB7XHJcblx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpO1xyXG5cdH1cclxuXHJcblx0dmFyIERFTEVUSU9OID0gMSwgSU5TRVJUSU9OID0gMiwgTU9WRSA9IDM7XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXNEaWZmZXIoZGF0YSwgZXhpc3RpbmcsIGNhY2hlZCwgcGFyZW50RWxlbWVudCkge1xyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoa2V5LCBpKSB7XHJcblx0XHRcdGV4aXN0aW5nW2tleSA9IGtleS5rZXldID0gZXhpc3Rpbmdba2V5XSA/IHtcclxuXHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0aW5kZXg6IGksXHJcblx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHwgJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuXHRcdFx0fSA6IHthY3Rpb246IElOU0VSVElPTiwgaW5kZXg6IGl9O1xyXG5cdFx0fSk7XHJcblx0XHR2YXIgYWN0aW9ucyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBleGlzdGluZykgYWN0aW9ucy5wdXNoKGV4aXN0aW5nW3Byb3BdKTtcclxuXHRcdHZhciBjaGFuZ2VzID0gYWN0aW9ucy5zb3J0KHNvcnRDaGFuZ2VzKSwgbmV3Q2FjaGVkID0gbmV3IEFycmF5KGNhY2hlZC5sZW5ndGgpO1xyXG5cdFx0bmV3Q2FjaGVkLm5vZGVzID0gY2FjaGVkLm5vZGVzLnNsaWNlKCk7XHJcblxyXG5cdFx0Zm9yRWFjaChjaGFuZ2VzLCBmdW5jdGlvbiAoY2hhbmdlKSB7XHJcblx0XHRcdHZhciBpbmRleCA9IGNoYW5nZS5pbmRleDtcclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0Y2xlYXIoY2FjaGVkW2luZGV4XS5ub2RlcywgY2FjaGVkW2luZGV4XSk7XHJcblx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IElOU0VSVElPTikge1xyXG5cdFx0XHRcdHZhciBkdW1teSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbaW5kZXhdLmF0dHJzLmtleTtcclxuXHRcdFx0XHRpbnNlcnROb2RlKHBhcmVudEVsZW1lbnQsIGR1bW15LCBpbmRleCk7XHJcblx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShpbmRleCwgMCwge1xyXG5cdFx0XHRcdFx0YXR0cnM6IHtrZXk6IGRhdGFbaW5kZXhdLmF0dHJzLmtleX0sXHJcblx0XHRcdFx0XHRub2RlczogW2R1bW15XVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tpbmRleF0gPSBkdW1teTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IE1PVkUpIHtcclxuXHRcdFx0XHR2YXIgY2hhbmdlRWxlbWVudCA9IGNoYW5nZS5lbGVtZW50O1xyXG5cdFx0XHRcdHZhciBtYXliZUNoYW5nZWQgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0XHRcdGlmIChtYXliZUNoYW5nZWQgIT09IGNoYW5nZUVsZW1lbnQgJiYgY2hhbmdlRWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlRWxlbWVudCwgbWF5YmVDaGFuZ2VkIHx8IG51bGwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdDYWNoZWRbaW5kZXhdID0gY2FjaGVkW2NoYW5nZS5mcm9tXTtcclxuXHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbaW5kZXhdID0gY2hhbmdlRWxlbWVudDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIG5ld0NhY2hlZDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGRpZmZLZXlzKGRhdGEsIGNhY2hlZCwgZXhpc3RpbmcsIHBhcmVudEVsZW1lbnQpIHtcclxuXHRcdHZhciBrZXlzRGlmZmVyID0gZGF0YS5sZW5ndGggIT09IGNhY2hlZC5sZW5ndGg7XHJcblx0XHRpZiAoIWtleXNEaWZmZXIpIHtcclxuXHRcdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoYXR0cnMsIGkpIHtcclxuXHRcdFx0XHR2YXIgY2FjaGVkQ2VsbCA9IGNhY2hlZFtpXTtcclxuXHRcdFx0XHRyZXR1cm4ga2V5c0RpZmZlciA9IGNhY2hlZENlbGwgJiYgY2FjaGVkQ2VsbC5hdHRycyAmJiBjYWNoZWRDZWxsLmF0dHJzLmtleSAhPT0gYXR0cnMua2V5O1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ga2V5c0RpZmZlciA/IGhhbmRsZUtleXNEaWZmZXIoZGF0YSwgZXhpc3RpbmcsIGNhY2hlZCwgcGFyZW50RWxlbWVudCkgOiBjYWNoZWQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkaWZmQXJyYXkoZGF0YSwgY2FjaGVkLCBub2Rlcykge1xyXG5cdFx0Ly9kaWZmIHRoZSBhcnJheSBpdHNlbGZcclxuXHJcblx0XHQvL3VwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKF8sIGkpIHtcclxuXHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpO1xyXG5cdFx0fSlcclxuXHRcdC8vcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyIHRoYW4gdGhlIG9sZCBvbmUuIGlmIGVycm9ycyBldmVyIGhhcHBlbiBoZXJlLCB0aGUgaXNzdWUgaXMgbW9zdCBsaWtlbHlcclxuXHRcdC8vYSBidWcgaW4gdGhlIGNvbnN0cnVjdGlvbiBvZiB0aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdGZvckVhY2goY2FjaGVkLm5vZGVzLCBmdW5jdGlvbiAobm9kZSwgaSkge1xyXG5cdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIGNsZWFyKFtub2RlXSwgW2NhY2hlZFtpXV0pO1xyXG5cdFx0fSlcclxuXHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRBcnJheUtleXMoZGF0YSkge1xyXG5cdFx0dmFyIGd1aWQgPSAwO1xyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGF0dHJzKSB7XHJcblx0XHRcdFx0aWYgKChhdHRycyA9IGF0dHJzICYmIGF0dHJzLmF0dHJzKSAmJiBhdHRycy5rZXkgPT0gbnVsbCkgYXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWF5YmVSZWNyZWF0ZU9iamVjdChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cykge1xyXG5cdFx0Ly9pZiBhbiBlbGVtZW50IGlzIGRpZmZlcmVudCBlbm91Z2ggZnJvbSB0aGUgb25lIGluIGNhY2hlLCByZWNyZWF0ZSBpdFxyXG5cdFx0aWYgKGRhdGEudGFnICE9PSBjYWNoZWQudGFnIHx8XHJcblx0XHRcdFx0ZGF0YUF0dHJLZXlzLnNvcnQoKS5qb2luKCkgIT09IE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuc29ydCgpLmpvaW4oKSB8fFxyXG5cdFx0XHRcdGRhdGEuYXR0cnMuaWQgIT09IGNhY2hlZC5hdHRycy5pZCB8fFxyXG5cdFx0XHRcdGRhdGEuYXR0cnMua2V5ICE9PSBjYWNoZWQuYXR0cnMua2V5IHx8XHJcblx0XHRcdFx0KG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT09IFwiYWxsXCIgJiYgKCFjYWNoZWQuY29uZmlnQ29udGV4dCB8fCBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gIT09IHRydWUpKSB8fFxyXG5cdFx0XHRcdChtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcImRpZmZcIiAmJiBjYWNoZWQuY29uZmlnQ29udGV4dCAmJiBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gPT09IGZhbHNlKSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCkgY2xlYXIoY2FjaGVkLm5vZGVzKTtcclxuXHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGlzRnVuY3Rpb24oY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQpKSBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpO1xyXG5cdFx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0Zm9yRWFjaChjYWNoZWQuY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0XHRpZiAoY29udHJvbGxlci51bmxvYWQpIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldE9iamVjdE5hbWVzcGFjZShkYXRhLCBuYW1lc3BhY2UpIHtcclxuXHRcdHJldHVybiBkYXRhLmF0dHJzLnhtbG5zID8gZGF0YS5hdHRycy54bWxucyA6XHJcblx0XHRcdGRhdGEudGFnID09PSBcInN2Z1wiID8gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIDpcclxuXHRcdFx0ZGF0YS50YWcgPT09IFwibWF0aFwiID8gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCIgOlxyXG5cdFx0XHRuYW1lc3BhY2U7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWRDYWNoZWRDb250cm9sbGVycyhjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycykge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3cztcclxuXHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnM7XHJcblx0XHRcdGZvckVhY2goY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgJiYgY29udHJvbGxlci5vbnVubG9hZC4kb2xkKSBjb250cm9sbGVyLm9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZC4kb2xkO1xyXG5cdFx0XHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgJiYgY29udHJvbGxlci5vbnVubG9hZCkge1xyXG5cdFx0XHRcdFx0dmFyIG9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZDtcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQgPSBub29wO1xyXG5cdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNjaGVkdWxlQ29uZmlnc1RvQmVDYWxsZWQoY29uZmlncywgZGF0YSwgbm9kZSwgaXNOZXcsIGNhY2hlZCkge1xyXG5cdFx0Ly9zY2hlZHVsZSBjb25maWdzIHRvIGJlIGNhbGxlZC4gVGhleSBhcmUgY2FsbGVkIGFmdGVyIGBidWlsZGBcclxuXHRcdC8vZmluaXNoZXMgcnVubmluZ1xyXG5cdFx0aWYgKGlzRnVuY3Rpb24oZGF0YS5hdHRycy5jb25maWcpKSB7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fTtcclxuXHJcblx0XHRcdC8vYmluZFxyXG5cdFx0XHRjb25maWdzLnB1c2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGEuYXR0cnMuY29uZmlnLmNhbGwoZGF0YSwgbm9kZSwgIWlzTmV3LCBjb250ZXh0LCBjYWNoZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkVXBkYXRlZE5vZGUoY2FjaGVkLCBkYXRhLCBlZGl0YWJsZSwgaGFzS2V5cywgbmFtZXNwYWNlLCB2aWV3cywgY29uZmlncywgY29udHJvbGxlcnMpIHtcclxuXHRcdHZhciBub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0aWYgKGhhc0tleXMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIGNhY2hlZC5hdHRycywgbmFtZXNwYWNlKTtcclxuXHRcdGNhY2hlZC5jaGlsZHJlbiA9IGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCBmYWxzZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHJcblx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdGNhY2hlZC52aWV3cyA9IHZpZXdzO1xyXG5cdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVycztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbm9kZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZU5vbmV4aXN0ZW50Tm9kZXMoZGF0YSwgcGFyZW50RWxlbWVudCwgaW5kZXgpIHtcclxuXHRcdHZhciBub2RlcztcclxuXHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXTtcclxuXHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIGluc2VydE5vZGUocGFyZW50RWxlbWVudCwgbm9kZXNbMF0sIGluZGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2FjaGVkID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGRhdGEgPT09IFwiYm9vbGVhblwiID8gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSkgOiBkYXRhO1xyXG5cdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXM7XHJcblx0XHRyZXR1cm4gY2FjaGVkO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVhdHRhY2hOb2RlcyhkYXRhLCBjYWNoZWQsIHBhcmVudEVsZW1lbnQsIGVkaXRhYmxlLCBpbmRleCwgcGFyZW50VGFnKSB7XHJcblx0XHR2YXIgbm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRpZiAoIWVkaXRhYmxlIHx8IGVkaXRhYmxlICE9PSAkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0ZWxzZSBpZiAocGFyZW50VGFnID09PSBcInRleHRhcmVhXCIpIHtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChlZGl0YWJsZSkge1xyXG5cdFx0XHRcdGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Ly93YXMgYSB0cnVzdGVkIHN0cmluZ1xyXG5cdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpbmplY3RUZXh0Tm9kZShwYXJlbnRFbGVtZW50LCBub2Rlc1swXSwgaW5kZXgsIGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKTtcclxuXHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzO1xyXG5cdFx0cmV0dXJuIGNhY2hlZDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZVRleHQoY2FjaGVkLCBkYXRhLCBpbmRleCwgcGFyZW50RWxlbWVudCwgc2hvdWxkUmVhdHRhY2gsIGVkaXRhYmxlLCBwYXJlbnRUYWcpIHtcclxuXHRcdC8vaGFuZGxlIHRleHQgbm9kZXNcclxuXHRcdHJldHVybiBjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwID8gaGFuZGxlTm9uZXhpc3RlbnROb2RlcyhkYXRhLCBwYXJlbnRFbGVtZW50LCBpbmRleCkgOlxyXG5cdFx0XHRjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSA/XHJcblx0XHRcdFx0cmVhdHRhY2hOb2RlcyhkYXRhLCBjYWNoZWQsIHBhcmVudEVsZW1lbnQsIGVkaXRhYmxlLCBpbmRleCwgcGFyZW50VGFnKSA6XHJcblx0XHRcdChjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZSwgY2FjaGVkKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFN1YkFycmF5Q291bnQoaXRlbSkge1xyXG5cdFx0aWYgKGl0ZW0uJHRydXN0ZWQpIHtcclxuXHRcdFx0Ly9maXggb2Zmc2V0IG9mIG5leHQgZWxlbWVudCBpZiBpdGVtIHdhcyBhIHRydXN0ZWQgc3RyaW5nIHcvIG1vcmUgdGhhbiBvbmUgaHRtbCBlbGVtZW50XHJcblx0XHRcdC8vdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0Ly90aGUgc2Vjb25kIGNsYXVzZSAoYWZ0ZXIgdGhlIHBpcGUpIG1hdGNoZXMgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbWF0Y2ggPSBpdGVtLm1hdGNoKC88W15cXC9dfFxcPlxccypbXjxdL2cpO1xyXG5cdFx0XHRpZiAobWF0Y2ggIT0gbnVsbCkgcmV0dXJuIG1hdGNoLmxlbmd0aDtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGlzQXJyYXkoaXRlbSkpIHtcclxuXHRcdFx0cmV0dXJuIGl0ZW0ubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZEFycmF5KGRhdGEsIGNhY2hlZCwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHBhcmVudFRhZywgc2hvdWxkUmVhdHRhY2gsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdGRhdGEgPSBmbGF0dGVuKGRhdGEpO1xyXG5cdFx0dmFyIG5vZGVzID0gW10sIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoLCBzdWJBcnJheUNvdW50ID0gMDtcclxuXHJcblx0XHQvL2tleXMgYWxnb3JpdGhtOiBzb3J0IGVsZW1lbnRzIHdpdGhvdXQgcmVjcmVhdGluZyB0aGVtIGlmIGtleXMgYXJlIHByZXNlbnRcclxuXHRcdC8vMSkgY3JlYXRlIGEgbWFwIG9mIGFsbCBleGlzdGluZyBrZXlzLCBhbmQgbWFyayBhbGwgZm9yIGRlbGV0aW9uXHJcblx0XHQvLzIpIGFkZCBuZXcga2V5cyB0byBtYXAgYW5kIG1hcmsgdGhlbSBmb3IgYWRkaXRpb25cclxuXHRcdC8vMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0Ly80KSBmb3IgZWFjaCBrZXksIGhhbmRsZSBpdHMgY29ycmVzcG9uZGluZyBhY3Rpb24gYXMgbWFya2VkIGluIHByZXZpb3VzIHN0ZXBzXHJcblx0XHR2YXIgZXhpc3RpbmcgPSB7fSwgc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gZmFsc2U7XHJcblx0XHRmb3JLZXlzKGNhY2hlZCwgZnVuY3Rpb24gKGF0dHJzLCBpKSB7XHJcblx0XHRcdHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IHRydWU7XHJcblx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGJ1aWxkQXJyYXlLZXlzKGRhdGEpO1xyXG5cdFx0aWYgKHNob3VsZE1haW50YWluSWRlbnRpdGllcykgY2FjaGVkID0gZGlmZktleXMoZGF0YSwgY2FjaGVkLCBleGlzdGluZywgcGFyZW50RWxlbWVudCk7XHJcblx0XHQvL2VuZCBrZXkgYWxnb3JpdGhtXHJcblxyXG5cdFx0dmFyIGNhY2hlQ291bnQgPSAwO1xyXG5cdFx0Ly9mYXN0ZXIgZXhwbGljaXRseSB3cml0dGVuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHQvL2RpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgY2FjaGVkLCBpbmRleCwgZGF0YVtpXSwgY2FjaGVkW2NhY2hlQ291bnRdLCBzaG91bGRSZWF0dGFjaCwgaW5kZXggKyBzdWJBcnJheUNvdW50IHx8IHN1YkFycmF5Q291bnQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cclxuXHRcdFx0aWYgKGl0ZW0gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGludGFjdCA9IGludGFjdCAmJiBpdGVtLm5vZGVzLmludGFjdDtcclxuXHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IGdldFN1YkFycmF5Q291bnQoaXRlbSk7XHJcblx0XHRcdFx0Y2FjaGVkW2NhY2hlQ291bnQrK10gPSBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFpbnRhY3QpIGRpZmZBcnJheShkYXRhLCBjYWNoZWQsIG5vZGVzKTtcclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1ha2VDYWNoZShkYXRhLCBjYWNoZWQsIGluZGV4LCBwYXJlbnRJbmRleCwgcGFyZW50Q2FjaGUpIHtcclxuXHRcdGlmIChjYWNoZWQgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGNhY2hlZCkgPT09IHR5cGUuY2FsbChkYXRhKSkgcmV0dXJuIGNhY2hlZDtcclxuXHJcblx0XHRcdGlmIChwYXJlbnRDYWNoZSAmJiBwYXJlbnRDYWNoZS5ub2Rlcykge1xyXG5cdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4LCBlbmQgPSBvZmZzZXQgKyAoaXNBcnJheShkYXRhKSA/IGRhdGEgOiBjYWNoZWQubm9kZXMpLmxlbmd0aDtcclxuXHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoY2FjaGVkLm5vZGVzKSB7XHJcblx0XHRcdFx0Y2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3IoKTtcclxuXHRcdC8vaWYgY29uc3RydWN0b3IgY3JlYXRlcyBhIHZpcnR1YWwgZG9tIGVsZW1lbnQsIHVzZSBhIGJsYW5rIG9iamVjdFxyXG5cdFx0Ly9hcyB0aGUgYmFzZSBjYWNoZWQgbm9kZSBpbnN0ZWFkIG9mIGNvcHlpbmcgdGhlIHZpcnR1YWwgZWwgKCMyNzcpXHJcblx0XHRpZiAoY2FjaGVkLnRhZykgY2FjaGVkID0ge307XHJcblx0XHRjYWNoZWQubm9kZXMgPSBbXTtcclxuXHRcdHJldHVybiBjYWNoZWQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3ROb2RlKGRhdGEsIG5hbWVzcGFjZSkge1xyXG5cdFx0cmV0dXJuIG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID9cclxuXHRcdFx0ZGF0YS5hdHRycy5pcyA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKSA6XHJcblx0XHRcdGRhdGEuYXR0cnMuaXMgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbnN0cnVjdEF0dHJzKGRhdGEsIG5vZGUsIG5hbWVzcGFjZSwgaGFzS2V5cykge1xyXG5cdFx0cmV0dXJuIGhhc0tleXMgPyBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCB7fSwgbmFtZXNwYWNlKSA6IGRhdGEuYXR0cnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb25zdHJ1Y3RDaGlsZHJlbihkYXRhLCBub2RlLCBjYWNoZWQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdHJldHVybiBkYXRhLmNoaWxkcmVuICE9IG51bGwgJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwID9cclxuXHRcdFx0YnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIHRydWUsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0ZGF0YS5jaGlsZHJlbjtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlY29uc3RydWN0Q2FjaGVkKGRhdGEsIGF0dHJzLCBjaGlsZHJlbiwgbm9kZSwgbmFtZXNwYWNlLCB2aWV3cywgY29udHJvbGxlcnMpIHtcclxuXHRcdHZhciBjYWNoZWQgPSB7dGFnOiBkYXRhLnRhZywgYXR0cnM6IGF0dHJzLCBjaGlsZHJlbjogY2hpbGRyZW4sIG5vZGVzOiBbbm9kZV19O1xyXG5cdFx0dW5sb2FkQ2FjaGVkQ29udHJvbGxlcnMoY2FjaGVkLCB2aWV3cywgY29udHJvbGxlcnMpO1xyXG5cdFx0aWYgKGNhY2hlZC5jaGlsZHJlbiAmJiAhY2FjaGVkLmNoaWxkcmVuLm5vZGVzKSBjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXTtcclxuXHRcdC8vZWRnZSBjYXNlOiBzZXR0aW5nIHZhbHVlIG9uIDxzZWxlY3Q+IGRvZXNuJ3Qgd29yayBiZWZvcmUgY2hpbGRyZW4gZXhpc3QsIHNvIHNldCBpdCBhZ2FpbiBhZnRlciBjaGlsZHJlbiBoYXZlIGJlZW4gY3JlYXRlZFxyXG5cdFx0aWYgKGRhdGEudGFnID09PSBcInNlbGVjdFwiICYmIFwidmFsdWVcIiBpbiBkYXRhLmF0dHJzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCB7dmFsdWU6IGRhdGEuYXR0cnMudmFsdWV9LCB7fSwgbmFtZXNwYWNlKTtcclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldENvbnRyb2xsZXIodmlld3MsIHZpZXcsIGNhY2hlZENvbnRyb2xsZXJzLCBjb250cm9sbGVyKSB7XHJcblx0XHR2YXIgY29udHJvbGxlckluZGV4ID0gbS5yZWRyYXcuc3RyYXRlZ3koKSA9PT0gXCJkaWZmXCIgJiYgdmlld3MgPyB2aWV3cy5pbmRleE9mKHZpZXcpIDogLTE7XHJcblx0XHRyZXR1cm4gY29udHJvbGxlckluZGV4ID4gLTEgPyBjYWNoZWRDb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdIDpcclxuXHRcdFx0dHlwZW9mIGNvbnRyb2xsZXIgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBjb250cm9sbGVyKCkgOiB7fTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHVwZGF0ZUxpc3RzKHZpZXdzLCBjb250cm9sbGVycywgdmlldywgY29udHJvbGxlcikge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgIT0gbnVsbCkgdW5sb2FkZXJzLnB1c2goe2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWR9KTtcclxuXHRcdHZpZXdzLnB1c2godmlldyk7XHJcblx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY2hlY2tWaWV3KGRhdGEsIHZpZXcsIGNhY2hlZCwgY2FjaGVkQ29udHJvbGxlcnMsIGNvbnRyb2xsZXJzLCB2aWV3cykge1xyXG5cdFx0dmFyIGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGNhY2hlZC52aWV3cywgdmlldywgY2FjaGVkQ29udHJvbGxlcnMsIGRhdGEuY29udHJvbGxlcik7XHJcblx0XHQvL0Zhc3RlciB0byBjb2VyY2UgdG8gbnVtYmVyIGFuZCBjaGVjayBmb3IgTmFOXHJcblx0XHR2YXIga2V5ID0gKyhkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXkpO1xyXG5cdFx0ZGF0YSA9IHBlbmRpbmdSZXF1ZXN0cyA9PT0gMCB8fCBmb3JjaW5nIHx8IGNhY2hlZENvbnRyb2xsZXJzICYmIGNhY2hlZENvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlcikgPiAtMSA/IGRhdGEudmlldyhjb250cm9sbGVyKSA6IHt0YWc6IFwicGxhY2Vob2xkZXJcIn07XHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0aWYgKGtleSA9PT0ga2V5KSAoZGF0YS5hdHRycyA9IGRhdGEuYXR0cnMgfHwge30pLmtleSA9IGtleTtcclxuXHRcdHVwZGF0ZUxpc3RzKHZpZXdzLCBjb250cm9sbGVycywgdmlldywgY29udHJvbGxlcik7XHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1hcmtWaWV3cyhkYXRhLCBjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycykge1xyXG5cdFx0dmFyIGNhY2hlZENvbnRyb2xsZXJzID0gY2FjaGVkICYmIGNhY2hlZC5jb250cm9sbGVycztcclxuXHRcdHdoaWxlIChkYXRhLnZpZXcgIT0gbnVsbCkgZGF0YSA9IGNoZWNrVmlldyhkYXRhLCBkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlldywgY2FjaGVkLCBjYWNoZWRDb250cm9sbGVycywgY29udHJvbGxlcnMsIHZpZXdzKTtcclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGRPYmplY3QoZGF0YSwgY2FjaGVkLCBlZGl0YWJsZSwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHNob3VsZFJlYXR0YWNoLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdHZhciB2aWV3cyA9IFtdLCBjb250cm9sbGVycyA9IFtdO1xyXG5cdFx0ZGF0YSA9IG1hcmtWaWV3cyhkYXRhLCBjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycyk7XHJcblx0XHRpZiAoIWRhdGEudGFnICYmIGNvbnRyb2xsZXJzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHRlbXBsYXRlIG11c3QgcmV0dXJuIGEgdmlydHVhbCBlbGVtZW50LCBub3QgYW4gYXJyYXksIHN0cmluZywgZXRjLlwiKTtcclxuXHRcdGRhdGEuYXR0cnMgPSBkYXRhLmF0dHJzIHx8IHt9O1xyXG5cdFx0Y2FjaGVkLmF0dHJzID0gY2FjaGVkLmF0dHJzIHx8IHt9O1xyXG5cdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpO1xyXG5cdFx0dmFyIGhhc0tleXMgPSBkYXRhQXR0cktleXMubGVuZ3RoID4gKFwia2V5XCIgaW4gZGF0YS5hdHRycyA/IDEgOiAwKTtcclxuXHRcdG1heWJlUmVjcmVhdGVPYmplY3QoZGF0YSwgY2FjaGVkLCBkYXRhQXR0cktleXMpO1xyXG5cdFx0aWYgKCFpc1N0cmluZyhkYXRhLnRhZykpIHJldHVybjtcclxuXHRcdHZhciBpc05ldyA9IGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDA7XHJcblx0XHRuYW1lc3BhY2UgPSBnZXRPYmplY3ROYW1lc3BhY2UoZGF0YSwgbmFtZXNwYWNlKTtcclxuXHRcdHZhciBub2RlO1xyXG5cdFx0aWYgKGlzTmV3KSB7XHJcblx0XHRcdG5vZGUgPSBjb25zdHJ1Y3ROb2RlKGRhdGEsIG5hbWVzcGFjZSk7XHJcblx0XHRcdC8vc2V0IGF0dHJpYnV0ZXMgZmlyc3QsIHRoZW4gY3JlYXRlIGNoaWxkcmVuXHJcblx0XHRcdHZhciBhdHRycyA9IGNvbnN0cnVjdEF0dHJzKGRhdGEsIG5vZGUsIG5hbWVzcGFjZSwgaGFzS2V5cylcclxuXHRcdFx0dmFyIGNoaWxkcmVuID0gY29uc3RydWN0Q2hpbGRyZW4oZGF0YSwgbm9kZSwgY2FjaGVkLCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0Y2FjaGVkID0gcmVjb25zdHJ1Y3RDYWNoZWQoZGF0YSwgYXR0cnMsIGNoaWxkcmVuLCBub2RlLCBuYW1lc3BhY2UsIHZpZXdzLCBjb250cm9sbGVycyk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bm9kZSA9IGJ1aWxkVXBkYXRlZE5vZGUoY2FjaGVkLCBkYXRhLCBlZGl0YWJsZSwgaGFzS2V5cywgbmFtZXNwYWNlLCB2aWV3cywgY29uZmlncywgY29udHJvbGxlcnMpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzTmV3IHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlICYmIG5vZGUgIT0gbnVsbCkgaW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2RlLCBpbmRleCk7XHJcblx0XHQvL3NjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYFxyXG5cdFx0Ly9maW5pc2hlcyBydW5uaW5nXHJcblx0XHRzY2hlZHVsZUNvbmZpZ3NUb0JlQ2FsbGVkKGNvbmZpZ3MsIGRhdGEsIG5vZGUsIGlzTmV3LCBjYWNoZWQpO1xyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBwYXJlbnRDYWNoZSwgcGFyZW50SW5kZXgsIGRhdGEsIGNhY2hlZCwgc2hvdWxkUmVhdHRhY2gsIGluZGV4LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSB7XHJcblx0XHQvL2BidWlsZGAgaXMgYSByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBtYW5hZ2VzIGNyZWF0aW9uL2RpZmZpbmcvcmVtb3ZhbFxyXG5cdFx0Ly9vZiBET00gZWxlbWVudHMgYmFzZWQgb24gY29tcGFyaXNvbiBiZXR3ZWVuIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vdGhlIGRpZmYgYWxnb3JpdGhtIGNhbiBiZSBzdW1tYXJpemVkIGFzIHRoaXM6XHJcblx0XHQvLzEgLSBjb21wYXJlIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vMiAtIGlmIHRoZXkgYXJlIGRpZmZlcmVudCwgY29weSBgZGF0YWAgdG8gYGNhY2hlZGAgYW5kIHVwZGF0ZSB0aGUgRE9NXHJcblx0XHQvLyAgICBiYXNlZCBvbiB3aGF0IHRoZSBkaWZmZXJlbmNlIGlzXHJcblx0XHQvLzMgLSByZWN1cnNpdmVseSBhcHBseSB0aGlzIGFsZ29yaXRobSBmb3IgZXZlcnkgYXJyYXkgYW5kIGZvciB0aGVcclxuXHRcdC8vICAgIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cclxuXHRcdC8vdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91c1xyXG5cdFx0Ly9yZWRyYXcncyBgZGF0YWAgZGF0YSBzdHJ1Y3R1cmUsIHdpdGggYSBmZXcgYWRkaXRpb25zOlxyXG5cdFx0Ly8tIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mXHJcblx0XHQvLyAgIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlXHJcblx0XHQvLyAgIHJlc3BlY3RpdmUgdmlydHVhbCBlbGVtZW50XHJcblx0XHQvLy0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLFxyXG5cdFx0Ly8gICBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhc1xyXG5cdFx0Ly8gICBhIHN0cmluZywgdGhlbiBjYWNoZWQgaXMgYSBTdHJpbmcgaW5zdGFuY2UuIElmIGRhdGEgd2FzIGBudWxsYCBvclxyXG5cdFx0Ly8gICBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0Ly8tIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZVxyXG5cdFx0Ly8gICBzdG9yYWdlIG9iamVjdCBleHBvc2VkIGJ5IGNvbmZpZyhlbGVtZW50LCBpc0luaXRpYWxpemVkLCBjb250ZXh0KVxyXG5cdFx0Ly8tIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuXHJcblx0XHQvLyAgIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYVxyXG5cdFx0Ly8gICBTdHJpbmcsIE51bWJlciBvciBCb29sZWFuLCBpdCByZXByZXNlbnRzIGEgdGV4dCBub2RlXHJcblxyXG5cdFx0Ly9gcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0Ly9gcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhXHJcblx0XHQvL3ZhbHVlc1xyXG5cdFx0Ly9gcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0Ly9gcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy5cclxuXHRcdC8vVGhleSdyZSBhcnRpZmFjdHMgZnJvbSBiZWZvcmUgYXJyYXlzIHN0YXJ0ZWQgYmVpbmcgZmxhdHRlbmVkIGFuZCBhcmVcclxuXHRcdC8vbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0Ly9gZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmdcclxuXHRcdC8vZGlmZmVkXHJcblx0XHQvL2BzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhc1xyXG5cdFx0Ly9yZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdFxyXG5cdFx0Ly9yZWF0dGFjaCBpdHNlbGYgdG8gdGhlIG5ldyBwYXJlbnQpXHJcblx0XHQvL2BlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXNcclxuXHRcdC8vY29udGVudGVkaXRhYmxlXHJcblx0XHQvL2BuYW1lc3BhY2VgIGluZGljYXRlcyB0aGUgY2xvc2VzdCBIVE1MIG5hbWVzcGFjZSBhcyBpdCBjYXNjYWRlcyBkb3duXHJcblx0XHQvL2Zyb20gYW4gYW5jZXN0b3JcclxuXHRcdC8vYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdFxyXG5cdFx0Ly9gYnVpbGRgIGNhbGwgZmluaXNoZXMgcnVubmluZ1xyXG5cclxuXHRcdC8vdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZFxyXG5cdFx0Ly9kYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdC8vLSB0aGlzIHByZXZlbnRzIGxpZmVjeWNsZSBzdXJwcmlzZXMgZnJvbSBwcm9jZWR1cmFsIGhlbHBlcnMgdGhhdCBtaXhcclxuXHRcdC8vICBpbXBsaWNpdCBhbmQgZXhwbGljaXQgcmV0dXJuIHN0YXRlbWVudHMgKGUuZy5cclxuXHRcdC8vICBmdW5jdGlvbiBmb28oKSB7aWYgKGNvbmQpIHJldHVybiBtKFwiZGl2XCIpfVxyXG5cdFx0Ly8tIGl0IHNpbXBsaWZpZXMgZGlmZmluZyBjb2RlXHJcblx0XHRkYXRhID0gZGF0YVRvU3RyaW5nKGRhdGEpO1xyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZDtcclxuXHRcdGNhY2hlZCA9IG1ha2VDYWNoZShkYXRhLCBjYWNoZWQsIGluZGV4LCBwYXJlbnRJbmRleCwgcGFyZW50Q2FjaGUpO1xyXG5cdFx0cmV0dXJuIGlzQXJyYXkoZGF0YSkgPyBidWlsZEFycmF5KGRhdGEsIGNhY2hlZCwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHBhcmVudFRhZywgc2hvdWxkUmVhdHRhY2gsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0ZGF0YSAhPSBudWxsICYmIGlzT2JqZWN0KGRhdGEpID8gYnVpbGRPYmplY3QoZGF0YSwgY2FjaGVkLCBlZGl0YWJsZSwgcGFyZW50RWxlbWVudCwgaW5kZXgsIHNob3VsZFJlYXR0YWNoLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0IWlzRnVuY3Rpb24oZGF0YSkgPyBoYW5kbGVUZXh0KGNhY2hlZCwgZGF0YSwgaW5kZXgsIHBhcmVudEVsZW1lbnQsIHNob3VsZFJlYXR0YWNoLCBlZGl0YWJsZSwgcGFyZW50VGFnKSA6XHJcblx0XHRcdGNhY2hlZDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gc29ydENoYW5nZXMoYSwgYikgeyByZXR1cm4gYS5hY3Rpb24gLSBiLmFjdGlvbiB8fCBhLmluZGV4IC0gYi5pbmRleDsgfVxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHQvL2Bjb25maWdgIGlzbid0IGEgcmVhbCBhdHRyaWJ1dGVzLCBzbyBpZ25vcmUgaXRcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT09IFwia2V5XCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdC8vaG9vayBldmVudCBoYW5kbGVycyB0byB0aGUgYXV0by1yZWRyYXdpbmcgc3lzdGVtXHJcblx0XHRcdFx0ZWxzZSBpZiAoaXNGdW5jdGlvbihkYXRhQXR0cikgJiYgYXR0ck5hbWUuc2xpY2UoMCwgMikgPT09IFwib25cIikge1xyXG5cdFx0XHRcdG5vZGVbYXR0ck5hbWVdID0gYXV0b3JlZHJhdyhkYXRhQXR0ciwgbm9kZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vaGFuZGxlIGBzdHlsZTogey4uLn1gXHJcblx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIiAmJiBkYXRhQXR0ciAhPSBudWxsICYmIGlzT2JqZWN0KGRhdGFBdHRyKSkge1xyXG5cdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNhY2hlZEF0dHIgPT0gbnVsbCB8fCBjYWNoZWRBdHRyW3J1bGVdICE9PSBkYXRhQXR0cltydWxlXSkgbm9kZS5zdHlsZVtydWxlXSA9IGRhdGFBdHRyW3J1bGVdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGNhY2hlZEF0dHIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCEocnVsZSBpbiBkYXRhQXR0cikpIG5vZGUuc3R5bGVbcnVsZV0gPSBcIlwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9oYW5kbGUgU1ZHXHJcblx0XHRcdFx0ZWxzZSBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiaHJlZlwiKSBub2RlLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBcImhyZWZcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUgPT09IFwiY2xhc3NOYW1lXCIgPyBcImNsYXNzXCIgOiBhdHRyTmFtZSwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0Ly8tIGxpc3QgYW5kIGZvcm0gYXJlIHR5cGljYWxseSB1c2VkIGFzIHN0cmluZ3MsIGJ1dCBhcmUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlcyBpbiBqc1xyXG5cdFx0XHRcdC8vLSB3aGVuIHVzaW5nIENTUyBzZWxlY3RvcnMgKGUuZy4gYG0oXCJbc3R5bGU9JyddXCIpYCksIHN0eWxlIGlzIHVzZWQgYXMgYSBzdHJpbmcsIGJ1dCBpdCdzIGFuIG9iamVjdCBpbiBqc1xyXG5cdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgYXR0ck5hbWUgIT09IFwibGlzdFwiICYmIGF0dHJOYW1lICE9PSBcInN0eWxlXCIgJiYgYXR0ck5hbWUgIT09IFwiZm9ybVwiICYmIGF0dHJOYW1lICE9PSBcInR5cGVcIiAmJiBhdHRyTmFtZSAhPT0gXCJ3aWR0aFwiICYmIGF0dHJOYW1lICE9PSBcImhlaWdodFwiKSB7XHJcblx0XHRcdFx0Ly8jMzQ4IGRvbid0IHNldCB0aGUgdmFsdWUgaWYgbm90IG5lZWRlZCBvdGhlcndpc2UgY3Vyc29yIHBsYWNlbWVudCBicmVha3MgaW4gQ2hyb21lXHJcblx0XHRcdFx0aWYgKHRhZyAhPT0gXCJpbnB1dFwiIHx8IG5vZGVbYXR0ck5hbWVdICE9PSBkYXRhQXR0cikgbm9kZVthdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIzM0OCBkYXRhQXR0ciBtYXkgbm90IGJlIGEgc3RyaW5nLCBzbyB1c2UgbG9vc2UgY29tcGFyaXNvbiAoZG91YmxlIGVxdWFsKSBpbnN0ZWFkIG9mIHN0cmljdCAodHJpcGxlIGVxdWFsKVxyXG5cdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJ2YWx1ZVwiICYmIHRhZyA9PT0gXCJpbnB1dFwiICYmIG5vZGUudmFsdWUgIT0gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRub2RlLnZhbHVlID0gZGF0YUF0dHI7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjYWNoZWRBdHRycztcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xlYXIobm9kZXMsIGNhY2hlZCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IG5vZGVzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XHJcblx0XHRcdGlmIChub2Rlc1tpXSAmJiBub2Rlc1tpXS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdFx0dHJ5IHsgbm9kZXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSk7IH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge30gLy9pZ25vcmUgaWYgdGhpcyBmYWlscyBkdWUgdG8gb3JkZXIgb2YgZXZlbnRzIChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0pIHVubG9hZChjYWNoZWRbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL3JlbGVhc2UgbWVtb3J5IGlmIG5vZGVzIGlzIGFuIGFycmF5LiBUaGlzIGNoZWNrIHNob3VsZCBmYWlsIGlmIG5vZGVzIGlzIGEgTm9kZUxpc3QgKHNlZSBsb29wIGFib3ZlKVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCkgbm9kZXMubGVuZ3RoID0gMDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gdW5sb2FkKGNhY2hlZCkge1xyXG5cdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGlzRnVuY3Rpb24oY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQpKSB7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKCk7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yRWFjaChjYWNoZWQuY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGlzRnVuY3Rpb24oY29udHJvbGxlci5vbnVubG9hZCkpIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNhY2hlZC5jaGlsZHJlbikge1xyXG5cdFx0XHRpZiAoaXNBcnJheShjYWNoZWQuY2hpbGRyZW4pKSBmb3JFYWNoKGNhY2hlZC5jaGlsZHJlbiwgdW5sb2FkKTtcclxuXHRcdFx0ZWxzZSBpZiAoY2FjaGVkLmNoaWxkcmVuLnRhZykgdW5sb2FkKGNhY2hlZC5jaGlsZHJlbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaW5zZXJ0QWRqYWNlbnRCZWZvcmVFbmQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIHJhbmdlU3RyYXRlZ3kgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCwgZGF0YSkge1xyXG5cdFx0XHRwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKCRkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChkYXRhKSk7XHJcblx0XHR9O1xyXG5cdFx0dmFyIGluc2VydEFkamFjZW50U3RyYXRlZ3kgPSBmdW5jdGlvbiAocGFyZW50RWxlbWVudCwgZGF0YSkge1xyXG5cdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBkYXRhKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0JGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCd4Jyk7XHJcblx0XHRcdHJldHVybiByYW5nZVN0cmF0ZWd5O1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gaW5zZXJ0QWRqYWNlbnRTdHJhdGVneTtcclxuXHRcdH1cclxuXHR9KSgpO1xyXG5cclxuXHRmdW5jdGlvbiBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHZhciBpc0VsZW1lbnQgPSBuZXh0U2libGluZy5ub2RlVHlwZSAhPT0gMTtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVyID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cdFx0XHRpZiAoaXNFbGVtZW50KSB7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIG5leHRTaWJsaW5nIHx8IG51bGwpO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgbmV4dFNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGluc2VydEFkamFjZW50QmVmb3JlRW5kKHBhcmVudEVsZW1lbnQsIGRhdGEpO1xyXG5cclxuXHRcdHZhciBub2RlcyA9IFtdO1xyXG5cdFx0d2hpbGUgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gIT09IG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdG5vZGVzLnB1c2gocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRcdGluZGV4Kys7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9kZXM7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGF1dG9yZWRyYXcoY2FsbGJhY2ssIG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHRyeSB7IHJldHVybiBjYWxsYmFjay5jYWxsKG9iamVjdCwgZSk7IH1cclxuXHRcdFx0ZmluYWxseSB7XHJcblx0XHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0dmFyIGh0bWw7XHJcblx0dmFyIGRvY3VtZW50Tm9kZSA9IHtcclxuXHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIik7XHJcblx0XHRcdGlmICgkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgJGRvY3VtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cdFx0XHR0aGlzLmNoaWxkTm9kZXMgPSAkZG9jdW1lbnQuY2hpbGROb2RlcztcclxuXHRcdH0sXHJcblx0XHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChub2RlKTtcclxuXHRcdH0sXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH07XHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdLCBjZWxsQ2FjaGUgPSB7fTtcclxuXHRtLnJlbmRlciA9IGZ1bmN0aW9uKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXTtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpO1xyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0dmFyIGlzRG9jdW1lbnRSb290ID0gcm9vdCA9PT0gJGRvY3VtZW50O1xyXG5cdFx0dmFyIG5vZGUgPSBpc0RvY3VtZW50Um9vdCB8fCByb290ID09PSAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnROb2RlIDogcm9vdDtcclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPT0gXCJodG1sXCIpIGNlbGwgPSB7dGFnOiBcImh0bWxcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogY2VsbH07XHJcblx0XHRpZiAoY2VsbENhY2hlW2lkXSA9PT0gdW5kZWZpbmVkKSBjbGVhcihub2RlLmNoaWxkTm9kZXMpO1xyXG5cdFx0aWYgKGZvcmNlUmVjcmVhdGlvbiA9PT0gdHJ1ZSkgcmVzZXQocm9vdCk7XHJcblx0XHRjZWxsQ2FjaGVbaWRdID0gYnVpbGQobm9kZSwgbnVsbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNlbGwsIGNlbGxDYWNoZVtpZF0sIGZhbHNlLCAwLCBudWxsLCB1bmRlZmluZWQsIGNvbmZpZ3MpO1xyXG5cdFx0Zm9yRWFjaChjb25maWdzLCBmdW5jdGlvbiAoY29uZmlnKSB7IGNvbmZpZygpOyB9KTtcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGdldENlbGxDYWNoZUtleShlbGVtZW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBub2RlQ2FjaGUuaW5kZXhPZihlbGVtZW50KTtcclxuXHRcdHJldHVybiBpbmRleCA8IDAgPyBub2RlQ2FjaGUucHVzaChlbGVtZW50KSAtIDEgOiBpbmRleDtcclxuXHR9XHJcblxyXG5cdG0udHJ1c3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlLiR0cnVzdGVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXR0ZXJzZXR0ZXIoc3RvcmUpIHtcclxuXHRcdHZhciBwcm9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSBzdG9yZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0cmV0dXJuIHN0b3JlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRwcm9wLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RvcmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBwcm9wO1xyXG5cdH1cclxuXHJcblx0bS5wcm9wID0gZnVuY3Rpb24gKHN0b3JlKSB7XHJcblx0XHQvL25vdGU6IHVzaW5nIG5vbi1zdHJpY3QgZXF1YWxpdHkgY2hlY2sgaGVyZSBiZWNhdXNlIHdlJ3JlIGNoZWNraW5nIGlmIHN0b3JlIGlzIG51bGwgT1IgdW5kZWZpbmVkXHJcblx0XHRpZiAoKHN0b3JlICE9IG51bGwgJiYgaXNPYmplY3Qoc3RvcmUpIHx8IGlzRnVuY3Rpb24oc3RvcmUpKSAmJiBpc0Z1bmN0aW9uKHN0b3JlLnRoZW4pKSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHN0b3JlKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZ2V0dGVyc2V0dGVyKHN0b3JlKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgcm9vdHMgPSBbXSwgY29tcG9uZW50cyA9IFtdLCBjb250cm9sbGVycyA9IFtdLCBsYXN0UmVkcmF3SWQgPSBudWxsLCBsYXN0UmVkcmF3Q2FsbFRpbWUgPSAwLCBjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGwsIGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsIHRvcENvbXBvbmVudCwgdW5sb2FkZXJzID0gW107XHJcblx0dmFyIEZSQU1FX0JVREdFVCA9IDE2OyAvLzYwIGZyYW1lcyBwZXIgc2Vjb25kID0gMSBjYWxsIHBlciAxNiBtc1xyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJncykgfHwgdGhpcztcclxuXHRcdH07XHJcblx0XHRpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIGNvbnRyb2xsZXIucHJvdG90eXBlID0gY29tcG9uZW50LmNvbnRyb2xsZXIucHJvdG90eXBlO1xyXG5cdFx0dmFyIHZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XHJcblx0XHRcdHZhciBjdXJyZW50QXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJncy5jb25jYXQoW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSA6IGFyZ3M7XHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGN1cnJlbnRBcmdzID8gW2N0cmxdLmNvbmNhdChjdXJyZW50QXJncykgOiBbY3RybF0pO1xyXG5cdFx0fTtcclxuXHRcdHZpZXcuJG9yaWdpbmFsID0gY29tcG9uZW50LnZpZXc7XHJcblx0XHR2YXIgb3V0cHV0ID0ge2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIHZpZXc6IHZpZXd9O1xyXG5cdFx0aWYgKGFyZ3NbMF0gJiYgYXJnc1swXS5rZXkgIT0gbnVsbCkgb3V0cHV0LmF0dHJzID0ge2tleTogYXJnc1swXS5rZXl9O1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9XHJcblx0bS5jb21wb25lbnQgPSBmdW5jdGlvbihjb21wb25lbnQpIHtcclxuXHRcdGZvciAodmFyIGFyZ3MgPSBbXSwgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xyXG5cdFx0cmV0dXJuIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpO1xyXG5cdH07XHJcblx0bS5tb3VudCA9IG0ubW9kdWxlID0gZnVuY3Rpb24ocm9vdCwgY29tcG9uZW50KSB7XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaW5kZXggPSByb290cy5pbmRleE9mKHJvb3QpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGg7XHJcblxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcblx0XHR2YXIgZXZlbnQgPSB7cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1ByZXZlbnRlZCA9IHRydWU7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbDtcclxuXHRcdH19O1xyXG5cclxuXHRcdGZvckVhY2godW5sb2FkZXJzLCBmdW5jdGlvbiAodW5sb2FkZXIpIHtcclxuXHRcdFx0dW5sb2FkZXIuaGFuZGxlci5jYWxsKHVubG9hZGVyLmNvbnRyb2xsZXIsIGV2ZW50KTtcclxuXHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IG51bGw7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0Zm9yRWFjaCh1bmxvYWRlcnMsIGZ1bmN0aW9uICh1bmxvYWRlcikge1xyXG5cdFx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgdW5sb2FkZXJzID0gW107XHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzW2luZGV4XSAmJiBpc0Z1bmN0aW9uKGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCkpIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaXNOdWxsQ29tcG9uZW50ID0gY29tcG9uZW50ID09PSBudWxsO1xyXG5cclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyb290c1tpbmRleF0gPSByb290O1xyXG5cdFx0XHR2YXIgY3VycmVudENvbXBvbmVudCA9IGNvbXBvbmVudCA/ICh0b3BDb21wb25lbnQgPSBjb21wb25lbnQpIDogKHRvcENvbXBvbmVudCA9IGNvbXBvbmVudCA9IHtjb250cm9sbGVyOiBub29wfSk7XHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IChjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wKSgpO1xyXG5cdFx0XHQvL2NvbnRyb2xsZXJzIG1heSBjYWxsIG0ubW91bnQgcmVjdXJzaXZlbHkgKHZpYSBtLnJvdXRlIHJlZGlyZWN0cywgZm9yIGV4YW1wbGUpXHJcblx0XHRcdC8vdGhpcyBjb25kaXRpb25hbCBlbnN1cmVzIG9ubHkgdGhlIGxhc3QgcmVjdXJzaXZlIG0ubW91bnQgY2FsbCBpcyBhcHBsaWVkXHJcblx0XHRcdGlmIChjdXJyZW50Q29tcG9uZW50ID09PSB0b3BDb21wb25lbnQpIHtcclxuXHRcdFx0XHRjb250cm9sbGVyc1tpbmRleF0gPSBjb250cm9sbGVyO1xyXG5cdFx0XHRcdGNvbXBvbmVudHNbaW5kZXhdID0gY29tcG9uZW50O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0aWYgKGlzTnVsbENvbXBvbmVudCkge1xyXG5cdFx0XHRcdHJlbW92ZVJvb3RFbGVtZW50KHJvb3QsIGluZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY29udHJvbGxlcnNbaW5kZXhdO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzTnVsbENvbXBvbmVudCkge1xyXG5cdFx0XHRyZW1vdmVSb290RWxlbWVudChyb290LCBpbmRleCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gcmVtb3ZlUm9vdEVsZW1lbnQocm9vdCwgaW5kZXgpIHtcclxuXHRcdHJvb3RzLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRjb250cm9sbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0Y29tcG9uZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0cmVzZXQocm9vdCk7XHJcblx0XHRub2RlQ2FjaGUuc3BsaWNlKGdldENlbGxDYWNoZUtleShyb290KSwgMSk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVkcmF3aW5nID0gZmFsc2UsIGZvcmNpbmcgPSBmYWxzZTtcclxuXHRtLnJlZHJhdyA9IGZ1bmN0aW9uKGZvcmNlKSB7XHJcblx0XHRpZiAocmVkcmF3aW5nKSByZXR1cm47XHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlO1xyXG5cdFx0aWYgKGZvcmNlKSBmb3JjaW5nID0gdHJ1ZTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdC8vbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0XHQvL2xhc3RSZWRyYXdJRCBpcyBudWxsIGlmIGl0J3MgdGhlIGZpcnN0IHJlZHJhdyBhbmQgbm90IGFuIGV2ZW50IGhhbmRsZXJcclxuXHRcdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiAhZm9yY2UpIHtcclxuXHRcdFx0XHQvL3doZW4gc2V0VGltZW91dDogb25seSByZXNjaGVkdWxlIHJlZHJhdyBpZiB0aW1lIGJldHdlZW4gbm93IGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXAgY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdFx0Ly93aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdFx0aWYgKCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgbmV3IERhdGUgLSBsYXN0UmVkcmF3Q2FsbFRpbWUgPiBGUkFNRV9CVURHRVQpIHtcclxuXHRcdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKTtcclxuXHRcdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3LCBGUkFNRV9CVURHRVQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZWRyYXcoKTtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsYXN0UmVkcmF3SWQgPSBudWxsOyB9LCBGUkFNRV9CVURHRVQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmaW5hbGx5IHtcclxuXHRcdFx0cmVkcmF3aW5nID0gZm9yY2luZyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0bS5yZWRyYXcuc3RyYXRlZ3kgPSBtLnByb3AoKTtcclxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XHJcblx0XHRpZiAoY29tcHV0ZVByZVJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2soKTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0Zm9yRWFjaChyb290cywgZnVuY3Rpb24gKHJvb3QsIGkpIHtcclxuXHRcdFx0dmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudHNbaV07XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gW2NvbnRyb2xsZXJzW2ldXTtcclxuXHRcdFx0XHRtLnJlbmRlcihyb290LCBjb21wb25lbnQudmlldyA/IGNvbXBvbmVudC52aWV3KGNvbnRyb2xsZXJzW2ldLCBhcmdzKSA6IFwiXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vYWZ0ZXIgcmVuZGVyaW5nIHdpdGhpbiBhIHJvdXRlZCBjb250ZXh0LCB3ZSBuZWVkIHRvIHNjcm9sbCBiYWNrIHRvIHRoZSB0b3AsIGFuZCBmZXRjaCB0aGUgZG9jdW1lbnQgdGl0bGUgZm9yIGhpc3RvcnkucHVzaFN0YXRlXHJcblx0XHRpZiAoY29tcHV0ZVBvc3RSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vaygpO1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0bGFzdFJlZHJhd0lkID0gbnVsbDtcclxuXHRcdGxhc3RSZWRyYXdDYWxsVGltZSA9IG5ldyBEYXRlO1xyXG5cdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7IHBlbmRpbmdSZXF1ZXN0cysrOyB9O1xyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgPiAxKSBwZW5kaW5nUmVxdWVzdHMtLTtcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdFx0XHRtLnJlZHJhdygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZW5kRmlyc3RDb21wdXRhdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcIm5vbmVcIikge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMtLTtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaywgY2FsbGJhY2tUaGlzKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgdGhpcztcclxuXHRcdFx0dmFyIF90aGlzID0gY2FsbGJhY2tUaGlzIHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2suY2FsbChfdGhpcywgcHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKTtcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0Ly9yb3V0aW5nXHJcblx0dmFyIG1vZGVzID0ge3BhdGhuYW1lOiBcIlwiLCBoYXNoOiBcIiNcIiwgc2VhcmNoOiBcIj9cIn07XHJcblx0dmFyIHJlZGlyZWN0ID0gbm9vcCwgcm91dGVQYXJhbXMsIGN1cnJlbnRSb3V0ZSwgaXNEZWZhdWx0Um91dGUgPSBmYWxzZTtcclxuXHRtLnJvdXRlID0gZnVuY3Rpb24ocm9vdCwgYXJnMSwgYXJnMiwgdmRvbSkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgaXNTdHJpbmcoYXJnMSkpIHtcclxuXHRcdFx0cmVkaXJlY3QgPSBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9IGN1cnJlbnRSb3V0ZSA9IG5vcm1hbGl6ZVJvdXRlKHNvdXJjZSk7XHJcblx0XHRcdFx0aWYgKCFyb3V0ZUJ5VmFsdWUocm9vdCwgYXJnMiwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgb25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpO1xyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0bS5yb3V0ZShhcmcxLCB0cnVlKTtcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSBtLnJvdXRlLm1vZGUgPT09IFwiaGFzaFwiID8gXCJvbmhhc2hjaGFuZ2VcIiA6IFwib25wb3BzdGF0ZVwiO1xyXG5cdFx0XHR3aW5kb3dbbGlzdGVuZXJdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSAkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXTtcclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaDtcclxuXHRcdFx0XHRpZiAoY3VycmVudFJvdXRlICE9PSBub3JtYWxpemVSb3V0ZShwYXRoKSkgcmVkaXJlY3QocGF0aCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbDtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSgpO1xyXG5cdFx0fVxyXG5cdFx0Ly9jb25maWc6IG0ucm91dGVcclxuXHRcdGVsc2UgaWYgKHJvb3QuYWRkRXZlbnRMaXN0ZW5lciB8fCByb290LmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHJvb3QuaHJlZiA9IChtLnJvdXRlLm1vZGUgIT09ICdwYXRobmFtZScgPyAkbG9jYXRpb24ucGF0aG5hbWUgOiAnJykgKyBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgdmRvbS5hdHRycy5ocmVmO1xyXG5cdFx0XHRpZiAocm9vdC5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdFx0cm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0cm9vdC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0cm9vdC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vbS5yb3V0ZShyb3V0ZSwgcGFyYW1zLCBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5KVxyXG5cdFx0ZWxzZSBpZiAoaXNTdHJpbmcocm9vdCkpIHtcclxuXHRcdFx0dmFyIG9sZFJvdXRlID0gY3VycmVudFJvdXRlO1xyXG5cdFx0XHRjdXJyZW50Um91dGUgPSByb290O1xyXG5cdFx0XHR2YXIgYXJncyA9IGFyZzEgfHwge307XHJcblx0XHRcdHZhciBxdWVyeUluZGV4ID0gY3VycmVudFJvdXRlLmluZGV4T2YoXCI/XCIpO1xyXG5cdFx0XHR2YXIgcGFyYW1zID0gcXVlcnlJbmRleCA+IC0xID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKSA6IHt9O1xyXG5cdFx0XHRmb3IgKHZhciBpIGluIGFyZ3MpIHBhcmFtc1tpXSA9IGFyZ3NbaV07XHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcocGFyYW1zKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoID0gcXVlcnlJbmRleCA+IC0xID8gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpIDogY3VycmVudFJvdXRlO1xyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIGN1cnJlbnRSb3V0ZSA9IGN1cnJlbnRQYXRoICsgKGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmc7XHJcblxyXG5cdFx0XHR2YXIgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAzID8gYXJnMiA6IGFyZzEpID09PSB0cnVlIHx8IG9sZFJvdXRlID09PSByb290O1xyXG5cclxuXHRcdFx0aWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsO1xyXG5cdFx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0d2luZG93Lmhpc3Rvcnlbc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiXShudWxsLCAkZG9jdW1lbnQudGl0bGUsIG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGU7XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdG0ucm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkpIHtcclxuXHRcdGlmICghcm91dGVQYXJhbXMpIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGNhbGwgbS5yb3V0ZShlbGVtZW50LCBkZWZhdWx0Um91dGUsIHJvdXRlcykgYmVmb3JlIGNhbGxpbmcgbS5yb3V0ZS5wYXJhbSgpXCIpO1xyXG5cdFx0aWYoICFrZXkgKXtcclxuXHRcdFx0cmV0dXJuIHJvdXRlUGFyYW1zO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJvdXRlUGFyYW1zW2tleV07XHJcblx0fTtcclxuXHRtLnJvdXRlLm1vZGUgPSBcInNlYXJjaFwiO1xyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRlKHJvdXRlKSB7XHJcblx0XHRyZXR1cm4gcm91dGUuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSB7XHJcblx0XHRyb3V0ZVBhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHZhciBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKFwiP1wiKTtcclxuXHRcdGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xyXG5cdFx0XHRyb3V0ZVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKSk7XHJcblx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cigwLCBxdWVyeVN0YXJ0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgYWxsIHJvdXRlcyBhbmQgY2hlY2sgaWYgdGhlcmUnc1xyXG5cdFx0Ly8gYW4gZXhhY3QgbWF0Y2ggZm9yIHRoZSBjdXJyZW50IHBhdGhcclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocm91dGVyKTtcclxuXHRcdHZhciBpbmRleCA9IGtleXMuaW5kZXhPZihwYXRoKTtcclxuXHRcdGlmKGluZGV4ICE9PSAtMSl7XHJcblx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW2tleXMgW2luZGV4XV0pO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciByb3V0ZSBpbiByb3V0ZXIpIHtcclxuXHRcdFx0aWYgKHJvdXRlID09PSBwYXRoKSB7XHJcblx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwiXlwiICsgcm91dGUucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIik7XHJcblxyXG5cdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0cGF0aC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZS5tYXRjaCgvOlteXFwvXSsvZykgfHwgW107XHJcblx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKTtcclxuXHRcdFx0XHRcdGZvckVhY2goa2V5cywgZnVuY3Rpb24gKGtleSwgaSkge1xyXG5cdFx0XHRcdFx0XHRyb3V0ZVBhcmFtc1trZXkucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZVVub2J0cnVzaXZlKGUpIHtcclxuXHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUud2hpY2ggPT09IDIpIHJldHVybjtcclxuXHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG5cdFx0dmFyIGFyZ3MgPSBtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIiAmJiBjdXJyZW50VGFyZ2V0LnNlYXJjaCA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFRhcmdldC5zZWFyY2guc2xpY2UoMSkpIDoge307XHJcblx0XHR3aGlsZSAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09IFwiQVwiKSBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5wYXJlbnROb2RlO1xyXG5cdFx0bS5yb3V0ZShjdXJyZW50VGFyZ2V0W20ucm91dGUubW9kZV0uc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gc2V0U2Nyb2xsKCkge1xyXG5cdFx0aWYgKG0ucm91dGUubW9kZSAhPT0gXCJoYXNoXCIgJiYgJGxvY2F0aW9uLmhhc2gpICRsb2NhdGlvbi5oYXNoID0gJGxvY2F0aW9uLmhhc2g7XHJcblx0XHRlbHNlIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhvYmplY3QsIHByZWZpeCkge1xyXG5cdFx0dmFyIGR1cGxpY2F0ZXMgPSB7fTtcclxuXHRcdHZhciBzdHIgPSBbXTtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3A7XHJcblx0XHRcdHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wXTtcclxuXHJcblx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcclxuXHRcdFx0XHRzdHIucHVzaChidWlsZFF1ZXJ5U3RyaW5nKHZhbHVlLCBrZXkpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG5cdFx0XHRcdHZhciBrZXlzID0gW107XHJcblx0XHRcdFx0ZHVwbGljYXRlc1trZXldID0gZHVwbGljYXRlc1trZXldIHx8IHt9O1xyXG5cdFx0XHRcdGZvckVhY2godmFsdWUsIGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XVtpdGVtXSkge1xyXG5cdFx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV1baXRlbV0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRrZXlzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChpdGVtKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0c3RyLnB1c2goa2V5cy5qb2luKFwiJlwiKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0ci5qb2luKFwiJlwiKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIgPT09IFwiXCIgfHwgc3RyID09IG51bGwpIHJldHVybiB7fTtcclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnNsaWNlKDEpO1xyXG5cclxuXHRcdHZhciBwYWlycyA9IHN0ci5zcGxpdChcIiZcIiksIHBhcmFtcyA9IHt9O1xyXG5cdFx0Zm9yRWFjaChwYWlycywgZnVuY3Rpb24gKHN0cmluZykge1xyXG5cdFx0XHR2YXIgcGFpciA9IHN0cmluZy5zcGxpdChcIj1cIik7XHJcblx0XHRcdHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclswXSk7XHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhaXIubGVuZ3RoID09PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pIDogbnVsbDtcclxuXHRcdFx0aWYgKHBhcmFtc1trZXldICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoIWlzQXJyYXkocGFyYW1zW2tleV0pKSBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XV07XHJcblx0XHRcdFx0cGFyYW1zW2tleV0ucHVzaCh2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBwYXJhbXNba2V5XSA9IHZhbHVlO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcztcclxuXHR9XHJcblx0bS5yb3V0ZS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZztcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nO1xyXG5cclxuXHRmdW5jdGlvbiByZXNldChyb290KSB7XHJcblx0XHR2YXIgY2FjaGVLZXkgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHRjbGVhcihyb290LmNoaWxkTm9kZXMsIGNlbGxDYWNoZVtjYWNoZUtleV0pO1xyXG5cdFx0Y2VsbENhY2hlW2NhY2hlS2V5XSA9IHVuZGVmaW5lZDtcclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkO1xyXG5cdH07XHJcblx0ZnVuY3Rpb24gcHJvcGlmeShwcm9taXNlLCBpbml0aWFsVmFsdWUpIHtcclxuXHRcdHZhciBwcm9wID0gbS5wcm9wKGluaXRpYWxWYWx1ZSk7XHJcblx0XHRwcm9taXNlLnRoZW4ocHJvcCk7XHJcblx0XHRwcm9wLnRoZW4gPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkocHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCksIGluaXRpYWxWYWx1ZSk7XHJcblx0XHR9O1xyXG5cdFx0cHJvcFtcImNhdGNoXCJdID0gcHJvcC50aGVuLmJpbmQobnVsbCwgbnVsbCk7XHJcblx0XHRwcm9wW1wiZmluYWxseVwiXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRcdHZhciBfY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtyZXR1cm4gbS5kZWZlcnJlZCgpLnJlc29sdmUoY2FsbGJhY2soKSkucHJvbWlzZTt9O1xyXG5cdFx0XHRyZXR1cm4gcHJvcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHByb3BpZnkoX2NhbGxiYWNrKCkudGhlbihmdW5jdGlvbigpIHtyZXR1cm4gdmFsdWU7fSksIGluaXRpYWxWYWx1ZSk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKHJlYXNvbikge1xyXG5cdFx0XHRcdHJldHVybiBwcm9waWZ5KF9jYWxsYmFjaygpLnRoZW4oZnVuY3Rpb24oKSB7dGhyb3cgbmV3IEVycm9yKHJlYXNvbik7fSksIGluaXRpYWxWYWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wO1xyXG5cdH1cclxuXHQvL1Byb21pei5taXRocmlsLmpzIHwgWm9sbWVpc3RlciB8IE1JVFxyXG5cdC8vYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFByb21pei5qcywgd2hpY2ggZG9lcyBub3QgY29uZm9ybSB0byBQcm9taXNlcy9BKyBmb3IgdHdvIHJlYXNvbnM6XHJcblx0Ly8xKSBgdGhlbmAgY2FsbGJhY2tzIGFyZSBjYWxsZWQgc3luY2hyb25vdXNseSAoYmVjYXVzZSBzZXRUaW1lb3V0IGlzIHRvbyBzbG93LCBhbmQgdGhlIHNldEltbWVkaWF0ZSBwb2x5ZmlsbCBpcyB0b28gYmlnXHJcblx0Ly8yKSB0aHJvd2luZyBzdWJjbGFzc2VzIG9mIEVycm9yIGNhdXNlIHRoZSBlcnJvciB0byBiZSBidWJibGVkIHVwIGluc3RlYWQgb2YgdHJpZ2dlcmluZyByZWplY3Rpb24gKGJlY2F1c2UgdGhlIHNwZWMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlIGltcG9ydGFudCB1c2UgY2FzZSBvZiBkZWZhdWx0IGJyb3dzZXIgZXJyb3IgaGFuZGxpbmcsIGkuZS4gbWVzc2FnZSB3LyBsaW5lIG51bWJlcilcclxuXHRmdW5jdGlvbiBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0dmFyIFJFU09MVklORyA9IDEsIFJFSkVDVElORyA9IDIsIFJFU09MVkVEID0gMywgUkVKRUNURUQgPSA0O1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLCBzdGF0ZSA9IDAsIHByb21pc2VWYWx1ZSA9IDAsIG5leHQgPSBbXTtcclxuXHJcblx0XHRzZWxmLnByb21pc2UgPSB7fTtcclxuXHJcblx0XHRzZWxmLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spXHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bmV4dC5wdXNoKGRlZmVycmVkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBmaW5pc2godHlwZSkge1xyXG5cdFx0XHRzdGF0ZSA9IHR5cGUgfHwgUkVKRUNURUQ7XHJcblx0XHRcdG5leHQubWFwKGZ1bmN0aW9uKGRlZmVycmVkKSB7XHJcblx0XHRcdFx0c3RhdGUgPT09IFJFU09MVkVEID8gZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpIDogZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRoZW5uYWJsZSh0aGVuLCBzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaywgbm90VGhlbm5hYmxlQ2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKCgocHJvbWlzZVZhbHVlICE9IG51bGwgJiYgaXNPYmplY3QocHJvbWlzZVZhbHVlKSkgfHwgaXNGdW5jdGlvbihwcm9taXNlVmFsdWUpKSAmJiBpc0Z1bmN0aW9uKHRoZW4pKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGNvdW50IHByb3RlY3RzIGFnYWluc3QgYWJ1c2UgY2FsbHMgZnJvbSBzcGVjIGNoZWNrZXJcclxuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0XHR0aGVuLmNhbGwocHJvbWlzZVZhbHVlLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0c3VjY2Vzc0NhbGxiYWNrKCk7XHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vdFRoZW5uYWJsZUNhbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdHJldHVybiBmaXJlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdGZpcmUoKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIGlzRnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrKSkge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RJTkcgJiYgaXNGdW5jdGlvbihmYWlsdXJlQ2FsbGJhY2spKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGZhaWx1cmVDYWxsYmFjayhwcm9taXNlVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmluaXNoKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goUkVTT0xWRUQpO1xyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiAhZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC8gRXJyb3IvKSkge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdFx0XHR0aHJvdyBlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHJcblx0XHRmdW5jdGlvbiBzeW5jaHJvbml6ZXIocG9zLCByZXNvbHZlZCkge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRyZXN1bHRzW3Bvc10gPSB2YWx1ZTtcclxuXHRcdFx0XHRpZiAoIXJlc29sdmVkKSBtZXRob2QgPSBcInJlamVjdFwiO1xyXG5cdFx0XHRcdGlmICgtLW91dHN0YW5kaW5nID09PSAwKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlKHJlc3VsdHMpO1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWRbbWV0aG9kXShyZXN1bHRzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcclxuXHRcdHZhciBvdXRzdGFuZGluZyA9IGFyZ3MubGVuZ3RoO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkob3V0c3RhbmRpbmcpO1xyXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3JFYWNoKGFyZ3MsIGZ1bmN0aW9uIChhcmcsIGkpIHtcclxuXHRcdFx0XHRhcmcudGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcblx0fTtcclxuXHRmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH1cclxuXHJcblx0ZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XHJcblx0XHRpZiAob3B0aW9ucy5kYXRhVHlwZSAmJiBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgY2FsbGJhY2tLZXkgPSBcIm1pdGhyaWxfY2FsbGJhY2tfXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpKS50b1N0cmluZygzNilcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQuc3JjID0gb3B0aW9ucy51cmxcclxuXHRcdFx0XHQrIChvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA+IDAgPyBcIiZcIiA6IFwiP1wiKVxyXG5cdFx0XHRcdCsgKG9wdGlvbnMuY2FsbGJhY2tLZXkgPyBvcHRpb25zLmNhbGxiYWNrS2V5IDogXCJjYWxsYmFja1wiKVxyXG5cdFx0XHRcdCsgXCI9XCIgKyBjYWxsYmFja0tleVxyXG5cdFx0XHRcdCsgXCImXCIgKyBidWlsZFF1ZXJ5U3RyaW5nKG9wdGlvbnMuZGF0YSB8fCB7fSk7XHJcblx0XHRcdCRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0eGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlLCBvcHRpb25zLnVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xyXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgb3B0aW9ucy5vbmxvYWQoe3R5cGU6IFwibG9hZFwiLCB0YXJnZXQ6IHhocn0pO1xyXG5cdFx0XHRcdFx0ZWxzZSBvcHRpb25zLm9uZXJyb3Ioe3R5cGU6IFwiZXJyb3JcIiwgdGFyZ2V0OiB4aHJ9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChvcHRpb25zLnNlcmlhbGl6ZSA9PT0gSlNPTi5zdHJpbmdpZnkgJiYgb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMubWV0aG9kICE9PSBcIkdFVFwiKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGlzRnVuY3Rpb24ob3B0aW9ucy5jb25maWcpKSB7XHJcblx0XHRcdFx0dmFyIG1heWJlWGhyID0gb3B0aW9ucy5jb25maWcoeGhyLCBvcHRpb25zKTtcclxuXHRcdFx0XHRpZiAobWF5YmVYaHIgIT0gbnVsbCkgeGhyID0gbWF5YmVYaHI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXRhID0gb3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgfHwgIW9wdGlvbnMuZGF0YSA/IFwiXCIgOiBvcHRpb25zLmRhdGE7XHJcblx0XHRcdGlmIChkYXRhICYmICghaXNTdHJpbmcoZGF0YSkgJiYgZGF0YS5jb25zdHJ1Y3RvciAhPT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJlcXVlc3QgZGF0YSBzaG91bGQgYmUgZWl0aGVyIGJlIGEgc3RyaW5nIG9yIEZvcm1EYXRhLiBDaGVjayB0aGUgYHNlcmlhbGl6ZWAgb3B0aW9uIGluIGBtLnJlcXVlc3RgXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHhoci5zZW5kKGRhdGEpO1xyXG5cdFx0XHRyZXR1cm4geGhyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYmluZERhdGEoeGhyT3B0aW9ucywgZGF0YSwgc2VyaWFsaXplKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZSAhPT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBwcmVmaXggPSB4aHJPcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiO1xyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpO1xyXG5cdFx0XHR4aHJPcHRpb25zLnVybCA9IHhock9wdGlvbnMudXJsICsgKHF1ZXJ5c3RyaW5nID8gcHJlZml4ICsgcXVlcnlzdHJpbmcgOiBcIlwiKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemVVcmwodXJsLCBkYXRhKSB7XHJcblx0XHR2YXIgdG9rZW5zID0gdXJsLm1hdGNoKC86W2Etel1cXHcrL2dpKTtcclxuXHRcdGlmICh0b2tlbnMgJiYgZGF0YSkge1xyXG5cdFx0XHRmb3JFYWNoKHRva2VucywgZnVuY3Rpb24gKHRva2VuKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IHRva2VuLnNsaWNlKDEpO1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2VuLCBkYXRhW2tleV0pO1xyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2tleV07XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVybDtcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHR2YXIgaXNKU09OUCA9IHhock9wdGlvbnMuZGF0YVR5cGUgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCJcclxuXHRcdHZhciBzZXJpYWxpemUgPSB4aHJPcHRpb25zLnNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuc2VyaWFsaXplIHx8IEpTT04uc3RyaW5naWZ5O1xyXG5cdFx0dmFyIGRlc2VyaWFsaXplID0geGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuZGVzZXJpYWxpemUgfHwgSlNPTi5wYXJzZTtcclxuXHRcdHZhciBleHRyYWN0ID0gaXNKU09OUCA/IGZ1bmN0aW9uKGpzb25wKSB7IHJldHVybiBqc29ucC5yZXNwb25zZVRleHQgfSA6IHhock9wdGlvbnMuZXh0cmFjdCB8fCBmdW5jdGlvbih4aHIpIHtcclxuXHRcdFx0aWYgKHhoci5yZXNwb25zZVRleHQubGVuZ3RoID09PSAwICYmIGRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0eGhyT3B0aW9ucy5tZXRob2QgPSAoeGhyT3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIikudG9VcHBlckNhc2UoKTtcclxuXHRcdHhock9wdGlvbnMudXJsID0gcGFyYW1ldGVyaXplVXJsKHhock9wdGlvbnMudXJsLCB4aHJPcHRpb25zLmRhdGEpO1xyXG5cdFx0eGhyT3B0aW9ucyA9IGJpbmREYXRhKHhock9wdGlvbnMsIHhock9wdGlvbnMuZGF0YSwgc2VyaWFsaXplKTtcclxuXHRcdHhock9wdGlvbnMub25sb2FkID0geGhyT3B0aW9ucy5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRcdHZhciB1bndyYXAgPSAoZS50eXBlID09PSBcImxvYWRcIiA/IHhock9wdGlvbnMudW53cmFwU3VjY2VzcyA6IHhock9wdGlvbnMudW53cmFwRXJyb3IpIHx8IGlkZW50aXR5O1xyXG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHVud3JhcChkZXNlcmlhbGl6ZShleHRyYWN0KGUudGFyZ2V0LCB4aHJPcHRpb25zKSksIGUudGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZS50eXBlID09PSBcImxvYWRcIikge1xyXG5cdFx0XHRcdFx0aWYgKGlzQXJyYXkocmVzcG9uc2UpICYmIHhock9wdGlvbnMudHlwZSkge1xyXG5cdFx0XHRcdFx0XHRmb3JFYWNoKHJlc3BvbnNlLCBmdW5jdGlvbiAocmVzLCBpKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2VbaV0gPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlcyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh4aHJPcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGRlZmVycmVkW2UudHlwZSA9PT0gXCJsb2FkXCIgPyBcInJlc29sdmVcIiA6IFwicmVqZWN0XCJdKHJlc3BvbnNlKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uZW5kQ29tcHV0YXRpb24oKVxyXG5cdFx0fVxyXG5cclxuXHRcdGFqYXgoeGhyT3B0aW9ucyk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlLCB4aHJPcHRpb25zLmluaXRpYWxWYWx1ZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuXHR9O1xyXG5cclxuXHQvL3Rlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24obW9jaykge1xyXG5cdFx0aW5pdGlhbGl6ZSh3aW5kb3cgPSBtb2NrIHx8IHdpbmRvdyk7XHJcblx0XHRyZXR1cm4gd2luZG93O1xyXG5cdH07XHJcblx0Ly9mb3IgaW50ZXJuYWwgdGVzdGluZyBvbmx5LCBkbyBub3QgdXNlIGBtLmRlcHMuZmFjdG9yeWBcclxuXHRtLmRlcHMuZmFjdG9yeSA9IGFwcDtcclxuXHJcblx0cmV0dXJuIG07XHJcbn0pKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUgIT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBtO1xyXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbSB9KTtcclxuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZ3JlLzE2NTAyOTRcbnZhciBlYXNpbmcgPSB7XG4gIGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xuICB9LFxufTtcblxuZnVuY3Rpb24gbWFrZVBpZWNlKGssIHBpZWNlLCBpbnZlcnQpIHtcbiAgdmFyIGtleSA9IGludmVydCA/IHV0aWwuaW52ZXJ0S2V5KGspIDogaztcbiAgcmV0dXJuIHtcbiAgICBrZXk6IGtleSxcbiAgICBwb3M6IHV0aWwua2V5MnBvcyhrZXkpLFxuICAgIHJvbGU6IHBpZWNlLnJvbGUsXG4gICAgY29sb3I6IHBpZWNlLmNvbG9yXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNhbWVQaWVjZShwMSwgcDIpIHtcbiAgcmV0dXJuIHAxLnJvbGUgPT09IHAyLnJvbGUgJiYgcDEuY29sb3IgPT09IHAyLmNvbG9yO1xufVxuXG5mdW5jdGlvbiBjbG9zZXIocGllY2UsIHBpZWNlcykge1xuICByZXR1cm4gcGllY2VzLnNvcnQoZnVuY3Rpb24ocDEsIHAyKSB7XG4gICAgcmV0dXJuIHV0aWwuZGlzdGFuY2UocGllY2UucG9zLCBwMS5wb3MpIC0gdXRpbC5kaXN0YW5jZShwaWVjZS5wb3MsIHAyLnBvcyk7XG4gIH0pWzBdO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlUGxhbihwcmV2LCBjdXJyZW50KSB7XG4gIHZhciBib3VuZHMgPSBjdXJyZW50LmJvdW5kcygpLFxuICAgIHdpZHRoID0gYm91bmRzLndpZHRoIC8gOCxcbiAgICBoZWlnaHQgPSBib3VuZHMuaGVpZ2h0IC8gOCxcbiAgICBhbmltcyA9IHt9LFxuICAgIGFuaW1lZE9yaWdzID0gW10sXG4gICAgZmFkaW5ncyA9IFtdLFxuICAgIG1pc3NpbmdzID0gW10sXG4gICAgbmV3cyA9IFtdLFxuICAgIGludmVydCA9IHByZXYub3JpZW50YXRpb24gIT09IGN1cnJlbnQub3JpZW50YXRpb24sXG4gICAgcHJlUGllY2VzID0ge30sXG4gICAgd2hpdGUgPSBjdXJyZW50Lm9yaWVudGF0aW9uID09PSAnd2hpdGUnO1xuICBmb3IgKHZhciBwayBpbiBwcmV2LnBpZWNlcykge1xuICAgIHZhciBwaWVjZSA9IG1ha2VQaWVjZShwaywgcHJldi5waWVjZXNbcGtdLCBpbnZlcnQpO1xuICAgIHByZVBpZWNlc1twaWVjZS5rZXldID0gcGllY2U7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB1dGlsLmFsbEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gdXRpbC5hbGxLZXlzW2ldO1xuICAgIGlmIChrZXkgIT09IGN1cnJlbnQubW92YWJsZS5kcm9wcGVkWzFdKSB7XG4gICAgICB2YXIgY3VyUCA9IGN1cnJlbnQucGllY2VzW2tleV07XG4gICAgICB2YXIgcHJlUCA9IHByZVBpZWNlc1trZXldO1xuICAgICAgaWYgKGN1clApIHtcbiAgICAgICAgaWYgKHByZVApIHtcbiAgICAgICAgICBpZiAoIXNhbWVQaWVjZShjdXJQLCBwcmVQKSkge1xuICAgICAgICAgICAgbWlzc2luZ3MucHVzaChwcmVQKTtcbiAgICAgICAgICAgIG5ld3MucHVzaChtYWtlUGllY2Uoa2V5LCBjdXJQLCBmYWxzZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgbmV3cy5wdXNoKG1ha2VQaWVjZShrZXksIGN1clAsIGZhbHNlKSk7XG4gICAgICB9IGVsc2UgaWYgKHByZVApXG4gICAgICAgIG1pc3NpbmdzLnB1c2gocHJlUCk7XG4gICAgfVxuICB9XG4gIG5ld3MuZm9yRWFjaChmdW5jdGlvbihuZXdQKSB7XG4gICAgdmFyIHByZVAgPSBjbG9zZXIobmV3UCwgbWlzc2luZ3MuZmlsdGVyKHV0aWwucGFydGlhbChzYW1lUGllY2UsIG5ld1ApKSk7XG4gICAgaWYgKHByZVApIHtcbiAgICAgIHZhciBvcmlnID0gd2hpdGUgPyBwcmVQLnBvcyA6IG5ld1AucG9zO1xuICAgICAgdmFyIGRlc3QgPSB3aGl0ZSA/IG5ld1AucG9zIDogcHJlUC5wb3M7XG4gICAgICB2YXIgdmVjdG9yID0gWyhvcmlnWzBdIC0gZGVzdFswXSkgKiB3aWR0aCwgKGRlc3RbMV0gLSBvcmlnWzFdKSAqIGhlaWdodF07XG4gICAgICBhbmltc1tuZXdQLmtleV0gPSBbdmVjdG9yLCB2ZWN0b3JdO1xuICAgICAgYW5pbWVkT3JpZ3MucHVzaChwcmVQLmtleSk7XG4gICAgfVxuICB9KTtcbiAgbWlzc2luZ3MuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgaWYgKFxuICAgICAgcC5rZXkgIT09IGN1cnJlbnQubW92YWJsZS5kcm9wcGVkWzBdICYmXG4gICAgICAhdXRpbC5jb250YWluc1goYW5pbWVkT3JpZ3MsIHAua2V5KSAmJlxuICAgICAgIShjdXJyZW50Lml0ZW1zID8gY3VycmVudC5pdGVtcy5yZW5kZXIocC5wb3MsIHAua2V5KSA6IGZhbHNlKVxuICAgIClcbiAgICAgIGZhZGluZ3MucHVzaCh7XG4gICAgICAgIHBpZWNlOiBwLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBhbmltczogYW5pbXMsXG4gICAgZmFkaW5nczogZmFkaW5nc1xuICB9O1xufVxuXG5mdW5jdGlvbiByb3VuZEJ5KG4sIGJ5KSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKG4gKiBieSkgLyBieTtcbn1cblxuZnVuY3Rpb24gZ28oZGF0YSkge1xuICBpZiAoIWRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuc3RhcnQpIHJldHVybjsgLy8gYW5pbWF0aW9uIHdhcyBjYW5jZWxlZFxuICB2YXIgcmVzdCA9IDEgLSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBkYXRhLmFuaW1hdGlvbi5jdXJyZW50LnN0YXJ0KSAvIGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuZHVyYXRpb247XG4gIGlmIChyZXN0IDw9IDApIHtcbiAgICBkYXRhLmFuaW1hdGlvbi5jdXJyZW50ID0ge307XG4gICAgZGF0YS5yZW5kZXIoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZWFzZSA9IGVhc2luZy5lYXNlSW5PdXRDdWJpYyhyZXN0KTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YS5hbmltYXRpb24uY3VycmVudC5hbmltcykge1xuICAgICAgdmFyIGNmZyA9IGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuYW5pbXNba2V5XTtcbiAgICAgIGNmZ1sxXSA9IFtyb3VuZEJ5KGNmZ1swXVswXSAqIGVhc2UsIDEwKSwgcm91bmRCeShjZmdbMF1bMV0gKiBlYXNlLCAxMCldO1xuICAgIH1cbiAgICBmb3IgKHZhciBpIGluIGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuZmFkaW5ncykge1xuICAgICAgZGF0YS5hbmltYXRpb24uY3VycmVudC5mYWRpbmdzW2ldLm9wYWNpdHkgPSByb3VuZEJ5KGVhc2UsIDEwMCk7XG4gICAgfVxuICAgIGRhdGEucmVuZGVyKCk7XG4gICAgdXRpbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICBnbyhkYXRhKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhbmltYXRlKHRyYW5zZm9ybWF0aW9uLCBkYXRhKSB7XG4gIC8vIGNsb25lIGRhdGFcbiAgdmFyIHByZXYgPSB7XG4gICAgb3JpZW50YXRpb246IGRhdGEub3JpZW50YXRpb24sXG4gICAgcGllY2VzOiB7fVxuICB9O1xuICAvLyBjbG9uZSBwaWVjZXNcbiAgZm9yICh2YXIga2V5IGluIGRhdGEucGllY2VzKSB7XG4gICAgcHJldi5waWVjZXNba2V5XSA9IHtcbiAgICAgIHJvbGU6IGRhdGEucGllY2VzW2tleV0ucm9sZSxcbiAgICAgIGNvbG9yOiBkYXRhLnBpZWNlc1trZXldLmNvbG9yXG4gICAgfTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJhbnNmb3JtYXRpb24oKTtcbiAgaWYgKGRhdGEuYW5pbWF0aW9uLmVuYWJsZWQpIHtcbiAgICB2YXIgcGxhbiA9IGNvbXB1dGVQbGFuKHByZXYsIGRhdGEpO1xuICAgIGlmIChPYmplY3Qua2V5cyhwbGFuLmFuaW1zKS5sZW5ndGggPiAwIHx8IHBsYW4uZmFkaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgYWxyZWFkeVJ1bm5pbmcgPSBkYXRhLmFuaW1hdGlvbi5jdXJyZW50LnN0YXJ0O1xuICAgICAgZGF0YS5hbmltYXRpb24uY3VycmVudCA9IHtcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICBkdXJhdGlvbjogZGF0YS5hbmltYXRpb24uZHVyYXRpb24sXG4gICAgICAgIGFuaW1zOiBwbGFuLmFuaW1zLFxuICAgICAgICBmYWRpbmdzOiBwbGFuLmZhZGluZ3NcbiAgICAgIH07XG4gICAgICBpZiAoIWFscmVhZHlSdW5uaW5nKSBnbyhkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZG9uJ3QgYW5pbWF0ZSwganVzdCByZW5kZXIgcmlnaHQgYXdheVxuICAgICAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gYW5pbWF0aW9ucyBhcmUgbm93IGRpc2FibGVkXG4gICAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyB0cmFuc2Zvcm1hdGlvbiBpcyBhIGZ1bmN0aW9uXG4vLyBhY2NlcHRzIGJvYXJkIGRhdGEgYW5kIGFueSBudW1iZXIgb2YgYXJndW1lbnRzLFxuLy8gYW5kIG11dGF0ZXMgdGhlIGJvYXJkLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0cmFuc2Zvcm1hdGlvbiwgZGF0YSwgc2tpcCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYW5zZm9ybWF0aW9uQXJncyA9IFtkYXRhXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgaWYgKCFkYXRhLnJlbmRlcikgcmV0dXJuIHRyYW5zZm9ybWF0aW9uLmFwcGx5KG51bGwsIHRyYW5zZm9ybWF0aW9uQXJncyk7XG4gICAgZWxzZSBpZiAoZGF0YS5hbmltYXRpb24uZW5hYmxlZCAmJiAhc2tpcClcbiAgICAgIHJldHVybiBhbmltYXRlKHV0aWwucGFydGlhbEFwcGx5KHRyYW5zZm9ybWF0aW9uLCB0cmFuc2Zvcm1hdGlvbkFyZ3MpLCBkYXRhKTtcbiAgICBlbHNlIHtcbiAgICAgIHZhciByZXN1bHQgPSB0cmFuc2Zvcm1hdGlvbi5hcHBseShudWxsLCB0cmFuc2Zvcm1hdGlvbkFyZ3MpO1xuICAgICAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xufTtcbiIsInZhciBib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG5cbiAgcmV0dXJuIHtcbiAgICBzZXQ6IGNvbnRyb2xsZXIuc2V0LFxuICAgIHRvZ2dsZU9yaWVudGF0aW9uOiBjb250cm9sbGVyLnRvZ2dsZU9yaWVudGF0aW9uLFxuICAgIGdldE9yaWVudGF0aW9uOiBjb250cm9sbGVyLmdldE9yaWVudGF0aW9uLFxuICAgIGdldFBpZWNlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29udHJvbGxlci5kYXRhLnBpZWNlcztcbiAgICB9LFxuICAgIGdldE1hdGVyaWFsRGlmZjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYm9hcmQuZ2V0TWF0ZXJpYWxEaWZmKGNvbnRyb2xsZXIuZGF0YSk7XG4gICAgfSxcbiAgICBnZXRGZW46IGNvbnRyb2xsZXIuZ2V0RmVuLFxuICAgIG1vdmU6IGNvbnRyb2xsZXIuYXBpTW92ZSxcbiAgICBuZXdQaWVjZTogY29udHJvbGxlci5hcGlOZXdQaWVjZSxcbiAgICBzZXRQaWVjZXM6IGNvbnRyb2xsZXIuc2V0UGllY2VzLFxuICAgIHNldENoZWNrOiBjb250cm9sbGVyLnNldENoZWNrLFxuICAgIHBsYXlQcmVtb3ZlOiBjb250cm9sbGVyLnBsYXlQcmVtb3ZlLFxuICAgIHBsYXlQcmVkcm9wOiBjb250cm9sbGVyLnBsYXlQcmVkcm9wLFxuICAgIGNhbmNlbFByZW1vdmU6IGNvbnRyb2xsZXIuY2FuY2VsUHJlbW92ZSxcbiAgICBjYW5jZWxQcmVkcm9wOiBjb250cm9sbGVyLmNhbmNlbFByZWRyb3AsXG4gICAgY2FuY2VsTW92ZTogY29udHJvbGxlci5jYW5jZWxNb3ZlLFxuICAgIHN0b3A6IGNvbnRyb2xsZXIuc3RvcCxcbiAgICBleHBsb2RlOiBjb250cm9sbGVyLmV4cGxvZGUsXG4gICAgc2V0QXV0b1NoYXBlczogY29udHJvbGxlci5zZXRBdXRvU2hhcGVzLFxuICAgIHNldFNoYXBlczogY29udHJvbGxlci5zZXRTaGFwZXMsXG4gICAgZGF0YTogY29udHJvbGxlci5kYXRhIC8vIGRpcmVjdGx5IGV4cG9zZXMgY2hlc3Nncm91bmQgc3RhdGUgZm9yIG1vcmUgbWVzc2luZyBhcm91bmRcbiAgfTtcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHByZW1vdmUgPSByZXF1aXJlKCcuL3ByZW1vdmUnKTtcbnZhciBhbmltID0gcmVxdWlyZSgnLi9hbmltJyk7XG52YXIgaG9sZCA9IHJlcXVpcmUoJy4vaG9sZCcpO1xuXG5mdW5jdGlvbiBjYWxsVXNlckZ1bmN0aW9uKGYpIHtcbiAgc2V0VGltZW91dChmLCAxKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlT3JpZW50YXRpb24oZGF0YSkge1xuICBkYXRhLm9yaWVudGF0aW9uID0gdXRpbC5vcHBvc2l0ZShkYXRhLm9yaWVudGF0aW9uKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoZGF0YSkge1xuICBkYXRhLmxhc3RNb3ZlID0gbnVsbDtcbiAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIHVuc2V0UHJlbW92ZShkYXRhKTtcbiAgdW5zZXRQcmVkcm9wKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBzZXRQaWVjZXMoZGF0YSwgcGllY2VzKSB7XG4gIE9iamVjdC5rZXlzKHBpZWNlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAocGllY2VzW2tleV0pIGRhdGEucGllY2VzW2tleV0gPSBwaWVjZXNba2V5XTtcbiAgICBlbHNlIGRlbGV0ZSBkYXRhLnBpZWNlc1trZXldO1xuICB9KTtcbiAgZGF0YS5tb3ZhYmxlLmRyb3BwZWQgPSBbXTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hlY2soZGF0YSwgY29sb3IpIHtcbiAgdmFyIGNoZWNrQ29sb3IgPSBjb2xvciB8fCBkYXRhLnR1cm5Db2xvcjtcbiAgT2JqZWN0LmtleXMoZGF0YS5waWVjZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGRhdGEucGllY2VzW2tleV0uY29sb3IgPT09IGNoZWNrQ29sb3IgJiYgZGF0YS5waWVjZXNba2V5XS5yb2xlID09PSAna2luZycpIGRhdGEuY2hlY2sgPSBrZXk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcmVtb3ZlKGRhdGEsIG9yaWcsIGRlc3QpIHtcbiAgdW5zZXRQcmVkcm9wKGRhdGEpO1xuICBkYXRhLnByZW1vdmFibGUuY3VycmVudCA9IFtvcmlnLCBkZXN0XTtcbiAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5wcmVtb3ZhYmxlLmV2ZW50cy5zZXQsIG9yaWcsIGRlc3QpKTtcbn1cblxuZnVuY3Rpb24gdW5zZXRQcmVtb3ZlKGRhdGEpIHtcbiAgaWYgKGRhdGEucHJlbW92YWJsZS5jdXJyZW50KSB7XG4gICAgZGF0YS5wcmVtb3ZhYmxlLmN1cnJlbnQgPSBudWxsO1xuICAgIGNhbGxVc2VyRnVuY3Rpb24oZGF0YS5wcmVtb3ZhYmxlLmV2ZW50cy51bnNldCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UHJlZHJvcChkYXRhLCByb2xlLCBrZXkpIHtcbiAgdW5zZXRQcmVtb3ZlKGRhdGEpO1xuICBkYXRhLnByZWRyb3BwYWJsZS5jdXJyZW50ID0ge1xuICAgIHJvbGU6IHJvbGUsXG4gICAga2V5OiBrZXlcbiAgfTtcbiAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5wcmVkcm9wcGFibGUuZXZlbnRzLnNldCwgcm9sZSwga2V5KSk7XG59XG5cbmZ1bmN0aW9uIHVuc2V0UHJlZHJvcChkYXRhKSB7XG4gIGlmIChkYXRhLnByZWRyb3BwYWJsZS5jdXJyZW50LmtleSkge1xuICAgIGRhdGEucHJlZHJvcHBhYmxlLmN1cnJlbnQgPSB7fTtcbiAgICBjYWxsVXNlckZ1bmN0aW9uKGRhdGEucHJlZHJvcHBhYmxlLmV2ZW50cy51bnNldCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5QXV0b0Nhc3RsZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIGlmICghZGF0YS5hdXRvQ2FzdGxlKSByZXR1cm47XG4gIHZhciBraW5nID0gZGF0YS5waWVjZXNbZGVzdF07XG4gIGlmIChraW5nLnJvbGUgIT09ICdraW5nJykgcmV0dXJuO1xuICB2YXIgb3JpZ1BvcyA9IHV0aWwua2V5MnBvcyhvcmlnKTtcbiAgaWYgKG9yaWdQb3NbMF0gIT09IDUpIHJldHVybjtcbiAgaWYgKG9yaWdQb3NbMV0gIT09IDEgJiYgb3JpZ1Bvc1sxXSAhPT0gOCkgcmV0dXJuO1xuICB2YXIgZGVzdFBvcyA9IHV0aWwua2V5MnBvcyhkZXN0KSxcbiAgICBvbGRSb29rUG9zLCBuZXdSb29rUG9zLCBuZXdLaW5nUG9zO1xuICBpZiAoZGVzdFBvc1swXSA9PT0gNyB8fCBkZXN0UG9zWzBdID09PSA4KSB7XG4gICAgb2xkUm9va1BvcyA9IHV0aWwucG9zMmtleShbOCwgb3JpZ1Bvc1sxXV0pO1xuICAgIG5ld1Jvb2tQb3MgPSB1dGlsLnBvczJrZXkoWzYsIG9yaWdQb3NbMV1dKTtcbiAgICBuZXdLaW5nUG9zID0gdXRpbC5wb3Mya2V5KFs3LCBvcmlnUG9zWzFdXSk7XG4gIH0gZWxzZSBpZiAoZGVzdFBvc1swXSA9PT0gMyB8fCBkZXN0UG9zWzBdID09PSAxKSB7XG4gICAgb2xkUm9va1BvcyA9IHV0aWwucG9zMmtleShbMSwgb3JpZ1Bvc1sxXV0pO1xuICAgIG5ld1Jvb2tQb3MgPSB1dGlsLnBvczJrZXkoWzQsIG9yaWdQb3NbMV1dKTtcbiAgICBuZXdLaW5nUG9zID0gdXRpbC5wb3Mya2V5KFszLCBvcmlnUG9zWzFdXSk7XG4gIH0gZWxzZSByZXR1cm47XG4gIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgZGVsZXRlIGRhdGEucGllY2VzW2Rlc3RdO1xuICBkZWxldGUgZGF0YS5waWVjZXNbb2xkUm9va1Bvc107XG4gIGRhdGEucGllY2VzW25ld0tpbmdQb3NdID0ge1xuICAgIHJvbGU6ICdraW5nJyxcbiAgICBjb2xvcjoga2luZy5jb2xvclxuICB9O1xuICBkYXRhLnBpZWNlc1tuZXdSb29rUG9zXSA9IHtcbiAgICByb2xlOiAncm9vaycsXG4gICAgY29sb3I6IGtpbmcuY29sb3JcbiAgfTtcbn1cblxuZnVuY3Rpb24gYmFzZU1vdmUoZGF0YSwgb3JpZywgZGVzdCkge1xuICB2YXIgc3VjY2VzcyA9IGFuaW0oZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9yaWcgPT09IGRlc3QgfHwgIWRhdGEucGllY2VzW29yaWddKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGNhcHR1cmVkID0gKFxuICAgICAgZGF0YS5waWVjZXNbZGVzdF0gJiZcbiAgICAgIGRhdGEucGllY2VzW2Rlc3RdLmNvbG9yICE9PSBkYXRhLnBpZWNlc1tvcmlnXS5jb2xvclxuICAgICkgPyBkYXRhLnBpZWNlc1tkZXN0XSA6IG51bGw7XG4gICAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5ldmVudHMubW92ZSwgb3JpZywgZGVzdCwgY2FwdHVyZWQpKTtcbiAgICBkYXRhLnBpZWNlc1tkZXN0XSA9IGRhdGEucGllY2VzW29yaWddO1xuICAgIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgICBkYXRhLmxhc3RNb3ZlID0gW29yaWcsIGRlc3RdO1xuICAgIGRhdGEuY2hlY2sgPSBudWxsO1xuICAgIHRyeUF1dG9DYXN0bGUoZGF0YSwgb3JpZywgZGVzdCk7XG4gICAgY2FsbFVzZXJGdW5jdGlvbihkYXRhLmV2ZW50cy5jaGFuZ2UpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LCBkYXRhKSgpO1xuICBpZiAoc3VjY2VzcykgZGF0YS5tb3ZhYmxlLmRyb3BwZWQgPSBbXTtcbiAgcmV0dXJuIHN1Y2Nlc3M7XG59XG5cbmZ1bmN0aW9uIGJhc2VOZXdQaWVjZShkYXRhLCBwaWVjZSwga2V5KSB7XG4gIGlmIChkYXRhLnBpZWNlc1trZXldKSByZXR1cm4gZmFsc2U7XG4gIGNhbGxVc2VyRnVuY3Rpb24odXRpbC5wYXJ0aWFsKGRhdGEuZXZlbnRzLmRyb3BOZXdQaWVjZSwgcGllY2UsIGtleSkpO1xuICBkYXRhLnBpZWNlc1trZXldID0gcGllY2U7XG4gIGRhdGEubGFzdE1vdmUgPSBba2V5LCBrZXldO1xuICBkYXRhLmNoZWNrID0gbnVsbDtcbiAgY2FsbFVzZXJGdW5jdGlvbihkYXRhLmV2ZW50cy5jaGFuZ2UpO1xuICBkYXRhLm1vdmFibGUuZHJvcHBlZCA9IFtdO1xuICBkYXRhLm1vdmFibGUuZGVzdHMgPSB7fTtcbiAgZGF0YS50dXJuQ29sb3IgPSB1dGlsLm9wcG9zaXRlKGRhdGEudHVybkNvbG9yKTtcbiAgZGF0YS5yZW5kZXJSQUYoKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGJhc2VVc2VyTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIHZhciByZXN1bHQgPSBiYXNlTW92ZShkYXRhLCBvcmlnLCBkZXN0KTtcbiAgaWYgKHJlc3VsdCkge1xuICAgIGRhdGEubW92YWJsZS5kZXN0cyA9IHt9O1xuICAgIGRhdGEudHVybkNvbG9yID0gdXRpbC5vcHBvc2l0ZShkYXRhLnR1cm5Db2xvcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYXBpTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIHJldHVybiBiYXNlTW92ZShkYXRhLCBvcmlnLCBkZXN0KTtcbn1cblxuZnVuY3Rpb24gYXBpTmV3UGllY2UoZGF0YSwgcGllY2UsIGtleSkge1xuICByZXR1cm4gYmFzZU5ld1BpZWNlKGRhdGEsIHBpZWNlLCBrZXkpO1xufVxuXG5mdW5jdGlvbiB1c2VyTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIGlmICghZGVzdCkge1xuICAgIGhvbGQuY2FuY2VsKCk7XG4gICAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gICAgaWYgKGRhdGEubW92YWJsZS5kcm9wT2ZmID09PSAndHJhc2gnKSB7XG4gICAgICBkZWxldGUgZGF0YS5waWVjZXNbb3JpZ107XG4gICAgICBjYWxsVXNlckZ1bmN0aW9uKGRhdGEuZXZlbnRzLmNoYW5nZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNhbk1vdmUoZGF0YSwgb3JpZywgZGVzdCkpIHtcbiAgICBpZiAoYmFzZVVzZXJNb3ZlKGRhdGEsIG9yaWcsIGRlc3QpKSB7XG4gICAgICB2YXIgaG9sZFRpbWUgPSBob2xkLnN0b3AoKTtcbiAgICAgIHNldFNlbGVjdGVkKGRhdGEsIG51bGwpO1xuICAgICAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5tb3ZhYmxlLmV2ZW50cy5hZnRlciwgb3JpZywgZGVzdCwge1xuICAgICAgICBwcmVtb3ZlOiBmYWxzZSxcbiAgICAgICAgaG9sZFRpbWU6IGhvbGRUaW1lXG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2FuUHJlbW92ZShkYXRhLCBvcmlnLCBkZXN0KSkge1xuICAgIHNldFByZW1vdmUoZGF0YSwgb3JpZywgZGVzdCk7XG4gICAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIH0gZWxzZSBpZiAoaXNNb3ZhYmxlKGRhdGEsIGRlc3QpIHx8IGlzUHJlbW92YWJsZShkYXRhLCBkZXN0KSkge1xuICAgIHNldFNlbGVjdGVkKGRhdGEsIGRlc3QpO1xuICAgIGhvbGQuc3RhcnQoKTtcbiAgfSBlbHNlIHNldFNlbGVjdGVkKGRhdGEsIG51bGwpO1xufVxuXG5mdW5jdGlvbiBkcm9wTmV3UGllY2UoZGF0YSwgb3JpZywgZGVzdCkge1xuICBpZiAoY2FuRHJvcChkYXRhLCBvcmlnLCBkZXN0KSkge1xuICAgIHZhciBwaWVjZSA9IGRhdGEucGllY2VzW29yaWddO1xuICAgIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgICBiYXNlTmV3UGllY2UoZGF0YSwgcGllY2UsIGRlc3QpO1xuICAgIGRhdGEubW92YWJsZS5kcm9wcGVkID0gW107XG4gICAgY2FsbFVzZXJGdW5jdGlvbih1dGlsLnBhcnRpYWwoZGF0YS5tb3ZhYmxlLmV2ZW50cy5hZnRlck5ld1BpZWNlLCBwaWVjZS5yb2xlLCBkZXN0LCB7XG4gICAgICBwcmVkcm9wOiBmYWxzZVxuICAgIH0pKTtcbiAgfSBlbHNlIGlmIChjYW5QcmVkcm9wKGRhdGEsIG9yaWcsIGRlc3QpKSB7XG4gICAgc2V0UHJlZHJvcChkYXRhLCBkYXRhLnBpZWNlc1tvcmlnXS5yb2xlLCBkZXN0KTtcbiAgfSBlbHNlIHtcbiAgICB1bnNldFByZW1vdmUoZGF0YSk7XG4gICAgdW5zZXRQcmVkcm9wKGRhdGEpO1xuICB9XG4gIGRlbGV0ZSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdFNxdWFyZShkYXRhLCBrZXkpIHtcbiAgaWYgKGRhdGEuc2VsZWN0ZWQpIHtcbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAoZGF0YS5zZWxlY3RlZCA9PT0ga2V5ICYmICFkYXRhLmRyYWdnYWJsZS5lbmFibGVkKSB7XG4gICAgICAgIHNldFNlbGVjdGVkKGRhdGEsIG51bGwpO1xuICAgICAgICBob2xkLmNhbmNlbCgpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLnNlbGVjdGFibGUuZW5hYmxlZCAmJiBkYXRhLnNlbGVjdGVkICE9PSBrZXkpIHtcbiAgICAgICAgaWYgKHVzZXJNb3ZlKGRhdGEsIGRhdGEuc2VsZWN0ZWQsIGtleSkpIGRhdGEuc3RhdHMuZHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGhvbGQuc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gICAgICBob2xkLmNhbmNlbCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc01vdmFibGUoZGF0YSwga2V5KSB8fCBpc1ByZW1vdmFibGUoZGF0YSwga2V5KSkge1xuICAgIHNldFNlbGVjdGVkKGRhdGEsIGtleSk7XG4gICAgaG9sZC5zdGFydCgpO1xuICB9XG4gIGlmIChrZXkpIGNhbGxVc2VyRnVuY3Rpb24odXRpbC5wYXJ0aWFsKGRhdGEuZXZlbnRzLnNlbGVjdCwga2V5KSk7XG59XG5cbmZ1bmN0aW9uIHNldFNlbGVjdGVkKGRhdGEsIGtleSkge1xuICBkYXRhLnNlbGVjdGVkID0ga2V5O1xuICBpZiAoa2V5ICYmIGlzUHJlbW92YWJsZShkYXRhLCBrZXkpKVxuICAgIGRhdGEucHJlbW92YWJsZS5kZXN0cyA9IHByZW1vdmUoZGF0YS5waWVjZXMsIGtleSwgZGF0YS5wcmVtb3ZhYmxlLmNhc3RsZSk7XG4gIGVsc2VcbiAgICBkYXRhLnByZW1vdmFibGUuZGVzdHMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc01vdmFibGUoZGF0YSwgb3JpZykge1xuICB2YXIgcGllY2UgPSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgcmV0dXJuIHBpZWNlICYmIChcbiAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09ICdib3RoJyB8fCAoXG4gICAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmXG4gICAgICBkYXRhLnR1cm5Db2xvciA9PT0gcGllY2UuY29sb3JcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gY2FuTW92ZShkYXRhLCBvcmlnLCBkZXN0KSB7XG4gIHJldHVybiBvcmlnICE9PSBkZXN0ICYmIGlzTW92YWJsZShkYXRhLCBvcmlnKSAmJiAoXG4gICAgZGF0YS5tb3ZhYmxlLmZyZWUgfHwgdXRpbC5jb250YWluc1goZGF0YS5tb3ZhYmxlLmRlc3RzW29yaWddLCBkZXN0KVxuICApO1xufVxuXG5mdW5jdGlvbiBjYW5Ecm9wKGRhdGEsIG9yaWcsIGRlc3QpIHtcbiAgdmFyIHBpZWNlID0gZGF0YS5waWVjZXNbb3JpZ107XG4gIHJldHVybiBwaWVjZSAmJiBkZXN0ICYmIChvcmlnID09PSBkZXN0IHx8ICFkYXRhLnBpZWNlc1tkZXN0XSkgJiYgKFxuICAgIGRhdGEubW92YWJsZS5jb2xvciA9PT0gJ2JvdGgnIHx8IChcbiAgICAgIGRhdGEubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiZcbiAgICAgIGRhdGEudHVybkNvbG9yID09PSBwaWVjZS5jb2xvclxuICAgICkpO1xufVxuXG5cbmZ1bmN0aW9uIGlzUHJlbW92YWJsZShkYXRhLCBvcmlnKSB7XG4gIHZhciBwaWVjZSA9IGRhdGEucGllY2VzW29yaWddO1xuICByZXR1cm4gcGllY2UgJiYgZGF0YS5wcmVtb3ZhYmxlLmVuYWJsZWQgJiZcbiAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmXG4gICAgZGF0YS50dXJuQ29sb3IgIT09IHBpZWNlLmNvbG9yO1xufVxuXG5mdW5jdGlvbiBjYW5QcmVtb3ZlKGRhdGEsIG9yaWcsIGRlc3QpIHtcbiAgcmV0dXJuIG9yaWcgIT09IGRlc3QgJiZcbiAgICBpc1ByZW1vdmFibGUoZGF0YSwgb3JpZykgJiZcbiAgICB1dGlsLmNvbnRhaW5zWChwcmVtb3ZlKGRhdGEucGllY2VzLCBvcmlnLCBkYXRhLnByZW1vdmFibGUuY2FzdGxlKSwgZGVzdCk7XG59XG5cbmZ1bmN0aW9uIGNhblByZWRyb3AoZGF0YSwgb3JpZywgZGVzdCkge1xuICB2YXIgcGllY2UgPSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgcmV0dXJuIHBpZWNlICYmIGRlc3QgJiZcbiAgICAoIWRhdGEucGllY2VzW2Rlc3RdIHx8IGRhdGEucGllY2VzW2Rlc3RdLmNvbG9yICE9PSBkYXRhLm1vdmFibGUuY29sb3IpICYmXG4gICAgZGF0YS5wcmVkcm9wcGFibGUuZW5hYmxlZCAmJlxuICAgIChwaWVjZS5yb2xlICE9PSAncGF3bicgfHwgKGRlc3RbMV0gIT09ICcxJyAmJiBkZXN0WzFdICE9PSAnOCcpKSAmJlxuICAgIGRhdGEubW92YWJsZS5jb2xvciA9PT0gcGllY2UuY29sb3IgJiZcbiAgICBkYXRhLnR1cm5Db2xvciAhPT0gcGllY2UuY29sb3I7XG59XG5cbmZ1bmN0aW9uIGlzRHJhZ2dhYmxlKGRhdGEsIG9yaWcpIHtcbiAgdmFyIHBpZWNlID0gZGF0YS5waWVjZXNbb3JpZ107XG4gIHJldHVybiBwaWVjZSAmJiBkYXRhLmRyYWdnYWJsZS5lbmFibGVkICYmIChcbiAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09ICdib3RoJyB8fCAoXG4gICAgICBkYXRhLm1vdmFibGUuY29sb3IgPT09IHBpZWNlLmNvbG9yICYmIChcbiAgICAgICAgZGF0YS50dXJuQ29sb3IgPT09IHBpZWNlLmNvbG9yIHx8IGRhdGEucHJlbW92YWJsZS5lbmFibGVkXG4gICAgICApXG4gICAgKVxuICApO1xufVxuXG5mdW5jdGlvbiBwbGF5UHJlbW92ZShkYXRhKSB7XG4gIHZhciBtb3ZlID0gZGF0YS5wcmVtb3ZhYmxlLmN1cnJlbnQ7XG4gIGlmICghbW92ZSkgcmV0dXJuO1xuICB2YXIgb3JpZyA9IG1vdmVbMF0sXG4gICAgZGVzdCA9IG1vdmVbMV0sXG4gICAgc3VjY2VzcyA9IGZhbHNlO1xuICBpZiAoY2FuTW92ZShkYXRhLCBvcmlnLCBkZXN0KSkge1xuICAgIGlmIChiYXNlVXNlck1vdmUoZGF0YSwgb3JpZywgZGVzdCkpIHtcbiAgICAgIGNhbGxVc2VyRnVuY3Rpb24odXRpbC5wYXJ0aWFsKGRhdGEubW92YWJsZS5ldmVudHMuYWZ0ZXIsIG9yaWcsIGRlc3QsIHtcbiAgICAgICAgcHJlbW92ZTogdHJ1ZVxuICAgICAgfSkpO1xuICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICB9XG4gIHVuc2V0UHJlbW92ZShkYXRhKTtcbiAgcmV0dXJuIHN1Y2Nlc3M7XG59XG5cbmZ1bmN0aW9uIHBsYXlQcmVkcm9wKGRhdGEsIHZhbGlkYXRlKSB7XG4gIHZhciBkcm9wID0gZGF0YS5wcmVkcm9wcGFibGUuY3VycmVudCxcbiAgICBzdWNjZXNzID0gZmFsc2U7XG4gIGlmICghZHJvcC5rZXkpIHJldHVybjtcbiAgaWYgKHZhbGlkYXRlKGRyb3ApKSB7XG4gICAgdmFyIHBpZWNlID0ge1xuICAgICAgcm9sZTogZHJvcC5yb2xlLFxuICAgICAgY29sb3I6IGRhdGEubW92YWJsZS5jb2xvclxuICAgIH07XG4gICAgaWYgKGJhc2VOZXdQaWVjZShkYXRhLCBwaWVjZSwgZHJvcC5rZXkpKSB7XG4gICAgICBjYWxsVXNlckZ1bmN0aW9uKHV0aWwucGFydGlhbChkYXRhLm1vdmFibGUuZXZlbnRzLmFmdGVyTmV3UGllY2UsIGRyb3Aucm9sZSwgZHJvcC5rZXksIHtcbiAgICAgICAgcHJlZHJvcDogdHJ1ZVxuICAgICAgfSkpO1xuICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICB9XG4gIHVuc2V0UHJlZHJvcChkYXRhKTtcbiAgcmV0dXJuIHN1Y2Nlc3M7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbE1vdmUoZGF0YSkge1xuICB1bnNldFByZW1vdmUoZGF0YSk7XG4gIHVuc2V0UHJlZHJvcChkYXRhKTtcbiAgc2VsZWN0U3F1YXJlKGRhdGEsIG51bGwpO1xufVxuXG5mdW5jdGlvbiBzdG9wKGRhdGEpIHtcbiAgZGF0YS5tb3ZhYmxlLmNvbG9yID0gbnVsbDtcbiAgZGF0YS5tb3ZhYmxlLmRlc3RzID0ge307XG4gIGNhbmNlbE1vdmUoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGdldEtleUF0RG9tUG9zKGRhdGEsIHBvcywgYm91bmRzKSB7XG4gIGlmICghYm91bmRzICYmICFkYXRhLmJvdW5kcykgcmV0dXJuO1xuICBib3VuZHMgPSBib3VuZHMgfHwgZGF0YS5ib3VuZHMoKTsgLy8gdXNlIHByb3ZpZGVkIHZhbHVlLCBvciBjb21wdXRlIGl0XG4gIHZhciBmaWxlID0gTWF0aC5jZWlsKDggKiAoKHBvc1swXSAtIGJvdW5kcy5sZWZ0KSAvIGJvdW5kcy53aWR0aCkpO1xuICBmaWxlID0gZGF0YS5vcmllbnRhdGlvbiA9PT0gJ3doaXRlJyA/IGZpbGUgOiA5IC0gZmlsZTtcbiAgdmFyIHJhbmsgPSBNYXRoLmNlaWwoOCAtICg4ICogKChwb3NbMV0gLSBib3VuZHMudG9wKSAvIGJvdW5kcy5oZWlnaHQpKSk7XG4gIHJhbmsgPSBkYXRhLm9yaWVudGF0aW9uID09PSAnd2hpdGUnID8gcmFuayA6IDkgLSByYW5rO1xuICBpZiAoZmlsZSA+IDAgJiYgZmlsZSA8IDkgJiYgcmFuayA+IDAgJiYgcmFuayA8IDkpIHJldHVybiB1dGlsLnBvczJrZXkoW2ZpbGUsIHJhbmtdKTtcbn1cblxuLy8ge3doaXRlOiB7cGF3bjogMyBxdWVlbjogMX0sIGJsYWNrOiB7YmlzaG9wOiAyfX1cbmZ1bmN0aW9uIGdldE1hdGVyaWFsRGlmZihkYXRhKSB7XG4gIHZhciBjb3VudHMgPSB7XG4gICAga2luZzogMCxcbiAgICBxdWVlbjogMCxcbiAgICByb29rOiAwLFxuICAgIGJpc2hvcDogMCxcbiAgICBrbmlnaHQ6IDAsXG4gICAgcGF3bjogMFxuICB9O1xuICBmb3IgKHZhciBrIGluIGRhdGEucGllY2VzKSB7XG4gICAgdmFyIHAgPSBkYXRhLnBpZWNlc1trXTtcbiAgICBjb3VudHNbcC5yb2xlXSArPSAoKHAuY29sb3IgPT09ICd3aGl0ZScpID8gMSA6IC0xKTtcbiAgfVxuICB2YXIgZGlmZiA9IHtcbiAgICB3aGl0ZToge30sXG4gICAgYmxhY2s6IHt9XG4gIH07XG4gIGZvciAodmFyIHJvbGUgaW4gY291bnRzKSB7XG4gICAgdmFyIGMgPSBjb3VudHNbcm9sZV07XG4gICAgaWYgKGMgPiAwKSBkaWZmLndoaXRlW3JvbGVdID0gYztcbiAgICBlbHNlIGlmIChjIDwgMCkgZGlmZi5ibGFja1tyb2xlXSA9IC1jO1xuICB9XG4gIHJldHVybiBkaWZmO1xufVxuXG52YXIgcGllY2VTY29yZXMgPSB7XG4gIHBhd246IDEsXG4gIGtuaWdodDogMyxcbiAgYmlzaG9wOiAzLFxuICByb29rOiA1LFxuICBxdWVlbjogOSxcbiAga2luZzogMFxufTtcblxuZnVuY3Rpb24gZ2V0U2NvcmUoZGF0YSkge1xuICB2YXIgc2NvcmUgPSAwO1xuICBmb3IgKHZhciBrIGluIGRhdGEucGllY2VzKSB7XG4gICAgc2NvcmUgKz0gcGllY2VTY29yZXNbZGF0YS5waWVjZXNba10ucm9sZV0gKiAoZGF0YS5waWVjZXNba10uY29sb3IgPT09ICd3aGl0ZScgPyAxIDogLTEpO1xuICB9XG4gIHJldHVybiBzY29yZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlc2V0OiByZXNldCxcbiAgdG9nZ2xlT3JpZW50YXRpb246IHRvZ2dsZU9yaWVudGF0aW9uLFxuICBzZXRQaWVjZXM6IHNldFBpZWNlcyxcbiAgc2V0Q2hlY2s6IHNldENoZWNrLFxuICBzZWxlY3RTcXVhcmU6IHNlbGVjdFNxdWFyZSxcbiAgc2V0U2VsZWN0ZWQ6IHNldFNlbGVjdGVkLFxuICBpc0RyYWdnYWJsZTogaXNEcmFnZ2FibGUsXG4gIGNhbk1vdmU6IGNhbk1vdmUsXG4gIHVzZXJNb3ZlOiB1c2VyTW92ZSxcbiAgZHJvcE5ld1BpZWNlOiBkcm9wTmV3UGllY2UsXG4gIGFwaU1vdmU6IGFwaU1vdmUsXG4gIGFwaU5ld1BpZWNlOiBhcGlOZXdQaWVjZSxcbiAgcGxheVByZW1vdmU6IHBsYXlQcmVtb3ZlLFxuICBwbGF5UHJlZHJvcDogcGxheVByZWRyb3AsXG4gIHVuc2V0UHJlbW92ZTogdW5zZXRQcmVtb3ZlLFxuICB1bnNldFByZWRyb3A6IHVuc2V0UHJlZHJvcCxcbiAgY2FuY2VsTW92ZTogY2FuY2VsTW92ZSxcbiAgc3RvcDogc3RvcCxcbiAgZ2V0S2V5QXREb21Qb3M6IGdldEtleUF0RG9tUG9zLFxuICBnZXRNYXRlcmlhbERpZmY6IGdldE1hdGVyaWFsRGlmZixcbiAgZ2V0U2NvcmU6IGdldFNjb3JlXG59O1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnbWVyZ2UnKTtcbnZhciBib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbnZhciBmZW4gPSByZXF1aXJlKCcuL2ZlbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEsIGNvbmZpZykge1xuXG4gIGlmICghY29uZmlnKSByZXR1cm47XG5cbiAgLy8gZG9uJ3QgbWVyZ2UgZGVzdGluYXRpb25zLiBKdXN0IG92ZXJyaWRlLlxuICBpZiAoY29uZmlnLm1vdmFibGUgJiYgY29uZmlnLm1vdmFibGUuZGVzdHMpIGRlbGV0ZSBkYXRhLm1vdmFibGUuZGVzdHM7XG5cbiAgbWVyZ2UucmVjdXJzaXZlKGRhdGEsIGNvbmZpZyk7XG5cbiAgLy8gaWYgYSBmZW4gd2FzIHByb3ZpZGVkLCByZXBsYWNlIHRoZSBwaWVjZXNcbiAgaWYgKGRhdGEuZmVuKSB7XG4gICAgZGF0YS5waWVjZXMgPSBmZW4ucmVhZChkYXRhLmZlbik7XG4gICAgZGF0YS5jaGVjayA9IGNvbmZpZy5jaGVjaztcbiAgICBkYXRhLmRyYXdhYmxlLnNoYXBlcyA9IFtdO1xuICAgIGRlbGV0ZSBkYXRhLmZlbjtcbiAgfVxuXG4gIGlmIChkYXRhLmNoZWNrID09PSB0cnVlKSBib2FyZC5zZXRDaGVjayhkYXRhKTtcblxuICAvLyBmb3JnZXQgYWJvdXQgdGhlIGxhc3QgZHJvcHBlZCBwaWVjZVxuICBkYXRhLm1vdmFibGUuZHJvcHBlZCA9IFtdO1xuXG4gIC8vIGZpeCBtb3ZlL3ByZW1vdmUgZGVzdHNcbiAgaWYgKGRhdGEuc2VsZWN0ZWQpIGJvYXJkLnNldFNlbGVjdGVkKGRhdGEsIGRhdGEuc2VsZWN0ZWQpO1xuXG4gIC8vIG5vIG5lZWQgZm9yIHN1Y2ggc2hvcnQgYW5pbWF0aW9uc1xuICBpZiAoIWRhdGEuYW5pbWF0aW9uLmR1cmF0aW9uIHx8IGRhdGEuYW5pbWF0aW9uLmR1cmF0aW9uIDwgNDApXG4gICAgZGF0YS5hbmltYXRpb24uZW5hYmxlZCA9IGZhbHNlO1xuXG4gIGlmICghZGF0YS5tb3ZhYmxlLnJvb2tDYXN0bGUpIHtcbiAgICB2YXIgcmFuayA9IGRhdGEubW92YWJsZS5jb2xvciA9PT0gJ3doaXRlJyA/IDEgOiA4O1xuICAgIHZhciBraW5nU3RhcnRQb3MgPSAnZScgKyByYW5rO1xuICAgIGlmIChkYXRhLm1vdmFibGUuZGVzdHMpIHtcbiAgICAgIHZhciBkZXN0cyA9IGRhdGEubW92YWJsZS5kZXN0c1traW5nU3RhcnRQb3NdO1xuICAgICAgaWYgKCFkZXN0cyB8fCBkYXRhLnBpZWNlc1traW5nU3RhcnRQb3NdLnJvbGUgIT09ICdraW5nJykgcmV0dXJuO1xuICAgICAgZGF0YS5tb3ZhYmxlLmRlc3RzW2tpbmdTdGFydFBvc10gPSBkZXN0cy5maWx0ZXIoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZCAhPT0gJ2EnICsgcmFuayAmJiBkICE9PSAnaCcgKyByYW5rXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmZ1bmN0aW9uIHJlbmRlckNvb3JkcyhlbGVtcywga2xhc3MsIG9yaWVudCkge1xuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb29yZHMnKTtcbiAgZWwuY2xhc3NOYW1lID0ga2xhc3M7XG4gIGVsZW1zLmZvckVhY2goZnVuY3Rpb24oY29udGVudCkge1xuICAgIHZhciBmID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29vcmQnKTtcbiAgICBmLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICBlbC5hcHBlbmRDaGlsZChmKTtcbiAgfSk7XG4gIHJldHVybiBlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcmllbnRhdGlvbiwgZWwpIHtcblxuICB1dGlsLnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICB2YXIgY29vcmRzID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciBvcmllbnRDbGFzcyA9IG9yaWVudGF0aW9uID09PSAnYmxhY2snID8gJyBibGFjaycgOiAnJztcbiAgICBjb29yZHMuYXBwZW5kQ2hpbGQocmVuZGVyQ29vcmRzKHV0aWwucmFua3MsICdyYW5rcycgKyBvcmllbnRDbGFzcykpO1xuICAgIGNvb3Jkcy5hcHBlbmRDaGlsZChyZW5kZXJDb29yZHModXRpbC5maWxlcywgJ2ZpbGVzJyArIG9yaWVudENsYXNzKSk7XG4gICAgZWwuYXBwZW5kQ2hpbGQoY29vcmRzKTtcbiAgfSk7XG5cbiAgdmFyIG9yaWVudGF0aW9uO1xuXG4gIHJldHVybiBmdW5jdGlvbihvKSB7XG4gICAgaWYgKG8gPT09IG9yaWVudGF0aW9uKSByZXR1cm47XG4gICAgb3JpZW50YXRpb24gPSBvO1xuICAgIHZhciBjb29yZHMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCdjb29yZHMnKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgKytpKVxuICAgICAgY29vcmRzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2JsYWNrJywgbyA9PT0gJ2JsYWNrJyk7XG4gIH07XG59XG4iLCJ2YXIgYm9hcmQgPSByZXF1aXJlKCcuL2JvYXJkJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmFyIGZlbiA9IHJlcXVpcmUoJy4vZmVuJyk7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcbnZhciBhbmltID0gcmVxdWlyZSgnLi9hbmltJyk7XG52YXIgZHJhZyA9IHJlcXVpcmUoJy4vZHJhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNmZykge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGEoY2ZnKTtcblxuICB0aGlzLnZtID0ge1xuICAgIGV4cGxvZGluZzogZmFsc2VcbiAgfTtcblxuICB0aGlzLmdldEZlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZW4ud3JpdGUodGhpcy5kYXRhLnBpZWNlcyk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLmdldE9yaWVudGF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5vcmllbnRhdGlvbjtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc2V0ID0gYW5pbShjb25maWd1cmUsIHRoaXMuZGF0YSk7XG5cbiAgdGhpcy50b2dnbGVPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGFuaW0oYm9hcmQudG9nZ2xlT3JpZW50YXRpb24sIHRoaXMuZGF0YSkoKTtcbiAgICBpZiAodGhpcy5kYXRhLnJlZHJhd0Nvb3JkcykgdGhpcy5kYXRhLnJlZHJhd0Nvb3Jkcyh0aGlzLmRhdGEub3JpZW50YXRpb24pO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5zZXRQaWVjZXMgPSBhbmltKGJvYXJkLnNldFBpZWNlcywgdGhpcy5kYXRhKTtcblxuICB0aGlzLnNlbGVjdFNxdWFyZSA9IGFuaW0oYm9hcmQuc2VsZWN0U3F1YXJlLCB0aGlzLmRhdGEsIHRydWUpO1xuXG4gIHRoaXMuYXBpTW92ZSA9IGFuaW0oYm9hcmQuYXBpTW92ZSwgdGhpcy5kYXRhKTtcblxuICB0aGlzLmFwaU5ld1BpZWNlID0gYW5pbShib2FyZC5hcGlOZXdQaWVjZSwgdGhpcy5kYXRhKTtcblxuICB0aGlzLnBsYXlQcmVtb3ZlID0gYW5pbShib2FyZC5wbGF5UHJlbW92ZSwgdGhpcy5kYXRhKTtcblxuICB0aGlzLnBsYXlQcmVkcm9wID0gYW5pbShib2FyZC5wbGF5UHJlZHJvcCwgdGhpcy5kYXRhKTtcblxuICB0aGlzLmNhbmNlbFByZW1vdmUgPSBhbmltKGJvYXJkLnVuc2V0UHJlbW92ZSwgdGhpcy5kYXRhLCB0cnVlKTtcblxuICB0aGlzLmNhbmNlbFByZWRyb3AgPSBhbmltKGJvYXJkLnVuc2V0UHJlZHJvcCwgdGhpcy5kYXRhLCB0cnVlKTtcblxuICB0aGlzLnNldENoZWNrID0gYW5pbShib2FyZC5zZXRDaGVjaywgdGhpcy5kYXRhLCB0cnVlKTtcblxuICB0aGlzLmNhbmNlbE1vdmUgPSBhbmltKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBib2FyZC5jYW5jZWxNb3ZlKGRhdGEpO1xuICAgIGRyYWcuY2FuY2VsKGRhdGEpO1xuICB9LmJpbmQodGhpcyksIHRoaXMuZGF0YSwgdHJ1ZSk7XG5cbiAgdGhpcy5zdG9wID0gYW5pbShmdW5jdGlvbihkYXRhKSB7XG4gICAgYm9hcmQuc3RvcChkYXRhKTtcbiAgICBkcmFnLmNhbmNlbChkYXRhKTtcbiAgfS5iaW5kKHRoaXMpLCB0aGlzLmRhdGEsIHRydWUpO1xuXG4gIHRoaXMuZXhwbG9kZSA9IGZ1bmN0aW9uKGtleXMpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5yZW5kZXIpIHJldHVybjtcbiAgICB0aGlzLnZtLmV4cGxvZGluZyA9IHtcbiAgICAgIHN0YWdlOiAxLFxuICAgICAga2V5czoga2V5c1xuICAgIH07XG4gICAgdGhpcy5kYXRhLnJlbmRlclJBRigpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnZtLmV4cGxvZGluZy5zdGFnZSA9IDI7XG4gICAgICB0aGlzLmRhdGEucmVuZGVyUkFGKCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnZtLmV4cGxvZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRhdGEucmVuZGVyUkFGKCk7XG4gICAgICB9LmJpbmQodGhpcyksIDEyMCk7XG4gICAgfS5iaW5kKHRoaXMpLCAxMjApO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5zZXRBdXRvU2hhcGVzID0gZnVuY3Rpb24oc2hhcGVzKSB7XG4gICAgYW5pbShmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkYXRhLmRyYXdhYmxlLmF1dG9TaGFwZXMgPSBzaGFwZXM7XG4gICAgfSwgdGhpcy5kYXRhLCBmYWxzZSkoKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuc2V0U2hhcGVzID0gZnVuY3Rpb24oc2hhcGVzKSB7XG4gICAgYW5pbShmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkYXRhLmRyYXdhYmxlLnNoYXBlcyA9IHNoYXBlcztcbiAgICB9LCB0aGlzLmRhdGEsIGZhbHNlKSgpO1xuICB9LmJpbmQodGhpcyk7XG59O1xuIiwidmFyIGZlbiA9IHJlcXVpcmUoJy4vZmVuJyk7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZSgnLi9jb25maWd1cmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjZmcpIHtcbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIHBpZWNlczogZmVuLnJlYWQoZmVuLmluaXRpYWwpLFxuICAgIG9yaWVudGF0aW9uOiAnd2hpdGUnLCAvLyBib2FyZCBvcmllbnRhdGlvbi4gd2hpdGUgfCBibGFja1xuICAgIHR1cm5Db2xvcjogJ3doaXRlJywgLy8gdHVybiB0byBwbGF5LiB3aGl0ZSB8IGJsYWNrXG4gICAgY2hlY2s6IG51bGwsIC8vIHNxdWFyZSBjdXJyZW50bHkgaW4gY2hlY2sgXCJhMlwiIHwgbnVsbFxuICAgIGxhc3RNb3ZlOiBudWxsLCAvLyBzcXVhcmVzIHBhcnQgb2YgdGhlIGxhc3QgbW92ZSBbXCJjM1wiLCBcImM0XCJdIHwgbnVsbFxuICAgIHNlbGVjdGVkOiBudWxsLCAvLyBzcXVhcmUgY3VycmVudGx5IHNlbGVjdGVkIFwiYTFcIiB8IG51bGxcbiAgICBjb29yZGluYXRlczogdHJ1ZSwgLy8gaW5jbHVkZSBjb29yZHMgYXR0cmlidXRlc1xuICAgIHJlbmRlcjogbnVsbCwgLy8gZnVuY3Rpb24gdGhhdCByZXJlbmRlcnMgdGhlIGJvYXJkXG4gICAgcmVuZGVyUkFGOiBudWxsLCAvLyBmdW5jdGlvbiB0aGF0IHJlcmVuZGVycyB0aGUgYm9hcmQgdXNpbmcgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgZWxlbWVudDogbnVsbCwgLy8gRE9NIGVsZW1lbnQgb2YgdGhlIGJvYXJkLCByZXF1aXJlZCBmb3IgZHJhZyBwaWVjZSBjZW50ZXJpbmdcbiAgICBib3VuZHM6IG51bGwsIC8vIGZ1bmN0aW9uIHRoYXQgY2FsY3VsYXRlcyB0aGUgYm9hcmQgYm91bmRzXG4gICAgYXV0b0Nhc3RsZTogZmFsc2UsIC8vIGltbWVkaWF0ZWx5IGNvbXBsZXRlIHRoZSBjYXN0bGUgYnkgbW92aW5nIHRoZSByb29rIGFmdGVyIGtpbmcgbW92ZVxuICAgIHZpZXdPbmx5OiBmYWxzZSwgLy8gZG9uJ3QgYmluZCBldmVudHM6IHRoZSB1c2VyIHdpbGwgbmV2ZXIgYmUgYWJsZSB0byBtb3ZlIHBpZWNlcyBhcm91bmRcbiAgICBkaXNhYmxlQ29udGV4dE1lbnU6IGZhbHNlLCAvLyBiZWNhdXNlIHdobyBuZWVkcyBhIGNvbnRleHQgbWVudSBvbiBhIGNoZXNzYm9hcmRcbiAgICByZXNpemFibGU6IHRydWUsIC8vIGxpc3RlbnMgdG8gY2hlc3Nncm91bmQucmVzaXplIG9uIGRvY3VtZW50LmJvZHkgdG8gY2xlYXIgYm91bmRzIGNhY2hlXG4gICAgcGllY2VLZXk6IGZhbHNlLCAvLyBhZGQgYSBkYXRhLWtleSBhdHRyaWJ1dGUgdG8gcGllY2UgZWxlbWVudHNcbiAgICBoaWdobGlnaHQ6IHtcbiAgICAgIGxhc3RNb3ZlOiB0cnVlLCAvLyBhZGQgbGFzdC1tb3ZlIGNsYXNzIHRvIHNxdWFyZXNcbiAgICAgIGNoZWNrOiB0cnVlLCAvLyBhZGQgY2hlY2sgY2xhc3MgdG8gc3F1YXJlc1xuICAgICAgZHJhZ092ZXI6IHRydWUgLy8gYWRkIGRyYWctb3ZlciBjbGFzcyB0byBzcXVhcmUgd2hlbiBkcmFnZ2luZyBvdmVyIGl0XG4gICAgfSxcbiAgICBhbmltYXRpb246IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgLyp7IC8vIGN1cnJlbnRcbiAgICAgICAqICBzdGFydDogdGltZXN0YW1wLFxuICAgICAgICogIGR1cmF0aW9uOiBtcyxcbiAgICAgICAqICBhbmltczoge1xuICAgICAgICogICAgYTI6IFtcbiAgICAgICAqICAgICAgWy0zMCwgNTBdLCAvLyBhbmltYXRpb24gZ29hbFxuICAgICAgICogICAgICBbLTIwLCAzN10gIC8vIGFuaW1hdGlvbiBjdXJyZW50IHN0YXR1c1xuICAgICAgICogICAgXSwgLi4uXG4gICAgICAgKiAgfSxcbiAgICAgICAqICBmYWRpbmc6IFtcbiAgICAgICAqICAgIHtcbiAgICAgICAqICAgICAgcG9zOiBbODAsIDEyMF0sIC8vIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBib2FyZFxuICAgICAgICogICAgICBvcGFjaXR5OiAwLjM0LFxuICAgICAgICogICAgICByb2xlOiAncm9vaycsXG4gICAgICAgKiAgICAgIGNvbG9yOiAnYmxhY2snXG4gICAgICAgKiAgICB9XG4gICAgICAgKiAgfVxuICAgICAgICp9Ki9cbiAgICAgIGN1cnJlbnQ6IHt9XG4gICAgfSxcbiAgICBtb3ZhYmxlOiB7XG4gICAgICBmcmVlOiB0cnVlLCAvLyBhbGwgbW92ZXMgYXJlIHZhbGlkIC0gYm9hcmQgZWRpdG9yXG4gICAgICBjb2xvcjogJ2JvdGgnLCAvLyBjb2xvciB0aGF0IGNhbiBtb3ZlLiB3aGl0ZSB8IGJsYWNrIHwgYm90aCB8IG51bGxcbiAgICAgIGRlc3RzOiB7fSwgLy8gdmFsaWQgbW92ZXMuIHtcImEyXCIgW1wiYTNcIiBcImE0XCJdIFwiYjFcIiBbXCJhM1wiIFwiYzNcIl19IHwgbnVsbFxuICAgICAgZHJvcE9mZjogJ3JldmVydCcsIC8vIHdoZW4gYSBwaWVjZSBpcyBkcm9wcGVkIG91dHNpZGUgdGhlIGJvYXJkLiBcInJldmVydFwiIHwgXCJ0cmFzaFwiXG4gICAgICBkcm9wcGVkOiBbXSwgLy8gbGFzdCBkcm9wcGVkIFtvcmlnLCBkZXN0XSwgbm90IHRvIGJlIGFuaW1hdGVkXG4gICAgICBzaG93RGVzdHM6IHRydWUsIC8vIHdoZXRoZXIgdG8gYWRkIHRoZSBtb3ZlLWRlc3QgY2xhc3Mgb24gc3F1YXJlc1xuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbihvcmlnLCBkZXN0LCBtZXRhZGF0YSkge30sIC8vIGNhbGxlZCBhZnRlciB0aGUgbW92ZSBoYXMgYmVlbiBwbGF5ZWRcbiAgICAgICAgYWZ0ZXJOZXdQaWVjZTogZnVuY3Rpb24ocm9sZSwgcG9zKSB7fSAvLyBjYWxsZWQgYWZ0ZXIgYSBuZXcgcGllY2UgaXMgZHJvcHBlZCBvbiB0aGUgYm9hcmRcbiAgICAgIH0sXG4gICAgICByb29rQ2FzdGxlOiB0cnVlIC8vIGNhc3RsZSBieSBtb3ZpbmcgdGhlIGtpbmcgdG8gdGhlIHJvb2tcbiAgICB9LFxuICAgIHByZW1vdmFibGU6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGFsbG93IHByZW1vdmVzIGZvciBjb2xvciB0aGF0IGNhbiBub3QgbW92ZVxuICAgICAgc2hvd0Rlc3RzOiB0cnVlLCAvLyB3aGV0aGVyIHRvIGFkZCB0aGUgcHJlbW92ZS1kZXN0IGNsYXNzIG9uIHNxdWFyZXNcbiAgICAgIGNhc3RsZTogdHJ1ZSwgLy8gd2hldGhlciB0byBhbGxvdyBraW5nIGNhc3RsZSBwcmVtb3Zlc1xuICAgICAgZGVzdHM6IFtdLCAvLyBwcmVtb3ZlIGRlc3RpbmF0aW9ucyBmb3IgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICBjdXJyZW50OiBudWxsLCAvLyBrZXlzIG9mIHRoZSBjdXJyZW50IHNhdmVkIHByZW1vdmUgW1wiZTJcIiBcImU0XCJdIHwgbnVsbFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24ob3JpZywgZGVzdCkge30sIC8vIGNhbGxlZCBhZnRlciB0aGUgcHJlbW92ZSBoYXMgYmVlbiBzZXRcbiAgICAgICAgdW5zZXQ6IGZ1bmN0aW9uKCkge30gLy8gY2FsbGVkIGFmdGVyIHRoZSBwcmVtb3ZlIGhhcyBiZWVuIHVuc2V0XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmVkcm9wcGFibGU6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLCAvLyBhbGxvdyBwcmVkcm9wcyBmb3IgY29sb3IgdGhhdCBjYW4gbm90IG1vdmVcbiAgICAgIGN1cnJlbnQ6IHt9LCAvLyBjdXJyZW50IHNhdmVkIHByZWRyb3Age3JvbGU6ICdrbmlnaHQnLCBrZXk6ICdlNCd9IHwge31cbiAgICAgIGV2ZW50czoge1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHJvbGUsIGtleSkge30sIC8vIGNhbGxlZCBhZnRlciB0aGUgcHJlZHJvcCBoYXMgYmVlbiBzZXRcbiAgICAgICAgdW5zZXQ6IGZ1bmN0aW9uKCkge30gLy8gY2FsbGVkIGFmdGVyIHRoZSBwcmVkcm9wIGhhcyBiZWVuIHVuc2V0XG4gICAgICB9XG4gICAgfSxcbiAgICBkcmFnZ2FibGU6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGFsbG93IG1vdmVzICYgcHJlbW92ZXMgdG8gdXNlIGRyYWcnbiBkcm9wXG4gICAgICBkaXN0YW5jZTogMywgLy8gbWluaW11bSBkaXN0YW5jZSB0byBpbml0aWF0ZSBhIGRyYWcsIGluIHBpeGVsc1xuICAgICAgYXV0b0Rpc3RhbmNlOiB0cnVlLCAvLyBsZXRzIGNoZXNzZ3JvdW5kIHNldCBkaXN0YW5jZSB0byB6ZXJvIHdoZW4gdXNlciBkcmFncyBwaWVjZXNcbiAgICAgIGNlbnRlclBpZWNlOiB0cnVlLCAvLyBjZW50ZXIgdGhlIHBpZWNlIG9uIGN1cnNvciBhdCBkcmFnIHN0YXJ0XG4gICAgICBzaG93R2hvc3Q6IHRydWUsIC8vIHNob3cgZ2hvc3Qgb2YgcGllY2UgYmVpbmcgZHJhZ2dlZFxuICAgICAgLyp7IC8vIGN1cnJlbnRcbiAgICAgICAqICBvcmlnOiBcImEyXCIsIC8vIG9yaWcga2V5IG9mIGRyYWdnaW5nIHBpZWNlXG4gICAgICAgKiAgcmVsOiBbMTAwLCAxNzBdIC8vIHgsIHkgb2YgdGhlIHBpZWNlIGF0IG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgKiAgcG9zOiBbMjAsIC0xMl0gLy8gcmVsYXRpdmUgY3VycmVudCBwb3NpdGlvblxuICAgICAgICogIGRlYzogWzQsIC04XSAvLyBwaWVjZSBjZW50ZXIgZGVjYXlcbiAgICAgICAqICBvdmVyOiBcImIzXCIgLy8gc3F1YXJlIGJlaW5nIG1vdXNlZCBvdmVyXG4gICAgICAgKiAgYm91bmRzOiBjdXJyZW50IGNhY2hlZCBib2FyZCBib3VuZHNcbiAgICAgICAqICBzdGFydGVkOiB3aGV0aGVyIHRoZSBkcmFnIGhhcyBzdGFydGVkLCBhcyBwZXIgdGhlIGRpc3RhbmNlIHNldHRpbmdcbiAgICAgICAqfSovXG4gICAgICBjdXJyZW50OiB7fVxuICAgIH0sXG4gICAgc2VsZWN0YWJsZToge1xuICAgICAgLy8gZGlzYWJsZSB0byBlbmZvcmNlIGRyYWdnaW5nIG92ZXIgY2xpY2stY2xpY2sgbW92ZVxuICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgIH0sXG4gICAgc3RhdHM6IHtcbiAgICAgIC8vIHdhcyBsYXN0IHBpZWNlIGRyYWdnZWQgb3IgY2xpY2tlZD9cbiAgICAgIC8vIG5lZWRzIGRlZmF1bHQgdG8gZmFsc2UgZm9yIHRvdWNoXG4gICAgICBkcmFnZ2VkOiAhKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdylcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgY2hhbmdlOiBmdW5jdGlvbigpIHt9LCAvLyBjYWxsZWQgYWZ0ZXIgdGhlIHNpdHVhdGlvbiBjaGFuZ2VzIG9uIHRoZSBib2FyZFxuICAgICAgLy8gY2FsbGVkIGFmdGVyIGEgcGllY2UgaGFzIGJlZW4gbW92ZWQuXG4gICAgICAvLyBjYXB0dXJlZFBpZWNlIGlzIG51bGwgb3IgbGlrZSB7Y29sb3I6ICd3aGl0ZScsICdyb2xlJzogJ3F1ZWVuJ31cbiAgICAgIG1vdmU6IGZ1bmN0aW9uKG9yaWcsIGRlc3QsIGNhcHR1cmVkUGllY2UpIHt9LFxuICAgICAgZHJvcE5ld1BpZWNlOiBmdW5jdGlvbihyb2xlLCBwb3MpIHt9LFxuICAgICAgY2FwdHVyZTogZnVuY3Rpb24oa2V5LCBwaWVjZSkge30sIC8vIERFUFJFQ0FURUQgY2FsbGVkIHdoZW4gYSBwaWVjZSBoYXMgYmVlbiBjYXB0dXJlZFxuICAgICAgc2VsZWN0OiBmdW5jdGlvbihrZXkpIHt9IC8vIGNhbGxlZCB3aGVuIGEgc3F1YXJlIGlzIHNlbGVjdGVkXG4gICAgfSxcbiAgICBpdGVtczogbnVsbCwgLy8gaXRlbXMgb24gdGhlIGJvYXJkIHsgcmVuZGVyOiBrZXkgLT4gdmRvbSB9XG4gICAgZHJhd2FibGU6IHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLCAvLyBhbGxvd3MgU1ZHIGRyYXdpbmdzXG4gICAgICBlcmFzZU9uQ2xpY2s6IHRydWUsXG4gICAgICBvbkNoYW5nZTogZnVuY3Rpb24oc2hhcGVzKSB7fSxcbiAgICAgIC8vIHVzZXIgc2hhcGVzXG4gICAgICBzaGFwZXM6IFtcbiAgICAgICAgLy8ge2JydXNoOiAnZ3JlZW4nLCBvcmlnOiAnZTgnfSxcbiAgICAgICAgLy8ge2JydXNoOiAneWVsbG93Jywgb3JpZzogJ2M0JywgZGVzdDogJ2Y3J31cbiAgICAgIF0sXG4gICAgICAvLyBjb21wdXRlciBzaGFwZXNcbiAgICAgIGF1dG9TaGFwZXM6IFtcbiAgICAgICAgLy8ge2JydXNoOiAncGFsZUJsdWUnLCBvcmlnOiAnZTgnfSxcbiAgICAgICAgLy8ge2JydXNoOiAncGFsZVJlZCcsIG9yaWc6ICdjNCcsIGRlc3Q6ICdmNyd9XG4gICAgICBdLFxuICAgICAgLyp7IC8vIGN1cnJlbnRcbiAgICAgICAqICBvcmlnOiBcImEyXCIsIC8vIG9yaWcga2V5IG9mIGRyYXdpbmdcbiAgICAgICAqICBwb3M6IFsyMCwgLTEyXSAvLyByZWxhdGl2ZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICAgKiAgZGVzdDogXCJiM1wiIC8vIHNxdWFyZSBiZWluZyBtb3VzZWQgb3ZlclxuICAgICAgICogIGJvdW5kczogLy8gY3VycmVudCBjYWNoZWQgYm9hcmQgYm91bmRzXG4gICAgICAgKiAgYnJ1c2g6ICdncmVlbicgLy8gYnJ1c2ggbmFtZSBmb3Igc2hhcGVcbiAgICAgICAqfSovXG4gICAgICBjdXJyZW50OiB7fSxcbiAgICAgIGJydXNoZXM6IHtcbiAgICAgICAgZ3JlZW46IHtcbiAgICAgICAgICBrZXk6ICdnJyxcbiAgICAgICAgICBjb2xvcjogJyMxNTc4MUInLFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgbGluZVdpZHRoOiAxMFxuICAgICAgICB9LFxuICAgICAgICByZWQ6IHtcbiAgICAgICAgICBrZXk6ICdyJyxcbiAgICAgICAgICBjb2xvcjogJyM4ODIwMjAnLFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgbGluZVdpZHRoOiAxMFxuICAgICAgICB9LFxuICAgICAgICBibHVlOiB7XG4gICAgICAgICAga2V5OiAnYicsXG4gICAgICAgICAgY29sb3I6ICcjMDAzMDg4JyxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIGxpbmVXaWR0aDogMTBcbiAgICAgICAgfSxcbiAgICAgICAgeWVsbG93OiB7XG4gICAgICAgICAga2V5OiAneScsXG4gICAgICAgICAgY29sb3I6ICcjZTY4ZjAwJyxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIGxpbmVXaWR0aDogMTBcbiAgICAgICAgfSxcbiAgICAgICAgcGFsZUJsdWU6IHtcbiAgICAgICAgICBrZXk6ICdwYicsXG4gICAgICAgICAgY29sb3I6ICcjMDAzMDg4JyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgbGluZVdpZHRoOiAxNVxuICAgICAgICB9LFxuICAgICAgICBwYWxlR3JlZW46IHtcbiAgICAgICAgICBrZXk6ICdwZycsXG4gICAgICAgICAgY29sb3I6ICcjMTU3ODFCJyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgbGluZVdpZHRoOiAxNVxuICAgICAgICB9LFxuICAgICAgICBwYWxlUmVkOiB7XG4gICAgICAgICAga2V5OiAncHInLFxuICAgICAgICAgIGNvbG9yOiAnIzg4MjAyMCcsXG4gICAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICAgIGxpbmVXaWR0aDogMTVcbiAgICAgICAgfSxcbiAgICAgICAgcGFsZUdyZXk6IHtcbiAgICAgICAgICBrZXk6ICdwZ3InLFxuICAgICAgICAgIGNvbG9yOiAnIzRhNGE0YScsXG4gICAgICAgICAgb3BhY2l0eTogMC4zNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBkcmF3YWJsZSBTVkcgcGllY2VzLCB1c2VkIGZvciBjcmF6eWhvdXNlIGRyb3BcbiAgICAgIHBpZWNlczoge1xuICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9saWNoZXNzMS5vcmcvYXNzZXRzL3BpZWNlL2NidXJuZXR0LydcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uZmlndXJlKGRlZmF1bHRzLCBjZmcgfHwge30pO1xuXG4gIHJldHVybiBkZWZhdWx0cztcbn07XG4iLCJ2YXIgYm9hcmQgPSByZXF1aXJlKCcuL2JvYXJkJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGRyYXcgPSByZXF1aXJlKCcuL2RyYXcnKTtcblxudmFyIG9yaWdpblRhcmdldDtcblxuZnVuY3Rpb24gaGFzaFBpZWNlKHBpZWNlKSB7XG4gIHJldHVybiBwaWVjZSA/IHBpZWNlLmNvbG9yICsgcGllY2Uucm9sZSA6ICcnO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3F1YXJlQm91bmRzKGRhdGEsIGJvdW5kcywga2V5KSB7XG4gIHZhciBwb3MgPSB1dGlsLmtleTJwb3Moa2V5KTtcbiAgaWYgKGRhdGEub3JpZW50YXRpb24gIT09ICd3aGl0ZScpIHtcbiAgICBwb3NbMF0gPSA5IC0gcG9zWzBdO1xuICAgIHBvc1sxXSA9IDkgLSBwb3NbMV07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCAqIChwb3NbMF0gLSAxKSAvIDgsXG4gICAgdG9wOiBib3VuZHMudG9wICsgYm91bmRzLmhlaWdodCAqICg4IC0gcG9zWzFdKSAvIDgsXG4gICAgd2lkdGg6IGJvdW5kcy53aWR0aCAvIDgsXG4gICAgaGVpZ2h0OiBib3VuZHMuaGVpZ2h0IC8gOFxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGFydChkYXRhLCBlKSB7XG4gIGlmIChlLmJ1dHRvbiAhPT0gdW5kZWZpbmVkICYmIGUuYnV0dG9uICE9PSAwKSByZXR1cm47IC8vIG9ubHkgdG91Y2ggb3IgbGVmdCBjbGlja1xuICBpZiAoZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPiAxKSByZXR1cm47IC8vIHN1cHBvcnQgb25lIGZpbmdlciB0b3VjaCBvbmx5XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgb3JpZ2luVGFyZ2V0ID0gZS50YXJnZXQ7XG4gIHZhciBwcmV2aW91c2x5U2VsZWN0ZWQgPSBkYXRhLnNlbGVjdGVkO1xuICB2YXIgcG9zaXRpb24gPSB1dGlsLmV2ZW50UG9zaXRpb24oZSk7XG4gIHZhciBib3VuZHMgPSBkYXRhLmJvdW5kcygpO1xuICB2YXIgb3JpZyA9IGJvYXJkLmdldEtleUF0RG9tUG9zKGRhdGEsIHBvc2l0aW9uLCBib3VuZHMpO1xuICB2YXIgcGllY2UgPSBkYXRhLnBpZWNlc1tvcmlnXTtcbiAgaWYgKCFwcmV2aW91c2x5U2VsZWN0ZWQgJiYgKFxuICAgIGRhdGEuZHJhd2FibGUuZXJhc2VPbkNsaWNrIHx8XG4gICAgKCFwaWVjZSB8fCBwaWVjZS5jb2xvciAhPT0gZGF0YS50dXJuQ29sb3IpXG4gICkpIGRyYXcuY2xlYXIoZGF0YSk7XG4gIGlmIChkYXRhLnZpZXdPbmx5KSByZXR1cm47XG4gIHZhciBoYWRQcmVtb3ZlID0gISFkYXRhLnByZW1vdmFibGUuY3VycmVudDtcbiAgdmFyIGhhZFByZWRyb3AgPSAhIWRhdGEucHJlZHJvcHBhYmxlLmN1cnJlbnQua2V5O1xuICBib2FyZC5zZWxlY3RTcXVhcmUoZGF0YSwgb3JpZyk7XG4gIHZhciBzdGlsbFNlbGVjdGVkID0gZGF0YS5zZWxlY3RlZCA9PT0gb3JpZztcbiAgaWYgKHBpZWNlICYmIHN0aWxsU2VsZWN0ZWQgJiYgYm9hcmQuaXNEcmFnZ2FibGUoZGF0YSwgb3JpZykpIHtcbiAgICB2YXIgc3F1YXJlQm91bmRzID0gY29tcHV0ZVNxdWFyZUJvdW5kcyhkYXRhLCBib3VuZHMsIG9yaWcpO1xuICAgIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7XG4gICAgICBwcmV2aW91c2x5U2VsZWN0ZWQ6IHByZXZpb3VzbHlTZWxlY3RlZCxcbiAgICAgIG9yaWc6IG9yaWcsXG4gICAgICBwaWVjZTogaGFzaFBpZWNlKHBpZWNlKSxcbiAgICAgIHJlbDogcG9zaXRpb24sXG4gICAgICBlcG9zOiBwb3NpdGlvbixcbiAgICAgIHBvczogWzAsIDBdLFxuICAgICAgZGVjOiBkYXRhLmRyYWdnYWJsZS5jZW50ZXJQaWVjZSA/IFtcbiAgICAgICAgcG9zaXRpb25bMF0gLSAoc3F1YXJlQm91bmRzLmxlZnQgKyBzcXVhcmVCb3VuZHMud2lkdGggLyAyKSxcbiAgICAgICAgcG9zaXRpb25bMV0gLSAoc3F1YXJlQm91bmRzLnRvcCArIHNxdWFyZUJvdW5kcy5oZWlnaHQgLyAyKVxuICAgICAgXSA6IFswLCAwXSxcbiAgICAgIGJvdW5kczogYm91bmRzLFxuICAgICAgc3RhcnRlZDogZGF0YS5kcmFnZ2FibGUuYXV0b0Rpc3RhbmNlICYmIGRhdGEuc3RhdHMuZHJhZ2dlZFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaWYgKGhhZFByZW1vdmUpIGJvYXJkLnVuc2V0UHJlbW92ZShkYXRhKTtcbiAgICBpZiAoaGFkUHJlZHJvcCkgYm9hcmQudW5zZXRQcmVkcm9wKGRhdGEpO1xuICB9XG4gIHByb2Nlc3NEcmFnKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzRHJhZyhkYXRhKSB7XG4gIHV0aWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXIgPSBkYXRhLmRyYWdnYWJsZS5jdXJyZW50O1xuICAgIGlmIChjdXIub3JpZykge1xuICAgICAgLy8gY2FuY2VsIGFuaW1hdGlvbnMgd2hpbGUgZHJhZ2dpbmdcbiAgICAgIGlmIChkYXRhLmFuaW1hdGlvbi5jdXJyZW50LnN0YXJ0ICYmIGRhdGEuYW5pbWF0aW9uLmN1cnJlbnQuYW5pbXNbY3VyLm9yaWddKVxuICAgICAgICBkYXRhLmFuaW1hdGlvbi5jdXJyZW50ID0ge307XG4gICAgICAvLyBpZiBtb3ZpbmcgcGllY2UgaXMgZ29uZSwgY2FuY2VsXG4gICAgICBpZiAoaGFzaFBpZWNlKGRhdGEucGllY2VzW2N1ci5vcmlnXSkgIT09IGN1ci5waWVjZSkgY2FuY2VsKGRhdGEpO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICghY3VyLnN0YXJ0ZWQgJiYgdXRpbC5kaXN0YW5jZShjdXIuZXBvcywgY3VyLnJlbCkgPj0gZGF0YS5kcmFnZ2FibGUuZGlzdGFuY2UpXG4gICAgICAgICAgY3VyLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICBpZiAoY3VyLnN0YXJ0ZWQpIHtcbiAgICAgICAgICBjdXIucG9zID0gW1xuICAgICAgICAgICAgY3VyLmVwb3NbMF0gLSBjdXIucmVsWzBdLFxuICAgICAgICAgICAgY3VyLmVwb3NbMV0gLSBjdXIucmVsWzFdXG4gICAgICAgICAgXTtcbiAgICAgICAgICBjdXIub3ZlciA9IGJvYXJkLmdldEtleUF0RG9tUG9zKGRhdGEsIGN1ci5lcG9zLCBjdXIuYm91bmRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBkYXRhLnJlbmRlcigpO1xuICAgIGlmIChjdXIub3JpZykgcHJvY2Vzc0RyYWcoZGF0YSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtb3ZlKGRhdGEsIGUpIHtcbiAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID4gMSkgcmV0dXJuOyAvLyBzdXBwb3J0IG9uZSBmaW5nZXIgdG91Y2ggb25seVxuICBpZiAoZGF0YS5kcmFnZ2FibGUuY3VycmVudC5vcmlnKVxuICAgIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQuZXBvcyA9IHV0aWwuZXZlbnRQb3NpdGlvbihlKTtcbn1cblxuZnVuY3Rpb24gZW5kKGRhdGEsIGUpIHtcbiAgdmFyIGN1ciA9IGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gIHZhciBvcmlnID0gY3VyID8gY3VyLm9yaWcgOiBudWxsO1xuICBpZiAoIW9yaWcpIHJldHVybjtcbiAgLy8gY29tcGFyaW5nIHdpdGggdGhlIG9yaWdpbiB0YXJnZXQgaXMgYW4gZWFzeSB3YXkgdG8gdGVzdCB0aGF0IHRoZSBlbmQgZXZlbnRcbiAgLy8gaGFzIHRoZSBzYW1lIHRvdWNoIG9yaWdpblxuICBpZiAoZS50eXBlID09PSBcInRvdWNoZW5kXCIgJiYgb3JpZ2luVGFyZ2V0ICE9PSBlLnRhcmdldCAmJiAhY3VyLm5ld1BpZWNlKSB7XG4gICAgZGF0YS5kcmFnZ2FibGUuY3VycmVudCA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuICBib2FyZC51bnNldFByZW1vdmUoZGF0YSk7XG4gIGJvYXJkLnVuc2V0UHJlZHJvcChkYXRhKTtcbiAgdmFyIGV2ZW50UG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpXG4gIHZhciBkZXN0ID0gZXZlbnRQb3MgPyBib2FyZC5nZXRLZXlBdERvbVBvcyhkYXRhLCBldmVudFBvcywgY3VyLmJvdW5kcykgOiBjdXIub3ZlcjtcbiAgaWYgKGN1ci5zdGFydGVkKSB7XG4gICAgaWYgKGN1ci5uZXdQaWVjZSkgYm9hcmQuZHJvcE5ld1BpZWNlKGRhdGEsIG9yaWcsIGRlc3QpO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKG9yaWcgIT09IGRlc3QpIGRhdGEubW92YWJsZS5kcm9wcGVkID0gW29yaWcsIGRlc3RdO1xuICAgICAgaWYgKGJvYXJkLnVzZXJNb3ZlKGRhdGEsIG9yaWcsIGRlc3QpKSBkYXRhLnN0YXRzLmRyYWdnZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBpZiAob3JpZyA9PT0gY3VyLnByZXZpb3VzbHlTZWxlY3RlZCAmJiAob3JpZyA9PT0gZGVzdCB8fCAhZGVzdCkpXG4gICAgYm9hcmQuc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIGVsc2UgaWYgKCFkYXRhLnNlbGVjdGFibGUuZW5hYmxlZCkgYm9hcmQuc2V0U2VsZWN0ZWQoZGF0YSwgbnVsbCk7XG4gIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7fTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsKGRhdGEpIHtcbiAgaWYgKGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQub3JpZykge1xuICAgIGRhdGEuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7fTtcbiAgICBib2FyZC5zZWxlY3RTcXVhcmUoZGF0YSwgbnVsbCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0YXJ0OiBzdGFydCxcbiAgbW92ZTogbW92ZSxcbiAgZW5kOiBlbmQsXG4gIGNhbmNlbDogY2FuY2VsLFxuICBwcm9jZXNzRHJhZzogcHJvY2Vzc0RyYWcgLy8gbXVzdCBiZSBleHBvc2VkIGZvciBib2FyZCBlZGl0b3JzXG59O1xuIiwidmFyIGJvYXJkID0gcmVxdWlyZSgnLi9ib2FyZCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIGJydXNoZXMgPSBbJ2dyZWVuJywgJ3JlZCcsICdibHVlJywgJ3llbGxvdyddO1xuXG5mdW5jdGlvbiBoYXNoUGllY2UocGllY2UpIHtcbiAgcmV0dXJuIHBpZWNlID8gcGllY2UuY29sb3IgKyAnICcgKyBwaWVjZS5yb2xlIDogJyc7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KGRhdGEsIGUpIHtcbiAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID4gMSkgcmV0dXJuOyAvLyBzdXBwb3J0IG9uZSBmaW5nZXIgdG91Y2ggb25seVxuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGJvYXJkLmNhbmNlbE1vdmUoZGF0YSk7XG4gIHZhciBwb3NpdGlvbiA9IHV0aWwuZXZlbnRQb3NpdGlvbihlKTtcbiAgdmFyIGJvdW5kcyA9IGRhdGEuYm91bmRzKCk7XG4gIHZhciBvcmlnID0gYm9hcmQuZ2V0S2V5QXREb21Qb3MoZGF0YSwgcG9zaXRpb24sIGJvdW5kcyk7XG4gIGRhdGEuZHJhd2FibGUuY3VycmVudCA9IHtcbiAgICBvcmlnOiBvcmlnLFxuICAgIGVwb3M6IHBvc2l0aW9uLFxuICAgIGJvdW5kczogYm91bmRzLFxuICAgIGJydXNoOiBicnVzaGVzWyhlLnNoaWZ0S2V5ICYgdXRpbC5pc1JpZ2h0QnV0dG9uKGUpKSArIChlLmFsdEtleSA/IDIgOiAwKV1cbiAgfTtcbiAgcHJvY2Vzc0RyYXcoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NEcmF3KGRhdGEpIHtcbiAgdXRpbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1ciA9IGRhdGEuZHJhd2FibGUuY3VycmVudDtcbiAgICBpZiAoY3VyLm9yaWcpIHtcbiAgICAgIHZhciBkZXN0ID0gYm9hcmQuZ2V0S2V5QXREb21Qb3MoZGF0YSwgY3VyLmVwb3MsIGN1ci5ib3VuZHMpO1xuICAgICAgaWYgKGN1ci5vcmlnID09PSBkZXN0KSBjdXIuZGVzdCA9IHVuZGVmaW5lZDtcbiAgICAgIGVsc2UgY3VyLmRlc3QgPSBkZXN0O1xuICAgIH1cbiAgICBkYXRhLnJlbmRlcigpO1xuICAgIGlmIChjdXIub3JpZykgcHJvY2Vzc0RyYXcoZGF0YSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtb3ZlKGRhdGEsIGUpIHtcbiAgaWYgKGRhdGEuZHJhd2FibGUuY3VycmVudC5vcmlnKVxuICAgIGRhdGEuZHJhd2FibGUuY3VycmVudC5lcG9zID0gdXRpbC5ldmVudFBvc2l0aW9uKGUpO1xufVxuXG5mdW5jdGlvbiBlbmQoZGF0YSwgZSkge1xuICB2YXIgZHJhd2FibGUgPSBkYXRhLmRyYXdhYmxlO1xuICB2YXIgb3JpZyA9IGRyYXdhYmxlLmN1cnJlbnQub3JpZztcbiAgdmFyIGRlc3QgPSBkcmF3YWJsZS5jdXJyZW50LmRlc3Q7XG4gIGlmIChvcmlnICYmIGRlc3QpIGFkZExpbmUoZHJhd2FibGUsIG9yaWcsIGRlc3QpO1xuICBlbHNlIGlmIChvcmlnKSBhZGRDaXJjbGUoZHJhd2FibGUsIG9yaWcpO1xuICBkcmF3YWJsZS5jdXJyZW50ID0ge307XG4gIGRhdGEucmVuZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGNhbmNlbChkYXRhKSB7XG4gIGlmIChkYXRhLmRyYXdhYmxlLmN1cnJlbnQub3JpZykgZGF0YS5kcmF3YWJsZS5jdXJyZW50ID0ge307XG59XG5cbmZ1bmN0aW9uIGNsZWFyKGRhdGEpIHtcbiAgaWYgKGRhdGEuZHJhd2FibGUuc2hhcGVzLmxlbmd0aCkge1xuICAgIGRhdGEuZHJhd2FibGUuc2hhcGVzID0gW107XG4gICAgZGF0YS5yZW5kZXIoKTtcbiAgICBvbkNoYW5nZShkYXRhLmRyYXdhYmxlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub3QoZikge1xuICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAhZih4KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkQ2lyY2xlKGRyYXdhYmxlLCBrZXkpIHtcbiAgdmFyIGJydXNoID0gZHJhd2FibGUuY3VycmVudC5icnVzaDtcbiAgdmFyIHNhbWVDaXJjbGUgPSBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHMub3JpZyA9PT0ga2V5ICYmICFzLmRlc3Q7XG4gIH07XG4gIHZhciBzaW1pbGFyID0gZHJhd2FibGUuc2hhcGVzLmZpbHRlcihzYW1lQ2lyY2xlKVswXTtcbiAgaWYgKHNpbWlsYXIpIGRyYXdhYmxlLnNoYXBlcyA9IGRyYXdhYmxlLnNoYXBlcy5maWx0ZXIobm90KHNhbWVDaXJjbGUpKTtcbiAgaWYgKCFzaW1pbGFyIHx8IHNpbWlsYXIuYnJ1c2ggIT09IGJydXNoKSBkcmF3YWJsZS5zaGFwZXMucHVzaCh7XG4gICAgYnJ1c2g6IGJydXNoLFxuICAgIG9yaWc6IGtleVxuICB9KTtcbiAgb25DaGFuZ2UoZHJhd2FibGUpO1xufVxuXG5mdW5jdGlvbiBhZGRMaW5lKGRyYXdhYmxlLCBvcmlnLCBkZXN0KSB7XG4gIHZhciBicnVzaCA9IGRyYXdhYmxlLmN1cnJlbnQuYnJ1c2g7XG4gIHZhciBzYW1lTGluZSA9IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gcy5vcmlnICYmIHMuZGVzdCAmJiAoXG4gICAgICAocy5vcmlnID09PSBvcmlnICYmIHMuZGVzdCA9PT0gZGVzdCkgfHxcbiAgICAgIChzLmRlc3QgPT09IG9yaWcgJiYgcy5vcmlnID09PSBkZXN0KVxuICAgICk7XG4gIH07XG4gIHZhciBleGlzdHMgPSBkcmF3YWJsZS5zaGFwZXMuZmlsdGVyKHNhbWVMaW5lKS5sZW5ndGggPiAwO1xuICBpZiAoZXhpc3RzKSBkcmF3YWJsZS5zaGFwZXMgPSBkcmF3YWJsZS5zaGFwZXMuZmlsdGVyKG5vdChzYW1lTGluZSkpO1xuICBlbHNlIGRyYXdhYmxlLnNoYXBlcy5wdXNoKHtcbiAgICBicnVzaDogYnJ1c2gsXG4gICAgb3JpZzogb3JpZyxcbiAgICBkZXN0OiBkZXN0XG4gIH0pO1xuICBvbkNoYW5nZShkcmF3YWJsZSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hhbmdlKGRyYXdhYmxlKSB7XG4gIGRyYXdhYmxlLm9uQ2hhbmdlKGRyYXdhYmxlLnNoYXBlcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdGFydDogc3RhcnQsXG4gIG1vdmU6IG1vdmUsXG4gIGVuZDogZW5kLFxuICBjYW5jZWw6IGNhbmNlbCxcbiAgY2xlYXI6IGNsZWFyLFxuICBwcm9jZXNzRHJhdzogcHJvY2Vzc0RyYXdcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgaW5pdGlhbCA9ICdybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SJztcblxudmFyIHJvbGVzID0ge1xuICBwOiBcInBhd25cIixcbiAgcjogXCJyb29rXCIsXG4gIG46IFwia25pZ2h0XCIsXG4gIGI6IFwiYmlzaG9wXCIsXG4gIHE6IFwicXVlZW5cIixcbiAgazogXCJraW5nXCJcbn07XG5cbnZhciBsZXR0ZXJzID0ge1xuICBwYXduOiBcInBcIixcbiAgcm9vazogXCJyXCIsXG4gIGtuaWdodDogXCJuXCIsXG4gIGJpc2hvcDogXCJiXCIsXG4gIHF1ZWVuOiBcInFcIixcbiAga2luZzogXCJrXCJcbn07XG5cbmZ1bmN0aW9uIHJlYWQoZmVuKSB7XG4gIGlmIChmZW4gPT09ICdzdGFydCcpIGZlbiA9IGluaXRpYWw7XG4gIHZhciBwaWVjZXMgPSB7fTtcbiAgZmVuLnJlcGxhY2UoLyAuKyQvLCAnJykucmVwbGFjZSgvfi9nLCAnJykuc3BsaXQoJy8nKS5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgeSkge1xuICAgIHZhciB4ID0gMDtcbiAgICByb3cuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgdmFyIG5iID0gcGFyc2VJbnQodik7XG4gICAgICBpZiAobmIpIHggKz0gbmI7XG4gICAgICBlbHNlIHtcbiAgICAgICAgeCsrO1xuICAgICAgICBwaWVjZXNbdXRpbC5wb3Mya2V5KFt4LCA4IC0geV0pXSA9IHtcbiAgICAgICAgICByb2xlOiByb2xlc1t2LnRvTG93ZXJDYXNlKCldLFxuICAgICAgICAgIGNvbG9yOiB2ID09PSB2LnRvTG93ZXJDYXNlKCkgPyAnYmxhY2snIDogJ3doaXRlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcGllY2VzO1xufVxuXG5mdW5jdGlvbiB3cml0ZShwaWVjZXMpIHtcbiAgcmV0dXJuIFs4LCA3LCA2LCA1LCA0LCAzLCAyXS5yZWR1Y2UoXG4gICAgZnVuY3Rpb24oc3RyLCBuYikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoQXJyYXkobmIgKyAxKS5qb2luKCcxJyksICdnJyksIG5iKTtcbiAgICB9LFxuICAgIHV0aWwuaW52UmFua3MubWFwKGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiB1dGlsLnJhbmtzLm1hcChmdW5jdGlvbih4KSB7XG4gICAgICAgIHZhciBwaWVjZSA9IHBpZWNlc1t1dGlsLnBvczJrZXkoW3gsIHldKV07XG4gICAgICAgIGlmIChwaWVjZSkge1xuICAgICAgICAgIHZhciBsZXR0ZXIgPSBsZXR0ZXJzW3BpZWNlLnJvbGVdO1xuICAgICAgICAgIHJldHVybiBwaWVjZS5jb2xvciA9PT0gJ3doaXRlJyA/IGxldHRlci50b1VwcGVyQ2FzZSgpIDogbGV0dGVyO1xuICAgICAgICB9IGVsc2UgcmV0dXJuICcxJztcbiAgICAgIH0pLmpvaW4oJycpO1xuICAgIH0pLmpvaW4oJy8nKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0aWFsOiBpbml0aWFsLFxuICByZWFkOiByZWFkLFxuICB3cml0ZTogd3JpdGVcbn07XG4iLCJ2YXIgc3RhcnRBdDtcblxudmFyIHN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHN0YXJ0QXQgPSBuZXcgRGF0ZSgpO1xufTtcblxudmFyIGNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBzdGFydEF0ID0gbnVsbDtcbn07XG5cbnZhciBzdG9wID0gZnVuY3Rpb24oKSB7XG4gIGlmICghc3RhcnRBdCkgcmV0dXJuIDA7XG4gIHZhciB0aW1lID0gbmV3IERhdGUoKSAtIHN0YXJ0QXQ7XG4gIHN0YXJ0QXQgPSBudWxsO1xuICByZXR1cm4gdGltZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdGFydDogc3RhcnQsXG4gIGNhbmNlbDogY2FuY2VsLFxuICBzdG9wOiBzdG9wXG59O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgY3RybCA9IHJlcXVpcmUoJy4vY3RybCcpO1xudmFyIHZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcbnZhciBhcGkgPSByZXF1aXJlKCcuL2FwaScpO1xuXG4vLyBmb3IgdXNhZ2Ugb3V0c2lkZSBvZiBtaXRocmlsXG5mdW5jdGlvbiBpbml0KGVsZW1lbnQsIGNvbmZpZykge1xuXG4gIHZhciBjb250cm9sbGVyID0gbmV3IGN0cmwoY29uZmlnKTtcblxuICBtLnJlbmRlcihlbGVtZW50LCB2aWV3KGNvbnRyb2xsZXIpKTtcblxuICByZXR1cm4gYXBpKGNvbnRyb2xsZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXQ7XG5tb2R1bGUuZXhwb3J0cy5jb250cm9sbGVyID0gY3RybDtcbm1vZHVsZS5leHBvcnRzLnZpZXcgPSB2aWV3O1xubW9kdWxlLmV4cG9ydHMuZmVuID0gcmVxdWlyZSgnLi9mZW4nKTtcbm1vZHVsZS5leHBvcnRzLnV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbm1vZHVsZS5leHBvcnRzLmNvbmZpZ3VyZSA9IHJlcXVpcmUoJy4vY29uZmlndXJlJyk7XG5tb2R1bGUuZXhwb3J0cy5hbmltID0gcmVxdWlyZSgnLi9hbmltJyk7XG5tb2R1bGUuZXhwb3J0cy5ib2FyZCA9IHJlcXVpcmUoJy4vYm9hcmQnKTtcbm1vZHVsZS5leHBvcnRzLmRyYWcgPSByZXF1aXJlKCcuL2RyYWcnKTtcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmZ1bmN0aW9uIGRpZmYoYSwgYikge1xuICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpO1xufVxuXG5mdW5jdGlvbiBwYXduKGNvbG9yLCB4MSwgeTEsIHgyLCB5Mikge1xuICByZXR1cm4gZGlmZih4MSwgeDIpIDwgMiAmJiAoXG4gICAgY29sb3IgPT09ICd3aGl0ZScgPyAoXG4gICAgICAvLyBhbGxvdyAyIHNxdWFyZXMgZnJvbSAxIGFuZCA4LCBmb3IgaG9yZGVcbiAgICAgIHkyID09PSB5MSArIDEgfHwgKHkxIDw9IDIgJiYgeTIgPT09ICh5MSArIDIpICYmIHgxID09PSB4MilcbiAgICApIDogKFxuICAgICAgeTIgPT09IHkxIC0gMSB8fCAoeTEgPj0gNyAmJiB5MiA9PT0gKHkxIC0gMikgJiYgeDEgPT09IHgyKVxuICAgIClcbiAgKTtcbn1cblxuZnVuY3Rpb24ga25pZ2h0KHgxLCB5MSwgeDIsIHkyKSB7XG4gIHZhciB4ZCA9IGRpZmYoeDEsIHgyKTtcbiAgdmFyIHlkID0gZGlmZih5MSwgeTIpO1xuICByZXR1cm4gKHhkID09PSAxICYmIHlkID09PSAyKSB8fCAoeGQgPT09IDIgJiYgeWQgPT09IDEpO1xufVxuXG5mdW5jdGlvbiBiaXNob3AoeDEsIHkxLCB4MiwgeTIpIHtcbiAgcmV0dXJuIGRpZmYoeDEsIHgyKSA9PT0gZGlmZih5MSwgeTIpO1xufVxuXG5mdW5jdGlvbiByb29rKHgxLCB5MSwgeDIsIHkyKSB7XG4gIHJldHVybiB4MSA9PT0geDIgfHwgeTEgPT09IHkyO1xufVxuXG5mdW5jdGlvbiBxdWVlbih4MSwgeTEsIHgyLCB5Mikge1xuICByZXR1cm4gYmlzaG9wKHgxLCB5MSwgeDIsIHkyKSB8fCByb29rKHgxLCB5MSwgeDIsIHkyKTtcbn1cblxuZnVuY3Rpb24ga2luZyhjb2xvciwgcm9va0ZpbGVzLCBjYW5DYXN0bGUsIHgxLCB5MSwgeDIsIHkyKSB7XG4gIHJldHVybiAoXG4gICAgZGlmZih4MSwgeDIpIDwgMiAmJiBkaWZmKHkxLCB5MikgPCAyXG4gICkgfHwgKFxuICAgIGNhbkNhc3RsZSAmJiB5MSA9PT0geTIgJiYgeTEgPT09IChjb2xvciA9PT0gJ3doaXRlJyA/IDEgOiA4KSAmJiAoXG4gICAgICAoeDEgPT09IDUgJiYgKHgyID09PSAzIHx8IHgyID09PSA3KSkgfHwgdXRpbC5jb250YWluc1gocm9va0ZpbGVzLCB4MilcbiAgICApXG4gICk7XG59XG5cbmZ1bmN0aW9uIHJvb2tGaWxlc09mKHBpZWNlcywgY29sb3IpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHBpZWNlcykuZmlsdGVyKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBwaWVjZSA9IHBpZWNlc1trZXldO1xuICAgIHJldHVybiBwaWVjZSAmJiBwaWVjZS5jb2xvciA9PT0gY29sb3IgJiYgcGllY2Uucm9sZSA9PT0gJ3Jvb2snO1xuICB9KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHV0aWwua2V5MnBvcyhrZXkpWzBdO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZShwaWVjZXMsIGtleSwgY2FuQ2FzdGxlKSB7XG4gIHZhciBwaWVjZSA9IHBpZWNlc1trZXldO1xuICB2YXIgcG9zID0gdXRpbC5rZXkycG9zKGtleSk7XG4gIHZhciBtb2JpbGl0eTtcbiAgc3dpdGNoIChwaWVjZS5yb2xlKSB7XG4gICAgY2FzZSAncGF3bic6XG4gICAgICBtb2JpbGl0eSA9IHBhd24uYmluZChudWxsLCBwaWVjZS5jb2xvcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdrbmlnaHQnOlxuICAgICAgbW9iaWxpdHkgPSBrbmlnaHQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiaXNob3AnOlxuICAgICAgbW9iaWxpdHkgPSBiaXNob3A7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyb29rJzpcbiAgICAgIG1vYmlsaXR5ID0gcm9vaztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3F1ZWVuJzpcbiAgICAgIG1vYmlsaXR5ID0gcXVlZW47XG4gICAgICBicmVhaztcbiAgICBjYXNlICdraW5nJzpcbiAgICAgIG1vYmlsaXR5ID0ga2luZy5iaW5kKG51bGwsIHBpZWNlLmNvbG9yLCByb29rRmlsZXNPZihwaWVjZXMsIHBpZWNlLmNvbG9yKSwgY2FuQ2FzdGxlKTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB1dGlsLmFsbFBvcy5maWx0ZXIoZnVuY3Rpb24ocG9zMikge1xuICAgIHJldHVybiAocG9zWzBdICE9PSBwb3MyWzBdIHx8IHBvc1sxXSAhPT0gcG9zMlsxXSkgJiYgbW9iaWxpdHkocG9zWzBdLCBwb3NbMV0sIHBvczJbMF0sIHBvczJbMV0pO1xuICB9KS5tYXAodXRpbC5wb3Mya2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlO1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIga2V5MnBvcyA9IHJlcXVpcmUoJy4vdXRpbCcpLmtleTJwb3M7XG52YXIgaXNUcmlkZW50ID0gcmVxdWlyZSgnLi91dGlsJykuaXNUcmlkZW50O1xuXG5mdW5jdGlvbiBjaXJjbGVXaWR0aChjdXJyZW50LCBib3VuZHMpIHtcbiAgcmV0dXJuIChjdXJyZW50ID8gMyA6IDQpIC8gNTEyICogYm91bmRzLndpZHRoO1xufVxuXG5mdW5jdGlvbiBsaW5lV2lkdGgoYnJ1c2gsIGN1cnJlbnQsIGJvdW5kcykge1xuICByZXR1cm4gKGJydXNoLmxpbmVXaWR0aCB8fCAxMCkgKiAoY3VycmVudCA/IDAuODUgOiAxKSAvIDUxMiAqIGJvdW5kcy53aWR0aDtcbn1cblxuZnVuY3Rpb24gb3BhY2l0eShicnVzaCwgY3VycmVudCkge1xuICByZXR1cm4gKGJydXNoLm9wYWNpdHkgfHwgMSkgKiAoY3VycmVudCA/IDAuOSA6IDEpO1xufVxuXG5mdW5jdGlvbiBhcnJvd01hcmdpbihjdXJyZW50LCBib3VuZHMpIHtcbiAgcmV0dXJuIGlzVHJpZGVudCgpID8gMCA6ICgoY3VycmVudCA/IDEwIDogMjApIC8gNTEyICogYm91bmRzLndpZHRoKTtcbn1cblxuZnVuY3Rpb24gcG9zMnB4KHBvcywgYm91bmRzKSB7XG4gIHZhciBzcXVhcmVTaXplID0gYm91bmRzLndpZHRoIC8gODtcbiAgcmV0dXJuIFsocG9zWzBdIC0gMC41KSAqIHNxdWFyZVNpemUsICg4LjUgLSBwb3NbMV0pICogc3F1YXJlU2l6ZV07XG59XG5cbmZ1bmN0aW9uIGNpcmNsZShicnVzaCwgcG9zLCBjdXJyZW50LCBib3VuZHMpIHtcbiAgdmFyIG8gPSBwb3MycHgocG9zLCBib3VuZHMpO1xuICB2YXIgd2lkdGggPSBjaXJjbGVXaWR0aChjdXJyZW50LCBib3VuZHMpO1xuICB2YXIgcmFkaXVzID0gYm91bmRzLndpZHRoIC8gMTY7XG4gIHJldHVybiB7XG4gICAgdGFnOiAnY2lyY2xlJyxcbiAgICBhdHRyczoge1xuICAgICAga2V5OiBjdXJyZW50ID8gJ2N1cnJlbnQnIDogcG9zICsgYnJ1c2gua2V5LFxuICAgICAgc3Ryb2tlOiBicnVzaC5jb2xvcixcbiAgICAgICdzdHJva2Utd2lkdGgnOiB3aWR0aCxcbiAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHkoYnJ1c2gsIGN1cnJlbnQpLFxuICAgICAgY3g6IG9bMF0sXG4gICAgICBjeTogb1sxXSxcbiAgICAgIHI6IHJhZGl1cyAtIHdpZHRoIC8gMlxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYXJyb3coYnJ1c2gsIG9yaWcsIGRlc3QsIGN1cnJlbnQsIGJvdW5kcykge1xuICB2YXIgbSA9IGFycm93TWFyZ2luKGN1cnJlbnQsIGJvdW5kcyk7XG4gIHZhciBhID0gcG9zMnB4KG9yaWcsIGJvdW5kcyk7XG4gIHZhciBiID0gcG9zMnB4KGRlc3QsIGJvdW5kcyk7XG4gIHZhciBkeCA9IGJbMF0gLSBhWzBdLFxuICAgIGR5ID0gYlsxXSAtIGFbMV0sXG4gICAgYW5nbGUgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gIHZhciB4byA9IE1hdGguY29zKGFuZ2xlKSAqIG0sXG4gICAgeW8gPSBNYXRoLnNpbihhbmdsZSkgKiBtO1xuICByZXR1cm4ge1xuICAgIHRhZzogJ2xpbmUnLFxuICAgIGF0dHJzOiB7XG4gICAgICBrZXk6IGN1cnJlbnQgPyAnY3VycmVudCcgOiBvcmlnICsgZGVzdCArIGJydXNoLmtleSxcbiAgICAgIHN0cm9rZTogYnJ1c2guY29sb3IsXG4gICAgICAnc3Ryb2tlLXdpZHRoJzogbGluZVdpZHRoKGJydXNoLCBjdXJyZW50LCBib3VuZHMpLFxuICAgICAgJ3N0cm9rZS1saW5lY2FwJzogJ3JvdW5kJyxcbiAgICAgICdtYXJrZXItZW5kJzogaXNUcmlkZW50KCkgPyBudWxsIDogJ3VybCgjYXJyb3doZWFkLScgKyBicnVzaC5rZXkgKyAnKScsXG4gICAgICBvcGFjaXR5OiBvcGFjaXR5KGJydXNoLCBjdXJyZW50KSxcbiAgICAgIHgxOiBhWzBdLFxuICAgICAgeTE6IGFbMV0sXG4gICAgICB4MjogYlswXSAtIHhvLFxuICAgICAgeTI6IGJbMV0gLSB5b1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gcGllY2UoY2ZnLCBwb3MsIHBpZWNlLCBib3VuZHMpIHtcbiAgdmFyIG8gPSBwb3MycHgocG9zLCBib3VuZHMpO1xuICB2YXIgc2l6ZSA9IGJvdW5kcy53aWR0aCAvIDggKiAocGllY2Uuc2NhbGUgfHwgMSk7XG4gIHZhciBuYW1lID0gcGllY2UuY29sb3IgPT09ICd3aGl0ZScgPyAndycgOiAnYic7XG4gIG5hbWUgKz0gKHBpZWNlLnJvbGUgPT09ICdrbmlnaHQnID8gJ24nIDogcGllY2Uucm9sZVswXSkudG9VcHBlckNhc2UoKTtcbiAgdmFyIGhyZWYgPSBjZmcuYmFzZVVybCArIG5hbWUgKyAnLnN2Zyc7XG4gIHJldHVybiB7XG4gICAgdGFnOiAnaW1hZ2UnLFxuICAgIGF0dHJzOiB7XG4gICAgICBjbGFzczogcGllY2UuY29sb3IgKyAnICcgKyBwaWVjZS5yb2xlLFxuICAgICAgeDogb1swXSAtIHNpemUgLyAyLFxuICAgICAgeTogb1sxXSAtIHNpemUgLyAyLFxuICAgICAgd2lkdGg6IHNpemUsXG4gICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICBocmVmOiBocmVmXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkZWZzKGJydXNoZXMpIHtcbiAgcmV0dXJuIHtcbiAgICB0YWc6ICdkZWZzJyxcbiAgICBjaGlsZHJlbjogW1xuICAgICAgYnJ1c2hlcy5tYXAoZnVuY3Rpb24oYnJ1c2gpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IGJydXNoLmtleSxcbiAgICAgICAgICB0YWc6ICdtYXJrZXInLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICBpZDogJ2Fycm93aGVhZC0nICsgYnJ1c2gua2V5LFxuICAgICAgICAgICAgb3JpZW50OiAnYXV0bycsXG4gICAgICAgICAgICBtYXJrZXJXaWR0aDogNCxcbiAgICAgICAgICAgIG1hcmtlckhlaWdodDogOCxcbiAgICAgICAgICAgIHJlZlg6IDIuMDUsXG4gICAgICAgICAgICByZWZZOiAyLjAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGlsZHJlbjogW3tcbiAgICAgICAgICAgIHRhZzogJ3BhdGgnLFxuICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgZDogJ00wLDAgVjQgTDMsMiBaJyxcbiAgICAgICAgICAgICAgZmlsbDogYnJ1c2guY29sb3JcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIF1cbiAgfTtcbn1cblxuZnVuY3Rpb24gb3JpZW50KHBvcywgY29sb3IpIHtcbiAgcmV0dXJuIGNvbG9yID09PSAnd2hpdGUnID8gcG9zIDogWzkgLSBwb3NbMF0sIDkgLSBwb3NbMV1dO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTaGFwZShkYXRhLCBjdXJyZW50LCBib3VuZHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHNoYXBlLCBpKSB7XG4gICAgaWYgKHNoYXBlLnBpZWNlKSByZXR1cm4gcGllY2UoXG4gICAgICBkYXRhLmRyYXdhYmxlLnBpZWNlcyxcbiAgICAgIG9yaWVudChrZXkycG9zKHNoYXBlLm9yaWcpLCBkYXRhLm9yaWVudGF0aW9uKSxcbiAgICAgIHNoYXBlLnBpZWNlLFxuICAgICAgYm91bmRzKTtcbiAgICBlbHNlIGlmIChzaGFwZS5icnVzaCkge1xuICAgICAgdmFyIGJydXNoID0gc2hhcGUuYnJ1c2hNb2RpZmllcnMgP1xuICAgICAgICBtYWtlQ3VzdG9tQnJ1c2goZGF0YS5kcmF3YWJsZS5icnVzaGVzW3NoYXBlLmJydXNoXSwgc2hhcGUuYnJ1c2hNb2RpZmllcnMsIGkpIDpcbiAgICAgICAgZGF0YS5kcmF3YWJsZS5icnVzaGVzW3NoYXBlLmJydXNoXTtcbiAgICAgIHZhciBvcmlnID0gb3JpZW50KGtleTJwb3Moc2hhcGUub3JpZyksIGRhdGEub3JpZW50YXRpb24pO1xuICAgICAgaWYgKHNoYXBlLm9yaWcgJiYgc2hhcGUuZGVzdCkgcmV0dXJuIGFycm93KFxuICAgICAgICBicnVzaCxcbiAgICAgICAgb3JpZyxcbiAgICAgICAgb3JpZW50KGtleTJwb3Moc2hhcGUuZGVzdCksIGRhdGEub3JpZW50YXRpb24pLFxuICAgICAgICBjdXJyZW50LCBib3VuZHMpO1xuICAgICAgZWxzZSBpZiAoc2hhcGUub3JpZykgcmV0dXJuIGNpcmNsZShcbiAgICAgICAgYnJ1c2gsXG4gICAgICAgIG9yaWcsXG4gICAgICAgIGN1cnJlbnQsIGJvdW5kcyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYWtlQ3VzdG9tQnJ1c2goYmFzZSwgbW9kaWZpZXJzLCBpKSB7XG4gIHJldHVybiB7XG4gICAga2V5OiAnYm0nICsgaSxcbiAgICBjb2xvcjogbW9kaWZpZXJzLmNvbG9yIHx8IGJhc2UuY29sb3IsXG4gICAgb3BhY2l0eTogbW9kaWZpZXJzLm9wYWNpdHkgfHwgYmFzZS5vcGFjaXR5LFxuICAgIGxpbmVXaWR0aDogbW9kaWZpZXJzLmxpbmVXaWR0aCB8fCBiYXNlLmxpbmVXaWR0aFxuICB9O1xufVxuXG5mdW5jdGlvbiBjb21wdXRlVXNlZEJydXNoZXMoZCwgZHJhd24sIGN1cnJlbnQpIHtcbiAgdmFyIGJydXNoZXMgPSBbXTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNoYXBlcyA9IChjdXJyZW50ICYmIGN1cnJlbnQuZGVzdCkgPyBkcmF3bi5jb25jYXQoY3VycmVudCkgOiBkcmF3bjtcbiAgZm9yICh2YXIgaSBpbiBzaGFwZXMpIHtcbiAgICB2YXIgc2hhcGUgPSBzaGFwZXNbaV07XG4gICAgaWYgKCFzaGFwZS5kZXN0KSBjb250aW51ZTtcbiAgICB2YXIgYnJ1c2hLZXkgPSBzaGFwZS5icnVzaDtcbiAgICBpZiAoc2hhcGUuYnJ1c2hNb2RpZmllcnMpXG4gICAgICBicnVzaGVzLnB1c2gobWFrZUN1c3RvbUJydXNoKGQuYnJ1c2hlc1ticnVzaEtleV0sIHNoYXBlLmJydXNoTW9kaWZpZXJzLCBpKSk7XG4gICAgZWxzZSB7XG4gICAgICBpZiAoa2V5cy5pbmRleE9mKGJydXNoS2V5KSA9PT0gLTEpIHtcbiAgICAgICAgYnJ1c2hlcy5wdXNoKGQuYnJ1c2hlc1ticnVzaEtleV0pO1xuICAgICAgICBrZXlzLnB1c2goYnJ1c2hLZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnJ1c2hlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHJsKSB7XG4gIGlmICghY3RybC5kYXRhLmJvdW5kcykgcmV0dXJuO1xuICB2YXIgZCA9IGN0cmwuZGF0YS5kcmF3YWJsZTtcbiAgdmFyIGFsbFNoYXBlcyA9IGQuc2hhcGVzLmNvbmNhdChkLmF1dG9TaGFwZXMpO1xuICBpZiAoIWFsbFNoYXBlcy5sZW5ndGggJiYgIWQuY3VycmVudC5vcmlnKSByZXR1cm47XG4gIHZhciBib3VuZHMgPSBjdHJsLmRhdGEuYm91bmRzKCk7XG4gIGlmIChib3VuZHMud2lkdGggIT09IGJvdW5kcy5oZWlnaHQpIHJldHVybjtcbiAgdmFyIHVzZWRCcnVzaGVzID0gY29tcHV0ZVVzZWRCcnVzaGVzKGQsIGFsbFNoYXBlcywgZC5jdXJyZW50KTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6ICdzdmcnLFxuICAgIGF0dHJzOiB7XG4gICAgICBrZXk6ICdzdmcnXG4gICAgfSxcbiAgICBjaGlsZHJlbjogW1xuICAgICAgZGVmcyh1c2VkQnJ1c2hlcyksXG4gICAgICBhbGxTaGFwZXMubWFwKHJlbmRlclNoYXBlKGN0cmwuZGF0YSwgZmFsc2UsIGJvdW5kcykpLFxuICAgICAgcmVuZGVyU2hhcGUoY3RybC5kYXRhLCB0cnVlLCBib3VuZHMpKGQuY3VycmVudCwgOTk5OSlcbiAgICBdXG4gIH07XG59XG4iLCJ2YXIgZmlsZXMgPSBcImFiY2RlZmdoXCIuc3BsaXQoJycpO1xudmFyIHJhbmtzID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdO1xudmFyIGludlJhbmtzID0gWzgsIDcsIDYsIDUsIDQsIDMsIDIsIDFdO1xudmFyIGZpbGVOdW1iZXJzID0ge1xuICBhOiAxLFxuICBiOiAyLFxuICBjOiAzLFxuICBkOiA0LFxuICBlOiA1LFxuICBmOiA2LFxuICBnOiA3LFxuICBoOiA4XG59O1xuXG5mdW5jdGlvbiBwb3Mya2V5KHBvcykge1xuICByZXR1cm4gZmlsZXNbcG9zWzBdIC0gMV0gKyBwb3NbMV07XG59XG5cbmZ1bmN0aW9uIGtleTJwb3MocG9zKSB7XG4gIHJldHVybiBbZmlsZU51bWJlcnNbcG9zWzBdXSwgcGFyc2VJbnQocG9zWzFdKV07XG59XG5cbmZ1bmN0aW9uIGludmVydEtleShrZXkpIHtcbiAgcmV0dXJuIGZpbGVzWzggLSBmaWxlTnVtYmVyc1trZXlbMF1dXSArICg5IC0gcGFyc2VJbnQoa2V5WzFdKSk7XG59XG5cbnZhciBhbGxQb3MgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcyA9IFtdO1xuICBpbnZSYW5rcy5mb3JFYWNoKGZ1bmN0aW9uKHkpIHtcbiAgICByYW5rcy5mb3JFYWNoKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHBzLnB1c2goW3gsIHldKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBwcztcbn0pKCk7XG52YXIgYWxsS2V5cyA9IGFsbFBvcy5tYXAocG9zMmtleSk7XG52YXIgaW52S2V5cyA9IGFsbEtleXMuc2xpY2UoMCkucmV2ZXJzZSgpO1xuXG5mdW5jdGlvbiBjbGFzc1NldChjbGFzc2VzKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSBpbiBjbGFzc2VzKSB7XG4gICAgaWYgKGNsYXNzZXNbaV0pIGFyci5wdXNoKGkpO1xuICB9XG4gIHJldHVybiBhcnIuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBvcHBvc2l0ZShjb2xvcikge1xuICByZXR1cm4gY29sb3IgPT09ICd3aGl0ZScgPyAnYmxhY2snIDogJ3doaXRlJztcbn1cblxuZnVuY3Rpb24gY29udGFpbnNYKHhzLCB4KSB7XG4gIHJldHVybiB4cyAmJiB4cy5pbmRleE9mKHgpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gZGlzdGFuY2UocG9zMSwgcG9zMikge1xuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHBvczFbMF0gLSBwb3MyWzBdLCAyKSArIE1hdGgucG93KHBvczFbMV0gLSBwb3MyWzFdLCAyKSk7XG59XG5cbi8vIHRoaXMgbXVzdCBiZSBjYWNoZWQgYmVjYXVzZSBvZiB0aGUgYWNjZXNzIHRvIGRvY3VtZW50LmJvZHkuc3R5bGVcbnZhciBjYWNoZWRUcmFuc2Zvcm1Qcm9wO1xuXG5mdW5jdGlvbiBjb21wdXRlVHJhbnNmb3JtUHJvcCgpIHtcbiAgcmV0dXJuICd0cmFuc2Zvcm0nIGluIGRvY3VtZW50LmJvZHkuc3R5bGUgP1xuICAgICd0cmFuc2Zvcm0nIDogJ3dlYmtpdFRyYW5zZm9ybScgaW4gZG9jdW1lbnQuYm9keS5zdHlsZSA/XG4gICAgJ3dlYmtpdFRyYW5zZm9ybScgOiAnbW96VHJhbnNmb3JtJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlID9cbiAgICAnbW96VHJhbnNmb3JtJyA6ICdvVHJhbnNmb3JtJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlID9cbiAgICAnb1RyYW5zZm9ybScgOiAnbXNUcmFuc2Zvcm0nO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wKCkge1xuICBpZiAoIWNhY2hlZFRyYW5zZm9ybVByb3ApIGNhY2hlZFRyYW5zZm9ybVByb3AgPSBjb21wdXRlVHJhbnNmb3JtUHJvcCgpO1xuICByZXR1cm4gY2FjaGVkVHJhbnNmb3JtUHJvcDtcbn1cblxudmFyIGNhY2hlZElzVHJpZGVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIGlzVHJpZGVudCgpIHtcbiAgaWYgKGNhY2hlZElzVHJpZGVudCA9PT0gbnVsbClcbiAgICBjYWNoZWRJc1RyaWRlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdUcmlkZW50LycpID4gLTE7XG4gIHJldHVybiBjYWNoZWRJc1RyaWRlbnQ7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZShwb3MpIHtcbiAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHBvc1swXSArICdweCwnICsgcG9zWzFdICsgJ3B4KSc7XG59XG5cbmZ1bmN0aW9uIGV2ZW50UG9zaXRpb24oZSkge1xuICBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WCA9PT0gMCkgcmV0dXJuIFtlLmNsaWVudFgsIGUuY2xpZW50WV07XG4gIGlmIChlLnRvdWNoZXMgJiYgZS50YXJnZXRUb3VjaGVzWzBdKSByZXR1cm4gW2UudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBlLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WV07XG59XG5cbmZ1bmN0aW9uIHBhcnRpYWxBcHBseShmbiwgYXJncykge1xuICByZXR1cm4gZm4uYmluZC5hcHBseShmbiwgW251bGxdLmNvbmNhdChhcmdzKSk7XG59XG5cbmZ1bmN0aW9uIHBhcnRpYWwoKSB7XG4gIHJldHVybiBwYXJ0aWFsQXBwbHkoYXJndW1lbnRzWzBdLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbn1cblxuZnVuY3Rpb24gaXNSaWdodEJ1dHRvbihlKSB7XG4gIHJldHVybiBlLmJ1dHRvbnMgPT09IDIgfHwgZS5idXR0b24gPT09IDI7XG59XG5cbmZ1bmN0aW9uIG1lbW8oZikge1xuICB2YXIgdiwgcmV0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkgdiA9IGYoKTtcbiAgICByZXR1cm4gdjtcbiAgfTtcbiAgcmV0LmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdiA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZmlsZXM6IGZpbGVzLFxuICByYW5rczogcmFua3MsXG4gIGludlJhbmtzOiBpbnZSYW5rcyxcbiAgYWxsUG9zOiBhbGxQb3MsXG4gIGFsbEtleXM6IGFsbEtleXMsXG4gIGludktleXM6IGludktleXMsXG4gIHBvczJrZXk6IHBvczJrZXksXG4gIGtleTJwb3M6IGtleTJwb3MsXG4gIGludmVydEtleTogaW52ZXJ0S2V5LFxuICBjbGFzc1NldDogY2xhc3NTZXQsXG4gIG9wcG9zaXRlOiBvcHBvc2l0ZSxcbiAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gIGNvbnRhaW5zWDogY29udGFpbnNYLFxuICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gIGV2ZW50UG9zaXRpb246IGV2ZW50UG9zaXRpb24sXG4gIHBhcnRpYWxBcHBseTogcGFydGlhbEFwcGx5LFxuICBwYXJ0aWFsOiBwYXJ0aWFsLFxuICB0cmFuc2Zvcm1Qcm9wOiB0cmFuc2Zvcm1Qcm9wLFxuICBpc1RyaWRlbnQ6IGlzVHJpZGVudCxcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dCkuYmluZCh3aW5kb3cpLFxuICBpc1JpZ2h0QnV0dG9uOiBpc1JpZ2h0QnV0dG9uLFxuICBtZW1vOiBtZW1vXG59O1xuIiwidmFyIGRyYWcgPSByZXF1aXJlKCcuL2RyYWcnKTtcbnZhciBkcmF3ID0gcmVxdWlyZSgnLi9kcmF3Jyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHN2ZyA9IHJlcXVpcmUoJy4vc3ZnJyk7XG52YXIgbWFrZUNvb3JkcyA9IHJlcXVpcmUoJy4vY29vcmRzJyk7XG52YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxudmFyIHBpZWNlVGFnID0gJ3BpZWNlJztcbnZhciBzcXVhcmVUYWcgPSAnc3F1YXJlJztcblxuZnVuY3Rpb24gcGllY2VDbGFzcyhwKSB7XG4gIHJldHVybiBwLnJvbGUgKyAnICcgKyBwLmNvbG9yO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQaWVjZShkLCBrZXksIGN0eCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAga2V5OiAncCcgKyBrZXksXG4gICAgc3R5bGU6IHt9LFxuICAgIGNsYXNzOiBwaWVjZUNsYXNzKGQucGllY2VzW2tleV0pXG4gIH07XG4gIHZhciB0cmFuc2xhdGUgPSBwb3NUb1RyYW5zbGF0ZSh1dGlsLmtleTJwb3Moa2V5KSwgY3R4KTtcbiAgdmFyIGRyYWdnYWJsZSA9IGQuZHJhZ2dhYmxlLmN1cnJlbnQ7XG4gIGlmIChkcmFnZ2FibGUub3JpZyA9PT0ga2V5ICYmIGRyYWdnYWJsZS5zdGFydGVkKSB7XG4gICAgdHJhbnNsYXRlWzBdICs9IGRyYWdnYWJsZS5wb3NbMF0gKyBkcmFnZ2FibGUuZGVjWzBdO1xuICAgIHRyYW5zbGF0ZVsxXSArPSBkcmFnZ2FibGUucG9zWzFdICsgZHJhZ2dhYmxlLmRlY1sxXTtcbiAgICBhdHRycy5jbGFzcyArPSAnIGRyYWdnaW5nJztcbiAgfSBlbHNlIGlmIChkLmFuaW1hdGlvbi5jdXJyZW50LmFuaW1zKSB7XG4gICAgdmFyIGFuaW1hdGlvbiA9IGQuYW5pbWF0aW9uLmN1cnJlbnQuYW5pbXNba2V5XTtcbiAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICB0cmFuc2xhdGVbMF0gKz0gYW5pbWF0aW9uWzFdWzBdO1xuICAgICAgdHJhbnNsYXRlWzFdICs9IGFuaW1hdGlvblsxXVsxXTtcbiAgICB9XG4gIH1cbiAgYXR0cnMuc3R5bGVbY3R4LnRyYW5zZm9ybVByb3BdID0gdXRpbC50cmFuc2xhdGUodHJhbnNsYXRlKTtcbiAgaWYgKGQucGllY2VLZXkpIGF0dHJzWydkYXRhLWtleSddID0ga2V5O1xuICByZXR1cm4ge1xuICAgIHRhZzogcGllY2VUYWcsXG4gICAgYXR0cnM6IGF0dHJzXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNxdWFyZShrZXksIGNsYXNzZXMsIGN0eCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAga2V5OiAncycgKyBrZXksXG4gICAgY2xhc3M6IGNsYXNzZXMsXG4gICAgc3R5bGU6IHt9XG4gIH07XG4gIGF0dHJzLnN0eWxlW2N0eC50cmFuc2Zvcm1Qcm9wXSA9IHV0aWwudHJhbnNsYXRlKHBvc1RvVHJhbnNsYXRlKHV0aWwua2V5MnBvcyhrZXkpLCBjdHgpKTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6IHNxdWFyZVRhZyxcbiAgICBhdHRyczogYXR0cnNcbiAgfTtcbn1cblxuZnVuY3Rpb24gcG9zVG9UcmFuc2xhdGUocG9zLCBjdHgpIHtcbiAgcmV0dXJuIFtcbiAgICAoY3R4LmFzV2hpdGUgPyBwb3NbMF0gLSAxIDogOCAtIHBvc1swXSkgKiBjdHguYm91bmRzLndpZHRoIC8gOCwgKGN0eC5hc1doaXRlID8gOCAtIHBvc1sxXSA6IHBvc1sxXSAtIDEpICogY3R4LmJvdW5kcy5oZWlnaHQgLyA4XG4gIF07XG59XG5cbmZ1bmN0aW9uIHJlbmRlckdob3N0KGtleSwgcGllY2UsIGN0eCkge1xuICBpZiAoIXBpZWNlKSByZXR1cm47XG4gIHZhciBhdHRycyA9IHtcbiAgICBrZXk6ICdnJyArIGtleSxcbiAgICBzdHlsZToge30sXG4gICAgY2xhc3M6IHBpZWNlQ2xhc3MocGllY2UpICsgJyBnaG9zdCdcbiAgfTtcbiAgYXR0cnMuc3R5bGVbY3R4LnRyYW5zZm9ybVByb3BdID0gdXRpbC50cmFuc2xhdGUocG9zVG9UcmFuc2xhdGUodXRpbC5rZXkycG9zKGtleSksIGN0eCkpO1xuICByZXR1cm4ge1xuICAgIHRhZzogcGllY2VUYWcsXG4gICAgYXR0cnM6IGF0dHJzXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlckZhZGluZyhjZmcsIGN0eCkge1xuICB2YXIgYXR0cnMgPSB7XG4gICAga2V5OiAnZicgKyBjZmcucGllY2Uua2V5LFxuICAgIGNsYXNzOiAnZmFkaW5nICcgKyBwaWVjZUNsYXNzKGNmZy5waWVjZSksXG4gICAgc3R5bGU6IHtcbiAgICAgIG9wYWNpdHk6IGNmZy5vcGFjaXR5XG4gICAgfVxuICB9O1xuICBhdHRycy5zdHlsZVtjdHgudHJhbnNmb3JtUHJvcF0gPSB1dGlsLnRyYW5zbGF0ZShwb3NUb1RyYW5zbGF0ZShjZmcucGllY2UucG9zLCBjdHgpKTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6IHBpZWNlVGFnLFxuICAgIGF0dHJzOiBhdHRyc1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRTcXVhcmUoc3F1YXJlcywga2V5LCBrbGFzcykge1xuICBpZiAoc3F1YXJlc1trZXldKSBzcXVhcmVzW2tleV0ucHVzaChrbGFzcyk7XG4gIGVsc2Ugc3F1YXJlc1trZXldID0gW2tsYXNzXTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU3F1YXJlcyhjdHJsLCBjdHgpIHtcbiAgdmFyIGQgPSBjdHJsLmRhdGE7XG4gIHZhciBzcXVhcmVzID0ge307XG4gIGlmIChkLmxhc3RNb3ZlICYmIGQuaGlnaGxpZ2h0Lmxhc3RNb3ZlKSBkLmxhc3RNb3ZlLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnbGFzdC1tb3ZlJyk7XG4gIH0pO1xuICBpZiAoZC5jaGVjayAmJiBkLmhpZ2hsaWdodC5jaGVjaykgYWRkU3F1YXJlKHNxdWFyZXMsIGQuY2hlY2ssICdjaGVjaycpO1xuICBpZiAoZC5zZWxlY3RlZCkge1xuICAgIGFkZFNxdWFyZShzcXVhcmVzLCBkLnNlbGVjdGVkLCAnc2VsZWN0ZWQnKTtcbiAgICB2YXIgb3ZlciA9IGQuZHJhZ2dhYmxlLmN1cnJlbnQub3ZlcjtcbiAgICB2YXIgZGVzdHMgPSBkLm1vdmFibGUuZGVzdHNbZC5zZWxlY3RlZF07XG4gICAgaWYgKGRlc3RzKSBkZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmIChrID09PSBvdmVyKSBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ21vdmUtZGVzdCBkcmFnLW92ZXInKTtcbiAgICAgIGVsc2UgaWYgKGQubW92YWJsZS5zaG93RGVzdHMpIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnbW92ZS1kZXN0JyArIChkLnBpZWNlc1trXSA/ICcgb2MnIDogJycpKTtcbiAgICB9KTtcbiAgICB2YXIgcERlc3RzID0gZC5wcmVtb3ZhYmxlLmRlc3RzO1xuICAgIGlmIChwRGVzdHMpIHBEZXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmIChrID09PSBvdmVyKSBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ3ByZW1vdmUtZGVzdCBkcmFnLW92ZXInKTtcbiAgICAgIGVsc2UgaWYgKGQubW92YWJsZS5zaG93RGVzdHMpIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAncHJlbW92ZS1kZXN0JyArIChkLnBpZWNlc1trXSA/ICcgb2MnIDogJycpKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgcHJlbW92ZSA9IGQucHJlbW92YWJsZS5jdXJyZW50O1xuICBpZiAocHJlbW92ZSkgcHJlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBhZGRTcXVhcmUoc3F1YXJlcywgaywgJ2N1cnJlbnQtcHJlbW92ZScpO1xuICB9KTtcbiAgZWxzZSBpZiAoZC5wcmVkcm9wcGFibGUuY3VycmVudC5rZXkpXG4gICAgYWRkU3F1YXJlKHNxdWFyZXMsIGQucHJlZHJvcHBhYmxlLmN1cnJlbnQua2V5LCAnY3VycmVudC1wcmVtb3ZlJyk7XG5cbiAgaWYgKGN0cmwudm0uZXhwbG9kaW5nKSBjdHJsLnZtLmV4cGxvZGluZy5rZXlzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGFkZFNxdWFyZShzcXVhcmVzLCBrLCAnZXhwbG9kaW5nJyArIGN0cmwudm0uZXhwbG9kaW5nLnN0YWdlKTtcbiAgfSk7XG5cbiAgdmFyIGRvbSA9IFtdO1xuICBpZiAoZC5pdGVtcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgdmFyIGtleSA9IHV0aWwuYWxsS2V5c1tpXTtcbiAgICAgIHZhciBzcXVhcmUgPSBzcXVhcmVzW2tleV07XG4gICAgICB2YXIgaXRlbSA9IGQuaXRlbXMucmVuZGVyKHV0aWwua2V5MnBvcyhrZXkpLCBrZXkpO1xuICAgICAgaWYgKHNxdWFyZSB8fCBpdGVtKSB7XG4gICAgICAgIHZhciBzcSA9IHJlbmRlclNxdWFyZShrZXksIHNxdWFyZSA/IHNxdWFyZS5qb2luKCcgJykgKyAoaXRlbSA/ICcgaGFzLWl0ZW0nIDogJycpIDogJ2hhcy1pdGVtJywgY3R4KTtcbiAgICAgICAgaWYgKGl0ZW0pIHNxLmNoaWxkcmVuID0gW2l0ZW1dO1xuICAgICAgICBkb20ucHVzaChzcSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGtleSBpbiBzcXVhcmVzKVxuICAgICAgZG9tLnB1c2gocmVuZGVyU3F1YXJlKGtleSwgc3F1YXJlc1trZXldLmpvaW4oJyAnKSwgY3R4KSk7XG4gIH1cbiAgcmV0dXJuIGRvbTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQ29udGVudChjdHJsKSB7XG4gIHZhciBkID0gY3RybC5kYXRhO1xuICBpZiAoIWQuYm91bmRzKSByZXR1cm47XG4gIHZhciBjdHggPSB7XG4gICAgYXNXaGl0ZTogZC5vcmllbnRhdGlvbiA9PT0gJ3doaXRlJyxcbiAgICBib3VuZHM6IGQuYm91bmRzKCksXG4gICAgdHJhbnNmb3JtUHJvcDogdXRpbC50cmFuc2Zvcm1Qcm9wKClcbiAgfTtcbiAgdmFyIGNoaWxkcmVuID0gcmVuZGVyU3F1YXJlcyhjdHJsLCBjdHgpO1xuICBpZiAoZC5hbmltYXRpb24uY3VycmVudC5mYWRpbmdzKVxuICAgIGQuYW5pbWF0aW9uLmN1cnJlbnQuZmFkaW5ncy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICAgIGNoaWxkcmVuLnB1c2gocmVuZGVyRmFkaW5nKHAsIGN0eCkpO1xuICAgIH0pO1xuXG4gIC8vIG11c3QgaW5zZXJ0IHBpZWNlcyBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgLy8gZm9yIDNEIHRvIGRpc3BsYXkgY29ycmVjdGx5XG4gIHZhciBrZXlzID0gY3R4LmFzV2hpdGUgPyB1dGlsLmFsbEtleXMgOiB1dGlsLmludktleXM7XG4gIGlmIChkLml0ZW1zKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgaWYgKGQucGllY2VzW2tleXNbaV1dICYmICFkLml0ZW1zLnJlbmRlcih1dGlsLmtleTJwb3Moa2V5c1tpXSksIGtleXNbaV0pKVxuICAgICAgICBjaGlsZHJlbi5wdXNoKHJlbmRlclBpZWNlKGQsIGtleXNbaV0sIGN0eCkpO1xuICAgIH0gZWxzZVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAgIGlmIChkLnBpZWNlc1trZXlzW2ldXSkgY2hpbGRyZW4ucHVzaChyZW5kZXJQaWVjZShkLCBrZXlzW2ldLCBjdHgpKTtcbiAgICAgIH1cblxuICBpZiAoZC5kcmFnZ2FibGUuc2hvd0dob3N0KSB7XG4gICAgdmFyIGRyYWdPcmlnID0gZC5kcmFnZ2FibGUuY3VycmVudC5vcmlnO1xuICAgIGlmIChkcmFnT3JpZyAmJiAhZC5kcmFnZ2FibGUuY3VycmVudC5uZXdQaWVjZSlcbiAgICAgIGNoaWxkcmVuLnB1c2gocmVuZGVyR2hvc3QoZHJhZ09yaWcsIGQucGllY2VzW2RyYWdPcmlnXSwgY3R4KSk7XG4gIH1cbiAgaWYgKGQuZHJhd2FibGUuZW5hYmxlZCkgY2hpbGRyZW4ucHVzaChzdmcoY3RybCkpO1xuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIHN0YXJ0RHJhZ09yRHJhdyhkKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKHV0aWwuaXNSaWdodEJ1dHRvbihlKSAmJiBkLmRyYWdnYWJsZS5jdXJyZW50Lm9yaWcpIHtcbiAgICAgIGlmIChkLmRyYWdnYWJsZS5jdXJyZW50Lm5ld1BpZWNlKSBkZWxldGUgZC5waWVjZXNbZC5kcmFnZ2FibGUuY3VycmVudC5vcmlnXTtcbiAgICAgIGQuZHJhZ2dhYmxlLmN1cnJlbnQgPSB7fVxuICAgICAgZC5zZWxlY3RlZCA9IG51bGw7XG4gICAgfSBlbHNlIGlmICgoZS5zaGlmdEtleSB8fCB1dGlsLmlzUmlnaHRCdXR0b24oZSkpICYmIGQuZHJhd2FibGUuZW5hYmxlZCkgZHJhdy5zdGFydChkLCBlKTtcbiAgICBlbHNlIGRyYWcuc3RhcnQoZCwgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRyYWdPckRyYXcoZCwgd2l0aERyYWcsIHdpdGhEcmF3KSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKChlLnNoaWZ0S2V5IHx8IHV0aWwuaXNSaWdodEJ1dHRvbihlKSkgJiYgZC5kcmF3YWJsZS5lbmFibGVkKSB3aXRoRHJhdyhkLCBlKTtcbiAgICBlbHNlIGlmICghZC52aWV3T25seSkgd2l0aERyYWcoZCwgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpbmRFdmVudHMoY3RybCwgZWwsIGNvbnRleHQpIHtcbiAgdmFyIGQgPSBjdHJsLmRhdGE7XG4gIHZhciBvbnN0YXJ0ID0gc3RhcnREcmFnT3JEcmF3KGQpO1xuICB2YXIgb25tb3ZlID0gZHJhZ09yRHJhdyhkLCBkcmFnLm1vdmUsIGRyYXcubW92ZSk7XG4gIHZhciBvbmVuZCA9IGRyYWdPckRyYXcoZCwgZHJhZy5lbmQsIGRyYXcuZW5kKTtcbiAgdmFyIHN0YXJ0RXZlbnRzID0gWyd0b3VjaHN0YXJ0JywgJ21vdXNlZG93biddO1xuICB2YXIgbW92ZUV2ZW50cyA9IFsndG91Y2htb3ZlJywgJ21vdXNlbW92ZSddO1xuICB2YXIgZW5kRXZlbnRzID0gWyd0b3VjaGVuZCcsICdtb3VzZXVwJ107XG4gIHN0YXJ0RXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXYpIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2LCBvbnN0YXJ0KTtcbiAgfSk7XG4gIG1vdmVFdmVudHMuZm9yRWFjaChmdW5jdGlvbihldikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXYsIG9ubW92ZSk7XG4gIH0pO1xuICBlbmRFdmVudHMuZm9yRWFjaChmdW5jdGlvbihldikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXYsIG9uZW5kKTtcbiAgfSk7XG4gIGNvbnRleHQub251bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzdGFydEV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2KSB7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2LCBvbnN0YXJ0KTtcbiAgICB9KTtcbiAgICBtb3ZlRXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXYpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXYsIG9ubW92ZSk7XG4gICAgfSk7XG4gICAgZW5kRXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXYpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXYsIG9uZW5kKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQm9hcmQoY3RybCkge1xuICB2YXIgZCA9IGN0cmwuZGF0YTtcbiAgcmV0dXJuIHtcbiAgICB0YWc6ICdkaXYnLFxuICAgIGF0dHJzOiB7XG4gICAgICBjbGFzczogJ2NnLWJvYXJkIG9yaWVudGF0aW9uLScgKyBkLm9yaWVudGF0aW9uLFxuICAgICAgY29uZmlnOiBmdW5jdGlvbihlbCwgaXNVcGRhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKGlzVXBkYXRlKSByZXR1cm47XG4gICAgICAgIGlmICghZC52aWV3T25seSB8fCBkLmRyYXdhYmxlLmVuYWJsZWQpXG4gICAgICAgICAgYmluZEV2ZW50cyhjdHJsLCBlbCwgY29udGV4dCk7XG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gb25seSByZXBhaW50cyB0aGUgYm9hcmQgaXRzZWxmLlxuICAgICAgICAvLyBpdCdzIGNhbGxlZCB3aGVuIGRyYWdnaW5nIG9yIGFuaW1hdGluZyBwaWVjZXMsXG4gICAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGZ1bGwgYXBwbGljYXRpb24gZW1iZWRkaW5nIGNoZXNzZ3JvdW5kXG4gICAgICAgIC8vIHJlbmRlcmluZyBvbiBldmVyeSBhbmltYXRpb24gZnJhbWVcbiAgICAgICAgZC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtLnJlbmRlcihlbCwgcmVuZGVyQ29udGVudChjdHJsKSk7XG4gICAgICAgIH07XG4gICAgICAgIGQucmVuZGVyUkFGID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdXRpbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZC5yZW5kZXIpO1xuICAgICAgICB9O1xuICAgICAgICBkLmJvdW5kcyA9IHV0aWwubWVtbyhlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QuYmluZChlbCkpO1xuICAgICAgICBkLmVsZW1lbnQgPSBlbDtcbiAgICAgICAgZC5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNoaWxkcmVuOiBbXVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN0cmwpIHtcbiAgdmFyIGQgPSBjdHJsLmRhdGE7XG4gIHJldHVybiB7XG4gICAgdGFnOiAnZGl2JyxcbiAgICBhdHRyczoge1xuICAgICAgY29uZmlnOiBmdW5jdGlvbihlbCwgaXNVcGRhdGUpIHtcbiAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgaWYgKGQucmVkcmF3Q29vcmRzKSBkLnJlZHJhd0Nvb3JkcyhkLm9yaWVudGF0aW9uKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQuY29vcmRpbmF0ZXMpIGQucmVkcmF3Q29vcmRzID0gbWFrZUNvb3JkcyhkLm9yaWVudGF0aW9uLCBlbCk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChkLmRpc2FibGVDb250ZXh0TWVudSB8fCBkLmRyYXdhYmxlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZC5yZXNpemFibGUpXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjaGVzc2dyb3VuZC5yZXNpemUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBkLmJvdW5kcy5jbGVhcigpO1xuICAgICAgICAgICAgZC5yZW5kZXIoKTtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIFsnb25zY3JvbGwnLCAnb25yZXNpemUnXS5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICB2YXIgcHJldiA9IHdpbmRvd1tuXTtcbiAgICAgICAgICB3aW5kb3dbbl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHByZXYgJiYgcHJldigpO1xuICAgICAgICAgICAgZC5ib3VuZHMuY2xlYXIoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBjbGFzczogW1xuICAgICAgICAnY2ctYm9hcmQtd3JhcCcsXG4gICAgICAgIGQudmlld09ubHkgPyAndmlldy1vbmx5JyA6ICdtYW5pcHVsYWJsZSdcbiAgICAgIF0uam9pbignICcpXG4gICAgfSxcbiAgICBjaGlsZHJlbjogW3JlbmRlckJvYXJkKGN0cmwpXVxuICB9O1xufTtcbiIsIi8qIVxyXG4gKiBAbmFtZSBKYXZhU2NyaXB0L05vZGVKUyBNZXJnZSB2MS4yLjBcclxuICogQGF1dGhvciB5ZWlrb3NcclxuICogQHJlcG9zaXRvcnkgaHR0cHM6Ly9naXRodWIuY29tL3llaWtvcy9qcy5tZXJnZVxyXG5cclxuICogQ29weXJpZ2h0IDIwMTQgeWVpa29zIC0gTUlUIGxpY2Vuc2VcclxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS95ZWlrb3MvanMubWVyZ2UvbWFzdGVyL0xJQ0VOU0VcclxuICovXHJcblxyXG47KGZ1bmN0aW9uKGlzTm9kZSkge1xyXG5cclxuXHQvKipcclxuXHQgKiBNZXJnZSBvbmUgb3IgbW9yZSBvYmplY3RzIFxyXG5cdCAqIEBwYXJhbSBib29sPyBjbG9uZVxyXG5cdCAqIEBwYXJhbSBtaXhlZCwuLi4gYXJndW1lbnRzXHJcblx0ICogQHJldHVybiBvYmplY3RcclxuXHQgKi9cclxuXHJcblx0dmFyIFB1YmxpYyA9IGZ1bmN0aW9uKGNsb25lKSB7XHJcblxyXG5cdFx0cmV0dXJuIG1lcmdlKGNsb25lID09PSB0cnVlLCBmYWxzZSwgYXJndW1lbnRzKTtcclxuXHJcblx0fSwgcHVibGljTmFtZSA9ICdtZXJnZSc7XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIHR3byBvciBtb3JlIG9iamVjdHMgcmVjdXJzaXZlbHkgXHJcblx0ICogQHBhcmFtIGJvb2w/IGNsb25lXHJcblx0ICogQHBhcmFtIG1peGVkLC4uLiBhcmd1bWVudHNcclxuXHQgKiBAcmV0dXJuIG9iamVjdFxyXG5cdCAqL1xyXG5cclxuXHRQdWJsaWMucmVjdXJzaXZlID0gZnVuY3Rpb24oY2xvbmUpIHtcclxuXHJcblx0XHRyZXR1cm4gbWVyZ2UoY2xvbmUgPT09IHRydWUsIHRydWUsIGFyZ3VtZW50cyk7XHJcblxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsb25lIHRoZSBpbnB1dCByZW1vdmluZyBhbnkgcmVmZXJlbmNlXHJcblx0ICogQHBhcmFtIG1peGVkIGlucHV0XHJcblx0ICogQHJldHVybiBtaXhlZFxyXG5cdCAqL1xyXG5cclxuXHRQdWJsaWMuY2xvbmUgPSBmdW5jdGlvbihpbnB1dCkge1xyXG5cclxuXHRcdHZhciBvdXRwdXQgPSBpbnB1dCxcclxuXHRcdFx0dHlwZSA9IHR5cGVPZihpbnB1dCksXHJcblx0XHRcdGluZGV4LCBzaXplO1xyXG5cclxuXHRcdGlmICh0eXBlID09PSAnYXJyYXknKSB7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSBbXTtcclxuXHRcdFx0c2l6ZSA9IGlucHV0Lmxlbmd0aDtcclxuXHJcblx0XHRcdGZvciAoaW5kZXg9MDtpbmRleDxzaXplOysraW5kZXgpXHJcblxyXG5cdFx0XHRcdG91dHB1dFtpbmRleF0gPSBQdWJsaWMuY2xvbmUoaW5wdXRbaW5kZXhdKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSB7fTtcclxuXHJcblx0XHRcdGZvciAoaW5kZXggaW4gaW5wdXQpXHJcblxyXG5cdFx0XHRcdG91dHB1dFtpbmRleF0gPSBQdWJsaWMuY2xvbmUoaW5wdXRbaW5kZXhdKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogTWVyZ2UgdHdvIG9iamVjdHMgcmVjdXJzaXZlbHlcclxuXHQgKiBAcGFyYW0gbWl4ZWQgaW5wdXRcclxuXHQgKiBAcGFyYW0gbWl4ZWQgZXh0ZW5kXHJcblx0ICogQHJldHVybiBtaXhlZFxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiBtZXJnZV9yZWN1cnNpdmUoYmFzZSwgZXh0ZW5kKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVPZihiYXNlKSAhPT0gJ29iamVjdCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gZXh0ZW5kO1xyXG5cclxuXHRcdGZvciAodmFyIGtleSBpbiBleHRlbmQpIHtcclxuXHJcblx0XHRcdGlmICh0eXBlT2YoYmFzZVtrZXldKSA9PT0gJ29iamVjdCcgJiYgdHlwZU9mKGV4dGVuZFtrZXldKSA9PT0gJ29iamVjdCcpIHtcclxuXHJcblx0XHRcdFx0YmFzZVtrZXldID0gbWVyZ2VfcmVjdXJzaXZlKGJhc2Vba2V5XSwgZXh0ZW5kW2tleV0pO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0YmFzZVtrZXldID0gZXh0ZW5kW2tleV07XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBiYXNlO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lcmdlIHR3byBvciBtb3JlIG9iamVjdHNcclxuXHQgKiBAcGFyYW0gYm9vbCBjbG9uZVxyXG5cdCAqIEBwYXJhbSBib29sIHJlY3Vyc2l2ZVxyXG5cdCAqIEBwYXJhbSBhcnJheSBhcmd2XHJcblx0ICogQHJldHVybiBvYmplY3RcclxuXHQgKi9cclxuXHJcblx0ZnVuY3Rpb24gbWVyZ2UoY2xvbmUsIHJlY3Vyc2l2ZSwgYXJndikge1xyXG5cclxuXHRcdHZhciByZXN1bHQgPSBhcmd2WzBdLFxyXG5cdFx0XHRzaXplID0gYXJndi5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKGNsb25lIHx8IHR5cGVPZihyZXN1bHQpICE9PSAnb2JqZWN0JylcclxuXHJcblx0XHRcdHJlc3VsdCA9IHt9O1xyXG5cclxuXHRcdGZvciAodmFyIGluZGV4PTA7aW5kZXg8c2l6ZTsrK2luZGV4KSB7XHJcblxyXG5cdFx0XHR2YXIgaXRlbSA9IGFyZ3ZbaW5kZXhdLFxyXG5cclxuXHRcdFx0XHR0eXBlID0gdHlwZU9mKGl0ZW0pO1xyXG5cclxuXHRcdFx0aWYgKHR5cGUgIT09ICdvYmplY3QnKSBjb250aW51ZTtcclxuXHJcblx0XHRcdGZvciAodmFyIGtleSBpbiBpdGVtKSB7XHJcblxyXG5cdFx0XHRcdHZhciBzaXRlbSA9IGNsb25lID8gUHVibGljLmNsb25lKGl0ZW1ba2V5XSkgOiBpdGVtW2tleV07XHJcblxyXG5cdFx0XHRcdGlmIChyZWN1cnNpdmUpIHtcclxuXHJcblx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IG1lcmdlX3JlY3Vyc2l2ZShyZXN1bHRba2V5XSwgc2l0ZW0pO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdHJlc3VsdFtrZXldID0gc2l0ZW07XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgdHlwZSBvZiB2YXJpYWJsZVxyXG5cdCAqIEBwYXJhbSBtaXhlZCBpbnB1dFxyXG5cdCAqIEByZXR1cm4gc3RyaW5nXHJcblx0ICpcclxuXHQgKiBAc2VlIGh0dHA6Ly9qc3BlcmYuY29tL3R5cGVvZnZhclxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiB0eXBlT2YoaW5wdXQpIHtcclxuXHJcblx0XHRyZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKGlucHV0KS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxuXHJcblx0fVxyXG5cclxuXHRpZiAoaXNOb2RlKSB7XHJcblxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBQdWJsaWM7XHJcblxyXG5cdH0gZWxzZSB7XHJcblxyXG5cdFx0d2luZG93W3B1YmxpY05hbWVdID0gUHVibGljO1xyXG5cclxuXHR9XHJcblxyXG59KSh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyk7IiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgZ3JvdW5kQnVpbGQgPSByZXF1aXJlKCcuL2dyb3VuZCcpO1xudmFyIGdlbmVyYXRlID0gcmVxdWlyZSgnLi4vLi4vZ2VuZXJhdGUvc3JjL2dlbmVyYXRlJyk7XG52YXIgZGlhZ3JhbSA9IHJlcXVpcmUoJy4uLy4uL2dlbmVyYXRlL3NyYy9kaWFncmFtJyk7XG52YXIgZ2FtZXN0YXRlID0gcmVxdWlyZSgnLi9nYW1lc3RhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzLCBpMThuKSB7XG5cbiAgdmFyIGJldHdlZW5GZW5zID0gZmFsc2U7XG4gIHZhciBnYW1lVG90YWwgPSA0MDtcbiAgdmFyIHNlbGVjdGlvbiA9IG0ucHJvcChcIktuaWdodCBmb3Jrc1wiKTtcbiAgdmFyIGZlbiA9IG0ucHJvcChvcHRzLmZlbiA/IG9wdHMuZmVuIDogZ2VuZXJhdGUucmFuZG9tRmVuRm9yRmVhdHVyZShzZWxlY3Rpb24oKSkpO1xuICB2YXIgZmVhdHVyZXMgPSBtLnByb3AoZ2VuZXJhdGUuZXh0cmFjdFNpbmdsZUZlYXR1cmUoc2VsZWN0aW9uKCksIGZlbigpKSk7XG5cbiAgdmFyIHN0YXRlID0gbmV3IGdhbWVzdGF0ZShnYW1lVG90YWwpO1xuXG4gIHZhciBncm91bmQ7XG4gIHZhciBzY29yZSA9IG0ucHJvcCgpO1xuICB2YXIgZGlzcGxheXNjb3JlID0gbS5wcm9wKCk7XG4gIHZhciBicmVha2xldmVsID0gbS5wcm9wKCk7XG4gIHZhciBjb3JyZWN0ID0gbS5wcm9wKFtdKTtcbiAgdmFyIGluY29ycmVjdCA9IG0ucHJvcChbXSk7XG4gIHZhciB0aW1lcklkO1xuXG4gIGZ1bmN0aW9uIHNob3dHcm91bmQoKSB7XG4gICAgaWYgKCFncm91bmQpIGdyb3VuZCA9IGdyb3VuZEJ1aWxkKGZlbigpLCBvblNxdWFyZVNlbGVjdCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG5ld0dhbWUoKSB7XG4gICAgc2NvcmUoMCk7XG4gICAgZGlzcGxheXNjb3JlKDApO1xuICAgIGJyZWFrbGV2ZWwoOTkpO1xuICAgIHN0YXRlLnJlc2V0KCk7XG4gICAgY29ycmVjdChbXSk7XG4gICAgaW5jb3JyZWN0KFtdKTtcbiAgICBuZXh0RmVuKCk7XG4gICAgaWYgKCF0aW1lcklkKSB7XG4gICAgICB0aW1lcklkID0gc2V0SW50ZXJ2YWwob25UaWNrLCAyMDApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGljaygpIHtcbiAgICBpZiAoIXN0YXRlLmdhbWVPdmVyKSB7XG4gICAgICBicmVha2xldmVsKGJyZWFrbGV2ZWwoKSAqIDAuOTkpO1xuICAgIH1cbiAgICBpZiAoYnJlYWtsZXZlbCgpIDwgMCkge1xuICAgICAgYnJlYWtsZXZlbCgwKTtcbiAgICB9XG4gICAgaWYgKGRpc3BsYXlzY29yZSgpIDwgc2NvcmUoKSkge1xuICAgICAgZGlzcGxheXNjb3JlKGRpc3BsYXlzY29yZSgpICsgMTApO1xuICAgIH1cbiAgICBpZiAoZGlzcGxheXNjb3JlKCkgPiBzY29yZSgpKSB7XG4gICAgICBkaXNwbGF5c2NvcmUoc2NvcmUoKSk7XG4gICAgfVxuXG4gICAgbS5yZWRyYXcoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3F1YXJlU2VsZWN0KHRhcmdldCkge1xuICAgIGlmIChiZXR3ZWVuRmVucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29ycmVjdCgpLmluY2x1ZGVzKHRhcmdldCkgfHwgaW5jb3JyZWN0KCkuaW5jbHVkZXModGFyZ2V0KSkge1xuICAgICAgdGFyZ2V0ID0gJ25vbmUnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBmb3VuZCA9IGdlbmVyYXRlLmZlYXR1cmVGb3VuZChmZWF0dXJlcygpLCB0YXJnZXQpO1xuICAgICAgaWYgKGZvdW5kID4gMCkge1xuICAgICAgICB2YXIgYnJlYWthbmRzY29yZSA9IHN0YXRlLm1hcmtUYXJnZXQodGFyZ2V0LCBicmVha2xldmVsKCkpO1xuICAgICAgICBicmVha2xldmVsKGJyZWFrYW5kc2NvcmUuYnJlYWtsZXZlbCk7XG4gICAgICAgIHNjb3JlKHNjb3JlKCkgKyBicmVha2FuZHNjb3JlLmRlbHRhKTtcbiAgICAgICAgY29ycmVjdCgpLnB1c2godGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpbmNvcnJlY3QoKS5wdXNoKHRhcmdldCk7XG4gICAgICAgIHNjb3JlKHNjb3JlKCkgLSAxKTtcbiAgICAgICAgYnJlYWtsZXZlbChicmVha2xldmVsKCkgLSAxMCk7XG4gICAgICB9XG4gICAgfVxuICAgIGdyb3VuZC5zZXQoe1xuICAgICAgZmVuOiBmZW4oKSxcbiAgICB9KTtcbiAgICB2YXIgY2xpY2tlZERpYWdyYW0gPSBkaWFncmFtLmNsaWNrZWRTcXVhcmVzKGZlYXR1cmVzKCksIGNvcnJlY3QoKSwgaW5jb3JyZWN0KCksIHRhcmdldCk7XG4gICAgZ3JvdW5kLnNldFNoYXBlcyhjbGlja2VkRGlhZ3JhbSk7XG4gICAgbS5yZWRyYXcoKTtcbiAgICBpZiAoZ2VuZXJhdGUuYWxsRmVhdHVyZXNGb3VuZChmZWF0dXJlcygpKSkge1xuICAgICAgY29uc29sZS5sb2coXCJhbGwgZmVhdHVyZXMgZm91bmRcIik7XG4gICAgICBpZiAoc3RhdGUuZ2FtZUNvbXBsZXRlKCkpIHtcbiAgICAgICAgZ2FtZU92ZXIoKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBzaW5jZSB0aGlzIHdpbGwgdGFrZSAwLjUgc2Vjb25kcyB0byBmaXJlIHdlIG11c3QgYmxvY2sgYWxsIG90aGVyIGV2ZW50cyB1bnRpbCBpdCBpcyBydW4uXG4gICAgICAgIGJldHdlZW5GZW5zID0gdHJ1ZTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBiZXR3ZWVuRmVucyA9IGZhbHNlO1xuICAgICAgICAgIG5leHRGZW4oKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBtLnJlZHJhdygpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlRmVuKHZhbHVlKSB7XG4gICAgZGlhZ3JhbS5jbGVhckRpYWdyYW1zKGZlYXR1cmVzKCkpO1xuICAgIGZlbih2YWx1ZSk7XG4gICAgZ3JvdW5kLnNldCh7XG4gICAgICBmZW46IGZlbigpLFxuICAgIH0pO1xuICAgIGdyb3VuZC5zZXRTaGFwZXMoW10pO1xuICAgIGNvcnJlY3QoW10pO1xuICAgIGluY29ycmVjdChbXSk7XG4gICAgZmVhdHVyZXMoZ2VuZXJhdGUuZXh0cmFjdFNpbmdsZUZlYXR1cmUoc2VsZWN0aW9uKCksIGZlbigpKSk7XG4gICAgaWYgKGdlbmVyYXRlLmFsbEZlYXR1cmVzRm91bmQoZmVhdHVyZXMoKSkpIHtcbiAgICAgIHJldHVybiBuZXh0RmVuKCk7XG4gICAgfVxuICAgIHN0YXRlLmFkZFRhcmdldHMoZmVhdHVyZXMoKSwgZmVuKCkpO1xuICAgIG0ucmVkcmF3KCk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXh0RmVuKCkge1xuICAgIHVwZGF0ZUZlbihnZW5lcmF0ZS5yYW5kb21GZW5Gb3JGZWF0dXJlKHNlbGVjdGlvbigpKSk7XG4gIH1cblxuICBzaG93R3JvdW5kKCk7XG4gIG5ld0dhbWUoKTtcbiAgbS5yZWRyYXcoKTtcblxuICByZXR1cm4ge1xuICAgIGZlbjogZmVuLFxuICAgIGdyb3VuZDogZ3JvdW5kLFxuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBmZWF0dXJlczogZmVhdHVyZXMsXG4gICAgdXBkYXRlRmVuOiB1cGRhdGVGZW4sXG4gICAgb25TcXVhcmVTZWxlY3Q6IG9uU3F1YXJlU2VsZWN0LFxuICAgIG5leHRGZW46IG5leHRGZW4sXG4gICAgc2NvcmU6IHNjb3JlLFxuICAgIGRpc3BsYXlzY29yZTogZGlzcGxheXNjb3JlLFxuICAgIGJyZWFrbGV2ZWw6IGJyZWFrbGV2ZWwsXG4gICAgc2VsZWN0aW9uOiBzZWxlY3Rpb24sXG4gICAgbmV3R2FtZTogbmV3R2FtZSxcbiAgICBkZXNjcmlwdGlvbnM6IGdlbmVyYXRlLmZlYXR1cmVNYXAubWFwKGYgPT4gZi5kZXNjcmlwdGlvbilcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIGdhbWVzdGF0ZSB7XG5cbiAgY29uc3RydWN0b3IodG90YWwpIHtcbiAgICB0aGlzLnRvdGFsID0gdG90YWw7XG4gICAgdGhpcy5rbm93biA9IFtdO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMua25vd24gPSBbXTtcbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gIH1cblxuICBhZGRUYXJnZXRzKGZlYXR1cmVzLCBmZW4pIHtcblxuICAgIHZhciBuZXdUYXJnZXRzID0gW107XG4gICAgZmVhdHVyZXMuZm9yRWFjaChmID0+IHtcbiAgICAgIGYudGFyZ2V0cy5mb3JFYWNoKHQgPT4ge1xuICAgICAgICB0LnNpZGUgPSBmLnNpZGU7XG4gICAgICAgIHQuYm9udXMgPSBcIiBcIjtcbiAgICAgICAgdC5saW5rID0gXCIuL2luZGV4Lmh0bWw/ZmVuPVwiICsgZW5jb2RlVVJJKGZlbikgKyBcIiZ0YXJnZXQ9XCIgKyB0LnRhcmdldDtcbiAgICAgICAgbmV3VGFyZ2V0cy5wdXNoKHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmtub3duID0gdGhpcy5rbm93bi5jb25jYXQobmV3VGFyZ2V0cyk7XG4gIH1cblxuICAvKipcbiAgICogVGFyZ2V0cyBhcmUgbm9ybWFsaXNlZCAtIHR3byB3aGl0ZSB0YXJnZXRzIGZvciB0aGUgc2FtZSBzcXVhcmVcbiAgICogc2hvdWxkIGJlIGNvbWJpbmVkIGFuZCB0YXJnZXRzIGZvciB0d28gY29sb3VycyBvbiBzYW1lIHNxdWFyZSBjb21iaW5lZC5cbiAgICovXG4gIGNvbWJpbmVMaWtlVGFyZ2V0cyh0YXJnZXRzKSB7XG4gICAgdmFyIGNvbWJpbmVkID0gW107XG4gICAgdGFyZ2V0cy5mb3JFYWNoKHQgPT4ge1xuICAgICAgdmFyIHByZXZpb3VzID0gY29tYmluZWQuZmluZChjID0+IGMudGFyZ2V0ID09PSB0LnRhcmdldCk7XG4gICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgIGNvbWJpbmVkLnB1c2godCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcHJldmlvdXMuZGlhZ3JhbSA9IHByZXZpb3VzLmRpYWdyYW0uY29uY2F0KHQuZGlhZ3JhbSkuc2xpY2UoKTtcbiAgICAgICAgaWYgKHByZXZpb3VzLnNpZGUgIT09IHQuc2lkZSkge1xuICAgICAgICAgIHByZXZpb3VzLnNpZGUgPSBcImJ3XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY29tYmluZWQ7XG4gIH1cblxuICBib251cyhicmVha2xldmVsKSB7XG4gICAgdmFyIGJvbnVzID0gTWF0aC5jZWlsKGJyZWFrbGV2ZWwgLyAxMCkgKiAxMDtcbiAgICBpZiAoYnJlYWtsZXZlbCA+IDY2KSB7XG4gICAgICBib251cyA9IDEwMCArIE1hdGguY2VpbChicmVha2xldmVsIC8gMik7XG4gICAgfVxuICAgIHJldHVybiBib251cztcbiAgfVxuXG5cbiAgLyoqXG4gICAqIElmIGFueSB0YXJnZXQgaXMgbWF0Y2hlZCBmb3IgYSBnaXZlbiBzaWRlLCB0aGUgZmlyc3QgaW5jb21wbGV0ZSBpdGVtXG4gICAqIHNob3VsZCBiZSBtYXJrZWQuIFxuICAgKi9cbiAgbWFya1RhcmdldCh0YXJnZXQsIGJyZWFrbGV2ZWwpIHtcblxuICAgIHZhciB0b3RhbCA9IDA7XG4gICAgdGhpcy5rbm93bi5mb3JFYWNoKGMgPT4ge1xuICAgICAgaWYgKCFjLmNvbXBsZXRlICYmIGMudGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgICAgYy5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIGMuYm9udXMgPSB0aGlzLmJvbnVzKGJyZWFrbGV2ZWwpO1xuICAgICAgICB0b3RhbCArPSBjLmJvbnVzO1xuICAgICAgICBicmVha2xldmVsICs9IDI1O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYnJlYWtsZXZlbCA9IGJyZWFrbGV2ZWwgPiAxMDAgPyAxMDAgOiBicmVha2xldmVsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJyZWFrbGV2ZWw6ICh0b3RhbCA9PT0gMCkgPyBicmVha2xldmVsICogMC45IDogYnJlYWtsZXZlbCxcbiAgICAgIGRlbHRhOiB0b3RhbFxuICAgIH07XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW10uY29uY2F0KHRoaXMua25vd24pO1xuXG4gICAgd2hpbGUgKHJlc3VsdC5sZW5ndGggPCB0aGlzLnRvdGFsKSB7XG4gICAgICByZXN1bHQucHVzaCh7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdhbWVDb21wbGV0ZSgpIHtcbiAgICB2YXIgY29tcGxldGVkID0gdGhpcy5rbm93bi5tYXAodCA9PiB0LmNvbXBsZXRlID8gMSA6IDApLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xuICAgIHRoaXMuZ2FtZU92ZXIgPSBjb21wbGV0ZWQgPj0gdGhpcy50b3RhbDtcbiAgICByZXR1cm4gdGhpcy5nYW1lT3ZlcjtcbiAgfVxufTtcbiIsInZhciBjaGVzc2dyb3VuZCA9IHJlcXVpcmUoJ2NoZXNzZ3JvdW5kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZmVuLCBvblNlbGVjdCkge1xuICByZXR1cm4gbmV3IGNoZXNzZ3JvdW5kLmNvbnRyb2xsZXIoe1xuICAgIGZlbjogZmVuLFxuICAgIHZpZXdPbmx5OiBmYWxzZSxcbiAgICB0dXJuQ29sb3I6ICd3aGl0ZScsXG4gICAgYW5pbWF0aW9uOiB7XG4gICAgICBkdXJhdGlvbjogMjAwXG4gICAgfSxcbiAgICBoaWdobGlnaHQ6IHtcbiAgICAgIGxhc3RNb3ZlOiBmYWxzZVxuICAgIH0sXG4gICAgbW92YWJsZToge1xuICAgICAgZnJlZTogZmFsc2UsXG4gICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgIHByZW1vdmU6IHRydWUsXG4gICAgICBkZXN0czogW10sXG4gICAgICBzaG93RGVzdHM6IGZhbHNlLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIGFmdGVyOiBmdW5jdGlvbigpIHt9XG4gICAgICB9XG4gICAgfSxcbiAgICBkcmF3YWJsZToge1xuICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICBtb3ZlOiBmdW5jdGlvbihvcmlnLCBkZXN0LCBjYXB0dXJlZFBpZWNlKSB7XG4gICAgICAgIG9uU2VsZWN0KGRlc3QpO1xuICAgICAgfSxcbiAgICAgIHNlbGVjdDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIG9uU2VsZWN0KGtleSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcbnZhciBjdHJsID0gcmVxdWlyZSgnLi9jdHJsJyk7XG52YXIgdmlldyA9IHJlcXVpcmUoJy4vdmlldy9tYWluJyk7XG5cbmZ1bmN0aW9uIG1haW4ob3B0cykge1xuICAgIHZhciBjb250cm9sbGVyID0gbmV3IGN0cmwob3B0cyk7XG4gICAgbS5tb3VudChvcHRzLmVsZW1lbnQsIHtcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICAgICAgfSxcbiAgICAgICAgdmlldzogdmlld1xuICAgIH0pO1xufVxuXG5cbm1haW4oe1xuICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlclwiKVxufSk7XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gIHJldHVybiBbXG4gICAgbSgnZGl2LmJyZWFrYmFyJywgW1xuICAgICAgbSgnZGl2LmJyZWFrYmFyaW5kaWNhdG9yJyArIChjb250cm9sbGVyLmJyZWFrbGV2ZWwoKSA+IDY2ID8gJy5nb2xkJyA6ICcnKSwge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHdpZHRoOiBjb250cm9sbGVyLmJyZWFrbGV2ZWwoKSArIFwiJVwiXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgbSgnZGl2LmJyZWFrYXJlYScsICdicmVhaycpLFxuICAgIF0pXG4gIF07XG59O1xuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XG52YXIgY2hlc3Nncm91bmQgPSByZXF1aXJlKCdjaGVzc2dyb3VuZCcpO1xudmFyIHByb2dyZXNzID0gcmVxdWlyZSgnLi9wcm9ncmVzcycpO1xudmFyIHNjb3JlID0gcmVxdWlyZSgnLi9zY29yZScpO1xudmFyIGJyZWFrYmFyID0gcmVxdWlyZSgnLi9icmVha2JhcicpO1xuXG5mdW5jdGlvbiB2aXN1YWxCb2FyZChjdHJsKSB7XG4gIHJldHVybiBtKCdkaXYubGljaGVzc19ib2FyZCcsIG0oJ2Rpdi5saWNoZXNzX2JvYXJkX3dyYXAnLCBtKCdkaXYubGljaGVzc19ib2FyZCcsIFtcbiAgICBjaGVzc2dyb3VuZC52aWV3KGN0cmwuZ3JvdW5kKVxuICBdKSkpO1xufVxuXG5mdW5jdGlvbiBpbmZvKGN0cmwpIHtcbiAgcmV0dXJuIFttKCdkaXYuZXhwbGFuYXRpb24nLCBbXG4gICAgbSgncCcsICdJbmNyZWFzZSB5b3VyIHRhY3RpY2FsIGF3YXJlbmVzcyBieSBzcG90dGluZyBhbGwga25pZ2h0IGZvcmtzIG9mIHBpZWNlcyBleGNsdWRpbmcgcGF3bnMgYXMgZmFzdCBhcyB5b3UgY2FuIChyZWdhcmRsZXNzIG9mIHF1YWxpdHkgb2YgbW92ZSknKSxcbiAgICBtKCdicicpLFxuICAgIG0oJ2JyJyksXG4gICAgbSgndWwuaW5zdHJ1Y3Rpb25zJywgW1xuICAgICAgbSgnbGkuaW5zdHJ1Y3Rpb25zJywgJ0ZpbmQgYWxsIGtuaWdodCBmb3JraW5nIHNxdWFyZXMuJyksXG4gICAgICBtKCdsaS5pbnN0cnVjdGlvbnMnLCAnQnJlYWsgYm9udXMgYnkgY2xpY2tpbmcgcXVpY2tseS4nKSxcbiAgICAgIG0oJ2xpLmluc3RydWN0aW9ucycsICdQb3N0IHlvdXIgaGlnaCBzY29yZSBvbiAnLCBtKFwiYS5oaXNjb3JlLmV4dGVybmFsW2hyZWY9J2h0dHBzOi8vZW4ubGljaGVzcy5vcmcvZm9ydW0vZ2FtZS1hbmFseXNpcy9mb3JraW5nLWhlbGwtY2hhbGxlbmdlJ11cIiwge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiBcIiM1NWFcIlxuICAgICAgICB9XG4gICAgICB9LCAnbGljaGVzcy4nKSlcbiAgICBdKSxcbiAgICBtKCdicicpLFxuICAgIG0oJ2JyJyksXG4gICAgbSgnZGl2LmJ1dHRvbi5uZXdnYW1lJywge1xuICAgICAgb25jbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgIGN0cmwubmV3R2FtZSgpO1xuICAgICAgfVxuICAgIH0sICdOZXcga25pZ2h0IGZvcmsgZ2FtZScpXG4gIF0pXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjdHJsKSB7XG4gIHJldHVybiBbXG4gICAgbShcImRpdi4jc2l0ZV9oZWFkZXJcIixcbiAgICAgIG0oJ2Rpdi5ib2FyZF9sZWZ0JywgW1xuICAgICAgICBtKCdoMi5jZW50ZXInLFxuICAgICAgICAgIG0oJ2Ejc2l0ZV90aXRsZScsIHtcbiAgICAgICAgICAgICAgb25jbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oXCIuL2luZGV4Lmh0bWw/ZmVuPVwiICsgZW5jb2RlVVJJKGN0cmwuZmVuKCkpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgJ2ZlYXR1cmUnLFxuICAgICAgICAgICAgbSgnc3Bhbi5leHRlbnNpb24nLCAndHJvbicpKSksXG4gICAgICAgIHByb2dyZXNzKGN0cmwpXG4gICAgICBdKVxuICAgICksXG4gICAgbSgnZGl2LiNsaWNoZXNzJyxcbiAgICAgIG0oJ2Rpdi5hbmFseXNlLmNnLTUxMicsIFtcbiAgICAgICAgbSgnZGl2JyxcbiAgICAgICAgICBtKCdkaXYubGljaGVzc19nYW1lJywgW1xuICAgICAgICAgICAgdmlzdWFsQm9hcmQoY3RybCksXG4gICAgICAgICAgICBtKCdkaXYubGljaGVzc19ncm91bmQnLCBpbmZvKGN0cmwpKVxuICAgICAgICAgIF0pXG4gICAgICAgICksXG4gICAgICAgIG0oJ2Rpdi51bmRlcmJvYXJkJywgW1xuICAgICAgICAgIG0oJ2Rpdi5jZW50ZXInLCBbXG4gICAgICAgICAgICBicmVha2JhcihjdHJsKSxcbiAgICAgICAgICAgIG0oJ2JyJyksXG4gICAgICAgICAgICBzY29yZShjdHJsKSxcbiAgICAgICAgICAgIG0oJ2JyJyksXG4gICAgICAgICAgICBtKCdicicpLFxuICAgICAgICAgICAgbSgnc21hbGwnLCAnRGF0YSBhdXRvZ2VuZXJhdGVkIGZyb20gZ2FtZXMgb24gJywgbShcImEuZXh0ZXJuYWxbaHJlZj0naHR0cDovL2xpY2hlc3Mub3JnJ11cIiwgJ2xpY2hlc3Mub3JnLicpKSxcbiAgICAgICAgICAgIG0oJ3NtYWxsJywgW1xuICAgICAgICAgICAgICAnVXNlcyBsaWJyYXJpZXMgJywgbShcImEuZXh0ZXJuYWxbaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL29ybmljYXIvY2hlc3Nncm91bmQnXVwiLCAnY2hlc3Nncm91bmQnKSxcbiAgICAgICAgICAgICAgJyBhbmQgJywgbShcImEuZXh0ZXJuYWxbaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL2pobHl3YS9jaGVzcy5qcyddXCIsICdjaGVzc2pzLicpLFxuICAgICAgICAgICAgICAnIFNvdXJjZSBjb2RlIG9uICcsIG0oXCJhLmV4dGVybmFsW2hyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS90YWlsdWdlL2NoZXNzLW8tdHJvbiddXCIsICdHaXRIdWIuJylcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICAgIF0pXG4gICAgKVxuICBdO1xufTtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG5mdW5jdGlvbiB0d29EaXZzKG1hcmtlciwgYm9udXMpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBtKCdkaXYucHJvZ3Jlc3MtbWFya2VyJywgbWFya2VyID8gbWFya2VyICsgXCIgXCIgOiBcIiBcIiksXG4gICAgICAgIG0oJ2Rpdi5wcm9ncmVzcy1ib251cycsIGJvbnVzID8gYm9udXMgKyBcIiBcIiA6IFwiIFwiKSxcbiAgICBdO1xufVxuXG5mdW5jdGlvbiBwcm9ncmVzc0l0ZW0oaXRlbSkge1xuXG4gICAgaWYgKGl0ZW0uY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJkaXYucHJvZ3Jlc3MuY29tcGxldGVcIiArIChpdGVtLmJvbnVzID49IDEwMCA/IFwiLmJvbnVzXCIgOiBcIlwiKSwge1xuICAgICAgICAgICAgb25jbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oaXRlbS5saW5rKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHdvRGl2cyhpdGVtLm1hcmtlciwgaXRlbS5ib251cykpO1xuICAgIH1cblxuICAgIGlmIChpdGVtLnNpZGUpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJkaXYucHJvZ3Jlc3MudGFyZ2V0XCIgKyAoaXRlbS5zaWRlID09PSAndycgPyBcIi53aGl0ZVwiIDogXCIuYmxhY2tcIiksIHtcbiAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGl0ZW0ubGluayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHR3b0RpdnMoaXRlbS5tYXJrZXIsIGl0ZW0uYm9udXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIG0oXCJkaXYucHJvZ3Jlc3MucGVuZGluZ1wiLCB0d29EaXZzKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gY29udHJvbGxlci5zdGF0ZS5nZXRTdGF0ZSgpLm1hcChwcm9ncmVzc0l0ZW0pO1xufTtcbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xuXG5mdW5jdGlvbiBjb252ZXJ0VG9QaWVjZXMoaSkge1xuICByZXR1cm4gaS50b1N0cmluZyg2KVxuICAgIC5yZXBsYWNlKC8wL2csIFwi4pmZXCIpXG4gICAgLnJlcGxhY2UoLzEvZywgXCLimZhcIilcbiAgICAucmVwbGFjZSgvMi9nLCBcIuKZl1wiKVxuICAgIC5yZXBsYWNlKC8zL2csIFwi4pmWXCIpXG4gICAgLnJlcGxhY2UoLzQvZywgXCLimZVcIilcbiAgICAucmVwbGFjZSgvNS9nLCBcIuKZlFwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gIHJldHVybiBbXG4gICAgbSgnZGl2LnNjb3JlJyArIChjb250cm9sbGVyLnN0YXRlLmdhbWVPdmVyID8gJy5maW5hbCcgOiAnJyksIFwic2NvcmU6IFwiICsgKGNvbnRyb2xsZXIuZGlzcGxheXNjb3JlKCkpKVxuICBdO1xufTtcbiJdfQ==
