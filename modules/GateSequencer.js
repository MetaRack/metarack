class GateSequencer extends Module {

  constructor() {
    super({name:'GateSequencer', w:hp2px(30)});

    this.add_input(new Port({x:hp2px(0.6), y:6, r:7, name:'CLK'}));
    for (i = 0; i < 4; i++) {
    	this.add_output(new Port({x:hp2px(18 + i*3), y:108, r:6, name:'OUT ' + (i+1).toString()}));
    }

    this.prev_gate = 0;
    this.curr_gate = 0;
    this.step = 0;
    this.step_num = 16;

    this.led_row = new Array(4);
	this.button_row = new Array(4);  

	for (var i = 0; i < 4; i++) {
		this.led_row[i] = new Array(16);
		this.button_row[i] = new Array(16);
	}	

    for (var i = 0; i < 4; i++) {
    	for (var j = 0; j < 16; j++) {
	    	this.led_row[i][j] = new Led({x:hp2px(1.6 + j*1.6 + Math.floor(j/4)/2), y:(35 + i*13), r:2});
	    	this.led_row[i][j].set(255);
	    	this.attach(this.led_row[i][j]);

	    	this.button_row[i][j] = new Button({x:hp2px(1.4 + j*1.6 + Math.floor(j/4)/2), y:(34 + i*13), r:3, state:false});
	    	this.attach(this.button_row[i][j]);	    	
	    }
    }
    
  }

  process() {

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

  	if (this.prev_gate < this.curr_gate) {
  		this.step++;
  	}

  	this.step %= this.step_num;

  	this.prev_gate = this.curr_gate;
  }

}