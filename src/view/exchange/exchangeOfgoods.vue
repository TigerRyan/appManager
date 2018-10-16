<!--  -->
<template>
  <div class='exchangeOfgoods'>
    <Breadcrumb >
      <el-breadcrumb-item><i class="el-icon-date"/>兑换商品管理</el-breadcrumb-item>
    </Breadcrumb>
     <!-- 头部 -->
    <!-- <h3 class="cap">
        兑换商品管理
    </h3> -->
    <!-- 切换 -->
    <ul class="cate_list">
        <li class="cate_li" v-for="(item,index) in list" :class="{blue: changeBlue == item.type}" @click="reds(item.type)" :key="index">{{item.name}}</li>
        <li class="addShoping"><el-button type="primary" icon="el-icon-plus" round @click="add" v-show="changeBlue==0">新增兑换商品</el-button></li>
    </ul>

    <!-- 兑换管理表格 -->
    <TablePage v-show="changeBlue==0">
        <el-table :data="data.list" element-loading-text="拼命加载中...">       
          <el-table-column prop="homeImg" label="商品图片"  min-width="100" align="center">
            <template slot-scope="scope">
              <div class="img_col"><img :src="scope.row.homeImg" alt="" onerror="this.src='../../../static/img/admin.png'" style="width:64px"></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" align="center"/>
          <el-table-column prop="costPrice" label="价格" align="center"/>
          <el-table-column prop="number" label="宝券" align="center"/>
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{detailTimeFilter(0,0,scope.row.createTime)}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="triesLimit" label="每日可兑换数量" align="center"/>
          <el-table-column  label="操作" min-width="150" align="center">
            <template slot-scope="scope">
                <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>                
        </el-table>
        <MyPagination :page="data.pageNum" :pageSize="data.pageSize" :method="findList" :pageSizes=[10] :total="data.total" ></MyPagination>  
    </TablePage>
    
    <!-- 兑换记录表格 -->
    <div class="recordOfExchange" v-show="changeBlue==1">
      <!-- 查询 -->
      <!-- <div class="serch">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="input21">
        </el-input>
        <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
        <el-button type="info" @click="reset" icon="el-icon-refresh">重置</el-button>
      </div> -->
       <!--表格  -->
      <TablePage>
        <el-table :data="RecordData.list" element-loading-text="拼命加载中...">
          <el-table-column prop="orderNo" label="订单号" align="center"/>
          <el-table-column prop="userPic" label="用户头像"  min-width="100" align="center">
            <template slot-scope="scope">
              <div class="img_col"><img :src="scope.row.userPic" alt="" onerror="this.src='../../../static/img/admin.png'" style="width:64px"></div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户名" align="center"/>
           <el-table-column prop="phone" label="手机号" align="center"/>
          <el-table-column prop="goodsName" label="商品名称" align="center"/>
          <el-table-column prop="number" label="宝券数量" align="center"/>
          <el-table-column prop="createTime" label="时间" align="center" min-width="150">
            <template slot-scope="scope">
              <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="expressName" label="快递名称" align="center"/>
            <el-table-column prop="expressNum" label="快递单号" align="center"/>
          <el-table-column  label="操作" min-width="150" align="center">
            <template slot-scope="scope">
                <!-- <el-button size="small" type="primary"  @click="nosetDetail(scope.row)" v-if="scope.row.type==0">管理</el-button> -->
                <el-button type="primary" @click="confirmbutton(scope.row)" v-if="scope.row.orderStatus==1">确认发货</el-button>
                <!-- <el-button type="primary" :disabled="orderStatus==3" >已发货</el-button> -->
                <p v-if="scope.row.orderStatus==2">已发货</p>
                <p v-if="scope.row.orderStatus==3">已收货</p>
                <p v-if="scope.row.orderStatus==4">退货/售后</p>
                <p v-if="scope.row.orderStatus==5">订单关闭</p>
            </template>
          </el-table-column>                
        </el-table>
        <MyPagination :page="RecordData.pageNum" :pageSize="RecordData.pageSize" :method="findList1" :pageSizes=[10] :total="RecordData.total" ></MyPagination>  
    </TablePage>
    </div>


    <!-- 编辑弹框 -->
    <el-dialog title="" :visible.sync="dialogTableVisible" :modal="modal" custom-class="activity" @close="reset1">
        <el-form :model="flag?createModul:addModul" ref="createModul" :rules="rules" label-width="125px">
          <el-form-item label="商品名称:" prop="name">
            <el-input v-model="createModul.name" auto-complete="off" v-if="flag"></el-input>
            <el-input v-model="addModul.name" auto-complete="off" v-if="!flag"></el-input>
          </el-form-item>
          <el-form-item label="商品图片:"  prop="homeImg" >
            <Avatar :url="createModul.homeImg" width="150"  height="142" @success="createModul.homeImg = $event" v-if="flag"/>
            <Avatar :url="addModul.homeImg" width="150"  height="142" @success="addModul.homeImg = $event" v-if="!flag"/>
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
          </el-form-item>
          <el-form-item label="价格:" prop="costPrice">
            <el-input v-model.number="createModul.costPrice" auto-complete="off" v-if="flag" type="number" min="0"></el-input>
            <el-input v-model.number="addModul.costPrice" auto-complete="off" v-if="!flag" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="所需宝券:"  prop="number">
            <el-input v-model.number="createModul.number" auto-complete="off" v-if="flag" type="number" min="0"></el-input>
            <el-input v-model.number="addModul.number" auto-complete="off" v-if="!flag" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="每日可兑换数量:" prop="triesLimit">
            <el-input-number v-model.number="createModul.triesLimit" @change="handleChange" :min="0" :max="100"  v-if="flag"></el-input-number>
            <el-input-number v-model.number="addModul.triesLimit" @change="handleChange" :min="0" :max="100" v-if="!flag"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="codes"   @click="dialogTableVisible=false" plain>取消</el-button>
            <el-button class="xia" type="primary"   @click="next()" plain >确定</el-button>
        </div>
    </el-dialog>

    <!-- 发货弹框 -->
    <el-dialog title="你确定要发货吗？" :visible.sync="DeliverShow" :modal="modal" custom-class="activity" center @close="reset">
        <el-form :model="express" ref="express" :rules="rules" label-width="115px">
          <el-form-item label="快递名称:" prop="expressName">
            <el-input v-model="express.expressName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="快递单号:" prop="expressNum">
            <el-input v-model.trim="express.expressNum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="codes"   @click="DeliverShow=false" plain>取消</el-button>
            <el-button class="xia" type="primary"   @click="Delivergoods('createModul')"  >确定发货</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import {dateFilter,dateFi,detailTimeFilter,dateTimeFilter} from "../../constant/filter"
