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
    this.max_buf = 44100;
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

class SmoothSampleDelay {
  constructor(delay = 50) {
    this.max_buf = 44100;
    this.in = 0;
    this.delay = delay;
    this.buf = new Array(this.max_buf);
    this.begin = 0;
    this.end = delay - 1;
    this.prev_delay = delay;
    this.consume_flag = false;
    this.consume_begin = 0;
    this.consume_amount = 0;

    for (var i = 0; i < this.max_buf; i++) {
      this.buf[i] = 0;
    }

    this.out = 0;
  }

  consume() {
    if (this.consume_amount > 0) {
      this.out = this.buf[Math.floor(this.consume_begin)];
      this.consume_begin += 2;
      this.consume_begin %= this.max_buf;
      this.consume_amount -= 2;
      if (this.consume_amount < 0) this.consume_flag = false;
    }
    else
    {
      this.out = this.buf[Math.floor(this.consume_begin)];
      this.consume_begin -= 2;
      if (this.consume_begin < 0) this.consume_begin += this.max_buf;
      this.consume_amount += 2;
      if (this.consume_amount > 0) this.consume_flag = false;
    }
  }

  process() {
    if (this.consume_flag) this.consume();

    if (this.prev_delay != this.delay) {
        this.consume_amount = this.prev_delay - this.delay;
        //console.log(this.consume_amount);
        // if (this.prev_delay > this.delay)
        //   this.consume_dir = true;
        // else
        //   this.consume_dir = false;
        this.prev_delay = this.delay;
        this.consume_flag = true;
        this.consume_begin = this.begin;
        //console.log(this.consume_begin);
        this.begin = (this.end - this.delay + 1) % this.max_buf;
        if (this.begin < 0) this.begin += this.max_buf;
        //console.log(this.begin);
    }
    else {
      this.begin += 1;
      this.begin %= this.max_buf;
    }
    if (isNaN(this.out)) console.log('Yes')
    this.out = this.buf[Math.floor(this.begin)];
    this.buf[Math.floor(this.end)] = this.in;
    this.end += 1;

    this.begin %= this.max_buf;
    this.end %= this.max_buf;
    //this.prev_delay = this.delay;
    //this.prev_delay -= 1 * Math.sign(this.prev_delay - this.delay);
  }
}
