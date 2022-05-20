class DattorroReverb extends Module {
  constructor() {
    super({w:hp2x(3)});

    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'SIZE'}));
    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'DEC'}));
    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.46), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'D/W'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.59), r:hp2x(0.8), name:'I/L'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.69), r:hp2x(0.8), name:'I/R'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.79), r:hp2x(0.8), name:'O/L'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.89), r:hp2x(0.8), name:'O/R'}));

    this.dw = 0;
    this.size = 0;
    this.decay = 0;

    this.dattorro = new DattorroReverbProcessor();
    // this.dattorro.setTimeScale(0.1);
    this.dattorro.decay = 0.9;
    this.cs = 10;
    this.ca = 0.9;
    this.cb = 0.0;

    this.cosa;
    this.sina;
    this.cosb;
    this.sinb;
    this.cx;
    this.cy;
    this.ox;
    this.oy;
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 2;
    let rounding = 5;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.05, sw + 30, w * 0.9 - 2 * sw, h * 0.14 - 2 * sw, rounding, rounding, rounding, rounding);
  }

  // draw_sbf(buf, x, y, w, h) {
  //   let sw = 0.1;
  //   this.cosa = Math.cos(this.ca);
  //   this.cosb = Math.cos(this.cb);
  //   this.sina = Math.sin(this.ca);
  //   this.sinb = Math.sin(this.cb);
  //   this.cx = this.cs * this.cosa * this.cosb;
  //   this.cy = this.cs * this.sina * this.cosb;
  //   this.ox = x + w / 2;
  //   this.oy = y + sw + 30 + h * 0.15 / 2;
  //   // buf.line(this.ox + this.cx, this.oy + this.cy, this.ox - this.cx, this.oy + this.cy);
  //   // buf.line(this.ox - this.cx, this.oy + this.cy, this.ox - this.cx, this.oy - this.cy);
  //   // buf.line(this.ox + this.cx, this.oy + this.cy, this.ox + this.cx, this.oy - this.cy);

  //   for (var i = -1; i <= 1; i += 2) {
  //     for (var j = -1; j <= 1; j += 2) {
  //       for (var k = -1; k <= 1; k += 2) {
  //         buf.line(this.ox + i*this.cx, this.oy + j*this.cy, this.ox + i*this.cx, this.oy - j*this.cy);
  //         buf.line(this.ox + i*this.cx, this.oy + j*this.cy, this.ox - i*this.cx, this.oy + j*this.cy);
  //       }
  //     }
  //   }

  //   // this.ca += 0.02;
  //   // if (this.ca > Math.PI * 2) this.ca -= Math.PI * 2;
  //   this.cb += 0.02;
  //   if (this.cb > Math.PI * 2) this.cb -= Math.PI * 2;
  // }

  process() {
    this.dw = this.c['D/W'].get()**2;
    this.decay = this.c['DEC'].get();
    this.size = this.c['SIZE'].get()**2;
    this.dattorro.inputL = this.i['I/L'].get() / 10;
    this.dattorro.inputR = this.i['I/R'].get() / 10;
    this.dattorro.setTimeScale(this.size);
    this.dattorro.decay = this.decay;
    this.dattorro.process();
    this.dattorro.outputL *= 4;
    this.dattorro.outputR *= 4;
    this.o['O/L'].set(this.dattorro.inputL + (this.dattorro.outputL - this.dattorro.inputL) * this.dw);
    this.o['O/R'].set(this.dattorro.inputR + (this.dattorro.outputR - this.dattorro.inputR) * this.dw);
  }
}

engine.add_module_class(DattorroReverb);