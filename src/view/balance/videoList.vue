
<!-- 学训宝后台--视频课程结算管理 -->
<template>
  <div class='content_data balanceVideoList'>
     <Breadcrumb/>
    <!-- 机构教师切换 -->
    <div class="kind interest">
      <ul class="pointerresoures" style="cursor:pointer;">
        <li v-for="(item, index) in interList2" :class="{blue:data.type == item.id}" @click="redBill(item.id)" :key="index">{{item.name}}</li>
      </ul>
    </div>
    <!-- tab切换 -->
    <div class="kind interest">
      <ul class="pointerresoures" style="cursor:pointer;">
        <li v-for="(item,index) in interList" :class="{ blue:data.status == index }" @click="changed(index)" :key="index">{{item.name}}</li>
        <li class='ExportButton'><ExportButton style='margin-top:0px;' :method="exportCashList" text="导出数据"></ExportButton></li>
      </ul>
    </div>
    <!-- 搜索 -->
    <div class="time_search">
      <template>
        <el-select v-model="data.keyType" placeholder="请选择">
          <el-option v-for="(item,index) in list3"  :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </template>
			<div class="search">
				<el-input  :placeholder="placeholder" style="width: 378px;" v-model.trim="data.keyWord"></el-input>
			</div>
			 <div class="block">
         <!-- 时间选择 -->
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
				<el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;"  round @click="search">查询</el-button>
				<el-button  icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"  round  @click="reset">重置</el-button>
			</div>
      
    </div>

    <!-- 列表 -->
    <TablePage>
        <el-table :data="data.list" element-loading-text="拼命加载中...">
          <el-table-column prop="id" label="ID">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="courseName" label="课程信息" min-width="160">
              <template slot-scope="scope">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="6">
                    <div class="bg_img">
                        <img :src="scope.row.homeImg" width="100" height="70" alt="">
                    </div>
                  </el-col>
                  <el-col :span="16" class="keshi">
                    <span class="bg_words">{{scope.row.name}}</span>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column prop="teacherInfo" label="授课教师" min-width="160"  v-if="data.type == 2">
              <template slot-scope="scope">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="6">
                    <div class="bg_img">
                        <img :src="scope.row.teacherPic || '../../../static/img/logo.png'" width="100" height="70" alt="">
                    </div>
                  </el-col>
                  <el-col :span="16" class="keshi">
                    <div class="bg_words">{{scope.row.teacherName}}</div>
                    <div class="stupho">{{scope.row.teacherPhone}}</div>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
            <el-table-column prop="studentInfo" label="学生信息" min-width="160">
              <template slot-scope="scope">
                <el-row type="flex" class="row-bg" justify="space-around">
                  <el-col :span="6">
                    <div class="bg_img">
                        <img :src="scope.row.studentPic || '../../../static/img/logo.png'" width="100" height="70" alt="">
                    </div>
                  </el-col>
                  <el-col :span="16" class="keshi">
                    <div class="bg_words">{{scope.row.studentName}}</div>
                    <div class="stupho">{{scope.row.studentPhone}}</div>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column prop="mechanismName" label="机构信息" v-if="data.type == 1">
            <template slot-scope="scope">
              <span>{{scope.row.mechanismName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payDeviceType" label="设备类型" min-width="80">
            <template slot-scope="scope">
              <span>{{scope.row.payDeviceType ? ['其他','Android', 'IOS'][scope.row.payDeviceType] : '未知'}}</span>
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
          <el-table-column prop="teacherName" label="授课教师" v-if="data.type == 1">
            <template slot-scope="scope">
              <span>{{scope.row.teacherName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payTime" label="付款时间">
            <template slot-scope="scope">
              <span>{{dateTimeFilter(0,0,scope.row.payTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="操作" min-width="100" v-if="data.status == 1">
            <template slot-scope="scope">
                <el-button size="small" type="primary" :disabled='disabled' @click="confirmat(scope.row.id,scope.row.orderId,2)">确认结算</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="操作" min-width="100" v-if="data.status == 2">
            <template slot-scope="scope">
                <el-button size="small" :disabled='disabled' @click="checkConfim(scope.row.id,scope.row.type)">查看结算</el-button>
            </template>
            <!-- <router-link :to="{name:'balanceVideoDetail',query:{id:data.id,type:data.type }}">
              <el-button type="primary" size="small" style="marginLeft:10px">查看结算</el-button>
            </router-link> -->
          </el-table-column>
        </el-table> 
    </TablePage>
      <!-- 分页 -->
    <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10]" :method="findList" :total="data.total"/> 
   
    <!-- 结算中-确认结算按钮弹框 正常结算中的-->
    <el-dialog title="你确定要结算此课程吗" :visible.sync="dialogTableVisible1" :modal="modal" custom-class="activity" :modal-append-to-body="false" top="30vh">
      <div class="dialoging">
          <p class="dia_words">一旦确定结算，此操作不可逆转。系统会将课程交易成功的订单按照签约的分成比例结算给机构和服务商。同时会批量产生课程的分润记录。因此对系统资源消耗极大，请谨慎操作。建议在晚上凌晨以后进行操作。</p>
          <div class="buts">
             <el-button class="codes"  size="small" @click="dialogTableVisible1=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="next()" plain >确认结算</el-button>
          </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  timestampFilter,
  defValFilter02,
  dateTimeFilter,
  currencyFilter,
  detailTimeFilter
} from "../../constant/filter.js";
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import {getVideoLessonListApi,getVideoConfirmApi,getVideoDoneApi,exportVideoListApi} from "../../../src/api/balanceListApi";
import ExportButton from "../../components/ExportButton.vue";
export default {
  name: "balanceVideoList",
  components: { Breadcrumb, TablePage, MyPagination, ExportButton },
  data() {
    return {
      courseId: null,
      dialogTableVisible1: false,
      center: true,
      modal: false,
      appendToBody: true,
      modalAppendToBody: true,
      disabled: false,
      // value: 1,                                        //搜索类型
      placeholder: "关键词搜索",                       //搜索框默认文字
      tiemValue: [],                                  //时间区间选择
      // 大于当前时间不可选
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      list3: [{ value: 1, label: "课程名称" }, { value: 2, label: "机构名称" }],   // 下拉选项
      // list6: [{ value: 1, label: "课程名称" },  { value: 3, label: "授课教师" }],   // 下拉选项
      // 表格
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        start: null,
        end: null,
        keyWord: null, //搜索框订单号
        status: 0,  //0待结算 1结算中 2已结算
        type: 1,   // 1 机构 2教师
        list: [],
        list2: [],
        keyType: null,  // 1课程名称 2.机构名称 3.授课教师
      },
      showTime: false, //是否显示日期选择框
      value: [], //日期选中后的值
      // 分页
      dataList: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      startPage: {
        page: 1,
        pageSize: 10
      },
      interList2: [
        { id: 1, name: "机构" },
        { id: 2, name: "教师" },
      ],
      // 切换
      interList: [
        { id: 0, name: "待结算" },
        { id: 1, name: "结算中" },
        { id: 2, name: "已结算" }
      ],
    };
  },
  created() {
    let usrType =
      window.localStorage.getItem("userInfo") &&
      JSON.parse(window.localStorage.getItem("userInfo")).type;
      this.disabled = usrType ? true : false;
  },
  methods: {
    dateTimeFilter,
    currencyFilter,
    //搜索按钮
    search() {
      this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      this.findList({page:1})
    },
    // 机构 教师切换
    redBill(id){
      if(id==2){
        this.list3=[{ value: 1, label: "课程名称" },  { value: 3, label: "授课教师" }]
      }else{
        this.list3=[{ value: 1, label: "课程名称" }, { value: 2, label: "机构名称" }]
      }
      this.data.type = id
      this.interListState = 0
      this.reset()
    },

     // 待结算 结算中 已结算 tab切换
    changed(index,page) {
      this.data.status = index;
      this.reset()
    },
    

    //重置,清空搜索框内的值
    reset() { 
      this.data.keyWord = null;
      this.data.start = null;
      this.data.end = null;
      this.tiemValue = [];
      this.data.keyType = null;
      this.$router.replace({ query: { ...this.$route.query, page: 1 } });
      this.findList({ page: 1 });
    },

    // 时间选择
    selectTime() {
      // console.log(this.tiemValue,"this.tiemValue")
      this.data.start =this.tiemValue ? Date.parse(this.tiemValue[0]) : null;
      this.data.end = this.tiemValue ? Date.parse(this.tiemValue[1]) : null;
    },
    // 导出功能
    exportCashList({status,start, end,courseType,type,}) {
      return exportVideoListApi({...this.data, status:this.data.status, start, end,courseType,type:this.data.type})
    },
    
    // 查看结算
    checkConfim(id,type){
      this.$router.push({path:'/view/balance/videoDetail',query:{id,type}})
    },
   
    // 分页
    findList(page = {}) {
      // console.log(this.data.keyWord,"this.data.keyWord")
      getVideoLessonListApi({...this.data, ...page}).then((data) => {
        this.data = {...this.data, ...page, ...data, loading: false}
      })
    },
  
    // 结算中确认结算idx
    confirmat(id,orderId,type) {
      this.courseId = id
      this.orderId = orderId
      this.type = type
      // this.id = id
      this.dialogTableVisible1 = true
      
    },
    next() {
      // console.log(this.courseId,"bbb")
      getVideoConfirmApi(this.courseId,this.orderId,this.type).then(data => {
        // console.log(this.id)
        this.dialogTableVisible1 = false;
        this.findList();
      });
    },
  }
};
</script>
<style lang='less' scoped>
.balanceVideoList {
  ul li {
    list-style: none;
  }
  .pointerresoures {
    position: relative;
    .ExportButton {
      position: absolute;
      right: 20px;
    }
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
  .el-col-6 {
    width: 50%;
  }
  // 遮罩层
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
  }

  // 列表
  .table_page {
    margin-top: 20px;
    overflow-x: scroll;
    overflow:auto;
    .el-table_1_column_1 {
      width: 100%;
      .cell {
        .el-col-11 {
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
    .el-table td .bg_words {
      display: flex;
      padding-left: 10px;
    }
  }
  .keshi {
    display: flex;
    align-items: center;
    flex-direction: column;
    .bg_words {
      text-align: left;
    }
  }
}
</style>
<style lang='less'>
.balanceVideoList {
  .activity.el-dialog {
    width: 400px;
    height: 350px;
    position: relative;
    .el-dialog__header {
      text-align: center;
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-bottom: 10px;
      .el-dialog__title{
        font-size: 20px;
      }
    }
    .dia_words {
      text-indent: 30px;
    }
    .el-dialog__body {
      padding-top: 0;
      // height: 500px;
      //  overflow-y: scroll;
      font-size:16px;
      line-height: 30px;
      .buts {
        position: absolute;
        bottom: 20px;
        height: 68px;
        left: 0;
        background-color: #fff;
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
}
</style>

