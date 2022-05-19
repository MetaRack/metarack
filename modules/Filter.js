class BPFilter extends Module {
    constructor({freq=440}={}) {
    super({w:hp2x(7)});

    this.add_control(new Encoder({x:hp2x(0.6), y:6, r:7, vmin:30, vmax:10000, val:freq, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:0, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2x(2.1), y:46, r:7, val:0, vmin:0, vmax:1, name:'RES'}));
    this.add_input(new Port({x:hp2x(0.8), y:108, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(3.8), y:108, r:6, name:'OUT'}));
    this.add_input(new InputEncoder({x:hp2x(3.6), y:26, r:7, val:0, vmin:0, vmax:1000, name:'WDTH'}));

    this.width = this.i['WDTH'].get();
    this.LP = new ExponentialFilterPrim();
    this.HP = new ExponentialFilterPrim();
    this.freq = this.c['FREQ'].get();
    this.cv = this.i['CV'].get();
    this.res = this.i['RES'].get();
    this.LP.freq = this.freq + this.width;
    this.LP.cv = this.cv;
    this.HP.freq = this.freq - this.width;
    this.HP.cv = this.cv;
   
    this.in = 0;
    this.out = 0;
  }

  process() {
    this.in = this.i['IN'].get();
    this.width = this.i['WDTH'].get();
    this.freq = this.c['FREQ'].get();
    this.cv = this.i['CV'].get();
    this.res = this.i['RES'].get();

    this.lp_freq = (this.freq * Math.pow(2, this.cv)) + this.width;
    if ((this.lp_freq) < 0) 
      this.lp_freq = 30;
    if ((this.lp_freq) > 10000) 
      this.lp_freq = 9999;
    this.LP.freq = this.lp_freq;

    this.hp_freq = (this.freq * Math.pow(2, this.cv)) - this.width;
    if ((this.hp_freq) < 0) 
      this.hp_freq = 30;
    if ((this.hp_freq) > 10000) 
      this.hp_freq = 9999;

    this.HP.freq = this.hp_freq;
    this.LP.coeff_res = this.res;
    this.HP.coeff_res = this.res;

    this.LP.in = this.in;
    this.HP.in = this.LP.lp;

    this.LP.process();
    this.HP.process();

    this.out = (this.HP.hp);

    this.o['OUT'].set(this.out);
  }
}

class SVF extends Module {
    constructor({freq=440}={}) {
    super({w:hp2x(7)});

    this.add_control(new Encoder({x:hp2x(0.6), y:6, r:7, vmin:30, vmax:10000, val:freq, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:0, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2x(2.1), y:46, r:7, val:0, vmin:0, vmax:1, name:'RES'}));
    this.add_input(new Port({x:hp2x(0.8), y:108, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(3.8), y:108, r:6, name:'OUT'}));

    this.add_input(new InputEncoder({x:hp2x(3.6), y:6, r:7, val:0.5, vmin:0, vmax:1, name:'CF'}));
    this.add_input(new InputEncoder({x:hp2x(3.6), y:26, r:7, val:0, vmin:0, vmax:1000, name:'WDTH'}));

    this.cf = this.i['CF'].get();
    this.width = this.i['WDTH'].get();
    this.LP = new ExponentialFilterPrim();
    this.HP = new ExponentialFilterPrim();
    this.freq = this.c['FREQ'].get();
    this.cv = this.i['CV'].get();
    this.res = this.i['RES'].get();
    this.LP.freq = this.freq - this.width;
    this.LP.cv = this.cv;
    this.HP.freq = this.freq + this.width;
    this.HP.cv = this.cv;
   
    this.in = 0;
    this.out = 0;
  }

  process() {
    this.in = this.i['IN'].get();
    this.cf = this.i['CF'].get();
    this.width = this.i['WDTH'].get();
    this.freq = this.c['FREQ'].get();
    this.cv = this.i['CV'].get();
    this.res = this.i['RES'].get();

    this.lp_freq = (this.freq * Math.pow(2, this.cv)) - this.width;
    if ((this.lp_freq) < 0) 
      this.lp_freq = 30;
    if ((this.lp_freq) > 10000) 
      this.lp_freq = 9999;
    this.LP.freq = this.lp_freq;

    this.hp_freq = (this.freq * Math.pow(2, this.cv)) + this.width;
    if ((this.hp_freq) < 0) 
      this.hp_freq = 30;
    if ((this.hp_freq) > 10000) 
      this.hp_freq = 9999;

    this.HP.freq = this.hp_freq;
    this.LP.coeff_res = this.res;
    this.HP.coeff_res = this.res;

    this.LP.in = this.in;
    this.HP.in = this.in;

    this.LP.process();
    this.HP.process();

    this.out = (this.LP.lp * this.cf) + (this.HP.hp * (1 - this.cf));

    this.o['OUT'].set(this.out);
  }
}

