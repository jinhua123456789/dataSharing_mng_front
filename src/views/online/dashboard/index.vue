<template>
  <div class="dashboard-editor-container">
      <el-row :gutter="8">
        <panel-group
          class="chart-wrapper"
        />
      </el-row>
      <el-row>
          <h2>地区预警人数</h2>
          <ve-map :data="chartData" :settings="chartSettings"></ve-map>
        
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-row>
            <el-col>
              <div class="chart-wrapper">
                <line-chart />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="chart-wrapper">
                <pie-chart />
              </div>
            </el-col>
          </el-row>
        </el-col>
        
        <el-col :span="12">
          <el-row>
            <el-col>
              <div class="chart-wrapper">
                <ScaleRankingChart />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="chart-wrapper">
                <FactorRankingChart />
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <div class="chart-wrapper">
            <age-bar-chart />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-wrapper">
            <class-bar-chart />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-wrapper">
            <other-bar-chart />
          </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import PanelGroup from "./componets/PanelGroup";
import PieChart from "./componets/PieChart";
import ScatterChart from "./componets/ScatterChart";
import OtherBarChart from "./componets/OtherBarChart";
import ScaleRankingChart from "./componets/ScaleRankingChart";
import FactorRankingChart from "./componets/FactorRankingChart";
import LineChart from "./componets/LineChart";
import AgeBarChart from "./componets/AgeBarChart.vue";
import ClassBarChart from "./componets/ClassBarChart.vue";
import { fetchScatterData } from "@/api/online";
export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    PieChart,
    ScatterChart,
    OtherBarChart,
    ScaleRankingChart,
    FactorRankingChart,
    LineChart,
    AgeBarChart,
    ClassBarChart
  },
  created(){
    
    this.getData();
  },
  data() {
    this.chartSettings = {
      mapGrid: {
        left: 300,
        right: 300,
        top: 10,
        bottom: 10
      }
    }
    return {
      
      chartData: {
          columns: ['位置', '税收', '人口', '面积'],
          rows: [
            { '位置': '吉林', '税收': 123, '人口': 123, '面积': 92134 },
            { '位置': '北京', '税收': 1223, '人口': 2123, '面积': 29234 },
            { '位置': '上海', '税收': 2123, '人口': 1243, '面积': 94234 },
            { '位置': '浙江', '税收': 4123, '人口': 5123, '面积': 29234 }
          ]
        }
    };
  },
  methods: {
    getData() {
      var dt = {
        columns: ['位置', '总评估人数' ,'总预警人数'],
        rows: [
        
        ]
      }
      fetchScatterData().then(response => {
       
        response.data.areaDataArrayList.forEach(v=>{
          var eval_number = 0;//评估人数
          var warn_number = 0;
          console.log(v)
          for(var i = 0; i < v.data.length; i++){
            eval_number += v.data[i].evaluateNumber;
            warn_number += v.data[i].warningNumber;
          }
          
          dt.rows.push({ '位置': v.name, '总评估人数': eval_number, '总预警人数': warn_number})
          this.chartData = dt;
        })
      });
    }
  }
  
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 8px;
  // background-color: #A0ECF9;
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 4px 4px 4px 4px;
    margin-bottom: 8px;
  }
  h2{
    font-weight: 400;
    font-size: 18px;
    color: #0099CC;
  }
}
</style>
