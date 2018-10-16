import Vue from 'vue'
import Vuex from 'vuex'

import shareCourse from './modules/shareCourse'

Vue.use(Vuex)

const store = new Vuex.Store({
	strict: true,         // process.env.NODE_ENV !== 'development',
	modules: {
  		shareCourse
	},
})

export default store
