// class Mixer extends Module {
//   constructor(name, freq, x=-1, y=-1) {
//     super(name, x, y, 30, 70);
//     this.freq = freq;
//     this.delta = Math.PI * 2 / (sample_rate / freq);
//     this.phase = 0;

//     this.scope = new RawScope(0, 0, 30, 30, 'scope', 30, 128);

//     this.add_input(new Port({x:8, y:38, r:7, name:'IN1'}));
//     this.add_input(new Port({x:8, y:62, r:7, name:'IN1_CV', visible:false}));
//     this.add_input(new Port({x:22, y:38, r:7, name:'IN2'}));
//     this.add_input(new Port({x:8, y:62, r:7, name:'IN2_CV', visible:false}));
//     this.add_input(new Port({x:8, y:50, r:7, name:'IN3'}));
//     this.add_input(new Port({x:8, y:62, r:7, name:'IN3_CV', visible:false}));
//     this.add_input(new Port({x:22, y:50, r:7, name:'IN4'}));
//     this.add_input(new Port({x:8, y:62, r:7, name:'IN4_CV', visible:false}));
//     this.add_output(new Port({x:22, y:62, r:7, name:'OUT'}));

//     this.value = 0;
//     this.type = 0;
//     this.mod = 0;

//     this._alpha = 0.01;
//   }

//   draw(x, y, scale) {
//     x += this.o['OUT'].get() * 0.05;
//     y += this.o['OUT'].get() * 0.05;

//     super.draw(x, y, scale);
//     this.scope.draw(x + this.x, y + this.y, scale);
//   }

//   process() {
//     this.o['OUT'].set( (this.i['IN1'].get() * this.i['IN1_CV'].get() / 10 + 
//                         this.i['IN2'].get() * this.i['IN2_CV'].get() / 10 + 
//                         this.i['IN3'].get() * this.i['IN3_CV'].get() / 10 + 
//                         this.i['IN4'].get() * this.i['IN4_CV'].get() / 10) / 4 );
//     this.scope.process( this.o['OUT'].get() )
//   }
// }

class Bus extends Module {
  constructor() {
    super({name:'Mixer', w:hp2x(4)});
    this.amp = new Array(2);
    for (var i = 0; i < 2; i++) {
      this.add_input(new Port({x:hp2x(0.6), y:(46 + i*40), r:7, default_value:0, name:'IN' + (i+1).toString()}));
      this.add_input(new InputEncoder({x:hp2x(0.6), y:(26 + i*40), r:7, vmin:0, vmax:1, val:1, name:'AMP' + (i+1).toString()}));
      this.amp[i] = this.i['AMP' + (i+1).toString()].get();
    }
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.value = 0;
  }

  // draw_dbf (buf, x, y, w, h) {
    
  // }

  process() {
    // for (var i = 0; i < 2; i++) 
    //     this.amp[i] = this.i['AMP' + (i+1).toString()].get();
    this.amp[0] = this.i['AMP1'].get();
    this.amp[1] = this.i['AMP2'].get();

    this.value = 0;
    this.j = 0;
    this.value += this.i['IN1'].get() * this.amp[0];
    this.value += this.i['IN2'].get() * this.amp[1];
    // for (var i = 0; i < 2; i++) {
    //   this.value += this.i['IN' + (i+1).toString()].get() * this.amp[this.j];
    //   this.j++;
    // }
    this.o['OUT'].set(this.value / 2);
  }
}

class Mixer extends Module {
  constructor() {
    super({name:'Mixer', w:hp2x(13)});
    this.amp = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.add_input(new Port({x:hp2x(0.6 + i*3), y:36, r:7, default_value:0, name:`IN${i+1}`}));
      this.add_input(new InputEncoder({x:hp2x(0.6 + i*3), y:11, r:7, vmin:0, vmax:1, val:1, name:`AMP${i+1}`}));
      this.amp[i] = this.i[`AMP${i+1}`].get();
    }
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.value = 0;
  }

  // draw_dbf (buf, x, y, w, h) {
    
  // }

  process() {
    this.amp[0] = this.i['AMP1'].get();
    this.amp[1] = this.i['AMP2'].get();
    this.amp[2] = this.i['AMP3'].get();
    this.amp[3] = this.i['AMP4'].get();

    this.value = 0;
    
    this.value += this.i['IN1'].get() * this.amp[0];
    this.value += this.i['IN2'].get() * this.amp[1];
    this.value += this.i['IN3'].get() * this.amp[2];
    this.value += this.i['IN4'].get() * this.amp[3];
    this.o['OUT'].set(this.value / 4);
  }
}


