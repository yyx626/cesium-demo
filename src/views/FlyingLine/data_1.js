const endOption = {
  name: "无锡",
  coords: [120.3442, 31.5527],
};
const startOption = [
  {
    name: "北京",
    value: 20,
    coords: [116.4551, 40.2539],
  },
  {
    name: "上海",
    value: 12,
    coords: [121.4648, 31.2891],
  },
  {
    name: "广州",
    value: 32,
    coords: [113.5107, 23.2196],
  },
  {
    name: "大连",
    value: 42,
    coords: [122.2229, 39.4409],
  },
  {
    name: "青岛",
    value: 12,
    coords: [120.4651, 36.3373],
  },
  {
    name: "石家庄",
    value: 12,
    coords: [114.4995, 38.1006],
  },
  {
    name: "南昌",
    value: 3,
    coords: [116.0046, 28.6633],
  },
  {
    name: "合肥",
    value: 56,
    coords: [117.29, 32.0581],
  },
  {
    name: "呼和浩特",
    value: 32,
    coords: [111.4124, 40.4901],
  },
  {
    name: "宿州",
    value: 23,
    coords: [117.5535, 33.7775],
  },
  {
    name: "曲阜",
    value: 16,
    coords: [117.323, 35.8926],
  },
  {
    name: "杭州",
    value: 7,
    coords: [119.5313, 29.8773],
  },
  {
    name: "武汉",
    value: 36,
    coords: [114.3896, 30.6628],
  },
  {
    name: "深圳",
    value: 26,
    coords: [114.5435, 22.5439],
  },
  {
    name: "珠海",
    value: 18,
    coords: [113.7305, 22.1155],
  },
  {
    name: "福州",
    value: 47,
    coords: [119.4543, 25.9222],
  },
  {
    name: "西安",
    value: 31,
    coords: [109.1162, 34.2004],
  },
  {
    name: "赣州",
    value: 39,
    coords: [116.0046, 25.6633],
  },
];
function getLineData() {
  const lineData = [];
  startOption.forEach((element) => {
    const data = {
      fromName: element.name,
      toName: endOption.name,
      value: element.value,
      coords: [endOption.coords, element.coords], //往外发散
    };
    lineData.push(data);
  });
  return lineData;
}
function getPointData() {
  const pointData = [];
  startOption.forEach((element) => {
    let coords = element.coords;
    const data = {
      name: element.name,
      value: [coords[0], coords[1], element.value],
    };
    pointData.push(data);
  });
  return pointData;
}
 
// 自定义图标
var symbol =
  "path://M512 28.444444 113.777778 597.333333l170.666667 0 0 113.777778 455.111111 0 0-113.777778 170.666667 0L512 28.444444zM284.444444 881.777778l455.111111 0 0-113.777778L284.444444 768 284.444444 881.777778zM284.444444 995.555556l455.111111 0 0-56.888889L284.444444 938.666667 284.444444 995.555556z";
 
const pathOption = {
  animation: false,
  GLMap: {},
  series: [
    {
      type: "lines",
      coordinateSystem: "GLMap",
      zlevel: 2,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.1,
        symbol: symbol,
        symbolSize: 15,
      },
      lineStyle: {
        normal: {
          color: function (param) {
            if (param.data.value < 30) {
              return "#ffff00";
            } else {
              return "#ff0000";
            }
          },
          width: 2,
          opacity: 0.8,
          curveness: 0.2,
        },
      },
      data: getLineData(),
    },
    {
      type: "effectScatter",
      coordinateSystem: "GLMap",
      zlevel: 2,
      rippleEffect: { brushType: "stroke" },
      label: {
        normal: {
          show: true,
          position: "bottom",
          formatter: "{b} \n {@[2]}",
          align: "left",
          distance: 15,
          fontWeight: "bolder",
        },
      },
      symbolSize: function (param) {
        if (param[2] < 30) {
          return 10;
        } else {
          return 20;
        }
      },
      itemStyle: {
        normal: {
          color: function (param) {
            if (param.data.value[2] < 30) {
              return "#ffff00";
            } else {
              return "#ff0000";
            }
          },
        },
      },
      data: getPointData(),
    },
  ],
};
 
export default pathOption;