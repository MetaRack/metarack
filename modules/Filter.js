class SimpleOnePoleFilter extends Module {
  constructor(name, type, base_freq=440, x=-1, y=-1) {
    super(name, x, y, 20, 70);
    this.scope = new TextDisplay(0, 0, 20, 30);

    this.type = type;
    this.base_freq = base_freq;
    this.freq = base_freq;

    this.lp = new OnePoleLPFilter();
    this.hp = new OnePoleHPFilter();

    this.add_input(new Port(10, 38, 7, 'IN'));
    this.add_input(new Port(10, 50, 7, 'FREQ'));
    this.add_output(new Port(10, 62, 7, 'OUT'));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.set_text(`${this.type}\nF(Hz)\n${this.freq.toFixed(2)}`);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    switch (this.type) {
      case 'LP':
        this.freq = this.base_freq * Math.pow(2, this.i['FREQ'].get());
        this.lp.setCutoffFreq(this.freq);
        this.lp.input = this.i['IN'].get();
        this.lp.process();
        this.o['OUT'].set(this.lp.output);
        break;
      case 'HP':
        this.freq = this.base_freq * Math.pow(2, this.i['FREQ'].get());
        this.hp.setCutoffFreq(this.freq);
        this.hp.input = this.i['IN'].get();
        this.hp.process();
        this.o['OUT'].set(this.hp.output);
        break;
    }
    // this.scope.process( this.o['OUT'].get() )
  }
}


class ResonantFilter extends Module {
  constructor(name, type, base_freq=440, x=-1, y=-1) {
    super(name, x, y, 20, 70);
    this.scope = new TextDisplay(0, 0, 20, 18);

    this.type = type;
    this.base_freq = base_freq;

    this.ladder = new LadderFilter();

    this.freq = this.base_freq;

    this.add_input(new Port(10, 26, 7, 'IN'));
    this.add_input(new Port(10, 38, 7, 'FREQ'));
    this.add_input(new Port(10, 50, 7, 'RES'));
    this.add_output(new Port(10, 62, 7, 'OUT'));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.set_text(`${this.type}, F(Hz)\n${this.freq.toFixed(2)}`);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.freq = this.base_freq * Math.pow(2, this.i['FREQ'].get());
    this.ladder.setCutoffFreq(this.freq);
    this.ladder.setResonance((this.i['RES'].get() + 10) / 20);
    this.ladder.input = this.i['IN'].get() / 5;
    this.ladder.process();
    switch (this.type) {
      case 'LP':
        this.o['OUT'].set(this.ladder.lowpass() * 5);
        break;
      case 'HP':
        this.o['OUT'].set(this.ladder.highpass() * 5);
        break;
    }
    // this.scope.process( this.o['OUT'].get() )
  }
}