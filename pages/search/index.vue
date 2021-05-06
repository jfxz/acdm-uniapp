<template>
	<view class="searchFlight" v-show="show">
		<view class="img-outer">
			<image src="../../static/search_background.png" class="imageBackground" />
			<view class="tabs">
				<u-tabs :list="navbar" :current="currentTab" @change="change" height="90" duration="0.1" :bgColor="null" bar-width="60"
				 gutter="50"></u-tabs>
			</view>
		</view>
		<view class="inputForm">
			<view class="Form" v-if="tabValue==='city'">
				<view class="inputs">
					<view class="inputLayout" style="border-bottom: solid 1rpx #e5e5e5;">
						<view style="display: flex;align-items: center;height: 90rpx;">
							<view style="background-color: #00e471;width: 16rpx;height: 16rpx;"></view>
						</view>
						<input class="input" v-model="filters.originCn" placeholder="出发城市" @focus="handleOriginCity" @blur="handleOriginCity" />
						<view class="deleteIcon">
							<image src="../../static/deleteX.png" @click="deleteMsg('originCn')" v-show="filters.originCn"></image>
						</view>
					</view>
					<view class="inputLayout">
						<view style="display: flex;align-items: center;height: 90rpx;">
							<view style="background-color: #ff0000;width: 16rpx;height: 16rpx;"></view>
						</view>
						<input class="input" v-model="filters.destinationCn" placeholder="到达城市" @focus="handleDesCity" @blur="handleDesCity" />
						<view class="deleteIcon">
							<image src="../../static/deleteX.png" @click="deleteMsg('destinationCn')" v-show="filters.destinationCn"></image>
						</view>
					</view>
				</view>
				<image src="../../static/change_hdpi.png" class="changeBtn" @tap="switchCity"></image>
			</view>
			<view class="Form" v-if="tabValue==='registration'||tabValue==='flight'">
				<view class="inputs">
					<view class="inputLayout" style="border-bottom: solid 1rpx #e5e5e5;line-height: 90rpx;" @tap="openPickData" v-if="tabValue==='flight'">
						<view style="display: flex;align-items: center;height: 90rpx;">
							<view style="background-color: #00e471;width: 16rpx;height: 16rpx;"></view>
						</view>
						<text style="margin-left: 20rpx;font-size: 35rpx;">{{filters.searchDate}}</text>
					</view>
					<view class="inputLayout" style="border-bottom: solid 1rpx #e5e5e5;">
						<view style="display: flex;align-items: center;height: 90rpx;">
							<view style="background-color: #ff0000;width: 16rpx;height: 16rpx;"></view>
						</view>
						<input v-if="tabValue==='flight'" v-model="filters.flight" class="input" style="width: ;" placeholder="请输入航班号" />
						<input v-if="tabValue==='registration'" v-model="filters.registration" class="input" placeholder="请输入机号" />
						<!-- <image src="../../static/mK_ldpi.png" style="height: 45rpx;width: 30rpx;margin-top: 5rpx;"></image> -->
					</view>
				</view>
			</view>
			<u-calendar v-model="dataShow" :mode="mode" @change="changeDate" max-date="2100-12-31" max-year="2100"></u-calendar>
			<button class="searchBtn" @tap="search" v-show="tabValue">搜索</button>
		</view>
	</view>
</template>

