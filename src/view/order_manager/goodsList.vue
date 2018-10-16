<template>
	<div class="goodsList">
    <div class="less_type">
        <el-row :gutter="24">
          <el-col :span="3" v-for="(item,index) in orderNav" :key="index"  @click.native="changeColor(index)" :class="index==active?styleList[index].addClass:''">
            <span :style="[{backgroundColor:styleList[index].color}]">{{item.title}}</span>
            <ul class="orders">
              <li>
              </li>
            </ul>
          </el-col>
        </el-row>
    </div>
     	<!-- 搜索 pre_search-->
    <div class="time_search">
      <template>
        <el-select v-model="keyType" placeholder="请选择" @change='changeSelect()' style="margin-right:10px;width:200px;">
          <el-option
            v-for="(item,index) in selectList"
            :key="index"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </template>
			<div class="search kind">
				<el-input  placeholder="请输入搜索内容" style="width: 200px;" v-model="searchText" @change="selectkeyword"/>
			</div>
			<div class="buy_time" style="margin-top:-2px">
        <span class="buy_time_sp"></span>
				<el-date-picker
					v-model="tiemValue"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					@change="selectTime"
					>
				</el-date-picker>
				<el-button  icon="el-icon-search" style="margin-left:30px;background:#51c5ff;color:#fff;"  round @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"  round  @click="reset">重置</el-button>
        <ExportButton :method="exportForGoods" />
			</div>
    </div>
    <el-dialog title="物流信息" :visible.sync="dialogFormVisible" custom-class="diogle" :modal-append-to-body="false" top='30vh' center @close="closedia">
      <el-form :model="form" ref="ruleForm" :rules="rules">
          <el-form-item label="物流公司名称:" label-width="120px" prop="expressName" >
              <el-input v-model="form.expressName" type="text"></el-input>
          </el-form-item>
          <el-form-item label="运单号:" label-width="120px" prop="expressNum">
            <el-input v-model="form.expressNum"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOrder" round>取消</el-button>
        <el-button type="primary" @click="affirm" round>确定</el-button>
      </div>
    </el-dialog>
    <div class="list_content">
      <ul class="nav">
        <li style='font-weight:700;color:#495869;' v-for="(item,index) in navList" :key="index">{{item}}</li>
      </ul>
       <p v-if="list.length==0" class="noMsg">暂无满足条件的数据...</p>
      <ul class="order_content">
        <li v-for="(item,index) in list" :key="index">
          <ul class="order_all_msg">
            <li>
               <p class="order_number">
                <span>订单号：{{item.orderNo}}</span>
                <span>下单时间：{{detailTimeFilter(0,0,item.createTime)}}</span>
              </p>
              <div class="box">
                  <ul class="order_msg_box">
                    <li class="order_msg">
                        <div class="img_box"><img :src=item.goodsImg alt=""></div>
                        <div class="p_box">
                          <div class="nclass"><span>商品名称:</span>{{item.goodsName}}</div>
                          <p>颜色:{{item.subgoogsUnique}}</p>
                        </div>
                    </li>
                    <li class="price">￥{{item.costPrice}}</li>
                    <li class="pserson">{{item.num}}</li>
                    <li >{{item.userName}}</li>
                    <li class="payfor"><span>￥{{item.payAmount}}</span><span>{{['','微信','支付宝','余额支付'][item.payType]}}</span></li>
                    <li >{{['待支付','待发货','待收货','已收货','退货/售后 ','订单关闭'][item.orderStatus]}}</li>
                    <li class="edit">
                        <el-button type="primary" plain style="margin-bottom:10px;" v-if="sdata.status==1" @click="shipments(item.id)" :disabled="disabled">发货</el-button>
                        <el-button type="primary" plain style="margin-bottom:10px;" v-if="sdata.status==4" @click="agreefu(item.id,item.refundId)" :disabled="disabled">同意退款</el-button>
                        <el-button type="primary" plain style="margin-bottom:10px;" v-if="sdata.status==4" @click="refu(item.id,item.refundId)" :disabled="disabled">拒绝退款</el-button>
                        <el-button type="primary" plain  @click="goDetail(item.id,item.refundId)">订单详情</el-button>
                      </li>  
                  </ul>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <MyPagination :page="sdata.page" :pageSize="sdata.pageSize" :pageSizes="[5]" :total="sdata.total" :method="findList"></MyPagination>
	</div>
