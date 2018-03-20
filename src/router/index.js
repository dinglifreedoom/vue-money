import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

const index = resolve => require(['../pages/index.vue'], resolve) //首页
const bindCard = resolve => require(['../pages/bindCard.vue'], resolve) // 绑定银行卡
const deal = resolve => require(['../pages/deal.vue'], resolve) // 交易
const kline = resolve => require(['../pages/kline.vue'], resolve) // K线
const moneyOut = resolve => require(['../pages/moneyOut.vue'], resolve) //提现
const moneyRecord = resolve => require(['../pages/moneyRecord.vue'], resolve) //资金记录
const my = resolve => require(['../pages/my.vue'], resolve) //个人中心
const myCards = resolve => require(['../pages/myCards.vue'], resolve) //我的银行卡
const order = resolve => require(['../pages/order.vue'], resolve) //订单列表
const recharge = resolve => require(['../pages/recharge.vue'], resolve) //充值
const forgetPsd = resolve => require(['../components/forgetPsd.vue'], resolve) //修改密码

Vue.use(Router);

export default new Router({
  routes: [
  	// 重定向
    {
      path: '',
      redirect: '/index',
      component:index
    },
    // 首页
    {
      path: '/index',
      name: 'index',
      meta: {
       	requireAuth: false
      },
      component: index
    },
    // 添加银行卡
    {
      path: '/bindCard',
      name: 'bindCard',
      component: bindCard
    },
    // 交易
    {
      path: '/deal',
      name: 'deal',
      component: deal
    },
    // 图表
    {
      path: '/kline',
      name: 'kline',
      meta: {
       	requireAuth: false,
      },
      component: kline
    },
    // 提现
    {
      path: '/moneyOut',
      name: 'moneyOut',
      component: moneyOut
    },
    // 资金记录
    {
      path: '/moneyRecord',
      name: 'moneyRecord',
      component: moneyRecord
    },
    // 我的
    {
      path: '/my',
      name: 'my',
      meta: {
       	requireAuth: true,
      },
      component: my
    },
    // 我的银行卡？
    {
      path: '/myCards',
      name: 'myCards',
      component: myCards
    },
    // 历史
    {
      path: '/order',
      name: 'order',
      meta: {
       	requireAuth: true,
      },
      component: order
    },
    // 充值
    {
      path: '/recharge',
      name: 'recharge',
    	meta: {
        requireAuth: true,
	    },
      component: recharge
    },
    // 修改密码
    {
      path: '/forgetPsd',
      name: 'forgetPsd',
      meta: {
        requireAuth: true,
	    },
      component: forgetPsd
    },
    
  ]
})
