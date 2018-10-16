<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-tabs v-model="tab" @tab-click="findList">
      <el-tab-pane label="登录日志" name="0">
        <el-table :data="data.LoginLog" v-loading="data.loading" element-loading-text="拼命加载中...">
          <el-table-column prop="logname" label="日志名称" min-width="100"/>
          <el-table-column prop="message" label="日志消息" :formatter="defValFilter01" min-width="180"/>
          <el-table-column prop="ip" label="IP地址" :formatter="defValFilter01" min-width="180"/>
          <el-table-column prop="succeed" label="执行结果" min-width="100"/>
          <el-table-column prop="createtime" label="记录时间" :formatter="dateTimeFilter" min-width="180"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="1">
        <el-table :data="data.OperationLog" v-loading="data.loading" element-loading-text="拼命加载中...">
          <el-table-column prop="logtype" label="日志类型" min-width="100"/>
          <el-table-column prop="logname" label="日志说明" min-width="200"/>
          <el-table-column prop="method" label="调用接口" min-width="170"/>
          <el-table-column prop="classname" label="调用类名" min-width="260"/>
          <el-table-column prop="createtime" label="记录时间" :formatter="dateTimeFilter" min-width="180"/>
          <el-table-column prop="succeed" label="执行状态" min-width="100"/>
          <el-table-column prop="message" label="执行结果" min-width="240"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <MyPagination :page="data.page" :page-size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getLoginLogApi, getOperationLogApi} from '../../../api/logApi'
  import {dateTimeFilter, defValFilter01} from '../../../constant/filter'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  export default {
    name: 'logList',
    components: {MyPagination, Breadcrumb},
    data() {
      return {
        tab: '0',
        data: {page: 1, pageSize: 10, LoginLog: [], OperationLog: [], total: 0, loading: false},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      findList(page = {}) {
        this.data.loading = true
        this.$router.push({query: {tab: this.tab}})
        if (this.tab * 1) {
          getOperationLogApi(page).then(({total, list}) => {
            this.data = {...this.data, ...page, OperationLog: list, total, loading: false}
          })
        } else {
          getLoginLogApi(page).then(({total, list}) => {
            this.data = {...this.data, ...page, LoginLog: list, total, loading: false}
          })
        }
      },
    },
    created() {
      this.tab = this.$route.query.tab || '0'
    },
  }
</script>
