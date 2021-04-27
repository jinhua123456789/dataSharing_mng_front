import request from '@/utils/request'
export function getAccrRunoff(listQuery) {
    return request({
      url: `bsd-data-analysis/analysis/runoff/accrunoff`, 
      method: 'get',
      params: {
        "type":listQuery.kind,
        "startDate":listQuery.startDate,
        "endDate":listQuery.endDate
      }
    })
}
export function getRunOffDayly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/runoff/daily`, 
    method: 'get',
    params:{
      "month":listQuery.month,
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
    
  })
}
export function getRunoffAndSand(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/runoff/depthAndSilt`, 
    method: 'get',
    params:{
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
  })
}

export function getRunoffMonthly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/runoff/monthly`, 
    method: 'get',
    params:{
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
    
  })
}
export function getRunoffYearly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/runoff/yearly`, 
    params: {
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "startYear":listQuery.startYear,
      "endYear":listQuery.endYear
    }
  })
}
export function searchRunoff(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/runoff/search`, 
    params:{
      "endDate":listQuery.endDate,
      "startDate":listQuery.startDate,
      "pageNum":listQuery.pageNum,
      "pageSize":listQuery.pageSize,
      "type":listQuery.kind,
      "stationId":listQuery.stationId
    }
  })
}
  