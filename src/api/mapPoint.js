import request from '@/utils/request'
export function getAllMapPoint(url) {
  return request({
    url: url,
    method: 'get'
  })
}
