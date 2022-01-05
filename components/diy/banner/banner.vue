<template>
	<view class="diy-banner-box" >
		<swiper class="swiper"
		:indicator-dots="indicatorDots"
		:indicator-active-color="indicatorActiveColor"
		:autoplay="autoplay"
		:interval="interval"
		:duration="duration"
		@change="changeItem"
		:style="{height: itemData.style.height+'px'}">
			<swiper-item v-for="(item,index) in itemData.data" :key="index" @click="gotoPages(item)" :style="{height: itemData.style.height+'px'}">
				<image :src="item.imgUrl" mode="widthFill"  v-if="!item.type||item.type != 'video'"></image>
				<block v-if="item.type == 'video'">
					<video class="swiper-video" @play="playVideo" @pause="pauseVideo"  controls :src="item.video" :id="'myVideo_' + index"></video>
					<view class="wrap" @click="videoSta('myVideo_' + index)"></view>
					<view class="full" @click="videoFull('myVideo_' + index)"></view>
				</block>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	// import lModal from '@/components/l-modal.vue'
	export default{
		props:{
			swiperHeight:{
				type:Number,
				default:747
			},

			itemData:{
				type:Object,
				default:{}
			}, //轮播图速度
			interval:{
				type:Number,
				default:15000
			}
		},
		data(){
			return{
				videoStat: false,
				videoContext: '',
				indicatorDots: true,
				autoplay: true,
				duration: 500,
				indicatorActiveColor:'#ffffff',
				customBarH:'',
				intervalDefault:15000,
				share_title:""
			}
		},
		components:{
			// lModal
		},
		onShow() {
      console.log(this.itemData)
			this.intervalDefault=this.itemData.params.interval;
			this.indicatorActiveColor=this.itemData.style.btnColor;
		},
		methods:{
			playVideo(){
				this.autoplay = false;
			},
			pauseVideo(){
				this.autoplay = true;
			},
			videoFull(video_id) {
				let video = uni.createVideoContext(video_id, this)
				video.requestFullScreen({ direction: 0 })
			},
			videoSta(video_id) {
				let video = uni.createVideoContext(video_id, this)
				if (this.videoStat == false) {
					video.play()
					this.videoStat = true
				} else {
					video.pause()
					this.videoStat = false
				}
			},
			changeItem(e) {
				let self = this;
				this.itemData.data.forEach((item, index) => {
					if (item.type == 'video') {
						let video = uni.createVideoContext('myVideo_' + index, this)
						video.pause()
						self.autoplay = true;
					}
				})
			},
			/*跳转页面*/
			gotoPages(e){
				this.gotoPage(e.linkUrl);

			},

		},
		onReady(){
			uni.getSystemInfo({
				success: (e)=> {
					this.statusBarH = e.statusBarHeight
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect()
					this.customBarH = custom.bottom + custom.top - e.statusBarHeight-18+'px'

					// #endif

				}
			})
		},
	}
</script>

<style>
	.diy-banner-box,.diy-banner-box .swiper {
		width: 750rpx;
		/* height: 337rpx; */
	}

	.diy-banner-box swiper image {
		margin:0rpx 0rpx 10rpx 0;
		width: 750rpx;
		/* height: 342rpx; */
		/* border-radius: 16rpx; */
	}
	.share_image{
		width: 540rpx;
		height: 320rpx;
	}
	.swiper-video {
		width: 750rpx;
		height: 360rpx;
	}
	swiper-item {
		position: relative;
	}
	.wrap {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
	}
	.full {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 1000;
	}
</style>
