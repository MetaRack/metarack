class BernoulliGate extends Module {
  constructor() {
    super({w:hp2px(4)});
    this.gate = 0;
    this.last_gate = 0;
    this.state = -10;

    this.add_control(new Encoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'P'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'IN'}));
  }

  process() {
    this.gate = this.i['IN'].get();
    if (((this.last_gate == 0) && (this.gate > 0)) && (rackrand() < (this.c['P'].get()))) 
      this.state = 10;
    else
      this.state = 0;
    //if (this.last_gate > 0 && this.gate < 0) this.state = -10;
    this.o['OUT'].set( this.state );
    this.last_gate = this.gate;
  }
}