<template><!-- 星星等级评分组件 -->
 <div class="star" :class="starType">
   <span v-for="itemClass in itemClasses" :key="itemClass.id" :class="itemClass" class="star-item"></span>
 </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5; // 数量
  const CLS_ON = 'on'; // 状态全
  const CLS_HALF = 'half'; // 状态半
  const CLS_OFF = 'off'; // 状态无

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: { // 计算属性
        starType () {
          return 'star-' + this.size;
        },
        itemClasses () {
          let result = [];
          let score = Math.floor(this.score * 2) / 2; // 向下取0.5倍数
          let hasDecimal = score % 1 !== 0; // 判断是整数还是小数
          let integer = Math.floor(score); // 向下取整
          for (let i = 0; i < integer; i++) {
            result.push(CLS_ON); // 多少个全星
          }
          if (hasDecimal) {
            result.push(CLS_HALF); // 是否有半星
          }
          while (result.length < LENGTH) { // 有长度不执行，无长度则执行
            result.push(CLS_OFF);
          }
          return result;
        }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size: 0
    .star-item
      display inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('../../images/star/star48_on')
        &.half
          bg-image('../../images/star/star48_half')
        &.off
          bg-image('../../images/star/star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('../../images/star/star36_on')
        &.half
          bg-image('../../images/star/star36_half')
        &.off
          bg-image('../../images/star/star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('../../images/star/star24_on')
        &.half
          bg-image('../../images/star/star24_half')
        &.off
          bg-image('../../images/star/star24_off')
</style>
