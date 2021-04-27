import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'bsd-import/regulation/list',
    method: 'get',
    params: query
  })
}

export function updateStatus(id) {
  return request({
    url: 'bsd-import/regulation/updateStatus?recordId='+id,
    method: 'get'
  })
}

export function deleteReg(id) {
  return request({
    url: 'bsd-import/regulation/deleteExcel?recordId='+id,
    method: 'get'
  })
}

export function fetchNoRegList() {
  return request({
    url: 'bsd-import/common/notRegulationTable',
    method: 'get',
  })
}

export function getTableDetail(id) {
  return request({
    url: 'bsd-import/common/tableFied?recordId='+id,
    method: 'get',
  })
}

export function getRegDetail(type){
  return request({
    url: 'bsd-import/regulation/selectRegulationByType?regulationType='+type,
    method: 'get'
  })
}

export function commit(list){
  return request({
    url: 'bsd-import/regulation/insertRegulationList',
    method: 'post',
    headers:{
      "Content-Type":"application/json;charset=utf-8"
    },
    data:list
  })
}

export function regDetail(id){
  return request({
    url: 'bsd-import/regulation/detail?recordId='+id,
    method: 'get'
  })
}