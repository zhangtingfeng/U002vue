<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名"></el-input>
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
            type="primary"
            @click="resetForm('filters')"
            icon="el-icon-refresh"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <cy-table
      :height="220"
      permsEdit="sys:role:edit"
      permsDelete="sys:role:delete"
      :highlightCurrentRow="true"
      :stripe="false"
      :data="pageResult"
      :columns="columns"
      :showBatchDelete="false"
      @handleCurrentChange="handleRoleSelectChange"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!-- </el-col> -->
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
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="role_name">
          <el-input v-model="dataForm.role_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off" type="textarea"></el-input>
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
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span>
          <B>角色菜单授权</B>
        </span>
      </div>
      <el-tree
        :data="menuData"
        size="mini"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        style="width: 100%;pading-top:20px;font-size:14px"
        ref="menuTree"
        :render-content="renderContent"
        v-loading="menuLoading"
        element-loading-text="拼命加载中"
        :check-strictly="true"
        @check-change="handleMenuCheckChange"
      ></el-tree>
      <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAll"
          :disabled="this.selectRole.id == null"
        >
          <b>全选</b>
        </el-checkbox>
      </div>
      <div style="padding-top:4px;padding-bottom:4px;text-align:center">
        <kt-button
          :label="$t('action.reset')"
          type="primary"
          @click="resetSelection"
          :disabled="this.selectRole.id == null"
        />
        <kt-button
          :label="$t('action.submit')"
          type="primary"
          @click="submitAuthForm"
          :disabled="this.selectRole.id == null"
          :loading="authLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import { format } from "@/utils/datetime";
import utils from "@/assets/js/utils.js";
export default {
  components: {
    CyTable,
    KtButton,
    TableTreeColumn
  },
  data() {
    return {
      size: "small",
      filters: {
        name: ""
      },
      menu: {},
      columns: [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "role_name", label: "角色名", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "creater_name", label: "创建人", minWidth: 120 },
        { prop: "create_time", label: "创建时间", minWidth: 120 }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        role_name: "",
        remark: ""
      },
      selectRole: {},
      menuData: [],
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "sysRole";
      this.$refs.CyTable.findPage(this.filters);
      this.findTreeData();
    },
    // 批量删除
    // handleDelete: function (data) {
    // 	this.$api.role.batchDelete(data.params).then(data.callback)
    // },
    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "sysRole";
      data.ids = ids;
      this.utils.request.deleteRoleByRoleId(data, data.callback);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: "",
        name: "",
        remark: ""
      };
    },
    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "sysRole";
            console.log(this.dataForm)
            this.utils.request.editRole(params, this.editInfoBack);
          });
        }
      });
    },
    // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.dialogVisible = false;
        this.$refs["dataForm"].resetFields();
      } else {
        this.$message({ message: "操作失败, " + data.msg, type: "error" });
      }
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
    },

    // // 获取数据
    findTreeData: function() {
      this.menuLoading = true;
      this.menu.t = "sysMenu";
      var this_ = this;
      this.utils.request.findMenuTree(this.menu, function(data) {
        this_.menuData = data.data;
        this_.menuLoading = false;
      });
      // this.$api.menu.findMenuTree().then(res => {
      //   this.tableTreeDdata = res.data;
      //   this.popupTreeData = this.getParentMenuTree(res.data);
      //   this.loading = false;
      // });
    },
    // // 角色选择改变监听
    // handleRoleSelectChange(val) {
    // 	debugger
    // 	if(val == null || val.val == null) {
    // 		return
    // 	}
    // 	this.selectRole = val.val
    // 	this.$api.role.findRoleMenus({'roleId':val.val.id}).then((res) => {
    // 		this.currentRoleMenus = res.data
    // 		this.$refs.menuTree.setCheckedNodes(res.data)
    // 	})
    // },

    // 角色选择改变监听
    handleRoleSelectChange(val) {
      if (val == null || val.val == null) {
        return;
      }
      var query = {};
      query.roleid = val.val.id;
      query.sql = "queryMenuTreeByRoleId";
      query.t = "sysMenu";
      this.selectRole = val.val;
      var this_ = this;
      this.utils.request.queryUserList(query, function(data) {
        if (data.data != null) {
          this_.currentRoleMenus = data.data;
          this_.$refs.menuTree.setCheckedNodes(data.data);
        } else {
          this_.currentRoleMenus = [];
          this_.$refs.menuTree.setCheckedNodes(this_.currentRoleMenus);
        }
      });
    },
    // 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.pid;
        this.$refs.menuTree.setChecked(parentId, true, false);
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false);
          });
        }
      }
    },
    // 重置选择
    resetSelection() {
      this.checkAll = false;
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
    },
    // 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenu(this.menuData, allMenus);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    // 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus);
        }
      });
    },
    // 角色菜单授权提交
    submitAuthForm() {
      var this_ = this;
      let roleId = this.selectRole.id;
      if (typeof roleId == "undefined") {
        this.$message({ message: "请选择一个角色", type: "error" });
        this.authLoading = false;
        return;
      } else {
        this.authLoading = true;
        let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
        let roleMenus = [];
        for (let i = 0, len = checkedNodes.length; i < len; i++) {
          let roleMenu = { roleId: roleId, menuId: checkedNodes[i].id };
          roleMenus.push(roleMenu);
        }
        var roleMenusTotaol = {};
        roleMenusTotaol.roleMenus = JSON.stringify(roleMenus);
        roleMenusTotaol.roleId = roleId;
        this.utils.request.saveRoleMenus(roleMenusTotaol, function(data) {
          if (data.code == "0000") {
            this_.$message({ message: "操作成功", type: "success" });
            this_.authLoading = false;
            this_.findPage();
          } else {
            this_.$message({ message: "操作失败, " + data.msg, type: "error" });
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:200px; width:100px">
            {data.name}
          </span>
          <span style="text-algin:center;margin-right:100px;">
            <el-tag
              type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
              size="small"
            >
              {data.type === 0 ? "目录" : data.type === 1 ? "菜单" : "按钮"}
            </el-tag>
          </span>
          <span style="text-algin:center;margin-right:200px;">
            {" "}
            <i class={data.icon}></i>
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {data.parentName ? data.parentName : "顶级菜单"}
          </span>
          <span style="text-algin:center;margin-right:80px;"></span>
        </div>
      );
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      if (true) {
        return "llll";
      }
      return format(row[column.property]);
    },
    //重置
    resetForm(formName) {
      this.filters = {
        name: ""
      };
      this.$refs.CyTable.resetForm();
      this.findPage();
    }
  },

  mounted() {}
};
</script>
<style scoped>
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
</style>