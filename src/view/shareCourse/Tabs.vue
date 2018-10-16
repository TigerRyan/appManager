<template>
  <div id="shareCourseTabs">
    <el-tabs v-model="activeTabs" type="card" @tab-click="gohandleClick">
      <el-tab-pane label="审核中" name="1">审核中</el-tab-pane>
      <el-tab-pane label="审核通过" name="2">审核通过</el-tab-pane>
      <el-tab-pane label="审核失败" name="3">审核失败</el-tab-pane>
    </el-tabs>
  </div>
  
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'shareCourseTabs',
    computed: {
      ...mapGetters([
        'shareCourse',
      ]),
    },
    props: {
      handleClick: {
        type: Function,
        default: ()=>{},
      },
    },
    data() {
      return {
        activeTabs: null
      };
    },
    
    created(){
      this.activeTabs = this.shareCourse.activeTabs
    },
    mounted(){
      // this.handleClick(this.activeTabs)
    },
    methods: {
      gohandleClick(tab, event) {
        console.log(555);
        this.$store.dispatch('changeActiveTabs',tab.name)
        console.log(666);
        
        this.handleClick(tab.name)
      }
    }
  };
</script>

<style lang="less" >
#shareCourseTabs {
  .el-tabs__content {
    display: none;
  }
  .el-tabs__nav-scroll {
    background-color: #fff;
  }
  .el-tabs__nav {
    background-color: #fff;
    padding-left: 20px;
    border: none;
    .el-tabs__item {
      font-size: 20px;
      height: 70px;
      line-height: 70px;
      border: none;
      padding: 0 0;
      margin: 0 20px;
      color: #495869;
      
    }
    .el-tabs__item.is-active {
      border-bottom: 3px #51c5ff solid;
      color: #51c5ff;
    }
  }
}

</style>
