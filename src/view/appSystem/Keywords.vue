<template>
	<div class="informationList content_data">
    <Breadcrumb/>
		<!-- 搜索 -->
		<div class="time_search">
        <el-col  :span="1" >
            <span>类型</span>
				</el-col>
				<el-col  :span="4" >
            <el-select v-model="data.type" placeholder="请选择类型">
							<el-option :label="item.typeName" :value="item.typeId" v-for="(item,index) in columnItem" :key="index"></el-option>
            </el-select>
				</el-col>
				<el-col :span="6" :offset="1">
					<div class="search kind">
						<el-input  placeholder="搜索关键词"
						style="width: 378px;" v-model="data.keyWord" @blur="search"/>
					</div>
				</el-col>
				<el-button  style="margin-left: 67px;background:#51c5ff;border-color:#51c5ff;color:#fff;" round @click="add" :disabled='disabled'> <i class="el-icon-circle-plus-outline"></i> 新增关键词</el-button>
				<div class="block">
					<el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;border-color:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
					<el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset">重置</el-button>
				</div>

		</div>
		<!-- 列表 -->
		<TablePage>
				<el-table :data="data.list" ref="multipleTable" stripe  v-loading="data.loading" element-loading-text="拼命加载中..."  >
					<el-table-column prop="hotLabel" label="关键词名称" min-width="130"/>
          <el-table-column prop="typeName" label="类型" min-width="130"/>
					<el-table-column prop="createTime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
          <el-table-column prop="weight" label="权重值" min-width="110">
					</el-table-column>
          <el-table-column prop="status" label="状态" min-width="110">
            <template slot-scope="scope" >
            <span :style="{color :scope.row.status ?'#F56C6C' :'#67C23A'}">
              {{scope.row.status ?"关闭" :"开启"}}
            </span>
          </template>
					</el-table-column>
					<el-table-column  label="操作" class=""  min-width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)" :disabled='disabled'>编辑</el-button>
              <el-button type="danger"  size="small" @click="del(scope.row)"  :disabled='disabled'>删除</el-button>
            </template>
          </el-table-column>
				</el-table>
		</TablePage>
		<!-- 弹窗 -->
    <el-dialog :title="menu.tip" :modal="true" customClass="tiny-dialog" :visible.sync="menu.show" @close="clearValidate" :append-to-body="true">
      <el-form :model="menu" :rules="rules" ref="menu" label-width="120px">
        <el-form-item label="关键词名称:" prop="hotLabel">
          <el-input v-model.trim="menu.hotLabel" width="500" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <template slot-scope="scope" >
           <el-select v-model="menu.type" placeholder="请选择类型">
							<el-option :label="item.typeName" :value="item.typeId" v-for="(item,index) in columnItem" :key="index"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="权重值:" prop="weight">
          <el-input-number v-model="menu.weight" :min="0" :max="2147483647" :step="1"/>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <template slot-scope="scope" >
            <el-radio v-model="menu.status" :label="0">开启</el-radio>
            <el-radio v-model="menu.status" :label="1">关闭</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="menu.show = false">取 消</el-button>
      </div>
    </el-dialog>
     <!-- 分页 -->
				<MyPagination :page="data.pageNum" :size="data.pageSize" :pageSizes="[10]"  :method="findList" :total="data.total"/>
	</div>
</template>

<script>
import TablePage from '../../components/TablePage.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import MyPagination from '../../components/MyPagination.vue'
import {
  dateTimeFilter,
  auditFilter,
  informationTypeFilter,
} from '../../constant/filter.js'
import { confirm, success, error } from '../../actions/index'

import {
  getModuleTypeApi,
  getAppConfigurationApi,
  deleteKeyWordApi,
  addKeyWordApi,
  editKeyWordApi,
} from '../../api/appConfigurationApi.js'

export default {
  name: 'informationList',
  components: {
    TablePage,
    MyPagination,
    Breadcrumb,
  },
  data() {
    return {
      disabled:false,
      columnItem: [{
        "typeId":1,
        "typeName":"机构"
      },{
        "typeId":2,
        "typeName":"教师"
      },{
        "typeId":3,
        "typeName":"课程(直播和线下)"
      },{
        "typeId":4,
        "typeName":"资讯"
      },{
        "typeId":5,
        "typeName":"商品"
      },{
        "typeId":6,
        "typeName":"视频"
      }],
      data: {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        keyWord: '',
        type: null,
        list: []
      },
      menu: {
        hotLabel: '',
        type: null,
        weight: 0,
        status: 0,
        editable: false,
        show: false,
        tip: '添加关键词',
      },
      rules: {
        hotLabel: [
          {
            required: true,
            message: '请输入关键词...',
            trigger: 'blur',
          },
          {
            max: 4,
            message: '不能超过4个字符...',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择类型...',
            trigger: 'blur',
          },
        ],
        weight: [
          {
            required: true,
            type: 'number',
            message: '请选择权重值...',
            trigger: 'blur',
          },
          {pattern: /^[0-9]\d*$/, message: '只能为非负整数', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = usrType ? true:false
  },
  methods: {
    dateTimeFilter,
    auditFilter,
    informationTypeFilter,
    findList(page = {}) {
      this.data.loading = true
      getAppConfigurationApi({ ...this.data, ...page }).then(
        res => {
          this.data = { ...this.data, ...res, loading: false }
        },
        err => {
          this.data.loading = false
        }
      )
    },
    // 搜索
    search() {
      this.findList()
    },
    // 重置
    reset() {
      this.data.keyWord = ''
      this.data.type = null
      this.findList()
    },
    clearValidate(){
      this.$refs.menu.clearValidate()
    },
    submit() {
      this.$refs.menu.validate(valid => {
        if (valid) {
          if (this.menu.editable) {
            editKeyWordApi({ ...this.menu })
              .then(() => {
                success(`修改关键词 ${this.menu.hotLabel} 成功！`)
                this.findList()
                this.menu.show = false
              })
              .catch(({ msg }) => error(msg || '修改失败！请稍后重试...'))
          } else {
            addKeyWordApi({ ...this.menu })
              .then(() => {
                success(`新增关键词 ${this.menu.hotLabel} 成功！`)
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
    //对话框关闭时清除校验
    clearValidate() {
      this.$refs.menu.clearValidate()
    },
    //新增
    add() {
      this.menu = {
        hotLabel: '',
        weight: 0,
        type: null,
        status: 0,
        tip: '新增关键词',
        show: true,
        editable: false,
      }
    },
    // 编辑
    edit(val) {
      this.menu = {
        ...this.menu,
        ...val,
        show: true,
        editable: true,
        tip: `修改关键词“${val.hotLabel}”`,
      }
    },
    // 删除
    del({ id, hotLabel }) {
      confirm(`你确认删除关键词 ${hotLabel} 吗?`, 'warning', '删除确认').then(() =>
        deleteKeyWordApi(id)
          .then(() => {
            success(`删除关键词 ${hotLabel} 成功！`)
            this.findList()
          })
          .catch(({ msg }) => error(msg || '删除失败！请稍后重试...'))
      )
    }
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
  .time_search {
    .el-input__inner {
      border-radius: 20px !important;
    }
  }
  .el-dialog--center .el-dialog__body {
    padding-bottom: 50px !important;
  }
}
.el-dialog.tiny-dialog {
  width: 420px;
  .el-input .el-input__inner,
  .el-input--suffix .el-input__inner {
    width: 180px;
  }
}
</style>
