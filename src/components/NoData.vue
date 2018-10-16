<style lang="less" scoped>
  .noData {
    text-align: center;
    .noData_box {
      display: inline-block;
      background: url("/static/img/nodata.png") no-repeat;
      padding-left: 338px;
      height: 217px;
      text-align: left;
      div:first-child {
        font-size: 22px;
        color: #495869;
        margin-top: 80px;
      }
      div:last-child {
        margin-top: 31px;
        font-size: 16px;
        color: #97A8BD;
      }
    }
  }
</style>
<template>
  <div class="noData">
    <div class="noData_box">
      <div>{{msg}}</div>
      <div>{{submsg}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NoData',
    props: {
      msg: {
        type: String,
        default: '暂无此类查询结果',
      },
      submsg: {
        type: String,
        default: '',
      },
    },
  }
</script>
