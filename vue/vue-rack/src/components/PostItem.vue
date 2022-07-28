<template>
  <div class="post">
      <div><strong>Name</strong> {{post.title}} </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
    }
  }
}
</script>

<style>
.post {
  padding: 15px;
  border: 2px solid black;
  border-radius: 4px;
  width: 200px;
}
</style>