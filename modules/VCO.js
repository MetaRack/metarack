class VCO extends Module {
  constructor(name, freq, x=-1, y=-1) {
    super(name, x, y, 30, 70);
    this.freq = freq;
    this.delta = Math.PI * 2 / (sample_rate / freq);
    this.phase = 0;

    this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 64);

    this.add_input(new Port(8, 38, 7, 'CV'));
    this.add_input(new Port(22, 38, 7, 'FM'));
    this.add_input(new Port(8, 50, 7, 'WAVE'));
    this.add_input(new Port(22, 50, 7, 'PW'));
    this.add_input(new Port(8, 62, 7, 'AMP'));
    this.add_output(new Port(22, 62, 7, 'OUT'));
    this.add_output(new InvisiblePort(8, 62, 7, 'PHASE_OUT'));

    this.i['AMP'].set(10);

    this.value = 0;
    this.type = 0;
    this.mod = 0;

    this._alpha = 0.01;
  }

  set_frequency(f) {
    this.freq = f;
    this.delta = Math.PI * 2 / (sample_rate / f);
  }

  draw(x, y, scale) {
    x += this.o['OUT'].get() * 0.05;
    y += this.o['OUT'].get() * 0.05;

    super.draw(x, y, scale);
    this.scope.draw(x + this.x, y + this.y, scale);
  }

  process() {
    this.type = this.i['WAVE'].get();
    if (this.type >= 0) {
      this.value = Math.sin(this.phase) * (1 - this.type) + (this.phase / Math.PI * 4 - 1) * this.type;
    } else {
      this.value = Math.sin(this.phase) * (1 + this.type) - ((this.phase < Math.PI * (this.i['PW'].get() + 1) ) * 2 - 1) * this.type;
    }
    this.o['OUT'].set( this.value * this.i['AMP'].get() );
    this.mod = this._alpha * (this.i['CV'].get() + this.i['FM'].get()) + (1 - this._alpha) * this.mod;
    this.phase += this.delta * Math.pow(2, this.mod);
    this.scope.process( this.o['OUT'].get() )
    if (this.phase > Math.PI * 2) this.phase -= Math.PI * 2;
    this.o['PHASE_OUT'].set(this.phase);
  }
}