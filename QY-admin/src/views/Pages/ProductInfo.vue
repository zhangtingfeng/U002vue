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
          <el-input v-model="filters.name" auto-complete="off" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <!--<el-input v-model="filters.shop_id" auto-complete="off" placeholder="所属店铺"></el-input>-->
          <el-select v-model="filters.shop_id" placeholder="所属店铺" v-show="!login_shop_id">
            <el-option
              v-for="item in shopOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="filters.status" placeholder="审核状态">
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="审核成功" :value="1"></el-option>
            <el-option label="审核失败" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <kt-button icon="el-icon-s-check" label="新增" type="primary" @click="addProduct" />
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
            icon="el-icon-refresh"
            label="审核"
            type="primary"
            @click="review"
            perms="pages:activity:checked"
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
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleEdit="handleDetail"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog title="商品详情" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :inline="true"
        :size="size"
        class="form"
      >
        <el-form-item label="ID" prop="id" v-show="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属店铺" prop="shop_id" v-show="!login_shop_id">
          <el-select v-model="dataForm.shop_id" placeholder="请选择店铺" clearable filterable>
            <el-option
              v-for="item in shopOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="审核状态" prop="status" v-show="dataForm.id">
          <el-select v-model="dataForm.status" placeholder="审核状态" clearable filterable>
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="所属分类" prop="type">
          <!-- <el-select v-model="dataForm.type" placeholder="请选择分类" clearable filterable>
            <el-option
              v-for="item in popupTreeData"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>-->
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="dataForm.parentName==null?'':dataForm.parentName"
            :nodeKey="''+dataForm.pid"
            :currentChangeHandle="handleTreeSelectChange"
            filter_key="name"
          ></popup-tree-input>
        </el-form-item>

        <el-form-item label="最小价格" prop="min_price">
          <el-input v-model="dataForm.min_price" type="number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大价格" prop="max_price">
          <el-input v-model="dataForm.max_price" type="number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="抛光性" prop="polishability">
          <el-input v-model="dataForm.polishability" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密度" prop="density">
          <el-input v-model="dataForm.density" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="宽度" prop="width">
          <el-input v-model="dataForm.width" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="材质" prop="texture">
          <el-input v-model="dataForm.texture" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="克数" prop="gram_numbe">
          <el-input v-model="dataForm.gram_numbe" auto-complete="off"></el-input>
        </el-form-item>
        <el-row>
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
          <el-form-item label="商品图片">
            <img-upload
              ref="ImgUpload"
              :filelist="imgsList"
              @handleImgUploadRemove="handleImgImgUploadRemove"
              @handleImgUploadChange="handleImgImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="imgsList"
            ></img-upload>
          </el-form-item>
        </el-row>
        <el-form-item label="图文详情" prop="content">
          <div class="edit_container" style="max-height:500px;overflow: auto;">
            <quill-editor
              v-model="dataForm.content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click="cleanDataForm">{{ $t("action.cancel") }}</el-button>
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
        <div v-for="(file,index) in filelist" :key="index" :tabindex="index" style="width:100%">
          <img style="max-height:500px;" :src="file" alt />
        </div>
      </div>
    </el-dialog>

    <el-upload
      :action="imgUpload"
      :on-success="handleSuccess"
      :show-file-list="false" 
      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
      :max-size="2048"
    >
      <el-button v-show="false" size="small" type="primary" id="uploadButton"></el-button>
    </el-upload>

    <el-dialog :visible.sync="dialogVisibleReviw" title="审核" width="30%">
      <el-form
        :model="dataStatusForm"
        label-width="120px"
        ref="dataStatusForm"
        label-position="right"
        inline
      >
        <el-row>
          <el-form-item label="请选择" prop="status">
            <el-select v-model="dataStatusForm.status" style="width: 300px;">
              <el-option
                v-for="item in Roptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click.native="submitStatus">提交</el-button>
        <el-button @click="dialogVisibleReviw = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/Core/KtTable";
