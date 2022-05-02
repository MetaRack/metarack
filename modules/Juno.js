class Juno extends Module {
	constructor() {
		super({w:hp2px(10)});

		this.add_control(new Encoder({x:hp2px(3.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    	this.add_control(new Encoder({x:hp2px(3.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
   		this.add_control(new Encoder({x:hp2px(3.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    	this.add_control(new Encoder({x:hp2px(3.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
		this.add_control(new Encoder({x:hp2px(3.6), y:86, r:7, vmin:300, vmax:2000, val:1500, name:'COFF'}));

    	this.add_control(new Encoder({x:hp2px(6.6), y:6, r:7, vmin:-10, vmax:10, val:0, name:'VWV'}));
    	this.add_control(new Encoder({x:hp2px(6.6), y:26, r:7, vmin:-10, vmax:10, val:0, name:'SVWV'}));
    	this.add_control(new Encoder({x:hp2px(6.6), y:46, r:7, vmin:0, vmax:1, val:0, name:'PWLV'}));
    	this.add_control(new Encoder({x:hp2px(6.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'VAM'}));
    	this.add_control(new Encoder({x:hp2px(6.6), y:86, r:7, vmin:0, vmax:1, val:0, name:'SVAM'}));

    	

		this.add_input(new Port({x:hp2px(0.8), y:28, r:6, name:'GATE'}));
		this.add_input(new Port({x:hp2px(0.8), y:8, r:6, name:'PTCH'}));
    	this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));

		this.ADSR = new ADSRPrim();
		this.VCO = new VCOPrim(261.63);
		this.subVCO = new VCOPrim(130.815);
		this.LFO = new VCOPrim(1);
		this.freq = this.c['COFF'].get();
		this.Filter = new LadderFilter();
		this.Filter.setCutoffFreq(this.freq);

		this.out = 0;

		this.wave = this.c['VWV'].get();
		this.subwave = this.c['SVWV'].get();
		this.pw = this.c['PWLV'].get();
		this.vco_amp = this.c['VAM'].get();
		this.subvco_amp = this.c['SVAM'].get();

		this.A = this.c['A'].get();
		this.D = this.c['D'].get();
		this.S = this.c['S'].get();
		this.R = this.c['R'].get();
		this.ADSR.A = this.A;
		this.ADSR.D = this.D;
		this.ADSR.S = this.S;
		this.ADSR.R = this.R;
	}

	draw_dbf (buf, x, y, w, h) {
  		this.wave = this.c['VWV'].get();
		this.subwave = this.c['SVWV'].get();
		this.pw = this.c['PWLV'].get();
		this.vco_amp = this.c['VAM'].get();
		this.subvco_amp = this.c['SVAM'].get();
		this.freq = this.c['COFF'].get();
		this.Filter.setCutoffFreq(this.freq);
		// * Math.pow(2, this.pitch * this.kybd + this.ADSR.out * this.freq_mod));

		this.A = this.c['A'].get();
		this.D = this.c['D'].get();
		this.S = this.c['S'].get();
		this.R = this.c['R'].get();
		this.ADSR.A = this.A;
		this.ADSR.D = this.D;
		this.ADSR.S = this.S;
		this.ADSR.R = this.R;
  	}

	process() {

		this.ADSR.gate = this.i['GATE'].get();
		this.pitch = this.i['PTCH'].get();
		this.VCO.cv = this.pitch;
		this.subVCO.cv = this.pitch;
		this.VCO.wave = this.wave;
		this.subVCO.wave = this.subwave;

		this.VCO.pw = 0.5 + this.LFO.out * this.pw;
		this.out = (this.VCO.out * this.vco_amp + this.subVCO.out * this.subvco_amp) * this.ADSR.out;

		this.Filter.input = this.out;

		this.ADSR.process();
		this.VCO.process();
		this.subVCO.process();
		this.LFO.process();
		this.Filter.process();

		this.o['OUT'].set(this.Filter.highpass());
	}
}