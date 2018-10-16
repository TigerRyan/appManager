import * as types from '../mutation-types'
import {getShareCourseTeacherListApi,changeTeacherStatusApi} from '../../api/userApi'
import { Message, MessageBox } from 'element-ui'

const state = {
  data: {
    activeTabs: '1',
    list: [],
    total: null,
    loading: false,
    page: 1,
    pageSize: 10,
    inputValue: null,
    options: [{
      value: '2',
      label: '通过'
    }, {
      value: '3',
      label: '拒绝'
    }],
  }
}

const getters = {
  shareCourse: state => state.data
}

const actions = {
  /*
  * 获取教师评课申请列表
  * 分页组件通过props获取当前page,所以需要将当前路由参数page实时同步给state数据源
  */
  async getShareCourseTeacherList ({ dispatch,commit },page={}) {
    dispatch('changeLoading', true)
    let data = await getShareCourseTeacherListApi(page)
    commit(types.GET_SHARE_COURSE_TEACHER_LIST, {...data,...page})
    dispatch('changeLoading', false)
  },

  // loading
  changeLoading({ dispatch,commit },status){
    commit(types.CHANGE_LOADING, status)
  },
  
  // 改变搜索框value
  changeInputValue({ dispatch,commit },value){
    commit(types.CHANGE_INPUT_VALUE, value)
  },

  // 改变教师拼课申请状态（通过 or 拒绝）
  async changeTeacherStatus({ dispatch,commit }, data){
    await changeTeacherStatusApi(data)
    Message.success('操作成功')
    console.log(data,"data");
    
    dispatch('getShareCourseTeacherList',{page:1,pageSize:10,status: data.activeTabs,name: data.name})
  },
  //改变activeTabs
  changeActiveTabs({ dispatch,commit }, name) {
    commit(types.CHANGE_Active_Tabs, name)
  }
}

const mutations = {
	[types.GET_SHARE_COURSE_TEACHER_LIST] (state, data) {
    state.data = {...state.data, ...data}
  },

  [types.CHANGE_LOADING] (state, data) {
    state.data.loading = data
	},

  [types.CHANGE_INPUT_VALUE] (state, data) {
    state.data.inputValue = data
  },
  [types.CHANGE_Active_Tabs] (state, name) {
    state.data.activeTabs = name
    state.data.inputValue = ""

  },
}

export default {
  	state,
    getters,
    actions,
  	mutations
}
