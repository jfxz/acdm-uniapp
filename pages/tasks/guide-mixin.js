import { validatenull } from '@/common/util/validate.js'
import {
  updateDeviceUsageLog,
  getAllUsageLog,
  getAllWorkItem,
  updateWorkItem,
  removeImage,
  detailWorkItem,
  onError,
  getRole,
  getUsername,
  guideUrl,
  guideSvnUrl,
  changeBindDevice,
  sendToDispatcher,
  sendToDriver,
  getAllOutfieldWorkItemsByFlightId
} from '@/api/guide/index.js'
import dayjs from '@/common/util/dayjs.min.js'
export default {
  data () {
    return {
      bgNum: 0,
      smNum: 0,
      testSrc: 'data:image/png;base64,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'
    }
  },
  
  mounted () {
    this.justTest()
  },
  
  methods: {
    justTest () {
      // uni.showModal({
      //   title: 'test1',
      //   content: 'text2',
      //   icon: 'none'
      // })
    },
    
    // 为所有任务赋予工作项目
    insertWorkItemsToTask () {
    	this.tasksAllList.forEach(task => {
    		this.getAllWorkItem(task)
    	})
    },
    
    // 更新设备使用记录,司机角色在工作项目的开始和完成调用
    updateDeviceUsageLog (task, workItem, operationType) {
    	if (!validatenull(task.devices) && !validatenull(workItem.meta)) {
        let userName = uni.getStorageSync('user_name_sub')
        let userId = uni.getStorageSync('user_id')
    		this.$loading()
    		updateDeviceUsageLog({
          driverName: userName,
          driverId: userId,
    			flightTaskId: task.id,
    			flightId: task.flightId,
    			deviceId: task.devices[0].id,
    			workItemId: workItem.id,
    			operationType: operationType
    		}).then(res => {
    			console.log('updateDeviceUsageLog', res)
    			let taskObj = this.tasksAllList.find(e => e.id === task.id)
    			if (taskObj) {
    				this.getAllWorkItem(taskObj)
    			}
    			this.$message(res.message)
    			uni.hideLoading()
    		}).catch(err => {
    			onError(err)
    		})
    	}
    },
    
    // 删除图片
    removeImage (task, image) {
      console.log('image', image) 
    	let {workItemId, oriUrl:url} = image
    	this.$loading()
    	removeImage({
    		workItemId: workItemId,
    		imageUrl: url
    	}).then(res => {
    		console.log('removeImage', res)
    		if (res.status) {
    			let taskIdx = this.tasksAllList.findIndex(e => e.id === task.id)
    			let imageIdx = task.images.findIndex(img => img.oriUrl === url)
    			if (imageIdx > -1) {
    				task.images.splice(imageIdx, 1)
    			}
    			if (taskIdx > -1) {
    				this.tasksAllList.splice(taskIdx, 1, task)
    			}
    		}
    		this.$message(res.message)
    		uni.hideLoading()
    	}).catch(err => {
    		onError(err)
    	})
    },
    
    // 预览图片
    showImage (image) {
      // console.log('image', JSON.stringify(image))
      return
    	uni.previewImage({
    		urls: [image.url]
    	})
    },
    
    // 上传图片
    chooseImage (task, workItem) {
    	var that = this
    	uni.chooseImage({
    		success: function(res) {
    			let url = getApp().globalData.ignoreSvn ? guideSvnUrl : guideUrl
          console.log('chooseImage', getApp().globalData.ignoreSvn, url)
    			let promiseArr = []
    			that.uploadImage(url, task, workItem.id, res.tempFilePaths, 0, res.tempFilePaths.length)
    			let resultArr = Promise.all(promiseArr)
    			console.log('resultArr', resultArr)
    		}
    	})
    },
    
    // 递归上传图片。因为异步上传图片会导致只有一张图片被上传成功
    uploadImage (url, task, workItemId, imgUrls, idx, end) {
      var that = this
      if (idx < end) {
        uni.uploadFile({
          url: url + '/api/gms/workItem?workItemId=' + workItemId,
          filePath: imgUrls[idx],
          name: 'file',
          header: {
            Authorization: uni.getStorageSync('access_token')
          },
          complete: (res) => {
            console.log('upload', url, res)
            if (res.statusCode !== 200) {
              that.$message('图片上传失败')
            }
            that.uploadImage(url, task, workItemId, imgUrls, idx + 1, end)
          }
        })
      } else {
        // 所有图片上传成功后重新刷新该任务的工作事务以刷新图片
        setTimeout(function () {
          that.getAllWorkItem(task)
        }, 500)
      }
    },
    
    updateWorkItem (task, workItem) {
    	updateWorkItem({
    		workItemId: workItem.id
    	}).then(res => {
    		console.log('workItem', res)
    		if (res.status) {
    			this.getAllWorkItem(task)
    		}
    		this.$message(res.message)
    		uni.hideLoading()
    	}).catch(err => {
    		onError(err)
    	})
      if (workItem.workItemCode === 'DBigCarCheck'
        ||workItem.workItemCode === 'DSmallCarCheck') {
        this.sendToDriver(task, workItem)
      }
    },
    
    // 得到该任务的所有工作项目
    getAllWorkItem (task) {
      var that = this
    	console.log('timer-task', task.flightDTO.flight + task.flightId, dayjs().format('HH:mm:ss'))
    	getAllWorkItem({
    		flightTaskId: task.id,
    		flightId: task.flightId
    	}).then(res => {
    		console.log('timer-getAllWorkItem', res, dayjs().format('HH:mm:ss'))
    		if (res.status && !validatenull(res.data)) {
    			let arr = []
    			let workItems = res.data
          let atype = workItems.find(e => this.workItemType(e.workItemCode) === 'car')
          console.log('task.workItems-atype', atype)
          if (atype) {
            console.log('task.workItems-isdriver', task.isDriver)
            task.isDriver = true
          }
          let initReturnVal = this.initWorkItems(task, workItems)
          arr = initReturnVal.arr
    			task.workItems = initReturnVal.workItems
          
    			if (arr.length > 0) {
    				let result = Promise.allSettled(arr.map(e => e()))
    				console.log('after-result')
    				result.then(res => {
    					console.log('result', res)
    					if (res.status) {
    						this.getAllWorkItem(task)
                return
    					}
    				})
    			} else {
    				// 外场机下核对工作项目
            task.workItems.forEach(e => {
              if (this.workItemType(e.workItemCode) === 'photo' && e.picBase64 && !validatenull(e.picBase64)) {
                let imgUrls = e.picBase64
                if (imgUrls) {
                  let picUrls = e.picUrls.split(',')
                  // task.images = [imgUrls]
                  task.images = imgUrls.map((url, index) => {
                    return {
                      index: index,
                      workItemId: e.id,
                      oriUrl: picUrls[index],
                      url: 'data:image/png;base64,' + url
                    }
                  })
                  e['images'] = task.images
                  // task.images = [task.images[0]]
                }
              }
            })
    				// let standCheck = task.workItems.find(e => this.workItemType(e.workItemCode) === 'photo')
    				// if (standCheck && standCheck.picBase64 && !validatenull(standCheck.picBase64)) {
        //       let imgUrls = standCheck.picBase64
        //       if (imgUrls) {
        //         let picUrls = standCheck.picUrls.split(',')
        //         // task.images = [imgUrls]
        //         task.images = imgUrls.map((url, index) => {
        //           return {
        //             index: index,
        //             workItemId: standCheck.id,
        //             oriUrl: picUrls[index],
        //             url: 'data:image/png;base64,' + url
        //           }
        //         })
        //         // task.images = [task.images[0]]
        //       }
    					
    				// }
    			}
          // 按照工作项目优先级排序,升序
          task.workItems.sort((a, b) => a.priority - b.priority)
          
          
          
          if (task.workItems.find(e => e.workItemCode.indexOf('Inner') !== -1)) {
            if (task.status === '5' || task.status === '6') {
              task.workItems.push({
                id: 'callCar',
                flag: true,
                workItemCode: 'callCar'
              })
            } else {
              // task.workItems.push({
              //   id: 'callCar',
              //   flag: false,
              //   workItemCode: 'callCar'
              // })
            }
            
            task.workItems.push({
              flag: true,
              id: 'line',
              workItemCode: 'line'
            })
          }
          
          task.workItems.sort((a, b) => {
            if (a.priority && b.priority) {
              return a.priority - b.priority
            } else {
              return -1
            }
          })
          
          if ((task.status === '5' || task.status === '6') && task.workItems.find(e => e.workItemCode.indexOf('Inner') !== -1)) {
            // 如果该用户为内场
            this.getAllOutfieldWorkItemsByFlightId(task)
          }
          
          console.log('task.workItems', task.workItems)
          
          let taskIdx = this.tasksAllList.findIndex(e => e.id === task.id)
          if (taskIdx > -1) {
          	this.tasksAllList.splice(taskIdx, 1, task)
            // this.showif = false
            // setTimeout(function () {
            //   that.showif = true
            //   console.log('that.tasksAllList', that.tasksAllList)
            // }, 100)
            // this.$forceUpdate()
          }
    		}
        uni.hideLoading()
        this.$message(res.message)
    	}).catch(err => {
    		onError(err)
    	})
    },
    
    initWorkItems (task, workItems, innerCheckOutfield = false) {
      let arr = []
      workItems.forEach(e => {
        e.flag = false
        // e.innerCheckOutfield = innerCheckOutfield
        if (this.workItemType(e.workItemCode) !== 'car' && !validatenull(e.meta)) {
          // 如果该工作项不属于摆渡车类型且车辆信息不为空
          if (task.status === '5' || task.status === '6') {
            e.flag = true
          }
          // 初始化该工作项的车辆信息
          try {
            let obj = JSON.parse(e.meta)
            if (obj) {
              e.driverName = obj.driverName
              e.driverId = obj.driverId
              e.carId = obj.deviceId
              e.carNumber = obj.deviceCode
              e.carType = obj.deviceType
              e.carStatus = obj.carStatus
            }
          } catch (err) {
            console.log('err', err)
          }
        } else if (this.workItemType(e.workItemCode) !== 'carCheck' && this.workItemType(e.workItemCode) !== 'car') {
          if ((task.status === '5' || task.status === '6')) {
            e.flag = true
          }
        }
      })
      return {
        workItems: workItems,
        arr: arr
      }
    },
    
    // 车辆是否到达机位,且当前任务为外场任务
    judgeCompleteStand (task, status) {
    	if (!status) {
    		return false
    	}
    	if (status.indexOf('到达') !== -1 && status.indexOf('机位') !== -1 && !task.workItems.find(e => e.workItemCode.indexOf('Inner') !== -1)) {
    		return true
    	}
    	return false
    },
    
    // 判断该工作项目是不是外场机下车辆核对
    judgeOut (code) {
    	if (code === 'DBigCarCheck' || code === 'DSmallCarCheck') {
    		return true
    	}
    	return false
    },
    
    // 得到工作项目的类型
    workItemType (workItemCode) {
    	switch (workItemCode) {
    		case 'DSmallCarToGate':
    		case 'DSmallCarToStand':
    		case 'DBigCarToGate':
    		case 'DBigCarToStand':
        case 'ASmallCarToGate':
        case 'ASmallCarToStand':
        case 'ABigCarToGate':
        case 'ABigCarToStand':
    			return 'car'
    		case 'DBigCarCheck':
    		case 'DSmallCarCheck':
    		case 'DInnerBigCarCheck':
    		case 'DInnerSmallCarCheck':
    			return 'carCheck'
    		case 'DStandOutfieldCheck':
        case 'AStandOutfieldCheck':
    			return 'photo'
    		case 'DGateInfieldCheck':
    		case 'DGateOutfieldCheck':
    			return 'gateCheck'
    		default: 
    			return workItemCode
    	}
    },
    
    checkGuideFlights () {
      uni.navigateTo({
        url: `/pages/tasks/monitor-flight`
      })
    },
    
    // TODO
    getAllOutfieldWorkItemsByFlightId (task) {
      let flightObj = task.flightDTO
      getAllOutfieldWorkItemsByFlightId({
        flightId: flightObj.id
      }).then(res => {
        console.log('getAllOutfieldWorkItemsByFlightId-res', res)
        if (res.status) {
          let workItemsObj = res.data
          let workItems = []
          let index = 0
          for (let key in workItemsObj) {
            let arr = []
            arr.push({
              id: 'user' + index,
              flag: true,
              username: key,
              workItemCode: 'username'
            })
            let sortedArr = workItemsObj[key]
            sortedArr.sort((a, b) => {
              if (a.priority && b.priority) {
                return a.priority - b.priority
              } else {
                return -1
              }
            })
            arr = [...arr, ...sortedArr]
            // workItems = [...workItems, ...workItemsObj[key]]
            let standCheck = arr.find(e => this.workItemType(e.workItemCode) === 'photo')
            let images = []
            if (standCheck && standCheck.picBase64 && !validatenull(standCheck.picBase64)) {
              let imgUrls = standCheck.picBase64
              if (imgUrls) {
                images = imgUrls.map((url, index) => {
                  return {
                    index: index,
                    workItemId: standCheck.id,
                    url: 'data:image/png;base64,' + url
                  }
                })
                arr.push({
                  id: 'photos' + index,
                  flag: true,
                  images: images,
                  workItemCode: 'photos'
                })
              }
            }
            workItems = [...workItems, ...arr]
            index++
          }
          let {workItems:workItems2} = this.initWorkItems(task, workItems, true)
          workItems2.forEach(e => {
            e.forbidden = true
            if (e.workItemCode === 'username') {
              e.flag = true
            }
          })
          console.log('after-process', workItems2)
          task.workItems = [...task.workItems, ...workItems2]
          console.log('after-process2', task)
          this.$forceUpdate()
        }
        uni.hideLoading()
      }).catch(err => {
        onError(err)
      })
    },
    
    setBgNum (task, val) {
      let result =  task.bgNum + val
      task.bgNum = result > 0 ? result : 0
    },
    
    setSmNum (task, val) {
      let result =  task.smNum + val
      task.smNum = result > 0 ? result : 0
    },
    
    // 内场向特车发送需要的大摆渡车数和小摆渡车数
    sendToDispatcher (task) {
      sendToDispatcher({
        bgCarNum: task.bgNum + '',
        smCarNum: task.smNum + ''
      }).then(res => {
        console.log('sendToDispatcher-res', res)
        if (res.status) {
        }
        this.$message(res.message)
        uni.hideLoading()
      }).catch(err => {
        onError(err)
      })
    },
    
    // 外场向特车发送车辆确认成功消息
    sendToDriver (task, workItem) {
      let flightObj = task.flightDTO
      let flight = flightObj.iataCarrier + flightObj.flight
      if (!workItem.meta) {
        return
      }
      try {
        let metaObj = JSON.parse(workItem.meta)
        let username = metaObj.driverName ? metaObj.driverName : ''
        let userId = metaObj.driverId ? metaObj.driverId : ''
        sendToDriver({
          username: username,
          userId: userId,
          flight: flight,
          registration: flightObj.registration
        }).then(res => {
          console.log('sendToDriver-res', res)
          if (res.status) {
          }
          // this.$message(res.message)
          uni.hideLoading()
        }).catch(err => {
          onError(err)
        })
      } catch (err) {
        console.log('err', err)
      }
    }
  }
}