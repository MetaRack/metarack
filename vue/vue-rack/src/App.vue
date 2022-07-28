<template>
  <div class="app">
    <component :is="engine.component" :engine="engine" ></component>
  </div> 
</template>

<script>

import P5 from "./vue-p5/src/p5.vue"
import VueP5 from "vue-p5"
import Port from "./components/Port.vue"
import { markRaw, shallowRef, ref } from "vue"
// import { ModuleStyle, PortStyle, WireStyle } from "./core/core"
import Engine from "./core/core"
//import drag from 'v-drag'

const engine = (new Engine({w:document.documentElement.clientWidth, h:document.documentElement.clientHeight, visible:true}));

export default {
  components: {
    Port, P5, VueP5
  },

  // created() {
  //   window.addEventListener("resize", this.resize);
  // },
  // methods: {
  //   resize(e) {
      
  //   }
  // },

  data() {
    return {
      rackwidth: document.documentElement.clientWidth,
      rackheight: document.documentElement.clientHeight,
      engine: shallowRef(new Engine({w:this.rackwidth, h:this.rackheight, visible:true})),
      audioContext: new AudioContext(),
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  padding: 10px;
  position: absolute;
}
</style>
