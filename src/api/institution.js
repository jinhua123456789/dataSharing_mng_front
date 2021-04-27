import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'pcs-system/org/list',
    method: 'get',
    params: query
  })
}

export function orgList() {
  return request({
    url: 'pcs-system/org/orgList',
    method: 'get',
    // params: query
  })
}

export function fetchByName(name) {
  return request({
    url: 'pcs-system/org/findByName',
    method: 'get',
    params: name
  })
}
export function fetchDeptTree(query) {
  return request({
    url: 'pcs-system/org/user-tree',
    method: 'get',
    params: query
  })
}

export function fetchTree(query) {
  return request({
    url: 'pcs-system/org/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: 'pcs-system/org',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/org/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/org/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: 'pcs-system/org/update',
    method: 'post',
    data: obj
  })
}

export function verifyOrg(id) {
  return request({
    url: 'pcs-system/org/verify',
    method: 'get',
    params: {id}
  })
}

export function stopService(id) {
  return request({
    url: 'pcs-system/org',
    method: 'post',
    params: {id}
  })
}

export function enableService(id) {
  return request({
    url: 'pcs-system/org/enableService',
    method: 'get',
    params: {id}
  })
}

export function getImgUrl(logoKey) {
  return request({
    url: 'pcs-system/org/getImgUrl',
    method: 'get',
    params: {logoKey}
  })
}



export function getDetails(dictName) {
  return request({
    url: '/pcs-dict/dict/getDetails',
    method: 'get',
    params: {dictName}
  })
}