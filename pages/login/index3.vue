<template>
  <view class="login-layout-tablet">
    <view class="login-logo">
      <image src="../../static/A-CDM.png" mode="aspectFit"></image>
    </view>
    <view class="form-input">
      <view class="username-form">
        <image class="username-img" src="../../static/account.png" mode="aspectFit"></image>
        <input type="text" placeholder="请输入您的账号" @blur="nameBlur" v-model="form.username" />
      </view>
    
      <view class="password-form">
        <image class="username-img" src="../../static/password.png" mode="aspectFit"></image>
        <input type="text" :password="!seeFlag" placeholder="请输入您的密码" @blur="passwordBlur" v-model="form.password" />
        <image class="see-img" v-if="seeFlag" @tap="seePassword()" src="../../static/password-see.png" mode="aspectFit"></image>
        <image class="see-img" v-else @tap="seePassword()" src="../../static/password-not-see.png" mode="aspectFit"></image>
      </view>
    </view>
    
    <view class="login-btn">
      <!-- #ifdef MP || H5-->
      <button @tap="login">登录</button>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <button @tap="loginVPN('manual')">登录</button>
      <!-- #endif -->
    </view>
    <view class="ident-class">
      <text>指纹/面容登录</text>
      <u-switch @change="switchChange" size="20" v-model="checked" @tap="identTap" :disabled="judgeIdent"></u-switch>
    </view>
    <view class="vision">
      <view class="vision-msg">
        <text>当前版本：</text>
        <text>{{ currenVersion }}</text>
      </view>
      <view class="appDownload" @tap="appDownload">扫码下载</view>
      <view class="cu-modal" :class="imageModal ? 'show' : ''" @tap="hideModal">
        <view class="cu-dialog" @tap.stop="">
          <view class="cu-bar bg-white justify-end">
            <view class="content">app扫码下载</view>
            <view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
          </view>
          <view class="padding-xl"><image src="../../static/app.png" mode="aspectFit"></image></view>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script>
import { breathe } from '../../api/imApi/admin.js'
// import {WebSocket} from '../../common/util/websocket-uni'
import { mapActions } from 'vuex'
import https from '../../config/api-interface.js'
import { loginByUsername } from '../../api/login/index.js'
// import tokenMixin from '../../common/mixin/mixin.js'
import tuiModal from '@/components/modal.vue'
import crypto from '@/common/util/crypto-js/crypto-js.js'
import sha256 from '@/common/util/crypto-js/sha256.js'
import { getVersion } from '../../api/version/index.js'
import { ident } from '../../common/util/identification.js'
import eventVue from '../../common/util/eventVue.js'
// import { sha256 as vpnSha256} from 'js-sha256';
import { LOGIN_PREFIX } from '../../common/constants/login-prefix.js'
import { getRoles } from '@/api/cargo/index.js'
import {addLogBatch} from '@/api/log/index.js'
// import {checkNet} from '@/api/checkNet/index.js'

// import stomp from '@/common/util/stomp-client.js'
// #ifdef APP-PLUS
const sangforVpn = uni.requireNativePlugin('Uni-SangforVPN')
// #endif

