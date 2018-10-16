<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入教师手机号码或视频课程名称搜索..." style="width: 340px" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="视频课程名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="videoImg" label="视频封面" min-width="240">
          <template slot-scope="scope">
            <ImgView :src="scope.row.videoImg" width="180" height="90"/>
          </template>
        </el-table-column>
        <el-table-column prop="videoUrl" label="视频" min-width="360">
          <template slot-scope="scope">
            <VideoUpload :url="scope.row.videoUrl" :showUpload="false" width="360" height="150"/>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="服务群体" :formatter="courseGradeFilter" min-width="110"/>
        <el-table-column prop="subjects" label="教学科目" :formatter="courseGradeFilter" min-width="110"/>
        <el-table-column prop="videoLabels" label="课程特色" min-width="150">
          <template slot-scope="scope">
            <el-tag v-for="(v,i) in (scope.row.videoLabels || '无').split(',')" :key="i" :type="['','success','info','warning','danger'][i%5]">{{v}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="教师名字" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="phone" label="教师手机号码" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="totalPrice" label="原价" :formatter="defValFilter01" min-width="100"/>
        <el-table-column prop="salePrice" label="优惠价格" :formatter="defValFilter01" min-width="100"/>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="audit(scope.row,2)">通过</el-button>
            <el-button type="warning" size="small" @click="audit(scope.row,3)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>

    <el-dialog :title="dialog.title" :visible.sync="dialog.show" :modalAppendToBody="false" width="600px">
      <el-form :model="dialog" :rules="rules" ref="dialog" :labelWidth="dialog.labelWidth">
        <el-form-item label="原价" prop="totalPrice" v-if="dialog.status === 2">
          <el-input-number :min="0" :step="0.01" placeholder="请输入原价..." v-model="dialog.totalPrice"/>
        </el-form-item>
        <el-form-item label="优惠价" prop="salePrice" v-if="dialog.status === 2">
          <el-input-number :min="0" :step="0.01" placeholder="请输入优惠价..." v-model="dialog.salePrice"/>
        </el-form-item>
        <el-form-item prop="reason" v-if="dialog.status === 3">
          <el-input type="textarea" :rows="5" placeholder="请输入审核失败理由..." v-model="dialog.reason"/>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getVideoListApi, auditVideoApi} from '../../api/videoApi'
  import {getEduItemApi} from '../../api/baseApi'
  import {dateTimeFilter, defValFilter01, courseGradeFilter, currencyFilter} from '../../constant/filter'
  import {confirm, success, error} from '../../actions'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'
  import VideoUpload from '../../components/VideoUpload.vue'

  export default {
    name: 'organWait',
    components: {MyPagination, Breadcrumb, TablePage, ImgView, VideoUpload},
    data() {
      return {
        data: {page: 1, pageSize: 10, total: 0, loading: false, status: 0, List: [], keyWord: null},
        dialog: {show: false, title: '', salePrice: 0, totalPrice: 0, reason: '', labelWidth: '0'},
        rules: {},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      courseGradeFilter,
      currencyFilter,
      findList(page = {}) {
        this.data.loading = true
        getEduItemApi().then(() => getVideoListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        }))
      },
      audit({id, name, salePrice, totalPrice}, status) {
        if (status === 2) {
          this.dialog = {...this.dialog, show: true, id, name, totalPrice, salePrice, status, title: '设置', labelWidth: '120px'}
          this.rules = {
            totalPrice: [{type: 'number', min: 0, message: '必须设置原价...', trigger: 'blur'}],
            salePrice: [{type: 'number', min: 0, message: '必须设置优惠价...', trigger: 'blur'}],
          }
        } else {
          confirm(`确认${status === 2 ? '通过' : '拒绝'}视频课程“${name}”审核?`, 'warning', '操作提示').then(() => auditVideoApi({id, name, status}).then(() => {
            success(`${status === 2 ? '通过' : '拒绝'}视频课程“${name}”审核，操作成功！`)
            this.findList()
          }).catch(({msg}) => error(msg || `${status === 2 ? '通过' : '拒绝'}视频课程“${name}”审核，操作失败！请稍后重试...`)))
        }
      },
      submit() {
        this.$refs.dialog.validate((valid) => {
          if (valid) {
            auditVideoApi(this.dialog).then(() => {
              success(`${this.dialog.status === 2 ? '通过' : '拒绝'}视频课程“${this.dialog.name}”审核，操作成功！`)
              this.dialog.show = false
              this.findList()
            }).catch(({msg}) => error(msg || `${this.dialog.status === 2 ? '通过' : '拒绝'}视频课程“${this.dialog.name}”审核，操作失败！请稍后重试...`))
          } else {
            return false
          }
        })
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
    },
    created() {
    },
  }
</script>
