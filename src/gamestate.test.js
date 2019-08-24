'use strict';

/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import {Player} from "./player";

/**
 * Testing
 */
import {Turn} from "./gamestate";


describe("Turn object", () => {
  test("Follows spec", () => {
    var player = Player.X();
    var turn = new Turn(player, 0, 0);

    expect(turn).toEqual(expect.objectContaining({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      player: expect.any(Player),
      square: expect.any(Number),
      subsquare: expect.any(Number)
    }));
  });
});
