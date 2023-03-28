<template>
  <div class="user-wrapper row-start-center">
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <span v-if="isDesktop()">欢迎您，{{ userInfo.username }}</span>
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
    <span class="action">
      <a class="logout_title row-all-center" href="javascript:;" @click="handleLogout">
        <a-icon type="logout" />
        <span>退出登录</span>
      </a>
    </span>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置" />
  </div>
</template>
<script>
import { mixinDevice } from '../mixin/device'
import { mapState } from 'vuex'
import settingDrawer from './setting/SettingDrawer'
export default {
  components: {
    settingDrawer
  },
  mixins: [mixinDevice],
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          that.$store.dispatch('user/logOut')
        },
        onCancel() {
        }
      })
    },
    systemSetting() {
      this.$refs.settingDrawer.showDrawer()
    }
  }
}
</script>
<style lang="less">
.user-wrapper {
  .action {
    cursor: pointer;
    padding: 0 12px;
    line-height: 46px;
    transition: all 0.3s;
    height: 100%;
    display: inline-block;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    a{
      font-size: 18px;
      color: inherit;
      span{
        font-size: 13px;
        margin-left: 5px;
      }
    }
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
  .ant-dropdown-menu-submenu-title > .anticon:first-child
  .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }

}
</style>
