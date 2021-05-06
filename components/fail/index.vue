<template>
  <view class="box" @click="reloadData">
    <view class="emptyDiv">加载失败，请点击重新加载</view>
  </view>
</template>
<script>
export default {
  props: {
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
    }
  },
  methods: {
    reloadData () {
      this.$emit('reloadData')
    }
  }
}
</script>
<style lang="scss">
  .box {
    height: 300rpx;
    line-height: 300rpx;
    background: #FFFFFF;
    margin-bottom: 20rpx;
    .emptyDiv {
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>