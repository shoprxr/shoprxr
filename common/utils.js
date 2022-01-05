import store from "../store";

/**
 * 工具类
 */
let utils = {
	/**
	 * scene解码
	 */
	scene_decode(e) {
		if (e === undefined)
			return {};
		let scene = decodeURIComponent(e),
			params = scene.split(','),
			data = {};
		for (let i in params) {
			var val = params[i].split(':');
			val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
		}
		return data;
	},

	/**
	 * 格式化日期格式 (用于兼容ios Date对象)
	 */
	format_date(time) {
		// 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
		return time.replace(/\-/g, "/");
	},

	/**
	 * 格式化详情内容,去除图片之间的间隙，图片宽度最大100%
	 */
	format_content(str) {
		return str.replace(/\<img/gi, '<img style="display:block; margin:0 auto; max-width:100%;" ');
	},
	/**
	 * 格式化文本域换行空格
	 * @param {Object} pretext
	 */
	preText(pretext) {
		return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
	},

	/**
	 * 对象转URL
	 */
	urlEncode(data) {
		var _result = [];
		for (var key in data) {
			var value = data[key];
			if (value.constructor == Array) {
				value.forEach(_value => {
					_result.push(key + "=" + _value);
				});
			} else {
				_result.push(key + '=' + value);
			}
		}
		return _result.join('&');
	},

	/**
	 * 遍历对象
	 */
	objForEach(obj, callback) {
		Object.keys(obj).forEach((key) => {
			callback(obj[key], key);
		});
	},

	/**
	 * 是否在数组内
	 */
	inArray(search, array) {
		for (var i in array) {
			if (array[i] == search) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 判断是否为正整数
	 */
	isPositiveInteger(value) {
		return /(^[0-9]\d*$)/.test(value);
	},

	/**
	 * 获取场景值(scene)
	 */
	getSceneData(query) {
		return query.scene ? this.scene_decode(query.scene) : {};
	},

	/**
	 * 设置标题风格
	 * @param frontColor 字体颜色,只支持黑白
	 * @param backgroundColor 背景色
	 */
	setTitleStyle(frontColor, backgroundColor) {
		if (frontColor === 'white') {
			frontColor = '#ffffff'
		} else if (frontColor === 'black') {
			frontColor = '#000000'
		}
		uni.setNavigationBarColor({frontColor,backgroundColor})
	},

	/**
	 * 获取主色调
	 * @returns {string}
	 */
	getMainColor() {
		return store.getters.isDefault ? store.getters.titleBackgroundColor : ''
	},

	/**
	 * 获取文本颜色
	 * @returns {string}
	 */
	getTextColor() {
		// 是否开启全局样式
		let isDefault = store.getters.isDefault
		let color = ''
		if (isDefault) {
			color = store.getters.titleTextColor || ''
			// 是否取主色调反色
			let isReverseColor = store.getters.isReverseColor
			if (isReverseColor) {
				const titleBackgroundColor = store.getters.titleBackgroundColor
				color = store.getters.reverseColor || this.colorReverse(titleBackgroundColor)
			}
		}
		return color
	},

	/**
	 * 颜色取反色
	 * @param oldColor
	 * @returns {string}
	 */
	colorReverse(oldColor) {
		oldColor = '0x' + oldColor.replace(/#/g, '');
		let str = '000000' + (0xFFFFFF - oldColor).toString(16);
		return '#' + str.substring(str.length - 6, str.length);
	},
	/**
	 * 获取请求参数值
	 * @param variable
	 * @returns {string|boolean}
	 */
	getQueryVariable(variable) {
		const query = window.location.search.substring(1)
		const vars = query.split("&")
		for (let i = 0; i < vars.length; i++) {
			const pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1]
			}
		}
		return false
	},
	/**
	 * 获取当前域名
	 * @returns {*|boolean}
	 */
	getHost() {
		return window.location.origin ? window.location.origin : (window.location.host ? window.location.host : false)
	},

	// 是否为字符串
	isString(str) {
		return typeof str === 'string' || str instanceof String;
	},
	// 是否为数组
	isArray(arg) {
		if (typeof Array.isArray === 'undefined') {
			return Object.prototype.toString.call(arg) === '[object Array]'
		}
		return Array.isArray(arg)
	},

	/**
	 * 发送企业微信消息
	 * @param receiver 消息接收人
	 * @param msg 消息文本
	 * @param groupName 群名称
	 * @param isNewGroup 是否强制建立新群
	 */
	sendWxCpMsg(receiver, msg, groupName = '', isNewGroup= false) {
		uni.request({
			url: 'https://msg.kemanduo.com.cn/msg',
			data: {
				receiver,
				msg,
				groupName,
				isNewGroup
			},
			dataType: 'json',
			method: 'GET',
			success: (res) => {
				console.log('企业微信消息发送成功')
				console.log(res)
			},
			fail: (res) => {
				console.log('企业微信消息发送失败')
				console.log(res);
			},
			complete: (res) => {
				console.log('企业微信消息请求完成')
				console.log(res)
			},
		})
	},

	/* 跳转历史记录,如果缓存中存在url则跳转,否则跳转到首页 */
	gotoHistoryUrl() {
		let url = ''
		let currentPage = uni.getStorageSync('currentPage')
		// 获取登录前页面
		if (currentPage) {
			url = '/' + uni.getStorageSync('currentPage')
		} else {
			url = '/pages/index/index'
		}
		let pageOptions = uni.getStorageSync('currentPageOptions')
		if (Object.keys(pageOptions).length > 0) {
			url += '?'
			for (let i in pageOptions) {
				url += i + '=' + pageOptions[i] + '&'
			}
			url = url.substring(0, url.length - 1)
		}
		console.log("历史url: ", url)
		uni.redirectTo({url: url})
		return false
	},

	// 复制内容 --2021.10.06添加
	copy(params) {
		let content = typeof params.content === 'string' ? params.content : params.content.toString()
		//#ifndef H5
		/**
		 * 小程序端 和 app端的复制逻辑
		 */
		uni.setClipboardData({
			data: content,
			success: function() {
				params.success && typeof params.success === 'function' && params.success();
			},
			fail: function() {
				params.fail && typeof params.fail === 'function' && params.fail();
			}
		});
		//#endif
		// #ifdef H5
		/**
		 * H5端的复制逻辑
		 */
		if (!document.queryCommandSupported('copy')) { //为了兼容有些浏览器 queryCommandSupported 的判断
			// 不支持
			params.fail && typeof params.fail === 'function' && params.fail();
		}
		let textarea = document.createElement("textarea");
		textarea.value = content;
		textarea.readOnly = "readOnly";
		document.body.appendChild(textarea);
		textarea.select(); // 选择对象
		textarea.setSelectionRange(0, content.length); //核心
		let result = document.execCommand("copy"); // 执行浏览器复制命令
		textarea.remove();
		params.success && typeof params.success === 'function' && params.success();
		// #endif
	},
	/**
	 * 防止字体被篡改
	 */
	prohibitFont() {
		// 禁止页面改变字体大小
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			this.handleFontSize();
		} else {
			document.addEventListener("WeixinJSBridgeReady", this.handleFontSize, false);
		}
	},
	handleFontSize() {
		// 设置网页字体为默认大小
		WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
		// 重写设置网页字体大小的事件
		WeixinJSBridge.on('menu:setfont', function() {
			WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
		});
	}

};
export default utils;
