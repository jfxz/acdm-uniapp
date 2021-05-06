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
    <html2canvas ref="html2canvas" :domId="domId" @renderFinish="renderFinish">
      <view class="service-layout" id="poster">
        <view class="top">
          <!-- <view class="top-title">
            <view class="line left"></view>
            <view class="mid"><image :src="airportBase64" mode="aspectFit"></image></view>
            <view class="line right"></view>
          </view> -->
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
          <!-- <view class="bottom"></view> -->
        </view>
        <view class="table">
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
          <!-- v-if="judgeEditStatus()" -->
          <view class="edit-btn" >
            <u-button type="warning" class="clear" @tap="jumpServices" v-if="serviceData.status !== '3'">服务项维护</u-button>
            <u-button type="primary" class="edit" @tap="edit" v-show="judgeEditStatus()">修改</u-button>
          </view>
        </view>

        <view class="sign">
          <view class="signItem operator">
            <view class="sign-label">营运人代表签字:</view>
            <view class="sign-image" @tap="operatorImg">
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
        </view>
      </view>
    </html2canvas>
    <u-modal v-model="selectShow" title="请选择一项确认单" :show-confirm-button="false">
      <view class="slot-content">
        <view class="btn-flex">
          <u-button type="primary" @tap="select('0')">选择地勤</u-button>
          <u-button type="success" @tap="select('1')">选择机务</u-button>
        </view>
      </view>
    </u-modal>
    <!-- <image :src="filePath" mode="aspectFit"></image>  -->
    <view class="confirm" v-if="serviceData.status !== '3'"><button type="primary" class="edit" @tap="submit">确认签署</button></view>
  </view>
</template>

