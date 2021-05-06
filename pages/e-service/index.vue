/*
*  界面名称: 电子服务单主界面
*  界面功能: 
*  其他      
*  时间      2020-12-14 15:13:40
*  作者      zql
 */
<template>
  <view class="e-service">
    <time-modal @flashTask="flashTask" ref="timeModal"></time-modal>
    <view class="flight-message">
      
      <view class="flex-message">
        <view class="top-message flight">
          <view class="left">
            <view class="flight-icon">
              <image src="@/static/service/flight.png" mode="aspectFit"></image>
            </view>
          </view>
          <view class="right">
            <view class="flight-number">
              <text>{{flightDetail.iataCarrier || '-'}}{{flightDetail.flight || '-'}}</text>
            </view>
            <view class="airline">
              <text>{{carrierCn}}</text>
            </view>
          </view>
        </view>
        
        <view class="bottom-message">
          <view class="label">
            航班日期
          </view>
          <view class="value">
            {{formatDate(flightDetail.opdate, 'YYYY-MM-DD')}}
          </view>
        </view>
      </view>
      
      <view class="flex-message">
        <view class="top-message">
           <view class="label">
             机号
           </view>
           <view class="value">
             {{flightDetail.registration || '-'}}
           </view>
        </view>
        <view class="bottom-message">
          <view class="label">
            降落时间
          </view>
          <view class="value">
            {{formatDate(flightDetail.actualArrTime)}}
          </view>
        </view>
      </view>
      
      <view class="flex-message">
        <view class="top-message">
           <view class="label">
             机型
           </view>
           <view class="value">
             {{flightDetail.aircraftType || '-'}}
           </view>
        </view>
        <view class="bottom-message">
          <view class="label">
            起飞时间
          </view>
          <view class="value">
            {{formatDate(flightDetail.actualDepTime)}}
          </view>
        </view>
      </view>
      
      <view class="flex-message">
        <view class="top-message">
           <view class="label">
             机位
           </view>
           <view class="value">
             {{flightDetail.stand || '-'}}
           </view>
        </view>
        <view class="bottom-message">
        </view>
      </view>
      
    </view>
    
    <view class="service-list">
      <view class="service-title">
        <view class="service-label">
          服务清单
        </view>
        <view class="service-button">
           <button type="primary" class="print">打印</button>
           <button type="primary" class="see">查看pdf</button>
        </view>
        
      </view>
      <view class="list-head">
        <view class="label" style="width: 40%;">项目</view>
        <view class="label" style="width: 25%;text-align: center;">时长</view>
        <view class="label" style="width: 35%;text-align: right;">时间</view>
      </view>
      <view class="list-contend">
        <swiper class="swiper" indicator-color="#f2f7ff" indicator-active-color="#1b8ffc" :indicator-dots="true">
          <swiper-item v-for="page in showPage" :key="page">
            <view class="list">
              <view class="list-item" v-for="(item, index) in serviceData.flightServiceDetails" v-if="judgeShowList(page, index)" :key="index">
                <view class="project name" style="width: 38%;">
                  <text>{{item.serviceItemDescription}}</text>
                </view>
                <view class="project hour" style="width: 25%;text-align: center;">
                  <text>{{computedHour(item)}}</text>
                </view>
                <view class="project time" style="width: 37%;text-align: right;">
                  <text class="startTime">{{ formatDate(item.actualUpdateBeginTime || item.actualBeginTime) }}</text>
                  <text>-</text>
                  <text class="endTime">{{ formatDate(item.actualUpdateEndTime || item.actualEndTime) }}</text>
                  <text class="across" v-if="isCross(item.actualUpdateBeginTime || item.actualBeginTime, item.actualUpdateEndTime || item.actualEndTime)">(跨)</text>
                  <image v-if="judgeEditStatus()" src="@/static/service/edit.png" @tap="edit(index)" mode="aspectFit"></image>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
      
    </view>
    <view class="signArea">
      <view class="completed" v-if="serviceData.status === '2'">
        <image src="@/static/service/signed.png" mode="aspectFit"></image>
      </view>
      <view class="sign-reasult">
        <view class="sign-reasult-label">{{serviceData.appointSignatory === '1' ? '航司代表' : '机组成员' }}签字</view>
        <view class="sign-reasult-img">
          <image v-if="receiveServiceSignature" :src="receiveServiceSignature" mode="aspectFit"></image>
        </view>
      </view>
      <view class="sign-edit" @tap="openSign" v-if="serviceData.status !== '2'">
        <text>{{receiveServiceSignature ? '修改' : '手写板'}}</text>
        <image src="@/static/service/down.png" :animation="animationData" mode="aspectFit"></image>
      </view>
    </view>
    
    <view class="sign-contend" v-if="signShow">
      <sign ref="sign" @extend="extend" @getSignImage="getSignImage"></sign>
    </view>
    
    <view class="agent" v-if="serviceAuth !== '0'">
      <text class="agent-label">经办人</text>
      <text class="agent-name" v-if="serviveSignText && serviveSignText !== 'null' ">{{serviveSignText}}</text>
    </view>
        <!-- <view class="top">
          <view class="center">
            <view class="center-title">{{selectType === '0' ? '地勤' : '机务'}}服务确认单</view>
            <view class="center-msg">
              <view class="left">
                <text>{{carrierCn}}</text>
              </view>
              <view class="left">
                <text>{{flightDetail.iataCarrier || ''}}{{flightDetail.flight || ''}}</text>
              </view>
              <view class="left"><text>{{formatDate(serviceData.createTime, 'YYYY-MM-DD')}}</text></view>
            </view>
            <view :class="['taskStatus', 'taskStatus' + '-' + serviceData.status]">
              {{formatTaskStatus(serviceData.status)}}
            </view>
          </view>
        </view> -->
        <!-- <view class="table">
          <view class="table-head">
            <view class="table-head-item">服务项</view>
            <view class="table-head-item item-label">开始时间</view>
            <view class="table-head-item item-label">结束时间</view>
            <view class="table-head-item item-label">总时长</view>
          </view>
          <view class="table-contend" :style="{height: tableHeight + 'px'}">
            <view class="table-item" @tap="rowClick(index)" :style="{ background: currentIndex === index ? '#ffaa7f' : '' }" v-for="(item, index) in serviceData.flightServiceDetails" :key="index">
              <view class="item">{{ item.serviceItemDescription }}</view>
              <view class="item item-value">{{ formatDate(item.actualUpdateBeginTime || item.actualBeginTime) }}</view>
              <view class="item item-value">{{ formatDate(item.actualUpdateEndTime || item.actualEndTime) }}</view>
              <view class="item item-value">{{ computedHour(item)}}</view>
            </view>
          </view>
          <view class="edit-btn" >
            <u-button type="primary" class="edit" @tap="edit" v-show="judgeEditStatus()">修改</u-button>
          </view>
        </view> -->

    <!-- <view class="sign">
      <view class="signItem operator">
        <view class="sign-label">营运人代表签字:</view>
        <view class="sign-image" @tap="extend">
          <image v-if="receiveServiceSignature" :src="receiveServiceSignature" mode="aspectFit"></image>
          <text v-else class="notSigned">待签</text>
        </view>
      </view>
      <view class="signItem provider">
        <view class="sign-label">服务方签字:</view>
        <view class="sign-image" @tap="serviceImg">
          <text class="notSigned Confirm" v-if="serviveSignText">{{serviveSignText}}</text>
          <text class="notSigned" v-else>待签</text>
        </view>
      </view>
    </view> -->
    <u-modal v-model="selectShow" title="请选择一项确认单" :show-confirm-button="false">
      <view class="slot-content">
        <view class="btn-flex">
          <u-button type="primary" @tap="select('0')">选择地勤</u-button>
          <u-button type="success" @tap="select('1')">选择机务</u-button>
        </view>
      </view>
    </u-modal>
    <!-- <image :src="filePath" mode="aspectFit"></image>  -->
    <view class="confirm">
      <button type="primary" :disabled="serviceData.status === '2'" class="edit" @tap="submit">提交</button>
    </view>
  </view>
