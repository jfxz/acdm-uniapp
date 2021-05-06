<template>
  <view class="pass-layout">
    <view class="total">
      <view class="total-img"><image src="@/static/charts/notPassTarget.png"></image></view>
      <view class="total-text">今年累计加权正常率{{ formatFixed2Value(totalRate) }}%</view>
      <view class="total-range">
        {{dataRange}}
      </view>
    </view>
    <!-- <view class="pass-sub">
      <u-subsection :list="list" @change="change" inactive-color="#000" active-color="#fff" bg-color="#fff" button-color="#1890ff" :current="current"></u-subsection>
    </view> -->
    <view class="fail" v-if="topLoadFail"><fail @reloadData="getData()"></fail></view>
    <view class="narmal-charts" v-if="!topLoadFail"><chartComponent ref="chartComponent"></chartComponent></view>
    
  </view>
</template>

<script>
import chartComponent from './chart-component'
import { getDayAndMonthRate } from '@/api/home/normal/index.js'
import dayjs from '@/common/util/dayjs.min.js'
import fail from '@/components/fail/index.vue'
export default {
  components: { chartComponent, fail },
  props: {
    dataRange: {
      default: ''
    },
    totalRate: {
      type: Number,
      default: ''
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
      list: [
        {
          name: '日加权正常率'
        },
        {
          name: '月加权正常率'
        }
      ],
      topLoadFail: false,
      current: 0,
      chartData: {
        xAxisData: [],
        data: [],
        title: '日加权正常率'
      },
      chartDataMonth: {
        xAxisData: [],
        data: [],
        title: '月放行正常率'
      },
      timer2: null,
      timer: null,
      showChart: false,
      message: '加载中'
    }
  },
  computed: {},
  deactivated () {
    this.cleanTimer()
  },
  beforeDestroy () {
    this.cleanTimer()
  },
  mounted () {},
  methods: {
    formatFixed2Value (val) {
      if (val) {
        return (val * 100).toFixed(2)
      }
      return ''
    },
    change (index) {
      this.current = index
      this.getData()
    },
    getData () {
      this.cleanTimer()
      this.getDayData()
      this.getmonthData()
    },
    getmonthData () {
      let para = {
        airportCode: this.airportCode,
        name: 'complex_rate',
        frequency: 2
      }
      getDayAndMonthRate(para)
        .then(res => {
          if (res.status) {
            this.topLoadFail = false
            let xAxisData = []
            let val = []
            let orginData = res.data
            let markLineVal = this.indexParams.markLineVal[`${this.airportCode}monthMultiple`]
            orginData.forEach((item, index) => {
              xAxisData.push(index + 1)
              let value = (item.normalRate * 100).toFixed(2)
              if (value <= markLineVal) {
                val.push({ color: '#facc14', value: value })
              } else {
                val.push({ color: '#1890ff', value: value })
              }
            })
            this.chartDataMonth = Object.assign({}, this.chartDataMonth, {
              categories: xAxisData,
              series: [{ name: '月加权正常率', data: val }],
              flag: this.indexParams.markLineFlag.monthMultiple || false,
              markLineVal: this.indexParams.markLineVal[`${this.airportCode}monthMultiple`] || 70
            })
            console.log('chartDatmonth', this.chartDataMonth)
            this.$refs.chartComponent.getServerMonthData(this.chartDataMonth)
          }
        })
        .catch(e => {
          console.log(e)
          this.topLoadFail = true
          clearInterval(this.timer2)
          this.timer2 = null
          this.showChart = false
          this.message = '加载失败，请点击重新加载'
        })
    },
    getDayData () {
      let para = {
        airportCode: this.airportCode,
        name: 'complex_rate',
        frequency: 1
      }
      getDayAndMonthRate(para)
        .then(res => {
          if (res.status) {
            this.topLoadFail = false
            let xAxisData = []
            var orginData = res.data
            let markLineVal = this.indexParams.markLineVal[`${this.airportCode}dayMultiple`]
            let val = []
            orginData.forEach((item, index) => {
              xAxisData.push(index + 1)
              let value = (item.normalRate * 100).toFixed(2)
              if (value <= markLineVal) {
                val.push({ color: '#facc14', value: value })
              } else {
                val.push({ color: '#1890ff', value: value })
              }
            })
            this.chartData = Object.assign({}, this.chartData, {
              categories: xAxisData,
              flag: this.indexParams.markLineFlag.dayMultiple || false,
              series: [{ name: '日加权正常率', data: val }],
              markLineVal: this.indexParams.markLineVal[`${this.airportCode}dayMultiple`] || 70
            })
            console.log('chartDataday', this.chartData)
            this.$refs.chartComponent.getServerData(this.chartData)
          }
        })
        .catch(e => {
          this.topLoadFail = true
          console.log(e)
          clearInterval(this.timer)
          this.timer = null
        })
    },
    // 获取当前月天数
    getMonthDayNum () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      return new Date(year, month, 0).getDate()
    },
    /**
     * 清空定时器
     */
    cleanTimer () {
      clearInterval(this.timer)
      this.timer = null
      clearInterval(this.timer2)
      this.timer2 = null
    }
  }
}
</script>
<style lang="scss">
.pass-layout {
  .total {
    height: 168rpx;
    background-image: linear-gradient(90deg, #73a2fc 0%, #83cbfd 100%);
    border-radius: 7rpx;
    padding: 10rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    .total-range {
      position: absolute;
      top: 120rpx;
      right: 20rpx;
      color: #82848A;
    }
    .total-text {
      color: #ffffff;
      font-size: 32rpx;
    }
    .total-img {
      image {
        width: 80rpx;
        height: 80rpx;
      }
    }
  }
  background: #ffffff;
  .narmal-charts {
    margin-top: 50rpx;
  }
}
</style>
