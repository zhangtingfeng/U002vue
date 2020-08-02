<template>
  <div class="page-container">
    <div style="margin:20px 80px">
      <el-row style="height:145px">
        <el-col :span="2">
          <div style="text-align:left">
            <img class="avatar" :src="require('@/assets/dxtf.png')" style="width:93px;height:93px" />
          </div>
        </el-col>
        <el-col :span="2" style="line-height:143px;text-align:left">欢迎客户入驻</el-col>
        <el-col :span="2" style="line-height:143px" :offset="18">
          <div style="text-align:right;margin-left: -31%;">
            已有帐号?
            <a href="/" target="_blank">请登录</a>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="toolbar" style="padding-top:10px;padding-left:15px;">
      <el-form
        :inline="true"
        :model="dataForm"
        label-width="180px"
        style="text-align:center;"
        ref="dataForm"
        :rules="dataFormRules"
        :size="size"
        class="form"
      >
        <el-row style="text-align: center;">
          <el-form-item>
            <span style="font-size: 25px;">基础信息</span>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="企业名称" prop="client_name">
            <el-input v-model="dataForm.client_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="企业性质" prop="customer_type">
            <el-select v-model="dataForm.customer_type" placeholder="客户性质" clearable filterable>
              <el-option
                v-for="item in customer_type_options"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center;">
          <el-form-item label="法人姓名" prop="legalname">
            <el-input v-model="dataForm.legalname"></el-input>
          </el-form-item>

          <el-form-item label="法人证件类型">
            <el-select v-model="dataForm.paperwork_type" placeholder="法人证件类型" clearable filterable>
              <el-option
                v-for="item in paperwork_type_options"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center;">
          <el-form-item label="统一社会信用代码" prop="socialcode">
            <el-input
              v-model="dataForm.socialcode"
              auto-complete="off"
              maxlength="18"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="注册资本（万元）" prop="registered_capital">
            <el-input type="number" v-model="dataForm.registered_capital" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center;">
          <el-form-item label="法人证件号">
            <el-input v-model="dataForm.paperwork_no" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="法人证件有效期">
            <el-date-picker
              v-model="dataForm.effective_time"
              type="date"
              style="width:100%"
              placeholder="法人证件有效期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="行业类型" prop="trade_type">
            <el-select v-model="dataForm.trade_type" placeholder="行业类型" clearable filterable>
              <el-option
                v-for="item in trade_type_options"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="营业执照注册日期" prop="business_date_start">
            <el-date-picker
              v-model="dataForm.business_date_start"
              type="date"
              style="width:100%"
              placeholder="营业执照注册日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="营业执照到期日期" prop="business_date">
            <el-date-picker
              v-model="dataForm.business_date"
              type="date"
              style="width:100%"
              placeholder="营业执照到期日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center;">
          <el-form-item>
            <span style="font-size: 25px;">经办人信息</span>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="经办人姓名" prop="manager_name">
            <el-input v-model="dataForm.manager_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="经办人证件类型" prop="manager_papertype">
            <el-select
              v-model="dataForm.manager_papertype"
              placeholder="经办人证件类型"
              clearable
              filterable
            >
              <el-option
                v-for="item in paperwork_type_options"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center;">
          <el-form-item label="经办人联系方式" prop="manager_mobile">
            <el-input
              v-model="dataForm.manager_mobile"
              placeholder="请输入手机号"
              auto-complete="off"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g,'')"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="经办人工作邮箱" prop="manager_email">
            <el-input v-model="dataForm.manager_email" auto-complete="off" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center;">
          <el-form-item label="经办人证件号">
            <el-input v-model="dataForm.manager_paperwork" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="经办人证件有效期">
            <el-date-picker
              v-model="dataForm.manager_effectivetime"
              type="date"
              style="width:100%"
              placeholder="法人证件有效期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-row>

        <el-row style="text-align: center;">
          <el-form-item label="营业执照" prop="businesslicense">
            <el-upload
              :action="imgUpload"
              :on-success="handleAvatarSuccess"
              list-type="picture-card"
              v-model="dataForm.businesslicense"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibleImage">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>

          <el-form-item label="法人证件证照">
            <el-upload
              :action="imgUpload"
              :on-success="handleAvatarSuccess1"
              list-type="picture-card"
              v-model="dataForm.paperwork_photo"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibleImage">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item label="经办人证件证照">
            <el-upload
              :action="imgUpload"
              :on-success="handleAvatarSuccess2"
              list-type="picture-card"
              v-model="dataForm.manager_photo"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove2"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibleImage">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <span style="font-size: 25px;">登录信息</span>
          </el-form-item>
          <el-divider></el-divider>
          <el-row style="text-align: center;">
            <el-form-item label="登录账号">
              <el-input v-model="dataForm.manager_email" readonly auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="position:fixed;buttom:-9999px">
              <el-input v-model="dataForm.password2" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="position:fixed;buttom:-9999px">
              <el-input v-model="dataForm.password1" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录密码">
              <el-input v-model="dataForm.password" auto-complete="off" show-password></el-input>
            </el-form-item>
          </el-row>
        </el-row>
      </el-form>

      <div class="item clearfix pt_10 mb_0">
        <el-checkbox
          id="check"
          type="checkbox"
          v-model="checkbox"
          style="color: black"
          class="el-checkbox"
        ></el-checkbox>
        <label for="js-mobile-check" class="txt_check_label gray">
          我已阅读并同意
          <a href="https://id.ifeng.com/user/agreement" target="_blank">《开通业务协议》</a>
        </label>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="restForm">重置</el-button>
        <el-button type="primary" @click.native="submitForm" :disabled="!checkbox">提交注册</el-button>
      </div>
    </div>
    <div>
      <!--司机编辑界面-->
      <!-- <component :is='goods'   @adddriverChid="adddriverChid" />  -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";
