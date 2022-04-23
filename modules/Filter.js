class SimpleOnePoleFilter extends Module {
  constructor({type='LP', freq=440}={}) {
    super({w:hp2px(4)});
    this.scope = new TextDisplay(0, 0, 20, 30);

    this.type = type;
    this.base_freq = freq;
    this.freq = freq;

    this.lp = new OnePoleLPFilter();
    this.hp = new OnePoleHPFilter();

    this.add_input(new Encoder({x:hp2px(0.6), y:66, r:7, name:'FREQ'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:7, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:7, name:'OUT'}));
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
  constructor({type='LP', freq=440}={}) {
    super({w:hp2px(4)});
    this.scope = new TextDisplay(0, 0, 20, 18);

    this.type = type;
    this.base_freq = freq;

    this.ladder = new LadderFilter();

    this.freq = this.base_freq;

    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, name:'RES'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 2;
    let rounding = 5;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.05, sw + 30, w * 0.9 - 2 * sw, h * 0.3 - 2 * sw, rounding, rounding, rounding, rounding);
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
  }
}