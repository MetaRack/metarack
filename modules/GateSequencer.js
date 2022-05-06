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
    this.add_input(new InputEncoder({x:hp2px(8.6), y:16, r:7, vmin:1, vmax:16, val:8, precision:0, name:'STPS'}));
    for (i = 0; i < 4; i++) {
    	this.add_output(new Port({x:hp2px(18 + i*3), y:108, r:6, name:'OUT ' + (i+1).toString()}));
    }

    this.prev_gate = 0;
    this.curr_gate = 0;
    this.step = 0;
    this.steps = this.i['STPS'].get();
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
  	this.steps = this.i['STPS'].get().toFixed(0);
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

class StepSequencer extends Module {
    constructor() {
    super({name:'GateSequencer', w:hp2px(30)});

    this.add_input(new Port({x:hp2px(0.6), y:16, r:7, default_value:0, name:'Reset'}));
    this.reset_led = new Led({x:hp2px(1.6), y:9, r:2});
    this.attach(this.reset_led);
    this.reset_led.set(255);
    this.reset_button = new Button({x:hp2px(1.4), y:8, r:3});
    this.attach(this.reset_button);

    this.add_input(new Port({x:hp2px(4.6), y:16, r:7, name:'CLK'}));
    this.add_input(new InputEncoder({x:hp2px(8.6), y:16, r:7, vmin:1, vmax:8, val:8, precision:0, name:'STPS'}));
    for (i = 0; i < 3; i++) {
      this.add_output(new Port({x:hp2px(18 + i*3), y:16, r:7, name:'ROW ' + (i+1).toString()}));
    }
      this.add_output(new Port({x:hp2px(18 + 3*3), y:16, r:7, name:'GATE'}));

    this.prev_gate = 0;
    this.curr_gate = 0;
    this.step = 0;
    this.steps = this.i['STPS'].get();

    this.is_reset = false;
    this.no_gate = false;
    this.reset_counter = 0;
    this.prev_rst_gate = 0;
    this.curr_rst_gate = 0;

    this.led_row = new Array(8);
    this.button_row = new Array(8);  

    this.gate_flag = false;
    this.gate_counter = false;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 8; j++) {
        this.add_input(new InputEncoder({x:hp2px(0.6 + 3.5*j + Math.floor(j/4)*1.5), y:(42 + i*20), r:7, vmin:-10, vmax:10, val:0, precision:2, name:i.toString() + j.toString()}));
      }
    }

    for (var i = 0; i < 8; i++) {
      this.led_row[i] = new Led({x:hp2px(1.6 + i*3.5 + Math.floor(i/4)*1.5), y:(35 + 4*13 + 10 + 12), r:2});
      this.led_row[i].set(255);
      this.attach(this.led_row[i]);

      this.button_row[i] = new Button({x:hp2px(1.4 + i*3.5 + Math.floor(i/4)*1.5), y:(34 + 4*13 + 10 + 12), r:3, state:true});
      this.attach(this.button_row[i]);       
    }

    
  }

  draw_dbf (buf, x, y, w, h) {
    this.steps = this.i['STPS'].get().toFixed(0);
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

      this.led_row[0].set(Math.min(127, !this.button_row[0].get() * 255));
      this.o['GATE'].set(this.button_row[0].get());

      for (var i = 0; i < 3; i++) {
        this.o['ROW ' + (i+1).toString()].set(this.i[i.toString() + '0'].get());
      }

      this.reset_led.set(0);
    }

    this.curr_rst_gate = this.i['Reset'].get();
    if (this.prev_rst_gate < this.curr_rst_gate) {
      this.is_reset = true;
      this.no_gate = true;
      this.step = 0;

      this.led_row[i][0].set(Math.min(127, !this.button_row[i][0].get() * 255));
      this.o['OUT ' + (i+1).toString()].set(this.button_row[i][0].get());

      for (var i = 0; i < 3; i++) {
        this.o['ROW ' + (i+1).toString()].set(this.i[i.toString() + '0'].get());
      }

    }
    this.prev_rst_gate = this.curr_rst_gate;

    this.curr_gate = this.i['CLK'].get();

    for (var i = 0; i < this.steps; i++) {
      if (i == this.step) {
        this.led_row[i].set(Math.min(127, !this.button_row[i].get() * 255));
        this.o['GATE'].set(this.button_row[i].get());
      }
      else
        this.led_row[i].set(!this.button_row[i].get() * 255);
    }

    for (var i = 0; i < 3; i++) {
      if (this.button_row[this.step].get())
        this.o['ROW ' + (i+1).toString()].set(this.i[i.toString() + this.step.toString()].get());
    }


    if ((this.prev_gate < this.curr_gate) && (!this.no_gate)) {
      this.step++;
      this.o['GATE'].set(0);
    }

    this.step %= this.steps;

    this.prev_gate = this.curr_gate;

  }
}