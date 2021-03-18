<template>
  <div class="app-page">
    <div class="app-page-title">机构管理</div>
    <div class="app-page-select">
      <el-form :inline="true">
        <el-form-item class="el-form-item" label="机构名称：">
          <el-input
            v-model="searchFormData.name"
            class="input-with-select"
            placeholder="请输入机构名称"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="机构类型：">
          <el-select v-model="searchFormData.typeId" placeholder="全部类型">
            <el-option
              v-for="item in orgTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="管理员名称：">
          <el-input
            v-model="searchFormData.adminName"
            class="input-with-select"
            placeholder="请输入管理员名称"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="searchOrgEvent">查询</el-button>
          <el-button @click="searchOrgResetEvent">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addOrgDialog">新增</el-button>
      </div>
      <div class="app-table app-table-nowrap">
        <el-table :data="dataList">
          <el-table-column fixed label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + (page_current - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column prop="name" label="机构名称"></el-table-column>
          <el-table-column prop="area" label="区域"></el-table-column>
          <el-table-column prop="org_type" label="机构类型"></el-table-column>
          <el-table-column
            prop="admin_name"
            label="管理员姓名"
          ></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column
            prop="admin_username"
            label="管理员账号"
          ></el-table-column>
          <el-table-column prop="password" label="管理员密码"></el-table-column>
          <el-table-column prop="create_user" label="创建人"></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建日期"
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="270"
            align="center"
          >
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-into"
                  size="mini"
                  @click="editOrgDialog(scope.row.id)"
                  >进入系统</el-button
                >
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editOrgDialog(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  class="btn-del"
                  size="mini"
                  @click="delOrgDialog(scope.row.id)"
                  >删除</el-button
                >
                <el-button
                  class="btn-set"
                  size="mini"
                  @click="materialDialog(scope.row.id)"
                  >资料配置</el-button
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
            <el-input
              v-model.trim="formData.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="机构类型" prop="type_id">
            <el-select
              v-model="formData.type_id"
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in orgTypeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域" prop="area_id">
            <el-cascader
              placeholder="请选择区域"
              ref="areas"
              v-model="formData.area_id"
              :options="options"
              filterable
              style="width: 100%"
            >
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
              placeholder="默认输入管理员名称的全拼"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理员密码" prop="password">
            <el-input v-model="formData.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrgEvent">确 定</el-button>
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
      formData: {
        area_id: "",
      },
      passwordOrg: "",
      formRules: {
        name: [
          {
            required: true,
            message: "请输入机构名称",
            trigger: "blur",
          },
          { min: 1, max: 30, message: '长度1-30个字符', trigger: 'blur' }
        ],
        type_id: [
          {
            required: true,
            message: "请选择机构类型",
            trigger: "change",
          },
        ],
        area_id: [
          {
            type: "array",
            required: true,
            message: "请选择所属区域",
            trigger: ["blur", "change"],
          },
        ],
        admin_name: [
          {
            required: true,
            message: "请输入管理员姓名",
            trigger: "blur",
          },
          {
            pattern: /[0-9a-zA-Z\u4e00-\u9fa5]{1,10}$/,
            message: "请输入长度1-10个字符的的汉字、字母、数字",
            trigger: "blur",
          },
        ],
        admin_username: [
          {
            required: true,
            message: "请输入管理员账号",
            trigger: "blur",
          },
          {
            pattern: /[a-zA-Z]{1,10}$/,
            message: "请输入长度1-20个字符字母全拼",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入管理员密码",
            trigger: "blur",
          },
          {
            pattern: /[0-9a-zA-Z]{1,20}$/,
            message: "请输入长度1-20个字符的字母、数字",
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
          value: "1",
          label: "北京",
          children: [
            {
              value: "2",
              label: "北京",
              children: [
                {
                  value: "3",
                  label: "昌平区",
                },
                {
                  value: "4",
                  label: "海淀区",
                },
                {
                  value: "5",
                  label: "丰台区",
                },
              ],
            },
          ],
        },
        {
          value: "10",
          label: "江苏省",
          children: [
            {
              value: "11",
              label: "无锡",
              children: [
                {
                  value: "12",
                  label: "梁溪区",
                },
                {
                  value: "13",
                  label: "滨湖区",
                },
                {
                  value: "14",
                  label: "锡山区",
                },
                {
                  value: "15",
                  label: "惠山区",
                },
              ],
            },
            {
              value: "20",
              label: "南京市",
              children: [
                {
                  value: "21",
                  label: "玄武区",
                },
                {
                  value: "22",
                  label: "建邺区",
                },
                {
                  value: "23",
                  label: "秦淮区",
                },
              ],
            },
          ],
        },
      ],
      //
    };
  },
  created() {
    this.getOrgTypeList();
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
      let name = this.searchFormData.name;
      let type_id = this.searchFormData.typeId;
      let admin_name = this.searchFormData.adminName;
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
          this.page_current = parseInt(res.data.data.current_page);
          this.page_total = res.data.data.total;
          this.page_size = res.data.data.per_page;
        }
      });
    },
    pageChange(value) {
      this.page_current = value;
      this.getDataList();
    },
    searchOrgEvent() {
      this.page_current = 1;
      this.getDataList();
    },
    searchOrgResetEvent() {
      this.searchFormData = {};
      this.page_current = 1;
      this.getDataList();
    },
    addOrgDialog() {
      this.diaLogTitle = "新增机构";
      this.diaLogFormVisible = true;
      this.$set(this.formData, "area_id", "");
      this.formData = {};
    },
    materialDialog(id) {
      this.$router.push({
        path: "/organizationManage/orgMaterial",
        query: { orgid: id },
      });
     
    },
    editOrgDialog(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "编辑机构";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/org/getOrgInfo",
        method: "get",
        params: { id: id },
      }).then((response) => {
        let data = response.data;
        if (data.status == 1) {
          this.formData = data.data;
        }
      });
    },
    delOrgDialog(id) {
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-new",
      })
        .then(() => {
          this.request({
            url: "/org/deleteOrg",
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
    saveOrgEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          var areatxt = this.$refs["areas"].getCheckedNodes()[0].pathLabels;
          that.formData.area = areatxt;
          let data = that.formData;
          let url = "/org/addOrg";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/org/editOrg";
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