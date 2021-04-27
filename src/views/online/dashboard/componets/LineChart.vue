<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import { debounce } from "@/utils";
import { fetchLineData } from "@/api/online";

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
      default: "300px"
    }
  },
  data() {
    return {
      chart: null,
      lineData: {
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
      fetchLineData().then(response => {
        this.lineData = response.data;
        this.setOptions(this.lineData);
      });
    },
    setOptions({ category, testNumber, warningNumber } = {}) {
      // console.log(Object.prototype.toString.call(warningNumber[0]));
      // console.log(Object.prototype.toString.call(testNumber[0]));

      let option = {
        title: {
          text: "人数月统计"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["评测数", "预警数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: category
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "评测数",
            type: "line",
            data: testNumber,
            color: "#6C6DF5"
          },
          {
            name: "预警数",
            type: "line",
            data: warningNumber,
            color: "#F5565E"
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>
