/*
 *高德API服务
 * @Author: Wang jianLei
 * @Date: 2022-09-22
 */
import axios from "axios";

/****** 创建axios实例 ******/
const service = axios.create({
  baseURL: "https://restapi.amap.com",
  timeout: 10000, // 请求超时时间
});

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    //请求错误处理
    Promise.reject(error);
  }
);

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
  (response) => {
    //成功请求到数据
    return response;
  },
  (error) => {
    //响应错误处理
    console.log(JSON.stringify(error));
    return Promise.reject(error);
  }
);

const key = "b48cc090b8735745293404f3c74fe9b0";
/**
 * 获取POI查询结果
 * @param {*} text 关键词
 * @returns POI集合
 */
export function getPOI(text) {
  return service({
    url: "v5/place/text?key=" + key + "&keywords=" + text,
    headers: {
      "Content-Type": "text/json",
    },
    method: "get",
  });
}

/**
 * 获取驾车路径规划结果
 * @param {*} origin 起始坐标
 * @param {*} destination 终点坐标
 * @param {*} type 类型0-最短时间，2-最短距离
 * @returns 路径规划结果JSON
 */
export function getPath4Drive(origin, destination, type) {
  return service({
    url:
      "v3/direction/driving?origin=" +
      origin +
      "&destination=" +
      destination +
      "&output=json&key=" +
      key +
      "&strategy=" +
      type,
    headers: {
      "Content-Type": "text/json",
    },
    method: "get",
  });
}