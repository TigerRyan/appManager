<template>
  <div class="content_data reserveListSearch" id="reserveListSearch">
    <Breadcrumb/>
    <div class="reserveListSearch_content">
      <el-row class="search_box">
         <el-col :span="2">
           <el-select v-model="userType">
             <el-option v-for="(item,index) in roleOptions" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
         </el-col>
         <el-col :span="2">
            <el-select v-model="keyType"  @change='changeSelect()'>
            <el-option v-for="(item,index) in typeOptions" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
         </el-col>
         <el-col :span="5">
           <el-input v-model.trim="keyWord" :placeholder="placeholder"></el-input>
         </el-col>
         <el-col :span="4">
            <el-button type="primary" round @click="search">搜索</el-button>
            <el-button  icon="el-icon-refresh" style="background:#ecf5ff" round @click="reset">重置</el-button>
        </el-col> 
      </el-row>
       <p class="noMsg" v-if="isEmpty">暂无数据...</p>
      <div class="list_content" v-if="list.length !=0">
          <ul class="list_title">
            <li v-for="(item,index) in navTitle" :key="index">{{item}}</li>
            <li v-if="isActive==2" style="width:350px">操作</li>
          </ul>         
          <div class="list" v-for="(item,index) in list" :key="index">
            <p class="number_time"><span>订单编号:{{item.orderNumber}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
            <div class="wrap_box">           
              <ul class="list_wrap">
                <li class="need_flex">
                  <div class="img_box"><img :src="item.teacherImg" alt=""></div>
                  <p class="p_box"><span>{{item.teacherName}}</span><span>{{item.teacherPhone}}</span></p>
                </li>
                <li class="allTime">
                  <p >{{item.allTime.indexOf('-')==-1?item.allTime:hour((item.allTime).split('-')[0],(item.allTime).split('-')[1])}}课时</p>
                </li>
                <li>￥{{item.costPrice.toFixed(2)}}</li>
                <li>￥{{(item.costPrice*item.discount).toFixed(2)}}</li>
                <li>￥{{item.totalPrice.toFixed(2)}}</li>
                <li>￥{{(item.costPrice*(1-item.discount)).toFixed(2)}}</li>
                <li class="need_flex">
                  <div class="img_box"><img :src="item.studentImg || '../../static/img/admin.png'"  alt=""></div>
                  <p class="p_box"><span>{{item.studentName || '暂无'}}</span><span>{{item.studentPhone || 15827601003}}</span></p>
                </li>
                <!-- <li v-if="isActive==2" style="width:310px">
                  <el-button type="primary" plain  round @click="agree(item.id)">同意退款</el-button><el-button type="danger" plain round @click="refuse(item.id)">拒绝退款</el-button>
                </li> -->
                <!-- <li><router-link :to="{name:'reserveDetail',query:{id:index}}"><el-button type="primary" plain round>查看详情</el-button></router-link></li> -->
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
import {getReserveList,isRefuseSub} from "../../api/orderManagerApi"
import {datenTimeFilter,hour,hourFil} from "../../constant/filter"
import { confirm, success, error } from '../../actions/index'

export default {
   name:'reserveList' ,
   components:{Breadcrumb,MyPagination},
   data(){
     return{
       isActive:0,
       status:null,
       navList:["待付款","已付款","退款中","已退款","已取消"],
       userType:1, //角色
       keyType:1, //搜索类型
       roleOptions:[{label:"学生",value:1},{label:"老师",value:2}],
       typeOptions:[{label:"姓名",value:1},{label:"手机号码",value:2},{label:"预课单号",value:3}],
       keyWord:"", //搜索关键字
       placeholder:"请输入姓名查询",
       navTitle:["预约教师","总课时","原价/元","优惠价/元","实付金额/元","补贴金额/元","预约学员"],
       list:[],
       isEmpty:false, 
     }
   },
   created(){      
   
   },
   methods:{
     datenTimeFilter,
     hour,
     hourFil,         
     changeSelect(){
      this.placeholder = [
        "请输入姓名查询",
        "请输入手机号码查询",
        "请输入预课单号查询"
      ][this.keyType-1];
     },

     search(){
       if(this.keyWord==''){
           this.$message({
								type: 'error',
                message: '请输入搜索内容!'               
              });
       }else{
          getReserveList({userType:this.userType,keyWord:this.keyWord,keyType:this.keyType})
        .then(data=>{         
          console.log(data,"shuju")
            this.list = data.list
            this.isEmpty = this.list.length !=0? false:true; 
          })
        .catch(error =>{console.log(error)})
       }
       
     },
     reset(){
        this.keyWord = "";
        this.list = [];
        this.isEmpty = false;  
     },
     agree(id){
        confirm( '你确定要同意退款吗','warning','修改确认')
        .then(()=>{
            isRefuseSub({id,status:1})
            .then(()=>{
              this.$message({
								type: 'success',
                message: '退款成功!'               
              });
              this.findList({...this.pageStart})
            })
        }) 
     },
     refuse(id){
         confirm( '你确定要拒绝退款吗','warning','修改确认')
        .then(()=>{
            isRefuseSub({id,status:2})
            .then(()=>{
               this.$message({
								type: 'success',
                message: '拒绝退款成功!'
              });
              this.findList({...this.pageStart})
            })
        }) 
     }
   }
}
</script>

<style lang="less" scoped>
    .reserveListSearch{
       padding:0; 
       margin:0;
      .noMsg{
            line-height: 35px;
            background-color: #fff;
            padding:20px 0;
            text-align: center;
          } 
      .reserveListSearch_content{
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
        .search_box{
          width:100%;
          height:80px;
        background-color: #fff;
         display: flex;
         justify-content: center;
          .el-col{
            line-height: 80px;
            margin:0 15px;  
          }
        }

        .list_content{ 
          background-color: #fff; 
           margin-top:20px;
          .list_title{
            // background-color: rgb(236, 234, 234);
            color:rgb(73, 88, 105);
            font-weight: 700;
            padding:0 20px;
            li{
              line-height: 74px;
            }
          }

          .list{ 
            .number_time{
              line-height: 40px;
              background-color: #f7f8f9;
              line-height: 68px;
              font-size: 14px;
              span{
                margin-right: 200px;
                padding-left: 32px;   
              }                         
            }
            .wrap_box{
              padding: 20px;
            }
            ul{
              padding-bottom:20px;
              border-bottom: 1px solid #ccc;
              li{
                line-height: 60px;
              }
              .allTime{
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                line-height: 20px;
              }
             .need_flex{
               display: flex;
               justify-content:flex-start;             
               .img_box{
                width:60px;
                height:60px;
                margin: 0 5%;
                border-radius: 50%;
                overflow: hidden;
                 img{
                   width:100%;
                   height:100%;                 
                 }
               }
               .p_box{
                 text-align: left;
                 display: flex;
                 flex:1;
                 flex-direction: column;
                  justify-content: center;
                  line-height: 20px;
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
              width:20%;
            }
            li:nth-child(7){
              width:20%;
            }
          }
        }
      }
    }
</style>
<style lang="less">
  #reserveListSearch{
    .search_box{
      .el-input__inner{
        border-radius: 20px;
      } 
    }
  }
</style>