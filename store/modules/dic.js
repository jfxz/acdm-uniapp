import {
	DIC as localDic,
	REMOTE_DIC as remoteDic
} from '../../common/constants/REMOTE_DIC.js'
import {
	deepCopy
} from '@/common/util/util.js'
import * as dicApi from "../../api/dic/index.js"
let getRemoteDic = (dicKey, ajax, callback) => {
	return new Promise(resolve => {
		ajax().then(res => {
			let result = {}
			if (res.status && res.data) {
				result[dicKey] = callback ? callback(res.data) : res.data
			} else if (res instanceof Array) {
				result[dicKey] = callback ? callback(res) : res
			} else {
				console.error('获取字典发生异常：' + dicKey)
			}
			resolve(result)
		}).catch(e => {
			resolve(null)
		})
	})
}

const dic = {
	state: {
		remoteDic: {}
	},
	actions: {
		// 加载远程字典缓存到vuex
		GetRemoteDicAll({
			commit
		}) {
			let array = remoteDic.map(item => {
				return getRemoteDic(item.key, item.api)
			})
			return Promise.all(array).then(data => {
				let result = {}
				data.forEach(item => {
					Object.assign(result, item)
				})
				commit('SET_REMOTE_DIC', result)
			})
		},
		// 获取字典公用类
		GetDic({
			commit,
			state,
			dispatch
		}, dic) {
			return new Promise((resolve, reject) => {
				if (typeof dic === 'string') {
					dic = [dic]
				}
				let allDic = Object.assign({}, localDic, state.remoteDic)
				let result = {}
				dic.forEach(key => {
					result[key] = allDic[key]
				})
				// 克隆一份数据，否则vuex数据可能被修改
				resolve(deepCopy(result))
			})
		},
		//获取基础航班数据
		getBaseAirport({
			commit,
			state,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				dicApi.getBaseAirport().then(res => {
					if (res.status) {
						let remoteDic = Object.assign(state.remoteDic, {
							'BASE_AIRPORT': res.data
						})
						commit('SET_REMOTE_DIC', remoteDic)
					}
				})
			})
		}
	},
	mutations: {
		SET_REMOTE_DIC(state, data) {
			state.remoteDic = data
		}
	}
}
export default dic
