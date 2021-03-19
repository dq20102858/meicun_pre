<template>
  <div class="app-page">
    <div class="app-page-title">角色管理</div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addRoleDialog">新增</el-button>
      </div>
      <div class="app-table">
        <el-table :data="dataList" border>
          <el-table-column label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + (page_current - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column
            prop="relation_nums"
            label="关联账号数"
          ></el-table-column>
          <el-table-column prop="create_user" label="创建人"></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column label="操作" width="125" align="center">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editRoleDialog(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  class="btn-del"
                  size="mini"
                  @click="delRoleDialog(scope.row.id)"
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
    </div>
    <el-dialog
      width="680px"
      class="dialog-users"
      :title="this.diaLogTitle"
      :close-on-click-modal="false"
      :visible.sync="diaLogFormVisible"
      v-if="diaLogFormVisible"
    >
      <el-form
        :model="formData"
        class="el-form-custom"
        :rules="formRules"
        ref="formRulesRef"
        label-width="110px"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限配置：" prop="menus">
          <el-input
            v-model="formData.menus"
            autocomplete="off"
            style="display: none"
          ></el-input>
          <el-tree
            ref="tree"
            :data="treeDataList"
            show-checkbox
            default-expand-all
            node-key="id"
            :props="treeProps"
            @check="treeSelect($event)"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diaLogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleEvent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      diaLogFormVisible: false,
      diaLogTitle: "",
      formData: {},
      formRules: {
        name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,10}$/,
            message: "请输入长度2-10个字符的汉字、字母、数字组合",
            trigger: "blur",
          },
        ],
        menus: [
          {
            required: true,
            message: "请选择角色权限配置",
            trigger: "change",
          },
        ],
      },
      page_current: 1,
      page_size: 20,
      page_total: 0,
      dataList: [],
      treeDataList: [],
      treeProps: {
        children: "child",
        label: "name",
      },
      treeSelectData: [],
    };
  },
  mounted() {
    this.getMenuList();
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.request({
        url: "/user/getRolePageLists",
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
    getMenuList() {
      this.request({
        url: "/user/getRoleConfig",
        method: "get",
      }).then((res) => {
        if (res.data.status == 1) {
          this.treeDataList = res.data.data;
          console.log(this.treeDataList);
        }
      });
    },
    treeSelect(val) {
      console.log(val);
      this.$set(this.formData, "menus", this.$refs.tree.getCheckedKeys());
    },
    addRoleDialog() {
      this.diaLogTitle = "新增角色";
      this.diaLogFormVisible = true;
      //this.$set(this.formData,"menus", []);
      this.formData = {};
      //  this.$refs.tree.setCheckedKeys([]);
    },
    editRoleDialog(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "编辑角色";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/user/getRoleDetail",
        method: "get",
        params: { id: id },
      }).then((res) => {
        if (res.data.status == 1) {
          this.formData = res.data.data;
          this.$refs.tree.setCheckedKeys(res.data.data.menus);
        }
      });
    },
    saveRoleEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          that.formData.menus = this.$refs.tree.getCheckedKeys();
          let data = that.formData;
          if (that.formData.menus.length == 0) {
            this.$message({
              type: "success",
              customClass: "el-submit-message",
              showClose: true,
              message: "请选择权限配置",
            });
            return;
          }
          let url = "/user/addRole";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/user/editRole";
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

    delRoleDialog(id) {
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-new",
      })
        .then(() => {
          this.request({
            url: "/user/deleteRole",
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
    //
  },
};
</script>
