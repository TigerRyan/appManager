<template>
	<div class="goodsDetail">
    <div class='title'>
      <i>{{['待支付','待发货','已发货','交易完成','退货待处理','已取消','订单关闭'][type]}}</i><span>订单状态：{{['待支付','待发货','待收货','已收货','退货/售后','订单关闭'][list.orderStatus]}}</span>
    </div>
    <div class='goodsInfo'>
      <h4>订单信息</h4>
      <ul>
        <li>订单号：{{list.orderNo}}</li>
        <li>下单时间: {{detailTimeFilter(0,0,list.createTime)}}</li>
        <li>付款时间：{{detailTimeFilter(0,0,list.payTime)}}</li>
      </ul>
      <dl>
        <dt><span>商品</span><span>商品属性</span><span>单价</span><span>数量</span><span>消耗积分</span><span v-if="this.type!=0">优惠券金额</span><span>商品总价</span></dt>
        <dd>
          <span>
            <img :src=list.goodsImg alt="">
            <em>{{list.goodsName}}</em>
          </span>
          <span>
            <p>颜色：{{list.subgoogsUnique}}</p>
          </span>
          <span>￥{{list.costPrice}}</span>
          <span>{{list.num}}</span>
          <span>{{list.integral}}</span>
          <span v-if="this.type!=0">{{list.couponMoney==0?'无':list.couponMoney}}</span>
          <span>￥{{list.marketPrice*list.num}}</span>
        </dd>
      </dl>
      <div class='gathering'>
        <p>实际收款：<em>￥{{list.payAmount}}</em></p>
        <el-button  round :disabled="disabled">{{['','微信','支付宝','余额支付'][list.payType]}}</el-button>
      </div>
    </div>
    <div class='studentsInfo'>
      <h4>买家信息</h4>
      <div>
        <div><img :src=list.userImg alt=""></div>
        <div>
          <ul>
            <li>{{list.userName?list.userName:"无"}}</li>
            <li>账户：{{list.userPhone?list.userPhone:"无"}}</li>
            <li>所在地区：{{list.userRegion?list.userRegion:"无"}}</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>收货人：{{buyerDetail.name}}</li>
            <li>电话：{{buyerDetail.mobile}}</li>
            <li>收货地址：{{buyerDetail.province+buyerDetail.city+buyerDetail.county+buyerDetail.details}}</li>
            <!-- <li>收货人：{{list.consigneeName?list.consigneeName:"无"}}</li>
            <li>电话：{{list.consigneeMobile?list.consigneeMobile:"无"}}</li>
            <li>收货地址：{{address?address:"无"}}</li> -->
          </ul>
        </div>
      </div>
    </div>
    <div class='expressInfo' v-if='list.orderStatus==2'>
      <div v-if='!list.expressNum'>
        <h4>物流信息</h4>
        <p>物流状态：待发货</p>
        <el-button type="primary" round @click='shipments' :disabled="disabled">发货</el-button>
      </div>
      <div  v-if='list.orderStatus==2||list.orderStatus==3'>
        <h4>物流信息</h4>
        <p>物流状态：已发货</p>
          <ul>
            <li>物流公司名称: {{list.expressName}}</li>
            <li>运单号：{{list.expressNum}}</li>
          </ul>
      </div>
    </div>
    <el-dialog title="物流信息" :visible.sync="dialogFormVisible" :modal-append-to-body="false" top='30vh' @close="closedia">
      <el-form :model="form" ref="ruleForm" :rules="rules">
          <el-form-item label="物流公司名称:" label-width="120px" prop="expressName" >  
              <el-input v-model="form.expressName" type="text"></el-input>
          </el-form-item>
          <el-form-item label="运单号:" label-width="120px"  prop="expressNum">
            <el-input v-model="form.expressNum"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible= false" round>取消</el-button>
        <el-button type="primary" @click="affirm" round>确定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import {shopOrderDetailApi,shipmentsApi} from '../../api/orderManagerApi'
