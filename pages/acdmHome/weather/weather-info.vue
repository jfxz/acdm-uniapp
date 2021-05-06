<template>
  <view class="weatherview_mobile_white">
    <view>
      <view class="name">{{ weartherData.name }}</view>
    </view>
    <view class="img"><image :src="weartherData.inmSrc" mode="aspectFit"></image></view>
    <view class="middle">
      <view>{{ weartherData.value }}</view>
    </view>
  </view>
</template>
<script>
import Mist from '@/static/charts/mist.png'

export default {
  props: {
    weartherData: {
      type: Object,
      default() {
        return {
          name: '轻雾',
          value: '0',
          inmSrc: Mist
        }
      }
    }
  }
}
</script>

<style lang="scss">
.weatherview_mobile_white {
  height: 200rpx;
  /*display: flex;*/
  /*flex-direction: column;*/
  /*justify-content: space-between;*/
  /*align-items: center;*/
  padding: 0 20rpx;

  .middle {
    width: 100%;
    font-size: 36rpx;
    line-height: 36rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    margin-top: 24rpx;
  }
  .img {
    text-align: center;
  }
  image {
    width: 72rpx;
    height: 60rpx;
    padding-top: 10rpx;
  }

  .name {
    width: 160rpx;
    height: 44rpx;
    border-radius: 6rpx;
    /*border: solid 1rpx rgba(255, 255, 255, 0.85);*/
    opacity: 0.45;
    text-align: center;
    margin: 0 auto;
    font-size: 28rpx;
    padding: 0 10rpx;
    color: #000000;
  }
}
</style>
