<template>
  <div class="content_data certificationMechanism">
    <!--面包屑-->
    <Breadcrumb/>

    <!--列表状态栏-->
    <ul class="content_data_title">
      <li v-for="(item, index) in mechanismList" :class="{blue: changemenu == index}" @click="changeTitle(index)" :key="index">{{item.name}}</li>
      <li class="export"><ExportButton text="导出认证" :method="exportCheckList"/></li>
    </ul>

    <!--搜索-->
    <div class="time_search">
      <div class="search kind">
        <el-select v-model="value" placeholder="请选择" @change='changeSelect(value)' style="margin-right:20px;width:150px">
          <el-option
            v-for="item in seacheList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input  placeholder="请输入类型查询..." style="width: 260px;" v-model="data.query" @keydown.enter.native="search"/>
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

    <!--搜索-->
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="mechanismName" label="机构名称" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="businessLicenceName" label="营业执照全称" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="businessLicenceNo" label="营业执照号" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="leaderName" label="负责人" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="certCard" label="负责人身份证" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.certCard" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="businessLicence " label="营业执照附件" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.businessLicence" defSrc="/static/img/idcard_back.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="businessContract" label="签约合同附件" min-width="150">
          <template slot-scope="scope">
            <ImgView2 :key="scope.row.businessContract" :src="scope.row.businessContract" defSrc="/static/img/idcard_back.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="机构创建时间" v-if="data.status==1" key=1 :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="createTime" label="申请时间" v-if="data.status==2" key=2 :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="passTime" label="通过时间" v-if="data.status==2" key=3 :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="passTime" label="拒绝处理时间" v-if="data.status==3" key=4 :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="reason" label="审核失败原因" v-if="data.status==3" key=5 :formatter="defValFilter01" min-width="150"/>
        <el-table-column label="操作" width="180" fixed="right" v-if="data.status==1">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="check(scope.row,0)" :disabled='disabled'>通过</el-button>
            <el-button type="del" size="small" @click="refuse(scope.row,1)" :disabled='disabled'>拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10]" :method="findList" :total="data.total"/>
    <el-dialog title="拒绝理由" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" ref="dialog" labelWidth="0">
        <el-form-item prop="reason">
          <el-input type="textarea" :rows="5" placeholder="请输入拒绝理由..." v-model="dialog.reason"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="check(dialog,1,dialog.reason)">确定</el-button>
        <el-button @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mechanismListApi, exportMechanismListApi, mechanismCheckApi} from '../../api/checkApi'
  import {accountTypeFilter, dateTimeFilter, defValFilter01, defValFilter02} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import HeadImg from '../../components/HeadImg.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'
  import ImgView2 from '../../components/ImgView2.vue'

  import ExportButton from '../../components/ExportButton.vue'
  import {success, error} from '../../actions'

  export default {
    name: 'certificationOrganization',
    components: {MyPagination, HeadImg, Breadcrumb, TablePage, ImgView, ImgView2, ExportButton},
    data() {
      return {
        disabled:false,
        changemenu: 0,
        value: '',
        dialog: {show: false, reason: null, id:null, status: null},
        dialogDetail: {show: false},
        mechanismList: [{invoiceStatus: 0, name: '待审核'}, {invoiceStatus: 1, name: '已通过'}, {invoiceStatus: 2, name: '已拒绝'}],
        seacheList: [{value:0, label: '机构名称'}, {value:1, label: '营业执照全称'}, {value:2, label: '营业执照号'}],
        // status  状态类型 1待审核，2审核通过，3审核失败
        // keyType 关键词类型：1、姓名，2、手机号码，3、用户ID
      data: {page: 1, pageSize: 10, list: [], total: 0, loading: false, status:1, type: null, query :null, start: null, end: null,},
        value1: [],
        // 大于当前时间不可选
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
      }
    },
    created() {
      this.mechanismList.invoiceStatus = 0

      // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false

      this.changemenu = this.$route.query.tab || 0
      this.changeTitle(this.changemenu,this.$route.query.page)
    },

    methods: {
      accountTypeFilter,
      dateTimeFilter,
      defValFilter01,
      defValFilter02,

      // 导出
      exportCheckList({start, end}) {
        return exportMechanismListApi({...this.data,start, end })
      },

      // 切换
      changeTitle(index,page) {
        this.data.query = ''
        this.value = null
        let pageNum = page ? page : 1
        const idx = Number(index)
        this.changemenu = idx
        this.data.status = idx + 1
        this.$router.replace({ query: { ...this.$route.query,page:pageNum,tab:idx}})
        this.findList(page=1)
      },

      // 设置搜索时间
      selectTime() {
        this.data.start = Date.parse(this.value1[0])
        this.data.end = Date.parse(this.value1[1])
      },

      // 选中当前搜索条件
      changeSelect(value) {
        this.data.type = value
      },

      // 搜索
      search(page={}) {
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList({page:1})
      },

      // 重置
      reset(page = {}) {
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.data.query = null
        this.data.type = null
        this.value = null
        this.data.start = null
        this.data.end = null
        this.value1 = []
        this.findList(page = 1)
      },

      // 表格中拒绝按钮
      refuse(row, status) {
        this.dialog.show = true
        this.dialog.id = row.id
        this.dialog.status = status
        this.dialog.reason = ''
      },

      // 表格中通过按钮
      check(row, status) {
        mechanismCheckApi({id: row.id, type: status, reason: this.dialog.reason}).then(() => {
          success(`该机构认证审核操作成功！`)
          this.dialog.show = false
          this.findList()
        }).catch(() => error(`该机构的认证审核操作失败！`))
      },

      // 批量导出
//      exportCashList({start, end}) {
//        return exportCashListApi({start, end, ...this.data})
//      },

      // 全选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      // 获取列表数据
      findList(page={}) {
        this.data.loading = true
        mechanismListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
    }
  }
</script>
<style lang="less">
  .certificationMechanism{
    .cell{
      display: flex;
      .img-view-box{
        margin-right: 5px;
      }
    }
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
    .cell{
      justify-content: center;
      .img-view-box{
        margin-right: 0;
      }
    }
  }

</style>
