<template>
  <div class="content_data set_extract">
    <Breadcrumb/>
    <div>
      <ul class="content_data_title">
        <li v-for="(item, index) in listTab" :class="{blue:status == item.pid}" @click="redBill(item.pid)" :key="index">{{item.name}}</li>
      </ul>
      <div class='condition' >{{text}}</div>
      <div class='form'>
        <el-form :inline="true" :model="formData" :rules="rules" ref='form' class="demo-form-inline" label-position='left'>
          <el-form-item label="设置类型" v-if='status==1||status==2'>
            <el-radio-group v-model="type" @change='changeType'>
              <el-radio :label="1">总额度设置</el-radio>
              <el-radio :label="2">免费额度设置</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提现限制周期" prop="period">
            <el-select v-model="formData.period" placeholder="请选择周期单位" :disabled='disabled'>
              <el-option label="每天" :value="1"></el-option>
              <el-option label="每周" :value="2"></el-option>
              <el-option label="每月" :value="3"></el-option>
              <el-option label="每季度" :value="4"></el-option>
              <el-option label="每年" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="['学生','教师','机构','服务商'][status-1]+'提现'+['总','免费'][type-1]+'额度限制(元)'" prop="sum">
            <el-input v-model="formData.sum" placeholder="额度限制"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain  @click="onNoRestrict">设定不限制</el-button>
            <el-button type="primary" @click="onRestrict">设置</el-button>
          </el-form-item>
        </el-form>
      </div>
      </div>
    </div>
</template>

