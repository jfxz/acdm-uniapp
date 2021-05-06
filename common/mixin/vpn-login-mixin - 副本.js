import {
	LOGIN_PREFIX
} from '../../common/constants/login-prefix.js'
import stomp from '@/common/util/stomp-client.js'
import crypto from '@/common/util/crypto-js/crypto-js.js'
import sha256 from '@/common/util/crypto-js/sha256.js'
import {addLogBatch} from '@/api/log/index.js'
import {
	mapActions
} from 'vuex'
import {
	breathe
} from '../../api/imApi/admin.js'
import {
	getRoles
} from '@/api/cargo/index.js'
// import {
// 	validatenull
// } from '@/common/util/validate'
// #ifdef APP-PLUS
const sangforVpn = uni.requireNativePlugin('Uni-SangforVPN')
// #endif
export default {
	data() {
		return {
			initFlag: false,
			Interval: null,
			ignoreSvn: false,
			form: {
				username: '',
				password: ''
			}
		}
	},
	beforeDestroy() {
		// this.noticeTime && clearInterval(this.noticeTime)
	},
	methods: {
		...mapActions(['Login', 'setRolesInfo']),
		// VPN登录
		loginVPN(flag) {
			if (flag) {
				this.initFlag = true
			} else {
				this.initFlag = false
			}
			getApp().globalData.ignoreSvn = false
			// #ifdef APP-PLUS
			let that = this
			sangforVpn.logout()
			// #endif
      this.startVpnLogin(flag)
		},
		startVpnLogin(flag) {
			console.log('flag', flag)
			const vpn_address = 'https://vpn.iport.com.cn'
			this.form = uni.getStorageSync('userForm')
			let username = LOGIN_PREFIX + this.form.username
			let password = crypto.enc.Base64.stringify(sha256(this.form.password))
			let that = this
			!flag && this.$loading('重连中...')                       
        let time = 0
        let platform = uni.getSystemInfoSync().platform
        this.Interval = setInterval(() => {
          if (platform !== 'ios') {
            sangforVpn.getStatus({}, function(result) {
            	console.log('vpnStatus', result)
            	let status = platform === 'ios' ? result : result.msg
            	if (status === 'VPNONLINE') {
            		clearInterval(that.Interval)
            		getApp().globalData.ignoreSvn = false
            		uni.hideLoading()
                that.login(flag)
            	}
            })
          }
        	time = time + 1
        	console.log('time', time)
        	if (time === 20) {
        		uni.hideLoading()
        		clearInterval(this.Interval)
        		!flag && this.changeVpn('overtimeMix')
            if (flag) {
              this.computeReConnect(this)
            }
        	}
        }, 1000)
        let globaIgnoreSvn = getApp().globalData.ignoreSvn
        if (this.ignoreSvn || (globaIgnoreSvn !== undefined && globaIgnoreSvn)) {
        	this.login()
        	return
        }
        var isIos = false
        var code = '' // 状态码
        var message = '' // 错误信息
        console.log('form', vpn_address, username, password)
        sangforVpn.login({
        	vpn_address,
        	username,
        	password
        }, (result) => {
        	console.log('vpn返回结果', result)
        	that.Interval && clearInterval(that.Interval)
        	if (uni.getSystemInfoSync().platform === 'ios') {
        		code = result.substr(result.length - 4)
        		message = result.split(',')[0]
        		if (code === '2005' || code === '2003') {
        			code = result.substr(result.length - 4)
        			isIos = true
        		}
        	} else {
        		code = result.code
        		message = result.msg
        	}
        	if (result.code === 0 || result === 'success') {
        		uni.setStorageSync('ignoreSvn', false)
        		getApp().globalData.ignoreSvn = false
            setTimeout(() => {
              that.login(flag)
            }, 2000)
        	} else if (flag) {
            that.computeReConnect(that)
        	} else if (isIos || result.code === 2001 || result.code === 2003) {
        		that.$message(`${message}[${code}]`)
        		uni.hideLoading()
        		that.changeVpn(code)
        	} else {
        		that.$message(`${message}[${code}]`)
        		uni.hideLoading()
        	}
        })
			
		},
    computeReConnect (that) {
      let reConnectCount = uni.getStorageSync('reConnectCount') || 0
      reConnectCount++
      uni.setStorageSync('reConnectCount', reConnectCount)
      console.log('重连次数', reConnectCount)
      uni.showToast({
        title: '重连中...',
        icon: 'none',
        position: 'top',
        duration: 2000
      })
      if (reConnectCount === 6) {
      	uni.setStorageSync('reConnectCount', 0)
        uni.hideToast()
      	that.$message(`重连失败！[${code}]`, 'none', 'top', 10000)
      } else {
        that.loginVPN('reConnect')
      }
    },
		changeVpn(code) {
			let that = this
			uni.showModal({
				title: '提示',
				content: `当前网络连接vpn失败，是否切换到域名访问？[${code}]`,
				// itemList: ['取消',]
				success: function(res) {
					if (res.confirm) {
						that.$message('已切换到域名访问')
						that.ignoreSvn = true
						getApp().globalData.ignoreSvn = true
						uni.setStorageSync('ignoreSvn', true)
						that.login()
					} else if (res.cancel) {
						that.$message('已取消')
						that.ignoreSvn = false
						uni.setStorageSync('ignoreSvn', false)
						getApp().globalData.ignoreSvn = false
						uni.reLaunch({
							url: '../../pages/login/index'
						})
					}
				}
			})
		},
		login(flag) {
			this.$loading()
			this.Interval && clearInterval(this.Interval)
			let form = {
				username: this.form.username,
				password: encodeURIComponent(crypto.enc.Base64.stringify(sha256(this.form.password))),
				grant_type: 'password'
			}
			this.Login(form).then(res => {
				if (res) {
          console.log('res', res)
					let userId = res.userId
					clearInterval(this.Interval)
					this.getData()
					this.timer = setInterval(() => {
						this.getData()
					}, 60000)
					let that = this
					getRoles({
						userId: userId
					}).then(res => {
						if (res.status && res.data) {
							uni.setStorageSync('roles_info', res.data)
						} else {
							uni.setStorageSync('roles_info', [])
						}
					}).catch(err => {
						uni.setStorageSync('roles_info', [])
						console.log('getRoles-err', err)
					})
					// 登录成功获取数据字典
					this.$store.dispatch('GetRemoteDicAll').then(res => {
						console.log('获取数据字典成功！', flag)
						uni.setStorageSync('reConnectCount', 0)

            flag && uni.hideToast()
            flag && this.$message(`重连成功`, 'none', 'top', 10000)
            let requestArray = uni.getStorageSync('requestErrorRecord') || []
            if (requestArray.length > 0) {
              addLogBatch(requestArray).then(res => {
                console.log('日志上传成功', res)
                if (res.status) {
                  uni.setStorageSync('requestErrorRecord', [])
                  console.log('requestErrorRecord', uni.getStorageSync('requestErrorRecord'))
                }
              })
            }
						this.initFlag = false
						uni.hideLoading()
						this.baseVipCodeList = this.$store.getters.remoteDic.BASE_VIP_CODE
						this.baseFlightStatusList = this.$store.getters.remoteDic.BASE_FLIGHT_STATUS
						let airportCode = uni.getStorageSync('userAirport')
						// this.$store.dispatch('getActivityDiff')
						// this.$store.dispatch('setAllFlight')
						// this.$store.dispatch('setFollowList')
						this.vpnLogin = false
            // 关闭定时检测
            if (getApp().globalData.checkInterval) {
              clearInterval(getApp().globalData.checkInterval)
            }
						this.checkVpn()
					})
				}
			}).catch((res) => {
				console.log('getErr', res)
				if (!res.data) {
					this.$message('网络异常，请检查网络后重试')
					setTimeout(() => {
						uni.hideLoading()
						uni.reLaunch({
							url: '../../pages/login/index'
						})
					}, 1000)
				}
			})
		},
		checkVpn () {
      uni.request({
        url: 'http://www.net.cn/static/customercare/yourip.asp',
        success: res => {
          const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
          let ip = reg.exec(res.data) || []
          uni.setStorageSync('userIp', ip[0] || '')
        }
      })
      let requestErrorRecord = uni.getStorageSync('requestErrorRecord') || []
      if (requestErrorRecord && requestErrorRecord.length > 0) {
        
      }
			let pages = getCurrentPages();
			let page = pages[ pages.length - 1 ]
			let platform = uni.getSystemInfoSync().platform
			let that = this
			// vpn状态判断&重连操作
			let globaIgnoreSvn = getApp().globalData.ignoreSvn
			if (this.ignoreSvn || (globaIgnoreSvn !== undefined && globaIgnoreSvn)) {
				return
			}
      // #ifdef APP-PLUS
      let vpnCheckTimer = setInterval(() => {
        getApp().globalData.checkInterval = vpnCheckTimer
      	if (page.route === 'pages/login/index') {
      		this.initFlag = true
      		clearInterval(vpnCheckTimer)
      	}
      	console.log('initFlag', this.initFlag)
      	if (!this.initFlag && !uni.getStorageSync('loginOut')) {
      		sangforVpn.getStatus({}, function(result) {
      			let status = platform === 'ios' ? result : result.msg
      			console.log('mixresult', status)
      			if (status !== 'VPNONLINE') {
              uni.showToast({
                title: '重连中...',
                icon: 'none',
                position: 'top',
                duration: 15000
              })
      				// that.$message('重连中...', 'none', 'top', 15000)
      				that.loginVPN('reConnect')
      			}
      		})
      	}
      }, 3000)
      // #endif
		}
	}
}
