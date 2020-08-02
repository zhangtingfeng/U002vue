
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="card_num">
          <el-input v-model="filters.title" auto-complete="off" placeholder="活动标题"></el-input>
        </el-form-item>
        <el-form-item prop="number">
          <el-input v-model="filters.number" auto-complete="off" placeholder="活动人数"></el-input>
        </el-form-item>

        <el-form-item prop="status">
          <el-select v-model="filters.status" placeholder="审核状态">
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="type">
          <el-select v-model="filters.type" placeholder="是否上架">
            <el-option label="上架" :value="0"></el-option>
            <el-option label="下架" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="startTime">
          <el-date-picker
            v-model="filters.startTime"
            type="datetime"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker
            v-model="filters.endTime"
            type="datetime"
            placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-row></el-row>

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
        <el-form-item>
          <kt-button
            icon="el-icon-suitcase"
            label="上/下架"
            type="primary"
            @click="editType"
            perms="pages:activity:checked"
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
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleEdit="handleDetail"
      @selection-change="selectionChange"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->

    <el-dialog title="详情页面" :visible.sync="checkpage" width="70%">
      <el-form
        :model="dataForm"
        label-width="120px"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
        class="form"
        :rules="addFormRules"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" prop="begin_time">
          <el-date-picker
            v-model="dataForm.begin_time"
            type="datetime"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="dataForm.end_time"
            type="datetime"
            placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="registration_time">
          <el-date-picker
            v-model="dataForm.registration_time"
            type="datetime"
            placeholder="报名截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="主题：" prop="theme">
          <el-input v-model="dataForm.theme" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="人数：" prop="number">
          <el-input v-model="dataForm.number" type="number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="视频开始播放时间：" prop="video_begin_time">
          <el-date-picker
            v-model="dataForm.video_begin_time"
            type="datetime"
            placeholder="视频开始播放时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="视频结束播放时间：" prop="video_end_time">
          <el-date-picker
            v-model="dataForm.video_end_time"
            type="datetime"
            placeholder="视频结束播放时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否收费：" prop="is_charge">
          <el-select v-model="dataForm.is_charge" placeholder="是否收费">
            <el-option
              v-for="item in isChargeOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐商家：" prop="is_selected">
          <el-select v-model="dataForm.is_selected" placeholder="是否推荐商家">
            <el-option
              v-for="item in isSelectedOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="show_sort">
          <el-input v-model="dataForm.show_sort" type="show_sort" auto-complete="off"></el-input>
        </el-form-item>

        <el-row>
          <el-form-item label="主图">
            <img-upload
              ref="ImgUpload"
              :filelist="picList"
              @handleImgUploadRemove="handleImgUploadRemove"
              @handleImgUploadChange="handleImgUploadChange"
              @handlePictureCardPreview="handlePictureCardPreview"
              uploadButton="picList"
            ></img-upload>
          </el-form-item>
          <!-- <el-form-item label="视频">
            <video-upload
              ref="VideoUpload"
              :filelist="videoList"
              @handleImgUploadRemove="handleVideoUploadRemove"
              @handleImgUploadChange="handleVideoUploadChange"
              @handlePictureCardPreview="handleVideoPreview"
              uploadButton="videoList"
            ></video-upload>
          </el-form-item>-->
          <el-form-item label="视频" v-if="dataForm.video">
            <a :href="dataForm.video" target="_blank">查看视频</a>
            <input type="file" @change="changeVideo" accept=".mp4, .3gp, .hls" ref="inputer" />
          </el-form-item>
          <el-form-item label="视频" v-else>
            <input type="file" @change="changeVideo" accept=".mp4, .3gp, .hls" ref="inputer" />
          </el-form-item>
        </el-row>
        <el-form-item label="详情：">
          <div class="edit_container" style="max-height:500px;overflow: auto;">
            <quill-editor v-model="dataForm.desc" ref="myQuillEditor" :options="editorOption"></quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="checkpage = false">取 消</el-button>
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
          <img style="max-height:500px" :src="file" alt />
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleReviw" title="审核" width="30%">
      <el-form
        :model="dataStatusForm"
        label-width="120px"
        :size="size"
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
        <el-button type="primary" @click.native="submitStatus">保存</el-button>
        <el-button @click="dialogVisibleReviw = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleType" title="上/下架" width="30%">
      <el-form :model="dataTypeForm" label-width="120px" :size="size" label-position="right" inline>
        <el-row>
          <el-form-item label="请选择" prop="status">
            <el-select v-model="dataTypeForm.type" style="width: 300px;">
              <el-option
                v-for="item in typeRoptions"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click.native="submitType">保存</el-button>
        <el-button @click="dialogVisibleType = false">取 消</el-button>
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

    <el-dialog :visible.sync="dialogVisibleVideoList" title="视频" @close="closeVideo">
      <div style="margin: 0 auto;height:400px;overflow-y:scroll; ">
        <div v-for="(file,index) in videoList" :key="index" :tabindex="index">
          <video :src="file" height="400" controls="controls" class="video"></video>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TcVod from "vod-js-sdk-v6";
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format, formatDate } from "@/utils/datetime";
import CyTable from "@/views/Core/CyTable";
import ImgUpload from "@/views/Core/ImgUpload";
import VideoUpload from "@/views/Core/VideoUpload";
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    VideoUpload,
    ImgUpload
  },
  data() {
    return {
      dialogVisibleImageList: false,
      disabled: false,
      dialogVisibleReviw: false,
      dialogVisibleType: false,
      dialogVisibleImg: false,
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadCustomerExcel?token=" +
        localStorage.getItem("token"),
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: [],
      filelist: [],
      videoList: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      customer_nature: "",
      imgs: "",
      Roptions: [
        { key: 1, value: "审核通过" },
        { key: 2, value: "审核不通过" }
      ],
      typeRoptions: [
        { key: 0, value: "上架" },
        { key: 1, value: "下架" }
      ],
      dataStatusForm: {},
      dataTypeForm: {},
      addFormRules: {
        is_charge: [
          { required: true, message: "请选择是否收费", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        begin_time: [
          { required: true, message: "请输入开始时间", trigger: "blur" }
        ],
        end_time: [
          { required: true, message: "请输入结束时间", trigger: "blur" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        theme: [{ required: true, message: "请输入地址", trigger: "blur" }],
        number: [{ required: true, message: "请输人数", trigger: "blur" }]
      },
      dataFormRules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ]
      },
      dataTypeRules: {
        status: [
          { required: true, message: "请选择上下架状态", trigger: "change" }
        ]
      },
      filters: {
        status: "",
        card_num: "",
        number: "",
        type: "",
        t: "activity"
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
        show_sort: 0,
        video: ""
      },
      message: "上传中，请等待...",
      roles: [],
      businesslicenseimgUploadList: [],
      managerphotoimgUploadList: [],
      paperworkphotoimgUploadList: [],
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
      login_shop_id: "",
      picList: [],
      imgUpload: this.utils.getUpLoadHost(),
      //是否收费 0 不收费，1 收费
      isChargeOptions: [
        {
          key: 0,
          label: "不收费"
        },
        {
          key: 1,
          label: "收费"
        }
      ],
      isSelectedOptions: [
        {
          key: 0,
          label: "不推荐"
        },
        {
          key: 1,
          label: "推荐"
        }
      ],
      dialogVisibleVideoList: false
    };
  },
  mounted() {
    this.initColumns();
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
  },
  created() {
    var this_ = this;
    this.getSignature();
  },
  methods: {
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
    beforeClose() {
      this.filelist = [];
    },
    handlePictureCardPreview(data) {
      var url = data.url;
      this.picList = [];
      this.picList.push(url);
      this.dialogVisibleImageList = true;
    },

    handleImgUploadRemove(data) {
      var index = data.index;
      this.picList.splice(index, 1);
    },
    handleImgUploadChange(data) {
      this.picList = data.filelist;
    },
    handleVideoPreview(data) {
      var url = data.url;
      this.videoList = [];
      this.videoList.push(url);
      this.dialogVisibleVideoList = true;
    },

    handleVideoUploadRemove(data) {
      var index = data.index;
      this.videoList.splice(index, 1);
    },
    handleVideoUploadChange(data) {
      this.videoList = data.filelist;
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
    review(data) {
      if (this.checked.length > 1 || this.checked.length < 1) {
        this.$message({ message: "审核时只可选择一条数据", type: "error" });
        return;
      }
      this.dialogVisibleReviw = true;
    },
    editType(data) {
      if (this.checked.length == 0) {
        this.$message({ message: "最少选择一条数据进行操作", type: "error" });
        return;
      }
      this.dialogVisibleType = true;
    },
    submitStatus() {
      var this_ = this;
      let query = {};
      query = Object.assign({}, this.dataStatusForm);
      query.id = this.checked[0].id;
      query.t = "activity";

      if (this.checked[0].status != 0) {
        this_.$message({
          message: "已经审核过，不能重复审核",
          type: "error"
        });
        return;
      }

      let status = this.dataStatusForm.status;
      if (!status && status != 0) {
        this_.$message({
          message: "请选择状态",
          type: "error"
        });
        return;
      }
      if (status == 1 && this.checked[0].task_id) {
        //判断是否通过腾讯审核

        var telentParam = {};
        telentParam.type = 0;
        telentParam.taskId = this.checked[0].task_id;
        telentParam.id = this.checked[0].id;
        this.utils.request.getTxVideoTaskInfo(telentParam, res => {
          if (res.code == "0000") {
            var data = res.data;

            let status = data.status;
            if (status == "FINISH") {
              if (data.code == 0) {
                this.doCheck(query);
              } else {
                this_.$message({ message: data.message, type: "success" });
              }
            } else {
              if (status == "WAITING") {
                this_.$message({ message: "等待腾讯处理", type: "success" });
              } else if (status == "PROCESSING") {
                this_.$message({ message: "腾讯处理中", type: "success" });
              } else {
                if (!data.message) {
                  data.message = "系统异常，请稍后";
                }
                this_.$message({ message: data.message, type: "success" });
              }
            }
          } else {
            this_.$message({ message: "系统异常，请稍后", type: "success" });
          }
        });
      } else {
        this.doCheck(query);
      }
    },
    submitType() {
      var this_ = this;
      let query = {};
      query = Object.assign({}, this.dataTypeForm);
      query.ids = this.checked.map(item => item.id).toString();
      query.t = "activity";
      query.method = "updateType";
      let type = this.dataTypeForm.type;
      if (!type && type != 0) {
        this_.$message({
          message: "请选择状态",
          type: "error"
        });
        return;
      }
      this.doCheck(query);
    },

    doCheck(query) {
      var this_ = this;
      this_.utils.request.editParmas(query, function(res) {
        if (res.code == "0000") {
          this_.$message({ message: "操作成功", type: "success" });
          this_.findPage();
        } else {
          this_.$message({ message: "操作失败", type: "error" });
        }
        this_.dialogVisibleReviw = false;
        this_.dialogVisibleType = false;
      });
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

      data.t = "activity";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },
    deleteInfoBack: function(res) {
      if (res.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败", type: "error" });
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
    //详情页面
    handleDetail(params) {
      this.checkpage = true;
      this.$nextTick(() => {
        let this_ = this;

        if (
          !params.row.video_begin_time ||
          params.row.video_begin_time.length < 6
        ) {
          params.row.video_begin_time = "";
        }

        if (
          !params.row.video_end_time ||
          params.row.video_end_time.length < 6
        ) {
          params.row.video_end_time = "";
        }
        this.$refs.inputer.value = null;
        this.dataForm = Object.assign({}, params.row);
        this.picList = [];
        this.videoList = [];

        if (params.row.pic) {
          $.each(params.row.pic.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.picList.push(param);
            }
          });
        }

        if (params.row.video) {
          var upload = {};
          upload.url = params.row.video;
          upload.name = params.row.fileid;
          this_.videoList.push(params);
        }
      });
    },
    addProduct: function(params) {
      let this_ = this;
      this.checkpage = true;
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }
      this.dataForm.desc = "";
      this.dataForm.id = "";
      this.picList = [];
      this.videoList = [];
      this.dataForm.video = "";
      this.$refs.inputer.value = null;
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "id", label: "活动Id", minWidth: 120 },
        { prop: "memberName", label: "店铺名称", minWidth: 120 },
        { prop: "theme", label: "活动主题", minWidth: 120 },
        {
          prop: "title",
          label: "活动标题",
          minWidth: 120,
          showOverflowTooltip: false
        },
        {
          prop: "desc",
          label: "活动描述",
          minWidth: 180,
          showOverflowTooltip: false
        },
        {
          prop: "pic",
          label: "活动主图地址",
          minWidth: 120,
          formatter: this.showPhto
        },
        {
          prop: "show_sort",
          label: "排序",
          minWidth: 120
        },
        { prop: "begin_time", label: "开始时间", minWidth: 120 },
        { prop: "end_time", label: "结束时间", minWidth: 120 },
        { prop: "address", label: "活动地址", minWidth: 180 },
        { prop: "number", label: "活动人数", minWidth: 120 },
        {
          prop: "is_charge",
          label: "是否收费",
          minWidth: 120,
          formatter: this.showIsCharge
        },
        {
          prop: "status",
          label: "状态",
          minWidth: 120,
          formatter: this.showStatus
        },
        {
          prop: "type",
          label: "是否上架",
          minWidth: 120,
          formatter: this.showType
        },
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
        t: "activity"
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
    showStatus(row, column, cellValue, index) {
      if (cellValue == 0) {
        return " 待审核";
      } else if (cellValue == 1) {
        return "审核通过";
      } else if (cellValue == 2) {
        return "审核拒绝";
      }
    },
    showType(row, column, cellValue, index) {
      if (cellValue == 0) {
        return " 上架";
      } else if (cellValue == 1) {
        return "下架";
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
    },
    //保存修改
    submitForm: function() {
      var this_ = this;

      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this_.dataForm);
          params.t = "activity";

          params.pic = this.picList.map(item => item.url).toString(); 
          if (!params.pic) {
            this.$message({ message: "请选择主图", type: "error" });
            return;
          }
          params.status = 0;

          if (!params.desc) {
            this.$message({ message: "请输入详情", type: "error" });
            return;
          }
          if (this.login_shop_id) {
            params.shop_id = this.login_shop_id;
          }

          let result = this.dealWithActivityTime(
            this.dataForm.video_begin_time,
            this.dataForm.video_end_time
          );

          if (!result) {
            return;
          }

          this_.editLoading = true;
          this_.utils.request.editInfo(params, this_.editInfoBack);
        }
      });
    },

    dealWithActivityTime(start_time, end_time) {
      let now_time = new Date().getTime();
      if (start_time && !end_time) {
        //只存在开始时间
      } else if (!start_time && end_time) {
        //只存在结束时间
        //判断结束时间是否异常
        if (new Date(end_time).getTime() <= now_time) {
          this.$message({ message: "结束时间不能小于当前时间", type: "error" });
          return false;
        }
      } else if (start_time && end_time) {
        //时间都存在
        //判断时间区间是否异常

        if (new Date(end_time).getTime() <= new Date(start_time).getTime()) {
          this.$message({ message: "结束时间不能小于开始时间", type: "error" });
          return false;
        }

        if (new Date(end_time).getTime() <= now_time) {
          this.$message({ message: "结束时间不能小于当前时间", type: "error" });
          return false;
        }
      }

      return true;
    },

    // 新增修改回调
    editInfoBack: function(data) {
      this.editLoading = false;
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.findPage();
        this.checkpage = false;
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
      }
    },
    closeVideo() {
      $.each($("video"), (key, value) => {
        value.pause();
      });
    },
    changeVideo(e) {
      const loading = this.$loading({
        lock: true,
        text: "上传中，请等待....",
        spinner: "el-icon-loading"
      });
      var this_ = this;
      var inputDOM = this.$refs.inputer;
      var file = inputDOM.files;
      this.tcVod = new TcVod({
        getSignature: function() {
          return this_.sign;
        }
      });
      var uploader = this.tcVod.upload({
        mediaFile: file[0] // 媒体文件（视频或音频或图片），类型为 File
      });
      uploader.on("media_progress", function(info) {
        loading.text = "上传进度：" + info.percent * 100 + "%";
      });
      uploader.on("media_upload", function(info) {
        loading.close();
      });
      uploader
        .done()
        .then(function(doneResult) {
          this_.fileid = doneResult.fileId;
          this_.video = doneResult.video.url;
          this_.$refs.inputer.value = null;
          this_.dataForm.video = this_.video;
          this_.dataForm.fileid = this_.fileid;

          this_.dataForm = Object.assign({}, this_.dataForm);
        })
        .catch(function(err) {});
    },
    getSignature() {
      var this_ = this;
      this_.utils.request.getTxVideoSign({}, function(resss) {
        this_.sign = resss.data;
        return resss.data;
      });
    }
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

/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 200px !important;
}
</style>