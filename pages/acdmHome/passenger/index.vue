/* * 界面名称: 旅客概览 * 界面功能: * 其他 * 时间 2020-10-29 09:44:04 * 作者 zql */
<template>
  <view class="arrAndDepPassengerClass">
    <view class="tabs" v-if="airportCode === 'ZSAM'">
      <view class="tab" style="border-radius: 10rpx14rpx 0 0" :class="tabFlag === 'All' ? 'tabActive' : 'tab3NoActive'" @click="changeTab('All')"><span>全部</span></view>
      <view class="tab" style="border-radius: 14rpx 10rpx 0 0" :class="tabFlag === 'T3' ? 'tabActive' : 'tab1NoActive'" @click="changeTab('T3')"><span>T3</span></view>
      <view class="tab" style="border-radius: 10rpx14rpx 0 0" :class="tabFlag === 'T4' ? 'tabActive' : 'tab2NoActive'" @click="changeTab('T4')"><span>T4</span></view>
    </view>
    <view class="tabs" v-else>
      <view>
        <view class="tab" style="border-radius: 10rpx 14rpx 0 0" @click="changeTab('T1')"><span>T1</span></view>
      </view>
    </view>
    <view class="info">
      <!--      中间线-->
      <!-- <view class="circular" style="left: -22rpx;top:310rpx"></view>
      <view class="circular" style="right: -22rpx;top:310rpx"></view>
      <view style="position:absolute;border: 2rpx dashed #f5f5f5;top:330rpx;width: 100%"></view> -->
      <!--      中间线-->
      <!-- <view class="circular" style="left: -22rpx;top:740rpx"></view>
      <view class="circular" style="right: -22rpx;top:740rpx"></view>
      <view style="position:absolute;border: 2rpx dashed #f5f5f5;top:760rpx;width: 100%"></view> -->
      <!--      中间线-->
      <!-- <view class="circular" style="left: -22rpx;top:1090rpx"></view>
      <view class="circular" style="right: -22rpx;top:1090rpx"></view>
      <view style="position:absolute;border: 2rpx dashed #f5f5f5;top:1110rpx;width: 100%"></view> -->
      <!-- 当天机场各类人数 -->
      <!-- <view class="infoItem">
        <view class="title">
          <image src="../../../static/charts/titleIcon1_mobile.png" mode="aspectFit" style="height:28rpx;width:28rpx;"></image>
          <view style="color: #333333;font-size: 30rpx;padding-left: 10rpx;font-weight: bold">当天人数</view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">机场代理</view>
            <view class="num">{{ showData.predict.totalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">厦航代理</view>
            <view class="num">{{ showData.predict.airAgentNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">厦航旅客</view>
            <view class="num">{{ showData.predict.xiaMenAgentNumber }}</view>
          </view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">国际旅客</view>
            <view class="num">{{ showData.predict.internationalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">地区旅客</view>
            <view class="num">{{ showData.predict.areaNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">国内旅客</view>
            <view class="num">{{ showData.predict.domesticNumber }}</view>
          </view>
        </view>
      </view> -->

      <!-- 今年累计旅客吞吐量 -->
      <!-- <view class="infoItem">
        <view class="title">
          <image src="../../../static/charts/titleIcon1_mobile.png" mode="aspectFit" style="height:28rpx;width:28rpx;"></image>
          <view style="color: #333333;font-size: 30rpx;padding-left: 10rpx;font-weight: bold">今年累计旅客吞吐量</view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">进出港</view>
            <view class="num">{{ showData.predict.totalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">进港</view>
            <view class="num">{{ showData.predict.airAgentNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">出港</view>
            <view class="num">{{ showData.predict.xiaMenAgentNumber }}</view>
          </view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">机场代理</view>
            <view class="num">{{ showData.predict.internationalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">厦航代理</view>
            <view class="num">{{ showData.predict.areaNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">厦航</view>
            <view class="num">{{ showData.predict.domesticNumber }}</view>
          </view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">国际</view>
            <view class="num">{{ showData.predict.internationalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">地区</view>
            <view class="num">{{ showData.predict.areaNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">国内</view>
            <view class="num">{{ showData.predict.domesticNumber }}</view>
          </view>
        </view>
      </view>
 -->
      <!-- <view class="infoItem">
        <view class="title">
          <image src="../../../static/charts/titleIcon1_mobile.png" mode="aspectFit" style="height:28rpx;width:28rpx;"></image>
          <view style="color: #333333;font-size: 30rpx;padding-left: 10rpx;font-weight: bold">预计保障人数</view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">总预计</view>
            <view class="num">{{ showData.predict.totalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">机场代理</view>
            <view class="num">{{ showData.predict.airAgentNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">厦航代理</view>
            <view class="num">{{ showData.predict.xiaMenAgentNumber }}</view>
          </view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">国际</view>
            <view class="num">{{ showData.predict.internationalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">地区</view>
            <view class="num">{{ showData.predict.areaNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">国内</view>
            <view class="num">{{ showData.predict.domesticNumber }}</view>
          </view>
        </view>
      </view> -->
      <view class="infoItem">
        <view class="title" style="margin-top: 10rpx">
          <image src="../../../static/charts/titleIcon2_mobile.png" mode="aspectFit" style="height:28rpx;width:28rpx;"></image>
          <view style="color: #333333;font-size: 30rpx;padding-left: 10rpx;font-weight: bold">已保障人数</view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">总保障</view>
            <view class="num">{{ showData.already.totalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">机场代理</view>
            <view class="num">{{ showData.already.airAgentNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">厦航代理</view>
            <view class="num">{{ showData.already.xiaMenAgentNumber }}</view>
          </view>
        </view>
        <view class="row">
          <view class="name-num left-text">
            <view class="name">国际</view>
            <view class="num">{{ showData.already.internationalNumber }}</view>
          </view>
          <view class="name-num center-text">
            <view class="name">地区</view>
            <view class="num">{{ showData.already.areaNumber }}</view>
          </view>
          <view class="name-num right-text">
            <view class="name">国内</view>
            <view class="num">{{ showData.already.domesticNumber }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="other">
      <view class="item">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">还需保障人数</view>
          <view class="num">{{ showData.needNumber }}</view>
        </view>
      </view>
      <view class="item">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">已保障人数占比</view>
          <view class="num">{{ showData.alreadyProportion ? Number(showData.alreadyProportion) : '' }}</view>
        </view>
      </view>
      <view class="item" v-if="displayType !== 'arr'">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">办理值机人数</view>
          <view class="num">{{ showData.acPrstaNumber }}</view>
        </view>
      </view>
      <view class="item" v-if="displayType !== 'arr'">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">已过安检人数</view>
          <view class="num">{{ showData.alreadySecurityNumber }}</view>
        </view>
      </view>
      <view class="item" v-if="displayType !== 'arr'">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">已登机人数</view>
          <view class="num">{{ showData.alreadyBoardingNumber }}</view>
        </view>
      </view>
      <view class="item" v-if="displayType !== 'arr'">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">候机人数</view>
          <view class="num">{{ showData.depWaitingNumber }}</view>
        </view>
      </view>
      <view class="item">
        <image src="../../../static/charts/dayRate_mobile.png" mode="aspectFit" class="otherImg"></image>
        <view class="name-num">
          <view class="name">预测客座率</view>
          <view class="num">{{ showData.predictGuestProportion ? Number(showData.predictGuestProportion) : '' }}</view>
        </view>
      </view>
    </view>
    <view class="gms-charts">
      <view class="title">
        <view class="titleIcon"></view>
        <view class="mainTitle1">实际保障</view>
      </view>
      <view class="qiun-charts2">
        <canvas canvas-id="canvasArea2" id="canvasArea2" class="charts2" @touchstart="touchArea" @touchmove="moveLineArea" @touchend="touchEndLineArea"></canvas></view>
    </view>
    <view class="gms-charts">
      <view class="title">
        <view class="titleIcon"></view>
        <view class="mainTitle1">日/月旅客吞吐量统计分析</view>
      </view>
      <view style="margin-bottom: 10rpx;">
        <u-subsection :list="list" @change="handleTab" inactive-color="#000" active-color="#fff" 
        bg-color="#fff" button-color="#1890ff" :current="current">
        </u-subsection></view>
      <view class="qiun-charts2"><canvas canvas-id="canvasPassenger" id="canvasPassenger" class="charts2" @touchstart="touchPassenger"></canvas></view>
    </view>
    <view class="detail">
      <view class="detail-title">统计分类</view>
      <view class="detail-contend">
        <view class="detail-item" v-if="airportCode === 'ZSFZ'">
          <text class="label">T1：</text>
          <text class="value">{{ itemData.TOTAL }}</text>
        </view>
        <view class="detail-item" v-if="airportCode === 'ZSAM'">
          <text class="label">T3：</text>
          <text class="value">{{ itemData.TERMINAL3 }}</text>
        </view>
        <view class="detail-item" v-if="airportCode === 'ZSAM'">
          <text class="label">T4：</text>
          <text class="value">{{ itemData.TERMINAL4 }}</text>
        </view>
        <view class="detail-item">
          <text class="label">机场代理：</text>
          <text class="value">{{ itemData.AGENTAIRPORT }}</text>
        </view>
        <view class="detail-item">
          <text class="label">厦航代理：</text>
          <text class="value">{{ itemData.AGENTAIRLINE }}</text>
        </view>
        <view class="detail-item">
          <text class="label">国内：</text>
          <text class="value">{{ itemData.INTERNAL }}</text>
        </view>
        <view class="detail-item">
          <text class="label">国际(地区)：</text>
          <text class="value">{{ itemData.INTERNATIONAL }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js'
import { deepCopy } from '@/common/util/util.js'
import { getPassengerInfoTotal, getPassengerGuarantee, getPassengerDay, getPassengerMonth } from '@/api/home/passenger/index.js'
import dayjs from '@/common/util/dayjs.min.js'
export default {
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
      itemData: {},
      passengerData: [],
      current: 0,
      list: ['日旅客吞吐量', '月旅客吞吐量'],
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      displayType: 'all',
      tabFlag: 'All',
      displayData: {
        All: {
          already: {},
          predict: {}
        },
        T3: {},
        T4: {},
        T1: {}
      },
      showData: {
        already: {},
        predict: {}
      },
      sourceData: {
        All: {},
        T3: {},
        T4: {},
        T1: {}
      },
      canvaColumn: null,
      canvaArea: null,
      chartData: [],
      xAxisData: [],
      timer: null,
      initFlag: true
    }
  },
  components: {},
  beforeDestroy () {
    this.cleanTimer()
  },
  deactivated () {
    this.cleanTimer()
  },
  mounted () {
    this.cWidth = uni.upx2px(700)
    this.cHeight = uni.upx2px(500)
  },
  methods: {
    touchPassenger (e) {
      let that = this
      this.canvaColumn.showToolTip(e, {
        format: function (item, category) {
          that.itemData = that.passengerData[category - 1]
          return category + '' + item.name + ':  ' + item.data + '人'
        }
      })
    },
    // 获取当前月天数
    getMonthDayNum () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      return new Date(year, month, 0).getDate()
    },
    showColumn (canvasId, chartData) {
      console.log('chartData', chartData)
      let that = this
      this.canvaColumn = new uCharts({
        $this: that,
        canvasId: canvasId,
        type: 'column',
        legend: { show: true },
        fontSize: 11,
        background: '#FFFFFF',
        pixelRatio: that.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
          labelCount: 15
        },
        yAxis: {
          min: 0
          //disabled:true
        },
        padding: [15, 0, 0, 0],
        dataLabel: false,
        width: that.cWidth * that.pixelRatio,
        height: that.cHeight * that.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (that.cWidth * that.pixelRatio * 0.45) / chartData.categories.length
          }
        }
      })
    },
    handleTab (e) {
      this.current = e
      this.itemData = {}
      if (this.current === 0) {
        this.getDayData()
      } else {
        this.getMonthData()
      }
    },
    getDayData () {
      getPassengerDay({ airportCode: this.airportCode }).then(res => {
        if (res.status) {
          this.passengerData = res.data
          let categories = []
          for (let i = 1; i <= this.getMonthDayNum(); i++) {
            categories.push(i)
          }
          let dayData = res.data.map(data => data.TOTAL || 0)
          let series = [{ name: '日旅客吞吐量', data: dayData }]
          let chartData = {
            categories: categories,
            series: series
          }
          this.showColumn('canvasPassenger', chartData)
        }
      })
    },
    getMonthData () {
      getPassengerMonth({ airportCode: this.airportCode }).then(res => {
        if (res.status) {
          this.passengerData = res.data
          let categories = []
          for (let i = 1; i <= 12; i++) {
            categories.push(i)
          }
          let monthData = res.data.map(data => data.TOTAL || 0 )
          let series = [{ name: '月旅客吞吐量', data: monthData }]
          let chartData = {
            categories: categories,
            series: series
          }
          this.showColumn('canvasPassenger', chartData)
        }
      })
    },
    getData (val) {
      this.cleanTimer()
      this.initTerminal()
      if (this.current === 0) {
        this.getDayData()
      } else {
        this.getMonthData()
      }
      let direction = 'ALL'
      if (val >= 0 && val !== 'setInterval') {
        direction = !val ? 'ALL' : val === 1 ? 'A' : 'D'
        this.displayType = !val ? 'all' : val === 1 ? 'arr' : 'dep'
      }
      let para = {
        airportCode: this.airportCode,
        direction: direction
      }
      if (val !== 'setInterval') {
        this.getPassengerGuarantee(para)
      }
      getPassengerInfoTotal(para).then(res => {
        if (res.status) {
          if (!this.timer) {
            this.timer = setInterval(() => {
              this.getData('setInterval')
            }, 60 * 1000)
          }
          if (this.airportCode === 'ZSAM') {
            this.displayData.T3 = res.data.T3
            this.displayData.T4 = res.data.T4
            Object.keys(this.displayData.T3).forEach(key => {
              console.log('key', key)
              if (key !== 'already' && key !== 'predict') {
                this.displayData.All[key] = this.displayData.T3[key] + this.displayData.T4[key]
              } else if (key === 'already') {
                Object.keys(this.displayData.T3.already).forEach(keyReady => {
                  console.log('keyReady', keyReady)
                  let value = this.displayData.T3['already'][keyReady] + this.displayData.T4['already'][keyReady]
                  this.$set(this.displayData.All['already'], keyReady, value)
                })
              } else if (key === 'predict') {
                Object.keys(this.displayData.T3.predict).forEach(keyPredict => {
                  console.log('keyPredict', keyPredict)
                  let value2 = this.displayData.T3['predict'][keyPredict] + this.displayData.T4['predict'][keyPredict]
                  this.$set(this.displayData.All['predict'], keyPredict, value2)
                })
              }
            })
            console.log(1111111, this.displayData.All)
          } else {
            this.displayData.T1 = res.data.T1
          }
          this.showData = deepCopy(this.displayData[this.tabFlag])
          console.log('showData', res.data.T1)
        }
      })
    },
    getCharts () {
      console.log('sourceData', this.sourceData)
      this.chartData = Object.assign({}, this.chartData, {
        categories: this.xAxisData,
        series: [
          {
            name: this.tabFlag === 'All' ? 'T3+T4' : this.tabFlag,
            data: this.sourceData[this.tabFlag],
            color: '#2fc25b'
          }
        ]
      })
      this.showArea('canvasArea2', this.chartData)
    },
    getPassengerGuarantee (para) {
      getPassengerGuarantee(para)
        .then(res => {
          if (res.status) {
            let T3 = res.data.T3
            let T4 = res.data.T4
            let T1 = res.data.T1
            let xAxisData = []
            let T3Data = []
            let T4Data = []
            let T1Data = []
            let AllData = []
            let nowTime = parseInt(dayjs(new Date()).format('HH'))
            if (this.airportCode === 'ZSAM') {
              // 处理T3折线图
              T3.forEach(e => {
                let time = e.startHTime >= 24 ? e.startHTime - 24 : e.startHTime
                xAxisData.push(String(time))
                if (time <= nowTime) {
                  T3Data.push(e.data)
                }
              })
              // 处理T4折线图
              T4.forEach(e => {
                let time = e.startHTime >= 24 ? e.startHTime - 24 : e.startHTime
                if (time <= nowTime) {
                  T4Data.push(e.data)
                }
              })
              T3Data.forEach((e, index) => {
                AllData.push(e + T4Data[index])
              })
              this.sourceData.T3 = T3Data
              this.sourceData.T4 = T4Data
              this.sourceData.All = AllData
              console.log(1112233, this.sourceData)
            } else {
              // 处理福州T1折线图
              T1.forEach(e => {
                let time = e.startHTime >= 24 ? e.startHTime - 24 : e.startHTime
                xAxisData.push(String(time))
                if (time <= nowTime) {
                  T1Data.push(e.data)
                }
              })
              this.sourceData.T1 = T1Data
            }
            this.xAxisData = xAxisData
            this.getCharts()
            console.log('xAxisData', this.xAxisData)
            console.log('chartData', this.chartData)
          }
        })
        .catch(e => {
          clearInterval(this.timer)
          this.timer = null
        })
    },
    showArea (canvasId, chartData) {
      console.log(canvasId, chartData)
      let _self = this
      this.canvaArea = new uCharts({
        $this: _self,
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
          splitNumber: 5
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          area: {
            type: 'straight',
            opacity: 0.2,
            addLine: true,
            width: 2
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
          return category + '时' + ' ' + item.name + ':' + item.data + '人'
        }
      })
    },
    touchEndLineArea (e) {
      this.canvaArea.touchLegend(e)
      this.canvaArea.showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data + '人'
        }
      })
    },
    /**
     * 初始化航站楼
     */
    initTerminal () {
      if (this.initFlag) {
        this.initFlag = false
        this.tabFlag = this.airportCode === 'ZSAM' ? 'All' : 'T1'
      }
    },
    changeTab (val) {
      this.tabFlag = val
      this.showData = deepCopy(this.displayData[val])
      this.getCharts()
    },
    /**
     * 清空定时器
     */
    cleanTimer () {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="scss">
.arrAndDepPassengerClass {
  .detail {
    background: #ffffff;
    margin-top: -30rpx;
    padding: 0 0 20rpx 0;
    .detail-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333333;
      text-align: center;
      line-height: 80rpx;
    }
    .detail-contend {
      display: flex;
      flex-wrap: wrap;
      .detail-item {
        width: 33.3%;
        line-height: 50rpx;
        padding-left: 20rpx;
        text {
          display: block;
        }
        .label {
          color: #999999;
          font-size: 28rpx;
        }
        .value {
          color: #333333;
          font-weight: bold;
          font-size: 30rpx;
          height: 40rpx;
        }
      }
    }
  }
  .gms-charts {
    background-color: #ffffff;
    margin: 30rpx 0;
    padding: 20rpx;
    .title {
      display: flex;
      flex-direction: row;
      background-color: #ffffff;
      border-radius: 10rpx;
      margin: 30rpx 0;
      .mainTitle1 {
        font-size: 31rpx;
        font-weight: bold;
        color: #333333;
        margin-left: 10rpx;
        line-height: 32rpx;
      }
      .titleIcon {
        background: #1890ff;
        width: 8rpx;
        height: 32rpx;
        display: inline-block;
        border-radius: 10rpx;
      }
    }
  }
  .qiun-charts2 {
    width: 700upx;
    height: 500upx;
    background-color: #ffffff;
  }

  .charts2 {
    width: 700upx;
    height: 500upx;
    background-color: #ffffff;
  }
  .tabs {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 100%;

    .tab {
      width: 33%;
      height: 80rpx;
      background: #f5f5f5;
      color: #333333;
      font-weight: bold;
      text-align: center;
      line-height: 80rpx;
    }
    .tabActive {
      background: #fff;
    }
  }

  .info {
    position: relative;
    // height: 700rpx;
    background: #ffffff;

    .title {
      display: flex;
      align-items: center;
      padding: 20rpx;
    }

    .circular {
      position: absolute;
      background: #f5f5f5;
      height: 44rpx;
      width: 44rpx;
      border-radius: 50%;
      top: 320rpx;
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 22rpx 20rpx;

      .name-num {
        width: 33%;
        .num {
          height: 40rpx;
        }
        .name {
          color: #999999;
          font-size: 28rpx;
        }

        .num {
          color: #333333;
          font-weight: bold;
          font-size: 30rpx;
        }
      }

      .left-text {
        text-align: left;
      }

      .center-text {
        text-align: center;
      }

      .right-text {
        text-align: right;
      }
    }
  }

  .other {
    background-image: linear-gradient(90deg, #73a2fc 0%, #83cbfd 100%);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 14rpx 14rpx;

    .item {
      display: flex;
      flex-direction: row;
      width: 44%;
      padding: 30rpx 20rpx;

      .name-num {
        padding-left: 6rpx;

        .name {
          color: #ffffff;
          opacity: 0.65;
          font-size: 28rpx;
        }

        .num {
          color: #ffffff;
          font-weight: bold;
          font-size: 32rpx;
        }
      }
    }

    .otherImg {
      width: 66rpx;
      height: 66rpx;
    }
  }
}
</style>
