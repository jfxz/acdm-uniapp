<template>
  <view>
    <view class="navbar">
      <view class="nav-handle-left">
        <view class="handle-type"><image src="../../static/home2x.png" @tap="openAcdmHome"></image></view>
        <view class="handle-type"></view>
        <view class="handle-type"></view>
      </view>
      <view class="nav-title">
        <text>{{ '我的' }}</text>
      </view>
      <view class="nav-handle-right"></view>
    </view>

    <view class="header">
      <view class="bg">
        <view class="box">
          <view class="box-hd">
            <view class="avator"><image src="../../static/ic_launcher.png" mode="aspectFit"></image></view>
            <view class="phone-number">{{ user.userName || '' }}</view>
          </view>
          <view class="box-bd cnabbr2w" v-if="user.userAirport && user.userAirport[0]">{{ user.userAirport ? user.userAirport[0].cnabbr2w : '' }}</view>
        </view>
      </view>
    </view>
    <view class="list-content">
      <view class="list">
        <view class="li" @tap="jump('edit-password')">
          <view class="icon"><image src="../../static/ic_change_password.png"></image></view>
          <view class="text">修改密码</view>
          <image class="to" src="../../static/to.png"></image>
        </view>
        <view class="li " @tap="jump('updata')">
          <view class="icon"><image src="../../static/ic_up.png"></image></view>
          <view class="text">检查更新</view>
          <image class="to" src="../../static/to.png"></image>
        </view>

        <view class="li " @tap="jump('mq')">
          <view class="icon"><image src="../../static/ic_check.png"></image></view>
          <view class="text">消息状态检测</view>
          <image class="to" src="../../static/to.png"></image>
        </view>
				
				<view class="li " @tap="jump('net')">
				  <view class="icon"><image src="../../static/netCheck.png"></image></view>
				  <view class="text">网络状态检测</view>
				  <image class="to" src="../../static/to.png"></image>
				</view>
				
        <view class="li " @tap="jump('ip')">
          <view class="icon"><image src="../../static/ip.png"></image></view>
          <view class="text">本机IP</view>
          <image class="to" src="../../static/to.png"></image>
        </view>
        <view class="li " @tap="jump('auth-setting')">
          <view class="icon"><image src="../../static/finger.png"></image></view>
          <view class="text">面容/指纹设置</view>
          <image class="to" src="../../static/to.png"></image>
        </view>
      </view>
      <view class="list">
        <view class="li noborder" @tap="loginOut">
          <view class="icon"><image src="../../static/ic_logout.png"></image></view>
          <view class="text">登出</view>
          <image class="to" src="../../static/to.png"></image>
        </view>
      </view>
    </view>
    <view class="vision">
      <text>当前版本：</text>
      <text>{{ currenVersion }}</text>
    </view>
    <tui-modal :show="modal" @click="handleClick" title="提示" content="当前有新版本,是否立即下载?"></tui-modal>
  </view>
