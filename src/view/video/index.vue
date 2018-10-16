<template>
    <div class="courseVideoIndex content_data">
      <Breadcrumb/>
          <!-- 搜索 -->
      <div class="time_search">
        <Input placeholder="请输入视频专题名称" style="width: 280px;" v-model="data.topicsName"/>
        <div>
          <Button round icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" @click='search'>搜索</Button>
          <Button round icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"   @click="reset">重置</Button>
        </div>
      </div>

      <!-- 课程card   -->
      <div class="offlind_card">
        <div v-if="data.list.length==0" style="text-align: center">暂无数据</div>
        <Row class="row-bg">

          <Col :span="6" v-for="(item, index) in data.list" :key="item.id">
            <Card>
               <!--<img src="/static/img/22.png" class="image">-->
              <div class="offlind_info">
                <div class="btn">
                  <el-button type="primary" @click="editCount(item)">{{item.editStatus ? '保存':'编辑'}}点赞数</el-button>
                  <el-button type="primary"  @click="$router.push({path: 'detail',query: { id: item.id}})">查看</el-button>
                  <el-button type="primary" :disabled='disabled' @click="delet(item)">删除</el-button>
                </div>
                <div class="videoImg">
                  <p></p>
                  <!--<img src="/static/img/22.png" alt="">-->
                </div>
                <!--<div class="offlind_info">-->
                <div class="videoPic"><img :src="item.homeImg" alt=""></div>
                <div class="offlind_name">
                  <div class="offlind_course_name">
                    <p>{{item.name}}</p>
                    <p style="color:#ff8f5d;text-align:right;">{{item.discountPrice>0?item.discountPrice+'元':'免费'}}</p>
                  </div>
                  <div class="offlind_inter">
                    <span v-for="tag in (item.labels||'').split(/[,，]/)">{{tag}}</span>
                  </div>
                </div>
                <div class="bottom">
                  <div class="detail">
                    <dl>
                     <dd class="detailD"><img :src="item.teacherPic" alt=""><span><i class="iconfont icon-v"></i></span></dd>
                     <dt><span>{{item.teacherName}}</span><span>{{item.teacherLevel}}</span></dt>
                    </dl>
                  </div>
                  <div class="likenum">
                    <dl>
                      <dt><i class="iconfont icon-zan"></i></dt>
                      <dd v-if="item.editStatus"><input v-model="followCount" type="number"></dd>
                      <dd v-if="!item.editStatus">{{item.followCount}}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <!-- <Row type="flex" class="row-bg" justify="space-around">

        </Row> -->
          <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[8]" :total="data.total" :method="findList"/>
      </div>
    </div>
</template>
<script>
import {
  Button,
  Carousel,
  CarouselItem,
  Row,
  Col,
  Input,
  DatePicker,
  Table,
  TableColumn,
  Card,
} from "element-ui";
import MyPagination from '../../components/MyPagination.vue'
import {videoListApi, delVideoListApi, updateFollowCountApi} from '../../api/videoIndexApi.js'
import {confirm, success, error} from '../../actions'
import Breadcrumb from '../../components/Breadcrumb.vue'

