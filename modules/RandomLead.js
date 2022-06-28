class RandomLead extends Module {
  constructor() {
    super({w:hp2x(5)});

    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:1, name:'MOD'}));
    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P4'}));
    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.46), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P5'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P1'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P2'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.46), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P3'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.59), r:hp2x(0.8), name:'GATE'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.69), r:hp2x(0.8), name:'PTCH'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.79), r:hp2x(0.8), name:'OUT'}));
    this.max_enc = 5;
    this.p = new Array(5);
    this.gate = 0;
    this.pitch = 0;
    this.j = 0;
    this.out = 0;
    this.max_param = 30;
    this.params = new Array(this.max_param);
    this.lfos = new Array(this.max_enc);
    this.lfo_connect = new Array(this.max_enc);
    this.enc_connect = new Array(this.max_enc);
    this.pick_lfo();
    this.pick_enc();
    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j] = new VCOPrim();
      this.lfos[this.j].set_frequency(Math.random() / 3);
    }

    this.osc = new Array(3);
    this.env = new Array(3);
    this.bg = new Array(3);
    this.filter = new Array(3);

    this.reverb = new DattorroReverbPrim();
    this.reverb.size = 0.7;
    this.reverb.decay = 0.7;
    this.reverb.dw = 0.7;

    for (this.j = 0; this.j < 3; this.j++) {
      this.osc[this.j] = new VCOPrim();
      this.osc[this.j].set_frequency(261.63 * Math.pow(2, Math.round((Math.random() - 0.7) * 2)));
      this.params[0 + 10*this.j] = Math.random() / 2; //pw
      this.params[1 + 10*this.j] = (Math.random() - 0.5) * 6; //wave
      this.params[2 + 10*this.j] = Math.random(); //amp

      this.env[this.j] = new ADSRPrim();
      this.params[3 + 10*this.j] = Math.random() * 10; //A
      this.params[4 + 10*this.j] = Math.random() * 10; //D
      this.params[5 + 10*this.j] = Math.random(); //S
      this.params[6 + 10*this.j] = Math.random() * 50; //R

      this.bg[this.j] = new BernoulliGatePrim();
      this.params[7 + 10*this.j] = Math.random(); //p

      this.filter[this.j] = new ExponentialFilterPrim();
      this.params[8 + 10*this.j] = Math.random() * 8000; //freq;
      this.params[9 + 10*this.j] = Math.random() / 2;//res
    }

    this.update_params();
  }

  pick_lfo() {
    this.lfo_connect[0] = Math.floor(Math.random() * (this.max_param));

    this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param));
    while (this.lfo_connect[1] == this.lfo_connect[0])
       this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param));

    this.lfo_connect[2] = Math.floor(Math.random() * (this.max_param));
    while ((this.lfo_connect[2] == this.lfo_connect[0]) || (this.lfo_connect[2] == this.lfo_connect[1]))
       this.lfo_connect[2] = Math.floor(Math.random() * (this.max_param));

    this.lfo_connect[3] = Math.floor(Math.random() * (this.max_param));
    while ((this.lfo_connect[3] == this.lfo_connect[0]) || (this.lfo_connect[3] == this.lfo_connect[1]) || (this.lfo_connect[3] == this.lfo_connect[2]))
       this.lfo_connect[3] = Math.floor(Math.random() * (this.max_param));

    this.lfo_connect[4] = Math.floor(Math.random() * (this.max_param));
    while ((this.lfo_connect[4] == this.lfo_connect[0]) || (this.lfo_connect[4] == this.lfo_connect[1]) || (this.lfo_connect[4] == this.lfo_connect[2]) || (this.lfo_connect[4] == this.lfo_connect[3]))
       this.lfo_connect[4] = Math.floor(Math.random() * (this.max_param));
  }

  pick_enc() {
    this.enc_connect[0] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[1] = Math.floor(Math.random() * this.max_param);
    while (this.enc_connect[1] == this.enc_connect[0])
       this.enc_connect[1] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[2] = Math.floor(Math.random() * this.max_param);
    while ((this.enc_connect[2] == this.enc_connect[0]) || (this.enc_connect[2] == this.enc_connect[1]))
       this.enc_connect[2] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[3] = Math.floor(Math.random() * this.max_param);
    while ((this.enc_connect[3] == this.enc_connect[0]) || (this.enc_connect[3] == this.enc_connect[1]) || (this.enc_connect[3] == this.enc_connect[2]))
       this.enc_connect[3] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[4] = Math.floor(Math.random() * this.max_param);
    while ((this.enc_connect[4] == this.enc_connect[0]) || (this.enc_connect[4] == this.enc_connect[1]) || (this.enc_connect[4] == this.enc_connect[2]) || (this.enc_connect[4] == this.enc_connect[3]))
       this.enc_connect[4] = Math.floor(Math.random() * this.max_param);
  }

  update_params() {
    this.p[3] = this.i['P4'].get();
    this.p[4] = this.i['P5'].get();
    this.mod = this.i['MOD'].get();
    this.p[0] = this.i['P1'].get();
    this.p[1] = this.i['P2'].get();
    this.p[2] = this.i['P3'].get();
    this.gate = this.i['GATE'].get();
    this.pitch = this.i['PTCH'].get();


    for (this.j = 0; this.j < this.max_enc; this.j++) {
      //this.params[this.lfo_connect[this.j]] += (this.lfos[this.j].out / 2 * this.mod);
      this.params[this.lfo_connect[this.j]] *= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
      this.params[this.enc_connect[this.j]] *= ((this.p[this.j] + 0.1) * 2);
      //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    }

    for (this.j = 0; this.j < 3; this.j++) {
      this.osc[this.j].pw = this.params[0 + 10*this.j];
      this.osc[this.j].wave = this.params[1 + 10*this.j];
      this.osc[this.j].amp = Math.max(this.params[2 + 10*this.j], 0.7);
      this.osc[this.j].cv = this.pitch;

      this.env[this.j].A = this.params[3 + 10*this.j];
      this.env[this.j].D = this.params[4 + 10*this.j];
      this.env[this.j].S = this.params[5 + 10*this.j];
      this.env[this.j].R = this.params[6 + 10*this.j];

      this.bg[this.j].p = this.params[7 + 10*this.j];

      this.filter[this.j].freq = Math.min(Math.max(this.params[8 + 10*this.j], 1000), 8000);
      // this.filter[this.j].freq = this.params[8 + 10*this.j];
      this.filter[this.j].coeff_res = this.params[9 + 10*this.j];
    }

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.params[this.enc_connect[this.j]] /= ((this.p[this.j] + 0.1) * 2);
      this.params[this.lfo_connect[this.j]] /= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
      //this.params[this.lfo_connect[this.j]] -= (this.lfos[this.j].out / 2 * this.mod);
      //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    }
  }

  process() {
    this.update_params();

    this.out = 0;
    for (this.j = 0; this.j < 3; this.j++) {
      this.bg[this.j].gate = this.gate;
      this.env[this.j].gate = this.bg[this.j].out_l;
      this.filter[this.j].in = this.osc[this.j].out;
      this.out += this.filter[this.j].lp * this.env[this.j].out / 10;

      this.bg[this.j].process();
      this.osc[this.j].process();
      this.env[this.j].process();
      this.filter[this.j].process();
    }

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j].process();
    }

    this.reverb.in_l = this.out / 3;
    this.reverb.in_r = this.out / 3;
    this.reverb.process();
    this.o['OUT'].set(this.reverb.out_l);
  }
}

engine.add_module_class(RandomLead);