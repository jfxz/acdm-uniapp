/* * 界面名称: 航班概览 * 界面功能: * 其他 * 时间 2020-10-29 09:44:57 * 作者 zql */
<template>
  <view class="overview-layout">
    <view class="fail" v-if="topLoadFail"><fail @reloadData="getData()"></fail></view>
    <view class="flight-msg" v-else>
      <view class="label">
        <view class="label-prefix">
          {{ getTabLabel() || '进出港' }}
        </view>
        <view class="label-text">
          航班状态统计
        </view>
      </view>
      
      <view class="status">
        <view class="status-item">
          {{ `正常 ${arrTopList.normal || ''}` }}
        </view>
        <view class="status-item">
          {{ `异常 ${arrTopList.irregular || ''}` }}
        </view>
        <view class="status-item" @tap="toastTip('正加包/非正加包')">
          {{ `取消 ${cancel}` }}
        </view>
      </view>
      
      <view class="executed">
        {{`已执行${(executedRate).toFixed(0) || ''}%`}}
      </view>
      
      <view class="message">
        <view class="message-item">
          {{`计划航班 ${arrTopList.flightNum || ''}`}}
          <text>|</text>
        </view>
        <view class="message-item">
          {{`已执行 ${arrTopList.executed || ''}`}}
          <text>|</text>
        </view>
        <view class="message-item">
          {{`未执行 ${unexecuted}`}}
        </view>
      </view>
    </view>
    <!-- 航班状态 -->
    <view class="flight-status" v-if="bottomCurrent === 0">
      <view class="flight-status-item">
        <view class="label">
          <view class="label-prefix">
            进港
          </view>
          <view class="label-text">
            航班状态统计
          </view>
        </view>
        <view class="value-item arr-class">
          <view class="item">
            <text class="item-label">途中</text>
            <text class="item-value">{{arrTopList.meta ? arrTopList.meta.ENR : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">到达</text>
            <text class="item-value">{{arrTopList.meta ? arrTopList.meta.ARR : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">滑行</text>
            <text class="item-value">{{arrTopList.meta ? arrTopList.meta.TXI : ''}}</text>
          </view>
        </view>
      </view>
      <view class="divideLine">
        <view class="line"></view>
        <view class="square"></view>
        <view class="line"></view>
      </view>
      <view class="flight-status-item">
        <view class="label">
          <view class="label-prefix">
            出港
          </view>
          <view class="label-text">
            航班状态统计
          </view>
        </view>
        <view class="value-item dep-class">
          <view class="item">
            <text class="item-label">登机</text>
            <text>{{arrTopList.meta ? arrTopList.meta.BDO : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">催促登机</text>
            <text>{{arrTopList.meta ? arrTopList.meta.BDF : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">登机结束</text>
            <text>{{arrTopList.meta ? arrTopList.meta.BDC : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">关舱等待</text>
            <text>{{arrTopList.meta ? arrTopList.meta.CCW : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">开车</text>
            <text>{{arrTopList.meta ? arrTopList.meta.STA : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">滑行</text>
            <text>{{arrTopList.meta ? arrTopList.meta.TTX : ''}}</text>
          </view>
          <view class="item">
            <text class="item-label">起飞</text>
            <text>{{arrTopList.meta ? arrTopList.meta.DEP : ''}}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="release" v-if="bottomCurrent === 2">
      <view class="normal">
        <text class="label">实际放行正常</text>
        <text class="value">{{ arrTopList.normalExecutedRelease }}</text>
      </view>
      <view class="delay">
        <text class="label">实际放行延误</text>
        <text class="value">{{ arrTopList.delayExecutedRelease }}</text>
      </view>
    </view>
    <view class="arr">
      <view class="arr-contend" v-for="(item, index) in arrData" :index="index">
        <view class="title">
          <view class="label">{{ bottomCurrent === 1 ? item.label : bottomCurrent === 2 ? item.depLabel : item.allLabel }}</view>
          <view class="value" v-if="item.field === 'flightTaskCount'">
            {{ arrTopList && arrTopList[`${item.field}`] ? arrTopList[`${item.field}Executed`] + '/' + arrTopList['cnlFlightTaskCount'] + '/' + arrTopList[`${item.field}`] : '' }}
          </view>
          <view class="value" v-else>
            {{ arrTopList && arrTopList[`${item.field}`] ? arrTopList[`${item.field}Executed`] + '/' + arrTopList[`${item.field}Cnl`] + '/' + arrTopList[`${item.field}`] : '' }}
          </view>
        </view>
        <cmd-progress
          @click.native="progressEven(item)"
          :percent="computeExecutedPercent(item)"
          stroke-color="#1c8ff9"
          :show-info="false"
          :success-percent="computeCancelPercent(item)"
          :stroke-width="12"
          status="active"
        ></cmd-progress>
      </view>
    </view>

    <!-- <view class="deTab-class" v-if="bottomCurrent === 2">
      <view class="depTab">
        <u-subsection :list="list" :current="depTab" @change="depChange"></u-subsection>
      </view>
      <view class="depTab2" v-if="depTab === 1">
        <u-subsection :list="list2" inactive-color="#000"active-color="#fff" bg-color="#fff" button-color="#1890ff" :current="depTab2" @change="depChange2"></u-subsection>
      </view>
    </view> -->

    <!-- 进出港 -->
    <view class="flight-task-title" v-if="bottomCurrent === 0">航班任务概况</view>
    <view class="flight-task" v-if="bottomCurrent === 0">
      <view class="detail">
        <view class="label">
          <text class="fistLabel">正加包</text>
          <text style="position: relative;left: -20rpx;" @tap="toastTip('已执行/未执行/计划')">
            {{
              arrTopList.flightTaskCount
                ? arrTopList.flightTaskCountExecuted + '/' + (arrTopList.flightTaskCount - arrTopList.flightTaskCountExecuted) + '/' + arrTopList.flightTaskCount
                : ''
            }}
          </text>
        </view>
        <view class="label">
          <text class="fistLabel">货 班</text>
          <text>{{ arrTopList.hzFlightTaskCount }}</text>
        </view>
        <view class="label">
          <text class="fistLabel">补 班</text>
          <text>{{ arrTopList.zpFlightTaskCount }}</text>
        </view>
        <view class="label">
          <text class="fistLabel">公 务</text>
          <text>{{ arrTopList.uhFlightTaskCount }}</text>
        </view>
        <view class="label">
          <text class="fistLabel">急 救</text>
          <text>{{ arrTopList.ofFlightTaskCount }}</text>
        </view>
        <view class="label">
          <text class="fistLabel">备 降</text>
          <text>{{ arrTopList.anFlightTaskCount }}</text>
        </view>
        <view class="label">
          <text class="fistLabel">调 机</text>
          <text>{{ arrTopList.nmFlightTaskCount }}</text>
        </view>
        <view class="label">
          <text class="fistLabel">其 他</text>
          <text>{{ arrTopList.otherFlightTaskCount }}</text>
        </view>
      </view>
    </view>

    <view class="qiun-columns">
      <view class="qiun-bg-white qiun-title-bar qiun-common-mt"><view class="qiun-title-dot-light">航班按时段分布</view></view>
      <view class="qiun-charts">
        <view class="fail" v-if="bottomLoadFail"><fail @reloadData="getData()"></fail></view>
        <view class="" v-else>
          <view class="detail-area">
            <view class="detail-area-label">
              <text class="flag estimate"></text>
              <text class="label">{{time ? time + '时' : ''}}{{bottomCurrent === 2 ? 'CTOT' : '预计'}}架次</text>
              <text class="value">{{ estimateItem }}</text>
            </view>
            <view class="detail-area-label">
              <text class="flag actual"></text>
              <text class="label">{{time ? time + '时' : ''}}实际架次</text>
              <text class="value">{{ actualItem }}</text>
            </view>
            <view class="detail-area-label">
              <text class="flag plan"></text>
              <text class="label">{{time ? time + '时' : ''}}计划架次</text>
              <text class="value">{{ planItem }}</text>
            </view>
          </view>
          <view class="oneHour" v-if="bottomCurrent === 1">
            <view class="hourEst">
              <text class="label">未来1H/2H落地架次</text>
              <text class="value">{{ `${hourItem.oneHourEst || ''}/${hourItem.twoHourEst || ''}` }}</text>
            </view>
          </view>
          <canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea" @touchmove="moveLineArea" @touchend="touchEndLineArea"></canvas>
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import {
  getArrAndDepFlight,
  getArrFlight,
  getDepFlight,
  getDepAndArrFlightList,
  getArrFlightList,
  getDepFlightList,
  getTimeDistribution
} from '@/api/home/flight-overview/index.js'
import uCharts from '@/components/u-charts/u-charts.js'
import cmdProgress from '@/components/cmd-progress/cmd-progress.vue'
import fail from '@/components/fail/index.vue'
import dayjs from '@/common/util/dayjs.min.js'
var canvaArcbar1
export default {
  components: { cmdProgress, fail },
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
      executedRate: 0,
      time: '',
      hourItem: {},
      lastMoveTime: '',
      estimateItem: '',
      actualItem: '',
      planItem: '',
      bottomLoadFail: false,
      topLoadFail: false,
      list: [
        {
          name: '出港航班按时段分布'
        },
        {
          name: '各时段放行情况分析'
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
      depTab: 0,
      depTab2: 0,
      passFlight: {},
      arrData: [
        { label: '机场进港', value: '', field: 'agent', depLabel: '机场出港', allLabel: '机场代理' },
        { label: '厦航进港', value: '', field: 'xiamenAirlines', depLabel: '厦航出港', allLabel: '厦航代理' },
        { label: '厦航', value: '', field: 'mf', depLabel: '厦航', allLabel: '厦航' },
        { label: '国内进港', value: '', field: 'domestic', depLabel: '国内出港', allLabel: '国内航班' },
        { label: '国际进港', value: '', field: 'international', depLabel: '国际出港', allLabel: '国际航班' },
        { label: '正加包', value: '', field: 'flightTaskCount', depLabel: '正加包', allLabel: '正加包' },
        { label: '机场国际进港', value: '', field: 'internationalAgent', depLabel: '机场国际出港', allLabel: '机场代理国际(正加包)' },
        { label: '厦航国际进港', value: '', field: 'internationalXiamenAirlines', depLabel: '厦航国际出港', allLabel: '厦航代理国际(正加包)' }
      ],
      chartData: {
        // categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        // series: [{
        // 	name: '成交量A',
        // 	data: [100, 80, 95, 150, 112, 132],
        // 	color: '#facc14'
        // }, {
        // 	name: '成交量B',
        // 	data: [70, 40, 65, 100, 44, 68],
        // 	color: '#2fc25b'
        // }, {
        // 	name: '成交量C',
        // 	data: [35, 20, 25, 37, 4, 20],
        // 	color: '#1890ff'
        // }]
      },
      bottomCurrent: 0,
      cnlTotal: 0,
      arrTopList: {},
      timer: null,
      timer2: null,
      timerArrAndDep: null,
      timerArrAndDep2: null,
      timerArr1: null,
      timerArr2: null,
      timerDep1: null,
      timerDep2: null,
      timerDep3: null,
      planPercent: 70,
      executedPercent: 20,
      flag: 'dep',
      canvaArea: null,
      cWidth: '',
      cHeight: '',
      cWidth3: '', //圆弧进度图
      cHeight3: '', //圆弧进度图
      arcbarWidth: '', //圆弧进度图，进度条宽度,此设置可使各端宽度一致
      pixelRatio: 1
    }
  },
  onPageScroll () {
    console.log(1111)
    uni.hideToast()
  },
  computed: {
    // 取消
    cancel () {
      if (this.arrTopList.cnlFlightTaskCount !== undefined) {
        return this.arrTopList.cnlFlightTaskCount + '/' + this.arrTopList.cnlNoFlightTaskCount
      }
      return '0/0'
    },
    // 未执行
    unexecuted () {
      if (this.arrTopList.flightNum ) {
        return this.arrTopList.flightNum - this.arrTopList.executed - this.cnlTotal
      }
      return ''
    }
  },
  beforeDestroy () {
    this.cleanTimer()
  },
  mounted () {
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)
    this.cWidth3 = uni.upx2px(137) //这里要与样式的宽高对应
    this.cHeight3 = uni.upx2px(137) //这里要与样式的宽高对应
    this.arcbarWidth = uni.upx2px(15)
  },
  onLoad () {},
  methods: {
    toastTip (msg) {
      this.$refs.uToast.show({
        title: msg,
        type: 'primary',
        icon: false
      })
    },
    getTabLabel () {
      if (this.bottomCurrent === 1) {
        return '进港'
      } else if (this.bottomCurrent === 2) {
        return '出港'
      } else {
        return ''
      }
    },
    depChange (index) {
      console.log('index', index)
      this.depTab = index
      if (this.depTab === 1) {
        this.getDepTimeList()
      } else {
        this.getData()
      }
    },
    depChange2 (index) {
      this.depTab2 = index
      this.getDepTimeList()
    },
    getDepTimeList () {
      this.chartData = []
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
            this.chartData = Object.assign({}, this.chartData, {
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
            console.log('chartData22222', this.chartData)
            this.showArea('canvasArea', this.chartData)
            // if (!this.timerDep1) {
            //   this.timerDep1 = setInterval(() => {
            //     this.getDepTimeList()
            //   }, (this.indexParams.timer.DepList || 60) * 1000)
            // }
          }
        })
        .catch(() => {
          clearInterval(this.timerDep1)
          this.$message('加载失败，请点击重新加载')
          this.timerDep1 = null
        })
    },
    getDepList () {
      if (!this.indexParams.showList) {
        this.bottomLoadFail = true
      }
      let obj = {
        airportCode: this.airportCode,
        interval: 1,
        start: this.indexParams.showList.DepList,
        end: this.indexParams.showList.DepList + 23 > 24 ? (this.indexParams.showList.DepList + 23) % 24 : this.indexParams.showList.DepList + 23
      }
      getDepFlightList(obj)
        .then(res => {
          let xAxisData = []
          let data = []
          let lineData = []
          let estLineData = []
          if (res.status) {
            this.bottomLoadFail = false
            res.data.sch.forEach(ele => {
              ele.startHTime >= 24 ? xAxisData.push(ele.startHTime - 24) : xAxisData.push(ele.startHTime)
              data.push(ele.data)
            })
            let act = res.data.act
            for (let i = 0; i < 24; i++) {
              lineData.push(act[i].data)
            }
            let est = res.data.est
            for (let i = 0; i < 24; i++) {
              estLineData.push(est[i].data)
            }
            this.chartData = Object.assign({}, this.chartData, {
              categories: xAxisData,
              series: [
                {
                  name: 'CTOT架次',
                  data: estLineData,
                  color: '#facc14'
                },
                {
                  name: '实际架次',
                  data: lineData,
                  color: '#2fc25b'
                },
                {
                  name: '计划架次',
                  data: data,
                  color: '#1890ff'
                }
              ]
            })
            this.showArea('canvasArea', this.chartData)
            // if (!this.timerDep3) {
            //   this.timerDep3 = setInterval(() => {
            //     this.getDepList()
            //   }, (this.indexParams.timer.DepList || 60) * 1000)
            // }
          }
        })
        .catch(() => {
          clearInterval(this.timerDep3)
          this.$message('加载失败，请点击重新加载')
          this.timerDep3 = null
          this.bottomLoadFail = true
        })
    },
    getArrList () {
      let obj = {
        airportCode: this.airportCode,
        interval: 1,
        start: this.indexParams.showList.ArrList,
        end: this.indexParams.showList.ArrList + 23 > 24 ? (this.indexParams.showList.ArrList + 23) % 24 : this.indexParams.showList.ArrList + 23
      }
      getArrFlightList(obj)
        .then(res => {
          let xAxisData = []
          let data = []
          let lineData = []
          let estLineData = []
          if (res.status) {
            this.bottomLoadFail = false
            // if (!this.timerArr1) {
            //   this.timerArr1 = setInterval(() => {
            //     this.getArrList()
            //   }, (this.indexParams.timer.ArrList || 60) * 1000)
            // }
            res.data.sch.forEach(ele => {
              ele.startHTime >= 24 ? xAxisData.push(ele.startHTime - 24) : xAxisData.push(ele.startHTime)
              data.push(ele.data)
            })
            let act = res.data.act
            for (let i = 0; i < 24; i++) {
              lineData.push(act[i].data)
            }
            let est = res.data.est
            for (let i = 0; i < 24; i++) {
              estLineData.push(est[i].data)
            }
            let nowHour = dayjs().hour()
            xAxisData.forEach((item, index) => {
              if (item === nowHour) {
                let params = {
                  oneHourEst: xAxisData.length - 1 >= index + 1 ? estLineData[index + 1] : '',
                  twoHourEst: xAxisData.length - 1 >= index + 2 ? estLineData[index + 2] : '',
                  oneHourAct: xAxisData.length - 1 >= index + 1 ? lineData[index + 1] : '',
                  twoHourAct: xAxisData.length - 1 >= index + 2 ? lineData[index + 2] : '',
                  oneHourPla: xAxisData.length - 1 >= index + 1 ? data[index + 1] : '',
                  twoHourPla: xAxisData.length - 1 >= index + 2 ? data[index + 2] : ''
                }
                this.hourItem = { ...params }
              }
            })
            this.chartData = Object.assign({}, this.chartData, {
              categories: xAxisData,
              series: [
                {
                  name: '预计架次',
                  data: estLineData,
                  color: '#facc14'
                },
                {
                  name: '实际架次',
                  data: lineData,
                  color: '#2fc25b'
                },
                {
                  name: '计划架次',
                  data: data,
                  color: '#1890ff'
                }
              ]
            })
            this.showArea('canvasArea', this.chartData)
            console.log('chartData', this.chartData)
          }
        })
        .catch(e => {
          console.log(e)
          clearInterval(this.timerArr1)
          this.timerArr1 = null
          this.bottomLoadFail = true
          this.$message('加载失败，请点击重新加载')
        })
    },
    getDepAndArrList () {
      console.log(111111, this.indexParams.showList)
      let obj = {
        airportCode: this.airportCode,
        interval: 1,
        start: this.indexParams.showList.DepList,
        end: this.indexParams.showList.DepList + 23 > 24 ? (this.indexParams.showList.DepList + 23) % 24 : this.indexParams.showList.DepList + 23
      }
      getDepAndArrFlightList(obj)
        .then(res => {
          if (res.status) {
            this.bottomLoadFail = false
            let dep = res.data.dep
            let arr = res.data.arr
            let xAxisData = []
            let depData = []
            let arrData = []
            let lineData = []
            let estLineData = []
            // if (!this.timerArrAndDep) {
            //   this.timerArrAndDep = setInterval(() => {
            //     this.getDepAndArrList()
            //   }, (this.indexParams.timer.DepAndArrList || 60) * 1000)
            // }

            // 处理出港柱状图
            dep.sch.forEach(e => {
              e.startHTime >= 24 ? xAxisData.push(e.startHTime - 24) : xAxisData.push(e.startHTime)
              depData.push(e.data)
            })

            // 处理进港柱状图
            arr.sch.forEach(e => {
              arrData.push(e.data)
            })
            // 处理折线图数据
            let sumData = []
            arr.act.forEach((ele, index) => {
              sumData.push(arr.act[index].data + dep.act[index].data)
            })
            for (let i = 0; i < 24; i++) {
              lineData.push(sumData[i])
            }
            let estData = []
            arr.act.forEach((ele, index) => {
              estData.push(arr.est[index].data + dep.est[index].data)
            })
            for (let i = 0; i < 24; i++) {
              estLineData.push(estData[i])
            }
            let depAndArrData = []
            for (let i = 0; i < 24; i++) {
              depAndArrData.push(depData[i] + arrData[i])
            }
            this.chartData = Object.assign({}, this.chartData, {
              categories: xAxisData,
              series: [
                {
                  name: '预计架次',
                  data: estLineData,
                  color: '#facc14'
                },
                {
                  name: '实际架次',
                  data: lineData,
                  color: '#2fc25b'
                },
                {
                  name: '计划架次',
                  data: depAndArrData,
                  color: '#1890ff'
                }
              ]
            })
            this.showArea('canvasArea', this.chartData)
            console.log('chartData', this.chartData)
          }
        })
        .catch(e => {
          console.log(e)
          clearInterval(this.timerArrAndDep)
          this.timerArrAndDep = null
          this.bottomLoadFail = true
          this.$message('加载失败，请点击重新加载')
        })
    },
    computeExecutedPercent (item) {
      let count = (this.arrTopList[`${item.field}Executed`] / this.arrTopList[`${item.field}`]) * 100
      return count
    },
    computeCancelPercent (item) {
      let count = 0
      if (item.field === 'flightTaskCount') {
        count = (this.arrTopList['cnlFlightTaskCount'] / this.arrTopList[`${item.field}`]) * 100
      } else {
        count = (this.arrTopList[`${item.field}Cnl`] / this.arrTopList[`${item.field}`]) * 100
      }
      return count
    },
    cleanTimer () {
      this.timerArr1 && clearInterval(this.timerArr1)
      this.timerArr2 && clearInterval(this.timerArr2)
      this.timerDep1 && clearInterval(this.timerDep1)
      this.timerDep2 && clearInterval(this.timerDep2)
      this.timerDep3 && clearInterval(this.timerDep3)
      this.timerArrAndDep && clearInterval(this.timerArrAndDep)
      this.timerArrAndDep2 && clearInterval(this.timerArrAndDep2)
    },
    getData (val) {
      let para = {
        airportCode: this.airportCode
      }
      console.log('bottomCurrent', val)
      if (val >= 0 && val !== 'setInterval') {
        this.bottomCurrent = val
        this.estimateItem = ''
        this.actualItem = ''
        this.planItem = ''
      }
      console.log('bottomCurrent', this.bottomCurrent)
      this.chartData = []
      this.cleanTimer()
      if (this.bottomCurrent === 0 && this.indexParams.showList) {
        this.timerArrAndDep2
        if (val !== 'setInterval') {
          this.getDepAndArrList()
        }
        console.log('ArrAndDepSituation', this.indexParams.timer)
        getArrAndDepFlight(para)
          .then(res => {
            if (res.status) {
              this.topLoadFail = false
              this.arrTopList = res.data
              // this.arrData = res.data
              this.cnlTotal = parseInt(this.arrTopList.cnlFlightTaskCount) + parseInt(this.arrTopList.cnlNoFlightTaskCount)
              this.executedRate = ((this.arrTopList.executed / this.arrTopList.flightNum).toFixed(2)) * 100
              this.timerArrAndDep2 = setInterval(() => {
                this.getData('setInterval')
              }, (this.indexParams.timer.ArrAndDepSituation || 60) * 1000)
            }
          })
          .catch(e => {
            console.log(e)
            clearInterval(this.timerArrAndDep2)
            this.timerArrAndDep2 = null
            this.$message('加载失败，请点击重新加载')
            this.topLoadFail = true
          })
      } else if (this.bottomCurrent === 1 && this.indexParams.showList) {
        if (val !== 'setInterval') {
          this.getArrList()
        }
        getArrFlight(para)
          .then(res => {
            if (res.status) {
              this.topLoadFail = false
              this.arrTopList = res.data
              this.executedRate = ((this.arrTopList.executed / this.arrTopList.flightNum).toFixed(2))  * 100
              this.cnlTotal = parseInt(this.arrTopList.cnlFlightTaskCount) + parseInt(this.arrTopList.cnlNoFlightTaskCount)
              if (!this.timerArr2) {
                this.timerArr2 = setInterval(() => {
                  this.getData('setInterval')
                }, (this.indexParams.timer.ArrAndDepSituation || 60) * 1000)
              }
            }
          })
          .catch(e => {
            console.log(e)
            clearInterval(this.timerArr2)
            this.timerArr2 = null
            this.topLoadFail = true
            this.$message('加载失败，请点击重新加载')
          })
      } else {
        if (val !== 'setInterval') {
          this.getDepList()
        }
        getDepFlight(para)
          .then(res => {
            if (res.status) {
              this.topLoadFail = false
              this.arrTopList = res.data
              this.executedRate = ((this.arrTopList.executed / this.arrTopList.flightNum).toFixed(2)) * 100
              this.cnlTotal = parseInt(this.arrTopList.cnlFlightTaskCount) + parseInt(this.arrTopList.cnlNoFlightTaskCount)
              if (!this.timerDep2) {
                this.timerDep2 = setInterval(() => {
                  this.getData('setInterval')
                }, (this.indexParams.timer.ArrAndDepSituation || 60) * 1000)
              }
            }
          })
          .catch(e => {
            console.log(e)
            clearInterval(this.timerDep2)
            this.timerDep2 = null
            this.topLoadFail = true
            this.$message('加载失败，请点击重新加载')
          })
      }
    },
    reloadData () {
      this.getData()
    },
    progressEven (item) {
      console.log(item)
      this.$refs.uToast.show({
        title: '已执行/取消/计划',
        type: 'primary',
        duration: 500,
        icon: false
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
        enableMarkLine: this.bottomCurrent === 0 /***需要开启标记线***/,
        xAxis: {
          disableGrid: true,
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
          tooltip: {
            // showBox:false //是否显示半透明黑色的提示区域
          },
          area: {
            // gradient: true,
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
      //     let arr = []
      //     let that = this
      // this.canvaArea.showToolTip(e, {
      // 	format: function (item, category) {
      //         // console.log(item, category)
      //         if (item.name === '预计架次') {
      //           that.estimateItem = item.data
      //         } else if (item.name === '实际架次') {
      //           that.actualItem = item.data
      //         } else {
      //           that.planItem = item.data
      //         }
      // 		return category + '时' + ' ' + item.name + ':' + item.data
      // 	}
      // });
    },
    moveLineArea (e) {
      let currMoveTime = Date.now
      let duration = currMoveTime - this.lastMoveTime
      if (duration < Math.floor(1000 / 120)) return //每秒60帧
      this.lastMoveTime = currMoveTime

      let currIndex = this.canvaArea.getCurrentDataIndex(e)
      if (currIndex > -1 && currIndex < this.canvaArea.opts.categories.length) {
        let time = this.canvaArea.opts.categories[currIndex]
        this.time = time
        this.canvaArea.opts.series.forEach(item => {
          if (item.name === '预计架次' || item.name === 'CTOT架次') {
            this.estimateItem = item.data[currIndex]
          } else if (item.name === '实际架次') {
            this.actualItem = item.data[currIndex]
          } else {
            this.planItem = item.data[currIndex]
          }
        })
      }
      this.canvaArea.showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data
        }
      })
    },
    touchEndLineArea (e) {
      let currIndex = this.canvaArea.getCurrentDataIndex(e)
      if (currIndex > -1 && currIndex < this.canvaArea.opts.categories.length) {
        let time = this.canvaArea.opts.categories[currIndex]
        this.time = time
        this.canvaArea.opts.series.forEach(item => {
          if (item.name === '预计架次' || item.name === 'CTOT架次') {
            this.estimateItem = item.data[currIndex]
          } else if (item.name === '实际架次') {
            this.actualItem = item.data[currIndex]
          } else {
            this.planItem = item.data[currIndex]
          }
        })
      }
      this.canvaArea.touchLegend(e)
      this.canvaArea.showToolTip(e, {
        format: function (item, category) {
          return category + '时' + ' ' + item.name + ':' + item.data
        }
      })
    },
    showArcbar (canvasId, chartData) {
      let _self = this
      console.log('chartData', chartData)
      canvaArcbar1 = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'arcbar',
        fontSize: 11,
        legend: { show: false },
        // background:'#FFFFFF',
        pixelRatio: _self.pixelRatio,
        series: chartData.series,
        animation: true,
        width: _self.cWidth3 * _self.pixelRatio,
        height: _self.cHeight3 * _self.pixelRatio,
        dataLabel: true,
        title: {
          name: Math.round(chartData.series[0].data * 100) + '%', //这里我自动计算了，您可以直接给任意字符串
          color: chartData.series[0].color,
          fontSize: 15 * _self.pixelRatio
        },
        subtitle: {
          name: chartData.series[0].name, //这里您可以直接给任意字符串
          color: '#ffffff',
          opacity: 0.65,
          fontSize: 8 * _self.pixelRatio
        },
        extra: {
          arcbar: {
            backgroundColor: '#87b0fa',
            type: 'circle', //整圆类型进度条图
            width: _self.arcbarWidth * _self.pixelRatio, //圆弧的宽度
            startAngle: 1.5 //整圆类型只需配置起始角度即可
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.overview-layout {
  .flight-status {
    border-radius: 0rpx 0rpx 6rpx 6rpx;
    background: #FFFFFF;
    .divideLine {
      display: flex;
      justify-content: space-between;
      .square {
        width: 14rpx;
        height: 14rpx;
        background-color: #f0e2d5;
        transform: translateY(-50%) rotate(45deg) ;
        position: relative;
      }
      .line {
        background-color: #f0e2d5;
        height: 1rpx;
        width: calc(50% - 28rpx);
        margin: 0 28rpx;
      }
    }
    .flight-status-item {
      padding: 36rpx 28rpx;
      .value-item {
        padding-top: 20rpx;
        display: flex;
        &.arr-class {
          justify-content: space-between;
          .item-label {
            margin-right: 20rpx;
          }
        }
        &.dep-class {
          flex-direction: row;
          flex-wrap: wrap;
          .item {
            width: 25%;
            line-height: 60rpx;
            .item-label {
              display: inline-block;
              width: 100rpx;
            }
          }
        }
        .item-label {
          text-align-last: justify;
          text-align: justify;
          font-size: 25rpx;
          color: #999999;
          margin-right: 20rpx;
        }
        .item-value {
          font-size: 29rpx;
          color: #333333;
          font-weight: bold;
        }
      }
      .label {
        display: flex;
        justify-content: flex-start;
        .label-prefix {
          background-color: #f3e1cb;
          border-radius: 17rpx 0rpx 0rpx 0rpx;
          color: #7e5a4c;
          font-size: 21rpx;
          padding: 0rpx 10rpx;
          height: 40rpx;
          line-height: 40rpx;
        }
        .label-text {
          margin-left: 20rpx;
          font-size: 33rpx;
          letter-spacing: 2rpx;
          color: #333333;
          font-weight: bold;
        }
      }
    }
  }
  .oneHour {
    margin: 10rpx 0 0 40rpx;
    .value {
      margin-left: 30rpx;
      font-size: 33rpx;
      font-weight: bold;
    }
  }
  .detail-area {
    display: flex;
    flex-wrap: wrap;
    .detail-area-label {
      width: 50%;
      text-align: left;
      font-size: 26rpx;
      color: #595959;
      line-height: 50rpx;
      position: relative;
      left: 40rpx;
      .flag {
        display: inline-block;
        height: 20rpx;
        width: 20rpx;
        // margin-top: 10rpx;
        margin-right: 20rpx;
        border-radius: 50%;
        &.estimate {
          background: #facc14;
        }
        &.actual {
          background: #2fc25b;
        }
        &.plan {
          background: #1890ff;
        }
      }
      .label {
        display: inline-block;
        width: 200rpx;
      }
      .value {
        display: inline-block;
        width: 50rpx;
        font-size: 33rpx;
        font-weight: bold;
        color: #333333;
        margin-left: 20rpx;
      }
    }
  }
  .fail {
    height: 100%;
  }
  .release {
    height: 122rpx;
    display: flex;
    justify-content: space-between;
    line-height: 122rpx;
    padding: 0 20rpx;
    text {
      margin-right: 20rpx;
    }
    .label {
      font-size: 28rpx;
      color: #999999;
    }
    .value {
      font-size: 33rpx;
      color: #333333;
    }
  }
  .arr {
    background: #ffffff;
    padding: 20rpx 10rpx;
    margin-top: 20rpx;
    .arr-contend {
      margin-bottom: 20rpx;
      .title {
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 29rpx;
          color: #a6a6a6;
        }
        .value {
          font-size: 33rpx;
          color: #333333;
        }
      }
    }
  }
  .qiun-columns {
    width: 750upx;
    height: 500upx;
    background-color: #ffffff;
    margin-top: 30rpx;
    .qiun-title-dot-light {
      color: #000000;
      font-size: 28rpx;
      font-weight: bold;
      padding: 30rpx;
    }
    .charts {
      width: 750upx;
      height: 500upx;
      background-color: #ffffff;
    }
  }
  .flight-task-title {
    color: #000000;
    font-size: 28rpx;
    font-weight: bold;
    margin: 30rpx;
  }
  .flight-task {
    background-color: #ffffff;
    height: 200rpx;
    padding-top: 20rpx;
    .detail {
      text-align: center;
      .label {
        width: 33.3%;
        text:nth-child(1) {
          color: #999999;
          display: inline-block;
          width: 100rpx;
          text-align: right;
        }
        text:nth-child(2) {
          display: inline-block;
          color: #333333;
          width: 70rpx;
          margin-left: 30rpx;
          // text-align: center;
        }
      }

      height: 100%;
      display: flex;
      flex-wrap: wrap;
      // display: grid;
      // grid-template-columns: repeat(3, 33.33%);
      // grid-template-rows: repeat(3, 33.33%);
    }
  }
  .flight-msg {
    padding: 35rpx 28rpx 42rpx 28rpx;
    height: 290rpx;
    border-radius: 6rpx;
    
   background-image: url('../../../static/charts/flightOverviewBg.png');
   background-size: 100% 100%;
    .message {
      display: flex;
      justify-content: flex-start;
      margin-top: 20rpx;
      .message-item {
        font-size: 25rpx;
        color: #5a514c;
        text {
          margin: 0 30rpx;
        }
      }
    }
    .executed {
      font-size: 38rpx;
      color: #f9534b;
      font-weight: bold;
      margin-top: 30rpx;
    }
    .status {
      display: flex;
      justify-content: flex-start;
      font-size: 25rpx;
      color: #7e5a4c;
      margin-top: 20rpx;
      .status-item {
        padding: 0rpx 26rpx;
        height: 35rpx;
        line-height: 35rpx;
        background-color: #f3e1cb;
        border-radius: 3rpx;
        margin-right: 20rpx;
      }
    }
    .label {
      display: flex;
      justify-content: flex-start;
      .label-prefix {
        background-color: #f65644;
        border-radius: 17rpx 0rpx 0rpx 0rpx;
        color: #ffffff;
        font-size: 21rpx;
        padding: 0rpx 10rpx;
        height: 40rpx;
        line-height: 40rpx;
      }
      .label-text {
        margin-left: 20rpx;
        font-size: 33rpx;
        letter-spacing: 2rpx;
        color: #333333;
        font-weight: bold;
      }
    }
    
  }
}
</style>
