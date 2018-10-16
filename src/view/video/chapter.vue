<template>
	<div class="informationList content_data">
    <Breadcrumb/>

		<!-- 搜索 -->
		<div class="time_search">
				<el-col :span="6" >
					<div class="search kind">
						<el-input  placeholder="根据章节名称查询"
						style="width: 378px;" v-model="searchText"/>
					</div>
				</el-col>
				<div class="block">
					<el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
					<el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset">重置</el-button>
				</div>

		</div>
		<!-- 列表 -->
		<TablePage class="tabllist">
				<el-table :data="list" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中..."  @header-click="uplist" >
          
					<el-table-column prop="courseNumber" label="排序" min-width="130"/>
          <el-table-column prop="name" label="章节名称" min-width="130"/>
					<el-table-column prop="videoUrl" label="视频课程章节" min-width="300">
            <template slot-scope="scope">
                <videPaly :url="scope.row.videoUrl"/>
                <div class="videoPaly" @click="showVide(scope.row.videoUrl)"></div>
						</template>
          </el-table-column>
					<el-table-column prop="teacherName" label="授课老师" min-width="130"/>
          <el-table-column prop="createTime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
					<el-table-column prop="status" label="状态" :formatter="informationTypeFilter" min-width="130">
						<template slot-scope="scope">
						  <el-switch
			                style="display: block"
			                v-model="scope.row.status"
			                active-color="#13ce66"
			                inactive-color="#ff4949"
			                active-text="启用"
			                inactive-text="禁用" disabled>
			              </el-switch>
						</template>
					</el-table-column>
					<el-table-column  label="操作" class=""  min-width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status" type="danger" @click="rejust(scope.row.id)" :disabled='disabled'>拒绝</el-button>
              <el-button v-else type="primary" @click="pass(scope.row.id)" :disabled='disabled'>通过</el-button>
            </template>
          </el-table-column>
				</el-table>

        <!-- 分页 -->
				<MyPagination :page="pageOption.pageNum" :size="pageOption.pageSize" :method="findList" :total="pageOption.total"/>
		</TablePage>
		<!-- 弹窗 -->
    <el-dialog  class="informationListMydialog" :visible.sync="centerDialogVisible" width="600px" center :append-to-body="true" @close="videUrl=''">
				<videPaly :url="videUrl" :width="'500'" :height="'400'"/>
    </el-dialog>

	</div>
</template>

