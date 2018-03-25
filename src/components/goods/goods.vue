<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper"> <!-- 左侧列表 -->
        <ul>
          <li v-for="(item,index) in goods" :key="item.id" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)" ref="menuList">
            <span class="text border-1px">
              <span v-show="item.type > 0" :class="classMap[item.type]" class="icon"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodWrapper"> <!-- 右侧商品 -->
        <ul>
          <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food, $event)" v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.desciption}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评{{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper"> <!-- 增加删除组件 -->
                    <!-- 父组件使用 @add="addFood"监听由子组件vm.
                    $emit触发的事件，通过addFood()接受从子组件传递过来的数据，通知父组件数据改变了 -->
                    <cartcontrol :food="food" @add="addFood"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScoll from 'better-scroll'
  // 下方购物车组件
  import shopcart from '../shopcart/shopcart.vue'
  // 增加减少按钮组件
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  // 商品详情组件
  import food from '../food/food.vue'

  const ERR_OK = 0;
  const debug = process.env.NODDE_ENV !== 'production';
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [], // 用来存储foods区域的各个区块的高度（clientHeight）
        scrollY: 0, // 用来存储foods区域的滚动的Y坐标
        selectedFood: {}
      }
    },
    computed: { // 计算属性
      currentIndex () { // 计算到达哪个区域的区间的时候的对应的索引值
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]; // 当前menu子块的高度
          let height2 = this.listHeight[i + 1]; // 下一个高度
          // 滚动到底部的时候，height2为undefined，需要考虑这种情况
          // 需要确定是在两个menu子块的高度区间
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            this._followScroll(i);
            return i; // 返回menu子块的索引
          }
        }
        return 0;
      },
      selectFoods () { // 将所有的goods.food添加一个count属性，方便运算
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      const url = debug ? 'api/goods' : 'http://ustbhuangyi.com/sell/api/goods';
      this.$http.get(url).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll(); // 调用滚动dom
            this._calculatteHeight(); // 计算高度
          })
        }
      })
    },
    methods: {
      _initScroll () { // 插件使用
        this.menuScroll = new BScoll(this.$refs.menuWrapper, {
          click: true // 结合BScroll的接口使用,是否将click事件传递,默认被拦截了
        });
        this.foodScroll = new BScoll(this.$refs.foodWrapper, {
          click: true,
          probeType: 3 // 结合BScroll的接口使用,3实时派发scroll事件
        });
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)); // 滚动坐标会出现负的,并且是小数,所以需要处理一下
        })
      },
      _calculatteHeight () { // 两侧高度高亮计算
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight; // 累加每个li的高度
          this.listHeight.push(height);
        }
      },
      selectMenu (index, event) { // 点击左侧菜单，跳转到右侧对应商品
        if (!event._constructed) { // 忽略掉BScoll的事件
          return false;
        }
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el, 300); // 类似jump to的功能,通过这个方法,跳转到指定的dom
      },
      selectFood (food, event) { // 点击商品时，将该商品的信息传递到food组件
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$nextTick(() => {
          this.$refs.food.show(); // 调用food组件下的show方法
        })
      },
      addFood (target) { // add方法
        this._drop(target);
      },
      _drop (target) { // 异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target); // 访问shopcart子组件，调用shopcart的下落动画
        })
      },
      _followScroll (index) {
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.menuScroll.scrollToElement(el, 300, 0, -100);
      }
    },
    components: { // 注册组件
      shopcart,
      cartcontrol,
      food
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 15px
        &.current
          position relative
          z-index: 10
          margin-top: -1px
          font-weight: 700
          background: #fff
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('../../images/goods/decrease_3')
          &.discount
            bg-image('../../images/goods/discount_3')
          &.guarantee
            bg-image('../../images/goods/guarantee_3')
          &.invoice
            bg-image('../../images/goods/invoice_3')
          &.special
            bg-image('../../images/goods/special_3')
        .text
          display table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, .1))
    .foods-wrapper
      flex: 1
      .title
        padding-left 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
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
            right: 0
            bottom: 12px
</style>
