const initOption = {
  tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
  yAxis: [{type: 'value'}],
  dataZoom: [{type: 'slider'}, {type: 'inside'}],
  toolbox: {
    feature: {
      dataView: {show: true, readOnly: false},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
}
const option1 = {
  ...initOption,
  title: {text: '日降雨量统计'},
  grid: {bottom: 80},
  xAxis: {type: 'category', axisTick: {show: false}, data: []},
  series: [
    {name: '降雨量', type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  ]
}
const option2 = {
  ...initOption,
  title: {text: '降雨过程', subtext: '',},
  grid: {top: '17%', bottom: 120},
  xAxis: {type: 'category', axisTick: {show: false}, axisLabel: {rotate: 70}, data: []},
  yAxis: [{type: 'value', name: '降雨量（mm）'}],
  series: [{type: 'line'}]
}
const option3 = {
  ...initOption,
  title: {text: '月降雨'},
  legend: {data: ['雨量（mm）', '降雨日数', '最大日雨量（mm）']},
  grid: {bottom: 130},
  xAxis: {type: 'category', axisLabel: {rotate: 70}, data: []},
  series: [
    {name: '雨量（mm）', type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true},
    {name: '降雨日数', type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true},
    {name: '最大日雨量（mm）', type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true},
  ]
}
const option_4_data = ['次降雨量（mm）',
  '平均雨强（mm/h）', 'I30（mm/h）', 'E（MJ/hm²）', 'EI30（MJ·mm/（ha·h））']

const option4 = {
  ...initOption,
  title: {text: '次降雨'},
  tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}, formatter: null},
  legend: {data: option_4_data},
  grid: {bottom: 80},
  xAxis: {type: 'category', axisLabel: {rotate: 70}, data: []},
  series: option_4_data.map((item, index) => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}}
  })
}
const option_5_data = [
  {zn: '年降水量（mm）', en: 'yearPrecipitation', index: 0},
  {zn: '降水日数', en: 'days', index: 1},
  {zn: '最大月雨量（mm）', en: 'maxMonthRainfall', index: 2},
  {zn: '最大降雨月份', en: 'maxMonth', index: 3},
  {zn: '最大日雨量（mm）', en: 'maxDayRainfall', index: 4},
  {zn: '年内第几天', en: 'maxDayOfYear', index: 5},
  {zn: '年降雨量（mm）', en: 'yearRainfall', index: 6},
  {zn: '降雨日数', en: 'rainDays', index: 7},
  {zn: '年降雨侵蚀力（MJ·mm/（hm²·h））', en: 'yearErosivity', index: 8},
  {zn: '降雨次数', en: 'rainTimes', index: 9},
  {zn: '侵蚀性降雨次数', en: 'erosiveRainTimes', index: 10},
  {zn: '最大次降雨（mm）', en: 'maxOnceRainfall', index: 11},
  {zn: '最大次降雨历时（min）', en: 'maxOnceDuration', index: 12},
  {zn: '最大次降雨I30（mm/h）', en: 'maxOnceI30', index: 13},
  {zn: '最大次降雨EI30（MJ·mm/（hm²·h））', en: 'maxOnceRainfallEi30', index: 14},
  {zn: '最大次降雨-第几次', en: 'OrderOfMaxOnceRainfall', index: 15},
  {zn: '最大次EI30', en: 'maxOnceEi30Rainfall', index: 16},
  {zn: '最大次EI30-次雨量', en: 'maxOnceEi30', index: 17},
  {zn: '最大次EI30-历时', en: 'maxOnceEi30Duration', index: 18},
  {zn: '最大次EI30-I30', en: 'maxOnceEi30I30', index: 19},
  {zn: '最大次EI30-第几次', en: 'maxOnceEi30Order', index: 20},
]

const option5 = {
  ...initOption,
  title: {text: '年降雨'},
  grid: {right: 300, bottom: 80},
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 45,
    top: 20,
    bottom: 40,
    data: option_5_data.map(item => item.zn),
    selected: function () {
      let obj = {}
      option_5_data.forEach((item, index) => {
        obj[item.zn] = [0, 4, 8, 11].includes(index)
      })
      return obj
    }()
  },
  xAxis: {type: 'category', data: []},
  series: option_5_data.map((item, index) => {
    return {name: item.zn, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })
}
const option6 = {
  ...initOption,
  title: {text: '日累计降雨量统计'},
  grid: {bottom: 80},
  xAxis: {type: 'category', axisTick: {show: false}, data: []},
  series: [
    {name: '累计降雨量', type: 'line', emphasis: {focus: 'series'},large: true},
  ]
}
export {option1, option2, option3, option4, option5, option_5_data,option6}
