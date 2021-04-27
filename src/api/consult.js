import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: 'pcs-system/user/page',
    url: 'pcs-consult/list',
    method: 'put',
    params: query
  })
}

export function fetchSysuser(id) {
  return request({
    //url: 'pcs-system/user/findById',
    url: 'pcs-system/user/findById',
    method: 'get',
    params: { id }
  })
}

export function fetchSysuserByName(name) {
  return request({
    //url: 'pcs-system/user/findByName',
    url: 'pcs-system/user/findByName',
    method: 'get',
    params: { name }
  })
}

export function fetchPv(pv) {
  return request({
    url: 'pcs-system/user/pv',
    method: 'get',
    params: { pv }
  })
}

export function createConsultTeacher(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-consult/addCounselor',
    method: 'post',
    data
  })
}

export function updateConsultTeacher(data) {
  let id = data.counselorEntity.id
  let password = data.counselorEntity.password
  delete data.counselorEntity
  data.id = id
  data.password = password
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-consult/updateCounselor',
    method: 'post',
    data
  })
}

export function abandonSysuser(id) {
  return request({
    url: 'pcs-consult/deleteCounselor',
    method: 'delete',
    params: { counselorId: id }
  })
}

export function enable(id) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-consult/auditSucc',
    method: 'put',
    params: {counselorId: id}
  })
}

export function disable(id) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-consult/auditFail',
    method: 'put',
    params: {counselorId: id}
  })
}

export function resetPassword(id) {
    return request({
      // url: 'pcs-system/user',
      url: 'pcs-system/user/resetPassword',
      method: 'get',
      params: { id }
    })
}


export function modifyPassword(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-system/user/modifyPassword',
    method: 'post',
    data
  })
}
