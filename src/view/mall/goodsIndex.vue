<!-- 商城管理 -->
<template>
  <div class='goodsIndex'>
    <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>商城管理</el-breadcrumb-item>
    </Breadcrumb>
    <!-- 头部 -->
    <h3 class="cap">
        商城管理
    </h3>

    <!-- 统计 -->
    <div class="statistics">
      <ul>
        <li>
            <p><img src="../../../static/img/scxq_icon_cjje.png" alt="">累计成交金额</p>
            <p>￥{{ Accumulative.totalMoney }}</p>
        </li>
        <li>
            <p><img src="../../../static/img/scxq_icon_spl.png" alt="">累计成交商品量</p>
            <p>{{ Accumulative.totalGoodsNumber  }}</p>
        </li>
        <li>
            <p><img src="../../../static/img/scxq_icon_jyyh.png" alt="">交易用户人次</p>
            <p>{{ Accumulative.totalUserNumber  }}</p>
        </li>
        <li>
            <p><img src="../../../static/img/scxq_icon_cssp.png" alt="">出售中商品</p>
            <p>{{ Accumulative.onSaleNumber  }}</p>
        </li>
      </ul>
    </div>

    <!-- 今日实时，昨日统计 -->
    <div class="timeStatistics">
      <ul class="cate_list">
          <li class="cate_li" v-for="(item,index) in list" :class="{blue: changeBlue == item.type}" @click="reds(item.type)" :key="index">{{item.name}}</li>
      </ul>
      <ul class="details">
        <li>
          <span>订单数</span>
          <span style="color:#4ebbf2">{{ Statistics.orderNumber }}</span>
        </li>
        <li>
          <span>成交金额</span>
          <span style="color:#7465eb">{{ Statistics.money  }}</span>
        </li>
      </ul>
    </div>

    <!-- 最近7日 -->
    <div class="statisticalChart">
      <div class="list">
        <ul class="cate_list">
          <li class="cate_li" v-for="(item,index) in list1" :class="{blue: changeList == index}" @click="timeS(index)" :key="index">{{item.name}}</li>
        </ul>
        <ul class="listDetails">
          <li>
            <span>订单数（个）</span>
            <span style="color:#51c5ff">{{ Statistics1.orderNumber  }}</span>
          </li>
          <li>
            <span>成交金额（元）</span>
            <span style="color:#51c5ff">￥{{ Statistics1.money  }}</span>
          </li>
          <li>
            <span>成交商品数（种）</span>
            <span style="color:#fe8d41">{{ Statistics1.goodsNumber  }}</span>
          </li>
        </ul>
      </div>
      <div class="chart">
        <div class="status">
          <el-radio-group v-model="radio2" @change="qushi">
            <el-radio :label="0">成交金额</el-radio>
            <el-radio :label="1">订单数</el-radio>
            <el-radio :label="2">成交商品</el-radio>
          </el-radio-group>
        </div>
        <div id="myChart" :style="{width:'90%', height: '350px'}"></div>
      </div>
    </div>

    <!-- 7日热销 -->
    <div class="hotSale">
      <div class="sale_1">
        <ul class="cate_list">
          <li class="cate_li" v-for="(item,index) in list2" :class="{blue: changeSale == index}" @click="sale(item.type)" :key="index">{{item.name}}</li>
        </ul>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="排名"
            width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="sale"
            label="销量"
            width="180" align="center">
          </el-table-column>
          <el-table-column
            prop="pic"
            label="商品">
            <template slot-scope="scope">
              <img  :src="scope.row.pic" alt="" style="width: 70px;">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sale_2">
        <div class="status">
          <el-radio-group v-model="checkList" @change="commodity">
            <el-radio :label="0">全部商品</el-radio>
            <el-radio :label="1">普通商品</el-radio>
            <el-radio :label="2">兑换商品</el-radio>
          </el-radio-group>
        </div>
        <div id="myChart1" :style="{width:'99%', height: '500px'}"></div>
      </div>
    </div>


  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import echarts from "echarts";
