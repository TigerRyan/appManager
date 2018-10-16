<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入直播名称或教师手机号码查询..." style="width: 300px" suffix-icon="el-icon-search" v-model="data.keyWord" @blur="search"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="直播课程名称" :formatter="defValFilter01" min-width="110"/>
        <el-table-column prop="courseImg" label="直播封面" min-width="240">
          <template slot-scope="scope">
            <ImgView :src="scope.row.courseImg" width="180" height="90"/>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="服务群体" :formatter="courseGradeFilter" min-width="110"/>
        <el-table-column prop="subjects" label="教学科目" :formatter="courseGradeFilter" min-width="110"/>
        <el-table-column prop="courseLabels" label="课程特色" min-width="150">
          <template slot-scope="scope">
            <el-tag v-for="(v,i) in (scope.row.courseLabels || '无').split(',')" :key="i" :type="['','success','info','warning','danger'][i%5]">{{v}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" :formatter="dateTimeFilter" min-width="120"/>
        <el-table-column prop="endTime" label="结束时间" :formatter="dateTimeFilter" min-width="120"/>
        <el-table-column prop="userName" label="直播教师" :formatter="defValFilter01" min-width="120"/>
        <el-table-column prop="phone" label="教师手机号码" :formatter="defValFilter01" min-width="120"/>
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
  import {getLiveRadioListApi, auditLiveRadioApi} from '../../api/liveRadioApi'
  import {getEduItemApi} from '../../api/baseApi'
  import {dateTimeFilter, defValFilter01, courseGradeFilter} from '../../constant/filter'
  import {success, error} from '../../actions'
  import MyPagination from '../../components/MyPagination.vue'
  import Breadcrumb from '../../components/Breadcrumb.vue'
  import TablePage from '../../components/TablePage.vue'
  import ImgView from '../../components/ImgView.vue'

  export default {
    name: 'liveRadioWait',
    components: {MyPagination, Breadcrumb, TablePage, ImgView},
    data() {
      return {
        data: {page: 1, pageSize: 10, loading: false, status: 0, list: [], total: 0, keyWord: null},
        dialog: {show: false, title: '', salePrice: 0, totalPrice: 0, reason: '', labelWidth: '0'},
        rules: {},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      courseGradeFilter,
      findList(page = {}) {
        this.data.loading = true
        getEduItemApi().then(() => getLiveRadioListApi({...this.data, ...page}).then(data => {
          this.data = {...this.data, ...page, ...data, loading: false}
        }))
      },
      audit({id, name}, status) {
        if (status === 2) {
          this.dialog = {...this.dialog, show: true, id, name, status, title: '设置', labelWidth: '120px'}
          this.rules = {
            totalPrice: [{type: 'number', min: 0, message: '必须设置原价...', trigger: 'blur'}],
            salePrice: [{type: 'number', min: 0, message: '必须设置优惠价...', trigger: 'blur'}],
          }
        } else {
          this.dialog = {...this.dialog, show: true, id, name, status, title: '拒绝原因', labelWidth: '0'}
          this.rules = {
            reason: [{required: true, max: 30, message: '必须填写，不能超过30个字符...', trigger: 'blur'}],
          }
        }
      },
      submit() {
        this.$refs.dialog.validate((valid) => {
          if (valid) {
            auditLiveRadioApi(this.dialog).then(() => {
              success(`${this.dialog.status === 2 ? '通过' : '拒绝'}直播课程“${this.dialog.name}”审核，操作成功！`)
              this.dialog.show = false
              this.findList()
            }).catch(({msg}) => error(msg || `${this.dialog.status === 2 ? '通过' : '拒绝'}直播课程“${this.dialog.name}”审核，操作失败！请稍后重试...`))
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
