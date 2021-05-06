<template>
  <view class="monitor-flight-page">
    <view :class="{'nav-bar': true}">
      <view class="left-arror" @tap="back">
      </view>
      <view class="nav-bar-title">
        引导单监控视图
      </view>
      <view class="right">
        <image style="width:30rpx;height:44rpx;" src="@/static/input-cargo-sm.png" @tap="changeSearchBarStatus"></image>
      </view>
    </view>
    <template v-if="showSearchBar">
      <view class="search">
        <view class="search-input">
          <input  confirm-type="search" @confirm="searchFlight" style="width: 92%;" placeholder="请输入航班号" v-model="inputValue"/>
          <image v-if="inputValue!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="resetInputValue"></image>
        </view>
        <view class="btn" @tap="searchFlight">确定</view>
      </view>
    </template>
    
    <view :class="{'main': true, 'show-search-bar': showSearchBar, 'hide-search-bar': !showSearchBar}">
      <block v-for="(flightObj, index) in flightArr" :key="index">
        <view class="flight-card" @tap="getGuideTimelineByflightId(flightObj)">
          <view class="flight-card-top">
            <view class="flight-card-left">
              {{flightObj.flight}}
            </view>
            <image
              src="/static/down_circle.png"
             :class="{'arror': true, 'expand': flightObj.showTimeline, 'hide': !flightObj.showTimeline}">
            </image>
          </view>
          <view :class="flightObj.showTimeline?'show-timeline':'hide-timeline'">
            <view class="timeline-layout">
            	<view class="vertical-line"></view>
            	<block v-for="(operation, index) in flightObj.operations" :key="operation.title">
            		<view class="history-block">
            			<view class="circle" :style="{'border-color':index==0?'#3386F1':'#d8d8d8'}"></view>
            			<view class="history-block-top">
            				<view class="history-block-top-time" :style="{color: index==0?'#333333':'#999999'}">
            					{{operation.operateTime}}
            				</view>
            				<view class="status" :style="{color: index==0?'#333333':'#999999'}">
            					{{operation.title}}
            				</view>
            			</view>
            			<view class="history-block-bottom" :style="{color: index==0?'#333333':'#999999'}">
            				{{operation.description}}
            			</view>
            		</view>
            	</block>
            </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
  import dayjs from '@/common/util/dayjs.min.js'
  import {
    getAllGuideFlights,
    getGuideTimelineByflightId,
    onError
  } from '@/api/guide/index.js'
  export default {
    data () {
      return {
        flightArr: [],
        flightArrBackup: [],
        page: {
          pageSize: 15,
          pageNumber: 0
        },
        showSearchBar: false,
        inputValue: ''
      }
    },
    
    mounted () {
      this.getAllGuideFlights()
    },
    
    onPullDownRefresh () {
      console.log('onPullDownRefresh')
    },
    
    onReachBottom () {
      
      console.log('reachBottom')
      this.loadList()
    },
    
    methods: {
      back () {
        uni.navigateBack()
      },
      
      // 获取当日所有引导单相关航班
      getAllGuideFlights () {
        this.$loading()
        getAllGuideFlights().then(res => {
          console.log('getAllGuideFlights-res', res)
          if (res.status) {
            this.flightArrBackup = res.data
            this.flightArr = res.data.slice(0, this.page.pageSize)
          } else {
            this.$message(res.message)
          }
          uni.hideLoading()
        }).catch(err => {
          onError(err)
        })
      },
      
      // 通过航班id获取该航班的引导单时间线
      getGuideTimelineByflightId (flightObj) {
        if (flightObj.showTimeline) {
          flightObj.showTimeline = !flightObj.showTimeline
          this.$forceUpdate()
          return
        }
        let {flightId} = flightObj
        getGuideTimelineByflightId({
          flightId: flightId
        }).then(res => {
          console.log('getGuideTimelineByflightId-res', res)
          if (res.status && res.data) {
            flightObj.operations = this.initOperations(res.data)
            flightObj.showTimeline = true
            console.log('this.flightArr', this.flightArr)
            this.$forceUpdate()
          } else {
            this.$message(res.message)
          }
          uni.hideLoading()
        }).catch(err => {
          onError(err)
        })
      },
      
      // 格式化引导单时间线
      initOperations (operations) {
        operations.forEach(e => {
          e.operateTime = dayjs(e.operateTime).format('HH:mm:ss')
          if (e.type.indexOf('ToGate') > -1) {
            e.description = `${e.operator}开往登机口`
          } else if (e.type.indexOf('ToStand') > -1) {
            e.description = `${e.operator}开往机位`
          } else if ((e.type.indexOf('CarCheck') > -1) || (e.type.indexOf('Gate') > -1 && e.type.indexOf('Check') > -1)) {
            e.description = `${e.operator}核对`
          } else {
            e.description = `${e.operator}确认`
          }
        })
        return operations
      },
      
      loadList () {
        this.page.pageNumber++
        let start = this.page.pageSize * this.page.pageNumber
        let end = start + this.page.pageSize
        this.flightArr = [...this.flightArr, ...this.flightArrBackup.slice(start, end)]
      },
      
      changeSearchBarStatus () {
        this.showSearchBar = !this.showSearchBar
      },
      
      resetInputValue () {
        this.inputValue = ''
        this.page.pageNumber = 0
        this.flightArr = this.flightArrBackup.slice(0, this.page.pageSize)
      },
      
      searchFlight () {
        let e = this.inputValue
        console.log('justTest')
        if (e === '') {
        	this.page.pageNumber = 0
        	this.flightArr = this.flightArrBackup.slice(0, this.page.pageSize)
        } else {
        	e = e.toUpperCase()
        	let flights = this.flightArrBackup.filter(v => v.flight && v.flight.toUpperCase().indexOf(e) > -1)
          this.flightArr = flights
        }
      }
    }
  }
