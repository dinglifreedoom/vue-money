<template>
  <div class="header">
    <mt-header :title="title" class="head">
      <router-link to="" slot="left">
        <mt-button icon="back" class='back' @click='back'></mt-button>
      </router-link>
      <mt-button slot="right">
        <slot></slot>
      </mt-button>
    </mt-header>
  </div>
</template>

<script>

export default {
  name: 'headers',
  data () {
    return {
        title:'多元化交易平台',
    }
  },
  methods:{
    back: function () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="less" scoped>
    .head {
      height: 1rem;
      line-height: 1rem;
      background: #3a3a3a;
      font-size: 0.36rem;
      color: white;
      h1{
        font-family: 'PingFang';
      }
      button {
        padding: 0 0.37rem !important;
        height: 1rem;
        i {
          font-size: 0.36rem;
        }
      }
    }
</style>