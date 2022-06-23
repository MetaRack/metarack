class VCOProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [
      {name:'frequency', defaultValue:261.63, minValue:1, maxValue:1000},
      {name:'cv', defaultValue:0, minValue:-10, maxValue:10},
      {name:'fm', defaultValue:0, minValue:-10, maxValue:10},
      {name:'wave', defaultValue:0, minValue:-10, maxValue:10},
      {name:'pw', defaultValue:0.5, minValue:0, maxValue:1},
      {name:'amp', defaultValue:1, minValue:0, maxValue:1},
    ]
  }

  constructor() {
    super();

    this.freq = 261.63;
    this.delta = Math.PI * 2 / (sampleRate / this.freq);
    this.phase = 0;

    this.value = 0;
    this.fm = 0;
    this.wave = 0;
    this.amp = 1;
    this.pw = 0;
    this.cv = 0;
    this.type = 0;
    this.mod = 0;
    this.mod_prev = 0;
    this.phase_mod = 0;
    this.phase_inc = this.delta;
    this._alpha = 0.01;

    this.out = 0;

    this.i = 0;
    this.j = 0;

    this.phase_inc_send = 0;
    this.out_send = 0;

    this.output = 0;
    this.outputChannel = 0;

    this.input = 0;
    this.inputChannel = 0;

    this.buf = [];
    for (this.j = 0; this.j < 800; this.j++) {
      this.buf[this.j] = 0;
    }

    // this.port.onmessage = (e) => {
    //   this.port.postMessage(this.buf);
    //   this.buf = [];
    // }
  }

  set_frequency(f) {
    this.freq = f;
    this.delta = Math.PI * 2 / (sampleRate / f);
    this.mod = this._alpha * (this.cv + this.fm) + (1 - this._alpha) * this.mod;
    this.phase_inc = this.delta * Math.pow(2, this.mod);
  }

  set_wave(v) {
    this.wave = v;
    this.type = this.wave / 10;
  }

  update_params(parameters) {
    this.cv = parameters.cv;
    this.fm = parameters.fm;
    this.amp = parameters.amp;
    this.pw = parameters.pw;

    this.set_wave(parameters.wave);
    this.set_frequency(parameters.frequency);
  }

  process (inputs, outputs, parameters) {

    this.cv = parameters.cv[0];
    this.fm = parameters.fm[0];
    this.amp = parameters.amp[0];
    this.pw = parameters.pw[0];

    this.wave = parameters.wave[0];
    this.set_frequency(parameters.frequency[0]);

    this.output = outputs[0];

    this.output.forEach(channel => {
      for (this.i = 0; this.i < channel.length; this.i++) {

        this.type = this.wave / 10;
        if (this.type >= 0) {
          this.value = Math.sin(this.phase + this.phase_mod) * (1 - this.type) + ((this.phase + this.phase_mod) / Math.PI - 1) * this.type;
        } else {
          this.value = Math.sin(this.phase + this.phase_mod) * (1 + this.type) - (((this.phase + this.phase_mod) < Math.PI * this.pw * 2 ) * 2 - 1) * this.type;
        }

        this.out = this.value * this.amp;
        this.mod = this._alpha * (this.cv + this.fm) + (1 - this._alpha) * this.mod;
        if (this.mod != this.mod_prev) { this.phase_inc = this.delta * Math.pow(2, this.mod); this.mod_prev = this.mod; }
        
        channel[this.i] = this.out;
        
        this.phase_inc_send += this.phase_inc;
        this.out_send += this.out;
        if ((this.i % 10) == 0) {
          this.buf.push([this.phase_inc_send, this.out]);
          this.phase_inc_send = 0;
          this.out_send = 0;
        }
        if (this.buf.length > 100) {
          this.port.postMessage(this.buf);
          this.buf = [];
        }
        this.phase += this.phase_inc;
        if (this.phase > Math.PI * 2) {
          this.phase -= Math.PI * 2;
        }

      }
    })

    return true;
  }
}

registerProcessor('vco', VCOProcessor);