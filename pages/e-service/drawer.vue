<template>
  <view class="statistics" :animation="animationData">
    <view class="statistics-up" @tap="showModal">
      <image src="@/static/service/up.gif" :style="upStyle" mode="aspectFit"></image>
    </view>
    <view class="top-title">
      <view class="line left"></view>
      <view class="line right"></view>
    </view>
    <view class="statistics-service-layout">
      <view class="place">
        <view class="line-flight"></view>
        <view class="place-origin" style="text-align: right;">{{currentFlight.originCn}}</view>
        <view class="place-img">
          <view class="place-flight" style="margin-top: -40rpx;">
            {{currentFlight.iataCarrier || ''}}{{currentFlight.flight || ''}}
          </view>
          <view class="flight-img">
            <image src="@/static/service/plane.png" mode="aspectFit"></image>
          </view>
        </view>
        <view class="place-dest" style="text-align: left;">{{currentFlight.destinationCn}}</view>
      </view>
      
      <view class="flightDate">
        {{formatDate(currentFlight.opdate)}}
      </view>
      <view class="flight-detail">
        <view class="detail-item">
          <view class="detail-item-first">
            <view class="detail-item-label">
              航空公司:
            </view>
            <view class="detail-item-value airline">
              {{carrierCn}}
            </view>
          </view>
          
        </view>
        <view class="detail-item">
          <view class="detail-item-first">
            <view class="detail-item-label">
              航班状态:
            </view>
            <view class="detail-item-value">
              <text :class="['status', currentFlight.flightStatus]">
                {{formatStatus(currentFlight.flightStatus)}}
              </text>
            </view>
          </view>
          <view class="detail-item-first right">
            <view class="detail-item-label">
              签署对象:
            </view>
            <view class="detail-item-value">
              <text>航司代表</text>
            </view>
          </view>
          <!-- <view class="detail-item-first right">
            <view class="detail-item-value">
              <text>2020-12-24</text>
            </view>
          </view> -->
        </view>
      </view>
      
      <view class="left-right-layout">
        <view class="left-layout">
          
          <view class="left-layout-first">
            <view class="left-item">
              <view class="">
                <view class="left-item-label">
                  登机口
                </view>
                <view class="left-item-value">
                  {{currentFlight.gate}}
                </view>
              </view>
            </view>
            <view class="left-item">
              <view class="">
                <view class="left-item-label">
                  机位
                </view>
                <view class="left-item-value">
                  {{currentFlight.stand}}
                </view>
              </view>
            </view>
          </view>
          
          <view class="left-layout-first">
            <view class="left-item">
              <view class="">
                <view class="left-item-label">
                  机型
                </view>
                <view class="left-item-value">
                  {{currentFlight.aircraftType}}
                </view>
              </view>
            </view>
            <view class="left-item">
              <view class="">
                <view class="left-item-label">
                  机号
                </view>
                <view class="left-item-value">
                  {{currentFlight.registration}}
                </view>
              </view>
            </view>
          </view>
          <!-- <view class="left-service">
            <text>当前服务项情况:</text>
            <text class="service-status">{{formatService(currentFlight.serviceStatus)}}</text>
          </view> -->
        </view>
        <view class="right-layout">
          <view class="current-status">
            <view class="status-value">当前状态</view>
            <!-- <view :class="['taskStatus', 'taskStatus' + '-' + currentFlight.flightServiceStatus]">
              {{formatTaskStatus(currentFlight.flightServiceStatus)}}
            </view> -->
            <view class="service-status">
              <image :src="statusImg(currentFlight, 'groundSupport')"></image>
              <image :src="statusImg(currentFlight, 'maintenance')"></image>
            </view>
          </view>
          <view class="bottom">
            <button @tap="btnClick">{{judgeBtnLabel}}</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import moment from 'moment'
  import {mapGetters} from 'vuex'
  import {getServiceStatus} from "@/api/sign/index.js"
