<template>
  <div class="app-page">
    <div class="indexbox">
      <div class="welcome">WELCOME</div>
      <div class="welcomezh">欢迎进入平台运营端管理系统</div>
      <img class="indexbg" :src="require('@/assets/image/login3.png')" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style>
.indexbox {
  width: 100%;
  text-align: center;
}
.welcome {
  padding-top: 80px;
  font-size: 78px;
  color: #578fdc;
  letter-spacing: 5px;
}
.welcomezh {
  padding-top: 20px;
  font-size: 24px;
  color: #80a0c7;
}
.heightsss {
  height: 100vh;
}
.indexbg {
  opacity: 0.7;
  margin-top: 60px;
}
</style>