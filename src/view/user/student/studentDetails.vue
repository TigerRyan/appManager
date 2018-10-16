<!--  -->
<template>
  <div class='studentDetails'>
   <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>学生主页</el-breadcrumb-item>
    </Breadcrumb>
    <h3 class="caption">
      学生主页
      <div class="btn">
          <el-button class="details" type="primary"   @click="edit" round v-show="!dataEdit" :disabled="disabled">编辑</el-button>
          <div v-show="dataEdit">
            <el-button class="details" type="info"   @click="quxiao" round>取消</el-button>
            <el-button class="details" type="primary"   @click="preservation" round>保存</el-button>
          </div>
      </div>
    </h3>
    <div class="contents">
        <div class="logo">
          <img :src="user.pic" alt="" class="user" onerror="onerror=null;src='/static/img/admin.png'">
          <h3>{{user.name}}<img :src="user.sex ==2?'/static/img/ic_sex_women.png':'/static/img/ic_sex_man.png'" alt=""></h3>
        
          <p class="time">注册日期：{{ dateFilter(0,0,user.createtime) }}</p>
        </div>
       <div class="details">
          <div class="details_1">
              <ul>
                <li>
                  <span>ID:</span>
                  <span>{{ user.id?user.id:'无' }}</span>  
                </li>
                <li>
                  <span>账号:</span>
                  <span>{{ user.phone?user.phone:'无' }}</span>  
                </li>
                <li>
                  <span>账号余额:</span>
                  <span>{{ user.money?'￥'+user.money:'0' }}</span>  
                </li>
                <li>
                  <span>冻结金额:</span>
                  <span>{{ user.frozenMoney?'￥'+user.frozenMoney:'0' }}</span>
                </li>
                <li>
                  <span>账号积分:</span>
                  <span>{{ user.gral? user.gral:'0' }}</span>  
                </li>
                <li>
                  <span>状态:</span>
                  <span>
                    <i v-show="!dataEdit">{{ user.deleted==0?'启用':'禁用' }}</i>
                    <el-switch
                      v-model="value4"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="启用"
                      @change="switch1"
                     v-show="dataEdit"
                     :disabled="disabled"
                     >
                    </el-switch>
                  </span>
                </li>
              </ul>
          </div>
          <div class="details_2">
              <ul>
                <li>
                  <span>年级:</span>
                  <span v-show="!dataEdit">{{dynamicTags1[0]?dynamicTags1[0]:'无'}}</span>
                  <span v-show="dataEdit">
                    <el-select v-model="user1.grade" placeholder="请选择年级">
                      <el-option v-for="(item,index) in options1" :label='item.itemName' :value="item.id" :key="index"></el-option>
                    </el-select>
                  </span>
                </li>
                <li>
                  <span>学校:</span>
                  <span v-show="!dataEdit">{{user.school?user.school:'无'}}</span>
                  <span v-show="dataEdit">
                    <el-input placeholder="请输入学校地址" v-model.trim="user1.school"></el-input>
                  </span>
                </li>
                <li>
                  <span>地区:</span>
                  <span v-show="!dataEdit">{{user.address?user.address:'无'}}</span>
                  <span v-show="dataEdit">
                    <el-input placeholder="请输入地区" v-model.trim="user1.address"></el-input>
                  </span>
                </li>
              </ul>
          </div>
       </div>
    </div>
    <!-- 预约订单 -->
    <div class="operation">
          <ul class="cate_list">
            <li class="cate_li" v-for="(item,index) in list" :class="{blue: changeBlue == index}" @click="reds(index)" :key="index">{{item.name}}</li>
          </ul>
    </div>
    <!-- 二级切换 -->
    <div class="status" v-show="jilu">
        <ul class="cate_list">
          <li class="cate_li" v-for="(item,index) in arr" :class="{blue: changeStatus == index}" @click="status(index)" :key="index">{{item.name}}</li>
        </ul>
    </div>
    <div class="list_content" v-show="changeBlue==0">
      <ul class="list_title">
            <li style="width:200px" v-for="(item,index) in navTitle" :key="index" >{{item}}</li>
            <li style="width:200px" v-show="changeBlue==0 && changeStatus==0">状态</li>
            <li v-show="changeBlue==0 && changeStatus==1">支付方式</li>
            <li v-show="changeBlue==0 && changeStatus==1" style="width:200px">第三方单号</li>
            <li v-show="changeBlue==0 && (changeStatus==2 || changeStatus==3)" style="width:200px"> 退款金额/元</li>
            <li style="width:200px" v-show="changeBlue==0 && (changeStatus!=0 && changeStatus!=1)">操作</li>

      </ul>
      <p class="noMsg" v-if="pageOption.list.length==0">暂无数据...</p>
      <div class="list" v-for="(item,index) in pageOption.list" :key="index">
        <p class="number_time"><span>订单编号:{{item.orderNumber}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
        <div class="wrap_box">
          <ul class="list_wrap">
            <li class="need_flex">
              <div class="img_box"><img :src="item.teacherImg" alt=""></div>
              <p class="p_box"><span>{{item.teacherName}}</span><span>{{ item.teacherPhone }}</span></p>
            </li>
            <li class="allTime" style="width:180px" v-show="changeStatus==3 || changeStatus==2">
               <p>{{ item.allTime?getHour(detailTimeFilter(0,0,Math.abs(item.allTime.split('-')[0])),detailTimeFilter(0,0,Math.abs(item.allTime.split('-')[1]))):'无' }} </p>
               
             
            </li>
            <li class="allTime" style="width:180px" v-show="changeStatus!=3 && changeStatus!=2">
              <p>{{ item.allTime }}</p>
            </li>
            <li style="width:200px">{{ item.costPrice?'￥'+item.costPrice:'无'  }}</li>
            <li style="width:200px">{{ item.discount?'￥'+item.discount:'无' }}</li>
            <li style="width:200px">{{ item.totalPrice?'￥'+item.totalPrice:'无' }}</li>
            <li v-show="changeBlue==0 && changeStatus==0">{{ '待付款' }}</li>
            <li v-show="changeBlue==0 && changeStatus==1">{{ payTypeFilter(0,0,item.payType) }}</li>
            <li v-show="changeBlue==0 && changeStatus==1" style="width:200px">{{ item.thirdNumber }}</li>
            <li v-show="changeBlue==0 && (changeStatus==2 || changeStatus==3)">{{ item.totalPrice?'￥'+item.totalPrice:'无' }}</li>

            <li style="width:200px" v-show="changeBlue==0 && (changeStatus!=0 && changeStatus!=1)">
              <el-button type="primary" plain  round @click="agree(item.id)">查看详情</el-button>
             
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 转账记录 -->
    <TablePage class="lock" v-show="changeBlue==1" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading" @sort-change="sort" element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="id" label="转账记录ID"  min-width="80" align="center"/>

        <el-table-column prop="targetId" label="收款人ID"    min-width="120" align="center"/>
        <el-table-column prop="targetName" label="收款人姓名"  min-width="130" align="center"/>
        <el-table-column prop="targetPhone" label="收款人账户"  min-width="130" align="center"/>
        <el-table-column prop="money" label="转账金额/元"  min-width="130" align="center"/>
        <el-table-column prop="createTime" label="转账时间" :formatter="datenTimeFilter" min-width="100" align="center"/>
       
        <el-table-column prop="tradeNo" label="转账单号"  min-width="80" align="center" v-if="changeStatus==0"/>
        <el-table-column v-if="(changeStatus==1 || changeStatus==2) && changeBlue==1" prop="arrivalTime" :label="changeStatus==2 && changeBlue==1?'撤回时间':'到账时间'" :formatter="datenTimeFilter" min-width="100" align="center" class-name="yc"/>
        <el-table-column :label="changeStatus==0?'操作':''" width="210" align="center" >
          <template slot-scope="scope" v-if="changeStatus==0 && changeBlue==1">
            <el-button class="codes"  size="small" @click="administration(scope.row)" plain :disabled="disabled">撤回转账</el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <!-- 提现记录 -->
    <TablePage class="lock" v-show="changeBlue==2" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading" @sort-change="sort" element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="id" label="提现记录ID"  min-width="100" align="center"/>
        <el-table-column prop="userName" label="提现人姓名"    min-width="120" align="center"/>
        <el-table-column prop="phone" label="提现人手机号码"  min-width="130" align="center"/>
        <!-- <el-table-column prop="money" label="提现金额/元" :formatter="currencyFilter" min-width="130" align="center"/> -->
        <el-table-column label="提现金额/元"  width="130" align="center" :formatter="currencyFilter">
          <template slot-scope="scope">
            <p>{{ scope.row.money+scope.row.quota }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="quota" label="提现手续费" :formatter="currencyFilter" min-width="130" align="center"/>
        <el-table-column prop="money" label="实际到账金额" :formatter="currencyFilter" min-width="130" align="center"/>     
        <el-table-column prop="card" label="提现银行卡号"  min-width="145" align="center"/>
        <el-table-column prop="name" label="所属银行"  min-width="130" align="center"/>
        <el-table-column prop="creattime" label="申请时间" :formatter="datenTimeFilter" min-width="110" align="center"/>
        <el-table-column v-if="changeStatus==1 || changeStatus==2" prop="auditTime" :label="changeStatus==2?'拒绝时间':'审核时间'" :formatter="datenTimeFilter" min-width="110" align="center" class-name="yc"/>
        <el-table-column :label="changeStatus==0?'操作':''" width="150" align="center" >
          <template slot-scope="scope" v-if="changeStatus==0">
            <el-button class="codes"  size="small" @click="adopt(scope.row)" plain :disabled="disabled">通过</el-button>
            <el-button class="details" type="danger"  size="small" @click="refuse(scope.row)" :disabled="disabled">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <!-- 线下课程订单 -->
    <div class="list_content" v-show="changeBlue==3">
      <ul class="list_title">
            <li style="width:200px" v-for="(item,index) in navTitle" :key="index" >{{item}}</li>
            <li v-show="changeBlue==3 && (changeStatus==2 || changeStatus==3)" style="width:200px">退款金额</li>
            <li v-show="changeBlue==3 && (changeStatus!=2)" style="width:200px">状态</li>
            <li style="width:200px" v-show="changeBlue==3 && (changeStatus==2)">操作</li>
      </ul>
      <p class="noMsg" v-if="pageOption.list.length==0">暂无数据...</p>
      <div class="list" v-for="(item,index) in pageOption.list" :key="index">
        <p class="number_time"><span>订单编号:{{item.orderNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
        <div class="wrap_box">
          <ul class="list_wrap">
            <li style="width:200px">{{ item.mechanismName }}</li>
            <li class="need_flex" style="width:200px">
              <div class="img_box"><img :src="item.courseImg" alt=""></div>
              <p class="p_box"><span>{{item.courseName}}</span></p>
            </li>
            <li style="width:200px">{{ item.salePrice?'￥'+item.salePrice:'0'  }}</li>
            <li style="width:200px">￥{{ item.discount }}</li>
            <li style="width:200px">￥{{ item.amount }}</li>
            <li v-show="changeBlue==3 && (changeStatus==2 || changeStatus==3)" style="width:200px">￥{{ item.money }}</li>
            <li style="width:200px" v-show="changeStatus!=2">{{ ['待付款','已付款','已取消','已退款'][item.orderStatus] }}</li>
            <!-- money -->
            <li v-show="changeBlue==0 && changeStatus==1">{{ payTypeFilter(0,0,item.payType) }}</li>
            <li v-show="changeBlue==0 && changeStatus==1" style="width:200px">{{ item.thirdNumber }}</li>
            
           
             <li style="width:200px;display:flex;" v-show="changeBlue==3 && (changeStatus==2)">
              <el-button type="primary" plain  round @click="agreesss(item.id)" :disabled="disabled" style="height:40px">同意退款</el-button>
              <el-button type="danger" plain round @click="refusesss(item.id)" :disabled="disabled" style="height:40px">拒绝退款</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 商城订单 -->
    <div class="list_content" v-show="changeBlue==4">
      <ul class="list_title">
            <li style="width:170px" v-for="(item,index) in navTitle" :key="index" >{{item}}</li>
            <li v-show="changeStatus==0 || changeStatus==4" style="width:150px">待付款</li>
            <li v-show="changeStatus==1">已付款</li>
            <li v-show="changeStatus==0 || changeStatus==1 || changeStatus==4">支付方式</li>
            <li v-show="changeStatus==2" style="width:200px"> 实付金额/元</li>
            <li v-show="changeStatus==2 || changeStatus==3" style="width:200px"> 退款金额/元</li>
            <li v-show="changeStatus!=2" style="width:200px">交易状态</li>
            <li style="width:200px" v-show="changeStatus==2">操作</li>
      </ul>
      <p class="noMsg" v-if="pageOption.list.length==0">暂无数据...</p>
      <div class="list" v-for="(item,index) in pageOption.list" :key="index">
        <p class="number_time"><span>订单编号:{{item.orderNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
        <div class="wrap_box">
          <ul class="list_wrap">
            <li class="need_flex" style="width:207px">
              <div class="img_box"><img :src="item.goodsImg" alt="" onerror="onerror=null;src='/static/img/admin.png'"></div>
              <p class="p_box"><span style="width:120px;display:inline-block; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.goodsName}}</span><span>{{ item.subgoogsUnique }}</span></p>
            </li>
            <li class="allTime" style="width:180px">
              <p>￥{{ item.marketPrice }} </p>
            
            </li>
            <li style="width:170px">￥{{ item.costPrice }}</li>
            <li style="width:170px">{{ item.integral }}</li>
            <li style="width:170px">{{ item.num }}</li>
            <li style="width:190px" v-show="changeStatus==0 || changeStatus==4">￥{{ item.payAmount }}</li>
            <li v-show="changeStatus==1" style="width:150px">￥{{ item.payAmount }}</li>   <!--已付款-->
            <li v-show="changeStatus==0 || changeStatus==1 || changeStatus==4" style="width:150px">{{ payTypeFilter(0,0,item.payType) }}</li>
            <li v-show="changeStatus==2" style="width:200px"> ￥{{ item.payAmount }}</li>
            <li v-show="changeStatus==2 || changeStatus==3" style="width:200px"> {{ item.refundAmount }}</li>
            <li v-show="changeStatus!=2" style="width:200px">{{ orderFilter(0,0,item.orderStatus) }}</li>
            <li style="width:200px;display:flex;" v-show="changeStatus==2">
              <el-button type="primary" plain  round @click="agrees(item.id)" :disabled="disabled" style="height:40px">同意退款</el-button>
              <el-button type="danger" plain round @click="refuses(item.id)" :disabled="disabled" style="height:40px">拒绝退款</el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 收入记录 -->
    <TablePage class="lock" v-show="changeBlue==5" >
      <el-table :data="pageOption.list" v-loading="pageOption.loading" @sort-change="sort" element-loading-text="拼命加载中..." align="center">
        <el-table-column prop="id" label="收款记录ID"  min-width="80" align="center"/>
        <el-table-column prop="type" label="转账人ID"    min-width="120" align="center"/>
        <el-table-column prop="fromName" label="转账人姓名"  min-width="130" align="center"/>
        <el-table-column prop="fromPhone" label="转账人账号"  min-width="130" align="center"/>
        <el-table-column prop="money" label="转账金额/元"  min-width="130" align="center"/>
        <el-table-column prop="arrivalTime" label="到账时间" :formatter="datenTimeFilter" min-width="100" align="center"/>
      </el-table>
    </TablePage>
    <MyPagination :page="pageOption.pageNum" :size="pageOption.pageSize" :method="findList" :pageSizes=[10] :total="pageOption.total" ></MyPagination>
  </div>
</template>

<script>
import Breadcrumb from "../../../components/Breadcrumb.vue";
import TablePage from "../../../components/TablePage.vue";
import MyPagination from "../../../components/MyPagination.vue";
import { getUserApi,getgradeApi,getMakeListApi,getSubjectApi,getUserUpDataApi,getAccountsListApi,getForwardListApi,getorderListApi,getCommodityListApi,getAccountListApi,getCancelApi,getAuditByAPPApi,getRefundsForGoodsApi,getRefundsForCourseApi } from "../../../api/studentDetail";
import { datenTimeFilter,currencyFilter,orderFilter,dateFilter,teacherFilter,payTypeFilter,detailTimeFilter } from "../../../constant/filter";
export default {
  name: "studentDetails",
  components: { Breadcrumb, MyPagination, TablePage },
  data() {
    return {
      value:'',
      value1: "",
      value2: "",
      value4: true,
      value5: false,
      dataEdit: false,
      changeBlue: 0,
      changeStatus: 0,
      // dadGrade:'',
      jilu: true,

      user: {
      },
      user1:{
        id:this.$route.query.id,
        deleted:'',//switch开关
        school:'',
        grade:'',
        address:''
      },
      dynamicTags: [],
      dynamicTags1: [],
      dynamicTagsInit:[],
      dynamicTags1Init:[],
      dynamicTags2Init:[],
      dynamicTags2: [],
      navTitle: [],
      navTitle0: [
        "预约教师",
        "总课时",
        "原价/元",
        "优惠价/元",
        "实付金额/元"
      ],
     navTitle3: [
        "机构",
        "课程",
        "原价",
        "优惠价",
        "实际付款"
      ],
      navTitle4: [
        "课程",
        "价格",
        "优惠价格",
        "积分",
        "数量",
      ],
      arr: [],
      inputVisible: false,
      inputValue: "",
      list: [
        { type: 0, name: "预约订单" },
        { type: 1, name: "转账记录" },
        { type: 2, name: "提现记录" },
        { type: 3, name: "线下课程订单" },
        { type: 4, name: "商城订单" },
        { type: 5, name: "收入记录" }
      ],
      status0: [
        { type: 0, name: "待付款" },
        { type: 1, name: "已付款" },
        { type: 2, name: "退款中" },
        { type: 3, name: "已退款" },
        { type: 4, name: "已取消" },
      ],
      status1: [
        { type: 0, name: "转账中" },
        { type: 1, name: "转账成功" },
        { type: 2, name: "转账失败" }
      ],
      status2: [
        { type: 0, name: "审核中" },
        { type: 1, name: "已通过" },
        { type: 2, name: "已拒绝" }
      ],
      status3: [
        { type: 0, name: "待付款" },
        { type: 1, name: "已付款" },
        { type: 2, name: "退款中" },
        { type: 3, name: "已退款" },
        { type: 4, name: "已取消" }
      ],
      status4: [
        { type: 0, name: "待付款" },
        { type: 1, name: "已付款" },
        { type: 2, name: "退款中" },
        { type: 3, name: "已退款" },
        { type: 4, name: "已取消" }
      ],
      pageOption: {
        page: 1,
        pageSize: 5,
        status: 0,
        userId: null,
        list: [],
        targetUserId: null,
        keyType:1,
        fromUserId:null,
        loading:false
      },
      options: [{value:0,label:'初级教师'},{value:1,label:'中级教师'},{value:2,label:'高级教师'}],
      options1: [],
      options2: [],
      value4: "",
      disabled: false
    };
  },
  created() {
    this.arr = this.status0;
    this.navTitle = this.navTitle0
    this.pageOption.userId = parseInt(this.$route.query.id);
    this.pageOption.targetUserId = parseInt(this.$route.query.id);
    this.pageOption.fromUserId = parseInt(this.$route.query.id);
    this.init()
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
  },
  methods: {
    datenTimeFilter,
    currencyFilter,
    orderFilter,
    dateFilter,
    teacherFilter,
    payTypeFilter,
    detailTimeFilter,
    getHour(s1,s2){
      s1 = new Date(s1.replace(/-/g, '/'));
      s2 = new Date(s2.replace(/-/g, '/'));
      var ms = Math.abs(s1.getTime() - s2.getTime());
      return ms / 1000 / 60 / 60;
    },
    findList(page = {}) {
      // this.data.loading = true;
      if (this.changeBlue == 0) {
        this.pageOption.userType=1
        getMakeListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
         
        });
        } else if (this.changeBlue == 1) {
        // this.pageOption.userType=2
        getAccountsListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
      } else if (this.changeBlue == 2) {
         getForwardListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
        }else if (this.changeBlue == 3) {
         getorderListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
       }else if (this.changeBlue == 4) {
        if (this.changeStatus==2) {
          this.pageOption.status=4
        }else if(this.changeStatus==3){
          this.pageOption.status=6
        }else if(this.changeStatus==4){
          this.pageOption.status=5
        }

        getCommodityListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
        }else if (this.changeBlue == 5) {
        this.pageOption.status=0
        getAccountListApi({ ...this.pageOption, ...page }).then(data => {
          this.pageOption = {
            ...this.pageOption,
            ...page,
            ...data,
            loading: false
          };
        });
      }
    },
    edit() {
      this.value=''
      this.dataEdit = true;
    

      if (this.user.deleted==0) {
        this.value4=true
      }else{
        this.value4=false
      }
      if (this.user.lineSwitch==0) {
        this.value5=false
      }else{
        this.value5=true
      }
    },
    quxiao() {
      this.dataEdit = false;
      this.dynamicTags=[]
      this.dynamicTags1=[]
      this.dynamicTags2=[]
      this.dynamicTags=[...this.dynamicTags1Init]
      this.dynamicTags1=[...this.dynamicTagsInit]
      this.dynamicTags2=[...this.dynamicTags2Init]
    },
    preservation() {
      
      getUserUpDataApi({...this.user1}).then(data=>{
     
          this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.init()
            this.dataEdit = false;
      })
    },
    reds(index) {   //一级导航
    
      this.changeBlue = index;
    
      this.navTitle = this["navTitle" + index];
      if (index < 5) {
        this.changeStatus = 0;
        if (this.changeBlue==1 || this.changeBlue==2) {
          this.pageOption.status = this.changeStatus+1;
        }else{
          this.pageOption.status =this.changeStatus
        }
        this.arr = this["status" + index];
        this.jilu = true;
      } else {
        this.jilu = false;
      }
      this.findList();
    },
    status(index) {     //二级导航
      this.changeStatus = index;
     
      this.pageOption.status = this.changeStatus;
      if (this.changeBlue==1 || this.changeBlue==2) {
        this.pageOption.status = this.changeStatus+1;
      }
      this.findList();
    },
    switch1() {
     
      if (this.value4) {
      
        this.user1.deleted=0
      } else {
      
         this.user1.deleted=1
      }
    },
    switch2() {
      if (!this.value5) {
        this.user.value2 = "关闭";
        this.user1.lineSwitch =0
      } else {
        this.user.value2 = "打开";
        this.user1.lineSwitch =1
      }
    },
    handleClose(tag,val) {
        this[val].splice(this[val].indexOf(tag), 1);
        this.user1.skills=this.dynamicTags.join(',')
        this.user1.grade=this.dynamicTags1.join(',')
        this.user1.subject=this.dynamicTags2.join(',')
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.dynamicTags.indexOf(inputValue)==-1) {
        this.dynamicTags.push(inputValue);
        this.user1.skills+=','+inputValue+','
      }else{
         this.$message({
          message: '不可重复添加',
          type: 'warning'
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    sort({ order, prop }) {
      this.search(
        prop
          ? { [prop]: { descending: 0, ascending: 1 }[order] }
          : { earning: null }
      );
    },
    //撤销转账
    administration(item){
        getCancelApi({id:item.id}).then(data=>{
            this.$message({
              message: '撤回成功',
              type: 'success'
            });
            this.findList()
        })
    },
    //拒绝
    refuse(val){
        getAuditByAPPApi({ids:[val.id],status:3}).then(data=>{
          this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.findList()
      })
    },
    //通过
    adopt(val){
      getAuditByAPPApi({ids:[val.id],status:2}).then(data=>{
          this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.findList()
      })
    },
    //查看详情
    agree(val){
      this.$router.push({path:'/view/order_manager/reserveDetail',query:{id:val,tab:this.changeStatus}})
    },
    // 线下课程订单详情
    agreess(val){
      this.$router.push({path:'/view/order_manager/offlineDetail',query:{id:val,type:this.changeStatus}})
    },
    // 线下课程订单详情同意退款
agreesss(val){
        getRefundsForCourseApi({id:val, status:1}).then(data=>{
            this.$message({
              message: '操作成功',
              type: 'success'
            });
             this.findList()
        })

    },
    // 线下课程订单详情拒绝退款
refusesss(val){
      getRefundsForCourseApi({id:val, status:2}).then(data=>{
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.findList()
        })

    },
    //同意退款
    agrees(val){
        getRefundsForGoodsApi({id:val, status:1}).then(data=>{
            this.$message({
              message: '操作成功',
              type: 'success'
            });
             this.findList()
        })

    },
    //拒绝退款
    refuses(val){
      getRefundsForGoodsApi({id:val, status:2}).then(data=>{
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.findList()
        })

    },
    //选择年级
    grade(){
     if (this.dynamicTags1.indexOf(this.value.itemName)==-1) {
       this.dynamicTags1.push(this.value.itemName)
       this.user1.grade+=','+this.value.id+','
     }else{
       this.$message({
          message: '不可重复添加',
          type: 'warning'
        });
     }
    },
    grades(){

    },
    //选择科目
    Subject(){
        if (this.dynamicTags1.indexOf(this.value.itemName)==-1) {
            this.dynamicTags2.push(this.value.itemName)
            this.user1.subject+=','+this.value.id+','
        }else{
          this.$message({
              message: '不可重复添加',
              type: 'warning'
            });
         }
    },
    // 教师等级
    dengji(){
    
     this.user1.level=this.value
    },

    init(){
          getUserApi({id:this.$route.query.id}).then(data=>{
     
          this.user=data
          this.user1=this.user
      
          getSubjectApi().then(data=>{
      
          data.forEach(item => {
              if (item.itemLevels==1) {
                this.options1.push(item)
               
                this.user.grade.split(',').forEach(val=>{
                    if (item.id==val) {
                      this.dynamicTags1 = [item.itemName]
                      this.dynamicTagsInit = [item.itemName]
                      this.user1.grade= this.dynamicTags1[0]

                    }
                })
              }
          });
        })

          })
 
    }
  },
};
</script>
<style lang='less' scoped>
.studentDetails {
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
            margin-bottom: 36px;
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
        width: 37%;
      }
      .details_2 {
        width: 67%;
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
              width:13%;
            }
            li:nth-child(7){
              width:13%;
            }
          }
        }

  .el-pagination {
    text-align: center;
  }

}
</style>
<style lang='less'>
.studentDetails {
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
.details_2{
  .el-input{
  width: 350px;
}
}
}
</style>
