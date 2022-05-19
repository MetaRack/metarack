class SVCO extends Module {

  constructor(freq=261) {
    super({w:hp2x(4)});

    this.add_control(new Encoder({x:hp2x(0.6), y:6, r:7, vmin:0.001, vmax:1600, val:freq, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:0, name:'FM'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, vmin:-10, val:0, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:86, r:7, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2x(0.6), y:106, r:7, vmin:0, vmax:10, val:1, name:'OUT'}));

    this.freq = this.c['FREQ'].get();
    this.VCO = new VCOPrim(this.freq);
    this.VCO.fm = this.i['FM'].get();
    this.VCO.set_wave(this.i['WAVE'].get());
    this.VCO.pw = this.i['PW'].get();
    //this.VCO.amp = this.i['AMP'].get();
    this.amp = this.i['AMP'].get();
  }

  set_frequency(f) {
    this.freq = f;
    this.VCO.set_frequency(f);
  }

  process() {
    this.amp = this.i['AMP'].get();
  	this.VCO.set_frequency(this.c['FREQ'].get());
  	this.VCO.fm = this.i['FM'].get();
    this.VCO.set_wave(this.i['WAVE'].get());
    this.VCO.pw = this.i['PW'].get();
    //this.VCO.amp = this.i['AMP'].get();
    this.VCO.process();
    this.o['OUT'].set(this.VCO.out * this.amp);
  }
}

engine.add_module_class(SVCO);