<p align="center">
  <img width="600" height="450" src="https://media.giphy.com/media/BYtdKil4uF281YWoEY/giphy.gif">
</p>

# cryptorack
Javascript modular synthesizer with NFT in mind 🤦

### [Try online](http://165.232.84.250:1337/17aa5afb9bce4072cb3f65ed67bf3e3e93f244d768de08b23a46fd6c3b8bf6033f230d746535125d8de77d5342/index.html)

# run server

```uvicorn server:app --reload --host 0.0.0.0 --port 1337 --log-config log_format.yaml --log-level 'info' --use-colors```

# how to
In general Cryptorack is a simple declarative API allowing you to describe some modular patch, create your own visuals using [p5js](https://p5js.org), modulate them from each other and run the whole thing in browser.

Create a new module:

` VCO0 = new VCO('VCO0', 1337) ` - create a VCO with displaying name 'VCO0' and base frequency of 1337 Hz

Then to connect one module to another:

` VCO0.o['OUT'].connect(VCO1.i['FM'], scale=1, offset=0) ` - connect VCO0 output to FM input of VCO1 with scale 1 and offset 0 (scale is applied first).

Set some parameters of module:

` VCO0.i['WAVE'].set(-1) ` - set VCO0 to be square shaped.

And finally to connect module to audio output:

` VCO0.o['OUT'].connect(engine.OUT) `

That's it! To check which inputs/outputs each module has simply go to modules folder and see module constructors. You also can find a self-explanatory (I believe) example of a patch in [index.js](index.js)

# development
To implement some new audio module simply create a new file in modules directory using VCO module as a template. Module class must implement methods draw() and process() called every frame and every sample respectively. Everything else is up to you.

Visual modules are very similar to audio ones, they also implement draw() and process() methods, but their inputs and outputs should be of type InvisiblePort instead of Port.

# licensing
By default commercial use (incl. NFTs and all this crypto shit) is not allowed. For commercial use please contact ilya.belikov@phystech.edu and I will ask you to share some very small percentage of your revenue.

# acknowledgements
All the graphics are made using [p5js](https://p5js.org) and the project itself was inspired by [fxhash.xyz](https://fxhash.xyz) platform

# social
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ferluht) [![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/neurussia)
