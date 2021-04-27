<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-select v-model="reportIndex" placeholder="请选择" class="select" @change="reportSelectEvent">
          <el-option
            v-for="(item,index) in allReportOptions"
            v-if="index<9 || index>16"
            :key="item.index"
            :label="item.label"
            :value="item.index"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button type="primary">
          <i class="el-icon-download el-icon--right"></i>
          <a type="primary" :href="currentUrl">下载{{allReportOptions[reportIndex].label}}</a>
        </el-button>
      </el-col>
    </el-row>
    <div>
      <div v-for="(item,index) in allReportOptions">
        <div v-show="index===reportIndex && (index<9 || index>16)">
          <div v-if="showMoreTable()">
            <div class="flex mt20">
              <el-date-picker
                v-model="allSelectedYear[specialMoreTableNum(index,1)]"
                type="year"
                placeholder="选择年"
                :clearable="false"
                class="mr20"
                @change="(e)=>dateEvent(e,index)"
              />
              <!-- 径流小区整编表1 选择雨量站-->
              <el-select
                v-if="index===0"
                v-model="stationIndex[specialMoreTableNum(index,1)]" placeholder="请选择雨量站"
                @change="(e)=>stationSelectEvent(e,index)">
                <el-option
                  v-for="(item,index) in stationInfo"
                  :key="index"
                  :label="item.stationName"
                  :value="index"/>
              </el-select>
              <!-- 小流域整编表1、5 选择小流域id-->
              <el-select
                v-else-if="index===15 || index===19"
                v-model="drainageIndex[specialMoreTableNum(index,1)]" placeholder="请选择小流域"
                @change="(e)=>drainageSelectEvent(e,index)">
                <el-option v-for="item in drainageInfo" :key="item" :label="item" :value="item"/>
              </el-select>
              <!-- 小流域整编表3,4 选择小流域控制站code-->
              <el-select
                v-else
                v-model="controlIndex[specialMoreTableNum(index,1)]" placeholder="请选择小流域控制站"
                @change="(e)=>controlSelectEvent(e,index)">
                <el-option v-for="(item,index) in controlInfo" :key="index" :label="item.name" :value="index"/>
              </el-select>
            </div>
            <h3 class="h3">{{getTitle(index)}}</h3>
            <div v-for="numIndex in 3 ">
              <h4 class="h4" v-if="numIndex==1">日降水量</h4>
              <h4 class="h4" v-if="numIndex==2">月统计</h4>
              <h4 class="h4" v-if="numIndex==3">年统计</h4>
              <reportTable
                :tableHeader="allHeader[specialMoreTableNum(index,numIndex)]"
                :tableDataBody="tableData[specialMoreTableNum(index,numIndex)].content"
                :index="specialMoreTableNum(index,numIndex)"
                :isPagination="false"
                :loading="allLoading[specialMoreTableNum(index,numIndex)]"
              />
            </div>
          </div>

          <div v-else>
            <div class="flex mt20">
              <el-date-picker
                v-if="isShowYear(index)"
                v-model="allSelectedYear[specialSingleTableNum(index)]"
                type="year"
                placeholder="选择年"
                class="mr20"
                :clearable="false"
                @change="(e)=>dateEvent(e,index)"
              />
              <!-- 径流小区整编表2 选择雨量站-->
              <el-select
                v-if="index===1"
                v-model="stationIndex[specialSingleTableNum(index)]" placeholder="请选择雨量站"
                @change="(e)=>stationSelectEvent(e,index)">
                <el-option
                  v-for="(item,index) in stationInfo"
                  :key="index"
                  :label="item.stationName"
                  :value="index"/>
              </el-select>
              <!-- 小流域整编表2，6，7，8，9 选择小流域-->
              <el-select
                v-else-if="(index===16 || index===20 || index===21 || index===22 || index===23)"
                v-model="drainageIndex[specialSingleTableNum(index)]" placeholder="请选择小流域"
                @change="(e)=>drainageSelectEvent(e,index)">
                <el-option v-for="item in drainageInfo" :key="item" :label="item" :value="item"/>
              </el-select>
            </div>
            <h3 class="h3">{{getTitle(index)}}</h3>
            <div v-if="allTableParams[specialSingleTableNum(index)]">
              <reportTable
                :tableHeader="allHeader[specialSingleTableNum(index)]"
                :tableDataBody="tableData[specialSingleTableNum(index)]?tableData[specialSingleTableNum(index)].content:[]"
                :tablePageSize="allTableParams[specialSingleTableNum(index)].pageSize"
                :tableCount="tableData[specialSingleTableNum(index)].totalElements"
                :index="specialSingleTableNum(index)"
                :loading="allLoading[specialSingleTableNum(index)]"
                @page_change="(obj)=>pageChange(obj,index)"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import reportTable from "./reportTable";
  import {getControl, getDrainageBasin, getReport, getStation} from "@/api/report.js";
  import axios from 'axios'

  export default {
    name: "statistics",
    components: {reportTable},

    data() {
      const count = 34
      const commonDailyHeader = [
        [
          {label: '十二月', prop: 'month_12'},
          {label: '日', prop: 'day'},
          {label: '一月', prop: 'month_1'},
          {label: '二月', prop: 'month_2'},
          {label: '三月', prop: 'month_3'},
          {label: '四月', prop: 'month_4'},
          {label: '五月', prop: 'month_5'},
          {label: '六月', prop: 'month_6'},
          {label: '七月', prop: 'month_7'},
          {label: '八月', prop: 'month_8'},
          {label: '九月', prop: 'month_9'},
          {label: '十月', prop: 'month_10'},
          {label: '十一月', prop: 'month_11'},
        ],//整编表-1 日
        [
          {label: '最大日量', prop: 'maxPrecipitation'},
          {label: '月', prop: 'month'},
          {label: '降水量（mm）', prop: 'precipitation'},
          {label: '降水日数', prop: 'days'},
        ],//整编表-1 月
        [
          {label: '终雪日期', prop: ''},
          {label: '降水量', prop: 'precipitation', type: 'num1'},
          {label: '降水日数', prop: 'days'},
          {label: '最大日降水量', prop: 'maxPrecipitationDaily'},
          {label: '最大日降水量日期', prop: 'maxPrecipitationDay', width: 200, type: 'substr'},
          {label: '最大月降水量', prop: 'maxPrecipitationMonthly'},
          {label: '最大月降水量月份', prop: 'maxPrecipitationMonth'},
          {label: '最大次雨量', prop: 'maxOnceRainFall'},
          {label: '最大次雨量历时（min）', prop: 'duration'},
          {label: '最大I30', prop: 'maxI30'},
          {label: '最大I30日期', prop: 'maxI30Date', width: 200, type: 'substr'},
          {label: '最大降雨侵蚀力', prop: 'maxR'},
          {label: '最大侵蚀力日期', prop: 'maxRDate', width: 200, type: 'substr'},
          {label: '初雪日期', prop: ''},
        ],//整编表-1 年
      ]
      const commonProcessHeader = [
        {label: '降雨侵蚀力（MJ·mm/(hm²·h））', prop: 'onceR', type: 'num1'},
        {label: '降水次序', prop: 'onceId'},
        {label: '年-月-日 时：分：秒', prop: 'onceEndTime', type: 'dateTime'},
        {label: '累积雨量（mm）', prop: 'total_precipitation', type: 'num1'},
        {label: '累计历时（min）', prop: 'total_time', type: 'ms'},
        {
          label: '时段降雨', children: [
            {label: '雨强（mm/h）', prop: 'precipitation/duration', type: 'num1'},
            {label: '雨量（mm）', prop: 'precipitation', type: 'num1'},
            {label: '历时（min）', prop: 'duration',},
          ]
        },
        {label: 'I30（mm/h）', prop: 'onceI30', type: 'num1'},
      ]//降水过程摘录
      const allHeader = [
        ...commonDailyHeader, //径流小区整编表-1 逐日降水量
        commonProcessHeader,//径流小区整编表-2 降水过程摘录
        [
          {label: '测流设备', prop: 'measureEquipment'},
          {label: '小区号', prop: 'code'},
          {label: '试验目的', prop: 'aim'},
          {label: '坡度（度）', prop: 'slope', type: 'num1'},
          {label: '坡长（m）', prop: 'slopeLength', type: 'num1'},
          {label: '坡宽', prop: 'slopeWidth', type: 'num1'},
          {label: '面积(m²)', prop: 'area', type: 'num1'},
          {label: '坡向（度）', prop: 'slopeAspect'},
          {label: '坡位', prop: 'slopePosition'},
          {label: '土壤类型', prop: 'soilType'},
          {label: '土层厚度（cm）', prop: 'soilThickness'},
          {label: '水保措施', prop: 'conservationMeasures'},
          {label: '整地方法', prop: 'sitePreparationMethod'},
          {label: '作物', prop: 'crop'},
          {label: '播种方法', prop: 'seedingMethod'},
          {label: '施肥纯量（kg/hm²）', prop: 'pureFertilizerAmount'},
          {label: '垄距（cm）', prop: 'ridgeSpacing'},
          {label: '株*行距（cm）', prop: 'plantSpacing*rowSpacing'},
          {label: '密度（株）', prop: 'density'},
          {label: '播种日期', prop: 'sowingDate', type: 'date'},
          {label: '中耕日期', prop: 'cultivationDate', type: 'date'},
          {label: '收割日期', prop: 'harvestDate', type: 'date'},
          {
            label: '产量', children: [
              {label: '粮食', prop: 'grainYield'},
              {label: '秸秆', prop: 'strawYield'}
            ]
          },
        ],//径流小区整编表-3-1 径流小区基本情况（农地）
        [
          {label: '测流设备', prop: 'measureEquipment'},
          {label: '小区号', prop: 'code'},
          {label: '试验目的', prop: 'purpose'},
          {label: '坡度（度）', prop: 'slope'},
          {label: '坡长（m）', prop: 'slopeLength'},
          {label: '坡宽', prop: 'slopeWidth'},
          {label: '面积', prop: 'area'},
          {label: '坡向（度）', prop: 'slopeAspect'},
          {label: '坡位', prop: 'slopePosition'},
          {label: '土壤类型', prop: 'soilType'},
          {label: '土层厚度（cm）', prop: 'soilThickness'},
          {label: '水保措施', prop: 'conservationMeasures'},
          {label: '树种', prop: 'treeSpecie'},
          {label: '造林方法', prop: 'afforestationMethod'},
          {label: '株*行距（cm）', prop: 'plantSpacing*rowSpacing'},
          {label: '林龄（年）', prop: 'standAge'},
          {label: '平均树高（cm）', prop: 'averageTreeHeight'},
          {label: '平均胸径（cm）', prop: 'meanDbh'},
          {label: '平均树冠直径（cm）', prop: 'averageCrownDiameter'},
          {label: '郁闭度', prop: 'canopyDensity'},
          {label: '林下植被类型', prop: 'undergrowthVegetationType'},
          {label: '林下植被主要种类', prop: 'undergrowthVegetationMainType'},
          {label: '盖度（%）', prop: 'coverage', type: 'num2'},
          {label: '林下植被平均高度（cm）', prop: 'undergrowthVegetationAverageHeight'},
        ],//径流小区整编表-3-2 径流小区基本情况（林地）
        [
          {label: '测流设备', prop: 'measureEquipment'},
          {label: '小区号', prop: 'code'},
          {label: '试验目的', prop: 'purpose'},
          {label: '坡度（度）', prop: 'slope'},
          {label: '坡长（m）', prop: 'slopeLength'},
          {label: '坡宽', prop: 'slopeWidth'},
          {label: '面积', prop: 'area'},
          {label: '坡向（度）', prop: 'slopeAspect'},
          {label: '坡位', prop: 'slopePosition'},
          {label: '土壤类型', prop: 'soilType'},
          {label: '土层厚度（cm）', prop: 'soilThickness'},
          {label: '灌草种类', prop: 'shrubGrassSpecie'},
          {label: '播种日期', prop: 'sowingDate', type: 'date'},
          {label: '播种方法', prop: 'seedingMethod'},
          {label: '收割时间', prop: 'harvestDate', type: 'date'},
          {label: '生物量（kg/hm）', prop: 'biomass'},
          {label: '牧草产量（kg/hm²）', prop: 'forageYield'},
          {label: '盖度（%）', prop: 'coverage', type: 'num2'},
          {label: '平均高度', prop: 'averageHeight'},
        ],//径流小区整编表-3-3 径流小区基本情况（灌草地）
        [
          {label: "备注", prop: "remark"},
          {label: "小区号", prop: "qCode"},
          // {label: "试验目的", prop: "purpose"},
          {label: "日期", prop: "date", type: 'date'},
          {label: "田间操作", prop: "fieldOperation"},
          {label: "工具", prop: "tool"},
          {label: "土壤耕作深度（cm）", prop: "soilTillageDepth"},
        ],//径流小区整编表-4  径流小区田间管理
        [
          {label: '备注', prop: ''},
          {label: '小区号', prop: ''},
          {label: '降雨起（月-日-时-分）', prop: ''},
          {label: '降雨止（月-日-时-分）', prop: ''},
          {label: '历时（min）', prop: ''},
          {label: '雨量（mm）', prop: ''},
          {label: '平均雨强（mm/h）', prop: ''},
          {label: 'I30（mm/h）', prop: ''},
          {label: '降雨侵蚀力（MJ·mm/(hm²·h)）', prop: ''},
          {label: '径流深（mm）', prop: ''},
          {label: '径流系数', prop: ''},
          {label: '含沙量（g/l）', prop: ''},
          {label: '土壤流失量（t/hm²）', prop: ''},
          {label: '雨前土壤含水量（%）', prop: ''},
          {label: '雨后土壤含水量（%）', prop: ''},
          {label: '植被覆盖（%）', prop: ''},
          {label: '平均高度（m）', prop: ''},
        ],//径流小区整编表-5  径流小区逐次径流泥沙
        [
          {label: '备注', prop: 'remark'},
          {label: '小区号', prop: 'jingliuInfoByQId.code'},
          {label: '坡度（度）', prop: 'jingliuInfoByQId.slope'},
          {label: '坡长（m）', prop: 'jingliuInfoByQId.slopeLength'},
          {label: '坡宽（m）', prop: 'jingliuInfoByQId.slopeWidth'},
          {label: '土地利用', prop: ''},
          {label: '水土保持措施', prop: 'jingliuInfoByQId.conservationMeasures'},
          {label: '降水量（mm）', prop: 'rainfall'},
          {label: '降雨侵蚀力（MJ·mm/(hm²·h)）', prop: 'rainfallErosivity'},
          {label: '径流深（mm）', prop: 'runoffDepth'},
          {label: '径流系数', prop: 'runoffCoefficient'},
          {label: '土壤流失量（t/hm²）', prop: 'soilLoss'},
        ],//径流小区整编表-6  径流小区逐年径流泥沙
        [
          {label: '备注', prop: 'remarks'},
          {label: '小区号', prop: 'q_code'},
          {label: '测次', prop: 'times'},
          {label: '年-月-日', prop: 'time',type:'date' },
          {label: '土壤深度（cm）', prop: 'depth'},
          {label: '土壤含水量（%）', prop: 'avgTest'},
          {label: '两侧次间降水（mm）', prop: 'precipitation'},
          {label: '植被覆盖（%）', prop: 'vegetation_coverage'},
          {label: '植被平均高度（%）', prop: 'average_vegetation_height'},
        ],//径流小区整编表-7  径流小区土壤含水量和植被盖度
        [
          {label: '备注', prop: 'notes'},
          {label: '年', prop: 'recordTime', type: 'year'},
          {label: '月', prop: 'recordTime', type: 'month'},
          {label: '日', prop: 'recordTime', type: 'day'},
          {label: '田间操作', prop: 'operate'},
          {label: '工具', prop: 'tool'},
          {label: '土壤扰动深度（cm）', prop: 'disturbanceDepth'},
          {label: '记录人', prop: 'recordPerson'},
          {label: '审核人', prop: 'userByCheckPersonId.username'},
        ],//风蚀场田间管理记录表
        [
          {label: '审核人', prop: 'userByCheckPersonId.username'},
          {label: '年', prop: 'recordTime', type: 'year'},
          {label: '月', prop: 'recordTime', type: 'month'},
          {label: '日', prop: 'recordTime', type: 'day'},
          {label: '检查与维护', prop: 'checkAndMaintain'},
          {label: '记录人', prop: 'recordPerson'},
        ],//风蚀场日常维护记录表
        [
          {label: '备注', prop: 'notes'},
          {label: '年', prop: 'recordTime', type: 'year'},
          {label: '月', prop: 'recordTime', type: 'month'},
          {label: '日', prop: 'recordTime', type: 'day'},
          {label: '方向', prop: 'direction'},
          {label: '集沙盒高度（cm）', prop: 'boxHeight'},
          {label: '集沙盒编号', prop: 'boxId'},
          {label: '盒+干土重（g）', prop: 'boxSoilWeight'},
          {label: '盒重（g）', prop: 'boxWeight'},
          {label: '干土重（g）', prop: 'soilWeight'},
          {label: '观测人', prop: 'recordPerson'},
          {label: '审核人', prop: 'userByCheckPersonId.username'},
        ],//风蚀场风沙观测记录表
        [
          {label: '备注', prop: 'notes'},
          {label: '年', prop: 'recordTime', type: 'year'},
          {label: '月', prop: 'recordTime', type: 'month'},
          {label: '日', prop: 'recordTime', type: 'day'},
          {label: '相片编号1', prop: 'imageCodeFirst'},
          {label: '相片编号2', prop: 'imageCodeSecond'},
          {label: '相片编号3', prop: 'imageCodeThird'},
          {label: '相片编号4', prop: 'imageCodeForth'},
          {label: '相片编号5', prop: 'imageCodeFifth'},
          {label: '相片编号6', prop: 'imageCodeSixth'},
        ],//风蚀场地面粗糙度观测记录表
        [],//风蚀场风速自动观测记录
        [],//风蚀场土壤水分温度观测记录
        ...commonDailyHeader,//小流域整编表-1逐日降水量
        commonProcessHeader,//小流域整编表-2降水过程摘录
        [
          {label: '十二月', prop: 'month_12'},
          {label: '日', prop: 'day'},
          {label: '一月', prop: 'month_1'},
          {label: '二月', prop: 'month_2'},
          {label: '三月', prop: 'month_3'},
          {label: '四月', prop: 'month_4'},
          {label: '五月', prop: 'month_5'},
          {label: '六月', prop: 'month_6'},
          {label: '七月', prop: 'month_7'},
          {label: '八月', prop: 'month_8'},
          {label: '九月', prop: 'month_9'},
          {label: '十月', prop: 'month_10'},
          {label: '十一月', prop: 'month_11'},
        ],//整编表-3 日
        [
          {label: '最小日期', prop: 'minDay', type: 'date'},
          {label: '平均', prop: 'averageFlow'},
          {label: '最大', prop: 'maxAverageFlow'},
          {label: '最大日期', prop: 'maxDay', type: 'date'},
          {label: '最小', prop: 'minAverageFlow'},
        ],//整编表-3  月
        [
          {label: '径流深', prop: 'runoff'},
          {label: '最大流量', prop: 'maxAverageFlow'},
          {label: '最大流量日期', prop: 'maxDay', type: 'date'},
          {label: '最小流量', prop: 'minAverageFlow'},
          {label: '最小流量日期', prop: 'minDay', type: 'date'},
          {label: '平均', prop: 'averageFlow'},
          {label: '径流量', prop: 'flow'},
          {label: '径流模数', prop: 'jingliuMoshu'},
        ],//整编表-3  年
        //小流域整编表-3流域控制站逐日平均流量

        [
          {label: '十二月', prop: 'month_12'},
          {label: '日', prop: 'day'},
          {label: '一月', prop: 'month_1'},
          {label: '二月', prop: 'month_2'},
          {label: '三月', prop: 'month_3'},
          {label: '四月', prop: 'month_4'},
          {label: '五月', prop: 'month_5'},
          {label: '六月', prop: 'month_6'},
          {label: '七月', prop: 'month_7'},
          {label: '八月', prop: 'month_8'},
          {label: '九月', prop: 'month_9'},
          {label: '十月', prop: 'month_10'},
          {label: '十一月', prop: 'month_11'},
        ],//整编表-4 日
        [
          {label: '最小日期', prop: 'minDay', type: 'date'},
          {label: '平均', prop: 'averageSand'},
          {label: '最大', prop: 'maxaverageSand'},
          {label: '最大日期', prop: 'maxDay', type: 'date'},
          {label: '最小', prop: 'minaverageSand'},
        ],//整编表-4  月
        [
          {label: '平均含沙量', prop: 'averageSand'},
          {label: '最大含沙量', prop: 'maxAverageSand'},
          {label: '最大含沙量日期', prop: 'maxDay', type: 'date'},
          {label: '最小含沙量', prop: 'minAverageSand'},
          {label: '最小含沙量日期', prop: 'minDay', type: 'date'},
        ],//整编表-4  年
        //小流域整编表-4流域控制站逐日平均含沙量（悬移质）

        [
          {label: '十二月', prop: 'month_12'},
          {label: '日', prop: 'day'},
          {label: '一月', prop: 'month_1'},
          {label: '二月', prop: 'month_2'},
          {label: '三月', prop: 'month_3'},
          {label: '四月', prop: 'month_4'},
          {label: '五月', prop: 'month_5'},
          {label: '六月', prop: 'month_6'},
          {label: '七月', prop: 'month_7'},
          {label: '八月', prop: 'month_8'},
          {label: '九月', prop: 'month_9'},
          {label: '十月', prop: 'month_10'},
          {label: '十一月', prop: 'month_11'},
        ],//整编表-5 日
        [
          {label: '最小日期', prop: 'minDay', type: 'date'},
          {label: '平均', prop: 'averageModulus'},
          {label: '最大', prop: 'maxModulus'},
          {label: '最大日期', prop: 'maxDay', type: 'date'},
          {label: '最小', prop: 'minModulus'},
        ],//整编表-5  月
        [
          {label: '平均', prop: 'averageModulus'},
          {label: '最大产沙模数', prop: 'maxModulus'},
          {label: '最大产沙模数日期', prop: 'maxDay', type: 'date'},
          {label: '最小产沙模数', prop: 'minModulus'},
          {label: '最小产沙模数日期', prop: 'minDay', type: 'date'},
        ],//整编表-5  年
        //小流域整编表-5流域逐日产沙模数（悬移质）
        [
          {label: '累积产沙(t/ha)', prop: ''},
          {label: '降水次序', prop: ''},
          {label: '径流次序', prop: ''},
          {label: '月', prop: ''},
          {label: '日', prop: ''},
          {label: '时', prop: ''},
          {label: '分', prop: ''},
          {label: '水位(cm)', prop: ''},
          {label: '流量(m³/s)', prop: ''},
          {label: '含沙量(g/l)', prop: ''},
          {label: '时段(min)', prop: ''},
          {label: '累积径流深(mm)', prop: ''},
        ],//小流域整编表-6流域径流泥沙过程（悬移质）
        [
          {label: '备注', prop: 'remark'},
          {label: '径流次序', prop: 'id'},
          {label: '降雨起', prop: 'start', type: 'monthDay'},
          {label: '降雨止', prop: 'end', type: 'monthDay'},
          {label: '历时（min）', prop: 'duration'},
          {label: '雨量(mm)', prop: 'rainfall'},
          {label: '平均雨强(mm/h)', prop: 'averageRaininess'},
          {label: 'I30 (mm/h)', prop: 'i30'},
          {label: '降雨侵蚀力(MJ·mm /(ha·h))', prop: 'rainfallErosivity'},
          {label: '产流起', prop: 'runoffProducingStart', type: 'monthDay'},
          {label: '产流止', prop: 'runoffProducingEnd', type: 'monthDay'},
          {label: '产流历时(min)', prop: 'runoffDuration'},
          {label: '洪峰流量(m³/s)', prop: 'flow'},
          {label: '径流深(mm)', prop: 'runoff'},
          {label: '径流系数', prop: 'fator'},
          {label: '含沙量(g/l)', prop: 'sand'},
          {label: '产沙模数(t/hm²)', prop: 'modulus'},
        ],//小流域整编表-7流域逐次洪水径流泥沙（悬移质）
        [
          {label: '备注', prop: 'remark'},
          {label: '年', prop: 'year'},
          {label: '流域名称', prop: 'drainageBasinName'},
          {label: '流域面积(km²)', prop: 'drainageArea'},
          {label: '降雨量(mm)', prop: 'precipitation'},
          {label: '降雨侵蚀力(MJ·mm /(ha·h))', prop: 'r'},
          {label: '径流深(mm)', prop: 'runoff'},
          {label: '径流系数', prop: 'factor'},
          {label: '产沙模数(t/hm²)', prop: 'modulus'},
        ],//小流域整编表-8流域土壤含水量
        [
          {label: '两测次间降水(mm)', prop: 'precipitation'},
          {label: '测点', prop: 'testPointId'},
          {label: '测次', prop: 'times'},
          {label: '月', prop: 'time',type:'month'},
          {label: '日', prop: 'time',type:'day'},
          {label: '土壤深度(cm)', prop: 'depth'},
          {label: '重量含水量(%)', prop: 'meanWaterContent'},
          {label: '体积含水量(%)', prop: 'avgTest'},
        ],//小流域整编表-9流域年径流泥沙（悬移质）
      ]
      return {
        count: count,
        reportIndex: 0,
        station: '九三水土保持试验站',
        stationInfo: [],
        stationIndex: Array(count).fill(0), //保存的是索引
        stationName: Array(count).fill(''),
        drainageInfo: [],
        drainageIndex: Array(count).fill(0), //保存的是值
        controlInfo: [],
        controlIndex: Array(count).fill(0), //保存的是值
        controlName: Array(count).fill(''),
        allReportOptions: [
          {index: 0, label: '径流小区整编表-1 逐日降水量'},
          {index: 1, label: '径流小区整编表-2 降水过程摘录'},
          {index: 2, label: '径流小区整编表-3-1 径流小区基本情况（农地）'},
          {index: 3, label: '径流小区整编表-3-2 径流小区基本情况（林地）'},
          {index: 4, label: '径流小区整编表-3-3 径流小区基本情况（灌草地）'},
          {index: 5, label: '径流小区整编表-4  径流小区田间管理'},
          {index: 6, label: '径流小区整编表-5  径流小区逐次径流泥沙'},
          {index: 7, label: '径流小区整编表-6  径流小区逐年径流泥沙'},
          {index: 8, label: '径流小区整编表-7  径流小区土壤含水量和植被盖度'},
          {index: 9, label: '风蚀场田间管理记录表'},
          {index: 10, label: '风蚀场日常维护记录表'},
          {index: 11, label: '风蚀场风沙观测记录表'},
          {index: 12, label: '风蚀场地面粗糙度观测记录表'},
          {index: 13, label: '风蚀场风速自动观测记录'},
          {index: 14, label: '风蚀场土壤水分温度观测记录'},
          {index: 15, label: '小流域整编表-1 逐日降水量'},
          {index: 16, label: '小流域整编表-2 降水过程摘录'},
          {index: 17, label: '小流域整编表-3 小流域控制站逐日平均流量'},
          {index: 18, label: '小流域整编表-4 小流域控制站逐日平均含沙量（悬移质）'},
          {index: 19, label: '小流域整编表-5 小流域逐日产沙模数（悬移质）'},
          {index: 20, label: '小流域整编表-6 小流域径流泥沙过程（悬移质）'},
          {index: 21, label: '小流域整编表-7 小流域逐次洪水径流泥沙（悬移质）'},
          {index: 22, label: '小流域整编表-8 小流域年径流泥沙（悬移质）'},
          {index: 23, label: '小流域整编表-9 小流域土壤含水量'}
        ],
        allHeader,
        tableData: Array(count).fill({content: [], totalElements: 0}),
        allTableParams: Array(count).fill({pageNum: 1, pageSize: 10}),
        allDownloadParams: Array(count).fill({}),
        allRequest:
          [
            'rain_daily',
            'rain_month',
            'rain_year',//小区整编表-1逐日降水量
            'rain_process',//小区整编表-2降水过程摘录
            'nongdi_info',//小区整编表-3-1径流小区基本情况（农地）
            'lindi_info',//小区整编表-3-2径流小区基本情况（林地）
            'guanzaodi_info',//小区整编表-3-3径流小区基本情况（灌草地）
            'tianjian_jilu',//小区整编表-4径流小区田间管理
            'jinliu_nisha',//小区整编表-5径流小区逐次径流泥沙
            'nisha_nian',//小区整编表-6径流小区逐年径流泥沙
            'water_plant_content',//小区整编表-7径流小区土壤含水量和植被盖度
            'fengshi_tianjian_jilu',
            'fengshi_richang_jilu',
            'fengshi_fengsha_jilu',
            'fengshi_dimian_jilu',
            'fengshi_fengsu_jilu',
            'fengshi_shuifeng_jilu',
            'runoff_rain_daily',
            'runoff_rain_month',
            'runoff_rain_year', //17，18，19 小流域整编表-1逐日降水量
            'runoff_rain_process',//20 小流域整编表-2降水过程摘录
            'xiaoliuyu_zhuriliuliang',
            'xiaoliuyu_liuliangyuetongji',
            'xiaoliuyu_liuliangniantongji',//21，22，23 小流域整编表-3流域控制站逐日平均流量
            'xiaoliuyu_zhurihansha',
            'xiaoliuyu_hanshayuetongji',
            'xiaoliuyu_hanshaniantongji',//24，25，26 小流域整编表-4流域控制站逐日平均含沙量（悬移质）
            'xiaoliuyu_zhurichansha',
            'xiaoliuyu_chanshayuetongji',
            'xiaoliuyu_chanshaniantongji', //27，28，29 小流域整编表-5流域逐日产沙模数（悬移质）
            'xiaoliuyu_jingliunisha',//30 小区整编表-6径流小区逐年径流泥沙
            'RunoffSedimentOfFlood',//31 小区整编表-7
            'xiaoliuyu_nianjingliunisha',//32 小区整编表-8
            'xiaoliuyu_turanghanshui',//33 小区整编表-9
          ],
        downloadUrl: ['table1', 'table2', 'table3_1', 'table3_2', 'table3_3', 'table4', 'table5', 'table6', 'table7',
          'fsctable1', 'fsctable2', 'fsctable3', 'fsctable4', 'fsctable5', 'fsctable6',
          'xlytable1', 'xlytable2', 'xlytable3', 'xlytable4', 'xlytable5', 'xlytable6', 'xlytable7', 'xlytable8', 'xlytable9',
        ],
        currentUrl: '',
        allSelectedYear: Array(count).fill(new Date()),
        allLoading: Array(count).fill(false),
      }
    },
    mounted() {
      axios.all([getStation(), getDrainageBasin(), getControl()]).then(data => {
        if (data.length == 3) {
          const station = data[0]
          const drainageBasin = data[1]
          const control = data[2]
          this.stationInfo = station
          this.drainageInfo = drainageBasin
          this.controlInfo = control
          if (station.length > 0) {
            this.stationName = Array(this.count).fill(station[0].stationName)
          }
          if (drainageBasin.length > 0) {
            this.drainageIndex = Array(this.count).fill(drainageBasin[0])
          }
          if (control.length > 0) {
            this.controlName = Array(this.count).fill(control[0].name)
          }
          this.getRequestParams()
        }
      })
    },
    methods: {
      getRequestParams() {
        for (let i = 0; i < this.count; i++) {
          const year = this.allSelectedYear[i].getFullYear()
          const {stationCode = '', stationName = ''} = (this.stationInfo.length > 0) ? this.stationInfo[this.stationIndex[i]] : {
            stationCode: '',
            stationName: ''
          }
          const drainageBasinId = this.drainageIndex[i]
          const {code = '', name = ''} = (this.controlInfo.length > 0) ? this.controlInfo[this.controlIndex[i]] : {
            code: '',
            name: ''
          }
          const codeName = name

          if (i >= 0 && i <= 2) { //径流小区整编表1
            this.allTableParams[i] = {
              stationId: stationCode,
              Name: stationName,
              year,
            };
            this.allDownloadParams[i] = {
              stationId: stationCode,
              Name: stationName,
              year,
            };
          } else if (i === 3) {//径流小区整编表2
            this.allTableParams[i] = {
              stationId: stationCode,
              Name: stationName,
              pageNum: 1,
              pageSize: 10,
              startTime: year + '-01-01',
              endTime: year + '-12-31',
              year
            }
            this.allDownloadParams[i] = {
              stationId: stationCode,
              Name: stationName,
              year
            }

          } else if (i >= 4 && i <= 10) {//径流小区3-1,3-2,3-3,4,5,6,7
            this.allTableParams[i] = {
              pageNum: 1,
              pageSize: 10,
            }
          } else if (i >= 11 && i <= 16) {//风蚀场整编表1，2，3，4，5，6
            this.allTableParams[i] = {
              pageNum: 1,
              pageSize: 10,
              startTime: year + '-01-01',
              endTime: year + '-12-31'
            }
            this.allDownloadParams[i] = {year}
          } else if (i >= 17 && i <= 19) {//小流域整编表1
            this.allTableParams[i] = {
              drainageBasinId,
              year,
            }
            this.allDownloadParams[i] = {
              drainageBasinId,
              year,
            }
          } else if (i === 20) {//小流域整编表2
            this.allTableParams[i] = {
              drainageBasinId,
              pageNum: 1,
              pageSize: 10,
              startTime: year + '-01-01',
              endTime: year + '-12-31',
              year
            }
            this.allDownloadParams[i] = {
              drainageBasinId,
              year
            }
          } else if (i >= 21 && i <= 26) {//小流域整编表3，4
            const obj = {
              code,
              codeName,
              year,
            }
            this.allTableParams[i] = obj
            this.allDownloadParams[i] = obj
          } else if (i >= 27 && i <= 29) {//小流域整编表5
            const obj = {
              drainageBasinId,
              year,
            }
            this.allTableParams[i] = obj
            this.allDownloadParams[i] = obj
          } else if (i >= 30 && i <= 32) {//小流域整编表6, 7, 8
            this.allTableParams[i] = {
              drainageBasinId,
              pageNum: 1,
              pageSize: 10,
            }
            this.allDownloadParams[i] = {drainageBasinId}
          } else if (i == 33) {//小流域整编表 9
            this.allTableParams[i] = {
              drainageBasinId,
              year,
              pageNum: 1,
              pageSize: 10,
            }
            this.allDownloadParams[i] = {year, drainageBasinId}
          }
        }
        //获取第一页初始数据
        for (let i = 0; i < 3; i++) {
          this.fetchData(i, this.allRequest[i], this.allTableParams[i])
        }
      },

      fetchData(index, api, params) {
        this.currentUrl = this.getCurrentUrl()
        let loadingArray = this.allLoading
        loadingArray[index] = true
        this.allLoading = loadingArray
        getReport(api, params).then(data => {
          if (!data) {
            data = {content: [], totalElements: 0}
          }
          if (!data.hasOwnProperty('content')) {
            const temp = data
            data = {content: temp, totalElements: 0}
          }
          let tableData = this.tableData
          let loadingArray = this.allLoading
          tableData[index] = data
          loadingArray[index] = true
          this.tableData = tableData.slice()
          this.allLoading = loadingArray
        })
      },
      //tab修改
      reportSelectEvent(reportIndex) {
        this.reportIndex = reportIndex;
        this.commonRequest(reportIndex, 'tab')
      },
      //日期年修改
      dateEvent(date, reportIndex) {
        const year = new Date(date).getFullYear()
        this.commonRequest(reportIndex, 'date', {year}, date)
      },
      //雨量站修改
      stationSelectEvent(stationIndex, reportIndex) {
        const {stationCode: stationId, stationName: Name} = this.stationInfo[stationIndex]
        this.commonRequest(reportIndex, 'station', {stationId, Name}, stationIndex)
      },
      //小流域修改
      drainageSelectEvent(drainageBasinId, reportIndex) {
        this.commonRequest(reportIndex, 'drainage', {drainageBasinId})
      },
      //小流域控制站修改
      controlSelectEvent(controlIndex, reportIndex) {
        const {code, name: codeName} = this.controlInfo[controlIndex]
        this.commonRequest(reportIndex, 'control', {code, codeName}, {controlIndex, codeName})
      },
      //分页参数修改
      pageChange(obj, reportIndex) {
        const pageNum = obj.e
        this.commonRequest(reportIndex, 'page', {pageNum})
      },
      /**
       * 日期修改，tab选择，分页，station都会调这个
       * @param index (34)
       * @param type(6): date,station,page,tab,drainage,control 而page是唯一的只查一个表
       * @param paramObj:{}
       */
      commonRequest(index, type, paramObj, otherData) {
        if (this.showMoreTable(index) && type != 'page') {
          for (let i = 1; i <= 3; i++) {
            const _index = this.specialMoreTableNum(index, i)
            this.commonType(_index, type, paramObj, otherData)
            const params = Object.assign({}, this.allTableParams[_index], paramObj)
            const downloadParams = Object.assign({}, this.allDownloadParams[_index], paramObj)
            this.allTableParams[_index] = params
            this.allDownloadParams[_index] = downloadParams
            this.fetchData(_index, this.allRequest[_index], params)
          }
        } else {
          let otherParams = {}
          const _index = this.specialSingleTableNum(index)
          this.commonType(_index, type, paramObj, otherData)
          if (type == 'date') {
            const {year} = paramObj
            otherParams = {
              startTime: year + '-01-01',
              endTime: year + '-12-31',
              year: year
            }
          } else {
            otherParams = paramObj
          }

          if (type != 'page') {
            const downloadParams = Object.assign({}, this.allDownloadParams[_index], paramObj)
            this.allDownloadParams[_index] = downloadParams
          }
          const params = Object.assign({}, this.allTableParams[_index], otherParams)
          this.allTableParams[_index] = params
          this.fetchData(_index, this.allRequest[_index], params)
        }
      },

      commonType(index, type, paramObj, otherData) {
        if (type == 'date') {
          this.allSelectedYear[index] = otherData
        } else if (type == 'station') {
          this.stationIndex[index] = otherData
          this.stationName[index] = paramObj.Name
        } else if (type == 'drainage') {
          this.drainageIndex[index] = paramObj.drainageBasinId
        } else if (type == 'control') {
          this.controlIndex[index] = otherData.controlIndex
          this.controlName[index] = otherData.codeName
        }
      },

      isShowYear(index) {
        if (index === 1 || index === 16 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13 || index === 14 || index == 23) {
          return true
        } else {
          return false
        }
      },
      showMoreTable() {
        const index = this.reportIndex
        if (index === 0 || index === 15 || index === 17 || index === 18 || index === 19) {
          return true
        } else {
          return false
        }
      },
      specialMoreTableNum(reportIndex, numIndex) {
        let result = 0
        switch (reportIndex) {
          case 0 :
            result = reportIndex + numIndex - 1;
            break;
          case 15 :
            result = reportIndex + numIndex + 1;
            break;
          case 17 :
            result = reportIndex + numIndex + 3;
            break;
          case 18 :
            result = reportIndex + numIndex + 5;
            break;
          case 19 :
            result = reportIndex + numIndex + 7;
            break;
        }
        return result
      },
      specialSingleTableNum(reportIndex) {
        if (reportIndex <= 14) return reportIndex + 2;
        else if (reportIndex == 16) return reportIndex + 4;
        else if (reportIndex >= 20) return reportIndex + 10;
      },
      getTitle(reportIndex) {
        let result = ''
        const requestIndex = this.getRequestIndex(reportIndex)
        const stationName = this.stationName[requestIndex]
        const drainageIndex = this.drainageIndex[requestIndex]
        const controlName = this.controlName[requestIndex]

        const station = this.station
        const year_station = this.allSelectedYear[requestIndex].getFullYear() + '年' + station

        switch (reportIndex) {
          case 0 :
            result = '小区整编表-1 ' + year_station + stationName + '逐日降水量'
            break;
          case 1 :
            result = '小区整编表-2 ' + year_station + stationName + '降水过程摘录'
            break;
          case 15 :
            result = '小流域整编表-1 ' + year_station + drainageIndex + '号逐日降水量'
            break;
          case 16 :
            result = '小流域整编表-2 ' + year_station + '降水过程摘录'
            break;
          case 17 :
            result = '小流域整编表-3 ' + year_station + controlName + '逐日平均流量'
            break;
          case 18 :
            result = '小流域整编表-4 ' + year_station + controlName + '逐日平均含沙量（悬移质）'
            break;
          case 19 :
            result = '小流域整编表-5 ' + year_station + drainageIndex + '号逐日产沙模数（悬移质）'
            break;
          case 20 :
            result = '小流域整编表-6 ' + drainageIndex + '号径流泥沙过程（悬移质）'
            break;
          case 21 :
            result = '小流域整编表-7 ' + drainageIndex + '号逐次洪水径流泥沙（悬移质）'
            break;
          case 22 :
            result = '小流域整编表-8 ' + drainageIndex + '号年径流泥沙（悬移质）'
            break;
          case 23 :
            result = '小流域整编表-9 ' + drainageIndex + '号土壤含水量'
            break;
          default:
            result = this.allReportOptions[reportIndex].label
        }
        return result
      },
      getRequestIndex(reportIndex) {
        return [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 24, 27, 30, 31, 32, 33][reportIndex]
      },
      getCurrentUrl() {
        const baseUrl = process.env.VUE_APP_DOWNLOAD_API + 'exportCompilation/';
        const reportIndex = this.reportIndex
        const otherUrl = this.downloadUrl[reportIndex]
        let params = []
        const allDownloadParams = this.allDownloadParams
        for (let i = 0; i < allDownloadParams.length; i++) {
          const tableParamsObj = this.allDownloadParams[i]
          let temp = []
          for (let j in tableParamsObj) {
            if (tableParamsObj.hasOwnProperty(j)) {
              temp.push(j + "=" + tableParamsObj[j]);
            }
          }
          params[i] = temp.join("&");

        }
        const num = this.getRequestIndex(reportIndex)
        return baseUrl + otherUrl + '?' + params[num]
      },
    }
  }
</script>

<style scoped>

</style>
<style scoped>
  .container {
    padding: 20px;
  }

  .select {
    width: 100%;
  }

  .flex {
    display: flex;
    justify-content: flex-start;
  }

  .h3 {
    text-align: center;
  }

  .grey {
    background: red;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mr20 {
    margin-right: 20px;
  }

</style>
