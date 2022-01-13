class AllPassFilter {
  constructor(maxDelay, initDelay, gain) {
    this.delay = new InterpDelay(maxDelay, initDelay);
    this.gain = gain;

    this.input = 0;
    this.output = 0;
    this._inSum = 0;
    this._outSum = 0;
    this.clear();
  }

  clear() {
    this.input = 0;
    this.output = 0;
    this._inSum = 0;
    this._outSum = 0;
    this.delay.clear();
  }

  process() {
    this._inSum = this.input + this.delay.output * this.gain;
    this.output = this.delay.output - this._inSum * this.gain;
    this.delay.input = this._inSum;
    this.delay.process();
    return this.output;
  }
}


class MultiTapAllPassFilter {
  constructor(maxDelay, initTimes, gain) {
    this.delay = new MultiTapInterpDelay(maxDelay, initTimes);
    this.gain = gain;

    this.input = 0;
    this.output = 0;
    this._inSum = 0;
    this._outSum = 0;
    this.clear();
  }

  clear() {
    this.input = 0;
    this.output = 0;
    this._inSum = 0;
    this._outSum = 0;
    this.delay.clear();
  }

  process() {
    this._inSum = this.input + this.delay.output[0] * this.gain;
    this.output = this.delay.output[0] - this._inSum * this.gain;
    this.delay.input = this._inSum;
    this.delay.process();
    return this.output;
  }
}