<template>
	<view>
		<u-navbar
			back-icon-color="#ffffff"
		  title="货站"
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
				<warehouse-card
					:show-btn="showBtn"
					:card="scope.card">
				</warehouse-card>
			</template>
		</list-content>
		
	</view>
</template>

<script>
	import { getWarehouseList, onError, getRole } from '@/api/empty-container/index.js'
	import listContent from './list-content.vue'
	import warehouseCard from './components/warehouse-card.vue'
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
			warehouseCard
		},
		computed: {
			...mapGetters(['crateGroupConfirm', 'cargoStationInput'])
		},
		watch: {
			crateGroupConfirm: {
				handler(newval, oldval) {
					console.log('airline-newval', newval)
					this.getWarehouseList()
				}
			},
			cargoStationInput: {
				handler(newval, oldval) {
					console.log('airline-newval', newval)
					this.getWarehouseList()
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
			// 	that.getWarehouseList()
			// }, 30000)
		},
		onShow () {
			this.getWarehouseList()
		},
		// beforeDestroy () {
		// 	clearInterval(this.interval)
		// },
		methods: {
			getWarehouseList () {
				uni.showLoading({
					title: '加载中'
				})
				getWarehouseList().then(res => {
					console.log('getWarehouseList', res)
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
					url: `/pages/emptyContainer/warehouse-form`
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
