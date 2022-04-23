class VCA extends Module {
  constructor() {
    super({w:hp2px(4)});

    // this.level = new RawScope(0, 0, 20, 30);
    this.add_control(new Encoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:10, val:10, name:'VOL'}));
    this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'CV', default_value: 10}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    // this.led = new Led({x:hp2px(0.8), y:28, r:3});
    // this.led.set(0);
    // this.attach(this.led);

    // this.button = new Button({x:hp2px(0.8), y:28, r:6});
    // this.attach(this.button);
  }

  // draw(x, y, scale) {
  //   x += this.o['OUT'].get() * 0.05;
  //   y += this.o['OUT'].get() * 0.05;

  //   super.draw(x, y, scale);
  //   this.level.draw(x + this.x, y + this.y, scale);
  // }

  process() {
    //this.led.set(this.button.get() * 255);
    this.o['OUT'].set( this.i['IN'].get() * (Math.log(this.c['VOL'].get()/10 * this.i['CV'].get()/10 + 1)) );
    // this.level.process(this.i['CV'].get() * 20 - 10);
  }
}