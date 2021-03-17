<template>
  <div class="app-page">
    <div class="app-page-title">菜单维护</div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addMenuDialog">新增</el-button>
      </div>
      <div class="app-table app-table-nowrap">
        <el-table :data="dataList"   row-key="id"  default-expand-all
    :tree-props="{children: 'children'}">>
          <el-table-column fixed label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + 1
            }}</template>
          </el-table-column>
          <el-table-column prop="moduleTitle" label="菜单名称" width="120"></el-table-column>
          <el-table-column prop="moduleName" label="文件名称"  width="120"></el-table-column>
          <el-table-column prop="moduleIcon" label="菜单图标" width="100"></el-table-column>
          <el-table-column prop="moduleSort" label="菜单排序"  width="100"></el-table-column>
          <el-table-column prop="moduleActionName" label="原始路径" ></el-table-column>  
          <el-table-column prop="moduleUrl" label="访问路径"></el-table-column>
          </el-table-column>
          <el-table-column  label="操作" width="70">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editShowDialog(scope.row.id)"
                  >编辑</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
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
          <el-form-item label="菜单名称" prop="module_title">
            <el-input v-model="formData.module_title" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="文件名称" prop="module_name">
            <el-input v-model="formData.module_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属菜单" prop="pid">
             <el-select
            v-model="formData.pid"
            placeholder="请选择"
            @change="searchStoreTypeEvent($event)"
          >
            <el-option label="一级分类" value="0"></el-option>
            <el-option
              v-for="item in dataList"
              :key="item.id"
              :label="item.moduleTitle"
              :value="item.id"
            ></el-option>
          </el-select>
          </el-form-item>
           <el-form-item label="菜单图标">
            <el-input v-model="formData.module_icon" autocomplete="off"></el-input>
          </el-form-item>
  <el-form-item label="菜单排序" prop="module_sort">
            <el-input v-model="formData.module_sort" autocomplete="off"></el-input>
          </el-form-item>
 <el-form-item label="原始路径" prop="module_action_name">
            <el-input v-model="formData.module_action_name" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="访问路径" prop="module_url">
            <el-input v-model="formData.module_url" autocomplete="off"></el-input>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMenuEvent"
            >确 定</el-button
          >
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
      diaLogTitle: "新增菜单",
      formData: {},
      formRules: {
        module_title: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
        ],

        module_name: [
          {
            required: true,
            message: "请输入文件名称为英文字母",
            trigger: "blur",
          },
        ],
        pid: [
          {
            required: true,
            message: "请选择所属菜单",
            trigger: "change",
          },
        ],
        module_sort: [
          {
            required: true,
            message: "请输入长度1-3位数字",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{1,10}$/,
            message: "请输入长度1-3位数字",
            trigger: "blur",
          },
        ],
        module_action_name: [
          {
            required: true,
            message: "请输入原始路径",
            trigger: "blur",
          },
        ],
        module_url: [
          {
            required: true,
            message: "请输入访问路径",
            trigger: "blur",
          },
        ],
      },
      dataList: [],
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      var getMenus = localStorage.getItem("ROLEMENU");
      this.dataList = JSON.parse(getMenus);
      console.log(this.dataList);
    },

    addMenuDialog() {
      this.diaLogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {};
    },
    addMenuEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          that.formData.system_id = 1;
          that.formData.module_hide = 1;
          let data = that.formData;
          this.request({
            url: "/user/addLinkmenu",
            method: "post",
            data,
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.diaLogFormVisible = false;
              this.getDataList();
              this.$message({
                type: "success",
                message: "保存成功！",
              });
            }
          });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
    },
    userEditEvent(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "修改人员信息";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/user/getUserDetail",
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
                message: "删除成功！",
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
<style>
.vd {
  border-radius: 5px;
  text-align: center;
}
</style>