import https from '../../config/api-interface.js'
// 修改密码
export const changePassword = data => {
  return https({
    url: `/base/user/changePwd`,
    method: 'PUT',
    data: data
    // handle:true
  })
}
