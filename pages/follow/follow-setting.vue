<template>
  <view class="follow-setting">
    
    <view class="type-label">预警开关</view>
    <view class="setting-warn warning">
      <view class="label">预警提示</view>
      <view class="value">
        <switch :checked="warnChecked" @change="warningChange" />
      </view>
    </view>
    
    <view class="type-label">事件订阅</view>
    <view class="setting-warn" v-for="(item, index) in statusArray" :key="index">
      <view class="label">{{item.label}}</view>
      <view class="value">
        <switch :checked="item.isChecked" :disabled="!warnChecked" @change="statusChange(item, $event)" />
      </view>
    </view>
    <view class="setting-submit">
      <u-button type="primary" @tap="submit">确认</u-button>
    </view>
  </view>
</template>

<script>
import {setFollowNode, getFollowNode} from "@/api/follow/index.js"
export default {
  data () {
    return {
      followNodeId: '',
      warnChecked: false,
      statusArray: [
        {label: '值机关闭', code: 'CKC', isChecked: false},
        {label: '催促登机', code: 'BDF', isChecked: false},
        {label: '允许登机', code: 'BDP', isChecked: false},
        {label: '正在值机', code: 'CKI', isChecked: false},
        {label: '登机', code: 'BDO', isChecked: false},
        {label: '登机结束', code: 'BDC', isChecked: false},
        {label: '起飞', code: 'DEP', isChecked: false},
        {label: '途中', code: 'ENR', isChecked: false},
        {label: '到达', code: 'ARR', isChecked: false}
      ]
    }
  },
  onLoad () {
    // 获取关注配置
    let userId = uni.getStorageSync('user_id')
    let that = this
    getFollowNode({userId}).then(res => {
      console.log('get111', res.data[0])
      console.log('get222', res.data.length)
      if (res.data.length) {
        that.assignmentFollow(res.data[0])
      }
    })
  },
  mounted () {
    // let options = { cover: false, sound: 'system', title: 'ACDM' }
    // let content = '航班号：SC8131航班状态变更为【即将出港】，请注意!'
    // plus.push.createMessage( content, 'followFlight', options )
    // uni.vibrate({}) // 震动
  },
  methods: {
    // 查询完或者修改完 赋值操作
    assignmentFollow (data) {
      this.warnChecked = data.switchFlag ? true : false
      this.followNodeId = data.id
      if (!data.nodeContent) return 
      let nodeContent = data.nodeContent.split(',')
      this.statusArray.forEach(item => {
        let match = nodeContent.find(node => node === item.code)
        if (match) item.isChecked = true
      })
    },
    // 提交
    submit () {
      this.$loading()
      console.log('followNodeId2', this.followNodeId)
      console.log('warnChecked', this.warnChecked)
      let mapCheckNode = this.statusArray.filter(node => node.isChecked)
      if (mapCheckNode) {
        mapCheckNode = mapCheckNode.map(node => node.code)
      }
      let para = {
        id: this.followNodeId,
        userId: uni.getStorageSync('user_id'),
        nodeType: 'FLIGHT_STATUS',
        nodeContent: mapCheckNode.length ? mapCheckNode.join(',') : '',
        switchFlag: this.warnChecked ? 1 : 0
      }
      console.log('para', para)
      setFollowNode(para).then(res => {
        if (res.status) {
          uni.hideLoading()
          this.assignmentFollow(res.data)
          this.$message(res.message)
        }
      }).catch(err => {
        console.log('err', err)
        uni.hideLoading()
      })
    },
    // 预警开关
    warningChange (e) {
      this.warnChecked = e.detail.value
      console.log('e', e)
    },
    // 航班状态开关
    statusChange (item, e) {
      item.isChecked = e.detail.value
      console.log('item', item)
      console.log('statusArray', this.statusArray)
    }
  }
}
</script>

<style lang="scss">
.follow-setting {
  .type-label {
    margin: 10rpx;
    color: #7a7a7a;
  }
  .setting-submit {
    margin: 100rpx auto;
    width: 50%;
  }
  .setting-warn {
    padding: 10rpx;
    background: #FFFFFF;
    &.warning {
      // margin-bottom: 50rpx;
    }
    .label {
      font-size: 36rpx;
    }
    display: flex;
    justify-content: space-between;
  }
}
</style>
