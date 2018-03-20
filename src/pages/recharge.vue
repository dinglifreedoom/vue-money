<template>

  <div class="recharge">
  	<p class="rec-p">
  		<span>账户：</span>
  		<span>{{userName}}</span>
  	</p>
  	<p class="rec-p p-over">
  		<span>当前可用余额：</span>
  		<span class="over-number">{{over}}元</span>
  	</p>
  	<div class="rec-moneys clearfix">
  		<button :class="['fl', {selected: item===moneyIn}]" v-for="(item,index) in moneys" :key="index" @click="btn(item)">{{item}}元</button>
  		<input :class="['fl', {selected: moneyIn===''}]" placeholder="请输入金额" v-model="moneyMore" type="number" @click="moneyIn=''"></input>
  	</div>
  	<p class="rec-p p-fees">
  		<span>充值手续费：</span>
  		<span>{{fees}}</span>
  	</p>
  	<div class="rec-pay clearfix">
	    <div :class="['fl clearfix', {cardBg: num===item.code}]" v-for="(item,index) in channelList" :key="index" @click="channel(item)">
	      <img class="pay-img" :src="item.imgUrl" alt="">
	      <marquee scrollamount="3" direction="left" class="txt" v-if="flag==item.name" style="width: 50%;">{{item.name}}</marquee>
	      <span class="pay-name" v-if="flag!=item.name">{{item.name}}</span>
	    </div>
	    <div style="font-size: 14px; text-align: -webkit-center; padding-bottom: 15px; height: 10rem;" v-if="isNoZF">暂无支付方式!</div>
	  </div>
	  <form id="rechargeForm" method="post" onsubmit="return false" :action="sendUrl">
	    <input type="text" name="userName" v-model="userName" v-show="false"/>
	    <input type="text" name="money" v-model="affrim" v-show="false"/>
	    <input type="text" name="channelCode" v-model="num" v-show="false"/>
	    <button class="rec-ok" type="button" @click="submit()">充值</button>
	  </form>
	  <common-foot></common-foot>
  </div>
</template>

<script>
	import commonFoot from "../components/footers.vue";
	import {Toast} from 'mint-ui';
	
	export default {
	  name: 'recharge',
	  data () {
	    return {
	    	page: this.$store.commit('changePage', 'my'),
	    	userName: "18300613031",
//	    	user: this.$store.state.user.userName,
	    	over: "0.00",					// 账户余额
				moneys: [300, 500, 800, 1000, 1500], //固定金额
				moneyIn: 300,					// 默认金额
				moneyMore: "",				// 其他金额
				fees: "0.6%",					// 手续费
				num: "",							// 支付方式
				flag: "",
				isNoZF: false
	    }
	  },
	  // 监听数据变化 
	  watch:{
	  	// 其他金额
	    moneyMore: function(){
	    	this.moneyMore = this.numLength(this.moneyMore, 2);
//	    	console.log(this.moneyMore);
	    },
	    channelList: function(val){
	     	if(val.length == 0){
	     		this.isNoZF = true;
	     	}
	    }
	  },
	  // 在模板渲染成html前调用
	  created: function(){
	  	// 模拟登录
	  	this.$store.commit("socketSend", {
			  act: "user_login",
			  data: {
			  	"userName": "18300613031",
			  	"password": "521314"
			  }
	    },function(res){
	    	console.log(res);
	    });
	  	// 获取支付渠道
	    this.$store.commit("socketSend", { act: "money_inChannelList" });
	  },
	  // 计算
	  computed: {
	  	channelList: function(){
	  		return  this.$store.state.channel;
	  	},
	    sendUrl: function(){
	      let sendUrl = "http://" + this.$store.state.url + "/moneyIn/pay";
	      return sendUrl;
	    },
	  	//监听充值金额变化
	    affrim: function(){
		    if(this.moneyIn && !this.moneyMore){
          this.money = parseFloat(this.moneyIn);
        }else{
		      this.money = parseFloat(this.moneyMore);
		    }
		    return this.money;
			}
	  },
	  // 添加的方法
	  methods: {
	  	// 选择的金额数量
	  	btn: function(item){
	      this.moneyIn = item;
	      this.moneyMore = null;
	   	},
	   	// 选择的支付方式
	   	channel: function(item){
	   		this.flag = item.name;
        this.num = item.code;
	    },
	    // 点击充值
	    submit: function(){
	      if(this.money <= 0){
	        Toast({ message: "充值合计金额不能低于0", duration: 1600 });
	      }else if(this.num==""){
	        Toast({ message: "请选择支付方式", duration: 1600 });
	      }else{
	        document.getElementById("rechargeForm").submit();
	      }
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
	
	.rec-p{
		padding: 0.39rem 0 0.39rem 0.18rem;
		width: @width;
		font-size: 0.3rem;
		color: @white;
		border-bottom: 0.02rem solid #1c1c1c;
	}
	
	.p-over{
		padding: 0.42rem 0.18rem;
		border: none;
		.over-number{
			color: #ff0000;
		}
	}
	
	.p-fees{
		padding: 0.22rem 0 0.58rem 0.18rem;
		border: none;
	}
	
	.rec-moneys{
		width: @width;
		padding-left: 0.12rem;
		font-size: 0.3rem;
		.fl{
			text-align: center;
	    width: 1.84rem;
	    height: 0.72rem;
	    line-height: 0.72rem;
	    color: @white;
	    border-radius: 0.1rem;
	    background: #434343;
	    margin: 0 0.24rem 0.18rem;
	  }
	  >button.selected{
	  	background: #f4ea2a;
	  	color: #000;
	  }
	  >input.selected{
	    background: #ddd;
	   	color: #000;
	  }
	}
	
	.rec-pay{
		width: @width;
		.fl{
	    width: 3.53rem;
	    height: 1.2rem;
	    line-height: 1.2rem;
	    font-size: 0.3rem;
	    color: @white;
	    border: 0.01rem solid #434343;
	    border-radius: 0.1rem;
	    background: #434343;
	    margin: 0 0 0.24rem 0.15rem;
	    .pay-img,.pay-name{
	    	float: left;
	    	text-align: center;
	    }
	  }
	  .cardBg{
	  	border: 0.01rem solid #f4ea2a;
	  }
	}
	
	.pay-img{
		width: 1.3rem;
		height: 1rem;
		margin: 0.09rem;
	}
	
	.pay-name{
		width: 50%;
		height: 100%;
	}
	
	.rec-ok{
		display: block;
		margin: 0.6rem auto 0;
		text-align: center;
		width: 6.5rem;
		height: 1rem;
		line-height: 1rem;
		font-size: 0.3rem;
		color: #000;
		background: #f4ea2a;
		border-radius: 0.1rem;
	}
</style>