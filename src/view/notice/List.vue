<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-button type="primary" style="right: 100px" @click="add(0)">新建公告</el-button>
    <el-button type="primary" @click="add(1)">新建推送</el-button>
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column label="序号" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="content" label="内容" :formatter="defValFilter01" min-width="350"/>
        <el-table-column prop="type" label="类型" :formatter="noticeTypeFilter" min-width="100"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="del" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <el-dialog :title="'新建'+dialog.title" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog.data" :rules="rules" ref="notice" labelWidth="100px">
        <el-form-item :label="dialog.title+'名称'" prop="title">
          <el-input v-model="dialog.data.title" :placeholder="'请输入'+dialog.title+'名称...'"/>
        </el-form-item>
        <el-form-item :label="dialog.title+'内容'" prop="content">
          <el-input type="textarea" :rows="10" :placeholder="'请输入'+dialog.title+'内容...'" v-model="dialog.data.content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getNoticeListApi, addNoticeApi, delNoticeApi} from '../../api/noticeApi'
  import {success, error, confirm} from '../../actions'
  import {defValFilter01, noticeTypeFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'

  export default {
    name: 'noticeList',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        fullLoading: false,
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false},
        dialog: {show: false, title: '', data: {}},
        rules: {
          title: [{required: true, message: '不能为空...', trigger: 'blur'}, {max: 15, message: '不能超过15个字符...', trigger: 'blur'}],
          content: [{required: true, message: '不能为空...', trigger: 'blur'}, {max: 200, message: '不能超过200个字符...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      defValFilter01,
      noticeTypeFilter,
      findList(page = {}) {
        this.data.loading = true
        getNoticeListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      add(type) {
        if (type) {
          this.dialog = {show: true, title: '推送', data: {title: '', content: '', type}}
        } else {
          this.dialog = {show: true, title: '公告', data: {title: '', content: '', type}}
        }
      },
      del({id, title}) {
        confirm(`确认删除"${title}"?`, 'warning', '删除确认').then(() => delNoticeApi(id).then(() => {
          success(`删除"${title}"成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || `删除"${title}"失败！`)))
      },
      submit() {
        this.$refs.notice.validate((valid) => {
          if (valid) {
            this.fullLoading = true
            addNoticeApi(this.dialog.data).then(() => {
              success(`新建${this.dialog.title}“${this.dialog.data.title}”成功！`)
              this.fullLoading = false
              this.dialog.show = false
              this.findList()
            })
          } else {
            return false
          }
        })
      },
    },
    created() {
    },
  }
</script>
