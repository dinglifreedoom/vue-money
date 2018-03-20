import Vue from 'vue'
Vue.filter("regCode",function(code){
  if(code=="CL_Spot") return "原油";
  if(code=="XAUUSD") return "黄金/美元";
  if(code=="XAGUSD") return "白银/美元";
  if(code=="EURUSD") return "欧元/美元";
  if(code=="USDJPY") return "美元/日元";
  if(code=="USDCAD") return "美元/加元";
  if(code=="NZDUSD") return "新西兰元/美元";
  if(code=="GBPUSD") return "英镑/美元";
  if(code=="USDCHF") return "美元/瑞士法郎";
  if(code=="AUDUSD") return "澳元/美元";
});