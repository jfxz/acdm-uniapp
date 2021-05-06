/*
*  界面名称: 服务项穿梭框
*  界面功能: 添加、删除已选服务项
*  其他      原创组件（ps:实在找不到可参考的组件）
*  时间      2021-2-7 09:36:24
*  作者      zql
*/
<template>
  <view class="transfer-layout">
    <view class="transfer-item">
      <!-- 头部 -->
      <view class="transfer-item-header">
        <view class="checkAll">
            <u-checkbox 
              @change="checkAllWaitChange" 
              v-model="isCheckAllWait" 
              name="checkAll">
            全选</u-checkbox>
        </view>
        <view class="leftLabel">
          待选服务项
        </view>
        <view class="rightLabel">
          <text>{{computeWaitSelect}}</text>
          <text>/</text>
          <text>{{computeWaitCount}}</text>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="search">
        <view class="search-bar-box">
        	<icon class="icon-search-in-box" type="search" :size="18"></icon>
        	<input class="search-bar-input" placeholder="请输入搜索关键词" 
          placeholder-class="phcolor" v-model="seachValue"/>
        	<icon class="icon-clear-in-box" type="clear" :size="18" v-if="inputShowed" @tap="clearInput"></icon>
          <u-button @tap="searchWait" type="primary">搜索</u-button>
        </view>
      </view>
      <!-- 多选内容 -->
      <view class="check-contend">
        <u-checkbox-group @change="checkboxGroupWaitChange" :wrap="true">
          <u-checkbox 
            v-model="item.checked" 
            v-for="(item, index) in showWaitList" :key="index" 
            :name="item.id"
          >{{item.description}}</u-checkbox>
        </u-checkbox-group>
      </view>
    </view>
    
    <view class="move">
      <u-icon @tap="add" name="arrow-down-fill" size="80" hover-class="iconHover"></u-icon>
      <u-icon @tap="remove" name="arrow-up-fill" size="80" hover-class="iconHover"></u-icon>
    </view>
    
    <view class="transfer-item">
      <!-- 头部 -->
      <view class="transfer-item-header">
        <view class="checkAll">
            <u-checkbox 
              @change="checkAllSelectedChange" 
              v-model="isCheckAllSelected" 
              name="checkAll">
            全选</u-checkbox>
        </view>
        <view class="leftLabel">
          已选服务项
        </view>
        <view class="rightLabel">
          <text>{{computeSelected}}</text>
          <text>/</text>
          <text>{{computeSelectedCount}}</text>
        </view>
      </view>
      <!-- 搜索 -->
      <view class="search">
        <view class="search-bar-box">
        	<icon class="icon-search-in-box" type="search" :size="18"></icon>
        	<input class="search-bar-input" placeholder="请输入搜索关键词" 
          placeholder-class="phcolor" v-model="seachSelectedValue"/>
        	<icon class="icon-clear-in-box" type="clear" :size="18" v-if="inputSelectedShowed" @tap="clearSelectedInput"></icon>
          <u-button @tap="searchSelectd" type="primary">搜索</u-button>
        </view>
      </view>
      <!-- 多选内容 -->
      <view class="check-contend">
        <u-checkbox-group @change="checkboxGroupSelectedChange" :wrap="true">
          <u-checkbox 
            v-model="item.checked" 
            v-for="(item, index) in showSelectedList" :key="index" 
            :name="item.id"
          >{{item.description}}</u-checkbox>
        </u-checkbox-group>
      </view>
    </view>
    
  </view>
</template>

