<template>
  <div class="sidebar-container">
    <a-layout-sider
      v-show="device === 'desktop'"
      v-model="collapsed"
      width="200px"
      :trigger="null"
    >
      <s-menu
        :collapsed="collapsed"
        :menu="routes"
        :theme="theme"
        :mode="'inline'"
      />
    </a-layout-sider>
    <a-drawer
      v-show="device === 'mobile'"
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
        :theme="theme"
        :mode="'inline'"
      />
    </a-drawer>
  </div>
</template>
<script>
import SMenu from "./menu";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import Logo from "./Logo";
export default {
  components: {
    SMenu,
    Logo
  },
  computed: {
    ...mapGetters(["theme"]),
    ...mapState({
      collapsed: state => !state.app.sidebar.opened,
      device: state => state.app.device,
      routes: state => state.user.routes
    })
  },
  data() {
    return {};
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/toggleSideBar");
    }
  }
};
</script>
<style lang="less">
.sidebar-container {
  position: fixed;
  height: 100vh;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  .ant-layout-sider {
    background-color: #ffffff !important;
    float: left;
    height: 100vh;
    .ant-menu-root {
      height: 100%;
    }
  }

  .drawer-sider-container {
    .ant-drawer-body {
      padding: 0;
    }
  }
}
</style>
