<!--  -->
<template>
  <div class='modulData'>
    <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>添加活动数据</el-breadcrumb-item>
    </Breadcrumb>
    <div class="serch">
        <el-button type="primary"  icon="el-icon-plus" round @click="add()">添加活动数据</el-button>
        <el-button type="primary" round @click="sort()">{{ edit?'保存':'排序' }}</el-button>
    </div>
    <!-- 列表 -->
      <!-- <div class="list">
          <ul>
            <li v-for="(item,i) in data.list" :key="i">
              <img :src="item.picture" alt="" onerror="this.src='../../../static/img/admin.png'">
              <h3>{{ item.name }}</h3>
              <span class="yc" @click="yichu(item)">移除</span>
            </li>
          </ul>
          <MyPagination :page="data.pageNum" :pageSize="data.pageSize" :method="findList" :pageSizes=[12] :total="data.total" ></MyPagination>
      </div> -->
    <TablePage>
        <el-table :data="data.list" element-loading-text="拼命加载中...">
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="picture" label="活动封面图"  min-width="100" align="center">
            <template slot-scope="scope">
              <div class="img_col"><img :src="scope.row.picture" alt="" onerror="this.src='../../../static/img/admin.png'" style="width:100px;height:100px;"></div>
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="排序值" align="center">
            <template slot-scope="scope">
              <span v-show="!edit">{{scope.row.weight}}</span>
              <!-- <el-input v-model.number="scope.row.weight"   v-show="edit" ></el-input> -->
              <el-input-number v-model="scope.row.weight" :min="0" :max="100" v-show="edit" :controls='false'></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="操作" min-width="150" align="center">
            <template slot-scope="scope">
                <el-button size="small" type="danger" @click="yichu(scope.row)">删除</el-button>
            </template>
          </el-table-column>                
        </el-table>
    </TablePage>
    <!-- <MyPagination :page="data.pageNum" :pageSize="data.pageSize" :method="findList" :pageSizes=[12] :total="data.total" ></MyPagination> -->
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
import Breadcrumb from "../../components/Breadcrumb.vue";
import MyPagination from "../../components/MyPagination.vue";
import TablePage from "../../components/TablePage.vue";
import { gettoAddApi,deletContentApi,gettoGradeAddApi,sortIdsApi } from "../../api/activity";
export default {
  name: "modulData",
  components: { Breadcrumb, MyPagination,TablePage },
  created() {
     this.user=JSON.parse(localStorage.getItem('user'))
     this.findList() 
  },
  data() {
    return {
      edit:false,
      ids:[],
      data: {
        user:{},
        page: 1,
        pageSize: 10000,
        moduleType:JSON.parse(localStorage.getItem('user')).template,
        moduleId:JSON.parse(localStorage.getItem('user')).id,
        ids:'',
        queryType:0,
        queryName:'',
        list:[],
        gradeId:JSON.parse(localStorage.getItem('user')).gradeId
      }
    };
  },

  methods: {
    dateTimeFilter,
    defValFilter01,
    defValFilter02,
    currencyFilter,
    defValFilter03,
    findList(page = {}) {
      if (this.user.template==16) {
        gettoGradeAddApi({ ...this.data, ...page }).then(data => {
          this.data = { ...this.data, ...page, ...data, loading: false };
          this.data.list.forEach((item,i)=>{
              data.list[i].weight=i
          })
        });
      }else{
        gettoAddApi({ ...this.data, ...page }).then(data => {
          this.data = { ...this.data, ...page, ...data, loading: false };
          this.data.list.forEach((item,i)=>{
              data.list[i].weight=i
          })
        });
      }

    },
    add() {
      this.$router.push({ path: "addData" ,query:{item:this.$route.query.item}});
    },
    yichu(val){  
        deletContentApi({moduleId:this.data.moduleId,id:val.id}).then(data=>{
             this.$message({
              message: "删除成功",
              type: "success"
            });
            this.findList()
        })
    },
    sortIds(){
      sortIdsApi({moduleId:this.data.moduleId,ids:this.data.ids}).then(data=>{
        console.log(data,'ids....')
         this.findList()
        })
    },
    sort(){
      if (this.data.list.length==0) {
        this.$message({
            message: '没有可以需要排序的数据',
            type: 'warning'
          });
          return
      }
      if (!this.edit) {
         this.edit=true
      }else{
        let flag=false
        this.data.list.forEach(item=>{
          if (item.weight=='undefined') {
            flag=true
          }
        })
        if (flag) {
          this.$message({
            message: '排序值不能未空,且必须为正整数',
            type: 'warning'
          });
          return
        }
        this.edit=false
        this.data.list.sort(this.compare('weight'))
         console.log(this.data.list)
         this.ids=[]
         this.data.list.forEach(item=>{
            this.ids.push(item.id)
         })
        //  console.log(this.ids.join(','))
         this.data.ids=this.ids.join(',')
         this.sortIds()
      }
    },
    compare(property){    //从小到大排序
      return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.modulData {
  .serch {
    background: #fff;
    height: 70px;
    padding-right: 25px;
    line-height: 70px;
    text-align: right;
  }
  .list {
    width: 100%;
    margin-top: 20px;
    ul {
      margin-bottom: 20px;
      display: flex;
      justify-content:flex-start;
      flex-wrap: wrap;
      li {
        padding: 20px 0;
        width: 263px;
        background: #fff;
        text-align: center;
        margin-bottom: 20px;
        display: flex;
        justify-content:space-between;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-left: 15px;
        h3 {
          padding-top: 10px;
        }
        img{
          width: 128px;
          // height: 185px;
          display: inline;
          min-width: 117px;
        }
        .yc{
          width: 50px;
          height: 30px;
          background: #f56c6c;
          position: absolute;
          right: 10px;
          top: 10px;
          border-radius: 20px;
          color: #fff;
          line-height: 30px;
          cursor: pointer;
       }
      }
    }
    .el-pagination {
      text-align: center;
    }
  }
}
</style>