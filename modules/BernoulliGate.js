class BernoulliGate extends Module {
  constructor() {
    super({w:hp2px(4)});
    this.gate = 0;
    this.last_gate = 0;
    this.state = 'l';

    this.add_input(new InputEncoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:1, val:0.5, name:'P'}));
    this.add_output(new Port({x:hp2px(0.8), y:88, r:6, name:'OUTL'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUTR'}));
    this.add_input(new Port({x:hp2px(0.8), y:68, r:6, name:'IN'}));

    this.l_led = new Led({x:hp2px(1.2), y:10.2, r:4});
    this.attach(this.l_led);
    this.l_led.set(255);

    this.r_led = new Led({x:hp2px(1.2), y:30.2, r:4});
    this.attach(this.r_led);
    this.r_led.set(255);
  }

  process() {
    this.gate = this.i['IN'].get();
    this.rand = rackrand();
    if (this.last_gate < this.gate) {
      if (this.rand < (this.i['P'].get()))
        this.state = 'l';
      else
        this.state = 'r';  
    } 

    if (this.state == 'l') {
      this.o['OUTL'].set(this.gate);
      this.o['OUTR'].set(0);
      this.l_led.set(!this.gate * 255);
      this.r_led.set(255);
    } else {
      this.o['OUTL'].set(0);
      this.o['OUTR'].set(this.gate);
      this.r_led.set(!this.gate * 255);
      this.l_led.set(255);
    }
    //if (this.last_gate > 0 && this.gate < 0) this.state = -10;
    this.last_gate = this.gate;
  }
}