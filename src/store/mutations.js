
import {Toast} from 'mint-ui'
import {Indicator} from 'mint-ui';
import {MessageBox} from 'mint-ui';
const mutations = {
    changePage(state, page) {   		//切换页面
      console.log(page)
      state.page = page;
      return state.page;
    },
    changeRequireAuth(state, val) {    	//是否需要登录权限
        state.requireAuth = val;
        return state.requireAuth;
    },
    changeOpenReg(state, val) {    		//是否打开注册框
        state.openReg = val;
        return state.openReg;
    },
    changeCloseLogin(state, val) {   	//是否关闭登录框
        state.closeLogin = val;
        return state.closeLogin;
    },
    changeisAgree(state, val) {    		//是否同意经销商协议
        state.isAgree = val;
        return state.isAgree;
    },
    changeFormRouter(state, val) {    	//保存上个页面的路由信息
      state.formRouter = val;
      return state.formRouter;
    },
    changePathRoute(state, val) {    	//登录后要跳转的路由
        state.pathRoute = val;
        return state.pathRoute;
    },
    changeKline(state, val){    		//保存K线
      state.kline = val;
      return state.kline;
    },
    // 设置socket实例
    initSocket(state, data){
      var self = this;
        if(data && data.url){
          state.url = data.url;
          state.socketExit = true;
          state.socket.close();
        }
        state.socket = new WebSocket("ws://" + state.url);
        state.socket.onopen = function () {
          Indicator.close();
          state.Callback = {};
          console.log("socket[建立连接]");
          self.commit("socketMsg");
          if(data && data.fn){
            data.fn()
          }
        };
        state.socket.onclose = function (err) {
          console.log("socket[关闭连接]");
          if(state.socketExit){
            state.socketExit = false;
          }else{
            state.socketRecon--;
            console.log(state.socketRecon);
            console.log("开始重连");
            if(state.socketRecon >= 1){
              //Indicator.open("断线正在重连中...");
              setTimeout(function () {
                state.url = window.ApiUrl;
                self.commit("initSocket", {
                  fn: function(){
                    if(sessionStorage.getItem("user")){
                      var obj = JSON.parse(sessionStorage.getItem("user"));
                      vv.Glogin(obj.userName,vv.base64.decode(obj.psd));
                    }
                      state.socketRecon = 11;
                  }
                });
              },1000);
            }else {
//            Indicator.close();
              state.socketRecon = 0;
              self.commit("outLogin", {
                type: "otherLogin",
                msg: "与服务器断开连接，请重新登录"
              })
            }
          }
        };
        state.socket.onerror = function (err) {
          console.log("socket[链接出错]");
        }
    },
    //使用socket发送消息
    socketSend(state,val){
      if(!val.data) val.data = {};
      var info = {
        "act": val.act,
        "data": JSON.stringify(val.data)
      };
      if(typeof val.fn === "function"){
        var ps = 0;
        for(var item in state.Callback){
          if(item == val.act){
            state.Callback[item].push(val.fn);
            ps = 1;
            break;
          }
        }
        if(ps === 0){
          state.Callback[val.act] = [val.fn];
        }
      }
      console.log("socket >>> ", JSON.stringify(info));
      //WebSocket对象发送还没结束，然后又调用了send方法接着继续发送，加个延时回调
      //setTimeout(function () {
      state.socket.send(JSON.stringify(info));
      //},500)
    },
    //使用socket接收消息
    socketMsg(state){
        var self = this;
        state.socket.onmessage = function (msg) {
          var msg = JSON.parse(msg.data);
          if(msg.type != "Price"&&msg.type!="Heartbeat") console.log("socket <<< ", msg);
          if(msg.isOk === false&&msg.msg) {
            Toast({message: msg.msg, duration: 2000});
            Indicator.close();
          }
          switch (msg.type) {
            case "CallReturn": {                                  //调用返回
              switch(msg.srData){
                case "user_getBankInfo": { state.banks = msg; } break;
                case "money_getMoneyCfg": { state.rate = msg; } break;
                case "user_agreeTrade": { state.tradeAgreement=!msg.isOk } break;
                case "money_inChannelList": {state.channel = msg.data} break;
                case "user_getInfo": {
                  state.user.money = msg.money;
                  state.user.canUseMoney = msg.canUseMoney;
                  window.sessionStorage.setItem("user", JSON.stringify(state.user));
                } break;
              }

              var callback = state.Callback;
              for (var item in callback) {
                if (item == msg.srData && callback[item][0]) {
                  Indicator.close();
                  callback[item][0](msg);
                  callback[item].splice(0, 1);
                }
              }
              state.Callback = callback;

            } break;
            case "Price": {          //行情到来
              self.commit("changeKline", msg.srData);
            } break;
            case "OtherLogin": {     //异地登录
              self.commit("outLogin", {
                type: "otherLogin",
                msg: msg.msg
              });
            } break;
            case "News": {           //新闻通知

            } break;
            case "PanicBuySucc": {   //抢购成功

            } break;
            case "PanicBuyFail": {   //抢购失败

            } break;
            case "StopClose": {      //止盈止损平仓

            } break;
            case "ForceClose": {     //强制平仓（爆仓）

            } break;
            case "Close": {     //平仓处理
                self.commit("changeClose", msg);
                Toast({ message: msg.msg, position: 'middle', duration: 1000 });
            } break;
            case "Restart" : {
//            vv.$router.push({ path: "/index" });
//            self.commit("changeRequireAuth", true);
//            self.commit("changeOpenReg", false);
//            self.commit("changeCloseLogin", true);
            } break;
          }
        }
    },
    // 退出登录
  	outLogin (state, data) {
      window.sessionStorage.setItem("user", "");
      if (data.type == "otherLogin") {  //异地登录or修改密码or断开连接
        MessageBox.alert(data.msg).then(action => {
          window.location.reload();
        });
      } else if (data.type == "outLogin"){ //退出登录
        Toast({ message: data.msg, position: 'middle', duration: 1000 });
        window.location.reload();
      }
    }
}
export default mutations
