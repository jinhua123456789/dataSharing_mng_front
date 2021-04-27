import request from '@/utils/request'

export function deleteTemplate(id) {
  return request({
    url: 'bsd-import/deleteTemplate?id='+id,
    method: 'get',
  })
}

export function downloadTemplate(id) {
  return request({
    url: 'bsd-import/downloadTemplate?id='+id,
    method: 'get',
    responseType: 'blob'// 表明返回服务器返回的数据类型
  })
}

export function selectAllTemplate(data) {
  return request({
    url: 'bsd-import/selectAllTemplate?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
  })
}
