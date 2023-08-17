<template>
  <a-layout-header
    :class="['ant-header-fixedHeader',device==='desktop'?(collapsed ? 'ant-header-side-opened' : 'ant-header-side-closed'):'', ]"
  >
    <div v-if="mode === 'sidemenu'" class="header" :class="theme">
      <div class="row-all-center">
        <div class="header-icon">
          <a-icon
            v-if="device==='mobile'"
            class="trigger"
            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
            @click="toggle"
          />
          <a-icon
            v-else
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggle"
          />
        </div>
        <div class="title">
          <span v-if="device === 'desktop'">欢迎进入</span>
          <span v-else></span>
        </div>
      </div>
      <user-menu :theme="theme" />
    </div>
    <tags-view />
  </a-layout-header>
</template>
<script>
import { mapState } from 'vuex'
import UserMenu from './UserMenu'
import config from '@/defaultSettings'
import tagsView from '../TagsView'
export default {
  components: {
    UserMenu,
    tagsView
  },
  props: {
    mode: {
      type: String,
      default: 'sidemenu'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    ...mapState({
      collapsed: state => state.app.sidebar.opened,
      device: state => state.app.device
    })
  },
  data() {
    return {
      config
    }
  },
  methods: {
    toggle() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
<style lang="less" scoped>
.header{
  z-index: 2;
  color: white;
  height: 59px;
  transition: background 300ms;
  border-bottom:  1px solid #f4f4f4;
  .row-between-center();
  &.dark {
    color: #000000;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    background-color: white !important;
  }
  .trigger {
    font-size: 22px;
    padding: 25px 10px 0 15px;
    cursor: pointer;
    transition: color 300ms, background 300ms;
  }
  .title{
    font-size:16px;
  }
}
.ant-layout-header {
  height: 110px;
  padding: 0;
}
.ant-header-fixedHeader {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  transition: width .2s;

  &.ant-header-side-opened {
    width: calc(100% - 200px)
  }

  &.ant-header-side-closed {
    width: calc(100% - 80px)
  }
}
</style>
