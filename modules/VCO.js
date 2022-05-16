class VCO extends Module {

  constructor(freq) {
    super({w:hp2px(10)});
    this.freq = freq;
    this.delta = Math.PI * 2 / (sample_rate / freq);
    this.phase = 0;

    this.scope = new RawScope({x: this.w * 0.05, y:this.h * 0.05, w:this.w - this.w * 0.1, h:this.h*0.25, size:30, divider:64});
    this.attach(this.scope);

    let cv = 0.0001;
    this.add_input(new InputEncoder({x:hp2px(1), y:42, r:9, val: cv, vmin:-10, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2px(5.5), y:42, r:9, val: 0, name:'FM'}));
    this.add_input(new InputEncoder({x:hp2px(1), y:70, r:9, vmin:-10, val:10, name:'WAVE'})); //-10 + rackrand() * 20, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2px(5.5), y:70, r:9, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_input(new InputEncoder({x:hp2px(1), y:98, r:9, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2px(5.5), y:98, r:9, vmin:0, vmax:10, val:1, name:'OUT'}));
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
    this.mod = this._alpha * (this.i['CV'].get() + this.i['FM'].get()) + (1 - this._alpha) * this.mod;
    if (this.mod != this.mod_prev) { this.phase_inc = this.delta * Math.pow(2, this.mod); this.mod_prev = this.mod; }
    this.phase += this.phase_inc;
    this.scope.process( this.o['OUT'].get() )
    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
      this.scope.trig();
    }
    this.o['PHASE_OUT'].set(this.phase);
  }
}

engine.add_module_class(VCO);