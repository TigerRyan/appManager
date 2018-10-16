
<template>
  <div class='content_data rankingList'>
    <div class="titleBox">
      <div class="content-title">{{this.data.userName}}的宝券列表</div>
      <el-button plain class="backUp" type="primary" @click="back">返回</el-button>
    </div>
    <TablePage>
              <el-table :data="data.list" ref="multipleTable" stripe  v-loading="data.loading" element-loading-text="拼命加载中...">
                
                <el-table-column prop="id" label="宝券ID"/>
                <el-table-column prop="createTime" :formatter="detailTimeFilter" label="获取时间" />
                <el-table-column  label="操作" class="operation"  min-width="200">
                  <template slot-scope="scope">
                    <el-button type="del" @click="edit(scope.row.id)">销毁</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </TablePage>
          <!-- 分页 -->
			<MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
import MyPagination from '../../components/MyPagination.vue'
import TablePage from '../../components/TablePage.vue'
import {getCoupInfo,delcoupon} from '../../api/couponManage.js'
import { confirm, success, error } from '../../actions'
import {detailTimeFilter} from "../../constant/filter"
export default {
  name: 'rankingList',
  components: {
    MyPagination,
    TablePage
  },
  data () {
    return {
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        start: null,
        end: null,
        id: this.$route.query.id,
        userName: this.$route.query.userName,
        list: []
      },
    }
  },
  created () {

  },
  methods: {
    detailTimeFilter,
    back(){
      // this.$router.go(-1)
      this.$router.push({path:'index',query:{backNum:2}})
    },
    edit(idx){
       confirm(`确认删除宝卷?`, 'error', '确认删除').then(_ => {
        delcoupon(idx)
          .then(() => {
            success(`删除宝卷成功`)
            this.findList(...this.data)
          })
          .catch(({ msg }) => error(msg || '操作失败！请稍后重试...'))
      })

    },
    // 获取宝卷列表
    findList(page = {}){
      this.data.loading = true
      getCoupInfo({...this.data,...page}).then(data=>{
        this.data= {...this.data,...page,...data,loading:false,page: data.pageNum}
      })
    },
  }
}
</script>
<style lang='less' scoped>
.rankingList{
  .titleBox {
      position: relative;
  }
  .backUp {
      position: absolute;
      top: 15px;
      right: 40px;
    }
}
</style>