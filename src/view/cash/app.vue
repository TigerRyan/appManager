<template>
	<div class="content_data cashApp">
        <Breadcrumb/>
    <div>
      <ul class="content_data_title">
        <li v-for="(item, index) in listTab" :class="{blue:data.status == item.pid}" @click="redBill(item.pid)" :key="index">{{item.name}}</li>
		     <li class='ExportButton'><ExportButton style='margin-top:0px;' :method="exportCashList"></ExportButton></li>
      </ul>
    </div>
    <div class="time_search">
      <template>
        <el-select v-model="value" placeholder="请选择" @change='changeSelect'>
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
			<div class="search kind">
				<el-input  :placeholder="placeholder" style="width: 220px;" v-model="data.keyWord"></el-input>
			</div>
			<div class="block">
				<el-date-picker
					v-model="tiemValue"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					@change="selectTime"
					:picker-options="pickerOptions0"
					>
				</el-date-picker>
				<el-button  icon="el-icon-search" style="margin-left:10px;background:#51c5ff;color:#fff;"  round @click="search">搜索</el-button>
				<el-button  icon="el-icon-refresh" style="margin-left:10px;background:#ecf5ff"  round  @click="reset">重置</el-button>
        <template v-if='data.status==1'>
          <el-button  icon="el-icon-check" style="margin-left:10px;background:#51c5ff;color:#fff;"  round @click="batchAgree" :disabled="disabled">批量通过</el-button>
				  <el-button  icon="el-icon-close" style="margin-left:10px;background:#ecf5ff"  round  @click="batchReject" :disabled="disabled">批量拒绝</el-button>
        </template>
			</div>
    </div>
    <!-- 表格 -->
    <!-- 审核中 -->
	<TablePage v-if='data.status==1' key='1'>
      <el-table :data="data.list"  @selection-change="multipleSelect" v-loading="data.loading" @sort-change="sortChange" ref="multipleTable" >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="fullName" label="用户手机号"  min-width="150"/>
        <el-table-column prop="id" label="记录ID"  min-width="100"/>
        <el-table-column prop="userName" label="提现姓名"  min-width="120"/>
        <el-table-column prop="phone" label="提现手机号"  min-width="150"/>
        <el-table-column prop="money" label="提现金额(元)" min-width="160" sortable="custom"/>
        <el-table-column prop="card" label="提现卡号"  min-width="220"/>
        <el-table-column prop="name" label="所属银行"  min-width="130"/>
        <!-- <el-table-column prop="subName" label="所属支行"  min-width="150"/> -->
        <el-table-column prop='creattime' :formatter="detailTimeFilter" label="创建时间"   min-width="220"/>
        <el-table-column prop="operation" label="操作"  min-width="200"  fixed='right'>
            <template slot-scope="scope">
              <el-button type="primary" size="middle" @click="agree(scope.row,2)" plain :disabled="disabled">通过</el-button>
              <el-button type="danger" plain size="middle" @click='reject(scope.row,3)' :disabled="disabled">拒绝</el-button>
            </template>
        </el-table-column>
      </el-table>
	</TablePage>
		<!-- 打款中 -->
	<TablePage v-if='data.status==2' key='2'>
      <el-table :data="data.list"  v-loading="data.loading" @sort-change="sortChange"  ref="multipleTable2" >
        <el-table-column prop="fullName" label="用户手机号"  min-width="150"/>
        <el-table-column prop="id" label="记录ID"  min-width="100"/>
        <el-table-column prop="userName" label="提现姓名"  min-width="120"/>
        <el-table-column prop="phone" label="提现手机号"  min-width="150"/>
        <el-table-column prop="money" label="提现金额(元)"  min-width="160" sortable="custom" />
        <el-table-column prop="card" label="提现卡号"  min-width="220"/>
        <el-table-column prop="name" label="所属银行"  min-width="130"/>
        <!-- <el-table-column prop="subName" label="所属支行"  min-width="150"/> -->
        <el-table-column prop='creattime' :formatter="detailTimeFilter" label="创建时间"   min-width="220"/>
        <el-table-column prop="operation" label="操作"  min-width="200" >
          <template slot-scope="scope">
           <el-button type="success" size="middle"  plain :disabled="disabled">提现成功</el-button>
          </template>
        </el-table-column>
      </el-table>
	</TablePage>
			<!-- 已拒绝 -->
	<TablePage v-if='data.status==3' key='3'>
      <el-table :data="data.list"  v-loading="data.loading" @sort-change="sortChange"  ref="multipleTable3">
        <el-table-column prop="fullName" label="用户手机号"  min-width="150"/>
        <el-table-column prop="id" label="记录ID"  min-width="100"/>
        <el-table-column prop="userName" label="提现姓名"  min-width="120"/>
        <el-table-column prop="phone" label="提现手机号"  min-width="150"/>
        <el-table-column prop="money" label="提现金额(元)"  min-width="160" sortable="custom" />
        <el-table-column prop="card" label="提现卡号"  min-width="220"/>
        <el-table-column prop="name" label="所属银行"  min-width="130"/>
        <!-- <el-table-column prop="subName" label="所属支行"  min-width="150"/> -->
        <el-table-column prop='creattime' :formatter="detailTimeFilter" label="创建时间"   min-width="220"/>
        <el-table-column prop="reason" label="拒绝理由"  min-width="200" />
      </el-table>
	</TablePage>

    <!-- 分页 -->
    <div class="pre_search">
        <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10,100]" :total="data.total" :method='findList' />
    </div>
    <!-- 审核中拒绝弹框 -->
    <el-dialog title="你确定要拒绝本次提现申请吗？" :visible.sync="dialog.show" :modal-append-to-body="false" top='30vh'>
      <p>一旦拒绝，此操作不可逆转。并且系统会将用户提现金额返还至账户</p>
      <el-form>
          <el-form-item>
              <el-input v-model="dialog.reason" type="textarea"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show= false">取 消</el-button>
        <el-button type="primary" @click="check()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 审核中批量拒绝弹框 -->
    <el-dialog title="你确定要拒绝本次提现申请吗？" :visible.sync="dialog3.show" :modal-append-to-body="false" top='30vh'>
      <p>一旦拒绝，此操作不可逆转。并且系统会将用户提现金额返还至账户</p>
      <el-form>
          <el-form-item>
              <el-input v-model="dialog3.reason" :rows="3" placeholder="请输入拒绝理由..." type="textarea"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog3.show= false">取 消</el-button>
        <el-button type="primary" @click="batchCheck()">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import MyPagination from "../../components/MyPagination.vue"
