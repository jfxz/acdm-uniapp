/* * 界面名称: 图表主界面 * 界面功能: 搭建图表框架以及每个界面的入口、获取数据的方法等等 * 其他 * 时间 2020-9-4 08:44:46 * 作者 zql */
<template>
  <view class="chart-layout">
    <!-- 顶部标题及回退home -->
    <view :class="['navbar', {isTablet: isTablet}]">
      <view class="nav-handle-left">
        <view class="handle-type"><image src="../../static/home2x.png" @tap="openAcdmHome"></image></view>
        <view class="handle-type"></view>
        <view class="handle-type"></view>
      </view>
      <view class="nav-title">
        <text>{{ 'ACDM' }}</text>
      </view>
      <view class="nav-handle-right"></view>
    </view>

    <view class="content-tab">
      <view class="top-tab">
        <u-tabs :show-bar="false" :list="topList" bar-width="80" :current="topCurrent" @change="topChange" font-size="28" active-color="#1890ff"></u-tabs>
      </view>

      <view class="bottom-tab" v-if="isShowBottom">
        <view class="arrAndDep-tab" v-if="topCurrent !== 1">
          <u-tabs :show-bar="false" :list="computedBottomList" :current="bottomCurrent" @change="bottomChange" font-size="28" active-color="#1890ff"></u-tabs>
        </view>
        <view class="normal-tab" v-else>
          <u-tabs :show-bar="false" :list="computedBottomList" :current="bottomCurrent" @change="bottomChange" font-size="28" active-color="#1890ff"></u-tabs>
        </view>
      </view>
    </view>
    <!-- 内容 -->
    <view class="content" :style="{ height: computedHeight, top: computedTop }">
      <view class="content-main">
        <!-- 弃用动态组件，原因：app不支持keep-alive，无法做缓存 -->
        <!-- 航班概述 -->
        <flightOverview
          ref="flightOverview"
          :airportCode="airportCode"
          :indexParams="indexParams"
          :bottomCurrent="bottomCurrent"
          :topCurrent="topCurrent"
          v-if="currentPage === 'flightOverview'"
        ></flightOverview>

        <releaseSupport
          ref="releaseSupport"
          :airportCode="airportCode"
          :indexParams="indexParams"
          :bottomCurrent="bottomCurrent"
          :topCurrent="topCurrent"
          v-if="currentPage === 'releaseSupport'"
        ></releaseSupport>

        <cargo ref="cargo" :airportCode="airportCode" :indexParams="indexParams" :bottomCurrent="bottomCurrent" :topCurrent="topCurrent" v-if="currentPage === 'cargo'"></cargo>

        <weather
          ref="weather"
          :airportCode="airportCode"
          :indexParams="indexParams"
          :bottomCurrent="bottomCurrent"
          :topCurrent="topCurrent"
          v-if="currentPage === 'weather'"
        ></weather>

        <passenger
          ref="passenger"
          :airportCode="airportCode"
          :indexParams="indexParams"
          :bottomCurrent="bottomCurrent"
          :topCurrent="topCurrent"
          v-if="currentPage === 'passenger'"
        ></passenger>

        <normal
          ref="normal"
          :airportCode="airportCode"
          :indexParams="indexParams"
          :bottomCurrent="bottomCurrent"
          :topCurrent="topCurrent"
          v-if="currentPage === 'normal'"
        ></normal>

        <resource
          ref="resource"
          :airportCode="airportCode"
          :indexParams="indexParams"
          :bottomCurrent="bottomCurrent"
          :topCurrent="topCurrent"
          v-if="currentPage === 'resource'"
        ></resource>

        <!-- <component :ref="currentPage" :airportCode="airportCode" :indexParams="indexParams"
        :bottomCurrent="bottomCurrent" :topCurrent="topCurrent" :is="currentPage"></component> -->
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getIndexParams } from '@/api/home/index.js'
import flightOverview from './flight-overview/index.vue'
import releaseSupport from './release-support/index.vue'
import cargo from './cargo/index.vue'
import weather from './weather/index.vue'
import passenger from './passenger/index.vue'
import normal from './normal/index.vue'
import resource from './resource/index.vue'
export default {
  components: { flightOverview, releaseSupport, cargo, weather, passenger, normal, resource },
  data () {
    return {
      isTablet: false,
      tabBottom: '',
      tabNoBottom: '',
      contendHeight: '',
      contendNoHeight: '',
      airportCode: '',
      indexParams: {},
      timer: null,
      currentPage: 'flightOverview',
      bottomList: [{ name: '进出港' }, { name: '进港' }, { name: '出港' }],
      normalBottomList: [{ name: '放行概览' }, { name: '放行正常率统计' }, { name: '起飞正常率统计' }, { name: '始发起飞正常率统计' }, { name: '加权正常率统计' }],
      topList: [
        { name: '航班概览', path: 'flightOverview', hasBottomTab: true },
        { name: '正常性概览', path: 'normal', hasBottomTab: true },
        { name: '放行分析', path: 'releaseSupport' },
        { name: '旅客概览', path: 'passenger', hasBottomTab: true },
        { name: '货邮概览', path: 'cargo' },
        { name: '资源概览', path: 'resource' },
        { name: '天气', path: 'weather' }
      ],
      topCurrent: 0,
      bottomCurrent: 0
    }
  },
  computed: {
    ...mapGetters(['user']),
    // 顶部第一层tab是否有第二层底部tab 有则使用2个tab的高度
    computedHeight () {
      if (this.topList[this.topCurrent].hasBottomTab) {
        return this.contendHeight + 'px'
      }
      return this.contendNoHeight + 'px'
    },
    // 距离顶部tab的位置,也是分为2种情况计算
    computedTop () {
      if (this.topList[this.topCurrent].hasBottomTab) {
        return this.tabBottom + 'px'
      }
      return this.tabNoBottom + 'px'
    },
    isShowBottom () {
      return this.topList[this.topCurrent].hasBottomTab
    },
    computedBottomList () {
      if (this.topCurrent === 1) {
        return this.normalBottomList
      }
      return this.bottomList
    }
  },
  mounted () {
    if (getApp().globalData.isTablet) {
      this.isTablet = true
    }
    // 统一获取数据的方法
    this.topCurrent = 0
    this.bottomCurrent = 0
    this.currentPage = 'flightOverview'
    console.log('user', this.user)
    if (!this.user.userAirport || !this.user.userAirport[0]) {
      this.$message('请联系管理员订阅机场！')
      return
    }
    this.airportCode = this.user.userAirport[0].icaocode
    let obj = {
      paramKey: 'indexParams',
      pageSize: 50,
      pageNumber: 0
    }
    getIndexParams(obj)
      .then(res => {
        console.log('res12344565', res)
        if (res.status) {
          this.indexParams = JSON.parse(res.data.content[0].paramValue)
          console.log('indexParams11111111', this.indexParams)
          setTimeout(() => {
            this.$refs[this.currentPage].getData(this.bottomCurrent)
          }, 500)
        }
      })
      .catch(err => {
        console.log('err', err)
        this.$message('当前无首页配置文件,请联系管理员')
      })
    let systemInfo = uni.getSystemInfoSync()
    let query = uni.createSelectorQuery().in(this)
    query
      .select('.content-tab')
      .boundingClientRect(data => {
        this.contendHeight = systemInfo.windowHeight - data.bottom - 20
        this.tabBottom = data.bottom + 5
      })
      .exec()
    query
      .select('.top-tab')
      .boundingClientRect(data => {
        this.tabNoBottom = data.bottom + 5
        this.contendNoHeight = systemInfo.windowHeight - data.bottom - 20
      })
      .exec()
  },
  onLoad () {},
  methods: {
    topChange (index) {
      this.topCurrent = index
      this.bottomCurrent = 0
      this.currentPage = this.topList[index].path
      this.$nextTick(() => {
        this.$refs[this.currentPage].getData(this.bottomCurrent)
      })
    },
    bottomChange (index) {
      console.log(11112, this.$refs[this.currentPage])
      this.bottomCurrent = index
      this.$refs[this.currentPage].getData(this.bottomCurrent)
    },
    // 跳转到主页
    openAcdmHome () {
      uni.reLaunch({
        url: '../home/index'
      })
    }
  }
}
</script>

