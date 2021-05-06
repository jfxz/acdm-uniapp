/* * 界面名称: 货邮概览 * 界面功能: * 其他 * 时间 2020-10-29 09:45:13 * 作者 zql */
<template>
  <view class="cargo-home">
    <view class="fail" v-if="topLoadFail"><fail @reloadData="getData()"></fail></view>
    <view class="cardData_mobile_white" v-else>
      <view class="totalWeight">
        <view class="title">
          <image src="@/static/charts/passTarget.png" mode="aspectFit" style="height:28rpx;width:24rpx;transform: rotate(-90deg); "></image>
          <view style="color: #ffffff;font-size: 30rpx;padding-left: 10rpx">进出港货邮重量</view>
        </view>
        <view class="main">
          <view class="weight">
            <image src="@/static/charts/dayRate_mobile.png" mode="aspectFit" style="height: 66rpx;width: 66rpx;"></image>
            <view class="name-num">
              <view class="name">已执行货邮重量</view>
              <view class="num">
                {{ passengerTotal.arrDep ? passengerTotal.arrDep.executedWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
          <view class="line"></view>
          <view class="weight">
            <image src="@/static/charts/dayRate_mobile.png" mode="aspectFit" style="height: 66rpx;width: 66rpx;"></image>
            <view class="name-num">
              <view class="name">完成比例</view>
              <view class="num">{{ passengerTotal.arrDep ? passengerTotal.arrDep.weightProportion : '' }}</view>
            </view>
          </view>
        </view>
        <view class="main">
          <view class="weight">
            <image src="@/static/charts/dayRate_mobile.png" mode="aspectFit" style="height: 66rpx;width: 66rpx"></image>
            <view class="name-num">
              <view class="name">预计全天货邮重量</view>
              <view class="num">
                {{ passengerTotal.arrDep ? passengerTotal.arrDep.allDayWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
          
        </view>
        <view class="main">
          <view class="weight">
            <image src="@/static/charts/dayRate_mobile.png" mode="aspectFit" style="height: 66rpx;width: 66rpx;"></image>
            <view class="name-num">
              <view class="name">机场代理预计</view>
              <view class="num">
                {{ passengerTotal.arrDep ? passengerTotal.arrDep.agentAirportWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
          <view class="line"></view>
          <view class="weight">
            <image src="@/static/charts/dayRate_mobile.png" mode="aspectFit" style="height: 66rpx;width: 66rpx;"></image>
            <view class="name-num">
              <view class="name">厦航代理预计</view>
              <view class="num">
                {{ passengerTotal.arrDep ? passengerTotal.arrDep.agentAirlineWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="arrAndDepWeight">
        <view class="weightItem">
          <view class="title">
            <image src="@/static/charts/titleIcon1_mobile.png" mode="aspectFit" style="height:28rpx;width:28rpx;"></image>
            <view style="color: #333333;font-size: 30rpx;padding-left: 10rpx;font-weight: bold">进港货邮重量</view>
          </view>
          <view class="main">
            <view class="name-num">
              <view class="name">已执行货邮重量</view>
              <view class="num">
                {{ passengerTotal.arr ? passengerTotal.arr.executedWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
            <view class="name-num">
              <view class="name">完成比例</view>
              <view class="num">
                {{ passengerTotal.arr ? passengerTotal.arr.weightProportion : '' }}
                <text style="padding-left: 10rpx"></text>
              </view>
            </view>
          </view>
          <view class="main">
            <view class="name-num">
              <view class="name">预计全天货邮重量</view>
              <view class="num">
                {{ passengerTotal.arr ? passengerTotal.arr.allDayWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
          <view class="main">
            <view class="name-num">
              <view class="name">机场代理预计</view>
              <view class="num">
                {{ passengerTotal.arr ? passengerTotal.arr.agentAirportWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
            <view class="name-num">
              <view class="name">厦航代理预计</view>
              <view class="num">
                {{ passengerTotal.arr ? passengerTotal.arr.agentAirlineWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
        </view>
        <view class="weightItem">
          <view class="title">
            <image src="@/static/charts/titleIcon2_mobile.png" mode="aspectFit" style="height:28rpx;width:28rpx;"></image>
            <view style="color: #333333;font-size: 30rpx;padding-left: 10rpx;font-weight: bold">出港货邮重量</view>
          </view>
          <view class="main">
            <view class="name-num">
              <view class="name">已执行货邮重量</view>
              <view class="num">
                {{ passengerTotal.dep ? passengerTotal.dep.executedWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view> 
            </view>
            <view class="name-num">
              <view class="name">完成比例</view>
              <view class="num">
                {{ passengerTotal.dep ? passengerTotal.dep.weightProportion : '' }}
                <text style="padding-left: 10rpx"></text>
              </view>
            </view>
          </view>
          <view class="main">
            <view class="name-num">
              <view class="name">预计全天货邮重量</view>
              <view class="num">
                {{ passengerTotal.dep ? passengerTotal.dep.allDayWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
            
          </view>
          <view class="main">
            <view class="name-num">
              <view class="name">机场代理预计</view>
              <view class="num">
                {{ passengerTotal.dep ? passengerTotal.dep.agentAirportWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
            <view class="name-num">
              <view class="name">厦航代理预计</view>
              <view class="num">
                {{ passengerTotal.dep ? passengerTotal.dep.agentAirlineWeight : '' }}
                <text style="padding-left: 10rpx">吨</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="cargo-charts">
      <view class="title">
        <view class="titleIcon"></view>
        <view class="mainTitle1">货邮重量统计分析</view>
      </view>
      <view style="margin-bottom: 10rpx;">
        <u-subsection :list="list" @change="handleTab" inactive-color="#000" active-color="#fff" 
        bg-color="#fff" button-color="#1890ff" :current="current"></u-subsection></view>
      <view class="qiun-charts2"><canvas canvas-id="canvasCargo" id="canvasCargo" class="charts2" @touchstart="touchPassenger"></canvas></view>
    </view>
    <view class="detail">
      <view class="detail-title">统计分类</view>
      <view class="detail-contend">
        <view class="detail-item">
          <view class="label">机场代理</view>
          <view class="value">{{ itemData.AGENTAIRPORT }}</view>
        </view>
        <view class="detail-item">
          <view class="label">厦航代理</view>
          <view class="value">{{ itemData.AGENTAIRLINE }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import uCharts from '@/components/u-charts/u-charts.js'
import fail from '@/components/fail/index.vue'
import _ from 'lodash'
import { getCargo, getCargoDay, getCargoMonth } from '@/api/home/cargo/index.js'
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
      cargoData: [],
      itemData: {},
      current: 0,
      list: ['日货邮重量', '月货邮重量'],
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      topLoadFail: false,
      timer: null,
      defaultPassengerTotal: {
        arrPassengerNum: 0,
        isoPassengerNum: '',
        depPassengerNum: 0
      },
      passengerTotal: {}
    }
  },
  computed: {
    zonneStyle () {
      if (this.zoneNumber === 0) {
        return {
          'font-size': '64rpx'
        }
      } else {
        return {
          'font-size': '58rpx'
        }
      }
    },
    total () {
      return this.passengerTotal.arrPassengerNum * 1 + this.passengerTotal.depPassengerNum * 1
    },
    zoneNumber () {
      if (this.passengerTotal.isoPassengerNum) {
        // 将数据从字符串格式转换成js对象
        let y = JSON.parse(this.passengerTotal.isoPassengerNum)
        let c = []
        _.forIn(y, (v, k) => {
          let color = this.setStyle(v)
          c.push(`<text style="color: ${color};font-weight: bold;">${v}</text>`)
          c.push()
        })
        return c.length > 0 ? c.join('/') : 0
      }
    }
  },
  deactivated () {
    this.cleanTimer()
  },
  beforeDestroy () {
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
          that.itemData = that.cargoData[category - 1]
          return category + '' + item.name + ':  ' + item.data + '千克'
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
      getCargoDay({ airportCode: this.airportCode }).then(res => {
        if (res.status) {
          this.cargoData = res.data
          let categories = []
          for (let i = 1; i <= this.getMonthDayNum(); i++) {
            categories.push(i)
          }
          let dayData = res.data.map(data => data.TOTAL || 0)
          console.log('categories', categories)
          let series = [{ name: '日货邮重量', data: dayData }]
          let chartData = {
            categories: categories,
            series: series
          }
          this.showColumn('canvasCargo', chartData)
        }
      })
    },
    getMonthData () {
      getCargoMonth({ airportCode: this.airportCode }).then(res => {
        if (res.status) {
          this.cargoData = res.data
          let categories = []
          for (let i = 1; i <= 12; i++) {
            categories.push(i)
          }
          let monthData = res.data.map(data => data.TOTAL || 0)
          let series = [{ name: '月货邮重量', data: monthData }]
          let chartData = {
            categories: categories,
            series: series
          }
          this.showColumn('canvasCargo', chartData)
        }
      })
    },
    getData () {
      this.cleanTimer()
      let para = { airportCode: this.airportCode }
      if (this.current === 0) {
        this.getDayData()
      } else {
        this.getMonthData()
      }
      getCargo(para)
        .then(res => {
          if (res.status) {
            this.topLoadFail = false
            this.passengerTotal = Object.assign({}, this.defaultPassengerTotal, res.data)
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getData()
              }, (this.indexParams.timer.passenger || 60) * 1000)
            }
          }
        })
        .catch(e => {
          this.topLoadFail = true
          clearInterval(this.timer)
          this.timer = null
        })
    },
    cleanTimer () {
      this.timer && clearInterval(this.timer)
    },
    setStyle (f) {
      if (f > 2000 && f < 2500) {
        return '#e39832'
      } else if (f > 2500) {
        return 'rgb(245, 34, 45)'
      }
      return '#1091ff'
    }
  }
}
</script>

<style lang="scss">
.cargo-home {
  .detail {
    background: #ffffff;
    margin-top: -30rpx;
    padding: 0 0 20rpx 0;
    .detail-title {
      font-size: 30rpx;
      font-weight: bold;
      line-height: 80rpx;
      color: #333333;
      text-align: center;
    }
    .detail-contend {
      display: flex;
      flex-wrap: wrap;
      .detail-item {
        text-align: center;
        width: 50%;
        line-height: 50rpx;
        .label {
          font-size: 26rpx;
          color: #333333;
          opacity: 0.65;
        }
        .value {
          font-size: 28rpx;
          color: #333333;
          font-weight: bold;
          height: 40rpx;
        }
      }
    }
  }
  .cargo-charts {
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
}
.cardData_mobile_white {
  .totalWeight {
    height: auto;
    background-image: linear-gradient(90deg, #73a2fc 0%, #83cbfd 100%);
    border-radius: 14rpx;
    .main {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
    }
    .line {
      width: 4rpx;
      height: 72rpx;
      background-color: #ffffff;
    }
    .weight {
      width: 45%;
      display: flex;
      flex-direction: row;
      align-items: center;
      // padding: 0 30rpx;
      .name-num {
        padding-left: 10rpx;
        .name {
          font-size: 26rpx;
          color: #ffffff;
          opacity: 0.65;
        }
        .num {
          font-size: 28rpx;
          color: #ffffff;
          font-weight: bold;
          padding-top: 4rpx;
        }
      }
    }
  }
  .title {
    display: flex;
    align-items: center;
    padding: 20rpx;
  }
  .arrAndDepWeight {
    background: #ffffff;
    border-radius: 14rpx;
    margin-top: 20rpx;
    .main {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
    }
    .name-num {
      width: 50%;
      padding: 0 40rpx;
      .name {
        font-size: 26rpx;
        color: #333333;
        opacity: 0.65;
      }
      .num {
        font-size: 28rpx;
        color: #333333;
        font-weight: bold;
        padding-top: 4rpx;
      }
    }
  }
}
</style>
