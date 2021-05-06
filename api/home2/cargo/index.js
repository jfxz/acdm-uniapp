import https from '../../../config/api-interface.js'

// 获取货邮统计信息
export const getCargo = (data) => {
	return https({
		url: `/dashboard/load/postAndCargo`,
		method: 'GET',
		data
	})
}
