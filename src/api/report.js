import request from '@/utils/requestReport'

/**
 * @param type rainfall:雨量站  径流小区:runoff 小流域:watershed 植被覆盖度的测点:soil
 * 雨量站信息,径流小区,所有面源污染测量点编号,所有测点编号,所有风蚀测量点编号,所有小流域id,所有小流域控制站
 */
export function getInfo(param, index) {
  return request({
    url: index == 3 ? `/bsd-data-analysis/analysis/station/ids?type=${param}` : `/bsd-data-analysis/getData/${param}`,
    method: 'get',
  })
}


//整编表
export function getReport(url, params) {
  return request({
    url: `/bsd-data-analysis/getData/${url}`,
    method: 'get',
    params
  })
}

//整编表
export function getStation() {
  return request({
    url: '/bsd-data-analysis/getData/station_info',
    method: 'get',
  })
}

export function getDrainageBasin() {
  return request({
    url: '/bsd-data-analysis/getData/xiaoliuyu_id',
    method: 'get',
  })
}

export function getControl() {
  return request({
    url: '/bsd-data-analysis/getData/xiaoliuyukongzhizhan_id',
    method: 'get',
  })
}

