<template>
  <div class="navbar" mode="horizontal">
    <div class="navbar-left" :isActive="sidebar.opened" @click="toggleSideBar">
      <img
        :src="require('@/assets/image/icon-cole.png')"
        style="height: 36px; margin-top: 5px"
      />
    </div>
    <div class="navbar-right">
      <div class="item">
        <div class="avatar">
          <img :src="require('@/assets/image/users.png')" />
          <span>{{ name }}</span>
        </div>
      </div>
      <div class="item" @click="logout">
        <img class="out" :src="require('@/assets/image/icon-out.png')" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar", "roles", "system"]),
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.navbar {
  position: relative;
  height: 60px;
  border-radius: 0px !important;
  background: #fff;
}
.navbar-left {
  line-height: 58px;
  height: 60px;
  float: left;
  padding: 6px 10px 10px 10px;
  cursor: pointer;
}
.navbar-right {
  position: absolute;
  top: 1px;
  right: 0px;
  height: 100%;
}
.navbar-right .item {
  display: inline-block;
  margin: 0 15px;
  overflow: hidden;
  line-height: 60px;
}
.navbar-right .avatar img {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  float: left;
  margin-top: 12px;
  margin-right: 5px;
}
.navbar-right .avatar span {
  font-size: 16px;
  color: #a6b6c7;
}
.navbar-right .out {
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
}
</style>
