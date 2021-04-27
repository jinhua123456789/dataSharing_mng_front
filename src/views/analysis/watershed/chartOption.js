const initOption = {
  tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
  yAxis: [{type: 'value'}],
  dataZoom: [{type: 'slider'}, {type: 'inside'}],
  grid: {bottom: 80},
  xAxis: {type: 'category', axisTick: {show: false}, data: []},
}
const option_1_data = ['流量（m³/s）', '含沙量（g/L）', '累积径流深（mm）', '累积产沙模数（t/hm²）']
const option_2_data = ['径流历时（min）', '径流深（mm）', '径流系数', '洪峰流量（m³/s）', '含沙量（g/l）', '产沙模数（t/hm²）']
const option_3_data = ['日平均流量（m³/s）', '日平均含沙量（g/L）', '日产沙模数（t/hm²）', '日径流深（mm）']
const option1 = {
  ...initOption,
  title: {text: '小流域径流泥沙过程'},
  legend: {data: option_1_data},
  series: option_1_data.map(item => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })

}
const option2 = {
  ...initOption,
  title: {text: '小流域次流泥沙'},
  legend: {data: option_2_data},
  series: option_2_data.map(item => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })
}
const option3 = {
  ...initOption,
  title: {text: '小流域日径流泥沙'},
  legend: {data: option_3_data},
  series: option_3_data.map(item => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })
}
const option_4_data = [
  {zn: '年降水量（mm）', en: 'yearRainfall', index: 0},
  {zn: '10-9月降水量（mm）', en: 'rainfall109', index: 1},
  {zn: '年径流深（mm）', en: 'runoffDepthYear', index: 2},
  {zn: '年产沙模数（t/hm²)', en: 'modulusYear', index: 3},
  {zn: '年径流系数', en: 'runoffFatorYear', index: 4},
  {zn: '10-4月降雪量（mm）', en: 'snow104', index: 5},
  {zn: '融雪日数', en: 'snowDay', index: 6},
  {zn: '融雪径流深（mm）', en: 'runoffDepthSnow', index: 7},
  {zn: '融雪产沙模数（t/hm²）', en: 'modulusSnow', index: 8},
  {zn: '5-9月降雨量（mm）', en: 'rainfall59', index: 9},
  {zn: '径流次数', en: 'runoffCount', index: 10},
  {zn: '降雨径流深（mm）', en: 'runoffDepthRain', index: 11},
  {zn: '降雨产沙模数（t/hm²）', en: 'modulusRain', index: 12},
]

const option4 = {
  ...initOption,
  title: {text: '小流域年径流泥沙'},
  grid: {right: 300, bottom: 80},
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 100,
    top: 20,
    bottom: 40,
    data: option_4_data.map(item => item.zn),
  },
  series: option_4_data.map(item => {
    return {name: item.zn,  type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })
}
export {option1, option2, option3,option4,option_4_data}
