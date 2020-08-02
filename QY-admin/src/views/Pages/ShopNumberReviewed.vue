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
          <el-input v-model="filters.name" auto-complete="off" placeholder="店铺名称"></el-input>
        </el-form-item>
        <el-form-item prop="legal_name">
          <el-input v-model="filters.legal_name" auto-complete="off" placeholder="法人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="legal_number">
          <el-input v-model="filters.legal_number" auto-complete="off" placeholder="法人身份证"></el-input>
        </el-form-item>
        <el-form-item prop="license_number">
          <el-input v-model="filters.license_number" auto-complete="off" placeholder="营业执照编号"></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="filters.mobile" auto-complete="off" placeholder="商铺联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="number_status">
          <el-select v-model="filters.number_status" placeholder="门牌号状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
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
        <!--<el-form-item>-->
        <!--<kt-button label="新增" type="primary" @click="handleAdd" />-->
        <!--</el-form-item>-->
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
      :showEditOperation="false"
      :showDetailOperation="true"
      :showReviewedOperation="true"
      permsDetail="pages:shopReviewed:checked"
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleDetail="handleDetail"
      @handleReviewed="handleReviewed"
      ref="CyTable"
    ></cy-table>
    <!--详情界面-->
    <el-dialog title="店铺详情" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        :model="dataForm"
        label-width="120px"
        ref="dataForm"
        :size="size"
        inline
        class="form"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="店铺地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="营业执照编号" prop="license_number">
          <el-input v-model="dataForm.license_number" auto-complete="off"></el-input>
        </el-form-item> -->

        <el-form-item label="店铺门牌号" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="法人姓名" prop="legal_name">
          <el-input v-model="dataForm.legal_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="法人身份证" prop="legal_number">
          <el-input v-model="dataForm.legal_number" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="注册资本" prop="register_capital">
          <el-input v-model="dataForm.register_capital" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="主营项目" prop="scope">
          <el-input v-model="dataForm.scope" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="商铺联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属用户" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="营业结束时间" prop="end_begin_time">
          <el-input v-model="dataForm.end_begin_time" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="营业结束时间" prop="end_begin_time">
          <el-input v-model="dataForm.end_begin_time" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="门牌号状态" prop="number_status" placeholder="门牌号状态">
          <el-select v-model="dataForm.number_status">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介" prop="desc">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="dataForm.desc" style="min-width:400px"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="店铺图片" prop="desc">
            <img :src="dataForm.pic"  style="max-width:500px" /> 
          </el-form-item>

          <el-form-item label="营业执照" prop="license_positive">
            <img :src="dataForm.license_positive" style="max-width:500px" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click="dialogVisible=false">
          {{
          $t("action.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
    <!--新增编辑界面-->
    <el-dialog
      title="店铺审核"
      width="30%"
      :visible.sync="dialogReviewedVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataFormReviewed"
        label-width="80px"
        ref="dataForm"
        :rules="dataFormReviewedRules"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataFormReviewed.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="门牌号状态" prop="number_status" placeholder="门牌号状态">
          <el-select v-model="dataFormReviewed.number_status">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click="dialogReviewedVisible=false">
          {{
          $t("action.cancel")
          }}
        </el-button>
        <el-button :size="size" @click="submitForm">
          {{
          $t("action.submit")
          }}
        </el-button>
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
    ImgUpload
  },
  data() {
    return {
      imgUrl: "",
      statusOptions: [
        { key: 0, value: "待审核" },
        { key: 1, value: "审核通过" },
        { key: 2, value: "审核拒绝" }
      ],
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        number_status: 0,
        name: "",
        examineNum:'1',
        license_number: "",
        legal_name: "",
        legal_number: "",
        mobile: "",
        t: "shop"
      },
      dataForm: {
        id: "",
        name: "",
        pic: "",
        address: "",
        license_number: "",
        license_number: "",
        register_capital: "",
        scope: "",
        mobile: "",
        pro_evaluate: "",
        open_begin_time: "",
        end_begin_time: "",
        desc: "",
        number_status: "",
        username: ""
      },
      dataFormReviewed: {
        id: "",
        number_status: ""
      },
      dataFormReviewedRules: {
        number_status: [{ required: true, message: "请选择门牌号审核状态", trigger: "blur" }]
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
      checkpage: false,
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  methods: {
    //审核按钮
    handleReviewed(params) {
      let this_ = this;
      this_.dialogReviewedVisible = true;
      this_.dataFormReviewed.number_status = params.row.number_status;
      this_.dataFormReviewed.id = params.row.id;
    },
    // 显示编辑界面
    handleDetail: function(params) {
      let this_ = this;
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      this.imgUrl = params.row.pic;
    },
    //保存修改
    submitForm: function() {
      var this_ = this;
      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          this_.editLoading = true;
          let params = Object.assign({}, this_.dataFormReviewed);
          params.t = "shop";
          params.method = "updateShopNumberStatus";
          this_.utils.request.checkShopDoorPlate(params, this_.editInfoBack);
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
        this.dialogReviewedVisible = false;
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
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
          let filename = "认证记录";
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
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "shop";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    deleteInfoBack: function() {
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
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
        { prop: "name", label: "店铺名称", minWidth: 120 },
        { prop: "address", label: "店铺地址", minWidth: 120 },
        // { prop: "license_number", label: "营业执照编号", minWidth: 180 },
        { prop: "number", label: "店铺门牌号", minWidth: 180 },
        { prop: "legal_name", label: "法人姓名", minWidth: 120 },
        { prop: "legal_number", label: "法人身份证", minWidth: 120 },
        { prop: "mobile", label: "商铺联系电话", minWidth: 180 },
        { prop: "scope", label: "所属分类", minWidth: 120 },
        {
          prop: "number_status",
          label: "门牌号状态",
          minWidth: 120,
          formatter: this.showStatus
        },
        {
          prop: "create_time",
          label: "创建时间",
          minWidth: 120
        }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      let this_ = this;
      (this_.filters = {
        number_status: "",
        name: "",
        license_number: "",
        legal_name: "",
        legal_number: "",
        mobile: "",
        t: "shop"
      }),
        this.findPage();
    },
    showStatus(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "待审核";
      } else if (cellValue == 1) {
        return "审核通过";
      } else {
        return "审核拒绝";
      }
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
