<template>
  <div class="videoDetail content_data">
      <div class="content-title">视频专题详情
        <Button type="primary" round  @click="VideoEdit">编辑</Button>
      </div>
      <div class="detailCenter">
        <Dialog  :visible.sync="dialogVisiblePrice" center :modal-append-to-body="false" custom-class="dialog-02" @close="
        Sectionclose">
            <span slot="title" class="dialog-title">编辑视频专题价格</span>
            <Form ref="PriceForm" :model="ruleFormSupplementary" label-width="150px" :rules="rules">
              <!-- <FormItem label="视频专题名称" prop="name">
                <Input placeholder="请输入视频专题名称"  v-model="ruleFormSupplementary.name"/>
              </FormItem>
              <FormItem label="课程id"  prop="id" >
                <Input placeholder="请输入视频专题id"  v-model="ruleFormSupplementary.id"/>
              </FormItem>
              <FormItem label="教师名字"  prop="teacherName">
                <Select ref="saveTagInput0" v-model.trim="ruleFormSupplementary.teacherName" placeholder="请选择教师">
                      <Option :value="item.teacherId+','+ item.teacherName" :label="item.teacherName"  v-for="(item,index) in showteacherId" :key="item.teacherId">
                        {{item.teacherName}}
                      </Option>
                    </Select>
              </FormItem>
              <FormItem label="授课教师图片"  prop="teacherPic">
                <div class="img_box">
                  <Avatar :url="ruleFormSupplementary.teacherPic" @success="ruleFormSupplementary.homeImg = $event"/>
                </div>
              </FormItem>
              <FormItem label="教学年级" prop="grade" class="tagColitemWidth" >
                <Col :span="8" class="courseCreate" v-for="(tag,index) in showgroups" :key="index">
                  <Tag :key="tag" closable :disable-transitions="false" 	@close="handleClose(tag,0)">
                    {{tag}}
                  </Tag>
                </Col>
                <Col :span="8" class="courseCreate" >
                  <Select ref="saveTagInput0" v-model.trim="inputValue[0]" placeholder="请选择教学年级" v-if="inputVisible.flag1" @blur="handleInputConfirm(0)">
                    <Option :value="item.id" :label="item.contant"  v-for="(item,index) in grades" :key="item.id">
                      {{item.contant}}
                    </Option>
                  </Select>
                  <Button v-else class="button-new-tag" size="small" @click="showInput(0)">点击添加</Button>
                </Col>
              </FormItem>
              <FormItem label="教学科目" prop="subject">
                <Col :span="8" class="courseCreate" v-for="(tag,index) in showsubjects" :key="index">
                  <Tag :key="tag" closable :disable-transitions="false" 	@close="handleClose(tag,1)">
                    {{tag}}
                  </Tag>
                </Col>
                <Col :span="8" class="courseCreate">
                  <Select v-model.trim="inputValue[1]" placeholder="请选择教学科目" ref="saveTagInput1" v-if="inputVisible.flag2"  @blur="handleInputConfirm(1)">
                    <Option :value="item.id" :label="item.contant"  v-for="(item,index) in subjects" :key="item.id">
                      {{item.contant}}
                    </Option>
                  </Select>
                </Col>
              </FormItem>
               <FormItem label="课程优势" prop="labels" class="tagColitemWidth">
                  <Col :span="8" v-for="(tag,index) in ruleFormSupplementary.labels" :key="index"  class="courseCreate">
                    <Tag :key="tag" closable 	:disable-transitions="false" 	@close="handleClose(tag,2)">
                      {{tag}}
                    </Tag>
                  </Col>
                  <Col :span="8" class="courseCreate">
                    <Input 	class="input-new-tag" v-if="inputVisible.flag3" v-model="inputValue[2]" maxlength="4"  ref="saveTagInput2" size="small" 	@keyup.enter.native="handleInputConfirm(2)"	@blur="handleInputConfirm(2)" >
                    </Input>
                    <Button v-else class="button-new-tag" size="small" @click="showInput(2)">点击添加</Button>
                  </Col>
              </FormItem>   -->
              <FormItem label="视频专题原价"  prop="salePrice">
                <Col :span="14">
                  <Input  type="number"  v-model.number="ruleFormSupplementary.salePrice"/>
                </Col>
                <Col :span="2" style="text-align:center;">
                元
                </Col>
              </FormItem>
              <FormItem label="视频专题优惠价"  prop="discountPrice">
                <Col :span="14">
                  <Input  type="number"  v-model.number="ruleFormSupplementary.discountPrice"/>
                </Col>
                <Col :span="2" style="text-align:center;">
                元
                </Col>
              </FormItem>
            </Form> 
            <span slot="footer" class="dialog-footer">
              <div class="PriceSetTitle">
              </div>
              <Button @click="dialogVisiblePrice  = false" round>取消</Button> 
              <Button type="primary" round  @click="SectionAffrim">确认</Button>
            </span>
        </Dialog>
        <div class="detail_img"><img :src=" data.homeImg ||'../../../../static/img/login/1.jpg'"></div>
        <div class="detailMessage">
          <Col :span="8">
            <div class="deatilId">
             <div class="deatilId_left">
               <ul>
                 <li>课程ID</li>
                 <li>课程专题名称</li>
                 <li>教学年级</li>
                 <li v-if="teacherDisplay">授课教师</li>
               </ul>
             </div>
             <div class="deatilId_right">
               <ul>
                 <li>{{data.id}}</li>
                 <li>{{data.name}}</li>
                 <li><span  v-for="tag in gradeNameList">{{tag}}</span></li>
                 <li v-if="teacherDisplay">
                   <dl>
                     <dt><span><img :src="data.teacherPic" style="width:100%;height:100%;border-radius:50%;"/></span></dt>
                     <dd>{{data.teacherName}}</dd>
                   </dl>
                 </li>
               </ul>
             </div>
            </div>
          </Col>
          <Col :span="9">
            <div class="deatilyss">
                <dl class="coureys">
                <dt>课程优势</dt>
                <dd><span v-for=" (item,index) in messageLines" :key="index">{{item}}</span></dd>
              </dl>
              <dl>
                <dt class="courekm">课程科目</dt>
                <dd><span>{{data.subjectName }}</span></dd>
              </dl>
              <dl class="courePrice">
                <dt>原价(元)</dt>
                <dd><span>{{data.salePrice}}</span></dd>
              </dl>
              <dl class="courePrice">
                <dt>优惠价(元)</dt>
                <dd><span>{{data.discountPrice}}</span></dd>
              </dl>
            </div>
              
          </Col>
          <Col :span="7">
            <div class="detilrs">
              <div class="detilrs_zan">
                <dl>
                  <dt><img src="/static/img/zan.png" alt="点赞"></dt>
                  <dd>点赞人数</dd>
                </dl>
                <p>{{data.followCount}}</p>
              </div>

            </div>
          </Col>
        </div>
      </div>
      <div class="detailLefft">
        <div class="detailLefft_top">
          <ul><li v-for="(item,index) in list" @click="SetSignType(index)" :class="{active:sign_type==index}" :key="index">{{item}}</li></ul>
          <div class="detailLefft_btn">
            <Button type="primary"  round @click="$router.push(`/view/video/chapter?id=${data.id}`)">审核章节</Button>
          </div>
        </div>
        <div class="detailCut">
          <Dialog  :visible.sync="dialogVisible " center :modal-append-to-body="false" custom-class="dialog-01" >
            <span slot="title" class="dialog-title">提示</span>
            <span>删除该课程可能会影响学生的学习记录，请确认是否删除！</span>
            <span slot="footer" class="dialog-footer">
              <Button @click="dialogVisible  = false" round>取消</Button>
              <Button type="danger" @click="dele" round >确定删除</Button>
            </span>
          </Dialog>
          <transition name="manage-data" mode="out-in" >
             <div v-if="sign_type===0">
               <TablePage>
                  <Table :data="dataList.list">
                    <TableColumn prop="courseNumber" label="序号" sortable width='100px' sortable/>
                    <TableColumn prop="videoUrl" label="视频地址"/>>
                    <TableColumn prop="createTime" :formatter="dateTimeFilter"  label="创建时间"/>
                    <TableColumn prop="free" :formatter="videoCourseFree" label="是否收费"/>
                    <TableColumn prop="status" :formatter="charpterStatusFilter" label="状态"/>
                    <TableColumn label="操作" min-width="250px;">
                      <template slot-scope="scope">
                        <Button type="danger" size="small" :disabled='disabled'  @click="delet(scope.row)">删除</Button>
                        <Button type="primary" size="small"   @click="setCharge(scope.row)" v-if="scope.row.free==0">设置收费</Button>
                        <Button type="primary" size="small"   @click="setGratis(scope.row)" v-if="scope.row.free">设置免费</Button>
                      </template>
                    </TableColumn>
                  </Table>
              </TablePage>
              <MyPagination :page="data.page" :pageSize="data.pageSize" :method="findList" :pageSizes=[10] :total="data.total" ></MyPagination>
             </div>
          </transition>
        </div>
      </div>
  </div>
