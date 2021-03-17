<template>
  <div class="app-page">
    楼宇页面
    <ul>
      <li v-for="item in departList" :key="item.id">{{ item.user_name }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: true,
      departList: [],
    };
  },
  created() {

  },
  methods: {
    getDepartList() {
      this.request({
        url: "/company/getDepartLists",
        method: "get",
        params: { pid: 0, type: 1 },
      }).then((response) => {
        let data = response.data;
        if (data.status == 1) {
          this.departList = data.data;
        }
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
