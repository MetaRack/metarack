class GateNoise extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 20, 70);
    this.scope = new RawScope(0, 0, 20, 30, 'scope', 20);
    this.holding = false;

    this.add_input(new Port({x:10, y:38, r:7, name:'GATE'}));
    this.add_input(new Port({x:10, y:50, r:7, name:'TYPE'}));
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
        this.o['OUT'].set( rackrand() * 20 - 10 );
        this.holding = true;
      }
    } else this.holding = false;
    this.scope.process( this.o['OUT'].get() )
  }
}


class Noise extends Module {
  constructor(name, x=-1, y=-1) {
    super(name, x, y, 20, 70);
    this.scope = new RawScope(0, 0, 20, 30, 'scope', 32);

    this.add_output(new Port({x:10, y:62, r:7, name:'OUT'}));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.o['OUT'].set( rackrand() * 20 - 10 );
    this.scope.process( this.o['OUT'].get() )
  }
}