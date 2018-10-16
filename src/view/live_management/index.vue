<template>
    <div class="liveManagement content_data">
      <Breadcrumb/>
          <!-- 搜索 -->
      <div class="time_search">
        <Input placeholder="请输入直播专题名称" style="width: 280px;" v-model="data.lineTopicsName"/>
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
                  <el-button type="primary"  @click="$router.push({path: 'detail',query: { id: item.id}})">查看</el-button>
                  <el-button type="primary" @click="delet(item)">删除</el-button>
                </div>
                <div class="videoImg">
                  <p></p>
                </div>
                <div class="videoPic"><img :src="item.homeImg" alt=""></div>
                  <div class="offlind_name">
                  <div class="offlind_course_name">
                    <p>{{item.name}}</p>
                    <Button type="primary appling living" round v-if="item.liveState==0"><i class="iconfont icon-xinhao"></i>直播中</Button>
                    <Button type="warning appling review" round v-if="item.liveState==1"><i class="iconfont icon-huifan" ></i> 回放中</Button>
                    <Button type="warning appling" round v-if="item.liveState==2"><i class="iconfont icon-huifan" ></i> 等待直播</Button>
                    <Button type="info appling" round v-if="item.liveState==3" style="background:none;border:node;color:#ccc;">无直播</Button>
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
                      <dd>{{item.likeCount}}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
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
} from 'element-ui'
import MyPagination from '../../components/MyPagination.vue'
import {
  getLineCourseListApi,
  deleteLineCourseApi,
} from '../../api/liveManagementApi.js'
import { confirm, success, error } from '../../actions'
import { liveStateFilter } from '../../constant/filter.js'
import Breadcrumb from '../../components/Breadcrumb.vue'

export default {
  name: 'liveManagement',
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
      value5: '',
      message: '',
      data: {
        page: 1,
        pageSize: 8,
        start: null,
        end: null,
        topicsName: null,
        loading: false,
        list: [],
      },
    }
  },
  created() {},
  methods: {
    liveStateFilter,
    // 搜索按钮
    search() {
      this.findList()
    },
    reset() {
      // 重置
      this.data.lineTopicsName = ''
      this.findList()
    },
    delet({ id, name }) {
      confirm(`确认删除"${name}"?`, 'error', '确认删除').then(_ => {
        deleteLineCourseApi(id)
          .then(() => {
            success(`删除"${name}"成功`)
            this.findList()
          })
          .catch(({ msg }) => error(msg || '操作失败！请稍后重试...'))
      })
    },
    findList(page = {}) {
      // 分页
      this.data.loading = true
      getLineCourseListApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...data, ...page, loading: false }
      })
    },
  },
}
</script>
<style lang='less' scoped>
.liveManagement {
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
      height: 260px;
      border-radius: 5px;
      box-shadow: 1px 10px 7px #e8f6ff;
      background: #fff;
      cursor: pointer;
      position: relative;
      .btn {
        position: absolute;
        right: 0;
        .el-button {
          padding: 8px 10px;
        }
      }
      .videoImg {
        position: absolute;
        top: 12%;
        left: 40%;
        width: 50px;
        height: 50px;
        border: 3px solid #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        p {
          border: 10px solid rgba(0, 0, 0, 0);
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
          line-height: 55px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > p {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            letter-spacing: 0px;
            color: #333333;
            line-height: 20px;
            margin-right: 10px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .offlind_inter {
          display: flex;
          flex-flow: wrap;
          justify-content: flex-start;
          overflow: hidden;
          width: 250px;
          height: 35px;
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
          margin-right: 10px;
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 12px;
          padding: 0;
        }

        .living {
          border: none;
          background: linear-gradient(0deg, #40a1fc 0%, #5fc8fd 100%);
        }
        .review {
          border: none;
          background: linear-gradient(0deg, #ffd657 0%, #fec001 100%);
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
              > img {
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
          dd {
            min-width: 10px;
            margin-left: 4px;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            letter-spacing: 0px;
            color: #999999;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.liveManagement {
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
