<template>
  <div class="content_data articleDetails">
    <div class="bread_crumb header">
      <Breadcrumb/>
    </div>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column type="selection" width="100">
        </el-table-column>
        <el-table-column prop="title" label="文章标题" :formatter="defValFilter01" min-width="160" />
        <el-table-column prop="label" label="文章标签" :formatter="labelFilter" min-width="200" />
        <!-- informationTypeFilter  -->
        <el-table-column prop="titleName" label="所属栏目" :formatter="defValFilter01" min-width="100" />
        <el-table-column prop="type" label="文章类型" min-width="100"  >
          <template slot-scope="scope">
						  <i v-if="scope.row.type==1" class="el-icon el-icon-caret-right" style="color:blue"></i>	{{informationTypeFilter(0,0,scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="封面" min-width="110">
						<template slot-scope="scope">
						 <img :src="scope.row.imageUrl|| '../../../static/img/logo.png'" width="90" height="90"/>
						</template>
					</el-table-column>
        <el-table-column prop="weight" label="权重值"  width="100" />
         <el-table-column prop="createTime" label="创建时间" :formatter="detailTimeFilter" min-width="200" />
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10]" :method="findList" :total="data.total" />
  </div>
</template>

<script>
import { confirm, success, error } from '../../actions/index'
import {
  defValFilter01,
  labelFilter,
  detailTimeFilter,
  informationTypeFilter
} from '../../constant/filter'
import {
  getColumnListApi,
  updateColumnApi,
  createColumnApi,
  deleteColumnApi,
  getArticleDetailsApi
} from '../../api/columnManageApi'
import { CREATE } from '../../constant/index'
import MyPagination from '../../components/MyPagination.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import TablePage from '../../components/TablePage.vue'
import ImgView from '../../components/ImgView.vue'

export default {
  name: 'articleDetails',
  components: {
    MyPagination,
    Breadcrumb,
    TablePage,
    ImgView
  },
  data() {
    return {
      CREATE,
      industrys: [],
      // levels: [],
      data: {
        page: 1,
        pageSize: 10,
        list: [
          // {
          //   createTime: 1526363995000,
          //   id: 103,
          //   imageUrl:
          //     'http://oxpgahw70.bkt.clouddn.com/2018051513581754113cb79d8e13d893c3055289c3e2997ca.jpg',
          //   label: '6666,5555',
          //   recommend: 1,
          //   title: '小白的视频资讯111',
          //   titleName: '大白',
          //   type: 1,
          //   weight: 2
          // }
        ],
        total: 0,
        loading: false,
        orderBy: 1,
        titleId: this.$route.params.id
      }
    }
  },
  methods: {
    defValFilter01,
    detailTimeFilter,
    labelFilter,
    informationTypeFilter,
    findList(page = {}) {
      this.data.loading = true
      getArticleDetailsApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...data, ...page, loading: false }
        console.log('res+++++++++++456', this.data)
      })
    }
  },
  created() {}
}
</script>
<style lang="less" scoped>
.header.bread_crumb {
  height: 74px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30px;
  justify-content: space-between;
  margin-bottom: 30px;
  .el-breadcrumb {
    padding-bottom: 0px;
  }
}
</style>
<style lang="less">
.content_data.articleDetails {
  .el-table__row {
    .cell {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .el-button.el-button--primary.is-round {
    height: 40px;
    padding: 0 13px;
    line-height: 40px;
    background-color: #51c5ff;
    border-color: #51c5ff;
    span {
      height: 40px;
      font-size: 16px;
      display: inline-block;
      line-height: 40px;
      > img {
        vertical-align: middle;
        margin-right: 10px;
        // margin-top: 8px;
      }
    }
  }
}
</style>
