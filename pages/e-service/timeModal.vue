<template>
  <view class="FlipClock">
    <tui-datetime ref="dateTime" :unitTop="false" :type="1" cancelColor="#555" color="#e41f19" :setDateTime="setDateTime" @confirm="timeChange"></tui-datetime>
    <u-modal v-model="isShowModal" :negative-top="150" z-index="100" :show-cancel-button="false" :show-confirm-button="false" :show-title="false">
      <view class="title">
        {{taskData.serviceItemDescription || ''}}
      </view>
      <view class="contend">
        <view class="label">
          开始时间
        </view>
        <view class="" @click="show('start')">
          <Flipper ref="flipperHourStart1" />
          <Flipper ref="flipperHourStart2" />
          <view class="colon">:</view>
          <Flipper ref="flipperMinuteStart1" />
          <Flipper ref="flipperMinuteStart2" />
          <!-- <view class="colon">:</view>
          <Flipper ref="flipperSecondStart1" />
          <Flipper ref="flipperSecondStart2" /> -->
        </view>
        <view class="label">
          结束时间
        </view>
        <view class="" @click="show('end')">
          <Flipper ref="flipperHourEnd1" />
          <Flipper ref="flipperHourEnd2" />
          <view class="colon">:</view>
          <Flipper ref="flipperMinuteEnd1" />
          <Flipper ref="flipperMinuteEnd2" />
        </view>
      </view>
      <view class="btn">
        <button type="primary" class="cancal" @tap="cancal">取消</button>
        <button type="primary" class="edit" @tap="edit">修改</button>
      </view>
    </u-modal>
  </view>
</template>

