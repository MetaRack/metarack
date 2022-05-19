class Scope extends Module {
	constructor () {
		super({w:hp2x(10)});
		this.scope = new RawScope({x: this.w * 0.05, y:this.h * 0.05, w:this.w - this.w * 0.1, h:this.h*0.25, size:30, divider:64});
    	this.attach(this.scope);
    	this.delta = Math.PI * 2 / (sample_rate / 2);
    	this.phase_inc = this.delta;
    	
    	this.add_input(new Port({x:hp2x(5.5), y:98, r:9, name:'IN'}));
	}

	process () {
		this.scope.divider = Math.PI / this.phase_inc / this.scope.size * 4;
		this.phase += this.phase_inc;
	    this.scope.process(this.i['IN'].get()/4)
	    if (this.phase > Math.PI * 2) {
	      this.phase -= Math.PI * 2;
	      this.scope.trig();
	    }
	}
}

engine.add_module_class(Scope);