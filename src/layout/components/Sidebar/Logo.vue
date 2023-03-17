<template>
  <router-link :to="{path:'/dashboard/analysis'}">
    <div
      class="logo row-all-center"
    >
      <h1
        v-show="sidebar.opened"
      >{{ title }}</h1>
    </div>
  </router-link>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showTitle: true,
      title: 'xxx平台'
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  }
}
</script>
<style lang="less" scoped>
.logo{
  padding: 10px 0;
  border-right: 1px solid #e8e8e8;
  color: #000000;
  h1{
    font-size: 18px;
    margin: 0 0 0 8px;
    font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    font-weight: 600;
  }
}
img{
  height: 35px;
}
</style>
