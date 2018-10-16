<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data studentCashCharge">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="200px">
        <el-form-item label="学生提现手续费（比例）：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入提现手续费..." :step="0.01" :min="0" :max="0.99" :disabled='disabled'/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">单笔提现需要缴纳的手续费，建议比例大于 0 小于 1</el-tag>
        </el-form-item>
        <el-button type="primary" @click="submit" :disabled='disabled'>设置</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getConfigApi, putConfigApi} from '../../../api/systemApi'
  import {success, error} from '../../../actions'

  export default {
    name: 'studentCashCharge',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled:false,
        data: {key: 'STUDENTRATE', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入提现手续费...', trigger: 'blur'}, {type: 'number', min: 0, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('提现手续费设置成功！')).catch(() => error('提现手续费设置失败！'))
          } else {
            return false
          }
        })
      },
    },
    created() {
        // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false

      getConfigApi(this.data.key).then((val) => {
        this.data.val = val || 0
      })
    },
  }
</script>
