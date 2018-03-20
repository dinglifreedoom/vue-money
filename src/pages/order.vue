<template>
  <div class="order">
    <mt-header title="历史">
      <router-link to="/" slot="left">
         <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    </mt-header>
    <ul class="orderNav">
      <li @click="tab" :class="{navTab:true,active:classFlag}" style="margin-left:0.20rem">持仓明细</li>
      <li class="nav">  丨 </li>
      <li @click="tab" :class="{navTab:true,active:!classFlag}">历史订单</li>
    </ul>
    <!--历史交易-->
    <ul class="detail" v-show="!show">
      <li v-for="item in detail" @click="lookDetail">
          <p class="lt">买</p>
          <div class="center">
            <p class="title"><span class="pro">{{item.pro}}</span><span class="price">{{item.price}}</span></p>
            <p class="region"><span>{{item.regionStart}}</span>-<span class="regionEnd">{{item.regionEnd}}</span></p>
          </div>
          <div class="rt">
            <p class="increase">{{item.increase}}</p>
            <p class="date">{{item.date}}&nbsp&nbsp{{item.time}}</p>
          </div>
          <div class="proDetail" v-show="detailFlag">
              <div class="ltPro">
                 <p>止赢: {{item.win}}</p>
                 <p>止损: {{item.defeat}}</p>
                 <p>单号: {{item.num}}</p>
              </div>
              <div class="rtPro">
                <p><span class="proPrice">库存费</span><span>-</span></p>
                <p><span class="proPrice">手续费</span><span>-</span></p>
                <div class="time">{{item.date}}&nbsp&nbsp{{item.time}}</div>
              </div>
          </div>
      </li>
    </ul>
    <!--平仓-->
    <ul class="history" v-show="show">
      <li  v-for="item in detail" @click="operate">
          <p class="lt">买</p>
          <div class="center">
            <p class="title"><span class="pro">{{item.pro}}</span><span class="price">{{item.price}}</span></p>
            <p class="region"><span>{{item.regionStart}}</span>-<span class="regionEnd">{{item.regionEnd}}</span></p>
          </div>
          <div class="rt">
            <p class="increase">{{item.increase}}</p>
            <p class="date">{{item.date}}&nbsp&nbsp{{item.time}}</p>
          </div>
          <div class="proDetail" v-show="operateFlag">
              <div class="ltPro">
                 <p>止赢: 0.5746574</p>
                 <p>止损: 0.5746574</p>
              </div>
              <div class="rtPro">
                <p><span class="proPrice">库存费</span><span>-</span></p>
                <p><span class="proPrice">手续费</span><span>-</span></p>
              </div>
              <div class="btn">
                  <button class="update" @click="update($event,item)">修改</button>
                  <button class="evenUp" @click="evenUp($event,item)">平仓</button>
              </div>
          </div>
      </li>
     
      <!-- <li v-for="item in detail" @click="operate">
          <p class="lt" style="background:green">卖</p>>
          <div class="center">
            <p class="title"><span class="pro">{{item.pro}}</span><span class="price">{{item.price}}</span></p>
            <p class="region"><span>{{item.regionStart}}</span>-<span class="regionEnd">{{item.regionEnd}}</span></p>
          </div>
          <div class="rt">
            <p class="increase">{{item.increase}}</p>
            <p class="date">{{item.date}}&nbsp&nbsp{{item.time}}</p>
          </div>
          <div class="proDetail" v-show="operateFlag1">
              <div class="ltPro">
                 <p>止赢: 0.5746574</p>
                 <p>止损: 0.5746574</p>
              </div>
              <div class="rtPro">
                <p><span class="proPrice">库存费</span><span>-</span></p>
                <p><span class="proPrice">手续费</span><span>-</span></p>
              </div>
              <div class="btn">
                  <button class="update">修改</button>
                  <button class="evenUp">平仓</button>
              </div>
          </div>
      </li> -->
    </ul>
    <!--修改-->
    <div v-show="updateFlag" class="shade" @click="closeShade($event)">
      <div class="updateContent" >
         <div class="updatePro">
           修改:英镑兑美元  <span style="color:red;font-size:0.26rem">买入0.01</span>
         </div>
         <div class="setUp">
             <p class="setName">止损<p>
             <p class="setNum">
                <input type="text"  v-on:input="change" v-model="pro.lose">
             </p>
             <p class="setNo">没有设置</p>
         </div>
         <div class="setUp" style="margin-top:0.23rem">
             <p class="setName">止盈<p>
             <p class="setNum"> 
                <input type="text"  v-on:input="change" v-model="pro.profit">
             </p>
             <p class="setNo">没有设置</p>
         </div>   
         <div class="updateCon">
            <p><span style="font-size:0.26rem">1.15</span><span style="font-size:0.36rem">92<sup style="font-size:0.26rem">9</sup></span></p>
            <p  style="margin-left:3rem"><span style="font-size:0.26rem">1.15</span><span  style="font-size:0.36rem">97<sup style="font-size:0.26rem">2</sup></span></p>
         </div> 
         <button>修改</button>   
      </div>
    </div>
    <!--平仓-->
     <div  class="shade1"  v-show="evenFlag" @click="closeShade($event)">
        <div class="evenContent">
          <p><span>澳洲/美元</span><span style="color:#fedc00;margin-left:0.2rem">0.01</span></p>
          <p><span>成功被平仓</span><span style="color:red;margin-left:0.2rem">1.27224</span></p>
        </div>
    </div>
    <common-foot></common-foot>
  </div>
