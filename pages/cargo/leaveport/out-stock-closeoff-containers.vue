<template>
	<view>
		<nav-bar
			:title="title"
			:show-sort="true"
			:content-not-null="true">
			<template v-slot:right>
				<view class="nav-btns">
					<view @tap="unlock">
						<image src="@/static/closeoff-unlock.png"></image>
					</view>
					<view class="distance" @tap="openVersionModal">
						<image src="@/static/operation-history-search.png" ></image>
					</view>
					<view class="distance" @tap="comparison">
						<image src="@/static/comparison.png" ></image>
					</view>
					<view class="distance" @tap="refreshList">
						<image src="@/static/refresh.png" ></image>
					</view>
				</view>
			</template>
		</nav-bar>
		
		<list-content
			 ref="listContent"
			:not-id="true"
			:content-not-null="list.length!=0"
			:show-search-bar="false"
			:dont-show-none-list="true">
			<template v-slot:cardIcon>
				<image style="width:54rpx;height:54rpx;" src="@/static/flight-cargo.png"></image>
			</template>
			<template v-slot:cardRight="scope">
				<container-card
          style="width: 90%;"
					:sort="true"
					:item-ori="scope.item"
					:show-upload="false">
				</container-card>
			</template>
		</list-content>
		
		<view style="height: 100rpx;width: 100%;"></view>
		
		
		<bottom-bar
			 btn="截关"
			:content-not-null="list.length!=0"
			@confirm="lock">
			<template v-slot:top>
				<view class="page-bottom">
					<span class="font">
						车数:{{carSum}}
					</span>
                    <span class="font" v-if="showContainerTypeSum">
                    	箱数:{{boxSum}}
                    </span>
                    <span class="font" v-if="showContainerTypeSum">
                    	板数:{{boardSum}}
                    </span>
					<span class="font">
						预配总数:{{IFLInumber}}
					</span>
					<span class="font">
						已出库:{{outOfStockSum}}
					</span>
					<span class="font">
						未出库:{{notOutOfStockSum}}
					</span>
					<!-- <span v-if="closeoffNum" class="font">
						已截关:{{closeoffNum}}
					</span> -->
					<span v-if="closeoffTime" class="font">
						截关时间:{{closeoffTime}}
					</span>
          <span v-if="closeOperator" class="font">
          	截关人:{{closeOperator}}
          </span>
				</view>
			</template>
			<template v-slot:left>
				<view></view>
			</template>
			<template v-slot:right>
				<view v-show="refreshFlag" :class="[btnCanPress?'btn':'btn-light']" style="margin-right: 11rpx;" @tap="lock">截关</view>
			</template>
		</bottom-bar>
		
		<version-modal
		 title="查询版本"
		 ref="versionModal"
		 @change="changeVersion">
		</version-modal>
		
		<version-comparison-modal
		 title="版本比对"
		 ref="versionComparisonModal"
		 @change="changeComparisonVersion">
		</version-comparison-modal>
		
		<confirm-modal
			title="新版本提醒"
			ref="confirmModal"
		 @check="remindCheck"
		 @confirm="delayRemind">
		</confirm-modal>
	</view>
</template>

