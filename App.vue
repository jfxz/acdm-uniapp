<script>
	import Vue from 'vue'
	import store from '@/store'
	import stomp from '@/common/util/stomp-client.js'
	export default {
		onLaunch: function () {
      // #ifdef APP-PLUS
      // 判断是不是平板
      let ua = plus.navigator.getUserAgent()
      if (/(?:iPad|PlayBook)/.test(ua) || (!/(?:Mobile)/.test(ua)) || (/(?:Tablet)/.test(ua))) {
        console.log('isTrue')
        getApp().globalData.isTablet = true
      } else {
        getApp().globalData.isTablet = false
      }
      // #endif
      
			// 自动跳转到home首页
			// #ifdef APP-PLUS
			let token = uni.getStorageSync('access_token')
			if (token) {
				uni.reLaunch({
					url: 'pages/home/index?params=launch'
				})
			}
			// 点击通知栏消息，如果是followFlight 则跳转至关注航班
			plus.push.addEventListener('click', (message) => {
				//处理点击消息的业务逻辑代码
				console.log('message', message)
				if (message.payload === 'followFlight') {
					console.log('跳转至关注航班')
					uni.reLaunch({
						url: '/pages/follow/index'
					})
				}
			}, false)
			// #endif
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App onShow')
			//已登录
			if (store.state.user.user.userId) {
				//网络连接错误,重新连接mq
				uni.onSocketError((error) => {
					console.log('进入appvue::onSocketError')
					stomp.closeConnect()
					stomp.connect()
				})
			}
			uni.setStorageSync('appStatus', 'onShow')
		},
		onHide: function () {
			console.log('App Hide')
			uni.setStorageSync('appStatus', 'onHide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	@import "./styles/common.css";
	/* colorUi */
	@import "./styles/color-ui/main.css";
	@import "./styles/color-ui/icon.css";
</style>
