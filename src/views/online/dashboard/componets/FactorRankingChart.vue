<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
  import echarts from "echarts";
  require("echarts/theme/macarons"); // echarts theme
  import { debounce } from "@/utils";
  import { fetchFactorRankingData } from "@/api/online";

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
        factorRankingData: {
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
        fetchFactorRankingData().then(response => {
          this.FactorRankingData = response.data;
          this.setOptions(this.FactorRankingData);
        });
      },
      setOptions({ category, testNumber, warningNumber } = {}) {
        // console.log(Object.prototype.toString.call(warningNumber[0]));

        var option = {
          title: {
            text: "因子预警排名"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["预警数量", "评测人数"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "value",
              boundaryGap: [0, 0.01]
            }
          ],
          yAxis: [
            {
              type: "category",
              data: category
            }
          ],
          series: [
            {
              name: "评测人数",
              type: "bar",
              data: testNumber,
              label: {
                normal: {
                  position: "right",
                  show: true
                }
              },
              color: "#6C6DF5"
            },
            {
              name: "预警数量",
              type: "bar",
              data: warningNumber,
              label: {
                normal: {
                  position: "right",
                  show: true
                }
              },
              color: "#F5565E"
            }
          ]
        };
        this.chart.setOption(option);
      }
    }
  };
</script>
