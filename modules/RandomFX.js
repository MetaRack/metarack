class RandomFX extends Module {
  constructor() {
    super({w:hp2x(5)});

    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.8, name:'LVL'}));
    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:1, name:'D/W'}));
    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.46), r:hp2x(1), vmin:0, vmax:1, val:0.9, name:'MOD'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P1'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P2'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.46), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P3'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.59), r:hp2x(0.8), name:'I/L'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.69), r:hp2x(0.8), name:'I/R'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.79), r:hp2x(0.8), name:'O/L'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.89), r:hp2x(0.8), name:'O/R'}));

    this.p = new Array(3);
    this.j = 0;
    this.out_l = 0;
    this.out_r = 0;
    this.max_param = 11;
    this.params = new Array(this.max_param);
    this.lfos = new Array(3);
    this.lfo_connect = new Array(3);
    this.enc_connect = new Array(3);
    this.pick_lfo();
    this.pick_enc();
    for (this.j = 0; this.j < 3; this.j++) {
      this.lfos[this.j] = new VCOPrim();
      this.lfos[this.j].set_frequency(Math.random() / 4);
    }

    this.saturn_l = new SaturnPrim();
    this.params[0] = Math.random() + 1;
    this.saturn_r = new SaturnPrim();
    this.params[1] = Math.random() + 1;

    // this.chorus_l = new DelayPrim();
    // this.chorus_l.time = 0.03;
    // this.chorus_l.dw = 0.5;
    // this.chorus_l.fb = 0.5;

    // this.chorus_r = new DelayPrim();
    // this.chorus_r.time = 0.03;
    // this.chorus_r.dw = 0.5;
    // this.chorus_r.fb = 0.5;

    // this.chorus_lfo = new VCOPrim(0.2);

    this.delay_l = new DelayPrim();
    // this.params[2] = (0.5 + Math.random() / 3) * 10;
    // this.params[3] = 0.5 + Math.random() / 3;
    // this.params[4] = 0.5 + Math.random() / 3;
    // this.params[2] = Math.random() * 4 + 4;
    // this.params[3] = Math.random() / 3 + 0.3;
    // this.params[4] = Math.random() / 3 + 0.5;
    this.params[2] = Math.random() * 10;
    this.params[3] = Math.random();
    this.params[4] = Math.random();
    this.delay_r = new DelayPrim();
    // this.params[5] = (0.5 + Math.random() / 3) * 10;
    // this.params[6] = 0.5 + Math.random() / 3;
    // this.params[7] = 0.5 + Math.random() / 3;
    // this.params[5] = (Math.random()) * 4 + 4;
    // this.params[6] = Math.random() / 3 + 0.3;
    // this.params[7] = Math.random() / 3 + 0.5;
    this.params[5] = (Math.random()) * 10;
    this.params[6] = Math.random() / 1;
    this.params[7] = Math.random() / 1;
    this.reverb = new DattorroReverbPrim();
    this.params[8] = Math.random() / 1;
    this.params[9] = Math.random() / 1;
    this.params[10] = Math.random() / 1;
    // this.params[8] = 0.7 + Math.random() / 3;
    // this.params[9] = 0.7 + Math.random() / 3;
    // this.params[10] = 0.3 + Math.random() / 5;
    this.update_params();
  }

  pick_lfo() {
    this.lfo_connect[0] = Math.floor(Math.random() * (this.max_param - 5)) + 2;

    this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param - 5)) + 2;
    while (this.lfo_connect[1] == this.lfo_connect[0])
       this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param - 5)) + 2;

    this.lfo_connect[2] = Math.floor(Math.random() * (this.max_param - 5)) + 2;
    while ((this.lfo_connect[2] == this.lfo_connect[0]) || (this.lfo_connect[2] == this.lfo_connect[1]))
       this.lfo_connect[2] = Math.floor(Math.random() * (this.max_param - 5)) + 2;
  }

  pick_enc() {
    this.enc_connect[0] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[1] = Math.floor(Math.random() * this.max_param);
    while (this.enc_connect[1] == this.enc_connect[0])
       this.enc_connect[1] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[2] = Math.floor(Math.random() * this.max_param);
    while ((this.enc_connect[2] == this.enc_connect[0]) || (this.enc_connect[2] == this.enc_connect[1]))
       this.enc_connect[2] = Math.floor(Math.random() * this.max_param);
  }

  update_params() {
    this.level = this.i['LVL'].get();
    this.dw = this.i['D/W'].get();
    this.mod = this.i['MOD'].get();
    this.p[0] = this.i['P1'].get();
    this.p[1] = this.i['P2'].get();
    this.p[2] = this.i['P3'].get();
    this.in_l = this.i['I/L'].get();
    this.in_r = this.i['I/R'].get();

    this.prev_params = this.params;

    for (this.j = 0; this.j < 3; this.j++) {
      //this.params[this.lfo_connect[this.j]] += this.lfos[this.j].out / 2 * this.mod;
      this.params[this.lfo_connect[this.j]] *= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
      this.params[this.enc_connect[this.j]] *= ((this.p[this.j] + 0.1) * 2);
      //this.params[this.enc_connect[this.j]] += (this.p[this.j] - 0.5) * 2;
      //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    }

    this.saturn_l.fold = Math.max(1, this.params[0] * this.level);
    this.saturn_r.fold = Math.max(1, this.params[1] * this.level);

    this.delay_l.time = this.params[2] * this.level;
    this.delay_l.fb = this.params[3] * this.level;
    this.delay_l.dw = this.params[4] * this.level;

    this.delay_r.time = this.params[5] * this.level;
    this.delay_r.fb = this.params[6] * this.level;
    this.delay_r.dw = this.params[7] * this.level;

    this.reverb.size = (Math.min(this.params[8] * this.level, 0.7)) ** 2;
    this.reverb.decay = (Math.min(this.params[9] * this.level, 0.7)) ** 2;
    this.reverb.dw = (Math.min(this.params[10] * this.level, 0.7)) ** 2;

    for (this.j = 0; this.j < 3; this.j++) {
      this.params[this.enc_connect[this.j]] /= ((this.p[this.j] + 0.1) * 2);
      this.params[this.lfo_connect[this.j]] /= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
      //this.params[this.lfo_connect[this.j]] -= this.lfos[this.j].out / 2 * this.mod;
      //this.params[this.enc_connect[this.j]] -= (this.p[this.j] - 0.5) * 2;
      //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    }
  }

  process() {
    this.update_params();

    this.saturn_l.in = this.in_l;
    this.saturn_r.in = this.in_r;

    this.delay_l.in = this.saturn_l.out;
    this.delay_r.in = this.saturn_r.out;

    this.delay_l.in = this.in_l;
    this.delay_r.in = this.in_r;

    this.reverb.in_l = this.delay_l.out;
    this.reverb.in_r = this.delay_r.out; 

    // this.out_l = this.reverb.out_l * this.dw + this.in_l * (1 - this.dw);
    // this.out_r = this.reverb.out_r * this.dw + this.in_r * (1 - this.dw);

    this.out_l = this.delay_l.out * this.dw + this.in_l * (1 - this.dw);
    this.out_r = this.delay_r.out * this.dw + this.in_r * (1 - this.dw);

    if (this.out_l > 1) this.out_l = 1;
    if (this.out_l < -1) this.out_l = -1;

    if (this.out_r > 1) this.out_r = 1;
    if (this.out_r < -1) this.out_r = -1;

    this.o['O/L'].set(this.out_l);
    this.o['O/R'].set(this.out_r);

    
    for (this.j = 0; this.j < 3; this.j++) {
      this.lfos[this.j].process();
    }
    this.saturn_l.process();
    this.saturn_r.process();
    this.delay_l.process();
    this.delay_r.process();
    //this.reverb.process();
    // Chorus??
  }
}

engine.add_module_class(RandomFX);