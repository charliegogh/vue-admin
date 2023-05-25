<template>
  <div class="user-wrapper row-start-center">
    <a-dropdown>
      <span
        class="header-action action-full ant-dropdown-link user-dropdown-menu"
      >
        <a-avatar
          class="avatar"
          size="small"
          src="data:image/jpeg;base64,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"
        />
        <span v-if="device === 'desktop'" class="welcome--title"
          >欢迎您，{{ userInfo.username }}</span
        >
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link :to="{ path: '/user/account' }">
            <a-icon type="user" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ path: '/user/setting' }">
            <a-icon type="setting" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" @click="systemSetting">
          <a-icon type="tool" />
          <span>系统设置</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <span class="header-action">
      <a
        class="logout_title row-all-center"
        href="javascript:;"
        @click="handleLogout"
      >
        <a-icon type="logout" />
        <span v-if="device === 'desktop'">退出登录</span>
      </a>
    </span>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import settingDrawer from "../Setting/SettingDrawer";
export default {
  components: {
    settingDrawer
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      device: state => state.app.device
    })
  },
  methods: {
    handleLogout() {
      const that = this;
      this.$confirm({
        title: "提示",
        content: "真的要注销登录吗 ?",
        onOk() {
          that.$store.dispatch("user/logOut");
        },
        onCancel() {}
      });
    },
    systemSetting() {
      this.$refs.settingDrawer.showDrawer();
    }
  }
};
</script>
<style lang="less">
.user-wrapper {
  .header-action {
    cursor: pointer;
    padding: 0 12px;
    transition: all 0.3s;
    height: 100%;
    display: inline-block;
    line-height: 46px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    a {
      font-size: 18px;
      color: inherit;
      span {
        font-size: 13px;
        margin-left: 5px;
      }
    }
  }
  .welcome--title {
    margin-left: 10px;
  }
}
// 外置的样式控制
.user-dropdown-menu-wrapper.ant-dropdown-menu {
  padding: 4px 0;

  .ant-dropdown-menu-item {
    width: 160px;
  }

  .ant-dropdown-menu-item > .anticon:first-child,
  .ant-dropdown-menu-item > a > .anticon:first-child,
  .ant-dropdown-menu-submenu-title
    > .anticon:first-child
    .ant-dropdown-menu-submenu-title
    > a
    > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }
}
</style>
