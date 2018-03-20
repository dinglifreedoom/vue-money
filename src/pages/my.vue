<template>
  <div class="my">
  	<div class="myTop">
  		<div class="tetxBox">
  			<p class="myName">
		  		<span>账户：</span>
		  		<span class="myMobile">{{mobile}}</span>
  			</p>
  			<p class="myOver">
		  		<span>余额：</span>
		  		<span class="overNumber">{{over}}元</span>
  			</p>
  		</div>
			<div class="btnBox">
				<router-link :to="{path:'/recharge'}">
	          <span class="btnLeft">充值</span>
	        </router-link>
	        <router-link :to="{path:'/moneyOut'}">
	          <span>提现</span>
	        </router-link>
			</div>
  	</div>
  	
  	<ul class="myType clearfix">
  		<li class="fl">
  			<i class="fl icon iconfont icon-xiugaimima"></i>
  			<span class="fl">修改密码</span>
  			<i class="arrows iconfont icon-youjiantou"></i>
  		</li>
  		<li class="fl">
  			<i class="fl icon iconfont icon-yinxingqia-copy"></i>
  			<span class="fl">绑定银行卡</span>
  			<i class="arrows iconfont icon-youjiantou"></i>
  		</li>
  		<li class="fl">
  			<i class="fl icon iconfont icon-iconfontzhizuobiaozhun023141"></i>
  			<span class="fl">资金记录</span>
  			<i class="arrows iconfont icon-youjiantou"></i>
  		</li>
  		<li class="fl">
  			<i class="fl icon iconfont icon-xiaofeijilu"></i>
  			<span class="fl">交易规则</span>
  			<i class="arrows iconfont icon-youjiantou"></i>
  		</li>
  		<li class="fl">
  			<i class="fl icon iconfont icon-wode1"></i>
  			<span class="fl">关于我们</span>
  			<i class="arrows iconfont icon-youjiantou"></i>
  		</li>
  		<li class="fl">
  			<i class="fl icon iconfont icon-21"></i>
  			<span class="fl">邀请获取奖励</span>
  			<i class="arrows iconfont icon-youjiantou"></i>
  		</li>
  	</ul>
  	<button class="myEnd" @click="exit()">退出登录</button>
  	<common-foot></common-foot>
  </div>
</template>

<script>
	import commonFoot from "../components/footers.vue";
	import {MessageBox} from 'mint-ui';

  export default {
	  name: 'my',
	  data () {
	    return {
	    	page: this.$store.commit('changePage','my'),	// 路由跳转的页面
	    	mobile: "18300613031"
	    }
	  },
	  computed:{
      over(){
      	return this.$store.state.user.money;
      }
  	},
	  // 添加的方法
	  methods: {
	  	exit:function(){
	      MessageBox.confirm('是否确定退出?', '提示').then(() => {
	        var self = this;
	        this.$store.commit("socketSend", { act:"user_logout" });	// 退出登录
	        self.$store.commit("outLogin", { type: "outLogin", msg: "退出成功" });
	      },function(){ });
    	}
		},
	  components: {
	    commonFoot
	  }
	}
</script>

<style lang="less" scoped>
	@white: #fff;
	@width: 100%;

	.myTop{
		width: @width;
		height: 3.08rem;
		font-size: 0.3rem;
		background: dodgerblue;
		position: relative;
		color: @white;
		margin-bottom: 0.2rem;
		background: url(../../static/myTopBg.png) no-repeat;
		background-size: cover;
		.tetxBox{
			position: absolute;
			top: 0.72rem;
			left: 0.76rem;
			.myName{
				margin-bottom: 0.2rem;
			}
			.myMobile,.overNumber{
				margin-left: 0.1rem;
			}
		}
		
		.btnBox{
			position: absolute;
			left: 50%;
			margin-left: -1.64rem;
			bottom: 0.38rem;
			width: 3.4rem;
			height: 0.5rem;
			span{
				text-align: center;
				display: inline-block;
				width: 1.58rem;
				height: 0.48rem;
				border: 0.01rem solid #fff;
				color: @white;
				border-radius: 0.3rem;
			}
			.btnLeft{
				margin-right: 0.12rem;
			}
		}
	}
	
	.myType{
		background: #0e0e0e;
		li{
			width: @width;
			height: 1rem;
			line-height: 1rem;
			font-size: 0.3rem;
			color: @white;
			padding-left: 0.2rem;
			border-bottom: 0.01rem solid #232323;
			.icon{
				font-size: 0.5rem;
				color: #f8d701;
				margin-right: 0.2rem;
			}
			.arrows{
				float: right;
				margin-right: 0.2rem;
			}
		}
	}
	
	.myEnd{
		display: block;
		margin: 0.38rem auto 0;
		text-align: center;
		width: 7rem;
		height: 1rem;
		line-height: 1rem;
		font-size: 0.3rem;
		color: #000;
		background: #f8d701;
		border-radius: 0.1rem;
	}

</style>