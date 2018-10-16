<template>
    <div class="courseVideoIndex content_data">
      <Breadcrumb/>
          <!-- 搜索 -->
      <div class="time_search">
        <Input placeholder="请输入线下课程名称" style="width: 280px;" v-model="data.topicsName"/>
        <div>
          <Button round icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" @click='search'>搜索</Button>
          <Button round icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"   @click="reset">重置</Button>
        </div>
      </div>

      <!-- 课程card   -->
      <div class="offlind_card">
        <div v-if="data.list.length==0" style="text-align: center">暂无数据</div>
        <Row class="row-bg">
          <Col :span="6" v-for="item in data.list" :key="item.id">
            <Card>
              <div class="offlind_info">
                <div class="btn">
                  <el-button type="primary"  @click="$router.push({path: 'detail',query: {id: item.id}})">查看</el-button>
                  <el-button type="primary" @click="delet(item)">删除</el-button>
                </div>
                <div class="videoImg">
                  <p></p>
                </div>
                <div class="videoPic"><img :src="item.pictureUrl" alt=""></div>
                <div class="offlind_name">
                  <div class="offlind_course_name">
                    <p>{{item.title}}</p>
                    <p style="color:#ff8f5d;text-align:right;">{{item.discountPrice>0?item.discountPrice+'元':'免费'}}</p>
                  </div>
                  <div class="offlind_inter">
                    <span v-for="(tag,index) in (item.advantage||'').split(/[,，]/)" :key="index">{{tag}}</span>
                  </div>
                </div>
                <div class="bottom">
                  <div class="detail">
                    <dl>
                     <dd class="detailD"><img :src="item.teacherPic" alt=""><span><i class="iconfont icon-v"></i></span></dd>
                     <dt><span>{{item.teacher}}</span><span>{{item.level }}</span></dt>
                    </dl>
                  </div>
                  <div class="likenum">
                    <dl>
                      <dt><i class="iconfont icon-zan"></i></dt>
                      <dd>{{item.followCount}}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
          <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[8]" :method="findList" :total="data.total"/>
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
import {videoListApi, delVideoListApi,getVideoListApi,getDelApi} from '../../api/underLine.js'
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
    MyPagination,
  },
  data() {
    return {
      value5: "",
      message:'',
      data:{
        page: 1,
        pageSize: 8,
        start:null,
        end:null,
        topicsName:null,
        loading:false,
        list:[]
      }
    }
  },
  created() {
  },
  methods: {
    // 搜索按钮
    search() {
      this.findList()
    },
    reset() {// 重置
      this.data.topicsName='';
      this.findList()
    },
    delet({id,title}){
        confirm(`确认删除"${title}"?`,'error', '确认删除').then(_ =>{
          getDelApi(id).then(() => {
            success(`删除"${title}"成功`)
            this.findList()
          }).catch(({msg}) => error(msg || '操作失败！请稍后重试...'))
        })
    },
    findList(page={}){// 分页
      this.data.loading = true
      getVideoListApi({...this.data,...page}).then(data =>{
        this.data = {...this.data,  ...page,...data, loading:false}
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
