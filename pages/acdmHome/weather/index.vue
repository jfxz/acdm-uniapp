/* * 界面名称: 运行指标-天气页面 * 界面功能: * 其他 * 时间 2020-10-29 09:33:51 * 作者 zql */
<template>
  <view class="weather-layout">
    <view class="time">
      <view class="main">
        <view class="pushTime">
          <text>气象发布时间：</text>
          <text>{{ pushTime }}</text>
        </view>
        <view class="weather-status">
          <text :class="['value', judgeTotal('class')]">{{ judgeTotal('value') }}</text>
        </view>
        <view class="weather-standard">
          <view class="standard">
            <text class="label">起飞标准：</text>
            <text :class="['value', judgeStatus(standard.takeoff)]">{{ standard.takeoff }}</text>
          </view>
          <view class="standard">
            <text class="label">降落标准：</text>
            <text :class="['value', judgeStatus(standard.land)]">{{ standard.land }}</text>
          </view>
          <view class="airport">{{ airportCode }}</view>
        </view>
      </view>

      <!-- <view class="main">
        <view class="time-date">
          <view class="time">{{nowTime}}</view>
          <view class="date">{{nowDate + ' ' + week}}</view>
          <view class="pushTime">发布时间：{{pushTime}}</view>
        </view>
        <view class="icon-airport">
          <view style="height: 84rpx"></view>
          <view class="airport">{{airportCode}}</view>
        </view>
      </view> -->
    </view>
    <view class="weather-msg">
      <view class="flex-weather">
        <weather :weartherData="mistData"></weather>
        <weather :weartherData="dewPointData"></weather>
        <weather :weartherData="cloudData"></weather>
      </view>
      <view class="flex-weather">
        <weather :weartherData="visibilityData"></weather>
        <weather :weartherData="windData"></weather>
        <weather :weartherData="pressureData"></weather>
      </view>
    </view>

    <view class="weather-trend">
      <view class="flex-trend">
        <view class="titleIcon"></view>
        <view class="mainTitle1">未来天气趋势</view>
      </view>
      <view class="trend-msg">{{ trendData }}</view>
    </view>
    
    <view class="weather-trend">
      <view class="flex-trend">
        <view class="titleIcon"></view>
        <view class="mainTitle1">天气动态(当天本场)</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="trends-charts">
          <view class="trends-item">
            <!-- 能见度 -->
            <view class="qiun-charts">
              <canvas canvas-id="canvasVis" id="canvasVis" class="charts" @touchstart="touchLineVis" @touchmove="moveLineAreaVis" @touchend="touchEndLineAreaVis"></canvas>
            </view>
            <!-- 温度 -->
            <view class="qiun-charts">
              <canvas canvas-id="canvasTem" id="canvasTem" class="charts" @touchstart="touchLineTem" @touchmove="moveLineAreaTem" @touchend="touchEndLineAreaTem"></canvas>
            </view>
            <!-- 风力 -->
            <view class="qiun-charts">
              <canvas canvas-id="canvasWin" id="canvasWin" class="charts" @touchstart="touchLineWin" @touchmove="moveLineAreaWin" @touchend="touchEndLineAreaWin"></canvas>
            </view>
            <!-- 云高 -->
            <view class="qiun-charts">
              <canvas canvas-id="canvasClo" id="canvasClo" class="charts" @touchstart="touchLineClo" @touchmove="moveLineAreaClo" @touchend="touchEndLineAreaClo"></canvas>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="weather-trend">
      <view class="flex-trend">
        <view class="titleIcon"></view>
        <view class="mainTitle1">本场气象报</view>
      </view>
      <view class="trend-msg">
        <u-read-more text-indent="0" :toggle="true" ref="uReadMorePost" show-height="500"><rich-text :nodes="postText"></rich-text></u-read-more>
      </view>
    </view>
    <view class="weather-trend">
      <view class="flex-trend">
        <view class="titleIcon"></view>
        <view class="mainTitle1">其他机场异常天气情况</view>
      </view>
      <view class="trend-msg">
        <u-read-more text-indent="0" :toggle="true" ref="uReadMore" show-height="500"><rich-text :nodes="text"></rich-text></u-read-more>
      </view>
    </view>
    
  </view>
