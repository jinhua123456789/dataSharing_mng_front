import request from '@/utils/request'

//对单条记录进行审核

//拒绝
export function refuseRecord(query) {
  return request({
    url: 'bsd-import/single_import/check_fail',
    method: 'get',
    params: query
  })
}

//通过
export function passRecord(query) {
  return request({
    url: 'bsd-import/single_import/check_success',
    method: 'get',
    params: query
  })
}

