<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in chartList" :label="item.option.title.text" @tab-click="handleClick"
                   :name="index+''" v-if="index!=add_new_index">
        <div class="card">
          <el-date-picker
            v-if="index==0 || index==3"
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
            v-model="item.date"
            v-if="index==1 "
            type="year"
            placeholder="请选择年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'date')">
          </el-date-picker>
          <el-date-picker
            v-model="item.startYear"
            v-if="index==2 || index==4 "
            type="year"
            placeholder="选择开始年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'startYear')">
          </el-date-picker>
          <el-date-picker
            v-model="item.endYear"
            v-if="index==2 || index==4 "
            type="year"
            placeholder="选择结束年"
            value-format="yyyy"
            @change="(e)=>selectedEvent(e,index,'endYear')">
          </el-date-picker>
          <el-select
            clearable
            v-model="item.stationId"
            :multiple="index==0 || index==2|| index==4"
            placeholder="请选择雨量站"
            @change="(e)=>selectedEvent(e,index,'stationId')">
            <el-option
              v-for="item in stationInfo"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-button type="primary" @click="fetchSingleData(index)">查询</el-button>
          <div :id="'chart_'+index" class="chart" :style="{width:chartWidth+'px'}"></div>
          <div v-if="index==0" style="margin-top: 20px">
            <el-date-picker
              v-model="chartList[add_new_index].date"
              type="daterange"
              value-format="yyyy/MM/dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              unlink-panels
              :picker-options="pickerOptions"
              @change="(e)=>selectedEvent(e,add_new_index,'date')"
            ></el-date-picker>
            <el-select
              clearable
              :multiple='true'
              v-model="chartList[add_new_index].stationId"
              placeholder="请选择雨量站"
              @change="(e)=>selectedEvent(e,add_new_index,'stationId')">
              <el-option
                v-for="item in stationInfo"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-button type="primary" @click="fetchSingleData(add_new_index)">查询</el-button>
            <div :id="'chart_'+add_new_index" class="chart" :style="{width:chartWidth+'px'}"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {getInfo, getRainData} from "@/api/analysis";
  import {option1, option2, option3, option4, option5, option6, option_5_data} from './chartOption'
  import {Message} from "element-ui";
  import {loadingOption, pickerOptions} from '@/utils/pickerOptions'

  const count = 6
  export default {
    data() {
      return {
        pickerOptions,
        activeName: '0',
        chartWidth: document.body.clientWidth - 210,
        stationInfo: [],
        chartList: [
          {option: option1, chartInstance: null, stationId: [], date: [], url: ['daily/default', 'daily']},
          {option: option2, chartInstance: null, stationId: '', date: '', url: ['process/default', 'process']},
          {option: option3, chartInstance: null, stationId: [], startYear: '', endYear: '', url: ['month', 'month']},
          {option: option4, chartInstance: null, stationId: '', date: [], url: ['once/default', 'once']},
          {option: option5, chartInstance: null, stationId: [], startYear: '', endYear: '', url: ['year', 'year']},
          {option: option6, chartInstance: null, stationId: [], date: '', url: ['accu/default', 'accu']},
        ],
        add_new_index: 5
      }
    },
    mounted() {
      for (let index = 0; index < count; index++) {
        const currentObj = this.chartList[index]
        currentObj.chartInstance = this.$echarts.init(document.getElementById(`chart_${index}`))
        currentObj.chartInstance.setOption(currentObj.option)
      }
      getInfo('rainfall').then((data) => {
        this.stationInfo = data
        if (data.length > 0) {
          this.fetchSingleData(0)
          this.fetchSingleData(this.add_new_index)
        }
      })
      window.addEventListener('resize', this.resizeHandler)
    },
    methods: {
      async fetchSingleData(index) {
        const currentObj = this.chartList[index]
        const {url, date, stationId, startYear = '', endYear = ''} = currentObj
        const requestUrl = (date && date.length > 0) ? url[1] : url[0]
        let params = {}
        if (stationId instanceof Array && stationId.length > 0) {
          params['stationId'] = stationId.join(',')
        } else if (stationId) {
          params['stationId'] = stationId
        }
        if (index == 2 || index == 4) {
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
        } else if (index == 1) {
          if (date) {
            params['startDate'] = date + '/01/01'
            params['endDate'] = date + '/12/31'
          }
        } else {
          if (date && date.length == 2) {
            params['startDate'] = date[0]
            params['endDate'] = date[1]
          }
        }
        try {
          currentObj.chartInstance.showLoading(loadingOption)
          const result = await getRainData(requestUrl, params)
          this.formteData(result, index)
        } catch (e) {

        } finally {
          currentObj.chartInstance.hideLoading()
        }
      },
      formteData(result, index) {
        const {option, chartInstance, stationId} = this.chartList[index]
        if (index == 0) {
          if (result.hasOwnProperty('date')) {
            const {date = [], rainfalls = [], stations = []} = result
            option.xAxis.data = stationId.length == 1 ? date : stations
            option.series[0].data = rainfalls
          }
        } else if (index == 5) {
          if (result.hasOwnProperty('date')) {
            const {date = [], accRainfalls = [], stations = []} = result
            option.xAxis.data = stationId.length == 1 ? date : stations
            option.series[0].data = accRainfalls
          }
        } else if (index == 1) {
          if (result.hasOwnProperty('date') && result.date.length > 0) {
            const {date = [], rainfallProcesses = []} = result
            const year = date[0].substr(0, 4);
            option.xAxis.data = date.map(item => item.slice(5))
            option.title.subtext = rainfallProcesses.length > 0 ? year + '年 ' + rainfallProcesses[0].stationId : year
            option.series[0].data = rainfallProcesses.length > 0 ? rainfallProcesses[0].rainfalls : []
            const current = this.chartList[index]
            current.stationId = rainfallProcesses[0].stationId
            current.date = year
            this.$set(this.chartList, index, current)
          } else {
            option.xAxis.data = []
            option.title.subtext = ''
            option.series[0].data = []
          }

        } else if (index == 2) {//月
          if (result.hasOwnProperty('date')) {
            const {date = [], maxDayRain = [], rainDays = [], rainfalls = [], stations = []} = result
            option.xAxis.data = stationId.length == 1 ? date : stations
            option.series[0].data = rainfalls
            option.series[1].data = rainDays
            option.series[2].data = maxDayRain
          }
        } else if (index == 3) {//次
          if (result.length == 1) {
            const {rainfalls, avgRaininess, i30, e, ei30, order, date} = result[0]
            option.xAxis.data = order;
            option.series[0].data = rainfalls //次降雨量
            option.series[1].data = avgRaininess //平均雨强
            option.series[2].data = i30 //I30
            option.series[3].data = e //E
            option.series[4].data = ei30 //'EI30(MJ.mm

            option.tooltip.formatter = function (params) {
              if (params instanceof Array && params.length > 0) {
                const {dataIndex, name} = params[0]
                let str = `${name}</br>`
                params.forEach((item, index) => {
                  const {seriesName, color, value} = item
                  str += `<span class='circle' style="background-color:${color};"></span>${seriesName}:${value}</br>`
                })
                str += `date:${date[dataIndex]}`
                return str
              }
            }
          }
        } else if (index == 4) {//年
          option.xAxis.data = result.station;
          let obj = {
            'yearPrecipitation': [],
            'days': [],
            'maxMonthRainfall': [],
            'maxMonth': [],
            'maxDayRainfall': [],
            'maxDayOfYear': [],
            'yearRainfall': [],
            'rainDays': [],
            'yearErosivity': [],
            'rainTimes': [],
            'erosiveRainTimes': [],
            'maxOnceRainfall': [],
            'maxOnceDuration': [],
            'maxOnceI30': [],
            'maxOnceRainfallEi30': [],
            'OrderOfMaxOnceRainfall': [],
            'maxOnceEi30Rainfall': [],
            'maxOnceEi30': [],
            'maxOnceEi30Duration': [],
            'maxOnceEi30I30': [],
            'maxOnceEi30Order': [],
          }
          result.data.forEach(item => {
            for (let key in item) {
              if (obj.hasOwnProperty(key)) {
                obj[key].push(item[key])
              }
            }
          })
          for (let key in obj) {
            for (let i = 0; i < 21; i++) {
              if (option_5_data[i].en == key) {
                option.series[option_5_data[i].index].data = obj[key]
                break;
              }
            }
          }
        }
        chartInstance.setOption(option)
      },
      selectedEvent(selected, index, field) {
        console.log('selected=', selected, index, field)
        this.chartList[index][field] = selected
      },
      handleClick(tab) {
        this.activeName = tab.name
        if (tab.name == 0) {
          this.fetchSingleData(this.add_new_index)
        }
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
