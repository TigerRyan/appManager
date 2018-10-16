<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入教师手机号码或视频课程名称搜索..." style="width: 340px" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="视频课程名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="videoImg" label="视频封面" min-width="240">
          <template slot-scope="scope">
            <ImgView :src="scope.row.videoImg" width="180" height="90"/>
          </template>
        </el-table-column>
        <el-table-column prop="videoUrl" label="视频" min-width="360">
          <template slot-scope="scope">
            <VideoUpload :url="scope.row.videoUrl" :showUpload="false" width="360" height="120"/>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="服务群体" :formatter="courseGradeFilter" min-width="110"/>
        <el-table-column prop="subjects" label="教学科目" :formatter="courseGradeFilter" min-width="100"/>
        <el-table-column prop="videoLabels" label="课程特色" min-width="150">
          <template slot-scope="scope">
            <el-tag v-for="(v,i) in (scope.row.videoLabels || '无').split(',')" :key="i" :type="['','success','info','warning','danger'][i%5]">{{v}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="教师名字" :formatter="defValFilter01" min-width="90"/>
        <el-table-column prop="phone" label="教师手机号码" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="totalPrice" label="原价" :formatter="currencyFilter" min-width="90"/>
        <el-table-column prop="salePrice" label="优惠价格" :formatter="currencyFilter" min-width="90"/>
        <el-table-column prop="auditTime" label="审核时间" :formatter="dateTimeFilter" min-width="130"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getVideoListApi} from '../../api/videoApi'
  import {getEduItemApi} from '../../api/baseApi'
  import {dateTimeFilter, defValFilter01, courseGradeFilter, currencyFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'
  import VideoUpload from '../../components/VideoUpload.vue'

  export default {
    name: 'liveRadioSuccess',
    components: {MyPagination, Breadcrumb, TablePage, ImgView, VideoUpload},
    data() {
      return {
        data: {page: 1, pageSize: 10, total: 0, loading: false, status: 1, List: [], keyWord: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      courseGradeFilter,
      currencyFilter,
      findList(page = {}) {
        this.data.loading = true
        getEduItemApi().then(() => getVideoListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        }))
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
    },
  }
</script>
