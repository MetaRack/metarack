class PingPongWasm extends Module {
  constructor() {
    super({w:hp2x(8)});
    this.is_loaded = false;
      this.is_constructed = false;
      this.file = "bin/PingPong.wasm";
      this.PP_Module = new createModule(this.file);
      this.is_loaded = this.PP_Module.flag;

    this.add_input(new InputEncoder({x:hp2x(0.6), y:6, r:7, val:0.66, vmin:0, vmax:1, name:'FB'}));
    this.add_input(new InputEncoder({x:hp2x(4.6), y:6, r:7, val:1, vmin:0, vmax:1, name:'D/W'}));

    this.add_input(new InputEncoder({x:hp2x(0.6), y:33, r:8, val:5, vmin:0.001, vmax:9.9, name:'TIME'}));

    this.add_input(new Port({x:hp2x(4.8), y:41, r:6, default_value:0, name:'SYNC'}));
    this.sync_led = new Led({x:hp2x(5.6), y:34, r:2});
      this.attach(this.sync_led);
      this.sync_led.set(255);
      this.sync_button = new Button({x:hp2x(5.4), y:33, r:3, state:false});
      this.attach(this.sync_button);

      this.add_input(new Port({x:hp2x(3.8), y:89, r:6, default_value:0, name:'MODE'}));
    this.mode_led = new Led({x:hp2x(2.4), y:93, r:2});
      this.attach(this.mode_led);
      this.mode_led.set(255);
      this.mode_button = new Button({x:hp2x(2.2), y:92, r:3, state:false});
      this.attach(this.mode_button);

      this.add_input(new InputEncoder({x:hp2x(1.4), y:67, r:6, val:0, vmin:-1, vmax:1, name:'TM L'}));
      this.add_input(new InputEncoder({x:hp2x(4.4), y:67, r:6, val:0, vmin:-1, vmax:1, name:'TM R'}));

      this.time_l_led = new Led({x:hp2x(0.4), y:71, r:2});
      this.attach(this.time_l_led);
      this.time_l_led.set(255);

      this.time_r_led = new Led({x:hp2x(6.9), y:71, r:2});
      this.attach(this.time_r_led);
      this.time_r_led.set(255);

      this.add_input(new Port({x:hp2x(0.6), y:110, r:4, name:'I/L'}));
      this.add_input(new Port({x:hp2x(2.3), y:110, r:4, name:'I/R'}));

      this.add_output(new Port({x:hp2x(4), y:110, r:4, name:'O/L'}));
      this.add_output(new Port({x:hp2x(5.7), y:110, r:4, name:'O/R'}));

      this.reset();
      this.set_param();
      this.prev_sync = this.sync;
      this.prev_mode = this.mode;
  }

  clamp (x, a, b) {
      return Math.max(Math.min(x, b), a);
    }

  reset() {
    this.sample_counter_l = 0;
    this.sample_counter_r = 0;
    this.gate_l = 1;
    this.gate_r = 1;
  }

  set_param() {
    this.time_l = this.i['TIME'].get() * Math.pow(2, this.i['TM L'].get()); 
      this.time_r = this.i['TIME'].get() * Math.pow(2, this.i['TM R'].get());

      this.time_l = Math.min(9.9, this.time_l);
      this.time_r = Math.min(9.9, this.time_r);
      this.clock_l = Math.floor(sample_rate * (this.time_l / 10));
      this.clock_r = Math.floor(sample_rate * (this.time_r / 10));

      this.sync_flag = this.sync_button.get();
      this.sync_led.set(!this.sync_flag * 255);

      this.fb = this.i['FB'].get();
      this.dw = this.i['D/W'].get();

      this.in_l = this.i['I/L'].get();
      this.in_r = this.i['I/R'].get();
      this.out_l = 0;
      this.out_r = 0;

      this.sync = this.i['SYNC'].get();
      this.mode = this.i['MODE'].get();

      this.mode_flag = this.mode_button.get();
      this.mode_led.set(!this.mode_flag * 255);
  }

  update_buffer() {
    this.buf[0] = this.in_l;
    this.buf[1] = this.in_r;

      this.buf[2] = this.sync_flag;
      this.buf[3] = this.mode_flag;
      this.buf[4] = this.time_l / 10;
      this.buf[5] = this.time_r / 10;
      this.buf[6] = this.fb;
      this.buf[7] = this.dw;
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

    if (this.sync != this.prev_sync) {
      this.sync_button.set(!this.sync_flag);
    }

    this.out_l = 0;
    this.out_r = 0;
    if (this.is_loaded) {
      this.PP_constructor = this.PP_Module.module.cwrap('constructor', 'number', []);
      this.PP_process = this.PP_Module.module.cwrap('process', null, ['number', 'number']);
      this.ptr = this.PP_constructor();
      this.memory = this.PP_Module.module["asm"]["memory"].buffer;
      this.buf = new Float64Array(this.memory, 0, 10);
      this.is_loaded = false;
      this.is_constructed = true;
      }
      if (this.is_constructed) {
      this.update_buffer();
      this.PP_process(this.ptr, this.buf.byteOffset);
      this.out_l = this.buf[8];
      this.out_r = this.buf[9];
      }

    this.sample_counter_l++;
    this.sample_counter_r++;
    this.prev_sync = this.sync;
    this.prev_mode = this.mode;
    this.prev_sync_flag = this.sync_flag;

    this.o['O/L'].set(this.out_l);
    this.o['O/R'].set(this.out_r);
  }
}

engine.add_module_class(PingPongWasm);