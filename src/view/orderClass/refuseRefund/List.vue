<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入课程名称或教师姓名..." style="width: 230px" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="name" label="课程名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="startTime" label="课程开始时间" :formatter="dateTimeFilter" min-width="130"/>
        <el-table-column prop="endTime" label="课程结束时间" :formatter="dateTimeFilter" min-width="130"/>
        <el-table-column prop="createtime" label="创建时间" :formatter="dateTimeFilter" min-width="130"/>
        <el-table-column prop="courseStatus" label="是否被预约" :formatter="subscribeFilter" min-width="90"/>
        <el-table-column prop="unitPrice" label="课程价格" :formatter="currencyFilter" min-width="100"/>
        <el-table-column prop="payType" label="计算课程价格方式" :formatter="courseTypeFilter" min-width="150"/>
        <el-table-column prop="courseTotalPrice" label="总价" :formatter="currencyFilter" min-width="80"/>
        <el-table-column prop="teacherName" label="教师姓名" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="studentName" label="学生姓名" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="grade" label="所教学生年级" :formatter="defValFilter02" min-width="140"/>
        <el-table-column prop="salePrice" label="课程优惠价格" :formatter="currencyFilter" min-width="120"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getSubscribeApi} from '../../../api/courseApi'
  import {dateTimeFilter, defValFilter01, defValFilter02, defValFilter03, subscribeFilter, currencyFilter, courseTypeFilter} from '../../../constant/filter'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'

  export default {
    name: 'orderPass',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        data: {page: 1, pageSize: 10, list: [], total: 0, status: 0, loading: false, name: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      defValFilter02,
      defValFilter03,
      subscribeFilter,
      currencyFilter,
      courseTypeFilter,
      findList(page = {}) {
        this.data.loading = true
        getSubscribeApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...data, loading: false}
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
