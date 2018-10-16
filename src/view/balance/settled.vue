<!-- 已结算详情 -->
<template>
  <div class='content_data balanceSettled'>
     <Breadcrumb/>
     <div class="courtitle">课程信息</div>
     <div class="courseinf">
        <div class="courimg">
           <img :src="data.homeImg" alt="">
        </div>
        <div class="courid">
            <ul class="ul_one">
               <li>
                  <span class="span_one">课程ID</span>
                  <span class="id_span">{{data.id}}</span>
               </li>
               <li>
                  <span class="span_one">课程专题名称</span>
                  <span>{{data.name}}</span>
               </li>
               <li>
                  <span class="span_one">教学群体</span>
                  <span class="fourword" v-for="(item,index) in showGrous" :key="index">{{item}}</span>
               </li>
               <li>
                  <span class="span_one">教学科目</span>
                  <span class="fourword" v-for="(item,index) in showsubjects" :key="index">{{item}}</span>
               </li>
               <li>
                  <span class="span_one">授课教师</span>
                  <span class="spanimg"><img :src="data.teacherImg" alt=""></span>
                  <span class="teachname">{{data.teacherName}}</span>
               </li>
            </ul>
        </div>
        <div class="courtime">
           <ul class="ul_one">
               <li>
                  <span class="span_one">授课时间</span>
                  <span>{{datesTimeFilter(0,0,data.courseStartTime)}}-{{datesTimeFilter(0,0,data.courseEndTime)}}</span>
                  <span>每日{{datetTimeFilter(0,0,data.classStartTime)}}-{{datetTimeFilter(0,0,data.classEndTime)}}</span>
               </li>
               <li>
                  <span class="span_one">报名日期</span>
                   <span>{{datesTimeFilter(0,0,data.signStartTime)}}-{{datesTimeFilter(0,0,data.signEndTime)}}</span>
               </li>
               <li>
                  <span class="span_one">课时数</span>
                  <span class="threeword">{{data.courseTime}}</span>
               </li>
               <li>
                  <span class="span_one">原价</span>
                  <span class="twoword">¥{{currencyFilter(0,0,data.salePrice)}}</span>
               </li>
               <li>
                  <span class="span_one">优惠价</span>
                  <span class="threeword">¥{{currencyFilter(0,0,data.discountPrice)}}</span>
               </li>
            </ul>
        </div>
        <div class="courstate">
          <ul>
            <li>
              <span><img src="../../../static/img/22.png" alt=""></span>
              <span>报名人数</span>
            </li>
            <li>{{data.followCount}}</li>
            <li>
              <span><img src="../../../static/img/33.png" alt=""></span>
              <span>课程状态</span>
            </li>
            <li>{{Date.parse(new Date()) < data.courseStartTime? '未上课': Date.parse(new Date()) < data.courseEndTime ? '上课中':'已上课'}}</li>
            </ul>
        </div>
     </div>
     <!-- 结算记录 -->
     <div class="datacount">
        <span class="data_one">结算记录</span>
        <span class="data_two">结算时间：{{datenTimeFilter(0,0,data.settlementTime)}}</span>
     </div>
     <!-- 列表 -->
      <div class="list_content">
          <ul class="list_title">
            <li v-for="(item,index) in navTitle" :key="index">{{item}}</li>  
          </ul>
          <div class="list" v-for="(item,index) in list" :key="index">
            <p class="number_time"><span class="p_span">订单号:{{item.orderNo}}</span><span>下单时间:{{dateTimeFilter(0,0,item.payTime)}}</span></p>
            <ul class="list_wrap">
              <li class="need_flex">
                <div>{{item.userName}}</div>
                <div class="div_t ">{{item.userPhone}}</div>
              </li>
              <li class="wx_q">
                <div>￥{{currencyFilter(0,0,item.amount)}}</div>
                <!-- <div class="div_t marbor">{{payTypeFilter2(0,0,item.payType)}}</div> -->
                <el-tag round class="div_t marbor">{{payTypeFilter3(0,0,item.payType)}}</el-tag>
              </li>
              <li>{{item.thirdOrderNo}}</li>
              <li>{{datenTimeFilter(0,0,item.payTime)}}</li>
              <li>{{item.serviceRate}}</li>
              <li>￥{{currencyFilter(0,0,item.serviceMoney)}}</li>
              <li>{{item.mechanismRate}}</li>
              <li>￥{{currencyFilter(0,0,item.mechanismMoney)}}</li>
            </ul> 
          </div> 
      </div>
      <MyPagination :page="pageOption.page" :pageSize="pageOption.pageSize" :pageSizes="[10]" :method="findList" :total="pageOption.total"></MyPagination>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import { getSettledApi,getDoneApi,getServeCourceApi } from '../../../src/api/balanceListApi'
