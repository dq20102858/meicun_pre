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
            <img class="img" :src="require('@/assets/image/'+item.meta.icon)" />
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
      moduleMenude: [
        {
          id: 1,
          moduleAction: "organization",
          moduleIcon: "organization",
          moduleName: "机构管理",
          isChildren: 1,
          children: [
            {
              id: 11,
              moduleAction: "orgList",
              moduleIcon: "monitor",
              moduleName: "机构管理 ",
            },
            {
              id: 12,
              moduleAction: "orgTypeList",
              moduleIcon: "monitor",
              moduleName: "机构类型 ",
            },
          ],
        },
        {
          id: 2,
          moduleAction: "userManage",
          moduleIcon: "users",
          moduleName: "账号管理",
          isChildren: 1,
          children: [
            {
              id: 21,
              moduleAction: "index",
              moduleIcon: "monitor",
              moduleName: "账号管理 ",
            },
            {
              id: 22,
              moduleAction: "roleList",
              moduleIcon: "monitor",
              moduleName: "角色管理",
            },
            {
              id: 34,
              moduleAction: "building",
              moduleIcon: "monitor",
              moduleName: "账号设置",
            },
            {
              id: 35,
              moduleAction: "building",
              moduleIcon: "monitor",
              moduleName: "账号设置",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    let start = window.location.href.lastIndexOf("/");
    let path = window.location.href.slice(start + 1);
    console.log(path + "_" + this.activeIndex);
    this.activeIndex = path;
    // console.log(this.permission_routers);
  },
  methods: {
    activeSel(event, url) {
      if (url == "") {
        this.activeIndex = "Home";
      } else {
        this.activeIndex = url;
      }
    },
  },
};
</script>
<style>
</style>