<style lang="less" scoped>
  @import "../base.less";

  .card_page {
    min-height: 100px;
  }
</style>
<template>
  <div class="card_page">
    <el-row>
      <el-col v-for="(r,i) in data" :span="col" :key="i">
        <slot :item="r"></slot>
      </el-col>
      <NoData v-if="data.length < 1"/>
    </el-row>
  </div>
</template>
<script>
  import NoData from './NoData.vue'
  export default {
    name: 'card_page',
    components: {NoData},
    props: {
      data: {
        type: Array,
        default: () => ([]),
      },
      row: {
        type: Number,
        default: 4,
      },
    },
    computed: {
      col() {
        return Math.ceil(24 / this.row)
      },
    },
  }
</script>
