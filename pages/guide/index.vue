/*
* 界面名称:登机口引导
* 界面功能:
* 其他    :
* 时间    :2020-11-17 16:08:28
* 作者    :gyb
*/
<template>
	<view class="guide-page">
		<u-navbar
			back-icon-color="#ffffff"
		  title="登机口引导单"
			title-color="#ffffff"
		 :background="background"></u-navbar>
		<flight-card
			v-if="refreshCard"
			ref="flightCard">
		</flight-card>
		<car-card
			v-if="refreshCard"
		  ref="carCard">
		</car-card>
	</view>
</template>

<script>
	import {
		onError,
		getRole,
		getGuideForm,
		validatenull
	} from '@/api/guide/index.js'
	import flightCard from './flight-card.vue'
	import carCard from './car-card.vue'
	import dayjs from '../../common/util/dayjs.min.js'
	export default {
		components: {
			flightCard,
			carCard
		},
		data () {
			return {
				flightInfo: {
				},
				cars: [],
				background: {
					'background-color': '#4191EA'
				},
				// 该用户拥有的登机口引导单模块的角色名。每个用户只能拥有一个登机口引导单角色
				role: '',
				direction: '',
				task: {},
				form: {},
				flightTaskId: '',
				serviceGuide: {},
				interval: null,
				refreshCard: true
			}
		},
		
		onLoad (e) {
			this.direction = e.direction
			this.role = e.role
			this.flightTaskId = e.flightTaskId
		},
		
		beforeDestroy () {
			clearInterval(this.interval)
		},
		
		mounted () {
			// 得到任务信息
			if (!validatenull(this.task)) {
				this.flightInfo = this.task.flightDTO
				let flightDTO = this.task.flightDTO
				uni.showLoading({
					title: '加载中'
				})
				if (this.task.guideId) {
					getGuideForm({
						guideId: this.task.guideId
					}).then(res => {
						console.log('getGuideForm', res)
						if (res.status && res.data) {
							this.form = {
								...res.data.serviceGuide,
								direction: this.direction
							}
							// 权限判断
							try {
								this.$refs.flightCard.init(flightDTO, this.form, this.role, this.task, this.direction)
								this.cars = res.data.serviceCarList
								this.cars.forEach(e => {
									e.status = e.carStatus
								})
								this.$refs.carCard.init(this.role, this.cars, this.form, this.direction)
							} catch (err) {
								console.log('mounted-err', err)
							}
						}
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				} else {
					uni.hideLoading()
					this.form = {
						...this.task.flightDTO,
						opDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
						bigCarNum: 0,
						smallCarNum: 0,
						id: null,
						direction: this.direction
					}
					// 权限判断
					this.$refs.flightCard.init(flightDTO, this.form, this.role, this.task, this.direction)
					this.$refs.carCard.init(this.role, this.cars, this.form, this.direction)
				}
			}
			
			var that = this
			this.interval =  setInterval(function () {
				that.intervalRefresh()
			}, 30000)
		},
		
			
		methods: {
			intervalRefresh () {
				var that = this
				if (that.task.guideId) {
					getGuideForm({
						guideId: that.task.guideId
					}).then(res => {
						console.log('getGuideForm', res)
						if (res.status) {
							this.form = {
								...res.data.serviceGuide,
								direction: this.direction
							}
							this.cars = res.data.serviceCarList
							this.$refs.flightCard.init(this.task.flightDTO, this.form, this.role, this.task, this.direction)
							this.$refs.carCard.init(this.role, this.cars, this.form, this.direction)
							console.log('this.form-new', this.form)
						}
						uni.hideLoading()
					}).catch(err => {
						onError(err)
					})
				}
			}
		},
		
		
		onShow () {
			let task = uni.getStorageSync('guide_task')
			if (task) {
				this.task = task
				uni.removeStorageSync('guide_task')
				this.flightInfo = this.task.flightDTO
			}
			let guideId = uni.getStorageSync('guideId')
			if (guideId) {
				this.task.guideId = guideId
				uni.removeStorageSync('guideId')
			}
			
			var that = this
			if (this.task.guideId) {
				getGuideForm({
					guideId: this.task.guideId
				}).then(res => {
					console.log('getGuideForm', res)
					if (res.status) {
						this.form = {
							...res.data.serviceGuide,
							direction: this.direction
						}
						this.cars = res.data.serviceCarList
						try {
							this.$refs.flightCard.init(this.task.flightDTO, this.form, this.role, this.task, this.direction)
							this.$refs.carCard.init(this.role, this.cars, this.form, this.direction)
						} catch (err) {
							console.log('onshow-err', err)
						}
					}
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.guide-page {
	}
</style>
