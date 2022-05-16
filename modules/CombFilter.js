class CombFilter extends Module {
	constructor () {
		super({w:hp2px(4)});

		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:1, vmax:300, val:183, precision:0, name:'TIME'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:-1, vmax:1, val:-1, name:'TONE'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:-1, vmax:1, val:1, name:'FB'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:-3, vmax:3, val:0, name:'CV'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));

		this.time = this.i['TIME'].get();
		this.tone = this.i['TONE'].get();
    	this.fb = this.i['FB'].get();
		this.cv = this.i['IN'].get(); 
		this.in = 0;
		this.out = 0;
		this.SD = new BigSampleDelay(this.time);
	}

	process() {
		this.time = this.i['TIME'].get();
		this.tone = this.i['TONE'].get();
    	this.fb = this.i['FB'].get();
		this.cv = this.i['CV'].get(); 
		this.in = this.i['IN'].get();
		this.SD.delay = Math.floor(this.time / Math.pow(2, this.cv));
    	this.SD.in = (this.in * this.fb + this.SD.out * this.tone);
    	this.out = this.SD.out;
		this.o['OUT'].set(this.out / 100);

		this.SD.process();
	}
}

engine.add_module_class(CombFilter);