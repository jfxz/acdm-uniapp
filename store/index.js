import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import message from '@/store/modules/message.js'
import user from '@/store/modules/user'
import flight from '@/store/modules/flight.js'
import dic from '@/store/modules/dic'
import cargo from '@/store/modules/cargo'
import guide from '@/store/modules/guide'
import emptyContainer from '@/store/modules/empty-container.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		user,
		dic,
		message,
		flight,
		cargo,
		guide,
		emptyContainer
	},
	getters
})

export default store
