'use strict';

import {
  last as _last,
  find as _find,
  range as _range,
  filter as _filter,
  includes as _includes} from "lodash";
import uuidv4 from "uuid/v4";

/**
 * Gamestate
 * 
 */
export class Gamestate {
  /**
   * Semicolon separated string of position triples, each corresponding to a
   * winning play.
   * 
   * @type {String}
   */
  static WINTESTS = "012;345;678;036;147;258;048;246".split(";");

  /**
   * UUID identifier
   * 
   * @type {String}
   */
  id;

  /**
   * All the players participating in the game
   * 
   * @type {Object}
   */
  players;

  /**
   * List of turns taken in the game.
   * 
   * This is the canonical representation of the gamestate. All other possible
   * views are transformations of this history.
   * 
   * @type {Turn[]}
   */
  history;

  /**
   * `true` if the game is active and playable, `false` if the game has ended.
   * 
   * @type {Bool}
   */
  active;

  /**
   * @typedef {Object} Gamestate
   * @param {Player} player1 
   * @param {Player} player2 
   */
  constructor(player1, player2) {
    this.id = uuidv4();
    this.history = new Array();
    this.active = true;
    this.players = {
      X: player1,
      O: player2
    };
  }

  /**
   * The player that is expected to make the next play.
   * @return {Player}
   */
  get activePlayer() {
    // TODO: generalize this line to player count, because the possibility of an
    // n-player game is hilarious.
    var key = Object.keys(this.players)[this.history.length % 2];
    return this.players[key];
  }

  /**
   * An array listing the currently playable subgames.
   * 
   * This will almost always be an array containing the last Turn's `subsquare`
   * property, with the exception of the first turn and the case where the
   * subgame would be full, in which case all subgames will be active.
   * @return {Number[]} Active subgames
   */
  get activeSubgame() {
    var last = _last(this.history);
    var squares = _range(0, 9)
    
    if (last === undefined) {
      return squares;
    }

    var plays = _filter(this.history, {square: last.subsquare});
    if (plays.length > 8) {
      return squares;
    }

    return [last.subsquare];
  }

  /**
   * Validates `turn`, then adds it to the game history if it passes.
   * @param {Turn} turn The move that is being attempted.
   * @throws Incorrect Player
   * @throws Incorrect Subgame
   * @throws Previously Played
   */
  move(turn) {
    var player = this.activePlayer;
    var subgame = this.activeSubgame;
    var subgamewinnable;
    var subgamewins;
    var gamewin;
    
    if (!this.active) {
      throw new Error("Game Ended: Further play not permitted.")
    }

    if(player !== turn.player) {
      throw new Error(`Incorrect Player: Expected player ${player.label}, got ${turn.player.label}.`);
    }

    if(subgame.indexOf(turn.square) < 0) {
      throw new Error(`Incorrect Subgame: Expected play in one of subgame ${subgame}, got play in ${turn.square}.`);
    }
    
    var played = _filter(this.history, {square: turn.square, subsquare: turn.subsquare});
    if(played.length > 0) {
      throw new Error(`Previously Played: The move (${turn.square}, ${turn.subsquare}) is already taken.`);
    }

    subgamewinnable = !_find(this.history, (o) => {
      return o.square === turn.square && o.subgameWinning !== undefined;
    });
    if(subgamewinnable) {
      subgamewins = this.subgameWin(turn);
      if(subgamewins) {
        turn.subgameWinning = subgamewins;
      }
    }

    gamewin = this.gameWin(turn);
    if (subgamewins && gamewin) {
      turn.gameWinning = gamewin;
      this.active = false;
    }

    this.history.push(turn);
  }

  /**
   * Finds the winning play in a subgame.
   * 
   * Replays the history of the relevent subgame, with an optional `turn`
   * appended for look ahead, to determine the winning play.
   * 
   * Will always find the first win, regardless of future plays in that subgame.
   * 
   * @param {Turn} turn Look ahead
   * @return {Number[3]|Bool}
   */
  subgameWin(turn) {
    var subgame = _filter(this.history, {square: turn.square});

    if(turn !== undefined) {
      subgame.push(turn);
    }

    var plays = {};

    for(var i = 0; i < subgame.length; i++) {
      let turn = subgame[i];
      let player = turn.player.label;

      if(plays[player] === undefined) {
        plays[player] = "";
      }

      plays[player] += turn.subsquare.toString();

      if(_includes(Gamestate.WINTESTS, plays[player])) {
        return plays[player].split("").map((n) => Number(n));
      }
    }

    return false
  }

  /**
   * Finds the winning play of the game.
   * 
   * Replays the history of subgame wins, with optional `turn` appended for look
   * ahead, to determine the winning play.
   * 
   * Will always find the first win, regardless of any future plays in the game.
   * 
   * Similar to `Gamestate.subgameWin()`.
   * 
   * @param {Turn} turn Look ahead
   * @return {Number[3]|Bool}
   */
  gameWin(turn) {
    var game = _filter(this.history, (o) => {
      return o.subgameWinning !== undefined;
    });

    if(turn !== undefined) {
      game.push(turn);
    }

    var plays = {};
    for (var i = 0; i < game.length; i++) {
      let turn = game[i];
      let player = turn.player.label;
      
      if (plays[player] === undefined) {
        plays[player] = "";
      }

      plays[player] += turn.square.toString();

      
      if (_includes(Gamestate.WINTESTS, plays[player])) {
        return plays[player].split("").map((n) => Number(n));
      }
    }

    return false;
  }
}

export class Turn {
  /**
   * UUIDv4 string.
   * @type {String}
   */
  id;

  /**
   * The player that made this turn.
   * @type {Player}
   */
  player;

  /**
   * The subgame the player played in.
   * @Type {Number}
   */
  square;
  
  /**
   * The the subgame square that the player played.
   * @Type {Number}
   */
  subsquare;
  
  /**
   * The winning move of the subgame, if applicable, as an array of positions.
   * @Type {Array(3)|undefined}
   */
  subgameWinning;

  /**
   * The winning move of the game, if applicable, as an array of positions.
   * @type {Array(3)|undefined}
   */
  gameWinning;

  /**
   * 
   * @param {Player} player The player making this turn
   * @param {Number} square The subgame the player is playing in
   * @param {Number} subsquare The square in the subgame that is being taken
   */
  constructor(player, square, subsquare) {
    this.id = uuidv4();
    this.player = player;

    this.square = square;
    this.subsquare = subsquare;

    Object.seal(this);
  }

  toString() {
    return `<Turn(id="${this.id}", ` +
                 `p="${this.player.label}", ` +
                 `s=${this.square}, ` +
                 `ss=${this.subsquare}, ` +
                 `swin=${this.subgameWinning}, ` +
                 `gwin=${this.gameWinning})>`;
  }
}
