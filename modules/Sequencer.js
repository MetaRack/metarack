class Sequencer extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 30, 70);
  
    this.channels = 4;
    this.steps = 16;
    this.step = 0;
    this.prev_gate = 0;
    this.curr_gate = 0;

    this.patterns = new Array(this.channels);
    for (var i = 0; i < this.channels; i ++) {
      this.patterns[i] = new Array(this.steps);
    }

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

    this.add_input(new Port(8, 38, 7, 'GATE'));
    this.add_output(new Port(8, 50, 7, 'OUT1'));
    this.add_output(new Port(22, 50, 7, 'OUT2'));
    this.add_output(new Port(8, 62, 7, 'OUT3'));
    this.add_output(new Port(22, 62, 7, 'OUT4'));
  }

  set_sequence(chan, seq) {
    for (var i = 0; i < this.steps; i++) {
      this.patterns[chan][i] = seq[i] * 20 - 10;
    }
  }

  set_random_sequence(chan) {
    for (var i = 0; i < this.steps; i++) {
      this.patterns[chan][i] = rackrand() * 20 - 10;
    }
  }

  get_sequence(chan) {
    let ret = '|';
    for (var i = 0; i < this.steps; i++) {
      if (this.patterns[chan][i] > 0) ret += '‾|';
      else ret += '_|';
    }
    return ret;
  }

  draw(x, y, scale) {
    // x += this.o['OUT'].get() * 0.05;
    // y += this.o['OUT'].get() * 0.05;

    // this.width * scale

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.curr_gate = this.i['GATE'].get();
    if ((this.curr_gate > 0) && (this.prev_gate < 0)) {
      this.step = (this.step + 1) % this.steps;
      this.o['OUT1'].set(this.patterns[0][this.step]);
      this.o['OUT2'].set(this.patterns[1][this.step]);
      this.o['OUT3'].set(this.patterns[2][this.step]);
      this.o['OUT4'].set(this.patterns[3][this.step]);
    }

    this.prev_gate = this.curr_gate;
    this.scope.process( this.o['OUT1'].get() )
  }
}