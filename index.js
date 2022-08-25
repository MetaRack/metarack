ms = new ModuleStyle(panel=255, frame=60, shadow=70, name=40, lining=100, label=255, background=255);
ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
ws = new WireStyle(core=255, edge=80);


let pw = document.documentElement.clientWidth;
let ph = document.documentElement.clientHeight;

let rackwidth = pw//pw * 0.8;
let rackheight = ph//ph * 0.8;
engine.set_size(rackwidth, rackheight);
engine.set_module_style(ms);
engine.set_port_style(ps);
engine.set_wire_style(ws);
engine.visible = true;

let isClock = false;
let clock = null;
let isBG = Math.random();
let bg = null;

let lead_fx = null;
let noise_fx = null;

function newLead(num) {

  // const lead = new ClockedRandomChords();
  // lead.randomize();

  // if (!isClock) {
  //   clock = new Clock();
  //   clock.i['BPM'].set(Math.random() * 100 + 70);
  //   isClock = true;
  //   if (isBG >= 0.5) {
  //     bg = new BG();
  //     bg.i['P'].set(Math.random() / 2 + 0.4)
  //   }
  // }

  // if (isBG < 0.5) {
  //   lead.i['GATE'].connect(clock.o['CLK']);
  //   lead.o['OUT'].connect(mixer.i[`${num}L`]);
  // } else {
  //   bg.i['IN'].connect(clock.o['CLK']);
  //   lead.i['GATE'].connect(bg.o['OUTL']);
  //   lead.o['OUT'].connect(mixer.i[`${num}L`]);
  // }

  const lead = new Chords();
  if (lead_fx == null) {
    lead_fx = lead;
  }
  const scale = new Quantum();
  lead.randomize();
  scale.randomize();
  
  if (!isClock) {
    clock = new Clock();
    clock.c['DIV2'].set(2);
    clock.i['BPM'].set(Math.random() * 100 + 70);
    isClock = true;
    if (isBG >= 0.5) {
      bg = new BG();
      bg.i['P'].set(Math.random() / 2 + 0.4)
    }
  }

  if (isBG < 0.5) {
    if (Math.random() < 0.33) {
      lead.i['GATE'].connect(clock.o['CLK 1']);
      scale.i['GATE'].connect(clock.o['CLK 1']);
    } else if (Math.random() < 0.66) {
      lead.i['GATE'].connect(clock.o['CLK 2']);
      scale.i['GATE'].connect(clock.o['CLK 2']);
     } else {
      lead.i['GATE'].connect(clock.o['CLK']);
      scale.i['GATE'].connect(clock.o['CLK']);
    }
    lead.i['PTCH'].connect(scale.o['OUT']);
    lead.o['OUT'].connect(mixer.i[`${num}L`]);
  } else {
    bg.i['IN'].connect(clock.o['CLK']);

    if (Math.random() < 0.33) {
      lead.i['GATE'].connect(clock.o['CLK 1']);
      scale.i['GATE'].connect(clock.o['CLK 1']);
    } else if (Math.random() < 0.66) {
      lead.i['GATE'].connect(clock.o['CLK 2']);
      scale.i['GATE'].connect(clock.o['CLK 2']);
     } else {
      lead.i['GATE'].connect(bg.o['OUTL']);
      scale.i['GATE'].connect(bg.o['OUTL']);
    }

    //lead.i['GATE'].connect(bg.o['OUTL']);
    lead.i['PTCH'].connect(scale.o['OUT']);
    //scale.i['GATE'].connect(bg.o['OUTL']);
    lead.o['OUT'].connect(mixer.i[`${num}L`]);
  }
}

function newFX(num) {
  const fx = new FX();
  fx.randomize();

  if ((Math.random() < 0.5) && (lead_fx != null)) {
    const audio = lead_fx;
    
    audio.o['OUT'].connect(fx.i['I/L']);
    audio.o['OUT'].connect(fx.i['I/R']);
  } else  if ((Math.random() < 1) && (noise_fx != null)) {
    const audio = noise_fx;
    
    audio.o['O/L'].connect(fx.i['I/L']);
    audio.o['O/R'].connect(fx.i['I/R']);
  } else {
    const audio = new VCO();

    audio.o['OUT'].connect(fx.i['I/L']);
    audio.o['OUT'].connect(fx.i['I/R']);
    
    audio.backup = (Math.random() - 1.5) * 2 - 0.2;
    audio.i['CV'].set(audio.backup);
    audio.i['WAVE'].set((Math.random() - 0.5));
    audio.i['AMP'].set(0.25);
  }

  const rand = new Alteration();
  rand.c['FREQ'].set(Math.random() * 2);

  if (Math.random() < 1) {
    rand.o['OUT'].connect(fx.i['FB/L']);
    rand.o['OUT'].connect(fx.i['FB/R']);
    rand.o['OUT'].connect(fx.i['LVL']);
  }

  fx.o['O/L'].connect(mixer.i[`${num}L`])
  fx.o['O/R'].connect(mixer.i[`${num}R`])
}

function newNoise(num) {
  const noise = new Particles();
  noise.randomize();

  if (noise_fx == null) {
    noise_fx = noise;
  }

  const rand = new Alteration();
  if (Math.random() < 0.5) {
    rand.o['OUT'].connect(noise.i['FX'])
    rand.o['OUT'].connect(noise.i['TYPE'])
  } else {
    rand.o['OUT'].connect(noise.i['PAN'])
    rand.o['OUT'].connect(noise.i['CLR'])
  }

  noise.o['O/L'].connect(mixer.i[`${num}L`])
  noise.o['O/R'].connect(mixer.i[`${num}R`])
}

// let k = new Chords();
// new Quantum();
// new Clock();
//k.randomize()

