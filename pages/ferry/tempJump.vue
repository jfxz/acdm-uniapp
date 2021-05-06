<!-- 强制横屏页面过度页面，防止样式错乱wlf -->
<template>
</template>
<script>
	export default {
		data() {
			return {
				route: '',
				flightId: ''
			}
		},
		onLoad(obj) {
      // #ifdef APP-PLUS
      plus.screen.lockOrientation('portrait-primary');
      // #endif
      
			this.route = obj.route
      console.log('route', this.route)
			this.flightId = obj.flightId
		},
		onReady() {
			if (this.route === 'ferry') {
				this.$nextTick(() => {
					setTimeout(() => {
						uni.setStorageSync('isFirstMes', 'noFirst')
						console.log('数值', uni.getStorageSync('isFirstMes'))
						uni.redirectTo({
							url:`../flight/flight-message?flightId=${this.flightId}`
						})
						return
					}, 500)
				})
			} else if (this.route === 'login') {
				uni.reLaunch({
					url: '../login/index'
				})
			} else if (this.route === 'service') {
				uni.navigateBack({
				    delta: 1
				})
			} else {
				setTimeout(() => {
					uni.reLaunch({
						url: '../home/index'
					})
					console.log('回首页')
					return
				}, 50)
			}
		},
		onShow() {}
	}
</script>

<style>
</style>
