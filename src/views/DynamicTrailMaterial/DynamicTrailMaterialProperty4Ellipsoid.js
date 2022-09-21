/*
 * 动态遮罩（球）材质
 * @Author: yyx
 * @Date: 2022-09-21
 * 只需修改 st.t < 0.0 部分即可实现半球到全球的过渡,范围[0.0-1.0]
 */
const Cesium = window.Cesium;
class DynamicTrailMaterialProperty4Ellipsoid {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this.color = options.color;
    this.speed = options.speed;
  }
 
  get isConstant() {
    return false;
  }
 
  get definitionChanged() {
    return this._definitionChanged;
  }
 
  getType() {
    return Cesium.Material.EllipsoidTrailMaterialType;
  }
 
  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
 
    result.color = Cesium.Property.getValueOrDefault(
      this.color,
      time,
      Cesium.Color.RED,
      result.color
    );
    result.speed = Cesium.Property.getValueOrDefault(
      this.speed,
      time,
      10,
      result.speed
    );
    return result;
  }
 
  equals(other) {
    return (
      this === other ||
      (other instanceof DynamicTrailMaterialProperty4Ellipsoid &&
        Cesium.Property.equals(this.color, other.color) &&
        Cesium.Property.equals(this.speed, other.speed))
    );
  }
}
 
Object.defineProperties(DynamicTrailMaterialProperty4Ellipsoid.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
  speed: Cesium.createPropertyDescriptor("speed"),
});
 
Cesium.DynamicTrailMaterialProperty4Ellipsoid =
  DynamicTrailMaterialProperty4Ellipsoid;
Cesium.Material.DynamicTrailMaterialProperty4Ellipsoid =
  "DynamicTrailMaterialProperty4Ellipsoid";
Cesium.Material.EllipsoidTrailMaterialType = "EllipsoidTrailMaterialType";
Cesium.Material.EllipsoidTrailMaterialSource = `
    uniform vec4 color;
    uniform float speed;
    czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float time = fract(czm_frameNumber * speed / 1000.0);
    if (st.t < 0.0) {
      discard;
    }
    float alpha = abs(smoothstep(0.5,1.,fract( -st.t - time)));
    alpha += .1;
    material.alpha = alpha;
    material.diffuse = color.rgb;
    return material;
}
`;
 
Cesium.Material._materialCache.addMaterial(
  Cesium.Material.EllipsoidTrailMaterialType,
  {
    fabric: {
      type: Cesium.Material.EllipsoidTrailMaterialType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
        speed: 10.0,
      },
      source: Cesium.Material.EllipsoidTrailMaterialSource,
    },
    translucent: function () {
      return true;
    },
  }
);