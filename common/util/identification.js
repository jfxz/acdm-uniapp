/*
*  界面名称: 生物识别
*  界面功能: 自动检测面容、指纹等 验证顺序为 1、检查支持的认证方式 2、获取设备内是否录入如指纹等生物信息的接口 3、开始生物验证
*  其他     
*  时间     2020-7-19 22:05:06
*  作者     zql
 */
import eventVue from './eventVue.js'
export function ident() {
  console.log(getApp().globalData.auth)
	checkIsSupportSoterAuthentication()
}
// 检查支持的认证方式
export const checkIsSupportSoterAuthentication = () => {
	uni.checkIsSupportSoterAuthentication({
		success(res) {
      console.log('mode', res)
			let mode = res.supportMode
			checkIsSoterEnrolledInDevice(mode)
		},
		fail(err) {
			console.log('err', err);
		},
		complete(res) {
			console.log(res);
		}
	})
}

// 开始生物验证
export const startSoterAuthentication = (mode) => {
	uni.startSoterAuthentication({
		requestAuthModes: mode,
		challenge: '123456',
		authContent: `请用${mode[0] === 'facial' ? 'FaceID' : '指纹'}解锁`,
		success(res) {
			console.log('验证结束', res, getApp().globalData.auth);
      eventVue.$emit(getApp().globalData.auth || 'login')
      // return {'name': '123'}
		},
		fail(err) {
			console.log('err1', err);
		},
		complete(res) {
			console.log(res);
		}
	})
}

// 获取设备内是否录入如指纹等生物信息的接口
export const checkIsSoterEnrolledInDevice = (mode) => {
	console.log('mode', mode)
	uni.checkIsSoterEnrolledInDevice({
		checkAuthMode: mode[0],
		success(res) {
			console.log('已开启', res);
			startSoterAuthentication(mode)
		},
		fail(err) {
			console.log(err);
		},
		complete(res) {
			console.log(res);
		}
	})
}
