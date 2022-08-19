/* 各厂商在线地图服务加载主类
 * @Author: yyx
 * @Date: 2022-08-19
 */
import ArcgisImageryLayerProvider from "./arcgis/ArcgisImageryLayerProvider";
import BaiduImageryLayerProvider from "./baidu/BaiduImageryLayerProvider";
import AmapImageryLayerProvider from "./amap/AmapImageryLayerProvider";
import TencentImageryLayerProvider from "./tencent/TencentImageryLayerProvider";
 
class ImageryLayer {
  constructor() {
    this.ArcgisImageryLayerProvider = ArcgisImageryLayerProvider;
    this.BaiduImageryLayerProvider = BaiduImageryLayerProvider;
    this.AmapImageryLayerProvider = AmapImageryLayerProvider;
    this.TencentImageryLayerProvider = TencentImageryLayerProvider;
  }
}
export default ImageryLayer;