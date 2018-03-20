<template>
  <div class="index">
    <p class="title">行情</p>
    <div class="tableTop clear">
    	<span class="show-left">全部</span>
    	<ul class="show-right clear">
    		<li>现价</li>
    		<li>最高</li>
    		<li>最低</li>
    	</ul>
    </div>
    <ul id="table-content" class="table-content clear">
    	<li v-for="(item,index) in codeType" class="content-li" @click="checked(item)" :key="index">
    		<span class="show-left li-left">{{item.name | regCode}}</span>
    		<ul class="show-right li-right clear">
	    		<li>{{item.nowPrice}}</li>
	    		<li>{{item.nowPrice}}</li>
	    		<li>{{item.nowPrice}}</li>
	    	</ul>
    	</li>
    </ul>
    <common-foot></common-foot>
  </div>
</template>

<script>
import Vue from 'vue';
import commonFoot from "../components/footers.vue";
import commonHead from "../components/headers.vue"
export default {
  name: 'index',
  data () {
    return {
      page: this.$store.commit('changePage','index'),
      codeType: [], //数据品种类型
    }
  },
  // 添加的方法
  methods: {
    getFloat: function(num, place){   //保留行情精度
     var b = parseFloat(num).toFixed(place + 1);
     var result = b.substring(0, b.toString().length - 1);
     return result;
    },
    checked(data){      //当前选中的商品
      this.$store.state.b2bOne = data;
      this.$router.push("/kline");
    },
  },
  // 计算
  computed: {
    kline(){
    	return this.$store.state.kline;
    }
  },
  // 监听数据变化
  watch: {
   
  },
  // 在模板渲染成html前调用
  created(){
    var self = this;
    self.$axios.get('b2bProduct/list', {   //获取交易品种
      params: {
        pageNo: self.pageNo,
        pageSize: 10
    	}
    }).then(function (res) {
      var list = res.data.pageBean.data;
      //    console.log(list);
      for(var i = 0; i < list.length; i++){   //设置品种价格
        self.codeType.push({})
        Vue.set(self.codeType[i], 'name', list[i].currencyPairCode);
        Vue.set(self.codeType[i], 'nowPrice', list[i].srcPrice);
        Vue.set(self.codeType[i], 'decimalPlace', list[i].decimalPlace);
      }
      self.$store.state.codeList=self.codeType;
      self.$watch("kline", function(val){   //主动开启监听
        var arr = val.split("|");
        for(var i = 0; i < self.codeType.length; i++){
          if(arr[0] == self.codeType[i].name){
            self.codeType[i].nowPrice = self.getFloat(arr[1], self.codeType[i].decimalPlace);
          }
        }
      }, {deep: true})
      if(!self.$store.state.b2bOne.name){
      	self.$store.state.b2bOne = self.codeType[0];
      }
    }).catch(function (error) {});
  },
  // 在模板渲染成html后调用
  mounted(){
			
  },
  components: {
    commonFoot,
    commonHead
  }
}
</script>
<style lang='less' scoped >
    @white: #fff;
    @width: 100%;

    
    .title{
    	text-align: center;
    	width: @width;
    	height: 0.88rem;
    	background: #18232f;
    	line-height: 0.88rem;
    	font-size: 0.34rem;
    	color: @white;
    }
    .tableTop{
    	width: @width;
    	height: 1.02rem;
    	line-height: 1.02rem;
    	color: @white;
    	font-size: 0.34rem;
      >.show-right{
        li:nth-child(1){
         background: #7a7515;
        }
        li:nth-child(2){
         background: #5c0000;
        }
        li:nth-child(3){
         background: #1a7443;
        }
      }
    }
		.show-left{
			float: left;
			margin-left: 0.2rem;
		}
		.show-right{
			float: right;
			margin-top: 0.21rem;
			margin-right: 0.2rem;
		}
    .show-right li{
    	float: left;
    	margin-left: 0.07rem;
			text-align: center;
			width: 1.6rem;
			height: 0.6rem;
			line-height: 0.6rem;
			font-size: 0.28rem;
	  	border-radius: 0.05rem;			
    }
    .table-content{
    	width: @width;
    	font-size: 0.3rem;
    	.content-li{
    		height: 1rem;
    		line-height: 1rem;
    		border-bottom: 0.01rem solid #232323;
    		.li-left{
    			color: @white;
    		}
    	}
      .content-li:nth-child(2n){
          color: #3fe88b;
      }
      .content-li:nth-child(2n+1){
          color: #FD0E0E;
      }
    }
    
</style>
