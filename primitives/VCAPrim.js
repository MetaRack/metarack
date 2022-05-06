class VCAPrim {
	constructor (cv = 10) {
		this.cv = cv;
		this.in = 0;
		this.out = 0;
		this.vol = 10;
	}

	process () {
		//this.out = this.in * (Math.log(this.vol/10 * this.cv/10 + 1));
		this.out = this.in * this.vol/10 * this.cv/10 ;
	}
}