import {getSummaryApi,getStatisticsApi,getSevenDataApi,getHotSaleApi,getTrendApi} from "../../api/shoppingMallApi"
import {dateFilter,dateFi} from "../../constant/filter"
export default {
  name: "goodsIndex",
  components: { Breadcrumb },
  created() {
    this.init()
  },
  data() {
    return {
      Accumulative:{},//累计汇总
      Statistics:{},//获取统计数据
      Statistics1:{},//七日统计数据
      Deal:[],  //成交金额图表数据
      changeBlue: 1,
      changeList: "",
      changeSale: "",
      radio2:0,
      checkList:0,
      list: [{ type: 1, name: "今天实时" }, { type: 2, name: "昨日统计" }],
      list1: [
        { type: 0, name: "最近7日" }
      ],
      list2: [{ type: 0, name: "7日热销" }],
      tableData: [
      ],
      dateTime:[], //时间
      goodsNumber:[], //成交商品
      money:[],       //成交金额
      orderNumber:[],  //订单数
      stack:[],
      names:'',
     Company:'元',  //单位
     times:[]
    };
  },

  methods: {
    dateFilter,
    dateFi,
    reds(index) {
      this.changeBlue = index;
      getStatisticsApi({type:this.changeBlue}).then(data=>{
          this.Statistics=data
      })
    },
    timeS(index) {
      this.changeList = index;
    },
    sale(index) {
      this.changeSale = index;
    },
    qushi(){
      if (this.radio2==1) {
        this.stack=this.orderNumber
        this.names="订单数"
        this.Company="个"
        this.drawLine();
      }else if(this.radio2==2){
        this.stack=this.goodsNumber
        this.names="成交商品数"
        this.Company="种"
        this.drawLine();
      }else{
        this.stack=this.money
        this.names="成交金额"
        this.Company="元"
        this.drawLine();
      }
    },
    commodity(){
      this.Deal=[]
      getSevenDataApi({type:this.checkList}).then(data=>{
          data.forEach(item=>{
            this.Deal.push(item.money)
          })
         this.drawLine();
      })
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
          text: "最近7日趋势"
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
        data: this.dateTime
        },
        yAxis: {
          name : `单位：${this.Company}`,
          type: "value"
        },
        series: [
          {
            name: this.names,
            type: "line",
            stack: "总量",
            data: this.stack
          }
        ]
      });
      // 绘制图表2

      myChart1.setOption({
        title: {
          text: "商品成交额"
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
          type: "category",
          boundaryGap: false,
          data: this.times
        },
        yAxis: {
          name : '单位：元',
          type: "value"
        },
        series: [
          {
            name: "成交金额",
            type: "line",
            smooth: true,
            data: this.Deal,
            itemStyle : {
                normal : {
                  color:'#36d9d1',
                    lineStyle:{
                        color:'#36d9d1'
                    }
                }
            }
          }
        ]
      });
      window.onresize = function(){
        for(var i = 0; i < charts.length; i++){
            charts[i].resize();
        }
      };

    },
    init(){
      getSummaryApi().then(data=>{

        this.Accumulative=data
      })

      getStatisticsApi({type:this.changeBlue}).then(data=>{
          this.Statistics=data
      })
      getStatisticsApi({type:3}).then(data=>{
          this.Statistics1=data
      })
      //七日趋势
      getTrendApi().then(data=>{
          data.forEach(item=>{
              this.money.push(item.money)
              this.orderNumber.push(item.orderNumber)
              this.goodsNumber.push(item.goodsNumber)
              this.dateTime.push(this.dateFi(item.dateTime))
          })
          this.stack=this.money
          this.names="成交金额"
          this.drawLine();

      })
      //成交额
      getSevenDataApi({type:this.checkList}).then(data=>{
        data.forEach(item=>{
          this.Deal.push(item.money)
          this.times.push(item.dates)
        })
        this.drawLine();
      })
      //七日热销
      getHotSaleApi().then(data=>{
        this.tableData=data
        this.tableData.forEach((item,i)=>{
            this.tableData[i].id=i+1
        })
      })
    }


  },
  mounted() {

  }
};
</script>
<style lang='less' scoped>
.goodsIndex {
  .cate_list {
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    padding-left: 31px;
    border-bottom: 1px solid #e1e6e8;
    li {
      float: left;
      height: 100%;
      cursor: pointer;
      margin-right: 69px;
    }
    .blue {
      color: #4ebbf2;
      border-bottom: 3px solid #4ebbf2;
    }
  }
  .cap {
    height: 70px;
    background: #fff;
    padding-left: 30px;
    color: #333;
    font-size: 20px;
    font-weight: bold;
    line-height: 70px;
  }
  .statistics {
    margin-top: 20px;
    ul {
      display: flex;
      justify-content: space-between;
      width: 100%;
      li {
        width: 24%;
        background: #fff;
        text-align: center;
        padding-bottom: 46px;
        p:first-child {
          padding-top: 47px;
          padding-bottom: 30px;
          img {
            vertical-align: bottom;
            padding-right: 20px;
            width: 48px;
          }
        }
        p:last-child {
          font-size: 28px;
        }
      }
    }
  }
  .timeStatistics {
    margin-top: 20px;
    background: #fff;
    .details {
      margin-top: 12px;
      padding-top: 46px;
      padding-bottom: 20px;
      display: flex;
      justify-content: flex-start;
      // justify-content: center;
      li {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 20%;
        padding-left: 44px;
        padding-right: 162px;
        position: relative;
        &::before {
          content: "";
          height: 70px;
          width: 1px;
          background: #ccc;
          position: absolute;
          top: 28px;
          right: 0;
        }
        span {
          display: inline-block;
          width: 120px;
          font-size: 28px;
          padding-bottom: 26px;
          color: #999;
        }
        span:first-child {
          color: #333;
          font-size: 18px;
        }
      }
      // li:last-child::before {
      //   display: none;
      // }
    }
  }
  .statisticalChart {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .list {
      width: 640px;
      height: 410px;
      background: #fff;
      padding-top: 20px;
      .listDetails {
        padding-left: 52px;
        padding-top: 50px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          width: 50%;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          margin-bottom: 48px;
          span {
            padding-bottom: 18px;
          }
          span:last-child {
            font-size: 30px;
          }
        }
      }
    }
    .chart {
      width: 60.5%;
      height: 410px;
      background: #fff;
      margin-left: 20px;
      padding-top: 40px;
      padding-left: 74px;
      position: relative;
      .status{
        position: absolute;
        top: 30px;
        right: 85px;
        z-index: 2;
      }
    }
  }
  .hotSale {
    margin-top: 10px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;

    .sale_1 {
      // width: 805px;
      width: 52%;
      // height: 594px;
      background: #fff;
    }
    .sale_2 {
      width: 52%;
      padding-top: 26px;
      padding-left: 46px;
      background: #fff;
      margin-left: 20px;
      position: relative;
      .status{
        position: absolute;
        top: 30px;
        right: 85px;
        z-index: 2;
      }
    }
  }
  // .seller {
  //   height: 600px;
  //   background: #fff;
  //   margin-top: 20px;
  // }
}
</style>
<style lang="less">
.goodsIndex {
  .hotSale {
    .sale_1 {
      .el-table {
        .el-table__header {
          .has-gutter {
            tr {
              height: 60px;
              th {
                background: #f9fafb !important;
              }
            }
          }
        }
        .el-table__body {
          tr {
            height: 80px;
          }
          .el-table__row {
            .cell {
              img {
                vertical-align: middle;
                padding-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
