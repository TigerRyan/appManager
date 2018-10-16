<template>
  <div class="liveDetail content_data">
      <div class="content-title">直播专题详情
        <!-- <Button type="primary" round  @click="$router.push({path: 'create',query: { id: data.id}})">编辑</Button> -->
      </div>
      <div class="detailCenter">
        <div class="detail_img"><img :src=" data.homeImg ||'../../../../static/img/login/1.jpg'"></div>
        <div class="detailMessage">
          <Col :span="8">
            <div class="deatilId">
             <div class="deatilId_left">
               <ul>
                 <li>课程ID</li>
                 <li>课程专题名称</li>
                 <li>课程时间</li>
                 <li >教学年级</li>
                 <li v-if="teacherDisplay">授课教师</li>
               </ul>
             </div>
             <div class="deatilId_right">
               <ul>
                 <li>{{data.id}}</li>
                 <li>{{data.name}}</li>
                 <li>{{datesTimeFilter(0,0,data.startTime)}}至<br>{{datesTimeFilter(0,0,data.endTime)}}</li>
                 <li><span class="gradesLevel" v-for=" (tag,index) in (data.grades || '').split(/[,，]/)" :key="index">{{tag}}</span></li>
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
                <dd><span v-for=" (item,index) in (data.labels || '').split(/[,，]/)" :key="index">{{item}}</span></dd>
              </dl>
              <dl>
                <dt>课程科目</dt>
                <dd><span >{{data.subject}}</span></dd>
              </dl>
            </div>
          </Col>
          <Col :span="7">
            <div class="detilrs">
              <div class="detilrs_bm">
                 <dl>
                   <dt><img src="/static/img/ren.png" alt="人数"></dt>
                   <dd>报名人数</dd>
                 </dl>
                 <p>{{data.signUpNum}}</p>
               </div>
              <div class="detilrs_zan">
                <dl>
                  <dt><img src="/static/img/zan.png" alt="点赞"></dt>
                  <dd>点赞人数</dd>
                </dl>
                <p>{{data.followNum}}</p>
              </div>
            </div>
          </Col>
        </div>
      </div>
      <div class="detailLefft">
        <Tabs v-model="activeName" @tab-click="handleClick">
            <TabPane label="直播详情" name="first">
              <p v-html ="data.descInfo"> </p>
              </TabPane>
            <TabPane label="上课须知" name="second">
              <p v-html ="data.noticeInfo"> </p>
              </TabPane>
            <TabPane label="课程章节" name="third">
              <transition name="manage-data" mode="out-in" >
             <div >
               <ul class="content_data_title">
                <li v-for="(item, index) in listTab" :class="{blue: changebill == item.type}" @click="redBill(item.type)" :key="index">{{item.name}}</li>
              </ul>
               <TablePage>
                  <Table :data="dataList.list" :default-sort = "{prop: 'subjectNum', order: 'descending'}">
                    <TableColumn prop="subjectId" label="课程ID" width='100px'/>
                    <TableColumn prop="subjectNum" label="课程序号"  width='100px'/>
                    <TableColumn prop="pushUrl"  label="推流地址" min-width='200px'>
                      <template slot-scope="scope">
                        <span style="display:flex;">
                        {{scope.row.pushUrl}}
                        </span>
                      </template>
                    </TableColumn>
                    <TableColumn prop="hlsPullurl"  label="拉流地址"  min-width='200px'>
                      <template slot-scope="scope">
                        <span>
                        {{scope.row.hlsPullurl}}
                        </span>
                      </template>
                    </TableColumn>
                    <TableColumn prop="subjectName" label="课程名称"/>
                    <TableColumn prop="startTime" :formatter="dateTimeFilter" min-width='150px' label="直播开始时间"/>
                    <TableColumn prop="endTime" :formatter="dateTimeFilter" min-width='150px' label="直播结束时间"/>
                    <TableColumn prop="status"  label="状态">
                      <template slot-scope="scope">
                        <span :style="{color :scope.row.status ?'#67C23A' :'#F56C6C'}">
                           {{charptersStatusFilter(0,0,scope.row.status)}}
                        </span>
                      </template>
                    
                    </TableColumn>
                    <TableColumn label="操作" min-width='300px' v-if="changebill==0">
                      <template slot-scope="scope" >
                        <Button type="danger" round size="small" @click="delet(scope.row)">删除</Button>
                        <Button type="primary" round size="small" @click="pass(scope.row)">通过</Button>
                        <Button type="primary" round size="small" @click="refuse(scope.row)">拒绝</Button>
                      </template>
                    </TableColumn>
                  </Table>
                  <!-- <MyPagination :page="dataList.pageNum" :pageSize="dataList.pageSize" :method="findList" :pageSizes="[10]" :total="dataList.total"/> -->
              </TablePage>
             </div>
          </transition>
              </TabPane>
            <TabPane label="报名学员" name="fourth">
              <transition name="manage-data" mode="out-in" >
               <div  class="sinUp">
                  <Row>
                    <Col :span="6" class="sinUpDetails" v-for="(stude,i) in studentsList.list" :key="i">
                        <div>
                          <p><img :src='stude.pic'/></p>
                          <p>{{stude.name ||'未知'}}</p>
                          <p>{{stude.grade ||'未知'}}</p>
                          <p>{{stude.school ||'未知'}}</p>
                        </div>
                    </Col>
                  </Row>
                <MyPagination :page="studentsList.pageNum" :pageSize="studentsList.pageSize" :method="findStudentsList" :pageSizes="[10]" :total="studentsList.total"/>
               </div>
            </transition>
              </TabPane>
        </Tabs>
        <div class="detailCut">
          <Dialog  :visible.sync="dialogVisible " center :modal-append-to-body="false" custom-class="dialog-01" >
            <span slot="title" class="dialog-title">提示</span>
            <span>删除该课程可能会影响学生的学习记录，请确认是否删除！</span>
            <span slot="footer" class="dialog-footer">
              <Button @click="dialogVisible  = false" round>取消</Button>
              <Button type="danger" @click="dele" round >确定删除</Button>
            </span>
          </Dialog>
        </div>
      </div>
  </div>
