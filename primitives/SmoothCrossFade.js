class SmoothCrossFade {
	constructor(v = 0) {
		this.a = v;
		this.b = v;
		this.changed = false;
		this.sample_counter = 0;
    	this.nochange_counter = 0;
    	this.nochange_flag = false;
    	this.filter = new ExponentialFilterPrim({freq:50});
	}

	set(v) {
		this.a = this.b; 
		this.sample_counter = 0; 
		this.b = v; 
		this.changed = true;
	}

	get() { 
	    if (this.changed) {
	      this.nochange_counter = 0;
	      this.nochange_flag = false;
	      this.c = this.sample_counter / (sample_rate);
	      this.sample_counter++;
	      if (this.c <= 1) {
	        this.filter.in = (this.b * this.c + this.a * (1 - this.c));
	      }
	      else {
	      	this.a = this.b;
	        this.filter.in = this.b;
	        this.changed = false;
	      }
	      this.filter.process();
	      //console.log(this.filter.lp)
	      return this.filter.lp;
	      
	    }
	    else {
	      this.sample_counter = 0;
	      if (!this.nochange_flag) this.nochange_counter++;
	      if (this.nochange_counter > sample_rate) {
	        this.nochange_counter = 0;
	        this.nochange_flag = true;
	      }
	      this.a = this.b;
	      if (!this.nochange_flag) {
	        this.filter.in = this.b;
	        this.filter.process();
	        return this.filter.lp;
	      }
	      else {
	        return this.b;
	      }
	      //return this.b + this.mod_coef * this.port.get(); 
	    }
	}
}