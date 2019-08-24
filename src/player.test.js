'use strict';

/**
 * @jest-environment jsdom
 */

import 'jest-canvas-mock';

import {Player, PlayerMark} from "./player";

describe("Player object", () => {
  test("default constructor for player 1", () => {
    var player = Player.X();

    expect(player).toBeInstanceOf(Player);
    expect(player.label).toEqual("X");
    expect(player.mark).toBeInstanceOf(PlayerMark);
  });

  test("default constructor for player 2", () => {
    var player = Player.O();

    expect(player).toBeInstanceOf(Player);
    expect(player.label).toBe("O");
    expect(player.mark).toBeInstanceOf(PlayerMark);
  });
});

describe("PlayerMark object", () => {
  test("default constructor for X mark", () => {
    var mark = PlayerMark.X();

    expect(mark).toBeInstanceOf(PlayerMark);
    expect(mark.path).toBeInstanceOf(Path2D);
    expect(mark).toEqual(expect.objectContaining({
      lineWidth: expect.anything(),
      lineCap: expect.any(String),
      strokeStyle: expect.any(String),
      filter: expect.any(String)
    }));
  });

  test("default constructor for O mark", () => {
    var mark = PlayerMark.O();

    expect(mark).toBeInstanceOf(PlayerMark);
    expect(mark.path).toBeInstanceOf(Path2D);
    expect(mark).toEqual(expect.objectContaining({
      lineWidth: expect.anything(),
      lineCap: expect.any(String),
      strokeStyle: expect.any(String),
      filter: expect.any(String)
    }));
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
