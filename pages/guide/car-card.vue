<template>
	<view v-show="cars.length>0">
		<block v-for="(car, index) in cars" :key="index">
			<view class="card">
				<view class="row">
					<view class="block" style="display: inline-block;">
						<view class="label">
							车号
						</view>
						<view class="value" style="display: inline-block;">
							{{car.carCode}}
						</view>
					</view>
					
					<view class="block">
						<view class="label" style="display: inline-block;">
							车状态
						</view>
						<view class="value" style="display: inline-block;">
							{{fomatter(car.carStatus)}}
						</view>
					</view>
				</view>
				
				<view class="row">
					<view class="block">
						<view class="label" style="display: inline-block;">
							类型
						</view>
						<view class="value" style="display: inline-block;">
							{{car.carType}}
						</view>
					</view>
				</view>
				
				<view class="row">
					<block v-for="(btn, index) in btns" :key="index">
						<view class="btn" @tap="btn.func(param, car)">
							{{btn.label}}
						</view>
					</block>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import { innerCarBtns, outterCarBtns } from './btns.js'
	export default {
		data () {
			return {
				btns: [],
				param: {},
				role: '登机口引导单内场客服',
				serviceGuide: {},
				cars: [],
				direction: '',
			}
		},
		methods: {
			fomatter (word) {
				try {
					let arr = word.split('_')
					let status = ''
					if (arr && arr.length > 2) {
						for (let i = 0; i < (arr.length - 1); i++) {
							status += arr[i] + '_'
						}
					}
					let num = arr[arr.length - 1]
					switch (status) {
						case 'ACCEPT_TO_GATE_':
							return '已接受'
						case 'ON_THE_WAY_TO_GATE_':
							return '开往' + num + '登机口'
						case 'ARRIVE_GATE_':
							return '到达' + num + '登机口'
						default:
							return ''
					}
				} catch (err) {
					console.log('fomatter-error', err)
				}
				
			},
			
			init (role, cars, serviceGuide, direction) {
				this.role = role
				this.cars = cars
				// this.cars.forEach(e => {
				// 	e.guideId = serviceGuide.id
				// 	e.direction = direction
				// 	e.carType = e.name
				// 	e.carCode = e.deviceCode
				// })
				console.log('cars', this.cars)
				this.serviceGuide = serviceGuide
				console.log('car-role', this.role)
				switch (this.role) {
					case '登机口引导单内场客服':
						this.btns = innerCarBtns
						break
					case '登机口引导单外场客服':
						this.btns = outterCarBtns
						break
					default: 
						this.btns = []
						break
				}
				this.param = {
					serviceGuide: serviceGuide,
					serviceCar: {},
					direction: direction
				}
				console.log('cars', this.cars)
				console.log('car-btns', this.btns)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './uni.scss';
	.block {
		display: flex;
		.label {
			margin-right: 1rpx;
			font-family: SourceHanSansSC;
			font-size: 28rpx;
			display: inline-block;
			font-weight: normal;
			color: #a6a6a6;
		}
		.value {
			font-family: Roboto-Regular, SourceHanSansSC-Regular;
			font-size: 28rpx;
			font-weight: bolder;
			display: inline-block;
			color: #595959;
		}
	}
</style>
