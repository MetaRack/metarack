class VCO extends Module {

  constructor(freq=120) {
    super({w:hp2x(8)});
    this.freq = freq;
    this.delta = Math.PI * 2 / (sample_rate / freq);
    this.phase = 0;

    this.scope = new RawScope({x:hp2x(0.5), y:hp2y(0.07), w:hp2x(7), h:hp2y(0.35), size:30, divider:64});
    this.attach(this.scope);

    let cv = 0.0001;
    this.add_input(new InputEncoder({x:hp2x(0.9), y:56, r:7, val: cv, vmin:-10, vmax:8, name:'CV'}));
    //this.add_input(new InputEncoder({x:hp2x(4.2 + 1.7), y:56, r:7, val: 0, name:'FM'}));
    this.add_input(new InputEncoder({x:hp2x(4.3), y:56, r:7, vmin:-10, val:0, name:'WAVE'})); //-10 + rackrand() * 20, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2x(0.9), y:81, r:7, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_input(new InputEncoder({x:hp2x(4.3), y:81, r:7, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2x(4.3), y:106, r:7, vmin:0, vmax:10, val:1, name:'OUT', type:'output'}));
    this.add_output(new Port({x:8, y:62, r:7, name:'PHASE_OUT', visible:false}));

    this.value = 0;
    this.type = 0;
    this.mod = 0;
    this.mod_prev = 0;
    this.phase_inc = 0;

    this._alpha = 0.01;
  }

  set_frequency(f) {
    this.freq = f;
    this.delta = Math.PI * 2 / (sample_rate / f);
  }


  process() {

    this.scope.divider = Math.PI / this.phase_inc / this.scope.size * 4;
    this.type = this.i['WAVE'].get() / 10;
    if (this.type >= 0) {
      this.value = Math.sin(this.phase) * (1 - this.type) + (this.phase / Math.PI - 1) * this.type;
    } else {
      this.value = Math.sin(this.phase) * (1 + this.type) - ((this.phase < Math.PI * this.i['PW'].get() * 2 ) * 2 - 1) * this.type;
    }
    this.o['OUT'].set( this.value * this.i['AMP'].get() );
    this.mod = this._alpha * (this.i['CV'].get()) + (1 - this._alpha) * this.mod;
    if (this.mod != this.mod_prev) { this.phase_inc = this.delta * Math.pow(2, this.mod); this.mod_prev = this.mod; }
    this.phase += this.phase_inc;
    this.scope.process( this.o['OUT'].get() * 4)
    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
      this.scope.trig();
    }
    this.o['PHASE_OUT'].set(this.phase);
  }
}

engine.add_module_class(VCO);