class SampleAndHoldPrim {
  constructor() {
    // this.scope = new RawScope(0, 0, 20, 30);
    this.holding = false;

    // this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));
    // this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'IN'}));
    // this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    this.in = 0;
    this.gate = 0;
    this.out = 0;
  }

  // draw(x, y, scale) {
  //   x += this.o['OUT'].get() * 0.05;
  //   y += this.o['OUT'].get() * 0.05;

  //   super.draw(x, y, scale);
  //   this.scope.draw(x + this.x, y + this.y, scale);
  // }

  process() {
    if (this.gate > 1) {
      if (this.holding == false) {
        this.out = this.in;
        this.holding = true;
      }
    } else this.holding = false;
    //this.scope.process( this.o['OUT'].get() )
  }
}