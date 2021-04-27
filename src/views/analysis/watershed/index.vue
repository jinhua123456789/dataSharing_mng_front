<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in chartList" :label="item.option.title.text" @tab-click="handleClick"
                   :name="index+''">
        <div class="card">
          <el-date-picker
            v-if="index!=3"
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
          <el-date-picker
            v-if="index==3"
            v-model="item.startYear"
            type="year"
            placeholder="选择开始年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'startYear')">
          </el-date-picker>
          <el-date-picker
            v-if="index==3"
            v-model="item.endYear"
            type="year"
            placeholder="选择结束年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'endYear')">
          </el-date-picker>

          <el-select
            clearable
            multiple
            v-model="item.drainageBasinCode"
            placeholder="请选择小流域"
            @change="(e)=>selectedEvent(e,index,'drainageBasinCode')">
            <el-option
              v-for="item in waterShedInfo"
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
  import {getInfo, getWaterInfo} from "@/api/analysis";
  import {option1, option2, option3, option4, option_4_data} from './chartOption'
  import {Message} from "element-ui";
  import {loadingOption, pickerOptions} from '@/utils/pickerOptions'

  const count = 4
  export default {
    data() {
      return {
        pickerOptions,
        activeName: '0',
        chartWidth: document.body.clientWidth - 210,
        waterShedInfo: [],
        chartList: [
          {option: option1, chartInstance: null, drainageBasinCode: [], date: [], url: ['process/default', 'process']},
          {option: option2, chartInstance: null, drainageBasinCode: [], date: [], url: ['once/default', 'once']},
          {option: option3, chartInstance: null, drainageBasinCode: [], date: [], url: ['daily/default', 'daily']},
          {
            option: option4,
            chartInstance: null,
            drainageBasinCode: [],
            startYear: '',
            endYear: '',
            url: ['year', 'year']
          },
        ]
      }
    },
    mounted() {
      for (let index = 0; index < count; index++) {
        const currentObj = this.chartList[index]
        currentObj.chartInstance = this.$echarts.init(document.getElementById(`chart_${index}`))
        currentObj.chartInstance.setOption(currentObj.option)
      }
      getInfo('watershed').then((data) => {
        this.waterShedInfo = data
        if (data.length > 0) {
          this.fetchSingleData(0)
        }
      })
      window.addEventListener('resize', this.resizeHandler)
    },
    methods: {
      async fetchSingleData(index) {
        const currentObj = this.chartList[index]
        const {url, date, drainageBasinCode, startYear = '', endYear = ''} = currentObj
        const requestUrl = (date && date.length > 0) ? url[1] : url[0]
        let params = {}
        if (drainageBasinCode && drainageBasinCode.length > 0) {
          params['drainageBasinCode'] = drainageBasinCode.toString()
        }
        if (index == 3) {
          if (startYear && endYear) {
            if (startYear > endYear) {
              Message({
                message: '开始年大于结束年，请重新输入',
                type: 'error',
                duration: 3 * 1000
              })
              return
            }
            params.startYear = startYear
            params.endYear = endYear
          } else if (startYear) {
            params.startYear = startYear
            params.endYear = startYear
          } else if (endYear) {
            params.startYear = endYear
            params.endYear = endYear
          }
        } else if (date && date.length > 0) {
          params[index == 2 ? 'startDate' : 'startTime'] = date[0]
          params[index == 2 ? 'endDate' : 'endTime'] = date[1]
        }
        try {
          currentObj.chartInstance.showLoading(loadingOption)
          const result = await getWaterInfo(requestUrl, params)
          this.formteData(result, index)
        } catch (e) {

        } finally {
          currentObj.chartInstance.hideLoading()
        }
      },
      formteData(result, index) {
        const {option, chartInstance} = this.chartList[index]
        if (index == 0) {
          let xData = []
          const {date = [], xiaoliuyuJingliuNishaGuocheng = []} = result
          for (let i = 0; i < xiaoliuyuJingliuNishaGuocheng.length; i++) {
            for (let j = 0; j < date.length; j++) {
              const {drainageBasinCode} = xiaoliuyuJingliuNishaGuocheng[i]
              xData.push(date[j] + '\n' + drainageBasinCode)
            }
          }
          let flowArray = [], runoffArray = [], sandArray = [], sandModulusArray = []
          for (let j = 0; j < xiaoliuyuJingliuNishaGuocheng.length; j++) {
            const {flow, runoffDepthAccumulative, sand, sandModulusAccumulative} = xiaoliuyuJingliuNishaGuocheng[j]
            flowArray.push(...flow)
            runoffArray.push(...runoffDepthAccumulative)
            sandArray.push(...sand)
            sandModulusArray.push(...sandModulusAccumulative)
          }
          option.xAxis.data = xData
          option.series[0].data = flowArray
          option.series[1].data = sandArray
          option.series[2].data = runoffArray
          option.series[3].data = sandModulusArray
        } else if (index == 1) {
          let xData = [], durationArray = [], maxFlowArray = [], modulusArray = [], runoffDepthArray = [],
            runoffFatorArray = [],
            sandArray = [];
          for (let i = 0; i < result.length; i++) {
            const {date, drainageBasinCode, duration, maxFlow, modulus, runoffDepth, runoffFator, sand} = result[i]
            let dateTemp = []
            for (let j = 0; j < date.length; j++) {
              dateTemp.push(date[j] + '\n' + drainageBasinCode)
            }
            xData.push(...dateTemp)
            durationArray.push(...duration)
            maxFlowArray.push(...maxFlow)
            modulusArray.push(...modulus)
            runoffDepthArray.push(...runoffDepth)
            runoffFatorArray.push(...runoffFator)
            sandArray.push(...sand)
          }
          option.xAxis.data = xData
          option.series[0].data = durationArray //径流历时(min)
          option.series[1].data = runoffDepthArray //径流深(mm)
          option.series[2].data = runoffFatorArray //径流系数
          option.series[3].data = maxFlowArray //洪峰流
          option.series[4].data = sandArray//含沙量
          option.series[5].data = modulusArray//产沙模数
        } else if (index == 2) {
          const {date, drainageBasinCodes, flowDayAvg, runoffDepthAccumulativeDay, sandDayAvg, sandModulusAccumulativeDay} = result
          option.xAxis.data = date.length == drainageBasinCodes.length ? date : drainageBasinCodes

          option.series[0].data = flowDayAvg //日平均流量
          option.series[1].data = sandDayAvg //日平均含沙量(g/l)
          option.series[2].data = sandModulusAccumulativeDay //日产沙模数
          option.series[3].data = runoffDepthAccumulativeDay //日径流深
        } else if (index == 3) {
          option.xAxis.data = result.drainageBasinCode;
          let obj = {
            'yearRainfall': [],
            'rainfall109': [],
            'runoffDepthYear': [],
            'modulusYear': [],
            'runoffFatorYear': [],
            'snow104': [],
            'snowDay': [],
            'runoffDepthSnow': [],
            'modulusSnow': [],
            'rainfall59': [],
            'runoffCount': [],
            'runoffDepthRain': [],
            'modulusRain': [],
          }
          result.data.forEach(item => {
            for (let key in item) {
              if (obj.hasOwnProperty(key)) {
                obj[key].push(item[key])
              }
            }
          })
          for (let key in obj) {
            for (let i = 0; i < 13; i++) {
              if (option_4_data[i].en == key) {
                option.series[option_4_data[i].index].data = obj[key]
                break;
              }
            }
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
