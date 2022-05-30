class JSModule extends Module {
  constructor() {
    super({w:hp2x(4)});
    this.add_input(new InputEncoder({x:hp2x(0.5), y:hp2y(0.20), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'IN'}));
    this.add_control(new Encoder({x:hp2x(0.5), y:hp2y(0.33), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'CNTRL'}));
    this.add_output(new Port({x:hp2x(0.5), y:hp2y(0.50), r:hp2x(1), name:'OUT'}));
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    // draw constant buffer
    // once a time
    // e.g buf.rect(...);
  }

  draw_sbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    // draw static buffer
    // when this.changed==true
    // e.g buf.rect(...);
  }

  draw_dbf(buf, x, y, w, h) {
    // draw dynamic buffer
    // every frame
    // e.g buf.rect(...);
  }

  process() {
    this.o['OUT'].set(this.i['IN'].get() * this.i['CNTRL'].get());
  }
}

engine.add_module_class(JSModule);