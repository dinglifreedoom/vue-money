<template>
  <div class="moneyOut">
  	<mt-popup v-model="popupVisible" popup-transition="popup-fade" :closeOnClickModal="false">
  		<p>你还没有可用于提现的银行卡，请先添加一张储蓄卡。</p>
  		<router-link tag="span" :to="{path:'/my'}" class="fl popupClose">取消</router-link>
  		<router-link tag="span" :to="{path:'/bindCard'}" class="fr popupAdd">添加银行卡</router-link>
  	</mt-popup>
  	<div v-if="isBank">
	  	<div class="monOut-card">
	  		<p class="card-type">{{bankName}}</p>
	  		<p class="card-number">尾号{{bankNum}}储蓄卡</p>
	  	</div>
	  	<div class="monOut-box">
	  		<p class="money-font">提现金额</p>
	  		<div class="money-input">
	  			<span class="fl input-font">￥</span>
	  			<input class="fl input-line" v-model="outMoney" type="number" />
	  		</div>
	  		<p class="money-font money-over clearfix">
		  		<span class="fl">可用余额：</span>
		  		<span class="fl over-number">{{myMoney}}元</span>
		  		<span class="over-right" @click="allMoney()">全部提现</span>
	  		</p>
	  	</div>
	  	<div class="monOut-fees">
	  		<span>提现手续费：</span>
	  		<span class="over-number">{{fees}}</span>
	  	</div>
	  	<button class="monOut-ok" @click="out()">提现</button>
	  	<common-foot></common-foot>
  	</div>
  </div>
</template>

<script>
	import commonFoot from "../components/footers.vue";
	import {Toast} from 'mint-ui';
	import {Popup} from 'mint-ui';
	import {Indicator} from 'mint-ui';
	
	export default {
	  name: 'moneyOut',
	  data () {
	    return {
	    	page: this.$store.commit('changePage', 'my'),
	    	outMoney: "",
				fees: "0.6%",
//    	bankName: "郑州农村信用社",
//    	bankNum: "6524",
				bankName: "",
      	bankNum: "",
      	popupVisible: "",				// 是否关闭模态框
				isBank: "",							// 是否已经绑定银行卡
	    }
	  },
	  // 计算
  	computed: {
	    myMoney() {
	    	return this.$store.state.user.canUseMoney;
	    }
    },
    // 监听数据变化 
	  watch: {
	    // 输入金额的判断
	    outMoney: function () {
	     	this.outMoney = this.numLength(this.outMoney, 2);
	   	}
	  },
	  // 在模板渲染成html前调用
	  created() {
	  	// 模拟登录
	  	this.$store.commit("socketSend", {
			  act: "user_login",
			  data: {
			  	"userName": "18300613031",
			  	"password": "521314"
			  }
	    },function (res) {
	    	console.log(res);
	    });
	    this.$store.commit("socketSend", { act: "user_getInfo" });
	    if (this.$store.state.banks.bankCard) {
	      this.bankName = this.$store.state.banks.banks[this.$store.state.banks.bankCode];
	      this.bankNum = this.$store.state.banks.bankCard;
	      this.isBank = true;					// 已绑卡
	      this.popupVisible = false;	// 关闭模态框
	    }else{												
	      this.isBank = false;				// 未绑卡
	      this.popupVisible = true;		// 打开模态框
	    }
	  },
	  // 添加的方法
	  methods: {
   		// 点击 -- 全部提现
	    allMoney() {
	      var x = this.myMoney;
	      if(x == undefined) {
	      	return;
	      }
	      if (x.toString().lastIndexOf('.') == -1) {
	        var f = x;
	      } else {
	        var f = x.toString().substring(0, x.toString().lastIndexOf('.') + 3);
	      }
	      var s = f.toString();
	      var rs = s.indexOf('.');
	      if (rs < 0) {
	        rs = s.length;
	        s += '.';
	      }
	      while (s.length <= rs + 2) {
	        s += '0';
	      }
	      this.outMoney = s;
	    },
   		// 申请提现
	    out() {
	      var self = this;
	      // 判断输入金额是否大于余额
	      if (self.outMoney　>　self.myMoney) {
	     		Toast({ message: "余额不足", duration: 1600 });
	     		return;
	     	}
	      if(!this.isBank){
        	Toast({ message: "请先绑定银行卡", duration: 1600 });
      	} else if (isNaN(self.outMoney) || this.outMoney < 0.01) {
	        Toast({ message: "请输入一个大于0.01的数字", duration: 1600 });
	      } else {
	        Indicator.open();
	        self.$store.commit("socketSend", {
	          act: "moneyOut_ask",
	          data: {
	            money: self.outMoney
	          },
	          fn: function (res) {
	            Indicator.close();
	            if (res.isOk) {
	              Toast({ message: res.msg, duration: 1600 });
	              setTimeout(function () {
	                self.$router.push("/my");
	              }, 1600);
	            }else {
	              Toast({ message: res.msg, duration: 1600 });
	            }
	          }
	        });
	      }
	    }
		},
		// 引入组件
	  components: {
	    commonFoot
	  }
	}
</script>

<style lang="less" scoped>
	@white: #fff;
	@width: 100%;
	
	/*模态框*/
	.mint-popup{
		width: 6rem;
		height: 3rem;
		padding: 0.4rem;
		border-radius: 0.2rem;
		font-size: 0.32rem;
		p{
			width: @width;
			height: 1.8rem;
		}
		.popupClose, .popupAdd{
			width: 48%;
			text-align: right;
		}
		.popupAdd{
			color: red;
		}
	}
	.popupAdd{
		color: #f4ea2a;
	}

	.monOut-card{
		width: @width;
		height: 1rem;
		margin: 0.2rem 0;
		padding: 0.14rem 0 0 0.22rem;
		font-size: 0.3rem;
		color: @white;
		background: #313131;
		.card-type{
			line-height: 0.4rem;
		}
		.card-number{
			color: #999;
			font-size: 0.2rem;
			line-height: 0.32rem;
		}
	}
	.monOut-noCard{
		width: @width;
		height: 1rem;
		line-height: 1rem;
		margin: 0.2rem 0;
		padding-left: 0.22rem;
		font-size: 0.3rem;
		color: @white;
		background: #313131;
	}
	
	.monOut-box{
		width: @width;
		height: 2.68rem;
		color: @white;
		background: #313131;
		padding-left: 0.22rem;
		.money-font{
			font-size: 0.3rem;
			height: 0.8rem;
			line-height: 0.8rem;
		}
		.money-input{
			width: @width;
			height: 1.03rem;
			.input-font{
				font-size: 0.9rem;
				width: 15%;
				height: 100%;
			}
			.input-line{
				padding-left: 0.2rem ;
				width: 85%;
				height: 100%;
				font-size: 0.8rem;
				color: @white;
				background: #313131;
				border-bottom: 0.01rem solid #666;
			}
		}
		.money-over{
			.over-right{
				float: right;
				color: #f4ea2a;
				margin-right: 0.2rem;
			}
		}
	}
	
	.monOut-fees{
		width: @width;
		height: 1.08rem;
		line-height: 1.08rem;
		padding-left: 0.22rem;
		font-size: 0.28rem;
		color: @white;
	}
	
	.monOut-ok{
		display: block;
		margin: 1.22rem auto 0;
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