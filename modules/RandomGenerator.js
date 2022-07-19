class RandomGenerator extends Module {
	constructor() {
		super({w:hp2x(10)});
		this.offset = 0;
		this.scale = 0;
		this.pm = 0;
		this.add_output(new Port({x:hp2x(7.7), y:hp2y(0.89), r:hp2x(0.8), default_value:0, name:'OUT'}));
		this.add_control(new Encoder({x:hp2x(1), y:46, r:7, vmin:0.01, vmax:10, val:1, name:'FREQ'}));
		this.add_input(new InputEncoder({x:hp2x(4), y:46, r:7, vmin:-5, vmax:5, val:0, name:'CV'}));
		this.add_input(new InputEncoder({x:hp2x(7), y:46, r:7, vmin:-5, vmax:5, val:0, name:'OFST'}));
		this.add_input(new InputEncoder({x:hp2x(2), y:66, r:7, vmin:0.01, vmax:5, val:1, name:'SCL'}));
		this.add_input(new InputEncoder({x:hp2x(5), y:66, r:7, vmin:0, vmax:1, val:0, name:'PM'}));

		this.OSC = new VCOPrim();
		this.prev_out = -1;
		this.out = 0;

		this.scope = new RawScope({x: this.w * 0.05, y:this.h * 0.05, w:this.w - this.w * 0.1, h:this.h*0.25, size:30, divider:64});
		this.attach(this.scope);
		this.delta = Math.PI * 2 / (sample_rate / 2);
		this.phase_inc = this.delta;
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

		this.scope.divider = Math.PI / this.phase_inc / this.scope.size * 4;
		this.phase += this.phase_inc;
    this.scope.process(this.out * this.scale * this.amp )
    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
      this.scope.trig();
    }

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

engine.add_module_class(RandomGenerator);