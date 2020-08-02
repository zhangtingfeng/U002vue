<template>
  <el-form
    :model="loginForm"
    :rules="fieldRules"
    ref="loginForm"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm login-container"
  >
    <span class="tool-bar">
      <!-- 主题切换 -->
      <theme-picker
        style="float:right;"
        class="theme-picker"
        :default="themeColor"
        @onThemeChange="onThemeChange"
      ></theme-picker>
      <!-- 语言切换 -->
      <!-- <lang-selector class="lang-selector"></lang-selector>    -->
    </span>
    <h2 class="title" style="padding-left:22px;">系统登录</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input
            type="test"
            v-model="loginForm.captcha"
            auto-complete="off"
            placeholder="验证码, 单击图片刷新"
            style="width: 100%;"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
      <el-button
        type="primary"
        style="width:48%;"
        @click.native.prevent="login"
        :loading="loading"
      >登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";
import ThemePicker from "@/components/ThemePicker";
import LangSelector from "@/components/LangSelector";
//导入通用的消息提示方法。
import * as messageUtil from "@/assets/js/messageUtil.js";

export default {
  name: "Login",
  components: {
    ThemePicker,
    LangSelector
  },
  data() {
    return {
      loading: false,
      loginForm: {
        account: "admin",
        password: "admin",
        captcha: "",
        src: ""
      },
      fieldRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
        // ,
        // captcha: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
      checked: true
    };
  },
  methods: {
    getToken() {
      this.utils.request.getVtoken({}, this.getVtokenResult);
    },

    getVtokenResult(data) {
      localStorage.setItem("vtoken", data.data);
      this.loginForm.src =
        this.utils.getHost() + "/suser/getLoginCode?vtoken=" + data.data;
    },
    login() {
      var this_ = this;
      var queryParam = {
        account: this.loginForm.account,
        password: this.loginForm.password,
        verifyCode: this.loginForm.captcha
      };

      if (this.utils.isNull(this.loginForm.account)) {
        return;
      }

      if (this.utils.isNull(this.loginForm.password)) {
        return;
      }

      if (this.utils.isNull(this.loginForm.captcha)) {
        return;
      }

      this.loading = true;

      queryParam.vtoken = localStorage.getItem("vtoken");
      this.utils.request.login(queryParam, function(response) {
        this_.loading = false;

        var message = response.msg;
        var code = response.code;

        if (code == "0000") {
          var data = response.data;

          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.id);
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("user", data.account);
          localStorage.setItem("login_shop_id", data.login_shop_id);

          if (data.customer != null && data.customer != "") {
            localStorage.setItem("customer_id", data.customer.id);
          }else{
            localStorage.removeItem("customer_id");
          }

          sessionStorage.setItem("user", data.account); // 保存用户到本地会话

          this_.$store.commit("menuRouteLoaded", false); // 要求重新加载导航菜单
          this_.$router.push("/"); // 登录成功，跳转到主页
        } else {
          messageUtil.showMessage(this_, "error", message);
        }
      });
    },
    refreshCaptcha: function() {
      this.loginForm.src =
        this.utils.getHost() +
        "suser/getLoginCode?vtoken=" +
        localStorage.getItem("vtoken") +
        "&data=" +
        new Date().getTime();
    },
    reset() {
      this.$refs.loginForm.resetFields();
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit("setThemeColor", themeColor);
    },
    keyupEnter() {
      document.onkeydown = e => {
        let body = document.getElementsByTagName("body")[0];
        if (e.keyCode === 13) {
          this.login();
        }
      };
    }
  },
  mounted() {
    this.getToken();
    this.keyupEnter();
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