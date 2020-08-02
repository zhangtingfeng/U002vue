<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item prop="dept_name">
          <el-input v-model="filters.dept_name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            type="primary"
            @click="dealWithTreeData()"
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
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('action.add')" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table
      :data="tableTreeDdata"
      size="mini"
      style="width: 100%;"
      :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}"
      row-key="id"
    >
      <el-table-column prop="treeId" width="100" label="编号" :formatter="formatterId"></el-table-column>
      <el-table-column prop="dept_name" header-align="center" width="400" label="名称">
        <template slot-scope="scope">
          <div style="color:#409eff;">{{ scope.row.dept_name }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="parent_name"
        header-align="center"
        align="center"
        width="200"
        label="上级机构"
      ></el-table-column>
      <!-- <el-table-column prop="sort" header-align="center" align="center" label="排序"></el-table-column> -->
      <el-table-column prop="createname" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="create_time" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="185"
        :label="$t('action.operation')"
      >
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" @click="handleEdit(scope.row)" />
          <kt-button
            icon="fa fa-trash"
            :label="$t('action.delete')"
            type="danger"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="submitForm()"
        label-width="80px"
        :size="size"
        style="text-align:left;"
      >
        <el-form-item label="名称" prop="dept_name">
          <el-input v-model="dataForm.dept_name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="dataForm.parentName==null?'顶级机构':dataForm.parentName"
            :nodeKey="''+dataForm.pid"
            :currentChangeHandle="handleTreeSelectChange"
            filter_key="dept_name"
          ></popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="sort" v-show="false">
          <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      size: "small",
      loading: false,
      filters: {
        dept_name: ""
      },
      tableTreeDdata: [], 
      dialogVisible: false,
      dataForm: {
        id: 0,
        dept_name: "",
        pid: 0,
        parentName: "",
        sort: 0
      },
      total:0,
      dataRule: {
        dept_name: [
          { required: true, message: "机构名称不能为空", trigger: "blur" }
        ],
        parentName: [
          { required: true, message: "上级机构不能为空", trigger: "change" }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "dept_name",
        children: "children"
      }
    };
  },
  methods: {
    // 获取数据
    findTreeData: function(dept_name) {
      var this_ = this;
      var params = Object.assign({}, this.filters);

      this.utils.request.findDeptTree(params, function(res) {
        if (res.data != null && res.data.length > 0) {
          this_.tableTreeDdata = res.data; 
          this_.popupTreeData = this_.getParentMenuTree(res.data);
          this_.total = res.data[0].total; 
        } else {
          this_.tableTreeDdata = []; 
        }
      });
    },
    // 获取上级机构树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        pid: 0,
        dept_name: "顶级机构",
        parent_name: "顶级机构",
        children: tableTreeDdata
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dataForm = {
        id: "",
        dept_name: "",
        pid: "",
        parentName: "",
        sort: ""
      };
    },
    reset: function() {
      this.filters = {};
      this.findTreeData();
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      this.dataForm = Object.assign({}, row);

      this.dataForm.parentName = row.parent_name;
      if (this.dataForm.pid == 0) {
        this.dataForm.parentName = "顶级机构";
      }
    },

    handleDelete: function(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = this.getDeleteIds([], row);
        let ids = params.map(item => item.id).toString();
        row.t = "sysDept";
        row.ids = ids;
        this.utils.request.batchDeleteInfo(row, this.deleteInfoBack);
      });
    },
    //删除callback
    deleteInfoBack(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findTreeData();
    },
    // 获取删除的包含子机构的id列表
    getDeleteIds(ids, row) {
      debugger;
      ids.push({ id: row.id });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.pid = data.id;
      this.dataForm.parentName = data.dept_name;
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            if (params.parentName == "顶级机构") {
              params.pid = 0;
            }
            params.t = "sysDept";
            if (this.utils.isNull(params.type)) {
              params.type = 20;
            }
            if (this.utils.isNull(params.status)) {
              params.status = 0;
            } 

            params.sort = this.total + 1;

            this.utils.request.editUserInfo(params, this.editInfoBack);
          });
        }
      });
    },
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
        this.$refs["dataForm"].resetFields();
      } else {
        this.$message({ message: "操作失败", type: "error" });
      }
      this.dialogVisible = false;
      this.editLoading = false;
      this.findTreeData();
    },
    // 时间格式化
    formatterId: function(row, column, cellValue, index) {
      return index + 1;
    },
    dealWithTreeData() {
      var params = Object.assign({}, this.filters);
      this.utils.request.selectDeptTree(params, res => {
        if (res.data != null && res.data.length > 0) { 
          this.deleteOthers(this.tableTreeDdata, res.data);  
        }
      });
    
    },

    deleteOthers(arrList, idList) {
      for (var i = arrList.length - 1; i >= 0; i--) {
        var value = arrList[i];
        if (idList.indexOf(value.id+"") == -1) {
          arrList.splice(i, 1);
        } else {
          var children = value.children;
          if (jQuery.type(children) === "array") {
            this.deleteOthers(children, idList);
          }
        }
      }
    },

    
  },
  mounted() {
    this.findTreeData();
  }
};
</script>

<style scoped>
/deep/.el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 4px;
}
</style>