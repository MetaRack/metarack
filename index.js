ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);


//engine = new Engine({w:rackwidth * 0.8, h:rackheight / 2});
engine.set_size(rackwidth, rackheight);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);
engine.visible = true;

// AUDIO
// n = 2;
// VCOs = [];
// for (var i = 0; i < n; i ++) {
//  VCOs.push(new VCO(261));
// }

// ADSR1 = new ADSR();

// VCA1 = new VCA();

// DLY1 = new Delay();

// FLTR1 = new ResonantFilter('LP');

// RVR1 = new DattorroReverb();
// RVR2 = new DattorroReverb();

// for (var i = 1; i < n; i ++) {
//  if (rackrand() > 0.2) VCOs[i - 1].o['OUT'].connect(VCOs[i].i['CV']);
// }

function expr(t, c, p1, p2, p3, p4) {
  return (((t / c) / 2 % (p1 * 13)) + 3) * 2 + (((t / c) / 4 % (p2 * 19)) >> (p3 * 3) + 1)  | (((t / c) ^ (p4) * 11))
}

function expr2(t, c, p1, p2, p3, p4) {
  return (t / c) / (2 + p3) * (((t / c) >> (7 + p2)) % 5)
}

// CL1 = new Clock();
// CH = new ClockedRandomChords();
// FL2 = new ExponentialFilter();
// BG = new BernoulliGate();
// BG2 = new BernoulliGate();
// BG3 = new BernoulliGate();
// SH1 = new SampleAndHold();
// SH2 = new SampleAndHold();
// SH3 = new SampleAndHold();
// VC1 = new SVCO(261);
// VC2 = new SVCO(261);
// VC3 = new SVCO(261);
// N = new Noise();
// A1 = new ADSR();
// A2 = new ADSR();
// A3 = new ADSR();
// V = new VCA();
// V2 = new VCA();
// V3 = new VCA();
// SCL = new Scale();
// SCL2 = new Scale();
// SCL3 = new Scale();
// RVR1 = new DattorroReverb();
// MIX2 = new Bus();

// SCL = new Scale();
// SCL2 = new Scale();
// N = new Noise();
// SH = new SampleAndHold();
// SH2 = new SampleAndHold();
// BG = new BernoulliGate();
// BG2 = new BernoulliGate();
// MIX2 = new Bus();

// P = new PingPong();
// MIX1 = new RandomGenerator();
// CLKD = new Clock(120);
// BG = new BernoulliGate();
// B1 = new ByteBeat(expr);
// FL = new ExponentialFilter(1000);
// FL2 = new ExponentialFilter(1000);
// MIX2 = new Bus();
// MIX3 = new Bus();
// SAT = new Saturn();
// SAT2 = new Saturn();
// SCL = new Scale();
// C = new Chorus();
// B = new Burst();
// JN = new NonlinearLab();
// FL2 = new ExponentialFilter(1000);
// FL3 = new ExponentialFilter(1000);
// MIX3 = new Bus();
// MIX4 = new Bus();
// RVR1 = new DattorroReverb();

// B2 = new ByteBeat(expr2);
// FL = new ExponentialFilter(1000);
// D = new Delay();
// MIX1 = new RandomGenerator();
// RVR1 = new DattorroReverb();
// C = new Chorus();
// BS = new Bus();
// cf = new CombFilter()

// BG = new BernoulliGate();
// BR = new Burst();
// JNO = new NonlinearLab();
// D1 = new Delay();
// D2 = new Delay();
// MIX2 = new Bus();
// MIX3 = new Bus();
// MIX4 = new Bus();

//GOOD BASS//
// CLKD = new Clock(120);
// JNO = new NonlinearLab();
// NOIS = new Noise();
// SH = new SampleAndHold();
// QNT1 = new Scale();
// OCT = new Offset();
// Fil = new SVF();
// Fil2 = new SVF();
// MIX1 = new Mixer();
// SAT = new Saturn();
// FL = new ExponentialFilter(1000);
// C = new Chorus();
// AD = new ADSR();
// VCA1 = new VCA();
// FL2 = new ExponentialFilter(1000);
// BG = new BernoulliGate();
//GOOD BASS//

