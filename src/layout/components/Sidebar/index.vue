<template>
  <div class="sidebar-container">

    <!--    <Logo />-->
    <s-menu
      :collapsed="!sidebar.opened"
      :menu="routes"
      theme="light"
      :mode="'inline'"
    />
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
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      routes: state => state.user.routes
    })
  },
  data() {
    return {
      isShow: false,
      collapsed: false,
      headerFixed: false
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
