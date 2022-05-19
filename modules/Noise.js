// class GateNoise extends Module {
//   constructor(name, x=-1, y=-1) {
//     super(name, x, y, 20, 70);
//     this.scope = new RawScope(0, 0, 20, 30, 'scope', 20);
//     this.holding = false;

//     this.add_input(new Port({x:10, y:38, r:7, name:'GATE'}));
//     this.add_input(new Port({x:10, y:50, r:7, name:'TYPE'}));
//     this.add_output(new Port({x:10, y:62, r:7, name:'OUT'}));
//   }

//   draw(x, y, scale) {
//     x += this.o['OUT'].get() * 0.05;
//     y += this.o['OUT'].get() * 0.05;

//     super.draw(x, y, scale);
//     this.scope.draw(x + this.x, y + this.y, scale);
//   }

//   process() {
//     if (this.i['GATE'].get() > 0) {
//       if (this.holding == false) {
//         this.o['OUT'].set( rackrand() * 20 - 10 );
//         this.holding = true;
//       }
//     } else this.holding = false;
//     this.scope.process( this.o['OUT'].get() )
//   }
// }


class Noise extends Module {
  constructor() {
    super({name:'Noise', w:hp2x(4)});
    // this.scope = new RawScope(0, 0, 20, 30, 'scope', 32);
    this.add_control(new Encoder({x:hp2x(0.6), y:66, r:7, vmin:0, vmax:1, val:1, name:'AMP'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.amp = this.c['AMP'].get();
  }

  draw_dbf (buf, x, y, w, h) {
    if (this.c['AMP'].changed) {
      this.amp = this.c['AMP'].get();
    }
  }

  // draw(x, y, scale) {
  //   x += this.o['OUT'].get() * 0.05;
  //   y += this.o['OUT'].get() * 0.05;

  //   super.draw(x, y, scale);
  //   this.scope.draw(x + this.x, y + this.y, scale);
  // }

  process() {
    this.o['OUT'].set( (rackrand() * 20 - 10) * this.amp/10 );
    // this.scope.process( this.o['OUT'].get() )
  }
}

engine.add_module_class(Noise);