<template>
  <div class="layout">
    <Sidebar />
    <div class="main-container">
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
  mounted() {
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="less">
.layout{
  .app-main {
    .ql{
      height: 110px;
    }
    padding: 15px;
    position: relative;
  }
  .main-container {
    min-height: 100%;
    transition: margin-left .1s;
    overflow: auto;
    position: relative;
  }
}
</style>
