<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入订单号或课程ID查询..." style="width: 340px" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="订单号" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="courseId" label="课程ID" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="courseName" label="课程名称" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="courseType" label="课程类型" :formatter="courseTypeFilter02" min-width="120"/>
        <el-table-column prop="thirdNumber" label="第三方支付流水号" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="payWay" label="支付方式" :formatter="payTypeFilter" min-width="110"/>
        <el-table-column prop="costPrice" label="原价" :formatter="currencyFilter" min-width="120"/>
        <el-table-column prop="totalPrice" label="优惠价格" :formatter="currencyFilter" min-width="120"/>
        <el-table-column prop="totalPrice" label="实付价格" :formatter="currencyFilter" min-width="120"/>
        <el-table-column prop="userName" label="购买者名称" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="phone" label="购买者手机号码" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="createTime" label="订单创建时间" :formatter="dateTimeFilter" min-width="130"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getOrderMApi} from '../../api/orderApi'
  import {dateTimeFilter, defValFilter01, currencyFilter, payTypeFilter, courseTypeFilter02} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'

  export default {
    name: 'orderSuccess',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        data: {page: 1, pageSize: 10, total: 0, list: [], loading: false, status: 3, keyWord: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      currencyFilter,
      payTypeFilter,
      courseTypeFilter02,
      findList(page = {}) {
        this.data.loading = true
        getOrderMApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
    },
    created() {
    },
  }
</script>
