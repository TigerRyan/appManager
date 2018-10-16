<template>
  <div class="content_data reserveList" id="reserveList">
    <Breadcrumb/>
    <div class="reserveList_content">
      <ul class="nav">
        <li v-for="(item,index) in navList" :key="index" @click="changeActive(index)" :class="index==isActive?'isactive':''">{{item}}</li>

      </ul>
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
        <ExportButton :method="exportList"/>
      </el-row>
      <div class="list_content">
          <ul class="list_title">
            <li v-for="(item,index) in navTitle" :key="index">{{item}}</li>
            <li>操作</li>
          </ul>
           <p class="noMsg" v-if="pageOption.list.length==0">暂无数据...</p>
          <div class="list" v-for="(item,index) in pageOption.list" :key="index">
            <p class="number_time"><span>订单编号:{{item.orderNumber}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
            <div class="wrap_box">
              <ul class="list_wrap">
                <li class="need_flex">
                  <div class="img_box"><img :src="item.teacherImg" alt=""></div>
                  <p class="p_box"><span>{{item.teacherName}}</span><span>{{item.teacherPhone}}</span></p>
                </li>
                <li>{{['未知','否','是'][item.type]}}</li>
                <li class="allTime">
                  <p v-if="isActive==0 ||isActive==1 || isActive==4 ">{{item.allTime}}课时</p>
                   <p v-if="isActive==2 ||isActive==3">{{hour((item.allTime).split('-')[0],(item.allTime).split('-')[1])}}课时</p>
                </li>
                <!-- 原价 -->
                <li>￥{{item.costPrice.toFixed(2)}}</li>
                <!-- 优惠价 (原价*折扣)-->
                <li>￥{{item.totalPrice.toFixed(2)}}</li>
                <!-- 交易金额  -->
                <li>￥{{item.totalPrice.toFixed(2)}}</li>
                 <!-- 补贴金额  -->
                <li>￥{{(item.costPrice-item.totalPrice).toFixed(2)}}</li>
                
                <li class="need_flex">
                  <div class="img_box"><img :src="item.studentImg || '../../static/img/admin.png'"  alt=""></div>
                  <p class="p_box"><span>{{item.studentName || '暂无'}}</span><span>{{item.studentPhone}}</span></p>
                </li>
                <li>{{isActive==0?'待付款':isActive==1?'已付款':isActive==2?'退款中':isActive==3?'已退款':'已取消'}}</li>
                <li>
                  <a href="javaScript:;"><el-button  v-if="isActive==2" type="primary" plain  round @click="agree(item.id,item.refundId)" :disabled="disabled" size='small'>同意</el-button></a>
                  <a href="javaScript:;" style="margin-left:10px;"><el-button v-if="isActive==2" type="danger" plain round @click="refuse(item.id,item.refundId)" :disabled="disabled" size='small'>拒绝</el-button></a>
                  <router-link :to="{name:'reserveDetail',query:{id:item.id,tab:$route.query.tab,refundId:item.refundId,type:item.type }}">
                    <el-button type="primary" plain round style="marginLeft:10px" size='small'>查看详情</el-button>
                  </router-link>
                  </li>
              </ul>
            </div>
          </div>
      </div>
      <MyPagination :page="pageOption.page" :pageSize="pageOption.pageSize" :method="findList" :pageSizes=[5] :total="pageOption.total" ></MyPagination>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import ExportButton from '../../components/ExportButton.vue'
import {getReserveList,isRefuseSub,exportForGoodsApi,exportReserveList} from "../../api/orderManagerApi"
import {datenTimeFilter,hour,hourFil} from "../../constant/filter"
import { confirm, success, error } from '../../actions/index'

export default {
   name:'reserveList' ,
   components:{Breadcrumb,MyPagination, ExportButton},
   data(){
     return{
       disabled: false,
       isActive:0,
       status:0, //订单类型(不传或为空，代表搜索全部)，待付款(0), 已付款(1), 退款中(2), 已退款(3), 已取消(4) ,
       navList:["待付款","已付款","退款中","已退款","已取消"],
       userType: 2, //用户类型，1、学生；2、老师； ,
       keyType: 1, //关键词类型，1、姓名；2、手机号码；3、预课单号； 
       roleOptions:[{label:"学生",value:1},{label:"老师",value:2}],
       typeOptions:[{label:"姓名",value:1},{label:"手机号码",value:2},{label:"预课单号",value:3}],
       keyWord:"", //搜索关键字
       placeholder:"请输入姓名查询",
       navTitle:["预约教师","是否拼课","总课时","原价/元","优惠价/元","实付金额/元","补贴金/元","预约学员","状态"],
       pageOption:{
         page:1,
         pageSize:5,
         total:null,
         list:[]
        },
        pageStart:{
          page:1,
          pageSize:5,
        }
     }
   },
   created(){
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
      this.isActive = this.$route.query.tab || 0
      this.changeActive(this.isActive,this.$route.query.page)
   },
   methods:{
     datenTimeFilter,
     hour,
     hourFil,
     changeActive(index,page){
      this.isActive = index;
      this.$router.replace({ query: { ...this.$route.query,page:1,tab:index} })
      this.findList({...this.pageStart})
     },
     changeSelect(){
      this.placeholder = [
        "请输入姓名查询",
        "请输入手机号码查询",
        "请输入预课单号查询",
      ][this.keyType-1];
     },
    exportList({start, end}){
      //有搜索条件的导出
      return exportReserveList({start, end,status:this.isActive*1,userType:this.userType,keyWord:this.keyWord,keyType:this.keyType})

       //return exportReserveList({start, end,status:this.isActive*1})
      },
     findList(page={}){
        getReserveList({...page,status:this.isActive*1,userType:this.userType,keyWord:this.keyWord,keyType:this.keyType})
        .then(data=>{
          //console.log(data,"shuju")
            this.pageOption = {...data,page:data.pageNum}
          })
        .catch(error =>{console.log(error)})
     },
     search(){
       this.findList({...this.pageStart})
     },
     reset(){
        this.keyWord = "";
        this.userType = 2
        this.keyType = 1
        this.placeholder ='请输入姓名查询'
        this.findList({...this.pageStart})
     },
     agree(id,refundId){
        confirm( '你确定要同意退款吗','warning','退款提示')
        .then(()=>{           
            isRefuseSub({id,status:1,refundId})
            .then((data)=>{
               console.log('data:',data)
                this.$message({
                  type: 'success',
                  message: '退款成功!'
                });
                this.findList({...this.pageStart})
            })
            .catch(({msg})=>{error(msg)})
        })
     },
     refuse(id,refundId){
         confirm( '你确定要拒绝退款吗','warning','退款提示')
        .then(()=>{
            isRefuseSub({id,status:2,refundId})
            .then(data=>{
              console.log(data)         
                this.$message({
                  type: 'success',
                  message: '拒绝退款成功!'
                });
                this.findList({...this.pageStart})               
            })
            .catch(({msg})=>{error(msg)})
        })
     }
   }
}
</script>

<style lang="less" scoped>
    .reserveList{
       padding:0;
       margin:0;
      .reserveList_content{
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
          margin-bottom:20px;
          .el-col{
            line-height: 80px;
            margin:0 15px;
          }
        }
        .list_content{
          background-color: #fff;
          .list_title{
            // background-color: rgb(236, 234, 234);
            color:rgb(73, 88, 105);
            font-weight: 700;
            padding: 0 20px;
            li{
              line-height: 74px;
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
                line-height: 20px;
                p{
                  height: 60px;
                  line-height: 60px;
                }
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
             li:nth-child(6){
              width:13%;
            }
             li:nth-child(5){
              width:13%;
            }
            li:nth-child(8){
              width:20%;
            }
            li:last-child{
              min-width:200px;
              display: flex;
              justify-content: center;
            }
          }
        }
      }
    }
</style>
<style lang="less">
  #reserveList{
    .search_box{
      .el-input__inner{
        border-radius: 20px;
      }
    }
  }
</style>

