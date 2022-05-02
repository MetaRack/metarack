class GateSequencer extends Module {

  constructor() {
    super({name:'GateSequencer', w:hp2px(30)});

    this.add_input(new Port({x:hp2px(0.6), y:16, r:7, default_value:0, name:'Reset'}));
    this.reset_led = new Led({x:hp2px(1.6), y:9, r:2});
    this.attach(this.reset_led);
    this.reset_led.set(255);
    this.reset_button = new Button({x:hp2px(1.4), y:8, r:3});
    this.attach(this.reset_button);

    this.add_input(new Port({x:hp2px(4.6), y:16, r:7, name:'CLK'}));
    this.add_control(new Encoder({x:hp2px(8.6), y:16, r:7, vmin:1, vmax:16, val:8, precision:0, name:'STPS'}));
    for (i = 0; i < 4; i++) {
    	this.add_output(new Port({x:hp2px(18 + i*3), y:108, r:6, name:'OUT ' + (i+1).toString()}));
    }

    this.prev_gate = 0;
    this.curr_gate = 0;
    this.step = 0;
    this.steps = this.c['STPS'].get();
    this.gate_flag = new Array(4);
    this.gate_counter = new Array(4);

    this.is_reset = false;
    this.no_gate = false;
    this.reset_counter = 0;
    this.prev_rst_gate = 0;
    this.curr_rst_gate = 0;

    this.led_row = new Array(4);
	this.button_row = new Array(4);  

	for (var i = 0; i < 4; i++) {
		this.led_row[i] = new Array(16);
		this.button_row[i] = new Array(16);
		this.gate_flag[i] = false;
		this.gate_counter[i] = false;
	}	

    for (var i = 0; i < 4; i++) {
    	for (var j = 0; j < 16; j++) {
	    	this.led_row[i][j] = new Led({x:hp2px(1.6 + j*1.6 + Math.floor(j/4)/2), y:(35 + i*13 + 10), r:2});
	    	this.led_row[i][j].set(255);
	    	this.attach(this.led_row[i][j]);

	    	this.button_row[i][j] = new Button({x:hp2px(1.4 + j*1.6 + Math.floor(j/4)/2), y:(34 + i*13 + 10), r:3, state:false});
	    	this.attach(this.button_row[i][j]);	    	
	    }
    }
    
  }

  draw_dbf (buf, x, y, w, h) {
  	this.steps = this.c['STPS'].get().toFixed(0);
  	if (this.steps < 1) this.steps = 1;
  	this.step %= this.steps;
  }

  process() {

  	if (this.is_reset) {
      this.reset_counter++;
    }

    if (this.reset_counter > 0) {
      this.reset_led.set(0);
      this.reset_button.set(false);
    }

    if (this.reset_counter > 10000) {
    	this.no_gate = false;
    }
    
    if (this.reset_counter > 10000) {
      this.reset_led.set(255);
      this.reset_counter = 0;
      this.is_reset = false;
    }

    if (this.reset_button.get()) {
      this.is_reset = true;
      this.no_gate = true;
      this.step = 0;
      for (i = 0; i < 4; i++) {
      	this.led_row[i][0].set(Math.min(127, !this.button_row[i][0].get() * 255));
  	  	this.o['OUT ' + (i+1).toString()].set(this.button_row[i][0].get());
  	  }
      this.reset_led.set(0);
    }

    this.curr_rst_gate = this.i['Reset'].get();
    if (this.prev_rst_gate < this.curr_rst_gate) {
      this.is_reset = true;
      this.no_gate = true;
      this.step = 0;
      for (i = 0; i < 4; i++) {
      	this.led_row[i][0].set(Math.min(127, !this.button_row[i][0].get() * 255));
  	  	this.o['OUT ' + (i+1).toString()].set(this.button_row[i][0].get());
  	  }
    }
    this.prev_rst_gate = this.curr_rst_gate;

  	this.curr_gate = this.i['CLK'].get();

  	for (var i = 0; i < 4; i++) {
  		for (var j = 0; j < 16; j++) {
  			if (j == this.step) {
  				this.led_row[i][j].set(Math.min(127, !this.button_row[i][j].get() * 255));
  				this.o['OUT ' + (i+1).toString()].set(this.button_row[i][j].get());
  			}
  			else
  				this.led_row[i][j].set(!this.button_row[i][j].get() * 255);
  		}
  	}


  	if ((this.prev_gate < this.curr_gate) && (!this.no_gate)) {
  		this.step++;
  		for (var i = 0; i < 4; i++) {
  			this.o['OUT ' + (i+1).toString()].set(0);
  		}
  	}

  	this.step %= this.steps;

  	this.prev_gate = this.curr_gate;

  }

}