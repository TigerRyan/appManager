<template>
	<div class="shareCourseTable">
    <!-- table -->
    <el-checkbox-group @change="handleSelectionChange" v-model="checkedList">
  		<el-table 
        :data="data.list" 
        :select-on-indeterminate="true"
        v-loading="data.loading" 
        element-loading-text="拼命加载中..."
        ref="multipleTable"
        >
        <el-table-column prop="id" label="ID" min-width="50">
          <template slot-scope="scope">
            <el-checkbox :label="scope.row.id">{{scope.row.id}}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="用户头像" min-width="80">
          <template slot-scope="scope">
            <HeadImg :src="scope.row.logo"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="教师名称" min-width="80"/>
        <el-table-column prop="payMoney" label="课时费(元)" min-width="80"/>
        <el-table-column prop="phone" label="手机号码" min-width="110"/>
        <el-table-column prop="createTime" label="申请时间" :formatter="dateTimeFilter" min-width="140"/>
        <el-table-column prop="status" label="审核状态" :formatter="openStatusFilter" min-width="90"/>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 1" type="del" size="middle" @click="setHanddle(scope.row)" :disabled="disabled">通过</el-button>
            <el-button v-if="scope.row.status == 2 || scope.row.status == 1" type="edit" size="middle" @click="cancleHandle(scope.row)" :disabled="disabled">拒绝</el-button>
            <el-button type="edit" @click="$router.push({name: 'teacherDetails', query: {id:scope.row.teacherId}})">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>

    <!-- 全选 -->
    <div class="btn" v-show="this.shareCourse.activeTabs!=3">
      <el-checkbox 
        :disabled="disabled"
        v-model="checked" 
        class="check" 
        @change="changeCheckBox"
      >全选</el-checkbox>
      <el-select v-model="value" placeholder="批量操作" class="select" @change="changeSelect" v-show="this.shareCourse.activeTabs!=3">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
	</div>
</template>

<script>
import HeadImg from '../../components/HeadImg.vue'
import { confirm,success, error, info } from '../../actions'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'shareCourseTable',
  components: {
    HeadImg
  },
  computed: {
    ...mapGetters([
      'shareCourse',
    ]),
  },
  props: {
    data: {                // 数据源
      type: Object,
      default: {},
    },
    disabled: {            // 是否禁用
      type: Boolean,
      default: false,
    },
    options: {             // 批量操作下拉
      type: Array,
      default: [],
    },
    cancleHandle: {        // 拒绝
      type: Function,
      default: ()=>{},
    },
    setHanddle: {          // 通过
      type: Function,
      default: ()=>{},
    },
    openStatusFilter: {    // 审核状态filter
      type: Function,
      default: ()=>{},
    },
    dateTimeFilter: {      // 申请时间filter
      type: Function,
      default: ()=>{},
    }
  },

  data () {
    return {
      checkedList: [],     // 被选中项
      value: '',           // 批量操作下拉框值
      checked: false,      // 是否全选
    };
  },

  methods:{
    // 切换全选按钮
    changeCheckBox(val){
      let arr = []
      this.data.list.forEach(item=>{
        arr.push(item.id)
      })
      this.checkedList = val ? arr : []
    },
    
    // 监听checkbox-group选中项变化
    handleSelectionChange(value){
      let checkedCount = value.length;
      this.checked = checkedCount === this.data.list.length;
    },
    
    // 批量操作， 通过 or 拒绝
    changeSelect(val){
      if(!this.checkedList.length){
        info('没有选中项！')
        setTimeout(()=>{
          this.value = ''
        },1000)
        return
      }else{
        this.$store.dispatch('changeTeacherStatus',{ids:this.checkedList.join(','),status:val,activeTabs:this.shareCourse.activeTabs,name:this.shareCourse.inputValue})
        setTimeout(()=>{
          this.checkedList = []
          this.checked = false
          this.value = ''
        },1000)
      }
    }
  },

  watch:{
    data:function(val,oldVal){
      this.checked = false
      this.checkedList = []
    }
  }
}
</script>
<style scoped lang="less">
.shareCourseTable{
  position: relative;
  .btn{
    position: absolute;
    left: 20px;
    bottom: -59px;
    margin-bottom: 10px;
    .select{
      width: 120px;
      margin: 0 20px;
    }
    .check{
      line-height: 40px;
    }
  }
}
</style>