class workletAudio extends Module {

  constructor(freq=120, _p5=rackp5) {
    super({w:hp2x(5), _p5:_p5});

    this.inputs = {
      'IN_L' : 0,
      'IN_R' : 1,
      'IN_NUM' : 2
    }

    this.node = new AudioWorkletNode(audioContext, 'audio', {numberOfInputs:this.inputs['IN_NUM'], numberOfOutputs:1, outputChannelCount:[2]});

    this.add_input(new Port({x:hp2x(0.5), y:8, r:9, vmin:0, vmax:10, val:1, name:'IN_L'}));
    this.add_input(new Port({x:hp2x(0.5), y:48, r:9, vmin:0, vmax:10, val:1, name:'IN_R'}));

    this.node.connect(audioContext.destination);
  }



  process() {

  }
}

engine.add_module_class(workletAudio);