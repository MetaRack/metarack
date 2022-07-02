class audioProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [
      {name:'isPresent', defaultValue:1, minValue:0, maxValue:1}
    ]
  }

  constructor() {
    super();

    this.i = 0;
    this.j = 0;
  }

  process (inputs, outputs, parameters) {

    this.output_l = outputs[0][0];
    this.output_r = outputs[0][1];

    for (this.j = 0; this.j < this.output_l.length; this.j++) {

      if (inputs[0].length > 0) {
        this.output_l[this.j] = inputs[0][0][this.j];
        if (inputs[1].length == 0) {
          this.output_r[this.j] = inputs[0][0][this.j];
        }
        else {
          this.output_r[this.j] = inputs[1][0][this.j];
        }
      }
    }
    

    return (parameters.isPresent[0] == 1);
  }
}

registerProcessor('audio', audioProcessor)