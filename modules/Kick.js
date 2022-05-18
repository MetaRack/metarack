class Kick extends Module {
	constructor () {
		super({w:hp2px(4)});
		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:10, val:5.06, name:'M'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:10, val:9.96, name:'N'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:0.9, val:0.5, name:'T'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:1000, vmax:3000, val:1200, name:'C'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));

		this.ADSR = new ADSRPrim (0.12, 5.06, 0.05, 2.30);
		this.ADSR2 = new ADSRPrim (0.14, 9.96, 0.1, 30);
		this.VCO = new VCOPrim (50);
		this.VCA = new VCAPrim (10);
		this.LP = new LadderFilter();
		this.LP.setResonance(0);
		this.LP.setCutoffFreq(this.C);
		this.set_param();
	}

	set_param() {
		this.M = this.i['M'].get();
		this.N = this.i['N'].get();
		this.T = this.i['T'].get();
		this.C = this.i['C'].get();
		this.ADSR.set_param(0.12, this.M, 0.05, 2.30);
		this.ADSR2.set_param(0.14, this.N, 0.1, 30);
		this.LP.setCutoffFreq(this.C);
	}

	// draw_dbf (buf, x, y, w, h) {
	// 	 if (this.i['M'].changed) {
	// 	 	this.M = this.i['M'].get();
	// 	 	this.ADSR.set_param(0.12, this.M, 0.05, 2.30);
	// 	 }
	// 	 if (this.i['N'].changed) {
	// 	 	this.N = this.i['N'].get();
	// 	 	this.ADSR2.set_param(0.14, this.N, 0.1, 30);
	// 	 }
	// 	 if (this.i['T'].changed) {
	// 	 	this.T = this.i['T'].get();
	// 	 }
	// 	 if (this.i['C'].changed) {
	// 	 	this.C = this.i['C'].get();
	// 	 	this.LP.setCutoffFreq(this.C);
	// 	 }
	// }

	process () {
		this.set_param();
		this.VCO.cv = this.ADSR.out/10;
		this.VCA.in = this.VCO.out;
		this.VCA.cv = this.ADSR2.out;
		this.LP.input = this.VCA.out;

		this.ADSR.gate = this.i['GATE'].get();
		this.ADSR2.gate = this.i['GATE'].get();

		this.LP.setCutoffFreq(this.C * Math.pow(2, this.ADSR.out * this.T));

		this.ADSR.process();
		this.VCA.process();
		this.VCO.process();
		this.ADSR2.process();
		this.LP.process();

		this.o['OUT'].set(this.LP.lowpass());
		//this.o['OUT'].set(this.VCO.out);
	}
}


class Snare extends Module {
	constructor () {
		super({w:hp2px(4)});
		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:0.1, vmax:2, val:1, name:'M'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:1, val:0.5, name:'N'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:-0.5, vmax:0.5, val:0, name:'T'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:500, vmax:3000, val:700, name:'C'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));

		this.M = this.i['M'].get();
		this.N = this.i['N'].get();
		this.T = this.i['T'].get();
		this.C = this.i['C'].get();

		// this.ADSR = new ADSRPrim (this.A / 10, 1 + this.D / 5, 0, 0);
		// this.ADSR2 = new ADSRPrim (this.A / 10, 1 + this.D / 5, 0, 0);
		this.VCO1 = new VCOPrim(200);
		this.VCO2 = new VCOPrim(600);
		this.VCO3 = new VCOPrim(450);
		this.VCO4 = new VCOPrim(900);
		this.ADSR1 = new ADSRPrim (0.02, 1.16, 0, 2.60);
		this.ADSR2 = new ADSRPrim (0.52, 2.04, 0, 0.40);
		this.NOIS = new NoisePrim();
		this.VCA1 = new VCAPrim();
		this.VCA2 = new VCAPrim();
		this.FLTR = new LadderFilter();
		this.FLTR2 = new LadderFilter();

		this.VCO1.cv = this.T;
		this.VCO2.cv = this.T;
		this.VCO3.cv = this.T;
		this.VCO4.cv = this.T;

		this.FLTR.setResonance(0);
		this.FLTR2.setResonance(0);
		this.FLTR.setCutoffFreq(this.C - (200 * this.M));
		this.FLTR2.setCutoffFreq(this.C + (200 * this.M));

		this.VCO2.amp = 0.4;
		this.VCO3.amp = 0.62;
		this.VCO4.amp = 0.25;

		this.set_param();
	}

	set_param() {
		this.M = this.i['M'].get();
		this.N = this.i['N'].get();
		this.T = this.i['T'].get();
		this.C = this.i['C'].get();
	}

	// draw_dbf (buf, x, y, w, h) {
	// 	 if (this.i['M'].changed) {
	// 	 	this.M = this.i['M'].get();
	// 	 }
	// 	 if (this.i['N'].changed) {
	// 	 	this.N = this.i['N'].get();
	// 	 }
	// 	 if (this.i['T'].changed) {
	// 	 	this.T = this.i['T'].get();
	// 	 }
	// 	 if (this.i['C'].changed) {
	// 	 	this.C = this.i['C'].get();
	// 	 }
	// }

	process () {
		this.set_param();
		this.VCA1.in = (this.VCO1.out + this.VCO2.out + this.VCO3.out + this.VCO4.out)/4;
		this.VCA1.cv = this.ADSR1.out;
		this.VCA2.in = this.NOIS.out / 5 * this.N;
		this.VCA2.cv = this.ADSR2.out;

		this.FLTR.input = (this.VCA1.out + this.VCA2.out) / 1;
		this.FLTR2.input = (this.VCA1.out + this.VCA2.out) / 1;

		this.ADSR1.gate = this.i['GATE'].get();
		this.ADSR2.gate = this.i['GATE'].get();

		this.FLTR.setCutoffFreq(this.C - (200 * this.M));
		this.FLTR2.setCutoffFreq(this.C + (200 * this.M));

		this.VCO1.process();
		this.VCO2.process();
		this.VCO3.process();
		this.VCO4.process();
		this.ADSR1.process();
		this.ADSR2.process();
		this.NOIS.process();
		this.VCA1.process();
		this.VCA2.process();
		this.FLTR.process();
		this.FLTR2.process();

		this.VCO1.cv = this.T;
		this.VCO2.cv = this.T;
		this.VCO3.cv = this.T;
		this.VCO4.cv = this.T;

		this.o['OUT'].set((this.FLTR.lowpass() + this.FLTR2.highpass()) / 1);
		//this.o['OUT'].set(this.VCO.out);
	}
}

engine.add_module_class(Kick);
engine.add_module_class(Snare);