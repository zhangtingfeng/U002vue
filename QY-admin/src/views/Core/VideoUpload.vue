<template>
  <div>
    <el-upload
      class="upload-demo"
      
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="limit"
      :on-exceed="handleExceed"
      :file-list="filelist"
      accept="video/*"
      :on-change="handleImgUploadChange"
      :before-upload="beforeAvatarUpload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过100M</div>
    </el-upload>
  </div>
</template> 
<script>
import TcVod from 'vod-js-sdk-v6'
function getSignature() {
  var this_=this;
  this_.utils.request.getTxVideoSign({},function(resss){
      return resss.data;
  })
};
export default {
  name: "VideoUpload",
  props: {
    filelist: {
      // 尺寸样式
      type: Array,
      default: []
    },
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
      limit: 1,
      sign:'',
      imgUpload: this.utils.getVideoUpLoadHost()
    };
  },
  mounted() {
  },
  created(){
    // this.getSignature2();
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit("handleImgUploadRemove", { index: index });
    },
    handlePreview(file) {
      this.$emit("handlePictureCardPreview", { url: url });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ` +
          this.limit +
          `个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length +
            fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleImgUploadChange(file,fileList) {
      var this_=this;
      this.$emit("handleImgUploadChange", { filelist: fileList });
      
    },
    beforeAvatarUpload(file) {
      
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 100MB!");
      }
      return isLt2M;
    },
    getSignature2(){
      var this_=this;
      this_.utils.request.getTxVideoSign({},function(resss){
          this_.sign=resss.data;
          return resss.data;
      })
    }
  }
};
</script>