<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters">
        <el-form-item prop="username">
          <el-input v-model="filters.username" placeholder="用户名" clearable></el-input>
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
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')" 
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="el-icon-refresh"
            :label="$t('action.reset')"
            type="primary"
            @click="reset"
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
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <cy-table
      :height="350" 
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <input type="password" style="display: none;" />
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="account">
          <el-input v-model="dataForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="工号" prop="number">
          <el-input v-model="dataForm.number" auto-complete="off" autocomplete="off"></el-input>
        </el-form-item>-->

        <el-form-item style="position:fixed;buttom:-9999px">
          <el-input v-model="dataForm.password2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="position:fixed;buttom:-9999px">
          <el-input v-model="dataForm.password1" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" show-password auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="机构" prop="deptname">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptname"
            :nodeKey="''+dataForm.deptid"
            :currentChangeHandle="deptTreeCurrentChangeHandle"
            filter_key="dept_name"
          ></popup-tree-input>
        </el-form-item> -->
        <!-- <el-form-item label="邮箱" prop="email">
				<el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="手机" prop="moile">
          <el-input v-model="dataForm.moile" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status" :hidden="operation">
          <el-select v-model="dataForm.status" placeholder="状态">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级用户" prop="pid">
          <el-select
            v-model="dataForm.pid"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="choseCustomer"
            style="width:100%"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="userRoles">
          <el-select
            v-model="dataForm.userRoles"
            multiple
            placeholder="请选择"
            style="width: 100%;"
            clearable
            filterable
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
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
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import { exportExcel } from "@/utils/excel";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      size: "small",
      filters: {
        username: "",
        t: "sysUser"
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: "",
        password: "",
        deptid: "",
        deptname: "",
        email: "",
        moile: "",
        status: 1,
        userRoles: [],
        account: "",
        pid: "",
        number: "",
        username: ""
      },
      deptData: [],
      deptTreeProps: {
        label: "dept_name",
        children: "children"
      },
      roles: [],
      options: [],
      paswordTemp: ""
    };
  },
  methods: {
    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "sysUser";
        search.username = query;
        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.options = res.data;
        });
      } else {
        this.options = [];
      }
    },
    choseCustomer: function(selVal) {
      var temp = this.options;
      var this_ = this;

      if (selVal == "" || selVal == null) {
        this_.dataForm.manager_name = "";
        this_.dataForm.manager_mobile = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.manager_name = val.manager_name;
            this_.dataForm.manager_mobile = val.manager_mobile;
            return;
          }
        });
      }
    },
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    // 加载用户角色信息
    findUserRoles: function() {
      var this_ = this;
      let query = {};
      query.t = "sysRole";
      this.utils.request.queryUserList(query, function(res) {
        if (res.code == "0000") {
          this_.roles = res.data;
        } else {
        }
      });
    },
    // 批量删除
    handleDelete: function(data) {
      if (data != null && data.params != null && data.params.length > 0) {
        let ids = data.params.map(item => item.id).toString();

        var params = {};
        params.t = "sysUser";
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
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: "",
        name: "",
        password: "",
        deptid: "",
        deptname: "",
        email: "",
        moile: "",
        status: 1,
        userRoles: [1],
        account: "",
        pid: "",
        number: "",
        username: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.paswordTemp = params.row.password;

      this.dataForm = {
        id: params.row.id,
        name: params.row.name,
        password: params.row.password,
        deptid: params.row.deptid,
        deptname: params.row.deptname,
        email: params.row.email,
        moile: params.row.moile,
        status: 1,
        userRoles: [],
        account: params.row.account,
        pid: params.row.pid,
        number: params.row.number,
        username: params.row.username,
        pname: params.row.pname
      };

      let userRoles = [];
      if (!this.utils.isNull(params.row.role_id_list)) {
        let idList = params.row.role_id_list.split(",");

        $.each(idList, function(key, value) {
          userRoles.push(Number(value));
        });
      }
      this.options = [];
      if (this.dataForm.pid == 0) {
        this.dataForm.pname = " ";
      }

      this.options.push({
        username: this.dataForm.pname,
        id: this.dataForm.pid
      });

      this.dataForm.userRoles = userRoles;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let params = Object.assign({}, this.dataForm);
            let userRoles = [];
            for (let i = 0, len = params.userRoles.length; i < len; i++) {
              let userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              };
              userRoles.push(userRole);
            }

            params.userRoles = userRoles.map(item => item.roleId).toString();

            if (this.paswordTemp == params.password) {
              delete params.password;
            }

            if (this.utils.isNull(params.pid)) {
              params.pid = 0;
            }

            var this_ = this;

            this.utils.request.editUser(params, function(res) {
              if (res.code == "0000") {
                this_.$message({ message: "操作成功", type: "success" });
                this_.dialogVisible = false;
                this_.$refs["dataForm"].resetFields();
                this_.findPage(null);
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
    // 获取部门列表
    findDeptTree: function() {
      var this_ = this;

      this.utils.request.findDeptTree({}, function(res) {
        if (res.code == "0000") {
          this_.deptData = res.data;
        } else {
        }
      });
    },
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      console.log(data);
      this.dataForm.deptid = data.id;
      this.dataForm.deptname = data.dept_name;
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      if (Number(cellValue) == 1) {
        return "在职";
      }
      return "离职";
    },
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        { prop: "username", label: "用户名", minWidth: 120 },
        { prop: "account", label: "登录账号", minWidth: 120 },
        // { prop: "deptname", label: "机构", minWidth: 120 },
        { prop: "rolename", label: "角色", minWidth: 100 },
        // { prop: "number", label: "工号", minWidth: 120 },
        { prop: "moile", label: "手机", minWidth: 100 },
        {
          prop: "status",
          label: "状态",
          minWidth: 70,
          formatter: this.dateFormat
        },
        { prop: "pname", label: "上级名称", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          exportExcel(this.pageResult.content, this.filterColumns);
        })
        .catch(() => {});
    },
    reset: function() {
      this.$refs["filters"].resetFields();
      this.$refs.CyTable.resetForm();
      this.findPage();
    }
  },
  mounted() {
    this.findDeptTree();
    this.initColumns();
    this.findUserRoles();
  }
};
</script>

<style scoped>
</style>