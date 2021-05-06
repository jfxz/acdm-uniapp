<template>
	<view>
		<u-navbar
			back-icon-color="#ffffff"
		  title="空集装板盘点"
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
				<check-card
					:show-btn="showBtn"
					:card="scope.card">
				</check-card>
			</template>
		</list-content>
		
	</view>
</template>

<script>
	import { onError, getRole, getPalletList } from '@/api/empty-container/index.js'
	import listContent from './list-content.vue'
	import checkCard from './components/check-card.vue'
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
			checkCard
		},
		computed: {
			...mapGetters(['cargoStationInputPallet', 'crateGroupConfirmPallet'])
		},
		watch: {
			cargoStationInputPallet: {
				handler(newval, oldval) {
					console.log('airline-newval', newval)
					this.getPalletList()
				}
			},
			crateGroupConfirmPallet: {
				handler(newval, oldval) {
					console.log('airline-newval', newval)
					this.getPalletList()
				}
			}
		},
		mounted () {
			var that = this
			this.role = getRole()
			if (this.role === '空集装器装卸板箱组') {
				this.showBtn = true
			}
			// this.interval = setInterval(function () {
			// 	that.getPalletList()
			// }, 30000)
		},
		// beforeDestroy () {
		// 	clearInterval(this.interval)
		// },
		onShow () {
			this.getPalletList()
		},
		methods: {
			getPalletList () {
				uni.showLoading({
					title: '加载中'
				})
				getPalletList().then(res => {
					console.log('getPalletList', res)
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
					url: `/pages/emptyContainer/check-form`
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
