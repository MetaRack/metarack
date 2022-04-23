class Clock extends Module {

  constructor(bpm) {
    super({name:'Clock', w:hp2px(4)});
    this.set_bpm(bpm);

    let cv = -2 + Math.floor(5 * rackrand()) - 0.01 + rackrand() * 0.02;
    this.add_control(new Encoder({x:hp2px(0.6), y:6, r:7, vmin:0, vmax:300, val:120, name:'BPM'}));
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    this.sample_counter = 0;
    this.value = 0;

    this.led = new Led({x:hp2px(1.4), y:28, r:3});
    this.led.set(0);
    this.attach(this.led);
  }

  set_bpm(bpm) {
    this.bpm = bpm;
    this.sample_threshold = sample_rate * 60 / this.bpm / 2;
  }

  draw_dbf (buf, x, y, w, h) {
    this.set_bpm(this.c['BPM'].get())
  }

  process() {
    if (this.sample_counter > this.sample_threshold) {
      this.o['OUT'].set(10);
      this.led.set(0);
    }
    this.sample_counter++;
    if (this.sample_counter > this.sample_threshold * 2) {
      this.sample_counter = 0;
      this.o['OUT'].set(0);
      this.led.set(255);
    }
  }
}