<template>
  <div class="content_data transferList">
    <Breadcrumb/>
    <div>
      <ul class="content_data_title">
        <li v-for="(item, index) in listTab" :class="{blue: changebill == item.pid}" @click="redBill(item.pid)" :key="index">{{item.name}}</li>
      </ul>
      <el-row class="search_box">
        <el-col :span="2">
          <el-select v-model="data.userType"  @change="selected(0)">
            <el-option v-for="(item,index) in roleOptions" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model="data.keyType"  @change="selected(1)">
            <el-option v-for="(item,index) in typeOptions" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model.trim="data.keyWord" placeholder="搜索查询"></el-input>
        </el-col>
        <el-col :span="6">
          <div class="block">
            <el-date-picker
              v-model="tiemValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="selectTime"
            >
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" round @click="search">查询</el-button>
          <el-button  icon="el-icon-refresh" style="margin-left:20px;background:#ecf5ff"  round  @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <div class="list_content" v-if="changebill==1">
        <ul class="list_title">
          <li v-for="(item,index) in navTitle" :key="index">{{item}}</li>
        </ul>
        <div class="list" v-for="(item,index) in list" :key="index">
          <p class="number_time"><span>订单编号:{{item.tradeNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
          <ul class="list_wrap">
            <li class="need_flex">
              <div class="img_box"><img :src=item.fromPic alt=""></div>
              <p class="p_box"><span>{{['未知','学生','教师'][item.fromType]}}<span style="padding-left:15px;">{{item.fromName}}</span></span><span>{{item.fromPhone}}</span></p>
            </li>
            <li>{{item.money}}</li>
            <li>{{item.quota}}</li>
            <li class="need_flex need_flexd">
              <div class="img_box"><img :src=item.targetPic alt=""></div>
              <p class="p_box"><span>{{['未知','学生','教师'][item.targetType]}}<span style="padding-left:15px;">{{item.targetName}}</span></span><span>{{item.targetPhone}}</span></p>
            </li>
            <li>{{['','转账中','已到账','转账失败'][item.status]}}</li>
            <li>
              <el-button type="primary" @click="cancel(item.id)" plain size="mini" :disabled='disabled'> 撤销转账</el-button>
            </li>
          </ul>
        </div>
      </div>
      <div class="list_content" v-if="changebill==2">
        <ul class="list_title list_titlet">
          <li v-for="(item,index) in navTitle2" :key="index">{{item}}</li>
        </ul>
        <div class="list" v-for="(item,index) in list" :key="index">
          <p class="number_time"><span>订单编号:{{item.tradeNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
          <ul class="list_wrap">
            <li class="need_flex">
              <div class="img_box"><img :src=item.fromPic alt=""></div>
              <p class="p_box"><span>{{['未知','学生','教师'][item.fromType]}}<span style="padding-left:15px;">{{item.fromName}}</span></span><span>{{item.fromPhone}}</span></p>
            </li>
            <li>{{item.money}}</li>
            <li>{{item.quota}}</li>
            <li class="need_flex need_flexd">
              <div class="img_box"><img :src=item.targetPic alt=""></div>
              <p class="p_box"><span>{{['未知','学生','教师'][item.targetType]}}<span style="padding-left:15px;">{{item.targetName}}</span></span><span>{{item.targetPhone}}</span></p>
            </li>
            <li style="width:200px;">{{datenTimeFilter(0,0,item.arrivalTime)}}</li>
            <li>{{['','转账中','已到账','转账失败'][item.status]}}</li>
          </ul>
        </div>
      </div>
      <div class="list_content" v-if="changebill==3">
        <ul class="list_title list_titlet">
          <li v-for="(item,index) in navTitle3" :key="index">{{item}}</li>
        </ul>
        <div class="list" v-for="(item,index) in list" :key="index">
          <p class="number_time"><span>订单编号:{{item.tradeNo}}</span><span>下单时间:{{datenTimeFilter(0,0,item.createTime)}}</span></p>
          <ul class="list_wrap">
            <li class="need_flex">
              <div class="img_box"><img :src=item.fromPic alt=""></div>
              <p class="p_box"><span>{{['未知','学生','教师'][item.fromType]}}<span style="padding-left:15px;">{{item.fromName}}</span></span><span>{{item.fromPhone}}</span></p>
            </li>
            <li>{{item.money}}</li>
            <li>{{item.quota}}</li>
            <li class="need_flex need_flexd">
              <div class="img_box"><img :src=item.targetPic alt=""></div>
              <p class="p_box"><span>{{['未知','学生','教师'][item.targetType]}}<span style="padding-left:15px;">{{item.targetName}}</span></span><span>{{item.targetPhone}}</span></p>
            </li>
            <li style="width:200px;">{{datenTimeFilter(0,0,item.arrivalTime)}}</li>
            <li>{{['','转账中','已到账','转账失败'][item.status]}}</li>
          </ul>
        </div>
      </div>
      <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[5]" :method="findList" :total="data.total" />
    </div>
  </div>

</template>
<script>
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import MyPagination from '../../components/MyPagination.vue'
  import {searchTransferApi, cancelTransferApi} from '../../api/transferApi'
  import {datenTimeFilter} from '../../constant/filter'
  // import {success, error, confirm} from '../../actions'
  export default {
    name: 'transferList',
    components: {Breadcrumb, MyPagination },
    data() {
      return{
        pid:1,//控制4个table的切换
        changebill: 1,
        tiemValue: [],
        isActive: 0,
        disabled:false,
        listTab: [{pid: 1, name: '转账中'}, {pid:2, name: '转账成功'}, {pid: 3, name: '转账失败'}],
        role: '转账人', //角色
        keyType: '转账单号', //搜索类型
        roleOptions:[{label:"收款人",value:1},{label:"转账人",value:2}],
        typeOptions:[{label:"姓名",value:1},{label:"手机号",value:2},{label:"转账单号",value:3}],
        keyWord:"", //搜索关键字
        placeholder:"请输入姓名查询",
        navTitle:["转账人","转账金额","手续费/元","收款人","状态" ,"操作"],
        navTitle2:["转账人","转账金额","手续费/元","收款人","到账时间" ,"状态"],
        navTitle3:["转账人","转账金额","手续费/元","收款人","撤销时间" ,"状态"],
        data:{
          page:1,
          pageSize:5,
          total: 0,
          start: null,
          end: null,
          status: 1,
          userType: null,
          keyType: null,
          keyWord:null
        },
        list:[]
      }
    },
    created() {
       if(!!this.$route.query.tab){
          this.active= this.$route.query.tab
         this.redBill(this.$route.query.tab)
      }
      let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
    },
    methods: {
      datenTimeFilter,
      redBill(index) {
        this.data.keyWord = null
        this.changebill = index
         this.data.status = index
        this.$router.replace({ query: { ...this.$route.query,page:1,tab:index} })
        this.findList({page:1})
      },
      //select选择
      selected(index){
        if(index==0)
        { this.data.userType = this.data.userType
          this.findList()
        }
        if(index==1)
        {
          this.data.keyType = this.data.keyType
          this.findList()
        }
      },
     //search
      search(){
        this.$router.replace({ query: { ...this.$route.query,page:1}})
        this.findList({page:1})
      },
      selectTime(){
        this.data.start = Date.parse(this.tiemValue[0])
        this.data.end = Date.parse(this.tiemValue[1])
      },
      //重置
      reset(){
        this.tiemValue = []
        this.data.userType = null
        this.data.keyType = null
        this.data.keyWord= null
        this.data.start = null
        this.data.end = null
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList({page:1})
      },
      //查询列表
      findList(page={}){
        searchTransferApi({...this.data,...page}).then((data)=>{
          this.list = data.list
          this.data = {...this.data, ...page, ...data}
        })
      },
      //撤销转账
      cancel(id){
        this.$confirm('一旦确认撤销转账,此操作不可逆转。系统会将转账金额退还至转账人账户余额?', '你确定撤销此条转账吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          , center: true
        }).then(() =>{
          cancelTransferApi(id).then(()=>{
            this.findList()
            this.$message({
              type: 'success',
              message: '撤销成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        })
      }

    }
  }
</script>
<style lang="less" scoped>
  //转账列表
  .transferList{
    >div{
      .content_data_title {
        height: 70px;
        line-height: 70px;
        background-color: #fff;
        margin-bottom: 20px;
        padding-left: 30px;
        font-size: 20px;
        list-style: none;
        // color: #51c5ff;
        li {
          float: left;
          margin: 0 17px;
          color: #495869;
          cursor: pointer;
          &.ExportButton {
            float: right;
          }
        }
        .blue {
          color: #51c5ff;
          border-bottom: 3px solid #51c5ff;
        }
      }
      .search_box{
        width:100%;
        height:80px;
        background-color: #fff;
        margin-bottom:20px;
        .el-col{
          margin: 0 20px;
          line-height: 80px;
        }
      }
      .list_content{
        background-color: #fff;

        .list_title{
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          >li{
            width: 100px;
            line-height: 40px;
            &:nth-of-type(1){
              flex:1;
              text-align: left;
              padding-left: 20px;
            }
            &:nth-of-type(4){
              flex:1;
            }
          }

        }
        .list_titlet{
          >li{
            &:nth-of-type(5){
              width: 200px;
            }
          }
        }
        .list_titlethr{
          >li{
            &:nth-of-type(5){
              width: 200px;
            }
          }
        }
        .list{
          .number_time{
            display: flex;
            // justify-content: space-between;
            background-color: #f6f6f6;
            padding:0 20px;
            line-height: 40px;
            margin-right: 20px;
            >span:nth-of-type(2){
              margin-left: 150px;
            }

          }
          ul{
            background-color: #ffffff;
            padding: 20px 0;
            li{
              line-height: 100px;
            }
            .need_flex{
              display: inherit;
              justify-content: flex-start;
              align-items: center;
              .img_box{
                width: 50px;
                height: 50px;
                background-color: pink;
                margin: 0 20px;
                border-radius: 50%;
                img{
                  width:50px;
                  height:50px;
                  border-radius: 50%;
                  vertical-align: top;
                }
              }

              .p_box{
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                //  padding-top: 15px;
                span{
                  line-height: 25px;
                }
              }
            }
            .need_flexd{
              justify-content: center;
            }
          }
        }
        ul{
          display: flex;
          justify-content:center;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
          padding:0;
          margin:0;
          >li{
            width: 100px;
            line-height: 40px;
            &:nth-of-type(1){
              flex:1;
            }
            &:nth-of-type(4){
              flex:1;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .transferList {
    .el-date-editor--datetimerange.el-input__inner
    {
      width: 90%;
    }
    .el-date-editor .el-range-separator{
      width: 28px;
    }
  }
</style>



