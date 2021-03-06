import https from '../../config/api-config.js'

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * handle [boolean] 如果需要自己处理 catch 请求 ，传入 true ，交给接口统一处理 ，请传如 false或不传
 */

// 单点登录
export const loginByUsername = (data) => {
    return https({
        url: `/api/login`,
        method: 'POST',
        data
		// handle:true
    })
}
export const getUserInfo = (data) => {
    return https({
        url: `/api/user/me`,
        method: 'GET',
        data
		// handle:true
    })
}