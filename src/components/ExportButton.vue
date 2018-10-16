<style lang="less" scoped>
  @import "../base.less";

  .ExportButton {
    float: right;
    margin: @table-head-margin;
    .download {
      text-align: center;
      padding: 15px;
    }
    .el-range-editor.el-input__inner {
      border: 1px solid #ccc;
    }
    .text-center {
      padding: 20px 0;
    }
    .downloadBtn {
      width: 80px;
      height: 40px;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
      background: #51c5ff;
      display: inline-block;
      color: #fff;
    }
  }
</style>
<template>
  <div class="ExportButton">
    <el-button type="edit" @click="showDialog">{{text}}</el-button>
    <el-dialog :title="text" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <!-- :showClose='false' -->
      <el-form :model="dialog" labelWidth="100px">
        <el-form-item label="导出时间选择">
          <el-date-picker :value="[dialog.start,dialog.end]" v-model="tiemValue"  type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="center" @change="selectTime" :clearable=false />
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="doMethod" :disabled="dialog.disabled">确定导出</el-button>
        <el-button type="warning" @click="dialog.show = false">取消导出</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="text" :visible.sync="download.show" :modalAppendToBody="false" width="450px">
      <span>{{download.content}}</span>
      <div class="download">
        <a :href="download.url" @click="download.show = false" v-if="!!download.url" class="downloadBtn">下载</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'ExportButton',
    props: {
      text: {
        type: String,
        default: '导出EXCEL',
      },
      method: Function,
    },
    data() {
      return {
        dialog: {show: false, start: null, end: null, disabled: true},
        download: {show: false, content: '正在生成文件导出中...请耐心等待...', url: null},
        tiemValue: []
      }
    },
    computed: {
      pickerOptions() {
        return {disabledDate: (time) => time.getTime() > Date.now()}
      },
    },
    methods: {
      selectTime() {
        if (this.tiemValue && this.tiemValue.length>1) {
          this.dialog.start = this.tiemValue[0].getTime()
          this.dialog.end = this.tiemValue[1].getTime()
        }
        this.dialog.disabled = (this.dialog.start && this.dialog.end) ? false: true
        if (this.dialog.end - this.dialog.start > 3600000 * 24 * 6) {
          this.$message({type: 'warning', message: '导出7天以上的数据,有可能会导致服务器崩溃哦~~'});
        }
         console.log(this.dialog.start,this.dialog.end)
      },
      //确定导出
      doMethod() {
        this.dialog.show = false
        this.download.show = true
        this.method && this.method(this.dialog).then((url) => {
           console.log(url)
          this.download.content = '文件生成完成！请点击下载...'
          this.download.url = url
        })
      },
      showDialog() {
        this.tiemValue=[]
        this.dialog = {show: true, start: null, end: null,disabled:true}
      },
    },
  }
</script>

