<template>
	<view class="cu-modal" :class="showModal==true?'show':''">
		<view class="cu-dialog" style="max-width:582rpx;border-radius: 21upx;">
			<view class="action" @tap="close">
				<image src="@/static/close-popup.png" style="height:61rpx;width:61rpx;position:absolute;right:0rpx;z-index:99999;"></image>
			</view>
			<image style="width:100%;height:285rpx;" src="@/static/loading-changes.png"></image>
			<view class="modal-dialog-layout-change">
				<view class="top">
					<view class="font">选择你要上传图片的集装箱</view>
				</view>
				<view class="middle" v-show="showList">
					<block v-for="item in list" :key="item.id">
						<view class="row" v-if="item.show">
							<view class="top">
								<view class="left">
									{{item.containerCode}}
								</view>
								<view class="right">
									<view class="upload-image" @tap="uploadImage(item)">上传照片</view>
								</view>
							</view>
							<images-bottom
								:item-ori="item"
								@change="change">
							</images-bottom>
						</view>
					</block>
				</view>
				<view class="btns" @tap="close">
					<view class="cancel">取消</view>
					<view class="confirm">确定</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import imagesBottom from '@/pages/cargo/images-bottom.vue'
	export default {
		components: {
			imagesBottom
		},
		data () {
			return {
				showModal: false,
				list: [],
				showList: true,
				changed: false
			}
		},
		methods: {
			open (list) {
				this.list = list
				this.list.forEach(e => {
					e.show = true
				})
				this.showModal = true
			},
			close () {
				this.showModal = false
				if (this.changed) {
					this.$emit('refresh')
				}
			},
			uploadImage (item) {
				this.$emit('uploadImage', item)
				this.changed = true
			},
			change () {
				this.changed = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal-dialog-layout-change {
		padding-bottom: 43rpx;
		padding-left: 67rpx;
		padding-right: 67rpx;
		.top {
			.font {
				font-family: SourceHanSansSC-Medium;
				font-size: 35rpx;
				letter-spacing: 2rpx;
				font-weight: bold;
				color: #262626;
			}
		}
		.middle {
			margin-top: 39rpx;
			.row {
				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-left: 20rpx;
					padding-right: 20rpx;
					padding-bottom: 24rpx;
					.left {
						.cabin {
							font-family: Roboto-Regular;
							font-size: 33rpx;
							letter-spacing: 2rpx;
							color: #262626;
							margin-bottom: 12rpx ;
						}
						.container {
							font-family: Roboto-Regular;
							font-size: 25rpx;
							letter-spacing: 1rpx;
							color: #a6a6a6;
						}
					}
					.right {
						font-family: SourceHanSansSC-Regular;
						font-size: 29rpx;
						letter-spacing: 1rpx;
						color: #262626;
					}
				}
			}
			.line {
				width: 580rpx;
				height: 1rpx;
				border: solid 1rpx #e5e5e5;
				margin-bottom: 24rpx;
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
				border: solid 1rpx #2675e5;
				
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #008ffd;
				margin-right: 39rpx;
			}
			.confirm {
				width: 206rpx;
				height: 69rpx;
				line-height: 63rpx;
				background-color: #008ffd;
				border-radius: 35rpx;
				
				font-family: SourceHanSansSC-Regular;
				font-size: 33rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}
	}
	
	.upload-image {
		width: 136rpx;
		height: 49rpx;
		line-height: 44rpx;
		border: solid 1rpx #e5e5e5;
		border-radius: 22rpx;
		font-family: SourceHanSansSC-Regular;
		font-size: 26rpx;
		letter-spacing: 1rpx;
		color: #8c8c8c;
		text-align: center;
	}
</style>
