const options = [
  //柱状图
  {
    coord: [118, 26],
    size: [200, 350],
    option: {
      xAxis: [
        {
          type: "category",
          data: ["样例A", "样例B"],
          axisLabel: {
            show: true,
            textStyle: {
              color: "red",
              fontSize: 18,
              fontWeight: "bolder",
            },
          },
        },
      ],
      yAxis: [
        {
          show: false,
          type: "value",
        },
      ],
      series: [
        {
          name: "数据1",
          type: "bar",
          barGap: 0,
          data: [120, 332],
        },
        {
          name: "数据2",
          type: "bar",
          data: [78, 232],
        },
        {
          name: "数据3",
          type: "bar",
          data: [220, 382],
        },
        {
          name: "数据4",
          type: "bar",
          data: [150, 232],
        },
        {
          name: "数据5",
          type: "bar",
          data: [162, 118],
        },
      ],
    },
  },
  {
    coord: [118.3, 26.3],
    size: [200, 350],
    option: {
      series: [
        {
          name: "Area Mode",
          type: "pie",
          radius: [10, 80],
          roseType: "area",
          itemStyle: {
            borderRadius: 5,
          },
          label: {
            show: false,
          },
          data: [
            { value: 30, name: "数据 1" },
            { value: 28, name: "数据 2" },
            { value: 26, name: "数据 3" },
            { value: 24, name: "数据 4" },
            { value: 22, name: "数据 5" },
          ],
        },
      ],
    },
  },
  {
    coord: [118.15, 26.12],
    size: [200, 250],
    option: {
      xAxis: {
        type: "category",
        data: ["数据1", "数据2", "数据3", "数据4", "数据5"],
        axisLabel: {
          show: true,
          textStyle: {
            color: "red",
            fontSize: 18,
            fontWeight: "bolder",
          },
        },
      },
      yAxis: { show: false },
      series: [
        {
          data: [420, 232, 401, 434, 290],
          type: "line",
          smooth: true,
        },
        {
          data: [520, 332, 551, 334, 190],
          type: "line",
          smooth: true,
        },
        {
          data: [220, 92, 801, 434, 290],
          type: "line",
          smooth: true,
        },
      ],
    },
  },
];
export default options;
