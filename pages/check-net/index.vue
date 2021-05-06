/*
*  界面名称: 检查网络，从api-config.js里面来的
*  界面功能: 排查用户网络问题原因 vpn、网关、接口等方面
*  其他      
*  时间      2020-12-18 09:06:12
*  作者      zql
 */
<template>
  <view class="check-layout">
    <!-- 顶部标题及回退home -->
    <view class="navbar">
      <view class="nav-handle-left">
        <view class="handle-type"><image src="../../static/home2x.png" @tap="openAcdmHome"></image></view>
        <view class="handle-type"></view>
        <view class="handle-type"></view>
      </view>
      <view class="nav-title">
        <text>{{ '网络检测' }}</text>
      </view>
      <view class="nav-handle-right"></view>
    </view>
    <view class="check-contend">
      <!-- 步骤条 -->
      <view class="contend">
        <tui-steps
          :titleSize="33"
          :descSize="30"
          direction="column"
          deactiveColor="#c0c0c0"
          activeColor="#19be6b"
          :items="items"
          :activeSteps="activeSteps"
        ></tui-steps>
      </view>
      <view class="result">
        <text class="result-label">检测结果：</text>
        <text class="result-value" :style="{ color: activeSteps === 2 ? '#19be6b' : '#fa3534' }">{{ computeResult }}</text>
      </view>
      <view class="btn">
        <u-button type="primary" @tap="reCheck">重新检测</u-button>
        <u-button type="success" @tap="reLogin">重新登录</u-button>
      </view>
    </view>
    
  </view>
</template>

