'use strict';

/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';

/**
 * Testing
 */
import {Player, PlayerMark} from "./player";

/**
 * Player
 */
describe("Player object", () => {
  describe("follows spec", () => {
    var player;

    beforeAll(() => {
      player = new Player();
    });

    test("has `label` attribute that is a string", () => {
      expect(player.label).toEqual(expect.any(String));
    });

    test("has `mark` attribute that is a Path2D", () => {
      expect(player.mark).toBeInstanceOf(PlayerMark);
    });
  });
  
  test("default constructor for player 1", () => {
    var player = Player.X();

    expect(player).toBeInstanceOf(Player);
    expect(player.label).toEqual("X");
  });

  test("default constructor for player 2", () => {
    var player = Player.O();

    expect(player).toBeInstanceOf(Player);
    expect(player.label).toBe("O");
  });
});

/**
 * PlayerMark
 */
describe("PlayerMark object", () => {
  describe("follows spec", () => {
    var mark;

    beforeAll(() => {
      mark = new PlayerMark();
    });

    test("has Path2D `path` property", () => {
      expect(mark.path).toBeInstanceOf(Path2D);
    });

    test("has number `lineWidth` property", () => {
      expect(mark.lineWidth).toEqual(expect.any(Number));
    });

    test("has string `lineCap` property", () => {
      expect(mark.lineCap).toEqual(expect.any(String));
    });

    test("has string `strokeStyle` property", () => {
      expect(mark.strokeStyle).toEqual(expect.any(String));

    });

    test("has string `filter` property", () => {
      expect(mark.filter).toEqual(expect.any(String));

    });
  });

  test("default constructor for X mark", () => {
    var mark = PlayerMark.X();

    expect(mark).toBeInstanceOf(PlayerMark);
  });

  test("default constructor for O mark", () => {
    var mark = PlayerMark.O();

    expect(mark).toBeInstanceOf(PlayerMark);
  });

  test("customized default constructors", () => {
    var options = {
      lineWidth: -1
    };

    var mark1 = PlayerMark.X(options);
    expect(mark1.lineWidth).toBe(options.lineWidth);

    var mark2 = PlayerMark.O(options);
    expect(mark2.lineWidth).toBe(options.lineWidth);
  });
})