</template>
<script>
import {
  Row,
  Col,
  Table,
  TableColumn,
  Button,
  Dialog,
  Tabs,
  TabPane,
} from 'element-ui'
import { deleteVideoCourseChapter } from '../../api/videoDetailApi.js'
import { getEduItemTreeApi,getAllEduItemApi } from '../../api/baseApi.js'
import {
  getLineCourseInformationApi,
  getLineCourseChapterList,
  getLineTopicStudentsApi,
  deleteLivingCourseChapter,
  auditLiveSectionApi
} from '../../api/liveManagementApi.js'
import TablePage from '../../components/TablePage.vue'
import MyPagination from '../../components/MyPagination.vue'
import {
  dateTimeFilter,
  datesTimeFilter,
  charptersStatusFilter,
} from '../../constant/filter'
import { success, error } from '../../actions'
import reserveDetailVue from '../order_manager/reserveDetail.vue';
export default {
  name: 'liveDetail',
  components: {
    Row,
    Col,
    Table,
    TableColumn,
    Button,
    TablePage,
    MyPagination,
    Dialog,
    Tabs,
    TabPane,
  },
  data() {
    return {
      listTab:[{type:0,name:'待审核'},{type:1,name:'审核通过'},{type:2,name:'审核失败'}],     //章节状态
      changebill:0,
      activeName: 'third',
      message: '', //登录信息
      dialogVisible: false,
      teacherDisplay: true, //老师影藏
      subject: '',
      lineChapterId: null,
      grade: '',
      data: {
        lineTopicsId: this.$route.query.id,
        descInfo: '',
        endTime: null,
        followNum: null,
        grades: '',
        homeImg: null,
        id: null,
        labels: '',
        name: '',
        noticeInfo: '',
        signUpNum: null,
        startTime: null,
        subject: '',
        teacherId: null,
        teacherName: '',
        teacherPic: '',
      },
      dataList: {
        //展示信息
        page: 1,
        pageSize: 10,
        list: [
          {
            endTime: 1525428000000,
            startTime: 1525425780000,
            subjectId: 11,
            subjectName: '课程6',
            subjectNum: 6,
          },
        ],
      },
      studentsList: {
        //展示信息
        page: 1,
        pageSize: 10,
        topicId: this.$route.query.id,
        topicType: 1,
        list: [],
      },
      display: true,
      section: {},
    
    }
  },
  created() {reserveDetailVue
    // 直播专题详情;
    getLineCourseInformationApi(this.data.lineTopicsId).then(res => {
      this.data = { ...this.data, ...res }
    // getEduItemTreeApi().then(res=>{
      
    //     this.data.subject = res.filter(item=>item.id==this.data.subject)[0].itemName
    //   })
    getAllEduItemApi().then(data=>{
      this.data.subject = data.filter(item=>item.id==this.data.subject)[0].itemName
      
    })
    })

  
    
    this.findList()
  },
  methods: {
    dateTimeFilter,
    datesTimeFilter,
    charptersStatusFilter,
    findList() {
      getLineCourseChapterList(this.data.lineTopicsId,this.changebill).then(res => {
        this.dataList.list = res
      })
    },
    redBill(val){
        this.changebill=val
        this.findList()
    },
    findStudentsList(page = {}) {
    this.studentsList.loading = true
      getLineTopicStudentsApi({ ...this.studentsList, ...page }).then(res => {
        this.studentsList = {
          ...this.studentsList,
          ...res,
          ...page,
          loading: false,
        }
          getAllEduItemApi().then(res=>{
            let nian = res
            this.studentsList.list.forEach((ele,index) =>{
            nian.forEach((re,index2) =>{
              if(re.id==Number(ele.grade))
              {
                this.studentsList.list[index].grade = re.itemName
              }
            })
          })

         })
   
      })
    },
    handleClick(tab, event) {},

    delet({ subjectId }) {
      this.dialogVisible = true
      this.lineChapterId = subjectId
    },
    dele() {
      deleteLivingCourseChapter(this.lineChapterId).then(() => {
        this.dialogVisible = false
        this.lineChapterId = null
        success('删除成功')
        this.findList()
      })
    },
   //课程章节通过审核
    pass(pa){
      this.$alert(`确认通过课程名称为“${pa.subjectName}”的章节?`,'提示', {center: true}).then(() =>
         auditLiveSectionApi({id:pa.subjectId,status:1}).then(() => {
          success(`该章节已成功通过审核`)
          this.findList()
        }).catch(({msg}) => error(msg || `该章节通过审核失败`)))
    },
    //课程章节拒绝审核
    refuse(re){
      this.$confirm(`一旦拒绝，APP端直接删除该章节
请确认是否拒绝!`, '提示', {confirmButtonText: '确定拒绝',
          cancelButtonText: '取消',
          center: true}).then(() =>
        auditLiveSectionApi({id:re.subjectId,status:2}).then(() => {
        success(`拒绝“${re.subjectName}”成功!`)
        this.findList()
      }).catch(({msg}) => error(msg || `拒绝“${re.subjectName}”失败! 请稍后再试...`)))
    }
  },
}
</script>
<style lang='less' scoped>
.liveDetail {
  //线下课程按钮
  .el-button {
    width: 80px;
    height: 40px;
    padding: 0;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .content-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 75px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .detailCenter {
    background: #fff;
    padding: 26px 30px;
    display: flex;
    justify-content: space-between;
    > .detail_img {
      padding-top: 14px;
      width: 320px;
      height: 245px;
      img {
        width: 100%;
        height: 260px;
      }
    }
    > .detailMessage {
      flex: 1;
      > .el-col:nth-of-type(3) {
        border-right: none;
      }

      .el-col {
        height: 100%;
        font-size: 16px;
        color: #333333;
        border-right: 1px solid #e1e6e8;
        padding-right: 3%;
        padding-left: 3%;
        .deatilId_left {
          > ul {
            li:nth-of-type(1) {
              margin-top: 25px;
            }
            li:nth-of-type(4) {
              line-height: 40px;
              margin-bottom: 57px;
            }
          }
          ul li {
            margin-bottom: 30px;
            text-align: left;
            width: 100px;
          }
        }
        .deatilId_right {
          > ul {
            li:nth-of-type(1) {
              margin-top: 25px;
            }
            li:nth-of-type(3) {
              margin-bottom: 0;
              width: 180px;
              height: 55px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              span {
                margin-right: 10px;
                display: inline-block;
                margin-bottom: 13px;
              }
            }
            li:nth-of-type(4){
                margin-top: 2px;
                height: 40px;
               }
          }
          ul li {
            margin-bottom: 30px;
            text-align: left;
            dl {
              display: flex;
              dt {
                margin-right: 21px;
                span {
                  display: inline-block;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background-color: #333333;
                }
              }
              dd {
                line-height: 40px;
              }
            }
          }
        }
        .deatilId {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
        }
        .deatilyss {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          dl {
            display: flex;
            justify-content: space-between;
            width: 100%;
            line-height: 30px;
            dt {
              text-align: left;
              width: 100px;
            }
            dd {
              text-align: left;
              flex: 1;
            }
          }
          //课程优势
          dl.coureys {
            height: 80px;

            dd {
              text-align: left;
              span {
                display: inline-block;
                width: 90px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background-color: #e4f4ff;
                color: #7fccfd;
                margin-bottom: 5px;
                margin-left: 5px;
                border-radius: 5px;
              }
            }
          }
        }
        .detilrs {
          width: 100%;
          height: 100%;
          justify-content: space-between;
          padding-top: 25px;
          .detilrs_bm {
            height: 80px;
            dl {
              display: flex;
              height: 31px;
              dd {
                padding-top: 15px;
                margin-left: 11px;
              }
            }
            p {
              width: 102px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
          }
          .detilrs_zan {
            height: 80px;
            dl {
              display: flex;
              height: 31px;
              dd {
                padding-top: 15px;
                margin-left: 11px;
              }
            }
            p {
              width: 102px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
          }
        }
      }
      //媒体查询
      @media screen and (max-width: 1440px) {
        .el-col {
          font-size: 14px;
        }
        .el-col-8 {
          width: 35%;
          font-size: 14px;
          padding-left: 5px;
          padding-right: 5px;
          .deatilId_right {
            > ul {
              li:nth-of-type(3) {
                width: 159px;
              }
            }
          }
        }
        .el-col-9 {
          width: 50%;
          padding-left: 5px;
          padding-right: 5px;
        }
        .el-col-7 {
          width: 15%;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }
  .detailLefft {
    background: #fff;
    width: 100%;
    display: inline-block;
    background-color: #edf1f5;
    .detailLefft_top {
      height: 64px;
      background-color: #ffffff;
      margin-top: 20px;
      margin-bottom: 20px;
      width: 100%;
      padding-right: 30px;
      padding-left: 30px;
      .detailLefft_btn {
        height: 100%;
        line-height: 64px;
        float: right;
      }
    }
    ul {
      display: inline-block;
      height: 64px;
      li {
        float: left;
        line-height: 64px;
        margin-right: 32px;
        font-size: 18px;
        color: #333333;
        cursor: pointer;
      }
      .active {
        color: #51c5ff;
        border-bottom: 4px solid #51c5ff;
      }
      li:nth-of-type(4) {
        margin-left: 0;
      }
    }
    .detailCut {
      width: 100%;
      display: inline-block;
      height: 100%;
      transition: all 0.5s ease;
      background-color: #fff;
      overflow: hidden;
      .manage-data-enter-active,
      .manage-data-leave {
        transition: all 0.5s ease;
        opacity: 1;
        transform: translateX(0);
      }
      .manage-data-enter {
        transition: all 0.5s ease;
        opacity: 0;
        transform: translateX(-50%);
      }
      .manage-data-leave-active {
        display: none;
      }
      .manage-data-enter {
        transform: translateX(50%);
      }
      .sinUp {
        background-color: #edf1f5;
        .el-col-6 {
          width: 20%;
          padding: 0 10px 20px 10px;
        }
        .sinUpDetails {
          text-align: center;
          > div {
            width: 100%;
            height: 300px;
            background-color: #ffffff;
            color: #666666;
            p {
              margin-bottom: 15px;
              display: flex;
              font-size: 16px;
              justify-content: center;
              align-items: center;
              img {
                width: 110px;
                height: 110px;
                background-color: indigo;
                border-radius: 50%;
              }
            }
            > p:first-child {
              height: 196px;
              width: 100%;
              margin-bottom: 0;
            }
            > p:nth-of-type(2) {
              font-size: 20px;
              font-weight: bold;
              color: #333333;
            }
          }
        }
      }
      .attendNotice {
        display: flex;
        justify-content: space-between;
        height: 698px;
        overflow: hidden;
        overflow-y: auto;
        width: 100%;
        .el-button {
          height: 40px;
        }
      }
    }
    .content_data_title {
      width: 100%;
        height: 67px;
        line-height: 70px;
        background-color: #fff;
        margin-bottom: 10px;
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
          color: #409EFF;
          border-bottom: 4px solid #409EFF;
        }
      }
  }
}
</style>
<style lang="less">
// 一号删除弹出层，
.liveDetail {
  .dialog-01 {
    text-align: left;
    border-radius: 6px;
    color: #333333;
    margin-top: 40vh !important;
    width: 400px;
    .el-dialog__header {
      padding: 18px 40px 14px 41px;
      font-size: 18px;
      box-shadow: 0px 1px 0px 0px #d9dbe2;
      img {
        vertical-align: middle;
        margin-right: 15px;
      }
      .dialog-title {
        line-height: 49px;
      }
      .el-dialog__headerbtn {
        font-size: 20px;
        color: #b6b7b8;
        line-height: 48px;
        margin-right: 22px;
      }
    }
    .el-dialog__body {
      padding: 40px 41px 28px 40px;
      p {
        font-size: 16px;
        color: #666666;
        line-height: 1;
        margin-bottom: 19px;
      }
      .textarea01 {
        width: 100%;
        height: 240px;
        .el-textarea__inner {
          width: 100%;
          height: 100%;
          padding: 12px 15px;
          color: #999999;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
      padding: 0 41px 37px 40px;
    }
  }
  .table_page {
    margin-top: 0;
    width: 100%;
  }
  .sinUp {
    background-color: #edf1f5;
    .el-col-6 {
      width: 20%;
      padding: 0 10px 20px 10px;
    }
    .sinUpDetails {
      text-align: center;
      > div {
        width: 100%;
        height: 300px;
        background-color: #ffffff;
        color: #666666;
        p {
          margin-bottom: 15px;
          display: flex;
          font-size: 16px;
          justify-content: center;
          align-items: center;
          img {
            width: 110px;
            height: 110px;
            background-color: indigo;
            border-radius: 50%;
          }
        }
        > p:first-child {
          height: 196px;
          width: 100%;
          margin-bottom: 0;
        }
        > p:nth-of-type(2) {
          font-size: 20px;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
  .el-tabs__header.is-top {
    margin: 15px 0 15px;
    background-color: #ffffff;
    .el-tabs__nav {
      margin-left: 20px;
      height: 64px;
      background-color: #ffffff;
      // margin-top: 20px;
      // margin-bottom: 20px;
      width: 100%;
      .el-tabs__item {
        height: 64px;
        line-height: 64px;
        font-size: 18px;
        color: #333333;
      }
    }
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tab-pane {
    > p {
      background-color: #fff;
      padding: 20px;
    }
  }
  .el-tabs__active-bar {
    height: 4px;
  }
  .gradesLevel {
    display: inline-block;
    margin-right: 1em;
  }
}
</style>