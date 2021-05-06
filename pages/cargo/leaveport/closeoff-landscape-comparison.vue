<template>
	<view>
		<u-navbar
		  back-text="返回"
		 :background="navBackground"
			back-icon-color="#ffffff"
		 :back-text-style="{
			 'color': '#4191EA'
		 }"
			back-icon-size="50">
			<template v-slot>
				<view class="nav-center">
					<view class="nav-block">
						<view class="flight">
							{{flight}}
						</view>
						<view class="version">
							{{leftVersion}}
						</view>
					</view>
					
					<view class="nav-block">
						<view class="flight">
							装机单差异
						</view>
						<view class="version">
							{{rightVersion}}
						</view>
					</view>
				</view>
			</template>
		</u-navbar>
		
		
		<view class="versionList-comparison-layout">
			<view class="versionList">
				<comparison-list-content
					:show-split-line="true"
					:not-id="true"
					:not-loader="false"
					:content-not-null="true"
					:dont-show-none-list="true"
					ref="leftVersion">
					<template v-slot:cardRight="scope">
						<card
							:loader-list="true"
							:item-ori="scope.item">
						</card>
					</template>
				</comparison-list-content>
			</view>
			<view class="versionList">
				<comparison-list-content
					:show-split-line="true"
					:not-id="true"
					:not-loader="false"
					:content-not-null="true"
					:dont-show-none-list="true"
					ref="rightVersion">
					<template v-slot:cardRight="scope">
						<card
							:loader-list="true"
							:item-ori="scope.item">
						</card>
					</template>
				</comparison-list-content>
			</view>
		</view>
	</view>
</template>

<script>
	import comparisonListContent from '@/pages/cargo/comparison-list-content.vue'
	import card from '@/pages/cargo/cabin-card.vue'
	export default {
		data () {
			return {
				navBackground: {
					'background': '#4191EA'
				},
				flight: '',
				leftVersion: '',
				rightVersion: '',
				leftVersionList: [],
				rightVersionList: [],
				list: []
			}
		},
		components: {
			comparisonListContent,
			card
		},
		onBackPress () {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary');
			
			// #endif
			uni.navigateTo({
				url: `/pages/cargo/transition`
			})
		},
		mounted () {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('landscape-primary');
			// #endif
			
			let leftVersionObj = uni.getStorageSync('leftVersionList')
			this.leftVersion = '第' + leftVersionObj.versionName + '版'
			
			if (leftVersionObj) {
				uni.removeStorageSync('leftVersionList')
				this.leftVersionList = this.initList({
					data: leftVersionObj.list
				})
			}
			
			let rightVersionObj = uni.getStorageSync('rightVersionList')
			this.rightVersion = '第' + rightVersionObj.versionName + '版'
			if (rightVersionObj) {
				uni.removeStorageSync('rightVersionList')
				this.rightVersionList = this.initList({
					data: rightVersionObj.list
				})
			}
			
			// 比较版本
			this.compareList(this.leftVersionList, this.rightVersionList)
			
			
			if (this.leftVersionList && this.rightVersionList) {
				this.$refs.leftVersion.setList(this.leftVersionList)
				this.$refs.rightVersion.setList(this.rightVersionList)
			}
			
		},
		methods: {
			compareList (leftList, rightList) {
				let leftLen = leftList.length
				let rightLen = rightList.length
				let len = leftLen > rightLen ? leftLen : rightLen
				let leftPoi = 0
				let rightPoi = 0
				for (let i = 0, j = 0; i < leftList.length || j < rightList.length; i++,j++) {
					let leftObj = leftList[i]
					let rightObj = rightList[j]
					let lflag = false
					let rflag = false
					// 如果左右两行都有集装器号
					if (leftObj && rightObj && this.compareObj(leftObj, rightObj)) {
						// console.log('比较相同', leftObj.container, i, rightObj.container, j)
					}
					if (leftObj && rightObj && !this.compareObj(leftObj, rightObj)) {
						// console.log('比较不同', leftObj.container, i, rightObj.container, j)
						// 如果左边的集装器在右边找不到，右边的列表在当前行之前加一个空行。
						let rIdx = rightList.findIndex(v => this.compareObj(v, leftObj))
						if (rIdx < i){
							console.log('before-r', rightList[j])
							rightList.splice(j, 0, {
								type: 'empty'
							})
							console.log('after-r', rightList[j])
							leftObj.change = true,
							leftObj.changeBefore = true
							j++
							lflag = true
						}
						
						// 如果右边的集装器在左边找不到，左边的列表在当前行之前加一个空行。
						let lIdx = leftList.findIndex(v => this.compareObj(v, rightObj))
						if (lIdx < j){
							console.log('before-l', leftList[i])
							if (lflag) {
								leftList.splice(i + 1, 0, {
									type: 'empty'
								})
								i++
							} else {
								leftList.splice(i, 0, {
									type: 'empty'
								})
							}
							console.log('after-l', leftList[i])
							rightObj.change = true,
							rightObj.changeAfter = true
						}
					}
				}
			},
			// 不同返回false，相同返回true
			compareObj (a, b) {
				// console.log('compareObj', a, b)
				if (!a || !b) {
					return false
				}
				if (a.containerCode !== b.containerCode
				 || a.destination !== b.destination
				 || a.type !== b.type
				 || a.container !== b.container
				 || a.weight !== b.weight
				 || a.volume !== b.volume) {
					 return false
				 } else {
					 return true
				 }
			},
			initList (res) {
				this.list = []
				if (res.data) {
					this.flight = res.data[0].flight
					this.list = [...this.list, ...res.data]
				}
				return this.list
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-center {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.nav-block {
			width: 50%;
			text-align: center;
			color: #ffffff;
			.flight {
				
			}
			.version {
				
			}
		}
	}
	
	.versionList-comparison-layout {
		display: flex;
		justify-content: space-between;
		.versionList {
			width: 49%;
			
		}
	}
</style>
