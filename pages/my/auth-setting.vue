<template>
  <view class="auth-setting">
    <view class="layout">
      <view class="label">
        面容/指纹登录
      </view>
      <switch color="#4191ea" :checked="checked" @change="switchChange" />
    </view>
    <view class="tips">
      设置面容/指纹登录，仅对本机生效
    </view>
  </view>
</template>

<script>
import eventVue from '../../common/util/eventVue.js'
import {ident} from '../../common/util/identification.js'
export default {
  data () {
    return {
      mode: [],
      checked: false,
      disabled: false
    }
  },
  onLoad () {
    eventVue.$on('authSetting', () => {
      console.log('回调')
      // #ifdef APP-PLUS
      this.bindAuth()
      // #endif
    })
    this.checked = uni.getStorageSync('isIdentDisable')
    console.log('checked', uni.getStorageSync('isIdentDisable'))
    // let _that = this
    // uni.checkIsSupportSoterAuthentication({
    // 	success(res) {
    //     console.log('mode', res)
    // 		let mode = res.supportMode
    //     _that.mode = mode
    // 		_that.checkIsSoterEnrolledInDevice(mode)
    // 	},
    // 	fail(err) {
    //     _that.disabled = true
    //     uni.setStorageSync('isIdentDisable', true)
    // 		console.log('err', err);
    // 	},
    // 	complete(res) {
    // 		console.log(res);
    // 	}
    // })
  },
  methods: {
    bindAuth () {
      let form = uni.getStorageSync('userForm')
      uni.setStorageSync('isIdentDisable', form)
      this.$message('设置成功', 'success', '')
    },
    switchChange (e) {
      let value = e.detail.value
      if (value) {
        getApp().globalData.auth = 'authSetting'
        ident()
      } else {
        uni.setStorageSync('isIdentDisable', value)
      }
    }
    // 获取设备内是否录入如指纹等生物信息的接口
    // checkIsSoterEnrolledInDevice (mode) {
    //   let _that = this
    // 	console.log('mode', mode)
    // 	uni.checkIsSoterEnrolledInDevice({
    // 		checkAuthMode: mode[0],
    // 		success(res) {
    // 			_that.disabled = false
    // 		},
    // 		fail(err) {
    //       _that.disabled = true
    //       uni.setStorageSync('isIdentDisable', true)
    //       _that.$message('当前未录入生物信息')
    // 			console.log(err);
    // 		},
    // 		complete(res) {
    // 			console.log(res);
    // 		}
    // 	})
    // },
    // // 开始生物验证
    // startSoterAuthentication (mode) {
    //   console.log('mode111', mode)
    //   let _that = this
    // 	uni.startSoterAuthentication({
    // 		requestAuthModes: mode,
    // 		challenge: '123456',
    // 		authContent: `请用${mode[0] === 'facial' ? 'FaceID' : '指纹'}解锁`,
    // 		success(res) {
    //       _that.checked = true
    //       _that.$forceUpdate()
    // 			uni.setStorageSync('isIdentDisable', false)
    // 		},
    // 		fail(err) {
    //       console.log('errrrr111', err)
    // 			uni.setStorageSync('isIdentDisable', true)
    //       _that.checked = false
    //       _that.$forceUpdate()
    // 		},
    // 		complete(res) {
    // 			console.log(res);
    // 		}
    // 	})
    // },
  }
};
</script>

<style lang="scss">
.auth-setting {
  .layout {
    display: flex;
    justify-content: space-between;
    background: #FFFFFF;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 30rpx;
  }
  .tips {
    margin-top: 10rpx;
    padding: 0 30rpx;
    font-size: 23rpx;
    color: #acacac;
  }
}
</style>