class ExponentialFilter extends Module {
  constructor({type='LP', freq=4400}={}) {
    super({w:hp2x(4)});

    this.type = type;
    this.base_freq = freq;
    this.freq = this.base_freq;

    this.add_control(new Encoder({x:hp2x(0.6), y:6, r:7, vmin:30, vmax:10000, val:freq, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:0, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, val:0, vmin:0, vmax:1, name:'RES'}));
    this.add_input(new Port({x:hp2x(0.8), y:68, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:88, r:6, name:'LP'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'HP'}));

    this.com = 3;
    this.delay_array = new Array(this.com);
    this.sum = 0;
    this.coeff_in = this.c['FREQ'].get() / 10000;
    this.coeff_del = 1 - this.coeff_in;
    this.coeff_res = this.i['RES'].get();
    for (var i = 0; i < this.com; i++) {
      this.delay_array[i] = new OneSampleDelay();
    }

    this.highpass_delay = new SampleDelay(this.com * 2);
    this.delay_counter = 0;
    this.cv = this.i['CV'].get();
    this.in = 0;
    this.out = 0;
    this.buf = 0;
  }

  process () {
    this.in = this.i['IN'].get();
    this.cv = this.i['CV'].get();
    this.buf = this.in;

    this.highpass_delay.in = this.in;

    this.coeff_in = (this.c['FREQ'].get() * Math.pow(2, this.cv)) / 10000;
    if (this.coeff_in > 1) this.coeff_in = 0.9999;
    this.coeff_res = this.i['RES'].get();
    this.coeff_del = 1 - this.coeff_in;
    this.out = 0;

    this.delay_array[0].in = this.in * this.coeff_in + this.delay_array[0].out * this.coeff_del - this.delay_array[this.com - 1].out * this.coeff_res * this.coeff_in;
    this.out = this.delay_array[0].out;
    for (var i = 1; i < this.com; i++) {
      this.delay_array[i].in = this.out * this.coeff_in + this.delay_array[i].out * this.coeff_del;
      this.out = this.delay_array[i].out;
    }
    for (var i = 0; i < this.com; i++) {
      this.delay_array[i].process();
    }

    // this.highpass_delay.process();

    // this.highpass_delay.in = this.highpass_delay.out - this.out;

    this.in = this.out
    this.delay_array[0].in = this.in * this.coeff_in + this.delay_array[0].out * this.coeff_del - this.delay_array[this.com - 1].out * this.coeff_res * this.coeff_in;
    this.out = this.delay_array[0].out;
    for (var i = 1; i < this.com; i++) {
      this.delay_array[i].in = this.out * this.coeff_in + this.delay_array[i].out * this.coeff_del;
      this.out = this.delay_array[i].out;
    }
    for (var i = 0; i < this.com; i++) {
      this.delay_array[i].process();
    }

    this.highpass_delay.process();

    this.o['LP'].set(this.out);
    this.o['HP'].set(this.highpass_delay.out - this.out);
  }
}

class SimpleOnePoleFilter extends Module {
  constructor({type='LP', freq=440}={}) {
    super({w:hp2x(4)});
    this.scope = new TextDisplay(0, 0, 20, 30);

    this.type = type;
    this.base_freq = freq;
    this.freq = freq;

    this.lp = new OnePoleLPFilter();
    this.hp = new OnePoleHPFilter();

    this.add_input(new Encoder({x:hp2x(0.6), y:66, r:7, name:'FREQ'}));
    this.add_input(new Port({x:hp2x(0.8), y:88, r:7, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:7, name:'OUT'}));
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
    super({w:hp2x(4)});
    // this.scope = new TextDisplay(0, 0, 20, 18);

    this.type = type;
    this.base_freq = freq;

    this.ladder = new LadderFilter();

    this.freq = this.base_freq;

    this.add_control(new Encoder({x:hp2x(0.6), y:26, r:7, vmin:30, vmax:8000, val:freq, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, val:0, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, val:0, vmin:0, vmax:20, name:'RES'}));
    this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
  }

  // draw_cbf(buf, w, h) {
  //   super.draw_cbf(buf, w, h);
  //   let sw = 2;
  //   let rounding = 5;
  //   buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
  //   buf.rect(sw + w * 0.05, sw + 30, w * 0.9 - 2 * sw, h * 0.3 - 2 * sw, rounding, rounding, rounding, rounding);
  // }

  process() {
    this.base_freq = this.c['FREQ'].get();
    this.freq = this.base_freq * Math.pow(2, this.i['CV'].get());
    this.ladder.setCutoffFreq(this.freq);
    this.ladder.setResonance((this.i['RES'].get()) / 20);
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

engine.add_module_class(BPFilter);
engine.add_module_class(SVF);
engine.add_module_class(ExponentialFilter);
engine.add_module_class(SimpleOnePoleFilter);
engine.add_module_class(ResonantFilter);