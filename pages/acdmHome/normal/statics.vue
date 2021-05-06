<template>
  <view class="statics_mobile_white">
    <view class="viewS" v-if="needDetail">
      <view class="img-name">
        <view class="image"><image :src="srcImg" style="margin-top: 10rpx;margin-right:16rpx;width: 88rpx;height: 88rpx" /></view>
        <view class="name">
          <view class="bigName">{{ dataS.name }}</view>
          <view class="smallName">延误架次/已执行架次</view>
        </view>
      </view>
      <view class="num">
        <view :style="{ color: dataS.color }" class="value">
          <span class="bigValue">{{ dataS.value || 100 }}</span>
          <span class="type" v-if="needPercent">%</span>
          <i v-if="showArrow" :class="dataS.direction ? 'el-up-arrow' : 'el-down-arrow'"></i>
        </view>
        <view style="width: 100%;text-align: right">
          <span class="detail" style="color: red">{{ dataS.top || 0 }}</span>
          <span class="detail">/{{ dataS.bottom || 0 }}</span>
        </view>
      </view>
    </view>
    <view class="viewS" v-else>
      <view class="img-name" style="width: 90%">
        <view class="image"><image :src="srcImg" style="margin-top: 10rpx;margin-right:16rpx;width: 88rpx;height: 88rpx" /></view>
        <view class="name">
          <view class="bigName">{{ dataS.name }}</view>
          <view class="smallName">{{ dataS.eventtime }}</view>
        </view>
      </view>
      <view :style="{ color: dataS.color }" class="value">
        <view>
          <view>
            <span class="bigValue">{{ dataS.value || 100 }}</span>
            <span class="type" v-if="needPercent">%</span>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import DayImg from '@/static/charts/day.png'

export default {
  props: {
    dataS: {
      type: Object,
      default () {
        return {
          name: '当天放行率',
          value: 0,
          color: '#f5222d'
        }
      }
    },
    srcImg: {
      type: String,
      default: DayImg
    },
    needDetail: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: Boolean,
      default: false
    },
    needPercent: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    console.log('dataS11', this.dataS)
  }
}
</script>
<style lang="scss" scoped>
.statics_mobile_white {
  .viewS {
    height: 180rpx;
    background: white;
    border-radius: 12rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin-bottom: 20rpx;
    padding: 0 20rpx;

    .img-name {
      display: flex;
      flex-direction: row;
      align-items: center;

      .name {
        display: flex;
        flex-direction: column;

        .bigName {
          height: 56rpx;
          line-height: 56rpx;
          text-align: left;
          color: rgb(0, 0, 0);
          font-size: 32rpx;
        }

        .smallName {
          width: 400rpx;
          text-align: left;
          font-size: 28rpx;
          color: #999999;
        }
      }
    }

    .num {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 30%;

      .detail {
        width: 100%;
        color: black;
        text-align: right;
      }
    }

    .value {
      width: 100%;
      text-align: right;

      .bigValue {
        height: 56rpx;
        line-height: 56rpx;
        font-size: 48rpx;
        font-weight: bold;
      }

      .type {
        font-size: 32rpx;
      }

      .top {
        color: #f5222d;
        background-color: #e8e8e8;
      }

      .bottom {
        color: rgba(255, 255, 255, 0.85);
        background-color: #464c54;
      }
    }
  }
}
</style>