import ExportButton from '../../components/ExportButton.vue'
import {detailTimeFilter,cardFilter,auditFilter2} from '../../constant/filter'
import TablePage from '../../components/TablePage.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import {getAppCashListApi,auditAppCashApi,exportAppCashListApi} from '../../api/appCashApi'
export default {
  name: "cashApp",
  components: {
    MyPagination,
    ExportButton,
    cardFilter,
    auditFilter2,
    TablePage,
    Breadcrumb
  },
  data() {
    return {
        //changebill:1,
        value: null,//搜索类型
        placeholder:'请输入姓名',//搜索框默认文字
        list: [{value:1, label: '姓名'}, {value:2, label: '手机号'}, {value:3, label: '提现单号'}],
      // 大于当前时间不可选
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
      tiemValue:[],
      multipleSelection:[],//选择多条
      multipleSelectId:[],//选择多条的ID
      listTab: [{pid: 1, name: '审核中'}, {pid:2, name: '已通过'}, {pid: 3, name: '已拒绝'}],
      // 表格
      data:{
          page: 1,
          pageSize:10,
          start:null,
          end:null,
          keyType :1,//select值
          keyWord :null,//搜索框订单号
          loading: false,
          total: 0,
          status:1,
          sort: null,      // 排序参数
          order: null,
          list:[]
      },
      dialog: {show: false, reason: null, id:[], status:null},//审核中拒绝弹框
      dialog2:{show: false, id:null,serialNumber:null},//打款中弹框
      dialog3: {show: false, reason: null, id:[], status:null},//审核中批量拒绝弹框
      disabled: false,
    }
  },
  created() {
    //刷新时，保留之前的状态
     let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
    if(!!this.$route.query.tab){
      this.data.status = this.$route.query.tab
      this.redBill(this.$route.query.tab)
    }
  },
  methods: {
    detailTimeFilter,
    cardFilter,
    auditFilter2,
      findList(page = {}) {
        this.data.loading = true
        getAppCashListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
    changeSelect(){
      this.data.keyType = this.value
      this.placeholder = ['请输入姓名','请输入手机号','请输入提现单号'][this.value-1]
    },
    //4个tab切换
    redBill(id) {
        this.data.status = id
        this.data.sort = null
        //处理tab切换时路由中的参数
        this.$router.replace({ query: { ...this.$route.query,page:1,tab:id} })
        //{page:1}tab切换时 重置 page值
				this.findList({page:1})
      },
    selectTime(){
         this.data.start = Date.parse(this.tiemValue[0])
				 this.data.end = Date.parse(this.tiemValue[1])
			},
    // 搜索按钮
    search(){
     this.$router.replace({ query: { ...this.$route.query,page:1} })
     this.findList({page:1})
    },
    // 重置按钮
    reset() {
        this.data.keyWord = null
        this.data.start = null
        this.data.end = null
        this.value = null
        this.data.keyType =1
        this.tiemValue = []
        this.data.sort = null
        this.$router.replace({ query: { ...this.$route.query,page:1} })
			  this.findList({page:1})
        this.$refs.multipleTable ? this.$refs.multipleTable.clearSort(): ''
        this.$refs.multipleTable2 ? this.$refs.multipleTable2.clearSort(): ''
        this.$refs.multipleTable3 ? this.$refs.multipleTable3.clearSort(): ''
    },
    // 排序
    sortChange(val) {
      this.data = val.order == 'descending'?({...this.data,sort:2}):({...this.data,sort:1})
      console.log(this.data)
      this.findList()
    },
    //选择多个
    multipleSelect(val) {
        this.multipleSelection = val;
        this.multipleSelectId = []
        this.multipleSelection.forEach((item) => {
          this.multipleSelectId.push(item.id)
        });
    },
    //取消选择
    clearSelection(rows){
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    //审核通过
      agree(row,status,rows){
        //取消掉复选框

        this.clearSelection(rows)

        this.$confirm('一旦审核通过,此操作不可逆转,并且提现申请进入打款中状态', '你确定要审核通过本次提现申请吗？',
         {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true})
        .then(() => {
          auditAppCashApi({ids:[row.id],status}).then(()=>{
            this.findList()
            this.$message({type: 'success', message: '确认通过!'});})
          })
        .catch(() => {
          this.$message({type: 'info', message: '取消通过'});
        });
      },
      //拒绝按钮
      reject(row,status,rows){
         //取消掉复选框
          this.clearSelection(rows)
          this.dialog.reason = null
          this.dialog.show = true
          this.dialog.id=row.id
          this.dialog.status=status
      },
    //拒绝
      check() {
        auditAppCashApi({ ids:[this.dialog.id],status:this.dialog.status,reason:this.dialog.reason}).then(()=>{
           this.dialog.show = false
           this.findList()
        })
      },
//    导出功能
    exportCashList({start, end}) {
      return exportAppCashListApi({...this.data,start, end})
    },

    //批量通过
    batchAgree(){
        if(this.multipleSelectId.length){
          this.$confirm('一旦审核通过,此操作不可逆转,并且提现申请进入打款中状态', '你确定要审核通过本次提现申请吗？',
          {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true})
          .then(() => {
            auditAppCashApi({ids:this.multipleSelectId,status:2}).then(()=>{
              this.findList()
              this.$message({type: 'success', message: '确认通过!'})})
            })
          .catch(() => {
            this.$message({type: 'info', message: '取消通过'});
          });
        }else{
          this.$message({type: 'warning', message: '请选择需要批量审核的订单'});
        }
    },
    //批量拒绝按钮
    batchReject(){
      this.multipleSelectId.length ? this.dialog3.show = true:this.$message({type: 'warning', message: '请选择需要批量拒绝的订单'});
      this.dialog3.reason = null
    },
    //批量拒绝
    batchCheck(){
      auditAppCashApi({ ids:this.multipleSelectId,status:3,reason:this.dialog3.reason}).then(()=>{
           this.dialog3.show = false
           this.findList()
        })
    },
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
  },
};
</script>

<style lang="less" scoped>
.cashApp {
  .content_data_title {
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
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 15px;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    .block {
      margin-left: 10px;
      .el-range-separator {
        width: 10%;
      }
      .Button {
        margin-left: 10px !important;
      }
    }
  }
  .search {
    height: 74px;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding-left: 10px;
    .Input {
      width: 250px !important;
    }
  }
  .operation{
      list-style:none;
      white-space:nowrap;
      text-overflow:ellipsis;
      -o-text-overflow:ellipsis;
       overflow: hidden;
       margin-top:5px;
  }
}
</style>

<style lang="less">
.cashApp {
  .pre_table {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 #e4e8ec;
    margin-top: 20px;
    & > .Input,
    & > .el-select {
      width: 220px;
      margin: 20px;
    }
  }
  .el-select {
    max-width: 125px;
  }
  .el-input__inner{
      border-radius:20px;
  }
  // 表格样式
  .el-table th > .cell {
    text-align: center;
    font-size: 16px;
    color: #4d4d4d;
    font-weight: bold;
  }
  .el-table td > .cell {
    text-align: center;
    color: #4d4d4d;
    font-size: 16px;
  }
  .Input__inner {
    border-radius: 20px;
  }
  .el-dialog {
    margin-left: 35%;
    margin-top: 200px;
    max-width: 600px;
    p {
      text-align: center;
      margin-bottom: 30px;
    }
  }
  .el-dialog__header {
    text-align: center;
  }
  .dialog-footer{
      display:flex;
      justify-content:center;
  }
  /* .el-table__row {
    .cell {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  } */
}
</style>
