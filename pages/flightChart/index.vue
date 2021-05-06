<template>
	<view class="chart-layout">
     <!-- 顶部标题及回退home -->
		<view class="navbar">
			<view class="nav-handle-left">
				<view class="handle-type">
					<image src="../../static/home2x.png" @tap="openAcdmHome"></image>
				</view>
				<view class="handle-type">
				</view>
				<view class="handle-type">
				</view>
			</view>
			<view class="nav-title">
				<text>{{'ACDM'}}</text>
			</view>
			<view class="nav-handle-right">
			</view>
		</view>
    
    <!-- 内容 -->
    <view class="content">
      <view class="content-tab">
        <view class="top-tab">
          <u-tabs  :list="topList" bar-width="80" :current="current" @change="change" font-size="28" active-color="#1890ff">
          </u-tabs>
        </view>
        
        <view class="bottom-tab">
          <u-tabs  :list="bottomList" bar-width="80" :current="current" @change="change" font-size="28" active-color="#1890ff">
          </u-tabs>
        </view>
        
      </view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        bottomList: [
          {name: '进出港'},
          {name: '进港'},
          {name: '出港'}
        ],
        topList: [
          {name: '航班概览'},
          {name: '正常性概览'},
          {name: '放行保障'},
          {name: '货邮概览'},
          {name: '旅客概览'},
          {name: '天气'}
        ],
        current: 0
			}
		},
		onReady() {
		},
		onLoad() {
		},
		methods: {
      change(index) {
        this.current = index;
      },
      // 跳转到主页
      openAcdmHome() {
      	uni.reLaunch({
      		url: '../home/index'
      	})
      }
		}
	}
</script>

<style lang="scss">
  .chart-layout {
    .content {
      position: fixed;
      top: calc(var(--status-bar-height) + 90rpx);
      left: 10rpx;
      right: 10rpx;
      .content-tab {
        .top-tab {
          
        }
        .bottom-tab {
          margin-top: 10rpx;
          .u-scroll-box {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .navbar {
    	display: flex;
    	justify-content: space-between;
    	height: calc(var(--status-bar-height) + 45px);
    	background: #1891ff;
    	padding-top: calc(var(--status-bar-height) + 25rpx);
    	width: 100%;
    	z-index: 10;
    	position: fixed;
    	top: 0;
    	text-align: center;
    
    	.nav-handle-left {
    		display: flex;
    		justify-content: space-around;
    		width: 30%;
    		padding-top: 2rpx;
    
    		.handle-type {
    			image {
    				width: 45rpx;
    				height: 45rpx;
    			}
    		}
    	}
    
    	.nav-title {
    		width: 40%;
    		font-size: 38rpx;
    		line-height: 50rpx;
    		color: #ffffff;
    	}
    
    	.nav-handle-right {
    		width: 30%;
    
    	}
    }
  }
</style>
