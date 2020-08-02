
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="memberName">
          <el-input v-model="filters.username" auto-complete="off" placeholder="会员名称"></el-input>
        </el-form-item>
        <el-form-item prop="telephone">
            <el-input v-model="filters.telephone" auto-complete="off" placeholder="手机号码"></el-input>
        </el-form-item>

        <el-form-item prop="type">
          <el-select v-model="filters.sex" auto-complete="off" placeholder="性别">
           <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.value"
            :value="item.key">
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
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleDetail="handleDetail"
      @selection-change="selectionChange"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->

    <el-dialog title="详情页面" :visible.sync="checkpage"  width="40%">
       <el-form
        :model="dataForm"
        label-width="120px"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
        
      >
        <el-row style="text-align:center">
          <el-form-item >
             <img :src="imgs" style="height:40%;width:60%" alt/>
          </el-form-item>
        </el-row>
     <el-row style="text-align:left">
        <el-col :span="24">
          <el-form-item label="会员名称">
             {{dataForm.username}}
          </el-form-item>
        </el-col>
        
       <el-col :span="24">
          <el-form-item label="手机号码">
             {{dataForm.telephone}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="性别：">
             {{dataForm.isSex}}
          </el-form-item>
        </el-col>
       <el-col :span="24">
          <el-form-item label="注册时间：">
             {{dataForm.create_time}}
          </el-form-item>
        </el-col>
     </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="checkpage = false">取 消</el-button>
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
      dialogVisibleImageList:false,
      disabled: false,
      dialogVisibleReviw:false,
      dialogVisibleImg: false,
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadCustomerExcel?token=" +
        localStorage.getItem("token"),
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: [],
      filelist:[],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      customer_nature: "",
      imgs:'',
       options: [
         { key: 1, value: "女" },
         { key: 0, value: "男" },
      ],
      dataStatusForm:{

      },
      dataFormRules:{
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
      },
     
      filters: {
        status: "",
        card_num: "",
        type: "",
        t: "member",
        // startTime: formatDate(
        //   new Date(new Date(new Date().toLocaleDateString()).getTime()),
        //   "yyyy-MM-dd hh:mm:ss"
        // ),
        // endTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
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
      dataForm: {
        isCharge: "",
      },
     
      roles: [],
      businesslicenseimgUploadList: [],
      managerphotoimgUploadList: [],
      paperworkphotoimgUploadList: []
    };
  },
  methods: {
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    review(data){
      if(this.checked.length>1 || this.checked.length<1){
        this.$message({message:"审核时只可选择一条数据",type:'error'});return;
      }
      this.dialogVisibleReviw=true;
    },
    submitStatus(){
      var this_=this
      let query={};
      query = Object.assign({}, this.dataStatusForm);
      query.id=this.checked[0].id;
      query.t="member"
     this_.utils.request.editInfo(query,function(res){
       if(res.code == '0000'){
        this_.$message({message:'操作成功', type:'success'});
      }else{
        this_.$message({message:'操作失败', type:'error'});
      }
      this_.dialogVisibleReviw=false;
     })
    },
    //详情页面
    handleDetail(data){
     this.dataForm = Object.assign({}, data.row);
     this.checkpage=true;
     this.imgs=data.row.pic;
     if(data.row.sex==0){
        this.dataForm.isSex="男"
     }else{
        this.dataForm.isSex="女"
     }
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "活动";
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

        exportExcel(res.rows, filterColumns, fileName);
      });
    },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "member";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    deleteInfoBack: function(res) {
      if(res.code == '0000'){
        this.$message({message:'操作成功', type:'success'});
      }else{
        this.$message({message:'操作失败', type:'error'});
      }
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
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

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "username", label: "会员名称", minWidth: 120 },
        { prop: "telephone", label: "手机号码", minWidth: 120 },
        { prop: "pic", label: "会员头像", minWidth: 120 ,formatter:this.showPhto},
        { prop: "sex", label: "性别", minWidth: 180 ,formatter:this.showSex},
        { prop: "birth_date",label: "出生日期", minWidth: 120},
        { prop: "create_time", label: "注册时间", minWidth: 120 },
        { prop: "status", label: "状态", minWidth: 120,formatter: this.showStatus},
        { prop: "is_business", label: "是否是商家", minWidth: 120 ,formatter: this.showBusiness}
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      this.filters = {
        t: "member",
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    showPaperType(row, column, cellValue, index) {
      $.each(this.customer_type_options, function(key, value) {
        if (value.key == cellValue) {
          cellValue = value.val;
          return;
        }
      });

      return cellValue;
    },
    showBusiness(row, column, cellValue, index) {
       if (cellValue == 0) {
        return " 否";
      }else if(cellValue == 1){
         return "是";
      }
    },
     showSex(row, column, cellValue, index) {
      if (cellValue == 0) {
        return " 男";
      }else if(cellValue == 1){
         return "女";
      }
    },
    showStatus(row, column, cellValue, index) {
      if (cellValue == 0) {
        return " 正常使用";
      }else if(cellValue == 1){
         return "已注销";
      }else if(cellValue == 2){
          return "审核拒绝";
      }
    },
    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return (
          '<img src="'+cellValue+'" min-width="80" height="60">'
        );
      }
    },

    showIsCharge(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "不收费";
      }
      return "收费";
    },

    showbusinessdatestart(row, column, cellValue, index) {
      if (this.utils.isNull(cellValue)) {
        return "";
      }
      return cellValue.substring(0, 10);
    },

    downloadTemplete() {
      var a = document.createElement("a");
      a.href = "/static/excel/customerinformation.xlsx";
      a.download = "客户档案模板.xlsx";
      a.click();
    },
    handleExcelSuccess(res, file) {
      let fileUrl = URL.createObjectURL(file.raw);
      if (res.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
      } else {
        this.$message({ message: "导入失败", type: "error" });
      }
    },
    beforeExcelUpload(file) {
      console.log(file);
      return true;
    },
    initSysConfig() {
      var params = {};
      params.t = "sysConfig";
      params.type = "customer_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.customer_type_options = res.data;
      });

      params.type = "paperwork_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.paperwork_type_options = res.data;
      });

      params.type = "trade_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.trade_type_options = res.data;
      });
    }
  },
  mounted() {
    this.initColumns();
    this.findPage();
    $(document).on(
      "click",
      ".el-icon-zoom-in",
      function(e) {
        let urlList = $(e.target)
          .find("div")
          .html();
        this.filelist = urlList.split(",");
        this.dialogVisibleImageList = true;
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