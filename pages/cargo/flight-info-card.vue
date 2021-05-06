<template>
	<view class="flight-card">
    <view class="flight-card-top">
      <view class="left" style="height:100rpx;width: 100rpx;">
      	<image src="@/static/plane-flight.png"></image>
      </view>
      <view class="right" v-if="show">
      	<view class="top">{{join?(this.flight.iataCarrier + this.flight.flight):this.flight.flight || '无'}}</view>
      	<view class="flight-card-bottom">
      		<view class="flight-item">
      			<view class="font">机号</view>
      			<view class="value">{{flight.registration || '无'}}</view>
      		</view>
      		<view class="flight-item">
      			<view class="font">机位</view>
      			<view class="value">{{flight.standCode || flight.stand || '无'}}</view>
      		</view>
      		<view class="flight-item" style="margin-right: 26rpx;">
      			<view class="font">目的站</view>
      			<view class="value">{{flight.destination || '无'}}</view>
      		</view>
      	</view>
      </view>
    </view>
    <view class="flight-card-bottom">
      <template v-if="isInstalledAudit">
        <view class="search">
          <view class="search-input">
            <input  confirm-type="search" @confirm="confirm" style="width: 92%;" placeholder="输入机号核对" v-model="inputValue"/>
            <image v-if="inputValue!=''"  style="height:40rpx;width:40rpx;" src="@/static/input-delete-grey.png" @tap="resetInputValue"></image>
          </view>
          <view class="btn" @tap="confirm">确定</view>
        </view>
      </template>
    </view>
    
    <warn-dialog ref="warnDialog"></warn-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
	</view>
</template>

<script>
  import { debounce } from '@/common/util/util.js'
  import warnDialog from './installed-audit-warn-dialog.vue'
  import confirmDialog from './installed-audit-confirm-dialog.vue'
	export default {
		props: {
			itemOri: {
				type: Object,
				default: () => {}
			},
			// 是否拼接航班号
			join: {
				type: Boolean,
				default: true
			},
      isInstalledAudit: {
        type: Boolean,
        default: false
      }
		},
    
    components: {
      warnDialog,
      confirmDialog
    },
    
		data () {
			return {
				flight: {
					
				},
				show: true,
        inputValue: ''
			}
		},
		watch: {
			itemOri: {
				handler (newval) {
					this.flight = newval
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			setFlightInfo (flight) {
				this.flight = flight
			},
      confirm: debounce(function () {
        let {registration} = this.flight
        if (this.inputValue !== registration) {
          this.$refs.warnDialog.open()
        } else {
          this.$refs.confirmDialog.open()
        }
      }),
      
      resetInputValue: debounce(function () {
        this.inputValue = ''
      })
		}
	}
</script>

<style lang="scss" scoped>
	.flight-card {
    .flight-card-top {
      display: flex;
      margin-top: 18rpx;
      width: calc(100vw - 40rpx);
      background-color: #2ac815;
      padding: 42rpx 0 37rpx 28rpx;
      .left {
      	margin-right: 35rpx;
      	image {
      		width: 87rpx;
      		height: 87rpx;
      	}
      }
      .right {
      	width: 100%;
      	.top {
      		font-size: 35rpx;
      		letter-spacing: 2rpx;
      		color: #ffffff;
      	}
      	.flight-card-bottom {
      		display: flex;
      		justify-content: space-between;
      		background-color: #2ac815;
      		width: 100%;
      		margin-right: 26rpx;
      		.flight-item {
      			font-size: 25rpx;
      			letter-spacing: 1rpx;
      			color: #ffffff;
      			font-family: SourceHanSansSC-Regular;
      			text-align: center;
      			.font {
      				font-size: 25rpx;
      				letter-spacing: 2rpx;
      				opacity: 0.55;
      				color: #ffffff;
      			}
      			.value {
      				font-size: 33rpx;
      				opacity: 1;
      			}
      		}
      	}
      }
    }
    
    .flight-card-bottom {
      position: relative;
      .search {
        position: absolute;
      	display: flex;
      	height: 125rpx;
        width: calc(100%);
        // top: calc(var(--status-bar-height) + 92rpx);
        z-index: 99;
        padding: 20rpx 20rpx;
        // width: 100%;
      	// padding: 33rpx 20rpx 0rpx 20rpx;
        // padding-top: calc(var(--status-bar-height) + 173rpx);
        background-color: #2AC815  !important;
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
          position: relative;
          top: -2rpx;
      		width: 157rpx;
      		background-color: #1891ff;
      		text-align: center;
      		line-height: 85rpx;
      		font-size: 32rpx;
      		font-family: SourceHanSansSC-Regular;
      		font-size: 32rpx;
      		letter-spacing: 2rpx;
      		color: #fefefe;
      	}
      }
    }
	}
</style>
