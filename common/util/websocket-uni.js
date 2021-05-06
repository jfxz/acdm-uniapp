(function() {
	uni.webSocketBackup = WebSocket;
	WebSocket = function(uri) {
		this.uri = uri;
		// console.log('uri', uri)
		uni.connectSocket({
			url: uri
		});
		this.eventMap = {};
		var that = this;
		uni.onSocketOpen(function(res) {
			console.log('WebSocket连接已打开', res)
			if (that.eventMap.hasOwnProperty('open')) {
				that.eventMap['open']();
			} else {
				that.onopen();
			}
		});
		uni.onSocketMessage(function(res) {
			// console.log('uni:: ws message:: ', res);
			if (that.eventMap.hasOwnProperty('message')) {
				that.eventMap['message'](res);
			} else {
				that.onmessage(res);
			}
		});
		uni.onSocketClose(function () {
		    console.log('uni:: ws close');
		    if (that.eventMap.hasOwnProperty('close')) {
		        that.eventMap['close']();
		    } else {
		        that.onclose();
		    }
		});
		uni.onSocketError(function(res) {
			console.log('uni:: ws error', res);
			if (that.eventMap.hasOwnProperty('error')) {
				that.eventMap['error'](res);
			} else {
				that.onerror(res);
			}
		});
	};

	var event = {};

	WebSocket.prototype = {
		addEventListener: function(event, callback) {
			this.eventMap[event] = callback;
		},
		onopen: function() {
			console.log('onopen')
		},
		onmessage: function(res) {
			console.log('onmessage')
		},
		onclose: function() {
			console.log('onclose')
		},
		onerror: function(res) {
			console.log('onerror')
		},
		close: function() {
			console.log('close')
		},
		send: function(data) {
			uni.sendSocketMessage({
				data: data
			});
		}
	};

	if (typeof exports !== "undefined" && exports !== null) {
		exports.WebSocket = WebSocket;
	}

}).call(this);
