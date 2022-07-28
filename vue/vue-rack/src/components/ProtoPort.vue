<template>
  <div class="proto-port" :style="cssProps">
    <P5
      @setup="setup"
      @draw="draw"
    />
  </div>
</template>

<script>

import P5 from "../vue-p5/src/p5.vue"
import { PortStyle } from "../core/core";

const style = new PortStyle();

function draw_cbf(p5, w, h) {
    let sw = 1.5;
    p5.background(0,0,0,0);

    p5.stroke(style.ring); p5.strokeWeight(sw); p5.fill(style.hole);
    p5.circle(w / 2, h / 2, w - 2 * sw);
    p5.circle(w / 2, h / 2, w - 6 * sw);
}

export default {
  components: {
    P5,
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
          '--left':  this.w/2 + "px",
        }
      }
    },
  methods: {
    setup(p5) {
      p5.createCanvas(this.w, this.h);
      draw_cbf(p5, this.w, this.h);
    },
    draw() {

    },
  }
}

</script>

<style scoped>
.proto-port {
  /* left: var(--left);
  right: var(--right); */
  left: var(--left);
  display: flex;
  position: absolute;
  z-index: 100;
}
</style>