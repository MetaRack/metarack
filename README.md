<p align="center">
  <img width="600" height="450" src="https://media.giphy.com/media/BYtdKil4uF281YWoEY/giphy.gif">
</p>

# metarack
Javascript modular synthesizer with NFT in mind 🤦

### [Try online](http://metarack.art/17aa5afb9bce4072cb3f65ed67bf3e3e93f244d768de08b23a46fd6c3b8bf6033f230d746535125d8de77d5342/index.html)

# development
To implement some new audio module simply create a new file in modules directory using VCO module as a template. Module class must implement methods draw() and process() called every frame and every sample respectively. Everything else is up to you.

Visual modules are very similar to audio ones, they also implement draw() and process() methods, but their inputs and outputs should be of type InvisiblePort instead of Port.

# licensing
By default commercial use (incl. NFTs and all this crypto shit) is not allowed. For commercial use please contact contact [info@metarack.art](info@metarack.art)

# acknowledgements
All the graphics are made using [p5js](https://p5js.org) and the project itself was inspired by [fxhash.xyz](https://fxhash.xyz) platform

# social
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ferluht)
