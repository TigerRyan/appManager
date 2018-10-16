<style lang="less" scoped>
  @import "login.less";
</style>

<template>
  <div class="login_bg">
    <transition name="fade" mode="out-in">
      <div class="login">
        <img class="img01" src="/static/img/logo_xxb.png">
        <img class="img02" src="/static/img/login_img.png">
        <div class="box">
          <img class="code" @click="getCode({code:'0',msg: '请打开APP扫码登录！'})" :src="data.path"/>
          <div class="msg" v-if="data.msg">{{data.msg}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {loginCodeApi} from '../../api/userApi'
  import {success} from '../../actions'
  import {coocki} from '../../constant/utils'
  import {ACCESS_TOKEN} from '../../constant'

  export default {
    name: 'loginCode',
    data() {
      return {
        data: {code: '0', path: '', user: null, msg: '请打开APP扫码登录！'},
      }
    },
    methods: {
      getCode(param = {}) {
        this.data = {...this.data, ...param}
        loginCodeApi(this.data.code).then(data => {
          this.data = {...this.data, ...data}
          if (data.user) {
            success('登陆成功！')
            coocki.set(ACCESS_TOKEN, data.code)
            this.$router.push({name: 'teacher'})
          } else {
            setTimeout(_ => this.getCode(), 1500)
          }
        }).catch(({code, msg}) => {
          if (code === 606) {
            this.data.msg = msg
            setTimeout(_ => this.getCode(), 1500)
          } else {
            this.data.msg = '二维码已失效！请点击二维码重新获取！'
          }
        })
      },
    },
    created() {
      this.getCode()
    },
  }
</script>
