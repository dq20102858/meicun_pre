<template>
  <div class="app-page">
    <div class="app-page-title">机构管理</div>
    <div class="app-page-select">
      <el-form :inline="true">
        <el-form-item class="el-form-item" label="机构名称：">
          <el-input
            v-model="searchFormData.searchName"
            class="input-with-select"
            placeholder="请输入机构名称"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="机构类型：">
          <el-select
            v-model="searchFormData.searchType"
            @change="searchRoleEvent($event)"
            placeholder="全部类型"
          >
            <el-option label="全部类型" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="维护人员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="管理员名称：">
          <el-input
            v-model="searchFormData.searchAdminName"
            class="input-with-select"
            placeholder="请输入管理员名称"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="addShowDialog">查询</el-button>
          <el-button @click="addShowDialog">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addShowDialog">新增</el-button>
      </div>
      <div class="app-table app-table-nowrap">
        <el-table :data="dataList">
          <el-table-column fixed label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + (page_current - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column prop="username" label="机构名称"></el-table-column>
          <el-table-column label="区域"
            ><template slot-scope="scope">
              <span>江苏省 南京市江苏省 南京市江苏省 南京市</span>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="机构类型"></el-table-column>
          <el-table-column prop="role" label="管理员姓名"></el-table-column>
          <el-table-column prop="role" label="联系电话"></el-table-column>
          <el-table-column prop="role" label="管理员账号"></el-table-column>
          <el-table-column prop="phone" label="管理员密码"></el-table-column>
          <el-table-column prop="role" label="创建人"></el-table-column>
          <el-table-column prop="role" label="创建日期"></el-table-column>
          <el-table-column
            prop="create_time"
            label="添加时间"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="270">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="userEditEvent(scope.row.id)"
                  >进入系统</el-button
                >
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editShowDialog(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="userEditEvent(scope.row.id)"
                  >资料配置</el-button
                >
                <el-button
                  class="btn-del"
                  size="mini"
                  @click="userDeleteEvent(scope.row.id)"
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
        v-if="diaLogFormVisible"
      >
        <el-form
          :model="formData"
          class="el-form-custom"
          :rules="formRules"
          ref="formRulesRef"
          label-width="110px"
        >
          <el-form-item label="机构名称" prop="name">
            <el-input v-model="formData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="机构类型" prop="type_id">
            <el-select v-model="formData.type_id" placeholder="请选择职位">
              <el-option
                v-for="item in orgTypeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域" prop="area">
            <el-cascader   v-model="provinces" :options="options" style="width:280px">
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="管理员名称" prop="admin_name">
            <el-input
              v-model="formData.admin_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formData.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="管理员账号" prop="admin_username">
            <el-input
              v-model="formData.admin_username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理员密码" prop="password">
            <el-input v-model="formData.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="userAddEventDialog"
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
      searchFormData: {},
      diaLogFormVisible: false,
      diaLogTitle: "新增机构",
      uploadAction: this.hostURL + "/upload/uploadFile",
      formData: {},
      passwordOrg: "",
      formRules: {
        name: [
          {
            required: true,
            message: "请输入长度1-30字符的汉字、字母、数字或下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_]{1,30}$/,
            message: "请输入长度1-30字符的汉字、字母、数字或下划线组合",
            trigger: "blur",
          },
        ],
        type_id: [
          {
            required: true,
            message: "请选择职位",
            trigger: "change",
          },
        ],
        admin_name: [
          {
            required: true,
            message: "请输入长度1-10个字符的字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_]{1,10}$/,
            message: "请输入长度1-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        admin_username: [
          {
            required: true,
            message: "请输入长度1-10个字符的字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_]{1,10}$/,
            message: "请输入长度1-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入长度1-10个字符的字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\_]{1,10}$/,
            message: "请输入长度1-10个字符的字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur",
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
      page_current: 1,
      page_size: 20,
      page_total: 0,
      dataList: [],
      orgTypeList: [],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局",
                },
                {
                  value: "color",
                  label: "Color 色彩",
                },
                {
                  value: "typography",
                  label: "Typography 字体",
                },
                {
                  value: "icon",
                  label: "Icon 图标",
                },
                {
                  value: "button",
                  label: "Button 按钮",
                },
              ],
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框",
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框",
                },
                {
                  value: "input",
                  label: "Input 输入框",
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器",
                },
                {
                  value: "select",
                  label: "Select 选择器",
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器",
                },
                {
                  value: "switch",
                  label: "Switch 开关",
                },
                {
                  value: "slider",
                  label: "Slider 滑块",
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器",
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器",
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器",
                },
                {
                  value: "upload",
                  label: "Upload 上传",
                },
                {
                  value: "rate",
                  label: "Rate 评分",
                },
                {
                  value: "form",
                  label: "Form 表单",
                },
              ],
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格",
                },
                {
                  value: "tag",
                  label: "Tag 标签",
                },
                {
                  value: "progress",
                  label: "Progress 进度条",
                },
                {
                  value: "tree",
                  label: "Tree 树形控件",
                },
                {
                  value: "pagination",
                  label: "Pagination 分页",
                },
                {
                  value: "badge",
                  label: "Badge 标记",
                },
              ],
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告",
                },
                {
                  value: "loading",
                  label: "Loading 加载",
                },
                {
                  value: "message",
                  label: "Message 消息提示",
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框",
                },
                {
                  value: "notification",
                  label: "Notification 通知",
                },
              ],
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单",
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页",
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑",
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单",
                },
                {
                  value: "steps",
                  label: "Steps 步骤条",
                },
              ],
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框",
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示",
                },
                {
                  value: "popover",
                  label: "Popover 弹出框",
                },
                {
                  value: "card",
                  label: "Card 卡片",
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯",
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板",
                },
              ],
            },
          ],
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components",
            },
            {
              value: "sketch",
              label: "Sketch Templates",
            },
            {
              value: "jiaohu",
              label: "组件交互文档",
            },
          ],
        },
      ],
      provinces :['zujian','basic','layout']
      //
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getOrgTypeList() {
      this.request({
        url: "/org/getOrgTypeLists",
        method: "get",
      }).then((res) => {
        if (res.data.status == 1) {
          this.orgTypeList = res.data.data;
        }
      });
    },
    getDataList() {
      let page = this.page_current;
      let name = this.searchKeyword;
      let type_id = this.searchRole;
      let admin_name = this.searchRole;
      this.request({
        url: "/org/getOrgPages",
        method: "get",
        params: {
          page,
          type_id,
          name,
          admin_name,
        },
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
    searchRoleEvent(e) {
      this.page_current = 1;
      this.getDataList();
    },
    addShowDialog() {
      this.diaLogFormVisible = true;
      this.getOrgTypeList();
      this.formData = {};
    },
    userAddEventDialog() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          let data = that.formData;
          let url = "/user/addUser";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/user/editUser";
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