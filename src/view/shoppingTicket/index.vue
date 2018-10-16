<template>
  <div class='content_data shoppingTicket'>
    <Breadcrumb/>
    <div class="titleBox">
      <div class="content-title">购物券设置</div>
    </div>
    <div class="main">
      <div class="ticket">
            <span style="display:inline-block;width:200px;">购物券自动发放比例:</span>
            <span style="display:inline-block;width:120px;">{{tiketNum}}%</span>
            <el-button type="primary" @click="edit">设置</el-button>
          </div>  
    </div>
    <el-dialog title="" :visible.sync="show" :modalAppendToBody="false" width="600px"  @close="cancell">
            <el-form :model="dialog" :rules="rules" ref="ruleForm" labelWidth="150px" @submit.native.prevent>
              <el-form-item label="购物券自动发放比例" prop="number">
                <el-input-number :min="0" :max="100" style="width:150px;"  v-model="dialog.number"/>
                <span>&nbsp;&nbsp;%</span>
              </el-form-item>
            </el-form>
            <div slot="footer" class="text-center">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="submit">确认</el-button>
            </div>
          </el-dialog> 
  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
import {postticketNumber,showticketNumber} from '../../api/couponManage.js'
export default {
  name: 'shoppingTicket',
  components: {
    Breadcrumb
  },
  data () {
    return {
      dialog: {
        number: null,
      },
      show: false,
      tiketNum:null,
      rules: {
        number: [
                { required: true, message: '不能为空', trigger: 'blur'},
                {pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '最多保留两位小数', trigger: 'blur' },
                ]
            },
      }
  },
  created () {
    this.init()
  },
  methods: {
    init(){
      showticketNumber('COUPON_RATIO_GOODS').then((res)=>{
          this.tiketNum = (res*100).toFixed(2)
        })
    },
    // 设置
    edit(){
      this.dialog.number = this.tiketNum
      this.show = true
    },
   cancell() {
        this.$refs.ruleForm.clearValidate()
     },
    submit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
        postticketNumber('COUPON_RATIO_GOODS',this.dialog.number/100).then((res)=>{
          this.$message({
              type: 'success',
              message: '设置成功!'
            });
          this.init()
        })
        this.show = false
      } else {
            return false
        }
      })
    },
   cancel(){
    this.show = false
   }    
  },
}
</script>
<style lang='less' scoped>
.shoppingTicket{
  .titleBox {
      position: relative;
    }
  .main{
    background-color: #fff;
    .setting{
      line-height: 70px;
      height: 70px;
      padding-left: 26px;
      font-size: 22px;
      color: #495869;
    }
    .ticket{
      padding:50px 0px 50px 50px;
      >span{
        font-size: 18px;
      }
    }
  }
}
</style>