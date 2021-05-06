<template>
  <view class="release-layout">
    <view class="fail" v-if="topLoadFail">
      <fail @reloadData="getData()"></fail>
    </view>
    <view class="release-main" v-else>
      <view class="">
        <view class="releaseInfo">
          <view class="title">
            <image class="titleIcon" src="@/static/charts/titleIcon1_mobile.png" mode="aspectFit"></image>
            <view class="titleText">放行延误原因统计</view>
          </view>
          <view class="reasonMain">
            <view class="pie-total">
              <view class="qiun-charts qiun-rows" >
                <canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
              </view>
              <view style="padding: 10px 0;text-align: center;">
                <span style="color:#a6a6a6;font-size: 14px">总架次：</span>
                <span style="color:#333333;font-weight: bold">{{dlyTotal}}</span>
              </view>
            </view>
          </view>
        </view>
        <view class="releaseInfo" style="padding-top: 10px">
          <view class="title">
            <image class="titleIcon" src="@/static/charts/titleIcon2_mobile.png" mode="aspectFit"></image>
            <view class="titleText">各方向放行正常率</view>
          </view>
          <view class="main">
            <view class="name-num" v-for="(item, index) in routeNormalRate" :class="routerClass[index % 3]" :key="index">
              <view class="name">{{item.label}}</view>
              <view class="num">{{item.value}}%</view>
            </view>
          </view>
        </view>
      </view>
    </view>
     
     <view class="fail" v-if="bottomLoadFail">
       <fail @reloadData="getDelayData()"></fail>
     </view>
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
            <u-subsection :list="list"  @change="handleTab" active-color="#1890ff" :current="current"></u-subsection>
            <!-- <view class="tabItem" :class="{'select': tabFlag}" @click="handleTab(true)">已执行</view>
            <view class="tabItem" :class="{'select': !tabFlag}" @click="handleTab(false)">未执行</view> -->
          </view>
        </view>
        <view class="qiun-charts2" >
            <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts2" @touchstart="touchColumn"></canvas>
          </view>
      </view>
      <view class="btns">
        <view class="item" v-for="(item,index) in displayChartData" :key="index">
          <view class="time-num">
            <view class="time">{{item.disName}}</view>
            <view class="num">{{item.value}}</view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="forecast-class">
      <view class="qiun-charts3">
      	<canvas canvas-id="canvasRing" id="canvasRing1" class="charts3"></canvas>
      </view>
      <view class="qiun-charts3">
      	<canvas canvas-id="canvasRing" id="canvasRing2" class="charts3"></canvas>
      </view>
      <view class="qiun-charts3">
      	<canvas canvas-id="canvasRing" id="canvasRing3" class="charts3"></canvas>
      </view>
      <view class="qiun-charts3">
      	<canvas canvas-id="canvasRing" id="canvasRing4" class="charts3"></canvas>
      </view>
    </view>
    
    <view class="">
      <view class="depTab2">
        <u-subsection :list="list2" inactive-color="#000"active-color="#fff" bg-color="#fff" button-color="#1890ff" :current="depTab2" @change="depChange2"></u-subsection>
      </view>
      <view class="qiun-columns">
      	<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
      		<!-- <view class="qiun-title-dot-light">航班按时段分布</view> -->
      	</view>
      	<view class="qiun-charts" >
          <view class="fail" v-if="bottomLoadFail">
            <fail @reloadData="getData()"></fail>
          </view>
          <view class="" v-else>
            <canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea"></canvas>
          </view>
      	</view>
      </view>
    </view>
  </view>
  
</template>
  
