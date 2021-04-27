import request from '@/utils/request'

export function fetchList(query) {
  return request({
    //url: 'pcs-system/user/page',
    url: 'pcs-system/user/page',
    method: 'get',
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

export function createSysuser(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-system/user',
    method: 'post',
    data
  })
}

export function updateSysuser(data) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-system/user/edit',
    method: 'put',
    data
  })
}

export function abandonSysuser(id) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-system/user/abandon',
    method: 'get',
    params: { id }
  })
}

export function enable(id) {
  return request({
    // url: 'pcs-system/user',
    url: 'pcs-system/user/enable',
    method: 'get',
    params: {id}
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
//按钮权限
export function getButtonPermission(data) {
  return request({
    url: 'pcs-system/privilege/buttonPrivileges',
    method: 'get',
    params: data
  })
}


//用户删除
export function deleteUser(username){
  return request({
    url: "/pcs-system/user/del",
    method: 'delete',
    params: {username}
  })
}
