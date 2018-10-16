<template>
  <div class="content_data offlineDetail">
    <div class="title_common">{{type==0?'待付款':type==1?'已付款':type==2?'退款中':type==3?'已退款':type==4?'已取消':'已评价'}}订单详情</div>
    <div class="detail_content">
      <div class="list_title">
        <div class="currentOrder">
        <p>{{type==0?'待付款':type==1?'已付款':type==2?'退款中':type==3?'已退款':type==4?'已取消':'已评价'}}</p>
        <p>订单状态：{{type==0?'待付款':type==1?'已付款':type==2?'退款中':type==3?'已退款':type==4?'已取消':'已评价'}}</p>
        </div>
        <div class="status" v-show="type==1">
          <span>当前状态: {{ obj.signStatus==0?'未签到':'已签到' }}</span>
          <span>报名签到时间: {{ dateTimeFilter(0,0,obj.signTime) }}</span>
        </div>
      </div>
        <div class="table_msg">
          <p class="p_box number">
            <span>订单号：{{obj.numOrder }}</span>
            <span>下单时间：{{date(obj.orderTime) }}</span>
            <span v-show="type==0">结算时间：{{ datetTimeFilter(0,0,obj.settlementTime) }}</span>
          </p>
          <TablePage>
            <el-table :data="list">
              <el-table-column label="课程" min-width="290">
                <template slot-scope="scope">
                  <div class="img_p">
                    <div class="img_box"><img :src="scope.row.coursePic" onerror="onerror=null;src='../../../static/img/admin.png'"/></div>
                    <div class="p_wrap">
                      <p>{{scope.row.courseName}}</p>
                      <p>授课日期：{{dateFi(scope.row.courseStartDate)}}-{{dateFi(scope.row.courseEndDate)}}</p>
                      <p>授课时间：{{datetTimeFilter(0,0,scope.row.courseStartTime) }}-{{datetTimeFilter(0,0,scope.row.courseEndTime ) }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="课时数量">
                <template slot-scope="scope">
                  <p>{{scope.row.classNum}}课时</p>
                </template>
              </el-table-column>
              <el-table-column label="授课教师"  prop="teacherName"></el-table-column>
              <el-table-column label="原价"  prop="salePrice">
                 <template slot-scope="scope">
                  <p>￥{{(scope.row.price).toFixed(2)}}</p>
                </template>
              </el-table-column>
              <el-table-column label="优惠价">
                <template slot-scope="scope">
                  <p>￥{{(scope.row.price-scope.row.discountPrice).toFixed(2)}}</p>
                </template>
              </el-table-column>
              <el-table-column label="学习券面额" v-if='type!=0'>
                <template slot-scope="scope">
                  <p><span v-if='scope.row.couponMoney!=0'>￥</span>{{scope.row.couponMoney!=0?scope.row.couponMoney:'无'}}</p>
                </template>
              </el-table-column>
              <el-table-column label="实际付款">
                <template slot-scope="scope">
                  <div class="real_pay">
                    <span>￥{{(scope.row.practicalPrice).toFixed(2) }}</span>
                    <span>{{payTypeFilter(0,0,scope.row.payStyle) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="预估/结算分润" prop="expectedEarn" v-if="type==0"></el-table-column>
              <el-table-column min-width="120" label="第三方交易单号" prop="thirdOrderNum" v-if="type==1 ||type==2 || type==3">
                <template slot-scope="scope">
                  <p>{{scope.row.thirdOrderNum || '-------'}}</p>
                </template>
              </el-table-column>
               <el-table-column label="取消时间" prop="cancelTime" v-if="type==4" :formatter="datenTimeFilter"></el-table-column>
               <el-table-column min-width="125" label="支付时间" prop="payTime " v-if="type==1 ||type==2 ||type==3 || type==5">
                  <template slot-scope="scope">
                    <span>{{date(scope.row.payTime)}}</span>
                  </template>
               </el-table-column>
            </el-table>
          </TablePage>
          <div class="org_box" v-if="type!=0">
            <p class="title">机构信息</p>
            <div class="org_msg">
              <div class="img_box"><img :src="obj.mechanismLogo" onerror="onerror=null;src='../../../static/img/admin.png'"></div>
              <p class="p_box">
                 <span>机构名称：{{obj.mechanismName || '未知' }}</span>
                 <span>机构行业：{{obj.industry || '未知' }}</span>
              </p>
              <p class="p_box">
                 <span>城市：{{obj.city?obj.city.split(',')[1] : '未知'}}</span>
              </p>
              <p class="p_box">
                <span>负责人：{{obj.headPerson || '未知' }}</span>
                <span>账号：{{obj.accountPhone || '未知'}}</span>
              </p>
            </div>
          </div>
          <div class="tuikuan_box" v-if="type==2||type==3">
              <p class="title">退款信息</p>
              <p>申请时间:{{date(obj.refundApplicationTime )}}</p>
              <p>退款原因：{{obj.refundReason }}</p>
              <p>退款理由：{{obj.refundWhy || '无' }}</p>
              <div class="tui_content">
                  <el-button type="primary" round v-if="type==2" @click="refuse" :disabled="disabled">拒绝退款</el-button>
                  <el-button type="primary" round v-if="type==2" @click="agree" :disabled="disabled">同意退款</el-button>
                  <p v-if="type==3">退款时间:{{date(obj.refundSettlementTime )}}</p>
              </div>
              <!-- <el-dialog
                :title="dialog.title"
                :visible.sync="centerDialogVisible"
                width="30%"
                :modal-append-to-body="false"
                center>
                <span>{{dialog.content}}</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="centerDialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="sure">确定</el-button>
                </span>
              </el-dialog> -->
          </div>
          <div class="student_box">
             <p class="title">学员信息</p>
             <div class="student_msg">
                <div class="img_box"><img :src="obj.studentHead" onerror="onerror=null;src='../../../static/img/admin.png'"></div>
                <p class="p_box">
                  <span>学员名字：{{obj.studentName }}</span>
                   <span>学员年级：{{obj.grade || '未知' }}</span>
                </p>
                <p class="p_box">
                  <span>联系电话：{{obj.telephone }}</span>
                  <span>学员学校：{{obj.studentSchool || '未知' }}</span>
                </p>
            </div>
          </div>
          <div class="evaluate_box" v-if="type==5">
             <el-rate
                v-model="evaluate"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
            <el-tag>标签一</el-tag>
            <el-tag type="success">标签二</el-tag>
            <el-tag type="info">标签三</el-tag>
            <el-tag type="warning">标签四</el-tag>
            <el-tag type="danger">标签五</el-tag>
            <p>{{ obj.evaluationContent  }}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import TablePage from '../../components/TablePage.vue'
import {isRefuse,getCourseDetail,getSubjectApi} from '../../api/orderManagerApi.js'
import {datetTimeFilter,dateFi,date,payTypeFilter,datenTimeFilter,dateTimeFilter} from "../../constant/filter"
import { confirm, success, error } from '../../actions/index'

export default {
    name:"offlineDetail",
    components:{TablePage},
    data(){
      return{
        id:"",
        type:null,
        refundId :null,
        evaluate:5,
        obj:{},
        list:[
          // {img:'',lessonName:'课程名称全部显示出来文字超出后自动向下回行直至全部显示',date:'2018.0126-2018.04.23',time:'12:00-14:00',lessonNum:52,teacher:'张益华',real:3924.00,discount:1234.00,realPay:1234.0,payType:"支付宝",gu:1234.00,qutime:'2018年4月22日18:09:44',danhao:123456789}
          ],
        centerDialogVisible:false,
        statusType:null,
        status:null,
        dialog:{
          title:'',
          content:''
        },
        disabled: false,
      }
    },
    created(){
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
      this.id = this.$route.query.id
      this.type = this.$route.query.type;
      if(this.type==2 || this.type==3){
         this.refundId =  this.$route.query.refundId*1;
      }  
      getCourseDetail({id:this.id,refundId:this.refundId,status:this.type})
      .then(data=>{
        // this.list = data
        this.list = [data]
        this.obj = data
        // console.log(this.list,"list")
        getSubjectApi().then(data=>{
          data.forEach(item=>{
              if (item.itemLevels==1 && item.id==this.obj.grade) {
                this.obj.grade=item.itemName
            }
          })
        })
      })
      .catch(error=>{console.log(error)})
    },
    methods:{
      datetTimeFilter,
      date,
      dateFi,
      payTypeFilter,
      datenTimeFilter,
      dateTimeFilter,
      agree(){
        confirm( '你确定要同意退款吗','warning','退款确认')
        .then(()=>{
            isRefuse({id:this.id,status:1,refundId:this.refundId})
            .then((data)=>{
              // if(data&&data.code==200){//此时打印的data是null,所以不能判断code
                this.$message({
                  type: 'success',
                  message: '退款成功!'
                });
                setTimeout(()=>{
                  this.$router.push({name:'offlineList'})
                },1000)
              // }
            })
            .catch(({msg})=>{error(msg)})
        })
      },
      refuse(){
        confirm( '你确定要拒绝退款吗','warning','退款确认')
        .then(()=>{
            isRefuse({id:this.id,status:2,refundId:this.refundId})
            .then((data)=>{            
             // if(data && data.code ==200){//此时打印的data是null,所以不能判断code
                this.$message({
                  type: 'success',
                  message: '拒绝退款成功!'
                });
                setTimeout(()=>{
                  this.$router.push({name:'offlineList'})
                },1000) 
             // }
            })
            .catch(({msg})=>{error(msg)})
        })
      },
    }
}
</script>
<style lang="less">
  .offlineDetail{
    .el-table .el-table__header tr{
      line-height: 40px !important;
      font-size: 16px;
      color:rgb(73, 88, 105);
      font-weight: 700;
      background-color: #f7f8f9;
    }
    .el-table thead th{
      border-top:0 !important;
       border-bottom:1px solid #ccc !important;
    }

  }
</style>

<style lang="less" scoped>
   .offlineDetail{
     .title_common{
       line-height: 70px;
       border-left:3px solid #4db8fc;
       height: 70px;
       background-color: #fff;
       text-indent: 20px;
       margin-bottom: 20px;
       font-size:20px;
     }
     .detail_content{
       .list_title{
          height: 100px;
          display: flex;
          justify-content:space-between;
          align-items: center;
          padding-left: 30px;
          border-bottom:1px solid #edf1f5;
           background-color: #fff;
          p:first-child{
            width: 70px;
            height: 70px;
            border:5px solid #dcf1fc;
            background: #4ebbf2;
            border-radius: 50%;
            line-height: 60px;
            font-size: 16px;
            color: #fff;
            text-align: center;
          }
          p:nth-child(2) {
            font-size: 16px;
            color: #333;
            margin-left: 11px;
          }
          .currentOrder{
            display: flex;
            justify-content: space-between;
            align-items: center;
           
          }
          .status{
            // float: right;
            padding-right:100px;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            span{
                padding-bottom: 10px;
            }
          }
        }
       .table_page{
          background-color: #fff;
          margin-top:0;
       }
       .table_msg{
         .p_box{
           display: flex;
           justify-content: flex-start;
           line-height: 40px;
           padding-left: 20px;
           background-color: #fff;
           span{
             margin-right: 10%;
           }
         }
         .el-table__row{
           .img_p{
             display: flex;
             justify-content: flex-start;
             .img_box{
               width:120px;
               height:100px;
               margin-right: 10px;
               img{
                 width:100%;
                 height:100%;
               }
             }
             .p_wrap{
               display: flex;
               flex-direction: column;
               justify-content: space-around;
               text-align: left;
               color:#ccc;
               p:first-child{
                 color:black;
               }
             }
           }
           .real_pay{
             display: flex;
             flex-direction: column;
             text-align: center;
             span{
               display: inline-block;
             }
             span:last-child{
               border:1px solid #ccc;
               border-radius:20px;
               width:90px;
               position: relative;
               margin: auto;
             }
           }
         }
          .title{
              line-height:50px;
              text-indent:20px;
              font-size:18px;
              font-weight:500;
              padding-bottom:10px;
          }
         .student_box{
           background-color: #fff;
           margin-top:20px;
           padding:  20px;
            .student_msg{
              display: flex;
              justify-content: flex-start;
               .p_box{
                  width:22%;
                  display: flex;
                  flex-direction: column;
                  justify-content:center;
                  span{
                    display: inline-block;
                    margin-right: 20px;

                  }
                }
              .img_box{
                width: 100px;
                height: 100px;

                border-radius: 50%;
                overflow: hidden;
                img{
                  width:100%;
                  height:100%;
                }

              }
            }
         }
         .org_box{
           background-color: #fff;
           margin-top:20px;
           padding:20px;
           .org_msg{
             display: flex;
             flex-direction: flex-start;
             .p_box{
               width:22%;
               display: flex;
               flex-direction: column;
               text-align:left;
               justify-content:center;
             }
             .img_box{
               width: 100px;
               height: 100px;

               border-radius: 50%;
               overflow: hidden;
               img{
                 width:100%;
                 height: 100%;
               }
             }
           }
         }
         .tuikuan_box{
          background-color: #fff;
          margin-top: 20px;

          position: relative;
          padding:20px 20px 70px 20px;
          p{
            line-height:40px;
            text-indent:25px;
          }
           p:nth-of-type(1){
             span{
               margin-right:100px;
             }
           }
            span{
                display: inline-block;
                padding-right: 40px;
                line-height: 40px;
              }
           .tui_content{

             .el-button{
               position: absolute;
               bottom:20px;
               right:20px;
             }
            .el-button:nth-of-type(1){
                right:150px;
            }
           }
         }
         .evaluate_box{
           margin-top: 20px;
           padding: 20px;
           background-color: #fff;
           .el-rate{
            height: 40px;
           }
           p{
             padding-top: 20px;
             line-height: 25px;
             text-indent: 20px;
           }
         }
       }

     }
   }
</style>
