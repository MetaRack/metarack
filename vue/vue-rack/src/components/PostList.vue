<template>
  <h3>Post List</h3>
  <post-item 
    v-for="post in posts"
    :post="post"
  />
</template>

<script>
 
import PostItem from "./PostItem.vue"

export default {

  components: {
    PostItem,
  },

  props: {
    posts: {
        type: Array,
        required: true,
    }
  },
}
</script>

<style scoped>

</style>