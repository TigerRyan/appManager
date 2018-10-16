<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入姓名..." suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <ExportButton text="导出账单" :method="exportBillListApi"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="userId" label="用户ID" min-width="80"/>
        <el-table-column prop="phone" label="电话" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="name" label="姓名" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="earning" label="总收入金额" :formatter="currencyFilter" min-width="110"/>
        <el-table-column prop="refund" label="退款总金额" :formatter="currencyFilter" min-width="110"/>
        <el-table-column prop="cash" label="提现总金额" :formatter="currencyFilter" min-width="110"/>
        <el-table-column prop="balance" label="当前余额" :formatter="currencyFilter" min-width="110"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import { getBillListApi, exportBillListApi } from '../../api/userApi'
  import { defValFilter01, currencyFilter } from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ExportButton from '../../components/ExportButton.vue'

  export default {
    name: 'orderList',
    components: {MyPagination, Breadcrumb, TablePage, ExportButton},
    data () {
      return {
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false, name: null},
      }
    },
    methods: {
      defValFilter01,
      currencyFilter,
      exportBillListApi,
      findList (page = {}) {
        this.data.loading = true
        getBillListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      search (page = {}) {
        this.findList({...page, page: 1})
      },
    },
    created () {
    },
  }
</script>
