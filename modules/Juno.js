class Juno extends Module {
	constructor() {
		super({w:hp2px(10)});

		this.add_input(new InputEncoder({x:hp2px(3.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    	this.add_input(new InputEncoder({x:hp2px(3.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
   		this.add_input(new InputEncoder({x:hp2px(3.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    	this.add_input(new InputEncoder({x:hp2px(3.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
		this.add_input(new InputEncoder({x:hp2px(3.6), y:86, r:7, vmin:50, vmax:8000, val:1500, name:'COFF'}));
		//this.add_output(new InputEncoder({x:hp2px(3.6), y:106, r:7, vmin:0, vmax:2, val:0.5, name:'MOD'}));
		this.add_output(new Port({x:hp2px(3.8), y:108, r:6, name:'ENV'}));

    	this.add_input(new InputEncoder({x:hp2px(6.6), y:6, r:7, vmin:-10, vmax:10, val:0, name:'VWV'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:26, r:7, vmin:-10, vmax:10, val:0, name:'SVWV'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:46, r:7, vmin:0, vmax:1, val:0, name:'PWLV'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'VAM'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:86, r:7, vmin:0, vmax:1, val:0, name:'SVAM'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:106, r:7, vmin:0, vmax:1, val:1, name:'KYBD'}));

		this.add_input(new Port({x:hp2px(0.8), y:28, r:6, name:'GATE'}));
		//this.add_input(new Port({x:hp2px(0.8), y:8, r:6, name:'PTCH'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, mod:10, val:0, name:'PTCH'}));
    	this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));

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
		super({w:hp2px(12.5)});

		this.add_input(new Port({x:hp2px(0.8), y:28, r:6, name:'GATE'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:-10, vmax:10, val:0, name:'OSC1'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, vmin:-10, vmax:10, val:0, name:'OSC2'}));
		this.add_input(new InputEncoder({x:hp2px(0.6), y:86, r:7, vmin:0.01, vmax:10, val:1, name:'LFO'}));
		//this.add_input(new Port({x:hp2px(0.8), y:8, r:6, name:'PTCH'}));
		this.add_input(new Port({x:hp2px(0.8), y:8, r:6, name:'PTCH'}));
    	this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));

    	this.add_output(new Port({x:hp2px(3.8), y:8, r:6, name:'OSC1'}));
    	this.add_output(new Port({x:hp2px(3.8), y:28, r:6, name:'OSC2'}));
    	this.add_output(new Port({x:hp2px(3.8), y:48, r:6, name:'LFO'}));
    	this.add_input(new InputEncoder({x:hp2px(3.6), y:66, r:7, vmin:0, vmax:1, val:0, name:'FLC1'}));
    	this.add_input(new InputEncoder({x:hp2px(3.6), y:86, r:7, vmin:0, vmax:1, val:0, name:'FLC2'}));
    	this.add_output(new Port({x:hp2px(3.8), y:108, r:6, name:'ENV'}));

    	this.add_input(new InputEncoder({x:hp2px(6.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
   		this.add_input(new InputEncoder({x:hp2px(6.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    	this.add_input(new InputEncoder({x:hp2px(6.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
		this.add_input(new InputEncoder({x:hp2px(6.6), y:86, r:7, vmin:0, vmax:10, val:0, name:'CF1'}));
		this.add_input(new InputEncoder({x:hp2px(6.6), y:106, r:7, vmin:0, vmax:10, val:0, name:'CF2'}));
		//this.add_output(new InputEncoder({x:hp2px(3.6), y:106, r:7, vmin:0, vmax:2, val:0.5, name:'MOD'}));
		

		this.add_input(new InputEncoder({x:hp2px(9.6), y:6, r:7, vmin:-10, vmax:10, val:0, name:'VWV'}));
    	this.add_input(new InputEncoder({x:hp2px(9.6), y:26, r:7, vmin:-10, vmax:10, val:0, name:'SVWV'}));
    	this.add_input(new InputEncoder({x:hp2px(9.6), y:46, r:7, vmin:0, vmax:1, val:0.5, name:'PW1'}));
    	this.add_input(new InputEncoder({x:hp2px(9.6), y:66, r:7, vmin:0, vmax:1, val:0.5, name:'PW2'}));
    	this.add_input(new InputEncoder({x:hp2px(9.6), y:86, r:7, vmin:0, vmax:1, val:1, name:'AMP1'}));
    	this.add_input(new InputEncoder({x:hp2px(9.6), y:106, r:7, vmin:0, vmax:1, val:1, name:'AMP2'}));
    	
    	this.pitch = this.i['PTCH'].get();

		this.fluct1 = this.i['FLC1'].get();
    	this.fluct2 = this.i['FLC2'].get();
    	this.osc1_cv = this.i['OSC1'].get() + (rackrand() - 0.5) * (this.fluct1 * 100);
    	this.osc2_cv = this.i['OSC2'].get() + (rackrand() - 0.5) * (this.fluct2 * 100);
    	this.lfo_freq = this.i['LFO'].get();

		this.ADSR = new ADSRPrim();
		this.OSC1 = new VCOPrim(261.63);
		this.OSC2 = new VCOPrim(261.63);
		this.LFO = new VCOPrim(1);

		this.CF1 = new CombFilterPrim();
		this.CF2 = new CombFilterPrim();
		this.cf_cv1 = this.i['CF1'].get();
		this.cf_cv2 = this.i['CF2'].get();
		this.CF1.cv = this.pitch;
		this.CF2.cv = this.pitch;

		this.LFO.cv = 0.0001;

		this.A = this.i['A'].get();
		this.D = this.i['D'].get();
		this.S = this.i['S'].get();
		this.R = this.i['R'].get();
		this.ADSR.A = this.A;
		this.ADSR.D = this.D;
		this.ADSR.S = this.S;
		this.ADSR.R = this.R;

		this.osc1_amp = this.i['AMP1'].get();
		this.osc2_amp = this.i['AMP2'].get();
		this.OSC1.amp = 1;
		this.OSC2.amp = 1;

		this.OSC1.cv = this.osc1_cv;
		this.OSC2.cv = this.osc2_cv;
		this.LFO.set_frequency(this.lfo_freq);
	}

	process() {
		this.wave1 = this.i['VWV'].get();
		this.wave2 = this.i['SVWV'].get();
		this.OSC1.wave = this.wave1;
		this.OSC2.wave = this.wave2;


		this.pitch = this.i['PTCH'].get();
		this.ADSR.gate = this.i['GATE'].get();

		this.A = this.i['A'].get();
		this.D = this.i['D'].get();
		this.S = this.i['S'].get();
		this.R = this.i['R'].get();
		this.ADSR.A = this.A;
		this.ADSR.D = this.D;
		this.ADSR.S = this.S;
		this.ADSR.R = this.R;

		this.osc1_amp = this.i['AMP1'].get();
		this.osc2_amp = this.i['AMP2'].get();

		this.cf_cv1 = this.i['CF1'].get();
		this.cf_cv2 = this.i['CF2'].get();
		this.CF1.cv = this.pitch;
		this.CF2.cv = this.pitch;

		this.fluct1 = this.i['FLC1'].get();
    	this.fluct2 = this.i['FLC2'].get();

		this.osc1_cv = this.i['OSC1'].get() + (rackrand() - 0.5) * (this.fluct1 * 100) + this.pitch;
    	this.osc2_cv = this.i['OSC2'].get() + (rackrand() - 0.5) * (this.fluct2 * 100) + this.pitch;
    	this.lfo_freq = this.i['LFO'].get();
		this.OSC1.cv = this.osc1_cv;
		this.OSC2.cv = this.osc2_cv;
		this.LFO.set_frequency(this.lfo_freq);

		this.CF1.in = this.OSC1.out;
		this.CF2.in = this.OSC2.out;

		this.ADSR.process();
		this.OSC1.process();
		this.OSC2.process();
		this.LFO.process();
		this.CF1.process();
		this.CF2.process();

		this.o['ENV'].set(this.ADSR.out);
		this.o['OSC1'].set(this.OSC1.out);
		this.o['OSC2'].set(this.OSC2.out);
		this.o['LFO'].set(this.LFO.out);
		this.o['ENV'].set(this.ADSR.out);

		this.out = (this.OSC1.out * this.osc1_amp + this.OSC2.out * this.osc2_amp + this.CF1.out * this.cf_cv1/20 + this.CF2.out * this.cf_cv2/20) / 4 * (this.ADSR.out/10);
		this.o['OUT'].set(this.out)
	}
}