class DattorroReverbProcessor {

    constructor() {
      this.input = 0.0;
      this.output = 0.0;
      
      this.out = 0.0;
      this.inputLowCut = 10.0;
      this.inputHighCut = 15000.0;
      this.reverbHighCut = 10000.0;
      this.reverbLowCut = 0.0;
      this.inputDiffusion1 = 0.75;
      this.inputDiffusion2 = 0.625;
      this.plateDiffusion1 = 0.7;
      this.plateDiffusion2 = 0.5;
      this.decay = 0.9999;
      this.diffuseInput = 1.0;

      this._timeScale = 1.0;
      this._preDelayTime = 0.0;
      this._kInApf1Time = 141;
      this._kInApf2Time = 107;
      this._kInApf3Time = 379;
      this._kInApf4Time = 277;

      this._kApf1Time = 672;
      this._kDelay1Time = 4453;
      this._kApf2Time = 1800;
      this._kDelay2Time = 3720;

      this._kTaps = [266, 2974, 1913, 1996, 1990, 187, 1066];
      this._scaledTaps = [0,0,0,0,0,0,0];

      this._dattorroSampleRate = 29761.0;
      this._sampleRate = sample_rate;

      this._dattorroScaleFactor = this._sampleRate / this._dattorroSampleRate;

      for(var i = 0; i < 7; i++) {
        this._scaledTaps[i] = this.dattorroScale(this._kTaps[i]);
      }
      
      this._apf1Time = this.dattorroScale(this._kApf1Time);
      this._apf2Time = this.dattorroScale(this._kApf2Time);

      this._decay = this.decay;
      this._sum = 0.0;

      this._fade = 1.0;
      this._fadeTime = 0.002;
      this._fadeStep = 1.0 / (this._fadeTime * this._sampleRate);
      this._fadeDir = 1.0;

      this._inputDCBlock = new OnePoleHPFilter(20.0);
      this._inputLpf = new OnePoleLPFilter(this.inputHighCut);
      this._inputHpf = new OnePoleHPFilter(this.inputLowCut);
      this._preDelay = new InterpDelay(192010, 0);

      this._inApf1 = new AllPassFilter(this.dattorroScale(20 * this._kInApf1Time), this.dattorroScale(this._kInApf1Time), this.inputDiffusion1);
      this._inApf2 = new AllPassFilter(this.dattorroScale(20 * this._kInApf2Time), this.dattorroScale(this._kInApf2Time), this.inputDiffusion1);
      this._inApf3 = new AllPassFilter(this.dattorroScale(20 * this._kInApf3Time), this.dattorroScale(this._kInApf3Time), this.inputDiffusion2);
      this._inApf4 = new AllPassFilter(this.dattorroScale(20 * this._kInApf4Time), this.dattorroScale(this._kInApf4Time), this.inputDiffusion2);
      this._tankFeed = 0.0;

      // this._apf1.gain = -this.plateDiffusion1;
      // this._apf2.gain = this.plateDiffusion2;

      // this._apf1.delay.setDelayTime(this._apf1Time);
      // this._apf2.delay.setDelayTime(this._apf2Time);

      // this._filter.setCutoffFreq(this.reverbHighCut);
      // this._hpf.setCutoffFreq(this.reverbLowCut);

      this._apf1 = new AllPassFilter(this.dattorroScale(40 * this._kApf1Time), this.dattorroScale(this._kApf1Time), -this.plateDiffusion1);
      this._delay1 = new InterpDelay(this.dattorroScale(40 * this._kDelay1Time), this.dattorroScale(this._kDelay1Time));
      this._filter = new OnePoleLPFilter(this.reverbHighCut);
      this._hpf = new OnePoleHPFilter(this.reverbLowCut);
      this._apf2 = new AllPassFilter(this.dattorroScale(40 * this._kApf2Time), this.dattorroScale(this._kApf2Time), this.plateDiffusion2);
      this._delay2 = new InterpDelay(this.dattorroScale(40 * this._kDelay2Time), this.dattorroScale(this._kDelay2Time));

      this._outDCBlock = new OnePoleHPFilter(20.0);
    }


