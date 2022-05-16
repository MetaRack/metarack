class Chorus extends Module {
	constructor() {
		super({w:hp2px(4)});
		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:1, vmax:4, val:2, name:'TIME'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:4, val:1, name:'LVL'}));
   		this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:5, val:0.2, name:'RATE'}));
		this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'IN'}));
		this.add_output(new Port({x:hp2px(0.8), y:88, r:6, name:'OUTL'}));
    	this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUTR'}));

    	this.base_time = this.i['TIME'].get() / 100;
    	this.level = this.i['LVL'].get();
    	this.rate = this.i['RATE'].get();
    	this.LFO = new VCOPrim(this.rate);
    	this.DelayL = new DelayPrim();
    	this.DelayR = new DelayPrim();
    	this.DelayL.time = this.base_time;
    	this.DelayR.time = this.base_time;
    	this.DelayR.fb = 0.66;
    	this.DelayR.dw = 0.5;
    	this.DelayL.fb = 0.66;
    	this.DelayL.dw = 0.5;
    	this.in = 0;
    	this.outl = 0;
    	this.outr = 0;
	}

	// draw_dbf (buf, x, y, w, h) {
	// 	this.level = this.i['LVL'].get();
 //    	this.rate = this.i['RATE'].get();
 //    	this.LFO.set_frequency(this.rate);
	// }

	process() {
		this.base_time = this.i['TIME'].get() / 100;
		this.level = this.i['LVL'].get();
    	this.rate = this.i['RATE'].get();
    	this.LFO.set_frequency(this.rate);
		this.in = this.i['IN'].get();

		this.DelayL.time = this.base_time * Math.pow(2, Math.abs(this.LFO.out) / 10 * this.level);
		this.DelayR.time = this.base_time * Math.pow(2, -1*Math.abs(this.LFO.out) / 10 * this.level);
		this.DelayL.in = this.in;
		this.DelayR.in = this.in;

		this.LFO.process();
		this.DelayL.process();
		this.DelayR.process();

		this.outl = this.DelayL.out;
		this.outr = this.DelayR.out;
		this.o['OUTL'].set(this.outl);
		this.o['OUTR'].set(this.outr);
	}
}

engine.add_module_class(Chorus);