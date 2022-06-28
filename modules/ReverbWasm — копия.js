class ReverbWasm extends Module {
  constructor() {
    super({w:hp2x(4)});
    this.add_control(new Encoder({x:hp2x(0.6), y:6, r:7, vmin:0, vmax:1, val:0.5, name:'SIZE'}));
    this.add_control(new Encoder({x:hp2x(0.6), y:26, r:7, vmin:0, vmax:1, val:0.5, name:'DEC'}));
    this.add_control(new Encoder({x:hp2x(0.6), y:46, r:7, vmin:0, vmax:1, val:0.5, name:'D/W'}));
    // this.info = {
    //   'env': asmLibraryArg,
    //   'wasi_snapshot_preview1': asmLibraryArg,
    // };
    this.info={"a":asmLibraryArg};
    this.add_input(new Port({x:hp2x(0.8), y:68, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:88, r:6, name:'OUT_L'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT_R'}));
    this.in = 0;
    this.out = 0;
    this.dw = 0;
    this.size = 0;
    this.decay = 0;

    
    // this.dtr_constr = _Module.cwrap('dtr_constructor', 'number', []);
    // this.dtr_desctr = _Module.cwrap('dtr_destructor', null, ['number']);
    // this.dtr_set_in_l = _Module.cwrap('dtr_set_in_l', null, ['number', 'number']);
    // this.dtr_set_in_r = _Module.cwrap('dtr_set_in_r', null, ['number', 'number']);
    // this.dtr_get_out_l = _Module.cwrap('dtr_get_out_l', 'number', ['number']);
    // this.dtr_get_out_r = _Module.cwrap('dtr_get_out_r', 'number', ['number']);
    // this.dtr_process = _Module.cwrap('dtr_process', null, ['number']);

    //this.dtr_constr = _Module.cwrap('dtr_constructor', 'number', []);
    // this.dtr_clear = _Module.cwrap('dtr_clear', null, []);
    // this.dtr_set = _Module.cwrap('dtr_set', null, []);
    // this.dtr_set_in_r = _Module.cwrap('dtr_set_in_r', null, []);
    // this.dtr_set_in_l = _Module.cwrap('dtr_set_in_l', null, []);
    // this.dtr_get_out_l = _Module.cwrap('dtr_get_out_l', null, []);
    // // this.dtr_get_smth = _Module.cwrap('dtr_get_smth', 'number', []);
    // this.dtr_get_out_r = _Module.cwrap('dtr_get_out_r', 'number', []);
    // this.dtr_get_out_r = _Module.cwrap('dtr_get_out_r', 'number', []);
    // this.dtr_process = _Module.cwrap('dtr_process', null, []);
    this.out_l = 0;
    this.out_r = 0;
    this.flag = false;
    this.done_flag = true;
    //this.construct();
}
  

// construct = async () => {
//     this.response = await fetch(".bin/Dattorro.wasm");
//     this.file = await this.response.arrayBuffer();
//     this.wasm = await WebAssembly.instantiate(this.file, {});
    
//     //this.dtr = new this.wasm.module;
//     //this.memory = this.wasm.instance.exports.memory;
//     //this._process = this.dtr['_process'];//.instance.exports._process;
//     //this.myArray = new Float32Array(this.memory.buffer, 0, 2);
//     //this.dtr = this.wasm.instance.exports.dtr_constructor;
//     //this.dtr_d = this.wasm.instance.exports.dtr_destructor;
//     //this.in = this.dtr();
//     //this.in_l = this.wasm.instance.exports.dtr_set_in_l;
//     //var i = this.dtr();
//     //this.dtr = new _Module.Dattorro();
//     // this.IN_L = this.wasm.instance.exports.IN_L;
//     // this.IN_R = this.wasm.instance.exports.IN_R;
//     // this.OUT_L = this.wasm.instance.exports.OUT_L;
//     // this.OUT_R = this.wasm.instance.exports.OUT_R;
    
//     // this.noise_process(this.myArray.byteOffset);
//     //this.costruct();
//     console.log('Yes');
//     this.flag = false;

//   }

  set_param() {
    this.in = this.i['IN'].get();
    this.size = this.c['SIZE'].get()**2;
    this.decay = this.c['DEC'].get();
    this.dw = this.c['D/W'].get()**2;
  }

  process() {
    // this.IN_L = this.in;
    // this.IN_R = this.in;
    //this._process();
    //this.out = this.OUT_L;
    this.set_param();
    //this.wasm.instance.exports.dtr_set()
    if ((done) && (this.done_flag)) {
      // this.dtr_clear();
      this.done_flag = false;
      this.flag = true;
      console.log('No');
      this.dtr = new _Module.Dattorro();
      //this.dtr._clear();
    }
    if (this.flag) {
      this.dtr._process(this.in / 10, this.size, this.decay);
      //this.dtr._process();
      this.out_l = this.dtr.OUT_L * 4;
      this.out_r = this.dtr.OUT_R * 4;

      this.o['OUT_L'].set(this.in + (this.out_l - this.in) * this.dw);
      this.o['OUT_R'].set(this.in + (this.out_r - this.in) * this.dw);
    }
    
  }
}