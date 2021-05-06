<template>
  <view class="chart-component">
    <view class="qiun-charts">
      <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
      <canvas canvas-id="canvasMonthColumn" id="canvasMonthColumn" class="charts" @touchstart="touchMonthColumn"></canvas>
    </view>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js'
export default {
  data () {
    return {
      title: '',
      canvaColumn: null,
      canvaMonthColumn: null,
      cWidth: '',
      cHeight: '',
      pixelRatio: 1
    }
  },
  deactivated () {},
  mounted () {
    this.cWidth = uni.upx2px(720)
    this.cHeight = uni.upx2px(600)
  },
  methods: {
    getServerMonthData (data) {
      let chartData = data
      this.showMonthColumn('canvasMonthColumn', chartData)
    },
    getServerData (data) {
      let chartData = data
      this.showColumn('canvasColumn', chartData)
    },
    showColumn (canvasId, chartData) {
      let _self = this
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
        enableMarkLine: chartData.flag,
        xAxis: {
          disableGrid: true,
          labelCount: 15
        },
        yAxis: {
          max: 100,
          min: 0,
          data: [
            {
              min: 0,
              max: 100,
              position: 'left',
              axisLine: false,
              format: val => {
                return val + '%'
              }
            }
          ]
        },
        dataLabel: false,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (_self.cWidth * _self.pixelRatio * 0.45) / chartData.categories.length
          },
          markLine: {
            type: 'dash',
            dashLength: 5,
            data: [
              {
                labelBgOpacity: '0',
                value: chartData.markLineVal,
                lineColor: '#f04864',
                showLabel: true
              }
            ]
          }
        }
      })
    },
    showMonthColumn (canvasId, chartData) {
      let _self = this
      this.canvaMonthColumn = new uCharts({
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
        enableMarkLine: chartData.flag,
        xAxis: {
          disableGrid: true,
          labelCount: 15
        },
        yAxis: {
          max: 100,
          min: 0,
          data: [
            {
              min: 0,
              max: 100,
              position: 'left',
              axisLine: false,
              format: val => {
                return val + '%'
              }
            }
          ]
        },
        dataLabel: false,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (_self.cWidth * _self.pixelRatio * 0.45) / chartData.categories.length
          },
          markLine: {
            type: 'dash',
            dashLength: 5,
            data: [
              {
                labelBgOpacity: '0',
                value: chartData.markLineVal,
                lineColor: '#f04864',
                showLabel: true
              }
            ]
          }
        }
      })
    },
    touchMonthColumn (e) {
      this.canvaMonthColumn.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === 'object') {
            return category + ' ' + item.name + ':' + item.data.value + '%'
          } else {
            return category + ' ' + item.name + ':' + item.data + '%'
          }
        }
      })
    },
    touchColumn (e) {
      this.canvaColumn.showToolTip(e, {
        format: function (item, category) {
          if (typeof item.data === 'object') {
            return category + ' ' + item.name + ':' + item.data.value + '%'
          } else {
            return category + ' ' + item.name + ':' + item.data + '%'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.chart-component {
  .title-lable {
    font-size: 50rpx;
    text-align: center;
  }
  .qiun-charts {
    width: 720upx;
    height: 600upx;
    background-color: #ffffff;
  }
  .charts {
    width: 720upx;
    height: 600upx;
    background-color: #ffffff;
  }
}
</style>
