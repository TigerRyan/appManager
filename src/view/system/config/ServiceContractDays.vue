<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data serviceContractDays">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="200px">
        <el-form-item label="服务商合约周期（月）：" prop="val">
          <el-input-number v-model="data.val" placeholder="请输入服务商合约周期..." :step="1" :min="0" :disabled='disabled'/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">自合同签到之后生效，默认 36</el-tag>
        </el-form-item>
        <el-button type="primary" @click="submit" :disabled='disabled'>设置</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getManageUpdateApi,manageApi} from '../../../api/systemApi'
  import {success, error} from '../../../actions'

  export default {
    name: 'serviceContractDays',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled:false,
        data: {val: ''},
        rules: {
          val: [{required: true, type: 'number', message: '请输入服务商合约周期...', trigger: 'blur'}, {type: 'number', min: 0, message: '必须为大于0的数...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            manageApi(this.data.val).then(data => {
              success('服务商合约周期设置成功！')
            }).catch(() => error('服务商合约周期设置失败！'))
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

      getManageUpdateApi().then((val) => {
        this.data.val = val || 0
      })
    },
  }
</script>