</template>

<script>
import moment from 'moment'
import uCharts from '@/components/u-charts/u-charts.js'
import Weather from './weather-info'
import { getWeatherData, getAbnWeatherData, getLocalWeatherData, getDynamicWeatherData } from '@/api/home/weather/index.js'
import Mist from '@/static/charts/mist_mobile.png'
import DewPoint from '@/static/charts/dewPoint_mobile.png'
import Cloud from '@/static/charts/cloud_mobile.png'
import Visibility from '@/static/charts/visibility_mobile.png'
import Wind from '@/static/charts/wind_mobile.png'
import Pressure from '@/static/charts/pressure_mobile.png'
import ClockImg from '@/static/charts/clock.png'
import dayjs from '@/common/util/dayjs.min.js'
const weeks = {
  '0': '星期日',
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六'
}
export default {
  components: { Weather },
  props: {
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
      localList: [],
      abnomalList: [],
      standard: {},
      canvaLine: {},
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      postText: '',
      text: '',
      pushTime: '',
      week: '',
      nowTime: '',
      nowDate: '',
      showChart: false,
      message: '加载中',
      timer: null,
      mistData: {
        name: '天气',
        value: '—',
        inmSrc: Mist
      },
      dewPointData: {
        name: '温度/露点',
        value: '0',
        inmSrc: DewPoint
      },
      cloudData: {
        name: '云',
        value: '无云',
        inmSrc: Cloud
      },
      visibilityData: {
        name: '能见度',
        value: '0',
        inmSrc: Visibility
      },
      windData: {
        name: '风',
        value: '0',
        inmSrc: Wind
      },
      pressureData: {
        name: '气压',
        value: '0',
        inmSrc: Pressure
      },
      trendData: '',
      timeData: {
        name: '刷新时间',
        value: '-',
        inmSrc: ClockImg
      }
    }
  },
  computed: {},
  deactivated () {
    this.cleanTimer()
  },
  beforeDestroy () {
    this.cleanTimer()
  },
  created () {
    this.nowTime = dayjs().format('HH:mm')
    this.nowDate = dayjs().format('MM月DD日')
    this.week = weeks[dayjs().format('d')]
  },
  mounted () {
    this.cWidth = uni.upx2px(730)
    this.cHeight = uni.upx2px(500)
  },
  methods: {
    judgeTotal (flag) {
      if (!this.standard.land) {
        return ''
      }
      if (this.standard.land.indexOf('不符合') !== -1 || this.standard.takeoff.indexOf('不符合') !== -1) {
        return flag === 'class' ? 'noAccordWith' : '天气不适航'
      }
      return flag === 'class' ? 'accordWith' : '天气适航'
    },
    judgeStatus (text) {
      if (!text) {
        return ''
      }
      if (text.indexOf('临界') !== -1) {
        return 'critical'
      } else if (text.indexOf('不符合') !== -1) {
        return 'noAccordWith'
      } else {
        return 'accordWith'
      }
    },
    // 能见度、温度、风力、云高变化图形折线图设置参数
    showLine (canvasId, chartData, unit) {
      let that = this
      this.canvaLine[canvasId] = new uCharts({
        $this: that,
        canvasId: canvasId,
        type: 'line',
        fontSize: 11,
        legend: { show: true },
        dataLabel: false,
        dataPointShape: true,
        background: '#FFFFFF',
        pixelRatio: that.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        xAxis: {
          labelCount: 8,
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
          min: 0,
          max: 10,
          format: val => {
            return val.toFixed(0) + unit
          }
        },
        width: that.cWidth * that.pixelRatio,
        height: that.cHeight * that.pixelRatio,
        extra: {
          line: {
            type: 'straight'
          }
        }
      })
    },
    // 以下是四个图表的点击事件
    touchLineVis (e) {
      this.lastMoveTime = Date.now()
    },
    moveLineAreaVis (e) {
      let that = this
      let currMoveTime = Date.now
      let duration = currMoveTime - this.lastMoveTime
      if (duration < Math.floor(1000 / 120)) return //每秒60帧
      this.lastMoveTime = currMoveTime
      this.canvaLine['canvasVis'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    touchEndLineAreaVis (e) {
      let that = this
      this.canvaLine['canvasVis'].touchLegend(e)
      this.canvaLine['canvasVis'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    touchLineTem (e) {
      this.lastMoveTime = Date.now()
    },
    moveLineAreaTem (e) {
      let currMoveTime = Date.now
      let duration = currMoveTime - this.lastMoveTime
      if (duration < Math.floor(1000 / 120)) return //每秒60帧
      this.lastMoveTime = currMoveTime
      let that = this
      this.canvaLine['canvasTem'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    getUnit (item) {
      let unit = ''
      if (item.name === '能见度变化') {
        unit = '米'
      } else if (item.name === '温度变化') {
        unit = '度' 
      } else if (item.name === '风力变化') {
        unit = 'm/s' 
      } else {
        unit = '米'
      }
      return unit
    },
    touchEndLineAreaTem (e) {
      let that = this
      this.canvaLine['canvasTem'].touchLegend(e)
      this.canvaLine['canvasTem'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    touchLineClo (e) {
      this.lastMoveTime = Date.now()
    },
    moveLineAreaClo (e) {
      let currMoveTime = Date.now
      let duration = currMoveTime - this.lastMoveTime
      if (duration < Math.floor(1000 / 120)) return //每秒60帧
      this.lastMoveTime = currMoveTime
      let that = this
      this.canvaLine['canvasClo'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    touchEndLineAreaClo (e) {
      let that = this
      this.canvaLine['canvasClo'].touchLegend(e)
      this.canvaLine['canvasClo'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    touchLineWin (e) {
      this.lastMoveTime = Date.now()
    },
    moveLineAreaWin (e) {
      let that = this
      let currMoveTime = Date.now
      let duration = currMoveTime - this.lastMoveTime
      if (duration < Math.floor(1000 / 120)) return //每秒60帧
      this.lastMoveTime = currMoveTime
      this.canvaLine['canvasWin'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    touchEndLineAreaWin (e) {
      let that = this
      this.canvaLine['canvasWin'].touchLegend(e)
      this.canvaLine['canvasWin'].showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + that.getUnit(item)
        }
      })
    },
    formatTime (time) {
      if (time) {
        return moment(time).format('MM-DD HH:mm')
      }
      return ''
    },
    getData () {
      let c = dayjs().format('YYYY-MM-DD')
      let obj = {
        airportCode: this.airportCode,
        type: 'Metar',
        time: dayjs(c).valueOf()
      }
      let visData = []
      let temData = []
      let winData = []
      let cloData = []
      getDynamicWeatherData(obj).then(res => {
        if (res.status) {
          visData = res.data.map(i => i.visibilityNum)
          temData = res.data.map(i => i.temperatureNum)
          winData = res.data.map(i => i.windNum)
          cloData = res.data.map(i => i.cloudsNum)
          let categories = []
          for (let i = 0; i <= 23; i++) {
            categories.push(i)
          }
          let seriesVis = [{ name: '能见度变化', data: visData, color: '#1890ff' }]
          let seriesTem = [{ name: '温度变化', data: temData, color: '#2fc25b' }]
          let seriesWin = [{ name: '风力变化', data: winData, color: '#facc14' }]
          let seriesClo = [{ name: '云高变化', data: cloData, color: '#8543e0' }]
          let chartsDataVis = {
            categories: categories,
            series: seriesVis
          }
          let chartsDataTem = {
            categories: categories,
            series: seriesTem
          }
          let chartsDataWin = {
            categories: categories,
            series: seriesWin
          }
          let chartsDataClo = {
            categories: categories,
            series: seriesClo
          }
          this.showLine('canvasVis', chartsDataVis, '米')
          this.showLine('canvasTem', chartsDataTem, '度')
          this.showLine('canvasWin', chartsDataWin, 'm/s')
          this.showLine('canvasClo', chartsDataClo, '米')
        }
      })

      getAbnWeatherData(obj).then(res => {
        if (res.status) {
          this.abnomalList = res.data
          this.abnomalList.forEach(item => {
            let parsingObj = JSON.parse(item.parsingMessage)
            this.text =
              this.text +
              `<div style="background: #66CCFF;display: flex;
                        justify-content: space-between;"><span style="color: rgb(24, 144, 255)">
                        ${item.flightCode}  </span><span>${parsingObj.WEATHER}/能见度${parsingObj.VISIBILITY} </span>
                        <span style="text-align: right;">${this.formatTime(item.pushTime)}</span></div>
                        <div style="background: #66FFFF">${item.content}</div>`
          })
          this.$nextTick(() => {
            this.$refs.uReadMore.init()
          })
        }
      })
      getLocalWeatherData(obj).then(res => {
        if (res.status) {
          this.localList = res.data
          this.localList.forEach(item => {
            let parsingObj = JSON.parse(item.parsingMessage)
            let VISIBILITY = parsingObj.VISIBILITY
            if (VISIBILITY.indexOf('能见度') !== -1) {
              VISIBILITY = VISIBILITY.replace('能见度', '')
            }
            this.postText =
              this.postText +
              `<div style="background: #66CCFF;display: flex;
                      justify-content: space-between;"><span>${parsingObj.WEATHER}/能见度${VISIBILITY} </span>
                      <span style="text-align: right;">${this.formatTime(item.pushTime)}</span></div>
                      <div style="background: #66FFFF">${item.content}</div>`
          })
          this.$nextTick(() => {
            this.$refs.uReadMorePost.init()
          })
        }
      })
      this.nowTime = dayjs().format('HH:mm')
      this.nowDate = dayjs().format('MM月DD日')
      this.week = weeks[dayjs().format('d')]
      this.cleanTimer()

      getWeatherData(obj)
        .then(res => {
          if (res && res.status && res.data) {
            let data = JSON.parse(res.data.parsingMessage)
            this.standard = res.data.standard
            if (res.data && res.data.parsingMessage) {
              this.pushTime = dayjs(res.data.pushTime).format('YYYY-MM-DD HH:mm')
              console.log('pushTime', this.pushTime)
              this.mistData = Object.assign({}, this.mistData, { value: data['WEATHER'] || '—'})
              this.dewPointData = Object.assign({}, this.dewPointData, { value: data['Temperature/Dew'] ? data['Temperature/Dew'] + '°C ' : '-' })
              this.cloudData = Object.assign({}, this.cloudData, { value: data['CLOUDS'] || '无云' })
              if (data['VISIBILITY'] && data['VISIBILITY'].indexOf('能见度') !== -1) {
                 data['VISIBILITY'] = data['VISIBILITY'].replace('能见度', '')
              }
              this.visibilityData = Object.assign({}, this.visibilityData, { value: data['VISIBILITY'] || 0 })
              this.windData = Object.assign({}, this.windData, { value: data['wind'] || 0 })
              this.pressureData = Object.assign({}, this.pressureData, { value: data['pressure'] || 0 })
              this.trendData = data['TREND']
              this.timeData = Object.assign({}, this.timeData, { value: data['time'] && data['time'].split(' ') ? data['time'].split(' ').pop() : 0 })
            } else {
              this.mistData = Object.assign({}, this.mistData, { value: '-' })
              this.dewPointData = Object.assign({}, this.dewPointData, { value: '-' })
              this.cloudData = Object.assign({}, this.cloudData, { value: 0 })
              this.visibilityData = Object.assign({}, this.visibilityData, { value: 0 })
              this.windData = Object.assign({}, this.windData, { value: 0 })
              this.pressureData = Object.assign({}, this.pressureData, { value: 0 })
              this.trendData = ''
              this.timeData = Object.assign({}, this.timeData, { value: data['time'] && data['time'].split(' ') ? data['time'].split(' ').pop() : 0 })
            }
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getData()
              }, (this.indexParams.timer.weather || 60) * 1000)
            }
            this.showChart = true
          } else {
            this.mistData = Object.assign({}, this.mistData, { value: '-' })
            this.dewPointData = Object.assign({}, this.dewPointData, { value: '-' })
            this.cloudData = Object.assign({}, this.cloudData, { value: 0 })
            this.visibilityData = Object.assign({}, this.visibilityData, { value: 0 })
            this.windData = Object.assign({}, this.windData, { value: 0 })
            this.pressureData = Object.assign({}, this.pressureData, { value: 0 })
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getData()
              }, (this.indexParams.timer.weather || 60) * 1000)
            }
            let p = dayjs().format('HH:mm')
            this.timeData.value = p
            this.showChart = true
          }
        })
        .catch(e => {
          console.log(e)
          clearInterval(this.timer)
          this.timer = null
        })
    },
    /**
     * 清空定时器
     */
    cleanTimer () {
      this.timer && clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="scss">
.weather-layout {
  .trends-charts {
    .title {
      font-size: 30rpx;
      text-align: center;
    }
    .trends-item {
      // display: flex;
      // flex-wrap: wrap;
      .qiun-charts {
        width: 730upx;
        height: 500upx;
        background-color: #ffffff;
      }
      .charts {
        width: 730upx;
        height: 500upx;
        background-color: #ffffff;
      }
    }
  }
  .time {
    .main {
      align-items: center;
      height: 224rpx;
      background-image: linear-gradient(90deg, #6a9cfc 0%, #82cafd 100%);
      border-radius: 7rpx;
      padding: 0 10rpx;
      margin: 10rpx 0;
      font-weight: bold;
      .pushTime {
        color: rgba(246, 255, 255, 0.45);
        font-size: 35rpx;
      }
      .weather-status {
        font-size: 70rpx;
        color: #00aa00;
        line-height: 120rpx;
        text-align: left;
        .value {
          &.accordWith {
            color: #00aa00;
          }
          &.noAccordWith {
            color: #e52d2c;
          }
        }
      }
      .weather-standard {
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        height: 40rpx;
        line-height: 40rpx;
        .standard {
          .label {
            color: #ffffff;
          }
          .value {
            color: #ffffff;
            &.critical {
              color: #f3c446;
            }
            &.accordWith {
              color: #00aa00;
            }
            &.noAccordWith {
              color: #e52d2c;
            }
          }
        }
      }
    }
  }
  .weather-msg {
    padding: 10rpx 0 100rpx;
    background: rgb(255, 255, 255);
    border-radius: 10rpx;
    height: 450rpx;
  }
  .weather-trend {
    background-color: #ffffff;
    border-radius: 10rpx;
    margin-top: 20rpx;
    padding: 30rpx 10rpx 10rpx 10rpx;
    .flex-trend {
      display: flex;
      flex-direction: row;
    }
    .trend-msg {
      font-size: 28rpx;
      color: rgba(0, 0, 0, 0.45);
      padding: 20rpx 40rpx;
    }
    .mainTitle1 {
      font-size: 31rpx;
      font-weight: bold;
      color: #333333;
      margin-left: 10rpx;
      line-height: 32rpx;
      height: 32rpx;
    }
    .titleIcon {
      background: #1890ff;
      width: 8rpx;
      height: 32rpx;
      display: inline-block;
      border-radius: 10rpx;
    }
  }
  .flex-weather {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
  }
}
</style>
