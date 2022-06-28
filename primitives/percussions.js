class KickPrim {
	constructor () {
		// super({w:hp2x(4)});
		// this.add_input(new InputEncoder({x:hp2x(0.6), y:6, r:7, vmin:0, vmax:10, val:5.06, name:'A'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, vmin:0, vmax:10, val:9.96, name:'D'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, vmin:0, vmax:0.9, val:0.5, name:'T'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, vmin:1000, vmax:3000, val:1200, name:'C'}));
		// this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
		// this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'GATE'}));
		this.A = 0;
		this.D = 0;
		this.T = 0;
		this.C = 0;
		this.out = 0;
		this.gate = 0;

		this.ADSR = new ADSRPrim (0.12, 5.06, 0.05, 2.30);
		this.ADSR2 = new ADSRPrim (0.14, 9.96, 0.1, 30);
		this.VCO = new VCOPrim (50);
		this.VCA = new VCAPrim (10);
		this.LP = new ExponentialFilterPrim();
		this.set_param();
	}

	set_param() {
		this.T = this.T / 10 * 0.9;
		this.C = this.C * 200 + 1000;
		this.LP.freq = this.C;
	}
	process () {
		if (this.A < 0) this.A = 0;
		if (this.A > 10) this.A = 10;

		if (this.D < 0) this.D = 0;
		if (this.D > 10) this.D = 10;

		if (this.T < 0) this.T = 0;
		if (this.T > 10) this.T = 10;

		if (this.C < 0) this.C = 0;
		if (this.C > 10) this.C = 10;

		this.set_param();
		this.VCO.cv = this.ADSR.out / 10;
		this.VCA.in = this.VCO.out;
		this.VCA.cv = this.ADSR2.out;
		this.LP.in = this.VCA.out;

		this.ADSR.gate = this.gate;
		this.ADSR2.gate = this.gate;

		this.LP.freq = this.C * Math.pow(2, this.ADSR.out * this.T);

		this.ADSR.process();
		this.VCA.process();
		this.VCO.process();
		this.ADSR2.process();
		this.LP.process();

		this.out = this.LP.lp;
	}
}


class SnarePrim {
	constructor () {
		// super({w:hp2x(4)});
		// this.add_input(new InputEncoder({x:hp2x(0.6), y:6, r:7, vmin:0.1, vmax:2, val:1, name:'A'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, vmin:0, vmax:1, val:0.5, name:'D'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, vmin:-0.5, vmax:0.5, val:0, name:'T'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, vmin:500, vmax:3000, val:700, name:'C'}));
		// this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
		// this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'GATE'}));

		this.A = 0;
		this.D = 0;
		this.T = 0;
		this.C = 0;
		this.out = 0;
		this.gate = 0;

		this.VCO1 = new VCOPrim(200);
		this.VCO2 = new VCOPrim(600);
		this.VCO3 = new VCOPrim(450);
		this.VCO4 = new VCOPrim(900);
		this.ADSR1 = new ADSRPrim (0.02, 1.16, 0, 2.60);
		this.ADSR2 = new ADSRPrim (0.52, 2.04, 0, 0.40);
		this.DOIS = new NoisePrim();
		this.VCA1 = new VCAPrim();
		this.VCA2 = new VCAPrim();
		this.FLTR = new ExponentialFilterPrim();
		this.FLTR2 = new ExponentialFilterPrim();

		

		this.VCO2.amp = 0.4;
		this.VCO3.amp = 0.62;
		this.VCO4.amp = 0.25;

		this.set_param();
	}

	set_param() {
		this.A = this.A / 10 * 1.9 + 0.1;
		this.D = this.D / 10;
		this.T = this.T / 10 - 0.5;
		this.C = this.C * 250 + 500;

		this.VCO1.cv = this.T;
		this.VCO2.cv = this.T;
		this.VCO3.cv = this.T;
		this.VCO4.cv = this.T;

		this.FLTR.freq = this.C - (200 * this.A);
		this.FLTR2.freq = this.C + (200 * this.A);
	}

