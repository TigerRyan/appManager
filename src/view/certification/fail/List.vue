<template>
  <div class="content_data">
    <Breadcrumb/>
    <TablePage>
      <el-input placeholder="请输入教师姓名或手机号码查询..." style="width: 300px" suffix-icon="el-icon-search" v-model="data.name" @blur="search"/>
      <ExportButton text="导出认证" :method="exportCheckList"/>
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中...">
        <el-table-column prop="id" label="排序" min-width="80">
          <template slot-scope="scope">
            {{(data.page - 1) * data.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" :formatter="defValFilter02" min-width="100"/>
        <el-table-column prop="phone" label="手机号码" :formatter="defValFilter01" min-width="130"/>
        <el-table-column prop="idcard" label="身份证正面" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.idcard" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="认证姓名" :formatter="defValFilter02" min-width="130"/>
        <el-table-column prop="idCardNumber" label="身份证号码" :formatter="defValFilter02" min-width="170"/>
        <el-table-column prop="idback" label="身份证反面" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.idback" defSrc="/static/img/idcard_back.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="handIdcard" label="手持证件照" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.handIdcard" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherCard" label="教师资格证" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.teacherCard" defSrc="/static/img/certificate.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherRewardcard" label="教师荣誉证书" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.teacherRewardcard" defSrc="/static/img/certificate.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="otherCard" label="其他资格证书" min-width="130">
          <template slot-scope="scope">
            <ImgView :src="scope.row.otherCard" defSrc="/static/img/certificate.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="申请时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column prop="reason" label="拒绝理由" :formatter="defValFilter02" min-width="170"/>
      </el-table>
    </TablePage>
    <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
  </div>
</template>

<script>
  import { getCheckListApi, exportCheckListApi } from '../../../api/checkApi'
  import { dateTimeFilter, defValFilter01, defValFilter02 } from '../../../constant/filter'
  import MyPagination from '../../../components/MyPagination.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'
  import HeadImg from '../../../components/HeadImg.vue'
  import TablePage from '../../../components/TablePage.vue'
  import ImgView from '../../../components/ImgView.vue'
  import ExportButton from '../../../components/ExportButton.vue'

  export default {
    name: 'certificationWait',
    components: {MyPagination, HeadImg, Breadcrumb, TablePage, ImgView, ExportButton},
    data() {
      return {
        data: {page: 1, pageSize: 10, list: [], total: 0, status: 3, loading: false, name: null},
      }
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      defValFilter02,
      findList(page = {}) {
        this.data.loading = true
        getCheckListApi({...this.data, ...page}).then((data) => {
          this.data = {...this.data, ...page, ...data, loading: false}
        })
      },
      exportCheckList({start, end}) {
        return exportCheckListApi({...this.data, start, end})
      },
      search(page = {}) {
        this.findList({...page, page: 1})
      },
    },
    created() {
    },
  }
</script>
