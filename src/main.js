// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from  './api/http.js'
import MintUI from 'mint-ui'
import base64 from './api/base64.js'
import 'mint-ui/lib/style.css'
import './api/rem'
import './api/filters.js'
import './style/reset.css' 
import Vuex from 'vuex'
import store from './store/'
import MyPlugin from './api/MyPlugin.js'


Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
store.state.url=window.ApiUrl;
axios.defaults.baseURL ="http://"+window.ApiUrl;
Vue.use(Vuex);
Vue.use(MintUI);
Vue.use(base64);
Vue.use(MyPlugin);

/* eslint-disable no-new */
window.vv=new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});

//路由切换的登录判断
router.beforeEach((to, from, next) => {
  store.commit("changeFormRouter", from.name);
  if (!to.name) {      //不存在的路由
    router.push("index");
    return;
  } else if (to.meta.requireAuth) {        //判断该路由是否需要权限
    if (store.state.token) {        //通过vuex state获取当前的token是否存在
      next();
    } else {
      store.commit("changeRequireAuth", true);
      store.commit("changePathRoute", to.fullPath);
    }
  } else {
    next();
  }
  window.scrollTo(0, 0);//滚动到顶部
});
