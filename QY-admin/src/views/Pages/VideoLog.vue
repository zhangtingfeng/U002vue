 <template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" ref="filters" class="form">
        <el-form-item prop="fieid">
          <el-input v-model="filters.fieid" auto-complete="off" placeholder="视频ID"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="filters.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="shopname">
          <el-input v-model="filters.shopname" auto-complete="off" placeholder="商铺名称"></el-input>
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
      <el-form :inline="true">
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
      :showBatchDelete="false"
      :showDeleteOperation="false"
      :showEditOperation="false"
      :showDetailOperation="true"
      @findPage="findPage"
      @handleDetail="showDetailOperation"
      ref="CyTable"
    ></cy-table>

    <el-dialog :visible.sync="showroomShopShow" title="播放明细" style="width:100%">
      <component
        :is="item.content"
        :fieid="fieid"
        @closeShowroomShopShow="closeShowroomShopShow"
      ></component>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import CyTable from "@/views/Core/CyTable";
import { exportExcel } from "@/utils/excel";
import VideoLogDetail from "@/views/Pages/VideoLogDetail.vue";
export default {
  components: {
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    VideoLogDetail
  },
  data() {
    return {
      filters: {
        fieid: "",
        username: "",
        shopname: "",
        t: "videoLog",
        sql: "queryVideoList",
        sqlCount: "queryVideoListCount"
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      showroomShopShow: false,
      item: {
        content: "ShopList"
      },
      fieid:""
    };
  },
  methods: {
    closeShowroomShopShow() {
      this.showroomShopShow = false;
      this.item.content = "";
    },
    showDetailOperation: function(params) {
      this.item.content = "";
      this.$nextTick(() => {
        this.item.content = "VideoLogDetail";
        this.showroomShopShow = true; 
        this.fieid = params.row.fileid;
      });
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
          let filename = "播放记录";
          this.$refs.CyTable.exportData(this.filters, this.filterColumns, filename);
        })
        .catch(() => {});
    },

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "username", label: "用户名", minWidth: 120 },
        { prop: "shop_name", label: "店铺", minWidth: 120 },
        { prop: "content", label: "动态内容", minWidth: 220 },
        { prop: "picture", label: "视频地址", minWidth: 220 },
        { prop: "fileid", label: "视频ID", minWidth: 120 },
        { prop: "total_num", label: "浏览量", minWidth: 80 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
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
