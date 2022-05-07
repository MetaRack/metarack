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