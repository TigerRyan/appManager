<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data shareCourseConfig">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="200px">
        <el-form-item label="拼课人数上限设置(人)：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入拼课人数上限..." :step="1" :min="0" :disabled="disabled"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">拼课人数上限，包括设置的人数</el-tag>
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
    name: 'shareCourseConfig',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled:　false,
        data: {key: 'COLLAGE_LIMIT', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '请输入课时费...', trigger: 'blur'}, {type: 'number', min: 0.01, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('拼课人数上限设置成功！')).catch(() => error('拼课人数上限设置失败！'))
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