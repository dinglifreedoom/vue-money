import axios from 'axios'
// import qs from 'qs'
import { Indicator } from 'mint-ui';
import {Toast} from 'mint-ui'
import Vue from 'vue'

 //axios.defaults.headers.common['Authorization'] = "AUTH_TOKEN";
 axios.defaults.timeout = 16000;
 //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// post传参序列化
// axios.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   if (config.method === 'post') {
//     config.data = qs.stringify(config.data)
//   }
//   return config
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });


//添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log("http >>> ",config);
  return config;
}, function (error) {
  // 对请求错误做些什么
  console.log("请求错误");
  return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // console.log("http <<< ",response.data);
    Indicator.close();
    return response
  },
  function (error) {
    Indicator.close();
    Toast({message: "请求超时!", duration: 1600});
    return Promise.reject(error)
  }
);

export default axios
