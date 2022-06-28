

class RandomScale extends Module {
  constructor() {
    super({w:hp2x(5)});

    this.add_input(new InputEncoder({x:hp2x(2.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:1, name:'MOD'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P1'}));
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P2'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.79), r:hp2x(0.8), name:'GATE'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.89), r:hp2x(0.8), name:'OUT'}));
    this.max_enc = 2;
    this.p = new Array(2);
    this.gate = 0;
    this.pitch = 0;
    this.j = 0;
    this.out = 0;
    this.div = 0;
    this.div_counter = 0;
    this.prev_gate = 0;
    this.max_param = 5;
    this.params = new Array(this.max_param);
    this.lfos = new Array(this.max_enc);
    this.lfo_connect = new Array(this.max_enc);
    this.enc_connect = new Array(this.max_enc);
    //this.pick_lfo();
    this.lfo_connect[0] = 2;
    this.lfo_connect[1] = 3;
    this.pick_enc();
    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j] = new VCOPrim();
      this.lfos[this.j].set_frequency(Math.random());
    }

    this.scale = new ScalePrim();
    this.params[0] = Math.floor(Math.random() * 9); //scale
    this.params[1] = Math.floor(Math.random() * 12); //root

    this.sh = new SampleAndHoldPrim();

    this.params[2] = (Math.random() * 3) - 1.5; //offset
    this.params[3] = Math.random() * 2; //scale

    this.params[4] = Math.floor(Math.random() * 4) + 1;

    this.update_params();
  }

  pick_lfo() {
    this.lfo_connect[0] = Math.floor(Math.random() * (this.max_param));

    this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param));
    while (this.lfo_connect[1] == this.lfo_connect[0])
       this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param));
  }

  pick_enc() {
    this.enc_connect[0] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[1] = Math.floor(Math.random() * this.max_param);
    while (this.enc_connect[1] == this.enc_connect[0])
       this.enc_connect[1] = Math.floor(Math.random() * this.max_param);
  }

  update_params() {

    this.mod = this.i['MOD'].get();
    this.p[0] = this.i['P1'].get();
    this.p[1] = this.i['P2'].get();
    this.gate = this.i['GATE'].get();


    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.params[this.lfo_connect[this.j]] *= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
      //this.params[this.lfo_connect[this.j]] += this.lfos[this.j].out * 2 * this.mod;
      //this.params[this.enc_connect[this.j]] += (this.p[this.j] - 0.5) * 2;
      this.params[this.enc_connect[this.j]] *= ((this.p[this.j] + 0.1) * 2);
    }

    for (this.j = 0; this.j < 4; this.j++) {
      this.params[this.j] = Math.max(this.params[this.j], 0);
    }

    this.scale.scale = Math.floor(this.params[0]);
    this.scale.root = Math.floor(this.params[1]);

    if (this.params[2] < -1.5) this.params[2] = -1.5;
    if (this.params[2] > 1.5) this.params[2] = 1.5;

    if (this.params[3] < 0) this.params[3] = 0;
    if (this.params[3] > 2) this.params[3] = 2;

    if (this.params[4] < 0) this.params[4] = 0;
    if (this.params[4] > 3) this.params[4] = 3;

    this.div = Math.floor(this.params[4]) + 1;

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.params[this.enc_connect[this.j]] /= ((this.p[this.j] + 0.1) * 2);
      this.params[this.lfo_connect[this.j]] /= (this.lfos[this.j].out + 1.1) * (this.mod + 0.001);
      //this.params[this.lfo_connect[this.j]] -= this.lfos[this.j].out / 2 * this.mod;
      //this.params[this.enc_connect[this.j]] -= (this.p[this.j] - 0.5) * 2;
      //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    }
  }

  process() {
    this.update_params();

    this.out = 0;

    if (this.prev_gate < this.gate) {
      this.div_counter++;
      if (this.div_counter >= this.div) {
        this.div_counter = 0;
        this.sh.gate = 10;
      } 
      else
        this.sh.gate = 0;
    }
    else {
      this.sh.gate = 0;
    }
    //this.sh.gate = this.gate;
    this.sh.in = (Math.random() - 0.5) * this.params[3] + this.params[2];

    this.scale.in = this.sh.out;
    this.out = this.scale.out;
    
    this.o['OUT'].set(this.out);

    this.scale.process();
    this.sh.process();

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j].process();
    }

    this.prev_gate = this.gate;
  }
}

engine.add_module_class(RandomScale);