<template>
  <view class="monitor-flight-page">
    <view class="nav-bar">
      <view class="left-arror" @tap="back">
      </view>
      <view class="nav-bar-title">
        {{flight}}
      </view>
      <view class="right">
        
      </view>
    </view>
    
    <view class="main">
      
    </view>
  </view>
</template>

<script>
  import {
    
    onError
  } from '@/api/guide/index.js'
  export default {
    data () {
      return {
        flight: '',
        flightId: ''
      }
    },
    
    onLoad (e) {
      this.flight = e.flight
      this.flightId = e.flightId
      console.log('onLod', this.flight, this.flightId)
    },
    
    mounted () {
    },
    
    methods: {
      back () {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="scss">
  .monitor-flight-page {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
      
    .nav-bar {
      position: fixed;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx;
      background-color: #1891ff;
      width: 100vw;
      height: 92rpx;
      
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
    .main {
      margin-top: calc(var(--status-bar-height) + 92rpx);
      height: calc(100% - 92rpx - var(--status-bar-height));
      width: 100%;
      background-color: #f1f1f1;
      overflow: hidden;
      
      
    }
  }
</style>
