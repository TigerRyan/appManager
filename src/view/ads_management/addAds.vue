<template>
  <div class="content_data addAds">
    <Breadcrumb/>
     <el-button type="primary" style="right: 30px;top: 15px" class="addbtn" :disabled="disabled" @click="goback">返回</el-button>
      <el-button type="primary" style="right: 120px;top: 15px" @click="submit" class="addbtn" :disabled="disabled">提交</el-button>
      <div class="formContent">
          <el-form :model="formOption" :rules="rules" ref="formOption" labelWidth="150px">
            <el-form-item label="广告名称" prop="advName">
              <el-input v-model="formOption.advName" placeholder="请输入广告名称..."/>
            </el-form-item>
            <el-form-item label="广告封面" prop="advCoverImg">
            <Avatar :url="formOption.advCoverImg" @success="getImg"/>  
            </el-form-item>
             <el-form-item label="开始结束时间" prop="timePicker">
              <div class="block">
                <el-date-picker
                  v-model="formOption.timePicker"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change='selectTime'
                  :picker-options="pickerOptions">
                  >
                </el-date-picker>
            </div>
            </el-form-item> 
            <el-form-item label="权重值设置" prop="advWeight">
               <el-input-number v-model="formOption.advWeight" :step="1" :min="0"/>
               <el-tag type="warning" style="font-size: 16px">数值越小,权重越大，排名越靠前</el-tag>
            </el-form-item>
            <el-form-item label="投放位置">
              <el-select v-model="formOption.advPosition"  @change="selectPos">
                <el-option v-for="(item,index) in areaOption" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
               <el-select v-model="formOption.advPosType" v-if="formOption.advPosition == 2" @change='selectPosType'>
                <el-option v-for="(item,index) in areaOption2" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
               <el-select v-model="formOption.advPosTypeid" v-if="formOption.advPosType == 1 && formOption.advPosition ==2" @change="selectClass">
                <el-option v-for="item in areaOption3" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跳转类型">
              <el-select v-model="formOption.advSkiptype" @change='selectTarget'>
                <el-option v-for="(item,index) in typeOption" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>           
            <el-form-item label="添加h5链接" prop="advLink" v-if='formOption.advSkiptype==1'>
              <el-input v-model.trim="formOption.advLink" placeholder="请输入添加h5链接..." />
            </el-form-item>
           </el-form>
      </div>
      <div class="list_content" v-if='formOption.advSkiptype==0'>
          <div class="time_search" v-if='flag'>
            <el-select v-model="formOption.advDatatype" @change='changeSelect'>
              <el-option
                v-for="item in DatatypeOption"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="search">
              <el-input placeholder="请输入..." style="width: 378px;" v-model="name"></el-input>      
            </div>
            <div class="block">
              <el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;"  round @click="search">查询</el-button>
              <el-button  icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"  round  @click="reset">重置</el-button>
            </div>
        </div>
        <div class="list">
            <TablePage  v-if='formOption.advDatatype==0' key=3>
              <el-table :data="listOption.list" element-loading-text="拼命加载中..."> 
                <!-- <el-table-column type="selection" width="80"/> -->
                <el-table-column min-width="40" v-if='flag'>
                <template slot-scope="scope">
                  <el-radio :label="scope.$index" v-model="radio" @change.native="getChecked(scope.row)">&nbsp;</el-radio>
                </template>    
                </el-table-column>  
                <el-table-column prop="" label="商品图片"  min-width="110">
                  <template slot-scope="scope">
                    <ImgView :src="scope.row.homeImg"/>            
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称"  min-width="110"/>
                <el-table-column prop="categoryName" label="商品分类"  min-width="110"/>
                <el-table-column prop="showPrice" label="商品价格(元)"  min-width="110"></el-table-column>
                <el-table-column prop="addedTime" label="上架时间" :formatter="dateTimeFilter" min-width="150"/>
                </el-table>
          </TablePage> 
           <TablePage  v-if='formOption.advDatatype==2'  key=1>
            <el-table :data="listOption.list" element-loading-text="拼命加载中..."> 
               <el-table-column min-width="40" v-if='flag'>
                <template slot-scope="scope">
                    <el-radio :label="scope.$index" v-model="radio" @change.native="getChecked(scope.row)">&nbsp;</el-radio>
                </template>    
                </el-table-column>    
                <el-table-column prop="mechanismName" label="机构名称"  min-width="110"/>
                <el-table-column prop="businessLicenceName" label="营业执照全称"  min-width="110"/>
                <el-table-column prop="businessLicenceNo" label="营业执照号"  min-width="110"/>
                <el-table-column prop="leaderName" label="负责人"  min-width="110"/>
                <el-table-column prop="createTime" label="申请时间" :formatter="dateTimeFilter" min-width="150"/>
                <el-table-column prop="passTime" label="通过时间" :formatter="dateTimeFilter" min-width="150"/>
            </el-table>
          </TablePage>
           <TablePage  v-if='formOption.advDatatype==1'  key=2>
            <el-table :data="listOption.list" element-loading-text="拼命加载中..."> 
               <el-table-column min-width="40" v-if='flag'>
                <template slot-scope="scope">
                    <el-radio :label="scope.$index" v-model="radio" @change.native="getChecked(scope.row)">&nbsp;</el-radio>
                </template>    
                </el-table-column>    
                <el-table-column prop="pic" label="用户头像"  min-width="110">
                    <template slot-scope="scope">
                      <ImgView :src="scope.row.pic"/>            
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="教师名称"  min-width="110"/>
                <el-table-column prop="phone" label="手机号"  min-width="110"/>
                <el-table-column prop="createtime" label="注册时间" :formatter="dateTimeFilter" min-width="150"/>
            </el-table>
          </TablePage>   
        </div>
        <MyPagination v-if='flag' :page="listOption.page" :size="listOption.pageSize" :method="findList" :total="listOption.total" :pageSizes="[5]"/>
        <el-button round type="primary" @click="sure()" class="sure">{{flag?'确定':'修改'}}</el-button>
      </div>
  </div>
