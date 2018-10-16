<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="输入学生姓名或学生手机号码或第三方支付流水号或课程ID查询..." style="width: 450px" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="courseId" label="课程ID" min-width="90"/>
        <el-table-column prop="name" label="课程名称" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="courseImg" label="课程封面图" min-width="200">
          <template slot-scope="scope">
            <ImgView :src="scope.row.courseImg" width="180" height="90"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="教师姓名" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="teacherPhone" label="教师手机号码" :formatter="defValFilter02" min-width="110"/>
        <el-table-column prop="courseTotalPrice" label="课程总价" :formatter="currencyFilter" min-width="100"/>
        <el-table-column prop="salePrice" label="课程优惠价格" :formatter="currencyFilter" min-width="120"/>
        <el-table-column prop="orderNumber" label="APP订单编号" :formatter="defValFilter02" min-width="160"/>
        <el-table-column prop="thirdNumber" label="第三方支付流水号" min-width="160">
          <template slot-scope="scope">
            <el-button v-show="scope.row.payWay == 3 && !scope.row.thirdNumber" type="success" size="small" @click="refund(scope.row)">退款</el-button>
            <span v-show="scope.row.payWay == 3 && scope.row.thirdNumber">已退款</span>
            <span v-show="scope.row.payWay != 3 && scope.row.thirdNumber">{{scope.row.thirdNumber}}</span>
            <span v-show="scope.row.payWay != 3 && !scope.row.thirdNumber">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式" :formatter="payTypeFilter" min-width="100"/>
        <el-table-column prop="startTime" label="总课时" :formatter="hourFilter" min-width="100"/>
        <el-table-column prop="money" label="退款金额" :formatter="currencyFilter" min-width="100"/>
        <el-table-column prop="reason" label="退款原因" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="refundName" label="开户人姓名" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="bankCard" label="银行卡号" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="bankName" label="开户行名称" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="studentName" label="学生姓名" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="studentPhone" label="学生手机号码" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="createtime" label="订单创建时间" :formatter="dateTimeFilter" min-width="130"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getSubscribeApi} from '../../../api/courseApi'
  import {refundApi} from '../../../api/refundApi'
  import {dateTimeFilter, defValFilter02, currencyFilter, payTypeFilter, hourFilter} from '../../../constant/filter'
  import {confirm, success, error} from '../../../actions'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'
  import ImgView from '../../../components/ImgView.vue'

  export default {
    name: 'orderPass',
    components: {MyPagination, Breadcrumb, TablePage, ImgView},
    data() {
      return {
        data: {page: 1, pageSize: 10, list: [], total: 0, status: 6, loading: false, name: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter02,
      currencyFilter,
      payTypeFilter,
      hourFilter,
      findList(page = {}) {
        this.data.loading = true
        getSubscribeApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...data, loading: false}
        })
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
      refund(row) {
        confirm('是否确定退款？', '确认退款').then(_ => refundApi(row.orderId).then(() => {
          success('退款成功！')
          this.$set(row, 'thirdNumber', '0')
        }).catch(({msg}) => error(msg)))
      },
    },
    created() {
    },
  }
</script>
