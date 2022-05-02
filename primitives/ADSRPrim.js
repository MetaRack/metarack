class ADSRPrim {
	 constructor(a = 1, d = 1, s = 0.1, r = 30) {
	 	this.phase = 0;
    	this.stage = 'R';
    	this.switch_level = 0;
    	this.set_param(a, d, s, r);

    	this.gate = 0;
    	this.out = 0;
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

	    if (this.gate > 0) {
	      switch(this.stage) {
	        case 'R':
	          this.stage = 'A';
	          this.phase = Math.pow(this.out / 10, 2) * this.A;
	        case 'A':
	          env = Math.sqrt(this.phase / this.A);
	          if (env >= 1) {
	            console.log('A->D');
	            this.stage = 'D';
	            this.switch_level = env;
	          }
	          break;
	        case 'D':
	          sqr = this.S + (this.switch_level - Math.sqrt((this.phase - this.A) / this.D)) * (this.switch_level - this.S);
	          lin = (this.phase - this.A) / this.D;
	          env = sqr; //(1 - lin) * this.switch_level + lin * sqr;
	          if (env <= this.S) this.stage = 'S';
	          break;
	        case 'S':
	          env = this.out / 10;
	          break;

	      }
	    } else {
	      switch (this.stage) {
	        case 'A':
	        case 'D':
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

	    this.out = env * 10;
	    // console.log(env * 20 - 10, this.out);
	    // this.scope.process( this.out * 20 - 10 )
	    this.phase += 0.001;
	}
}