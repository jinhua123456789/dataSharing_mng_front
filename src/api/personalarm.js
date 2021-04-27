import request from '@/utils/request'

export function getPlanList(query) {
  return request({
    url: 'pcs-evaluation/personalarm/list',
    method: 'get',
    params: query
  })
}

export function getPersonAlarmList(planid) {
  return request({
    url: 'pcs-evaluation/personalarm/details',
    method: 'get',
    params: { planid }
  })
}