<script>
	import navBar from '@/pages/cargo/leaveport/components/nav-closeoff-bar.vue'
	import listContent from '@/pages/cargo/list-content.vue'
	import containerCard from '@/pages/cargo/leaveport/components/closeoff-container.vue'
	import bottomBar from '@/pages/cargo/bottom-bar.vue'
	import versionModal from '@/pages/cargo/version-modal.vue'
	import versionComparisonModal from '@/pages/cargo/version-comparison-modal.vue'
	import {
		closeoffLock,
		closeoffUnlock,
		onError,
		getCloseoffVersions,
		getLockedStatus,
		getIFLInumber,
		getCloseoffData,
		getCloseoffNumAndTime,
    getCloseOffOperatorAndTime
	} from '@/api/cargo/index.js'
	import { validatenull } from '@/common/util/validate.js'
	import { debounce } from '@/common/util/util.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import {DIC} from '@/common/dic.js'
	import {mapGetters} from 'vuex'
	import confirmModal from '@/pages/cargo/leaveport/components/closeoff-remind-modal.vue'
	export default {
		data () {
			return {
				list: [],
				flight: '',
				title: '出库截关',
				versions: [],
				versionLists: [],
				currentVersion: '',
				btnCanPress: false,
				refreshFlag: true,
				IFLInumber: null,
				carSum: 0,
        boxSum: 0,
        boardSum: 0,
				outOfStockSum: 0,
				notOutOfStockSum: 0,
				cargoStatusD: ['ASSEMBLY', ...DIC.CARGOSTATUSD],
				closeoffTime: undefined,
        closeOperator: null,
				closeoffNum: undefined,
				scheduleDepTime: '',
        showContainerTypeSum: false
			}
		},
		components: {
			navBar,
			listContent,
			containerCard,
			bottomBar,
			versionModal,
			versionComparisonModal,
			confirmModal
		},
		computed: {
			...mapGetters(['newVersionMsg', 'oriCloseOffList'])
		},
		
		watch: {
			newVersionMsg: {
				handler(newval) {
					this.getCloseoffVersionRemind()
				}
			},
			oriCloseOffList: {
				handler(newval) {
					if (!validatenull(this.flight)) {
						let flightObj = newval.find(e => e.flight === this.flight)
						if (!validatenull(flightObj)) {
							this.initList(flightObj.arr)
							this.init(false)
						}
					}
				}
			}
		},
		
		mounted () {
			// this.$loading()
			let list = uni.getStorageSync('closeoff_car')
			if (list) {
        this.list = list
				uni.removeStorageSync('closeoff_car')
                if (this.list && this.list.length > 0 && this.list[0].hasOwnProperty('containerType')) {
                    this.showContainerTypeSum = true
                }
				this.initList(list)
			}
      this.getCloseOffOperatorAndTime()
			this.init()
		},
		onLoad (e) {
			console.log('onLoad', e)
			this.flight = e.flight
			this.flightId = e.flightId
			// this.closeoffTime = e.closeoffTime
      // this.closeoffTime = e.closeOperateTime
			this.scheduleDepTime = e.scheduleDepTime
			this.title = e.flight ? e.flight : this.title
		},
		methods: {
			getCloseoffVersionRemind () {
				let last = uni.getStorageSync('delay-last')
				let now = new Date().getTime()
				let scheduleDepTime = new Date(this.scheduleDepTime).getTime()
				if ((scheduleDepTime - now) < 60 * 60 * 1000) {
					return
				}
				if (last) {
					if (last.msg !== this.newVersionMsg) {
						uni.removeStorageSync('delay-last')
						this.$refs.confirmModal.open(this.newVersionMsg)
					} else {
						if (now - lastTime > 5 * 60 * 1000) {
							this.$refs.confirmModal.open(this.newVersionMsg)
						}
					}
				} else {
					this.$refs.confirmModal.open(this.newVersionMsg)
				}
			},
      // todo
			lock: debounce(function () {
        
        
        // return
				if (!this.btnCanPress) {
					let containers = this.list.filter(e => validatenull(e.stockPerson) || validatenull(e.stockedTime))
					if (containers.length > 0) {
						let msg = containers.map(e => e.containerCode).toString()
						this.$message(`该航班有未出库的集装器${msg}，不允许截关`)
					} else {
						this.$message(`已截关`)
					}
					return
				}
				this.$loading()
				closeoffLock(this.list).then(res => {
					console.log('closeoffLock', res)
					if (res.status) {
						this.btnCanPress = false
            this.refreshList()
            this.getCloseOffOperatorAndTime()
						this.$forceUpdate()
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}),
			unlock: debounce(function () {
				this.$loading()
				console.log('this.flight', this.flight)
				closeoffUnlock({
				  flightNo: this.flight
				}).then(res => {
					console.log('closeoffUnlock-res', res)
					if (res.status) {
						this.btnCanPress = true
						this.$forceUpdate()
					}
					this.$message(res.message)
					uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}),
			remindCheck (flight) {
				let flightObj = this.list.find(e => e.flight === flight)
				if (!flightObj) {
					this.$message('出库截关无此航班')
					return
				}
				let arr = flightObj.arr
				let flightId = ''
				if (!validatenull(arr)) {
					uni.setStorageSync('closeoff_car', arr)
					flightId = arr[0].flightId
					uni.navigateTo({
						url: `/pages/cargo/leaveport/out-stock-closeoff-containers?flight=${flight}&flightId=${flightId}`
					})
				} else {
					this.$message('该航班无集装器数据')
				}
			},
			comparison: debounce(function () {
				if (validatenull(this.versions)) {
					this.$message('当前版本为空')
					return
				}
				this.$refs.versionComparisonModal.open(this.versions)
			}),
			openVersionModal: debounce(function () {
				if (validatenull(this.versions)) {
					this.$message('当前版本为空')
					return
				}
				this.$refs.versionModal.open(this.versions, this.currentVersion)
			}),
			
			changeVersion: debounce(function (version) {
				this.currentVersion = version
				console.log('changeVersion', version)
				let versionName = version.match(/\d+/g)[0]
				let versionList = this.versionLists.find(e => e.versionName === versionName)
				if (versionList) {
					uni.setStorageSync('closeoff_versionlist', versionList.list)
					uni.navigateTo({
						url: `/pages/cargo/leaveport/out-stock-closeoff-containers-version?versionName=第${versionName}版`
					})
				}
			}),
			
			// 查询版本
			getVersions (hideloadingFlag = true) {
				let obj = {
					flight: this.flight,
					flightId: this.flightId
				}
				console.log('before-getCloseoffVersions', obj)
				getCloseoffVersions(obj).then(res => {
					console.log('getCloseoffVersions', res)
					if (res.status && !validatenull(res.data)) {
						this.versions = []
						this.versionLists = []
						let max = 0
						for (let key in res.data) {
							let intKey = parseInt(key)
							if (max < intKey) {
								max = intKey
							}
							res.data[key].forEach(e => {
								e.containerCode = e.uldCode
								e.opDate = dayjs(e.createTime).format('YYYY-MM-DD')
							})
							this.versions.push('第' + key + '版')
							this.versionLists.push({
								versionName: key,
								list: res.data[key]
							})
						}
						this.currentVersion = '第' + max + '版'
						let versionList = this.versionLists.find (e => e.versionName === max)
					}
					if (validatenull(res.data)) {
						// 全部版本（只有版本名）
						this.versions = []
						// 全部版本（带集装器详细信息）
						this.versionLists = []
						this.currentVersion = ''
					}
					// this.$message(res.message)
					if (hideloadingFlag) {
						uni.hideLoading()
					}
				}).catch(err => {
					onError(err)
				})
			},
			
			changeComparisonVersion: debounce(function (leftVersion, rightVersion) {
				console.log('cargo-mixin', leftVersion, rightVersion)
				// 必须同时选择两个版本才能比对版本
				if (leftVersion !== '' && rightVersion !== '') {
					uni.setStorageSync('leftVersionList', this.versionLists.find(v => v.versionName === leftVersion.match(/\d+/g)[0]))
					uni.setStorageSync('rightVersionList', this.versionLists.find(v => v.versionName === rightVersion.match(/\d+/g)[0]))
					uni.navigateTo({
						url: `/pages/cargo/leaveport/landscape-comparison`
					})
				}
			}),
			
			compareStatus (statusA, statusB) {
				let idxA = this.cargoStatusD.findIndex(e => e === statusA)
				let idxB = this.cargoStatusD.findIndex(e => e === statusB)
				if (idxA < 0 && idxB < 0) {
					return 0
				} else {
					return idxA - idxB
				}
			},
			
			initList (list) {
				console.log('initlist', list)
				let index = 0
				this.list = list.map(e => {
					return {
						...e,
						// id: index++,
						containerCode: e.uldCode,
						flight: e.flightNo,
						stockedTime: e.stockedTime ? dayjs(e.stockedTime).format('YYYY-MM-DD') : ''
					}
				})
				this.list.sort((a, b) => {
					return this.compareStatus(a.status, b.status)
				})
                if (this.showContainerTypeSum) {
                    this.carSum = this.list.filter(e => e.containerType === '2').length
                    this.boardSum = this.list.filter(e => e.containerType === '1').length
                    this.boxSum = this.list.filter(e => e.containerType === '0').length
                } else {
                    this.carSum = this.list.length
                }
				this.outOfStockSum = this.list.filter(e => !validatenull(e.stockedTime) && !validatenull(e.stockPerson)).length
				this.notOutOfStockSum = this.list.length - this.outOfStockSum
				this.$refs.listContent.setList(this.list)
				this.getCloseoffVersionRemind()
			},
			
			init (hideloadingFlag = true) {
				let container = this.list.find(e => validatenull(e.stockPerson) || validatenull(e.stockedTime))
				if (container) {
					this.btnCanPress = false
				} else {
					this.btnCanPress = true
					getLockedStatus({
					  flightNo: this.flight
					}).then(res => {
						console.log('getLockedStatus-res', res)
						if (res.status) {
							if (res.data.locked) {
								this.btnCanPress = false
								try {
									if (res.data.closeOffTime) {
										this.closeoffTime = dayjs(res.data.closeOffTime).format('HH:MM:ss')
									}
								} catch (err) {
									console.log('err', err)
								}
							}
						}
						if (hideloadingFlag) {
							uni.hideLoading()
						}
						this.$forceUpdate()
					}).catch(err => {
						onError(err)
						this.$forceUpdate()
					})
					
				}
				if (hideloadingFlag) {
					uni.hideLoading()
				}
				// 获取所有版本信息
				this.getVersions(hideloadingFlag)
				
				getIFLInumber({
					flightNo: this.flight,
				  flightId: this.flightId
				}).then(res => {
					console.log('getIFLInumber', res)
					if (res.status && res.data) {
						this.IFLInumber = res.data
					} else {
						this.IFLInumber = 0
					}
					if (hideloadingFlag) {
						uni.hideLoading()
					}
				}).catch(err => {
					this.IFLInumber = 0
					onError(err)
				})
				// this.getCloseoffNumAndTime(hideloadingFlag)
			},
			
			// 刷新集装器列表
			refreshList: debounce(function () {
				this.$loading()
				let today = dayjs().format('YYYY-MM-DD')
				let tomo = dayjs().add(1, 'day').format('YYYY-MM-DD')
				let list = []
				getCloseoffData().then(res => {
					console.log('getCloseoffData-res', res)
					if (res.status && res.data) {
						this.list = []
						let closeOffList = []
						let index = 0
						for (let key in res.data) {
							let arr = [...res.data[key]]
							let closeoffTimeObj = arr.find(e => e.closeOffTime)
							let obj = {
								id: index++,
								flight: key,
								flightId: arr.length > 0 ? arr[0].flightId: '',
								opDate: '',
								status: '',
								number: arr ? arr.length : 0,
								abnormal: false,
								closeOffSum: arr.length,
								closeoffTime: closeoffTimeObj ? closeoffTimeObj.closeOffTime : 0,
								scheduleDepTime: closeoffTimeObj ? closeoffTimeObj.scheduleDepTime : undefined,
								abNumber: 0,
								arr: arr
							}
							if (arr[0].opDate) {
								obj.opDate = arr[0].opDate.substr(0, 10)
							}
							closeOffList.push(obj)
						}
						
						try {
							if (closeOffList[0].closeoffTime) {
								closeOffList.sort((a, b) => b.closeoffTime - a.closeoffTime)
								closeOffList = closeOffList.slice(0, 7)
							}
						} catch (err) {
							console.log('err', err)
						}
						this.$store.dispatch('setOriCloseOffList', closeOffList)
						this.getCloseoffVersionRemind()
						uni.hideLoading()
					}
				}).catch(err => {
					onError(err)
				})
			}),
			
			// 获取该航班的截关车数和截关时间
			getCloseoffNumAndTime (hideloadingFlag = true) {
				if (validatenull(this.list)) {
					this.closeoffNum = 0
				}
				getCloseoffNumAndTime({
				  flightId: this.flightId
				}).then(res => {
					console.log('getCloseoffNumAndTime-res', res)
					if (res.status && res.data) {
						this.closeoffNum = res.data.closeOffNum
            this.closeOffTime = res.data.closeOffTime
					}
					if (hideloadingFlag) {
							uni.hideLoading()
					}
				}).catch(err => {
					onError(err)
				})
			},
			
			delayRemind () {
				let now = new Date().getTime()
				uni.setStorageSync('delay-last', {
					msg: this.newVersionMsg,
					time: now
				})
			},
      
      getCloseOffOperatorAndTime () {
        getCloseOffOperatorAndTime({
          flightId: this.flightId
        }).then(res => {
          console.log('getCloseOffOperatorAndTime-res', res)
          if (res.status && res.data) {
            this.closeoffTime = res.data.closeOperateTime
            this.closeOperator = res.data.closeOperator
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
	.nav-btns {
		display: flex;
		flex-direction: row-reverse;
		width: 70%;
		.distance {
			margin-right: 30rpx;
		}
		image {
			width:44rpx;
			height:44rpx;
		}
	}
	
	.btn-light {
		opacity: 0.3;
		width: 137rpx;
		height: 69rpx;
		border-radius: 35rpx;
		margin-right: 11rpx;
		border: solid 1rpx #2675e5;
		text-align: center;
		line-height: 63rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #008ffd;
	}
	
	.btn {
		width: 137rpx;
		height: 69rpx;
		border-radius: 35rpx;
		margin-right: 11rpx;
		border: solid 1rpx #2675e5;
		text-align: center;
		line-height: 63rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 33rpx;
		letter-spacing: 2rpx;
		color: #008ffd;
	}
	
	.list-content-style {
		height: calc(100% - 200rpx)!important;
		overflow: hidden;
	}
	
	.page-bottom {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		position: fixed;
		bottom: 100rpx;
		width: 100vw;
		padding: 12rpx 0;
		background-color: #fff;
		.font {
			margin-right: 10rpx;
			font-weight: 900;
			font-size: 35rpx;
		}
	}
</style>
