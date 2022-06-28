class DattorroReverbPrim {
  constructor() {
    this.dw = 0;
    this.size = 0;
    this.decay = 0;
    this.in_l = 0;
    this.in_r = 0;
    this.out_l = 0;
    this.out_r = 0;

    this.dattorro = new DattorroReverbProcessor();
    this.dattorro.decay = 0.9;
  }

  process() {
    if (this.dw < 0) this.dw = 0;
    if (this.dw > 1) this.dw = 1;

    if (this.size < 0) this.size = 0;
    if (this.size > 1) this.size = 1;

    if (this.decay < 0) this.decay = 0;
    if (this.decay > 1) this.decay = 1;

    // this.dw = this.dw**2;
    // this.size = this.size**2;
    // this.decay = this.decay;

    this.dattorro.setTimeScale(this.size);
    this.dattorro.decay = this.decay;
    this.dattorro.inputL = this.in_l;
    this.dattorro.inputR = this.in_r;
    this.dattorro.process();

    this.out_l = this.dattorro.inputL + (this.dattorro.outputL - this.dattorro.inputL) * this.dw;
    this.out_r = this.dattorro.inputR + (this.dattorro.outputR - this.dattorro.inputR) * this.dw;
  }
}