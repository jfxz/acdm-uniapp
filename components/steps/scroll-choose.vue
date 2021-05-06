<template>
	<view class="scroll-choose-all">
		<view class="middleLine"></view>
		<scroll-view class="scroll-choose" scroll-x="true" upper-threshold="5" lower-threshold="5" 
		:scroll-left="scrollLeftInit" show-scrollbar="false" @scroll="scroll" @scrolltoupper="upper" 
		@scrolltolower="lower" scroll-with-animation="true">
			<view class="scroll-con" :style="{width: scrollWid}">
				<view class="topLine">
					<view class="allLine" :style="{'marginRight': maginL + 'px'}" :class="item.type" v-for="(item,index) in scrollList" :key="index"></view>
				</view>
				<view class="bottomNum" :style="{'paddingLeft': allNumLeft}">
					<text class="allNum" :style="{width: (maginL + 2) * 10 + 'px',left: -((maginL + 2) * 5) + 'px'}" v-for="(item,index) in scrollNumList" :key="index">
						{{item}}
					</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'ScrollChoose',
		props: {
			//起始值和终止值差距不要过大，否则会影响页面性能(暂不支持设置小数)
			/**
			 * 初始值（注意：初始值应在起始值和终止值之间）
			 */
			scrollLeft: {
				type: Number,
				default: 0
			},
			/**
			 * 滚动区域起始值（注意：起始值不能大于终止值）
			 */
			scrollStart: {
				type: Number,
				default: 0
			},
			/**
			 * 滚动区域终止值
			 */
			scrollEnd: {
				type: Number,
				default: 100
			},
			/**
			 * 线间距
			 */
			maginL: {
				type: Number,
				default: 5
			},
		},
		data() {
			return {
				scrollList:[],
				scrollNumList:[],
				scrollWid: '100vw',
				scrollLeftInit: 0,
				allNumLeft: ''
			}
		},
		mounted() {
			this.init();
		},
		computed:{
			
		},
		methods: {
			init(){
				for(let i = this.scrollStart; i < (this.scrollEnd + 1); i++){
					let _line = {};
					if(i%5 == 0){
						if(i%10 == 0){
							this.scrollNumList.push(i);
							_line.type = 'LLine'
						}else{
							_line.type = 'MLine'
						}
					}else{
						_line.type = 'SLine'
					}
					this.scrollList.push(_line);
				}
				this.scrollWid = uni.upx2px(750) + (this.scrollEnd - this.scrollStart) * (this.maginL + 2)  + 'px';
				if(this.scrollStart % 10 != 0){
					if(this.scrollStart > 0){
						this.allNumLeft = (10 - this.scrollStart % 10) * (this.maginL + 2) + uni.upx2px(372) + 'px';
					}else{
						this.allNumLeft = Math.abs(this.scrollStart % 10) * (this.maginL + 2) + uni.upx2px(372) + 'px';
					}
				}
				setTimeout(()=>{
					this.setNowLeft();
				},100)
			},
			setNowLeft(){
				this.scrollLeftInit = (this.scrollLeft - this.scrollStart) * (this.maginL + 2);
			},
			upper: function(e) {
				setTimeout(()=>{
					this.$emit('scroll',this.scrollStart);
				},50)
			},
			lower: function(e) {
				setTimeout(()=>{
					this.$emit('scroll',this.scrollEnd);
				},50)
			},
			scroll: function(e) {
				this.$emit('scroll',Math.round(e.detail.scrollLeft/(this.maginL + 2)) + this.scrollStart);
			}
		}
	}
</script>

<style lang="scss">
@charset "UTF-8";
.scroll-choose-all{
	width: 750rpx;
	height: 70px;
	background: #f8f8f8;
	margin: 10px 0;
	border-bottom: 1px solid #ccc;
	border-top: 1px solid #ccc;
	position: relative;
}
.middleLine{
	position: absolute;
	width: 4px;
	height: 40px;
	background: #83DC42;
	left: 375rpx;
	margin-left: -2px;
	z-index: 1;
}
.scroll-choose{
	width: 750rpx;
	height: 70px;
	.scroll-con{
		height: 70px;
		overflow: hidden;
		.topLine{
			height: 30px;
			padding: 0 372rpx;
		}
		.bottomNum{
			height: 30px;
			padding: 0 0 0 372rpx;
			width: 100%;
			// display: flex;
			// flex-wrap: nowrap;
			.allNum{
				display: inline-block;
				position: relative;
				// width: 70px;
				// left: -35px;
				text-align: center;
			}
		}
		.allLine{
			display: inline-block;
			// margin-right: 5px;
			width: 2px;
			background: #999;
			position: relative;
		}
		.allLine:last-child{
			margin-right: 0px !important;
		}
		.LLine{
			height: 30px;
		}
		.MLine{
			height: 20px;
			top: -10px;
		}
		.SLine{
			height: 15px;
			top: -15px;
		}
	}
}
</style>