<template>

  <iframe :id="id" :src="url" frameborder="0" width="100%" height="800px" scrolling="auto" />

</template>

<script>
export default {
  name: 'IframePageContent',
  // inject: ['closeCurrent'],
  data() {
    return {
      url: '',
      id: ''
    }
  },
  watch: {
  },
  created() {
    this.url = this.$route.meta.url
  },
  methods: {
  }
}
</script>

<style>
</style>