import MyPagination from "../../components/MyPagination.vue";
import TablePage from "../../components/TablePage.vue";
import Avatar from "../../components/Avatar.vue";
import { getAdminListApi,getSingleListApi,getEditApi,getRecordListApi,getDeliverApi, getAddApi,getDelApi} from "../../api/exchangeApi.js"
export default {
  name: 'exchangeOfgoods',
  components: {Breadcrumb,MyPagination,TablePage,Avatar},
  created () {
    
  },
  data () {
    return {
      id:null,               //编辑用的id
      flag:null,             //true为编辑，false为添加
      expressId:null,
      input21:'',
      dialogTableVisible:false, //是否显示弹窗
      DeliverShow:false,
      modal:false,        //是否有遮罩    
      changeBlue:0,       //导航选择
      status:false,       //发货状态
      list:[{type:0,name:"兑换管理"},{type:1,name:"兑换记录"}],
      data:{              //兑换管理数据
        list:[]
      },
      RecordData:{        //兑换记录数据
       
      },
      createModul:{       //编辑商品的数据
        
      },
      addModul:{          //添加商品的数据
        triesLimit:0,
        homeImg:''
      },
      express:{
        expressName:'',
        expressNum :''
      },
      rules:{
        name: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        homeImg:[
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ],
        costPrice: [
          { required: true, message: '请输入商品价格', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入所需宝券数量', trigger: 'change' }
        ],
         expressName: [
          { required: true, message: '请输入快递名称', trigger: 'change' }
        ],
         expressNum : [
          { required: true, message: '请输入快递单号', trigger: 'change' }
        ],
        triesLimit:[
          { required: true, message: '请输入可兑换数量', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    detailTimeFilter,
    dateFilter,
    dateFi,
    dateTimeFilter,
    findList(page={}){
      getAdminListApi({...page}).then(data=>{
        this.data={...this.data,...page,...data}
      })
    },
    findList1(page={}){
      getRecordListApi({...page}).then(data=>{
        this.RecordData={...this.RecordData,...page,...data}
        console.log(this.RecordData,555)
      })
    },
    reds(index){        //tab切换
      this.changeBlue=index
    },
    edit(val){          //编辑按钮
      this.dialogTableVisible=true
      this.flag=true
      this.id=val.id
      getSingleListApi({id:val.id}).then(data=>{
          this.createModul=data
      })

    },
    next(){             //确定编辑
        if (this.flag) {
          this.$refs.createModul.validate((valid) => {
            if (valid) {
              getEditApi({...this.createModul,id:this.id}).then(data=>{
                  this.dialogTableVisible=false
                  this.findList()
                  this.$message({
                    message: '编辑商品成功',
                    type: 'success'
                  });
              })
            } 
          });
        }else{
          this.$refs.createModul.validate((valid) => {
            if (valid) {
              getAddApi({...this.addModul}).then(data=>{
                this.dialogTableVisible=false
                this.findList()
                this.$message({
                    message: '新增商品成功',
                    type: 'success'
                  });
              })
            }
          })
        }
    },
    handleChange(){

    },
    query(){                                          //查询按钮

    },
    reset(){
      this.$refs.express.resetFields();
    },
    reset1(){
      this.$refs.createModul.resetFields();
    },                                                           
    Delivergoods(){                                          //确定发货按钮
        this.$refs.express.validate((valid) => {
          if (valid) {  
            getDeliverApi({...this.express,id:this.expressId}).then(data=>{
              // console.log(data)
              this.$message({
                  message: '发货成功',
                  type: 'success'
                });
                this.DeliverShow=false
                this.findList1()
            })
          } 
        });
    },
    confirmbutton(val){                                   //发货按钮
        // this.status=true
        this.express.expressName=''
        this.express.expressNum=''
        this.DeliverShow=true
        this.expressId=val.id
    },
    add(){
      this.dialogTableVisible=true
      this.flag=false
    },
    del(val){
      getDelApi({id:val.id}).then(data=>{
         
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.findList()
      })
    }    
  },

}
</script>
<style lang='less' scoped>
.exchangeOfgoods{
  .cap {
      height: 70px;
      background: #fff;
      padding-left: 30px;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      line-height: 70px;
      border-left: 3px solid #4ebbf2;
     
    }
    .cate_list {
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    padding-left: 31px;
    border-bottom: 1px solid #e1e6e8;
    background: #fff;
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
    .addShoping{
      float: right;
    }
  }
  .recordOfExchange{
    //  background: #fff;
    //  padding: 20px 0;
    .serch{
      padding: 0 20px;
      .el-input{
        width: 18%;
      }
      button{
        margin-left: 10px;
      }
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less">
.exchangeOfgoods{
  .el-pagination{
    text-align: center;
    padding: 20px 0;
  }
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 40%;
      .btn{
         text-align: center;
      }
    }
  }
}
  
</style>
