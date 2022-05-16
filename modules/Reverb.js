class Reverb extends Module {
  constructor() {
    super({w:hp2px(10)});

    this.delay_lines = [
      new DelayLine(2),
      new DelayLine(2),
      new DelayLine(2),
      new DelayLine(2),
    ]

    this.delay_lines[0].set_delay_time(0.5);
    this.delay_lines[1].set_delay_time(0.7);
    this.delay_lines[2].set_delay_time(0.9);
    this.delay_lines[3].set_delay_time(1.1);

    this.delay_lines[0].set_feedback(0.4);
    this.delay_lines[1].set_feedback(0.5);
    this.delay_lines[2].set_feedback(0.3);
    this.delay_lines[3].set_feedback(0.2);

    this.delay_lines[0].set_dry_wet(0.8);
    this.delay_lines[1].set_dry_wet(0.8);
    this.delay_lines[2].set_dry_wet(0.8);
    this.delay_lines[3].set_dry_wet(0.8);

    this.in_value = 0;
    this.out_value = 0;

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

    this.add_input(new Encoder({x:8, y:38, r:7, name:'SIZE'}));
    this.add_input(new Encoder({x:22, y:38, r:7, name:'DEC'}));
    this.add_input(new Encoder({x:8, y:50, r:7, name:'D/W'}));
    this.add_input(new Port({x:8, y:62, r:7, name:'IN'}));
    this.add_output(new Port({x:22, y:62, r:7, name:'OUT'}));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.out_value = 0;
    this.in_value = this.i['IN'].get();
    for (const dly of this.delay_lines) this.out_value += dly.process( this.in_value );
    this.out_value *= 10;
    this.scope.process( this.out_value );
    this.o['OUT'].set(this.out_value);
  }
}



class DattorroReverb extends Module {
  constructor() {
    super({w:hp2px(4)});

    this.add_control(new Encoder({x:hp2px(0.6), y:26, r:7, name:'SIZE'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:46, r:7, name:'DEC'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:66, r:7, name:'D/W'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));

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
    buf.rect(sw + w * 0.05, sw + 30, w * 0.9 - 2 * sw, h * 0.15 - 2 * sw, rounding, rounding, rounding, rounding);
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
    this.in_value = this.i['IN'].get() / 10;
    this.out_value = this.in_value * 0.5 + 0.5 * this.dattorro.process(this.in_value);
    this.out_value *= 4;
    this.o['OUT'].set(this.out_value);
  }
}

engine.add_module_class(DattorroReverb);
engine.add_module_class(Reverb);