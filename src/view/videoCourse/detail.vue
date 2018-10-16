<template>
  <div class="content_data videoOrderDetail">
    <div class="title_common">订单详情
    </div>
    <div class="list_content">
      <div class="list_title">
        <p>{{fixOrder[data.orderStatus] }}</p>
        <p>订单状态：{{fixOrder[data.orderStatus] }}</p>
      </div>
      <div v-show="false" class="noMsg">
        <p>订单信息</p>
        <p>订单号:{{data.orderNo}}</p>
      </div>
      <TablePage>
        <el-table :data="datalist" class="table-list">
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="订单编号" prop="orderNo"></el-table-column>
          <el-table-column label="课程介绍" min-width="210">
            <template slot-scope="scope">
              <p class="list-img lesson"><img :src="scope.row.homeImg  || '../../../static/img/11.png'" /></p>
              <div class="list lesson">
                <p>{{scope.row.videoTopicName }}</p>
                <p>教学科目:
                  <span>{{gradeCourseFilter(0,0,scope.row.videoSubject,eduItemMap)}}</span>
                </p>
                <p>创建时间:
                  <span>{{dateFilter(0,0,scope.row.videoCreateTime )}}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="授课老师" class="lecturer" width="150">
            <template slot-scope="scope">
              <p class="list-img"><img :src="scope.row.teacherPic" onerror="this.src='/static/img/11.png'" /></p>
              <div class="list">
                <p>{{scope.row.teacherName }}</p>
                <p>{{scope.row.teacherPhone}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总章节" width="90">
            <template slot-scope="scope">
              <p>{{scope.row.videoCourseNum }}</p>
            </template>
          </el-table-column>
          <el-table-column label="原价/元" prop="costPrice">
            <template slot-scope="scope">
              <p>{{scope.row.salePrice?scope.row.salePrice.toFixed(2):0}}</p>
            </template>
          </el-table-column>
          <el-table-column label="优惠价/元">
            <template slot-scope="scope">
              <p>{{scope.row.discountPrice?scope.row.discountPrice.toFixed(2):0}}</p>
            </template>
          </el-table-column>
          <el-table-column label="实付金额/元" width="160" prop="amount ">
            <template slot-scope="scope">
              <p>{{scope.row.amount?scope.row.amount.toFixed(2):0}}</p>
              <p class="payType">{{scope.row.payType==1?'微信':scope.row.payType==2?'支付宝':scope.row.payType==3?'余额支付':'其他'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="createTime" :formatter="detailTimeFilter" width="100"></el-table-column>
          <el-table-column v-if="data.orderStatus ===1" label="付款时间" prop="payTime" :formatter="detailTimeFilter" width="100"></el-table-column>
          <el-table-column v-if="data.orderStatus ===2" label="取消时间" prop="expiredTime" :formatter="detailTimeFilter" width="100"></el-table-column>
          <el-table-column v-if="data.orderStatus ===1" label="交易单号" prop="thirdOrderNo" width="158">
            <template slot-scope="scope">
              <p>{{scope.row.thirdOrderNo || '-------'}}</p>
            </template>
          </el-table-column>
        </el-table>
      </TablePage>
    </div>
    <div v-if="type===1" class="studentMessage">
      <p class="weight">机构信息</p>
      <!-- 订单为已付款时 -->
      <div >
        <div class="student-message">
          <!-- studentImg  -->
          <p class="student1"><img :src="data.logo" onerror="this.src='/static/img/11.png'" /></p>
          <div class="student2">
            <p>机构名称&nbsp;:&nbsp;{{data.mechanismName || '未知'}}</p>
            <p>机构行业&nbsp;:&nbsp;{{data.industry|| '未知'}}</p>
            <!-- <p>机构行业&nbsp;:&nbsp;{{classMap.length > 0 ?classMap.join(','):'未知'}}</p> -->
          </div>
          <div class="student2">
            <p>城市&nbsp;:&nbsp;{{data.addressInfo || '未知'}}</p>
          </div>
          <div class="student3">
            <p>负责人&nbsp;:&nbsp;{{data.leaderName || '未知'}}</p>
            <p>账号&nbsp;:&nbsp;{{data.mechanismAccount || '未知' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="studentMessage">
      <p class="weight">学员信息</p>
      <!-- 订单为已付款时 -->
      <div>
        <div class="student-message">
          <!-- studentImg  -->
          <p class="student1"><img :src="data.studentPic" onerror="this.src='/static/img/11.png'" /></p>
          <div class="student2">
            <p>学员姓名&nbsp;:&nbsp;{{data.studentName || '未知'}}</p>
            <p>学员年级&nbsp;:&nbsp;{{gradeCourseFilter(0,0,data.studentGrade,eduItemMap)}}</p>
          </div>
          <div class="student3">
            <p>联系电话&nbsp;:&nbsp;{{data.studentPhone || '未知'}}</p>
            <p>学员学校&nbsp;:&nbsp;{{data.school || '未知' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TablePage from '../../components/TablePage.vue'
import { findVideoOrderInfoApi } from '../../api/videoCourseOrderApi.js'
import {getIndustry,getEduItemApi} from '../../api/baseApi'
import { detailTimeFilter, dateFilter,gradeCourseFilter} from '../../constant/filter.js'
import moment from 'moment'
export default {
  name: 'videoOrderDetail',
  components: { TablePage },
  data() {
    return {
      orderId: parseInt(this.$route.query.id),            // 路由获取的id
      type: parseInt(this.$route.query.type),             // 路由获取的type 1：机构订单 2：教师订单
    datalist: [],                               // 同data，获取的详情数据
    data: {},                                   // 获取的详情数据
    fixOrder: ['待付款', '已付款', '已取消'],     // 订单状态  待付款(0), 已付款(1), 已取消(2)
    classMap:[] ,                                // 机构行业数组
    eduItemMap: []
    }
  },
  created() {
    getEduItemApi().then(
        data =>{
            this.eduItemMap = data
            findVideoOrderInfoApi(this.orderId, this.type).then(
                res => {
                    this.data = res
                    this.datalist.push(res)
                    if(res.subjectIds){
                        this.getIndustrys(res.subjectIds)
                    }else{
                        this.classMap =['未知']
                    }
                }
                ).catch(
                error => {
                }
                )
        }
    )
    
  },
  methods: {
    detailTimeFilter,
    dateFilter,
    gradeCourseFilter,
    getIndustrys(ids){
    var classList = ids.split(',')
    for(let i=0;i<classList.length;i++){
    getIndustry(classList[i]).then(res=>{
      res.name && this.classMap.push(res.name)
    })
  }
    },
  }
}
</script>

<style lang="less" scoped>
.videoOrderDetail {
    .title_common {
        line-height: 70px;
        border-left: 3px solid #4db8fc;
        height: 70px;
        background-color: #fff;
        text-indent: 20px;
        margin-bottom: 20px;
        font-size: 20px;
    }
    .list_content {
        background: #fff;
        .list_title {
            height: 100px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 30px;
            border-bottom: 1px solid #edf1f5;
            p:first-child {
                width: 70px;
                height: 70px;
                border: 5px solid #dcf1fc;
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
        .noMsg {
            height: 116px;
            padding-left: 30px;
            p:first-child {
                margin-top: 40px;
                font-size: 18px;
                color: #333;
                margin-bottom: 29px;
            }
            p:nth-child(2) {
                font-size: 14px;
                color: #666;
            }
        }
        .table-list {
            .payType {
                border: 1px solid #4ebbf2;
                border-radius: 13px;
                width: 87px;
                margin: 0 auto;
            }
            .list-img {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .list {
                p {
                    font-size: 16px;
                    color: #666;
                    margin: 5px auto;
                    text-align: center;
                }
                p:first-child {
                    color: #333;
                }
                p:last-child {
                    margin: 0;
                }
            }

            .lesson {
                display: inline-block;
                margin: 0;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                    margin-right: 5px;
                }
            }
        }
    }
    .courseMessage {
        background: #fff;
        margin-top: 20px;
        p {
            line-height: 62px;
            padding-left: 30px;
            font-size: 18px;
            color: #333;
        }
        .course-message {
            width: 100%;
            display: inline-block;
            li {
                float: left;
                width: 14.28%;
                text-align: center;
            }
        }
        .message {
            height: 64px;
            background: #f9fafb;
            li {
                line-height: 64px;
                cursor: pointer;
                span {
                    display: inline-block;
                    height: 64px;
                }
            }
            .messageColo {
                span {
                    border-bottom: 2px solid #4ebbf2;
                    color: #4ebbf2;
                }
            }
        }
        .course-time {
            background: #fff;
            padding: 34px 0 14px 0;
            .message2 {
                li {
                    float: left;
                    span {
                        display: inline-block;
                        width: 125px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        margin-bottom: 5px;
                        border: 1px solid #e5e5e5;
                        cursor: pointer;
                    }
                    p {
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
        .currentTimeIndex span {
            border-color: #4ebbf2 !important;
            color: #4ebbf2 !important;
        }
    }
    .studentMessage {
        background: #fff;
        margin-top: 20px;
        p {
            line-height: 62px;
            padding-left: 30px;
            font-size: 18px;
            color: #333;
        }
        .student-message {
            display: flex;
            height: 114px;
            align-items: center;
            .student1 {
                width: 110px;
                height: 80px;
                margin-left: 30px;
                margin-right: 46px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .student2,
            .student3 {
                p {
                    padding-left: 0;
                    line-height: 16px;
                    margin-bottom: 17px;
                }
                p:last-child {
                    margin-bottom: 0;
                }
            }
            .student2 {
                margin-right: 84px;
                p:nth-child(1) {
                    span:nth-child(1) {
                        margin-right: 11px;
                    }
                }
            }
        }
    }
    .reimburse {
        background: #fff;
        margin-top: 20px;
        padding: 20px 0 20px 30px;
        p {
            line-height: 40px;
        }
    }
}
</style>
<style lang="less">
.videoOrderDetail {
    .weight {
        font-weight: 700;
    }
}
</style>
