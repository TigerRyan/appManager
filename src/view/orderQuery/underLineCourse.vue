<template>
  <div class="content_data underLineCourse" id="underLineCourse"> 
   <Breadcrumb/>
   <!-- <div>
     线下课程
   </div> -->
   <div class="underLineCourse_content">
     <!-- <ul class="nav">
        <li v-for="(item,index) in navList" :key="index" @click="changeActive(index)" :class="index==isActive?'isactive':''">{{item}}</li>
     </ul> -->
     <el-row class="search_box"  >
       <el-col :span="3" :offset="6">
          <el-select v-model="keyType"  @change='changeSelect'>
             <el-option v-for="(item,index) in typeOption" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
       </el-col>
       <el-col :span="4" :offset="1">
         <el-input v-model.trim="keyWord" :placeholder="placeholder"></el-input>
       </el-col>
       </el-col>
        <el-col :span="5" :offset="1">
            <el-button type="primary" round @click="search">搜索</el-button>
             <el-button icon="el-icon-refresh" style="background:#ecf5ff" round @click="reset">重置</el-button>
        </el-col> 
     </el-row>
     <div class="list_content" v-show="pageOption.list.length>=1">
        <ul class="list_title">
          <li v-for="(item,index) in navTitle" :key="index">{{item}}</li> 
          <li >实际付款</li>       
          <li >订单状态</li> 
          <li >操作</li>  
          
        </ul>
        <p class="noMsg" v-if="pageOption.list.length==0">暂无数据...</p>
        <div class="list" v-for="(item,index) in pageOption.list" :key="index">
           <p class="number_time"><span>订单编号:{{item.orderNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
           <div class="wrap_box">           
            <ul class="list_wrap">
              <li>{{item.mechanismName }}</li>
              <li class="need_flex">
                  <div class="img_box"><img :src="item.courseImg" alt=""></div>
                  <p>{{item.courseName }}</p>
                </li>
                <li>
                  <p class="span_flex"><span>优惠价:{{item.discountPrice.toFixed(2)}}</span><span class="price">原价:{{item.salePrice.toFixed(2) }}</span></p>
                </li>
                <li>
                  <p class="span_flex"><span>{{item.userName||'暂无'}}</span><span>{{item.grade||'暂无'}}</span></p>
                </li>
                <li >
                  <p class="span_flex"><span>{{item.amount.toFixed(2)}}</span><span class="pay_type">{{item.payType==1?'微信':item.payType==2?'支付宝':'余额支付'}}</span></p>
                </li>
                <li >
                  <span v-if="item.orderStatus ==0">待付款</span>
                  <span v-if="item.orderStatus ==1 && item.refundStatus == 0">已付款</span>
                  <span v-if="item.orderStatus ==1 && item.refundStatus == 1">退款中</span>
                  <span v-if="item.orderStatus ==2">已退款</span>
                  <span v-if="item.orderStatus ==3">已取消</span>
                </li>
                <li ><router-link :to="{name:'offlineDetail',query:{id:item.id,type:status}}"><el-button type="primary" plain round v-if="item.orderStatus ==1 && item.refundStatus == 1">查看详情</el-button></router-link></li>
                
                
              </ul>
            </div> 
        </div>
     </div>
     
    </div>    
  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import {getOfflineList} from "../../api/orderManagerApi"
import {datenTimeFilter} from "../../constant/filter"
import {success, error, confirm} from '../../actions'

export default {
  name:'underLineCourse',
  components:{Breadcrumb,MyPagination},
  data(){
    return{
      isActive:null,
      status: null,
     
      keyType:1,
      tiemValue:"",
      pickerOptions0:{
          disabledDate(time) {
          //超过当前日期禁用
          return time.getTime() > Date.now();
        } 
      },
      typeOption:[{label:"学生姓名",value:1},{label:"机构名称",value:2},{label:"课程名称",value:3},{label:"交易单号",value:4},{label:"课程ID",value:5},],
      keyWord:"",
      placeholder:"请输入学生姓名",
      navTitle:["机构","课程","价格","学员",],
      pageStart:{
        page:1,
        pageSize:5,
      },
      pageOption:{
         page:1,
         pageSize:5,
         total:null, 
        
      list:[]
      }
    }
  },
  created(){  
    // this.findList()
    console.log(6666666);
   },
  methods:{
    datenTimeFilter,
     changeSelect(){
        this.placeholder = [
        "请输入学生姓名",
        "请输入机构名称",
        "请输入课程名称",
        "请输入交易单号",
        "请输入课程ID",
      ][this.keyType-1]; 
     },
     selectTime(){

     },
    findList(){
        getOfflineList({keyWord:this.keyWord,keyType:this.keyType})
        .then(data=>{         
          console.log(data,"shuju")
            this.pageOption = {...data,list:data.list}
            console.log(6666666,data);
            this.status = data.list
          })
        .catch(error =>{console.log(error)})
     },
     search(){
       if(this.keyWord == ''){
         error("请输入搜索内容") 
       }else{
         this.findList() 
       }
        
     },
     reset(){
       this.keyWord =""
       this.keyType = ''
       this.pageOption.list = []
     }

  } 
}
</script>

<style lang="less" scoped>
   .underLineCourse{
     .underLineCourse_content{
       .nav{
          height: 95px;
          background-color: #fff;        
          display: flex;
          justify-content: flex-start;
          padding:0;
          margin:0;
           margin-bottom: 20px;
          .isactive {
            border-bottom: 5px solid #4db8fc;
            color: #4db8fc;
            }
          li{
              padding: 0 30px;
              line-height: 95px;
              font-size: 20px;
              cursor: pointer;
              list-style: none;
          }
        }
      }
      .search_box{
          width:100%;
          height:80px;
          background-color: #fff;
          margin-bottom:20px;
          
          .el-col{
            line-height: 80px;  
          }
          .el-input{
            border-radius: 20px;
          }
      }
      .list_content{
         background-color: #fff;  
        .list_title{
            color:rgb(73, 88, 105);
            font-weight: 700;
          li{
            line-height: 74px;
          }
          li:nth-child(2){
            text-indent: 5%;
          }
        }
        .noMsg{
          line-height: 35px;
          text-align: center;
          padding-bottom:10px;
        }
        .list{
          .number_time{
             line-height: 40px;
               background-color: #f7f8f9;
              line-height: 68px;
              font-size: 14px;
              span{
                margin-right: 200px;
                padding-left: 32px;;
              }           
          }
          .wrap_box{
              padding: 20px;
            }
          ul{
            padding-bottom:20px;
            border-bottom: 1px solid #ccc;
            li{
              line-height:60px;
              display: flex;
              align-items: center;
              justify-content: center;
              .span_flex{
                display: flex;
                flex-direction: column;
                line-height: 25px;
                .price{
                  text-decoration: line-through;
                }
                span:last-child{
                  font-size:15px;
                  color:rgb(116, 114, 114);                  
                }
                .pay_type{
                  border:1px solid #ccc;
                  border-radius: 20px;
                  padding:0 15px;
                }
              }
            }

            .need_flex{
               display: flex;
               justify-content:flex-start;
               p{
                  flex:1;
                  text-indent: 0;
                  display: flex;
                  align-items: center;
                  line-height: 20px;
               }
               .img_box{
                  width: 60px;
                  height: 60px;
                  margin: 0 20px;
                  border-radius: 50%;
                  overflow: hidden;
                  box-sizing: border-box;
                  img{
                  width:100%;
                   height:100%; 
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
            width:12%;       
          }
          li:nth-child(2){
            width:25%;
            text-align: left;  
          }
        }
      }
   } 
</style>
<style lang="less">
  #underLineCourse{
    .search_box{
      .el-input__inner{
        border-radius: 20px;
      } 
    }
    .el-date-editor{
     width:100%;
    }
  }
</style>


