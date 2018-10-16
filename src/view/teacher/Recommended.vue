<!--  已推荐列表  页面-->
<template>
  <div class="teacherRecommended content_data" >
    <div class="bread_crumb header">
      <Breadcrumb/>
    </div>
    <div class="search kind">
      <el-select  style="margin-right: 32px" v-model="value" size="medium" placeholder="请选择" @change='changeSelect' >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model.trim="data.query" clearable @keydown.enter.native="search" @blur="search" placeholder="请输入任务名称或任务ID号查询" style="width: 276px;"></el-input>
      <el-button type="search" @click="search" icon="el-icon-search" style="margin-left: 32px">搜索</el-button>
      <el-button icon="el-icon-refresh" style="margin-left:32px;background:#ecf5ff" round @click="reset">重置</el-button>
    </div>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中..." ref="multipleTable">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column prop="id" label="ID" width="80" ></el-table-column> -->
        <el-table-column prop="name" label="机构名称" min-width="100" />
        <el-table-column prop="logo" label="头像" width="120">
          <template slot-scope="scope">
            <ImgView :src="scope.row.logo" width="90" height="90" />
          </template>
        </el-table-column>
        <el-table-column prop="mechanismPhone" label="账号" :formatter="defValFilter01"  min-width="130" />
        <el-table-column prop="leaderName" label="联系人" :formatter="defValFilter01"  width="100" />
        <el-table-column prop="phone" label="联系电话" :formatter="defValFilter01"  min-width="130" />
        <el-table-column prop="creatTime" label="注册时间" :formatter="dateFilter" width="120" />
        <el-table-column prop="statue" label="状态" :formatter="statueFilter" min-width="90" />
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button plain type="danger" size="middle" @click="cancleHandle(scope.row)">取消推荐</el-button>
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
  import {
    getOrganListApi,
    changeOrganTypeApi
  } from '../../api/institutionManagementApi'
  import {
    currencyFilter,
    defValFilter01,
    dateFilter,
    statueFilter,
    isRecommendFilter
  } from '../../constant/filter.js'
  export default {
    name: 'teacherRecommended',
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
            label: '姓名'
          },
          {
            value: 1,
            label: '手机号码'
          },
          {
            value: 2,
            label: 'ID'
          }
        ],
        value: 0,
        // changes: 0,
        // CREATE,
        data: {
          page: 1,
          pageSize: 10,
          list: [],
          query: '',
          status: 1,
          type:0,
          loading: false
        },
        centerDialogVisible: false
      }
    },
    created() {},
    methods: {
      currencyFilter,
      dateFilter,
      defValFilter01,
      statueFilter,
      isRecommendFilter,
      changeSelect(value) {
        this.data.type = value
        console.log('改变之后的data是-----', this.data)
      },
      //获取列表
      findList(page = {}) {
        this.data.loading = true
        getOrganListApi({ ...this.data, ...page }).then(data => {
          this.data = { ...this.data, ...data, loading: false, ...page }
          console.log('-------data', data)
        })
      },
      // 取消推荐
      cancleHandle(row) {
        confirm(`你确认取消推荐机构 ${row.name} 吗?`, 'warning', '取消确认').then(
          () =>
            changeOrganTypeApi({
              mechanismId: row.id,type: 1
            })
              .then(res => {
                console.log('取消后', res)
                this.findList()
              })
              .catch(({ msg }) => error(msg || '取消失败！请稍后重试...'))
        )
      },
      //搜索
      search(page = {}) {
        console.log('-------data111111111', this.data)
        this.findList({ ...page, page: 1 })
      },
      //重置
      reset(page = {}) {
        this.data.query = ''
        this.findList({ ...page, page: 1 })
      }
    }
  }
</script>
<style lang="less" scoped>
  .teacherRecommended {
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
  .teacherRecommended {
    .el-radio-button__inner {
      border: 1px solid #dcdfe6;
    }
    .perfectPage {
      padding-right: 30px;
      background-color: #fff;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
          border-radius: 23px;
          padding: 0 25px 0 15px;
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
    .el-table_1_column_6 {
      .cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
