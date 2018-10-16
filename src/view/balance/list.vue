<!-- 学训宝后台--结算管理 -->
<template>
  <div class='content_data balanceList'>
     <Breadcrumb/>
    <!-- tab切换 -->
    <div class="kind interest">
      <ul class="pointerresoures" style="cursor:pointer;">
        <li v-for="(item,index) in interList" :class="{ blue:interListState == index } " @click="changed(index)" :key="index">{{item.name}}</li>
      </ul>
    </div>
    <!-- 搜索 -->
    <div class="time_search">
      <template>
        <el-select v-model="value"  @change='changeSelect'>
          <el-option v-for="(item,index) in list"  :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </template>
			<div class="search">
				<el-input  :placeholder="placeholder" style="width: 378px;" v-model.trim="data.keyWord"></el-input>
			</div>
			 <div class="block">
				<el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;"  round @click="search">查询</el-button>
				<el-button  icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"  round  @click="reset">重置</el-button>
			</div>
    </div>
    <!-- 列表 -->
    <!-- 待结算 -->
    <TablePage v-show="interListState == 0">
        <el-table :data="data.list" element-loading-text="拼命加载中...">
          <el-table-column prop="courseName" label="课程信息" min-width="210">
              <template slot-scope="scope">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="6">
                    <div class="bg_img">
                        <img :src="scope.row.homeImg || '../../../static/img/logo.png'" width="100" height="70" alt="">
                    </div>
                  </el-col>
                  <el-col :span="16" class="keshi">
                    <span class="bg_words">{{scope.row.name}}</span>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column prop="mechanismName" label="机构信息">
            <template slot-scope="scope">
              <span>{{scope.row.mechanismName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="原价 /元">
            <template slot-scope="scope">
              <span>￥{{currencyFilter(0,0,scope.row.salePrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discountPrice" label="优惠价 /元">
            <template slot-scope="scope">
              <span>￥{{currencyFilter(0,0,scope.row.discountPrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="followCount" label="报名人数 /人" />
          <el-table-column prop="teacherName" label="授课教师">
            <template slot-scope="scope">
              <span>{{scope.row.teacherName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="certNo6" label="状态">
            <template slot-scope="scope">
              <p>{{Date.parse(new Date()) < scope.row.courseStartTime  ? '未上课': Date.parse(new Date()) < scope.row.courseEndTime ? '上课中':'已上课'  }}</p>
               <!-- <p>{{dateTimeFilter(0,0,scope.row.courseStartTime)}}--{{dateTimeFilter(0,0,scope.row.courseEndTime)}}</p> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="courseTime" label="操作">
            <template slot-scope="scope">
                <el-button size="small"  @click="nosetDetail()">查看详情</el-button>
            </template>
          </el-table-column>                 -->
        </el-table>
        <!-- <MyPagination :page="dataList.page" :size="dataList.pageSize" :method='findList' :total="dataList.total"/> -->
    </TablePage>

    <!-- 结算中 -->
    <TablePage v-show="interListState == 1">
        <el-table :data="data.list2" element-loading-text="拼命加载中...">
          <el-table-column prop="courseName" label="课程信息" min-width="150">
              <template slot-scope="scope">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="6">
                    <div class="bg_img">
                        <img :src="scope.row.homeImg" width="100" height="70" alt="">
                    </div>
                  </el-col>
                  <el-col :span="16" class="keshi">
                    <div class="bg_words">{{scope.row.name}}</div>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column prop="mechanismName" label="机构信息">
            <template slot-scope="scope">
              <span>{{scope.row.mechanismName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="原价/元">
            <template slot-scope="scope">
              <span>￥{{currencyFilter(0,0,scope.row.salePrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discountPrice" label="优惠价/元">
            <template slot-scope="scope">
              <span>￥{{currencyFilter(0,0,scope.row.discountPrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payNum" label="报名人数 /人" />
          <el-table-column prop="teacherName" label="授课教师">
            <template slot-scope="scope">
              <span>{{scope.row.teacherName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span>
              <!-- <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="certNo6" label="状态">
            <template slot-scope="scope">
              <p>{{Date.parse(new Date()) < scope.row.courseStartTime ? '未上课': Date.parse(new Date()) < scope.row.courseEndTime ? '上课中':'已上课'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="操作" min-width="100">
            <template slot-scope="scope">
                <!-- <el-button size="small" @click="settingDetail()">查看详情</el-button> -->
                <el-button size="small" type="primary" :disabled='disabled' @click="confirmat(scope.row.id,scope.row.refundTime,0)">确认结算</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- <MyPagination :page="dataList.page" :size="dataList.pageSize" :method='findList' :total="dataList.total"/> -->
    </TablePage>

    <!-- 已结算 -->
     <TablePage v-show="interListState == 2">
        <el-table :data="data.list3" element-loading-text="拼命加载中...">
          <el-table-column prop="courseName" label="课程信息" min-width="150">
              <template slot-scope="scope">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="6">
                    <div class="bg_img">
                        <img :src="scope.row.homeImg" width="100" height="70" alt="">
                    </div>
                  </el-col>
                  <el-col :span="16" class="keshi">
                    <div class="bg_words">{{scope.row.name}}</div>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column prop="mechanismName" label="机构信息">
            <template slot-scope="scope">
              <span>{{scope.row.mechanismName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" label="原价/元">
            <template slot-scope="scope">
              <span>￥{{currencyFilter(0,0,scope.row.salePrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discountPrice" label="优惠价/元">
            <template slot-scope="scope">
              <span>￥{{currencyFilter(0,0,scope.row.discountPrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payNum" label="报名人数 /人" />
          <el-table-column prop="teacherName" label="授课教师">
            <template slot-scope="scope">
              <span>{{scope.row.teacherName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span>
              <!-- <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="certNo6" label="状态">
            <template slot-scope="scope">
              <p>{{Date.parse(new Date()) < scope.row.courseStartTime? '未上课': Date.parse(new Date()) < scope.row.courseEndTime ? '上课中':'已上课'}}</p>
              <!-- <p>{{dateTimeFilter(0,0,scope.row.courseStartTime)}}--{{dateTimeFilter(0,0,scope.row.courseEndTime)}}</p> -->
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="操作">
            <template slot-scope="scope">
                <el-button size="small"  @click="checkSettled(scope.row.id)">查看结算</el-button>
            </template>
          </el-table-column>

        </el-table>
    </TablePage>
    <MyPagination :page="dataList.page" :size="dataList.pageSize" :method='findList' :total="dataList.total"/>

    <!-- 结算中-确认结算按钮弹框 正常结算中的-->
    <el-dialog title="你确定要结算此课程吗" :visible.sync="dialogTableVisible1" :modal="modal" custom-class="activity">
      <div class="dialoging">
          <p class="dia_words">一旦确定结算，此操作不可逆转。系统会将课程交易成功的订单按照签约的分成比例结算给机构和服务商。同时会批量产生课程的分润记录。因此对系统资源消耗极大，请谨慎操作。建议在晚上凌晨以后进行操作。</p>
          <div class="buts">
             <el-button class="codes"  size="small" @click="dialogTableVisible1=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="next()" plain >确认结算</el-button>
          </div>
      </div>
    </el-dialog>

    <!-- 有退款中的订单 -->
    <el-dialog title="抱歉，此课程不能进行结算" :visible.sync="dialogTableVisible2" :modal="modal" custom-class="activity">
        <div class="dialoging">
          <p class="dia_words">此课程存在有纠纷的退款中订单。请先解决退款中订单后再进行结算！</p>
          <div class="buts">
             <el-button class="codes"  size="small" @click="dialogTableVisible2=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="solve()" plain >去解决</el-button>
          </div>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import { timestampFilter, defValFilter02,dateTimeFilter,currencyFilter,detailTimeFilter } from "../../constant/filter.js";
import Breadcrumb from '../../components/Breadcrumb.vue'
import TablePage from '../../components/TablePage.vue'
import MyPagination from '../../components/MyPagination.vue'
import { getBalanceListApi,getConfirmApi } from '../../../src/api/balanceListApi'
export default {
  name: "balanceList",
  components: {Breadcrumb,TablePage,MyPagination},
  data() {
    return {
      courseId: null,
      dialogTableVisible1:false,
      dialogTableVisible2:false,
      center:true,
      modal: false,
      appendToBody:true,
      modalAppendToBody:true,
      disabled:false,
      value: 1, //搜索类型
      type: null, 
      placeholder: "关键词搜索", //搜索框默认文字
      list: [
        { value: 1, label: "课程名称" },
        { value: 2, label: "机构名称" },
      ],
      // 表格
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        start: null,
        end: null,
        type: 1,
        keyWord: null, //搜索框订单号
        list: [
          {}
        ],
        list2: [
          {id:123,
           courseName:"哈哈撒还是打死傲娇扩大基地hadhuihdhdhwfw会价值佛牌我家房屋交付交服务费沙发我怕的",
           certNo:"达内科技",
           certNo2:"7382.00",
           certNo3:"5621.00",
           certNo4:"秦始皇",
           certNo5:"2018年4月22日 19:47:25",
           certNo6:"待上课",
           courseTime:"",
           homeImg:"../../../static/img/beian.png"
          }
        ],

      },
      changeblue: 0, //当前点亮的时间
      showTime: false, //是否显示日期选择框
      value: [], //日期选中后的值
      // 分页
      dataList:{
        page:1,
        pageSize: 10,
        total:0,
      },
      startPage:{
        page:1,
        pageSize: 10,
      },
      // 切换
      interList: [
        { id: 0, name: "待结算" },
        { id: 1, name: "结算中" },
        { id: 2, name: "已结算" }
      ],
      interListState: 0
    };
  },
    created() {
      let usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
      if(!!this.$route.query.tab){
        this.interListState= this.$route.query.tab
        this.changed(this.$route.query.tab)
      }
    },
  methods: {
    dateTimeFilter,
    currencyFilter,
    // 下拉切换
    changeSelect() {
      this.data.type = this.value;
      this.placeholder = [
        "请输入课程名称查询",
        "请输入机构名称查询",
      ][this.value - 1];
    },
    reset() {
      //重置,清空搜索框内的值
      this.data.keyWord = null;
      this.data.start = null;
      this.data.end = null;
      this.value = "";
      this.$router.replace({ query: { ...this.$route.query,page:1} })
      this.findList({page:1})
    },
    search() {
      //搜索按钮
      this.$router.replace({ query: { ...this.$route.query,page:1} })
      this.findList({page:1})
    },
    // tab切换
    changed(index) {
        this.interListState = Number(index);
        //处理tab切换时路由中的参数
        this.$router.replace({ query: { ...this.$route.query,page:1,tab:index} })
        //{page:1}tab切换时 重置 page值
				this.findList({page:1})
    },
    // 分页
    findList(page={}){
        getBalanceListApi({...page,keyType:this.data.type,keyWord:this.data.keyWord,status:this.interListState,courseType:1 }).then(data => {
            this.data.list = data.list
            this.data.list2 = data.list
            this.data.list3 = data.list
            this.dataList.total = data.total
            this.dataList.page = data.pageNum
        });
      },
      // 待结算查看详情
    nosetDetail(){
      this.$router.push({path:'/view/balance/list/nosettled'})
    },
    // 结算中查看详情
    settingDetail(){
      this.$router.push({path:'/view/balance/list/nosettled'})
    },
    // 已结算查看结算
    checkSettled(id){
      this.$router.push({path:'/view/balance/list/settled',query:{id}})
    },
    // 结算中确认结算
    confirmat(id,refundTime,type){
      // console.log(id)
      this.courseId = id
      // console.log(this.courseId)
      this.type = type
      if(refundTime == 0){
          this.dialogTableVisible1 = true;
      }else{
          this.dialogTableVisible2 = true;
      }
    },
    next(){
      getConfirmApi(this.courseId,this.type).then(data => {
        // console.log(this.courseId)
        this.dialogTableVisible1 = false;
        this.dialogTableVisible2 = false;
        this.findList()
      });
    },
    // 去解决按钮
    solve(){
      this.$router.push({path:'/view/order_manager/offlineList'})
    }
  },
};
</script>
<style lang='less' scoped>
.balanceList {
  ul li{
    list-style: none;
  }
  // 搜索
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    .block {
      margin-left: 40px;
      .el-range-separator {
        width: 10%;
      }
      .el-button {
        margin-left: 10px !important;
      }
    }
    .search {
      height: 74px;
      display: flex;
      // align-items: center;
      background-color: #fff;
      padding-left: 30px;
      .el-input {
        width: 250px !important;
      }
    }
  }
  // tab切换
  .kind.interest {
    height: 74px;
    background-color: #ffffff;
    line-height: 72px;
    color: #333333;
    font-size: 18px;
    border-bottom: 1px solid #edf1f5;
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
    h2,
    label {
      padding-left: 29px;
      float: left;
    }
    ul li {
      float: left;
      &:nth-of-type(1) {
        margin-left: 46px;
        margin-right: 43px;
      }
    }
  }
  .interest {
    border-bottom: none;
    margin-bottom: 20px;
    ul li {
      margin-right: 43px;
      &:nth-of-type(1) {
        margin-left: 35px;
      }
    }
  }
  .el-col-6{
    width: 50%;
  }
  // 遮罩层
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
  }

    // 列表
   .table_page{
      margin-top: 20px;
      .el-table_1_column_1  {
         width: 100%;
        .cell{
           .el-col-11{
             text-align: left;
             display: flex;
             flex-direction: column;
             justify-content: center;
           }
        }
      }
      .el-table td .bg_words{
         display: flex;
         padding-left: 10px;
      }
    }
    .keshi {
      display: flex;
      align-items: center;
      .bg_words{
        text-align: left;
      }
    }
}
</style>
<style lang='less'>
  .balanceList{
      .activity.el-dialog{
        top: 15vh;
        width: 400px;
        height: 350px;
        position: relative;
        .el-dialog__header{
          text-align: center;
          font-size: 18px;
          color: #333;
          font-weight:bold;
          margin-bottom: 10px;
          .el-dialog__title{
            font-size: 20px;
          }
        }
        .dia_words{
           text-indent:30px;
        }
        .el-dialog__body{
          padding-top:0;
          // height: 500px;
          //  overflow-y: scroll;
          font-size:16px;
          line-height: 30px;
          .buts{
            position: absolute;
            bottom: 20px;
            height: 68px;
            left: 0;
            background-color: #fff;
            width:100%;
            text-align: center;
            line-height:68px;
            button{
              margin-right:20px;
              width: 114px;
              height: 40px;
              background-color: #ffffff;
              border-radius: 20px;
              border: solid 1px rgba(201, 204, 207, 0.47);
            }
            .xia{
              background-color: #51c5ff;
              color:#fff;
            }
          }
        }
      }
  }

</style>
