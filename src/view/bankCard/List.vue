<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入会员手机号码或姓名" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="银行卡ID" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="userId" label="用户ID" min-width="80"/>
        <el-table-column prop="userName" label="持卡人姓名" :formatter="defValFilter02" min-width="140"/>
        <el-table-column prop="cardNo" label="卡号" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="phone" label="手机号" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="bankName" label="银行名称" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="subBankName" label="支行名称" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="createtime" label="创建时间" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="updatetime" label="修改时间" :formatter="defValFilter02" min-width="100"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getBankCardListApi} from '../../api/bankCardApi'
  import { dateTimeFilter, defValFilter01, defValFilter02 } from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  export default {
    name: 'bankCardList',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        data: {page: 1, pageSize: 10, list: [], total: 0, status: 1, loading: false, name: null, userId: ''},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      defValFilter02,
      findList(page = {}) {
        this.data.loading = true
        getBankCardListApi({...this.data, ...page}).then((data) => {
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
