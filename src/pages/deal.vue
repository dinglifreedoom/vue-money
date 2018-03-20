<template>
  <div class="deal">
    <p>交易</p>
    <common-foot></common-foot>
  </div>
</template>

<script>
import commonFoot from "../components/footers.vue"
export default {
  name: 'deal',
  data () {
    return {
      page: this.$store.commit("changePage", "deal"),
    }
  },
  components: {
    commonFoot
  }
}
</script>

<style lang="less" scoped>

</style>