class StereoMixer extends Module {
  constructor(chan_num) {
    super({w:hp2x(chan_num * 2 + 3)});
    this.chan_num = chan_num;
    this.channels = new Array(chan_num);
    this.gains = new Array(chan_num+1);
    this.pans = new Array(chan_num);
    this.mutes = new Array(chan_num);
    this.solos = new Array(chan_num);
    for (let i = 0; i < chan_num; i ++) {
      this.channels[i] = new Array(2);
      this.channels[i][0] = new Port({x:hp2x(i * 2 + 0.75), y:hp2y(0.60), r:4, name:`${i+1}L`});
      this.channels[i][1] = new Port({x:hp2x(i * 2 + 0.75), y:hp2y(0.70), r:4, name:`${i+1}R`});
      this.gains[i] = new Encoder({x:hp2x(i * 2 + 0.75), y:hp2y(0.80), r:hp2x(0.8), vmin:0, vmax:1, val:0.5, name:`AMP${i+1}`});
      this.pans[i] = new InputEncoder({x:hp2x(i * 2 + 0.75), y:hp2y(0.90), r:hp2x(0.8), vmin:0, vmax:1, val:0.5, name:`PAN${i+1}`});
      // this.mutes[i] = new Button({x:hp2x(i * 2 + 0.5), y:hp2y(0.95), r:hp2x(0.8), name:`MUT${i+1}`});
      this.add_input(this.channels[i][0]);
      this.add_input(this.channels[i][1]);
      this.add_control(this.gains[i]);
      this.add_input(this.pans[i]);
      // this.add_control(this.mutes[i]);
    }
    this.add_output(new Port({x:hp2x(chan_num * 2 + 0.75), y:hp2y(0.60), r:4, name:'O/L', type:'output'}));
    this.add_output(new Port({x:hp2x(chan_num * 2 + 0.75), y:hp2y(0.70), r:4, name:'O/R', type:'output'}));
    this.gains[chan_num] = new Encoder({x:hp2x(chan_num * 2 + 0.75), y:hp2y(0.80), r:hp2x(0.8), vmin:0, vmax:chan_num, val:1, name:`AMP`});
    this.add_control(this.gains[chan_num]);
    this.lvalue = 0;
    this.L = 0;
    this.R = 0;
    this.it = 0;
    this.dit = 0;
    this.amp = 0;
    this.damp = 0;
    this.dampL = 0;
    this.dampR = 0;
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    buf.noFill();
    for (this.dit = 0; this.dit < this.chan_num + 1; this.dit ++) {        
      buf.rect(w / (this.chan_num + 1.25) * (this.dit + 0.35), h * 0.07, w / (this.chan_num + 1.25) * 0.6, h * 0.5);
    }
  }

  draw_dbf(buf, x, y, w, h) {
    buf.stroke(60);
    buf.strokeWeight(0.1)
    for (this.dit = 0; this.dit < this.chan_num; this.dit ++) {
      this.damp = this.gains[this.dit].get();
      buf.fill([131, 183, 153])
      this.dampL = Math.abs(this.channels[this.dit][0].get()) / 1 * this.damp;
      
      if (this.channels[this.dit][1].port.wires.length > 0)
        this.dampR = Math.abs(this.channels[this.dit][1].get()) / 1 * this.damp;
      else
        this.dampR = this.dampL;

      buf.rect(x + w / (this.chan_num + 1.25) * (this.dit + 0.375), 
               y + h * 0.07 + h * 0.5 * (1 - this.dampL), 
               w / (this.chan_num + 1.25) * 0.25, 
               h * 0.5 * this.dampL);

      buf.fill([232, 111, 104])

      buf.rect(x + w / (this.chan_num + 1.25) * (this.dit + 0.675), 
               y + h * 0.07 + h * 0.5 * (1 - this.dampR), 
               w / (this.chan_num + 1.25) * 0.25, 
               h * 0.5 * this.dampR);
      // this.channels[this.it][0].get()
    }
  }

  process() {
    this.L = 0;
    this.R = 0;
    for (this.it = 0; this.it < this.chan_num; this.it ++) {
      this.amp = this.gains[this.it].get();
      this.lvalue = this.channels[this.it][0].get() / this.chan_num * this.amp;
      this.L += this.lvalue;
      if (this.channels[this.it][1].port.wires.length > 0)
        this.R += this.channels[this.it][1].get() / this.chan_num * this.amp;
      else
        this.R += this.lvalue;
    }
    this.amp = this.gains[this.chan_num].get();
    this.o['O/L'].set(this.L * this.amp);
    this.o['O/R'].set(this.R * this.amp);
  }
}

class StereoMixer4 extends StereoMixer { constructor() { super(4); } }
class StereoMixer8 extends StereoMixer { constructor() { super(8); } }
class StereoMixer16 extends StereoMixer { constructor() { super(16); } }

engine.add_module_class(Bus);
engine.add_module_class(Mixer);
engine.add_module_class(StereoMixer4);
engine.add_module_class(StereoMixer8);
engine.add_module_class(StereoMixer16);
