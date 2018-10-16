<style lang="less" scoped>
  @import "~video.js/dist/video-js.css";
  @import "~vue-video-player/src/custom-theme.css";

  .video-upload {
    line-height: normal;
    .video-uploader {
      .btn-box {
        text-align: left;
        padding: 5px 0;
        .progress {
          margin-top: 5px;
        }
      }
      &:hover {
        border-color: #20a0ff;
      }
    }
  }
</style>
<template>
  <div class="video-upload">
    <el-upload
      v-if="showUpload"
      class="video-uploader"
      action="/"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="upload"
      :on-progress="progress"
      listType="picture"
      :accept="accept"
      :on-success="success">
      <div class="btn-box">
        <el-button size="small" type="primary" :disabled="disabled">{{tipText}}</el-button>
        <el-progress :disabled="disabled" :text-inside="true" v-if="loaded > 0" class="progress" :stroke-width="18" :style="{width:width+'px'}" :percentage="loaded" :status="loaded>99?'success':''"></el-progress>
      </div>
    </el-upload>
    <div v-if="url" v-loading="loaded >0 && loaded<100" element-loading-text="上传中..." element-loading-spinner="el-icon-loading" element-loading-background="#000000" :style="{width:width+'px',height:height+'px'}">
      <video-player  class="vjs-custom-skin" ref="videoPlayer" @error="onError" :style="{width:width+'px',height:height+'px'}" :options="{sources:[{src:url || mediaUrl}],height:height,width:width}"></video-player>
    </div>
  </div>
</template>

<script>
  import {upload, token} from '../api/systemApi'
  import {warning, msg} from '../actions'
  import {videoPlayer} from 'vue-video-player'

  export default {
    components: {videoPlayer},
    data() {
      return {
        disabled: false,
        loaded: 0,
        timeStamp: 0,
        mediaUrl: '',
      }
    },
    props: {
      url: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '360',
      },
      height: {
        type: String,
        default: '240',
      },
      size: {
        type: Number,
        default: 1024 * 1024 * 500,
      },
      accept: {
        type: String,
        default: 'video/mp4',
      },
      showUpload: {
        type: Boolean,
        default: true,
      },
      tipText: {
        type: String,
        default: "点击上传"
      }
    },
    created(){
      console.log(222);
      
    },
    methods: {
      upload(data) {
        return upload(data, this.progress)
      },
      progress({total, loaded, timeStamp}) {
        this.timeStamp = timeStamp
        this.loaded = (loaded * 100 / total* 0.98) .toFixed(2)*1
      },
      success(data) {
        const url = `${token.path}${data.key}`
        this.mediaUrl = url
        this.$emit('success', url)
        this.loaded = 100
        this.disabled = false;
      },
      onError(player) {
        msg('视频错误，请重新上传！', 'error')
      },
      beforeUpload(file) {
        this.disabled = true;
        if (!new RegExp(this.accept).test(file.type)) {
          this.disabled = false;
          warning(`文件格式错误！请修改后重新上传！`)
          return false
        }
        if (file.size >= this.size) {
          this.disabled = false;
          warning(`文件大小不能超过 ${this.size / 1024 / 1024} M！请修改后重新上传！`)
          return false
        }
        return true
      },
      clearUrl(){
        this.mediaUrl=null
        this.loaded = 0
      }
    },
    watch:{
      url:function(newVal,oldVal){
      if(newVal==''){
        this.loaded = 0
      }
      }
    }
  }
</script>
