'use strict';

/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import {Player} from "./player";

/**
 * @type {RegExp} UUID validator
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

    test("has an `id` property that is a UUID", () => {
      expect(gamestate.id).toEqual(expect.stringMatching(UUID));
    });

    test("has a `players` property that is an object", () => {
      expect(gamestate.players).toBeInstanceOf(Object);
      expect(Object.keys(gamestate.players)).toEqual(["X", "O"]);
    });

    test("has a `history` property that is an Array", () => {
      expect(gamestate.history).toBeInstanceOf(Array);
    });
  });

  test.todo("builds gamestate from history");

  describe("game rules", () => {
    var x, o, gamestate;

    beforeAll(() => {
      x = Player.X();
      o = Player.O();
    });

    beforeEach(() => {
      gamestate = new Gamestate(x, o);
    });

    test("players can make moves", () => {
      gamestate.move(new Turn(x, 0, 1));
      gamestate.move(new Turn(o, 1, 2));

      expect(gamestate.history).toHaveLength(2);
    });
  
    test("non-active player can't play", () => {
      gamestate.move(new Turn(x, 0, 0));

      expect(() => {
        gamestate.move(new Turn(x, 0, 1));
      }).toThrow(/incorrect player/i);
    });
      
    test("players can't play in non-active subgames", () => {
      gamestate.move(new Turn(x, 0, 0));

      expect(() => {
        gamestate.move(new Turn(o, 1, 0));
      }).toThrow(/incorrect subgame/i);
    });
  
    test("players can play in non-active subgames if the active subgame is full", () => {
      gamestate.move(new Turn(x, 0, 1)); // [.X.......]
      gamestate.move(new Turn(o, 1, 0));
      gamestate.move(new Turn(x, 0, 2)); // [.XX......]
      gamestate.move(new Turn(o, 2, 0));
      gamestate.move(new Turn(x, 0, 3)); // [.XXX.....]
      gamestate.move(new Turn(o, 3, 0));
      gamestate.move(new Turn(x, 0, 4)); // [.XXXX....]
      gamestate.move(new Turn(o, 4, 0));
      gamestate.move(new Turn(x, 0, 5)); // [.XXXXX...]
      gamestate.move(new Turn(o, 5, 0));
      gamestate.move(new Turn(x, 0, 6)); // [.XXXXXX..]
      gamestate.move(new Turn(o, 6, 0));
      gamestate.move(new Turn(x, 0, 7)); // [.XXXXXXX.]
      gamestate.move(new Turn(o, 7, 0));
      gamestate.move(new Turn(x, 0, 8)); // [.XXXXXXXX]
      gamestate.move(new Turn(o, 8, 0));
      gamestate.move(new Turn(x, 0, 0)); // [XXXXXXXXX]

      // Game now wants a play in subgame 0, which as above is full.
      // Next player should be able to play anywhere.
      expect(() => {
        gamestate.move(new Turn(o, 1, 1));
      }).not.toThrow(/incorrect subgame/i);
    });
  
    test("players can't take spaces that are already taken", () => {
      gamestate.move(new Turn(x, 0, 0));

      expect(() => {
        gamestate.move(new Turn(o, 0, 0));
      }).toThrow(/previously played/i);

    });
    
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