<script>
import { base64ToPath, pathToBase64 } from '@/common/util/image-tools.js';
import apiConfig from '@/config/api-config'
import {mapGetters} from 'vuex'
import moment from 'moment'
import timeModal from './timeModal'
import {getSignInfo, postService} from '@/api/sign/index.js'
import {deepCopy} from '../../common/util/util.js'
export default {
  components: {
    timeModal
  },
  data () {
    return {
      airportBase64: '',
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
      imgSrc: null,
      currentIndex: null
    }
  },
  // 强制竖屏 从ferry跳过来的
  onShow () {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    // #endif
    this.imgSrc = getApp().globalData.imgSrc
    this.getImg(this.imgSrc)
  },
  computed: {
    ...mapGetters(['remoteDic', 'user']),
  },
  onLoad (e) {
    // uni.getImageInfo({
    //   src: '../../static/airport-logo.png',
    //   success: function (image) {
    //     console.log('image222', image)
    //     this.airportBase64 = await pathToBase64(image.path)
    //   },
    //   complete: function (image) {
    //     console.log('image333', image)
    //   }
    // })
    // 从航司列表来
    if (e.airline) {
      this.airlineFlag = true
      this.getDetail()
    }
    console.log(222, e)
  },
  // 为避免出现跨域问题，这里将图片转为Base64字符串后展示
  async mounted () {
    const imgInfo = await uni.getImageInfo({
    	src: '/static/airport-logo.png'
    })
    this.airportBase64 = await pathToBase64(imgInfo[1].path)
    var windowsHeight = uni.getSystemInfoSync().windowHeight
    let view = uni
    	.createSelectorQuery()
    	.in(this)
    	.select('.table-contend')
    view
    	.boundingClientRect(data => {
    		this.tableHeight = windowsHeight - data.top - 300
    	})
    	.exec()
  },
  methods: {
    async receiveToBase64 () {
      let receive = await uni.getImageInfo({
      	src: this.receiveServiceSignature
      })
      this.receiveServiceSignature = await pathToBase64(receive[1].path)
    },
    select (type, flag) {
      this.selectShow = false
      let match = this.storeServiceData.find(item => item.type === type)
      if (match) {
        this.selectType = type
        this.serviceData = match
        getApp().globalData.flightServiceDetails = match.flightServiceDetails
        this.serviceData.flightServiceDetails = match.flightServiceDetails.filter(i => i.actualBeginTime)
        this.serviveSignText = this.serviceData.operatorSign
        if (!flag || flag !== 'submit') {
          this.receiveServiceSignature = this.serviceData.signPictureUrl
          this.receiveToBase64()
        }
      }
    },
    /**
     * 渲染完毕接收图片
     * @param {String} filePath
     */
    renderFinish (filePath) {
      let file = []
    	this.filePath = filePath
      if (this.filePath) {
        console.log('filePath22', this.filePath)
        file.push({name: 'signFile', uri: this.filePath})
        this.upload(file, 'render')
      } 
    	console.log("filePath", filePath)
    },
    // 跳转至服务项维护
    jumpServices () {
      uni.navigateTo({
        url: `../e-service/transfer?flightServiceId=${this.serviceData.id}`
      })
    },
    judgeEditStatus () {
      if (this.serviceData.flightServiceDetails && this.serviceData.flightServiceDetails.length !== 0) {
        return this.serviceData.status !== '3' && this.flightDetail.flightStatus !=='DEP'
      }
      return false
    },
    formatTaskStatus (status) {
    	console.log('TaskStatu', status)
    	if (status === '1') {
    		return '待确认'
    	} else if (status === '2') {
    		return '受服务方确认'
    	} else if (status === '3') {
    		return '已完成'
    	}
    },
    // 计算时长
    computedHour (item) {
      if (item.actualEndTime || item.actualUpdateEndTime) {
        let diff = moment(item.actualUpdateEndTime || item.actualEndTime).diff(moment(item.actualUpdateBeginTime || item.actualBeginTime), 'minutes')
        console.log(diff)
        return diff + '分'
      }
      return '---'
    },
    // 转化时间/日期
    formatDate (date, format = 'HH:mm') {
      if (date) {
        return moment(date).format(format)
      }
      return ''
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
    // 通过航班的id获取服务单信息
    getDetail (flag) {
      this.flightDetail = getApp().globalData.flightDetail
      let carrier = this.flightDetail.iataCarrier
      if (this.remoteDic.BASE_AIRLINE.length > 0) {
        let match = this.remoteDic.BASE_AIRLINE.find(item => item.iatacode === carrier)
        if (match) {
          this.carrierCn = match.cnname
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
              this.serviveSignText = this.serviceData.operatorSign
              if (flag === 'messageJump') {
                this.receiveServiceSignature = 'data:image/jpg;base64,' + this.serviceData.signPictureUrl
                console.log(this.receiveServiceSignature)
                // this.receiveToBase64()
              }
            }
          } else {
            this.$message(res.message)
          }
        }).catch(() => {
          this.$message('无法发起')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        })
      }
    },
    getImg (imgSrc) {
      this.receiveServiceSignature = imgSrc
      this.receiveToBase64()
    },
    // 提交签名的方法，有哪一方签名就提交哪一方
    async submit () {
      let file = []
      let serviceAuth = uni.getStorageSync('serviceAuth')
      if (!serviceAuth) {
        this.serviveSignText = '经办人-' + this.user.userName
        this.serviceData.status = '3'
        this.domId = '#poster'
      } else {
        if (this.receiveServiceSignature) {
          let imgPath = await base64ToPath(this.receiveServiceSignature, '.jpeg');
          file.push({name: 'signFile', uri: imgPath})
        }
        if (!this.receiveServiceSignature) {
          this.$message('请先签名！')
          return
        }
        this.upload(file)
      }
      // let file = [
      //   {name: 'serviceSignFile', uri: this.signaturePicture},
      //   {name: 'receiveServiceSignFile', uri: this.receiveServiceSignature}
      // ]
      
    },
    // 上传 base64全部转临时路径
    upload (file, flag) {
      this.$loading('提交中')
      let url = apiConfig.url
      if (getApp().globalData.ignoreSvn) {
        url = apiConfig.puductUrl
      }
      let operateType = ''
      if (uni.getStorageSync('serviceAuth') === '0') {
        operateType = '0'
      } else {
        operateType = '1'
        if (this.storeServiceData.length === 1 && this.storeServiceData[0].status === '1') {
          operateType = '2'
        }
      }
      uni.uploadFile({
          url: url + '/api/gms/flightService/sign',
          files: file,
          header: {
          	Authorization: uni.getStorageSync('access_token')
          },
          formData: {
              'id': this.serviceData.id,
              operateType: operateType,
              operatorSign: this.serviveSignText
          },
          complete: (uploadFileRes) => {
            let data = JSON.parse(uploadFileRes.data)
            if (data.status) {
              if (flag && flag === 'render') {
                this.receiveServiceSignature = this.filePath
              }
              this.getDetail('reflash')
            }
            this.$message(data.message)
            uni.hideLoading()
          }
      })
    },
    // 点击服务方区域
    serviceImg () {
      if (this.serviceData.status === '3') {
        return
      }
    },
    // 点击营运人区域
    operatorImg () {
      if (this.serviceData.status === '3') {
        return
      }
      let serviceAuth = uni.getStorageSync('serviceAuth')
      if (serviceAuth !== '0' && this.serviceData.status === 2) {
        return
      }
      this.imgSrcFlag = 'operator'
      // #ifdef APP-PLUS
      plus.screen.lockOrientation('landscape-primary')
      // #endif
      setTimeout(() => {
        uni.navigateTo({
          url: '../e-service/sign'
        })
      }, 100)
    },
    rowClick (index) {
      this.currentIndex = index
    },
    edit () {
      if (this.currentIndex === null) {
        this.$message('请选择一项')
        return
      }
      let data = this.serviceData.flightServiceDetails[this.currentIndex]
      this.$refs.timeModal.add(data)
    }
  }
}
</script>

