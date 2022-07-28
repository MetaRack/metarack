<template>
    <form @submit.prevent>
      <input 
        v-model="post.title"
        class="input" 
        type="text" 
        placeholder="Name:">
      <button @click="addPost">Add post</button>
      <button @click="deletePost">Delete post</button>
    </form>
</template>

<script>
export default {
  data() {
    return {
      post: {
          id: 0,
          title: '',
          body: "post description",
      }
    }
  },
  methods: {
    addPost() {
      this.post.id = Date.now();
      this.$emit('add', this.post);
      this.post = {
          id: 0,
          title: '',
          body: "post description",
      }
    },
    deletePost() {
      this.$emit('delete', this.post);
    }
  }
}
</script>

<style scoped>
.input {
  width: 200px;
  border: 2px solid black;
  padding: 10px;
}

button {
  padding: 10px;
  background-color: white;
}
</style>