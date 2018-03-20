<template>
  <div id="bindCard">
    <!-- <back-top :scrollmyself='true'></back-top> -->
   <!--  <common-head :title="btnTxt+'银行卡'"></common-head> -->
    <div class="main">
      <mt-field placeholder="真实姓名" v-model="card.realName" type="text"></mt-field>
      <select v-model="card.bankCode" class="mint-cell mint-field is-nolabel">
        <option v-for="(val,key) in bankList" :value="key">{{val}}</option>
      </select>
      <mt-field placeholder="银行卡号" v-model="card.bankCard" type="num"></mt-field>
      <mt-field placeholder="支行信息" v-model="card.bankBranch"></mt-field>
      <city-select :city1="card.bankProvince" :city2="card.bankCity" v-on:output="changeCity"></city-select>
      <mt-field label="图片验证码：" placeholder="图片验证码" type="text" class="f1" v-model="imgreg" v-if="sure">
        <div class="input-right"><img :src="regjpg" alt="" @click="regImg()"></div>
      </mt-field>
      <mt-field label="短信验证码：" placeholder="短信验证码" type="text" class="f2" v-model="ponereg" v-if="sure">
        <div class="input-right" @click="regTime()" :class="time=='获取验证码'?'bcpurple':'bcgray'">
          {{time}}{{time=="获取验证码"?"":"s"}}
        </div>
      </mt-field>
      <div class="confirm" @click="sure=!sure" v-if="!sure">{{btnTxt}}</div>
      <div class="confirm" @click="ediBank()" v-if="sure">提交</div>
    </div>
    <common-foot></common-foot>
  </div>
</template>
<script>
  import commonFoot from '../components/footers.vue'
  //import citySelect from '../components/citySelect.vue'
  import {Toast} from 'mint-ui'
  import {Indicator} from 'mint-ui';

  export default {
    name: 'bindCard',
    data() {
      return {
        page: 'my',
        disable: true,
        card: {
          realName:'',
          bankCode: '',
          bankBranch: '',
          bankProvince: '河南省',
          bankCity: '郑州市',
          bankCard: '',
          phoneValCode : "",
          imgValCode :"",
        },
        imgreg: "",
        ponereg: "",
        time: "获取验证码",
        regjpg: "",
        bankList: {},
        btnTxt: "绑定",
        sure:false,
        phone:this.$store.state.user.userName,
        timer:null,
      }
    },

    created(){
      if (this.$store.state.banks) {
        this.bankinfo(this.$store.state.banks);
      }
      this.regImg();
    },

    methods: {
      ediBank: function () {        //保存银行卡信息
        this.card.imgValCode=this.imgreg;
        this.card.phoneValCode=this.ponereg;
        for (var i in this.card) {
          this.card[i] = this.hfWhite(this.card[i]);
        }
        if (!this.card.bankCode) {
          Toast({message: "请选择所属银行", duration: 1800});
        }
        else if (this.card.realName.length == 0) {
          Toast({ message: "真实姓名不能为空", duration: 1800 });
        }
        else if (this.card.bankCard.length < 12 || this.card.bankCard.length > 19) {
          Toast({message: "银行卡号为12-19个字符", duration: 1800});
        }
        else if (this.card.bankBranch.length < 2) {
          Toast({message: "支行信息不得小于2个字符", duration: 1800});
        }
        else if (!this.card.bankProvince) {
          Toast({message: "请选择开户省", duration: 1800});
        }
        else if (!this.card.bankCity) {
          Toast({message: "请选择开户市", duration: 1800});
        }
        // else if (!this.card.imgValCode) {
        //   Toast({message: "请输入图片验证码", duration: 1800});
        // }
        // else if (!this.card.phoneValCode) {
        //   Toast({message: "请输入手机验证码", duration: 1800});
        // }
        else {
          var _this=this;
          Indicator.open();
          this.$store.commit("socketSend",{
              act:"user_setBankInfo",
              data:this.card,
              fn:function(res){
                console.log(res);
                Indicator.close();
                if (res.isOk) {
                  var arr = _this.$store.state.banks;
                  arr.realName = _this.card.realName;
                  arr.bankBranch = _this.card.bankBranch;
                  arr.bankCard = _this.card.bankCard;
                  arr.bankCity = _this.card.bankCity;
                  arr.bankCode = _this.card.bankCode;
                  arr.bankProvince = _this.card.bankProvince;
                  _this.$store.state.banks=arr;
                  clearInterval(_this.timer);
                  Toast({message: res.msg, duration: 1600});
                  setTimeout(function(){
                    _this.$router.push( "/my" );
                  }, 1600)
                }
              }
          });
        }
      },

      bankinfo: function (info) {       //接口数据转换
        this.bankList = info.banks;
        if (info.bankCode) {
          this.btnTxt = "修改";
          this.card.realName = info.realName;
          this.card.bankCode = info.bankCode;
          this.card.bankBranch = info.bankBranch;
          this.card.bankProvince = info.bankProvince;
          this.card.bankCity = info.bankCity;
          this.card.bankCard = info.bankCard;
        } else {
          this.btnTxt = "绑定";
          for (var i in info.banks) {
            this.card.bankCode = i;
            break;
          }
        }
      },
      //获取短信验证码
      regTime:function(){
        var that = this;
        if (this.time != "获取验证码") return;
        this.time = 60;
        var self=this;
        this.$store.commit("socketSend",{
            act:"user_sendCodeForSetBankInfo",
            data: {imageCode:self.imgreg},
            fn:function(res){
              if (res.isOk) {
                Toast({message: "验证码已发送", duration: 1600});
                self.timer = window.setInterval(function () {
                  that.time--;
                  if (that.time == 0) {
                    that.time = "获取验证码";
                    clearInterval(self.timer);
                  }
                }, 1000);
              } else {
                self.regImg();
                that.time = "获取验证码";
                Toast({message: res.msg, duration: 1600});
              }
            }
        })
      },
      regImg:function(){  //获取图片验证码
        var self=this;
        this.$store.commit("socketSend",{
            act:"user_imageCodeForSetBankInfo",
            fn:function(res){
              if(res.isOk){
                self.regjpg='data:image/jpeg;base64,'+res.imageCode;
              }else{
                Toast({message: res.msg, duration: 1600 });
              }
            }
        })
      },
      changeCity: function (city1, city2) {   //选择省市
        this.card.bankProvince = city1;
        this.card.bankCity = city2;
      }
    },

    components: {
      commonFoot,
      citySelect
    }
  }