<script>
  import uCharts from '@/components/u-charts/u-charts.js'
  import {deepCopy} from '@/common/util/util.js'
  import {getTimeDistribution} from '@/api/home/flight-overview/index.js'
  import {getDlyReasonFlight, getNormalReleaseRateRoute, getDelayReleaseFlightStatistics, getDlyForecast} from '@/api/home/release-support/index.js'
  import _ from 'lodash'
  import fail from '@/components/fail/index.vue'
  // import vpnMix from '@/common/mixin/vpn-login-mixin.js'
  export default {
    components: {fail},
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
    		default: () => {
    		}
    	}
    },
    data() {
      return {
        canvaArea: null,
        canvaArea1: null,
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
        current: 0,
        piearr:[],
        canvaPie: null,
        canvaColumn: null,
        cWidth:'',
        cHeight:'',
        pixelRatio:1,
        dlyTotal: 0,
        timer: null,
        chartForecastData: {
          delay: {
            onehour: {
              data: [],
              title: '未来1小时\n预计放行延误'
            },
            twohour: {
              data: [],
              title: '未来2小时\n预计放行延误'
            }
          },
          normal: {
            onehour: {
              data: [],
              title: '未来1小时\n预计放行正常'
            },
            twohour: {
              data: [],
              title: '未来2小时\n预计放行正常'
            }
          }
        },
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
    computed: {
     
    },
    deactivated () {
      this.cleanTimer()
    },
    beforeDestroy () {
      this.cleanTimer()
    },
    mounted() {
     this.cWidth = uni.upx2px(750)
     this.cHeight = uni.upx2px(500)
    },
    onLoad() {
      
    },
    methods: {
      // 获取放行趋势数据
      getDlyForecastData () {
        getDlyForecast({airportCode: this.airportCode}).then(res => {
          if (res.status) {
            let delayOne = []
            let delayTwo = []
            let normalOne = []
            let normalTwo = []
            if (res.data.delay.OneHourForecast.length !== 0) {
              res.data.delay.OneHourForecast.forEach(item => {
                delayOne.push({
                  name: item.routePoint,
                  data: item.number
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
                delayTwo.push({
                  name: item.routePoint,
                  data: item.number
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
            if (res.data.normal.OneHourForecast.length !== 0) {
              res.data.normal.OneHourForecast.forEach(item => {
                normalOne.push({
                  name: item.routePoint,
                  data: item.number
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
                normalTwo.push({
                  name: item.routePoint,
                  data: item.number
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
            this.chartForecastData.delay.onehour = Object.assign({}, this.chartForecastData.delay.onehour, { data: delayOne })
            this.chartForecastData.delay.twohour = Object.assign({}, this.chartForecastData.delay.twohour, { data: delayTwo })
            this.chartForecastData.normal.onehour = Object.assign({}, this.chartForecastData.normal.onehour, { data: normalOne })
            this.chartForecastData.normal.twohour = Object.assign({}, this.chartForecastData.normal.twohour, { data: normalTwo })
            let Arcbar1 = {series:this.chartForecastData.delay.onehour.data}
            let Arcbar2 = {series:this.chartForecastData.delay.twohour.data}
            let Arcbar3 = {series:this.chartForecastData.normal.onehour.data}
            let Arcbar4 = {series:this.chartForecastData.normal.twohour.data}
            console.log('Arcbar1', Arcbar1)
            this.showArcbar("canvasRing1", Arcbar1)
            this.showArcbar("canvasRing2", Arcbar2)
            this.showArcbar("canvasRing3", Arcbar3)
            this.showArcbar("canvasRing4", Arcbar4)
            // console.log('chartForecastData', this.chartForecastData)
          }
        }).catch((e) => {
          console.log(e)
          this.$message('加载失败，请点击重新加载')
        })
      },
      showArcbar(canvasId,chartData){
      	let _self = this
      	var canvaRing=new uCharts({
      		$this:_self,
      		canvasId: canvasId,
      		type: 'ring',
      		fontSize:11,
      		padding:[5,5,5,5],
      		legend:{
      			show:true,
      			position:'right',
      			float:'center',
      			itemGap:10,
      			padding:5,
      			lineHeight:26,
      			margin:5,
      			//backgroundColor:'rgba(41,198,90,0.2)',
      			//borderColor :'rgba(41,198,90,0.5)',
      			borderWidth :1
      		},
      		background:'#FFFFFF',
      		pixelRatio:_self.pixelRatio,
      		series: chartData.series,
      		animation: false,
      		width: _self.cWidth*_self.pixelRatio,
      		height: _self.cHeight*_self.pixelRatio,
      		disablePieStroke: true,
      		dataLabel: true,
      		subtitle: {
      			name: '70%',
      			color: '#7cb5ec',
      			fontSize: 25*_self.pixelRatio,
      		},
      		title: {
      			name: '收益率',
      			color: '#666666',
      			fontSize: 15*_self.pixelRatio,
      		},
      		extra: {
      			pie: {
      			  offsetAngle: 0,
      			  ringWidth: 40*_self.pixelRatio,
      			  labelWidth:15
      			}
      		},
      	});
      },
      getDepTimeList () {
        this.chartData2 = []
        let obj = {
          airportCode: this.airportCode
        }
        getTimeDistribution(obj).then(res => {
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
              series:[
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
            this.showArea("canvasArea", this.chartData2)
            // if (!this.timerDep1) {
            //   this.timerDep1 = setInterval(() => {
            //     this.getDepTimeList()
            //   }, (this.indexParams.timer.DepList || 60) * 1000)
            // }
          }
        }).catch(() => {
          this.$message('加载失败，请点击重新加载')
        })
      },
      showArea(canvasId,chartData){
      	let _self = this
      	_self.canvaArea=new uCharts({
      		$this:_self = this,
      		canvasId: canvasId,
      		type: 'area',
      		fontSize:11,
      		legend:true,
      		dataLabel:false,
      		dataPointShape:true,
      		background:'#FFFFFF',
      		pixelRatio:_self.pixelRatio,
      		categories: chartData.categories,
      		series: chartData.series,
      		animation: true,
      		enableMarkLine: false,/***需要开启标记线***/
      		xAxis: {
      			type:'grid',
      			gridColor:'#CCCCCC',
      			gridType:'dash',
      			dashLength:8
      		},
      		yAxis: {
      			gridType:'dash',
      			gridColor:'#CCCCCC',
      			dashLength:8,
      			splitNumber:5,
            max:40
      		},
      		width: _self.cWidth*_self.pixelRatio,
      		height: _self.cHeight*_self.pixelRatio,
      		extra: {
      			area:{
      				type: 'straight',
      				opacity:0.2,
      				addLine:true,
      				width:2
      			},
      			markLine: {
      			  type: 'dash',
      			  dashLength: 5,
      			  data: [{
      			    value: this.indexParams.markLineVal[`${this.airportCode}DepAndArrList`] || 30,
      			    lineColor: '#f04864',
      			    showLabel:true
      			  }]
      			}
      		}
      	})
      },
      touchArea(e) {
      	this.canvaArea.showToolTip(e, {
      		format: function (item, category) {
            console.log(item, category)
      			return category + '时' + ' ' + item.name + ':' + item.data 
      		}
      	});
      },
      depChange2 (index) {
        this.depTab2 = index
        this.getDepTimeList()
      },
      // 点击tab切换分页效果，true为已执行，false未执行
      handleTab (index) {
        this.current = index
        if (this.current === 0) {
          this.displayChartData = deepCopy(this.executedChartData)
        } else {
          this.displayChartData = deepCopy(this.noExecutedChartData)
        }
        this.getCorData()
      },
      getDelayData (para) {
        console.log('para', para)
        this.executedChartData = [{disName: '0-5分钟'}, {disName: '5-10分钟'}, {disName: '10-30分钟'}, {disName: '30-60分钟'}, {disName: '1-2小时'}, {disName: '2-4小时'}, {disName: '超过4小时'}]
        this.noExecutedChartData = [{disName: '0-5分钟'}, {disName: '5-10分钟'}, {disName: '10-30分钟'}, {disName: '30-60分钟'}, {disName: '1-2小时'}, {disName: '2-4小时'}, {disName: '超过4小时'}]
        getDelayReleaseFlightStatistics(para).then(res => {
          if (res.status) {
            this.bottomLoadFail = false
            this.delay = (res.data.todayDelay * 100).toFixed(2)
            // 已执行
            _.forIn(res.data.executed, (value, key) => {
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
            this.getCorData()
          }
        }).catch(() => {
          this.bottomLoadFail = true
        })
      },
      getCorData () {
        var corData = []
        if (this.current === 0) {
          this.displayChartData = deepCopy(this.executedChartData)
          corData = {
            "categories": this.executedChartData.map(i => i.name),
            "series": [{
            "name": "已执行",
            "data": this.executedChartData.map(i => i.value)
            }]
          }
        } else {
          corData = {
            "categories": this.noExecutedChartData.map(i => i.name),
            "series": [{
            "name": "未执行",
            "data": this.noExecutedChartData.map(i => i.value)
            }]
          }
        }
        this.showColumn("canvasColumn", corData);
      },
      showColumn(canvasId,chartData){
        let _self = this
        var width = uni.upx2px(730)
        this.canvaColumn=new uCharts({
          $this:_self,
          canvasId: canvasId,
          type: 'column',
          legend:{show:true},
          fontSize:11,
          background:'#FFFFFF',
          pixelRatio:_self.pixelRatio,
          animation: true,
          categories: chartData.categories,
          series: chartData.series,
          padding:[15,0,0,0],
          legend:{
          	show:true,
          	padding:0,
          	lineHeight:11,
          	margin:0,
          },
          xAxis: {
            // disableGrid:true,
          },
          yAxis: {
            data:[{
              // position:'right',
          		axisLine:true,
              format:(val)=>{return val.toFixed(1)},
            }]
          },
          dataLabel: true,
          width: width*_self.pixelRatio,
          height: _self.cHeight*_self.pixelRatio,
          extra: {
            column: {
              type:'group',
              width: width*_self.pixelRatio*0.45/chartData.categories.length
            }
            }
        });
        
      },
      touchColumn(e){
        this.canvaColumn.showToolTip(e, {
          format: function (item, category) {
            if(typeof item.data === 'object'){
              return category + ' ' + item.name + ':' + item.data.value 
            }else{
              return category + ' ' + item.name + ':' + item.data 
            }
          }
        });
      },
      getData (val) {
        this.cleanTimer()
        let para = {airportCode: this.airportCode}
        if (val !== 'setInterval') {
          this.getDelayData(para)
        }
        this.getDlyForecastData()
        this.getDepTimeList()
        getDlyReasonFlight(para).then(res => {
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
                // {
                //   name: '航空公司',
                //   data: 200
                // },
                // {
                //   name: '天气',
                //   data: 50
                // },
                // {
                //   name: '军事活动',
                //   data: 50
                // },
                // {
                //   name: '空管',
                //   data: 10
                // },
                // {
                //   name: '机场',
                //   data: 150
                // },
                // {
                //   name: '其他',
                //   data: 20
                // }
              ]
            }
            this.reasonList = data
            this.chartData = data
            this.showPie("canvasPie", {series: data});
            console.log('reasonList', this.reasonList)
          }
        }).catch(() => {
          clearInterval(this.timer)
          this.timer = null
          this.topLoadFail = true
        })
        getNormalReleaseRateRoute(para).then(res => {
          if (res.status) {
            this.routeNormalRate = []
            _.forIn(res.data, (value, key) => {
              this.routeNormalRate.push({label: key, value: (value * 100).toFixed(2)})
              // this.routeNormalRate[key] = (value * 100).toFixed(2)
            })
            console.log('routeNormalRate', this.routeNormalRate)
          }
        })
      },
      showPie(canvasId,chartData) {
        console.log(11111, canvasId, chartData.series)
        let _self = this
        console.log(_self.pixelRatio, _self.cWidth*_self.pixelRatio, _self.cHeight*_self.pixelRatio)
        this.canvaPie=new uCharts({
        	$this:_self,
        	canvasId: canvasId,
        	type: 'pie',
        	fontSize:13,
        	padding:[15,15,0,15],
        	legend:{
        		show:true,
            position:'right',
            float:'center',
        		padding:5,
        		lineHeight:20,
        		margin:0,
        	},
        	background:'#FFFFFF',
        	pixelRatio:_self.pixelRatio,
        	series: chartData.series,
        	animation: true,
        	width: _self.cWidth*_self.pixelRatio,
        	height: _self.cHeight*_self.pixelRatio,
        	dataLabel: true,
        	extra: {
        		pie: {
              border:true,
              borderColor:'#FFFFFF',
              borderWidth:3
        		}
        	},
        })
        this.piearr=this.canvaPie.opts.series
      },
      touchPie(e){
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
    .forecast-class {
      display: flex;
      justify-content: space-around;
    }
    .charts3 {
    	position: absolute;
    	width: 137rpx;
    	height: 137rpx;
    	background-color: #FFFFFF;
    }
    .qiun-charts3 {
    	width: 137rpx;
    	height: 137rpx;
    	bottom: 20rpx;
    	background-color: #FFFFFF;
    	position: relative;
    }
    .qiun-charts2{width: 730upx; height:500upx;background-color: #FFFFFF;}
    .charts2{width: 730upx; height:500upx;background-color: #FFFFFF;}
    .qiun-charts {
    	width: 750upx;
    	height: 500upx;
    	background-color: #FFFFFF;
    }
    
    .charts {
    	width: 750upx;
    	height: 500upx;
    	background-color: #FFFFFF;
    }
    .btns {
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 40rpx;
      
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
  
        .todayDelay {
          background-image: linear-gradient(90deg,
            #73a2fc 0%,
            #83cbfd 100%);
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
