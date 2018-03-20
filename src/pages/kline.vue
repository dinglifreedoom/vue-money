<template>
  <div class="kline">
    <div class="top">
      <common-head></common-head>
      <div class="code clearfix"><span class="fl" @click="popupVisible=true">{{code | regCode}}<i class="iconfont icon-f11-copy "></i></span><img src="../../static/cursor.png"  alt="" class="fr" /></div>
      <div class="klineBox">
          <iframe  src="/kline.html" width="100%" height="100%" frameborder="0" id="mainweb" name="mainweb" ></iframe>
      </div>
      <div class="dealBox clearfix">
        <p class="buy fl">
          <img src="../../static/buy.png"  alt="">
          <span>买入</span>
        </p>
        <p class="number fl">
          <button>-</button><input type="number" /><button>+</button>
        </p>
        <p class="sell fl">
          <img src="../../static/sell.png"  alt="">
          <span>卖出</span>
        </p>
      </div>
      <mt-popup v-model="popupVisible" popup-transition="popup-fade"  position="left">
          <p class="top">变换品种</p>
          <p class="type" v-for="(item,index) in allCode" @click="changeCode(item)">{{item.name | regCode}}</p>
      </mt-popup>
    </div>
    <common-foot></common-foot>
  </div>
</template>

<script>
import commonFoot from "../components/footers.vue"
import commonHead from "../components/headers.vue"
  window.ChartFrame = {
    tickHandle:function(val){
      if(window.ChartFrame.ready){
        window.ChartFrame.KLine.tickHandle(val);
      }
    },
    ready:false // 图表是否准备好
  };
  window.frameReady = function(subWindow){
    console.log("ChartFrame载入完成");
    window.ChartFrame.KLine = subWindow.KLine; //赋值
    window.ChartFrame.KLine.data.code = window.ChartFrame.code;
    // window.ChartFrame.KLine.data.rate = window.ChartFrame.rate;
    window.ChartFrame.KLine.data.decimal = window.ChartFrame.decimal;
    window.ChartFrame.KLine.init();
  };
  window.chartReady = function(){
    console.log("K线图和走势图载入完成");
    window.ChartFrame.ready = true;
  };
export default {
  name: 'kline',
  data () {
    return {
      page: this.$store.commit("changePage", "kline"),
      allCode:this.$store.state.codeList,  //品种列表
      kind:{},    //品种信息
      popupVisible:false,  //切换品种显示
      tickValue:0,  //现价
      code:"",
    }
  },
  computed:{
    kline(){ return this.$store.state.kline; }
  },
  methods:{
    getFloat:function(num){   //保留行情精度
      if(num==""){
        return 0.000;
      }else{
       var b = parseFloat(num).toFixed(this.kind.decimalPlace+1);
       var result = b.substring(0,b.toString().length - 1);
       return result;
      }
    },
    tickHandle:function(tick){   //处理实时数据
      var self=this;
      var tickData=tick.split("|");
      if(self.code === tickData[0]){
        self.tickValue = self.getFloat(tickData[1])
      }
    },
    changeCode:function(item){  //切换品种显示
      console.log(item)
      this.code=item.name;
      window.ChartFrame.KLine.data.code = item.name;
      window.ChartFrame.KLine.data.decimal = item.decimalPlace;
      window.ChartFrame.KLine.init();
      this.popupVisible=false;
    },
  },
  created(){
    this.kind=this.$store.state.b2bOne;
    this.code=this.kind.name;
    window.ChartFrame.code = this.kind.name;
    window.ChartFrame.decimal = this.kind.decimalPlace;
    console.log(this.kind);
  },
  components: {
    commonFoot,
    commonHead
  }
}
</script>

<style lang="less" scoped>
  @mainColor:#fedc00;
  .kline{
    font-size: .3rem;
    .top{
      width:100%;
      height: 100%;
      position:relative;
      top:0;
      bottom:1rem;
      width: 100%;
      .code{
        height: .8rem;
        line-height: .8rem;
        background-color: #242424;
        margin-bottom: .16rem;
        color:@mainColor;
        padding:0  .16rem; 
        span{
          i{
            font-size:.46rem;
            color:#939393;
            vertical-align:middle;
          }
        }
        img{
          display: inline-block;
          margin-top:.2rem;
          width: .38rem;
          height: .38rem;
        }
      }
      .klineBox{
        width: 100%;
        height: 9rem;
        // border:1px solid red;
        margin-bottom:.1rem;
      }
      .dealBox{
        height: .92rem;
        width: 100%;
        padding:.13rem;
        p{
          width: 2.3rem;
          height: .94rem;
          background-color:#999;
          margin-right: .14rem;
          border-radius: 4px;
          color:white;
          text-align:center;
          img{
            display: block;
            margin:.1rem auto 0 ;
            width: .36rem;
            height: .36rem;
          }
          span{
            display: block;
            letter-spacing: 1px;
          }
        }
        .buy{
          background-color:#a80015;
        }
        .number{
          button{
            display: inline-block;
            width: .7rem;
            height:.94rem;
            color:white;
            background-color:#676767;
            font-size:.4rem;
          }
          button:nth-child(1){
            border-top-left-radius:4px;
            border-bottom-left-radius:4px;
          }
          button:nth-child(3){
            border-top-right-radius:4px;
            border-bottom-right-radius:4px;
          }
          input{
            background-color:#676767;
            color:white;
            border:0 none;
            width: 0.9rem;
            font-size:.46rem;
            height:.94rem;
          }
        }
        .sell{
          background-color:#25a35d;
          margin-right:0;
        }
      }
      .mint-popup{
        width:3.72rem;
        background-color:#313131;
        height:100%;
        color:white;
        p{
          width: 100%;
        }
        .top{
          font-size:.36rem;
          height:1.4rem;
          text-align: center;
          line-height:1rem;
        }
        .type{
          font-size:.3rem;
          height:.9rem;
          text-indent: .6rem;
        }
      }
    }
  }
</style>