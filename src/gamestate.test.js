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
 * Plays a given future onto a `gamestate`, then returns the last `Turn` in
 * `future`.
 * 
 * @param {Gamestate} gamestate
 * @param {Turn[]} future
 * @returns {Turn}
 */
function fastForward(gamestate, future) {
  for(var i = 0; i < future.length; i++) {
    gamestate.move(future[i]);
  }

  return future.slice(-1).pop();
}

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

    test("has `active` that is Boolean", () => {
      expect(gamestate.active).toEqual(true);
    })
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
      var future = [
        new Turn(x, 0, 1), // [.X.......]
        new Turn(o, 1, 0),
        new Turn(x, 0, 2), // [.XX......]
        new Turn(o, 2, 0),
        new Turn(x, 0, 3), // [.XXX.....]
        new Turn(o, 3, 0),
        new Turn(x, 0, 4), // [.XXXX....]
        new Turn(o, 4, 0),
        new Turn(x, 0, 5), // [.XXXXX...]
        new Turn(o, 5, 0),
        new Turn(x, 0, 6), // [.XXXXXX..]
        new Turn(o, 6, 0),
        new Turn(x, 0, 7), // [.XXXXXXX.]
        new Turn(o, 7, 0),
        new Turn(x, 0, 8), // [.XXXXXXXX]
        new Turn(o, 8, 0),
        new Turn(x, 0, 0)]; // [XXXXXXXXX]

      fastForward(gamestate, future);

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
    
    test("players can win subgames", () => {
      var future = [
        new Turn(x, 0, 0),
        new Turn(o, 0, 3),
        new Turn(x, 3, 0),
        new Turn(o, 0, 4),
        new Turn(x, 4, 0),
        new Turn(o, 0, 5)];

      var last = fastForward(gamestate, future);

      expect(last.subgameWinning).toEqual([3, 4, 5]);
    });

    test("subgames can't be won twice", () => {
      var future = [
        new Turn(x, 0, 0),
        new Turn(o, 0, 3),
        new Turn(x, 3, 0),
        new Turn(o, 0, 4),
        new Turn(x, 4, 0),
        new Turn(o, 0, 5),
        new Turn(x, 5, 0),
        new Turn(o, 0, 6)];

      var last = fastForward(gamestate, future);

      expect(last.subgameWinning).toBeUndefined();
    });
  
    test("players can win the game", () => {
      var future = [
        new Turn(x, 0, 0),
        new Turn(o, 0, 8),
        new Turn(x, 8, 8),
        new Turn(o, 8, 0),
        new Turn(x, 0, 1),
        new Turn(o, 1, 0),
        new Turn(x, 0, 2),
        new Turn(o, 2, 1),
        new Turn(x, 1, 3),
        new Turn(o, 3, 1),
        new Turn(x, 1, 4),
        new Turn(o, 4, 1),
        new Turn(x, 1, 5),
        new Turn(o, 5, 2),
        new Turn(x, 2, 6),
        new Turn(o, 6, 2),
        new Turn(x, 2, 7),
        new Turn(o, 7, 2),
        new Turn(x, 2, 8)];

      var last = fastForward(gamestate, future);

      expect(last.gameWinning).toEqual([0, 1, 2]);
    });

    test("the game ends when a player wins", () => {
      var future = [
        new Turn(x, 0, 0),
        new Turn(o, 0, 8),
        new Turn(x, 8, 8),
        new Turn(o, 8, 0),
        new Turn(x, 0, 1),
        new Turn(o, 1, 0),
        new Turn(x, 0, 2),
        new Turn(o, 2, 1),
        new Turn(x, 1, 3),
        new Turn(o, 3, 1),
        new Turn(x, 1, 4),
        new Turn(o, 4, 1),
        new Turn(x, 1, 5),
        new Turn(o, 5, 2),
        new Turn(x, 2, 6),
        new Turn(o, 6, 2),
        new Turn(x, 2, 7),
        new Turn(o, 7, 2),
        new Turn(x, 2, 8)];

      fastForward(gamestate, future);

      expect(() => {
        gamestate.move(new Turn(o, 8, 1));
      }).toThrow(/game ended/i);
    });
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