//PLUCK SOUND
// CLKD = new Clock(120);
// JNO = new NonlinearLab();
// NOIS = new Noise();
// SH = new SampleAndHold();
// QNT1 = new Scale();
// OCT = new Offset();
// ST = new Saturn();
// MIX1 = new Bus();
// FL = new ExponentialFilter(1000);
// C = new Chorus();
// AD = new ADSR();
// VCA1 = new VCA();
//PLUCK SOUND



// n = 2 + Math.floor(rackrand() * 6);
// for(var i = 0; i < n; i ++) {
//   let j = Math.floor(rackrand() * 6);

//   switch (j) {
//     case 0: 
//       new VCO(261);
//       break;
//     case 1:
//       new ADSR(261);
//       break;
//     case 2:
//       new VCA();
//       break;
//     case 3:
//       new ResonantFilter('LP');
//       break;
//     case 4:
//       new DattorroReverb();
//       break;
//     case 5:
//       new Delay();
//       break;
//   }
// }

// for (var i = 0; i < n; i ++) {
//  VCOs[i].o['OUT'].connect(MIX.i['IN' + i.toString()]);
// }
// VCO0.o['OUT'].connect(VCO0.i['CV']);
// VCO1 = new VCO(64 - 2/16);
// VCO1.o['OUT'].connect(VCO0.i['CV']);

// MIX.o['OUT'].connect(engine.OUT);

// VCO3 = new VCO('VCO3', 0.1);
// SEQ1 = new Sequencer('SEQ1');
// FLTR4 = new SimpleOnePoleFilter('FLTR4', 'LP', 10);
// DLY1 = new Delay('DLY1');
// SH1 = new SampleAndHold('SH1');
// SH2 = new SampleAndHold('SH2');
// VCO4 = new VCO('VCO4', 2);
// VCO5 = new VCO('VCO5', 110);
// VCO6 = new VCO('VCO6', 0.5);
// SH3 = new SampleAndHold('SH3');
// SCL1 = new Scale('SCL1');
// VCO2 = new VCO('VCO2', 220);

// VCA1 = new VCA('VCA1');
// RVR1 = new DattorroReverb('RVR1');
// MIX1 = new Mixer('MIX1');
// NOIS1 = new Noise('NOIS1');
// FLTR1 = new ResonantFilter('FLTR1', 'LP');
// FLTR2 = new ResonantFilter('FLTR2', 'LP', 1900);
// FLTR3 = new ResonantFilter('FLTR3', 'HP', 261.63);
// VCO7 = new VCO('VCO7', 0.2);
// BGATE1 = new BernoulliGate('BGT1');
// FLTR5 = new ResonantFilter('FLTR5', 'LP', 400);

