import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'pcs-evaluation/evaluationresult/result',
    method: 'get',
    params: query
  })
}

export function fetchresult(planid) {
  return request({
    url: 'pcs-evaluation/evaluationresult/details',
    method: 'get',
    params: { planid }
  })
}