	process () {
		if (this.A < 0) this.A = 0;
		if (this.A > 10) this.A = 10;

		if (this.D < 0) this.D = 0;
		if (this.D > 10) this.D = 10;

		if (this.T < 0) this.T = 0;
		if (this.T > 10) this.T = 10;

		if (this.C < 0) this.C = 0;
		if (this.C > 10) this.C = 10;

		this.set_param();
		this.VCA1.in = (this.VCO1.out + this.VCO2.out + this.VCO3.out + this.VCO4.out)/4;
		this.VCA1.cv = this.ADSR1.out;
		this.VCA2.in = this.DOIS.out / 5 * this.D;
		this.VCA2.cv = this.ADSR2.out;

		this.FLTR.in = (this.VCA1.out + this.VCA2.out) / 1;
		this.FLTR2.in = (this.VCA1.out + this.VCA2.out) / 1;

		this.ADSR1.gate = this.gate;
		this.ADSR2.gate = this.gate;

		this.FLTR.freq = this.C - (200 * this.A);
		this.FLTR2.freq = this.C + (200 * this.A);

		this.VCO1.process();
		this.VCO2.process();
		this.VCO3.process();
		this.VCO4.process();
		this.ADSR1.process();
		this.ADSR2.process();
		this.DOIS.process();
		this.VCA1.process();
		this.VCA2.process();
		this.FLTR.process();
		this.FLTR2.process();

		this.out = (this.FLTR.lp + this.FLTR2.hp) / 1;
	}
}

class HatPrim {
	constructor () {
		// super({w:hp2x(4)});
		// this.add_input(new InputEncoder({x:hp2x(0.6), y:6, r:7, vmin:0, vmax:10, val:5, name:'A'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, vmin:0, vmax:10, val:5, name:'D'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, vmin:0, vmax:9, val:4.5, name:'T'}));
	 //    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, vmin:0, vmax:9, val:4.5, name:'C'}));
		// this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
		// this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'GATE'}));

		this.A = 0;
		this.D = 0;
		this.T = 0;
		this.C = 0;
		this.out = 0;
		this.gate = 0;

		this.ADSR = new ADSRPrim (0.1, 1, 0.02, 30);
		this.ADSR2 = new ADSRPrim (0.1, 1, 0.01, 30);

		this.Noise = new NoisePrim ();
		this.VCA = new VCAPrim (0);
		this.VCA2 = new VCAPrim (0);

		this.HP1 = new LadderFilter();
		this.HP2 = new OnePoleHPFilter();
		this.HP3 = new LadderFilter();

		this.HP1.setResonance((1.5 + 10) / 20);
		this.HP3.setResonance((1.5 + 10) / 20);

		this.set_param();
	}

	set_param() {
		this.T = this.T * 0.9;
		this.C = this.C * 0.9;

		this.ADSR.A = this.A / 10;
		this.ADSR.D = 1 + this.D / 5;

		this.ADSR2.A = this.A / 10;
		this.ADSR2.D = 1 + this.D / 5;
		

		this.HP1.setCutoffFreq(3500 * (this.T + 1) / 5);
		this.HP2.setCutoffFreq(3500 * (this.T + 1) / 5);
		this.HP3.setCutoffFreq(3500 * (this.C + 1) / 5);
	}

	process () {
		if (this.A < 0) this.A = 0;
		if (this.A > 10) this.A = 10;

		if (this.D < 0) this.D = 0;
		if (this.D > 10) this.D = 10;

		if (this.T < 0) this.T = 0;
		if (this.T > 10) this.T = 10;

		if (this.C < 0) this.C = 0;
		if (this.C > 10) this.C = 10;

		this.set_param();

		this.HP2.input = this.Noise.out;
		this.VCA.in = this.HP2.output / 10;
		this.VCA.cv = this.ADSR.out;
		this.HP1.input = this.VCA.out;

		this.HP3.input = this.Noise.out;
		this.VCA2.in = this.HP3.highpass() / 10;
		this.VCA2.cv = this.ADSR2.out;

		this.ADSR.gate = this.gate;
		this.ADSR2.gate = this.gate;

		this.ADSR.process();
		this.VCA.process();
		this.Noise.process();
		this.VCA2.process();
		this.ADSR2.process();
		this.HP1.process();
		this.HP2.process();
		this.HP3.process();

		this.out = (this.HP1.highpass() + this.VCA2.out * 1.5) * 8;
	}
}