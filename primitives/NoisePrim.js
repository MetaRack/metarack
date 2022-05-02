class NoisePrim {
	constructor (){
		this.out = 0;
	}

	process () {
		this.out = (rackrand() * 20 - 10)/10;
	}
}