

class Particles extends Module {
  constructor() {
    super({w:hp2x(8)});

    this.add_input(new InputEncoder({x:hp2x(0.9), y:56, r:7, vmin:1, vmax:5, val:1, precision: 0, name:'TYPE'}));
    this.add_input(new InputEncoder({x:hp2x(4.3), y:56, r:7, vmin:0, vmax:1, val:0.5, name:'CLR'}));
    this.add_input(new InputEncoder({x:hp2x(0.9), y:81, r:7, vmin:0, vmax:1, val:0.5, name:'FX'}));
    this.add_input(new InputEncoder({x:hp2x(4.3), y:81, r:7,  vmin:0, vmax:1, val:0.5, name:'PAN'}));
    this.add_output(new Port({x:hp2x(4.3), y:106, r:7, name:'O/R', type:'output'}));
    this.add_output(new Port({x:hp2x(0.9), y:106, r:7, name:'O/L', type:'output'}));

    this.scope = new RawScopeDouble({x:hp2x(0.5), y:hp2y(0.07), w:hp2x(7), h:hp2y(0.35), size:30, divider:64});
    this.attach(this.scope);
    this.delta = Math.PI * 2 / (sample_rate / 2);
    this.phase_inc = this.delta;

    this.p = this.i['FX'].get();
    this.gate = 0;
    this.pitch = 0;
    this.j = 0;
    this.out = 0;
    this.max_param = 11;
    this.counter = 0;
    this.vldv = Math.round(this.i['TYPE'].get());
    this.params = new Array(this.max_param);
    this.lfos = new Array(this.max_enc);
    this.lfo_connect = new Array(this.max_enc);
    this.enc_connect = new Array(this.max_enc);
    this.chorus = new ChorusPrim();
    this.filter = new ExponentialFilterPrim();

    this.expr = function (t, c, p1, p2, p3, p4) {
      return (((t / c) / 2 % (p1)) + 3) * 2 + (((t / c) / 4 % (p2)) >> (p3) + 1)  | (((t / c) ^ (p4)))
    }

    this.expr2 = function (t, c, p1, p2, p3, p4) {
      return (t / c) / (p3) * (((t / c) >> (p2)) % 5)
    }

    this.update_params();

    this.randomize();
  }

  randomize() {
    this.i['PAN'].set(rackrand());
    this.i['FX'].set(rackrand());
    this.i['TYPE'].set(Math.round(rackrand() * 5));
    this.i['CLR'].set(rackrand());
  }

  pick_lfo() {
    this.lfo_connect[0] = Math.floor(rackrand() * (this.max_param));

    this.lfo_connect[1] = Math.floor(rackrand() * (this.max_param));
    while (this.lfo_connect[1] == this.lfo_connect[0])
       this.lfo_connect[1] = Math.floor(rackrand() * (this.max_param));

    this.lfo_connect[2] = Math.floor(rackrand() * (this.max_param));
    while ((this.lfo_connect[2] == this.lfo_connect[0]) || (this.lfo_connect[2] == this.lfo_connect[1]))
       this.lfo_connect[2] = Math.floor(rackrand() * (this.max_param));

    this.lfo_connect[3] = Math.floor(rackrand() * (this.max_param));
    while ((this.lfo_connect[3] == this.lfo_connect[0]) || (this.lfo_connect[3] == this.lfo_connect[1]) || (this.lfo_connect[3] == this.lfo_connect[2]))
       this.lfo_connect[3] = Math.floor(rackrand() * (this.max_param));

    this.lfo_connect[4] = Math.floor(rackrand() * (this.max_param));
    while ((this.lfo_connect[4] == this.lfo_connect[0]) || (this.lfo_connect[4] == this.lfo_connect[1]) || (this.lfo_connect[4] == this.lfo_connect[2]) || (this.lfo_connect[4] == this.lfo_connect[3]))
       this.lfo_connect[4] = Math.floor(rackrand() * (this.max_param));
  }

  pick_enc() {
    this.enc_connect[0] = Math.floor(rackrand() * this.max_param);

    this.enc_connect[1] = Math.floor(rackrand() * this.max_param);
    while (this.enc_connect[1] == this.enc_connect[0])
       this.enc_connect[1] = Math.floor(rackrand() * this.max_param);

    this.enc_connect[2] = Math.floor(rackrand() * this.max_param);
    while ((this.enc_connect[2] == this.enc_connect[0]) || (this.enc_connect[2] == this.enc_connect[1]))
       this.enc_connect[2] = Math.floor(rackrand() * this.max_param);

    this.enc_connect[3] = Math.floor(rackrand() * this.max_param);
    while ((this.enc_connect[3] == this.enc_connect[0]) || (this.enc_connect[3] == this.enc_connect[1]) || (this.enc_connect[3] == this.enc_connect[2]))
       this.enc_connect[3] = Math.floor(rackrand() * this.max_param);

    this.enc_connect[4] = Math.floor(rackrand() * this.max_param);
    while ((this.enc_connect[4] == this.enc_connect[0]) || (this.enc_connect[4] == this.enc_connect[1]) || (this.enc_connect[4] == this.enc_connect[2]) || (this.enc_connect[4] == this.enc_connect[3]))
       this.enc_connect[4] = Math.floor(rackrand() * this.max_param);
  }

  update_params() {
    this.counter++;

    this.p = this.i['FX'].get();
    this.vldv = Math.round(this.i['TYPE'].get());
    this.chorus.rate = this.i['PAN'].get(); 
    this.chorus.level = this.chorus.rate * 2; 
    this.filter.freq = (this.i['CLR'].get() * 1400) + 600;
  }

  process() {

    this.scope.divider = Math.PI / this.phase_inc / this.scope.size * 4;
		this.phase += this.phase_inc;
    this.scope.process([(this.out_l - 0.05) * 40, (this.out_r - 0.05) * 40])
    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
      this.scope.trig();
    }

    this.update_params();

    this.out_l = 0;
    this.out_r = 0;



    //console.log([this.counter, this.vldv, Math.round(this.p), Math.round(this.p * 8), Math.round(this.p * 4), Math.round(this.p)])
    if (this.vldv == 0) this.vldv = 1;
    this.value1 = this.expr(this.counter, this.vldv, Math.round(this.p * rackrand() * 15) + 1, Math.round(this.p * rackrand() * 19) + 1, Math.round(this.p * rackrand() * 5) + 1, Math.round(this.p * rackrand() * 12) + 1);
    this.value2 = this.expr2(this.counter, this.vldv, Math.round(this.p * rackrand() * 2) + 1, Math.round(this.p * rackrand() * 10) + 1, Math.round(this.p * rackrand() * 5) + 1, Math.round(this.p) + 1);

    if (isNaN(this.value1) || isNaN(this.value2))
      return

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

    // for (this.j = 0; this.j < this.max_enc; this.j++) {
    //   this.lfos[this.j].process();
    // }

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

engine.add_module_class(Particles);