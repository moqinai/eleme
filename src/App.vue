<template>
  <div id="app">
    <v-header :seller="seller"></v-header><!-- 头部 -->
     <!-- tab切换 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 内容 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import { urlParse } from './common/js/util.js'
  import header from './components/header/header.vue'

  const ERR_OK = 0;
  const debug = process.env.NODE_ENV !== 'production';

  export default {
    data () {
      return {
        seller: {
          id: (() => { // 立即执行函数
            /* 从地址栏中的url中获取ID */
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      }
    },
    created () {
      const url = debug ? '/api/seller' : 'http://ustbhuangyi.com/sell/api/seller';
      this.$http.get(url + '?id=' + this.seller.id).then((response) => {
        response = response.body; // 获取到数据
        if (response.errno === ERR_OK) {
          /* 防止id覆盖，使用es6的一个语法：扩展了对象的属性，再原来的基础上添加response.data的值，不会覆盖原来的id属性 */
           this.seller = Object.assign({}, this.seller, response.data);
          // this.seller = response.data;
          /* console.log(this.seller); */
        }
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'

  .tab
    display: flex
    width:100%
    height:40px
    line-height:40px
    //border-bottom: 1px solid rgba(7,17,27,0.1)
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex:1
      text-align:center
      & > a
        display: block
        text-decoration: none
        color: rgb(77,85,93)
        &.active
          color: rgb(240,20,20)
</style>
