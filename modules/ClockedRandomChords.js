class ClockedRandomChords extends Module {
	constructor() {
		super({w:hp2x(10)});

		this.add_input(new InputEncoder({x:hp2x(3.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    	this.add_input(new InputEncoder({x:hp2x(3.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
    	this.add_input(new InputEncoder({x:hp2x(3.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    	this.add_input(new InputEncoder({x:hp2x(3.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:6, r:7, vmin:0, vmax:4, val:0, name:'SHPR'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:26, r:7, vmin:0, vmax:8, val:3, precision:0, name:'SCL'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:46, r:7, vmin:0, vmax:11, val:0, precision:0, name:'ROOT'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:66, r:7, vmin:-2, vmax:2, val:0, name:'OFST'}));
    	this.add_input(new InputEncoder({x:hp2x(6.6), y:86, r:7, vmin:0.1, vmax:3, val:1, name:'WDTH'}));

    	this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, vmin:0, vmax:1, val:0.5, name:'P1'}));
    	this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, vmin:0, vmax:1, val:0.7, name:'P2'}));
    	this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, vmin:0, vmax:1, val:0.5, name:'P3'}));
    	this.add_input(new Port({x:hp2x(0.8), y:8, r:6, name:'GATE'}));
    	this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));

    	this.BG = new Array(3);
    	this.ENV = new Array(3);
    	this.OSC = new Array(3);
    	this.SHP = new Array(3);
    	this.SCL = new Array(3);
    	this.SH = new Array(3);
    	this.p = new Array(3);

    	for (var i = 0; i < 3; i++) {
    		this.BG[i] = new BernoulliGatePrim();
    		this.ENV[i] = new ADSRPrim();
    		this.OSC[i] = new VCOPrim(261);
    		this.SHP[i] = new SaturnPrim();
    		this.SCL[i] = new ScalePrim();
    		this.SH[i] = new SampleAndHoldPrim();
    		this.p[i] = 0;
    	}

    	this.BG[0].p = 0.5;
    	this.BG[1].p = 0.6;
    	this.BG[2].p = 0.7;

    	this.gate = 0;
    	this.out = 0;
    	this.shape = 0;
    	this.scale = 0;
    	this.root = 0;
    	this.offset = 0;
    	this.width = 0;
    	this.A = 0;
		this.D = 0;
		this.S = 0;
		this.R = 0;

	}

	set_param() {
		this.gate = this.i['GATE'].get();
		this.shape = this.i['SHPR'].get();
		this.root = this.i['ROOT'].get().toFixed(0);
		this.scale = this.i['SCL'].get().toFixed(0);
		this.offset = this.i['OFST'].get();
		this.width = this.i['WDTH'].get();

		this.A = this.i['A'].get();
		this.D = this.i['D'].get();
		this.S = this.i['S'].get();
		this.R = this.i['R'].get();
		this.p[0] = this.i['P1'].get();
		this.p[1] = this.i['P2'].get();
		this.p[2] = this.i['P3'].get();

		for (var i = 0; i < 3; i++) {
			this.BG[i].p = this.p[i];
    		this.ENV[i].A = this.A;
    		this.ENV[i].D = this.D;
    		this.ENV[i].S = this.S;
    		this.ENV[i].R = this.R;
    		this.SHP[i].fold = this.shape;
    		this.SCL[i].scale = this.scale;
    		this.SCL[i].root = this.root;
     	}
	}

	process() {
		this.set_param();


		this.out = 0;

		for (var i = 0; i < 3; i++) {
			this.BG[i].gate = this.gate;
			this.ENV[i].gate = this.BG[i].out_l;
			this.SH[i].gate = this.BG[i].out_l;
			this.SH[i].in = (rackrand() * this.width) + this.offset;
			this.SCL[i].in = this.SH[i].out;
			this.OSC[i].cv = this.SCL[i].out;
			this.SHP[i].in = this.OSC[i].out;

			this.BG[i].process();
    		this.ENV[i].process();
    		this.OSC[i].process();
    		this.SH[i].process();
    		this.SCL[i].process();
    		this.SHP[i].process();

			this.out += this.SHP[i].out * this.ENV[i].out / 10 / 3;
		}
		this.o['OUT'].set(this.out);

		// for (var i = 0; i < 3; i++) {
    		
  //   	}
	}
}

engine.add_module_class(ClockedRandomChords);