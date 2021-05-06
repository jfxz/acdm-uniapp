<template>
	<view class="weather-content" v-if="showWeather">
		<view class="part">
			<view class="icon-class">
				<image :src="mistData.inmSrc"></image>
			</view>
			<view class="content">{{mistData.value}}</view>
			<view class="type">{{mistData.name}}</view>
		</view>
		<view class="part">
			<view class="icon-class">
				<image :src="dewPointData.inmSrc"></image>
			</view>
			<view class="content">{{dewPointData.value}}</view>
			<view class="type">{{dewPointData.name}}</view>
		</view>
		<view class="part">
			<view class="icon-class">
				<image :src="cloudData.inmSrc"></image>
			</view>
			<view class="content">{{cloudData.value}}</view>
			<view class="type">{{cloudData.name}}</view>
		</view>
		<view class="part">
			<view class="icon-class">
				<image :src="visibilityData.inmSrc"></image>
			</view>
			<view class="content">{{visibilityData.value}}</view>
			<view class="type">{{visibilityData.name}}</view>
		</view>
		<view class="part">
			<view class="icon-class">
				<image :src="windData.inmSrc"></image>
			</view>
			<view class="content">{{windData.value}}</view>
			<view class="type">{{windData.name}}</view>
		</view>
		<view class="part">
			<view class="icon-class">
				<image :src="pressureData.inmSrc"></image>
			</view>
			<view class="content">{{pressureData.value}}</view>
			<view class="type">{{pressureData.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'flightWeather',
		props: {
			weatherData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				showWeather:false,
				mistData: {
					name: '天气',
					value: '0',
					inmSrc: '../../static/mist.png'
				},
				dewPointData: {
					name: '温度/露点',
					value: '0',
					inmSrc: '../../static/dewPoint.png'
				},
				cloudData: {
					name: '云',
					value: '0',
					inmSrc: '../../static/cloud.png'
				},
				visibilityData: {
					name: '能见度',
					value: '0',
					inmSrc: '../../static/visibility.png'
				},
				windData: {
					name: '风',
					value: '0',
					inmSrc: '../../static/wind.png'
				},
				pressureData: {
					name: '气压',
					value: '0',
					inmSrc: '../../static/pressure.png'
				}
			}
		},
		methods:{
			init(data){
				console.log('组件组件组件')
				this.showWeather=!this.showWeather
				if(this.weatherData){
					this.setData()
				}
			},
			setData(){
				this.mistData.value=this.weatherData.WEATHER||0
				this.dewPointData.value=this.weatherData['Temperature/Dew']+'°C ' ||0
				this.cloudData.value=this.weatherData.WEATHER||0
				this.visibilityData.value=this.weatherData.visibility||0
				this.windData.value=this.weatherData.wind||0
				this.pressureData.value=this.weatherData.pressure||0
			}
		}
	}
</script>

<style lang="scss" scoped>
	.weather-content {
		height: 180rpx;
		width: 180rpx;
		background-color: red;
		border-bottom: solid 2rpx #e5e5e5;
		display: flex;
		justify-content: space-around;
		.part{
			width: 16.6%;
			display: flex;
			flex-direction: column;
			text-align: center;
			.icon-class{
				height: 60rpx;
				line-height: 60rpx;
				image{
					width: 50rpx;
					height: 50rpx;
				}
			}
			.content{
				height: 80rpx;
				line-height: 80rpx;
				font-size: 25rpx;
			}
			.type{
				height: 40rpx;
				line-height: 40rpx;
				font-size: 15rpx;
			}
			
		}
	}
</style>
