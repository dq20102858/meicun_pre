<template>
  <div class="app-page">
    <div class="app-page-title">资料配置</div>
    <div class="app-page-container">
      <div class="app-page-adds">
        <el-button type="primary" @click="addMaterialDialog">新增</el-button>
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
                  @click="editMaterialDialog(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  class="btn-del"
                  size="mini"
                  @click="delMaterialDialog(scope.row.id)"
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
        @opened="showEditor"
        @closed="hideEditor"
        width="780px"
        class="dialog-mater"
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
          <el-form-item label="资料内容：" prop="content">
            <el-input
              v-model="formData.content"
              autocomplete="off"
              style="display: none"
            ></el-input>
            <div ref="editorElem" id="content" style="height: 346px"></div>
          </el-form-item>
          <el-form-item label="附件：">
            <el-upload
              ref="uploadfive"
              class="avatar-uploader"
              :action="uploadAction"
              :auto-upload="true"
              :on-exceed="uploadExceed"
              :before-upload="uploadBefore"
              :on-success="uploadSuccess"
              :show-file-list="false"
              :file-list="uploadFileList"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMaterialEvent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  data() {
    // var validateConn = (rule, value, callback) => {
    // debugger
    //   if (value === "") {
    //     callback(new Error("请输入"));
    //   } else {
    //     if (this.ruleForm.content !== "") {
    //       this.$refs.ruleForm.validateField("content");
    //     }
    //     callback();
    //   }
    // };
    return {
      uploadAction: this.hostURL + "/upload/uploadFile",
      uploadFileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
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
        content: [
          {
            required: true,
            message: "请输入资料内容",
            trigger: "blur",
          },
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
  },
  methods: {
    getDataList() {
      let page = this.page_current;
      this.request({
        url: "/org/getMaterialPages",
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
    showEditor() {
      let that = this;
      const editor = new E(document.getElementById("content"));
      editor.config.onchange = function (newHtml) {
        that.$set(that.formData, "content", newHtml);
        that.$refs.formRulesRef.validateField("content");
      };
      editor.config.menus = this.editorMenus;
      editor.create();
    },
    hideEditor() {
      this.$refs.editorElem.innerHTML = "";
    },
    saveMaterialEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          that.formData.file = this.uploadFileList;
          that.formData.role_id = this.$route.query.orgid;
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
          //       customClass: "el-submit-message",
          //       showClose: true,
          //       message: "保存成功！",
          //     });
          //   }
          // });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
    },
    addMaterialDialog() {
      this.diaLogTitle = "新增资料";
      this.diaLogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {};
    },
    editMaterialDialog(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "编辑资料";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/org/editMaterial",
        method: "get",
        params: { id: id },
      }).then((response) => {
        let data = response.data;
        if (data.status == 1) {
          this.formData = data.data;
        }
      });
    },
    delMaterialDialog(id) {
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        customClass: "el-message-box-new",
      })
        .then(() => {
          this.request({
            url: "/org/deleteMaterial",
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
    //上传图片
    uploadExceed() {
      this.$message({
        type: "warning",
        customClass: "el-submit-message",
        showClose: true,
        message: `最多可以上传1张图片`,
      });
    },
    uploadSuccess(res, file) {
      console.log("上传成功", res);
      this.$set(this.formData, "avatar", res.data.url);
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
  },
};
</script>
<style>
.dialog-mater .el-select {
  width: 100%;
}
.dialog-mater .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.dialog-mater .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.dialog-mater .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 68px;
  height: 68px;
  line-height: 68px;
  text-align: center;
}
.dialog-mater .avatar {
  width: 68px;
  height: 68px;
  display: block;
}
</style>