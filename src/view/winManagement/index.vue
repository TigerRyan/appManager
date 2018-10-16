<template>
  <div class='content_data winManagement'>
    <!-- 主体开始  -->
    <div id="main">
      <el-tabs v-model="activeName2" @tab-click="handleClick">
        <el-tab-pane label="中奖记录" name="first">
          <!-- 搜索 -->
          <div class="searchList">
            <el-select  style="margin-right: 32px" v-model="data.keyType" size="medium" placeholder="请选择" @change='changeSelect1' >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="🔍用户名/手机号" v-model="data.keyWord" style="width: 378px;"></el-input>
            <el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search1">搜索</el-button>
					  <el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset1">重置</el-button>
          </div>
          <!-- 列表 -->
          <TablePage>
              <el-table :data="data.list" ref="multipleTable" stripe  v-loading="data.loading" element-loading-text="拼命加载中...">
                 <el-table-column prop="userName" label="用户名" min-width="130"/>
                <el-table-column prop="pic" label="头像" min-width="130">
                   <template slot-scope="scope">
                     <img :src="scope.row.pic" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
                  </template>
                </el-table-column>
                <el-table-column prop="nikeName" :formatter="defValFilter05" label="昵称" min-width="130"/>
                <el-table-column prop="phone" label="手机号" min-width="150"/>
                <el-table-column prop="luckyGoodsName" label="中奖商品名称" min-width="150"/>
                <el-table-column prop="createTime" :formatter="dateTimeFilter" label="中奖时间" min-width="110"/>
                <el-table-column prop="rate" label="中奖概率" :formatter="rateFilter" min-width="110"/>
              </el-table>
          </TablePage>
    <!-- 分页 -->
			<MyPagination :page="data.page" :size="data.pageSize" :method="findList1" :total="data.total"/>
        </el-tab-pane>
        <el-tab-pane label="领取记录" name="second">
          <!-- 搜索 -->
          <div class="searchList">
            <el-select  style="margin-right: 32px" v-model="data2.keyType" size="medium" placeholder="请选择" @change='changeSelect2' >
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="🔍姓名/手机号" v-model="data2.keyWord" style="width: 378px;"></el-input>
            <el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search2">搜索</el-button>
					  <el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset2">重置</el-button>
            <ExportButton text="导出" :method="exportCheckList"/>
          </div>
          <!-- 列表 -->
          <TablePage>
              <el-table :data="data2.list" ref="multipleTable2" stripe  v-loading="data2.loading" element-loading-text="拼命加载中...">
                 <el-table-column prop="userName" label="姓名" min-width="130"/>
                <el-table-column prop="pic" label="头像" min-width="130">
                   <template slot-scope="scope">
                     <img :src="scope.row.pic" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
                  </template>
                </el-table-column>
                <el-table-column prop="nikeName" :formatter="defValFilter05" label="昵称" min-width="130"/>
                <el-table-column prop="phone" label="手机号" min-width="150"/>
                <el-table-column prop="luckyGoodsName" label="中奖商品名称" min-width="150"/>
                <el-table-column prop="createTime" :formatter="dateTimeFilter" label="中奖时间" min-width="150"/>
                <el-table-column prop="rate" label="中奖概率" :formatter="rateFilter" min-width="110"/>
                <el-table-column  label="操作" min-width="100" max-width='200'>
                  <template slot-scope="scope">
                      <el-button @click="grant(scope.row)" class="dismiss":disabled="scope.row.acquireStatus==2" round>{{scope.row.acquireStatus==1?"发放":"已发放"}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </TablePage>
    <!-- 分页 -->
			  <MyPagination :page="data2.page" :size="data2.pageSize" :method="findList2" :total="data2.total"/>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import TablePage from '../../components/TablePage.vue'
import ExportButton from '../../components/ExportButton.vue'
import {getwinManagementApi,putwinManagementApi,exportRecord} from '../../api/winManagementApi'
import {dateTimeFilter,rateFilter,defValFilter05} from '../../constant/filter.js'
export default {
  name: 'winManagement',
  components: {
    Breadcrumb,
    MyPagination,
    TablePage,
    ExportButton,
  },
  data () {
    return {
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        keyWord: null,
        keyType:0,
        type:0,
        start: null,
        end: null,
        list: []
      },
      data2: {
        loading: false,
        page: 1,
        pageSize: 10,
        keyType:0,
        type:1,
        keyWord: null,
        start: null,
        end: null,
        list: [
        ]
      },
      options: [
        {
          value: 0,
          label: "用户名"
        },
        {
          value: 1,
          label: "手机号"
        }
      ],
      options2: [
        {
          value: 0,
          label: "姓名"
        },
        {
          value: 1,
          label: "手机号"
        }
      ],
      activeName2: 'first',
      issued:false,
    }
  },
  created () {
  },
  methods: {
    dateTimeFilter,
    rateFilter,
    defValFilter05,
    handleClick(tab, event) {
      if(this.activeName2 == 'first'){
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        this.findList1({page:1})
      }
      if(this.activeName2 == 'second'){
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        this.findList2({page:1})
      }
    },
    // 中奖记录搜索
    search1(){
      this.findList1({page:1})
    },
    // 中奖记录重置
    reset1(){
      this.data.keyWord = null
      this.findList1({page:1})
    },
    //中奖记录分页
    findList1(page = {}){
      this.data.loading = true
      getwinManagementApi({...this.data,...page}).then(res=>{
        this.data = { ...this.data, ...res, loading: false,page: res.pageNum }
      },
      err => {
          this.data.loading = false
        }
      )
    },
    changeSelect1(value){
      this.data.keyType = value;
    },
    // 领取记录搜索
    search2(){
      this.findList2({page:1})
    },
    // 领取记录重置
    reset2(){
     this.data2.keyWord = null
    this.findList2({page:1})
    },
    //领取记录分页
    findList2(page = {}){
      this.data2.pageSize = 10
      getwinManagementApi({...this.data2,...page}).then(res=>{
        this.data2 = { ...this.data2, ...res, loading: false,page: res.pageNum }
      },
      err => {
          this.data2.loading = false
        }
      )
    },
    changeSelect2(value){
      this.data2.keyType = value;
    },
    grant(res){
      if(res.acquireStatus==1){
          putwinManagementApi(res.id).then(()=>{
             this.$message({
              type: 'success',
              message: '发放成功!'
            });
            this.findList2({...this.data2})
          })
      }
    },
    exportCheckList({start,end}){
      console.log(...this.data2)
      return exportRecord({...this.data2,start,end})
    }
  },

}
</script>
<style lang='less' scoped>
.winManagement{
  #main{
    #pane-first{
      width:100%;
      height:100%;
      // background-color: #fff;
      margin-top:20px;
    }
    .ticketMoney{
      margin:0 0px 50px 100px;
      padding-top: 30px;
      >span{
        font-size: 18px;
      }
    }
  }
  .searchList{
    height: 65px;
    padding-left:30px;
    background-color: #fff;
    line-height: 65px;
    margin: 20px 0;

  }
}
</style>
<style lang="less">
.winManagement{
  .el-tabs__header{
    background-color: #fff;
  }
  .el-tabs__nav-scroll{
    margin-left: 50px;
    .el-tabs__item{
      height: 70px;
      line-height: 70px;
      font-size: 20px;
      &:hover{
        color:#303133;
      }
    }
    .el-tabs__item.is-active{
      color:#51c5ff;
    }
    .el-tabs__active-bar{
      background-color: #51c5ff;
      height: 3px;
    }
  }
  .ExportButton{
    margin: 0 !important;
    right:200px !important;
    .el-button--edit {
      padding: 8px 25px !important;
    }
  }
}
</style>