</template>

<script>
import {
  getFindforgoodsApi,
  shipmentsApi,
  shoprefunfsApi,
  exportForGoodsApi
} from '../../api/orderManagerApi'
import ExportButton from '../../components/ExportButton.vue'
import MyPagination from '../../components/MyPagination.vue'
import TablePage from '../../components/TablePage.vue'
import { detailTimeFilter } from '../../constant/filter'
export default {
  name: 'goodsList',
  components: {
    MyPagination,
    TablePage,
    detailTimeFilter,
    ExportButton
  },

  data() {
    return {
      types: 0,
      form: {
        id: null,
        expressName: null,
        expressNum: null
      },
      dialogFormVisible: false,
      sdata: {
        page: 1,
        pageSize: 5,
        total: 0,
        refundId:null,
        start: null, //开始时间
        end: null, //结束时间
        status: 0, //订单状态
        keyType: null, //关键字1。订单号2。商品名称，3.买家名称
        keyWord: null //关键词
      },
      searchText: null, //搜索
      active: 0,
      keyType: null, //关键字1。订单号2。商品名称，3.买家名称
      tiemValue: [], //时间
      orderNav: [
        { title: '待付款', price: null, count: 1000 },
        { title: '待发货', price: null, count: 500 },
        { title: '已发货', price: null, count: 400 },
        { title: '交易完成', price: null, count: 100 },
        { title: '退款待处理', price: null, count: 400 },
        { title: '已取消', price: null, count: 300 },
        { title: '已退款', price: null, count: 1000 }
      ],
      selectList: [
        { value: 1, label: '订单号' },
        { value: 2, label: '商品名称' },
        { value: 3, label: '买家名称' }
      ],
      list: [],
      stadata: {
        status: null,     //审核状态(必填),同意退款(1), 拒绝退款(2)
        id: null,         //订单ID(必填) 
        refundId: null,  //退款订单ID(必填) ,
      },
      styleList: [
        {
          color: '#4ebbf2',
          img: '',
          addClass: 'blue'
        },
        {
          color: '#feb13e',
          img: '',
          addClass: 'yellow'
        },
        {
          color: '#7465eb',
          img: '',
          addClass: 'zise'
        },
        {
          color: '#36d9d1',
          img: '',
          addClass: 'green'
        },
        {
          color: '#feb13e',
          img: '',
          addClass: 'yellow'
        },
        {
          color: '#7465eb',
          img: '',
          addClass: 'zise'
        },
        {
          color: '#36d9d1',
          img: '',
          addClass: 'green'
        }
      ],
      navList: ['商品', '价格', '数量', '买家', '实付金额', '交易状态', '操作'],
      disabled: false,
      rules:{
        expressName:[{required: true, message: '请输入物流公司名称...', trigger: 'blur'}],
        expressNum:[{required: true, message: '请输入运单号...', trigger: 'blur'},
         {pattern: /^\d+$/, message: '必须为大于或等于0的数字...', trigger: 'blur'}
        ]
      },

    }
  },
  created() {
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
    if (!!this.$route.query.tab) {
      this.active = this.$route.query.tab
      this.changeColor(this.$route.query.tab)
    }
  },
  methods: {
    detailTimeFilter,
    changeColor(index) {
      this.active = index
      this.types = index
      this.sdata.page = 1
      this.sdata.keyWord = this.searchText = null
      this.$router.replace({
        query: { ...this.$route.query, page: 1, tab: index }
      })
      this.sdata.status = Number(index)


      this.findList({page:1})
      // this.type = index + 1
    },
    //select搜索
    changeSelect() {
      this.sdata.keyType = this.keyType
      this.findList({page:1})
    },
    selectkeyword() {
      this.sdata.keyWord = this.searchText
    },
    //时间选择
    selectTime() {
      this.sdata.start = Date.parse(this.tiemValue[0])
      this.sdata.end = Date.parse(this.tiemValue[1])
    },
    //  button搜索
    search() {
      this.findList({page:1})
    },
    // 同意退款
    agreefu(idx,refundId) {
      this.stadata.status = 1
      this.stadata.id = idx
      this.stadata.refundId = refundId
      this.$confirm(
        '一旦确认同意退款，此操作不可逆转。系统会将用户实际支付金额退还到用户账户余额并且此订单将会进入已退款，交易结束',
        '你确定要同意退款吗?',
        {
          confirmButtonText: '确定退款',
          cancelButtonText: '取消退款',
          type: 'warning'
        }
      )
        .then(() => {
          shoprefunfsApi({ ...this.stadata }).then(() => {
            this.findList({page:1})
            this.$message({
              type: 'success',
              message: '退款成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消成功'
          })
        })
    },
    //拒绝退款
    refu(idx,refundId) {
      this.stadata.status = 2
      this.stadata.id = idx
      this.stadata.refundId = refundId
      this.$confirm(
        '一旦确认拒绝退款，此操作不可逆转。系统会将订单状态还原到待发货订单状态！',
        '你确定要拒绝退款吗？',
        {
          confirmButtonText: '拒绝退款',
          cancelButtonText: '取消退款',
          type: 'warning'
        }
      )
        .then(() => {
          shoprefunfsApi({ ...this.stadata }).then(() => {
            this.findList({page:1})
            this.$message({
              type: 'success',
              message: '拒绝退款成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '拒绝退款失败'
          })
        })
    },
    //重置
    reset() {
      this.searchText = null
      this.tiemValue = null
      this.sdata.keyType = this.keyType = null
      this.sdata.keyWord = null
      this.sdata.start = null
      this.sdata.end = null
      this.findList({page:1})
    },
    //发货
    shipments(idx) {
      this.form.id = idx
      this.dialogFormVisible = true
    },
    affirm() {
      this.$refs.ruleForm.validate((val)=>{
        if(val)
        {
       shipmentsApi({ ...this.form }).then(() => {
        this.$message({
          showClose: true,
          message: '恭喜你发货成功',
          type: 'success'
        })
        this.findList({page:1})
       })
        this.dialogFormVisible = false
        this.form.expressName = ''
        this.form.expressNum = ''
       }

      })

    },
    //取消订单
    cancelOrder() {
      this.dialogFormVisible = false
      this.form.expressName = ''
      this.form.expressNum = ''
    },
    // 关闭的回调
    closedia() {
      this.dialogFormVisible = false
      this.form.expressName = ''
      this.form.expressNum = ''
     this.$refs.ruleForm.resetFields()
    },
    //查看详情
    goDetail(idx,refundId) {
      this.$router.push({
        name: 'goodsDetail',
        query: { id: idx, type: this.types,refundId }
      })
    },
    //搜索列表
    findList(page = {}) {
      getFindforgoodsApi({ ...this.sdata, ...page }).then(data => {
        this.list = data.list
        this.sdata = { ...this.sdata, ...page, ...data }
      })
    },
    //    导出功能
    exportForGoods({ start, end }) {
      return exportForGoodsApi({ ...this.sdata, start, end })
    }
  }
}
</script>
<style lang="less" scoped>
.goodsList {
  box-sizing: border-box;
  .ExportButton {
    margin: 0;
    margin-right: 20px;
  }

  .el-pagination{
    text-align: center ;
    padding: 15px 0
  }

  ul {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-start: 0;
  }
  li {
    list-style: none;
  }
  .less_type {
    height: 154px;
    background-color: #ffffff;
    margin-bottom: 20px;
    // display: flex;
    // align-items: center;
    .el-row {
      box-sizing: border-box;
      height: 154px;
      display: flex;
      align-items: center;
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

      .el-col {
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
          content: '';
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
          height: 0px;
          //高度注释
          // padding: 10px 0;
          display: flex;
          width: 100%;
          justify-content: center;
          position: relative;
          border: 1px solid #e6e6e6;

          background-color: #fff;
          li {
            width: 100%;
            line-height: 36px;
            text-align: center;
            p {
              display: block;
              font-size: 17px;
            }
            p:nth-child(2) {
              padding-top: 37px;
              font-weight: 600;
            }
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
      }
      .yellow {
        .orders {
          border: 2px solid #feb13e;
        }
        .orders:before {
          border-top-color: #feb13e;
        }
        // .orders:after {
        //   border-top-color: #fff;
        // }
      }
      .zise {
        .orders {
          border: 2px solid #7465eb;
        }
        .orders:before {
          border-top-color: #7465eb;
        }
        // .orders:after {
        //   border-top-color: #fff;
        // }
      }
      .green {
        .orders {
          border: 2px solid #36d9d1;
        }
        .orders:before {
          border-top-color: #36d9d1;
        }
        // .orders:after {
        //   border-top-color: #fff;
        // }
      }
    }
  }

  .time_search {
    height: 74px;
    width: 100%;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    .buy_time {
      margin-left: 20px;
      flex: 1;
      .buy_time_sp {
        margin-right: 10px;
      }
      .el-date-editor {
        width: 40%;
      }
      .el-range-separator {
        width: 10%;
      }
      .el-button {
        margin-left: 10px !important;
        vertical-align: middle;
      }
    }
  }
  .list_content {
    background-color: #fff;
    color: #333;
    .noMsg {
      line-height: 50px;
      text-align: center;
      background-color: #fff;
    }
    .nav,
    .order_msg_box {
      display: flex;
      text-align: center;
      line-height: 68px;
      padding: 0 32px;
      li {
        width: 10%;
        &.payfor {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          > span {
            display: inline-block;
            width: 70px;
            height: 30px;
            text-align: center;
            line-height: 30px;
          }
          > span:nth-child(1) {
            color: red;
          }
          > span:nth-child(2) {
            border: 1px solid #999999;
          }
        }
        &.edit {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .el-button--primary.is-plain {
            padding: 0;
            width: 70px;
            height: 30px;
            margin-left: 0;
          }
        }
      }
      // li:last-child {
      //   width: 7.5%;
      // }
      li:first-child {
        width: 40%;
      }
    }
    .nav {
      li:first-child {
        text-align: left;
        text-indent: 68px;
      }
    }
    .order_content {
      padding: none;
      li {
        .box {
          padding: 28px 32px 20px;
        }
        .order_msg_box {
          height: 110px;
          background-color: #fff;
          padding-bottom: 23px;
          border-bottom: 1px solid #e6e6e6;
          padding: 0 0 23px;
          line-height: 86px;
          .order_msg {
            display: flex;
            .img_box {
              width: 120px;
              height: 100%;
              background-color: #fff;
              margin-right: 15px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .p_box {
              height: 100%;
              display: flex;
              justify-content: space-around;
              flex-direction: column;
              line-height: 20px;
              text-align: left;
              width: 55%;
              p:first-child {
                color: #333333;
                font-size: 16px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; //这里是在第二行有省略号
                overflow: hidden;
              }
              p:nth-child(2) {
                padding-top: 5px;
              }
            }
          }
          .real_price,
          .price {
            display: flex;
            flex-direction: column;
            span {
              display: inline-block;
              line-height: 25px;
              padding-left: 35%;
              text-align: left;
            }
            span:first-child {
              padding-top: 30px;
            }
          }
          .price {
            span:last-child {
              font-size: 13px;
              color: #a5a5a5;
            }
          }
          .real_price {
            span {
              padding-left: 0;
              text-align: center;
            }
            span:last-child {
              border: 1px solid #ccc;
              border-radius: 14px;
              width: 40%;
              position: relative;
              margin: auto;
            }
          }
        }
        .order_number {
          padding: 0;
          line-height: 68px;
          background-color: #f7f8f9;
          font-size: 14px;
          text-align: left;
          span {
            padding-left: 32px;
          }
          span:first-child {
            width: 480px;
            display: inline-block;
          }
        }
      }
    }
  }
  .search {
    height: 74px;
    display: flex;
    align-items: center;
    background-color: #fff;
    // padding-left: 10px;
    .el-input {
      width: 250px !important;
    }
  }
}
</style>
<style lang='less'>
// 表格样式
.goodsList {
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
  .el-input__inner {
    border-radius: 20px;
  }
}
</style>
<style lang="less">
.el-date-editor .el-range-separator {
  width: 20px;
}
</style>
<style lang="less">
.goodsList {
  //弹框
  .diogle {
    width: 440px;
    border-radius: 5px;
  }
}
</style>


