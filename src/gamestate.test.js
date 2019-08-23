'use strict';

import {Turn} from "./gamestate";

// import {Player} from "./player";
// jest.mock('player');

describe("Turn object", () => {
  var turn;

  beforeEach(() => {
    turn = new Turn(0, 0);
  });

  test("Follows spec", () => {
    expect(turn).toEqual(expect.objectContaining({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      // player: expect.toBeInstanceOf(Player),
      square: expect.any(Number),
      subsquare: expect.any(Number),
      gameWinning: undefined,
      subgameWinning: undefined
    }));
  });
});
