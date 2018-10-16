<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入会员手机号码或姓名" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <el-input placeholder="请输入您要查询的邀请码" suffix-icon="el-icon-search" v-model="data.pid" @blur="search"/>
      <ExportUserList :type="this.data.type" />
      <el-table :data="data.list" v-loading="data.loading" @sort-change="sort" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="50">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="用户头像" min-width="80">
          <template slot-scope="scope">
            <HeadImg :src="scope.row.pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户姓名" :formatter="defValFilter02" min-width="80"/>
        <el-table-column prop="phone" label="手机号码" :formatter="defValFilter02" min-width="110"/>
        <!--<el-table-column prop="money" label="可提现佣金" :formatter="currencyFilter" min-width="110">-->
          <!--<template slot-scope="scope">{{currencyFilter(0, 0, scope.row.money - scope.row.frozenMoney)}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="frozenMoney" label="不可提现佣金" :formatter="currencyFilter" min-width="120"/>-->
        <!--<el-table-column prop="cash" label="总提现金额" :formatter="currencyFilter" min-width="110"/>-->
        <!--<el-table-column prop="earning" sortable="custom" label="总收入金额" :formatter="currencyFilter" min-width="130"/>-->
        <!--<el-table-column prop="refund" label="总退款金额" :formatter="currencyFilter" min-width="110"/>-->
        <el-table-column prop="pid" label="我的邀请码" :formatter="defValFilter01" min-width="90"/>
        <el-table-column prop="userPid" label="受邀码" :formatter="defValFilter01" min-width="90"/>
        <el-table-column prop="gral" label="积分" :formatter="defValFilter03" min-width="60"/>
        <el-table-column prop="deleted" label="用户状态" min-width="140">
          <template slot-scope="scope">
            <el-switch　 v-model="scope.row.deleted" active-color="#13ce66" inactive-color="#ff4949" :disabled="disabled" active-text="启用" inactive-text="禁用" :active-value="0" :inactive-value="1" @change="statusChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="注册时间" :formatter="dateTimeFilter" min-width="140"/>
        <el-table-column prop="collageType" label="开通拼课" :formatter="openStatusFilter" min-width="90"/>
        <el-table-column label="操作" min-width="500">
          <template slot-scope="scope">
            <el-button type="edit"  @click="$router.push({name: 'teacherDetails', query: {id:scope.row.id}})">详情</el-button>
            <el-button type="edit"  @click="$router.push({name: 'teacherEditor', params: {id:scope.row.id}})" :disabled="disabled">编辑</el-button>
            <!-- <el-button :type="scope.row.recommend ? 'edit' : 'del'" size="small" @click="recommend(scope.row)">{{scope.row.recommend ? '取消推荐' : '设置推荐'}}</el-button> -->
            <el-button  v-if="scope.row.recommend" type="del" size="middle" @click="cancleHandle(scope.row)" :disabled="disabled">取消推荐</el-button>
            <el-button  v-if="!scope.row.recommend" type="edit" size="middle" @click="setHanddle(scope.row)" :disabled="disabled">设置推荐</el-button>
            <el-button  type="edit" size="middle" @click="sendNews(scope.row)" :disabled="disabled">发送消息</el-button>
            <!-- <el-button v-if="scope.row.collageType==2" type="edit" size="middle" @click="shareCourseHandle(scope.row,3)" :disabled="disabled">禁用拼课</el-button>
            <el-button v-if="scope.row.collageType==3" type="edit" size="middle" @click="shareCourseHandle(scope.row,2)" :disabled="disabled">启用拼课</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
     <el-dialog :title="menu.tip" width="38%" :modal="true" customClass="my-dialog" :visible.sync="menu.show" :append-to-body="true" @close="Reset">
      <el-form :model="menu" :rules="rules" ref="menu" label-width="120px">
        <el-form-item label="栏目名称:" prop="name">
          <el-input v-model="menu.name" width="500" />
        </el-form-item>
        <el-form-item label="上传视频:" prop="videoUrl">
            <!-- <i v-show="menu.videoUrl" class="el-icon el-icon-close"></i> -->
            <VideoUpload ref="videUpload" @success="uploadVide" :url="menu.videoUrl"></VideoUpload>
            <el-tag type="danger">上传视频大小建议：视频文件大小500 M 以内！</el-tag>
        </el-form-item>
        <el-form-item label="上传图片:" prop="imgUrl">
            <i v-show="menu.imgUrl" class="el-icon el-icon-close" @click="deletePic"></i>
            <Avatar :url="menu.imgUrl" width="150"  height="140" @success="menu.imgUrl = $event"/>
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
        </el-form-item>
        <el-form-item v-show="false" label="权重值:" prop="weight">
          <el-input-number v-model="menu.weight" :min="0" :max="999" :step="1"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="menu.show = false">取 消</el-button>
      </div>
    </el-dialog>

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
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
import {
  getUserListApi,
  toggleUserApi,
  recommendUserApi,
  sendApi,
  toggleUserStatusApi
} from '../../../api/userApi'
import {
  dateTimeFilter,
  defValFilter01,
  defValFilter02,
  currencyFilter,
  defValFilter03,
  openStatusFilter
} from '../../../constant/filter'
import { confirm,success, error } from '../../../actions'
import MyPagination from '../../../components/MyPagination.vue'
import Breadcrumb from '../../../components/Breadcrumb.vue'
import HeadImg from '../../../components/HeadImg.vue'
import TablePage from '../../../components/TablePage.vue'
import ExportUserList from '../../../components/view/ExportUserList.vue'
import VideoUpload from '../../../components/VideoUpload.vue'
import Avatar from '../../../components/Avatar.vue'

export default {
  name: 'teacherList',
  components: {
    MyPagination,
    HeadImg,
    Breadcrumb,
    TablePage,
    ExportUserList,
    VideoUpload,
    Avatar
  },
  data() {
    return {
      editDialog:false,
      modal:false,
      editList:{
          id:null,
          title:'',
          content:''
        },
      progress:false,    //进度条显示隐藏
      data: {
        page: 1,
        pageSize: 10,
        type: 2,
        list: [],
        total: 0,
        loading: false,
        name: null,
        pid: null
      },
      menu: {
        videoUrl: '',
        imgUrl: '',
        tip: '推荐老师',
        isRecommend: 0, //0推荐，1取消推荐
        show: false,
        name: ''
      },
      rules: {
        videoUrl: [
          { required: true, message: '请上传推荐老师宣传视频', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请上传推荐老师封面图片', trigger: 'blur' }
        ],
         title: [
            { required: true, message: "请输入消息标题", trigger: "change" },
            { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "change" }
          ],
          content: [{ required: true, message: "请输入消息内容", trigger: "change" }],
      },
      disabled:　false
    }
  },
  created() {
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    
    this.disabled = UserType ? true : false
  },
  methods: {
    dateTimeFilter,
    defValFilter01,
    defValFilter02,
    defValFilter03,
    currencyFilter,
    openStatusFilter,
    findList(page = {}) {
      this.data.loading = true
      getUserListApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...page, ...data, loading: false }
      })
    },
    search(page = {}) {
      this.findList({ ...page, page: 1 })
    },
    sort({ order, prop }) {
      this.search(
        prop
          ? { [prop]: { descending: 0, ascending: 1 }[order] }
          : { earning: null }
      )
    },
    deletePic() {
      this.menu.imgUrl = ''
    },
    
    uploadVide(url) {
      this.menu.videoUrl = url
      this.progress=true
    },
    //清空表单
    Reset(){
      this.$refs.menu.resetFields();
      this.menu.videoUrl=''
      this.progress=true
    },
    //设置推荐
    setHanddle(val) {
      this.menu = {
        ...this.menu,
        ...val,
        show: true,
        tip: `推荐老师“${val.name}”`
      }
    },
    submit() {
      this.$refs.menu.validate(valid => {
        if (valid) {
          confirm(
            `你确认推荐老师 ${this.menu.name} 吗?`,
            'warning',
            '推荐确认'
          ).then(() =>
            recommendUserApi({
              id: this.menu.id,
              isRecommend: 0,
              videoUrl: this.menu.videoUrl,
              imgUrl: this.menu.imgUrl
            })
              .then(() => {
                success(`推荐老师 ${this.menu.name} 成功！`)
                this.findList()
                this.menu.show = false
                this.menu.videoUrl = ''
                this.menu.imgUrl = ''
                this.$refs.videUpload.clearUrl()
              })
              .catch(({ msg }) => {
                this.$refs.videUpload.clearUrl()
                error(msg || '推荐失败！请稍后重试...')
              })
          )
        } else {
          return false
        }
      })
    },
    // 取消推荐
    cancleHandle(row) {
      confirm(`你确认取消推荐老师 ${row.name} 吗?`, 'warning', '取消确认').then(
        () =>
          recommendUserApi({
            id: row.id,
            isRecommend: 1
          })
            .then(res => {
              this.findList()
            })
            .catch(({ msg }) => error(msg || '取消失败！请稍后重试...'))
      )
    },
    statusChange({ id, name, deleted }) {
      toggleUserApi(id)
        .then(() => success(`${deleted ? '禁用' : '启用'}用户"${name}"成功！`))
        .catch(({ msg }) =>
          error(msg || `${deleted ? '禁用' : '启用'}失败！请稍后重试...`)
        )
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

      // 禁用&启用， type为2启用， 3禁用
      shareCourseHandle({ id, name, collageType },type){
        toggleUserStatusApi(id,type)
        .then(() => {
          this.findList()
          success(`${collageType == 2 ? '禁用' : '启用'}用户"${name}"成功！`)
        })
        .catch(({ msg }) =>
          error(msg || `${collageType == 2 ? '禁用' : '启用'}失败！请稍后重试...`)
        )
      },

      reset(){
        this.$refs.editList.resetFields();
      }
  },
}
</script>
<style lang="less" scoped>
.el-form {
  .el-form-item__content {
    position: relative;
    > i.el-icon.el-icon-close {
      font-weight: 700;
      color: #f56c6c;
      position: absolute;
      left: 144px;
      top: -5px;
      cursor: pointer;
    }
  }
  
}
 .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 30%;
    }
  }
</style>
<style lang="less">
  .my-dialog{
    .el-form {
      .video{
        .el-progress{
          display: none;
        }
      }
    }
  }
</style>

