<!--  已推荐列表  页面-->
<template>
  <div class="organRecommended content_data" >
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
      <el-input v-model.trim="data.query" clearable @keydown.enter.native="search"  placeholder="请输入机构名称或地址查询" style="width: 276px;"></el-input>
      <el-button type="search" @click="search" icon="el-icon-search" style="margin-left: 32px">搜索</el-button>
      <el-button icon="el-icon-refresh" style="margin-left:32px;background:#ecf5ff" round @click="reset">重置</el-button>
    </div>
    <div class="baiduMap">
      <baidu-map class="bm-view" ak="GkKZ53Tw3RYH1XHCWPmyKLVnM2AL3tsU" :center="{lng:institution.longitude,lat:institution.latitude}" :zoom="15" :scroll-wheel-zoom="true" @ready="ready">
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
        <!-- <bm-marker :position="{lng:institution.longitude,lat:institution.latitude}" @dragend="markerDragend" :zIndex="99999999" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker> -->
        <bm-local-search class="search" :keyword="keyword" :panel="false" :pageCapacity="1" :selectFirstResult="true" @searchcomplete="searchComplete"></bm-local-search>
      </baidu-map>
    </div>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中..." ref="multipleTable">
        <el-table-column prop="name" label="机构名称" min-width="150" />
        <el-table-column prop="logo" label="头像" min-width="150">
          <template slot-scope="scope">
            <ImgView :src="scope.row.logo" width="90" height="90" />
          </template>
        </el-table-column>
        <el-table-column prop="leaderName" label="联系人" :formatter="defValFilter01"  width="130" />
        <el-table-column prop="phone" label="联系电话" :formatter="defValFilter01"  min-width="150" />
        <el-table-column prop="address" label="地址" :formatter="defValFilter01"  min-width="200" />
        <el-table-column prop="distance" label="距离" :formatter="defValFilter01"  min-width="90" >
          <template slot-scope="scope">
              <span v-if="scope.row.distance && scope.row.distance<1000">{{scope.row.distance}}米</span>
              <span v-if="scope.row.distance && scope.row.distance>1000">{{(scope.row.distance/1000).toFixed(1)}}公里</span>
              <span v-if="!scope.row.distance">--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button plain type="info" size="middle" @click="cancleHandle(scope.row)" :disabled='disabled'>查看</el-button>
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
  changeOrganTypeApi,
  searchPositionApi
} from '../../api/institutionManagementApi'


import {BaiduMap, BmNavigation, BmScale, BmGeolocation, BmMarker, BmLocalSearch} from 'vue-baidu-map'

import {
  currencyFilter,
  defValFilter01,
  dateFilter,
  statueFilter,
  isRecommendFilter,
  detailTimeFilter
} from '../../constant/filter.js'
export default {
  name: 'organRecommended',
  components: {
    MyPagination,
    TablePage,
    ImgView,
    Breadcrumb,
    BaiduMap, 
    BmNavigation, 
    BmScale, 
    BmGeolocation, 
    BmMarker, 
    BmLocalSearch
  },
    data() {
      return {
        // 地图
				keyword: null,
				institution: {name: '', pics: [], address: '', detailsaddress: '', labels: '', labelList: [], longitude: 114.428082, latitude: 30.477549},
        disabled:false,
        options: [
          
          {
            value: 1,
            label: '机构地址'
          },
          {
            value: 0,
            label: '机构名称'
          },
          
        ],
        value: 1,
        data: {
          page: 1,
          pageSize: 10,
          list: [
            // {}
          ],
          query: '',
          status: 0,
          type:0,
          loading: false
        },
        centerDialogVisible: false
      }
    },
    created() {
      // type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false
    },
    methods: {
      currencyFilter,
      dateFilter,
      defValFilter01,
      statueFilter,
      isRecommendFilter,
      detailTimeFilter,
      changeSelect(value) {
        this.data =  {
          page: 1,
          pageSize: 10,
          list: [],
          query: '',
          status: 0,
          type:value,
          loading: false
        }
        this.keyword = ""
      },
      //获取列表
      findList(page = {}) {
        if(!this.data.query){
          return
        }
        this.data.loading = true
        if (this.value == 0) {
          getOrganListApi({ ...this.data, ...page }).then(data => {
            this.data = { ...this.data, ...data, loading: false, ...page }
          })
        }
        if (this.value == 1) {
          searchPositionApi({ ...this.data, ...page,longitude:this.institution.longitude,latitude:this.institution.latitude }).then(data => {
            this.data = { ...this.data, ...data, loading: false, ...page }
          })
        }
        
        
      },
      // 查看详情
    cancleHandle(row) {
      this.$router.push({path:'/view/organ/seachInfo',query:{id:row.id}})
      // this.$router.push({path:'/view/organ/seachInfo',query:{id:196}})
    },
    //搜索
    search(page = {}) {
      this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      this.keyword = this.value == 1 ? this.data.query : ""
      this.value == 0 ? this.findList({ ...page, page: 1 }): ""
      
    },
    //重置
    reset(page = {}) {
      this.data.query = "";
      this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      this.data =  {
          page: 1,
          pageSize: 10,
          list: [],
          query: '',
          status: 0,
          type:0,
          loading: false
      }
      this.value == 1 ? this.keyword = "" : ""
    },
    // 地图
		locationSuccess({addressComponent: {city, district, province, street, streetNumber}, point: {lng, lat}}) {
				this.institution.longitude = lng
				this.institution.latitude = lat
			},
			markerDragend({point}) {
				this.institution.longitude = point.lng
				this.institution.latitude = point.lat
			},
			searchComplete(e) {
				let {province,city,Br} = {...e}
				if (Br) {
					if (Br.length) {
            const res = e.Br[0]
            this.institution.longitude = res.point.lng
						this.institution.latitude = res.point.lat
            this.findList({ page: 1 })
					}else{
						this.$message({
							message: '该地区不存在',
							type: 'warning'
            });
            
            this.data.query = ""
            this.data =  {
              page: 1,
              pageSize: 10,
              list: [],
              query: '',
              status: 0,
              type:0,
              loading: false
            }
					}
				}
			},
			ready() {
			
			},
  }
};
</script>
<style lang="less" scoped>
.organRecommended {
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
.organRecommended {
  .bm-view {
    height: 300px;
    width: 100%;
    position: relative;
    border: 1px solid #dcdfe6;
    .anchorBL{
      display: none;
    }
      
  }
				
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
