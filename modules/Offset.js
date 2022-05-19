class Offset extends Module {
	constructor() {
    super({name:'Offset', w:hp2x(4)});

    this.add_input(new Port({x:hp2x(0.8), y:88, r:6, name:'IN'}));
    this.add_output(new Port({x:hp2x(0.8), y:108, r:6, name:'OUT'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:6, r:7, vmin:-10, vmax:10, val:0, name:'OFST'}));
    this.add_input(new InputEncoder({x:hp2x(0.6), y:26, r:7, vmin:0, vmax:3, val:1, name:'SCL'}));

    this.scale = this.i['SCL'].get().toFixed(2);
    this.offset = this.i['OFST'].get().toFixed(1);

    this.value = 0;
  }

  // draw_dbf (buf, x, y, w, h) {
    
  // }

  process() {
  	this.offset = this.i['OFST'].get();
    this.scale = this.i['SCL'].get();
  	this.value = this.i['IN'].get();
  	this.value = (this.value + this.offset) * this.scale;
  	this.value = Math.min(10, this.value);
  	this.value = Math.max(-10, this.value);
    this.o['OUT'].set(this.value);
  }
}

engine.add_module_class(Offset);