<template>
  <div class="post-view" v-if="currentBlog">
    <div class="container quillWrapper">
      <h2>{{ this.currentBlog.blogTitle }}</h2>
      <h4>
        Posted on:
        {{
          new Date(this.currentBlog.blogDate).toLocaleString("en-us", {
            dateStyle: "long",
          })
        }}
      </h4>
      <img :src="this.currentBlog.blogCoverPhoto" alt="" />
      <div
        class="post-content ql-editor"
        v-html="this.currentBlog.blogHTML"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewBlog",
  data() {
    return {
      currentBlog: null,
    };
  },
  async mounted() {
    this.currentBlog = await this.$store.state.blogPosts.filter((post) => {
      return post.blogID == this.$route.params.blogid;
    })[0];
  },
};
</script>
<style lang="scss">
.post-view {
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 24px;
}
</style>