<script>
  import {postService} from '@/api/sign/index.js'
  import moment from 'moment'
  import tuiDatetime from '@/components/thorui/tui-datetime/tui-datetime.vue'
  import Flipper from '@/components/Flipper'
  export default {
    components: {
      Flipper, tuiDatetime
    },
    name: 'FlipClock',
    data () {
      return {
        taskData: {},
        flag: 'start',
        setDateTime: '',
        isShowModal: false,
        setStartTime: '',
        setEndTime: '',
        flipObjsStart: [],
        flipObjsEnd: [],
        setEndDate: '',
        setStartDate: '',
        setEndDateTime: '',
        setStartDateTime: ''
      }
    },
    created () {
    },
    mounted () {
      // this.run()
    },
    methods: {
      edit () {
        console.log(this.setStartTime, this.setEndTime)
        let isHaveSecond = (time) => {
          return time.length === 5 ? ':00' : ''
        }
        let startTime = moment().format(`${this.setStartDate} ${this.setStartTime}${isHaveSecond(this.setStartTime)}`)
        let endTime = moment().format(`${this.setEndDate} ${this.setEndTime}${isHaveSecond(this.setEndTime)}`)
        console.log(123, startTime, endTime)
        let isAfter = moment(endTime).isAfter(moment(startTime))
        console.log('isAfter', isAfter)
        if (!isAfter) {
          this.$message('结束时间不得小于开始时间')
          return
        }
        this.taskData.actualUpdateBeginTime = startTime
        this.taskData.actualUpdateEndTime = endTime
        postService(this.taskData).then(res => {
          if (res.status) {
            this.$message(res.message)
            this.$emit('flashTask')
          } else {
            this.$message(res.message)
          }
          this.isShowModal = false
        })
        
      },
      cancal () {
        this.isShowModal = false
      },
      formatTime (time) {
        let reg = new RegExp(':', 'g')
        let dateTime = time.replace(reg, '')
        // let timeArray = dateTime.split(' ')
        // console.log('timeArray', timeArray)
        return dateTime
      },
      timeChange (e) {
        console.log(222, e.result)
        let dateTime = e.result.split(' ')[1] + ':00'
        let newTime = this.formatTime(dateTime)
        let oldTime = ''
        if (this.flag === 'start') {
          oldTime = this.formatTime(this.setStartTime)
          for (let i = 0; i < this.flipObjsStart.length; i++) {
            if (oldTime[i] === newTime[i]) {
              continue
            }
            this.flipObjsStart[i].flipDown(
              oldTime[i],
              newTime[i]
            )
          }
          this.setStartDate = e.result.split(' ')[0]
          this.setStartTime = dateTime
        } else {
          oldTime = this.formatTime(this.setEndTime)
          for (let i = 0; i < this.flipObjsEnd.length; i++) {
            if (oldTime[i] === newTime[i]) {
              continue
            }
            this.flipObjsEnd[i].flipDown(
              oldTime[i],
              newTime[i]
            )
          }
          this.setEndTime = dateTime
          this.setEndDate = e.result.split(' ')[0]
        }
      },
      show (flag) {
        this.flag = flag
        if (flag === 'start') {
          this.setDateTime = this.setStartDateTime
        } else {
          this.setDateTime = this.setEndDateTime
        }
        this.$refs.dateTime.show()
      },
      // 初始化数字
      init () {
        let startTime = this.formatTime(this.setStartTime)
        console.log('startTime', startTime)
        for (let i = 0; i < this.flipObjsStart.length; i++) {
         this.flipObjsStart[i].setFront(startTime[i])
        }
        let endTime = this.formatTime(this.setEndTime)
        for (let i = 0; i < this.flipObjsEnd.length; i++) {
         this.flipObjsEnd[i].setFront(endTime[i])
        }
      },
      add (data) {
        this.taskData = {...data}
        this.isShowModal = true
        this.setStartTime = moment(data.actualUpdateBeginTime || data.actualBeginTime).format('HH:mm')
        this.setStartDate = moment(data.actualUpdateBeginTime || data.actualBeginTime).format('YYYY-MM-DD')
        this.setStartDateTime = moment(data.actualUpdateBeginTime || data.actualBeginTime).format('YYYY-MM-DD HH:mm')
        if (data.actualEndTime || data.actualUpdateEndTime) {
          this.setEndTime = moment(data.actualUpdateEndTime || data.actualEndTime).format('HH:mm')
          this.setEndDate = moment(data.actualUpdateEndTime || data.actualEndTime).format('YYYY-MM-DD')
          this.setEndDateTime = moment(data.actualUpdateEndTime || data.actualEndTime).format('YYYY-MM-DD HH:mm')
        } else {
          this.setEndTime = moment().format('HH:mm')
          this.setEndDate = moment().format('YYYY-MM-DD')
          this.setEndDateTime = moment(data.actualUpdateEndTime || data.actualEndTime).format('YYYY-MM-DD HH:mm')
        }
        this.$nextTick(() => {
          this.flipObjsStart = [
            this.$refs.flipperHourStart1,
            this.$refs.flipperHourStart2,
            this.$refs.flipperMinuteStart1,
            this.$refs.flipperMinuteStart2
          ]
          this.flipObjsEnd = [
            this.$refs.flipperHourEnd1,
            this.$refs.flipperHourEnd2,
            this.$refs.flipperMinuteEnd1,
            this.$refs.flipperMinuteEnd2
          ]
          this.init()
        })
      }
    }
  }
</script>

<style lang="scss">
  .btn {
    height: 170rpx;
    line-height: 200rpx;
    display: flex;
    justify-content: space-between;
    button {
     height: 80rpx;
     width: 300rpx;
     line-height: 80rpx;
     margin: 40rpx 30rpx;
     font-size: 34rpx;
    }
    .cancal {
      background: #808080;
    }
    .edit {
      background: #aaaa00;
    }
  }
  .label {
    line-height: 90rpx;
    text-align: left;
    margin-left: 40rpx;
  }
  .title {
    height: 70rpx;
    background: #2979FF;
    line-height: 70rpx;
    color: #FFFFFF;
  }
  .FlipClock {
    text-align: center;
  }
  .FlipClock .M-Flipper {
    margin: 0 6rpx;
  }
  .FlipClock .colon {
    display: inline-block;
    line-height: 120rpx;
    font-size: 100rpx;
    font-style: normal;
    vertical-align: top;
  }
</style>

