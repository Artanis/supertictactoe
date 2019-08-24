'use strict';

import {
  last as _last,
  range as _range,
  intersection as _intersection} from "lodash";
import uuidv4 from "uuid/v4";

export class Gamestate {
  id;
  players;
  history;

  constructor(player1, player2) {
    this.id = uuidv4();
    this.history = new Array();
    this.players = {
      X: player1,
      O: player2
    };
  }

  get activePlayer() {
    var key = Object.keys(this.players)[this.history.length % 2];
    return this.players[key];
  }

  get activeSubgame() {
    var last = _last(this.history)
    if (last === undefined) {
      return _range(0, 9);
    } else {
      return [last.subsquare];
    }
  }

  move(turn) {
    var player = this.activePlayer;
    var subgame = this.activeSubgame;

    console.log("Subgame", subgame)

    if(player !== turn.player) {
      throw new Error(`Incorrect Player: Expected player ${player.label}, got ${turn.player.label}`)
    }

    if(subgame.indexOf(turn.square) < 0) {
      throw new Error(`Incorrect Subgame: Expected play in subgame ${subgame}, got play in ${turn.square}`);
    }

    this.history.push(turn);
  }
}

export class Turn {
  id;
  player;
  square;
  subsquare;
  subgameWinning;
  gameWinning;

  constructor(player, square, subsquare) {
    this.id = uuidv4();
    this.player = player;

    this.square = square;
    this.subsquare = subsquare;

    Object.seal(this);
  }
}
