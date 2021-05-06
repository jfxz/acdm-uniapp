/* * 界面名称: 正常性概览 * 界面功能: * 其他 * 时间 2020-10-29 09:44:34 * 作者 zql */
<template>
  <view class="">
    <view class="pass-overview_mobile_white" v-if="bottomIndex === 0">
      <view class="fail" v-if="topLoadFail"><fail @reloadData="getData()"></fail></view>
      <view v-else>
        <view class="topTitle">
          <view class="titleIcon"></view>
          <view class="mainTitle1">放行正常率达标估算</view>
        </view>
        <view class="headCard">
          <view class="card-title">今日目标</view>
          <view class="day-mounth">
            <view class="data-text">
              <view class="text">
                今日放行正常率目标{{ targetData.dayReleaseNormalTarget ? formatFixed2Value(targetData.dayReleaseNormalTarget.targetRate) : '' }}%, 需放行正常{{
                  targetData.dayReleaseNormalTarget ? targetData.dayReleaseNormalTarget.targetNum : ''
                }}架次 <br>最多延误{{ targetData.dayReleaseNormalTarget ? targetData.dayReleaseNormalTarget.maxDelay : '' }}架次
                <image src="@/static/charts/flight.png" mode="aspectFit"></image>
              </view>
            </view>
            <view class="data-image">
              <view class="head-img">
                <image :src="targetData.dayReleaseNormalTarget && targetData.dayReleaseNormalTarget.flag === 0 ? staticsImg.notTarget : staticsImg.target"></image>
              </view>

              <view class="data-image-text">
                <image class="star1" src="@/static/charts/star.png" mode="aspectFit"></image>
                <image class="star2" src="@/static/charts/star.png" mode="aspectFit"></image>
                <rich-text class="rich-text" :nodes="transf()"></rich-text>
              </view>
            </view>
          </view>
        </view>

        <view class="headCard">
          <view class="card-title">本月目标</view>
          <view class="day-mounth">
            <view class="data-text">
              <view class="text">本月放行正常率目标80.00%
            <image src="@/static/charts/flight.png" mode="aspectFit"></image>
            </view></view>
            <view class="data-image">
              <view class="head-img">
                <image :src="targetData.monthReleaseNormalTarget && targetData.monthReleaseNormalTarget.flag === 0 ? staticsImg.notTarget : staticsImg.target"></image>
              </view>

              <view class="data-image-text">
                <image class="star1" src="@/static/charts/star.png" mode="aspectFit"></image>
                <image class="star2" src="@/static/charts/star.png" mode="aspectFit"></image>
                <rich-text :nodes="transfMonth()"></rich-text>
              </view>
            </view>
          </view>
        </view>
        <!--    放行正常率-->
        <view>
          <view>
            <view>
              <statics :dataS="passOverview.dayOriginAllData" :srcImg="staticsImg.monthImg" :showArrow="true"></statics>
              <!--          <i :class="passOverview.dayOriginAllData.direction ? 'el-up-arrow' : 'el-down-arrow'"-->
              <!--             style="position: absolute; right: 5%; bottom: 30%; cursor: pointer;"-->
              <!--             :title="'预测放行正常率: ' + passOverview.dayOriginAllData.forecast +'%'"></i>-->
            </view>
          </view>
        </view>
        <view>
          <view>
            <view><statics :dataS="passOverview.monthOriginAllData" :srcImg="staticsImg.monthImg"></statics></view>
          </view>
        </view>
        <!--    加权正常率-->
        <view>
          <view>
            <view><statics :dataS="passOverview.dayMultipleData" :srcImg="staticsImg.dayImg" :needDetail="false"></statics></view>
          </view>
        </view>
        <view>
          <view>
            <view><statics :dataS="passOverview.monthMultipleData" :srcImg="staticsImg.monthImg" :needDetail="false"></statics></view>
          </view>
        </view>
        <!--    始发正常率-->
        <view type="flex" justify="space-between">
          <view>
            <view><statics :dataS="passOverview.dayOriginData" :srcImg="staticsImg.dayImg"></statics></view>
          </view>
        </view>
        <view>
          <view>
            <view><statics :dataS="passOverview.monthOriginData" :srcImg="staticsImg.dayImg"></statics></view>
          </view>
        </view>
        <!--    起飞正常率-->
        <view>
          <view>
            <view><statics :dataS="passOverview.flyData" :srcImg="staticsImg.monthImg"></statics></view>
          </view>
        </view>
        <view>
          <view>
            <view><statics :dataS="passOverview.montheData" :srcImg="staticsImg.monthImg"></statics></view>
          </view>
        </view>
        <!--    cobt达成率及目标放行率-->
        <view>
          <view>
            <view><statics :dataS="passOverview.cobtRateData" :srcImg="staticsImg.monthImg"></statics></view>
          </view>
        </view>
        <view>
          <view>
            <view class="rankItem">
              <view class="img-describe">
                <image :src="staticsImg.dayImg" class="img"></image>
                <view class="describe">
                  <view class="big-describe">放行正常率日排名</view>
                  <view class="small-describe">旅客吞吐量2000万(含)以上机场</view>
                </view>
              </view>
              <view class="value-date" v-if="runningRanking.ACPR1RANKING">
                <view class="value" @tap="twentyMillionRankTip">{{ `${runningRanking.twentyMillionRank}/${runningRanking.twentyMillionRankTotal}` }}</view>
                <view class="date">{{ rankingNowDate }}</view>
              </view>
            </view>
          </view>
        </view>
        <view>
          <view>
            <view class="rankItem">
              <view class="img-describe">
                <image :src="staticsImg.dayImg" class="img"></image>
                <view class="describe">
                  <view class="big-describe">放行正常率日排名</view>
                  <view class="small-describe">旅客吞吐量占全国1%(含)以上机场</view>
                </view>
              </view>
              <view class="value-date" v-if="runningRanking.ACPR1RANKING">
                <view class="value">{{ runningRanking.ACPR1RANKING }}</view>
                <view class="date">{{ rankingDate }}</view>
              </view>
            </view>
          </view>
        </view>
        <view>
          <view>
            <view class="rankItem">
              <view class="img-describe">
                <image :src="staticsImg.dayImg" class="img"></image>
                <view class="describe">
                  <view class="big-describe">放行正常率日排名</view>
                  <view class="small-describe">旅客吞吐量占全国0.2%(含)以上机场</view>
                </view>
              </view>
              <view class="value-date" v-if="runningRanking.ACPR02RANKING">
                <view class="value">{{ runningRanking.ACPR02RANKING }}</view>
                <view class="date">{{ rankingDate }}</view>
              </view>
            </view>
          </view>
        </view>
        <view>
          <view>
            <view class="rankItem">
              <view class="img-describe">
                <image :src="staticsImg.dayImg" class="img" />
                <view class="describe">
                  <view class="big-describe">始发航班起飞正常率日排名</view>
                  <view class="small-describe">航班时刻主协调机场</view>
                </view>
              </view>
              <view class="value-date" v-if="runningRanking.OETOPRTRANKING">
                <view class="value">{{ runningRanking.OETOPRTRANKING }}</view>
                <view class="date">{{ rankingDate }}</view>
              </view>
            </view>
          </view>
        </view>
        <!--    跑道号-->
        <view>
          <view>
            <view @tap="runwayTap"><statics :dataS="passOverview.runwayCode" :srcImg="staticsImg.dayImg" :needDetail="false" :needPercent="false"></statics></view>
          </view>
        </view>
      </view>

      <view class="limit">
        <view class="topTitle">
          <view class="titleIcon"></view>
          <view class="mainTitle1">当前限制信息</view>
        </view>

        <view class="limit-contend"><flowControl ref="flowControl" :airportCode="airportCode" :indexParams="indexParams"></flowControl></view>
      </view>
    </view>
    <view class="" v-if="bottomIndex === 1"><pass :dataRange="dataRange" ref="pass" :totalRate="accumulated.releaseNormalRate" :airportCode="airportCode" :indexParams="indexParams"></pass></view>
    <view class="" v-if="bottomIndex === 2"><takeOff :totalRate="accumulated.takeoffNormalRate" :dataRange="dataRange" ref="takeOff" :airportCode="airportCode" :indexParams="indexParams"></takeOff></view>
    <view class="" v-if="bottomIndex === 3">
      <origin :dataRange="dataRange" ref="origin" :totalRate="accumulated.originTakeoffNormalRate" :airportCode="airportCode" :indexParams="indexParams"></origin>
    </view>
    <view class="" v-if="bottomIndex === 4">
      <multiple :dataRange="dataRange" ref="multiple" :totalRate="accumulated.weightedNormalRate" :airportCode="airportCode" :indexParams="indexParams"></multiple>
    </view>
    <u-modal v-model="runwayDetailShow" :show-title="false" :show-confirm-button="false" :show-cancel-button="false" :mask-close-able="true">
      <view class="slot-content">
        <u-table>
          <u-tr>
            <u-th>跑道号</u-th>
            <u-th>变更时间</u-th>
          </u-tr>
          <u-tr v-for="item in transfList" :key="item.id">
            <u-td>{{ item.eventtext }}</u-td>
            <u-td>{{ formatTime(item.eventtime) }}</u-td>
          </u-tr>
        </u-table>
      </view>
    </u-modal>
  </view>
