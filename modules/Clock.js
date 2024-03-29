class Clock extends Module {

  constructor() {
    super({w:hp2x(10)});

    this.add_input(new Port({x:hp2x(0.6), y:16, r:7, default_value:0, name:'Reset'}));
    this.add_input(new Port({x:hp2x(3.6), y:16, r:7, default_value:0, name:'Run'}));
    this.add_input(new InputEncoder({x:hp2x(6.6), y:16, r:7, vmin:0, vmax:300, val:120, precision:0, name:'BPM'}));

    this.reset_led = new Led({x:hp2x(1.6), y:9, r:2});
    this.attach(this.reset_led);
    this.reset_led.set(255);
    this.reset_button = new Button({x:hp2x(1.4), y:8, r:3});
    this.attach(this.reset_button);

    this.run_led = new Led({x:hp2x(4.6), y:9, r:2});
    this.attach(this.run_led);
    this.run_led.set(0);
    this.run_button = new Button({x:hp2x(4.4), y:8, r:3, state:true});
    this.attach(this.run_button);

    this.clock_led = new Led({x:hp2x(7.4), y:8, r:3});
    this.attach(this.clock_led);
    this.clock_led.set(255);

    this.add_output(new Port({x:hp2x(0.6), y:36, r:7, name:'CLK'}));
    this.sample_counter = 0;
    this.value = 0;

    this.sample_threshold_row = [0, 0, 0];
    this.sample_counter_row = [0, 0, 0];

    this.is_run = true;
    this.prev_run_gate = 0;
    this.curr_run_gate = 0;

    this.is_reset = false;
    this.reset_counter = 0;
    this.prev_rst_gate = 0;
    this.curr_rst_gate = 0;

    for (var i = 1; i < 4; i++) {
      this.add_output(new Port({x:hp2x(0.8 + (i-1)*3), y:88, r:6, name:'CLK ' + i.toString()}));
      this.add_control(new StepEncoder({x:hp2x(0.8 + (i-1)*3), y:68, r:6, vmin:-4, vmax:4, val:1, step:1, precision:0, nonzero:true, name:'DIV' + i.toString()}));
      //this.sample_counter_row[i-1] = 0;
      //this.value_row[i-1] = 0;
    }

    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'Reset'}));
    this.add_output(new Port({x:hp2x(3.8), y:108, r:6, name:'Run'}));

    this.bpm = Math.max(1, Math.round(this.i['BPM'].get()));
    this.set_bpm();
  }

  set_bpm() {
    this.sample_threshold = sample_rate * 60 / this.bpm / 2;

    if (this.c['DIV1'].get() > 0)
        this.sample_threshold_row[0] = sample_rate * 60 / this.bpm / 2 / this.c['DIV1'].get();
      else
        this.sample_threshold_row[0] = sample_rate * 60 / this.bpm / 2 * (-this.c['DIV1'].get());
    if (this.c['DIV1'].changed)
      this.sample_counter_row[0] = this.fmod(this.sample_counter, this.sample_threshold_row[0]);

    if (this.c['DIV2'].get() > 0)
        this.sample_threshold_row[1] = sample_rate * 60 / this.bpm / 2 / this.c['DIV2'].get();
      else
        this.sample_threshold_row[1] = sample_rate * 60 / this.bpm / 2 * (-this.c['DIV2'].get());
    if (this.c['DIV2'].changed)
      this.sample_counter_row[1] = this.fmod(this.sample_counter, this.sample_threshold_row[1]);

    if (this.c['DIV3'].get() > 0)
        this.sample_threshold_row[2] = sample_rate * 60 / this.bpm / 2 / this.c['DIV3'].get();
      else
        this.sample_threshold_row[2] = sample_rate * 60 / this.bpm / 2 * (-this.c['DIV3'].get());
    if (this.c['DIV3'].changed)
      this.sample_counter_row[2] = this.fmod(this.sample_counter, this.sample_threshold_row[2]);

    // for (var i = 0; i < 3; i++) {
    //   if (this.c['DIV' + (i+1).toString()].get() > 0)
    //     this.sample_threshold_row[i] = sample_rate * 60 / this.bpm / 2 / this.c['DIV' + (i+1).toString()].get();
    //   else
    //     this.sample_threshold_row[i] = sample_rate * 60 / this.bpm / 2 * (-this.c['DIV' + (i+1).toString()].get());
    //   if (this.c['DIV' + (i+1).toString()].changed)
    //     this.sample_counter_row[i] = this.fmod(this.sample_counter, this.sample_threshold_row[i]);
    // }
  }

  // draw_dbf (buf, x, y, w, h) {
  //   this.bpm = Math.max(1, Math.round(this.i['BPM'].get()));
  //   this.set_bpm();
  // }

  fmod (a,b) { return (a - (Math.floor(a / b) * b)); };

  process() {
    this.bpm = Math.max(1, Math.round(this.i['BPM'].get()));
    this.set_bpm();

    if (this.sample_counter > this.sample_threshold) {
      this.o['CLK'].set(10);
      this.clock_led.set(0);
    }

    if (this.sample_counter_row[0] > this.sample_threshold_row[0]) {
      this.o['CLK 1'].set(10);
    }
    if (this.sample_counter_row[1] > this.sample_threshold_row[1]) {
      this.o['CLK 2'].set(10);
    }
    if (this.sample_counter_row[2] > this.sample_threshold_row[2]) {
      this.o['CLK 3'].set(10);
    }

    if (this.run_button.get() != this.is_run) {
      this.is_run = !this.is_run;
      this.run_led.set(!this.is_run * 255);
    }

    this.curr_run_gate = this.i['Run'].get();
    if (this.prev_run_gate < this.curr_run_gate) {
      this.is_run = !this.is_run;
      this.run_led.set(!this.is_run * 255);
    }
    this.prev_run_gate = this.curr_run_gate;
    this.o['Run'].set(this.is_run*10);

    if (this.is_reset) {
      this.reset_counter++;
    }

    if (this.reset_counter > 0) {
      this.reset_led.set(0);
      this.reset_button.set(false);
    }
    
    if (this.reset_counter > 10000) {
      this.reset_led.set(255);
      this.reset_counter = 0;
      this.is_reset = false;
    }

    if (this.reset_button.get()) {
      this.is_reset = true;
      this.sample_counter = 0;
      for (var i = 0; i < 3; i++)
        this.sample_counter_row[i] = 0;
      this.clock_led.set(0);
      this.reset_led.set(0);
    }

    this.curr_rst_gate = this.i['Reset'].get();
    if (this.prev_rst_gate < this.curr_rst_gate) {
      this.is_reset = true;
      this.sample_counter = 0;
      this.clock_led.set(0);
    }
    this.prev_rst_gate = this.curr_rst_gate;
    this.o['Reset'].set(this.is_reset*10);

    if (this.is_run) {
      this.sample_counter++;
      for (var i = 0; i < 3; i++)
        this.sample_counter_row[i]++

      if (this.sample_counter > this.sample_threshold * 2) {
        this.sample_counter -= this.sample_threshold * 2;
        this.o['CLK'].set(0);
        this.clock_led.set(255);
      }

      if (this.sample_counter_row[0] > this.sample_threshold_row[0] * 2) {
        this.o['CLK 1'].set(0);
        this.sample_counter_row[0] -= this.sample_threshold_row[0] * 2;
      }
      if (this.sample_counter_row[1] > this.sample_threshold_row[1] * 2) {
        this.o['CLK 2'].set(0);
        this.sample_counter_row[1] -= this.sample_threshold_row[1] * 2;
      }
      if (this.sample_counter_row[2] > this.sample_threshold_row[2] * 2) {
        this.o['CLK 3'].set(0);
        this.sample_counter_row[2] -= this.sample_threshold_row[2] * 2;
      }
    }
  }
}

engine.add_module_class(Clock);