</template>
<script>
import {Row ,Col,Table,TableColumn,Button,Dialog,Form,FormItem,Input,Select,Option,Tag } from 'element-ui'
import {getVideoDetailApi, getVideoCourseListApi, deleteVideoCourseChapter, setVideoCourseFree, updatePrice} from '../../api/videoDetailApi.js'
import TablePage from '../../components/TablePage.vue';
import MyPagination from "../../components/MyPagination.vue";
import Avatar from '../../components/Avatar.vue'
import {dateTimeFilter,charpterStatusFilter,videoCourseFree} from '../../constant/filter'
import {success,error} from '../../actions'
export default {
name:'videoDetail',
components:{Row,Col,Table,TableColumn,Button,TablePage,MyPagination,Dialog,Form,FormItem,Input,Select,Option,Avatar,Tag },
data(){
  return{
    list:['课程章节'],
    message:'',//登录信息
    dialogVisible: false,
    dialogVisiblePrice: false, //编辑视频专题详情
    teacherDisplay:true,//老师隐藏
    disabled:false,
    // PriceStatus:0, // 0视频专题价格 1课程章节价格
    Sectionidx: null, //章节序号
    sign_type:0,
    subject:'',
    subjectI:'',
    editvalue: '编辑',
    editstatus: 1, //编辑状态1编辑2保存
    grade:'',
    data:{ topicId:this.$route.query.id,page:1,pageSize:10},
    dataList:{//展示信息
      list:[]
     
    },
    display:true,
    section:{},
    teacherHide: false,
        // tag显示影藏
    // inputVisible: {
    //   flag1: false,
    //   flag2: true,
    //   flag3: false
    // },
    inputValue: ['', '', ''],//3个输入框输入
    ruleFormSupplementary: {
      id: null,              // 专题id 
      salePrice: null,       // 原价
      discountPrice: null,   // 优惠价

    },
     // 新建tag
    // grades: [],//年级
    // subjects:[],//科目
    // showgroups: [],//年级展现
    // showsubjects:[],//科目展示
    // showteacherId: [],
    rules:{
      // name: [
      //   { required: true, message: '请输入直播专题名称', trigger: 'blur' },
      //   { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
      // ],
      // teacherName: [{required: true, message: '请输入授课教师', trigger: 'change'}],
      // grade: [
      //     { required: true, message: '请选择教学年级', trigger: 'change' }
      //   ],
      // subject: [
      //       { required: true, message: '请选择教学科目', trigger: 'change' }
      //     ],
      // labels: [
      //     { required: true, message: '请选择教学优势', trigger: 'change' }
      //   ],
      // teacherPic:[
      //     { required: true, message: "请上传视频封面", trigger: "blur" }
      //   ],
      // salePrice:[
      //     { required: true, message: '请输入视频专题价格',trigger: 'blur'},
      //     {pattern: /(?!^0+\.0{0,2}$)(^\d+$|^\d+\.\d{2}$)/, message: '专题价格不能为负数且需保留两位小数', trigger: 'blur' },
      // ],
      // grade:[{required: true, message: "年级不能为空", trigger: "change"}],
      salePrice:[{required: true, message: "课程原价不能为空", trigger: "blur"},{pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '任意正整数，正小数（小数位不超过2位', trigger: 'blur'}],
      discountPrice:[{required: true, validator: (rule, value, callback) => {
      if(value===''){
          callback(new Error('专题优惠价格不能为空'))
      }
      else if(!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)){
            
            callback(new Error('任意正整数，正小数（小数位不超过2位）'))
      }
      else if(value>this.ruleFormSupplementary.salePrice) {
              callback(new Error('专题优惠价格不能大于专题原价'))
            }
        else{
          callback()
        }    
            },trigger: 'blur'}],
    }
  }
},
computed:{
    messageLines: function() {
        return (this.data.labels || "").split(",");
    },
    gradeNameList: function(){
        return (this.data.gradeName || "").split(",");
    }
    },
