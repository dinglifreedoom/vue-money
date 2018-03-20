<template>
  <div id="app">
  	<!--<is-agree v-if="isAgree"></is-agree>-->
    <router-view></router-view>
    <my-login v-if="requireAuth"></my-login>
  </div>
</template>

<script>
	import myLogin from "./components/login.vue";
//import isAgree from "./components/agree/SignedAgree.vue";
  
	export default {
	  name: 'App',
	  components: {
      myLogin
    },
    computed: {
      requireAuth() {
      	return this.$store.state.requireAuth;
      },
//    isAgree() {
//    	return this.$store.state.isAgree;
//    }
    },
    created(){
      //首次进入app的重定向和登录
      var self = this;
      var timer = setInterval(function(){
        if (self.$store.state.url) {
          clearInterval(timer);
          self.$store.commit("changeCloseLogin", true);
          var arr = window.location.hash.split("?");
          if (arr[1]) {
            if (arr[1].substring(0, arr[1].indexOf("=")) == "refWorkerId") {
              self.$store.commit("changeRequireAuth", true);
              self.$store.commit("changeOpenReg", true);
              self.$store.commit("changeCloseLogin", false);
            }
          } else {
            self.$router.push({path: "/index"});
          }
          self.$store.commit("initSocket", {
            fn: function () {
              if (self.getSess("user")) {
                var obj = JSON.parse(self.getSess("user"));
                self.Glogin(obj.userName, self.base64.decode(obj.psd));
              }
            }
          });
          var strUrl = location.hash;
          if(strUrl.substring(0,strUrl.indexOf('?')) == '#/recharge'){
            self.$router.push({path: "/index"});
            var uesrName = strUrl.substring(strUrl.indexOf('=') + 1, strUrl.indexOf('&'));
            var userPwd = self.base64.decode(strUrl.substring(strUrl.lastIndexOf('=') + 1, strUrl.length));
            self.$store.commit("initSocket", {
              fn: function () {self.Glogin(uesrName,userPwd,true);}
            });
          }
        }
      }, 10);
    }
	}
</script>

<style lang='less'>
	#app {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    > div::-webkit-scrollbar {
      display: none;
    }
  }

  #app::-webkit-scrollbar {
    display: none;
  }
  .mint-toast{
    z-index:99999 !important;
  }
  .v-enter {
    opacity: 0;
  }

  .v-enter-active {
    transition: opacity .3s;
  }
  .mint-indicator-wrapper{
    z-index:99999;
  }
</style>
