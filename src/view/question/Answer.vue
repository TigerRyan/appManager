<template>
  <div class="content_data answerList">
    <Breadcrumb/>
    <el-form style="margin-bottom: 20px" disabled>
      <el-form-item label="问题标题：">
        <span>{{questionTitle?questionTitle:'暂无'}}</span>
      </el-form-item>
      <el-form-item label="问题描述：">
        <!--<img v-if="questionContent" :src="questionContent" width="120px" height="120px" />-->
        <ImgView2 v-if="questionContent&&questionContent.includes('http')" :src="questionContent" defSrc="/static/img/idcard_back.png"/>
        <span v-if="questionContent&&(!questionContent.includes('http'))">{{questionContent}}</span>
        <span v-if="!questionContent">{{empty}}</span>
      </el-form-item>
      <el-form-item>
        <span v-if="sumAnswer" style="font-size: 16px">共{{sumAnswer?sumAnswer:0}}人进行回答</span>
        <span v-if="!sumAnswer" style="font-size: 16px">暂无人回答</span>
      </el-form-item>
    </el-form>
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="answerContent" label="内容回答" min-width="210">
          <template slot-scope="scope">
            <span v-if="scope.row.answerContent.includes('http')"><img :src="scope.row.answerContent" width="187.5" height="103.5"/></span>
            <span v-if="!scope.row.answerContent.includes('http')">{{scope.row.answerContent}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="answerContent" label="内容回答" :formatter="defValFilter01" min-width="110"/>-->
        <el-table-column prop="createTime" label="回答时间" :formatter="dateTimeFilter" min-width="110"/>
        <el-table-column prop="avatar" label="头像" min-width="100">
          <template slot-scope="scope">
            <HeadImg :src="scope.row.answerLogo"/>
          </template>
        </el-table-column>
        <el-table-column prop="answerUser" label="回答人" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="status" label="是否被采纳" :formatter="isAcceptFilter" min-width="100"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="del" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getAnswerApi, delAnswerApi, answerPage} from '../../api/askApi'
  import {success, error, confirm} from '../../actions'
  import {defValFilter01, dateTimeFilter, isAcceptFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import HeadImg from '../../components/HeadImg.vue'
  import ImgView from '../../components/ImgView.vue'
  import ImgView2 from '../../components/ImgView2.vue'

  export default {
    name: 'answerList',
    components: {MyPagination, Breadcrumb, TablePage, HeadImg, ImgView, ImgView2},
    data() {
      return {
        fullLoading: false,
        sumAnswer:null,
        questionContent:null,
        questionTitle: null,
        empty:'暂无',
        data: {page: 1, pageSize: 10, list: [], questionId: null, total: 0, loading: false},
      }
    },
    created() {
      const {id} = this.$route.params
      this.data.questionId = id
      answerPage(id).then(data =>{
        this.questionContent = data.questionContent
        this.questionTitle = data.questionTitle
        this.sumAnswer = data.sumAnswer
      })
    },
    methods: {
      defValFilter01,
      dateTimeFilter,
      isAcceptFilter,
      findList(page = {}) {
        this.data.loading = true
        getAnswerApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      del({answerId}) {
        confirm(`确认删除?`, 'warning', '删除确认').then(() => delAnswerApi(answerId).then(() => {
          success(`删除成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || `删除失败！`)))
      },
    },
  }
</script>
