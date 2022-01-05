<template>
  <view>
    <!--图标入口-->
    <view :class="'diy-navbar' + ' column-'+itemData.style.rowsNum" :style="{background:itemData.style.background}">
      <view class="item" v-for="(item, index) in itemData.data" :key="index" :style="'width:'+item_width+';'" @click="gotoDetail(item)">
        <!-- #ifdef MP -->
        <button v-if="item.linktype == 'service' && item.type=='chat'" type="default" open-type="contact" session-from="wxapp" class="contract-btn"></button>
        <!-- #endif  -->
        <image v-if="Number(item.icon_type) === 20" :src="item.imgUrl" mode="widthFix"></image>
        <view v-else class="navbar-icon-box" :style="{'background': Number(item.colorConf) === 20 ? 'linear-gradient(135deg, '+item.color1+' 10%, '+item.color2+' 70%, '+item.color3+' 90%)' : item.solidColor}">
          <i :class="item.icon"></i>
        </view>
        <text class="gray3" :style="{color:item.font_color}">{{ item.text }}</text>
        <i class="icon iconfont2 icon-right"></i>
      </view>
    </view>
  </view>
</template>

<script>
import 'common/iconfont.css'
import Icp from "@/plus/pages/icp/icp";

export default {
  components: {Icp},
  data() {
    return {
      //单个宽度
      item_width: '25%'
    }
  },
  props: ['itemData'],
  created() {
    this.item_width = 100 / Math.abs(this.itemData.style.rowsNum) + '%';
  },
  methods: {

    /*跳转页面*/
    gotoDetail(e) {
      if (e.appid != undefined && e.appid != '') {
        // 跳转其他小程序
        uni.navigateToMiniProgram({
          // #ifdef MP
          appId: e.appid,
          path: e.linkUrl != undefined ? e.linkUrl : '',
          // #endif
        })
      } else if (e.linkUrl) {
        this.gotoPage(e.linkUrl);
      } else if (e.linktype === 'service' && e.type === 'phone' && e.phone_num) {
        this.callPhone(e)
      }
    },
    callPhone(e) {
      uni.makePhoneCall({
        phoneNumber: e.phone_num
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../card/statics/5.css";

.column-1 .item {
  border-bottom: #f2f2f2 1px solid;
  display: flex;
  margin: 20rpx 35rpx;
  justify-content: space-between;
  align-items: center;

  image {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
  }

  .navbar-icon-box {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    color: #ffffff;
    text-align: center;

    i {
      font-size: 45rpx;
      color: #ffffff;
      line-height: 60rpx;
    }
  }

  .gray3 {
    line-height: 60rpx;
    flex: 0.9 1 auto;
  }

  .icon-right {
    line-height: 60rpx;
    color: #c9c9c9;
    font-size: 24rpx;
  }
}

.diy-navbar {
  margin: 20rpx;
  padding: 20rpx 0;
  border-radius: 20rpx;
  background: #FFFFFF;
  box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.diy-navbar .item {
  position: relative;
}
.contract-btn {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
}

.column-3.diy-navbar, .column-4.diy-navbar, .column-5.diy-navbar {
  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20rpx;
    width: 120rpx;
    height: 180rpx;

    .icon-right {
      display: none;
    }

    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }

    .navbar-icon-box {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      color: #ffffff;
      text-align: center;

      i {
        font-size: 55rpx;
        color: #ffffff;
        line-height: 80rpx;
      }
    }

    text {
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      line-height: 80rpx;
      font-size: 28rpx;
      text-align: center;
    }
  }
}
</style>
