class RawScopeDouble extends GraphicObject {
  constructor({x=0, y=0, w=10, h=10, name='RawScope', size=32, divider=256, offset=4}={}) {
    super({x:x, y:y, w:w, h:h, name:name});
    this.size = size;
    this.divider = divider;
    this.i = 0;
    this.offset = offset;

    this.sample_counter = 0;
    this.divider_sample_counter = 0;
    this.buffer_l = [];
    this.buffer_r = [];
    this.i = 0;
    for (var j = 0; j < this.size; j ++) this.buffer_l.push(0);
    for (var j = 0; j < this.size; j ++) this.buffer_r.push(0);

    this.delta = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.p_y1 = w/2;
    this.p_y2 = h/2;
  }

  draw_cbf(buf, w, h) {
    let sw = 5;
    let rounding = 5; 
    buf.stroke(60); buf.strokeWeight(sw); buf.strokeJoin(buf.ROUND); buf.fill(30);
    buf.rect(sw / 2, sw / 2, w - sw, h - sw, rounding, rounding, rounding, rounding);

    buf.stroke(60);
    for (var i = 1; i < 20; i ++) {
      if (i % 5 == 0) buf.strokeWeight(0.5);
      else buf.strokeWeight(0.05);
      // buf.line(i * w * 0.05, sw, i * w * 0.05, h - sw);
      // buf.line(sw, i * h * 0.05, w - sw, i * h * 0.05);
    }
  }

  draw_dbf(buf, x, y, w, h) {
    buf.stroke(240); buf.strokeWeight(0.1); buf.noFill();

    this.delta = (w - this.offset * 2) / this.size;
    for (var j = 0; j < this.size/4 - 1; j++) { 
      this.y1 = -this.buffer_l[(this.i + j + 1) % this.size] * h / 1 / 10 + h / 2;
      this.y2 = -this.buffer_r[(this.i + j + 2) % this.size] * h / 1 / 10 + h / 2;
      //buf.line(x + this.offset + j * this.delta, y + this.y1, x + this.offset + (j + 1) * this.delta, y + this.y2);
      //buf.point(x + this.y1 + h/4 * 1.5, y + this.y2 * 1.5);
      buf.strokeWeight(1.2);
      buf.point(x + this.y1, y + this.y2);
      //buf.strokeWeight(1);
      //buf.point(x + this.y1 + h/4 * 1.5, y + this.y2 * 1.5);
      this.p_y1 = this.y1;
      this.p_y2 = this.y2;
    }
  }

  trig() {
    this.divider = this.divider_sample_counter / this.size;
    this.divider_sample_counter = 0;
  }

  process(sample) {
    if (this.sample_counter > this.divider) {
      this.i ++;
      this.buffer_l[this.i] = sample[0];
      this.buffer_r[this.i] = sample[1];
      if (this.i == this.size - 1) { this.i = -1; }
      this.sample_counter = 0;
    }
    this.sample_counter ++;
    this.divider_sample_counter ++;
  }
}