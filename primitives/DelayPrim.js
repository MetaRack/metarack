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
    this.delay_line.set_feedback(this.fb);
    this.delay_line.set_dry_wet(this.dw);
    this.delay_line.set_delay_time(this.time);
    this.out = this.delay_line.process(this.in);
  }
}