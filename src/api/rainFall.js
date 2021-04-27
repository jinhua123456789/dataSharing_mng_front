import request from '@/utils/request'
export function getAccrRainFall(listQuery) {
    return request({
      url: `bsd-data-analysis/analysis/rainfall/accurainfall`,
      method: 'get',
      params: {
        "type":listQuery.kind,
        "startDate":listQuery.startDate,
        "endDate":listQuery.endDate
      }
    })
}
export function getRainFallDayly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/daily`,
    method: 'get',
    params:{
      "month":listQuery.month,
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }

  })
}
export function getRainFallDaylyCi(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/eachtime`, 
    method: 'get',
    params:{
      "month":listQuery.month,
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
    
  })
}
export function getRainErosivity(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/erosivity`,
    method: 'get',
    params:{
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
  })
}

export function getRainMonthly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/monthly`,
    method: 'get',
    params:{
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }

  })
}
export function getRainMonthlyCi(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/monthlyTimes`, 
    method: 'get',
    params:{
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
    
  })
}
export function getRainYearly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/yearly`,
    params: {
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "startYear":listQuery.startYear,
      "endYear":listQuery.endYear
    }
  })
}
export function getRainYearlyCi(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/yearlyTimes`, 
    params: {
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "startYear":listQuery.startYear,
      "endYear":listQuery.endYear
    }
  })
}
export function search(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/rainfall/search`,
    params:{
      "endDate":listQuery.endDate,
      "startDate":listQuery.startDate,
      "pageNum":listQuery.pageNum,
      "pageSize":listQuery.pageSize,
      "type":listQuery.kind,
      "searchType":listQuery.searchType,
      "stationId":listQuery.stationId
    }
  })
}

export function stationId(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/station/ids`,
    params:{
      "type":listQuery.kind
    }
  })
}
