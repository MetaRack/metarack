class SampleAndHold extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 20, 70);
    this.scope = new RawScope(0, 0, 20, 30);
    this.holding = false;

    this.add_input(new Port({x:10, y:38, r:7, name:'GATE'}));
    this.add_input(new Port({x:10, y:50, r:7, name:'IN'}));
    this.add_output(new Port({x:10, y:62, r:7, name:'OUT'}));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    if (this.i['GATE'].get() > 0) {
      if (this.holding == false) {
        this.o['OUT'].set( this.i['IN'].get() );
        this.holding = true;
      }
    } else this.holding = false;
    this.scope.process( this.o['OUT'].get() )
  }
}