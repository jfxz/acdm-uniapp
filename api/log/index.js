import https from '../../config/api-interface.js'
// 修改密码
export const addLogBatch = data => {
  return https({
    url: `/log/appLog/addBatch`,
    method: 'POST',
    data: data
    // handle:true
  })
}
