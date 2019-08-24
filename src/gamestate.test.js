'use strict';

/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import {Player} from "./player";

var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Testing
 */
import {Gamestate, Turn} from "./gamestate";

/**
 * Gamestate
 */
describe("`Gamestate` object", () => {
  describe("follows spec", () => {
    var gamestate;
    
    beforeAll(() => {
      gamestate = new Gamestate();
    });

    test("has string UUID `id` property", () => {
      expect(gamestate.id).toEqual(expect.stringMatching(UUID));
    });

    test("has array `history` property", () => {
      expect(gamestate.history).toBeInstanceOf(Array);
    });
  });

  test.todo("builds gamestate from history");

  describe("game rules", () => {
    var gamestate;

    beforeEach(() => {
      gamestate = new Gamestate();
    });

    test("players can make moves", () => {
      var x = Player.X();
      var o = Player.O();

      gamestate.move(new Turn(x, 0, 1));
      gamestate.move(new Turn(o, 1, 2));

      expect(gamestate.history).toHaveLength(2);
    });
  
    test.todo("non-active player can't play");
  
    test.todo("knows active subgame");
    
    test.todo("players can't play in non-active subgames");
  
    test.todo("players can play in non-active subgames if the active subgame is full");
  
    test.todo("players can't play in spaces that are already played in");
    
    test.todo("detects game wins");
  
    test.todo("players can't win subgames that are already won");
  
    test.todo("players can't play if the game is over");
  });
});

/**
 * Turn
 */
describe("`Turn` object", () => {
  describe("follows spec", () => {
    var turn;

    beforeAll(() => {
      turn = new Turn(Player.X(), 0, 0);
    });

    test("has string UUID `id` property", () => {
      expect(turn.id).toEqual(expect.stringMatching(UUID));
    });

    test("has Player `player` property", () => {
      expect(turn.player).toBeInstanceOf(Player);
    });

    test("has number `square` property", () => {
      expect(turn.square).toEqual(expect.any(Number))
    });

    test("has number `subsquare` property", () => {
      expect(turn.subsquare).toEqual(expect.any(Number))
    });

    test.todo("has `gameWinning` property");

    test.todo("has `subgameWinning` property");

    test("is sealed to prevent additional properties", () => {
      expect(Object.isSealed(turn)).toBeTruthy();
    });
  });
});
