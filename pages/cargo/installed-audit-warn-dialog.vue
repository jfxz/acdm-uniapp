<template>
  <view class="installed-audit-warn-dialog">
    <view class="cu-modal" :class="showModal==true?'show':''">
    	<view class="cu-dialog" style="max-width:582rpx;border-radius: 21upx;">
    		<view class="action" @tap="close">
    			<image src="@/static/close-popup.png" class="action-image"></image>
    		</view>
    		<view class="plate-box-modal-title">
    		</view>
    		<view class="modal-dialog-layout">
    			<view class="top">
    			</view>
    			<view class="middle">
    				机号不一致
    			</view>
    			
    			<view class="btns">
    				<view class="cancel" @tap="close">确定</view>
    			</view>
    			
    		</view>
    	</view>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        showModal: false
      }
    },
    
    methods: {
      open () {
        this.showModal = true
      },
      
      close () {
        this.showModal = false
      }
    }
  }
</script>

<style lang="scss">
  .action {
  	.action-image {
  		height:61rpx;
  		width:61rpx;
  		position:absolute;
  		right:0rpx;
  		z-index:99999;
  	}
  }
  .plate-box-modal-title {
  	// background-color: #1890ff;
    background-color: red;
  	height:62rpx;
  	width:100%;
  	font-family: SourceHanSansSC-Medium;
  	font-size: 35rpx;
  	color: #ffffff;
  	text-align:center;
  	line-height:65rpx;
  }
  
  .modal-dialog-layout {
  	padding-bottom: 20rpx;
  	padding-left: 37rpx;
  	padding-right: 37rpx;
  	.top {
  		font-family: SourceHanSansSC-Regular;
  		font-size: 25rpx;
  		letter-spacing: 1rpx;
  		color: #7b848c;
  	}
  	
  	.middle {
  		margin: 47rpx 65rpx 56rpx 65rpx;
  		color: red;
  		.value {
  			margin-bottom: 30rpx;
  			font-family: Roboto-Regular;
  			font-size: 29rpx;
  			font-weight: normal;
  			font-stretch: normal;
  			line-height: 29rpx;
  			letter-spacing: 1rpx;
  			font-weight: 700;
  			color: #2d3033;
  		}
  	}
  	
  	.btns  {
  		display: flex;
  		width: 100%;
  		justify-content: center;
  		.cancel {
  			width: 206rpx;
  			height: 69rpx;
  			line-height: 63rpx;
  			border-radius: 35rpx;
  			// border: solid 1rpx #2675e5;
        border: solid 1rpx red;
  			
  			font-family: SourceHanSansSC-Regular;
  			font-size: 33rpx;
  			letter-spacing: 2rpx;
  			// color: #008ffd;
        color: red;
  			margin-right: 39rpx;
  			margin-left: 49rpx;
  		}
  	}
  	
  }
</style>
