'use strict';

import uuidv4 from "uuid/v4";

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
  }
}