</template>

<script>
  import {getAdsListApi,getGoodList,getInsList,getUserList,getCatList,addAds,getUserDetail,getGoodDetail,updateAds,getInsDetail,getAdsDetail} from '../../api/adsManagmentApi.js'
  import {success, error, confirm} from '../../actions'
  import {dateTimeFilter, noticeTypeFilter} from '../../constant/filter'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import Avatar from '../../components/Avatar.vue'

  import ImgView from '../../components/ImgView.vue'

  export default {
    name: 'Classification',
    components: {MyPagination, Breadcrumb, TablePage,Avatar,ImgView},
      data() {
          return {
            flag:true,
            save:{},
            radio:null,
            listOption:{
              page:1,
              pageSize:5,
              total:null,
              list:[]  
            },
            name:null,
            areaOption:[{name:'APP首页广告',value:0,id:0},{name:'启动页',value:1,id:1},{name:'商城首页',value:2,id:2},{name:'活动专区',value:3,id:3},{name:'智力游戏',value:4,id:4}],
            areaOption2:[{name:'全部',value:2,id:2},{name:'分类',value:1,id:1}],
            areaOption3:[],
            typeOption:[{name:'H5',value:1,id:1},{name:'内置',value:0,id:0}],
            DatatypeOption:[{name:'机构',value:2,id:2},{name:'教师',value:1,id:1},{name:'商品',value:0,id:0}],
            formOption: {
              advPosition:0,  //广告位置一级分类编号 ,
              advSkiptype:1,  // 跳转类型 ,
              advPosType:2, // 广告位置二级分类编号 ,
              advPosTypeid:null, //广告位置三级分类编号 , 
              advDatatype:3, //数据类型 ,
              advWeight:0, //权重
              advDatavalue:null, //数据类型对应的值
              advLink :null, //H5链接
              advCoverImg:null,//图片
              timePicker:[],//时间
            },
            dialog: {
                id: null,
                name: '',             
                title: "编辑科目"
              },
            rules: {
            advName :[
              {required: true, message: '广告名称不能为空...', trigger: 'blur'},
              { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "change" }
            ],
            advCoverImg :[{required: true, message: '图片不能为空...', trigger: 'blur'}], //图片
            advWeight :[{required: true, message: '不能为空...', trigger: 'blur'},
            {pattern: /^\d+$/, message: '必须为整数...', trigger: 'blur'}], 
            advLink:[
              {required: true, message: '跳转地址不能为空...', trigger: 'blur'},
              {pattern: /(http|ftp|https):\/\/([\w.]+\/?)\S*/, message: '请输入以http/https开头的链接地址', trigger: 'blur' }   
              ], //链接
            timePicker:[{required: true, message: '时间不能为空...', trigger: 'blur'}]
            },
            pickerOptions:{//设置时间是当天或者当天之后的时间
              disabledDate(time) {
               return time.getTime() < Date.now() - 8.64e7;
              }
            }
          }
        },
    created() {      
      // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false

      if(this.$route.query.id){  
        getAdsDetail(this.$route.query.id)
        .then(data=>{
          //console.log(data,"datail")

          if(data.type==2){ //编辑的时候如果是商城的话  投放的只能是商品
           this.DatatypeOption = [{name:'商品',value:0,id:0}]
          }
          if(data.type==1 || data.type==3 || data.type==4){ //编辑的时候如果是引导页 活动 游戏话  跳转类型只能是H5
             this.typeOption = [{name:'H5',value:1,id:1}]   
          }

          this.formOption.advName = data.title //名称
          this.formOption.advCoverImg = data.imgUrl //封面
          this.formOption.advPosition = data.type //一级分类
          this.formOption.advPosType = data.source //二级分类
          this.formOption.advPosTypeid = data.categoryId //三级分类 
          this.formOption.advSkiptype = data.linkType  //跳转类型
          this.formOption.advLink = data.url  //H5链接
          this.formOption.advDatatype = data.dataType //数据类型
          this.formOption.advDatavalue = data.dataId  //数据类型对应的值
          this.formOption.timePicker= [data.starttime,data.endtime] //时间
          this.formOption.advWeight = data.num  //权重值

          this.getGoodsClass() //获取到商品的分类
          this.flag = false 

          if(this.formOption.advDatatype == 1){ //老师详情
            getUserDetail(this.formOption.advDatavalue).then(data=>{this.listOption.list=[data]}) 
          }else if(this.formOption.advDatatype == 0){//商品详情 
          //console.log('商品详情',this.formOption.advDatavalue)       
            getGoodDetail(this.formOption.advDatavalue).then(data=>{               
              this.listOption.list = [data]
              this.listOption.list[0].name = data.goodsName;
              //console.log(data.goodsCategoryId,"id")
              setTimeout(()=>{ //通过商品分类的ID获取商品分类的名称
                //console.log(this.areaOption3,data)
                  this.areaOption3.forEach(item=>{
                    if(item.id == data.goodsCategoryId){                     
                      this.$set(this.listOption.list[0],'categoryName',item.name) 
                    }
                  }) 
              })            
            })            
          }else if(this.formOption.advDatatype == 2){//机构详情
            getInsDetail(this.formOption.advDatavalue).then(data=>{
              //console.log(data,"机构") 
              this.listOption.list=[data]
              this.listOption.list[0].mechanismName = data.name            
            })
          }
        })         
      }
    },
    methods: {
      dateTimeFilter,
      noticeTypeFilter,
      getImg(url){
        this.formOption.advCoverImg = url
        if(url){
          this.$refs.formOption.validateField('advCoverImg')  
        }  
      },
      selectTime(val){
         if(val){
          this.$refs.formOption.validateField('timePicker') 
        }
        this.formOption.timePicker = val 
        //console.log(val,"time")         
      },
      goback(){ //返回
         this.$router.push({name:'adslist'}) 
      },
      handleClose() {
        // this.$refs.notice.resetFields();
      },
      getChecked({id}){
        this.save = id  
      },
      sure(){ //修改及确定 
        if(this.save == null && this.flag){
          error("请选择投放的内容") 
        }else{
          this.flag = !this.flag
          if(!this.flag){
            this.listOption.list = this.listOption.list.filter(item=>item.id == this.save) 
            this.formOption.advDatavalue = this.save  
          }else{
            this.formOption.advDatavalue = null
            this.findList({page:1})
          }         
        }     
        //console.log(this.save,"save")        
      },
      selectClass(){ //三级分类
        this.flag = true; 
      },
      selectPosType(val){　//二级全部或分类
        this.flag = true
        this.formOption.advPosTypeid = null
        if(val == 1){ //分类的情况
          getCatList({}).then(data=>{
          this.areaOption3 = data 
          this.formOption.advPosTypeid = this.areaOption3&&data[0].id? data[0].id :''
          })            
          this.findList({page:1})    
        }      
      },
      getGoodsClass(){//获取商品的分类
        getCatList({}).then(data=>{
          this.areaOption3 = data               
        }) 
      },
      selectPos(val){　//一级
        this.flag = true
        if(val == 2){//一级分类商城
          this.typeOption = [{name:'H5',value:1,id:1},{name:'内置',value:0,id:0}]
          this.DatatypeOption = [{name:'商品',value:0,id:0}]
          this.formOption.advPosType = 2; //全部或分累
          this.formOption.advDatatype = 0 //数据类型是商品了
          this.formOption.advSkiptype = 1  //此时跳转类型是内置
        }else if(val == 0){//一级分类首页
          this.typeOption =  [{name:'H5',value:1,id:1},{name:'内置',value:0,id:0}]
          this.DatatypeOption = [{name:'机构',value:2,id:2},{name:'教师',value:1,id:1},{name:'商品',value:0,id:0}]
          this.formOption.advPosType = null; //没有全部或分累
          this.formOption.advPosTypeid = null; //没有三级的分类了   
        }else if(val == 1 || val == 3 || val == 4){ //一级分类是活动专区 引导页 游戏专区的时候       
           this.typeOption = [{name:'H5',value:1,id:1}]
           this.formOption.advSkiptype = 1  //此时跳转类型是H5
        }
        //console.log(this.formOption.advSkiptype)
        this.findList({page:1})
      },
      selectTarget(val){ //跳转类型  0是内置1是H5
      //console.log(val,"跳转类型")
        this.flag = true
        this.formOption.advDatatype = val==0?0:'' //如果跳转类型是内置的话 默认数据类型是商品
      },

      findList(page = {}){ //新增的时候获取到每种数据类型的列表
        this.radio = null  //获取数据列表分页的时候清空之前选中的按钮和保存的按钮ID
        this.save = null
         if(this.formOption.advDatatype == 0){//商品
            getGoodList({...page,pageSize:5,name:this.name}).then((data) => {              
              this.listOption = {...this.listOption, ...page, ...data,loading: false,}
              //console.log(this.listOption.total,this.listOption.pageNum,"p")
            }) 
          }else if(this.formOption.advDatatype == 1){//教师
            getUserList({...page,pageSize:5,name:this.name}).then((data) => {
              this.listOption = {...this.listOption, ...page, ...data, loading: false}
          }) 
          }else if(this.formOption.advDatatype == 2){ //机构
            getInsList({...page,pageSize:5,query:this.name}).then((data) => {
              this.listOption = {...this.listOption, ...page, ...data, loading: false}
          })
         } 
      },
      changeSelect(){//数据类型选择
        this.findList({page:1})
      },
      search(value){//搜索
        this.findList({page:1})
      },
      reset(){//重置
         this.name = null 
         this.findList({page:1}) 
      },
      add(){//新增
          this.show = true 
      },

      submit(){//提交
          this.$refs.formOption.validate(valid=>{
            if(valid){
                if(this.formOption.advDatavalue == null && this.formOption.advSkiptype==0){
                  error("请选择需要投放的内容")  
                }else{
                  //console.log(this.formOption,'this.formOption')
                  var obj = {}
                  obj.advPosType  = this.formOption.advPosition==2?this.formOption.advPosType:null; //当是商城的时候 有全部或分类(二级分类)否则为null
                  obj.advPosTypeid  = this.formOption.advPosType==1?this.formOption.advPosTypeid:null; //当是全部的时候 三级分类为null
                  obj.advDatatype  = this.formOption.advSkiptype==0?this.formOption.advDatatype:null;//当跳转类型是内置 0的时候  数据类型有值 否则是null
                  obj.advDatavalue  = this.formOption.advSkiptype==0?this.formOption.advDatavalue:null;//当跳转类型是内置 0的时候  数据值有ID 否则是null
                  
                  //注释可以保留之前的H5值
                  //obj.advLink = this.formOption.advSkiptype == 1?this.formOption.advLink:null;//当跳转类型是H5 1的时候 跳转连接有值否则是null

                  let starttime  = this.formOption.timePicker.length > 1?this.formOption.timePicker[0] : this.formOption.starttime 
                  let endtime  =   this.formOption.timePicker.length > 1?this.formOption.timePicker[1] : this.formOption.endtime 

                  //console.log(starttime,"starttime",endtime,"endtime") 

                  if(this.$route.query.id){
                      updateAds({...this.formOption,...obj,id:this.$route.query.id*1,starttime,endtime})
                      .then(data=>{ //解构过data返回的是null 不能根据code去判断成功与否 只有成功了才能进入这个函数
                        // if(data){
                          success(`更新成功即将跳转到列表页`)
                          localStorage.removeItem('adsOption');
                          setTimeout(() => {
                            this.$router.push({name:'adslist'})  
                          }, 1000);
                        // }
                      })
                      .catch(({msg})=>{error(msg)})
                  }else{
                    addAds({...this.formOption,...obj,starttime,endtime})
                    .then(data=>{
                      // if(data){
                        success(`新增成功即将跳转到列表页`)
                         setTimeout(() => {
                            this.$router.push({name:'adslist'})  
                          }, 1000);
                      // }
                    })
                    .catch(({msg})=>{error(msg)})
                  }
                }             
            }else{
              return false
            }
          }) 
      }
    },
  }
</script>
<style lang="less">
  .addAds{
    .sure{
      margin:40px 0 40px 50%;
      position: relative;
      width:200px;
      left:-100px;

    }
    .formContent{
      background-color: #fff;
      padding:30px 0;
    }
    .el-form{
      width: 900px;
      margin: auto;
      
    }
     .addbtn {
        position: absolute;
        right: 0;
        top: 10px ;
    }

     // 搜索
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    margin-top: 20px;
    .block {
      margin-left: 40px;
      .el-range-separator {
        width: 10%;
      }
      .el-button {
        margin-left: 10px !important;
      }
    }
    .search {
      height: 74px;
      display: flex;
      // align-items: center;
      background-color: #fff;
      padding-left: 30px;
      .el-input {
        width: 250px !important;
      }
    }
  }
  }
</style>
