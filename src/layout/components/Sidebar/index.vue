<template>
  <div>
    <a-layout-sider
      v-show="device==='desktop'"
      v-model="collapsed"
      width="200px"
      :trigger="null"
    >
      <s-menu
        :collapsed="collapsed"
        :menu="routes"
        theme="light"
        :mode="'inline'"
      />
    </a-layout-sider>
    <a-drawer
      v-show="device==='mobile'"
      placement="left"
      wrap-class-name="drawer-sider-container"
      :closable="false"
      :visible="collapsed"
      width="200px"
      @close="handleClickOutside"
    >
      <s-menu
        :collapsed="!collapsed"
        :menu="routes"
        theme="light"
        :mode="'inline'"
      />
    </a-drawer>
  </div>
</template>
<script>
import SMenu from './menu'
import { mapState } from 'vuex'
import Logo from './Logo'
export default {
  components: {
    SMenu,
    Logo
  },
  computed: {
    ...mapState({
      collapsed: state => !state.app.sidebar.opened,
      device: state => state.app.device,
      routes: state => state.user.routes
    })
  },
  data() {
    return {
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
<style lang="less">
.ant-layout-sider{
  background-color:#ffffff!important;
  float:left;
  height: 100vh;
}
.drawer-sider-container{
  .ant-drawer-body{
    padding: 0;
  }
}
</style>
