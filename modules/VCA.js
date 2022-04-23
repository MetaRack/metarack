class VCA extends Module {
  constructor() {
    super({w:hp2px(4)});

    // this.level = new RawScope(0, 0, 20, 30);

    this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'CV'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
  }

  // draw(x, y, scale) {
  //   x += this.o['OUT'].get() * 0.05;
  //   y += this.o['OUT'].get() * 0.05;

  //   super.draw(x, y, scale);
  //   this.level.draw(x + this.x, y + this.y, scale);
  // }

  process() {
    this.o['OUT'].set( this.i['IN'].get() * this.i['CV'].get() );
    // this.level.process(this.i['CV'].get() * 20 - 10);
  }
}