
<template>
  <div class="content_data user_detail">
    <Breadcrumb>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </Breadcrumb>
    <div class="user_box">
      <!--<el-tag type="danger" class="user_error" v-if="earningMoney != 0">异常</el-tag>-->
      <HeadImg class="user_pic" :src="user.pic" :circle="false" width="160" height="160"/>
      <div class="user_info">
        <div>会员编号：{{user.id}}</div>
        <div>手机号码：{{user.phone}}</div>
        <div>姓名：{{user.name}}</div>
        <div>课时单价：{{user.payMoney}}元/h</div>
        <div>教师级别：{{levels[user.level] || '未知'}}</div>
        <div>总{{user.type == 2 ? '收入' : '消费'}}：{{currencyFilter(0, 0, user.earning)}}元</div>
        <div>总提现：{{currencyFilter(0, 0, user.cash)}}元</div>
        <div>总退款：{{currencyFilter(0, 0, user.refund)}}元</div>
        <div>剩余可提现佣金：{{currencyFilter(0, 0, user.money-user.frozenMoney)}}元</div>
        <div>剩余不可提现佣金：{{currencyFilter(0, 0, user.frozenMoney)}}元</div>
        <div>注册时间：{{dateTimeFilter(0, 0, user.createtime)}}</div>
      </div>
      <div class="course">
        <div class="title">发课记录</div>
        <el-table :data="course.list" v-loading="course.loading" :row-style="courseRow" element-loading-text="拼命加载中...">
          <el-table-column prop="createTime" label="发课日期" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="id" label="课程ID" :formatter="defValFilter01" min-width="100"/>
          <el-table-column prop="name" label="课程名称" :formatter="defValFilter01" min-width="110"/>
          <el-table-column prop="startTime" label="课时" :formatter="hourFilter" min-width="80"/>
          <el-table-column prop="unitPrice" label="单价" :formatter="currencyFilter" min-width="100"/>
          <el-table-column prop="totalPrice" label="总价" :formatter="currencyFilter" min-width="100"/>
          <el-table-column prop="discount" label="优惠折扣" :formatter="discountFilter" min-width="100"/>
          <el-table-column prop="salePrice" label="优惠价格" :formatter="currencyFilter" min-width="100"/>
          <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="status" label="是否被预约" :formatter="subscribeFilter" min-width="120"/>
          <el-table-column prop="orderId" label="订单ID" :formatter="defValFilter01" min-width="100"/>
          <el-table-column prop="subscribeTime" label="预约时间" :formatter="dateTimeFilter" min-width="150"/>
        </el-table>
        <MyPagination :page="course.page" :sync="false" :size="course.pageSize" :method="getUserCourse" :total="course.total"/>
        <div class="course_count">
          <div>总发布课程数：{{courseCount.count}}节课</div>
          <div>总课时：{{defValFilter03(0, 0, courseCount.hours)}}h</div>
          <div>总售课金额：{{currencyFilter(0, 0, courseCount.money)}}元</div>
          <div>已被预约课程数：{{defValFilter03(0, 0, courseCount.subCount)}}节课</div>
          <div>已被预约课时数：{{defValFilter03(0, 0, courseCount.subHours)}}h</div>
          <div>已被预约总金额：{{currencyFilter(0, 0, courseCount.subMoney)}}元</div>
          <div>未被预约课程数：{{defValFilter03(0, 0, courseCount.noCount)}}节课</div>
          <div>未被预约课时数：{{defValFilter03(0, 0, courseCount.noHours)}}h</div>
          <div>未被预约总金额：{{currencyFilter(0, 0, courseCount.noMoney)}}元</div>
        </div>
      </div>
      <div class="subscribe">
        <div class="title">售课记录</div>
        <div class="list_box" v-loading="subscribe.loading" element-loading-text="拼命加载中...">
          <div class="list" v-for="s in subscribe.list">
            <div>
              <div>售课日期</div>
              <div>{{dateTimeFilter(0, 0, s.createtime)}}</div>
            </div>
            <div>
              <div>课程ID</div>
              <div>{{s.courseId}}</div>
            </div>
            <div>
              <div>课程名称</div>
              <div>{{s.name}}</div>
            </div>
            <div>
              <div>课时</div>
              <div>{{hourFilter(s)}}</div>
            </div>
            <div>
              <div>单价</div>
              <div>{{currencyFilter(0, 0, s.unitPrice)}}</div>
            </div>
            <div>
              <div>总价</div>
              <div>{{currencyFilter(0, 0, s.courseTotalPrice)}}</div>
            </div>
            <div>
              <div>优惠折扣</div>
              <div>{{s.discount}}</div>
            </div>
            <div>
              <div>优惠价格</div>
              <div>{{currencyFilter(0, 0, s.salePrice)}}</div>
            </div>
            <div>
              <div>开始时间</div>
              <div>{{dateTimeFilter(0, 0, s.startTime)}}</div>
            </div>
            <div>
              <div>结束时间</div>
              <div>{{dateTimeFilter(0, 0, s.endTime)}}</div>
            </div>
            <div>
              <div>购买人ID</div>
              <div>{{s.studentId}}</div>
            </div>
            <div>
              <div>购买人姓名</div>
              <div>{{s.studentName}}</div>
            </div>
            <div>
              <div>购买人手机号码</div>
              <div>{{s.studentPhone}}</div>
            </div>
            <div>
              <div>购买时间</div>
              <div>{{dateTimeFilter(0, 0, s.createtime)}}</div>
            </div>
            <div>
              <div>系统内部单号</div>
              <div>{{s.orderId}}</div>
            </div>
            <div style="flex: none;">
              <div>第三方支付单号</div>
              <div>{{defValFilter01(0, 0, s.thirdNumber)}}</div>
            </div>
            <div>
              <div>支付方式</div>
              <div>{{payTypeFilter(0, 0, s.payWay)}}</div>
            </div>
            <div>
              <div>实付金额</div>
              <div>{{currencyFilter(0, 0, s.totalPrice)}}</div>
            </div>
            <div>
              <div>平台补贴金额</div>
              <div>{{currencyFilter(0, 0, s.costPrice - s.totalPrice)}}</div>
            </div>
            <div>
              <div>课程是否有退款</div>
              <div>{{s.refundId ? '有' : '没有'}}</div>
            </div>
            <div>
              <div>学生退款金额</div>
              <div>{{s.refundId ? currencyFilter(0, 0, s.money) : '0.00'}}</div>
            </div>
            <div>
              <div>教师扣款金额</div>
              <div>{{s.refundId ? currencyFilter(0, 0, s.costPrice) : '0.00'}}</div>
            </div>
            <div>
              <div>退款时间</div>
              <div>{{s.refundId ? dateTimeFilter(0, 0, s.refundTime) : '无'}}</div>
            </div>
            <div>
              <div>退款状态</div>
              <div>{{s.refundId ? refundFilter(0, 0, s.state) : '无'}}</div>
            </div>
            <div>
              <div>订单状态</div>
              <div>{{subStatusFilter(0, 0, s.status)}}</div>
            </div>
            <div>
              <div>佣金状态</div>
              <div>{{s.status == 4 || s.status == 9 ? '可提现' : '不可提现'}}</div>
            </div>
            <div>
              <div>最终结算</div>
              <div class="text-center" :style="{backgroundColor: (s.totalPrice + s.courseTotalPrice * (1 - s.discount)) !== s.courseTotalPrice || (s.totalPrice + s.courseTotalPrice * (1 - s.discount) - s.costPrice) !== 0?'rgba(255,73,73,.2)':'none'}">
                <div v-if="!s.refundId">应得佣金=实付金额（{{s.totalPrice}}）+课程总价{{s.courseTotalPrice}}*（1-{{s.discount}}）={{s.totalPrice + s.courseTotalPrice * (1 - s.discount)}}元</div>
                <div v-if="s.refundId">应得佣金=实付金额（{{s.totalPrice}}）+课程总价{{s.courseTotalPrice}}*（1-{{s.discount}}）-教师应扣金额（{{s.costPrice}}）={{s.totalPrice + s.courseTotalPrice * (1 - s.discount) - s.costPrice}}元</div>
              </div>
            </div>
          </div>
          <div v-if="!subscribe.loading && (!subscribe.list||!subscribe.list.length)" class="no_data">暂无数据</div>
        </div>
        <MyPagination :page="subscribe.page" :sync="false" :size="subscribe.pageSize" :method="getSubscribe" :total="subscribe.total"/>
      </div>
      <div class="cash">
        <div class="title">提现记录</div>
        <el-table :data="cash.list" v-loading="cash.loading" :row-style="cashRow" element-loading-text="拼命加载中...">
          <el-table-column prop="creattime" label="提现日期" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="id" label="提现ID" :formatter="defValFilter01" min-width="100"/>
          <el-table-column prop="money" label="提现金额" :formatter="currencyFilter" min-width="110"/>
          <el-table-column prop="userName" label="提现人姓名" :formatter="defValFilter01" min-width="110"/>
          <el-table-column prop="card" label="提现银行卡号" :formatter="defValFilter01" min-width="180"/>
          <el-table-column prop="name" label="提现银行" :formatter="defValFilter01" min-width="180"/>
          <el-table-column prop="status" label="审核状态" :formatter="cashFilter" min-width="100"/>
        </el-table>
        <MyPagination :page="cash.page" :sync="false" :size="cash.pageSize" :method="getCashList" :total="cash.total"/>
        <div class="cash_count" :style="{backgroundColor: earningMoney != 0?'rgba(255,73,73,.2)':'none'}" style="display: none">
          <div>总提现成功金额={{currencyFilter(0, 0, cashCount.successMoney)}}元（总提现成功金额只计算审核通过的）</div>
          <div>总提现失败金额={{currencyFilter(0, 0, cashCount.failMoney)}}元（总提现失败金额只计算审核失败的）</div>
          <div>用户总收入={{currencyFilter(0, 0, user.earning)}}元（用户总收入=教师售课记录应得佣金总和）</div>
          <div>剩余可提现金额={{currencyFilter(0, 0, user.money)}}元</div>
          <div>剩余不可提现金额={{currencyFilter(0, 0, user.frozenMoney)}}元</div>
          <div>平台价格差额=用户总收入（{{user.earning}}）-用户总提现金额（{{user.cash}}）-剩余可提现金额（{{user.money}}）-剩余不可提现金额（{{user.frozenMoney}}）={{earningMoney}}元  （0=正常，非0都是异常账户）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getUserInfoApi} from '../../api/userApi'
  import {getConfigApi} from '../../api/systemApi'
  import {getUserCashListApi, getUserCashCountApi} from '../../api/cashApi'
  import {getCourseApi, getCourseCountApi, getSubscribeApi} from '../../api/courseApi'
  import {currencyFilter, dateTimeFilter, defValFilter01, defValFilter03, subscribeFilter, hourFilter, subStatusFilter, payTypeFilter, refundFilter, cashFilter} from '../../constant/filter'
  import {TEACHER_LEVEL as key} from '../../constant'
  import HeadImg from '../../components/HeadImg.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import MyPagination from '../../components/MyPagination.vue'

  export default {
    name: 'userDetail',
    data() {
      return {
        user: {earning: 0, cash: 0, money: 0, frozenMoney: 0},
        course: {page: 1, pageSize: 10, total: 0, loading: false, userId: this.$route.params.id, list: []},
        cash: {page: 1, pageSize: 10, total: 0, loading: false, userId: this.$route.params.id, list: []},
        subscribe: {page: 1, pageSize: 10, total: 0, loading: false, teacherId: this.$route.params.id, list: []},
        courseCount: {},
        cashCount: {},
        levels: {},
      }
    },
    components: {HeadImg, Breadcrumb, MyPagination},
    computed: {
      earningMoney() {
        return (this.user.earning - this.user.cash - this.user.money - this.user.frozenMoney).toFixed(2)
      },
    },
    methods: {
      currencyFilter,
      dateTimeFilter,
      defValFilter01,
      defValFilter03,
      subscribeFilter,
      hourFilter,
      subStatusFilter,
      payTypeFilter,
      refundFilter,
      cashFilter,
      courseRow({status}) {
        return status === 0 ? {backgroundColor: 'rgba(255,73,73,.2)'} : {}
      },
      cashRow({status}) {
        return status === 3 ? {backgroundColor: 'rgba(255,73,73,.2)'} : {}
      },
      discountFilter({discount, totalPrice, salePrice}) {
        return discount || (salePrice / totalPrice).toFixed(2)
      },
      getUserCourse(page = {}) {
        this.course.loading = true
        getCourseApi({...this.course, ...page}).then(data => {
          this.course = {...this.course, ...data, loading: false}
        })
      },
      getSubscribe(page = {}) {
        this.subscribe.loading = true
        getSubscribeApi({...this.subscribe, ...page}).then(data => {
          this.subscribe = {...this.subscribe, ...data, loading: false}
        })
      },
      getCashList(page = {}) {
        this.cash.loading = true
        getUserCashListApi(this.$route.params.id, {...this.cash, ...page}).then(data => {
          this.cash = {...this.cash, ...data, loading: false}
        })
      },
    },
    created() {
      const {id} = this.$route.params
      getUserInfoApi(id).then(user => {
        this.user = {...this.user, ...user}
      })
      getConfigApi(key).then((levels = []) => levels.forEach(({val, name}) => {
        this.levels[val] = name
      }))
      getCourseCountApi(id).then(courseCount => {
        this.courseCount = courseCount || {}
      })
      getUserCashCountApi(id).then(count => {
        this.cashCount = count || {}
      })
    },
  }
