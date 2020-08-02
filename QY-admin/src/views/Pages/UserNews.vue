<template>
  <el-container>
    <el-header height="30%">
      <div style="border-radius: 4px;" class="page-container">
        <el-form :inline="true" :model="filters" ref="filters" class="form">
          <el-form-item prop="status">
            <el-select v-model="filters.status" placeholder="审核状态">
              <el-option label="审核中" :value="0"></el-option>
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="审核拒绝" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="filters.startTime"
              type="datetime"
              placeholder="创建开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="filters.endTime"
              type="datetime"
              placeholder="创建结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <kt-button icon="el-icon-s-check" label="新增" type="primary" @click="addProduct" />
            <kt-button icon="fa fa-search" label="查询" type="primary" @click="findList" />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetFind"
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
        </el-form>
      </div>
    </el-header>
    <el-main>
      <div>
        <el-tabs v-model="type" @tab-click="handleClick">
          <el-tab-pane label="全部" name="4">
            <div>
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                ref="tableData"
                @selection-change="selectionChange"
              >
                <el-table-column prop="checks" type="selection"></el-table-column>
                <el-table-column prop="memberName" label="会员名称"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="动态内容" :formatter="formatter"></el-table-column>
                <el-table-column prop="browse_num" label="浏览数"></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusShow"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"></el-table-column>
                <el-table-column prop label="操作">
                  <template slot-scope="scope">
                    <el-button type="info" @click="checkDetail(scope.row.id)">编辑</el-button>
                    <!-- 　　　　　　<el-button type="info" @click="modifyUser(scope.row.phone)">修改</el-button> -->
                    <el-button type="waring" @click="deleteUser(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="头条" name="3">
            <div>
              <el-table
                :data="headTable"
                border
                style="width: 100%"
                @selection-change="selectionChange"
                ref="tableData1"
              >
                <el-table-column prop="checks" type="selection"></el-table-column>
                <el-table-column prop="memberName" label="会员名称"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="动态内容"></el-table-column>
                <el-table-column prop="browse_num" label="浏览数"></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusShow"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"></el-table-column>
                <el-table-column prop label="操作">
                  <template slot-scope="scope">
                    <el-button type="info" @click="checkDetail(scope.row.id)">编辑</el-button>
                    <!-- 　　　　　　<el-button type="info" @click="modifyUser(scope.row.phone)">修改</el-button> -->
                    <el-button type="waring" @click="deleteUser(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="房产" name="1">
            <div>
              <el-table
                :data="estateTable"
                border
                style="width: 100%"
                @selection-change="selectionChange"
                ref="tableData2"
              >
                <el-table-column prop="checks" type="selection"></el-table-column>
                <el-table-column prop="memberName" label="会员名称"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="动态内容" :formatter="formatter"></el-table-column>
                <el-table-column prop="browse_num" label="浏览数"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop label="操作">
                  <template slot-scope="scope">
                    <el-button type="info" @click="checkDetail(scope.row.id)">编辑</el-button>
                    <!-- 　　　　　　<el-button type="info" @click="modifyUser(scope.row.phone)">修改</el-button> -->
                    <el-button type="waring" @click="deleteUser(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="物流" name="2">
            <div>
              <el-table
                :data="logisticsTable"
                border
                style="width: 100%"
                @selection-change="selectionChange"
                ref="tableData3"
              >
                <el-table-column prop="checks" type="selection"></el-table-column>
                <el-table-column prop="memberName" label="会员名称"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="动态内容" :formatter="formatter"></el-table-column>
                <el-table-column prop="browse_num" label="浏览数"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>

                <el-table-column prop label="操作">
                  <template slot-scope="scope">
                    <el-button type="info" @click="checkDetail(scope.row.id)">编辑</el-button>
                    <!-- 　　　　　　<el-button type="info" @click="modifyUser(scope.row.phone)">修改</el-button> -->
                    <el-button type="waring" @click="deleteUser(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
    <!-- <el-row style="text-align:center">
      
    </el-row>-->

    <!-- 咨询详情 -->
    <el-dialog
      title="咨询详情"
      :visible.sync="newsModel"
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
        :rules="dataFormRules"
      >
        <el-form-item label="会员名称" prop="memberName" v-show="dataForm.id">
          <el-input v-model="dataForm.memberName" auto-complete="off" type="text" readonly></el-input>
        </el-form-item>
        <el-form-item label="浏览数" prop="browse_num" v-show="dataForm.id">
          <el-input v-model="dataForm.browse_num" auto-complete="off" readonly type="number"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="审核状态" v-show="dataForm.id">
          <el-select v-model="dataForm.status" placeholder="审核状态" disabled>
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="分类">
          <el-select v-model="dataForm.type" placeholder="选择分类" clearable>
            <el-option label="头条" :value="0"></el-option>
            <el-option label="房产" :value="1"></el-option>
            <el-option label="物流" :value="2"></el-option>
            <el-option label="其它" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off"></el-input>
        </el-form-item>
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
        <el-form-item label="动态内容" prop="content">
          <div class="edit_container" style="max-height:500px;overflow: auto;">
            <quill-editor v-model="dataForm.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click.native="cleNewsModel">{{$t('action.cancel')}}</el-button>
        <el-button
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

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

    <el-upload
      :action="imgUpload"
      :on-success="handleSuccess"
      :show-file-list="false"
      :file-list="filelist"
      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
      :max-size="2048"
    >
      <el-button v-show="false" size="small" type="primary" id="uploadButton"></el-button>
    </el-upload>

    <el-dialog :visible.sync="dialogVisibleImageList" title="图片" @closed="beforeClose">
      <div style="max-height:500px;overflow: auto;">
        <div v-for="(file,index) in filelist" :key="index" :tabindex="index" style="width:100%">
          <img style="max-height:500px" :src="file" alt />
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import ImgUpload from "@/views/Core/ImgUpload";
export default {
  components: {
    CyTable,
    KtButton,
    ImgUpload
  },
  data() {
    return {
      imgUpload: this.utils.getUpLoadHost(),
      Roptions: [
        { key: 1, value: "审核通过" },
        { key: 2, value: "审核不通过" }
      ],
      editLoading: false,
      dialogVisibleReviw: false,
      dataStatusForm: {},
      newsModel: false,
      type: "4",
      tableData: [],
      headTable: [],
      estateTable: [],
      logisticsTable: [],
      filters: {
        status: "",
        memberName: "",
        t: "userNews"
      },
      // 新增编辑界面数据
      dataForm: {
        number: ""
      },
      checked: [],
      login_shop_id: "",
      member_id: "",
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
      filelist: [],
      picList: [],
      dialogVisibleImageList: false,
      dataFormRules: {
        type: [{ required: true, message: "请选择类别", trigger: "change" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  methods: {
    beforeClose() {
      this.filelist = [];
    },
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
    //保存修改
    submitForm: function() {
      var this_ = this;

      this_.$refs.dataForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this_.dataForm);
          params.t = "userNews";
          params.member_id = this.member_id;
          params.status = "0";

          if (!params.content) {
            this.$message({ message: "请输入详情", type: "error" });
            return;
          }

          params.picture = this.picList.map(item => item.url).toString();
          if (!params.picture) {
            this.$message({ message: "请选择图片", type: "error" });
            return;
          }

          this_.editLoading = true;
          this_.utils.request.editInfo(params, res => {
            this_.editLoading = false;
            if (res.code == "0000") {
              this.$message({ message: "操作成功", type: "success" });
              this.findPage();
              this.newsModel = false;
            } else {
              this.$message({
                message: "操作失败, " + res.msg,
                type: "error"
              });
            }
          });
        }
      });
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
    addProduct: function(params) {
      let this_ = this;
      this.newsModel = true;

      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }
      this.dataForm = {};
      this.dataForm.status = 0;
      if (this.login_shop_id) {
        this.dataForm.shop_id = this.login_shop_id;
      }
      this.dataForm.parentName = "";
      this.picList = [];
    },
    formatter: (row, column, cellValue, index) => {
      if (cellValue.length >= 100) {
        cellValue = cellValue.substring(0, 100) + "...";
      }
      return cellValue;
    },
    selectionChange: function(selections) {
      this.checked = selections;
    },
    review(data) {
      if (this.checked.length < 1) {
        this.$message({ message: "审核数据不能为空", type: "error" });
        return;
      }
      this.dialogVisibleReviw = true;
    },
    submitStatus() {
      var this_ = this;
      let ids = this.checked.map(item => item.id).toString();
      this.utils.request.doChecked(
        {
          ids: ids,
          checkEdStatus: this.dataStatusForm.status,
          t: "userNews"
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

    //查询按钮

    findList() {
      this.findPage();
    },

    //重置按钮t:''
    resetFind() {
      let this_ = this;
      this_.filters = {
        t: "userNews"
      };
      this_.findPage(this_.filters);
    },
    //列表查询
    findPage: function(data) {
      let login_shop_id = localStorage.getItem("login_shop_id");
      if (login_shop_id) {
        this.login_shop_id = login_shop_id;
        this.utils.request.queryUserInfo(
          { t: "shop", id: login_shop_id },
          res => {
            this.member_id = res.data.member_id;
          }
        );
      }
      if (this.login_shop_id) {
        this.filters.shop_id = this.login_shop_id;
      }

      let this_ = this;
      this.checked = [];
      this.$refs.tableData.clearSelection();
      this.$refs.tableData1.clearSelection();
      this.$refs.tableData2.clearSelection();
      this.$refs.tableData3.clearSelection();
      this_.filters.type = "";
      this.utils.request.queryUserPage(this_.filters, function(res) {
        if (res.rows == null) {
          res.rows = [];
        }
        this_.tableData = res.rows;
      });
    },

    //删除按钮
    deleteUser(row) {
      let param = {};
      param.t = "userNews";
      param.ids = row;
      this.utils.request.deleteUserInfo(param, this.deleteInfoBack);
    },
    //删除回调
    deleteInfoBack: function() {
      this.findPage();
    },

    //tab点击事件
    handleClick(tab, event) {
      if (tab.name == "3") {
        let this_ = this;
        this_.filters.type = 0;
        this.utils.request.queryUserPage(this_.filters, function(res) {
          if (res.rows == null) {
            res.rows = [];
          }
          this_.headTable = res.rows;
        });
      } else if (tab.name == "1") {
        let this_ = this;
        this_.filters.type = 1;
        this.utils.request.queryUserPage(this_.filters, function(res) {
          if (res.rows == null) {
            res.rows = [];
          }
          this_.estateTable = res.rows;
        });
      } else if (tab.name == "2") {
        let this_ = this;
        this_.filters.type = 2;
        this.utils.request.queryUserPage(this_.filters, function(res) {
          if (res.rows == null) {
            res.rows = [];
          }
          this_.logisticsTable = res.rows;
        });
      } else if (tab.name == "4") {
        let this_ = this;
        this_.filters.type = "";
        this.utils.request.queryUserPage(this_.filters, function(res) {
          if (res.rows == null) {
            res.rows = [];
          }
          this_.tableData = res.rows;
        });
      }
    },

    //编辑
    checkDetail(row, index) {
      let this_ = this;
      let params = {};
      params.t = "userNews";
      params.id = row;

      this_.utils.request.queryUserInfo(params, (data)=> {
        this_.newsModel = true;

        this.$nextTick(() => {
          let this_ = this; 
          this.dataForm = Object.assign({}, data.data);
          this.picList = []; 

          if (this.dataForm.picture) {
            $.each(this.dataForm.picture.split(","), function(key, val) {
              let param = {};
              if (this_.utils.isNull(val)) {
              } else {
                param.url = val;
                this_.picList.push(param);
              }
            });
          }
          
        });

        
      });
    },

    //取消详情弹框
    cleNewsModel() {
      let this_ = this;
      this_.newsModel = false;
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }

      this.picList = [];
    },

    //返回状态
    statusShow(row, column) {
      if (row.status == 0) {
        return "审核中";
      } else if (row.status == 1) {
        return "审核通过";
      } else {
        return "审核拒绝";
      }
    },
    //店铺table
    showStore() {
      this.showModel = true;
      this.showTable = true;
    },
    showWarehouse() {
      this.showModel1 = true;
      this.showTable1 = true;
    },

    //商家table
    showShops() {
      this.shopsModel = true;
      this.shopsTable = true;
    },

    //导出按钮
    exInfo: function() {
      this.$message({ message: "导出成功", type: "success" });
    }
  },
  // watch: {
  //   activeNames(val) {
  //     this.$router.push(`${this.$route.path}?tab=${val}`);
  //   }
  // },
  // created() {
  //   // init the default selected tab
  //   const tab = this.$route.query.tab;
  //   if (tab) {
  //     this.activeNames = tab;
  //   }
  // },
  mounted() {
    this.findPage();
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 20px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>