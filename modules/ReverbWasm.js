class ReverbWasm extends Module {
  constructor() {
    super({w:hp2x(3)});

    this.is_loaded = false;
    this.is_constructed = false;
    this.file = "./bin/DattorroReverb.wasm";
    this.Reverb_Module = new createModule(this.file);
    this.is_loaded = this.Reverb_Module.flag;

    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'SIZE'}));
    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'DEC'}));
    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.46), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'D/W'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.59), r:hp2x(0.8), name:'I/L'}));
    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.69), r:hp2x(0.8), name:'I/R'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.79), r:hp2x(0.8), name:'O/L'}));
    this.add_output(new Port({x:hp2x(0.7), y:hp2y(0.89), r:hp2x(0.8), name:'O/R'}));

    this.update_params();
}


  update_params() {
    this.in_l = this.i['I/L'].get();
    this.in_r = this.i['I/R'].get();
    this.size = this.c['SIZE'].get()**2;
    this.decay = this.c['DEC'].get();
    this.dw = this.c['D/W'].get()**2;
  }

  update_buffer() {
    this.buf[0] = this.in_l;
    this.buf[1] = this.in_r;

    this.buf[2] = this.size;
    this.buf[3] = this.decay;
  }

  process() {
    this.update_params();

    this.out = 0;
    if (this.is_loaded) {
      this.Reverb_constructor = this.Reverb_Module.module.cwrap('constructor', 'number', []);
      this.Reverb_process = this.Reverb_Module.module.cwrap('process', null, ['number', 'number']);
      this.ptr = this.Reverb_constructor();
      this.memory = this.Reverb_Module.module["asm"]["memory"].buffer;
      this.buf = new Float64Array(this.memory, 0, 6);
      this.is_loaded = false;
      this.is_constructed = true;
    }
    if (this.is_constructed) {
      this.update_buffer();
      this.Reverb_process(this.ptr, this.buf.byteOffset);
      this.out_l = this.buf[4];
      this.out_r = this.buf[5];
    }
  
    this.o['O/L'].set(this.out_l);
    this.o['O/R'].set(this.out_r);

    this.o['O/L'].set(this.in_l + (this.out_l - this.in_l) * this.dw);
    this.o['O/R'].set(this.in_r + (this.out_r - this.in_r) * this.dw);
    
  }
}