<template>
  <div class="page-popup" v-if="clseModels">
    <mt-popup v-model="popupVisible1" popup-transition="popup-fade" class="mint-popup-1" :closeOnClickModal= "false">
    	<div class="loginBox clearfix" v-if="showLogin">
    		<p class="fl clearfix">
    			<a @click="openRegM" class="register fl">注册</a>
    			<img src="../../static/close.png" class="close fr" @click="clseModel" />
    		</p>
    		<p class="loginInput userInput fl">
	    			<label for="userName">账户名</label>
	    			<input type="text" id="userName" placeholder="请输入您的账户名" @focus="userSty = true" :class="userSty?'addBd':'bd'" v-model="userName" />
    		</p>
    		<p class="loginInput fl">
 	    			<label for="password">密&nbsp;&nbsp;&nbsp;码</label>
	    			<input type="password" id="password" placeholder="请输入您的密码" @focus="psdSty = true" :class="psdSty?'addBd':'bd'" v-model="password" />
    		</p>
				<p class="fl clearfix">
					<input type="checkbox" class="rememberPwd fl" id="rememberPwd" :checked="isChecked" @click="checked()">
    			<label class="fl" for="rememberPwd">记住密码</label>
    			<a @click="openPwds" class="forgetPwd fr">忘记密码?</a>
				</p>
				<button class="loginOk" type="button" @click="login">确定</button>
    	</div>
    	<my-reg v-if="openRM" v-on:child-say="listenToMyBoy"></my-reg>
    	<my-pwd v-if="openPwd" v-on:child-says="listenToMyPwd"></my-pwd>
    </mt-popup>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import {Popup} from 'mint-ui';
  import {Indicator} from 'mint-ui';
	import myReg from "../components/reg.vue";
	import myPwd from "../components/forgetPsd.vue";

	export default {
	  name: 'login',
	  data () {
	    return {
        userName: '',
        password: '',
        popupVisible1: false,												// 默认关闭模态框
        clseModels: true,														// 判断是否显示模态框
        showLogin: this.$store.state.closeLogin,		// 判断是否关闭登录框
        openRM: this.$store.state.openReg,					// 是否打开注册框
        openPwd: false,															// 是否打开忘记密码框
        isChecked: false,														//　判断是否记住密码
        userSty: false,
        psdSty: false,
	    }
	  },
	  // 在模板渲染成html后调用
	  mounted() {
      this.popupVisible1 = true;										// 显示模态框
      this.$store.commit("changeOpenReg", false);		// 是否打开注册框
      this.$store.commit("changeCloseLogin", true);	// 是否关闭登录框
    },
    // 引入组件
	  components:{
      myReg,
      myPwd
    },
    // 计算
    created(){
      if (this.getLocal("name")) {
        this.userName = this.getLocal("name");
      }
      if (this.getLocal("psd")) {
//    	this.isChecked = true;
        this.password = this.base64.decode(this.getLocal("psd"));
      }
    },
    // 添加的方法
    methods: {
    	// 是否选中记住密码
      checked() {
      	if(this.isChecked == false){
      		this.isChecked = true;
					// 保存密码
					this.setLocal({"psd": this.base64.encode(this.password)});
//					console.log(this.getLocal("psd"));
      	} else {
      		this.isChecked = false;
      	}
      },
      // 是否关闭模态框
      clseModel() {
        this.clseModels = false;
        this.$store.commit("changeRequireAuth", false);
        this.$store.commit("changeisAgree", false);
      },
      // 点击注册
      openRegM() {
        this.$store.commit("changeCloseLogin", false);
        this.$store.commit("changeOpenReg", true);
        this.showLogin = this.$store.state.closeLogin;
        this.openRM = this.$store.state.openReg;
      },
      // 点击忘记密码
      openPwds() {
        this.showLogin = false;
        this.openPwd = true;
      },
      // 注册模态框传递
    	listenToMyBoy: function (somedata) {
        this.showLogin = somedata;
        this.openRM = !somedata;
      },
      // 忘记密码模态框
      listenToMyPwd: function (somedata) {
        this.showLogin = somedata;
        this.openPwd = !somedata;
      },
      // 登录按钮
      login: function () {
//      Indicator.open("正在连接服务器");
				if (this.userName == "") {
					Toast({ message: "用户名不能为空", duration: 1600 });
					return;
				}
				if (this.password == "") {
					Toast({ message: "密码不能为空", duration: 1600 });
					return;
				}
        this.Glogin(this.userName, this.password);
      }
    }
	}
</script>

<style lang="less" scoped>
	@white: #fff;
	@width: 100%;

	.mint-popup{
		border-radius: 0.6rem;
	}
	
	.loginBox{
		width: 7.1rem;
		height: 6.02rem;
		border-radius: 0.5rem;
		background: #313131;
		color: @white;
		font-size: 0.3rem;
		p{
			width: @width;
			height: 1.04rem;
			line-height: 1.04rem;
			.register{
				margin-left: 0.3rem;
				text-decoration: underline;
			}
			.close{
				margin: 0.3rem;
				width: 0.5rem;
			}
			.rememberPwd{
				margin: 0.4rem 0.1rem 0 1.4rem;
				width: 0.3rem;
				height: 0.3rem;
				-webkit-appearance: checkbox;
			}
			.forgetPwd{
				margin-right: 0.3rem;
				text-decoration: underline;
			}
		}
		.loginInput{
			height: 0.98rem;
			line-height: 0.98rem;
			padding-left: 0.3rem;
			label{
				display: inline-block;
				width: 0.96rem;
				margin-right: 0.14rem;
				text-align: center;
			}
			input{
				width: 5.3rem;
				height: 0.96rem;
				border: 0.01rem solid #4e4e4e;
				border-radius: 0.1rem;
				background: #313131;
				text-indent: 1em;
				color: @white;
			}
			.addBd{
				border: 0.01rem solid #fedc00;
    		box-shadow: 0 0 0.15rem #fedc00;
			}
			.bd{
				border: 0.01rem solid #4e4e4e;
    		box-shadow: none;
			}
		}
		.userInput{
			margin-bottom: 0.46rem;
		}
		.loginOk{
			display: block;
			margin: 0 auto;
	    width: 4.42rem;
	    height: 1rem;
	    font-size: 0.3rem;
	    background: #4b4b4b;
	    color: @white;
	    border-radius: 0.2rem;
		}
	}
	
	

</style>