<script>
	import {
		deepCopy
	} from "@/common/util/util.js"
	import dayjs from '../../common/util/dayjs.min.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				show: true,
				navbar: [{
						name: "按航班搜索",
						value: 'flight'
					}, {
						name: "按城市搜索",
						value: 'city'
					},
					{
						name: "按机号搜索",
						value: 'registration'
					}
				],
				currentTab: 0,
				tabValue: 'flight',
				filters: {
					originCn: '',
					destinationCn: '',
					flight: '',
					registration: '',
					searchDate: ''
				},
				defaultData: {
					originCn: '',
					destinationCn: '',
				},
				timer: null,
				dataShow: false,
				mode: 'date',
			}
		},
		components: {},
		computed: {
			...mapGetters(['user', 'flight', 'remoteDic']),
		},
		onLoad() {
			this.filters.originCn = this.user.userAirport[0].displaycnname
			this.filters.destinationCn = this.user.userAirport[0].displaycnname
			this.defaultData.originCn = this.user.userAirport[0].displaycnname
			this.defaultData.destinationCn = this.user.userAirport[0].displaycnname
			this.filters.searchDate = dayjs(new Date()).format('YYYY-MM-DD')
			this.$store.dispatch('setAllTypeFlight')
			this.setDic()
		},
		onShow() {
			this.show = true
		},
		onHide() {
			clearInterval(this.timer)
		},
		methods: {
			// 切换tab
			change(index) {
				this.filters = {
					originCn: this.user.userAirport[0].displaycnname,
					destinationCn: this.user.userAirport[0].displaycnname,
					flight: '',
					registration: '',
					searchDate: dayjs(new Date()).format('YYYY-MM-DD')
				}
				this.currentTab = index
				this.tabValue = this.navbar[this.currentTab].value
				console.log(this.tabValue)
			},
			// 交换城市
			switchCity() {
				let tempor = deepCopy(this.filters.originCn)
				let tempdes = deepCopy(this.filters.destinationCn)
				this.filters.destinationCn = tempor
				this.filters.originCn = tempdes
			},
			setDic(){
				//插入BASE_AIRPORT基础数据
				if (!this.remoteDic.BASE_AIRPORT || this.remoteDic.BASE_AIRPORT.length === 0) {
					this.$store.dispatch('getBaseAirport')
				}
			},
			search() {
				let str = ''
				if (this.tabValue === 'city') {
					str = `&originCn=${this.filters.originCn}&destinationCn=${this.filters.destinationCn}`
				}
				if (this.tabValue === 'flight') {
					str = `&flight=${this.filters.flight}&searchDate=${this.filters.searchDate}`
				}
				if (this.tabValue === 'registration') {
					str = `&registration=${this.filters.registration}`
				}
				uni.navigateTo({
					url: `./searchResult?type=${this.tabValue}${str}`
				})
				this.show = false
			},
			//打开日期选择
			openPickData() {
				this.dataShow = true
			},
			changeDate(e) {
				this.filters.searchDate = e.result
				console.log(this.filters.searchDate)
			},
			//出发城市城市输入框聚焦失焦
			handleOriginCity(even) {
				if (even.type === 'focus') {
					this.filters.originCn = ''
				}
				if (even.type === 'blur' && this.filters.originCn === '') {
					this.filters.originCn = this.defaultData.originCn
				}
			},
			//到达城市输入框聚焦失焦
			handleDesCity(even) {
				if (even.type === 'focus') {
					this.filters.destinationCn = ''
				}
				if (even.type === 'blur' && this.filters.destinationCn === '') {
					this.filters.destinationCn = this.defaultData.destinationCn
				}
			},
			deleteMsg(type) {
				if (type === 'originCn') {
					this.filters.originCn = ''
				}
				if (type === 'destinationCn') {
					this.filters.destinationCn = ''
				}
			}
		}
	}
</script>

<style lang="scss">
	.searchFlight {
		display: flex;
		flex-direction: column;

		.img-outer {
			position: relative;

			.tabs {
				width: 100%;
				position: absolute;
				bottom: 10rpx;

			}

			.imageBackground {
				width: 100%;
				height: 380rpx;
			}
		}

		.inputForm {
			margin-top: 60rpx;

			.Form {
				display: flex;
				flex-direction: row;
				margin-left: 60rpx;
				border-bottom: solid 1rpx #e5e5e5;
				width: 88%;

				.inputs {

					.inputLayout {
						display: flex;
						flex-direction: row;
						height: 100rpx;
						width: 550rpx;
					}

					.deleteIcon {
						width: 15%;
						height: 100rpx;
						line-height: 120rpx;
						text-align: center;

						image {
							width: 45rpx;
							height: 45rpx;
							margin-top: 24rpx;
						}
					}

					.input {
						margin-left: 15rpx;
						height: 90rpx;
						width: 515rpx;
					}

				}

				.changeBtn {
					height: 60rpx;
					width: 60rpx;
					margin-left: 30rpx;
					margin-top: 50rpx;
				}
			}

			.searchBtn {
				margin-top: 100rpx;
				background-color: #ff9200;
				border-radius: 7px;
				width: 640rpx;
				height: 100rpx;
				font-size: 35rpx;
				letter-spacing: 15rpx;
				line-height: 100rpx;
				color: #fffefd;
			}
		}
	}
</style>
