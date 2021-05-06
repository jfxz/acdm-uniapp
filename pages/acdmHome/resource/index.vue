/* * 界面名称: 资源概览 * 界面功能: * 其他 * 时间 2020-10-29 09:39:56 * 作者 zql */
<template>
  <view class="resource-contend">
    <view class="fail" v-if="bridgeLoadFail"><fail @reloadData="getData()"></fail></view>
    <!-- 靠桥率 -->
    <view class="bridgeRate" v-else>
      <view class="qiun-columns">
        <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">靠桥率</view></view>
        <view class="qiun-charts"><canvas canvas-id="canvasColumnBridge" id="canvasColumnBridge" class="charts" @touchstart="touchColumn"></canvas></view>
      </view>
    </view>
    <!-- 机位容量 -->
    <view class="fail" v-if="standLoadFail"><fail @reloadData="getData()"></fail></view>
    <view class="standForecast" v-else>
      <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">机位容量预测</view></view>
      <view class="top-table">
        <view class="item" v-for="(item, index) in xAxis">{{ item }}</view>
      </view>
      <u-table border-color="#fff">
        <u-tr class="u-tr">
          <u-th style="background-color: #FFFFFF;"></u-th>
          <u-th class="u-th" v-for="(item, index) in typeA" :key="index">{{ item }}</u-th>
        </u-tr>
        <u-tr class="u-tr">
          <u-td class="u-td tdLabel" style="background: #006bcf;color: #FFFFFF;">B</u-td>
          <u-td class="u-td" v-for="(item, index) in bArr" :key="index">{{ item }}</u-td>
        </u-tr>
        <u-tr class="u-tr">
          <u-td class="u-td tdLabel" style="background: #0ebf9c;color: #FFFFFF;">C</u-td>
          <u-td class="u-td" v-for="(item, index) in cArr" :key="index">{{ item }}</u-td>
        </u-tr>
        <u-tr class="u-tr">
          <u-td class="u-td tdLabel" style="background: #e39832;color: #FFFFFF;">D</u-td>
          <u-td class="u-td" v-for="(item, index) in dArr" :key="index">{{ item }}</u-td>
        </u-tr>
        <u-tr class="u-tr">
          <u-td class="u-td tdLabel" style="background: #e85656;color: #FFFFFF;">E</u-td>
          <u-td class="u-td" v-for="(item, index) in eArr" :key="index">{{ item }}</u-td>
        </u-tr>
      </u-table>
    </view>
    <!-- 机位占用 -->
    <view class="fail" v-if="standOccupyLoadFail"><fail @reloadData="getData()"></fail></view>
    <view class="standOccupy">
      <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">机位占用</view></view>
      <view class="standOccupy-contend">
        <view class="left">
          <view class="item-stand">
            <view class="occupy">
              <view class="label">占用</view>
              <view class="occupy-num">{{ standOccupyData['B类']['占用'] + '/' + standOccupyData['B类']['停场'] + '/' + standOccupyData['B类']['关闭'] }}</view>
            </view>
            <view class="type" style="background-color: #006bcf;height: 50rpx;width: 50rpx;border-radius: 25rpx;"><text>B</text></view>
            <view class="free">
              <view class="free-num">{{ standOccupyData['B类']['空闲'] }}</view>
              <view class="label">空闲</view>
            </view>
          </view>

          <view class="item-stand">
            <view class="occupy">
              <view class="label">占用</view>
              <view class="occupy-num">{{ standOccupyData['C类']['占用'] + '/' + standOccupyData['C类']['停场'] + '/' + standOccupyData['C类']['关闭'] }}</view>
            </view>
            <view class="type" style="background-color: #0ebf9c;height: 50rpx;width: 50rpx;border-radius: 25rpx;"><text>C</text></view>
            <view class="free">
              <view class="free-num">{{ standOccupyData['C类']['空闲'] }}</view>
              <view class="label">空闲</view>
            </view>
          </view>

          <view class="item-stand">
            <view class="occupy">
              <view class="label">占用</view>
              <view class="occupy-num">{{ standOccupyData['D类']['占用'] + '/' + standOccupyData['D类']['停场'] + '/' + standOccupyData['D类']['关闭'] }}</view>
            </view>
            <view class="type" style="background-color: #e39832;height: 50rpx;width: 50rpx;border-radius: 25rpx;"><text>D</text></view>
            <view class="free">
              <view class="free-num">{{ standOccupyData['D类']['空闲'] }}</view>
              <view class="label">空闲</view>
            </view>
          </view>
        </view>
        <view class="right">
          <view class="item-stand">
            <view class="occupy">
              <view class="label">占用</view>
              <view class="occupy-num">{{ standOccupyData['E类']['占用'] + '/' + standOccupyData['E类']['停场'] + '/' + standOccupyData['E类']['关闭'] }}</view>
            </view>
            <view class="type" style="background-color: #e85656;height: 50rpx;width: 50rpx;border-radius: 25rpx;"><text>E</text></view>
            <!-- <view class="type" style="width: 30%;background-color: #e85656;">E</view> -->
            <view class="free" style="padding-left: 25rpx;">
              <view class="free-num">{{ standOccupyData['E类']['空闲'] }}</view>
              <view class="label">空闲</view>
            </view>
          </view>

          <view class="item-stand">
            <view class="occupy">
              <view class="label">占用</view>
              <view class="occupy-num">{{ standOccupyData['桥位']['占用'] + '/' + standOccupyData['桥位']['停场'] + '/' + standOccupyData['桥位']['关闭'] }}</view>
            </view>
            <view class="type" style="background-color: #006bcf;height: 50rpx;width: 30%;border-radius: 25rpx;"><text>桥位</text></view>
            <view class="free">
              <view class="free-num">{{ standOccupyData['桥位']['空闲'] }}</view>
              <view class="label">空闲</view>
            </view>
          </view>

          <view class="item-stand">
            <view class="occupy">
              <view class="label">占用</view>
              <view class="occupy-num">{{ standOccupyData['远机位']['占用'] + '/' + standOccupyData['远机位']['停场'] + '/' + standOccupyData['远机位']['关闭'] }}</view>
            </view>
            <view class="type" style="background-color: #006bcf;height: 50rpx;width: 30%;border-radius: 25rpx;"><text>远机位</text></view>
            <view class="free">
              <view class="free-num">{{ standOccupyData['远机位']['空闲'] }}</view>
              <view class="label">空闲</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import uCharts from '@/components/u-charts/u-charts.js'
