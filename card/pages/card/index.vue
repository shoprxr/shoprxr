<template>
	<view style="width:100%;height:auto;display:block;background:white;overflow-x: hidden; ">
		<view>
			<view style="background:white;padding:15rpx 0rpx;">
			    <view class="card-index-sec-0 br-10">
					<video  :src="cardIndexData.info.video" :poster="cardIndexData.info.poster" objectFit="contain"></video>
			    </view>
			</view>
		</view>

		<block v-if="cardIndexData.info">
			<block>
				<button class="card-more-btn tc "  @click="toCardMore" hoverClass="none">
					{{moreStatus==true?'展开全部':'收起以下'}}名片信息
					<i class="iconfont2 icon-right" :style="'transform: rotate(' + (moreStatus==true?'90':'270') + 'deg)'"></i>
				</button>

				<view :class="'more-card-info-sec '+(moreStatus==true?'hide':'')">

					<view class="child flex avatar" v-if="cardIndexData.info.avatar_image">
						<view class="user-card-info-0">
							<view class="card_type_avatar">
								<image class="circle0" mode="aspectFill" :src="cardIndexData.info.avatar_image"></image>
							</view>
						</view>

					</view>

					<view class="child flex" v-if="cardIndexData.info.name">
						<view class="flex100-15">姓名</view>
						<view class="flex100-7">{{cardIndexData.info.name}}</view>
						<button class="flex100-15 tr" @click="toCopy('name')" hoverClass="none">
							<em class="tc fr br-3">复制</em>
						</button>
					</view>

					<view class="child flex" v-if="cardIndexData.info.occupation">
						<view class="flex100-15">职位</view>
						<view class="flex100-7">{{cardIndexData.info.occupation}}</view>
						<button class="flex100-15 tr" @click="toCopy('occupation')" hoverClass="none">
							<em class="tc fr br-3">复制</em>
						</button>
					</view>

					<view class="child flex" v-if="cardIndexData.info.mobile">
						<view class="flex100-15">手机</view>
						<view class="flex100-7">{{cardIndexData.info.mobile}}</view>
						<button class="flex100-15 tr" @click="toCall"  hoverClass="none">
							<em class="tc fr br-3">拨打</em>
						</button>
					</view>

					<view class="child flex" v-if="cardIndexData.info.wechat">
						<view class="flex100-15">微信</view>
						<view class="flex100-7">{{cardIndexData.info.wechat}}</view>
						<button class="flex100-15 tr" @click="toCopy('wechat')" hoverClass="none">
							<em class="tc fr br-3">复制</em>
						</button>
					</view>
					<view class="child flex" v-if="cardIndexData.info.email">
						<view class="flex100-15">邮箱</view>
						<view class="flex100-7">{{cardIndexData.info.email}}</view>
						<button class="flex100-15 tr" @click="toCopy('email')" hoverClass="none">
							<em class="tc fr br-3">复制</em>
						</button>
					</view>

					<view class="child flex" v-if="cardIndexData.info.supply">
						<view class="flex100-15">公司</view>
						<view class="flex100-7">{{cardIndexData.info.supply.name}}</view>
						<button class="flex100-15 tr" @click="toCopy('company')" hoverClass="none">
							<em class="tc fr br-3">复制</em>
						</button>
					</view>

					<view class="child flex" v-for="(item, index) in cardIndexData.info.supplyArr" :key="index">
						<view class="flex100-15"></view>
						<view class="flex100-7">{{item}}</view>
						<button class="flex100-15 tr" @click="toCopy('company',item)" hoverClass="none">
							<em class="tc fr br-3">复制</em>
						</button>
					</view>

					<view class="child flex">
						<view class="flex100-15">地址</view>
						<view class="flex100-7" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{cardIndexData.info.supply.address}}</view>
						<button class="flex100-15 tr"  @click="toMap" data-type="7"
						 hoverClass="none">
							<em class="tc fr br-3">导航</em>
						</button>
					</view>
				</view>
			</block>
			<form class="share-communication-sec clearfix" >
				<button class="fl tc" @click="toShowShare" hoverClass="none">分享名片</button>
				<button class="fr tc" @click="toAddPhone"  hoverClass="none">存入手机通讯录</button>
			</form>

			<view class="browse-sec ">
				<view class="content clearfix">
					<view class="user fl">
						<image v-for="(item, index) in cardIndexData.info.cardCount" :key="index" class="br-5" mode="aspectFill" :src="item.user?item.user.avatarUrl:''"
						 v-if="index<8"></image>
					</view>
					<view :class="'icon-more-zan fr ' + (cardIndexData.info.isThumbs>0?'active':'')">
						<i class="iconfont2 icon-more fl" v-if="cardIndexData.info.cardCount.length>7"></i>
						<i class="iconfont2 icon-dianzan fr" @click="toCardZan" ></i>
					</view>
				</view>
				<view class="flex">
					<view class="flex100-5">最近{{cardIndexData.info.peopleview?cardIndexData.info.peopleview:'0'}}人浏览</view>
					<view class="flex100-5 tr">靠谱：{{cardIndexData.info.thumbs?cardIndexData.info.thumbs:'0'}}</view>
				</view>
			</view>

			<view class="card-common-title">个性标签</view>
			<view class="card-introduce-sec">
				<!-- 标签 -->
				<view :class="cardIndexData.info.labelList.length>0?'staff-choose-tags clearfix uniquetags':'staff-choose-tags clearfix'" v-if="cardIndexData.info.labelList.length>0">
					<block v-for="(item, index) in cardIndexData.info.labelList" :key="index">
						<view @click="toTagsClick(item)" class="child rel fl" :data-index="index"  v-if="item.clicked==1">
							<em class='abs addNum staff-tags-animatoinsA'>
							</em>
							<button class="btn nobor fl rel" hoverClass="btn-hover" :style="'color:white;border:1rpx solid rgba(23,162,52,1);background:rgba(23,162,52,1)'"
							 type="hasbg">
								{{item.name}} | <i class="iconfont2 icon-dianzan2" style="margin:0rpx 6rpx;"></i> {{item.count}}
							</button>
						</view>
						<view class="child rel fl" v-else>
							<button @click="toTagsClick(item)" class="btn nobor fl"  hoverClass="btn-hover"
							 plain="true" :style="'color:rgba(23,162,52,1);border:1rpx solid rgba(23,162,52,1);background:rgba(23,162,52,0.05)'"
							 type="hasbg">
								{{item.name}} | <i class="iconfont2 icon-dianzan2" style="margin:0rpx 6rpx;"></i> {{item.count}}
							</button>
						</view>
					</block>
				</view>
			</view>

			<!-- 主推商品 -->
			<block v-if="cardIndexData.info.productList.length>0">
				<view class="card-common-title">主推商品</view>
				<view style="width:100%;height:auto;display:block;background:white;padding:40rpx 0rpx 30rpx 0rpx;">
					<view class="shop-product-sec clearfix" style="padding:0rpx 4%;margin:0rpx;">
						<block v-if="product_column=='two_column'">
							<view v-for="(item, index) in cardIndexData.info.productList" :key="index" @click="toJumpProduct(item)" class="child br-10 rel" :style="(index<2?'margin-top:0rpx':'') + ';'">
								<image mode="aspectFill" :src="item.product_image"></image>
								<view class="clamp2">{{item.product_name}}</view>
								<view class="price ellipsis">
									<block>
										{{item.product_price!=0?'¥':''}}
										<block v-if="item.product_price">{{item.product_price>0?item.product_price:'面议'}}</block>
									</block>
									<block v-if="item.product_price==0.00">面议</block>
								</view>
							</view>
						</block>
						<block v-else-if="product_column=='one_column'">
							<view v-for="(item, index) in cardIndexData.info.productList" :key="index"  class="one_column br-10 rel" :style="(index<2?'margin-top:0rpx':'') + ';'">
								<block v-if='item.video'>
									<video :src="item.video" style="width: 100%;"></video>
								</block>
								<block v-else>
									<image mode="aspectFill" :src="item.product_image" @click="toJumpProduct(item)"></image>
								</block>
								<view class="clamp2" @click="toJumpProduct(item)">{{item.product_name}}</view>
								<view class="price ellipsis" @click="toJumpProduct(item)">
									<block>
										{{item.product_price!=0?'¥':''}}
										<block v-if="item.product_price">{{item.product_price>0?item.product_price:'面议'}}</block>
									</block>
									<block v-if="item.product_price==0.00">面议</block>
								</view>
							</view>
						</block>
						<block v-else-if="product_column=='video_scale'">
							<view v-for="(item, index) in cardIndexData.info.productList" :key="index"  class="video_scale br-10 rel" :style="(index<2?'margin-top:0rpx':'') + ';'">
								<block v-if='item.video'>
									<video :src="item.video"  style="width: 100%;"></video>
								</block>
								<block v-else>
									<image mode="aspectFill" :src="item.product_image" @click="toJumpProduct(item)"></image>
								</block>

								<view class="clamp2" @click="toJumpProduct(item)">{{item.product_name}}</view>
								<view class="price ellipsis" @click="toJumpProduct(item)">
									<block>
										{{item.product_price!=0?'¥':''}}
										<block v-if="item.product_price">{{item.product_price>0?item.product_price:'面议'}}</block>
									</block>
									<block v-if="item.product_price==0.00">面议</block>
								</view>
							</view>
						</block>
					</view>
				</view>
			</block>
			<block v-if="cardIndexData.info.introduce">
				<view class="card-common-title">自我介绍</view>
				<view class="card-introduce-sec">
					<text class="introduce" style="padding-bottom:50rpx" v-if="cardIndexData.info.introduce">{{cardIndexData.info.introduce}}</text>
					<!-- {{cardIndexData.info.introduce}} -->
				</view>
			</block>
			<!-- <view style="height: 100rpx;"></view> -->
			<block v-if="cardIndexData.info.images.length>0">
				<view class="card-common-title">图片展示</view>
				<view class="card-img-sec">
					<image v-for="(item, index) in cardIndexData.info.images" :key="index" mode="widthFix" :src="item"></image>
				</view>
			</block>
			<block>
				<view @click="toMyCard" class="fixed-message-sec fix tc circle"  :style="'bottom:' + (globalData.isIphoneX?'400':'350') + 'rpx;'" v-if="showMySelf">
					<text class="iconfont2 icon-iconset0147"></text>
					<text class="rel ellipsis">
					   我的名片
					</text>
				</view>
				<view @click="toChat" class="fixed-message-sec fix tc circle"  :style="'bottom:' + (globalData.isIphoneX?'288':'222') + 'rpx;'" v-if="showChat">
				    <text class="iconfont2 icon-fabuxuqiu rel"></text>
				    <text class="rel ellipsis">
				        咨询
				    </text>
				    <em :class="'tc ' + (clientUnread>100?'dotbig':'dot')" v-if="clientUnread>0">
				        {{clientUnread}}
				    </em>
				</view>
			</block>


			<!-- <view @click="toCancleShareCard" :class="'bg_opacity_sec fix ' + (showShareStatus==true?'':'hide')" data-status="toShareCard"
			 data-type="3"></view> -->
			<form :class="'fix-show-share-sec tc fix ' + (showShareStatus==true?'':'hide') ">
				<view class="flex">
					<button  class="flex100-5"  hoverClass="none" open-type="share">
						<i class="iconfont2 icon-weixin1"></i>
						<view class="title">微信好友</view>
					</button>
					<button class="flex100-5" @click="toShareCard" hoverClass="none">
						<i class="iconfont2 icon-pengyouquan-copy"></i>
						<view class="title">名片码</view>
					</button>
				</view>
				<button class="cancel" @click="toCancleShareCard" hoverClass="none">取消</button>
			</form>
		</block>
		<Tabbar v-if="show_menu"></Tabbar>
		<TestTips></TestTips>

	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import TestTips from '@/components/test-tips.vue';
	export default {
		components: {
			Tabbar,
			TestTips
		},
		data() {
			return {
				card_id:0,
				showShareStatus:false,
				cardIndexData: {
					"info": {
						name:'',
						cardCount:[],
						productList:[],
						images:[],
						labelList:[],
						supply:{
							name:'',
						}
					},
				},
				globalData: {
					configInfo: {
						config: {
							card_type: 1,

						}
					}

				},
				clientUnread:0,
				moreStatus: true,
				is_share:false,
				show_menu:false,
				showChat:false,
				temlIds:[],
				showMySelf:false,
				myCardId:0,
				getdefault:0,
				product_column:'one_column'
			}
		},
		onLoad(e) {
			/*名片id*/
			let scene = utils.getSceneData(e);
			if(e.card_id||scene.card_id){
				this.card_id = e.card_id ? e.card_id : scene.card_id;
				uni.setStorageSync('card_id',this.card_id);
			}
			let tabbar = uni.getStorageSync('tabbar');
			let self = this;
			if(!tabbar){
				self._get('index/tabbar',{},function(res){
					if(res.code==1){
						self.tabbarData = res.data.tabbar[0];
						self.show_menu =true;
						uni.setStorageSync('tabbar',res.data.tabbar[0]);
					}
				});
			}else{
				self.show_menu =true;
			}

		},
		mounted() {
			/*获取名片详情*/
			this.getBaseData();
		},
		methods: {
			getBaseData(){
				let self = this;
				let card_id = self.card_id;
				if(!card_id){
					card_id = uni.getStorageSync('card_id');
				}
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/detail',
					{
						card_id: card_id,
						getdefault:self.getdefault
					},
					function(res) {
						self.cardIndexData.info = res.data.info;

						//如果是访问自己的名片
						if(res.data.outofdate==1){
							uni.showModal({
								title:"名片服务",
								content:"您的名片已到期",
								showCancel:false,
								success(res) {
									let path = '';
									if(res.confirm){
										path = '/pages/user/index/index';
									}
									uni.redirectTo({
										url:path
									});
									return ;
								}
							});
						}else if(res.data.outofdate==2){
							//如果访问的别人的名片到期
							uni.showModal({
								title:"名片服务",
								content:"您访问的名片已到期",
								showCancel:false,
								success(res) {
									let path = '';
									if(res.confirm){
										self.getdefault = 1;
										self.getBaseData();
									}
									return ;
								}
							});
						}

						if(!card_id){
							self.card_id = res.data.info.card_id;
						}
						if(res.data.info.supply){
							uni.setStorageSync('currentSupplyId',res.data.info.supply.supply_id);
							self.product_column = res.data.info.supply.product_show;
							// self.product_column = 'video_scale'
						}
						let user_id = uni.getStorageSync('user_id');
						if(self.cardIndexData.info.user_id&&user_id!=self.cardIndexData.info.user_id&&user_id!='undefined'){
							self.showChat=true;
							self.clientUnread = res.data.clientUnread;
						}
						self.temlIds = res.data.temlIds_arr? res.data.temlIds_arr:['G1sRvqG8LTRT1KLrgpdU328lw9RBEEXGpaBDKTAO3Rk'];
						self.loadding = false;
						self.showMySelf = res.data.showMySelf;
						self.myCardId = res.data.myCardId;
						uni.setNavigationBarTitle({
							title:res.data.cardTitle||"电影名片"
						});


						uni.hideLoading();
					}
				);
			},

			/* 复制 */
			toCopy(type,more_info = ''){
				let clipboardData =  '';
				if(type=='wechat'){
					clipboardData = this.cardIndexData.info.wechat;
				}else if(type=='email'){
					clipboardData = this.cardIndexData.info.email;
				}else if(type =='company'){
					clipboardData = this.cardIndexData.info.supply.name;
					if(more_info!=''){
						clipboardData = more_info;
					}
				}else if(type =='name'){
					clipboardData = this.cardIndexData.info.name;
				}else if(type =='occupation'){
					clipboardData = this.cardIndexData.info.name;
				}
				let self = this;
				let card_id = self.card_id;

				uni.setClipboardData({
				    data: clipboardData,
				    success: function () {
						uni.showToast({
							title: '复制成功',
							duration: 2000
						})
				    },
					fail:function(){
						uni.showToast({
							title: '复制失败',
							duration: 2000
						})
					}
				});
				//点击复制事件
				self._get(
					'plus.card.card/copyClick',
					{
						card_id: card_id,
						type:type
					},
					function(res) {
						console.log(res);
					}
				);

			},
			/* 跳转商品 */
			toJumpProduct(item){
				let self = this;
				let product_id = item.product_id;
				let url='main/pages/product/detail/detail?product_id=' + product_id
				this.gotoPage(url);
			},
			/* 点击标签 */
			toTagsClick(item){
				let self = this;
				let card_id = self.card_id;
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/labelClick',
					{
						card_id: card_id,
						kmd_label_id:item['kmd_label_id'],
						url: self.url
					},
					function(res) {
						if(res.code==1){
							self.cardIndexData.info = res.data.info;
						}
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			/* 显示更多 */
			toCardMore(){
				this.moreStatus  =!this.moreStatus;

			},
			/* 显示分享名片 */
			toShowShare(){
				this.showShareStatus = !this.showShareStatus;
			},
			/* 取消分享 */
			toCancleShareCard(){
				this.showShareStatus = !this.showShareStatus;
			},

			/* 分享名片 */
			toShareCard(){
				let self= this;
				let card_id =self.card_id;
				uni.navigateTo({
					url:"/card/pages/card/share/index?card_id="+card_id
				})
			},
			/* 存入手机通讯录 */
			toAddPhone(){
				let self = this;
				let card_id = self.card_id;
				//点击复制事件
				self._get(
					'plus.card.card/copyClick',
					{
						card_id: card_id,
						type:'communicationbook'
					},
					function(res) {
						console.log(res);
					}
				);
				uni.addPhoneContact({
					mobilePhoneNumber:self.cardIndexData.info.mobile,
					firstName:self.cardIndexData.info.name,
				})
			},

			/* 导航 */
			toMap(){
				let self = this;
				let supply = self.cardIndexData.info.supply;
				uni.openLocation({
					latitude:parseFloat(supply.latitude),
					longitude:parseFloat(supply.longitude),
					success: function () {
						console.log('success');
					}
				});
			},

			/* 点击靠谱 */
			toCardZan(){
				let self = this;
				let card_id = self.card_id;
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/zanClick',
					{
						card_id: card_id,
					},
					function(res) {
						if(res.code==1){
							self.cardIndexData.info = res.data.info;
						}
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			/*
			* 拨打电话
			*/
		   toCall(){
				let self =this;
			    let mobile = this.cardIndexData.info.mobile;
				let card_id = self.card_id;
				//点击复制事件
				self._get(
					'plus.card.card/copyClick',
					{
						card_id: card_id,
						type:'mobile'
					},
					function(res) {
						console.log(res);
					}
				);
				uni.makePhoneCall({
				    phoneNumber: mobile
				});
			},
			onShareAppMessage(){
				let self = this;
				let card_id = self.card_id;
				// 构建页面参数
				let params = self.getShareUrlParams({
					card_id: card_id
				});

				let name = this.cardIndexData.info.name?this.cardIndexData.info.name:"我";
				let title  = name+"的电影名片，请惠存。";
				let obj = {
					title: title,
					path: '/card/pages/card/index?' + params
				};
				return obj
			},

			toChat(){
				let user_id = uni.getStorageSync('user_id');
				if(!user_id&&user_id!='undefined'){
					this.doLogin();
				}else{
					let self = this;
					let callback = function(){
						let chat_to_uid = self.cardIndexData.info.user_id;
						let path = '/card/pages/card/chat/chat?chat_to_uid='+chat_to_uid+'&card_id='+self.card_id;
						self.gotoPage(path);
					};
					self.subMessage(self.temlIds, callback);
				}

			},
			toMyCard(){
				let self = this;
				let path = '/card/pages/card/index?card_id='+self.myCardId;
				self.gotoPage(path);
			}

		}
	}
</script>

<style scoped>

	@import "/card/statics/card.css";
	page {
		background: #f4f4f8;
		width:100%;
		overflow-x: hidden;
	}

	view,
	button {
		display: block;
		overflow: initial;
	}
	.share-communication-sec button{
		margin-right: 20px;
	}
	.animatoins {
		width: 94%;
		height: 118rpx;
		background: #fefefd;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		top: 10rpx;
		left: 3%;
		z-index: 9999999;
		color: #000;
		font-size: 28rpx;
		transition: transform 1s;
		transform: translateY(-140rpx);
		box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, .1);
	}

	.animatoins text {
		width: 500rpx;
		position: relative;
		top: -5rpx;
	}

	.aa {
		transform: translateY(0rpx);
	}
	.f-icontext {
		font-size: 22rpx;
	}

	.f-paragraph {
		font-size: 28rpx;
	}

	.c-paragraph-sm {
		color: #969696;
	}

	.card-index-sec-0{
		width: 680rpx;
		height: 390rpx;
		margin: 0rpx auto;
		background: white;
		overflow: hidden;
		box-shadow: 0 3rpx 30rpx rgba(21,13,13,0.15);
	}
	.user-card-info-0{
		margin: auto;
	}
	.user-card-info-0  .card_type_avatar{
		display: inline-block;
		width: 25%;

	}
	.user-card-info-0  .card_type_avatar .circle0{
		width: 49px;
		height: 49px;
		display: block;
		border-radius:50%;
	}
	.user-card-info-0 .card_type_info{
		display: inline-block;
		width: 68%;
		text-align: left;
	}
	.user-card-info-0 .card_type_info .name{
		padding-top:50rpx;
	}
	.card-index-sec-0 video{
		width: 100%;
		height: 100%;
	}
	.child.flex.avatar{
		height: 140rpx;
		line-height: 140rpx;
	}

	.uniquetags{
		padding-bottom:50rpx;
		padding-top:25rpx
	}
	.card-more-btn{
		height: 50rpx;
		line-height: 50rpx;
	}
	.more-card-info-sec .child{
		height: 60rpx;
		line-height: 60rpx;
	}
	.shop-product-sec .one_column{
		width: 100%;
		padding-top: 10rpx;
		border: 1rpx solid #f0f0f0;
	}
	.shop-product-sec .video_scale{
		padding-top: 10rpx;
		border: 1rpx solid #f0f0f0;
	}
	.shop-product-sec .one_column image{
		width: 686rpx;
		height: 686rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	.shop-product-sec .video_scale image{
		width: 686rpx;
		height: 386rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	.shop-product-sec .video_scale video{
		width: 686rpx;
		height: 386rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .video_scale .clamp2 {
	    padding: 15rpx 15rpx 0rpx 15rpx;
	    font-size: 28rpx;
	    color: #282828;
	    line-height: 36rpx;
	    height: 72rpx;
	}

	.shop-product-sec .video_scale .price {
	    font-size: 32rpx;
	    height: 50rpx;
	    line-height: 50rpx;
	    color: #f31a33;
	    padding: 0rpx 15rpx 15rpx 15rpx;
	}

	.shop-product-sec .video_scale .price text {
	    font-size: 26rpx;
	    color: #959595;
	    margin-left: 10rpx;
	    text-decoration: line-through;
	}

	.shop-product-sec .one_column video{
		width: 686rpx;
		height: 386rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .one_column .clamp2 {
	    padding: 15rpx 15rpx 0rpx 15rpx;
	    font-size: 28rpx;
	    color: #282828;
	    line-height: 36rpx;
	    height: 72rpx;
	}

	.shop-product-sec .one_column .price {
	    font-size: 32rpx;
	    height: 50rpx;
	    line-height: 50rpx;
	    color: #f31a33;
	    padding: 0rpx 15rpx 15rpx 15rpx;
	}

	.shop-product-sec .one_column .price text {
	    font-size: 26rpx;
	    color: #959595;
	    margin-left: 10rpx;
	    text-decoration: line-through;
	}

</style>
