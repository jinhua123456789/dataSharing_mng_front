<template>
  <div class="container">
    <el-tabs>
      <el-tab-pane v-for="(tabName,tabIndex) in tabNameList" :label="tabName">
        <ol>
          <li v-for="(recordItem,listIndex) in recordList[tabIndex]">
            <el-date-picker
              v-if="recordItem.index!=8"
              v-model="dateList[recordItem.index]"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="(e)=>dateEvent(e,tabIndex,listIndex,recordItem.index)">
            </el-date-picker>
            <el-select
              clearable
              v-model="recordItem.param"
              :placeholder="'请选择'+infoUrl[tabIndex].name"
              multiple
              @change="(e)=>idSelectEvent(e,tabIndex,listIndex,recordItem.index)">
              <el-option
                v-for="infoItem in infoList[tabIndex]"
                :value="tabIndex==0?infoItem.stationCode:infoItem.code"
                :label="tabIndex==0?infoItem.stationName:infoItem.name"
              />
            </el-select>
            <el-button class="download" @click="()=>downloadConfirm(recordItem.index)">
              <span class="download-text">下载</span>
              <span class="download-name">{{ recordItem.name}}</span>
            </el-button>
            <a href="" style="display: none" id="download_a"></a>
          </li>
        </ol>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {getInfo} from "@/api/report.js";
  import axios from 'axios'
  import {pickerOptions} from '@/utils/pickerOptions'

  const count = 29
  export default {
    name: "record",
    data() {
      return {
        pickerOptions,
        dateList: Array(count).fill(''),
        tabNameList: ['降水', '径流小区', '小流域控制站', '土壤水分', '植被盖度', '风蚀场', '面源污染'],
        infoUrl: [
          {url: 'station_info', name: '雨量站'},
          {url: 'jingliu_info', name: '径流小区'},
          {url: 'xiaoliuyukongzhizhan_id', name: '小流域控制站'},
          {url: 'soil', name: '土壤水分测点'},
          {url: 'observation_point_id', name: '测点编号'},
          {url: 'wind_field_id', name: '风蚀场'},
          {url: 'measure_point_survey_id', name: '面源污染测量点编号'}
        ],
        infoList: Array(7).fill([]),
        recordList: [
          [
            {name: '日雨量记录表', index: 0, param: '', url: 'dailyRainRecord'},
            {name: '雨量自动采集记录表', index: 1, param: '', url: 'rainData'}
          ],
          [
            {name: '径流小区田间管理记录表', index: 2, param: '', url: 'runoffPlotFieldManagement'},
            {name: '径流小区径流泥沙采样记录表', index: 3, param: '', url: 'sedimentSamplingRecord'},
            {name: '径流小区测产记录表', index: 4, param: '', url: 'yieldMeasurementOfRunoffPlot'}
          ],
          [
            {name: '小流域控制站日常检查维护记录表', index: 5, param: '', url: 'runoffWeirAndTroughDailyMaintenanceRecord'},
            {name: '小流域控制站径流泥沙监测记录表（ISCO）', index: 6, param: '', url: 'iscoRecord'},
            {name: '小流域控制站水位自动监测记录表', index: 7, param: '', url: 'weirAndTroughWaterLevelAutomaticMonitoringRecord'},
            {
              name: '小流域控制站径流泥沙监测记录表（全自动）',
              index: 8,
              param: '',
              url: 'weirAndTroughWaterLevelAutomaticMonitoringRecordAuto'
            },
            {
              name: '小流域控制站径流泥沙监测记录表（人工）',
              index: 9,
              param: '',
              url: 'weirAndTroughWaterLevelAutomaticMonitoringRecordPerson'
            },
            {name: '水位拍照', index: 10, param: '', url: 'waterLevelPhoto'}
          ],
          [
            {name: '土壤水分（TDR）观测记录表', index: 11, param: '', url: 'outSoilTdr'},
            {name: '土壤水分（自动）观测记录表', index: 12, param: '', url: 'outSoilAutomatic'},
            {name: '土壤水分（烘干法）观测记录表', index: 13, param: '', url: 'outSoilDry'}
          ],
          [
            {name: '植被郁闭度/盖度（目估法）记录表', index: 14, param: '', url: 'vegDensityCoverageVisualEvaluation'},
            {name: '植被郁闭度/盖度（人工照相法）记录表', index: 15, param: '', url: 'vegDensityCoverageArtificialPhoto'},
            {name: '植被郁闭度/盖度（自动照相法）记录表', index: 16, param: '', url: 'vegDensityCoverageAutomaticPhoto'},
            {name: '植被郁闭度/盖度（样线法）记录表', index: 17, param: '', url: 'vegDensityCoverageSpline'}
          ],
          [
            {name: '风蚀点自动风向风速表', index: 18, param: '', url: 'windAutomaticDirection'},
            {name: '风蚀测量点管理记录表', index: 19, param: '', url: 'windManagementRecord'},
            {name: '风蚀测量点风沙观测记录表', index: 20, param: '', url: 'sandRecord'},
            {name: '风蚀测量点地面粗糙度观测记录表', index: 21, param: '', url: 'groundCrudeRecord'}
          ],
          [
            {name: '测量点农药化肥施用调查表', index: 22, param: '', url: 'measurePointFertilizationInfo'},
            {name: '土壤养分含量测量表', index: 23, param: '', url: 'swRunoffNutrientContent'},
            {name: '雨水养分含量测量表', index: 24, param: '', url: 'rainNutrientContent'},
            {name: '径流小区径流养分含量测量表', index: 25, param: '', url: 'rpRunoffNutrientContent'},
            {name: '径流小区泥沙养分含量测量表', index: 26, param: '', url: 'runoffFloodNutrientContent'},
            {name: '小流域径流泥沙养分含量测量表', index: 27, param: '', url: 'watershedNutrientContent'},
            {name: '小流域径泥沙养分含量测量表', index: 28, param: '', url: 'watershedFloodNutrientContent'}
          ]
        ],
      }
    },
    mounted() {
      this.fetchData()
    },
    computed: {
      downLoadUrl() {
        const baseUrl = process.env.VUE_APP_DOWNLOAD_API + 'exportRecord/';
        return this.recordList.flat().map(item => baseUrl + item.url)
      }
    },
    methods: {
      fetchData() {
        const requestList = this.infoUrl.map((item,index) => {
          return getInfo(item.url,index)
        })
        axios.all(requestList).then(data => {
          this.infoList = data
        })
      },
      dateEvent(date, tabIndex, listIndex, recordIndex) {
        this.$set(this.dateList, recordIndex, date)
        this.$set(this.downLoadUrl, recordIndex, this.getCurrentUrl(tabIndex, listIndex, recordIndex))

      },
      idSelectEvent(selected, tabIndex, listIndex, recordIndex) {
        this.recordList[tabIndex][listIndex].param = selected
        this.$set(this.downLoadUrl, recordIndex, this.getCurrentUrl(tabIndex, listIndex, recordIndex))
      },
      /**
       * tabIndex 指第几个tab
       * listIndex 指某个tab下第几行数据
       * recordIndex 指折叠后的第几项数据
       * */
      getCurrentUrl(tabIndex, listIndex, recordIndex) {
        const baseUrl = process.env.VUE_APP_DOWNLOAD_API + 'exportRecord/';
        const url = this.recordList[tabIndex][listIndex].url
        const param = this.recordList[tabIndex][listIndex].param
        const date = this.dateList[recordIndex]
        let params = []
        if (param && param.length > 0) {
          params.push('stations=' + param.toString())

        }
        if (date && date.length > 0) {
          params.push('startTime=' + date[0])
          params.push('endTime=' + date[1])
        }
        return baseUrl + url + '?' + params.join('&')
      },
      downloadConfirm(recordIndex) {
        console.log(this.downLoadUrl[recordIndex])
        if (this.dateList[recordIndex]) {
          let link = document.getElementById('download_a')
          link.href = this.downLoadUrl[recordIndex]
          link.click()
        } else {
          this.$alert('未选择时间区间，是否继续下载？', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            let link = document.getElementById('download_a')
            link.href = this.downLoadUrl[recordIndex]
            link.click()
          })
        }
      }
    },
  }
</script>

<style scoped>
  .container {
    padding: 20px;
  }

  li {
    margin: 10px;
    padding: 10px;
  }
  .download-text {
    font-size: 12px;
  }

  .download-name {
    font-size: 14px;
    color: dodgerblue;
  }


</style>
