<template>
  <div class="DynamicTable">
    <!-- 添加属性 -->
    <div>

      <div >
         <!-- 属性展示 -->
         <p>属性名</p>

        <!-- 添加属性值 -->
         <div>
            <el-tag></el-tag>
            <el-input></el-input>
            <el-button>+添加属性值</el-button>
         </div>

      </div>

      <!-- 添加属性 -->
      <el-input></el-input>
      <el-button>+添加属性</el-button>
    </div>
    <!-- 表格 -->
  </div>
</template>
<script>
export default {
  name:'DynamicTable',
  data(){

  }
}
</script>
<style lang="less" scoped>

</style>
