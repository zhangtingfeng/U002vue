import axios from 'axios'
import qs from 'qs'
import router from '../../router'
import { Message } from 'element-ui'

//const host = 'http://localhost:38030/jfc-shop/';
//const host = 'https://api.vip.eggsoft.cn/jfc-shop/';
const host = 'http://api.qy.eggsoft.cn/jfc-shop/';
const PIC_URL_PRE = 'F:/usr/local/static/imgs';

export default {
  request: {
    requestUrl(data, url, callback) {
      var params = {};
      params = {
        'loginChannel': 'pc',
        'token': localStorage.getItem('token'),
        'sign': 'qazwsxedc'
      }
      if (data != null && data != '') {
        for (var key in data) {
          if (data[key] == null || data[key] == undefined || (jQuery.type(data[key]) === "string" && data[key] == "")) {

          } else {
            params[key] = data[key];
          }

        }
      }

      url = host + url;
      axios.post(url, qs.stringify(params)).then(rsp => {


        if (rsp.data.code == "4000") {
          Message.error({//弹窗使用方法
            showClose: true,
            duration: 2000,  //警告的消息3秒钟后消失
            message: "登录失效，请重新登录",
          });


          setTimeout(function () {
            localStorage.removeItem('token');
            router.push("/login");
          }, 3000);

        } else {
          callback(rsp.data);
        }


      }).catch(error => {
        var data = {};
        data.code = '9999';
        data.msg = error.message;
        callback(data);
      });
    },

    getVtoken(data, callback) {
      this.requestUrl(data, 'suser/getVtoken', callback);
    },
    setShwoRoomShop(data, callback) {
      this.requestUrl(data, 'shop/setShwoRoomShop', callback);
    },
    //登录信息
    login(data, callback) {
      this.requestUrl(data, 'suser/login', callback)
    },
    findDeptTree(data, callback) {
      this.requestUrl(data, 'menu/findDeptTree', callback)
    },
    findProductTypeTree(data, callback) {
      this.requestUrl(data, 'menu/findProductTypeTree', callback)
    },
    selectDeptTree(data, callback) {
      this.requestUrl(data, 'menu/selectDeptTree', callback)
    },
    findNavTree(data, callback) {
      this.requestUrl(data, 'menu/findNavTree', callback)
    },
    findPermissions(data, callback) {
      this.requestUrl(data, 'menu/findPermissions', callback)
    },
    editUser(data, callback) {
      this.requestUrl(data, 'menu/editUser', callback)
    },
    editInfo(data, callback) {
      this.requestUrl(data, 'cmn/editInfo', callback)
    },
    editParmas(data, callback) {
      this.requestUrl(data, 'cmn/editParmas', callback)
    },
    queryUserList: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/queryList', callback);
    },
    checkShop: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/checkShop', callback);
    },
    checkShopDoorPlate: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/checkShopDoorPlate', callback);
    },
    queryUserPage: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/queryPage', callback);
    },
    queryForPage: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/queryForPage', callback);
    },
    queryUserInfo: function (data, callback) { // 通用 获取单个对象信息
      this.requestUrl(data, 'cmn/queryInfoRole', callback);
    },
    queryUserInfos: function (data, callback) { // 通用 获取单个对象信息
      this.requestUrl(data, 'cmn/queryInfoRole', callback);
    },

    deleteUserInfo: function (data, callback) { // 通用 删除信息
      this.requestUrl(data, 'cmn/deleteInfo', callback);
    },

    deleteSysCache: function (data, callback) { // 通用 清除参数配置缓存
      this.requestUrl(data, 'cmn/deleteSysCache', callback);
    },

    batchDeleteInfo: function (data, callback) { // 通用 批量删除信息
      this.requestUrl(data, 'cmn/batchDeleteInfo', callback);
    },
    doChecked: function (data, callback) { // 通用 批量删除信息
      this.requestUrl(data, 'checked/doChecked', callback);
    },
    queryProductType: function (data, callback) { // 通用 批量删除信息
      this.requestUrl(data, 'productType/queryProductType', callback);
    },
    findMenuTree: function (data, callback) {  //角色菜单查询
      this.requestUrl(data, 'menu/findMenuTree', callback);
    },
    deleteRoleByRoleId: function (data, callback) {  //删除角色
      this.requestUrl(data, 'role/deleteRoleByRoleId', callback);
    },
    saveRoleMenus: function (data, callback) {  //角色菜单新增
      this.requestUrl(data, 'role/saveRoleMenus', callback);
    },
    getTxVideoSign: function (data, callback) {
      this.requestUrl(data, 'cmn/getTxVideoSign', callback)//查询用户信息
    },
    editRole: function (data, callback) {  //修改角色
      this.requestUrl(data, 'menu/editRole', callback);
    },
    getTxVideoTaskInfo: function (data, callback) {
      this.requestUrl(data, 'cmn/getTxVideoTaskInfo', callback);
    },
    checkPhoneSystem() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        //这个是安卓操作系统
        return 'android'
      } else if (isIOS) {
        //这个是ios操作系统
        return 'ios'
      }
    }
  },
  dateTransion(date, type = 0) {
    let addZero = (p) => {
      if (p < 10) {
        return "0" + p
      } else {
        return p
      }
    }
    let y = date.getFullYear()
    let m = addZero(date.getMonth() + 1)
    let d = addZero(date.getDate())
    let time;
    if (type == 0) {
      time = `${y}年${m}月${d}日`
    } else if (type == 1) {
      time = `${y}-${m}-${d}`
    } else if (type == 2) {
      time = `${y}年${m}月`
    }
    return time;
  },
  defaultHead(event) {
    event.target.src = '/static/images/defaultHead.jpg'
  },
  getRequestParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  getHost() {
    return host;
  },
  getUpLoadHost() {
    return host + "cmn/imgUpload";
  },

  getVideoUpLoadHost() {
    return host + "cmn/videoUpload";
  },

  isNull(data) {
    if (data == undefined || data == null) {
      return true;
    }
    if (jQuery.type(data) === "string" && data == "") {
      return true;
    }

    return false;
  },

  getPicture(data) {

    if (this.isNull(PIC_URL_PRE)) {
      return data;
    }

    return PIC_URL_PRE + "/" + data;

  },



}
