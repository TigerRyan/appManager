<template>
    <div class="courseVideoIndex content_data">
      <Breadcrumb/>
          <!-- 搜索 -->
      <div class="time_search">
        <Input placeholder="根据视频名称查询" style="width: 280px;" v-model="data.videoTitle"/>
        <div class="searBtn">
          <Button round icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" @click='search'>搜索</Button>
          <Button round icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"   @click="reset">重置</Button>
          <Button class="upload" round icon="el-icon-plus" style="background:#51c5ff;color:#fff;" @click='create'>上传视频</Button>
        </div>
      </div>

      <!-- 课程card   -->
      <div class="offlind_card">
        <div v-if="data.list.length==0" style="text-align: center">暂无数据</div>
        <el-checkbox-group @change="handleCheckedCitiesChange" v-model="checkedCities">
          <Row class="row-bg">

            <Col :span="6" v-for="(item, index) in data.list" :key="item.id">
              <Card>
                <!--<img src="/static/img/22.png" class="image">-->
                <div class="offlind_info">
                  
                  <div class="btn">
                    <el-button class="reviewComments"  type="primary"  @click="$router.push({path: '/view/shortVideo/reviewComments',query: { id: item.id}})">评论管理</el-button>
                    <el-button type="primary" :disabled='disabled' @click="editor(item)">编辑</el-button>
                  </div>
                  <div class="videoImg">
                    <p></p>
                    <!--<img src="/static/img/22.png" alt="">-->
                  </div>
                  <!--<div class="offlind_info">-->
                  <div class="videoPic"><img :src="item.videoImg" alt=""></div>
                  <div class="offlind_name">
                  </div>
                  <div class="bottom">
                    <div class="detail">
                      <dl>
                      <dt><el-checkbox :label="item.id" value=" ">{{ item.videoTitle }}</el-checkbox></dt>
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
        </el-checkbox-group>
        <!-- <Row type="flex" class="row-bg" justify="space-around">

        </Row> -->
          <div class="btn allsetect" >
            <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <Button round  style="margin-left:20px" type="danger"  @click="del">删除</Button>
          </div>
          <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[8]" :total="data.total" :method="findList"/>

          <!-- 上传 -->
        <el-dialog :closeOnClickModal="false" :title="menu.tip" @close="close(1)" width="600px" :modal="true" customClass="my-dialog" :visible.sync="menu.show" :append-to-body="true">
              <el-form :model="menu" :rules="rules" ref="menu" label-width="120px">
                <el-form-item label="视频名称:" prop="videoTitle">
                  <el-col :span="20">
                    <el-input v-model="menu.videoTitle" />
                  </el-col>
                  
                </el-form-item>
                <el-form-item label="上传视频:" prop="videoUrl">
                    <VideoUpload ref="videUpload" @success="uploadVide" :url="menu.videoUrl" :width="'300'"></VideoUpload>
                    <el-tag type="info">上传视频大小建议：视频文件大小500 M 以内！</el-tag>
                </el-form-item>
                <el-form-item label="上传图片:" prop="videoImg">
                    <!-- <i v-show="menu.videoImg" class="el-icon el-icon-close" @click="deletePic"></i> -->
                    <Avatar :url="menu.videoImg" width="150"  height="140" @success="imgVide"/>
                    <el-tag type="info">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
                </el-form-item>
                <el-form-item  label="权重值:" prop="weight">
                  <el-input-number v-model="menu.weight" :min="0" :max="999" :step="1"/>
                </el-form-item>
              </el-form>
              <div class="text-center">
                <el-button type="primary" @click="submit(1)">确 定</el-button>
                <el-button @click="menu.show = false">取 消</el-button>
              </div>
          </el-dialog>
        <!-- 编辑 -->
        <el-dialog :title="editorData.tip" @close="close(0)" width="400px" :modal="true" customClass="my-dialog" :visible.sync="editorData.show" :append-to-body="true">
              <el-form :model="editorData" :rules="rules1" ref="editorData" label-width="120px">
                <el-form-item label="视频名称:" prop="videoTitle">
                  <el-col :span="19">
                    <el-input v-model="editorData.videoTitle"  />
                  </el-col>
                </el-form-item>
                <el-form-item  label="权重值:" prop="weight">
                  <el-input-number v-model="editorData.weight" :min="0" :max="999" :step="1"/>
                </el-form-item>
              </el-form>
              <div class="text-center">
                <el-button type="primary" @click="submit(0)">确 定</el-button>
                <el-button @click="editorData.show = false">取 消</el-button>
              </div>

      </el-dialog>
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
import {getshortVideoApiListApi, createshortVideoApi,getDetailshortVideoApi,editshortVideoApi,deleteshortVideoApi,} from '../../api/shortVideoApi.js'
import {confirm, success, error} from '../../actions'
import Breadcrumb from '../../components/Breadcrumb.vue'
import Avatar from '../../components/Avatar.vue'
import VideoUpload from '../../components/VideoUpload.vue'

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
    Avatar,
    VideoUpload
  },
  data() {
    return {
      value5: "",
      checkAll:false, 
      checkedCities: [],
      check:[],
      menu: {
        videoUrl: '',
        videoImg: '',
        tip: '上传视频',
        type: 0,
        show: false,
        videoTitle: '',
        weight: 0,
      },
      editorData: {
        show: false,
        videoTitle: '',
        weight: 0,
      },
      message:'',
      disabled:false,
      data:{
        page: 1,
        pageSize: 8,
        start:null,
        end:null,
        videoTitle:null,
        loading:false,
        list:[]
      },
      rules: {
        videoTitle: [
          { required: true, message: '请填写视频名称', trigger: 'blur' },
          {min: 2, max: 20, message: '请输入2到20个字符...', trigger: 'blur'}
        ],
        videoUrl: [
          { required: true, message: '请上传视频', trigger: 'blur' }
        ],
        videoImg: [
          { required: true, message: '请上传封面图片', trigger: 'blur' }
        ]
      },
      rules1: {
        videoTitle: [
          { required: true, message: '请填写视频名称', trigger: 'blur' },
          {min: 2, max: 20, message: '请输入2到20个字符...', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
  },
  methods: {
    //全选
    handleCheckAllChange(val){
      this.check=[]
      this.data.list.forEach(item=>{
          this.check.push(item.id)
      })
      this.checkedCities = val ? this.check : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.data.list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.list.length;
    },
    del() {
        if(this.checkedCities.length<=0) {
            error('请先选择需要删除的视频!')
            return
        }
        confirm( `你确认删除选择的视频么?`,
                'warning',
                '删除确认' 
        ).then(()=>{
          deleteshortVideoApi({ids: this.checkedCities.join(",")}).then((data)=>{
              this.findList({page:1})
            // if (data.code==200) {
              success(`删除成功！`)
            // }
          },err=>{
            error(`删除失败：${err}`)
          })
        })
        .catch(({ msg }) => {
          
          error(msg || "取消删除")
        })
    },
    // 搜索按钮
    search() {
      this.findList()
    },
    reset() {// 重置
      this.data.videoTitle='';
      this.findList()
    },
    editor(item){
      getDetailshortVideoApi({id: item.id}).then(data =>{
        this.editorData = {...data,show:true}
      })
    },
    create() {
      this.menu.show = true
      // this.$refs.menu.resetFields()
    },
    findList(page={}){// 分页
      this.data.loading = true
      getshortVideoApiListApi({...this.data,...page}).then(data =>{
        this.data = {...this.data, ...data, ...page, loading:false}
      })
    },
    uploadVide(url){
        // menu: {
        this.menu.videoUrl = url
        // videoImg: '',
        this.$refs.menu.validateField("videoUrl")
    },
    imgVide(url){
        // menu: {
        this.menu.videoImg = url
        // videoImg: '',
        this.$refs.menu.validateField("videoImg")
    },
    close(type) {
      if(type==0){
        this.$refs.editorData.clearValidate()
      }else {
        
        this.$refs.menu.clearValidate()
        this.menu = {
          videoUrl: '',
          videoImg: '',
          tip: '上传视频',
          type: 0,
          show: false,
          videoTitle: '',
          weight: 0,
        }
      }
    },
    submit(type) {
      if (type===0) {
        
        // editshortVideoApi
        this.$refs.editorData.validate(valid => {
        if (valid) {
              this.menu.show = false
              editshortVideoApi({...this.editorData})
              .then(() => {
                success(`编辑视频 ${this.menu.videoTitle} 成功！`)
                this.findList()
                this.editorData.show = false
                this.editorData.videoTitle = ''
                this.editorData.weight = ''
              })
          } else {
            return false
          }
        })
      }else {
        
        this.$refs.menu.validate(valid => {
        
        if (valid) {
              this.menu.show = false
              createshortVideoApi({...this.menu})
              .then(() => {
                success(`添加视频 ${this.menu.videoTitle} 成功！`)
                this.findList()
                this.menu.show = false
                this.menu.videoTitle = ''
                this.menu.videoUrl = ''
                this.menu.videoImg = ''
                this.$refs.videUpload.clearUrl()
              })
          } else {
            return false
          }
        })
      }
    },
  }
}
</script>
<style lang='less' scoped>
.courseVideoIndex{
  .btn.allsetect {
    padding: 15px;
    background-color: #fff;
    .el-button.is-round {
      padding: 10px 23px;
    }
  }
  // 搜索新建重置查询
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    padding-left: 30px;
    .searBtn {
      width: 85%;
      .upload {
        float: right;
        margin: 20px 20px 0 0;
      }
    }
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
        z-index: 99999;
        .reviewComments {
          z-index: 999;
        }
      }
      .videoImg{
        position: absolute;
        top:24%;
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
        padding: 20px 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .detail {
          display: inherit;
          // padding: 10px;
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
