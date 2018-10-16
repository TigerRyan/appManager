<template>
  <div class='content_data lotmanage'>
    <Breadcrumb/>
    <el-button type="primary" style="right: 30px;top: 15px"  icon="el-icon-plus" @click="add(0)" class="addbtn" :disabled="status==1">添加抽奖商品</el-button>
    <div class="titleBox">
      <div class="content-title">{{this.luckyName}}的商品列表</div>      
    </div>
<!-- 列表 -->
    <TablePage>
        <el-table :data="data.list" ref="multipleTable" stripe  v-loading="data.loading" element-loading-text="拼命加载中...">
            <el-table-column prop="name" label="名称" min-width="130"/>
          <el-table-column prop="homeImg" label="图片" min-width="130">
              <template slot-scope="scope">
                <img :src="scope.row.homeImg" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
            </template>
          </el-table-column>
          <el-table-column prop="costPrice" label="价值" min-width="150"/>
          <el-table-column prop="rate" :formatter="rateFilter" label="中奖概率" min-width="150"/>
          <el-table-column prop="giveNum" label="发放数量" min-width="150"/>
          <el-table-column prop="weight" label="权重值" min-width="150"/>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="edit" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="del" size="small" :disabled="status==1" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </TablePage>
    <!-- 分页 -->
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/> 
    <!-- 弹框    -->
    <el-dialog title="" :visible.sync="show" :modalAppendToBody="false" width="600px" @close="handleClose">
      <el-form :model="dialog" :rules="rules" ref="notice" labelWidth="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialog.name" placeholder="请输入名称..."/>
        </el-form-item>
        <el-form-item label="图片" prop="homeImg">
          <Avatar :url="dialog.homeImg" width="150" height="150" @success="dialog.homeImg = $event"/>
        </el-form-item>
        <el-form-item label="价值" prop="costPrice">
          <el-input-number :min="0" v-model.trim="dialog.costPrice" placeholder="请输入价值..."/>
        </el-form-item>
        <el-form-item label="权重值" prop="weight">
          <el-input-number :min="0" :max="2147483647" v-model.trim="dialog.weight" placeholder="请输入权重值..."/>
        </el-form-item>
        <el-form-item label="中奖概率" prop="rate">
          <el-input-number :min="0" :max="100" v-model.trim="dialog.rate" placeholder="请输入概率..."/><span>&nbsp;&nbsp;%</span>
        </el-form-item>
        <el-form-item label="发放数量" prop="giveNum">
          <el-input-number :min="0" :max="2147483647" v-model.trim="dialog.giveNum" placeholder="请输入数字..."/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="show = false">取消</el-button>
      </div>
    </el-dialog>    
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import Avatar from "../../components/Avatar.vue";
import {rateFilter} from '../../constant/filter.js'
import {getlotManageApi,addlotManageApi,editlotManageApi,deletelotManageApi} from '../../api/lotManagementApi'
export default {
  name: 'lotmanage',
  components: {
    Breadcrumb,
    TablePage,
    MyPagination,
    Avatar
  },
  data () {
    return {
      data:{
        loading: false,
        page: 1,
        pageSize: 10,
        activityId: null,
        start: null,
        end: null,
        list: []                
      },
      show: false,
      activityId: this.$route.query.id,
      luckyName: this.$route.query.luckyName, 
      status:this.$route.query.status,
      stop:null,
      dialog: {id:null,activityId:null,name:null,homeImg:null,costPrice:null,weight:null,rate:null,giveNum:null}, 
      stopDialog:{id:null,activityId:null,name:null,homeImg:null,costPrice:null,weight:null,rate:null,giveNum:null},//编辑未改变存数据的对象
      rules: {
        name: [{required: true, message: '不能为空...', trigger: 'blur'}],
        homeImg: [{ required: true, message: '请上传图片', trigger: 'blur'}],
        costPrice: [
          {required: true, message: '不能为空...', trigger: 'blur'}, 
          {pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '价值只能保留两位小数', trigger: 'blur' },
        ],
        weight: [
          {required: true, message: '不能为空...', trigger: 'blur'}, 
          {pattern: /^[0-9]\d*$/, message: '只能为非负整数', trigger: 'blur' },
        ],
        rate:[
          {required: true, message: '不能为空...', trigger: 'blur'},
          {pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '最多保留两位小数', trigger: 'blur' }, 
        ],
        giveNum:[
          {required: true, message: '不能为空...', trigger: 'blur'}, 
          {pattern: /^[0-9]\d*$/, message: '只能为非负整数', trigger: 'blur' },
        ]
      },
    }
  },
  created () {   
  },
  methods: {
    rateFilter,
    add(res){
      this.show = true
      this.dialog= {id:null,activityId:null,name:null,homeImg:null,costPrice:null,weight:null,rate:null,giveNum:null} 
    },
    edit(res){
      this.show = true
      this.stopDialog = {id:res.id,activityId:res.activityId,name:res.name,homeImg:res.homeImg,costPrice:Number(res.costPrice),weight:res.weight,rate:Number((res.rate*100).toFixed(2)),giveNum:res.giveNum}
      this.dialog = {id:res.id,activityId:res.activityId,name:res.name,homeImg:res.homeImg,costPrice:res.costPrice,weight:res.weight,rate:(res.rate*100).toFixed(2),giveNum:res.giveNum}
    },
    del(res){
        this.$confirm('是否删除此商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deletelotManageApi(res.id).then((data)=>{ 
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.findList({...this.data})           
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });      
    },
    handleClose() {
      this.$refs.notice.resetFields();
    },   
    submit(){
      this.$refs.notice.validate((valid) => {
      if (valid) {
        if(this.dialog.id){
          if(JSON.stringify(this.dialog) == JSON.stringify(this.stopDialog)){
            this.$message({
              type: 'warning',
              message: '数据未改变'
            });
            this.show = false
            return       
          }
          editlotManageApi(this.dialog.id,{activityId:this.dialog.activityId,name:this.dialog.name,homeImg:this.dialog.homeImg,costPrice:this.dialog.costPrice,weight:this.dialog.weight,rate:(this.dialog.rate/100).toFixed(4),giveNum:this.dialog.giveNum}).then(()=>{
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.show = false
            this.findList({...this.data})
          })
        }else{
          this.dialog.rate = (this.dialog.rate/100).toFixed(4)
          this.dialog.activityId = this.activityId
          addlotManageApi(this.dialog).then(()=>{
            this.$message({
              type: 'success',
              message: '新建成功!'
            });
            this.show = false
            this.findList({page: 1})
          })
        } 


      }
      })
    },
    findList(page = {}){
      this.data.loading = true
      this.data.activityId = this.activityId
      getlotManageApi({...this.data,...page,...this.activityId}).then(res=>{
        this.data = { ...this.data, ...res, loading: false,page: res.pageNum }
      },
      err => {
          this.data.loading = false
        }
      )
    }
  },
}
</script>
<style lang='less' scoped>
.lotmanage{
  .addbtn {
    position: absolute;
    right: 0;
    top: 10px;
  }
  .titleBox {
      position: relative;
  }  
}
</style>
