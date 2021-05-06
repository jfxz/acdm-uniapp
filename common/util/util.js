import {
	validatenull
} from './validate'
import {
	SYSTEM_MSG_TYPE
} from '../dic.js'
// 左移动画
export const cartoon = function(that) {
	let _this = that
	_this.animationData = {}
	var animation = uni.createAnimation({
		duration: 500,
		timingFunction: 'ease',
	})
	_this.animation = animation
	setTimeout(function() {
		animation.translateX(-720).step()
		_this.animationData = animation.export()
	}.bind(_this), 100)
}
/**
 * @desc 函数防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 */
export function debounce(func, wait = 300) {
	let timeout = null
	return function() {
		let context = this
		let args = arguments
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			func.apply(context, args)
		}, wait)
	}
}
export function sortCompare(prop) {
	return function(obj1, obj2) {
		var val1 = obj1[prop]
		var val2 = obj2[prop]
		if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
			val1 = Number(val1)
			val2 = Number(val2)
		}
		if (val1 < val2) {
			return -1
		} else if (val1 > val2) {
			return 1
		} else {
			return 0
		}
	}
}
/* 模7校验规则 */
export const model7 = function(wbPrefix, value) {
	if (wbPrefix === 'YJ' || wbPrefix === 'DYJ' || wbPrefix === 'RYJ' || wbPrefix === 'RTN' ||
		wbPrefix === '000' || wbPrefix === 'DDD') {
		return true
	}
	if (Number(value.substring(0, 7) % 7) === Number(value[value.length - 1])) {
		return true
	}
	return false
}
/**
 * 设置浏览器头部标题
 */
export const setTitle = function(title) {
	title = title ? `${title}——ACDM 协同决策系统` : 'ACDM 协同决策系统'
	window.document.title = title
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
	if (fullscreenEnable()) {
		exitFullScreen()
	} else {
		reqFullScreen()
	}
}

/**
 * 监听全屏和退出全屏事件
 */
export const listenfullscreen = (callback) => {
	function listen() {
		callback()
	}
	document.addEventListener('fullscreenchange', function(e) {
		listen()
	})
	document.addEventListener('mozfullscreenchange', function(e) {
		listen()
	})
	document.addEventListener('webkitfullscreenchange', function(e) {
		listen()
	})
	document.addEventListener('msfullscreenchange', function(e) {
		listen()
	})
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
	// var isFullscreen = document.fullscreenEnabled ||
	//   window.fullScreen ||
	//   document.mozFullscreenEnabled ||
	//   document.webkitIsFullScreen
	// return isFullscreen
	return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
	if (document.documentElement.requestFullScreen) {
		document.documentElement.requestFullScreen()
	} else if (document.documentElement.webkitRequestFullScreen) {
		document.documentElement.webkitRequestFullScreen()
	} else if (document.documentElement.mozRequestFullScreen) {
		document.documentElement.mozRequestFullScreen()
	}
}
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
	if (document.documentElement.requestFullScreen) {
		document.exitFullScreen()
	} else if (document.documentElement.webkitRequestFullScreen) {
		document.webkitCancelFullScreen()
	} else if (document.documentElement.mozRequestFullScreen) {
		document.mozCancelFullScreen()
	}
}
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
	for (let i = 0; i < menu.length; i++) {
		if (menu[i].children.length !== 0) {
			for (let j = 0; j < menu[i].children.length; j++) {
				if (menu[i].children[j].id === id) {
					return menu[i]
				} else {
					if (menu[i].children[j].children.length !== 0) {
						return findParent(menu[i].children[j].children, id)
					}
				}
			}
		}
	}
	return null
}

/**
 * 总体路由处理器
 */
export const resolveUrlPath = (url, tabName) => {
	if (!url) {
		throw new Error('url 为空，无法进行解析！')
	}
	let reqUrl = url
	if (url.startsWith('http')) {
		reqUrl = `/iframe?src=${reqUrl}`
	} else {
		reqUrl = `${reqUrl}`
	}
	return reqUrl
}
/**
 * 动态插入css
 */

export const loadStyle = url => {
	const link = document.createElement('link')
	link.type = 'text/css'
	link.rel = 'stylesheet'
	link.href = url
	const head = document.getElementsByTagName('head')[0]
	head.appendChild(link)
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
	for (let i = 0; i < dic.length; i++) {
		if (dic[i].value === value) {
			return i
		}
	}
	return -1
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len = 4, date) => {
	let random = ''
	random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len)
	if (date) random = random + Date.now()
	return random
}

