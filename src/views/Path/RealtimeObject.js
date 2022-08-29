const Cesium = window.Cesium;
class RealTimeObject {
  constructor(viewer, options) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    options = options || {};
    this.image =
      options.image ||
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAArtJREFUWEftl0tIVFEYx//fwbl3DKFNBS4UexD02AQW4aYWMnPuQsWQHosWJaFFriJCJShIC4o2vdRsU5ughYXg3LlBD6JFlBQVQUSpuYgI2qlzr8z54vq4OFdn5jp3MILOZoY75/z/v/M/3/mYS/jLg1x/Zp75XOlBRLPGcwDud14hiBmvRQBEpFYCgJlFKABm3gxAJ6IPhQD/+wCF7HrhmtAJ2FIeJKI9DOx0hQl4zczPddO8HwSuYACuq1vlTE/3ADicxeieFom00uDgZC6QggA4FqtwhHgEYEeeXb7VlGogyxrPNq8gAMcwrjHzySARE9F1LZFoKwpA19jEuVPHGl+SENYSgg8AlABo9P/2o2rjvqqeGwNLQQRO4MLoZA0Erz3d0tQA5iOeGNFHAAf0ROKT+2xKyr0CeJpR6cDNq30DxzsqS92mkzECA3R/nxrpqCxdb0v5BcCmeRUGeqOm2bpQ1ZbyFYBd888IeHbl9sPLacbns5XRr8u+hl2jXE6UirWfaHrhpNMZAgAO+a+cYxi3mNmDYuBX1DTXXRy3G9sr9IyjCJxA13jK6GiuH3aE+OlL0dRN0/ASicfLHaJvAKLePOZ3ejK55I0JDjBm79cj2pO2o8YdAPULIdyI08D5iBBlaaUuAdjmO+hOPZnsDlWEvW840lJN046UzQz0B7mCXg0oVa1Z1nAoAF+RmQDiQSAY6IuaZktR+sC8SErKOAEuRN5BOXbvLg5cA36nlJT9BDTnIsi3+1AAv2trV5eVlAwxUJMF4r2mVA1Z1kROyDD/iOxYbDtm23K530QptaHUskbynVHBR+DVg2EYgvkuA2u8qhditzY05HbDvCM0gOtgG8ZWAs6AeYtSqjNqWY/zOs9NKApAULOi9YEwhv61/xPImkAxYw6gtejVLMCa4k7x3g2LK7s8tT9tftUwFapyPwAAAABJRU5ErkJggg==";
    this.curPosition = new Cesium.Cartesian3();
    this.scale = options.scale || 1;
    this.width = options.width || 5;
    this.positions = [];
    this.init();
  }
  init() {
    let $this = this;
    this.model = this.viewer.entities.add({
      name: "real-time-object",
      position: new Cesium.CallbackProperty(function () {
        return $this.curPosition;
      }, false),
      billboard: {
        image: this.image,
        scale: this.scale,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0,
          6.8e10
        ),
      },
      polyline: {
        positions: new Cesium.CallbackProperty(function () {
          if ($this.positions.length === 0) {
            return Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0]);
          }
          return Cesium.Cartesian3.fromDegreesArrayHeights($this.positions);
        }, false),
        width: this.width,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,
          color: Cesium.Color.BLUE.withAlpha(0.9),
        }),
      },
    });
  }
  updateData(position) {
    this.curPosition = Cesium.Cartesian3.fromDegrees(
      position.x,
      position.y,
      position.z
    );
    this.positions.push(position.x, position.y, position.z);
  }
  destroy() {
    this.viewer.entities.remove(this.model);
    delete this.model;
    delete this.curPosition;
    delete this.positions;
  }
}
export default RealTimeObject;