<template>
  <div />
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    get(item) {
      this.$fetch.getAction(`http://192.168.31.87:3106/_/${item.school_id}/info.json`).then(rs => {
        item.site = rs.data.site
        item.school_site = rs.data.school_site
        this.$forceUpdate()
      })
    }
  }
}
</script>
<style lang="less">

</style>
