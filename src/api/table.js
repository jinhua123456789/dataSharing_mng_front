import request from '@/utils/request'

export function fetchTableList(query) {
  return request({
    url: 'bsd-import/common/table',
    method: 'get'
  })
}
