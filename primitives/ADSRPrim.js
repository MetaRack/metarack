class ADSRPrim {
	 constructor(a = 1, d = 1, s = 0.1, r = 30) {
	 	this.phase = 0;
    	this.stage = 'R';
    	this.switch_level = 0;
    	this.set_param(a, d, s, r);

    	this.gate = 0;
    	this.out = 0;
    	this.prev_a = a;
	 }	

	 set_param (a, d, s, r) {
	 	this.A = a + 0.1;
    	this.D = d + 0.1;
    	this.S = s + 0.000001;
    	this.R = r + 0.1;
	 }

	 process () {
	 	var env = 0;
	    var lin = 0;
	    var sqr = 0;

	    if (this.prev_a < 0.1) this.prev_a = 0.1;
	    if (this.D < 0.1) this.D = 0.1;
	    if (this.S < 0.000001) this.S = 0.000001;
	    if (this.R < 0.1) this.R = 0.1;

	    if (this.prev_a > 10) this.prev_a = 10;
	    if (this.D > 10) this.D = 10;
	    if (this.S > 1) this.S = 1;
	    if (this.R > 50) this.R = 50;

	    if (this.gate > 0) {
	      switch(this.stage) {
	        case 'R':
	          this.stage = 'A';
	          this.phase = Math.pow(this.out / 10, 2) * this.prev_a;
	        case 'A':
	          env = Math.sqrt(this.phase / this.prev_a);
	          if (env >= 1) {
	            //console.log('A->D');
	            this.stage = 'D';
	            this.switch_level = env;
	          }
	          break;
	        case 'D':
	          sqr = this.S + (this.switch_level - Math.sqrt((this.phase - this.prev_a) / this.D)) * (this.switch_level - this.S);
	          lin = (this.phase - this.prev_a) / this.D;
	          env = sqr; //(1 - lin) * this.switch_level + lin * sqr;
	          if (env <= this.S) this.stage = 'S';
	          break;
	        case 'S':
	          env = this.out / 10;
	          break;

	      }
	    } else {
	      if (this.A < 0.1) this.A = 0.1;
	      if (this.A > 10) this.A = 10;
	      this.prev_a = this.A;
	      switch (this.stage) {
	        case 'A':
	          this.stage = 'R';
	          this.phase = 0.001;
	          this.switch_level = this.out / 10;
	        case 'D':
	          this.stage = 'R';
	          this.phase = 0.001;
	          this.switch_level = this.out / 10;
	        case 'S':
	          this.stage = 'R';
	          this.phase = 0.001;
	          this.switch_level = this.out / 10;
	        case 'R':
	          env = (1 - Math.sqrt(this.phase / this.R)) * this.switch_level;
	          if (env <= 0) env = 0;
	          break;
	      }
   		}

	    this.out = Math.min(env * 10, 10);
	    // console.log(env * 20 - 10, this.out);
	    // this.scope.process( this.out * 20 - 10 )
	    this.phase += 0.001;
	}
}