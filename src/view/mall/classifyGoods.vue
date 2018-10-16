<template>
  <div class='content_data mallClassifyGoods'>
    <Breadcrumb/>
    <div class="titleBox">
      <div class="content-title">商品分类设置</div>
      <el-button v-if="disabled" plain icon="el-icon-plus" :disabled='disabled' class="addClassify" type="primary" @click="addDad">添加主分类</el-button>
      <el-button v-if="!disabled" plain icon="el-icon-plus" :disabled='showDad' class="addClassify" type="primary" @click="addDad">添加主分类</el-button>
    </div>
    <div id="all">
      <div class="title">
        <el-row type="flex" align="middle" justify="center">
          <el-col :span="4"><div class="titleInfo">分类名称</div></el-col>
          <el-col :span="4"><div class="titleInfo">分类权重</div></el-col>
          <el-col :span="4"><div class="titleInfo">分类图标</div></el-col>
          <el-col :span="4"><div class="titleInfo">创建时间</div></el-col>
          <el-col :span="4"><div class="titleInfo">操作</div></el-col>
        </el-row>
      </div>
      <!-- 主体部分 -->
      <div class="main" id="main">
        <el-collapse accordion >
          <el-collapse-item v-for="(item,index) in options" :key="index">
            <template slot="title">
              <el-row type="flex" align="middle" justify="center">
                <el-col :span="4"><el-input v-model.trim="item.name"  placeholder="请输入主分类名称" style="width:200px" @click.stop.native="xianzhi" @keyup.stop.native="xianzhi"></el-input></el-col>
                <el-col :span="4">
                <el-input-number type="number" v-model.number="item.weight"  placeholder="请输入权重" style="width:110px" @click.stop.native="xianzhi" @keyup.stop.native="xianzhi" controls-position="right" :min="0" :max="100"></el-input-number>
                </el-col>
                <el-col :span="4" style="display: flex;justify-content: center;">
                  <!-- <el-input  placeholder="请输入内容" style="width:120px"></el-input> -->
                  <Avatar :url="item.icon" @success="item.icon = $event" :width="'40'" :height="'40'"/>
                </el-col>
                <el-col :span="4"><div>{{detailTimeFilter(0,0,item.createTime)}}</div></el-col>
                <el-col :span="4">
                  <div>
                    <el-button type="danger" plain size="middle" :disabled='disabled' @click.stop.native="saveDad(item)">保存</el-button>
                    <el-button type="danger" plain size="middle" :disabled='disabled' @click.stop.native="delDad(item)">删除</el-button>
                  </div>
                </el-col>
              </el-row>
            </template>
            <div v-for="(ite,indexs) in item.list" class="sonClassify" :key="indexs">
              <el-row type="flex" align="middle" justify="center">
                <el-col :span="4"><el-input v-model.trim="ite.name"  placeholder="请输入子分类名称" style="width:150px"></el-input></el-col>
                <el-col :span="4"><el-input-number type="number" v-model.number="ite.weight" placeholder="请输入权重" style="width:110px" controls-position="right" :min="0" :max="100"></el-input-number></el-col>
                <el-col :span="4" style="display: flex;justify-content: center;">
                  <Avatar :url="ite.icon" @success="ite.icon = $event" :width="'40'" :height="'40'"/>
                </el-col>
                <el-col :span="4"><div>{{detailTimeFilter(0,0,ite.createTime)}}</div></el-col>
                <el-col :span="4">
                  <div>
                    <el-button type="danger" plain size="middle" :disabled='disabled'  @click="saveSon(ite,item.id)">保存</el-button>
                    <el-button type="danger" plain size="middle" :disabled='disabled' @click="delSon(ite,index)">删除</el-button>
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
    </div>
  </div>
</template>
<script>
  // import { Button,Table,TableColumn,Input,Collapse,CollapseItem,Row,Col} from 'element-ui'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import {getgoodsCategory,delgoodsCategory,addgoodsCategory,updategoodsCategory} from '../../api/commodity.js'
  import Avatar from "../../components/Avatar.vue"
  import { detailTimeFilter} from "../../constant/filter";
  export default {
    name: 'mallClassifyGoods',
    components: {
      Breadcrumb,
      Avatar
    },
    data() {
      return {
        data: [],
        options:{},
        aaa:0,
        disabled:null,
        showDad:false,
        stopSon:false,
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
    },
    methods: {
      detailTimeFilter,
      init(){
        getgoodsCategory().then((data)=>{
          this.options=data
          this.showDad = false
          this.stopSon = false
        })
      },
      xianzhi(){

      },
      saveSon(res,resID){
        var newAddDad={}
        if(res.id){
          newAddDad.parentId=resID
          newAddDad.name = res.name
          newAddDad.icon = res.icon
          newAddDad.weight=res.weight
          updategoodsCategory(res.id,newAddDad).then((data)=>{
            if(data.code==812||data.code==813){
              return;
            }
            this.init()
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            newAddDad={}
          })
        }else{
          newAddDad.parentId=resID
          newAddDad.name = res.name
          newAddDad.icon = res.icon
          newAddDad.weight=res.weight
          addgoodsCategory(newAddDad).then((data)=>{
            if(data.code==812||data.code==813||data.code==814){
              return;
            }
            this.init()
            this.$message({
              type: 'success',
              message: '新建成功!'
            });
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
              newAddDad.name = this.options[key].name
              newAddDad.icon = this.options[key].icon
              newAddDad.weight=this.options[key].weight
            }
          })
          updategoodsCategory(res.id,newAddDad).then((data)=>{
          if(data.code==812||data.code==813){
              return;
            }
            this.init()
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            newAddDad={}
            this.showDad = false
          })
        }else{

          this.options.forEach((element,key) => {
            if(!element.id){
              newAddDad.parentId=0
              newAddDad.name = this.options[key].name
              newAddDad.icon = this.options[key].icon
              newAddDad.weight=this.options[key].weight
            }
          })
          addgoodsCategory(newAddDad).then((data)=>{
            if(data.code==812||data.code==813||data.code==814){
              return;
            }
            this.init()
            this.$message({
              type: 'success',
              message: '新建成功!'
            });
            newAddDad={}
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
          name:'',
          icon:'',
          weight:'',
          list:[]
        }
        this.options.unshift(newDad1)
        this.showDad=true
      },
      addSon(res){
        if(this.showDad){
          this.$message({
              type: 'warning',
              message: '您有一条主分类未完善,保存或删除，请继续操作!'
            });
          return;
        }
        let newSon1={
          parentId:res.id,
          name:'',
          icon:'',
          weight:''
        }
        this.options.forEach((element,key) => {
          if(element.id==res.id){
            this.options[key].list.unshift(newSon1)
            this.stopSon = true
          }
        })
      },
      delSon(res,index){
        this.$confirm('是否删除此子分类?', '提示', {
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
          delgoodsCategory(res.id).then((data)=>{
           if(data.code==815||data.code==811){
              return;
            }
            this.init()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
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
          delgoodsCategory(res.id).then((data)=>{
            if(data.code==815||data.code==811){
              return;
            }
            this.init()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>
<style lang='less' scoped>
  .mallClassifyGoods {
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
  .mallClassifyGoods{
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
        // .el-collapse-item{
        //   .el-collapse-item__header{

        //   }
        // }
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
            .el-row{
              .el-col{
                .el-input{
                  &:nth-of-type(1){
                    // margin-left:52px;
                  }
                }
              }
            }
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
  }
</style>
