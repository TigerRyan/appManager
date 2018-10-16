<template>
  <div class="content_data columnList">
    <div class="bread_crumb header">
      <Breadcrumb/>
    <el-button type="primary" @click="add" :disabled='disabled'>添加栏目</el-button>
    </div>
    <TablePage>
      <el-table :data="data.list" stripe v-loading="data.loading" element-loading-text="拼命加载中...">
        <!--<el-table-column type="selection" width="200">-->
        <!--</el-table-column>-->
        <el-table-column prop="name" label="栏目名称" :formatter="defValFilter01" min-width="160" />
        <el-table-column prop="weight" label="权重值"  min-width="160" />

        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button type="info"  round plain size="small" @click="$router.push({name: 'articleDetails', params: {id:scope.row.id}})">查看文章</el-button>
            <el-button type="edit" size="small"  :disabled='disabled' @click="edit(scope.row)">编辑</el-button>
            <el-button type="del" size="small"  :disabled='disabled' @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <el-dialog :title="menu.tip" :modal="true" customClass="my-dialog" :visible.sync="menu.show" :append-to-body="true">
      <el-form :model="menu" :rules="rules" ref="menu" label-width="120px">
        <el-form-item label="栏目名称:" prop="name">
          <el-input v-model="menu.name" width="500" />
        </el-form-item>
        <el-form-item label="权重值:" prop="weight">
          <el-input-number v-model="menu.weight" :min="0" :max="999" :step="1"/>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <template slot-scope="scope" >
            <el-radio v-model="menu.status" :label="0">显示</el-radio>
            <el-radio v-model="menu.status" :label="1">不显示</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="menu.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <MyPagination :page="data.page" :pageSize="data.pageSize" :pageSizes="[10]" :method="findList" :total="data.total" />
  </div>
</template>

<script>
import { confirm, success, error } from '../../actions/index'
import {
  defValFilter01,
  dateTimeFilter,
  industryFilter,
} from '../../constant/filter'
import {
  getColumnListApi,
  updateColumnApi,
  createColumnApi,
  deleteColumnApi,
} from '../../api/columnManageApi'
import { CREATE } from '../../constant/index'
import MyPagination from '../../components/MyPagination.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import TablePage from '../../components/TablePage.vue'
import ImgView from '../../components/ImgView.vue'

export default {
  name: 'columnList',
  components: {
    MyPagination,
    Breadcrumb,
    TablePage,
    ImgView,
  },
  data() {
    return {
      disabled: false,
      CREATE,
      industrys: [],
      // levels: [],
      data: {
        page: 1,
        pageSize: 10,
        list: [],
        total: 0,
        loading: false,
        orderBy: 1,
      },
      dialog: {
        show: false,
        title: '',
        data: {},
      },
      menu: {
        status: 0,
        editable: false,
        show: false,
        tip: '添加栏目',
        name: '',
        weight: 2,
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入等级名称...',
            trigger: 'blur',
          },
          {
            max: 7,
            message: '不能超过7个字符...',
            trigger: 'blur',
          },
        ],
        weight: [
          {
            required: true,
            type: 'number',
            message: '请输入等级值...',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    defValFilter01,
    dateTimeFilter,
    industryFormater(r, c, val) {
      return industryFilter(this.industrys)(r, c, val)
    },
    urlFilter(row) {
      return row.url + row.id
    },
    findList(page = {}) {
      this.data.loading = true
      getColumnListApi({ ...this.data, ...page }).then(data => {
        this.data = { ...this.data, ...data, ...page, loading: false }
      })
    },
    add() {
      this.menu = {
        name: '',
        weight: 0,
        tip: '添加栏目',
        status: 0,
        show: true,
        editable: false,
      }
    },
    edit(val) {
      this.menu = {
        ...this.menu,
        ...val,
        show: true,
        editable: true,
        tip: `修改栏目“${val.name}”`,
        status: val.status,
      }
    },
    submit() {
      this.$refs.menu.validate(valid => {
        if (valid) {
          if (this.menu.editable) {
            //编辑
            updateColumnApi({ ...this.menu })
              .then(() => {
                success(`修改栏目 ${this.menu.name} 成功！`)
                this.findList()
                this.menu.show = false
              })
              .catch(({ msg }) => error(msg || '修改失败！请稍后重试...'))
          } else {
            //新增
            createColumnApi({ ...this.menu })
              .then(() => {
                success(`新增栏目 ${this.menu.name} 成功！`)
                this.findList()
                this.menu.show = false
              })
              .catch(({ msg }) => error(msg || '新增失败！请稍后重试...'))
          }
        } else {
          return false
        }
      })
    },
    del({ id, name }) {
      confirm(`你确认删除栏目 ${name} 吗?`, 'warning', '删除确认').then(() =>
        deleteColumnApi(id)
          .then(() => {
            success(`删除资讯 ${name} 成功！`)
            this.findList()
          })
          .catch(({ msg }) => error(msg || '删除失败！请稍后重试...'))
      )
    },
  },
  created() {
    // type, 0为编辑， 1为查看
    let UserType =
      JSON.parse(window.localStorage.getItem('userInfo')) &&
      JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = UserType ? true : false
  },
}
</script>
<style lang="less" scoped>
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
</style>
<style lang="less">
.content_data.columnList {
  .el-table__row {
    .cell {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .el-button.el-button--primary.is-round {
    height: 40px;
    padding: 0 13px;
    line-height: 40px;
    background-color: #51c5ff;
    border-color: #51c5ff;
    span {
      height: 40px;
      font-size: 16px;
      display: inline-block;
      line-height: 40px;
      > img {
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
}
</style>