export default {
  props: {
  },
  data () {
    return {
      currentFlight: {},
      upFlag: false,
      animationData: {}
    }
  },
  computed: {
    ...mapGetters(['remoteDic']),
    carrierCn () {
      let match = this.remoteDic.BASE_AIRLINE.find(item => item.iataCode === this.currentFlight.iataCarrier)
      if (match) {
        return match.cnName
      }
      return ''
    },
    judgeBtnLabel () {
      if (!this.currentFlight.flightServiceStatus) {
        return '发起签署'
      }
      return '查看详情'
    },
    upStyle () {
      if (this.upFlag) {
        return {transform:'rotate(180deg)'}
      }
      return {transform:'rotate(0)','position':'relative', top: '0'}
    }
  },
  onLoad () {
  },
  methods: {
    statusImg (item, flag) {
      if (!item.flightServiceStatus) {
        return ''
      }
      if (item.flightServiceStatus.groundSupport && flag === 'groundSupport') {
        return `../../static/service/icon_gc__${item.flightServiceStatus.groundSupport}.png`
      }
      if (item.flightServiceStatus.maintenance && flag === 'maintenance') {
        return `../../static/service/icon_mt__${item.flightServiceStatus.maintenance}.png`
      }
    },
    formatService (status) {
      console.log('status', status)
      if (status === '0') {
        return '未开始'
      } else if (status === '1') {
        return '进行中'
      } else if (status === '2') {
        return '完成'
      }
      return ''
    },
    formatDate (date) {
    	if (date) {
    		return moment(date).format('YYYY-MM-DD')
    	} else {
    		return '--'
    	}
    },
    btnClick () {
     getApp().globalData.flightDetail = this.currentFlight
     this.showModal()
     setTimeout(() => {
      uni.navigateTo({
        url: '../e-service/index?airline=true'
      }) 
     }, 100)
    },
    /*动画*/
    showModal (flag, flight) {
      console.log('flag', flag)
      this.animation = {}
      if (flag === 'flightClick') {
        this.upFlag = true
      } else {
        this.upFlag = !this.upFlag
      }
      console.log('upFlag', this.upFlag )
      if (this.upFlag && flight.id) {
        this.currentFlight = flight
        // let para = {
        //   flightId: flight.id
        // }
        // getServiceStatus(para).then(res => {
        //   if (res.status) {
        //     this.$set(this.currentFlight, 'serviceStatus', res.data)
        //   }
        // })
      }
      var animation = uni.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
      this.animation = animation
      animation.height(this.upFlag ? '650rpx' : '0').translateY('0').step()
      if (!this.upFlag) {
        animation.translateY('50').step()
      }
      this.animationData = animation.export()
    },
    formatStatus (status) {
      let  baseFlightStatusList = this.remoteDic.BASE_FLIGHT_STATUS
    	if (status && baseFlightStatusList) {
    		let match = baseFlightStatusList.find(item => item.statusCode === status)
    		if (match) {
    			return match.description
    		} else {
    			return '----'
    		}
    	} else {
    		return '----'
    	}
    },
    formatTaskStatus (status) {
    	if (status === '1') {
    		return '待确认'
    	} else if (status === '2') {
    		return '受服务方确认'
    	} else if (status === '3') {
    		return '已完成'
    	}
    }
  }
}
</script>

