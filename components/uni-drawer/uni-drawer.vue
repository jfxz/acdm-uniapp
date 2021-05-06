
<template>
	<view v-if="visibleSync" :class="{ 'uni-drawer--visible': showDrawer }" class="uni-drawer" @tap.stop.prevent @touchmove.stop.prevent>
		<view class="uni-drawer__mask" :class="{ 'uni-drawer__mask--visible': showDrawer && mask }" @tap="close('mask')" />
		<view class="uni-drawer__content" :class="{'uni-drawer--right': rightMode,'uni-drawer--left': !rightMode, 'uni-drawer__content--visible': showDrawer}" :style="{width:drawerWidth+'px'}" >
			<view class="uni-drawer__title" v-if="titleName">
				<text> {{titleName}}</text>
			</view>
			<scroll-view class="u-drawer__scroll-view" scroll-y="true">
				<slot />
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/**
	 * Drawer 抽屉
	 * @description 抽屉侧滑菜单
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=26
	 * @property {Boolean} mask = [true | false] 是否显示遮罩
	 * @property {Boolean} maskClick = [true | false] 点击遮罩是否关闭
	 * @property {Boolean} mode = [left | right] Drawer 滑出位置
	 * @property {String} titleName 标题名字
	 * 	@value left 从左侧滑出
	 * 	@value right 从右侧侧滑出
	 * @property {Number} width 抽屉的宽度 ，仅 vue 页面生效
	 * @event {Function} close 组件关闭时触发事件
	 * 若需要禁止蒙版下的页面滚动，可使用 @touchmove.stop.prevent
	 * 若需要禁止默认事件和冒泡 @tap.stop.prevent
	 * 2020/08/12 增加上下滚动以及禁止滚动穿透和自定义title栏（未完wlf）
	 */
	export default {
		name: 'UniDrawer',
		props: {
			/**
			 * 显示模式（左、右），只在初始化生效
			 */
			mode: {
				type: String,
				default: ''
			},
			/**
			 * 蒙层显示状态
			 */
			mask: {
				type: Boolean,
				default: true
			},
			/**
			 * 遮罩是否可点击关闭
			 */
			maskClick:{
				type: Boolean,
				default: true
			},
			/**
			 * 抽屉宽度
			 */
			width: {
				type: Number,
				default: 320
			},
			/**
			 * 标题
			 */
			titleName:{
				type: String,
				default: ''
			},
			// 传入值才显示标题栏
		},
		data() {
			return {
				visibleSync: false,
				showDrawer: false,
				rightMode: false,
				watchTimer: null,
				drawerWidth: 320
			}
		},
		created() {
			// #ifndef APP-NVUE
			this.drawerWidth = this.width
			// #endif
			this.rightMode = this.mode === 'right'
		},
		methods: {
			clear(){},
			close(type) {
				// fixed by mehaotian 抽屉尚未完全关闭或遮罩禁止点击时不触发以下逻辑
				if((type === 'mask' && !this.maskClick) || !this.visibleSync) return
				this._change('showDrawer', 'visibleSync', false)
			},
			open() {
				// fixed by mehaotian 处理重复点击打开的事件
				if(this.visibleSync) return
				this._change('visibleSync', 'showDrawer', true)
			},
			_change(param1, param2, status) {
				this[param1] = status
				if (this.watchTimer) {
					clearTimeout(this.watchTimer)
				}
				this.watchTimer = setTimeout(() => {
					this[param2] = status
					this.$emit('change',status)
				}, status ? 50 : 300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 抽屉宽度
	$drawer-width: 220px;

	.uni-drawer {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: fixed;
		top: var(--status-bar-height);
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		height: calc(100vh - var(--status-bar-height));
		overflow: hidden;
	}

	.uni-drawer__content {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		position: absolute;
		top: 0;
		width: $drawer-width;
		bottom: 0;
		background-color: $uni-bg-color;
		transition: transform 0.3s ease;
	}

	.uni-drawer--left {
		left: 0;
		/* #ifdef APP-NVUE */
		transform: translateX(-$drawer-width);
		/* #endif */
		/* #ifndef APP-NVUE */
		transform: translateX(-100%);
		/* #endif */
	}

	.uni-drawer--right {
		right: 0;
		/* #ifdef APP-NVUE */
		transform: translateX($drawer-width);
		/* #endif */
		/* #ifndef APP-NVUE */
		transform: translateX(100%);
		/* #endif */
	}

	.uni-drawer__content--visible {
		transform: translateX(0px);
	}
	.u-drawer__scroll-view{
		height: calc(100vh - var(--status-bar-height) - 92rpx);
		width: 100%;
	}
	.uni-drawer__mask {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: $uni-bg-color-mask;
		transition: opacity 0.3s;
	}
	.uni-drawer__title {
		height: 92rpx;
		width: 100%;
		line-height: 92rpx;
		background-color: #f5f5f5;
		text {
			padding-left: 20rpx;
			font-size: 35rpx;
			line-height: 29rpx;
			color: #8c8c8c;
		}
	}

	.uni-drawer__mask--visible {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		opacity: 1;
	}
</style>
