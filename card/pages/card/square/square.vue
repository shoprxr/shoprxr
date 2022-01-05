<template>
	<view>
		<view class="search-box">
		    <view class="search-item" >
		        <span class="icon iconfont icon-sousuo"></span>
		        <input @confirm="searchConfirm" v-model="keywords" class="ml-md flex-1" confirmType="search"  placeholderClass="placeholder" type="text"></input>
		    </view>
		</view>
		
		<view class="swiper-box" v-if="list.length>0">
		    <swiper @change="handerChange" class="swiper-ad"  indicatorDots="false"  :style="'height:' + height + 'rpx;'">
		        <swiper-item v-for="(item, index) in list" :key="index">
		            <view class="img-box" :style="'padding: 0 ' + space + 'rpx;'">
		                <image @tap="goUrl" class="swiper-ad__img" :data-url="item.link" :src="item.path[0].path||'/images/test/ad.png'" :style="'border-radius:' + borderRadius + 'rpx;'"></image>
		            </view>
		        </swiper-item>
		    </swiper>
		</view>
		<view class="dots" v-if="list.length>1">
		    <view v-for="(item, index) in list.length" :key="index" class="dot" :style="'background:' + (index==activeIndex?indicatorActiveColor:indicatorColor) + ';width:' + (index==activeIndex?'12rpx':'12rpx')"></view>
		</view>
		<view class="b-1px-b"></view>
		<scroll-view class="ui-tabs ui-tabs-x" style="text-align: center; width: 375px;">
			<view style="width: 100vw;line-height:3.5;">人脉圈</view>
			<view class="ui-tabs-ink-bar-wrapper" style="top: 44px;width: 187.5px;">
				<view class="ui-tabs-ink-bar" style="width:100vw;"></view>
			</view>
		</scroll-view>
		<view class="b-1px-b"></view>

		<swiper @change="categoryChange" class="swiper-category" :style="'height:' + (144*newRowNum+40*(newRowNum-1)) + 'rpx;'" :current="current">
		    <swiper-item v-for="(pitem, pindex) in newList" :key="pindex" class="swiper-category-item">
		        <view v-for="(item, index) in pitem" :key="index" @click="goCategoryUrl(item)" class="swiper-category-item__child "  :style="'width:' + (100/colNum) + '%;margin-top:' + (index<colNum?'0':'20rpx')">
		            <image class="scroll-x-img" :src="item.path"></image>
		            <view class="scroll-x-text ellipsis">{{item.name}}</view>
		        </view>
		    </swiper-item>
			
		</swiper>
		<view class="dots" v-if="newList.length>1">
		    <view v-for="(item, index) in newList.length" :key="index" class="dot" :style="'background:' + (index==current?indicatorActiveColor:indicatorColor) + ';width:' + (index==current?'32rpx':'12rpx')"></view>
		</view>
		<view class="space-lg"></view>
		
		<view class="ui-sticky">
		    <view class="tab2-box">
				<view class="flex-1 f-title-lg">热门名片</view>
			</view>
		</view>
		<view class="b-1px-b"></view>
		<view class="cell-list">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + phoneHeight + 'px;'" >
				<view  class="card-item share-btn card-item-view" v-for="(item, index) in cardDataList" @click="gotoClick(item)" :key="index">
					<view class="flex-center">
						<image class="avatar" :src="item.avatar_image||'http://imgh5.y01.cn/20210606232151970aa8749.png'"></image>
						<view class="ml-lg  flex-1 ellipsis">
							<view class="flex-y-baseline ">
								<view class="flex-y-center">
									<view class="f-title-lg c-title ellipsis">{{item.name}}</view>
									<image class="ml-md icon-md" src=""></image>
								</view>
								<view class="c-caption f-caption ml-md ellipsis">{{item.occupation}}</view>
							</view>
							<view class="flex-y-center">
								<view class="c-caption f-paragraph flex-1 ellipsis">{{item.supply?item.supply.name:"公司"}}</view>
								<!-- <view class="f-caption c-caption" wx:if="{{orderType==2}}">{{distance>1?distance+'km':distance<=0?'100m以内':distance*1000+'m'}}</view> -->
							</view>
						</view>
					</view>
				</view>
				
				<view class="page">
					<view class="loadmore" v-if="loading">
						<view class="loading"></view>
						<view class="loadmore_tips">正在加载</view>
					</view>
					<block v-else>
						<view class="loadmore loadmore_line" v-if="page>=last_page&&cardDataList.length>0">
							<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
						</view>
						<view class="loadmore loadmore_line" v-if="cardDataList.length<=0">
							<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
						</view>
					</block>
				</view>
			</scroll-view>
			
		</view>
		<Tabbar></Tabbar>
	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components: {
			Tabbar
		},
		data() {
			return {
				keywords:'',
				list:[],
				height: 350,
				indicatorDots: !0,
				autoplay: !0,
				interval:5e3,
				duration:500,
				indicatorColor:"rgba(248,248,248,0.6)",
				indicatorActiveColor:"#fff",
				circular:!0,
				previousMargin: 0,
				nextMargin:0,
				space: 0,
				borderRadius:0,
				current: 0,
				left: "",
				newList: [],
				newRowNum: 2,
				colNum:5,
				rowNum:2,
				indicatorActiveColor: "#28c24c",
				url: "/pages/card/filter/filter",
				phoneHeight:"",
				cardDataList:[],
				last_page:0,
				page:1,
				loading:!1
			}
		},
		onLoad() {
			this.getBase();
			this.getCardData();
		},
		mounted() {
			
			this.init();
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
					}
				});
			},
			getBase(){
				let self = this;
				self._get('plus.card.square/getSquare',{},function(res){
					if(res.code ==1){
						let categoryList = [],categoryData = res.data.category; 
						let categoryLength = res.data.category.length;
						let l= 0;
						let len = 10;
						while(l<categoryLength)	{
							categoryList.push(categoryData.slice(l,l+len));
							l = l+10;
						}
						self.newList = categoryList;
					}
				});
			},
			categoryChange(e) {
				var t = e.detail.current;
				this.current=t;
			},
			getCardData(){
				let self = this;
				self._get('plus.card.square/getCardlist',{
					keywords:self.keywords,
					page:self.page||1,
				},function(res){
					if(res.code ==1){
						self.cardDataList =self.cardDataList.concat(res.data.cardList.data);
						self.last_page = res.data.cardList.last_page;
					}
				});
			},
			
			gotoClick(item){
				let path = "/card/pages/card/index?card_id="+item.card_id;
				this.gotoPage(path);
			},
			goCategoryUrl(item){
				console.log(item);
				let path = "/card/pages/card/square/filter?card_category_id="+item.card_category_id;
				this.gotoPage(path);
			},
			searchConfirm(){
				this.cardDataList = [];
				this.page = 1;
				this.getCardData();
			}
		}
	}
