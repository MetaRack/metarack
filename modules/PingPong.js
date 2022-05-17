class PingPong extends Module {
	constructor() {
		super({w:hp2px(8)});

		//this.add_input(new InputEncoder({x:hp2px(4.6), y:83, r:6, val:0, vmin:0, vmax:1, visible:false, name:'CF'}));

		this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, val:0.66, vmin:0, vmax:1, name:'FB'}));
		this.add_input(new InputEncoder({x:hp2px(4.6), y:6, r:7, val:1, vmin:0, vmax:1, name:'D/W'}));

		this.add_input(new InputEncoder({x:hp2px(0.6), y:33, r:8, val:1, vmin:0.001, vmax:9.9, name:'TIME'}));

		this.add_input(new Port({x:hp2px(4.6), y:41, r:7, default_value:0, name:'INF'}));
		this.inf_led = new Led({x:hp2px(5.6), y:34, r:2});
    	this.attach(this.inf_led);
   		this.inf_led.set(255);
    	this.inf_button = new Button({x:hp2px(5.4), y:33, r:3, state:false});
    	this.attach(this.inf_button);

    	this.add_input(new InputEncoder({x:hp2px(1.4), y:63, r:6, val:0, vmin:-1, vmax:1, name:'TM L'}));
    	this.add_input(new InputEncoder({x:hp2px(4.4), y:63, r:6, val:0, vmin:-1, vmax:1, name:'TM R'}));

    	this.time_l_led = new Led({x:hp2px(0.4), y:67, r:2});
    	this.attach(this.time_l_led);
   		this.time_l_led.set(255);

   		this.time_r_led = new Led({x:hp2px(6.9), y:67, r:2});
    	this.attach(this.time_r_led);
   		this.time_r_led.set(255);

   		this.add_input(new Port({x:hp2px(3.2), y:95, r:4, name:'SYNC'}));

    	this.add_input(new Port({x:hp2px(0.6), y:110, r:4, name:'I/L'}));
    	this.add_input(new Port({x:hp2px(2.3), y:110, r:4, name:'I/R'}));

    	this.add_output(new Port({x:hp2px(4), y:110, r:4, name:'O/L'}));
    	this.add_output(new Port({x:hp2px(5.7), y:110, r:4, name:'O/R'}));

    	this.delay_l = new DelayPrim();
    	this.delay_r = new DelayPrim();
    	//this.delay_l = new SmoothSampleDelay();
    	//this.delay_r = new SmoothSampleDelay();
    	this.filter_r = new ExponentialFilterPrim({freq:2000});
    	this.filter_l = new ExponentialFilterPrim({freq:2000});

    	this.crossfade_dw = new SmoothCrossFade(1);
    	this.crossfade_fb = new SmoothCrossFade(0.66);
    	this.crossfade_amp = new SmoothCrossFade(0);

    	this.ADSR_l = new ADSRPrim();
    	this.ADSR_l.set_param(0.1, 1, 2, 6);
    	this.ADSR_r = new ADSRPrim();
    	this.ADSR_r.set_param(0.1, 1, 2, 6);

    	this.reset();
    	this.set_param();
	}

	clamp (x, a, b) {
    	return Math.max(Math.min(x, b), a);
  	}

	reset() {
		this.sample_counter_l = 0;
		this.sample_counter_r = 0;
		this.gate_l = 1;
		this.gate_r = 1;
		this.sync = this.i['SYNC'].get();
    	this.prev_sync = this.sync;
    	this.prev_inf_flag = this.inf_button.get();
	}

	set_param() {
		this.time_l = this.i['TIME'].get() * Math.pow(2, this.i['TM L'].get()); 
    	this.time_r = this.i['TIME'].get() * Math.pow(2, this.i['TM R'].get());

    	//this.time_l = this.clamp(this.i['TIME'].get() + this.i['TM L'].get(), 0.01, 9.9); 
    	//this.time_r = this.clamp(this.i['TIME'].get() + this.i['TM R'].get(), 0.01, 9.9);

    	//this.cf = this.i['CF'].get();

    	this.time_l = Math.min(9.9, this.time_l);
    	this.time_r = Math.min(9.9, this.time_r);
    	this.clock_l = Math.floor(sample_rate * (this.time_l / 10));
    	this.clock_r = Math.floor(sample_rate * (this.time_r / 10));

    	this.delay_l.time = this.clock_l / sample_rate;
    	this.delay_r.time = this.clock_r / sample_rate;
    	//this.delay_l.delay = this.clock_l;
    	//this.delay_r.delay = this.clock_r;

    	this.inf_flag = this.inf_button.get();
    	this.inf_led.set(!this.inf_flag * 255);

    	this.fb = this.i['FB'].get();
    	this.dw = this.i['D/W'].get();

    	this.in = this.i['I/L'].get();
    	this.out_l = 0;
    	this.out_r = 0;

    	this.sync = this.i['SYNC'].get();

    	//if (!this.inf_flag) {
    		// this.crossfade_dw.b = this.dw;//set(this.dw);
    		// this.crossfade_fb.b = this.fb;//set(this.fb);
    		// this.crossfade_amp.b = 0;//set(0);
		this.delay_l.fb = this.crossfade_fb.get();
		this.delay_r.fb = this.crossfade_fb.get();
		this.delay_l.dw = this.crossfade_dw.get();
		this.delay_r.dw = this.crossfade_dw.get();
    	//}
    	// else {
    	// 	this.delay_l.fb = this.crossfade_fb.get();
    	// 	this.delay_r.fb = this.crossfade_fb.get();
    	// 	this.delay_l.dw = this.crossfade_dw.get();
    	// 	this.delay_r.dw = this.crossfade_dw.get();
    	// }
	}

	process() {
		this.set_param();

		if (this.sample_counter_l > this.clock_l) {
			this.gate_l += 1;
			this.gate_l %= 2;
			this.sample_counter_l -= this.clock_l;
			this.time_l_led.set(!this.gate_l * 255);
		}

		if (this.sample_counter_r > this.clock_r) {
			this.gate_r += 1;
			this.gate_r %= 2;
			this.sample_counter_r -= this.clock_r;
			this.time_r_led.set(!this.gate_r * 255);
		}

		if (this.sync > this.prev_sync) {
			this.reset();
		}

		this.ADSR_l.gate = Math.floor(this.gate_l);
		this.ADSR_r.gate = Math.floor(this.gate_r);

		if ((this.prev_inf_flag != this.inf_flag) && (this.inf_flag)) {
			this.crossfade_dw.set(1);
    		this.crossfade_fb.set(1);
    		this.crossfade_amp.set(1);
		}

		if ((!this.inf_flag)) {
			this.crossfade_dw.set(this.dw);
    		this.crossfade_fb.set(this.fb);
    		this.crossfade_amp.set(0);
		}

		this.delay_r.in = this.in * (1 - this.crossfade_amp.get()) + this.delay_r.out * this.crossfade_amp.get();
		this.delay_l.in = this.in * (1 - this.crossfade_amp.get()) + this.delay_l.out * this.crossfade_amp.get();

		this.filter_l.in = this.delay_l.out;
		this.filter_r.in = this.delay_r.out;

		this.out_l = this.filter_l.lp;
		this.out_r = this.filter_r.lp;

		this.sample_counter_l++;
		this.sample_counter_r++;
		this.prev_sync = this.sync;
		this.prev_inf_flag = this.inf_flag;
		
		this.delay_l.process();
    	this.delay_r.process();
    	this.filter_l.process();
    	this.filter_r.process();
    	this.ADSR_l.process();
    	this.ADSR_r.process();

		this.o['O/L'].set(this.out_l);
		//this.o['O/L'].set(this.delay_l.out);
		this.o['O/R'].set(this.out_r);


	}
}

engine.add_module_class(PingPong);