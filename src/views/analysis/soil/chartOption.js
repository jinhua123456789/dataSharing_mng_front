const initOption = {
  tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
  yAxis: [{type: 'value'}],
  dataZoom: [{type: 'slider'}, {type: 'inside'}],
  grid: {bottom: 80},
  xAxis: {type: 'category', axisTick: {show: false}, data: []},
}

const option1 = {
  ...initOption,
  title: {text: '土壤水分'},}


export {option1}
