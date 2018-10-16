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
        <el-form-item label="积分基数：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入积分基数..." :step="1" :min="1" :disabled="disabled"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">积分基数是一个大于1的整数，每邀请一个人，就增加（积分基数）的积分</el-tag>
        </el-form-item>
        <el-button type="primary" @click="submit" :disabled="disabled">设置</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getConfigApi, putConfigApi} from '../../../api/systemApi'
  import {success, error} from '../../../actions'

  export default {
    name: 'integral-base-config',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        data: {key: 'INTEGRAL_BASE', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入积分基数...', trigger: 'blur'}, {pattern: /^\d+$/, message: '必须为大于1的整数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('积分基数设置成功！')).catch(() => error('积分基数设置失败！'))
          } else {
            return false
          }
        })
      },
    },
    created() {
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
      getConfigApi(this.data.key).then((val) => {
        this.data.val = val || 0
      })
    },
  }
</script>
