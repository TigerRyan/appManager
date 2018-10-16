<template>
  <div class="content_data">
    <Breadcrumb/>
    <Tabs :handleClick="handleClick"/>

    <ExportButton text="导出" :method="exportCheckList"/>

    <Search
      width = '220'
      :search="search"
      :reset="reset"
      :blur="blur"
      :inputValue="shareCourse.inputValue"
    />

    <Table
      :data = "shareCourse"
      :dateTimeFilter = "dateTimeFilter"
      :openStatusFilter = "openStatusFilter2"
      :setHanddle = "setHanddle"
      :cancleHandle = "cancleHandle"
      :disabled = "disabled"
      :options="shareCourse.options"
    />

    <MyPagination
      :page="shareCourse.page"
      :size="shareCourse.pageSize"
      :method="changeTable"
      :total="shareCourse.total"
    />
  </div>
</template>

<script>
import { dateTimeFilter, openStatusFilter2 } from '../../constant/filter'
import { confirm,success, error } from '../../actions'
import { mapGetters, mapActions } from 'vuex'
import { exportShareCourseListApi } from '../../api/exportApi.js'
import ExportButton from '../../components/ExportButton.vue'
import MyPagination from '../../components/MyPagination.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import Search from './Search'
import Table from './Table'
import Tabs from './Tabs'

export default {
  name: 'teacherList',
  components: {
    MyPagination,
    Breadcrumb,
    Search,
    Table,
    Tabs,
    ExportButton
  },
  data() {
    return {
      disabled:　false,
    }
  },
  created() {
    console.log(this.shareCourse)
    let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type

    this.disabled = UserType ? true : false

  },

  computed: {
    ...mapGetters([
      'shareCourse',
    ]),
  },
  methods: {
    ...mapActions([
      'getShareCourseTeacherList',
      'changeInputValue',
      'changeTeacherStatus'
    ]),

    dateTimeFilter,
    openStatusFilter2,
    changeTable({...page}) {
      this.getShareCourseTeacherList({...page,name:this.shareCourse.inputValue,status:this.shareCourse.activeTabs})
    },
    setHanddle(val){
      this.changeTeacherStatus({ids:val.id,status:2,activeTabs:this.shareCourse.activeTabs,name:this.shareCourse.inputValue})
    },

    cancleHandle(val){
      this.changeTeacherStatus({ids:val.id,status:3,activeTabs:this.shareCourse.activeTabs,name:this.shareCourse.inputValue})
    },

    search(){
      this.getShareCourseTeacherList({
        page:1, pageSize: 10,name:this.shareCourse.inputValue,status:this.shareCourse.activeTabs
      })
    },

    blur(e){
      this.changeInputValue(e.target.value)
    },

    reset(){
      this.changeInputValue(null)
      this.getShareCourseTeacherList({page:1,pageSize:10,status:this.shareCourse.activeTabs})
    },

    //切换状态
    handleClick(name) {
      this.getShareCourseTeacherList({
        page:1, pageSize: 10,name:this.shareCourse.inputValue,status:this.shareCourse.activeTabs
      })
    },
    // 导出
    exportCheckList({start, end}) {
      return exportShareCourseListApi({...this.shareCourse,start,end})
    }

  },
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
 .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.5);
    .el-dialog {
      width: 30%;
    }
  }
</style>
