import {getUserInfo} from '../../api/user/index.js'
export default {
  data() {
    return {}
  },
  onLoad() {
    // this.judgeToken()
  },
  methods: {
    judgeToken() {
      let token = uni.getStorageSync('access_token')
      console.log('token', token)
      if (token) {
        this.$store.dispatch('GetUserRole').then(res => {
          this.getAllDic()
        })
        // new Promise((resolve, reject) => {
        //   getUserInfo().then(res => {
        //     if (res.status) {
        //        this.getAllDic()
        //     }
        //   })
        // })
      } else {
        uni.hideLoading()
        // uni.navigateTo({
        // 	url: `../login/index`
        // })
      }
    },
    getAllDic() {
      let array = [
        new Promise(resolve => {
          this.$store.dispatch('GetBaseAirport').then(() => {
            resolve()
          })
        }),
        new Promise(resolve => {
          this.$store.dispatch('GetDirection').then(() => {
            resolve()
          })
        }),
        new Promise(resolve => {
          this.$store.dispatch('GetBaseAirline').then(() => {
            resolve()
          })
        }),
        new Promise(resolve => {
          this.$store.dispatch('GetFlightTask').then(() => {
            resolve()
          })
        }),
        new Promise(resolve => {
          this.$store.dispatch('GetAgent').then(() => {
            resolve()
          })
        }),
        new Promise(resolve => {
          this.$store.dispatch('GetBaseAirport').then(() => {
            resolve()
          })
        }),
        // new Promise(resolve => {
        //   this.$store.dispatch('GetFlightStatus').then(() => {
        //     resolve()
        //   })
        // }),
        new Promise(resolve => {
          this.$store.dispatch('GetIrrCode').then(() => {
            resolve()
          })
        }),
        new Promise(resolve => {
          this.$store.dispatch('GetVipCode').then(() => {
            resolve()
          })
        }),
        // new Promise(resolve => {
        //   this.$store.dispatch('GetSeason').then(() => {
        //     resolve()
        //   })
        // })
      ]
      return new Promise(resolve => {
        Promise.all(array).then(results => {
          uni.hideLoading()
          uni.switchTab({
            url: '../home/index'
          })
          resolve(results)
        })
        // uni.hideLoading()
      })
    }
  }
}
