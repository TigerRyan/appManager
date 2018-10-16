<!--充值管理-->
<template>
  <div class='content_data userpayManager'>
    <Breadcrumb/>
        <div class="serch">
            <el-input placeholder="用户邀请码" v-model="data.keyWord" style="width: 378px;" @blur="search"></el-input>
            <el-button  icon="el-icon-search" style="margin-left: 30px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
					  <el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset">重置</el-button>
            <el-button type="primary"  icon="el-icon-plus" round @click="edit()" :disabled = 'disabled'>发放</el-button>
            <li class='ExportButton'><ExportButton style='margin-top:0px;' :method="exportCashList"></ExportButton></li> 
        </div>
        <TablePage class="lock" v-show="data.showFreeze">
          <el-table :data="data.list" v-loading="data.loading" @sort-change="sort" element-loading-text="拼命加载中...">
            <el-table-column prop="name" label="用户姓名"  min-width="80"/>
            <el-table-column prop="phone" label="用户手机号"  min-width="80"/>
            <el-table-column prop="pid" label="用户邀请码" min-width="130"/>
            <el-table-column prop="money" label="加钱金额" :formatter="currencyFilter"  min-width="120"/>
            <el-table-column prop="createtime" label="加钱时间" :formatter="dateTimeFilter" min-width="130"/>
          </el-table>
          <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
        </TablePage>
    <el-dialog  :visible.sync="dialogTableVisible" :modal="modal" custom-class="activity" @close="firstDialogClose">
      <el-form :inline="true" :model="formInline" ref="inlineForm" :rules="rules" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="邀请码:" prop="pid" >
          <el-input v-model="formInline.pid" clearable placeholder="请输入用户邀请码" style="width: 200px;"  />
        </el-form-item>
        <el-form-item>
         <el-button  type="primary" style="width: 100px ;margin-left:30px" @click="addVip" :disabled = 'addPid'>添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="gridData">
        <el-table-column property="name" label="用户姓名" min-width="100"/>
        <el-table-column property="phone" label="用户手机号" min-width="100"/>
        <el-table-column property="pid" label="用户邀请码" min-width="100"/>
        <el-table-column  label="操作" class=""  min-width="100" max-width='200'>
			            <template slot-scope="scope">			            	
					            <el-button type="danger" @click="cancelWelfare(scope.row)">删除</el-button>		            
			            </template>
          </el-table-column>
      </el-table>
      <div class="btn">
          <el-button class="codes" @click="goBack" plain>返回</el-button>
          <el-button class="xia"  @click="next('inlineForm')" plain >下一步</el-button>
      </div>
    </el-dialog>
    <!-- 二级弹框 -->
    <el-dialog title="" :visible.sync="secondDialogVisible" :modal="modal" @close="secondDialogClose" custom-class="establish">
        <el-form :model="createModul" ref="createModul" :rules="rules">
          <el-form-item label="充值金额 (￥)" label-width="60" prop="money">
            <el-input-number v-model.number="createModul.money" 
            :min='0' auto-complete="off"/>
          </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="codes"  size="small" @click="secondDialogVisible=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="nextTo" plain>确认</el-button>
        </div>
    </el-dialog>
    <!-- 三级弹框 -->
    <el-dialog title="" :visible.sync="thirdDialogVisible" :modal="modal" @close="thirdDialogClose" custom-class="establish">
        <h3 class="sureRecharge">确定给该用户充值吗？</h3>  
        <div class="btn">
            <el-button class="codes"  size="small" @click="thirdDialogVisible=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="establish('createModul')" :disabled = 'sendMoney' plain>确认</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  dateTimeFilter,
  defValFilter02,
  currencyFilter
} from "../../constant/filter"
import TablePage from "../../components/TablePage.vue"
import MyPagination from "../../components/MyPagination.vue"
import Breadcrumb from "../../components/Breadcrumb.vue"
import {
  // getVoucherRecordsApi,
  getUserInfoApi,
  getMoneyApi,
  exportuserpayListApi,
  getrechargeListApi
} from "../../api/userpayManagerApi.js"
import ExportButton from '../../components/ExportButton.vue'
import { confirm, success, error } from "../../actions/index"
export default {
  name: "userpayManager",
  components: { TablePage, MyPagination, Breadcrumb,ExportButton },
  data() {
    return {
      disabled1: false,
      addPid:false,                            //添加邀请码按钮禁用
      sendMoney:false,                         //确认充值按钮禁用
      percentDialogVisible:false,
      dialogTableVisible: false,
      secondDialogVisible: false,
      thirdDialogVisible: false,
      modal: false,
      disabled: false,
      tiketNum:null,
      activeName: 'first',
      data: {
        page: 1,
        pageSize: 10,
        type: 1,
        list: [],
        total: 0,
        keyWord:null,
        loading: false,
        showFreeze: true,
        name: null,
      },
      formInline: {              //弹窗的邀请码
        pid: null
      },
      gridData: [],              //弹窗所展示的表单
      userId :[],               //用户的id数组
      createModul: {             //最后一步传给后台的数据
        page:1,
        pageSize:10,
        money:null,         //学习券类型 type 3    宝券type 1
        userId:'',              //用户的id数组
      },
      studyCoupon:{
        percentage :null
      },
      rules: {
        pid:[
          { required: true, trigger: "blur", message:'邀请码不能为空' },
          { pattern: /^[A-Za-z0-9]{6}$/, message: '请输入正确的6位邀请码', trigger: 'blur'}
        ],
        phone: [{required: true, message: '请输入电话号码...', trigger: 'blur'},
         {min: 11, max: 11, message: '电话号码长度为11位...', trigger: 'blur'}],
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择位置", trigger: "change" }],
        money: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
          {
            pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/,
            message: "充值金额只能保留两位小数",
            trigger: "blur"
          }
        ],
        percentage:[
         { required: true, message: "请输入学习券发放比例", trigger: "blur" },
          {
            pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/,
            message: "最多保留两位小数",
            trigger: "blur"
          }
        ],
        number: [
          { required: true, message: "请输入发放数量", trigger: "blur" },
          {
            pattern: /^[0-9]+$/,
            message: "发放数量必须为正整数",
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    dateTimeFilter,
    defValFilter02,
    currencyFilter,
    handleClick(tab, event) {
        console.log(tab, event);
        if(tab.name=="second"){
          // this.getCouponRatio()
        }
      },
    // 搜索关键字
    search(){
      this.findList({page:1}) 
    },
    // 重置
    reset(){
      this.data.keyWord = null
      this.findList({page:1})
    },
    //    导出功能
    exportCashList({start, end}) {
      return exportuserpayListApi({...this.data,start, end})
    },      
    setPercentage(){
      this.percentDialogVisible = true
      this.studyCoupon.percentage = this.tiketNum
    },
    findList(page = {}) {
      this.data.loading = true
      getrechargeListApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...page, ...data, loading: false }
      })
    },
    //添加发放用户手机号
    edit() {
      this.userId = [];
      this.dialogTableVisible = true
    },
    //添加到表单
    addVip() {
      this.$refs.inlineForm.validate( valid =>{
        if(valid){
            let idx = this.gridData.findIndex((val, index, arr)=>{
            return val.pid == this.formInline.pid
          })
          if(idx==-1){
            getUserInfoApi(this.formInline.pid).then( res =>{
                this.userId.push(res.id)
                this.gridData.push(res)
                this.formInline.pid = null
                this.addPid = true
          })
          }else{
            error('不可添加重复邀请码')
            this.formInline.pid = null
            return
          }
        }
      })

    },
    //删除已添加到表单用户
    cancelWelfare({ id,name }) {
      confirm(`你确认删除用户 ${name} 吗?`, "warning", "取消确认").then(
      ()=>{
          let idx = this.userId.findIndex(function(val, index, arr) {
          return val == id
        });
        this.gridData.splice(idx, 1)
        this.userId.splice(idx, 1)
        this.addPid = false
      }
      )
    },
    sort({ order, prop }) {
      this.search(
        prop
          ? { [prop]: { descending: 0, ascending: 1 }[order] }
          : { earning: null }
      );
    },
    //返回取消
    goBack(){
      this.userId = []
      this.dialogTableVisible=false
      this.addPid = false
    },
    //下一步
    next(val) {
      if(this.gridData.length){
          this.dialogTableVisible = false
          this.secondDialogVisible = true
          this.$refs[val].resetFields();
          this.addPid = false
      }else{
        error('请添加用户邀请码')
        return
      }
    },
    // 去第三个弹框
    nextTo(){
      this.secondDialogVisible = false
      this.thirdDialogVisible = true
      this.addPid = false
    },
    // 确认充值
    establish(val) {
      this.createModul.userId=this.userId.join(',')
      this.$refs[val].validate(valid => {
        if (valid) {
          getMoneyApi(this.createModul.userId,this.createModul.money).then(data => {
              this.$refs[val].resetFields();
              this.findList();
              success(`用户充值成功`);
              this.sendMoney = true
              setTimeout(() => {
                this.sendMoney = false;
                this.thirdDialogVisible = false;
              }, 5000);
          });
        }
      });
    },
    //第一个弹窗关闭
    firstDialogClose(){
      this.gridData=[]
      this.$refs.inlineForm.resetFields();
    },
    //第二个弹窗关闭
    secondDialogClose(){
      // this.userId = []
      // this.createModul.userId =''
      // this.$refs.createModul.resetFields();
    },
    //第三个弹框关闭
    thirdDialogClose(){
      this.userId = []
      this.createModul.userId =''
      this.$refs.createModul.resetFields();
    },
    //设置比例弹窗
    percentDialogClose(){
      this.studyCoupon.percentage= null
      this.$refs.studyCoupon.resetFields();
    },
    getCouponRatio(){
      getCouponRatioApi('COUPON_RATIO_STUDY').then(res =>{
        this.tiketNum = (res*100).toFixed(2)
      })
    },
    //提交设置
    modifyPercentage(){
      this.$refs.studyCoupon.validate(valid => {
        if (valid) {
          setCouponRatioApi('COUPON_RATIO_STUDY',this.studyCoupon.percentage/100).then(data => {
              this.$refs.studyCoupon.resetFields();
              this.getCouponRatio();
              success(`学习券发自动放比例修改成功！`);
              this.percentDialogVisible = false;
          });
        }
      });
    }
  },
  created() {
    
    // type, 0为编辑， 1为查看
    let UserType =
      JSON.parse(window.localStorage.getItem("userInfo")) &&
      JSON.parse(window.localStorage.getItem("userInfo")).type;
    this.disabled = UserType ? true : false;
  }
};
</script>
<style lang='less' scoped>
.content_data {
  min-width: 563px;
  p,
  h3,
  div {
    margin: 0;
    padding: 0;
  }
  .cate_list {
    height: 100%;
    line-height: 70px;
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
  }
  .cap {
    width: 100%;
    height: 70px;
    background: #fff;
    line-height: 70px;
    padding-left: 25px;
    border-left: 2px solid #45b9f4;
    color: #45b9f4;
    font-size: 20px;
    font-family: "微软雅黑";
  }
  .serch {
    background: #fff;
    height: 70px;
    padding-left: 25px;
    line-height: 70px;
    .sc {
      width: 30%;
      margin: 0 30px;
      .el-input__inner {
        border-radius: 40px;
      }
    }
    .el-button--primary {
      background-color: #51c5ff;
      border-color: #51c5ff;
    }
  }
  .cate_nav {
    margin-top: 20px;
  }
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 30%;
    }
  }

  .el-dialog__header {
    background-color: #eee;
  }
  .code {
    width: 100%;
    img {
      width: 30%;
      margin: 0 auto;
      display: block;
    }
  }
  .describe {
    text-align: center;
    padding: 30px 0;
    font-size: 18px;
    color: #51c5ff;
  }
  .link {
    width: 100%;
    li {
      width: 70%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 20px auto;
      span {
        font-size: 15px;
      }
      span:nth-of-type(1) {
        text-align: right;
      }
      span:nth-of-type(2) {
        width: 35%;
      }
    }
  }
  .codes {
    border-color: #45b9f4;
    color: #45b9f4;
  }
}
</style>
<style lang="less">
.userpayManager {
  li {
    float: left;
    margin: 0 17px;
    color: #495869;
    cursor: pointer;
    &.ExportButton {
      float: right;
    }
  } 
  #pane-second{
    background-color: #fff;
    .el-row{
      padding:50px 0 50px 30px;
      margin-top:30px;
    }
  }
  .el-tabs__nav-wrap{
    background-color: #fff;
  }
  .el-tabs__nav-scroll{
    margin-left: 30px;
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
  .grid-content{
    height: 40px;
    line-height: 40px;
    font-size:20px;
    text-align:center;
  }
  .activity.el-dialog {
    width: 944px;
    height: 650px;
    position: relative;
    .el-dialog__header {
      text-align: center;
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
    .el-dialog__body {
      padding-top: 0;
      height: 550px;
      overflow-y: auto;
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          width: 255px;
          list-style: none;
          margin-bottom: 30px;
          border: 1px solid #fff;
          img {
            // border: 1px solid #fff;
          }
          div {
            width: 100%;
            text-align: center;
          }
        }
        .active {
          border-color: blue;
        }
      }
      .btn {
        position: absolute;
        bottom: 0;
        height: 68px;
        left: 0;
        background-color: #f1f3f6;
        width: 100%;
        text-align: center;
        line-height: 68px;
        button {
          margin-right: 20px;
          width: 114px;
          height: 40px;
          background-color: #ffffff;
          border-radius: 20px;
          border: solid 1px rgba(201, 204, 207, 0.47);
        }
        .xia {
          background-color: #51c5ff;
          color: #fff;
        }
      }
    }
  }
  .establish {
    .el-dialog__body {
      padding-top: 0px;
      width: 50%;
      margin: 0 auto;
      .el-form-item {
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
      }
    }
    .btn {
      padding-top: 20px;
      text-align: center;
      button {
        width: 114px;
        height: 40px;
        border: solid 1px rgba(201, 204, 207, 0.47);
        border-radius: 20px;
      }
      .xia {
        background-color: #51c5ff;
        color: #fff;
      }
    }
  }
  .sureRecharge{
    text-align:center;
    font-size: 25px;
    color:red;
  }
}
.manage .content .content_data .el-table {
  margin-top: 30px;
}
</style>
