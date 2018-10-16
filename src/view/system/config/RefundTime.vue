<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data refundTime">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="200px">
        <!--<el-form-item label="退款时间" prop="val">-->
        <!--</el-form-item>-->
        <el-form-item prop="val" label="退款时间：" >
          <el-input-number v-model="data.val" placeholder="退款时间..." :step="1" :min="0"/>
          <span style="margin-left: 10px;color:#606266">单位：小时</span>
        </el-form-item>
        <!--<el-form-item prop="val" label="预约线下课程退款时间：" >-->
          <!--<el-input-number v-model="data.val1" placeholder="退款时间..." :step="1" :min="0"/>-->
          <!--<span style="margin-left: 10px">单位：小时</span>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-tag type="danger">申请预约老师（课程）退款，距离教师开课最短时间设置，按小时为单位</el-tag>
        </el-form-item>
        <el-button type="primary" @click="submit">设置</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getConfigApi, putConfigApi} from '../../../api/systemApi'
  import {success, error} from '../../../actions'

  export default {
    name: 'refundTime',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        radio:'1',
        data: {key: 'RefundTime', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入预约老师退款时间...', trigger: 'blur'}, {type: 'number', min: 0, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('退款时间设置成功！')).catch(() => error('退款时间设置失败！'))
          } else {
            return false
          }
        })
      },
    },
    created() {
      getConfigApi(this.data.key).then((val) => {
        this.data.val = val || 0
      })
    },
  }
</script>
