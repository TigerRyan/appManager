<!--  -->
<template>
  <div class='teacherDetails'>
   <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>机构详情</el-breadcrumb-item>
    </Breadcrumb>
    <h3 class="caption">
      机构详情
    </h3>
    <div class="contents">
        <div class="logo">
          <img :src="user.logo" alt="" class="user" onerror="onerror=null;src='../../../static/img/admin.png'" style="width:84px;height:84px">
          <h3>{{user.name || '未知'}}<span class="zy">{{ user.type==0?'直营':'加盟' }}</span></h3>
          <p class="status">{{ auditFilter(0,0,user.status) }}</p>
          <p class="time">入驻时间：{{ dateFilter(0,0,user.createTime) }}</p>
        </div>
       <div class="details">
          <div class="details_1">
              <ul>
                <li>
                  <span>账号:</span>
                  <span>{{ user.account }}</span>  
                </li>
                
                <li>
                  <span>可用余额:</span>
                  <span>￥{{ user.available }}</span>  
                </li>
                <li>
                  <span>不可用金额:</span>
                  <span>￥{{ user.settlement }}</span>  
                </li>
                
                <li>
                  <span>状态:</span>
                  <span>
                    <i class="zt">{{ user.status==2?'启用':'禁用' }}</i>
                  </span>  
                </li>
                <li>
                  <span>推荐状态:</span>
                  <span>
                    <i class="zt">{{ user.recommendTime?'推荐':'不推荐' }}</i>
                  </span>  
                </li>
              </ul>
          </div>
          <div class="details_2">
              <ul>
                <li>
                  <span>负责人姓名:</span>
                  <span>{{ user.leaderName }}</span>  
                </li>
                <li>
                  <span>负责人电话:</span>
                  <span>{{ user.phone }}</span>  
                </li>
                <li>
                  <span>营业执照号:</span>
                  <span style="width:211px">{{ user.businessLicenceNo }}</span>  
                </li>
               <li>
                  <span>营业执照全称:</span>
                  <span>{{ user.businessLicenceName }}</span>  
                </li>
                <li>
                  <span>机构行业:</span>
                  <span>                 
                   {{ user.industry }}
                  </span>
                </li>               
              </ul>
          </div>
          <div class="details_3">
            <ul>
              <li>
                  <span>机构电话:</span>
                  <span>{{ user.phone }}</span>  
                </li>
              <li>
                <span>门店地址:</span>
                <span>{{ user.addressInfo?user.addressInfo.split(',').join(''):'无' }}</span>  
              </li>
              <li>
                <span style="white-space:nowrap;">门店详细地址:</span>
                <span>{{ user.address?user.address:'无'}}</span>  
              </li>
            </ul>
          </div>
       </div>
    </div>

    <!-- 机构优势，营业执照 -->
    <div class="labelImg">
      <ul>
        <li>
          <span>机构优势:</span>
          <span>
            <div class="tag">
              <el-tag
                :key="index"
                v-for="(tag,index) in user.skills?user.skills.split(/[,，]/):'无'"
                :disable-transitions="false"
               >
                {{tag}}
              </el-tag>
            </div>
          </span>  
        </li>
        <li>
          <span>服务群体:</span>
          <span class="courseCreate">
            <el-tag
                :key="index"
                v-for="(tag,index) in dynamicTags1"
                :disable-transitions="false"
                >
                {{tag}}
            </el-tag>
          </span>  
        </li>
        <li>
          <span>教学科目:</span>
          <span class="courseCreate">
            <el-tag
                :key="index"
                v-for="(tag,index) in dynamicTags2"
                :disable-transitions="false"
               >
                {{tag}}
            </el-tag>
          </span>  
        </li>
      </ul>
      <div class="license">
        <div class="license_1">
            <p>营业执照</p>
            <img :src="user.businessLicence" alt="" onerror="onerror=null;src='../../../static/img/admin.png'">
        </div>
        <div class="license_1">
            <p>负责人身份证</p>
            <img :src="user.certCard" alt="" onerror="onerror=null;src='../../../static/img/admin.png'">
        </div>
        <div class="license_1">
            <p>合同附件</p>
            <img :src="user.businessContract" alt="" onerror="onerror=null;src='../../../static/img/admin.png'">
        </div>
      </div>
    </div>

    <!-- 一 二导航 -->
    <div class="operation">
          <ul class="cate_list">
            <li class="cate_li" v-for="(item,index) in list" :class="{blue: changeBlue == index}" @click="reds(index)" :key="index">{{item.name}}</li>
          </ul>
    </div>
    <div class="status" v-show="jilu">
        <ul class="cate_list">
          <li class="cate_li" v-for="(item,index) in arr" :class="{blue: changeStatus == index}" @click="status(index)" :key="index">{{item.name}}</li>
        </ul>
    </div>
    <!-- 线下课程订单 -->
    <div class="list_content" v-show="changeBlue==0">
      <ul class="list_title">
          <li v-for="(item,index) in navTitle" :key="index">{{item}}</li>
          <li v-if="changeStatus==0 || changeStatus==1|| changeStatus==4">实际付款</li>
          <li v-if="changeStatus==1">第三方交易单号</li>
          <li v-if="changeStatus==2 || changeStatus==3 ">退款金额</li>
          <li v-if="changeStatus==2">退款原因</li>
          <li v-if="changeStatus==3">退款时间</li>
          <li v-if="changeStatus==4">取消时间</li>

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
                  <p class="span_flex"><span>优惠价:{{item.discountPrice}}</span><span class="price">原价:{{item.salePrice }}</span></p>
                </li>
                <li>
                  <p class="span_flex"><span>{{item.userName}}</span><span>{{item.grade}}</span></p>
                </li>
                <li v-if="changeStatus==0||changeStatus==1||changeStatus==4">
                  <p class="span_flex"><span>{{item.amount}}</span><span class="pay_type">{{item.payType==1?'微信':item.payType==2?'支付宝':'余额支付'}}</span></p>
                </li>
                <li v-if="changeStatus==1">
                  {{item.thirdOrderNo }}
                </li>
                <li v-if="changeStatus==2 || changeStatus==3">{{item.money }}</li>
                <li v-if="changeStatus==2">
                  <p><span>{{item.reason}}</span></p>
                </li>
                <li v-if="changeStatus==3">{{datenTimeFilter(0,0,item.refundTime )}}</li>
                <li v-if="changeStatus==4">{{datenTimeFilter(0,0,item.refundTime)}}</li>
              </ul>
            </div>
        </div>
    </div>
    <!-- 结算记录 -->
    <TablePage class="settlement" v-show="changeBlue==1" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading" @sort-change="sort" element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="id" label="课程信息"  min-width="150" align="center">
          <template slot-scope="scope"  >
            <div class="course_information">
               <img :src="scope.row.homeImg" width="100" height="70" alt="">
              <span>{{ scope.row.name }}</span>
            </div>
          </template> 
        </el-table-column>
        <el-table-column prop="mechanismName" label="机构信息"    min-width="120" align="center"/>
        <el-table-column prop="salePrice" label="原价"  min-width="130" align="center"/>
        <el-table-column prop="discountPrice" label="优惠价"  min-width="130" align="center"/>
        <el-table-column prop="teacherName" label="授课教师"  min-width="130" align="center"/>    
        <el-table-column prop="createTime" label="创建时间" :formatter="datenTimeFilter" min-width="100" align="center"/>    
        <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <!-- <p>{{ scope.row.courseStartTime > this.times ? '未上课': scope.row.courseEndTime > this.times ? '上课中':'已上课'  }}</p> -->
             <p>{{Date.parse(new Date()) < scope.row.courseStartTime  ? '未上课': Date.parse(new Date()) < scope.row.courseEndTime ? '上课中':'已上课'  }}</p>
            </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <!-- 提现记录 -->
    <TablePage class="lock" v-show="changeBlue==2" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading" @sort-change="sort" element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="id" label="提现单号"  min-width="100" align="center"/>
        <el-table-column prop="fullName" label="提现机构"  min-width="150" align="center">
          <template slot-scope="scope"  >
            <div class="course_information">
               <img :src="scope.row.logo" width="100" height="70" alt="">
              <span>{{ scope.row.fullName }}</span>
            </div>
          </template> 
        </el-table-column>
        <el-table-column prop="money" label="提现金额/元" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="quota" label="手续费" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="money" label="实际到账" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="money" label="可用余额"  min-width="130" align="center"/>
        <el-table-column prop="userName" label="到账用户"  min-width="130" align="center"/>
        <el-table-column v-if="changeStatus==2" prop="tradeNo" label="到账交易单号"  min-width="130" align="center"/>
        <el-table-column v-if="changeStatus==2" prop="auditTime" label="打款时间" :formatter="datenTimeFilter"  min-width="130" align="center"/>
        <el-table-column v-if="changeStatus==0 || changeStatus==1" prop="auditTime" :label="changeStatus==0?'申请时间':'审核时间'" :formatter="datenTimeFilter" min-width="100" align="center"/>
        <el-table-column v-if="changeStatus==3" prop="auditTime" label="拒绝时间" :formatter="datenTimeFilter"  min-width="130" align="center"/>
        <el-table-column v-if="changeStatus==3" prop="reason" label="拒绝理由"  min-width="130" align="center"/>        
      </el-table>
    </TablePage>
    <!-- 课程管理-->
    
      <!-- 课程card   -->
      <div class="offlind_card" v-show="changeBlue==3">
        <div v-if="data.list.length==0" style="text-align: center">暂无数据</div>
        <div class="list">
          <ul>
              <li v-for="(item,index) in pageOption.list" :key="index">
              <img :src="item.pictureUrl || item.homeImg" class="pic" onerror="onerror=null;src='../../../static/img/admin.png'">
              <div class="title">
                <p>{{ item.title || item.name }}</p>
                <el-tag
                  :key="tag"
                  v-for="tag in (item.advantage || item.labels)?(item.advantage || item.labels).split(/[,，]/):''"
                  :disable-transitions="false"
                >
                  {{tag}}
                </el-tag>
                <span class="status" v-if="changeStatus==0">{{ ['未开始','报名中','已结束'][item.state] }}</span>
                <span class="status" v-if="changeStatus==1">{{ ['直播中','回放中','等待直播','无直播课程'][item.liveState] }}</span>

              </div>
              <div class="Grade">
                <div class="name">
                  <img :src="item.teacherPic" alt="" onerror="onerror=null;src='../../../static/img/admin.png'">
                  <span>{{ item.teacher || item.teacherName }}</span>
                 
                  <span>{{ item.level || item.teacherLevel }}</span>
               
                </div>
                <div class="fabulous">
                  <span>点赞量：{{ item.likeNum || item.likeCount || item.followCount || 0 }}</span>
                 
                </div>
              </div>
            </li> 
          </ul>
        </div>    
      </div>
   
   
    <MyPagination :page="pageOption.pageNum" :pageSize="pageOption.pageSize" :method="findList" :pageSizes=[9] :total="pageOption.total" ></MyPagination>  
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import {
  getSubjectApi,
  getDetailsApi,
  getUnderLineListApi,
  getSettlementListApi,
  getUnderVideoListApi,
  getLiveBroadcastListApi,
  getVideoCourseListApi,
  getPutforwardListApi
} from "../../api/institutionalDetails";
import {
  datenTimeFilter,
  currencyFilter,
  orderFilter,
  dateFilter,
  teacherFilter,
  payTypeFilter,
  auditFilter
} from "../../constant/filter";
export default {
  name: "teacherDetails",
  components: { Breadcrumb, MyPagination, TablePage },
  data() {
    return {
      times:Date.parse(new Date()),
      disabled: false,
      dataEdit: false,
      changeBlue: 0,
      changeStatus: 0,
      jilu: true,
      user: {},
      user1: {
        id: this.$route.query.id,
        deleted: "",
        lineSwitch: "",
        level: "",
        payMoney: "",
        skills: null,
        grade: "",
        subject: ""
      },
      dynamicTags: [],
      dynamicTags1: [],
      dynamicTags2: [],
      navTitle: [],
      navTitle0: ["机构", "课程", "价格", "学员"],

      navTitle3: ["课程", "价格", "优惠价格", "积分", "数量"],
      arr: [],
      inputVisible: false,
      inputValue: "",
      list: [
        { type: 0, name: "线下课程订单" },
        { type: 1, name: "结算记录" },
        { type: 2, name: "提现记录" },
        { type: 3, name: "课程管理" }
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
      status3: [
        { type: 0, name: "线下课程" },
        { type: 1, name: "直播课程" },
        { type: 2, name: "视频课程" }
      ],
      pageOption: {
        page: 1,
        pageSize: 9,
        status: 0,
        // userType: 2,
        type:1,
        userId: null,
        list: [],
        targetUserId: null,
        keyType: 1,
        fromUserId: null,
        mechanismId :parseInt(this.$route.query.id)
      },
      options1: [],
      options2: [],
      value4: "",
      data:{
        list:[{name:'课程',pictureUrl:'../../../static/img/admin.png',labels:"优势,可以"}]
      }
    };
  },

  methods: {
    datenTimeFilter,
    currencyFilter,
    orderFilter,
    dateFilter,
    teacherFilter,
    payTypeFilter,
    auditFilter,
    findList(page = {}) {
      if (this.changeBlue == 0) {
         this.pageOption.mechanismId = parseInt(this.$route.query.id);
        getUnderLineListApi({ ...this.pageOption, ...page}).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
          getSubjectApi().then(data => {
              data.forEach(item=>{
                 if (item.itemLevels == 1) {
                    this.pageOption.list.forEach((data,i)=>{
                      if (this.pageOption.list[i].grade==item.id) {
                        this.pageOption.list[i].grade=item.itemName
                      }
                    })
                 }
                
              })
          })

        });
        //获取结算列表
      } else if (this.changeBlue == 1) {
        this.pageOption.mechanismId = parseInt(this.$route.query.id);
        getSettlementListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
        //获取提现记录
      } else if (this.changeBlue == 2) {
        if (this.changeStatus==0) {
          this.pageOption.status=1
        }else if(this.changeStatus==1){
          this.pageOption.status=2
        }else if(this.changeStatus==2){
          this.pageOption.status=4
        }else if(this.changeStatus==3){
          this.pageOption.status=3
        }
        getPutforwardListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
        //获取课程管理
      } else if (this.changeBlue == 3) {     
        if (this.changeStatus == 0) {
            getUnderVideoListApi({ ...this.pageOption, ...page }).then(data => {
            this.pageOption = {
              ...this.pageOption,
              ...page,
              ...data,
              loading: false
            };
          });
        }
        if (this.changeStatus == 1) {
            getLiveBroadcastListApi({ ...this.pageOption, ...page }).then(data => {
            this.pageOption = {
              ...this.pageOption,
              ...page,
              ...data,
              loading: false
            };
          });
        }
        if (this.changeStatus == 2) {
            getVideoCourseListApi({ ...this.pageOption, ...page }).then(data => {
            this.pageOption = {
              ...this.pageOption,
              ...page,
              ...data,
              loading: false
            };
          });
        }
      } 
    },

    reds(index) {
      //一级导航
      this.changeBlue = index; //一级样式
      this.navTitle = this["navTitle" + index];
      this.changeStatus = 0;//二级菜单样式为0
      this.pageOption.status = this.changeStatus;
      this.arr = this["status" + index];//定义二级菜单
      this.findList();
    },
    status(index) {
      //二级导航
      this.changeStatus = index;//二级菜单样式为0
      this.pageOption.status = this.changeStatus;
      this.findList();
    },

    sort({ order, prop }) {
      this.search(
        prop
          ? { [prop]: { descending: 0, ascending: 1 }[order] }
          : { earning: null }
      );
    },

    init() {
      getDetailsApi(this.$route.query.id ).then(data => {
        this.user = data;
        getSubjectApi().then(data => {
          data.forEach(item => {
            if (item.itemLevels == 1) {
              if (this.user.gradeIds) {
                this.user.gradeIds.split(",").forEach(val => {
                if (item.id == val) {
                  this.dynamicTags1.push(item.itemName);
                }
              });
              }
            }
            if (item.itemLevels == 2) {
              if (this.user.subjectIds) {
                this.user.subjectIds.split(",").forEach(val => {
                if (item.id == val) {
                  this.dynamicTags2.push(item.itemName);
                }
              });
              }
            }
          });
        });
      });
    }
  },

  created() {
    this.arr = this.status0;
    this.navTitle = this.navTitle0;
    this.pageOption.userId = parseInt(this.$route.query.id);
    this.pageOption.targetUserId = parseInt(this.$route.query.id);
    
    this.pageOption.fromUserId = parseInt(this.$route.query.id);
    this.init();
    let UserType =
      JSON.parse(window.localStorage.getItem("userInfo")) &&
      JSON.parse(window.localStorage.getItem("userInfo")).type;
    this.disabled = UserType ? true : false;
  }
};
</script>
<style lang='less' scoped>
.teacherDetails {
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
      background: #fff;
      text-align: center;
      .user {
        width: 110px;
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
      .zy {
        margin-left: 10px;
        width: 40px;
        height: 22px;
        border: solid 1px #ffb300;
        border-radius: 4px;
        font-size: 14px;
        color: #ffb300;
        padding: 0 5px;
      }
    }
    .details {
      width: 80%;
      margin-left: 10px;
      background: #fff;
      display: flex;
      justify-content: space-around;
      .details_1,
      .details_2,
      .details_3 {
        margin-top: 32px;
        margin-left: 72px;
        ul {
          li {
            width: 100%;
            margin-bottom: 36px;
            color: #333;
            font-size: 18px;
            display: flex;
            justify-content: flex-start;
            span:first-child {
              width: 114px;
              display: inline-block;
            }
            span:last-child {
              // width: 114px;
              display: inline-block;
              word-wrap:break-word;
            }
            .tag {
              margin-top: 10px;
              display: inline-block;
            }
          }
        }
      }
      .details_1 {
        width: 32%;
        .zt {
          color: #13ce66;
        }
      }
      .details_2 {
        width: 32%;
        margin-left: 0;
      }
      .details_3 {
        width: 32%;
        margin-left: 0;
      }
    }
  }
  .labelImg {
    background: #fff;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    ul {
      width: 50%;
      padding: 68px;
      li {
        width: 100%;
        margin-bottom: 36px;
        color: #333;
        font-size: 18px;
        span:first-child {
          display: inline-block;
          margin-bottom: 7px;
        }
        span:last-child {
        }
        .ks {
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
          display: inline-block;
        }
      }
    }
    .license {
      padding-top: 68px;
      width: 50%;
      display: flex;
      justify-content: space-around;
      .license_1 {
        text-align: center;
        p {
          margin-bottom: 30px;
        }
        img{
          width: 192px;
          height: 130px;
        }
      }
    }
  }
  .operation {
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
  .list_content {
    background-color: #fff;
    .list_title {
      color: rgb(73, 88, 105);
      font-weight: 700;
      li {
        line-height: 74px;
      }
      li:nth-child(2) {
        text-indent: 5%;
      }
    }
    .noMsg {
      line-height: 35px;
      text-align: center;
      padding-bottom: 10px;
    }
    .list {
      .number_time {
        line-height: 40px;
        background-color: #f7f8f9;
        line-height: 68px;
        font-size: 14px;
        span {
          margin-right: 200px;
          padding-left: 32px;
        }
      }
      .wrap_box {
        padding: 20px;
      }
      ul {
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
        li {
          line-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          .span_flex {
            display: flex;
            flex-direction: column;
            line-height: 25px;
            .price {
            }
            span:last-child {
              font-size: 15px;
              color: rgb(116, 114, 114);
            }
            .pay_type {
              border: 1px solid #ccc;
              border-radius: 20px;
              padding: 0 15px;
            }
          }
        }

        .need_flex {
          display: flex;
          justify-content: flex-start;
          p {
            flex: 1;
            text-indent: 0;
            display: flex;
            align-items: center;
            line-height: 20px;
          }
          .img_box {
            width: 60px;
            height: 60px;
            margin: 0 20px;
            border-radius: 50%;
            overflow: hidden;
            box-sizing: border-box;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    ul {
      display: flex;
      justify-content: space-between;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      padding: 0;
      margin: 0;

      li {
        list-style: none;
        width: 12%;
      }
      li:nth-child(2) {
        width: 25%;
        text-align: left;
      }
    }
    
  }
  //线下卡片
    .offlind_card {
      .list{
        ul{
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          li{
            margin-left: 15px;
            margin-bottom: 20px;
            .pic{
              width: 100%;
              height: 200px;
            }
            width: 32%;
            background: #fff;
            .title{
              width: 100%;
              padding: 20px;
              position: relative;
              p{
                padding-bottom: 10px;
              }
              .status{
                position: absolute;
                right: 10px;
                // width: 90px;
                padding: 5px;
                // height: 30px;
                line-height: 30px;
                text-align: center;
                background: #4ebbf2;
                border-radius: 20px;
                color: #fff;
              }
              .el-tag{
                margin-bottom: 5px;
              }
            }
            .Grade{
              display: flex;
              justify-content: space-between;
              padding: 0 20px;
              padding-bottom: 10px;
              .name{
                img{
                  width: 50px;
                  height: 40px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
                span:last-child{
                  font-size: 12px;
                  color: #ffb300;
                }
              }
              .fabulous{
                line-height: 50px;
              }
            }
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
.teacherDetails {
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
    .el-select {
      width: 119px;
    }
    .courseCreate {
      .el-input {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
  .offlind_card {
    .row-bg {
      .el-card__body {
        padding: 0 12px 20px;
      }
    }
  }
  .settlement{
    .el-table__body-wrapper{
      .el-table__body{
        .el-table__row{
          .course_information{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span{
              width:120px;
            }
          }
        }
      }
    }
  }
}
</style>