</template>
<script>
import { getVersion } from '../../api/version/index.js'
import tuiModal from '@/components/modal.vue'
import { mapGetters } from 'vuex'
import stomp from '@/common/util/stomp-client.js'
import { exitLogin } from '../../api/imApi/admin.js'
export default {
  components: { tuiModal },
  data() {
    return {
      currenVersion: '',
      userIp: '',
      modal: false,
      newCurrenVersion: ''
    }
  },
  computed: {
    ...mapGetters(['user', 'userInfo'])
  },
  onLoad() {
    console.log('user111', this.user)
    console.log('userInfo111', this.userInfo)
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
      that.currenVersion = inf.version
    })
    // #endif
    if (!uni.getStorageSync('isIdentDisable')) {
      uni.setStorageSync('isIdentDisable', false)
    }
    console.log(222, this.user, this.userInfo)
    var that = this
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
      that.currenVersion = inf.version
      console.log('currenVersion', that.currenVersion)
    })
    // #endif
  },
  methods: {
    // 跳转到主页
    openAcdmHome() {
      uni.reLaunch({
        url: '../home/index'
      })
    },
    loginOut() {
			uni.setStorageSync('loginOut', true)
      this.$loading('登出中...')
      console.log('loginId', this.userInfo.loginId)
			if (!this.userInfo.loginId) {
				this.clearInfo()
				return
			}
      exitLogin(this.userInfo.loginId)
        .then(res => {
          if (res.status) {
            // 清除消息、用户缓存
            console.log()
            this.clearInfo()
          }
					getApp().globalData.ignoreSvn = false
        })
        .catch(() => {
          this.clearInfo()
					getApp().globalData.ignoreSvn = false
        })
    },
    clearInfo() {
      try {
        stomp.closeConnect()
      } catch (err) {
        console.log('mq未连接', err)
      }
      getApp().globalData.ignoreSvn = false
      uni.hideLoading()
      // 清除消息、用户缓存
      uni.removeStorageSync('access_token')
      uni.removeStorageSync('refresh_token')
      uni.reLaunch({
        url: '../login/index'
      })
    },
    jump(path) {
      if (path === 'ip') {
        let userIp = uni.getStorageSync('userIp') || ''
        console.log('userIp', userIp)
        if (userIp) {
          this.$message('当前ip为：' + userIp)
          // #ifdef APP-PLUS
          let that = this
          setTimeout(() => {
            uni.setClipboardData({
              data: userIp,
              success: function () {
                that.$message('已复制ip')
              }
            })
          }, 2000)
          // #endif
        } else {
          this.$message('ip未获取成功')
        }
      } else if (path === 'updata') {
        this.judgeVersion().then(res => {
          if (!this.modal) {
            this.$message('当前版本为最新版本')
          }
        })
      } else if (path === 'mq') {
        let mqStatus = uni.getStorageSync('mq-status')
        this.$message(!mqStatus ? '连接失败' : '已连接成功')
      } else if (path === 'net') {
				uni.navigateTo({
					url: '../check-net/index'
				})
			} else {
        uni.navigateTo({
          url: `${path}`
        })
      }
    },
    judgeVersion() {
      let appKey = '6bfa7b4a656a9a1c27bc9d6e5024d266'
      if (uni.getSystemInfoSync().platform === 'ios') {
        appKey = 'e96a95104909b65c72696183f3bab89b'
      }
      let para = {
        _api_key: '85244a596b323908ea22e8a7d46ab1af',
        appKey: appKey
      }
      // let appKey = '3e413f2213686295d7fa378d1e5960e4'
      // if (uni.getSystemInfoSync().platform === 'ios') {
      //   appKey = 'f0078cddc0442a39709990da236ae6a9'
      // }
      // let para = {
      //   _api_key: '10d385b2e31a02249a3ffc11d51027c9',
      //   appKey: appKey
      // }
      return new Promise((resolve, reject) => {
        getVersion(para).then(res => {
          console.log(33, res)
          this.newCurrenVersion = res.data.buildVersion
          console.log(222, this.newCurrenVersion, this.currenVersion)
          if (this.newCurrenVersion !== this.currenVersion) {
            getApp().globalData.buildUpdateDescription = res.data.buildUpdateDescription
            this.modal = true
          }
          resolve()
        })
      })
    },
    handleClick(e) {
      if (e.index === 1) {
        if (uni.getSystemInfoSync().platform === 'ios') {
          plus.runtime.openURL('https://www.pgyer.com/DFVr')
        } else {
          uni.navigateTo({
            url: `/pages/login/update?newCurrenVersion=${this.newCurrenVersion}`
          })
        }
      } else {
        this.$message('您取消了更新')
      }
      this.modal = false
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #f1f1f1;
  font-size: 30upx;
}
.vision {
  position: fixed;
  bottom: 20rpx;
  width: calc(100% - 60rpx);
  text-align: center;
}
.navbar {
  display: flex;
  justify-content: space-between;
  height: calc(var(--status-bar-height) + 45px);
  background: #1891ff;
  padding-top: calc(var(--status-bar-height) + 25rpx);
  width: 100%;
  z-index: 10;
  // position: fixed;
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
.header {
  background: #fff;
  height: 290upx;
  padding-bottom: 110upx;
  .bg {
    width: 100%;
    height: 200upx;
    padding-top: 100upx;
    background-color: #1891ff;
  }
}
.box {
  width: 650upx;
  height: 180upx;
  border-radius: 20upx;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 5upx 20upx 0upx rgba(0, 0, 150, 0.2);
  .box-hd {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    .avator {
      width: 160upx;
      height: 160upx;
      background: #fff;
      border: 5upx solid #fff;
      border-radius: 50%;
      margin-top: -80upx;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .phone-number {
      width: 100%;
      text-align: center;
    }
  }
  .box-bd {
    // width: 83rpx;
    height: 33rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    // font-size: 24rpx;
    color: #258bfc;
    text-align: center;
    &.cnabbr2w {
      width: 100rpx;
      height: 50rpx;
      border-radius: 30rpx;
      background: #0081ff;
      margin: 5rpx auto;
      line-height: 50rpx;
      color: #ffffff;
    }
  }
}
.list-content {
  background: #fff;
}
.list {
  width: 100%;
  border-bottom: 15upx solid #f1f1f1;
  background: #fff;
  &:last-child {
    border: none;
  }
  .li {
    height: 100upx;
    padding: 0 4%;
    border-bottom: 1px solid rgb(243, 243, 243);
    display: flex;
    align-items: center;
    &.noborder {
      border-bottom: 0;
    }
    .icon {
      flex-shrink: 0;
      width: 50upx;
      height: 50upx;
      image {
        width: 50upx;
        height: 50upx;
      }
    }
    .text {
      padding-left: 20upx;
      width: 100%;
      color: #666;
    }
    .to {
      flex-shrink: 0;
      width: 40upx;
      height: 40upx;
    }
  }
}
</style>