import ThemePicker from "@/components/ThemePicker";
import LangSelector from "@/components/LangSelector"; 
import Vue from "vue";

export default {
  name: "Login",
  components: {
    ThemePicker,
    LangSelector, 
  },
  data() {
    return {
      imgUpload: this.utils.getUpLoadHost(),
      imageUrl: "",
      size: "small",
      fileList: {},
      response: {},
      file: {},
      checkbox: false,
      imgs: "",
      imgs1: "",
      imgs2: "",
      goods: "goods",
      dataForm: {
        name: "",
        businesslicense: "",
        paperwork_photo: "",
        manager_photo: ""
      },

      dialogImageUrl: "",
      loading: false,
      dialogVisibleImage: false,
      loginForm: {
        account: "",
        password: "",
        captcha: "",
        src: ""
      },
      dataFormRules: {
        client_name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        customer_type: [
          { required: true, message: "请选择客户性质", trigger: "change" }
        ],
        legalname: [
          { required: true, message: "请输入法人姓名", trigger: "blur" }
        ],
        paperwork_type: [
          { required: true, message: "请选择法人证件类型", trigger: "change" }
        ],
        socialcode: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          },
          { min: 18, max: 18, message: "长度是18个字符", trigger: "blur" }
        ],
        registered_capital: [
          { required: true, message: "请输入注册资本（万元）", trigger: "blur" }
        ],
        paperwork_no: [
          { required: true, message: "请输入法人证件号", trigger: "blur" }
        ],
        effective_time: [
          { required: true, message: "请输入法人证件有效期", trigger: "blur" }
        ],
        trade_type: [
          { required: true, message: "请选择行业类型", trigger: "change" }
        ],
        business_date: [
          { required: true, message: "请输入营业执照注册日期", trigger: "blur" }
        ],
        business_date_start: [
          { required: true, message: "请输入营业执照到期日期", trigger: "blur" }
        ],
        manager_papertype: [
          { required: true, message: "请选择经办人证件类型", trigger: "change" }
        ],
        manager_paperwork: [
          { required: true, message: "请输入经办人证件号", trigger: "blur" }
        ],
        manager_effectivetime: [
          { required: true, message: "请输入经办人证件有效期", trigger: "blur" }
        ],
        manager_mobile: [
          { required: true, message: "请输入经办人联系方式", trigger: "blur" },
          { min: 11, max: 11, message: "长度是11个字符", trigger: "blur" }
        ],
        manager_email: [
          { required: true, message: "请输入经办人工作邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        businesslicense: [
          { required: true, message: "请上传营业执照", trigger: "blur" }
        ],
        paperwork_photo: [
          { required: true, message: "请上传法人证件证照", trigger: "blur" }
        ],
        manager_photo: [
          { required: true, message: "请上传经办人证件证照", trigger: "blur" }
        ],
        manager_name: [
          { required: true, message: "请输入经办人姓名", trigger: "blur" }
        ]
      },
      fieldRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
        // ,
        // captcha: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
      checked: true,
      customer_type_options: [],
      paperwork_type_options: [],
      trade_type_options: []
    };
  },
  methods: {
    adddriverChid: function(data) {
      console.log("ssssssssss");
    },

    login() {
      this.loading = true;
      let userInfo = {
        account: this.loginForm.account,
        password: this.loginForm.password,
        captcha: this.loginForm.captcha
      };
      this.$api.login
        .login(userInfo)
        .then(res => {
          if (res.msg != null) {
            this.$message({
              message: res.msg,
              type: "error"
            });
          } else {
            Cookies.set("token", res.data.token); // 放置token到Cookie
            sessionStorage.setItem("user", userInfo.account); // 保存用户到本地会话
            this.$store.commit("menuRouteLoaded", false); // 要求重新加载导航菜单
            this.$router.push("/"); // 登录成功，跳转到主页
          }
          this.loading = false;
        })
        .catch(res => {
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    refreshCaptcha: function() {
      this.loginForm.src =
        this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    },
    // 编辑
    submitForm: function() {
      //  if ($(".el-checkbox input[type='checkbox']").is(':checked') == false) {
      //     this.$message({message: '请阅读并勾选《开通业务协议》, ', type: 'error'});return;
      //   }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "wcustomer";
            // params.document_license=this.ImageUrl;
            this.utils.request.editCustomerInfo(params, this.editInfoBack);
          });
        }
      });
    }, // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功,请等待审核", type: "success" });
        this.$router.push("/");
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
    },
    Jump() {
      this.$router.go(-1);
    },
    reset() {
      this.$refs.loginForm.resetFields();
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit("setThemeColor", themeColor);
    },
    //图片移除
    handleRemove(file, fileList) {
      this.fileList = fileList;
      if (fileList.length == 0) {
        this.dataForm.businesslicense = "";
      } else {
        this.imgs = fileList.map(item => item.response.data.imgUrl).toString();
        this.dataForm.businesslicense = this.imgs;
      }
      console.log(this.dataForm.businesslicense);
    },
    handleRemove1(file, fileList) {
      this.fileList = fileList;
      if (fileList.length == 0) {
        this.dataForm.paperwork_photo = "";
      } else {
        this.imgs1 = fileList.map(item => item.response.data.imgUrl).toString();
        this.dataForm.paperwork_photo = this.imgs1;
      }
      console.log(this.dataForm.paperwork_photo);
    },
    handleRemove2(file, fileList) {
      this.fileList = fileList;
      if (fileList.length == 0) {
        this.dataForm.manager_photo = "";
      } else {
        this.imgs2 = fileList.map(item => item.response.data.imgUrl).toString();
        this.dataForm.manager_photo = this.imgs2;
      }
      console.log(this.dataForm.manager_photo);
    },
    //处理图片卡预览
    handlePictureCardPreview(res, file) {
      this.dialogImageUrl = file.url;
      this.ImageUrl = file.url;
      this.dialogVisibleImage = true;
    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      if (res.data.imgUrl == "") {
        this.$message({ message: "上传失败", type: "error" });
      } else {
        this.dataForm.businesslicense += res.data.imgUrl + ",";
        console.log(this.dataForm.businesslicense);
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    handleAvatarSuccess1(res, file) {
      if (res.data.imgUrl == "") {
        this.$message({ message: "上传失败", type: "error" });
      } else {
        this.dataForm.paperwork_photo += res.data.imgUrl + ",";
        console.log(this.dataForm.paperwork_photo);
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    handleAvatarSuccess2(res, file) {
      if (res.data.imgUrl == "") {
        this.$message({ message: "上传失败", type: "error" });
      } else {
        this.dataForm.manager_photo += res.data.imgUrl + ",";
        console.log(this.dataForm.manager_photo);
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    initSysConfig() {
      var params = {};
      params.t = "sysConfig";
      params.type = "customer_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.customer_type_options = res.data;
      });

      params.type = "paperwork_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.paperwork_type_options = res.data;
      });

      params.type = "trade_type";
      this.utils.request.queryUserList(params, res => {
        $.each(res.data, function(key, value) {
          value.key = Number(value.key);
        });
        this.trade_type_options = res.data;
      });
    },
    restForm() {
      this.$refs["dataForm"].resetFields();
      this.dataForm = {};
    }
  },
  mounted() {
    this.refreshCaptcha();
    this.initSysConfig();
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor
    })
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
<style  scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>