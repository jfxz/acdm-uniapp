import crypto from '@/common/util/crypto-js/crypto-js.js'
import sha256 from '@/common/util/crypto-js/sha256.js'
import {LOGIN_PREFIX} from '../common/constants/login-prefix.js'
import base64 from '../common/util/crypto-js/base64.js'
import eventVue from '../common/util/eventVue.js'
// #ifdef APP-PLUS
 const sangforVpn = uni.requireNativePlugin('Uni-SangforVPN')
  // #endif
//  http 请求配置项
export default {
    //	开发者服务器接口地址
    // url: 'http://10.1.16.49:9094',
    
    // 后端地址
    // url: 'http://172.168.2.10:9002',
    
    // 测试容器
    url: 'http://10.0.40.40:8000', // 测试
    puductUrl: 'http://10.0.40.40:8000',
    
    // 测试
    // url: 'http://10.1.16.62:9093', // 测试
    // puductUrl: 'http://10.1.16.62:9093',
    
    // 生产
    // puductUrl: 'http://ac01.iport.com.cn:9094', // 生产应急
    // url: 'http://192.168.51.147:9094', // 生产vpn
    
    // 外网
    // puductUrl: 'http://ac01.iport.com.cn:9094', // 生产应急
    // url: 'http://ac01.iport.com.cn:9094', // 生产vpn
    // 旭辉测试
    // puductUrl: 'http://ac01.iport.com.cn:8000', // 生产应急
    // url: 'http://192.168.51.147:8000', // 生产vpn
    
    pgyerUrl: 'http://www.pgyer.com/apiv2/app',
		
    //	请求的参数	
    data: {},
    //	设置请求的 header，header 中不能设置 Referer。
    header: {
    },
    //	（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT	
    method: "POST",
    //	json	如果设为json，会尝试对返回的数据做一次 JSON.parse	
    dataType: "json",
    //	text	设置响应的数据类型。合法值：text、arraybuffer	1.7.0
    responseType: "text",
    //	收到开发者服务成功返回的回调函数	
    success() {},
    //	接口调用失败的回调函数	
    fail(err) {
      console.log('请求失败')
      // networkCheck()
      // let failCount = uni.getStorageSync('failCount')
      // failCount++
      // if (uni.getSystemInfoSync().platform === 'android') {
      //   sangforVpn.getStatus({},function(result){
      //     if (result.msg !== 'VPNONLINE') { // vpn离线或者其他情况
      //       connectFail()
      //     }
      //       console.log('result111111', result)
      //   })
      // }
			// console.log('requesterr', err)
   //    
   // let failCount = uni.getStorageSync('failCount')
   //    var pages = getCurrentPages();
   //    var page = pages[pages.length - 1]
			// console.log('page', page.route)
			// console.log('failCount', failCount)
   //    if (!failCount) {
   //      uni.setStorageSync('failCount', 1)
   //    } else if (failCount === 5 && page.route !== 'pages/login/index') {
   //      reConnectVpn(page.route)
   //      uni.setStorageSync('failCount', failCount + 1)
   //    } else {
   //      uni.setStorageSync('failCount', failCount + 1)
   //    }
   //    uni.hideLoading()
    },
    //	接口调用结束的回调函数（调用成功、失败都会执行）
    complete() {},
}
function connectFail () {
  
}

function networkCheck () {
  let failCount = uni.getStorageSync('failCount') || 0
  failCount++
  uni.setStorageSync('failCount', failCount)
  console.log('failCount', failCount)
  if (failCount === 5) {
    uni.showModal({
      title: '提示',
      content: '当前网络异常，是否检查网络？',
      success: function (res) {
        if (res.confirm) {
          uni.navigateTo({
              url: '../check-net/index'
          })
        }
      }
    })
    setTimeout(() => {
      console.log('已经重置为0')
       uni.setStorageSync('failCount', 0)
    }, 5000)
  }
}

function reConnectVpn (path) {
	// #ifdef APP-PLUS
	sangforVpn.logout()
	let localUser = uni.getStorageSync('userForm')
	let form = {...localUser}
	const vpn_address = 'https://vpn.iport.com.cn'
	let username = LOGIN_PREFIX + form.username
	let password = crypto.enc.Base64.stringify(sha256(form.password))
	uni.showLoading({title: '重连中...'})
  let time = 0
  let Interval = setInterval(() => {
    time = time + 1
    if (time >= 30 && uni.setStorageSync('failCount') !== 0) {
      uni.showToast({
        title: 'vpn连接超时',
        icon: 'none'
      })
      connectFail()
      clearInterval(Interval)
    }
  }, 1000)
  var isIos = false
	sangforVpn.login({vpn_address,username,password}, (result) => {
	  console.log('vpn返回结果', result)
    if (uni.getSystemInfoSync().platform === 'ios') {
      let matchCode = result.search('2005')
      if (matchCode >= 0) {
        isIos = true
      }
    }
	  if (result.code === 0 || result === 'success') {
      uni.setStorageSync('ignoreSvn', false)
      getApp().globalData.ignoreSvn = false
	    // uni.showToast({
	    //     title: '重连成功',
	    //     duration: 2000
	    // })
			uni.setStorageSync('failCount', 0)
			let pathName = path.split('/')
			console.log('pathName', pathName)
			eventVue.$emit('reflash', pathName[1])
			// console.log('vpnroute', path, path.replace(/pages/, '../../../pages'))
			// uni.reLaunch({
			//     url: path.replace(/pages/, '../../../pages')
			// })
	  } else if (isIos || result.code === 2001) {
			uni.showToast({
			    title: result.msg || result,
			    duration: 2000,
					icon: 'none'
			})
	    uni.hideLoading()
	    uni.showModal({
	        title: '提示',
	        content: `当前网络连接vpn失败，是否切换到域名访问？[${code}]`,
	        // itemList: ['取消',]
	        success: function (res) {
	            if (res.confirm) {
	              getApp().globalData.ignoreSvn = true
                uni.setStorageSync('ignoreSvn', true)
	            } else if (res.cancel) {
	              getApp().globalData.ignoreSvn = false
                uni.setStorageSync('ignoreSvn', false)
	            }
              uni.reLaunch({
                 url: '../login/index'
              })
	        }
	    })
	  } else {
      // #ifdef APP-PLUS
      sangforVpn.logout()
      // #endif
	    uni.showToast({
	        title: result.msg || result,
	        duration: 2000,
	    		icon: 'none'
	    })
      connectFail()
	    uni.hideLoading()
	  }
	})
	// #endif
}