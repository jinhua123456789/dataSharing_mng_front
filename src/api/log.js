import request from '@/utils/request'

//列表查询展示
export function fetchList(page,size,user,ip,startTime,endTime,module) {
  return request({
    url: 'pcs-system/log/page',
    method: 'get',
    params: {page,size,user,ip,startTime,endTime,module}
  })
}
