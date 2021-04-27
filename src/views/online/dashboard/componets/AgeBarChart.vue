<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import { debounce } from "@/utils";
import { fetchAgeData } from "@/api/online";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "200px"
    }
  },
  data() {
    return {
      chart: null,
      ageData: {
        category: null,
        testNumber: null,
        warningNumber: null
      }
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
    },

    getData() {
      fetchAgeData().then(response => {
        this.ageData = response.data;
        this.setOptions(this.ageData);
      });
    },
    setOptions({ category, testNumber, warningNumber } = {}) {
      // console.log(Object.prototype.toString.call(warningNumber[0]));
      // console.log(Object.prototype.toString.call(testNumber[0]));

      let option = {
        title: {
          text: "年龄测评预警统计"
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 33,
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: category,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "预警人数",
            type: "bar",
            stack: "people",
            barWidth: "60%",
            data: warningNumber,
            color: "#F5565E"
          },
          {
            name: "非预警人数",
            type: "bar",
            stack: "people",
            barWidth: "60%",
            data: testNumber,

            color: "#11A983"
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>
