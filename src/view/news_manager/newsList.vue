<template>
  <div class="content_data newsList">
    <Breadcrumb/>
    <ul class="cate_list">
      <li v-for="(item, index) in TitleList" :class="{blue: changeTitle == index}" @click="redTitle(index)" :key="index">{{item.name}}</li>
    </ul>
    <div class="time_search">
      <div class="search kind">
        <span v-if="data.signStatus==3">用户账号:</span>
        <el-Input v-if="data.signStatus==3" placeholder="请输入手机号" style="width: 200px; margin-right: 10px" v-model="data.phone"/>
        <span>消息标题:</span>
        <el-Input placeholder="请输入标题搜索"  style="width: 200px; margin-right: 10px" v-model.trim="data.title"  @keydown.enter.native="search" />
        <el-button icon="el-icon-search" style="margin-left:10px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" style="margin-left:10px;background:#ecf5ff"  round  @click="reset">重置</el-button>
      </div>
      <div class="block" v-if="data.signStatus!=3">
        <el-button icon="el-icon-plus"  type="edit" round  @click="addNews">创建消息</el-button>
      </div>
    </div>
    <!-- 系统消息列表 -->
    <TablePage v-loading.fullscreen.lock="fullLoading" v-show="changeTitle==0">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="messageType" label="消息类型"  min-width="110">
           <template slot-scope="scope" >
            <span :style="{color :scope.row.messageType ?'#409EFF' :'#67C23A'}">
              {{scope.row.messageType ?"消息类型" :"推送类型"}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="消息标题" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="contentEx" label="消息内容"  min-width="210">
            <template slot-scope="scope" >
            <span >
              {{JsonFilter(0,0,scope.row.contentEx)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column  prop="createTime" label="发送时间" :formatter="detailTimeFilter" min-width="110"/>
      </el-table>
    </TablePage>
    <!-- 用户消息列表 -->
    <TablePage v-loading.fullscreen.lock="fullLoading" v-show="changeTitle==1">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="phone" label="用户账号"  min-width="110">
           <template slot-scope="scope" >           
              {{scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="消息标题" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="content" label="消息内容"  min-width="210">
            <template slot-scope="scope" >
            <span >
              {{scope.row.content}}
            </span>
          </template>
        </el-table-column>
        <el-table-column  prop="pushTime" label="发送时间" :formatter="detailTimeFilter" min-width="110"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :pageSize="data.pageSize" :method="findList" :total="data.total"/>
      <el-dialog :title="menu.tip" width="50%" :modal="true" customClass="my-dialog" @close="resetFields" :visible.sync="menu.show" :append-to-body="true">
      <el-form :model="menu" :rules="rules" ref="menu" label-width="85px">
        <el-form-item label="消息类型:" prop="messageType">
          <el-select v-model="menu.messageType" placeholder="请选择"  @change='changeSelect' >
            <el-option
            v-for="item in menu.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息标题:" prop="title">
          <el-input v-model.trim ="menu.title" width="500" placeholder="请填写消息标题，必填..." />
        </el-form-item>
        <el-form-item   label="消息内容:" prop="contentEx">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入消息内容" v-model.trim ="menu.contentEx"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submit(menu)">确 定</el-button>
        <el-button @click="menu.show = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getNewsListApi, addSystemInfo,personListApi } from '../../api/newsManagerApi.js'
import { defValFilter01, detailTimeFilter,JsonFilter } from '../../constant/filter'
import { confirm, success, error } from '../../actions/index'
import MyPagination from '../../components/MyPagination.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import TablePage from '../../components/TablePage.vue'
export default {
  name: 'newsList',
  components: { MyPagination, Breadcrumb, TablePage },
  data() {
    //  自定义校验
    var validateContent = (rule, value, callback) => {
      if (this.menu.messageType && this.menu.contentEx.length > 500) {
        callback(new Error('消息类型字数控制在500以内'))
      } else if (!this.menu.messageType && this.menu.contentEx.length > 50) {
        callback(new Error('推送类型字数控制在50以内'))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
      fullLoading: false,
      value: '',
      show: false,
      showDown: false,
      changeTitle: 0,
      // TitleList: [{ id: 1, name: '系统消息列表' }, { id: 3, name: '用户消息列表' }],
      TitleList: [{ id: 1, name: '系统消息列表' },{ id: 2, name: '用户消息列表' }],
      data: {
        page: 1,
        pageSize: 10,
        list: [],
        start: null,
        end: null,
        total: 0,
        title: '',
        loading: false,
        signStatus: 1,
        phone:null
      },
      menu: {                  //弹窗内容
        tip: '',
        messageType: null,     //消息类型
        show: false,
        title: '',             //消息标题
        contentEx: '',         //消息内容
        options: [
          {
            value: false,
            label: '推送',
          },
          {
            value: true,
            label: '消息',
          },
        ],
      },
      rules: {
        messageType: [
          { required: true, message: '请选择消息类型', trigger: 'change' },
        ],
        title: [
          { required: true, message: '请填写消息标题', trigger: 'blur' },
          { max: 30, message: '标题不能超过30个字符...', trigger: 'blur' },
        ],
        contentEx: [
          { required: true, message: '请填写消息内容', trigger: 'blur' },
          { validator: validateContent, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    defValFilter01,
    detailTimeFilter,
    JsonFilter,
    findList(page = {}) {
      this.data.loading = true
      if (this.changeTitle==0) {
        getNewsListApi({ page: 1, ...this.data, ...page }).then(data => {
          this.data = { ...this.data, ...page, ...data, loading: false }
        })
      }
      if (this.changeTitle==1) {
        personListApi({ page: 1, ...this.data, ...page }).then(data => {
          this.data = { ...this.data, ...page, ...data, loading: false }
        })
      }

    },
    //  切换列表
    redTitle(index) {
      this.data.start = null
      this.data.end = null
      this.changeTitle = index
      if (index === 0) {
        this.data.signStatus = 1
      } else {
        this.data.signStatus = 3
      }
      this.findList()
    },
    // 添加消息
    addNews() {
      this.menu = {
        ...this.menu,
        show: true,
        tip: `创建消息`,
      }
    },
    // 关闭对话框重置字段
    resetFields() {
      this.$refs.menu.resetFields()
    },
    // 提交
    submit() {
      this.$refs.menu.validate(valid => {
        if (valid) {
          addSystemInfo(this.menu).then(res => {
            success(`新增消息 ${this.menu.title} 成功！`)
            this.menu.show = false
            this.findList({ page: 1 })
          })
        } else {
          return false
        }
      })
    },
    search(page = {}) {
      this.data.page = 1
      this.findList((page = {}))
    },
    reset() {
      this.data.title = ''
      this.data.phone=null
      this.findList({ page: 1 })
    },
    //下拉切换
    changeSelect(val) {
      this.menu.contentEx = ''
      this.$refs.menu.clearValidate()
    },
  },
}
</script>
<style lang="less">
.newsList {
  .cate_list {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    color: #333;
    margin-bottom: 20px;
    li {
      font-size: 20px;
      font-weight: 600;
      float: left !important;
      margin: 0 17px;
      cursor: pointer;
    }
    .blue {
      color: #51c5ff;
      border-bottom: 3px solid #51c5ff;
    }
  }
  .time_search {
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 30px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    .search {
      span {
        font-size: 16px;
        margin-right: 10px;
      }
    }
    .block {
      margin-right: 4%;
    }
  }
  .showDown {
    .el-dialog__body {
      text-align: center;
    }
  }
  .downloadBtn {
    width: 80px;
    height: 40px;
    border-radius: 20px;
    text-align: center;
    line-height: 40px;
    background: #51c5ff;
    display: inline-block;
    color: #fff;
  }
}
</style>
