 <template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" ref="filters" class="form">
        <el-form-item prop="username">
          <el-input v-model="filters.username" auto-complete="off" placeholder="点击用户名"></el-input>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="filters.ip" auto-complete="off" placeholder="ip地址"></el-input>
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
    
    <!--表格内容栏-->
    <cy-table
      :data="pageResult"
      :columns="filterColumns"
      :showOperation="false"
      @findPage="findPage" 
      ref="CyTable"
    ></cy-table>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import CyTable from "@/views/Core/CyTable";
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  props: {
    fieid: {
      // 尺寸样式
      type: String,
      default: ""
    }
  },
  data() {
    return {
      filters: {
        ip: "",
        username: "",
        t: "videoLog"
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {}
    };
  },
  methods: {
    findPage: function(data) { 
      this.filters.fieid = this.fieid;
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
          this.exportData(this.filters, this.filterColumns, filename);
        })
        .catch(() => {});
    },

    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "memberName", label: "用户名", minWidth: 120 },
        { prop: "fieid", label: "视频ID", minWidth: 120 },
        { prop: "ip", label: "ip地址", minWidth: 120 },
        { prop: "create_time", label: "播放时间", minWidth: 80 }
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
