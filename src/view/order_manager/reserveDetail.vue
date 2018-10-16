<template>
  <div class="content_data reserveDetail">
    <div class="title_common">{{type==0?'待付款':type==1?'已付款':type==2?'退款中':type==3?'已退款':type==4?'已取消':'已评价'}}订单详情
    </div>
    <div class="list_content">
      <div class="list_title">
        <p>{{type==0?'待付款':type==1?'已付款':type==2?'退款中':type==3?'已退款':type==4?'已取消':'已评价'}}</p>
        <p>订单状态：{{type==0?'待付款':type==1?'已付款':type==2?'退款中':type==3?'已退款':type==4?'已取消':'已评价'}}</p>
      </div>
      <div class="noMsg">
        <p>订单信息</p>
        <p>订单号:{{list.orderNumber}}</p>
      </div>
      <TablePage >
        <el-table :data="pageOption" class="table-list">
          <el-table-column label="预约教师" min-width="150">
            <template slot-scope="scope">
              <p class="list-img"><img :src="scope.row.teacherImg || '../../../static/img/11.png'"/></p>
              <div class="list">
                <p>{{scope.row.teacherName }}</p>
                <p v-if="type==0 ||type==1 || type==4 ">{{scope.row.costPrice/scope.row.allTime}}元/课时</p>
                <p v-if="type==2 ||type==3">{{scope.row.costPrice/hour((scope.row.allTime).split('-')[0],(scope.row.allTime).split('-')[1])}}元/课时</p>
                <p>{{scope.row.teacherPhone}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="是否拼课">
            <template slot-scope="scope">
              <p>{{['未知','否','是'][$route.query.type]}}</p>
            </template>
          </el-table-column>
          <el-table-column label="总课时">
            <template slot-scope="scope">
              <p v-if="type==0 ||type==1 || type==4 ">{{scope.row.allTime}}课时</p>
              <p v-if="type==2 ||type==3">{{hour((scope.row.allTime).split('-')[0],(scope.row.allTime).split('-')[1])}}课时</p>
              <!-- <p>{{scope.row.allTime}}课时</p> -->
            </template>
          </el-table-column>
          <el-table-column label="原价/元"  prop="costPrice">
             <template slot-scope="scope">
              <p>{{scope.row.costPrice?scope.row.costPrice.toFixed(2):0}}</p>
            </template>
          </el-table-column>
          <el-table-column label="优惠价/元">
            <template slot-scope="scope">
              <p>{{scope.row.totalPrice?scope.row.totalPrice.toFixed(2):0}}</p>
            </template>
          </el-table-column>
          <el-table-column label="实付金额/元"  prop="totalPrice">
            <template slot-scope="scope">
              <p>{{scope.row.totalPrice?scope.row.totalPrice.toFixed(2):0}}</p>
            </template>
          </el-table-column>
          <el-table-column label="补贴金额/元">
            <template slot-scope="scope">
                <p>{{(scope.row.costPrice-scope.row.totalPrice).toFixed(2)}}</p>
            </template>
          </el-table-column>
          <el-table-column label="付款方式"  prop="payType">
            <template slot-scope="scope">
                <p>{{scope.row.payType==1?'微信':scope.row.payType==2?'支付宝':scope.row.payType==3?'余额支付':'其他'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="第三方交易单号"  prop="thirdNumber">
            <template slot-scope="scope">
                <p>{{scope.row.thirdNumber|| '-------'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="支付时间"  prop="payTime" :formatter="detailTimeFilter" min-width="120"></el-table-column>
        </el-table>
      </TablePage>
    </div>
    <div class="courseMessage" v-show="type==3?false:true">
      <p>课程信息</p>
      <ul class="course-message message"><li v-for="(res,index) in time" :key="index" @click="messageColour(res,index)" :class="{'messageColo':messageClo==index}" ><span>{{res}}</span></li></ul>
      <div class="course-time">
        <ul class="course-message message2">
          <li
            v-for="(rea,index) in times"
            :key="index"
            :class="{'currentTimeIndex':currentTimeIndex==index}"
            @click="showStudents(rea.time,index)">
            <span>{{rea.time}}</span>
            <p>设置拼课人数：{{rea.count}}人</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="reimburse" v-show="type==3?true:false">
      <p>退款单号:{{list.orderNumber}}</p>
      <p>退款时间段:{{detailTimeFilter(0,0,Math.abs(list.dtoList[0].courseTime.split('-')[0]))}}--{{detailTimeFilter(0,0,Math.abs(list.dtoList[0].courseTime.split('-')[1]))}}</p>
      <p>退款原因:{{list.reason }}</p>
    </div>
    <div class="studentMessage">
      <p>学员信息</p>
      <!-- 订单为已付款时 -->
      <div v-if="orderType == 1" v-for="(item,index) in studentList" :key="index">
        <div class="student-message">
          <!-- studentImg  -->
          <p class="student1"><img :src="item.pic||'../../../static/img/11.png'"/></p>
          <div class="student2">
            <p>
              <span>{{item.name}}</span>
              <span v-if="item.sex==2">
                <img src="../../../static/img/nv.png"/>
              </span>
              <span v-else-if="item.sex==1">
                <img src="../../../static/img/nan.png"/>
              </span>
            </p>
            <p>{{item.phone}}</p>
          </div>
          <div class="student3">
            <p>{{item.school}}</p>
            <p>{{item.grade }}</p>
          </div>
        </div>
      </div>
      <!-- 订单不为已付款时 -->
      <div v-if="orderType != 1" class="student-message">
        <!-- studentImg  -->
        <p class="student1"><img :src="list.studentImg||'../../../static/img/11.png'"/></p>
        <div class="student2">
          <p>
            <span>{{list.studentName}}</span>
            <span v-if="list.sex==2">
              <img src="../../../static/img/nv.png"/>
            </span>
            <span v-else-if="list.sex==1">
              <img src="../../../static/img/nan.png"/>
            </span>
          </p>
          <p>{{list.studentPhone}}</p>
        </div>
        <div class="student3">
          <p>{{list.studentSchool}}</p>
          <p>{{list.studentGrade }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TablePage from '../../components/TablePage.vue'
import {postOrderMApi} from '../../api/orderApi.js'
import {hour,detailTimeFilter,datenTimeFilter} from '../../constant/filter.js'
import moment from 'moment'
export default {
  name:'reserveDetail' ,
  components:{TablePage},
    data(){
      return{
        orderType: null,
        currentTimeIndex: 0,
        dtoList: [],
        studentList: [],
        currentTime: '',
        disabled: false,
        id:"",
        type:null,
        refundId :null,
        messageClo:0,
        tiemst:'',
        timeent:'',
        list:{courseTime:''},
        time:[],
        times:[],
        pageOption:[
          {allTime:''}
        ],
        arr5:[],
        listr:[{
          name:'2018-04-28',
          list:['11:30-12:30']
        },{
          name:'2018-04-29',
          list:['11:30-12:30','11:40-12:40']
        },{
          name:'2018-04-30',
          list:['11:30-12:30','11:40-12:40','11:40-12:40']
        },{
          name:'2018-04-31',
          list:['11:30-12:30','11:40-12:40','11:40-12:40','11:40-12:40']
        },{
          name:'2018-05-01',
          list:['11:30-12:30','11:40-12:40','11:40-12:40','11:40-12:40','11:40-12:40']
        }]
      }
    },
    created(){
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
      this.id = this.$route.query.id
      this.type = this.$route.query.tab;
      this.orderType = this.$route.query.tab;
      if(this.type==2 || this.type==3){
         this.refundId =  this.$route.query.refundId*1
      }
      this.init()
    },
    methods:{
      hour,
      detailTimeFilter,
      datenTimeFilter,
      unique(arr){
        var temp = [];
        for(var i = 0; i < arr.length; i++){
            if(temp.indexOf(arr[i]) == -1){
                temp.push(arr[i]);
            }
        }
        return temp;
      },
      messageColour(item1,index){
        this.currentTimeIndex = 0
        this.messageClo=index

        let arr = []
        this.arr5.forEach(element => {
          if(this.time[index]==element.name){
            arr = element.list
          }
        });

        let arr7 = []
        arr.forEach((item,index)=>{
          let obj = {}
          let time1 = item1 + ' ' + item.split('-')[0]
          let time2 = item1 + ' ' + item.split('-')[1]
          let currentTime = Date.parse(time1) + '-' + Date.parse(time2)
          obj.time = item
          this.dtoList.forEach((ele,i)=> {
            if(ele.courseTime == currentTime){
              obj.count = ele.count + ele.studentDtoList.length
            }
          })
          arr7.push(obj)
        })
        this.times = arr7
      },
      showStudents(rea,index){
        this.currentTimeIndex = index
        let time1 = this.time[this.messageClo] + ' ' + rea.split('-')[0]
        let time2 = this.time[this.messageClo] + ' ' + rea.split('-')[1]
        this.currentTime = Date.parse(time1) + '-' + Date.parse(time2)

        this.dtoList.forEach((item,index)=> {
          if(item.courseTime == this.currentTime){
            this.studentList = item.studentDtoList
          }
        })
      },
      init(){
        postOrderMApi({id:this.id,status:this.type*1,refundId:this.refundId}).then(data=>{
          this.studentList = data.dtoList && data.dtoList.length && data.dtoList[0].studentDtoList ? data.dtoList[0].studentDtoList : []
          let arr = []
          data.dtoList.forEach((item,index)=>{
            arr.push(item.courseTime)
          })
          this.dtoList = data.dtoList
          let arr2 = [],
          arr3 = [],          // 日期数据池
          arr4 = [],
          arr5 = [],
          arr6 = []

        arr.forEach((item,index)=>{
          arr4.push(moment(Number(item.split('-')[0])).format('YYYY-MM-DD HH:mm')+'*'+moment(Number(item.split('-')[1])).format('YYYY-MM-DD HH:mm'))
          item.split('-').forEach((ele,i)=>{
            arr2.push(ele)
          })
        })

        arr2.forEach((item,index)=>{
          arr3.push(moment(Number(item)).format('YYYY-MM-DD'))
        })

        arr3 = this.unique(arr3)

        arr4.forEach((item,index)=>{
          let arr0 = [], obj = {}
          arr3.forEach((ele,i)=>{
            if(ele == item.split('*')[0].substring(0,10)){
              obj.list = item.split('*')[0].split(' ')[1] + '-' + item.split('*')[1].split(' ')[1]
              obj.name = ele
            }
          })
          arr5.push(obj)
        })

        arr5 = arr5.reduce(function(v, k) {
          var filters = v.filter(function(data) {
            return data.name === k.name
          });
          if(filters.length === 0) {
            v.push({
              name: k.name,
              list: [k.list]
            })
          }else{
            filters[0].list.push(k.list)
          };
          return v
        }, [])

          this.pageOption=[data]
          this.list=data
          this.arr5=arr5
          this.arr5.forEach(element => {
            this.time.push(element.name)
          });

          let arr7 = []
          this.arr5[0].list.forEach((item,index)=>{
            let obj = {}
            let time1 = this.arr5[0].name + ' ' + item.split('-')[0]
            let time2 = this.arr5[0].name + ' ' + item.split('-')[1]
            let currentTime = Date.parse(time1) + '-' + Date.parse(time2)
            obj.time = item
            this.dtoList.forEach((ele,i)=> {
              if(ele.courseTime == currentTime){
                obj.count = ele.count + ele.studentDtoList.length
              }
            })
            arr7.push(obj)
          })

          // this.times=this.arr5[0].list
          this.times = arr7

        })
      }

    }
}
</script>

<style lang="less" scoped>
.reserveDetail{
  .title_common{
    line-height: 70px;
    border-left:3px solid #4db8fc;
    height: 70px;
    background-color: #fff;
    text-indent: 20px;
    margin-bottom: 20px;
    font-size:20px;
  }
  .list_content{
    background: #fff;
    .list_title{
      height: 100px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 30px;
      border-bottom:1px solid #edf1f5;
      p:first-child{
        width: 70px;
        height: 70px;
        border:5px solid #dcf1fc;
        background: #4ebbf2;
        border-radius: 50%;
        line-height: 60px;
        font-size: 16px;
        color: #fff;
        text-align: center;
      }
      p:nth-child(2) {
        font-size: 16px;
        color: #333;
        margin-left: 11px;
      }
    }
    .noMsg{
      height:116px;
      padding-left: 30px;
      p:first-child{
        margin-top: 40px;
        font-size: 18px;
        color: #333;
        margin-bottom: 29px;
      }
       p:nth-child(2){
         font-size: 14px;
         color: #666;
       }
    }
    .table-list{
      .list-img{
        width: 80px;
        height: 80px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .list{
        margin-left: 20px;
        p{
          font-size: 16px;
          color: #666;
          margin-bottom: 18px;
          text-align: left;
        }
        p:first-child{
          color: #333;
        }
         p:last-child{
           margin-bottom: 0;
         }
      }
    }
  }
  .courseMessage{
    background: #fff;
    margin-top:20px;
    p{
      line-height: 62px;
      padding-left: 30px;
      font-size: 18px;
      color: #333;
    }
    .course-message{
      width: 100%;
      display: inline-block;
      li{
        float: left;
        width: 14.28%;
        text-align: center;
      }
    }
    .message{
      height: 64px;
      background: #f9fafb;
      li{
        line-height: 64px;
        cursor: pointer;
        span{
          display: inline-block;
          height: 64px;
        }
      }
      .messageColo{
        span{
          border-bottom:2px solid #4ebbf2;
          color: #4ebbf2;
        }
      }
    }
    .course-time{
      background: #fff;
      padding: 34px 0 14px 0;
      .message2{
        li{
          float: left;
          span{
            display: inline-block;
            width: 125px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-bottom: 5px;
            border:1px solid #e5e5e5;
            cursor: pointer;
          }
          p{
            margin: 0;
            padding: 0;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
    .currentTimeIndex
      span{
        border-color: #4ebbf2!important;
        color: #4ebbf2!important;
      }
  }
  .studentMessage{
    background: #fff;
    margin-top:20px;
    p{
      line-height: 62px;
      padding-left: 30px;
      font-size: 18px;
      color: #333;
    }
    .student-message{
      display: flex;
      height: 114px;
      align-items:center;
      .student1{
        width: 110px;
        height: 80px;
        margin-left: 30px;
        margin-right: 46px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .student2,.student3{
        p{
          padding-left: 0;
          line-height: 16px;
          margin-bottom: 17px;
        }
        p:last-child{
          margin-bottom: 0;
        }
      }
      .student2{
        margin-right: 84px;
        p:nth-child(1){
          span:nth-child(1){
            margin-right: 11px;
          }
        }
      }
    }
  }
  .reimburse{
    background: #fff;
    margin-top: 20px;
    padding:20px 0 20px 30px;
    p{
      line-height: 40px;
    }
  }
}
</style>
<style lang="less">
.reserveDetail{
  .cell{
    display:flex;
    align-items:center;
    justify-content: center;
    padding:20px 0;
  }
}
</style>
