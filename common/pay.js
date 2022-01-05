/*
 * 支付
 */
export const pay = (result, self, success, fail) => {
	if (result.code === -10) {
		self.showError(result.msg);
		return false;
	}

	// 发起微信支付
	if (result.data.pay_type == 20) {
		//小程序支付
		// #ifdef  MP-WEIXIN	
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: result.data.payment.timeStamp,
			nonceStr: result.data.payment.nonceStr,
			package: 'prepay_id=' + result.data.payment.prepay_id,
			signType: 'MD5',
			paySign: result.data.payment.paySign,
			success: res => {
				paySuccess(result, self, success);
			},
			fail: res => {
				self.showError('订单未支付成功', () => {
					payError(result, fail);
				});
			},
		});
		// #endif
		//公众号支付
		// #ifdef  H5
		if(self.isWeixn()){
			WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(result.data.payment),
				function(res) {
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						paySuccess(result, self, success);
					} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						self.showSuccess('支付取消', () => {
							payError(result, fail);
						});
					} else {
						self.showError('订单未支付成功', () => {
							payError(result, fail);
						});
					}
				}
			);
		}else{
			//h5支付
			uni.navigateTo({
			    url: '/main/pages/order/pay-h5/pay-h5?order_id='+result.data.order_id,
			});
			return ;
		}
		// #endif
	}
	// 余额支付
	if (result.data.pay_type == 10||result.data.pay_type == 30) {
		paySuccess(result, self, success);
	}
	
	if (result.data.pay_type == 50) {
		window.location.href= result.data.payment;
	}
}

/*跳到支付成功页*/
function paySuccess(result, self, success) {
	if(success){
		success(result);
		return;
	}
	gotoSuccess(result);
}
/*跳到支付成功页*/
function gotoSuccess(result) {
	uni.reLaunch({
		url: '/main/pages/order/pay-success/pay-success?order_id=' + result.data.order_id
	});
}

/*支付失败跳订单详情*/
function payError(result, fail) {
	if(fail){
		fail(result);
		return;
	}
	uni.redirectTo({
		url: '/main/pages/order/order-detail/order-detail?order_id=' + result.data.order_id
	});
}
