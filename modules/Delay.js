class Delay extends Module {
  constructor() {
    super({w:hp2px(4)});

    this.delay_line = new InterpDelayLine(10);

    this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, name:'TIME'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, name:'FB'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:66, r:7, name:'D/W'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 2;
    let rounding = 5;
    buf.stroke(60); buf.strokeWeight(sw); buf.fill(255);
    buf.rect(sw + w * 0.05, sw + 30, w * 0.9 - 2 * sw, h * 0.15 - 2 * sw, rounding, rounding, rounding, rounding);
  }

  process() {
    this.delay_line.set_feedback( (this.i['FB'].get() + 10) / 20 );
    this.delay_line.set_dry_wet( (this.i['D/W'].get() + 10) / 20 );
    this.delay_line.set_delay_time( (this.i['TIME'].get() + 10) / 20 * 10);
    this.o['OUT'].set( this.delay_line.process( this.i['IN'].get() ) );
  }
}