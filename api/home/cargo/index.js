import https from '../../../config/api-interface.js'

// 获取货邮统计信息
export const getCargo = (data) => {
	return https({
		url: `/dashboard/load/postAndCargo`,
		method: 'GET',
		data
	})
}

// 获取日货油吞吐量
export const getCargoDay = (data) => {
	return https({
		url: `/dashboard/load/cargo/day/${data.airportCode}`,
		method: 'GET',
		data
	})
}

// 获取月货油吞吐量
export const getCargoMonth = (data) => {
	return https({
		url: `/dashboard/load/cargo/month/${data.airportCode}`,
		method: 'GET',
		data
	})
}
