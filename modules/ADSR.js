class ADSR extends Module {

  constructor() {
    super({w:hp2px(4)});
    this.phase = 0.001;
    this.stage = 'R';
    this.switch_level = 0;

    //this.scope = new RawScope(0, 0, 30, 30);
    // this.attach(this.scope);

    this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
  }

  process() {
    this.D = this.c['D'].get() + 0.1;
    this.S = this.c['S'].get() + 0.000001;
    this.R = this.c['R'].get() + 0.1;

    this.env = 0;
    this.lin = 0;
    this.sqr = 0;

    if (this.i['GATE'].get() > 0) {
      switch(this.stage) {
        case 'R':
          //console.log('gateR');
          this.stage = 'A';
          this.phase = Math.pow(this.o['OUT'].get() / 10, 2) * this.A;
          if (isNaN(this.phase)) console.log('phase');
          //this.phase = Math.pow(this.env / 10, 2) * A;
        case 'A':
          //console.log('gateA');
          this.env = Math.sqrt(this.phase / this.A);
          if (this.env >= 1) {
            //console.log('A->D');
            this.stage = 'D';
            this.switch_level = this.env;
          }
          break;
        case 'D':
          //console.log('gateD');
          this.sqr = this.S + (this.switch_level - Math.sqrt((this.phase - this.A) / this.D)) * (this.switch_level - this.S);
          if (isNaN(this.switch_level)) console.log('phase');
          if (isNaN(this.sqr)) console.log('sqr');
          this.lin = (this.phase - this.A) / this.D;
          this.env = this.sqr; //(1 - this.lin) * this.switch_level + this.lin * this.sqr;
          if (this.env <= this.S) this.stage = 'S';
          break;
        case 'S':
          //console.log('gateS');
          this.env = this.o['OUT'].get() / 10;
          break;

      }
    } else {
      this.A = this.c['A'].get() + 0.1;
      switch (this.stage) {
        case 'A':
          //console.log('nogateA');
          this.stage = 'R';
          this.phase = 0.001;
          this.switch_level = this.o['OUT'].get() / 10;
        case 'D':
          //console.log('nogateD');
          this.stage = 'R';
          this.phase = 0.001;
          this.switch_level = this.o['OUT'].get() / 10;
        case 'S':
          //console.log('nogateS');
          this.stage = 'R';
          this.phase = 0.001;
          this.switch_level = this.o['OUT'].get() / 10;
          //this.switch_level = this.o['OUT'].get() / 10;
        case 'R':
          //console.log('nogateR');
          this.env = (1 - Math.sqrt(this.phase / this.R)) * this.switch_level;
          if (isNaN(this.env)) console.log('env');
          if (this.env <= 0) this.env = 0;
          break;
      }
    }
    if (isNaN(this.phase)) this.phase = 0.001;
    if (isNaN(this.env)) this.env = 0;
    this.out = Math.min(this.env * 10, 10);
    if (isNaN(this.out)) this.out = 0;
    this.o['OUT'].set(this.out);
    // console.log(this.env * 20 - 10, this.o['OUT'].get());
    // this.scope.process( this.o['OUT'].get() * 20 - 10 )
    this.phase += 0.001;
  }
}

engine.add_module_class(ADSR);