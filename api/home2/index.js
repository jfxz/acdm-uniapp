import https from '../../config/api-interface.js'
/* 获取系统参数 */
export const getIndexParams = (data) => {
	return https({
		url: '/acdm/system/param/page',
		method: 'GET',
		data
	})
}
