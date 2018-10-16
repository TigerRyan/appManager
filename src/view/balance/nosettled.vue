<!-- 待结算详情 -->
<template>
  <div class='content_data balanceNosettled'>
     <Breadcrumb/>
     <div class="courtitle">课程信息</div>
     <div class="courseinf">
        <div class="courimg">
           <img src="../../../static/img/logo.png" alt="">
        </div>
        <div class="courid">
            <ul class="ul_one">
               <li>
                  <span class="span_one">课程ID</span>
                  <span class="id_span">2018017326723</span>
               </li>
               <li>
                  <span class="span_one">课程专题名称</span>
                  <span>2018017326723</span>
               </li>
               <li>
                  <span class="span_one">教学群体</span>
                  <span class="fourword">一年级</span>
               </li>
               <li>
                  <span class="span_one">教学科目</span>
                  <span class="fourword">语文</span>
               </li>
               <li>
                  <span class="span_one">授课教师</span>
                  <span class="spanimg"><img src="../../../static/img/11.png" alt=""></span>
                  <span class="teachname">上官灏明</span>
               </li>
            </ul>
        </div>
        <div class="courtime">
           <ul class="ul_one">
               <li>
                  <span class="span_one">授课时间</span>
                  <span>2018年5月26-2018年5月30日 每天18:00-20:00</span>
               </li>
               <li>
                  <span class="span_one">报名日期</span>
                  <span>2018年5月26-2018年5月30日</span>
               </li>
               <li>
                  <span class="span_one">课时数</span>
                  <span class="threeword">共10课时</span>
               </li>
               <li>
                  <span class="span_one">原价</span>
                  <span class="twoword">¥5300.00</span>
               </li>
               <li>
                  <span class="span_one">优惠价</span>
                  <span class="threeword">¥2300.00</span>
               </li>
            </ul>
        </div>
        <div class="courstate">
          <ul>
            <li>
              <span><img src="../../../static/img/22.png" alt=""></span>
              <span>报名人数</span>
            </li>
            <li>85478</li>
            <li>
              <span><img src="../../../static/img/33.png" alt=""></span>
              <span>课程状态</span>
            </li>
            <li>待上课</li>
            </ul>
        </div>
     </div>
     <!-- 数据统计 -->
     <div class="datacount">
        <span class="data_one">数据统计</span>
        <span class="data_two">统计时间：2018年4月22日21:37:00</span>
     </div>

     <!-- 五个框框 -->
     <div class="less_type">
        <el-row :gutter="24">
          <el-col :span="6" v-for="(item,index) in orderNav" :key="index">
            <span :style="[{backgroundColor:styleList[index].color}]"><i class="icon" :style="[{backgroundImage:`url(${styleList[index].img})`}]"></i>{{item.title}}</span>
            <ul class="orders">
               <li>
                 <p>订单金额</p>
                 <p>￥{{item.price}}</p>
               </li>
               <li>
                 <p>订单数</p>
                 <p>{{item.count}}</p>
              </li>   
            </ul>
          </el-col>
        </el-row>  
    </div>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
