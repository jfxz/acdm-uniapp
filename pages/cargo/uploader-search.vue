<template>
	<view class="background" :class="autoShow&&showUploaderSearch?'show':'hide'">
		<view :class="{'search-card': true, 'no-origin-height': !showOrigin}">
			<view class="row">
				<view class="dot"></view>
				<input placeholder="请输入航班号" v-model="searchForm.flight"></input>
			</view>
			<view style="width: 565rpx;margin: 0 auto;height: 1rpx;background-color: #e6e6e6;"></view>
			<view v-if="showOrigin" class="row">
				<view class="dot" style="background-color: #09c743;"></view>
				<input placeholder="请输入始发站" v-model="searchForm.origin"></input>
			</view>
			<view v-if="showOrigin" style="width: 565rpx;margin: 0 auto;height: 1rpx;background-color: #e6e6e6;"></view>
			<view class="row">
				<view class="dot" style="background-color: orange;"></view>
				<view class="input-row" @tap="showDatePicker=true">{{searchForm.flightDate}}</view>
			</view>
			<view style="width: 565rpx;margin: 0 auto;height: 1rpx;background-color: #e6e6e6;"></view>
			<view class="btn" @tap="search">查询</view>
		</view>
		<u-picker :default-time="defaultTime" mode="time" v-model="showDatePicker" :params="dateParams" @confirm="setDate"></u-picker>
	</view>
</template>

<script>
	import uPicker from '@/uview-ui/components/u-picker/u-picker.vue'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		components: {
			uPicker
		},
		props: {
			showOrigin: {
				type: Boolean,
				default: true
			},
			autoShow: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				showDatePicker: false,
				dateParams: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				defaultTime: '',
				showUploaderSearch: true,
				searchForm: {
					flight: '',
					flightDate: '',
					origin: ''
				}
			}
		},
		mounted () {
			this.searchForm.flightDate = dayjs(new Date()).format('YYYY-MM-DD')
			this.defaultTime = this.searchForm.flightDate
		},
		methods: {
			setDate (e) {
				this.searchForm.flightDate = e.year + '-' + e.month + '-' + e.day
			},
			changeStatus () {
				this.showUploaderSearch = !this.showUploaderSearch
			},
			close () {
				this.showUploaderSearch = false
			},
			search () {
				this.searchForm.flight = this.searchForm.flight.toUpperCase()
				this.searchForm.origin = this.searchForm.origin.toUpperCase()
				this.$emit('search', this.searchForm)
				this.showUploaderSearch = false
			},
			getStatus () {
				return this.showUploaderSearch
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dot {
		width: 8rpx;
		height: 8rpx;
		margin-right: 37rpx;
		border-radius: 50%;
		background-color: #207ae9;
	}
	.background {
		width: 100vw;
		// max-height: 0;
		background-color: #1288EF;
		position: relative;
	}
	
	.search-card {
		margin: 0 17rpx;
		width: calc(100vw - 33rpx);
		height: 534rpx;
		background-color: #ffffff;
		border-radius: 17rpx;
		
		.row {
			display: flex;
			align-items: center;
			margin: 0rpx 0 18rpx 33rpx;
			padding-top: 50rpx;
			.circle { 
			 width: 8rpx; 
			 height: 8rpx; 
			 background: #207ae9; 
			 border-radius: 4rpx; 
			 margin-right: 37rpx;
			}
			.input-row {
				width: 100%;
				height: 56rpx;
				
				font-family: Roboto-Regular;
				font-size: 33rpx;
				line-height: 56rpx;
				letter-spacing: 2rpx;
				color: #333333;
			}
		}
		
		.btn {
			margin: 0 33rpx;
			margin-top: 50rpx;
			text-align: center;
			line-height: 86rpx;
			color: #ffffff;
			width: 650rpx;
			height: 86rpx;
			background-color: #207ae9;
			border-radius: 43rpx;
		}
	}
	
	.no-origin-height {
		height: 434rpx;
	}
	
	.show {
		max-height: 600rpx !important;
		overflow: hidden;
		margin-bottom: 0;
		transition: all 0.5s ease-in-out;
	}
	
		
	.hide {
		max-height: 0;
		overflow: hidden;
		margin-bottom: 0;
		transition: all 0.5s ease-in-out;
	}
</style>
