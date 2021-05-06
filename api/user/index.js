import https from '../../config/api-interface.js'

/* 获取用户角色信息 */
export const getUserRole = (data) => {
	return https({
		url: '/acdm/roleOption/user',
		method: 'GET',
		data
	})
}
// 订阅机场
export const getUserAirport = _ => {
    return https({
        url: `/acdm/airport/user/subscribe/list`,
        method: 'GET'
    })
}
// 用户信息
export const getUserMsg = _ => {
    return https({
        url: `/acdm/user/me`,
        method: 'GET'
    })
}

// 所有角色信息
export const getRoleAll = _ => {
    return https({
        url: `/acdm/role/mobile/all`,
        method: 'GET'
    })
}
