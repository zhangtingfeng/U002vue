
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="card_num">
          <el-input v-model="filters.name" auto-complete="off" placeholder="标题"></el-input>
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
          <kt-button
            icon="el-icon-add"
            label="新增"
            type="primary"
            @click="addtrafficService"
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
      :showEditOperation="true"
      :showDetailOperation="false"
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleEdit="handleEdit"
       @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->

    <el-dialog :title="operation?'新增':'编辑'" :visible.sync="checkpage"  width="60%"  @closed="handleClose">
       <el-form
        :model="dataForm"
        label-width="80px"
        ref="dataForm"
        label-position="right"
        :rules="dataFormRules"
      >
        <el-form-item label="标题" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="动态内容" prop="content">
          <div class="edit_container" style="max-height:500px;overflow: auto;">
            <quill-editor v-model="dataForm.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size"
          type="primary"
          @click.native="submitForm">保存</el-button>
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
         editorOption: {
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: "ordered" }, { list: "bullet" }], //列表
              [{ script: "sub" }, { script: "super" }], // 上下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], //字体
              [{ align: [] }], //对齐方式b
              ["clean"], //清除字体样式
              ["image"] //上传图片、上传视频
            ], // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  // 调用iview图片上传
                  $("#uploadButton").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        },
        theme: "snow"
      },
       imgUpload: this.utils.getUpLoadHost(),
      dialogVisibleImageList:false,
      disabled: false,
      dialogVisibleImg: false,
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadCustomerExcel?token=" +
        localStorage.getItem("token"),

      isoptions: [
         { key: 0, value: "否" },
         { key: 1, value: "是" },

      ],
      filelist:[],
      bill_photo_list: [],
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
        t: "trafficService",
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
         pic:'',
      },
       dataFormRules: {
        title: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        fraction: [
          { required: true, message: "请输入评分", trigger: "blur" }
        ],
         longitude: [
          { required: true, message: "请输入经度", trigger: "blur" }
        ],
         latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        //  pic: [
        //   { required: true, message: "请上传图片", trigger: "change" }
        // ],
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
    //新增页面
    addtrafficService(){
     this.operation=true;
     this.checkpage=true;
     if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
     this.dataForm.pic = "";

    },
    clearFiles() {
      this.$refs["upload"].clearFiles();
    },
    handleClose() {
      this.dataForm={
        id: "",
        title:'',
        fraction:'',
        is_selected:'',
        longitude:'',
        latitude:'',
        pic:'',
      }
      this.clearFiles();
      this.bill_photo_list = [];
      this.$refs.dataForm.resetFields();
    },
    //编辑方法
    handleEdit(params){
      
       this.checkpage = true;
       this.operation = false;
      this.$nextTick(function() {
        this.dataForm = Object.assign({}, params.row);
      });

      var this_ = this;
      var search = {};
      search.id = params.row.id;
      search.t = "trafficService";

      this.utils.request.queryUserInfo(search, function(res) {
        if (res.code == "0000") {
          this_.tableData = res.data;
          if(res.data.pic !='' && res.data.pic !=undefined){
            this_.bill_photo_list = this_.dataForm.pic.split(",");
             this_.dataForm.pic = "";
          }
         
        } else if(res.code == "9999") {
          this_.$message({ message: "获取产品信息异常", type: "error" });
        }
      });
    },
       // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            var this_ = this;
            let params = Object.assign({}, this.dataForm);
            params.t = "trafficService";
            // parma.tableData = JSON.stringify(this.tableData);
            this.utils.request.editInfo(params, this.editInfoBack);
          });
        }
      });
    }, // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findPage();
      this.checkpage = false;
      this.operation = false;
    },
        //图片移除
    handleRemove(file, fileList, index) {
      if (this.utils.isNull(index)) {
        this.fileList = fileList;
        if (fileList.length == 0) {
          this.dataForm.pic = "";
        } else {
          this.imgs = fileList
            .map(item => item.response.data.imgUrl)
            .toString();
          this.dataForm.pic = this.imgs;
        }
      } else {
        this.bill_photo_list.splice(index, 1);
      }
      console.log(this.dataForm.pic);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.ImageUrl = file.url;
      this.dialogVisibleImage = true;
    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      var this_=this
      if (res.data.imgUrl == "") {
        this_.$message({ message: "上传失败", type: "error" });
      } else {
        this_.dataForm.pic += res.data.imgUrl + ",";
        console.log(this_.dataForm.pic);
        this_.imageUrl = URL.createObjectURL(file.raw);
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

      data.t = "trafficService";
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
        { prop: "name", label: "标题", minWidth: 120 },
        { prop: "content", label: "内容", minWidth: 200 },
        { prop: "sort", label: "排序", minWidth: 120}
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      this.filters = {
        t: "trafficService",
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
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

    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return (
          '<i class="el-icon-zoom-in"><div style="display:none">' +
          cellValue +
          "</div></i>"
        );
      }
    },

    showselect(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "否";
      }
      return "是";
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