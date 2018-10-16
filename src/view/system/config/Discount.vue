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
        <el-form-item label="折扣：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入折扣..." :step="0.01" :min="0" :max="0.99" :disabled="disabled"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">折扣是一个小于1，大于0的小数，优惠价格为：原价*（1-折扣）</el-tag>
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
    name: 'discount-config',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled: false,
        data: {key: 'DISCOUNT', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入折扣...', trigger: 'blur'}, {type: 'number', min: 0, max: 1, message: '必须为大于0，小于1的小数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('折扣设置成功！')).catch(() => error('折扣设置失败！'))
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
