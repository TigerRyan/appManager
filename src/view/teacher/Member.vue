<template>
  <div class="teacherMember content_data" >
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
        <el-table-column prop="phone" label="联系人电话" :formatter="defValFilter01"  min-width="130" />
        <el-table-column prop="creatTime" label="注册时间" :formatter="dateFilter" width="120" />

        <el-table-column prop="statue" label="状态" :formatter="statueFilter" width="90" />
        <el-table-column prop="isRecommend" label="推荐状态" :formatter="isRecommendFilter" width="120" />
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button v-show="false" type="edit" size="middle" @click="passHandele(scope.row.id)">编辑</el-button>
            <el-button plain  type="primary" size="middle" @click="rejectHandle(scope.row)">查看</el-button>
            <el-button plain v-if="!scope.row.isRecommend" type="danger" size="middle" @click="cancleHandle(scope.row)">取消推荐</el-button>
            <el-button plain v-if="scope.row.isRecommend" type="success" size="middle" @click="setHanddle(scope.row)">设置推荐</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
        <el-dialog :title="menu.tip" width="30%" :modal="true" customClass="my-dialog" :visible.sync="menu.show" :append-to-body="true">
      <el-form :model="menu" :rules="rules" ref="menu" label-width="120px">
        <el-form-item label="栏目名称:" prop="name">
          <el-input v-model="menu.name" width="500" />
        </el-form-item>
        <el-form-item label="上传视频:" prop="videoUrl">
            <!-- <i v-show="menu.videoUrl" class="el-icon el-icon-close"></i> -->
            <VideoUpload ref="videUpload" @success="uploadVide" :url="menu.videoUrl"></VideoUpload>
            <el-tag type="danger">上传视频大小建议：视频文件大小500 M 以内！</el-tag>
        </el-form-item>
        <el-form-item label="上传图片:" prop="imgUrl">
            <i v-show="menu.imgUrl" class="el-icon el-icon-close" @click="deletePic"></i>
            <Avatar :url="menu.imgUrl" width="150"  height="140" @success="menu.imgUrl = $event"/>
            <el-tag type="danger">封面图建议宽高比：1.08：1，建议尺寸：450px*410px</el-tag>
        </el-form-item>
        <el-form-item v-show="false" label="权重值:" prop="weight">
          <el-input-number v-model="menu.weight" :min="0" :max="999" :step="1"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="menu.show = false">取 消</el-button>
      </div>
    </el-dialog>
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
import VideoUpload from '../../components/VideoUpload.vue'
import Avatar from '../../components/Avatar.vue'
// Avaters
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
  name: 'teacherMember',
  components: {
    MyPagination,
    TablePage,
    ImgView,
    Breadcrumb,
    VideoUpload,
    Avatar
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
      changes: 0,
      // CREATE,
      data: {
        page: 1,
        pageSize: 10,
        list: [],
        query: '',
        type: 0,
        status: 0,
        loading: false
      },
      menu: {
        videoUrl: '',
        imgUrl: '',
        tip: '推荐机构',
        type: 0,
        show: false,
        name: ''
      },
      centerDialogVisible: false,
      rules: {
        videoUrl: [
          { required: true, message: '请上传推荐宣传视频', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请上传推荐封面图片', trigger: 'blur' }
        ]
      }
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
    rejectHandle(val){
      this.$router.push({path:'teacherDetails',query:{id:val.id}})
    },
    findList(page = {}) {
      this.data.loading = true
      getOrganListApi({
        ...this.data,
        ...page
      }).then(data => {
        this.data = { ...this.data, ...data, loading: false, ...page }
        console.log('-------data', data)
      })
    },
    viewFeedback(id) {},
    //
    search(page = {}) {
      console.log('-------data111111111', this.data)
      this.findList({ ...page, page: 1 })
    },
    reset(page = {}) {
      this.data.query = ''
      this.findList({ ...page, page: 1 })
    },
    deletePic() {
      this.menu.imgUrl = ''
    },
    uploadVide(url) {
      this.menu.videoUrl = url
    },
    //设置推荐
    setHanddle(val) {
      this.menu = {
        ...this.menu,
        ...val,
        show: true,
        tip: `推荐机构“${val.name}”`
      }
      console.log('this.menu..........', this.menu)
    },
    submit() {
      this.$refs.menu.validate(valid => {
        if (valid) {
          confirm(
            `你确认推荐栏目 ${this.menu.name} 吗?`,
            'warning',
            '推荐确认'
          ).then(() =>
            changeOrganTypeApi({
              mechanismId: this.menu.id,
              type: 0,
              videoUrl: this.menu.videoUrl,
              imgUrl: this.menu.imgUrl
            })
              .then(() => {
                success(`推荐机构 ${this.menu.name} 成功！`)
                this.findList()
                this.menu.show = false
                this.menu.videoUrl = ''
                this.menu.imgUrl = ''
                this.$refs.videUpload.clearUrl()
              })
              .catch(({ msg }) => {
                this.$refs.videUpload.clearUrl()
                error(msg || '推荐失败！请稍后重试...')
              })
          )
        } else {
          return false
        }
      })
    },
    // 取消推荐
    cancleHandle(row) {
      confirm(`你确认取消推荐机构 ${row.name} 吗?`, 'warning', '取消确认').then(
        () =>
          changeOrganTypeApi({
            mechanismId: row.id,
            type: 1
          })
            .then(res => {
              console.log('取消后', res)
              this.findList()
            })
            .catch(({ msg }) => error(msg || '取消失败！请稍后重试...'))
      )
    }
  }
}
</script>
<style lang="less" scoped>
.el-form {
  .el-form-item__content {
    position: relative;
    > i.el-icon.el-icon-close {
      font-weight: 700;
      color: #f56c6c;
      position: absolute;
      left: 144px;
      top: -5px;
      cursor: pointer;
    }
  }
}
.teacherMember {
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
.teacherMember {
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
  // el-icon el-icon-close
}
</style>