import {payTypeFilter3,datenTimeFilter,dateTimeFilter,datesTimeFilter,datetTimeFilter,currencyFilter} from '../../constant/filter'
export default {
  name: 'balanceSettled',
  components: {Breadcrumb,MyPagination},
  data () {
    return {
      showGrous: [],
      showsubjects: [],
      data:{},
      id:null,
      navTitle:["学员","实付金额/元","第三方订单号","支付时间","服务商分成比例","服务商分润","机构分成比例","机构分润"],
       pageOption:{
         page:1,
         pageSize:10,
         total:null,
       },
       list:[
         {number:"2018544446564657894",time:"2018-4-21 16:58:20",img:"",teacher:"胡浩明",teacherPhone:12345678911,student:"胡浩明",studentPhone:12345678911,lessonTime:"70课时",oldvalue:8000.00,discount:7200.00,real:7200.00,butie:800.00,state:"待付款",img:"../../../static/img/admin.png"},
         {number:"2018544446564657894",time:"2018-4-21 16:58:20",img:"",teacher:"胡浩明",teacherPhone:12345678911,student:"胡浩明",studentPhone:12345678911,lessonTime:"70课时",oldvalue:8000.00,discount:7200.00,real:7200.00,butie:800.00,state:"待付款",img:"../../../static/img/admin.png"}
       ]
    }
  },
  created () {
    this.id = this.$route.query.id
    // console.log(this.id)
    this.init()
  },

  methods: {
    payTypeFilter3,
    datenTimeFilter,
    dateTimeFilter,
    datesTimeFilter,
    datetTimeFilter,
    currencyFilter,
    findList(page={}){
      getDoneApi({...this.pageOption,...page,courseId:this.id,courseType:1})
        .then(data=>{
          // console.log("data:",data,'列表')
          this.list = data.list
          this.pageOption.page = data.pageNum
          this.pageOption.total = data.total
          getServeCourceApi(this.data.grade).then(res=>{
            var arr= []     
            this.data.grade.split(",").forEach(element => {
              var cliarr = []
              cliarr =  res.filter(item=>{
                return item.id == element
              })
               //console.log("1",cliarr);
              arr.push(cliarr[0])
            });
            //  console.log("2",arr);
            this.showGrous = arr.map(val=>{
              return val.itemName
            })
          })
          getServeCourceApi(this.data.subject).then(res=>{
           // console.log(this.data.subject)
            var arr= []  
            //console.log(res)
             /*  var  newitem = null
              newitem = res.find((item)=>{
                return item.id ==34
              })   */
            this.data.subject.split(",").forEach(element => {
              var cliarr = []
              cliarr =  res.filter(item=>{
                return item.id == element
              })
              // console.log("1",cliarr);
              arr.push(cliarr[0])
            });
           // console.log("3",arr);
            this.showsubjects = arr.map(val=>{
              return val.itemName
            })
          })
        })
      },
     init(){
       getSettledApi(this.id).then(data=>{
          //console.log('data:',data,'人员信息')
          this.data = data
       })
     },
  },

}
</script>

