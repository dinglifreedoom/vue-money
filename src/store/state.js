const state = {
	url: '', 			//ws地址

	page: '', 			//底部页面切换
	user: {}, 			//用户信息
	codeList: [], 		//品种列表
	token: "", 			//是否已经登录状态
	myads: [], 			//收货地址列表

	addiressId: "", 	//临时选中的地址id
	banks: {}, 			//银行卡信息
	ids: [], 			//购物车里存储的商品的id

	rate: {}, 			//充值，提现，手续费 费率
	channel: {}, 		//充值渠道


	socket: {}, 		//ws实例
	socketExit: false, 	//重连
	socketRecon: 11,	//重连倒计时
	Callback: {}, 		//存储所有的回调函数
	
//	tradeAgreement:"",  //登录后获取同意交易
	requireAuth: "", 	//是否需要登录权限

	isAgree: "", 		//是否同意经销商协议
	pathRoute: "", 		//登录后要跳转的路由
	isApprove: false, 	//是否认证成功
	isChecked: "", 		//保存选中的分类名位置
	openReg: "", 		//是否打开注册框
	closeLogin: "", 	//关闭登录框
	b2b: null, 			//判断b2b
	kline: "", 			//行情数据
	b2bOne: {}, 		//B2B显示商品内容
	usdrate: 0, 		//美元人民币汇率
	b2bClose: {}, 		//平仓处理
};


export default state