class Reverb extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 30, 70);

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

    this.add_input(new Port(8, 38, 7, 'SIZE'));
    this.add_input(new Port(22, 38, 7, 'DEC'));
    this.add_input(new Port(8, 50, 7, 'D/W'));
    this.add_input(new Port(8, 62, 7, 'IN'));
    this.add_output(new Port(22, 62, 7, 'OUT'));
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
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 30, 70);

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

    this.add_input(new Port(8, 38, 7, 'SIZE'));
    this.add_input(new Port(22, 38, 7, 'DEC'));
    this.add_input(new Port(8, 50, 7, 'D/W'));
    this.add_input(new Port(8, 62, 7, 'IN'));
    this.add_output(new Port(22, 62, 7, 'OUT'));

    this.dattorro = new DattorroReverbProcessor();
    // this.dattorro.setTimeScale(0.1);
    this.dattorro.decay = 0.9;
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.in_value = this.i['IN'].get() / 10;
    this.out_value = this.in_value * 0.5 + 0.5 * this.dattorro.process(this.in_value);
    this.out_value *= 4;
    this.scope.process( this.out_value );
    this.o['OUT'].set(this.out_value);
  }
}