// 深拷贝
export const deepCopy = (o) => {
	if (o instanceof Function) {
		return o
	} else if (o instanceof Array) {
		var array = []
		for (var i = 0; i < o.length; ++i) {
			array[i] = deepCopy(o[i])
		}
		return array
	} else if (o instanceof Date) {
		return new Date(o.valueOf())
	} else if (o instanceof Object) {
		var obj = {}
		for (var j in o) {
			obj[j] = deepCopy(o[j])
		}
		return obj
	} else {
		return o
	}
}
// 适配后端的分页从0开始, 并只传输pageNumber和 pageSize
export const adjustPage = (pager) => {
	let page = {}
	page.pageSize = pager.pageSize || 10
	page.pageNumber = (pager.pageNumber > 0 ? pager.pageNumber - 1 : pager.pageNumber) || 0
	return page
}
// 忽略空字符串或者null的属性
export const ignoreNull = (filter) => {
	if (!filter) {
		return null
	}
	let notNullFilter = {}
	for (let key in filter) {
		if (!validatenull(filter[key])) {
			notNullFilter[key] = filter[key]
		}
	}
	return notNullFilter
}
// 补充字符串内的占位符
export const fillStringPlaceholder = (content, params = {}) => {
	if (validatenull(content)) {
		return content
	}
	let str = content
	let pattern = /(\{[a-zA-Z0-9]*\})/g
	let matchArray = str.match(pattern) || []
	matchArray.forEach(item => {
		let key = item.substring(1, item.length - 1)
		str = str.replace(item, (validatenull(params[key]) ? '' : params[key]))
	})
	return str
}
// 剔除已经映射到url上的参数
export const removePlaceholderParam = (content, params = {}) => {
	if (validatenull(content) || validatenull(params)) {
		return
	}
	let str = content
	let pattern = /(\{[a-zA-Z0-9]*\})/g
	let matchArray = str.match(pattern) || []
	matchArray.forEach(item => {
		let key = item.substring(1, item.length - 1)
		delete params[key]
	})
}

// 生成随机字符串
export const uuid = (len, radix) => {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	var uuid = []
	var i
	radix = radix || chars.length

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
	} else {
		// rfc4122, version 4 form
		var r

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
		uuid[14] = '4'

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16
				uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
			}
		}
	}

	return uuid.join('')
}

// 返回元素顶部
export const elment2Top = (el) => {
	if (!el) {
		return
	}
	let scrollTimer = setInterval(() => {
		let scrollTop = el.scrollTop - 10
		if (scrollTop > 0) {
			el.scrollTo(el.scrollLeft, scrollTop)
		} else {
			el.scrollTo(el.scrollLeft, 0)
			clearInterval(scrollTimer)
			scrollTimer = null
		}
	}, 1)
}

// 递归查询对象
export const deepFindObject = ({
	objectArray = [],
	key,
	value,
	childKey
}) => {
	for (let obj of objectArray) {
		if (obj[key] === value) {
			return obj
		}
		if (childKey && !validatenull(obj[childKey])) {
			let childResult = deepFindObject({
				objectArray: obj[childKey],
				key,
				value,
				childKey
			})
			if (childResult) {
				return childResult
			}
		}
	}
	return null
}

// 团队开发时候路径修改成本地url
export const replaceLocalUrlPrefx = (controls) => {
	controls.forEach(item => {
		item.uri = replaceUrlPrefix(item.uri)
	})
}
// 简单判断字符串是不是json
export const isJsonString = (str) => {
	try {
		if (typeof JSON.parse(str) === 'object') {
			return true
		}
	} catch (e) {}
	return false
}
// 判断字符串是否为空
export const isEmpty = (data) => {
	// 存在，且不为空字符串
	if (data && data != '') {
		// 不为空
		return false
	}
	// 为空
	return true
}

// 判断是否为空
export const isEmptyNum = (data) => {
	// 存在，且不为空字符串, 或data 为 0, 或data 为 '0'
	if (data && data != '' || data === 0 || data === '0') {
		// 不为空
		return false
	}
	// 为空
	return true
}

// 查找对象是否在数组中
export const objInArray = (obj, array) => {
	let key = false
	for (let i in array) {
		if (obj.id === array[i].id) {
			key = true
			break
		}
	}
	return key
}
// 从数组中查找某对象
export const findObjInArray = (id, array) => {
	for (let i in array) {
		if (id === array[i].id) {
			return array[i]
		}
	}
	return null
}
// 从数据中获取某对象的位置
export const findObjIndexInArray = (id, array) => {
	for (let i in array) {
		if (id === array[i].id) {
			return i
		}
	}
	return -1
}
/**
 * ip转字符串，如果complete为true，则补0
 * @param {*} complete
 */
export const ip2String = (ip, complete = true) => {
	if (!ip) {
		return ''
	}
	let completeZoro = (str) => {
		if (str.length < 3 && complete) {
			str = '0' + str
			return completeZoro(str)
		}
		return str
	}
	let array = ip.split('.')
	array = array.map(item => {
		return completeZoro(item)
	})
	return array.join('')
}
// 匹配重要消息中的解散群消息
export const isDisbanGroupMsg = msg => {
	const regOne = /解散/
	const regTwo = /加入/
	const regThree = /退出/
	const regFour = /订阅号/
	if (regOne.test(msg)) {
		return SYSTEM_MSG_TYPE.DISSOLVED
	} else if (regTwo.test(msg)) {
		return SYSTEM_MSG_TYPE.JOIN
	} else if (regThree.test(msg)) {
		return SYSTEM_MSG_TYPE.EXIT
	} else if (regFour.test(msg)) {
		return SYSTEM_MSG_TYPE.SUBSCRIP
	}
	// return reg.test(msg)
}
