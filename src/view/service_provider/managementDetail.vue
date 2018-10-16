<!--  -->
<template>
  <div class='managementDetail'>
   <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>服务商详情({{type==0?'企业':'个人'}})</el-breadcrumb-item>
    </Breadcrumb>
    <h3 class="caption">
      服务商详情({{type==0?'企业':'个人'}})
    </h3>
    <!-- 认证详情 -->
    <div class="contents" v-show="type==1">
        <div class="logo">
          <img :src="personaldata.logo" alt="" class="user" onerror="onerror=null;src='../../../static/img/admin.png'">
          <h3>{{defValFilter02(0,0,personaldata.name)}}</h3>
          <p class="status">{{ ['未认证','待审核','已认证','认证失败'][personaldata.authenticationStatus] }}</p>
        </div>
        <!-- 详情信息 -->
       <div class="details pdetails">
          <div class="details_1">
              <ul>
                <li>
                  <span>账号:</span>
                  <span>{{defValFilter02(0,0,personaldata.phone)}}</span>  
                </li>
                <li>
                  <span>可用余额:</span>
                  <span>￥{{personaldata.available}}</span>  
                </li>
                <li>
                  <span>不可用余额:</span>
                  <span>￥{{personaldata.unAvailable}}</span>  
                </li>
                <li>
                  <span>类型:</span>
                  <span>
                    {{type==0?'企业':'个人'}}
                  </span>  
                </li>
                <li>
                  <span>状态:</span>
                  <span>
                    {{['启用','禁用'][personaldata.status]}}
                  </span>  
                </li>
              </ul>
          </div>
          <div class="details_1">
              <ul>
                <li>
                  <span>身份证号码:</span>
                  <span>{{defValFilter02(0,0,personaldata.idcard)}}</span>  
                </li>
                <li>
                  <span>注册时间:</span>
                  <span>{{datenTimeFilter(0,0,personaldata.createTime)}}</span>  
                </li>
                <li>
                  <span>联系人电话:</span>
                  <span>{{defValFilter02(0,0,personaldata.contactPhone)}}</span>  
                </li>
                <li>
                  <span>联系人地址:</span>
                  <span>{{defValFilter02(0,0,personaldata.contactAddress)}}</span>  
                </li>
                <li>
                  <span>联系人姓名:</span>
                  <span>
                    {{defValFilter02(0,0,personaldata.contactName)}}
                  </span>  
                </li>
              </ul>
          </div>
          <div class="details_1">
              <ul>
                <li>
                  <span>户籍地址:</span>
                  <span>
                    {{defValFilter02(0,0,personaldata.permanentAddress)}}
                  </span>  
                </li>
                <li>
                  <span>详细地址:</span>
                  <span>{{defValFilter02(0,0,personaldata.permanentAddress)}}</span>  
                </li>
                <li>
                  <span>签约时间:</span>
                  <span>{{datenTimeFilter(0,0,personaldata.startTime)}}</span>  
                </li>
                <li>
                  <span>认证时间:</span>
                  <span>{{datenTimeFilter(0,0,personaldata.applyTime)}}</span>  
                </li>
              </ul>
          </div>
       </div>
    </div>
       <div class="contents"  v-show="type!=1">
        <div class="logo">
          <img :src="companydata.logo" alt="" class="user" onerror="onerror=null;src='../../../static/img/admin.png'">
          <h3>{{defValFilter02(0,0,companydata.name)}}</h3>
          <p class="status">{{ ['未认证','待审核','已认证','认证失败'][companydata.authenticationStatus] }}</p>
        </div>
        <!-- 详情信息 -->
       <div class="details cdetails">
          <div class="details_1">
              <ul>
                <li>
                  <span>账号:</span>
                  <span>{{defValFilter02(0,0,companydata.phone)}}</span>  
                </li>
                <li>
                  <span>注册时间:</span>
                  <span>{{datenTimeFilter(0,0,companydata.createTime)}}</span>  
                </li>
                <li>
                  <span>统一信用社会代码:</span>
                  <span>{{defValFilter02(0,0,companydata.companyCreditCode)}}</span>  
                </li>
                <li>
                  <span>类型:</span>
                  <span>
                    {{type==0?'企业':'个人'}}
                  </span>  
                </li>
                <li>
                  <span>状态:</span>
                  <span>
                    {{['启用','禁用'][companydata.status]}}
                  </span>  
                </li>
              </ul>
          </div>
          <div class="details_1">
              <ul>
                <li>
                  <span>可用余额:</span>
                  <span>￥{{companydata.available}}</span>  
                </li>
                <li>
                  <span>不可用余额:</span>
                  <span>￥{{companydata.unAvailable}}</span>  
                </li>
                <li>
                  <span>联系人姓名:</span>
                  <span>{{defValFilter02(0,0,companydata.contactName)}}</span>  
                </li>
                <li>
                  <span>联系人电话:</span>
                  <span>{{defValFilter02(0,0,companydata.contactPhone)}}</span>  
                </li>
                <li>
                  <span>联系人地址:</span>
                  <span>
                    {{defValFilter02(0,0,companydata.contactAddress)}}
                  </span>  
                </li>
              </ul>
          </div>
          <div class="details_1">
              <ul>
                <li>
                  <span>公司全称:</span>
                  <span>
                    {{defValFilter02(0,0,companydata.companyName)}}
                  </span>  
                </li>
                <li>
                  <span>法人姓名:</span>
                  <span>{{defValFilter02(0,0,companydata.realName)}}</span>  
                </li>
                <li>
                  <span>法人身份证号:</span>
                  <span>{{defValFilter02(0,0,companydata.idcard)}}</span>  
                </li>
                <li>
                  <span>注册地址:</span>
                  <span>{{defValFilter02(0,0,companydata.companyRegisterAddress)}}</span>  
                </li>
              </ul>
          </div>
       </div>
    </div>
    <!-- 认证信息 -->
    <div class="identity" v-if='type==1'>
      <ul class="identity_info">
        <li>身份证证件</li>
        <li>
          <p>身份证正面</p>
          <img alt="" :src="personaldata.idcardFace"/> 
        </li>
        <li>
          <p>身份证反面</p>
          <img alt="" :src="personaldata.idcardBoth"/> 
        </li>
      </ul>
    </div> 
        <div class="identity">
      <ul class="identity_info" v-if='type==0'>
        <li>认证信息</li>
        <li>
          <p>法人身份证</p>
          <img alt="" :src="companydata.idcardFace"/> 
        </li>
        <li>
          <p>营业执照</p>
          <img alt="" :src="companydata.businessLicense"/> 
        </li>
      </ul>
    </div>  
    <!-- 预约订单 -->
    <div class="operation">
          <ul class="cate_list">
            <li class="cate_li" v-for="(item,index) in list" :class="{blue: changeBlue == index}" @click="reds(index)" :key="index">{{item.name}}</li>
          </ul>
    </div>
    <div class="status" v-if="jilu">
        <ul class="cate_list">
          <li class="cate_li" v-for="(item,index) in arr" :class="{blue: changeStatus == index}" @click="status(index)" :key="index">{{item.name}}</li>
        </ul>
    </div>
    <!-- 所属机构 -->
    <div class="list_content" v-show="changeBlue==0">
      <div class="time_search">
        <div class="search kind">
          <el-input  placeholder="武汉学训宝/请输入机构名称/账号/进行查询" style="width:300px;" v-model="   pageOption.keyWord"></el-input>
        </div>
        <div class="block">
          <el-date-picker
            v-model="tiemValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="selectTime"
            >
          </el-date-picker>
          <el-button  icon="el-icon-search" style="margin-left:10px;background:#51c5ff;color:#fff;" v-bind="pageOption.keyWord"  round @click="search">查询</el-button>
        </div>
      </div>
      <TablePage class="lock">
        <el-table :data="pageOption.list" v-loading="pageOption.loading"  element-loading-text="拼命加载中..." align="center">
          <el-table-column prop="name" label="机构名称"  min-width="80" />
           <el-table-column label="机构头像" width="150" prop="logo">
              <template slot-scope="scope">
               <span><img :src="scope.row.logo"></span>
              </template>
            </el-table-column>
            
          <el-table-column prop="account" label="账号" :formatter="defValFilter02" min-width="130" align="center"/>
          <el-table-column prop="leaderName" label="负责人姓名" :formatter="defValFilter02" min-width="130" align="center"/>
          <el-table-column prop="industry" label="所属行业" :formatter="defValFilter02" min-width="130" align="center"/>    
          <el-table-column prop="addressInfo" label="城市"  min-width="100" align="center"/> 
          <el-table-column prop="createTime" label="创建时间" :formatter="datenTimeFilter" min-width="100" align="center"/> 
          <el-table-column prop="status" label="状态" :formatter="jgStatusFilter"  min-width="100" align="center"/>       
        </el-table>
      </TablePage>
    </div>
    <!-- 结算记录 -->
    <TablePage class="lock" v-show="changeBlue==1" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading"  element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="homeImg" label="课程信息" :formatter="defValFilter02" min-width="200" align="center">
          <template slot-scope="scope">
            <dl>
              <dt>
                <img :src="scope.row.homeImg">
              </dt>
              <dd>
                {{scope.row.name}}
              </dd>
            </dl>  
          </template>
        </el-table-column>  
        <el-table-column prop="mechanismName" label="机构"  :formatter="defValFilter02"  min-width="120" align="center"/>
        <el-table-column prop="salePrice" label="原价" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="discountPrice" label="优惠价" :formatter="currencyFilter"  min-width="130" align="center"/>
        <el-table-column prop="teacherName" label="授课教师" :formatter="defValFilter02" min-width="130" align="center"/>    
        <el-table-column prop="createTime" label="创建时间" :formatter="datenTimeFilter" min-width="100" align="center"/> 
        <el-table-column prop="status" :formatter="jsStatusFilter" label="状态"  min-width="100" align="center"/>       
      </el-table>
    </TablePage>
    <!-- 提现记录 -->
    <TablePage class="lock" v-show="changeBlue==2" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading" element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="tradeNo" label="提现单号" :formatter="defValFilter02" min-width="180" align="center"/>
        <el-table-column prop="fullName" label="提现服务商"  :formatter="defValFilter02"  min-width="120" align="center"/>
        <el-table-column prop="type" label="服务商类型"  min-width="130" align="center">
          <template slot-scope="scope">
           <div>{{type==0?'企业':'个人'}}</div>
          </template>
        </el-table-column>  
        <el-table-column prop="money" label="提现金额" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="quota" label="手续费" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="quotaMoney" label="实际到账" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="card" label="到帐账户"  min-width="370">
          <template slot-scope="scope">
                <div>{{scope.row.name}}|</div>
                <div>{{scope.row.card}}|</div>
                <div>{{scope.row.userName}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="serialNumber" v-if="pageOption.status==4" label="转账交易单号" :formatter="defValFilter02" min-width="170" align="center"/>
        <el-table-column prop="creattime" v-if="pageOption.status==1" label="申请时间" :formatter="datenTimeFilter" min-width="100" align="center"/>
        <el-table-column prop="auditTime" label="审核时间" v-if="pageOption.status==2"  :formatter="datenTimeFilter" min-width="100" align="center"/>
        <el-table-column prop="remitTime" label="打款时间" v-if="pageOption.status==4" :formatter="datenTimeFilter" min-width="100" align="center"/>
        <el-table-column prop="auditTime" label="拒绝时间" v-if="pageOption.status==3"  :formatter="datenTimeFilter" min-width="100" align="center"/>
        <el-table-column prop="reason" label="拒绝理由" v-if="pageOption.status==3"  :formatter="defValFilter02" min-width="100" align="center"/>
       </el-table>
    </TablePage>
    <MyPagination :page="pageOption.page" :size="pageOption.pageSize" :method="findList" :pageSizes=[10] :total="pageOption.total" ></MyPagination>  
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import {personalProviderApi, companyProviderApi, searchProviderApi } from '../../api/institutionManagementApi'
import {getBalancejListApi} from '../../api/balanceListApi'
import {getSupplierCashListUserApi} from '../../api/supplierApi'
import { datenTimeFilter,currencyFilter,jsStatusFilter,jgStatusFilter,labelFilter,defValFilter02} from "../../constant/filter";
export default {
  name: "managementDetail",
  components: { Breadcrumb, MyPagination, TablePage },
  data() {
    return {
      disabled: false,
      value:'',
      value1: "",
      value2: "",
      value4: true,
      value5: false,
      dataEdit: false,
      keyword: null,
      changeBlue: 0,   //1级
      changeStatus: 0, //2级
      jilu: false,
      tiemValue: [],//时间数组
      type: Number(this.$route.query.type),   // 0企业 1个人
      id: Number(this.$route.query.id),
      user: {
      },
      companydata:{},  //企业
      personaldata:{}, //个人
 
      dynamicTags2: [],
      navTitle: [],
      arr: [],
      inputVisible: false,
      inputValue: "",
      list: [
        { type: 0, name: "所属机构" },
        { type: 1, name: "结算记录" },
        { type: 2, name: "提现记录" },
      ],
      status0: [
        { type: 0, name: "待付款" },
        { type: 1, name: "已付款" },
        { type: 2, name: "退款中" },
        { type: 3, name: "已退款" },
        { type: 4, name: "已取消" }
      ],
      status1: [
        { type: 0, name: "待结算" },
        { type: 1, name: "结算中" },
        { type: 2, name: "已结算" }
      ],
      status2: [
        { type: 0, name: "审核中" },
        { type: 1, name: "打款中" },
        { type: 2, name: "已打款" },
        { type: 3, name: "已拒绝" }
      ],
    
      pageOption: {
        page: 1,
        pageSize: 5,
        status: 0,
        start: null,
        end: null,
        keyWord: null,
        list: [],

      },
  
    };
  },
   created() {
    //  let id = this.$route.query.id
    //  this.type = this.$route.query.type
     if(this.type == 1){
        personalProviderApi(this.id).then(data=>{
          this.personaldata = data
            // this.findList()
        })
     }
     else {
       companyProviderApi(this.id).then(data=>{
         this.companydata = data
          //  this.findList()
       })
     }
    this.init()
  },
  methods: {
    datenTimeFilter,
    currencyFilter,
    jsStatusFilter,
    jgStatusFilter,
    labelFilter,
    defValFilter02,

    reds(index) {   //一级导航
      this.changeBlue = index;
      // this.pageOption.status = index 
      this.navTitle = this["navTitle" + index];
       this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.changeStatus = 0;
        this.pageOption.status=0
      if(index==0) {
        this.jilu = false;
      }else{
         this.jilu = true;
        this.pageOption.status == this.changeStatus

      }
      // if (index==1) {
      //    this.changeStatus = 0;
      //   
      //   this.pageOption.status == this.changeStatus 
      //   if (this.changeBlue==2) {
      //     this.pageOption.status = this.changeStatus+1;
      //   }
       
      // }

        this.arr = this["status" + index];
     
      this.findList({page:1});
    },
    status(index) {     //二级导航
      this.changeStatus = index;
      this.pageOption.status = index;
      this.$router.replace({ query: { ...this.$route.query,page:1} })
    
    
      this.findList({page:1});
    },
    //选择时间
    selectTime(){
      this.pageOption.start = Data.parse(this.tiemValue[0])
      this.pageOption.end = Data.parse(this.tiemValue[1])
    },
    //搜索
    search(){
      this.findList()
    },
    findList(page = {}) {
      if(this.changeBlue==0)
      {
        searchProviderApi({providerId:this.id,...this.pageOption,...page}).then(data=>{
          
          this.pageOption = {...this.pageOption,...data,...page}
        }) 
      }
      if(this.changeBlue==1)
      {
       getBalancejListApi({...this.pageOption,...page,providerId:this.id}).then(data=>{
          this.pageOption = {...this.pageOption,...data,...page}
       }) 
      }
      if (this.changeBlue==2){
        if( this.changeStatus ==2)
        {
           this.pageOption.status = this.changeStatus+2
        }
        if(this.changeStatus == 3)
        {
          this.pageOption.status = this.changeStatus
        }
        if(this.changeStatus == 0 || this.changeStatus == 1)
        {
          this.pageOption.status = this.changeStatus+1
        }
      getSupplierCashListUserApi({...this.pageOption,...page,userId:this.id}).then(data=>{
          this.pageOption = {...this.pageOption,...data,...page}
       })  
      }
    },


    init(){
     
    }
  }
};
</script>
<style lang='less' scoped>
.managementDetail {
  .caption {
    width: 100%;
    height: 70px;
    border-left: 3px solid #4ebbf2;
    background: #fff;
    line-height: 70px;
    padding-left: 32px;
    font-size: 24px;
    color: #4ebbf2;
    position: relative;
    .btn {
      float: right;
      margin-right: 32px;
    }
  }
  .contents {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .logo {
      width: 322px;
      // height: 370px;
      background: #fff;
      text-align: center;
      .user {
        width: 110px;
        height: 110px;
        margin-top: 44px;
        margin-bottom: 29px;
        border-radius: 50%;
      }
      h3 {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin-bottom: 19px;
        img {
          vertical-align: middle;
          padding-left: 10px;
        }
      }
      .status {
        width: 78px;
        height: 28px;
        background-color: #ffb300;
        border-radius: 6px;
        line-height: 28px;
        color: #fff;
        margin: 0 auto;
        margin-bottom: 48px;
      }
      .time {
        font-size: 14px;
        color: #999;
        padding-bottom: 20px;
      }
    }
    .details {
      width: 80%;
      margin-left: 10px;
      // height: 370px;
      background: #fff;
      display: flex;
      justify-content: space-around;
      .details_1,
      .details_2 {
        // width: 33%;
        // background: red;
        margin-top: 32px;
        margin-left: 72px;
        ul {
          li {
            width: 100%;
            // position: relative;
            // display: flex;
            // justify-content: space-between;
            height: 80px;
            color: #333;
            font-size: 18px;
            span:first-child {
              width: 95px;
              display: inline-block;
            }
            span:last-child {
              // padding-left: 30px;
            }
            .ks {
              //  padding-top: 10px;
              span:first-child {
                width: 151px;
                display: inline-block;
              }
              .el-input {
                width: 19%;
              }
            }
            .dj {
              float: left;
              margin-right: 50px;
              padding-bottom: 10px;
            }
            .tag {
              // width: 61%;
              margin-top: 10px;
              display: inline-block;
            }
          }
        }
      }
      .details_1 {
        width: 33%;
      }
  
    }
    //服务商个人详情
    .pdetails{
      >.details_1:nth-of-type(1){
        width: 30%;
        margin-left: 30px;
        >ul{
         li{
           display: flex;
         >span:nth-of-type(1){
             width: 100px;
           }
           >span:nth-of-type(2){
             flex: 1;
           }
         }
       }
      }
      >.details_1:nth-of-type(2){
        margin-left: 20px;
       >ul{
         li{
           display: flex;
         }
       }
      }
       >.details_1:nth-of-type(3){
         width: 37%;
         padding-right: 20px;
       >ul{
         li{
           display: flex;
           >span:nth-of-type(1){
             width: 100px;
           }
           >span:nth-of-type(2){
             flex: 1;
           }
         }
       }
      }
    }
    //服务商企业详情
       .cdetails{
      >.details_1:nth-of-type(1){
        width: 30%;
        margin-left: 30px;
         >ul{
         li{
           display: flex;
         >span:nth-of-type(1){
             width: 100px;
           }
           >span:nth-of-type(2){
             flex: 1;
           }
         }
       }
      }
      >.details_1:nth-of-type(2){
        margin-left: 20px;
       >ul{
         li{
           display: flex;
         }
       }
      }
       >.details_1:nth-of-type(3){
         width: 37%;
         padding-right: 20px;
       >ul{
         li{
           display: flex;
           >span:nth-of-type(1){
             width: 100px;
           }
           >span:nth-of-type(2){
             flex: 1;
           }
         }
       }
      }
    }
  }
  //认证信息
  .identity{
    margin-top: 10px;
    margin-bottom: 10px;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    display: flex;
    .identity_info{
      display: inherit;
      width: 100%;
      justify-items: center;
      >li:nth-of-type(1){
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      >li{
        width: 33.3%;
        text-align: center;
        font-size: 20px;
        color:#333;
        p{
          margin-bottom: 20px; 
        }
        img{
          width: 300px;
          height: 200px;
        }
      }
    }
  }
  .operation {
    // margin-top: 10px;
    margin: 10px 0;
    .cate_list {
      height: 70px;
      background: #fff;
      line-height: 70px;
      box-sizing: border-box;
      li {
        float: left;
        height: 100%;
        margin-left: 72px;
        cursor: pointer;
        padding: 0 10px;
      }
      .blue {
        border-bottom: 3px solid #4ebbf2;
      }
    }
  }
  .status {
    .cate_list {
      height: 70px;
      // line-height: 70px;
      li {
        float: left;
        height: 44px;
        margin-left: 72px;
        cursor: pointer;
        padding: 0 10px;
        color: #999;
        margin-top: 13px;
        line-height: 44px;
      }
      .blue {
        // line-height: 70px;
        background-color: #51c5ff;
        border-radius: 22px;
        color: #fff;
      }
    }
  }
  .noMsg {
    line-height: 35px;
    text-align: center;
    padding-bottom: 10px;
  }
  .list_title {
    // background-color: rgb(236, 234, 234);
    color: rgb(73, 88, 105);
    font-weight: 700;
    padding: 0 20px;
    display: flex;
    justify-content: space-around;
    background-color: #eee;
    li {
      line-height: 74px;
    }
  }
   .list_content{ 
        background-color: #fff;          
      .time_search {
        height: 74px;
        line-height: 74px;
        background-color: #fff;
        padding-left: 15px;
        font-size: 18px;
        display: flex;
        margin-bottom: 20px;
        .block {
          margin-left: 10px;
          .el-range-separator {
            width: 10%;
          }
          .Button {
            margin-left: 10px !important;
          }
        }
      }
       
        }
        
  .el-pagination {
    text-align: center;
  }
 
}
</style>
<style lang='less'>
.managementDetail {
  th{
    text-align: center;
  }
  .cell{
    display: flex;
    justify-content: center;
    dl{
      display: flex;
      dt{
        width: 100px;
        height: 60px;
        >img{
          width: 100%;
          height: 100%;
        }
      }
      dd{
        text-align: left;
        width: 100px;
        align-items: center;
        padding-left: 5px;
      }
    }
    span{
      display: inline-block;
      width: 100%;
      height: 60px;
      >img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .details_2 {
    .el-tag {
      width: auto !important;
    }
    .el-select{
      width:119px;
    }
    .courseCreate{
      .el-input{
        width:100%;
        margin-top:10px;
      }
    }
  }
  // .lock{
  //         .yc{
  //           display: none;
  //           background: red;
  //         }
  //       }

}
</style>
