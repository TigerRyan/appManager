<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data institutionRatio">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="140px">
        <el-form-item label="机构分成比例：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入机构分成比例..." :step="0.01" :min="0" :max="0.99" :disabled="disabled"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">机构分成比例是一个大于0小于1的数，按照百分比进行换算，默认0.05</el-tag>
        </el-form-item>
        <el-button :disabled="disabled" type="primary" @click="submit">设置</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getConfigApi, putConfigApi} from '../../../api/systemApi'
  import {success, error} from '../../../actions'

  export default {
    name: 'institutionRatio',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled: false,
        data: {key: 'OPEN_MECHANISM_DAYS', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '机构分成比例...', trigger: 'blur'}, {type: 'number', min: 0, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('机构分成比例设置成功！')).catch(() => error('机构分成比例设置失败！'))
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
        console.log(this.data.val)
      })
    },
  }
</script>
