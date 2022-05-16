class Hat extends Module {
	constructor () {
		super({w:hp2px(4)});
		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:10, val:5, name:'A'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:10, val:5, name:'D'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:9, val:4.5, name:'T'}));
	    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:9, val:4.5, name:'C'}));
		this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
		this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));

		this.A = this.i['A'].get();
		this.D = this.i['D'].get();
		this.T = this.i['T'].get();
		this.C = this.i['C'].get();

		this.ADSR = new ADSRPrim (this.A / 10, 1 + this.D / 5, 0.02, 30);
		this.ADSR2 = new ADSRPrim (this.A / 10, 1 + this.D / 5, 0.01, 30);
		this.Noise = new NoisePrim ();
		this.VCA = new VCAPrim (0);
		this.VCA2 = new VCAPrim (0);

		this.HP1 = new LadderFilter();
		this.HP2 = new OnePoleHPFilter();
		this.HP3 = new LadderFilter();

		this.HP1.setCutoffFreq(3500 * (this.T + 1) / 5);
		this.HP2.setCutoffFreq(3500 * (this.T + 1) / 5);
		this.HP3.setCutoffFreq(3500 * (this.M + 1) / 5);

		this.HP1.setResonance((1.5 + 10) / 20);
		this.HP3.setResonance((1.5 + 10) / 20);
	}

	process () {
		this.A = this.i['A'].get();
		this.ADSR.set_param(this.A / 10, 1 + this.D / 5, 0.03 * (this.D / 10), 30);
		this.ADSR2.set_param(this.A / 10, 1 + this.D / 5, 0.015 * (this.D / 10), 30);

		this.D = this.i['D'].get();
		this.ADSR.set_param(this.A / 10, 1 + this.D / 5, 0.03  * (this.D / 10), 30);
		this.ADSR2.set_param(this.A / 10, 1 + this.D / 5, 0.015 * (this.D / 10), 30);

		this.T = this.i['T'].get();
		this.HP1.setCutoffFreq(3500 * (this.T + 1) / 5);
		this.HP2.setCutoffFreq(3500 * (this.T + 1) / 5);

		this.C = this.i['C'].get();
		this.HP3.setCutoffFreq(3500 * (this.C + 1) / 5);

		this.HP2.input = this.Noise.out;
		this.VCA.in = this.HP2.output / 10;
		this.VCA.cv = this.ADSR.out;
		this.HP1.input = this.VCA.out;

		this.HP3.input = this.Noise.out;
		this.VCA2.in = this.HP3.highpass() / 10;
		this.VCA2.cv = this.ADSR2.out;

		this.ADSR.gate = this.i['GATE'].get();
		this.ADSR2.gate = this.i['GATE'].get();

		this.ADSR.process();
		this.VCA.process();
		this.Noise.process();
		this.VCA2.process();
		this.ADSR2.process();
		this.HP1.process();
		this.HP2.process();
		this.HP3.process();

		this.o['OUT'].set((this.HP1.highpass() + this.VCA2.out * 1.5) * 8);
	}
}

engine.add_module_class(Hat);