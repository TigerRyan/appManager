<!-- 提高课时费申请 -->
<template>
  <div class='raiseLessonFee'>
    <Breadcrumb/>
    <!-- 列表状态 -->
    <ul class="content_data_title">
      <li v-for="(item, index) in tearcherList" :class="{blue: changemenu == index}" @click="changeTitle(index)" :key="index">{{item.name}}</li>
      <li class="export"><ExportButton text="导出数据" :method="exportCheckList"/></li>
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
        <el-input  placeholder="请输入关键字查询..." style="width: 260px;" v-model.trim="data.keyWord" @keydown.enter.native="search"/>
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

    <div class="table_select">
         <!-- 表格 -->
      <el-checkbox-group @change="handleSelectionChange" v-model="checkedList">
        <el-table 
          :data="data.list" 
          :select-on-indeterminate="true"
          v-loading="data.loading" 
          element-loading-text="拼命加载中..."
          ref="multipleTable"
          >
          <el-table-column prop="id" label="ID" min-width="80" align="center">
            <template slot-scope="scope">
              <span v-if="changemenu == 1 || changemenu == 2">{{scope.row.id}}</span>
              <el-checkbox :label="scope.row.id" v-if="changemenu == 0">{{scope.row.id}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="serialNumber" label="申请系列号" min-width="80" align="center" :formatter="defValFilter01" />
          <el-table-column prop="pic" label="教师头像" min-width="80" align="center">
            <template slot-scope="scope">
              <HeadImg :src="scope.row.pic || '../../../static/img/logo.png'"/>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="教师名称" min-width="80" align="center" :formatter="defValFilter01" />
          <el-table-column prop="phone" label="手机号码" min-width="110" align="center" :formatter="defValFilter01" />
          <el-table-column prop="type" label="调整类型" min-width="110" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.type == 1 ? '提高': '降低'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="originalPayMoney" label="课时费(元)" v-if="changemenu ==0 || changemenu ==2"  min-width="80" align="center" :formatter="currencyFilter"/>
          <el-table-column prop="originalPayMoney" label="原有课时费(元)" v-if="changemenu==1"  min-width="80" align="center" :formatter="currencyFilter"/>
          <el-table-column prop="currentPayMoney" label="现有课时费(元)" v-if="changemenu==1" min-width="80" align="center" :formatter="currencyFilter"/>
          <el-table-column prop="createTime" label="申请时间" :formatter="detailTimeFilter" min-width="140" align="center"/>
          <el-table-column prop="status" label="审核状态"  min-width="90" align="center">
            <template slot-scope="scope">
              <div>{{changemenu==0?'待审核':changemenu==1?'已通过':'已拒绝'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200"  align="center">
            <template slot-scope="scope">
              <el-button v-if="changemenu == 0" type="edit" size="middle" @click="setHanddle(scope.row.id,2,scope.row.teacherId)" :disabled="disabled">通过</el-button>
              <el-button v-if="changemenu == 0" type="del" size="middle" @click="cancleHandle(scope.row.id,3)" :disabled="disabled">拒绝</el-button>
              <el-button type="edit" size="middle" @click="$router.push({name: 'teacherDetails', query: {id:scope.row.teacherId}})">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
      
      <!-- 通过按钮框 -->
      <el-dialog title="" :visible.sync="dialogTableVisible1" :modal="modal" custom-class="activity" :modal-append-to-body="false" top="30vh">
        <div class="dialoging">
            <p class="dia_words">你已审核通过该教师的调整课时费申请，请到教师详情进行课时费调整</p>
            <div class="buts">
              <el-button class="codes"  size="small" @click="dialogTableVisible1=false" plain>取消</el-button>
              <el-button class="xia"  size="small" @click="next($router.push({name: 'teacherDetails', query: {id:teacherId}}))" plain>前往调整</el-button>
            </div>
        </div>
      </el-dialog>

      <!-- 拒绝按钮框 -->
      <el-dialog title="" :visible.sync="dialogTableVisible2" :modal="modal" custom-class="activity" :modal-append-to-body="false" top="30vh">
        <div class="dialoging">
          <p class="dia_words">你已审核拒绝该教师的调整课时费申请，请确认该操作</p>
          <div class="buts">
             <el-button class="codes"  size="small" @click="dialogTableVisible2=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="solve()" plain >确认</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 全选 -->
      <div class="btn" v-if="changemenu == 0">
        <el-checkbox 
          :disabled="disabled"
          v-model="checked" 
          class="check" 
          @change="changeCheckBox"
        >全选</el-checkbox>
        <el-select v-model="value3" placeholder="批量操作" class="select" @change="selectAll">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
   
      <!--分页-->
    <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10]" :method="findList" :total="data.total"/> 
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import { confirm, success, error, info } from "../../actions";
import ExportButton from "../../components/ExportButton.vue";
import { getLessonListApi,exportLessonListApi,getPassReApi } from '../../../src/api/raiseLessonApi'
import {
  dateTimeFilter,
  detailTimeFilter,
  defValFilter01,
  defValFilter02,
  openStatusFilter,
  currencyFilter
} from "../../constant/filter";
import HeadImg from "../../components/HeadImg.vue";
import MyPagination from "../../components/MyPagination.vue";
export default {
  name: "raiseLessonFee",
  components: {
    Breadcrumb,
    ExportButton,
    MyPagination,
    HeadImg
  },
  data() {
    return {
      options: [{ value: 2, label: "通过" }, { value: 3, label: "拒绝" }],
      disabled: false,
      value: "",                            //搜索下拉框选中的当前条件
      changemenu: 0,
      checkedList: [],                      // 被选中项
      value3: "",                           // 批量操作下拉框值
      checked: false,                       // 是否全选
      dialogTableVisible1: false,            // 通过弹出框
      dialogTableVisible2: false,            // 拒绝弹出框
      modal: true,                           // 遮罩层
      teacherId:null,
      tearcherList: [
        { status: 1, name: "待审核" },
        { status: 2, name: "已通过" },
        { status: 3, name: "已拒绝" }
      ],
      seacheList: [
        { value: 1, label: "教师名称" },
        { value: 2, label: "手机号码" },
        { value: 3, label: "申请系列号" }
      ],
      data: {
        page: 1,
        pageSize: 10,
        list: [],
        total: 0,
        status: 1,
        keyType: null,
        keyWord: null,
        loading: false,
        start: null,
        end: null
      },
      //  选中的时间
      value1: [],
      // 设置大于当前时间不可选
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },

  created() {
    // 设置当前指定列表的列表为待审核
    this.tearcherList.status = 0;
  },

  methods: {
    dateTimeFilter, // 初始化时间
    defValFilter01, // 初始化为无
    defValFilter02, // 初始化为无
    openStatusFilter,
    detailTimeFilter,
    currencyFilter,
    // tab切换
    changeTitle(index, page) {
      this.data.keyWord = "";
      this.value = null;
      let pageNum = page ? page : 1;
      const idx = Number(index);
      this.changemenu = idx;
      // console.log(this.changemenu);
      this.data.status = idx + 1;
      this.$router.replace({
        query: { ...this.$route.query, page: pageNum, tab: idx }
      });
      this.findList({page:1});
    },
    // 导出
    exportCheckList({start, end}) {
      return exportLessonListApi({...this.data,start, end })
    },
    // 获取数据
    findList(page = {}) {
      this.data.loading = true
      getLessonListApi({...this.data, ...page}).then((data) => {
        // console.log(data)
        this.data = {...this.data, ...page, ...data, loading: false}
      })
    },
    // 设置搜索时间
    selectTime() {
      this.data.start = Date.parse(this.value1[0])
      this.data.end = Date.parse(this.value1[1])
    },
    // 选中当前搜索条件
    changeSelect(value) {
      this.data.keyType = value;
    },
    // 搜索按钮
    search(page) {
      this.$router.replace({ query: { ...this.$route.query,page:1} })
      this.findList({page:1})
    },

    // 重置
    reset() {
      // this.$router.replace({ query: { ...this.$route.query,page:1} })
      this.value = null;
      this.data.keyWord = null;
      this.data.type = null
      this.data.start = null
      this.data.end = null
      this.value1 = []
      this.findList({page:1})
    },

    // 通过
    setHanddle(ids,status,teacherId) {
      this.dialogTableVisible1 = true 
      this.ids = ids
      this.status = status
      this.teacherId = teacherId
      getPassReApi({ids,status}).then(data => {
        this.findList()
      });
     
    },
    //前往调整按钮
    next(){
      
    },

    // 拒绝
    cancleHandle(id) {
      this.id = id
      this.dialogTableVisible2 = true
    },

    // 拒绝--确认按钮
    solve(){
      getPassReApi({ids:this.id,status:3}).then(data => {
        this.findList()
        this.dialogTableVisible2 = false
      });
    },
    
    // 切换全选按钮
    changeCheckBox(val) {
      let arr = [];
      this.data.list.forEach(item => {
        arr.push(item.id);
      });
      this.checkedList = val ? arr : [];
    },

    // 监听checkbox-group选中项变化
    handleSelectionChange(value) {
      // console.log(value)
      let checkedCount = value.length;
      this.checked = checkedCount === this.data.list.length;
    },

    // 批量操作， 通过 or 拒绝
    selectAll(val) {
      if (!this.checkedList.length) {
        info("没有选中项！");
        setTimeout(() => {
          this.value = "";
        }, 1000);
        return;
      } else {
        // console.log(this.checkedList,val)
        getPassReApi({ ids: this.checkedList.join(","),
          status: val}).then(data =>{
           this.findList()
           this.value3 = null
        });
       setTimeout(() => {
          this.checkedList = [];
          this.checked = false;
          this.value = "";
        }, 1000);
      }
    }
  },

  watch: {
    data: function(val, oldVal) {
      this.checked = false;
      this.checkedList = [];
    }
  }
};
</script>
<style lang='less' scoped>
.raiseLessonFee {
  // 切换列表状态栏
  .content_data_title {
    height: 70px;
    line-height: 70px;
    background-color: #fff;
    margin-bottom: 20px;
    padding-left: 30px;
    font-size: 20px;
    position: relative;
    li {
      float: left;
      margin: 0 17px;
      color: #495869;
      cursor: pointer;
    }
    li:first-child {
      margin-left: 0;
    }
    // 同行导出
    .export {
      position: absolute;
      right: 0;
      .ExportButton {
        margin: 0 20px !important;
      }
    }
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
  }
  // 搜索栏
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
  }
  .search {
    height: 74px;
    display: flex;
    align-items: center;
    background-color: #fff;
  }

  .table_select {
    position: relative;
    .btn {
      position: absolute;
      left: 20px;
      bottom: -59px;
      margin-bottom: 10px;
      .select {
        width: 120px;
        margin: 0 20px;
      }
      .check {
        line-height: 40px;
      }
    }
  }

  .el-pagination {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
<style lang='less'>
  .raiseLessonFee{
    .activity.el-dialog{
        width: 400px;
        height: 300px;
        position: relative;
        .el-dialog__header{
          text-align: center;
          font-size: 18px;
          color: #333;
          font-weight:bold;
        }
        .dia_words{
           text-indent:39px;
           font-size: 20px;
           font-weight: 700;
           line-height: 40px;
           padding-top: 15px;
        }
        .el-dialog__body{
          padding-top:0;
          // height: 500px;
          //  overflow-y: scroll;
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
