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
          <el-input v-model="filters.name" auto-complete="off" placeholder="视频名称"></el-input>
        </el-form-item>
        <!--<el-form-item prop="source">-->
          <!--<el-input v-model="filters.source" auto-complete="off" placeholder="视频来源"></el-input>-->
        <!--</el-form-item>-->
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
          <kt-button label="新增" type="primary" @click="handleAdd" />
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
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
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
          <el-input
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="视频地址" prop="vido" >
          <el-input v-model="dataForm.vido" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="人气" prop="popularity" >
          <el-input v-model="dataForm.popularity" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source" >
          <el-input v-model="dataForm.source" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" >
          <el-input type="number" v-model="dataForm.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible=false">{{
          $t("action.cancel")
          }}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
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
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload,
  },
  data() {
    return {
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        name: "",
        t: "showroomVideo",
      },
      dataForm: {
        id:"",
        vido: "",
        popularity:"",
        source:"",
        sort:"",
        name:""
      },
      dataFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        vido: [{ required: true, message: "请输入视屏地址", trigger: "blur" }],
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      checked: [],
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      dialogReviewedVisible:false,//审核显示
      editLoading: false,
      checkpage: false,
    };
  },
  methods: {
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm= {
        id:"",
        vido: "",
        popularity:"",
        source:"",
        sort:"",
        name:""
      }
      this.$nextTick(()=> {
        this.$refs['dataForm'].clearValidate();
      })
        },
    handleEdit(params) {
      let this_=this
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = {
        id:params.row.id,
        name:params.row.name,
        vido:params.row.vido,
        popularity:params.row.popularity,
        source:params.row.source,
        sort:params.row.sort
      }
    },
    //保存修改
    submitForm:function () {
      var this_=this
      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          this_.editLoading = true;
          let params = Object.assign({}, this_.dataForm);
          params.t="showroomVideo"
          this_.utils.request.editInfo(params, this_.editInfoBack);
        }
      });

    },
    // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage()
        this.dialogVisible=false
        this.editLoading=false
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
        this.dialogVisible=false
        this.editLoading=false
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
          let filename = "商品分类";
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
      let this_=this
      let params={}
        var ids = "";
        for (var i = 0; i < data.params.length; i++) {
          ids = ids + data.params[i].id + ",";
        }
      params.t = "showroomVideo";
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

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "name", label: "视频名称", minWidth: 120 },
        { prop: "vido", label: "视频地址", minWidth: 150},
        { prop: "popularity", label: "人气", minWidth: 120 },
        { prop: "source", label: "来源", minWidth: 120 },
        { prop: "sort", label: "排序", minWidth: 120 },
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    resetForm(formName) {
      let this_=this
      this.filters={
          name: "",
          t: "showroomVideo",
      },
      this.findPage();
    },
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
