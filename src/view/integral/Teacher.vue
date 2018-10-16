<template>
  <div class="content_data teacherIntegral">
    <Breadcrumb/>
    <ul class="cate_list">
      <li v-for="(item, index) in TitleList" :class="{blue: changeTitle == index}" @click="redTitle(index)" :key="index">{{item.name}}</li>
    </ul>
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id"  label="ID" min-width="80"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="110"/>
        <el-table-column prop="score" label="获取积分数" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="frequencyLimit" label="每日上限（次）" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="createTime" label="更新时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="del" size="small" @click="edit(scope.row)" :disabled='disabled'>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <el-dialog title="编辑" :visible.sync="show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" :rules="rules" ref="dialog" labelWidth="100px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="dialog.taskName" placeholder="请输入任务名称..."/>
        </el-form-item>
        <el-form-item label="积分值" prop="score">
          <el-input v-model="dialog.score" placeholder="请输入积分值..."/>
        </el-form-item>
        <el-form-item label="次数" prop="frequencyLimit" v-if="showCount">
          <el-input v-model="dialog.frequencyLimit" placeholder="请输入次数..."/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getIntegralApi, updateIntegralApi, changeStatus, delIntegralApi} from '../../api/integral'
  import {success, error, confirm} from '../../actions'
  import {defValFilter01, noticeTypeFilter, dateTimeFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'

  export default {
    name: 'teacherIntegral',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        disabled:false,
        changeTitle: 0,
        fullLoading: false,
        show: false,
        TitleList: [{id: 0, name: '日常任务'}, {id: 1, name: '推荐任务'}],
        data: {page: 1, pageSize: 10, list: [], total: 0, taskUserType :2, taskType: null, loading: false},
        dialog: {},
        showCount: true,

        rules: {
          taskName: [{required: true, message: '不能为空...', trigger: 'blur'}, {max: 15, message: '不能超过15个字符...', trigger: 'blur'}],
          score: [{required: true, message: '不能为空...', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.data.taskType = 0;
      // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
    },
    methods: {
      defValFilter01,
      noticeTypeFilter,
      dateTimeFilter,
      findList(page = {}) {
        this.data.loading = true
        getIntegralApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      //  切换列表
      redTitle(index) {
        this.changeTitle =this.data.taskType = index
        this.findList()
        
      },
      //  改变状态
      statusChange({id, taskName, status}) {
        changeStatus(id).then(() => {
          success(`${status - 1 ? '禁用' : '启用'}"${taskName}"成功！`)
        }).catch(({msg}) => error(msg || `${status ? '禁用' : '启用'}失败！请稍后重试...`))
      },
      //  编辑
      edit(row){
        this.show = true
        if([5,9,10].indexOf(row.id) > 0){
          this.showCount = false
        }else{
          this.showCount = true
        }
        this.dialog = {id: row.id,taskName: row.taskName,score: row.score, frequencyLimit: row.frequencyLimit, status: row.status}
      },
      // 删除
      del({id, taskName}) {
        confirm(`确认删除"${taskName}"?`, 'warning', '删除确认').then(() => delIntegralApi(id).then(() => {
          success(`删除"${taskName}"成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || `删除"${taskName}"失败！`)))
      },

      // 提交
      submit() {
        this.$refs.dialog.validate((valid) => {
          if (valid) {
            this.fullLoading = true
            updateIntegralApi(this.dialog).then(() => {
              success(`编辑“${this.dialog.taskName}”成功！`)
              this.fullLoading = false
              this.show = false
              this.findList()
            })
          } else {
            return false
          }
        })
      },
    },
  }
</script>
<style lang="less">
  .teacherIntegral{
    .cate_list{
      height:74px;
      line-height: 74px;
      background-color: #fff;
      color: #333;
      margin-bottom: 20px;
      li{
        font-size: 20px;
        font-weight: 600;
        float: left!important;
        margin: 0 17px;
      }
      .blue{
        color: #51c5ff;
        border-bottom: 3px solid #51c5ff;
      }
    }

  }

</style>
