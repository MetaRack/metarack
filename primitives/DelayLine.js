class DelayLine {
  constructor(max_time) {
    this.max_samples = Math.floor(max_time * sample_rate);
    this.pos = 0;
    this.buffer = [];
    this.dry_wet_ratio = 1;
    this.return = 0;
    this.delay_time = Math.min(1000, this.max_samples);
    this.feedback = 0.5;
    for (var i = 0; i < this.max_samples; i ++) this.buffer[i] = 0;
    this.last_wet = 0;
    this.dry = 0;
  }

  crossFade(a, b, p) {
    return a + (b - a) * p;
  }

  set_feedback(feedback) {
    if (feedback < 0) feedback = 0;
    if (feedback > 1) feedback = 1;
    this.feedback = feedback;
  }

  set_delay_time(t) {
    t = Math.floor(t * sample_rate);
    if (t < 1) t = 1;
    if (t > this.max_samples - 1) t = this.max_samples - 1;
    this.delay_time = t;
  }

  set_dry_wet(dw) {
    if (dw < 0) dw = 0;
    if (dw > 1) dw = 1;
    this.dry_wet_ratio = dw;
  }

  process(sample) {
    this.dry = sample / 2 + this.feedback * this.last_wet / 2;
    this.wet = this.buffer[this.pos];
    this.buffer[this.pos] = this.dry;
    this.pos = (this.pos + 1) % this.delay_time;
    this.return = this.crossFade(this.dry, this.wet, this.dry_wet_ratio);
    this.last_wet = this.wet;
    return this.return; 
  }
}

class InterpDelayLine {
  constructor(max_time) {
    this.delay = new InterpDelay(max_time * sample_rate, 100);
    this.dry_wet_ratio = 1;
    this.return = 0;
    this.feedback = 0.5;
    for (var i = 0; i < this.max_samples; i ++) this.buffer[i] = 0;
    this.last_wet = 0;
    this.dry = 0;
  }

  crossFade(a, b, p) {
    return a + (b - a) * p;
  }

  set_feedback(feedback) {
    if (feedback < 0) feedback = 0;
    if (feedback > 1) feedback = 1;
    this.feedback = feedback;
  }

  set_delay_time(t) {
    this.delay.setDelayTime(t * sample_rate);
  }

  set_dry_wet(dw) {
    if (dw < 0) dw = 0;
    if (dw > 1) dw = 1;
    this.dry_wet_ratio = dw;
  }

  process(sample) {
    this.dry = sample / 2 + this.feedback * this.last_wet / 2;
    this.delay.input = this.dry;
    this.wet = this.delay.process();
    this.return = this.crossFade(sample, this.wet, this.dry_wet_ratio);
    this.last_wet = this.wet;
    return this.return; 
  }
}