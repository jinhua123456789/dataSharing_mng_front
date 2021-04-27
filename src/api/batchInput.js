import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'bsd-import/importTask/list',
    method: 'get',
    params: query
  })
}

export function fetchListRemove3(query) {
  return request({
    url: 'bsd-import/importTask/listRemove3',
    method: 'get',
    params: query
  })
}


export function deleteExcel(id) {
  return request({
    url: 'bsd-import/importTask/delete?importTaskId='+id,
    method: 'get'
  })
}


export function getExcel(id) {
  return request({
    url: 'bsd-import/downloadExcel?id='+id,
    method: 'get',
    responseType: 'blob'// 表明返回服务器返回的数据类型
  })
}
export function analysisExcel(data) {
  return request({
    url: 'bsd-import/analysisExcel',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getMonitorInfo() {
  return request({
    url: 'bsd-import/common/monitorInfo',
    method: 'get',
  })
}

export function getTemplate(id) {
  return request({
    url: 'bsd-import/downTemplate?record_id='+id,
    method: 'get',
    responseType: 'blob'// 表明返回服务器返回的数据类型
  })
}

export function passFile(importId, reviewUserId){
  return request({
    url: 'bsd-import/review?importId='+importId+'&reviewUserId='+reviewUserId,
    method: 'post'
  })
}
export function unpassFile(form){
  return request({
    url: 'bsd-import/importTask/deny',
    method: 'get',
    params: form
  })
}