</template>

<script>
import commonFoot from "../components/footers.vue"
export default {
  name: 'order',
  data () {
    return {
        page: this.$store.commit("changePage", "order"),
        classFlag:true,//tab样式的控制
        show:true,//控制tab切换
        detailFlag:false,//历史详情的控制
        operateFlag:false,//持仓的详情控制
        updateFlag:false,//修改的控制
        evenFlag:false,//平仓的控制
        updateItem:{},//修改的内容
        evenItem:{},//平仓的内容
        pro:{
          lose:"",
          profit:"",
        },//修改时数据的控制
        detail:[
           { 
              pro:"英镑/美元",
              price:"0.01",
              regionStart:"0.7656",
              regionEnd:"0.76673",
              increase:"19.8",
              date:"2017.10.31",
              time:"12.00",
              win:"0.57545546",
              defeat:"0.5435543",
              num:"21456463545",
              stock:"",
              produce:"",

           }
        ]
    }
  },
  methods:{
      tab(){
          this.classFlag=!this.classFlag;
          this.show=!this.show;
      },
      lookDetail(){
          this.detailFlag=!this.detailFlag
      },
      operate(){
          this.operateFlag=!this.operateFlag
      },
      //修改
      update(e,item){
         e.stopPropagation();
         console.log(item);
         this.updateFlag=true;
      },
      change(){
         var patt=/^\+?[1-9][0-9]*$/;//匹配正整数
         var patt1=/^\+?[1-9]*\d*(\.\d*)?$|^-?0(\.\d*)?$/;//匹配正的浮点数
         if(!(patt.test(this.pro.lose)||patt1.test(this.pro.lose))){
             this.pro.lose=0
         }
         if(!(patt.test(this.pro.profit)||patt1.test(this.pro.profit))){
             this.pro.profit=0
         }
      },
      evenUp(e,item){
         e.stopPropagation();
         console.log(item);
         this.evenFlag=true;
      },
      //关闭遮罩层
      closeShade(e){
         e.stopPropagation();
         if(e.target.className=="shade"){
            this.updateFlag=false;
         } 
         if(e.target.className=="shade1"){
            this.evenFlag=false;
         }    
      }
  },
  components: {
    commonFoot
  },
  
}
</script>

