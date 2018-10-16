<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data VideoSettlementDays">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="250px">
        <el-form-item prop="val" label="视频课程结算周期（天）：" >
          <el-input-number v-model="data.val" placeholder="视频课程结算周期..." :step="1" :min="0" :disabled="disabled"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">视频课程结算周期，以天为单位，最少设置为30天</el-tag>
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
    name: 'VideoSettlementDays',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled: false,
        radio: '1',
        data: {key: 'VIDEO_SETTLEMENT_DAYS', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '视频课程结算周期...', trigger: 'blur'}, {type: 'number', min: 30, message: '必须为大于等于30的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('视频课程结算周期设置成功！')).catch(() => error('视频课程结算周期设置失败！'))
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
