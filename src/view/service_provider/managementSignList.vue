<template>
  <div class="content_data managerSignList">
    <Breadcrumb/>
    <ul class="cate_list">
      <li v-for="(item, index) in TitleList" :class="{blue: changeTitle == index}" @click="redTitle(index)" :key="index">{{item.name}}</li>
    </ul>
    <div class="time_search">
      <div class="search kind">
        <el-select v-model="data.paramType" placeholder="请选择" @change='changeSelect' style="margin:0 5px;width:180px">
          <el-option
            v-for="item in searchList"
            :key="item.id"
            :label="item.itemName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-Input placeholder="请输入关键字搜索..." style="width: 200px; margin-right: 10px" v-model="data.keyWords"/>
      </div>
      <div class="block">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="selectTime"
          :picker-options="pickerOptions0"
        >
        </el-date-picker>
        <el-button icon="el-icon-search" style="margin-left:10px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" style="margin-left:10px;background:#ecf5ff"  round  @click="reset">重置</el-button>
      </div>

    </div>
    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <!--<el-table-column type="selection" width="55"/>-->
        <el-table-column prop="id" label="ID" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="type" label="账户类型" :formatter="signPersonFilter" min-width="110"/>
        <el-table-column prop="phone" label="注册账号" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="name" label="姓名/名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="logo" label="头像" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.logo" defSrc="/static/img/admin.png"/>
          </template>
        </el-table-column>
        <!--<el-table-column prop="signContract" label="合同地址" :formatter="defValFilter01" min-width="110"/>-->
        <el-table-column v-if="data.signStatus==3" prop="signTime" label="签约时间" :formatter="dateTimeFilter" min-width="110"/>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="del" size="small" @click="check(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <el-dialog :title="title" :visible.sync="show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" labelWidth="150px">
        <el-form-item label="签约人姓名" prop="signRealName">
          <el-input v-model="dialog.signRealName" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="签约人身份证号" prop="signIdcard">
          <el-input v-model="dialog.signIdcard " placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="户籍地址" prop="signAddress">
          <el-input v-model="dialog.signAddress" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="signPhone">
          <el-input v-model="dialog.signPhone" placeholder="" disabled/>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="show1" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" labelWidth="150px">
        <el-form-item label="公司全称" prop="signCompany">
          <el-input v-model="dialog.signCompany" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="统一信用代码" prop="signCode">
          <el-input v-model="dialog.signCode" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="法人姓名" prop="signRealName">
          <el-input v-model="dialog.signRealName" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="法人身份证号" prop="signIdcard">
          <el-input v-model="dialog.signIdcard" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="signPhone">
          <el-input v-model="dialog.signPhone" placeholder="" disabled/>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="show2" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" labelWidth="150px">
        <el-form-item label="签约人姓名" prop="signRealName">
          <el-input v-model="dialog.signRealName" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="签约人身份证号" prop="signIdcard">
          <el-input v-model="dialog.signIdcard " placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="户籍地址" prop="signAddress">
          <el-input v-model="dialog.signAddress" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="signPhone">
          <el-input v-model="dialog.signPhone" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="合同起始日期" prop="signPhone">
          <el-input v-model="dialog.startTime" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="合同截止日期" prop="signPhone">
          <el-input v-model="dialog.endTime" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button :disabled='disabled'>查看合同</el-button>
          <el-button style="margin-left: 20px" @click="exportSign(dialog.signContract)" :disabled='disabled'>导出合同</el-button>
        </el-form-item>
        <iframe id="review" :src="dialog.signContract" width="550" height="750"></iframe>
      </el-form>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="show3" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" labelWidth="150px">
        <el-form-item label="公司全称" prop="signCompany">
          <el-input v-model="dialog.signCompany" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="统一信用代码" prop="signCode">
          <el-input v-model="dialog.signCode" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="法人姓名" prop="signRealName">
          <el-input v-model="dialog.signRealName" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="法人身份证号" prop="signIdcard">
          <el-input v-model="dialog.signIdcard" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="signPhone">
          <el-input v-model="dialog.signPhone" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="合同起始日期" prop="signPhone">
          <el-input v-model="dialog.startTime" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="合同截止日期" prop="signPhone">
          <el-input v-model="dialog.endTime" placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button :disabled='disabled1'>查看合同</el-button>
          <el-button style="margin-left: 20px"  @click="exportSign(dialog.signContract)" :disabled='disabled'>导出合同</el-button>
        </el-form-item>
        <iframe id="review1" :src="dialog.signContract" width="550" height="750"></iframe>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="showDown" :modalAppendToBody="false" width="450px" class="showDown">
      <span>{{content}}</span>
      <div class="download">
        <a :href="signContract" @click="showDown = false" v-if="!!signContract" class="downloadBtn">下载</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getSignListApi, checkSignListApi} from '../../api/manageSignApi'
  import {defValFilter01, signPersonFilter, dateTimeFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'

  export default {
    name: 'managerSignList',
    components: {MyPagination, Breadcrumb, TablePage, ImgView},
    data() {
      return {
        disabled:false,
        disabled1: true,
        fullLoading: false,
        // value:0,
        show: false,
        show1: false,
        show2: false,
        show3: false,
        showDown: false,
        signContract: null,
        content: '正在生成文件导出中...请耐心等待...',
        changeTitle: 0,
        dialog: {},
        value1:[],
        title:null,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        TitleList: [{id: 1, name: '签约中'}, {id: 3, name: '已签约'}],
        searchList: [{id:0, itemName:'名称'},{id:1, itemName:'手机号'},{id:2, itemName:'ID'},],
        data: {page: 1, pageSize: 10, list: [],start: null, end: null, total: 0, loading: false, signStatus: 1, keyWords : null, paramType: 0},
      }
    },
    created() {
        // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
    },
    methods: {
      defValFilter01,
      signPersonFilter,
      dateTimeFilter,
      findList(page = {}) {
        this.data.loading = true
        getSignListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      //  切换列表
      redTitle(index) {
        this.data.start=null
        this.data.end=null
        this.value1=null
        this.changeTitle =index
        if(index ===0){
          this.data.signStatus = 1
        }else{
          this.data.signStatus = 3
        }
        this.data.keyWords= null
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        this.findList()
      },
      //  全选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      search(page={}){
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        this.findList(page={})
      },
      reset(){
        this.value = 0
        this.value1=null
        this.data.keyWords=null
        this.data.paramType= 0
        this.data.start=null
        this.data.end=null
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        this.findList()
      },
      // 获取时间
      selectTime(){
        this.data.start = Date.parse(this.value1[0])
        this.data.end = Date.parse(this.value1[1])
      },
      changeSelect(val){
        this.data.paramType = val
      },
      // 导出合同
      exportSign(signContract){
        this.showDown = true
        this.content = '文件生成完成！请点击下载...'
        this.signContract = signContract
      },
      // 查看
      check({id,type}) {
        if(this.data.signStatus===1){
          if(type===1){
            this.title = '个人基本信息'
            this.show = true
          }else{
            this.title = '企业基本信息'
            this.show1 = true
          }
        }else{
          if(type===1){
            this.title = '个人基本信息'
            this.show2 = true
          }else{
            this.title = '企业基本信息'
            this.show3 = true
          }
        }

        checkSignListApi(id).then(data => {
          this.dialog = data
          this.dialog.startTime = dateTimeFilter(0,0,this.dialog.startTime)
          this.dialog.endTime = dateTimeFilter(0,0,this.dialog.endTime)

        })
      }
    },


  }
</script>
<style lang="less">
  .managerSignList{
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
        cursor:pointer
      }
      .blue{
        color: #51c5ff;
        border-bottom: 3px solid #51c5ff;
      }
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
    .showDown{
      .el-dialog__body{
        text-align: center;
      }
    }
    .downloadBtn {
      width: 80px;
      height: 40px;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
      background: #51c5ff;
      display: inline-block;
      color: #fff;
    }
    .el-pagination{
    background-color: #fff;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    }
  }


</style>
