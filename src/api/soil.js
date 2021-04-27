import request from '@/utils/request'
export function getAccrSoil(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/soil/accsoil`, 
    method: 'get',
    params: {
      "type":listQuery.kind,
      "startDate":listQuery.startDate,
      "endDate":listQuery.endDate
    }
  })
}
export function getSoilDayly(listQuery) {
return request({
  url: `bsd-data-analysis/analysis/soil/daily`, 
  method: 'get',
  params:{
    "month":listQuery.month,
    "stationId":listQuery.stationId,
    "type":listQuery.kind,
    "year":listQuery.year
  }
  
})
}
export function getSoilMonthly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/soil/monthly`, 
    method: 'get',
    params:{
      "stationId":listQuery.stationId,
      "type":listQuery.kind,
      "year":listQuery.year
    }
    
  })
}
export function getSoilYearly(listQuery) {
  return request({
    url: `bsd-data-analysis/analysis/soil/yearly`, 
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
    url: `bsd-data-analysis/analysis/soil/search`, 
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
  

  