/*
 * 高德地图主类
 * @Author: yyx
 * @Date: 2022-08-19
 */
 
import AmapMercatorTilingScheme from "./AmapMercatorTilingScheme";
const Cesium = window.Cesium;
 
class AmapImageryLayerProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options = {}) {
    if (!options.url) throw new Error("Map service url is required!");
    if (!options.subdomains || !options.subdomains.length) {
      options["subdomains"] = ["01", "02", "03", "04"];
    }
    if (options.crs === "WGS84") {
      options["tilingScheme"] = new AmapMercatorTilingScheme();
    }
    super(options);
  }
}
export default AmapImageryLayerProvider;