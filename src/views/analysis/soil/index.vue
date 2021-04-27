<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in chartList" :label="item.option.title.text" @tab-click="handleClick"
                   :name="index+''">
        <div class="card">
          <el-date-picker
            v-model="item.date"
            type="daterange"
            value-format="yyyy/MM/dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            unlink-panels
            :picker-options="pickerOptions"
            @change="(e)=>selectedEvent(e,index,'date')"
          >
          </el-date-picker>
          <el-select
            clearable
            multiple
            v-model="item.stationId"
            placeholder="请选择土壤水分测点"
            @change="(e)=>selectedEvent(e,index,'stationId')">
            <el-option
              v-for="item in soilInfo"
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
  import {getInfo, getSoilInfo} from "@/api/analysis";
  import {option1} from './chartOption'
  import {loadingOption, pickerOptions} from '@/utils/pickerOptions'

  const count = 1

  export default {
    data() {
      return {
        pickerOptions,
        activeName: '0',
        chartWidth: document.body.clientWidth - 210,
        soilInfo: [],
        chartList: [
          {option: option1, chartInstance: null, stationId: [], date: [], url: 'sequence'}
        ]
      }
    },
    mounted() {
      for (let index = 0; index < count; index++) {
        const currentObj = this.chartList[index]
        currentObj.chartInstance = this.$echarts.init(document.getElementById(`chart_${index}`))
        currentObj.chartInstance.setOption(currentObj.option)
      }
      getInfo('soil').then((data) => {
        this.soilInfo = data
        if (data.length > 0) {
          this.fetchSingleData(0)
        }
      })
      window.addEventListener('resize', this.resizeHandler)
    },
    methods: {
      async fetchSingleData(index) {
        const currentObj = this.chartList[index]
        const {url: requestUrl, date, stationId} = currentObj

        let params = {}
        if (stationId && stationId.length > 0) {
          params['stationId'] = stationId.toString()
        }
        if (date && date.length > 0) {
          params['startDate'] = date[0]
          params['endDate'] = date[1]
        }
        try {
          currentObj.chartInstance.showLoading(loadingOption)
          const result = await getSoilInfo(requestUrl, params)
          this.formteData(result, index)
        } catch (e) {

        } finally {
          currentObj.chartInstance.hideLoading()
        }
      },
      formteData(result, index) {
        const {option, chartInstance} = this.chartList[index]
        if (index == 0) {
          let legendList = [];
          const {datas, date} = result
          if(datas.length>0){
            option.xAxis.data = date
            option.series = datas.map(item => {
              legendList.push(item.name)
              return {name: item.name, type: 'line', emphasis: {focus: 'series'}, large: true, data: item.data}
            })
            option.legend = {data: legendList}
          }else{
            option.xAxis.data = []
            option.series = [{name:'',type: 'line',data:[]}]
            option.legend = {data: []}
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