new Info();

const mixer = new StereoMixer(6);
const reverb = new RVR();
reverb.c['D/W'].set(0.8);
reverb.c['DEC'].set(0.8);
reverb.i['SIZE'].set(0.8);
mixer.o['O/L'].connect(reverb.i['I/L']);
mixer.o['O/R'].connect(reverb.i['I/R']);
reverb.o['O/L'].connect(engine.module0.i['LEFT']);
reverb.o['O/R'].connect(engine.module0.i['RIGHT']);

for (let i = 1; i <=Math.round(Math.random() * 4 + 2); i++) {
  let choise = Math.random();
  if (choise < 0.33) {
    newLead(i);
  } else if (choise < 0.66) {
    newNoise(i);
  } else {
    newFX(i);
  }
}



let max = 0;

engine.gchildren.forEach(element => {
  if (element.name.length > 0) {
    if ((element.x + element.w) > max) {
      max = element.x + element.w;
    }
  }
});

engine.gchildren[0].set_size(max - 1, engine.gchildren[0].h)
engine.w = (max + 1) * engine.scale;

// state_string = '{"modules":{"1":{"name":"Chords","i":{"MOD":{"val":"1.000000","mod":"0.100000"},"P4":{"val":"0.500000","mod":"0.100000"},"P5":{"val":"0.500000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.220497"},"P2":{"val":"0.500000","mod":"0.100000"},"P3":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[0,0]},"2":{"name":"FX","i":{"LVL":{"val":"1.000000","mod":"0.100000"},"D/W":{"val":"1.000000","mod":"0.100000"},"MOD":{"val":"0.856246","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.100000"},"P2":{"val":"0.500000","mod":"0.175661"},"P3":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[0,1]},"3":{"name":"Quantum","i":{"MOD":{"val":"1.000000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.230304"},"P2":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[5,0]},"4":{"name":"Clock","i":{"BPM":{"val":"153.626967","mod":"0.100000"}},"c":{"DIV1":"1.000000","DIV2":"1.000000","DIV3":"1.000000"},"pos":[5,1]},"5":{"name":"StereoMixer4","i":{"PAN1":{"val":"0.500000","mod":"0.100000"},"PAN2":{"val":"0.500000","mod":"0.100000"},"PAN3":{"val":"0.500000","mod":"0.100000"},"PAN4":{"val":"0.500000","mod":"0.100000"}},"c":{"AMP1":"0.505906","AMP2":"0.500000","AMP3":"0.500000","AMP4":"0.500000","AMP":"2.950364"},"pos":[10,0]},"6":{"name":"Particles","i":{"MOD":{"val":"1.000000","mod":"0.100000"},"P4":{"val":"0.500000","mod":"0.100000"},"P5":{"val":"0.500000","mod":"0.100000"},"P1":{"val":"0.500000","mod":"0.313671"},"P2":{"val":"0.500000","mod":"-0.225761"},"P3":{"val":"0.500000","mod":"0.100000"}},"c":{},"pos":[15,1]},"12":{"name":"Alteration","i":{"CV":{"val":"0.000000","mod":"0.100000"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"1.000000","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"1.000000"},"pos":[21,0]},"13":{"name":"Alteration","i":{"CV":{"val":"0.000000","mod":"0.100000"},"OFST":{"val":"0.000000","mod":"0.100000"},"SCL":{"val":"1.000000","mod":"0.100000"},"PM":{"val":"0.000000","mod":"0.100000"}},"c":{"FREQ":"1.000000"},"pos":[20,1]}},"wires":[{"a":{"mid":"6","pid":"O/L"},"b":{"mid":"5","pid":"1L"}},{"a":{"mid":"6","pid":"O/R"},"b":{"mid":"5","pid":"1R"}},{"a":{"mid":"1","pid":"OUT"},"b":{"mid":"5","pid":"2L"}},{"a":{"mid":"2","pid":"O/L"},"b":{"mid":"5","pid":"3L"}},{"a":{"mid":"2","pid":"O/R"},"b":{"mid":"5","pid":"3R"}},{"a":{"mid":"1","pid":"OUT"},"b":{"mid":"2","pid":"I/L"}},{"a":{"mid":"1","pid":"OUT"},"b":{"mid":"2","pid":"I/R"}},{"a":{"mid":"3","pid":"OUT"},"b":{"mid":"1","pid":"PTCH"}},{"a":{"mid":"4","pid":"CLK"},"b":{"mid":"3","pid":"GATE"}},{"a":{"mid":"4","pid":"CLK"},"b":{"mid":"1","pid":"GATE"}},{"a":{"mid":"5","pid":"O/L"},"b":{"mid":0,"pid":"LEFT"}},{"a":{"mid":"5","pid":"O/R"},"b":{"mid":0,"pid":"RIGHT"}},{"a":{"mid":12,"pid":"OUT"},"b":{"mid":"6","pid":"P1"}},{"b":{"mid":"6","pid":"P2"},"a":{"mid":12,"pid":"OUT"}},{"b":{"mid":"3","pid":"P1"},"a":{"mid":12,"pid":"OUT"}},{"b":{"mid":"3","pid":"P2"},"a":{"mid":12,"pid":"OUT"}},{"a":{"mid":13,"pid":"OUT"},"b":{"mid":"2","pid":"P2"}},{"b":{"mid":"1","pid":"P1"},"a":{"mid":13,"pid":"OUT"}}]}'
// state = JSON.parse(state_string)
// engine.load_state(state);


function setup() {
  createCanvas(pw, ph);
  frameRate(fps);
  //engine.scale = 3.2;
}

function draw() { 
  background(0);
  engine.draw((pw - engine.w)/2, 0); 
}