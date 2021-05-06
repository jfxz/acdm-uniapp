import https from '@/config/api-interface.js'
// 这是个测试接口声明
export const loginByUsername = (data) => {
    return https({
        url: `/oauth/token?username=${data.username}&password=${data.password}&grant_type=${data.grant_type}`,
        method: 'POST',
        data
    })
}