/**
 * 路由定义
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import {ACCESS_TOKEN, CREATE, TITLE} from '../constant'
import {coocki} from '../constant/utils'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
})

router.afterEach(({meta, params, query}) => {
  if (query.debug) {
    coocki.set(ACCESS_TOKEN, query.debug)
  }
  if (!meta || !meta.title) {
    document.title = TITLE
  } else if (meta.title && params.id === CREATE) {
    document.title = `${TITLE} - 添加${meta.title.substr(2)}`
  } else if (meta.title) {
    document.title = `${TITLE} - ${meta.title}`
  }
})

export default router