export default {
  // mixins: [tokenMixin],
  components: {
    tuiModal
  },
  data () {
    return {
      checked: false,
      imageModal: false,
      Interval: null,
      ignoreSvn: false,
      currenVersion: '',
      newCurrenVersion: '',
      modal: false,
      forgetHeight: '',
      seeFlag: false,
      form: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    judgeIdent () {
      let isIdentDisable = uni.getStorageSync('isIdentDisable')
      if (isIdentDisable) {
        return false
      }
      return true
    }
  },
  beforeDestroy () {},
  // 如果存有账号密码，并且没有token 则进行生物识别
  onLoad (data) {
    // checkNet().then(res => {
    //   console.log(res)
    // })
    // let options = { cover: false, sound: 'system', title: 'ACDM' }
    // let content = '航班号：SC8131航班状态变更为【即将出港】，请注意!'
    // plus.push.createMessage( content, 'followFlight', options )
    // uni.vibrate({}) // 震动
    uni.setStorageSync('failCount', 0)
    // #ifdef APP-PLUS
    sangforVpn.logout()
    // #endif
    uni.hideLoading()
    console.log('ulr')
    // this.loginVPN()
    eventVue.$on('login', () => {
      // #ifdef MP
      this.login()
      // #endif
      // #ifdef APP-PLUS
      this.loginVPN('ident')
      // #endif
    })
    // #ifdef MP
    this.ignoreSvn = true
    uni.setStorageSync('ignoreSvn', false)
    // #endif
    this.loginInit()
  },
  onReady () {
    var that = this
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function (inf) {
      that.currenVersion = inf.version
    })
    // #endif
  },
  onShow () {
    // 关闭定时检测
    if (getApp().globalData.checkInterval) {
      clearInterval(getApp().globalData.checkInterval)
    }
    // #ifdef APP-PLUS
    if (getApp().globalData.isTablet) {
      plus.screen.lockOrientation('landscape-primary')
    } else {
      plus.screen.lockOrientation('portrait-primary')
    }
    
    // #endif
  },
  methods: {
    ...mapActions(['Login']),
    hideModal () {
      this.imageModal = false
    },
    // app下载弹框
    appDownload () {
      this.imageModal = true
    },
    identTap () {
      if (this.judgeIdent) {
        this.$message('未设置或未绑定账号')
      }
    },
    switchChange (val) {
      let isIdentDisable = uni.getStorageSync('isIdentDisable')
      if (val.detail.value && isIdentDisable) {
        getApp().globalData.auth = 'login'
        ident()
      }
      console.log(val)
    },
    // 登录
    loginInit (flag) {
      // uni.setStorageSync('ignoreSvn', false)

      if (flag === 'manual') {
        this.loginVPN()
      } else {
        uni.setStorageSync('failCount', 0)
        let localUser = uni.getStorageSync('userForm')
        if (localUser) {
          this.form.username = localUser.username
          // #ifdef MP
          this.form.password = localUser.password
          // #endif
        }
      }
    },
    // 解决ios上双向绑定问题
    nameBlur (e) {
      this.form.username = e.target.value
    },
    passwordBlur (e) {
      this.form.password = e.target.value
    },
    // VPN登录
    loginVPN (flag) {
      console.log('flag00', flag)
      if (flag === 'manual') {
        this.loginInit('manual')
        return
      }
      if (!this.form.username && flag !== 'ident') {
        this.$message('请输入用户名')
        return
      }
      if (!this.form.password && flag !== 'ident') {
        this.$message('请输入密码')
        return
      }
      // #ifdef APP-PLUS
      sangforVpn.logout()
      // #endif
      
      const vpn_address = 'https://vpn.iport.com.cn'
      let authForm = uni.getStorageSync('userForm')
      if (flag === 'ident') {
        this.form = { ...authForm }
      }
      let username = LOGIN_PREFIX + this.form.username
      let password = crypto.enc.Base64.stringify(sha256(this.form.password))
      console.log('form', vpn_address, username, password)
      let that = this
      this.$loading('登入中...')
      let time = 0
      let platform = uni.getSystemInfoSync().platform
      this.Interval = setInterval(() => {
        if (platform !== 'ios') {
          sangforVpn.getStatus({}, function (result) {
            console.log('vpnStatus', result)
            let status = platform === 'ios' ? result : result.msg
            if (status === 'VPNONLINE') {
              clearInterval(that.Interval)
              getApp().globalData.ignoreSvn = false
              uni.hideLoading()
              that.login()
            }
          })
        }
        time = time + 1
        console.log('time', time)
        if (time === 20) {
          uni.hideLoading()
          // uni.showToast({
          //   title: 'vpn连接超时',
          //   icon: 'none'
          // })
          flag !== 'ident' && this.changeVpn('overtimeLogin')
          // this.change()
          clearInterval(this.Interval)
        }
      }, 1000)
      let globaIgnoreSvn = getApp().globalData.ignoreSvn
      if (this.ignoreSvn || (globaIgnoreSvn !== undefined && globaIgnoreSvn)) {
        console.log(2222222)
        this.login()
        return
      }
      var isIos = false
      var code = '' // 状态码
      var message = '' // 错误信息
      sangforVpn.login(
        {
          vpn_address,
          username,
          password
        },
        result => {
          console.log('vpn返回结果', result)
          clearInterval(this.Interval)
          if (uni.getSystemInfoSync().platform === 'ios') {
            code = result.substr(result.length - 4)
            message = result.split(',')[0]
            if (code === '2005' || code === '2003') {
              isIos = true
            }
          } else {
            code = result.code
            message = result.msg
          }
          if (result.code === 0 || result === 'success') {
            uni.setStorageSync('ignoreSvn', false)
            getApp().globalData.ignoreSvn = false
            that.login()
          } else if (isIos || result.code === 2001 || result.code === 2003) {
            that.$message(`${message}[${code}]`)
            uni.hideLoading()
            this.changeVpn(code)
          } else {
            // #ifdef APP-PLUS
            sangforVpn.logout()
            // #endif
            that.$message(`${message}[${code}]`)
            uni.hideLoading()
          }
        }
      )
    },
    changeVpn (code) {
      let that = this
      uni.showModal({
        title: '提示',
        content: `当前网络连接vpn失败，是否切换到域名访问？[${code}]`,
        // itemList: ['取消',]
        success: function (res) {
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
          }
        }
      })
    },
    // 检查是否需要更新，否则执行mixin里面的方法
    check (flag) {
      // #ifdef MP
      this.judgeToken()
      // #endif
      // #ifdef APP-PLUS
      this.judgeVersion().then(res => {
        if (!this.modal) {
          if (flag === 'manual') {
            console.log(111111111, flag)
            this.judgeToken()
            this.$message('当前版本为最新版本')
          } else {
            this.judgeToken()
          }
        }
      })
      // #endif
    },
    judgeToken () {
      let token = uni.getStorageSync('access_token')
      let localUser = uni.getStorageSync('userForm')
      if (localUser && token) {
        // #ifdef MP
        this.login()
        // #endif
        // #ifdef APP-PLUS
        this.loginInit()
        // #endif
      }
    },
    // 确定 跳到更新页面
    handleClick (e) {
      let index = e.index
      if (index === 1) {
        uni.navigateTo({
          url: `/pages/login/update?newCurrenVersion=${this.newCurrenVersion}`
        })
        // console.log(`https://www.pgyer.com/apiv2/app/install?_api_key=${dataPara._api_key}&appKey=${dataPara.appKey}&buildPassword=${dataPara.buildPassword}`)
        // plus.runtime.openURL(`https://www.pgyer.com/apiv2/app/install?_api_key=${dataPara._api_key}&appKey=${dataPara.appKey}&buildPassword=${dataPara.buildPassword}`)
      } else {
        this.$message('您取消了更新')
        this.judgeToken()
      }
      this.modal = false
    },
    judgeVersion () {
      let para = {
        _api_key: '85244a596b323908ea22e8a7d46ab1af',
        appKey: '3cb30a869bcc47d32c51e667c92f0c0b'
      }
      return new Promise((resolve, reject) => {
        getVersion(para).then(res => {
          console.log(33, res)
          this.newCurrenVersion = res.data.buildVersion
          console.log(222, this.newCurrenVersion, this.currenVersion)
          if (this.newCurrenVersion !== this.currenVersion) {
            getApp().globalData.buildUpdateDescription = res.data.buildUpdateDescription
            // this.modal = true
          }
          resolve()
        })
      })
    },
    login () {
      this.$loading()
      this.Interval && clearInterval(this.Interval)
      let form = {
        username: this.form.username,
        password: encodeURIComponent(crypto.enc.Base64.stringify(sha256(this.form.password))),
        grant_type: 'password'
      }
      this.Login(form)
        .then(res => {
          console.log('denglu', res)
          if (res) {
            let userId = res.userId
            // console.log(11111, this.$store)

            clearInterval(this.Interval)
            // 连接mq
            // stomp.connect()
            // 发送心跳
            let userInfo = this.$store.state.user.userInfo
            // if (userInfo.id && userInfo.loginId) {
            //   setInterval(() => {
            //     breathe(userInfo.id, userInfo.loginId)
            //   }, 10000)
            // }
            uni.setStorageSync('userForm', this.form)

            // stomp.connect()
            // 登录成功获取数据字典
            this.$store.dispatch('GetRemoteDicAll').then(res => {
              let airportCode = uni.getStorageSync('userAirport')
              console.log('airportCode', airportCode)
              if (airportCode) {
                uni.hideLoading()
                // 跳转
                uni.reLaunch({
                  url: '../home/index?params=login'
                })
              }
              console.log('获取数据字典成功！')
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
              // this.$store.dispatch('getActivityDiff')
              // this.$store.dispatch('setAllFlight')
              // this.$store.dispatch('setFollowList')
            })

            getRoles({
              userId: userId
            }).then(res => {
              console.log('GETROLES', res)
              if (res.status) {
                uni.setStorageSync('cargo_roles_info', res.data)
              }
            })
          }
        })
        .catch(res => {
          console.log('getErr', res)
          if (!res.data) {
            // this.$message('网络异常，请检查网络后重试')
          }
        })
      // loginByUsername(form).then(res => {
      //       uni.setStorageSync('userForm', this.form)
      //       uni.setStorageSync('access_token', res.access_token)
      //       uni.setStorageSync('refresh_token', res.refresh_token)
      //       uni.setStorageSync('userInfo', res)
      //       console.log('res', res)
      //       this.judgeToken()
      // }).catch((err) => {
      //       this.$message(err.data.error_description)
      //       uni.hideLoading()
      //       console.log('err', err)
      //     })
    },
    seePassword (flag) {
      this.seeFlag = !this.seeFlag
    }
  }
}
</script>

