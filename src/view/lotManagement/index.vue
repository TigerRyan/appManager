<template>
  <div class='content_data lotManagement'>
    <Breadcrumb/>
    <el-button type="primary" style="right: 30px;top: 15px"  icon="el-icon-plus" @click="add(0)" class="addbtn">添加抽奖活动</el-button>
    <!-- 列表 -->
    <TablePage>
        <el-table :data="data.list" ref="multipleTable" stripe  v-loading="data.loading" element-loading-text="拼命加载中...">
            <el-table-column prop="id" label="ID" min-width="130"/>
            <el-table-column prop="luckyName" label="名称" min-width="130"/>
          <el-table-column prop="pic" label="图片" min-width="130">
              <template slot-scope="scope">
                <img :src="scope.row.pic" onerror="onerror=null;src='/static/img/logo.png'" width="90" height="90"/>
            </template>
          </el-table-column>        
          <el-table-column prop="weight" label="权重值" min-width="150"/>
          <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="status" label="发布" min-width="150">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-text="开启" inactive-text="关闭" @change="changeStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="链接" min-width="150">
            <template slot-scope="scope">
              {{scope.row.status?`${locationOrigin}/xxbweb/lucky/index?id=${scope.row.id}`:'---'}}
            </template>
          </el-table-column>   
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="edit" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="edit" size="small" @click="regulate(scope.row.id,scope.row.luckyName,scope.row.status)">管理</el-button>
            </template>
          </el-table-column>
        </el-table>
    </TablePage>
    <!-- 分页 -->
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    <!-- 弹框    -->
    <el-dialog title="" :visible.sync="show" :modalAppendToBody="false" width="600px" @close="handleClose">
      <el-form :model="dialog" :rules="rules" ref="notice" labelWidth="100px">
        <el-form-item label="活动名称" prop="luckyName">
          <el-input v-model="dialog.luckyName" placeholder="请输入活动名称..."/>
        </el-form-item>
        <el-form-item label="图片" prop="pic">
          <Avatar :url="dialog.pic" width="150" height="150" @success="successIdCardBack"/>
        </el-form-item>
        <el-form-item label="权重值" prop="weight">
          <el-input-number :min="0" :max="2147483647" v-model.trim="dialog.weight" placeholder="请输入权重值..."/>
        </el-form-item>
        <el-form-item label="有效时间" prop="startTime">
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
        </el-form-item>
        <el-form-item label="所需宝券" prop="couponNum">
          <el-input-number :min="0" :max="2147483647" v-model.trim="dialog.couponNum" placeholder="请输入数字..."/>
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
import {getlotManagementApi,addManagementApi,editManagementApi,sendlotManageApi} from '../../api/lotManagementApi'
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import Avatar from "../../components/Avatar.vue";
import {dateTimeFilter} from '../../constant/filter.js'
export default {
  name: 'lotManagement',
  components: {
    Breadcrumb,
    TablePage,
    MyPagination,
    Avatar
  },
  data () {
    return {
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        keyWord: null,
        start: null,
        end: null,
        list: [],
        locationOrigin: null
      },
      value3: true,
      show: false,
      tiemValue:[],
      // 大于当前时间不可选
      pickerOptions0: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // }
      },
      dialog: {id:null,luckyName:null,pic:null,weight:null,startTime:null,endTime:null,couponNum:null}, 
      rules: {
        luckyName: [{required: true, message: '不能为空...', trigger: 'blur'}],
        pic: [{ required: true, message: '请上传图片', trigger: 'blur'}],
        weight: [
          {required: true, message: '不能为空...', trigger: 'blur'}, 
          {pattern: /^[0-9]\d*$/, message: '只能为非负整数', trigger: 'blur' },
        ],
        startTime:[
          {required: true, message: '请选择有效时间...', trigger: 'blur'}, 
        ],
        couponNum:[
          {required: true, message: '不能为空...', trigger: 'blur'}, 
          {pattern: /^[0-9]\d*$/, message: '只能为非负整数', trigger: 'blur' },
        ]
      },     
    }
  },
  created () {
    // 预发布地址
    if(location.origin=='http://test.xuexunbao.com.cn'){
      this.locationOrigin =  'http://testapp.xuexunbao.com.cn'
    }
    //测试地址
    if(location.origin=='http://xxb-manage.china-start.cn:8050'){
      this.locationOrigin =  'http://kxxb.china-start.cn:8888'
    }
    //新搭建测试地址
    if(location.origin=='http://manage1.xuexunbao.com.cn'){
      this.locationOrigin =  'http://app1.xuexunbao.com.cn'
    }
    //线上地址
    if(location.origin=='http://pre-back.xuexunbao.com.cn'){
      this.locationOrigin =  'https://study.xuexunbao.com.cn'
    }
    //本地地址
    if(location.origin=='http://localhost:8086'){
      this.locationOrigin =  'http://kxxb.china-start.cn:8888'
    }
  },
  methods: {
    dateTimeFilter,
    add(res){
      this.show = true
      this.dialog ={id:null,luckyName:null,pic:null,weight:null,startTime:null,endTime:null,couponNum:null}
      // this.tiemValue=[] 
      this.$set(this.tiemValue,0,"")
      this.$set(this.tiemValue,1,"")
        
    },
    successIdCardBack(url){
      this.dialog.pic = url
      this.$refs.notice.validate('pic')
    },
    // 发布开启或关闭
    changeStatus(res){
      if(res.status){
        sendlotManageApi(res.id).then(()=>{
          this.findList({...this.data})
          this.$message({
              type: 'success',
              message: '活动已开启!'
            });
        },error=>{
           this.findList({...this.data})
        })    
      }else{
         sendlotManageApi(res.id).then(()=>{
          this.findList({...this.data})
          this.$message({
              type: 'success',
              message: '活动已关闭!'
            });
        },error=>{
           this.$message({
              type: 'error',
              message: '活动关闭失败!'
            });
           this.findList({...this.data})
        })
      }
    },
    findList(page = {}){
      this.data.loading = true
      getlotManagementApi({...this.data,...page}).then(res=>{
        this.data = { ...this.data, ...res, loading: false,page: res.pageNum }
        this.data.list = res.list.map(item=>{
           return {...item,status:item.status == 1?true:false}
         })
      },
      err => {
          this.data.loading = false
        }
      )
    },
    selectTime(){
     this.dialog.startTime = this.tiemValue ?   Date.parse(this.tiemValue[0]) : ""
     this.dialog.endTime = this.tiemValue ?   Date.parse(this.tiemValue[1]) : ""
    },
    edit(res){
      this.show = true
      this.dialog = {id:res.id,luckyName:res.luckyName,pic:res.pic,weight:res.weight,startTime:res.startTime,endTime:res.endTime,couponNum:res.couponNum}
      this.tiemValue = []
      this.$set(this.tiemValue,0,res.startTime)
      this.$set(this.tiemValue,1,res.endTime)
    },
    regulate(idx,res,del){
      this.$router.push({name:'lotmanage',query:{id:idx,luckyName:res,status:del?1:0}})
    },
    submit(){
      this.$refs.notice.validate((valid) => {
      if (valid) {
        if(this.dialog.id){
          editManagementApi(this.dialog.id,{luckyName:this.dialog.luckyName,pic:this.dialog.pic,weight:this.dialog.weight,startTime:this.dialog.startTime,endTime:this.dialog.endTime,couponNum:this.dialog.couponNum}).then(()=>{
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.show = false
            this.findList({...this.data})
            this.$set(this.tiemValue,0,"")
            this.$set(this.tiemValue,1,"")
          })
        }else{
          addManagementApi(this.dialog).then(()=>{
            this.$message({
              type: 'success',
              message: '新建成功!'
            });
            this.show = false
            this.findList({page: 1})
            this.$set(this.tiemValue,0,"")
            this.$set(this.tiemValue,1,"")
          })
        } 


      }
      })
    },
    handleClose() {
      this.$refs.notice.resetFields();
    },    
  },

}
</script>
<style lang='less' scoped>
.lotManagement{
  .addbtn {
    position: absolute;
    right: 0;
    top: 10px;
  }
}
</style>