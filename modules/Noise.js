class NoiseWasm extends Module {
  constructor() {
    super({w:hp2x(10)});
    this.is_loaded = false;
    this.is_constructed = false;
    this.freq = 261.63;
    this.add_input(new InputEncoder({x:hp2x(1), y:42, r:9, val: 0, vmin:-10, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2x(5.5), y:42, r:9, val: 0, name:'FM'}));
    this.add_input(new InputEncoder({x:hp2x(1), y:70, r:9, vmin:-10, val:0, name:'WAVE'})); //-10 + rackrand() * 20, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2x(5.5), y:70, r:9, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_input(new InputEncoder({x:hp2x(1), y:98, r:9, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2x(5.5), y:98, r:9, vmin:0, vmax:10, val:1, name:'OUT'}));
    this.out = 0;

    this.func_list = ["process", "constructor"];
    this.file = "./test_wasm/noise.wasm";
    this.VCO_Module = new createModule(this.file, this.func_list);
    this.is_loaded = this.VCO_Module.flag;
  }

  set_param() {
    this.cv = this.i['CV'].get();
    this.fm = this.i['FM'].get();
    this.wave = this.i['WAVE'].get();
    this.pw = this.i['PW'].get();
    this.amp = this.i['AMP'].get();
  }

  process() {
    this.set_param();

    if (this.is_loaded) {
      this.VCO_constructor = this.VCO_Module.module.cwrap('constructor', 'number', []);
      this.VCO_process = this.VCO_Module.module.cwrap('process', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number']);
      //console.log(this.VCO_constructor);
      this.ptr = this.VCO_constructor();
      //console.log(this.test_2(this.ptr));
      this.is_loaded = false;
      this.is_constructed = true;
    }
    if (this.is_constructed) {
      this.out = this.VCO_process(this.ptr, this.freq, this.wave, this.pw, this.cv, this.amp, this.fm);
    }

    this.o['OUT'].set(this.out);
  }
}

class Noise extends Module {
  constructor() {
    super({name:'Noise', w:hp2x(4)});
    // this.scope = new RawScope(0, 0, 20, 30, 'scope', 32);
    this.add_control(new Encoder({x:hp2x(0.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.amp = this.c['AMP'].get();
  }

  // draw(x, y, scale) {
  //   x += this.o['OUT'].get() * 0.05;
  //   y += this.o['OUT'].get() * 0.05;

  //   super.draw(x, y, scale);
  //   this.scope.draw(x + this.x, y + this.y, scale);
  // }

  process() {
    this.amp = this.c['AMP'].get();
    this.o['OUT'].set( (rackrand() * 20 - 10) * this.amp/10 );
    // this.scope.process( this.o['OUT'].get() )
  }
}

engine.add_module_class(Noise);
engine.add_module_class(NoiseWasm);