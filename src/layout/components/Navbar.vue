<template>
  <div class="navbar row-between-center">
    <div class="row-start-center">
      <a-icon
        class="trigger"
        :type="sidebar.opened ? 'menu-unfold' : 'menu-fold'"
        @click="toggle"
      />
      <span v-show="device==='pc'" class="title">
        欢迎进入{{ config.title }}
      </span>
    </div>
    <UserMenu />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import UserMenu from '@/layout/components/UserMenu'
import config from '@/defaultSettings'
export default {
  components: {
    UserMenu
  },
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      config
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    })
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    }
  }
}
</script>
<style lang="less" scoped>
  .navbar{
    height: 59px;
    transition: background 300ms;
    padding: 0 20px;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #f4f4f4;
    .trigger{
      font-size: 22px;
    }
    .title{
      margin-left: 15px;
      font-size: 16px;
    }
  }
</style>
