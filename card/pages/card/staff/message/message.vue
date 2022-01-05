<template>
	<view>
		<scroll-view  scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		@scrolltolower="scrolltolowerFunc">
		<view class="message-sec">
		    <view v-for="(item, index) in dataList.list" :key="index" class="child rel" >
		        <image class="abs br-10" :data-index="index" data-status="toUserInfo" mode="aspectFill" :src="item.user.person_avatar||defaultUserImg"></image>
		        <em :class="'abs ' + (item.message_not_read_count<100?'dot':'dotbig')" v-if="item.message_not_read_count>0">{{item.message_not_read_count}}</em>
		        <view class="content" @click="gotoChat(item)">
		            <view class="flex">
		                <view class="flex100-5 ellipsis">
		                    <text class="iconfont2 icon-shouji" style="color:#c0c0c0;font-size:28rpx;" v-if="item.tel"></text>
							<text>{{item.user.nick_name?item.user.nick_name:'新客户'}}</text>
							
		                </view>
		                <view class="flex100-5 tr">{{item.create_time}}</view>
		            </view>
		            <view class="text ellipsis">
		                <block v-if="item.message_type=='image'">[图片]</block>
		                <block v-if="item.message_type=='text'"> {{item.content}}</block>
		            </view>
		        </view>
		    </view>
		</view>
		
		<view class="page">
			<view class="loadmore" v-if="dataList.loading">
				<view class="loading"></view>
				<view class="loadmore_tips">正在加载</view>
			</view>
			<block v-else>
				<view class="loadmore loadmore_line" v-if="page>=dataList.last_page&&dataList.list.length>0">
					<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
				</view>
				<view class="loadmore loadmore_line" v-if="dataList.list.length<=0">
					<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
				</view>
			</block>
		</view>
		</scroll-view>
		<Radarbar></Radarbar>
	</view>
</template>

<script>
	import Radarbar from '@/components/radarbar/radarbar.vue';
	export default {
		components:{
			Radarbar
		},
		data() {
			return {
				globalData: {},
				defaultUserImg:'',
				messageTime: "",
				staffInfo: [],
				page: 1,
				dataList: {
					last_page: 0,
					list: [],
					refresh: !1,
					loading: !0
				},
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				temlIds:[],
				card_id:0
			}
		},
		onLoad() {
			this.init();
			this.getChatList();
		},
		methods: {
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			getChatList(){
				let self = this;
				self._get('plus.card.chat/getChatList',
				{
					page:self.page||1
				},
				function(res){
					if(res.code ==1){
						self.dataList.loading = false
						self.dataList.list = self.dataList.list.concat(res.data.chatList.list);
						self.dataList.last_page = res.data.chatList.total_page;
						self.temlIds = res.data.temlIds_arr;
						self.card_id = res.data.card_id;
					}
				})
			},
			gotoChat(e){
				let self = this;
				let chat_to_uid = e.chat_to_uid;
				if(!chat_to_uid||chat_to_uid=='undefined'){
					uni.showToast({
						title:"该用户不存在"
					})
					return false
				}
				let callback = function(){
					let path = '/card/pages/card/chat/staffchat?chat_to_uid='+e.chat_to_uid+"&card_id="+self.card_id;
					self.gotoPage(path);
				};
				self.subMessage(this.temlIds,callback);
				
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.dataList.last_page) {
					self.dataList.loading = false;
					return;
				}
				self.getChatList();
			},
		}
	}
</script>

<style scoped>
	@import "/card/statics/card.css";
	page {
	    background: #f4f4f8;
	}
	
	view,button {
	    display: block;
	    overflow: initial;
		line-height: none;
	}
	.message-sec .child .content .flex{
		margin: 0;
	}
	.message-sec .child em {
	    left: 100rpx;
	}
</style>
