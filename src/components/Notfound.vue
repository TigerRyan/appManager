<!--  -->
<style lang='less' scoped>
    .content_data{
      width: 608px;
      height: 390px;
      margin: 0 auto;
      margin-top: 165px;
      .shuzi{
        width: 100%;
        text-align: center;
        img{
           width: 375px;
           height: 212px;
        }
      }
      .katong{
        position: relative;
       img{
         width: 72px;
         height: 99px;
       }
        span{
          font-size:36px;
          position: absolute;
          top: 35px;
          left: 100px;
          color: #333;
        }
      }
      .btn{
        margin-top: 47px;
        display: flex;
        justify-content: space-around;
        .el-button{
          width: 165px;
          height: 50px;
          border-radius: 25px;
          font-size: 18px;
        }
      }
    }
</style>
<template>
  <div class='content_data'>
    <div class="found">
      <div class="shuzi">
        <img src="../../static/img/shuzi_404.png" alt="">
      </div>
      <div class="katong">
          <img src="../../static/img/katong_404.png" alt="">
          <span>Sorry,您访问的页面不存在哦...</span>
      </div>
      <div class="btn">
        <el-button type="primary" round @click="go(0)">返回系统首页</el-button>
        <el-button type="danger" round @click="go(1)">返回继续操作</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    return {
    }
  },
  methods: {

    // 跳转 type为0，表示回系统首页，1表示返回上一级
    go(type) {
      let user = JSON.parse(window.localStorage.getItem('columnInfoList'))
      let role = user[0].appType
      let path = role === 'advertiser' ? '/advertisementView/asindex' : '/mediaView/mediaindex'
      if (type) {
        window.history.go(-1)
      } else {
        this.$router.push({path: path})
      }
    },
  },
  created () {
  },
}
</script>
