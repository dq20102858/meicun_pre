<template>
  <div class="app-page">
    <div class="app-page-title">账户设置</div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addAdminDialog">新增</el-button>
      </div>
      <div class="app-table">
        <el-table :data="dataList" border>
          <el-table-column label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + (page_current - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="password" label="密码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="role" label="所属角色"></el-table-column>
          <el-table-column prop="create_user" label="创建人"></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editAdminDialog(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  class="btn-del"
                  size="mini"
                  @click="delAdminEvent(scope.row.id)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="app-pagination">
          <el-pagination
            background
            layout="total,  prev, pager, next, jumper"
            :current-page="this.page_current"
            :page-size="this.page_size"
            :total="this.page_total"
            @current-change="pageChange"
          >
          </el-pagination>
        </div>
      </div>
      <el-dialog
        width="680px"
        class="dialog-users"
        :title="this.diaLogTitle"
        :close-on-click-modal="false"
        :visible.sync="diaLogFormVisible"
      >
        <el-form
          :model="formData"
          class="el-form-custom"
          :rules="formRules"
          ref="formRulesRef"
          label-width="110px"
        >
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="formData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <el-input v-model="formData.phone" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="账户：" prop="username">
            <el-input v-model="formData.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item
            label="密码："
            prop="password"
            v-if="this.diaLogTitle == '新增账号'"
          >
            <el-input v-model="formData.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="密码："
            prop="passwordEdit"
            v-if="this.diaLogTitle == '编辑账号'"
          >
            <el-input
              v-model="formData.passwordEdit"
              autocomplete="off"
              placeholder="不修改密码请留空"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属角色：" prop="role_id">
            <el-select v-model="formData.role_id" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAdminEvent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      diaLogFormVisible: false,
      diaLogTitle: "添加账号",
      formData: {},
      passwordOrg: "",
      formRules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{2,10}$/,
            message: "请输入长度2-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message:"请输入账号，默认可输入姓名的全拼字母",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z]{2,10}$/,
            message: "请输入长度2-10个字母",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 14,
            message: "请输入密码长度6到14个字符",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a-zA-Z_]{1,}$/,
            message: "密码只能是数字、字母、下划线",
            trigger: "blur",
          },
        ],
        passwordEdit: [
          {
            min: 6,
            max: 14,
            message: "请输入密码长度6到14个字符",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a-zA-Z_]{1,}$/,
            message: "密码只能是数字、字母、下划线",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        role_id: [
          {
            required: true,
            message: "请选择所属角色",
            trigger: "change",
          },
        ],
      },
      roleList: [],
      dataList: [],
      page_current: 1,
      page_size: 20,
      page_total: 0,
    };
  },
  created() {
    this.geRoleList();
    this.getDataList();
  },
  methods: {
    geRoleList() {
      this.request({
        url: "/user/getRoleLists",
        method: "get",
      }).then((res) => {
        if (res.data.status == 1) {
          this.roleList = res.data.data;
        }
      });
    },
    getDataList() {
      this.request({
        url: "/user/getAdminPages",
        method: "get",
      }).then((res) => {
        if (res.data.status == 1) {
          this.dataList = res.data.data.data;
          this.page_current = res.data.data.current_page;
          this.page_total = res.data.data.total;
          this.page_size = res.data.data.per_page;
        }
      });
    },
    pageChange(value) {
      this.page_current = value;
      this.getDataList();
    },
    addAdminDialog() {
      this.diaLogTitle = "新增账号";
      this.diaLogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {
        // title: "",
        // description: "",
        // recept_type: []
      };
    },
    editAdminDialog(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "编辑账号";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/user/getAdminInfo",
        method: "get",
        params: { id: id },
      }).then((response) => {
        let data = response.data;
        if (data.status == 1) {
          this.formData = data.data;
          //console.log(this.userData.menus);
          this.passwordOrg = data.data.password;
        }
      });
    },
    saveAdminEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          let data = that.formData;
          let url = "/user/addAdmin";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/user/editAdmin";
            let pwdEdit = this.formData.passwordEdit;
            if (pwdEdit != "" && typeof pwdEdit != "undefined") {
              this.formData.password = pwdEdit;
            } else {
              this.formData.password = "";
            }
          }
          this.request({
            url: url,
            method: "post",
            data,
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.diaLogFormVisible = false;
              this.getDataList();
             this.$message({
                type: "success",
                customClass: "el-submit-message",
                showClose: true,
                message: "数据保存成功！",
              });
            }
          });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
    },

    userDeleteEvent(id) {
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-new",
      })
        .then(() => {
          this.request({
            url: "/user/delUser",
            method: "post",
            data: { id: id },
          }).then((res) => {
            let data = res.data;
            if (data.status == 1) {
              if (this.dataList.length == 1) {
                this.page_current =
                  this.page_current < 1 ? 1 : this.page_current - 1;
                this.getDataList();
              } else {
                this.getDataList();
              }
              this.$message({
                type: "success",
                customClass: "el-submit-message",
                showClose: true,
                message: "数据删除成功！",
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style>
.dialog-users .el-select {
  width: 100%;
}
.dialog-users .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.dialog-users .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.dialog-users .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.dialog-users .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>