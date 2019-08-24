'use strict';

export class Player {
  label;
  mark;

  constructor(label, mark) {
    this.label = label;
    this.mark = mark;
  }

  static X() {
    return new this("X", PlayerMark.X());
  }

  static O() {
    return new this("O", PlayerMark.O());
  }
}

export class PlayerMark {
  path;
  lineWidth;
  lineCap;
  strokeStyle;
  filter;

  static default_options = {
    lineWidth: 3,
    lineCap: "round",
    strokeStyle: "black",
    filter: "",
  }

  constructor(options) {
    var options = Object.assign(PlayerMark.default_options, options);

    if (!options.path instanceof Path2D) {
      options.path = new Path2D();
      options.path.rect(10,10, 20, 20);
    }

    this.path = options.path;
    this.lineWidth = options.lineWidth;
    this.lineCap = options.lineCap;
    this.strokeStyle = options.strokeStyle;
    this.filter = options.filter;
  }

  static X(options) {
    options = Object.assign({}, options);

    options.path = new Path2D();
    options.path.moveTo(25.5,25.5);
    options.path.lineTo(60+25.5,60+25.5);
    options.path.moveTo(25.5, 25.5+60);
    options.path.lineTo(25.5+60, 25.5);

    return new this(options);
  }

  static O(options) {
    options = Object.assign({}, options);

    options.path = new Path2D();
    options.path.ellipse(55.5,55.5,30,30,0,0,2*Math.PI);
    
    return new this(options);
  }
}
