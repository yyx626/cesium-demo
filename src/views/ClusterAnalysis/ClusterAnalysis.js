/*
 * 聚类分析效果entity形式
 * @Author: yyx
 * @Date: 2022-06-26
 */
const Cesium = window.Cesium;
const ClusterAnalysis = function (viewer, data, options) {
  if (!viewer) throw new Error("no viewer object!");
  options = options || {};
  const defaultImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAACUhJREFUeF7tWntwVFcZ/313Hwkh3FBQHgFhZ8iSsKsUFpVmlProEIr+URWkJnS0MxQY7cOK2g5owi7PSp0W61CrxXbsY8tIrQpOK9SqM7QClmzKY3cJCSSZQqAFCrubpGQf93PuQnCze/c+9hGmhTOTyST3971+93znfOc7l3CdD7rO48cNAm7MgOucgWuSAtxW7iB7TyCV++eOTZ723aldwaF+H0UnINoqfg4SzSBmBwNzATiZ4Slxht2pwb7YanOTgNUAH2DQGyaBD0OS9n3H/u7xYpJSFAJCfnHUMIEWsMQLiDAvPQB1AgahEyDsZOa/DSPzzm9VHX+/0GQUlABuF6tiUTxIwAIGxmVz1gABqSouAuRlgTYvnnKirVBEFIyAaFC8nxmrSCXwAadzJGBA/DwRbTaJZZsXjfH35EtE3gTE/CPmgGglA/P1OpMnAUkzRHQkIUkb75ra5dVrVwmXFwHRYMUyMP/WqAOFIOCqTaKHGqo6HjXqwwA+ZwL6/aKbSF61jY+CEiDPBsBdb+/0GPckKWt85BO8bK3QBCR1SvAsru4ctLXqicwwAdGgeB8Yv9ajXDHnCOckCVuU6wC6F+BP5KqbQYsW2zu2G5E3RECyqEngv0YMXMG2AvQWWHpTAu0pdYbblXQ83z6xyiSZ54DwRWZ8gQjVRm0ZJUE3AX1HbppkFhJyqVpmwKk3AfzU6gjvMyBzFbqtzXaLBGwA8BUj8kZI0EUA+2GNQtyhVNVldYzhtTrDi404ng3rPWZ7CoTlenXJW6RJLKvVUyfoIiAWENcw0KjbAYF+bqkJrdeL14Pztk26CxCe14OVMUTUWF/VsU4Lr0nAJb9YZSLsZ2CUlrLkamyWHCVTezRPdfxtp7X3QqjaYoknrOWj22m7P6pHv7d98ttg+qwO7HkWhFqtslmTgFhAfIyBH+kwCAtjNDnDHyhhe24bM1Ywm1ewhBomVBMyFjg/QEeJuV0QhK2lu04qLpSybm+b7UMApdo+0ZMN9o571XCqBHDryJtjCUle9a2axhi3WJ3h/YrBzx1fB6InFILOpvYMARvKdncrbrcvHrPNIEKLpk/AxVIyVaudIlUJiAbExwE8qG2I77E6Ir9XwvXNq/wFMx7S1qGEoNeG7z71NaUn3jab7Jfsn+pg8D2L7V2KviXXCjXpaEBsBuBSwzDwaokj/HUlTG9dJWs5qOf58N3din56221/BuMbqjoIf2mo6vxmNkxWAj4MjrSZWOrQcpCYbrM4Q/9Mx/XWTXgVYN0nRNU8JWwq29X9cDrmpQ7bbI5Dq8ZICEhUZ+ssZSUg6h9xN4ie1SBgm9URrk/H9NVV3s/AE1rkGXnOzPPKXz+9O13G2zb5MECfVieQltVXdTytmGTZBKNB8Vkw7lZPMPq+1Rl6KhVzad7EqgRLe6CjMWKIAKAVifiXyt94/71UOW+7bTMYP9TQ9VyDvfN7xggIiAcAzFJTbLFIY8jeczYV0ze38hEmZExXI8FmzVeFVHih1XanIGCbhv4TDfbOKYYIiAXFU8yozK6Y/211RDJq9N66CS8DvKAQAWfoYOwY/nr3Han/fylos7EZ8vY7Rs1mg71TMd2zrwEBUXUFJ/ArFkckI9Deusojcuu7GAQw0Fq+u7smXbfcUteyJwj813p7V0btoEgAB8rGx2DuVlfKW62OyNJUjFze9oUu9Gs5k8/zsoqbSvSWzXrsKBIQDVbMArO8BmQdDN5U4ogMyvX++eMc8YTg12M4VwxLwvTyf5w8nKt8upwyAYEKF8ByEaQ2fmN1hH+QCvjYEMAnho+NXTKd0SBgj9URvvVjmQJyUNGAGAdgyrolARcsjnDGEflaLIIuT0JzESRO7Gh2W326UkAG9QfELgImqc0CSeCa0ppIaypmqLfBGW62CQJrboO+JsHwNvgfALVqBAhEC83TQn9KxQx1IeTyxO8ECaqFEAMnW5qETynFkrUOiAXEx1njKKzU3x/qUtjl4c0gVi+FCdt9jcIiQwT0BysWEPPLGgvhWQsnppOzd9CCOZSHIZdHOgyC6mEIRCt8jaTYO8j7OMygR0scoYyGx1Ach2et4dkM1joOQwJ9/p0metvQDEjuBMGKQ2D+jNosIKDXzCXjyHk246q62A2RmWuk7QQs1Jilu3xNwu0qu1l2cb13gMy8scQZWaWkqVgtsZlreQkxb9WsCFla5lttVuwFyLLqTdFA2fg4mQ+onwovu2B1hLPq6ilwU3T6ap5oNvG7msEDZ/olcvrdpNip1iQgWQ9oXIMT0GPm8GhyQrWvX8i2uMsjNYPUe5VJcoi2+BrpPo0UVudRPhmqzIL3QoLV/smacxEdb2MQJNeLkWTVR6Tnu4QzsNAc30rKer+gawbIoFhwxE+YKf0rjOMW4tk0LXLeaPC54GduYAfF+QUAM/XIM9EDLY2keY2veTM0YCwaGPEvgL58+W8+ZEHidnL0nU53pvYxHtbfw31EvAoJ4VfNburT47AaZqYnvoRI+CWAkTp1veZrEhTvE9LldRNw6eiIakGio2A+aCHTHeS42JURvJtH9QssN1JKrjyLALyOJOGZZjed0+n8VZhrLX+VmX9MgK5g/q8/cauvySI3ZjWHbgJkTVG/+IAk8N9Lp0WOpWu+eR1PMEksN0MqFKyeAtHTkBJH2WI63LKKBn0mm4qvlUkkzIcgzQeT4et1YlrUvJp0fyViiIBsdLo2chVi/JZWYzJFPgRGEOCDIITkm2cCjbr8G1fSTPPlZQCMBq97EVRzxbW6fzpM1p0Aqx6djYdjTIJBS1qa6BljUjl+JTZgZIabZwgC/xGA3ajhwuLpYV8TbcpFZ14p4PLwUhD/LhfDBZKJgqje10iv5KovLwJko7Me4UlSVNpIoIZcnchJjrEPUmy5z1NyKCf5K0J5EzBg3LWG5ZJzJcAqt0n5uHpZloAP5BLXOhwb964g+UuRvEbBCEjOhvU8nuPScpCwtAhEyNN9CxL9T/rcparlrRFGCkrAgOEBIoiEhQzO85qM9oKlfUzCH1qa6KCR4PRgi0JAquFZa3kKs9xclWoBkuv4CVd+FFru1A3waWJ+BxB2mSXs3e+hk3oCyRVTdAKyOTZ7PY+NAxM4ASITupt/RhnnilyDMiJ3zQgw4mQxsTcIKCa7HwXdN2bAR+EtFdPH/wHdlsBu1Z/+cgAAAABJRU5ErkJggg==";

  const clusterRules = options.clusterRules || {
    ranges: [1, 10, 100, 1000],
    images: [defaultImage, defaultImage, defaultImage, defaultImage],
    width: [36, 48, 64, 96],
  };
  data.clustering.enabled = true;
  data.clustering.pixelRange = options.pixelRange || 50;
  data.clustering.minimumClusterSize = options.minimumClusterSize || 2;
  // 动态监听
  data.clustering.clusterEvent.addEventListener(function (
    clusteredEntities,
    cluster
  ) {
    cluster.label.show = false; // 关闭label标签
    cluster.billboard.show = true;
    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    // 根据聚合数量的多少设置不同层级的图片以及大小
    for (let index = 0; index < clusterRules.ranges.length; index++) {
      const range1 = clusterRules.ranges[index];
      const range2 = clusterRules.ranges[index + 1]
        ? clusterRules.ranges[index + 1]
        : 100000000;
      if (
        clusteredEntities.length >= range1 &&
        clusteredEntities.length < range2
      ) {
        cluster.billboard.image = createIcon(
          clusterRules.images[index],
          clusteredEntities.length,
          64
        );
        cluster.billboard.width = clusterRules.width[index];
        cluster.billboard.height = clusterRules.width[index];
      }
    }
  });
  function createIcon(url, text, size) {
    let canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    let ctx = canvas.getContext("2d");
    let promise = new Cesium.Resource.fetchImage(url).then((image) => {
      try {
        ctx.drawImage(image, 0, 0);
      } catch (e) {
        console.log(e);
      }
      ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
      ctx.font = "bolder 19px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2);
      return canvas;
    });
    return promise;
  }
};
export default ClusterAnalysis;