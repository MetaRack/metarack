class WireStyle {
  constructor (core=200, edge=50) {
    this.core = core;
    this.edge = edge;
  }

  rand() {
    this.core = [rackrand() * 200, rackrand() * 200, rackrand() * 200];
    this.edge = [this.core[0] / 2, this.core[1] / 2, this.core[2] / 2];
  }
}

class Wire {
  constructor(porta, portb, scale=1, offset=0, style = new WireStyle(), visible = true) {
    this.buffer = [];
    this.porta = porta;
    this.portb = portb;
    this.scale = scale;
    this.offset = offset;
    this.style = style;
    this.visible = visible;
  }

  process() {
    this.portb.set(this.porta.get() * this.scale + this.offset);
  }

  draw(x, y, maxy, scale) {
    let xy1 = this.porta.get_position();
    let xy2 = this.portb.get_position();
    let midx = (xy1[0] + xy2[0]) / 2;
    let midy = Math.max(xy1[1], xy2[1]);
    let c = 0;
    let midx1 = (midx + xy1[0]) / 2 + this.porta.get() * c * scale;
    let midy1 = midy + Math.abs(xy1[1] - xy2[1]) * Math.abs(xy1[0] - xy2[0]) / 1e10 * scale + this.porta.get() * c * scale;
    let midx2 = (midx + xy2[0]) / 2 + this.porta.get() * c * scale;
    let midy2 = midy + Math.abs(xy1[1] - xy2[1]) * Math.abs(xy1[0] - xy2[0]) / 1e10 * scale + this.porta.get() * c * scale;

    while (midy1 > maxy) midy1 -= 10 * scale;
    while (midy2 > maxy) midy2 -= 10 * scale;

    stroke(this.style.edge);
    fill(this.style.core);
    strokeWeight(0.5 * scale);
    ellipse(xy1[0], xy1[1], 3 * scale, 3 * scale);

    if (this.visible) {
      ellipse(xy2[0], xy2[1], 3 * scale, 3 * scale);
      
      stroke(this.style.edge);
      strokeWeight(1.5 * scale);
      noFill();
      bezier(xy1[0], xy1[1], midx1, midy1, midx2, midy2, xy2[0], xy2[1]);

      stroke(this.style.core);
      strokeWeight(0.5 * scale);
      noFill();
      bezier(xy1[0], xy1[1], midx1, midy1, midx2, midy2, xy2[0], xy2[1]);
    }
  }
}