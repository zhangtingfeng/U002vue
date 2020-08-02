
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="card_num">
          <el-input v-model="filters.name" auto-complete="off" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="status">
            <el-input v-model="filters.company" auto-complete="off" placeholder="公司"></el-input>
        </el-form-item>
         <el-form-item prop="status">
            <el-input v-model="filters.mobile" auto-complete="off" placeholder="手机号"></el-input>
        </el-form-item>
         <el-form-item prop="status">
            <el-input v-model="filters.telephone" auto-complete="off" placeholder="电话"></el-input>
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
      @handleDetail="handleDetail"
       @handleDelete="handleDelete"
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
             <img :src="imgs" style="height:40%;width:40%" alt/>
          </el-form-item>
        </el-row>
     <el-row style="text-align:left">
        <el-col :span="12">
          <el-form-item label="编码：">
             {{dataForm.code}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名称：">
             {{dataForm.memberName}}
          </el-form-item>
        </el-col>
       <el-col :span="12">
          <el-form-item label="手机：">
             {{dataForm.mobile}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名：">
             {{dataForm.name}}
          </el-form-item>
        </el-col>
       <el-col :span="12">
          <el-form-item label="公司：">
             {{dataForm.company}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="称谓：">
             {{dataForm.appellation}}
          </el-form-item>
        </el-col>
        <el-col :span="12" >
           <el-form-item label="职务：">
              {{dataForm.post}}
           </el-form-item>
        </el-col>
        <el-col :span="12" >
           <el-form-item label="部门：">
              {{dataForm.department}}
           </el-form-item>
        </el-col>
        <el-col :span="12" >
           <el-form-item label="省份：">
              {{dataForm.province}}
           </el-form-item>
        </el-col>
         <el-col :span="12" >
           <el-form-item label="市区：">
              {{dataForm.city}}
           </el-form-item>
        </el-col>
         <el-col :span="12" >
           <el-form-item label="区县：">
              {{dataForm.district}}
           </el-form-item>
        </el-col>
         <el-col :span="12" >
           <el-form-item label="邮箱：">
              {{dataForm.email}}
           </el-form-item>
        </el-col>
        <el-col :span="12" >
           <el-form-item label="地址：">
              {{dataForm.address}}
           </el-form-item>
        </el-col>
         <el-col :span="12" >
           <el-form-item label="电话：">
              {{dataForm.telephone}}
           </el-form-item>
        </el-col>
     </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="checkpage = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleImageList" title="活动主图" >
      <div>
        <div v-for="(file,index) in filelist" :key="index" :tabindex="index">
          <img :src="file" alt style="height:80%;width:80%"/>
        </div>
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
      filters: {
        status: "",
        card_num: "",
        type: "",
        t: "showMember",
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
    //详情页面
    handleDetail(data){
     this.dataForm = Object.assign({}, data.row);
     this.checkpage=true;
     this.imgs=data.row.pic;
     if(data.row.is_charge==0){
        this.dataForm.isCharge="免费"
     }else{
        this.dataForm.isCharge="收费"
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
          let filename = "展会报名信息";
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

      data.t = "showMember";
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
        { prop: "code", label: "编码", minWidth: 120 },
        { prop: "memberName", label: "用户名称", minWidth: 120 },
        { prop: "mobile", label: "手机", minWidth: 120 },
        { prop: "name", label: "姓名", minWidth: 180 },
        { prop: "company",label: "公司", minWidth: 120,},
        { prop: "appellation", label: "称谓", minWidth: 120 },
        { prop: "post",label: "职务", minWidth: 120},
        { prop: "department", label: "部门", minWidth: 180 },
        { prop: "province", label: "省份", minWidth: 120 },
        { prop: "city", label: "市区", minWidth: 120 },
        { prop: "district", label: "区县", minWidth: 120},
        { prop: "email", label: "邮箱", minWidth: 120},
        { prop: "company_address", label: "公司所在地", minWidth: 120,formatter: this.showAddress},
        { prop: "work_nature", label: "工作性质", minWidth: 120,formatter: this.showAddress2},
        { prop: "company_bus_scope", label: "经营范围", minWidth: 120,formatter: this.showAddress3},
        { prop: "interest_product", label: "感兴趣产品", minWidth: 120,formatter: this.showAddress4},
        { prop: "channel_know", label: "通过以下什么途径知道本展会", minWidth: 120,formatter: this.showAddress5},
        { prop: "fax", label: "传真", minWidth: 120},
        { prop: "telephone", label: "电话", minWidth: 120},
        { prop: "create_time", label: "创建时间", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      this.filters = {
        t: "showMember",
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
    showAddress(row, column, cellValue, index) {
      if (cellValue == 1) {
        return " 中国大陆";
      }else if(cellValue == 2){
         return "海外公司中国大陆分支";
      }else if(cellValue == 3){
          return "海外公司(含港澳台)";
      }
    },
    showAddress2(row, column, cellValue, index) {
      if (cellValue == 1) {
        return " 管理";
      }else if(cellValue == 2){
         return "采购";
      }else if(cellValue == 3){
          return "市场/销售";
      }else if(cellValue == 4){
          return "生产/制造";
      }else if(cellValue == 5){
          return "设计师";
      }else if(cellValue == 6){
          return "研发";
      }else if(cellValue == 7){
          return "零售";
      }else if(cellValue == 8){
          return "广告/推广/媒体";
      }else if(cellValue == 9){
          return "政府/管理人员";
      }else if(cellValue == 10){
          return "原料供应商";
      }
    },
    showAddress3(row, column, cellValue, index) {
      if (cellValue == 1) {
        return " 面料";
      }else if(cellValue == 2){
         return "辅料";
      }else if(cellValue == 3){
          return "家用纺织品";
      }else if(cellValue == 4){
          return "家具";
      }else if(cellValue == 5){
          return "纤维/纱线";
      }else if(cellValue == 6){
          return "流行趋势";
      }else if(cellValue == 7){
          return "检测";
      }else if(cellValue == 8){
          return "服务/咨询";
      }else if(cellValue == 9){
          return "媒体广告";
      }else if(cellValue == 10){
          return "行业协会";
      }
    },
    showAddress4(row, column, cellValue, index) {
      if (cellValue == 1) {
        return " 窗帘布面料";
      }else if(cellValue == 2){
         return "沙发布面料";
      }else if(cellValue == 3){
         return "墙布面料";
      }
      else if(cellValue == 4){
         return "功能性纺织品";
      }
      else if(cellValue == 5){
         return "各类辅料";
      }
      else if(cellValue == 6){
         return "趋势";
      }
      
    },
    showAddress5(row, column, cellValue, index) {
      if (cellValue == 1) {
        return " 主办单位邀请函";
      }else if(cellValue == 2){
         return "报纸广告";
      }else if(cellValue == 3){
          return "杂志";
      }else if(cellValue == 4){
         return "网络";
      }else if(cellValue == 5){
         return "供应商/参展商邀请";
      }else if(cellValue == 6){
         return "朋友/同事/同行";
      }else if(cellValue == 7){
         return "行业协会";
      }
    },
    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return (
          '<i class="el-icon-zoom-in"><div style="display:none">' +
          cellValue +
          "</div></i>"
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