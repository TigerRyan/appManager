<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data serviceRatio">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="150px">
        <el-form-item label="服务商分成比例：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入服务商分成比例..." :step="0.01" :min="0" :max="0.99" :disabled='disabled'/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">设置机构服务商在附属机构课程收入中的分成比例（分润比例）大于0小于1，默认0.05</el-tag>
        </el-form-item>
        <el-button type="primary" @click="submit" :disabled='disabled'>设置</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getManageApi,manageUpdateApi} from '../../../api/systemApi'
  import {success, error} from '../../../actions'

  export default {
    name: 'serviceRatio',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled:false,
        data:{val:''},
        rules: {
          val: [{required: true, type: 'number', message: '请输入服务商分成比例...', trigger: 'blur'}, {type: 'number', min: 0, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            manageUpdateApi(this.data.val).then(data =>{
              success('服务商分成比例设置成功！')
              console.log(data)
            }).catch(() => error('服务商分成比例设置失败！'))
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

      getManageApi().then(val => {
        console.log(val)
        this.data.val = val
      })
    },
  }
</script>
