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
          <el-input v-model="filters.name" auto-complete="off" placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <el-form-item prop="memberName">
          <el-input v-model="filters.memberName" auto-complete="off" placeholder="请输入用户名称"></el-input>
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
          <kt-button icon="el-icon-s-check" label="新增" type="primary" @click="addShop" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="el-icon-s-check" label="确认收费" type="primary" @click="confirmToll" />
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
      :showEditOperation="true"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      title="商家详情"
      :visible.sync="shopModel"
      width="45%"
      height="100%"
      label-width="80px"
      label-position="right"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        ref="dataForm"
        label-position="right"
        :rules="dataFormRule "
      >
        <el-form-item label="id" prop="id" v-if="false">
          <el-input v-model="dataForm.id" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户名称" prop="memberId">
          <el-select
            style="width: 456px;"
            v-model="dataForm.memberId"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名称"
            :remote-method="remoteMethod"
            @change="choseCustomer"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="商家编码" prop="code">
          <el-input v-model="dataForm.code" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>

        <el-form-item label="商家地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="视频介绍地址" prop="video">
          <el-input v-model="dataForm.video" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="商家图片" prop="picFileList">
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
        <el-form-item label="营业执照编号" prop="license_number">
          <el-input v-model="dataForm.license_number" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" prop="legal_name">
          <el-input v-model="dataForm.legal_name" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证" prop="legal_number">
          <el-input v-model="dataForm.legal_number" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="注册资本" prop="register_capital">
          <el-input
            v-model="dataForm.register_capital"
            auto-complete="off"
            :disabled="false"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="主营项目" prop="scope">
          <el-input v-model="dataForm.scope" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="商铺联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="商品评价" prop="pro_evaluate">
          <el-input
            v-model="dataForm.pro_evaluate"
            auto-complete="off"
            maxlength="2"
            :disabled="false"
            oninput="value=value.replace(/[^\d]/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="营业开始时间" prop="open_begin_time">
          <el-date-picker
            style="width:744px"
            v-model="dataForm.open_begin_time"
            type="datetime"
            placeholder="营业开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="营业结束时间" prop="end_begin_time">
          <el-date-picker
            style="width:744px"
            v-model="dataForm.end_begin_time"
            type="datetime"
            placeholder="营业结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="商品介绍" prop="desc">
          <el-input v-model="dataForm.desc" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="dataForm.longitude" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="dataForm.latitude" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="人气" prop="popularity">
          <el-input v-model="dataForm.popularity" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item prop="is_selected" label="是否推荐商家">
          <el-select v-model="dataForm.is_selected" placeholder="是否推荐商家" style="width:744px">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_quality" label="是否品质商家">
          <el-select v-model="dataForm.is_quality" placeholder="是否品质商家" style="width:744px">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status" label="审核状态">
          <el-select v-model="dataForm.status" placeholder="审核状态" style="width:744px">
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click.native="cleNewsModel">{{$t('action.cancel')}}</el-button>
        <el-button @click.native="submitForm">{{$t('action.submit')}}</el-button>
        <!-- <el-button type="primary" @click.native="submitForm">{{$t('action.submit')}}</el-button> -->
      </div>
    </el-dialog>

    <!-- <el-dialog title="审核页面" :visible.sync="checkpage" width="30%">
      <el-form style="text-align:center">
        <el-row>
          <el-form-item>
            <span>审核操作:</span>
            <el-select v-model="customer_nature" placeholder="请选择">
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="审核驳回" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="checkpage = false">取 消</el-button>
        <el-button type="primary" @click="checkpaged">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleImg">
      <vue-qr :text="dialogImageUrl" :size="200" :margin="0"></vue-qr>
      <div>{{username}}</div>
    </el-dialog>-->
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
import VueQr from "vue-qr";
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload,
    VueQr
  },
  data() {
    return {
      imgUpload: this.utils.getUpLoadHost(),
      imageAccept: ".jpg,.jpeg,.png,.JPG,.JPEG", //图片上传格式
      imageSizeLimit: 1, //图片上传个数控制
      picFileList: [],

      dialogVisibleImg: false,
      shopModel: false,
      dataForm: {
        pic: "",
        open_begin_time: "",
        end_begin_time: ""
      },
      disabled: false,
      dialogVisibleImg: false,
      username: "",
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadCustomerExcel?token=" +
        localStorage.getItem("token"),

      options: [],
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      customer_nature: "",
      filters: {
        status: "",

        t: "shop"
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
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      businesslicenseimgUploadList: [],
      managerphotoimgUploadList: [],
      paperworkphotoimgUploadList: [],
      dataFormRule: {
        pro_evaluate: [
          { required: true, message: "请输入商品评价", trigger: "blur" }
        ],
        //  memberId: [{required: true, message: "请输入用户名称", trigger: "blur"}],
        name: [{ required: true, message: "请输入商家名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    findPage: function(data) {
      this.filters.status = 1;
      this.$refs.CyTable.findPage(this.filters);
    },

    //确认收费
    confirmToll() {
      let this_ = this;

      let params = {};
      params.t = "shop";
      params.is_pay = "1";

      if (this_.checked.length != 1) {
        this_.$message({
          message: "请选择一条需要操作的数据, ",
          type: "error"
        });
      } else {
        console.log(this_.checked)
        if (this_.checked[0].is_pay == 1) {
          this_.$message({
            message: "此条数据已经确认收费, ",
            type: "error"
          });
          this_.checked = [];
          
        } else {
          params.id = this_.checked[0].id;
          this.utils.request.editInfo(params, function(res) {
            if (res.code == "0000") {
              this_.$message({ message: "操作成功", type: "success" });

              this_.checked = [];
              this_.findPage(null);
            } else {
              this_.$message({
                message: "操作失败, " + res.msg,
                type: "error"
              });
              this_.checked = [];
            }
          });
        }
      }
    },
    //新增商家
    addShop() {
      let this_ = this;
      this_.dataForm = {};

      this_.shopModel = true;
      this_.picFileList = [];
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "认证信息";
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
          if (val.type == 0) {
            val.type = "市场经营人员";
          } else if (val.type == 1) {
            val.type = "采购商";
          }

          if (val.status == 0) {
            val.status = "待审核";
          } else if (val.status == 1) {
            val.status = "审核中";
          } else if (val.status == 2) {
            val.status = "审核通过";
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

    // 显示编辑界面

    handleEdit: function(data) {
      this.shopModel = true;
      this.$nextTick(function() {
        this.dataForm = Object.assign({}, data.row);
      });
      if (data.row.pic != null || data.row.pic != "") {
        let imgUrl = {};
        imgUrl.name = data.row.id;
        imgUrl.url = data.row.pic;
        this.picFileList.push(imgUrl);
      }
      this.dataForm.open_begin_time = data.row.open_begin_time;
      this.dataForm.end_begin_time = data.row.end_begin_time;
    },

    //提交按钮
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.dataForm);
          params.t = "shop";
          var this_ = this;
          console.log("保存信息===>>>>>>>>>" + JSON.stringify(params));
          this.utils.request.editInfo(params, function(res) {
            if (res.code == "0000") {
              this_.$message({ message: "操作成功", type: "success" });
              this_.shopModel = false;
              this_.$refs["dataForm"].resetFields();
              this_.findPage(null);
            } else {
              this_.$message({
                message: "操作失败, " + res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },

    //关闭编辑页面
    cleNewsModel() {
      let this_ = this;
      this_.shopModel = false;
      this_.findPage();
    },
    deleteInfoBack: function() {
      this.findPage();
    },
    // 显示查询
    queryInfo: function() {
      this.findPage(this.filters);
    },
    selectionChange: function(params) {
      console.log(params);
      this.checked = params.selections;
    },
    //审核
    audit: function() {
      if (this.checked.length == 0) {
        this.$message({ message: "请至少选择一个产品", type: "error" });
        return;
      } else {
        this.checkpage = true;
      }
    },
    //提交审核
    checkpaged: function() {
      let ids = this.checked.map(item => item.id).toString();
      var this_ = this;
      var customer_nature = this.customer_nature;
      this.utils.request.doChecked(
        { ids: ids, checkEdStatus: customer_nature, t: "messageInfo" },
        function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "审核完成", type: "success" });
            this_.checkpage = false;
            this_.findPage();
          } else {
            this_.$message({ message: res.msg, type: "error" });
          }
        }
      );
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
        { prop: "name", label: "商家名称", minWidth: 120 },
        { prop: "code", label: "商家编码", minWidth: 120 },
        { prop: "memberName", label: "用户名称", minWidth: 120 },
        { prop: "address", label: "商家地址", minWidth: 120 },

        { prop: "legal_name", label: "法人姓名", minWidth: 120 },

        { prop: "scope", label: "主营项目", minWidth: 120 },
        { prop: "mobile", label: "商铺联系电话", minWidth: 120 },
        { prop: "pro_evaluate", label: "商品评价", minWidth: 120 },
        { prop: "open_begin_time", label: "营业开始时间", minWidth: 120 },
        { prop: "end_begin_time", label: "营业结束时间", minWidth: 120 },
        { prop: "longitude", label: "经度", minWidth: 120 },
        { prop: "latitude", label: "纬度", minWidth: 120 },
        { prop: "popularity", label: "人气", minWidth: 120 },
        {
          prop: "is_selected",
          label: "是否推荐商家",
          minWidth: 120,
          formatter: function(row, column, cellValue, index) {
            if (cellValue == 0) {
              return "否";
            } else if (cellValue == 1) {
              return "是";
            }
          }
        },
        {
          prop: "is_quality",
          label: "是否品质商家",
          minWidth: 120,
          formatter: function(row, column, cellValue, index) {
            if (cellValue == "0") {
              return "否";
            } else if (cellValue == "1") {
              return "是";
            }
          }
        },
        {
          prop: "status",
          label: "状态",
          minWidth: 120,
          formatter: function(row, column, cellValue, index) {
            if (cellValue == 0) {
              return "待审核";
            } else if (cellValue == 2) {
              return "审核拒绝";
            } else {
              return "审核通过";
            }
          }
        },
        {
          prop: "is_pay",
          label: "是否已付费",
          minWidth: 120,
          formatter: function(row, column, cellValue, index) {
            if (cellValue == 0) {
              return "未付费";
            } else if (cellValue == 1) {
              return "已付费";
            }
          }
        }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
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
    }

    // //查询后台member表信息
    // remoteMethod: function(query) {
    //   if (query !== "" && query.length > 0) {
    //     //查询后台客户信息
    //     var search = {};
    //     search.t = member;
    //     search.username = query;
    //     var this_ = this;
    //     this.utils.request.queryUserPage(search, function(res) {
    //       this_.options = res.rows;
    //     });
    //   } else {
    //     this.options = [];
    //   }
    // },

    // //模糊匹配
    // choseCustomer: function(selVal) {
    //   var temp = this.options;
    //   var this_ = this;
    //   if (selVal == "" || selVal == null) {
    //     this_.dataForm.memberId = "";
    //   } else {
    //     $.each(temp, function(key, val) {
    //       if (val.id == selVal) {
    //         this_.dataForm.memberId = val.id;
    //         this_.dataForm = Object.assign({}, this_.dataForm);
    //         return;
    //       }
    //     });
    //   }
    // }
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