<script>
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import {getConfigApi, putConfigApi2} from '../../../api/systemApi'
  import {success, error} from '../../../actions'
  export default {
    name: 'setExtract',
    components: { Breadcrumb},
    data() {
      return {
        status:1,              //tab切换
        text:null,            //状态文字
        disabled:true,        //下拉框禁用
        listTab: [{pid: 1, name: '学生'}, {pid:2, name: '教师'}, {pid: 3, name: '机构'}, {pid: 4, name: '服务商'}],
        type:1,              //学生和老师时设置类型
        formData: { 
           sum: null,        //设置金额
           period:1          //周期
        },
        key:'STUDENT_CASH_TOTAL_LIMIT_DAY',
        /* data:[
          {key: 'STUDENT_CASH_TOTAL_LIMIT_DAY'}, //学生提现总额度
          {key: 'STUDENT_CASH_FREE_LIMIT_MONTH'}, //学生提现免费额度
          {key: 'TEACHER_CASH_TOTAL_LIMIT_DAY'},  // 教师提现总额度
          {key: 'TEACHER_CASH_FREE_LIMIT_MONTH'},  //教师提现免费额度
          {key: 'MECHANISM_CASH_TOTAL_LIMIT_DAY'}, //机构提现总额度
          {key: 'SERVICE_CASH_TOTAL_LIMIT_DAY'}   //服务商提现总额度
          ] , */
        rules: {
          sum: [ {required: true, message: '请输入正整数金额', trigger: 'blur'},{pattern: /^[1-9]\d*$/, message: '金额为正整', trigger: 'blur' },],
          period: [{required: true, message: '请选择周期', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getData()
    },
    methods: {
      // tab切换
      redBill(id) {
        this.status = id
        this.formData.sum = null
        this.$refs.form.clearValidate()
        if(id==3||id==4){
          this.disabled = true
          this.formData.period = 1
          this.type = 1
        }else{
          this.changeType()
        }
        this.getKey()
        this.getData()
      },
      //总金额和免费金额切换
      changeType(){
        this.$refs.form.clearValidate()
        this.formData.sum = null
        if(this.type==1 ){
          this.formData.period = 1
          this.disabled = true
        }else if(this.type==2){
          this.formData.period = 3
          this.disabled = true
        }
        this.getKey()
        this.getData()
      },
      //回填之前设置数据
      getData(){
        getConfigApi(this.key).then((data) => {
          if(this.status <= 2){
            if(data&&data.status&&data!=999999999){
              this.formData.sum = data.val 
              this.text = '已限制'
            }else{
               this.text = '未限制'
               this.formData.sum = null
            }
          }else{
            if(data&&data!=999999999){
              this.formData.sum = data
              this.text = '已限制'
            }else{
               this.text = '未限制'
               this.formData.sum = null
            }
          }
          
          //this.text = this.formData.sum? '已限制':'未限制'
        })
      },
      // 切换时 对应的key身份
      getKey(){
        if(this.status==1){
          if(this.type==1){
            this.key = 'STUDENT_CASH_TOTAL_LIMIT_DAY'
          }else{
            this.key='STUDENT_CASH_FREE_LIMIT_MONTH'
          }
        }else if(this.status==2){
          if(this.type==1){
            this.key = 'TEACHER_CASH_TOTAL_LIMIT_DAY'
          }else{
            this.key='TEACHER_CASH_FREE_LIMIT_MONTH'
          }
        }else if(this.status==3){
          this.key = 'MECHANISM_CASH_TOTAL_LIMIT_DAY'
        }else if(this.status==4){
          this.key = 'SERVICE_CASH_TOTAL_LIMIT_DAY'
        }
      },
      //不设限制
      onNoRestrict(){
        
        this.$confirm(`一旦`+['学生','教师','机构','服务商'][this.status-1] +`提现`+['总','免费'][this.type-1]+`额度设定为不限制，则可以提现全部可用余额`, '请确定是否设置为不限制？',
          {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true})
          .then(() => {
           // console.log(this.key)
           // console.log(this.formData.sum)
            this.formData.sum = 999999999
            putConfigApi2({key:this.key,val:this.formData.sum, status:0, type: this.status}).then(() => {
              success('设置成功')
              if(this.formData.sum!=999999999){
                this.text = '已限制'
              }else{
                this.text = '未限制'
                this.formData.sum = null
              }
             // this.text = this.formData.sum? '已限制':'未限制'
            }).catch(() => error('设置失败'))
          })
          .catch(() => {  
        }); 
      },
      //设限制
      onRestrict(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm(`您设置的是`+['学生','教师','机构','服务商'][this.status-1] +['每天','每周','每月','每季度','每年'][this.formData.period-1]+`限制`+['总','免费'][this.type-1]+`提现金额为`+this.formData.sum +`元，确定这样操作？`,
              {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true})
              .then(() => {
               // console.log(this.key)
               // console.log(this.formData.sum)
                putConfigApi2({key:this.key,val:this.formData.sum,status:1,type: this.status})
                .then(() => {
                  success('设置成功')
                  if(this.formData.sum!=999999999){
                    this.text = '已限制'
                  }else{
                    this.text = '未限制'
                    this.formData.sum = null
                  }
                  //this.text = this.formData.sum? '已限制':'未限制'
                })
                .catch(() => error('设置失败'))
                })
              .catch(() => {
            });
          } else {
            return false
          }
        })  
      }
    },
  }
</script>
<style lang="less" scoped>
  .set_extract{
    .content_data_title {
      height: 70px;
      line-height: 70px;
      background-color: #fff;
      margin-bottom: 20px;
      padding-left: 30px;
      font-size: 20px;
      list-style: none;
      // color: #51c5ff;
      li {
        float: left;
        margin: 0 17px;
        color: #495869;
        cursor: pointer;
        &.ExportButton {
          float: right;
        }
      }
      .blue {
        color: #51c5ff;
        border-bottom: 3px solid #51c5ff;
      }
    }
    .form{
      padding-left:50px;
      background:#fff;
      padding-top:50px;
      padding-bottom:50px;
    }
    .condition{
      background: cyan;
      width:80px;
      height:80px;
      line-height: 80px;
      text-align: center;
      border-radius: 50%;
      position: absolute;
      right:200px;
      top:250px;
      
    }
  }
</style>
<style lang="less">
  .set_extract{
    .el-form--inline .el-form-item{
      display: block;
    }
  }
</style>


