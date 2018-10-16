<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="100px">
        <el-form-item label="课时费：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入课时费..." :step="0.01" :min="0"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">课时费是一个大于0的两位小数，默认为200.00元</el-tag>
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
    name: 'pay_money-config',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        data: {key: 'PAY_MONEY', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入课时费...', trigger: 'blur'}, {type: 'number', min: 0.01, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('课时费设置成功！')).catch(() => error('课时费设置失败！'))
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
