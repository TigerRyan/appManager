<template>
  <div class="content_data certificationSupplier">
    <!--面包屑-->
    <Breadcrumb/>

    <!--列表状态栏-->
    <ul class="content_data_title">
      <li v-for="(item, index) in supplierList" :class="{blue: changemenu == index}" @click="changeTitle(index)" :key="index">{{item.name}}</li>
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
        <el-input  placeholder="请输入关键字查询..." style="width: 260px;" v-model="data.query" @keydown.enter.native="search"/>
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
      <el-table :data="data.list" :key="changemenu" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="ID" min-width="80" :formatter="defValFilter01" ></el-table-column>
        <el-table-column prop="type" label="账户类型" :formatter="accountTypeFilter" min-width="100"/>
        <el-table-column prop="phone" label="注册账号" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="companyName" label="公司全称" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="realName" label="姓名/名称" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="logo" label="头像" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.logo" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="logo" label="身份证正面" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.idCardFace" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="logo" label="身份证反面" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.idCardBoth" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="logo" label="营业执照" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.businessLicense" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="signPhone" label="联系人电话" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="permanentAddress" label="户籍地址" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="companyRegisterAddress" label="注册地址" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="companyWorkAddress" label="办公地址" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="companyCreditCode" label="统一信用代码" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="applyTime" label="申请时间" v-if="data.status!==2" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="passTime" label="审核时间" v-if="data.status==2" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="reason" label="拒绝理由" v-if="data.status==3" :formatter="defValFilter01" min-width="150"/>
        <el-table-column label="操作" width="320" fixed="right" v-if="data.status==1">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="check(scope.row,0)" :disabled="disabled">通过</el-button>
            <el-button type="del" size="small" @click="refuse(scope.row,1)" :disabled="disabled">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10,100]" :method="findList" :total="data.total"/>
    </TablePage>

    <!--弹窗，拒绝理由-->
    <el-dialog title="拒绝理由" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" ref="dialog" labelWidth="0">
        <el-form-item  prop="reason">
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
  import {providerListApi, exportProviderListApi, providerCheckApi} from '../../api/checkApi'
  import {accountTypeFilter, dateTimeFilter, defValFilter01, defValFilter02} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import HeadImg from '../../components/HeadImg.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'
  import ExportButton from '../../components/ExportButton.vue'
  import {success, error} from '../../actions'

  export default {
    name: 'certificationSupplier',
    components: {MyPagination, HeadImg, Breadcrumb, TablePage, ImgView, ExportButton},
    data() {
      return {
        changemenu: 0,  // 选中当前的状态栏
        value:'',
        dialog: {show: false, reason: null, id:null, status: null},
        dialogDetail: {show: false},
        seacheList: [{value:0, label: '名称'}, {value:1, label: '手机号'}, {value:2, label: 'ID'}],
        supplierList: [{invoiceStatus: 0, name: '待审核'}, {invoiceStatus: 1, name: '已通过'}, {invoiceStatus: 2, name: '已拒绝'}],
        providerPassList: {},
        providerNoPassList: {},
        providerWaitPassList: {},
        //  status: 1待审核，2审核通过，3审核失败
        data: {page: 1, pageSize: 10, list: [], total: 0, loading: false, status: 1, type: null, query: null, start: null, end: null,},
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
      this.supplierList.invoiceStatus = 0;

      // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false

      this.changemenu = this.$route.query.tab || 0
      this.changeTitle(this.changemenu,this.$route.query.page)
    },

    methods: {
      accountTypeFilter,   // 账户类型
      dateTimeFilter,      // 初始化时间
      defValFilter01,      // 初始化为无
      defValFilter02,

      // 获取列表数据
      findList(page = {}) {
        this.data.loading = true
        providerListApi({...this.data,...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },

      // 导出
      exportCheckList({start, end}) {
        return exportProviderListApi({...this.data,start, end })
      },

      // 切换
      changeTitle(index,page) {
        this.data.query = ''
        this.value = null
        var pageNum = page? page:1
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
      changeSelect(value){
        this.data.type = value
      },

      // 搜索按钮
      search(page={}) {
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList({page:1})
      },

      // 重置
      reset(){
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.data.query= null
        this.data.type = null
        this.value = null
        this.data.start =null
        this.data.end = null
        this.value1 = []
        this.findList({page:1})
      },

      //  拒绝按钮
      refuse(row,status) {
        this.dialog.reason = null
        this.dialog.show = true
        this.dialog.id=row.id
        this.dialog.status=status
      },

      // 表格通过按钮
      check(row,status){
        providerCheckApi({id: row.id,type: status, reason: this.dialog.reason }).then(() => {
          success(`该服务商的认证审核操作成功！`)
          this.dialog.show = false
          this.findList()
        }).catch(() => error(`该服务商的认证审核操作失败！`))
      },

      //  批量操作
      batchAudit(status) {
        const loading = this.$loading({
          lock: true,
          text: '批量处理中...请稍等！',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        batchAuditApi(this.multipleSelection.map(({id}) => id), status).then((data) => {
          this.multipleSelection.forEach(({id, userName}) => {
            setTimeout(() => {
              this.$notify({
                title: data[id] ? '失败' : '成功',
                message: data[id] ? `提现人【${userName}】的提现申请审核操作失败：${data[id]}` : `提现人【${userName}】的提现申请审核操作成功！`,
                type: data[id] ? 'error' : 'success',
              })
            }, 10)
          })
          loading.close()
        }).catch(({msg}) => {
          error(msg)
          loading.close()
        })
      },

      // 全选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
    },
  }
</script>

<style lang="less">
  .certificationSupplier{
    // 切换列表状态栏
    .content_data_title{
      height:70px;
      line-height: 70px;
      background-color: #fff;
      margin-bottom: 20px;
      padding-left: 30px;
      font-size: 20px;
      position: relative;
      // color: #51c5ff;
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
    .watch{
      border-radius: 20px;
      padding: 8px 10px;
    }
  }

</style>
