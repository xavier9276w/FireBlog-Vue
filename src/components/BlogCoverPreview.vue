<template>
  <div class="modal" ref="modal">
    <div class="modal-content">
      <close @click="closePreview" class="icon" />
      <img :src="this.blogCoverPhoto" alt="" />
    </div>
  </div>
</template>
<script>
import close from "../assets/Icons/times-circle-light.svg";

export default {
  name: "BlogCoverPreview",
  components: {
    close
  },
  methods: {
    closePreview() {
      this.$store.commit("openPhotoPreview");
    }
  },
  computed: {
    blogCoverPhoto() {
      return this.$store.state.blogPhotoFileURL;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .modal-content {
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 12px;
    background-color: #fff;
    flex-direction: column;
    height: 400px;
    width: 600px;
    padding: 50px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .icon {
      width: 24px;
      height: auto;
      cursor: pointer;
      font-size: 24px;
      position: absolute;
      top: 15px;
      right: 15px;
      color: #303030;
    }

    img {
      margin-top: 16px;
      display: block;
      width: auto;
      height: 100%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
