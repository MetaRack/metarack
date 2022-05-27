class Delay extends Module {
  constructor() {
    super({w:hp2x(4)});

    this.delay_line = new InterpDelayLine(10);

    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:1, vmin:0.001, vmax:10, name:'TIME'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, val:0, vmin: 0, vmax:1, name:'FB'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, val:1, vmin: 0, vmax:1, name:'D/W'}));
    this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 2;
    let rounding = 5;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.05, sw + 30, w * 0.9 - 2 * sw, h * 0.15 - 2 * sw, rounding, rounding, rounding, rounding);
  }

  process() {
    this.delay_line.set_feedback(this.i['FB'].get());
    this.delay_line.set_dry_wet(this.i['D/W'].get());
    this.delay_line.set_delay_time(this.i['TIME'].get());
    this.o['OUT'].set( this.delay_line.process( this.i['IN'].get() ) );
  }
}

class DelayWasm extends Module {
  constructor() {
    super({w:hp2x(4)});
    this.is_loaded = false;
    this.is_constructed = false;
    this.file = "./bin/Delay.wasm";
    this.Delay_Module = new createModule(this.file);
    this.is_loaded = this.Delay_Module.flag;

    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:1, vmin:0.001, vmax:10, name:'TIME'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, val:0, vmin: 0, vmax:1, name:'FB'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, val:1, vmin: 0, vmax:1, name:'D/W'}));
    this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));

    this.update_param();
  }

  update_param() {
    this.in = this.i['IN'].get();
    this.fb = this.i['FB'].get();
    this.dw = this.i['D/W'].get();
    this.time = this.i['TIME'].get();
  }

  update_buffer() {
    this.buf[0] = this.in;
    this.buf[1] = this.fb;
    this.buf[2] = this.time / 10;
    this.buf[3] = this.dw;
  }

  process() {
    this.update_param();

    this.out = 0;
    
    if (this.is_loaded) {
      this.Delay_constructor = this.Delay_Module.module.cwrap('constructor', 'number', []);
      this.Delay_process = this.Delay_Module.module.cwrap('process', null, ['number', 'number']);
      this.ptr = this.Delay_constructor();
      this.memory = this.Delay_Module.module["asm"]["memory"].buffer;
      this.buf = new Float64Array(this.memory, 0, 5);
      this.is_loaded = false;
      this.is_constructed = true;

    }
    if (this.is_constructed) {
      this.update_buffer();
      this.Delay_process(this.ptr, this.buf.byteOffset);
      this.out = this.buf[4];
    }
    this.o['OUT'].set(this.out);
  }
}

engine.add_module_class(Delay);
engine.add_module_class(DelayWasm);