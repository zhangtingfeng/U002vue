<template>
  <div>
    <div style="float:left;color:red;width:120px" v-if="showWarnInfo">(检验报告、送货单、采购订单等相关单据照片或扫描件)</div>
    <div style="float: left;height:160px;max-width:500px;overflow: auto;text-align: left;">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          v-for="(file,index) in filelist"
          :key="index"
          :tabindex="index"
          class="el-upload-list__item is-success"
        >
          <img :src="file.url" alt class="el-upload-list__item-thumbnail" />
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <i class="el-icon-close"></i>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview">
              <i class="el-icon-zoom-in" @click="handlePictureCardPreview(file.url)"></i>
            </span>
            <span class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click="handleRemove(index)"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="handleDownload(file)">
              <i class="el-icon-download"></i>
            </span>
          </span>
        </li>
      </ul>
    </div>
    <div
      tabindex="0"
      style="float:left"
      class="el-upload el-upload--picture-card"
      @click="choseFile"
      v-if="showUpload"
    >
      <i class="el-icon-plus"></i>
      <input type="file" name="file" class="el-upload__input" />
    </div>

    <div
      style="color:red;height:150px;font-size:10px;vertical-align:bottom;display:table-cell; "
      v-if="showWarnInfo"
    >请务必上传清晰、准确的单据证照，否则责任自负</div>

    <el-upload
      :action="imgUpload"
      :on-success="handleAvatarSuccess"
      :show-file-list="false"
      :file-list="filelist"
      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
      :on-change="handleImgUploadChange"
      :before-upload="beforeAvatarUpload"
    >
      <el-button v-show="false" size="small" type="primary" :id="uploadButton"></el-button>
    </el-upload>
  </div>
</template>
<style>
</style>
<script>
export default {
  name: "ImgUpload",
  props: {
    filelist: Array, // 表格列配置
    uploadButton: {
      // 尺寸样式
      type: String,
      default: "mini"
    },
    showWarnInfo: {
      // 尺寸样式
      type: Boolean,
      default: false
    },
    showUpload: {
      // 尺寸样式
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      imgUpload: this.utils.getUpLoadHost(),
      dialogVisible: false,
      disabled: false
    };
  },
  mounted() { 
  },
  methods: {
    //删除
    handleRemove(index) {
      this.$emit("handleImgUploadRemove", { index: index });
    },
    //查看大图
    handlePictureCardPreview(url) {
      this.$emit("handlePictureCardPreview", { url: url });
    },
    //下载
    handleDownload(file) {
      var a = document.createElement("a");
      a.href = file.url;
      a.download = "";
      a.target = "_blank";
      a.click();
    },
    handleAvatarSuccess(res, file) {},
    handleImgUploadChange(file, fileList) {
      if (file.response != undefined && file.response != null) {
        let uid = file.uid;

        $.each(fileList, function(key, value) {
          if (uid == value.uid) {
            value.url = file.response.data.imgUrl;
          }
        });
        this.$emit("handleImgUploadChange", { filelist: fileList });
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    choseFile() {
      $("#" + this.uploadButton).click();
    }
  }
};
</script>