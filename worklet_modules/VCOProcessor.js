class VCOProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [
      {name:'frequency', defaultValue:261.63, minValue:1, maxValue:1000},
      {name:'cv', defaultValue:0, minValue:-10, maxValue:10},
      {name:'fm', defaultValue:0, minValue:-10, maxValue:10},
      {name:'wave', defaultValue:0, minValue:-10, maxValue:10},
      {name:'pw', defaultValue:0.5, minValue:0, maxValue:1},
      {name:'amp', defaultValue:1, minValue:0, maxValue:1},
      {name:'cv_mod', defaultValue:0, minValue:-1, maxValue:1},
      {name:'fm_mod', defaultValue:0, minValue:-1, maxValue:1},
      {name:'wave_mod', defaultValue:0, minValue:-1, maxValue:1},
      {name:'pw_mod', defaultValue:0, minValue:-1, maxValue:1},
      {name:'amp_mod', defaultValue:0, minValue:-1, maxValue:1},
      {name:'isPresent', defaultValue:1, minValue:0, maxValue:1}
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

    this.fm_mod = 0;
    this.wave_mod = 0;
    this.amp_mod = 0;
    this.pw_mod = 0;
    this.cv_mod = 0;

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

    this.output;
    this.outputChannel;

    this.input;
    this.inputChannel;

    this.buf = [0, 0, 0, 0, 0];
  }

  set_frequency(f) {
    this.freq = this.clamp(f, 0.001, 20000);
    this.delta = Math.PI * 2 / (sampleRate / f);
    this.mod = this._alpha * (this.cv + this.fm) + (1 - this._alpha) * this.mod;
    this.phase_inc = this.delta * Math.pow(2, this.mod);
  }

  set_wave(v) {
    this.wave = v;
    this.type = this.wave / 10;
  }

  clamp(x, a, b) {
    if (x < a) {
      return a;
    }
    else if (x > b) {
      return b;
    } else {
      return x;
    }
  }

  update_params(parameters, input) {
    this.cv_mod = parameters.cv_mod[0];
    this.fm_mod = parameters.fm_mod[0];
    this.amp_mod = parameters.amp_mod[0];
    this.pw_mod = parameters.pw_mod[0];
    this.wave_mod = parameters.wave_mod[0];

    this.cv = this.clamp(parameters.cv[0] + this.cv_mod * input[0], -10, 10);
    this.fm = this.clamp(parameters.fm[0] + this.fm_mod * input[1], -10, 10);
    this.wave = this.clamp(parameters.wave[0] + this.wave_mod * input[2], -10, 10);
    this.pw = this.clamp(parameters.pw[0] + this.pw_mod * input[3], 0, 1);
    this.amp = this.clamp(parameters.amp[0] + this.amp_mod * input[4], 0, 1);

    this.set_frequency(parameters.frequency[0]);
  }

  process (inputs, outputs, parameters) {

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
        
        for (this.j = 0; this.j < inputs.length; this.j++) {
          if (inputs[this.j].length > 0) {
            this.buf[this.j] = inputs[this.j][0][this.i]
          }
          else {
            this.buf[this.j] = 0;
          }
        }

        this.update_params(parameters, this.buf);

        channel[this.i] = this.out;
        
        // this.phase_inc_send += this.phase_inc;
        // this.out_send += this.out;
        // if ((this.i % 10) == 0) {
        //   this.buf.push([this.phase_inc_send, this.out]);
        //   this.phase_inc_send = 0;
        //   this.out_send = 0;
        // }
        // if (this.buf.length > 100) {
        //   this.port.postMessage(this.buf);
        //   this.buf = [];
        // }
        this.phase += this.phase_inc;
        if (this.phase > Math.PI * 2) {
          this.phase -= Math.PI * 2;
        }

      }
    })

    return (parameters.isPresent[0] == 1);
  }
}

registerProcessor('vco', VCOProcessor)