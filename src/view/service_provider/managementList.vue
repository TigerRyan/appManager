<template>
  <div class="managementList content_data" >
    <div class="bread_crumb header">
      <Breadcrumb/>
    </div>
    <div class="search kind">
      <el-select  style="margin-right: 32px" v-model="data.type" placeholder="请选择" @change='changeSelect'>
          <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
      </el-select>
      <el-input v-model.trim="data.query" clearable @keydown.enter.native="search"  placeholder="请输入服务商名称或任务ID号查询" style="width: 276px;"></el-input>
      <el-button type="search" @click="search" icon="el-icon-search" style="margin-left: 32px">搜索</el-button>
      <el-button icon="el-icon-refresh" style="margin-left:32px;background:#ecf5ff" round @click="reset">重置</el-button>
    </div>
    <TablePage>
          <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中..." ref="multipleTable">
             <el-table-column prop="id" label="ID"  min-width="100" />
            <el-table-column prop="name" label="名称"  min-width="100" :formatter="defValFilter01"/>
            <el-table-column prop="logo" label="服务商图片" width="120">
              <template slot-scope="scope">
                <ImgView :src="scope.row.logo" width="90" height="90" />
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="账号"  width="130"/>
            <el-table-column prop="type " label="服务商类型">
              <template slot-scope="scope">
                <span>{{scope.row.type?'个人':'企业'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" label="统一社会信用代码" min-width="160" :formatter="defValFilter01"/>
            <el-table-column prop="contactName" label="联系人姓名" :formatter="defValFilter01" width="100" />
            <el-table-column prop="contactPhone" label="联系人电话" :formatter="defValFilter01" width="130" />
             <el-table-column prop="creatTime" label="注册时间" width="110">
                 <template slot-scope="scope">
                <span>{{dateFilter(0,0,scope.row.createTime)}}</span>
              </template>
             </el-table-column>
            <el-table-column prop="status"  label="启用状态" :formatter="statueFilter" width="100" >
              <template slot-scope="scope">
                <span :style="{color: scope.row.status ? '#F56c6c' : '#67c23A' }"> {{statueFilter(0,0, scope.row.status)}}</span>
              </template>
            </el-table-column>
            <!-- authenticationColor -->
            <el-table-column prop="authenticationStatus" :formatter="authenticationFilter" label="认证状态" width="100">
              <template slot-scope="scope">
                <span :style="{color:authenticationColor[scope.row.authenticationStatus]}"> {{authenticationFilter(0,0, scope.row.authenticationStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button type="del" size="small" @click="check(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </TablePage>
    <div class="perfectPage">
      <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10]" :method="findList" :total="data.total" />
    </div>
  </div>
</template>
<script>
import MyPagination from '../../components/MyPagination.vue'
import TablePage from '../../components/TablePage.vue'
import ImgView from '../../components/ImgView.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import { confirm, success, error } from '../../actions/index'
import { getProviderListApi} from '../../api/institutionManagementApi'
import {
  currencyFilter,
  defValFilter01,
  dateFilter,
  statueFilter,
  isRecommendFilter,
  authenticationFilter,
  accountTypeFilter
} from "../../constant/filter.js";
export default {
  name: "managementList",
  components: {
    MyPagination,
    TablePage,
    ImgView,
    Breadcrumb
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: "名称"
        },
        {
          value: 1,
          label: "手机号码"
        },
        {
          value: 2,
          label: "ID"
        }
      ],
      authenticationColor: ["#909399", "#409eff", "#67C23A", "#F56C6C"],
      changes: 0,
      // CREATE,
      data: {
        type: 0,
        page: 1,
        pageSize: 10,
        list: [],
        query: "", //搜索关键字
        loading: false
      },
      centerDialogVisible: false,
      disabled:　false,
    }
  },
  created() {},
  methods: {
    currencyFilter,
    dateFilter,
    defValFilter01,
    statueFilter,
    isRecommendFilter,
    authenticationFilter,
    accountTypeFilter,
    changeSelect(value) {
       console.log(value,'.....123val')
    },
    findList(page = {}) {
      this.data.loading = true;
      getProviderListApi({
        ...this.data,
        ...page
      }).then(data => {
        this.data = { ...this.data, ...data, loading: false, ...page };
      });
    },
    search(page = {}) {
      this.$router.replace({ query: { ...this.$route.query, page: 1 } });
      this.findList({ ...page, page: 1 });
    },
    reset(page = {}) {
      this.data.query='',
      this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      this.findList({ ...page, page: 1 })
    },
    check(detail){
      this.$router.push({name:'managementDetail', query:{id:detail.id,type:detail.type}})
      this.data.query = "",
      this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      this.findList({ ...page, page: 1 })
    }
  }
};
</script>
<style lang="less" scoped>
.managementList {
  box-sizing: border-box;
  .header.bread_crumb {
    height: 74px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 30px;
    justify-content: space-between;
    margin-bottom: 30px;
    .el-breadcrumb {
      padding-bottom: 0px;
    }
  }
  .kind {
    .el-radio-button {
      margin-right: 20px;
    }
    display: flex;
    align-items: center;
    padding-left: 29px;
    height: 74px;
    background-color: #ffffff;
    line-height: 56px;
    color: #333333;
    font-size: 18px;
    padding-top: 9px;
    padding-bottom: 9px;
    border-bottom: 1px solid #edf1f5;
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
    h2 {
      font-size: 18px;
    }
    ul li {
      float: left;
      &:nth-of-type(1) {
        margin-left: 46px;
        margin-right: 66px;
      }
    }
  }
  //搜索
  .search {
    margin-bottom: 20px;
    margin-top: 20px;
    position: relative;
    .el-button {
      padding: 12px 32px;
      font-size: 16px;
    }
    .el-button--search {
      color: #ffffff;
      background-color: #51c5ff;
      border: none;
    } //显示标签
    .el_tagicon {
      position: absolute;
      width: 140px;
      right: 80px;
      top: 50%;
      transform: translateY;
      transform: translateY(-50%);
      text-align: right;
    } //导出标签
    .el-put {
      position: absolute;
      right: 170px;
      top: 18px;
      border: none;
    } // 统计分析
  }
}
//按钮
.el-button {
  padding: 7px 11px 7px 9px;
  font-size: 16px;
  border-radius: 4px;
}
// 删除按钮
.el-button--del {
  border: solid 1px #f55f5a;
  color: #f55f5a;
}
.el-button--del:hover,
.el-button--del:focus {
  background-color: #f55f5a;
  color: #ffffff;
}

//编辑和查看详情按钮
.el-button--edit {
  border: solid 1px #4ebbf2;
  color: #4ebbf2;
}
.el-button--edit:hover,
.el-button--edit:focus {
  background-color: #4ebbf2;
  color: #ffffff;
}

// 查看凭证和评分按钮
.el-button--voucher {
  color: #fc8b48;
  border: 1px solid #fc8b48;
}
.el-button--voucher:hover,
.el-button--voucher:focus {
  background-color: #fc8b48;
  color: #ffffff;
}
</style>
<style lang="less">
// 表格样式
.managementList {
  .el-radio-button__inner {
    border: 1px solid #dcdfe6;
  }
  .perfectPage {
    background-color: #fff;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-table {
    padding-top: 0;
    .cell {
      line-height: 1;
      font-size: 16px;
      color: #4d4d4d;
    }
    th {
      padding: 24px 0;
      background-color: #f9fafb;
    }
    td {
      padding: 15px 0;
    }
  }
  > .search.kind {
    > .el-input {
      > .el-input__inner {
        // border-radius: 23px;
        // padding: 0 25px 0 15px;
        box-sizing: border-box;
      }
    }
    .el-button.el-button--primary,
    .el-button.el-button--search,
    .el-button.el-sta {
      background-color: #51c5ff;
      border-radius: 20px;
      border-color: #51c5ff;
      &:hover {
        opacity: 0.8;
      }
    }
    .el-button.el-button--default {
      border-radius: 20px;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .el-dialog__footer {
    .el-button.el-button--danger,
    .el-button.el-button--default,
    .el-button.el-button--primary {
      width: 100px;
      height: 40px;
      border-radius: 20px;
    }
  }
  .el-table_1_column_2,
  .el-table_1_column_4,
  .el-table_1_column_6,
  .el-table_1_column_7 {
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
