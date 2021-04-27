<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in chartList" :label="item.option.title.text" @tab-click="handleClick"
                   :name="index+''">
        <div class="card">
          <el-date-picker
            v-model="item.startYear"
            type="year"
            placeholder="选择开始年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'startYear')">
          </el-date-picker>
          <el-date-picker
            v-model="item.endYear"
            type="year"
            placeholder="选择结束年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'endYear')">
          </el-date-picker>

          <el-select
            clearable
            multiple
            v-model="item.qIds"
            placeholder="请选择小流域"
            @change="(e)=>selectedEvent(e,index,'qIds')">
            <el-option
              v-for="item in runOffInfo"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-button type="primary" @click="fetchSingleData(index)">查询</el-button>
          <div :id="'chart_'+index" class="chart" :style="{width:chartWidth+'px'}"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {getInfo, getRunOffInfo} from "@/api/analysis";
  import {option1, option2, option3} from './chartOption'
  import {loadingOption} from '@/utils/pickerOptions'

  const count = 3

  export default {
    data() {
      return {
        activeName: '0',
        chartWidth: document.body.clientWidth - 210,
        runOffInfo: [],
        chartList: [
          {option: option1, chartInstance: null, qIds: [], startYear: '', endYear: '', url: 'yearly'},
          {option: option2, chartInstance: null, qIds: [], startYear: '', endYear: '', url: 'sequence'},
          {option: option3, chartInstance: null, qIds: [], startYear: '', endYear: '', url: 'grains'},
        ]
      }
    },
    mounted() {
      for (let index = 0; index < count; index++) {
        const currentObj = this.chartList[index]
        currentObj.chartInstance = this.$echarts.init(document.getElementById(`chart_${index}`))
        currentObj.chartInstance.setOption(currentObj.option)
      }
      getInfo('runoff').then((data) => {
        this.runOffInfo = data
        if (data.length > 0) {
          this.fetchSingleData(0)
        }
      })
      window.addEventListener('resize', this.resizeHandler)
    },
    methods: {
      async fetchSingleData(index) {
        const currentObj = this.chartList[index]
        const {url: requestUrl, startYear, endYear, qIds} = currentObj

        let params = {}
        if (qIds && qIds.length > 0) {
          params['qIds'] = qIds.toString()
        }
        if (startYear) {
          params['startYear'] = startYear
        }
        if (endYear) {
          params['endYear'] = endYear
        }
        try {
          currentObj.chartInstance.showLoading(loadingOption)
          const result = await getRunOffInfo(requestUrl, params)
          this.formteData(result, index)
        } catch (e) {

        } finally {
          currentObj.chartInstance.hideLoading()
        }
      },
      formteData(result, index) {
        const {option, chartInstance} = this.chartList[index]
        if (index == 0) {
          const {xiaoquNamelist = [], nishaNianList = []} = result
          let obj = {s_0_data: [], s_1_data: [], s_2_data: [], s_3_data: [], s_4_data: [], s_5_data: []}
          // ['降水量(mm)', '降雨侵蚀力(MJ.mm/(ha.h))', '径流深(mm)', '径流系数', '土壤流失模数(t/hm2)','径流次数']
          nishaNianList.forEach(item => {
            const {rainfall, rainfallErosivity, runoffDepth, runoffCoefficient, runoffTimes, soilLoss} = item
            obj['s_0_data'].push(rainfall)
            obj['s_1_data'].push(rainfallErosivity)
            obj['s_2_data'].push(runoffDepth)
            obj['s_3_data'].push(runoffCoefficient)
            obj['s_4_data'].push(soilLoss)
            obj['s_5_data'].push(runoffTimes)
          })
          option.xAxis.data = xiaoquNamelist
          for (let i = 0; i < 6; i++) {
            option.series[i].data = obj[`s_${i}_data`]
          }
        } else if (index == 1) {
          const {sequenceNishaResList = [], xiaoquList = []} = result
          let obj = {s_0_data: [], s_1_data: [], s_2_data: [], s_3_data: [], s_4_data: [], s_5_data: []}
          sequenceNishaResList.forEach((item, index) => {
            //['雨量', '降雨侵蚀力(MJ.mm/(ha.h))', '径流深(mm)', '径流系数', '含沙量', '土壤流失模数(t/hm2)']
            const {precipitation, r, runoffCoefficient, runoffDepth, soiLoss, totalSilt} = item
            obj['s_0_data'].push(precipitation)
            obj['s_1_data'].push(r)
            obj['s_2_data'].push(runoffDepth)
            obj['s_3_data'].push(runoffCoefficient)
            obj['s_4_data'].push(soiLoss)
            obj['s_5_data'].push(totalSilt)
          })
          option.xAxis.data = xiaoquList
          for (let i = 0; i < 6; i++) {
            option.series[i].data = obj[`s_${i}_data`]
          }
        } else if (index == 2) {
          const {xiaoquNamelist, grainsResList} = result

          let obj = {s_0_data: [], s_1_data: [], s_2_data: []}
          grainsResList.forEach((item, index) => {
            //['地上生物量（kg/hm²）', '粮食产量（kg/hm²）', 'HI']
            const {biomass, grainAmount, hi} = item
            obj['s_0_data'].push(biomass)
            obj['s_1_data'].push(grainAmount)
            obj['s_2_data'].push(hi)
          })
          option.xAxis.data = xiaoquNamelist
          for (let i = 0; i < 3; i++) {
            option.series[i].data = obj[`s_${i}_data`]
          }
        }
        chartInstance.setOption(option)
      },
      selectedEvent(selected, index, field) {
        console.log('selected=', selected)
        this.chartList[index][field] = selected
      },
      handleClick(tab) {
        this.activeName = tab.name
        this.fetchSingleData(tab.name * 1)
      },
      resizeHandler() {
        const currentObj = this.chartList[this.activeName * 1]
        currentObj.chartInstance.resize()
      }
    },
    beforeDestroy() {
      for (let index = 0; index < count; index++) {
        const currentObj = this.chartList[index]
        currentObj.chartInstance.clear()
      }
      window.removeEventListener('resize', this.resizeHandler)
    }
  }

</script>

<style>
  .card {
    margin: 30px 0;
  }

  .chart {
    height: 500px;
    margin-top: 20px;
  }

  .circle {
    display: inline-block;
    margin-right: 5px;
    border-radius: 10px;
    width: 10px;
    height: 10px;
  }
</style>
