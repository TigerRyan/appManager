<template>
  <div class="content_data Classification">
    <Breadcrumb/>
    <div class="titleBox">
      <div class="content-title">科目分类</div>
      <el-button plain icon="el-icon-plus" class="addClassify" type="primary" @click="add(0)" :disabled='disabled'>新增科目分类</el-button>
    </div>
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="name" label="科目名称"  min-width="110"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="sortNum" label="权重"  min-width="150"/>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="edit(scope.row)" :disabled="disabled">编辑</el-button>
            <el-button type="danger" plain size="small" @click="del(scope.row)" :disabled="disabled">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <el-dialog :title="dialog.title" :visible.sync="show" :modalAppendToBody="false" width="600px" @close="handleClose">
      <el-form :model="dialog" :rules="rules" ref="notice" labelWidth="150px">
        <el-form-item label="科目名称" prop="name">
          <el-input v-model="dialog.name" placeholder="请输入科目名称..."/>
        </el-form-item>
        <el-form-item label="权重值设置" prop="sortNum">
          <el-input v-model.trim="dialog.sortNum" placeholder="请输入权重值..."/>
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
  import {getConfigurationListApi,editSubjectCategoryApi,createSubjectCategoryApi,deleteSubjectCategoryApi} from '../../api/Classification'
  import {success, error, confirm} from '../../actions'
  import {dateTimeFilter, noticeTypeFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'

  export default {
    name: 'Classification',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        disabled: false,
        fullLoading: false,
        show: false,
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false},
        dialog: {id: null,name: '', data: {},title: "编辑科目"},
        rules: {
          name: [{required: true, message: '不能为空...', trigger: 'blur'}, {max: 6, message: '不能超过6个字符...', trigger: 'blur'}],
          sortNum: [
            {required: true, message: '不能为空...', trigger: 'blur'}, 
            // {max: 6, message: '不能超过6位数...', trigger: 'blur'},
            {pattern: /^[0-9]{0,6}$/, message: '只能为非负整数', trigger: 'blur' }
          ],
        },
      }
    },
    created() {
            // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
    },
    methods: {
      dateTimeFilter,
      noticeTypeFilter,
      handleClose() {
        this.$refs.notice.resetFields();
      },
      findList(page = {}) {
        this.data.loading = true
        getConfigurationListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      add(type) {
        this.show = true
        if (type) {
          this.dialog = {show: true, title: '推送', data: {title: '', content: '', type}}
        } else {
          this.dialog = { name: "",sortNum: "",title:"新建分类" }
        }
      },
      edit(row){
        this.show = true
        this.dialog = {name: row.name, sortNum: row.sortNum,id: row.id,title:"编辑"}
      },
      del({id, name}) {
        confirm(`确认删除科目"${name}"?`, 'warning', '删除确认').then(() => deleteSubjectCategoryApi(id).then(() => {
          success(`删除科目"${name}"成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || `删除科目"${name}"失败！`)))
      },
      submit() {
        this.$refs.notice.validate((valid) => {
          if (valid) {
            // this.fullLoading = true
            if(this.dialog.id){
              editSubjectCategoryApi(this.dialog.id,this.dialog).then(() => {
                success(`${this.dialog.title}分类科目“${this.dialog.name}”成功！`)
                this.show = false
                this.findList()
              })
            }else {
              // createSubjectCategoryApi
              createSubjectCategoryApi(this.dialog).then(() => {
                success(`${this.dialog.title}分类科目“${this.dialog.name}”成功！`)
                this.show = false
                this.findList()
              })
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>
<style lang="less">
  .Classification{
    .titleBox {
      position: relative;
    }
    .addClassify {
      position: absolute;
      top: 15px;
      right: 40px;
    }
  }
</style>
