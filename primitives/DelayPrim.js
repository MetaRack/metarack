class DelayPrim {
	constructor() {
    this.delay_line = new InterpDelayLine(10);

    this.time = 0;
    this.fb = 0;
    this.dw = 0;
    this.in = 0;
    this.out = 0;
  }

  process() {
    this.delay_line.set_feedback( (this.fb + 10) / 20 );
    this.delay_line.set_dry_wet( (this.dw + 10) / 20 );
    this.delay_line.set_delay_time( (this.time + 10) / 20 * 10);
    this.out = this.delay_line.process( this.in );
  }
}