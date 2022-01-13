class Mixer extends Module {
  constructor(name, freq, x=-1, y=-1) {
    super(name, x, y, 30, 70);
    this.freq = freq;
    this.delta = Math.PI * 2 / (sample_rate / freq);
    this.phase = 0;

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

    this.add_input(new Port(8, 38, 7, 'IN1'));
    this.add_input(new InvisiblePort(8, 62, 7, 'IN1_CV'));
    this.add_input(new Port(22, 38, 7, 'IN2'));
    this.add_input(new InvisiblePort(8, 62, 7, 'IN2_CV'));
    this.add_input(new Port(8, 50, 7, 'IN3'));
    this.add_input(new InvisiblePort(8, 62, 7, 'IN3_CV'));
    this.add_input(new Port(22, 50, 7, 'IN4'));
    this.add_input(new InvisiblePort(8, 62, 7, 'IN4_CV'));
    this.add_output(new Port(22, 62, 7, 'OUT'));

    this.value = 0;
    this.type = 0;
    this.mod = 0;

    this._alpha = 0.01;
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.o['OUT'].set( (this.i['IN1'].get() * this.i['IN1_CV'].get() / 10 + 
                        this.i['IN2'].get() * this.i['IN2_CV'].get() / 10 + 
                        this.i['IN3'].get() * this.i['IN3_CV'].get() / 10 + 
                        this.i['IN4'].get() * this.i['IN4_CV'].get() / 10) / 4 );
    this.scope.process( this.o['OUT'].get() )
  }
}