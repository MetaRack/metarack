class Delay extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 30, 70);

    this.delay_line = new InterpDelayLine(10);

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

    this.add_input(new Port(8, 38, 7, 'TIME'));
    this.add_input(new Port(22, 38, 7, 'FB'));
    this.add_input(new Port(8, 50, 7, 'D/W'));
    this.add_input(new Port(8, 62, 7, 'IN'));
    this.add_output(new Port(22, 62, 7, 'OUT'));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.delay_line.set_feedback( (this.i['FB'].get() + 10) / 20 );
    this.delay_line.set_dry_wet( (this.i['D/W'].get() + 10) / 20 );
    this.delay_line.set_delay_time( (this.i['TIME'].get() + 10) / 20 * 10);
    this.o['OUT'].set( this.delay_line.process( this.i['IN'].get() ) );
    this.scope.process( this.o['OUT'].get() );
  }
}