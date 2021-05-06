// 导入私有配置
import _config from './api-config';
import crypto from '@/common/util/crypto-js/crypto-js.js'
import sha256 from '@/common/util/crypto-js/sha256.js'
import {LOGIN_PREFIX} from '../common/constants/login-prefix.js'
import base64 from '../common/util/crypto-js/base64.js'
import stomp from '@/common/util/stomp-client.js'
import moment from 'moment'
// import notify from '@/common/util/notify.js' 
// 单点登录所需静态变量
// export const AUTH_CLIENT_ID = 'acdm'
// export const AUTH_CLIENT_SECRET =
//   'MTZlM2Q4ZjQ2YmIwNWRjOGFjMTU1NDRmMjczMTRmMzhhNmM3ZmUxM2IxOTg2N2Q0YTQ3M2Y0OTljMDU0MjU3OA=='
export const AUTH_CLIENT_ID = 'caixuhuidev'
export const AUTH_CLIENT_SECRET = 'testAbc123$456'
// export const AUTH_CLIENT_ID = 'client'
// export const AUTH_CLIENT_SECRET = 'client'
// #ifdef APP-PLUS
const sangforVpn = uni.requireNativePlugin( 'Uni-SangforVPN' )
// #endif
export default function $http ( options ) {
  var requestUrl = _config.url
  if ( getApp().globalData.ignoreSvn ) {
    requestUrl = _config.puductUrl
  }
  console.log( 'requestUrl', requestUrl, options.url )
  // console.log('requestUrl', requestUrl, options.url)
  // _config.header['Authorization'] = uni.getStorageSync('access_token')
  if ( options && options.data && 'grant_type' in options.data ) {
    options.url = requestUrl + '/api/auth' + options.url;
    _config.header[ 'Authorization' ] = 'Basic ' + `${base64.Base64.btoa(`${AUTH_CLIENT_ID}:${AUTH_CLIENT_SECRET}`)}`
  } else if ( options.pgyer ) { // 蒲公英接口 
    options.url = _config.pgyerUrl + options.url
    _config.header[ 'Content-Type' ] = 'application/x-www-form-urlencoded; charset=UTF-8'
  } else {
    options.url = requestUrl + '/api' + options.url;
    _config.header[ 'Content-Type' ] = 'application/json;charset=utf-8'
    _config.header[ 'Authorization' ] = uni.getStorageSync( 'access_token' )
  }
  return new Promise( ( resolve, reject ) => {
    // 进行url字符串拼接
    // 拦截请求
    _config.complete = ( response ) => {
      //  request請求访问成功
      if ( response.statusCode === 200 ) {
        // 接口请求成功
        resolve( response.data );
      } else {
        console.log( '失败的requestUrl：', requestUrl, options.url )
        console.log('response', response)
        let platform = uni.getSystemInfoSync().platform
        let requestObj = {
          ip: uni.getStorageSync('userIp') || '',
          account: uni.getStorageSync('user_name_sub') || '',
          requestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          vpnStatus: '',
          vpnDeviceStatus: uni.getStorageSync('vpnDeviceStatus'),
          requestUrl: options.url,
          requestStatus: response.statusCode || '',
          errorMessage: response.data ? response.data.message : response.errMsg,
          platform: platform,
          remark: `'${JSON.stringify(response)}'`
        }
        console.log('response', `'${JSON.stringify(response)}'` )
        // vpn状态
        // #ifdef APP-PLUS
        sangforVpn.getStatus({}, function(result) {
          requestObj.vpnStatus = platform === 'ios' ? result : result.msg
          let requestArray = uni.getStorageSync('requestErrorRecord') || []
          requestArray.push(requestObj)
          uni.setStorageSync('requestErrorRecord', requestArray)
        })
        // #endif
        // console.log('requestArray', requestArray)
				// cumulativeErrorCount()
        // networkReconnect()
        // if (uni.getSystemInfoSync().platform === 'android') {
        //   networkCheck(options.url)
        // }
        // 处理catch 请求，不在本页面之外处理，统一在这里处理
        if ( options.handle ) {
          reject( response )
        } else {
          // if ( response.data && response.data.message && response.data.message === '身份校验异常,请重新登录!' ) {
          //   _page_error( 401, response, options )
          // }
          try {
            Promise.reject( response ).catch( err => {
              console.log( 'err', response )
              if ( response.data && response.data.message && response.data.message === '身份校验异常,请重新登录!' ) {
                _page_error( 401, response )
              }

              if ( 'statusCode' in response ) {
                _page_error( response.statusCode || response.errMsg, response, options );
              }
              // 服务检测使用
              if (options.serviceName) {
                reject({...response, ...{serviceName: options.serviceName}})
              } else {
                reject( response )
              }
            } );
          } catch ( e ) {
            uni.hideLoading()
            console.log( e )
          }
        }
      }

    }
    // 开始请求
    uni.request( Object.assign( {}, _config, options ) );
  } )
}
function openToast (title, duration = 2000) {
	uni.showToast({
		icon: 'none',
		title: title,
		duration: duration,
		position: 'top'
	})
}
function cumulativeErrorCount () {
	let failCount = uni.getStorageSync('failCount') || 0
	failCount++
	console.log('累计错误数', failCount)
	uni.setStorageSync('failCount', failCount)
	if (failCount >= 5) {
		uni.setStorageSync('reconnect', true)
		console.log('reconnect2', uni.getStorageSync('reconnect'))
	}
}
// 网络重连
// 废弃
function networkReconnect2 (flag) {
	getApp().globalData.ignoreSvn = false
	// #ifdef APP-PLUS
	sangforVpn.logout()
	// #endif
	let failCount = uni.getStorageSync('failCount') || 0
	if (!flag) {
		failCount++
		uni.setStorageSync('failCount', failCount)
		console.log('failCount', failCount)
	}
	if (failCount === 5) {
		console.log('重连中', flag)
		// !flag && notify({ message: '重连中...', type: 'warning', time: 2000})
		const vpn_address = 'https://vpn.iport.com.cn'
		let form = uni.getStorageSync('userForm')
		let username = LOGIN_PREFIX + form.username
		let password = crypto.enc.Base64.stringify(sha256(form.password))
		let time = 0
		var code = ''
		let Interval = setInterval(() => {
			time = time + 1
			console.log('time', time)
			if (time === 20) {
				uni.hideLoading()
				clearInterval(Interval)
			}
		}, 1000)
		sangforVpn.login({
			vpn_address,
			username,
			password
		}, (result) => {
			console.log('vpn返回结果', result)
			if (uni.getSystemInfoSync().platform === 'ios') {
				code = result.substr(result.length - 4)
			} else {
				code = result.code
			}
			clearInterval(Interval)
			if (result.code === 0 || result === 'success') {
				// notify({ message: '重连成功', type: 'success', time: 500 })
			} else {
				// 3次以上 重连失败
				let reConnectCount = uni.getStorageSync('reConnectCount') || 0
				reConnectCount++
				clearInterval(Interval)
				uni.setStorageSync('reConnectCount', reConnectCount)
				if (reConnectCount === 4) {
					// uni.setStorageSync('reConnectCount', 0)
					// uni.setStorageSync('failCount', 0)
					// notify({ message: '重连失败', type: 'error'})
				} else if (reConnectCount < 4) {
					console.log('重连次数：', reConnectCount)
					networkReconnect('reconnect')
				}
			}
		})
	 }
}
// 网络监测
function networkCheck (requestUrl) {
  let pages = getCurrentPages();
  let page = pages[ pages.length - 1 ]
  let isCheck = page.route === 'pages/check-net/index' || page.route === 'pages/login/index'
  if (isCheck) return false
  let failCount = uni.getStorageSync('failCount') || 0
  failCount++
  uni.setStorageSync('failCount', failCount)
  console.log('failCount', failCount)
  if (failCount === 5) {
    uni.showModal({
      title: '提示',
      content: '当前网络异常，是否检查网络？',
      success: function (res) {
        uni.setStorageSync('failCount', 0)
        if (res.confirm) {
          uni.reLaunch({
              url: `../check-net/index?requestUrl=${requestUrl}`
          })
        }
      }
    })
  }
}
// token过期，refresh_token继续请求
function _refreshAccessToken (options) {
  let config = { ..._config }
  let data = {
    grant_type: 'refresh_token',
    refresh_token: uni.getStorageSync( 'refresh_token' )
  }
  var requestUrl = _config.url
  if ( getApp().globalData.ignoreSvn ) {
    requestUrl = _config.puductUrl
  }
  let option = {
    url: requestUrl + '/api/auth' + '/oauth/token?grant_type=' + data[ 'grant_type' ] + '&refresh_token=' + data[
      'refresh_token' ],
    header: {
      'Authorization': 'Basic ' + `${base64.Base64.btoa(`${AUTH_CLIENT_ID}:${AUTH_CLIENT_SECRET}`)}`
    },
  }
  return new Promise( ( resolve, reject ) => {
    // 进行url字符串拼接
    // 拦截请求
    config.complete = ( response ) => {
      //  request請求访问成功
      if ( response.statusCode === 200 ) {
        // 接口请求成功,写入新的token,始终使用老refresh_token
        uni.setStorageSync( 'access_token', response.data.access_token)
        console.log('refreshAccessToken返回', response)
        uni.request({
          url: options.url,
          data: options.data,
          header: {
            Authorization: uni.getStorageSync( 'access_token' )
          },
          complete: (res) => {
            uni.setStorageSync('failCount', 0)
            console.log('再次请求', res)
          }
        })
        // uni.setStorageSync( 'refresh_token', response.refresh_token )
        resolve( response )
      } else {
        uni.setStorageSync('failCount', 0)
        // 请求失败清空token,返回首页
        reLoginModal()
      }
    }
    // 开始请求
    uni.request( Object.assign( {}, config, option ) )
  } )
}
// 接口錯誤
function _error ( err, msg = '' ) {
  switch ( err ) {
  case 400:

  }
}
function reLoginModal () {
  var pages = getCurrentPages();
  var page = pages[ pages.length - 1 ]
  let currentPage = page.route === 'pages/login/index'
  let count = uni.getStorageSync( 'authErrorCount' )
  if ( !count && !currentPage ) {
    uni.setStorageSync( 'authErrorCount', 1 )
    uni.showModal( {
      title: '提示',
      content: '身份校验异常,需重新登录!',
      success: function ( res ) {
        if ( res.confirm ) {
          uni.removeStorageSync( 'access_token' )
          uni.removeStorageSync( 'refresh_token' )
          uni.reLaunch( {
            url: '../../pages/login/index',
          } )
        }
        uni.setStorageSync( 'authErrorCount', 0 )
      }
    } )
    stomp.closeConnect()
  }
}
// request 錯誤
function _page_error ( err, response, options ) {
  console.log('options123', options)
  switch ( err ) {
  case 403:
    var pages = getCurrentPages();
    var page = pages[ pages.length - 1 ]
    uni.removeStorageSync( 'access_token' )
    /* 判断是不是在登录界面 是则提示,否则确定框 */
    console.log( 1111, response )
    if ( page.route === 'pages/login/index' ) {
      uni.showToast( {
        title: response.data.error_description || '登录异常，请重新登录',
        duration: 1000,
        icon: 'none'
      } )
    } else {
      uni.showModal( {
        title: '提示',
        content: '登录异常，请重新登录',
        success: function ( res ) {
          if ( res.confirm ) {
						uni.setStorageSync('loginOut', true)
            uni.reLaunch( {
              url: '../../pages/login/index',
            } )
          } else if ( res.cancel ) {}
        }
      } )
    }
    break;
  case 400:
    uni.hideLoading()
    uni.showToast( {
      title: response.data.error_description,
      duration: 1000,
      icon: 'none'
    } )
    break;
  case 401:
    uni.hideLoading()
    let failCount = uni.getStorageSync('failCount') || 0
    failCount++
    uni.setStorageSync('failCount', failCount)
    if (failCount === 1) {
      _refreshAccessToken(options)
    }
    // var pages = getCurrentPages();
    // var page = pages[ pages.length - 1 ]
    // let currentPage = page.route === 'pages/login/index'
    // let count = uni.getStorageSync( 'authErrorCount' )
    // if ( !count && !currentPage ) {
    //   uni.setStorageSync( 'authErrorCount', 1 )
    //   uni.showModal( {
    //     title: '提示',
    //     content: '身份校验异常,需重新登录!',
    //     success: function ( res ) {
    //       if ( res.confirm ) {
    //         uni.removeStorageSync( 'access_token' )
    //         uni.removeStorageSync( 'refresh_token' )
    //         uni.reLaunch( {
    //           url: '../../pages/login/index',
    //         } )
    //       }
    //       uni.setStorageSync( 'authErrorCount', 0 )
    //     }
    //   } )
    //   stomp.closeConnect()
    // }
    // 错误码404的处理方式
    // 通过refreshtoken获取新的token,成功则重新请求
   // if (!uni.getStorageSync('refresh_token')) {
   //   uni.hideLoading()
   //   uni.showToast({
   //    title: '登录信息已失效',
   //    duration: 1000,
   //    icon:'none'
   //   })
   //   setTimeout(() => {
   //     uni.reLaunch({
   //      url: '../../../pages/login/index',
   //     })
   //   }, 1000)
   //   return
   // }
   //  _refreshAccessToken().then(res => {
   //  	_config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('access_token')
   //  	// 成功重新请求
   //  	uni.request(Object.assign({}, _config, options))
   //  }).catch(e => {
   //       uni.hideLoading()
   //  	uni.showToast({
   //  		title: '登录信息已失效',
   //  		duration: 1000,
   //  		icon:'none'
   //  	})
   //       uni.reLaunch({
   //       	url: '../../../pages/login/index',
   //       })
   //  })
    break;
  case 404:
    // 错误码404的处理方式
    uni.showToast( {
      title: '没有找到页面',
      duration: 1000,
      icon: 'none'
    } )
    console.error( "没有找到页面" )
    break;
  case 405:
    uni.showToast( {
      title: '错误的请求',
      duration: 1000,
      icon: 'none'
    } )
    console.error( "错误的请求" )
    break;
  }
}
