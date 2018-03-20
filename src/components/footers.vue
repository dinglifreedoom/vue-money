<template>
  <div class="footer">
    <mt-tabbar  class="foot" v-model="selected">
      <mt-tab-item id="index" @click.native="go('/index')">
        <i class="iconfont icon-hangqing-zi"></i>
        <div>行情</div>
      </mt-tab-item>
      <mt-tab-item id="kline" @click.native="go('/kline')">
        <i class="iconfont icon-tuceng"></i>
        <div>图表</div>
      </mt-tab-item>
      <mt-tab-item id="deal" @click.native="go('/deal')">
        <i class="iconfont icon-jiaoyi"></i>
        <div>交易</div>
      </mt-tab-item>
      <mt-tab-item id="order" @click.native="go('/order')">
        <i class="iconfont icon-lishi"></i>
        <div>历史</div>
      </mt-tab-item>
      <mt-tab-item id="my" @click.native="go('/my')">
        <i class="iconfont icon-wode"></i>
        <div>我的</div>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
export default {
  name: 'footers',
  data () {
    return {
      selected: this.$store.state.page
    }
  },
  methods: {
    go: function (path, type) {
      this.page = this.$store.state.page;
      this.$router.push(path);
      this.$store.commit("changePathRoute", path);
    }
  }
}
</script>

<style lang="less">
@maincolor:#fedc00;
.foot {
  background: #18232f;
  // border-top: 0.01rem solid #ccc;
  position: fixed;
  left: 0;
  bottom: 0;
  height:1rem;
  z-index: 99;
  color:#dbdbdb;
  font-size:.22rem;
  .is-selected {
    background: #18232f !important;
    i,
    div {
      color: @maincolor;
    }
  }
  >a {
    height: 49px;
    padding: 6px 0;
    .mint-tab-item-label {
      i {
        display: block;
        font-size: 19px;
        line-height: 19px;
      }
      div {
        margin-top: 4px;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
</style>