<script>
import TablePage from '../../components/TablePage.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import videPaly from '../../components/videPaly.vue'
import {
  dateTimeFilter,
  auditFilter,
  informationTypeFilter,
} from '../../constant/filter.js'
import {
  getInformationListApi,
  getInformationTitleApi,
  deleteAllInformationApi,
} from '../../api/informationListApi.js'
import {
  getVideoCourseListApi,
  getVideoCourseUpdateStatusApi,
} from '../../api/videoCourse.js'
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'chapter',
  components: {
    TablePage,
    MyPagination,
    Breadcrumb,
    videoPlayer,
    videPaly,
  },
  data() {
    return {
      disabled: false,
      typeId: null,
      videUrl: '',
      loading: false,
      centerDialogVisible: false, //弹框
      colorFalg: false, //删除高亮
      allSelect: false,
      radio: false, //全选
      columnKeyWord: '',
      typeKeyWord: [{ val: '图文', lab: 0 }, { val: '视频', lab: 1 }],
      columnItem: [],
      showText: true,
      status: '',
      searchText: '', //搜索框内容
      pageOption: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      orderBy: 0,
      list: [],
      // 多选
      multipleSelection: [],
    }
  },

  created() {
    this.$route.query.id ? (this.typeId = this.$route.query.id) : ''
    this.$route.params.id ? (this.typeId = this.$route.params.id) : ''
    let usrType =
      window.localStorage.getItem('userInfo') &&
      JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = usrType ? true : false
  },

  methods: {
    dateTimeFilter,
    auditFilter,
    informationTypeFilter,
    showVide(url) {
      if (!this.centerDialogVisible) {
        this.videUrl = url
        this.centerDialogVisible = true
      } else {
        this.videUrl = ''
        this.centerDialogVisible = false
      }
    },
    findList(pagedata) {
      this.list = []
      this.loading = true
      var obj = {
        page: pagedata ? pagedata.page : this.pageOption.pageNum,
        pageSize: this.pageOption.pageSize,
        topicsName: this.searchText,
      }
      getVideoCourseListApi(this.typeId, obj).then(
        data => {
          this.list = [...data.list]
          this.list.forEach(item => {
            item.status = item.status == 1 ? true : false
          })
          this.loading = false
          this.pageOption.pageNum = data.pageNum || 1
          this.pageOption.pageSize = data.pageSize || 10
          this.pageOption.total = data.total || 0
        },
        err => {
          this.loading = false
        }
      )
    },
    // 搜索
    search() {
      this.findList()
    },
    // 重置
    reset() {
      this.searchText = ''
      this.findList()
    },
    // 通过
    pass(id) {
      this.$confirm('是否通过该视频章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          getVideoCourseUpdateStatusApi(id, 1).then(data => {
            this.findList()
            this.$message({
              type: 'success',
              message: '已通过成功!',
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    // 拒绝
    rejust(id) {
      this.$confirm('是否拒绝该视频章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          getVideoCourseUpdateStatusApi(id, 2).then(data => {
            this.findList()
            this.$message({
              type: 'success',
              message: '已拒绝成功!',
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    // 全选
    toggleSelection(rows, all) {
      if (rows) {
        all == 'allselect' ? this.$refs.multipleTable.clearSelection() : ''
        this.list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        if (!this.allSelect) {
          return
        }
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.colorFalg = val.length > 0 ? true : false
      if (val.length == this.list.length) {
        this.radio = true
        this.allSelect = true
      } else {
        this.radio = false
        this.allSelect = false
      }
    },
    // 排序
    uplist(row, column, cell, event) {
      if (row.label == '权重值') {
        if (this.orderBy == 1) {
          return
        }
        this.orderBy = 1
        this.findList()
      }
      if (row.label == '创建时间') {
        if (this.orderBy == 0) {
          return
        }
        this.orderBy = 0
        this.findList()
      }
    },
  },
  watch: {
    radio: {
      handler: function(val, oldval) {
        this.toggleSelection(val, 'allselect')
      },
    },
  },
}
</script>
<style lang="less" scoped>
.hovercard.el-col {
  background-color: #eee;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  position: relative;
  transition: all 0.5s;
  bottom: 0px;
  cursor: pointer;
  i {
    font-size: 30px;
    font-weight: 900;
    color: #aaa;
  }
  h3 {
    color: #aaa;
  }
  &:hover {
    bottom: 6px;
    i {
      color: rgb(58, 106, 209);
    }
    h3 {
      color: rgb(58, 106, 209);
    }
  }
}
.informationList {
  .content-title {
    button {
      position: absolute;
      right: 30px;
      top: 15px;
    }
  }
  .statistics {
    width: 100%;
    background-color: #fff;
    margin-bottom: 20px;
    .el-row {
      padding: 20px 0;
      .el-col {
        position: relative;
        p {
          position: absolute;
          top: 50%;
          left: 50%;
          text-align: center;
          transform: translate(-50%, -50%);
          span {
            display: block;
          }
        }
      }
    }
  }
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    margin-bottom: 20px;
    position: relative;
    .block {
      margin-left: 40px;
      .el-range-editor {
        border-radius: 25px;
      }
      .el-range-separator {
        width: 10%;
      }
      .el-button {
        margin-left: 10px !important;
      }
    }
    > button {
      height: 40px;
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
  .search {
    height: 74px;
    display: flex;
    align-items: center;
    background-color: #fff;
    .el-input {
      width: 350px !important;
      border-radius: 20px !important;
    }
    .el-input__inner {
      border-radius: 20px !important;
    }
  }
}
</style>
<style lang="less">
.informationListMydialog {
  .el-dialog__title {
    color: #606266;
    font-weight: 900;
  }
}

.informationList {
  .videoPaly {
    width: 320px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.08);
    z-index: 999999999;
    position: absolute;
    left: 0;
    top: 0;
  }
  .time_search {
    .el-input__inner {
      border-radius: 20px !important;
    }
  }
  .el-dialog--center .el-dialog__body {
    padding-bottom: 50px !important;
  }
}
</style>
