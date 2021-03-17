<template>
  <div class="app-page">
    <div class="app-page-title">菜单维护</div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addMenuDialog">新增</el-button>
      </div>
      <div class="app-table app-table-nowrap">
        <el-table
          :data="dataList"
          border
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children' }"
          >>
          <el-table-column fixed label="序号" width="80px">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            prop="moduleTitle"
            label="菜单名称"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="moduleName"
            label="文件名称"
            width="120"
          ></el-table-column>
          <el-table-column prop="moduleIcon" label="菜单图标"></el-table-column>
          <el-table-column
            prop="moduleActionName"
            label="原始路径"
          ></el-table-column>
          <el-table-column prop="moduleUrl" label="访问路径"></el-table-column>
          <el-table-column
            prop="moduleSort"
            label="菜单排序"
            width="100"
          ></el-table-column>
          <el-table-column prop="systemId" label="系统" width="70">
            <template slot-scope="scope">
              <div v-html="scope.row.systemId == 1 ? '运营端' : '机构端'"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editMenuDialog(scope.row)"
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
          <el-form-item label="所属系统" prop="system_id">
            <el-select v-model="formData.system_id">
              <el-option label="运营端" :value="1"></el-option>
              <el-option label="机构端" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属菜单" prop="pid">
            <el-select v-model="formData.pid" placeholder="请选择">
              <el-option label="一级分类" :value="0"></el-option>
              <el-option
                v-for="item in dataList"
                :key="item.id"
                :label="item.moduleTitle"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称" prop="module_title">
            <el-input
              v-model="formData.module_title"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件名称" prop="module_name">
            <el-input
              v-model="formData.module_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="菜单图标">
            <el-input
              v-model="formData.module_icon"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="菜单排序" prop="module_sort">
            <el-input
              v-model="formData.module_sort"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="原始路径" prop="module_action_name">
            <el-input
              v-model="formData.module_action_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="访问路径" prop="module_url">
            <el-input
              v-model="formData.module_url"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMenuEvent">确 定</el-button>
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
        system_id: [
          {
            required: true,
            message: "请选择所属系统",
            trigger: "change",
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
    saveMenuEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          that.formData.module_hide = 1;
          // that.formData.id = 8;
          let data = that.formData;
          let url = "/user/addLinkmenu";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/user/editLinkmenu";
          }
          this.request({
            url: url,
            method: "post",
            data,
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.diaLogFormVisible = false;
              location.reload();
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
    editMenuDialog(options) {
      console.log(options);
      this.formData = {
        id: options.id,
        system_id: options.systemId,
        pid: options.pid,
        module_title: options.moduleTitle,
        module_name: options.moduleName,
        module_icon: options.moduleIcon,
        module_sort: options.moduleSort,
        module_action_name: options.moduleActionName,
        module_url: options.moduleUrl,
      };
      //  this.$set(this.formData, "pid", options.pid);
      this.diaLogFormVisible = true;
      this.diaLogTitle = "菜单操作";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
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