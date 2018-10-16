<template>
  <div class="content_data agencyIndustry">
    <Breadcrumb/>
    <div class="titleBox">
      <div class="content-title">机构行业</div>
      <el-button plain icon="el-icon-plus" class="addClassify" type="primary" @click="add(0)" :disabled='disabled'>新增机构行业</el-button>
    </div>
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="name" label="机构行业名称" min-width="110"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="weight" label="权重" min-width="150"/>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="small" :disabled='disabled' plain @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" :disabled='disabled' plain @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <el-dialog :title="title" :visible.sync="show" :modalAppendToBody="false" width="600px" @close="handleClose">
      <el-form :model="dialog" :rules="rules" ref="dialog" labelWidth="150px">
        <el-form-item label="机构行业名称" prop="name">
          <el-input v-model="dialog.name" placeholder="请输入机构行业名称..." :max="10"/>
        </el-form-item>
        <el-form-item label="权重值设置" prop="weight" :min="0" :step="1">
          <el-input type='number' v-model.number="dialog.weight" placeholder="请输入权重值..."/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit()">保存</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAppSystemListApi, upDateAppSystemApi, addAppSystemApi, delAppSystemApi} from'../../api/appSystemApi'
  import {success, error, confirm} from '../../actions'
  import {defValFilter01, dateTimeFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'

  export default {
    name: 'agencyIndustry',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        fullLoading: false,
        show: false,
        type:'',
        title:'',
        disabled:false,
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false},
        dialog: {},
        rules: {
          name: [{required: true, message: '不能为空...', trigger: 'blur'}, {max: 10, message: '不能超过10个字符...', trigger: 'blur'}],
          weight: [{required: true, message: '不能为空...', trigger: 'blur'},
                   {pattern: /^[0-9]{0,6}$/, message: '只能为非负整数', trigger: 'blur' }],
        },
      }
    },
    created() {
       let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
    },
    methods: {
      defValFilter01,
      dateTimeFilter,
      findList(page = {}) {
        this.data.loading = true
        getAppSystemListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      // 新增
      add(type) {
        this.title = '新增机构行业'
        this.type=0
        this.show = true
        this.dialog = {name: '',weight:'',}
      },
      handleClose(){
        this.$refs.dialog.resetFields()
      },
      // 编辑
      edit(row){
        this.title = '编辑机构行业'
        this.type=1
        this.show = true
        this.dialog = {name: row.name, weight: row.weight, id: row.id}
      },
      //  删除
      del({id, name}) {
        confirm(`确认删除"${name}"?`, 'warning', '删除确认').then(() => delAppSystemApi(id).then(() => {
          success(`删除"${name}"成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || `删除"${name}"失败！`)))
      },
      // 提交
      submit() {
        this.$refs.dialog.validate((valid) => {
          if (valid) {
            this.fullLoading = true
            if(this.type == 0){
              addAppSystemApi(this.dialog).then((data) => {
                success(`新建${this.dialog.name}成功！`)
                this.findList()
                this.fullLoading = false
                this.show = false
              })
            } else if(this.type == 1)
              upDateAppSystemApi(this.dialog).then( data => {
                success(`编辑${this.dialog.name}成功！`)
                this.findList()
                this.fullLoading = false
                this.show = false
              })
          } else {
            return false
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
.agencyIndustry {
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
