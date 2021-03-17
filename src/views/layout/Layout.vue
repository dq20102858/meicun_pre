<template>
  <div class="app-container" :class="classObj">
    <app-sidebar class="app-container-sidebar"></app-sidebar>
    <div class="app-container-main">
      <app-navbar :msg="msg"></app-navbar>
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";
import AppMain from "./AppMain";
export default {
  data() {
    return {
      msg: 0,
    };
  },
  components: {
    AppNavbar,
    AppSidebar,
    AppMain,
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
};
</script>