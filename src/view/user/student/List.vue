<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入会员手机号码或姓名" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <el-input placeholder="请输入您要查询的邀请码" suffix-icon="el-icon-search" v-model="data.pid" @blur="search"/>
      <ExportUserList :type="this.data.type"/>
      <el-table :data="data.list" v-loading="data.loading" @sort-change="sort" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="用户头像" min-width="100">
          <template slot-scope="scope">
            <HeadImg :src="scope.row.pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户姓名" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="phone" label="手机号码" :formatter="defValFilter02" min-width="130"/>
        <!--<el-table-column prop="money" label="可提现佣金" :formatter="currencyFilter" min-width="110"/>-->
        <!--<el-table-column prop="frozenMoney" label="不可提现佣金" :formatter="currencyFilter" min-width="120"/>-->
        <!--<el-table-column prop="cash" label="总提现金额" :formatter="currencyFilter" min-width="110"/>-->
        <!--<el-table-column prop="earning" sortable="custom" label="总消费金额" :formatter="currencyFilter" min-width="130"/>-->
        <!--<el-table-column prop="refund" label="总退款金额" :formatter="currencyFilter" min-width="110"/>-->
        <el-table-column prop="pid" label="我的邀请码" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="userPid" label="受邀码" :formatter="defValFilter01" min-width="90"/>
        <el-table-column prop="gral" label="积分" :formatter="defValFilter03" min-width="90"/>
        <el-table-column prop="deleted" label="用户状态" min-width="140">
          <template slot-scope="scope">
            <el-switch :disabled="disabled" v-model="scope.row.deleted" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用" :active-value="0" :inactive-value="1" @change="statusChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="注册时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <div style="display:flex">
              <el-button type="edit" size="small" @click="$router.push({name: 'studentDetails', query: {id:scope.row.id}})">详情</el-button>
              <el-button :disabled="disabled" type="edit" size="small" @click="$router.push({name: 'studentEditor', params: {id:scope.row.id}})">编辑 
              </el-button>
              <el-button type="edit" size="small" @click="sendNews(scope.row)">发送消息</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>

    <!-- 发送消息弹框 -->
    <el-dialog title="编辑发送消息" :visible.sync="editDialog" :modal="modal" custom-class="establish" width="700px" center @close="reset">
        <el-form :model="editList" ref="editList" :rules="rules" label-width="130px">
          <el-form-item label="消息标题"  prop="title">
            <el-input v-model="editList.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="消息内容"  prop="content">
            <el-input type="textarea" v-model="editList.content"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn" style="text-align:center;">
            <el-button class="codes"  type="primary" @click="editModul('editList')" >确定</el-button>
            <el-button  @click="editDialog=false" >取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getUserListApi, toggleUserApi,sendApi} from '../../../api/userApi'
  import {dateTimeFilter, defValFilter01, defValFilter02, currencyFilter, defValFilter03} from '../../../constant/filter'
  import {success, error} from '../../../actions'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import HeadImg from '../../../components/HeadImg.vue'
  import TablePage from '../../../components/TablePage.vue'
  import ExportUserList from '../../../components/view/ExportUserList.vue'

  export default {
    name: 'studentList',
    components: {MyPagination, HeadImg, Breadcrumb, TablePage, ExportUserList},
    data() {
      return {
        editDialog:false,
        modal:false,
        data: {page: 1, pageSize: 10, type: 1, list: [], total: 0, loading: false, name: null, pid: null},
        disabled: false,
        editList:{
          id:null,
          title:'',
          content:''
        },
        rules: {
          title: [
            { required: true, message: "请输入消息标题", trigger: "change" },
            { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "change" }
          ],
          content: [{ required: true, message: "请输入消息内容", trigger: "change" }],
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
      defValFilter01,
      defValFilter02,
      defValFilter03,
      currencyFilter,
      findList(page = {}) {
        this.data.loading = true
        getUserListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
      sort({order, prop}) {
        this.search(prop ? {[prop]: {'descending': 0, 'ascending': 1}[order]} : {earning: null})
      },
      statusChange({id, name, deleted}) {
        toggleUserApi(id).then(() => success(`${deleted ? '禁用' : '启用'}用户"${name}"成功！`)).catch(({msg}) => error(msg || `${deleted ? '禁用' : '启用'}失败！请稍后重试...`))
      },
      editModul(){
        this.$refs.editList.validate((valid) => {
          if (valid) {
            sendApi({...this.editList}).then(data=>{
              this.$message({
                message: '发送消息成功',
                type: 'success'
              });
            })
            this.editDialog=false
          }
        });
        
      },
      sendNews(val){
        this.editDialog=true
        this.editList.id=val.id
      },
      reset(){
        this.$refs.editList.resetFields();
      }
    },
  }
</script>
<style lang="less" scoped>
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 30%;
    }
  }
</style>
