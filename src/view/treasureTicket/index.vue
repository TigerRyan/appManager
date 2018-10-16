
<template>
  <div class='content_data treasureTicket'>
    <Breadcrumb/>
    <!-- 主体开始  -->
    <div id="main">
      <el-tabs v-model="activeName2" @tab-click="handleClick">
        <el-tab-pane label="宝券设置" name="first">
          <div class="ticketMoney">
            <span style="display:inline-block;width:250px;">宝券恒定值:</span>
            <span style="display:inline-block;width:200px;">{{tiketNum.tiketforever}}元</span>
            <el-button type="primary" @click="edit(0)">设置</el-button>
          </div>
          <div class="ticketMoney">
            <span style="display:inline-block;width:250px;">宝券发放数量:</span>
            <span style="display:inline-block;width:200px;">{{tiketNum.tiketNumber}}</span>
            <el-button type="primary" @click="edit(1)">设置</el-button>
          </div>
          <div class="ticketMoney">
            <span style="display:inline-block;width:250px;">中奖概率高级:</span>
            <span style="display:inline-block;width:200px;">{{prize.value1}}</span>
            <el-button type="primary" @click="editSenior(0,'COUPON_RATE1')">设置</el-button>
          </div>
          <div class="ticketMoney">
            <span style="display:inline-block;width:250px;">中奖概率中级:</span>
            <span style="display:inline-block;width:200px;">{{prize.value2}}</span>
            <el-button type="primary" @click="editSenior(1,'COUPON_RATE2')">设置</el-button>
          </div>
          <div class="ticketMoney">
            <span style="display:inline-block;width:250px;">中奖时合成宝券最大张数:</span>
            <span style="display:inline-block;width:200px;">{{prize.value3}}</span>
            <el-button type="primary" @click="editSenior(2,'COUPON_GET_MAX')">设置</el-button>
          </div>
          <div class="ticketMoney">
            <span style="display:inline-block;width:250px;">兑换商品宝券数量最大值:</span>
            <span style="display:inline-block;width:200px;">{{prize.value4}}</span>
            <el-button type="primary" @click="editSenior(3,'COUPON_GOODS_EXCHANGE_MAX')">设置</el-button>
          </div>
          <el-dialog title="" :visible.sync="show" :modalAppendToBody="false" width="600px"  @close="cancell">
            <el-form :model="dialog" :rules="rules" ref="ruleForm" labelWidth="150px" @submit.native.prevent>
              <el-form-item :label="this.setting?'宝券发放数量':'宝券数量恒定值'" :prop="this.setting?'number':'money'">
                <el-input v-if="setting" style="width:150px;"  v-model="dialog.number"/>
                <el-input v-if="!setting" style="width:150px;"  v-model="dialog.money"/>
                <span v-if="!setting">&nbsp;&nbsp;元</span>
              </el-form-item>
            </el-form>
            <div slot="footer" class="text-center">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="submit">确认</el-button>

            </div>
          </el-dialog>
          <!-- 新增修改值 -->
          <el-dialog title="" :visible.sync="show1" :modalAppendToBody="false" width="600px"  @close="cancell1">
            <el-form :model="dialog" :rules="rules" ref="ruleForm1" labelWidth="250px" @submit.native.prevent>
               <el-form-item :label="['中奖概率高级','中奖概率中级','中奖时合成宝券最大张数','兑换商品宝券数量最大值'][textTitle]" prop='value1'>
                  <!-- <el-input  style="width:150px;"  v-model="dialog.value1"/> -->
                  <el-input-number v-if="textTitle==0 || textTitle==1" v-model="dialog.value1" :min="0" :max="1" :step="0.1"></el-input-number>
                  <el-input-number v-if="textTitle==2 || textTitle==3" v-model="dialog.value1" :min="0"  ></el-input-number>
              </el-form-item>
            </el-form>
            <div slot="footer" class="text-center">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="submit1">确认</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="宝券统计" name="second">
          <!-- 统计 -->
          <div class="statistics">
            <ul>
              <li>
                  <p>宝券数量</p>
                  <p>{{data2.couponNum}}</p>
              </li>
              <li>
                  <p>当前用户拥有宝券最多数量</p>
                  <p>{{data2.couponUserMaxNum}}</p>
              </li>
              <li>
                  <p>拥有宝券的用户数量</p>
                  <p>{{data2.couponUserNum}}</p>
              </li>
            </ul>
          </div>
        <!-- 第一个echarts 用户拥有宝券最多数量走势图 -->
        <div class="chart">
          <div class="maxNumber">
            <span>最大值&nbsp;</span><span>{{this.maxNum}}</span>&nbsp;&nbsp;
            <span>最小值&nbsp;</span><span>{{this.minNum}}</span>
          </div> 
        <div class="status">
          <el-radio-group v-model="radio2" @change="tendency">
            <el-radio :label="3">时</el-radio>
            <el-radio :label="2">日</el-radio>
            <el-radio :label="1">月</el-radio>
          </el-radio-group>
        </div>
         <div id="myChart" style="width:100%;height:400px"></div>
      </div>
     
      <!-- 第二个echarts 用户拥有宝券最多数量走势图 -->
        <div class="chart">
          <div class="maxNumber">
            <span>最大值&nbsp;</span><span>{{this.maxNum1}}</span>&nbsp;&nbsp;
            <span>最小值&nbsp;</span><span>{{this.minNum1}}</span>
          </div> 
          <div class="status">
            <el-radio-group v-model="checkList" @change="tendency1">
              <el-radio :label="3">时</el-radio>
              <el-radio :label="2">日</el-radio>
              <el-radio :label="1">月</el-radio>
            </el-radio-group>
          </div>
          <div id="myChart1" style="width:100%;height:400px"></div>
        </div>
        </el-tab-pane>
        <el-tab-pane label="宝券排行" name="third">
          <!-- 搜索 -->
          <div class="searchList">
            <el-select  style="margin-right: 32px" v-model="data.keyType" size="medium" placeholder="请选择" @change='changeSelect' >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
            <el-input placeholder="请输入用户名称或手机号" v-model="data.keyWord" style="width: 378px;"></el-input>
            <el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
					  <el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset">重置</el-button>
          </div>
          <!-- 列表 -->
          <TablePage>
              <el-table :data="data.list" ref="multipleTable" stripe  v-loading="data.loading" element-loading-text="拼命加载中...">
                <el-table-column prop="userPic" label="用户头像" min-width="130">
                   <template slot-scope="scope">
                     <img :src="scope.row.userPic" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
                  </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名" min-width="130"/>
                <el-table-column prop="phone" label="手机号" min-width="150"/>
                <el-table-column prop="userType" label="身份" min-width="110" :formatter="userTypeFilter">
                </el-table-column>
                <el-table-column prop="couponNum" label="宝券数量" min-width="110">
                </el-table-column>
                <el-table-column  label="操作" class="operation"  min-width="200">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="examine(scope.row.userId,scope.row.userName)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </TablePage>
    <!-- 分页 -->
			<MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
        </el-tab-pane>
        <el-tab-pane label="宝券发放" name="fourth">
          <div class="voucherManager">
            <div class="searchtitle">
            <div class="content-title" style="padding-left:50px">
              <el-button type="primary"  icon="el-icon-plus" round @click="edit4()" :disabled = 'disabled' style="background-color: #51c5ff;border-color:#51c5ff">发放</el-button>
            </div>
          </div>
            <TablePage class="lock" v-show="data4.showFreeze">
              <el-table :data="data4.list" v-loading="data4.loading" @sort-change="sort" element-loading-text="拼命加载中...">
                  <el-table-column prop="userPic" label="用户头像" min-width="150">
                    <template slot-scope="scope">
                      <!-- :src="scope.row.imageUrl.split(',')[0] -->
                    <img :src="scope.row.userPic" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
                    </template>
                  </el-table-column>
                <el-table-column prop="userName" label="用户名"  min-width="80"/>
                <el-table-column prop="phone" label="手机号"  min-width="130"/>
                <el-table-column prop="userType" label="身份" :formatter="userTypeFilter" min-width="80"/>
                <el-table-column prop="couponNum" label="宝劵数量"  min-width="120"/>
                <el-table-column prop="couponGiveNum" label="发放宝券数量"  min-width="80"/>
                <el-table-column prop="giveTime" label="发放时间" :formatter="dateTimeFilter" min-width="130"/>
              </el-table>
              <MyPagination :page="data4.page" :size="data4.pageSize" :method="findList4" :total="data4.total"/>
            </TablePage>
              <el-dialog  :visible.sync="dialogTableVisible" :modalAppendToBody="false" custom-class="activity" @close="firstDialogClose">
                <el-form :inline="true" :model="formInline" ref="inlineForm" :rules="rules4" class="demo-form-inline" @submit.native.prevent>
                  <el-form-item label="用户手机号:" prop="phone">
                    <el-input v-model="formInline.phone" clearable placeholder="请输入用户手机号" style="width: 200px;"  />
                  </el-form-item>
                  <el-form-item>
                  <el-button  type="primary" style="width: 100px ;margin-left:30px" @click="addVip" >添加</el-button>
                  </el-form-item>
                </el-form>
                <el-table :data="gridData">
                  <el-table-column prop="pic" label="用户头像" min-width="150">
                      <template slot-scope="scope">
                      <img :src="scope.row.pic" onerror="onerror=null;src='/static/img/logo.png'" width="50" height="50"/>
                      </template>
                    </el-table-column>
                  <el-table-column property="name" label="用户名" min-width="100"/>
                  <el-table-column property="phone" label="手机号" min-width="100"/>
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
              <el-dialog title="" :visible.sync="secondDialogVisible" :modalAppendToBody="false" @close="secondDialogClose" custom-class="establish">
                  <el-form :model="createModul" ref="createModul" :rules="rules4">
                    <el-form-item label="发放数量 (张)" label-width="60" prop="number">
                      <el-input-number v-model.number="createModul.number"  :min='0' auto-complete="off"/>
                    </el-form-item>
                  </el-form>
                  <div class="btn">
                      <el-button class="codes"  size="small" @click="secondDialogVisible=false" plain>取消</el-button>
                      <el-button class="xia"  size="small" @click="establish('createModul')" plain>确认</el-button>
                  </div>
              </el-dialog>           
          </div>
        </el-tab-pane>
        <el-tab-pane label="合成券发放" name="five">
          <div class="voucherManager">
            <div class="searchtitle">
            <div class="content-title" style="padding-left:50px">
              <el-button type="primary"  icon="el-icon-plus" round @click="edit4()" :disabled = 'disabled' style="background-color: #51c5ff;border-color:#51c5ff">发放</el-button>
            </div>
          </div>
            <TablePage class="lock" v-show="data5.showFreeze">
              <el-table :data="data5.list" v-loading="data5.loading" @sort-change="sort" element-loading-text="拼命加载中...">
                  <el-table-column prop="userPic" label="用户头像" min-width="150">
                    <template slot-scope="scope">
                      <!-- :src="scope.row.imageUrl.split(',')[0] -->
                    <img :src="scope.row.userPic" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
                    </template>
                  </el-table-column>
                <el-table-column prop="userName" label="用户名"  min-width="80"/>
                <el-table-column prop="phone" label="手机号"  min-width="130"/>
                <el-table-column prop="userType" label="身份" :formatter="userTypeFilter" min-width="80"/>
                <el-table-column prop="couponNum" label="合成券数量"  min-width="120"/>
                <el-table-column prop="couponGiveNum" label="发放合成券券数量"  min-width="80"/>
                <el-table-column prop="giveTime" label="发放时间" :formatter="dateTimeFilter" min-width="130"/>
              </el-table>
              <MyPagination :page="data5.page" :size="data5.pageSize" :method="findList5" :total="data5.total"/>
            </TablePage>
              <el-dialog  :visible.sync="dialogTableVisible" :modalAppendToBody="false" custom-class="activity" @close="firstDialogClose">
                <el-form :inline="true" :model="formInline" ref="inlineForm" :rules="rules4" class="demo-form-inline" @submit.native.prevent>
                  <el-form-item label="用户手机号:" prop="phone">
                    <el-input v-model="formInline.phone" clearable placeholder="请输入用户手机号" style="width: 200px;"  />
                  </el-form-item>
                  <el-form-item>
                  <el-button  type="primary" style="width: 100px ;margin-left:30px" @click="addVip" >添加</el-button>
                  </el-form-item>
                </el-form>
                <el-table :data="gridData">
                  <el-table-column prop="pic" label="用户头像" min-width="150">
                      <template slot-scope="scope">
                      <img :src="scope.row.pic" onerror="onerror=null;src='/static/img/logo.png'" width="50" height="50"/>
                      </template>
                    </el-table-column>
                  <el-table-column property="name" label="用户名" min-width="100"/>
                  <el-table-column property="phone" label="手机号" min-width="100"/>
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
              <el-dialog title="" :visible.sync="secondDialogVisible" :modalAppendToBody="false" @close="secondDialogClose" custom-class="establish">
                  <el-form :model="createModul" ref="createModul" :rules="rules4">
                    <el-form-item label="发放数量 (张)" label-width="60" prop="number">
                      <el-input-number v-model.number="createModul.number"  :min='0' auto-complete="off"/>
                    </el-form-item>
                    <!-- <el-form-item label="发放面额" label-width="60" prop="denomination">
                      <el-select v-model="createModul.denomination" size="medium" placeholder="请选择" @change='changeSelect5' >
                        <el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item> -->
                  </el-form>
                  <div class="btn">
                      <el-button class="codes"  size="small" @click="secondDialogVisible=false" plain>取消</el-button>
                      <el-button class="xia"  size="small" @click="establish('createModul',1)" plain>确认</el-button>
                  </div>
              </el-dialog>           
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  dateTimeFilter,
  defValFilter01,
  defValFilter02,
  currencyFilter,
  defValFilter03,
  userTypeFilter,
  weizhi,
  template,
  status
} from "../../constant/filter"
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import TablePage from '../../components/TablePage.vue'
import {getCouponRanking,getCouponNum,postticketNumber,showticketNumber,showEcharts,getVoucherRecordsApi,getUserInfoApi,sendVouchersApi} from '../../api/couponManage.js'
import echarts from "echarts"
import { confirm, success, error } from "../../actions/index"
export default {
  name: 'treasureTicket',
  components: {
    Breadcrumb,
    MyPagination,
    TablePage
  },
  data () {
    return {
      activeName2: 'first',
      tiketNum:{tiketforever:null,tiketNumber:null},
      show: false,
      show1:false,
      textTitle:0,
      value1:null,
      prize:{value1:'',value2:'',value3:'',value4:''},
     showHour:[], 
     showNum:[],
     maxNum:null,
     minNum:null,
     showHour1:[], 
     showNum1:[],
     maxNum1:null,
     minNum1:null,
      dialog: {
        number: null,
        value1:null,
        text:''
      },
     dialogTableVisible: false,
     secondDialogVisible: false,
     disabled: false,
     disabled1: false,
     data4: {
        page: 1,
        pageSize: 10,
        type: 3,
        list: [],
        total: 0,
        loading: false,
        showFreeze: true,
        name: null,
        type: 3
      },
      data5: {
        page: 1,
        pageSize: 10,
        type: 3,
        list: [],
        total: 0,
        loading: false,
        showFreeze: true,
        name: null,
        type: 2
      },
      createModul: {
        page:1,
        pageSize:10,
        number: null,
        type: 3,
        userIds:'',
        // denomination:null 
      },
      formInline: {
        phone: null
      },
      userIds :[],
      gridData: [],
      options: [
        {
          value: 1,
          label: "姓名"
        },
        {
          value: 2,
          label: "手机号码"
        }
      ],
      options5: [
        {
          value: 1,
          label: "高级"
        },
        {
          value: 2,
          label: "中级"
        }
      ],
      rules: {
        number: [
               { required: true, message: '不能为空', trigger: 'blur'},
               { pattern: /^[+]{0,1}(\d+)$/, message: '请输入非负整数', trigger: 'blur'}],
        money:[
               { required: true, message: '不能为空', trigger: 'blur'},
               { pattern: /^[+]{0,1}(\d+)$/, message: '请输入非负整数', trigger: 'blur'},
        ],
        value1:[{ required: true, message: '不能为空', trigger: 'change'},]
           },
      rules4: {
        phone: [{required: true, message: '请输入电话号码...', trigger: 'blur'},
         {min: 11, max: 11, message: '电话号码长度为11位...', trigger: 'blur'}],
        number: [
          { required: true, message: "请输入发放数量", trigger: "blur" },
          {
            pattern: /^[0-9]+$/,
            message: "发放数量必须为正整数",
            trigger: "blur"
          }
        ],
        // denomination:[
        //   { required: true, message: '不能为空', trigger: 'blur'},
        // ]
      },      
      setting:null,
      radio2:3,
      checkList:3,
      data2:{
      },
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        keyType: 1,
        keyWord: null,
        start: null,
        end: null,
        list: []
      },

    }
  },
  created () {
    if (this.$route.query.backNum) {
      this.activeName2='third'
    }
    this.init()
  },
  mounted() {
  },
  methods: {
    dateTimeFilter,
    defValFilter01,
    defValFilter02,
    defValFilter03,
    currencyFilter,
    userTypeFilter,
    weizhi,
    template,
    status,
    init(){
      showticketNumber('COUPON_CONSTANT').then((res)=>{
          this.tiketNum.tiketforever = res
        })
      showticketNumber('COUPON_GIVE_OUT').then((res)=>{
          this.tiketNum.tiketNumber = res
        })
       showticketNumber('COUPON_RATE1').then(data=>{
              this.prize.value1=data
        })
      showticketNumber('COUPON_RATE2').then(data=>{
              this.prize.value2=data
          })
      showticketNumber('COUPON_GET_MAX').then(data=>{
              this.prize.value3=data
      })
      showticketNumber('COUPON_GOODS_EXCHANGE_MAX').then(data=>{
              this.prize.value4=data
      })  
    },
    editSenior(val,text){                   //设置中奖概率高级
        this.show1=true
        this.textTitle=val
        this.dialog.text=text
        showticketNumber(text).then(data=>{
              this.dialog.value1=data
          })
    },
    submit1(){
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          postticketNumber(this.dialog.text,this.dialog.value1).then(data=>{
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                this.show1=false
                this.init()
            })
          
        }
      })
        
    },
    handleClick(tab, event) {
      if(this.activeName2=='second'){
         getCouponNum().then(data=>{
          this.data2 = data
         })
          //事件队列
      setTimeout(()=>{
        this.drawLine()
      },0)
      this.radio2= 3
      this.checkList = 3
      this.echartsDetail(3,1)
      this.echartsDetail1(3,2)
      }
      if(this.activeName2 == 'third'){  
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        this.findList({page: 1})
      }
      if(this.activeName2 == 'fourth'){  
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        // this.createModul.denomination = undefined
        this.findList4({page: 1})
      }
      if(this.activeName2 == 'five'){  
        this.$router.replace({ query: { ...this.$route.query, page: 1 } })
        // this.createModul.denomination = 1
        this.findList5({page: 1})
      }
      this.showHour = [],
      this.showNum = [],
      this.maxNum = null,
      this.minNum = null,
      this.showHour1 = [],
      this.showNum1 = [],
      this.maxNum1 = null,
      this.minNum1= null       
    },
    // 获取echarts表格数据1
    echartsDetail(type,status){
      showEcharts(type,status).then(res=>{
            res.forEach(ele => {
              this.showHour.push(ele.dateTime.substr(ele.dateTime.length-2,2))
              this.showNum.push(ele.couponCount)
            });
          this.drawLine()
          this.maxNum = Math.max(...this.showNum)
          this.minNum = Math.min(...this.showNum)
         })
    },
    // 获取echarts表格数据2
    echartsDetail1(type,status){
      showEcharts(type,status).then(res=>{
            // console.log('xxxxxzeawsfdsfd',res)
            res.forEach(ele => {
              this.showHour1.push(ele.dateTime.substr(ele.dateTime.length-2,2))
              this.showNum1.push(ele.couponCount)
            });
          this.drawLine()
          this.maxNum1 = Math.max(...this.showNum1)
          this.minNum1 = Math.min(...this.showNum1)
         })
    },
    //获取宝卷排行榜
    findList(page = {}){
       this.data.loading = true
      getCouponRanking({...this.data,...page}).then(data=>{
         this.data = {...this.data,...page,...data,loading:false,page: data.pageNum}
      })
    },
    //查看
    examine(idx,res){
      // console.log(idx)
       this.$router.push({name:'rankingList',query:{id:idx,userName:res}})
    },
    //表单quxiao
    cancel() {
        this.show = false
       this.show1= false
     },
   cancell() {
        this.$refs.ruleForm.clearValidate()
     },
    cancell1() {
        this.$refs.ruleForm1.clearValidate()
    },
    edit(res){
      
      if(res){
        this.setting=true
        this.dialog.number = this.tiketNum.tiketNumber
        
      }else{
        this.setting=false
        this.dialog.money = this.tiketNum.tiketforever
      }
      this.show = true
    },
    submit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
      if(this.setting){
         postticketNumber('COUPON_GIVE_OUT',this.dialog.number).then((res)=>{
          this.$message({
              type: 'success',
              message: '设置成功!'
            });
          this.init()
        })
      }else{
        postticketNumber('COUPON_CONSTANT',this.dialog.money).then((res)=>{
          this.$message({
              type: 'success',
              message: '设置成功!'
            });
          this.init()
        })
      }
      this.show = false
      } else {
            return false
        }
      })
    },
    reset(){
        this.data.keyWord = null
        this.findList({page: 1})
    },
    search(){
      // this.data.keyWord = this.data.keyWord
      this.findList({page: 1})
    },
    // echarts趋势图
    tendency(){
     this.showHour = [], 
     this.showNum = [], 
     this.echartsDetail(this.radio2,1)

    },
    tendency1(){
     this.showHour1 = [], 
     this.showNum1 = [], 
     this.echartsDetail1(this.checkList,2)
    },
     drawLine() {
      var charts = [];
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("myChart"));
      var myChart1 = echarts.init(document.getElementById("myChart1"));
      charts.push(myChart)
      charts.push(myChart1)
      // 绘制图表1
      myChart.setOption({
        title: {
          text: "用户拥有宝券最多数量走势图"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
        type: 'category',
        data: this.showHour
        },
        yAxis: {
          // name : `单位：时`,
          type: "value"
        },
        series: [
          {
            name: '宝券数量',
            type: "line",
            stack: "总量",
            data: this.showNum,
          }
        ]
      });
      // 绘制图表2

      myChart1.setOption({
        title: {
          text: "宝券总量走势图"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
        type: 'category',
        data: this.showHour1
        },
        yAxis: {
          // name : `单位：时`,
          type: "value"
        },
        series: [
          {
            name: '宝券总量',
            type: "line",
            stack: "总量",
            data: this.showNum1,
          }
        ]
      });
      window.onresize = function(){
        for(var i = 0; i < charts.length; i++){
            charts[i].resize();
        }
      };

    },
    changeSelect(value) {
      this.data.keyType = value;
      // console.log(value,"xxxx")
    },
    changeSelect5(value) {
      this.createModul.denomination = value;
      // console.log(value,"xxxx")
    },
    //第四个组件
    edit4() {
      this.dialogTableVisible = true
    },
    sort({ order, prop }) {
      this.search(
        prop
          ? { [prop]: { descending: 0, ascending: 1 }[order] }
          : { earning: null }
      );
    },
    findList4(page = {}) {
      this.data4.loading = true
      getVoucherRecordsApi({ ...this.data4, ...page }).then(data => {
        // console.log(data, "列表页data")
        this.data4 = { ...this.data4, ...page, ...data, loading: false,page: data.pageNum }
      })
    }, 
    findList5(page = {}) {
      this.data5.loading = true
      getVoucherRecordsApi({ ...this.data5, ...page }).then(data => {
        // console.log(data, "列表页data")
        this.data5 = { ...this.data5, ...page, ...data, loading: false,page: data.pageNum }
      })
    },   
    firstDialogClose(){
      this.gridData=[]
      this.$refs.inlineForm.resetFields();
    },
    //添加到表单
    addVip() {
      this.$refs.inlineForm.validate( valid =>{
        if(valid){
            let idx = this.gridData.findIndex((val, index, arr)=>{
            return val.phone == this.formInline.phone
          })
          if(idx==-1){
            getUserInfoApi(this.formInline.phone).then( res =>{
                this.userIds .push(res.id)
                this.gridData.push(res)
                this.formInline.phone = null
          })
          }else{
            error('不可添加重复号码')
            this.formInline.phone = null
            return
          }
        }
      })

    },
    cancelWelfare({ id,name }) {
      confirm(`你确认删除用户 ${name} 吗?`, "warning", "取消确认").then(
      ()=>{
          let idx = this.userIds .findIndex(function(val, index, arr) {
          return val == id
        });
        this.gridData.splice(idx, 1)
        this.userIds .splice(idx, 1)
      }
      )
    },
    goBack(){
      this.userIds = []
      this.dialogTableVisible=false
    },
    next(val) {
      if(this.gridData.length){
        this.dialogTableVisible = false
        this.secondDialogVisible = true
        this.$refs[val].resetFields();
      }else{
        error('请添加用户手机号')
        return
      }
      
    }, 
    secondDialogClose(){
      this.userIds = []
      this.createModul.userIds =''
      this.$refs.createModul.resetFields();
    }, 
    // 确认创建按钮
    establish(val,type) {
      this.createModul.userIds=this.userIds.join(',')
      // console.log(this.createModul,'createModul')
      this.$refs[val].validate(valid => {
        if (valid) {
          if(type){
            // this.createModul.denomination = 1
            this.createModul.type = 2    // 合成券
          }else{
            this.createModul.type = 3    // 宝券
          }
          sendVouchersApi(this.createModul).then(data => {
              this.$refs[val].resetFields();
              if(type){
                this.findList5({page: 1});
                success(`合成券发放成功！`);
              // this.createModul.denomination = 1
              }else{
                this.findList4({page: 1});
                success(`宝券发放成功！`);
              }
              
              this.secondDialogVisible = false;
          });
        }
      });
    },      
  },
}
</script>
<style lang='less' scoped>
.treasureTicket{
  #main{
    #pane-first{
      width:100%;
      height:100%;
      background-color: #fff;
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
    height: 60px;
    padding-left:30px;
    background-color: #fff;
    line-height: 60px;
    margin: 20px 0;

  }
  .statistics {
    margin-top: 20px;
    ul {
      display: flex;
      justify-content: space-between;
      width: 100%;
      li {
        width: 30%;
        background: #fff;
        text-align: center;
        padding-bottom: 46px;
        p:first-child {
          padding-top: 47px;
          padding-bottom: 30px;
        }
        p:last-child {
          font-size: 28px;
        }
      }
    }
  }
  #pane-second{
    .chart {
      // width: 60.5%;
      height: 450px;
      background: #fff;
      margin:0 auto;
      margin-top:30px;
      padding-top: 40px;
      padding-left: 74px;
      position: relative;
      .maxNumber{
        position: absolute;
        top: 55px;
        right: 50%;
        // transform: translateX(-50%);
        z-index: 2;
      }
      .status{
        position: absolute;
        top: 30px;
        right: 85px;
        z-index: 2;
      }
    }
  }
}
</style>
<style lang="less">
.treasureTicket{
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
  .voucherManager{
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
  }
}
</style>
