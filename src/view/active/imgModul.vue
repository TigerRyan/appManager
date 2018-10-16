<!--  -->
<template>
  <div class='addData'>
    <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>新增模块活动</el-breadcrumb-item>
    </Breadcrumb>
    <div class="serch">
      <el-input placeholder="" clearable class="min" v-model="data.queryName" />
      <el-button type="primary"  round @click="select()">确认查询</el-button>
    </div>
     <!-- 列表 -->
      <div class="list">
          <el-checkbox-group @change="handleCheckedCitiesChange" v-model="checkedCities">
            <ul>
              <li v-for="(item,index) in data.list" :key="index">
                <el-checkbox :label="item.id">{{ item.name || '未知' }}</el-checkbox>
                <img :src="item.picture" alt="" onerror="this.src='../../../static/img/admin.png'">
                <h3>{{ item.name }}</h3>
              </li>
            </ul>
          </el-checkbox-group>
          <div class="btn">
            <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
      </div>
        <el-button type="primary"  round class="addModul" @click="addModul">确定添加</el-button>
        <MyPagination :page="data.pageNum" :pageSize="data.pageSize" :method="findList" :pageSizes=[12] :total="data.total" ></MyPagination>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import MyPagination from "../../components/MyPagination.vue";
import { gettoAddApi,addApi,detailsApi,addContentApi } from "../../api/activity";
export default {
  name: "addData",
  components: { Breadcrumb, MyPagination },
  data() {
    return {
      item:this.$route.query.item,
      id:this.$route.query.id,
      data: {
        page: 1,
        pageSize: 12,
        queryType: 1,
        queryName: "",
        particularsId :this.$route.query.id,
        dataType :this.$route.query.dataType || this.$route.query.item.dataType,
        list: []
      },
      addData:{
        particularId:this.$route.query.id,
        ids:''
      },
      value: "",
      checkedCities: [],
      checkAll: false,
      isIndeterminate: true,
      check:[]
    };
  },

  methods: {
    findList(page = {}) {
      this.checkAll=false
      detailsApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...page, ...data, loading: false };
      }); 
    },
    //添加按钮
    addModul(val) {
        if (this.checkedCities.length == 0) {
          this.$message({
            message: '请选择要添加的项',
            type: 'warning'
          });
          return
        }
        this.addData.ids=this.checkedCities.join(',')
        addContentApi({...this.addData}).then(data=>{
           this.$message({
              message: "添加成功",
              type: "success"
            });
           this.$router.push({ path: "typeModul" ,query:{item:this.item,id:this.$route.query.id,dataType:this.$route.query.dataType}});
        })
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.data.list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.list.length;
    },
    //全选
    handleCheckAllChange(val){
      this.check=[]
      this.data.list.forEach(item=>{
          this.check.push(item.id)
      })
      this.checkedCities = val ? this.check : [];
      this.isIndeterminate = false;
    },
    reverselect() {
        
    },
    select() {
      this.findList();
    }
  },
};
</script>
<style lang='less' scoped>
.serch {
  background: #fff;
  height: 70px;
  padding-left: 25px;
  line-height: 70px;
  .min {
    width: 20%;
    input {
      border-radius: 20px;
    }
  }
}
.list {
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      margin-bottom: 20px;
      margin-left: 23px;
      img {
        width: 128px;
        max-height: 200px;
      }
    }
  }
  .btn {
    padding-bottom: 20px;
  }
}
</style>
<style lang='less'>
.addData {
  .serch {
    .min {
      width: 20%;
      input {
        border-radius: 20px;
      }
    }
    button {
    }
    .el-select {
      padding: 0 20px;
    }
  }
  .list {
    width: 100%;
    margin-top: 20px;
    ul {
      margin-bottom: 20px;
      li {
        padding: 20px 0;
        width: 23%;
        height: 300px;
        background: #fff;
        text-align: center;
        position: relative;
        h3 {
          padding-top: 20px;
        }
        .el-checkbox {
          position: absolute;
          left: 50%;
          bottom: 10px;
          transform: translateX(-50%);
          display: flex;
          justify-content: space-between;
          .el-checkbox__label{
            width: 250px;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .el-pagination {
    text-align: center;
  }
  .addModul {
    display: block;
    margin: 0 auto;
    width: 104px;
    height: 40px;
    margin-bottom: 20px;
  }
}
</style>