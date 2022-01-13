class InterpDelay {
  constructor(max_time, init_time) {
    this.input = 0;
    this.output = 0;

    this.l = Math.floor(max_time);
    // console.log(max_time, this.l);
    this.buffer = new Array(this.l);
    this.clear();
    this.w = 0;
    this.t = Math.floor(init_time);
    this.f = Math.floor(init_time) - this.t;

    this.r = 0;
    this.upperR = 0;

    this.j = 0;

    // this.setDelayTime(init_time);
  }

  tap(i) {
    this.j = this.w - Math.floor(i);
    if (this.j < 0) {
      this.j += this.l;
    }
    return this.buffer[this.j];
  }

  setDelayTime(newDelayTime) {
    if (newDelayTime >= this.l) {
      newDelayTime = this.l - 1;
    }
    if (newDelayTime < 0) {
      newDelayTime = 0;
    }
    this.t = Math.floor(newDelayTime);
    this.f = newDelayTime - this.t;
  }

  clear() {
    for (var i = 0; i < this.l; i ++) this.buffer[i] = 0;
    this.input = 0;
    this.output = 0;
  }

  process() {
    this.buffer[this.w] = this.input;
    this.r = this.w - this.t;
    if (this.r < 0) this.r += this.l;

    this.w ++;
    if (this.w == this.l) this.w = 0;

    this.upperR = this.r - 1;
    if (this.upperR < 0) this.upperR += this.l;

    this.output = this.buffer[this.r] + this.f * (this.buffer[this.upperR] - this.buffer[this.r]);
    return this.output;
  }
}


class MultiTapInterpDelay {
  constructor(maxLength, initDelayTimes) {
    this.input = 0;
    this.output = 0;

    this.numTaps = initDelayTimes.length;

    this.l = Math.floor(maxLength);
    this.buffer = new Array(this.l);
    this.clear();

    this.w = 0;
    this.t = new Array(this.numTaps);
    this.f = new Array(numTaps);

    for (var tap = 0; tap < this.numTaps; ++tap) {
      this.output[tap] = 0;
      this.f[tap] = 0;
      this.t[tap] = 0;
    }

    this.setDelayTimes(initDelayTimes);

    this.w = 0;
    this.t = 0;
    this.f = 0;

    this.r = 0;
    this.upperR = 0;
    this.newT = 0;
  }

  tap(i) {
    let j = this.w - i;
    if (j < 0) {
      j += this.l;
    }
    return this.buffer[j];
  }

  setDelayTimes(newDelayTimes) {
    for (var tap = 0; tap < this.numTaps; ++tap) {
      this.newT = newDelayTimes[tap];
      this.t[tap] = Math.floor(this.newT);
      this.f[tap] = this.newT - Math.floor(this.t[tap]);
    }
  }

  setDelayTime(tap, newDelayTime) {
    if (newDelayTime >= this.l) {
      newDelayTime = this.l - 1;
    }
    if (newDelayTime < 0) {
      newDelayTime = 0;
    }
    this.t[tap] = Math.floor(newDelayTime);
    this.f[tap] = newDelayTime - this.t[tap];
  }

  clear() {
    for (var i = 0; i < this.l; i ++) this.buffer[i] = 0;
    this.input = 0;
    for (var i = 0; i < this.numTaps; i ++) this.output[i] = 0;
  }

  process() {
    this.buffer[this.w] = this.input;
    for (var tap = 0; tap < this.numTaps; ++tap) {
      this.r = this.w - this.t[tap];
      if (this.r < 0) this.r += this.l;

      this.upperR = this.r - 1;
      if (this.upperR < 0) this.upperR += this.l;
      this.output[tap] = this.buffer[r] + this.f[tap] * (this.buffer[this.upperR] - this.buffer[r]);
    }

    this.w ++;
    if (this.w == this.l) this.w = 0;
    return this.output;
  }
}