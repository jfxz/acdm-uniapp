<template>
	<view class="page">
		<view class="top">
			<span style="margin-left:20rpx;font-weight:900;">特别注意事项</span>
			<template v-if="expanded">
				<image style="margin-right: 20rpx;" src="@/static/loader-hide.png" @click="hide"></image>
			</template>
			<template v-else>
				<image style="margin-right: 20rpx;" src="@/static/loader-expand.png" @click="expand"></image>
			</template>
		</view>
		
		<view v-if="expanded" class="main">
			<block v-for="(cabin, index) in list" :key="index">
				<view class="cabin">
					<view class="left">
						{{cabin.cabin}}
					</view>
					<view class="right">
						<view class="value">C:{{cabin.c}}</view>
						<view class="value">M:{{cabin.m}}</view>
						<view class="value">BY:{{cabin.by}}</view>
					</view>
				</view>
			</block>
			
			<span style="margin-left:20rpx;font-weight:900;">备注:{{remark}}</span>
			<br/>
			<span style="margin-left:20rpx;font-weight:900;">{{additionalInfo}}</span>
			<br/>
			<span style="margin-left:20rpx;font-weight:900;">来源:{{direction}}</span>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			direction: {
				type: String, 
				default: '离港'
			}
		},
		data () {
			return {
				expanded: true,
				list: [],
				remark: '',
				additionalInfo: ''
			}
		},
		methods: {
			expand () {
				this.expanded = true
			},
			hide () {
				this.expanded = false
			},
			clearList () {
				this.list = []
			},
			initRemark (remark) {
				this.remark = remark
			},
			init (map) {
				console.log('map', map)
				this.list = []
				for (let key in map) {
					let leg = {
						cabin: key,
						c: 0,
						m: 0,
						by: 0
					}
					let arr = []
					for(let i in map[key]) {
						arr.push({
							cabin: map[key][i].cabin,
							type: map[key][i].type,
							weight: map[key][i].weight
						})
					}
					let cabins = [...new Set(arr.map(e => e.cabin))]
					let arr2 = []
					for (let i in cabins) {
						let arr3 = []
						let obj = {
							cabin: cabins[i],
							c: 0,
							m: 0,
							by: 0,
						}
						arr3 = arr.filter(e => e.cabin === cabins[i] && e.type==='C')
						if (arr3.length !== 0) {
							obj.c = arr3.reduce((x, y) => x + (y.weight - 0), 0)
						}
						arr3 = arr.filter(e => e.cabin === cabins[i] && e.type==='M')
						if (arr3.length !== 0) {
							obj.m = arr3.reduce((x, y) => x + (y.weight - 0), 0)
						}
						arr3 = arr.filter(e => e.cabin === cabins[i] && (e.type==='BY' || e.type==='B'))
						if (arr3.length !== 0) {
							obj.by = arr3.reduce((x, y) => x + (y.weight - 0), 0)
						}
						arr2.push(obj)
					}
					arr2.sort((a, b) => {
						let an = parseInt(a.cabin.match(/\d+/g)[0])
						let bn = parseInt(b.cabin.match(/\d+/g)[0])
						return an - bn
					})
					if (arr2.length !== 0) {
						leg = {
							cabin: key,
							c: arr2.reduce((x, y) => x + parseInt(y.c), 0),
							m: arr2.reduce((x, y) => x + (y.m - 0), 0),
							by: arr2.reduce((x, y) => x + (y.by - 0), 0)
						}
					}
					arr2.unshift(leg)
					this.list = [...arr2, ...this.list]
				}
			},
			addInfo (msg) {
				if (msg) {
					this.additionalInfo = msg.toString()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #FFFF01;
		margin:0 auto;
		width: calc(100vw - 40rpx);
		font-weight: 600;
		.top {
			display: flex;
			justify-content: space-between;
			image {
				height: 40rpx;
				width: 40rpx;
			}
		}
		.main {
			.leg {
				
			}
			.cabin {
				display: flex;
				margin-top: 10rpx;
				.left {
					width: 200rpx;
					text-align: center;
				}
				.right {
					display: flex;
					.value {
						min-width: 100rpx;
						text-align: center;
						margin-right: 30rpx;
					}
				}
			}
		}
	}
</style>
