const initOption = {
  tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
  yAxis: [{type: 'value'}],
  dataZoom: [{type: 'slider'}, {type: 'inside'}],
  grid: {bottom: 80},
  xAxis: {type: 'category', axisTick: {show: false}, data: []},
}
const option_1_data = ['降水量（mm）', '降雨侵蚀力（MJ·mm/（ha·h））', '径流深（mm）', '径流系数', '土壤流失模数（t/hm²）',
  '径流次数']
const option_2_data = ['雨量', '降雨侵蚀力（MJ·mm/（ha·h））', '径流深（mm）', '径流系数', '含沙量', '土壤流失模数（t/hm²）']
const option_3_data = ['地上生物量（kg/hm²）', '粮食产量（kg/hm²）', 'HI']
const option1 = {
  ...initOption,
  title: {text: '径流小区年产流产沙量'},
  legend: {data: option_1_data, top: '6%'},
  series: option_1_data.map(item => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })

}
const option2 = {
  ...initOption,
  title: {text: '径流小区逐次产流产沙量'},
  legend: {data: option_2_data, top: '6%'},
  series: option_2_data.map(item => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })
}
const option3 = {
  ...initOption,
  title: {text: '径流小区作物产量'},
  legend: {data: option_3_data, top: '6%'},
  series: option_3_data.map(item => {
    return {name: item, type: 'bar', barGap: 5, emphasis: {focus: 'series'}, large: true}
  })
}

export {option1, option2,option3}
