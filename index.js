ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);

engine.set_size(rackwidth, rackheight);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);
engine.visible = true;

state_string = '{"modules":{"1":{"name":"RandomLead","i":{"MOD":{"val":"1.000000","mod":"0.100000"},"P4":{"val":"0.500000","mod":"0.100000"},"P5":{"val":"0.500000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.220497"},"P2":{"val":"0.500000","mod":"0.100000"},"P3":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[0,0]},"2":{"name":"RandomFX","i":{"LVL":{"val":"1.000000","mod":"0.100000"},"D/W":{"val":"1.000000","mod":"0.100000"},"MOD":{"val":"0.856246","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.100000"},"P2":{"val":"0.500000","mod":"0.175661"},"P3":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[0,1]},"3":{"name":"RandomScale","i":{"MOD":{"val":"1.000000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.230304"},"P2":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[5,0]},"4":{"name":"Clock","i":{"BPM":{"val":"153.626967","mod":"0.100000"}},"c":{"DIV1":"1.000000","DIV2":"1.000000","DIV3":"1.000000"},"pos":[5,1]},"5":{"name":"StereoMixer4","i":{"PAN1":{"val":"0.500000","mod":"0.100000"},"PAN2":{"val":"0.500000","mod":"0.100000"},"PAN3":{"val":"0.500000","mod":"0.100000"},"PAN4":{"val":"0.500000","mod":"0.100000"}},"c":{"AMP1":"0.505906","AMP2":"0.500000","AMP3":"0.500000","AMP4":"0.500000","AMP":"2.950364"},"pos":[10,0]},"6":{"name":"RandomNoise","i":{"MOD":{"val":"1.000000","mod":"0.100000"},"P4":{"val":"0.500000","mod":"0.100000"},"P5":{"val":"0.500000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.313671"},"P2":{"val":"0.500000","mod":"-0.225761"},"P3":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[15,1]},"12":{"name":"RandomGenerator","i":{"CV":{"val":"0.000000","mod":"0.100000"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"1.000000","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"1.000000"},"pos":[21,0]},"13":{"name":"RandomGenerator","i":{"CV":{"val":"0.000000","mod":"0.100000"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"1.000000","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"1.000000"},"pos":[20,1]}},"wires":[{"a":{"mid":"6","pid":"O/L"},"b":{"mid":"5","pid":"1L"}},{"a":{"mid":"6","pid":"O/R"},"b":{"mid":"5","pid":"1R"}},{"a":{"mid":"1","pid":"OUT"},"b":{"mid":"5","pid":"2L"}},{"a":{"mid":"2","pid":"O/L"},"b":{"mid":"5","pid":"3L"}},{"a":{"mid":"2","pid":"O/R"},"b":{"mid":"5","pid":"3R"}},{"a":{"mid":"1","pid":"OUT"},"b":{"mid":"2","pid":"I/L"}},{"a":{"mid":"1","pid":"OUT"},"b":{"mid":"2","pid":"I/R"}},{"a":{"mid":"3","pid":"OUT"},"b":{"mid":"1","pid":"PTCH"}},{"a":{"mid":"4","pid":"CLK"},"b":{"mid":"3","pid":"GATE"}},{"a":{"mid":"4","pid":"CLK"},"b":{"mid":"1","pid":"GATE"}},{"a":{"mid":"5","pid":"O/L"},"b":{"mid":0,"pid":"LEFT"}},{"a":{"mid":"5","pid":"O/R"},"b":{"mid":0,"pid":"RIGHT"}},{"a":{"mid":12,"pid":"OUT"},"b":{"mid":"6","pid":"P1"}},{"b":{"mid":"6","pid":"P2"},"a":{"mid":12,"pid":"OUT"}},{"b":{"mid":"3","pid":"P1"},"a":{"mid":12,"pid":"OUT"}},{"b":{"mid":"3","pid":"P2"},"a":{"mid":12,"pid":"OUT"}},{"a":{"mid":13,"pid":"OUT"},"b":{"mid":"2","pid":"P2"}},{"b":{"mid":"1","pid":"P1"},"a":{"mid":13,"pid":"OUT"}}]}'
state = JSON.parse(state_string)
engine.load_state(state);

// function setup() {
//   createCanvas(rackwidth, rackheight);
//   frameRate(fps);
// }

// function draw() { 
//   background(0,0,0,0);
//   engine.draw(0, 0); 
// }