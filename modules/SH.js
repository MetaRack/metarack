class SampleAndHold extends Module {
  constructor() {
    super({name:'S&H', w:hp2px(4)});
    // this.scope = new RawScope(0, 0, 20, 30);
    this.holding = false;

    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));
    this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
  }

  // draw(x, y, scale) {
  //   x += this.o['OUT'].get() * 0.05;
  //   y += this.o['OUT'].get() * 0.05;

  //   super.draw(x, y, scale);
  //   this.scope.draw(x + this.x, y + this.y, scale);
  // }

  process() {
    if (this.i['GATE'].get() > 0) {
      if (this.holding == false) {
        this.o['OUT'].set( this.i['IN'].get() );
        this.holding = true;
      }
    } else this.holding = false;
    //this.scope.process( this.o['OUT'].get() )
  }
}

engine.add_module_class(SampleAndHold);