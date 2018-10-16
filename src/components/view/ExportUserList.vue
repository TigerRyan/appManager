<style lang="less" scoped>
  @import "../../base.less";

  .ExportUserList {
    float: right;
    margin: @table-head-margin;
    .download {
      text-align: center;
      padding: 15px;
    }
    .el-checkbox {
      margin-left: 0;
      margin-right: 15px;
    }
    .el-range-editor.el-input__inner{
      border: 1px solid #ccc;
      border-radius: 25px;
    }
  }
</style>
<template>
  <div class="ExportUserList">
    <el-button type="export" @click="dialog.show = true">数据导出</el-button>
    <el-dialog title="会员信息导出" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px" @close="reset">
      <el-form :model="dialog" labelWidth="100px" ref="dialog">
        <el-form-item label="导出时间选择" prop="start">
          <el-date-picker :value="[dialog.start,dialog.end]" @input="dialog.start=$event[0].getTime();dialog.end=$event[1].getTime();" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="center"/>
        </el-form-item>
        <el-form-item label="选择导出信息" prop="filed">
          <el-checkbox-group v-model="dialog.filed">
            <el-checkbox label="1">姓名</el-checkbox>
            <el-checkbox label="2">手机号码</el-checkbox>
            <el-checkbox label="3">注册时间</el-checkbox>
            <!--<el-checkbox label="4">{{type == 2 ? '收入' : '消费'}}金额</el-checkbox>-->
            <!--<el-checkbox label="5">退款金额</el-checkbox>-->
            <!--<el-checkbox label="6">提现金额</el-checkbox>-->
            <!--<el-checkbox label="7">可提现金额</el-checkbox>-->
            <!--<el-checkbox label="8">不可提现金额</el-checkbox>-->
            <el-checkbox label="9">邀请码</el-checkbox>
            <el-checkbox label="10">受邀请码</el-checkbox>
            <el-checkbox label="11">积分</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="exportUserList">确定导出</el-button>
        <el-button type="warning" @click="dialog.show = false">取消导出</el-button>
      </div>
    </el-dialog>
    <el-dialog title="会员信息导出" :visible.sync="download.show" :modalAppendToBody="false" width="450px">
      <span>{{download.content}}</span>
      <div class="download">
        <a :href="download.url" @click="download.show = false" v-if="!!download.url">下载</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {exportUserListApi} from '../../api/userApi'

  export default {
    name: 'ExportUserList',
    props: {
      type: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        dialog: {show: false, start: null, end: null, filed: []},
        download: {show: false, content: '正在生成文件导出中...请耐心等待...', url: null},
        fileds: {
          1: '姓名@name@@4000',
          2: '手机号码@phone@@4000',
          3: '注册时间@createtime@datetime@6000',
          4: this.type === 2 ? '收入金额@earning@money@4000' : '消费金额@earning@money@4000',
          5: '退款金额@refund@money@4000',
          6: '提现金额@cash@money@4000',
          7: '可提现金额@money@money@4000',
          8: '不可提现金额@frozenMoney@money@4000',
          9: '邀请码@pid@@4000',
          10: '受邀请码@userPid@@4000',
          11: '积分@gral@num@4000',
        },
      }
    },
    computed: {
      pickerOptions() {
        return {disabledDate: (time) => time.getTime() > Date.now()}
      },
    },
    methods: {
      exportUserList() {
        if (this.dialog.filed.length==0) {
           this.$message({
              message: '请选择要导出的项',
              type: 'warning'
            });
            return
        }
        this.dialog.show = false
        this.download.show = true
        exportUserListApi({...this.dialog, filed: this.dialog.filed.sort().map(f => this.fileds[f]), type: this.type}).then((url) => {
          this.download.content = '文件生成完成！请点击下载...'
          this.download.url = url
        })
      },
      reset(){
        this.$refs.dialog.resetFields();
      }
    },
  }
</script>
