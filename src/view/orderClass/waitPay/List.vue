<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="输入购买者姓名或手机号码或APP订单号或课程ID查询..." style="width: 450px" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="courseId" label="课程ID" min-width="100"/>
        <el-table-column prop="name" label="课程名称" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="courseImg" label="课程封面图" min-width="200">
          <template slot-scope="scope">
            <ImgView :src="scope.row.courseImg" width="180" height="90"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="教师姓名" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="teacherPhone" label="教师手机号码" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="gradeNumber" label="服务年级" :formatter="gradeFilter" min-width="100"/>
        <el-table-column prop="subjects" label="教学科目" :formatter="courseGradeFilter" min-width="100"/>
        <el-table-column prop="unitPrice" label="课程单价" :formatter="currencyFilter" min-width="100"/>
        <el-table-column prop="courseTotalPrice" label="课程总价" :formatter="currencyFilter" min-width="100"/>
        <el-table-column prop="salePrice" label="课程优惠价格" :formatter="currencyFilter" min-width="120"/>
        <el-table-column prop="orderNumber" label="订单编号" :formatter="defValFilter02" min-width="160"/>
        <el-table-column prop="payWay" label="支付方式" :formatter="payTypeFilter" min-width="100"/>
        <el-table-column prop="startTime" label="总课时" :formatter="hourFilter" min-width="100"/>
        <el-table-column prop="studentName" label="学生姓名" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="studentPhone" label="学生手机号码" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="createtime" label="订单创建时间" :formatter="dateTimeFilter" min-width="150"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getSubscribeApi} from '../../../api/courseApi'
  import {getEduItemApi} from '../../../api/baseApi'
  import {dateTimeFilter, defValFilter02, currencyFilter, courseGradeFilter, payTypeFilter, hourFilter} from '../../../constant/filter'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'
  import ImgView from '../../../components/ImgView.vue'

  export default {
    name: 'orderPass',
    components: {MyPagination, Breadcrumb, TablePage, ImgView},
    data() {
      return {
        data: {page: 1, pageSize: 10, list: [], total: 0, status: 0, loading: false, name: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter02,
      currencyFilter,
      courseGradeFilter,
      payTypeFilter,
      hourFilter,
      gradeFilter({grade, gradeNumber}) {
        return grade || courseGradeFilter(0, 0, gradeNumber)
      },
      findList(page = {}) {
        this.data.loading = true
        getEduItemApi().then(_ => getSubscribeApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...data, loading: false}
        }))
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
    },
    created() {
    },
  }
</script>
