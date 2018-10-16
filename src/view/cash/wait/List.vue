<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入提现人姓名或提现手机号..." style="width: 260px" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <el-button type="edit" size="small" @click="batchAudit(2)">批量同意</el-button>
      <el-button type="del" size="small" @click="batchAudit(3)">批量拒绝</el-button>
      <ExportButton text="导出提现记录" :method="exportCashList"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中..." @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="userPhone" label="用户手机号" min-width="130"/>
        <el-table-column prop="id" label="记录ID" min-width="100"/>
        <el-table-column prop="userName" label="提现姓名" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="phone" label="提现手机号" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="money" label="提现金额" :formatter="moneyFilter" min-width="100"/>
        <el-table-column prop="money" label="实际金额" :formatter="defValFilter03" min-width="100"/>
        <el-table-column prop="quota" label="手续费" :formatter="defValFilter03" min-width="100"/>
        <el-table-column prop="rate" label="手续费费率" :formatter="defValFilter03" min-width="130"/>
        <el-table-column prop="quotaMoney" label="收手续费部分" :formatter="defValFilter03" min-width="150"/>
        <el-table-column prop="card" label="提现卡号" :formatter="defValFilter01" min-width="210"/>
        <el-table-column prop="name" label="所属银行" :formatter="defValFilter01" min-width="220"/>
        <el-table-column prop="creattime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="edit" size="small" :disabled="scope.row.disabled" @click="audit(scope.row,2)">同意</el-button>
            <el-button type="del" size="small" :disabled="scope.row.disabled" @click="audit(scope.row,3)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getCashListApi, auditCashApi, exportCashListApi, batchAuditApi} from '../../../api/cashApi'
  import {dateTimeFilter, defValFilter01, defValFilter03} from '../../../constant/filter'
  import {success, error} from '../../../actions'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'
  import ExportButton from '../../../components/ExportButton.vue'

  export default {
    name: 'cashWait',
    components: {MyPagination, Breadcrumb, TablePage, ExportButton},
    data() {
      return {
        data: {page: 1, pageSize: 10, status: 1, list: [], total: 0, loading: false, name: null},
        multipleSelection: [],
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      defValFilter03,
      moneyFilter({money, quota}) {
        return money + quota
      },
      findList(page = {}) {
        this.data.loading = true
        getCashListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      exportCashList({start, end}) {
        return exportCashListApi({...this.data, start, end})
      },
      audit(row, status) {
        this.$set(row, 'disabled', true)
        auditCashApi(row.id, status).then(() => {
          success(`提现人【${row.userName}】的提现申请审核成功！`)
          this.findList()
        }).catch(({msg}) => {
          error(msg)
          this.findList()
        })
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
      batchAudit(status) {
        const loading = this.$loading({
          lock: true,
          text: '批量处理中...请稍等！',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        console.log(loading)
        batchAuditApi(this.multipleSelection.map(({id}) => id), status).then((data) => {
          this.multipleSelection.forEach(({id, userName}) => {
            setTimeout(() => {
              this.$notify({
                title: data[id] ? '失败' : '成功',
                message: data[id] ? `提现人【${userName}】的提现申请审核操作失败：${data[id]}` : `提现人【${userName}】的提现申请审核操作成功！`,
                type: data[id] ? 'error' : 'success',
              })
            }, 10)
          })
          this.findList()
          loading.close()
        }).catch(({msg}) => {
          error(msg)
          loading.close()
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
    },
    created() {
    },
  }
</script>
