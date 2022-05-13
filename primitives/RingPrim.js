class RingPrim {
	constructor () {
		this.in1 = 0;
		this.in2 = 0;
		this.pol = 0;
		this.out = 0;
		this.amp1 = 1;
		this.amp2 = 1;
		this.dw = 1;
	}
	process () {
		this.out = (this.in1 * (this.dw - 1) + (this.in1 * this.amp1 * (this.pol + this.in2 * this.amp2 / 1)) * this.dw) / (Math.abs(this.pol) + 1) ;
	}
}