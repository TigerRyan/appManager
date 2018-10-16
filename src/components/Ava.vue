<template>
    <div class="avatar_box" :style="{width:width+'px',height:height+'px'}" id="update1">
        <el-upload
            class="avatar-uploader"
            action="/"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="upload"
            :list-type="type"
            :on-success="successFun"
            drag
            :disabled='disabled'
        >
            <img v-if="url" :src="url" class="avatar" :style="{width:width+'px',height:height+'px'}">
            <!-- <img v-else="url" :src="defaultPic" class="avatar" :style="{width:width+'px',height:height+'px'}"> -->
          <i v-else class="el-icon-plus" :style="{width:width+'px',height:height+'px',lineHeight:height+'px'}"/>
          <div class="overspread"></div>
        </el-upload>
    </div>
</template>

<script>
import {upload, token} from '../api/systemApi'
import {warning} from '../actions'
import ajax from '../../src/api/ajax'

export default {
    data(){
        return{
           url:null,     
        }
    },
    props: {
        disabled:{
          // type: Boolean,
          default: '',
        },
        method: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '120',
        },
        height: {
            type: String,
            default: '120',
        },
        size: {
            type: Number,
            default: 1024 * 1024,
        },
        type: {
            type: String,
            default: 'picture',
        },
        isUrl:{
            type: String,
            default: 'kokoko',
        }

    },
    created(){   
    },
    updated(){
        this.url = this.isUrl
        console.log("ss") 
    },
    methods: {
        upload,
        successFun(data) {
            const addurl =`${token.path}${data.key}`
            // this.url = this.head+"/"+data.key
            
            this.$emit(this.method,addurl)
            this.url = addurl
        },

        beforeUpload(file) {
          // this.url=""
            if (this.type !== 'text' && file.size >= this.size) {
                warning(`图片大小不能超过 ${this.size / 1024 / 1024} M！请修改后重新上传！`)
                return false
            }
        },
    },
}
</script>
<style lang="less" scoped>
.avatar_box {
    line-height: normal;
    margin-bottom: 5px;
    position: relative;
    .avatar {
        img{
            width: 100%;
        }
    }
    .avatar-uploader {
        display: inline-block;
        border: 1px dashed #d9d9d9;
        height: 100%;
        width: 100%;
        &:hover {
            border-color: #20a0ff;
        }
    }
}
</style>
<style lang="less">
#update1{
  .el-upload--picture,.el-upload-dragger{
    height: 100%;
    width: 100%;
  }
  .el-upload{
    position: relative;
    .el-upload__input{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
    }
  }
}
</style>

