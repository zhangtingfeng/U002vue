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
        <el-form-item prop="type">
          <el-select v-model="filters.type" placeholder="轮播图类型">
            <el-option
              v-for="item in lunbo_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status">
          <el-select v-model="filters.status" placeholder="状态">
            <el-option
              v-for="item in status_options"
              :key="item.key"
              :label="item.label"
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
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="跳转地址" prop="jump_link">
          <el-input v-model="dataForm.jump_link" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="dataForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="轮播图类型" style="width:1209.3px">
            <el-option
              v-for="item in lunbo_type_options"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用" prop="status">
          <el-select v-model="dataForm.status" placeholder="状态" style="width:1209.3px">
            <el-option
              v-for="item in status_options"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="轮播图图片" prop="picFileList">
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
        <el-button :size="size" @click="cleanDataForm">
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
      imgUpload: this.utils.getUpLoadHost(),
      imageAccept: ".jpg,.jpeg,.png,.JPG,.JPEG", //图片上传格式
      imageSizeLimit: 1, //图片上传个数控制
      picFileList: [],
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        type: "",
        status: "",
        t: "carouselFigure"
      },
      status_options: [
        {
          key: "0",
          label: "不可用"
        },
        {
          key: "1",
          label: "可用"
        }
      ],
      dataForm: {
        id: "",
        name: "",
        score: "",
        pic: "",
        tag: "",
        desccribes: "",
        sort: "",
        address: "",
        coupon: "",
        longitude: "",
        latitude: ""
      },
      dataFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
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
      },
      lunbo_type_options: []
    };
  },
  methods: {
    initSysConfig() {
      var params = {};
      params.t = "sysConfig";
      params.type = "lunbo_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.lunbo_type_options = res.data;
      });
    },
    //上传图片校验
    beforeArticleUpload(file) {
      var size = 2,
        this_ = this;
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
        this_.$message.error(
          "上传图片只能是jpeg、png、jpg、JPG、JPEG、PNG 格式!"
        );
      }
    },
    //上传主图片成功
    handlePicSuccess: function(res, file) {
      if (res && res.code == "0000" && res.data && res.data.imgUrl) {
        this.dataForm.pic = res.data.imgUrl;
        this.picFileList.push(res.data.imgUrl);
      }
      this.$message({
        message: "上传成功!",
        type: "success"
      });
    },
    handleExceed: function() {
      this.$alert("最多上传一张", "警告", {
        confirmButtonText: "确定"
      });
    },
    handlePicRemove(file, fileList) {
      if (picFileList && picFileListt.length == 0) {
        this.dataForm.pic = "";
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //审核按钮
    handleEdit(params) {
      if (this.$refs["pic_upload"]) {
        this.$refs["pic_upload"].clearFiles();
      }

      let this_ = this;
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      this_.picFileList = [];
      if (params.row.pic != null || params.row.pic != "") {
        let imgUrl = {};
        imgUrl.name = params.row.id;
        imgUrl.url = params.row.pic;
        this_.picFileList.push(imgUrl);
      }
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: "",
        name: "",
        pic: "",
        tag: "",
        desccribes: "",
        sort: "",
        longitude: "",
        latitude: "",
        address: "",
        coupon: ""
      };
      this.picFileList = [];
    },
    //保存修改
    submitForm: function() {
      var this_ = this;
      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          this_.editLoading = true;
          let params = Object.assign({}, this_.dataForm);
          params.t = "carouselFigure";
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
        this.picFileList = [];
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

    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }

      data.t = "carouselFigure";
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
        { prop: "sort", label: "排序", minWidth: 120 },
        {
          prop: "type",
          label: "轮播图类型",
          minWidth: 120,
          formatter: (row, column, cellValue, index) => {
            $.each(this.lunbo_type_options, (key, value) => {
              if (value.key == Number(cellValue)) {
                cellValue = value.val;
              }
            });

            return cellValue;
          }
        },
        {
          prop: "status",
          label: "是否可用",
          minWidth: 120,
          formatter: function(row, column, cellValue, index) {
            if (cellValue == "0") {
              return "不可用";
            } else if (cellValue == "1") {
              return "可用";
            }
          }
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
      (this.filters = {
        tag: "",
        name: "",
        t: "carouselFigure"
      }),
        this.findPage();
    },
    cleanDataForm() {
      let this_ = this;
      this.dialogVisible = false;
      this.$refs["pic_upload"].clearFiles();
      this_.dataForm = {
        id: "",
        name: "",
        pic: "",
        tag: "",
        desccribes: "",
        sort: "",
        longitude: "",
        latitude: "",
        address: "",
        coupon: ""
      };
      this.picFileList = [];
    }
  },
  mounted() {
    this.initSysConfig();
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>
