class workletVCO extends Module {

  constructor(freq=120, _p5=rackp5) {
    super({w:hp2x(10), _p5:_p5});
    this.out = 0;

    this.scope = new RawScope({x: this.w * 0.05, y:this.h * 0.05, w:this.w - this.w * 0.1, h:this.h*0.25, size:30, divider:64});
    this.attach(this.scope);

    this.delta = Math.PI * 2 / (sample_rate / freq);
    this.phase = 0;

    this.outputs = {
      'OUT' : 0,
      'OUT_NUM' : 1
    }

    this.inputs = {
      'CV' : 0,
      'FM' : 1,
      'WAVE' : 2,
      'PW' : 3,
      'AMP' : 4,
      'IN_NUM' : 5
    }

    this.node = new AudioWorkletNode(audioContext, 'vco', {numberOfInputs:this.inputs['IN_NUM'], numberOfOutputs:this.outputs['OUT_NUM']});


    let cv = 0.0001;
    this.add_input(new InputEncoder({x:hp2x(1), y:42, r:9, val: 0, vmin:-10, name:'CV'}));
    this.add_input(new InputEncoder({x:hp2x(5.5), y:42, r:9, val: 0, name:'FM'}));
    this.add_input(new InputEncoder({x:hp2x(1), y:70, r:9, vmin:-10, val:0, name:'WAVE'})); //-10 + rackrand() * 20, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2x(5.5), y:70, r:9, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_input(new InputEncoder({x:hp2x(1), y:98, r:9, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2x(5.5), y:98, r:9, vmin:0, vmax:10, val:1, name:'OUT'}));
    this.add_output(new Port({x:8, y:62, r:7, name:'PHASE_OUT', visible:false}));

    this.value = 0;
    this.type = 0;
    this.mod = 0;
    this.mod_prev = 0;
    this.phase_inc = 0;

    this.j = 0;
    this._alpha = 0.01;
  }

  set_frequency(f) {
    this.freq = f;
    this.delta = Math.PI * 2 / (sample_rate / f);
  }

  update_params() {
    this.node.parameters.get('cv').linearRampToValueAtTime(this.i['CV'].get(), audioContext.currentTime + 0.2);
    this.node.parameters.get('fm').linearRampToValueAtTime(this.i['FM'].get(), audioContext.currentTime + 0.2);
    this.node.parameters.get('wave').linearRampToValueAtTime(this.i['WAVE'].get(), audioContext.currentTime + 0.2);
    this.node.parameters.get('pw').linearRampToValueAtTime(this.i['PW'].get(), audioContext.currentTime + 0.2);
    this.node.parameters.get('amp').linearRampToValueAtTime(this.i['AMP'].get(), audioContext.currentTime + 0.2);

    this.node.parameters.get('cv_mod').linearRampToValueAtTime(this.i['CV'].mod, audioContext.currentTime + 0.2);
    this.node.parameters.get('fm_mod').linearRampToValueAtTime(this.i['FM'].mod, audioContext.currentTime + 0.2);
    this.node.parameters.get('wave_mod').linearRampToValueAtTime(this.i['WAVE'].mod, audioContext.currentTime + 0.2);
    this.node.parameters.get('pw_mod').linearRampToValueAtTime(this.i['PW'].mod, audioContext.currentTime + 0.2);
    this.node.parameters.get('amp_mod').linearRampToValueAtTime(this.i['AMP'].mod, audioContext.currentTime + 0.2);
  }

  draw_dbf() {
    this.update_params();
  }

  process() {

  }
}

engine.add_module_class(workletVCO);