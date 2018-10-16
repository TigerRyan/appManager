<template>
  <div class="videoDetail content_data">
      <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>线下课程主页</el-breadcrumb-item>
      </Breadcrumb>
      <div class="content-title"><span>线下课程主页({{['待审核','审核通过','审核不通过'][data.status]}}
)</span>
      <span>
        <Button type="primary" round size="small" @click="pass($route.query.id)" :disabled="data.status===1?true:false">通过</Button>
        <Button type="primary" round size="small" @click="refuse($route.query.id)" :disabled="data.status===2?true:false">拒绝</Button>
      </span>
        
      </div>
      <div class="detailCenter">
        <div class="detail_img"><img :src=" data.picUrl ||'../../../../static/img/login/1.jpg'"></div>
        <div class="detailMessage">
          <Col :span="8">
            <div class="deatilId">
             <div class="deatilId_left">
               <ul>
                 <li>课程ID:</li>
                 <li style="height:40px;">课程专题名称:</li>
                 <li>教学科目:</li>
                 <li>课时数:</li>
                 <li>原价:</li>
                 <li>优惠价:</li>
                 <li>教学群体:</li>
                 <li v-if="teacherDisplay">授课教师:</li>
               </ul>
             </div>
             <div class="deatilId_right">
               <ul>
                 <li>{{data.id}}</li>
                 <li style="height:40px;">{{data.topicName}}</li>
                 <li>{{ data.subject }}</li>
                 <li>{{ data.classNum  }}课时</li>
                  <li>￥{{ data.price  }}</li>
                 <li>￥{{ data.discountPrice   }}</li>
                 <li><span  v-for="(tag,index) in data.grade" :key="index">{{tag}}</span></li>
                 <li v-if="teacherDisplay">
                   <dl>
                     <dt><span><img :src="data.picTeacher" style="width:100%;height:100%;border-radius:50%;"/></span></dt>
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
                <dt>课程优势:</dt>
                <dd><span v-for=" (item,index) in messageLines" :key="index">{{item}}</span></dd>
              </dl>
              <dl>
                <dt>报名人数:</dt>
                <dd><span >{{data.signNum }}名</span></dd>
              </dl>
              <dl>
                <dt>剩余名额:</dt>
                <dd><span >{{lostNum}}名</span></dd>
              </dl>
              <dl>
                <dt>授课时间:</dt>
                <dd>
                  <span >{{datesTimeFilter(0,0,data.startDate)  }}</span>-<span >{{datesTimeFilter(0,0,data.endDate)  }}</span><br>
                  <span>每天: {{datetTimeFilter(0,0,data.startTimes )  }}</span>-<span >{{datetTimeFilter(0,0,data.endTimes )  }}</span>
                </dd>
              </dl>
              <dl>
                <dt>报名日期:</dt>
                <dd><span >{{datesTimeFilter(0,0,data.signStartDate)   }}</span>-<span >{{datesTimeFilter(0,0,data.signEndDate)   }}</span></dd>
              </dl>
              <dl>
                <dt>课程分类:</dt>
                <dd><span >{{data.kind}}</span></dd>
              </dl>
              <dl>
                <dt>授课地址:</dt>
                <dd><span >{{data.site?data.site:'未知'}}</span></dd>
              </dl>
            </div>
          </Col>
          <Col :span="7">
            <div class="detilrs">
              <div class="detilrs_zan">
                <dl>
                  <dt><img src="/static/img/zan.png" alt="点赞"></dt>
                  <dd>点赞人数:</dd>
                </dl>
                <p>{{data.likes}}</p>
              </div>
            </div>
          </Col>
        </div>
      </div>
      <div class="detailLefft">
        <div class="detailLefft_top">
          <ul><li v-for="(item,index) in list" @click="SetSignType(index)" :class="{active:sign_type==index}" :key="index">{{item}}</li></ul>
          <div class="detailLefft_btn">
          </div>
        </div>
        <div class="detailCut">
          
          <transition name="manage-data" mode="out-in" >
             <div v-if="sign_type===0" v-html="data.courseDetail" class="curriculumdetail" style="word-break: break-all;word-wrap:break-word;">
               
             </div>
          </transition>
          <transition name="manage-data" mode="out-in" >
              <div class="curriculumdetail" v-if="sign_type===1" >
                <div v-html="data.mustKnow " style="word-break: break-all;word-wrap:break-word;"></div>
              </div>
          </transition>
          <transition name="manage-data" mode="out-in" >
             <div class="signup" v-if="sign_type===2">
                <ul>
                  <li v-for="(item,index) in section" :key="index">
                    <div>  
                      <img :src="item.picture"/>
                      <h3>{{item.name || '未知'}}</h3>
                      <p>{{ item.grade || '未知'}}</p>
                      <p>{{ item.school || '未知'}}</p>
                      <span class="status" v-show="item.flag==1">已签到</span>
                    </div>  
                  </li>
                </ul>
             </div>
          </transition>
        </div>
      </div>
  </div>