import TreeSelect from "@riophae/vue-treeselect";
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
    TreeSelect
  },
  data() {
    return {
      dataStatusForm: {},
      dialogVisibleReviw: false,
      statusOptions: [
        { key: "0", value: "审核中" },
        { key: "1", value: "审核通过" },
        { key: "2", value: "审核失败" }
      ],
      Roptions: [
        { key: 1, value: "审核通过" },
        { key: 2, value: "审核不通过" }
      ],
      imgsList: [],
      picList: [],
      imageSizeLimit: 1, //图片上传个数控制
      imageAccept: ".jpg,.jpeg,.png,.JPG,.JPEG", //图片上传格式
      imgUpload: this.utils.getUpLoadHost(),
      typeOptions: [], //所属分类
      shopOptions: [], //店铺集合
      disabled: false,
      dialogVisibleImg: false,
      size: "small",
      loading: false,
      filters: {
        status: "",
        name: "",
        shop_id: "",
        t: "product",
        create_time: "desc"
      },
      dataForm: {
        id: "",
        name: "",
        shop_id: "",
        pic: "",
        imgs: "",
        type: "",
        content: "",
        status: "",
        type_id: "",
        min_price: "",
        max_price: "",
        polishability: "",
        density: "",
        width: "",
        texture: "",
        gram_numbe: "",
        parentName: ""
      },
      dataFormRules: {
        shop_id: [
          { required: true, message: "请选择所属店铺", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        status: [
          { required: true, message: "请选择是否上架", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        pic: [{ required: true, message: "请上传主图", trigger: "blur" }]
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
      dialogVisibleImageList: false,
      filelist: [],
      popupTreeData: [],
      popupTreeProps: {
        label: "name",
        children: "children"
      },
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
      login_shop_id: ""
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    submitStatus() {
      var this_ = this;
      let ids = this.checked.map(item => item.id).toString();
      this.utils.request.doChecked(
        {
          ids: ids,
          checkEdStatus: this.dataStatusForm.status,
          t: "product"
        },
        function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "审核完成", type: "success" });
            this_.dialogVisibleReviw = false;
            this_.findPage();
          } else {
            this_.$message({ message: res.msg, type: "error" });
          }
        }
      );
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      if (!node.data.children || node.data.children.length == 0) {
        this.dataForm.type = data.name;
        this.dataForm.type_id = data.id;
        this.dataForm.parentName = data.name;
        this.dataForm = Object.assign({}, this.dataForm);
      }
    },
    handleSuccess(res) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.data.imgUrl) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片，res为服务器返回的图片链接地址

        quill.insertEmbed(length, "image", res.data.imgUrl);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        // 提示信息，需引入Message
        Message.error("图片插入失败");
      }
    },
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange(e) {}, // 内容改变事件
    saveHtml: function(event) {},
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

    handleImgImgUploadRemove(data) {
      var index = data.index;
      this.imgsList.splice(index, 1);
    },
    handleImgImgUploadChange(data) {
      this.imgsList = data.filelist;
    },

    //取消按钮
    cleanDataForm() {
      let this_ = this;
      this.dialogVisible = false;
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }
      console.log(this.dataForm);

      this.picList = [];
      this.imgsList = [];
    },
    addProduct: function(params) {
      let this_ = this;
      this.dialogVisible = true;
      this.operation = false;
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }
      this.dataForm.status = 0;
      if (this.login_shop_id) {
        this.dataForm.shop_id = this.login_shop_id;
      }
      this.dataForm.parentName = "";

      this.picList = [];
      this.imgsList = [];
    },
    // 显示编辑界面
    handleDetail: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.$nextTick(() => {
        let this_ = this;
        params.row.parentName = params.row.type;
        this.dataForm = Object.assign({}, params.row);
        this.picList = [];
        this.imgsList = [];

        if (params.row.imgs) {
          $.each(params.row.imgs.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.picList.push(param);
            }
          });
        }
        if (params.row.pic) {
          $.each(params.row.pic.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.imgsList.push(param);
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
          let params = Object.assign({}, this_.dataForm);
          params.t = "product";

          params.imgs = this.imgsList.map(item => item.url).toString();
          params.pic = this.picList.map(item => item.url).toString();

          if (!params.pic) {
            this.$message({ message: "请选择主图", type: "error" });
            return;
          } else if (!params.imgs) {
            this.$message({ message: "请选择商品图片", type: "error" });
            return;
          }

          if (!params.content) {
            this.$message({ message: "请输入详情", type: "error" });
            return;
          }

          params.status = "0";

          this_.editLoading = true;
          this_.utils.request.editInfo(params, this_.editInfoBack);
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      this.editLoading = false;
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
        this.dialogVisible = false;
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
      }
    },
    findPage: function(data) {
      let login_shop_id = localStorage.getItem("login_shop_id");
      if (login_shop_id) {
        this.login_shop_id = login_shop_id;
      }
      if (this.login_shop_id) {
        this.filters.shop_id = this.login_shop_id;
      }
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
          let filename = "商品管理";
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

      data.t = "product";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    deleteInfoBack: function() {
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
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }
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
        { prop: "name", label: "商品名称", minWidth: 120 },
        { prop: "shopname", label: "所属店铺", minWidth: 120 },
        {
          prop: "pic",
          label: "商品主图",
          minWidth: 120,
          formatter: this.showPhto
        },
        { prop: "type", label: "所属分类", minWidth: 120 },
        {
          prop: "content",
          label: "商品详情",
          minWidth: 120,
          showOverflowTooltip: false
        },
        {
          prop: "status",
          label: "状态",
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

    showPhto(row, column, cellValue, index) {
      if (cellValue != null && "" != cellValue) {
        return (
          '<i class="el-icon-zoom-in"><div style="display:none">' +
          cellValue +
          "</div></i>"
        );
      }
    },

    resetForm(formName) {
      (this.filters = {
        status: "",
        name: "",
        shop_id: "",
        t: "product"
      }),
        this.$refs.CyTable.resetForm();
      this.findPage();
    },
    showStatus(row, column, cellValue, index) {
      if (cellValue == 0) {
        return "审核中";
      } else if (cellValue == 1) {
        return "审核成功";
      }
      return "审核失败";
    },
    // 所属店铺初始化
    queryUserList() {
      var that = this;
      this.utils.request.queryUserList({ t: "shop" }, function(data) {
        that.shopOptions = data.data;
      });
    },
    //初始化分类
    queryProductType() {
      var that = this;
      let params = {};
      params.t = "productType";
      params.sql = "queryProductType";
      this.utils.request.queryProductType(params, function(data) {
        that.typeOptions = data.data;
      });
    },

    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePicRemove(file, fileList) {
      if (picFileList && picFileListt.length == 0) {
        this.dataForm.pic = "";
      }
    },
    handleImgsRemove(file, fileList) {
      if (imgsFileList && imgsFileList.length == 0) {
        this.dataForm.imgs = "";
      }
    },
    beforeClose() {
      this.filelist = [];
    },
    findProductTypeTree() {
      var this_ = this;

      this.utils.request.findProductTypeTree({}, function(res) {
        this_.popupTreeData = res.data;
      });
    },
    review(data) {
      if (this.checked.length < 1) {
        this.$message({ message: "审核数据不能为空", type: "error" });
        return;
      }
      this.dialogVisibleReviw = true;
    }
  },
  mounted() {
    this.initColumns();
    this.queryUserList();
    this.findProductTypeTree();

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

/deep/ .el-icon-zoom-in {
  cursor: pointer;
}
</style>
