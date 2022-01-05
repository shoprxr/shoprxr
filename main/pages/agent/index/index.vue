<template>
	<view class="index-agent" v-if="!loadding">
		<!--头部图片-->
		<view class="banner d-c-c d-c">
			<image :src="top_background" mode="widthFix"></image>
		</view>

		<!--是分销商-->
		<template v-if="is_agent && isData">
			<!--金额信息-->
			<view class="agent-wrap p30" style="margin-top: -60rpx;">
				<view class="d-b-c border-b p-20-0 f28 lh150">
					<view>
						<text class="gray9">用户名：</text>
						<text class="fb gray3 f34">{{ user.nickName }}</text>
					</view>
					<view>
						<text class="gray9">{{ info_words.index.words.referee.value }}：</text>
						<text class="pt10 gray3">{{ agent.referee ? agent.referee.nickName : '平台' }}</text>
					</view>
				</view>
				<view class="d-s-c p-30-0 mt20">
					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">￥</text>
							<text class="f40">{{to_be_settle_money}}</text>
						</view>
						<view class="pt10 f28 gray6">待结算</view>
					</view>

					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">￥</text>
							<text class="f40">{{ agent.user.money }}</text>
						</view>
						<view class="pt10 f28 gray6">{{ info_words.index.words.money.value }}</view>
					</view>

					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">￥</text>
							<text class="f40">{{ agent.user.freeze_money }}</text>
						</view>
						<view class="pt10 f28 gray6">{{ info_words.index.words.freeze_money.value }}</view>
					</view>
					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">￥</text>
							<text class="f40">{{ agent.user.total_money }}</text>
						</view>
						<view class="pt10 f28 gray6">{{ info_words.index.words.total_money.value }}</view>
					</view>
				</view>
				<view class="d-c-c p-30-0">
					<button type="primary" class="btn-red flex-1" @click="gotoCash">{{ info_words.index.words.cash.value }}</button>
				</view>
			</view>
			<!--图标入口-->
			<view class="agent-wrap p30 d-s-c f-w mt20">
				<view class="d-c-c d-c flex-1 p-30-0" @click="gotoPage('/main/pages/agent/cash/list/list')">
					<text class="icon iconfont icon-zijinmingxi" style="color:#d5bf6e;"></text>
					<text class="pt10 f28">{{ info_words.cash_list.title.value }}</text>
				</view>
				<!-- <view class="d-c-c d-c flex-1 p-30-0" @click="gotoPage('/main/pages/agent/order/order');">
					<text class="icon iconfont icon-fenxiaodingdan" style="color:#fa2908cc;"></text>
					<text class="pt10 f28">{{ info_words.order.title.value }}</text>
				</view> -->
				<view class="d-c-c d-c flex-1 p-30-0" @click="gotoPage('/main/pages/agent/log/log');">
					<text class="icon iconfont icon-fenxiaodingdan" style="color:#fa2908cc;"></text>
					<text class="pt10 f28">{{ info_words.order.title.value }}</text>
				</view>
				<view class="d-c-c d-c flex-1 p-30-0" @click="gotoPage('/main/pages/agent/team/team')">
					<text class="icon iconfont icon-tuandui" style="color:#55b4e1;"></text>
					<text class="pt10 f28">{{ info_words.team.title.value }}</text>
				</view>
				<view class="d-c-c d-c flex-1 p-30-0" @click="gotoPage('/main/pages/agent/qrcode/qrcode')">
					<text class="icon iconfont icon-erweima" style="color:#67cb7d;"></text>
					<text class="pt10 f28">{{ info_words.qrcode.title.value }}</text>
				</view>

			</view>
			<view  class="agent-wrap p30 d-s-c f-w mt20" >
				<view class="d-c-c d-c flex-1 p-30-0" @click="gotoPage('/main/pages/agent/achievement/achievement')" v-if="is_open_achievement=='1'">
					<text class="icon iconfont icon-tuandui" style="color:#67cb7d;"></text>
					<text class="pt10 f28">业绩明细</text>
				</view>
				<view class="d-c-c d-c flex-1 p-30-0">

				</view>
				<view class="d-c-c d-c flex-1 p-30-0">

				</view>
				<view class="d-c-c d-c flex-1 p-30-0">

				</view>
				<view class="d-c-c d-c flex-1 p-30-0">

				</view>
			</view>
		</template>
		<!--不是分销商-->
		<template v-if="!is_agent && isData">
			<view class="no-agent">
				<view class="mt50 p-0-20 red f34 tc">{{ info_words.index.words.not_agent.value }}</view>
				<view class="p30 mt30">
					<button type="primary" class="btn-red" :style="[active]" @click="applyagent">{{ info_words.index.words.apply_now.value }}</button>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	data() {
		return {
			/*是否加载完成*/
			loadding: true,
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			/*0：不是分销商，1：分销商申请中，2：已经是分销商*/
			is_agent: false,
			isData: false,
			agent: {},
			/*顶部背景*/
			top_background: '',
			/*基本信息*/
			info_words: {},
			words: {},
			user: {},
			is_open_achievement:0,
			to_be_settle_money:0
		};
	},
	onLoad(e) {
		if (e.is_agent) {
			this.is_agent = e.is_agent;
		}
	},
	onShow() {
		uni.showLoading({
			title: '加载中'
		});
		/*获取个人中心数据*/
		this.getData();
    this.setGlobalColor()
	},
  computed: {
    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },
  },
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			self._get('user.agent/center', {}, function(data) {
				console.log(data);
				self.info_words = data.data.words;
				uni.setNavigationBarTitle({
					title: self.info_words.index.title.value != '' ? self.info_words.index.title.value : self.info_words.index.title.default
				});
				self.is_agent = data.data.is_agent;
				self.top_background = data.data.background;
				self.agent = data.data.agent;
				self.user = data.data.user;
				self.isData = true;
				self.loadding = false;
				self.is_open_achievement =data.data.is_open_achievement;
				self.to_be_settle_money = data.data.to_be_settle_money;
				uni.hideLoading();
			});
		},

		/*申请分销商*/
		applyagent() {
			uni.navigateTo({
				url: '/main/pages/agent/apply/apply'
			});
		},

		/*去商城逛逛*/
		gotoShop() {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		},

		/*去提现*/
		gotoCash() {
			uni.navigateTo({
				url: '/main/pages/agent/cash/apply/apply'
			});
		},

		/*跳转页面*/
		gotoPage(path) {
			let timestamp = new Date().getTime();
			let url = path+"?t="+timestamp;
			uni.navigateTo({
				url: path+"?t="+timestamp
			});
		}
	}
};
</script>

<style>
.index-agent .banner {
	min-height: 167rpx;
	padding-bottom: 60rpx;
	background-repeat: no-repeat;
	background-size: 100%;
}
.index-agent .banner image{ width: 100%;}

.no-agent-img {
	padding-top: 60rpx;
}

.no-agent-img image {
	width: 300rpx;
}

.agent-wrap {
	background: #ffffff;
	box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.1);
}

.index-agent .agent-wrap .iconfont {
	font-size: 60rpx;
}
.index-agent .btn-red {
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226,35,26,.6);
}
</style>
