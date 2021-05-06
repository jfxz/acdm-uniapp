<template>
  <scroll-view @scroll="scroll" class="steps-class" scroll-y="true" scroll-with-animation="true" :scroll-top="scrollTop">
    <drawer></drawer>
    <view class="routePoint-class"><u-subsection :list="routePoint" @change="tabChange" :current="tabCurrent"></u-subsection></view>
    <view class="steps-contend">
      <view class="steps-layout" v-for="i in 1440" :key="i">
        
        <view class="num-time" style="height: 0rpx;width: 80rpx" v-if="(i - 1) % 10 === 0">
          {{
            `${10 > parseInt((i - 1) / 60) ? '0' + parseInt((i - 1) / 60) : parseInt((i - 1) / 60)}:${
              ((parseInt(i - 1) / 10) % 6) * 10 === 0 ? (+(parseInt(i - 1) / 10) % 6) * 10 + '0' : ((parseInt(i - 1) / 10) % 6) * 10
            }`
          }}
        </view>
        <view :class="['num-line', judgeClass(i)]" :style="{height: '30rpx', 'border-top': i === now ? '2rpx solid #ff0000' : ''}"></view>
      </view>
    </view>
    <view class="flight">
      <view class="first" v-for="(para, index) in firstCol" :key="index" :style="{ position: 'absolute', top: para.timeNum + 'px', left: '150rpx' }">
        <image src="@/static/in.png" v-if="para.direction === 'A' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/out.png" v-if="para.direction === 'D' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'A' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'D' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;"></image>
        <text class="flight-text" :style="{ color: !(para.actualflag === 1) ? (para.direction === 'A' ? '#0ebf9c' : '#e39832') : '#576078' }">
          {{ para.carrier + para.flight }}
        </text>
      </view>

      <view class="second" v-for="(para, index) in secondCol" :key="index + firstCol.length" :style="{ position: 'absolute', top: para.timeNum + 'px', left: '300rpx' }">
        <image src="@/static/in.png" v-if="para.direction === 'A' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/out.png" v-if="para.direction === 'D' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'A' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'D' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;"></image>
        <text class="flight-text" :style="{ color: !(para.actualflag === 1) ? (para.direction === 'A' ? '#0ebf9c' : '#e39832') : '#576078' }">
          {{ para.carrier + para.flight }}
        </text>
      </view>

      <view
        class="third"
        v-for="(para, index) in thirdCol"
        :key="index + firstCol.length + secondCol.length"
        :style="{ position: 'absolute', top: para.timeNum + 'px', left: '455rpx' }"
      >
        <image src="@/static/in.png" v-if="para.direction === 'A' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/out.png" v-if="para.direction === 'D' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'A' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'D' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;"></image>
        <text class="flight-text" :style="{ color: !(para.actualflag === 1) ? (para.direction === 'A' ? '#0ebf9c' : '#e39832') : '#576078' }">
          {{ para.carrier + para.flight }}
        </text>
      </view>

      <view class="four" v-for="(para, index) in fourCol" :key="index + firstCol.length + secondCol.length + thirdCol.length">
        <view class="fountChild" v-for="(child, index4) in para.data" :key="index4" :style="{ position: 'absolute', top: child.timeNum + 'px', left: 600 + 'rpx' }">
          <view class="" v-if="index4 === 0 && para.data.length === 1">
            <image src="@/static/in.png" v-if="child.direction === 'A' && !(child.actualflag === 1)" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

            <image src="@/static/out.png" v-if="child.direction === 'D' && !(child.actualflag === 1)" style="height: 40rpx;width: 40rpx;"></image>

            <image src="@/static/implement.png" v-if="child.direction === 'A' && child.actualflag === 1" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

            <image src="@/static/implement.png" v-if="child.direction === 'D' && child.actualflag === 1" style="height: 40rpx;width: 40rpx;"></image>
            <text class="flight-text" :style="{ color: !(child.actualflag === 1) ? (child.direction === 'A' ? '#0ebf9c' : '#e39832') : '#576078' }">
              {{ child.carrier + child.flight }}
            </text>
          </view>
          <view class="" style="margin-left: 30rpx;" v-else @tap="flightClick(para.data)">......</view>
        </view>
      </view>
    </view>
    <tui-bubble-popup
      :show="show"
      :mask="false"
      position="absolute"
      direction="bottom"
      @close="topBubble"
      width="180rpx"
      left="550rpx"
      :top="current - 50 + 'px'"
      triangleRight="75rpx"
      triangleBottom="-25rpx"
    >
      <view class="tui-menu-item" v-for="(para, index) in moreFlightList" :key="index" @tap="topBubble">
        <image src="@/static/in.png" v-if="para.direction === 'A' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/out.png" v-if="para.direction === 'D' && !(para.actualflag === 1)" style="height: 40rpx;width: 40rpx;"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'A' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;transform: rotate(180deg)"></image>

        <image src="@/static/implement.png" v-if="para.direction === 'D' && para.actualflag === 1" style="height: 40rpx;width: 40rpx;"></image>
        <text
          class="flight-text"
          @tap="topBubble"
          :style="{ color: !(para.actualflag === 1) ? (para.direction === 'A' ? '#0ebf9c' : '#e39832') : '#576078', position: 'relative', bottom: '10rpx' }"
        >
          {{ para.carrier + para.flight }}
        </text>
      </view>
    </tui-bubble-popup>
  </scroll-view>
