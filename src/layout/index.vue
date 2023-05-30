<template>
  <div class="layout">
    <Sidebar />
    <div
      class="main-container"
      :style="{
        marginLeft:
          device === 'mobile' ? '0px' : sidebar.opened ? '200px' : '80px'
      }"
    >
      <GlobalHeader />
      <AppMain />
    </div>
  </div>
</template>
<script>
import { Sidebar, AppMain, GlobalHeader } from './components'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain,
    GlobalHeader
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="less">
.layout {
  .app-main {
    .ql {
      height: 110px;
    }
    padding: 15px;
    position: relative;
  }
  .main-container {
    min-height: 100%;
    transition: margin-left 0.1s;
    position: relative;
  }
}
</style>
