<template>
  <div class="app-page">
    <div class="app-page-title">账户信息</div>
    <div class="app-page-container">
      <el-form class="el-form-detail" label-width="110px">
        <el-form-item label="头像：">
          <el-avatar :src="detailList.avatar"></el-avatar>
          <span class="rightedit" @click="setAvatarDialog">修改头像</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <span v-html="detailList.name"></span>
        </el-form-item>
        <el-form-item label="手机号：">
          <span v-html="detailList.phone"></span>
        </el-form-item>
        <el-form-item label="账号：">
          <span v-html="detailList.username"></span>
        </el-form-item>
        <el-form-item label="密码：">
          <span class="pass" v-html="detailList.password"></span
          ><span class="rightedit" @click="setPasswordDialog">修改密码</span>
        </el-form-item>
        <el-form-item label="所属角色：">
          <div v-html="detailList.role"></div>
        </el-form-item>
      </el-form>

      <el-dialog
        width="420px"
        class="dialog-users"
        title="修改头像"
        :close-on-click-modal="false"
        :visible.sync="diaLogFormVisible"
      >
        <el-upload
          ref="uploadfive"
          class="avatar-uploaders"
          :action="uploadAction"
          :auto-upload="true"
          :before-upload="uploadBefore"
          :on-success="uploadSuccess"
          :show-file-list="false"
        >
          <img
            v-if="formData.userAvatar"
            :src="formData.userAvatar"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAvatarEvent">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        width="420px"
        class="dialog-users"
        title="修改密码"
        :close-on-click-modal="false"
        :visible.sync="diaLogFormPassWord"
      >
        <el-form
          :model="formData"
          class="el-form-custom"
          ref="formRulesRef"
          label-width="95px"
        >
          <el-form-item
            prop="userPwd"
            label="设置密码："
            :rules="[
              {
                required: true,
                message: '请输入新密码',
                trigger: 'blur',
              },
              {
                pattern: /[0-9a-zA-Z]{6,20}$/,
                message: '请输入长度6-20个字符只能包含字母、数字',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input v-model="formData.userPwd"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="diaLogFormPassWord = false">取 消</el-button>
          <el-button type="primary" @click="savePassWordEvent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      uploadAction: this.hostURL + "/upload/uploadFile",
      diaLogFormVisible: false,
      diaLogFormPassWord: false,
      formData: {
        userAvatar: "",
        userPwd: "",
      },
      detailList: [],
    };
  },
  created() {
    this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      this.request({
        url: "/user/getAdminInfo",
        method: "get",
        params: { id: getToken() },
      }).then((res) => {
        if (res.data.status == 1) {
          this.detailList = res.data.data;
        }
      });
    },

    //上传图片
    uploadSuccess(res, file) {
      console.log("上传成功", res);
      this.$set(this.formData, "userAvatar", res.data.url);
    },
    uploadBefore(file) {
      var filename = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension =
        filename === "GIF" ||
        filename === "gif" ||
        filename === "jpeg" ||
        filename === "jpg" ||
        filename === "JPG" ||
        filename === "png" ||
        filename === "PNG";
      const isLtM = file.size / 1024 / 1024 < 2;
      if (!extension) {
        this.$message({
          message: "上传图片只能是 jpg  png  gif 格式",
          type: "error",
        });
        return false;
      }
      if (!isLtM) {
        this.$message({
          message: "上传图片大小不能超过 2MB",
          type: "error",
        });
        return false;
      }
      return extension || isLtM;
    },
    //
    setAvatarDialog() {
      this.diaLogFormVisible = true;
    },
    saveAvatarEvent() {
      if (this.formData.userAvatar == "") {
        this.$message({
          type: "warning",
          customClass: "el-submit-message",
          showClose: true,
          message: `请选择头像图片`,
        });
        return;
      }
      var data = {
        id: this.detailList.id,
        url: this.formData.userAvatar,
      };
      this.request({
        url: "/user/editAvatar",
        method: "post",
        data: data,
      }).then((response) => {
        var data = response.data;
        if (data.status == 1) {
          this.diaLogFormVisible = false;
          this.getUserDetail();
          this.$message({
            type: "success",
            customClass: "el-submit-message",
            showClose: true,
            message: "修改成功！",
          });
        }
      });
    },

    setPasswordDialog() {
      this.diaLogFormPassWord = true;
    },
    savePassWordEvent() {
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          var data = {
            id: this.detailList.id,
            newPassword: this.formData.userPwd,
            comfirmNewPassword: this.formData.userPwd,
          };
          this.request({
            url: "/user/editPassword",
            method: "post",
            data: data,
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.diaLogFormPassWord = false;
              this.getUserDetail();
              this.$message({
                type: "success",
                customClass: "el-submit-message",
                showClose: true,
                message: "修改成功！",
              });
            }
          });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
    },
    //
  },
};
</script>
<style>
.el-form-detail .el-avatar {
  float: left;
}
.el-form-detail .rightedit {
  margin-left: 50px;
  color: #5373e8;
  cursor: pointer;
  vertical-align: middle;
  float: left;
}
.el-form-detail .pass {
  float: left;
}
.avatar-uploaders {
  padding-left: 116px;
}
.avatar-uploaders .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploaders .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploaders .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar-uploaders .avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>