import { Module, hp2x, InputEncoder, Port } from '../core/core'
import Wire from '../components/Wire.vue'

class VCO extends Module {
  constructor(...args) {
    super(...args)

    this.add_input(new InputEncoder({x:hp2x(1), y:42, r:9, val: 0, vmin:-10, name:'CV', engine:args.engine}));
    this.add_output(new Port({x:hp2x(5.5), y:98, r:9, vmin:0, vmax:10, val:1, name:'OUT', engine:args.engine}));
    this.add_input(new InputEncoder({x:hp2x(5.5), y:42, r:9, val: 0, name:'FM', engine:args.engine}));
    this.add_input(new InputEncoder({x:hp2x(1), y:70, r:9, vmin:-10, val:0, name:'WAVE', engine:args.engine})); //-10 + rackrand() * 20, name:'WAVE'}));
    this.add_input(new InputEncoder({x:hp2x(5.5), y:70, r:9, vmin:0, vmax:1, val:0.5, name:'PW', engine:args.engine}));
    this.add_control(new InputEncoder({x:hp2x(1), y:98, r:9, vmin:0, vmax:1, val:1, name:'AMP', engine:args.engine}));
  }
}

export default VCO;
//engine.add_module_class(VCO);