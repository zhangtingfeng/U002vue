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
        <el-form-item prop="number">
          <el-input v-model="filters.number" auto-complete="off" placeholder="请输入门牌号"></el-input>
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
          <kt-button icon="el-icon-s-check" label="新增" type="primary" @click="addShop" />
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
            <!-- <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel" id="downloadExcel"></el-button>
            </el-tooltip> -->
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
      @findPage="findPage"
      @selectionChange="selectionChange"
      :showEditOperation="true"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      title="店铺门牌号详情"
      :visible.sync="shopModel"
      width="45%"
      height="100%"
      label-width="80px"
      label-position="right"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        ref="dataForm"
        label-position="right"
      >
        <el-form-item label="id" prop="id" v-if="false">
          <el-input v-model="dataForm.id" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="店铺门牌号" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click.native="cleNewsModel">{{$t('action.cancel')}}</el-button>
        <el-button @click.native="submitForm">{{$t('action.submit')}}</el-button>
        <!-- <el-button type="primary" @click.native="submitForm">{{$t('action.submit')}}</el-button> -->
      </div>
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
import VueQr from "vue-qr";
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload,
    VueQr
  },
  data() {
    return {
      imgUpload: this.utils.getUpLoadHost(),
      picFileList: [],

      dialogVisibleImg: false,
      shopModel: false,
      dataForm: {
      },
      disabled: false,
      dialogVisibleImg: false,
      username: "",

      options: [],
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      customer_nature: "",
      filters: {

        t: "shop_doorplate"
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      checked: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      checkpage: false,
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      businesslicenseimgUploadList: [],
      managerphotoimgUploadList: [],
      paperworkphotoimgUploadList: [],
    };
  },
  methods: {
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },

    //新增门牌号
    addShop() {
      let this_ = this;
      this_.dataForm = {};

      this_.shopModel = true;
      this_.picFileList = [];
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "shop_doorplate";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },

    // 显示编辑界面

    handleEdit: function(data) {
      this.shopModel = true;
      this.$nextTick(function() {
        this.dataForm = Object.assign({}, data.row);
      });
      if (data.row.pic != null || data.row.pic != "") {
        let imgUrl = {};
        imgUrl.name = data.row.id;
        imgUrl.url = data.row.pic;
        this.picFileList.push(imgUrl);
      }
      this.dataForm.open_begin_time = data.row.open_begin_time;
      this.dataForm.end_begin_time = data.row.end_begin_time;
    },

    //提交按钮
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.dataForm);
          params.t = "shop_doorplate";
          var this_ = this;
          console.log("保存信息===>>>>>>>>>" + JSON.stringify(params));
          this.utils.request.editInfo(params, function(res) {
            if (res.code == "0000") {
              this_.$message({ message: "操作成功", type: "success" });
              this_.shopModel = false;
              this_.$refs["dataForm"].resetFields();
              this_.findPage(null);
            } else {
              this_.$message({
                message: "操作失败, " + res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },

    //关闭编辑页面
    cleNewsModel() {
      let this_ = this;
      this_.shopModel = false;
      this_.findPage();
    },
    deleteInfoBack: function() {
      this.findPage();
    },
    // 显示查询
    queryInfo: function() {
      this.findPage(this.filters);
    },
    selectionChange: function(params) {
      console.log(params);
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

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "number", label: "店铺门牌号", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    handlePicRemove(file, fileList) {
      if (picFileList && picFileListt.length == 0) {
        this.dataForm.pic = "";
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }

  },
  mounted() {
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>