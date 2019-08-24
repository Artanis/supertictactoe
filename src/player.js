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

  constructor(path, options) {
    var options = Object.assign(PlayerMark.default_options, options);

    this.path = path;

    this.lineWidth = options.lineWidth;
    this.lineCap = options.lineCap;
    this.strokeStyle = options.strokeStyle;
    this.filter = options.filter;
  }

  static X(options) {
    var path = new Path2D();
    path.moveTo(25.5,25.5);
    path.lineTo(60+25.5,60+25.5);
    path.moveTo(25.5, 25.5+60);
    path.lineTo(25.5+60, 25.5);

    return new this(path, options);
  }

  static O(options) {
    var path = new Path2D();
    path.ellipse(55.5,55.5,30,30,0,0,2*Math.PI);
    
    return new this(path, options);
  }
}
