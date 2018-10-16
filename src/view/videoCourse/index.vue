<template>
  <div class='content_data videoCourse'>
    <Breadcrumb/>
    <div>
      <ul class="videoCourse_title">
        <li v-for="(item, index) in listTab" :class="{blue:data.type == item.pid}" @click="redBill(item.pid)" :key="index">{{item.name}}</li>
      </ul>
    </div>
    <div>
      <ul class="videoCourse_title">
        <li v-for="(item, index) in listStatus" :class="{blue:data.status == item.pid}" @click="redBillStatus(item.pid)" :key="index">{{item.name}}</li>
      </ul>
    </div>
    <div class="searchList">
      <ul class="videoCourse_title">
        <el-select  style="margin-right: 32px" v-model="data.keyType" size="medium" placeholder="请选择" @change='changeSelect' >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select  style="margin-right: 32px" v-model="data.searchType" size="medium" placeholder="请选择" @change='changeSelect1' >
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="🔍名称/手机号/订单编号" v-model="data.keyWord" style="width: 378px;"></el-input>
        <el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
        <el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset">重置</el-button> 
         <li class='ExportButton'><ExportButton style='margin-top:0px;' :method="exportCashList"></ExportButton></li>       
      </ul>

    </div>
    <!-- 表格 -->
    	<TablePage>
      <el-table :data="data.list"  @selection-change="multipleSelect" v-loading="data.loading"  ref="multipleTable">
        <!-- <el-table-column type="selection" width="55"/> -->
        <el-table-column prop="id" label="ID"  min-width="55"/>
        <el-table-column prop="orderNo" label="订单编号"  min-width="200"/>
        <!-- <el-table-column prop="teacherName" label="教师名称"  min-width="120"/> -->
        <el-table-column :label="data.type==2?'教师头像':'机构头像'" min-width="200">
          <template slot-scope="scope">
            <p class="list-img lesson">
              <!-- <img :src="data.type==2?scope.row.teacherPic:scope.row.logo" onerror="this.src='/static/img/logo.png'" /> -->
              <ImgView :src="data.type==2?scope.row.teacherPic:scope.row.logo" defSrc="/static/img/admin.png" />
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="data.type==2?'教师名称':'机构名称'" min-width="210">
          <template slot-scope="scope">
            <div class="list lesson">
            <p>{{data.type==2?scope.row.teacherName:scope.row.mechanismName }}</p>
            <p>{{data.type==2?scope.row.teacherPhone:scope.row.mechanismAccount }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="videoTopicName" label="专题课程名称"  min-width="120"/>
        <el-table-column prop="videoCourseNum" label="总章节"  min-width="120"/>
        <el-table-column prop="salePrice" label="原价(元)"  min-width="120"/>
        <el-table-column prop="discountPrice" label="优惠价(元)"  min-width="130"/>
        <el-table-column prop="amount" label="实付金额(元)"  min-width="130"/>
        <!-- <el-table-column prop="studentName" label="购买学员"  min-width="130"/> -->
        <el-table-column label="学生头像" min-width="200">
          <template slot-scope="scope">
            <p class="list-img lesson">
              <!-- <img :src="scope.row.studentPic" onerror="this.src='/static/img/logo.png'" /> -->
              <ImgView :src="scope.row.studentPic" defSrc="/static/img/admin.png" />
              </p>
          </template>
        </el-table-column>
        <el-table-column label="学生名称" min-width="210">
          <template slot-scope="scope">
            <div class="list lesson">
            <p>{{scope.row.studentName }}</p>
            <p>{{scope.row.studentPhone }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" :formatter="videoCourseFilter" label="状态"  min-width="130"/>
        <el-table-column prop="createTime" :formatter="detailTimeFilter" label="下单时间"  min-width="220"/>
        <!-- 已付款特殊 -->
        <el-table-column v-if="data.status==1" prop="payTime" :formatter="detailTimeFilter" label="付款时间"  min-width="220"/>
        <el-table-column v-if="data.status==1" prop="thirdOrderNo" :formatter="defValFilter01" label="交易单号"  min-width="220"/>
        <!-- 已付款特殊 -->
        <!-- 已取消特殊 -->
        <el-table-column v-if="data.status==2" prop="expiredTime" :formatter="detailTimeFilter" label="取消时间"  min-width="220"/>
        <!-- 已取消特殊 -->
        <el-table-column label="操作"  min-width="200">
            <template slot-scope="scope">
              <el-button type="edit" @click="$router.push({name: 'videoOrderDetail', query: {id:scope.row.id,type:data.type}})">查看详情</el-button>
              
            </template>
        </el-table-column>
      </el-table>
	</TablePage>
  <!-- 分页 -->
	<MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>  
  </div>
</template>

<script>
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import ExportButton from '../../components/ExportButton.vue'
  import TablePage from '../../components/TablePage.vue'
  import MyPagination from '../../components/MyPagination.vue'
  import {getvideoCourseOrderApi,exportvideoCourseApi} from '../../api/videoCourseOrderApi'
  import {detailTimeFilter,defValFilter01,videoCourseFilter} from '../../constant/filter.js'
  // import Avatar from '../../components/Avatar.vue'
  import ImgView from '../../components/ImgView.vue'
  export default {
    name: 'videoCourse',
    components: {
      Breadcrumb,
      ExportButton,
      TablePage,
      MyPagination,
      ImgView
    },
    data () {
      return {
      // 表格
      data:{
          page: 1,
          pageSize:10,
          start:null,
          end:null,
          keyType :1,//select值 关键词类型，1、学生；2、教师 ,
          searchType :1, //二级搜索类型 1:姓名 2:手机号码 3订单编号
          keyWord :null,//搜索框订单号
          loading: false,
          total: 0,
          type:1, //订单类型 1：机构订单 2：教师订单 ,
          status:0, //，待付款(0), 已付款(1), 已取消(2) ,
          list:[],
      },
      options: [
        {
          value: 1,
          label: "学生"
        },
        {
          value: 3,
          label: "机构"
        }
      ],
      options1: [
        {
          value: 1,
          label: "名称"
        },
        {
          value: 2,
          label: "手机号码"
        },
        {
          value: 3,
          label: "订单编号"
        }
      ],      
      multipleSelection:[],//选择多条
      multipleSelectId:[],//选择多条的ID
      listTab: [{pid: 1, name: '机构'}, {pid:2, name: '教师'}],
      listStatus: [{pid: 0, name: '待付款'}, {pid:1, name: '已付款'},{pid:2, name: '已取消'}],
      }
    },
    created () {
    },
    methods: {
      detailTimeFilter,
      defValFilter01,
      videoCourseFilter,
      redBill(id) {
        this.data.keyType = 1
        if(id==2){
          this.options =  [{
          value: 1,
          label: "学生"
        },
        {
          value: 2,
          label: "教师"
        }]
        }
        if(id==1){
          this.options =  [{
          value: 1,
          label: "学生"
        },
        {
          value: 3,
          label: "机构"
        }]
        }
        this.data.type = id
        this.data.status = 0
       this.data.keyWord = null
        //处理tab切换时路由中的参数
        this.$router.replace({ query: { ...this.$route.query,page:1} })
				this.findList({page:1})
      },
      redBillStatus(id) {
        this.data.status = id
        this.data.keyWord = null
        //处理tab切换时路由中的参数
        this.$router.replace({ query: { ...this.$route.query,page:1} })
				this.findList({page:1})
      },
      //    导出功能
      exportCashList({start, end}) {
        return exportvideoCourseApi({...this.data,start, end})
      },
          //选择多个
      multipleSelect(val) {
        this.multipleSelection = val;
        this.multipleSelectId = []
        this.multipleSelection.forEach((item) => {
          this.multipleSelectId.push(item.id)
        });
      },
      changeSelect(value){
      this.data.keyType = value;
      },
      changeSelect1(value){
      this.data.searchType = value;
      },
      search(){
      this.findList({page: 1})
      },
      // 重置
      reset(){
      this.data.keyWord = null
      this.findList({page: 1})
      },
    findList(page = {}){
      this.data.loading = true
      getvideoCourseOrderApi({...this.data,...page}).then(res=>{
        this.data = { ...this.data,...page,...res,loading: false,page: res.pageNum, }
      },
      err => {
          this.data.loading = false
        }
      )
    },
    },
  }
</script>
<!--  -->
<style lang='less' scoped>
.videoCourse{
  .videoCourse_title {
    height: 70px;
    line-height: 70px;
    background-color: #fff;
    margin-bottom: 20px;
    padding-left: 30px;
    font-size: 20px;
    list-style: none;
    // color: #51c5ff;
    li {
      float: left;
      margin: 0 17px;
      color: #495869;
      cursor: pointer;
      &.ExportButton {
        float: right;
      }
    }
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
  }
  .lesson {
      display: inline-block;
      margin: 0;
      // img {
      //     width: 100%;
      //     height: 100%;
      //     border-radius: 0;
      //     display: block;
      // }
  }
}
</style>