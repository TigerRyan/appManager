<template>
  <div class="content_data offlineList" id="offlineList">
   <Breadcrumb/>
   <div class="offlineList_content">
     <ul class="nav">
        <li v-for="(item,index) in navList" :key="index" @click="changeActive(index)" :class="index==isActive?'isactive':''">{{item}}</li>
     </ul>
     <el-row class="search_box" :gutter="15">
       <el-col :span="3">
          <el-select v-model="keyType"  @change='changeSelect'>
             <el-option v-for="(item,index) in typeOption" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
       </el-col>
       <el-col :span="4">
         <el-input v-model.trim="keyWord" :placeholder="placeholder"></el-input>
       </el-col>
       <el-col :span="7">
          <el-date-picker
            v-model="tiemValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="selectTime"
            :picker-options="pickerOptions0"
					>
				</el-date-picker>
       </el-col>
        <el-col :span="5">
            <el-button type="primary" round @click="search">搜索</el-button>
             <el-button icon="el-icon-refresh" style="background:#ecf5ff" round @click="reset">重置</el-button>
        </el-col>
        <ExportButton :method="exportList"/>
     </el-row>
     <div class="list_content">
        <ul class="list_title">
          <li v-for="(item,index) in navTitle" :key="index">{{item}}</li>
          <li v-if="isActive==0 || isActive==1|| isActive==4">实际付款</li>
          <li v-if="isActive==1">第三方交易单号</li>
          <li v-if="isActive==2 || isActive==3 ">退款金额</li>
          <li v-if="isActive==2">退款原因</li>
          <li v-if="isActive==3">退款时间</li>
          <li v-if="isActive==4">取消时间</li>
          <li>操作</li>
        </ul>
        <p class="noMsg" v-if="pageOption.list.length==0">暂无数据...</p>
        <div class="list" v-for="(item,index) in pageOption.list" :key="index">
           <p class="number_time"><span>订单编号:{{item.orderNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
           <div class="wrap_box">
            <ul class="list_wrap">
              <!-- 机构名称 -->
              <li>{{item.mechanismName }}</li>
              <!-- 课程信息 -->
              <li class="need_flex"> 
                  <div class="img_box"><img :src="item.courseImg" alt=""></div>
                  <p>{{item.courseName}}</p>
              </li>
              <!-- 优惠价原价 -->
              <li>
                <p class="span_flex"><span>优惠价:{{(item.discountPrice).toFixed(2)}}</span><span class="price">原价:{{(item.salePrice).toFixed(2)}}</span></p>
              </li>
              <!-- 学生信息-->
              <li>
                <p class="span_flex"><span>{{item.userName}}</span><span>{{item.grade}}</span></p>
              </li>
              <!-- 实际支付金额   待付款(0),已付款(1),已取消(4)-->
              <li v-if="isActive==0||isActive==1 || isActive==4">
                <p class="span_flex"><span>{{(item.amount).toFixed(2)}}</span><span class="pay_type">{{item.payType==1?'微信':item.payType==2?'支付宝':'余额支付'}}</span></p>
              </li>
              <!-- 第三方交易单号  已付款(1)-->
              <li v-if="isActive==1">
                  {{item.thirdOrderNo }}
              </li>
              <!-- 退款金额  退款中(2), 已退款(3),-->
              <li v-if="isActive==2 || isActive==3">￥{{(item.money).toFixed(2)}}</li>
             <!-- 退款原因   退款中(2),-->
              <li v-if="isActive==2">
                <p><span>{{item.reason}}</span></p>
              </li>
              <!-- 退款时间  已退款(3)-->
              <li v-if="isActive==3">{{datenTimeFilter(0,0,item.refundTime)}}</li>
              <!-- 取消时间  已取消(4)-->
              <li v-if="isActive==4">{{datenTimeFilter(0,0,item.expiredTime)}}</li>
              <li><router-link :to="{name:'offlineDetail',query:{id:item.id,type:isActive,refundId:item.refundId}}"><el-button type="primary" plain round>查看详情</el-button></router-link></li>
          </ul>
        </div>
      </div>
     </div>
     <MyPagination :page="pageOption.page" :pageSize="pageOption.pageSize" :total="pageOption.total" :method="findList" :pageSizes=[5]></MyPagination>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import ExportButton from '../../components/ExportButton.vue'
import {getOfflineList,exportForGoodsApi,getSubjectApi,exportOffList} from "../../api/orderManagerApi"
import {datenTimeFilter} from "../../constant/filter"
export default {
  name:'offlineList',
  components:{Breadcrumb,MyPagination,ExportButton},
  data(){
    return{
      grades:null,
      isActive:0, //订单类型(不传或为空，代表搜索全部)，待付款(0), 已付款(1), 退款中(2), 已退款(3), 已取消(4) ,
      navList:["待付款","已付款","退款中","已退款","已取消"],
      keyType: 1,
      tiemValue:[],
      pickerOptions0:{},
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

      list:[],
      disabled: false,
      }
    }
  },
  created(){
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
    this.isActive = this.$route.query.tab || 0
    // this.isActive = 0
    this.changeActive(this.isActive,this.$route.query.page)

  },
  methods:{
    datenTimeFilter,
    changeActive(index,page){      
      this.isActive = index;
      this.$router.replace({ query: { ...this.$route.query,page:1,tab:index}})
      this.findList({...this.pageStart})
     },
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
     exportList({start, end}){
       //有搜索条件的导出
       return exportOffList({start,end,status:this.isActive*1,keyType:this.keyType,keyWord:this.keyWord})
       
      //return exportOffList({start,end,status:this.isActive*1})
     },
      findList(page={}){
      const start = this.tiemValue && this.tiemValue[0] ?this.tiemValue[0].getTime(): ""
      const end = this.tiemValue&& this.tiemValue[1] ?this.tiemValue[1].getTime(): ""
        getOfflineList({...page,status:this.isActive*1,keyWord:this.keyWord,keyType:this.keyType,start,end})
        .then(data=>{
          // console.log(data,"shuju")
            this.pageOption = {...data,page:data.pageNum} 

            if(this.pageOption.list.length>0){
              getSubjectApi().then(data=>{
                this.grades = data
                this.pageOption.list.forEach(item=>{
                  this.grades.forEach(itm=>{
                    if(item.grade == itm.id && itm.itemLevels == 1){
                      item.grade = itm.itemName     
                    }
                  })
                }) 
              }) 
            }
          })
        .catch(error =>{console.log(error)})
     },
     search(){
        this.findList({...this.pageStart})
     },
     reset(){
       this.keyWord =""
       this.keyType = 1
       this.tiemValue = []
       this.placeholder='请输入学生姓名'
       this.findList({...this.pageStart})
     }

  }
}
</script>

<style lang="less" scoped>
   .offlineList{
     .offlineList_content{
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
          .el-col:nth-of-type(1){
            margin-left:20px;
          }
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
  #offlineList{
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


