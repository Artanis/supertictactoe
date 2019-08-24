'use strict';

import uuidv4 from "uuid/v4";

export class Gamestate {
  id;
  history;

  constructor() {
    this.id = uuidv4();
    this.history = new Array();
  }

  move(turn) {
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
