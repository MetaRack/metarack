class Saturn extends Module {
	constructor () {
		super({w:hp2px(4)});
		this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:1, val:0, name:'SAT'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:4, val:0, name:'FOLD'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));

		this.fold_coeff = 1;
		this.sat = (this.i['SAT'].get() * 4) + 1; 
		this.in = 0;
		this.out = 0;
		this.LP = new LadderFilter();
		this.LP.setResonance(0);
		this.LP.setCutoffFreq(1500);
	}

	sigmoid(x) {
	    if (Math.abs(x) < 1)
	    	return x * (1.5 - 0.5 * x * x);
	    else 
	    	return 1 * Math.sign(x);
	}

	saturate(x, t) {
		if (Math.abs(x)<t)
	        return x;
	    else
	    {
	        if (x > 0)
	            return t + (1-t)*this.sigmoid((x-t)/((1-t)*1.5));
	        else
	            return -(t + (1-t)*this.sigmoid((-x-t)/((1-t)*1.5)));
    	}
	}

	process() {
		this.sat = (this.i['SAT'].get() * 4) + 1;

		this.in = this.i['IN'].get();
		//this.in = this.in * this.sat;

		this.out = this.in * (this.i['FOLD'].get() + 1);

		while (this.out > 1) {
			this.out = (this.out - 1) * -1;
			this.out += 1;
			while (this.out < 0) this.out *= -1;
		}
		while (this.out < -1) {
			this.out = (this.out + 1) * -1;
			this.out -= 1;
			while (this.out > 0) this.out *= -1;
		}

		this.out = this.out * this.sat;
		this.out = this.saturate(this.out, 0);
		this.LP.input = this.out;
		this.LP.process();

		this.out = this.LP.lowpass();	  
		this.o['OUT'].set(this.out);
	}
}

engine.add_module_class(Saturn);