</template>

<script>
import sign from './sign.vue'
import apiConfig from '@/config/api-config'
import {mapGetters} from 'vuex'
import moment from 'moment'
import timeModal from './timeModal'
import {getSignInfo, postService} from '@/api/sign/index.js'
import {deepCopy} from '../../common/util/util.js'
export default {
  components: {
    timeModal, sign
  },
  data () {
    return {
      serviceAuth: null,
      animationData: {},
      signShow: false,
      selectType: '0',
      storeServiceData: [],
      selectShow: false,
      airlineFlag: false,
      serviveConfirmFlag: false,
      serviveSignText: '',
      domId: '',
      filePath: '',
      tableHeight: 0,
      carrierCn: '',
      flightDetail: {},
      serviceData: {flightServiceDetails: []},
      receiveServiceSignature: '',
      imgSrcFlag: '',
      imgSrc: null
    }
  },
  onHide () {
    this.openSign()
  },
  // 强制竖屏 从ferry跳过来的
  onShow () {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    // #endif
    if (getApp().globalData.imgSrc) {
      this.getSignImage()
    }
  },
  computed: {
    ...mapGetters(['remoteDic', 'user']),
    showPage () {
      return Math.ceil(this.serviceData.flightServiceDetails.length / 5)
    }
  },
  onLoad (e) {
    this.serviceAuth = uni.getStorageSync('serviceAuth')
    if (this.serviceAuth === '1') {
      uni.setNavigationBarTitle({title: '地勤服务确认清单'})
    } else if (this.serviceAuth === '2') {
      uni.setNavigationBarTitle({title: '机务服务确认清单'})
    }
    // 从航司列表来
    if (e.airline) {
      this.airlineFlag = true
    }
    this.getDetail('messageJump')
  },
  mounted () {
    this.getSignImage()
    // var windowsHeight = uni.getSystemInfoSync().windowHeight
    // let view = uni
    // 	.createSelectorQuery()
    // 	.in(this)
    // 	.select('.table-contend')
    // view
    // 	.boundingClientRect(data => {
    // 		this.tableHeight = windowsHeight - data.top - 300
    // 	})
    // 	.exec()
  },
  methods: {
    // 获取签名图片变量，然后赋值
    getSignImage () {
      this.imgSrc = getApp().globalData.imgSrc
      this.getImg(this.imgSrc)
    },
    // 展开签名板
    openSign () {
      if (this.serviceData.status === '2') return
      this.animationData = {}
      var animation = uni.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      this.signShow = !this.signShow
      animation.rotate(this.signShow ? -180 : 0).step()
      this.animationData = animation.export()
      
      if (this.signShow) {
        this.$nextTick(() => {
          this.$refs.sign.show()
        })
      }
    },
    // 判断服务项所展示的5条数据
    judgeShowList (page, index) {
      console.log(111, page, index)
      return 5 * page > index && index >= 5 * (page - 1)
    },
    // 地勤、机务
    select (type, flag) {
      this.selectShow = false
      let match = this.storeServiceData.find(item => item.type === type)
      if (match) {
        this.selectType = type
        uni.setNavigationBarTitle({
          title: `${this.selectType === '0' ? '地勤' : '机务'}服务确认单`
        })
        this.serviceData = match
        getApp().globalData.flightServiceDetails = match.flightServiceDetails
        this.serviceData.flightServiceDetails = match.flightServiceDetails.filter(i => i.actualBeginTime)
        this.serviveSignText = this.serviceData.operator
        this.signShow = false
        if ((!flag || flag !== 'submit') && this.serviceData.picBase64) {
          this.receiveServiceSignature = 'data:image/png;base64,' + this.serviceData.picBase64
        }
      }
    },
    /**
     * 渲染完毕接收图片
     * @param {String} filePath
     */
    // 跳转至服务项维护
    jumpServices () {
      uni.navigateTo({
        url: `../e-service/transfer?flightServiceId=${this.serviceData.id}`
      })
    },
    judgeEditStatus () {
      if (this.serviceData.flightServiceDetails && this.serviceData.flightServiceDetails.length !== 0) {
        return this.serviceData.status !== '2' && this.flightDetail.flightStatus !=='DEP' && this.serviceAuth !== '0'
      }
      return false
    },
    // 计算时长
    computedHour (item) {
      if (item.actualEndTime || item.actualUpdateEndTime) {
        let diff = moment(item.actualUpdateEndTime || item.actualEndTime).diff(moment(item.actualUpdateBeginTime || item.actualBeginTime), 'minutes')
        console.log(diff)
        return diff + 'min'
      }
      return '---'
    },
    // 转化时间/日期
    formatDate (date, format = 'HH:mm') {
      if (date) {
        return moment(date).format(format)
      }
      return '-'
    },
    // 时间提交后 更新数据
    flashTask () {
      let para = {
        flightId: this.flightDetail.id
      }
      getSignInfo(para).then(res => {
        if (res.status) {
          if (this.airlineFlag && res.data.length === 2) {
            let match = res.data.find(item => item.type === this.selectType)
            if (match) {
              this.serviceData = match
              getApp().globalData.flightServiceDetails = match.flightServiceDetails
              this.serviceData.flightServiceDetails = match.flightServiceDetails.filter(i => i.actualBeginTime)
            }
          } else {
            getApp().globalData.flightServiceDetails = res.data[0].flightServiceDetails
            this.serviceData.flightServiceDetails = res.data[0].flightServiceDetails.filter(i => i.actualBeginTime)
          }
        }
      })
    },
    // 计算是否跨天
    isCross (startTime, endTime) {
      if (endTime) {
        // let diff = moment(endTime).diff(moment(startTime), 'days')
        let strat = moment(startTime).format('YYYY-MM-DD')
        let end = moment(endTime).format('YYYY-MM-DD')
        let diff = moment(end).diff(moment(strat), 'days')
        console.log(strat, end)
        console.log(diff)
        return diff >= 1
      }
    },
    // 通过航班的id获取服务单信息
    getDetail (flag) {
      this.flightDetail = getApp().globalData.flightDetail
      console.log('flightDetail', this.flightDetail)
      this.$loading()
      let carrier = this.flightDetail.iataCarrier
      if (this.remoteDic.BASE_AIRLINE.length > 0) {
        let match = this.remoteDic.BASE_AIRLINE.find(item => item.iataCode === carrier)
        if (match) {
          this.carrierCn = match.cnName
        }
        let para = {
          flightId: this.flightDetail.id
        }
        getSignInfo(para).then(res => {
          if (res.status) {
            if (this.airlineFlag && res.data.length === 2) {
              this.storeServiceData = res.data
              if (flag === 'reflash') {
                this.select(this.selectType, 'submit')
              } else {
                this.selectShow = true
              }
            } else {
              this.storeServiceData[0] = JSON.parse(JSON.stringify(res.data[0]))
              this.serviceData = res.data[0]
              getApp().globalData.flightServiceDetails = res.data[0].flightServiceDetails
              this.serviceData.flightServiceDetails = res.data[0].flightServiceDetails.filter(i => i.actualBeginTime)
              console.log('flightServiceDetails', this.serviceData.flightServiceDetails)
              this.serviveSignText = this.serviceData.operator
              this.signShow = false
              if (flag === 'messageJump') {
                // this.receiveServiceSignature = 'data:image/jpg;base64,' + this.serviceData.signPictureUrl
                if (this.serviceData.picBase64) {
                  this.receiveServiceSignature = 'data:image/png;base64,' + this.serviceData.picBase64
                }
              }
            }
          } else {
            this.$message(res.message)
          }
          uni.hideLoading()
        }).catch(() => {
          uni.hideLoading()
          this.$message('无法发起')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        })
      }
    },
    getImg (imgSrc) {
      this.receiveServiceSignature = imgSrc
    },
    // 提交签名的方法，有哪一方签名就提交哪一方
    submit () {
      let file = []
      if (!this.receiveServiceSignature) {
        this.$message('请先签名！')
        return
      }
      getApp().globalData.isFreshSignList = true
      if (this.receiveServiceSignature) {
        file.push({name: 'signFile', uri: this.receiveServiceSignature})
      }
      this.upload(file)
      // let file = [
      //   {name: 'serviceSignFile', uri: this.signaturePicture},
      //   {name: 'receiveServiceSignFile', uri: this.receiveServiceSignature}
      // ]
      
    },
    // 上传
    upload (file, flag) {
      this.$loading('提交中')
      let url = apiConfig.url
      // if (getApp().globalData.ignoreSvn) {
      //   url = apiConfig.puductUrl
      // }
      // let operateType = ''
      // if (this.serviceAuth === '0') {
      //   operateType = '0'
      // } else {
      //   operateType = '1'
      //   if (this.storeServiceData.length === 1 && this.storeServiceData[0].status === '1') {
      //     operateType = '2'
      //   }
      // }
      uni.uploadFile({
          url: url + '/api/gms/flightService/sign',
          files: file,
          header: {
          	Authorization: uni.getStorageSync('access_token')
          },
          formData: {
              'id': this.serviceData.id,
              // operateType: operateType,
              operator: this.serviceAuth !== '0' ? this.user.userName : null,
              airlineDelegate: this.serviceAuth === '0' ? this.user.userName : null
          },
          complete: (uploadFileRes) => {
            console.log('uploadFileRes', uploadFileRes)
            let data = JSON.parse(uploadFileRes.data)
            if (uploadFileRes.statusCode === 200) {
              if (data.status) {
                if (flag && flag === 'render') {
                  this.receiveServiceSignature = this.filePath
                }
                this.getDetail('reflash')
              }
              this.$message(data.message)
            } else {
              this.$message(data.message)
            }
            uni.hideLoading()
          }
      })
    },
    // 点击营运人区域
    extend () {
      if (this.serviceData.status === '2') {
        return
      }
      if (this.serviceAuth !== '0' && this.serviceData.status === 2) {
        return
      }
      this.imgSrcFlag = 'operator'
      // #ifdef APP-PLUS
      plus.screen.lockOrientation('landscape-primary')
      // #endif
      setTimeout(() => {
        uni.navigateTo({
          url: '../e-service/signExtend'
        })
      }, 100)
    },
    edit (currentIndex) {
      let data = this.serviceData.flightServiceDetails[currentIndex]
      this.$refs.timeModal.add(data)
    }
  }
}
</script>

