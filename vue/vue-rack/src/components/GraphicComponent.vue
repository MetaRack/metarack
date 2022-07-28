<script lang="jsx">

export default {
  render() {
    return (
      <div class = "go" style={this.cssProps}>
          <this.render.renderMethod />
      </div>
    )
  },
  props: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      render: {
        type: Object,
        default: {
          renderMethod() {
            <h4>method undefined</h4>
          }
        }
      },
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
}
</script>

<style>
.go{
  width: var(--width);
  height: var(--height);
  left: var(--left);
  top: var(--top);
}
</style>