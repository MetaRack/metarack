class Ring extends Module {
	constructor () {
		super({w:hp2x(4)});

		this.add_input(new Port({x:hp2x(0.8), y:8, r:6, name:'IN1'}));
		this.add_input(new Port({x:hp2x(0.8), y:28, r:6, name:'IN2'}));
		this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, vmin:-1, vmax:1, val:0, name:'POL'}));
		this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'D/W'}));
		this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));

		this.Ring = new RingPrim();

		this.Ring.pol = this.i['POL'].get();
		this.Ring.dw = this.i['D/W'].get();
	}

	process() {
		this.Ring.pol = this.i['POL'].get();
		this.Ring.dw = this.i['D/W'].get();
		this.Ring.in1 = this.i['IN1'].get();
		this.Ring.in2 = this.i['IN2'].get();

		this.Ring.process();

		this.o['OUT'].set(this.Ring.out);
	}
}

engine.add_module_class(Ring);