<script>
import {getAllService, addService, delService} from '@/api/sign/index.js'
export default {
  props: {
  },
  data () {
    return {
      addList: [],
      delList: [],
      flightServiceId: '',
      waitList: [],
      showWaitList: [],
      seachValue: '',
      inputShowed: false,
      isCheckAllWait: false,
      selectedList: [],
      showSelectedList: [],
      seachSelectedValue: '',
      inputSelectedShowed: false,
      isCheckAllSelected: false
    }
  },
  watch: {
    // 清空按钮显示判断
    seachValue (val) {
      if (val) {
        this.inputShowed = true
      } else {
        this.inputShowed = false
      }
    },
    seachSelectedValue (val) {
      if (val) {
        this.inputSelectedShowed = true
      } else {
        this.inputSelectedShowed = false
      }
    }
  },
  computed: {
    // 待服务选中
    computeWaitSelect () {
      if (this.waitList.length > 0) {
        return this.waitList.filter(item => item.checked).length
      }
      return 0
    },
    // 待服务总数
    computeWaitCount () {
      return this.showWaitList.length
    },
    // 已选择服务选中
    computeSelected () {
      if (this.selectedList.length > 0) {
        return this.selectedList.filter(item => item.checked).length
      }
      return 0
    },
    // 已选择服务总数
    computeSelectedCount () {
      return this.showSelectedList.length
    }
  },
  onLoad (e) {
    this.showSelectedList = []
    this.showWaitList = []
    this.selectedList = getApp().globalData.flightServiceDetails
    console.log('flightServiceDetails', getApp().globalData.flightServiceDetails)
    this.flightServiceId = e.flightServiceId
    if (this.selectedList.length > 0) {
      this.selectedList = this.selectedList.map(item => {
        return {
          id: item.serviceItemId,
          id2: item.id,
          description: item.serviceItemDescription,
          routine: item.serviceItemType
        }
      })
    }
    getAllService({flightServiceId: e.flightServiceId}).then(res => {
      if (this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          let matchIndex = res.data.findIndex(item2 => item2.id === item.id)
          if (matchIndex >= 0) {
            res.data.splice(matchIndex, 1)
          }
        })
      }
      this.searchSelectd()
      this.waitList = res.data
      console.log('waitList', this.waitList)
      this.showWaitList = JSON.parse(JSON.stringify(this.waitList)) // 深拷贝
    })
  },
  methods: {
    searchWait () {
      if (this.seachValue) {
        this.showWaitList = this.waitList.filter(item => item.description.indexOf(this.seachValue) !== -1)
      } else {
        this.showWaitList = JSON.parse(JSON.stringify(this.waitList)) // 深拷贝
      }
    },
    searchSelectd () {
      console.log('selectedList', this.selectedList)
      if (this.seachSelectedValue) {
        this.showSelectedList = this.selectedList.filter(item => item.description.indexOf(this.seachSelectedValue) !== -1)
      } else {
        this.showSelectedList = JSON.parse(JSON.stringify(this.selectedList)) // 深拷贝
      }
    },
    // 添加到已服务
    add () {
      let para = {
        flightServiceId: this.flightServiceId,
        serviceItemParams: this.addList
      }
      addService(para).then(res => {
        if (res.status) {
          this.showWaitList.forEach(item => {
            if (item.checked) {
              let match = this.selectedList ? this.selectedList.find(i => i.id === item.id) : false
              if (!match) {
                let matchIndex = this.waitList.findIndex(i => i.id === item.id)
                if (matchIndex >= 0) {
                  this.waitList.splice(matchIndex, 1)
                }
                item.checked = false
                this.selectedList.push(item)
              }
            }
          })
          this.searchSelectd()
          this.searchWait()
        }
        this.$message(res.message)
        setTimeout(() => {
          uni.navigateBack({delta: 1})
        }, 1000)
      })
    },
    // 删除已选服务
    remove () {
      this.showSelectedList.forEach(item => {
        if (item.checked) {
          let match = this.waitList ? this.waitList.find(i => i.id === item.id) : false
          if (!match) {
            let matchIndex = this.selectedList.findIndex(i => i.id === item.id)
            if (matchIndex >= 0) {
              delService({id: this.selectedList[matchIndex].id2}).then(res => {
                if (res.status) {
                  this.selectedList.splice(matchIndex, 1)
                  item.checked = false
                  this.waitList.push(item)
                }
                this.$message(res.message)
              })
            }
          }
        }
      })
      this.searchSelectd()
      this.searchWait()
      setTimeout(() => {
        uni.navigateBack({delta: 1})
      }, 1000)
    },
    // 待服务选择
    checkboxGroupWaitChange (e) {
      let checkArray = []
      this.waitList.forEach(item => {
        if (e.includes(item.id)) {
          checkArray = e.map(item2 => {
            return {
              serviceItemId: item2,
              routine: item.routine === '1'
            }
          })
          this.$set(item, 'checked', true)
        } else {
          this.$set(item, 'checked', false)
        }
      })
      this.addList = checkArray
      console.log('checkArray', checkArray)
    },
    // 已选择服务选择
    checkboxGroupSelectedChange (e) {
      this.selectedList.forEach(item => {
        if (e.includes(item.id)) {
          this.$set(item, 'checked', true)
        } else {
          this.$set(item, 'checked', false)
        }
      })
      this.delList = e
    },
    // 清空
    clearInput () {
      this.seachValue = ''
      this.showWaitList = JSON.parse(JSON.stringify(this.waitList)) // 深拷贝
    },
    // 已选择清空
    clearSelectedInput () {
      this.seachSelectedValue = ''
      this.showSelectedList = JSON.parse(JSON.stringify(this.selectedList)) // 深拷贝
    },
    // 全选
    checkAllWaitChange (e) {
      this.waitList.forEach(item => {
        let match = this.showWaitList.find(i => i.id === item.id)
        if (match) {
          this.$set(item, 'checked', e.value)
        }
      })
      this.searchWait()
      console.log('e', e)
    },
    // 已选择全选
    checkAllSelectedChange (e) {
      this.selectedList.forEach(item => {
        let match = this.showSelectedList.find(i => i.id === item.id)
        if (match) {
          item.checked = e.value
        }
      })
      console.log('e', e)
    }
  }
}
</script>

<style lang="scss">
  .transfer-layout {
    .move {
      text-align: center;
      .iconHover {
        color: #007AFF;
      }
    }
    .transfer-item {
      width: 100%;
      // height: 500rpx;
      border: 2rpx solid #24292E;
    }
    .check-contend {
      padding: 0 20rpx;
      height: 500rpx;
      overflow-y: auto;
    }
    .transfer-item-header {
      display: flex;
      justify-content: space-between;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      background: #d3d3d3;
      padding: 0 20rpx;
    }
    .search-bar-box {
    	display: flex;
    	align-items: center;
    	position: relative;
    	padding-left: 20rpx;
    	padding-right: 20rpx;
    	height: 85rpx;
    	z-index: 1;
    }
    .icon-clear-in-box {
      position: absolute;
      top: 23rpx;
      right: 180rpx;
    }
    .icon-search-in-box {
      position: absolute;
      top: 23rpx;
      left: 30rpx;
    }
    .search-bar-input {
      height: 72rpx;
    	line-height: 72rpx;
    	width: 100%;
    	padding-left: 60rpx;
    	font-size: 28rpx;
    	color: #ffffff;
    	background: #616161;
      border-radius: 30rpx;
      margin-right: 10rpx;
    }
    .search {
      margin-top: 10rpx;
    }
    .phcolor {
    	font-size: 32rpx;
      color: #b1b1b1;
    }
  }
</style>
