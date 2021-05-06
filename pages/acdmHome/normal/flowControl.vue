<template>
  <view class="fail" v-if="bottomLoadFail"><fail @reloadData="getData()"></fail></view>
  <view class="limit-layout" v-else>
    <view class="limit-sub">
      <u-subsection :list="list" @change="change" inactive-color="#000" active-color="#fff" bg-color="#fff" button-color="#1890ff" :current="current"></u-subsection>
    </view>
    <view class="contend">
      <u-read-more :toggle="true" ref="uReadMore" show-height="500"><rich-text :nodes="text"></rich-text></u-read-more>
    </view>
  </view>
</template>

<script>
import { getFlowControl } from '@/api/home/normal/index.js'
import fail from '@/components/fail/index.vue'
export default {
  components: { fail },
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
      bottomLoadFail: false,
      list: [
        {
          name: '出港限制信息'
        },
        {
          name: '进港限制信息'
        }
      ],
      text: '',
      current: 0,
      chartData: {},
      showChart: false,
      timer: null,
      message: '加载中'
    }
  },
  computed: {},
  deactivated () {
    this.cleanTimer()
  },
  beforeDestroy () {
    this.cleanTimer()
  },
  methods: {
    change (index) {
      this.current = index
      this.getData()
    },
    getData () {
      this.cleanTimer()
      let para = {
        airportCode: [this.airportCode],
        direction: this.current ? 'A' : 'D'
      }
      getFlowControl(para)
        .then(res => {
          if (res.status) {
            this.bottomLoadFail = false
            this.text = ''
            this.chartData = res.data.flowControls
            this.chartData.forEach(item => {
              let num = item.name.indexOf(':')
              if (num === -1) {
                num = item.name.indexOf('：')
              }
              if (num !== -1) {
                this.text =
                  this.text +
                  `<div><span style="color: rgb(24, 144, 255)">${item.name.substring(0, num + 1)}</span>
                             <span>${item.name.substring(num + 1)}</span></div>`
              } else {
                this.text = this.text + `<div>${item.name}</div>`
              }
            })
            this.$nextTick(() => {
              this.$refs.uReadMore.init()
            })
            // if (!this.timer) {
            //   this.timer = setInterval(() => {
            //     this.getData()
            //   }, (this.indexParams.timer.FlowList || 60) * 1000)
            // }
          }
        })
        .catch(e => {
          this.bottomLoadFail = true
          this.timer && clearInterval(this.timer)
          this.timer = null
        })
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
.limit-layout {
  .contend {
    margin-top: 30rpx;
  }
}
</style>
