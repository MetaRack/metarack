class OneSampleDelay {
  constructor() {
    this.in = 0;
    this.prev_in = 0;
    this.out = 0;
  }
  process() {
    this.out = this.prev_in;
    this.prev_in = this.in;
  }
}

class SampleDelay {
  constructor(delay = 5) {
    this.in = 0;
    this.delay = delay;
    this.prev_in = new Array(Math.floor(this.delay));

    for (var i = 0; i < this.delay; i++) {
      this.prev_in[i] = 0;
    }

    this.out = 0;
  }
  process() {
    this.out = this.prev_in[this.delay - 1];

    for (var i = this.delay - 1; i > 0; i--) {
        this.prev_in[i] = this.prev_in[i - 1];
    }
    this.prev_in[0] = this.in;
  }
}

class BigSampleDelay {
  constructor(delay = 50) {
    this.max_buf = 2000;
    this.in = 0;
    this.delay = delay;
    this.buf = new Array(this.max_buf);
    this.begin = 0;
    this.end = delay - 1;
    this.prev_delay = delay;

    for (var i = 0; i < this.max_buf; i++) {
      this.buf[i] = 0;
    }

    this.out = 0;
  }
  process() {
    if (this.prev_delay != this.delay) {
        this.begin = (this.end - this.delay + 1) % this.max_buf;
        if (this.begin < 0) this.begin += this.max_buf;
        // for (var i = 0; i < this.max_buf; i++) {
        //   this.buf[i] = 0;
        // }
    }
    this.out = this.buf[Math.floor(this.begin)];
    this.begin += 1;
    this.buf[Math.floor(this.end)] = this.in;
    this.end += 1;

    this.begin %= this.max_buf;
    this.end %= this.max_buf;
    this.prev_delay = this.delay;
  }
}
