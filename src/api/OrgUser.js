import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'pcs-org/orgUser/page',
    method: 'get',
    params: query
  })
}

export function fetchByName(name) {
  return request({
    url: 'pcs-org/orgUser/findByName',
    method: 'get',
    params: name
  })
}

export function createUser(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-org/orgUser',
    method: 'post',
    data
  })
}

export function updateuser(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-org/orguser',
    method: 'put',
    data
  })
}


export function addObj(obj) {
  return request({
    url: 'pcs-org/orgUser/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'pcs-org/orgUser/getById',
    method: 'get',
    params: {id}
  })
}

export function delObj(id) {
  return request({
    url: 'pcs-org/orgUser/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: 'pcs-org/orgUser',
    method: 'put',
    data: obj
  })
}



export function fetchUser(id) {
  return request({
    //url: 'pcs-system/user/findByName',
    url: 'pcs-org/orgUser',
    method: 'get',
    params: { id }
  })
}
export function fetchPv(pv) {
  return request({
    url: 'pcs-org/orgUser/pv',
    method: 'get',
    params: { pv }
  })
}