<style lang="less" scoped>
  .mint-header{
     background:#3a3a3a;
     height: 0.88rem;    
  } 
  .orderNav{
     height:1.16rem;
     overflow: hidden;
     padding-top:0.2rem;
     .nav{
        overflow: hidden;
        float:left;
        height:0.5rem; 
        line-height: 0.5rem;
        font-size: 0.4rem;
        width:0.46rem;
        margin-top: 0.05rem;
        text-align: center;
        color:#313131; 
     }
     .navTab{
        overflow: hidden;
        color:#999999;
        float:left;
        height:0.6rem;
        line-height: 0.5rem;
        font-size: 0.3rem;
        width: 3.3rem;
        text-align: center;
        border-bottom:1px solid #999999;
     }
     .active{
        color:#f4ea2a;
        border-bottom:1px solid #f4ea2a; 
     }
  } 
  .detail,.history{
     li{
        padding:0.1rem 0;
        width:100%;
        border-bottom:1px solid #2f2f2f;
        font-size: 0.2rem;
        overflow: hidden;
        .lt{
           float:left;
           width:0.42rem;
           height: 0.42rem;
           line-height: 0.42rem;
           text-align: center;
           font-size: 0.3rem;
           background-color:#ef0e2a;
           color: #fefefe;
           border-radius: 0.04rem;
           margin-left: 0.16rem;
           margin-top: 0.25rem;

        }
        .center{
          float: left;
          margin-left: 0.08rem;
          margin-top: 0.1rem;
          overflow: hidden;
          .pro{
              font-size: 0.3rem;
              color:#fefefe;
          }
          .price{
             font-size: 0.25rem;
             color: red;
             margin-left:0.18rem;
          }
          .region{
             margin-top: 0.05rem;
             font-size: 0.25rem;
             color:#fefefe; 
             .regionEnd{
               color: red;
             }
          }

        }
        .rt{
           float:right;
           margin-right: 0.16rem;
           overflow: hidden;
           .increase{
              font-size: 0.3rem;
              text-align: right; 
              color: red;
              margin-top: 0.1rem;
           }
           .date{
              font-size: 0.25rem;
              color:#fefefe; 
           }
        }
        .proDetail{
            margin-top: 0.05rem;
            width:100%;
            float:left;
            color:#fefefe; 
            .ltPro{
              margin-left:0.7rem;
              float:left;
              p{
                margin-top: 0.05rem
              }
            }
            .rtPro{
              float:right;
              margin-right: 0.1rem;
              p{
                 margin-top: 0.08rem;
                 .proPrice{
                   margin-right: 2.3rem;
                 } 
              }
              .time{
                 float: right;
              }
            }
            .btn{
               width:100%;
               float: left;
               margin-top: 0.3rem;
               margin-bottom: 0.2rem;
               button{
                  width: 2.4rem;
                  height: 0.85rem;
                  line-height: 0.85rem;
                  text-align: center;
                  background-color: #535353;
                  box-shadow: 0 0 2px 2px #535353;
                  color: #fff;
                  font-size: 0.3rem;
               }
               .update{
                  margin-left: 0.84rem;
               }
               .evenUp{
                  margin-left: 0.65rem;
               }
            }
        }

     }
  }
  .order{
     .shade{
         position: absolute;
         top:0;
         bottom:0;
         width:100%;
         height: 100%;
         background-color: rgba(0,0,12,0.5);
         .updateContent{
             position: absolute;
             top:20%;
             left:0.2rem;
             width: 7.1rem;
             height: 6.9rem;
             border-radius:0.2rem;
             background-color:#313131; 
             .updatePro{
                 height: 1.02rem;
                 line-height: 1.02rem;
                 font-size: 0.36rem;
                 color: #fff;
                 text-align: center;
                 border-bottom:1px solid #414141;           
             }
             .setUp{
                 margin-top: 0.48rem;
                 overflow: hidden;
                 .setName{
                    float: left;
                    font-size: 0.36rem;
                    color: #fff;
                    margin-left: 0.26rem;
                    height: 0.62rem;
                    line-height: 0.62rem;
                 }
                 .setNum{
                     float: left;
                     position: relative;
                     width: 2.32rem;
                     height: 0.62rem;
                     border: 1px solid #ffffff; 
                     border-radius:0.1rem;
                     margin-left: 1.2rem;
                     input{
                        height: 0.56rem;
                        width: 1.92rem;
                        line-height: 0.56rem;
                        text-align: center;
                        position: absolute;
                        top:0;
                        left:0.2rem;
                        outline:0;
                        border:0;
                        color:#fedc00;
                        background-color: #313131; 
                     }
                 }
                 .setNo{
                    height: 0.62rem;
                    line-height: 0.62rem;
                    font-size: 0.36rem;
                    float: left;
                    margin-left: 0.80rem;
                 }
             }
             .updateCon{
                margin-top: 1rem;
                overflow: hidden;
                color: #fff;
                p{
                  float: left;
                  margin-left:0.8rem;
                }
             }
             button{
                margin-top: 0.15rem;
                width: 6.52rem;
                height: 0.98rem;
                line-height: 0.68rem;
                margin-left:0.26rem;
                color: #fff;
                background-color:#434343;
                border-radius:0.1rem;
             }
         }
     }
     .shade1{
         position: absolute;
         top:0;
         bottom:0;
         width:100%;
         height: 100%;
         background-color: rgba(0,0,12,0.5);
         .evenContent{
            position: absolute;
            background-color:#313131;
            color: #fff;
            padding:1.04rem 1.2rem; 
            border-radius: 0.1rem;
            top:20%;
            left:11%;
            p{
               font-size: 0.36rem;
               margin-top:0.24rem;
            }
         }
     }
     
  }
 









</style>