</script>

<style lang="scss">
  .monitor-flight-page {
    width: 100vw;
    // height: 100vh;
    // overflow: hidden;
      
    .nav-bar {
      
      position: fixed;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx;
      padding-top: calc(var(--status-bar-height));
      background-color: #1891ff;
      width: 100vw;
      height: calc(var(--status-bar-height) + 92rpx);
      z-index: 99;
      // padding-bottom: 92rpx;
      .left-arror {
        width: 32rpx;
        height: 32rpx;
        border-top: 5rpx solid #fff;
        border-left: 5rpx solid #fff;
        transform: rotate(-45deg);
      }
      
      .nav-bar-title {
        font-size: 38rpx;
        color: #ffffff;
      }
    }
    
    .show-search-bar {
      margin-top: 240rpx;
    }
    
    .hide-search-bar {
      margin-top: calc(var(--status-bar-height) + 122rpx);
    }
    
    .main {
      
      // height: calc(100% - 92rpx - var(--status-bar-height));
      width: 100%;
      background-color: #f1f1f1;
      // overflow: hidden;
      // overflow-y: auto;
      
      .flight-card {
        margin: 20rpx auto 0 auto;
        width: calc(100% - 20rpx);
        padding: 20rpx 20rpx;
        border-radius: 15rpx;
        background-color: #fff;
        
        .flight-card-top {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .flight-card-left {
            font-size: 36rpx;
            color: #24292E;
          }
          .arror {
            width: 27rpx;
            height: 27rpx;
            position: absolute;
            right: 33rpx;
          }
          .expand {
            transform: rotate(180deg);
            transition: all 0.9s ease-in-out;
          }
          .hide {
            transform: rotate(0deg);
            transition: all 0.5s ease-in-out;
          }
        }
        
        .show-timeline {
          width: 100%;
          max-height: 200vh;
          overflow: hidden;
          opacity: 1;
          transition: all 0.4s ease;
        }
        
        .hide-timeline {
          width: 100%;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s ease;
        }
        
        .timeline-layout {
        	position: relative;
          left: 20%;
        	margin-bottom: 12rpx;
        	.vertical-line {
        		position: absolute;
        		top: 37rpx;
        		border-left: 1rpx solid #d8d8d8;
        		width: 0;
        		height: calc(100% - 47rpx);
        		left: calc(20% + 50rpx);
        	}
        	
        	.history-block {
        		position: relative;
        		margin-top: 40rpx;
        		.history-block-top {
        			display: flex;
        			align-items: center;
        			padding-left: 39rpx;
        			.history-block-top-time {
        				font-family: SourceHanSansCN-Regular;
        				font-size: 28rpx;
        				color: #999999;
        				opacity: 0.99;
        			}
        			.status {
        				position: relative;
        				margin-left: 85rpx;
        				font-weight: bold;
        				font-family: SourceHanSansCN-Medium;
        				font-size: 35rpx;
        				color: #999999;
        			}
        		}
        		.history-block-bottom {
        			margin-top: 13rpx;
        			padding-left: 285rpx;
        			font-family: SourceHanSansCN-Regular;
        			font-size: 28rpx;
        			color: #999999;
        			opacity: 0.99;
        		}
        	}
        }
        
        .circle {
        	position: absolute;
        	top: 15rpx;
        	left: calc(20% + 50rpx);
        	transform: translateX(-50%);
        	width: 22rpx;
        	height: 22rpx;
        	border-radius: 11rpx;
        	border: 6rpx solid #d8d8d8;
        	background-color: #ffffff;
        }
      }
    }
  }
  
  .search {
    position: fixed;
  	display: flex;
  	height: 125rpx;
    width: calc(100vw);
    top: calc(var(--status-bar-height) + 92rpx);
    z-index: 99;
    padding: 20rpx 20rpx;
    // width: 100%;
  	// padding: 33rpx 20rpx 0rpx 20rpx;
    // padding-top: calc(var(--status-bar-height) + 173rpx);
    background-color: #1891ff !important;
  	.search-input {
  		width: calc(100% - 156rpx);
  		background-color: #e9e9e9;
  		font-size: 30rpx;
  		color: #A8ABB8;
  		display: flex;
  		align-items: center;
  		padding-left: 33rpx;
  	}
  	.btn {
  		width: 157rpx;
  		background-color: #18BD52;
  		text-align: center;
  		line-height: 85rpx;
  		font-size: 32rpx;
  		font-family: SourceHanSansSC-Regular;
  		font-size: 32rpx;
  		letter-spacing: 2rpx;
  		color: #fefefe;
  	}
  }
</style>
