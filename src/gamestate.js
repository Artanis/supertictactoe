'use strict';

import {
  last as _last,
  range as _range,
  filter as _filter} from "lodash";
import uuidv4 from "uuid/v4";

/**
 * Gamestate
 * 
 */
export class Gamestate {
  /**
   * @type {String} UUIDv4 string
   */
  id;

  /**
   * @type {Object} Players participating in this game.
   */
  players;

  /**
   * The canonical representation of the gamestate.
   * @type {Turn[]} List of turns taken in the game.
   */
  history;

  /**
   * @typedef {Object} Gamestate
   * @param {Player} player1 
   * @param {Player} player2 
   */
  constructor(player1, player2) {
    this.id = uuidv4();
    this.history = new Array();
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

    var plays = this.query(last.subsquare);
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

    if(player !== turn.player) {
      throw new Error(`Incorrect Player: Expected player ${player.label}, got ${turn.player.label}`)
    }

    if(subgame.indexOf(turn.square) < 0) {
      throw new Error(`Incorrect Subgame: Expected play in subgame ${subgame}, got play in ${turn.square}`);
    }
    
    var played = this.query(turn.square, turn.subsquare);
    if(played.length > 0) {
      throw new Error(`Previously Played: The move (${turn.square}, ${turn.subsquare}) is already taken.`)
    }

    this.history.push(turn);
  }

  /**
   * Returns an array containing:
   * - Up to 9 Turns if only `square` is given, all the moves made in that
   *   subgame.
   * - Up to 1 Turn if both `square` and `subsquare` are given, as this
   *   identifies a unique move.
   * @param {Number} square
   * @param {Number} [subsquare]
   * @return {Turn[]} All Turns that match the given data
   */
  query(square, subsquare) {
    return _filter(this.history, (o) => {
      if(subsquare !== undefined) {
        return o.square === square && o.subsquare === subsquare
      } else {
        return o.square === square
      }
    });
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
}