export default {
  name: "balanceNosettled",
  components: { Breadcrumb },
  data() {
    return {
      styleList: [
        {
          color: "#4ebbf2",
          img: "../../../static/img/icon01.png",
          addClass: "blue"
        },
        {
          color: "#feb13e",
          img: "../../../static/img/icon02.png",
          addClass: "yellow"
        },
        {
          color: "#36d9d1",
          img: "../../../static/img/icon03.png",
          addClass: "zise"
        },
        {
          color: "#7465eb",
          img: "../../../static/img/icon04.png",
          addClass: "green"
        },
        {
          color: "#3ed57e",
          img: "../../../static/img/icon05.png",
          addClass: "green"
        }
      ],
      orderNav: [
        { title: "待付款", price: null, count: null },
        { title: "已付款", price: null, count: null },
        { title: "退款中", price: null, count: null },
        { title: "已退款", price: null, count: null},
        { title: "分润", price: null, count: null}
      ],
    };
  },

  methods: {},

  created() {}
};
</script>
<style lang='less' scoped>
  .balanceNosettled{
    color: #333;
    width: 100%;
      .courtitle{
         background-color: #fff;
         width: 100%;
         height: 60px;
         line-height: 60px;
         font-size: 18px;
         padding-left: 30px;
         color: #333;
      }
     .courseinf{
        background: #fff;
        width: 100%;
        display: flex;
        flex-direction: nowrap;
        justify-content: space-around;
        text-align: left;
        line-height: 50px;
        padding-bottom: 50px;
        .courimg{
          width: 20%;
          // background-color: pink;
          img{
            width: 100%;
            height: 200px;
          }
        }
        .courid{
          // background-color: orange;
          width: 22%;   
          border-right: 1px solid #e1e6e8;
          padding-right: 10px;   
        }
        .courtime{
          // background-color: red;
          width: 29%;
          border-right: 1px solid #e1e6e8;
          // margin-right: 20px; 
        }
        .courstate{
          // background-color: blue;
          width: 16%;
          ul{
            padding-left: 50px;
            li:nth-child(2){
              font-size: 20px;
              font-weight: bold;
            }
            li:nth-child(3){
              margin-top: 30px;
            }
            li:nth-child(4){
              width: 78px;
              height: 30px;
              line-height: 30px;
              background-color: #feb13e;
              padding: 0 10px;
              color: #fff;
              text-align: center;
            }
          }
        }
        .span_one{
          padding-right: 30px;
        }
        .id_span{
          padding-left: 48px;
        }
        .fourword,.spanimg{
          padding-left: 32px;
        }
        .teachname{
          padding-left: 10px;
        }
        .threeword{
          padding-left: 13px;
        }
        .twoword{
          padding-left: 30px;
        }
        .spanimg{
          img{
            width: 40px;
            height: 40px;
            line-height: 40px;
            vertical-align: middle;
          }
        }
     }
    //  数据统计
    .datacount{
       padding-left: 30px;
       margin-top: 20px;
       background-color: #fff;
       height: 60px;
       line-height: 60px;
       width: 100%;
       .data_one{
         padding-right: 15px;
       }
       .data_two{
          padding-left: 30px;
          color: #999;
          border-left: 1px solid #e1e6e8;
       }
    }
    // 五个框框
    .less_type {
      height: 240px;
      margin-bottom: 45px;
      .el-row {
        box-sizing: border-box;
        .el-col {
          span {
            top: 3px;
            position: relative;
            .icon {
              width: 30px;
              height: 31px;
              display: inline-block;
            }
          }
        }
      }
      
      .el-col {
        margin-top: 20px;
        span {
          vertical-align: middle;
          i {
            height: 32px;
            width: 32px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 13px;
          }
        }
        span {
          width: 100%;
          height: 80px;
          display: block;
          line-height: 80px;
          text-align: center;
          font-size: 20px;
          color: #fff;
          border-radius: 3px;
          position: relative;
          z-index: 10;
        }
        .orders:after,
        .orders:before {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border: solid transparent;
          pointer-events: none;
          content: "";
          border-color: rgba(136, 183, 213, 0);
        }
        .orders:after {
          // border-top-color:#fff;
          border-width: 10px;
          left: 50%;
          margin-left: -10px;
          top: 100%;
        }
        .orders:before {
          border-width: 12px;
          left: 49%;
          margin-left: -8px;
          top: 100%;
        }
        .orders {
          border-radius: 3px;
          height: 118px;
          padding: 18px 0;
          display: flex;
          height: 160px;
          width: 100%;
          justify-content: space-between;
          position: relative;
          background-color: #fff;
          li {
            width: 50%;
            p {
              padding: 24px 0 0 37px;
              display: block;
              font-size: 17px;
            }
            p:nth-child(2) {
              padding-top: 37px;
              font-weight: 600;
            }
          }
          
          li:first-child {
            border-right: 1px solid #e6e6e6;
          }
        }
      }
      .blue {
        .orders {
          border: 2px solid #4ebbf2;
        }
        .orders:before {
          border-top-color: #4ebbf2;
        }
        .orders:after {
          border-top-color: #fff;
        }
      }
      .yellow {
        .orders {
          border: 2px solid #feb13e;
        }
        .orders:before {
          border-top-color: #feb13e;
        }
        .orders:after {
          border-top-color: #fff;
        }
      }
      .zise {
        .orders {
          border: 2px solid #7465eb;
        }
        .orders:before {
          border-top-color: #7465eb;
        }
        .orders:after {
          border-top-color: #fff;
        }
      }
      .green {
        .orders {
          border: 2px solid #36d9d1;
        }
        .orders:before {
          border-top-color: #36d9d1;
        }
        .orders:after {
          border-top-color: #fff;
        }
      }
    }
  }
</style>
<style lang='less'>

</style>