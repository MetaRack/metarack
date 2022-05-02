class SVCO extends Module {

  constructor(freq=261) {
    super({w:hp2px(4)});

    this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:0.001, vmax:800, val:freq, name:'FREQ'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, val:0, name:'FM'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:-10, val:0, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:86, r:7, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2px(0.6), y:106, r:7, vmin:0, vmax:10, val:1, name:'OUT'}));

    this.freq = this.c['FREQ'].get();
    this.VCO = new VCOPrim(this.freq);
    this.VCO.fm = this.i['FM'].get();
    this.VCO.set_wave(this.i['WAVE'].get());
    this.VCO.pw = this.i['PW'].get();
    this.VCO.amp = this.i['AMP'].get();
  }

  set_frequency(f) {
    this.freq = f;
    this.VCO.set_frequency(f);
  }

  // draw_dbf (buf, x, y, w, h) {
  //   if (this.c['FREQ'].changed)
  //     this.set_frequency(this.c['FREQ'].get());
  // }

  process() {
  	this.VCO.set_frequency(this.c['FREQ'].get());
  	//this.VCO.freq = this.c['FREQ'].get();
    //this.VCO.delta = Math.PI * 2 / (sample_rate / this.VCO.freq);
  	this.VCO.fm = this.i['FM'].get();
    this.VCO.set_wave(this.i['WAVE'].get());
    this.VCO.pw = this.i['PW'].get();
    this.VCO.amp = this.i['AMP'].get();
    this.VCO.process();
    this.o['OUT'].set(this.VCO.out);
  }
}