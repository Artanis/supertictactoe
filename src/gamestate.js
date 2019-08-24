'use strict';

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

  move(turn) {
    var player = this.activePlayer;
    
    if(player !== turn.player) {
      throw new Error(`Incorrect Player: Expected player ${player.label}, got ${turn.player.label}`)
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
