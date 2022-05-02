class Kick extends Module {
	constructor () {
		super({w:hp2px(4)});
		this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:1, val:0, name:'A'}));
	    this.add_control(new Encoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:10, val:10, name:'D'}));
	    this.add_control(new Encoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:9, val:4.5, name:'T'}));
	    this.add_control(new Encoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:9, val:4.5, name:'C'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));

		this.A = this.c['A'].get();
		this.D = this.c['D'].get();
		this.T = this.c['T'].get();
		this.C = this.c['C'].get();

		this.ADSR = new ADSRPrim (this.A / 10, 1 + this.D / 5, 0, 0);
		this.ADSR2 = new ADSRPrim (this.A / 10, 1 + this.D / 5, 0, 0);
		this.VCO = new VCOPrim (50 * (this.T + 1) / 5);
		//this.VCO = new VCOPrim (120);
		this.VCA = new VCAPrim (0);
		this.LP = new OnePoleLPFilter();
		this.LP.setCutoffFreq(6000 * (this.C + 1) / 5);

	}

	draw_dbf (buf, x, y, w, h) {
		 if (this.c['A'].changed) {
		 	this.A = this.c['A'].get();
		 	this.ADSR.set_param(this.A / 10, 1 + this.D / 5, 0, 0);
		 	this.ADSR2.set_param(this.A / 10, 1 + this.D / 5, 0, 0);
		 }
		 if (this.c['D'].changed) {
		 	this.D = this.c['D'].get();
		 	this.ADSR.set_param(this.A / 10, 1 + this.D / 5, 0, 0);
		 	this.ADSR2.set_param(this.A / 10, 1 + this.D / 5, 0, 0);
		 }
		 if (this.c['T'].changed) {
		 	this.T = this.c['T'].get();
		 	this.VCO = new VCOPrim (50 * (this.T + 1) / 5); 
		 }
		 if (this.c['C'].changed) {
		 	this.C = this.c['C'].get();
		 	this.LP.setCutoffFreq(2000 * (this.C + 1) / 5);
		 }
	}

	process () {
		this.VCO.cv = this.ADSR.out/10;
		this.VCA.in = this.VCO.out;
		this.VCA.cv = this.ADSR2.out;
		this.LP.input = this.VCA.out;

		this.ADSR.gate = this.i['GATE'].get();
		this.ADSR2.gate = this.i['GATE'].get();

		this.ADSR.process();
		this.VCA.process();
		this.VCO.process();
		this.ADSR2.process();
		this.LP.process();

		this.o['OUT'].set(this.LP.output * 8);
		//this.o['OUT'].set(this.VCO.out);
	}
}