<template>
  <a-upload
    :multiple="false"
    :custom-request="customRequest"
  >
    <a-button icon="upload">上传</a-button>
  </a-upload>
</template>
<script>
export default {
  name: 'Import',
  props: {
    value: {

    }
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
    }
  }
}
</script>
