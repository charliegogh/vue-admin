<template>
  <a-upload :multiple="false" v-bind="$attrs" :customRequest="customRequest">
    <a href="javascript:;" style="color: inherit">文件上传</a>
  </a-upload>
</template>
<script>
export default {
  name: "ImportFile",
  props: {},
  data() {
    return {};
  },
  methods: {
    customRequest(file) {
      setTimeout(() => {
        file.onSuccess();
        this.$emit("change", file.file);
      });
    }
  }
};
</script>
