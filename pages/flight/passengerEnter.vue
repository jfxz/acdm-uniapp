<template>
	<view class="passenger-enter">
    <view class="head-flight">
      <view class="image">
        <image src="../../static/plan_blue.png"></image>
      </view>
      
      <view class="flight">
        <text>{{formatFlight()}}</text>
      </view>
      <view style="width: 75rpx;">
      </view>
    </view>
    <view class="route">
      <text style="margin-left: 20rpx;">航线：{{formatFlightRoute()}}</text>
    </view>
    <view class="form-contend">
      <u-form :model="form" ref="uForm" label-width="250" :label-style="{'font-size': '30rpx', 'font-weight': 'bold'}">
        <u-form-item label="成人人数" prop="adult">
          <u-input v-model="form.adult" placeholder="请输入成人人数" type="number"/>
        </u-form-item>
        <u-form-item label="儿童人数" prop="child">
          <u-input v-model="form.child" placeholder="请输入儿童人数" type="number"/>
        </u-form-item>
        <u-form-item label="婴儿人数" prop="infant">
          <u-input v-model="form.infant" placeholder="请输入婴儿人数" type="number"/>
        </u-form-item>
        <u-form-item label="货物重量(KG)" prop="cargo">
          <u-input v-model="form.cargo" placeholder="请输入货物重量" type="number"/>
        </u-form-item>
        <u-form-item label="邮件重量(KG)" prop="post">
          <u-input v-model="form.post" placeholder="请输入邮件重量" type="number"/>
        </u-form-item>
      </u-form>
    </view>
    <view class="opt">
      <u-button type="primary" @tap="reset">重置</u-button>
      <u-button type="success" @tap="submit">提交</u-button>
    </view>
	</view>
</template>

<script>
	import {editSouthern} from "@/api/flight/index.js"
	export default {
		data() {
			return {
        passengerFlightMsg: {},
        form: {
          adult: 0,
          child: 0,
          infant: 0,
          cargo: 0,
          post: 0
        }
			}
		},
		mounted() {
      this.reset()
      this.passengerFlightMsg = getApp().globalData.passengerFlightMsg
      this.form = {...this.passengerFlightMsg.flightLoad}
      console.log('passengerFlightMsg', this.passengerFlightMsg)
		},
		methods: {
      // 重置
      reset () {
        this.$refs['uForm'] && this.$refs['uForm'].resetFields()
      },
      // 提交
      submit () {
        this.$loading('提交中')
        Object.entries(this.form).forEach(([key, value]) => {
          if (!this.form[key] || Number(value) < 0) {
            this.form[key] = 0
          }
        })
        let para = {
          opDate: this.passengerFlightMsg.opdate,
          iataCarrier: this.passengerFlightMsg.iataCarrier,
          flight: this.passengerFlightMsg.flight,
          icaoOrigin: this.passengerFlightMsg.origin,
          icaoDestination: this.passengerFlightMsg.destination
        }
        editSouthern({...this.form, ...para}).then(res => {
          if (res.status) {
            this.$message(res.message)
          } else {
            this.$message(res.message)
          }
          uni.hideLoading()
        }).catch(err => {
          uni.hideLoading()
          this.$message(err.data.message)
        })
      },
      // 航班显示
      formatFlight () {
      	if (this.passengerFlightMsg) {
      		if (this.passengerFlightMsg.iataCarrier && this.passengerFlightMsg.flight) {
      			return this.passengerFlightMsg.iataCarrier + this.passengerFlightMsg.flight
      		} else {
      			return '----'
      		}
      	} else {
      		return '----'
      	}
      },
      // 航线显示
      formatFlightRoute () {
        if (this.passengerFlightMsg) {
        	if (this.passengerFlightMsg.flightRouteCn) {
        		return this.passengerFlightMsg.flightRouteCn
        	} else if (this.passengerFlightMsg.originCn || this.passengerFlightMsg.destinationCn) {
        		return this.passengerFlightMsg.originCn || '--' + ' - ' + this.passengerFlightMsg.destinationCn || '--'
        	} else {
        		return '----'
        	}
        } else {
        	return '----'
        }
      }
		}
	}
</script>

<style lang="scss">
  .passenger-enter {
    padding: 10rpx;
    .opt {
      margin-top: 30rpx;
      display: flex;
      justify-content: space-between;
    }
    .form-contend {
      padding: 0 10rpx;
    }
    .route {
    	border-radius: 0;
    	background: #09BB07;
    	color: #FFFFFF;
    	padding: 10rpx 0;
    	height: 60rpx;
    	font-size: 28rpx;
    }
    .head-flight {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: #FFFFFF;
      height: 140rpx;
      align-items: center;
      border-radius: 14rpx 14rpx 0 0;
      .flight {
        width: 440rpx;
        text-align: center;
        font-size: 58rpx;
        font-weight: bold;
      }
      .image {
        image {
          width: 75rpx;
          height: 71rpx;
          position: relative;
          left: 70rpx;
        }
      }
    }
  }
</style>
