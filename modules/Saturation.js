class Saturn extends Module {
	constructor () {
		super({w:hp2px(4)});
		this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:10, val:1, name:'GAIN'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:10, val:10, name:'LVL'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));

		this.gain = this.i['GAIN'].get();
		this.level = this.i['LVL'].get();
		this.in = 0;
		this.out = 0;
	}

	sigmoid(x)
	{
	    if (Math.abs(x) < 10)
	        return x * (15 - 5 * x * x);
	    else {
	    	if (x > 0)
	    		return 10;
	    	else 
	    		return -10;
	    }
	}

	process() {
		this.gain = this.i['GAIN'].get();
		this.level = this.i['LVL'].get();
		this.in = this.i['IN'].get();

		this.in = this.in * this.gain;

		if (Math.abs(this.in) < this.level)
	        this.out = this.in;
	    else
	    {
	        // if (this.in > 0)
	        //     this.out = this.level + (1 - this.level) * sigmoid((this.in - this.level)/((1 - this.level) * 1.5));
	        // else
	        //     this.out = -(this.level + (1 - this.level) * sigmoid((-this.in - this.level) / ((1 - this.level) * 1.5)));
	        this.out = this.level * Math.sign(this.out);
	    }

	    this.o['OUT'].set(this.out);
	}
}