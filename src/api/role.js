import request from '@/utils/request'

export function getRoutes() {
  return request({
    //url: 'pcs-system/role/routes',
    url: 'pcs-system/role/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    // url: 'pcs-system/role/list',
    url: 'pcs-system/role/page',
    method: 'get'
  })
}


export function getRolesById() {
  return request({
    // url: 'pcs-system/role/findById',
    url: 'pcs-system/role/findById',
    method: 'get'
  })
}
export function addRole(data) {
  return request({
    // url: 'pcs-system/role',
    url: 'pcs-system/role',
    method: 'post',
    data
  })
}

// export function updateRole(id, data) {
//   return request({
//     // url: `pcs-system/role/${id}`,
//     url: `pcs-system/role/${id}`,
//     method: 'put',
//     data
//   })
// }
export function updateRole(data) {
  return request({
    // url: `pcs-system/role/${id}`,
    url: `pcs-system/role/`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    // url: `pcs-system/role/${id}`,
    url: `pcs-system/role/`,
    method: 'delete',
    params:{id}
  })
}
