<style lang="less" scoped>
  .el-form {
    padding: 15px;
  }
</style>
<template>
  <div class="content_data VideoTeacher">
    <Breadcrumb/>
    <el-card>
      <el-form :model="data" :rules="rules" ref="data" labelWidth="250px">
        <el-form-item prop="val" label="视频教师分成比例" >
          <el-input-number v-model="data.val" placeholder="视频教师分成比例..." :step="0.1" :min="0" :disabled="disabled"/>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">教师分成比例是一个大于等于0小于1的数，按照百分比进行换算</el-tag>
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
    name: 'VideoTeacher',
    components: {
      Breadcrumb,
    },
    data() {
      return {
        disabled: false,
        radio: '1',
        data: {key: 'VIDEO_TEACHER_RATE', val: 0},
        rules: {
          val: [{required: true, type: 'number', message: '视频教师分成比例...', trigger: 'blur'}, {type: 'number', min: 0, message: '必须为大于等于0小于1的数...', trigger: 'blur'},
           {
            validator:(rule,value,callback)=>{
              if(this.data.val>=1){
                  callback(new Error("必须为小于1的数!"));
              }else{
                  callback()
                }
            }, trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      submit() {
        this.$refs.data.validate((valid) => {
          if (valid) {
            putConfigApi(this.data).then(() => success('视频教师分成比例设置成功！')).catch(() => error('视频教师分成比例设置失败！'))
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
