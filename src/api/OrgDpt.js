import request from '@/utils/request'

//获取部门树形结构
export function fetchTree(query) {
  return request({
    url: 'pcs-system/unit/tree',
    method: 'get',
    params: query
  })
}

//获取部门树形结构
export function fetchTreeNoPrivilege(query) {
  return request({
    url: 'pcs-system/unit/getTree',
    method: 'get',
    params: query
  })
}

//添加部门
export function addObj(obj) {
  return request({
    url: 'pcs-system/unit',
    method: 'post',
    data: obj
  })
}
//根据Id获取部门
export function getObj(id) {
  return request({
    url: 'pcs-system/unit/getById',
    method: 'get',
    params: {id}
  })
}
//删除部门
export function delObj(id) {
  return request({
    url: 'pcs-system/unit/?id=' + id,
    method: 'delete'
  })
}

//更新部门
export function putObj(obj) {
  return request({
    url: 'pcs-system/unit',
    method: 'put',
    data: obj
  })
}
