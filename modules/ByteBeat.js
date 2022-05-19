class ByteBeat extends Module {
  // expr(t) {
  //   return ((t / 2 % (this.p1 * 13)) + 3) * 2 + ((t / 4 % (this.p2 * 19)) >> (this.p3 * 3) + 1)  | ((t ^ (this.p4) * 11))
  // }

  constructor(expr = function expr(t, c, p1, p2, p3, p4) {
  return (((t / c) / 2 % (p1 * 13)) + 3) * 2 + (((t / c) / 4 % (p2 * 19)) >> (p3 * 3) + 1)  | (((t / c) ^ (p4) * 11))
}) {
    super({w:hp2px(7)});

    this.add_input(new InputEncoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:10, val:0, name:'P1'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:10, val:0, name:'P2'}));
    this.add_input(new InputEncoder({x:hp2px(3.6), y:6, r:7, vmin:0, vmax:10, val:0, name:'P3'}));
    this.add_input(new InputEncoder({x:hp2px(3.6), y:26, r:7, vmin:0, vmax:10, val:0, name:'P4'}));
    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:1, vmax:4, val:2, precision:0, name:'CLDV'}));
    this.add_input(new InputEncoder({x:hp2px(3.6), y:46, r:7, vmin:1, vmax:10, val:1, precision:0, name:'VLDV'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'CLK'}));
    this.add_output(new Port({x:hp2px(3.8), y:108, r:6, name:'OUT'}));

    this.p1 = this.i['P1'].get();
    this.p2 = this.i['P2'].get();
    this.p3 = this.i['P3'].get();
    this.p4 = this.i['P4'].get();
    this.cldv = this.i['CLDV'].get().toFixed(0);
    this.vldv = this.i['VLDV'].get().toFixed(0);
    this.value = 0;
    this.expr = expr;
    this.counter = 0;
  }

  process() {
    this.p1 = this.i['P1'].get();
    this.p2 = this.i['P2'].get();
    this.p3 = this.i['P3'].get();
    this.p4 = this.i['P4'].get();
    this.cldv = this.i['CLDV'].get().toFixed(0);
    this.vldv = this.i['VLDV'].get().toFixed(0);
    if (this.expr)
      this.value = this.expr(this.counter, this.vldv, this.p1, this.p2, this.p3, this.p4);
    this.o['OUT'].set((this.value % 0xFF) / 25.6 - 5);
    //this.o['CLK'].set(~(this.counter / (2048 * Math.pow(2, this.cldv)) & 1));
    this.o['CLK'].set(Math.floor(this.counter / (2048 * Math.pow(2, this.cldv))) & 1);
    this.counter++;
  }
}

engine.add_module_class(ByteBeat);