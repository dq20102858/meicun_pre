<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      :collapse="!this.sidebar.opened"
      class="app-menus"
      mode="vertical"
      :default-active="activeIndex"
      background-color="#3c436b"
      text-color="#9da1cb"
      router
    >
      >
      <li class="slogo">
        <h1>平台运营端</h1>
      </li>
      <template v-for="item in permission_routers">
        <el-submenu v-if="item.id > 0" :key="item.title" :index="item.pathname">
          <template slot="title">
            <img
              class="img"
              :src="require('@/assets/image/' + item.meta.icon)"
            />
            <em class="span">{{ item.meta.title }}</em>
          </template>
          <el-menu-item-group>
            <el-menu-item
              class="app-menu-group"
              v-for="chlid in item.children"
              :key="chlid.id"
              :index="chlid.pathname"
              :route="chlid.path"
              >{{ chlid.meta.title }}</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
  },
  data() {
    return {
      isActive: false,
      activeIndex: "Home",
    };
  },
  mounted() {
    let start = window.location.href.lastIndexOf("/");
    let path = window.location.href.slice(start + 1);
    console.log(path + "_" + this.activeIndex);
    this.activeIndex = path;
  },
};
</script>