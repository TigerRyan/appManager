<template>
	<div class="shareCourseSearch">
    <div class="right">
      <el-input 
        placeholder="请输入教师名称或手机号码" 
        suffix-icon="el-icon-search" 
        :value="inputValue"
        :style="{width:width+'px'}"
        @blur="blur"
      />
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button plain @click="reset">重置</el-button>
    </div>
	</div>
</template>

<script>
export default {
  name: 'shareCourseSearch',
  props: {
    search: {
      type: Function,
      default: ()=>{},
    },
    reset: {
      type: Function,
      default: ()=>{},
    },
    blur: {
      type: Function,
      default: ()=>{},
    },
    width: {
      type: String,
      default: '120',
    },
    height: {
      type: String,
      default: '120',
    },
    inputValue: {
      default: null,
    },
  }
}
</script>
<style scoped lang="less">
.shareCourseSearch{
	display: flex;
  justify-content: space-between;
	margin-bottom: 20px;
	.el-button--primary{
		margin: 0 10px 0 20px;
	}
}
</style>