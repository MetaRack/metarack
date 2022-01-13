class LadderFilter {

	constructor() {
		this.omega0 = 0;
		this.resonance = 0.1;
		this.state = new Array(4);
		this.input = 0;
    this.prev_input = 0;
    this.output = 0;
		this.reset();
		this.setCutoffFreq(0);

    this.k1 = new Array(4);
    this.k2 = new Array(4);
    this.k3 = new Array(4);
    this.k4 = new Array(4);
    this.yi = new Array(4);

    this.inputt = 0;
    this.inputc = 0;

    this.yc0 = 0;
    this.yc1 = 0;
    this.yc2 = 0;
    this.yc3 = 0;

    this.dt = 1.0 / sample_rate;
	}

	reset() {
		for (var i = 0; i < 4; i++) {
			this.state[i] = 0;
		}
	}

	setCutoffFreq(cutoff) {
    if (cutoff > 0.18 * sample_rate) cutoff = 0.18 * sample_rate;
    if (cutoff < 1) cutoff = 1;
		this.omega0 = 2 * Math.PI * cutoff;
	}

  setResonance(res) {
    this.resonance = Math.pow(res, 2) * 10;
  }

  clip(x) {
    if (x < -3) x = -3;
    if (x > 3) x = 3;
    return x * (27 + x * x) / (27 + 9 * x * x);
  }

  f(t, x, dxdt) {
    this.inputt = this.prev_input + (this.input - this.prev_input) * t / this.dt;
    this.inputc = this.clip(this.inputt - this.resonance * x[3]);
    this.yc0 = this.clip(x[0]);
    this.yc1 = this.clip(x[1]);
    this.yc2 = this.clip(x[2]);
    this.yc3 = this.clip(x[3]);

    dxdt[0] = this.omega0 * (this.inputc - this.yc0);
    dxdt[1] = this.omega0 * (this.yc0 - this.yc1);
    dxdt[2] = this.omega0 * (this.yc1 - this.yc2);
    dxdt[3] = this.omega0 * (this.yc2 - this.yc3);
  }

  stepRK4(dt, len) {
    this.f(0, this.state, this.k1);

    for (var i = 0; i < len; i++) {
      this.yi[i] = this.state[i] + this.k1[i] * dt / 2;
    }
    this.f(dt / 2, this.yi, this.k2);

    for (var i = 0; i < len; i++) {
      this.yi[i] = this.state[i] + this.k2[i] * dt / 2;
    }
    this.f(dt / 2, this.yi, this.k3);

    for (var i = 0; i < len; i++) {
      this.yi[i] = this.state[i] + this.k3[i] * dt;
    }
    this.f(dt, this.yi, this.k4);

    for (var i = 0; i < len; i++) {
      this.state[i] += dt * (this.k1[i] + 2 * this.k2[i] + 2 * this.k3[i] + this.k4[i]) / 6;
    }
}

	process() {
		this.stepRK4(this.dt, 4);
		this.prev_input = this.input; 
	}

	lowpass() {
		return this.state[3];
	}

	highpass() {
		return this.clip((this.input - this.resonance * this.state[3]) - 4 * this.state[0] + 6 * this.state[1] - 4 * this.state[2] + this.state[3]);
	}
};