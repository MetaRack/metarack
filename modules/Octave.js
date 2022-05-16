class Octave extends Module {
	constructor() {
    super({name:'Octave', w:hp2px(4)});

    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:-5, vmax:5, val:0, precision:0, name:'OCT'}));

    this.oct = this.c['OCT'].get().toFixed(0);
    this.value = 0;
  }

  draw_dbf (buf, x, y, w, h) {
    this.oct = this.c['OCT'].get().toFixed(0);
  }

  process() {
  	this.value = this.i['IN'].get();
  	this.value = this.value + this.oct;
  	this.value = Math.min(10, this.value);
  	this.value = Math.max(-10, this.value);
    this.o['OUT'].set(this.value);
  }
}

engine.add_module_class(Octave);