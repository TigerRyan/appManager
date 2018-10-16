<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入姓名或手机号搜索..." style="width: 260px" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="转账ID" min-width="100"/>
        <el-table-column prop="fromUser" label="来源账户ID" min-width="100"/>
        <el-table-column prop="fromName" label="来源用户姓名" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="fromPhone" label="来源用户手机号" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="fromType" label="来源用户身份" :formatter="defValFilter04" min-width="110"/>
        <el-table-column prop="money" label="转账金额" :formatter="defValFilter03" min-width="100"/>
        <el-table-column prop="targetUser" label="目标账户ID" min-width="100"/>
        <el-table-column prop="targetName" label="目标用户姓名" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="targetPhone" label="目标用户手机号" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="targetType" label="目标用户身份" :formatter="defValFilter04" min-width="110"/>
        <el-table-column prop="createTime" label="转账时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="arrivalTime" label="到账时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag type="success">转账成功</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getTransferListApi} from '../../../api/orderApi'
  import {dateTimeFilter, defValFilter01, defValFilter03, defValFilter04} from '../../../constant/filter'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'

  export default {
    name: 'transferPass',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        data: {page: 1, pageSize: 10, status: 2, list: [], total: 0, loading: false, keyWord: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      defValFilter03,
      defValFilter04,
      findList(page = {}) {
        this.data.loading = true
        getTransferListApi({...this.data, ...page}).then((data) => {
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