// engine.load_state(JSON.parse(`{"modules":{"1":{"name":"Clock","i":{"BPM":{"val":"119.788664","mod":"0.100000"}},"c":{"DIV1":"-6.000000","DIV2":"1.000000","DIV3":"1.000000"},"pos":[0,0]},"2":{"name":"ClockedRandomChords","i":{"A":{"val":"0.000100","mod":"0.100000"},"D":{"val":"3.754413","mod":"0.100000"},"S":{"val":"0.781206","mod":"0.100000"},"R":{"val":"42.010931","mod":"0.100000"},"SHPR":{"val":"0.518477","mod":"0.182421"},"SCL":{"val":"3.000000","mod":"0.100000"},"ROOT":{"val":"3.246826","mod":"0.100000"},"OFST":{"val":"-0.942216","mod":"0.145085"},"WDTH":{"val":"3.000000","mod":"0.100000"},"P1":{"val":"0.405603","mod":"0.204964"},"P2":{"val":"0.651392","mod":"0.244413"},"P3":{"val":"0.453506","mod":"0.230324"}},"c":{},"pos":[0,1]},"3":{"name":"ExponentialFilter","i":{"CV":{"val":"-0.225425","mod":"0.196510"},"RES":{"val":"0.313482","mod":"0.100000"}},"c":{"FREQ":"3891.674599"},"pos":[10,0]},"4":{"name":"DattorroReverb","i":{},"c":{"SIZE":"5.000000","DEC":"5.000000","D/W":"5.000000"},"pos":[10,1]},"5":{"name":"Bus","i":{"AMP1":{"val":"1.000000","mod":"0.100000"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[14,0]},"6":{"name":"RandomGenerator","i":{"CV":{"val":"0.000000","mod":"0.214826"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"2.325239","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"1.000000"},"pos":[14,1]},"7":{"name":"RandomGenerator","i":{"CV":{"val":"0.000000","mod":"0.100000"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"1.000000","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"1.288537"},"pos":[18,0]},"8":{"name":"Chorus","i":{"TIME":{"val":"2.000000","mod":"0.100000"},"LVL":{"val":"2.222931","mod":"0.100000"},"RATE":{"val":"0.200000","mod":"0.100000"}},"c":{},"pos":[18,1]},"9":{"name":"ByteBeat","i":{"P1":{"val":"6.283725","mod":"0.254980"},"P2":{"val":"3.501134","mod":"0.100000"},"P3":{"val":"4.332389","mod":"-0.158534"},"P4":{"val":"3.198219","mod":"0.100000"},"CLDV":{"val":"3.553320","mod":"0.100000"},"VLDV":{"val":"6.420770","mod":"0.340923"}},"c":{},"pos":[22,0]},"10":{"name":"PingPong","i":{"FB":{"val":"0.907013","mod":"0.100000"},"D/W":{"val":"1.000000","mod":"0.100000"},"TIME":{"val":"4.212008","mod":"0.282453"},"TM L":{"val":"-0.321231","mod":"-0.176146"},"TM R":{"val":"-0.739676","mod":"0.179603"}},"c":{},"pos":[22,1]},"11":{"name":"ExponentialFilter","i":{"CV":{"val":"0.000000","mod":"-0.159943"},"RES":{"val":"0.243741","mod":"0.100000"}},"c":{"FREQ":"3276.255871"},"pos":[29,0]},"12":{"name":"ExponentialFilter","i":{"CV":{"val":"0.000000","mod":"0.100000"},"RES":{"val":"0.221903","mod":"0.100000"}},"c":{"FREQ":"2939.132632"},"pos":[30,1]},"13":{"name":"Bus","i":{"AMP1":{"val":"0.316400","mod":"0.223984"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[33,0]},"14":{"name":"Chorus","i":{"TIME":{"val":"2.000000","mod":"0.100000"},"LVL":{"val":"1.000000","mod":"0.100000"},"RATE":{"val":"0.200000","mod":"0.100000"}},"c":{},"pos":[34,1]},"15":{"name":"Bus","i":{"AMP1":{"val":"0.400230","mod":"0.205668"},"AMP2":{"val":"0.999296","mod":"0.100000"}},"c":{},"pos":[37,0]},"16":{"name":"ExponentialFilter","i":{"CV":{"val":"0.000000","mod":"0.100000"},"RES":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"3489.307450"},"pos":[38,1]},"17":{"name":"ExponentialFilter","i":{"CV":{"val":"0.000000","mod":"0.100000"},"RES":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"3943.478948"},"pos":[41,0]},"18":{"name":"ADSR","i":{},"c":{"A":"1.000000","D":"1.000000","S":"0.000100","R":"30.000000"},"pos":[42,1]},"19":{"name":"ADSR","i":{},"c":{"A":"0.000100","D":"5.776194","S":"0.000100","R":"30.000000"},"pos":[45,0]},"20":{"name":"BernoulliGate","i":{"P":{"val":"0.296413","mod":"0.100000"}},"c":{},"pos":[46,1]},"21":{"name":"VCA","i":{},"c":{"VOL":"10.000000"},"pos":[49,0]},"22":{"name":"Noise","i":{},"c":{"AMP":"1.000000"},"pos":[50,1]},"23":{"name":"ExponentialFilter","i":{"CV":{"val":"0.000000","mod":"0.207781"},"RES":{"val":"0.865773","mod":"-0.205028"}},"c":{"FREQ":"1281.610040"},"pos":[53,0]},"24":{"name":"RandomGenerator","i":{"CV":{"val":"0.000000","mod":"0.100000"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"1.000000","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"0.704425"},"pos":[54,1]},"25":{"name":"Bus","i":{"AMP1":{"val":"0.509701","mod":"0.139449"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[57,0]},"26":{"name":"Bus","i":{"AMP1":{"val":"0.512518","mod":"0.126769"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[58,1]},"27":{"name":"Saturn","i":{"SAT":{"val":"0.000000","mod":"0.100000"},"FOLD":{"val":"4.000000","mod":"0.100000"}},"c":{},"pos":[61,0]},"28":{"name":"Saturn","i":{"SAT":{"val":"0.000000","mod":"0.100000"},"FOLD":{"val":"4.000000","mod":"0.100000"}},"c":{},"pos":[62,1]},"29":{"name":"DattorroReverb","i":{},"c":{"SIZE":"5.000000","DEC":"5.000000","D/W":"5.056356"},"pos":[65,0]},"30":{"name":"Bus","i":{"AMP1":{"val":"0.139863","mod":"0.100000"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[66,1]},"31":{"name":"Bus","i":{"AMP1":{"val":"0.109570","mod":"0.100000"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[69,0]},"32":{"name":"DattorroReverb","i":{},"c":{"SIZE":"5.000000","DEC":"5.000000","D/W":"5.000000"},"pos":[70,1]},"33":{"name":"DattorroReverb","i":{},"c":{"SIZE":"5.000000","DEC":"5.000000","D/W":"5.000000"},"pos":[73,0]},"34":{"name":"Bus","i":{"AMP1":{"val":"0.496438","mod":"0.100000"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[74,1]},"35":{"name":"Bus","i":{"AMP1":{"val":"0.500635","mod":"0.100000"},"AMP2":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[77,0]},"36":{"name":"Saturn","i":{"SAT":{"val":"0.000000","mod":"0.100000"},"FOLD":{"val":"1.379199","mod":"0.100000"}},"c":{},"pos":[78,1]},"37":{"name":"Saturn","i":{"SAT":{"val":"0.000000","mod":"0.100000"},"FOLD":{"val":"1.580624","mod":"0.100000"}},"c":{},"pos":[81,0]}},"wires":[{"a":{"mid":1,"pid":"CLK"},"b":{"mid":2,"pid":"GATE"}},{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"IN"}},{"a":{"mid":3,"pid":"LP"},"b":{"mid":4,"pid":"IN"}},{"a":{"mid":4,"pid":"OUT"},"b":{"mid":5,"pid":"IN2"}},{"a":{"mid":5,"pid":"OUT"},"b":{"mid":8,"pid":"IN"}},{"a":{"mid":3,"pid":"LP"},"b":{"mid":5,"pid":"IN1"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":3,"pid":"CV"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":6,"pid":"CV"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":2,"pid":"SHPR"}},{"a":{"mid":8,"pid":"OUTL"},"b":{"mid":27,"pid":"IN"}},{"a":{"mid":8,"pid":"OUTR"},"b":{"mid":28,"pid":"IN"}},{"a":{"mid":9,"pid":"OUT"},"b":{"mid":21,"pid":"IN"}},{"a":{"mid":10,"pid":"O/L"},"b":{"mid":11,"pid":"IN"}},{"a":{"mid":10,"pid":"O/R"},"b":{"mid":12,"pid":"IN"}},{"a":{"mid":16,"pid":"HP"},"b":{"mid":13,"pid":"IN1"}},{"a":{"mid":17,"pid":"HP"},"b":{"mid":15,"pid":"IN1"}},{"a":{"mid":13,"pid":"OUT"},"b":{"mid":30,"pid":"IN2"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":9,"pid":"P1"}},{"a":{"mid":15,"pid":"OUT"},"b":{"mid":31,"pid":"IN2"}},{"a":{"mid":11,"pid":"HP"},"b":{"mid":16,"pid":"IN"}},{"a":{"mid":12,"pid":"HP"},"b":{"mid":17,"pid":"IN"}},{"a":{"mid":1,"pid":"CLK"},"b":{"mid":20,"pid":"IN"}},{"a":{"mid":20,"pid":"OUTL"},"b":{"mid":19,"pid":"GATE"}},{"a":{"mid":19,"pid":"OUT"},"b":{"mid":21,"pid":"CV"}},{"a":{"mid":21,"pid":"OUT"},"b":{"mid":10,"pid":"I/L"}},{"a":{"mid":22,"pid":"OUT"},"b":{"mid":23,"pid":"IN"}},{"a":{"mid":23,"pid":"LP"},"b":{"mid":14,"pid":"IN"}},{"a":{"mid":14,"pid":"OUTL"},"b":{"mid":25,"pid":"IN1"}},{"a":{"mid":14,"pid":"OUTR"},"b":{"mid":26,"pid":"IN1"}},{"a":{"mid":24,"pid":"OUT"},"b":{"mid":23,"pid":"CV"}},{"a":{"mid":24,"pid":"OUT"},"b":{"mid":23,"pid":"RES"}},{"a":{"mid":25,"pid":"OUT"},"b":{"mid":13,"pid":"IN2"}},{"a":{"mid":26,"pid":"OUT"},"b":{"mid":15,"pid":"IN2"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":25,"pid":"AMP1"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":26,"pid":"AMP1"}},{"a":{"mid":27,"pid":"OUT"},"b":{"mid":25,"pid":"IN2"}},{"a":{"mid":28,"pid":"OUT"},"b":{"mid":26,"pid":"IN2"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":13,"pid":"AMP1"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":15,"pid":"AMP1"}},{"a":{"mid":24,"pid":"OUT"},"b":{"mid":11,"pid":"CV"}},{"a":{"mid":24,"pid":"OUT"},"b":{"mid":12,"pid":"CV"}},{"a":{"mid":29,"pid":"OUT"},"b":{"mid":30,"pid":"IN1"}},{"a":{"mid":29,"pid":"OUT"},"b":{"mid":31,"pid":"IN1"}},{"a":{"mid":11,"pid":"HP"},"b":{"mid":29,"pid":"IN"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":9,"pid":"VLDV"}},{"a":{"mid":20,"pid":"OUTL"},"b":{"mid":10,"pid":"SYNC"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":9,"pid":"P3"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":2,"pid":"P1"}},{"a":{"mid":24,"pid":"OUT"},"b":{"mid":2,"pid":"P2"}},{"a":{"mid":7,"pid":"OUT"},"b":{"mid":2,"pid":"P3"}},{"a":{"mid":31,"pid":"OUT"},"b":{"mid":35,"pid":"IN1"}},{"a":{"mid":30,"pid":"OUT"},"b":{"mid":34,"pid":"IN1"}},{"b":{"mid":32,"pid":"IN"},"a":{"mid":30,"pid":"OUT"}},{"a":{"mid":33,"pid":"OUT"},"b":{"mid":37,"pid":"IN"}},{"b":{"mid":33,"pid":"IN"},"a":{"mid":31,"pid":"OUT"}},{"a":{"mid":32,"pid":"OUT"},"b":{"mid":36,"pid":"IN"}},{"a":{"mid":35,"pid":"OUT"},"b":{"mid":0,"pid":"LEFT"}},{"b":{"mid":0,"pid":"RIGHT"},"a":{"mid":34,"pid":"OUT"}},{"a":{"mid":37,"pid":"OUT"},"b":{"mid":35,"pid":"IN2"}},{"a":{"mid":36,"pid":"OUT"},"b":{"mid":34,"pid":"IN2"}}]}`));
engine.load_state(JSON.parse(`{"modules":{"1":{"name":"Clock","i":{"BPM":{"val":"101.000000","mod":"0.100000"}},"c":{"DIV1":"2.000000","DIV2":"1.000000","DIV3":"1.000000"},"pos":[0,0]},"2":{"name":"ClockedRandomChords","i":{"A":{"val":"1.000000","mod":"0.503524"},"D":{"val":"2.763953","mod":"0.100000"},"S":{"val":"0.535661","mod":"0.100000"},"R":{"val":"30.000000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.100000"},"P2":{"val":"0.700000","mod":"0.100000"},"P3":{"val":"0.500000","mod":"0.100000"},"SHPR":{"val":"0.389042","mod":"0.816885"},"SCL":{"val":"3.000000","mod":"0.100000"},"ROOT":{"val":"0.000000","mod":"0.689523"},"OFST":{"val":"-0.992562","mod":"0.100000"},"WDTH":{"val":"2.055667","mod":"0.100000"}},"c":{},"pos":[10,0]},"3":{"name":"DattorroReverb","i":{"SIZE":{"val":"0.576922","mod":"0.229884"}},"c":{"DEC":"0.835939","D/W":"0.497421"},"pos":[20,0]},"4":{"name":"Info","i":{},"c":{},"pos":[32,1]},"5":{"name":"VCO","i":{"CV":{"val":"-8.726098","mod":"0.100000"},"FM":{"val":"0.000000","mod":"0.100000"},"WAVE":{"val":"0.012791","mod":"0.442365"},"PW":{"val":"0.500000","mod":"0.100000"},"AMP":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[23,0]},"6":{"name":"VCO","i":{"CV":{"val":"-9.104401","mod":"0.100000"},"FM":{"val":"0.000000","mod":"0.100000"},"WAVE":{"val":"0.012791","mod":"0.100000"},"PW":{"val":"0.500000","mod":"0.100000"},"AMP":{"val":"1.000000","mod":"0.100000"}},"c":{},"pos":[0,1]}},"wires":[{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"I/R"}},{"a":{"mid":2,"pid":"OUT"},"b":{"mid":3,"pid":"I/L"}},{"a":{"mid":1,"pid":"CLK 1"},"b":{"mid":2,"pid":"GATE"}},{"a":{"mid":5,"pid":"OUT"},"b":{"mid":2,"pid":"SHPR"}},{"b":{"mid":5,"pid":"WAVE"},"a":{"mid":5,"pid":"OUT"}},{"b":{"mid":2,"pid":"A"},"a":{"mid":5,"pid":"OUT"}},{"a":{"mid":6,"pid":"OUT"},"b":{"mid":3,"pid":"SIZE"}},{"b":{"mid":6,"pid":"WAVE"},"a":{"mid":5,"pid":"OUT"}},{"a":{"mid":3,"pid":"O/R"},"b":{"mid":0,"pid":"RIGHT"}},{"a":{"mid":3,"pid":"O/L"},"b":{"mid":0,"pid":"LEFT"}}]}`));

