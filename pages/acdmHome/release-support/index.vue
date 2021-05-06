/* * 界面名称: 放行分析 * 界面功能: * 其他 * 时间 2020-10-29 09:41:56 * 作者 zql */
<template>
  <view class="release-layout">
   <!-- <view class="queue">
      <u-button type="default" @tap="openQueue">放行队列</u-button>
    </view>
    <u-popup v-model="show" mode="left" :closeable="true">
      <queue></queue>
    </u-popup> -->
    <view class="fail" v-if="topLoadFail"><fail @reloadData="getData()"></fail></view>
    <view class="release-main" v-else>
      <view class="">
        <view class="releaseInfo">
          <view class="title">
            <image class="titleIcon" src="@/static/charts/titleIcon1_mobile.png" mode="aspectFit"></image>
            <view class="titleText">放行延误原因统计{{ `(延误架次: ${dlyTotal})` }}</view>
          </view>
          <view class="reasonMain">
            <view class="pie-total">
              <view class="qiun-charts qiun-rows"><canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas></view>
            </view>
          </view>
        </view>
        
        <view class="releaseInfo">
          <view class="title">
            <image class="titleIcon" src="@/static/charts/titleIcon1_mobile.png" mode="aspectFit"></image>
            <view class="titleText">离港点放行延误占比统计</view>
          </view>
          <view class="reasonMain">
            <view class="pie-total">
              <view class="qiun-charts qiun-rows">
                <canvas canvas-id="canvasPieRoute" id="canvasPieRoute" class="charts" @touchstart="touchPieRoute">
                  
                </canvas>
              </view>
            </view>
          </view>
        </view>
        
        <view class="releaseInfo" style="padding-top: 10px">
          <view class="title">
            <image class="titleIcon" src="@/static/charts/titleIcon2_mobile.png" mode="aspectFit"></image>
            <view class="titleText">各方向放行正常率(放行率{{day_release_rate}}%)</view>
          </view>
          <view class="main">
            <view class="name-num" v-for="(item, index) in routeNormalRate" :class="routerClass[index % 3]" :key="index">
              <view class="name">{{ item.label }}</view>
              <view class="num">{{ item.value }}%</view>
            </view>
          </view>
        </view>
      </view>
      <view class="releaseInfo" style="padding-top: 10px">
        <view class="title">
          <image class="titleIcon" src="@/static/charts/titleIcon2_mobile.png" mode="aspectFit"></image>
          <view class="titleText">预测未来</view>
        </view>
        <view class="main">
          <view class="name-num" style="text-align: left;">
            <view class="name">放行正常率</view>
            <view class="num">{{ formatFixed2Num(forecast.forecastPassNormalRate) }}%</view>
          </view>
          <view class="name-num" style="text-align: center;">
            <view class="name">起飞正常率</view>
            <view class="num">{{ formatFixed2Num(forecast.forecastTakeoffNormalRate) }}%</view>
          </view>
          <view class="name-num" style="text-align: right;">
            <view class="name">加权正常率</view>
            <view class="num">{{ formatFixed2Num(forecast.forecastWeightedNormalRate) }}%</view>
          </view>
        </view>
      </view>
    </view>

    <view class="fail" v-if="bottomLoadFail"><fail @reloadData="getDelayData()"></fail></view>
    <view class="" v-if="!bottomLoadFail">
      <view class="releaseDelayTotal">
        <view class="delayTotal">
          <view class="title">
            <image class="titleIcon" src="@/static/charts/titleIcon1_mobile.png" mode="aspectFit"></image>
            <view class="titleText">放行延误时长统计</view>
          </view>
          <!--      <view class="todayDelay">-->
          <!--        <img :src="rateIcon" class="rateIcon">-->
          <!--        <view class="name-num">-->
          <!--          <view class="name">今日延误情况</view>-->
          <!--          <view class="num">{{delay}}%</view>-->
          <!--        </view>-->
          <!--      </view>-->
          <view class="tab">
            <u-subsection :list="list" @change="handleTab" :current="current"
            inactive-color="#000" active-color="#fff" bg-color="#fff" button-color="#1890ff"></u-subsection>
            <u-subsection v-if="current === 1" style="margin-top: 10rpx;" :list="list3"
             inactive-color="#000" active-color="#fff" bg-color="#fff" button-color="#1890ff"
             @change="handleTab3" :current="current3"></u-subsection>
            <!-- <view class="tabItem" :class="{'select': tabFlag}" @click="handleTab(true)">已执行</view>
            <view class="tabItem" :class="{'select': !tabFlag}" @click="handleTab(false)">未执行</view> -->
          </view>
        </view>
        <view class="qiun-charts2" v-if="current === 0 || (current === 1 && current3 === 0)">
          <canvas canvas-id="canvasColumnRelease" id="canvasColumnRelease" class="charts2" @touchstart="touchColumn"></canvas>
        </view>
        <view class="delay-flight-detail" v-if="current === 1 && current3 === 1">
          <u-table>
            <u-tr>
              <u-th width="50rpx">#</u-th>
              <u-th>航班号</u-th>
              <u-th>目的地</u-th>
              <u-th>CTOT</u-th>
              <u-th>目标放行</u-th>
              <u-th>延误时长</u-th>
            </u-tr>
            <view class="table-contend">
              <u-tr v-for="(item, index) in flightDelayList" :key="index">
                <u-td width="50rpx">{{ index + 1 }}</u-td>
                <u-td>{{ item.carrier + item.flight }}</u-td>
                <u-td>{{ item.destinationCn }}</u-td>
                <u-td>{{ formatTime(item.localCtot) }}</u-td>
                <u-td>{{ formatTime(item.clearanceTarget) }}</u-td>
                <u-td>{{ item.meta.delayTime + '分'}}</u-td>
              </u-tr>
            </view>
          </u-table>
        </view>
      </view>
      <view class="btns" v-if="current === 0 || (current === 1 && current3 === 0)">
        <view class="item" v-for="(item, index) in displayChartData" :key="index">
          <view class="time-num">
            <view class="time">{{ item.disName }}</view>
            <view class="num">{{ item.value }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="forecast-class">
      <view class="title">
        <image class="titleIcon" src="@/static/charts/titleIcon2_mobile.png" mode="aspectFit"></image>
        <view class="titleText">放行趋势</view>
      </view>
      <view class="oneHour">
        <view class="qiun-charts3">
          <view class="qiun-title-dot-light" style="text-align: center;">未来1小时预计放行延误</view>
          <canvas canvas-id="canvasRing1" data-index="0" @touchstart="touchRing" id="canvasRing1" class="charts3"></canvas>
        </view>
        <view class="qiun-charts3">
          <view class="qiun-title-dot-light" style="text-align: center;">未来1小时预计放行正常</view>
          <canvas canvas-id="canvasRing3" data-index="2" @touchstart="touchRing" id="canvasRing3" class="charts3"></canvas>
        </view>
      </view>
      <view class="oneHour">
        <view class="qiun-charts3">
          <view class="qiun-title-dot-light" style="text-align: center;">未来2小时预计放行延误</view>
          <canvas canvas-id="canvasRing2" data-index="1" @touchstart="touchRing" id="canvasRing2" class="charts3"></canvas>
        </view>
        <view class="qiun-charts3">
          <view class="qiun-title-dot-light" style="text-align: center;">未来2小时预计放行正常</view>
          <canvas canvas-id="canvasRing4" data-index="3" @touchstart="touchRing" id="canvasRing4" class="charts3"></canvas>
        </view>
      </view>
      <view class="oneHour">
        <view class="qiun-charts3">
          <view class="qiun-title-dot-light" style="text-align: center;">未来3小时预计放行延误</view>
          <canvas canvas-id="canvasRing5" data-index="4" @touchstart="touchRing" id="canvasRing5" class="charts3"></canvas>
        </view>
        <view class="qiun-charts3">
          <view class="qiun-title-dot-light" style="text-align: center;">未来3小时预计放行正常</view>
          <canvas canvas-id="canvasRing6" data-index="5" @touchstart="touchRing" id="canvasRing6" class="charts3"></canvas>
        </view>
      </view>
    </view>

    <view class="takeOff">
      <view class="depTab2">
        <u-subsection :list="list2" inactive-color="#000" active-color="#fff"
        bg-color="#fff" button-color="#1890ff" :current="depTab2" @change="depChange2">
        </u-subsection>
      </view>
      <view class="qiun-columns">
        <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><!-- <view class="qiun-title-dot-light">航班按时段分布</view> --></view>
        <view class="qiun-charts">
          <view class="fail" v-if="bottomLoadFail"><fail @reloadData="getData()"></fail></view>
          <view class="" v-else>
            <canvas canvas-id="canvasAreaRelease" id="canvasAreaRelease" class="charts" @touchstart="touchArea" @touchmove="moveLineArea" @touchend="touchEndLineArea"></canvas>
            </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
// import queue from './queue.vue'
import uCharts from '@/components/u-charts/u-charts.js'
import { deepCopy } from '@/common/util/util.js'
import { getTimeDistribution } from '@/api/home/flight-overview/index.js'
import { getArrowData } from '@/api/home/normal/index.js'
import { getDlyReasonFlight, getNormalReleaseRateRoute, getDelayReleaseFlightStatistics, getDlyForecast } from '@/api/home/release-support/index.js'
import _ from 'lodash'
import dayjs from '@/common/util/dayjs.min.js'
import fail from '@/components/fail/index.vue'
// import vpnMix from '@/common/mixin/vpn-login-mixin.js'
export default {
  components: { fail },
  props: {
    topCurrent: {
      type: Number,
      default: 0
    },
    airportCode: {
      type: String,
      default: ''
    },
    indexParams: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      lastMoveTime: '',
      forecast: {},
      flightDelayList: [],
      show: false,
      executedTotal: 0,
      noExecutedTotal: 0,
      stepList: [
        {
          date: '08-28', // 左侧日期 -- 必选
          time: '11:22', // 左侧时间 -- 必选
          info: '开卡', // 右侧内容 -- 可选
          index: '1', // 中间 Index -- 可选
          isFinished: true, // 是否已完成（完成 index 为 √）-- 可选
          isActive: false, // 是否为当前节点 Active（当前节点 即使完成 index 也不会显示 √）-- 可选
          isShowSlot: false // 右侧是否有 Slot（显示在 右侧内容下方）-- 可选
        },
        {
          date: '08-30',
          time: '15:33',
          info: '激活',
          index: '2',
          isFinished: false,
          isActive: true,
          isShowSlot: true
        }
      ],
      canvaArea: null,
      canvaArea1: null,
      canvaRing: [],
      depTab2: 0,
      bottomLoadFail: false,
      topLoadFail: false,
      list: [
        {
          name: '已执行'
        },
        {
          name: '未执行'
        }
      ],
      list2: [
        {
          name: '计划起飞时段分布'
        },
        {
          name: '实际起飞按时段分布'
        }
      ],
      list3: [
        {
          name: '延误柱状图'
        },
        {
          name: '延误航班明细'
        }
      ],
      current: 0,
      current3: 0,
      piearr: [],
      canvaPie: null,
      canvaPieRoute: null,
      canvaColumn: null,
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      dlyTotal: 0,
      timer: null,
      chartForecastData: {
        delay: {
          onehour: {
            data: [],
            title: '未来1小时预计放行延误'
          },
          twohour: {
            data: [],
            title: '未来2小时预计放行延误'
          },
          threehour: {
            data: [],
            title: '未来3小时预计放行延误'
          }
        },
        normal: {
          onehour: {
            data: [],
            title: '未来1小时预计放行正常'
          },
          twohour: {
            data: [],
            title: '未来2小时预计放行正常'
          },
          threehour: {
            data: [],
            title: '未来3小时预计放行正常'
          }
        }
      },
      day_release_rate: '',
      cWidthPie: 0,
      cHeightPie: 0,
      chartData: [],
      chartData2: [],
      reasonList: [],
      routeNormalRate: [],
      colorList: ['#00cf00', '#975ee5', '#fbd336', '#3aa1ff', '#f3627a', '#36cbcb'],
      routerClass: ['left', 'center', 'right'],
      tipTitle: '',
      tabFlag: true, // true为已执行，false未执行
      delay: 0,
      displayChartData: [],
      executedChartData: [],
      noExecutedChartData: []
    }
  },
  computed: {},
  deactivated () {
    this.cleanTimer()
  },
  beforeDestroy () {
    this.cleanTimer()
  },
  mounted () {
    this.day_release_rate = getApp().globalData.day_release_rate || 'XX'
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
    this.cWidthPie = uni.upx2px(360)
    this.cHeightPie = uni.upx2px(240)
  },
  onLoad () {},
  methods: {
    formatFixed2Num (value) {
      if (value) {
        return (value * 100).toFixed(2)
      }
      return ''
    },
    formatTime (time) {
      if (time) {
        return moment(time).format('HH:mm')
      }
      return ''
    },
    openQueue () {
      this.show = true
    },
    touchRing (e) {
      console.log(e)
      this.canvaRing[Number(e.target.dataset.index)].showToolTip(e, {
        format: function (item) {
          console.log(222222, item)
          return item.name + ':' + item.data + '架'
        }
      })
    },
    // 获取放行趋势数据
    getDlyForecastData () {
      getDlyForecast({ airportCode: this.airportCode })
        .then(res => {
          if (res.status) {
            let delayOne = []
            let delayTwo = []
            let delayThree = []
            let normalOne = []
            let normalTwo = []
            let normalThree = []
            let [total1, total2, total3, total4, total5, total6] = [0, 0, 0, 0, 0, 0]
            if (res.data.delay.OneHourForecast.length !== 0) {
              res.data.delay.OneHourForecast.forEach(item => {
                total1 = total1 + item.number
                delayOne.push({
                  name: item.routePoint,
                  data: item.number,
                  total: total1
                })
              })
            } else {
              delayOne = [
                {
                  name: '当前无延误',
                  data: 0
                }
              ]
            }
            if (res.data.delay.TwoHourForecast.length !== 0) {
              res.data.delay.TwoHourForecast.forEach(item => {
                total2 = total2 + item.number
                delayTwo.push({
                  name: item.routePoint,
                  data: item.number,
                  total: total2
                })
              })
            } else {
              delayTwo = [
                {
                  name: '当前无延误',
                  data: 0
                }
              ]
            }
            if (res.data.delay.ThreeHourForecast.length !== 0) {
              res.data.delay.ThreeHourForecast.forEach(item => {
                total5 = total5 + item.number
                delayThree.push({
                  name: item.routePoint,
                  data: item.number,
                  total: total5
                })
              })
            } else {
              delayThree = [
                {
                  name: '当前无延误',
                  data: 0
                }
              ]
            }
            if (res.data.normal.OneHourForecast.length !== 0) {
              res.data.normal.OneHourForecast.forEach(item => {
                total3 = total3 + item.number
                normalOne.push({
                  name: item.routePoint,
                  data: item.number,
                  total: total3
                })
              })
            } else {
              normalOne = [
                {
                  name: '当前无放行趋势',
                  data: 0
                }
              ]
            }
            if (res.data.normal.TwoHourForecast.length !== 0) {
              res.data.normal.TwoHourForecast.forEach(item => {
                total4 = total4 + item.number
                normalTwo.push({
                  name: item.routePoint,
                  data: item.number,
                  total: total4
                })
              })
            } else {
              normalTwo = [
                {
                  name: '当前无放行趋势',
                  data: 0
                }
              ]
            }
            if (res.data.normal.ThreeHourForecast.length !== 0) {
              res.data.normal.ThreeHourForecast.forEach(item => {
                total6 = total6 + item.number
                normalThree.push({
                  name: item.routePoint,
                  data: item.number,
                  total: total6
                })
              })
            } else {
              normalThree = [
                {
                  name: '当前无放行趋势',
                  data: 0
                }
              ]
            }
            this.chartForecastData.delay.onehour = Object.assign({}, this.chartForecastData.delay.onehour, { data: delayOne })
            this.chartForecastData.delay.twohour = Object.assign({}, this.chartForecastData.delay.twohour, { data: delayTwo })
            this.chartForecastData.delay.threehour = Object.assign({}, this.chartForecastData.delay.threehour, { data: delayThree })

            this.chartForecastData.normal.onehour = Object.assign({}, this.chartForecastData.normal.onehour, { data: normalOne })
            this.chartForecastData.normal.twohour = Object.assign({}, this.chartForecastData.normal.twohour, { data: normalTwo })
            this.chartForecastData.normal.threehour = Object.assign({}, this.chartForecastData.normal.threehour, { data: normalThree })

            let Arcbar1 = { series: this.chartForecastData.delay.onehour.data }
            let Arcbar2 = { series: this.chartForecastData.delay.twohour.data }
            let Arcbar3 = { series: this.chartForecastData.normal.onehour.data }
            let Arcbar4 = { series: this.chartForecastData.normal.twohour.data }
            let Arcbar5 = { series: this.chartForecastData.delay.threehour.data }
            let Arcbar6 = { series: this.chartForecastData.normal.threehour.data }
            console.log('Arcbar1', Arcbar1)
            this.showArcbar('canvasRing1', Arcbar1, 0)
            this.showArcbar('canvasRing2', Arcbar2, 1)
            this.showArcbar('canvasRing3', Arcbar3, 2)
            this.showArcbar('canvasRing4', Arcbar4, 3)
            this.showArcbar('canvasRing5', Arcbar5, 4)
            this.showArcbar('canvasRing6', Arcbar6, 5)
            // console.log('chartForecastData', this.chartForecastData)
          }
        })
        .catch(e => {
          console.log(3, e)
          this.$message('加载失败，请点击重新加载')
        })
    },
    showArcbar (canvasId, chartData, index) {
      console.log('chartData', chartData)
      let _self = this
      _self.canvaRing[index] = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'ring',
        fontSize: 11,
        legend: { show: false },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidthPie * _self.pixelRatio,
        height: _self.cHeightPie * _self.pixelRatio,
        disablePieStroke: true,
        dataLabel: false,
        title: {
          name: chartData.series[chartData.series.length - 1].total,
          color: '#7cb5ec',
          fontSize: 25,
          offsetY: -2
        },
        extra: {
          pie: {
            labelWidth: 15
          }
        }
      })
    },
    getDepTimeList () {
      this.chartData2 = []
      let obj = {
        airportCode: this.airportCode
      }
      getTimeDistribution(obj)
        .then(res => {
          let xAxisData = []
          let lineData = []
          let estLineData = []
          let params = this.depTab2 === 0 ? 'Sch' : 'Act'
          if (res.status) {
            res.data[`normal${params}`].forEach(ele => {
              ele.startHTime >= 24 ? xAxisData.push(ele.startHTime - 24) : xAxisData.push(ele.startHTime)
            })
            let normalSch = res.data[`normal${params}`]
            for (let i = 0; i < normalSch.length; i++) {
              if (normalSch[i].data !== 0) {
                lineData.push(normalSch[i].data)
              } else {
                for (let k = i + 1; k < normalSch.length; k++) {
                  if (normalSch[k].data !== 0) {
                    lineData.push(normalSch[i].data)
                    break
                  }
                }
              }
            }
            let delaySch = res.data[`delay${params}`]
            for (let i = 0; i < delaySch.length; i++) {
              if (delaySch[i].data !== 0) {
                estLineData.push(delaySch[i].data)
              } else {
                for (let k = i + 1; k < delaySch.length; k++) {
                  if (delaySch[k].data !== 0) {
                    estLineData.push(delaySch[i].data)
                    break
                  }
                }
              }
            }
            this.chartData2 = Object.assign({}, this.chartData2, {
              categories: xAxisData,
              series: [
                {
                  name: '放行正常',
                  data: lineData,
                  color: '#2fc25b'
                },
                {
                  name: '放行延误',
                  data: estLineData,
                  color: '#facc14'
                }
              ]
            })
            this.showArea('canvasAreaRelease', this.chartData2)
            // if (!this.timerDep1) {
            //   this.timerDep1 = setInterval(() => {
            //     this.getDepTimeList()
            //   }, (this.indexParams.timer.DepList || 60) * 1000)
            // }
          }
        })
        .catch(err => {
          console.log(4, err)
          this.$message('加载失败，请点击重新加载')
        })
    },
    showArea (canvasId, chartData) {
      let _self = this
      _self.canvaArea = new uCharts({
        $this: (_self = this),
        canvasId: canvasId,
        type: 'area',
        fontSize: 11,
        legend: true,
        dataLabel: false,
        dataPointShape: true,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        enableMarkLine: false /***需要开启标记线***/,
        xAxis: {
          type: 'grid',
          gridColor: '#CCCCCC',
          gridType: 'dash',
          dashLength: 8
        },
        yAxis: {
          gridType: 'dash',
          gridColor: '#CCCCCC',
          dashLength: 8,
          splitNumber: 5,
          max: 40
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          area: {
            type: 'straight',
            opacity: 0.2,
            addLine: true,
            width: 2
          },
          markLine: {
            type: 'dash',
            dashLength: 5,
            data: [
              {
                value: this.indexParams.markLineVal[`${this.airportCode}DepAndArrList`] || 30,
                lineColor: '#f04864',
                showLabel: true
              }
            ]
          }
        }
      })
    },
    touchArea (e) {
      this.lastMoveTime = Date.now()
    },
    moveLineArea (e) {
      let currMoveTime = Date.now
      let duration = currMoveTime - this.lastMoveTime
      if (duration < Math.floor(1000 / 120)) return //每秒60帧
      this.lastMoveTime = currMoveTime
      this.canvaArea.showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + '架'
        }
      })
    },
    touchEndLineArea (e) {
      this.canvaArea.touchLegend(e)
      this.canvaArea.showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + '架'
        }
      })
    },
    depChange2 (index) {
      this.depTab2 = index
      this.getDepTimeList()
    },
    handleTab3 (index) {
      this.current3 = index
      if (this.current3 === 0) {
        this.displayChartData = deepCopy(this.noExecutedChartData)
        this.getCorData()
      }
    },
    // 点击tab切换分页效果，true为已执行，false未执行
    handleTab (index) {
      this.current = index
      if (this.current === 0) {
        this.displayChartData = deepCopy(this.executedChartData)
        this.getCorData()
      } else if (this.current3 === 0) {
        this.displayChartData = deepCopy(this.noExecutedChartData)
        this.getCorData()
      }
    },
    getDelayData () {
      let para = { airportCode: this.airportCode }
      this.executedChartData = [
        { disName: '0-5分钟' },
        { disName: '5-10分钟' },
        { disName: '10-30分钟' },
        { disName: '30-60分钟' },
        { disName: '1-2小时' },
        { disName: '2-4小时' },
        { disName: '超过4小时' }
      ]
      this.noExecutedChartData = [
        { disName: '0-5分钟' },
        { disName: '5-10分钟' },
        { disName: '10-30分钟' },
        { disName: '30-60分钟' },
        { disName: '1-2小时' },
        { disName: '2-4小时' },
        { disName: '超过4小时' }
      ]
      getDelayReleaseFlightStatistics(para)
        .then(res => {
          if (res.status) {
            this.bottomLoadFail = false
            this.delay = (res.data.todayDelay * 100).toFixed(2)
            this.executedTotal = 0
            this.noExecutedTotal = 0
            this.flightDelayList = res.data.notExecutedFlightList
            // this.flightDelayList.forEach(item => {
            //   if (item.localCtot && item.clearanceTarget) {
            //     item['ctotDly'] = moment(item.localCtot).diff(moment(item.clearanceTarget),'minute')
            //   } else {
            //     item['ctotDly'] = ''
            //   }
            // })
            // 已执行
            _.forIn(res.data.executed, (value, key) => {
              this.executedTotal = this.executedTotal + value
              switch (key) {
                case 'gt0mlte5m':
                  this.executedChartData[0].name = '0-5'
                  this.executedChartData[0].value = value
                  break
                case 'gt5mlte10m':
                  this.executedChartData[1].name = '5-10'
                  this.executedChartData[1].value = value
                  break
                case 'gt10mlte30m':
                  this.executedChartData[2].name = '10-30'
                  this.executedChartData[2].value = value
                  break
                case 'gt30mlte60m':
                  this.executedChartData[3].name = '30-60'
                  this.executedChartData[3].value = value
                  break
                case 'gt60mlte120m':
                  this.executedChartData[4].name = '>1'
                  this.executedChartData[4].value = value
                  break
                case 'gt120mlte240m':
                  this.executedChartData[5].name = '>2'
                  this.executedChartData[5].value = value
                  break
                case 'gt240m':
                  this.executedChartData[6].name = '>4'
                  this.executedChartData[6].value = value
                  break
                default:
                  break
              }
            })
            // 未执行
            _.forIn(res.data.notExecuted, (value, key) => {
              console.log(111, value, key)
              this.noExecutedTotal = this.noExecutedTotal + value
              console.log('noExecutedTotal', this.noExecutedTotal)
              switch (key) {
                case 'gt0mlte5m':
                  this.noExecutedChartData[0].name = '0-5'
                  this.noExecutedChartData[0].value = value
                  break
                case 'gt5mlte10m':
                  this.noExecutedChartData[1].name = '5-10'
                  this.noExecutedChartData[1].value = value
                  break
                case 'gt10mlte30m':
                  this.noExecutedChartData[2].name = '10-30'
                  this.noExecutedChartData[2].value = value
                  break
                case 'gt30mlte60m':
                  this.noExecutedChartData[3].name = '30-60'
                  this.noExecutedChartData[3].value = value
                  break
                case 'gt60mlte120m':
                  this.noExecutedChartData[4].name = '>1'
                  this.noExecutedChartData[4].value = value
                  break
                case 'gt120mlte240m':
                  this.noExecutedChartData[5].name = '>2'
                  this.noExecutedChartData[5].value = value
                  break
                case 'gt240m':
                  this.noExecutedChartData[6].name = '>4'
                  this.noExecutedChartData[6].value = value
                  break
                default:
                  break
              }
            })
            this.list[0].name = `已执行(延误：${this.executedTotal})`
            this.list[1].name = `未执行(延误：${this.noExecutedTotal})`
            this.getCorData()
          }
        })
        .catch(err => {
          console.log(1, err)
          this.bottomLoadFail = true
        })
    },
    getCorData () {
      var corData = []
      if (this.current === 0) {
        this.displayChartData = deepCopy(this.executedChartData)
        corData = {
          categories: this.executedChartData.map(i => i.name),
          series: [
            {
              name: '已执行',
              data: this.executedChartData.map(i => i.value)
            }
          ]
        }
      } else {
        corData = {
          categories: this.executedChartData.map(i => i.name),
          series: [
            {
              name: '未执行',
              data: this.noExecutedChartData.map(i => i.value)
            }
          ]
        }
      }
      console.log('corData', corData)
      this.showColumn('canvasColumnRelease', corData)
    },
    showColumn (canvasId, chartData) {
      let _self = this
      var width = uni.upx2px(730)
      this.canvaColumn = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'column',
        legend: { show: true },
        fontSize: 11,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        padding: [15, 0, 0, 0],
        legend: {
          show: true,
          padding: 0,
          lineHeight: 11,
          margin: 0
        },
        xAxis: {
          // disableGrid:true,
        },
        yAxis: {
          data: [
            {
              // position:'right',
              axisLine: true,
              format: val => {
                return val.toFixed(1)
              }
            }
          ]
        },
        dataLabel: true,
        width: width * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (width * _self.pixelRatio * 0.45) / chartData.categories.length
          }
        }
      })
    },
    touchColumn (e) {
      this.canvaColumn.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === 'object') {
            return category + ' ' + item.name + ':' + item.data.value + '架'
          } else {
            return category + ' ' + item.name + ':' + item.data + '架'
          }
        }
      })
    },
    getData (val) {
      this.cleanTimer()
      let para = { airportCode: this.airportCode }
      this.getDlyForecastData()
      this.getDepTimeList()
      this.getDelayData()
      getArrowData(para).then(res => {
        if (res.status) {
          this.forecast = res.data
        }
      })
      getDlyReasonFlight(para)
        .then(res => {
          this.dlyTotal = 0
          let data = []
          if (res.status) {
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getData('setInterval')
              }, 60 * 1000)
            }
            if (res.data.length !== 0) {
              res.data.forEach(item => {
                data.push({
                  name: item.type,
                  data: item.number
                })
                this.dlyTotal += item.number
              })
            } else {
              data = [
                {
                  name: '当前无延误',
                  data: 0
                }
              ]
            }
            this.reasonList = data
            this.chartData = data
            this.showPie('canvasPie', { series: data })
            console.log('reasonList', this.reasonList)
          }
        })
        .catch(err => {
          console.log(2, err)
          clearInterval(this.timer)
          this.timer = null
          this.topLoadFail = true
        })
      let routeData = []
      getNormalReleaseRateRoute(para).then(res => {
        if (res.status) {
          this.routeNormalRate = []
          if (this.airportCode === 'ZSAM') {
            let routePoint = ['DO', 'FQG', 'DABER', 'IKATA', 'H98']
            routePoint.forEach((item, index) => {
              this.routeNormalRate.push({ label: item, value: (res.data[item] * 100).toFixed(2) })
            })
          } else {
            _.forIn(res.data, (value, key) => {
              if (key !== 'delay') {
                this.routeNormalRate.push({ label: key, value: (value * 100).toFixed(2) })
              }
            })
          }
          
          if (Object.keys(res.data.delay).length === 0) {
            routeData = [
              {
                name: '当前无延误',
                data: 0
              }
            ]
          } else {
            Object.entries(res.data.delay).forEach(([key, value]) => {
              routeData.push({name: key, data: value})
            })
          }
          this.showPieRoute('canvasPieRoute', {series: routeData})
        }
      })
    },
    showPieRoute (canvasId, chartData) {
      let _self = this
      this.canvaPieRoute = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'pie',
        fontSize: 13,
        padding: [15, 15, 0, 15],
        legend: {
          show: true,
          position: 'right',
          float: 'center',
          padding: 5,
          lineHeight: 20,
          margin: 0
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            border: true,
            borderColor: '#FFFFFF',
            borderWidth: 3
          }
        }
      })
      this.piearr = this.canvaPie.opts.series
    },
    showPie (canvasId, chartData) {
      console.log(11111, canvasId, chartData.series)
      let _self = this
      console.log(_self.pixelRatio, _self.cWidth * _self.pixelRatio, _self.cHeight * _self.pixelRatio)
      this.canvaPie = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'pie',
        fontSize: 13,
        padding: [15, 15, 0, 15],
        legend: {
          show: true,
          position: 'right',
          float: 'center',
          padding: 5,
          lineHeight: 20,
          margin: 0
        },
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: true,
        extra: {
          pie: {
            border: true,
            borderColor: '#FFFFFF',
            borderWidth: 3
          }
        }
      })
      this.piearr = this.canvaPie.opts.series
    },
    touchPieRoute (e) {
      this.canvaPieRoute.showToolTip(e, {
        format: function (item) {
          return item.name + ':' + item.data + '架'
        }
      })
    },
    touchPie (e) {
      this.canvaPie.showToolTip(e, {
        format: function (item) {
          return item.name + ':' + item.data
        }
      })
    },
    cleanTimer () {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="scss">
.release-layout {
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20rpx;
  
    .titleIcon {
      width: 25rpx;
      height: 28rpx;
    }
  
    .titleText {
      color: #333333;
      font-weight: bold;
      font-size: 30rpx;
      padding-left: 10rpx;
    }
  }
  .queue {
    margin-bottom: 10rpx;
  }
  .takeOff {
    margin-top: 40rpx;
  }
  .delay-flight-detail {
    .table-contend {
      max-height: 500rpx;
      overflow-y: auto;
    }
  }
  .forecast-class {
    padding: 10rpx 0;
    background-color: #ffffff;
    .oneHour {
      display: flex;
      justify-content: space-around;
      margin-top: 40rpx;
    }
  }
  .charts3 {
    width: 380upx;
    height: 240upx;
    background-color: #ffffff;
  }
  .qiun-charts3 {
    width: 360upx;
    height: 240upx;
    // bottom: 20rpx;
    // background-color: #FFFFFF;
    // position: relative;
  }
  .qiun-charts2 {
    width: 300upx;
    background-color: #ffffff;
  }
  .charts2 {
    width: 730upx;
    height: 500upx;
    background-color: #ffffff;
  }
  .qiun-charts {
    width: 750upx;
    height: 500upx;
    background-color: #ffffff;
  }

  .charts {
    width: 750upx;
    height: 500upx;
    background-color: #ffffff;
  }
  .btns {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10rpx;

    &::-webkit-scrollbar {
      height: 0;
    }

    .item {
      display: inline-block;
      height: 120rpx;
      background: #ffffff;
      width: 220rpx;
      border-radius: 14rpx;
      margin: 0 10rpx;

      .time-num {
        height: 90rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10rpx 20rpx;
      }

      .time {
        color: #a6a6a6;
        font-size: 28rpx;
      }

      .num {
        color: #333333;
        font-weight: bold;
      }
    }
  }
  .releaseDelayTotal {
    background: #ffffff;
    border-radius: 14rpx;
    margin: 20rpx 0;
    .delayTotal {
      .todayDelay {
        background-image: linear-gradient(90deg, #73a2fc 0%, #83cbfd 100%);
        height: 148rpx;
        display: flex;
        align-items: center;

        .rateIcon {
          margin-left: 50rpx;
          height: 66rpx;
          width: 66rpx;
        }

        .name-num {
          padding-left: 20rpx;

          .name {
            font-size: 28rpx;
            color: #ffffff;
            opacity: 0.65;
          }

          .num {
            color: #ffffff;
            font-weight: bold;
            padding-top: 10rpx;
            font-size: 36rpx;
          }
        }
      }

      .tab {
        padding: 10rpx;
      }
    }
  }
  .release-main {
    background: #ffffff;
    padding: 33rpx 17rpx;
    border-radius: 7rpx;
  }
  #tipTitle {
    position: fixed;
    color: #ffffff;
    font-size: 28rpx;
    background: #ebb563;
  }

  .releaseInfo {
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;

      .titleIcon {
        width: 25rpx;
        height: 28rpx;
      }

      .titleText {
        color: #333333;
        font-weight: bold;
        font-size: 29rpx;
        padding-left: 10rpx;
      }
    }

    .main {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding: 30rpx 20rpx 0 20rpx;

      .name-num {
        width: 33%;
        padding-bottom: 24rpx;

        .name {
          font-size: 28rpx;
          color: #a6a6a6;
        }

        .num {
          font-size: 32rpx;
          color: #333333;
          font-weight: bold;
          padding-top: 10rpx;
        }
      }
    }

    .reasonMain {
      display: flex;
      flex-direction: row;

      .other {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        padding-left: 20rpx;

        .reason-num {
          width: 31%;

          .reason {
            color: #a6a6a6;
            font-size: 28rpx;
            display: flex;
            flex-direction: row;
            align-items: center;

            .text {
              padding-left: 10rpx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .circular {
              height: 16rpx;
              width: 16rpx;
              border-radius: 100%;
            }
          }

          .num {
            color: #333333;
            font-weight: bold;
            padding-left: 30rpx;
            padding-top: 10rpx;
          }
        }
      }
    }

    .left {
      text-align: left;
    }

    .right {
      text-align: right;
    }

    .center {
      text-align: center;
    }
  }
}
</style>
