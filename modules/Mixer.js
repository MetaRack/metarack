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
    super({name:'Mixer', w:hp2px(4)});
    this.amp = new Array(2);
    for (var i = 0; i < 2; i++) {
      this.add_input(new Port({x:hp2px(0.6), y:(46 + i*40), r:7, default_value:0, name:'IN' + (i+1).toString()}));
      this.add_control(new Encoder({x:hp2px(0.6), y:(26 + i*40), r:7, vmin:0, vmax:1, val:1, name:'AMP' + (i+1).toString()}));
      this.amp[i] = this.c['AMP' + (i+1).toString()].get();
    }
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    this.value = 0;
  }

  draw_dbf (buf, x, y, w, h) {
    for (var i = 0; i < 2; i++) {
      if (this.c['AMP' + (i+1).toString()].changed) {
        this.amp[i] = this.c['AMP' + (i+1).toString()].get();
      }
    }
  }

  process() {
    this.value = 0;
    this.j = 0;
    for (var name in this.i) {
      this.value += this.i[name].get() * this.amp[this.j];
      this.j++;
    }
    this.o['OUT'].set(this.value / 2);
  }
}

class Mixer extends Module {
  constructor() {
    super({name:'Mixer', w:hp2px(13)});
    this.amp = new Array(4);
    for (var i = 0; i < 4; i++) {
      this.add_input(new Port({x:hp2px(0.6 + i*3), y:36, r:7, default_value:0, name:'IN' + (i+1).toString()}));
      this.add_control(new Encoder({x:hp2px(0.6 + i*3), y:11, r:7, vmin:0, vmax:1, val:1, name:'AMP' + (i+1).toString()}));
      this.amp[i] = this.c['AMP' + (i+1).toString()].get();
    }
    this.add_output(new Port({x:hp2px(0.8), y:108, r:6, name:'OUT'}));
    this.value = 0;
  }

  draw_dbf (buf, x, y, w, h) {
    for (var i = 0; i < 4; i++) {
      if (this.c['AMP' + (i+1).toString()].changed) {
        this.amp[i] = this.c['AMP' + (i+1).toString()].get();
      }
    }
  }

  process() {
    this.value = 0;
    this.j = 0;
    for (var name in this.i) {
      this.value += this.i[name].get() * this.amp[this.j];
      this.j++;
    }
    this.o['OUT'].set(this.value / 4);
  }
}


class Mixer100 extends Module {
  constructor() {
    super({name:'Mixer100', w:hp2px(140) + 13, h:20});
    for (var i = 0; i < 98; i ++) {
      this.add_input(new Port({x:hp2px((i % 49) / 49 * 140) + 7, y: 9 * Math.floor(i / 49) + 1, r:4, name:'IN' + i.toString()}));
    }
    this.add_output(new Port({x:hp2px(0), y:0, r:4, name:'OUT', visible: false}));
    this.value = 0;
  }

  process() {
    this.value = 0;
    for (var name in this.i) {
      this.value += this.i[name].get() / 56;
    }
    this.o['OUT'].set(this.value);
  }
}