class ADSR extends Module {

  constructor() {
    super({w:hp2px(4)});
    this.phase = 0;
    this.stage = 'R';
    this.switch_level = 0;

    this.scope = new RawScope(0, 0, 30, 30);
    // this.attach(this.scope);

    this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:10, val:1, name:'A'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:26, r:7, vmin:0, vmax:10, val:1, name:'D'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:46, r:7, vmin:0, vmax:1, val:0.1, name:'S'}));
    this.add_control(new Encoder({x:hp2px(0.6), y:66, r:7, vmin:0, vmax:50, val:30, name:'R'}));
    this.add_input(new Port({x:hp2px(0.8), y:88, r:6, name:'GATE'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
  }

  process() {
    let A = this.c['A'].get() + 0.1;
    let D = this.c['D'].get() + 0.1;
    let S = this.c['S'].get() + 0.000001;
    let R = this.c['R'].get() + 0.1;

    var env = 0;
    var lin = 0;
    var sqr = 0;

    if (this.i['GATE'].get() > 0) {
      switch(this.stage) {
        case 'R':
          this.stage = 'A';
          this.phase = Math.pow(this.o['OUT'].get(), 2) * A;
        case 'A':
          env = Math.sqrt(this.phase / A);
          if (env >= 1) {
            console.log('A->D');
            this.stage = 'D';
            this.switch_level = env;
          }
          break;
        case 'D':
          sqr = S + (this.switch_level - Math.sqrt((this.phase - A) / D)) * (this.switch_level - S);
          lin = (this.phase - A) / D;
          env = sqr; //(1 - lin) * this.switch_level + lin * sqr;
          if (env <= S) this.stage = 'S';
          break;
        case 'S':
          env = this.o['OUT'].get();
          break;

      }
    } else {
      switch (this.stage) {
        case 'A':
        case 'D':
        case 'S':
          this.stage = 'R';
          this.phase = 0.001;
          this.switch_level = this.o['OUT'].get();
        case 'R':
          env = (1 - Math.sqrt(this.phase / R)) * this.switch_level;
          if (env <= 0) env = 0;
          break;
      }
    }

    this.o['OUT'].set(env);
    // console.log(env * 20 - 10, this.o['OUT'].get());
    // this.scope.process( this.o['OUT'].get() * 20 - 10 )
    this.phase += 0.001;
  }
}