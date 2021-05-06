<template>
	<view>
		<u-navbar
			back-icon-color="#ffffff"
		  title="航司"
			title-color="#ffffff"
		 :background="background">
			<template v-slot:right>
				<image style="width: 66rpx;height: 66rpx;margin-right: 20rpx;" src="../../static/add-white.png"
					@tap="inputForm"
				></image>
			</template>
		</u-navbar>
		
		<list-content
			ref="listContent">
			<template v-slot:card="scope">
				<airline-card
					:show-btn="showBtn"
					:card="scope.card">
				</airline-card>
			</template>
		</list-content>
		
	</view>
</template>

<script>
	import { getAirlineList, onError, getRole } from '@/api/empty-container/index.js'
	import listContent from './list-content.vue'
	import airlineCard from './components/airline-card.vue'
	import {mapGetters} from 'vuex'
	export default {
		data () {
			return {
				background: {
					'background-color': '#4191EA'
				},
				showBtn: false,
				role: '',
				interval: null
			}
		},
		components: {
			listContent,
			airlineCard
		},
		computed: {
			...mapGetters(['cargoStationConfirm', 'crateGroupInput'])
		},
		// beforeDestroy () {
		// 	clearInterval(this.interval)
		// },
		watch: {
			cargoStationConfirm: {
				handler(newval, oldval) {
					console.log('airline-newval', newval)
					this.getAirlineList()
				}
			},
			crateGroupInput: {
				handler(newval, oldval) {
					console.log('airline-newval', newval)
					this.getAirlineList()
				}
			}
		},
		mounted () {
			var that = this
			this.role = getRole()
			if (this.role === '空集装器货站单证组') {
				this.showBtn = true
			}
			// this.interval = setInterval(function () {
			// 	that.getAirlineList()
			// }, 30000)
		},
		onShow () {
			this.getAirlineList()
		},
		methods: {
			getAirlineList () {
				console.log('hhhh')
				uni.showLoading({
					title: '加载中'
				})
				getAirlineList().then(res => {
					console.log('getAirlineList', res)
					if (res.status) {
						this.list = res.data
						this.list.sort((a, b) => b.updateTime - a.updateTime)
						this.$refs.listContent.initList(this.list)
					}
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 2000
					})
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			},
			inputForm () {
				uni.navigateTo({
					url: `/pages/emptyContainer/airline-form`
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