<style lang="scss">
page {
  // overflow-x: hidden;
}
.chart-layout {
  .content-tab {
    position: fixed;
    top: calc(var(--status-bar-height) + 100rpx);
    width: 100%;
    overflow-x: auto;
    .top-tab {
    }
    .bottom-tab {
      #u-tab-item-0 {
        text-align: left !important;
      }
      #u-tab-item-2 {
        text-align: right !important;
      }
      margin-top: 10rpx;
      .arrAndDep-tab {
        .u-scroll-box {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .content-main {
    // overflow-y: auto;
    // height: 100%;
  }
  .content {
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    left: 10rpx;
    right: 10rpx;
    // background: #FFFFFF;
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    height: calc(var(--status-bar-height) + 45px);
    background: #1891ff;
    padding-top: calc(var(--status-bar-height) + 25rpx);
    width: 100%;
    z-index: 10;
    position: fixed;
    top: 0;
    text-align: center;
    &.isTablet {
      padding-top: calc(var(--status-bar-height) + 10rpx);
    }
    .nav-handle-left {
      display: flex;
      justify-content: space-around;
      width: 30%;
      padding-top: 2rpx;

      .handle-type {
        image {
          width: 45rpx;
          height: 45rpx;
        }
      }
    }

    .nav-title {
      width: 40%;
      font-size: 38rpx;
      line-height: 50rpx;
      color: #ffffff;
    }

    .nav-handle-right {
      width: 30%;
    }
  }
}
</style>
