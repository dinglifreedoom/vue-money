import {Toast} from 'mint-ui';
import {Indicator} from 'mint-ui';
var mts = {
  /* 数据排序 */
  orderBy: function (arr, k) {
    var items = Array.from(arr);
    if(items.length === 1){return items};
    return items.sort(function (a, b) {
      if (a[k] > b[k]) {
        return -1;
      }
      if (a[k] < b[k]) {
        return 1;
      }
      return 0;
    })
  },
  // 排序从大到小
  compare: function (property) {
  	return function (obj1, obj2) {
      var value1 = obj1[property];
      var value2 = obj2[property];
      return value2 - value1;
    }
  },
  // 设置本地存储
  setLocal: function (obj) {
    for (var k in obj) {
      window.localStorage.setItem(k, obj[k]);
    }
  },
  //获取本地存储
  getLocal: function (item) {
    return window.localStorage.getItem(item);
  },
  // 设置离线存储
  setSess: function (obj) {
    for (var k in obj) {
      window.sessionStorage.setItem(k, obj[k]);
    }
  },
  //获取离线存储
  getSess: function (item) {
    return window.sessionStorage.getItem(item);
  },
  // 去除字符串和数字首尾的空格
  hfWhite:function(str){
    if(typeof(str) == "string" || typeof(str) == "number"){
      return str.toString().replace(/(^\s*)|(\s*$)/g, "");
    }else{
      return str;
    }
  },
  // 加法
  accAdd: function (arg1, arg2) {
    var r1, r2, m, n;
    try {
    	r1 = arg1.toString().split(".")[1].length
    } catch(e) {
    	r1 = 0
    }
    try {
    	r2 = arg2.toString().split(".")[1].length
    } catch(e) {
    	r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1*m + arg2*m)/m).toFixed(n));
  },
  // 减法
  Subtr: function (arg1, arg2) {
    var r1, r2, m, n;
    try {
    	r1=arg1.toString().split(".")[1].length
    } catch(e) {
    	r1 = 0
    }
    try {
    	r2 = arg2.toString().split(".")[1].length
    } catch(e) {
    	r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1*m - arg2*m)/m).toFixed(n));
  },
  
//	// 计算行情现价
// 	nowprice:function(code,line,basep){
// 	if(/^USD/.test(code)){
//   	return (1/code*line*basep*(this.$store.state.rate));
// 	}else{
//	    return (code*line*basep*(this.$store.state.rate))
//	  }
//	},
  
  //最多输入两位小数(watch ==> input 金额)[数字，长度]
  numLength: function (num, length) {
    if (!num) {
    	return "";
    }
    if (num < 0){
    	return "";
    }
    var output = null;
    if (!isNaN(num) && num) {
      var leg = num.toString().indexOf(".");
//    console.log(num.toString());
      if (leg > -1 && num.length - leg > length + 1) {
        output = num.substring(0, leg + length + 1);
      } else {
        output = num;
      }
    }
// 	console.log(typeof output);
    output = output.toString().replace(/^[0][0-9]/gi,"")
    return output;
  },
  //数组包含多个一级对象，按某个对象属性[整型]排序，从小到大
  orderBy: function (obj, attr) {
    var oldObj = obj;
    for(var i = 0; i <= oldObj.length; i++) {
      for (var j = 0; j < oldObj.length - 1 - i; j++) {
        if (oldObj[j + 1][attr] < oldObj[j][attr]) {
          var ot = oldObj[j];
          oldObj[j] = oldObj[j + 1];
          oldObj[j + 1] = ot;
        }
      }
    }
    return oldObj;
  },
  //登录
  Glogin: function (u, p) {
    var self = this;
    u = self.hfWhite(u);
    p = self.hfWhite(p);
    if (!/^\S+$/.test(u)) {
      Toast({ message: "账户名格式不正确", duration: 1600 });
    }else if(p.length < 6){
      Toast({ message: "密码不能少于6个字符", duration: 1600 });
    }else {
	  	Indicator.open('加载中...');		// 打开loding加载
	    self.$store.commit("socketSend", {
	      act: "user_login",
	      data: {
	        "userName": u,
	        "password": p,
	        "isPreLogin": true
	      },
	      fn: function (msg) {
	        if (msg.isOk && msg.addr) {
	          console.log("预登陆成功");
//	          console.log(msg);
	          self.$store.commit("initSocket", {
	            url: msg.addr,
	            fn: function () {
						    self.$store.commit("socketSend", {
	                act: "user_login",
	                data: {
	                  "userName": u,
	                  "password": p,
	                  "isPreLogin": false
	                },
	                fn: function (msg) {
	                  console.log("正式登录成功");
//	                  console.log(msg);
	                  Indicator.close();	// 关闭loding加载
	                  self.$store.state.requireAuth = false;				// 登录权限
	                  self.$store.state.token = msg.user.userName; 	// 登录状态
//	                  self.$store.state.tradeAgreement=!msg.user.hasSignedTradeAgreement;	// 登录后获取同意交易
	                  msg.user.psd = self.base64.encode(p);
	                  msg.user.canUseMoney = 0;											// 可用余额
	                  self.$store.state.user = msg.user;
	                  self.setSess({ user: JSON.stringify(msg.user)});
	                  self.setLocal({"name": msg.user.userName});
	                  self.$store.commit("socketSend", { act: "money_getMoneyCfg" });	// 获得当前充值提现的手续费信息
	                  self.$store.commit("socketSend", { act: "addr_list" });					// 收货地址列表
	                  // 登录后要跳转的路由
	                  if (self.$store.state.pathRoute == "/limit" && self.$store.state.tradeAgreement) {
	                    self.$store.state.changeRequireAuth = true; // 是否需要登录权限的方法（mutations.js）
	                  } else {
	                    self.$router.push({ path: self.$store.state.pathRoute });
	                  }
	                }
	              });
	            }
	          });
	        }
	      }
	    });
    }
  }
};
const MyPlugin = {
  install: function (Vue, options) {
    for (var key in mts) {
      Vue.prototype[key] = mts[key]
    }
  }
};
export default MyPlugin
