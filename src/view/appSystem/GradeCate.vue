<template>
  <div class='content_data appSystemGradeCate'>
    <Breadcrumb/>
    <div class="titleBox">
      <div class="content-title">年级分类</div>
      <el-button v-if="disabled" plain icon="el-icon-plus" class="addClassify" type="primary" :disabled="disabled" @click="addDad">添加主分类</el-button>
      <el-button v-if="!disabled" plain icon="el-icon-plus" class="addClassify" type="primary" :disabled="showDad" @click="addDad">添加主分类</el-button>
    </div>
    <div id="all">
      <div class="title">
        <el-row type="flex" align="middle" justify="center">
          <el-col :span="4"><div class="titleInfo">分类名称</div></el-col>
          <el-col :span="4"><div class="titleInfo">分类权重</div></el-col>
          <el-col :span="4"><div class="titleInfo">年级科目</div></el-col>
          <el-col :span="4"><div class="titleInfo">创建时间</div></el-col>
          <el-col :span="4"><div class="titleInfo">操作</div></el-col>
        </el-row>
      </div>
      <!-- 主体部分 -->
      <div class="main" id="main">
        <el-collapse accordion @change="changePlank">
          <el-collapse-item v-for="(item,index) in options" :key="index">
            <template slot="title">
              <el-row type="flex" align="middle" justify="center">
                <el-col :span="4"><el-input v-model.trim="item.itemName"  placeholder="请输入主分类名称" style="width:200px" @click.stop.native="xianzhi" @keyup.stop.native="xianzhi" maxlength="20"></el-input></el-col>
                <el-col :span="4"><el-input-number type="number" v-model.number="item.sortNum"  placeholder="请输入权重" style="width:110px" @click.stop.native="xianzhi" @keyup.stop.native="xianzhi" controls-position="right" :min="0" :max="100"></el-input-number></el-col>
                <el-col :span="4" style="display: flex;justify-content: center;">
                  ---
                </el-col>
                <el-col :span="4"><div>{{detailTimeFilter(0,0,item.createTime)}}</div></el-col>
                <el-col :span="4">
                  <div>
                    <el-button type="primary" plain size="small" @click.stop.native="saveDad(item)" :disabled="disabled">保存</el-button>
                    <!-- <el-button type="danger" plain size="small" @click.stop.native="delDad(item)" :disabled="disabled">删除</el-button> -->
                  </div>
                </el-col>
              </el-row>
            </template>
            <div v-for="(ite,indexs) in item.list" class="sonClassify" :key="indexs">
              <el-row type="flex" align="middle" justify="center">
                <el-col :span="4"><el-input v-model.trim="ite.itemName"  placeholder="请输入子分类名称" style="width:150px"></el-input></el-col>
                <el-col :span="4"><el-input-number type="number" v-model.number="ite.sortNum" placeholder="请输入权重" style="width:110px" controls-position="right" :min="0" :max="100"></el-input-number></el-col>
                <el-col :span="4">
 
                  <div  style="line-height:20px">
                    <span v-for="(items,index) in ite.subject.split(',')" :key="index">{{items?items+'  ':'---'}}</span>
                  </div>
                  
                </el-col>
                <el-col :span="4"><div>{{detailTimeFilter(0,0,ite.createTime)}}</div></el-col>
                <el-col :span="4">
                  <div style="display: flex;padding-left:65px;" >
                    <el-button type="primary" plain size="small"  @click="saveSon(ite,item.id)" :disabled="disabled">保存</el-button>
                    <!-- <el-button type="danger" plain size="small" @click="delSon(ite,index)" :disabled="disabled">删除</el-button> -->
                    <el-button type="primary" plain size="small" @click="manage(ite)" :disabled="disabled">管理科目</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="addSonClass">
              <el-button v-if="disabled" plain icon="el-icon-plus" type="primary" @click="addSon(item)" :disabled="disabled">添加子分类</el-button>
              <el-button v-if="!disabled" plain icon="el-icon-plus" type="primary" @click="addSon(item)" :disabled="stopSon">添加子分类</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 弹框 -->
      <el-dialog title="添加科目" :visible.sync="dialogVisible" width="576px" :before-close="handleClose"  :modal-append-to-body="false">
        <span>当前所在年级：</span>
        <span>{{this.showClass?this.showClass:''}}</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(itemss,index) in showSubject" :label="itemss.id" :key="index">{{itemss.name}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="ensure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import {getGradeList,addCreateGrade,updateEditGrade,delteGrade,getSubject,addSubjectByGradeId} from '../../api/appSystemApi.js'
  import Avatar from "../../components/Avatar.vue"
  import { detailTimeFilter} from "../../constant/filter";
  export default {
    name: 'appSystemGradeCate',
    components: {
      Breadcrumb,
      Avatar
    },
    data() {
      return {
        disabled: null,
        data: [],
        options:{},
        aaa:0,
        dialogVisible: false,
        showClass:null,
        checkList: [],
        showId:null,
        showDad:false,
        stopSon:false,
        showSubject:[],
        showData: [
          {
            classifyname: '',
            weight: null
          }
        ],
        activeNames: ['1'],
        inputVal: ''
      }
    },
    created() {
      this.init()
      let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
      getSubject().then((res)=>{
       
        this.showSubject = res
       
      })
      
    },
    methods: {
      detailTimeFilter,
      handleChange(val) {
      },
      init(){
        getGradeList().then((data)=>{
          this.options= data.sort((a,b)=>{
            return a.sortNum - b.sortNum
          })
          this.showDad = false
          this.stopSon = false
        })
      },
      // 折叠面板改变事件
      changePlank(){
        // if(this.stopSon){
        //   this.$message({
        //       type: 'warning',
        //       message: '您刚刚新建的子分类未完善,请继续完善!'
        //     });
        // }
      },
      cancel(){
          this.dialogVisible = false
      },
      // 确认
      ensure(){
        addSubjectByGradeId(this.showId,this.checkList.join(',')).then((res)=>{
          this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.init()
            this.dialogVisible = false
        })
      },
      // 输入时限制展开子分类
      xianzhi(){

      },
      // 管理科目
      manage(val){
        if(!val.id){
          this.$message({
              type: 'warning',
              message: '请先创建子分类后再选此操作!'
            });
          return;
        }
        this.dialogVisible = true
        this.showClass = val.itemName
        this.showId = val.id

        this.checkList = []

        if(val.subjectIds){
          var arr = val.subjectIds.split(",")
          arr.forEach(item=>{
            this.checkList.push(Math.abs(item))
          })
        }
      },
      saveSon(res,resID){
        var newAddDad={}
        if(res.id){
          newAddDad.parentId=resID
          newAddDad.itemName = res.itemName
          newAddDad.sortNum=res.sortNum
          updateEditGrade(res.id,newAddDad).then((data)=>{
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.init()
            newAddDad={}
            // this.stopSon = false
          })
        }else{
         
          newAddDad.parentId=resID
          newAddDad.itemName = res.itemName
          newAddDad.sortNum=res.sortNum
          addCreateGrade(newAddDad).then((data)=>{
            this.$message({
              type: 'success',
              message: '新建成功!'
            });
            this.init()
            newAddDad={}
            this.stopSon = false
          })
        }
      },
      saveDad(res){
        var newAddDad={}
        // stop
        if(res.id){
         
          this.options.forEach((element,key) => {
            if(element.id==res.id){
              newAddDad.parentId=0
              newAddDad.itemName = this.options[key].itemName
              newAddDad.sortNum=this.options[key].sortNum
            }
          })
          updateEditGrade(res.id,newAddDad).then((data)=>{
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.init()
            newAddDad={}
          })
        }else{

          this.options.forEach((element,key) => {
            if(!element.id){
              newAddDad.parentId = 0
              newAddDad.itemName = this.options[key].itemName
              newAddDad.sortNum=this.options[key].sortNum
            }
          })
          addCreateGrade(newAddDad).then((data)=>{
            this.$message({
              type: 'success',
              message: '新建成功!'
            });
            this.init()
            newAddDad={}
            this.showDad = false
          })
         
        }
      },
      addDad(){ 
         if(this.stopSon){
          this.$message({
              type: 'warning',
              message: '您有一条子分类未完善,保存或删除,请继续操作!'
            });
          return;
        }
        let newDad1={
          parentId:0,
          itemName:'',
          sortNum:'',
          list:[]
        }
        this.options.unshift(newDad1)
        this.showDad=true    
      },
      addSon(res){//子分类
        if(this.showDad){
          this.$message({
              type: 'warning',
              message: '您有一条主分类未完善,保存或删除，请继续操作!'
            });
          return;
        }
        let newSon1={
          parentId:res.id,
          itemName:'',
          sortNum:'',
          subject:''
        }
        this.options.forEach((element,key) => {
          if(element.id==res.id){
            this.options[key].list.unshift(newSon1)
            this.stopSon = true
          }
        })
      },
      delSon(res,index){
        this.$confirm('此否删除此子分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          if(!res.id){
            this.options[index].list.shift()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.stopSon = false
            return;
          }
          delteGrade(res.id).then((data)=>{ 
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.init()
           
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delDad(res){
        this.$confirm('是否删除此主分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          if(!res.id){
             this.options.forEach((element,key) => {
            if(!element.id){
              this.options.splice(element.index,1)
               this.$message({
              type: 'success',
              message: '删除成功!'
            });
              this.showDad = false
            }
          })
            return;
          }
          delteGrade(res.id).then((data)=>{ 
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.init()
            
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // diolog X关闭
       handleClose(done) {
            done();
      }
    }
  }
</script>
<style lang='less' scoped>
  .appSystemGradeCate {
    .titleBox {
      position: relative;
    }
    .addClassify {
      position: absolute;
      top: 15px;
      right: 40px;
    }
  }
</style>
<style lang="less">
  .appSystemGradeCate{
    #all{
      .title{
        background-color: #f9fafb;
        .titleInfo{
          height: 70px;
          line-height: 70px;
          text-align:center;
        }
      }
      .main{
        background-color: #fff;
        .el-collapse-item__header{
          height:100px;
          line-height: 100px;
          position: relative;
          .el-collapse-item__arrow{
            position: absolute;
            left:70px;
            top:25px;
          }
          .is-justify-center{
            text-align:center;
          }
        }
        .el-collapse-item__content{
          padding-bottom: 0px;
          background-color: #f7f8fa;
          .sonClassify{
            height: 90px;
            line-height: 90px;
            .is-justify-center{
              text-align:center;
            }
          }
          .addSonClass{
            height: 90px;
            line-height: 90px;
            .el-button{
              margin-left:12.61%;
            }
          }
        }

      }
    }
    .el-checkbox-group{
      .el-checkbox{
        width: 80px;
      &:nth-of-type(5n+1){
        margin-left:0px;
      }
      }
    }
  }
</style>