<style lang="scss">
.confirm {
  width: 400rpx;
  margin: 0 auto;
  margin-top: 20rpx;
  button {
  }
}
.btn-flex {
  display: flex;
  margin: 40rpx 0;
}
.e-service {
  // margin: 20rpx;
  // padding-top: 20rpx;
}
.service-layout {
  background: #0081ff;
  padding: 20rpx;
  border-radius: 20rpx;
  .sign {
    margin-top: 20rpx;
    background: #ffffff;
    display: flex;
    height: 300rpx;
    .signItem {
      width: 50%;
      &.operator {
        border-right: 2rpx dashed #000000;
      }
      .sign-image {
        position: relative;
        .notSigned {
          font-size: 36rpx;
          color: #007aff;
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          &.Confirm {
            color: #000000;
            width: 100%;
            text-align: center;
          }
        }
        image {
          height: calc(100% - 10rpx);
          width: 100%;
        }
        height: calc(100% - 80rpx);
      }
      .sign-label {
        height: 80rpx;
        line-height: 100rpx;
        padding-left: 30rpx;
      }
    }
  }
  .table {
    background: #ffffff;
    margin-top: 20rpx;
    border-radius: 10rpx;
    padding: 20rpx 10rpx 10rpx 10rpx;
    .edit-btn {
      // text-align: right;
      display: flex;
      justify-content: space-around;
      
    }
    .edit {
      background: #aaaa00;
    }
    .table-contend {
      min-height: 280rpx;
      overflow-y: auto;
      .table-item {
        display: flex;
        justify-content: space-between;
        line-height: 40rpx;
        border-radius: 10rpx;
        .service-start, .service-end{
          text-align: center;
        }
        .item {
          overflow-x: auto;
          white-space: nowrap;
          font-size: 20rpx;
          width: 40%;
          &.item-value {
            width: 20%;
            text-align: center;
          }
        }
      }
    }
    .table-head {
      display: flex;
      justify-content: space-between;
      font-size: 20rpx;
      border: 2rpx solid #000;
      border-left: none;
      border-right: none;
      .table-head-item {
        width: 40%;
        padding: 10rpx 0;
        &.item-label {
          width: 20%;
          text-align: center;
        }
      }
    }
  }
  .bottom {
    // height: 50rpx;
    background: #ffffff;
    border: none;
    border-bottom: 4rpx dashed #000;
    position: relative;
    bottom: 40rpx;
  }
  .center {
    background: #ffffff;
    padding: 20rpx 40rpx;
    // height: 210rpx;
    .center-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #000000;
      text-align: center;
    }
    .taskStatus {
    	line-height: 74rpx;
    	color: #ffffff;
    	border-radius: 7rpx;
    	min-width: 180rpx;
    	height: 74rpx;
    	text-align: center;
    	font-size: 34rpx;
    	$status: ('1': red,
    		'2': #f37b1d,
    		'3': green);
    	@each $key,
    	$value in $status {
    		&.taskStatus-#{$key} {
    			background: $value;
    		}
    	}
    }
    .center-msg {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      line-height: 80rpx;
    }
  }
  .top {
    background: #ffffff;
    border-top-left-radius: 5rpx;
    border-top-right-radius: 5rpx;
    .top-title {
      display: flex;
      justify-content: space-between;
      padding: 30rpx;
      image {
        width: 300rpx;
        height: 100rpx;
      }
      .line {
        border: 10rpx solid #000000;
        border-bottom: none;
        height: 40rpx;
        width: 40rpx;
        &.left {
          border-right: none;
        }
        &.right {
          border-left: none;
        }
      }
    }
  }
}
</style>
