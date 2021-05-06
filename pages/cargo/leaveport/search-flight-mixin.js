import {
	getFlights,
	searchContainersByFlight,
	onError
} from '@/api/cargo/index.js'
import { validatenull } from '@/common/util/validate.js'
import dayjs from '@/common/util/dayjs.min.js'
export default {
	data () {
		return {
			placeHolder: '请输入集装器号'
		}
	},
	
	methods: {
		changeSearchBarStatus (placeHolder) {
			let oldPlaceHolder = this.placeHolder
			if (!validatenull(placeHolder)) {
				this.placeHolder = placeHolder
			}
			if (oldPlaceHolder === this.placeHolder) {
				this.showSearchBar = !this.showSearchBar
			}
		},
		
		searchFlight (flight, flag = true) {
			// 测试有没有英文
			let regWord = new RegExp(/[a-zA-Z]/g)
			let result = regWord.test(flight)
			if (result) {
				// 如果有输入的航班有字母
				this.flightBackup = flight
				this.selectFlight(flight)
			} else {
				// 如果输入的航班没有字母，通过接口搜索完整的航班号（承运人加数字航班号）
				let searchForm = {
					flight: flight,
					origin: 'XMN',
					flightDate: dayjs().format('YYYY-MM-DD') + ' 00:00:00'
				}
        if (flag) {
          this.$loading()
        }
				
				getFlights(searchForm).then(res => {
					console.log('getFlights-res', res)
					if (res.status && !validatenull(res.data)) {
						let flights = [...new Set(res.data)]
						if (flights.length === 1) {
							searchForm.flight = flights[0]
							this.flightBackup = flights[0]
							this.selectFlight(flights[0])
						} else if (flights.length > 1){
							this.$refs.flightSelectionDialog.open(flights)
						} else {
							this.$message('无此航班')
						}
					} else {
						this.$message(res.message)
					}
					// uni.hideLoading()
				}).catch(err => {
					onError(err)
				})
			}
		},
		
		// 在输入纯数字航班号的情况下弹出航班选择提示框
		selectFlight (flight) {
			if (flight.indexOf('9C') === 0 || flight.indexOf('AQ') === 0) {
				uni.hideLoading()
				this.$message(`航司${flight}被过滤，不可查询`)
			} else {
				// uni.hideLoading()
				this.flightBackup = flight
				this.searchContainersByFlight(flight)
			}
		},
		
		// 通过航班号查询该航班的所有集装器
		searchContainersByFlight (flight) {
			this.$loading()
			searchContainersByFlight({
				flight: flight,
				operationType: this.cargoInfoForm.operationType
			}).then(res => {
				console.log('searchContainersByFlight-res', res)
				if (res.status && !validatenull(res.data)) {
					this.initList(res, false)
				} else {
					this.$message(res.message)
				}
				uni.hideLoading()
			}).catch(err => {
				onError(err)
			})
		}
	}
}