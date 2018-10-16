<!-- 四格图片 -->
<template>
  <div class='content_data otherModul'>
    <!-- <Breadcrumb/> -->
    <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>{{ item.name }}</el-breadcrumb-item>
    </Breadcrumb>
    <div class="titleBox">
      <el-button class="addClassify" type="primary" @click="add">添加</el-button>
   </div>

    <TablePage>
        <el-table :data="data.list" element-loading-text="拼命加载中...">
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column prop="image" label="活动封面图"  min-width="100">
            <template slot-scope="scope">
              <div class="img_col"><img :src="scope.row.image" alt="" onerror="this.src='../../../static/img/admin.png'"></div>
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="排序值">
            <template slot-scope="scope">
              <span>{{scope.row.weight}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.type == 0 ? "内置跳转" : "外部链接"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dataType" label="数据类型">
            <template slot-scope="scope">
              <span>{{scope.row.type == 0 ? fourGeTypeFilter(0,0,scope.row.dataType):scope.row.imageUrl}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{dateTimeFilter(0,0,scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="操作" min-width="150">
            <template slot-scope="scope">
                <el-button size="small" type="primary"  @click="edit(scope.row)" plain>编辑</el-button>
                <el-button size="small" type="primary"  @click="nosetDetail(scope.row)" v-if="scope.row.type==0">管理</el-button>
                <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>                
        </el-table>
        <!-- <MyPagination :page="dataList.page" :size="dataList.pageSize" :method='findList' :total="dataList.total"/> -->
    </TablePage>
    <!-- 一级弹框 -->
    <el-dialog title="" :visible.sync="dialogTableVisible" :modal="modal" custom-class="activity" @close="reset">
        <el-form :model="createModul" ref="createModul" :rules="rules" label-width="90px">
          <el-form-item label="活动名称:" prop="name">
            <el-input v-model.trim="createModul.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="封面图:" prop="image" >
            <Avatar :url="createModul.image" width="150"  height="140" @success="createModul.image = $event"/>
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
          </el-form-item>
          <el-form-item label="权  重  值:" prop="weight">
            <el-input-number v-model.number="createModul.weight" @change="handleChange" :min="0" :max="100" label=""></el-input-number>
          </el-form-item>
          <el-form-item label="类 型:"  prop="type">
            <el-radio-group v-model.number="createModul.type" @change="linkType">
              <el-radio :label="0">内置跳转</el-radio>
              <el-radio :label="1">外部链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="链 接:"  prop="imageUrl" v-if="createModul.type==1">
            <el-input v-model.trim="createModul.imageUrl" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <h3 v-show="createModul.type==0" style="padding-left: 25px;">请选择数据类型:</h3>  
         <ul class="type" v-show="createModul.type==0">
          <li v-for="(item,i) in list" :key="i" @click="xuanze(item.id)" :class="{active:createModul.dataType==item.id}">
            <img :src="item.img" alt="">
            <div>
              <h3>{{ item.title }}</h3>
            </div>
          </li>
        </ul>
        <div class="btn">
            <el-button class="codes"  size="small" @click="dialogTableVisible=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="next('createModul')" plain >确定添加</el-button>
        </div>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog title="" :visible.sync="editDialog" :modal="modal" custom-class="establish" width="700px">
        <el-form :model="editList" ref="editList" :rules="rules" label-width="90px">
          <el-form-item label="活动名称:"  prop="name">
            <el-input v-model="editList.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="封面图:"  prop="image" >
            <Avatar :url="editList.image" width="150"  height="140" @success="editList.image = $event"/>
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
          </el-form-item>
          <el-form-item label="排 序 值:"  prop="weight">
            <el-input-number v-model="editList.weight" :min="0" :max="100" style="width:198px"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="btn" style="text-align: center;">
            <el-button class="codes"   @click="editDialog=false" plain>取消</el-button>
            <el-button class="xia"  type="primary" @click="editModul('editList')" plain>确定创建</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import MyPagination from "../../components/MyPagination.vue";
import TablePage from "../../components/TablePage.vue";
import {
  dateTimeFilter,
  fourGeTypeFilter,
  typeFilter
} from "../../constant/filter.js";
import {
  fourGeApi,
  particularsListApi,
  addParticularsApi,
  deletContentApi,
  getActivityApi,
  updataDetailApi
} from "../../../src/api/activity";
import Avatar from "../../components/Avatar.vue";
export default {
  name: "otherModul",
  components: { Breadcrumb, MyPagination, TablePage, Avatar },
  data() {
    var imageUrls = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入链接地址"));
      } else {
        if (!/(http|ftp|https):\/\/([\w.]+\/?)\S*/.test(value)) {
          callback(new Error("请输入以http/https开头的链接地址"));
        }
        callback();
      }
    };
    var weights = (rule, value, callback) => {
        if (value=='undefined') {
          callback(new Error('请输入权重'));
        } else {
          if (!/^([0-9][0-9]{0,1}|100)$/.test(value)) {
            callback(new Error('权重值在0~100之间'));
          }
          callback();
        }
      };
    return {
      dialogTableVisible: false,
      editDialog:false,
      modal: false,
      createModul: {
        name: "",
        image: "",
        weight: "",
        type: 0,
        dataType: "",
        imageUrl: "",
        moduleId: JSON.parse(localStorage.getItem('user')).id
      },
      item:JSON.parse(localStorage.getItem('user')),
      data: {
        list: []
      },
      list: [
        {
          img: "../../../static/img/hd_list/data_teacher.png",
          title: "教师",
          id:1
        },
        {
          img: "../../../static/img/hd_list/data_organ.png",
          title: "机构",
          id:2
        },
        {
          img: "../../../static/img/hd_list/data_goods.png",
          title: "商品",
          id:3
        },
        {
          img: "../../../static/img/hd_list/data_news.png",
          title: "资讯",
          id:4
        },
        {
          img: "../../../static/img/hd_list/data_video.png",
          title: "视频",
          id:5
        },
        {
          img: "../../../static/img/hd_list/data_online.png",
          title: "直播",
          id:6
        },
        {
          img: "../../../static/img/hd_list/data_offline.png",
          title: "线下课程",
          id:7
        }
      ],
      list1:[
        {
          img: "../../../static/img/hd_list/data_goods.png",
          title: "商品",
          id:3
        },
        {
          img: "../../../static/img/hd_list/data_news.png",
          title: "资讯",
          id:4
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "change" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择位置", trigger: "change" }],
        imageUrl:[{ validator: imageUrls, required: true, trigger: "blur" }],
        weight: [{validator: weights, required: true,trigger: "change" }]
      },
      editList:{}
    };
  },

  created() {
    particularsListApi({ moduleId: this.item.id }).then(data => {
      this.data.list = data;
    });
    if (this.item.type==1) {
      this.list=this.list1
    }
  },

  methods: {
    dateTimeFilter,
    fourGeTypeFilter,
    typeFilter,
    reset(){                //重置表单
        this.$refs.createModul.resetFields();
    },
    add() {
     
      this.dialogTableVisible = true;
      this.createModul.dataType=''
      
    },
    nosetDetail(item) {
      this.$router.replace({ path: "typeModul",query:{id:item.id,dataType:item.dataType}});
    },
    del(val) {
        deletContentApi({moduleId:this.createModul.moduleId,id:val.id}).then(data=>{
          particularsListApi({ moduleId: this.item.id }).then(data => {
          this.data.list = data;
        });
      })
    },
    handleChange(val) {
      this.createModul.weight = val;
    },
    xuanze(i) {
      this.createModul.dataType = i
    },
    next() {
      if (this.createModul.type==0) {
          if (!this.createModul.dataType) {
          this.$message({
            message: "请选择一种数据类型",
            type: "warning"
          });
          return;
        }
      }

      this.$refs.createModul.validate(valid => {
        if (valid) {
          addParticularsApi({ ...this.createModul }).then(data => {
            this.dialogTableVisible = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$refs.createModul.resetFields();
            if (this.createModul.dataType && this.createModul.type==0) {
              this.$router.replace({ path: "typeModul",query:{dataType:this.createModul.dataType,id:data}});
            }else{
              particularsListApi({ moduleId: this.item.id }).then(data => {
                this.data.list = data;
              });
            }
          });
        }
      });

    },
    edit(val){
      this.editDialog=true
      getActivityApi({id:val.id}).then(data=>{
        this.editList=data
      })
    },
    editModul(){
      this.$refs.editList.validate(valid => {
        if (valid) {
          updataDetailApi({...this.editList}).then(data=>{
            this.$message({
                message: "编辑成功",
                type: "success"
              });
            particularsListApi({ moduleId: this.item.id }).then(data => {
                this.data.list = data;
              });
          })
          this.editDialog=false
        }
      })
    },
    linkType(){
      if (this.createModul.type==1) {
        this.createModul.dataType=''
        this.createModul.imageUrl=''
      }
    }
  }
};
</script>
<style lang='less' scoped>
.otherModul {
  .titleBox {
    background-color: #fff;
    height: 74px;
    line-height: 74px;
    position: relative;
    margin-bottom: 20px;
    .addClassify {
      position: absolute;
      top: 15px;
      right: 40px;
      width: 120px;
    }
  }
  // 列表
  .table_page {
    margin-top: 20px;
    .el-table_1_column_1 {
      width: 100%;
      .cell {
        .el-col-11 {
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
    .img_col {
      width: 100%;
      height: 100px;
      text-align: center;
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 30%;
    }
  }
}
</style>
<style lang="less">
.otherModul {
  .avatar_box {
    // margin: 50px;
  }
  .activity {
     width: 953px;
    height: 700px;
    overflow-y: scroll;
    .type {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        text-align: center;
        margin-bottom: 20px;
        border: 2px solid #fff;
        margin-left: 20px;
        h3 {
          font-size: 18px;
          font-weight: bold;
        }
        img {
          width: 200px;
        }
      }
      .active {
        border-color: #51c5ff;
      }
    }
    .btn {
      padding-top: 20px;
      text-align: center;
      button {
        width: 114px;
        height: 40px;
        border: solid 1px rgba(201, 204, 207, 0.47);
        border-radius: 20px;
      }
      .xia {
        background-color: #51c5ff;
        color: #fff;
      }
    }
  }
}
</style>
