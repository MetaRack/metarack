class MixerProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [
      {name:'amp1', defaultValue:1, minValue:0, maxValue:1},
      {name:'amp2', defaultValue:1, minValue:0, maxValue:1},
      {name:'amp3', defaultValue:1, minValue:0, maxValue:1},
      {name:'amp4', defaultValue:1, minValue:0, maxValue:1},
    ]
  }

  constructor() {
    super();
    this.out = 0;
    this.amp = new Array(4);
    this.in = new Array(4);
    this.i = 0;
    this.j = 0;

    this.output = [];
    this.outputChannel = [];

    this.input = [];
    this.inputChannel = [];
  }

  process (inputs, outputs, parameters) {


    this.output = outputs[0];
    this.outputChannel = this.output[0];

    this.amp[0] = parameters.amp1[0];
    this.amp[1] = parameters.amp2[0];
    this.amp[2] = parameters.amp3[0];
    this.amp[3] = parameters.amp4[0];

    for (this.i = 0; this.i < this.outputChannel.length; this.i++)
    {
      this.out = 0;
      for (this.j = 0; this.j < inputs.length; this.j++) {
        this.input = inputs[this.j];
        if (this.input.length > 0) {
          this.inputChannel = this.input[0];
          if (this.i < this.inputChannel.length)
            this.out += this.inputChannel[this.i] / inputs.length;
        }
      }

      this.outputChannel[this.i] = this.out;
    }

    return true;
  }
}

registerProcessor('mixer', MixerProcessor);