import fail from '@/components/fail/index.vue'
import { getBridgeRate, getforecastData, getStandData } from '@/api/home/resource/index.js'
import _ from 'lodash'
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
      standOccupyData: {
        B类: {
          占用: 0,
          空闲: 0,
          停场: 0,
          关闭: 0
        },
        C类: {
          占用: 0,
          空闲: 0,
          停场: 0,
          关闭: 0
        },
        D类: {
          占用: 0,
          空闲: 0,
          停场: 0,
          关闭: 0
        },
        E类: {
          占用: 0,
          空闲: 0,
          停场: 0,
          关闭: 0
        },
        桥位: {
          占用: 0,
          空闲: 0,
          停场: 0,
          关闭: 0
        },
        远机位: {
          占用: 0,
          空闲: 0,
          停场: 0,
          关闭: 0
        }
      },
      chartData: {
        flag: true,
        seriesData: [],
        xAxisData: [],
        legendData: ['计划靠桥率', '实际靠桥率']
      },
      bridgeType: {
        A: '机场',
        B: '厦航',
        D: '国内',
        I: '国际',
        机场厦航: '合计'
      },
      xAxis: [],
      bArr: [],
      eArr: [],
      dArr: [],
      cArr: [],
      typeA: [],
      title: [],
      canvaColumn: null,
      standOccupyLoadFail: false,
      bridgeLoadFail: false,
      standLoadFail: false,
      timer: null,
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      serverData: ''
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
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
  },
  methods: {
    getData () {
      this.cleanTimer()
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.getData()
        }, (this.indexParams.timer.forecast || 60) * 1000)
      }
      let para = { airportCode: this.airportCode }
      // 靠桥率
      getBridgeRate(para)
        .then(res => {
          if (res.status) {
            this.bridgeLoadFail = false
            let obj2 = {
              name: '计划靠桥率',
              data: []
            }
            if (this.indexParams.markLineFlag['BridgeRate']) {
              obj2.markLine = {
                symbol: 'none',
                data: [
                  {
                    yAxis: this.indexParams.markLineVal['BridgeRate'],
                    lineStyle: {
                      color: '#e85656',
                      type: 'solid'
                    }
                  }
                ]
              }
            }
            let obj1 = {
              name: '实际靠桥率',
              data: []
            }
            let xAxisData = []
            res.data.forEach(ele => {
              obj2.data.push(Number(ele.planIsBridgeRage * 100).toFixed(1))
              obj1.data.push(Number(ele.movIsBridgeRage * 100).toFixed(1))
              xAxisData.push(this.bridgeType[ele.generalagent])
            })
            this.chartData = Object.assign({}, this.chartData, {
              series: [obj2, obj1],
              categories: xAxisData
            })
            this.showColumn('canvasColumnBridge', this.chartData)
          }
        })
        .catch(e => {
          this.bridgeLoadFail = true
        })
      // 机位
      getforecastData(para)
        .then(res => {
          if (res.status) {
            let val = res.data
            this.standLoadFail = false
            this.xAxis = ['1H', '2H', '3H', '备降机位']
            this.typeA = ['占用', '空闲', '占用', '空闲', '占用', '空闲']
            this.title = ['占用', '空闲', '占用', '空闲', '占用', '空闲', '正常', '临时']
            let cArr = []
            let bArr = []
            let dArr = []
            let eArr = []
            let keys = [
              'EstOcpStandsSumInOneHour',
              'EstAviStandsSumInOneHour',
              'EstOcpStandsSumInTwoHour',
              'EstAviStandsSumInTwoHour',
              'EstOcpStandsSumInThreeHour',
              'EstAviStandsSumInThreeHour',
              'estOcpCPLStandsSumNormal',
              'estOcpCPLStandsSumTemp'
            ]
            keys.forEach(key => {
              bArr.push(val[key].B)
              cArr.push(val[key].C)
              dArr.push(val[key].D)
              eArr.push(val[key].E)
            })
            let normalSum = Object.values(val.estOcpCPLStandsSumNormal).reduce((total, num) => total + num, 0)
            let tempSum = Object.values(val.estOcpCPLStandsSumTemp).reduce((total, num) => total + num, 0)
            this.bArr = bArr
            this.eArr = eArr
            this.dArr = dArr
            this.cArr = cArr
            this.typeA.push(normalSum, tempSum)
            console.log(this.typeA, this.bArr, this.cArr)
          }
        })
        .catch(e => {
          this.standLoadFail = true
        })
      getStandData(para)
        .then(res => {
          if (res.status) {
            this.standOccupyLoadFail = false
            let xAxisData = []
            let dataObj = _.groupBy(res.data, 'standcategory')
            for (let k in dataObj) {
              xAxisData.push(k)
            }
            let dObj = _.groupBy(res.data, 'standcategory')
            let obje = {}
            for (let k in dObj) {
              let o = _.groupBy(dObj[k], 'occupieType')
              let i = {
                空闲: o['空闲'] && o['空闲'].length ? o['空闲'][0].status : 0,
                占用: o['航班'] && o['航班'].length ? o['航班'][0].status : 0,
                停场: o['停场'] && o['停场'].length ? o['停场'][0].status : 0,
                关闭: o['关闭'] && o['关闭'].length ? o['关闭'][0].status : 0
              }
              obje[k] = i
            }
            if (obje['B类'] === undefined) {
              obje['B类'] = {
                占用: 0,
                空闲: 0,
                停场: 0,
                关闭: 0
              }
            }
            this.standOccupyData = Object.assign({}, obje)
            console.log('standOccupyData', this.standOccupyData)
          }
        })
        .catch(() => {
          this.standOccupyLoadFail = true
        })
    },
    // 靠桥率
    showColumn (canvasId, chartData) {
      let _self = this
      this.canvaColumn = new uCharts({
        padding: [17,15,4,15],
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
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          data: [
            {
              position: 'left',
              axisLine: false,
              format: val => {
                return val.toFixed(0) + '%'
              }
            }
          ]
        },
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: 'group',
            width: (_self.cWidth * _self.pixelRatio * 0.45) / chartData.categories.length
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
      this.canvaColumn.touchLegend(e, { animation: true })
    },
    cleanTimer () {
      this.timer && clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss">
.standOccupy {
  background: #ffffff;
  margin-top: 10rpx;
  padding: 10rpx 0;
  .standOccupy-contend {
    display: flex;
    justify-content: space-between;
  }
  .item-stand {
    line-height: 70rpx;
  }
  .label {
    color: #383838;
  }
  .left {
    width: 45%;
  }
  .right {
    width: 55%;
  }
  .occupy,
  .free {
    display: flex;
    text-align: left;
  }
  .type {
    text-align: center;
    align-items: center;
    position: relative;
    top: 8rpx;
    text {
      position: relative;
      top: -10rpx;
    }
  }
  .free {
    width: 40%;
  }
  .occupy {
    width: 50%;
  }
  .free-num {
    width: 35%;
    text-align: center;
    color: #0ebf9c;
  }
  .occupy-num {
    color: #e39832;
    width: 60%;
    text-align: center;
  }
  .item-stand {
    display: flex;
    justify-content: space-around;
  }
}
.standForecast {
  background: #ffffff;
}
.top-table {
  display: flex;
  justify-content: space-around;
  margin-left: 100rpx;
  width: calc(100% - 100rpx);
  .item {
    width: 20%;
    text-align: center;
    font-size: 30rpx;
    line-height: 80rpx;
  }
}
.u-tr {
  .u-th:nth-child(2n) {
    background: rgb(0, 107, 207);
    border-radius: 20rpx;
    color: rgba(255, 255, 255, 0.65);
    height: 50rpx;
    line-height: 50rpx;
  }
  .u-th:nth-child(2n + 1) {
    background: #535353;
    border-radius: 40rpx;
    height: 50rpx;
    line-height: 50rpx;
    color: rgba(255, 255, 255, 0.65);
  }
}
.tdLabel {
  height: 50rpx;
  width: 50rpx;
  border-radius: 25rpx;
  text-align: center;
  color: #ffffff;
}
.resource-contend {
  .qiun-columns {
    display: flex;
    flex-direction: column !important;
  }
  .qiun-common-mt {
    margin-top: 10upx;
  }
  .qiun-bg-white {
    background: #ffffff;
  }
  .qiun-title-bar {
    padding: 10upx 2%;
    flex-wrap: nowrap;
  }
  .qiun-title-dot-light {
    border-left: 10upx solid #0ea391;
    padding-left: 10upx;
    font-size: 32upx;
    color: #000000;
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
}
</style>