function setup() {
  createCanvas(rackwidth, rackheight);
  frameRate(fps);
}

function draw() { 
  background(0,0,0,0);
  engine.draw(0, 0); 
}

// VCO5.i['WAVE'].set(-1);
// VCO5.o['OUT'].connect(FLTR5.i['IN']);

// BGATE1.i['P'].set(4);
// BGATE1.o['OUT'].connect(SH3.i['GATE']);

// RVR1.o['OUT'].connect(FLTR1.i['IN']);

// FLTR1.i['RES'].set(1);
// FLTR1.o['OUT'].connect(engine.OUT);

// VCO3.o['OUT'].connect(FLTR1.i['FREQ'], 0.2, 2);

// VCO0.i['WAVE'].set(-1);
// VCO0.o['OUT'].connect(SEQ1.i['GATE']);

// SEQ1.set_random_sequence(0);
// SEQ1.o['OUT1'].connect(FLTR4.i['IN']);

// FLTR4.o['OUT'].connect(DLY1.i['IN']);

// DLY1.i['TIME'].set(-7.337);
// DLY1.i['FB'].set(5);
// DLY1.i['D/W'].set(0.5);
// DLY1.o['OUT'].connect(SH1.i['IN']);

// VCO1.i['WAVE'].set(-1);
// VCO1.o['OUT'].connect(SH1.i['GATE']);

