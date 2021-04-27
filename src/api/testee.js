import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'pcs-org/testee/list',
    method: 'get',
    params: query
  })
}

export function fetchByName(name) {
  return request({
    url: 'pcs-org/testee/findByName',
    method: 'get',
    params: name
  })
}

export function createTestee(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-org/testee',
    method: 'post',
    data
  })
}

export function updateTestee(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-org/testee',
    method: 'put',
    data
  })
}


export function addObj(obj) {
  return request({
    url: 'pcs-org/testee/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'pcs-org/testee/getById',
    method: 'get',
    params: {id}
  })
}

export function delObj(id) {
  return request({
    url: 'pcs-org/testee/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: 'pcs-org/testee',
    method: 'put',
    data: obj
  })
}



export function fetchTestee(id) {
  return request({
    //url: 'pcs-system/user/findByName',
    url: 'pcs-org/testee',
    method: 'get',
    params: { id }
  })
}
  export function fetchPv(pv) {
    return request({
      url: 'pcs-org/user/pv',
      method: 'get',
      params: { pv }
    })
  }


