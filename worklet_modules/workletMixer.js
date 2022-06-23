class workletMixer extends Module {

  constructor(freq=120, _p5=rackp5) {
    super({w:hp2x(13), _p5:_p5});

    this.MixerNode = new AudioWorkletNode(audioContext, 'mixer', {numberOfInputs:num});
    this.flag = true;

    
    this.amp = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.add_input(new Port({x:hp2x(0.6 + i*3), y:36, r:7, default_value:0, name:`IN${i+1}`}));
      this.add_control(new Encoder({x:hp2x(0.6 + i*3), y:11, r:7, vmin:0, vmax:1, val:1, name:`AMP${i+1}`}));
      this.amp[i] = this.c[`AMP${i+1}`].get();
    }
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.value = 0;
  }

  set_frequency(f) {
    this.freq = f;
    this.delta = Math.PI * 2 / (sample_rate / f);
  }

  update_params() {
    this.MixerNode.parameters.get('amp1').linearRampToValueAtTime(this.c['AMP1'].get(), audioContext.currentTime + 0.2);
    this.MixerNode.parameters.get('amp2').linearRampToValueAtTime(this.c['AMP2'].get(), audioContext.currentTime + 0.2);
    this.MixerNode.parameters.get('amp3').linearRampToValueAtTime(this.c['AMP3'].get(), audioContext.currentTime + 0.2);
    this.MixerNode.parameters.get('amp4').linearRampToValueAtTime(this.c['AMP4'].get(), audioContext.currentTime + 0.2);
  }

  draw_dbf() {
    this.update_params();
  }

  process() {

  }
}

engine.add_module_class(workletMixer);