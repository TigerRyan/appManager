<!--  -->
<template>
  <div class='userBug content_data'>
    <Breadcrumb/>

    <!-- tab切换 -->
    <ul class="cate_list">
      <li v-for="(item, index) in TitleList" :class="{blue: changeTitle == index}" @click="redTitle(index)" :key="index">{{item.name}}</li>
    </ul>

    <!-- 搜索 -->
    <div class="time_search">
      <div class="search kind">
        <el-Input placeholder="请输入标题搜索"  style="width: 200px; margin-right: 10px" v-model.trim="data.title"  @keydown.enter.native="search" />
        <el-button icon="el-icon-search" style="margin-left:10px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" style="margin-left:10px;background:#ecf5ff"  round  @click="reset">重置</el-button>
      </div>
      <div class="block">
        <el-button icon="el-icon-plus"  type="edit" round  @click="addNews">创建反馈</el-button>
      </div>
    </div>

    <!-- 反馈列表 -->
    <TablePage v-loading.fullscreen.lock="fullLoading" >
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="name" label="用户名"  min-width="110">
          <template slot-scope="scope" >           
              {{scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话号码"   :formatter="defValFilter05" min-width="110"/>
        <el-table-column prop="title" label="标题" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="img" label="图片"  min-width="110">
          <template slot-scope="scope" >           
              <ImgView :src="scope.row.img" defSrc="/static/img/admin.png" :height="'83'" />
          </template>
        </el-table-column>
        <el-table-column prop="details" label="描述"  min-width="210">
          <template slot-scope="scope" >
            <span >
              {{scope.row.details}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="details" label="反馈来源"  min-width="100">
          <template slot-scope="scope" >
            <span >
              {{['未知','app','后台管理平台'][scope.row.source]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column  prop="deviceType" label="设备信息" min-width="110"/>
        <el-table-column  prop="createTime" label="创建时间" :formatter="detailTimeFilter" min-width="110"/>
        <el-table-column  prop="updateTime" label="更新时间" :formatter="detailTimeFilter" min-width="110"/>
        <el-table-column prop="status" label="状态"  min-width="150">
          <template slot-scope="scope" >
            <span >
              {{['未知','未解决','已解决','紧急Bug'][scope.row.status]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作"  min-width="300">
          <template slot-scope="scope">
              <el-button type="primary" size="middle" @click="edit(scope.row)" plain v-if="changeTitle!==1">编辑</el-button>
              <el-button type="primary" size="middle" @click="edit(scope.row)" plain v-if="changeTitle==1">查看</el-button>
              <el-button type="success" plain size="middle" @click='solve(scope.row)' v-if="changeTitle!==1">解决</el-button>

              <el-button type="danger" plain size="middle" @click='del(scope.row)' >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>

     <MyPagination :page="data.page" :pageSize="data.pageSize" :method="findList" :total="data.total"/>


     <!-- 创建弹框 -->
    <el-dialog title="" :visible.sync="dialogTableVisible" :modal="modal" custom-class="activity" @close="reset1" width="1000px">
        <el-form :model="createModul" ref="createModul" :rules="rules" label-width="125px">
          <el-form-item label="标题:" prop="title">
            <el-input v-model="createModul.title" auto-complete="off" placeholder="请输入标题"></el-input>   
          </el-form-item>
          <el-form-item label="反馈图片:"  prop="img" >
            <div class="imgUp">
              <ul>
                <li v-for="(item,index) in imgArr" :key="index">
                  <img :src="item"/>
                  <div class="deleteImg">
                    <i v-if="true" class="iconfont icon-unie639" @click="deleteImg(index)"></i>
                  </div>
                </li>
              </ul>
              <div class="upload" v-if="imgArr.length<3">
                <el-upload
                  class="avatar-uploader"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="upload"
                  list-type="picture"
                  multiple
                  :on-success="successFun"
                  :on-exceed="handleExceed">
                  <i class="el-icon-plus"/>
                </el-upload>
              </div>
            </div> 
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
          </el-form-item>
          <el-form-item label="描述:" prop="details">
            <el-input type="textarea" :rows="3" v-model="createModul.details" placeholder="请输入内容"></el-input>   
          </el-form-item>
          <el-form-item label="设备信息:" prop="deviceType"> 
             <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">如何获取手机版本号?<br/><br/>IOS:打开手机设置-->通用-->关于手机-->版本<br/><br/>Android:打开手机设置-->关于手机-->手机版本</div>
              <i class="el-icon-question" style="position:absolute;top:50%;z-index:1;transform: translateY(-50%);left:10px"></i>
             </el-tooltip>
             <el-input v-model="createModul.deviceType" auto-complete="off" class="sj" placeholder="请输入手机品牌及系统版本号"></el-input>  
          </el-form-item>
          <el-form-item label="APP系统版本:" prop="version">
             <el-input type="text"  v-model="createModul.version" placeholder="请输入系统版本号"></el-input>   
          </el-form-item>
          <el-form-item label="状态:" prop="status">
             <el-radio-group v-model="createModul.status">
                <el-radio :label="1">未解决</el-radio>
                <!-- <el-radio :label="2">已解决</el-radio> -->
                <!-- <el-radio :label="3">紧急Bug</el-radio> -->
             </el-radio-group> 
          </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="codes"   @click="dialogTableVisible=false" plain>取消</el-button>
            <el-button class="xia" type="primary"   @click="next()" plain >确定</el-button>
        </div>
    </el-dialog>


    <!-- 编辑弹框 -->
    <el-dialog title="" :visible.sync="dialogTableVisible1" :modal="modal" custom-class="activity" @close="reset2" width="1000px">
        <el-form :model="editModul" ref="editModul" :rules="rules" label-width="125px">
          <el-form-item label="标题:" prop="title">
            <el-input v-model="editModul.title" auto-complete="off" ></el-input>   
          </el-form-item>
          <el-form-item label="反馈图片:"   prop="img">
            <div class="imgUp">
              <ul>
                <li v-for="(item,index) in editModul.img?editModul.img.split(',') : []" :key="index">
                  <img :src="item"/>
                  <div class="deleteImg">
                    <i v-if="true" class="iconfont icon-unie639" @click="deleteImg(index)"></i>
                  </div>
                </li>
              </ul>
              <div class="upload" v-if="editModul.img.split(',').length<3 && changeTitle==0 && editModul.source==2">
                <el-upload
                  class="avatar-uploader"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="upload"
                  list-type="picture"
                  multiple
                  :on-success="successFun"
                  :on-exceed="handleExceed">
                  <i class="el-icon-plus"/>
                </el-upload>
              </div>
            </div> 
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
          </el-form-item>
          <el-form-item label="描述:" prop="details">
            <el-input type="textarea" :rows="3" v-model="editModul.details" placeholder="请输入内容"></el-input>   
          </el-form-item>
          <el-form-item label="设备信息:" prop="deviceType">
             <el-tooltip class="item" effect="light" placement="top" v-if="editModul.source==2">
              <div slot="content">如何获取手机版本号?<br/><br/>IOS:打开手机设置-->通用-->关于手机-->版本<br/><br/>Android:打开手机设置-->关于手机-->手机版本</div>
              <i class="el-icon-question" style="position:absolute;top:50%;z-index:1;transform: translateY(-50%);left:10px"></i>
             </el-tooltip>
             <el-input v-model="editModul.deviceType" auto-complete="off" class="sj"></el-input>  
          </el-form-item>
          <el-form-item label="APP系统版本:" prop="version">
             <el-input type="text" v-model="editModul.version" placeholder="请输入系统版本号"></el-input>   
          </el-form-item>
          <el-form-item label="状态:" prop="status">
             <el-radio-group v-model="editModul.status">
                <el-radio :label="1">未解决</el-radio>
                <el-radio :label="2">已解决</el-radio>
                <!-- <el-radio :label="3">紧急Bug</el-radio> -->
             </el-radio-group> 
          </el-form-item>
        </el-form>
        <div class="btn" v-if="editModul.source==2 && changeTitle!==1">
            <el-button class="codes"   @click="dialogTableVisible1=false" plain>取消</el-button>
            <el-button class="xia" type="primary"   @click="nextEdit()" plain >确定</el-button>
        </div>
        <div class="btn" v-if="editModul.source==1 || changeTitle==1">
            <el-button class="codes"   @click="dialogTableVisible1=false" plain>关闭</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import MyPagination from "../../components/MyPagination.vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import ImgView from "../../components/ImgView3.vue";
import { detailTimeFilter, defValFilter01,defValFilter05 } from "../../constant/filter.js";
import { upload, token } from "../../api/systemApi";
import {
  getFeedbackListApi,
  addFeedbackListApi,
  delFeedbackApi,
  SolveFeedbackApi,
  selectFeedbackApi,
  updataFeedbackListApi
} from "../../api/userBugApi.js";
export default {
  name: "userBug",
  components: { MyPagination, Breadcrumb, TablePage, ImgView },
  created() {},
  data() {
    return {
      changeTitle: 0,
      fullLoading: false,
      dialogTableVisible: false,
      dialogTableVisible1: false,
      modal: false, // 是否显示弹框
      TitleList: [
        { type: 1, name: "未解决" },
        { type: 2, name: "已解决" }
        // { type: 3, name: "紧急Bug" }
      ], // tab栏
      data: {
        //  数据源
        title: "",
        list: [],
        loading: true
      },
      rules: {
        deviceType: [
          { required: true, message: "请输入手机品牌及系统版本号", trigger: "change" }
        ],
        img: [
          { required: true, message: "请上传反馈Bug图片", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入反馈标题", trigger: "change" }
        ],
        details: [
          { required: true, message: "请输入描述内容", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择反馈状态", trigger: "change" }
        ],
        version: [
          { required: true, message: "请输入系统版本", trigger: "blur" },
          { pattern: /\d+(\.\d+){0,2}/, message: '请输入正确的版本号' }
        ]
      },
      createModul: {
        //创建反馈提交对象
        userId:null,
        title: "",
        version: null,
        status: 1,
        img: "",
        deviceType: "",
        details: ""
      },
      imgArr: [],
      editModul: {
        //编辑反馈提交对象
        title: "",
        version: null,
        status: null,
        img: "",
        deviceType: "",
        details: ""
      }
    };
  },

  methods: {
    upload,
    detailTimeFilter,
    defValFilter01,
    defValFilter05,
    findList(page = {}) {
      this.createModul.userId=JSON.parse(localStorage.getItem('userInfo')).id
      getFeedbackListApi({ ...page, status: this.changeTitle + 1,title:this.data.title }).then(
        data => {
          this.data = { ...this.data, ...page, ...data, loading: false };
          //  console.log(data,555)
        }
      );
    },

    // 搜索
    search() {
      this.findList()
    },

    // 重置
    reset() {
      this.data.title=''
       this.findList({page:1})
    },
    reset1() {
      this.$refs.createModul.resetFields();
      this.imgArr = [];
    },
    reset2() {
      this.$refs.editModul.resetFields();
    },

    // 创建反馈
    addNews() {
      this.dialogTableVisible = true;
    },

    // tab切换
    redTitle(val) {
      this.changeTitle = val;
      this.data.loading = true;
      this.findList({page:1});
    },

    // 编辑按钮
    edit(val) {
      this.dialogTableVisible1 = true;
      selectFeedbackApi({ id: val.id }).then(data => {
        this.editModul = data;
      });
    },

    //编辑下的确定按钮
    nextEdit() {
      this.$refs.editModul.validate(valid => {
        if (valid) {
          updataFeedbackListApi({ ...this.editModul }).then(data => {
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.findList({page:1});
            this.dialogTableVisible1 = false;
          });
        }
      });
    },

    // 解决按钮
    solve(val) {
      this.$confirm("确定解决此反馈吗?", "提示", {
        confirmButtonText: "确定", 
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          SolveFeedbackApi({ id: val.id }).then(data => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.findList({page:1});
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },

    // 删除按钮
    del(val) {
      delFeedbackApi({ id: val.id }).then(data => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.findList({page:1});
      });
    },
    beforeUpload(file) {
      console.log(file);
      if (this.imgArr.length > 5) {
        warning(`已经超过5张图片`);
        return false;
      }
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg";
      if (this.type !== "text" && file.size >= this.size) {
        warning(
          `图片大小不能超过 ${this.size / 1024 / 1024} M！请修改后重新上传！`
        );
        return false;
      }
      if (!isJPEG && !isPNG && !isJPG) {
        warning(`上传图片必须是JPG/PNG/JPEG格式！`);
        return false;
      }
      return true;
    },
    deleteImg(index) {
      this.imgArr.splice(index, 1);
      this.editModul.img=this.editModul.img.split(',');
      this.editModul.img.splice(index, 1);
      this.editModul.img=this.editModul.img.join(',')
       console.log( this.editModul.img,5555);
    },

    successFun(data) {
      const url = `${token.path}${data.key}`;
      if (this.imgArr.length < 5) {
        this.imgArr.push(url);
        // 处理编辑时图片更改操作问题
        if (!this.editModul.img) {
           this.editModul.img=[this.imgArr[this.imgArr.length-1]].join(',')
        }else{
          this.editModul.img=[this.editModul.img.split(','),this.imgArr[this.imgArr.length-1]].join(',')
        }
        console.log(this.editModul.img,8888);
      } else {
        warning(`已经超过5张图片`);
      }
    },

    //  超出上传个数
    handleExceed(file, fileList) {
      warning(
        `当前限制选择 5 个文件，本次选择了 ${
          file.length
        } 个文件，共选择了 ${file.length + fileList.length} 个文件`
      );
    },

    next() {
     this.createModul.img = this.imgArr.join(",");
      this.$refs.createModul.validate(valid => {
        if (valid) {
          addFeedbackListApi({ ...this.createModul }).then(data => {
            this.$message({
              message: "创建成功",
              type: "success"
            });
            this.findList({page:1});
            this.dialogTableVisible = false;
          });
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.userBug {
  .cate_list {
    height: 74px;
    line-height: 71px;
    background-color: #fff;
    color: #333;
    margin-bottom: 20px;
    li {
      font-size: 20px;
      // font-weight: 600;
      float: left !important;
      margin: 0 17px;
      cursor: pointer;
    }
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
  }
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .search {
      span {
        font-size: 16px;
        margin-right: 10px;
      }
    }
    .block {
      margin-right: 4%;
    }
  }
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      // width: 42%;
      .btn {
        text-align: center;
      }
    }
  }
  .imgUp {
    display: flex;
    ul {
      display: flex;
      li {
        width: 150px;
        height: 150px;
        margin-right: 15px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .deleteImg {
          position: absolute;
          bottom: 0px;
          height: 25px;
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          padding: 0 10px;
          overflow: hidden;
          justify-content: space-between;
          a {
            height: 100%;
            display: flex;
            align-items: center;
          }
          i {
            color: #fff;
            margin-right: 15px;
            cursor: pointer;
          }
          i:last-child {
            margin-right: 0;
          }
        }
        p {
          text-align: center;
          margin-top: -24px;
          span {
            color: red;
          }
        }
      }
    }
  }
}
</style>
<style lang='less'>
.userBug {
  .upload {
    width: 150px;
    height: 150px;
    border: 1px dashed #666;
    .avatar-uploader {
      width: 100%;
      height: 100%;
      .el-upload {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-upload__input {
          width: 100%;
          height: 100%;
        }
        .el-icon-plus {
          font-size: 19px;
        }
      }
    }
  }
  .sj{
    input{
      padding-left: 25px;
    }
  }
  .box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
}
</style>