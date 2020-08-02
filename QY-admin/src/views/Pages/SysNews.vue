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
        <el-form-item prop="title">
          <el-input v-model="filters.title" auto-complete="off" placeholder="请输入消息标题"></el-input>
        </el-form-item>
        <el-form-item prop="whether_push">
          <el-select v-model="filters.whether_push" placeholder="请选择是否展示">
            <el-option label="是" :value="0"></el-option>
            <el-option label="否" :value="1"></el-option>
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
      title="系统消息"
      :visible.sync="newsModel"
      width="45%"
      height="100%"
      label-width="80px"
      
      label-position="right"
    >
      <el-form :model="dataForm" label-width="80px" ref="dataForm" label-position="right" :rules="dataFormRules">
        <el-form-item label="id" prop="id" v-if="false">
          <el-input v-model="dataForm.id" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>

        <el-form-item label="消息内容" prop="content">
          <el-input v-model="dataForm.content" auto-complete="off"  :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="是否推送" prop="whether_push" >
          <el-select v-model="dataForm.whether_push" placeholder="请选择是否推送" style="width:744px">
            <el-option label="是" :value="0"></el-option>
            <el-option label="否" :value="1"></el-option>
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
        dataFormRules: {
				title: [
					{ required: true, message: '请输入标题', trigger: 'change' }
				],
				content: [
					{ required: true, message: '请输入内容', trigger: 'blur' }
				],
				whether_push: [
					{ required: true, message: '请选择是否展示', trigger: 'blur' }
				],
				
				
			},
      newsModel: false,
      dataForm: {
          title:"",
          content:"",
          cretor:"",
          updator:""
      },
      disabled: false,
      dialogVisibleImg: false,
      username: "",
      excelUpload:
        this.utils.getHost() +
        "/excel/ajaxUploadCustomerExcel?token=" +
        localStorage.getItem("token"),
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: [],
      imageUrl: "",
      size: "small",
      dialogImageUrl: "",
      loading: false,
      customer_nature: "",
      filters: {
        

        t: "sysNews"
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
      paperworkphotoimgUploadList: []
    };
  },
  methods: {
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    //新增商家
    addShop() {
      let this_ = this;
      this_.dataForm = {};

      this_.newsModel = true;
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

      data.t = "sysNews";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    },

    // 显示编辑界面

    handleEdit: function(data) {
      this.newsModel = true;
      this.$nextTick(function() {
        this.dataForm = Object.assign({}, data.row);
      });
    },

    //提交按钮
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.dataForm);
          params.t = "sysNews";
          var this_ = this;
          console.log("保存信息===>>>>>>>>>" + JSON.stringify(params));
          this.utils.request.editInfo(params, function(res) {
            if (res.code == "0000") {
              this_.$message({ message: "操作成功", type: "success" });
              this_.newsModel = false;
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
      this_.newsModel = false;
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
        { prop: "title", label: "消息标题", minWidth: 120 },
        { prop: "content", label: "消息内容", minWidth: 120 },
        { prop: "whether_push", label: "是否展示", minWidth: 120,formatter: function(row, column, cellValue, index) {
            if (cellValue == 0) {
              return "是";
            } else if (cellValue == 1) {
              return "否";
            }
          } },

       
        { prop: "create_time", label: "创建时间", minWidth: 120 },
       
       
        
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