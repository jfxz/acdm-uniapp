/*
* 界面名称:卸机
* 界面功能:
* 其他    :
* 时间    :2020-8-22 12:34:11
* 作者    :gyb
*/
<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar
			 title="已操作运输单"
			:content-not-null="true">
			<template v-slot:right><view></view></template>
		</nav-bar>
		
		<!-- 内容 -->
		<template v-if="type=='costly'">
			<list-content
				 ref="listContent"
				:content-not-null="list.length!=0"
				@clickCard="checkPlateBox"
				>
				<template v-slot:cardRight="scope">
					<costly-transfer-card
						:show-upload="false"
						:item="scope.item">
					</costly-transfer-card>
				</template>
			</list-content>
		</template>
		<template v-else>
			<list-content
				 ref="listContent"
				:content-not-null="list.length!=0"
				:show-search-bar="showSearchBar"
				:show-flight-info="true"
				@updateList="updateList"
				:remove-flag="enterFlag"
				:remove-unloader="enterFlag"
				@clickCard="checkPlateBox">
				<template v-slot:cardRight="scope">
					<container-card
						:show-upload="false"
						:item-ori="scope.item">
					</container-card>
				</template>
			</list-content>
		</template>
		
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/nav-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import containerCard from '@/pages/cargo/leaveport/components/container-card.vue'
	import cargoMixin from '@/pages/cargo/cargo-mixin.js'
	import costlyTransferCard from '@/pages/cargo/costly/components/transfer-card.vue'
	import {getOperatedHistory, getCostlyScrolls} from '@/api/cargo/index.js'
	export default {
		mixins: [cargoMixin],
		components: {
			navBar,
			listContent,
			containerCard,
			costlyTransferCard
		},
		data () {
			return {
				selectFlightForm: {
					direction: 'A',
					operationType: 'UNLOADER',
					airportCode: 'ZSAM',
					pageNumber: 0,
					pageSize: 50
				},
				// 用来保存接口返回的航班列表，前端分页
				flightList: [],
				// 刷新列表用
				showList: true,
				displayList: [],
				// 是否航班列表全部加载完毕
				endFlag: false,
				// 记载情况。可选值：loadmore,loading,nomore
				loadStatus: 'loadmore',
				list: [],
				type: '',
				enterFlag: false
			}
		},
		onReachBottom () {
			this.loadmore()
		},
		onLoad (e) {
			this.type = e.type? e.type : ''
			this.direction = e.direction ? e.direction: ''
			if (this.direction === 'A' && this.type !== 'costly') {
				this.enterFlag = true
			}
			if (e.type === 'costly') {
				getCostlyScrolls({
					type: 'SPECIALCARGO'
				}).then(res => {
					if (res.status) {
						this.list = res.data
						this.$nextTick(function(){
							this.$refs.listContent.setList([])
							this.$refs.listContent.setList(this.list)
						})
					}
				})
			} else {
				if (e.hasOwnProperty('direction') && e.direction && e.direction !== '') {
					getOperatedHistory({
						direction: e.direction
					}).then(res => {
						if (res.status) {
							this.list = res.data
							this.$nextTick(function(){
								this.$refs.listContent.setList([])
								this.$refs.listContent.setList(this.list)
							})
						}
					})
				}
			}
			
		},
		methods:{
			generateObj (obj) {
				return {
					images: [],
					images2: [],
					selectedPicNums: 0,
					showItem: true,
					selected: false,
					pass: false,
					...obj,
					carNumber: 0,
					boxNumber: 0,
					boardNumber: 0,
					containerTypes: [],
				}
			},
			updateList (list) {
				this.list = list
			},
			setFlightList (list) {
				this.displayList = []
				var that = this
				this.list.forEach((e, idx, arr1) => {
					let obj = this.generateObj(e)
					if (obj.hasOwnProperty('containerType') && obj.containerType) {
						if (obj.containerType === '0') {
							obj.boxNumber++
						} else if (obj.containerType === '1') {
							obj.boardNumber++
						} else if (obj.containerType === '2') {
							obj.carNumber++
						}
					}
					this.displayList.push(obj)
					arr1[idx] = {...obj}
				})
				setTimeout(function () {
					uni.hideLoading()
				}, 500)
			},
			
			
			checkPlateBox (item) {
			},
			
			loadmore () {
				if (!this.endFlag) {
					this.loadStatus = 'loading'
					let start = this.selectFlightForm.pageNumber * this.selectFlightForm.pageSize
					let end = start + this.selectFlightForm.pageSize
					if (end < this.flightList.length) {
						this.selectFlightForm.pageNumber++
						this.loadStatus = 'loadmore'
					} else {
						end = this.flightList.length - 1
						this.endFlag = true
						this.loadStatus = 'nomore'
					}
					this.list = [...this.list, ...this.flightList.slice(start, end)]
				}
			}
		}
	}
</script>
