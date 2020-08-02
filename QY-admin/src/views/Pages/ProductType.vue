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
          <el-input v-model="filters.name" auto-complete="off" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="filters.type" placeholder="分类级别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类级别" prop="type" >
          <el-select v-model="dataForm.type" style="width: 100%" placeholder="分类级别" :disabled="typeDisabled" @change="changeType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属上级" prop="pid" v-if="showPid">
          <el-select v-model="dataForm.pid" style="width: 100%" placeholder="所属上级" @change="changeType">
            <el-option
              v-for="item in pOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
      typeDisabled:true,//所属分类是否能编辑
      pOptions:[],//所属上级
      showPid:false,//是否显示所属上级
      options:[{value:0,label:"一级分类"},{value:1,label:"二级分类"},{value:2,label:"三级分类"},{value:3,label:"四级分类"}],
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        type: "",
        name: "",
        t: "productType",
      },
      dataForm: {
        id:"",
        name: "",
        type:"",
        pid:"",
      },
      dataFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择级别", trigger: "change" }],
        pid: [{ required: true, message: "请选择上级分类", trigger: "change" }],
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
    //根据所选分类展示所选上级
    changeType:function(param){
      let this_=this
      if(param==0){
        this.showPid=false
        this.pOptions=[]
      }else{
        this.showPid=true
        let params={}
        params.type=param-1
        params.t="productType"
        this_.utils.request.queryUserList(params, function (res) {
          if(res.data!=null){
            this_.pOptions=res.data
          }
        });
      }
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm= {
        id:"",
        name: "",
        type: "",
      }
      this.typeDisabled=false
      this.showPid=false
      this.$nextTick(()=> {
        this.$refs['dataForm'].clearValidate();
      })
        },
    handleEdit(params) {
      let this_=this
      this_.changeType(params.row.type)
      this.dialogVisible = true;
      this.operation = false;
      this.typeDisabled=true
      this.dataForm = {
        id:params.row.id,
        name:params.row.name,
        type:params.row.type,
        pid:params.row.pid
      }
    },
    //保存修改
    submitForm:function () {
      var this_=this
      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          this_.editLoading = true;
          let params = Object.assign({}, this_.dataForm);
          params.t="productType"
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
      //判断当前分类是否有子类
      let params={}
      params.byId=data.params[0].id
      params.t="productType"
      this_.utils.request.queryUserList(params, function (res) {
        if(res.data.length==0){
          var ids = "";
          for (var i = 0; i < data.params.length; i++) {
            ids = ids + data.params[i].id + ",";
          }
          data.t = "productType";
          data.ids = ids;
          this_.utils.request.deleteUserInfo(data, this_.deleteInfoBack);
        }else{
          this_.$message({ message: "当前分类存在子分类，不可删除",type: "error" });
        }
      });
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
        { prop: "name", label: "分类名称", minWidth: 120 },
        { prop: "type", label: "所属分类", minWidth: 120,formatter: this.showType},
        { prop: "pname", label: "所属上级", minWidth: 120 },
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    showType(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "一级分类";;
      }else if(cellValue==1){
        return "二级分类";
      }else if(cellValue==2){
        return "三级分类";
      }else{
        return "四级分类";
      }
    },
    resetForm(formName) {
      let this_=this
      this.filters={
         type: "",
          name: "",
          t: "productType",
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
