class BernoulliGate extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 20, 70);
    this.scope = new RawScope(0, 0, 20, 30);
    this.gate = 0;
    this.last_gate = 0;
    this.state = -10;

    this.add_input(new Port({x:10, y:38, r:7, name:'IN'}));
    this.add_input(new Port({x:10, y:50, r:7, name:'P'}));
    this.add_output(new Port({x:10, y:62, r:7, name:'OUT'}));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.gate = this.i['IN'].get();
    if ((this.last_gate < 0 && this.gate > 0) && (rackrand() < (this.i['P'].get() / 10))) this.state = 10;
    if (this.last_gate > 0 && this.gate < 0) this.state = -10;
    this.o['OUT'].set( this.state );
    this.last_gate = this.gate;
    this.scope.process( this.o['OUT'].get() )
  }
}