</script>
<style lang="less">
  @mainColor: #9D3FEB;
  @white: #fff;
  @purple: #9d3feb;
  @gray: #f2f2f2;
  #bindCard {
    > .main {
      padding: 0.2rem 0.25rem;
      margin-top:.2rem;
      .f1, .f2 {
        position: relative;
      }
      .f1 input, .f2 input {
        max-width: 60%;
      }
    /*  // .f1 .mint-field-other, .f2 .mint-field-other {
      //    width: 28%;
      //   position: absolute;
      //   color: @white;
      //   font-size: .3rem;
      //   text-align: center;
      //   line-height: .7rem;
      //   right: 4%;
      //   top: 13%;
      //   overflow: hidden;
      // }*/
      .f1 .input-right {
        img {
          width: 100%;
          height: .7rem;
        }
      }
      .f1 .mint-cell-value .mint-field-other,.f2 .mint-cell-value .mint-field-other {
        height: 0.7rem;
        right: 0;
        width: 28%;
        position: absolute;
        color: @white;
        font-size: .3rem;
        text-align: center;
        line-height: .7rem;
        right: 2%;
        top: 13%;
        border-radius:.1rem;
        overflow: hidden;
        .bcpurple {
          background-color: @purple;
        }
        .bcgray {
          background-color: #999;
        }
      }
      .mint-cell {
        padding: 0 0.3rem;
        border-bottom: 0.01rem solid #e5e5e5;
        .mint-field-other {
          height: 0.62rem;
          right: -.2rem;
        }
        .mint-field-core{
          color:#4b4b4b;
          font-size:.3rem;
        }
      }
      .mint-cell:nth-last-child(1) {
        border: none;
      }
      select {
        width: 100%;
        padding-left: 0.5rem !important;
        font-size: .3rem;
      }
      > .confirm {
        line-height: 1.04rem;
        font-size: 0.36rem;
        text-align: center;
        border-radius: 0.1rem;
        color: #fff;
        background: @mainColor;
        margin-top: .4rem;
      }
    }
  }
</style>
