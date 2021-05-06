<template>
  <view class="collDrawer" :class="{
    'collDrawer-x': !pageCollapse}"
  >
    <view class="collapse-arrow" @click="togglePage" style="height: 100%">
      <u-icon size="40" :name="pageCollapse ? 'arrow-left' : 'arrow-right'"></u-icon>
      <!-- <i :class="['fa', {
          'fa-chevron-right': !pageCollapse,
          'fa-chevron-left': pageCollapse,
        }]"/> -->
    </view>
    <view v-if="!pageCollapse" class="contend">
      <view style="padding: 4rpx 0rpx" class="flex-class">
        <view class="image">
          <image src="@/static/in.png" style="height: 26rpx;transform: rotate(180deg)">
        </view>
        <view class="label">
          <span>进港未执行</span>
        </view>
      </view>
      <view style="padding: 4rpx 0rpx" class="flex-class">
        <view class="image">
          <image src="@/static/out.png" style="height: 26rpx;">
        </view>
        <view class="label">
          <span>出港未执行</span>
        </view>
      </view>
      <view style="padding: 2rpx 0rpx" class="flex-class">
        <view class="image">
          <image src="@/static/implement.png" style="height: 26rpx;transform: rotate(180deg)">
        </view>
        <view class="label">
          <span>进港已执行</span>
        </view>
      </view>
      <view style="padding: 4rpx 0rpx" class="flex-class">
        <view class="image">
          <image src="@/static/implement.png" style="height: 26rpx;">
        </view>
        <view class="label">
          <span>出港已执行</span>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import uIcon from '@/uview-ui/components/u-icon/u-icon.vue'
export default {
  components: {uIcon},
  data () {
    return {
      pageCollapse: true
    }
  },
  mounted () {
  },
  methods: {
    togglePage () {
      this.pageCollapse = !this.pageCollapse
      console.log(this.pageCollapse)
    }
  }
}
</script>
<style lang="scss">
.collDrawer {
  /* float: right; */
  /* position: fixed; */
  /* background: #1e2530; */
  // padding: $padding;
  position: fixed;
  right: 20rpx;
  top: 150rpx;
  z-index: 2;
  height: 80rpx;
  transition: transform .3s ease-in;
  &.collDrawer-x {
    transform: translateX(calc(0rpx));
    .collapse-arrow {
      transform: translateX(-194rpx);
      &:hover {
        transform: translateX(-194rpx) scale(1.3, 1.3);
      }
    }
  }
  .flex-class {
    display: flex;
    .image {
      width: 20%;
    }
    .label {
      width: 80%;
    }
  }
  .collapse-arrow {
    margin-top: 90rpx;
    padding: 0 6rpx;
    width: 30rpx;
    line-height: 2;
    cursor: pointer;
    transition: transform .2s;
    &:hover {
      transform: scale(1.3, 1.3);
    }
  }
  .contend
   {
    position: absolute;
    right: 0rpx;
    top: 20rpx;
    padding: 10rpx 0rpx;
    color: #FFFFFF;
    font-weight: bold;
    font-size: 24rpx;
    width: 180rpx;
    height: 175rpx;
    background-color: #888;
    border-radius: 20rpx;
    /* display: inline-block; */
  }

}
</style>
