<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters">
        <el-form-item prop="key">
          <el-input v-model="filters.key" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-input v-model="filters.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item prop="queryname">
          <el-input v-model="filters.queryname" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            type="primary"
            @click="$refs.CyTable.findPageBeforeRestPages(filters)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('action.add')" type="primary" @click="handleAdd" />
        </el-form-item>
        <el-form-item>
          <kt-button
            :label="$t('action.reset')"
            icon="el-icon-refresh"
            type="primary"
            @click="resetForm('filters')"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <cy-table
      :height="350"
      :data="pageResult"
      :columns="columns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="key">
          <el-input v-model="dataForm.key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="val">
          <el-input v-model="dataForm.val" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="dataForm.type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
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
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import { format } from "@/utils/datetime";
export default {
  components: {
    CyTable,
    KtButton
  },
  data() {
    return {
      size: "small",
      filters: {
        key: "",
        type: "",
        t: "sysConfig",
        queryname: ""
      },
      columns: [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "key", label: "名称", minWidth: 100 },
        { prop: "val", label: "值", minWidth: 100, showOverflowTooltip: true },
        { prop: "type", label: "类型", minWidth: 80 },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "creatorName", label: "创建人", minWidth: 100 },
        { prop: "create_time", label: "创建时间", minWidth: 120 }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        key: [{ required: true, message: "请输入名称", trigger: "blur" }],
        val: [{ required: true, message: "请输入值", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        id: "",
        key: "",
        val: "",
        type: "",
        remark: ""
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    // 批量删除
    handleDelete: function(data) {
      if (data != null && data.params != null && data.params.length > 0) {
        let ids = data.params.map(item => item.id).toString();

        var params = {};
        params.t = "sysConfig";
        params.ids = ids;
        var this_ = this;
        this.utils.request.batchDeleteInfo(params, function(res) {
          if (res.code == "0000") {
            this_.$message({ message: "操作成功", type: "success" });
            this_.findPage(null);
          } else {
            this_.$message({ message: "操作失败, " + res.msg, type: "error" });
          }
        });
      }
    },
    // 显示新增界面
    handleAdd: function() {
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: "",
        key: "",
        val: "",
        type: "",
        remark: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let params = Object.assign({}, this.dataForm);

            params.t = "sysConfig";
            var this_ = this;
            this.utils.request.editInfo(params, function(res) {
              if (res.code == "0000") {
                this_.$message({ message: "操作成功", type: "success" });

                this_.$refs["dataForm"].resetFields();

                this_.editDialogVisible = false;

                this_.findPage(null);

                this_.utils.request.deleteSysCache({}, res => {});
              } else {
                this_.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>