// SH1.o['OUT'].connect(SH2.i['IN']);

// VCO4.i['WAVE'].set(-1);
// VCO4.o['OUT'].connect(BGATE1.i['IN']);
// VCO4.o['OUT'].connect(SH2.i['GATE']);

// ADSR1.i['A'].set(0.01);
// ADSR1.i['D'].set(0.3);
// ADSR1.i['S'].set(0.5);
// ADSR1.i['R'].set(0.5);
// ADSR1.o['OUT'].connect(VCA1.i['CV']);

// SCL1.o['GATE'].connect(ADSR1.i['GATE']);
// SCL1.o['1ST'].connect(VCO2.i['FM']);
// SCL1.o['1ST'].connect(SH3.i['IN']);

// SH3.o['OUT'].connect(VCO5.i['FM']);

// SH2.o['OUT'].connect(SCL1.i['IN'], 0.2, 0);

// VCO2.o['OUT'].connect(VCA1.i['IN']);

// VCA1.o['OUT'].connect(MIX1.i['IN1']);
// MIX1.o['OUT'].connect(RVR1.i['IN']);

// FLTR5.i['RES'].set(1);
// FLTR5.o['OUT'].connect(MIX1.i['IN3']);

// MIX1.i['IN1_CV'].set(7);
// MIX1.i['IN2_CV'].set(2);
// MIX1.i['IN3_CV'].set(8);

// FLTR3.i['RES'].set(0);
// FLTR3.o['OUT'].connect(MIX1.i['IN2']);

// VCO7.o['OUT'].connect(FLTR2.i['FREQ'], 0.2, 0);

// NOIS1.o['OUT'].connect(FLTR2.i['IN']);

// FLTR2.i['RES'].set(1);
// FLTR2.o['OUT'].connect(FLTR3.i['IN']);