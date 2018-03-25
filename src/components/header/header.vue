<template>
    <div class="header">
      <div class="content-wrapper"> <!-- 内容区 -->
        <div class="avatar"> <!-- 头像 -->
          <img width="64" height="64" alt="" :src="seller.avatar">
        </div>

        <div class="content">
          <div class="title"> <!-- name -->
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description"> <!-- 配送/时间 -->
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="supports">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>

        <div v-if="seller.supports" class="support-count" @click="showDetail"> <!-- 数量按钮 -->
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="showDetail"> <!-- 公告区 -->
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background"> <!-- 背景 -->
        <img :src="seller.avatar" alt="" width="100%" height="100%">
      </div>
      <transition name="fade">
        <div v-show="detailShow" class="detail"> <!-- 详情弹出框 -->
          <div class="detail-wrapper clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper"> <!-- 星星组件 -->
                <star :size="48" :score="seller.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li class="supports-item" v-for="item in seller.supports" :key="item.type">
                  <span class="icon" :class="classMap[item.type]"></span>
                  <span class="text">{{item.description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideDetail">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>
    </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue'

  export default {
    props: { // 接收的数据seller
      seller: {
          type: Object // 属性object
      }
    },
    data () {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true;
      },
      hideDetail () {
        this.detailShow = false;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: { // 注册组件
      star
    }
  }
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .header
    position relative
    color:#fff
    overflow: hidden
    background: rgba(7, 17, 27, .5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            width: 30px
            height: 18px
            display: inline-block
            vertical-align: top
            bg-image('../../images/header/brand')
            background-size: 30px 18px
            bakground-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 10px
          ling-height: 12px
          font-size: 12px
        .supports
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('../../images/header/decrease_1')
            &.discount
              bg-image('../../images/header/discount_1')
            &.guarantee
              bg-image('../../images/header/guarantee_1')
            &.invoice
              bg-image('../../images/header/invoice_1')
            &.special
              bg-image('../../images/header/special_1')
          .text
            line-height: 12px
            font-size: 10px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background:rgba(0, 0, 0, .2)
        text-align: center
        .count
          vertical-align: top
          font-size: 10px
        .icon-keyboard_arrow_right
          margin-left: 2px
          line-height: 24px
          font-size: 10px
    .bulletin-wrapper
      position relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7, 17, 27, .2)
      .bulletin-title
        display: inline-block
        vertical-align top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('../../images/header/bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        margin: 0 4px
        font-size: 10px
        vertical-align top
      .icon-keyboard_arrow_right
        position absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index -1
      filter:blur(10px)
    .detail
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: auto
      backdrop-filter: blur(10px)
      opacity: 1
      background: rgba(7, 17, 27, .8)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .detail-wrapper
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align center
            font-size: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align center
          .title
            display flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position relative
              top: -6px
              border-bottom: 1px solid rgba(255, 255, 255, .2)
            .text
              padding: 0 12px
              font-size: 14px
              font-weight: 700
          .supports
            width: 80%
            margin: 0 auto
            .supports-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('../../images/header/decrease_2')
                &.discount
                  bg-image('../../images/header/discount_2')
                &.guarantee
                  bg-image('../../images/header/guarantee_2')
                &.invoice
                  bg-image('../../images/header/invoice_2')
                &.special
                  bg-image('../../images/header/special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
      .detail-close
        position relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size: 32px
</style>
