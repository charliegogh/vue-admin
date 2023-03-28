import axios from "axios";
import qs from "qs";
import notification from "ant-design-vue/es/notification";
import { getToken } from "@/utils/auth";
import store from "@/store";
const CancelToken = axios.CancelToken;
const queue = []; // 请求队列
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL,
  baseURL: "/api/",
  withCredentials: true, // 允许携带 cookie
  timeout: 50000, // 请求超时时间
  // 默认请求头
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  transformRequest: [
    function(data, config) {
      // 在请求之前对data传参进行格式转换
      // json
      if (config["Content-Type"] === "application/json;charset=UTF-8") {
        data = JSON.stringify(data);
      }
      if (config["Content-Type"] === "application/x-www-form-urlencoded") {
        data = qs.stringify(data); // 请求参数序列化
      }
      return data;
    }
  ]
});
// request拦截器
service.interceptors.request.use(
  config => {
    config.headers["Authorization"] = getToken();
    removeRepeatRequest(config);
    config.cancelToken = new CancelToken(c => {
      queue.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        cancel: c
      });
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// respone拦截器   响应拦截器
service.interceptors.response.use(
  response => {
    removeRepeatRequest(response.config);
    return Promise.resolve(response);
  },
  error => {
    const errMsg = error.toString();
    const code = errMsg.substr(errMsg.indexOf("code") + 5);
    switch (code) {
      case 401:
        notification.error({
          message: "Forbidden",
          description: "登录期请重新登录"
        });
        store.dispatch("user/logOut");
        break;
      case "404":
        notification.error({
          message: "Forbidden",
          description: "接口不存在"
        });
        break;
      default:
        notification.error({
          message: "Forbidden",
          description: error.message
        });
        break;
    }
    if (error.message.includes("timeout")) {
      notification.error({
        message: "Unauthorized",
        description: "请求超时，请检查网络连接"
      });
    }
    return Promise.reject(error);
  }
);
// post get 请求
const fetch = (method, url, data = {}, config) => {
  config = config || {};
  config.method = method;
  config.url = url;
  method.toLocaleLowerCase() === "get"
    ? (config["params"] = data)
    : method.toLocaleLowerCase() === "delete"
    ? (config["params"] = data)
    : (config["data"] = data);
  return service(config).then(function(res) {
    return res.data;
  });
};
// 取消重复请求
const removeRepeatRequest = config => {
  for (const key in queue) {
    const index = +key;
    const item = queue[key];
    if (
      item.url === config.url &&
      item.method === config.method &&
      JSON.stringify(item.params) === JSON.stringify(config.params) &&
      JSON.stringify(item.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      item.cancel("操作太频繁，请稍后再试");
      queue.splice(index, 1);
    }
  }
};
const getAction = (url, data = {}, config) => {
  return fetch("get", url, data, config);
};
const postAction = (url, data = {}, config) => {
  return fetch("post", url, data, config);
};
const deleteAction = (url, data = {}, config) => {
  return fetch("delete", url, data, config);
};
const putAction = (url, data = {}, config) => {
  return fetch("put", url, data, config);
};
export { getAction, postAction, deleteAction, putAction };