<script>
import { getUserMsg, getUserAirport } from '@/api/user/index.js'
import tuiSteps from '@/components/thorui/tui-steps/tui-steps'
// import * as serviceAjaxObj from '@/api/checkNet/index.js'
import {checkNet} from '@/api/checkNet/index.js'
import crypto from '@/common/util/crypto-js/crypto-js.js'
import sha256 from '@/common/util/crypto-js/sha256.js'
import { LOGIN_PREFIX } from '@/common/constants/login-prefix.js'
// import { getUserRole, getFlightNatur, getAirportNoticeClose, 
// getRunwayEven, breathe, getOperatedHistory } from '@/api/user/index.js'
// #ifdef APP-PLUS
const sangforVpn = uni.requireNativePlugin('Uni-SangforVPN')
// #endif
export default {
  components: {
    tuiSteps
  },
  data () {
    return {
      result: '',
      netType: '',
      items: [
        {
          title: '当前网络环境检测',
          desc: ''
        },
        {
          title: 'VPN状态',
          desc: ''
        },
        {
          title: '后台服务状态',
          desc: ''
        }
      ],
      Interval: null,
      activeSteps: -1
    }
  },
  computed: {
    computeResult () {
      if (this.activeSteps === 2) {
        return '检测所有状态正常'
      }
      return this.result
    }
  },
  beforeDestroy () {
		uni.hideLoading()
    this.Interval && clearInterval(this.Interval)
  },
  onLoad (params) {
    // this.allServiceCheck()
    console.log('params', params)
  },
  onReady () {
    this.checkNowNetwork()
  },
  methods: {
    // 跳转到主页
    openAcdmHome () {
      uni.reLaunch({
        url: '../home/index'
      })
    },
    // 重新检查
    reCheck () {
      this.activeSteps = -1
      this.result = ''
      this.items[0].desc = ''
      this.items[1].desc = ''
      this.items[2].desc = ''
      this.checkNowNetwork()
    },
    // 重登
    reLogin () {
			uni.setStorageSync('loginOut', true)
      uni.reLaunch({
        url: '../login/index'
      })
    },
    // ios单独vpn检测
    iosVpnCheck () {
      sangforVpn.logout()
      var code = '' // 状态码
      var message = '' // 错误信息
      let that = this
      const vpn_address = 'https://vpn.iport.com.cn'
      let authForm = uni.getStorageSync('userForm')
      let username = LOGIN_PREFIX + authForm.username
      let password = crypto.enc.Base64.stringify(sha256(authForm.password))
      sangforVpn.login(
        {
          vpn_address,
          username,
          password
        },
        result => {
          console.log('vpn返回结果', result)
          code = result.substr(result.length - 4)
          message = result.split(',')[0]
          if (result.code === 0 || result === 'success') {
            that.activeSteps = 1
            that.items[1].desc = '在线'
            setTimeout(() => {
              uni.hideLoading()
              that.allServiceCheck()
            }, 1000)
          } else {
            that.items[1].desc = '离线'
            that.result = `vpn离线：${message}[${code}]`
            uni.hideLoading()
          }
        }
      )
    },
    // 是否连上网络
    checkNowNetwork () {
      this.$loading('网络环境检测中...')
      let that = this
      uni.getNetworkType({
        success: function (res) {
          that.netType = res.networkType
          console.log('netType', that.netType)
          setTimeout(() => {
            if (that.netType === 'none') {
              that.result = '无网络'
              that.items[0].desc = '异常'
              uni.hideLoading()
            } else {
              uni.request({
                url: 'https://www.baidu.com',
                complete: (res => {
                   console.log('res', res)
                  if (res.statusCode === 200) {
                    that.items[0].desc = '正常'
                    that.activeSteps = 0
                    uni.hideLoading()
                    that.checkVpnStatus()
                  } else {
                    that.items[0].desc = '异常'
                    that.result = '网络状态不佳'
                    uni.hideLoading()
                  }
                })
              })
            }
          }, 1000)
        }
      })
    },
    // 第一步：vpn状态监测 状态值：0
    checkVpnStatus () {
      this.$loading('vpn状态检测中...')
      let that = this
      let platform = uni.getSystemInfoSync().platform
      let time = 0
      that.Interval = null
      setTimeout(() => {
        that.Interval = setInterval(() => {
          time = time + 1
          console.log('time', time)
          if (time === 20) {
            clearInterval(that.Interval)
            uni.hideLoading()
            that.items[1].desc = '离线'
            that.result = `vpn离线: 连接超时`
          }
          if (platform !== 'ios') {
            sangforVpn.getStatus({}, function (result) {
              console.log('vpnStatus', result)
              let status = platform === 'ios' ? result : result.msg
              if (status === 'VPNONLINE') {
                clearInterval(that.Interval)
                that.activeSteps = 1
                that.items[1].desc = '在线'
                setTimeout(() => {
                  uni.hideLoading()
                  that.allServiceCheck()
                }, 1000)
              }
            })
          }
        }, 1000)
        sangforVpn.getStatus({}, function(result) {
          try {
            console.log('vpnStatus', result)
            let status = platform === 'android' ? result.msg : result
            if (status === 'VPNONLINE') {
              // 安卓 vpn离线或者其他情况（l3vpn）
              that.activeSteps = 1
              that.items[1].desc = '在线'
              clearInterval(that.Interval)
              setTimeout(() => {
                uni.hideLoading()
                that.allServiceCheck()
              }, 1000)
            } else if (platform === 'ios') {
              that.iosVpnCheck()
              // that.items[1].desc = '异常'
              // that.result = 'vpn离线'
            }
          } catch {
            clearInterval(that.Interval)
            uni.hideLoading()
            that.items[1].desc = '异常'
            that.result = 'vpn离线'
          }
        })
      }, 1000)
    },
    // 第三步：接口监测 状态值：2
    allServiceCheck () {
      this.$loading('后台服务检测中...')
      checkNet().then(res => {
        if (res) {
          this.items[2].desc = '正常'
          this.activeSteps = 2
        } else {
          this.items[2].desc = '请求失败'
        }
        setTimeout(() => {
          uni.hideLoading()
        }, 1000)
      }).catch(err => {
        this.items[2].desc = '请求失败'
        this.result = '后台服务请求超时'
        setTimeout(() => {
          uni.hideLoading()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss">
.check-layout {
  .navbar {
    display: flex;
    justify-content: space-between;
    height: calc(var(--status-bar-height) + 45px);
    background: #1891ff;
    padding-top: calc(var(--status-bar-height) + 25rpx);
    width: 100%;
    z-index: 10;
    position: fixed;
    top: 0;
    text-align: center;
  
    .nav-handle-left {
      display: flex;
      justify-content: space-around;
      width: 30%;
      padding-top: 2rpx;
  
      .handle-type {
        image {
          width: 45rpx;
          height: 45rpx;
        }
      }
    }
  
    .nav-title {
      width: 40%;
      font-size: 38rpx;
      line-height: 50rpx;
      color: #ffffff;
    }
  
    .nav-handle-right {
      width: 30%;
    }
  }
  .result {
    margin: 50rpx 0;
    .result-label {
      font-size: 36rpx;
    }
    .result-value {
      font-size: 36rpx;
    }
  }
  .btn {
    display: flex;
    justify-content: space-around;
  }
  .check-contend {
    padding: 30rpx;
    position: relative;
    top: calc(var(--status-bar-height) + 100rpx);
  }
}
</style>
