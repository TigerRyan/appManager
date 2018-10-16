<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-button type="primary" @click="$router.push({name: 'bannerEdit', params: {id:CREATE}})">添加广告</el-button>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="imgUrl" label="封面图" min-width="210">
          <template slot-scope="scope">
            <ImgView :src="scope.row.imgUrl" width="187.5" height="103.5"/>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="广告名称" :formatter="defValFilter01" min-width="160"/>
        <el-table-column prop="type" label="广告类型" :formatter="bannerTypeFilter" min-width="130"/>
        <el-table-column prop="url" label="广告链接" :formatter="defValFilter01" min-width="240"/>
        <el-table-column prop="starttime" label="开始时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="endtime" label="结束时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="['gray','success','error'][statusFilter(scope.row.starttime,scope.row.endtime)]">{{['未开始', '投放中', '已结束'][statusFilter(scope.row.starttime, scope.row.endtime)]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="$router.push({name: 'bannerEdit', params: {id:scope.row.id}})">编辑</el-button>
            <el-button type="del" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getBannerListApi, delBannerApi} from '../../api/bannerApi'
  import {dateTimeFilter, defValFilter01, statusFilter, bannerTypeFilter} from '../../constant/filter'
  import {CREATE} from '../../constant'
  import {confirm, success, error} from '../../actions'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'

  export default {
    name: 'bannerList',
    components: {MyPagination, Breadcrumb, TablePage, ImgView},
    data() {
      return {
        CREATE,
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      bannerTypeFilter,
      statusFilter,
      findList(page = {}) {
        this.data.loading = true
        getBannerListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      del({id, title}) {
        confirm(`确认删除广告"${title}"?`, 'warning', '删除确认').then(() => delBannerApi(id).then(() => {
          success(`删除广告"${title}"成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || '删除失败！请稍后重试...')))
      },
    },
    created() {
    },
  }
</script>