</template>

<script>
import { routePointList } from '@/common/constants/flightBaseMessage.js'
import tRtPopup from '@/components/thorui/t-rt-popup/t-rt-popup'
import tuiBubblePopup from '@/components/thorui/tui-bubble-popup/tui-bubble-popup'
import { getRunWayList } from '@/api/home/release-support/index.js'
import dayjs from '@/common/util/dayjs.min.js'
import drawer from './drawer'
export default {
  props: {},
  components: {
    tRtPopup,
    tuiBubblePopup,
    drawer
  },
  data () {
    return {
      timeOut: null,
      newTimer: null,
      scrollTop: 0,
      nowTime: '',
      now: '',
      routePoint: [],
      tabCurrent: 0,
      current: 0,
      moreFlightList: [],
      show: true,
      domData: [],
      dest: [],
      firstCol: [],
      secondCol: [],
      thirdCol: [],
      fourCol: [],
      nowDayBf: [],
      firstColBf: [],
      secondColBf: [],
      thirdColBf: [],
      fourColBf: [],
      nowDay: []
    }
  },
  created () {
    let airportCode = uni.getStorageSync('userAirport')[0].icaocode
    this.routePoint = routePointList[airportCode].map(item => {
      return {
        name: item
      }
    })
    this.routePoint.unshift({ name: '跑道' })
    console.log('routePoint', this.routePoint)
  },
  beforeDestroy () {
    clearInterval(this.newTimer)
  },
  mounted () {
    this.getNewTime()
    this.setInterTime()
    let airportCode = uni.getStorageSync('userAirport')[0].icaocode
    this.airportCode = airportCode
    const query = uni.createSelectorQuery().in(this)
    query
      .selectAll('.num-line')
      .boundingClientRect(data => {
        this.domData = data
        console.log('domData', this.domData)
        if (this.airportCode) {
          this.getData()
        }
      })
      .exec()
  },
  methods: {
    getNewTime () {
      this.nowTime = dayjs().format('HH:mm')
      this.now = this.timeToNum(this.nowTime)
      this.scrollTop = this.now * 14.7
    },
    setInterTime () {
      this.newTimer = setInterval(() => {
        console.log('我在获取最新时间')
       this.getNewTime()
       this.getData()
      }, 60000)
    },
    scroll (e) {
      clearInterval(this.newTimer)
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.setInterTime()
      }, 30000)
    },
    tabChange (index) {
      this.current = index
      this.getData()
    },
    topBubble () {
      this.show = false
    },
    flightClick (data) {
      this.show = false
      console.log('data', data)
      this.moreFlightList = data
      this.current = data[0].timeNum
      this.show = true
    },
    getData () {
      this.nowDayBf = []
      this.firstColBf = []
      this.secondColBf = []
      this.thirdColBf = []
      this.fourColBf = []
      this.nowDay = []
      this.firstCol = []
      this.secondCol = []
      this.thirdCol = []
      this.fourCol = []
      let para = {
        routepoint: this.current ? this.routePoint[this.current].name : '',
        airportCode: this.airportCode,
        opDate: dayjs(dayjs().format('YYYY-MM-DD')).valueOf()
      }
      let now = dayjs().date()
      getRunWayList(para).then(res => {
        res.data.forEach(o => {
          // 按进港、出港、已执行排序
          if (o.direction === 'A' && o.actualflag === 0) {
            this.$set(o, 'sort', 4)
          } else if (o.direction === 'D' && o.actualflag === 0) {
            this.$set(o, 'sort', 3)
          } else if (o.direction === 'A' && o.actualflag === 1) {
            this.$set(o, 'sort', 2)
          } else if (o.direction === 'D' && o.actualflag === 1) {
            this.$set(o, 'sort', 1)
          }
        })
        res.data.sort(function (a, b) {
          return -(a.sort - b.sort)
        })
        let nowDate = dayjs()
        res.data.forEach(item => {
          if (dayjs(item.time).date() === now) {
            item.time = dayjs(item.time).format('HH:mm')
            this.nowDayBf.push(item)
            this.nowDay = this.nowDayBf
          }
        })
        let arr = this.nowDay
        this.dest = this.commonObj(arr)
        this.dest.forEach(item => {
          for (let i = item.data.length - 1; i >= 0; i--) {
            // 用左侧时间轴每条横线进行定位，为了在不同分辨率下也可以定位准确，否则1080的li间距为18px， 768为18.752
            this.$set(item.data[i], 'timeNum', this.domData[this.timeToNum(item.data[i].time) - 1].top - 50)
            if (i < 3) {
              switch (
                i // 分组塞入 避免写不必要的额外判断代码
              ) {
                case 2:
                  this.thirdColBf.push(item.data[i])
                  this.thirdCol = this.thirdColBf
                  break
                case 1:
                  this.secondColBf.push(item.data[i])
                  this.secondCol = this.secondColBf
                  break
                case 0:
                  this.firstColBf.push(item.data[i])
                  this.firstCol = this.firstColBf
                  break
              }
            } else {
              item.data[i]['leftAdd'] = 0
              this.fourColBf.push(item.data[i])
              this.fourCol = this.fourColBf
            }
            if (item.data[i].direction === 'D') {
              switch (item.data[i].actualflag) {
                case 1:
                  this.$set(item.data[i], 'type', '实际离港时间')
                  break
                case 2:
                  this.$set(item.data[i], 'type', '预计离港时间')
                  break
                case 3:
                  this.$set(item.data[i], 'type', '计划离港时间')
                  break
              }
            } else {
              switch (item.data[i].actualflag) {
                case 1:
                  this.$set(item.data[i], 'type', '实际进港时间')
                  break
                case 2:
                  this.$set(item.data[i], 'type', '预计进港时间')
                  break
                case 3:
                  this.$set(item.data[i], 'type', '计划离港时间')
                  break
              }
            }
          }
        })
        this.fourCol = this.commonObj(this.fourCol)
        console.log('fourCol', this.fourCol)
      })
    },
    // 传入时间 返回数字
    timeToNum (val) {
      let hour = Number(val.substring(0, 2))
      let minute = Number(val.substring(3, 5))
      return hour * 60 + minute + 1
    },
    // 一个进去是数组对象 出来是某个相同对象的相同值分组的数组的方法
    commonObj (arr) {
      let dest = []
      let map = {}
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i]
        if (!map[ai.time]) {
          dest.push({ flight: ai.flight, direction: ai.direction, time: ai.time, actualflag: ai.actualflag, data: [ai] })
          map[ai.time] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.time === ai.time) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
      return dest
    },
    judgeClass (i) {
      if ((i - 1) % 10 === 0) {
        return 'tenMin'
      } else if ((i - 1) % 10 === 5) {
        return 'fiveMin'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
.steps-class {
  height: 100vh;
  width: 100vw;
  // padding-top: 80rpx;
  // z-index: 10;
  .routePoint-class {
    // position: fixed;
    // top: 80rpx;
    width: 100%;
  }
  .flight {
    .flight-text {
      font-size: 20rpx;
      position: relative;
      bottom: 10rpx;
    }
  }
  .steps-contend {
    position: relative;
    height: 100%;
    // overflow: auto;
    // top: 80rpx;
    .steps-layout {
      padding-left: 10rpx;
    }
    .num-line {
      width: 20rpx;
      border: 2rpx solid #ccc;
      border-bottom: none;
      border-right: none;
      position: relative;
      // top: -90rpx;
      top: 15rpx;
      left: 80rpx;
      &.tenMin {
        width: 40rpx;
        border-width: 5rpx 2rpx 2rpx 2rpx;
      }
      &.fiveMin {
        width: 30rpx;
      }
    }
  }
}
</style>
