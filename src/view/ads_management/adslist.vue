<template>
  <div class="content_data adslist">
    <Breadcrumb/>
    <el-button type="primary" style="right: 30px;top: 15px" @click="add" class="addbtn" :disabled="disabled">+新增广告</el-button>

    <div class="time_search">
			<div class="search">
				<el-input placeholder="请输入广告名称" style="width: 378px;" v-model="advName"></el-input>      
			</div>
			 <div class="block">
				<el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;"  round @click="search">查询</el-button>
				<el-button  icon="el-icon-refresh" style="margin-left:40px;background:#ecf5ff"  round  @click="reset">重置</el-button>
			</div>
    </div>

    <TablePage v-loading.fullscreen.lock="fullLoading">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="title" label="广告名称"  min-width="110"/>
        <el-table-column prop="type" label="投放位置"  min-width="110">
           <template slot-scope="scope">
            {{scope.row.type==0?'App首页广告':scope.row.type==1?'启动页':scope.row.type==2?'商城首页':scope.row.type==3?'活动专区':'智力游戏'}}{{'&nbsp;'}}{{scope.row.source==1?'分类':''}}{{'&nbsp;'}}{{scope.row.typeName}}             
          </template>
        </el-table-column>
        <el-table-column prop="advSkiptype " label="跳转类型"  min-width="110">
           <template slot-scope="scope">
            {{scope.row.linkType==0?'内置':'H5'}}             
          </template>
        </el-table-column>
          <el-table-column prop="advCoverImg" label="封面"  min-width="110">
              <template slot-scope="scope">
                  <ImgView :src="scope.row.imgUrl"/>            
              </template>
          </el-table-column>
        <el-table-column prop="num" label="权重值"  min-width="110"/>
        <el-table-column prop="createtime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="edit(scope.row)" :disabled="disabled">编辑</el-button>
            <el-button type="del" size="small" @click="del(scope.row)" :disabled="disabled">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total" :pageSizes="[10]"/>
  </div>
</template>

<script>
import {
  getAdsListApi,
  delAds,
  getCatList
} from "../../api/adsManagmentApi.js";
import { success, error, confirm } from "../../actions";
import { dateTimeFilter, noticeTypeFilter } from "../../constant/filter";
import MyPagination from "../../components/MyPagination.vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import Avaters from "../../components/Avaters.vue";
import ImgView from "../../components/ImgView.vue";

export default {
  name: "Classification",
  components: { MyPagination, Breadcrumb, TablePage, Avaters, ImgView },
  data() {
    return {
      advName: null,
      disabled: false,
      fullLoading: false,
      show: false,
      data: { page: 1, pageSize: 10, list: [], total: 0, loading: false },
      class: [],
      pageStart:{
        page:1,
        pageSize:10
      }
    };
  },
  created() {
    // type, 0为编辑， 1为查看
    let UserType =
      JSON.parse(window.localStorage.getItem("userInfo")) &&
      JSON.parse(window.localStorage.getItem("userInfo")).type;
    this.disabled = UserType ? true : false;

    getCatList().then(data => {
      //获取分类
      this.class = data;
    });
  },
  methods: {
    dateTimeFilter,
    noticeTypeFilter,

    handleClose() {
      // this.$refs.notice.resetFields();
    },
    search() {
      this.findList({page:1});
    },
    reset() {
      this.advName = null;
      this.findList({page:1});
    },
    findList(page = {}) {
      this.data.loading = true;
      getAdsListApi({ ...page, advName: this.advName })
      .then(data => {
        //console.log(data);
        this.data = { ...this.data, ...page, ...data, loading: false };
        this.data.list.forEach((item, index) => {
          this.class.forEach(itm => {
            if (item.categoryId == itm.id) {
              item.typeName = itm.name;
            }
          });
        });
      });
      
    },
    uploadImg() {},
    add() {
      this.$router.push({ name: "addAds" });
    },
    edit(option) {
      this.$router.push({ name: "addAds", query: { id: option.id } });
    },
    del({ id, title }) {
      confirm(`你确认删除"${title}" 吗?`, "warning", "删除确认").then(() =>
        delAds(id)
          .then(data => {
            success(`删除"${title}"成功！`);
            this.findList({...this.pageStart});
            this.$router.replace({ query: { page:1 }})
          })
          .catch(({ msg }) => error(msg || "删除失败！请稍后重试..."))
      );
    },
    submit() {}
  }
};
</script>
<style lang="less">
.adslist {
  .addbtn {
    position: absolute;
    right: 0;
    top: 10px;
  }
  // 搜索
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    .block {
      margin-left: 40px;
      .el-range-separator {
        width: 10%;
      }
      .el-button {
        margin-left: 10px !important;
      }
    }
    .search {
      height: 74px;
      display: flex;
      // align-items: center;
      background-color: #fff;
      padding-left: 30px;
      .el-input {
        width: 250px !important;
      }
    }
  }
}
</style>
