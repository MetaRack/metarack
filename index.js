let pw;
let ph;

function init_all(engine) {

  pw = document.documentElement.clientWidth;
  ph = document.documentElement.clientHeight;

  engine.clear_state();
  engine.set_size(0,0);

  ms = new ModuleStyle(panel=module_color, frame=60, shadow=70, name=40, lining=100, label=255, background_clr=255);
  ps = new PortStyle(hole=255, ring=80, text=100, istext=true);
  ws = new WireStyle(core=wire_color, edge=80);

  toprand = sfc32(...hashes);

  for (let i = 0; i < toprand() * 10000; i += 1) toprand();

  let rackwidth = pw//pw * 0.8;
  let rackheight = ph//ph * 0.8;
  engine.set_size(rackwidth, rackheight);
  engine.set_module_style(ms);
  engine.set_port_style(ps);
  engine.set_wire_style(ws);
  engine.visible = true;

  let isClock = false;
  let clock = null;
  let isBG = toprand();
  let bg = null;

  let lead_fx = null;
  let noise_fx = null;

  function newLead(num) {

    // const lead = new ClockedRandomChords();
    // lead.randomize();

    // if (!isClock) {
    //   clock = new Clock();
    //   clock.i['BPM'].set(rackrand() * 100 + 70);
    //   isClock = true;
    //   if (isBG >= 0.5) {
    //     bg = new BG();
    //     bg.i['P'].set(rackrand() / 2 + 0.4)
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
    // lead.randomize();
    // scale.randomize();
    
    if (!isClock) {
      clock = new Clock();
      clock.c['DIV2'].set(2);
      clock.i['BPM'].set(toprand() * 100 + 70);
      isClock = true;
      if (isBG >= 0.5) {
        bg = new BG();
        bg.i['P'].set(toprand() / 2 + 0.4)
      }
    }

    if (isBG < 0.5) {
      if (toprand() < 0.33) {
        lead.i['GATE'].connect(clock.o['CLK 1']);
        scale.i['GATE'].connect(clock.o['CLK 1']);
      } else if (toprand() < 0.66) {
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

      if (toprand() < 0.33) {
        lead.i['GATE'].connect(clock.o['CLK 1']);
        scale.i['GATE'].connect(clock.o['CLK 1']);
      } else if (toprand() < 0.66) {
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
    // fx.randomize();

    if ((toprand() < 0.5) && (lead_fx != null)) {
      const audio = lead_fx;
      
      audio.o['OUT'].connect(fx.i['I/L']);
      audio.o['OUT'].connect(fx.i['I/R']);
    } else  if ((toprand() < 1) && (noise_fx != null)) {
      const audio = noise_fx;
      
      audio.o['O/L'].connect(fx.i['I/L']);
      audio.o['O/R'].connect(fx.i['I/R']);
    } else {
      const audio = new VCO();

      audio.o['OUT'].connect(fx.i['I/L']);
      audio.o['OUT'].connect(fx.i['I/R']);
      
      audio.backup = (toprand() - 1.5) * 2 - 0.2;
      audio.i['CV'].set(audio.backup);
      audio.i['WAVE'].set((toprand() - 0.5));
      audio.i['AMP'].set(0.25);
    }

    const rand = new Alteration();
    rand.c['FREQ'].set(toprand() * 2);

    if (toprand() < 1) {
      rand.o['OUT'].connect(fx.i['FB/L']);
      rand.o['OUT'].connect(fx.i['FB/R']);
      rand.o['OUT'].connect(fx.i['LVL']);
    }

    fx.o['O/L'].connect(mixer.i[`${num}L`])
    fx.o['O/R'].connect(mixer.i[`${num}R`])
  }

  function newNoise(num) {
    const noise = new Particles();
    // noise.randomize();

    if (noise_fx == null) {
      noise_fx = noise;
    }

    const rand = new Alteration();
    if (toprand() < 0.5) {
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

  // new Info();

  const mixer = new StereoMixer(6);
  const reverb = new RVR();
  reverb.c['D/W'].set(0.8);
  reverb.c['DEC'].set(0.8);
  reverb.i['SIZE'].set(0.8);
  mixer.o['O/L'].connect(reverb.i['I/L']);
  mixer.o['O/R'].connect(reverb.i['I/R']);
  reverb.o['O/L'].connect(engine.module0.i['LEFT']);
  reverb.o['O/R'].connect(engine.module0.i['RIGHT']);

  rarityLeadNum = 0
  rarityNoiseNum = 0
  rarityFXNum = 0

  rackrand = sfc32(...hashes);

  for (let i = 1; i <=Math.round(toprand() * 4 + 2); i++) {
    let choise = toprand();
    if (choise < 0.33) {
      newLead(i);
      rarityLeadNum += 1
    } else if (choise < 0.66) {
      newNoise(i);
      rarityNoiseNum += 1
    } else {
      newFX(i);
      rarityFXNum += 1
    }
  }

  engine.load_state(engine.save_state())

  // let i = engine.wires.length
  // while (i--) {
  //     if (engine.wires[i].a == null) { 
  //         engine.wires.splice(i, 1);
  //     } 
  // }

  window.$fxhashFeatures = {
    "Leads": rarityLeadNum,
    "Noises": rarityNoiseNum,
    "Effects": rarityFXNum,
  }

  let max = 0;

  engine.gchildren.forEach(element => {
    if (element.name.length > 0) {
      if ((element.x + element.w) > max) {
        max = element.x + element.w;
      }
    }
  });

  engine.gchildren[0].set_size(max - 1, engine.gchildren[0].h);
  engine.w = (max + 1) * engine.scale;

  let aspect = engine.w / pw

  if (aspect > 1) {
    engine.set_size(pw, engine.h / aspect);
    engine.replace_modules();
  }

  let canvas;

  engine.time = 0;

  resizeCanvas(pw, ph);

  return engine;
}

function setup() {
  createCanvas(pw, ph);
  frameRate(fps);
}

function draw() { 
  background(0);
  engine.draw((pw - engine.w)/2, (ph - engine.h)/2); 
}