</script>
<style lang="less" scoped>
  .user_detail {
    .user_box {
      border: 1px solid #d1dbe5;
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      position: relative;
      .user_error {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 26px;
        padding: 15px;
        height: 56px;
        line-height: 1;
      }
      .user_pic {
        width: 160px;
        float: left;
        margin: 20px;
      }
      .user_info {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 20px 20px 0;
        & > div {
          display: inline-block;
          width: 33.33333%;
          font-size: 16px;
          line-height: 36px;
        }
      }
      .title {
        text-align: center;
        font-size: 24px;
        border-top: 1px solid #DAD1D5;
        padding: 20px;
      }
      .no_data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .course {
        clear: both;
        .course_count {
          display: flex;
          flex-wrap: wrap;
          padding: 10px;
          & > div {
            display: inline-block;
            width: 20%;
            line-height: 32px;
            font-size: 16px;
          }
        }
      }
      .subscribe {
        .title {
          border-bottom: 1px solid #97A8BD;
        }
        .list_box {
          min-height: 100px;
          position: relative;
          .list {
            display: flex;
            flex-wrap: wrap;
            & > div {
              flex: 1;
              display: inline-block;
              border-bottom: 1px solid #DAD1D5;
              border-left: 1px solid #DAD1D5;
              margin-left: -1px;
              min-width: 10%;
              text-align: center;
              & > div {
                padding: 10px;
              }
              & > div:last-child {
                border-top: 1px solid #DAD1D5;
              }
            }
            & > div:last-child {
              flex: none;
              width: 100%;
              border-bottom: 1px solid #97A8BD;
              & > div:first-child {
                font-size: 16px;
                text-align: center;
              }
            }
          }
        }
      }
      .cash {
        .cash_count {
          border-top: 1px solid #97A8BD;
          padding: 10px;
          text-align: center;
        }
      }
    }
  }
</style>
