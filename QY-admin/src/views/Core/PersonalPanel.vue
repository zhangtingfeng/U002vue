<template>
  <div class="personal-panel">
    <div class="personal-desc" :style="{'background':this.$store.state.app.themeColor}">
        <div class="avatar-container">
          <!-- <img class="avatar" :src="require('@/assets/user.png')" /> -->
        </div>
         <div class="name-role">
          <span class="sender">用户名: {{ user_info.username  }}</span>
        </div>
         <div class="name-role">
          <span class="sender">手机号: {{ user_info.moile  }}</span>
        </div>

        <div class="registe-info">
          <span class="registe-info">
            <li class="fa fa-clock-o"></li>
               注册时间：{{ user_info.create_time }}
          </span>
        </div>
    </div>
    <!-- <div class="personal-relation">
        <span class="relation-item">followers</span>
        <span class="relation-item">watches</span>
        <span class="relation-item">friends</span>
    </div> -->
    <!-- <div class="main-operation">
        <span class="main-operation-item">
          <el-button size="small" icon="fa fa-male"> 个人中心</el-button>
        </span>
        <span class="main-operation-item">
          <el-button size="small" icon="fa fa-key"> 修改密码</el-button>
        </span>
    </div> -->
    <!-- <div class="other-operation">
        <div class="other-operation-item">
          <li class="fa fa-eraser"></li>
          清除缓存
        </div>
        <div class="other-operation-item">
          <li class="fa fa-user"></li>
          在线人数
        </div>
        <div class="other-operation-item">
          <li class="fa fa-bell"></li>
          访问次数
        </div>

    </div> -->
    <div class="personal-footer" @click="logout">
      <li class="fa fa-sign-out"></li>
      {{$t("common.logout")}}
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie"
export default {
  name: 'PersonalPanel',
  components:{

  },
  props: {
    user: {
      type: Object,
      default: {
        name: "admin111",
        avatar: "@/assets/user.png",
        role: "超级管理员",
        registeInfo: "注册时间：2018-12-25 "
      }
    }
  },
  data() {
    return {
      user_info:{
         create_time:"",
         moile:"",
         number:"",
         rolename:"",
         deptname:"",
         username:""
      }
    }
  },
  methods: {
    // 退出登录
    logout: function() {

      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      }).then(() => {
        sessionStorage.removeItem("user")
        this.deleteCookie("token")

        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('isLogin');
        this.$router.push("/login")

      })
      .catch(() => {
      })
    },
    // 删除cookie
    deleteCookie: function(name) {
        Cookies.remove(name)
    },
    // 打开备份还原界面
    showBackupDialog: function() {
      this.$refs.backupDialog.setBackupVisible(true)
    },
    // 成功还原之后，重新登录
    afterRestore: function() {
        this.$refs.backupDialog.setBackupVisible(false)
        sessionStorage.removeItem("user")
        this.deleteCookie("token")
        this.$router.push("/login")
        this.$api.login.logout().then((res) => {
          }).catch(function(res) {
        })
    },
    getUserInfo:function(){

      let filters = {
          account: localStorage.getItem("user"),
          t: "sysUser"
      }

      this.utils.request.queryUserInfo(filters,(res) => {
          if(res.data){
               this.user_info.create_time = res.data.create_time;
               this.user_info.moile = res.data.moile;
               this.user_info.number = res.data.number;
               this.user_info.rolename = res.data.rolename;
               this.user_info.deptname = res.data.deptname;
               this.user_info.username = res.data.username;

              console.log(this.user_info)
          }

      });

    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  width: 280px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;

  margin: -14px;
}
.personal-desc {
  padding: 15px;
  color: #fff;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 90px;
}
.name-role {
  font-size: 16px;
  padding: 5px;
}
.personal-relation {
  font-size: 16px;
  padding: 12px;
  margin-right: 1px;
  background: rgba(200, 209, 204, 0.3);
}
.relation-item {
  padding: 12px;
}
.relation-item:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
}
.main-operation {
  padding: 8px;
  margin-right: 1px;
  /* background: rgba(175, 182, 179, 0.3); */
  border-color: rgba(201, 206, 206, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.main-operation-item {
  margin: 15px;
}
.other-operation {
  padding: 15px;
  margin-right: 1px;
  text-align: left;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.other-operation-item {
  padding: 12px;
}

.other-operation-item:hover {
  cursor: pointer;
  background: #9e94941e;
  color: rgb(19, 138, 156);
}

.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  background: rgba(247, 196, 13, 0.9);
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.personal-footer:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
  background: #b1a6a61e;
}
</style>
