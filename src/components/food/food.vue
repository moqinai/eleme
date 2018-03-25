/* 商品详情组件 */
<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header"> <!-- 图片头部 -->
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content"> <!-- 信息内容 -->
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
           <div class="cartcontrol-wrapper"> <!-- 加减小球动画 -->
            <cartcontrol :food="food" @add="addFood"></cartcontrol>
          </div>
          <transition name="fade"> <!-- 加入购物车 -->
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split> <!-- 分割组件 -->
          <div class="info" v-show="food.info"> <!-- 商品介绍 -->
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect @increment="incrementTotal" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
            <div class="rating-wrapper"><!-- 商品评价 -->
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="(rating, index) in food.ratings" :key="index">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import {formatDate} from '../../common/js/date.js'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL, // 默认选择类型
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show () { // 显示详情方法
        this.showFlag = true;
        this.selectType = ALL; // 将这两个状态保持初始化
        this.onlyContent = true;
        this.$nextTick(() => { // 加载完成之后
          if (!this.scroll) { // 判断BScroll是否初始化，如果没有则调用_this.scroll.refresh()方法来重新计算，确保滚动效果正常
            this.scroll = new BScroll(this.$refs.food, {
              click: true // 结合BScroll的接口使用,是否将click事件传递,默认被拦截了
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide () { // 隐藏方法
        this.showFlag = false;
      },
      addFirst (event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('add', event.target); // 访问小球动画
        Vue.set(this.food, 'count', 1); // 设置count属性
      },
      addFood (target) {
        this.$emit('add', event.target); // 访问小球动画
      },
      incrementTotal (type, data) { // 接收的方法
        console.log(type);
        console.log(this[type])
        this[type] = data;
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      },
      /* selectRating (type) { // 接收ratingselect子组件传递来的select方法处理事件
        this.selectType = type; // 设置状态
        this.$nextTick(() => { // 切换时重新刷新bscroll
          this.scroll.refresh();
        })
      },
      toggleContent () { // 接收ratingselect子组件传递来的toggleContent方法处理事件
        this.onlyCntent = !this.onlyContent; //  取反
        this.$nextTick(() => { // 切换时重新刷新bscroll
          this.scroll.refresh();
        })
      }, */
      needShow (type, text) { // 评价过滤方法
        if (this.onlyContent && !text) { // 判断是否显示内容 且没有内容
          return false;
        }
        if (this.selectType === ALL) { // 如果是所有
          return true;
        } else {
          return type === this.selectType; // 否则显示的与选择的保持一致
        }
      }
    },
    filters: { // 过滤
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all .2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100% /* 使它看上去宽高相等 */
      & > img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 10px
        border: 1px solid #fff;
        border-radius: 50%;
        background: rgba(7, 17, 27, .6);
        .icon-arrow_lift
          display: block
          padding: 8px
          font-size: 15px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      font-size: 10px
      border-radius: 12px
      color: #fff
      background: rgb(0, 160, 220)
      opacity: 1
      &.fade-enter-active, &.fade-leave-active
        transition: all .2s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, .1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