    dattorroScale(delayTime) {
      return delayTime * this._dattorroScaleFactor;
    }

    setTimeScale(timeScale) {
      if (timeScale == this._timeScale) {
        return;
      }

      this._timeScale = timeScale;
      if(this._timeScale < 0.0001) {
        this._timeScale = 0.0001;
      }

      this._delay1.setDelayTime(this.dattorroScale(this._kDelay1Time * this._timeScale));
      this._delay2.setDelayTime(this.dattorroScale(this._kDelay2Time * this._timeScale));
      this._apf1Time = this.dattorroScale(this._kApf1Time * this._timeScale);
      this._apf2Time = this.dattorroScale(this._kApf2Time * this._timeScale);
    }


    setPreDelay(t) {
      if (t == this._preDelayTime) {
        return;
      }

      this._preDelayTime = t;
      this._preDelay.setDelayTime(this._preDelayTime * this._sampleRate);
    }

    clear() {
      this.input = 0.0;
      this.output = 0.0;

      this._preDelay.clear();
      this._inputLpf.clear();
      this._inputHpf.clear();
      this._inApf1.clear();
      this._inApf2.clear();
      this._inApf3.clear();
      this._inApf4.clear();

      this._apf1.clear();
      this._delay1.clear();
      this._filter.clear();
      this._hpf.clear();
      this._apf2.clear();
      this._delay2.clear();

      this._inputDCBlock.clear();
      this._outDCBlock.clear();
      
      this._sum = 0.0;
      this.out = 0.0;
    }

    
    process(sample) {
      this.input = sample;

      this._decay = this.decay;

      this._inputDCBlock.input = this.input;
      this._inputLpf.input = this._inputDCBlock.process();
      this._inputHpf.input = this._inputLpf.process();
      this._preDelay.input = this._inputHpf.process();;
      this._inApf1.input = this._preDelay.process();
      this._inApf2.input = this._inApf1.process();
      this._inApf3.input = this._inApf2.process();
      this._inApf4.input = this._inApf3.process();
      this._tankFeed = this._preDelay.output * (1.0 - this.diffuseInput) + this._inApf4.process() * this.diffuseInput;
      this._sum += this._tankFeed;

      this._apf1.input = this._sum;
      this._delay1.input = this._apf1.process();
      this._filter.input = this._delay1.process();
      this._hpf.input = this._filter.process();
      this._apf2.input = (this._delay1.output * (1.0 - this._fade) + this._hpf.process() * this._fade) * this._decay;
      this._delay2.input = this._apf2.process();
      this._delay2.process();

      this._sum = this._delay2.output * this._decay; // bylo 2

      this._outDCBlock.input = this._apf1.output;
      // console.log(this._scaledTaps[0]);
      this._outDCBlock.input += this._delay1.tap(this._scaledTaps[0]);
      this._outDCBlock.input += this._delay1.tap(this._scaledTaps[1]);
      this._outDCBlock.input -= this._apf2.delay.tap(this._scaledTaps[2]);
      this._outDCBlock.input += this._delay2.tap(this._scaledTaps[3]);
      this._outDCBlock.input -= this._delay1.tap(this._scaledTaps[4]);
      this._outDCBlock.input -= this._apf2.delay.tap(this._scaledTaps[5]);
      this._outDCBlock.input -= this._delay2.tap(this._scaledTaps[6]);

      this.out = this._outDCBlock.process() * 0.5;

      this._fade += this._fadeStep * this._fadeDir;
      this._fade = (this._fade < 0.0) ? 0.0 : ((this._fade > 1.0) ? 1.0 : this._fade);

      this.output = this.out;
      return this.output;
    }
};