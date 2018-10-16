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
        <el-form-item label="APP域名：" prop="val">
          <el-input v-model="data.val" placeholder="请输入APP域名..."/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">APP域名需要保证正确，以https://开始的有效访问域名！</el-tag>
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
    name: 'domain-config',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        data: {key: 'ad5f82e879a9c5d6b5b442eb37e50551', val: ''},
        rules: {
          val: [{required: true, message: '请输入APP域名...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('APP域名设置成功！')).catch(() => error('APP域名设置失败！'))
          } else {
            return false
          }
        })
      },
    },
    created() {
      getConfigApi(this.data.key).then((val) => {
        this.data.val = val || ''
      })
    },
  }
</script>
