<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device==='mobile'&& sidebar.opened"
      class="sidebar-mask"
      @click="handleClickOutside"
    />
    <Sidebar />
    <div class="main-container">
      <div
        class="nav"
        :style="{width:(sidebar.opened && device!=='mobile')?'calc(100% - 220px)':(device==='mobile')?'100%':'calc(100% - 80px)'}"
      >
        <navbar
          @toggle="toggleSideBar"
        />
        <!-- tag标签 -->
        <tags-view />
      </div>
      <AppMain />
    </div>
  </div>
</template>
<script>
import { Sidebar, AppMain, Navbar, TagsView } from './components'
import { mapState } from 'vuex'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain,
    Navbar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="less">

</style>