<style lang="scss">
  .statistics {
    height: 0rpx;
    z-index: 2;
    border-radius: 20rpx 20rpx 0 0;
    border: 8rpx solid #0081ff;
    position: fixed;
    bottom: 0rpx;
    transform: translateY(40px);
    background-color: #FFFFFF;
    width: 100%;
    font-size: 28rpx;
    letter-spacing: 4rpx;
    .top-title {
      display: flex;
      justify-content: space-between;
      padding: 30rpx 30rpx 0 30rpx;
      .line {
        border: 10rpx solid #000000;
        border-bottom: none;
        height: 40rpx;
        width: 40rpx;
        &.left {
          border-right: none;
        }
        &.right {
          border-left: none;
        }
      }
    }
    .statistics-service-layout {
      border-radius: 20rpx;
      padding: 20rpx;
      padding-top: 30rpx;
      .line-flight {
        position: absolute;
        width: 200rpx;
        height: 4rpx;
        background: #448FF7;
        left: 50%;
        top: 30rpx;
        transform: translateX(-50%);
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          width: 10rpx;
          height: 10rpx;
          background: #448FF7;
        }
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          border-radius: 50%;
          transform: translate(50%, -50%);
          width: 10rpx;
          height: 10rpx;
          background: #448FF7;
        }
      }
      .left-right-layout {
        display: flex;
        justify-content: space-between;
        .right-layout {
          width: 40%;
          .bottom {
            button {
              background: #448FF7;
              width: 180rpx;
              height: 180rpx;
              color: #ffffff;
              padding: 40rpx;
              line-height: 50rpx;
              font-weight: bold;
            }
          }
          .current-status {
            margin-top: 20rpx;
            view {
              text-align: center;
              font-size: 32rpx;
              font-weight: bold;
              color: #448FF7;
              line-height: 50rpx;
            }
            .service-status {
              height: 50rpx;
              image {
                height: 50rpx;
                width: 50rpx;
              }
            }
            .taskStatus {
            	$status: ('1': red,
            		'2': #f37b1d,
            		'3': green);
            	@each $key,
            	$value in $status {
            		&.taskStatus-#{$key} {
            			color: $value;
            		}
            	}
            }
          }
        }
        .left-layout {
          width: 60%;
          border-right: 2rpx dashed #c1c0c0;
          .left-service {
            text-align: left;
            margin-top: 30rpx;
            text {
              font-size: 24rpx;
              color: #448FF7;
            }
            .service-status {
              background: #448FF7;
              color: #ffffff;
              padding: 0 20rpx;
              border-radius: 5rpx;
              margin-left: 20rpx;
            }
          }
          .left-layout-first {
           display: flex;
           justify-content: flex-start;
           .left-item {
             width: 50%;
             margin-top: 30rpx;
           }
           .left-item-label {
             color: #448FF7;
             font-size: 24rpx;
             line-height: 30rpx;
           }
           .left-item-value {
             font-size: 44rpx;
             font-weight: bold;
           }
          }
        }
      }
      .flightDate {
        font-size: 36rpx;
        text-align: center;
        margin: -60rpx 0 10rpx 0;
      }
      .flight-detail {
        border-bottom: 2rpx dashed #c1c0c0;
        padding-bottom: 10rpx;
        .detail-item {
          font-size: 30rpx;
          display: flex;
          justify-content: space-between;
          .detail-item-first {
            display: flex;
            justify-content: flex-start;
            line-height: 50rpx;
            .detail-item-value {
              .status {
              	color: #c6c6c6;
              	$mapStatus: (DLY: #e85656, //延误
              		RTN:#e85656, //返航
              		CNL:#576078, //取消
              		ENR: #1890ff, //途中
              		ALT:#2f54eb, // 备降
              		BDP:#faad14, //允许登机BDF
              		BDF:#0ebf9c, //催促登机BDT
              		BDT:#0ebf9c, //过站登机BDC
              		BDO:#0ebf9c, //登机CKI
              		BDC:#e39832, //登机结束DEP
              		DEP:#767c96, //起飞BDO
              		CKI:#d7dfec, //正在直机CKC
              		CKC:#d7dfec, //直机关闭
              		BDS:#d7dfec, //候机RTN
              		ARR: #52c41a); //到达
              
              	@each $wb,
              	$value in $mapStatus {
              		&.#{$wb} {
              			color: $value;
              		}
              	}
              }
              &.airline {
                color: #448FF7;
              }
            }
            .detail-item-label {
              color: #a5a4a4;
            }
            &.right {
              justify-content: flex-end;
            }
            .detail-item-label {
              width: 170rpx;
            }
          }
        }
      }
      .place {
        display: flex;
        justify-content: space-between;
        position: relative;
        height: 120rpx;
        image {
          width: 40rpx;
          height: 40rpx;
        }
        .place-img {
          position: relative;
          text-align: center;
          letter-spacing: 0;
          .flight-img {
            position: absolute;
            top: 12rpx;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .place-origin, .place-dest, .place-flight {
          font-size: 44rpx;
          font-weight: bold;
          width: 30%;
        }
      }
    }
    .statistics-up {
      position: absolute;
      top: -40rpx;
      left: 50%;
      width: 80rpx;
      height: 40rpx;
      border-radius: 80rpx 80rpx 0rpx 0rpx;
      transform: translateX(-50%);
      background: #0081ff;
      image {
        width: 35rpx;
        height: 35rpx;
        position: relative;
        left: 50%;
        top: 50%;
        margin: -18rpx 0 0 -18rpx;
      }
    }
  }
</style>
