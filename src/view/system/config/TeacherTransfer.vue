<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data teacherTransfer">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="200px">
        <el-form-item label="教师转账额度限制（元）：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入提现额度..." :step="1" :min="0"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger"> 单笔转账额度不得低于此数字，默认 200</el-tag>
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
    name: 'teacherTransfer',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        data: {key: 'TeacherTransfer', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入提现额度...', trigger: 'blur'}, {type: 'number', min: 200, message: '必须为大于200的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('提现额度设置成功！')).catch(() => error('提现额度设置失败！'))
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
