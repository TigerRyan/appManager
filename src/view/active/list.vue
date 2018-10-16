<!--活动管理-->
<template>
  <div class='content_data list'>
    <Breadcrumb/>
    <div class="serch">
        <el-button type="primary"  icon="el-icon-plus" round @click="edit()" :disabled = 'disabled'>新增活动</el-button>
    </div>
    <TablePage class="lock" v-show="data.showFreeze">
      <el-table :data="data.list" v-loading="data.loading" @sort-change="sort" element-loading-text="拼命加载中...">
        <el-table-column prop="name" label="活动名称"  min-width="80"/>
        <el-table-column prop="type" label="位置"  :formatter="weizhi"  min-width="100"/>
        <el-table-column prop="template" label="模板" :formatter="template" min-width="130"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="dateTimeFilter" min-width="130"/>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-button  :disabled = 'disabled' size="small" @click="open(scope.row)"  plain>{{ scope.row.status==0?'关闭':'开启' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button class="codes"  :disabled = 'disabled' size="small" @click="editSmall(scope.row)" plain>编辑</el-button>
            <el-button class="codes"  :disabled = 'disabled' size="small" @click="administration(scope.row)" plain>管理</el-button>
            <el-button class="details" :disabled = 'disabled' type="danger"  size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    </TablePage>

    <!-- 一级弹框 -->
    <el-dialog title="请选择活动模板" :visible.sync="dialogTableVisible" :modal="modal" custom-class="activity">
        <ul>
          <li v-for="(item,i) in list" :key="i" @click="xuanze(i,item.id)" :class="{active:createModul.template==item.id}">
            <img :src="item.img" alt="">
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.content }}</p>
            </div>
          </li>
        </ul>
        <div class="btn">
            <el-button class="codes"  size="small" @click="dialogTableVisible=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="next('createModul')" plain >下一步</el-button>
        </div>
    </el-dialog>
    <!-- 二级弹框 -->
    <el-dialog title="" :visible.sync="dialog" :modal="modal" custom-class="establish" @close="reset">
        <el-form :model="createModul" ref="createModul" :rules="rules">
          <el-form-item label="活动名称" label-width="60" prop="name">
            <el-input v-model="createModul.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择年级" label-width="60" prop="gradeId" v-if="createModul.template==16">
            <el-select v-model="createModul.gradeId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.itemName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动位置" label-width="60" prop="type">
            <el-radio-group v-model="createModul.type" :disabled="disabled1">
              <el-radio :label="0">学生首页</el-radio>
              <el-radio :label="1">商城首页</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权  重  值" label-width="75" prop="weight">
            <el-input v-model.number="createModul.weight" auto-complete="off" class="weight"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="codes"  size="small" @click="dialog=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="establish('createModul')" plain>确定创建</el-button>
        </div>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog title="编辑活动" :visible.sync="editDialog" :modal="modal" custom-class="establish" width="700px" center>
        <el-form :model="editList" ref="editList" :rules="rules">
          <el-form-item label="活动名称" label-width="60" prop="name">
            <el-input v-model="editList.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权 重 值" label-width="70" prop="weight">
            <el-input-number v-model="editList.weight" :min="1"  style="width:198px"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="btn">
            <el-button class="codes"  size="small" @click="editDialog=false" plain>取消</el-button>
            <el-button class="xia"  size="small" @click="editModul('editList')" plain>确定创建</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  dateTimeFilter,
  defValFilter01,
  defValFilter02,
  currencyFilter,
  defValFilter03,
  weizhi,
  template,
  status
} from "../../constant/filter";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import ImgView from "../../components/ImgView.vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import { getActiviListApi, createModulApi, deletModulApi,openApi,getActivityDetailApi,updataApi,getGradeApi} from "../../api/activity";
export default {
  name: "list",
  components: { TablePage, MyPagination, ImgView, Breadcrumb },
  data() {
     var weights = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入权重'));
        } else {
          if (!/^([1-9][0-9]{0,1}|100)$/.test(value)) {
            callback(new Error('权重值在1~100之间'));
          }
          callback();
        }
      };
    return {
      disabled1:false,
      dialogTableVisible: false,    //一级弹框
      dialog: false,                //二级弹框
      editDialog:false,             //编辑弹框
      modal: false,
      center: true,
      appendToBody: true,
      changeBlue: 0,
      disabled: false,
      statu:'',
      num:'',
      options:[],                   //年级分类数组
      value:'',                     //选择的年级分类
      data: {
        page: 1,
        pageSize: 10,
        state: "",
        title: "",
        type: 1,
        list: [],
        total: 0,
        loading: false,
        showFreeze: true,
        name: null,
        pid: null
      },
      createModul: {
        name: "",
        type: "",
        weight: null,
        template: "",
        gradeId:null
      },
      list: [
        { id:2,
          img: "../../../static/img/hd_list/activity_form_four_lattice.png",
          title: "四格模板",
          content: "适用于任何活动，必须上传四张图"
        },
        {id:3,
          img: "../../../static/img/hd_list/activity_form_three_lattice.png",
          title: "三格模板",
          content: "适用于任何活动，必须上传三张图"
        },
        {id:4,
          img: "../../../static/img/hd_list/activity_form_organ.png",
          title: "机构模板",
          content: "仅仅适用于机构"
        },
        {id:5,
          img: "../../../static/img/hd_list/activity_form_left.png",
          title: "左右模板",
          content: "适用于任何活动，必须上传三张图"
        },
        {id:6,
          img: "../../../static/img/hd_list/activity_form_carousel.png",
          title: "轮播模板",
          content: "适用于任何活动"
        },
        {id:12,
          img: "../../../static/img/hd_list/activity_form_goods.png",
          title: "商品模板",
          content: "仅仅适用于商品"
        },
        {id:11,
          img: "../../../static/img/hd_list/activity_form_view.png",
          title: "视图模板",
          content: "适用于任何活动，必须上传四张图"
        },
        {id:14,
          img: "../../../static/img/hd_list/activity_form_eight.png",
          title: "精选老师模板",
          content: "只能添加教师数据"
        },
        {id:15,
          img: "../../../static/img/hd_list/activity_form_nine.png",
          title: "线下课程模板一模板",
          content: "只能添加线下课程数据"
        },
        {id:16,
          img: "../../../static/img/hd_list/activity_form_ten.png",
          title: "线下课程模板二模板",
          content: "只能添加线下课程数据"
        },
        {id:17,
          img: "../../../static/img/hd_list/activity_form_eleven.png",
          title: "线下课程模板三模板",
          content: "只能添加线下课程数据"
        },
        {id:18,
          img: "../../../static/img/hd_list/activity_form_twelve.png",
          title: "线下课程模板四模板",
          content: "只能添加线下课程数据"
        },
        {id:19,
          img: "../../../static/img/hd_list/activity_form_fourteen.png",
          title: "机构模板二模板",
          content: "只能添加机构数据"
        },
        {id:20,
          img: "../../../static/img/hd_list/activity_form_thirteen.png",
          title: "机构模板三模板",
          content: "只能添加机构数据"
        },
        {id:22,
          img: "../../../static/img/hd_list/activity_form_sixteen.png",
          title: "机构模板四模板",
          content: "只能添加机构数据"
        },
        {id:21,
          img: "../../../static/img/hd_list/activity_form_fifteen.png",
          title: "直播课程模板一模板",
          content: "只能添加直播专题数据"
        },
        
      ],
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "change" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择位置", trigger: "change" }],
        gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],
        weight: [
            {validator: weights, required: true,trigger: "change" }
          ]
      },
      editList:{}
    };
  },

  methods: {
    dateTimeFilter,
    defValFilter01,
    defValFilter02,
    defValFilter03,
    currencyFilter,
    weizhi,
    template,
    status,
    findList(page = {}) {
      this.data.loading = true;
      getActiviListApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...page, ...data, loading: false };
      });
    },
    //状态切换
    open(val){
      val.status==0?this.statu=1:this.statu=0
      openApi({moduleId:val.id,status:this.statu}).then(data=>{
          this.$message({
                message: "操作成功",
                type: "success"
              });
          this.findList()
      })
    },
    reds: function(index) {
      this.changeBlue = index;
    },
    sort({ order, prop }) {
      this.search(
        prop
          ? { [prop]: { descending: 0, ascending: 1 }[order] }
          : { earning: null }
      );
    },

    del(row) {
        deletModulApi({moduleId:row.id}).then(data=>{
            if (data) {
              this.$message({
                message: "刪除成功",
                type: "success"
              });
              this.findList();
            }
        })
    },
    edit() {
      this.dialogTableVisible = true;
      this.createModul.template = ''
    },
    editSmall(val){
      this.editDialog=true
      getActivityDetailApi({id:val.id}).then(data=>{
        this.editList=data
      })
    },
    xuanze(i,id) {
      this.createModul.template = id
      const arr = [2,6,11,12]
      const arr2 = [2,3,4,5,6,14,15,16,17,18,19,20,21,22]
      const arr3 = [2,6]
      if(arr3.indexOf(id)>=0){
        this.disabled1 = false
      }

      if(arr.indexOf(id)>=0){
        if(arr3.indexOf(id)<0){
          this.disabled1 = true
          this.createModul.type = 1
        }
      }

      if(arr2.indexOf(id)>=0){
        if(arr3.indexOf(id)<0){
          this.disabled1 = true
          this.createModul.type = 0
        }
      }
    },
    next(val) {
      if (!this.createModul.template) {
        this.$message({
          message: "请选择一种活动模板类型",
          type: "warning"
        });
        this.$refs[val].resetFields();
        return;
      }
      this.dialogTableVisible = false;
      this.dialog = true;
    },
    // 管理按钮
    administration(item) {
      localStorage.setItem('user',JSON.stringify(item))
      if (item.template==4 || item.template==12 || item.template>=14) {
        this.$router.push({ path: "modulData" });
      }else{
        this.$router.push({ path: "otherModul"});
      }
    },
    // 确认创建按钮
    establish(val) {
      this.$refs[val].validate(valid => {
        if (valid) {
          createModulApi({ ...this.createModul }).then(data => {
            if (data) {
              this.$refs[val].resetFields();
              this.findList();
              this.dialog = false;
            }
          });
        }
      });
    },
    editModul(val){
      this.$refs[val].validate(valid => {
        if (valid) {
          updataApi({...this.editList}).then(data=>{
                this.$message({
                message: "编辑成功",
                type: "success"
                });
                 this.findList()
                this.editDialog=false             
          })
        }
      })
    },
    reset(){
      this.$refs.createModul.resetFields();
    },
    
  },

  created() {
    getGradeApi().then(data=>{
      data.forEach(item => {
        if (item.itemLevels==1) {
          this.options.push(item)
        }
      });
    })
    // type, 0为编辑， 1为查看
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
  }
};
</script>
<style lang='less' scoped>
.content_data {
  min-width: 563px;
  p,
  h3,
  div {
    margin: 0;
    padding: 0;
  }
  .cate_list {
    height: 100%;
    line-height: 70px;
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
  }
  .cap {
    width: 100%;
    height: 70px;
    background: #fff;
    line-height: 70px;
    padding-left: 25px;
    border-left: 2px solid #45b9f4;
    color: #45b9f4;
    font-size: 20px;
    font-family: "微软雅黑";
  }
  .serch {
    background: #fff;
    height: 70px;
    padding-left: 25px;
    line-height: 70px;
    .sc {
      width: 30%;
      margin: 0 30px;
      .el-input__inner {
        border-radius: 40px;
      }
    }
    .el-button--primary {
      background-color: #51c5ff;
      border-color: #51c5ff;
    }
  }
  .cate_nav {
    margin-top: 20px;
  }
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 30%;
    }
  }

  .el-dialog__header {
    background-color: #eee;
  }
  .code {
    width: 100%;
    img {
      width: 30%;
      margin: 0 auto;
      display: block;
    }
  }
  .describe {
    text-align: center;
    padding: 30px 0;
    font-size: 18px;
    color: #51c5ff;
  }
  .link {
    width: 100%;
    li {
      width: 70%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 20px auto;
      span {
        font-size: 15px;
      }
      span:nth-of-type(1) {
        text-align: right;
      }
      span:nth-of-type(2) {
        width: 35%;
      }
    }
  }
  .codes {
    border-color: #45b9f4;
    color: #45b9f4;
  }
  
}
</style>
<style lang="less">
.list {
  .activity.el-dialog {
    width: 944px;
    height: 650px;
    position: relative;
    .el-dialog__header {
      text-align: center;
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
    .el-dialog__body {
      padding-top: 0;
      height: 550px;
      overflow-y: scroll;
      ul {
        display: flex;
        justify-content:flex-start;
        flex-wrap: wrap;
        li {
          width: 260px;
          list-style: none;
          margin-bottom: 30px;
          border: 3px solid #fff;
          margin-left:15px;
          margin-right:20px;
          img {
            // border: 1px solid #fff;
          }
          div {
            width: 100%;
            text-align: center;
          }
        }
        .active {
        border-color: #51c5ff;
      }
      }
      .btn {
        position: absolute;
        bottom: 0;
        height: 68px;
        left: 0;
        background-color: #f1f3f6;
        width: 100%;
        text-align: right;
        line-height: 68px;
        button {
          margin-right: 20px;
          width: 114px;
          height: 40px;
          background-color: #ffffff;
          border-radius: 20px;
          border: solid 1px rgba(201, 204, 207, 0.47);
        }
        .xia {
          background-color: #51c5ff;
          color: #fff;
        }
      }
    }
  }
  .establish {
    .el-dialog__body {
      padding-top: 0px;
      width: 50%;
      margin: 0 auto;
      .el-form-item {
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
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
    .weight{
      .el-input__inner{
        padding:0 11px;
      }
    }
    .el-input--suffix .el-input__inner{
      padding-right: 11px;
    }
  }
}
</style>
