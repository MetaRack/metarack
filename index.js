ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);

engine.set_size(rackwidth, rackheight);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);
engine.visible = true;

engine.load_state(JSON.parse(`{"modules":{"1":{"name":"Clock","i":{"BPM":{"val":"101.000000","mod":"0.100000"}},"c":{"DIV1":"2.000000","DIV2":"1.000000","DIV3":"1.000000"},"pos":[0,0]},"2":{"name":"ClockedRandomChords","i":{"A":{"val":"1.000000","mod":"0.503524"},"D":{"val":"2.763953","mod":"0.100000"},"S":{"val":"0.535661","mod":"0.100000"},"R":{"val":"30.000000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.100000"},"P2":{"val":"0.700000","mod":"0.100000"},"P3":{"val":"0.500000","mod":"0.100000"},"SHPR":{"val":"0.389042","mod":"0.816885"},"SCL":{"val":"3.000000","mod":"0.100000"},"ROOT":{"val":"0.000000","mod":"0.689523"},"OFST":{"val":"-0.992562","mod":"0.100000"},"WDTH":{"val":"2.055667","mod":"0.100000"}},"c":{},"pos":[10,0]},"3":{"name":"DattorroReverb","i":{"SIZE":{"val":"0.576922","mod":"0.229884"}},"c":{"DEC":"0.835939","D/W":"0.497421"},"pos":[20,0]},"4":{"name":"Info","i":{},"c":{},"pos":[32,1]},"5":{"name":"VCO","i":{"CV":{"val":"-8.726098","mod":"0.100000"},"FM":{"val":"0.000000","mod":"0.100000"},"WAVE":{"val":"0.012791","mod":"0.442365"},"PW":{"val":"0.500000","mod":"0.100000"},"AMP":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[23,0]},"6":{"name":"VCO","i":{"CV":{"val":"-9.104401","mod":"0.100000"},"FM":{"val":"0.000000","mod":"0.100000"},"WAVE":{"val":"0.012791","mod":"0.100000"},"PW":{"val":"0.500000","mod":"0.100000"},"AMP":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[0,1]}},"wires":[{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"I/R"}},{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"I/L"}},{"a":{"mid":1,"pid":"CLK 1"},"b":{"mid":2,"pid":"GATE"}},{"a":{"mid":5,"pid":"OUT"},"b":{"mid":2,"pid":"SHPR"}},{"b":{"mid":5,"pid":"WAVE"},"a":{"mid":5,"pid":"OUT"}},{"b":{"mid":2,"pid":"A"},"a":{"mid":5,"pid":"OUT"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":3,"pid":"SIZE"}},{"b":{"mid":6,"pid":"WAVE"},"a":{"mid":5,"pid":"OUT"}},{"a":{"mid":3,"pid":"O/R"},"b":{"mid":0,"pid":"RIGHT"}},{"a":{"mid":3,"pid":"O/L"},"b":{"mid":0,"pid":"LEFT"}}]}`));

function setup() {
  createCanvas(rackwidth, rackheight);
  frameRate(fps);
}

function draw() { 
  background(0,0,0,0);
  engine.draw(0, 0); 
}