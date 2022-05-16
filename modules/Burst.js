class Burst extends Module {
	constructor() {
		super({w:hp2px(7)});

		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:1, vmax:10, val:1, precision:0, name:'REP'}));
    	this.add_input(new InputEncoder({x:hp2px(3.6), y:6, r:7, vmin:1, vmax:7, val:1, precision:0, name:'TYPE'}));
    	this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:-10, vmax:10, val:0, name:'OFST'}));
    	this.add_input(new InputEncoder({x:hp2px(3.6), y:26, r:7, vmin:0.1, vmax:5, val:0.1, name:'SCL'}));
    	this.add_input(new Port({x:hp2px(3.8), y:46, r:6, name:'BRST'}));
    	this.add_input(new Port({x:hp2px(0.8), y:46, r:6, name:'CLK'}));
    	this.add_output(new Port({x:hp2px(3.8), y:108, r:6, name:'GATE'}));
    	this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'CV'}));
    	this.add_output(new Port({x:hp2px(3.8), y:88, r:6, name:'EOC'}));
    	this.clk_led = new Led({x:hp2px(1.2), y:90.2, r:4});
    	this.attach(this.clk_led);
    	this.clk_led.set(255);

    	this.rep = this.i['REP'].get().toFixed(0);
    	this.type = this.i['TYPE'].get().toFixed(0);
    	this.offset = this.i['OFST'].get();
    	this.scale = this.i['SCL'].get();
    	this.burst = 0;
    	this.prev_burst = 0;
    	this.gate_counter = 0;
    	this.gate = 0;
    	this.prev_gate = 0;
    	this.burst_flag = false;

    	this.gate_out = 0;
    	this.mult = 1;
    	this.global_mult = 1;
    	this.cv_out = 0;
    	this.eoc_out = 0;
	}

	process() {
		this.rep = this.i['REP'].get().toFixed(0);
    	this.type = this.i['TYPE'].get().toFixed(0);
    	this.offset = this.i['OFST'].get();
    	this.scale = this.i['SCL'].get();

		this.gate = this.i['CLK'].get();
		this.burst = this.i['BRST'].get();

		if (this.burst > this.prev_burst) {
			this.burst_flag = true;
			this.gate_counter = 0;
			this.cv_out = 0;
			this.mult = 1;
			this.global_mult = 1;
		}

		if (this.burst_flag) {
			if (this.gate > this.prev_gate) {
				this.gate_counter++;
				switch (Math.floor(this.type)) {
					case 1: 
						this.cv_out += rackrand();
					case 2:
						this.cv_out -= rackrand();
					case 3:
						this.cv_out += this.mult * rackrand();
						this.mult *= -1;
					case 4:
						this.cv_out -= this.mult * rackrand();
						this.mult *= -1;
					case 5:
						this.cv_out += rackrand();
						this.global_mult *= -1;
					case 6:
						this.cv_out -= rackrand();
						this.global_mult *= -1;
					case 7:
						this.cv_out += (rackrand() - 0.5) * 2;
				}
			}

			if (this.gate_counter > this.rep) {
				this.gate_counter = 0;
				this.burst_flag = false;
				this.cv_out = 0;
				this.mult = 1;
				this.global_mult = 1;
			}

			if (this.gate_counter > 0) {
				this.gate_out = this.gate;
			}

			if (this.gate_counter == this.rep) {
				this.eoc_out = this.gate;
			}

		}

		this.o['GATE'].set(this.gate_out);
		this.clk_led.set(!this.gate_out * 255);
		if (this.burst_flag)
			this.o['CV'].set((this.cv_out * this.scale * this.global_mult) + this.offset);
		this.o['EOC'].set(this.eoc_out);
		this.prev_gate = this.gate;
		this.prev_burst = this.burst;
	}
}

engine.add_module_class(Burst);