<style lang="scss">
.confirm {
  margin: 40rpx 0;
  padding: 0 30rpx;
  button {
    border-radius: 55rpx;
  }
}
.btn-flex {
  display: flex;
  margin: 40rpx 0;
}
.e-service {
  .agent {
    height: 128rpx;
    line-height: 128rpx;
    background-color: #ffffff;
    border-radius: 1rpx;
    padding: 0 30rpx;
    .agent-label {
      width: 210rpx;
      display: inline-block;
    }
  }
  .completed {
    position: absolute;
    right: 40rpx;
    bottom: -20rpx;
    image {
      width: 272rpx;
      height: 272rpx;
    }
  }
  .signArea {
    display: flex;
    justify-content: space-between;
    height: 128rpx;
    background-color: #ffffff;
    border-radius: 1rpx;
    margin: 10rpx 0;
    padding: 0 30rpx;
    line-height: 128rpx;
    font-size: 28rpx;
    position: relative;
    .sign-reasult {
      color: #333333;
      display: flex;
      justify-content: flex-start;
      .sign-reasult-label {
        width: 210rpx;
      }
      .sign-reasult-img {
        height: 128rpx;
        line-height: 128rpx;
        image {
          width: 185rpx;
          height: 128rpx;
          // position: relative;
          // top: 50%;
          // transform: translateY(-50%);
        }
      }
      
    }
    .sign-edit {
      color: #666666;
      text {
        margin-right: 10rpx;
      }
      image {
        height: 15rpx;
        width: 30rpx;
      }
    }
  }
  .service-list {
    height: 730rpx;
    background: #FFFFFF;
    border-radius: 60rpx 60rpx 0 0;
    margin-top: -260rpx;
    .list-contend {
      padding: 30rpx 20rpx;
      height: calc(100% - 150rpx);
      .swiper {
        height: 100%;
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        height: 100rpx;
        font-size: 32rpx;
        font-weight: bold;
        image {
          width: 23rpx;
          height: 26rpx;
          margin-left: 10rpx;
        }
        .across {
          color: red;
          font-size: 30rpx;
        }
        .startTime ,.endTime {
          width: 85rpx;
          display: inline-block;
        }
        .name {
          font-size: 28rpx;
          font-weight: normal;
        }
      }
    }
    .list-head {
      display: flex;
      justify-content: space-between;
      color: #000000;
      background-color: #d1e9fe;
      opacity: 0.3;
      font-size: 28rpx;
      padding: 10rpx 20rpx;
    }
    .service-title {
      display: flex;
      justify-content: space-between;
      padding: 0 36rpx;
      height: 120rpx;
      line-height: 120rpx;
      .service-label {
        font-weight: bold;
        font-size: 32rpx;
        color: #333333;
        text-align: center;
      }
      .service-button {
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;
        button {
          font-size: 32rpx;
          width: 200rpx;
          height: 80rpx;
        }
        .print {
          margin-right: 20rpx;
          background: #808080;
        }
        .see {
          background: #aaaa00;
        }
      }
    }
  }
  .flight-message {
    padding: 50rpx 30rpx 0 30rpx;
    display: flex;
    justify-content: space-between;
    height: 550rpx;
    background-image: linear-gradient(180deg, 
    		#1891ff 0%, 
    		#ffffff 100%);
    .flex-message {
      line-height: 40rpx;
      .label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
      }
      .value {
        text-align: center;
        font-size: 32rpx;
        color: #ffffff;
      }
      .top-message {
        height: 130rpx;
        .airline {
          max-width: 350rpx;
          font-size: 24rpx;
          color: #ffffff;
        }
        .flight-number {
          font-size: 40rpx;
          font-weight: bold;
          color: #ffffff;
        }
        .flight-icon {
          margin-top: 12rpx;
          image {
            width: 57rpx;
            height: 57rpx;
          }
        }
        &.flight {
          display: flex;
          justify-content: flex-start;
          .right {
            margin-left: 10rpx;
          }
        }
      }
    }
  }
}
</style>
