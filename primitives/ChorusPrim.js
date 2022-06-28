class ChorusPrim {
	constructor() {
		this.in = 0;
		this.out_l = 0;
		this.out_r = 0;

    	this.base_time = 0.03;
    	this.level = 3;
    	this.rate = 0.2;
    	this.LFO = new VCOPrim();
    	this.LFO.set_frequency(this.rate);
    	this.DelayL = new DelayPrim();
    	this.DelayR = new DelayPrim();
    	this.DelayL.time = this.base_time;
    	this.DelayR.time = this.base_time;
    	this.DelayR.fb = 0.66;
    	this.DelayR.dw = 0.5;
    	this.DelayL.fb = 0.66;
    	this.DelayL.dw = 0.5;
    	this.in = 0;
    	this.out_l = 0;
    	this.out_r = 0;
	}

	process() {
		if (this.time < 0.001) this.time = 0.001;
		if (this.time > 4) this.time = 4;

		if (this.level < 0.001) this.level = 0.001;
		if (this.level > 4) this.level = 4;

		if (this.rate < 0.001) this.rate = 0.001;
		if (this.rate > 5) this.rate = 5;

    	this.LFO.set_frequency(this.rate);

		this.DelayL.time = this.base_time * Math.pow(2, Math.abs(this.LFO.out) / 10 * this.level);
		this.DelayR.time = this.base_time * Math.pow(2, -1*Math.abs(this.LFO.out) / 10 * this.level);
		this.DelayL.in = this.in;
		this.DelayR.in = this.in;

		this.LFO.process();
		this.DelayL.process();
		this.DelayR.process();

		this.out_l = this.DelayL.out;
		this.out_r = this.DelayR.out;
	}
}