<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-button type="primary" @click="editLevel(false)" :disabled="disabled">添加等级</el-button>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="等级名称" :formatter="defValFilter01" min-width="160"/>
        <el-table-column prop="val" label="等级值" :formatter="defValFilter03" min-width="130"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="editLevel(scope.row)" :disabled="disabled">编辑</el-button>
            <el-button type="del" size="small" @click="del((data.page - 1) * data.pageSize + scope.$index,scope.row)" :disabled="disabled">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog.data" :rules="rules" ref="banner" labelWidth="100px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="dialog.data.name" placeholder="请输入等级名称..."/>
        </el-form-item>
        <el-form-item label="等级值" prop="val">
          <el-input-number v-model="dialog.data.val" :min="0" :max="99"/>
          <el-tag type="warning" style="font-size: 16px">值越大，排名越靠前，等级优先级越高</el-tag>
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
  import { getConfigApi, putConfigApi } from '../../../api/systemApi'
  import { confirm, success } from '../../../actions'
  import { defValFilter01, defValFilter03 } from '../../../constant/filter'
  import { TEACHER_LEVEL as key } from '../../../constant'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'

  export default {
    name: 'bannerList',
    components: {MyPagination, Breadcrumb, TablePage},
    data () {
      return {
        disabled:　false,
        levels: [],
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false},
        dialog: {show: false, title: '', data: {}},
        rules: {
          name: [{required: true, message: '请输入等级名称...', trigger: 'blur'}, {max: 7, message: '不能超过7个字符...', trigger: 'blur'}],
          val: [{required: true, type: 'number', message: '请输入等级值...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      defValFilter01,
      defValFilter03,
      findList (page = {}) {
        this.data.loading = true
        this.data = {...this.data, ...page, total: this.levels.length, list: null, loading: false}
        this.data.list = this.levels.slice((this.data.page - 1) * this.data.pageSize, this.data.page * this.data.pageSize)
      },
      del (index, {name}) {
        confirm(`确认删除教师等级"${name}"?`, 'warning', '删除确认').then(() => {
          this.levels.splice(index, 1)
          success(`删除教师等级"${name}"成功！`)
          this.findList()
        })
      },
      editLevel (data) {
        if (data) {
          this.dialog = {show: true, title: '编辑教师等级', data}
        } else {
          this.dialog = {show: true, title: '添加教师等级', data: {name: '', val: 0}, create: true}
        }
      },
      submit () {
        this.$refs.banner.validate((valid) => {
          if (valid) {
            this.dialog.create && this.levels.push(this.dialog.data)
            this.levels.sort((a, b) => a.val - b.val)
            putConfigApi({key, val: this.levels}).then(() => {
              success(`${this.dialog.title}“${this.dialog.data.name}”成功！`)
              this.dialog.show = false
              this.findList()
            })
          } else {
            return false
          }
        })
      },
    },
    created () {
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
      getConfigApi(key).then((levels) => {
        this.levels = levels || []
        this.findList()
      })
    },
  }
</script>
