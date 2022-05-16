class RandomGenerator extends Module {
	constructor() {
		super({w:hp2px(4)});
		this.offset = 0;
		this.scale = 0;
		this.pm = 0;
      	this.add_output(new Port({x:hp2px(0.6), y:106, r:7, default_value:0, name:'OUT'}));
      	this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:0.01, vmax:10, val:1, name:'FREQ'}));
      	this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:-5, vmax:5, val:0, name:'CV'}));
      	this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:-5, vmax:5, val:0, name:'OFST'}));
      	this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:0.01, vmax:5, val:1, name:'SCL'}));
      	this.add_input(new InputEncoder({x:hp2px(0.6), y:86, r:7, vmin:0, vmax:1, val:0, name:'PM'}));

      	this.OSC = new VCOPrim();
      	this.prev_out = -1;
      	this.out = 0;
	}	

	set_param() {
		this.freq = this.c['FREQ'].get();
		this.cv = this.i['CV'].get();
		this.offset = this.i['OFST'].get();
		this.scale = this.i['SCL'].get();
		this.pm = this.i['PM'].get();

		this.OSC.cv = this.cv;
		this.OSC.phase_mod = this.pm;
		this.OSC.set_frequency(this.freq);
	}

	process() {
		this.set_param();
		this.OSC.process();
		this.out = this.OSC.out;
		if (Math.sign(this.out) != Math.sign(this.prev_out)) {
			this.amp = rackrand();
		}
		this.prev_out = this.out;
		this.o['OUT'].set((this.out * this.scale * this.amp) + this.offset);
	}
}