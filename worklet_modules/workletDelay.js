class workletDelay extends Module {

  constructor() {
    super({w:hp2x(4)});

    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, val:1, vmin:0.001, vmax:10, name:'TIME'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:46, r:7, val:0, vmin: 0, vmax:1, name:'FB'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:66, r:7, val:1, vmin: 0, vmax:1, name:'D/W'}));
    this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));

    this.outputs = {
      'OUT' : 0,
      'OUT_NUM' : 1
    }

    this.inputs = {
      'IN' : 0,
      'TIME' : 1,
      'FB' : 2,
      'D/W' : 3,
      'IN_NUM' : 4
    }

    this.node = new AudioWorkletNode(audioContext, 'delay', {numberOfInputs:this.inputs['IN_NUM'], numberOfOutputs:this.outputs['OUT_NUM']});
  }

  update_params() {
    this.node.parameters.get('time').linearRampToValueAtTime(this.i['TIME'].get(), audioContext.currentTime + 0.2);
    this.node.parameters.get('fb').linearRampToValueAtTime(this.i['FB'].get(), audioContext.currentTime + 0.2);
    this.node.parameters.get('dw').linearRampToValueAtTime(this.i['D/W'].get(), audioContext.currentTime + 0.2);

    this.node.parameters.get('time_mod').linearRampToValueAtTime(this.i['TIME'].mod, audioContext.currentTime + 0.2);
    this.node.parameters.get('fb_mod').linearRampToValueAtTime(this.i['FB'].mod, audioContext.currentTime + 0.2);
    this.node.parameters.get('dw_mod').linearRampToValueAtTime(this.i['D/W'].mod, audioContext.currentTime + 0.2);
  }

  draw_dbf() {
    this.update_params();
  }

  process() {
  }
}

engine.add_module_class(workletDelay);