</template>
<script>
import {Row ,Col,Table,TableColumn,Button,Dialog} from 'element-ui'
import {getVideoDetailApi, getVideoCourseListApi,deleteVideoCourseChapter,getDetailApi,getStudentDetailApi,getSubjectApi,auditofflineCourseApi} from '../../api/underLine.js'
import TablePage from '../../components/TablePage.vue';
import MyPagination from "../../components/MyPagination.vue";
import {dateTimeFilter,charpterStatusFilter,datesTimeFilter,datetTimeFilter} from '../../constant/filter'
import {success,error} from '../../actions'
import Breadcrumb from '../../components/Breadcrumb.vue'
export default {
name:'videoDetail',
components:{Row ,Col,Table,TableColumn,Button,TablePage,MyPagination,Dialog,Breadcrumb},
data(){
  return{
    list:['课程详情','上课须知','报名学员'],
    message:'',//登录信息
    dialogVisible : false,
    teacherDisplay:true,//老师影藏
    sign_type:0,
    lostNum:null,
    subject:'',
    subjectI:'',
    grade:'',
    data:{ topicId:this.$route.query.id},
    dataList:{//展示信息
      page:1,
      pageSize:10,
      list:[]
    },
    display:true,
    section:[],
    grade:[],
  }
},
computed:{
    messageLines: function() {
        return (this.data.courseAdvantage|| "").split(",");
    }
    },
created() {
  this.init()
  getSubjectApi().then(data=>{
    data.forEach(item => {
      if (item.itemLevels==1) {
        this.grade.push(item)
      }
    });
  })
},
methods:{
  dateTimeFilter,
  charpterStatusFilter,
  datesTimeFilter,
  datetTimeFilter,
  init(){
  getStudentDetailApi({id:this.data.topicId}).then(rst=>{
    getDetailApi({id:this.data.topicId}).then(res =>{
      this.data={...this.data,...res}
      this.lostNum = res.signNum - rst.length
    })
  })

  },
  SetSignType(i){
      this.sign_type=i
      if (i==2) {
        getStudentDetailApi({id:this.data.topicId}).then(data=>{
          for (let x = 0;  x< data.length; x++) {
            for (let y = 0; y < this.grade.length; y++) {
              if (data[x].grade==this.grade[y].id) {
               data[x].grade=this.grade[y].itemName
              }
            }
          }
            this.section=data
        })
      }
  },
  // 线下课程通过审核
  pass(idx) {
      this.$confirm(`线下课程一旦通过就会展示在APP端确定通过该线下课程?`,'确认通过', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true}).then(() =>
        auditofflineCourseApi({id:idx,status:1}).then(() => {
        success(`审核成功!`)
        this.init()
      }).catch(({msg}) => error(msg || `审核失败`)))
  },
  //线下课程拒绝审核
  refuse(idx) {
     this.$confirm(`线下课程一旦拒绝就不会展示在APP端确定拒绝该线下课程?`,'确认拒绝', {confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true}).then(() =>
       auditofflineCourseApi({id:idx,status:2}).then(() => {
        success(`拒绝成功!`)
        this.init()
      }).catch(({msg}) => error(msg || `拒绝失败`)))

  }

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
  border-left: 3px solid rgb(81, 197, 255);
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
      height: 280px;
    }
  }
  >.detailMessage{
    flex: 1;
    >.el-col:nth-of-type(3){
        border-right: none;
    }

    .el-col{
      height: 100%;
      font-size: 14px;
      color: #333333;
      border-right: 1px solid #e1e6e8;
      padding-right: 3%;
      padding-left: 3%;
      .deatilId_left{
        >ul{
          li:nth-of-type(1) {
            margin-top: 25px;
          }
          li:nth-of-type(8) {
            margin-top: 36px;
          }
        }
        ul li{
          margin-bottom:20px;
          text-align: left;
          width: 110px;
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
          height: 38px;
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
           span{
             margin-right: 10px;
             display: inline-block;
             margin-bottom: 13px;
           }
         }
        }
        ul li{
          margin-bottom:20px;
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
        width: 70px;
      }
      dd{
        text-align: left;
        flex: 1;
      }
     }
     //课程优势
     dl.coureys{
       height: 95px;

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
    .curriculumdetail{
      padding: 30px 20px;
    }
    .signup{
      padding: 20px;
      width: 100%;
      background-color: #edf1f5;
      ul{
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        li{
          text-align: center;
          padding: 0 10px 20px 10px;
          margin-right: 0;
          width: 20%;
          position: relative;
          >div{
            padding-top: 20px;
            padding-bottom: 20px;
            background: #ffffff;
          img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
          h3{
            line-height: 27px;
            height: 27px;
          }
          p{
            line-height: 27px;
            height: 27px;
          }
          .status{
            position: absolute;
            top: 0px;
            right: 10px;
            width: 80px;
            height: 30px;
            background: #000;
            line-height: 30px;
            color: #fff;
            font-size: 13px;
          }
          }
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
}
</style>