<style lang="scss">
  .login-layout-tablet {
    padding: 0 200px;
    .ident-class {
      text-align: center;
      margin: 40px;
      text {
        font-size: 18px;
        position: relative;
        bottom: 3px;
        right: 10px;
      }
    }
    .vision {
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 50px;
      font-size: 20px;
      .vision-msg {
        padding-right: 30px;
      }
      .appDownload {
        color: #1890ff;
        padding-left: 30px;
        border-left: 6px solid #303133;
      }
    }
    .login-btn {
      margin-top: 40px;
      > button {
        width: 500px;
        height: 50px;
        background-color: #1890ff;
        border-radius: 10px;
        font-size: 28px;
        line-height: 50px;
        color: #ffffff;
      }
    }
    .login-logo {
      padding-top: 40px;
      text-align: center;
      image {
        height: 80px;
        width: 250px;
      }
    }
    .form-input {
      width: calc(100vw - 400px);
      margin-top: 40px;
    }
    .username-form,
    .password-form {
      // width: 100vw;
      position: relative;
    
      .username-img {
        width: 30px;
        height: 40px;
        position: absolute;
        top: 18px;
        left: 32px;
      }
    
      .see-img {
        width: 30rpx;
        height: 20rpx;
        position: absolute;
        right: 92rpx;
        bottom: 23rpx;
      }
    
      > input {
        border-bottom: solid 2px #e5e5e5;
        height: 80px;
        line-height: 80px;
        padding: 0 100px;
        font-size: 26px;
      }
    }
  }
</style>
