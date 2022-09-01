

class Quantum extends Module {
  constructor() {
    super({w:hp2x(8)});

    this.note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    this.scales = [
      'Major',
      'Minor',
      'Harmonic\nMinor',
      'Mixolydian',
      'Melodic\nMinor',
      'Harmonic\nMajor',
      'Melodic\nMajor',
      'Hungarian\nMajor',
      'Hungarian\nMinor'
    ]

    this.add_control(new Encoder({x:hp2x(0.9), y:56, r:7, vmin:0, vmax:1, val:1, name:'MOD'}));
    this.add_control(new Encoder({x:hp2x(4.3), y:56, r:7, vmin:0, vmax:1, val:0.5, name:'OFST'}));
    this.add_control(new Encoder({x:hp2x(0.9), y:81, r:7, vmin:0, vmax:1, val:0.5, name:'WDTH'}));
    this.add_control(new Encoder({x:hp2x(4.3), y:81, r:7, vmin:0, vmax:1, val:0.5, name:'DIV'}));
    this.add_input(new Port({x:hp2x(0.8), y:106, r:7, name:'GATE'}));
    this.add_output(new Port({x:hp2x(4.3), y:106, r:7, name:'OUT', type:'output'}));
    this.max_enc = 2;
    this.p = new Array(2);
    this.gate = 0;
    this.pitch = 0;
    this.j = 0;
    this.out = [0, 0, 0];
    this.div = 0;
    this.div_counter = 0;
    this.prev_gate = 0;
    this.max_param = 5;
    this.params = new Array(this.max_param);
    this.lfos = new Array(this.max_enc);
    this.lfo_connect = new Array(this.max_enc);
    this.enc_connect = new Array(this.max_enc);
    //this.pick_lfo();
    this.lfo_connect[0] = 2;
    this.lfo_connect[1] = 3;
    this.pick_enc();
    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j] = new VCOPrim();
      this.lfos[this.j].set_frequency(Math.random());
    }

    this.scale = [new ScalePrim(), new ScalePrim(), new ScalePrim()];
    this.params[0] = Math.floor(Math.random() * 9); //scale
    this.params[1] = Math.floor(Math.random() * 12); //root

    this.sh = [new SampleAndHoldPrim(), new SampleAndHoldPrim(), new SampleAndHoldPrim()];

    this.params[2] = (Math.random() * 3) - 1.5; //offset
    this.params[3] = Math.random() * 2; //scale

    this.params[4] = Math.floor(Math.random() * 4) + 1;

    this.update_params();

    this.flag = true;
  }

  randomize() {
    this.c['DIV'].set(Math.random());
    this.c['WDTH'].set(Math.random());
    this.c['MOD'].set(Math.random());
    this.c['OFST'].set(Math.random());
  }


  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 1;
    buf.stroke(60); buf.strokeWeight(sw*3); buf.fill(30);
    buf.rect(sw + w * 0.05, sw + h / 3 * 0.05 + 40, w - 2 * sw - w * 0.1, h/ 3 - 2 * sw - h / 3 * 0.1, 5);

    let text = "Root: " + this.note_names[this.params[1]] + "\nScale: " + this.scales[this.params[0]];

    buf.textSize(h / 30);
    buf.stroke(240)
    buf.fill(240);
    buf.textAlign(buf.LEFT, buf.TOP);
    buf.strokeWeight(sw / 10);
    buf.text(text, sw + w * 0.07, sw + h / 3 * 0.1 + 40);
  }

  pick_lfo() {
    this.lfo_connect[0] = Math.floor(Math.random() * (this.max_param));

    this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param));
    while (this.lfo_connect[1] == this.lfo_connect[0])
       this.lfo_connect[1] = Math.floor(Math.random() * (this.max_param));
  }

  pick_enc() {
    this.enc_connect[0] = Math.floor(Math.random() * this.max_param);

    this.enc_connect[1] = Math.floor(Math.random() * this.max_param);
    while (this.enc_connect[1] == this.enc_connect[0])
       this.enc_connect[1] = Math.floor(Math.random() * this.max_param);
  }

  update_params() {

    this.mod = this.c['MOD'].get();
    this.p[0] = this.c['OFST'].get();
    this.p[1] = this.c['WDTH'].get();
    this.gate = this.i['GATE'].get();


    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.params[this.lfo_connect[this.j]] += (this.lfos[this.j].out) * (this.mod + 0.001) * 5;
      //this.params[this.lfo_connect[this.j]] += this.lfos[this.j].out * 2 * this.mod;
      //this.params[this.enc_connect[this.j]] += (this.p[this.j] - 0.5) * 2;
      //this.params[this.enc_connect[this.j]] *= ((this.p[this.j] + 0.1) * 2);
    }

    for (this.j = 0; this.j < 4; this.j++) {
      this.params[this.j] = Math.max(this.params[this.j], 0);
    }

    for (this.j = 0; this.j < 3; this.j++) {
      this.scale[this.j].scale = Math.floor(this.params[0]);
      this.scale[this.j].root = Math.floor(this.params[1]);
    }

    if (this.params[2] < -1.5) this.params[2] = -1.5;
    if (this.params[2] > 1.5) this.params[2] = 1.5;

    if (this.params[3] < 0) this.params[3] = 0;
    if (this.params[3] > 2) this.params[3] = 2;

    if (this.params[4] < 0) this.params[4] = 0;
    if (this.params[4] > 3) this.params[4] = 3;

    this.div = (Math.floor(this.params[4] * this.c['DIV'].get()) + 1);

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      //this.params[this.enc_connect[this.j]] /= ((this.p[this.j] + 0.1) * 2);
      this.params[this.lfo_connect[this.j]] -= (this.lfos[this.j].out) * (this.mod + 0.001 * 5);
      //this.params[this.lfo_connect[this.j]] -= this.lfos[this.j].out / 2 * this.mod;
      //this.params[this.enc_connect[this.j]] -= (this.p[this.j] - 0.5) * 2;
      //this.params[this.enc_connect[this.j]] *= this.p[this.j];
    }
  }

  process() {
    this.update_params();

    this.out = [0, 0, 0];

    if (this.prev_gate < this.gate) {
      this.div_counter++;
      if (this.div_counter >= this.div) {
        this.div_counter = 0;
        for (this.j = 0; this.j < 3; this.j++) {
          this.sh[this.j].gate = 10;
        }
        
      } 
      else {
        for (this.j = 0; this.j < 3; this.j++) {
          this.sh[this.j].gate = 0;
        }
      }
    }
    else {
      for (this.j = 0; this.j < 3; this.j++) {
        this.sh[this.j].gate = 0;
      }
    }
    //this.sh.gate = this.gate;
    for (this.j = 0; this.j < 3; this.j++) {
      this.sh[this.j].in = (Math.random() - 0.5) * (this.params[3] * this.p[1] * 1) + (this.params[2] * (this.p[0] - 0.5) * 2);
    }
    
    for (this.j = 0; this.j < 3; this.j++) {
      this.scale[this.j].in = this.sh[this.j].out;
      
    }
   
  
    this.out = [this.scale[0].out, this.scale[1].out, this.scale[2].out];
    this.o['OUT'].set(this.out[0]);
    this.o['OUT'].gchildren[0].pitch = this.out;
    this.o['OUT'].pitch = this.out;

    for (this.j = 0; this.j < 3; this.j++) {
      this.scale[this.j].process();
      this.sh[this.j].process();
    }
    

    for (this.j = 0; this.j < this.max_enc; this.j++) {
      this.lfos[this.j].process();
    }

    this.prev_gate = this.gate;
  }
}

engine.add_module_class(Quantum);