import MyPagination from "../../components/MyPagination.vue";
import {detailTimeFilter} from '../../constant/filter'
import TablePage from "../../components/TablePage.vue";
export default {
  name: "goodsDetail",
  components: {
    MyPagination,
    TablePage,
    detailTimeFilter
  },
  data() {
    return {
      buyerDetail:{
        city:null,
        county:null,
        details:null,
       mobile:null,
       name:null,
       province:null,
      },
      refundId:null,
      disabled: false,
       type:null,
       form:{
         id:null,
         expressName:null,
         expressNum:null
       },
       dialogFormVisible: false,
       list:{},
      address:null,
      data: {
      list:[
         {
          orderNo: 201823716129287,
          createTime: 201823716129287,
          price: 612.00,
          num: 2,
          people: '张小萌',
          sprice: 1240.00,
          status: '代付款',
         },
        {
          orderNo: 201823716129287,
          createTime: 201823716129287,
          price: 612.00,
          num: 2,
          people: '张小萌',
          sprice: 1240.00,
          status: '代付款',
         },
      ]},
       rules:{
        expressName:[{required: true, message: '请输入物流公司名称...', trigger: 'blur'}],
        expressNum:[{required: true, message: '请输入运单号...', trigger: 'blur'},
         {pattern: /^\d+$/, message: '必须为大于或等于0的数字...', trigger: 'blur'}
        ]
      },
    }

  },
  created() {
    //获取订单详情列表
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
    this.form.id = Number(this.$route.query.id)
    this.type = this.$route.query.type
    if( this.type == 4 || this.type == 6){
        this.refundId = this.$route.query.refundId  
    }
    this.getData()
  },
  methods:{
    detailTimeFilter,
    getData(){
      shopOrderDetailApi({id:this.form.id,status:this.type*1,refundId:this.refundId}).then(data=>{
        console.log(data,"detail")
        this.list = data
        this.buyerDetail =JSON.parse(data.expressAddress ) 
        
        this.address=this.list.consigneeProvince+this.list.consigneeCity+this.list.consigneeDetails
      })
    },
    //填写运单号
    shipments(){
      this.dialogFormVisible = true
    },
    affirm(){
      // shipmentsApi({...this.form}).then(()=>{
      //    this.dialogFormVisible = false
      //    this.getData()
      // })
       this.$refs.ruleForm.validate((val)=>{
         if(val){
        shipmentsApi({...this.form}).then(()=>{
         this.dialogFormVisible = false
          this.getData()
          this.$message({
            showClose: true,
            message: '恭喜你发货成功',
            type: 'success'
          });
      })
       } 
     })
    },
    // 关闭的回调
    closedia() {
      this.dialogFormVisible = false
      this.form.expressName = ''
      this.form.expressNum = ''
     this.$refs.ruleForm.resetFields()
    },
  } 
}
</script>
<style lang="less" scoped>
.goodsDetail{
   .title{
    padding-left:20px;
     height: 100px;
     line-height:100px;
     border-bottom:1px solid #edf1f5;
     background: #fff;
     i{
       width:60px;
       height:60px;
       background: #4ebbf2;
       color:#fff;
       font-size:12px;
       display:inline-block;
       text-align: center;
       line-height: 60px;
       margin-right:20px;
       vertical-align: middle;
       border-radius: 50%;
     }
   }
   .goodsInfo{
    padding-left:20px;
     background: #fff;
     padding-top:30px;
     h4{
       font-size: 18px;
       color: #333333;
     }
     ul{
       display:flex;
       justify-content: space-between;
       margin:20px 30px;
       color: #666666;
       font-size: 14px;
     }
     dl{
       dt{
         display:flex;
         justify-content: space-between;
         height: 80px;
         line-height:80px;
         span{
           width:15%;
           text-align: center;
         }
         span:nth-child(1){
            width:300px;
         }
       }
       dd{
         display:flex;
         justify-content: space-between;
         height: 110px;
          border-bottom:1px solid #edf1f5;
         span{
           margin-top:30px;
           width:15%;
           text-align: center;
            // display:flex;
           p{
             margin-bottom:10px;
           }
           img{
             width:120px;
             height:86px;
             vertical-align: middle;
           }
         }
         span:nth-child(1){
            width:300px;
             margin-top:0px;
         }
       }
     }
     .gathering{
      padding-left:20px;
       height:80px;
       text-align: right;
       margin-bottom:20px;
       p{
         color: #333333;
         font-size: 16px;
         margin:10px;
         em{
           color: #fe4a4a;
           font-size: 20px;
         }
       }
     }
   }
   .studentsInfo{
     padding-left:20px;
     background: #fff;
     padding-bottom:10px;
     border-bottom:1px solid #edf1f5;
     h4{
       font-size: 18px;
       color: #333333;
       padding-top:20px;
       margin-bottom:20px;
     }
     >div{
       display: flex;
       div{
         img{
           width:80px;
           height:80px;
           border-radius: 50px;
           vertical-align: middle;
         }
         ul{
           margin:10px 50px 10px 20px;
           li{
             margin:10px 0;
             color: #666666;
             font-size: 16px;
             &:first-child{
               color: #333333;
             }
           }
         }
       }
     }
   }
   .expressInfo{
      padding-left:20px;
      h4{
       font-size: 18px;
       color: #333333;
       padding-top:20px;
       margin-bottom:20px;
      }
      p{
        color: #666666;
        font-size: 16px;
        margin-bottom:20px;
      }
      ul{
        li{
          color: #333333;
          font-size: 16px;
          margin-bottom:20px;
        }
      }
   }

}
</style>
<style lang="less">
  .goodsDetail{
    .el-dialog {
      margin-left: 35%;
      margin-top: 200px;
      max-width: 400px;
      border-radius:10px;
    }
    .dialog-footer{
        display:flex;
        justify-content:center;
    }
    .el-input__inner{
      border-radius:20px;
    }
  }
</style>


