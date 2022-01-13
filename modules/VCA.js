class VCA extends Module {
  constructor(name, freq, x=-1, y=-1, style = new ModuleStyle()) {
    super(name, x, y, 20, 70, style);

    this.level = new RawScope(0, 0, 20, 30);

    this.add_input(new Port(10, 38, 7, 'CV'));
    this.add_input(new Port(10, 50, 7, 'IN'));
    this.add_output(new Port(10, 62, 7, 'OUT'));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.level.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.o['OUT'].set( this.i['IN'].get() * this.i['CV'].get() );
    this.level.process(this.i['CV'].get() * 20 - 10);
  }
}