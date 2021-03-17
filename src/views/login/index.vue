<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="imga">
          <img :src="require('@/assets/image/login1.png')" />
        </div>
        <div class="imgb">
          <img :src="require('@/assets/image/login3.png')" />
        </div>
        <div class="imgc">
          <img :src="require('@/assets/image/login2.png')" />
        </div>
      </div>
      <div class="login-form">
        <div class="login-form-title">
          <img :src="require('@/assets/image/login4.png')" />
          <img :src="require('@/assets/image/login5.png')" />
        </div>

        <el-form
          class="login-form-item"
          autocomplete="off"
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
        >
          <el-form-item>
            <h3
              style="font-size: 28px; font-weight: 700；color:#454444;margin: 0 auto;  text-align: center;"
            >
              登录
            </h3>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              autocomplete="new-password"
              maxlength="14"
              clearable
            >
              <template slot="prepend">
                <img :src="require('@/assets/image/login6.png')" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              autocomplete="new-password"
              maxlength="14"
              clearable
            >
              <template slot="prepend">
                <img :src="require('@/assets/image/login7.png')" />
              </template>
            </el-input>
          </el-form-item>
          <el-button
            type="primary"
            style="width: 100%; margin-bottom: 30px; padding: 15px"
            :loading="loading"
            @click.native.prevent="handleLogin"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          // {
          //   pattern: /^[\u4e00-\u9fa5A-Za-z0-9\_]*$/,
          //   message: "请输入正确的用户名",
          //   trigger: "blur",
          // },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          // {
          //   min: 2,
          //   max: 14,
          //   message: "请输入密码长度6到14个字符",
          //   trigger: "blur",
          // },
        ],
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
    };
  },
  created() {},
  methods: {
    handleLoginBlur(id, val) {
      this.disabled = !this.disabled;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.username == "") {
            this.$message({
              type: "error",
              message: "请输入用户名",
            });
            return false;
          }
          if (this.loginForm.password == "") {
            this.$message({
              type: "error",
              message: "请输入密码",
            });
            return false;
          }
          this.loading = true;
          this.$store
            .dispatch("LoginSystem", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/Home" });
            })
            .catch(() => {
              this.loading = false;
              return false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #eef1fc;
}
.login-box {
  margin: 0 auto;
}
.login-left {
  position: relative;
  float: left;
  width: 50%;
  height: 100vh;
}
.login-left .imga {
  float: right;
}
.login-left .imga img {
  height: 200px;
}
.login-left .imgb {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 300px;
  height: 240px;
}
.login-left .imgb img {
  height: 300px;
}
.login-left .imgc {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
.login-left .imgc img {
  float: left;
  height: 200px;
}
.login-form {
  float: right;
  width: 50%;
  height: 100vh;
  background: #fff;
  position: relative;
  z-index: 9999;
}
.login-form-title {
  padding: 25px 30px 120px 30px;
}
.login-form-title img {
  display: inline-block;
  vertical-align: middle;
}
.login-form-item {
  width: 460px;
  margin: 0 auto;
}
.login-form-item .title-container {
  text-align: center;
  margin-bottom: 35px;
}
.login-form-item .title-container img {
  margin: 0 auto;
  width: 88px;
}
.login-form-item .el-form-item {
  margin-bottom: 30px;
}
.login-form-item .el-input-group__prepend {
  background: #f2f4fa !important;
  border: none;
  padding: 0 5px;
  border-right: 0;
}
.login-form-item .el-input-group__prepend img {
  width: 32px;
}
.login-form-item .el-input__inner {
  background: #f2f4fa !important;
  border: 6px;
  padding: 0 5px 0 1px;
  color: #0b64b4;
  height: 45px;
  border: none;
  border-left: 0;
}
.login-form-item input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px white inset !important;
}
.login-form-item .el-form-item__error {
  padding-top: 5px;
}
.login-form-item .el-button {
  background: #5373e8;
  border-color: #5373e8;
}
.login-form-item .el-button:hover {
  opacity: 0.8;
}
.login-form-item .el-button:focus {
  opacity: 0.8;
}
.login-text{overflow: hidden;}
</style>