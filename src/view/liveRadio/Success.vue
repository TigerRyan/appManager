<styly>
  .el-tag{
  margin-top: 5px
  }
</styly>
<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-input placeholder="请输入直播名称或教师手机号码查询..." style="width: 300px" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="直播课程名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="courseImg" label="直播封面" min-width="240">
          <template slot-scope="scope">
            <ImgView :src="scope.row.courseImg" width="180" height="90"/>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="服务群体" :formatter="courseGradeFilter" min-width="110"/>
        <el-table-column prop="subjects" label="教学科目" :formatter="courseGradeFilter" min-width="120"/>
        <el-table-column prop="courseLabels" label="课程特色" min-width="150">
          <template slot-scope="scope">
            <el-tag v-for="(v,i) in (scope.row.courseLabels || '无').split(',')" :key="i" :type="['','success','info','warning','danger'][i%5]">{{v}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFilter" min-width="130"/>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFilter" min-width="130"/>
        <el-table-column prop="userName" label="直播教师" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="phone" label="教师手机号码" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="totalPrice" label="原价" :formatter="currencyFilter" min-width="110"/>
        <el-table-column prop="salePrice" label="优惠价" :formatter="currencyFilter" min-width="110"/>
        <el-table-column prop="status" label="状态" :formatter="statusFilter" min-width="100"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getLiveRadioListApi} from '../../api/liveRadioApi'
  import {getEduItemApi} from '../../api/baseApi'
  import {dateTimeFilter, defValFilter01, courseGradeFilter, currencyFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'

  export default {
    name: 'liveRadioSuccess',
    components: {MyPagination, Breadcrumb, TablePage, ImgView},
    data() {
      return {
        data: {page: 1, pageSize: 10, loading: false, status: 1, list: [], total: 0, keyWord: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      courseGradeFilter,
      currencyFilter,
      statusFilter({startTime, endTime}) {
        return Date.now() < startTime ? '未开始' : Date.now() < endTime ? '进行中' : '已结束'
      },
      findList(page = {}) {
        this.data.loading = true
        getEduItemApi().then(() => getLiveRadioListApi({...this.data, ...page}).then(data => {
          this.data = {...this.data, ...page, ...data, loading: false}
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
