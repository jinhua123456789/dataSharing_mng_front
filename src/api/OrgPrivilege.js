import request from '@/utils/request'

export function fetchTree() {
  return request({
    url: 'pcs-system/orgPrivilege/getTree',
    method: 'get',
    //params: query
  })
}

export function addObj(obj) {
  return request({
    url: 'pcs-system/orgPrivilege',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'pcs-system/orgPrivilege',
    method: 'get',
    params: {id}
  })
}

export function delObj(id) {
  return request({
    url: 'pcs-system/orgPrivilege/',
    method: 'delete',
    params: {id}
  })
}

export function putObj(obj) {
  return request({
    url: 'pcs-system/orgPrivilege',
    method: 'post',
    data: obj
  })
}
