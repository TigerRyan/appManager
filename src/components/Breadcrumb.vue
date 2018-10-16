<style lang="less">
  .breadcrumb {
    .el-breadcrumb__item {
      line-height: 74px;
      i {
        margin-right: 5px;
        font-size: 18px;
      }
    }
  }
</style>
<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item :to="{ name: 'home' }"><i class="el-icon-my-homefill"/>首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(m,i) in menu" :key="m.id" :to="{path:m.url || $route.fullPath}"><span @click="clickFn(m.url || $route.fullPath,i)"><i :class="m.icon || 'el-icon-date'"/>{{m.name}}</span></el-breadcrumb-item>
    <slot></slot>
  </el-breadcrumb>
</template>
<script>
  import {menuApi} from '../api/adminApi'
  import {coocki} from '../constant/utils'
  import {ACTIVE_PATH, ACCESS_TOKEN, TEACHER_MENU} from '../constant'

  export default {
    name: 'breadcrumb',
    data() {
      return {
        menus: [],
      }
    },
    computed: {
      menu() {
        return this.findMenu(this.menus)
      },
    },
    methods: {
      findMenu(menus = []) {
        let res = []
        if (!menus || menus.length < 1) {
          return res
        }
        menus.forEach(({url, name, id, code, icon, children}) => {
          if ((coocki.get(ACTIVE_PATH) || this.$route.path).startsWith(url)) {
            res.push({url, name, id, code, icon})
          }
          if (children && children.length > 0) {
            const subs = this.findMenu(children)
            if (subs && subs.length > 0) {
              res = [{url, name, id, code, icon}, ...subs]
            }
          }
        })
        return res
      },
      clickFn(url, i) {
        if (url === this.$route.fullPath && this.menu.length !== i + 1) {
          this.$router.go(0)
        }
      },
    },
    created() {
      if (coocki.get(ACCESS_TOKEN).startsWith('XUEXUNBAO_')) {
        this.menus = TEACHER_MENU
      } else {
        menuApi().then((data) => {
          this.menus = data
        })
      }
    },
  }
</script>
