import _config from '@/config/api-config'; // 导入私有配置
// export const ssoUrl = 'http://10.1.16.63:9091'
import store from '@/store/index.js'
//  http 请求配置项
export const AUTH_CLIENT_ID = 'client'
export const AUTH_CLIENT_SECRET = 'client'
import base64 from '@/common/util/crypto-js/base64.js'
import {
	deepCopy
} from '@/common/util/util.js'
export default function $http(options) {
	if (options && options.data && 'grant_type' in options.data) {
		options.url = _config.url + '/api/auth' + options.url;
		_config.header['Authorization'] = 'Basic ' + `${base64.Base64.btoa(`${AUTH_CLIENT_ID}:${AUTH_CLIENT_SECRET}`)}`
	} else {
		options.url = _config.url + '/api' + options.url;
		_config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('user_token')
		// _config.header['Authorization'] = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkcXh3IiwibW9iaWxlUGhvbmUiOiIiLCJ1c2VyX25hbWUiOiJkcXh3Iiwic2NvcGUiOlsicmVhZCJdLCJleHAiOjE1Nzg2NjEyMTAsImRlcGFydCI6IiIsInVzZXJOYW1lIjoi5Zyw5Yuk5bit5L2NIiwidXNlcklkIjoiOGE4MTkwYmY2N2FiZWJkZjAxNjdmN2I5NjI3ZTAwMGEiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiNzc5MGMyMDktYmY3MC00ZWE3LWEwMjctZjU2MjYxMzZiYTlmIiwiY2xpZW50X2lkIjoiY2xpZW50In0.EUo-1AGe7StnAxnOGjM0CSIaPc8E-fVBNSOPKHHaGURieh__QP_gYsP7V3aw9BcjTAXNrvkt3JoqzlAIu8tCFjmyRRcSf9a2gnTZIrXLEwa-yYgJ6OhyXg2qKgD0KySvTi5xCkiBqFHGautRBB-EFgw6VroRPvTIzPmNiUT4ioc'
	}
	return new Promise((resolve, reject) => {
		// 进行url字符串拼接
		// 拦截请求
		_config.complete = (response) => {
			//  request請求访问成功
			if (response.statusCode === 200) {
				// 接口请求成功
				resolve(response.data);
			} else {
				console.log('requestFail', options)
				// 处理catch 请求，不在本页面之外处理，统一在这里处理
				if (options.handle) {
					reject(response)
				} else {
					try {
						Promise.reject(response).catch(err => {
							_page_error(response.statusCode || response.errMsg, response, options);
							reject(response)
						});
					} catch (e) {
						console.log(e)
					}
				}
			}
		}
		// 开始请求
		uni.request(Object.assign({}, _config, options));
	})
}

// 接口錯誤
function _error(err, msg = '') {
	switch (err) {
		case 400:
	}
}
// request 錯誤
function _page_error(err, response, options) {
	switch (err) {
		case 403:
			var pages = getCurrentPages();
			var page = pages[pages.length - 1]
			uni.removeStorageSync('access_token')
			/* 判断是不是在登录界面 是则提示,否则确定框 */
			console.log(1111, response)
			if (page.route === 'pages/login/login') {
				uni.showToast({
					title: response.data.error_description || '登录异常，请重新登录',
					duration: 1000,
					icon: 'none'
				})
			} else {
				uni.showModal({
					title: '提示',
					content: '登录异常，请重新登录',
					success: function(res) {
						if (res.confirm) {
							uni.reLaunch({
								url: '../../../pages/login/login',
							})
						} else if (res.cancel) {}
					}
				})
			}
			break;
		case 400:
    uni.hideLoading()
			uni.showToast({
				title: response.data.error_description,
				duration: 1000,
				icon: 'none'
			})
			break;
		case 401 || 40101:
			// 错误码401的处理方式
			// 通过refreshtoken获取新的token,成功则重新请求
			_refreshAccessToken().then(res => {
				_config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('user_token')
				// 成功重新请求
				uni.request(Object.assign({}, _config, options))
			}).catch(e => {
				return
			})
			break;
		case 404:
			// 错误码404的处理方式
			uni.showToast({
				title: '没有找到页面',
				duration: 1000,
				icon: 'none'
			})
			console.error("没有找到页面")
			break;
		case 405:
			uni.showToast({
				title: '错误的请求',
				duration: 1000,
				icon: 'none'
			})
			console.error("错误的请求")
			break;
	}
}

function _refreshAccessToken() {
	let config = deepCopy(_config)
	let data = {
		grant_type: 'refresh_token',
		refresh_token: uni.getStorageSync('refresh_token')
	}
	let option = {
		url: _config.url + '/api/auth' + '/oauth/token?grant_type=' + data['grant_type'] + '&refresh_token=' + data['refresh_token'],
		header: {
			'Authorization': 'Basic ' + `${base64.Base64.btoa(`${AUTH_CLIENT_ID}:${AUTH_CLIENT_SECRET}`)}`
		},
	}
	return new Promise((resolve, reject) => {
		// 进行url字符串拼接
		// 拦截请求
		config.complete = (response) => {
			//  request請求访问成功
			if (response.statusCode === 200) {
				// 接口请求成功,写入新的token
				uni.removeStorageSync('user_token')
				uni.removeStorageSync('refresh_token')
				uni.setStorageSync('user_token', response.data.access_token)
				uni.setStorageSync('refresh_token', response.data.refresh_token)
				resolve(response.data)
			} else {
				// 请求失败清空token,返回首页
				uni.removeStorageSync('user_token')
				uni.removeStorageSync('refresh_token')
				uni.removeStorageSync('user_id')
				uni.removeStorageSync('user_name')
				let pages = getCurrentPages();
				let page = pages[pages.length - 1]
				if (page.route !== 'pages/login/login') {
					uni.showToast({
						title: '身份校验异常,请重新登录!',
						duration: 1000,
						icon: 'none'
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '../login/login'
						})
					}, 3000);
					reject(response)
				}
			}
		}
		// 开始请求
		uni.request(Object.assign({}, config, option))
	})
}
