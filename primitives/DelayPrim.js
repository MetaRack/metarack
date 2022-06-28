class DelayPrim {
	constructor() {
    this.delay_line = new InterpDelayLine(10);

    this.time = 1;
    this.fb = 0;
    this.dw = 1;
    this.in = 0;
    this.out = 0;
  }

  process() {
    if (this.dw < 0) this.dw = 0;
    if (this.dw > 1) this.dw = 1;

    if (this.fb < 0) this.fb = 0;
    if (this.fb > 1) this.fb = 1;

    if (this.time < 0.001) this.time = 0.001;
    if (this.time > 9.9) this.time = 9.9;

    this.delay_line.set_feedback(this.fb);
    this.delay_line.set_dry_wet(this.dw);
    this.delay_line.set_delay_time(this.time);
    this.out = this.delay_line.process(this.in);
  }
}