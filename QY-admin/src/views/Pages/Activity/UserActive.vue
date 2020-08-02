<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="memberName">
          <el-input v-model="filters.memberName" auto-complete="off" placeholder="会员名称"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="good_num">
           <el-input v-model="filters.good_num" auto-complete="off" placeholder="点赞数"></el-input>
         </el-form-item>

         <el-form-item prop="type">
           <el-select v-model="filters.type" auto-complete="off" placeholder="类型">
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value"
             ></el-option>
           </el-select>
         </el-form-item>
-->
        <el-form-item prop="status">
          <el-select v-model="filters.status" placeholder="审核状态">
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status">
          <el-select v-model="filters.dynamic_type" placeholder="动态类型">
            <el-option label="仅文字" :value="1"></el-option>
            <el-option label="文字+图片" :value="2"></el-option>
            <el-option label="文字+视频" :value="3"></el-option>
          </el-select>
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
      :showOperation="false"
      @findPage="findPage"
      @selectionChange="selectionChange"
      @handleDelete="handleDelete"
      @handleDetail="handleDetail"
      @selection-change="selectionChange"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->

    <el-dialog title="详情页面" :visible.sync="checkpage" width="60%" @close="closeDetailVideo">
      <el-form
        :model="dataForm"
        label-width="120px"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
      >
        <el-row style="text-align:center">
          <el-form-item>
            <img :src="imgs" style="height:40%;width:40%" alt/>
          </el-form-item>
        </el-row>
        <el-row style="text-align:left">
          <el-col :span="24">
            <el-form-item label="会员名称">{{dataForm.memberName}}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="动态内容：">{{dataForm.content}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" v-if="dataForm.type == 0">
              <img-upload
                ref="ImgUpload"
                :filelist="picList"
                @handlePictureCardPreview="handlePictureCardPreview"
                uploadButton="picList"
                :showUpload="false"
              ></img-upload>
            </el-form-item>
            <el-form-item label="视频" v-else>
              <div style="height:400px;overflow-y:scroll; ">
                <div v-for="(file,index) in videoSourceList" :key="index" :tabindex="index">
                  <video :src="file.url" height="400" controls="controls" class="video"></video>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="点赞数：">{{dataForm.good_num}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="浏览数：">{{dataForm.browse_num}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="checkpage = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleVideo" title="视频" @close="closeVideo">
      <div style="margin: 0 auto;height:400px;overflow-y:scroll; ">
        <div v-for="(file,index) in videoSourceList" :key="index" :tabindex="index">
          <video :src="file" height="400" controls="controls" class="video"></video>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleImageList" title="活动主图">
      <div>
        <div v-for="(file,index) in filelist" :key="index" :tabindex="index">
          <img :src="file" alt style="height:80%;width:80%"/>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisibleReviw" title="审核" width="30%">
      <el-form
        :model="dataStatusForm"
        label-width="120px"
        ref="dataStatusForm"
        :size="size"
        label-position="right"
        inline
        :rules="dataFormRules"
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
  </div>
</template>

<script>
    import PopupTreeInput from "@/components/PopupTreeInput";
    import KtTable from "@/views/Core/KtTable";
    import KtButton from "@/views/Core/KtButton";
    import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
    import {format, formatDate} from "@/utils/datetime";
    import CyTable from "@/views/Core/CyTable";
    import ImgUpload from "@/views/Core/ImgUpload";
    import {exportExcel} from "@/utils/excel";

    export default {
        components: {
            PopupTreeInput,
            KtTable,
            CyTable,
            KtButton,
            TableColumnFilterDialog,
            ImgUpload
        },
        data() {
            return {
                videoSourceList: [],
                picList: [],
                dialogVisibleImageList: false,
                dialogVisibleVideo: false,
                disabled: false,
                dialogVisibleReviw: false,
                dialogVisibleImg: false,
                excelUpload:
                    this.utils.getHost() +
                    "/excel/ajaxUploadCustomerExcel?token=" +
                    localStorage.getItem("token"),
                customer_type_options: [],
                paperwork_type_options: [],
                trade_type_options: [],
                filelist: [],
                imageUrl: "",
                size: "small",
                dialogImageUrl: "",
                loading: false,
                customer_nature: "",
                imgs: "",
                Roptions: [
                    {key: 0, value: "未审核"},
                    {key: 1, value: "审核通过"},
                    {key: 2, value: "审核不通过"}
                ],
                dataStatusForm: {},
                dataFormRules: {
                    status: [
                        {required: true, message: "请选择审核状态", trigger: "change"}
                    ]
                },
                options: [
                    {
                        value: "0",
                        label: "图片"
                    },
                    {
                        value: "1",
                        label: "视频"
                    }
                ],
                filters: {
                    status: "",
                    card_num: "",
                    type: "",
                    t: "userActive_isVerify"
                    // startTime: formatDate( userActive_isVerify
                    //   new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    //   "yyyy-MM-dd hh:mm:ss"
                    // ),
                    // endTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                },
                columns: [],
                filterColumns: [],
                pageRequest: {pageNum: 1, pageSize: 10},
                pageResult: {},
                checked: [],
                operation: false, // true:新增, false:编辑
                dialogVisible: false, // 新增编辑界面是否显示
                editLoading: false,
                checkpage: false,
                deptData: [],
                dataForm: {
                    isCharge: ""
                },

                roles: [],
                businesslicenseimgUploadList: [],
                managerphotoimgUploadList: [],
                paperworkphotoimgUploadList: [],
                login_shop_id: ""
            };
        },
        methods: {
            closeDetailVideo() {
                this.closeVideo();
            },
            handlePictureCardPreview(data) {
                var url = data.url;
                this.filelist = [];
                this.filelist.push(url);
                this.dialogVisibleImageList = true;
            },
            review(data) {
                if (this.checked.length > 1 || this.checked.length < 1) {
                    this.$message({message: "审核时需选择并只可选择一条数据", type: "error"});
                    return;
                }
                this.dialogVisibleReviw = true;
            },
            findPage: function (data) {
                this.checked = [];
                let login_shop_id = localStorage.getItem("login_shop_id");
                if (login_shop_id) {
                    this.login_shop_id = login_shop_id;
                }
                if (this.login_shop_id) {
                    this.filters.shop_id = this.login_shop_id;
                }

                this.$refs.CyTable.findPage(this.filters);
            },
            submitStatus() {
                var this_ = this;
                let ids = this.checked.map(item => item.user_id).toString();
                //alert(JSON.stringify(ids));
                /*if (this.checked[0].isVerify != 0) {
                    this_.$message({
                        message: "已经审核过，不能重复审核",
                        type: "error"
                    });
                    return;
                }
*/
                /* let status = this.dataStatusForm.status;
                 if (status == 1 && this.checked[0].task_id) {
                     //判断是否通过腾讯审核

                     var telentParam = {};
                     telentParam.type = 1;
                     telentParam.taskId = this.checked[0].task_id;
                     telentParam.id = this.checked[0].id;

                     this.utils.request.getTxVideoTaskInfo(telentParam, res => {
                         debugger
                         if (res.code == "0000") {
                             var data = res.data;

                             let status = data.status;
                             if (status == "FINISH") {
                                 if (data.code == 0) {
                                     this.doCheck(ids);
                                 } else {
                                     this_.$message({message: data.message, type: "success"});
                                 }
                             } else {
                                 if (status == "WAITING") {
                                     this_.$message({message: "等待腾讯处理", type: "success"});
                                 } else if (status == "PROCESSING") {
                                     this_.$message({message: "腾讯处理中", type: "success"});
                                 } else {
                                     if (!data.message) {
                                         data.message = "系统异常，请稍后";
                                     }
                                     this_.$message({message: data.message, type: "success"});
                                 }
                             }
                         } else {
                             this_.$message({message: "系统异常，请稍后", type: "success"});
                         }
                     });
                 } else {*/
                this.doCheck(ids);
                //  }
            },
            doCheck(ids) {
                var this_ = this;
                //var this_ = this;
                //let ids = this.checked.map(item => item.id).toString();

                this.utils.request.doChecked(
                    {
                        ids: ids,
                        checkEdStatus: this.dataStatusForm.status,
                        t: "userActive_isVerify"
                    },
                    function (res) {
                        if (res.code == "0000") {
                            this_.$message({message: "审核完成", type: "success"});
                            this_.dialogVisibleReviw = false;
                            this_.findPage();
                        } else {
                            this_.$message({message: res.msg, type: "error"});
                        }
                    }
                );
            },
            //详情页面
            handleDetail(data) {
                this.dataForm = Object.assign({}, data.row);
                this.checkpage = true;
                this.imgs = data.row.pic;
                if (data.row.is_charge == 0) {
                    this.dataForm.isCharge = "免费";
                } else {
                    this.dataForm.isCharge = "收费";
                }
                this.picList = [];
                this.videoSourceList = [];
                var this_ = this;
                if (this.dataForm.picture) {
                    $.each(this.dataForm.picture.split(","), function (key, val) {
                        let param = {};
                        if (this_.utils.isNull(val)) {
                        } else {
                            param.url = val;
                            this_.picList.push(param);
                            this_.videoSourceList.push(param);
                        }
                    });
                }
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
                    .catch(() => {
                    });
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
                        this.$message({message: "暂无需要导出的数据 ", type: "error"});
                        return;
                    }

                    exportExcel(res.rows, filterColumns, fileName);
                });
            },
            // 批量删除
            handleDelete: function (data) {
                var ids = "";
                for (var i = 0; i < data.params.length; i++) {
                    ids = ids + data.params[i].id + ",";
                }

                data.t = "UserDynamicActive_isVerify";
                data.ids = ids;
                this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
            },
            deleteInfoBack: function (res) {
                if (res.code == "0000") {
                    this.$message({message: "操作成功", type: "success"});
                } else {
                    this.$message({message: "操作失败", type: "error"});
                }
                this.findPage();
                this.dialogVisible = false;
                this.operation = false;
            },
            // 显示查询
            queryInfo: function () {
                this.findPage(this.filters);
            },
            selectionChange: function (params) {
                console.log(params);
                this.checked = params.selections;
            },
            // 处理表格列过滤显示
            handleFilterColumns: function (data) {
                this.filterColumns = data.filterColumns;
                this.$refs.tableColumnFilterDialog.setDialogVisible(false);
            },

            // 处理表格列过滤显示
            displayFilterColumnsDialog: function () {
                this.$refs.tableColumnFilterDialog.setDialogVisible(true);
            },

            // 时间格式化
            dateFormat: function (row, column, cellValue, index) {
                return format(row[column.property]);
            },

            // 处理表格列过滤显示
            initColumns: function () {
                this.columns = [
                    {prop: "username", label: "会员名称", minWidth: 120},
                    {prop: "phone", label: "电话", minWidth: 120},
                    {
                        prop: "isVerify",
                        label: "审核状态",
                        minWidth: 120,
                        formatter: this.showStatus
                    },
                    {
                        prop: "sex",
                        label: "性别",
                        minWidth: 120,
                        formatter: this.showSex
                    },
                    {prop: "signature", label: "签名", minWidth: 120},
                    {
                        prop: "isActive",
                        label: "状态",
                        minWidth: 120,
                        formatter: this.showActiveStatus
                    },
                    {prop: "hobby", label: "兴趣", minWidth: 180},
                    {prop: "city", label: "城市", minWidth: 180},
                    {prop: "age", label: "年龄", minWidth: 180},
                    {prop: "birthday", label: "生日", minWidth: 180},
                    {prop: "create_time", label: "创建时间", minWidth: 180}
                ];

                var temp = [];
                $.each(this.columns, function (key, val) {
                    temp.push(val);
                });
                this.filterColumns = temp;
            },


            resetForm(formName) {
                this.filters = {
                    t: "userActive_isVerify"
                };
                this.$refs.CyTable.resetForm();
                this.findPage();
            },
            showPaperType(row, column, cellValue, index) {
                $.each(this.customer_type_options, function (key, value) {
                    if (value.key == cellValue) {
                        cellValue = value.val;
                        return;
                    }
                });

                return cellValue;
            },
            showSex(row, column, cellValue, index) {
                if (cellValue == 1) {
                    return " 男";
                } else if (cellValue == 2) {
                    return "女";
                }
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
            showActiveStatus(row, column, cellValue, index) {
                if (cellValue == 1) {
                    return " 非活动";
                } else if (cellValue == 0) {
                    return "活动";
                }
            },
            showPhto(row, column, cellValue, index) {
                if (row.type == 1) {
                    if (cellValue != null && "" != cellValue) {
                        return (
                            '<i class="el-icon-video-camera"><div style="display:none">' +
                            cellValue +
                            "</div></i>"
                        );
                    }
                } else {
                    if (cellValue != null && "" != cellValue) {
                        return (
                            '<i class="el-icon-zoom-in"><div style="display:none">' +
                            cellValue +
                            "</div></i>"
                        );
                    }
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
                    this.$message({message: "操作成功", type: "success"});
                    this.findPage();
                } else {
                    this.$message({message: "导入失败", type: "error"});
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
                    $.each(res.data, function (key, value) {
                        value.key = Number(value.key);
                    });
                    this.customer_type_options = res.data;
                });

                params.type = "paperwork_type";
                this.utils.request.queryUserList(params, res => {
                    $.each(res.data, function (key, value) {
                        value.key = Number(value.key);
                    });
                    this.paperwork_type_options = res.data;
                });

                params.type = "trade_type";
                this.utils.request.queryUserList(params, res => {
                    $.each(res.data, function (key, value) {
                        value.key = Number(value.key);
                    });
                    this.trade_type_options = res.data;
                });
            },
            closeVideo() {
                $.each($("video"), (key, value) => {
                    value.pause();
                });
            }
        },
        mounted() {
            this.initColumns();
            this.findPage();

            $(document).on(
                "click",
                ".el-icon-zoom-in",
                function (e) {
                    let urlList = $(e.target)
                        .find("div")
                        .html();
                    this.filelist = urlList.split(",");
                    this.dialogVisibleImageList = true;
                }.bind(this)
            );
            $(document).on(
                "click",
                ".el-icon-video-camera",
                function (e) {
                    let urlList = $(e.target)
                        .find("div")
                        .html();
                    this.videoSourceList = urlList.split(",");
                    this.dialogVisibleVideo = true;
                }.bind(this)
            );
        }
    };
</script>

<style scoped>
  /deep/ .form .el-input__inner {
    width: 200px !important;
  }
</style>
