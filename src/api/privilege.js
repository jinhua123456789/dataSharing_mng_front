import request from '@/utils/request'

export function fetchTree() {
  return request({
    url: 'pcs-system/privilege/getTree',
    method: 'get',
    //params: query
  })
}

export function addObj(obj) {
  return request({
    url: 'pcs-system/privilege',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'pcs-system/privilege',
    method: 'get',
    params: {id}
  })
}

export function delObj(id) {
  return request({
    url: 'pcs-system/privilege/',
    method: 'delete',
    params: {id}
  })
}

export function putObj(obj) {
  return request({
    url: 'pcs-system/privilege',
    method: 'post',
    data: obj
  })
}
