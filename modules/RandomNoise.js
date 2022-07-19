

class RandomNoise extends Module {
  constructor() {
    super({w:hp2x(10)});

    this.add_input(new InputEncoder({x:hp2x(1), y:hp2y(0.6), r:hp2x(1), vmin:0, vmax:1, val:1, name:'MOD'}));
    this.add_input(new InputEncoder({x:hp2x(4), y:hp2y(0.6), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P4'}));
    this.add_input(new InputEncoder({x:hp2x(7), y:hp2y(0.6), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P5'}));
    this.add_input(new InputEncoder({x:hp2x(1), y:hp2y(0.4), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P1'}));
    this.add_input(new InputEncoder({x:hp2x(4), y:hp2y(0.4), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P2'}));
    this.add_input(new InputEncoder({x:hp2x(7), y:hp2y(0.4), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P3'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.79), r:hp2x(0.8), name:'O/L'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.89), r:hp2x(0.8), name:'O/R'}));

    this.scope = new RawScope({x: this.w * 0.05, y:this.h * 0.05, w:this.w - this.w * 0.1, h:this.h*0.25, size:30, divider:64});
    this.attach(this.scope);
    this.delta = Math.PI * 2 / (sample_rate / 2);
    this.phase_inc = this.delta;

    this.max_enc = 5;
    this.p = new Array(5);
    this.gate = 0;
    this.pitch = 0;
    this.j = 0;
    this.out = 0;
    this.max_param = 11;
    this.counter = 0;
    this.vldv = Math.round(Math.random() * 3) + 1;
    this.params = new Array(this.max_param);
    this.lfos = new Array(this.max_enc);
    this.lfo_connect = new Array(this.max_enc);
    this.enc_connect = new Array(this.max_enc);
    this.pick_lfo();
    this.pick_enc();
    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j] = new VCOPrim();
      this.lfos[this.j].set_frequency(Math.random() / 6);
    }

    this.params[0] = Math.random() * 10;
    this.params[1] = Math.random() * 10;
    this.params[2] = Math.random() * 10;
    this.params[3] = Math.random() * 10;    

    this.reverb = new DattorroReverbPrim();
    this.params[4] = 0.7 + Math.random() / 3;
    this.params[5] = 0.7 + Math.random() / 3;
    this.params[6] = 0.6 + Math.random() / 5;
    this.chorus = new ChorusPrim();
    this.params[7] = 0.2 + Math.random() / 3; //level
    this.params[8] = Math.random() * 2; //rate
    this.filter = new ExponentialFilterPrim();
    this.params[9] = (Math.random() * 1400) + 600; //freq;
    this.params[10] = Math.random() / 2;//res

    this.expr = function (t, c, p1, p2, p3, p4) {
      return (((t / c) / 2 % (p1 * 13)) + 3) * 2 + (((t / c) / 4 % (p2 * 19)) >> (p3 * 3) + 1)  | (((t / c) ^ (p4) * 11))
    }

    this.expr2 = function (t, c, p1, p2, p3, p4) {
      return (t / c) / (2 + p3) * (((t / c) >> (7 + p2)) % 5)
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
    this.counter++;

    this.p[3] = this.i['P4'].get();
    this.p[4] = this.i['P5'].get();
    this.mod = this.i['MOD'].get();
    this.p[0] = this.i['P1'].get();
    this.p[1] = this.i['P2'].get();
    this.p[2] = this.i['P3'].get();


    // for (this.j = 0; this.j < this.max_enc; this.j++) {
    //   //this.params[this.lfo_connect[this.j]] += this.lfos[this.j].out / 2 * this.mod;
    //   this.params[this.lfo_connect[this.j]] *= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
    //   //this.params[this.enc_connect[this.j]] += (this.p[this.j] - 0.5) * 2;
    //   this.params[this.enc_connect[this.j]] *= ((this.p[this.j] + 0.1) * 2);
    //   //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    // }

    for (this.j = 0; this.j < 4; this.j++) {
      this.params[this.j] = Math.max(this.params[this.j], 1);
    }

    this.reverb.size = Math.sqrt(Math.max(0.5, this.params[4]));
    this.reverb.decay = Math.max(0.5, this.params[5]);
    this.reverb.dw = Math.sqrt(Math.max(0.7, this.params[6]));
    this.chorus.level = this.params[7];
    this.chorus.rate = this.params[8];
    this.filter.freq = Math.min(Math.max(this.params[9], 600), 2000);
    this.filter.coeff_res = this.params[10];

    // for (this.j = 0; this.j < this.max_enc; this.j++) {
    //   this.params[this.enc_connect[this.j]] /= ((this.p[this.j] + 0.1) * 2);
    //   this.params[this.lfo_connect[this.j]] /= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
    //   //this.params[this.lfo_connect[this.j]] -= this.lfos[this.j].out / 2 * this.mod;
    //   //this.params[this.enc_connect[this.j]] -= (this.p[this.j] - 0.5) * 2;
    //   //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    // }
  }

  process() {

    this.scope.divider = Math.PI / this.phase_inc / this.scope.size * 4;
		this.phase += this.phase_inc;
    this.scope.process((this.out_l - 0.05) * 40)
    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
      this.scope.trig();
    }

    this.update_params();

    this.out_l = 0;
    this.out_r = 0;

    this.value1 = this.expr(this.counter, this.vldv, Math.round(this.params[0]), Math.round(this.params[1]), Math.round(this.params[2]), Math.round(this.params[3]));
    this.value2 = this.expr2(this.counter, this.vldv, Math.round(this.params[0]), Math.round(this.params[1]), Math.round(this.params[2]), Math.round(this.params[3]));
    
    if (isNaN(this.value1) || isNaN(this.value2))
      console.log('hehe')

    this.value1 = ((this.value1 % 0xFF) / 25.6) / 10;
    this.value2 = ((this.value2 % 0xFF) / 25.6) / 10;



    this.filter.in = (this.value2 + this.value1) / 2;
    // this.reverb.in_l = this.filter.lp;
    // this.reverb.in_r = this.filter.lp;
    //this.chorus.in = this.reverb.out_l;
    this.chorus.in = this.filter.lp;
    this.out_l = this.chorus.out_l;
    this.out_r = this.chorus.out_r;

    this.filter.process();
    // this.reverb.process();
    this.chorus.process();

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j].process();
    }

    this.out_l /= 5;
    this.out_r /= 5;

    if (this.out_l > 1) this.out_l = 1;
    if (this.out_l < -1) this.out_l = -1;

    if (this.out_r > 1) this.out_r = 1;
    if (this.out_r < -1) this.out_r = -1;

    this.o['O/L'].set(this.out_l * 4);
    this.o['O/R'].set(this.out_r * 4);
  }
}

engine.add_module_class(RandomNoise);