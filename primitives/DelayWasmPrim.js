class DelayWasmPrim {
  constructor() {
    this.is_loaded = false;
    this.is_constructed = false;
    this.file = "c-modules/bin/Delay.wasm";
    this.Delay_Module = new createModule(this.file);
    this.is_loaded = this.Delay_Module.flag;
    // this.Delay_Module.module['onRuntimeInitialized'] = function() {
    //   this.is_loaded = true;
    // }

    // this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:1, vmin:0.001, vmax:10, name:'TIME'}));
    // this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, val:0, vmin: 0, vmax:1, name:'FB'}));
    // this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, val:1, vmin: 0, vmax:1, name:'D/W'}));
    // this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'IN'}));
    // this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.in = 0;
    this.fb = 0;
    this.dw = 1;
    this.time = 1;
  }

  update_buffer() {
    this.buf[0] = this.in;
    this.buf[1] = this.fb;
    this.buf[2] = this.time / 10;
    this.buf[3] = this.dw;
  }

  process() {
    this.out = 0;
    if (this.dw < 0) this.dw = 0;
    if (this.dw > 1) this.dw = 1;

    if (this.fb < 0) this.fb = 0;
    if (this.fb > 1) this.fb = 1;

    if (this.time < 0) this.time = 0.01;
    if (this.time > 10) this.time = 9.99;
    
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
  }
}