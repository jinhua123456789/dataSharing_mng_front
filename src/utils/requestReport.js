import axios from 'axios'
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 10 * 1000, // request timeout
  // headers: {'Authorization': 'bearer 2cd09016-a98c-4d62-8e08-b96449d51dcd'}
});

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'bearer '+ getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const {data, status} = response
    if ((status >= 200 && status < 300) || status == 304) {
      if (data.code == 0 || data.code == 200) {
        return data.data;
      } else {
        Message({
          message: data.message || data.msg || 'error',
          type: 'error',
          duration: 3 * 1000
        })
        return Promise.reject(response);
      }

    } else {
      Message({
        message: data.message || data.msg || 'error',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(response);
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
  }
);

export default service
