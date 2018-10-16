<template>
  <div class="content_data">
    <Breadcrumb/>
    <el-button type="primary" @click="edit()">添加</el-button>
    <TablePage>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="服务名称" :formatter="defValFilter01" min-width="150"/>
        <el-table-column prop="weight" label="优先级" :formatter="defValFilter03" min-width="100"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="edit" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="del" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <el-dialog :visible.sync="dialog.show" :title="dialog.title" width="600px" :modalAppendToBody="false">
      <el-form :model="dialog" :rules="rules" ref="dialog" labelWidth="120px">
        <el-form-item label="服务名称：" prop="name">
          <el-input v-model="dialog.name" placeholder="请输入服务名称..."/>
        </el-form-item>
        <!--<el-form-item label="上传服务图标：" prop="icon">-->
        <!--<Avatar :url="dialog.icon" width="375" height="207" @success="dialog.icon = $event"/>-->
        <!--<el-tag type="danger">封面尺寸建议2:1,大小不能超过1M，图片格式为jpg,png,jpeg</el-tag>-->
        <!--</el-form-item>-->
        <el-form-item label="分类优先级：" prop="weight">
          <el-input v-model="dialog.weight" placeholder="请输入分类优先级..."/>
          <el-tag type="danger">正整数，1最大数值越大，排序越靠后</el-tag>
        </el-form-item>
        <div class="text-center">
          <el-button type="del" @click="dialog.show =false">取消</el-button>
          <el-button type="edit" @click="submit">发布</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getLabelsListApi, delLabelsApi, createLabelsApi, updateLabelsApi} from '../../../api/baseApi'
  import {defValFilter01, defValFilter03} from '../../../constant/filter'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import TablePage from '../../../components/TablePage.vue'
  //  import Avatar from '../../../components/Avatar.vue'
  //  import ImgView from '../../../components/ImgView.vue'
  import {confirm, success, error} from '../../../actions'

  export default {
    name: 'liveRadioService',
    components: {Breadcrumb, TablePage},
    data() {
      return {
        data: {},
        dialog: {show: false, type: 3, id: null, name: '', icon: null, weight: null},
        rules: {
          name: [{required: true, max: 10, message: '名称不超过10字符...', trigger: 'blur'}],
        },
      }
    },
    methods: {
      defValFilter01,
      defValFilter03,
      findList() {
        this.data.loading = true
        getLabelsListApi(this.dialog.type).then(list => {
          this.data = {list, loading: false}
        })
      },
      del({id, name}) {
        confirm(`确认删除线下课程特色标签“${name}”?`, 'error', '删除确认?').then(_ => delLabelsApi(id).then(_ => {
          success(`删除线下课程特色标签“${name}”成功！`)
          this.findList()
        }).catch(({msg}) => error(msg || '操作失败！请稍后重试...')))
      },
      edit(data = {}) {
        if (data.id) {
          this.dialog = {...this.dialog, ...data, title: `修改线下课程特色标签“${data.name}”`, show: true}
        } else {
          this.dialog = {...this.dialog, title: '添加线下课程特色标签', show: true, id: null, name: '', icon: null, weight: null}
        }
      },
      submit() {
        this.$refs.dialog.validate(valid => {
          if (valid) {
            const fn = this.dialog.id ? updateLabelsApi(this.dialog) : createLabelsApi(this.dialog)
            fn.then(_ => {
              success(`${this.dialog.id ? '修改' : '添加'}线下课程特色标签“${this.dialog.name}”成功！`)
              this.dialog.show = false
              this.findList()
            }).catch(({msg}) => error(msg || `${this.dialog.id ? '修改' : '添加'}线下课程特色标签“${this.dialog.name}”失败！请稍后重试...`))
          } else {
            return false
          }
        })
      },
    },
    created() {
      this.findList()
    },
  }
</script>
