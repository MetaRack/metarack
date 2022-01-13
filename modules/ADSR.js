class ADSR extends Module {
  constructor(name, x=-1, y=-1, style = new ModuleStyle()) {
    super(name, x, y, 30, 70, style);
    this.phase = 0;
    this.stage = 'R';
    this.switch_level = 0;

    this.scope = new RawScope(0, 0, 30, 30);

    this.add_input(new Port(8, 38, 7, 'A'));
    this.add_input(new Port(22, 38, 7, 'D'));
    this.add_input(new Port(8, 50, 7, 'S'));
    this.add_input(new Port(22, 50, 7, 'R'));
    this.add_input(new Port(8, 62, 7, 'GATE'));
    this.add_output(new Port(22, 62, 7, 'OUT'));
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;
    
    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    let A = this.i['A'].get() * 10 + 0.1;
    let D = this.i['D'].get() * 10 + 0.1;
    let S = this.i['S'].get() + 0.000001;
    let R = this.i['R'].get() * 50 + 0.1;

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
    this.scope.process( this.o['OUT'].get() * 20 - 10 )
    this.phase += 0.001;
  }
}