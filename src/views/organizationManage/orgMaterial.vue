<template>
  <div class="app-page">
    <div class="app-page-title">资料配置</div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addOrgDialogShow">新增</el-button>
      </div>
      <div class="app-table">
        <el-table :data="dataList" border>
          <el-table-column label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + (page_current - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column prop="name" label="机构名称"></el-table-column>
          <el-table-column
            prop="reletion_nums"
            label="关联机构数"
          ></el-table-column>
          <el-table-column prop="create_user" label="创建人"></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  size="mini"
                  @click="editOrgDialogShow(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  class="btn-del"
                  size="mini"
                  @click="delOrgEvent(scope.row.id)"
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
        @opened="showClick"
        @closed="hideClick"
        width="780px"
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
          <el-form-item label="资料名称：" prop="name">
            <el-input
              v-model="formData.name"
              autocomplete="off"
              placeholder="请输入机构类型名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="资料内容：">
            <div id="wangeditor">
              <div ref="editorElem" id="content" style="height: 320px"></div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMaterialEvent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editorContent: "",
      editorMenus: [
        "head",
        "bold",
        "fontSize",
        "italic",
        "underline",
        "strikeThrough",
        "foreColor",
        "backColor",
        "link",
        "list",
        "todo",
        "justify",
        "quote",
        "table",
      ],
      diaLogFormVisible: false,
      diaLogTitle: "新增类型",
      formData: {},
      formRules: {
        name: [
          {
            required: true,
            message: "请输入资料名称",
            trigger: "blur",
          },
          { min: 1, max: 20, message: "长度1-20个字符", trigger: "blur" },
        ],
      },
      page_current: 1,
      page_total: 0,
      page_size: 20,
      dataList: [],
    };
  },
  created() {
    this.getDataList();
    //editor.config.menus = ["bold", "head", "link", "italic", "underline"];
  },
  methods: {
    showClick() {
      let that = this;
      const editor = new E(document.getElementById("content"));
      editor.config.onchange = function (newHtml) {
        that.editorContent = newHtml;
      };
      editor.config.menus = this.editorMenus;
      editor.create();
    },
    hideClick() {
      this.$refs.editorElem.innerHTML = "";
      this.editorContent = null;
    },
    getDataList() {
      let page = this.page_current;
      this.request({
        url: "/org/getOrgTypePages",
        method: "get",
        params: {
          page,
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
    addOrgDialogShow() {
      this.diaLogTitle = "新增类型";
      this.diaLogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {};
    },
    addMaterialEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          that.formData.content = this.editorContent;
          let data = that.formData;
          let url = "org/addMaterial";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "org/editMaterial";
          }
          console.log(data);
          // this.request({
          //   url: url,
          //   method: "post",
          //   data,
          // }).then((response) => {
          //   var data = response.data;
          //   if (data.status == 1) {
          //     this.diaLogFormVisible = false;
          //     this.getDataList();
          //     this.$message({
          //       type: "success",
          //       dangerouslyUseHTMLString: true,
          //       message: "<b>保存成功！</b>",
          //     });
          //   }
          // });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
    },
    editOrgDialogShow(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "编辑类型";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/org/getOrgTypeInfo",
        method: "get",
        params: { id: id },
      }).then((response) => {
        let data = response.data;
        if (data.status == 1) {
          this.formData = data.data;
        }
      });
    },
    delMaterialEvent(id) {
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        customClass: "el-message-box-new",
      })
        .then(() => {
          this.request({
            url: "/org/deleteOrgType",
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
                dangerouslyUseHTMLString: true,
                message: "<b>删除成功！</b>",
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