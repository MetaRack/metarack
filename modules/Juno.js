class Juno extends Module {
	constructor() {
		super({w:hp2x(10)});

		this.add_input(new InputEncoder({x:hp2x(3.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    	this.add_input(new InputEncoder({x:hp2x(3.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
   		this.add_input(new InputEncoder({x:hp2x(3.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    	this.add_input(new InputEncoder({x:hp2x(3.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
		this.add_input(new InputEncoder({x:hp2x(3.6), y:86, r:7, vmin:50, vmax:8000, val:1500, name:'COFF'}));
		//this.add_output(new InputEncoder({x:hp2x(3.6), y:106, r:7, vmin:0, vmax:2, val:0.5, name:'MOD'}));
		this.add_output(new Port({x:hp2x(3.8), y:108, r:6, name:'ENV'}));

    	this.add_input(new InputEncoder({x:hp2x(6.6), y:6, r:7, vmin:-10, vmax:10, val:0, name:'VWV'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:26, r:7, vmin:-10, vmax:10, val:0, name:'SVWV'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:46, r:7, vmin:0, vmax:1, val:0, name:'PWLV'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'VAM'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:86, r:7, vmin:0, vmax:1, val:0, name:'SVAM'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:106, r:7, vmin:0, vmax:1, val:1, name:'KYBD'}));

		this.add_input(new Port({x:hp2x(0.8), y:28, r:6, name:'GATE'}));
		//this.add_input(new Port({x:hp2x(0.8), y:8, r:6, name:'PTCH'}));
		this.add_input(new Port({x:hp2x(0.6), y:6, r:7, name:'PTCH'}));
    	this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));

		this.ADSR = new ADSRPrim();
		this.VCO = new VCOPrim(261.63);
		this.subVCO = new VCOPrim(130.815);
		this.LFO = new VCOPrim(1);
		this.freq = this.i['COFF'].get();
		this.Filter = new LadderFilter();
		this.Filter.setCutoffFreq(this.freq);

		this.out = 0;

		this.wave = this.i['VWV'].get();
		this.subwave = this.i['SVWV'].get();
		this.pw = this.i['PWLV'].get();
		this.vco_amp = this.i['VAM'].get();
		this.subvco_amp = this.i['SVAM'].get();
		//this.freq_mod = this.i['MOD'].get();
		this.kybd = this.i['KYBD'].get();

		this.A = this.i['A'].get();
		this.D = this.i['D'].get();
		this.S = this.i['S'].get();
		this.R = this.i['R'].get();
		this.ADSR.A = this.A;
		this.ADSR.D = this.D;
		this.ADSR.S = this.S;
		this.ADSR.R = this.R;
	}

	// draw_dbf (buf, x, y, w, h) {
  		
	// 	// * Math.pow(2, this.pitch * this.kybd + this.ADSR.out * this.freq_mod));
		
		
 //  	}

	process() {

		this.wave = this.i['VWV'].get();
		this.subwave = this.i['SVWV'].get();
		this.pw = this.i['PWLV'].get();
		this.vco_amp = this.i['VAM'].get();
		this.subvco_amp = this.i['SVAM'].get();
		this.freq = this.i['COFF'].get();
		//this.freq_mod = this.i['MOD'].get();
		this.kybd = this.i['KYBD'].get();
		this.A = this.i['A'].get();
		this.D = this.i['D'].get();
		this.S = this.i['S'].get();
		this.R = this.i['R'].get();
		this.ADSR.A = this.A;
		this.ADSR.D = this.D;
		this.ADSR.S = this.S;
		this.ADSR.R = this.R;

		this.ADSR.gate = this.i['GATE'].get();
		this.pitch = this.i['PTCH'].get();
		this.VCO.cv = this.pitch;
		this.subVCO.cv = this.pitch;
		this.VCO.wave = this.wave;
		this.subVCO.wave = this.subwave;

		this.Filter.setCutoffFreq(this.freq * Math.pow(2, this.pitch * this.kybd))// + this.ADSR.out / 3 * this.freq_mod));

		this.VCO.pw = 0.5 + this.LFO.out * this.pw;
		this.out = (this.VCO.out * this.vco_amp + this.subVCO.out * this.subvco_amp) / 2 * (this.ADSR.out/10);

		this.Filter.input = this.out;

		this.ADSR.process();
		this.VCO.process();
		this.subVCO.process();
		this.LFO.process();
		this.Filter.process();

		this.o['ENV'].set(this.ADSR.out);
		this.o['OUT'].set(this.Filter.lowpass());
	}
}

class NonlinearLab extends Module {
	constructor() {
		super({w:hp2x(25)});

		this.add_input(new Port({x:hp2x(0.8), y:8, r:6, default_value:0, name:'PTCH'}));
		this.add_input(new Port({x:hp2x(0.8), y:28, r:6, name:'GATE'}));
		this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));

		this.x1 = 4.1;

		this.add_input(new InputEncoder({x:hp2x(this.x1), y:6, r:7, vmin:-10, vmax:10, val:0, name:'OSC1'}));
		this.add_input(new InputEncoder({x:hp2x(this.x1), y:26, r:7, vmin:0, vmax:1, val:0, name:'FLC1'}));
		this.add_input(new InputEncoder({x:hp2x(this.x1), y:46, r:7, vmin:0, vmax:4, val:0, name:'FLD1'}));
		this.add_input(new InputEncoder({x:hp2x(this.x1), y:66, r:7, vmin:0, vmax:1, val:0, name:'PM1'}));
		this.add_input(new InputEncoder({x:hp2x(this.x1), y:86, r:7, vmin:0, vmax:1, val:1, name:'AMP1'}));
		this.add_output(new Port({x:hp2x(this.x1 + 0.2), y:108, r:6, name:'OSC1'}));

		this.x2 = this.x1 + 3.5;

		this.add_input(new InputEncoder({x:hp2x(this.x2), y:6, r:7, vmin:-10, vmax:10, val:0, name:'OSC2'}));
		this.add_input(new InputEncoder({x:hp2x(this.x2), y:26, r:7, vmin:0, vmax:1, val:0, name:'FLC2'}));
		this.add_input(new InputEncoder({x:hp2x(this.x2), y:46, r:7, vmin:0, vmax:4, val:0, name:'FLD2'}));
		this.add_input(new InputEncoder({x:hp2x(this.x2), y:66, r:7, vmin:0, vmax:1, val:0, name:'PM2'}));
		this.add_input(new InputEncoder({x:hp2x(this.x2), y:86, r:7, vmin:0, vmax:1, val:1, name:'AMP2'}));
		this.add_output(new Port({x:hp2x(this.x2 + 0.2), y:108, r:6, name:'OSC2'}));

		this.x3 = this.x2 + 3.5;

		this.add_input(new InputEncoder({x:hp2x(this.x3), y:6, r:7, vmin:-1, vmax:1, val:0, name:'POL'}));
		this.add_input(new InputEncoder({x:hp2x(this.x3), y:26, r:7, vmin:0, vmax:1, val:1, name:'IN1'}));
		this.add_input(new InputEncoder({x:hp2x(this.x3), y:46, r:7, vmin:0, vmax:1, val:1, name:'IN2'}));
		this.add_input(new InputEncoder({x:hp2x(this.x3), y:66, r:7, vmin:0, vmax:1, val:1, name:'D/W'}));
		this.add_input(new InputEncoder({x:hp2x(this.x3), y:86, r:7, vmin:0, vmax:1, val:1, name:'RAMP'}));
		this.add_output(new Port({x:hp2x(this.x3 + 0.2), y:108, r:6, name:'ROUT'}));

		this.x4 = this.x3 + 3.5;

		this.add_input(new InputEncoder({x:hp2x(this.x4), y:26, r:7, vmin:-10, vmax:10, val:0, name:'CFCV'}));
		this.add_input(new InputEncoder({x:hp2x(this.x4), y:46, r:7, vmin:-1, vmax:1, val:1, name:'TONE'}));
		this.add_input(new InputEncoder({x:hp2x(this.x4), y:66, r:7, vmin:0, vmax:1, val:1, name:'FB'}));
		this.add_input(new InputEncoder({x:hp2x(this.x4), y:86, r:7, vmin:0, vmax:1, val:0, name:'CAMP'}));
		this.add_output(new Port({x:hp2x(this.x4 + 0.2), y:108, r:6, name:'COUT'}));		


		this.x5 = this.x4 + 3.5;
		this.add_input(new Port({x:hp2x(0.8), y:8, r:6, name:'PTCH'}));
		
		this.add_input(new InputEncoder({x:hp2x(this.x5), y:6, r:7, vmin:0, vmax:10, val:1, name:'A1'}));
    	this.add_input(new InputEncoder({x:hp2x(this.x5), y:26, r:7, vmin:0, vmax:10, val:1, name:'D1'}));
   		this.add_input(new InputEncoder({x:hp2x(this.x5), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S1'}));
    	this.add_input(new InputEncoder({x:hp2x(this.x5), y:66, r:7, vmin:0, vmax:50, val:30, name:'R1'}));
    	this.add_input(new Port({x:hp2x(this.x5 + 0.2), y:88, r:6, default_value:1, name:'MOD1'}));
    	this.add_output(new Port({x:hp2x(this.x5 + 0.2), y:108, r:6, name:'OUT1'}));

    	this.x6 = this.x5 + 3.5;

    	this.add_input(new InputEncoder({x:hp2x(this.x6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A2'}));
    	this.add_input(new InputEncoder({x:hp2x(this.x6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D2'}));
   		this.add_input(new InputEncoder({x:hp2x(this.x6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S2'}));
    	this.add_input(new InputEncoder({x:hp2x(this.x6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R2'}));
    	this.add_input(new Port({x:hp2x(this.x6 + 0.2), y:88, r:6, default_value:1, name:'MOD2'}));
    	this.add_output(new Port({x:hp2x(this.x6 + 0.2), y:108, r:6, name:'OUT2'}));

  //   	this.x7 = this.x6 + 3.5;

  //   	this.add_input(new InputEncoder({x:hp2x(this.x7), y:6, r:7, vmin:0, vmax:10, val:1, name:'A3'}));
  //   	this.add_input(new InputEncoder({x:hp2x(this.x7), y:26, r:7, vmin:0, vmax:10, val:1, name:'D3'}));
  //  		this.add_input(new InputEncoder({x:hp2x(this.x7), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S3'}));
  //   	this.add_input(new InputEncoder({x:hp2x(this.x7), y:66, r:7, vmin:0, vmax:50, val:30, name:'R3'}));
  //   	this.add_output(new Port({x:hp2x(this.x7 + 0.2), y:108, r:6, name:'ENV3'}));
    	
    	
    	//this.add_output(new Port({x:hp2x(3.8), y:48, r:6, name:'LFO'}));

		//this.add_output(new InputEncoder({x:hp2x(3.6), y:106, r:7, vmin:0, vmax:2, val:0.5, name:'MOD'}));
		

		// this.add_input(new InputEncoder({x:hp2x(9.6), y:6, r:7, vmin:-10, vmax:10, val:0, name:'VWV'}));
  //   	this.add_input(new InputEncoder({x:hp2x(9.6), y:26, r:7, vmin:-10, vmax:10, val:0, name:'SVWV'}));
    	
    	this.ADSR1 = new ADSRPrim();
		this.ADSR2 = new ADSRPrim();
		this.OSC1 = new VCOPrim(261.63);
		this.OSC2 = new VCOPrim(261.63);
		this.Shaper1 = new SaturnPrim();
		this.Shaper2 = new SaturnPrim();
		this.Ring = new RingPrim();
		this.CF = new CombFilterPrim();

    	
    	this.pitch = this.i['PTCH'].get();

		this.fluct1 = this.i['FLC1'].get();
		this.osc1_cv = this.i['OSC1'].get() + (rackrand() - 0.5) * (this.fluct1 * 100) + this.pitch;
		this.OSC1.cv = this.osc1_cv + 0.00001;
		this.pm1 = this.i['PM1'].get();
		this.fold1 = this.i['FLD1'].get();
		this.amp1 = this.i['AMP1'].get();
		this.Shaper1.fold = this.fold1;
		//this.Shaper1.sat = (this.pm1 * 4) + 1;
		this.Shaper1.sat = 1;

    	this.fluct2 = this.i['FLC2'].get();
    	this.osc2_cv = this.i['OSC2'].get() + (rackrand() - 0.5) * (this.fluct2 * 100) + this.pitch;
    	this.OSC2.cv = this.osc2_cv + 0.00001;
    	this.pm2 = this.i['PM2'].get();
		this.fold2 = this.i['FLD2'].get();
		this.amp2 = this.i['AMP2'].get();
		this.Shaper2.fold = this.fold2;
		//this.Shaper2.sat = (this.pm2 * 4) + 1;
		this.Shaper2.sat = 1;

		this.ring_dw = this.i['D/W'].get();
		this.ring_pol = this.i['POL'].get();
		this.ring_amp1 = this.i['IN1'].get();
		this.ring_amp2 = this.i['IN2'].get();
		this.Ring.dw = this.ring_dw;
		this.Ring.pol = this.ring_pol;
		this.Ring.amp1 = this.ring_amp1;
		this.Ring.amp2 = this.ring_amp2;
		this.ring_amp = this.i['RAMP'].get();

		this.cf_tone = this.i['TONE'].get();
		this.cf_cv = this.i['CFCV'].get();
		this.cf_fb = this.i['FB'].get();
		this.cf_amp = this.i['CAMP'].get();
		this.CF.tone = this.cf_tone;
		this.CF.cv = this.cf_cv;
		this.CF.fb = this.cf_fb;
    	//this.lfo_freq = this.i['LFO'].get();
		//this.cf_cv1 = this.i['CF1'].get();
		//this.cf_cv2 = this.i['CF2'].get();
		// this.CF1.cv = this.pitch;
		// this.CF2.cv = this.pitch;

		this.A1 = this.i['A1'].get();
		this.D1 = this.i['D1'].get();
		this.S1 = this.i['S1'].get();
		this.R1 = this.i['R1'].get();
		this.ADSR1.A = this.A1;
		this.ADSR1.D = this.D1;
		this.ADSR1.S = this.S1;
		this.ADSR1.R = this.R1;

		this.A2 = this.i['A2'].get();
		this.D2 = this.i['D2'].get();
		this.S2 = this.i['S2'].get();
		this.R2 = this.i['R2'].get();
		this.ADSR2.A = this.A2;
		this.ADSR2.D = this.D2;
		this.ADSR2.S = this.S2;
		this.ADSR2.R = this.R2;

		// this.osc1_amp = this.i['AMP1'].get();
		// this.osc2_amp = this.i['AMP2'].get();
		// this.OSC1.amp = 1;
		// this.OSC2.amp = 1;

		// this.OSC1.cv = this.osc1_cv;
		// this.OSC2.cv = this.osc2_cv;
		// this.LFO.set_frequency(this.lfo_freq);
	}

	process() {
		this.pitch = this.i['PTCH'].get();

		this.fluct1 = this.i['FLC1'].get();
		this.osc1_cv = this.i['OSC1'].get() + (rackrand() - 0.5) * (this.fluct1 * 100) + this.pitch;
		this.OSC1.cv = this.osc1_cv + 0.00001;
		this.pm1 = this.i['PM1'].get();
		this.OSC1.phase_mod = this.pm1 * (2 * Math.PI);
		this.fold1 = this.i['FLD1'].get();
		this.amp1 = this.i['AMP1'].get();
		this.Shaper1.fold = this.fold1;
		this.Shaper1.sat = 1;

    	this.fluct2 = this.i['FLC2'].get();
    	this.osc2_cv = this.i['OSC2'].get() + (rackrand() - 0.5) * (this.fluct2 * 100) + this.pitch;
    	this.OSC2.cv = this.osc2_cv + 0.00001;
    	this.pm2 = this.i['PM2'].get();
    	this.OSC2.phase_mod = this.pm2 * (2 * Math.PI);
		this.fold2 = this.i['FLD2'].get();
		this.amp2 = this.i['AMP2'].get();
		this.Shaper2.fold = this.fold2;
		this.Shaper2.sat = 1;

		this.Shaper1.in = this.OSC1.out * this.amp1;
		this.Shaper2.in = this.OSC2.out * this.amp2;

		this.ring_dw = this.i['D/W'].get();
		this.ring_pol = this.i['POL'].get();
		this.ring_amp1 = this.i['IN1'].get();
		this.ring_amp2 = this.i['IN2'].get();
		this.Ring.dw = this.ring_dw;
		this.Ring.pol = this.ring_pol;
		this.Ring.amp1 = this.ring_amp1;
		this.Ring.amp2 = this.ring_amp2;
		this.ring_amp = this.i['RAMP'].get();

		this.cf_tone = this.i['TONE'].get();
		this.cf_cv = this.i['CFCV'].get();
		this.cf_fb = this.i['FB'].get();
		this.cf_amp = this.i['CAMP'].get();
		this.CF.tone = this.cf_tone;
		this.CF.cv = this.cf_cv + this.pitch;
		this.CF.fb = this.cf_fb;

		this.Ring.in1 = this.Shaper1.out;
		this.Ring.in2 = this.Shaper2.out;

		this.CF.in = this.Ring.out;

		// this.pitch = this.i['PTCH'].get();
		this.ADSR1.gate = this.i['GATE'].get();
		this.ADSR2.gate = this.i['GATE'].get();

		this.A1 = this.i['A1'].get();
		this.D1 = this.i['D1'].get();
		this.S1 = this.i['S1'].get();
		this.R1 = this.i['R1'].get();
		this.ADSR1.A = this.A1;
		this.ADSR1.D = this.D1;
		this.ADSR1.S = this.S1;
		this.ADSR1.R = this.R1;

		this.A2 = this.i['A2'].get();
		this.D2 = this.i['D2'].get();
		this.S2 = this.i['S2'].get();
		this.R2 = this.i['R2'].get();
		this.ADSR2.A = this.A2;
		this.ADSR2.D = this.D2;
		this.ADSR2.S = this.S2;
		this.ADSR2.R = this.R2;

		this.ADSR1.process();
		this.ADSR2.process();
		this.OSC1.process();
		this.OSC2.process();
		this.Shaper1.process();
		this.Shaper2.process();
		this.Ring.process();
		this.CF.process();

		this.out = (this.Ring.out * this.ring_amp + this.CF.out * this.cf_amp / 10) / 2;
		this.env1_out = this.ADSR1.out * this.i['MOD1'].get();
		this.env2_out = this.ADSR2.out * this.i['MOD2'].get();

		this.o['OUT'].set(this.out);
		this.o['OSC1'].set(this.Shaper1.out);
		this.o['OSC2'].set(this.Shaper2.out);
		this.o['ROUT'].set(this.Ring.out * this.ring_amp);
		this.o['COUT'].set(this.CF.out * this.cf_amp / 50);
		this.o['OUT1'].set(this.env1_out);
		this.o['OUT2'].set(this.env2_out);


		// this.out = (this.OSC1.out * this.osc1_amp + this.OSC2.out * this.osc2_amp + this.CF1.out * this.cf_cv1/20 + this.CF2.out * this.cf_cv2/20) / 4 * (this.ADSR.out/10);
		// this.o['OUT'].set(this.out);
	}
}

engine.add_module_class(Juno);