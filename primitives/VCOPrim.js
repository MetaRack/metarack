class VCOPrim {
	constructor(freq = 120) {
	    this.freq = freq;
	    this.delta = Math.PI * 2 / (sample_rate / freq);
	    this.phase = 0;

	    let cv = 0.0001;
	    this.cv = cv;
	    this.fm = 0;
	    this.wave = 0;
	    this.pw = 0.5;
	    this.amp = 1;
	    this.out = 0;

	    this.value = 0;
	    this.type = 0;
	    this.mod = 0;
	    this.mod_prev = 0;
	    this.phase_inc = 0;

	    this._alpha = 0.01;
  	}

  	set_frequency(f) {
    	this.freq = f;
    	this.delta = Math.PI * 2 / (sample_rate / f);
    	this.mod = this._alpha * (this.cv + this.fm) + (1 - this._alpha) * this.mod;
    	this.phase_inc = this.delta * Math.pow(2, this.mod);
  	}

  	set_wave(v) {
  		this.wave = v;
    	this.type = this.wave / 10;
  	}

  	process() {
	    this.type = this.wave / 10;
	    if (this.type >= 0) {
	      this.value = Math.sin(this.phase) * (1 - this.type) + (this.phase / Math.PI - 1) * this.type;
	    } else {
	      this.value = Math.sin(this.phase) * (1 + this.type) - ((this.phase < Math.PI * this.pw * 2 ) * 2 - 1) * this.type;
	    }
	    this.out = this.value * this.amp;
	    this.mod = this._alpha * (this.cv + this.fm) + (1 - this._alpha) * this.mod;
	    if (this.mod != this.mod_prev) { this.phase_inc = this.delta * Math.pow(2, this.mod); this.mod_prev = this.mod; }
	    this.phase += this.phase_inc;
	    if (this.phase > Math.PI * 2) {
	      this.phase -= Math.PI * 2;
	    }
  	}
	
}