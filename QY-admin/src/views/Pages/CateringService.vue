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
          <el-input v-model="filters.name" auto-complete="off" placeholder="餐饮名称"></el-input>
        </el-form-item>
        <el-form-item prop="tag">
          <el-input v-model="filters.tag" auto-complete="off" placeholder="餐饮标签"></el-input>
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
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      ref="CyTable"
    ></cy-table>
    <!--详情界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="70%"
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
        <el-form-item label="餐饮名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="餐饮标签" prop="tag">
          <el-input v-model="dataForm.tag" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="餐饮简述" prop="desccribes">
          <el-input v-model="dataForm.desccribes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="dataForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="dataForm.score" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="餐饮所在地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="经度" prop="longitude">
          <el-input v-model="dataForm.longitude" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="纬度" prop="latitude">
          <el-input v-model="dataForm.latitude" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="满减" prop="coupon">
          <el-input v-model="dataForm.coupon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="餐饮图片" prop="picFileList">
          <el-upload
            :action="imgUpload"
            :on-preview="handlePreview"
            :on-remove="handlePicRemove"
            :on-exceed="handleExceed"
            :before-upload="beforeArticleUpload"
            :on-success="handlePicSuccess"
            :file-list="picFileList"
            list-type="picture-card"
            :limit="imageSizeLimit"
            :accept="imageAccept"
            ref="pic_upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click="cleanDataForm">{{
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
      imgUpload:this.utils.getUpLoadHost(),
      imageAccept:".jpg,.jpeg,.png,.JPG,.JPEG",//图片上传格式
      imageSizeLimit:1,//图片上传个数控制
      picFileList:[],
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        tag: "",
        name: "",
        t: "cateringService",
      },
      dataForm: {
        id:"",
        name: "",
        score:"",
        pic: "",
        tag:"",
        desccribes: "",
        sort: "",
        address:"",
        coupon:"",
        longitude:"",
        latitude:""
      },
      dataFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
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
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },

    };
  },
  methods: {
    //上传图片校验
    beforeArticleUpload(file) {
      var size = 2, this_ = this;
      const isLt2M = file.size / 1024 / 1024 < size;
      if (!isLt2M) {
        this_.$message.error("上传图片大小不能超过" + size + " MB!");
      }
      //jpg,jpeg,png,JPG,JPEG
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/JPG" ||
        file.type === "image/JPEG" ||
        file.type === "image/PNG";
      if (!isJPG) {
        this_.$message.error("上传图片只能是jpeg、png、jpg、JPG、JPEG、PNG 格式!");
      }
    },
    //上传主图片成功
    handlePicSuccess:function (res, file) {
      if (res && res.code == '0000' && res.data && res.data.imgUrl){
        this.dataForm.pic = res.data.imgUrl;
        this.picFileList.push(res.data.imgUrl)
      }
      this.$message({
        message: '上传成功!',
        type: 'success'
      });
    },
    handleExceed:function () {
      this.$alert('最多上传一张', '警告', {
        confirmButtonText: '确定'
      });
    },
    handlePicRemove(file, fileList) {
      if (picFileList && picFileListt.length == 0){
        this.dataForm.pic = '';
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //审核按钮
    handleEdit(params) {
      let this_=this
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      if(params.row.pic!=null || params.row.pic!=""){
        let imgUrl={}
        imgUrl.name = params.row.id;
        imgUrl.url = params.row.pic;
        this_.picFileList.push(imgUrl)
      }

    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm= {
        id:"",
        name: "",
        pic: "",
        tag:"",
        desccribes: "",
        sort: "",
        longitude:"",
        latitude:"",
        address:"",
        coupon:"",
      }
      this.picFileList = [];
    },
    //保存修改
    submitForm:function () {
      var this_=this
      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          this_.editLoading = true;
          let params = Object.assign({}, this_.dataForm);
          params.t="cateringService"
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
        this.picFileList=[]
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

      data.t = "cateringService";
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
        { prop: "name", label: "餐饮名称", minWidth: 120 },
        { prop: "tag", label: "餐饮标签", minWidth: 120 },
        { prop: "score", label: "评分", minWidth: 120 },
        { prop: "sort", label: "排序", minWidth: 180 },
        { prop: "coupon", label: "满减", minWidth: 180 },
         { prop: "longitude", label: "经度", minWidth: 180 },
          { prop: "latitude", label: "纬度", minWidth: 180 },
        {
          prop: "create_time",
          label: "创建时间",
          minWidth: 120,
        },
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
        tag: "",
          name: "",
          t: "cateringService",
      },
      this.findPage();
    },
    cleanDataForm() {
      let this_=this
      this.dialogVisible = false;
      this.$refs["pic_upload"].clearFiles();
      this_.dataForm={
        id:"",
        name: "",
        pic: "",
        tag:"",
        desccribes: "",
        sort: "",
        longitude:"",
        latitude:"",
        address:"",
        coupon:"",
      }
      this.picFileList = [];
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
