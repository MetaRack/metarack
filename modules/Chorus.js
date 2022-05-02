class Chorus extends Module {
	constructor() {
		super({w:hp2px(4)});
		this.add_control(new Encoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:1, val:1, name:'LVL'}));
   		this.add_control(new Encoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:5, val:0.2, name:'RATE'}));
		this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'IN'}));
		this.add_output(new Port({x:hp2px(0.8), y:88, r:6, name:'OUTL'}));
    	this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUTR'}));

    	this.level = this.c['LVL'].get();
    	this.rate = this.c['RATE'].get();
    	this.LFO = new VCOPrim(this.rate);
    	this.DelayL = new DelayPrim();
    	this.DelayR = new DelayPrim();
    	this.base_time = 0.003;
    	this.DelayL.time = this.base_time;
    	this.DelayR.time = this.base_time;
    	this.in = 0;
    	this.outl = 0;
    	this.outr = 0;
	}

	draw_dbf (buf, x, y, w, h) {
		this.level = this.c['LVL'].get();
    	this.rate = this.c['RATE'].get();
    	this.LFO.set_frequency(this.rate);
	}

	process() {
		this.in = this.i['IN'].get();

		this.DelayL.time = this.base_time * Math.pow(2, Math.abs(this.LFO.out) / 20 * this.level);
		this.DelayR.time = this.base_time / Math.pow(2, Math.abs(this.LFO.out) / 20 * this.level);
		this.DelayL.in = this.in;
		this.DelayR.in = this.in;

		this.DelayL.process();
		this.DelayR.process();

		this.outl = this.DelayL.out;
		this.outr = this.DelayR.out;
		this.o['OUTL'].set(this.outl);
		this.o['OUTR'].set(this.outr);
	}
}