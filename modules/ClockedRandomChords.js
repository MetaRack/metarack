class ClockedRandomChords extends Module {
  constructor() {
    super({w:hp2x(10)});

    this.add_input(new InputEncoder({x:hp2x(0.7), y:hp2y(0.55), r:hp2x(1), vmin:0, vmax:10, val:1, name:'A'}));
    this.add_input(new InputEncoder({x:hp2x(2.9), y:hp2y(0.55), r:hp2x(1), vmin:0, vmax:10, val:1, name:'D'}));
    this.add_input(new InputEncoder({x:hp2x(5.1), y:hp2y(0.55), r:hp2x(1), vmin:0, vmax:1, val:0.1, name:'S'}));
    this.add_input(new InputEncoder({x:hp2x(7.3), y:hp2y(0.55), r:hp2x(1), vmin:0, vmax:50, val:30, name:'R'}));
    this.add_input(new InputEncoder({x:hp2x(1.5), y:hp2y(0.40), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P1'}));
    this.add_input(new InputEncoder({x:hp2x(4.0), y:hp2y(0.40), r:hp2x(1), vmin:0, vmax:1, val:0.7, name:'P2'}));
    this.add_input(new InputEncoder({x:hp2x(6.5), y:hp2y(0.40), r:hp2x(1), vmin:0, vmax:1, val:0.5, name:'P3'}));
    this.add_input(new InputEncoder({x:hp2x(4.0), y:hp2y(0.85), r:hp2x(1), vmin:0, vmax:4, val:0, name:'SHPR'}));
    this.add_input(new InputEncoder({x:hp2x(0.7), y:hp2y(0.70), r:hp2x(1), vmin:0, vmax:8, val:3, precision:0, name:'SCL'}));
    this.add_input(new InputEncoder({x:hp2x(2.9), y:hp2y(0.70), r:hp2x(1), vmin:0, vmax:11, val:0, precision:0, name:'ROOT'}));
    this.add_input(new InputEncoder({x:hp2x(5.1), y:hp2y(0.70), r:hp2x(1), vmin:-2, vmax:2, val:0, name:'OFST'}));
    this.add_input(new InputEncoder({x:hp2x(7.3), y:hp2y(0.70), r:hp2x(1), vmin:0.1, vmax:3, val:1, name:'WDTH'}));

    this.add_input(new Port({x:hp2x(0.7), y:hp2y(0.85), r:hp2x(1), name:'GATE'}));
    this.add_output(new Port({x:hp2x(7.3), y:hp2y(0.85), r:hp2x(1), name:'OUT'}));

    this.BG = new Array(3);
    this.ENV = new Array(3);
    this.OSC = new Array(3);
    this.SHP = new Array(3);
    this.SCL = new Array(3);
    this.SH = new Array(3);
    this.p = new Array(3);

    for (var i = 0; i < 3; i++) {
      this.BG[i] = new BernoulliGatePrim();
      this.ENV[i] = new ADSRPrim();
      this.OSC[i] = new VCOPrim(261);
      this.SHP[i] = new SaturnPrim();
      this.SCL[i] = new ScalePrim();
      this.SH[i] = new SampleAndHoldPrim();
      this.p[i] = 0;
    }

    this.BG[0].p = 0.5;
    this.BG[1].p = 0.6;
    this.BG[2].p = 0.7;

    this.gate = 0;
    this.out = 0;
    this.shape = 0;
    this.scale = 0;
    this.root = 0;
    this.offset = 0;
    this.width = 0;
    this.A = 0;
    this.D = 0;
    this.S = 0;
    this.R = 0;

    this.proc_i = 0;
  }

  update_params() {
    this.gate = this.i['GATE'].get();
    this.shape = this.i['SHPR'].get();
    this.root = this.i['ROOT'].get().toFixed(0);
    this.scale = this.i['SCL'].get().toFixed(0);
    this.offset = this.i['OFST'].get();
    this.width = this.i['WDTH'].get();

    this.A = this.i['A'].get();
    this.D = this.i['D'].get();
    this.S = this.i['S'].get();
    this.R = this.i['R'].get();
    this.p[0] = this.i['P1'].get();
    this.p[1] = this.i['P2'].get();
    this.p[2] = this.i['P3'].get();

    for (var i = 0; i < 3; i++) {
      this.BG[i].p = this.p[i];
      this.ENV[i].A = this.A;
      this.ENV[i].D = this.D;
      this.ENV[i].S = this.S;
      this.ENV[i].R = this.R;
      this.SHP[i].fold = this.shape;
      this.SCL[i].scale = this.scale;
      this.SCL[i].root = this.root;
    }
  }

  draw_cbf(buf, w, h) {
    super.draw_cbf(buf, w, h);
    let sw = 5;
    let rounding = 5; 
    buf.stroke(60); buf.strokeWeight(sw); buf.strokeJoin(ROUND); buf.fill(255);
    buf.rect(sw / 2 + w * 0.05, sw / 2 + h * 0.05, w * 0.9 - sw, h * 0.3 - sw, rounding, rounding, rounding, rounding);

    buf.stroke(60);
    for (var i = 1; i < 20; i ++) {
      if (i % 5 == 0) buf.strokeWeight(0.5);
      else buf.strokeWeight(0.05);
      buf.line(i * w * 0.05, sw + h * 0.05, i * w * 0.05, h * 0.35 - sw);
      buf.line(sw + w * 0.05, i * h * 0.3 * 0.05 + h * 0.05, w * 0.95 - sw, i * h * 0.3 * 0.05 + h * 0.05);
    }
  }

  draw_dbf(buf, x, y, w, h) {
    buf.noFill();
    buf.strokeWeight(0.5);
    buf.stroke(40);
    buf.circle(x + w/4, y - h/2 * 0.1 * (1 + this.OSC[0].cv + 1) + h * 0.25, this.ENV[0].out / 10 * w/4);
    buf.circle(x + w/2, y - h/2 * 0.1 * (1 + this.OSC[1].cv + 1) + h * 0.25, this.ENV[1].out / 10 * w/4);
    buf.circle(x + w/4*3, y - h/2 * 0.1 * (1 + this.OSC[2].cv + 1) + h * 0.25, this.ENV[2].out / 10 * w/4);
  }

  process() {
    this.update_params();

    this.out = 0;

    for (this.proc_i = 0; this.proc_i < 3; this.proc_i++) {
      this.BG[this.proc_i].gate = this.gate;
      this.ENV[this.proc_i].gate = this.BG[this.proc_i].out_l;
      this.SH[this.proc_i].gate = this.BG[this.proc_i].out_l;
      this.SH[this.proc_i].in = (rackrand() * this.width) + this.offset;
      this.SCL[this.proc_i].in = this.SH[this.proc_i].out;
      this.OSC[this.proc_i].cv = this.SCL[this.proc_i].out;
      this.SHP[this.proc_i].in = this.OSC[this.proc_i].out;

      this.BG[this.proc_i].process();
      this.ENV[this.proc_i].process();
      this.OSC[this.proc_i].process();
      this.SH[this.proc_i].process();
      this.SCL[this.proc_i].process();
      this.SHP[this.proc_i].process();

      this.out += this.SHP[this.proc_i].out * this.ENV[this.proc_i].out / 10 / 3;
    }
    this.o['OUT'].set(this.out);
  }
}

engine.add_module_class(ClockedRandomChords);