export default {
  name:'courseVideoIndex',
  components: {
    Breadcrumb,
    Button,
    CarouselItem,
    Carousel,
    Row,
    Col,
    Input,
    DatePicker,
    Table,
    TableColumn,
    Card,
    MyPagination
  },
  data() {
    return {
      value5: "",
      message:'',
      disabled:false,
      data:{
        page: 1,
        pageSize: 8,
        start:null,
        end:null,
        topicsName:null,
        loading:false,
        list:[]
      },
      followCount: null
    }
  },
  created() {
    let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
  },
  methods: {
    // 编辑点赞数
    editCount(ele){
      this.data.list.forEach((item,index)=>{
        if(ele != item){
          item.editStatus = false
        }else{
          if(!item.editStatus){
            this.followCount = item.followCount
          }
          item.name = item.name + ' '
          item.editStatus = !item.editStatus
          if(!item.editStatus){
            updateFollowCountApi({id:item.id, followCount:this.followCount}).then(data=>{
              if(data){
                success(`更改"${item.name}点赞数"成功`)
                item.followCount = this.followCount
              }
            })
          }
        }
      })
    },

    // 搜索按钮
    search() {
      this.findList()
    },
    reset() {// 重置
      this.data.topicsName='';
      this.findList()
    },
    delet({id,name}){
        confirm(`确认删除"${name}"?`,'error', '确认删除').then(_ =>{
          delVideoListApi(id).then(() => {
            success(`删除"${name}"成功`)
            this.findList()
          }).catch(({msg}) => error(msg || '操作失败！请稍后重试...'))
        })
    },
    findList(page={}){// 分页
      this.data.loading = true
      videoListApi({...this.data,...page}).then(data =>{
        this.data = {...this.data, ...data, ...page, loading:false}
        if(this.data.list && this.data.list.length){
          this.data.list.forEach((item,index)=>{
            item.editStatus = false
          })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.courseVideoIndex{

  // 搜索新建重置查询
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    padding-left: 30px;
  }
  //线下卡片
  .offlind_card {
    border-radius: 20px;

    .row-bg {
      margin-left: -12px;
      margin-right: -12px;
    }
    .offlind_info {
      width: 100%;
      height: auto;
      border-radius: 5px;
      box-shadow: 1px 10px 7px #e8f6ff;
      background: #fff;
      cursor: pointer;
      position: relative;
      .btn{
        position: absolute;
        right:0;
        .el-button{
          padding:8px 10px;
        }
        button{
          cursor: poniter;
        }
      }
      .videoImg{
        position: absolute;
        top:12%;
        left:40%;
        width:50px;
        height:50px;
        border:3px solid #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content:center;

        p{
          border:10px solid rgba(0,0,0,0);
          border-left: 15px solid #fff;
          margin-left: 15px;
        }
      }
      .videoPic {
        display: inline-block;
        width: 100%;
        height: 120px;
        img {
          vertical-align: top;
          width: 100%;
          height: 100%;
          border-radius: 6px;

        }
      }

      // 专题课程和描述
      .offlind_name {
        position: relative;
        padding: 0 10px;
        .offlind_course_name {
          text-align: left;
          color: #434343;
          width: 100%;
          height: 55px;
          font-size: 16px;
          line-height: 26px;
          margin-top: 15px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > p {
            width: 162px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .offlind_inter {
          display: flex;
          flex-flow: wrap;
          justify-content: flex-start;
          overflow: hidden;
          width: 250px;
          height: 68px;
          align-items: center;
          span {
            display: inline-block;
            color: #5cbefc;
            width: 70px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            background-color: #e4f4ff;
            border-radius: 5px;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 12px;
          }
        }
        .appling {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 12px;
          padding: 0;
        }
      }
      // 卡片底部
      .bottom {
        padding: 0 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .detail {
          display: inherit;
          dl {
            display: inherit;
            align-items: center;
            dd {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #ccbcab;
            }
            .detailD {
              position: relative;
              >img{
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                }
              > span {
                position: absolute;
                width: 15px;
                height: 15px;
                display: inline-block;
                text-align: center;
                bottom: -1px;
                right: -2px;
                background: #4ab7fc;
                border-radius: 50%;
                line-height: 15px;
                .iconfont {
                  color: #fff;
                  font-size: 12px;
                }
              }
            }
            dt > span:nth-of-type(1) {
              color: #333333;
              font-size: 14px;
              margin-right: 10px;
              margin-left: 13px;
            }
            dt > span:nth-of-type(2) {
              color: #ffa42f;
              font-size: 12px;
            }
          }
        }
        //点赞数
        .likenum {
          font-size: 18px;
          color: #333333;
          display: inherit;
          dl {
            display: inherit;
            align-items: center;
            .iconfont {
              color: #aaaaaa;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
  .courseVideoIndex{
     .el-card {
    border: none;
    border-radius: none;
    background: none;
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  //开始时间重置
  .el-date-editor--datetimerange.el-input__inner {
    width: 100%;
  }
  .el-date-editor .el-range-separator {
    padding: 0px;
  }
  .search {
    height: 74px;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding-left: 30px;
    .el-input {
      width: 276px !important;
      .el-input__inner {
        font-size: 16px;
        height: 46px;
      }
    }
    .el-input__inner {
      border-radius: 20px !important;
    }
  }
  .block {
    margin-left: 40px;
    .el-date-editor {
      width: 400px;
      height: 46px;
      border-radius: 20px;
      .el-range-input {
        font-size: 16px;
      }
    }
    .el-range-separator {
      width: 10%;
    }
    .el-button {
      font-size: 16px;
      margin-left: 10px !important;
    }
  }
  .offlind_card {
    .row-bg {
      .el-card__body {
        padding: 0 12px 20px;
      }
    }
  }
  .el-pagination {
    padding-top: 42px;
  }
  }
</style>