</template>

<script>
import moment from 'moment'
import {
  getAccumulatedRate,
  getRunwayEven,
  getTarget,
  getPassRate,
  getCobtReachRate,
  getEstimateRateOfDay,
  getEstimateRateOfMonth,
  getArrowData,
  getRunwayData,
  getRunningRanking
} from '@/api/home/normal/index.js'
import statics from './statics'
import DayImg from '@/static/charts/day_mobile.png'
import FlyImg from '@/static/charts/fly_mobile.png'
import MonthImg from '@/static/charts/month_mobile.png'
import target from '@/static/charts/passTarget.png'
import notTarget from '@/static/charts/notPassTarget.png'
import dayjs from '@/common/util/dayjs.min.js'
import flowControl from './flowControl'
import fail from '@/components/fail/index.vue'
import pass from './pass.vue'
import takeOff from './takeOff.vue'
import origin from './origin.vue'
import multiple from './multiple.vue'
export default {
  components: { statics, flowControl, fail, pass, takeOff, origin, multiple },
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
      dataRange: '',
      accumulated: {},
      transfList: [],
      targetData: {},
      runwayDetailShow: false,
      bottomTabArr: ['flowControl', 'pass', 'takeOff', 'origin', 'multiple'],
      bottomIndex: 1,
      topLoadFail: false,
      showChart: false,
      timer: null,
      message: '加载中',
      passOverview: {
        flyData: {
          name: '日起飞正常率'
        },
        dayOriginData: {
          name: '日始发起飞正常率'
        },
        dayOriginAllData: {
          name: '日放行正常率'
        },
        monthOriginData: {
          name: '月始发起飞正常率'
        },
        monthOriginAllData: {
          name: '月放行正常率'
        },
        montheData: {
          name: '月起飞正常率'
        },
        dayMultipleData: {
          name: '日加权正常率'
        },
        monthMultipleData: {
          name: '月加权正常率'
        },
        cobtRateData: {
          name: 'COBT达成率'
        },
        dayPassTarget: {
          passTarget: 0,
          mode: 0 // 0 已完成 1 可达成 2 不可达成
        },
        monthPassTarget: {
          mode: 0, // 0 已完成 1 可达成 2 不可达成
          monthEstimateNum: 0,
          monthEstimateRate: 0,
          monthDlyMax: 0
        },
        runwayCode: {
          name: '跑道号',
          eventtime: ''
        }
      },
      staticsImg: {
        dayImg: DayImg,
        flyImg: FlyImg,
        monthImg: MonthImg,
        target: target,
        notTarget: notTarget
      },
      runningRanking: {
        ACPR02RANKING: null,
        ACPR1RANKING: null,
        OETOPRTRANKING: null
      }, // 排名
      dialogVisible: false,
      rankingNowDate: moment().format('MM-DD'),
      rankingDate: dayjs(new Date().getTime() - 48 * 60 * 60 * 1000).format('MM-DD')
    }
  },
  computed: {},
  beforeDestroy () {
    console.log('beforeDestroy')
    this.cleanTimer()
  },
  deactivated () {
    console.log('deactivated')
    this.cleanTimer()
  },
  mounted () {
    this.getDateRange()
  },
  methods: {
    twentyMillionRankTip () {
      this.$message('排名/2000万机场总数')
    },
    getDateRange () {
      let now = dayjs().format('YYYY-MM-DD')
      let nowOrigin = dayjs().format('YYYY-01-01')
      this.dataRange = nowOrigin + '至' + now
    },
    transfMonth () {
      if (!this.targetData.monthReleaseNormalTarget) {
        return ''
      }
      let targetNum = this.formatFixed2Value(this.targetData.monthReleaseNormalTarget.estMaxRate)
      let Atarget = this.formatFixed2Value(this.targetData.monthReleaseNormalTarget.targetRate)
      let estNormal = this.targetData.monthReleaseNormalTarget.estNormal
      let maxDelay = this.targetData.monthReleaseNormalTarget.maxDelay
      let minDayRate = this.formatFixed2Value(this.targetData.monthReleaseNormalTarget.minDayRate)

      if (this.targetData.monthReleaseNormalTarget.flag === 0) {
        return `已经达标<br>
        最高可达${targetNum}%`
      } else if (this.targetData.monthReleaseNormalTarget.flag === 1) {
        return `尚未达标，每日放行正常率${minDayRate}%<br>
       后续每日放行正常${estNormal}架次，日延误不超${maxDelay}架次`
      } else {
        return `无法达标<br>
        最高可达${targetNum}%`
      }
    },
    transf () {
      if (!this.targetData.dayReleaseNormalTarget) {
        return ''
      }
      let targetNum = this.formatFixed2Value(this.targetData.dayReleaseNormalTarget.estMaxRate)
      let Atarget = this.formatFixed2Value(this.targetData.dayReleaseNormalTarget.targetRate)
      let estNormal = this.targetData.dayReleaseNormalTarget.estNormal
      if (this.targetData.dayReleaseNormalTarget.flag === 0) {
        return `已经达标<br>
        最高可达${targetNum}%`
      } else if (this.targetData.dayReleaseNormalTarget.flag === 1) {
        return `尚未达标，还需正常放行${estNormal}架次<br>
        最高可达${targetNum}%`
      } else {
        return `无法达标<br>
        最高可达${targetNum}%`
      }
    },
    formatTime (time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm')
      }
      return ''
    },
    formatFixed2Value (val) {
      if (val) {
        return (val * 100).toFixed(2)
      }
      return ''
    },
    runwayTap () {
      this.runwayDetailShow = true
    },
    getData (bottomIndex) {
      if (bottomIndex > 0 && bottomIndex !== 'setInterval') {
        this.bottomIndex = bottomIndex
        let matchName = this.bottomTabArr[this.bottomIndex]
        this.$nextTick(() => {
          console.log('matchName111111', matchName)
          this.$refs[matchName].getData()
        })
      }
      if (bottomIndex === 0) {
        this.bottomIndex = bottomIndex
        this.cleanTimer()
        let para = { airportCode: this.airportCode }
        let passOverViewArr = [
          new Promise((resolve, reject) => {
            getPassRate(para)
              .then(res => {
                if (res.status) {
                  resolve(res)
                }
              })
              .catch(e => {
                console.log('getPassRate')
                reject(e)
              })
          }),
          new Promise((resolve, reject) => {
            getCobtReachRate(para)
              .then(res => {
                if (res.status) {
                  resolve(res)
                }
              })
              .catch(e => {
                console.log('getCobtReachRate')
                reject(e)
              })
          }),
          new Promise((resolve, reject) => {
            getTarget(para)
              .then(res => {
                if (res.status) {
                  console.log(res)
                  resolve(res)
                }
              })
              .catch(e => {
                console.log('getTarget')
                reject(e)
              })
          }),
          new Promise((resolve, reject) => {
            getArrowData(para)
              .then(res => {
                if (res.status) {
                  resolve(res)
                }
              })
              .catch(e => {
                console.log('getArrowData')
                reject(e)
              })
          }),
          new Promise((resolve, reject) => {
            getRunwayData(para)
              .then(res => {
                if (res.status) {
                  this.passOverview.runwayCode = Object.assign({}, this.passOverview.runwayCode, {
                    value: res.data ? res.data.eventtext : '',
                    eventtime: moment(res.data.eventtime).format('YYYY-MM-DD HH:mm'),
                    color: '#333333'
                  })
                  resolve(res)
                }
              })
              .catch(e => {
                console.log('getRunwayData')
                this.topLoadFail = true
                reject(e)
              })
          }),
          // 排名
          new Promise((resolve, reject) => {
            getRunningRanking(para)
              .then(res => {
                if (res.status) {
                  this.runningRanking = Object.assign({}, this.runningRanking, res.data)
                  console.log(22222, this.runningRanking)
                  resolve()
                }
              })
              .catch(e => {
                console.log('getRunningRanking')
                reject(e)
              })
          }),
          // 跑道变更记录
          new Promise((resolve, reject) => {
            getRunwayEven(para)
              .then(res => {
                if (res.status) {
                  resolve(res)
                }
              })
              .catch(e => {
                reject(e)
              })
          }),
          // 当年累计正常率
          new Promise((resolve, reject) => {
            getAccumulatedRate(para)
              .then(res => {
                if (res.status) {
                  resolve(res)
                }
              })
              .catch(e => {
                reject(e)
              })
          })
        ]
        Promise.all(passOverViewArr)
          .then(resArr => {
            this.$nextTick(() => {
              if (this.$refs.flowControl) {
                this.$refs.flowControl.getData()
              }
            })
            console.log('resArr1111111111', resArr[6])
            this.transfList = resArr[6].data
            this.accumulated = resArr[7].data
            this.topLoadFail = false
            this.targetData = resArr[2].data
            // console.log('resArr111111', resArr)
            let flightRate = resArr[0].data
            let cobtRate = resArr[1]
            let arrowData = resArr[4]
            let level = 80
            // 日始发起飞正常率
            let value = (Number(flightRate['day_original_takeoff_rate']) * 100).toFixed(2)
            console.log('value11', flightRate['day_original_takeoff_rate'])
            this.passOverview.dayOriginData = Object.assign({}, this.passOverview.dayOriginData, {
              value: value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate['day_original_takeoff_abnormal'],
              bottom: flightRate['day_original_takeoff_total']
            })
            // 日放行率
            value = (flightRate['day_release_rate'] * 100).toFixed(2)
            let dayPassTrendRate = (flightRate['dayPassTrendRate'] * 100).toFixed(2)
            this.passOverview.dayOriginAllData = Object.assign({}, this.passOverview.dayOriginAllData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate['day_release_abnormal'],
              bottom: flightRate['day_release_total'],
              direction: dayPassTrendRate > value ? 'el-up-arrow' : dayPassTrendRate === value ? 'el-up-equal' : 'el-down-arrow',
              forecast: dayPassTrendRate,
              normalFlight: flightRate.normalFlight || 0,
              delayFlight: flightRate.delayFlight || 0
            })
            // 日起飞正常率
            value = (flightRate['day_takeoff_rate'] * 100).toFixed(2)
            this.passOverview.flyData = Object.assign({}, this.passOverview.flyData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate['day_takeoff_abnormal'],
              bottom: flightRate['day_takeoff_total']
            })
            // 日加权正常率
            value = (flightRate['day_complex_rate_rate'] * 100).toFixed(2)
            this.passOverview.dayMultipleData = Object.assign({}, this.passOverview.dayMultipleData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: 0,
              bottom: 0
            })
            // COBT达成率
            value = (flightRate.cobtReachRate * 100).toFixed(2)
            this.passOverview.cobtRateData = Object.assign({}, this.passOverview.cobtRateData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate.cobtReachNum,
              bottom: flightRate.depFlightCount
            })
            // 月始发起飞正常率
            value = (flightRate['month_original_takeoff_rate'] * 100).toFixed(2)
            this.passOverview.monthOriginData = Object.assign({}, this.passOverview.monthOriginData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate['month_original_takeoff_abnormal'],
              bottom: flightRate['month_original_takeoff_total']
            })
            // 月放行率
            value = (flightRate['month_release_rate'] * 100).toFixed(2)
            this.passOverview.monthOriginAllData = Object.assign({}, this.passOverview.monthOriginAllData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate['month_release_abnormal'],
              bottom: flightRate['month_release_total']
            })
            // 月起飞正常率
            value = (flightRate['month_takeoff_rate'] * 100).toFixed(2)
            this.passOverview.montheData = Object.assign({}, this.passOverview.montheData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: flightRate['month_takeoff_abnormal'],
              bottom: flightRate['month_takeoff_total']
            })
            // 月加权正常率
            value = (flightRate['month_complex_rate_rate'] * 100).toFixed(2)
            this.passOverview.monthMultipleData = Object.assign({}, this.passOverview.monthMultipleData, {
              value,
              color: value < level ? '#f5222d' : '#52c41a',
              top: 0,
              bottom: 0
            })
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.getData('setInterval')
              }, (this.indexParams.timer.PassRate || 60) * 1000)
            }
          })
          .catch(eArr => {
            this.topLoadFail = true
            console.log('eArr', eArr)
            clearInterval(this.timer)
            this.timer = null
          })
      }
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
.pass-overview_mobile_white {
  .limit {
    background: #ffffff;
    padding: 10rpx 0;
  }
  .topTitle {
    display: flex;
    flex-direction: row;
    border-radius: 10rpx;
    margin: 30rpx;
    .mainTitle1 {
      font-size: 30rpx;
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
  .head-img {
    image {
      width: 60rpx;
      height: 60rpx;
      margin-top: 10rpx;
    }
  }

  .headCard {
    height: 250rpx;
    margin-bottom: 20rpx;
    background-image: linear-gradient(90deg, #73a2fc 0%, #83cbfd 100%);
    border-radius: 12rpx;
    padding: 5rpx 10rpx;
    .card-title {
      font-size: 32rpx;
      font-weight: bold;
    }
    .data-image {
      display: flex;
      // align-items: center;
      // height: 120rpx;
    }
    .day-mounth {
      .data-text {
        padding-left: 10rpx;
        color: #ffffff;
        margin: 10rpx 0;
        line-height: 40rpx;
        image {
          width: 300rpx;
          height: 40rpx;
          position: absolute;
        }
      }
      .data-image-text {
        margin-left: 10rpx;
        color: #ffffff;
        position: relative;
        rich-text {
          position: relative;
          left: 50rpx;
        }
        .star1 {
          top: 3rpx;
        }
        .star2 {
          top: 40rpx;
        }
        image {
          position: absolute;
          width: 40rpx;
          height: 40rpx;
        }
      }
      .data {
        font-size: 36rpx;
      }

      .text {
        font-size: 28rpx;
        color: #ffffff;
        opacity: 0.7;
      }
    }
  }

  .el-up-arrow {
    background: url('../../../static/charts/upArrow.png') no-repeat;
    height: 30rpx;
    width: 20rpx;
    cursor: pointer;
  }

  .el-down-arrow {
    background: url('../../../static/charts/downArrow.png') no-repeat;
    height: 30rpx;
    width: 20rpx;
    cursor: pointer;
  }

  .gray {
    background: #212831;
  }

  .rankItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
    border-radius: 7rpx;
    justify-content: space-between;
    padding: 0 20rpx;
    height: 180rpx;
    margin-bottom: 20rpx;

    .img-describe {
      display: flex;
      flex-direction: row;

      .img {
        margin-top: 10rpx;
        margin-right: 16rpx;
        width: 88rpx;
        height: 88rpx;
      }

      .describe {
        display: flex;
        flex-direction: column;
        /*justify-content: center;*/
        color: black;

        .big-describe {
          height: 56rpx;
          line-height: 56rpx;
        }

        .small-describe {
          text-align: left;
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
    .value-date {
      color: black;
      text-align: right;
      .value {
        height: 56rpx;
        line-height: 56rpx;
        font-size: 48rpx;
        font-weight: bold;
      }
      .date {
        color: #999999;
        font-size: 28rpx;
      }
    }
  }
}
</style>
