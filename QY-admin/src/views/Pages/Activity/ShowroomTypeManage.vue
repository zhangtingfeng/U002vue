<style>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
  font-size: 18px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="name">
          <el-input v-model="filters.name" auto-complete="off" placeholder="分类展厅名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="查询"
            type="primary"
            @click="$refs.CyTable.findPageBeforeRestPages(filters)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="el-icon-refresh"
            :label="$t('action.reset')"
            type="primary"
            @click="resetForm('filters')"
          />
        </el-form-item>
        <el-form-item>
          <kt-button label="新增" type="primary" @click="handleAdd" icon="el-icon-money" />
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button
                icon="fa fa-refresh"
                @click="$refs.CyTable.findPageBeforeRestPages(filters)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel" id="downloadExcel"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        @handleFilterColumns="handleFilterColumns"
        :columns="columns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <cy-table
      :max-height="500"
      :data="pageResult"
      :columns="filterColumns"
      :showBatchDelete="false"
      :showDetailOperation="true"
      :showReviewedOperation="true"
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleDetail="showRoomShop"
      @handleReviewed="handleReviewed"
      permsDetailLable="指定商家"
      permsCheckLable="所有商家"
      operationWidth="600"
      ref="CyTable"
    ></cy-table>
    <!--详情界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        ref="dataForm"
        :rules="dataFormRules"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品主图">
          <img-upload
            ref="ImgUpload"
            :filelist="picList"
            @handleImgUploadRemove="handleImgUploadRemove"
            @handleImgUploadChange="handleImgUploadChange"
            @handlePictureCardPreview="handlePictureCardPreview"
            uploadButton="picList"
          ></img-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible=false">
          {{
          $t("action.cancel")
          }}
        </el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleImageList" title="图片" @closed="beforeClose">
      <div style="max-height:500px;overflow: auto;">
        <div v-for="(file,index) in fileList" :key="index" :tabindex="index" style="width:100%">
          <img style="max-height:500px" :src="file" alt />
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showroomShopShow" title="指定商家" style="width:100%">
      <component
        :is="item.content"
        :showroom_type_id="showroom_type_id"
        @closeShowroomShopShow="closeShowroomShopShow"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format, formatDate } from "@/utils/datetime";
import CyTable from "@/views/Core/CyTable";
import ImgUpload from "@/views/Core/ImgUpload";
import { exportExcel } from "@/utils/excel";
import ShopList from "@/views/Pages/ShopListSearch.vue";
import ShopListDetail from "@/views/Pages/ShopListSearchDetail.vue";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload,
    ShopList,
    ShopListDetail
  },
  data() {
    return {
      item: {
        content: "ShopList"
      },
      showroom_type_id: "",
      showroomShopShow: false,
      picList: [],
      fileList: [],
      dialogVisibleImageList: false,
      picFileList: [],
      imageSizeLimit: 1, //图片上传个数控制
      imageAccept: ".jpg,.jpeg,.png,.JPG,.JPEG", //图片上传格式
      imgUpload: this.utils.getUpLoadHost(),
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        type: "",
        t: "showroomType"
      },
      dataForm: {
        id: "",
        name: "",
        pic: ""
      },
      dataFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        pic: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      checked: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      dialogReviewedVisible: false, //审核显示
      editLoading: false,
      checkpage: false
    };
  },
  methods: {
    closeShowroomShopShow() {
      this.showroomShopShow = false;
      this.item.content = "";
    },
    handlePictureCardPreview(data) {
      var url = data.url;
      this.filelist = [];
      this.filelist.push(url);
      this.dialogVisibleImageList = true;
    },

    handleImgUploadRemove(data) {
      var index = data.index;
      this.picList.splice(index, 1);
    },
    handleImgUploadChange(data) {
      this.picList = data.filelist;
      this.picList = [this.picList[this.picList.length - 1]];
    },
    beforeClose() {
      this.filelist = [];
    },
    //图片预览
    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return (
          '<i class="el-icon-zoom-in"><div style="display:none">' +
          cellValue +
          "</div></i>"
        );
      }
    },

    showRoomShop: function(params) {
      this.item.content = "";
      this.$nextTick(() => {
        this.item.content = "ShopList";
        this.showroomShopShow = true;
        this.showroom_type_id = params.row.id;
      });
    },
    handleReviewed: function(params) {
      this.item.content = "";
      this.$nextTick(() => {
        this.item.content = "ShopListDetail";
        this.showroomShopShow = true;
        this.showroom_type_id = params.row.id;
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: "",
        name: "",
        pic: ""
      };
      this.picList = [];
    },
    handleEdit(params) {
      let this_ = this;
      this.dialogVisible = true;
      this.operation = false;

      this.$nextTick(() => {
        let this_ = this;
        this.dataForm = Object.assign({}, params.row);
        this.picList = [];

        if (this.dataForm.pic) {
          $.each(this.dataForm.pic.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.picList.push(param);
            }
          });
        }
      });
    },
    //保存修改
    submitForm: function() {
      var this_ = this;
      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          this_.editLoading = true;
          let params = Object.assign({}, this_.dataForm);
          params.t = "showroomType";

          params.pic = this.picList.map(item => item.url).toString();
          if (!params.pic) {
            this.$message({ message: "请选择图片", type: "error" });
            return;
          }

          this_.utils.request.editInfo(params, this_.editInfoBack);
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
        this.dialogVisible = false;
        this.editLoading = false;
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
        this.dialogVisible = false;
        this.editLoading = false;
      }
    },
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "展厅分类";
          this.exportData(this.filters, this.filterColumns, filename);
        })
        .catch(() => {});
    },
    //excle导出
    exportData(filters, filterColumns, fileName) {
      if (filters == undefined || filters == null) {
        filters = {};
      }
      filters.start = null;
      filters.limit = null;
      this.utils.request.queryUserPage(filters, res => {
        if (fileName == undefined || fileName == null) {
          fileName = "excel-list";
        }

        fileName = fileName + "_" + formatDate(new Date(), "yyyyMMdd");

        if (res.rows == null || res.rows.length == 0) {
          this.$message({ message: "暂无需要导出的数据 ", type: "error" });
          return;
        }

        $.each(res.rows, (key, val) => {
          if (val.status == 0) {
            val.status = "认证成功";
          } else if (val.status == 1) {
            val.status = "认证失败";
          }

          if (val.type == 0) {
            val.type = "市场经营人员";
          } else if (val.type == 1) {
            val.type = "采购商";
          }
        });

        exportExcel(res.rows, filterColumns, fileName);
      });
    },
    // 批量删除
    handleDelete: function(data) {
      let this_ = this;
      let params = {};
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      params.t = "showroomType";
      params.ids = ids;
      this_.utils.request.deleteUserInfo(params, this_.deleteInfoBack);
    },
    deleteInfoBack: function() {
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
      this.$message({ message: "操作成功", type: "success" });
    },

    selectionChange: function(params) {
      this.checked = params.selections;
    },

    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },

    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "name", label: "分类名称", minWidth: 120 },
        { prop: "pic", label: "主图", minWidth: 120, formatter: this.showPhto }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    resetForm(formName) {
      let this_ = this;
      (this.filters = {
        type: "",
        name: "",
        t: "showroomType"
      }),
        this.findPage();
    }
  },
  mounted() {
    this.initColumns();
    $(document).on(
      "click",
      ".el-icon-zoom-in",
      function(e) {
        let urlList = $(e.target)
          .find("div")
          .html();
        this.fileList = [];
        this.fileList.push(urlList);
        this.dialogVisibleImageList = true;
        console.log(this.fileList);
      }.bind(this)
    );
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>
