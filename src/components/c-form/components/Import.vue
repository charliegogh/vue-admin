<template>
  <a-upload
    :multiple="false"
    v-bind="$attrs"
    @change="handleImport"
  >
    <a href="javascript:;" style="color: inherit">文件上传</a>
  </a-upload>
</template>
<script>
export default {
  name: 'Import',
  props: {
  },
  data() {
    return {}
  },
  methods: {
    customRequest(file) {
      setTimeout(() => {
        file.onSuccess()
        this.$emit('input', file.file)
      })
    },
    handleImport(file) {
      this.$emit('change', file)
    }
  }
}
</script>