</script>

<style scoped>
	view{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		
	}
	
	.b-1px, .b-1px-t, .b-1px-b, .b-1px-tb, .b-1px-l, .b-1px-r {
	    position: relative;
		height: 1rpx;
	}
	.ui-tabs {
	    position: relative;
	    background: white;
	}
	.ui-tabs.ui-tabs-x {
	    width: 100%;
	    white-space: nowrap;
	}
	.ui-tabs-ink-bar-wrapper {
	    width: 60rpx;
	    background: #ddd;
	    position: relative;
	    left: 345rpx;
	    bottom: 0;
	    height: 8rpx;
	    transform-origin: 50% 50%;
	    transition: width 250ms ease-out,left 250ms ease-out;
	    margin-top: 20rpx;
	    overflow: hidden;
	    border-radius: 4rpx;
	}
	
	.ui-tabs-ink-bar {
	    position: absolute;
	    width: 30rpx;
	    background: #e74d45;
	    height: 8rpx;
	    border-radius: 4rpx;
	}
	.ui-tabs {
	    position: relative;
	    background: white;
	}
	
	.ui-tabs.ui-tabs-x {
	    width: 100%;
	    white-space: nowrap;
	}
	
	.ui-tabs-x .ui-tabs-ink-bar-wrapper {
	    position: absolute;
	    left: 0;
	    height: 2px;
	    transform-origin: 50% 50%;
	    transition: width 250ms ease-out,left 250ms ease-out;
	}
	
	.ui-tabs-x .ui-tabs-ink-bar {
	    position: relative;
	    width: 60rpx;
	    margin: 0 auto;
	    border-bottom: 2px solid #19a918;
	}
	.space-lg{
		height: 32rpx;
	}
	.search-box {
	    padding: 16rpx;
	    display: flex;
	    align-items: center;
	    background: #efeff5;
	}
	
	.search-item {
	    flex: 1;
	    height: 64rpx;
	    background: #fff;
	    border-radius: 32rpx;
	    padding: 0 16rpx 0 35rpx;
	    display: flex;
	    align-items: center;
	    line-height: 1;
	    font-size: 28rpx;
	    color: #888;
	}
	
	.placeholder {
	    font-size: 28rpx;
	}
	
	.search-item-btn {
	    color: #19a918;
	    margin-left: 32rpx;
	    font-size: 30rpx;
	}
	
	.search-btn {
	    padding: 0 20rpx 0 40rpx;
	}
	
	.icon-sm {
	    width: 30rpx;
	    height: 30rpx;
	}
	
	.flex-1 {
	    flex: 1;
	}
	
	.icon-md {
	    width: 40rpx;
	    height: 40rpx;
	}
	
	.ml-md {
	    margin-left: 16rpx;
	}
	.swiper-box {
	    position: relative;
	}
	
	.swiper-ad {
	    background: #fff;
	}
	
	.swiper-ad-item {
	    box-sizing: border-box;
	    width: 100%;
	    height: 100%;
	}
	
	.swiper-ad__img {
	    width: 100%;
	    height: 100%;
	}
	
	.img-box {
	    width: 100%;
	    height: 100%;
	}
	
	.dots {
	    position: relative;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    bottom: 16rpx;
	}
	
	.dot {
	    height: 12rpx;
	    width: 12rpx;
	    background: #d48989;
	    border-radius: 6rpx;
	    margin: 0 6rpx;
	}
	.column-box {
	    background: #fff;
	    font-size: 26rpx;
	    color: #666;
	    overflow: hidden;
	    padding: 20rpx 0;
	}
	
	.scroll-x {
	    white-space: nowrap;
	}
	
	.scroll-x-item {
	    position: relative;
	    display: inline-block;
	    vertical-align: text-top;
	}
	
	.scroll-x-box {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    margin-top: 20rpx;
	}
	
	.scroll-x-img {
	    width: 96rpx;
	    height: 96rpx;
	    border-radius: 50%;
	    background: #eaeaea;
	}
	
	.scroll-x-text {
	    margin-top: 10rpx;
	    text-align: center;
	}
	
	.swiper-category {
	    width: 100%;
	    background: white;
	    font-size: 26rpx;
	    color: #666;
	    padding: 20rpx 0;
	}
	
	.swiper-category-item {
	    box-sizing: border-box;
	    display: flex;
	    align-items: flex-start;
	    flex-wrap: wrap;
	}
	
	.swiper-category-item__child {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	}
	
	.swiper-category__img {
	    width: 96rpx;
	    height: 96rpx;
	    margin-bottom: 10rpx;
	}
	
	.dots {
	    background: white;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    padding-bottom: 20rpx;
	}
	
	.dot {
	    height: 12rpx;
	    width: 12rpx;
	    background: #ddd;
	    border-radius: 6rpx;
	    margin: 0 4rpx;
	}
	
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	
	.ui-tab {
	    display: inline-block;
	    position: relative;
	    font-size: 32rpx;
	    text-align: center;
	    box-sizing: border-box;
	    color: #888;
	    line-height: 92rpx;
	}
	
	.ui-tab.ui-tab-x.active {
	    color: #19a918;
	}
	
	.ui-tab.border-none {
	    border: 0!important;
	}
	
	.tab2-box {
	    height: 100rpx;
	    display: flex;
	    align-items: center;
	    background: #fff;
	    padding: 0 32rpx;
	}
	.cell-list {
	    background: #fff;
	    padding: 0 32rpx;
	}	
	.card-item {
	    padding: 16rpx 0;
	    background: #fff;
		border-bottom: 1rpx solid #ececec;
	}
	.flex-center {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}
	.avatar {
	    width: 96rpx;
	    height: 96rpx;
	    border-radius: 6rpx;
	}
	.flex-1 {
	    flex: 1;
	}
	
	.flex-y-baseline {
	    display: flex;
	    align-items: baseline;
	}
	.flex-y-center {
	    display: flex;
	    align-items: center;
	}
	.ml-md {
	    margin-left: 16rpx;
	}
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.c-caption {
	    color: #888888;
	}
	
	.f-caption {
	    font-size: 24rpx;
	}
	.ml-lg {
	    margin-left: 32rpx;
	}
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.loadmore {
	    width: 65%;
	    margin: 1.5em auto;
	    line-height: 1.6em;
	    font-size: 14px;
	    text-align: center;
	}
	
	.loadmore_tips {
	    display: inline-block;
	    vertical-align: middle;
	}
	
	.loadmore_line {
	    border-top: 1px solid #e5e5e5;
	    margin-top: 2.4em;
	}
	
	.loadmore_tips_in-line {
	    position: relative;
	    top: -0.9em;
	    padding: 0 0.55em;
	    background-color: #fff;
	    color: #999;
	}
</style>