<style lang='less' scoped>
  .balanceSettled{
    color: #333;
    width: 100%;
      .courtitle{
         background-color: #fff;
         width: 100%;
         height: 60px;
         line-height: 60px;
         font-size: 18px;
         padding-left: 30px;
         color: #333;
      }
     .courseinf{
        background: #fff;
        width: 100%;
        display: flex;
        flex-direction: nowrap;
        justify-content: space-around;
        text-align: left;
        line-height: 50px;
        padding-bottom: 50px;
        margin-bottom: 20px;
        .courimg{
          width: 20%;
          img{
            width: 100%;
            height: 200px;
            line-height: 200px;
            margin-top: 20px;
          }
        }
        .courid{
          // background-color: orange;
          width: 22%;   
          border-right: 1px solid #e1e6e8;
          padding-right: 10px;   
        }
        .courtime{
          // background-color: red;
          width: 29%;
          border-right: 1px solid #e1e6e8;
          // margin-right: 20px; 
        }
        .courstate{
          // background-color: blue;
          width: 16%;
          ul{
            padding-left: 50px;
            li:nth-child(2){
              font-size: 20px;
              font-weight: bold;
            }
            li:nth-child(3){
              margin-top: 30px;
            }
            li:nth-child(4){
              width: 78px;
              height: 30px;
              line-height: 30px;
              background-color: #feb13e;
              padding: 0 10px;
              color: #fff;
              text-align: center;
            }
          }
        }
        .span_one{
          padding-right: 30px;
        }
        .id_span{
          padding-left: 48px;
        }
        .fourword,.spanimg{
          padding-left: 32px;
        }
        .teachname{
          padding-left: 10px;
        }
        .threeword{
          padding-left: 13px;
        }
        .twoword{
          padding-left: 30px;
        }
        .spanimg{
          img{
            width: 40px;
            height: 40px;
            line-height: 40px;
            vertical-align: middle;
          }
        }
     }
    //  结算记录
      .datacount{
       padding-left: 30px;
       margin: 20px 0;
       background-color: #fff;
       height: 60px;
       line-height: 60px;
       width: 100%;
       .data_one{
         padding-right: 15px;
         border-right: 1px solid #999;
       }
       .data_two{
         color:#999;
         padding-left: 10px;
       }
      }

    //  列表
     .list_content{         
          .list_title{
            width: 100%;
            background-color: #fff;
            height: 74px;
            line-height: 74px;
            font-size: 18px;
            font-weight: bold;
          }
          .list{  
            .list_wrap{
              display: flex;
              align-items: center;
            }
            .div_t{
              margin-top: 15px;
            } 
            .marbor{
              border-radius: 20px;
              color: #666;
              background: #F6F7FB;
              border: 1px solid #ccc;
            }
            p{
              height: 70px;
              line-height: 70px;
            }                     
            .number_time{
              display: flex;
              justify-content:flex-start; 
              padding:0 20px; 
              // line-height: 40px;
              margin-right: 20px;  
              .p_span{
                padding-right: 100px;
              }         
            }
            ul{
              background-color: #fff;
              padding: 20px 0;
              padding-left: 25px;
             .need_flex{
              //  display: flex;
              //  justify-content:flex-start;            
               .img_box{
                width:100px;
                height:100px;
                margin: 0 3%;
                box-sizing: border-box;
                border-radius: 50%;
                 img{
                   width:100%;
                   height:100%;                 
                 }
               }
               .p_box{
                 text-align: left;
                 display: flex;
                 flex-direction: column;
                 justify-content: flex-start;
                 padding-top: 15px; 
                  span{
                    line-height: 25px;
                  }
               }
             }
            }
          }    
          ul{
            display: flex;
            justify-content: space-between;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
            padding:0; 
            margin:0;
            li{
              list-style: none;
              width:10%;
            }
            li:nth-child(1){
              width:15%;
            }
            li:nth-child(4){
              width:15%;
            }
            li:nth-child(5){
              width:15%;
            }
            li:nth-child(7){
              width:15%;
            }
          }
        }
  }
</style>

<style lang='less'>
  .balanceSettled{

  }
</style>

