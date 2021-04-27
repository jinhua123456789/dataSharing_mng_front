import request from '@/utils/requestReport'


//1、日降雨量 2、降雨过程 3、月降雨 4、次降雨 5、年降雨

export function getRainData(url, params) {
  return request({
    url: `/bsd-data-analysis/newApi/rain/${url}`,
    method: 'get',
    params
  })
}

//小流域
export function getWaterInfo(url, params) {
  return request({
    url: `/bsd-data-analysis/newApi/xiaoliuyuJingliuNisha/${url}`,
    method: 'get',
    params
  })
}

//径流小区
export function getRunOffInfo(url, params) {
  return request({
    url: `/bsd-data-analysis/newApi/JingliuxiaoquNisha/${url}`,
    method: 'get',
    params
  })
}//土壤水分
export function getSoilInfo(url, params) {
  return request({
    url: `/bsd-data-analysis/newApi/soil/${url}`,
    method: 'get',
    params
  })
}

/**
 * @param type rainfall:雨量站  径流小区:runoff 小流域:watershed soil:
 */
export function getInfo(type) {
  return request({
    url: `/bsd-data-analysis/analysis/station/ids?type=${type}`,
    method: 'get',
  })
}


