class workletVCO extends Module {

  constructor(freq=120, _p5=rackp5) {
    super({w:hp2x(10), _p5:_p5});
    this.out = 0;
    this.VCONode = new AudioWorkletNode(audioContext, 'vco');
    this.flag = true;

    this.scope = new RawScope({x: this.w * 0.05, y:this.h * 0.05, w:this.w - this.w * 0.1, h:this.h*0.25, size:30, divider:64});
    this.attach(this.scope);

    this.delta = Math.PI * 2 / (sample_rate / freq);
    this.phase = 0;

    let cv = 0.0001;
    this.add_control(new Encoder({x:hp2x(1), y:42, r:9, val: cv, vmin:-10, name:'CV'}));
    this.add_control(new Encoder({x:hp2x(5.5), y:42, r:9, val: 0, name:'FM'}));
    this.add_control(new Encoder({x:hp2x(1), y:70, r:9, vmin:-10, val:0, name:'WAVE'})); //-10 + rackrand() * 20, name:'WAVE'}));
    this.add_control(new Encoder({x:hp2x(5.5), y:70, r:9, vmin:0, vmax:1, val:0.5, name:'PW'}));
    this.add_control(new Encoder({x:hp2x(1), y:98, r:9, vmin:0, vmax:1, val:1, name:'AMP'}));
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
    this.VCONode.parameters.get('cv').linearRampToValueAtTime(this.c['CV'].get(), audioContext.currentTime + 0.2);
    this.VCONode.parameters.get('fm').linearRampToValueAtTime(this.c['FM'].get(), audioContext.currentTime + 0.2);
    this.VCONode.parameters.get('wave').linearRampToValueAtTime(this.c['WAVE'].get(), audioContext.currentTime + 0.2);
    this.VCONode.parameters.get('pw').linearRampToValueAtTime(this.c['PW'].get(), audioContext.currentTime + 0.2);
    this.VCONode.parameters.get('amp').linearRampToValueAtTime(this.c['AMP'].get(), audioContext.currentTime + 0.2);
  }

  draw_dbf() {
    this.update_params();
    this.VCONode.port.postMessage('now');
    this.VCONode.port.onmessage = (e) => {
      for (this.j = 0; this.j < e.data.length; this.j++) {
        this.phase += e.data[this.j][0];
        this.scope.process(e.data[this.j][1]);
        if (this.phase > Math.PI * 2) {
          this.phase -= Math.PI * 2;
          this.scope.trig();
        }
      }
    }
  }

  process() {

  }
}

engine.add_module_class(workletVCO);