<template>
  <div class="certificationTheater content_data">
    <!--面包屑-->
    <Breadcrumb/>

    <!--列表状态栏-->
    <ul class="content_data_title">
      <li v-for="(item, index) in tearcherList" :class="{blue: changemenu == index}" @click="changeTitle(index)" :key="index">{{item.name}}</li>
      <li class="export"><ExportButton text="导出认证" :method="exportCheckList"/></li>
    </ul>

    <!--搜索-->
    <div class="time_search">
      <div class="search kind">
        <el-select v-model="value" placeholder="请选择" @change='changeSelect(value)' style="margin-right: 20px;width:150px">
          <el-option
            v-for="item in seacheList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input  placeholder="请输入关键字查询..." style="width: 260px;" v-model="data.keyWord" @keydown.enter.native="search"/>
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
        <el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
        <el-button  icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"  round  @click="reset">重置</el-button>
      </div>
    </div>

    <!--列表-->
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="userId" label="用户认证ID" min-width="120" :formatter="defValFilter01"></el-table-column>
        <el-table-column prop="userName" label="姓名" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="phone" label="手机号码" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="idcard" label="身份证正面" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.idcard" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="认证姓名" :formatter="defValFilter02" min-width="130"/>
        <el-table-column prop="idCardNumber" label="身份证号码" :formatter="defValFilter02" min-width="170"/>
        <el-table-column prop="idback" label="身份证反面" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.idback" defSrc="/static/img/idcard_back.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="handIdcard" label="手持证件照" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.handIdcard" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherCard" label="教师资格证" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.teacherCard" defSrc="/static/img/certificate.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherRewardcard" label="教师荣誉证书" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.teacherRewardcard" defSrc="/static/img/certificate.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="otherCard" label="其他资格证书" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.otherCard" defSrc="/static/img/certificate.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="申请时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="updatetime" label="审核时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="reason" label="拒绝理由" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.reason || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" v-if="data.status==1">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="audit(scope.row,2)" :disabled='disabled'>通过</el-button>
            <el-button type="del" size="small" @click="showDialog(scope.row)" :disabled='disabled'>拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>

    <!--分页-->
    <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10,100]" :method="findList" :total="data.total"/>

    <!--弹窗，拒绝理由-->
    <el-dialog title="拒绝理由" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" ref="dialog" labelWidth="0">
        <el-form-item>
          <el-input type="textarea" :rows="5" placeholder="请输入拒绝理由..." v-model="dialog.reason"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="audit(dialog,3,dialog.reason)">确定</el-button>
        <el-button @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getCheckListApi, auditCheckApi, exportCheckListApi} from '../../api/checkApi'
  import {dateTimeFilter, defValFilter01, defValFilter02} from '../../constant/filter'
  import {success, error} from '../../actions'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import HeadImg from '../../components/HeadImg.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'
  import ExportButton from '../../components/ExportButton.vue'

  export default {
    name: 'certificationWait',
    components: {MyPagination, HeadImg, Breadcrumb, TablePage, ImgView, ExportButton},
    data() {
      return {
        disabled:false,
        changemenu: 0,  // 选中当前的状态栏
        value:'',  //搜索下拉框选中的当前条件
        // 状态栏
        tearcherList: [{invoiceStatus: 1, name: '待审核'}, {invoiceStatus: 2, name: '已通过'}, {invoiceStatus: 3, name: '已拒绝'}],
        seacheList: [{value:1, label: '姓名'}, {value:2, label: '手机号'}, {value:3, label: '用户认证ID'}],
        // status: 1待审核，2审核通过，3审核失败
        // keyType 关键词类型：1、姓名，2、手机号码，3、用户ID
        data: {page: 1, pageSize: 10, list: [], total: 0, status: 1, keyType:null, keyWord: null, loading: false, start: null, end: null},
        dialog: {show: false, reason: null, id:null, status: null},
        //  选中的时间
        value1: [],
        // 设置大于当前时间不可选
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
      }
    },

    created() {
      // 设置当前指定列表的列表为待审核
      this.tearcherList.invoiceStatus = 0

      // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
      this.changemenu = this.$route.query.tab || 0
      console.log(this.changemenu)
      this.changeTitle(this.changemenu,this.$route.query.page)
    },

    methods: {
      dateTimeFilter,        // 初始化时间
      defValFilter01,        // 初始化为无
      defValFilter02,        // 初始化为无

      // 获取数据
      findList(page = {}) {
        this.data.loading = true
        getCheckListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },

      // 切换
      changeTitle(index,page) {
        this.data.keyWord = ''
        this.value = null
        let pageNum = page ? page : 1
        const idx = Number(index)
        this.changemenu = idx
        this.data.status = idx + 1
        this.$router.replace({ query: { ...this.$route.query,page:pageNum,tab:idx}})
        this.findList(page=1)
      },

      // 设置搜索时间
      selectTime(){
        this.data.start = Date.parse(this.value1[0])
        this.data.end = Date.parse(this.value1[1])
      },

      // 选中当前搜索条件
      changeSelect(value) {
        this.data.keyType = value
      },

      // 搜索按钮
      search(page) {
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList(page=1)
      },

      // 重置
      reset(){
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.value=null
        this.data.keyWord=null
        this.data.type = null
        this.data.start = null
        this.data.end = null
        this.value1 = []
        this.findList({page:1})
      },

      // 导出
      exportCheckList({start, end}) {
      return exportCheckListApi({...this.data,start, end })
      },

      // 弹出层
      showDialog({id, userName}) {
        this.dialog = {id, userName, show: true, reason: ''}
      },

      // 认证按钮
      audit({id, userName}, status, reason) {
        auditCheckApi(id, status, reason).then(() => {
          success(`教师【${userName}】的认证审核，操作成功！`)
          this.dialog.show = false
          this.findList()
        }).catch(() => error(`教师【${userName}】的认证审核，操作失败！`))
      },
    },
  }
</script>

<style lang="less">
  .certificationTheater{
     // 切换列表状态栏
    .content_data_title{
      height:70px;
      line-height: 70px;
      background-color: #fff;
      margin-bottom: 20px;
      padding-left: 30px;
      font-size: 20px;
      position: relative;
      li{
        float: left;
        margin: 0 17px;
        color:#495869;
        cursor :pointer;
      }
      li:first-child{
        margin-left: 0;
      }
      // 同行导出
      .export{
        position: absolute;
        right: 0;
        .ExportButton{
        margin: 0 20px!important;
        }
      }
      .blue{
        color: #51c5ff;
        border-bottom: 3px solid #51c5ff;
      }
    }
    // 搜索栏
    .time_search{
      height: 74px;
      line-height: 74px;
      background-color: #fff;
      padding-left: 30px;
      font-size: 18px;
      display: flex;
      margin-bottom: 20px;
      .block{
      margin-left: 40px;
      .el-range-separator{
      width:10%;
      }
      .el-button{
      margin-left: 10px!important;
      }
    }
  }
  .search {
    height: 74px;
    display: flex;
    align-items: center;
    background-color: #fff;
    }
  }
</style>


