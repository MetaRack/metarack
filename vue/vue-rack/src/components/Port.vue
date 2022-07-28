<script lang="jsx">

import P5 from "../vue-p5/src/p5.vue"
import ProtoPort from "./ProtoPort.vue"
import GraphicComponent from "./GraphicComponent.vue"
import { GraphicObject } from "../core/core"

function Por(props) {
  return (
    <ProtoPort
      w={props.w/2} 
      h={props.h/2} 
    />
  )
}

export default {
  components: {
    P5,
    ProtoPort,
    GraphicComponent,
  },
  render() {
    return (
      <div class = "port" style={this.cssProps}>
        <div class = "p5"> 
          <P5
            onSetup={this.setup}
            onDraw={this.draw}
          />
        </div>
        <Por w={this.w} h={this.h}/>
     </div>
    )
  },
  props: {
    w: {
      type: Number,
      required: true,
    },
    h: {
      type: Number,
      required: true,
    }
  },
  computed: {
      cssProps () {
        return {
          '--width':  this.w + "px",
          '--height': this.h + "px",
          '--left': this.x + "px",
          '--top': this.y + "px"
        }
      }
    },
  methods: {
    draw_cbf(p5, w, h) {
        let sw = 1;
        p5.stroke(60); p5.strokeWeight(sw); p5.fill(255);
        p5.rect(sw + w * 0.05, h / 1.5 + sw + h * 0.05, w - 2 * sw - w * 0.1, h / 3 - 2 * sw - h * 0.1);

        p5.textSize(w / 4);
        p5.fill(60);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.strokeWeight(sw / 10);
        p5.text("Port".substring(0,5), w / 2, h * 5 / 6 + 1);
    },
    setup(p5) {
      p5.createCanvas(this.w, this.h);
      this.draw_cbf(p5, this.w, this.h);
    },
    draw() {

    },
  },
}

</script>

<style>
.port{
  width: var(--width);
  height: var(--height);
  left: var(--left);
  top: var(--top);
  display: flex;
  position: absolute;
}
.p5{
  display: flex;
  position: absolute;
  z-index: 10;
}
</style>