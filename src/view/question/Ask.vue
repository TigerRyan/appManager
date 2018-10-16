<template>
  <div class="content_data askList" v-cloak>
    <!--面包屑-->
    <Breadcrumb/>

    <!--搜索-->
    <div class="time_search">
      <div class="search kind">
        <el-Input placeholder="请输入关键字" style="width: 200px;" v-model="data.keyWord" @keydown.enter.native="search"/>
        <el-select v-model="value" placeholder="请选择" @change='changeSelect(value)' style="margin:0 5px;width:200px">
          <el-option
            v-for="item in subjectList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-Input placeholder="请输入提问人搜索..." style="width: 200px;" v-model="data.questioner" @keydown.enter.native="search"/>
        <el-button icon="el-icon-search" style="margin-left:10px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" style="margin-left:10px;background:#ecf5ff"  round  @click="reset">重置</el-button>
      </div>
    </div>

    <!--列表-->
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="title" label="提问标题" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="grade" label="年级" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="subject" label="问题科目" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="rewardGral" label="悬赏积分" :formatter="defValFilter03" min-width="110"/>
        <el-table-column prop="questionTime" label="提问时间" :formatter="dateTimeFilter" min-width="110"/>
        <el-table-column prop="questionerName" label="提问人" :formatter="defValFilter01" min-width="110"/>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="del" size="small" @click="$router.push({name: 'answer',params:{id:scope.row.id}})">查看回答</el-button>
            <el-button type="del" size="small"  :disabled='disabled' @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>

    <!--分页-->
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import {getConfigurationListApi} from'../../api/appSystemApi'
  import {getAskApi, delAskApi} from '../../api/askApi'
  import {success, error, confirm} from '../../actions'
  import {defValFilter01, noticeTypeFilter, dateTimeFilter, defValFilter03} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'

  export default {
    name: 'askList',
    components: {MyPagination, Breadcrumb, TablePage},
    data() {
      return {
        fullLoading: false,
        disabled:false,
        value:'',
        subjectList:[],
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false,keyWord: null, subjectId: null,questioner: null},
      }
    },

    created() {
      let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
      getConfigurationListApi().then(data =>{
        this.subjectList = data.list
      })
    },

    methods: {
      defValFilter01,
      defValFilter03,
      noticeTypeFilter,
      dateTimeFilter,

      // 获取数据
      findList(page = {}) {
        this.data.loading = true
        getAskApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },

      // 删除
      del({id, title}) {
        confirm(`确认删除"${title}"?`, 'warning', '删除确认').then(() => delAskApi(id).then((data) => {
          success(`删除"${title}"成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || `删除"${title}"失败！`)))
      },

      // 搜索
      search(){
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList({page:1})
      },

      // 重置
      reset(){
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.data.keyWord=null
        this.data.subjectId=null
        this.data.questioner=null
        this.value=null
        this.findList({page:1})
      },

      // 选中当前搜索条件
      changeSelect(val){
        this.data.subjectId = val
      },
    },
  }
</script>

<style lang="less">
  .askList{
    [v-cloak]{
      display: none;
    }
    .time_search{
      height: 74px;
      line-height: 74px;
      background-color: #fff;
      padding-left: 30px;
      font-size: 18px;
      display: flex;
      .search{
        span{
          font-size: 16px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