created() {
   let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = usrType ? true:false
    getVideoDetailApi(this.data.topicId).then(res =>{
      this.data={...this.data,...res}
    
 
    })

  
  
  this.findList()

  this.init()
},
methods:{
  dateTimeFilter,
  charpterStatusFilter,
  videoCourseFree,
  init(){
  },
  findList(page={}){
    getVideoCourseListApi({topicId:this.$route.query.id,...page}).then(res =>{
      this.data = { ...this.data, ...res, ...page};
      this.dataList ={...this.dataList,...res}
  })
  },
  delet({id}){
    this.dialogVisible  = true
    this.subjectI=id
  },
  dele(){
    let id = this.subjectI
    deleteVideoCourseChapter(id).then(()=>{
      this.dialogVisible  = false
      this.subjectI=null
      success('删除成功')
      this.findList()
    })
  },
  // 价格设置
  affirm(){
    this.PriceStatus = 0
    this.dialogVisiblePrice = true
  },
  // 关闭专题设置弹框
  Sectionclose(){
    this.$refs.PriceForm.resetFields()
  },
  //视频专题详情编辑
  VideoEdit(){
    this.dialogVisiblePrice = true
    getVideoDetailApi(this.data.topicId).then(res =>{
     this.ruleFormSupplementary = {...this.ruleFormSupplementary,...res}

      // this. ruleFormSupplementary.labels = res.labels.split(',')
      // this.showgroups = res.gradeName.split(',')
      // this.showsubjects = res.subjectName.split(',')
    })
  },
    // 点击删除动态tag
  // handleClose(tag, index) {
  //   if (index == 0) {
  //     this.ruleFormSupplementary.grade.splice( this.showgroups.indexOf(tag), 1)
  //     this.showgroups.splice( this.showgroups.indexOf(tag), 1)

  //     this.ruleFormSupplementary.subject = []
  //     this.showsubjects = []
  //     // this.inputValue[1] = ""
  //     this.inputVisible.flag2 = true
  //     // this.findGradesList()
  //     // this.findSubjctList()
  //   }
  //   if (index == 1) {
  //     // this.showsubjects=[]
  //     this.ruleFormSupplementary.subject.splice( this.showsubjects.indexOf(tag), 1)
  //     this.showsubjects.splice( this.showsubjects.indexOf(tag), 1)

  //     this.inputVisible.flag2=true
  //     // this.findSubjctList()
  //   }
  //   if (index == 2) {
  //     this.ruleFormSupplementary.labels.splice(this.ruleFormSupplementary.labels.indexOf(tag),1)
  //   }
  // },
  // showInput(index) {//点击添加
  //   if (index == 0) {
  //     this.inputVisible.flag1 = true
  //   }
  //   if (index == 2) {
  //     this.inputVisible.flag3 = true
  //     // 点击编辑之后获取焦点
  //   }
  //   if (this.$route.query.id!=='CREATE') {
  //       return;
  //     }
  //   if (index == 1) {
  //     this.inputVisible.flag2 = true
  //   }

  // },
  // handleInputConfirm(index) {//失去焦点
  //   let inputValue = this.inputValue[index]
  //   if (index == 0) {
  //     if (inputValue) {
  //       if (this.ruleFormSupplementary.grade.length >= 6) {
  //         this.$message({
  //           message: '最多可添加6个',
  //           type: 'warning'
  //         })
  //       } else {
  //           var inputcentent = this.grades.filter((item, index) => {
  //           return item.id == inputValue
  //         })
  //           this.ruleFormSupplementary.grade.push(inputValue)
  //           this.showgroups.push(inputcentent[0].contant)
  //           this.inputVisible.flag1 = false
  //             this.grades.forEach((element,index) => {
  //           if(element.id==this.inputValue[0]){
  //               this.grades.splice(index,1)
  //           }
  //         });
  //         // this.findSubjctList()
  //         this.$refs.ruleForm.validateField('grade')
  //       }
  //     }
  //   }
  //   if (index == 1) {
  //     if (inputValue) {
  //       if (this.ruleFormSupplementary.subject.length >= 6) {
  //         this.$message({
  //           message: '最多可添加6个',
  //           type: 'warning'
  //         })
  //       } else {
  //         var inputcentent = this.subjects.filter((item, index) => {
  //           return item.id == inputValue
  //         })
  //         this.showsubjects.push(inputcentent[0].contant)
  //         this.ruleFormSupplementary.subject.push(inputValue)
  //         this.findGradesList()
  //         this.findSubjctList()
  //         this.inputVisible.flag2 = false
  //         this.$refs.ruleForm.validateField('subject')
  //       }
  //     }
  //   }
  //   if (index == 2) {
  //     this.inputVisible.flag3 = false
  //       this.inputVisible.flag3 = false
  //         if( /^[\u4E00-\u9FA5A-Za-z\.]+$/.test(inputValue)&&this.ruleFormSupplementary.labels.length <6)
  //     {
  //           let arr =[]
  //             arr.push(inputValue)
  //             for(var i=0;i<arr.length;i++){
  //                   if(this.ruleFormSupplementary.labels.indexOf(arr[i])==-1)
  //                   {
  //                     this.ruleFormSupplementary.labels.push(arr[i])
  //                   }
  //                   else{
  //                       this.$message({
  //                       message: '课程优势不能重复',
  //                       type: 'warning'
  //                       });
  //                   }
  //               }
  //         this.$refs.ruleForm.validateField('labels')
  //     }
  //     else{
  //         this.$message({
  //           message: "最多可添加6个请输入中文和英文字符",
  //           type: "warning"
  //         });
  //     }
  //   }
  //   this.inputValue[index] = ''
  // },
  //设置收费
  setCharge({id,name}){
    setVideoCourseFree({id,free:1}).then(()=>{
      success(`课程章节"${name}"设置收费成功！`)
      this.findList()

    })
  },
  //设置免费
  setGratis({id,name}){
     setVideoCourseFree({id,free:0}).then(()=>{
      success(`课程章节"${name}"设置免费成功！`)
      this.findList()

    })

  },
  // 提交专题价格设置
  SectionAffrim(){
    const {id,salePrice,discountPrice} = this.ruleFormSupplementary
    this.$refs.PriceForm.validate(val=>{
      if(val)
      { 
        updatePrice({id,salePrice,discountPrice}).then(()=>{
          success(`视频专题价格设置成功`)
          this.dialogVisiblePrice = false
          getVideoDetailApi(this.data.topicId).then(res =>{
          this.data={...this.data,...res} })
        })
       

      }
    })


  
  }, 

}
}
</script>
<style lang='less' scoped>
.videoDetail{
//线下课程按钮
.el-button{
  width: 100px;
  height: 40px;
  padding: 0;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
}
.content-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  padding-left: 30px;
  padding-right: 30px;
}
.detailCenter{
  background: #fff;
  padding: 26px 30px;;
  display: flex;
  justify-content:space-between;
  >.detail_img{
    padding-top: 14px;
    width: 320px;
    height: 245px;
    img{
      width: 100%;
      height: 230px;
    }
  }
  >.detailMessage{
    flex :1;
    >.el-col:nth-of-type(3){
        border-right: none;
    }
    .el-col{
      height: 100%;
      font-size: 16px;
      color: #333333;
      border-right: 1px solid #e1e6e8;
      padding-right: 3%;
      padding-left: 3%;
      .deatilId_left{
        >ul{
          li:nth-of-type(1) {
            margin-top: 25px;
          }
          li:nth-of-type(3) {
            margin-bottom: 56px;
          }
           li:nth-of-type(4){
            margin-bottom: 0;
            line-height: 40px;
           }
        }
        ul li{
          margin-bottom:40px;
          text-align: left;
          width: 100px;
        }

      }
      .deatilId_right{

        >ul{
         li:nth-of-type(1){
          margin-top: 25px;

         }
          li:nth-of-type(3){
          margin-bottom: 0;
          width: 180px;
          height: 70px;
          // overflow:hidden;
          // text-overflow:ellipsis;
          // display:-webkit-box;
          // -webkit-box-orient:vertical;
          // -webkit-line-clamp:2;
           span{
             margin-right: 10px;
             display: inline-block;
             margin-bottom: 13px;
           }
         }
        }
        ul li{
          margin-bottom:40px;
          text-align: left;
          dl{
            display: flex;
            dt{
              margin-right: 21px;
             span{
                display: inline-block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #333333;
              }
            }
            dd{
              line-height: 40px;
            }
          }
        }
      }
    .deatilId{
     width: 100%;
     height: 100%;
     display: flex;
     justify-content: space-between;
     }
    .deatilyss{
     width: 100%;
     height: 100%;
     display: flex;
     justify-content: space-between;
     flex-wrap: wrap;
       dl{
       display: flex;
      justify-content: space-between;
      width: 100%;
      line-height: 30px;
      dt{
        text-align: left;
        width: 100px;
      }
      dd{
        text-align: left;
        flex: 1;
      }
     }
     //课程优势
     dl.coureys{
       height: 80px;

       dd{
         text-align: left;
         span{
           display: inline-block;
           width: 90px;
           height: 30px;
           line-height: 30px;
           text-align: center;
           background-color: #e4f4ff;
           color:#7fccfd;
           margin-bottom: 5px;
           margin-left: 5px;
           border-radius: 5px;
         }
       }
     }
     //课程价格
     dl.courePrice{
       height: 60px;
       line-height: 60px;
    

     }

    }
    .detilrs{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      padding-top: 25px;
      .detilrs_zan{
        display: flex;
        height: 80px;
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
       dl{
        display: inherit;
        height: 31px;

        dd{
          padding-top: 15px;
          margin-left: 11px;

        }
       }
       p{
          flex: 1;
          height: 31px;
          line-height: 31px;
          text-align: left;
          padding-left: 39px;
          font-size: 24px;
          font-weight: bold;
        }
      }

     }
    }
    //媒体查询
    @media screen and (max-width: 1440px){
      .el-col{
        font-size: 14px;
      }
      .el-col-8{
        width:35%;
        font-size: 14px;
        padding-left: 5px;
        padding-right: 5px;
        .deatilId_right{
          >ul{
            li:nth-of-type(3){
              width: 159px;
            }
          }
        }


      }
      .el-col-9{
        width: 50%;
        padding-left: 5px;
        padding-right: 5px;
      }
      .el-col-7{
        width: 15%;
        padding-left: 5px;
        padding-right: 5px;

        .detilrs{
          flex-wrap: wrap;
        }
      }
    }
  }
}
.detailLefft{
    background: #fff;
    width: 100%;
    display: inline-block;
    background-color: #edf1f5;
    .detailLefft_top{
      height: 64px;
      background-color: #ffffff;
      margin-top: 20px;
      margin-bottom: 20px;
      width: 100%;
      padding-right: 30px;
      padding-left: 30px;
      .detailLefft_btn{
        height: 100%;
        line-height: 64px;
        float: right;
      }
    }
    ul{
      display: inline-block;
      height:64px;
     li{
        float: left;
        line-height: 64px;
        margin-right: 32px;
        font-size: 18px;
        color: #333333;
        cursor: pointer;
      }
      .active{
        color: #51c5ff;
        border-bottom: 4px solid #51c5ff;
      }
      li:nth-of-type(4){
        margin-left: 0;
      }
    }
    .detailCut{
      width: 100%;
      display: inline-block;
      height: 100%;
      transition: all .5s ease;
      background-color: #fff;
      overflow: hidden;
      .manage-data-enter-active, .manage-data-leave{
        transition: all .5s ease;
        opacity: 1;
        transform: translateX(0);
      }
      .manage-data-enter{
        transition: all .5s ease;
        opacity: 0;
        transform: translateX(-50%);
      }
       .manage-data-leave-active{
         display: none;
       }
      .manage-data-enter{
        transform: translateX(50%);
      }
      .sinUp{
        background-color: #edf1f5;
      .el-col-6{
          width: 20%;
          padding: 0 10px 20px 10px;
        }
        .sinUpDetails{
          text-align: center;
          >div{
            width: 100%;
            height: 300px;
            background-color: #ffffff;
            color: #666666;
            p{
              margin-bottom: 15px;
              display: flex;
              font-size: 16px;
              justify-content: center;
              align-items: center;
              img{
                width: 110px;
                height: 110px;
                background-color: indigo;
                border-radius: 50%;
              }
            }
            >p:first-child{
              height: 196px;
              width: 100%;
              margin-bottom:0;
            }
            >p:nth-of-type(2){
              font-size: 20px;
              font-weight: bold;
              color: #333333;
            }
          }
        }

      }
      .attendNotice{
        display: flex;
        justify-content: space-between;
        height: 698px;
        overflow: hidden;
        overflow-y: auto;
        width: 100%;
        .el-button{
          height: 40px;
        }
      }
    }
  }
}
</style>
<style lang="less">
// 一号删除弹出层，
.videoDetail{
    .dialog-01{
    text-align: left;
    border-radius: 6px;
    color: #333333;
    margin-top: 40vh !important;
    width: 400px;
    .el-dialog__header{
      padding: 18px 40px 14px 41px;
      font-size: 18px;
      box-shadow: 0px 1px 0px 0px
      #d9dbe2;
      img{
        vertical-align:middle;
        margin-right: 15px;
      }
      .dialog-title{
            line-height: 49px;

      }
      .el-dialog__headerbtn{
        font-size: 20px;
        color: #b6b7b8;
        line-height: 48px;
        margin-right: 22px;
      }
    }
    .el-dialog__body{
      padding: 40px 41px 28px 40px;
      p{
        font-size: 16px;
        color: #666666;
        line-height: 1;
        margin-bottom: 19px;
      }
      .textarea01{
        width: 100%;
        height: 240px;
        .el-textarea__inner
        {
          width: 100%;
          height: 100%;
          padding: 12px 15px;
          color: #999999;
        }
      }

    }
    .el-dialog__footer{
        text-align: center;
        padding: 0 41px 37px 40px;
    }
    }
    .table_page{
      margin-top:0;
      width:100%;
    }
  //价格设置弹框
 .dialog-02{
    text-align: center;
    border-radius: 6px;
    color: #333333;
    margin-top: 40vh !important;
    width: 500px;
    .el-dialog__header{
      padding: 18px 40px 14px 41px;
      font-size: 18px;
      box-shadow: 0px 1px 0px 0px
      #d9dbe2;
      text-align: left;
      img{
        vertical-align:middle;
        margin-right: 15px;
      }
      .dialog-title{
           line-height: 49px;

      }
      .el-dialog__headerbtn{
        font-size: 20px;
        color: #b6b7b8;
        line-height: 48px;
        margin-right: 22px;
      }
    }
    .el-dialog__body{
      padding: 20px 41px 0px 40px;
      display: flex;
      justify-content: center;
      .el-form{
        width: 100%;
        .el-form-item__content{
          display: flex;
          .coursePy{
            padding-left: 15px;
          }
     
  
        }
      }

    }
    .el-dialog__footer{
        text-align: center;
        padding: 0 41px 37px 40px;
      .PriceSetTitle{
        text-align: left;
        line-height: 20px;
        margin-bottom: 20px;
      }  
    }
    }
}
</style>